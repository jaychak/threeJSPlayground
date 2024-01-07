import * as THREE from 'three';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const geometry = new THREE.BoxGeometry( 1, 1, 1 );
const material = new THREE.MeshPhongMaterial( { color: 0x00ff00,
    specular: 0xffffff,
    shininess: 50 } );
const cube = new THREE.Mesh( geometry, material );
scene.add( cube );

const dirLight1 = new THREE.DirectionalLight(0xffffff, 0.5);
dirLight1.position.set(0, -1, 0).normalize();
dirLight1.color.setHSL(0.1, 0.7, 0.8);
scene.add(dirLight1);

const dirLight2 = new THREE.DirectionalLight(0xffffff, 0.5);
dirLight2.position.set(0, 1, 0).normalize();
dirLight2.color.setHSL(0.1, 0.7, 0.8);
scene.add(dirLight2); 

const dirLight3 = new THREE.DirectionalLight(0xffffff, 0.5);
dirLight3.position.set(0, 1, 0).normalize();
dirLight3.color.setHSL(0.1, 0.7, 0.8);
scene.add(dirLight3); 



camera.position.z = 5;

function animate() {

	requestAnimationFrame( animate );

	cube.rotation.x += 0.01;
	cube.rotation.y += 0.01;

	renderer.render( scene, camera );

}

animate();