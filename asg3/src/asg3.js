// Vertex shader program
var VSHADER_SOURCE = `
		attribute vec4 a_Position;
		attribute vec2 a_TexCoord;
		uniform mat4 u_ModelMatrix;
		uniform mat4 u_GlobalRotateMatrix;
		uniform mat4 u_ViewMatrix;
		uniform mat4 u_ProjMatrix;
		varying vec2 v_TexCoord;
		void main() {
		gl_Position = u_ProjMatrix * u_ViewMatrix * u_GlobalRotateMatrix * u_ModelMatrix * a_Position;
		v_TexCoord = a_TexCoord;
	}`;

// Fragment shader program
var FSHADER_SOURCE = `
	precision mediump float;
	varying vec2 v_TexCoord;
	uniform vec4 u_FragColor;
	uniform sampler2D u_Sampler0; 
	uniform sampler2D u_Sampler1; 
	uniform int u_whichTexture;
	
	void main() {
		int tex = int(u_whichTexture); // Explicit cast for safety

		if (tex == -2) { // Use solid color
			gl_FragColor = u_FragColor;
		} 
		else if (tex == -1) { // UV debug gradient color
			gl_FragColor = vec4(v_TexCoord, 1.0, 1.0);
		} 
		else if (tex == 0) { // Use texture0 
			gl_FragColor = texture2D(u_Sampler0, v_TexCoord);
		} 
		else if (tex == 1) { // Use texture1 (grass.png)
			gl_FragColor = texture2D(u_Sampler1, v_TexCoord);
		} 
		
		else { // Error texture (red)
			gl_FragColor = vec4(1, 0.2, 0.2, 1);
		}
	}
`;

let lastFrameTime = performance.now();
let fps = 0;

function updateFPS() {
	let now = performance.now();
	let delta = now - lastFrameTime;
	lastFrameTime = now;
	fps = 1000 / delta;

	document.getElementById("fpsCounter").innerText = `FPS: ${fps.toFixed(2)}`;
}

let canvas;
let gl;
let a_Position;
let u_FragColor;
let u_Size;

function setupWebGL() {
	// Retrieve <canvas> element
	canvas = document.getElementById("webgl");

	// Get the rendering context for WebGL
	gl =
		canvas.getContext("webgl", { preserveDrawingBuffer: true }) ||
		canvas.getContext("experimental-webgl", { preserveDrawingBuffer: true });

	if (!gl) {
		console.log("Failed to get the rendering context for WebGL");
		return;
	}
	gl.enable(gl.DEPTH_TEST);
}

function connectVariablesToGLSL() {
	if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
		console.log("Failed to initialize shaders.");
		return;
	}

	a_Position = gl.getAttribLocation(gl.program, "a_Position");
	a_TexCoord = gl.getAttribLocation(gl.program, "a_TexCoord");
	u_ModelMatrix = gl.getUniformLocation(gl.program, "u_ModelMatrix");
	u_GlobalRotateMatrix = gl.getUniformLocation(
		gl.program,
		"u_GlobalRotateMatrix"
	);
	u_FragColor = gl.getUniformLocation(gl.program, "u_FragColor");

	u_Sampler0 = gl.getUniformLocation(gl.program, "u_Sampler0");
	u_Sampler1 = gl.getUniformLocation(gl.program, "u_Sampler1");
	u_whichTexture = gl.getUniformLocation(gl.program, "u_whichTexture");
	u_ViewMatrix = gl.getUniformLocation(gl.program, "u_ViewMatrix");
	u_ProjMatrix = gl.getUniformLocation(gl.program, "u_ProjMatrix");
	gl.uniformMatrix4fv(u_ModelMatrix, false, new Matrix4().elements);
}

const POINT = 0;
const TRIANGLE = 1;
const CIRCLE = 2;

let g_selectedColor = [1.0, 1.0, 1.0, 1.0];
let g_selectedSize = 5;
let g_selectedType = POINT;
let g_selectedSegments = 10;
let g_globalAngle = 0;
let g_yellowAngle = 0;
let g_magentaAngle = 0;
let g_yellowAnimation = false;
let g_magentaAnimation = false;
//set up actions for html ui elements
function addActionsForHtmlUI() {
	//button events

	//Size slider events
	document
		.getElementById("angleSlide")
		.addEventListener("mousemove", function () {
			g_globalAngle = this.value;
			renderAllShapes();
		});
}
let keys = {};

