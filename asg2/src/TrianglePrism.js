class TrianglePrism {
	constructor() {
		this.type = "trianglePrism";
		this.color = [1.0, 1.0, 1.0, 1.0]; // Default color
		this.matrix = new Matrix4(); // Transformation matrix
	}

	render() {
		var rgba = this.color;

		// Pass the color to the fragment shader

		gl.uniform4f(
			u_FragColor,
			rgba[0] / 1.23229,
			rgba[1] / 1.28,
			rgba[2] / 7.79394,
			rgba[3]
		);
		// Pass the transformation matrix to the shader
		gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

		// Define the vertices for a triangular prism
		// Base triangle
		drawTriangle3D([0.0, 0.0, 0.0, 0.5, 1.0, 0.0, 1.0, 0.0, 0.0]); // Front triangle
		drawTriangle3D([0.0, 0.0, 1.0, 0.5, 1.0, 1.0, 1.0, 0.0, 1.0]); // Back triangle

		gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

		// Connect the triangles with rectangles (3 faces)
		drawTriangle3D([0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 1.0]);
		drawTriangle3D([0.0, 0.0, 0.0, 0.0, 0.0, 1.0, 1.0, 0.0, 1.0]);

		drawTriangle3D([0.5, 1.0, 0.0, 0.5, 1.0, 1.0, 1.0, 0.0, 1.0]);
		drawTriangle3D([0.5, 1.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 1.0]);

		drawTriangle3D([0.5, 1.0, 0.0, 0.5, 1.0, 1.0, 0.0, 0.0, 1.0]);
		drawTriangle3D([0.5, 1.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 1.0]);
	}
}
