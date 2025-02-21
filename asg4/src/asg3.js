// Vertex shader program
var VSHADER_SOURCE =
	"attribute vec4 a_Position;\n" +
	"attribute vec2 a_UV;\n" +
	"attribute vec3 a_Normal;\n" +
	"varying vec2 v_UV;\n" +
	"varying vec3 v_Normal;\n" +
	"uniform mat4 u_ModelMatrix;\n" +
	"uniform mat4 u_GlobalRotateMatrix;\n" +
	"uniform mat4 u_ViewMatrix;\n" +
	"uniform mat4 u_ProjectionMatrix;\n" +
	"void main() {\n" +
	"  gl_Position =  u_ProjectionMatrix * u_ViewMatrix * u_GlobalRotateMatrix * u_ModelMatrix * a_Position;\n" +
	"  v_UV = a_UV;\n" +
	"  v_Normal = a_Normal;\n" +
	"}\n";

// Fragment shader program
var FSHADER_SOURCE =
	"precision mediump float;\n" +
	"varying vec2 v_UV;\n" +
	"varying vec3 v_Normal;\n" +
	"uniform vec4 u_FragColor;\n" +
	"uniform sampler2D u_Sampler0;\n" +
	"uniform sampler2D u_Sampler1;\n" +
	"uniform sampler2D u_Sampler2;\n" +
	"uniform sampler2D u_Sampler3;\n" +
	"uniform sampler2D u_Sampler4;\n" +
	"uniform sampler2D u_Sampler5;\n" +
	"uniform sampler2D u_Sampler6;\n" +
	"uniform sampler2D u_Sampler7;\n" +
	"uniform int u_whichTexture;\n" +
	"void main() {\n" +
	"  if(u_whichTexture == -3) {\n" +
	"     gl_FragColor = vec4((v_Normal+1.0)/2.0, 1.0);\n" +
	"  } else if(u_whichTexture == -2) {\n" +
	"     gl_FragColor = u_FragColor;\n" +
	"  } else if (u_whichTexture == -1) {\n" +
	"     gl_FragColor = vec4(v_UV,1.0,1.0);\n" +
	"  } else if (u_whichTexture == 0) {\n" +
	"     gl_FragColor = texture2D(u_Sampler0, v_UV);\n" +
	"  } else if (u_whichTexture == 1) {\n" +
	"     gl_FragColor = texture2D(u_Sampler1, v_UV);\n" +
	"  } else if (u_whichTexture == 2) {\n" +
	"     gl_FragColor = texture2D(u_Sampler2, v_UV);\n" +
	"  } else if (u_whichTexture == 3) {\n" +
	"     gl_FragColor = texture2D(u_Sampler3, v_UV);\n" +
	"  } else if (u_whichTexture == 4) {\n" +
	"     gl_FragColor = texture2D(u_Sampler4, v_UV);\n" +
	"  } else if (u_whichTexture == 5) {\n" +
	"     gl_FragColor = texture2D(u_Sampler5, v_UV);\n" +
	" } else if (u_whichTexture == 6) {\n" +
	"     gl_FragColor = texture2D(u_Sampler6, v_UV);\n" +
	" } else if (u_whichTexture == 7) {\n" +
	"     gl_FragColor = texture2D(u_Sampler7, v_UV);\n" +
	"  } else {\n" +
	"     gl_FragColor = vec4(1,.2,.2,1);\n" +
	"  }\n" +
	"}\n";

let canvas;
let gl;

let g_fov = 90;
let g_camera = new Camera();

let a_Position;
let u_FragColor;
let u_GlobalRotateMatrix;
let u_ViewMatrix;
let u_ProjectionMatrix;
let u_ModelMatrix;

let u_whichTexture;
let u_Sampler0;
let u_Sampler1;
let u_Sampler2;
let u_Sampler3;
let u_Sampler4;
let u_Sampler5;
let u_Sampler6;
let u_Sampler7;

let a_UV;

let g_showNormals = false; // Default to false (normals off)

let global_angle_x = 0;
let global_angle_y = 0;

let g_animating = true;
let g_map = new Map();
let g_walking = true;
let g_block = 1;

