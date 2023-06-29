// import GeoJsons
var urlPoints = '/data/points.geojson';
var urlLines = '/data/lines.geojson';
var urlArea = '/data/area.geojson';

// Initialize leaflet.js
var L = require('leaflet');

// Initialize the map
var map = L.map('map', {
    scrollWheelZoom: false
});

// Set the position and zoom level of the map
map.setView([53.3822, -6.5982], 15.7);

// Initialize the base layer
var osm_mapnik = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibmF6YXIta2hva2hsYSIsImEiOiJjbGoyc3IzNnkxYmZwM2t0ODRtamc0d3czIn0.3zs047MsmCySXuYpEeuJ0Q', {
    maxZoom: 19,
    attribution: '&copy; OSM Mapnik <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    id: 'mapbox/outdoors-v12',
    tileSize: 512,
    zoomOffset: -1
}).addTo(map);
//add points from GeoJson
var points =L.geoJSON(null,{
    onEachFeature: function(feature, layer){
        layer.bindPopup(`
        <div>
        
          <h1>${feature.properties.Site_Name}\n</h1>\n
          <p>${feature.properties.Management}</p>
          <div style="line-height:0.2">
          <h4>Species Counts</h4>
          <h5 style="font-weight: normal">
          <p>Vascular plants:  26</p>
          <p> Invertebrates:  38​</p>
          <p> Trees:  11</p> 
          ​</h5>
          <h4>Some nice finds</h4>
          <img src="images/bumblebee.jpg"/
          height=100px,
          width=150px>
          </div>
        </div>
      `)
        // console.log(feature.properties.name)
    }
});

$.getJSON(urlPoints, function(data) {
    points.addData(data);
});


//add lines from GeoJson

var lines =L.geoJSON(null);

$.getJSON(urlLines, function(data) {
    lines.addData(data);
});

//add area 
var area =L.geoJSON(null);

$.getJSON(urlArea, function(data) {
    area.addData(data);
});

//add layers 
var baseMaps = {
    "OpenStreetMap": osm_mapnik
};

var overlayMaps = {
    "Points": points,
    "Lines": lines,
    "Area": area
};

L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
}).addTo(map);