// Enable Mouse Look
function enableMouseLook() {
	canvas.addEventListener("mousemove", onMouseMove);
	canvas.addEventListener("mousedown", () => canvas.requestPointerLock());
	document.addEventListener("pointerlockchange", lockChange);
}

// Handle Pointer Lock
function lockChange() {
	if (document.pointerLockElement !== canvas) {
		lastMouseX = null;
		lastMouseY = null;
	}
}

// Handle Mouse Movement
function onMouseMove(event) {
	if (document.pointerLockElement !== canvas) return;

	const deltaX = event.movementX * g_camera.sensitivity;
	const deltaY = event.movementY * g_camera.sensitivity;

	// Adjust yaw (left/right) and pitch (up/down)
	g_camera.yaw += deltaX;
	g_camera.pitch -= deltaY;
	g_camera.pitch = Math.max(-89, Math.min(89, g_camera.pitch)); // Clamp pitch

	g_camera.updateRotation();
	renderAllShapes();
}

// Handle Key Press
function keydown(event) {
	keys[event.key] = true;
}

// Handle Key Release
function keyup(event) {
	keys[event.key] = false;
}

// Update Camera Movement Each Frame
function updateCameraMovement() {
	if (keys["w"]) g_camera.forward();
	if (keys["s"]) g_camera.back();
	if (keys["a"]) g_camera.left();
	if (keys["d"]) g_camera.right();
	if (keys["q"]) g_camera.turnLeft();
	if (keys["e"]) g_camera.turnRight();

	renderAllShapes();
}
function main() {
	setupWebGL();
	connectVariablesToGLSL();
	addActionsForHtmlUI();

	enableMouseLook(); // Add mouse movement tracking

	document.onkeydown = keydown;

	g_camera = new Camera();

	gl.enable(gl.BLEND);
	gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

	// Specify the color for clearing <canvas>
	gl.clearColor(0.0, 0.0, 0.0, 1.0);

	initTextures();

	renderAllShapes();
	requestAnimationFrame(tick);
}

var g_startTime = performance.now() / 1000.0;

function tick() {
	g_seconds = performance.now() / 1000.0 - g_startTime;
	updateAnimationAngles();
	updateFPS(); // Update FPS counter
	renderAllShapes();
	requestAnimationFrame(tick);
}

function updateAnimationAngles() {
	if (g_yellowAnimation) {
		g_yellowAngle = 45 * Math.sin(g_seconds);
	}
	if (g_magentaAnimation) {
		g_magentaAngle = 45 * Math.sin(3 * g_seconds);
	}
}

function initTextures() {
	// Load the first texture (texture.png)
	var texture0 = gl.createTexture();
	var image0 = new Image();
	image0.onload = function () {
		loadTexture(gl, texture0, gl.TEXTURE0, u_Sampler0, image0);
	};
	image0.src = "sky.png";

	// Load the second texture (floor.png)
	var texture1 = gl.createTexture();
	var image1 = new Image();
	image1.onload = function () {
		loadTexture(gl, texture1, gl.TEXTURE1, u_Sampler1, image1);
	};
	image1.src = "grass.png";

	return true;
}

function loadTexture(gl, texture, activeTexture, u_Sampler, image) {
	gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); // Flip the image's y-axis
	gl.activeTexture(activeTexture); // Select the correct texture unit
	gl.bindTexture(gl.TEXTURE_2D, texture); // Bind the texture object

	// Set texture parameters
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);

	// Assign texture to the correct sampler
	gl.uniform1i(u_Sampler, activeTexture === gl.TEXTURE0 ? 0 : 1);

	console.log(
		activeTexture === gl.TEXTURE0
			? "Main texture loaded"
			: "Grass texture loaded"
	);
}
var MAP_SIZE = 32; // Set map size to 64x64

var g_map = Array(MAP_SIZE)
	.fill(0)
	.map(() => Array(MAP_SIZE).fill(0));

function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

var MAP_SIZE = 64; // Set map size to 64x64

var g_map = Array(MAP_SIZE)
	.fill(0)
	.map(() => Array(MAP_SIZE).fill(0));

function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

