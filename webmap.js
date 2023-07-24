// import 'leaflet-arrowheads';
// import GeoJson
var urlAreas = '/data/areas.geojson';
var urlLines = '/data/lines.geojson';
var urlBumblebee = '/data/bumblebee.geojson';
var urlAreas6 = '/data/map.geojson';
var urlPoints = '/data/stops.geojson';

// Initialize leaflet.js
var L = require('leaflet');
var polylineDecorator = require('leaflet-polylinedecorator');

// Initialize the map
var map = L.map('map');

// Set the position and zoom level of the map
map.setView([53.3822, -6.5982], 15.7);

// Initialize the base layers
var osm_mapnik = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibmF6YXIta2hva2hsYSIsImEiOiJjbGoyc3IzNnkxYmZwM2t0ODRtamc0d3czIn0.3zs047MsmCySXuYpEeuJ0Q', {
  maxZoom: 27,
  attribution: '&copy; OSM Mapnik <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  id: 'mapbox/outdoors-v12',
  tileSize: 512,
  zoomOffset: -1
});

var serviceUrl = 'https://server.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
var credits = 'Tiles &copy; Esri &mdash; Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan, METI, Esri China (Hong Kong), Esri (Thailand), TomTom, 2012 etc. etc. etc.';
var arc = L.tileLayer(serviceUrl, { maxZoom: 27, attribution: credits }).addTo(map);
map.locate({setView: true, maxZoom: 19});
function onLocationFound(e) {
  var radius = e.accuracy;

  L.marker(e.latlng).addTo(map)
      .bindPopup("You are within " + radius + " meters from this point").openPopup();

  L.circle(e.latlng, radius).addTo(map);
}

map.on('locationfound', onLocationFound);

function onLocationError(e) {
  alert(e.message);
}

map.on('locationerror', onLocationError);
//add points from GeoJson and create popups
var areas = L.geoJSON(null);
$.getJSON(urlAreas, function (data) {
  areas.addData(data);
});






var stopsOverlays = L.layerGroup();
var routeOverlays = L.layerGroup();



var myStyleAreas6 = { // Define your style object
  "color": "#00FFFF"
};
var areas6 = L.geoJSON(null, {
  style: myStyleAreas6
}).addTo(stopsOverlays);
var marker = L.marker([53.3827, -6.6007], { title: "START HERE" }).addTo(routeOverlays);

$.getJSON(urlAreas6, function (data) {
  areas6.addData(data);
 
  // marker.bindPopup("<b>Hello world!</b><br>I am a popup.");
  // marker.on('mouseover',function() {
  //   marker.openPopup();
  // });

  // Get the URL parameter for the popup
  const urlParams = new URLSearchParams(window.location.search);
  const popupParam = urlParams.get('popup');

  // Check if the parameter is present and has a valid value
  if (popupParam === '1') {
    // Open the first popup
    var firstLayer = areas6.getLayers()[0];
    if (firstLayer) {
      firstLayer.openPopup();
    }
  }
});



var myStyleLines = { // Define your style object
  "color": "#ff0000"
};
var lines = L.geoJSON(null, {
  style: myStyleLines
}).addTo(routeOverlays);

$.getJSON(urlLines, function (data) {
  lines.addData(data);
  var line =lines.getLayers()[0];
  L.polylineDecorator(line, {
    patterns: [
        {offset: 25, repeat: 50, symbol: L.Symbol.arrowHead({pixelSize: 7, polygon: false, pathOptions: {stroke: true, color: 'red', weight: 5}})}
          ]
}).addTo(routeOverlays);
});


var myStyleBumblebee = {
  "color": "#ffff00"
};
var bumblebee = L.geoJSON(null, {
  style: myStyleBumblebee
});

$.getJSON(urlBumblebee, function (data) {
  bumblebee.addData(data);
});
var points = L.geoJSON(null, {
  onEachFeature: function (feature, layer) {
    layer.bindPopup(`
    <h1>${feature.properties.Name}\n</h1>\
      ${feature.properties.Description}
      <div style="display: flex; width:420px !important">
          <a href="images/${feature.properties.ph1}" target="_blank" style="margin-right: 10px;">
              <img class="img-in-popup" src="images/${feature.properties.ph1}" height=140px width=200px>
          </a>
          <a href="images/${feature.properties.ph2}" target="_blank">
              <img class="img-in-popup" src="images/${feature.properties.ph2}" height=140px width=200px>
          </a>
      </div>
      `),
    {
      minWidth: 2000,
      maxHeight: 2000

    }
  }
}).addTo(stopsOverlays);
$.getJSON(urlPoints, function (data) {
  points.addData(data);
});


map.on('popupopen', function (e) {
  $('img.img-in-popup').on('load', function () {
    e.popup.update()
    console.log('image loaded')
  })
  var px = map.project(e.target._popup._latlng); // find the pixel location on the map where the popup anchor is
  px.y -= e.target._popup._container.clientHeight / 2; // find the height of the popup container, divide by 2, subtract from the Y axis of marker location
  map.panTo(map.unproject(px), { animate: true }); // pan to new center
});


// //add layers 
var baseMaps = {
  "Satellite": arc,
  "Outdoors": osm_mapnik
};

var overlayMaps = {
  "Biodiversity areas": stopsOverlays,
  "All areas": areas,
  "North Campus Biodiversity Loop": routeOverlays,
  "North Campus Bumblebee Monitoring Route": bumblebee
};

L.control.layers(baseMaps, overlayMaps, {
  collapsed: false
}).addTo(map);

stopsOverlays.addTo(map);
routeOverlays.addTo(map);