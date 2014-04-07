var LandingPageView = Backbone.Marionette.Layout.extend({
    template: function (serialized_model) {
        return Handlebars.buildTemplate(serialized_model, MainApplication.Templates.LandingPageView);
    },
    initialize: function (options) {
		this.todos = options.todos;

		this.defaultMap = L.tileLayer('http://a.tiles.mapbox.com/v3/examples.map-y7l23tes/{z}/{x}/{y}.png');
		this.offlineMap = new L.TileLayer.OfflineMBTiles('', {tms:true, minZoom:1, maxZoom: 12,attribution: "Washington"});	
		
		this.mapFirstView = true;
        _.bindAll(this, 'onShow');
    },
    events: {
		"click #lnkOfflineButton" : "setBaseMapOffline",
		"click #lnkDefaultButton" : "setBaseMapDefault",
		"click #lnkSyncQueueData" : "syncLiveData",
		"click #lnkToggleConnection" : "toggleConnection"
	},	
	onShow: function(){
		var dc=this;
		this.bounds = false;
		//set buttons according to internet settings
		this.toggleSetButtons();
		MainApplication.LandingPageMap === undefined ? MainApplication.LandingPageMap = L.mapbox.map('map') : false;
			  
		this.loadCurrentMap();
		MainApplication.LandingPageMap.on("dragstart",function(){
			dc.loadCurrentMap();
		});
		this.createUTFGrid();
		/*
		for (var i = MainApplication.models.todos.length - 1; i >= 0; i--){
			if(MainApplication.models.todos.models[i].attributes.Latitude !== undefined && MainApplication.models.todos.models[i].attributes.Longitude !== undefined){
				todoMarkerItem = this.addMapMarker({
					"lat": MainApplication.models.todos.models[i].attributes.Latitude, 
					"lng": MainApplication.models.todos.models[i].attributes.Longitude 
				});
				todoMarkerItem.todo = MainApplication.models.todos.models[i];
				MainApplication.models.todos.models[i].marker = todoMarkerItem;
				todoMarkerItem.markerToolTip.Description = MainApplication.models.todos.models[i].attributes.Description;
				todoMarkerItem.markerToolTip.Id = MainApplication.models.todos.models[i].attributes.Id;
				todoMarkerItem.markerToolTip.render();
			}
		};
		this.mapFirstView===true ? MainApplication.LandingPageMap.setView([47.2270, -122.1212], 8) : false;*/
		this.mapFirstView=false;
	},
	addMapMarker: function(b){
		var bounds = b;
		var unboundMarker = L.marker([bounds.lat, bounds.lng], {icon: MainApplication.defaultMarker, draggable: false});
		unboundMarker.addTo(MainApplication.LandingPageMap);
		//MainApplication.markerLayer.add_feature(unboundMarker);
		unboundMarker.markerToolTip = new NewMarkerToolTip({
			todos : this.todos,
			marker: unboundMarker
		});
		unboundMarker.bindPopup(unboundMarker.markerToolTip.$el[0], { closeButton:false, closeOnClick:false });
		unboundMarker.openPopup();
		unboundMarker.on("dragend", function(){
			this.openPopup();
		});
		return unboundMarker;
	},
	clearMapMarkers: function(){
		var collection = this.todos;
		for (var x=0;x<this.todos.length;x++){
			todo = this.todos.models[x];
			MainApplication.LandingPageMap.removeLayer(todo.marker);
		};
		return false;
	},
	createUTFGrid: function(){	
		var mapbox = L.tileLayer('http://{s}.tiles.mapbox.com/v3/milkator.press_freedom/{z}/{x}/{y}.png').addTo(MainApplication.LandingPageMap);

		/*var osm = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {attribution: "Map: <a href='http://www.openstreetmap.org/'>&copy | OpenStreetMap </a>contributers"});
  		var esri = L.tileLayer('http://services.arcgisonline.com/ArcGIS/rest/services/World_Physical_Map/MapServer/tile/{z}/{y}/{x}.png', {attribution: "Map: <a href='http://www.arcgis.com/home/item.html?id=c4ec722a1cd34cf0a23904aadf8923a0'>ArcGIS - World Physical Map</a>", maxZoom: 8});
  		var cloudmade = L.tileLayer('http://{s}.tile.cloudmade.com/{key}/{styleId}/256/{z}/{x}/{y}.png', {
			attribution: 'Map data &copy; 2011 OpenStreetMap contributors | Imagery &copy; 2011 CloudMade | Data &copy; 2013 <a href="http://www.reporter-ohne-grenzen.de/ranglisten/rangliste-2013/">ROG/RSF</a>',
			key: 'BC9A493B41014CAABB98F0471D759707',
			styleId: 22677
		});*/
		
		var utfGrid = new L.UtfGrid('http://{s}.tiles.mapbox.com/v3/milkator.press_freedom/{z}/{x}/{y}.grid.json?callback={cb}', {
			resolution: 4,
			maxZoom: 5
		});

		//var popup = L.popup()
		//.setLatLng(latlng)
		//.setContent('<p>Hello world!<br />This is a nice popup.</p>')
		//.openOn(map);
		
		utfGrid.on('mouseover', function(e){ info.update(e);}).on('mouseout', function(e){ info.update();})
		utfGrid.on('click', function(props){
			if(props.data){
				var popup = L.popup()
					.setLatLng(props.latlng)
					.setContent("<h4>Press Freedom in the world &nbsp;&nbsp;&nbsp;&nbsp;</h4>" +  (props ?
						"<values><b>" + props.data.name + "</b><br />Ranking position: <rank>" + props.data.rank+"</rank></values>" : "Select a state"))
					.openOn(MainApplication.LandingPageMap); 
			}
		});

		var info = L.control();
		info.options.position = 'bottomright';
		info.onAdd = function (map) {
		    this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
		    this.update();
		    return this._div;
		};

		info.update = function (props) {
			this._div.innerHTML = "<h4>Press Freedom in the world</h4>" +  (props ?
			"<values><b>" + props.data.name + "</b><br />Ranking position: <rank>" + props.data.rank+"</rank></values>"
			: 'Hover over a state');
		};
		
		/*
		var baseLayers = {
					"Press Freedom - Mapbox" : mapbox,
					"OSM - Mapnik" : osm,
					"OSM - Cloudmade": cloudmade,
					"World Physical - ESRI" : esri
				};
		
		var layerControl = L.control.layers(baseLayers);
		*/
		
		MainApplication.LandingPageMap.setView([30,0], 2)
			.addLayer(utfGrid)
			.addControl(info);
			//.addControl(layerControl);
		
		return false;
	},
	loadCurrentMap: function(){
		if(GeoAppBase.connectionAvailable()){
			MainApplication.LandingPageMap.hasLayer(this.defaultMap)===false ? this.setBaseMapDefault() : false;
		}else{
			MainApplication.LandingPageMap.hasLayer(this.offlineMap)===false ? this.setBaseMapOffline() : false;
		}
		return false;
	},
	resetBaseMaps: function(){
		$("#lnkOfflineButton").removeClass('btn-primary');
		$("#lnkDefaultButton").removeClass('btn-primary');
		
		//console.log(MainApplication.LandingPageMap.hasLayer(this.defaultMap));
		//console.log(MainApplication.LandingPageMap.hasLayer(this.offlineMap));
		
		if (MainApplication.LandingPageMap.hasLayer(this.defaultMap)) {
			MainApplication.LandingPageMap.removeLayer(this.defaultMap);
		}
		if (MainApplication.LandingPageMap.hasLayer(this.offlineMap)) {
			MainApplication.LandingPageMap.removeLayer(this.offlineMap);
		}	
	},
	setBaseMapDefault: function(){
		this.resetBaseMaps();
		$("#lnkDefaultButton").addClass('btn-primary');
		this.defaultMap.addTo(MainApplication.LandingPageMap);
		return false;
	},
	setBaseMapOffline: function(){
		this.resetBaseMaps();
		$("#lnkOfflineButton").addClass('btn-primary');
		this.offlineMap.addTo(MainApplication.LandingPageMap);
		return false;
	},
	syncLiveData: function(){
		//clear local todos as well, we're syncing!
		GeoAppBase.localDatabaseCollectionClear("todoItems");
		var dc = this;
		
		this.clearMapMarkers();
		this.todos.fetch({
			success: function(){
				dc.onShow();
			}
		});
		return false;
	},
	toggleConnection: function(){
		GeoAppBase.toggleConnectionVar();
		this.toggleSetButtons();
		if(MainApplication.connectionActive === true){
			MainApplication.onDeviceOnline();
		}else{
			MainApplication.onDeviceOffline();
		}
	},
	toggleSetButtons: function(){
		if(MainApplication.connectionActive === true){
			$("#lnkToggleConnection").addClass("btn-primary");
			$("#lnkSyncQueueData").css("display","block");
		}else{
			$("#lnkToggleConnection").removeClass("btn-primary");
			$("#lnkSyncQueueData").css("display","none");
		}	
	}
});	


