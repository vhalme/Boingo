var app = app || {};

(function() {
	
	'use strict';

	app.SceneObject = Backbone.Model.extend({
	
		mesh: undefined,
	
		geometry: undefined,
	
		material: undefined,
	
		rotate: function(x, y, z) {
		
			var mesh = this.get('mesh');
			mesh.rotation.set(x, y, z);
		
		},
	
	
		position: function(x, y, z) {
		
			var mesh = this.get('mesh');
		
			mesh.position.set(x, y, z);
		
		},
	
	
		scale: function(x, y, z) {
		
			var mesh = this.get('mesh');
		
			mesh.scale.set(x, y, z);
		
		}
	
	
	});


	app.Floor = app.SceneObject.extend({
	
		initialize: function() {
		
			var planeTesselated = new THREE.PlaneGeometry(1200, 360, 12, 3);
	
			var matWire = new THREE.MeshBasicMaterial({
				color : 0x110000,
				wireframe : true,
				wireframeLinewidth : 1
			});
	
			var floorMesh = new THREE.Mesh(planeTesselated, matWire);
		
			this.set('mesh', floorMesh);
			this.set('geometry', planeTesselated);
			this.set('material', matWire);
		
		}
	

	});


	app.Vehicle = app.SceneObject.extend({
	
		initialize: function() {
	
			var vehicleGeometry = new THREE.CubeGeometry(20, 10, 30);

			vehicleGeometry.faces[0].color.setHex(0x888888);
			vehicleGeometry.faces[1].color.setHex(0xacacac);
			vehicleGeometry.faces[2].color.setHex(0xe0e0e0);
			vehicleGeometry.faces[3].color.setHex(0xd3d3d3);
			vehicleGeometry.faces[4].color.setHex(0x777777);
			vehicleGeometry.faces[5].color.setHex(0xa0a0a0);
	
			var vehicleMaterial = new THREE.MeshBasicMaterial({
				vertexColors : THREE.FaceColors
			});

			var vehicleMesh = new THREE.Mesh(vehicleGeometry, vehicleMaterial);
			vehicleMesh.position.set(0, 30, 0);
		
			this.set('mesh', vehicleMesh);
			this.set('geometry', vehicleGeometry);
			this.set('material', vehicleMaterial);
	
		}

	});


	app.Target = app.SceneObject.extend({
	
		initialize: function() {
		
			var targetGeometry = new THREE.TorusGeometry(30, 6, 2, 8, 2 * Math.PI);
	
			targetGeometry.faces[0].color.setHex(0xff0000);
			targetGeometry.faces[1].color.setHex(0xff0000);
			targetGeometry.faces[2].color.setHex(0xff0000);
			targetGeometry.faces[3].color.setHex(0xff0000);
			targetGeometry.faces[4].color.setHex(0xff0000);
			targetGeometry.faces[5].color.setHex(0xff0000);
			targetGeometry.faces[6].color.setHex(0xff0000);
			targetGeometry.faces[7].color.setHex(0xff0000);
			targetGeometry.faces[8].color.setHex(0xff0000);
			targetGeometry.faces[9].color.setHex(0xff0000);
			targetGeometry.faces[10].color.setHex(0xff0000);
			targetGeometry.faces[11].color.setHex(0xff0000);
			targetGeometry.faces[12].color.setHex(0xff0000);
			targetGeometry.faces[13].color.setHex(0xff0000);
			targetGeometry.faces[14].color.setHex(0xff0000);
			targetGeometry.faces[15].color.setHex(0xff0000);
	
			var targetMaterial = new THREE.MeshBasicMaterial({
				vertexColors : THREE.FaceColors
			});

			var targetMesh = new THREE.Mesh(targetGeometry, targetMaterial);
			targetMesh.doubleSided = true;
	
			this.set('mesh', targetMesh);
			this.set('geometry', targetGeometry);
			this.set('material', targetMaterial);
		
		}
	
	});
	
	
}());