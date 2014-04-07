var bookshelf = require('bookshelf');
var _ = require('lodash');
var when = require('when');
var geojson = require('geojson');

var geoUtilities = require('./geoUtilities');

var doCreateEntityManager = function(options){
	var self = this;
	self.Schema = options.Schema;
	self.Entity = options.Entity;
	self.EntityCollection = options.EntityCollection;
	self.Exports = options.Exports;
	self.DataFormat = options.DataFormat;
	
	self.doMapDbCollectionToEntityCollection = function(dbEntities){
		var d = when.defer();
		var entities =  dbEntities.models.length < 1 ? [] : _.map(dbEntities.models, function(dbEntity){
			return self.doMapDbToEntity(dbEntity);
		});
		
		switch (self.DataFormat.Name) {
			case 'GEOJSON':
				geojson.parse(entities, { 
					Point: [self.DataFormat.MercatorLat, self.DataFormat.MercatorLon] }, 
					function (geoJsonResult){
					d.resolve(geoJsonResult);
				})
				break;
			case 'DEFAULT':
				d.resolve(entities);
				break;
		};
		
		return d.promise;
	};

	self.doMapDbToEntity = options.DbToEntityMapper !== undefined ? options.DbToEntityMapper : function(dbEntity){
		var entity = dbEntity === null ? null : geoUtilities.upperCamelCaseify(dbEntity.attributes);

		if (entity) {
			_.forOwn(entity, function(value, key){
				if (key.indexOf('Json') > 0) {
					entity[key] = JSON.parse(entity[key]);
				};
			});
		}

		return entity;
	};
	
	self.doMapKnexCollectionToEntityCollection = function(dbEntities){
		return dbEntities.length < 1 ? [] : _.map(dbEntities, function(dbEntity){
			return self.doMapKnexToEntity(dbEntity);
		});
	};
	
	self.doMapKnexToEntity = options.DbToEntityMapper !== undefined ? options.DbToEntityMapper : function(dbEntity){
		var entity = dbEntity === null ? null : geoUtilities.upperCamelCaseify(dbEntity);
		
		if (entity) {
			_.forOwn(entity, function(value, key){
				if (key.indexOf('Json') > 0) {
					entity[key] = JSON.parse(entity[key]);
				};
			});
		}
		
		return entity;
	};
	
	self.doMapEntityToDb = options.EntityToDbMapper !== undefined ? options.EntityToDbMapper :	function(entity){
		_.forOwn(entity, function(value, key){
			if (key.indexOf('Json') > 0) {
				entity[key] = JSON.stringify(entity[key]);
			};
		});

		var dbEntity = new self.Entity(geoUtilities.snakeCaseify(entity));
		return dbEntity;
	};

	self.doGetEntity = function(id) {
		return new self.Entity({
			id: id
		})
		.fetch()
		.then(function(result){
			return self.doMapDbToEntity(result);
		});
	};

	self.doQueryEntity = function(clause, field, comparator, value) {
		return new self.Entity()
		.query(clause, field, comparator, value)
		.fetch()
		.then(function(dbEntity){
			return self.doMapDbToEntity(dbEntity);
		});
	};

	self.doQueryCollection = function(clause, field, comparator, value) {
		return new self.EntityCollection()
		.query(clause, field, comparator, value)
		.fetch()
		.then(function(dbEntities){
			return self.doMapDbCollectionToEntityCollection(dbEntities);
		});
	};

	self.getEntityById = function(id) {
			return self.doGetEntity(id);
	};
	
	self.getAllEntities = function(){
		return new self.EntityCollection()
		.fetch()
		.then(function(dbEntities){
			return self.doMapDbCollectionToEntityCollection(dbEntities);
		});
	};

	self.saveEntity = function(entity){		
		var dbEntity = self.doMapEntityToDb(entity);
		return dbEntity.save()
		.then(function(result){
			return self.doGetEntity(result.id);
		})
		.otherwise(function(error){
			return error;
		});
	};
	
	self.saveEntities = function(entities){
		var deferreds = [];
		
		_.each(entities, function(entity){
			deferreds.push(self.saveEntity(entity));
		});
		
		return when.all(deferreds);
	};

	self.deleteEntity = function(id){		
		return new self.Entity({id: id})
			.destroy()
			.then(function(result){
				return 1;
			})
			.otherwise(function(error){
				return error;
			});
	};

	self.deleteAllEntities = function(id){		
		return new self.EntityCollection().query().del();
	};
	
	var tableName = new self.Entity().tableName;
	tableName = self.Schema !== undefined ? tableName.replace(self.Schema+'.','') : tableName;
	var entityExternalName = geoUtilities.upperCamelCaseifyString(tableName);
	var entityExternalPluralName = geoUtilities.upperCamelCaseifyString(tableName+'s');

	// define the external interface
	self.Exports['get'+entityExternalName+'ById'] = self.getEntityById;
	self.Exports['getAll'+entityExternalPluralName] = self.getAllEntities;
	
	var retval = {
		Entity:							self.Entity,
		EntityCollection:			self.EntityCollection,
		QueryEntity:					self.doQueryEntity,
		QueryCollection:			self.doQueryCollection,
		
		EntityQuery:					function(){
			var retval = new self.Entity().query();
			
			retval.execute = function(){
				return this.select()
				.then(function(result){
					return self.doMapKnexCollectionToEntityCollection(result);
				});
			};
			
			return retval;
		}
	};
	
	if (entityExternalName.indexOf('View') <= 0) {
		self.Exports['save'+entityExternalName] = self.saveEntity;
		self.Exports['save'+entityExternalPluralName] = self.saveEntities;
		self.Exports['delete'+entityExternalName+'ById'] = self.deleteEntity;
		self.Exports['deleteAll'+entityExternalPluralName] = self.deleteAllEntities;
	};
	
	return retval;

};

