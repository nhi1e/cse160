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
	const triangles1 = [
		[...gridToWebGL(2, 2.5), ...gridToWebGL(4, 2), ...gridToWebGL(6, 2.5)],

		[...gridToWebGL(8, 8.5), ...gridToWebGL(10, 8), ...gridToWebGL(12, 8.5)],
		[...gridToWebGL(18, 4.5), ...gridToWebGL(20, 4), ...gridToWebGL(22, 4.5)],
		[
			...gridToWebGL(28, 10.5),
			...gridToWebGL(30, 10),
			...gridToWebGL(32, 10.5),
		],
		[...gridToWebGL(38, 2.5), ...gridToWebGL(40, 2), ...gridToWebGL(42, 2.5)],
		[...gridToWebGL(50, 8.5), ...gridToWebGL(52, 8), ...gridToWebGL(54, 8.5)],
		[...gridToWebGL(25, 1.5), ...gridToWebGL(27, 1), ...gridToWebGL(29, 1.5)],
		[...gridToWebGL(44, 7.5), ...gridToWebGL(46, 7), ...gridToWebGL(48, 7.5)],
	];
	// Draw each triangle
	for (let i = 0; i < triangles1.length; i++) {
		let color = [0.38, 0.4, 1.0, 1.0]; // Light blue color for the cloud
		gl.uniform4f(u_FragColor, color[0], color[1], color[2], color[3]);
		drawTriangle(triangles1[i]);
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
		[...gridToWebGL(40, 20), ...gridToWebGL(48, 40), ...gridToWebGL(54, 20)],
		[...gridToWebGL(0, 20), ...gridToWebGL(8, 36), ...gridToWebGL(13, 20)],
		[...gridToWebGL(16, 20), ...gridToWebGL(12, 28), ...gridToWebGL(19, 32)],
		[...gridToWebGL(16, 20), ...gridToWebGL(25, 20), ...gridToWebGL(19, 32)],
		[...gridToWebGL(24, 20), ...gridToWebGL(32, 44), ...gridToWebGL(40, 20)],
	];
	// Draw each triangle
	for (let i = 0; i < triangles1.length; i++) {
		let color = [0.52, 0.64, 1.0, 1.0]; // Light blue color for the cloud
		gl.uniform4f(u_FragColor, color[0], color[1], color[2], color[3]);
		drawTriangle(triangles1[i]);
	}
	//dark blue mountain
	const triangles2 = [
		[...gridToWebGL(58, 20), ...gridToWebGL(48, 40), ...gridToWebGL(54, 20)],
		[...gridToWebGL(13, 20), ...gridToWebGL(16, 20), ...gridToWebGL(8, 36)],
		[...gridToWebGL(31, 20), ...gridToWebGL(25, 20), ...gridToWebGL(19, 32)],
		[...gridToWebGL(40, 20), ...gridToWebGL(32, 44), ...gridToWebGL(44, 20)],
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
		[...gridToWebGL(12, 28), ...gridToWebGL(14, 27), ...gridToWebGL(15, 28)],
		[...gridToWebGL(15, 28), ...gridToWebGL(16, 26), ...gridToWebGL(18, 28)],
		[...gridToWebGL(18, 28), ...gridToWebGL(20, 26), ...gridToWebGL(21, 28)],
		[...gridToWebGL(21, 28), ...gridToWebGL(22, 26), ...gridToWebGL(22, 28)],
		[...gridToWebGL(12, 28), ...gridToWebGL(19, 32), ...gridToWebGL(23, 28)],
		[...gridToWebGL(29, 35), ...gridToWebGL(32, 44), ...gridToWebGL(36.5, 35)],
		[...gridToWebGL(29, 35), ...gridToWebGL(30, 33), ...gridToWebGL(32, 35)],
		[...gridToWebGL(34, 35), ...gridToWebGL(33, 32), ...gridToWebGL(32, 35)],
		[...gridToWebGL(34, 35), ...gridToWebGL(35, 34), ...gridToWebGL(36.5, 35)],
		[...gridToWebGL(45, 32), ...gridToWebGL(48, 40), ...gridToWebGL(52, 32)],
		[...gridToWebGL(45, 32), ...gridToWebGL(46, 29), ...gridToWebGL(47, 32)],
		[...gridToWebGL(47, 32), ...gridToWebGL(48, 31), ...gridToWebGL(49, 32)],
		[...gridToWebGL(49, 32), ...gridToWebGL(50, 30), ...gridToWebGL(51, 32)],
		[...gridToWebGL(51, 32), ...gridToWebGL(52, 30), ...gridToWebGL(52, 32)],
	];
	// Draw each triangle
	for (let i = 0; i < triangles3.length; i++) {
		let color = [0.82, 0.88, 1.0, 1.0]; // Light blue color for the cloud
		gl.uniform4f(u_FragColor, color[0], color[1], color[2], color[3]);
		drawTriangle(triangles3[i]);
	}
}

