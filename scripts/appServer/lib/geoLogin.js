var when = require('when');
var moment = require('moment');
var uuid = require('node-uuid');
var _ = require('lodash');
var ph = require('password-hash');

var geoAppConfig = require('./geoAppConfig.js');
var dataAccess = require('./models/geoLoginModels.js');
var geoLogger = require('./geoLogger.js');
var geoLoginWorkflow = require('./workflow/geoLoginWorkflow.js');
var geoEmailer = require('./geoEmailer.js');

// mapping from bookshelf models to structures we want to expose
var buildUserInfo = function (geoCustomerUserView) {
	return {
		Id							: geoCustomerUserView.Id,
		UserLoginId			: geoCustomerUserView.UserLoginId,
		Uid						: geoCustomerUserView.Uid,
		FirstName				: geoCustomerUserView.FirstName,
		LastName				: geoCustomerUserView.LastName,
		FullName				: geoCustomerUserView.FirstName + ' ' + geoCustomerUserView.LastName,
		Login					: geoCustomerUserView.Login,
		Email					: geoCustomerUserView.Email,
		PhoneNumber		: geoCustomerUserView.PhoneNumber,
		Status					: geoCustomerUserView.Status,
	};
};

// create a new login token that expires in 20 minutes
// we need to decide on a truncation strategy for this table - we *could* track cool session data with this
var createLoginToken = function(userLoginId) {
	return dataAccess.saveLoginToken({
		user_login_id: userLoginId,
		expiration_date: moment().add('m', 20).format(),
		token: uuid.v4()
	});
};

var renewLoginToken = function(token) {
	return dataAccess.getLoginTokenForToken(token)
	.then(function(loginToken){
		loginToken.expirationDate = moment().add('m', 20).format();
		return dataAccess.saveLoginToken(loginToken);
	});
};

var doExpireExistingLoginTokens = function(userLoginId) {
	var deferreds = [];
	
	return dataAccess.getCustomerUserActiveLoginTokens(userLoginId)
	.then(function (loginTokens){
		_.each(loginTokens, function (loginToken){
			deferreds.push(dataAccess.deleteLoginTokenById(loginToken.Id));
		});
	}).then(function(){
		return when.all(deferreds);
	});
	
};

var hashPassword = function(password) {
	return ph.generate(password, {
			algorithm:		'sha256',
			saltLength:	24, 
			iterations:		1000
		});
};

var verifyPassword = function(password, hashedPassword){
	var result = ph.verify(password, hashedPassword);
return result;
};

// the login method
exports.basicLogin = function (username, password) {
	var d = when.defer();
	dataAccess.getCustomerUserViewForLogin(username)
	.then (function (userInfo) {
		if (userInfo != null 
			&& userInfo.LicenseStatus === 'ACTIVE' 
			&& verifyPassword(password, userInfo.HashedPassword)) {
			return {
				UserInfo: buildUserInfo(userInfo)
			};
		}
		else {
			throw 'Incorrect UserName or Password';
		}
	})
	.then(function(authenticatedUser){
		return doExpireExistingLoginTokens(authenticatedUser.UserInfo.UserLoginId)
		.then(function(result){
			return authenticatedUser;
		});
	})
	.then(function (authenticatedUser) {
		return createLoginToken(authenticatedUser.UserInfo.UserLoginId)
		.then(function(loginToken){
			authenticatedUser.LoginToken = loginToken.Token;
			authenticatedUser.LoginTokenExpiration = loginToken.ExpirationDate;
			return authenticatedUser;
		});
	})
	.then(function (authenticatedUser) {
		geoLogger.logMessage('Low', 'geoLogin', 'loginUser', 'Successful login: ' + username)
		d.resolve(authenticatedUser);
	})
	.otherwise (function(error){
		geoLogger.logError('geoLogin', 'loginUser', error)
		d.reject(error);
	});
	return d.promise;
};

exports.tokenLogin = function(token) {
	var d = when.defer();
	dataAccess.getActiveToken(token)
		.then (function (dbToken) {
		if (dbToken !== undefined) {
				return dataAccess.getCustomerUserViewForLogin(dbToken.Login);
			}
			else {
				d.reject('Bad Login Token');
			}
		})
		.then(function(userInfo){
		if (userInfo !== undefined) {
				return {
					UserInfo: buildUserInfo(userInfo)
				};
			}
			else {
				d.reject('Bad Login Token');
			}
		})
		.then (function(result){
			when(geoLogger.logMessage('Low', 'geoLogin', 'loginWithToken', 'Successful Token login: ' + token))
			.then(d.resolve(result));
		})
		.otherwise (function(error){
			geoLogger.logError('geoLogin', 'loginWithToken', error)
			d.reject(error);
		});
	return d.promise;
};

