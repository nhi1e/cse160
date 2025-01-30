// Vertex shader program
var VSHADER_SOURCE = `
  attribute vec4 a_Position;
  uniform mat4 u_ModelMatrix;
  uniform mat4 u_GlobalRotateMatrix;
  void main() {
    gl_Position = u_GlobalRotateMatrix * u_ModelMatrix * a_Position;
  }`;

// Fragment shader program
var FSHADER_SOURCE = `
  precision mediump float;
  uniform vec4 u_FragColor; 
  void main() {
    gl_FragColor = u_FragColor;
  }`;

let canvas;
let gl;
let a_Position;
let u_FragColor;
let u_Size;

function setupWebGL() {
	// Retrieve <canvas> element
	canvas = document.getElementById("webgl");

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
	// Initialize shaders
	if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
		console.log("Failed to intialize shaders.");
		return;
	}

	// Get the storage location of a_Position
	a_Position = gl.getAttribLocation(gl.program, "a_Position");
	if (a_Position < 0) {
		console.log("Failed to get the storage location of a_Position");
		return;
	}

	// Get the storage location of u_FragColor
	u_FragColor = gl.getUniformLocation(gl.program, "u_FragColor");
	if (!u_FragColor) {
		console.log("Failed to get the storage location of u_FragColor");
		return;
	}

	// Get the storage location of u_ModelMatrix
	u_ModelMatrix = gl.getUniformLocation(gl.program, "u_ModelMatrix");
	if (!u_ModelMatrix) {
		console.log("Failed to get the storage location of u_ModelMatrix");
		return;
	}

	// Get the storage location of u_GlobalRotateMatrix
	u_GlobalRotateMatrix = gl.getUniformLocation(
		gl.program,
		"u_GlobalRotateMatrix"
	);
	if (!u_GlobalRotateMatrix) {
		console.log("Failed to get the storage location of u_GlobalRotateMatrix");
		return;
	}

	var identityM = new Matrix4();
	gl.uniformMatrix4fv(u_ModelMatrix, false, identityM.elements);
}

const POINT = 0;
const TRIANGLE = 1;
const CIRCLE = 2;

let g_selectedColor = [1.0, 1.0, 1.0, 1.0];
let g_selectedSize = 5;
let g_selectedType = POINT;
let g_selectedSegments = 10;
let g_globalAngle = 0;
let g_tailAngleX = 0;
let g_tailAngleZ = 0;
let g_legAngle = 0;

//set up actions for html ui elements
function addActionsForHtmlUI() {
	// document.getElementById("TailAnimationOnButton").onclick = function () {
	// 	g_tailAnimation = true;
	// };
	// document.getElementById("TailAnimationOffButton").onclick = function () {
	// 	g_tailAnimation = false;
	// };
	document.getElementById("DragonAnimationOnButton").onclick = function () {
		g_dragonAnimation = true;
	};
	document.getElementById("DragonAnimationOffButton").onclick = function () {
		g_dragonAnimation = false;
	};

	//Size slider events
	// Camera slider events
	document
		.getElementById("cameraXSlide")
		.addEventListener("input", function () {
			cameraAngleX = this.value;
			renderAllShapes();
		});

	document
		.getElementById("cameraYSlide")
		.addEventListener("input", function () {
			cameraAngleY = this.value;
			renderAllShapes();
		});
}
//camera angle
// Global variables for mouse drag and camera angles
let isDragging = false;
let lastMouseX = 0;
let lastMouseY = 0;
let cameraAngleX = 0; // Rotation around the X-axis
let cameraAngleY = 0; // Rotation around the Y-axis

function addMouseDragControls() {
	canvas.addEventListener("mousedown", (event) => {
		isDragging = true;
		lastMouseX = event.clientX;
		lastMouseY = event.clientY;
	});

	canvas.addEventListener("mousemove", (event) => {
		if (isDragging) {
			// Calculate mouse movement
			const deltaX = event.clientX - lastMouseX;
			const deltaY = event.clientY - lastMouseY;

			// Update camera angles
			cameraAngleX -= deltaY * 0.5; // Adjust sensitivity as needed
			cameraAngleY -= deltaX * 0.5;

			// Clamp the X-axis rotation to prevent flipping
			cameraAngleX = Math.max(-90, Math.min(90, cameraAngleX));

			lastMouseX = event.clientX;
			lastMouseY = event.clientY;

			renderAllShapes();
		}
	});

	canvas.addEventListener("mouseup", () => {
		isDragging = false;
	});

	canvas.addEventListener("mouseleave", () => {
		isDragging = false;
	});
}
function main() {
	setupWebGL();
	connectVariablesToGLSL();
	addActionsForHtmlUI();
	addMouseDragControls(); // Enable mouse drag for camera

	gl.enable(gl.BLEND);
	gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

	// Specify the color for clearing <canvas>
	// gl.clearColor(0.396, 0.18, 0.216, 1.0);
	// gl.clearColor(0, 0, 0, 1.0);
	gl.clearColor(0.58, 0.66, 0.69, 1.0);

	// // Clear <canvas>
	renderAllShapes();
	requestAnimationFrame(tick);
}

//ANIMATION---------------------------------------------------
var g_startTime = performance.now() / 1000.0;
var g_seconds = performance.now() / 1000.0 - g_startTime;
function tick() {
	g_seconds = performance.now() / 1000.0 - g_startTime;
	updateAnimationAngles();
	renderAllShapes();
	requestAnimationFrame(tick);
}

// Tail animation
// let g_tailAnimation = false;
let g_tailAngle = 0;
let g_neckAngle = 0;
let g_bodyAngle = 0;
let g_mouthAngle = 0;

let g_dragonAnimation = false; // Toggle for dragon animation
let g_dragonFloatOffset = 0; // Global offset for floating animation

function updateAnimationAngles() {
	if (g_dragonAnimation) {
		// Use a single sine wave for smoother motion
		g_dragonFloatOffset = 0.1 * Math.sin(g_seconds);
		// // Tail follows the dragon's motion with a phase shift
		// g_tailAngle = -6 * Math.cos(g_seconds + Math.PI / 4);

		// Tail rotation along both X and Z axes for a more dynamic effect
		g_tailAngleX = 5 * Math.sin(g_seconds * 2); // Rotate along X-axis
		g_tailAngleZ = -6 * Math.cos(g_seconds + Math.PI / 4); // Rotate along Z-axis

		// Neck rotation: Smooth oscillating rotation
		g_neckAngle = 10 * Math.sin(g_seconds); // Adjust amplitude (10) as needed
		// Body rotation:
		g_bodyAngle = 5 * Math.sin(g_seconds); // Adjust amplitude (5) as needed
		// Mouth angle:
		g_mouthAngle = 15 * Math.abs(Math.sin(g_seconds * 2)); // Always negative

		g_legAngle = g_bodyAngle * 2; // Amplify a bit for natural effect
	}
}

