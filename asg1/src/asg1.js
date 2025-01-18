// ColoredPoint.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE = `
  attribute vec4 a_Position;
  uniform float u_Size;
  void main() {
    gl_Position = a_Position;
    gl_PointSize = u_Size;
  }`;

// Fragment shader program
var FSHADER_SOURCE = `
  precision mediump float;
  uniform vec4 u_FragColor; 
  void main() {
    gl_FragColor = u_FragColor;\n
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

	//Get storage location of u_Size
	u_Size = gl.getUniformLocation(gl.program, "u_Size");
	if (!u_Size) {
		console.log("Failed to get the storage location of u_Size");
		return;
	}
}

const POINT = 0;
const TRIANGLE = 1;
const CIRCLE = 2;

let g_selectedColor = [1.0, 1.0, 1.0, 1.0];
let g_selectedSize = 5;
let g_selectedType = POINT;
let g_selectedSegments = 10;

//set up actions for html ui elements
function addActionsForHtmlUI() {
	//button events

	document.getElementById("clear").onclick = function () {
		g_shapesList = [];
		renderAllShapes();
	};
	document.getElementById("drawPic").onclick = function () {
		drawPic();
	};

	document.getElementById("toggleFilling").onclick = function () {
		isFillingMode = !isFillingMode;
		const status = isFillingMode ? "ON" : "OFF";
		console.log(`Filling Mode is now ${status}`);
	};

	document.getElementById("point").onclick = function () {
		g_selectedType = POINT;
	};
	document.getElementById("triangle").onclick = function () {
		g_selectedType = TRIANGLE;
	};
	document.getElementById("circle").onclick = function () {
		g_selectedType = CIRCLE;
	};

	//color slider events
	document.getElementById("redSlide").addEventListener("mouseup", function () {
		g_selectedColor[0] = this.value / 100;
	});
	document
		.getElementById("greenSlide")
		.addEventListener("mouseup", function () {
			g_selectedColor[1] = this.value / 100;
		});
	document.getElementById("blueSlide").addEventListener("mouseup", function () {
		g_selectedColor[2] = this.value / 100;
	});

	//size slider events
	document.getElementById("sizeSlide").addEventListener("mouseup", function () {
		g_selectedSize = this.value;
	});

	//segment slider events
	document
		.getElementById("segmentsSlide")
		.addEventListener("mouseup", function () {
			g_selectedSegments = this.value;
		});

	//alpha slider events
	document
		.getElementById("alphaSlide")
		.addEventListener("mouseup", function () {
			g_selectedColor[3] = this.value / 100;
		});
}

function main() {
	setupWebGL();
	connectVariablesToGLSL();
	addActionsForHtmlUI();

	gl.enable(gl.BLEND);
	gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

	// Register function (event handler) to be called on a mouse press
	canvas.onmousedown = click;
	canvas.onmousemove = function (ev) {
		if (ev.buttons == 1) {
			click(ev);
		}
	};

	// Specify the color for clearing <canvas>
	gl.clearColor(0.0, 0.0, 0.0, 1.0);

	// Clear <canvas>
	gl.clear(gl.COLOR_BUFFER_BIT);
}

var g_shapesList = [];
let prevPoint = null; // To store the last drawn point
let isFillingMode = false;

function click(ev) {
	// Extract event click and return it in GL coordinates
	let [x, y] = convertCoordinatesEventToGL(ev);

	// If filling mode is active, interpolate shapes between the previous and current points
	if (isFillingMode && prevPoint) {
		interpolateAndDraw(prevPoint, [x, y]);
	}

	// Store the current point as the previous point for the next event
	prevPoint = [x, y];
	createShape([x, y]);

	// Create and store the new shape
	let point;
	if (g_selectedType == POINT) {
		point = new Point();
	} else if (g_selectedType == TRIANGLE) {
		point = new Triangle();
	} else {
		point = new Circle();
	}
	point.position = [x, y];
	point.color = g_selectedColor.slice();
	point.size = g_selectedSize;
	point.segments = g_selectedSegments;
	g_shapesList.push(point);

	// Render all shapes on the canvas
	renderAllShapes();
}

function interpolateAndDraw(start, end) {
	const distance = Math.sqrt(
		Math.pow(end[0] - start[0], 2) + Math.pow(end[1] - start[1], 2)
	);

	// Divide the line into segments based on the brush size to avoid gaps
	const step = g_selectedSize / 100;
	const steps = Math.ceil(distance / step);

	for (let i = 1; i <= steps; i++) {
		const t = i / steps;
		const interpolatedX = start[0] + t * (end[0] - start[0]);
		const interpolatedY = start[1] + t * (end[1] - start[1]);

		// Create the appropriate shape at the interpolated position
		createShape([interpolatedX, interpolatedY]);
	}
}
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

function convertCoordinatesEventToGL(ev) {
	var x = ev.clientX; // x coordinate of a mouse pointer
	var y = ev.clientY; // y coordinate of a mouse pointer
	var rect = ev.target.getBoundingClientRect();

	x = (x - rect.left - canvas.width / 2) / (canvas.width / 2);
	y = (canvas.height / 2 - (y - rect.top)) / (canvas.height / 2);
	return [x, y];
}

function renderAllShapes() {
	// Clear <canvas>
	gl.clear(gl.COLOR_BUFFER_BIT);

	// var len = g_points.length;
	var len = g_shapesList.length;

	for (var i = 0; i < len; i++) {
		//call render
		g_shapesList[i].render();
	}
}
