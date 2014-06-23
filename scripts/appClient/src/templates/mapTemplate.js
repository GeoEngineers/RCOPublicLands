MainApplication.Templates = MainApplication.Templates || {};

MainApplication.Templates.MapTemplate = [
	"<div style='color:#000000;'>",
		"This is the landing page area, you can place any content here.",
		"<div id='connectionStatus'><img src='./content/images/38-1.gif'><span class='txt'> Re-connecting...</span></div>",
		"<select name='selectState' id='selectStateInput' class='form-control'>",
			"<option value=''>- No Boundaries -</option>",
			"<option value='Counties'>Counties</option>",
			"<option value='Legislative Districts'>Legislative Districts</option>",
			"<option value='WRIAs'>WRIAs</option>",
			"<option value='Congressional Districts'>Congressional Districts</option>",
		"</select>",
		"<select name='selectArea' id='selectAreaInput' class='form-control'>",
			"<option value=''>- Select Area -</option>",
		"</select>",
		"<a href='#' id='lnkSlideMenu' class='navLink slide-menu' href='#SummaryPaneSlideOut'></a>",
		"<div id='toggleSummaryButton' class='btn'><i class='fa fa-bar-chart-o fa-lg'></i></div>",
    	"<div id='toggleQuestionButton' class='btn'><i class='fa fa-info fa-2x'></i></div>",
		"<div id='map' style=\"top: 35px;\"></div>",
	"</div>"
].join("\n");

MainApplication.Templates.MapSelectorSlideTemplate = [
	"<div>",
		"<a href='#' id='lnkMapsSlideToggle'>Inventory Maps</a><a href='http://www.geoengineers.com/smartmine' target='_blank'><img id='smartmineLogo' src='content/images/smartmine-logo.png'/><a>",
		"<div id='mapLayers'>",
			"<button id='lnkAgency' class='btn btn-primary navLayers'>Agency</button>",
			"<button id='lnkLandTypes' class='btn navLayers'>Land Types</button>",
			"<button id='lnkAquisitions' class='btn navLayers'>Aquisitions</button>",
			"<button id='lnkProposed' class='btn navLayers'>Proposed</button>",
			"<button id='lnkPrismFunding' class='btn'>RCO Grants</button>",
			//"<a href='#' id='lnkPrismFunding' class='navLink' href='#lnkPrismFunding'>",
				//"<i class=\"icon\" style=\"margin:0px; width: 16px; height:16px; font-size: 15px;\">&#x2106;</i>",
			//	"<div class='txt'>RCO Grants</div>",
			//"</a>",
		"</div>",
		"<div id='mapControls'>",
			"<div>",
				//"<a href='#' id='lnkSlideMenu' class='navLink slide-menu' href='#SummaryPaneSlideOut'>",
				//	"<i class='fa fa-bar-chart-o fa-lg'></i>",
				//	"<div class='txt'>SUMMARY</div>",
				//"</a>",
			"</div>",
		"</div>",
	"</div>"
].join("\n");

