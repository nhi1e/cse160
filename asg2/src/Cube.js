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
			0, // Front face
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
			1, // Back face
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

	initBuffers() {
		// Create buffers for vertices and indices
		this.vertexBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, this.vertices, gl.STATIC_DRAW);

		this.indexBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.indices, gl.STATIC_DRAW);
	}

	render() {
		// Pass transformation matrix to shader
		gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

		// Bind buffers
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

	drawFacesWithDifferentColors() {
		// Define colors for each face
		const faceColors = [
			this.color,
			[
				this.color[0] / 1.2,
				this.color[1] / 1.2,
				this.color[2] / 7.7,
				this.color[3],
			],
			[
				this.color[0] / 1.3,
				this.color[1] / 1.1,
				this.color[2] / 5.0,
				this.color[3],
			],
			[
				this.color[0] / 1.1,
				this.color[1] / 1.3,
				this.color[2] / 4.5,
				this.color[3],
			],
			[
				this.color[0] / 1.4,
				this.color[1] / 1.1,
				this.color[2] / 6.0,
				this.color[3],
			],
			[
				this.color[0] / 1.2,
				this.color[1] / 1.5,
				this.color[2] / 3.8,
				this.color[3],
			],
		];

		for (let i = 0; i < 6; i++) {
			gl.uniform4f(u_FragColor, ...faceColors[i]);
			gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, i * 12);
		}
	}
}
