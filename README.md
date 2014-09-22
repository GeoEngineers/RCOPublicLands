## Washington RCO Public Lands Application

The RCO Public Lands web application is a web application that allows people to click on a location and learn which agency owns the land, the number of acres, the main use of the land and the cost of acquisition if acquired within the past 10 years. Information is provided on land owned by cities, counties, the federal government and three state agencies – the State Parks and Recreation Commission, the Department of Fish and Wildlife and the Department of Natural Resources. The public can search government-owned parcels by owner and principal land use. In addition, details about acquisition grants from RCO are linked to the interactive map.

![RCO Public Lands Application](/content/images/public_lands_application.png)


### Design Goals

* No GIS Server Required (i.e. ArcGIS Server, GeoServer, Mapnik, etc)
* No Database Required
* Easily Deployable
* Fast and Easy to Maintain

### Prerequisites

* [Node.JS](http://nodejs.org/ "Node.JS")
* npm is also required, but should be installed with Node
* Make sure your webserver is configured to support .geojson and .json MIME types.

### Setting Up

* Clone the RCOPublicLands to your local development environment.  NOTE: If you are new to Github you might want to consider using the Github GUI application.

* <p>Use npm to install all of the necessary components via
<code>npm install</code></p>

* <p>Use bower to install necessary javascript libraries
<code>bower install</code></p>

<b> NOTE: </b> If you run into a problem via bower that the bower_components folder could not be created you might have to manually create the bower_components folder.

### Map Tile Setup

Please refer to the wiki for detailed instructions on ![setting up the mbtiles for the application]
