//require('newrelic');
require('./scripts/appServer/src/appServer.js').startServer();




// var port = process.env.PORT || 1337;

// var restify = require('restify');
// var passport = require('passport');
// var geoPassport = require('./scripts/appServer/lib/geoPassport.js');

// var siteController = require('./scripts/appServer/src/controllers/siteController.js');
// var todoListController = require('./scripts/demoServer/src/controllers/todoListController.js');
// var authenticatedPingController = require('./scripts/demoServer/src/controllers/authenticatedPingController.js');
// var geoLoginController = require('./scripts/appServer/src/controllers/geoLoginController.js');
// var synchEventController = require('./scripts/appServer/src/controllers/geoSynchEventController.js');
// var geoSynchQueue = require('./scripts/appServer/lib/geoSynchQueue.js');
// var todoSynch = require('./scripts/demoServer/src/todoSynch.js');

// var server = restify.createServer();
// server.use(passport.initialize());
// server.use(restify.queryParser());
// server.use(restify.bodyParser());
// server.use(restify.jsonp());
// server.use(restify.CORS());
// server.use(restify.fullResponse());

// var tokenAuth = passport.authenticate('token', {session: false});
// var basicAuth = passport.authenticate('basic', {session: false});

// server.post('/processClientSynchEvents', synchEventController.processClientSynchEvents);
// server.get('/todos', todoListController.getCurrentTodoList);
// server.post('/todos', todoListController.saveTodoListItem);
// server.del('/todos/:Id', todoListController.deleteTodoListItem);
// //server.put('/todos/:Id', function(req, res, next){ res.send("I'm a put request!") });
// server.put('/todos/:Id', todoListController.saveTodoListItem); 
// server.get('/getTodoItem', todoListController.getTodoListItem);
// server.get(
	// '/authenticatedPing', 
	// tokenAuth, 
	// authenticatedPingController.ping
// );
// server.post(
	// '/loginUser', 
	// basicAuth, 
	// geoLoginController.loginUser
// );
// server.get('/.*', siteController.loadsite);



// server.listen(port, function() {
    // console.log('%s listening at %s', server.name, server.url);
    // console.log('Version: ' + process.version);
// });

// var io = require('socket.io').listen(server.server);

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
