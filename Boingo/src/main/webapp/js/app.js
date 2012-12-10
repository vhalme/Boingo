var gpsOn = false;
var lng, lat;

function initGps() {
	
	var watchId = navigator.geolocation.watchPosition( 
			
		function (position) {  
			
			lat = position.coords.latitude;
			lng = position.coords.longitude;
			
			alert(position.coords.latitude+"/"+position.coords.longitude);
			// Update coords: position.coords.latitude, position.coords.longitude;
			
		},
		
		function (error) {
		
			switch(error.code) 
			{
				case error.TIMEOUT:
					alert ('Timeout');
					break;
				case error.POSITION_UNAVAILABLE:
					alert ('Position unavailable');
					break;
				case error.PERMISSION_DENIED:
					alert ('Permission denied');
					break;
				case error.UNKNOWN_ERROR:
					alert ('Unknown error');
					break;
			}
		},
		
		{ enableHighAccuracy: true }
		
	);

}

var mouse = { x: 0, y: 0 }, INTERSECTED;

var growTarget = false;
var targetRadius = 1;

var container, stats;

	var sim = false;
	var simAngleFrames = 1000;
	var simSpeedFrames = 1000;
	
			var camera, scene, renderer, projector;
			var camZDelta = 0;
			var camXDelta = 0;
			var vehDir = 0, trackDir = 0;
			var vehAngle = Math.PI / 2, trackAngle = 0;

			var vehicle, plane, floor, mark, target;

			var targetRotation = 0;
			var targetRotationOnMouseDown = 0;

			var mouseX = 0;
			var mouseXOnMouseDown = 0;

			var windowHalfX = window.innerWidth / 2;
			var windowHalfY = window.innerHeight / 2;
			
			var info;

			var fwd = 0;
			var meterContainer;
			
			var viewMode = 0;
			
			var canvasWidth, canvasHeight;
			
			var targetGeometry;
			
			var ctx;
			
			init();
			animate();
			
			function init() {
				
				if(gpsOn) {
					initGps();
				}
				
				container = $('#canvasContainer');
				
				canvasWidth = container.width();
				canvasHeight = $(document).height()-70;

				meterContainer = $('#meterContainer');
				
				camera = new THREE.PerspectiveCamera( 25, canvasWidth / canvasHeight, 1, 10000 );
				camera.target = new THREE.Vector3( 0, 0, 0 );
				camera.position.set( 0, 1000, 0 );

				scene = new THREE.Scene();
				
				// Floor
				
				var planeTesselated = new THREE.PlaneGeometry( 1200, 360, 12, 3 );
				var matWire = new THREE.MeshBasicMaterial( { color :0x110000, wireframe: true, wireframeLinewidth: 1 } );

				floor = new THREE.Mesh( planeTesselated, matWire );
				floor.rotation.x = - Math.PI / 2;
				//floor.position.set( 0, 0, 0 );
				scene.add( floor );

				// Vehicle

				var geometry = new THREE.CubeGeometry( 20, 10, 30 );
				
				geometry.faces[0].color.setHex( 0x888888 );
				geometry.faces[1].color.setHex( 0xacacac );
				geometry.faces[2].color.setHex( 0xe0e0e0 );
				geometry.faces[3].color.setHex( 0xd3d3d3 );
				geometry.faces[4].color.setHex( 0x777777 );
				geometry.faces[5].color.setHex( 0xa0a0a0 );
				
				var material = new THREE.MeshBasicMaterial( { vertexColors: THREE.FaceColors } );

				vehicle = new THREE.Mesh( geometry, material );
				vehicle.position.set( 0, 30, 0 );
				scene.add( vehicle );
				
				var targetGeometry = new THREE.TorusGeometry( 30, 6, 2, 8, 2*Math.PI );
				
				targetGeometry.faces[0].color.setHex( 0xff0000 );
				targetGeometry.faces[1].color.setHex( 0xff0000 );
				targetGeometry.faces[2].color.setHex( 0xff0000 );
				targetGeometry.faces[3].color.setHex( 0xff0000 );
				targetGeometry.faces[4].color.setHex( 0xff0000 );
				targetGeometry.faces[5].color.setHex( 0xff0000 );
				targetGeometry.faces[6].color.setHex( 0xff0000 );
				targetGeometry.faces[7].color.setHex( 0xff0000 );
				targetGeometry.faces[8].color.setHex( 0xff0000 );
				targetGeometry.faces[9].color.setHex( 0xff0000 );
				targetGeometry.faces[10].color.setHex( 0xff0000 );
				targetGeometry.faces[11].color.setHex( 0xff0000 );
				targetGeometry.faces[12].color.setHex( 0xff0000 );
				targetGeometry.faces[13].color.setHex( 0xff0000 );
				targetGeometry.faces[14].color.setHex( 0xff0000 );
				targetGeometry.faces[15].color.setHex( 0xff0000 );
				
				var geometry = new THREE.CubeGeometry( 5, 5, 5 );
				
				geometry.faces[0].color.setHex( 0x0000ff );
				geometry.faces[1].color.setHex( 0x0000ff );
				geometry.faces[2].color.setHex( 0x0000ff );
				geometry.faces[3].color.setHex( 0x0000ff );
				geometry.faces[4].color.setHex( 0x0000ff );
				geometry.faces[5].color.setHex( 0x0000ff );
				
				var mark2Material = new THREE.MeshBasicMaterial( { vertexColors: THREE.FaceColors } );

				mark2 = new THREE.Mesh( geometry, mark2Material );
				mark2.position.set( 0, 30, 200 );
				//scene.add( mark2 );

				// Shadow
				
				/*
				var geometry = new THREE.PlaneGeometry( 200, 200 );
				geometry.applyMatrix( new THREE.Matrix4().makeRotationX( - Math.PI / 2 ) );

				var material = new THREE.MeshBasicMaterial( { color: 0xe0e0e0 } );

				plane = new THREE.Mesh( geometry, material );
				scene.add( plane );
				*/
				
				projector = new THREE.Projector();
				
				renderer = new THREE.CanvasRenderer();
				renderer.setClearColorHex("0xffffff", 1);
				renderer.setSize(canvasWidth, canvasHeight);
				
				
				container.append( renderer.domElement );

				stats = new Stats();
				stats.domElement.style.position = 'absolute';
				stats.domElement.style.top = '0px';
				container.append( stats.domElement );
				
				document.addEventListener( 'keyup', onKeyUp, false );
				document.addEventListener( 'keydown', onKeyDown, false );

				//

				window.addEventListener( 'resize', onWindowResize, false );
				
				
				
				
				$("#view").bind("touchend", function(event) {
					
					if(viewMode == 0) {
						camera.position.set(0, 60, 0);
						viewMode = 1;
					} else if(viewMode == 1) {
						camera.position.set(0, 1000, 0);
						viewMode = 0;
					}
					
				});
				
				$("#view").click(function(event) {
					
					if(viewMode == 0) {
						camera.position.set(0, 60, 0);
						viewMode = 1;
					} else if(viewMode == 1) {
						camera.position.set(0, 1000, 0);
						viewMode = 0;
					}
					
				});
				
				$("#run").bind("touchstart", function(event) {
					event.keyCode = 38;
					onKeyDown(event);
				});
				
				$("#run").bind("touchend", function(event) {
					event.keyCode = 38;
					onKeyUp(event);
				});
				
				$("#right").bind("touchstart", function(event) {
					event.keyCode = 39;
					onKeyDown(event);
				});
				
				$("#right").bind("touchend", function(event) {
					event.keyCode = 39;
					onKeyUp(event);
				});
				
				$("#left").bind("touchstart", function(event) {
					event.keyCode = 37;
					onKeyDown(event);
				});
				
				$("#left").bind("touchend", function(event) {
					event.keyCode = 37;
					onKeyUp(event);
				});
				
				$("#run").mousedown(function() {
					onKeyDown({ keyCode: 38, preventDefault: function() {} })
				});
				
				$("#run").mouseup(function() {
					onKeyUp({ keyCode: 38, preventDefault: function() {} })
				});
				
				
				$("#sim").mouseup(function() {
					
					event.preventDefault();
					
					if(sim == true) {
						sim = false;
						$(this).css("background", "#ffffff");
					} else {
						sim = true;
						$(this).css("background", "#ff0000");
					}
					
				});
				
				
				$("#sim").bind("touchend", function(event) {
					
					event.preventDefault();
					
					if(sim == true) {
						sim = false;
						$(this).css("background", "#ffffff");
					} else {
						sim = true;
						$(this).css("background", "#ff0000");
					}
					
				});
				
				
				$("#canvasContainer").bind("touchstart", function(event) {
					
					event.preventDefault();
					
					growTarget = true;
					
					var targetMaterial = new THREE.MeshBasicMaterial( { vertexColors: THREE.FaceColors } );

					target = new THREE.Mesh( targetGeometry, targetMaterial );
					target.doubleSided = true;
					target.rotation.x = Math.PI / 2;
					
					var offset = container.offset();
					
					//alert(event.originalEvent.touches[0].clientX);
					
					//var clientX = event.touches[0] != undefined ? event.touches[0].clientX : event.clientX;
					//var clientY = event.touches[0] != undefined ? event.touches[0].clientY : event.clientY;
					
					var clientX = event.originalEvent.touches[0].clientX; //event.clientX;
					var clientY = event.originalEvent.touches[0].clientY; //event.clientY;
					
					var mx = clientX - offset.left;
					var my = clientY - offset.top;
			    
					mouse.x = ( mx / canvasWidth ) * 2 - 1;
					mouse.y = - ( my / canvasHeight ) * 2 + 1;
				
					var vector = new THREE.Vector3( mouse.x, mouse.y, 0.5 );
					projector.unprojectVector( vector, camera );
				
				
					var ray = new THREE.Ray( camera.position, vector.subSelf( camera.position ).normalize() );
				
					var intersects = ray.intersectObjects( scene.children );

					if ( intersects.length > 0 ) {
					
						target.position.set(intersects[0].point.x, intersects[0].point.y, intersects[0].point.z);
						scene.add(target);
					
					}
					
					
				});
				
				
				$("#canvasContainer").bind("touchend", function(event) {
					
					event.preventDefault();
					
					//canvasMouseUp(event);
					
					growTarget = false;
					targetRadius = 1;
					
					//alert(targetRadius);
					
				});
				
				$("#canvasContainer").bind("mousedown", function(event) {
					
					event.preventDefault();
					
					//canvasMouseDown(event);
					
					growTarget = true;
					
					var targetMaterial = new THREE.MeshBasicMaterial( { vertexColors: THREE.FaceColors } );

					target = new THREE.Mesh( targetGeometry, targetMaterial );
					target.doubleSided = true;
					target.rotation.x = Math.PI / 2;
					
					var offset = container.offset();
			    
					var mx = event.clientX - offset.left;
					var my = event.clientY - offset.top;
			    
					mouse.x = ( mx / canvasWidth ) * 2 - 1;
					mouse.y = - ( my / canvasHeight ) * 2 + 1;
				
					var vector = new THREE.Vector3( mouse.x, mouse.y, 0.5 );
					projector.unprojectVector( vector, camera );
				
				
					var ray = new THREE.Ray( camera.position, vector.subSelf( camera.position ).normalize() );
				
					var intersects = ray.intersectObjects( scene.children );

					if ( intersects.length > 0 ) {
					
						target.position.set(intersects[0].point.x, intersects[0].point.y, intersects[0].point.z);
						scene.add(target);
					
					}
					
					
				});
				
				
				$("#canvasContainer").bind("mouseup", function(event) {
					
					//canvasMouseUp(event);
					
					growTarget = false;
					targetRadius = 1;
					
					//alert(targetRadius);
					
					
				});
				
				
				container.click(function(e) {
					
					//canvasMouseUp(e);
					
					
					var targetMaterial = new THREE.MeshBasicMaterial( { vertexColors: THREE.FaceColors } );

					target = new THREE.Mesh( targetGeometry, targetMaterial );
					target.doubleSided = true;
					target.rotation.x = Math.PI / 2;
					
					var offset = $(this).offset();
				    
					var mx = event.clientX - offset.left;
				    var my = event.clientY - offset.top;
				    
				    mouse.x = ( mx / canvasWidth ) * 2 - 1;
					mouse.y = - ( my / canvasHeight ) * 2 + 1;
					
					alert(mouse.x+"/"+mouse.y);
				    
					var vector = new THREE.Vector3( mouse.x, mouse.y, 0.5 );
					projector.unprojectVector( vector, camera );
					
					var ray = new THREE.Ray( camera.position, vector.subSelf( camera.position ).normalize() );

					var intersects = ray.intersectObjects( scene.children );

					if ( intersects.length > 0 ) {
						
						target.position.set(intersects[0].point.x, intersects[0].point.y, intersects[0].point.z);
						scene.add(target);
						
					}
					
				 
				});
				

			}

			function onWindowResize() {
				
				canvasWidth = container.width();
				canvasHeight = $(document).height()-70;
				
				camera.aspect = canvasWidth / canvasHeight;
				
				if(canvasWidth > canvasHeight) {
					camera.position.set(0, 60, 0);
					viewMode = 1;
				} else {
					camera.position.set(0, 1000, 0);
					viewMode = 0;
				}
				
				camera.updateProjectionMatrix();
				
				renderer.setSize( canvasWidth, canvasHeight );
				
				
			}
			
			/*
			function canvasMouseDown(event) {
				
				growTarget = true;
				
			}
			
			function canvasMouseUp(event) {
				
				growTarget = false;
				
				var targetMaterial = new THREE.MeshBasicMaterial( { vertexColors: THREE.FaceColors } );

				var target = new THREE.Mesh( targetGeometry, targetMaterial );
				target.doubleSided = true;
				target.rotation.x = Math.PI / 2;
				
				var offset = container.offset();
			    
				var mx = event.clientX - offset.left;
			    var my = event.clientY - offset.top;
			    
			    mouse.x = ( mx / canvasWidth ) * 2 - 1;
				mouse.y = - ( my / canvasHeight ) * 2 + 1;
				
				alert(mouse.x+"/"+mouse.y);
				
				var vector = new THREE.Vector3( mouse.x, mouse.y, 0.5 );
				projector.unprojectVector( vector, camera );
				
				
				var ray = new THREE.Ray( camera.position, vector.subSelf( camera.position ).normalize() );
				
				var intersects = ray.intersectObjects( scene.children );

				if ( intersects.length > 0 ) {
					
					target.position.set(intersects[0].point.x, intersects[0].point.y, intersects[0].point.z);
					scene.add(target);
					
				}
				
			}
			*/
			
			function onMouseUp( event ) {

				event.preventDefault();

				mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
				mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

			}

			function onKeyUp(event) {
				
				event.preventDefault();
				
				if(event.keyCode == 38) {
					
					fwd = 0;
				
				} else if(event.keyCode == 37) {
					
					trackDir = 0;
					
					
				} else if(event.keyCode == 39) {
					
					trackDir = 0;
					
					
				} else if(event.keyCode == 65) {
					
					trackDir = 0;
					
					
				} else if(event.keyCode == 68) {
					
					trackDir = 0;
					
					
				}
			
			}
			
			
			function onKeyDown(event) {
				
				event.preventDefault();
			
				if(event.keyCode == 38) {
					
					fwd = 6;
				
				} else if(event.keyCode == 37) {
					
					trackDir = 0.02;
						
				} else if(event.keyCode == 39) {
					
					trackDir = -0.02;
				
				} else if(event.keyCode == 65) {
					
					trackDir = 0.02;
					
					
				} else if(event.keyCode == 68) {
					
					trackDir = -0.02;
					
					
				}
				
			}
			
			


			function animate() {

				requestAnimationFrame( animate );

				render();
				stats.update();

			}

			function render() {
				
				if(growTarget) {
					
					if(targetRadius < 3) { 
						targetRadius += 0.05;
						target.scale.set(targetRadius, targetRadius, 1);
					}
					
				}
				
				
				if(sim) {
					
					if(simAngleFrames == 0) {
						vehAngle += (-0.5 + Math.random()) * (Math.PI);
						simAngleFrames = 500 + Math.random()*500;
					} else {
						simAngleFrames--;
					}
					
					
					if(simSpeedFrames > 0) {
						
						fwd += 0.01;
						
					} else {
						
						fwd = Math.random()*4;
						simSpeedFrames = 500 + Math.random()*500;
						
					}
					
				}
				
				vehAngle += vehDir;
				
				var newTrackAngle = trackAngle + trackDir;
				
				var dz = -Math.cos(vehAngle);
				var dx = -Math.sin(vehAngle);
				
				vehicle.rotation.y = vehAngle;
				
				var vPosX = vehicle.position.x + dx*fwd;
				var vPosZ = vehicle.position.z + dz*fwd;
				
				var vdx1 = vPosX - floor.position.x;
				var vdz1 = vPosZ - floor.position.z;
				var vd1 = (Math.sqrt(vdx1*vdx1 + vdz1*vdz1));
				
				var vdx2 = vPosX - floor.position.x;
				var vdz2 = vPosZ - floor.position.z;
				var vd2 = (Math.sqrt(vdx2*vdx2 + vdz2*vdz2));
				
				var mTopX = Math.sin(newTrackAngle-Math.PI*(1/2))*600;
				var mTopZ = Math.cos(newTrackAngle-Math.PI*(1/2))*600;
				
				var m2TopX = Math.sin(newTrackAngle)*180;
				var m2TopZ = Math.cos(newTrackAngle)*180;
				
				var dTopX = mTopX - vdx1;
				var dTopZ = mTopZ - vdz1;
				var distTop = Math.sqrt(dTopX*dTopX+dTopZ*dTopZ);
				
				
				var mBottomX = Math.sin(newTrackAngle-Math.PI*(3/2))*600;
				var mBottomZ = Math.cos(newTrackAngle-Math.PI*(3/2))*600;
				
				var trackSin = Math.sin(newTrackAngle);
				var trackCos = Math.cos(newTrackAngle);
				
				//mark.position.x = mTopX;
				//mark.position.z = mTopZ;
				
				//mark2.position.x = Math.sin(newTrackAngle)*180;
				//mark2.position.z = Math.cos(newTrackAngle)*180;
				
				
				var vehicleAxisAngle = Math.atan(vdx1 / vdz1);
				var trackAxisAngle = Math.atan(mTopX / mTopZ);
				
				var dAngle = vehicleAxisAngle - trackAxisAngle;
				var shortAxis = Math.cos(dAngle)*vd1;
				
				var axisRem = 600 - Math.abs(shortAxis);
				
				var vehicleAxisAngle2 = Math.atan(vdx2 / vdz2);
				var trackAxisAngle2 = Math.atan(m2TopX / m2TopZ);
				
				var dAngle2 = vehicleAxisAngle2 - trackAxisAngle2;
				var shortAxis2 = Math.cos(dAngle2)*vd2;
				
				var axisRem2 = 180 - Math.abs(shortAxis2);
				
				meterContainer.html( 
					'('+Math.round(vehicle.position.z)+','+Math.round(vehicle.position.x)+'); '+
					'('+Math.round(camera.position.z)+','+Math.round(camera.position.x)+'); '+
					'('+Math.round(floor.position.z)+','+Math.round(floor.position.x)+'); '+
					'('+trackSin+','+trackCos+', '+distTop+'); '
				);
				
				
				if(axisRem < 400) {
					
					if(distTop < 600) {
						floor.position.x -= trackCos*100;
						floor.position.z += trackSin*100;
					} else {
						floor.position.x += trackCos*100;
						floor.position.z -= trackSin*100;
					}
					
				}
				
				if(axisRem2 < 0) {
					
					fwd = 0;
					trackDir = 0;
				
				} else {
					
					trackAngle = newTrackAngle;
					floor.rotation.z = trackAngle;
					
					vehicle.position.x = vPosX;
					vehicle.position.z = vPosZ;			
					
					var camPosX, camPosY, camPosZ;
					
					if(viewMode == 0) {
						camPosX = vehicle.position.x + (dx*150);
						camPosY = 1000;
						camPosZ = vehicle.position.z + (dz*150);
					} else {
						camPosX = vehicle.position.x - (dx*150);
						camPosY = 60;
						camPosZ = vehicle.position.z - (dz*150);
					}
					
					camera.position.set(camPosX, camPosY, camPosZ);
					
					if(viewMode == 0) {
						camera.target.x = camera.position.x;
						camera.target.z = camera.position.z;
						camera.target.y = vehicle.position.y;
					} else {
						camera.target.x = vehicle.position.x;
						camera.target.z = vehicle.position.z;
						camera.target.y = vehicle.position.y+10;
					}
					
					camera.lookAt(camera.target);
					
				
				}
				
				
				renderer.render( scene, camera );

			}