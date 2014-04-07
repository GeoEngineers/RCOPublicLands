describe('b64', function(){

	it('should encode', function(done){
		console.log(new Buffer('user@test.com:pwd').toString('base64'));
		done();
	});

});
