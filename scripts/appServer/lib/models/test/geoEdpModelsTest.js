var uuid = require('node-uuid');
var should = require('should');

var target = require('./../geoEdpModels.js');

var testId = uuid.v4();


describe('geoSynchQueueModels', function(){

	describe('-external data partner marker info:  ', function(){
		var testId = uuid.v4();

		it('should log the interface', function(done){
			console.log(target);
			done();
		});
	});

});
// describe('geoSynchQueueModels', function(){

	// describe('-external data partner marker info:  ', function(){
		// var testId = uuid.v4();

		// it('should save a new recordInfo and then fetch it back by id', function(done){
			// target.saveEdpRecordInfo({
					// EdpId:										1,  // Test Edp
					// InternalTableName:				'marker',
					// InternalRecordId:					9999,
					// ExternalRecordId:					testId,
					// AggregatedImportData:			{ TestData:	'Test Data' }
			// })			
			// .then(function(result){
				// (result.Id > 0).should.be.true;
				// return target.getEdpRecordInfo({id: result.Id});
			// })
			// .then(function(result){
				// (result.Id > 0).should.be.true;
				// result.ExternalRecordId.should.equal(testId);
				// console.log(result);
				// done();
			// })
			// .otherwise(done);
		// });
	// });

// });