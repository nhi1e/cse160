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

let g_selectedColor = [1.0, 1.0, 1.0, 1.0];
let g_selectedSize = 5;
let g_selectedType = POINT;

//set up actions for html ui elements
function addActionsForHtmlUI() {
	//button events
	document.getElementById("green").onclick = function () {
		g_selectedColor = [0.0, 1.0, 0.0, 1.0];
	};
	document.getElementById("red").onclick = function () {
		g_selectedColor = [1.0, 0.0, 0.0, 1.0];
	};

	document.getElementById("clear").onclick = function () {
		g_shapesList = [];
		renderAllShapes();
	};
	document.getElementById("point").onclick = function () {
		g_selectedType = POINT;
	};
	document.getElementById("triangle").onclick = function () {
		g_selectedType = TRIANGLE;
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
}

function main() {
	setupWebGL();
	connectVariablesToGLSL();
	addActionsForHtmlUI();

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

function click(ev) {
	//extract event click and return it in GL coordinates
	let [x, y] = convertCoordinatesEventToGL(ev);

	//create and store the new point
	let point;
	if (g_selectedType == POINT) {
		point = new Point();
	} else {
		point = new Triangle();
	}
	point.position = [x, y];
	point.color = g_selectedColor.slice();
	point.size = g_selectedSize;
	g_shapesList.push(point);

	// draw every shape that is supposed to be rendered on canvas
	renderAllShapes();
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