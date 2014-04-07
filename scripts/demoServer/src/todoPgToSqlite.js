// todoPgToSqlite.js
// this feature may or may not be needed
// uses bookshelf to wholesale populate specific models from a postgres db to a sqlite db

var bookshelf = require('bookshelf');
var when = require('when');
var _ = require('lodash');
var appConfig = require('./appConfig.js');

bookshelf.pg = bookshelf.initialize(appConfig.());

bookshelf.sqlite = bookshelf.initialize(appConfig.TodoSqliteDbConfig);

var TodoItemPg = bookshelf.pg.Model.extend({
	tableName: 'todo_item'
});

var TodoItemsPg = bookshelf.pg.Collection.extend({
	model: TodoItemPg
});

var TodoItemSqlite = bookshelf.sqlite.Model.extend({
	tableName: 'todo_item'
});

var TodoItemsSqlite = bookshelf.sqlite.Collection.extend({
	model: TodoItemSqlite
});


exports.snapshotDatabase = function() {

	return new TodoItemsPg().fetch()
		.then(function(result){
			var deferreds = [];
			_.each(result.models, function(model){
				console.log(model.attributes);
				deferreds.push(new TodoItemSqlite(model.attributes).save(null, {method: 'insert'}));
			});
			return when.all(deferreds);
		})
		.then(function(result){
			console.log(result);
		})
		.otherwise(function(error){
			console.log('error:  ' + error);
		});
};
