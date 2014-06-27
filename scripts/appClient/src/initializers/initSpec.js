//Spec Loader, uses page loader for running
var this_page_name = "Spec";
MainApplication.pageInitializer[this_page_name] = MainApplication.module(this_page_name+"Module", function () {
    this.startWithParent = false;
});
//Initial View Loader
MainApplication.pageInitializer[this_page_name].on("start", function (options) {
	var bootstrap = { "SynchEvents" : [{"Uid":"dc8e3df2-88ce-60e9-1dd3-68da8c4f12e8","QueueName":"Default","RequestType":"NewTodoItem","QueuedTimestamp":"2014-01-22T21:17:58.069Z","SynchStatus":"Queued","EventData":"{\"Description\":\"New Todo\",\"Status\":\"Incomplete\",\"Latitude\":47.635783590864854,\"Longitude\":-122.728271484375}","ResultMessage":""},{"Uid":"f93a1aee-0e18-9613-0771-15ba9e0ccbe4","QueueName":"Default","RequestType":"NewTodoItem","QueuedTimestamp":"2014-01-22T21:18:10.010Z","SynchStatus":"Queued","EventData":"{\"Description\":\"Anohter Todo Oh My!\",\"Status\":\"Incomplete\",\"Latitude\":47.025206001585396,\"Longitude\":-122.71728515624999}","ResultMessage":""},{"Uid":"ee21e8a6-b0c2-0b3d-486b-3be6ef1abd43","QueueName":"Default","RequestType":"UpdateTodoItem","QueuedTimestamp":"2014-01-22T21:18:20.397Z","SynchStatus":"Queued","EventData":"{\"Status\":\"Complete\",\"Id\":24}","ResultMessage":""},{"Uid":"7bca97df-c421-ff94-3685-3ca25e093019","QueueName":"Default","RequestType":"DeleteTodoItem","QueuedTimestamp":"2014-01-22T21:18:21.863Z","SynchStatus":"Queued","EventData":"{\"id\":24}","ResultMessage":""}] }
	MainApplication.queuedModel = new Backbone.Model(bootstrap);
	//console log data for review
	console.log(MainApplication.queuedModel);
	
	describe("A declared queuedModel", function() {
		it("should exist", function() {
			expect(MainApplication.queuedModel).toBeDefined();
		});
		it("should have attributes", function() {
			expect(MainApplication.queuedModel.attributes).toBeDefined();
		});
		it("should be able to resolve spoofed SynchEvents", function() {
			expect(MainApplication.queuedModel.get("SynchEvents")).toBeDefined();
		});
	});	
	MainApplication.jasmineEnv.execute();
});