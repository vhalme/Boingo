var mouse = {
	
	x: 0,
	y: 0
	
}, INTERSECTED;

var growTarget = false;
var targetRadius = 1;

var sim = false;
var simAngleFrames = 1000;
var simSpeedFrames = 1000;

var vehDir = 0, trackDir = 0;
var vehAngle = Math.PI / 2, trackAngle = 0;

var vehicle, vehicleMesh, floor, floorMesh, target, targetMesh;

var fwd = 0;
var meterContainer;

var canvasWidth, canvasHeight;

var gpsOn = false;
var lng, lat;

function initGps() {
	
	var watchId = navigator.geolocation.watchPosition(
		
		function(position) {  
			
			lat = position.coords.latitude;
			lng = position.coords.longitude;
			
			alert(position.coords.latitude+"/"+position.coords.longitude);
			// Update coords: position.coords.latitude, position.coords.longitude;
			
		},
		
		function (error) {
		
			switch(error.code) {
			
				case error.TIMEOUT:
					alert ('Timeout');
					break;
				case error.POSITION_UNAVAILABLE:
					alert ('Position unavailable');
					break;
				case error.PERMISSION_DENIED:
					alert ('Permission denied');
					break;
				case error.UNKNOWN_ERROR:
					alert ('Unknown error');
					break;
			}
		},
		
		{ enableHighAccuracy: true }
		
	);

}


var app = app || {};
var ENTER_KEY = 13;

$(function() {
	
	// Kick things off by creating the **App**.
	new app.CanvasView();

});
