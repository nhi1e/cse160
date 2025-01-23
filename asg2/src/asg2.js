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

	// Get the rendering context for WebGL
	// gl = getWebGLContext(canvas);
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

function main() {
	setupWebGL();
	connectVariablesToGLSL();
	addActionsForHtmlUI();

	gl.enable(gl.BLEND);
	gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

	// Specify the color for clearing <canvas>
	gl.clearColor(0.0, 0.0, 0.0, 1.0);

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

var g_shapesList = [];
let prevPoint = null; // To store the last drawn point
let isFillingMode = false;

function createShape(position) {
	let shape;
	if (g_selectedType == POINT) {
		shape = new Point();
	} else if (g_selectedType == TRIANGLE) {
		shape = new Triangle();
	} else if (g_selectedType == CIRCLE) {
		shape = new Circle();
	}

	shape.position = position;
	shape.color = g_selectedColor.slice();
	shape.size = g_selectedSize;
	shape.segments = g_selectedSegments;

	g_shapesList.push(shape);
}

function drawPoint(position) {
	// Create a new point and add it to the shapes list
	let point = new Point();
	point.position = position;
	point.color = g_selectedColor.slice();
	point.size = g_selectedSize;
	g_shapesList.push(point);
}

function renderAllShapes() {
	var start = performance.now();

	// pass matrix to u_ModelMatrix attribute
	var globalRotMat = new Matrix4().rotate(g_globalAngle, 0, 1, 0);
	gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements);

	// Clear <canvas>
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	//Draw a cube
	var body = new Cube();
	body.color = [1.0, 0.0, 0.0, 1.0];
	body.matrix.translate(-0.25, -0.75, 0.0);
	body.matrix.rotate(-5, 1, 0, 0);
	body.matrix.scale(0.5, 0.3, 0.5);
	body.render();

	// Draw left arm
	var yellow = new Cube();
	yellow.color = [1.0, 1.0, 0.0, 1.0];
	yellow.matrix.setTranslate(0, -0.5, 0);

	yellow.matrix.rotate(g_yellowAngle, 0, 0, 1);

	// yellow.matrix.rotate(g_yellowAngle, 0, 0, 1);
	// if (g_yellowAnimation) {
	// 	yellow.matrix.rotate(45 * Math.sin(g_seconds), 0, 0, 1);
	// 	console.log("here");
	// } else {
	// 	yellow.matrix.rotate(g_yellowAngle, 0, 0, 1);
	// }

	var yellowCoordinatesMat = new Matrix4(yellow.matrix);
	yellow.matrix.scale(0.25, 0.7, 0.5);
	yellow.matrix.translate(-0.5, 0, 0);
	yellow.render();

	// test box
	var box = new Cube();
	box.color = [1.0, 0.0, 1.0, 1.0];
	box.matrix = yellowCoordinatesMat; //attach to yellow arm
	box.matrix.translate(0, 0.65, 0);
	box.matrix.rotate(g_magentaAngle, 0, 0, 1);
	box.matrix.scale(0.3, 0.3, 0.3);
	box.matrix.translate(-0.5, 0, -0.001);
	box.render();

	//check time
	// var duration = performance.now() - start;
	// sendTextToHTML("  ms: " + Math.floor(duration) + "  fps: " + Math.floor(10000 / duration));
}

// function sendTextToHTML(text) {
// 	var htmlElem = document.getElementById(htmlID);
// 	if (!htmlElem) {
// 		console.log("Failed to get the HTML element with id of", htmlID);
// 		return;
// 	}
// 	htmlElem.innerHTML = text;
// }
