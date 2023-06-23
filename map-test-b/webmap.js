// import { pointsGJ } from './points.js'

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

const data ={
    flower1: {
        coords: [53.38207, -6.60404],
        title: "<b>Flower 1</b>"
    },
    flower2: {
        coords: [53.38146, -6.59769],
        title: "<b>Flower 2</b>"
    },
    flower3: {
        coords: [53.38105, -6.59622],
        title: "<b>Flower 3</b>"
    }
}

// Add the data to the map
Object.keys(data).forEach(key => {
    L.marker(data[key].coords).addTo(map)
       .bindPopup(data[key].title)
});
// L.geoJSON(pointsGJ,{
//     onEachFeature: function(feature, layer){
//         layer.bindPopup(feature.properties.name)
//     }
// }).addTo(map);

var latlngs = [
    [53.38207, -6.60404],
    [53.38146, -6.59769],
    [53.38105, -6.59622],
    [53.38123, -6.59576],
    [53.38207, -6.60404]
]

// Add the data to the map
lines = L.polyline(latlngs, {color: 'blue'}).addTo(map);