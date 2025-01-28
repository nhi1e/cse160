class Cone {
	constructor(baseRadius = 1.0, height = 2.0, numSlices = 36) {
		this.type = "cone";
		this.color = [1.0, 1.0, 1.0, 1.0]; // Default color
		this.matrix = new Matrix4(); // Transformation matrix
		this.baseRadius = baseRadius;
		this.height = height;
		this.numSlices = numSlices; // Number of triangles used to approximate the cone
	}

	render() {
		var rgba = this.color;

		// Pass the color to the fragment shader
		gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

		// Pass the transformation matrix to the shader
		gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

		// Define the top point of the cone (tip)
		const tip = [0.0, this.height, 0.0];

		// Define the base circle vertices
		const baseCenter = [0.0, 0.0, 0.0];
		let angleStep = (2 * Math.PI) / this.numSlices;

		for (let i = 0; i < this.numSlices; i++) {
			// Current angle and next angle
			let currentAngle = i * angleStep;
			let nextAngle = (i + 1) * angleStep;

			// Current and next points on the base circle
			let currentPoint = [
				this.baseRadius * Math.cos(currentAngle),
				0.0,
				this.baseRadius * Math.sin(currentAngle),
			];

			let nextPoint = [
				this.baseRadius * Math.cos(nextAngle),
				0.0,
				this.baseRadius * Math.sin(nextAngle),
			];

			// Draw the triangle connecting the tip to the base edge
			drawTriangle3D([...tip, ...currentPoint, ...nextPoint]);

			// Draw the triangle for the base (optional, to close the base circle)
			drawTriangle3D([...baseCenter, ...currentPoint, ...nextPoint]);
		}
	}
}
