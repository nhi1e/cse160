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
