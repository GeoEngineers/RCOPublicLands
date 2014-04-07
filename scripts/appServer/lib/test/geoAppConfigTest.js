var when = require('when');
var uuid = require('node-uuid');
var should = require('should');
var target = require('./../geoAppConfig.js');


describe('geoAppConfig', function(){
	
	it.skip('should build a db config', function(done){
		var expected =	{
				client: 'postgres',
				connection: {
					database: 'GeoCore_UnitTest',
					host: '54.244.241.130',
					port: '5432',
					user: 'postgres',
					password: 'P%ssword39',
					charset: 'utf8'
				},
				debug: false
			}

		when(target.buildDbConfig('GeoLogin'))
		.then(function(dbConfig){
		console.log(dbConfig);
			dbConfig.should.exist;
			should.exist(dbConfig.connection.database);
			done();
		})
		.otherwise(done);
		
	});
	
	it('should properly build the app config map', function(done){
		var testId = uuid.v4();
		
		when(target.registerAppConfigMap({
			Servers:		{
				Test:	{
					DefaultWorkflowQueueName:		'Test',
				},
			},
		}))
		.then(function(appConfigMap){
			console.log(appConfigMap);
			appConfigMap.Servers.UnitTest.DefaultWorkflowQueueName.should.equal('UnitTest');
			appConfigMap.Servers.Test.DefaultWorkflowQueueName.should.equal('Test');
			
			return target.registerAppConfigMap({
				Servers:		{
					UnitTest:	{
						DefaultWorkflowQueueName:		'UnitTestaroo',
					},
				},
			});
		})
		.then(function(appConfigMap){
			console.log(appConfigMap);
			appConfigMap.Servers.UnitTest.DefaultWorkflowQueueName.should.equal('UnitTestaroo');
			appConfigMap.Servers.Test.DefaultWorkflowQueueName.should.equal('Test');
			done();
		});
	});

});
