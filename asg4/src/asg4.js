// Vertex shader program ==========================================
var VSHADER_SOURCE = `
   precision mediump float;
   attribute vec4 a_Position;
   attribute vec2 a_UV;
   attribute vec3 a_Normal;
   varying vec2 v_UV;
   varying vec3 v_Normal;
   varying vec4 v_VertPos;
   uniform mat4 u_ModelMatrix;
   uniform mat4 u_NormalMatrix;
   uniform mat4 u_GlobalRotateMatrix;
   uniform mat4 u_ViewMatrix;
   uniform mat4 u_ProjectionMatrix;
   void main() {
      gl_Position = u_ProjectionMatrix * u_ViewMatrix * u_GlobalRotateMatrix * u_ModelMatrix * a_Position;
      v_UV = a_UV;
      v_Normal = normalize(vec3(u_NormalMatrix * vec4(a_Normal,1)));
      v_VertPos = u_ModelMatrix * a_Position;
   }`;

// Fragment shader program ========================================
var FSHADER_SOURCE = `
precision mediump float;
	varying vec2 v_UV;
	varying vec3 v_Normal;
	uniform vec4 u_FragColor;
	uniform sampler2D u_Sampler0;
	uniform int u_whichTexture;
	uniform vec3 u_lightPos;
	uniform vec3 u_cameraPos;
	varying vec4 v_VertPos;
	uniform bool u_lightOn;

	// Spotlight uniforms
	uniform vec3 u_spotPosition;
	uniform vec3 u_spotDirection;
	uniform float u_spotCutoff;
	uniform float u_spotExponent;
	uniform bool u_spotlightOn;
	uniform vec3 u_spotColor; // Added: Spotlight color



	void main() {
		if(u_whichTexture == -3){
			gl_FragColor = vec4((v_Normal+1.0)/2.0, 1.0); // Use normal
		} else if(u_whichTexture == -2){
			gl_FragColor = u_FragColor;                  // Use color
		} else if (u_whichTexture == -1){
			gl_FragColor = vec4(v_UV, 1.0, 1.0);         // Use UV debug color
		} else if(u_whichTexture == 0){
			gl_FragColor = texture2D(u_Sampler0, v_UV);  // Use texture0
		} else {
			gl_FragColor = vec4(1,.2,.2,1);              // Error, Red
		}

		vec3 lightVector = u_lightPos-vec3(v_VertPos);
		float r = length(lightVector);

		// Red/Green Distance Visualization
		// if(r<1.0){
		//    gl_FragColor = vec4(1,0,0,1);
		// } else if (r<2.0){
		//    gl_FragColor = vec4(0,1,0,1);
		// }

		// Light Falloff Visualization 1/r^2
		// gl_FragColor = vec4(vec3(gl_FragColor)/(r*r),1);

		// N dot L
		vec3 L = normalize(lightVector);
		vec3 N = normalize(v_Normal);
		float nDotL = max(dot(N,L), 0.0);

		// Reflection
		vec3 R = reflect(-L,N);

		// eye
		vec3 E = normalize(u_cameraPos-vec3(v_VertPos));

		// Specular
		float specular = pow(max(dot(E,R), 0.0), 10.0)* 0.7;

		vec3 diffuse = vec3(gl_FragColor) * nDotL * 0.9;
		vec3 ambient = vec3(gl_FragColor) * 0.3;
		vec3 finalColor = ambient;

		if(u_lightOn){
			finalColor += diffuse + specular;
		}

	// Spotlight Calculation
	if (u_spotlightOn) {
        vec3 spotDir = normalize(-u_spotDirection);
        vec3 spotVector = normalize(u_spotPosition - vec3(v_VertPos));
        float spotCosine = dot(spotDir, spotVector);

        if (spotCosine > cos(radians(u_spotCutoff))) {
            float spotFactor = pow(spotCosine, u_spotExponent);
            vec3 spotEffect = u_spotColor * spotFactor; // Spotlight color influence
            finalColor += spotEffect;
        }
    }
	gl_FragColor = vec4(finalColor, 1.0);

    }
`;

