var uuid = require('node-uuid');
var should = require('should');
var moment = require('moment');
var when = require('when');
var _ = require('lodash');

var target = require('./../geoWorkflowModels.js');



describe('geoWorkflowModels', function(){

	describe('do cool stuff', function(){

		it('should log the interface', function(done){
			var testId = uuid.v4();
			console.log(target);
			done();
		});
		
		var clearQueues = function(queues){
			var queuesAreCleared = [];
			
			_.each(queues, function(queue){
				queuesAreCleared.push(target.clearWorkflowQueue(queue));
			});
			
			return when.all(queuesAreCleared);
		};
		
		var fetchNextTasks = function(queues){
			var nextTasksAreFetched = [];
			
			_.each(queues, function(queue){
				nextTasksAreFetched.push(target.getNextWorkflowTaskView(queue));
			});
			
			return when.all(nextTasksAreFetched);
		};
		
		it('should save a WorkflowTask', function(done){
			var testId = uuid.v4();
			var resultId = null;
			var queues = ['UnitTest1', 'UnitTest2']; 
			
			clearQueues(queues)
			.then(function(result){
				return fetchNextTasks(queues);
			})
			.then(function(result){   // add two items to one queue and one item to another
				result.length.should.equal(2);
				(result[0] === undefined).should.be.true;
				(result[1] === undefined).should.be.true;

				var workflowTasksAreSaved = [];
				
				workflowTasksAreSaved.push(target.saveWorkflowTask({
					TaskType:						'SimplePing',
					DataJson:						{
															TestId: testId,
														},
					Uid:								uuid.v4(),
					ProcessStatus:				'QUEUED',
					PriorityWeight:				50,
					QueueName:					'UnitTest1',
					QueuedTimestamp:		moment().format(),
					ScheduledTimestamp:	moment().format(),
				}));
				workflowTasksAreSaved.push(target.saveWorkflowTask({
					TaskType:						'SimplePing',
					DataJson:						{
															TestId: testId,
														},
					Uid:								uuid.v4(),
					ProcessStatus:				'QUEUED',
					PriorityWeight:				50,
					QueueName:					'UnitTest1',
					QueuedTimestamp:		moment().format(),
					ScheduledTimestamp:	moment().format(),
				}));
				workflowTasksAreSaved.push(target.saveWorkflowTask({
					TaskType:						'SimplePing',
					DataJson:						{
															TestId: testId,
														},
					Uid:								uuid.v4(),
					ProcessStatus:				'QUEUED',
					PriorityWeight:				50,
					QueueName:					'UnitTest2',
					QueuedTimestamp:		moment().format(),
					ScheduledTimestamp:	moment().format(),
				}));
				return when.all(workflowTasksAreSaved);
			})
			.then(function(result){
				result.length.should.equal(3);
				result[0].should.be.ok;
				result[0].TaskType.should.equal('SimplePing');
				result[1].should.be.ok;
				result[1].TaskType.should.equal('SimplePing');
				result[2].should.be.ok;
				result[2].TaskType.should.equal('SimplePing');
				
				return fetchNextTasks(queues);
			})
			.then(function(result){    // make it look like these tasks have been completed
				result.length.should.equal(2);
				result[0].should.be.ok;
				result[1].should.be.ok;
				
				result[0].ProcessStatus = 'COMPLETE';				
				result[1].ProcessStatus = 'COMPLETE';				
				
				var tasksAreSaved = [];
				tasksAreSaved.push(target.saveWorkflowTaskView(result[0]));
				tasksAreSaved.push(target.saveWorkflowTaskView(result[1]));
				return when.all(tasksAreSaved);
			})
			.then(function(result){
				return fetchNextTasks(queues);
			})
			.then(function(result){
				result.length.should.equal(2);
				result[0].should.be.ok;
				(result[1] === undefined).should.be.true;
				
				result[0].ProcessStatus = 'QUEUED';				
				done();
			})
			.otherwise(done);
		});
	
	});

});