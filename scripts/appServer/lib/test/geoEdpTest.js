var should = require('should');
var uuid = require('node-uuid');
var moment = require('moment');

var target = require('./../geoEdp.js');
var dataAccess = require('./../models/geoWorkflowModels.js');
var geoWorkflow = require('./../geoWorkflow.js');

describe('geoEdp', function(){

	describe('simple ping', function(){
		it('should process a simple ping event', function(done){
			var testId = uuid.v4();
			var queueName = 'EdpUnitTest: ' + testId;
			
			var edpSynchManager = target.registerEdpSynchManager({
				TaskType: 'TestEdpSimplePingSynch',  
				TableName: 'test',
				EdpRecordToEntityAggregator: function(edpRecordInfo) {
					return edpRecordInfo;
				}
			});

			return dataAccess.clearWorkflowQueue(queueName)
			.then(function(){
				return geoWorkflow.addWorkflowTask({
					TaskType:				'TestEdpSimplePingSynch',
					DataJson:					{
						EdpId:							1,
						ExternalRecordId:			testId,
						InternalTableName:		'test',
						Message: 						'SimplePing - ' + testId,
					},
					Uid:								uuid.v4(),
					QueueName:					queueName,
					ScheduledTimestamp:	moment().format(),
				})
			})
			.then(function(){
				return geoWorkflow.processNextWorkflowTask(queueName);
			})
			.then(function(result){
				result.ProcessStatus.should.equal('COMPLETE');
				(result.ResultMessage === null).should.be.true;
				done();
			})
			.otherwise(done);
		});

		it('should process a error event', function(done){
			var testId = uuid.v4();
			var queueName = 'EdpUnitTest: ' + testId;
			
			var edpSynchManager = target.registerEdpSynchManager({
				TaskType: 'TestEdpError',  
				TableName: 'error',
				EdpRecordToEntityAggregator: function(edpRecordInfo) {
					throw 'An Error Message From the Aggregator';
				}
			});

			return dataAccess.clearWorkflowQueue(queueName)
			.then(function(){
				return geoWorkflow.addWorkflowTask({
					TaskType:				'TestEdpError',
					DataJson:					{
						EdpId:							1,
						ExternalRecordId:			testId,
						InternalTableName:		'error',
						Message: 						'TestEdpError - ' + testId,
					},
					Uid:								uuid.v4(),
					QueueName:					queueName,
					ScheduledTimestamp:	moment().format(),
				})
			})
			.then(function(){
				return geoWorkflow.processNextWorkflowTask(queueName);
			})
			.then(function(result){
				result.ResultMessage.should.equal('An Error Message From the Aggregator');
				result.ProcessStatus.should.equal('ERROR');
				done();
			})
			.otherwise(done);
		});
		
	});	
});	