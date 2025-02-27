class Sphere {
	constructor(subdivisions = 20) {
		this.type = "sphere";
		this.color = [1.0, 0.0, 0.0, 1];
		this.matrix = new Matrix4();
		this.textureNum = 0;
		this.subdivisions = subdivisions;

		this.verts = [];
		this.normals = [];
		this.UVs = [];

		this.generateSphere();

		// Create buffers
		this.vertBuffer = null;
		this.normalBuffer = null;
		this.uvBuffer = null;
	}

	generateSphere() {
		let d = Math.PI / this.subdivisions; // Increment for latitude
		let dLon = (2 * Math.PI) / this.subdivisions; // Increment for longitude

		for (let t = 0; t < Math.PI; t += d) {
			for (let r = 0; r < 2 * Math.PI; r += dLon) {
				// Define four vertices of the sphere segment
				let p1 = [
					Math.sin(t) * Math.cos(r),
					Math.sin(t) * Math.sin(r),
					Math.cos(t),
				];
				let p2 = [
					Math.sin(t + d) * Math.cos(r),
					Math.sin(t + d) * Math.sin(r),
					Math.cos(t + d),
				];
				let p3 = [
					Math.sin(t) * Math.cos(r + dLon),
					Math.sin(t) * Math.sin(r + dLon),
					Math.cos(t),
				];
				let p4 = [
					Math.sin(t + d) * Math.cos(r + dLon),
					Math.sin(t + d) * Math.sin(r + dLon),
					Math.cos(t + d),
				];

				// Compute normals (same as position for unit sphere)
				let n1 = [...p1];
				let n2 = [...p2];
				let n3 = [...p3];
				let n4 = [...p4];

				// UV Coordinates (basic spherical mapping)
				let uv1 = [r / (2 * Math.PI), t / Math.PI];
				let uv2 = [r / (2 * Math.PI), (t + d) / Math.PI];
				let uv3 = [(r + dLon) / (2 * Math.PI), t / Math.PI];
				let uv4 = [(r + dLon) / (2 * Math.PI), (t + d) / Math.PI];

				// First triangle
				this.verts.push(...p1, ...p2, ...p4);
				this.normals.push(...n1, ...n2, ...n4);
				this.UVs.push(...uv1, ...uv2, ...uv4);

				// Second triangle
				this.verts.push(...p1, ...p4, ...p3);
				this.normals.push(...n1, ...n4, ...n3);
				this.UVs.push(...uv1, ...uv4, ...uv3);
			}
		}

		// Convert arrays to Float32Array for WebGL
		this.verts = new Float32Array(this.verts);
		this.normals = new Float32Array(this.normals);
		this.UVs = new Float32Array(this.UVs);
	}

	render() {
		var rgba = this.color;

		// Pass texture mode (normals or texture)
		gl.uniform1i(u_whichTexture, g_showNormals ? -3 : this.textureNum);
		gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

		// Pass the model matrix
		gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

		// Create buffers if they don't exist
		if (this.vertBuffer === null) {
			this.vertBuffer = gl.createBuffer();
		}
		if (this.uvBuffer === null) {
			this.uvBuffer = gl.createBuffer();
		}
		if (this.normalBuffer === null) {
			this.normalBuffer = gl.createBuffer();
		}

		// Bind and pass position data
		gl.bindBuffer(gl.ARRAY_BUFFER, this.vertBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, this.verts, gl.DYNAMIC_DRAW);
		gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);
		gl.enableVertexAttribArray(a_Position);

		if (g_showNormals) {
			// Use normal visualization
			gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
			gl.bufferData(gl.ARRAY_BUFFER, this.normals, gl.DYNAMIC_DRAW);
			gl.vertexAttribPointer(a_Normal, 3, gl.FLOAT, false, 0, 0);
			gl.enableVertexAttribArray(a_Normal);
			gl.disableVertexAttribArray(a_UV);
			console.log("show normals");
		} else {
			// Use UV mapping for texture
			gl.bindBuffer(gl.ARRAY_BUFFER, this.uvBuffer);
			gl.bufferData(gl.ARRAY_BUFFER, this.UVs, gl.DYNAMIC_DRAW);
			gl.vertexAttribPointer(a_UV, 2, gl.FLOAT, false, 0, 0);
			gl.enableVertexAttribArray(a_UV);
			gl.disableVertexAttribArray(a_Normal);
		}

		// Draw triangles
		gl.drawArrays(gl.TRIANGLES, 0, this.verts.length / 3);
	}
}
