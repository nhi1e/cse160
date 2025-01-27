class Cylinder {
	constructor(
		radius = 0.5,
		height = 1.0,
		slices = 36,
		color = [1.0, 1.0, 1.0, 1.0]
	) {
		this.type = "cylinder";
		this.radius = radius;
		this.height = height;
		this.slices = slices;
		this.color = color; // Default color for all segments
		this.highlightedSegment = -1; // Index of the segment to highlight (-1 for no highlight)
		this.highlightColor = [1.0, 0.0, 0.0, 1.0]; // Color for the highlighted segment
		this.matrix = new Matrix4(); // Transformation matrix
	}

	setHighlightedSegment(index, color = [1.0, 0.0, 0.0, 1.0]) {
		this.highlightedSegment = index;
		this.highlightColor = color;
	}

	render() {
		const angleStep = (2 * Math.PI) / this.slices;
		const halfHeight = this.height / 2;

		for (let i = 0; i < this.slices; i++) {
			const angle1 = i * angleStep;
			const angle2 = (i + 1) * angleStep;

			const x1 = this.radius * Math.cos(angle1);
			const z1 = this.radius * Math.sin(angle1);
			const x2 = this.radius * Math.cos(angle2);
			const z2 = this.radius * Math.sin(angle2);

			// Set color based on the current segment
			if (i === this.highlightedSegment) {
				gl.uniform4f(
					u_FragColor,
					this.highlightColor[0],
					this.highlightColor[1],
					this.highlightColor[2],
					this.highlightColor[3]
				);
			} else {
				gl.uniform4f(
					u_FragColor,
					this.color[0],
					this.color[1],
					this.color[2],
					this.color[3]
				);
			}

			// Draw the curved surface segment (two triangles)
			drawTriangle3D([
				x1,
				-halfHeight,
				z1,
				x2,
				-halfHeight,
				z2,
				x1,
				halfHeight,
				z1,
			]);
			drawTriangle3D([
				x1,
				halfHeight,
				z1,
				x2,
				-halfHeight,
				z2,
				x2,
				halfHeight,
				z2,
			]);
		}

		// Draw top and bottom caps (optional; no color change for specific cap segments)
		for (let i = 0; i < this.slices; i++) {
			const angle1 = i * angleStep;
			const angle2 = (i + 1) * angleStep;

			const x1 = this.radius * Math.cos(angle1);
			const z1 = this.radius * Math.sin(angle1);
			const x2 = this.radius * Math.cos(angle2);
			const z2 = this.radius * Math.sin(angle2);

			// Top cap
			gl.uniform4f(
				u_FragColor,
				this.color[0],
				this.color[1],
				this.color[2],
				this.color[3]
			);
			drawTriangle3D([
				0,
				halfHeight,
				0,
				x1,
				halfHeight,
				z1,
				x2,
				halfHeight,
				z2,
			]);

			// Bottom cap
			drawTriangle3D([
				0,
				-halfHeight,
				0,
				x2,
				-halfHeight,
				z2,
				x1,
				-halfHeight,
				z1,
			]);
		}
	}
}
