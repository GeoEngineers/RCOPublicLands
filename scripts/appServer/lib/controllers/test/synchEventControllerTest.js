global.UnitTestMode = true;

var uuid = require('node-uuid');
var should = require('should');

var target = require('./../geoSynchEventController.js');
var gsqm = require('./../../lib/models/geoSynchQueueModels.js');

describe('geoSynchEventController', function(){

	describe('post a set of SynchEvents from a client', function(){
	
		it('should successfully save a set of SynchEvents', function(done){
			var req = {
				params:	{
					SynchEvents:	[
						{
							RequestType:				'BlockingRequestSpoofer',
							EventData:					JSON.stringify({TimeOut: 200}),
							Uid:								uuid.v4()
						},
						{
							RequestType:				'SimplePing',
							EventData:					JSON.stringify({Message: 'The yellow wasp likes grape jelly.'}),
							Uid:								uuid.v4()
						},
					]
				}
			};
			
			var res = {
				send:	function(message){
					console.log(message);
					message.should.equal('success');
					
					gsqm.getQueuedEvents()
					.then(function(result){
						result.length.should.equal(req.params.SynchEvents.length);
						done();
					})
					.otherwise(done);
				},
				done:	done
			};
			
			gsqm.clearQueue()
			.then(function(){
				return target.processClientSynchEvents(req, res);
			});
			
		});
	
	});

		describe.only('post a set of SynchEvents from a client', function(){
	
		it('should successfully save a set of SynchEvents that have been posted to the controller by jonny', function(done){
			var req = {
				params:	{
					SynchEvents:	[{
						"Uid": "fd14b9a8-caf4-b421-4f4d-73cda3c28d5c",
						"QueueName": "Default",
						"RequestType": "NewTodoItem",
						"QueuedTimestamp": "2014-01-16T16:38:37.815Z",
						"SynchStatus": "Queued",
						"EventData": "{\"Description\":\"New Todo99\",\"Status\":\"Incomplete\",\"Latitude\":47.0439255239614,\"Longitude\":-121.12976074218749}",
						"ResultMessage": ""
					}]
				}
			};
			
			var res = {
				send:	function(message){
					console.log(message);
					message.should.equal('success');
					console.log('let us see what is in the queue');
					
					return gsqm.getQueuedEvents()
					.then(function(result){
						console.log(result);
						result.length.should.equal(req.params.SynchEvents.length);
						done();
					})
					.otherwise(function(error){
						done(error);
					});
				},
				done:	done
			};
			
			gsqm.clearQueue()
			.then(function(){
				return target.processClientSynchEvents(req, res);
			});
			
		});
	
	});
});