var should = require('should');
var uuid = require('node-uuid');

var target = require('./../geoLogin.js');

describe('geoLogin.loginUser', function(){
	
	it('should successfully login the user and then successfully use the token', function(done){
	var loginToken = null;
	
	target.basicLogin('admin@test.com', 'pwd')
		.then(function (result) {
			should.exist(result);
			result.should.have.property('UserInfo');
			result.should.have.property('LoginToken');
			result.should.have.property('LoginTokenExpiration');
			loginToken = result.LoginToken;
			return target.tokenLogin(loginToken);
		})
		.then(function(result) {
			should.exist(result);
			result.UserInfo.Email.should.equal('admin@test.com');
			return target.logoutUser(result.UserInfo.Id);
		})
		.then(function(result){
			result.should.equal('Successfully logged out.');
			return target.tokenLogin(loginToken);
		})
		.then(function(result) {
			done(result);
		})
		.otherwise(function(error) {
			error.should.equal('Bad Login Token');
			done();
		});
	});

	it('should fail to login the user with bad login', function(done){
		target.basicLogin('badLogin', 'pwd')
		.then(function (result) {
			done(new Error('user login should fail'));
		})
		.otherwise(function(error) {
			error = error === 'Incorrect UserName or Password' ? null : error;
			done(error);
		});
	});

	it('should fail to login the user with bad password', function(done){
		target.basicLogin('admin@test.com', 'badPassword')
		.then(function (result) {
			done(new Error('user login should fail'));
		})
		.otherwise(function(error) {
			error = error === 'Incorrect UserName or Password' ? null : error;
			done(error);
		});
	});
	
	it('should create a new unlicensed user then activate then deactivate them', function(done){
		var testId = uuid.v4();
		
		var newUserInfo = {
				FirstName:			'Test',
				LastName:				testId,
				Email:					testId + '@test.com',
				HomePort:				{ 
					MercatorLat:		47.61,
					MercatorLon:		-122.2,
				},
				BoatSize:				5,
		};
		
		target.registerNewUser(newUserInfo)
		.then(function(result){
			result.should.be.ok;
			result.Id.should.be.ok;
			(result.Email === newUserInfo.Email).should.be.true;
			newUserInfo.Id = result.Id;
			
			return target.activateNewUser(result.Uid, 'pwd', 2);
		})
		.then(function(result){
			result.should.be.ok;
			return target.basicLogin(result.Login, 'pwd');
		})
		.then(function(result){
			result.UserInfo.should.be.ok;
			return target.deactivateUser(result.UserInfo.Login);
		})
		.then(function(result){
			result.should.be.ok;
			return target.basicLogin(result.Login, 'pwd')
			.otherwise(function(error){
				error.should.equal('Incorrect UserName or Password');
				return error;
			});
		})
		.then(function(result){
			console.log(result);
			result.should.equal('Incorrect UserName or Password');
			done();
		})
		.otherwise(done);
	});

	it('should send a password reset email', function(done){
		target.requestPasswordReset('kburkett@smartmine.com')
		.then(function (result) {
			console.log(result);
			done();
		})
		.otherwise(function(error) {
			done(error);
		});
	});
	
	it('should reset a password', function(done){
		target.basicLogin('kburkett@smartmine.com', 'pwd')
		.then(function (result) {
			console.log(result);
			return target.saveUserPassword(result.UserInfo.Uid, 'pwd2');
		})
		.then(function (result) {
			console.log(result);
			return target.basicLogin('kburkett@smartmine.com', 'pwd2');
		})
		.then(function (result) {
			console.log(result);
			return target.saveUserPassword(result.UserInfo.Uid, 'pwd');
		})
		.then(function (result) {
			console.log(result);
			return target.basicLogin('kburkett@smartmine.com', 'pwd');
		})
		.then(function (result) {
			console.log(result);
			done();
		})
		.otherwise(function(error) {
			console.log(result);
			done(error);
		});
	});

	it('should not register a second user with the same email address', function(done){
		var testId = uuid.v4();
		
		var newUserInfo = {
				FirstName:			'Test',
				LastName:				testId,
				Email:					testId + '@test.com',
				HomePort:				{ 
					MercatorLat:		47.61,
					MercatorLon:		-122.2,
				},
				BoatSize:				5,
		};
		
		target.registerNewUser(newUserInfo)
		.then(function(result){
			result.should.be.ok;
			result.Id.should.be.ok;
			newUserInfo.Id = result.Id;
			
			return target.registerNewUser(newUserInfo);
		})
		.then(function(result){
			done(result);
		})
		.otherwise(function(error){
			error.should.equal('a contact with this email address already exists');
			done();
		});
	});
	
});

	

