var app = app || {};

$(function( $ ) {
	
	'use strict';
	
	app.ControlsView = Backbone.View.extend({
		
		el: '#controlsContainer',
		
		initialize: function() {
			
			//_.bindAll(this, 'animate', 'resizeCanvas');
			
			this.setUpControls();
		
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
        	moveVehicle(true);
        },
        
        runButtonUp: function(event) {
        	event.preventDefault();
        	moveVehicle(false);
        },
        
        leftButtonDown: function(event) {
        	event.preventDefault();
        	turnTrack("left", true);
        },
        
        leftButtonUp: function(event) {
        	event.preventDefault();
        	turnTrack("left", false);
        },
        
        rightButtonDown: function(event) {
        	event.preventDefault();
        	turnTrack("right", true);
        },
        
        rightButtonUp: function(event) {
        	event.preventDefault();
        	turnTrack("right", false);
        },
        
        simButtonClick: function(event) {
        	
        	event.preventDefault();
			
			if(sim == true) {
				sim = false;
				$("#sim").css('background', "#ffffff");
			} else {
				sim = true;
				$("#sim").css('background', "#ff0000");
			}
        	
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
        	
        },
        
        
		setUpControls: function() {
			
			document.addEventListener('keyup', onKeyUp, false);
			document.addEventListener('keydown', onKeyDown, false);
			
			/*
			var view = app.canvasView;
			
			$("#view").bind("touchend", 
					
				function(event) {

					if (view.viewMode == 0) {
						view.camera.position.set(0, 60, 0);
						view.viewMode = 1;
					} else if (view.viewMode == 1) {
						view.camera.position.set(0, 1000, 0);
						view.viewMode = 0;
					}

				}
				
			);
			

			$("#run").bind("touchstart", 
			
				function(event) {
					event.keyCode = 38;
					onKeyDown(event);
				}
			
			);
			

			$("#run").bind("touchend", 
			
				function(event) {
					event.keyCode = 38;
					onKeyUp(event);
				}
			
			);

			
			$("#right").bind("touchstart", 
				
				function(event) {
					event.keyCode = 39;
					onKeyDown(event);
				}
				
			);
			
			
			$("#right").bind("touchend", 
			
				function(event) {
					event.keyCode = 39;
					onKeyUp(event);
				}
				
			);

			
			$("#left").bind("touchstart", 
			
				function(event) {
					event.keyCode = 37;
					onKeyDown(event);
				}
			
			);

			
			$("#left").bind("touchend", 
			
				function(event) {
					event.keyCode = 37;
					onKeyUp(event);
				}
			
			);
			
			
			$("#sim").bind("touchend", 
			
				function(event) {

					event.preventDefault();

					if (sim == true) {
						sim = false;
						$(this).css("background", "#ffffff");
					} else {
						sim = true;
						$(this).css("background", "#ff0000");
					}

				}
				
			);
			*/
			
			
		}
		
		
	});
	

});