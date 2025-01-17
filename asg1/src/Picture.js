function gridToWebGL(xGrid, yGrid) {
	let xWebGL = -1.0 + (xGrid / 60) * 2.0;
	let yWebGL = -1.0 + (yGrid / 60) * 2.0;

	return [xWebGL, yWebGL];
}

function drawOcean() {
	const triangles = [
		[...gridToWebGL(0, 0), ...gridToWebGL(60, 0), ...gridToWebGL(60, 12)],
		[...gridToWebGL(0, 0), ...gridToWebGL(60, 12), ...gridToWebGL(0, 12)],
	];
	// Draw each triangle
	for (let i = 0; i < triangles.length; i++) {
		let color = [0.8, 0.8, 1.0, 1.0]; // Light blue color for the cloud
		gl.uniform4f(u_FragColor, color[0], color[1], color[2], color[3]);
		drawTriangle(triangles[i]);
	}
}
function drawGrass() {
	//darkest green
	const triangles1 = [
		[...gridToWebGL(0, 12), ...gridToWebGL(0, 24), ...gridToWebGL(16, 12)],
		[...gridToWebGL(0, 24), ...gridToWebGL(5, 20), ...gridToWebGL(8, 22)],
		[...gridToWebGL(31, 20), ...gridToWebGL(36, 21), ...gridToWebGL(40, 20)],
		[...gridToWebGL(52, 20), ...gridToWebGL(54, 22), ...gridToWebGL(56, 20)],
	];
	// Draw each triangle
	for (let i = 0; i < triangles1.length; i++) {
		let color = [0.04, 0.48, 0.4, 1.0]; // Light blue color for the cloud
		gl.uniform4f(u_FragColor, color[0], color[1], color[2], color[3]);
		drawTriangle(triangles1[i]);
	}
	//med green
	const triangles2 = [
		[...gridToWebGL(5, 20), ...gridToWebGL(8, 22), ...gridToWebGL(20, 20)],
		[...gridToWebGL(14, 23), ...gridToWebGL(4, 23), ...gridToWebGL(8, 22)],
		[...gridToWebGL(16, 12), ...gridToWebGL(60, 12), ...gridToWebGL(5, 20)],
		[...gridToWebGL(8, 22), ...gridToWebGL(14, 23), ...gridToWebGL(20, 22)],
		[...gridToWebGL(36, 21), ...gridToWebGL(40, 20), ...gridToWebGL(48, 21)],
		[...gridToWebGL(54, 22), ...gridToWebGL(56, 20), ...gridToWebGL(60, 22)],
	];
	// Draw each triangle
	for (let i = 0; i < triangles2.length; i++) {
		let color = [0.04, 0.54, 0.32, 1.0]; // Light blue color for the cloud
		gl.uniform4f(u_FragColor, color[0], color[1], color[2], color[3]);
		drawTriangle(triangles2[i]);
	}
	//light green
	const triangles3 = [
		[...gridToWebGL(5, 20), ...gridToWebGL(60, 20), ...gridToWebGL(60, 12)],
		[...gridToWebGL(8, 22), ...gridToWebGL(20, 20), ...gridToWebGL(20, 22)],
		[...gridToWebGL(20, 20), ...gridToWebGL(20, 22), ...gridToWebGL(31, 20)],
		[...gridToWebGL(40, 20), ...gridToWebGL(48, 22), ...gridToWebGL(52, 20)],
		[...gridToWebGL(56, 20), ...gridToWebGL(60, 20), ...gridToWebGL(60, 22)],
	];
	// Draw each triangle
	for (let i = 0; i < triangles3.length; i++) {
		let color = [0.34, 0.54, 0.32, 1.0]; // Light blue color for the cloud
		gl.uniform4f(u_FragColor, color[0], color[1], color[2], color[3]);
		drawTriangle(triangles3[i]);
	}
}
function drawMountains() {
	//light blue mountain
	const triangles1 = [
		[...gridToWebGL(0, 20), ...gridToWebGL(8, 36), ...gridToWebGL(13, 20)],
		[...gridToWebGL(16, 20), ...gridToWebGL(12, 28), ...gridToWebGL(18, 32)],
		[...gridToWebGL(16, 20), ...gridToWebGL(25, 20), ...gridToWebGL(18, 32)],
	];
	// Draw each triangle
	for (let i = 0; i < triangles1.length; i++) {
		let color = [0.52, 0.64, 1.0, 1.0]; // Light blue color for the cloud
		gl.uniform4f(u_FragColor, color[0], color[1], color[2], color[3]);
		drawTriangle(triangles1[i]);
	}
	//dark blue mountain
	const triangles2 = [
		[...gridToWebGL(13, 20), ...gridToWebGL(16, 20), ...gridToWebGL(8, 36)],
	];
	// Draw each triangle
	for (let i = 0; i < triangles2.length; i++) {
		let color = [0.42, 0.56, 1.0, 1.0]; // Light blue color for the cloud
		gl.uniform4f(u_FragColor, color[0], color[1], color[2], color[3]);
		drawTriangle(triangles2[i]);
	}
	//snow
	const triangles3 = [
		[...gridToWebGL(8, 36), ...gridToWebGL(5, 30), ...gridToWebGL(11, 30)],
		[...gridToWebGL(5, 30), ...gridToWebGL(6, 29), ...gridToWebGL(7, 30)],
		[...gridToWebGL(7, 30), ...gridToWebGL(8, 28), ...gridToWebGL(10, 30)],
	];
	// Draw each triangle
	for (let i = 0; i < triangles3.length; i++) {
		let color = [0.82, 0.88, 1.0, 1.0]; // Light blue color for the cloud
		gl.uniform4f(u_FragColor, color[0], color[1], color[2], color[3]);
		drawTriangle(triangles3[i]);
	}
}

function drawPic() {
	// Specify the color for clearing <canvas>
	gl.clearColor(0.0, 0.0, 0.0, 1.0);
	// Clear <canvas>
	gl.clear(gl.COLOR_BUFFER_BIT);
	drawMountains();
	drawOcean();
	drawGrass();
}
