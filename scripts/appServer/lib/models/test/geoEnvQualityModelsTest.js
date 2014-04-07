global.UnitTestMode = true;

var should = require('should');
var uuid = require('node-uuid');

var target = require('./../geoEnvQualityModels.js');

describe('geoEnvQualityModels', function(){
	it('should log the geoEnvQualityModels interface', function(done){
		console.log(target);
		done();
	});
	
	it('should exercise crud using analyte unit type', function(done){
		var testId = uuid.v4();
		target.saveAnalyteUnitsType({
			Name:	testId,
		})
		.then(function(result){
			result.Id.should.be.ok;
			result.Name.should.equal(testId);
			return target.getAnalyteUnitsTypeById(result.Id);
		})
		.then(function(result){
			result.Name.should.equal(testId);
			return target.deleteAllAnalyteUnitsTypes();
		})
		.then(function(result){
			result.should.be.ok;
			return target.getAllAnalyteUnitsTypes();
		})
		.then(function(result){
			result.length.should.not.be.ok;
			done();
		})
		.otherwise(done);
		
	});
	
});
