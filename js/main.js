/**
 * KUJIKUJI - Interactive 3D Lottery Application
 * Built with Three.js and GSAP for smooth animations
 * 
 * Features:
 * - Multiple animated robot characters
 * - Random selection with dramatic lighting
 * - Smooth camera transitions
 * - Character animations and interactions
 */

import * as THREE from 'three';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import Stats from 'three/addons/libs/stats.module.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { SVGLoader } from 'three/addons/loaders/SVGLoader.js';
import { ParticleEffects } from './particles.js';

// ===== Global Variables =====
let container, stats, clock, gui;
let camera, scene, renderer, controls;
let sLight, dirLight, hemiLight, lightHelper;
let modelGroup = [], kujiList = [];

const api = { state: 'Standing' };
const btnSelect = document.getElementById('btn_select');

// ===== Animation States =====
const states = [ 'Idle', 'Walking', 'Running', 'Dance', 'Sitting', 'Standing', 'Death' ];
const emotes = [ 'Jump', 'Yes', 'No', 'Wave', 'Punch', 'ThumbsUp' ];

// ===== Load Characters from localStorage =====
let characters = StorageManager.getUnselectedCharacters();

// If no characters found, redirect to input page
if (characters.length === 0) {
	alert('캐릭터가 없습니다. 먼저 캐릭터를 추가해주세요.');
	window.location.href = 'index.html';
}

// Shuffle characters for random placement
characters = StorageManager.shuffleArray(characters);

// ===== Generate positions with collision detection =====
const initPos = Utils.generatePositions(characters.length, 3, 50);

console.log(`✅ ${characters.length}명의 캐릭터 배치 준비 완료`);

// ===== Configuration =====
THREE.Cache.enabled = true;

const duration = 1;
const ease = 'power3.out';
const cameraInitPos = new THREE.Vector3(0, 20, 30);
const cameraInitLookAt = new THREE.Vector3(0, 2, 0);

// ===== Initialize Application =====
// Initialize i18n first, then start the app
window.addEventListener('DOMContentLoaded', () => {
	window.i18n.init().then(() => {
		init();
		setupLanguageSelector();
	});
});

/**
 * Setup language selector
 */
function setupLanguageSelector() {
	const selector = document.getElementById('languageSelector');
	if (selector) {
		// Set current language
		selector.value = window.i18n.getCurrentLanguage();
		
		// Handle language change
		selector.addEventListener('change', (e) => {
			window.i18n.setLanguage(e.target.value);
			// Update button text dynamically
			const btnSelect = document.getElementById('btn_select');
			if (btnSelect && btnSelect.textContent !== 'GO') {
				btnSelect.textContent = window.i18n.t('select.returnButton');
			}
		});
	}
}

/**
 * Initialize the 3D scene, camera, lights, and models
 */
