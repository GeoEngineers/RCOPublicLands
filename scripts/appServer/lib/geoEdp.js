var moment = require('moment');
var when = require('when');
var _ = require('lodash');

var appConfig = require('./../src/appConfig.js');
var geoLogger = require('./geoLogger.js');
var geoWorkflow = require('./geoWorkflow.js');
var dataAccess = require('./models/geoEdpModels.js');

var edpRecordToEntitySynchManagers = [];

// EdpRecordToEntityAggregator should be a function that returns the edpRecordInfo
// or a promise that resolves with the edpRecordInfo.
//
// EdpRecordToEntityAggregator should map data from the edpRecordInfo into
// the final entity table for use in the application.
//
// If an error is encountered, then it should be thrown from the EdpRecordToEntityAggregator.
// This will cause the associated WorkflowTask to have a ProcessStatus of 'ERROR', and the 
// text of the thrown error will be stored in the ResultMessage of the WorkflowTask.

exports.registerEdpSynchManager = function(options){
	var synchManager = buildEdpSynchManager(options);
	
	geoWorkflow.registerWorkflowTaskProcessor({
		TaskType: options.TaskType,  
		WorkflowTaskProcessor: synchManager.ProcessEdpSynchTask
	});

	edpRecordToEntitySynchManagers.push({
		EntityName:	options.TableName,
		EdpRecordToEntityAggregator: synchManager
	});
};

var buildEdpSynchManager = function(options){
	var tableName = options.TableName;
	var edpRecordToEntityAggregator = options.EdpRecordToEntityAggregator;
	
	var doProcessEdpSynchTask = function(task){

		return dataAccess.queryForEdpRecordInfo({
			InternalTableName:		tableName,
			EdpId:							task.DataJson.EdpId,
			ExternalRecordId:			task.DataJson.ExternalRecordId
		})
		.then(function(edpRecordInfo){
			return aggregateSynchEventToEdpRecordInfo(task.DataJson, edpRecordInfo);
		})
		.then(function(edpRecordInfo){
			return edpRecordToEntityAggregator(edpRecordInfo);
		})
		.then(function(edpRecordInfo){
			edpRecordInfo.LastAggregatedTimestamp = moment().format();
			return dataAccess.saveEdpRecordInfo(edpRecordInfo);
		})
		.then (function(edpRecordInfo){
			task.ProcessStatus = 'COMPLETE';
			return task;
		})
		.otherwise(function(error){
			task.ProcessStatus = 'ERROR';
			task.ResultMessage = error;
			return task;
		});
	};
	
	var aggregateSynchEventToEdpRecordInfo = function(taskData, edpRecordInfo){
		edpRecordInfo = edpRecordInfo || {
											EdpId:									taskData.EdpId,
											InternalTableName:				tableName,
											ExternalRecordId:					taskData.ExternalRecordId,
											AggregatedImportDataJson:	{}
										};

		for(key in taskData){
			if (key !== 'EdpId' && key !== 'ExternalRecordId' && key !== 'InternalTableName'){
				edpRecordInfo.AggregatedImportDataJson[key] = taskData[key];
			}
		}

		return dataAccess.saveEdpRecordInfo(edpRecordInfo);
	};	


// here is the object the outside world will see	
	return {
		ProcessEdpSynchTask: doProcessEdpSynchTask
	};

};
