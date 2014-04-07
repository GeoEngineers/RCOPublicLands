var dataAccess = require('./models/geoLoggerModels.js');

// this construct is mimicking a c# enum - it can be used when calling 
// exports.logMessage to specify a standard value for geoLogLevel
exports.GeoLogLevel = {
	Low: "Low",
	High: "High"
};

// this construct is mimicking a c# enum - it can be used when calling 
// exports.logMessage to specify a standard value for geoLogCategory
exports.GeoLogCategory = {
	Api: "Api",
	Application: "Application",
	Email: "Email",
	TokenLogin: "TokenLogin",
	IncidentDetail: "IncidentDetail",
	UserLogin: "UserLogin",
	ProcessService: "ProcessService",
	WorkflowQueue: "WorkflowQueue",
	SynchQueue:	"SynchQueue"
};

// save a new log entry
exports.logMessage = function (geoLogLevel, geoLogCategory, source, message) {
	return dataAccess.saveLogEntry({
		LogLevel: geoLogLevel,
		LogCategory: geoLogCategory,
		Source: source,
		Message: message,
	})
	.then(function(result){
		return result;
	});
};

// a wrapper for logMessage specifically for logging exceptions
exports.logError = function (geoLogCategory, source, error) {
	return exports.logMessage(geoLogCategory, exports.GeoLogLevel.High, source, error);
};

exports.getRecentGeoLogEntries = function(n) {
	return dataAccess.getRecentGeoLogEntries(n);
};

exports.truncateGeoLog = function () {
	return dataAccess.deleteAllLogEntrys();
};
