var mouse = {
	
	x: 0,
	y: 0
	
}, INTERSECTED;

var growTarget = false;
var targetRadius = 1;

var container, stats;

var sim = false;
var simAngleFrames = 1000;
var simSpeedFrames = 1000;

var camera, scene, renderer, projector;
var camZDelta = 0;
var camXDelta = 0;
var vehDir = 0, trackDir = 0;
var vehAngle = Math.PI / 2, trackAngle = 0;

var vehicle, vehicleMesh, floor, floorMesh, target, targetMesh;

var targetRotation = 0;
var targetRotationOnMouseDown = 0;

var mouseX = 0;
var mouseXOnMouseDown = 0;

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

var info;

var fwd = 0;
var meterContainer;

//var viewMode = 0;

var canvasWidth, canvasHeight;

var targetGeometry;

var ctx;




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
	
	alert("create app");
	// Kick things off by creating the **App**.
	new app.AppView();

});
