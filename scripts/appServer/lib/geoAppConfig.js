var _ = require('lodash');
var util = require('util');

var siteController = require('./controllers/siteController.js');

var _appConfigMap = {
	ApplicationName:		'Smartimine Node Boiler Plate',
	Servers:		{
		UnitTest:	{
			client: 'postgres',
			connection: {
				host     : '54.244.241.130',
				port     : '5432',
				user     : 'postgres',
				password: 'P%ssword39',
				charset  : 'utf8'
			},
			debug: false,
			AwsConfig: { 
				"accessKeyId": "AKIAJTTPVSZFTFULDDCA", 
				"secretAccessKey": "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", 
				"region": "us-west-2" 
			},
			DefaultWorkflowQueueName:		'UnitTest',
			GeoEmailerConfig:			{
				SystemEmailAddress:				'noreply@smartmine.com',
				EmailMonitoringMode:				'MonitorOnly',  // 'NoMonitor', 'MonitorOnly', 'MonitorAndRecipient'
				MonitorEmailAddresses:				['stlbucket@gmail.com'],
			},
			databaseNames:	{
				GeoLogin:			{
					UnitTest:			'GeoCore_UnitTest',	
				},
				GeoLogger:		{
					UnitTest:			'GeoCore_UnitTest',	
				},
				GeoEdp:		{
					UnitTest:			'GeoCore_UnitTest',	
				},
				GeoWorkflow:	{
					UnitTest:			'GeoCore_UnitTest',	
				},
			},
		},
	},
	Packages: {
		// these will be filled in when route maps are registered
	}
};

var _dbMode = 'UnitTest';

exports.reportAppConfigMap = function(){
	console.log('==========AppConfigMap===========');
	console.log(util.inspect(_appConfigMap, false, null));
	console.log('=======End AppConfigMap===========');
};

exports.setDbMode = function(dbMode){
	_dbMode = dbMode;
	console.log('*******  DbMode Set To:  ' + dbMode + ' **********');
};

exports.registerAppConfigMap = function(appConfigMap){
	_.forOwn(appConfigMap, function(sectionInfo, sectionKey){
		_appConfigMap[sectionKey] = sectionKey !== 'Servers' ? 
														appConfigMap[sectionKey] : 
														_appConfigMap[sectionKey];
	});
	
	_.forOwn(appConfigMap.Servers, function(serverInfo, serverName){
		_appConfigMap.Servers[serverName] = _appConfigMap.Servers[serverName] || {};
		
		_.forOwn(serverInfo, function(sectionInfo, sectionName){
			_appConfigMap.Servers[serverName][sectionName] = serverInfo[sectionName];
		});
	});
		
	return _appConfigMap;
};

exports.registerAppRouteMap = function(routeMap){

console.log('registerAppRouteMap');
console.log(routeMap);

	_.forOwn(routeMap, function(packageRouteMap, packageName){
		_appConfigMap.Packages[packageName] = packageRouteMap;
	});
	
	return _appConfigMap;
};

exports.buildDbConfig = function(packageName) {

	var retval = _appConfigMap.Servers[_dbMode];
	retval.connection.database = _appConfigMap.Servers[_dbMode].databaseNames[packageName][_dbMode];
console.log(packageName);
console.log(_dbMode);
console.log(retval);
	return retval;
};

exports.getAppRouteMap = function(){
	var retval = {};
	_.forOwn(_appConfigMap.Packages, function(pkg, pkgName){
		if (pkg.AppRouteMap !== undefined){
			retval[pkgName] = pkg.AppRouteMap;
		}
	});
	retval['Default'] = [{
		Type:					'get',
		Url:						'/.*',
		Handler:				siteController.loadsite
		//Auth:					'token'
	}];
	return retval;
};

exports.AwsConfig = function() {
	return _appConfigMap.Servers[_dbMode].AwsConfig;
};

exports.DefaultWorkflowQueueName = function() {
	return _appConfigMap.Servers[_dbMode].DefaultWorkflowQueueName || 'Default';
};

exports.GeoEmailerConfig = function() {
	return _appConfigMap.Servers[_dbMode].GeoEmailerConfig;
};

exports.serverInfo = function() {
	return {
		BaseUrl:	global.server !== undefined ? global.server.url : 'http://localhost:1337',
	};
};


