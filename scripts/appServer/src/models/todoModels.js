
// geo references
var geoAppConfig = require('./../../lib/geoAppConfig.js');
var geoBookshelfEntityManager = require('./../../lib/geoBookshelfEntityManager.js');
var geoUtilities = require('./../../lib/geoUtilities.js');

var appConfig = require('./../appConfig.js');
var dbConfig = geoAppConfig.buildDbConfig('Todo');

var entityManagers =	geoBookshelfEntityManager.CreateEntityManagerSet({
	DbConfig:			dbConfig,
	Exports:			exports,
	SchemaName: 	'todo',
	EntityInfos: 		{
		TodoUser:				{
			TableName:		'todo_user',
		},
		TodoItem:					{
			TableName:		'todo_item',
		},
	},
});

	