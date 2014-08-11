/////////////////////CONFIG FILE//////////////////////////
//App Details
//Version 0.0.1 Build Boilerplate
/////////////////////This application declaration//////////////
var ApplicationName = "MainApplication";
window[ApplicationName] = new Backbone.Marionette.Application();
window[ApplicationName].appVersion = '0.0.2';
//Geoengineers main site loader
var GeoAppBase = new Backbone.Marionette.Application();
//indicates offline status, do not change.
MainApplication.clientOfflineMode = false;
///////////////////////////////////////////////////////////////


/////////////////////This application declaration//////////////
MainApplication.jasmineEnv = jasmine.getEnv();
MainApplication.jasmineEnv.updateInterval = 1000;
var htmlReporter = new jasmine.HtmlReporter();
MainApplication.jasmineEnv.addReporter(htmlReporter);
MainApplication.jasmineEnv.specFilter = function(spec) {
	return htmlReporter.specFilter(spec);
};
var currentWindowOnload = window.onload;

//debug override
MainApplication.connectionActive = true;
MainApplication.activeSynchQueue = [];


Backbone.ajaxSync = Backbone.sync;
Backbone.sync = function(method, model, options) {
    options || (options = {});	
	return Backbone.ajaxSync(method, model, options);
}


/////////////////////BACKBONE PROTO////////////////////////////
//fix for marionette template compilation process, advised via the Marionette JS GitHub Repo
Backbone.Marionette.TemplateCache.prototype.compileTemplate = function (rawTemplate) {
    return Handlebars.compile(rawTemplate);
};
///////////////////////////////////////////////////////////////
 

////////////////////Application Details//////////////////////////
MainApplication.LandingPage = "Map";
MainApplication.hostURL = window.location.protocol + "//" + window.location.host;
//path ID 1 is our libraries we bring into the app (as opposed to getting them with bower, this can be for shims, fixes, overrides, whatever, the rest of the paths are arbitrary, and as such as completely flexible, that being said, we store our files in source)
MainApplication.pathsConfig = [
    { "id": "1", "path": "./scripts/appClient", "name": "library", "setName": "lib" },
    { "id": "5", "path": "./scripts/appClient/src", "name": "spec", "setName": "specs" },
    { "id": "2", "path": "./scripts/appClient/src", "name": "model", "setName": "models" },
    { "id": "3", "path": "./scripts/appClient/src", "name": "template", "setName": "templates" },
    { "id": "4", "path": "./scripts/appClient/src", "name": "view", "setName": "views" }
];

//These are the files we use which are stored in the paths above
MainApplication.ConfigFiles = {
    //this page is the default page
    "Map" : {
        "Id": 1,
        "hashPath": "*actions",
        "containerClass": "node-outline",
        "models": [
            { "model" : "toDoModels.js" }
        ],	
        "templates": [
            { "template" : "mapTemplate.js" },
        ],
        "views": [
            { "view": "mapViews.js" },
        ],
        "initializers": "initMap.js"
    },
    "Spec": {
        "Id": 7,
        "sectionName": "Node Boilerplate Spec Runner",
        "containerClass": "node-outline",
        "hashPath": "Spec",
        "models": [
            { "model" : "toDoModels.js" }
        ],		
        "initializers": "initSpec.js"
    },
    "VersionError": {
        "Id": 8,
        "sectionName": "Node Boilerplate Spec Runner",
        "containerClass": "node-outline",
        "hashPath": "VersionError",	
        "templates": [
            { "template": "versionErrorTemplates.js" }
        ],
        "views": [
            { "view": "versionErrorViews.js" }
        ],
        "initializers": "initVersionError.js"
    }		
};  