function init() {
	// Setup container
	container = document.createElement( 'div' );
	document.body.appendChild( container );

	// Setup camera
	camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.25, 100 );
	camera.position.set( 0, 2000, 300 );
	camera.lookAt( cameraInitLookAt );

	// Animate camera to initial position
	gsap.to( camera.position, {
		duration: 4,
		ease: ease,
		x: cameraInitPos.x,
		y: cameraInitPos.y,
		z: cameraInitPos.z,
		onComplete: function() {
			btnSelect.classList.remove('hide')
		}, 
		delay: 0.0
	} );

	// Setup scene
	scene = new THREE.Scene();
	scene.background = new THREE.Color( 0xe0e0e0 );
	scene.fog = new THREE.Fog( 0xe0e0e0, 30, 50 );

	clock = new THREE.Clock();

	// ===== Setup Lighting =====
	// Spotlight for dramatic effect (initially off)
	sLight = new THREE.SpotLight( 0xFFFFFF, 60, 125, Math.PI / 16, 0.9, 1 );
	sLight.castShadow = true;
	sLight.intensity = 0;
	scene.add( sLight );
	scene.add( sLight.target );

	// Hemisphere light for ambient lighting
	hemiLight = new THREE.HemisphereLight( 0xffffff, 0x8d8d8d, 3 );
	hemiLight.position.set( 0, 20, 0 );
	scene.add( hemiLight );

	// Directional light for shadows
	dirLight = new THREE.DirectionalLight( 0xffffff, 3 );
	dirLight.position.set( 0, 20, 10 );
	dirLight.castShadow = true; 
	dirLight.shadow.camera.right = 120;
	dirLight.shadow.camera.left = -120;
	dirLight.shadow.camera.top = -120;
	dirLight.shadow.camera.bottom = 120;
	dirLight.shadow.mapSize.width = 1024;
	dirLight.shadow.mapSize.height = 1024;
	dirLight.shadow.camera.near = 0.5;
	dirLight.shadow.camera.far = 500;
	scene.add( dirLight );

	// ===== Setup Ground =====
	const mesh = new THREE.Mesh( 
		new THREE.BoxGeometry( 500, 500, 0.01 ), 
		new THREE.MeshPhysicalMaterial( { color: 0xcbcbcb, roughness: 0, depthWrite: true } ) 
	);
	mesh.rotation.x = - Math.PI / 2;
	mesh.receiveShadow = true;
	scene.add( mesh );

	// Grid helper
	const grid = new THREE.GridHelper( 200, 40, 0x000000, 0x000000 );
	grid.material.opacity = 0.1;
	grid.material.transparent = true;
	scene.add( grid );

	// ===== Load Models =====
	for ( let i = 0; i < characters.length; i ++ ) {
		loadModel(i);	
	}

	// ===== Setup Renderer =====
	renderer = new THREE.WebGLRenderer( { antialias: true } );
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
	renderer.setAnimationLoop( animate );
	renderer.shadowMap.enabled = true;
	renderer.shadowMap.type = THREE.PCFSoftShadowMap;
	container.appendChild( renderer.domElement );

	window.addEventListener( 'resize', onWindowResize );

	// ===== Setup Controls =====
	controls = new OrbitControls( camera, renderer.domElement );
	controls.enableDamping = true;
	controls.autoRotate = true;
	controls.maxPolarAngle = Math.PI * 80 / 180;

	// ===== Setup Button Event =====
	btnSelect.status = 1;
	let currentIdx = -1;
	let timeStamp = 0;
	
	btnSelect.addEventListener('click', (e)=>{
		// Prevent rapid clicking
		if ( new Date() * 1 - timeStamp < 1000 ) {
			return;
		}
		
		if ( btnSelect.status === 1 ) {
			// Select random character
			currentIdx = kujiList[parseInt( Math.random() * kujiList.length )];
			selectedKuji(currentIdx);
		}
		else if ( btnSelect.status === 2 ) {
			// Return to overview
			returnView(currentIdx);
		}
		else if ( btnSelect.status === 3 ) {
			// Try Again - Reset all selections without confirmation
			StorageManager.resetSelections(true);
			window.location.reload();
		}

		timeStamp = new Date() * 1;
	})

	// ===== Back Button Event =====
	document.getElementById('btn_back').addEventListener('click', () => {
		if (confirm(window.i18n.t('select.confirm.back'))) {
			window.location.href = 'index.html';
		}
	});

	// ===== Update Statistics =====
	updateStatistics();
}

/**
 * Update statistics display
 */
function updateStatistics() {
	const stats = StorageManager.getStatistics();
	document.getElementById('stats-total').textContent = stats.total;
	document.getElementById('stats-selected').textContent = stats.selected;
	document.getElementById('stats-remaining').textContent = stats.remaining;

	// Check if all characters are selected
	if (stats.isComplete) {
		// Change GO button to "Try Again"
		btnSelect.textContent = 'Try Again';
		btnSelect.status = 3; // New status for reset
	}
}

/**
 * Return to overview after selecting a character
 * @param {number} selectedIdx - Index of the selected character
 */