function setupWebGL() {
	// Retrieve <canvas> element
	canvas = document.getElementById("webgl");
	gl = canvas.getContext("webgl", { preserveDrawingBuffer: true });
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

	// Get the storage location of a_Position
	a_UV = gl.getAttribLocation(gl.program, "a_UV");
	if (a_Position < 0) {
		console.log("Failed to get the storage location of a_UV");
		return;
	}

	a_Normal = gl.getAttribLocation(gl.program, "a_Normal");
	if (a_Normal < 0) {
		console.log("Failed to get the storage location of a_Normal");
		return;
	}

	// Get the storage location of u_FragColor
	u_FragColor = gl.getUniformLocation(gl.program, "u_FragColor");
	if (!u_FragColor) {
		console.log("Failed to get the storage location of u_FragColor");
		return;
	}

	// Get the storage location of u_whichTexture
	u_whichTexture = gl.getUniformLocation(gl.program, "u_whichTexture");
	if (!u_whichTexture) {
		console.log("Failed to get the storage location of u_whichTexture");
		return;
	}

	// Get the storage location of u_Sampler0
	u_Sampler0 = gl.getUniformLocation(gl.program, "u_Sampler0");
	if (!u_Sampler0) {
		console.log("Failed to get the storage location of u_Sampler0");
		return;
	}

	u_Sampler1 = gl.getUniformLocation(gl.program, "u_Sampler1");
	if (!u_Sampler1) {
		console.log("Failed to get the storage location of u_Sampler1");
		return;
	}

	u_Sampler2 = gl.getUniformLocation(gl.program, "u_Sampler2");
	if (!u_Sampler2) {
		console.log("Failed to get the storage location of u_Sampler2");
		return;
	}

	u_Sampler3 = gl.getUniformLocation(gl.program, "u_Sampler3");
	if (!u_Sampler3) {
		console.log("Failed to get the storage location of u_Sampler3");
		return;
	}

	u_Sampler4 = gl.getUniformLocation(gl.program, "u_Sampler4");
	if (!u_Sampler4) {
		console.log("Failed to get the storage location of u_Sampler4");
		return;
	}

	u_Sampler5 = gl.getUniformLocation(gl.program, "u_Sampler5");
	if (!u_Sampler5) {
		console.log("Failed to get the storage location of u_Sampler5");
		return;
	}

	u_Sampler6 = gl.getUniformLocation(gl.program, "u_Sampler6");
	if (!u_Sampler6) {
		console.log("Failed to get the storage location of u_Sampler6");
		return;
	}

	u_Sampler7 = gl.getUniformLocation(gl.program, "u_Sampler7");
	if (!u_Sampler7) {
		console.log("Failed to get the storage location of u_Sampler7");
		return;
	}

	//get the storage of the size
	u_Size = gl.getUniformLocation(gl.program, "u_Size");

	u_ModelMatrix = gl.getUniformLocation(gl.program, "u_ModelMatrix");
	if (!u_ModelMatrix) {
		console.log("Failed to get the storage location of u_ModelMatrix");
		return;
	}

	var identity = new Matrix4();
	gl.uniformMatrix4fv(u_ModelMatrix, false, identity.elements);

	u_GlobalRotateMatrix = gl.getUniformLocation(
		gl.program,
		"u_GlobalRotateMatrix"
	);
	if (!u_GlobalRotateMatrix) {
		console.log("Failed to get the storage location of u_GlobalRotateMatrix");
		return;
	}
	gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, identity.elements);

	u_ViewMatrix = gl.getUniformLocation(gl.program, "u_ViewMatrix");
	if (!u_ViewMatrix) {
		console.log("Failed to get the storage location of u_ViewMatrix");
		return;
	}
	gl.uniformMatrix4fv(u_ViewMatrix, false, identity.elements);

	u_ProjectionMatrix = gl.getUniformLocation(gl.program, "u_ProjectionMatrix");
	if (!u_ProjectionMatrix) {
		console.log("Failed to get the storage location of u_ProjectionMatrix");
		return;
	}
	gl.uniformMatrix4fv(u_ProjectionMatrix, false, identity.elements);
}

