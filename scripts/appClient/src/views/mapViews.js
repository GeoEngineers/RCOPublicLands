var MapView = Backbone.Marionette.Layout.extend({
    template: function (serialized_model) {
        return Handlebars.buildTemplate(serialized_model, MainApplication.Templates.MapTemplate);
    },
    initialize: function (options) {
    	var dc = this;
		this.todos = options.todos;
		this.dnrResources = options.dnrResources;
		//examples.map-y7l23tes
		this.streetsMap = L.tileLayer.provider('MapBox.smartmine.tm2-basemap', { minZoom:4, zIndex: 4 });		
		this.openMap = L.tileLayer('http://b.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
    		attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://cloudmade.com">CloudMade</a>',
    			maxZoom: 18
		});
		this.imageryMap = L.tileLayer.provider('MapBox.smartmine.map-nco5bdjp', { minZoom:4, zIndex: 4 });
		
		this.esriMap = L.esri.dynamicMapLayer("http://gismanagerweb.rco.wa.gov/arcgis/rest/services/public_lands/WA_RCO_Public_Lands_Inventory_PRISM/MapServer", {
			position: "front"
		});

		this.mapFirstView = true;
        _.bindAll(this, 'onShow');
    },
    events: {
		"click #lnkOfflineButton" : "setBaseMapOffline",
		"click #lnkDefaultButton" : "setBaseMapDefault",
		"click #lnkSyncQueueData" : "syncLiveData",
		"click #lnkToggleConnection" : "toggleConnection",
		"click #lnkMapsSlide" : "showMapsSlide",
		"click #lnkAgency" : "showAgencyOptions",
		"click #lnkAquisitions" : "showAquisitions",
		"click #lnkLandTypes" : "showLandOptions",
		"click #lnkPrismFunding" : "loadPrismFunding"
	},	
	onShow: function(){
		var dc=this;

		$(document).ready(function() {
			 dc.slide = $('.slide-menu').bigSlide({ side:"right", menu:"#SummaryPaneSlideOut" }).css("z-index","1040").css("top", "35px");
		});
		this.activeLayers=[];
		_.each(BootstrapVars.areaStats, function(area){
			if(area.visible){
				dc.activeLayers.push(area.abbrev);
				$('#ownerToggle' + area.abbrev).css("color",area.color);
			}
		});
		this.loadRightSlide();
		
		var welcomeView = new WelcomeView({});
		MainApplication.modalRegion.show(welcomeView);

		this.bounds = false;
		//set buttons according to internet settings
		this.toggleSetButtons();

		MainApplication.Map === undefined ? MainApplication.Map = L.mapbox.map('map',{ minZoom:4 }) : false;
		this.loadCurrentMap();
		MainApplication.Map.on("dragstart",function(){
			dc.loadCurrentMap();
		});
	
		L.control.layers({
			'Open Street Map': this.openMap,
			'Streets': this.streetsMap.addTo(MainApplication.Map),
			'Imagery': this.imageryMap
		},{},{
			position:'bottomleft'
		}).addTo(MainApplication.Map);

		_.each(BootstrapVars.areaStats, function(area){ 
			var tileLayer = new L.mapbox.tileLayer(area.mapTarget, { zIndex: 5 });
			var utfGrid = new L.UtfGrid('http://{s}.tiles.mapbox.com/v3/'+area.mapTarget+'/{z}/{x}/{y}.grid.json?callback={cb}', { zIndex: 5 });
			area.layerGroup =  L.layerGroup([
				tileLayer,
				dc.createGrid(utfGrid, area)
			]);
		});		

		//ESRI Prism data check
		MainApplication.Map.on("click", function(e) {
			if(MainApplication.Map.hasLayer(MainApplication.views.mapView.esriMap)){
				MainApplication.views.mapView.esriMap.identify(e.latlng, function(data) {
					if(data.results.length > 0) {
						// Popup toevoegen en informatie toevoegen
						popupText =  "<div style='overflow:scroll; max-width:250px; max-height:260px;'>";
						for (prop in data.results[0].attributes) {
							var val = data.results[0].attributes[prop];
							var linkId = "shapshot"+ data.results[0].attributes.OBJECTID;
							if(prop === "Snapshot URL"){
								val = "<a href='" + val + "' id='shapshot"+ data.results[0].attributes.OBJECTID +"'>" + val + "</a>";
							}
							if (val != 'undefined' && val != "0" && prop !="OBJECTID" && prop != "Name") {
								popupText += "<b>" + prop.replace(" (Esri)",'') + "</b>: " + val + "<br>";
							}
						}
						popupText += "</div>";
						var popup = L.popup()
							.setLatLng(e.latlng)
							.setContent(popupText)
							.openOn(MainApplication.Map);

						$('#'+linkId).on("click",function(ev){
							window.open($(ev.currentTarget).attr("href"),'PRISM','width=1000,height=550,scroll=1,scrolling=1,scrollbars=1');
							return false;
						});
					}
				});
			}
		});		
		
		MainApplication.Map.setView([47,-120], 7).addLayer(this.streetsMap);
		this.mapFirstView=false;
		_.each(BootstrapVars.areaStats, function(area){ 
			if(area.visible){
				MainApplication.Map.addLayer(area.layerGroup);	
			}
		});	
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
	createGrid: function(gridLayer, area){	
		gridLayer.on('mouseover', function(e){ 
			if(e.data){ info.update(e); }
		}).on('mouseout', function(e){ 
			info.update();
		})
		gridLayer.on('click', function(props){
			if(props.data){
				var markerToolTip = new MapTipView({
            		ParcelName: "Parcel",
            		Owner: area.agency,
            		TotalArea: props.data.gisacres,
            		AquisitionDate: '(Available Soon)',
            		Cost: '(Available Soon)'
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
				//	"<values><b>" + props.data.GISAcres + "</b><br />Percentage: <rank>" + props.data.gisacres +"</rank></values>"
				//: 'Hover over a state');
			}
		};
		
		return gridLayer;
	},	
	loadCurrentMap: function(){
		if(GeoAppBase.connectionAvailable()){
			MainApplication.Map.hasLayer(this.streetsMap)===false ? this.setBaseMapDefault() : false;
		}else{
			MainApplication.Map.hasLayer(this.offlineMap)===false ? this.setBaseMapOffline() : false;
		}
		return false;
	},
	loadPrismFunding: function(){
		if(MainApplication.Map.hasLayer(MainApplication.views.mapView.esriMap)){
			$('#lnkPrismFunding').css("color","#999999");
			MainApplication.Map.removeLayer(MainApplication.views.mapView.esriMap);	
		}else{
			$('#lnkPrismFunding').css("color","#FFFFFF");
			MainApplication.views.mapView.esriMap.addTo(MainApplication.Map);
		}
		return false;
	},	
	loadRightSlide: function(){
		this.mapPaneView =  new MapPaneView({
			activeLayers : this.activeLayers
		});
		MainApplication.paneRegion.show(this.mapPaneView);
		return false;
	},	
	resetBaseMaps: function(){
		$("#lnkOfflineButton").removeClass('btn-primary');
		$("#lnkDefaultButton").removeClass('btn-primary');
		
		//console.log(MainApplication.Map.hasLayer(this.terrainMap));
		//console.log(MainApplication.Map.hasLayer(this.offlineMap));
		
		if (MainApplication.Map.hasLayer(this.streetsMap)) {
			MainApplication.Map.removeLayer(this.streetsMap);
		}
		if (MainApplication.Map.hasLayer(this.offlineMap)) {
			MainApplication.Map.removeLayer(this.offlineMap);
		}	
	},
	resetNavOptions: function(){
		$('.navLayers').removeClass("btn-primary");
		$('.navToggles').css("display","none");
		return false;
	},	
	setBaseMapDefault: function(){
		this.resetBaseMaps();
		$("#lnkDefaultButton").addClass('btn-primary');
		this.streetsMap.addTo(MainApplication.Map);
		return false;
	},
	setBaseMapOffline: function(){
		this.resetBaseMaps();
		$("#lnkOfflineButton").addClass('btn-primary');
		this.offlineMap.addTo(MainApplication.Map);
		return false;
	},
	setDisplayedLayers : function(layerType){
		var dc=this;
		
		console.log("Set them layers");
		console.log(layerType);
		console.log(BootstrapVars.areaStats);
	
		this.activeLayers = [];		
		_.each(BootstrapVars.areaStats,function(mapLayer){
			if(mapLayer.layerGroupName === layerType){
				mapLayer.visible = true;
				dc.activeLayers.push(mapLayer.abbrev);
				MainApplication.Map.addLayer(mapLayer.layerGroup);
				
			}else{
				mapLayer.visible = false;
				MainApplication.Map.hasLayer(mapLayer.layerGroup) ? MainApplication.Map.removeLayer(mapLayer.layerGroup) : false;
				
			}
			return false;
		});
		//refreshes the right slide
		this.loadRightSlide();
		
		return false;
	},
	showMapsSlide : function(){
		console.log("Slide Data");
		return false;
	},
	showAgencyOptions : function(){
		this.resetNavOptions();
		$('#lnkAgency').hasClass("btn-primary") ? false : $('#lnkAgency').addClass("btn-primary");
		$('#agencyToggles').css("display","block");
		this.setDisplayedLayers("agency");
		return false;
	},
	showAquisitions : function(){
		this.resetNavOptions();
		$('#lnkAquisitions').hasClass("btn-primary") ? false : $('#lnkAquisitions').addClass("btn-primary");
		$('#aquisitionToggles').css("display","block");
		this.setDisplayedLayers("aquisitions");
		return false;
	},
	showLandOptions : function(){
		this.resetNavOptions();
		$('#lnkLandTypes').hasClass("btn-primary") ? false : $('#lnkLandTypes').addClass("btn-primary");
		$('#landUseToggles').css("display","block");
		this.setDisplayedLayers("landtypes");
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
	toggleMapLayer: function(layer){
		if(MainApplication.Map.hasLayer(layer)){
			MainApplication.Map.removeLayer(layer);
		}else{
			MainApplication.Map.addLayer(layer);
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


var MapSelectorSlideView = Backbone.Marionette.ItemView.extend({
    template: function (serialized_model) {
		return Handlebars.buildTemplate(serialized_model, MainApplication.Templates.MapSelectorSlideTemplate);
    },
	templateHelpers: function(){
		return {
			Description: "Helper"
		};
	},
	events: {
		"click #lnkMapsSlideToggle" : "toggleSlide"
	},
	toggleSlide: function(){
		console.log("Toggling");
		console.log(MainApplication.slideRegion);
		console.log(MainApplication.slideRegion.slideOpen);
		if(MainApplication.slideRegion.slideOpen === true){
			MainApplication.slideRegion.slideIn();
		}else{
			MainApplication.slideRegion.slideOut();			
		}
		return false;
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

/*
var MapFooterView = Backbone.Marionette.ItemView.extend({
    template: function (serialized_model) {
        return Handlebars.buildTemplate(serialized_model, MainApplication.Templates.MapFooterTemplate);
    },
	templateHelpers: function(){
		var owners = [];
		_.each([
			{
				abbrev: "DFW",
				agency: "Department of Fish and Wildlife",
				symbol: '#x2190;'
			},
			{
				abbrev: "PARKS",
				agency: "Washington Parks Department",
				symbol: '#x21f4;'
			},
			//{
			//	abbrev: "RCO",
			//	agency: "Recreation and Conservation Office",
			//	symbol: '#x219a;'
			//},
			{
				abbrev: "DNR",
				agency: "Department of Natural Resources",
				symbol: '#x214a;'
		}], function(area){
			owners.push({owner: area.abbrev.toUpperCase(), symbol: area.symbol});
		});
		return { 
			owners : owners,
			layers : this.layersObject
		}
	},
    initialize: function (options) {
    	var dc = this;
		this.todos = options.todos;
		this.genericCollection = options.genericCollection;
        _.bindAll(this, 'loadContactUs', 'addTodos');
    },
	events: {
		"click .ownerToggle" : "actToggleLayer",
		"click .aquisitionToggle" : "actToggleLayer",
		"click .landuseToggle": "actToggleLayer",
		//"click .landuseToggle": "actToggleLand",
		"click #lnkTodos" : "addTodos",
		"click #lnkSlideMenu" : "loadRightSlide",
		"click #lnkPrismFunding" : "loadPrismFunding"
	},
	onShow: function(){
		//temp fix until menu is completely ready
		var dc = this;
		$(document).ready(function() {
			 dc.slide = $('.slide-menu').bigSlide({ side:"right", menu:"#SummaryPaneSlideOut" }).css("z-index","1040").css("top", "35px");
		});
		this.activeLayers=[];
		_.each(BootstrapVars.areaStats, function(area){
			if(area.visible){
				dc.activeLayers.push(area.abbrev);
				$('#ownerToggle' + area.abbrev).css("color",area.color);
			}
		});
		dc.loadRightSlide();
		return false;
	},
	actToggleLayer : function(ev){
		var areaName = $(ev.currentTarget).attr("data-layerlabel").toString();
		var areaDetails = _.find(BootstrapVars.areaStats,function(item){
			return item.abbrev == areaName;
		});
		if(areaDetails.total_acres === 0)
		{
			alert("Not available at this time.");
		}
		else
		{
			var className = "";
			className = $(ev.currentTarget).hasClass("ownerToggle") ? "owner" : className;
			className = $(ev.currentTarget).hasClass("landuseToggle") ? "landuse" : className;
			className = $(ev.currentTarget).hasClass("aquisitionToggle") ? "aquisition" : className;
			
			this.toggleActiveLayers(className, areaName);		
			MainApplication.views.mapView.toggleMapLayer(areaDetails.layerGroup);

			this.loadRightSlide();
		}
		return false;
	},
	actToggleLand: function(ev){
		alert("Not available at this time.");
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
	loadPrismFunding: function(){
		if(MainApplication.Map.hasLayer(MainApplication.views.mapView.esriMap)){
			$('#lnkPrismFunding').css("color","#999999");
			MainApplication.Map.removeLayer(MainApplication.views.mapView.esriMap);	
		}else{
			$('#lnkPrismFunding').css("color","#FFFFFF");
			MainApplication.views.mapView.esriMap.addTo(MainApplication.Map);
		}
		return false;
	},
	loadRightSlide: function(){
		this.mapPaneView =  new MapPaneView({
			activeLayers : this.activeLayers
		});
		MainApplication.paneRegion.show(this.mapPaneView);
		return false;
	},
	toggleActiveLayers: function(className, label){
		if($.inArray(label,this.activeLayers) > -1){
			$('#'+className+'Toggle' + label).css("color","#999999");
			this.activeLayers = _.reject(this.activeLayers,function(item){
				return item===label;
			});
		}else{
			var color = '';
			_.each(BootstrapVars.areaStats, function(area){
				if(area.abbrev == label){
					color = area.color;
				}
			});
			$('#'+className+'Toggle' + label).css("color",color);
			this.activeLayers.push(label);
		}
		return false;
	}
});
*/

var MapPaneView = Backbone.Marionette.ItemView.extend({
    template: function (serialized_model) {
        return Handlebars.buildTemplate(serialized_model, MainApplication.Templates.MapPaneTemplate);
    },
    initialize: function (options) {
		this.activeLayers = options.activeLayers;
		this.arcColor="#000000";
    },
	onShow: function(){
		var dc=this;
		dc.loadD3LayerComparison();
		$( "#ddlSummaryType" ).change(function() {
			dc.loadD3LayerComparison();
		});
	},
	loadD3LayerComparison: function(){	
		var dc=this;

		var data = _.filter(BootstrapVars.areaStats, function(area){ 
			return $.inArray(area.abbrev, dc.activeLayers) > -1; 
		});

		var summaryText = "";
		var total = 0;
		var colorRange = [];
		this.type = $( "#ddlSummaryType" ).val();

		var isCurrency = this.type === "total_acres" ? "" : "$";
		_.each(data, function(area){
			var val = 0;
			switch(dc.type)
			{
				case "total_acres":
					val = area.total_acres;
					break;
				case "total_cost":
					val = area.total_cost;
					break;
				case "total_revenue":
					val =  area.total_revenue;
					break;
				default:
					break;
			}
			summaryText += "- "+area.abbrev + ": " + isCurrency + dc.formatCurrency(val)+ "<br/>";
			total += val;
			colorRange.push(area.color);
		});

		switch(dc.type)
			{
				case "total_acres":
					summaryText = "Total " + this.type.replace("total_", "")  + ": " + isCurrency  + dc.formatCurrency(total)+ " <br/>" + summaryText + "";
					break;
				case "total_cost":
					summaryText = "(Available Soon)";
					break;
				case "total_revenue":
					summaryText = "(Available Soon)";
					break;
				default:
					break;
			}

		$("#summaryLayer").html(summaryText);
		$("#chartLayer").html("");


		var width = 200, //960
			height = 200, //500
			radius = Math.min(width, height) / 2;
		var color = d3.scale.ordinal()
			.range(colorRange);
		var arc = d3.svg.arc()
			.outerRadius(radius - 10)
			.innerRadius(0);
		var pie = d3.layout.pie()
			.sort(null)
			.value(function(d) {
				var val = 0;
				switch(dc.type)
				{
					case "total_acres":
						return d.total_acres;
					case "total_cost":
						return d.total_cost;
					case "total_revenue":
						return d.total_revenue;
					default:
						return 0;
				}
			});
		var svg = d3.select("#chartLayer").append("svg")
			.attr("width", width)
			.attr("height", height)
			.append("g")
			.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

		//d3.csv("/scripts/appClient/src/extensions/data.csv", function(error, data) {
			//data.forEach(function(d) {
			//	d.population = +d.population;
			//});
		//var data = BootstrapVars.areaStats;
		

		var g = svg.selectAll(".arc")
			.data(pie(data))
			.enter().append("g")
			.attr("class", "arc")
			;

		g.append("path")
		.on('click', function(){ console.log("test"); })
			.on('mouseover', dc.synchronizedMouseOver)
			.on("mouseout", dc.synchronizedMouseOut)
			.attr("d", arc)
			.style("fill", function(d) { return color(d.data.agency); });

		g.append("text")
			.on('mouseover', function(ev){ console.log(ev); return false; })
			.on("mouseout", function(ev){ console.log(ev); return false; })
			.attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; })
			.attr("dy", ".35em")
			.style("text-anchor", "middle")
			.text(function(d) { return d.data.abbrev; });
		//});		
		return false;
	},
	formatCurrency: function(value)
	{
		return parseFloat(value, 10).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,").toString();
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
		$("#SummaryPaneSlideOut").css("display","block");
		MainApplication.views.mapView.slide.open();
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

var HeaderView = Backbone.Marionette.ItemView.extend({
    template: function (serialized_model) {
		return Handlebars.buildTemplate(serialized_model, MainApplication.Templates.HeaderTemplate);
    },
	className: "container",
	initialize: function(options){
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
