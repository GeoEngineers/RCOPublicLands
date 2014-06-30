BootstrapVars = {} || BootstrapVars;

BootstrapVars.areaInformation = [
	{
		layerGroupName: "agency",
		htmlInfo: "Agency Information goes here...",
		startDate: '2003',
		endDate: '2014'
	},
	{
		layerGroupName: "landtypes",
		htmlInfo: "Land types Information goes here...",
		startDate: '2003',
		endDate: '2014'
	},
	{
		layerGroupName: "acquisitions",
		htmlInfo: "Acquisitions Information goes here...",
		startDate: '2003',
		endDate: '2014'
	},
	{
		layerGroupName: "proposed",
		htmlInfo: "Proposed Information goes here...",
		startDate: '2003',
		endDate: '2014'
	},

];



BootstrapVars.boundaries = [
 {
			Id: 1,
			Name: "Counties",
			NameField: "COUNTY_NM",
			SelectText: "",
			sums: sums_counties,
			jsonUrl: "./scripts/appClient/src/extensions/counties_simplified.geojson",
			json: null,
			jsonLayer: null,
			color: "white"
},
{
			Id: 2,
			Name: "WRIAs",
			NameField: "WRIA_NM",
			SelectText: "",
			sums: sums_wria,
			jsonUrl: "./scripts/appClient/src/extensions/wrias_simplified.geojson",
			json: null,
			jsonLayer: null,
			color: "white"
},
{
			Id: 3,
			Name: "Congressional Districts",
			NameField: "DISTRICT_NR",
			SelectText: "District",
			sums: sums_congressional_districts,
			jsonUrl: "./scripts/appClient/src/extensions/congressionaldistricts_simplified.geojson",
			json: null,
			jsonLayer: null,
			color: "white"
},
{
			Id: 4,
			Name: "Legislative Districts",
			NameField: "DISTRICT_NR",
			SelectText: "District",
			sums: sums_legdistricts,
			jsonUrl: "./scripts/appClient/src/extensions/legislativedistricts_simplified.geojson",
			json: null,
			jsonLayer: null,
			color: "white"
}];


