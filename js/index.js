// list of available 45 maps: http://appleinsider.com/articles/12/09/28/google-maps-adds-new-45-degree-satellite-imagery-to-take-on-apples-flyover

// http://gis.stackexchange.com/questions/33238/how-do-you-get-the-coordinates-from-a-click-or-drag-event-in-the-google-maps-api

var geocoder = new google.maps.Geocoder();

function geocodePosition(pos) {
  geocoder.geocode({
    latLng: pos
  }, function(responses) {
    if (responses && responses.length > 0) {
      updateMarkerAddress(responses[0].formatted_address);
    } else {
      updateMarkerAddress('Cannot determine address at this location.');
    }
  });
}

function updateMarkerStatus(str) {
  document.getElementById('markerStatus').innerHTML = str;
}

function updateMarkerPosition(latLng) {
  /*document.getElementById('info').innerHTML = [
    latLng.lat(),
    latLng.lng()
  ].join(', ');
  /*var point =
    projection.fromLatLngToContainerPixel(latLng);
  document.getElementById('pixel').innerHTML = [
    point.x,
    point.y
  ].join(', ');*/
}

function updateMakerPixelPosition(event) {
  /*  document.getElementById('pixel').innerHTML = [
      event.pixel.x,
      event.pixel.y
    ].join(', ');
    updateLine($('.triangle'), 170, 150, 170 + parseFloat(event.pixel.x), 150 + parseFloat(event.pixel.y));*/
}

function updateMarkerAddress(str) {
  document.getElementById('address').innerHTML = str;
  document.getElementById('address-on-map').innerHTML = str;
}

