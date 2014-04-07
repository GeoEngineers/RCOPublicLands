
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
            activateNewUser(result.Uid, 'pwd');
        },
    });
};

var activateNewUser = function(uid, password){

    $.ajax({
        url:  'http://localhost:1337/activateNewUser',
        type: 'post',
        data:   {
    		Uid:			uid,
    		Password:		password,
    	},
        success: function(result){
            console.log(result);
            login(result.Login, 'pwd');
        },
    });
};

var deactivateUser = function(){

    $.ajax({
        url:  'http://localhost:1337/deactivateUser',
        type: 'post',
        data:   {
    		Username:	newUserInfo.Email,
    	},
        success: function(result){
            console.log(result);
            login(newUserInfo.Email, 'pwd');
        },
    });
};


var login = function(username, password){

    var auth = Base64.encode(username+':'+password);
    console.log(username);
    console.log(password);
    console.log(auth);
    
    $.ajax({
        url:  'http://localhost:1337/loginUser',
        type: 'post',
        beforeSend: function (xhr) {
            // user@test.com:pwd ===base64===> dXNlckB0ZXN0LmNvbTpwd2Q=
            xhr.setRequestHeader ("Authorization", 'Basic ' + auth);
        },
        success: function(result){
            console.log(result);
            tokenPing(result.LoginToken);
        },
    });
};

var tokenPing = function(loginToken){
    $.ajax({
        url:  'http://localhost:1337/currentUserInfo',
        type: 'post',
        beforeSend: function (xhr) {
            console
            xhr.setRequestHeader ("Authorization", loginToken);
        },
        success: function(result){
            console.log(result);
            logout(loginToken);
        },
        error: function(error){
            console.log(result);
        },
    });
};

var logout = function(loginToken){
    $.ajax({
        url:  'http://localhost:1337/logoutUser',
        type: 'post',
        beforeSend: function (xhr) {
            console
            xhr.setRequestHeader ("Authorization", loginToken);
        },
        success: function(result){
            console.log(result);
            deactivateUser();
        },
    });
};

registerNewUser(newUserInfo);
