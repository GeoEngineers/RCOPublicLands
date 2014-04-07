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
