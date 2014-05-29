﻿//Initial View Loader
var this_page_name = "Map";
MainApplication.pageInitializer[this_page_name] = MainApplication.module(this_page_name+"Module", function () {
    this.startWithParent = false;
});
//Initial View Loader
MainApplication.pageInitializer[this_page_name].on("start", function (options) {
	MainApplication.defaultMarker = new Todo().getTodoLeafletMarker("teal");
	MainApplication.models.dnrModel = new DnrModel();
	//synching on command:
	//wipe todos, fetch current todos
	var queueItemsPromise=GeoAppBase.localDatabaseCollectionGet("todoItemQueue");
	queueItemsPromise.done(function(data) {		
		MainApplication.activeSynchQueue = data;
		//changes found here
		if(data.length && GeoAppBase.connectionAvailable()){
			var clearPromise = GeoAppBase.localDatabaseCollectionClear("todoItems");
			queueItemsPromise.done(function(d) {
				GeoAppBase.synchTodoQueue();
				//be wary, the content below may need to be made a callback before long
			});
		}
		//continue app as normal after, might become a callback to sync queue depending on promise structure
		MainApplication.models.todos = new Todos();
		MainApplication.views.mapView = new MapView({
			todos: MainApplication.models.todos,
			dnrResources: MainApplication.models.dnrModel
		});
		MainApplication.views.mapView.on("show",function(){
			MainApplication.views.toDoView = new TodoAppView({
				todos : MainApplication.models.todos
			});
			//overwrites previous region on init
			MainApplication.addRegions({
				toDoRegion: "#ToDoContainer"
			});
			MainApplication.toDoRegion.show(MainApplication.views.toDoView);
		});
		MainApplication.mainRegion.show(MainApplication.views.mapView);		
		MainApplication.views.headerView = new HeaderView();
		MainApplication.headerRegion.show(MainApplication.views.headerView);

		var mapSelectorSlideView = new MapSelectorSlideView();
		mapSelectorSlideView.openMinimized=true;
		MainApplication.slideRegion.show(mapSelectorSlideView);
	});
});