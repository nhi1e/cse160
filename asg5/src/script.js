/**
 * I followed blender tutorial by Bruno Simon to create the portal scene
 * Perlin noise algorithm taken from Stefan Gustavson https://gist.github.com/patriciogonzalezvivo/670c22f3966e662d2f83
*/

import GUI from "lil-gui";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import firefliesVertexShader from "./shaders/fireflies/vertex.glsl";
import firefliesFragmentShader from "./shaders/fireflies/fragment.glsl";
import portalVertexShader from "./shaders/portal/vertex.glsl";
import portalFragmentShader from "./shaders/portal/fragment.glsl";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";

/**
 * Base
 */
// Debug
const debugObject = {};
const gui = new GUI({
	width: 400,
});
const tickFunctions = [];

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Loaders
 */
// Texture loader
const textureLoader = new THREE.TextureLoader();

// Draco loader
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath("draco/");

// GLTF loader
const gltfLoader = new GLTFLoader();
gltfLoader.setDRACOLoader(dracoLoader);

// Load HDR Skybox
const rgbeLoader = new RGBELoader();
rgbeLoader.load("skybox.hdr", (texture) => {
	texture.mapping = THREE.EquirectangularReflectionMapping;

	// Apply the texture as the scene background and environment
	scene.background = texture;
	scene.environment = texture;
});

/**
 * Object
 */

/**
 * Textures
 */
const bakedTexture = textureLoader.load("baked.jpg");
bakedTexture.flipY = false;
bakedTexture.encoding = THREE.sRGBEncoding;
/**
 * Materials
 */
// const bakedMaterial = new THREE.MeshBasicMaterial({ map: bakedTexture });
const bakedMaterial = new THREE.MeshStandardMaterial({
	map: bakedTexture, // Keeps your baked texture
	roughness: 1.0, // Controls surface roughness
	metalness: 0.0, // Adds slight reflectivity
	fog: true,
});

debugObject.portalColorStart = "#000000";
debugObject.portalColorEnd = "#00fffb";
gui.addColor(debugObject, "portalColorStart").onChange(() => {
	portalLightMaterial.uniforms.uColorStart.value.set(
		debugObject.portalColorStart
	);
});
gui.addColor(debugObject, "portalColorEnd").onChange(() => {
	portalLightMaterial.uniforms.uColorEnd.value.set(debugObject.portalColorEnd);
});
const portalLightMaterial = new THREE.ShaderMaterial({
	uniforms: {
		uTime: { value: 0 },
		uColorStart: { value: new THREE.Color("#000000") },
		uColorEnd: { value: new THREE.Color("#00fffb") },
	},
	vertexShader: portalVertexShader,
	fragmentShader: portalFragmentShader,
});
debugObject.showLightHelpers = true;
let poleLightAHelper, poleLightBHelper;

/*
 * Load model
 */
gltfLoader.load("portal.glb", (gltf) => {
	scene.add(gltf.scene);

	const bakedMesh = gltf.scene.children.find((child) => child.name === "baked");
	const poleLightAMesh = gltf.scene.children.find(
		(child) => child.name === "poleLightA"
	);
	const poleLightBMesh = gltf.scene.children.find(
		(child) => child.name === "poleLightB"
	);
	const portalLightMesh = gltf.scene.children.find(
		(child) => child.name === "portalLight"
	);
	if (portalLightMesh) {
		const portalLabel = createPortalLabel();
		portalLabel.position.set(
			portalLightMesh.position.x,
			portalLightMesh.position.y + 1.2, // Position slightly above the portal
			portalLightMesh.position.z
		);

		scene.add(portalLabel);
		// Ensure the label always faces the camera in the animation loop
		tickFunctions.push(() => {
			portalLabel.quaternion.copy(activeCamera.quaternion);
		});
	}

	bakedMesh.material = bakedMaterial;
	portalLightMesh.material = portalLightMaterial;
	const poleLightMaterial = new THREE.MeshBasicMaterial({ color: 0xffffe5 });
	poleLightAMesh.material = poleLightMaterial;
	poleLightBMesh.material = poleLightMaterial;
	const poleLightA = new THREE.PointLight(0xffeeaa, 3, 5); // Warm, soft light
	const poleLightB = new THREE.PointLight(0xffeeaa, 3, 5);

	// Position the lights at the pole lights' positions
	poleLightA.position.copy(poleLightAMesh.position);
	poleLightB.position.copy(poleLightBMesh.position);

	// Attach the lights to the scene
	scene.add(poleLightA);
	scene.add(poleLightB);

	poleLightAHelper = new THREE.PointLightHelper(poleLightA, 0.5);
	poleLightBHelper = new THREE.PointLightHelper(poleLightB, 0.5);
	scene.add(poleLightAHelper);
	scene.add(poleLightBHelper);

	poleLightAHelper.visible = debugObject.showLightHelpers;
	poleLightBHelper.visible = debugObject.showLightHelpers;
});

