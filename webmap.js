// import 'leaflet-arrowheads';
// import GeoJson
var urlAreas = '/data/areas.geojson';
var urlLines = '/data/lines.geojson';
var urlBumblebee = '/data/bumblebee.geojson';
var urlAreas6 = '/data/map.geojson';
var urlPoints = '/data/stops.geojson';
var urlSouth = '/data/south.geojson';

// Initialize leaflet.js
var L = require('leaflet');
var polylineDecorator = require('leaflet-polylinedecorator');

// Initialize the map
var map = L.map('map', {
  zoomControl: false
});
L.control.zoom({
  position: 'bottomright'
}).addTo(map);

// Set the position and zoom level of the map
map.setView([53.3822, -6.5982], 15.7);

// Initialize the base layers
var osm_mapnik = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibmF6YXIta2hva2hsYSIsImEiOiJjbGoyc3IzNnkxYmZwM2t0ODRtamc0d3czIn0.3zs047MsmCySXuYpEeuJ0Q', {
  maxZoom: 19,
  attribution: '&copy; OSM Mapnik <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  id: 'mapbox/outdoors-v12',
  tileSize: 512,
  zoomOffset: -1
});

var serviceUrl = 'https://server.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
var credits = 'Tiles &copy; Esri &mdash; Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan, METI, Esri China (Hong Kong), Esri (Thailand), TomTom, 2012 etc. etc. etc.';
var arc = L.tileLayer(serviceUrl, { maxZoom: 19, attribution: credits }).addTo(map);


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
  style: myStyleAreas6,
  onEachFeature: function (feature, layer) {
    // leaflet-top elements
    const leafletTopElements = document.querySelectorAll('div.leaflet-top');
    // leaflet-bottom elements
    const leafletBottomElements = document.querySelectorAll('div.leaflet-bottom');
    const name = document.getElementById('map-title');
    layer.on('popupopen', function() {
     name.style.visibility = 'hidden';
   });if (windowArea > 505000 ) {
   layer.on('popupclose', function() {
     name.style.visibility = 'visible';
   });}
    // Pop-up control for small screen sizes
    if (windowArea < 505000 ) {
        // Hide leaflet controls when pop-up opens
        layer.on('popupopen', function() {
            leafletTopElements.forEach(function(element) {
             element.style.visibility = 'hidden';
            });

            leafletBottomElements.forEach(function(element) {
             element.style.visibility = 'hidden';
            });                               
        });            
        // Display Leaflet controls when pop-up closes
        layer.on('popupclose', function() {
            leafletTopElements.forEach(function(element) {
             element.style.visibility = 'visible';
            });
         

            leafletBottomElements.forEach(function(element) {
             element.style.visibility = 'visible';
            });                              
        });
 }
 layer.bindPopup(`
 <h1>${feature.properties.Name}\n</h1>\
   ${feature.properties.Description}
   <div style="display: flex; ${window.innerWidth > 600 ? 'width:420px !important' : ''}">
       <a href="images/${feature.properties.ph1}" target="_blank" style="margin-right: ${window.innerWidth > 600 ? 10 : 3}px;">
           <img class="img-in-popup" src="images/${feature.properties.ph1}" width=${window.innerWidth > 600 ? '200px' : '100%'}>
       </a>
       <a href="images/${feature.properties.ph2}" target="_blank">
           <img class="img-in-popup" src="images/${feature.properties.ph2}" width=${window.innerWidth > 600 ? '200px' : '100%'}>
       </a>
   </div>
`),
   {
     maxWidth: 350,
     maxHeight: 2000

   }
 }
}).addTo(stopsOverlays);
var marker = L.marker([53.3827, -6.6007], { title: "START HERE" }).addTo(routeOverlays);

$.getJSON(urlAreas6, function (data) {
  areas6.addData(data);


 
  // marker.bindPopup("<b>Hello world!</b><br>I am a popup.");
  // marker.on('mouseover',function() {
  //   marker.openPopup();
  // });


});
var south = L.geoJSON(null, {
  style: myStyleAreas6
}).addTo(stopsOverlays);

$.getJSON(urlSouth, function (data) {
  south.addData(data);});



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
        {offset: 25, repeat: 50, symbol: L.Symbol.arrowHead({pixelSize: 7, polygon: false, pathOptions: {stroke: true, color: 'red', weight: 5}, headAngle: 270})}
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
const windowWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
const windowHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
const windowArea = windowWidth * windowHeight;

var points = L.geoJSON(null, {
  onEachFeature: function (feature, layer) {
     // leaflet-top elements
     const leafletTopElements = document.querySelectorAll('div.leaflet-top');
     // leaflet-bottom elements
     const leafletBottomElements = document.querySelectorAll('div.leaflet-bottom');
     const name = document.getElementById('map-title');
     layer.on('popupopen', function() {
      name.style.visibility = 'hidden';
    });if (windowArea > 505000 ) {
    layer.on('popupclose', function() {
      name.style.visibility = 'visible';
    });}
     // Pop-up control for small screen sizes
     if (windowArea < 505000 ) {
         // Hide leaflet controls when pop-up opens
         layer.on('popupopen', function() {
             leafletTopElements.forEach(function(element) {
              element.style.visibility = 'hidden';
             });

             leafletBottomElements.forEach(function(element) {
              element.style.visibility = 'hidden';
             });                               
         });            
         // Display Leaflet controls when pop-up closes
         layer.on('popupclose', function() {
             leafletTopElements.forEach(function(element) {
              element.style.visibility = 'visible';
             });
          

             leafletBottomElements.forEach(function(element) {
              element.style.visibility = 'visible';
             });                              
         });
  }
  layer.bindPopup(`
  <h1>${feature.properties.Name}\n</h1>\
    ${feature.properties.Description}
    <div style="display: flex; ${window.innerWidth > 600 ? 'width:420px !important' : ''}">
        <a href="images/${feature.properties.ph1}" target="_blank" style="margin-right: ${window.innerWidth > 600 ? 10 : 3}px;">
            <img class="img-in-popup" src="images/${feature.properties.ph1}" width=${window.innerWidth > 600 ? '200px' : '100%'}>
        </a>
        <a href="images/${feature.properties.ph2}" target="_blank">
            <img class="img-in-popup" src="images/${feature.properties.ph2}" width=${window.innerWidth > 600 ? '200px' : '100%'}>
        </a>
    </div>
`),
    {
      maxWidth: 350,
      maxHeight: 2000

    }
  }
}).addTo(routeOverlays);
$.getJSON(urlPoints, function (data) {
  points.addData(data);
  areas6.addData(data);
    // Get the URL parameter for the popup
    const urlParams = new URLSearchParams(window.location.search);
    const popupParam = urlParams.get('popup');
  
    // Check if the parameter is present and has a valid value
    if(popupParam && popupParam.length > 0) {
      console.log(popupParam);
      // Get the layer by the popupParam value
      const layer = points.getLayers()[popupParam];
  
      // Check if the layer was found
      if(layer) {
        // Open the popup
        layer.openPopup();
      }
    }
      
});
    

// if(window.innerWidth > 600){

map.on('popupopen', function (e) {
  $('img.img-in-popup').on('load', function () {
    e.popup.update()
    console.log('image loaded')
  })
  var px = map.project(e.target._popup._latlng); // find the pixel location on the map where the popup anchor is
  px.y -= e.target._popup._container.clientHeight / 2; // find the height of the popup container, divide by 2, subtract from the Y axis of marker location
  map.panTo(map.unproject(px), { animate: true }); // pan to new center
});
// }

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
