BootstrapVars = {} || BootstrapVars;

BootstrapVars.areaInformation = [
	{
		layerGroupName: "agency",
		htmlInfo: "Agency Information goes here...",
		startDate: '1/1/2004',
		endDate: '1/1/2014'
	},
	{
		layerGroupName: "landtypes",
		htmlInfo: "Land types Information goes here...",
		startDate: '1/1/2004',
		endDate: '1/1/2014'
	},
	{
		layerGroupName: "aquisitions",
		htmlInfo: "Acquisitions Information goes here...",
		startDate: '1/1/2004',
		endDate: '1/1/2014'
	},
	{
		layerGroupName: "proposed",
		htmlInfo: "Proposed Information goes here...",
		startDate: '1/1/2004',
		endDate: '1/1/2014'
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
		starting_total_acres : 995329.78,
		starting_total_cost: 1.00,
		starting_total_revenue: 1.00,
		total_acres : 995329.78,
		total_cost: 1.00,
		total_revenue: 1.00,
		mapTarget: "smartmine.fwzpk3xr",
		visible: true,
		layerGroupName: "agency",
		layerGroup: null,
		symbol: '#x2190;',
		color: '#FFEBCD'

	},
	{
		abbrev: "PARKS",
		agency: "Washington Parks Department",
		starting_total_acres : 397973.62,
		starting_total_cost: 1.00,
		starting_total_revenue: 1.00,
		total_acres : 397973.62,
		total_cost: 1,
		total_revenue: 1,
		mapTarget: "smartmine.zypq4cxr",
		visible: true,
		layerGroupName: "agency",
		layerGroup: null,
		symbol: '#x21f4;',
		color: '#FFCC00'
	},
	{
		abbrev: "DNR",
		agency: "Department of Natural Resources",
		starting_total_acres : 392340.89,
		starting_total_cost: 1.00,
		starting_total_revenue: 1.00,
		total_acres : 392340.89,
		total_cost: 1.00,
		total_revenue: 1.00,
		mapTarget: "smartmine.to36usor",
		visible: true,
		layerGroupName: "agency",
		layerGroup: null,
		symbol: '#x214a;',
		color: '#428BCA'
	},
/*	{
		abbrev: "STATE",
		agency: "State Lands",
		starting_total_acres : 24098.61,
		starting_total_cost: 1.00,
		starting_total_revenue: 1.00,
		total_acres : 24098.61,
		total_cost: 1.00,
		total_revenue: 1.00,
		mapTarget: "smartmine.tzpsnhfr",
		visible: true,
		layerGroupName: "agency",
		layerGroup: null,
		symbol: '#C9F2D0;',
		color: '#FFFF00'
	},
*/  
	{
		abbrev: "FEDERAL",
		agency: "federal",
		starting_total_acres : 15727892.11,
		starting_total_cost: 1.00,
		starting_total_revenue: 1.00,
		total_acres : 15727892.11,
		total_cost: 1.00,
		total_revenue: 1.00,
		mapTarget: "smartmine.r1he61or",
		visible: true,
		layerGroupName: "agency",
		layerGroup: null,
		symbol: '#x2190;',
		color: '#C3FDB8'
	},	
	{
		abbrev: "AQ-DFW",
		agency: "Department of Fish and Wildlife",
		starting_total_acres :1,
		starting_total_cost: 1.00,
		starting_total_revenue: 1.00,
		total_acres : 1,
		total_cost: 1.00,
		total_revenue: 1.00,
		mapTarget: "smartmine.izm5nrk9",
		visible: false,
		layerGroupName: "aquisitions",
		layerGroup: null,
		symbol: '#x2190;',
		color: '#ECC92E'

	},
	{
		abbrev: "AQ-PARKS",
		agency: "Washington Parks Department",
		starting_total_acres : 1,
		starting_total_cost: 1.00,
		starting_total_revenue: 1.00,
		total_acres : 1,
		total_cost: 1,
		total_revenue: 1,
		mapTarget: "smartmine.yyb3ayvi",
		visible: false,
		layerGroupName: "aquisitions",
		layerGroup: null,
		symbol: '#x21f4;',
		color: '#756BB1'
	},
	{
		abbrev: "AQ-RCO",
		agency: "Recreation and Conservation Office",
		starting_total_acres : 1,
		starting_total_cost: 1.00,
		starting_total_revenue: 1.00,
		total_acres : 1,
		total_cost: 1.00,
		total_revenue: 1.00,
		mapTarget: "smartmine.yyb3ayvi",
		visible: false,
		layerGroupName: "aquisitions",
		layerGroup: null,
		symbol: '#x219a;',
		color: '#229900'
	},
	{
		abbrev: "AQ-DNR",
		agency: "Department of Natural Resources",
		starting_total_acres : 1,
		starting_total_cost: 1.00,
		starting_total_revenue: 1.00,
		total_acres : 1,
		total_cost: 1.00,
		total_revenue: 1.00,
		mapTarget: "smartmine.yyb3ayvi",
		visible: false,
		layerGroupName: "aquisitions",
		layerGroup: null,
		symbol: '#x214a;',
		color: '#347235'
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
		mapTarget: "smartmine.izm5nrk9",
		visible: false,
		layerGroupName: "landtypes",
		layerGroup: null,
		symbol: '#x2190;',
		color: '#ECC92E'
	},	
	{
		abbrev: "HABITAT",
		agency: "habitat",
		starting_total_acres : 845671.68,
		starting_total_cost: 1.00,
		starting_total_revenue: 1.00,
		total_acres : 845671.68,
		total_cost: 1.00,
		total_revenue: 1.00,
		mapTarget: "smartmine.u6wxko6r",
		visible: false,
		layerGroupName: "landtypes",
		layerGroup: null,
		symbol: '#x2190;',
		color: '#CC9900'
	},	
	{
		abbrev: "RECREATION",
		agency: "recreation",
		starting_total_acres : 1,
		starting_total_cost: 1.00,
		starting_total_revenue: 1.00,
		total_acres : 183428.78,
		total_cost: 1.00,
		total_revenue: 1.00,
		mapTarget: "smartmine.nxwrvn29",
		visible: false,
		layerGroupName: "landtypes",
		layerGroup: null,
		symbol: '#x2190;',
		color: '#CC00CC'
	},	
	{
		abbrev: "CONSERVATION",
		agency: "conservation",
		starting_total_acres : 1,
		starting_total_cost: 1.00,
		starting_total_revenue: 1.00,
		total_acres : 159789.33,
		total_cost: 1.00,
		total_revenue: 1.00,
		mapTarget: "smartmine.tpwopqfr",
		visible: false,
		layerGroupName: "landtypes",
		layerGroup: null,
		symbol: '#x2190;',
		color: '#00FFFF'
	},
	{
		abbrev: "PROP-RCO",
		agency: "Recreation and Conservation Office",
		starting_total_acres : 1,
		starting_total_cost: 1.00,
		starting_total_revenue: 1.00,
		total_acres : 1,
		total_cost: 1.00,
		total_revenue: 1.00,
		mapTarget: "smartmine.yyb3ayvi",
		visible: false,
		layerGroupName: "proposed",
		layerGroup: null,
		symbol: '#x219a;',
		color: '#229900'
	},	
];
