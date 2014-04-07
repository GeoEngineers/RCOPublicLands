global.UnitTestMode = true;

var when = require('when');
var uuid = require('node-uuid');
var _ = require('lodash');

var geoSynchQueue = require('./../../../appServer/lib/geoSynchQueue.js');
var gsqm = require('./../../../appServer/lib/models/geoSynchQueueModels.js');
var todoSynch = require('./../todoSynch.js');
var todo = require('./../todo.js');

var testId = uuid.v4();

describe('todoSynch', function(){

	describe('setup and perform a simple synch', function(){
		var tempVar;
		var deleteVar;
	
		it('should set up the todo list', function(done){
			todo.clearTodoList()
			.then(function(result){
				return todo.saveTodoListItem({
						Description: 'item 1, test: ' + testId,
						Status: 'Incomplete'
				})
			})
			.then(function(){
				return todo.saveTodoListItem({
						Description: 'item 2, test: ' + testId,
						Status: 'Incomplete'
				})
			})
			.then(function(result){
				tempVar = result.Id;
				return todo.saveTodoListItem({
						Description: 'item 3, test: ' + testId,
						Status: 'Incomplete'
				})
			})
			.then(function(result){
					deleteVar = result.Id;
					return todo.getCurrentTodoList();
			})
			.then(function(result){
				result.length.should.equal(3);
				done();
			});
		});
		
		it('should set up the synch queue', function(done){
			return gsqm.clearQueue()
			.then(function(){
				gsqm.saveSynchEvents([
					{
						RequestType:				'NewTodoItem',
						EventData:					{
																Description: 'item 4, test: ' + testId,
																Status: 'Incomplete'
															},
						Uid:								uuid.v4()
					},
					{
						RequestType:				'UpdateTodoItem',
						EventData:					{
																Id: tempVar,
																Status: 'Complete'
															},
						Uid:								uuid.v4()
					},
					{
						RequestType:				'DeleteTodoItem',
						EventData:					{
																Id: deleteVar
															},
						Uid:								uuid.v4()
					},
				])
				.then(function(result){
					result.length.should.equal(3);
					done();
				});
			})
		});
		
		it('should consume all synch events into the todo data', function(done){
			return gsqm.getQueuedEvents()
			.then(function(result){
				result.length.should.equal(3);
				return todo.getCurrentTodoList();
			})
			.then(function(result){
				result.length.should.equal(3);
				return geoSynchQueue.processNextEvent();
			})
			.then(function(result){
				console.log(result);
				return geoSynchQueue.processNextEvent();
			})
			.then(function(result){
				//console.log(result);
				return geoSynchQueue.processNextEvent();
			})
			.then(function(result){
				//console.log(result);
				done();
			});
		});
	
	});

});

