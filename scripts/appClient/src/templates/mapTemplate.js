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
		"<nav id='menu' class='panel' role='navigation'>",
			"<ul>",
				"<li><a href='#'>Home</a></li>",
				"<li><a href='#'>The Ballad of El Goodo</a></li>",
				"<li><a href='#'>Thirteen</a></li>",
				"<li><a href='#'>September Gurls</a></li>",
				"<li><a href='#'>What's Going Ahn</a></li>",
			"</ul>",
		"</nav>",
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
					"<li id='lnkTodos' class='navLink'><a href='#'><i class='icon-comments icon-large'></i><div class='txt'>Add Todo</div></a></li>",
					"<li id='lnkChart' class='navLink'><a href='#'><i class='icon-bar-chart icon-large'></i><div class='txt'>Compare</div></a></li>",
					"<a href='#menu' class='menu-link'>&#9776;</a>",
					//"<li id='lnkTOC' class='navLink'><a href='#'><i class='icon-filter icon-large'></i><div class='txt'>TOC</div></a></li>",
					//"<li id='lnkLocate' class='navLink'><a href='#'><i class='icon-compass icon-large'></i><div class='txt'>Geo Locate</div></a></li>",
				"</ul>",
			"</div>",
		"</div>",
	"</div>"
].join("\n");