//Models
var GenericModel = Backbone.Model.extend({
    urlRoot: 'api/modelname',
    idAttribute: 'Id'
});

var DnrModel = Backbone.Model.extend({
    urlRoot: 'dnrResources',
    idAttribute: 'Id',
	initialize: function(){
		this.set(BootstrapVars.areaStats);
	}
});

//Collections
var GenericCollection = Backbone.Collection.extend({
    url: 'api/modelname',
    model: GenericModel
});