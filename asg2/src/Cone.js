class Cone {
	constructor(baseRadius = 1.0, height = 2.0, numSlices = 36) {
		this.type = "cone";
		this.color = [0.05, 0.25, 0.05, 1]; // Default color
		this.matrix = new Matrix4(); // Transformation matrix
		this.baseRadius = baseRadius;
		this.height = height;
		this.numSlices = numSlices;

		// WebGL Buffers
		this.vertexBuffer = null;
		this.indexBuffer = null;
		this.initBuffers();
	}

	initBuffers() {
		const vertices = [];
		const indices = [];
		const angleStep = (2 * Math.PI) / this.numSlices;

		// Tip of the cone
		const tipIndex = 0;
		vertices.push(0.0, this.height, 0.0); // (x, y, z)

		// Base circle vertices
		for (let i = 0; i < this.numSlices; i++) {
			let angle = i * angleStep;
			let cosA = Math.cos(angle);
			let sinA = Math.sin(angle);

			vertices.push(this.baseRadius * cosA, 0.0, this.baseRadius * sinA);
		}

		// Base center
		const baseCenterIndex = this.numSlices + 1;
		vertices.push(0.0, 0.0, 0.0);

		// Side faces (connect base circle to tip)
		for (let i = 1; i <= this.numSlices; i++) {
			let next = i + 1;
			if (next > this.numSlices) next = 1; // Wrap around
			indices.push(tipIndex, i, next);
		}

		// Base circle (triangles fan out from center)
		for (let i = 1; i <= this.numSlices; i++) {
			let next = i + 1;
			if (next > this.numSlices) next = 1; // Wrap around
			indices.push(baseCenterIndex, next, i);
		}

		// Create and bind buffers
		this.vertexBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

		this.indexBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
		gl.bufferData(
			gl.ELEMENT_ARRAY_BUFFER,
			new Uint16Array(indices),
			gl.STATIC_DRAW
		);

		this.numIndices = indices.length;
	}

	render() {
		gl.uniform4f(u_FragColor, ...this.color);
		gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

		gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
		gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);
		gl.enableVertexAttribArray(a_Position);

		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
		gl.drawElements(gl.TRIANGLES, this.numIndices, gl.UNSIGNED_SHORT, 0);
	}
}
