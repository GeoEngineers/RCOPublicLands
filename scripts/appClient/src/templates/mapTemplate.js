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
		"<div id='chartLayer'></div>",
		"<div id='map'></div>",
		//"<div id=\"ToDoContainer\"></div>",
	"</div>"
].join("\n");


MainApplication.Templates.MapNewMarkerTipTemplate = [
    "<div class='unboundNewMarkerMsg'>",
		"<b>{{Description}}</b><br />",
		"Select \"Edit\" to rename or move this item.<br />",
		"<a href='#' class='geoEditTodo'>Edit Todo</a> - ",
		"<a href='#' class='geoDeleteTodo'>Delete Todo</a>",		
	"</div>"
].join("\n");


MainApplication.Templates.MapFooterTemplate = [
	"<div class='navbar navbar-inverse navbar-fixed-bottom'>",
		"<div class='navbar-inner'>",
			"<div class='container'>",
				"<ul class='navbar-nav iconsNav'>",
					"<li id='lnkChart'><a href='#'>&#9776;<div class='txt'>Compare</div></a></li>",
				"</ul>",
				"<ul class='navbar-nav iconsNav' style='float:right;'>",
					"<li class='slide-menu'><a href='#' id='lnkSlideMenu' class='navLink' href='#SummaryPaneSlideOut'><i class='icon-bar-chart icon-large'></i><div class='txt'>Navigation</div></a></li>",
				"</ul>",				
			"</div>",
		"</div>",
	"</div>"
].join("\n");

MainApplication.Templates.MapPaneTemplate = [
	"<ul>",
		"<li><a href='#'>Home</a></li>",
		"<li><a href='#'>The Ballad of El Goodo</a></li>",
		"<li><a href='#'>Thirteen</a></li>",
		"<li><a href='#'>September Gurls</a></li>",
		"<li><a href='#'>What's Going Ahn</a></li>",
	"</ul>"
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
				"<label>Your Name:</label><input type=\"text\" id=\"txtName\" /><br />",
				"<label>Email Address:</label><input type=\"text\" id=\"txtName\" /><br />",
				"<label>Your Question:</label><br />",
				"<textarea id=\"txtQuestion\" />",
			"</div>",
			"<div class=\"modal-footer\">",
				"<button class=\"btn btn-primary\" type=\"button\" id=\"btnCloseQuestion\">Submit</button>",
				"<button class=\"btn btn-warning\" type=\"button\" id=\"btnCancelQuestion\">Cancel</button>",
			"</div>",
		"</div>",
	"</div>",
].join("\n");


