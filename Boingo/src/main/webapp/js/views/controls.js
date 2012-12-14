var app = app || {};

$(function( $ ) {
	
	'use strict';
	
	app.ControlsView = Backbone.View.extend({
		
		el: '#controlsContainer',
		
		initialize: function() {
			
			//_.bindAll(this, 'animate', 'resizeCanvas');
		
		},
		
		events: {
            
			'mousedown #run': 'runButtonDown',
            'touchstart #run': 'runButtonDown',
            'mouseup #run': 'runButtonUp',
            'touchend #run': 'runButtonUp',
            
            'mousedown #left': 'leftButtonDown',
            'touchstart #left': 'leftButtonDown',
            'mouseup #left': 'leftButtonUp',
            'touchend #left': 'leftButtonUp',
            
            'mousedown #right': 'rightButtonDown',
            'touchstart #right': 'rightButtonDown',
            'mouseup #right': 'rightButtonUp',
            'touchend #right': 'rightButtonUp',
            
            'click #sim': 'simButtonClick',
            
            'click #view': 'viewButtonClick'
        
		},
        
        
        runButtonDown: function(event) {
        	event.preventDefault();
        	app.game.moveVehicle(true);
        },
        
        runButtonUp: function(event) {
        	event.preventDefault();
        	app.game.moveVehicle(false);
        },
        
        leftButtonDown: function(event) {
        	event.preventDefault();
        	app.game.turnTrack("left", true);
        },
        
        leftButtonUp: function(event) {
        	event.preventDefault();
        	app.game.turnTrack("left", false);
        },
        
        rightButtonDown: function(event) {
        	event.preventDefault();
        	app.game.turnTrack("right", true);
        },
        
        rightButtonUp: function(event) {
        	event.preventDefault();
        	app.game.turnTrack("right", false);
        },
        
        simButtonClick: function(event) {
        	
        	event.preventDefault();
			
			app.game.toggleSimulation();
        	
        },
        
        viewButtonClick: function(event) {
        	
        	var view = app.canvasView;
        	
        	if (view.viewMode == 0) {
				view.camera.position.set(0, 60, 0);
				view.viewMode = 1;
			} else if (view.viewMode == 1) {
				view.camera.position.set(0, 1000, 0);
				view.viewMode = 0;
			}
        	
        }
		
		
	});
	

});