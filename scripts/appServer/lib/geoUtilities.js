var changeCase = require('change-case');
var should = require('should');
var _ = require('lodash');

exports.upperCamelCaseify = function(obj){
	var retval = {};
	for(prop in obj){
		retval[changeCase.upperCaseFirst(changeCase.camelCase(prop))] = obj[prop];
	};	
	return retval;
};

exports.upperCamelCaseifyString = function(str){
	return changeCase.upperCaseFirst(changeCase.camelCase(str));
};

exports.snakeCaseify = function(obj){
	var retval = {};
	for(prop in obj){
		retval[changeCase.snakeCase(prop)] = obj[prop];
	};	
	return retval;
};
