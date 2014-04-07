var when = require('when');

var geoLogin = require('./../geoLogin.js');
var geoController = require('./geoController.js');

geoController.createController({
	Name:		'geoLoginController',
	Exports:	exports,
	Methods:	{
		logoutUser:	function(req){
			return geoLogin.logoutUser(req.user.UserInfo.Id);
		},
		registerNewUser:	function(req){
			return geoLogin.registerNewUser(req.params);
		},
		activateNewUser:	function(req){
			return geoLogin.activateNewUser(req.params.Uid, req.params.Password, 2);
		},
		requestPasswordReset:	function(req){
			return geoLogin.requestPasswordReset(req.params.Username);
		},
		saveUserPassword:	function(req){
			return geoLogin.saveUserPassword(req.params.Uid, req.params.Password);
		},
		deactivateUser:	function(req){
			return geoLogin.deactivateUser(req.params.Username);
		},
		currentUserInfo:	function(req){
			return req.user;
		},
	},
});
		
exports.registerAppRouteMap = function(registrar) {
	return registrar({
		GeoLogin:	{
			AppRouteMap:		[
				{
					Type:					'post',
					Url:						'/loginUser',
					Handler:				exports.currentUserInfo,
					Auth:					'basic',
				},
				{
					Type:					'post',
					Url:						'/currentUserInfo',
					Handler:				exports.currentUserInfo,
					Auth:					'token'
				},
				{
					Type:					'post',
					Url:						'/logoutUser',
					Handler:				exports.logoutUser,
					Auth:					'token'
				},
				{
					Type:					'post',
					Url:						'/requestPasswordReset',
					Handler:				exports.requestPasswordReset,
					//Auth:					'token'
				},
				{
					Type:					'post',
					Url:						'/saveUserPassword',
					Handler:				exports.saveUserPassword,
					//Auth:					'token'
				},
				{
					Type:					'post',
					Url:						'/registerNewUser',
					Handler:				exports.registerNewUser,
					//Auth:					'token'
				},
				{
					Type:					'post',
					Url:						'/activateNewUser',
					Handler:				exports.activateNewUser,
					//Auth:					'token'
				},
				{
					Type:					'post',
					Url:						'/deactivateUser',
					Handler:				exports.deactivateUser,
					//Auth:					'token'
				},
			]
		}
	});
};