// Global Buffers
let vertexBuffer = null;
let uvBuffer = null;

// Initialize Buffers
function initBuffers() {
	if (!vertexBuffer) {
		vertexBuffer = gl.createBuffer();
		if (!vertexBuffer) {
			console.error("Failed to create vertex buffer.");
			return;
		}
	}
	if (!uvBuffer) {
		uvBuffer = gl.createBuffer();
		if (!uvBuffer) {
			console.error("Failed to create UV buffer.");
			return;
		}
	}
}

// Function to Draw 3D Triangle with UV Mapping
// Function to Draw 3D Triangle with UV Mapping
function drawTriangle3DUV(vertices, uv) {
	if (!vertexBuffer || !uvBuffer) initBuffers();
	const n = vertices.length / 3; // Number of vertices

	if (uv.length / 2 !== n) {
		console.error(
			"Mismatch: Each vertex must have a corresponding UV coordinate."
		);
		return;
	}

	// Bind and update vertex buffer
	gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);
	gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(a_Position);

	// Bind and update UV buffer
	gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uv), gl.STATIC_DRAW);
	gl.vertexAttribPointer(a_TexCoord, 2, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(a_TexCoord);

	// Draw the triangle
	gl.drawArrays(gl.TRIANGLES, 0, n);
}


// Optimized Triangle Class
class Triangle {
	constructor(
		position = [0.0, 0.0, 0.0],
		color = [1.0, 1.0, 1.0, 1.0],
		size = 15.0,
		uv = [0, 0, 1, 0, 0, 1] // Default UV mapping
	) {
		this.position = position;
		this.color = color;
		this.size = size;
		this.uv = uv;
	}

	render() {
		gl.uniform4f(u_FragColor, ...this.color);
		gl.uniform1f(u_Size, this.size);

		const delta = this.size / 200.0;
		const vertices = [
			this.position[0], this.position[1], 0.0, // First vertex
			this.position[0] + delta, this.position[1], 0.0, // Second vertex
			this.position[0], this.position[1] + delta, 0.0, // Third vertex
		];

		// Pass UVs from Cube
		drawTriangle3DUV(vertices, this.uv);
	}
}
