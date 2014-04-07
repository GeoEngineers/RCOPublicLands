var _ = require('lodash');
var moment = require('moment');
var when = require('when');

var geoAppConfig = require('./../geoAppConfig.js');
var geoWorkflow = require('./../geoWorkflow.js');
var geoEmailer = require('./../geoEmailer.js');


geoEmailer.registerEmailTemplateBundle({
	EmailType:					'NewAccountEmail',
	SubjectTemplate:			'New Account: {{Login}}',
	BodyTextTemplate:		'Welcome to the Smartmine Node Boiler Plate.\n\n'
		+'To Get Started, Click Here to Activate your Account\n'
		+'{{BaseUrl}}/#ActivateAccount/{{Token}}'
		+'\n\nIf you have questions or problems using this application please contact Scot McQueen',
});

geoWorkflow.registerWorkflowTaskProcessor({
	TaskType:							'SendNewAccountEmail',
	WorkflowTaskProcessor:		function(workflowTask){
		return geoEmailer.buildAndSendEmail('NewAccountEmail', 
			workflowTask.DataJson.Email,	
			{
				Login:			workflowTask.DataJson.Email,
				Email:			workflowTask.DataJson.Email,
				BaseUrl:		geoAppConfig.serverInfo().BaseUrl,
				Token:			workflowTask.DataJson.Uid,
			}
		)		
		.then(function(result){
			workflowTask.ResultMessage = result;
			return workflowTask;
		})
		.otherwise(function(error){
			workflowTask.ProcessStatus = 'ERROR';
			workflowTask.ResultMessage = error;
			return workflowTask;
		});
	},
});

geoEmailer.registerEmailTemplateBundle({
	EmailType:					'PasswordResetEmail',
	SubjectTemplate:			'Password Reset: {{Login}}',
	BodyTextTemplate:		'Click Here to Update your password\n{{BaseUrl}}/#UpdatePassword/{{Token}}\n\n'
		+ 'If you have questions or problems using this application please contact Scot McQueen',
});

geoWorkflow.registerWorkflowTaskProcessor({
	TaskType:							'SendPasswordResetEmail',
	WorkflowTaskProcessor:		function(workflowTask){		
		return geoEmailer.buildAndSendEmail('PasswordResetEmail', 
			workflowTask.DataJson.Email,	
			{
				Login:			workflowTask.DataJson.Email,
				Email:			workflowTask.DataJson.Email,
				BaseUrl:		geoAppConfig.serverInfo().BaseUrl,
				Token:			workflowTask.DataJson.Uid,
			}
		)		
		.then(function(result){
			workflowTask.ResultMessage = result;
			return workflowTask;
		})
		.otherwise(function(error){
			workflowTask.ProcessStatus = 'ERROR';
			workflowTask.ResultMessage = error;
			return workflowTask;
		});
	}
});


exports.requestNewAccountEmail = function(contact){
	
	return geoWorkflow.addWorkflowTask({
		TaskType: 						'SendNewAccountEmail',
		DataJson:							contact,
		ScheduledTimestamp:		moment().format(),
	});

};

exports.requestPasswordResetEmail = function(contact){
	
	return geoWorkflow.addWorkflowTask({
		TaskType: 						'SendPasswordResetEmail',
		DataJson:							contact,
		ScheduledTimestamp:		moment().format(),
	});

};