var createEntityInfo = function(schemaName, dbEntityInfo, db) {
	var retval = {
		Entity:	db.Model.extend({
			tableName: schemaName + '.' + dbEntityInfo.TableName,
		})
	};
	retval.Collection = db.Collection.extend({
		model: retval.Entity,
	});
	retval.EntityQueries = dbEntityInfo.EntityQueries;
	retval.TableName = dbEntityInfo.TableName;
	retval.EntityName = geoUtilities.upperCamelCaseifyString(dbEntityInfo.TableName);
	retval.DataFormat = dbEntityInfo.DataFormat !== undefined ? dbEntityInfo.DataFormat : { Name: 'DEFAULT' };
	retval.DbToEntityMapper = dbEntityInfo.DbToEntityMapper;
	retval.EntityToDbMapper = dbEntityInfo.EntityToDbMapper;

	return retval;
};


exports.CreateEntityManagerSet = function(dbEntityMap){
	var packageName = geoUtilities.upperCamelCaseifyString(dbEntityMap.SchemaName);
	var entityManagers = {};
	
	if (bookshelf[packageName] === undefined) {
		bookshelf[packageName] = bookshelf.initialize(dbEntityMap.DbConfig);
	
		_.forOwn(dbEntityMap.EntityInfos, function(dbEntityInfo){
			dbEntityInfo = createEntityInfo(dbEntityMap.SchemaName, dbEntityInfo, bookshelf[packageName]);

			entityManagers[dbEntityInfo.EntityName] = new doCreateEntityManager({
				Exports:					dbEntityMap.Exports,
				Schema:					dbEntityMap.SchemaName,
				Entity:						dbEntityInfo.Entity,
				EntityCollection:		dbEntityInfo.Collection,
				DataFormat:				dbEntityInfo.DataFormat,
				DbToEntityMapper:	dbEntityInfo.DbToEntityMapper,
				EntityToDbMapper:	dbEntityInfo.EntityToDbMapper,
			});
		});
	};
	
	return entityManagers;
};
