var app = app || {};

$(function( $ ) {
	
	'use strict';
	
	app.CanvasView = Backbone.View.extend({
		
		el: '#canvasContainer',
		
		viewMode: 0,
		
		scene: undefined,
		
		camera: undefined,
		
		projector: undefined,
		
		renderer: undefined,
		
		canvasWidth: undefined,
		
		canvasHeight: undefined,
		
		vehicleMesh: undefined,
		
		trackMesh: undefined,
		
		targetMesh: undefined,
		
		
		initialize: function() {
			
			_.bindAll(this, 'animate', 'resizeCanvas');
			
			this.setUpPage();
			
			this.setUpScene();	
			
			this.setUpObjects();
			
			this.setUpControls();
			
			this.animate();
		
		},
		
		setUpPage: function() {
			
			this.canvasWidth = this.$el.width();
			this.canvasHeight = $(document).height() - 70;
			
			var renderer = new THREE.CanvasRenderer();
			renderer.setClearColorHex("0xffffff", 1);
			renderer.setSize(this.canvasWidth, this.canvasHeight);
			this.$el.append(renderer.domElement);
			
			this.renderer = renderer;
			
			var stats = new Stats();
			stats.domElement.style.position = 'absolute';
			stats.domElement.style.top = app.headerView.$el.height()+'px';
			this.$el.append(stats.domElement);
			
			this.stats = stats;
		
		},
		
		setUpObjects: function() {
			
			var track = new app.Floor();
			trackMesh = track.get('mesh');
			trackMesh.rotation.x = -Math.PI / 2;
			
			app.game.track = track;
			this.trackMesh = trackMesh;
			
			this.scene.add(trackMesh);
			
			var vehicle = new app.Vehicle();
			var vehicleMesh = vehicle.get('mesh');
			vehicleMesh.position.set(0, 30, 0);
			
			app.game.vehicle = vehicle;
			this.vehicleMesh = vehicleMesh;
			
			this.scene.add(vehicleMesh);

		},


		setUpScene: function() {
			
			this.camera = new THREE.PerspectiveCamera(25, this.canvasWidth / this.canvasHeight, 1, 10000);
			this.camera.target = new THREE.Vector3(0, 0, 0);
			this.camera.position.set(0, 1000, 0);
			
			this.scene = new THREE.Scene();
			
			this.projector = new THREE.Projector();
			
		},
		
		
		events: {
			
			'mousedown': 'canvasMouseDown',
            'touchstart': 'canvasTouchStart',
            'mouseup': 'canvasMouseUp',
            'touchend': 'canvasMouseUp'
			
		},
		
		
		canvasTouchStart: function(event) {
			
			event.preventDefault();	
			this.canvasMouseDown(event, true);
		
		},
		
		canvasMouseDown: function(event, isTouch) {
			
			event.preventDefault();
			
			var offset = this.$el.offset();
			
			var clientX, clientY;
			
			if(isTouch) {
				clientX = event.originalEvent.touches[0].clientX;
				clientY = event.originalEvent.touches[0].clientY;
			} else {
				clientX = event.clientX;
				clientY = event.clientY;
			}
			
			var mx = clientX - offset.left;
			var my = clientY - offset.top;

			var x = (mx / this.canvasWidth) * 2 - 1;
			var y = -(my / this.canvasHeight) * 2 + 1;
			
			this.clickCanvasAt(x, y);
			
		},
		
		canvasMouseUp: function() {
			
			event.preventDefault();
			
			target.growing = false;
			
		},
		
		
		setUpControls: function() {
			
			window.addEventListener('resize', this.resizeCanvas, false);
			
		},
		
		
		clickCanvasAt: function(x, y) {
			
			var vector = new THREE.Vector3(x, y, 0.5);
			this.projector.unprojectVector(vector, this.camera);

			var ray = 
				new THREE.Ray(this.camera.position, vector.subSelf(this.camera.position).normalize());

			var intersects = ray.intersectObjects(this.scene.children);

			if(intersects.length > 0) {
				
				var target = new app.Target();
				target.growing = true;
				
				var targetMesh = target.get('mesh');
				targetMesh.rotation.x = Math.PI / 2;
				
				targetMesh.position.set(
					intersects[0].point.x,
					intersects[0].point.y, 
					intersects[0].point.z
				);
				
				app.game.target = target;
				this.targetMesh = targetMesh;
				
				this.scene.add(targetMesh);
				
				

			}
			
		},
		
		
		animateTargets: function() {
			
			if(app.game.target && app.game.target.growing) {

				if (app.game.target.scale < 3) {
					app.game.target.grow(0.05);
				} else {
					app.game.target.growing = false;
				}

			}
			
		},


		animate: function() {
			
			requestAnimationFrame(this.animate);
			
			this.render();
			
			this.stats.update();

		},
		
		
		render: function() {
			
			var track = app.game.track;
			var trackMesh = this.trackMesh;
			var vehicle = app.game.vehicle;
			var vehicleMesh = this.vehicleMesh;
			
			app.game.simulateMovement();
			
			this.animateTargets();
			
			var newTrackAngle = track.angle + track.angleDelta;
			
			vehicle.angle += vehicle.angleDelta;

			var dz = -Math.cos(vehicle.angle);
			var dx = -Math.sin(vehicle.angle);

			vehicleMesh.rotation.y = vehicle.angle;

			var vPosX = vehicleMesh.position.x + dx * vehicle.speed;
			var vPosZ = vehicleMesh.position.z + dz * vehicle.speed;

			var vdx1 = vPosX - trackMesh.position.x;
			var vdz1 = vPosZ - trackMesh.position.z;
			var vd1 = (Math.sqrt(vdx1 * vdx1 + vdz1 * vdz1));

			var vdx2 = vPosX - trackMesh.position.x;
			var vdz2 = vPosZ - trackMesh.position.z;
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
			
			var camera = this.camera;
			
			app.headerView.setText('(' + Math.round(vehicleMesh.position.z) + ','
					+ Math.round(vehicleMesh.position.x) + '); ' + '('
					+ Math.round(camera.position.z) + ','
					+ Math.round(camera.position.x) + '); ' + '('
					+ Math.round(trackMesh.position.z) + ',' + Math.round(trackMesh.position.x)
					+ '); ' + '(' + trackSin + ',' + trackCos + ', ' + distTop + '); ');

			if (axisRem < 400) {

				if (distTop < 600) {
					trackMesh.position.x -= trackCos * 100;
					trackMesh.position.z += trackSin * 100;
				} else {
					trackMesh.position.x += trackCos * 100;
					trackMesh.position.z -= trackSin * 100;
				}

			}

			if (axisRem2 < 0) {

				vehicle.speed = 0;
				track.angleDelta = 0;

			} else {

				track.angle = newTrackAngle;
				trackMesh.rotation.z = track.angle;

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

			this.renderer.render(this.scene, camera);

		},
		
		
		resizeCanvas: function() {
			
			var canvasWidth = this.$el.width();
			var canvasHeight = $(document).height() - 70;
			
			this.canvasWidth = canvasWidth;
			this.canvasHeight = canvasHeight;
			
			this.camera.aspect = canvasWidth / canvasHeight;
				
			if (canvasWidth > canvasHeight) {
				this.camera.position.set(0, 60, 0);
				this.viewMode = 1;
			} else {
				this.camera.position.set(0, 1000, 0);
				this.viewMode = 0;
			}

			this.camera.updateProjectionMatrix();

			this.renderer.setSize(canvasWidth, canvasHeight);

			
		}
		
		
	});
	

});