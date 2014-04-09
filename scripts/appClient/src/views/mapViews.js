var MapView = Backbone.Marionette.Layout.extend({
    template: function (serialized_model) {
        return Handlebars.buildTemplate(serialized_model, MainApplication.Templates.MapTemplate);
    },
    initialize: function (options) {
		this.todos = options.todos;
		this.dnrResources = options.dnrResources;
		//examples.map-y7l23tes
		
		this.terrainMap = L.tileLayer.provider('MapBox.smartmine.g7poe7h9', { minZoom:4, maxZoom: 13, zIndex: 4 });
		this.imageryMap = L.tileLayer.provider('MapBox.smartmine.map-nco5bdjp', { minZoom:4, maxZoom: 13, zIndex: 4 });
		
		this.dnrLands = new L.mapbox.tileLayer('smartmine.izm5nrk9', { zIndex: 5 });
		this.dnrGrid = new L.UtfGrid('http://{s}.tiles.mapbox.com/v3/smartmine.izm5nrk9/{z}/{x}/{y}.grid.json?callback={cb}', { zIndex: 5 });
		this.blmLands = new L.mapbox.tileLayer('smartmine.yyb3ayvi', { zIndex: 5 });
		this.blmGrid = new L.UtfGrid('http://{s}.tiles.mapbox.com/v3/smartmine.yyb3ayvi/{z}/{x}/{y}.grid.json?callback={cb}', { zIndex: 5 });
		
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

		var welcomeView = new WelcomeView({});
		MainApplication.modalRegion.show(welcomeView);

		this.bounds = false;
		//set buttons according to internet settings
		this.toggleSetButtons();

		MainApplication.Map === undefined ? MainApplication.Map = L.mapbox.map('map',{ minZoom:4, maxZoom: 13 }) : false;
		this.loadCurrentMap();
		MainApplication.Map.on("dragstart",function(){
			dc.loadCurrentMap();
		});
		
		L.control.layers({
			'Terrain': this.terrainMap.addTo(MainApplication.Map),
			'Imagery': this.imageryMap
		},{},{
			position:'bottomleft'
		}).addTo(MainApplication.Map);
		
		this.blmLayer = L.layerGroup([
			this.blmLands,
			this.createGrid(this.blmGrid)
		]);
		this.dnrLayer = L.layerGroup([
			this.dnrLands,
			this.createGrid(this.dnrGrid)
		]);
		
		MainApplication.Map.setView([47,-121], 6)
			.addLayer(this.terrainMap);
		this.mapFirstView=false;
	},
	toggleMapLayer: function(layer){
		if(MainApplication.Map.hasLayer(layer)){
			MainApplication.Map.removeLayer(layer);
		}else{
			MainApplication.Map.addLayer(layer);
		}
	},
	addMapMarker: function(b){
		var bounds = b;
		var unboundMarker = L.marker([bounds.lat, bounds.lng], {icon: MainApplication.defaultMarker, draggable: false});
		unboundMarker.addTo(MainApplication.Map);
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
			MainApplication.Map.removeLayer(todo.marker);
		};
		return false;
	},
	createGrid: function(gridLayer){	
		gridLayer.on('mouseover', function(e){ 
			if(e.data){ info.update(e); }
		}).on('mouseout', function(e){ 
			info.update();
		})
		gridLayer.on('click', function(props){
			if(props.data){
				console.log(props);
				var markerToolTip = new MapTipView({
            		ParcelName: "Parcel",
            		Owner: "Washington DNR",
            		TotalArea: props.data.GISAcres,
            		AquisitionDate: '1/1/2010',
            		Cost: 1000
        		});

        		markerToolTip.render();
				var popup = L.popup()
					.setLatLng(props.latlng)
					.setContent(markerToolTip.$el[0])
					.openOn(MainApplication.Map); 
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
			if(props){
				//this._div.innerHTML = "<h4>Acreage over an area &nbsp;&nbsp;&nbsp;&nbsp;</h4>" +  (props ?
				//	"<values><b>" + props.data.GISAcres + "</b><br />Percentage: <rank>" + props.data.GISAcres +"</rank></values>"
				//: 'Hover over a state');
			}
		};
		
		return gridLayer;
	},	
	loadCurrentMap: function(){
		if(GeoAppBase.connectionAvailable()){
			MainApplication.Map.hasLayer(this.terrainMap)===false ? this.setBaseMapDefault() : false;
		}else{
			MainApplication.Map.hasLayer(this.offlineMap)===false ? this.setBaseMapOffline() : false;
		}
		return false;
	},
	resetBaseMaps: function(){
		$("#lnkOfflineButton").removeClass('btn-primary');
		$("#lnkDefaultButton").removeClass('btn-primary');
		
		//console.log(MainApplication.Map.hasLayer(this.terrainMap));
		//console.log(MainApplication.Map.hasLayer(this.offlineMap));
		
		if (MainApplication.Map.hasLayer(this.terrainMap)) {
			MainApplication.Map.removeLayer(this.terrainMap);
		}
		if (MainApplication.Map.hasLayer(this.offlineMap)) {
			MainApplication.Map.removeLayer(this.offlineMap);
		}	
	},
	setBaseMapDefault: function(){
		this.resetBaseMaps();
		$("#lnkDefaultButton").addClass('btn-primary');
		this.terrainMap.addTo(MainApplication.Map);
		return false;
	},
	setBaseMapOffline: function(){
		this.resetBaseMaps();
		$("#lnkOfflineButton").addClass('btn-primary');
		this.offlineMap.addTo(MainApplication.Map);
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
		return Handlebars.buildTemplate(serialized_model, MainApplication.Templates.MapNewMarkerTipTemplate);
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
			MainApplication.Map.removeLayer(thisTodo.marker);
		}
		return false;
	}
});


