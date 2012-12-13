function moveVehicle(trueOrFalse) {
	
	if(trueOrFalse == true) {
		
		vehicle.speed = 6;
		
	} else {
		
		vehicle.speed = 0;
		
	}
	
}


function turnTrack(direction, trueOrFalse) {
	
	if(trueOrFalse == false) {
		
		track.angleDelta = 0;
	
	} else {
		
		if(direction == 'left') {
		
			track.angleDelta = 0.02;
		
		} else if(direction == 'right') {
			
			track.angleDelta = -0.02;
		
		}
		
	}
	
}


function onKeyUp(event) {

	event.preventDefault();

	if (event.keyCode == 38) {

		vehicle.speed = 0;

	} else if (event.keyCode == 37) {

		track.angleDelta = 0;

	} else if (event.keyCode == 39) {

		track.angleDelta = 0;

	} else if (event.keyCode == 65) {

		track.angleDelta = 0;

	} else if (event.keyCode == 68) {

		track.angleDelta = 0;

	}

}

function onKeyDown(event) {

	event.preventDefault();
	
	if (event.keyCode == 38) {

		vehicle.speed = 6;

	} else if (event.keyCode == 37) {

		track.angleDelta = 0.02;

	} else if (event.keyCode == 39) {

		track.angleDelta = -0.02;

	} else if (event.keyCode == 65) {

		track.angleDelta = 0.02;

	} else if (event.keyCode == 68) {

		track.angleDelta = -0.02;

	}

}




