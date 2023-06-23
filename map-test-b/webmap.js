// import GeoJsons
const {pointsGJ} = require('./points.js');
const {linesGJ} = require('./lines.js');
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
var points =L.geoJSON(pointsGJ,{
    onEachFeature: function(feature, layer){
        layer.bindPopup(feature.properties.name)
        console.log(feature.properties.name)
    }
});

//add lines from GeoJson

var lines =L.geoJSON(linesGJ);

var baseMaps = {
    "OpenStreetMap": osm_mapnik
};

var overlayMaps = {
    "Points": points,
    "Lines": lines
};

L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
}).addTo(map);