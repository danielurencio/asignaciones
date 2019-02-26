import 'ol/ol.css';
import GeoJSON from 'ol/format/GeoJSON';
import OSMXML from 'ol/format/OSMXML.js';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import XYZSource from 'ol/source/XYZ';
import {fromLonLat} from 'ol/proj';
import {Fill, Stroke, Style, Text} from 'ol/style.js';
import {DragBox, Select} from 'ol/interaction.js';


const alpha = 0.3;

const polygonColor = {
  'Extracción':'rgba(9,217,58,'+ alpha +')',//'rgb(1,114,158)',
  'Extracción Temporal':'rgba(0,150,255,'+ alpha +')',
  'Resguardo':'rgba(255,255,255,'+ alpha +')',
  'Exploración':'rgba(67,64,138,'+ alpha +')',
  'Exploración y Extracción':'rgba(217,0,99,'+ alpha +')'
};


global.mapView = new View({
 projection:'EPSG:4326',
 center: [-97.0, 22.97],
 zoom: 6.85
})

const tileLayer = new TileLayer({
  source: new XYZSource({
    //url: 'http://a.tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png'
    url:'https://cartodb-basemaps-a.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png'
  })
});


const vectorLayer = new VectorLayer({
  source: new VectorSource({
    format: new GeoJSON(),
    url: './data/shapes.json'
  }),
  style: function(feature) {

      const style = new Style({
        fill: new Fill({
          color:polygonColor[feature.values_.tipo]
        }),
        stroke: new Stroke({
          color:'rgba(255,255,255,0.5)',
          width:0.5
        })
      });

      return style;
  }
})



global.map = new Map({
  target: 'map-container',
  layers: [
    tileLayer,
    vectorLayer
  ],
  view: mapView
});


map.on('click',function(event) {
  map.forEachFeatureAtPixel(event.pixel,function(feature,layer) {
    mapView.fit(feature.getGeometry().getExtent(),{ duration:1000 })
  })
})


global.source = vectorLayer.getSource();
// source.getFeatures()
global.select = new Select({
  fill: new Fill({
    color:'red'
  })
});






map.addInteraction(select);
var selectedFeatures = select.getFeatures();
