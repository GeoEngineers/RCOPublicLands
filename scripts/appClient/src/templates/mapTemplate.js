MainApplication.Templates = MainApplication.Templates || {};

MainApplication.Templates.MapTemplate = [
	"<div style='color:#000000;'>",
		"This is the landing page area, you can place any content here.",
		"<div id='connectionStatus'><img src='./content/images/38-1.gif'><span class='txt'> Re-connecting...</span></div>",
		"<select name='selectState' id='selectStateInput' class='form-control'>",
			"<option value=''>- Select Boundary -</option>",
			"<option value='Counties'>Counties</option>",
			"<option value='Legislative Districts'>Legislative Districts</option>",
			"<option value='WRIAs'>WRIAs</option>",
			"<option value='Congressional Districts'>Congressional Districts</option>",
		"</select>",
		"<select name='selectArea' id='selectAreaInput' class='form-control'>",
			"<option value=''>- Select Area -</option>",
		"</select>",
		"<div id='map' style=\"top: 35px\"></div>",
	"</div>"
].join("\n");

MainApplication.Templates.MapSelectorSlideTemplate = [
	"<div>",
		"<a href='#' id='lnkMapsSlideToggle'>Maps</a>",
		"<div id='mapLayers'>",
			"<button id='lnkAgency' class='btn btn-primary navLayers'>Agency</button>",
			"<button id='lnkLandTypes' class='btn navLayers'>Land Types</button>",
			"<button id='lnkAquisitions' class='btn navLayers'>Aquisitions</button>",
			"<button id='lnkProposed' class='btn navLayers'>Proposed</button>",
		"</div>",
		"<div id='mapControls'>",
			"<div class='slide-menu'><a href='#' id='lnkSlideMenu' class='navLink' href='#SummaryPaneSlideOut'><i class='icon-bar-chart icon-large'></i><div class='txt'>SUMMARY</div></a></div>",
			"<div><a href='#' id='lnkPrismFunding' class='navLink' href='#lnkPrismFunding'><i class=\"icon\" style=\"margin:0px; width: 16px; height:16px; font-size: 15px;\">&#x2106;</i><div class='txt'>Recreation and Conservation Office Grants</div></a></div>",
		"</div>",		
	"</div>"
].join("\n");

MainApplication.Templates.MapPaneTemplate = [
	"<div style=\"padding: 10px\">",
		"<h3>Summary</h3>",		
		"<div id='chartLayer'></div>",
		"<div style=\"text-align: right; width: 100%\"><select id=\"ddlSummaryType\">",
			"<option value=\"total_acres\" selected>Total Acres</option>",
			"<option value=\"total_cost\">Total Cost</option>",
			"<option value=\"total_revenue\">Total Revenue</option>",
		"</select></div><br/>",
		"<svg class='barChartLayer'></svg>",
		"<div id='summaryLayer'></div>",
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
				"<h4 id=\"mySlideLabel\">Welcome to the Public Lands Inventory</h4>",
			"</div>",
			"<div class=\"modal-body\">",
				"<p>The Washington Public Lands Inventory was developed by a partnership of federal and state agencies. ", 
				"Data is provided by WA State Parks and the Washington State Parks and Recreation Commission and Washington State Recreation and Conservation Office.</p>", 
				"<br/><div style='text-align:center;'><a href='http://www.rco.wa.gov'><img src='./content/images/logos/LogoWARCO-sm.jpg' style='padding: 0px 4px 4px 0px;background-color:#FFFFFF;margin-bottom:4px;' /></a></div>",
				"<div class='aboutLogos'>",
					"<div><a href='http://www.fws.gov'><img src='./content/images/logos/LogoUSFWS-sm.jpg' /></a></div>",
					"<div><a href='http://www.wdfw.wa.gov'><img src='./content/images/logos/LogoWADFW-sm.jpg' /></a></div>",
					"<div><a href='http://www.parks.wa.gov'><img src='./content/images/logos/WSPLogo_200.png' /></a></div>",
					"<div class='padout'><a href='http://www.geoengineers.com/smartmine'><img src='./content/images/smartmine-logo.png' /></a></div>",
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
		"Total Area (Acres): {{TotalArea}}<br />",
		"Acquisition Date: <span style=\" color: #FFFF00\">{{AquisitionDate}}</span><br />",
		"Cost: <span style=\" color: #FFFF00\">{{Cost}}</span><br /><br/>",
		"<button class=\"btn btn-primary\" type=\"button\" id=\"btnQuestionPost\">Post a Question</button>",	
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
	"<h4>WASHINGTON PUBLIC LANDS INVENTORY</h4>",
].join("\n");
