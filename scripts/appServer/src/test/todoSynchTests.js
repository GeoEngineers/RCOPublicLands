global.UnitTestMode = true;

var when = require('when');
var uuid = require('node-uuid');
var _ = require('lodash');
var moment = require('moment');

var geoWorkflow = require('./../../../appServer/lib/geoWorkflow.js');
var dataAccess = require('./../../../appServer/lib/models/geoWorkflowModels.js');
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
			return dataAccess.deleteAllWorkflowTasks()
			.then(function(result){
				var deferreds = [];
				deferreds.push(dataAccess.saveWorkflowTask({
					TaskType:						'NewTodoItem',
					DataJson:						{
															Description: 'item 4, test: ' + testId,
															Status: 'Incomplete'
														},
					Uid:								uuid.v4(),
					ProcessStatus:				'QUEUED',
					PriorityWeight:				50,
					QueueName:					'UnitTest',
					ScheduledTimestamp:	moment().format(),
				}));
				deferreds.push(dataAccess.saveWorkflowTask({
					TaskType:						'UpdateTodoItem',
					DataJson:						{
															Id: tempVar,
															Status: 'Complete'
														},
					Uid:								uuid.v4(),
					ProcessStatus:				'QUEUED',
					PriorityWeight:				50,
					QueueName:					'UnitTest',
					ScheduledTimestamp:	moment().format(),
				}));
				deferreds.push(dataAccess.saveWorkflowTask({
					TaskType:						'DeleteTodoItem',
					DataJson:						{
															Id: deleteVar
														},
					Uid:								uuid.v4(),
					ProcessStatus:				'QUEUED',
					PriorityWeight:				50,
					QueueName:					'UnitTest',
					ScheduledTimestamp:	moment().format(),
				}));
				return when.all(deferreds);
			})
			.then(function(result){
				result.length.should.equal(3);
				done();
			});
		});
		
		it('should consume all synch events into the todo data', function(done){
			return dataAccess.getAllWorkflowTasks()
			.then(function(result){
				result.length.should.equal(3);
				return todo.getCurrentTodoList();
			})
			.then(function(result){
				result.length.should.equal(3);
				return geoWorkflow.processNextWorkflowTask('UnitTest');
			})
			.then(function(result){
				console.log('first');
				console.log(result);
				return geoWorkflow.processNextWorkflowTask('UnitTest');
			})
			.then(function(result){
				console.log('second');
				console.log(result);
				return geoWorkflow.processNextWorkflowTask('UnitTest');
			})
			.then(function(result){
				console.log('third');
				console.log(result);
				done();
			});
		});
	
	});

});

