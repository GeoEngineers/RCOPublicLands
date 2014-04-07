global.UnitTestMode = true;

var todoListController = require('./../todoListController.js');
var when = require('when');
var uuid = require('node-uuid');

var testName = 'test: ' + uuid.v4();

var req = {
	returnAfterSend: true,
	params: {
		newTodoListItem: { 
			description: testName,
			latitude: 46.93901161506044,
			longitude: -121.431884765625,
			status: 'Incomplete'
		}
	}
};

var res = {
	send: function (message) {
		console.log(message);
	}
};

describe('todoListController', function(){
	it('should successfully save a new todoItem', function(done){
		todoListController.saveTodoListItem(req, res, done);
	});
});


