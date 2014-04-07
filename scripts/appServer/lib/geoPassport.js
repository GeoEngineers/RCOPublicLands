var passport = require('passport');
var BasicStrategy = require('passport-http').BasicStrategy;
var TokenStrategy = require('./ext/passport/token.js');

exports.initialize = function(basicLoginHandler, tokenLoginHandler){

	passport.use(
		new BasicStrategy(
			function(username, password, done) {
				var dbUser = false;
				basicLoginHandler(username, password)
				.then(function(dbUser){
					return done(null, dbUser);
				})
				.otherwise(function(error){
					return done(null, false, error);
				});
		})
	);

	passport.use(
			new TokenStrategy(
				function(loginToken, done) {
					var dbUser = false;
					tokenLoginHandler(loginToken)
					.then(function(dbUser){
						return done(null, dbUser);
					})
					.otherwise(function(error){
						return done(null, false, error);
					});
			})

	);

	exports.tokenAuth = passport.authenticate('token', {session: false});
	exports.basicAuth = passport.authenticate('basic', {session: false});

};


