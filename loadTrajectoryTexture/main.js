import * as THREE from 'three';
import Stats from 'three/addons/libs/stats.module.js';
import {
  FlyControls
} from 'three/addons/controls/FlyControls.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );


//const fileInput;

let stats;
let controls;
let container;
let renderer;
const clock = new THREE.Clock();

function init() {
	container = document.createElement('div');
	document.body.appendChild(container);

	// Debug output
	const debugDiv = document.createElement('div');
	debugDiv.id = 'debug';
	container.appendChild(debugDiv);

	// Renderer
	//const renderer = new THREE.WebGLRenderer();
	renderer = new THREE.WebGLRenderer();
	renderer.setSize( window.innerWidth, window.innerHeight );
	container.appendChild(renderer.domElement);

	// const size = 10;
	// const divisions = 10;

	// const gridHelper = new THREE.GridHelper( size, divisions );
	// scene.add( gridHelper );

	const axesHelper = new THREE.AxesHelper(50);
	scene.add(axesHelper);


    //Debug: Print out trajectory.txt line by line

	// Draw cubes/frustra at trajectory points
	document.getElementById('fileInput').addEventListener('change', function(event) {
		const file = event.target.files[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = function(e) {
				processCameraTrajectory(e.target.result);
			};
			reader.readAsText(file);
			console.log("This log appears BEFORE file read completes");

		}
	}, false);
	console.log("This log appears AFTER file read completes");



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

	const dirLight4 = new THREE.DirectionalLight(0xffffff, 0.05);
	dirLight4.position.set(0, -1, 0).normalize();
	dirLight4.color.setHSL(0.1, 0.7, 0.5);
	scene.add(dirLight4);

	// const dirLight5 = new THREE.DirectionalLight(0xffffff, 1); // Increase directional light intensity
	// dirLight5.position.set(5, 5, 5);
	// scene.add(dirLight5);

	// Ambient light to uniformly illuminate the scene
	const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
	scene.add(ambientLight);
  
	// Set initial camera position
	camera.position.y = 25;//250;//5
	// camera.position.x = 5;
	// camera.position.y = 5;
	camera.lookAt(new THREE.Vector3(0, 0, 0)); // Look at the origin

	

	// Add keyboard controls
	controls = new FlyControls(camera, renderer.domElement);
	controls.movementSpeed = 20;//2
	controls.domElement = container;
	controls.rollSpeed = Math.PI/6;
	controls.autoForward = false;
	controls.dragToLook = true;

	// Stats
	stats = new Stats();
	container.appendChild(stats.dom);

}


function processCameraTrajectory(contents) {
    const debugDiv = document.getElementById('debug');
    debugDiv.innerHTML = ''; // Clear previous content
    const lines = contents.split('\n');
    
    const geometry = new THREE.BoxGeometry( 1, 1, 1 );
	const material = new THREE.MeshPhongMaterial( { color: 0xffffff,
	 	specular: 0xffffff,
	 	shininess: 50 } );
	// const cube1 = new THREE.Mesh( geometry, material );
	// scene.add( cube1 );

	


	const scale1 = 1;//2; // Scale factor
	const scale2 = 1;//4;

	let pose_idx = 0;

	const max_poses = 500; // Max num of poses we want to load in
	const imageRootPath = 'images/01/left/'; // Path of images used to texture camera frustra
	const start_img_idx = 50; // Start image idx
	const num_skip_frames = 10;

    for (let line of lines) {
        const elements = line.split(' ').map(Number);
        if (elements.length === 12 && pose_idx < max_poses && pose_idx % num_skip_frames == 0) {//
            const matrix = [
                [elements[0], elements[1], elements[2], elements[3]],
                [elements[4], elements[5], elements[6], elements[7]],
                [elements[8], elements[9], elements[10], elements[11]]
            ];
			// const vec_t = [elements[3], elements[7], elements[11]];
			// Extract the position vector
            const positionVec = new THREE.Vector3(elements[3], elements[7], elements[11]);


			// // Create a 4x4 matrix and set its components
            const rotMatrix = new THREE.Matrix4();
            rotMatrix.set(
                elements[0], elements[1], elements[2], 0,
                elements[4], elements[5], elements[6], 0,
                elements[8], elements[9], elements[10], 0,
                0, 0, 0, 1
            );

            // // Plain square for each camera
			// const squareGeometry = new THREE.PlaneGeometry(1, 1); // 1x1 square
			// //const squareMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide });
			// const squareMaterial = new THREE.MeshPhongMaterial({ 
			// 	color: 0xffffff, // White color
			// 	side: THREE.DoubleSide,
			// 	specular: 0xffffff, //0x050505, // Specular highlights
			// 	shininess: 50 // Shininess of the material
			// });

			// const square = new THREE.Mesh(squareGeometry, squareMaterial);
			// //square.rotation.x = Math.PI / 2; // Rotate to make it horizontal

			// square.position.copy(positionVec);
			// square.setRotationFromMatrix(rotMatrix);
			// scene.add(square);
			// //square.position.y = square.position.y - 0.5;
			// //square.position.y = -0.5; // Adjust position to where you want the base of the frustum
			// // End Plain square for each camera

			createTexturedPlane(positionVec, rotMatrix, imageRootPath, pose_idx+start_img_idx);
			//scene.add(plane);

        }
		pose_idx ++;
    }

	
}

