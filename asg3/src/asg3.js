// Vertex shader program
var VSHADER_SOURCE = `
  attribute vec4 a_Position;
  attribute vec2 a_TexCoord;
  uniform mat4 u_ModelMatrix;
  uniform mat4 u_GlobalRotateMatrix;
  varying vec2 v_TexCoord;
  void main() {
    gl_Position = u_GlobalRotateMatrix * u_ModelMatrix * a_Position;
    v_TexCoord = a_TexCoord;
  }`;

// Fragment shader program
var FSHADER_SOURCE = `
  precision mediump float;
  varying vec2 v_TexCoord;
  uniform sampler2D u_Sampler0;
  void main() {
    // gl_FragColor = vec4(v_TexCoord, 1.0, 1.0);
	gl_FragColor = texture2D(u_Sampler0, v_TexCoord);
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
	u_Sampler0 = gl.getUniformLocation(gl.program, "u_Sampler0");

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

	initTextures();
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

function initTextures() {
	var texture = gl.createTexture(); // Create a texture object
	if (!texture) {
		console.log("Failed to create the texture object");
		return false;
	}

	var u_Sampler0 = gl.getUniformLocation(gl.program, "u_Sampler0");
	if (!u_Sampler0) {
		console.log("Failed to get the storage location of u_Sampler0");
		return false;
	}

	var image = new Image(); // Create the image object
	if (!image) {
		console.log("Failed to create the image object");
		return false;
	}
	// Register the event handler to be called on loading an image
	image.onload = function () {
		loadTexture(gl, texture, u_Sampler0, image);
	};
	image.src = "texture.png";
	return true;
}

function loadTexture(gl, texture, u_Sampler, image) {
	gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); // Flip the image's y axis
	// Enable texture unit0
	gl.activeTexture(gl.TEXTURE0);
	// Bind the texture object to the target
	gl.bindTexture(gl.TEXTURE_2D, texture);

	// Set the texture parameters
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
	// Set the texture image
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
	// Set the texture unit 0 to the sampler
	gl.uniform1i(u_Sampler, 0);

	console.log("texture loaded");
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

	
}
