var app = app || {};

$(function( $ ) {
	
	'use strict';
	
	app.CanvasView = Backbone.View.extend({
		
		el: '#canvasContainer',
		
		viewMode: 0,
		
		initialize: function() {
			
			_.bindAll(this, 'animate');
			
			this.setUpPage();
			
			this.setUpScene();	
			
			this.setUpObjects();
			
			this.setUpControls();
			
			this.animate();
		
		},
		
		setUpPage: function() {
			
			container = $('#canvasContainer');

			canvasWidth = this.$el.width();
			canvasHeight = $(document).height() - 70;

			meterContainer = $('#meterContainer');
		
			renderer = new THREE.CanvasRenderer();
			renderer.setClearColorHex("0xffffff", 1);
			renderer.setSize(canvasWidth, canvasHeight);

			this.$el.append(renderer.domElement);
		
			stats = new Stats();
			stats.domElement.style.position = 'absolute';
			stats.domElement.style.top = '0px';
			this.$el.append(stats.domElement);
		
		},
		
		setUpObjects: function() {
			
			floor = new app.Floor();
			floorMesh = floor.get('mesh');
			floorMesh.rotation.x = -Math.PI / 2;
			
			scene.add(floorMesh);
			
			vehicle = new app.Vehicle();
			vehicleMesh = vehicle.get('mesh');
			vehicleMesh.position.set(0, 30, 0);
			
			scene.add(vehicleMesh);

		},


		setUpScene: function() {
			
			camera = new THREE.PerspectiveCamera(25, canvasWidth / canvasHeight, 1,
					10000);
			camera.target = new THREE.Vector3(0, 0, 0);
			camera.position.set(0, 1000, 0);

			scene = new THREE.Scene();

			projector = new THREE.Projector();
			
		},
		
		
		setUpControls: function() {
			
			document.addEventListener('keyup', onKeyUp, false);
			document.addEventListener('keydown', onKeyDown, false);
			
			window.addEventListener('resize', onWindowResize, false);
			
			var view = this;
			
			$("#view").bind("touchend", 
					
				function(event) {

					if (view.viewMode == 0) {
						camera.position.set(0, 60, 0);
						view.viewMode = 1;
					} else if (view.viewMode == 1) {
						camera.position.set(0, 1000, 0);
						view.viewMode = 0;
					}

				}
				
			);

			
			$("#view").click(
				
				function(event) {

					if (view.viewMode == 0) {
						camera.position.set(0, 60, 0);
						view.viewMode = 1;
					} else if (view.viewMode == 1) {
						camera.position.set(0, 1000, 0);
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
			
			
			$("#run").mousedown(
				
				function() {
					onKeyDown({ 
						keyCode : 38,
						preventDefault : function() {}
					})
				}
				
			);
			
			
			$("#run").mouseup(
				
				function() {
					onKeyUp({
						keyCode : 38,
						preventDefault : function() {}
					})
				}
				
			);
			

			$("#sim").mouseup(
				
				function() {
					
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
			

			$("#canvasContainer").bind("touchstart",
			
				function(event) {

					event.preventDefault();

					var offset = view.$el.offset();
					
					var clientX = event.originalEvent.touches[0].clientX;
					var clientY = event.originalEvent.touches[0].clientY;

					var mx = clientX - offset.left;
					var my = clientY - offset.top;

					mouse.x = (mx / canvasWidth) * 2 - 1;
					mouse.y = -(my / canvasHeight) * 2 + 1;

					this.clickCanvasAt(mouse.x, mouse.y);

				}
			
			);
			

			$("#canvasContainer").bind("touchend", 
			
				function(event) {

					event.preventDefault();

					growTarget = false;
					targetRadius = 1;

				}
				
			);
				

			$("#canvasContainer").bind("mousedown",
			
				function(event) {

					event.preventDefault();
					
					var offset = view.$el.offset();

					var clientX = event.clientX;
					var clientY = event.clientY;

					var mx = clientX - offset.left;
					var my = clientY - offset.top;

					mouse.x = (mx / canvasWidth) * 2 - 1;
					mouse.y = -(my / canvasHeight) * 2 + 1;
					
					view.clickCanvasAt(mouse.x, mouse.y);
					
					
				}
				
			);
			
			
			$("#canvasContainer").bind("mouseup", 
			
				function(event) {
					growTarget = false;
					targetRadius = 1;
				}
				
			);
			
			
		},
		
		
		clickCanvasAt: function(x, y) {
			
			var vector = new THREE.Vector3(x, y, 0.5);
			projector.unprojectVector(vector, camera);

			var ray = new THREE.Ray(camera.position, vector.subSelf(
			camera.position).normalize());

			var intersects = ray.intersectObjects(scene.children);

			if(intersects.length > 0) {
				
				target = new app.Target();
				targetMesh = target.get('mesh');
				targetMesh.rotation.x = Math.PI / 2;
				
				targetMesh.position.set(
					intersects[0].point.x,
					intersects[0].point.y, 
					intersects[0].point.z
				);
				
				scene.add(targetMesh);
				
				growTarget = true;

			}
			
		},
		
		
		animateTargets: function() {
			
			if(growTarget) {

				if (targetRadius < 3) {
					targetRadius += 0.05;
					targetMesh.scale.set(targetRadius, targetRadius, 1);
				}

			}
			
		},


		simulateMovement: function() {
			
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
			
		},
		
		
		animate: function() {
			
			requestAnimationFrame(this.animate);
			
			this.render();
			
			stats.update();

		},
		
		
		render: function() {
			
			this.simulateMovement();
			
			this.animateTargets();
			
			
			var newTrackAngle = trackAngle + trackDir;
			
			vehAngle += vehDir;

			var dz = -Math.cos(vehAngle);
			var dx = -Math.sin(vehAngle);

			vehicleMesh.rotation.y = vehAngle;

			var vPosX = vehicleMesh.position.x + dx * fwd;
			var vPosZ = vehicleMesh.position.z + dz * fwd;

			var vdx1 = vPosX - floorMesh.position.x;
			var vdz1 = vPosZ - floorMesh.position.z;
			var vd1 = (Math.sqrt(vdx1 * vdx1 + vdz1 * vdz1));

			var vdx2 = vPosX - floorMesh.position.x;
			var vdz2 = vPosZ - floorMesh.position.z;
			var vd2 = (Math.sqrt(vdx2 * vdx2 + vdz2 * vdz2));

			var mTopX = Math.sin(newTrackAngle - Math.PI * (1 / 2)) * 600;
			var mTopZ = Math.cos(newTrackAngle - Math.PI * (1 / 2)) * 600;

			var m2TopX = Math.sin(newTrackAngle) * 180;
			var m2TopZ = Math.cos(newTrackAngle) * 180;

			var dTopX = mTopX - vdx1;
			var dTopZ = mTopZ - vdz1;
			var distTop = Math.sqrt(dTopX * dTopX + dTopZ * dTopZ);

			var mBottomX = Math.sin(newTrackAngle - Math.PI * (3 / 2)) * 600;
			var mBottomZ = Math.cos(newTrackAngle - Math.PI * (3 / 2)) * 600;

			var trackSin = Math.sin(newTrackAngle);
			var trackCos = Math.cos(newTrackAngle);
			
			var vehicleAxisAngle = Math.atan(vdx1 / vdz1);
			var trackAxisAngle = Math.atan(mTopX / mTopZ);

			var dAngle = vehicleAxisAngle - trackAxisAngle;
			var shortAxis = Math.cos(dAngle) * vd1;

			var axisRem = 600 - Math.abs(shortAxis);

			var vehicleAxisAngle2 = Math.atan(vdx2 / vdz2);
			var trackAxisAngle2 = Math.atan(m2TopX / m2TopZ);

			var dAngle2 = vehicleAxisAngle2 - trackAxisAngle2;
			var shortAxis2 = Math.cos(dAngle2) * vd2;

			var axisRem2 = 180 - Math.abs(shortAxis2);

			meterContainer.html('(' + Math.round(vehicleMesh.position.z) + ','
					+ Math.round(vehicleMesh.position.x) + '); ' + '('
					+ Math.round(camera.position.z) + ','
					+ Math.round(camera.position.x) + '); ' + '('
					+ Math.round(floorMesh.position.z) + ',' + Math.round(floorMesh.position.x)
					+ '); ' + '(' + trackSin + ',' + trackCos + ', ' + distTop + '); ');

			if (axisRem < 400) {

				if (distTop < 600) {
					floorMesh.position.x -= trackCos * 100;
					floorMesh.position.z += trackSin * 100;
				} else {
					floorMesh.position.x += trackCos * 100;
					floorMesh.position.z -= trackSin * 100;
				}

			}

			if (axisRem2 < 0) {

				fwd = 0;
				trackDir = 0;

			} else {

				trackAngle = newTrackAngle;
				floorMesh.rotation.z = trackAngle;

				vehicleMesh.position.x = vPosX;
				vehicleMesh.position.z = vPosZ;

				var camPosX, camPosY, camPosZ;

				if (this.viewMode == 0) {
					camPosX = vehicleMesh.position.x + (dx * 150);
					camPosY = 1000;
					camPosZ = vehicleMesh.position.z + (dz * 150);
				} else {
					camPosX = vehicleMesh.position.x - (dx * 150);
					camPosY = 60;
					camPosZ = vehicleMesh.position.z - (dz * 150);
				}

				camera.position.set(camPosX, camPosY, camPosZ);

				if (this.viewMode == 0) {
					camera.target.x = camera.position.x;
					camera.target.z = camera.position.z;
					camera.target.y = vehicleMesh.position.y;
				} else {
					camera.target.x = vehicleMesh.position.x;
					camera.target.z = vehicleMesh.position.z;
					camera.target.y = vehicleMesh.position.y + 10;
				}

				camera.lookAt(camera.target);

			}

			renderer.render(scene, camera);

		}
		
		
	});
	

});