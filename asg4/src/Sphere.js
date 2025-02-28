function cos(x) {
	return Math.cos(x);
}

function sin(x) {
	return Math.sin(x);
}

class Sphere {
	constructor() {
		this.color = [1.0, 1.0, 1.0, 1.0];
		this.matrix = new Matrix4();
		this.textureNum = -2;
		this.vertices = [];
		this.uvs = [];
		this.normals = [];
		this.initSphere();
		this.initBuffers();
	}

	initSphere() {
		const d = Math.PI / 10;
		const dd = Math.PI / 10;

		for (let t = 0; t < Math.PI; t += d) {
			for (let r = 0; r < 2 * Math.PI; r += d) {
				let p1 = [sin(t) * cos(r), sin(t) * sin(r), cos(t)];
				let p2 = [sin(t + dd) * cos(r), sin(t + dd) * sin(r), cos(t + dd)];
				let p3 = [sin(t) * cos(r + dd), sin(t) * sin(r + dd), cos(t)];
				let p4 = [
					sin(t + dd) * cos(r + dd),
					sin(t + dd) * sin(r + dd),
					cos(t + dd),
				];

				let uv1 = [t / Math.PI, r / (2 * Math.PI)];
				let uv2 = [(t + dd) / Math.PI, r / (2 * Math.PI)];
				let uv3 = [t / Math.PI, (r + dd) / (2 * Math.PI)];
				let uv4 = [(t + dd) / Math.PI, (r + dd) / (2 * Math.PI)];

				this.addTriangle(p1, p2, p4, uv1, uv2, uv4);
				this.addTriangle(p1, p4, p3, uv1, uv4, uv3);
			}
		}
	}

	addTriangle(p1, p2, p3, uv1, uv2, uv3) {
		this.vertices.push(...p1, ...p2, ...p3);
		this.uvs.push(...uv1, ...uv2, ...uv3);

		// Normals (same as position for a sphere)
		this.normals.push(...p1, ...p2, ...p3);
	}

	initBuffers() {
		this.vertexBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
		gl.bufferData(
			gl.ARRAY_BUFFER,
			new Float32Array(this.vertices),
			gl.STATIC_DRAW
		);

		this.uvBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, this.uvBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.uvs), gl.STATIC_DRAW);

		this.normalBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
		gl.bufferData(
			gl.ARRAY_BUFFER,
			new Float32Array(this.normals),
			gl.STATIC_DRAW
		);
	}

	render() {
		gl.uniform1i(u_whichTexture, this.textureNum);
		gl.uniform4f(u_FragColor, ...this.color);

		gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

		// Enable and bind vertex positions
		gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
		gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);
		gl.enableVertexAttribArray(a_Position);

		// Enable and bind UV coordinates
		gl.bindBuffer(gl.ARRAY_BUFFER, this.uvBuffer);
		gl.vertexAttribPointer(a_UV, 2, gl.FLOAT, false, 0, 0);
		gl.enableVertexAttribArray(a_UV);

		// Enable and bind normals
		gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
		gl.vertexAttribPointer(a_Normal, 3, gl.FLOAT, false, 0, 0);
		gl.enableVertexAttribArray(a_Normal);

		// Draw the sphere using TRIANGLES
		gl.drawArrays(gl.TRIANGLES, 0, this.vertices.length / 3);
	}
}
