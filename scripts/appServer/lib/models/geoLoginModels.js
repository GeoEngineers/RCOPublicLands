var moment = require('moment');

// geo references
var geoAppConfig = require('./../../lib/geoAppConfig.js');
var geoBookshelfEntityManager = require('./../../lib/geoBookshelfEntityManager.js');

var dbConfig = geoAppConfig.buildDbConfig('GeoLogin');

var entityManagers =	geoBookshelfEntityManager.CreateEntityManagerSet({
	DbConfig:			dbConfig,
	Exports:			exports,
	SchemaName: 	'geo_login',
	EntityInfos: 		{
		LoginToken:				{
			TableName:		'login_token',
		},
		UserLogin:					{
			TableName:		'user_login',
		},
		Location:					{
			TableName:		'location',
		},
		Contact:					{
			TableName:		'contact',
		},
		Application:					{
			TableName:		'application',
		},
		Organization:					{
			TableName:		'organization',
		},
		License:					{
			TableName:		'license',
		},
		LicenseType:					{
			TableName:		'license_type',
		},
		CustomerUserView:					{
			TableName:		'customer_user_view',
		},
		UserLoginTokenView: {
			TableName:		'user_login_token_view',
		},
		ContactView:					{
			TableName:		'contact_view',
		},
	},
});

	
exports.getCustomerUserViewForLogin = function(login){
	return entityManagers.CustomerUserView.EntityQuery()
	.where('login', '=', login)
	.execute()
	.then(function(resultSet){
		return resultSet === null ? null : resultSet[0];
	});
};

exports.getCustomerUserViewForUid = function(uid){
	return entityManagers.CustomerUserView.EntityQuery()
	.where('uid', '=', uid)
	.execute()
	.then(function(resultSet){
		return resultSet === null ? null : resultSet[0];
	});
};

exports.getCustomerUserActiveLoginTokens = function(userId){
	return entityManagers.UserLoginTokenView.EntityQuery()
	.where('user_id', '=', userId)
	//.andWhere('expiration_date', '>', moment().format())
	.execute();
};

exports.getActiveToken = function(token) {
	return entityManagers.UserLoginTokenView.EntityQuery()
	.where('token', '=', token)
	.execute()
	.then(function(resultSet){
		return resultSet === null ? null : resultSet[0];
	});
};

exports.getOrganizationByName = function(name) {
	return entityManagers.Organization.EntityQuery()
	.where('name', '=', name)
	.execute()
	.then(function(resultSet){
		return resultSet === null ? null : resultSet[0];
	});
};

exports.getContactByEmail = function(email) {
	return entityManagers.Contact.EntityQuery()
	.where('email', '=', email)
	.execute()
	.then(function(resultSet){
		return resultSet === null ? null : resultSet[0];
	});
};

exports.getContactByUid = function(uid) {
	return entityManagers.Contact.EntityQuery()
	.where('uid', '=', uid)
	.execute()
	.then(function(resultSet){
		return resultSet === null ? null : resultSet[0];
	});
};

exports.getLoginTokenForToken = function(token) {
	return entityManagers.LoginToken.EntityQuery()
	.where('token', '=', uid)
	.execute()
	.then(function(resultSet){
		return resultSet === null ? null : resultSet[0];
	});
};