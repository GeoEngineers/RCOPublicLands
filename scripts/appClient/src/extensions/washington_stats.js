BootstrapVars = {} || BootstrapVars;

BootstrapVars.areaInformation = [
	{
		layerGroupName: "agency",
		htmlInfo: "Agency Information goes here...",
		startDate: '2003',
		endDate: '2013'
	},
	{
		layerGroupName: "landtypes",
		htmlInfo: "Land types Information goes here...",
		startDate: '2003',
		endDate: '2013'
	},
	{
		layerGroupName: "acquisitions",
		htmlInfo: "Acquisitions Information goes here...",
		startDate: '2003',
		endDate: '2013'
	},
	{
		layerGroupName: "proposed",
		htmlInfo: "Proposed Information goes here...",
		startDate: '2003',
		endDate: '2013'
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
			color: "red"
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
			color: "blue"
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
			color: "green"
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
			color: "orange"
}];


BootstrapVars.areaStats = [
	{
		abbrev: "DFW",
		agency: "Department of Fish and Wildlife",
		starting_total_acres : 0,
		starting_total_cost: 0,
		starting_total_revenue: 0,
		total_acres : 0,
		total_cost: 0,
		total_revenue: 0,
		mapTarget: "smartmine.fwzpk3xr",
		visible: true,
		layerGroupName: "agency",
		layerGroup: null,
		symbol: '#x2190;',
		color: '#E69800'

	},
	{
		abbrev: "PARKS",
		agency: "Washington Parks Department",
		starting_total_acres : 0,
		starting_total_cost: 0,
		starting_total_revenue: 0,
		total_acres : 0,
		total_cost: 0,
		total_revenue: 0,
		mapTarget: "smartmine.m8b5u3di",
		visible: true,
		layerGroupName: "agency",
		layerGroup: null,
		symbol: '#x21f4;',
		color: '#B4D79E'
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
		mapTarget: "smartmine.evp1fw29",
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
		mapTarget: "smartmine.48g58kt9",
		visible: true,
		layerGroupName: "agency",
		layerGroup: null,
		symbol: '#x214a;',
		color: '#97DBF2'
	},
	{
		abbrev: "FEDERAL",
		agency: "federal",
		starting_total_acres : 0,
		starting_total_cost: 0,
		starting_total_revenue: 0,
		total_acres : 0,
		total_cost: 0,
		total_revenue: 0,
		mapTarget: "smartmine.q17qr529",
		visible: true,
		layerGroupName: "agency",
		layerGroup: null,
		symbol: '#x2190;',
		color: '#73B273'
	},	
	{
		abbrev: "AQ-DFW",
		agency: "Department of Fish and Wildlife",
		starting_total_acres :0,
		starting_total_cost: 0,
		starting_total_revenue: 0,
		total_acres : 0,
		total_cost: 0,
		total_revenue: 0,
		mapTarget: "smartmine.1b5wxw29",
		visible: false,
		layerGroupName: "acquisitions",
		layerGroup: null,
		symbol: '#x2190;',
		color: '#E69800'

	},
	{
		abbrev: "AQ-PARKS",
		agency: "Washington Parks Department",
		starting_total_acres : 0,
		starting_total_cost: 0,
		starting_total_revenue: 0,
		total_acres : 0,
		total_cost: 0,
		total_revenue: 0,
		mapTarget: "smartmine.p661dcxr",
		visible: false,
		layerGroupName: "acquisitions",
		layerGroup: null,
		symbol: '#x21f4;',
		color: '#B4D79E'
	},
	{
		abbrev: "AQ-DNR",
		agency: "Department of Natural Resources",
		starting_total_acres : 0,
		starting_total_cost: 0,
		starting_total_revenue: 0,
		total_acres : 0,
		total_cost: 0,
		total_revenue: 0,
		mapTarget: "smartmine.wbvp9zfr",
		visible: false,
		layerGroupName: "acquisitions",
		layerGroup: null,
		symbol: '#x214a;',
		color: '#FF7F7F'
	},
	{
		abbrev: "REVENUE",
		agency: "revenue",
		starting_total_acres : 0,
		starting_total_cost: 0,
		starting_total_revenue: 0,
		total_acres : 0,
		total_cost: 0,
		total_revenue: 0,
		mapTarget: "smartmine.orgdgqfr",
		visible: false,
		layerGroupName: "landtypes",
		layerGroup: null,
		symbol: '#x2190;',
		color: '#FF7F7F'
	},	
	{
		abbrev: "HABITAT AND PASSIVE RECREATION",
		agency: "habitat",
		starting_total_acres : 0,
		starting_total_cost: 0,
		starting_total_revenue: 0,
		total_acres : 0,
		total_cost: 0,
		total_revenue: 0,
		mapTarget: "smartmine.yv1mj9k9",
		visible: false,
		layerGroupName: "landtypes",
		layerGroup: null,
		symbol: '#x2190;',
		color: '#B2B2B2'
	},	
	{
		abbrev: "DEVELOPED RECREATION",
		agency: "recreation",
		starting_total_acres : 0,
		starting_total_cost: 0,
		starting_total_revenue: 0,
		total_acres : 0,
		total_cost: 0,
		total_revenue: 0,
		mapTarget: "smartmine.z2fvquxr",
		visible: false,
		layerGroupName: "landtypes",
		layerGroup: null,
		symbol: '#x2190;',
		color: '#CC00CC'
	},	
	{
		abbrev: "CONSERVATION",
		agency: "conservation",
		starting_total_acres : 0,
		starting_total_cost: 0,
		starting_total_revenue: 0,
		total_acres : 0,
		total_cost: 0,
		total_revenue: 0,
		mapTarget: "smartmine.9cvgf1or",
		visible: false,
		layerGroupName: "landtypes",
		layerGroup: null,
		symbol: '#x2190;',
		color: '#38A800'
	},


];
