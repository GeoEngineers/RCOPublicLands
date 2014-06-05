//Initial View Loader
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

		MainApplication.boundaries = [];
		var countiesBoundary = {
			Id: 1,
			Name: "Counties",
			NameField: "COUNTY_NM",
			SelectText: "",
			json: counties,
			jsonLayer: null,
			color: "red"
		};
		var wriasBoundary = {
			Id: 2,
			Name: "WRIAs",
			NameField: "WRIA_NM",
			SelectText: "",
			json: wrias,
			jsonLayer: null,
			color: "blue"
		};
		var congressionalDistictsBoundary = {
			Id: 3,
			Name: "Congressional Districts",
			NameField: "DISTRICT_NR",
			SelectText: "District",
			json: congressionaldistricts,
			jsonLayer: null,
			color: "green"
		};
		var legislativeDistrictsBoundary = {
			Id: 4,
			Name: "Legislative Districts",
			NameField: "DISTRICT_NR",
			SelectText: "District",
			json: legislativedistricts,
			jsonLayer: null,
			color: "orange"
		};
		MainApplication.boundaries.push(countiesBoundary);
		MainApplication.boundaries.push(wriasBoundary);
		MainApplication.boundaries.push(congressionalDistictsBoundary);
		MainApplication.boundaries.push(legislativeDistrictsBoundary);

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
});