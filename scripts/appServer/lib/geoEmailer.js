var AWS = require('aws-sdk');
var when = require('when');
var handlebars = require('handlebars');
var _ = require('lodash');

var geoAppConfig = require('./geoAppConfig.js');
var logger = require('./../lib/geoLogger.js');

var awsConfig = geoAppConfig.AwsConfig();
AWS.config.update(awsConfig);

var ses = new AWS.SES();

var _emailTemplateBundles = [];

var doSendEmail = function(email){
	var d = when.defer();
	ses.sendEmail(email, 
			function (err, data) {
			  if (err) {
				logger.logMessage(logger.GeoLogLevel.High, logger.GeoLogCategory.Email, 'geoEmailer.sendEmail', err)
				.then(function(model) {
					d.reject(err);
				})
				.otherwise(function(error){
					d.reject(error);
				})
			  } else {
				logger.logMessage(logger.GeoLogLevel.Low, logger.GeoLogCategory.Email, 'geoEmailer.sendEmail', 'email sent to: ' + email.Destination.ToAddresses)
				.then(function(model) {
					d.resolve(data);
				})
				.otherwise(function(error){
					d.reject(error);
				})
			}
		});

	return d.promise;
};

exports.registerEmailTemplateBundle = function(bundle){
	_emailTemplateBundles[bundle.EmailType] = bundle;
};

// emailType:  must correspond to a registered _emailTemplateBundle
// toAddresses:  an array of valid email addresses
// data:  any fields required by the associated template - json data
exports.buildAndSendEmail = function(emailType, toAddresses, data){
	var bundle = _emailTemplateBundles[emailType];
	
	if (bundle) {
		var subjectTemplate = bundle.SubjectTemplate ? handlebars.compile(bundle.SubjectTemplate) : null;
		var subject =  subjectTemplate ? subjectTemplate(data) : null;

		var bodyTextTemplate = bundle.BodyTextTemplate ? handlebars.compile(bundle.BodyTextTemplate) : null;
		var bodyText = bodyTextTemplate ? bodyTextTemplate(data) : null;

		var bodyHtmlTemplate = bundle.BodyHtmlTemplate ? handlebars.compile(bundle.BodyHtmlTemplate) : null;
		var bodyHtml = bodyHtmlTemplate ? bodyHtmlTemplate(data) : null;
	
		switch(geoAppConfig.GeoEmailerConfig().EmailMonitoringMode) {
			case('MonitorOnly') :
				toAddresses = geoAppConfig.GeoEmailerConfig().MonitorEmailAddresses;
				break;
			case('MonitorAndRecipient') :
				toAddresses = _.union(toAddresses, geoAppConfig.GeoEmailerConfig().MonitorEmailAddresses);
				break;
			default :
				break;
		};		
		
		var email = {
			Source: geoAppConfig.GeoEmailerConfig().SystemEmailAddress,
			Destination: {
				ToAddresses: toAddresses,
			},
			Message: {
				Subject: {
					Data: subject,
				},
				Body: {
				}
			}
		};
		
		if (bodyText) email.Message.Body.Text = { Data:		bodyText };
		if (bodyHtml) email.Message.Body.Html = { Data:	bodyHtml };
		
		return doSendEmail(email);
	} else {
		throw 'No email template bundle: ' + emailType;
	};
}


// email - should conform to the structure documented here:  http://aws.amazon.com/sdkforbrowser/
exports.sendEmail = function(email){
	return doSendEmail(email);
};