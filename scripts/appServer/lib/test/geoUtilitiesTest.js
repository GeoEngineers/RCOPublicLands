global.UnitTestMode = true;

var geoUtilities = require('./../geoUtilities');

var dbStyleObject = {
	id:			1,
	the_data:	'the data'
};

var ccStyleObject = {
	Id:			1,
	TheData:		'the data'
};

describe('camel testing', function(){
	it('convert from snake case properties to upper camel case', function(done){
		var actual = geoUtilities.upperCamelCaseify(dbStyleObject);
		JSON.stringify(actual).should.equal(JSON.stringify(ccStyleObject));		
		done();
	});

	it('convert from upper camel case properties to snake case', function(done){
		var actual = geoUtilities.snakeCaseify(ccStyleObject);
		JSON.stringify(actual).should.equal(JSON.stringify(dbStyleObject));		
		done();
	});
	

	it.only('convert from snake case to ucc a single string it sould', function(done){
		var actual = geoUtilities.upperCamelCaseifyString('rco');
		JSON.stringify(actual).should.equal(JSON.stringify('R	co'));		
		done();
	});
	
});
