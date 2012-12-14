var app = app || {};

(function() {
	
	'use strict';

	app.GameModel = Backbone.Model.extend({
		
		sim: false,
		
		track: undefined,
		
		vehicle: undefined,
		
		target: undefined,
		
		
		moveVehicle: function(trueOrFalse) {
			
			if(trueOrFalse == true) {
				
				this.vehicle.speed = 6;
				
			} else {
				
				this.vehicle.speed = 0;
				
			}
			
		},


		turnTrack: function(direction, trueOrFalse) {
			
			if(trueOrFalse == false) {
				
				this.track.angleDelta = 0;
			
			} else {
				
				if(direction == 'left') {
				
					this.track.angleDelta = 0.02;
				
				} else if(direction == 'right') {
					
					this.track.angleDelta = -0.02;
				
				}
				
			}
			
		},
		
		
		simulateMovement: function() {
			
			var vehicle = this.vehicle;
			
			if(this.sim) {

				if(this.simAngleFrames == 0) {
					
					vehicle.angle += (-0.5 + Math.random()) * (Math.PI);
					this.simAngleFrames = 500 + Math.random() * 500;
					
				} else {
					
					this.simAngleFrames--;
					
				}

				if(this.simSpeedFrames > 0) {

					vehicle.speed += 0.01;

				} else {

					vehicle.speed = Math.random() * 4;
					this.simSpeedFrames = 500 + Math.random() * 500;

				}

			}
			
		},
		
		toggleSimulation: function() {
			
			if(this.sim == true) {
				
				this.sim = false;
				$("#sim").css('background', "#ffffff");
			
			} else {
				
				this.simAngleFrames = 1000;
				this.simSpeedFrames = 1000;
				
				this.sim = true;
				$("#sim").css('background', "#ff0000");
			
			}
			
		}
	
	
	});
	
	
}());