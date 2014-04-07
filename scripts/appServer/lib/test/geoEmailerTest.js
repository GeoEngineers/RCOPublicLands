var should = require('should');
var uuid = require('node-uuid');

var geoAppConfig = require('./../geoAppConfig.js');
var target = require('./../geoEmailer.js');

describe.skip('geoEmailer', function(){
	var testId = uuid.v4();
	
	target.registerEmailTemplateBundle({
		EmailType:					'UnitTestEmail',
		SubjectTemplate:			'Unit Test Email: {{TestId}}',
		BodyTextTemplate:		'Unit Test Email: {{TestId}}',
		BodyHtmlTemplate:		'<h1>HTML HEADER</h1><p>Unit Test Email: {{TestId}}</p>',
	});
	
	target.registerEmailTemplateBundle({
		EmailType:					'UnitTestEmailHtmlOnly',
		SubjectTemplate:			'Unit Test Email: {{TestId}}',
		BodyHtmlTemplate:		'<h1>HTML HEADER</h1><p>Unit Test Email: {{TestId}}</p>',
	});
	
	target.registerEmailTemplateBundle({
		EmailType:					'UnitTestEmailTextOnly',
		SubjectTemplate:			'Unit Test Email: {{TestId}}',
		BodyTextTemplate:		'Unit Test Email: {{TestId}}',
	});
	
	target.registerEmailTemplateBundle({
		EmailType:					'UnitTestEmailNoBody',
		SubjectTemplate:			'Unit Test Email: {{TestId}}',
	});
	
	target.registerEmailTemplateBundle({
		EmailType:					'UnitTestEmailNoSubject',
		BodyTextTemplate:		'Unit Test Email: {{TestId}}',
	});
	
	it('should properly send a unit test email to only the recipient', function(done){
		geoAppConfig.registerAppConfigMap({
			Servers:		{
				UnitTest:	{
					GeoEmailerConfig:			{
						SystemEmailAddress:				'noreply@smartmine.com',
						EmailMonitoringMode:				'NoMonitor',  // 'NoMonitor', 'MonitorOnly', 'MonitorAndRecipient'
						MonitorEmailAddresses:				['stlbucket@yahoo.com'],
					},
				},
			}
		});

		target.buildAndSendEmail('UnitTestEmail', [ 'stlbucket@gmail.com' ], {
			TestId:				testId,
		})
		.then(function(result){
			console.log(result);
			done();
		});
	});
	
	it('should properly send a unit test email to only the monitor', function(done){
		geoAppConfig.registerAppConfigMap({
			Servers:		{
				UnitTest:	{
					GeoEmailerConfig:			{
						SystemEmailAddress:				'noreply@smartmine.com',
						EmailMonitoringMode:				'MonitorOnly',  // 'NoMonitor', 'MonitorOnly', 'MonitorAndRecipient'
						MonitorEmailAddresses:				['stlbucket@yahoo.com'],
					},
				},
			},
		})
	
		target.buildAndSendEmail('UnitTestEmail', [ 'stlbucket@gmail.com' ], {
			TestId:				testId,
		})
		.then(function(result){
			console.log(result);
			done();
		});
	});

	it('should properly send a unit test email to the monitor and recipient', function(done){
		geoAppConfig.registerAppConfigMap({
			Servers:		{
				UnitTest:	{
					GeoEmailerConfig:			{
						SystemEmailAddress:				'noreply@smartmine.com',
						EmailMonitoringMode:				'MonitorAndRecipient',  // 'NoMonitor', 'MonitorOnly', 'MonitorAndRecipient'
						MonitorEmailAddresses:				['stlbucket@yahoo.com'],
					},
				},
			},
		})
	
		target.buildAndSendEmail('UnitTestEmail', [ 'stlbucket@gmail.com' ], {
			TestId:				testId,
		})
		.then(function(result){
			console.log(result);
			done();
		});
	});
	
	it('should properly send a unit test email html only to only the recipient', function(done){
		geoAppConfig.registerAppConfigMap({
			Servers:		{
				UnitTest:	{
					GeoEmailerConfig:			{
						SystemEmailAddress:				'noreply@smartmine.com',
						EmailMonitoringMode:				'NoMonitor',  // 'NoMonitor', 'MonitorOnly', 'MonitorAndRecipient'
						MonitorEmailAddresses:				['stlbucket@yahoo.com'],
					},
				},
			}
		});

		target.buildAndSendEmail('UnitTestEmailHtmlOnly', [ 'stlbucket@gmail.com' ], {
			TestId:				testId,
		})
		.then(function(result){
			console.log(result);
			done();
		});
	});

	it('should properly send a unit test email text only to only the recipient', function(done){
		geoAppConfig.registerAppConfigMap({
			Servers:		{
				UnitTest:	{
					GeoEmailerConfig:			{
						SystemEmailAddress:				'noreply@smartmine.com',
						EmailMonitoringMode:				'NoMonitor',  // 'NoMonitor', 'MonitorOnly', 'MonitorAndRecipient'
						MonitorEmailAddresses:				['stlbucket@yahoo.com'],
					},
				},
			}
		});

		target.buildAndSendEmail('UnitTestEmailTextOnly', [ 'stlbucket@gmail.com' ], {
			TestId:				testId,
		})
		.then(function(result){
			console.log(result);
			done();
		})
		.otherwise(done);
	});

	it('should fail to send a unit test no body to only the recipient', function(done){
		geoAppConfig.registerAppConfigMap({
			Servers:		{
				UnitTest:	{
					GeoEmailerConfig:			{
						SystemEmailAddress:				'noreply@smartmine.com',
						EmailMonitoringMode:				'NoMonitor',  // 'NoMonitor', 'MonitorOnly', 'MonitorAndRecipient'
						MonitorEmailAddresses:				['stlbucket@yahoo.com'],
					},
				},
			}
		});

		target.buildAndSendEmail('UnitTestEmailNoBody', [ 'stlbucket@gmail.com' ], {
			TestId:				testId,
		})
		.then(function(result){
			done(result);
		})
		.otherwise(function(error){
			done();
		});
	});

	it('should fail to send a unit test no subject to only the recipient', function(done){
		geoAppConfig.registerAppConfigMap({
			Servers:		{
				UnitTest:	{
					GeoEmailerConfig:			{
						SystemEmailAddress:				'noreply@smartmine.com',
						EmailMonitoringMode:				'NoMonitor',  // 'NoMonitor', 'MonitorOnly', 'MonitorAndRecipient'
						MonitorEmailAddresses:				['stlbucket@yahoo.com'],
					},
				},
			}
		});

		target.buildAndSendEmail('UnitTestEmailNoSubject', [ 'stlbucket@gmail.com' ], {
			TestId:				testId,
		})
		.then(function(result){
			done(result);
		})
		.otherwise(function(error){
			done();
		});
	});


});