var when = require('when');
var _ = require('lodash');

var geoLogger = require('./../geoLogger.js');

exports.createControllerMethod = function(options){
	var _worker = options.Worker;
	var _controller = options.Controller;
	var _method = options.Method;
	
	return function(req, res, next){
		when(_worker(req))
		.then(function(result){
			res.send(result);
			return next();
		})
		.otherwise(function(error){
			geoLogger.logError(_controller, _method, error)
			res.send(error);
			return next();
		});
	};
};

var createControllerMethod = function(options){
	var _worker = options.Worker;
	var _controller = options.Controller;
	var _method = options.Method;
	
	return function(req, res, next){
		when(_worker(req))
		.then(function(result){
			res.send(result);
			return next();
		})
		.otherwise(function(error){
			geoLogger.logError(_controller, _method, error)
			res.send(error);
			return next();
		});
	};
};


exports.createController = function(controllerInfo){
	var _controllerInfo = controllerInfo;
		
	_.forOwn(controllerInfo.Methods, function(method, methodName){
		controllerInfo.Exports[methodName] = exports.createControllerMethod({
			Controller:	_controllerInfo.Name,
			Method:	methodName,
			Worker:		method,
		});
	});
	
	controllerInfo.Exports.registerAppRouteMap = function(registrar) {
		return registrar(_controllerInfo.AppRouteMap);
	};
};