// Global Variables ===============================================
var gl;
var canvas;
var a_Position;
var a_UV;
var a_Normal;
var u_FragColor;
var u_Size;
var u_ModelMatrix;
var u_NormalMatrix;
var u_ProjectionMatrix;
var u_ViewMatrix;
var u_GlobalRotateMatrix;
var u_Sampler0;
var u_Sampler1;
var u_whichTexture;
var u_lightPos;
var u_cameraPos;

var g_camera;

// Camera Movement
var u_spotPosition;
var u_spotDirection;
var u_spotCutoff;
var u_spotExponent;
var g_spotlightOn;

// UI
var gAnimalGlobalRotation = 0; // Camera
var g_jointAngle = 0; // Joint 1
var head_animation = 0;
var g_jointAngle2 = 0; // Joint 2
var g_Animation = false; // Joint 2
var g_normalOn = false;
var g_lightOn = true;
var g_lightPos = [0, 0.6, 0];
var g_spotlightPos = [0.5, 1.0, -2.5]; // Default spotlight position

// Animation
var g_startTime = performance.now() / 1000.0;
var g_seconds = performance.now() / 1000.0 - g_startTime;

// HTML ============================================================
function addActionsForHtmlUI() {
	// Color Slider Events
	document
		.getElementById("camera")
		.addEventListener("mousemove", function (ev) {
			if (ev.buttons == 1) {
				gAnimalGlobalRotation = this.value;
				renderScene();
			}
		});
	document
		.getElementById("lightx")
		.addEventListener("mousemove", function (ev) {
			if (ev.buttons == 1) {
				g_lightPos[0] = this.value / 100;
				renderScene();
			}
		});
	document
		.getElementById("lighty")
		.addEventListener("mousemove", function (ev) {
			if (ev.buttons == 1) {
				g_lightPos[1] = this.value / 100;
				renderScene();
			}
		});
	document
		.getElementById("lightz")
		.addEventListener("mousemove", function (ev) {
			if (ev.buttons == 1) {
				g_lightPos[2] = this.value / 100;
				renderScene();
			}
		});

	document.getElementById("normal_on").onclick = function () {
		g_normalOn = true;
	};
	document.getElementById("normal_off").onclick = function () {
		g_normalOn = false;
	};
	document.getElementById("light_on").onclick = function () {
		g_lightOn = true;
	};
	document.getElementById("light_off").onclick = function () {
		g_lightOn = false;
	};
	document.getElementById("spotlight_on").onclick = function () {
		g_spotlightOn = true;
		renderScene();
	};
	document.getElementById("spotlight_off").onclick = function () {
		g_spotlightOn = false;
		renderScene();
	};
	document
		.getElementById("spotlightx")
		.addEventListener("mousemove", function (ev) {
			if (ev.buttons == 1) {
				g_spotlightPos[0] = parseFloat(this.value) / 100;
				renderScene();
			}
		});
	document
		.getElementById("spotlighty")
		.addEventListener("mousemove", function (ev) {
			if (ev.buttons == 1) {
				g_spotlightPos[1] = parseFloat(this.value) / 100;
				renderScene();
			}
		});
	document
		.getElementById("spotlightz")
		.addEventListener("mousemove", function (ev) {
			if (ev.buttons == 1) {
				g_spotlightPos[2] = parseFloat(this.value) / 100;
				renderScene();
			}
		});
}

// Get Canvas and GL Context ======================================
function setupWebGL() {
	// Retrieve <canvas> element
	canvas = document.getElementById("asg4");
	if (!canvas) {
		console.log("Failed to retrieve the <canvas> element");
		return;
	}

	// Rendering context for WebGL
	gl = getWebGLContext(canvas);
	if (!gl) {
		console.log("Failed to get the rendering context for WebGL");
		return;
	}

	gl.enable(gl.DEPTH_TEST);
}

