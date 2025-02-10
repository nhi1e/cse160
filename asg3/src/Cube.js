class Cube {
	constructor(textureNum = 0) {
		// Accept textureNum
		this.type = "cube";
		this.color = [1.0, 1.0, 1.0, 1.0];
		this.matrix = new Matrix4();
		this.textureNum = textureNum; // Store texture type
	}

	render() {
		var rgba = this.color;

		gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);
		gl.uniform1i(u_whichTexture, this.textureNum); // Pass the flag to the shader
		if (this.textureNum === -2) {
			gl.uniform4fv(u_FragColor, new Float32Array(rgba)); // Set solid color
		}
		// Define vertices & UVs for all 6 faces

		let vertices = [
			// Front face
			0, 0, 0, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 0,

			// Back face
			0, 0, 1, 1, 1, 1, 1, 0, 1, 0, 0, 1, 0, 1, 1, 1, 1, 1,

			// Top face
			0, 1, 0, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0,

			// Bottom face
			0, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 1, 0, 1,

			// Right face
			1, 0, 0, 1, 1, 0, 1, 1, 1, 1, 0, 0, 1, 0, 1, 1, 1, 1,

			// Left face
			0, 0, 0, 0, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 1, 0, 1, 1,
		];

		let uv = [
			// Front
			0.5, 0.25, 0.25, 0.5, 0.25, 0.25, 0.5, 0.25, 0.5, 0.5, 0.25, 0.5,

			// Back
			1, 0.25, 0.75, 0.5, 0.75, 0.25, 1, 0.25, 1, 0.5, 0.75, 0.5,

			// Top
			0.5, 0.5, 0.25, 0.5, 0.25, 0.75, 0.5, 0.5, 0.25, 0.75, 0.5, 0.75,

			// Bottom
			0.5, 0, 0.25, 0.25, 0.25, 0, 0.5, 0, 0.5, 0.25, 0.25, 0.25,

			// Right
			0.5, 0.25, 0.5, 0.5, 0.75, 0.5, 0.5, 0.25, 0.75, 0.25, 0.75, 0.5,

			// Left
			0, 0.25, 0, 0.5, 0.25, 0.5, 0, 0.25, 0.25, 0.25, 0.25, 0.5,
		];

		drawTriangle3DUV(vertices, uv);
	}
}
