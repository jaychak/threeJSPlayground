import * as THREE from 'three';
import Stats from 'three/addons/libs/stats.module.js';
import {
  FlyControls
} from 'three/addons/controls/FlyControls.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

let stats;
let controls;
let container;
let renderer;
const clock = new THREE.Clock();



function init() {
	container = document.createElement('div');
	document.body.appendChild(container);

	//const renderer = new THREE.WebGLRenderer();
	renderer = new THREE.WebGLRenderer();
	renderer.setSize( window.innerWidth, window.innerHeight );
	container.appendChild(renderer.domElement);

	// Same geometry for all objects.
	// All objects are cubes.
	const geometry = new THREE.BoxGeometry( 1, 1, 1 );
	const material = new THREE.MeshPhongMaterial( { color: 0xffffff,
		specular: 0xffffff,
		shininess: 50 } );

	// Cube 1
	const cube1 = new THREE.Mesh( geometry, material );
	scene.add( cube1 );
	// Cube 2
	const cube2 = new THREE.Mesh( geometry, material );
	scene.add( cube2 );

	// Offset cube2 from cube 1
	cube2.position.x = cube2.position.x + 4;
	cube2.position.z = cube2.position.z - 4;


	// Add lights
	// White light from the bottom right.
	const dirLight1 = new THREE.DirectionalLight(0xffffff, 0.5);
	dirLight1.position.set(20, -21, 0).normalize();
	dirLight1.color.setHSL(0.1, 0.7, 0.8);
	scene.add(dirLight1);

	// Green light from the top right.
	const dirLight2 = new THREE.DirectionalLight(0xffffff, 0.5);
	dirLight2.position.set(20, 21, 0).normalize();
	dirLight2.color.setHSL(0.3, 0.7, 0.5);
	scene.add(dirLight2); 

	// Purple light from the bottom left.
	const dirLight3 = new THREE.DirectionalLight(0xffffff, 0.8);
	dirLight3.position.set(-20, 20, 20).normalize();
	dirLight3.color.setHSL(0.6, 0.7, 0.5);
	scene.add(dirLight3);  


	// Set initial camera position
	camera.position.z = 5;

	// Add keyboard controls
	controls = new FlyControls(camera, renderer.domElement);
	controls.movementSpeed = 2;
	controls.domElement = container;
	controls.rollSpeed = Math.PI/6;
	controls.autoForward = false;
	controls.dragToLook = true;

	// Stats
	stats = new Stats();
	container.appendChild(stats.dom);

}


 


function animate() {

	requestAnimationFrame( animate );
	render();
	stats.update();

}

function render() {
	const delta = clock.getDelta();
	controls.update(delta);

	renderer.render(scene, camera);
}

init();
animate();