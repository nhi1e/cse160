class Cube {
	constructor() {
		this.type = "cube";
		this.color = [1.0, 0.0, 0.0, 1];
		this.matrix = new Matrix4();
		this.textureNum = 0;

		//1x1 cube origin in corner
		this.verts = new Float32Array([
			0,
			0,
			1,
			1,
			0,
			1,
			1,
			1,
			1, //back
			0,
			0,
			1,
			1,
			1,
			1,
			0,
			1,
			1,

			1,
			0,
			1,
			1,
			0,
			0,
			1,
			1,
			0, //right
			1,
			0,
			1,
			1,
			1,
			0,
			1,
			1,
			1,

			1,
			0,
			0,
			0,
			0,
			0,
			0,
			1,
			0, //front
			1,
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
			0,
			0,
			1,
			0,
			1,
			1, //left
			0,
			0,
			0,
			0,
			1,
			1,
			0,
			1,
			0,

			0,
			1,
			1,
			1,
			1,
			1,
			1,
			1,
			0, //top
			0,
			1,
			1,
			1,
			1,
			0,
			0,
			1,
			0,

			1,
			0,
			1,
			0,
			0,
			1,
			0,
			0,
			0, //bottom
			1,
			0,
			1,
			0,
			0,
			0,
			1,
			0,
			0,
		]);

		this.UVs = new Float32Array([
			0.75,
			0.25,
			1.0,
			0.25,
			1.0,
			0.5, //back
			0.75,
			0.25,
			1.0,
			0.5,
			0.75,
			0.5,

			0.5,
			0.25,
			0.75,
			0.25,
			0.75,
			0.5, //right
			0.5,
			0.25,
			0.75,
			0.5,
			0.5,
			0.5,

			0.25,
			0.25,
			0.5,
			0.25,
			0.5,
			0.5, //front
			0.25,
			0.25,
			0.5,
			0.5,
			0.25,
			0.5,

			0.0,
			0.25,
			0.25,
			0.25,
			0.25,
			0.5, //left
			0.0,
			0.25,
			0.25,
			0.5,
			0.0,
			0.5,

			0.25,
			0.5,
			0.5,
			0.5,
			0.5,
			0.75, //top
			0.25,
			0.5,
			0.5,
			0.75,
			0.25,
			0.75,

			0.25,
			0.0,
			0.5,
			0,
			0.5,
			0.25, //bottom
			0.25,
			0.0,
			0.5,
			0.25,
			0.25,
			0.25,
		]);

		this.normals = new Float32Array([
			// Back Face
			0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1,

			// Right Face
			1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0,

			// Front Face
			0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1,

			// Left Face
			-1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0,

			// Top Face
			0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0,

			// Bottom Face
			0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0,
		]);

		this.vertBuffer = null;
		this.uvBuffer = null;
		this.normalBuffer = null;
	}

	render() {
		//console.log(this.textureNum)
		//var xy = this.position
		var rgba = this.color;
		//var size = this.size

		//pass texture number
		// gl.uniform1i(u_whichTexture, this.textureNum);
		gl.uniform1i(u_whichTexture, g_showNormals ? -3 : this.textureNum);

		gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

		// pass the model matrix
		gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

		//new render code

		if (this.vertBuffer === null) {
			this.vertBuffer = gl.createBuffer();
			if (!this.vertBuffer) {
				console.log("Failed to create the buffer object");
				return -1;
			}
		}

		if (this.uvBuffer === null) {
			this.uvBuffer = gl.createBuffer();
			if (!this.uvBuffer) {
				console.log("Failed to create the buffer object");
				return -1;
			}
		}

		if (this.normalBuffer === null) {
			this.normalBuffer = gl.createBuffer();
			if (!this.normalBuffer) {
				console.log("Failed to create the buffer object");
				return -1;
			}
		}

		//position data

		gl.bindBuffer(gl.ARRAY_BUFFER, this.vertBuffer);

		gl.bufferData(gl.ARRAY_BUFFER, this.verts, gl.DYNAMIC_DRAW);

		gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);

		gl.enableVertexAttribArray(a_Position);

		//uv data
		// gl.bindBuffer(gl.ARRAY_BUFFER, this.uvBuffer);

		// gl.bufferData(gl.ARRAY_BUFFER, this.UVs, gl.DYNAMIC_DRAW);

		// gl.vertexAttribPointer(a_UV, 2, gl.FLOAT, false, 0, 0);

		// gl.enableVertexAttribArray(a_UV);

		// Bind and send normal data
		gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, this.normals, gl.DYNAMIC_DRAW);
		gl.vertexAttribPointer(a_Normal, 3, gl.FLOAT, false, 0, 0);
		gl.enableVertexAttribArray(a_Normal);

		//draw triangles

		gl.drawArrays(gl.TRIANGLES, 0, this.verts.length / 3);
	}
}
