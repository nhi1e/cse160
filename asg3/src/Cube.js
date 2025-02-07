class Cube {
	constructor() {
		this.type = "cube";
		this.color = [1.0, 1.0, 1.0, 1.0];
		this.matrix = new Matrix4();
	}

	render() {
		gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

		// Define vertices & UVs for all 6 faces

		let vertices = [
			// Front face
			0, 0, 0, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 0,

			// Back face
			0, 0, 1, 1, 1, 1, 1, 0, 1, 0, 0, 1, 0, 1, 1, 1, 1, 1,

			// Top face
			0, 1, 0, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0,

			// Bottom face
			0, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 1, 0, 1,

			// Right face
			1, 0, 0, 1, 1, 0, 1, 1, 1, 1, 0, 0, 1, 0, 1, 1, 1, 1,

			// Left face
			0, 0, 0, 0, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 1, 0, 1, 1,
		];

		let uv = [
			// Front
			0, 0, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1,

			// Back
			0, 0, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1,

			// Top
			0, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 0,

			// Bottom
			0, 0, 1, 0, 1, 1, 0, 0, 0, 1, 1, 1,

			// Right
			0, 0, 1, 0, 1, 1, 0, 0, 0, 1, 1, 1,

			// Left
			0, 0, 1, 0, 1, 1, 0, 0, 0, 1, 1, 1,
		];

		drawTriangle3DUV(vertices, uv);
	}
}
