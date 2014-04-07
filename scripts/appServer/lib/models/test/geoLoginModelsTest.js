var should = require('should');
var uuid = require('node-uuid');

var target = require('./../geoLoginModels.js');

describe('geoLoginModels', function(){
	it('should log the geoLoginModels interface', function(done){
		console.log(target);
		done();
	});
	
	it.only('should get a customer user view by login', function(done){
		target.getCustomerUserViewForLogin('admin@test.com')
		.then(function(result){
			console.log(result);
			result.FirstName.should.equal('Admin');
			return target.getCustomerUserViewForUid(result.Uid);
		})
		.then(function(result){
			console.log(result);
			result.FirstName.should.equal('Admin');
			done();
		});
	});
	
	it('should save a location with mercator_lat and mercator_lon', function(done){
		target.saveLocation({
			mercator_lat:	-76.42113,	
			mercator_lon:	37.26715,
		})
		.then(function(result){
			result.Id.should.be.ok;
			result.Geom.should.be.ok;
			done();
		});
	});

});