
var fs = require("fs");
var data = [];
function generateJson(){
    
	fs.readFile('./sums_congressional_districts.csv', 'utf8', function (err,dataset) {
	  	if (err) {
	    	console.log(err);
	    	res.send(err);
	  	}
	  	data = dataset;
	  	var remaining = '';
	  	remaining += data;
		var index = remaining.indexOf('\n');
		var count = 0;
		var rowcount;
	  	
	  	//console.log(data);
	  	console.log("---------------------------------------------------------------------");
	  	console.log("---------------------------------------------------------------------")
	  	console.log("---------------------------------------------------------------------")
	  	console.log("---------------------------------------------------------------------")
	  	console.log("---------------------------------------------------------------------")
	  	console.log("---------------------------------------------------------------------")
	  	var values = [];
		while (index > -1) {
	      var line = remaining.substring(0, index);
	      remaining = remaining.substring(index + 1);
	      index = remaining.indexOf('\n');
	      if(count > 0)
	      {
	      	var splitData = line.split('|');
	      	var value = {"acres": parseFloat(splitData[0]), "acquisitioncost": parseFloat(splitData[1]), "name": splitData[2].replace('"', '').replace('"', ''), "agency": splitData[3].replace('\r', '').replace('"', '').replace('"', '')};
	      	values.push(value);
	  	  }
	  	  else
	  	  {
	  	  	 rowcount = parseFloat(line.replace('\r', ''));
	  	  }
	      count++;
	    }
	    console.log(values);
	});


}

generateJson();
