var when = require('when');

var todo = require('./todo.js');
var geoSynchQueue = require('./../../appServer/lib/geoSynchQueue.js');


geoSynchQueue.registerSynchEventProcessor({
	RequestType: 'NewTodoItem',  
	SynchEventProcessor:	function(event) {
		console.log(event);
		return todo.saveTodoListItem(event.EventData)
		.then(function(result){
			event.ResultMessage = 'Successfully created';
			return event;
		})
	}
});

geoSynchQueue.registerSynchEventProcessor({
	RequestType: 'UpdateTodoItem',  
	SynchEventProcessor:	function(event) {
		return todo.saveTodoListItem(event.EventData)
		.then(function(result){
			event.ResultMessage = 'Successfully updated';
			return event;
		})
	}
});

geoSynchQueue.registerSynchEventProcessor({
	RequestType: 'DeleteTodoItem',  
	SynchEventProcessor:	function(event) {
		return todo.deleteTodoListItem(event.Id)
		.then(function(result){
			event.ResultMessage = 'Successfully deleted';
			return event;
		})
	}
});