function returnView(selectedIdx) {
	btnSelect.classList.add('hide');
	controls.autoRotate = true;

	let model = modelGroup[selectedIdx];
	model.status = 'dead';

	clearTimeout(model.interval);

	// Play death animation
	model.activeAction = model.actions[ states[6] ];
	model.action = model.actions[ states[6] ];
	model.action.loop = THREE.LoopOnce;
	model.action.play();

	// Fade out spotlight
	gsap.to(sLight, {
		intensity: 0,
		duration: duration,
		ease: ease
	})
	
	// Fade in other characters back
	for (let i = 0; i < modelGroup.length; i++) {
		if (i !== selectedIdx && modelGroup[i].status !== 'dead') {
			modelGroup[i].traverse(function(child) {
				if (child.isMesh) {
					// Re-enable shadows for characters
					child.castShadow = true;
					
					// Handle both single material and material array
					const materials = Array.isArray(child.material) ? child.material : [child.material];
					
					materials.forEach(function(material) {
						if (material && material.transparent && material.userData) {
							// Restore original opacity
							const originalOpacity = material.userData.originalOpacity !== undefined 
								? material.userData.originalOpacity 
								: 1;
							gsap.to(material, {
								opacity: originalOpacity,
								duration: duration,
								ease: ease,
								onComplete: function() {
									// Disable transparency if original opacity was 1
									if (originalOpacity >= 1) {
										material.transparent = false;
									}
								}
							});
						}
					});
				}
			});
		}
	}
	
	// Restore normal lighting
	gsap.to(dirLight, {
		intensity: 3,
		duration: duration,
		ease: ease,
		onUpdate: function() {
			hemiLight.intensity = dirLight.intensity
		}
	})

	// Restore background color
	gsap.to(scene.background, {
		r: 0.8, g: 0.8, b: 0.8,
		duration: duration,
		ease: ease,
		onUpdate: function() {
			scene.fog.color = scene.background;
		}
	})

	// Return camera to initial position
	gsap.to( camera.position, {
		duration: duration,
		ease: ease,
		x: cameraInitPos.x,
		y: cameraInitPos.y,
		z: cameraInitPos.z,
		onUpdate: function() {
			camera.lookAt( cameraInitLookAt );
			controls.target = cameraInitLookAt;
		},
		onComplete: function() {
			btnSelect.classList.remove('hide');
			btnSelect.textContent = 'GO';
			btnSelect.status = 1;
			updateStatistics(); // Update stats after returning
		},
		delay: 0.5
	} );
}

/**
 * Handle character selection with dramatic effects
 * @param {number} selectedIdx - Index of the selected character
 */
function selectedKuji( selectedIdx ) {
	// Remove selected character from available list
	let killIdx = kujiList.indexOf(selectedIdx);
	if ( killIdx > -1 ) {
		kujiList.splice(killIdx, 1);
	}

	btnSelect.classList.add('hide');
	controls.autoRotate = false;

	let model = modelGroup[selectedIdx];
	model.status = 'showing';

	// Save selection to localStorage
	if (model.characterId) {
		StorageManager.selectCharacter(model.characterId);
		console.log(`✅ 캐릭터 선택 저장: ${characters[selectedIdx].name}`);
		updateStatistics(); // Update stats after selection
	}

	// Focus spotlight on selected character
	changeSpotLightPosition(selectedIdx);
	
	// Fade out other characters
	for (let i = 0; i < modelGroup.length; i++) {
		if (i !== selectedIdx && modelGroup[i].status !== 'dead') {
			modelGroup[i].traverse(function(child) {
				if (child.isMesh) {
					// Disable shadows for non-selected characters
					child.castShadow = false;
					
					// Handle both single material and material array
					const materials = Array.isArray(child.material) ? child.material : [child.material];
					
					materials.forEach(function(material) {
						if (material) {
							// Initialize userData if not exists
							if (!material.userData) {
								material.userData = {};
							}
							// Store original opacity if not already stored
							if (material.userData.originalOpacity === undefined) {
								material.userData.originalOpacity = material.opacity !== undefined ? material.opacity : 1;
							}
							// Enable transparency
							material.transparent = true;
							// Fade out
							gsap.to(material, {
								opacity: 0,
								duration: duration,
								ease: ease
							});
						}
					});
				}
			});
		}
	}
	
	// Darken background for dramatic effect
	gsap.to(scene.background, {
		r: 0, g: 0, b: 0,
		duration: duration,
		ease: ease,
		onUpdate: function() {
			scene.fog.color = scene.background;
		}
	})

	// Turn on spotlight
	gsap.to(sLight, {
		intensity: 160,
		duration: duration,
		ease: ease
	})
	
	// Dim other lights
	gsap.to(dirLight, {
		intensity: 0.03,
		duration: duration,
		ease: ease,
		onUpdate: function() {
			hemiLight.intensity = dirLight.intensity
		}
	})

	// Calculate model bounds for camera positioning
	var aabb = new THREE.Box3().setFromObject( model );
	var center = aabb.getCenter( new THREE.Vector3() );
	var size = aabb.getSize( new THREE.Vector3() );

	// Move camera to focus on selected character (slightly elevated for better view)
	gsap.to( camera.position, {
		duration: duration,
		ease: ease,
		x: center.x,
		y: center.y + 2,  // Elevated camera position
		z: center.z + size.z + 6,
		onUpdate: function() {
			camera.lookAt( center );
			controls.target = center;
		},
		onComplete: function() {
			// Create confetti celebration effect behind the character
			const particlePos = new THREE.Vector3(center.x, center.y, center.z - 2);
			ParticleEffects.createConfettiCelebration(scene, particlePos, camera);
			
			// Play random emote
			fadeToAction(emotes[parseInt(Math.random() * emotes.length - 1)], 0.5, model);
			
			// After 2 seconds, flip name card and show thumbs up
			setTimeout(function(){
				fadeToAction(emotes[5], 0.5, model);

				gsap.to(model.title.rotation, {
					z: Math.PI / 2,
					duration: 0.4,
					onComplete: function() {
						model.title_index.visible = false;
						model.title_name.visible = true;
						gsap.to(model.title.rotation, {
							z: Math.PI,
							duration: 0.4
						})
					}
				})
			}, 2000)
			
			// Show return button after 3 seconds
			setTimeout(function(){
				btnSelect.classList.remove('hide');
			}, 3000)
			
			btnSelect.textContent = 'RETURN';
			btnSelect.status = 2;
		}
	} );

	// Face model forward
	gsap.to( model.rotation, {
		duration: duration,
		ease: ease,
		y: 0
	});
}

