var MapView = Backbone.Marionette.Layout.extend({
	template: function (serialized_model) {
		return Handlebars.buildTemplate(serialized_model, MainApplication.Templates.MapTemplate);
	},
	initialize: function (options) {
		var dc = this;
		this.clearAreaSums();
		this.resetAreaSums();

		this.dnrResources = options.dnrResources;
		this.streetsMap = L.tileLayer.provider('MapBox.smartmine.igcmocio', { minZoom:6, zIndex: 1, attribution:"", reuseTiles: true });		
		this.openMap = L.tileLayer('http://b.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
			attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://cloudmade.com">CloudMade</a>',
			minZoom: 6, 
			maxZoom: 18,
			zIndex: 2, 
			reuseTiles: true
		});
		this.imageryMap = L.tileLayer.provider('MapBox.smartmine.map-nco5bdjp', { minZoom:6, zIndex: 3, attribution:"", reuseTiles: true });

		this.baseMaps = {
			"Terrain": this.streetsMap,
			"Streets" : this.openMap,
			"Imagery": this.imageryMap
		};

		this.mapFirstView = true;
		this.currentLayersType = 'agency';
		MainApplication.totalAcres = " of 45,663,000";

		_.bindAll(this, 'onShow');
	},
	events: {
		"click #lnkOfflineButton" : "setBaseMapOffline",
		"click #lnkDefaultButton" : "setBaseMapDefault",
		"click #lnkToggleConnection" : "toggleConnection",
		"click #toggleQuestionButton" : "loadGuidedHelp",
		"change #selectStateInput" : "boundaryChange",
		"change #selectAreaInput" : "areaChange",
		"click #lnkMapsSlide" : "showMapsSlide",
		"click #toggleSummaryButton" : "toggleRightMenuPane"		
	},	
	onShow: function(){
		var dc=this;
		var area;
		this.activeLayers=[];
		for(area in BootstrapVars.areaStats){
			if(BootstrapVars.areaStats[area].visible){
				dc.activeLayers.push(area.abbrev);
				$('#ownerToggle' + BootstrapVars.areaStats[area].abbrev).css("color",BootstrapVars.areaStats[area].color);
			}
		}
		
		this.bounds = false;
		//set buttons according to internet settings
		this.toggleSetButtons();

		var southWest = L.latLng(45.33, -123.85),
			northEast = L.latLng(49.00, -116.85);
		this.stateBounds = L.latLngBounds(southWest, northEast);
		
		MainApplication.Map === undefined ? MainApplication.Map = L.mapbox.map('map', null, { minZoom:6, maxZoom:14, attribution:"" }) : false;
		this.setBaseMapDefault();
		this.createOverlayMask();
		
		//load summary and welcome view
		this.loadRightSlide();
		var welcomeView = new WelcomeView({});
		MainApplication.modalRegion.show(welcomeView);

		for(area in BootstrapVars.areaStats){
			if(BootstrapVars.areaStats[area].layerGroupName !== 'proposed')
			{
				var tileLayer = new L.mapbox.tileLayer(BootstrapVars.areaStats[area].mapTarget, { 
					bounds: this.stateBounds,
					minZoom: 6,
					maxZoom: 14,
					//maxNativeZoom: 14,
					zIndex: BootstrapVars.areaStats[area].z,
					opacity: 1
				});
				var utfGrid = new L.UtfGrid('http://{s}.tiles.mapbox.com/v3/'+BootstrapVars.areaStats[area].mapTarget+'/{z}/{x}/{y}.grid.json?callback={cb}', { 
					bounds: this.stateBounds,
					minZoom: 6,
					maxZoom: 14,
					zIndex: BootstrapVars.areaStats[area].z
				});
				BootstrapVars.areaStats[area].layerGroup =  L.layerGroup([
					tileLayer,
					dc.createGrid(utfGrid, BootstrapVars.areaStats[area])
				]);
			}
			else
			{
				$.getJSON(BootstrapVars.areaStats[area].mapTarget, function(data) {
					var provider = "";
					_.each(data.features, function(feature)
					{
						provider = feature.properties.prov1;
					});
					area = provider == 'Washington Parks' ? 14 : area;
					area = provider == 'Washington DNR' ? 15 : area;
					area = provider == 'Washington DFW' ? 16 : area;

					var geojsonMarkerOptions = {
						radius: 5,
						fillColor: BootstrapVars.areaStats[area].color,
						color: "#000",
						weight: 1,
						opacity: 1,
						fillOpacity: 0.8
					};
					var jsonLayer = L.geoJson(data, {
						pointToLayer: function (feature, latlng) {
							var marker =  L.circleMarker(latlng, geojsonMarkerOptions);
							var popupText =  "<div style='overflow:scroll; max-width:350px; max-height:260px;'>";
							popupText += "<span class='tipLabel'>Owner</span>: " + feature.properties.prov1 + "<br>";
							popupText += "<span class='tipLabel'>Acres</span>: " + feature.properties.acres + "<br>";
							marker.bindPopup(popupText);
							return marker;
						}
					});
					BootstrapVars.areaStats[area].layerGroup = jsonLayer;
				});
			}
		}
		
		var tipAliasObject = {
			"ProjectNumber" : "Project Number",
			"PrimarySponsor" : "Primary Sponsor",
			"PrimaryProgramName" : "Program Name",
			"ProjectAcresAcqActual" : "Acquired Acres to Date",
			"FiscalYear" : "Fiscal Year",
			"SnapshotURL" : "Project URL"
		};
		this.esriMap = L.esri.clusteredFeatureLayer("http://gismanagerweb.rco.wa.gov/arcgis/rest/services/public_lands/WA_RCO_Public_Lands_Inventory_PRISM_v2/MapServer/0/", {
			cluster: new L.MarkerClusterGroup(),
			minZoom:6,
			zIndex: 101,
			onEachMarker: function(geojson, marker) {
				popupText =  "<div style='overflow:scroll; max-width:350px; max-height:260px;'>";
				for (var prop in geojson.properties) {
					var val = geojson.properties[prop];
					var linkId = "shapshot"+ geojson.properties.OBJECTID;
					if(prop.replace("PRISM.DBO.SV_DMPROJECT1.", "") === "SnapshotURL"){
						val = "<a href='" + val + "' id='shapshot"+ geojson.properties.OBJECTID +"' style='color: white; text-decoration: underline' onclick='window.open(this.href, \"Prism\", \"width=995,height=420,scroll=yes,scrolling=yes,scrollbars=yes\");return false;'>" + val + "</a>";
					}
					if (val != 'undefined' && val != "0" && prop !="OBJECTID" && prop != "Name") {
						var tipFieldLabel = prop.replace(" (Esri)",'').replace("PRISM.DBO.SV_DMPROJECT1.", "");
						if(tipFieldLabel in tipAliasObject){
							tipFieldLabel = tipAliasObject[tipFieldLabel];
						}
						popupText += "<span class='tipLabel'>" + tipFieldLabel + "</span>: " + val + "<br>";
					}
				}
				marker.bindPopup(popupText);
			}
		});
		
		MainApplication.Map.setView([47,-120], 7);
		L.control.navbar().addTo(MainApplication.Map);

		//this.baseMapControl = L.control.layers(this.baseMaps, null, {position: 'bottomleft'}).addTo(MainApplication.Map);
		this.mapFirstView=false;
		for(area in BootstrapVars.areaStats){
			if(BootstrapVars.areaStats[area].visible){
				MainApplication.Map.addLayer(BootstrapVars.areaStats[area].layerGroup);	
			}
		}
				
		this.setLegendControls();
	},
	clearAreaSums: function(){
		var summaryValues = BootstrapVars.sums_statewide;
		//Update Bootstrap vars
		for(var area in BootstrapVars.areaStats){
			BootstrapVars.areaStats[area].total_acres = 0;
			BootstrapVars.areaStats[area].starting_total_acres = 0;
			BootstrapVars.areaStats[area].total_cost = 0;
			BootstrapVars.areaStats[area].starting_total_cost = 0;
		}
	},
	createOverlayMask : function(){
		var overlayMask = L.tileLayer('http://a.tiles.mapbox.com/v3/smartmine.ni4o0f6r/{z}/{x}/{y}.png', { zIndex: 100 });
		MainApplication.Map.addLayer(overlayMask);
	},
	resetAreaSums: function(){
		var summaryValues = BootstrapVars.sums_statewide;
		//Update Bootstrap vars
		for(var area in BootstrapVars.areaStats){
			var totalacres = 0;
			var totalcost = 0;
			for(var summary in summaryValues){
				if(BootstrapVars.areaStats[area].abbrev === summaryValues[summary].agency)
				{
						BootstrapVars.areaStats[area].total_acres = summaryValues[summary].acres;
						BootstrapVars.areaStats[area].starting_total_acres = summaryValues[summary].acres;
						BootstrapVars.areaStats[area].total_cost = summaryValues[summary].acquisitioncost;
						BootstrapVars.areaStats[area].starting_total_cost = summaryValues[summary].acquisitioncost;
				} 
			}
		}
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
					tip: {
						width: 20,
						height: 20,
						color: '#222222'
					}
				}
			};
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
						width: 20,
						height: 20,
						corner: 'middle right',
						color: '#222222'
					}
				}
			};
		};
		var ToolTipClass3 = function () {
			return {
				content: {
					text: ''
				},
				hide: false,
				show: false,
				position: {
					my: 'bottom middle',
					at: 'top middle'
				},
				style: {
					classes: 'qtip-dark',
					tip: {
						width: 20,
						height: 20,
						corner: 'bottomMiddle',
						color: '#222222'
					}
				}
			};
		};
		var myToolTip1 = new ToolTipClass1();
		var myToolTip2 = new ToolTipClass2();
		var myToolTip3 = new ToolTipClass1();
		var myToolTip4 = new ToolTipClass1();
		var myToolTip5 = new ToolTipClass3();
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
			$(".leaflet-bottom").css({"margin-bottom": "90px"});

			this.loadGuidedHelp();
		}
	},
	boundaryChange: function(){
		MainApplication.totalAcres = " of 45,663,000";
		GeoAppBase.showAppLoadingStart();
		_.each(BootstrapVars.areaStats, function(area){
			area.total_acres = 0;
			area.total_cost = 0;
			area.total_revenue = 0;
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
		if(selectedVal === ""){

			this.resetAreaSums();
			this.loadRightSlide();
			GeoAppBase.showAppLoadingEnd();
		}

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
						features.sort(function(a,b){
							var returnval = 0;
							if(a.properties[boundary.NameField] < b.properties[boundary.NameField])
								returnval = -1;
							if(a.properties[boundary.NameField] > b.properties[boundary.NameField])
								returnval = 1;
							return returnval;
						});	
						_.each(features, function(feature){

							$('#selectAreaInput').append('<option value="'+feature.properties[boundary.NameField]+'">'+boundary.SelectText + ' ' + feature.properties[boundary.NameField]+'</option>');
							//$("#selectAreaInput").append(new Option(boundary.SelectText + ' ' + feature.properties[boundary.NameField], feature.properties[boundary.NameField]));
							feature.fill =true;
						});

						boundary.jsonLayer = L.geoJson(boundary.json, {
							style: function (feature) {
								return {
									fillColor: boundary.color,
									fillOpacity: 0.01,
									weight: 1,
									opacity: 1,
									color: boundary.color
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
						dc.resetAreaSums();
						dc.loadRightSlide();
						MainApplication.Map.addLayer(boundary.jsonLayer);
						GeoAppBase.showAppLoadingEnd();
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
						dc.resetAreaSums();
						dc.loadRightSlide();
						GeoAppBase.showAppLoadingEnd();
				}
				//console.log(boundary.json.features);
			}
		});
	},
	formatCommas: function(nStr){
		nStr += '';
		x = nStr.split('.');
		x1 = x[0];
		x2 = x.length > 1 ? '.' + x[1] : '';
		var rgx = /(\d+)(\d{3})/;
		while (rgx.test(x1)) {
			x1 = x1.replace(rgx, '$1' + ',' + '$2');
		}
		return x1 + x2;
	},
	formatNumber: function(value, currency){
		return this.formatCommas(parseFloat(value, 10).toFixed(currency ? 2 : 0).replace(/(\d)(?=(\d{3})+\.)/g, "$1,").toString());
	},
	areaChange: function(zoom)
	{
		var dc = this;
		if(MainApplication.selectedBoundary !== undefined)
		{
			if(MainApplication.Map.hasLayer(MainApplication.selectedBoundary)){
					MainApplication.Map.removeLayer(MainApplication.selectedBoundary);	
				}
		}
		var selectedVal = $('#selectAreaInput').val();
		//Slashes are replaced with " - " in the json
		
		var selectedTypeVal = $('#selectStateInput').val();
		var boundary = MainApplication.boundarySelected;

		_.each(boundary.jsonLayer._layers, function(shape){
			if(selectedVal.toString() === shape.feature.properties[boundary.NameField].toString())
			{				
				if(shape.feature.properties.SHAPE_Area !== undefined  && shape.feature.properties.SHAPE_Area !== ''){
					MainApplication.totalAcres = " of " + dc.formatNumber(shape.feature.properties.SHAPE_Area / 4046.85642, false);
				}
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
				//console.log(boundary.sums);
				MainApplication.selectedBoundary = L.polygon(shape._latlngs, {fillOpacity: 0.08}).bindLabel(boundary.SelectText + ' ' + shape.feature.properties[boundary.NameField].toString(), { noHide: true });
				MainApplication.Map.addLayer(MainApplication.selectedBoundary);
			}
		});
		selectedVal = selectedVal.replace(' / ', '-');
		selectedVal = selectedVal.replace('/', '-');

		//Get Data from Lookup Tables
		var summaryValues = boundary.sums;
		//reset areaStats
		if(selectedVal === '')
		{
			_.each(BootstrapVars.areaStats, function(area){
					area.total_acres = area.starting_total_acres;
					area.total_cost = area.starting_total_cost;
					area.total_revenue = area.starting_total_revenue;
			});
		}
		else
		{
			_.each(BootstrapVars.areaStats, function(area){
					area.total_acres = 0;
					area.total_cost = 0;
					area.total_revenue = 0;
			});
		}
		//Update Bootstrap vars
		//if(selectedVal.toString().length < 2 && selectedTypeVal === "Legislative Districts")
		//	selectedVal = "0" + selectedVal;
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
	},
	addMapMarker: function(b){
		var bounds = b;
		var unboundMarker = L.marker([bounds.lat, bounds.lng], {icon: MainApplication.defaultMarker, draggable: false});
		unboundMarker.addTo(MainApplication.Map);
		unboundMarker.markerToolTip = new NewMarkerToolTip({
			marker: unboundMarker
		});
		unboundMarker.bindPopup(unboundMarker.markerToolTip.$el[0], { closeButton:false, closeOnClick:false });
		unboundMarker.openPopup();
		unboundMarker.on("dragend", function(){
			this.openPopup();
		});
		return unboundMarker;
	},
	formatJSONDate: function(jsonDate) {
		var newDate = new Date(parseInt(jsonDate));
		return newDate;
	},
	createGrid: function(gridLayer, area){
		var dc = this;
		gridLayer.on('mouseover', function(e){ 
			if(e.data){ info.update(e); }
		}).on('mouseout', function(e){ 
			info.update();
		});
		gridLayer.on('click', function(props){
			if(props.data){
				//console.log(props.data);
				var aqDate = props.data.Acquisit_1;
				if(aqDate === undefined || aqDate === 0)
				{
					aqDate = "";
				}
				else
				{
					aqDate =props.data.Acquisit_1;
				}
				var acqCost = props.data.ACQCOST !== undefined ? '$' + props.data.ACQCOST.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') : '$0.00';
				var acqYear = props.data.ACQYEAR !== undefined && props.data.ACQYEAR !== 0 ? props.data.ACQYEAR : 'N/A';
				var ownershipType = props.data.OWNTYPE !== 'Unknown' ? props.data.OWNTYPE : 'Assumed Fee Simple';
				var landuseType = props.data.PLAND !== 'Revenue Generation' ? props.data.PLAND : 'Revenue-generating';
				
				var markerToolTip = new MapTipView({
					ParcelName: "Parcel ID: " + props.data.TAXID,
					Owner:  props.data.OWNER,
					OwnershipType: ownershipType,
					TotalArea: props.data.ACRES,
					LandUse: landuseType,
					UnitName: props.data.UNITNAME,
					AcquisitionDate: acqYear,
					Cost: acqCost
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
	loadPrismFunding: function(){
		if(MainApplication.Map.hasLayer(MainApplication.views.mapView.esriMap)){
			$('#lnkPrismFunding').css("background-color","");
			MainApplication.Map.removeLayer(MainApplication.views.mapView.esriMap);	
		}else{
			$('#lnkPrismFunding').css("background-color","#d1f1F4;");
			MainApplication.views.mapView.esriMap.addTo(MainApplication.Map);
		}
		return false;
	},	
	loadRightSlide: function(){
		var selectedVal = $('#selectAreaInput').val();
		if(selectedVal === '') {
			selectedVal = "State Summary";
		} else {
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

		for(var mapLayer in BootstrapVars.areaStats){
			if(BootstrapVars.areaStats[mapLayer].layerGroupName === layerType){
				BootstrapVars.areaStats[mapLayer].visible = true;
				dc.activeLayers.push(BootstrapVars.areaStats[mapLayer].abbrev);
				try{
					MainApplication.Map.addLayer(BootstrapVars.areaStats[mapLayer].layerGroup);
				}catch(e){
					console.log(e);
				}
			}else{
				BootstrapVars.areaStats[mapLayer].visible = false;
				try{
					MainApplication.Map.hasLayer(BootstrapVars.areaStats[mapLayer].layerGroup) ? MainApplication.Map.removeLayer(BootstrapVars.areaStats[mapLayer].layerGroup) : false;
				}catch(e){
					console.log(e);
				}
			}
		}
		
		//refreshes the right slide and legend
		this.setLegendControls();			
		this.showRightSlide();
		
		return false;
	},
	setLegendControls : function(){
		//console.log("Data");
		var dc=this;

		this.layerMaps = {};
		_.each(BootstrapVars.areaStats, function(area){
			if(area.visible){
				dc.layerMaps[area.abbrev] = area.layerGroup;
			}else if(dc.featureLayerControls !== undefined){
				dc.featureLayerControls.removeLayer(area.layerGroup);
			}
		});
		
		if(this.featureLayerControls === undefined)	{
			this.featureLayerControls = L.control.layers(this.baseMaps, this.layerMaps, {position: 'bottomleft'});
			this.featureLayerControls.addTo(MainApplication.Map);
		}else{
			for(var overlayMap in this.layerMaps){
				dc.featureLayerControls.addOverlay(this.layerMaps[overlayMap], overlayMap);
			}
		}
		_.each($(this.featureLayerControls._container).find("label"), function(legendItem){
			var spanObject = $(legendItem).children("span").html().trim();
			var layerDetails = _.find(BootstrapVars.areaStats, function(area){
				return area.abbrev === spanObject;
			});
			//if it's found in the base areas array
			if(layerDetails){
				var legendKey = $('<div>', { 
					"class": "colorKey", 
					style: "background-color:"+layerDetails.color
				});
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
					if(layerDetails){
						//set as inactive
						if(checkboxObject.length === 1){
							layerDetails.visible = true;
						}else{
							layerDetails.visible = false;				
						}
					}else{
						//consoleconsole.log(ev);
					}
					dc.showRightSlide();
				}
			}, 16);
		});
		
		//extra layer clean up, just to be safe
		/*MainApplication.Map.on("baselayerchange", function(ev){
			console.log(ev, "Layer Changed");
			for(mapLayer in MainApplication.views.mapView.baseMaps){
				if(mapLayer !== ev.name && MainApplication.Map.hasLayer(MainApplication.views.mapView.baseMaps[mapLayer])){
					MainApplication.Map.removeLayer(MainApplication.views.mapView.baseMaps[mapLayer]);
				}
			}
		});*/
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
	showAcquisitions : function(){
		this.resetNavOptions();
		$('#lnkAcquisitions').hasClass("btn-primary") ? false : $('#lnkAcquisitions').addClass("btn-primary");
		$('#AcquisitionToggles').css("display","block");
		this.setDisplayedLayers("acquisitions");
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
	toggleConnection: function(){
		GeoAppBase.toggleConnectionVar();
		this.toggleSetButtons();
		if(MainApplication.connectionActive === true){
			MainApplication.onDeviceOnline();
		}else{
			MainApplication.onDeviceOffline();
		}
	},
	toggleRightMenuPane: function(){
		MainApplication.views.mapSelectorSlideView.toggleRightMenu();
		return false;
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
		"click #lnkAcquisitions" : "showAcquisitions",
		"click #lnkLandTypes" : "showLandOptions",
		"click #lnkProposed" : "showProposed",
		"click #lnkPrismFunding" : "loadPrismFunding"
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
	showAcquisitions : function(ev){
		MainApplication.views.mapView.showAcquisitions(ev);	
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
			$("#toggleQuestionButton").animate({"margin-right": "358px"});
		}else{
			MainApplication.views.mapView.mapPaneView.slide.close();
			$("#toggleQuestionButton").animate({"margin-right": "0px"});
			$(MainApplication.paneRegion.el).css({"width":"25em"});
			$('#expandSummaryButton').removeClass("collapsable");
			$('#expandSummaryButton').hasClass("expandable") ? false : $('#expandSummaryButton').addClass("expandable");
			$("#expandSummaryButton button").html("<i class='fa fa-arrow-circle-o-left fa-lg'></i>");
			$("#summarySelectors").width(90);

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
	initialize: function(options){
		this.marker = options.marker;
		this.Description = "New Todo";
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
		this.arcColor="#000000";
		this.chartDefaultHeight = 170;
		this.chartDefaultWidth = 310;
		this.currentChartHeight = this.chartDefaultHeight;				
		this.currentChartWidth = this.chartDefaultWidth;
		this.summaryText = options.summaryText;
	},
	events: {
		"click #showPieChart" : "setPieMode",
		"click #showBarChart" : "setBarMode",
		"click #expandSummaryButton" : "setSummarySize",
		"click #closeSummaryButton" : "closeSummaryPanel",
		"click #lnkHelpMenu" : "showHelpMenu",
		"click #summaryLayer" : "setSummaryLayer"
	},
	onShow: function(){
		//initially hide date range
		$( window ).smartresize(function() {
			MainApplication.views.mapView.showRightSlide();
		});
		
		if(this.slide === undefined){
			this.slide = $('.slide-menu').bigSlide({ 
				side:"right", 
				menu:"#SummaryPaneSlideOut", 
				menuWidth : "25em" }).css({ "z-index":"1030", "top":"35px", "right":"0px"});
			this.slide._state = "open";
		}
		
		var summaryHeight = $(window).height()-67;
		$("#summaryPanelBlock").css({"height":summaryHeight});
		
		var dc=this;
		//start in bar mode
		this.loadBarLayerComparison();
		this.loadPieLayerComparison();
		$( "#ddlSummaryType" ).change(function() {
			dc.loadBarLayerComparison();
			dc.loadPieLayerComparison();
		});
		
		if(this.chartType === undefined){
			this.setPieMode();
		}else{
			if(this.chartType === "bar"){
				this.setBarMode();
			}else{
				this.setPieMode();
			}
		}
	},
	closeSummaryPanel: function(){
		MainApplication.views.mapSelectorSlideView.toggleRightMenu();
		return false;
	},
	formatCommas: function(nStr){
		nStr += '';
		x = nStr.split('.');
		x1 = x[0];
		x2 = x.length > 1 ? '.' + x[1] : '';
		var rgx = /(\d+)(\d{3})/;
		while (rgx.test(x1)) {
			x1 = x1.replace(rgx, '$1' + ',' + '$2');
		}
		return x1 + x2;
	},
	formatNumber: function(value, currency){
		return this.formatCommas(parseFloat(value, 10).toFixed(currency ? 2 : 0).replace(/(\d)(?=(\d{3})+\.)/g, "$1,").toString());
	},	
	getVisibleAreas: function(){
		return _.filter(BootstrapVars.areaStats, function(area){ 
			return area.visible===true; 
		});
	},
	loadBarLayerComparison: function(){
		var dc=this;
		this.type = $( "#ddlSummaryType" ).val();
		this.loadSummaryText(this.type);
		var selectedAreas = this.getVisibleAreas();
		var barChartSeries = [];
		var xAxisTitle = GeoAppBase.capitaliseEach("Total " + this.type.replace("total_", ""));

		_.each(selectedAreas, function(area){
			var val = 0;
			barChartSeries.push({
				"name" : area.agency,
				"data" : [parseInt(area[dc.type])], //, area.total_cost, area.total_revenue
				"color" : area.color
			});
		});

		// cheap fix - see https://github.com/highslide-software/highcharts.com/issues/1132
		var parentEl = $('#barChartLayer').parent(); 
		$('#barChartLayer').remove();
		parentEl.html('<div id="barChartLayer"></div>');		
		
		this.barChartObject = new Highcharts.Chart({
			chart: {
				height: this.currentChartHeight,
				width: this.currentChartWidth,
				backgroundColor:'rgb(40, 40, 40)',
				type: 'bar',
				renderTo: 'barChartLayer',
				margin: [30,35,35,55]
			},
			title: {
				text: GeoAppBase.capitaliseEach(MainApplication.views.mapView.currentLayersType + " " + xAxisTitle +" Compared"),
				style: { "font-size" : "9.5pt", color: 'rgb(238, 238, 238)' }, //
				align: "center",
				margin: 5,
				x: -20,
				y: 10
			},
			xAxis: {
				categories: [xAxisTitle],
				labels:
				{
					style: { color: 'rgb(238, 238, 238)' }
				}
			},
			yAxis: {
				title: {
					text: ''
				},
				labels:
				{
					style: { color: 'rgb(238, 238, 238)' }
				}
			},
			series: barChartSeries,
			legend: {
				enabled: false
			},
			exporting: {
				enabled: true,
				buttons: {
					contextButton: {
						y : -5
					}
				},
				chartOptions: {
					chart: {
						width: 800,
						height: 600,
						type: 'bar',
						backgroundColor:'rgb(40, 40, 40)',
						margin: [60,35,80,55]
					},
					title: {
						style: { "font-size" : "9.5pt", color: 'rgb(255, 255, 255)' }, //
						align: "center",
						margin: 5,
						x: 0,
						y: 30
					},					
					legend: {
						itemStyle:{ color: 'rgb(238, 238, 238)'  },
						enabled: true
					},
					xAxis: {
						categories: [xAxisTitle],
						labels:
						{
							style: { color: 'rgb(238, 238, 238)' }
						}
					},
					yAxis: {
						title: {
							text: ''
						},
						labels:
						{
							style: { color: 'rgba(238, 238, 238)' }
						}
					}
				}
			},
			credits: {
				enabled: false
			}
		});
		
		//on save override and set legend to true, 
		return false;
	},
	loadPieLayerComparison: function(){	
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

		// cheap fix - see https://github.com/highslide-software/highcharts.com/issues/1132
		var parentEl = $('#pieChartLayer').parent(); 
		$('#pieChartLayer').remove();
		parentEl.html('<div id="pieChartLayer"></div>');		
		if(this.pieChartObject !== undefined){
			this.pieChartObject.destroy();
			delete this.pieChartObject;
		}
		
		this.loadSummaryText(this.type);
		
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
				plotShadow: false,
				backgroundColor:'rgb(40, 40, 40)',
				margin: [-20, -50, -55, -50]
			},
			title: {
				text: GeoAppBase.capitaliseEach(MainApplication.views.mapView.currentLayersType + " " + xAxisTitle +" Compared"),
				style: { "font-size" : "9.5pt", color: 'rgb(238, 238, 238)'  }, //
				align: "center",
				margin: 5,
				x: -20 
			},
			tooltip: {
				pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
			},
			plotOptions: {
				pie: {
					showInLegend: true,
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
			legend:{
				enabled:false
			},			
			exporting: {
				enabled: true,
				chartOptions: {
					chart: {
						width: 800,
						height: 600,
						backgroundColor:'rgb(40, 40, 40)',
						type: 'pie',
						margin: [-10,-10,-10,-10]
					},
					title: {
						style: { "font-size" : "9.5pt", color: 'rgb(238, 238, 238)'  }, //
						align: "center",
						margin: 5,
						x: 0,
						y: 30
					},	
					legend:{
						itemStyle:{ color: 'rgb(238, 238, 238)'  },
						enabled:true
					}			
				}
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
		var isCurrency = typeView === "total_acres" ? false : true;
		var currencyPrefix = typeView === "total_acres" ? "" : "$";
				
		$("#summaryDateRange").css({"display":"none"});

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
				var legendKey = $("<div>", { "class": "colorKey", style: "background-color:"+area.color+";" });
				var checkedStatus = area.visible ? " checked='true'" : "";
				
				areaSummary += "<div style='vertical-align: middle'><div style='display: inline-block; vertical-align: top; margin-right: 6px'>" + legendKey[0].outerHTML + "<input type='checkbox' name='inputSummaryItem-" + area.abbrev + "' id='inputSummaryItem-"+ area.abbrev + "' data-abbr='" + area.abbrev + "' class='usePointer'"+checkedStatus+" /></div><div style='display: inline-block; vertical-align: middle; width: 80%'><label class='usePointer'  data-abbr='" + area.abbrev + "' for='inputSummaryItem-" + area.abbrev + "' >" + area.agency + ": " + currencyPrefix + dc.formatNumber(val, isCurrency)+ "</label></div></div>";

				legendKey.prependTo(areaSummary);
				summaryText = summaryText + areaSummary;
				total += val;
			}
		});


		var totalAcresBoundary = MainApplication.totalAcres !== undefined ? MainApplication.totalAcres : "";

		switch(typeView) {
			case "total_acres":
				prefixText = "<div style='margin-bottom: 10px; margin-top: 30px'>Total " + this.type.replace("total_", "")  + ": " + currencyPrefix  + dc.formatNumber(total, isCurrency)+ totalAcresBoundary + "</div>";
				break;
			case "total_cost":
				prefixText = "<div style='margin-bottom: 10px; margin-top: 30px'>Total " + this.type.replace("total_", "")+ "</div>";
				break;
			case "total_revenue":
				prefixText = "";
				summaryText = "(Available Soon)";
				break;
			default:
				break;
		}
		
		if(MainApplication.views.mapView.currentLayersType==="acquisitions"){
			$("#summaryDateRange").css({"display":"block"});
			_.each(BootstrapVars.areaInformation, function(area){
				if(area.layerGroupName===MainApplication.views.mapView.currentLayersType){
					prefixText = prefixText + "<div style='font-size:9pt;'>State acquisitions from "+area.startDate+" and " +area.endDate + "</div>";
				}
			});
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
			return false;
		}
	},
	setSummarySize: function(ev){
		if($(ev.currentTarget).hasClass("expandable")){
			$(ev.currentTarget).addClass("collapsable");
			$(ev.currentTarget).removeClass("expandable");
			$("#expandSummaryButton button").html("<i class='fa fa-arrow-circle-o-right fa-lg'></i>");
			$(MainApplication.paneRegion.el).animate({"width":"100%"});
			$("#summarySelectors").css({"width":"90px"});
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
			$("#expandSummaryButton button").html("<i class='fa fa-arrow-circle-o-left fa-lg'></i>");
			$(MainApplication.paneRegion.el).animate({"width":"25em"});		
			$("#summarySelectors").css({"width":"308px"});
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
		var selectedAreas = this.getVisibleAreas();
		var layerGroup = selectedAreas[0].layerGroupName;
		var areaInformationView = new AreaInformationView({layerGroupName: layerGroup});
		MainApplication.modalRegion.show(areaInformationView);
		return false;
	},	
	synchronizedMouseOver: function(ev){
		var arc = d3.select(this);
		var indexValue = arc.attr("index_value");
		this.arcColor = arc[0][0].style.fill;
		arc[0][0].style.fill="DarkBlue";
		return false;
	},
	synchronizedMouseOut: function(ev){
		var arc = d3.select(this);
		var indexValue = arc.attr("index_value");
		arc[0][0].style.fill=this.arcColor;
		return false;
	}
});

var WelcomeView = Backbone.Marionette.ItemView.extend({
	template: function (serialized_model) {
		return Handlebars.buildTemplate(serialized_model, MainApplication.Templates.WelcomeTemplate);
	},
	events: {
		"click #btnCloseWelcome": "closeModal"
	},
	closeModal: function () {			 
		MainApplication.modalRegion.hideModal();
		$("#SummaryPaneSlideOut").css("display","block");
		$("#toggleQuestionButton").css({"margin-right": "358px"});
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
		"click #btnCancelInfo": "closeModal"
	},
	onShow: function()
	{
		return false;
		/*var dc = this;
		var htmlInfo = "";
		_.each(BootstrapVars.areaInformation, function(areaInformation){
			if(dc.layerGroupName === areaInformation.layerGroupName)
			{
				htmlInfo = areaInformation.htmlInfo;
			}
		});
		$("#areaInfoDiv").html(htmlInfo);*/
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
			OwnershipType: this.OwnershipType,
			TotalArea: this.TotalArea,
			AcquisitionDate: this.AcquisitionDate,
			LandUse: this.LandUse,
			Cost: this.Cost
		};
	},
	initialize: function (options) {
		this.ParcelName = options.ParcelName;
		this.Owner = options.Owner;
		this.OwnershipType = options.OwnershipType;
		this.TotalArea = options.TotalArea;
		this.LandUse = options.LandUse;
		this.AcquisitionDate = options.AcquisitionDate;
		this.Cost = options.Cost;
	},
	events: {
		"click #btnQuestionPost": "postQuestion"
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
	},
	onShow: function () {
		$('#selectStateInput').qtip("show");
		$('#summaryPanelBlock').qtip("show");
		$('.leaflet-control-layers').qtip("show");
		$('.leaflet-control-zoom-out').qtip("show");
		$('#lnkMapsSlideToggle').qtip("show");
		return false;
	}
});
