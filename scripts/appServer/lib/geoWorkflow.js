var uuid = require('node-uuid');
var moment = require('moment');
var when = require('when');
var _ = require('lodash');

var geoAppConfig = require('./geoAppConfig.js');
var geoLogger = require('./geoLogger.js');
var dataAccess = require('./models/geoWorkflowModels.js');

var workflowTaskProcessors = [];

// WorkflowTaskProcessor should be a function that returns the workflowTask
// or a promise that resolves with the workflowTask.
//
// WorkflowTaskProcessor should operate on the DataJson and ResultMessage
// fields of the workflowTask. 
//
// WorkflowTaskProcessor may change the ProcessStatus of the task to any value
// and it will be preserved.  If the status is still set to 'PROCESSING', it will
// subsequently be set to 'COMPLETE'.
var _workflowProcessorIntervals = [];

exports.startWorkflowTaskProcessor = function(queueName){
	queueName = queueName || geoAppConfig.DefaultWorkflowQueueName();
	
	_workflowProcessorIntervals[queueName] =_workflowProcessorIntervals[queueName] 
		|| setInterval(function(){
				exports.processNextWorkflowTask(queueName);
			}, 1000);
	
	return _workflowProcessorIntervals[queueName];
};

exports.stopWorkflowTaskProcessor = function(queueName){
	clearInterval(_workflowProcessorIntervals[queueName]);
};

exports.registerWorkflowTaskProcessor = function(options){
	workflowTaskProcessors.push({
		TaskType:							options.TaskType,
		WorkflowTaskProcessor:		options.WorkflowTaskProcessor
	});
};


exports.addWorkflowTask = function(workflowTask) {
	workflowTask.Uid = workflowTask.Uid || uuid.v4();
	workflowTask.PriorityWeight = workflowTask.PriorityWeight || 50;
	workflowTask.QueueName = workflowTask.QueueName || geoAppConfig.DefaultWorkflowQueueName();
	workflowTask.QueuedTimestamp = workflowTask.QueuedTimestamp || moment().format();
	workflowTask.ProcessStatus = workflowTask.ProcessStatus || 'QUEUED';
	return dataAccess.saveWorkflowTask(workflowTask);
};

exports.clearWorkflowQueue = function(queueName) {
	return dataAccess.clearWorkflowQueue(queueName || geoAppConfig.DefaultWorkflowQueueName());
};

exports.processNextWorkflowTask = function(queueName) {
	var d = when.defer();
	var theEvent;
	
	dataAccess.getCurrentlyProcessingTask()
	.then(function(currentlyProcessingTask){
		if (!currentlyProcessingTask){
			return dataAccess.getNextWorkflowTaskView(queueName || geoAppConfig.DefaultWorkflowQueueName());
		} else {
			d.resolve('Already processing a task');
		}
	})
	.then(function(nextWorkflowTask){
		if (nextWorkflowTask){
			delete nextWorkflowTask.JobIdentifier;
			delete nextWorkflowTask.WorkflowDataJson;
			
			nextWorkflowTask.ProcessStatus = 'PROCESSING';
			nextWorkflowTask.BeginProcessTimestamp = moment().format();
			return dataAccess.saveWorkflowTask(nextWorkflowTask);
		} else {
			return 'No queued workflow tasks';
		}
	})
	.then(function(workflowTask){
		if (workflowTask === 'No queued workflow tasks') {
			return 'No queued workflow tasks';
		};

		var taskProcessor = _.find(workflowTaskProcessors, function(processor){
			return processor.TaskType === workflowTask.TaskType;
		});
		
		if (taskProcessor) {
			return taskProcessor.WorkflowTaskProcessor(workflowTask);
		} else {
			workflowTask.ProcessStatus = 'NO_PROCESSOR';
			workflowTask.ResultMessage = 'No processor registered';
			return dataAccess.saveWorkflowTask(workflowTask);
		}
	})
	.then(function(workflowTask){
		if (workflowTask === 'No queued workflow tasks') {
			return d.resolve('No queued workflow tasks');
		};

		workflowTask.ProcessStatus =  workflowTask.ProcessStatus === 'PROCESSING' ? 'COMPLETE' : workflowTask.ProcessStatus;
		workflowTask.EndProcessTimestamp = moment().format();
		dataAccess.saveWorkflowTask(workflowTask)
		.then(function(result){
			d.resolve(result);
		})
		.otherwise(function(result){
			d.reject(result);
		});
	})
	.otherwise(function(error){
		geoLogger.logError('Workflow', 'processNextEvent', error)
		d.reject(error);
	});

	return d.promise;
};