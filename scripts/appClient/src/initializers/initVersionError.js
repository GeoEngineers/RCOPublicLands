GeoAppBase.initializePage("VersionError", [], function(options){
	MainApplication.views.versionErrorView = new VersionErrorView({});
	MainApplication.mainRegion.show(MainApplication.views.versionErrorView);
});