function addActions() {
	document.getElementById("fov").addEventListener("mousemove", function () {
		g_fov = this.value;
	});

	document
		.getElementById("toggle-normals")
		.addEventListener("click", function () {
			g_showNormals = !g_showNormals;

			// Update the uniform value
			gl.uniform1i(u_whichTexture, g_showNormals ? -3 : 0);

			// Update button text
			this.textContent = g_showNormals ? "Disable Normals" : "Enable Normals";

			// Re-render scene
			renderAllShapes();
		});
}

function changeBack() {
	gl.clearColor(
		g_selected_back_color[0],
		g_selected_back_color[1],
		g_selected_back_color[2],
		1.0
	);
}

function main() {
	setupWebGL();
	connectVariablesToGLSL();
	addActions();

	document.onkeydown = function (ev) {
		keydown(ev, true);
	};
	document.onkeyup = function (ev) {
		keydown(ev, false);
	};

	canvas.onclick = function (ev) {
		if (ev.shiftKey) {
			g_walking = !g_walking;
		}
	};

	canvas.onmousemove = function (ev) {
		if (ev.buttons == 1) {
			click(ev);
		} else {
			pre_mouse_pos = null;
		}
	};

	initTextures();
	initTextures2();
	initTextures3();
	initTextures4();
	initTextures5();
	initTextures6();
	initTextures7();
	initTextures8();

	// Specify the color for clearing <canvas>
	gl.clearColor(0.3, 1.0, 1.0, 1.0);

	// Clear <canvas>
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	requestAnimationFrame(tick);
}

var pre_mouse_pos;

function click(ev) {
	let curent_mouse_pos = [ev.clientX, ev.clientY];
	if (pre_mouse_pos != null) {
		let movement_x = curent_mouse_pos[0] - pre_mouse_pos[0];
		let movement_y = (curent_mouse_pos[1] - pre_mouse_pos[1]) / 2;
		global_angle_y -= movement_y;
		global_angle_x -= movement_x;
	}
	if (ev.buttons == 1) {
		pre_mouse_pos = curent_mouse_pos;
	} else {
		pre_mouse_pos = null;
	}
}

function undo() {
	let x = gl_undolist.pop();
	if (x == 1) {
		gl_shapelist.pop();
	} else {
		gl_shapelist = gl_shapelist.slice(0, gl_shapelist.length - (x + 1));
	}
	renderAllShapes();
}

var g_startTime = performance.now() / 1000.0;
var g_seconds = performance.now() / 1000.0 - g_startTime;
var g_pauseTime = 0;

var delta_update = performance.now() / 1000.0;
var delta_time = 0;

function tick() {
	renderAllShapes();
	delta_time = performance.now() / 1000.0 - delta_update;
	delta_update = performance.now() / 1000.0;

	if (g_animating) {
		g_seconds = performance.now() / 1000.0 - g_startTime - g_pauseTime;
	} else {
		g_pauseTime = performance.now() / 1000.0 - g_startTime - g_seconds;
	}
	requestAnimationFrame(tick);
}

//global keybinds
let g_w = false;
let g_a = false;
let g_s = false;
let g_d = false;

let g_space = false;
let g_v = false;

let g_e = false;
let g_q = false;

