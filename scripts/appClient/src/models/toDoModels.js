var QueuedTodo = Backbone.Model.extend({
	idAttribute: "Id",
	urlRoot: MainApplication.hostURL + '/processClientSynchEvents'	
});

Backbone.SynchModel = Backbone.Model.extend({
	//disabled for now
	destroy : function(options) { 
		if(options !== undefined &&	options!== null && options.success !== undefined){
			var cb=options.success;
		}else{
			var cb=function(){};
		}
		var model = this;
		GeoAppBase.localDatabaseModelDelete("todoItems",this.get("Id"));
		if(GeoAppBase.connectionAvailable()){
			return Backbone.Model.prototype.destroy.call(this, options);		
		}else{
			var guid = GeoAppBase.guid();
			var queueObject = { 
				"Uid": guid,			
				"RequestType": 'DeleteTodoItem',
				"EventData" : this.get("Id")
			};
			MainApplication.activeSynchQueue.push(queueObject);
			GeoAppBase.localDatabaseModelSet("todoItemQueue",queueObject,null,"Uid");
			this.collection.remove(this);
			cb(model);
			return false;
		}
	},
	save : function(options) { 
		if(options !== undefined &&	options!== null && options.success !== undefined){
			var cb=options.success;
		}else{
			var cb=function(){};
		}
		var model = this;
		if(GeoAppBase.connectionAvailable()){
			return Backbone.Model.prototype.save.call(this, options);		
		}else{
			var guid = GeoAppBase.guid();
			options.Id = this.get("Id");
			var queueObject = { 
				"Uid": guid,			
				"RequestType": 'UpdateTodoItem',
				"EventData": options.newTodoListItem
			};
			MainApplication.activeSynchQueue.push(queueObject);
			model.set(options);
			GeoAppBase.localDatabaseModelSet("todoItemQueue",queueObject,null,"Uid");
			GeoAppBase.localDatabaseModelSet("todoItems",options,null,"Id");
			cb !== false ? cb() : false;
			return false;
		}
	}
});


var Todo = Backbone.SynchModel.extend({
	idAttribute: "Id",
	urlRoot : MainApplication.hostURL + '/todos',
	defaults: {
		Description: '',
		Status: "Incomplete"
	},
	getTodoLeafletMarker : function(color){
		var thisIconName = GeoAppBase.testPhonegap() === true ? "marker-icon-large" : "marker-icon";
		var valX = GeoAppBase.testPhonegap() === true ? 35 : 25;
		var valY = GeoAppBase.testPhonegap() === true ? 57 : 15;
		var thisMarker = L.divIcon({ 
			iconSize: new L.Point(valX,valY),
			html: this.buildMarkerTemplate( thisIconName, color )
		});	
		return thisMarker;
	},
	buildMarkerTemplate: function(iconName, iconColor){
		var templateHTML = "<div class='markerIconCustom'>"+
			"<img src='content/images/"+iconName+"-{{iconColor}}.png' class='markerImage' />"+
		"</div>";
		var template = Handlebars.buildTemplate({ iconName: iconName, iconColor: iconColor }, templateHTML);
		return template;
	}	 
});


//////////////////////////Collections
var QueuedTodos = Backbone.Collection.extend({
	url: MainApplication.hostURL + '/processClientSynchEvents',
	model: QueuedTodo
});

Backbone.SynchCollection = Backbone.Collection.extend({
	create : function(data, options) {
		options !== undefined ? false : options={};
		var cb = options.success;
		var collection = this;
		return Backbone.Collection.prototype.create.call(this, data, options);		
	},
	fetch : function(options) {
		options !== undefined ? false : options={} ;
		var cb = options.success !== undefined ? options.success : function(){};
	    var collection = this;
		return Backbone.Collection.prototype.fetch.call(this, options);		
	}
});

var Todos = Backbone.SynchCollection.extend({
	url: MainApplication.hostURL + '/todos',
	model: Todo
});