function animateTargets() {
	
	if(growTarget) {

		if (targetRadius < 3) {
			targetRadius += 0.05;
			target.mesh.scale.set(targetRadius, targetRadius, 1);
		}

	}
	
}


function simulateMovement() {
	
	if(sim) {

		if (simAngleFrames == 0) {
			
			vehAngle += (-0.5 + Math.random()) * (Math.PI);
			simAngleFrames = 500 + Math.random() * 500;
			
		} else {
			
			simAngleFrames--;
			
		}

		if (simSpeedFrames > 0) {

			fwd += 0.01;

		} else {

			fwd = Math.random() * 4;
			simSpeedFrames = 500 + Math.random() * 500;

		}

	}
	
}