var NewMarkerToolTip = Backbone.Marionette.ItemView.extend({
    template: function (serialized_model) {
		return Handlebars.buildTemplate(serialized_model, MainApplication.Templates.LandingPageNewMarkerTipTemplate);
    },
	templateHelpers: function(){
		return {
			Description: this.Description
		};
	},	
	events: {
		"click .geoEditTodo" : "editTodo",
		"click .geoDeleteTodo" : "deleteTodo"
	},	
	initialize: function(options){
		this.todos = options.todos;
		this.marker = options.marker;
		this.Description = "New Todo"
	},
	editTodo: function(){		
		var todoTitleModal = new TodoTitleModal({
			todos : this.todos,
			marker : this.marker
		});
		todoTitleModal.render();
		
		this.marker.bindPopup(todoTitleModal.$el[0], { closeButton:false, closeOnClick:false, minWidth: 300 });
		this.marker.openPopup();
		return false;
	},
	deleteTodo: function(){
		if(confirm("Are you sure you want to delete this well site, it will not be recoverable.")){
			var thisTodo = this.todos.get(this.Id);
			thisTodo.destroy();
			MainApplication.LandingPageMap.removeLayer(thisTodo.marker);
		}
		return false;
	}
});


var LandingPageFooterView = Backbone.Marionette.ItemView.extend({
    template: function (serialized_model) {
        return Handlebars.buildTemplate(serialized_model, MainApplication.Templates.LandingPageFooterTemplate);
    },
    initialize: function (options) {
		this.todos = options.todos;
		this.genericCollection = options.genericCollection;
        _.bindAll(this, 'loadContactUs', 'addTodos');
    },
	events: {
		"click #lnkContactUs" : "loadContactUs",
		"click #lnkTodos" : "addTodos",
		"click #lnkLocate" : "geoLocate"
	},	
	addTodos: function(){
		//Create new marker
		var bounds = MainApplication.LandingPageMap.getCenter();
		var unboundMarker = L.marker([bounds.lat, bounds.lng], {icon: MainApplication.defaultMarker, draggable: true});
		unboundMarker.addTo(MainApplication.LandingPageMap);
		unboundMarker.markerEditModal = new TodoTitleModal({
			todos : this.todos,
			marker : unboundMarker
		});
		unboundMarker.markerEditModal.render();
		
		unboundMarker.bindPopup(unboundMarker.markerEditModal.$el[0], { closeButton:false, closeOnClick:false, minWidth: 300 });
		unboundMarker.openPopup();
		unboundMarker.on("dragend", function(){
			this.openPopup();
		});
		return false;
	},		
	loadContactUs: function(){
	 	window[ApplicationName].router.navigate("ContactUs", { trigger: true });
		return false;
	},
	geoLocate: function(){
		if (navigator.geolocation) {
			MainApplication.LandingPageMap.once('locationfound', function (e) {
				//MainApplication.geoLocationResults = e;
				MainApplication.LandingPageMap.setView(e.latlng, 13, {animate: false});
			});
			MainApplication.LandingPageMap.once('locationerror', function (e) {
				alert('We could not locate your position.');
			});		
			MainApplication.LandingPageMap.locate();
		}else{
			alert("Geolocation is unavailable on this device.  We apologize for any inconvenience.");
		}
		return false;
	}
});
