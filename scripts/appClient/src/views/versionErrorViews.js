var VersionErrorView = Backbone.Marionette.Layout.extend({
	template: function (serialized_model) {
		return Handlebars.buildTemplate(serialized_model, MainApplication.Templates.VersionErrorTemplate);
	}
});	
