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
const bakedTexture = textureLoader.load("baked2.jpg");
bakedTexture.flipY = false;
bakedTexture.encoding = THREE.sRGBEncoding;
/**
 * Materials
 */
// const bakedMaterial = new THREE.MeshBasicMaterial({ map: bakedTexture });
const bakedMaterial = new THREE.MeshStandardMaterial({
	map: bakedTexture, // Keeps your baked texture
	roughness: 0.8, // Controls surface roughness
	metalness: 0.2, // Adds slight reflectivity
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
const poleLightMaterial = new THREE.MeshBasicMaterial({ color: 0xffffe5 });
/*
 * Load model
 */
gltfLoader.load("portal2.glb", (gltf) => {
	gltf.scene.traverse((child) => {
		child.material = bakedMaterial;
	});
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

	// apply materials
	bakedMesh.material = bakedMaterial;
	poleLightAMesh.material = poleLightMaterial;
	poleLightBMesh.material = poleLightMaterial;
	portalLightMesh.material = portalLightMaterial;
});

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
 * Lights
 */

// Ambient Light (soft overall illumination)
const ambientLight = new THREE.AmbientLight(0xffffff, 2);
scene.add(ambientLight);

// Directional Light (mimics sunlight)
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

// Point Light (localized glow)
const pointLight = new THREE.PointLight(0xffaa00, 2, 20);
pointLight.position.set(0, 3, 3);
scene.add(pointLight);

// Light Helpers (for debugging)
const dirLightHelper = new THREE.DirectionalLightHelper(directionalLight, 1);
scene.add(dirLightHelper);

const pointLightHelper = new THREE.PointLightHelper(pointLight, 0.5);
scene.add(pointLightHelper);

// GUI Controls for Lights
gui
	.add(ambientLight, "intensity")
	.min(0)
	.max(2)
	.step(0.1)
	.name("Ambient Light Intensity");
gui
	.add(directionalLight, "intensity")
	.min(0)
	.max(2)
	.step(0.1)
	.name("Directional Light Intensity");
gui
	.add(pointLight, "intensity")
	.min(0)
	.max(5)
	.step(0.1)
	.name("Point Light Intensity");

/**
 * Sizes
 */
const sizes = {
	width: window.innerWidth,
	height: window.innerHeight,
};

window.addEventListener("resize", () => {
	// Update sizes
	sizes.width = window.innerWidth;
	sizes.height = window.innerHeight;

	// Update camera
	camera.aspect = sizes.width / sizes.height;
	camera.updateProjectionMatrix();

	// Update renderer
	renderer.setSize(sizes.width, sizes.height);
	renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

	// Update fireflies
	firefliesMaterial.uniforms.uPixelRatio.value = Math.min(
		window.devicePixelRatio,
		2
	);
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
	45,
	sizes.width / sizes.height,
	0.1,
	100
);
camera.position.x = 4;
camera.position.y = 2;
camera.position.z = 4;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
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

debugObject.clearColor = "#201919";
renderer.setClearColor(debugObject.clearColor);
gui.addColor(debugObject, "clearColor").onChange(() => {
	renderer.setClearColor(debugObject.clearColor);
});
/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
	const elapsedTime = clock.getElapsedTime();

	// Update fireflies
	firefliesMaterial.uniforms.uTime.value = elapsedTime;

	portalLightMaterial.uniforms.uTime.value = elapsedTime;

	// Update controls
	controls.update();

	// Render
	renderer.render(scene, camera);

	// Call tick again on the next frame
	window.requestAnimationFrame(tick);
};

tick();