function initialize() {
  var latLng = new google.maps.LatLng(43.08995, -75.2199);
  var map = new google.maps.Map(document.getElementById('mapCanvas'), {
    zoom: 20,
    center: latLng,
    mapTypeId: google.maps.MapTypeId.SATELLITE
  });
  var marker = new google.maps.Marker({
    position: latLng,
    title: 'Point A',
    map: map,
    draggable: true
  });

  //http://stackoverflow.com/questions/4819373/45-degree-google-map
  map.setTilt(45);
  map.setHeading(90);

  // http://stackoverflow.com/questions/29176753/google-maps-get-click-or-marker-x-y-pixel-coordinates-inside-marker-click-lis
  google.maps.event.addListener(map, 'projection_changed', function() {
    overlay = new google.maps.OverlayView();
    overlay.draw = function() {};
    overlay.setMap(map);

    var info = document.getElementById('on-map-info');

    google.maps.event.addListener(marker, 'click', function(e) {

      var point = overlay.getProjection().fromLatLngToDivPixel(e.latLng);
      var point2 = overlay.getProjection().fromLatLngToContainerPixel(e.latLng);

      document.getElementById('info').innerHTML = e.latLng.toUrlValue(6);
      document.getElementById('tile-offset').innerHTML = point.x + "," + point.y;
      document.getElementById('map-offset').innerHTML = point2.x + "," + point2.y;

      info.style.left = (point2.x - 80) + 'px';
      info.style.top = (point2.y + 40) + 'px';
      info.style.display = 'block';

      //updateLine($('.triangle'), 130, 150, parseFloat(point2.x + 20), parseFloat(point2.y) + 150);
    });

    google.maps.event.addListener(map, 'center_changed', function(e) {
      var point = overlay.getProjection().fromLatLngToDivPixel(marker.getPosition());
      var point2 = overlay.getProjection().fromLatLngToContainerPixel(marker.getPosition());

      document.getElementById('info').innerHTML = marker.getPosition().toUrlValue(6);
      document.getElementById('tile-offset').innerHTML = point.x + "," + point.y;
      document.getElementById('map-offset').innerHTML = point2.x + "," + point2.y;

      info.style.left = (point2.x - 80) + 'px';
      info.style.top = (point2.y + 40) + 'px';
      info.style.display = 'block';
      
      var point3 = overlay.getProjection().fromLatLngToContainerPixel(latLng);

      updateLine($('.triangle'), 130, 150, parseFloat(point3.x + 20), parseFloat(point3.y) + 200);
    });

    google.maps.event.addListener(marker, 'drag', function(e) {
      var point = overlay.getProjection().fromLatLngToDivPixel(marker.getPosition());
      var point2 = overlay.getProjection().fromLatLngToContainerPixel(marker.getPosition());

      document.getElementById('info').innerHTML = marker.getPosition().toUrlValue(6);
      document.getElementById('tile-offset').innerHTML = point.x + "," + point.y;
      document.getElementById('map-offset').innerHTML = point2.x + "," + point2.y;

      info.style.left = (point2.x - 80) + 'px';
      info.style.top = (point2.y + 40) + 'px';
      info.style.display = 'block';

      //updateLine($('.triangle'), 130, 150, parseFloat(point2.x), parseFloat(point2.y) + 200);
    });

    google.maps.event.addListener(marker, 'dragend', function() {
      updateMarkerStatus('Drag ended');
      geocodePosition(marker.getPosition());

      var point = overlay.getProjection().fromLatLngToDivPixel(marker.getPosition());
      var point2 = overlay.getProjection().fromLatLngToContainerPixel(marker.getPosition());

      document.getElementById('info').innerHTML = marker.getPosition().toUrlValue(6);
      document.getElementById('tile-offset').innerHTML = point.x + "," + point.y;
      document.getElementById('map-offset').innerHTML = point2.x + "," + point2.y;

      info.style.left = (point2.x - 80) + 'px';
      info.style.top = (point2.y + 40) + 'px';
      info.style.display = 'block';

      //updateLine($('.triangle'), 130, 150, parseFloat(point2.x + 20), parseFloat(point2.y) + 200);
    });

  });

  /*
  // Update current position info.
  updateMarkerPosition(latLng);
  geocodePosition(latLng);

  // Add dragging event listeners.
  google.maps.event.addListener(marker, 'dragstart', function() {
    updateMarkerAddress('Dragging...');
  });

  google.maps.event.addListener(marker, 'drag', function(event) {
    updateMarkerStatus('Dragging...');
    updateMarkerPosition(marker.getPosition());
    updateMakerPixelPosition(event);
  });

  google.maps.event.addListener(marker, 'dragend', function() {
    updateMarkerStatus('Drag ended');
    geocodePosition(marker.getPosition());
  }); 
  */
  google.maps.event.addListener(map, 'idle', function() {
    console.log('calling map idle')
    geocodePosition(marker.getPosition());

    overlay = new google.maps.OverlayView();
    overlay.draw = function() {};
    overlay.setMap(map);

    var info = document.getElementById('on-map-info');

    var point = overlay.getProjection().fromLatLngToDivPixel(marker.getPosition());
    var point2 = overlay.getProjection().fromLatLngToContainerPixel(marker.getPosition());

    document.getElementById('info').innerHTML = marker.getPosition().toUrlValue(6);
    document.getElementById('tile-offset').innerHTML = point.x + "," + point.y;
    document.getElementById('map-offset').innerHTML = point2.x + "," + point2.y;

    info.style.left = (point2.x - 80) + 'px';
    info.style.top = (point2.y + 40) + 'px';
    info.style.display = 'block';

    var point3 = overlay.getProjection().fromLatLngToContainerPixel(latLng);

    updateLine($('.triangle'), 130, 150, parseFloat(point3.x + 20), parseFloat(point3.y) + 200);
  })

  // http://stackoverflow.com/questions/7168394/google-map-v3-context-menu
  /*var contextMenu = google.maps.event.addListener(
    map,
    "rightclick",
    function(event) {
      // use JS Dom methods to create the menu
      // use event.pixel.x and event.pixel.y 
      // to position menu at mouse position
      /* This assumes your map was created with:

          var map = new google.maps.map( { [map options] } );
          The event object inside the callback has 4 properties

          latLng
          ma
          pixel
          
          where pixel.x and pixel.y are the offset where your click event triggered - 
          counted from the upper left corner of the canvas holding the map object.
      
      console.log(event);
    }
  ); */

}

// Onload handler to fire off the app.
google.maps.event.addDomListener(window, 'load', initialize);

// http://qfox.nl/notes/116

/**
 * @param {google.maps.Map} map
 * @param {google.maps.LatLng} latlng
 * @param {int} z
 * @return {google.maps.Point}
 */
/*
var latlngToPoint = function(map, latlng, z) {
  var normalizedPoint = map.getProjection().fromLatLngToPoint(latlng); // returns x,y normalized to 0~255
  var scale = Math.pow(2, z);
  var pixelCoordinate = new google.maps.Point(normalizedPoint.x * scale, normalizedPoint.y * scale);
  return pixelCoordinate;
}; */
/**
 * @param {google.maps.Map} map
 * @param {google.maps.Point} point
 * @param {int} z
 * @return {google.maps.LatLng}
 */
/*  
var pointToLatlng = function(map, point, z) {
  var scale = Math.pow(2, z);
  var normalizedPoint = new google.maps.Point(point.x / scale, point.y / scale);
  var latlng = map.getProjection().fromPointToLatLng(normalizedPoint);
  return latlng;
};
*/

function updateLine(line, x1, y1, x2, y2) {
  console.log('updateLine called ' + x1 + ',' + y1 + ' and ' + x2 + ',' + y2);
  var length = Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
  var angle = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;
  var transform = 'rotate(' + angle + 'deg)';
  //console.log('rotate(' + angle + ')');

  line
    .css({
      'transform': transform,
      'border-width': '10px 0px 10px ' + (y2 - y1) + 'px'
    });

  return line;
}