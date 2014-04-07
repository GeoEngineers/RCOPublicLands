var uuid = require('node-uuid');
var should = require('should');

var geoWorkflow = require('./../../geoWorkflow.js');
var target = require('./../geoLoginWorkflow.js');

describe('geoLoginWorkflow', function(){

	it.only('should request a new account email', function(done){
	
		var testId = uuid.v4();
		
		var contact = {
			Uid:		testId,
			Email:	'stlbucket@gmail.com',
			Login:	'stlbucket@gmail.com',
		};
		
		geoWorkflow.clearWorkflowQueue()
		.then(function(){
			return target.requestNewAccountEmail(contact);
		})
		.then(function(result){
			console.log(result);
			result.should.be.ok;
			return geoWorkflow.processNextWorkflowTask();
		})
		.then(function(result){
			console.log(result);
			done();
		});
	});

	it('should request a password reset email', function(done){
	
		var testId = uuid.v4();
		
		var contact = {
			Uid:		testId,
			Email:	'stlbucket@gmail.com',
			Login:	'stlbucket@gmail.com',
		};
		
		geoWorkflow.clearWorkflowQueue()
		.then(function(){
			return target.requestPasswordResetEmail(contact);
		})
		.then(function(result){
			console.log(result);
			result.should.be.ok;
			return geoWorkflow.processNextWorkflowTask();
		})
		.then(function(result){
			console.log(result);
			done();
		});
	});

});