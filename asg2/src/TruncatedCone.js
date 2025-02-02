class TruncatedCone {
	constructor(baseRadius = 1.0, topRadius = 0.5, height = 2.0, numSlices = 36) {
		this.type = "truncatedCone";
		this.color = [0.52, 0, 0.12, 1.0]; // Default color
		this.matrix = new Matrix4(); // Transformation matrix
		this.baseRadius = baseRadius;
		this.topRadius = topRadius;
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

		// Center points for base and top
		const baseCenterIndex = 2 * this.numSlices;
		const topCenterIndex = baseCenterIndex + 1;

		vertices.push(0.0, 0.0, 0.0); // Base center
		vertices.push(0.0, this.height, 0.0); // Top center

		for (let i = 0; i < this.numSlices; i++) {
			let angle = i * angleStep;
			let cosA = Math.cos(angle);
			let sinA = Math.sin(angle);

			// Base circle vertex
			vertices.push(this.baseRadius * cosA, 0.0, this.baseRadius * sinA);
			// Top circle vertex
			vertices.push(this.topRadius * cosA, this.height, this.topRadius * sinA);
		}

		for (let i = 0; i < this.numSlices; i++) {
			let next = (i + 1) % this.numSlices;

			// Side faces (quad as two triangles)
			indices.push(i * 2, i * 2 + 1, next * 2 + 1);
			indices.push(i * 2, next * 2 + 1, next * 2);

			// Base circle
			indices.push(baseCenterIndex, i * 2, next * 2);

			// Top circle
			indices.push(topCenterIndex, next * 2 + 1, i * 2 + 1);
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
