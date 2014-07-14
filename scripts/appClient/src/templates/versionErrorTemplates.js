MainApplication.Templates = MainApplication.Templates || {};

MainApplication.Templates.VersionErrorTemplate = [
	"<div>",
		"In order to provide a proper viewing experience, this website requires a modern browser.  Please download one of the following in order to view this website.<br /><br />",
		"<div id='browser_select'>",
			"<ul id='browsers'>",
				"<li><a target='_blank' href='http://www.google.com/chrome'>GOOGLE CHROME</a></li>",
				"<li><a target='_blank' href='http://www.mozilla.com/en-US/'>FIREFOX</a></li>",
				"<li><a target='_blank' href='http://www.apple.com/safari/'>SAFARI</a></li>",
				"<li><a target='_blank' href='http://windows.microsoft.com/en-US/internet-explorer/downloads/ie'>INTERNET EXPLORER</a></li>",
				"<li><a target='_blank' href='http://my.opera.com/community/download.pl?p=opera_desktop'>OPERA</a></li>",
			"</ul>",
			"<a href='#Map'>If you feel you've reached this page in error, you may reload the landing page by clicking here</a>",
		"</div>",
	"</div>"
].join("\n");