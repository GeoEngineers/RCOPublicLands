(function ($) {
    MainApplication.LoadedPages = [];
    MainApplication.viewObjs = [];
    MainApplication.views = [];
    MainApplication.models = [];
    MainApplication.pageInitializer = [];
    MainApplication.Templates = [];
    MainApplication.PageLoader = MainApplication.module("PageLoader", function () {
        //init this and store it for later use
        var page_options = {};
        this.startWithParent = false;
        this.on("before:start", function (options) {
            page_options = options;
            if (MainApplication.mainRegion !== undefined && MainApplication.mainRegion.close !== undefined) { MainApplication.mainRegion.close(); }
            if (MainApplication.pageInitializer !== undefined && MainApplication.pageInitializer[page_options.path] !== undefined) { MainApplication.pageInitializer[page_options.path].stop(); }
            if (MainApplication.views !== undefined) {
                for (var viewToDelete in MainApplication.views) {
					if(viewToDelete !== "indexOf" && MainApplication.views[viewToDelete].close !== undefined){
						MainApplication.views[viewToDelete].close();
					}
                }
            }
            MainApplication.views = [];
            MainApplication.vent.unbind();
        });
        this.on("start", function() {
            //var scoped so we can use this within the module specifically
            var page_source_files = [];
            this.thisPath = page_options.path;
            if (page_options.path !== undefined && page_options.path !== null) {
                if (MainApplication.ConfigFiles !== undefined && MainApplication.ConfigFiles[page_options.path] !== undefined) {
                    var key;
                    var pathTypes = MainApplication.pathsConfig;
                    for (pathData in pathTypes) {
                        if (MainApplication.ConfigFiles[page_options.path][pathTypes[pathData].setName] !== undefined) {
                            for (key in MainApplication.ConfigFiles[page_options.path][pathTypes[pathData].setName]) {
                                page_source_files.push(pathTypes[pathData].path + "/" + pathTypes[pathData].setName + "/" + MainApplication.ConfigFiles[page_options.path][pathTypes[pathData].setName][key][pathTypes[pathData].name] + "?ver=" + MainApplication.appVersion);
                            }
                        }
                    }
                }
                require(page_source_files, function() {
                    MainApplication.PageLoader.stop();
                });
            }
        });
        this.addFinalizer(function () {
            var this_path = this.thisPath;
            MainApplication.LoadedPages.push(this.thisPath);
			if(MainApplication.ConfigFiles[this.thisPath] !== undefined ){
				require(["scripts/appClient/src/initializers/" + MainApplication.ConfigFiles[this.thisPath].initializers  + "?ver=" + MainApplication.appVersion], function () {
					MainApplication.addInitializer(function () {
						MainApplication.mainRegion.once("show", function () {
							var configPageTitle = MainApplication.ConfigFiles[this_path].sectionName !== undefined ? MainApplication.ConfigFiles[this_path].sectionName : "";
							var configPageContainerClass = MainApplication.ConfigFiles[this_path].containerClass !== undefined ? MainApplication.ConfigFiles[this_path].containerClass : "";
							MainApplication.views.sitePageTitle = new SiteMasterTitle({
								pageTitle: configPageTitle
							});
							MainApplication.titleRegion.show(MainApplication.views.sitePageTitle);
							MainApplication.mainRegion.$el.attr("class", configPageContainerClass);
						});
						MainApplication.ApplicationNotificationLoader.runNotifications(page_options);
						GA.logGAPageView();
						MainApplication.pageInitializer[this_path].start(page_options);
					});
				});
			}else{
				$(MainApplication.mainRegion.el).html("The requested page could not be loaded.");
			}
        });
    });
	
    //notification loader
    MainApplication.ApplicationNotificationLoader = {};
    MainApplication.ApplicationNotificationLoader.runNotifications = function (options) {
		//nada
    };	
})(jQuery);