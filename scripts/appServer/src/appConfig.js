var geoAppConfig = require('./../lib/geoAppConfig.js');

geoAppConfig.registerAppConfigMap({
	ApplicationName:		'Smartmine Todo Application',
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
				Todo:			{
					UnitTest:			'GeoCore_UnitTest',	
				},
			},
		},
		Test:	{
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
			DefaultWorkflowQueueName:		'Test',
			GeoEmailerConfig:			{
				SystemEmailAddress:				'noreply@smartmine.com',
				EmailMonitoringMode:				'MonitorOnly',  // 'NoMonitor', 'MonitorOnly', 'MonitorAndRecipient'
				MonitorEmailAddresses:				['stlbucket@gmail.com'],
			},
			databaseNames:	{
				GeoLogin:		{
					Test:			'GeoCore_Test',	
				},
				GeoLogger:		{
					Test:			'GeoCore_Test',	
				},
				GeoEdp:		{
					Test:			'GeoCore_Test',	
				},
				GeoWorkflow:	{
					Test:			'GeoCore_Test',	
				},
				Todo:		{
					Test:			'GeoCore_Test',	
				},
			},
		},
	},
});

exports.setDbMode = function(dbMode){
	return geoAppConfig.setDbMode(dbMode);
};
