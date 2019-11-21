var geojson;
var mymap = L.map('mapid').setView([58.7684, -94.1650], 3.5);
var test = {name: "Ontario"};

L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(mymap);

function getColor(d) {
    return d > 20000 ? '#800026' :
           d > 10000  ? '#BD0026' :
           d > 5000  ? '#E31A1C' :
           d > 2500  ? '#FC4E2A' :
           d > 1000   ? '#FD8D3C' :
           d > 100   ? '#FEB24C' :
           d > 10   ? '#FED976' :
                      '#FFEDA0';
}

function style(feature) {
    return {
        fillColor: getColor(feature.properties.density),
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.7
    };
}

var info = L.control();
info.onAdd = function (mymap) {
    this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
    this.update();
    return this._div;
};

// method that we will use to update the control based on feature properties passed
info.update = function (props) {
    this._div.innerHTML = '<h4>Syrian Refugee Population (2015-2019)</h4>' +  (props ?
        '<b>' + props.PRENAME + '</b><br />' + props.density + ' people'
        : 'Hover over a province');
};

info.addTo(mymap);

var legend = L.control({position: 'bottomright'});

legend.onAdd = function (mymap) {
    var div = L.DomUtil.create('div', 'info legend'),
        grades = [0, 10, 100, 1000, 2500, 5000, 10000, 20000],
        labels = [];

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }
    return div;
};

legend.addTo(mymap);


function highlightFeature(e) {
    var layer = e.target;

    layer.setStyle({
        weight: 5,
        color: '#666',
        dashArray: '',
        fillOpacity: 0.7
    });

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
    }

    info.update(layer.feature.properties);

    //testing passing information from leaflet to vega
    updateGraphs(layer.feature.properties.PRENAME);
    //test.name = layer.feature.properties.PRENAME;
}

function resetHighlight(e) {
    geojson.resetStyle(e.target);
    info.update();
}

function zoomToFeature(e) {
    mymap.fitBounds(e.target.getBounds());
}

function onEachFeature(feature, layer) {
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: zoomToFeature
    });
}

geojson = L.geoJson(canadaEdist, {
    style: style,
    onEachFeature: onEachFeature
}).addTo(mymap);