/**
 * Lights
 */

const ambientLight = new THREE.AmbientLight(0xffffff, 2);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

const pointLight = new THREE.PointLight(0xffaa00, 2, 20);
pointLight.position.set(0, 3, 3);
scene.add(pointLight);

const dirLightHelper = new THREE.DirectionalLightHelper(directionalLight, 1);
const pointLightHelper = new THREE.PointLightHelper(pointLight, 0.5);

scene.add(dirLightHelper);
scene.add(pointLightHelper);

gui
	.add(debugObject, "showLightHelpers")
	.name("Show Light Helpers")
	.onChange((value) => {
		dirLightHelper.visible = value;
		pointLightHelper.visible = value;

		if (poleLightAHelper) poleLightAHelper.visible = value;
		if (poleLightBHelper) poleLightBHelper.visible = value;
	});

dirLightHelper.visible = debugObject.showLightHelpers;
pointLightHelper.visible = debugObject.showLightHelpers;
/**
 * fireflies
 */

const firefliesGeometry = new THREE.BufferGeometry();
const firefliesCount = 30;
const positionArray = new Float32Array(firefliesCount * 3);
const scaleArray = new Float32Array(firefliesCount);

for (let i = 0; i < firefliesCount; i++) {
	positionArray[i * 3 + 0] = (Math.random() - 0.5) * 4;
	positionArray[i * 3 + 1] = Math.random() * 2;
	positionArray[i * 3 + 2] = (Math.random() - 0.5) * 4;

	scaleArray[i] = Math.random();
}

firefliesGeometry.setAttribute(
	"position",
	new THREE.BufferAttribute(positionArray, 3)
);
firefliesGeometry.setAttribute(
	"aScale",
	new THREE.BufferAttribute(scaleArray, 1)
);

//material
const firefliesMaterial = new THREE.ShaderMaterial({
	uniforms: {
		uTime: { value: 0 },
		uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
		uSize: { value: 250 },
	},
	transparent: true,
	vertexShader: firefliesVertexShader,
	fragmentShader: firefliesFragmentShader,
	blending: THREE.AdditiveBlending,
	depthWrite: false,
});
gui
	.add(firefliesMaterial.uniforms.uSize, "value")
	.min(50)
	.max(300)
	.step(1)
	.name("firefliesSize");

//points
const fireflies = new THREE.Points(firefliesGeometry, firefliesMaterial);
scene.add(fireflies);

/**
 * Fog
 */
// scene.fog = new THREE.FogExp2("#ff0000", 0.1); // Adjust density as needed
// console.log(scene.fog);
function createPortalLabel() {
	const text = "Where does this take me?";

	// Create a temporary canvas context to measure text width
	const tempCanvas = document.createElement("canvas");
	const tempCtx = tempCanvas.getContext("2d");
	tempCtx.font = "28px Times"; // Set font size before measuring
	const textWidth = tempCtx.measureText(text).width;

	// Set canvas width dynamically based on text length (fixed height)
	const padding = 40; // Extra padding for margins
	const canvasWidth = Math.ceil(textWidth) + padding;
	const canvasHeight = 128; // Keep height fixed

	// Create actual canvas with calculated width
	const textCanvas = document.createElement("canvas");
	textCanvas.width = canvasWidth;
	textCanvas.height = canvasHeight;
	const ctx = textCanvas.getContext("2d");

	// Clear the canvas
	ctx.clearRect(0, 0, textCanvas.width, textCanvas.height);

	// Optional background for readability
	ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
	ctx.fillRect(0, 0, textCanvas.width, textCanvas.height);

	// Set font and style
	ctx.fillStyle = "black"; // Text color
	ctx.font = "28px Times"; // Maintain readable size
	ctx.textAlign = "center";
	ctx.textBaseline = "middle";
	ctx.fillText(text, textCanvas.width / 2, textCanvas.height / 2);

	// Create texture
	const texture = new THREE.CanvasTexture(textCanvas);
	texture.needsUpdate = true;

	// Create sprite material
	const material = new THREE.SpriteMaterial({
		map: texture,
		transparent: true,
	});

	// Adjust sprite scale based on new width while keeping height constant
	const scaleX = (canvasWidth / 512) * 0.75; // Adjust scale proportionally
	const sprite = new THREE.Sprite(material);
	sprite.scale.set(scaleX, 0.35, 1);

	return sprite;
}

