class Cube {
	constructor() {
		this.type = "cube";
		this.color = [1.0, 1.0, 1.0, 1.0]; // Default color
		this.matrix = new Matrix4();
		this.uniformFaceColor = false;

		// Define cube vertices (8 unique vertices)
		this.vertices = new Float32Array([
			0,
			0,
			0,
			1,
			0,
			0,
			1,
			1,
			0,
			0,
			1,
			0, // Front
			0,
			0,
			1,
			1,
			0,
			1,
			1,
			1,
			1,
			0,
			1,
			1, // Back
		]);

		// Define indices to reuse vertices (draws 12 triangles)
		this.indices = new Uint16Array([
			0,
			1,
			2,
			0,
			2,
			3, // Front
			1,
			5,
			6,
			1,
			6,
			2, // Right
			5,
			4,
			7,
			5,
			7,
			6, // Back
			4,
			0,
			3,
			4,
			3,
			7, // Left
			3,
			2,
			6,
			3,
			6,
			7, // Top
			4,
			5,
			1,
			4,
			1,
			0, // Bottom
		]);

		// Initialize WebGL buffers
		this.initBuffers();
	}

	/**
	 * Initializes the vertex and index buffers once
	 */
	initBuffers() {
		this.vertexBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, this.vertices, gl.STATIC_DRAW);

		this.indexBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.indices, gl.STATIC_DRAW);
	}

	/**
	 * Renders the cube efficiently by minimizing buffer rebindings
	 */
	render() {
		// Pass transformation matrix to shader
		gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

		// Bind buffers once per frame
		gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
		gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);
		gl.enableVertexAttribArray(a_Position);

		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);

		if (this.uniformFaceColor) {
			gl.uniform4f(u_FragColor, ...this.color);
			gl.drawElements(gl.TRIANGLES, this.indices.length, gl.UNSIGNED_SHORT, 0);
		} else {
			this.drawFacesWithDifferentColors();
		}
	}

	/**
	 * Draws each cube face with different colors (corrected logic)
	 */
	drawFacesWithDifferentColors() {
		// Front of cube (tinted color)
		gl.uniform4f(
			u_FragColor,
			this.color[0] / 1.23229,
			this.color[1] / 1.28,
			this.color[2] / 7.79394,
			this.color[3]
		);
		gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);

		// Top of cube (default color)
		gl.uniform4f(
			u_FragColor,
			this.color[0],
			this.color[1],
			this.color[2],
			this.color[3]
		);
		gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 24);

		// Bottom of cube (default color)
		gl.uniform4f(
			u_FragColor,
			this.color[0],
			this.color[1],
			this.color[2],
			this.color[3]
		);
		gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 48);

		// Right of cube
		gl.uniform4f(
			u_FragColor,
			this.color[0],
			this.color[1],
			this.color[2],
			this.color[3]
		);
		gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 12);

		// Left of cube
		gl.uniform4f(
			u_FragColor,
			this.color[0],
			this.color[1],
			this.color[2],
			this.color[3]
		);
		gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 36);
	}
}
