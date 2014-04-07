var moment = require('moment');

// geo references
var geoAppConfig = require('./../../lib/geoAppConfig.js');
var geoBookshelfEntityManager = require('./../../lib/geoBookshelfEntityManager.js');

var dbConfig = geoAppConfig.buildDbConfig('GeoEdp');

var entityManagers =	geoBookshelfEntityManager.CreateEntityManagerSet({
	DbConfig:			dbConfig,
	Exports:			exports,
	SchemaName: 	'geo_edp',
	EntityInfos: 		{
		ExternalDataProvider:				{
			TableName:		'external_data_provider',
		},
		EdpRecordInfo:				{
			TableName:		'edp_record_info',
		},
	},
});

exports.queryForEdpRecordInfo = function(options){
	return entityManagers.EdpRecordInfo.EntityQuery()
	.where('internal_table_name', '=', options.InternalTableName)
	.andWhere('edp_id', '=', options.EdpId)
	.andWhere('external_record_id', '=', options.ExternalRecordId)
	.execute()
	.then(function(resultSet){
		return resultSet === null ? null : resultSet[0];
	});
};

	
// var bookshelf = require('bookshelf');
// var _ = require('lodash');
// var when = require('when');
// var moment = require('moment');

// var appConfig = require('./../../src/appConfig.js');
// var geoUtilities = require('./../geoUtilities');

// var DEFAULT_QUEUE_NAME = 'Default';

// var dbConfig = appConfig.settings.GeoEdpDbConfig();
// bookshelf.edp = bookshelf.initialize(dbConfig);

// // external data partner record info

// var EdpRecordInfo = bookshelf.edp.Model.extend({
	// tableName:  dbConfig.schema !== undefined ? dbConfig.schema + '.' + 'edp_record_info' : 'edp_record_info',
// });

// var EdpRecordInfos = bookshelf.edp.Collection.extend({
	// model: EdpRecordInfo
// });

// exports.getEdpRecordInfo = function(options){
	// return doGetEdpRecordInfo(geoUtilities.snakeCaseify(options));
// };

// exports.saveEdpRecordInfo = function(recordInfo) {
	// return doSaveEdpRecordInfo(recordInfo);
// };


// //  private methods
// var doSaveEdpRecordInfo = function(recordInfo){
	// var recordInfoId = recordInfo.Id;
	// var dbEdpRecordInfo = new EdpRecordInfo({
		// edp_id: recordInfo.EdpId,
		// internal_table_name: recordInfo.InternalTableName,
		// internal_record_id: recordInfo.InternalRecordId,
		// external_record_id: recordInfo.ExternalRecordId,
		// aggregated_import_data: JSON.stringify(geoUtilities.snakeCaseify(recordInfo.AggregatedImportData)),
		// last_aggregated_timestamp: moment().format(),
		// aggregation_status: recordInfo.AggregationStatus,
		// aggregation_result_message: recordInfo.AggregationResultMessage
	// });
	
	// if (recordInfoId !== undefined && recordInfoId !== null){ dbEdpRecordInfo.set('id', recordInfoId) };
	
	// return dbEdpRecordInfo.save()
	// .then(function(result){
		// return doGetEdpRecordInfo({id: result.id});
	// });
// };

// var doGetEdpRecordInfo = function(options) {
	// return new EdpRecordInfo(options)
	// .fetch()
	// .then(function(result){
		// return doMapEdpRecordInfoFromDb(result);
	// });
// };

// var doMapEdpRecordInfoFromDb = function(dbEdpRecordInfo){
	// var retval = null;
	// if (dbEdpRecordInfo !== undefined && dbEdpRecordInfo !== null) {
		// retval = geoUtilities.upperCamelCaseify(dbEdpRecordInfo.attributes);
		// retval.AggregatedImportData = JSON.parse(retval.AggregatedImportData);
	// }
	// return retval;
// };