MainApplication.Templates.MapPaneTemplate = [
	"<div id='summaryPanelBlock'>",
		"<div id='closeSummaryBlock'><div id='closeSummaryButton'>X</div></div>",
		"<div id='summaryMainHead'>",
			"<div id='expandSummaryButton' class='expandable'><button class='btn'>&lt;&lt;&lt; Expand</button></div>",
			"<div id='summaryHeaderName'>{{SummaryTitle}}</div>",
		"</div>",
		"<div id='pieChartBlock'>",
			"<div id='pieChartLayer'></div>",
		"</div>",
		"<div id='barChartBlock'>",
			"<div id='barChartLayer'></div>",
		"</div>",
		"<div id='summarySelectors'>",
			"<div id='summaryTypeSelector'>",
				"<select id=\"ddlSummaryType\" class='form-control' style='display: none'>",
					"<option value=\"total_acres\" selected>Total Acres</option>",
					"<option value=\"total_cost\">Total Cost</option>",
					"<option value=\"total_revenue\">Total Revenue</option>",
				"</select>",
			"</div>",
			"<div id='summaryHeaderOptions'>",
				"<div id='chartSelector' class='btn-group'>",
					"<button href='#' id='showPieChart' class='btn'><i id='pieChartIcon' class='fa fa-circle-o fa-lg'></i></button>",
					"<button href='#' id='showBarChart' class='btn'><i id='barChartIcon' class='fa fa-bar-chart-o fa-lg'></i></button>",
				"</div>",
			"</div>",
		"</div>",		
		"<div id='summaryLayer'></div>",
		"<div id='summaryDateRange' style='font-size:8pt;text-align:left;'></div>",
		"<div id='summaryHelpMenu' class='usePointer'><a href='#' id='lnkHelpMenu' style='text-decoration:underline;'>More about this data?</a></div><br /><br /><br /><br />",
	"</div>"
].join("\n");

MainApplication.Templates.LayersTemplate = [
    "<div id='gisLayerControls'>",
        "<span class='fa-stack'>",
          "<i class='fa fa-check-square-o fa-stack-2x top'></i>",
        "</span>",
    "</div>",
    "<div class=\"slide-body\" id='gisLayerControlsExpanded'>",
        "<div class='markerLayers'>",
            "<div id='treeviewdiv' style='color: white; border: 0px; font-size: 8pt; text-align: left; width: 240px' >",
            "</div>",
		"</div>",
	"</div>"
].join("\n");

MainApplication.Templates.MapNewMarkerTipTemplate = [
    "<div class='unboundNewMarkerMsg'>",
		"<b>{{Description}}</b><br />",
		"Select \"Edit\" to rename or move this item.<br />",
		"<a href='#' class='geoEditTodo'>Edit Todo</a> - ",
		"<a href='#' class='geoDeleteTodo'>Delete Todo</a>",		
	"</div>",
].join("\n");

MainApplication.Templates.WelcomeTemplate = [
	"<div class=\"modal-dialog\">",
		"<div class=\"modal-content\">",
			"<div class=\"modal-header\">",
				"<h4 id=\"mySlideLabel\">The Recreation and Conservation Office Welcomes you to the first Web-based Public Lands Inventory of Washington State</h4>",
			"</div>",
			"<div class=\"modal-body\">",
				"<p>The inventory shows publicly-owned lands by owner and identifies the location, acreage, and principal use of each parcel. For state-owned land acquired between 2003 and 2013, the date and cost of acquisition is also included.  For public land acquisition funded by the Recreation and Conservation Office or its predecessor since 1964, the inventory also includes a link to all grant information.</p>", 
				"<p>Data comes from University of Washington’s School of Environmental and Forest Sciences and the following state agencies: Department of Fish and Wildlife, Department of Natural Resources, State Parks and Recreation Commission, and the Recreation and Conservation Office.</p>", 
				"<p>The Recreation and Conservation Office is a state agency that manages grant programs to create outdoor recreation opportunities, protect the best of the state's wildlife habitat and farmland, and help return salmon from near extinction. The legislature provided funding to the Recreation and Conservation Office to complete this public lands inventory in the 2013-15 Capital Budget, Chapter 19, Section 3174.</p>", 
				"<br/><div style='text-align:center;'><a href='http://www.rco.wa.gov'><img src='./content/images/logos/LogoWARCO-sm.jpg' style='padding: 0px 4px 4px 0px;background-color:#FFFFFF;margin-bottom:4px;' /></a></div>",
				"<div class='aboutLogos'>",
					"<div><a href='http://www.fws.gov'><img src='./content/images/logos/LogoUSFWS-sm.jpg' /></a></div>",
					"<div><a href='http://www.wdfw.wa.gov'><img src='./content/images/logos/LogoWADFW-sm.jpg' /></a></div>",
					"<div><a href='http://www.parks.wa.gov'><img src='./content/images/logos/WSPLogo_200.png' /></a></div>",
				"</div>",
			"</div>",
			"<div class=\"modal-footer\" style=\"text-align: center\">",
				"<button class=\"btn btn-primary\" type=\"button\" id=\"btnCloseWelcome\" style=\"width: 200px\">Continue</button>",
			"</div>",
		"</div>",
	"</div>",
].join("\n");