/**
 * Position spotlight on specific character
 * @param {number} idx - Character index
 */
function changeSpotLightPosition(idx) {
	let model = modelGroup[idx];
	sLight.position.set(model.position.x, 30, model.position.z + 20)
	sLight.target = model;
}

/**
 * Load 3D character model
 * @param {number} idx - Model index
 */
function loadModel(idx) {
	const loader = new GLTFLoader();
	loader.load( 'libs/models/gltf/RobotExpressive/RobotExpressive.glb', function ( gltf ) {
		const model = gltf.scene;
		
		// Enable shadows for all meshes
		model.traverse( function( node ) {
			if ( node.isMesh ) { 
				node.castShadow = true; 
				node.receiveShadow = true; 
			}
		} );

		// Apply DiceBear avatar using SVGLoader
		const head = model.getObjectByName( 'Head_4' );
		const headParent = model.getObjectByName( 'Head_3' ); // Get parent for avatar placement
		
		// Hide Head_4 mesh only
		if (head) {
			head.visible = false;
		}

		// Add avatar plane (this is where avatar should be displayed)
		const geometry = new THREE.PlaneGeometry( 0.02, 0.02 );
		const material = new THREE.MeshPhysicalMaterial( {
			color: 0xffff00, 
			side: THREE.DoubleSide,
			transparent: true
		} );
		const plane = new THREE.Mesh( geometry, material );
		plane.rotation.x = Math.PI * 90 / 180;
		plane.position.y = -0.015;
		plane.name = 'AvatarPlane';
		headParent.add( plane );

		// Load avatar texture onto the plane
		if (characters[idx].avatarSeed) {
			const avatarUrl = StorageManager.getAvatarUrl(characters[idx].avatarSeed);
			const textureLoader = new THREE.TextureLoader();
			
			textureLoader.load(avatarUrl, function(texture) {
				plane.material.map = texture;
				plane.material.needsUpdate = true;
				console.log(`✅ Avatar loaded for ${characters[idx].name}`);
			}, undefined, function(error) {
				console.warn(`⚠️ Failed to load avatar for ${characters[idx].name}:`, error);
			});
		}

		// Load and add text labels
		const fontLoader = new FontLoader();
		fontLoader.load( 'libs/fonts/optimer_bold.typeface.json', function ( response ) {
			model.title = new THREE.Object3D();
			model.title_index = getTextMesh(response, (idx + 1).toString(), false);
			model.title_name = getTextMesh(response, characters[idx].name, true);
			model.title.add( model.title_index );
			model.title.add( model.title_name );
			model.getObjectByName( 'Head_3' ).add(model.title)
		} );

		// Setup animation mixer
		const mixer = new THREE.AnimationMixer( model );
		modelGroup.push(model);
		kujiList.push(idx);
		scene.add( model );

		model.idx = idx;
		model.characterId = characters[idx].id; // Store character ID for saving selection
		model.mixer = mixer;

		// Set initial position and rotation
		model.position.set(
			initPos[idx].x,
			0,
			initPos[idx].z
		);
		model.rotation.y = Math.PI * initPos[idx].rotation / 180;

		// Setup animations
		model.actions = {};
		for ( let i = 0; i < gltf.animations.length; i ++ ) {
			const clip = gltf.animations[ i ];
			const action = mixer.clipAction( clip );
			model.actions[ clip.name ] = action;

			if ( emotes.indexOf( clip.name ) >= 0 || states.indexOf( clip.name ) >= 4 ) {
				action.clampWhenFinished = true;
				action.loop = THREE.LoopOnce;
			}
		}

		// Start with default animation
		model.activeAction = model.actions[ api.state ];
		model.activeAction.play();

		// Start random animation loop
		model.interval = setTimeout(randAnimation, 1000 * Math.random());

		/**
		 * Play random animations on characters
		 */
		function randAnimation() {
			if ( !model.status ) {
				let rand = parseInt( Math.random() * 10);
				let type = parseInt( Math.random() * 4);

				if ( rand < 8 ) {
					fadeToAction(states[type], 0.5, model);
				}
			}
			else if ( model.status === 'dead' ) {
				clearTimeout(model.interval);
				return;
			}

			if ( model.status !== 'dead' ) {
				model.interval = setTimeout(randAnimation, 10000 * Math.random());
			}
		}

	}, undefined, function ( e ) {
		console.error( e );
	} );
}

