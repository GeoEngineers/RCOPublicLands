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
		
		//this.esriMap = L.esri.dynamicMapLayer("http://gismanagerweb.rco.wa.gov/arcgis/rest/services/public_lands/WA_RCO_Public_Lands_Inventory_PRISM/MapServer", {
		//	position: "front"
		//});
		this.baseMaps = {
			"Streets": this.streetsMap,
			"Open Street Map" : this.openMap,
			"Imagery": this.imageryMap
        };

		this.mapFirstView = true;
		this.currentLayersType = 'agency';

        _.bindAll(this, 'onShow');
    },
    events: {
		"click #lnkOfflineButton" : "setBaseMapOffline",
		"click #lnkDefaultButton" : "setBaseMapDefault",
		"click #lnkSyncQueueData" : "syncLiveData",
		"click #lnkToggleConnection" : "toggleConnection",
		"click #toggleQuestionButton" : "loadGuidedHelp",
		"change #selectStateInput" : "boundaryChange",
		"change #selectAreaInput" : "areaChange",
		"click #lnkMapsSlide" : "showMapsSlide"
	},	
	onShow: function(){
		var dc=this;
		this.activeLayers=[];
		_.each(BootstrapVars.areaStats, function(area){
			if(area.visible){
				dc.activeLayers.push(area.abbrev);
				$('#ownerToggle' + area.abbrev).css("color",area.color);
			}
		});
		
		this.bounds = false;
		//set buttons according to internet settings
		this.toggleSetButtons();

		MainApplication.Map === undefined ? MainApplication.Map = L.mapbox.map('map',{ minZoom:4 }) : false;
		this.loadCurrentMap();
		MainApplication.Map.on("dragstart",function(){
			dc.loadCurrentMap();
		});
		
		//load summary and welcome view
		this.loadRightSlide();
		var welcomeView = new WelcomeView({});
		MainApplication.modalRegion.show(welcomeView);
		
		_.each(BootstrapVars.areaStats, function(area){ 
			var tileLayer = new L.mapbox.tileLayer(area.mapTarget, { zIndex: 5 });
			var utfGrid = new L.UtfGrid('http://{s}.tiles.mapbox.com/v3/'+area.mapTarget+'/{z}/{x}/{y}.grid.json?callback={cb}', { zIndex: 5 });
			area.layerGroup =  L.layerGroup([
				tileLayer,
				dc.createGrid(utfGrid, area)
			]);
		});		
		this.esriMap =  L.esri.clusteredFeatureLayer("http://gismanagerweb.rco.wa.gov/arcgis/rest/services/public_lands/WA_RCO_Public_Lands_Inventory_PRISM/MapServer/0/", {
   			cluster: new L.MarkerClusterGroup(),
   			onEachMarker: function(geojson, marker) {
   				popupText =  "<div style='overflow:scroll; max-width:350px; max-height:260px;'>";
				for (prop in geojson.properties) {
					var val = geojson.properties[prop];
					var linkId = "shapshot"+ geojson.properties.OBJECTID;
					if(prop.replace("PRISM.DBO.SV_DMPROJECT1.", "") === "SnapshotURL"){
						val = "<a href='" + val + "' id='shapshot"+ geojson.properties.OBJECTID +"'>" + val + "</a>";
					}
					if (val != 'undefined' && val != "0" && prop !="OBJECTID" && prop != "Name") {
						popupText += "<b>" + prop.replace(" (Esri)",'').replace("PRISM.DBO.SV_DMPROJECT1.", "") + "</b>: " + val + "<br>";
					}
				}
				marker.bindPopup(popupText);
        	}
      	});

		MainApplication.Map.setView([47,-120], 7);

		//this.baseMapControl = L.control.layers(this.baseMaps, null, {position: 'bottomleft'}).addTo(MainApplication.Map);
		this.mapFirstView=false;
		_.each(BootstrapVars.areaStats, function(area){ 
			if(area.visible){
				MainApplication.Map.addLayer(area.layerGroup);	
			}
		});	
		this.setLegendControls();
	},
	loadGuidedHelp: function () {
        this.landingPageGuideView = new GuidedHelpView({
        });
        MainApplication.maskRegion.show(this.landingPageGuideView);
        return false;
    },
    loadToolTips: function () {
		var ToolTipClass1 = function () {
            return {
                content: {
                    text: ''
                },
                hide: false,
                show: false,
                style: {
                    classes: 'qtip-dark',
                }
            }
        };
		var ToolTipClass2 = function () {
            return {
                content: {
                    text: ''
                },
                position: {
                    my: 'right middle',
                    at: 'middle left'
                },
                hide: false,
                show: false,
                style: {
                    classes: 'qtip-dark',
                    tip: {
                        corner: 'middle right'
                    }
                }
            }
        };
        var ToolTipClass3 = function () {
            return {
                content: {
                    text: ''
                },
                hide: false,
                show: false,
                position: {
                    my: 'top',
                    at: 'top middle'
                },
                style: {
                    classes: 'qtip-dark',
                    tip: {
                        corner: 'middle'
                    }
                }
            }
        };
        var myToolTip1 = new ToolTipClass1();
        var myToolTip2 = new ToolTipClass2();
        var myToolTip3 = new ToolTipClass1();
        var myToolTip4 = new ToolTipClass1();
        var myToolTip5= new ToolTipClass3();
        myToolTip1.content.text = "Lookup Land Use by Boundary";
        myToolTip2.content.text = "Summary Statistics.";
        myToolTip3.content.text = "Change base map type.";
        myToolTip4.content.text = "Map Navigation Tools";
        myToolTip5.content.text = "Access Public Lands Maps";

        $('#selectStateInput').qtip(myToolTip1);
        $('#summaryPanelBlock').qtip(myToolTip2);
        $('.leaflet-control-layers').qtip(myToolTip3);
        $('.leaflet-control-zoom-out').qtip(myToolTip4);
        $('#lnkMapsSlideToggle').qtip(myToolTip5);


        //Add Qtips - if never loaded before
        var loadedview = $.cookie('loadedView');
        //loadedview = null;
        if (loadedview === undefined || loadedview === null) {
            $.cookie('loadedView', "loaded", { path: '/' });
            $(".leaflet-bottom").css({"margin-bottom": "150px"});

           this.loadGuidedHelp();
        }
    },
	boundaryChange: function(){
		_.each(BootstrapVars.areaStats, function(area){
				area.total_acres = area.starting_total_acres;
				area.total_cost = area.starting_total_cost;
				area.total_revenue = area.starting_total_revenue;
		});
		$('#selectAreaInput').val('');
		this.loadRightSlide();

		var dc = this;
		if(MainApplication.selectedBoundary !== undefined)
		{
			if(MainApplication.Map.hasLayer(MainApplication.selectedBoundary)){
				MainApplication.Map.removeLayer(MainApplication.selectedBoundary);	
			}
		}
		var selectedVal = $('#selectStateInput').val();
		$('#selectAreaInput').css("display", "none");
		_.each(MainApplication.boundaries, function(boundary){
			if(MainApplication.jsonLayer !== null && boundary.jsonLayer !== null)
			{
				if(MainApplication.Map.hasLayer(boundary.jsonLayer)){
					MainApplication.Map.removeLayer(boundary.jsonLayer);	
				}
			}
			if(boundary.Name === selectedVal){
				MainApplication.boundarySelected = boundary;
				$('#selectAreaInput').css("display", "block");
				$('#selectAreaInput').empty().append('<option value="">- Select Area -</option>');
				
				if(boundary.jsonLayer === null)
				{
					$.getJSON(boundary.jsonUrl, function(data) {
						boundary.json = data;
						var features = boundary.json.features;
						console.log(features);
						features.sort(function(a,b){
							var returnval = 0;
							if(a.properties[boundary.NameField] < b.properties[boundary.NameField])
								returnval = -1;
							if(a.properties[boundary.NameField] > b.properties[boundary.NameField])
								returnval = 1;
							return returnval;
						});	
						_.each(features, function(feature){
							$("#selectAreaInput").append(new Option(boundary.SelectText + ' ' + feature.properties[boundary.NameField], feature.properties[boundary.NameField]));
							feature.fill =true;
						});

						boundary.jsonLayer = L.geoJson(boundary.json, {
							style: function (feature) {
								return {
	      							fillColor: boundary.color,
	      							fillOpacity: 0.02,
					                weight: 1,
					                opacity: 1,
					                color: boundary.color,
					                dashArray: '3'
							    };
							},
							fill: true,
							onEachFeature: function (feature, layer) {
								layer.bindLabel(boundary.SelectText + ' ' + feature.properties[boundary.NameField], { noHide: true });
								layer.on('click', function(e){
									$('#selectAreaInput').val(feature.properties[boundary.NameField]);
									MainApplication.Map.closePopup();
									dc.areaChange(false);
								});
							}
						});
						MainApplication.Map.addLayer(boundary.jsonLayer);

					});
				}
				else
				{
					var features = boundary.json.features;
						features.sort(function(a,b){
							var returnval = 0;
							if(a.properties[boundary.NameField] < b.properties[boundary.NameField])
								returnval = -1;
							if(a.properties[boundary.NameField] > b.properties[boundary.NameField])
								returnval = 1;
							return returnval;
						});	
						_.each(features, function(feature){
							$("#selectAreaInput").append(new Option(boundary.SelectText + ' ' + feature.properties[boundary.NameField], feature.properties[boundary.NameField]));
							feature.fill =true;
						});
						MainApplication.Map.addLayer(boundary.jsonLayer);
				}
				//console.log(boundary.json.features);
			}
		})
	},
	areaChange: function(zoom)
	{
		if(MainApplication.selectedBoundary !== undefined)
		{
			if(MainApplication.Map.hasLayer(MainApplication.selectedBoundary)){
					MainApplication.Map.removeLayer(MainApplication.selectedBoundary);	
				}
		}
		var selectedVal = $('#selectAreaInput').val();
		var boundary = MainApplication.boundarySelected;
		_.each(boundary.jsonLayer._layers, function(shape){
			if(selectedVal.toString() === shape.feature.properties[boundary.NameField].toString())
			{
				var maxX = -1000, maxY = -1000, minX = 1000, minY = 1000;
				_.each(shape._latlngs, function(coords){
						if(maxX < coords.lng)
							maxX = coords.lng;
						if(maxY < coords.lat)
							maxY = coords.lat;
						if(minX > coords.lng)
							minX = coords.lng;
						if(minY > coords.lat)
							minY = coords.lat;
				});
				var southWest = L.latLng(minY - 0.2, minX),
					northEast = L.latLng(maxY, maxX + 0.2),
					bounds = L.latLngBounds(southWest, northEast);
				if(zoom !== false){
					MainApplication.Map.fitBounds(bounds);
				}
				console.log(boundary.sums);
				MainApplication.selectedBoundary = L.polygon(shape._latlngs, {fillOpacity: 0.08}).bindLabel(boundary.SelectText + ' ' + shape.feature.properties[boundary.NameField].toString(), { noHide: true });
				MainApplication.Map.addLayer(MainApplication.selectedBoundary);
			}
		});

		//Get Data from Lookup Tables
		var summaryValues = boundary.sums;
		//reset areaStats

		_.each(BootstrapVars.areaStats, function(area){
				area.total_acres = area.starting_total_acres;
				area.total_cost = area.starting_total_cost;
				area.total_revenue = area.starting_total_revenue;
		});
		//Update Bootstrap vars
		if(selectedVal.toString().length < 2)
			selectedVal = "0" + selectedVal;
		_.each(BootstrapVars.areaStats, function(area)
		{
			var totalacres = 0;
			var totalcost = 0;
			_.each(summaryValues, function(summary){
				if(area.abbrev === summary.agency)
				{
					if(selectedVal.toString().trim() === summary.name.toString().trim())
					{
						area.total_acres = summary.acres;
						area.total_cost = summary.acquisitioncost;
					}
				} 
			});
		});
		this.loadRightSlide();
		//Reload Charts and Totals

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
		var selectedVal = $('#selectAreaInput').val();
		if(selectedVal === '')
		{
			selectedVal = "State Summary";
		}
		else
		{
			selectedVal = MainApplication.boundarySelected.SelectText + " " + selectedVal;
		}

		this.mapPaneView =  new MapPaneView({
			activeLayers : this.activeLayers,
			summaryText: selectedVal
		});
		this.showRightSlide();
	},	
	showRightSlide: function(){
		MainApplication.paneRegion.show(this.mapPaneView);
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
		this.currentLayersType = layerType;
		this.activeLayers = [];
		_.each(BootstrapVars.areaStats,function(mapLayer){
			console.log(mapLayer.layerGroupName , layerType);
			if(mapLayer.layerGroupName === layerType){
				mapLayer.visible = true;
				dc.activeLayers.push(mapLayer.abbrev);
				try{
					MainApplication.Map.addLayer(mapLayer.layerGroup);
				}catch(e){
					console.log(e);
				}
			}else{
				mapLayer.visible = false;
				try{
					MainApplication.Map.hasLayer(mapLayer.layerGroup) ? MainApplication.Map.removeLayer(mapLayer.layerGroup) : false;
				}catch(e){
					console.log(e);
				}
			}
			return false;
		});
		
		//refreshes the right slide and legend
		this.setLegendControls();			
		this.showRightSlide();
		
		return false;
	},
	setLegendControls : function(){
		var dc=this;
		
		if(this.featureLayerControls){
			MainApplication.Map.removeControl(this.featureLayerControls);
		}
		
		this.layerMaps = {};
		_.each(BootstrapVars.areaStats, function(area){
			if(area.visible){
				dc.layerMaps[area.abbrev] = area.layerGroup;
			}
		});
				
		this.featureLayerControls = L.control.layers(this.baseMaps, this.layerMaps, {position: 'bottomleft'}).addTo(MainApplication.Map);
		_.each($(this.featureLayerControls._container).find("label"), function(legendItem){
			var spanObject = $(legendItem).children("span").html().trim();
			var layerDetails = _.find(BootstrapVars.areaStats, function(area){
				return area.abbrev === spanObject;
			});
			//if it's found in the base areas array
			if(layerDetails){
				var legendKey = $("<div>", { class: "colorKey", style: "background-color:"+layerDetails.color+";" });
				$(legendItem).attr("data-abbrev",layerDetails.abbrev);
				$(legendItem).prepend(legendKey);
			}
		});
		
		//setup respones to click events
		$(this.featureLayerControls._container).find("label").on("click", function(ev){
			setTimeout(function(){
				//kludgy fix to prevent double clicks
				if(ev.timeStamp !== 0){
					var checkboxObject = $(ev.currentTarget).children("input:checked");
					var spanObject = $(ev.currentTarget).children("span").html().trim();
					var layerDetails = _.find(BootstrapVars.areaStats, function(area){
						return area.abbrev === spanObject;
					});
					//set as inactive
					if(checkboxObject.length === 1){
						layerDetails.visible = true;
					}else{
						layerDetails.visible = false;				
					}
					dc.showRightSlide();
				}
			}, 16);
		});
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
	showProposed : function(){
		this.resetNavOptions();
		$('#lnkProposed').hasClass("btn-primary") ? false : $('#lnkProposed').addClass("btn-primary");
		$('#proposedToggles').css("display","block");
		this.setDisplayedLayers("proposed");
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


var LayersView = Backbone.Marionette.ItemView.extend({
    template: function (serialized_model) {
        return Handlebars.buildTemplate(serialized_model, MainApplication.Templates.LayersTemplate);
    },
    templateHelpers: function () {
        //im a helper!
    },
    initialize: function (options) {
		//nada
    },
    events: {
        "click #lnkTopographic": "triggerBaseLayerSelected",
        "click #lnkImagery": "triggerBaseLayerSelected",
        "click #lnkStreets": "triggerBaseLayerSelected",
        "click #btnCloseLayers": "paneCloseMenu"
    },
    paneCloseMenu: function () {
        this.parentRegion.paneClose();
        $("#lnkMarkersButton").removeClass("active");
        return false;
    },
    triggerBaseLayerSelected: function (source) {
        // need to throw an event here that is caught by the LandingPageView to set base map
        //alert(source.target.name);
        MainApplication.selectedBaseLayer = MainApplication.baseLayers[source.target.name];
        MainApplication.vent.trigger("baseLayerSelected");
        return false;
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
		"click #lnkMapsSlideToggle" : "toggleSlide",
		"click .baseMapLink" : "toggleMapLayer",
		"click #lnkAgency" : "showAgencyOptions",
		"click #lnkAquisitions" : "showAquisitions",
		"click #lnkLandTypes" : "showLandOptions",
		"click #lnkProposed" : "showProposed",
		"click #lnkPrismFunding" : "loadPrismFunding",
		"click #lnkSlideMenu" : "toggleRightMenu"
	},
	onShow : function(){
		//nada
	},
	loadPrismFunding : function(ev){
		MainApplication.views.mapView.loadPrismFunding(ev);
		return false;
	},
	showAgencyOptions : function(ev){
		MainApplication.views.mapView.showAgencyOptions(ev);	
		return false;
	},
	showAquisitions : function(ev){
		MainApplication.views.mapView.showAquisitions(ev);	
		return false;
	},
	showLandOptions : function(ev){
		MainApplication.views.mapView.showLandOptions(ev);	
		return false;
	},
	showProposed : function(ev){
		MainApplication.views.mapView.showProposed(ev);	
		return false;	
	},
	toggleRightMenu : function(ev){	
		if(MainApplication.views.mapView.mapPaneView.slide._state === "closed"){
			MainApplication.views.mapView.mapPaneView.slide.open();
            $("#toggleQuestionButton").animate({"margin-right": "300px"});
		}else{
			MainApplication.views.mapView.mapPaneView.slide.close();
            $("#toggleQuestionButton").animate({"margin-right": "0px"});
			$(MainApplication.paneRegion.el).css({"width":"21em"});
			$('#expandSummaryButton').removeClass("collapsable");
			$('#expandSummaryButton').hasClass("expandable") ? false : $('#expandSummaryButton').addClass("expandable");
			$("#expandSummaryButton a").html("&lt;&lt;&lt; Expand");			
			MainApplication.views.mapView.mapPaneView.setChartSizes(MainApplication.views.mapView.mapPaneView.chartDefaultWidth, MainApplication.views.mapView.mapPaneView.chartDefaultHeight);
		}

		return false;
	},
	toggleSlide: function(){
		if(MainApplication.slideRegion.slideOpen === true){
			MainApplication.slideRegion.slideIn();
		}else{
			MainApplication.slideRegion.slideOut();	
		}
		return false;
	},
	toggleMapLayer: function(ev){
		var mapType = $(ev.currentTarget).attr("data-maptype");
		var mapsObject = [
			{ name: 'osm', path : MainApplication.views.mapView.openMap }, 
			{ name: 'streets', path : MainApplication.views.mapView.streetsMap }, 
			{ name: 'imagery', path : MainApplication.views.mapView.imageryMap }
		];
		_.each(mapsObject,function(map){
			if(mapType===map.name){
				if(MainApplication.Map.hasLayer(map.path) !== true){
					MainApplication.Map.addLayer(map.path);
				}
			}else{
				MainApplication.Map.removeLayer(map.path);
			}
		});	
		return false
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


var MapPaneView = Backbone.Marionette.ItemView.extend({
    template: function (serialized_model) {
        return Handlebars.buildTemplate(serialized_model, MainApplication.Templates.MapPaneTemplate);
    },
    templateHelpers: function()
    {
    	return{
			SummaryTitle: this.summaryText
    	};
    },
    initialize: function (options) {
		this.activeLayers = options.activeLayers;
		//this.displayMode = options.displayMode;
		this.arcColor="#000000";
		this.chartDefaultHeight = 170;
		this.chartDefaultWidth = 260;
		this.currentChartHeight = this.chartDefaultHeight;				
		this.currentChartWidth = this.chartDefaultWidth;
		this.summaryText = options.summaryText;
    },
	events: {
		"click #showPieChart" : "setPieMode",
		"click #showBarChart" : "setBarMode",
		"click #expandSummaryButton" : "setSummarySize",
		"click #lnkHelpMenu" : "showHelpMenu",
		"click #summaryLayer" : "setSummaryLayer"
	},
	onShow: function(){
		$( window ).smartresize(function() {
			MainApplication.views.mapView.showRightSlide();
		});
		
		if(this.slide === undefined){
			this.slide = $('.slide-menu').bigSlide({ 
				side:"right", 
				menu:"#SummaryPaneSlideOut", 
				menuWidth : "21em" }).css({ "z-index":"1030", "top":"35px", "right":"0px"});
			this.slide._state = "open";
		}
		
		var summaryHeight = $(window).height()-67;
		$("#summaryPanelBlock").css({"height":summaryHeight});
		
		var dc=this;
		//start in bar mode
		this.loadD3BarLayerComparison();
		this.loadD3PieLayerComparison();
		$( "#ddlSummaryType" ).change(function() {
			dc.loadD3BarLayerComparison();
			dc.loadD3PieLayerComparison();
		});
		
		if(this.chartType === undefined){
			this.setBarMode();
		}else{
			if(this.chartType === "bar"){
				this.setBarMode();
			}else{
				this.setPieMode();
			}
		}
	},
	formatCurrency: function(value){
		return parseFloat(value, 10).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,").toString();
	},	
	getVisibleAreas: function(){
		return _.filter(BootstrapVars.areaStats, function(area){ 
			return area.visible===true; 
		});
	},
	loadD3BarLayerComparison: function(){
		var dc=this;
		this.type = $( "#ddlSummaryType" ).val(); //"total_acres"; 
		this.loadSummaryText(this.type);
		var selectedAreas = this.getVisibleAreas();
		var barChartSeries = [];
		var xAxisTitle = GeoAppBase.capitaliseEach("Total " + this.type.replace("total_", ""));

		_.each(selectedAreas, function(area){
			var val = 0;
			barChartSeries.push({
				"name" : area.agency,
				"data" : [area[dc.type]], //, area.total_cost, area.total_revenue
				"color" : area.color
			});
		});
		
		$("#barChartLayer").html("");
		this.barChartObject = new Highcharts.Chart({
			chart: {
				height: this.currentChartHeight,
				width: this.currentChartWidth,
				type: 'bar',
				renderTo: 'barChartLayer'
			},
			title: {
				text: GeoAppBase.capitaliseEach(MainApplication.views.mapView.currentLayersType + " " + xAxisTitle +" Compared"),
				style: { "font-size" : "9.5pt" },
				align: "center",
				margin: 5,
				x: -20 
			},
			xAxis: {
				categories: [xAxisTitle]  // ['Total Acres'] // , 'Total Cost', 'Total Revenue'
			},
			yAxis: {
				title: {
					text: ''
				}
			},
			series: barChartSeries,
			legend: {
				enabled: false
			},
			exporting: {
                enabled: true
            },
			credits: {
                enabled: false
            }
		});
		return false;
	},
	loadD3PieLayerComparison: function(){	
		var dc=this;
		var data = this.getVisibleAreas();
		var colorRange = [];
		this.type = $( "#ddlSummaryType" ).val();
		var xAxisTitle = GeoAppBase.capitaliseEach("Total " + this.type.replace("total_", ""));
		var pieChartSeries = [];
		
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
			pieChartSeries.push([area.abbrev, val]);
			colorRange.push(area.color);
		});

		$("#pieChartLayer").html("");
		this.loadSummaryText(this.type);
		
		//['#50B432', '#ED561B', '#DDDF00', '#24CBE5', '#64E572', '#FF9655', '#FFF263', '#6AF9C4']
		Highcharts.setOptions({
			colors: colorRange
		});
		this.pieChartObject = new Highcharts.Chart({
			chart: {
				height: this.currentChartHeight,
				width: this.currentChartWidth,
				renderTo: "pieChartLayer",
				plotBackgroundColor: null,
				plotBorderWidth: 0,
				plotShadow: false
			},
			title: {
				text: GeoAppBase.capitaliseEach(MainApplication.views.mapView.currentLayersType + " " + xAxisTitle +" Compared"),
				style: { "font-size" : "9.5pt" },
				align: "center",
				margin: 5,
				x: -20 
			},
			tooltip: {
				pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
			},
			plotOptions: {
				pie: {
					dataLabels: {
						enabled: false
					},
					startAngle: -90,
					endAngle: 90,
					center: ['50%', '75%']
				}
			},
			series: [{
				type: 'pie',
				name: this.type,
				innerSize: '40%',
				data: pieChartSeries
			}],
			exporting: {
                enabled: true
            },
			credits: {
                enabled: false
            }
		});
		
		return false;
	},	
	loadSummaryText: function(typeView){
		var dc=this;
		var summaryText = "";
		var total = 0;
		//var data = this.getVisibleAreas();
		var isCurrency = typeView === "total_acres" ? "" : "$";
		

		_.each(BootstrapVars.areaInformation, function(area){
			if(area.layerGroupName===MainApplication.views.mapView.currentLayersType){
				$("#summaryDateRange").html("Data last updated between "+area.startDate+" and " +area.endDate);
			}
		});

		_.each(BootstrapVars.areaStats, function(area){
			if(area.layerGroupName===MainApplication.views.mapView.currentLayersType){
				var areaSummary = "";
				var val = 0;
				switch(typeView)
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
				var legendKey = $("<div>", { class: "colorKey", style: "background-color:"+area.color+";" });
				var checkedStatus = area.visible ? " checked='true'" : "";
				
				areaSummary += "<div>" + legendKey[0].outerHTML + "<input type='checkbox' name='inputSummaryItem-" + area.abbrev + "' id='inputSummaryItem-"+ area.abbrev + "' data-abbr='" + area.abbrev + "' class='usePointer'"+checkedStatus+" /> <label class='usePointer' data-abbr='" + area.abbrev + "' for='inputSummaryItem-" + area.abbrev + "' >" + area.abbrev + ": " + isCurrency + dc.formatCurrency(val)+ "</label></div>";
				
				legendKey.prependTo(areaSummary);
				summaryText = summaryText + areaSummary;
				total += val;
			}
		});
		switch(typeView) {
			case "total_acres":
				prefixText = "Total " + this.type.replace("total_", "")  + ": " + isCurrency  + dc.formatCurrency(total)+ " ";
				//summaryText = summaryText;
				break;
			case "total_cost":
				prefixText = "Total " + this.type.replace("total_", "");
				//summaryText = "(Available Soon)";
				break;
			case "total_revenue":
				prefixText = "";
				summaryText = "(Available Soon)";
				break;
			default:
				break;
		}
		$("#summaryLayer").html(prefixText + summaryText);
		return false;
	},
	setBarMode: function(){
		this.chartType = 'bar';
		$('#barChartBlock').css({"display":"block"});
		$('#pieChartBlock').css({"display":"none"});
		$('#showBarChart').hasClass("btn-primary") ? false : $('#showBarChart').addClass("btn-primary");
		$('#showPieChart').removeClass("btn-primary");
		return false;
	},
	setPieMode: function(){
		this.chartType = 'pie';
		$('#barChartBlock').css({"display":"none"});
		$('#pieChartBlock').css({"display":"block"});
		$('#showBarChart').removeClass("btn-primary");
		$('#showPieChart').hasClass("btn-primary") ? false : $('#showPieChart').addClass("btn-primary");
		return false;
	},
	setSummaryLayer: function(ev){
		var originalElement = ev.originalEvent.srcElement || ev.originalEvent.originalTarget;
		var originalObject = $(originalElement).attr !== undefined ? $(originalElement) : {};
		
		//this checks the layer switcher and uses its functionality then runs then updates the map layers
		if(ev.timeStamp !== 0 && originalObject.attr !== undefined){
			var layerGroup = _.find(BootstrapVars.areaStats, function(area){
				return area.abbrev === originalObject.attr("data-abbr");
			});
			_.each($(MainApplication.views.mapView.featureLayerControls._form).children('.leaflet-control-layers-overlays')[0].childNodes,function(node){
				if($(node).attr("data-abbrev") === originalObject.attr("data-abbr")){
					$(node).children("input").trigger("click");
					layerGroup.visible = !layerGroup.visible;
					MainApplication.views.mapView.showRightSlide();
				}
			});
			return true;
		}else if(originalObject.attr("data-abbr") === undefined){
			//return false if it's not one of the inputs
			return false
		}
	},
	setSummarySize: function(ev){
		if($(ev.currentTarget).hasClass("expandable")){
			$(ev.currentTarget).addClass("collapsable");
			$(ev.currentTarget).removeClass("expandable");
			$("#expandSummaryButton a").html("Collapse &gt;&gt;&gt;");
			$(MainApplication.paneRegion.el).animate({"width":"100%"});
			//the 170 removed from the new height is a coincidence, it's the total of the header, footer, and misc text
			var newHeight = $(window).height()-170;
			newHeight = newHeight < this.chartDefaultHeight ? this.chartDefaultHeight : newHeight; 
			var scale = newHeight / this.chartDefaultHeight;
			this.setChartSizes(parseInt(scale * this.chartDefaultWidth), newHeight);
			
			this.currentChartWidth = parseInt(scale * this.chartDefaultWidth);
			this.currentChartHeight = newHeight;
		}else{
			$(ev.currentTarget).removeClass("collapsable");
			$(ev.currentTarget).addClass("expandable");
			$("#expandSummaryButton a").html("&lt;&lt;&lt; Expand");
			$(MainApplication.paneRegion.el).animate({"width":"21em"});		
			this.setChartSizes(this.chartDefaultWidth, this.chartDefaultHeight);
			
			this.currentChartWidth = this.chartDefaultWidth;
			this.currentChartHeight = this.chartDefaultHeight;			
		}

		return false;
	},
	setChartSizes: function(width, height){
		this.barChartObject.setSize(width, height);
		this.pieChartObject.setSize(width, height);	
	},
	showHelpMenu : function(ev){
		//console.log("Help Text here");
		//alert("Help Text Here");

		var selectedAreas = this.getVisibleAreas();
		var layerGroup = selectedAreas[0].layerGroupName;
		var areaInformationView = new AreaInformationView({layerGroupName: layerGroup});
		MainApplication.modalRegion.show(areaInformationView);
		return false;
	},	
	synchronizedMouseOver: function(ev){
		var arc = d3.select(this);
		//console.log(arc); 		
		var indexValue = arc.attr("index_value");
		this.arcColor = arc[0][0].style.fill;
		arc[0][0].style.fill="DarkBlue";
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
            $("#toggleQuestionButton").css({"margin-right": "300px"});
		MainApplication.views.mapView.mapPaneView.slide.open();
		MainApplication.views.mapSelectorSlideView.toggleSlide();
		MainApplication.views.mapView.loadToolTips();
		return false;
	}	
});

var AreaInformationView = Backbone.Marionette.ItemView.extend({
    template: function (serialized_model) {
		return Handlebars.buildTemplate(serialized_model, MainApplication.Templates.AreaInformationTemplate);
    },
	initialize: function(options){
		this.layerGroupName = options.layerGroupName;
	},
    events: {
		"click #btnCancelInfo": "closeModal",
    },
    onShow: function()
    {
    	var dc = this;
    	var htmlInfo = "";
		_.each(BootstrapVars.areaInformation, function(areaInformation){
			if(dc.layerGroupName === areaInformation.layerGroupName)
			{
				htmlInfo = areaInformation.htmlInfo;
			}
		});
		$("#areaInfoDiv").html(htmlInfo);
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

var HeaderView = Backbone.Marionette.ItemView.extend({
    template: function (serialized_model) {
		return Handlebars.buildTemplate(serialized_model, MainApplication.Templates.HeaderTemplate);
    },
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


var GuidedHelpView = Backbone.Marionette.ItemView.extend({
    template: function (serialized_model) {
        return Handlebars.buildTemplate(serialized_model, MainApplication.Templates.GuidedHelpTemplate);
    },
    templateHelpers: function () {
        return {
            guideElementOptions: this.guideElements
        };
    },
    initialize: function (options) {
        this.guideElements = false;
        //json object with pages of guide
        //page 1 object
        //page 2 object
    },
    events: {
    },
    onShow: function () {
        //$('.leaflet-control-layers-toggle').qtip("show");
        $('#selectStateInput').qtip("show");
        $('#summaryPanelBlock').qtip("show");
        $('.leaflet-control-layers').qtip("show");
        $('.leaflet-control-zoom-out').qtip("show");
        $('#lnkMapsSlideToggle').qtip("show");

    	console.log("Showing Tip 2");
        return false;
    }
});
