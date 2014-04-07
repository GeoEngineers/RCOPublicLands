// geo references
var geoAppConfig = require('./../../lib/geoAppConfig.js');
var geoBookshelfEntityManager = require('./../../lib/geoBookshelfEntityManager.js');

var dbConfig = geoAppConfig.buildDbConfig('GeoEnvQuality');

	geoBookshelfEntityManager.CreateEntityManagerSet({
		DbConfig:			dbConfig,
		Exports:			exports,
		SchemaName: 	'geo_env_quality',
		EntityInfos: 		{
		EqUser: {
			TableName: 'eq_user',
		},
		Sample: {
			TableName: 'sample',
		},
		SamplingProjectEqUser: {
			TableName: 'sampling_project_eq_user',
		},
		Result: {
			TableName: 'result',
		},
		SamplingProject: {
			TableName: 'sampling_project',
		},
		AnalyteSampleRequirement: {
			TableName: 'analyte_sample_requirement',
		},
		AnalyteUnitType: {
			TableName: 'analyte_units_type',
		},
		AnalyteType: {
			TableName: 'analyte_type',
		},
		AnalyteLimit: {
			TableName: 'analyte_limit',
		},
		AnalyteSampleSource: {
			TableName: 'analyte_sample_source',
		},
	}
});