function renderAllShapes() {
	// // pass matrix to u_ModelMatrix attribute
	// var globalRotMat = new Matrix4().rotate(g_globalAngle, 0, 1, 0);
	// gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements);

	// Clear <canvas>
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	// Create a combined rotation matrix based on camera angles
	const globalRotMat = new Matrix4()
		.rotate(cameraAngleX, 1, 0, 0) // Rotate around X-axis
		.rotate(cameraAngleY, 0, 1, 0); // Rotate around Y-axis

	// Pass the combined rotation matrix to the shader
	gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements);

	// Apply a global floating transformation to the entire dragon
	const dragonTransform = new Matrix4();
	dragonTransform.translate(0, g_dragonFloatOffset, 0); // Move up and down

	//BODY
	//rotate: angle, x, y, z
	//rotate z is away from face
	//rotate y is left and right

	var neck1 = new Cube();
	neck1.color = [0.58, 0.0, 0.06, 1.0];
	neck1.matrix = new Matrix4(dragonTransform); // Apply floating motion
	neck1.matrix.translate(-0.6, -0.1, 0.0);
	neck1.matrix.rotate(-50, 1, -5, 0);
	neck1.matrix.scale(0.13, 0.13, 0.13);
	neck1.render();

	var neck2 = new Cube();
	neck2.color = [0.58, 0.0, 0.06, 1.0];
	neck2.matrix = new Matrix4(neck1.matrix);
	neck2.matrix.translate(-0.05, -0.9, 0.4);
	neck2.matrix.rotate(25, -0.8, 0, 0);
	neck2.matrix.scale(1.1, 1.1, 1.1);
	neck2.render();

	var belly1 = new Cube();
	belly1.color = [0.58, 0.0, 0.06, 1.0];
	belly1.matrix = new Matrix4(neck2.matrix);
	belly1.matrix.translate(-0.05, -0.9, 0.41);
	belly1.matrix.rotate(25 + g_bodyAngle, -0.6, 0, 0);
	belly1.matrix.scale(1.1, 1.1, 1.1);
	belly1.render();

	var belly2 = new Cube();
	belly2.color = [0.58, 0.0, 0.06, 1.0];
	belly2.matrix = new Matrix4(belly1.matrix);
	belly2.matrix.translate(-0.05, -0.9, 0.41);
	belly2.matrix.rotate(25 + g_bodyAngle * 0.8, -0.6, 0, 0);
	belly2.matrix.scale(1.1, 1.1, 1.1);
	belly2.render();

	var belly3 = new Cube();
	belly3.color = [0.58, 0.0, 0.06, 1.0];
	belly3.matrix = new Matrix4(belly2.matrix);
	belly3.matrix.translate(0, -0.9, 0.4);
	belly3.matrix.rotate(25 + g_bodyAngle * 0.6, -1, 0, 0);
	belly3.render();

	var belly4 = new Cube();
	belly4.color = [0.58, 0.0, 0.06, 1.0];
	belly4.matrix = new Matrix4(belly3.matrix);
	belly4.matrix.translate(0, -0.9, 0.4);
	belly4.matrix.rotate(25 + g_tailAngle, -1, 0, 0);
	belly4.render();

	var belly5 = new Cube();
	belly5.color = [0.58, 0.0, 0.06, 1.0];
	belly5.matrix = new Matrix4(belly4.matrix);
	belly5.matrix.translate(0.07, -0.6, -0.14);
	belly5.matrix.rotate(17, 1.3, 0, 0);
	belly5.matrix.scale(0.9, 0.9, 0.9);
	belly5.render();

	var belly6 = new Cube();
	belly6.color = [0.58, 0.0, 0.06, 1.0];
	belly6.matrix = new Matrix4(belly5.matrix);
	belly6.matrix.translate(0.07, -0.5, -0.14);
	belly6.matrix.rotate(20 + g_tailAngleX * 0.8, 1.3, 0, 0);
	belly6.matrix.scale(0.9, 0.9, 0.9);
	belly6.render();

	var belly7 = new Cube();
	belly7.color = [0.58, 0.0, 0.06, 1.0];
	belly7.matrix = new Matrix4(belly6.matrix);
	belly7.matrix.translate(0.07, -0.35, -0.2);
	belly7.matrix.rotate(30 + g_tailAngleX * 0.7, 1.3, 0, 0);
	belly7.matrix.rotate(g_tailAngleZ * 0.2, 0, 0, 2); // Rotate gradually along Z-axis
	belly7.matrix.scale(0.9, 0.9, 0.9);
	belly7.render();

	//tail
	var tail1 = new Cube();
	tail1.color = [0.58, 0.0, 0.06, 1.0];
	tail1.matrix = new Matrix4(belly7.matrix);
	tail1.matrix.translate(0.07, -0.29, -0.19);
	tail1.matrix.rotate(34 + g_tailAngleX * 0.6, 1.3, 0, 0); // Apply g_tailAngle
	tail1.matrix.rotate(g_tailAngleZ, 0, 0, 2); // Rotate gradually along Z-axis
	tail1.matrix.scale(0.9, 0.9, 0.9);
	tail1.render();

	var tail2 = new Cube();
	tail2.color = [0.58, 0.0, 0.06, 1.0];
	tail2.matrix = new Matrix4(tail1.matrix);
	tail2.matrix.translate(0.03, -0.4, -0.1);
	tail2.matrix.rotate(20 + g_tailAngleX * 0.5, 1.3, 0, 0);
	tail2.matrix.rotate(g_tailAngleZ * 0.8, 0, 0, 2); // Rotate gradually along Z-axis
	tail2.matrix.scale(0.9, 0.9, 0.9);
	tail2.render();

	var tail3 = new Cube();
	tail3.color = [0.58, 0.0, 0.06, 1.0];
	tail3.matrix = new Matrix4(tail2.matrix);
	tail3.matrix.translate(0.03, -0.4, -0.1);
	tail3.matrix.rotate(15 + g_tailAngleX * 0.5, 1.3, 0, 0);
	tail3.matrix.rotate(g_tailAngleZ * 0.7, 0, 0, 2); // Rotate gradually along Z-axis
	tail3.matrix.scale(0.9, 0.9, 0.9);
	tail3.render();

	var tail4 = new Cube();
	tail4.color = [0.58, 0.0, 0.06, 1.0];
	tail4.matrix = new Matrix4(tail3.matrix);
	tail4.matrix.translate(0.03, -0.8, 0.18);
	tail4.matrix.rotate(10 + g_tailAngleX * 0.45, -1.3, 0, 0);
	tail4.matrix.rotate(g_tailAngleZ * 0.7, 0, 0, 2); // Rotate gradually along Z-axis
	tail4.matrix.scale(0.9, 0.9, 0.9);
	tail4.render();

	var tail5 = new Cube();
	tail5.color = [0.58, 0.0, 0.06, 1.0];
	tail5.matrix = new Matrix4(tail4.matrix);
	tail5.matrix.translate(0.03, -0.8, 0.18);
	tail5.matrix.rotate(10 + g_tailAngleX * 0.4, -1.3, 0, 0);
	tail5.matrix.rotate(g_tailAngleZ * 0.6, 0, 0, 2); // Rotate gradually along Z-axis
	tail5.matrix.scale(0.9, 0.9, 0.9);
	tail5.render();

	var tail6 = new Cube();
	tail6.color = [0.58, 0.0, 0.06, 1.0];
	tail6.matrix = new Matrix4(tail5.matrix);
	tail6.matrix.translate(0.03, -0.8, 0.18);
	tail6.matrix.rotate(10 + g_tailAngleX * 0.35, -1.3, 0, 0);
	tail6.matrix.rotate(g_tailAngleZ * 0.45, 0, 0, 2); // Rotate gradually along Z-axis
	tail6.matrix.scale(0.9, 0.9, 0.9);
	tail6.render();

	var tail7 = new Cube();
	tail7.color = [0.58, 0.0, 0.06, 1.0];
	tail7.matrix = new Matrix4(tail6.matrix);
	tail7.matrix.translate(0.03, -0.8, 0.3);
	tail7.matrix.rotate(20 + g_tailAngleX * 0.3, -1.3, 0, 0);
	tail7.matrix.rotate(g_tailAngleZ * 0.35, 0, 0, 2); // Rotate gradually along Z-axis
	tail7.matrix.scale(0.9, 0.9, 0.9);
	tail7.render();

	var tail8 = new Cube();
	tail8.color = [0.58, 0.0, 0.06, 1.0];
	tail8.matrix = new Matrix4(tail7.matrix);
	tail8.matrix.translate(0.03, -0.8, 0.3);
	tail8.matrix.rotate(20 + g_tailAngleX * 0.25, -1.3, 0, 0);
	tail8.matrix.rotate(g_tailAngleZ * 0.3, 0, 0, 2); // Rotate gradually along Z-axis
	tail8.matrix.scale(0.9, 0.9, 0.9);
	tail8.render();

	var tail9 = new Cube();
	tail9.color = [0.58, 0.0, 0.06, 1.0];
	tail9.matrix = new Matrix4(tail8.matrix);
	tail9.matrix.translate(0.03, -0.8, 0.3);
	tail9.matrix.rotate(20 + g_tailAngleX * 0.2, -1.3, 0, 0);
	tail9.matrix.rotate(g_tailAngleZ * 0.2, 0, 0, 2); // Rotate gradually along Z-axis
	tail9.matrix.scale(0.9, 0.9, 0.9);
	tail9.render();

	var tail10 = new Cube();
	tail10.color = [0.58, 0.0, 0.06, 1.0];
	tail10.matrix = new Matrix4(tail9.matrix);
	tail10.matrix.translate(0.03, -0.8, 0.3);
	tail10.matrix.rotate(20 + g_tailAngleX * 0.15, -1.3, 0, 0);
	tail10.matrix.scale(0.9, 0.9, 0.9);
	tail10.render();

	var tail11 = new Cube();
	tail11.color = [0.58, 0.0, 0.06, 1.0];
	tail11.matrix = new Matrix4(tail10.matrix);
	tail11.matrix.translate(0.03, -0.8, 0.3);
	tail11.matrix.rotate(20 + g_tailAngleX * 0.1, -1.3, 0, 0);
	tail11.matrix.scale(0.9, 0.9, 0.9);
	tail11.render();

	var tail12 = new Cube();
	tail12.color = [0.58, 0.0, 0.06, 1.0];
	tail12.matrix = new Matrix4(tail11.matrix);
	tail12.matrix.translate(0.03, -1, 0.5);
	tail12.matrix.rotate(20, -1.3, 0, 0);
	tail12.matrix.scale(0.9, 1.3, 0.9);
	tail12.render();

	//tailtip
	//scaling:
	//smaller z = thinner
	//bigger y = taller triangle
	var tailtip1 = new TrianglePrism();
	tailtip1.color = [0.05, 0.25, 0.05, 1];
	tailtip1.matrix = new Matrix4(tail12.matrix);
	tailtip1.matrix.translate(0.9, 0, 0.6);
	tailtip1.matrix.rotate(180, 0, 0, 1);
	tailtip1.matrix.scale(1, 3, 0.1);
	tailtip1.render();

	var tailtip2 = new TrianglePrism();
	tailtip2.color = [0.05, 0.25, 0.05, 1];
	tailtip2.matrix = new Matrix4(tailtip1.matrix);
	tailtip2.matrix.translate(0.6, 0.5, 0.1);
	tailtip2.matrix.scale(0.6, 0.6, 1);
	tailtip2.matrix.rotate(50, 0, 0, -1);
	tailtip2.render();

	var tailtip3 = new TrianglePrism();
	tailtip3.color = [0.05, 0.25, 0.05, 1];
	tailtip3.matrix = new Matrix4(tailtip1.matrix);
	tailtip3.matrix.scale(0.6, 0.6, 1);
	tailtip3.matrix.rotate(50, 0, 0, 1);
	tailtip3.render();

	var tailtip4 = new TrianglePrism();
	tailtip4.color = [0.05, 0.25, 0.05, 1];
	tailtip4.matrix = new Matrix4(tailtip1.matrix);
	tailtip4.matrix.translate(-0.06, 0, 0);
	tailtip4.matrix.scale(0.7, 0.5, 1);
	tailtip4.matrix.rotate(60, 0, 0, 1);
	tailtip4.render();

	var tailtip5 = new TrianglePrism();
	tailtip5.color = [0.05, 0.25, 0.05, 1];
	tailtip5.matrix = new Matrix4(tailtip1.matrix);
	tailtip5.matrix.translate(0.68, 0.4, 0);
	tailtip5.matrix.scale(0.7, 0.5, 1);
	tailtip5.matrix.rotate(60, 0, 0, -1);
	tailtip5.render();

	//upper neck

	var neck4 = new Cube();
	neck4.color = [0.58, 0.0, 0.06, 1.0];
	neck4.matrix = new Matrix4(neck1.matrix);
	neck4.matrix.translate(0.05, 1, 0.06);
	neck4.matrix.rotate(g_neckAngle, 0, 1, 0.7); // Apply neck rotation
	neck4.matrix.scale(0.9, 0.9, 0.9);
	neck4.render();

	var neck5 = new Cube();
	neck5.color = [0.58, 0.0, 0.06, 1.0];
	neck5.matrix = new Matrix4(neck4.matrix);
	neck5.matrix.translate(0.04, 1, 0.08);
	// neck5.matrix.rotate(20, 0, g_neckAngle * 0.8, 0); // Smaller rotation for gradual motion
	neck5.matrix.rotate(g_neckAngle * 0.8, 0, 1, 0.7); // Apply neck rotation
	neck5.matrix.scale(0.95, 0.95, 0.95);
	neck5.matrix.rotate(20, 0.6, 0, 0);
	neck5.render();

	var neck6 = new Cube();
	neck6.color = [0.58, 0.0, 0.06, 1.0];
	neck6.matrix = new Matrix4(neck5.matrix);
	neck6.matrix.translate(0.02, 1, 0.08);
	neck6.matrix.rotate(g_neckAngle * 0.6, 0, 1, 0.7); // Apply neck rotation
	// neck6.matrix.rotate(13, 0.6, 0, 0);
	neck6.matrix.scale(0.95, 0.95, 0.95);
	neck6.render();

	var neck7 = new Cube();
	neck7.color = [0.58, 0.0, 0.06, 1.0];
	neck7.matrix = new Matrix4(neck6.matrix);
	neck7.matrix.translate(0, 0.55, 0.1);
	neck7.matrix.rotate(-25, 0.6, 0, 0);
	neck7.render();

	var neck8 = new Cube();
	neck8.color = [0.58, 0.0, 0.06, 1.0];
	neck8.matrix = new Matrix4(neck7.matrix);
	neck8.matrix.translate(0, 0.5, 0.1);
	neck8.matrix.rotate(-30, 0.6, 0, 0);
	neck8.render();

	var neck10 = new Cube();
	neck10.color = [0.58, 0.0, 0.06, 1.0];
	neck10.matrix = new Matrix4(neck8.matrix);
	neck10.matrix.translate(0, 0.65, 0.08);
	neck10.matrix.rotate(-20, 0.6, 0, 0);
	neck10.render();

	// Head
	var head1 = new Cube();
	head1.color = [0.58, 0.0, 0.06, 1.0];
	head1.matrix = new Matrix4(neck10.matrix);
	head1.matrix.translate(0, 1.4, -0.4);
	head1.matrix.rotate(60, 1, 0, 0);
	head1.matrix.scale(1, 1, 1.1);
	head1.render();

	var head2 = new Cube();
	head2.color = [0.58, 0.0, 0.06, 1.0];
	head2.matrix = new Matrix4(head1.matrix);
	head2.matrix.translate(0, -0.4, -0.25);
	head2.matrix.rotate(-30, 1, 0, 0);
	head2.matrix.scale(1, 1.1, 1.1);
	head2.render();

	var nose1 = new TrianglePrism();
	nose1.color = [0.58, 0.0, 0.06, 1.0];
	nose1.matrix = new Matrix4(head2.matrix);
	nose1.matrix.translate(0, 0.8, 0.16);
	nose1.matrix.rotate(270, 1, 0, 0);
	nose1.matrix.rotate(90, 0, 1, 0);
	nose1.matrix.scale(0.87, 1.15, 1);
	nose1.render();

	var nose2 = new Cube();
	nose2.color = [0.58, 0.0, 0.06, 1.0];
	nose2.matrix = new Matrix4(head2.matrix);
	nose2.matrix.translate(0, 0, -1);
	nose2.matrix.scale(1, 0.4, 1);
	nose2.render();

	var mouth1 = new Cube();
	mouth1.color = [0.58, 0.0, 0.06, 1.0];
	mouth1.matrix = new Matrix4(nose2.matrix);
	mouth1.matrix.translate(0, -0.17, 0.2);
	mouth1.matrix.rotate(30, 1, 0, 0); // Rotate around the x-axis
	mouth1.matrix.scale(0.9, 1, 1);
	mouth1.render();

	var horn1 = new Cube();
	horn1.uniformFaceColor = true;
	horn1.color = [0.94, 0.79, 0.28, 1.0];
	horn1.matrix = new Matrix4(head2.matrix);
	horn1.matrix.translate(0.7, 1, 0.3);
	horn1.matrix.rotate(65, 1, 0, 0);
	horn1.matrix.scale(0.13, 1, 0.13);
	horn1.render();

	var horn2 = new Cube();
	horn2.uniformFaceColor = true;
	horn2.color = [0.94, 0.79, 0.28, 1.0];
	horn2.matrix = new Matrix4(horn1.matrix);
	horn2.matrix.translate(0.4, 0.9, 0.3);
	horn2.matrix.rotate(30, 1, 0, 0);
	horn2.matrix.scale(1, 1, 1);
	horn2.render();

	var horn3 = new Cube();
	horn3.uniformFaceColor = true;
	horn3.color = [0.94, 0.79, 0.28, 1.0];
	horn3.matrix = new Matrix4(horn1.matrix);
	horn3.matrix.translate(-4, 0, 0);
	horn3.render();

	var horn4 = new Cube();
	horn4.uniformFaceColor = true;
	horn4.color = [0.94, 0.79, 0.28, 1.0];
	horn4.matrix = new Matrix4(horn2.matrix);
	horn4.matrix.translate(-4.9, 0, 0);
	horn4.render();

	var mustache = new Cube();
	mustache.uniformFaceColor = true;
	mustache.color = [0.94, 0.79, 0.28, 1.0];
	mustache.matrix = new Matrix4(head2.matrix);
	mustache.matrix.translate(1.1, 0.1, 0);
	mustache.matrix.rotate(180, 1, 0, 0);
	mustache.matrix.scale(0.08, 0.8, 0.08);
	mustache.render();

	var mustache2 = new Cube();
	mustache2.uniformFaceColor = true;
	mustache2.color = [0.94, 0.79, 0.28, 1.0];
	mustache2.matrix = new Matrix4(head2.matrix);
	mustache2.matrix.translate(1.2, 0.1, -0.1);
	mustache2.matrix.rotate(90, 1, 0, 0);
	mustache2.matrix.rotate(90, 0, 0, 1);
	mustache2.matrix.scale(0.08, 0.8, 0.08);
	mustache2.render();

	var mustache3 = new Cube();
	mustache3.uniformFaceColor = true;
	mustache3.color = [0.94, 0.79, 0.28, 1.0];
	mustache3.matrix = new Matrix4(head2.matrix);
	mustache3.matrix.translate(-0.2, 0.1, 0);
	mustache3.matrix.rotate(180, 1, 0, 0);
	mustache3.matrix.scale(0.08, 0.8, 0.08);
	mustache3.render();

	var mustache4 = new Cube();
	mustache4.uniformFaceColor = true;
	mustache4.color = [0.94, 0.79, 0.28, 1.0];
	mustache4.matrix = new Matrix4(head2.matrix);
	mustache4.matrix.translate(0.6, 0.1, -0.1);
	mustache4.matrix.rotate(90, 1, 0, 0);
	mustache4.matrix.rotate(90, 0, 0, 1);
	mustache4.matrix.scale(0.08, 0.8, 0.08);
	mustache4.render();

	//eyes
	var eye1 = new Cube();
	eye1.uniformFaceColor = true;
	eye1.color = [0, 0, 0, 1.0];
	eye1.matrix = new Matrix4(head2.matrix);
	eye1.matrix.translate(0.8, 0.5, 0.3);
	eye1.matrix.scale(0.27, 0.12, 0.27);
	eye1.render();

	var eye2 = new Cube();
	eye2.uniformFaceColor = true;
	eye2.color = [0, 0, 0, 1.0];
	eye2.matrix = new Matrix4(head2.matrix);
	eye2.matrix.translate(-0.08, 0.5, 0.3);
	eye2.matrix.scale(0.27, 0.12, 0.27);
	eye2.render();

	//scales

	var scale2 = new Cone();
	scale2.color = [0.05, 0.25, 0.05, 1];
	scale2.matrix = new Matrix4(belly3.matrix);
	scale2.matrix.rotate(90, 1, 0, 0);
	scale2.matrix.translate(0.5, 0.9, -0.3); //z is x
	scale2.matrix.scale(0.16, 0.2, 0.16);
	scale2.render();

	var scale3 = new Cone();
	scale3.color = [0.05, 0.25, 0.05, 1];
	scale3.matrix = new Matrix4(belly4.matrix);
	scale3.matrix.rotate(100, 1, 0, 0);
	scale3.matrix.translate(0.5, 0.85, -0.3); //z is x
	scale3.matrix.scale(0.16, 0.2, 0.16);
	scale3.render();

	var scale4 = new Cone();
	scale4.color = [0.05, 0.25, 0.05, 1];
	scale4.matrix = new Matrix4(belly5.matrix);
	scale4.matrix.rotate(90, 1, 0, 0);
	scale4.matrix.translate(0.5, 0.9, -0.4); //z is x
	scale4.matrix.scale(0.16, 0.2, 0.16);
	scale4.render();

	var scale5 = new Cone();
	scale5.color = [0.05, 0.25, 0.05, 1];
	scale5.matrix = new Matrix4(belly6.matrix);
	scale5.matrix.rotate(90, 1, 0, 0);
	scale5.matrix.translate(0.5, 0.9, -0.4); //z is x
	scale5.matrix.scale(0.16, 0.2, 0.16);
	scale5.render();

	var scale6 = new Cone();
	scale6.color = [0.05, 0.25, 0.05, 1];
	scale6.matrix = new Matrix4(belly7.matrix);
	scale6.matrix.rotate(90, 1, 0, 0);
	scale6.matrix.translate(0.5, 1, -0.4); //z is x
	scale6.matrix.scale(0.16, 0.2, 0.16);
	scale6.render();

	var scale7 = new Cone();
	scale7.color = [0.05, 0.25, 0.05, 1];
	scale7.matrix = new Matrix4(tail1.matrix);
	scale7.matrix.rotate(90, 1, 0, 0);
	scale7.matrix.translate(0.5, 1, -0.4); //z is x
	scale7.matrix.scale(0.16, 0.2, 0.16);
	scale7.render();

	var scale8 = new Cone();
	scale8.color = [0.05, 0.25, 0.05, 1];
	scale8.matrix = new Matrix4(tail2.matrix);
	scale8.matrix.rotate(90, 1, 0, 0);
	scale8.matrix.translate(0.5, 1, -0.4); //z is x
	scale8.matrix.scale(0.16, 0.2, 0.16);
	scale8.render();

	var scale9 = new Cone();
	scale9.color = [0.05, 0.25, 0.05, 1];
	scale9.matrix = new Matrix4(tail3.matrix);
	scale9.matrix.rotate(90, 1, 0, 0);
	scale9.matrix.translate(0.5, 1, -0.4); //z is x
	scale9.matrix.scale(0.16, 0.2, 0.16);
	scale9.render();

	var scale10 = new Cone();
	scale10.color = [0.05, 0.25, 0.05, 1];
	scale10.matrix = new Matrix4(tail4.matrix);
	scale10.matrix.rotate(90, 1, 0, 0);
	scale10.matrix.translate(0.5, 1, -0.4); //z is x
	scale10.matrix.scale(0.16, 0.2, 0.16);
	scale10.render();

	//going from scale2 to head now
	var scale11 = new Cone();
	scale11.color = [0.05, 0.25, 0.05, 1];
	scale11.matrix = new Matrix4(belly2.matrix);
	scale11.matrix.rotate(90, 1, 0, 0);
	scale11.matrix.translate(0.5, 0.9, -0.4); //z is x
	scale11.matrix.scale(0.16, 0.2, 0.16);
	scale11.render();

	var scale12 = new Cone();
	scale12.color = [0.05, 0.25, 0.05, 1];
	scale12.matrix = new Matrix4(belly1.matrix);
	scale12.matrix.rotate(80, 1, 0, 0);
	scale12.matrix.translate(0.5, 1.1, -0.4); //z is x
	scale12.matrix.scale(0.16, 0.2, 0.16);
	scale12.render();

	var scale13 = new Cone();
	scale13.color = [0.05, 0.25, 0.05, 1];
	scale13.matrix = new Matrix4(neck1.matrix);
	scale13.matrix.rotate(90, 1, 0, 0);
	scale13.matrix.translate(0.5, 1, -0.6); //z is x
	scale13.matrix.scale(0.16, 0.2, 0.16);
	scale13.render();

	var scale14 = new Cone();
	scale14.color = [0.05, 0.25, 0.05, 1];
	scale14.matrix = new Matrix4(neck2.matrix);
	scale14.matrix.rotate(110, 1, 0, 0);
	scale14.matrix.translate(0.5, 0.6, -2); //z is x
	scale14.matrix.scale(0.16, 0.3, 0.16);
	scale14.render();

	var scale15 = new Cone();
	scale15.color = [0.05, 0.25, 0.05, 1];
	scale15.matrix = new Matrix4(neck5.matrix);
	scale15.matrix.rotate(90, 1, 0, 0);
	scale15.matrix.translate(0.5, 1, -0.6);
	scale15.matrix.scale(0.16, 0.4, 0.2);
	scale15.render();

	var scale16 = new Cone();
	scale16.color = [0.05, 0.25, 0.05, 1];
	scale16.matrix = new Matrix4(head2.matrix);
	scale16.matrix.rotate(120, 1, 0, 0);
	scale16.matrix.translate(0.5, 2.3, 1);
	scale16.matrix.scale(0.16, 0.4, 0.2);
	scale16.render();

	var scale17 = new Cone();
	scale17.color = [0.05, 0.25, 0.05, 1];
	scale17.matrix = new Matrix4(neck7.matrix);
	scale17.matrix.rotate(90, 1, 0, 0);
	scale17.matrix.translate(0.5, 1, -0.8);
	scale17.matrix.scale(0.16, 0.4, 0.2);
	scale17.render();

	var scale18 = new Cone();
	scale18.color = [0.05, 0.25, 0.05, 1];
	scale18.matrix = new Matrix4(neck8.matrix);
	scale18.matrix.rotate(90, 1, 0, 0);
	scale18.matrix.translate(0.5, 1, -0.8);
	scale18.matrix.scale(0.16, 0.4, 0.2);
	scale18.render();

	//back left leg
	const legBL = new TruncatedCone(1.0, 0.5, 2.7, 36); //x, y, z, n
	legBL.color = [0.52, 0, 0.12, 1.0];
	legBL.matrix = new Matrix4(belly5.matrix);
	legBL.matrix.rotate(90, 1, 0, -3);
	legBL.matrix.rotate(60, 0, 0, -1); //x is x, y is z
	legBL.matrix.rotate(30, -1, 0, 0); //x is x, y is z
	legBL.matrix.rotate(g_legAngle, -2, 0, 0); // Apply g_legAngle
	legBL.matrix.scale(0.4, 0.4, 0.4);
	legBL.matrix.translate(-2.3, 0.2, 1); //x is x, y is z
	legBL.render();

	const legBL2 = new TruncatedCone(0.6, 0.2, 2.7, 36); //x, y, z, n
	legBL2.color = [0.52, 0, 0.12, 1.0];
	legBL2.matrix = new Matrix4(legBL.matrix);
	legBL2.matrix.rotate(90, -1, 0, 0);
	legBL2.matrix.translate(0, 0, 2); //x is z, y is
	legBL2.render();

	const legBL3 = new TruncatedCone(0.3, 0.2, 1.4, 36); //x, y, z, n
	legBL3.color = [0.52, 0, 0.12, 1.0];
	legBL3.matrix = new Matrix4(legBL2.matrix);
	legBL3.matrix.rotate(180, 1, 0, 0);
	legBL3.matrix.translate(0, -3.5, 0); //y is z, z is z
	legBL3.render();

	const legBL4toe1 = new TruncatedCone(0.2, 0.15, 1.3, 36); //x, y, z, n
	legBL4toe1.color = [0.52, 0, 0.12, 1.0];
	legBL4toe1.matrix = new Matrix4(legBL3.matrix);
	legBL4toe1.matrix.rotate(180, 1.1, -1, 0);
	legBL4toe1.matrix.translate(-0.2, 0, 0.1); //y is z, x is y
	legBL4toe1.render();

	const legBL4toe1nail = new TruncatedCone(0.04, 0.15, 0.8, 36); //x, y, z, n
	legBL4toe1nail.color = [0.94, 0.79, 0.28, 1.0];
	legBL4toe1nail.matrix = new Matrix4(legBL4toe1.matrix);
	legBL4toe1nail.matrix.rotate(180, 1.1, -1, 0);
	legBL4toe1nail.matrix.translate(-1.2, -0.8, 0); //y is y, x is z
	legBL4toe1nail.render();

	const legBL4toe2 = new TruncatedCone(0.2, 0.15, 1.3, 36); //x, y, z, n
	legBL4toe2.color = [0.52, 0, 0.12, 1.0];
	legBL4toe2.matrix = new Matrix4(legBL3.matrix);
	legBL4toe2.matrix.rotate(180, 1.1, -1, 0);
	legBL4toe2.matrix.rotate(40, 1, 0, 0);
	legBL4toe2.matrix.translate(-0.15, 0, 0.1); //y is z, x is y
	legBL4toe2.render();

	const legBL4toe2nail = new TruncatedCone(0.04, 0.15, 0.8, 36); //x, y, z, n
	legBL4toe2nail.color = [0.94, 0.79, 0.28, 1.0];
	legBL4toe2nail.matrix = new Matrix4(legBL4toe2.matrix);
	legBL4toe2nail.matrix.rotate(180, 1.1, -1, 0);
	legBL4toe2nail.matrix.translate(-1.2, -0.8, 0); //y is y, x is z
	legBL4toe2nail.render();

	const legBL4toe3 = new TruncatedCone(0.2, 0.15, 1.3, 36); //x, y, z, n
	legBL4toe3.color = [0.52, 0, 0.12, 1.0];
	legBL4toe3.matrix = new Matrix4(legBL3.matrix);
	legBL4toe3.matrix.rotate(180, 1.1, -1, 0);
	legBL4toe3.matrix.rotate(80, 1, 0, 0);
	legBL4toe3.matrix.translate(-0.15, 0, 0.1); //y is z, x is y
	legBL4toe3.render();

	const legBL4toe3nail = new TruncatedCone(0.04, 0.15, 0.8, 36); //x, y, z, n
	legBL4toe3nail.color = [0.94, 0.79, 0.28, 1.0];
	legBL4toe3nail.matrix = new Matrix4(legBL4toe3.matrix);
	legBL4toe3nail.matrix.rotate(180, 1.1, -1, 0);
	legBL4toe3nail.matrix.translate(-1.2, -0.8, 0); //y is y, x is z
	legBL4toe3nail.render();

	//back right leg
	const legBR = new TruncatedCone(1.0, 0.5, 2.7, 36); //x, y, z, n
	legBR.color = [0.52, 0, 0.12, 1.0];
	legBR.matrix = new Matrix4(belly5.matrix);
	legBR.matrix.rotate(270, 1, 0, -3);
	legBR.matrix.rotate(-50, 0, 0, -1); //x is x, y is z
	legBR.matrix.rotate(15, -1, 0, 0); //x is x, y is z
	legBR.matrix.rotate(g_legAngle, -2, 0, 0); // Apply g_legAngle
	legBR.matrix.scale(0.4, 0.4, 0.4);
	legBR.matrix.translate(-1, -0.8, 0.7); //x is z, y is x, z is y
	legBR.render();

	const legBR2 = new TruncatedCone(0.6, 0.2, 2.7, 36); //x, y, z, n
	legBR2.color = [0.52, 0, 0.12, 1.0];
	legBR2.matrix = new Matrix4(legBR.matrix);
	legBR2.matrix.rotate(90, -1, 0, 0);
	legBR2.matrix.rotate(300, 0, 0, 1);
	legBR2.matrix.translate(0, 0, 2.1); //x is z, y is
	legBR2.render();

	const legBR3 = new TruncatedCone(0.3, 0.2, 1.4, 36); //x, y, z, n
	legBR3.color = [0.52, 0, 0.12, 1.0];
	legBR3.matrix = new Matrix4(legBR2.matrix);
	legBR3.matrix.rotate(180, 1, 0, 0);
	legBR3.matrix.translate(0, -3.5, 0); //y is z, z is z
	legBR3.render();

	const legBR4toe1 = new TruncatedCone(0.2, 0.15, 1.3, 36); //x, y, z, n
	legBR4toe1.color = [0.52, 0, 0.12, 1.0];
	legBR4toe1.matrix = new Matrix4(legBR3.matrix);
	legBR4toe1.matrix.rotate(270, 1, 0, 0);
	legBR4toe1.matrix.rotate(20, 0, 0, -1);
	legBR4toe1.matrix.translate(-0.2, 0, 0.1); //y is z, x is y
	legBR4toe1.render();

	const legBR4toe1nail = new TruncatedCone(0.04, 0.15, 0.8, 36); //x, y, z, n
	legBR4toe1nail.color = [0.94, 0.79, 0.28, 1.0];
	legBR4toe1nail.matrix = new Matrix4(legBR4toe1.matrix);
	legBR4toe1nail.matrix.rotate(90, 1, 0, 0);
	legBR4toe1nail.matrix.translate(0, -0.7, -1.2); //correct coords
	legBR4toe1nail.render();

	const legBR4toe2 = new TruncatedCone(0.2, 0.15, 1.3, 36); //x, y, z, n
	legBR4toe2.color = [0.52, 0, 0.12, 1.0];
	legBR4toe2.matrix = new Matrix4(legBR3.matrix);
	legBR4toe2.matrix.rotate(270, 1, 0, 0);
	legBR4toe2.matrix.rotate(20, 0, 0, 1);
	legBR4toe2.matrix.translate(-0.15, 0, 0.1); //y is z, x is y
	legBR4toe2.render();

	const legBR4toe2nail = new TruncatedCone(0.04, 0.15, 0.8, 36); //x, y, z, n
	legBR4toe2nail.color = [0.94, 0.79, 0.28, 1.0];
	legBR4toe2nail.matrix = new Matrix4(legBR4toe2.matrix);
	legBR4toe2nail.matrix.rotate(90, 1, 0, 0);
	legBR4toe2nail.matrix.translate(0, -0.7, -1.2); //correct coords
	legBR4toe2nail.render();

	const legBR4toe3 = new TruncatedCone(0.2, 0.15, 1.3, 36); //x, y, z, n
	legBR4toe3.color = [0.52, 0, 0.12, 1.0];
	legBR4toe3.matrix = new Matrix4(legBR3.matrix);
	legBR4toe3.matrix.rotate(270, 1, 0, 0);
	legBR4toe3.matrix.rotate(-60, 0, 0, 1);
	legBR4toe3.matrix.translate(-0.15, 0, 0.1); //y is z, x is y
	legBR4toe3.render();

	const legBR4toe3nail = new TruncatedCone(0.04, 0.15, 0.8, 36); //x, y, z, n
	legBR4toe3nail.color = [0.94, 0.79, 0.28, 1.0];
	legBR4toe3nail.matrix = new Matrix4(legBR4toe3.matrix);
	legBR4toe3nail.matrix.rotate(90, 1, 0, 0);
	legBR4toe3nail.matrix.translate(0, -0.7, -1.2); //correct coords
	legBR4toe3nail.render();

	//front left leg
	const legFL = new TruncatedCone(0.8, 0.5, 2.7, 36); //x, y, z, n
	legFL.color = [0.52, 0, 0.12, 1.0];
	legFL.matrix = new Matrix4(neck1.matrix);
	legFL.matrix.scale(0.4, 0.4, 0.4);
	legFL.matrix.rotate(180, 1, 0, 0);
	legFL.matrix.rotate(-90, 0, 1, 0); //rotate round z
	legFL.matrix.rotate(0, 0, 0, 1); //z rotate left right
	legFL.matrix.rotate(g_legAngle, -2, 0, 0); // Apply g_legAngl
	legFL.matrix.rotate(40, 1, 0, 0);
	legFL.matrix.translate(-1.5, -2, 1); //x is x, y is z
	legFL.render();

	const legFL2 = new TruncatedCone(0.6, 0.2, 2.7, 36); //x, y, z, n
	legFL2.color = [0.52, 0, 0.12, 1.0];
	legFL2.matrix = new Matrix4(legFL.matrix);
	legFL2.matrix.rotate(90, 1, 0, 0); //rotate round z
	legFL2.matrix.rotate(55, 0, 0, -1); //rotate round y
	legFL2.matrix.translate(0, -0.4, -2.5); //negative z is down
	legFL2.render();

	const legFL3 = new TruncatedCone(0.3, 0.2, 1.4, 36); //x, y, z, n
	legFL3.color = [0.52, 0, 0.12, 1.0];
	legFL3.matrix = new Matrix4(legFL2.matrix);
	legFL3.matrix.rotate(180, 1, 0, 0);
	legFL3.matrix.translate(0, -3.5, 0); //y is z, z is z
	legFL3.render();

	const legFL4toe1 = new TruncatedCone(0.2, 0.15, 1.3, 36); //x, y, z, n
	legFL4toe1.color = [0.52, 0, 0.12, 1.0];
	legFL4toe1.matrix = new Matrix4(legFL3.matrix);
	legFL4toe1.matrix.rotate(100, 1.1, -1, 0);
	legFL4toe1.matrix.translate(-0.2, 0, 0.1); //y is z, x is y
	legFL4toe1.matrix.rotate(180, 1, 0, 0);
	legFL4toe1.render();

	const legFL4toe1nail = new TruncatedCone(0.04, 0.15, 0.8, 36); //x, y, z, n
	legFL4toe1nail.color = [0.94, 0.79, 0.28, 1.0];
	legFL4toe1nail.matrix = new Matrix4(legFL4toe1.matrix);
	legFL4toe1nail.matrix.rotate(180, 1, 0, 0);
	legFL4toe1nail.matrix.rotate(90, 0, 0, 1);
	legFL4toe1nail.matrix.translate(-1.3, -0.7, 0); //correct coords
	legFL4toe1nail.render();

	const legFL4toe2 = new TruncatedCone(0.2, 0.15, 1.3, 36); //x, y, z, n
	legFL4toe2.color = [0.52, 0, 0.12, 1.0];
	legFL4toe2.matrix = new Matrix4(legFL3.matrix);
	legFL4toe2.matrix.rotate(100, 1.1, -1, 0);
	legFL4toe2.matrix.rotate(-40, 1, 0, 0);
	legFL4toe2.matrix.translate(-0.15, 0, 0.1); //y is z, x is y
	legFL4toe2.matrix.rotate(180, 1, 0, 0);
	legFL4toe2.render();

	const legFL4toe2nail = new TruncatedCone(0.04, 0.15, 0.8, 36); //x, y, z, n
	legFL4toe2nail.color = [0.94, 0.79, 0.28, 1.0];
	legFL4toe2nail.matrix = new Matrix4(legFL4toe2.matrix);
	legFL4toe2nail.matrix.rotate(180, 1, 0, 0);
	legFL4toe2nail.matrix.rotate(90, 0, 0, 1);
	legFL4toe2nail.matrix.translate(-1.3, -0.7, 0); //correct coords
	legFL4toe2nail.render();

	const legFL4toe3 = new TruncatedCone(0.2, 0.15, 1.3, 36); //x, y, z, n
	legFL4toe3.color = [0.52, 0, 0.12, 1.0];
	legFL4toe3.matrix = new Matrix4(legFL3.matrix);
	legFL4toe3.matrix.rotate(100, 1.1, -1, 0);
	legFL4toe3.matrix.rotate(-90, 1, 0, 0);
	legFL4toe3.matrix.translate(-0.15, 0, 0.1); //y is z, x is y
	legFL4toe3.matrix.rotate(180, 1, 0, 0);
	legFL4toe3.render();

	const legFL4toe3nail = new TruncatedCone(0.04, 0.15, 0.8, 36); //x, y, z, n
	legFL4toe3nail.color = [0.94, 0.79, 0.28, 1.0];
	legFL4toe3nail.matrix = new Matrix4(legFL4toe3.matrix);
	legFL4toe3nail.matrix.rotate(180, 1, 0, 0);
	legFL4toe3nail.matrix.rotate(90, 0, 0, 1);
	legFL4toe3nail.matrix.translate(-1.3, -0.7, 0); //correct coords
	legFL4toe3nail.render();

	//front right leg
	const legFR = new TruncatedCone(0.8, 0.5, 2.7, 36); //x, y, z, n
	legFR.color = [0.52, 0, 0.12, 1.0];
	legFR.matrix = new Matrix4(neck1.matrix);
	legFR.matrix.scale(0.4, 0.4, 0.4);
	legFR.matrix.rotate(180, 1, 0, 0);
	legFR.matrix.rotate(-90, 0, 1, 0); //rotate round z
	legFR.matrix.rotate(0, 0, 0, 1); //z rotate left right
	legFR.matrix.rotate(g_legAngle, -2, 0, 0); // Apply g_legAngle
	legFR.matrix.rotate(-40, 1, 0, 0);
	legFR.matrix.translate(-1.5, -0.3, -2.8); //x is x, y is z
	legFR.render();

	const legFR2 = new TruncatedCone(0.6, 0.2, 2.7, 36); //x, y, z, n
	legFR2.color = [0.52, 0, 0.12, 1.0];
	legFR2.matrix = new Matrix4(legFR.matrix);
	legFR2.matrix.rotate(90, 1, 0, 0); //rotate round z
	legFR2.matrix.rotate(240, 0, 0, 1); //rotate round y
	legFR2.matrix.translate(0, -0.4, -2.5); //negative z is down
	legFR2.render();

	const legFR3 = new TruncatedCone(0.3, 0.2, 1.4, 36); //x, y, z, n
	legFR3.color = [0.52, 0, 0.12, 1.0];
	legFR3.matrix = new Matrix4(legFR2.matrix);
	legFR3.matrix.rotate(180, 1, 0, 0);
	legFR3.matrix.translate(0, -3.5, 0); //y is z, z is z
	legFR3.render();

	const legFR4toe1 = new TruncatedCone(0.2, 0.15, 1.3, 36); //x, y, z, n
	legFR4toe1.color = [0.52, 0, 0.12, 1.0];
	legFR4toe1.matrix = new Matrix4(legFR3.matrix);
	legFR4toe1.matrix.rotate(80, 1.1, -1, 0);
	legFR4toe1.matrix.translate(-0.2, 0, 0.1); //y is z, x is y
	legFR4toe1.matrix.rotate(180, 1, 0, 0);
	legFR4toe1.render();

	const legFR4toe1nail = new TruncatedCone(0.04, 0.15, 0.8, 36); //x, y, z, n
	legFR4toe1nail.color = [0.94, 0.79, 0.28, 1.0];
	legFR4toe1nail.matrix = new Matrix4(legFR4toe1.matrix);
	legFR4toe1nail.matrix.rotate(90, 1, 0, 0);
	legFR4toe1nail.matrix.translate(0, -0.8, -1.2);
	legFR4toe1nail.render();

	const legFR4toe2 = new TruncatedCone(0.2, 0.15, 1.3, 36); //x, y, z, n
	legFR4toe2.color = [0.52, 0, 0.12, 1.0];
	legFR4toe2.matrix = new Matrix4(legFR3.matrix);
	legFR4toe2.matrix.rotate(80, 1.1, -1, 0);
	legFR4toe2.matrix.rotate(40, 1, 0, 0);
	legFR4toe2.matrix.translate(-0.15, 0, 0.1); //y is z, x is y
	legFR4toe2.matrix.rotate(180, 1, 0, 0);
	legFR4toe2.render();

	const legFR4toe2nail = new TruncatedCone(0.04, 0.15, 0.8, 36); //x, y, z, n
	legFR4toe2nail.color = [0.94, 0.79, 0.28, 1.0];
	legFR4toe2nail.matrix = new Matrix4(legFR4toe2.matrix);
	legFR4toe2nail.matrix.rotate(90, 1, 0, 0);
	legFR4toe2nail.matrix.translate(0, -0.8, -1.2);
	legFR4toe2nail.render();

	const legFR4toe3 = new TruncatedCone(0.2, 0.15, 1.3, 36); //x, y, z, n
	legFR4toe3.color = [0.52, 0, 0.12, 1.0];
	legFR4toe3.matrix = new Matrix4(legFR3.matrix);
	legFR4toe3.matrix.rotate(80, 1.1, -1, 0);
	legFR4toe3.matrix.rotate(-40, 1, 0, 0);
	legFR4toe3.matrix.translate(-0.15, 0, 0.1); //y is z, x is y
	legFR4toe3.matrix.rotate(180, 1, 0, 0);
	legFR4toe3.matrix.rotate(-30, 0, 1, 0);
	legFR4toe3.render();

	const legFR4toe3nail = new TruncatedCone(0.04, 0.15, 0.8, 36); //x, y, z, n
	legFR4toe3nail.color = [0.94, 0.79, 0.28, 1.0];
	legFR4toe3nail.matrix = new Matrix4(legFR4toe3.matrix);
	legFR4toe3nail.matrix.rotate(90, 1, 0, 0);
	legFR4toe3nail.matrix.translate(0, -0.8, -1.2);
	legFR4toe3nail.render();
}
