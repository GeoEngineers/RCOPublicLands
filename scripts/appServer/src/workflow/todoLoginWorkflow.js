var geoEmailer = require('./../../lib/geoEmailer.js');

geoEmailer.registerEmailTemplateBundle({
	EmailType:					'NewAccountEmail',
	SubjectTemplate:			'New Account: {{Email}}',
	BodyTextTemplate:		'Welcome to the Smartmine Todo Application.\n\n'
		+'To Get Started, Click Here to Activate your Account\n'
		+'{{BaseUrl}}/#ActivateAccount/{{Token}}'
		+'\n\nIf you have questions or problems using this application please contact Scot McQueen',
});
