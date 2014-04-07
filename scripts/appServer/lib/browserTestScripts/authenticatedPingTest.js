$.ajax({
    url:  'http://localhost:1337/loginUser',
    type: 'post',
    beforeSend: function (xhr) {
        // user@test.com:pwd ===base64===> dXNlckB0ZXN0LmNvbTpwd2Q=
        xhr.setRequestHeader ("Authorization", "Basic dXNlckB0ZXN0LmNvbTpwd2Q=");
    },
    success: function(result){
        console.log(result);
        authenticatedPing(result.LoginToken);
    },
});


var authenticatedPing = function(loginToken){
    $.ajax({
        url:  'http://localhost:1337/authenticatedPing',
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
            //tokenPing(loginToken);
        },
    });
};

