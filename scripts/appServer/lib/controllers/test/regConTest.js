var when = require('when');
var should = require('should');

describe('controller method', function(){

	it('should dynamically generate a controller method', function(done){
		var req = {
			params:	{
				data:	'req data',
			},
		};
		
		var res = {
			send:	function(result){
				result.should.equal('Hi from the worker');
			},
		};

		var registerControllerMethod = function(options){
			var _worker = options.Worker;
			
			return function(req, res, next){
				when(_worker(req))
				.then(function(result){
					res.send(result);
					return next();
				})
				.otherwise(function(error){
					res.send(error);
					return next();
				});
			};
		};

		var worker = function(req){
			return 'Hi from the worker';
		};

		var actual = registerControllerMethod({
			Worker:		worker,
		});
		
		actual(req, res, done);
	});


});
