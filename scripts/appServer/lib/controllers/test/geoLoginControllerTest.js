var should = require('should');
var when = require('when');
var uuid = require('node-uuid');


var target = require('../geoLoginController.js');

describe('geoLoginController', function(){
	it('should log the interface', function(done){
		console.log(target);
		done();
	});
});


describe.skip('geoLoginController', function(){
	var testId = uuid.v4();
	
	var newUserInfo = {
			FirstName:			'Test',
			LastName:				testId,
			Email:					testId + '@test.com',
			HomePort:				{ 
				MercatorLat:		47.61,
				MercatorLon:		-122.2,
			},
			BoatSize:				5,
	};
	
	var activatedUserInfo = null;
	
	it('should register a new user', function(done){

		var req = {
			params:	newUserInfo,
		};

		var res = {
			send:	function(result){
				result.Email.should.equal(newUserInfo.Email);
				newUserInfo.Uid = result.Uid;
			}
		};
	
		target.registerNewUser(req, res, done);
	});

	it('should activate the new user', function(done){

		var req = {
			params:	{
				Uid:					newUserInfo.Uid,
				Password:			'pwd',
			},
		};

		var res = {
			send:	function(result){
				result.LicenseStatus.should.equal('ACTIVE');
				activatedUserInfo = result;
			}
		};
	
		target.activateNewUser(req, res, done);
	});

	it('should send a password resent email', function(done){

		var req = {
			params:	{
				Username:		'kburkett@smartmine.com',
			},
		};

		var res = {
			send:	function(result){
				result.should.be.ok;
				//console.log(result);
			}
		};
	
		target.requestPasswordReset(req, res, done);
	});

	it('should not register a new user twice', function(done){
		var req = {
			params:	newUserInfo,
		};

		var res = {
			send:	function(result){
				result.should.equal('a contact with this email address already exists');
			}
		};
	
		target.registerNewUser(req, res, done);
	});

	it('should deactivate the new user', function(done){
		var req = {
			params:	{Username:	activatedUserInfo.Login},
		};

		var res = {
			send:	function(result){
				console.log(result);
				//result.should.equal('a contact with this email address already exists');
			}
		};
	
		target.deactivateUser(req, res, done);
	});

});