class Cube {
	constructor() {
		this.type = "cube";
		this.color = [1.0, 1.0, 1.0, 1.0];
		this.matrix = new Matrix4();
	}
	render() {
		var rgba = this.color;

		// Pass the color of a point to u_FragColor variable
		gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
		// pass the matrix to u_ModelMatrix attribute
		gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);
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
