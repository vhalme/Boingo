var app = app || {};

$(function( $ ) {
	
	'use strict';

	app.AppView = Backbone.View.extend({
		
		el: '#appContainer',
		
		initialize: function() {
			
			this.setUpControls();
			
		},
		
		
		setUpControls: function() {
			
			$(document).bind('keydown', this.keyDown);
			$(document).bind('keyup', this.keyUp);
				
		},
		
		
		keyDown: function(event) {
			
			event.preventDefault();
	
			if(event.keyCode == 38) {

				app.game.moveVehicle(true);

			} else if(event.keyCode == 37 || event.keyCode == 65) {

				app.game.turnTrack('left', true);

			} else if (event.keyCode == 39 || event.keyCode == 68) {

				app.game.turnTrack('right', true);

			} 
			

		},
		
		
        keyUp: function(event) {

			event.preventDefault();
			
			if(event.keyCode == 38) {
				
				app.game.moveVehicle(false);

			} else if(event.keyCode == 37 || event.keyCode == 39 ||
				event.keyCode == 65 || event.keyCode == 68) {

				app.game.turnTrack('left/right', false);

			}
						
		}
		
	});
	
});
