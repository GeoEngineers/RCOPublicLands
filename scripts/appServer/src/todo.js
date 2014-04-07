var bookshelf = require('bookshelf');
var _ = require('lodash');
var when = require('when');

var dataAccess = require('./models/todoModels.js');

exports.getCurrentTodoList = function(){
	return dataAccess.getAllTodoItems();
};

exports.getTodoListItem = function(id){
	return dataAccess.getTodoItemById(id);
};

exports.saveTodoListItem = function(itemAttributes){
	return dataAccess.saveTodoItem(itemAttributes);
};

exports.deleteTodoListItem = function(id){
	return dataAccess.deleteTodoItemById(id);
};

exports.clearTodoList = function() {
	return dataAccess.deleteAllTodoItems();
};

