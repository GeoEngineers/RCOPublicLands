
var testId = GeoAppBase.guid();

var newUserInfo = {
    		FirstName:			'Test',
    		LastName:				testId,
    		Email:					testId + '@test.com',
    		ApplicationObjects:   {
        		HomePort:				{ 
        			MercatorLat:		'47.61',
        			MercatorLon:		'-122.2',
        		},
        		BoatSize:				5,
    		},
    	};
    	
var registerNewUser = function(newUserInfo){
    $.ajax({
        url:  'http://localhost:1337/registerNewUser',
        type: 'post',
        data: newUserInfo,
        success: function(result){
            console.log(result);
            registerNewUserAgain(result.Uid, 'pwd');
        },
    });
};

var registerNewUserAgain = function(newUserInfo){
    $.ajax({
        url:  'http://localhost:1337/registerNewUser',
        type: 'post',
        data: newUserInfo,
        success: function(result){
            console.log(result);
        },
    });
};

registerNewUser(newUserInfo);
