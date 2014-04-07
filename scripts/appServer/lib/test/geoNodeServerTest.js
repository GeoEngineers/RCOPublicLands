var target = require('../geoNodeServer.js');

describe('geoNodeServer', function(){
	it('should report out geoNodeServer', function(done){
		console.log(target);
		done();
	});
	
	it.skip('should start the geoNodeServer', function(done){
		this.timeout(20000);
		target.startServer();
//		done();
	});
});