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
	
	app.game = new app.GameModel();
	
	app.appView = new app.AppView();
	app.headerView = new app.HeaderView();
	app.canvasView = new app.CanvasView();
	app.controlsView = new app.ControlsView();

});
