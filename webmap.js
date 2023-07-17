// import GeoJson
var urlAreas = '/data/areas.geojson';
var urlLines = '/data/lines.geojson';

// Initialize leaflet.js
var L = require('leaflet');

// Initialize the map
var map = L.map('map');

// Set the position and zoom level of the map
map.setView([53.3822, -6.5982], 15.7);

// Initialize the base layers
var osm_mapnik = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibmF6YXIta2hva2hsYSIsImEiOiJjbGoyc3IzNnkxYmZwM2t0ODRtamc0d3czIn0.3zs047MsmCySXuYpEeuJ0Q', {
    maxZoom: 19,
    attribution: '&copy; OSM Mapnik <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    id: 'mapbox/outdoors-v12',
    tileSize: 512,
    zoomOffset: -1
}).addTo(map);

var serviceUrl = 'https://server.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
var credits = 'Tiles &copy; Esri &mdash; Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan, METI, Esri China (Hong Kong), Esri (Thailand), TomTom, 2012 etc. etc. etc.';
var arc= L.tileLayer(serviceUrl, { maxZoom: 19,attribution: credits});
//add points from GeoJson and create popups
var areas =L.geoJSON(null,{
    onEachFeature: function(feature, layer){
        if(feature.properties.More== null){
        layer.bindPopup(`<div>
        
        <h1>${feature.properties.Name}\n</h1>\n
        <div style="line-height:1">
        <h5 style="margin-bottom: 0 !important;font-weight: normal;">
        <p >Mowing plan: ${feature.properties.Mowing}</p>
        <p >Herbicide use: ${feature.properties.Herbicide}</p>
        <p >Notes:  ${feature.properties.Notes}</p> 
        </h5>
        <h4 style="margin: 0 !important;">Some nice finds</h4>
        <a href="images/bumblebee.jpg" target="_blank"><img src="images/bumblebee.jpg"/
        height=100px,
        width=150px>
        </a>
        </div>
      </div>`),
      {
        maxWidth : 2000,
        maxHeight : 2000
        
      }}
      else{
        layer.bindPopup(`<div>
        
        <h1>${feature.properties.Name}\n</h1>\n
        <div style="line-height:1">
        <h5 style="margin-bottom: 0 !important;font-weight: normal;">
        <p >Mowing plan: ${feature.properties.Mowing}</p>
        <p >Herbicide use: ${feature.properties.Herbicide}</p>
        <p >Notes:  ${feature.properties.Notes}</p> 
        <p ><a href="${feature.properties.More}">More info</a></p> 
        </h5>
        <h4 style="margin: 0 !important;">Some nice finds</h4>
        <a href="images/bumblebee.jpg" target="_blank"><img src="images/bumblebee.jpg"/
        height=100px,
        width=150px>
        </a>
        </div>
      </div>`),
      {
        maxWidth : 2000,
        maxHeight : 2000
        
      }}
    }
});
$.getJSON(urlAreas, function(data) {
    areas.addData(data);
});

var myStyle = { // Define your style object
  "color": "#ff0000"
};
var lines =L.geoJSON(null,{
  style: myStyle
});

$.getJSON(urlLines, function(data) {
    lines.addData(data);
});
      
map.on('popupopen', function(e) {
    var px = map.project(e.target._popup._latlng); // find the pixel location on the map where the popup anchor is
    px.y -= e.target._popup._container.clientHeight/2; // find the height of the popup container, divide by 2, subtract from the Y axis of marker location
    map.panTo(map.unproject(px),{animate: true}); // pan to new center
});


// //add layers 
var baseMaps = {
    "Outdoors": osm_mapnik,
    "Satellite": arc
};

var overlayMaps = {
    "Area": areas,
    "Routes": lines
};

L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
}).addTo(map);

areas.addTo(map);
lines.addTo(map);