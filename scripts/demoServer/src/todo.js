var bookshelf = require('bookshelf');
var _ = require('lodash');
var when = require('when');

var dataAccess = require('./models/todoModels.js');
var geoUtilities = require('./../../appServer/lib/geoUtilities');

exports.getCurrentTodoList = function(){
	return dataAccess.getAllTodoItems();
};

exports.getTodoListItem = function(itemId){
	return dataAccess.getTodoItem(itemId);

	// return new TodoItem({
		// id: itemId
	// })
	// .fetch({require: true})
	// .then(function(todoItem){
		// return geoUtilities.upperCamelCaseify(todoItem.attributes);
		// //return todoItem.attributes;
	// })
	// .otherwise(function(){
		// return null;
	// });
};

exports.saveTodoListItem = function(itemAttributes){
	return dataAccess.saveTodoItem(itemAttributes);

	// var d = when.defer();
	// exports.getTodoListItem(itemAttributes.Id)
	// .then(function(existingItem){
		// var dbItemAttributes = geoUtilities.snakeCaseify(itemAttributes);
		// if (existingItem != undefined){
			// existingItem = new TodoItem(geoUtilities.snakeCaseify(existingItem));
			// _.each(dbItemAttributes, function(val, key){
				// existingItem.set(key, val);
			// })
		// } else {
			// existingItem = new TodoItem(dbItemAttributes);
		// }
		// return existingItem.save();
	// })
	// .then(function(result){
		// d.resolve(geoUtilities.upperCamelCaseify(result.attributes));
	// })
	// .otherwise(function(result){
			// d.reject(result);
	// });
	// return d.promise;
};


exports.deleteTodoListItem = function(id){
	return dataAccess.deleteTodoItemById(id);
	
	// var d = when.defer();
	// new TodoItem({id: id}).destroy()
	// .then(function(result){
		// d.resolve();
	// })
	// .otherwise(function(result){
		// d.reject(result);
	// });
	// return d.promise;
};

exports.clearTodoList = function() {

	return dataAccess.deleteAllTodoItems();

	// var todoItems = new TodoItems();
	// return todoItems.query().del();
};
