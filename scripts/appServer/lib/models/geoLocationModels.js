//npm references
var bookshelf = require('bookshelf');
var _ = require('lodash');
var when = require('when');
var moment = require('moment');

// geo references
var appConfig = require('./../appConfig.js');
var geoUtilities = require('./../../lib/geoUtilities');
var geoBookshelfEntityManager = require('./../../lib/geoBookshelfEntityManager.js');

var dbConfig = appConfig.settings.GeoThings();
bookshelf.geoThings = bookshelf.initialize(dbConfig);

var GeoLocation = bookshelf.geoThings.Model.extend({
	tableName:  dbConfig.applySchema('geo_location'),
});

var GeoLocations = bookshelf.geoThings.Collection.extend({
	model: GeoLocation
});

var geoLocationBookshelfManager = new geoBookshelfEntityManager.CreateEntityManager({
	Exports:					exports,
	Schema:					dbConfig.schema,
	Entity:						GeoLocation,
	EntityCollection:		GeoLocations,
});
