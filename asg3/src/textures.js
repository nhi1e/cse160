function initTextures() {
	var image = new Image();
	if (!image) {
		console.log("Failed to create the image object");
		return false;
	}
	image.onload = function () {
		sendTextureToGLSL(image);
	};

	image.src = "../textures/wood.png";

	return true;
}

function sendTextureToGLSL(image) {
	var texture = gl.createTexture();
	if (!texture) {
		console.log("Failed to create the texture object");
		return false;
	}

	gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
	gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(gl.TEXTURE_2D, texture);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
	gl.uniform1i(u_Sampler0, 0);
}

// function initTextures2() {
// 	var image2 = new Image();
// 	if (!image2) {
// 		console.log("Failed to create the image object");
// 		return false;
// 	}
// 	image2.onload = function () {
// 		sendTextureToGLSL2(image2);
// 	};

// 	image2.src = "../textures/grass4.png";

// 	return true;
// }
function updateSeasonTexture(imageSrc) {
	var image = new Image();
	image.onload = function () {
		gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
		gl.activeTexture(gl.TEXTURE1); // Grass is always in TEXTURE1
		gl.bindTexture(gl.TEXTURE_2D, grassTexture);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
		gl.uniform1i(u_Sampler1, 1);
	};
	image.src = imageSrc; // Load new season texture
	console.log("Season texture updated");
	renderAllShapes();
}

let grassTexture; // Store grass texture handle

function initTextures2() {
	var image2 = new Image();
	image2.onload = function () {
		grassTexture = gl.createTexture();
		gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
		gl.activeTexture(gl.TEXTURE1);
		gl.bindTexture(gl.TEXTURE_2D, grassTexture);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image2);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
		gl.uniform1i(u_Sampler1, 1);
	};

	image2.src = "../textures/grass_spring.png"; // Start with Spring
}

function sendTextureToGLSL2(image2) {
	var texture2 = gl.createTexture();
	if (!texture2) {
		console.log("Failed to create the texture object");
		return false;
	}

	gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
	gl.activeTexture(gl.TEXTURE1);
	gl.bindTexture(gl.TEXTURE_2D, texture2);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image2);
	gl.uniform1i(u_Sampler1, 1);
}

let skyTexture; // Store sky texture handle

function initTextures3() {
	var image3 = new Image();
	image3.onload = function () {
		skyTexture = gl.createTexture();
		gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
		gl.activeTexture(gl.TEXTURE2);
		gl.bindTexture(gl.TEXTURE_2D, skyTexture);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image3);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
		gl.uniform1i(u_Sampler2, 2);
	};

	image3.src = "../textures/sky_spring.png"; // ✅ Start with Spring Sky
}

function sendTextureToGLSL3(image3) {
	var texture3 = gl.createTexture();
	if (!texture3) {
		console.log("Failed to create the texture object");
		return false;
	}

	gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
	gl.activeTexture(gl.TEXTURE2);
	gl.bindTexture(gl.TEXTURE_2D, texture3);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image3);
	gl.uniform1i(u_Sampler2, 2);
}

function initTextures4() {
	var image4 = new Image();
	if (!image4) {
		console.log("Failed to create the image object");
		return false;
	}
	image4.onload = function () {
		sendTextureToGLSL4(image4);
	};
	image4.src = "../textures/bamboo.png";

	return true;
}

function sendTextureToGLSL4(image4) {
	var texture4 = gl.createTexture();
	if (!texture4) {
		console.log("Failed to create the texture object");
		return false;
	}

	gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
	gl.activeTexture(gl.TEXTURE3);
	gl.bindTexture(gl.TEXTURE_2D, texture4);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image4);
	gl.uniform1i(u_Sampler3, 3);
}

function initTextures5() {
	var image5 = new Image();
	if (!image5) {
		console.log("Failed to create the image object");
		return false;
	}
	image5.onload = function () {
		sendTextureToGLSL5(image5);
	};

	image5.src = "../textures/stone.png";

	return true;
}

