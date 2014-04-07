

exports.ping = function(req, res, next) {
	res.send('hello ' + req.UserInfo.FirstName + ', here is your ping');
	return next();
};



exports.registerAppRouteMap = function(registrar) {
	return registrar({
		GeoPing:	{
			AppRouteMap:		[
				{
					Type:					'post',
					Url:						'/authenticatedPing',
					Handler:				exports.ping,
					Auth:					'token',
				},
			]
		}
	});
};