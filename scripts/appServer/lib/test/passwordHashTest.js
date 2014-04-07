var passwordHash = require('password-hash');
var should = require('should');



describe('password hash', function(){

	it('should hash and verify a password', function(done){
		
		var hashedPassword = passwordHash.generate('pwd', {
			algorithm:		'sha256',
			saltLength:	24, 
			iterations:		1000
		});

		console.log(hashedPassword);
	
		passwordHash.verify('pwd', hashedPassword).should.be.ok;
		passwordHash.verify('Password0', hashedPassword).should.not.be.ok;
				
		done();
	});
	
});

