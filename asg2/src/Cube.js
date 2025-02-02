class Cube {
	constructor() {
		this.type = "cube";
		this.color = [1.0, 1.0, 1.0, 1.0]; // Default color
		this.matrix = new Matrix4();
		this.uniformFaceColor = false; // Default: Use different colors for each face
	}

	render() {
		const rgba = this.color;

		// Pass the matrix to the shader
		gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

		if (this.uniformFaceColor) {
			// Use the same color for all faces
			gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
			this.drawFacesWithUniformColor();
		} else {
			// Use different colors for each face
			this.drawFacesWithDifferentColors(rgba);
		}
	}

	drawFacesWithUniformColor() {
		// Draw each face with the same color
		drawTriangle3D([0, 0, 0, 1, 1, 0, 1, 0, 0]);
		drawTriangle3D([0, 0, 0, 0, 1, 0, 1, 1, 0]);

		drawTriangle3D([0, 1, 0, 0, 1, 1, 1, 1, 1]);
		drawTriangle3D([0, 1, 0, 1, 1, 1, 1, 1, 0]);

		drawTriangle3D([0, 0, 0, 1, 0, 0, 1, 0, 1]);
		drawTriangle3D([0, 0, 0, 0, 0, 1, 1, 0, 1]);

		drawTriangle3D([1, 0, 0, 1, 1, 0, 1, 1, 1]);
		drawTriangle3D([1, 0, 0, 1, 0, 1, 1, 1, 1]);

		drawTriangle3D([0, 0, 0, 0, 0, 1, 0, 1, 1]);
		drawTriangle3D([0, 0, 0, 0, 1, 0, 0, 1, 1]);
	}

	drawFacesWithDifferentColors(rgba) {
		// Pass the color of a point to u_FragColor variable
		gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
		// Front of cube
		drawTriangle3D([0, 0, 0, 1, 1, 0, 1, 0, 0]);
		drawTriangle3D([0, 0, 0, 0, 1, 0, 1, 1, 0]);
		//pass color of  point to u_FragColor variable
		gl.uniform4f(
			u_FragColor,
			rgba[0] / 1.23229,
			rgba[1] / 1.28,
			rgba[2] / 7.79394,
			rgba[3]
		);
		// Top of cube
		drawTriangle3D([0, 1, 0, 0, 1, 1, 1, 1, 1]);
		drawTriangle3D([0, 1, 0, 1, 1, 1, 1, 1, 0]);
		// Bottom of cube
		drawTriangle3D([0, 0, 0, 1, 0, 0, 1, 0, 1]);
		drawTriangle3D([0, 0, 0, 0, 0, 1, 1, 0, 1]);
		// Right of cube
		drawTriangle3D([1, 0, 0, 1, 1, 0, 1, 1, 1]);
		drawTriangle3D([1, 0, 0, 1, 0, 1, 1, 1, 1]);
		// Left of cube
		drawTriangle3D([0, 0, 0, 0, 0, 1, 0, 1, 1]);
		drawTriangle3D([0, 0, 0, 0, 1, 0, 0, 1, 1]);
	}
}
