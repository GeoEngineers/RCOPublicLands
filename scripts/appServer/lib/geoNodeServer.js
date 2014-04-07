var port = process.env.PORT || 1337;

var passport = require('passport');
var restify = require('restify');
var _ = require('lodash');

var geoLogin = require('./geoLogin.js');
var geoPassport = require('./geoPassport.js');
var geoAppConfig = require('./geoAppConfig.js');
var geoWorkflow = require('./geoWorkflow.js');

var geoLoginController = require('./controllers/geoLoginController.js');

var controllers = [
	geoLoginController,
];

global.server = null;


var doStartServer = function(){
	global.server = global.server === null ? restify.createServer() : global.server;
	geoPassport.initialize(geoLogin.basicLogin, geoLogin.tokenLogin);
	
	global.server.use(passport.initialize());
	global.server.use(restify.queryParser());
	global.server.use(restify.bodyParser());
	global.server.use(restify.jsonp());

	//setup cors
	restify.CORS.ALLOW_HEADERS.push('accept');
	restify.CORS.ALLOW_HEADERS.push('authorization');
	restify.CORS.ALLOW_HEADERS.push('Authorization');
	restify.CORS.ALLOW_HEADERS.push('sid');
	restify.CORS.ALLOW_HEADERS.push('lang');
	restify.CORS.ALLOW_HEADERS.push('origin');
	restify.CORS.ALLOW_HEADERS.push('withcredentials');
	restify.CORS.ALLOW_HEADERS.push('x-requested-with');

	global.server.use(restify.CORS());
	global.server.use(restify.fullResponse());

	global.server.listen(port, function() {
		console.log('%s listening at %s', global.server.name, global.server.url);
		console.log('Version: ' + process.version);
	});

	registerControllerRouteMaps();
	doRegisterRouteMap(geoAppConfig.getAppRouteMap());
	geoWorkflow.startWorkflowTaskProcessor();
};

var registerControllerRouteMaps = function(){
	_.each(controllers, function(controller){
		controller.registerAppRouteMap(geoAppConfig.registerAppRouteMap);
	});
};

var doRegisterRouteMap = function(appRouteMap){
	geoAppConfig.reportAppConfigMap();
	_.each(appRouteMap, function(pkgRouteMap){
		_.each(pkgRouteMap, function(appRoute){
			doRegisterRoute(appRoute);
		});
	});
};

var doRegisterRoute = function(route){
console.log(route);
	if (server === null) return false;
	var auth = null;
	switch (route.Auth) {
		case 'basic':
			auth = geoPassport.basicAuth;
			break;
		case 'token':
			auth = geoPassport.tokenAuth;
			break;
	};
	
	switch (route.Type) {
		case 'get':
			if(auth){
				global.server.get(route.Url, auth, route.Handler);
			}else{
				global.server.get(route.Url, route.Handler);
			}
		break;
		case 'post':
			if(auth){
				global.server.post(route.Url, auth, route.Handler);
			}else{
				global.server.post(route.Url, route.Handler);
			}
		break;
		case 'put':
			if(auth){
				global.server.put(route.Url, auth, route.Handler);
			}else{
				global.server.put(route.Url, route.Handler);
			}
		break;
		case 'del':
			if(auth){
				global.server.del(route.Url, auth, route.Handler);
			}else{
				global.server.del(route.Url, route.Handler);
			}
		break;
	}
	return true;
};

exports.registerController = function(controller) {
	controllers.push(controller);
};

exports.registerAppConfig = function(appConfig){
	if (server !== null) {
		global.server.appConfig = appConfig;
	}
};

exports.startServer = doStartServer;



// var io = require('socket.io').listen(global.server.server);

// io.sockets.on('connection', function (socket) {
	// socket.join('todoClient');	
// });

// setInterval(function(){
	// return geoSynchQueue.processNextEvent(todoSynch.synchEventProcessor)
	// .then(function(result){
		// //console.log(result);
	// })
	// .otherwise(function(error){
		// console.log(error);
	// });
// }, 1000);
