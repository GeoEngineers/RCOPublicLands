$.ajax({
    url:  'http://localhost:1337/loginUser',
    type: 'post',
    beforeSend: function (xhr) {
        // user@test.com:pwd ===base64===> dXNlckB0ZXN0LmNvbTpwd2Q=
        xhr.setRequestHeader ("Authorization", "Basic dXNlckB0ZXN0LmNvbTpwd2Q=");
    },
    success: function(result){
        console.log(result);
        wells(result.LoginToken);
    },
});


var wells = function(loginToken){
    $.ajax({
        url:  'http://localhost:1337/synchStatus',
        type: 'get',
        beforeSend: function (xhr) {
            xhr.setRequestHeader ("Authorization", loginToken);
        },
        success: function(result){
            console.log(result);
        },
    });
};