var MapFooterView = Backbone.Marionette.ItemView.extend({
    template: function (serialized_model) {
        return Handlebars.buildTemplate(serialized_model, MainApplication.Templates.MapFooterTemplate);
    },
	templateHelpers: function(){
		return { 
			layers : this.layersObject
		}
	},
    initialize: function (options) {
		this.todos = options.todos;
		this.genericCollection = options.genericCollection;
		
        _.bindAll(this, 'loadContactUs', 'addTodos');
    },
	events: {
		"click #lnkToggleBLM" : "actToggleBLMLayer",
		"click #lnkToggleDNR" : "actToggleDNRLayer",
		"click #lnkTodos" : "addTodos",
		"click #lnkSlideMenu" : "loadRightSlide"
	},
	onShow: function(){
		//temp fix until menu is completely ready
		$(document).ready(function() {
			$('.slide-menu').bigSlide({ side:"right", menu:"#SummaryPaneSlideOut" }).css("z-index","1040");
		});
		return false;
	},
	actToggleBLMLayer : function(){
		MainApplication.views.mapView.toggleMapLayer(MainApplication.views.mapView.blmLayer);
		return false;
	},
	actToggleDNRLayer : function(){
		MainApplication.views.mapView.toggleMapLayer(MainApplication.views.mapView.dnrLayer);
		return false;
	},	
	addTodos: function(){
		//Create new marker
		var bounds = MainApplication.Map.getCenter();
		var unboundMarker = L.marker([bounds.lat, bounds.lng], {icon: MainApplication.defaultMarker, draggable: true});
		unboundMarker.addTo(MainApplication.Map);
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
	geoLocate: function(){
		if (navigator.geolocation) {
			MainApplication.Map.once('locationfound', function (e) {
				//MainApplication.geoLocationResults = e;
				MainApplication.Map.setView(e.latlng, 13, {animate: false});
			});
			MainApplication.Map.once('locationerror', function (e) {
				alert('We could not locate your position.');
			});		
			MainApplication.Map.locate();
		}else{
			alert("Geolocation is unavailable on this device.  We apologize for any inconvenience.");
		}
		return false;
	},		
	loadContactUs: function(){
	 	window[ApplicationName].router.navigate("ContactUs", { trigger: true });
		return false;
	},
	loadRightSlide: function(){
		this.mapPaneView =  new MapPaneView();
		MainApplication.paneRegion.show(this.mapPaneView);
		return false;
	}
});

var MapPaneView = Backbone.Marionette.ItemView.extend({
    template: function (serialized_model) {
        return Handlebars.buildTemplate(serialized_model, MainApplication.Templates.MapPaneTemplate);
    },
    initialize: function (options) {
		this.arcColor="#000000";
    },
	onShow: function(){
		this.loadD3Example();
	},
	loadD3Example: function(){
		var dc=this;
		console.log("Load D3 example");
	
		var width = 200, //960
			height = 200, //500
			radius = Math.min(width, height) / 2;

		var color = d3.scale.ordinal()
			.range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

		var arc = d3.svg.arc()
			.outerRadius(radius - 10)
			.innerRadius(0);

		var pie = d3.layout.pie()
			.sort(null)
			.value(function(d) { return d.population; });

		var svg = d3.select("#chartLayer").append("svg")
			.attr("width", width)
			.attr("height", height)
			.append("g")
			.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

		d3.csv("/scripts/appClient/src/extensions/data.csv", function(error, data) {

		  data.forEach(function(d) {
			d.population = +d.population;
		  });

		  var g = svg.selectAll(".arc")
			  .data(pie(data))
			.enter().append("g")
			  .attr("class", "arc");

		  g.append("path")
		  .on('click', function(){ console.log("test"); })
			  .on('mouseover', dc.synchronizedMouseOver)
			  .on("mouseout", dc.synchronizedMouseOut)
			  .attr("d", arc)
			  .style("fill", function(d) { return color(d.data.age); });

		  g.append("text")
		 // .on('click', function(){ console.log("test"); })
			  .on('mouseover', function(ev){ ev.preventDefault(); return false; })
			  .on("mouseout", function(ev){ ev.preventDefault(); return false; })
			  .attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; })
			  .attr("dy", ".35em")
			  .style("text-anchor", "middle")
			  .text(function(d) { return d.data.age; });

		});		
		return false;
	},
	synchronizedMouseOver: function(ev){
		var arc = d3.select(this);
		//console.log(arc); 		
		var indexValue = arc.attr("index_value");
		this.arcColor = arc[0][0].style.fill;
		arc[0][0].style.fill="Maroon";
		return false;
	},
	synchronizedMouseOut: function(ev){
		var arc = d3.select(this);
		//console.log(arc); 
		var indexValue = arc.attr("index_value");
		arc[0][0].style.fill=this.arcColor;
		return false;
	}
});

