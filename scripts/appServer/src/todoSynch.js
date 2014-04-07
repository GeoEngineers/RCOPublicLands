var when = require('when');

var todo = require('./todo.js');
var geoWorkflow = require('./../../appServer/lib/geoWorkflow.js');


geoWorkflow.registerWorkflowTaskProcessor({
	TaskType: 'NewTodoItem',  
	WorkflowTaskProcessor:	function(task) {
		return todo.saveTodoListItem(task.DataJson)
		.then(function(result){
			task.ResultMessage = 'Successfully created';
			return task;
		})
	}
});

geoWorkflow.registerWorkflowTaskProcessor({
	TaskType: 'UpdateTodoItem',  
	WorkflowTaskProcessor:	function(task) {
		return todo.saveTodoListItem(task.DataJson)
		.then(function(result){
			task.ResultMessage = 'Successfully updated';
			return task;
		})
	}
});

geoWorkflow.registerWorkflowTaskProcessor({
	TaskType: 'DeleteTodoItem',  
	WorkflowTaskProcessor:	function(task) {
		return todo.deleteTodoListItem(task.DataJson.Id)
		.then(function(result){
			console.log(result);
			task.ResultMessage = 'Successfully deleted';
			return task;
		})
	}
});