// Compile Shader Programs and connect js to GLSL =================
function connectVariablesToGLSL() {
	// Initialize shaders ==========================================
	if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
		console.log("Failed to intialize shaders.");
		return;
	}

	// Get the storage location of attribute variable ==============
	a_Position = gl.getAttribLocation(gl.program, "a_Position");
	if (a_Position < 0) {
		console.log("Failed to get the storage location of a_Position");
		return;
	}

	a_UV = gl.getAttribLocation(gl.program, "a_UV");
	if (a_UV < 0) {
		console.log("Failed to get the storage location of a_UV");
		return;
	}

	a_Normal = gl.getAttribLocation(gl.program, "a_Normal");
	if (a_Normal < 0) {
		console.log("Failed to get the storage location of a_Normal");
		return;
	}

	// Get the storage location of attribute variable ==============
	u_whichTexture = gl.getUniformLocation(gl.program, "u_whichTexture");
	if (!u_whichTexture) {
		console.log("Failed to get u_whichTexture");
		return;
	}

	// Get the storage location of attribute variable ==============
	u_lightOn = gl.getUniformLocation(gl.program, "u_lightOn");
	if (!u_lightOn) {
		console.log("Failed to get u_lightOn");
		return;
	}

	// Get the storage location of attribute variable ==============
	u_FragColor = gl.getUniformLocation(gl.program, "u_FragColor");
	if (!u_FragColor) {
		console.log("Failed to get u_FragColor");
		return;
	}

	// Get the storage location of attribute variable ==============
	u_lightPos = gl.getUniformLocation(gl.program, "u_lightPos");
	if (!u_lightPos) {
		console.log("Failed to get u_lightPos");
		return;
	}

	// Get the storage location of attribute variable ==============
	u_cameraPos = gl.getUniformLocation(gl.program, "u_cameraPos");
	if (!u_cameraPos) {
		console.log("Failed to get u_cameraPos");
		return;
	}

	u_ModelMatrix = gl.getUniformLocation(gl.program, "u_ModelMatrix");
	if (!u_ModelMatrix) {
		console.log("Failed to get u_ModelMatrix");
		return;
	}

	u_GlobalRotateMatrix = gl.getUniformLocation(
		gl.program,
		"u_GlobalRotateMatrix"
	);
	if (!u_GlobalRotateMatrix) {
		console.log("Failed to get u_GlobalRotateMatrix");
		return;
	}

	u_ViewMatrix = gl.getUniformLocation(gl.program, "u_ViewMatrix");
	if (!u_ViewMatrix) {
		console.log("Failed to get u_ViewMatrix");
		return;
	}

	u_NormalMatrix = gl.getUniformLocation(gl.program, "u_NormalMatrix");
	if (!u_NormalMatrix) {
		console.log("Failed to get u_NormalMatrix");
		return;
	}

	u_ProjectionMatrix = gl.getUniformLocation(gl.program, "u_ProjectionMatrix");
	if (!u_ProjectionMatrix) {
		console.log("Failed to get u_ProjectionMatrix");
		return;
	}

	// Get the storage location of u_Sampler0
	u_Sampler0 = gl.getUniformLocation(gl.program, "u_Sampler0");
	if (!u_Sampler0) {
		console.log("Failed to get the storage location of u_Sampler0");
		return false;
	}

	var identityM = new Matrix4();
	gl.uniformMatrix4fv(u_ModelMatrix, false, identityM.elements);

	// Existing light uniforms
	u_lightOn = gl.getUniformLocation(gl.program, "u_lightOn");

	// Spotlight uniforms
	u_spotPosition = gl.getUniformLocation(gl.program, "u_spotPosition");
	u_spotDirection = gl.getUniformLocation(gl.program, "u_spotDirection");
	u_spotCutoff = gl.getUniformLocation(gl.program, "u_spotCutoff");
	u_spotExponent = gl.getUniformLocation(gl.program, "u_spotExponent");
	u_spotlightOn = gl.getUniformLocation(gl.program, "u_spotlightOn");
	u_spotColor = gl.getUniformLocation(gl.program, "u_spotColor");
	if (
		!u_spotPosition ||
		!u_spotDirection ||
		!u_spotCutoff ||
		!u_spotExponent ||
		!u_spotlightOn
	) {
		console.log("Failed to get spotlight uniforms.");
		return;
	}
}

// Texture Stuff ==================================================
function initTextures() {
	var image = new Image(); // Create the image object
	// Register the event handler to be called on loading an image
	image.onload = function () {
		sendTextureToTEXTURE0(image);
	};
	image.src = "sphere.png";
	return true;
}

