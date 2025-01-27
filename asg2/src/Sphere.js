class Sphere {
	constructor(radius = 1.0, latitudeBands = 20, longitudeBands = 20) {
		this.type = "sphere";
		this.color = [1.0, 1.0, 1.0, 1.0]; // Default color
		this.matrix = new Matrix4(); // Transformation matrix
		this.radius = radius;
		this.latitudeBands = latitudeBands;
		this.longitudeBands = longitudeBands;
		this.vertices = [];
		this.indices = [];
		this.vertexBuffer = null;
		this.indexBuffer = null;

		this.initSphereData();
		this.initBuffers();
	}

	// Generate the sphere's vertices and indices
	initSphereData() {
		const vertices = [];
		const indices = [];

		// Generate vertices
		for (let latNumber = 0; latNumber <= this.latitudeBands; latNumber++) {
			const theta = (latNumber * Math.PI) / this.latitudeBands;
			const sinTheta = Math.sin(theta);
			const cosTheta = Math.cos(theta);

			for (
				let longNumber = 0;
				longNumber <= this.longitudeBands;
				longNumber++
			) {
				const phi = (longNumber * 2 * Math.PI) / this.longitudeBands;
				const sinPhi = Math.sin(phi);
				const cosPhi = Math.cos(phi);

				const x = cosPhi * sinTheta;
				const y = cosTheta;
				const z = sinPhi * sinTheta;

				vertices.push(this.radius * x, this.radius * y, this.radius * z);
			}
		}

		// Generate indices
		for (let latNumber = 0; latNumber < this.latitudeBands; latNumber++) {
			for (let longNumber = 0; longNumber < this.longitudeBands; longNumber++) {
				const first = latNumber * (this.longitudeBands + 1) + longNumber;
				const second = first + this.longitudeBands + 1;

				indices.push(first, second, first + 1);
				indices.push(second, second + 1, first + 1);
			}
		}

		this.vertices = vertices;
		this.indices = indices;
	}

	// Initialize buffers once
	initBuffers() {
		// Create and bind the vertex buffer
		this.vertexBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
		gl.bufferData(
			gl.ARRAY_BUFFER,
			new Float32Array(this.vertices),
			gl.STATIC_DRAW
		);

		// Create and bind the index buffer
		this.indexBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
		gl.bufferData(
			gl.ELEMENT_ARRAY_BUFFER,
			new Uint16Array(this.indices),
			gl.STATIC_DRAW
		);
	}

	// Render the sphere
	render() {
		// Pass the color to the fragment shader
		gl.uniform4f(
			u_FragColor,
			this.color[0],
			this.color[1],
			this.color[2],
			this.color[3]
		);

		// Pass the transformation matrix to the shader
		gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

		// Bind the vertex buffer
		gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
		gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);
		gl.enableVertexAttribArray(a_Position);

		// Bind the index buffer
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);

		// Draw the sphere
		gl.drawElements(gl.TRIANGLES, this.indices.length, gl.UNSIGNED_SHORT, 0);
	}
}
