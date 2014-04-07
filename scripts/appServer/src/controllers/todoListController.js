var todo = require('./../todo.js');
var when = require('when');
var logger = require('./../../../appServer/lib/geoLogger.js');

exports.getCurrentTodoList = function(req, res, next){
	todo.getCurrentTodoList()
	.then(function(result){
		res.send(result);
		return next();
	})
	.otherwise(function(error){
		res.send(error);
		logger.logMessage(logger.GeoLogLevel.High, 
				logger.GeoLogCategory.Api, 
				'todoListController.getCurrentTodoList', 
				error);
		return next(error);
	});
};

exports.saveTodoListItem = function(req, res, next) {
	todo.saveTodoListItem(req.params.newTodoListItem)
	.then(function(result){
		res.send(result);
		return next();
	})
	.otherwise(function(error){
		res.send(error);
		logger.logMessage(logger.GeoLogLevel.High, 
				logger.GeoLogCategory.Api, 
				'todoListController.saveTodoListItem', 
				error);
		return next(error);
	});
};


exports.deleteTodoListItem = function(req, res, next) {
	todo.deleteTodoListItem(req.params.Id)
	.then(function(result){
		res.send(result);
		return next();
	})
	.otherwise(function(error){
		res.send(error);
		logger.logMessage(logger.GeoLogLevel.High, 
				logger.GeoLogCategory.Api, 
				'todoListController.deleteTodoListItem', 
				error);
		return next(error);
	});
};


exports.getTodoListItem = function(req, res, next) {
	todo.getTodoListItem(req.params.id)
	.then(function(todoItem){
		res.send(todoItem);
		return next();
	})
	.otherwise(function(error){
		res.send(error);
		logger.logMessage(logger.GeoLogLevel.High, 
				logger.GeoLogCategory.Api, 
				'todoListController.getCurrentTodoList', 
				error);
		return next(error);
	});
};


// server.get('/todos', todoListController.getCurrentTodoList);
// server.post('/todos', todoListController.saveTodoListItem);
// server.del('/todos/:Id', todoListController.deleteTodoListItem);
// //server.put('/todos/:Id', function(req, res, next){ res.send("I'm a put request!") });
// server.put('/todos/:Id', todoListController.saveTodoListItem); 
// server.get('/getTodoItem', todoListController.getTodoListItem);

exports.registerAppRouteMap = function(registrar) {
	return registrar({
		Todo:	{
			AppRouteMap:		[
				{
					Type:					'get',
					Url:						'/todos',
					Handler:				exports.getCurrentTodoList,
					//Auth:					'basic',
				},
				{
					Type:					'post',
					Url:						'/todos',
					Handler:				exports.saveTodoListItem,
					//Auth:					'basic',
				},
				{
					Type:					'del',
					Url:						'/todos/:Id',
					Handler:				exports.deleteTodoListItem,
					//Auth:					'basic',
				},
				{
					Type:					'put',
					Url:						'/todos/:Id',
					Handler:				exports.saveTodoListItem,
					//Auth:					'basic',
				},
				{
					Type:					'get',
					Url:						'/getTodoItem',
					Handler:				exports.getTodoListItem,
					//Auth:					'basic',
				},
			]
		}
	});
};