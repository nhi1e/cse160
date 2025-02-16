class Cube {
	static vertBuffer = null;
	static uvBuffer = null;

	constructor() {
		this.type = "cube";
		this.color = [1.0, 0.0, 0.0, 1];
		this.matrix = new Matrix4();
		this.textureNum = 0;

		// 1x1 cube vertices (origin at corner)
		this.vertices = new Float32Array([
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
			0,
			1,
			1,
			1,
			1,
			0,
			1,
			1, // back
			1,
			0,
			1,
			1,
			0,
			0,
			1,
			1,
			0,
			1,
			0,
			1,
			1,
			1,
			0,
			1,
			1,
			1, // right
			1,
			0,
			0,
			0,
			0,
			0,
			0,
			1,
			0,
			1,
			0,
			0,
			0,
			1,
			0,
			1,
			1,
			0, // front
			0,
			0,
			0,
			0,
			0,
			1,
			0,
			1,
			1,
			0,
			0,
			0,
			0,
			1,
			1,
			0,
			1,
			0, // left
			0,
			1,
			1,
			1,
			1,
			1,
			1,
			1,
			0,
			0,
			1,
			1,
			1,
			1,
			0,
			0,
			1,
			0, // top
			1,
			0,
			1,
			0,
			0,
			1,
			0,
			0,
			0,
			1,
			0,
			1,
			0,
			0,
			0,
			1,
			0,
			0, // bottom
		]);

		// Texture UV mapping
		this.uvCoords = new Float32Array([
			0.75,
			0.25,
			1.0,
			0.25,
			1.0,
			0.5,
			0.75,
			0.25,
			1.0,
			0.5,
			0.75,
			0.5, // back
			0.5,
			0.25,
			0.75,
			0.25,
			0.75,
			0.5,
			0.5,
			0.25,
			0.75,
			0.5,
			0.5,
			0.5, // right
			0.25,
			0.25,
			0.5,
			0.25,
			0.5,
			0.5,
			0.25,
			0.25,
			0.5,
			0.5,
			0.25,
			0.5, // front
			0.0,
			0.25,
			0.25,
			0.25,
			0.25,
			0.5,
			0.0,
			0.25,
			0.25,
			0.5,
			0.0,
			0.5, // left
			0.25,
			0.5,
			0.5,
			0.5,
			0.5,
			0.75,
			0.25,
			0.5,
			0.5,
			0.75,
			0.25,
			0.75, // top
			0.25,
			0.0,
			0.5,
			0.0,
			0.5,
			0.25,
			0.25,
			0.0,
			0.5,
			0.25,
			0.25,
			0.25, // bottom
		]);

		// Initialize buffers if they are null
		Cube.initBuffers();
	}

	static initBuffers() {
		if (!Cube.vertBuffer) {
			Cube.vertBuffer = gl.createBuffer();
			gl.bindBuffer(gl.ARRAY_BUFFER, Cube.vertBuffer);
			gl.bufferData(
				gl.ARRAY_BUFFER,
				new Float32Array([
					...new Cube().vertices, // Ensuring the same cube data is used
				]),
				gl.STATIC_DRAW
			);
		}

		if (!Cube.uvBuffer) {
			Cube.uvBuffer = gl.createBuffer();
			gl.bindBuffer(gl.ARRAY_BUFFER, Cube.uvBuffer);
			gl.bufferData(
				gl.ARRAY_BUFFER,
				new Float32Array([...new Cube().uvCoords]),
				gl.STATIC_DRAW
			);
		}
	}

	render() {
		gl.uniform1i(u_whichTexture, this.textureNum);
		gl.uniform4f(u_FragColor, ...this.color);
		gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

		// Bind vertex buffer
		gl.bindBuffer(gl.ARRAY_BUFFER, Cube.vertBuffer);
		gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);
		gl.enableVertexAttribArray(a_Position);

		// Bind UV buffer
		gl.bindBuffer(gl.ARRAY_BUFFER, Cube.uvBuffer);
		gl.vertexAttribPointer(a_UV, 2, gl.FLOAT, false, 0, 0);
		gl.enableVertexAttribArray(a_UV);

		// Draw cube
		gl.drawArrays(gl.TRIANGLES, 0, this.vertices.length / 3);
	}
}
