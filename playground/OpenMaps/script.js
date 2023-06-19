
var map = null;

getMap = () => {

    if(map != null) map.remove();

    document.getElementById('map').value = "";
    var lat = parseFloat(document.getElementById('lat').value);
    var lon = parseFloat(document.getElementById('long').value);

    var defLat = 48.8584; 
    var defLong = 2.2945; 
    var zoom = 16;

    lat = isNaN(lat) ? defLat : lat;
    lon = isNaN(lon) ? defLong : lon;

    var tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    
    map = L.map('map').setView([lat, lon], zoom);

    var point = L.latLng(lat,lon);

    L.tileLayer(tileUrl, {
      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
      maxZoom: 18,
    }).addTo(map);

    L.marker(point).addTo(map)
  }
  