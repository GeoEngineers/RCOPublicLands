var logger = require('./../../lib/geoLogger.js');

exports.getRecentGeoLogEntries = function (request, response, next){
	logger.getRecentGeoLogEntries(20)
		.then(function (result) {
			console.log('success');
			response.send(result);
		})
		.otherwise(function (error) {
			console.log('error' + error);
			response.send(error);
		});
};

