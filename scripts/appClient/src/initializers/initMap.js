GeoAppBase.initializePage("Map", [], function(options){
	MainApplication.defaultMarker = new Todo().getTodoLeafletMarker("teal");
	MainApplication.models.dnrModel = new DnrModel();
	MainApplication.boundaries = [];
	_.each(BootstrapVars.boundaries, function(boundary)
	{
		MainApplication.boundaries.push(boundary);
	});

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

	MainApplication.views.mapSelectorSlideView = new MapSelectorSlideView();
	MainApplication.views.mapSelectorSlideView.openMinimized=true;
	MainApplication.slideRegion.show(MainApplication.views.mapSelectorSlideView);
});