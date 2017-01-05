
function LocationViewModel() {
    Config.InUse = true;
    $(".ec").hide();
    var self = this;
    self.Dealer = Config.Dealer;
    SetTitle();
    self.id = "#map_canvas";
    self.name = "Location";

 //   var url = Url(self.name);
    self.search = function () {
    };
    Animate(self.id);

}
function createMarkerForPoint(conce,icon) {
   var marker = new google.maps.Marker({
       position: new google.maps.LatLng(parseFloat(conce.latitude), parseFloat(conce.longitude) ),
       animation: google.maps.Animation.DROP, icon: icon
        //title: conce.name,
   });
   attachSecretMessage(marker);
   return marker;
}
function createBoundsForMarkers(markers) {
    var bounds = new google.maps.LatLngBounds();
    $.each(markers, function () {
        bounds.extend(this.getPosition());
    });
    return bounds;
}
var $mapDiv = $('#map_canvas');

var mapDim = {
    height: $mapDiv.height(),
    width: $mapDiv.width()
}
function getBoundsZoomLevel(bounds, mapDim) {
    var WORLD_DIM = { height: 256, width: 256 };
    var ZOOM_MAX = 21;

    function latRad(lat) {
        var sin = Math.sin(lat * Math.PI / 180);
        var radX2 = Math.log((1 + sin) / (1 - sin)) / 2;
        return Math.max(Math.min(radX2, Math.PI), -Math.PI) / 2;
    }

    function zoom(mapPx, worldPx, fraction) {
        return Math.floor(Math.log(mapPx / worldPx / fraction) / Math.LN2);
    }

    var ne = bounds.getNorthEast();
    var sw = bounds.getSouthWest();

    var latFraction = (latRad(ne.lat()) - latRad(sw.lat())) / Math.PI;

    var lngDiff = ne.lng() - sw.lng();
    var lngFraction = ((lngDiff < 0) ? (lngDiff + 360) : lngDiff) / 360;

    var latZoom = zoom(mapDim.height, WORLD_DIM.height, latFraction);
    var lngZoom = zoom(mapDim.width, WORLD_DIM.width, lngFraction);

    return Math.min(latZoom, lngZoom, ZOOM_MAX);
}



LocationViewModel.prototype = new Base;
ko.applyBindings(new LocationViewModel());
