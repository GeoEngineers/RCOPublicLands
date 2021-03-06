﻿GeoAppBase.initializePage("Map", [], function(options){
	var versionCheck = GeoAppBase.msieVersion();
	if(versionCheck <= 8 && versionCheck !== false){
		window[ApplicationName].router.navigate("VersionError", true);
	}else{
		//in case we just come back to the map, clean it up
		if(MainApplication.Map !== undefined){
			MainApplication.Map.remove();
			delete MainApplication.Map;
		}
		
		MainApplication.defaultMarker = new Todo().getTodoLeafletMarker("teal");
		MainApplication.models.dnrModel = new DnrModel();
		MainApplication.boundaries = [];

		_.each(BootstrapVars.boundaries, function(boundary)
		{
			MainApplication.boundaries.push(boundary);
		});

		//continue app as normal after, might become a callback to sync queue depending on promise structure
		MainApplication.views.mapView = new MapView({
			dnrResources: MainApplication.models.dnrModel
		});

		MainApplication.mainRegion.show(MainApplication.views.mapView);
		
		MainApplication.views.headerView = new HeaderView();
		MainApplication.headerRegion.show(MainApplication.views.headerView);

		MainApplication.views.mapSelectorSlideView = new MapSelectorSlideView();
		MainApplication.views.mapSelectorSlideView.openMinimized=true;
		MainApplication.slideRegion.show(MainApplication.views.mapSelectorSlideView);
	}	
});