var noise = new SimplexNoise();
console.log(noise.noise2D(0.5, 0.5));
var MAP_SIZE = 64;
var g_map = Array(MAP_SIZE)
	.fill(0)
	.map(() => Array(MAP_SIZE).fill(0));

// Ensure every block is filled with at least one grass block
for (let i = 0; i < MAP_SIZE; i++) {
	for (let j = 0; j < MAP_SIZE; j++) {
		// Generate terrain height using Perlin noise and sine waves
		let height = Math.floor(
			1 + // Minimum height of 1
				2 * Math.sin(i / 8) * Math.cos(j / 8) + // Rolling hills
				3 * noise.noise2D(i / 15, j / 15) // Random terrain bumps
		);

		g_map[i][j] = Math.max(1, height); // Ensure minimum height is 1
	}
}

var mapWidth = g_map[0].length;
var mapHeight = g_map.length;
function drawMap() {
	// Draw a solid base layer at height 0
	for (let i = 0; i < MAP_SIZE; i++) {
		for (let j = 0; j < MAP_SIZE; j++) {
			let block = new Cube();
			block.color = [0.0, 1.0, 0.0, 1.0]; // Green base layer
			block.textureNum = 1; // Grass texture
			block.matrix.setTranslate(j - MAP_SIZE / 2, -0.5, i - MAP_SIZE / 2); // Ensure the base is at height 0
			block.render();
		}
	}

	// Render the terrain blocks on top
	for (let i = 0; i < MAP_SIZE; i++) {
		for (let j = 0; j < MAP_SIZE; j++) {
			let height = g_map[i][j];

			for (let h = 0; h < height; h++) {
				let block = new Cube();
				block.color = [0.0, 1.0, 0.0, 1.0]; // Green terrain
				block.textureNum = 1; // Grass texture
				block.matrix.setTranslate(j - MAP_SIZE / 2, h, i - MAP_SIZE / 2);
				block.render();
			}
		}
	}
}

function keydown(ev) {
	if (ev.keyCode === 87) {
		// 'W' key - Move Forward
		g_camera.forward();
	} else if (ev.keyCode === 83) {
		// 'S' key - Move Backward
		g_camera.back();
	} else if (ev.keyCode === 65) {
		// 'A' key - Move Left
		g_camera.left();
	} else if (ev.keyCode === 68) {
		// 'D' key - Move Right
		g_camera.right();
	}
	renderAllShapes(); // Re-render scene after moving camera
}
var g_eye = [0, 0, 3]; // Eye position
var g_at = [0, 0, -100]; // Look-at point
var g_up = [0, 1, 0]; // Up direction

function renderAllShapes() {
	var start = performance.now();

	var projMatrix = new Matrix4();
	projMatrix.setPerspective(50, (1 * canvas.width) / canvas.height, 0.1, 500);
	gl.uniformMatrix4fv(u_ProjMatrix, false, projMatrix.elements);

	var viewMatrix = new Matrix4();
	viewMatrix.setLookAt(
		g_camera.eye.elements[0],
		g_camera.eye.elements[1],
		g_camera.eye.elements[2],
		g_camera.at.elements[0],
		g_camera.at.elements[1],
		g_camera.at.elements[2],
		g_camera.up.elements[0],
		g_camera.up.elements[1],
		g_camera.up.elements[2]
	);

	gl.uniformMatrix4fv(u_ViewMatrix, false, viewMatrix.elements);

	// pass matrix to u_ModelMatrix attribute
	var globalRotMat = new Matrix4().rotate(g_globalAngle, 0, 1, 0);
	gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements);

	// Clear <canvas>
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	drawMap();

	//draw floor
	var floor = new Cube();
	floor.color = [0.58, 0.812, 0.494, 1.0]; // Green floor
	floor.textureNum = -2;
	floor.matrix.setTranslate(0, -0.5, 0); // Align floor with walls
	floor.matrix.scale(mapWidth, 0, mapHeight); // Scale to match walls
	floor.matrix.translate(-0.5, 0, -0.5); // Center correctly
	floor.render();

	//draw sky
	var sky = new Cube();
	sky.color = [0.529, 0.808, 0.98, 1.0]; // Light blue color for the sky
	sky.textureNum = 0; // Use solid color
	sky.matrix.translate(-300, -300, -300);
	sky.matrix.scale(600, 600, 600);
	sky.render();
}
