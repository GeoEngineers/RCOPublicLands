var when = require('when');
var _ = require('lodash');

var geoWorkflow = require('./geoWorkflow.js');


exports.addSynchEventsToQueue = function(synchEvents){
	var deferreds = [];
	
	_.each(synchEvents, function(synchEvent){
		
		// this is cleanup to support existing implementation of synch queue
		if (!synchEvent.DataJson && synchEvent.Json_Attributes) {
			synchEvent.DataJson = synchEvent.Json_Attributes;
		}
		delete synchEvent.JsonAttributes;

		if (!synchEvent.ProcessStatus && synchEvent.SynchStatus) {
			synchEvent.ProcessStatus = synchEvent.SynchStatus;
		}
		delete synchEvent.SynchStatus;

		if (!synchEvent.TaskType && synchEvent.RequestType) {
			synchEvent.TaskType = synchEvent.RequestType;
		}
		delete synchEvent.RequestType;
		// end cleanup
		
		deferreds.push(geoWorkflow.addWorkflowTask(synchEvent));
	});
	
	return when.all(deferreds);
};


exports.getSynchStatus = function(options){
	var defs = [];

	return when.all([
		dataAccess.getQueuedEvents(),
		dataAccess.getCurrentlyProcessingEvent()
	])
	.then(function(results){
		return {
			SynchStatus:		(results[0].length > 0 || results[1] !== null)
				?	'Processing'
				:	'Complete',
			LastUpdate:		moment().format()
		};
	});
};