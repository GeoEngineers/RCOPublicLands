var uuid = require('node-uuid');
var moment = require('moment');

var target = require('./../geoSynchQueue.js');


describe('geoSynchQueue', function(){

	it('should save a list of queue items', function(done){
		var testId = uuid.v4();
		
		target.addSynchEventsToQueue([
			{
				Uid:									testId,
				RequestType: 					'TestSynchEvent',
				QueueName: 					'TestQueue',
				JsonAttributes:					{ TestId:	testId},
				ScheduledTimestamp:		moment().format(),
			}
		])
		.then(function(result){
			console.log(result);
			done();
		});
	});

});