var moment = require('moment');

// geo references
var geoAppConfig = require('./../../lib/geoAppConfig.js');
var geoBookshelfEntityManager = require('./../../lib/geoBookshelfEntityManager.js');

var dbConfig = geoAppConfig.buildDbConfig('GeoLogger');

var entityManagers =	geoBookshelfEntityManager.CreateEntityManagerSet({
	DbConfig:			dbConfig,
	Exports:			exports,
	SchemaName: 	'geo_logger',
	EntityInfos: 		{
		LogEntry:				{
			TableName:		'log_entry',
		},
	},
});

	
exports.getRecentGeoLogEntries = function(n) {
	return entityManagers.LogEntry.EntityQuery()
	.orderBy('id', 'desc')
	.limit(n)
	.execute()
	.then(function(resultSet){
		return resultSet === null ? [] : resultSet;
	});
};