var WelcomeView = Backbone.Marionette.ItemView.extend({
    template: function (serialized_model) {
		return Handlebars.buildTemplate(serialized_model, MainApplication.Templates.WelcomeTemplate);
    },
	initialize: function(options){
	},
    events: {
		"click #btnCloseWelcome": "closeModal",
    },
	closeModal: function () {
		MainApplication.modalRegion.hideModal();
		return false;
	}	
});

var QuestionView = Backbone.Marionette.ItemView.extend({
    template: function (serialized_model) {
		return Handlebars.buildTemplate(serialized_model, MainApplication.Templates.QuestionTemplate);
    },
	initialize: function(options){
	},
    events: {
		"click #btnCloseQuestion": "closeModal",
		"click #btnCancelQuestion": "closeModal"
    },
	closeModal: function () {
		MainApplication.modalRegion.hideModal();
		return false;
	}	
});


var MapTipView = Backbone.Marionette.ItemView.extend({
    template: function (serialized_model) {
        return Handlebars.buildTemplate(serialized_model, MainApplication.Templates.MapTipTemplate);
    },
    templateHelpers: function()
    {
    	return {
    		ParcelName: this.ParcelName,
			Owner: this.Owner,
			TotalArea: this.TotalArea,
			AquisitionDate: this.AquisitionDate,
			Cost: this.Cost
    	}
    },
    initialize: function (options) {
		this.ParcelName = options.ParcelName;
		this.Owner = options.Owner;
		this.TotalArea = options.TotalArea;
		this.AquisitionDate = options.AquisitionDate;
		this.Cost = options.Cost;
    },
    events: {
		"click #btnQuestionPost": "postQuestion",
    },
    postQuestion: function(){

		var questionView = new QuestionView({});
		MainApplication.modalRegion.show(questionView);
    }
});
