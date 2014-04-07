// npm libs
var _ = require('lodash');
// config stuff
var appConfig = require('./appConfig.js');
appConfig.setDbMode('Test');

// geo libs
var geoNodeServer = require('./../lib/geoNodeServer.js');

// app libs
var todoLoginWorkflow = require('./workflow/todoLoginWorkflow.js');


//controllers
var controllers = [
	require('./controllers/authenticatedPingController.js'),
//	require('./controllers/todoListController.js'),
];



exports.startServer = function(){

	_.each(controllers, function(controller){
		geoNodeServer.registerController(controller);
	});
	
	geoNodeServer.startServer();
};
