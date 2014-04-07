var should = require('should')
var geoLogger = require('./../geoLogger.js');
var when = require('when');
var uuid = require('node-uuid');

var testId = 'test-' + uuid.v4();

describe('theTest', function(){

	it('should log an entry', function(done){
		geoLogger.logMessage('Low', 'Api', testId, "test")
		.then(function(result){
			result.should.be.ok;
			done();
		});
	});
	
	it('should exercise the logger with assertions', function(done){
		geoLogger.truncateGeoLog()
		.then(function() {
			return when(geoLogger.getRecentGeoLogEntries(10));
		})
		.then(function (result) {
			result.length.should.equal(0);
			return geoLogger.logMessage('Low', 'Api', testId, "test");
		})
		.then(function (result) {
			result.should.be.ok;
			return when(geoLogger.getRecentGeoLogEntries(10));
		})
		.then(function (result) {
			result.length.should.equal(1);
			return when(geoLogger.logMessage('Low', 'Api', testId, "test"));
		})
		.then(function (result) {
			result.should.be.ok;
			return when(geoLogger.getRecentGeoLogEntries(10));
		})
		.then(function (result) {
			result.length.should.equal(2);
			return geoLogger.truncateGeoLog();
		})
		.then(function(result) {
			result.should.equal(2);
			return when(geoLogger.getRecentGeoLogEntries(10));
		})
		.then(function (result) {
			result.length.should.equal(0);
		})
		.then(done);
	})
});
