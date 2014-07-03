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
			jsonUrl: "./scripts/appClient/src/extensions/congressionaldistricts.geojson",
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
		abbrev: "DNR UPLANDS",
		agency: "Dept. of Natural Resources Uplands",
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
		color: '#FF7F7F',

		z: 10
	},
	{
		abbrev: "DNR AQUATIC",
		agency: "Dept. of Natural Resources Aquatic Lands",
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
		color: '#97DBF2',
		z: 11
	},
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
		color: '#E69800',

		z: 12
	},
	
	{
		abbrev: "PARKS",
		agency: "State Parks",
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
		color: '#E6E600',
		z: 13
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
		color: '#73B273',
		z: 14
	},	
	{
		abbrev: "CITY-COUNTY",
		agency: "City and County",
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
		color: '#FFBEBE',
		z: 15

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
		mapTarget: "smartmine.7xwuq5mi",
		visible: false,
		layerGroupName: "acquisitions",
		layerGroup: null,
		symbol: '#x2190;',
		color: '#E69800',
		z: 16

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
		mapTarget: "smartmine.6hdaq0k9",
		visible: false,
		layerGroupName: "acquisitions",
		layerGroup: null,
		symbol: '#x21f4;',
		color: '#E6E600',
		z: 17
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
		mapTarget: "smartmine.omb9y66r",
		visible: false,
		layerGroupName: "acquisitions",
		layerGroup: null,
		symbol: '#x214a;',
		color: '#FF7F7F',
		z: 18
	},
	{
		abbrev: "REVENUE",
		agency: "Revenue Generation",
		starting_total_acres : 0,
		starting_total_cost: 0,
		starting_total_revenue: 0,
		total_acres : 0,
		total_cost: 0,
		total_revenue: 0,
		mapTarget: "smartmine.sz90y66r",
		visible: false,
		layerGroupName: "landtypes",
		layerGroup: null,
		symbol: '#x2190;',
		color: '#FF7F7F',
		z: 19
	},	
	{
		abbrev: "HABITAT AND PASSIVE RECREATION",
		agency: "Habitat and Passive Recreation",
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
		color: '#97DBF2',
		z: 20
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
		color: '#E6E600',
		z: 21
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
		color: '#38A800',
		z: 22
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
		color: '#A020F0',
		z: 23
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
		mapTarget: "./scripts/appClient/src/extensions/rco_pli_parks_proposed_4326.geojson",
		visible: false,
		layerGroupName: "proposed",
		layerGroup: null,
		symbol: '#x2190;',
		color: '#E6E600',
		z: 24
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
		mapTarget: "./scripts/appClient/src/extensions/rco_pli_dnr_proposed_4326.geojson",
		visible: false,
		layerGroupName: "proposed",
		layerGroup: null,
		symbol: '#x2190;',
		color: '#FF7F7F',
		z: 25
	},
	
		{
		abbrev: "PROPOSED DFW",
		agency: "Proposed DFW Acquisitions",
		starting_total_acres : 0,
		starting_total_cost: 0,
		starting_total_revenue: 0,
		total_acres : 0,
		total_cost: 0,
		total_revenue: 0,
		mapTarget: "./scripts/appClient/src/extensions/rco_pli_dfw_proposed_4326.geojson",
		visible: false,
		layerGroupName: "proposed",
		layerGroup: null,
		symbol: '#x2190;',
		color: '#E69800',
		z: 26
	}



];