/**
 * Create 3D text mesh for character labels
 * @param {Object} font - Loaded font object
 * @param {string} title - Text to display
 * @param {boolean} reverse - Whether to flip the text
 * @returns {THREE.Mesh} Text mesh object
 */
function getTextMesh(font, title, reverse) {
	const textGeo = new TextGeometry( title, {
		font: font,
		size: 0.005,
		depth: 0.001,
		curveSegments: 0.01,
		bevelThickness: 0.01,
		bevelSize: 0.0,
		bevelEnabled: false
	} );

	textGeo.computeBoundingBox();

	var centerOffset = - 0.5 * ( textGeo.boundingBox.max.x - textGeo.boundingBox.min.x );

	const materials = [
		new THREE.MeshPhongMaterial( { color: 0xFF6600, flatShading: true } ),
		new THREE.MeshPhongMaterial( { color: 0xFF6600 } )
	];
	
	const textMesh = new THREE.Mesh( textGeo, materials );
	textMesh.rotation.x = Math.PI * 90 / 180;
	
	if ( reverse === true ) {
		textMesh.position.x = -centerOffset;
		textMesh.rotation.y = Math.PI;
		textMesh.visible = false;
	}
	else {
		textMesh.position.x = centerOffset;
	}
	textMesh.position.z = 0.015;

	return textMesh;
}

/**
 * Smoothly transition between animations
 * @param {string} name - Animation name
 * @param {number} duration - Transition duration
 * @param {Object} model - Character model
 */
function fadeToAction( name, duration, model ) {
	model.previousAction = model.activeAction;
	model.activeAction = model.actions[ name ];

	if ( model.previousAction !== model.activeAction ) {
		model.previousAction.fadeOut( duration );
	}

	model.activeAction
		.reset()
		.setEffectiveTimeScale( 1 )
		.setEffectiveWeight( 1 )
		.fadeIn( duration )
		.play();
}

/**
 * Handle window resize
 */
function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );
}

/**
 * Animation loop
 */
function animate() {
	const dt = clock.getDelta();

	if ( modelGroup && modelGroup.length > 0 ) {
		for ( let i = 0, len = modelGroup.length; i < len; i ++ ){
			modelGroup[i].mixer.update(dt);
		}
	}

	renderer.render( scene, camera );
	controls.update();
}
