var uuid = require('node-uuid');
var moment = require('moment');
var should = require('should');
var when = require('when');

var target = require('./../geoWorkflow.js');
var dataAccess = require('./../models/geoWorkflowModels.js');

// edge cases go first, because they include cases where no task
// handlers are registered with geoWorkflow
describe('edge cases', function(){

	it('should fail a task gracefully if no processor is registered', function(done){
		var testId = uuid.v4();
		
		dataAccess.deleteAllWorkflowTasks()
		.then(function(result){
			return target.addWorkflowTask({
				Uid:									testId,
				TaskType: 						'TEST',
				QueueName: 					'TestQueue',
				DataJson:							'test data',
				ScheduledTimestamp:		moment().format(),
			});
		})
		.then(function(result){
			result.should.be.ok;
			return target.processNextWorkflowTask('TestQueue');
		})
		.then(function(result){
			result.should.be.ok;
			result.ResultMessage.should.equal('No processor registered');
			result.ProcessStatus.should.equal('NO_PROCESSOR');
			done();
		})
		.otherwise(done);
	});

	it('should yield if there is already a task being processed', function(done){
		var testId = uuid.v4();
		dataAccess.deleteAllWorkflowTasks()
		.then(function(result){
			return target.addWorkflowTask({
				Uid:									uuid.v4(),
				TaskType: 						'TEST',
				QueueName: 					'TestQueue',
				DataJson:							{ TheData:	testId},
				ScheduledTimestamp:		moment().format(),
				ProcessStatus:					'PROCESSING',
			});
		})
		.then(function(firstTask){
			firstTask.should.be.ok;
			return target.addWorkflowTask({
				Uid:									uuid.v4(),
				TaskType: 						'TEST',
				QueueName: 					'TestQueue',
				DataJson:							{ TheData:	testId},
				ScheduledTimestamp:		moment().format(),
				ProcessStatus:					'QUEUED',
			});
		})
		.then(function(secondTask){
			secondTask.should.be.ok;
			return target.processNextWorkflowTask('TestQueue');
		})
		.then(function(result){
			result.should.equal('Already processing a task');
			return dataAccess.getCurrentlyProcessingTask();
		})
		.then(function(currentTask){
			currentTask.ProcessStatus = 'COMPLETE';
			return dataAccess.saveWorkflowTask(currentTask);
		})
		.then(function(){
			return target.processNextWorkflowTask('TestQueue');
		})
		.then(function(result){
			result.should.be.ok;
			result.ResultMessage.should.equal('No processor registered');
			result.ProcessStatus.should.equal('NO_PROCESSOR');
			done();
		})
		.otherwise(done);
	});

});


describe('easy cases', function(){

	it('should add a workflow task', function(done){
		var testId = uuid.v4();
		
		dataAccess.deleteAllWorkflowTasks()
		.then(function(result){
			return target.addWorkflowTask({
				Uid:									testId,
				TaskType: 						'TEST',
				QueueName: 					'TestQueue',
				DataJson:							{ TheData:	testId},
				ScheduledTimestamp:		moment().format(),
			});
		})
		.then(function(result){
			result.should.be.ok;
			result.DataJson.TheData.should.equal(testId);
			done();
		})
		.otherwise(done);
	});

	it('should add a workflow task then process it', function(done){
		var testId = uuid.v4();
		
		target.registerWorkflowTaskProcessor({
			TaskType:							'TEST',
			WorkflowTaskProcessor:		function(workflowTask){
				workflowTask.ResultMessage = 'I attest to success in this test';
				return workflowTask;
			},
		});
		
		dataAccess.deleteAllWorkflowTasks()
		.then(function(result){
			return target.addWorkflowTask({
				Uid:									uuid.v4(),
				TaskType: 						'TEST',
				QueueName: 					'TestQueue',
				DataJson:							{ TheData:	testId},
				ScheduledTimestamp:		moment().format(),
			});
		})
		.then(function(result){
			result.should.be.ok;
			return dataAccess.getNextWorkflowTaskView('TestQueue');
		})
		.then(function(result){
			result.should.be.ok;
			return target.processNextWorkflowTask('TestQueue');
		})
		.then(function(result){
			result.should.be.ok;
			result.ResultMessage.should.equal('I attest to success in this test');
			done();
		})
		.otherwise(done);
	});

	it.only('should add a workflow task then process it by turning on the processor', function(done){
		this.timeout(10000);
		var testId = uuid.v4();
		var taskId = null;
		
		target.registerWorkflowTaskProcessor({
			TaskType:							'TEST',
			WorkflowTaskProcessor:		function(workflowTask){
				workflowTask.ResultMessage = 'I attest to success in this test';
				return workflowTask;
			},
		});
		
		dataAccess.deleteAllWorkflowTasks()
		.then(function(result){
			return target.addWorkflowTask({
				Uid:									uuid.v4(),
				TaskType: 						'TEST',
				QueueName: 					'TestQueue',
				DataJson:							{ TheData:	testId},
				ScheduledTimestamp:		moment().format(),
			});
		})
		.then(function(result){
			result.should.be.ok;
			taskId = result.Id;
			return target.startWorkflowTaskProcessor('TestQueue');
		})
		.then(function(result){
			var d = when.defer();
			
			// wait 3 seconds coz the processor should fire every 1
			setTimeout(function(){
				d.resolve(dataAccess.getWorkflowTaskById(taskId));
			}, 3000);
			
			return d.promise;
		})
		.then(function(result){
			result.should.be.ok;
			result.ProcessStatus.should.equal('COMPLETE');
			result.ResultMessage.should.equal('I attest to success in this test');
			done();
		})
		.otherwise(done);
	});
});
