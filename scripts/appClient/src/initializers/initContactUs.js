GeoAppBase.initializePage("ContactUs", [], function(options){
    MainApplication.views.ContactUsView = new ContactUsView({
    });
    MainApplication.mainRegion.show(MainApplication.views.ContactUsView)
});