BootstrapVars.areaStats = [
	{
		abbrev: "DFW",
		agency: "Dept. of Fish and Wildlife",
		starting_total_acres : 0,
		starting_total_cost: 0,
		starting_total_revenue: 0,
		total_acres : 0,
		total_cost: 0,
		total_revenue: 0,
		mapTarget: "smartmine.g2oqolxr",
		visible: true,
		layerGroupName: "agency",
		layerGroup: null,
		symbol: '#x2190;',
		color: '#E69800'

	},
	
	{
		abbrev: "PARKS",
		agency: "Washington Parks Dept.",
		starting_total_acres : 0,
		starting_total_cost: 0,
		starting_total_revenue: 0,
		total_acres : 0,
		total_cost: 0,
		total_revenue: 0,
		mapTarget: "smartmine.fwtawcdi",
		visible: true,
		layerGroupName: "agency",
		layerGroup: null,
		symbol: '#x21f4;',
		color: '#E6E600'
	},
	{
		abbrev: "DNR UPLANDS",
		agency: "DNR Uplands",
		starting_total_acres : 0,
		starting_total_cost: 0,
		starting_total_revenue: 0,
		total_acres : 0,
		total_cost: 0,
		total_revenue: 0,
		mapTarget: "smartmine.inr0be29",
		visible: true,
		layerGroupName: "agency",
		layerGroup: null,
		symbol: '#x214a;',
		color: '#FF7F7F'
	},

{
		abbrev: "DNR AQUATIC",
		agency: "DNR Aquatic",
		starting_total_acres : 0,
		starting_total_cost: 0,
		starting_total_revenue: 0,
		total_acres : 0,
		total_cost: 0,
		total_revenue: 0,
		mapTarget: "smartmine.cqj5g66r",
		visible: true,
		layerGroupName: "agency",
		layerGroup: null,
		symbol: '#x214a;',
		color: '#97DBF2'
	},
	{
		abbrev: "FEDERAL",
		agency: "Federal",
		starting_total_acres : 0,
		starting_total_cost: 0,
		starting_total_revenue: 0,
		total_acres : 0,
		total_cost: 0,
		total_revenue: 0,
		mapTarget: "smartmine.e4z8semi",
		visible: true,
		layerGroupName: "agency",
		layerGroup: null,
		symbol: '#x2190;',
		color: '#73B273'
	},	
	{
		abbrev: "CITY-COUNTY",
		agency: "City and County Lands",
		starting_total_acres : 0,
		starting_total_cost: 0,
		starting_total_revenue: 0,
		total_acres : 0,
		total_cost: 0,
		total_revenue: 0,
		mapTarget: "smartmine.q65pzaor",
		visible: true,
		layerGroupName: "agency",
		layerGroup: null,
		symbol: '#x2190;',
		color: '#FFBEBE'

	},
	{
		abbrev: "AQ-DFW",
		agency: "Dept. of Fish and Wildlife",
		starting_total_acres :0,
		starting_total_cost: 0,
		starting_total_revenue: 0,
		total_acres : 0,
		total_cost: 0,
		total_revenue: 0,
		mapTarget: "smartmine.xwobhuxr",
		visible: false,
		layerGroupName: "acquisitions",
		layerGroup: null,
		symbol: '#x2190;',
		color: '#E69800'

	},
	{
		abbrev: "AQ-PARKS",
		agency: "Washington Parks Dept.",
		starting_total_acres : 0,
		starting_total_cost: 0,
		starting_total_revenue: 0,
		total_acres : 0,
		total_cost: 0,
		total_revenue: 0,
		mapTarget: "smartmine.uiduc8fr",
		visible: false,
		layerGroupName: "acquisitions",
		layerGroup: null,
		symbol: '#x21f4;',
		color: '#B4D79E'
	},
	{
		abbrev: "AQ-DNR",
		agency: "Dept. of Natural Resources",
		starting_total_acres : 0,
		starting_total_cost: 0,
		starting_total_revenue: 0,
		total_acres : 0,
		total_cost: 0,
		total_revenue: 0,
		mapTarget: "smartmine.3med0a4i",
		visible: false,
		layerGroupName: "acquisitions",
		layerGroup: null,
		symbol: '#x214a;',
		color: '#FF7F7F'
	},
	{
		abbrev: "REVENUE",
		agency: "Revenue",
		starting_total_acres : 0,
		starting_total_cost: 0,
		starting_total_revenue: 0,
		total_acres : 0,
		total_cost: 0,
		total_revenue: 0,
		mapTarget: "smartmine.imrevcxr",
		visible: false,
		layerGroupName: "landtypes",
		layerGroup: null,
		symbol: '#x2190;',
		color: '#FF7F7F'
	},	
	{
		abbrev: "HABITAT AND PASSIVE RECREATION",
		agency: "Habitat and Passive Habitat",
		starting_total_acres : 0,
		starting_total_cost: 0,
		starting_total_revenue: 0,
		total_acres : 0,
		total_cost: 0,
		total_revenue: 0,
		mapTarget: "smartmine.hlsug14i",
		visible: false,
		layerGroupName: "landtypes",
		layerGroup: null,
		symbol: '#x2190;',
		color: '#B4D79E'
	},	
	{
		abbrev: "DEVELOPED RECREATION",
		agency: "Developed Recreation",
		starting_total_acres : 0,
		starting_total_cost: 0,
		starting_total_revenue: 0,
		total_acres : 0,
		total_cost: 0,
		total_revenue: 0,
		mapTarget: "smartmine.xw0442t9",
		visible: false,
		layerGroupName: "landtypes",
		layerGroup: null,
		symbol: '#x2190;',
		color: '#B2B2B2'
	},	
	{
		abbrev: "CONSERVATION",
		agency: "Conservation",
		starting_total_acres : 0,
		starting_total_cost: 0,
		starting_total_revenue: 0,
		total_acres : 0,
		total_cost: 0,
		total_revenue: 0,
		mapTarget: "smartmine.3kk5ipb9",
		visible: false,
		layerGroupName: "landtypes",
		layerGroup: null,
		symbol: '#x2190;',
		color: '#38A800'
	},
	
		{
		abbrev: "OTHER PUBLIC",
		agency: "Other",
		starting_total_acres : 0,
		starting_total_cost: 0,
		starting_total_revenue: 0,
		total_acres : 0,
		total_cost: 0,
		total_revenue: 0,
		mapTarget: "smartmine.qi5uq5mi",
		visible: false,
		layerGroupName: "landtypes",
		layerGroup: null,
		symbol: '#x2190;',
		color: '#BEFFE8'
	},
	{
		abbrev: "PROPOSED PARKS",
		agency: "Proposed Park Acquisitions",
		starting_total_acres : 0,
		starting_total_cost: 0,
		starting_total_revenue: 0,
		total_acres : 0,
		total_cost: 0,
		total_revenue: 0,
		mapTarget: "smartmine.uovcmcxr",
		visible: false,
		layerGroupName: "proposed",
		layerGroup: null,
		symbol: '#x2190;',
		color: '#E6E600'
	},	
	{
		abbrev: "PROPOSED DNR",
		agency: "Proposed DNR Acquisitions",
		starting_total_acres : 0,
		starting_total_cost: 0,
		starting_total_revenue: 0,
		total_acres : 0,
		total_cost: 0,
		total_revenue: 0,
		mapTarget: "smartmine.3kk5ipb9",
		visible: false,
		layerGroupName: "proposed",
		layerGroup: null,
		symbol: '#x2190;',
		color: '#FF7F7F'
	},
	
		{
		abbrev: "PROPOSED DFW",
		agency: "Proposed DNR Acquisitions",
		starting_total_acres : 0,
		starting_total_cost: 0,
		starting_total_revenue: 0,
		total_acres : 0,
		total_cost: 0,
		total_revenue: 0,
		mapTarget: "smartmine.yhxmkj4i",
		visible: false,
		layerGroupName: "proposed",
		layerGroup: null,
		symbol: '#x2190;',
		color: '#E69800'
	},



];