function drawClouds() {
	//light white cloud
	const triangles1 = [
		[...gridToWebGL(10, 40), ...gridToWebGL(10, 43), ...gridToWebGL(21, 43)],
		[...gridToWebGL(20, 38), ...gridToWebGL(18, 38), ...gridToWebGL(22, 40)],
		[...gridToWebGL(10, 40), ...gridToWebGL(9, 42), ...gridToWebGL(10, 43)],
		[...gridToWebGL(10, 40), ...gridToWebGL(9, 42), ...gridToWebGL(8, 40)],
		[...gridToWebGL(10, 43), ...gridToWebGL(11, 44), ...gridToWebGL(13, 44)],
		[...gridToWebGL(14, 43), ...gridToWebGL(10, 43), ...gridToWebGL(13, 44)],
		[...gridToWebGL(38, 48), ...gridToWebGL(39, 44), ...gridToWebGL(51, 44)],
		[...gridToWebGL(35, 44), ...gridToWebGL(39, 44), ...gridToWebGL(35, 46)],
		[...gridToWebGL(44, 42), ...gridToWebGL(43, 44), ...gridToWebGL(49, 44)],
		[...gridToWebGL(44, 42), ...gridToWebGL(48, 42), ...gridToWebGL(49, 44)],
		[...gridToWebGL(51, 44), ...gridToWebGL(54, 46), ...gridToWebGL(58, 44)],
		[...gridToWebGL(52, 42), ...gridToWebGL(54, 44), ...gridToWebGL(56, 42)],
		[...gridToWebGL(58, 44), ...gridToWebGL(54, 44), ...gridToWebGL(56, 42)],
	];
	// Draw each triangle
	for (let i = 0; i < triangles1.length; i++) {
		let color = [1, 0.98, 0.98, 1.0]; // Light blue color for the cloud
		gl.uniform4f(u_FragColor, color[0], color[1], color[2], color[3]);
		drawTriangle(triangles1[i]);
	}
	//gray cloud
	const triangles2 = [
		[...gridToWebGL(10, 40), ...gridToWebGL(21, 43), ...gridToWebGL(22, 40)],
		[...gridToWebGL(16, 40), ...gridToWebGL(18, 38), ...gridToWebGL(22, 40)],
		[...gridToWebGL(10, 40), ...gridToWebGL(9, 38), ...gridToWebGL(8, 40)],
		[...gridToWebGL(10, 40), ...gridToWebGL(9, 38), ...gridToWebGL(14, 38)],
		[...gridToWebGL(10, 40), ...gridToWebGL(15, 40), ...gridToWebGL(14, 38)],
		[...gridToWebGL(15, 43), ...gridToWebGL(16, 45), ...gridToWebGL(18, 45)],
		[...gridToWebGL(15, 43), ...gridToWebGL(18, 45), ...gridToWebGL(19, 43)],
		[...gridToWebGL(21, 43), ...gridToWebGL(22, 40), ...gridToWebGL(23, 42)],
		[...gridToWebGL(24, 40), ...gridToWebGL(22, 40), ...gridToWebGL(23, 42)],
		[...gridToWebGL(24, 40), ...gridToWebGL(22, 40), ...gridToWebGL(24, 39)],
		[...gridToWebGL(21, 39), ...gridToWebGL(22, 40), ...gridToWebGL(24, 39)],
		[...gridToWebGL(52, 48), ...gridToWebGL(38, 48), ...gridToWebGL(51, 44)],
		[...gridToWebGL(38, 48), ...gridToWebGL(39, 44), ...gridToWebGL(35, 46)],
		[...gridToWebGL(35, 44), ...gridToWebGL(37, 42), ...gridToWebGL(41, 42)],
		[...gridToWebGL(35, 44), ...gridToWebGL(42, 44), ...gridToWebGL(41, 42)],
		[...gridToWebGL(41, 48), ...gridToWebGL(43, 50), ...gridToWebGL(46, 48)],
		[...gridToWebGL(45, 50), ...gridToWebGL(43, 50), ...gridToWebGL(46, 48)],
		[...gridToWebGL(51, 44), ...gridToWebGL(54, 46), ...gridToWebGL(52, 48)],
		[...gridToWebGL(49, 44), ...gridToWebGL(52, 42), ...gridToWebGL(54, 44)],
		[...gridToWebGL(48, 48), ...gridToWebGL(52, 48), ...gridToWebGL(50, 48)],
		[...gridToWebGL(48, 48), ...gridToWebGL(49, 50), ...gridToWebGL(52, 48)],
		[...gridToWebGL(51, 50), ...gridToWebGL(49, 50), ...gridToWebGL(52, 48)],
	];
	// Draw each triangle
	for (let i = 0; i < triangles2.length; i++) {
		let color = [0.96, 0.96, 0.96, 1.0]; // Light blue color for the cloud
		gl.uniform4f(u_FragColor, color[0], color[1], color[2], color[3]);
		drawTriangle(triangles2[i]);
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
	drawClouds();
}
