MainApplication.Templates = MainApplication.Templates || {};

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
			//"<div class='btn-group'>",
			//	"<button id='lnkSyncQueueData' class='btn'>Sync Me!</button>",
			//"</div>",			
		"</ul>",
		"<div id='connectionStatus'><img src='./content/images/38-1.gif'><span class='txt'> Re-connecting...</span></div>",
		"<div id='map'></div>",
		//"<div id=\"ToDoContainer\"></div>",
	"</div>"
].join("\n");

MainApplication.Templates.MapFooterTemplate = [
	"<div class='navbar navbar-inverse navbar-fixed-bottom'>",
		"<div class='navbar-inner'>",
			"<div class='container'>",
				"<ul class='navbar-nav iconsNav'>",
					"<li><button href='#' id='lnkToggleBLM' class='navLink btn' data-layerlabel='blm'>BLM</button></li>",
					"<li><button href='#' id='lnkToggleDNR' class='navLink btn' data-layerlabel='dnr'>DNR</button></li>",
					
					//revenue producing, habitat and recreation, recreation, conservation 
				"</ul>",				
				"<ul class='navbar-nav iconsNav' style='float:right;'>",
					"<li class='slide-menu'><a href='#' id='lnkSlideMenu' class='navLink' href='#SummaryPaneSlideOut'><i class='icon-bar-chart icon-large'></i><div class='txt'>Navigation</div></a></li>",
				"</ul>",				
			"</div>",
		"</div>",
	"</div>"
].join("\n");

MainApplication.Templates.MapPaneTemplate = [
	"<div id='chartLayer'></div>",
	"<ul>",
		"<li><a href='#'>Other</a></li>",
		"<li><a href='#'>Test data</a></li>",
		"<li><a href='#'>Presented</a></li>",
		"<li><a href='#'>Presentably</a></li>",
		"<li><a href='#'>And other things!</a></li>",
	"</ul>"
].join("\n");

MainApplication.Templates.MapNewMarkerTipTemplate = [
    "<div class='unboundNewMarkerMsg'>",
		"<b>{{Description}}</b><br />",
		"Select \"Edit\" to rename or move this item.<br />",
		"<a href='#' class='geoEditTodo'>Edit Todo</a> - ",
		"<a href='#' class='geoDeleteTodo'>Delete Todo</a>",		
	"</div>"
].join("\n");

MainApplication.Templates.WelcomeTemplate = [
	"<div class=\"modal-dialog\">",
		"<div class=\"modal-content\">",
			"<div class=\"modal-header\">",
				"<h4 id=\"mySlideLabel\">Welcome to the Public Lands Inventory</h4>",
			"</div>",
			"<div class=\"modal-body\">",
				"Add some text here",
			"</div>",
			"<div class=\"modal-footer\">",
				"<button class=\"btn btn-primary\" type=\"button\" id=\"btnCloseWelcome\">Continue</button>",
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