function isPowerOf2(value) {
	return (value & (value - 1)) == 0;
}

function sendTextureToTEXTURE0(image) {
	var texture = gl.createTexture();
	if (!texture) {
		console.log("Failed to create the texture object");
		return false;
	}

	gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); // Flip the image's y axis
	gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(gl.TEXTURE_2D, texture);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);

	if (isPowerOf2(image.width) && isPowerOf2(image.height)) {
		gl.generateMipmap(gl.TEXTURE_2D);
	} else {
		// Set the texture parameters
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
	}

	gl.uniform1i(u_Sampler0, 0);
}

// Main ===========================================================
function main() {
	g_camera = new Camera();

	setupWebGL();
	connectVariablesToGLSL();
	addActionsForHtmlUI();

	document.onkeydown = keydown;

	initTextures();

	// Specify the color for clearing <canvas>
	gl.clearColor(0.0, 0.0, 0.0, 1.0);

	requestAnimationFrame(tick);
} // end of main

// Movement =======================================================
function convertCoordinatesEventToGL(ev) {
	var x = ev.clientX; // x coordinate of a mouse pointer
	var y = ev.clientY; // y coordinate of a mouse pointer
	var rect = ev.target.getBoundingClientRect();

	// set coordinates based on origin
	x = (x - rect.left - canvas.width / 2) / (canvas.width / 2);
	y = (canvas.height / 2 - (y - rect.top)) / (canvas.height / 2);

	return [x, y];
}

function mouseCam(ev) {
	coord = convertCoordinatesEventToGL(ev);
	if (coord[0] < 0.5) {
		// left side
		g_camera.panMLeft(coord[0] * -10);
	} else {
		g_camera.panMRight(coord[0] * -10);
	}
}

function keydown(ev) {
	if (ev.keyCode == 39 || ev.keyCode == 68) {
		// Right Arrow or D
		g_camera.right();
	} else if (ev.keyCode == 37 || ev.keyCode == 65) {
		// Left Arrow or A
		g_camera.left();
	} else if (ev.keyCode == 38 || ev.keyCode == 87) {
		// up Arrow or W
		g_camera.forward();
	} else if (ev.keyCode == 40 || ev.keyCode == 83) {
		// down Arrow or S
		g_camera.back();
	} else if (ev.keyCode == 81) {
		// Q
		g_camera.panLeft();
	} else if (ev.keyCode == 69) {
		// E
		g_camera.panRight();
	}
	renderScene();
}

// TICK ===========================================================
function tick() {
	g_seconds = performance.now() / 1000.0 - g_startTime;
	updateAnimationAngles();
	renderScene();
	requestAnimationFrame(tick);
}

// renderScene ====================================================

function renderScene() {
	var projMatrix = new Matrix4();
	projMatrix.setPerspective(90, (1 * canvas.width) / canvas.height, 0.1, 100);
	gl.uniformMatrix4fv(u_ProjectionMatrix, false, projMatrix.elements);

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
	var globalRotMat = new Matrix4().rotate(gAnimalGlobalRotation, 0, 1, 0);
	gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements);

	gl.uniform1i(u_lightOn, g_lightOn);
	gl.uniform1i(u_spotlightOn, g_spotlightOn);

	// Set spotlight properties
	gl.uniform3fv(u_spotPosition, new Float32Array(g_spotlightPos));
	gl.uniform3fv(u_spotDirection, new Float32Array([0.0, -1.0, 0.0]));
	gl.uniform1f(u_spotCutoff, 30.0); // Cutoff angle in degrees
	gl.uniform1f(u_spotExponent, 10.0); // Spot intensity falloff
	const spotColor = [0.3, 0.3, 0.9]; // Warm yellow spotlight
	gl.uniform3fv(u_spotColor, new Float32Array(spotColor));

	// Clear <canvas>
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	gl.clear(gl.COLOR_BUFFER_BIT);

	renderAllShapes();
}

function updateAnimationAngles() {
	g_lightPos[0] = 2 * Math.cos(g_seconds);
}