/**
 * Sizes
 */
const sizes = {
	width: window.innerWidth,
	height: window.innerHeight,
};

/**
 * Cameras
 */
// Perspective Camera (Default)
const perspectiveCamera = new THREE.PerspectiveCamera(
	45,
	sizes.width / sizes.height,
	0.1,
	50
);
perspectiveCamera.position.set(4, 2, 4);

// Orthographic Camera (Alternative)
const aspect = sizes.width / sizes.height;
const orthoSize = 4;
const orthographicCamera = new THREE.OrthographicCamera(
	-orthoSize * aspect,
	orthoSize * aspect,
	orthoSize,
	-orthoSize,
	0.1,
	50
);
orthographicCamera.position.set(4, 2, 4);

scene.add(perspectiveCamera);
scene.add(orthographicCamera);

// First-Person Camera
const firstPersonCamera = new THREE.PerspectiveCamera(
	75,
	sizes.width / sizes.height,
	0.1,
	100
);
firstPersonCamera.position.set(0, 2, 5);

const movementSpeed = 0.1;
const keys = {};

// Listen for keypress events
window.addEventListener("keydown", (event) => (keys[event.code] = true));
window.addEventListener("keyup", (event) => (keys[event.code] = false));

const updateFirstPersonCamera = () => {
	if (activeCamera === firstPersonCamera) {
		if (keys["KeyW"]) firstPersonCamera.position.z -= movementSpeed;
		if (keys["KeyS"]) firstPersonCamera.position.z += movementSpeed;
		if (keys["KeyA"]) firstPersonCamera.position.x -= movementSpeed;
		if (keys["KeyD"]) firstPersonCamera.position.x += movementSpeed;
	}
};

// Add to animation loop
tickFunctions.push(updateFirstPersonCamera);

const cameras = {
	"Perspective Camera": perspectiveCamera,
	"Orthographic Camera": orthographicCamera,
	"First-Person Camera": firstPersonCamera,
};

let activeCamera = perspectiveCamera; // Default camera

const cameraOptions = Object.keys(cameras);
debugObject.activeCamera = cameraOptions[0]; // Default to Perspective Camera

const switchCamera = (cameraName) => {
	activeCamera = cameras[cameraName];

	// Recreate controls for the new camera
	controls.dispose();
	controls = new OrbitControls(activeCamera, canvas);
	controls.enableDamping = true;
};

// GUI Dropdown for Camera Selection
gui
	.add(debugObject, "activeCamera", cameraOptions)
	.name("Camera Type")
	.onChange(switchCamera);

// Misc.
const instructions = gui.addFolder("📌 Notes");
instructions
	.add({ lights: "Use GUI to see lights location" }, "lights")
	.disable();
instructions
	.add(
		{ camera_control: "Click and drag to move the camera." },
		"camera_control"
	)
	.disable();
instructions
	.add(
		{
			camera_type: "Switch between cameras.",
		},
		"camera_type"
	)
	.disable();
instructions
	.add(
		{
			first_person_cam: "move with WASD",
		},
		"first_person_cam"
	)
	.disable();
instructions
	.add(
		{
			portal_shader: "created with perlin noise ",
		},
		"portal_shader"
	)
	.disable();

window.addEventListener("resize", () => {
	// Update sizes
	sizes.width = window.innerWidth;
	sizes.height = window.innerHeight;

	// Update camera
	activeCamera.aspect = sizes.width / sizes.height;
	activeCamera.updateProjectionMatrix();

	// Update renderer
	renderer.setSize(sizes.width, sizes.height);
	renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

	// Update fireflies
	firefliesMaterial.uniforms.uPixelRatio.value = Math.min(
		window.devicePixelRatio,
		2
	);
});

// Controls
const controls = new OrbitControls(activeCamera, canvas);
controls.enableDamping = true;
/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
	canvas: canvas,
	antialias: true,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
	const elapsedTime = clock.getElapsedTime();

	// Update fireflies
	firefliesMaterial.uniforms.uTime.value = elapsedTime;
	portalLightMaterial.uniforms.uTime.value = elapsedTime;

	// Make sure the label always faces the camera
	tickFunctions.forEach((fn) => fn());

	// Update controls
	controls.update();

	// Render
	renderer.render(scene, activeCamera);

	// Call tick again on the next frame
	window.requestAnimationFrame(tick);
};

tick();
