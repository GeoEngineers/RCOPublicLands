// geo references
var geoAppConfig = require('./../../lib/geoAppConfig.js');
var geoBookshelfEntityManager = require('./../../lib/geoBookshelfEntityManager.js');

var dbConfig = geoAppConfig.buildDbConfig('GeoWorkflow');

var entityManagers =	geoBookshelfEntityManager.CreateEntityManagerSet({
	DbConfig:			dbConfig,
	Exports:			exports,
	SchemaName: 	'geo_workflow',
	EntityInfos: {
		Workflow: {
			TableName:		'workflow',
		},
		WorkflowTask: {
			TableName:		'workflow_task',
		},
		LogEntry: {
			TableName:		'log_entry',
		},
		AuditEntry: {
			TableName:		'audit_entry',
		},
		WorkflowTaskView: {
			TableName:		'workflow_task_view',
		},
		NextWorkflowTaskView: {
			TableName:		'next_workflow_task_view',
		},
	},
});

exports.saveWorkflowTaskView = function(workflowTask){
	delete workflowTask.JobIdentifier;
	delete workflowTask.WorkflowDataJson;
	
	return exports.saveWorkflowTask(workflowTask);
};

// public methods
exports.getNextWorkflowTaskView = function(queueName) {
	return entityManagers.NextWorkflowTaskView.EntityQuery()
	.where('queue_name', '=', queueName)
	.execute()
	.then(function(resultSet){
		return resultSet === null ? null : resultSet[0];
	});
}

// public methods
exports.getCurrentlyProcessingTask = function() {
	return entityManagers.WorkflowTask.EntityQuery()
	.where('process_status', '=', 'PROCESSING')
	.execute()
	.then(function(resultSet){
		return resultSet === null ? null : resultSet[0];
	});
}


exports.clearWorkflowQueue = function(queueName) {
	return entityManagers.WorkflowTask.EntityQuery()
	.where('queue_name', '=', queueName)
	.del();
};
