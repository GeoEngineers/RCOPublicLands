var csv = require('fast-csv');
var when = require('when');
var fs = require('fs');

//		options
//	fileName - relative path to the csv file
// headers - true or false - will default to false
// recordHandller - this method will be called for each record and can return a value or a promise
//
// additional options can be added as needed.
exports.geoCsvProcessor = function (options) {
	var self = this;
	self.fileName = options.fileName;
	self.headers = options.headers && true;
	self.recordHandler = options.recordHandler
	
	self.parseCsv = function(deferreds){
		var d = when.defer();
		var deferreds = [];
		
		csv(self.fileName, {headers: self.headers})
		 .on('data', function(data){
			 deferreds.push(self.recordHandler(data));
		 })
		 .on('end', function(){
			d.resolve(deferreds);
		 })
		 .parse();
		
		return d.promise;
	};
	
	return function(){
		return self.parseCsv()
		.then(function(deferreds){
			return when.all(deferreds);
		});
	};
};