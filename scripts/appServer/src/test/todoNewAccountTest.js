var uuid = require('node-uuid');
var should = require('should');

var geoWorkflow = require('./../../lib/geoWorkflow.js');
var geoLoginWorkflow = require('./../../lib/workflow/geoLoginWorkflow.js');

var target = require('./../todo.js');

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
			return geoLoginWorkflow.requestNewAccountEmail(contact);
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