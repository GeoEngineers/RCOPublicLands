var target = require('../geoAppRoutes.js');

var geoPassport = require('../geoPassport.js');

describe('geoAppRoutes', function(){
	
	it('should register some app routes', function(){
		target.registerAppRouteMap([
			{
				Type:					'post',
				Url:						'/test1',
				Handler:				function(req, res, next){res.send('success test1');next();},
				Auth:					geoPassport.basicAuth,
			},
			{
				Type:					'get',
				Url:						'/test2',
				Handler:				function(req, res, next){res.send('success test2');next();},
				Auth:					geoPassport.tokenAuth
			}
		]);
	});


});

