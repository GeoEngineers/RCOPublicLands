var target = require('./../geoLoggerModels.js');
var uuid = require('node-uuid');

describe('geoLoggerModels', function(){

	it('should display the interface', function(done){
		console.log(target);
		done();	
	});
	
	it('should save a log entry', function(done){
		var testId = uuid.v4();
		target.saveLogEntry({
			LogLevel: 'High',
			LogCategory: 'Test',
			Source: 'Unit Test',
			Message: testId,
		})
		.then(function(result){
			result.should.be.ok;
			done();
		});
	});
	
});