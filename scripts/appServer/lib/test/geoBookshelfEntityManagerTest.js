// npm libs
var uuid = require('node-uuid');
var should = require('should');
var when = require('when');
var util = require('util');
var geojson = require('geojson');

// the test target
var target = require('./../geoBookshelfEntityManager.js');


// for unit testing purposes, we are using a subset of the geo_login schema
// add entities as necessary to test for additional condition not yet inspected
// by these tests.
var dataAccess = {};
var geoAppConfig = require('./../geoAppConfig.js');
var dbConfig = geoAppConfig.buildDbConfig('GeoLogin');
var entityManagers =	target.CreateEntityManagerSet({
	DbConfig:			dbConfig,
	Exports:			dataAccess,
	SchemaName: 	'geo_login',
	EntityInfos: 		{
		ContactView:					{
			TableName:		'contact_view',  // not optional
			DataFormat:		{  // optional
				Name:				'GEOJSON',  // options:  GEOJSON, DEFAULT(camel caseified)
				MercatorLat:		'MercatorLat',
				MercatorLon:		'MercatorLon',
			},
		},
	},
});


// use this id where appropriate to allow for easy db lookups to manually
// verify test data
var testId = uuid.v4();

describe('geoBookshelfEntityManager', function(){
	
	it('should create and display the facade', function(done){
		console.log(dataAccess);
		done();
	});

	it('should get all contact views', function(done){
		dataAccess.getAllContactViews()
		.then(function(result){
			console.log(util.inspect(result, false, null));
			done();
		})
	});
			
});