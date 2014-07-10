MainApplication.Templates = MainApplication.Templates || {};

MainApplication.Templates.MapTemplate = [
	"<div style='color:#000000;'>",
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
		"<div id='toggleSummaryButton' class='btn hardwareAnimation'><i class='fa fa-bar-chart-o fa-lg'></i></div>",
    	"<div id='toggleQuestionButton' class='btn hardwareAnimation'><i class='fa fa-info fa-2x'></i></div>",
		"<div id='map' style=\"top: 35px;\"></div>",
	"</div>"
].join("\n");

MainApplication.Templates.MapSelectorSlideTemplate = [
	"<div>",
		"<a href='#' id='lnkMapsSlideToggle'>Inventory Maps</a><a href='http://www.geoengineers.com/smartmine' target='_blank'><img id='smartmineLogo' src='content/images/smartmine-logo.png'/><a>",
		"<div id='mapLayers'>",
			"<button id='lnkAgency' class='btn btn-primary navLayers'><i class='fa fa-building'></i>&nbsp;&nbsp;Owner</button>",
			"<button id='lnkLandTypes' class='btn navLayers'><i class='fa fa-tree'></i>&nbsp;&nbsp;Land Use</button>",
			"<button id='lnkAcquisitions' class='btn navLayers'><i class='fa fa-flag'></i>&nbsp;&nbsp;Acquisitions</button>",
			//"<button id='lnkProposed' class='btn navLayers'><i class='fa fa-map-marker'></i>&nbsp;&nbsp;Proposed</button>",
			"<button id='lnkPrismFunding' class='btn'><i class='fa fa-institution'></i>&nbsp;&nbsp;RCO Grants</button>",
		"</div>",
	"</div>"
].join("\n");

MainApplication.Templates.MapPaneTemplate = [
	"<div id='summaryPanelBlock'>",
		"<div id='closeSummaryBlock'><div id='closeSummaryButton'><i class='fa fa-times fa-lg'></i></div></div>",
		"<div id='summaryMainHead'>",
			"<div id='expandSummaryButton' class='expandable'><button class='btn'><i class='fa fa-arrow-circle-o-left fa-lg'></i></button></div>",
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
		//"<div id='summaryDateRange' style='font-size:8pt;text-align:left;'></div>",
		"<div id='summaryHelpMenu' class='usePointer' style='margin-top: 20px'><a href='#' id='lnkHelpMenu' style='text-decoration:underline; color: #FFFF00'>More about this data?</a></div><br /><br /><br /><br />",
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
	"<div class='modal-dialog'>",
		"<div class='modal-content'>",
			"<div class='modal-header'>",
				"<h4 id='mySlideLabel'>Welcome to the first Web-based Washington State Public Lands Inventory</h4>",
			"</div>",
			"<div class='modal-body'>",
				"<div class='introText col-sm-7'>",
					"<p>This inventory shows public lands by owner and identifies the location, acreage, principal use of each parcel and in some cases, the date and cost of acquisition and a link to more detailed information.</p>",
					"<p>Data comes from University of Washington’s School of Environmental and Forest Sciences and the following Washington State agencies: Department of Fish and Wildlife, Department of Natural Resources, Recreation and Conservation Office, and State Parks and Recreation Commission.</p><br/>",
				"</div>",
				"<div class='aboutLogos col-sm-5'>",
					"<div><a href='http://www.wdfw.wa.gov' target='_blank'><img src='./content/images/logos/LogoWADFW-sm.jpg' /></a></div>",
					"<div><a href='http://www.dnr.wa.gov' target='_blank'><img src='./content/images/logoWADNR.jpg' style='width: 200px' /></a></div>",
					"<div><a href='http://www.rco.wa.gov/' target='_blank'><img src='./content/images/logo.jpg' style='max-width: 200px' /></a></div>",
					"<div><a href='http://www.parks.wa.gov' target='_blank'><img src='./content/images/logos/WSPLogo_200.png' /></a></div>",
				"</div>",
			"</div>",
			"<div class='modal-footer' style='text-align: center;'>",
				"<button class='btn btn-primary' type='button' id='btnCloseWelcome' style='width: 200px'>Continue</button>",
			"</div>",
		"</div>",
	"</div>",
].join("\n");

MainApplication.Templates.MapTipTemplate = [
    "<h4>{{ParcelName}}</h4>",
		"<span class='tipLabel'>Owner:</span> {{Owner}} <br />",
		"<span class='tipLabel'>Ownership Type: </span>{{OwnershipType}} <br />",
		"<span class='tipLabel'>Total Area (Acres):</span> {{TotalArea}}<br />",
		"<span class='tipLabel'>Principal Land Use:</span> {{LandUse}}<br />",
		"<span class='tipLabel'>Acquisition Year:</span> <span style=\" color: #FFFF00\">{{AcquisitionDate}}</span><br />",
		"<span class='tipLabel'>Acquisition Cost:</span> <span style=\" color: #FFFF00\">{{Cost}}</span><br /><br/>",

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
    "<div id='gisLegendControls' class='hardwareAnimation'>",
        "<span class='fa-stack'>",
          "<i class='fa fa-list-ul  fa-stack-2x top'></i>",
        "</span>",
    "</div>",
    "<div class='slide-body hardwareAnimation' id='gisLegendControlsExpanded'>",
        "<div class='legendLayers' style=' height: 200px'>",
            "<div id='legendContainer'>",
            "</div>",
        "</div>",
	"</div>"
].join("\n");

MainApplication.Templates.GuidedHelpTemplate = [
    "<div class='mask tipBG'></div>"
].join("\n");

MainApplication.Templates.AreaInformationTemplate = [
	"<div class=\"modal-dialog\">",
		"<div class=\"modal-content\">",
			"<div class=\"modal-header\">",
				"<h4 id=\"mySlideLabel\">About This Data</h4>",
			"</div>",
			"<div class=\"modal-body\">",
				"<div id=\"areaInfoDiv\" style='padding:10px;'></div>",
			"</div>",
			"<div class=\"modal-footer\">",
				"<button class=\"btn btn-primary\" type=\"button\" id=\"btnCancelInfo\">Close</button>",
			"</div>",
		"</div>",
	"</div>",
].join("\n");