function keydown(ev, down) {
	switch (ev.keyCode) {
		case 87: //w key
			g_w = down;
			break;

		case 65: //a key
			g_a = down;
			break;

		case 83: //s key
			g_s = down;
			break;

		case 68: //d key
			g_d = down;
			break;

		case 86: //v key
			g_v = down;
			break;

		case 69: //e key
			if (down && !g_e && g_camera.placeCube !== null) {
				g_map.cubes[g_camera.placeCube[0]][g_camera.placeCube[2]][
					g_camera.placeCube[1]
				] = new Cube();
				g_map.cubes[g_camera.placeCube[0]][g_camera.placeCube[2]][
					g_camera.placeCube[1]
				].matrix.translate(
					g_camera.placeCube[0],
					g_camera.placeCube[1],
					g_camera.placeCube[2]
				);
				g_map.cubes[g_camera.placeCube[0]][g_camera.placeCube[2]][
					g_camera.placeCube[1]
				].textureNum = g_block;
			}
			g_e = down;
			break;

		case 81: //q key
			if (down && !g_q && g_camera.RemoveCube !== null) {
				g_map.cubes[g_camera.RemoveCube[0]][g_camera.RemoveCube[2]][
					g_camera.RemoveCube[1]
				] = null;
			}
			g_q = down;
			break;
		case 49: //1 key
			g_block = 1;
			TextToHTML("Grass", "block");
			break;
		case 50: //2 key
			g_block = 0;
			TextToHTML("Lava", "block");
			break;
		case 51: //3 key
			g_block = 3;
			TextToHTML("Bamboo", "block");
			break;
		case 52: //4 key
			g_block = 4;
			TextToHTML("Stone", "block");
			break;
		case 32: //spacebar
			g_space = down;
			ev.preventDefault();
			break;
		default:
			break;
	}
}
let g_skybox = new Cube();
g_skybox.textureNum = 2;

function drawIndicator() {
	if (!g_camera.RemoveCube) return; // Ensure there's a selected cube

	let indicator = new Cube();
	indicator.color = [1.0, 1.0, 1.0, 0.4];
	indicator.textureNum = -2;

	indicator.matrix.translate(
		g_camera.RemoveCube[0],
		g_camera.RemoveCube[1] + 1.01,
		g_camera.RemoveCube[2]
	);
	indicator.matrix.scale(1, 0, 1); // Slightly larger for visibility
	// indicator.matrix.translate(0, 2.5, 0);
	gl.enable(gl.BLEND);
	gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

	indicator.render();

	// Disable blending after rendering
	gl.disable(gl.BLEND);
}

function renderAllShapes() {
	//start timer for performance tracking
	var start_time = performance.now();

	// Clear <canvas>
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	var projMat = new Matrix4();
	projMat.setPerspective(g_fov, canvas.width / canvas.height, 0.1, 100);
	gl.uniformMatrix4fv(u_ProjectionMatrix, false, projMat.elements);

	var viewMat = new Matrix4();

	g_camera.rotate(global_angle_y, global_angle_x);
	// movement code here using delta time please
	g_camera.handle_movement(g_w, g_s, g_d, g_a, g_space, g_v, delta_time);

	//set up camera matrix
	viewMat.setLookAt(
		g_camera.eye.elements[0],
		g_camera.eye.elements[1],
		g_camera.eye.elements[2],
		g_camera.at.elements[0],
		g_camera.at.elements[1],
		g_camera.at.elements[2],
		g_camera.up.elements[0],
		g_camera.up.elements[1],
		g_camera.up.elements[2]
	); // eye / at / up

	gl.uniformMatrix4fv(u_ViewMatrix, false, viewMat.elements);

	var globalRotMax = new Matrix4();

	gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMax.elements);

	g_map.render();

	g_skybox.matrix.setTranslate(
		g_camera.eye.elements[0],
		g_camera.eye.elements[1],
		g_camera.eye.elements[2]
	);
	g_skybox.matrix.scale(100, 100, 100);
	g_skybox.matrix.rotate(g_seconds, 0, 1, 0);
	g_skybox.matrix.translate(-0.5, -0.5, -0.5);

	g_skybox.render();

	let mySphere = new Sphere(20);
	mySphere.matrix.scale(4, 4, 4);
	mySphere.matrix.translate(6, 2, 6); // Move it closer to the camera
	mySphere.render();

	drawIndicator();

	g_camera.castRay();

	var identity = new Matrix4();
	gl.uniformMatrix4fv(u_ModelMatrix, false, identity.elements);

	//check end of performance and put on the page
	var duration = performance.now() - start_time;
	TextToHTML(
		"ms: " + Math.floor(duration) + " fps: " + Math.floor(10000 / duration),
		"fps"
	);
}

function TextToHTML(string, htmlID) {
	let html = document.getElementById(htmlID);

	if (!html) {
		console.log("Failed to retrive" + htmlID + "from HTML page");
	}

	html.innerHTML = string;
}
