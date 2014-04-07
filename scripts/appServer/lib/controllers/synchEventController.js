var moment = require('moment');

var geoSynchQueue = require('./../../lib/geoSynchQueue.js');

exports.processClientSynchEvents = function(req, res, next) {
	geoSynchQueue.addSynchEventsToQueue(req.params.SynchEvents)
	.then(function(result){
		res.send('success');
		return next();
	})
	.otherwise(function(result){
		res.send('error');
		return next();
	});
};


exports.synchStatus = function(req, res, next) {
	geoSynchQueue.getSynchStatus()
	.then(function(result){
		res.send(result);
		return next();
	})
	.otherwise(function(result){
		res.send('error');
		return next();
	});
};