MainApplication.Templates.MapTipTemplate = [
    "<h4>{{ParcelName}}</h4>",
		"Owner: {{Owner}} <br />",
		"Ownership Type: {{OwnershipType}} <br />",
		"Total Area (Acres): {{TotalArea}}<br />",
		"Principal Land Use: {{LandUse}}<br />",
		"Acquisition Year: <span style=\" color: #FFFF00\">{{AquisitionDate}}</span><br />",
		"Acquisition Cost: <span style=\" color: #FFFF00\">{{Cost}}</span><br /><br/>"
		//"<button class=\"btn btn-primary\" type=\"button\" id=\"btnQuestionPost\" style='display: none'>Post a Question</button>",	
].join("\n");

MainApplication.Templates.QuestionTemplate = [
	"<div class=\"modal-dialog\">",
		"<div class=\"modal-content\">",
			"<div class=\"modal-header\">",
				"<h4 id=\"mySlideLabel\">Post a Question</h4>",
			"</div>",
			"<div class=\"modal-body\">",
				"<label for=\"txtName\">Your Name:</label><input type=\"text\" class=\"form-control\" id=\"txtName\" /><br />",
				"<label for=\"txtEmail\">Email Address:</label><input class=\"form-control\" type=\"text\" id=\"txtEmail\" /><br />",
				"<label for=\"txtQuestion\">Your Question:</label><br />",
				"<textarea id=\"txtQuestion\" class=\"form-control\"/>",
			"</div>",
			"<div class=\"modal-footer\">",
				"<button class=\"btn btn-primary\" type=\"button\" id=\"btnCloseQuestion\">Submit</button>",
				"<button class=\"btn btn-warning\" type=\"button\" id=\"btnCancelQuestion\">Cancel</button>",
			"</div>",
		"</div>",
	"</div>",
].join("\n");

MainApplication.Templates.HeaderTemplate = [ 
	"<h4><img id='rcoLogo' src='./content/images/rco-logo-white.png' />&nbsp;WASHINGTON PUBLIC LANDS INVENTORY</h4>",
].join("\n");


MainApplication.Templates.LegendTemplate = [
    "<div id='gisLegendControls'>",
        "<span class='fa-stack'>",
          "<i class='fa fa-list-ul  fa-stack-2x top'></i>",
        "</span>",
    "</div>",
    "<div class=\"slide-body\" id='gisLegendControlsExpanded'>",
        "<div class='legendLayers' style=\" height: 200px\">",
            "<div id='legendContainer'>",
            "</div>",
        "</div>",
	"</div>"
].join("\n");

MainApplication.Templates.GuidedHelpTemplate = [
    "<div class='mask' style='width: 100%; height: 100%; position: absolute; left: 0px; top: 0px; background-color: #000000; opacity:0.4; filter:alpha(opacity=40); '>",
	"</div>"
].join("\n");

MainApplication.Templates.AreaInformationTemplate = [
	"<div class=\"modal-dialog\">",
		"<div class=\"modal-content\">",
			"<div class=\"modal-header\">",
				"<h4 id=\"mySlideLabel\">About This Data</h4>",
			"</div>",
			"<div class=\"modal-body\">",
				"<div id='areaInfoDiv'></div>",
			"</div>",
			"<div class=\"modal-footer\">",
				"<button class=\"btn btn-primary\" type=\"button\" id=\"btnCancelInfo\">Close</button>",
			"</div>",
		"</div>",
	"</div>",
].join("\n");