async function createTexturedPlane(positionVec, rotMatrix, imageRootPath, pose_idx) {
	const imagePath = imageRootPath + pose_idx + '.png';// '50.png'
	//const texture = await loadTexture(imagePath);
	//const material = new THREE.MeshBasicMaterial({ map: texture });
	// const material = new THREE.MeshPhongMaterial({ 
	// 		color: 0xffffff, // White color
	// 		side: THREE.DoubleSide,
	// 		specular: 0xffffff, //0x050505, // Specular highlights
	// 		shininess: 50 // Shininess of the material
	// 	});

	loadTexture1(imagePath).then(texture => {
		const material = new THREE.MeshBasicMaterial({
			map: texture
		});
	
		const planeGeometry = new THREE.PlaneGeometry(1, 1);
		const plane = new THREE.Mesh(planeGeometry, material);
	
		// // Set the position and add the plane to the scene
		// plane.position.copy(positionVec); // Set position
		// plane.setRotationFromMatrix(rotMatrix); // Set rotation
		// scene.add(plane);

		// Create an outline for the plane
        const outline = createPlaneOutline(1);

        // Create a group and add both the plane and the outline
        const planeGroup = new THREE.Group();
        planeGroup.add(plane);
        planeGroup.add(outline);

        // Apply the position and rotation
        planeGroup.position.copy(positionVec);
        planeGroup.setRotationFromMatrix(rotMatrix);

        // Add the group to the scene
        scene.add(planeGroup);
	}).catch(error => {
		console.error('Error loading texture:', error);
		console.log('Making fallback material.')
	
		// Fallback material
		const fallbackMaterial = new THREE.MeshPhongMaterial({ 
			color: 0xffffff, // White color
			side: THREE.DoubleSide,
			specular: 0xffffff, // Specular highlights
			shininess: 50 // Shininess of the material
		});
	
		// Set the position and add the plane to the scene
		const planeGeometry = new THREE.PlaneGeometry(1, 1);
		const plane = new THREE.Mesh(planeGeometry, fallbackMaterial);
		plane.position.copy(positionVec);
		plane.setRotationFromMatrix(rotMatrix);
		scene.add(plane);
	});


	// const planeGeometry = new THREE.PlaneGeometry(1, 1);
	// const plane = new THREE.Mesh(planeGeometry, material);
	// plane.position.copy(positionVec);
	// plane.setRotationFromMatrix(rotMatrix);
	// scene.add(plane);
	//return plane;
}

function createPlaneOutline(size) {
    const halfSize = size / 2;
	const lineMaterial = new THREE.LineBasicMaterial({ 
		color: 0xffffff // White or any color that stands out
	});

    const outlineGeometry = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(-halfSize, -halfSize, 0),
        new THREE.Vector3(halfSize, -halfSize, 0),
        new THREE.Vector3(halfSize, halfSize, 0),
        new THREE.Vector3(-halfSize, halfSize, 0),
        new THREE.Vector3(-halfSize, -halfSize, 0) // Close the loop
    ]);
    
    return new THREE.LineLoop(outlineGeometry, lineMaterial);
}


//const loader = new THREE.TextureLoader();

function loadTexture(imagePath) {
    return new Promise((resolve, reject) => {
        loader.load(imagePath, texture => {
            resolve(texture);
        }, undefined, error => {
            reject(error);
        });
    });
}

function loadTexture1(imagePath) {
	// // instantiate a loader
	// const loader = new THREE.TextureLoader();

	// // load a resource
	// loader.load(
	// 	// resource URL
	// 	imagePath,

	// 	// onLoad callback
	// 	function ( texture ) {
	// 		// in this example we create the material when the texture is loaded
	// 		const material = new THREE.MeshBasicMaterial( {
	// 			map: texture
	// 		} );
	// 	},

	// 	// onProgress callback currently not supported
	// 	undefined,

	// 	// onError callback
	// 	function ( err ) {
	// 		console.error( 'Could not load texture.' );
	// 	}
	// );
	return new Promise((resolve, reject) => {
        const loader = new THREE.TextureLoader();
        loader.load(
            imagePath,
            function (texture) {
				texture.minFilter = THREE.LinearFilter; // Set the minification filter
                resolve(texture);
            },
            undefined,
            function (err) {
                console.error('Could not load texture.');
                reject(err);
            }
        );
    });
}

// function createCubeAtPoint(point) {
// 	// const geometry = new THREE.BoxGeometry( 1, 1, 1 );
// 	// const material = new THREE.MeshPhongMaterial( { color: 0xffffff,
// 	//   specular: 0xffffff,
// 	//   shininess: 50 } );
//     const geometry = new THREE.BoxGeometry(100, 100, 100); // Smaller geometry for trajectory points
//     const material = new THREE.MeshBasicMaterial({color: 0xff0000}); // Red color for visibility
//     const cube = new THREE.Mesh(geometry, material);

//     cube.position.copy(point);
// 	// cube.position.x = cube1.position.x + point.x;
// 	// cube.position.y = cube1.position.y +point.y;
// 	// cube.position.z = 0;
//     scene.add(cube);
// }

function createCubeAtPoint(position) {
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);
    return cube;
}

function displayMatrix(matrix, debugDiv) {
    const matrixDiv = document.createElement('div');
    matrixDiv.className = 'matrix';
    matrixDiv.textContent = `Matrix: \n${matrix.map(row => row.join(' ')).join('\n')}`;
    debugDiv.appendChild(matrixDiv);
}


function animate() {

	requestAnimationFrame( animate );
	render();
	stats.update();

	// console.log("Camera pos:", camera.position);
	// // console.log("Camera looking at:", camera.lookAt);
	// const direction = new THREE.Vector3();
    // camera.getWorldDirection(direction);
    // console.log("Camera Direction:", direction.x, direction.y, direction.z);

}

function render() {
	const delta = clock.getDelta();
	controls.update(delta);

	renderer.render(scene, camera);
}

init();
animate();