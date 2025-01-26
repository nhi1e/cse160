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
let g_yellowAngle = 0;
let g_magentaAngle = 0;
let g_yellowAnimation = false;
let g_magentaAnimation = false;
//set up actions for html ui elements
function addActionsForHtmlUI() {
	//button events
	document.getElementById("YellowAnimationOnButton").onclick = function () {
		g_yellowAnimation = true;
	};
	document.getElementById("YellowAnimationOffButton").onclick = function () {
		g_yellowAnimation = false;
	};
	document.getElementById("MagentaAnimationOnButton").onclick = function () {
		g_magentaAnimation = true;
	};
	document.getElementById("MagentaAnimationOffButton").onclick = function () {
		g_magentaAnimation = false;
	};

	//Size slider events
	document
		.getElementById("angleSlide")
		.addEventListener("mousemove", function () {
			g_globalAngle = this.value;
			renderAllShapes();
		});

	document
		.getElementById("yellowSlide")
		.addEventListener("mousemove", function () {
			g_yellowAngle = this.value;
			renderAllShapes();
		});

	document
		.getElementById("magentaSlide")
		.addEventListener("mousemove", function () {
			g_magentaAngle = this.value;
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
	gl.clearColor(0, 0, 0, 1.0);

	// // Clear <canvas>
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

	//BODY
	//rotate: angle, x, y, z
	//rotate z is away from face
	//rotate y is left and right

	var neck1 = new Cube();
	neck1.color = [0.87, 0.96, 0.643, 1.0];
	neck1.matrix.translate(-0.6, -0.1, 0.0);
	neck1.matrix.rotate(-50, 1, -5, 0);
	neck1.matrix.scale(0.13, 0.13, 0.13);
	neck1.render();

	var neck2 = new Cube();
	neck2.color = [0.87, 0.96, 0.643, 1.0];
	neck2.matrix = new Matrix4(neck1.matrix);
	neck2.matrix.translate(-0.05, -0.9, 0.4);
	neck2.matrix.rotate(25, -0.8, 0, 0);
	neck2.matrix.scale(1.1, 1.1, 1.1);
	neck2.render();

	var belly1 = new Cube();
	belly1.color = [0.87, 0.96, 0.643, 1.0];
	belly1.matrix = new Matrix4(neck2.matrix);
	belly1.matrix.translate(-0.05, -0.9, 0.41);
	belly1.matrix.rotate(25, -0.6, 0, 0);
	belly1.matrix.scale(1.1, 1.1, 1.1);
	belly1.render();

	var belly2 = new Cube();
	belly2.color = [0.87, 0.96, 0.643, 1.0];
	belly2.matrix = new Matrix4(belly1.matrix);
	belly2.matrix.translate(-0.05, -0.9, 0.41);
	belly2.matrix.rotate(25, -0.6, 0, 0);
	belly2.matrix.scale(1.1, 1.1, 1.1);
	belly2.render();

	var belly3 = new Cube();
	belly3.color = [0.87, 0.96, 0.643, 1.0];
	belly3.matrix = new Matrix4(belly2.matrix);
	belly3.matrix.translate(0, -0.9, 0.4);
	belly3.matrix.rotate(25, -1, 0, 0);
	belly3.render();

	var belly4 = new Cube();
	belly4.color = [0.87, 0.96, 0.643, 1.0];
	belly4.matrix = new Matrix4(belly3.matrix);
	belly4.matrix.translate(0, -0.9, 0.4);
	belly4.matrix.rotate(25, -1, 0, 0);
	belly4.render();

	var belly5 = new Cube();
	belly5.color = [0.87, 0.96, 0.643, 1.0];
	belly5.matrix = new Matrix4(belly4.matrix);
	belly5.matrix.translate(0.07, -0.6, -0.14);
	belly5.matrix.rotate(17, 1.3, 0, 0);
	belly5.matrix.scale(0.9, 0.9, 0.9);
	belly5.render();

	var belly6 = new Cube();
	belly6.color = [0.87, 0.96, 0.643, 1.0];
	belly6.matrix = new Matrix4(belly5.matrix);
	belly6.matrix.translate(0.07, -0.5, -0.14);
	belly6.matrix.rotate(20, 1.3, 0, 0);
	belly6.matrix.scale(0.9, 0.9, 0.9);
	belly6.render();

	var belly7 = new Cube();
	belly7.color = [0.87, 0.96, 0.643, 1.0];
	belly7.matrix = new Matrix4(belly6.matrix);
	belly7.matrix.translate(0.07, -0.35, -0.2);
	belly7.matrix.rotate(30, 1.3, 0, 0);
	belly7.matrix.scale(0.9, 0.9, 0.9);
	belly7.render();

	//tail
	var tail1 = new Cube();
	tail1.color = [0.87, 0.96, 0.643, 1.0];
	tail1.matrix = new Matrix4(belly7.matrix);
	tail1.matrix.translate(0.07, -0.29, -0.19);
	tail1.matrix.rotate(34, 1.3, 0, 0);
	tail1.matrix.scale(0.9, 0.9, 0.9);
	tail1.render();

	var tail2 = new Cube();
	tail2.color = [0.87, 0.96, 0.643, 1.0];
	tail2.matrix = new Matrix4(tail1.matrix);
	tail2.matrix.translate(0.03, -0.4, -0.1);
	tail2.matrix.rotate(20, 1.3, 0, 0);
	tail2.matrix.scale(0.9, 0.9, 0.9);
	tail2.render();

	var tail3 = new Cube();
	tail3.color = [0.87, 0.96, 0.643, 1.0];
	tail3.matrix = new Matrix4(tail2.matrix);
	tail3.matrix.translate(0.03, -0.4, -0.1);
	tail3.matrix.rotate(15, 1.3, 0, 0);
	tail3.matrix.scale(0.9, 0.9, 0.9);
	tail3.render();

	var tail4 = new Cube();
	tail4.color = [0.87, 0.96, 0.643, 1.0];
	tail4.matrix = new Matrix4(tail3.matrix);
	tail4.matrix.translate(0.03, -0.8, 0.18);
	tail4.matrix.rotate(10, -1.3, 0, 0);
	tail4.matrix.scale(0.9, 0.9, 0.9);
	tail4.render();

	var tail5 = new Cube();
	tail5.color = [0.87, 0.96, 0.643, 1.0];
	tail5.matrix = new Matrix4(tail4.matrix);
	tail5.matrix.translate(0.03, -0.8, 0.18);
	tail5.matrix.rotate(10, -1.3, 0, 0);
	tail5.matrix.scale(0.9, 0.9, 0.9);
	tail5.render();

	var tail6 = new Cube();
	tail6.color = [0.87, 0.96, 0.643, 1.0];
	tail6.matrix = new Matrix4(tail5.matrix);
	tail6.matrix.translate(0.03, -0.8, 0.18);
	tail6.matrix.rotate(10, -1.3, 0, 0);
	tail6.matrix.scale(0.9, 0.9, 0.9);
	tail6.render();

	var tail7 = new Cube();
	tail7.color = [0.87, 0.96, 0.643, 1.0];
	tail7.matrix = new Matrix4(tail6.matrix);
	tail7.matrix.translate(0.03, -0.8, 0.3);
	tail7.matrix.rotate(20	, -1.3, 0, 0);
	tail7.matrix.scale(0.9, 0.9, 0.9);
	tail7.render();

	var tail8 = new Cube();
	tail8.color = [0.87, 0.96, 0.643, 1.0];
	tail8.matrix = new Matrix4(tail7.matrix);
	tail8.matrix.translate(0.03, -0.8, 0.3);
	tail8.matrix.rotate(20, -1.3, 0, 0);
	tail8.matrix.scale(0.9, 0.9, 0.9);
	tail8.render();

	var tail9 = new Cube();
	tail9.color = [0.87, 0.96, 0.643, 1.0];
	tail9.matrix = new Matrix4(tail8.matrix);
	tail9.matrix.translate(0.03, -0.8, 0.3);
	tail9.matrix.rotate(20, -1.3, 0, 0);
	tail9.matrix.scale(0.9, 0.9, 0.9);
	tail9.render();

	var tail10 = new Cube();
	tail10.color = [0.87, 0.96, 0.643, 1.0];
	tail10.matrix = new Matrix4(tail9.matrix);
	tail10.matrix.translate(0.03, -0.8, 0.3);
	tail10.matrix.rotate(20, -1.3, 0, 0);
	tail10.matrix.scale(0.9, 0.9, 0.9);
	tail10.render();

	var tail11 = new Cube();
	tail11.color = [0.87, 0.96, 0.643, 1.0];
	tail11.matrix = new Matrix4(tail10.matrix);
	tail11.matrix.translate(0.03, -0.8, 0.3);
	tail11.matrix.rotate(20, -1.3, 0, 0);
	tail11.matrix.scale(0.9, 0.9, 0.9);
	tail11.render();

	var tail12 = new Cube();
	tail12.color = [0.87, 0.96, 0.643, 1.0];
	tail12.matrix = new Matrix4(tail11.matrix);
	tail12.matrix.translate(0.03, -1, 0.5);
	tail12.matrix.rotate(20, -1.3, 0, 0);
	tail12.matrix.scale(0.9, 1.3, 0.9);
	tail12.render();



	//upper neck
	var neck4 = new Cube();
	neck4.color = [0.87, 0.96, 0.643, 1.0];
	neck4.matrix = new Matrix4(neck1.matrix);
	neck4.matrix.translate(0.05, 1, 0.06);
	neck4.matrix.scale(0.9, 0.9, 0.9);
	neck4.matrix.rotate(20, 0.6, 0, 0);
	neck4.render();

	var neck5 = new Cube();
	neck5.color = [0.87, 0.96, 0.643, 1.0];
	neck5.matrix = new Matrix4(neck4.matrix);
	neck5.matrix.translate(0.04, 1, 0.08);
	neck5.matrix.scale(0.95, 0.95, 0.95);
	neck5.matrix.rotate(20, 0.6, 0, 0);
	neck5.render();

	var neck6 = new Cube();
	neck6.color = [0.87, 0.96, 0.643, 1.0];
	neck6.matrix = new Matrix4(neck5.matrix);
	neck6.matrix.translate(0.02, 1, 0.08);
	neck6.matrix.rotate(13, 0.6, 0, 0);
	neck6.matrix.scale(0.95, 0.95, 0.95);
	neck6.render();

	var neck7 = new Cube();
	neck7.color = [0.87, 0.96, 0.643, 1.0];
	neck7.matrix = new Matrix4(neck6.matrix);
	neck7.matrix.translate(0, 0.55, 0.1);
	neck7.matrix.rotate(-25, 0.6, 0, 0);
	neck7.render();

	var neck8 = new Cube();
	neck8.color = [0.87, 0.96, 0.643, 1.0];
	neck8.matrix = new Matrix4(neck7.matrix);
	neck8.matrix.translate(0, 0.5, 0.1);
	neck8.matrix.rotate(-30, 0.6, 0, 0);
	neck8.render();

	var neck10 = new Cube();
	neck10.color = [0.87, 0.96, 0.643, 1.0];
	neck10.matrix = new Matrix4(neck8.matrix);
	neck10.matrix.translate(0, 0.65, 0.08);
	neck10.matrix.rotate(-20, 0.6, 0, 0);
	neck10.render();

	// Draw left arm
	// var yellow = new Cube();
	// yellow.color = [1.0, 1.0, 0.0, 1.0];
	// yellow.matrix.setTranslate(0, -0.5, 0);

	// yellow.matrix.rotate(g_yellowAngle, 0, 0, 1);

	// var yellowCoordinatesMat = new Matrix4(yellow.matrix);
	// yellow.matrix.scale(0.25, 0.7, 0.5);
	// yellow.matrix.translate(-0.5, 0, 0);
	// yellow.render();

	// // test box
	// var box = new Cube();
	// box.color = [1.0, 0.0, 1.0, 1.0];
	// box.matrix = yellowCoordinatesMat; //attach to yellow arm
	// box.matrix.translate(0, 0.65, 0);
	// box.matrix.rotate(g_magentaAngle, 0, 0, 1);
	// box.matrix.scale(0.3, 0.3, 0.3);
	// box.matrix.translate(-0.5, 0, -0.001);
	// box.render();
}
