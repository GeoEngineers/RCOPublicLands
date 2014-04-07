global.UnitTestMode = true;

var todo = require('./../todo.js');
var when = require('when');
var _ = require('lodash');
var should = require('should');
var uuid = require('node-uuid');

var testId = uuid.v4();


describe('todo', function(){
	
	var tempVal;

	it('should clear the todo list', function(done){
		todo.clearTodoList()
		.then(function(result){
			return todo.getCurrentTodoList();
		})
		.then(function(result){
			result.length.should.equal(0);
			done();
		});
	});

	it('should add an item to the todo list', function(done){
		return todo.saveTodoListItem({
				Description: 'item 1, test: ' + testId,
				Status: 'Incomplete'
		})
		.then(function(result){
			(result.Id > 0).should.be.true;
			return todo.getCurrentTodoList();
		})
		.then(function(result){
			result.length.should.equal(1);
			done();
		});
	});

	it('should add a second item to the todo list', function(done){
		return todo.saveTodoListItem({
				Description: 'item 2, test: ' + testId,
				Status: 'Incomplete'
		})
		.then(function(result){
			(result.Id > 0).should.be.true;
			tempVal = result.Id;
			return todo.getCurrentTodoList();
		})
		.then(function(result){
			result.length.should.equal(2);
			done();
		});
	});
	
	it('should retrieve and update a todo item',  function(done){
		return todo.getTodoListItem(tempVal)
		.then(function(result){
 			result.Id.should.equal(tempVal);
			done();
		});
	});
	
	it('should delete a todo item', function(done){
		return todo.deleteTodoListItem(tempVal)
		.then(function(result){
			return todo.getTodoListItem(tempVal);
		})
		.then(function(result){
			(result === null).should.be.true;
			done();
		});
	});
});

















