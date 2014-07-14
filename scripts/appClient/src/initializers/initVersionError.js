GeoAppBase.initializePage("VersionError", [], function(options){
	//continue app as normal after, might become a callback to sync queue depending on promise structure
	MainApplication.views.versionErrorView = new VersionErrorView({});
	MainApplication.mainRegion.show(MainApplication.views.versionErrorView);
});