function sendTextureToGLSL5(image5) {
	var texture5 = gl.createTexture();
	if (!texture5) {
		console.log("Failed to create the texture object");
		return false;
	}

	gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
	gl.activeTexture(gl.TEXTURE4);
	gl.bindTexture(gl.TEXTURE_2D, texture5);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image5);
	gl.uniform1i(u_Sampler4, 4);
}

function initTextures6() {
	var image6 = new Image();
	if (!image6) {
		console.log("Failed to create the image object");
		return false;
	}
	image6.onload = function () {
		sendTextureToGLSL6(image6);
	};

	image6.src = "../textures/water.png";

	return true;
}

function sendTextureToGLSL6(image6) {
	var texture6 = gl.createTexture();
	if (!texture6) {
		console.log("Failed to create the texture object");
		return false;
	}

	gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
	gl.activeTexture(gl.TEXTURE5);
	gl.bindTexture(gl.TEXTURE_2D, texture6);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image6);
	gl.uniform1i(u_Sampler5, 5);
}

//tree trunk
function initTextures7() {
	var image7 = new Image();
	if (!image7) {
		console.log("Failed to create the image object");
		return false;
	}
	image7.onload = function () {
		trunkTexture = gl.createTexture();
		gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
		gl.activeTexture(gl.TEXTURE6);
		gl.bindTexture(gl.TEXTURE_2D, trunkTexture);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image7);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
		gl.uniform1i(u_Sampler6, 6);
	};

	image7.src = "../textures/bark_spring.png"; // Start with Spring texture
}
function updateTrunkTexture(imageSrc) {
	var image = new Image();
	image.onload = function () {
		gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
		gl.activeTexture(gl.TEXTURE6); // Tree trunk uses TEXTURE7
		gl.bindTexture(gl.TEXTURE_2D, trunkTexture);

		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

		gl.uniform1i(u_Sampler6, 6);
		console.log("✅ Updated tree trunk texture:", imageSrc);

		g_map.updateTrunkTextures(); // Apply the new texture to all trees
	};

	image.src = imageSrc;
}

// function sendTextureToGLSL7(image7) {
// 	var texture7 = gl.createTexture();
// 	if (!texture7) {
// 		console.log("Failed to create the texture object");
// 		return false;
// 	}
// 	console.log("bark texture");

// 	gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
// 	gl.activeTexture(gl.TEXTURE6);
// 	gl.bindTexture(gl.TEXTURE_2D, texture6);
// 	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
// 	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image7);
// 	gl.uniform1i(u_Sampler6, 6);
// }
//end of trunk texture

//leaf texture
function initTextures8() {
	var image8 = new Image();
	if (!image8) {
		console.log("Failed to create the image object");
		return false;
	}
	image8.onload = function () {
		leafTexture = gl.createTexture();
		gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
		gl.activeTexture(gl.TEXTURE7);
		gl.bindTexture(gl.TEXTURE_2D, leafTexture);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image8);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
		gl.uniform1i(u_Sampler7, 7);
	};

	image8.src = "../textures/leaf_spring.png"; // ✅ Start with Spring Leaves
}

function updateLeafTexture(imageSrc) {
	var image = new Image();
	image.onload = function () {
		gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
		gl.activeTexture(gl.TEXTURE7); // Leaves use TEXTURE7
		gl.bindTexture(gl.TEXTURE_2D, leafTexture);

		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

		gl.uniform1i(u_Sampler7, 7);
		console.log("✅ Updated leaf texture:", imageSrc);

		g_map.updateLeafTextures(); // Apply the new texture to all trees
	};

	image.src = imageSrc;
}

function sendTextureToGLSL8(image8) {
	var texture8 = gl.createTexture();
	if (!texture8) {
		console.log("Failed to create the texture object");
		return false;
	}
	console.log("cherry texture");

	gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
	gl.activeTexture(gl.TEXTURE7);
	gl.bindTexture(gl.TEXTURE_2D, texture8);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image8);
	gl.uniform1i(u_Sampler7, 7);
}

//end of leaf texture
