function onWindowResize() {

	canvasWidth = container.width();
	canvasHeight = $(document).height() - 70;

	camera.aspect = canvasWidth / canvasHeight;

	if (canvasWidth > canvasHeight) {
		camera.position.set(0, 60, 0);
		viewMode = 1;
	} else {
		camera.position.set(0, 1000, 0);
		viewMode = 0;
	}

	camera.updateProjectionMatrix();

	renderer.setSize(canvasWidth, canvasHeight);

}


function onMouseUp(event) {

	event.preventDefault();

	mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
	mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

}

function onKeyUp(event) {

	event.preventDefault();

	if (event.keyCode == 38) {

		fwd = 0;

	} else if (event.keyCode == 37) {

		trackDir = 0;

	} else if (event.keyCode == 39) {

		trackDir = 0;

	} else if (event.keyCode == 65) {

		trackDir = 0;

	} else if (event.keyCode == 68) {

		trackDir = 0;

	}

}

function onKeyDown(event) {

	event.preventDefault();

	if (event.keyCode == 38) {

		fwd = 6;

	} else if (event.keyCode == 37) {

		trackDir = 0.02;

	} else if (event.keyCode == 39) {

		trackDir = -0.02;

	} else if (event.keyCode == 65) {

		trackDir = 0.02;

	} else if (event.keyCode == 68) {

		trackDir = -0.02;

	}

}