exports.logoutUser = function(userId){
	return doExpireExistingLoginTokens(userId)
	.then(function(result){
		return 'Successfully logged out.';
	});
};

exports.getCustomerUserViewForUid = function(uid){
	return dataAccess.getCustomerUserViewForUid(uid);
};

var getDefaultOrganization = function(){
	var d = when.defer();
	var defaultOrganizationName = 'Public';
	
	dataAccess.getOrganizationByName(defaultOrganizationName)
	.then(function(defaultOrganization){
		if (defaultOrganization !== undefined) {
			d.resolve(defaultOrganization);
		} else {
			dataAccess.saveOrganization({
				Name:			defaultOrganizationName,
				Uid:				uuid.v4(),
			})
			.then(function(defaultOrganization){
				d.resolve(defaultOrganization);
			});
		};
	});
	
	return d.promise;
};

exports.registerNewUser = function(newUserInfo){
	var d = when.defer();
	
	dataAccess.getContactByEmail(newUserInfo.Email)
	.then (function (contact) {
		if (contact !== undefined) {
			d.reject('a contact with this email address already exists');
		} else {
			var retval = null;
			return getDefaultOrganization()
			.then(function(defaultOrganization){
				return dataAccess.saveContact({
					FirstName:		newUserInfo.FirstName,
					LastName:			newUserInfo.LastName,
					Uid:					uuid.v4(),
					Email:				newUserInfo.Email,
					PhoneNumber:	newUserInfo.PhoneNumber,
					OrganizationId:	defaultOrganization.Id,
					JsonAttributes:	{
						ApplicationObjects:	newUserInfo.ApplicationObjects,
					},
				});
			})
			.then(function(newContact){
				retval = newContact
				return geoLoginWorkflow.requestNewAccountEmail(newContact);
			})
			.then(function(result){
				d.resolve(retval);
			})
			.otherwise(function(error){
				d.reject(error);
			});
		};
	});
	return d.promise;
};

exports.activateNewUser = function(newUserUid, password, licenseTypeId){
	var d = when.defer();
	
	dataAccess.getContactByUid(newUserUid)
	.then (function (contact) {
		if (contact === undefined) {
			d.reject('no contact exists: ' + newUserUid);
		} else {
			dataAccess.getCustomerUserViewForLogin(contact.Email)
			.then(function(customerUserView){
				if (customerUserView !== undefined) {
					d.resolve(customerUserView);
				} else {
					var deferreds = [];
					deferreds.push(dataAccess.saveUserLogin({
						Login:						contact.Email,
						HashedPassword:		hashPassword(password),
						ContactId:					contact.Id,
					}));
					deferreds.push(dataAccess.saveLicense({
						ContactId:					contact.Id,
						LicenseTypeId:				licenseTypeId,
						OrganizationId:				contact.OrganizationId,
						Status:							'ACTIVE',
					}));
					return when.all(deferreds);
				};
			})
			.then(function(result){
				d.resolve(dataAccess.getCustomerUserViewForLogin(contact.Email));
			});
		}
	});
	return d.promise;
		
};

exports.deactivateUser = function(username){
	return dataAccess.getCustomerUserViewForLogin(username)
	.then(function(customerUserView){
		if (customerUserView){
			return dataAccess.saveLicense({
				Id:		customerUserView.LicenseId,
				Status:	'DEACTIVATED',
			});
		} else {
			return 'No active licenses for username: ' + username;
		};
	});
};

// exports.reactivateUser = function(email){
	// return dataAccess.getContactByEmail(email)
	// .then(function(customerUserView){
		// if (customerUserView){
			// return dataAccess.saveLicense({
				// Id:		customerUserView.LicenseId,
				// Status:	'DEACTIVATED',
			// });
		// } else {
			// return 'No active licenses for username: ' + username;
		// };
	// });
// };

exports.requestPasswordReset = function(username){
	return dataAccess.getCustomerUserViewForLogin(username)
	.then(function(customerUserView){
	
		if (customerUserView !== undefined && customerUserView !== null){
			 return geoLoginWorkflow.requestPasswordResetEmail(customerUserView);
		} else {
			return 'Bad username';
		};
	});
};

exports.saveUserPassword = function(userUid, newPassword){
	return dataAccess.getCustomerUserViewForUid(userUid)
	.then(function(customerUserView){
		if (customerUserView === undefined || customerUserView === null) {
			return 'No user: ' + userUid;
		} else {
			return dataAccess.getUserLoginById(customerUserView.UserLoginId)
			.then(function(userLogin){
				userLogin.HashedPassword = hashPassword(newPassword);
				return dataAccess.saveUserLogin(userLogin);
			});
		};
	});
};






