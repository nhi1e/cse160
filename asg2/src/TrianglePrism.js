class TrianglePrism {
	constructor() {
		this.type = "trianglePrism";
		this.color = [1.0, 1.0, 1.0, 1.0]; // Default color
		this.matrix = new Matrix4(); // Transformation matrix

		// Define unique vertices
		this.vertices = new Float32Array([
			// Front face (triangle)
			0.0,
			0.0,
			0.0, // 0
			0.5,
			1.0,
			0.0, // 1
			1.0,
			0.0,
			0.0, // 2

			// Back face (triangle)
			0.0,
			0.0,
			1.0, // 3
			0.5,
			1.0,
			1.0, // 4
			1.0,
			0.0,
			1.0, // 5
		]);

		// Define indices for efficient rendering
		this.indices = new Uint16Array([
			// Front and back triangles
			0,
			1,
			2, // Front triangle
			3,
			4,
			5, // Back triangle

			// Side faces (rectangles split into 2 triangles each)
			0,
			2,
			5,
			0,
			5,
			3, // Bottom face
			1,
			4,
			5,
			1,
			5,
			2, // Right face
			1,
			4,
			3,
			1,
			3,
			0, // Left face
		]);

		this.initBuffers();
	}

	initBuffers() {
		// Create vertex buffer
		this.vertexBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, this.vertices, gl.STATIC_DRAW);

		// Create index buffer
		this.indexBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.indices, gl.STATIC_DRAW);
	}

	render() {
		// Pass transformation matrix to shader
		gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

		// Pass color to shader
		gl.uniform4f(u_FragColor, ...this.color);

		// Bind buffers
		gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
		gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);
		gl.enableVertexAttribArray(a_Position);

		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);

		// Draw prism using indices
		gl.drawElements(gl.TRIANGLES, this.indices.length, gl.UNSIGNED_SHORT, 0);
	}
}
