class TruncatedCone {
	constructor(baseRadius = 1.0, topRadius = 0.5, height = 2.0, numSlices = 36) {
		this.type = "truncatedCone";
		this.color = [1.0, 1.0, 1.0, 1.0]; // Default color
		this.matrix = new Matrix4(); // Transformation matrix
		this.baseRadius = baseRadius;
		this.topRadius = topRadius; // Radius of the top circle
		this.height = height;
		this.numSlices = numSlices; // Number of triangles used to approximate the cone
	}

	render() {
		var rgba = this.color;

		// Pass the color to the fragment shader
		gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

		// Pass the transformation matrix to the shader
		gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

		// Define the top and base circle centers
		const baseCenter = [0.0, 0.0, 0.0];
		const topCenter = [0.0, this.height, 0.0];
		let angleStep = (2 * Math.PI) / this.numSlices;

		for (let i = 0; i < this.numSlices; i++) {
			// Current angle and next angle
			let currentAngle = i * angleStep;
			let nextAngle = (i + 1) * angleStep;

			// Current and next points on the base circle
			let baseCurrentPoint = [
				this.baseRadius * Math.cos(currentAngle),
				0.0,
				this.baseRadius * Math.sin(currentAngle),
			];

			let baseNextPoint = [
				this.baseRadius * Math.cos(nextAngle),
				0.0,
				this.baseRadius * Math.sin(nextAngle),
			];

			// Current and next points on the top circle
			let topCurrentPoint = [
				this.topRadius * Math.cos(currentAngle),
				this.height,
				this.topRadius * Math.sin(currentAngle),
			];

			let topNextPoint = [
				this.topRadius * Math.cos(nextAngle),
				this.height,
				this.topRadius * Math.sin(nextAngle),
			];

			// Draw the side quad as two triangles
			drawTriangle3D([
				...baseCurrentPoint,
				...topCurrentPoint,
				...topNextPoint,
			]);
			drawTriangle3D([...baseCurrentPoint, ...topNextPoint, ...baseNextPoint]);

			// Draw the triangle for the base circle (optional)
			drawTriangle3D([...baseCenter, ...baseCurrentPoint, ...baseNextPoint]);

			// Draw the triangle for the top circle (optional)
			drawTriangle3D([...topCenter, ...topNextPoint, ...topCurrentPoint]);
		}
	}
}
