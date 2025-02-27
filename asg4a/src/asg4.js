// Vertex shader program
var VSHADER_SOURCE = `
		precision mediump float;
		attribute vec4 a_Position;
		attribute vec2 a_UV;
		attribute vec3 a_Normal;
		varying vec2 v_UV;
		varying vec3 v_Normal;
		uniform mat4 u_ModelMatrix;
		uniform mat4 u_GlobalRotateMatrix;
		uniform mat4 u_ViewMatrix;
		uniform mat4 u_ProjMatrix;
		

		void main() {
		gl_Position = u_ProjMatrix * u_ViewMatrix * u_GlobalRotateMatrix * u_ModelMatrix * a_Position;
		v_UV = a_UV;
		v_Normal = a_Normal;
	}`;

// Fragment shader program
var FSHADER_SOURCE = `
		precision mediump float;
		varying vec2 v_UV;
		varying vec3 v_Normal;
		uniform vec4 u_FragColor;
		uniform sampler2D u_Sampler0; 
		uniform sampler2D u_Sampler1; 
		uniform int u_whichTexture;
		
		void main() {
			int tex = int(u_whichTexture); // Explicit cast for safety

			if (tex == -3) { // Use normal map
				gl_FragColor = vec4((v_Normal + 1.0) / 2.0, 1.0);
			}
			else if (tex == -2) { // Use solid color
				gl_FragColor = u_FragColor;
			} 
			else if (tex == -1) { // UV debug gradient color
				gl_FragColor = vec4(v_UV, 1.0, 1.0);
			} 
			else if (tex == 0) { // Use texture0 (texture.png)
				gl_FragColor = texture2D(u_Sampler0, v_UV);
			} 
			else if (tex == 1) { // Use texture1 (floor.png)
				gl_FragColor = texture2D(u_Sampler1, v_UV);
			} 
			else { // Error texture (red)
				gl_FragColor = vec4(1, 0.2, 0.2, 1);
			}
		}

	`;

let canvas;
let gl;
let a_Position;
let u_FragColor;
let u_Size;
let g_showNormals = false;

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
	a_UV = gl.getAttribLocation(gl.program, "a_UV");
	a_Normal = gl.getAttribLocation(gl.program, "a_Normal");
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

let keys = {};
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
	document
		.getElementById("angleSlide")
		.addEventListener("mousemove", function () {
			g_globalAngle = this.value;
			renderAllShapes();
		});

	document.getElementById("toggleNormalMode").onclick = function () {
		g_showNormals = !g_showNormals;
		renderAllShapes();
	};
}

// Enable Mouse Look
function enableMouseLook() {
	let isDragging = false;

	canvas.addEventListener("mousedown", (event) => {
		if (event.button === 0) {
			// Left mouse button
			isDragging = true;
		}
	});

	canvas.addEventListener("mousemove", (event) => {
		if (!isDragging) return; // Only rotate if dragging

		const deltaX = event.movementX * g_camera.sensitivity;
		const deltaY = event.movementY * g_camera.sensitivity;

		// Adjust yaw (left/right) and pitch (up/down)
		g_camera.yaw += deltaX;
		g_camera.pitch -= deltaY;
		g_camera.pitch = Math.max(-89, Math.min(89, g_camera.pitch)); // Clamp pitch

		g_camera.updateRotation();
		renderAllShapes();
	});

	canvas.addEventListener("mouseup", () => {
		isDragging = false;
	});

	canvas.addEventListener("mouseleave", () => {
		isDragging = false;
	});
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
var g_seconds = performance.now() / 1000.0 - g_startTime;
function tick() {
	g_seconds = performance.now() / 1000.0 - g_startTime;
	updateAnimationAngles();
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
	image0.src = "texture.png";

	// Load the second texture (floor.png)
	var texture1 = gl.createTexture();
	var image1 = new Image();
	image1.onload = function () {
		loadTexture(gl, texture1, gl.TEXTURE1, u_Sampler1, image1);
	};
	image1.src = "floor.png";

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
			: "Floor texture loaded"
	);
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
// var g_eye = [0, 0, 20]; // Eye position
// var g_at = [0, 0, -100]; // Look-at point
// var g_up = [0, 1, 0]; // Up direction

function renderAllShapes() {
	var start = performance.now();

	var projMatrix = new Matrix4();
	projMatrix.setPerspective(90, (1 * canvas.width) / canvas.height, 0.1, 100);
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

	//draw sky
	var sky = new Cube();
	sky.color = [0.529, 0.808, 0.98, 1.0]; // Light blue color for the sky
	sky.textureNum = 0;
	sky.matrix.setTranslate(-20, -10, -5);
	sky.matrix.rotate(45, 0, 1, 0);
	sky.matrix.scale(30, 30, 30);
	sky.render();

	//draw sphere
	var sphere = new Sphere(20);
	sphere.textureNum = -1;
	sphere.matrix.scale(3, 3, 3);
	sphere.matrix.translate(0, -2, 0);
	sphere.render();
}
