
var fs = require("fs");
var data = [];

//example console call "node generatejson.js counties"

var targetType = 'statewide'; // Change this to update the specific sums json file

var targetData = [
{
	name: 'congressional',
	csvTarget: './sums_cong_uw.csv',
	fileName: 'sums_congressional_districts.json',
	variableName: 'sums_congressional_districts'
},
{
	name: 'counties',
	csvTarget: './sums_county_uw.csv',
	fileName: 'sums_counties.json',
	variableName: 'sums_counties'
},
{
	name: 'legislative',
	csvTarget: './sums_leg_uw.csv',
	fileName: 'sums_legdistricts.json',
	variableName: 'sums_legdistricts'
},
{
	name: 'wrias',
	csvTarget: './sums_wria_uw.csv',
	fileName: 'sums_wrias.json',
	variableName: 'sums_wria'
},
{
	name: 'statewide',
	csvTarget: './sums_state_uw.csv',
	fileName: 'sums_statewide.json',
	variableName: 'sums_statewide'
}
];

var filesLocation = '../../../appClient/src/extensions/';
var csvTarget = ''
var fileName = ''
var variableName = '';


function generateJson(){

	//get the type
	process.argv.forEach(function (val, index, array) {
  		targetType = val;
	});

	//Get Settings for the files
	for(var i=0; i < targetData.length; i++)
	{
		if(targetData[i].name === targetType)
		{
			csvTarget = targetData[i].csvTarget;
			fileName = targetData[i].fileName;
			variableName = targetData[i].variableName;
		}

	}
	console.log(csvTarget);
	fs.readFile(csvTarget, 'utf8', function (err,dataset) {
	  	if (err) {
	    	console.log(err);
	  	}
	  	data = dataset;
	  	var remaining = '';
	  	remaining += data;
		var index = remaining.indexOf('\n');
		var count = 0;
		var rowcount;
	  	
	  	
	  	var values = [];
		while (index > -1) {
	      var line = remaining.substring(0, index);
	      remaining = remaining.substring(index + 1);
	      index = remaining.indexOf('\n');
	      if(count > 0)
	      {
	      	var splitData = line.split(',');
	      	var value = {};
	      	if(targetType !== 'statewide')
	      	{
	      		value = {"acres": parseFloat(splitData[0]), "acquisitioncost": 0,"name": splitData[1].replace('\r', '').replace('"', '').replace('"', ''), "agency": splitData[2].replace('\r', '').replace('"', '').replace('"', '')};
	      	}
	      	else
	      	{
	      		value = {"acres": parseFloat(splitData[0]), "acquisitioncost": 0, "agency": splitData[2].replace('\r', '').replace('"', '').replace('"', '')};
	      	}
	      	values.push(value);
	  	  }
	  	  else
	  	  {
	  	  	 rowcount = parseFloat(line.replace('\r', ''));
	  	  }
	      count++;
	    }

	    var newJson = "var " + variableName + "= " + JSON.stringify(values) + ";";
	    //console.log(newJson);

	    fs.writeFile(filesLocation + fileName, newJson, function(err) {
	    		if(err) {
	        		console.log(err);
	    		} else {
	        		console.log("Updated: " + fileName);
	    		}
		}); 
	});


}

generateJson();

