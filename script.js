
var map;
var c = 3;

var locations = {
    "Stanley Park": {
        "latitude": 49.301705,
        "longitude": -123.141700
    },
    "Granville Island": {
        "latitude": 49.271414,
        "longitude": -123.133696
    },
    "Vancouver Aquarium": {
        "latitude": 49.300751,
        "longitude": -123.130715
    },
    "Canada Place": {
        "latitude": 49.288844,
        "longitude": -123.111208
    },
    "Capilano Suspension Bridge": {
        "latitude": 49.342081,
        "longitude": -123.114853
    },
    "Science World": {
        "latitude": 49.273040,
        "longitude": -123.103365
    },
    "Gastown": {
        "latitude": 49.282802,
        "longitude": -123.106596
    },
    "Robson Street": {
        "latitude": 49.283007,
        "longitude": -123.121648
    },
    "Queen Elizabeth Park": {
        "latitude": 49.241527,
        "longitude": -123.112892
    },
    "VanDusen Botanical Garden": {
        "latitude": 49.238340,
        "longitude": -123.128373
    },
    "Surrey Central City": {
        "latitude": 49.187500,
        "longitude": -122.849670
    },
    "Crescent Beach": {
        "latitude": 49.022129,
        "longitude": -122.874550
    },
    "Bear Creek Park": {
        "latitude": 49.129146,
        "longitude": -122.843228
    },
    "Surrey Arts Centre": {
        "latitude": 49.105594,
        "longitude": -122.803470
    },
    "Fraser Downs Racetrack & Casino": {
        "latitude": 49.107073,
        "longitude": -122.800828
    },
    "Historic Stewart Farm": {
        "latitude": 49.063913,
        "longitude": -122.815242
    },
    "Guildford Town Centre": {
        "latitude": 49.188904,
        "longitude": -122.803179
    },
    "Holland Park": {
        "latitude": 49.103269,
        "longitude": -122.799845
    },
    "Green Timbers Urban Forest": {
        "latitude": 49.167473,
        "longitude": -122.806649
    },
    "Serpentine Fen Nature Reserve": {
        "latitude": 49.073852,
        "longitude": -122.834930
    },
    "Burnaby Village Museum": {
        "latitude": 49.238978,
        "longitude": -122.959775
    },
    "Metropolis at Metrotown": {
        "latitude": 49.226253,
        "longitude": -123.001826
    },
    "Burnaby Mountain Park": {
        "latitude": 49.279932,
        "longitude": -122.908524
    },
    "Deer Lake Park": {
        "latitude": 49.241153,
        "longitude": -122.970693
    },
    "Burnaby Lake Regional Nature Park": {
        "latitude": 49.244786,
        "longitude": -122.954770
    },
    "Simon Fraser University": {
        "latitude": 49.277637,
        "longitude": -122.917084
    },
    "Central Park": {
        "latitude": 49.225964,
        "longitude": -123.008263
    },
    "Shadbolt Centre for the Arts": {
        "latitude": 49.248449,
        "longitude": -122.981670
    },
    "British Columbia Institute of Technology (BCIT)": {
        "latitude": 49.251136,
        "longitude": -123.003694
    },
    "Burnaby Art Gallery": {
        "latitude": 49.254063,
        "longitude": -123.004074
    }
};

var pointers = [
    "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
    "https://maps.google.com/mapfiles/ms/icons/green-dot.png",
    "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
    "https://maps.google.com/mapfiles/ms/icons/yellow-dot.png",
    "https://maps.google.com/mapfiles/ms/icons/purple-dot.png"
]

addDropdown = () => {
    var cont = document.getElementById('dropdown-container');

    var label = document.createElement('label');
    label.setAttribute('for', 'location' + c);
    label.textContent = 'Location ' + c + ':';
    cont.appendChild(label);

    var select = document.createElement('select');
    select.classList.add('location-dropdown', 'form-control');
    select.id = 'location' + c;
    cont.appendChild(select);

    addOptions(locations, select.id, c);

    c++;
}

addOptions = (data, dropdownId, v) => {
    var options = document.getElementById(dropdownId);
    for (var key in data) {
        var option = document.createElement("option");
        option.value = JSON.stringify(data[key]);
        option.text = key;
        options.appendChild(option);
    }
    document.getElementById('location' + v).addEventListener('change', updateMap);
}

updateMap = () => {

    var loc_list = [];

    var i = 1;
    while (i < c) {
        console.log(i);
        console.log('location' + i);
        loc_list.push(JSON.parse(document.getElementById('location' + i).value));
        i++;
    }

    map.getLayers().forEach(function (layer) {
        if (layer.get('name') === 'markerLayer') {
            map.removeLayer(layer);
        }
    });

    var markerLayer = new ol.layer.Vector({
        name: 'markerLayer',
        source: new ol.source.Vector(),
        style: function (feature) {
            return new ol.style.Style({
                image: new ol.style.Icon({
                    src: pointers[(Math.floor(Math.random() * pointers.length))]
                })
            });
        }
    });

    var locsM = loc_list;
    locsM.forEach(function (location) {
        var marker = new ol.Feature({
            geometry: new ol.geom.Point(ol.proj.fromLonLat([location.longitude, location.latitude]))
        });
        markerLayer.getSource().addFeature(marker);
    });

    map.addLayer(markerLayer);

    var extent = markerLayer.getSource().getExtent();
    map.getView().fit(extent, {
        padding: [50, 50, 50, 50]
    });
}

load = () => {
    map = new ol.Map({
        target: 'map',
        layers: [
            new ol.layer.Tile({
                source: new ol.source.OSM()
            })
        ],
        view: new ol.View({
            center: ol.proj.fromLonLat([-123.116226, 49.246292]),
            zoom: 10
        })
    });

    var addButton = document.getElementById('add-dropdown-button');
    addButton.addEventListener('click', addDropdown);
}

addOptions(locations, 'location1', 1);
addOptions(locations, 'location2', 2);

document.addEventListener('DOMContentLoaded', load);
