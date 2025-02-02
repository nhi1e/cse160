var vertexBuffer = null; // Store buffer globally to reuse

function initBuffer() {
	vertexBuffer = gl.createBuffer();
	if (!vertexBuffer) {
		console.log("Failed to create the buffer object");
		return -1;
	}
}

function drawTriangle3D(vertices) {
	if (!vertexBuffer) {
		initBuffer(); // Create buffer only once
	}

	// Bind buffer
	gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

	// Update buffer data only if necessary
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);

	// Assign buffer to a_Position variable
	gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(a_Position);

	// Draw the triangle
	gl.drawArrays(gl.TRIANGLES, 0, 3);
}
