﻿MainApplication.Templates = MainApplication.Templates || {};

MainApplication.Templates.MapTemplate = [
	"<div style='color:#000000;'>",
		"This is the landing page area, you can place any content here.",
		"<ul id='map-buttons'>",
			//"<div class='btn-group'>",
			//	"<button id='lnkOfflineButton' class='btn'>Offline</button>",
			//	"<button id='lnkDefaultButton' class='btn btn-primary'>Default</button>",
			//"</div>",
			//"<div class='btn-group'>",
			//	"<button id='lnkToggleConnection' class='btn btn-primary'>Internet</button>",
			//"</div>",
			"<div class='btn-group'>",
				"<button id='lnkAgency' class='btn btn-primary'>Agency</button>",
				"<button id='lnkLandTypes' class='btn'>Land Types</button>",
			"</div>",			
		"</ul>",
		"<div id='connectionStatus'><img src='./content/images/38-1.gif'><span class='txt'> Re-connecting...</span></div>",
		"<div id='map' style=\"top: 35px\"></div>",
		//"<div id=\"ToDoContainer\"></div>",
	"</div>"
].join("\n");

MainApplication.Templates.MapFooterTemplate = [
	"<div class='navbar navbar-inverse navbar-fixed-bottom'>",
		"<div class='navbar-inner'>",
			"<div class='container'>",
				"<ul class='navbar-nav iconsNav' id='agencyToggles'>",
				"{{#each owners}}",
					"<li style=\"width: 80px\"><a href='#' id='ownerToggle{{owner}}' class='ownerToggle' data-layerlabel='{{owner}}'> <i class=\"icon\">&{{symbol}}</i><div class='txt' style=\"font-size: 10pt\">{{owner}}</div></a></li>",
				"{{/each}}",
				"</ul>",
				"<ul class='navbar-nav iconsNav' id='landUseToggles' style='display:none;'>",
					"<li style=\"width: 100px\"><a href='#' id='ownerToggleRevenueProducing' class='landuseToggle' data-layerlabel=''> <i class=\"icon\">&#x2109;</i><div class='txt' style=\"font-size: 10pt\">REVENUE</div></a></li>",
					"<li style=\"width: 100px\"><a href='#' id='ownerToggleHabitat' class='landuseToggle' data-layerlabel=''> <i class=\"icon\" style=\"margin-left:20px\">&#x21fc;</i><div class='txt' style=\"font-size: 10pt\">HABITAT</div></a></li>",
					"<li style=\"width: 100px\"><a href='#' id='ownerToggleRecreation' class='landuseToggle' data-layerlabel=''> <i class=\"icon\" style=\"margin-left:20px\">&#x21c7;</i><div class='txt' style=\"font-size: 10pt\">RECREATION</div></a></li>",
					"<li style=\"width: 100px\"><a href='#' id='ownerToggleConservation' class='landuseToggle' data-layerlabel=''> <i class=\"icon\" style=\"margin-left:20px\">&#x2150;</i><div class='txt' style=\"font-size: 10pt\">CONSERVATION</div></a></li>",
					"</ul>",					
				"<ul class='navbar-nav iconsNav' style='float:right;'>",
					"<li class='slide-menu'><a href='#' id='lnkSlideMenu' class='navLink' href='#SummaryPaneSlideOut'><i class='icon-bar-chart icon-large'></i><div class='txt'>Summary</div></a></li>",
				"</ul>",				
			"</div>",
		"</div>",
	"</div>"
].join("\n");

MainApplication.Templates.MapPaneTemplate = [
	"<div style=\"padding: 10px\">",
		"<h3>Summary</h3>",		
		"<div id='chartLayer'></div>",
		"<div style=\"text-align: right; width: 100%\"><select id=\"ddlSummaryType\">",
			"<option value=\"total_acres\">Total Acres</option>",
			"<option value=\"total_cost\">Total Cost</option>",
			"<option value=\"total_revenue\">Total Revenue</option>",
		"</select></div><br/>",
		"<div id='summaryLayer'></div>",
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
		"Acquisition Date: {{AquisitionDate}} <br />",
		"Cost: {{Cost}} <br /><br/>",
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
	"<h4>Washington Public Lands Inventory</h4>",
].join("\n");