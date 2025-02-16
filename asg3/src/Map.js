class Map {
	constructor() {
		this.hightMap = [
			[
				4, 4, 4, 4, 4, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 4, 4,
				4, 4, 5, 5, 5, 5, 5, 5,
			],
			[
				4, 4, 4, 3, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 2, 3, 3,
				4, 4, 4, 5, 5, 5, 5, 5,
			],
			[
				4, 4, 3, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2,
				3, 4, 4, 5, 5, 5, 5, 5,
			],
			[
				4, 3, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2,
				3, 4, 4, 4, 5, 5, 5, 5,
			],
			[
				4, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 2, 2, 1,
				3, 3, 4, 4, 4, 4, 5, 5,
			], //2
			[
				4, 2, 2, 3, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1,
				1, 3, 3, 4, 4, 4, 5, 5,
			],
			[
				2, 2, 3, 4, 4, 4, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1,
				1, 1, 3, 3, 4, 4, 4, 5,
			],
			[
				2, 3, 4, 4, 4, 4, 4, 3, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1,
				1, 1, 1, 3, 3, 4, 4, 5,
			],
			[
				2, 3, 3, 4, 4, 4, 3, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1,
				1, 1, 1, 3, 3, 3, 4, 4,
			],
			[
				2, 2, 2, 3, 3, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1,
				1, 1, 1, 3, 3, 3, 3, 4,
			],
			[
				2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1,
				1, 1, 1, 2, 2, 3, 3, 3,
			],
			[
				2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1,
				1, 1, 2, 2, 2, 2, 3, 3,
			],
			[
				2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1,
				1, 2, 2, 2, 2, 2, 2, 2,
			],
			[
				2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 2,
				2, 2, 2, 2, 2, 2, 2, 2,
			],
			[
				2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 2, 2,
				2, 2, 2, 2, 2, 2, 2, 2,
			],
			[
				2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2,
				2, 2, 2, 2, 2, 2, 2, 2,
			],
			[
				2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2,
				2, 2, 2, 2, 2, 2, 2, 2,
			],
			[
				3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 2, 2, 2, 2, 2, 2, 2, 2,
				2, 2, 2, 2, 2, 2, 2, 2,
			],
			[
				3, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 2, 2, 2, 2, 2, 2, 2,
				2, 2, 2, 2, 2, 2, 2, 2,
			],
			[
				4, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 4, 4, 4, 4, 2, 2, 2, 2, 2, 3, 2,
				2, 2, 2, 2, 2, 2, 2, 2,
			],
			[
				4, 3, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 4, 4, 4, 3, 2, 2, 2, 2, 4, 3, 3,
				2, 2, 2, 2, 2, 2, 2, 2,
			],
			[
				4, 3, 3, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 4, 3, 2, 2, 2, 2, 2, 2, 4, 4,
				3, 3, 2, 2, 2, 2, 2, 2,
			],
			[
				4, 4, 3, 3, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 2, 2, 2, 2, 2, 2, 2, 2, 4,
				4, 3, 2, 2, 2, 2, 2, 2,
			],
			[
				4, 4, 4, 4, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2,
				4, 3, 2, 2, 2, 2, 2, 2,
			],
			[
				3, 4, 4, 4, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2,
				2, 4, 2, 2, 2, 2, 2, 2,
			],
			[
				3, 4, 5, 5, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2,
				2, 2, 2, 2, 2, 2, 2, 2,
			],
			[
				3, 4, 4, 4, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2,
				2, 2, 2, 2, 2, 2, 2, 2,
			],
			[
				3, 3, 3, 3, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2,
				2, 2, 2, 2, 2, 2, 2, 2,
			],
			[
				2, 3, 3, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2,
				2, 2, 2, 2, 2, 2, 2, 2,
			],
			[
				2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2,
				2, 2, 2, 2, 2, 2, 2, 2,
			],
			[
				2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2,
				2, 2, 2, 2, 2, 2, 2, 2,
			],
			[
				2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2,
				2, 2, 2, 2, 2, 2, 2, 2,
			],
		];

		this.cubes = [];
		this.createMap();
	}

	createMap() {
		for (let i = 0; i < 32; i++) {
			let x = this.hightMap[i];
			let x_array = [];

			for (let j = 0; j < 32; j++) {
				let y = x[j];
				let y_array = [];

				for (let k = 0; k < 32; k++) {
					let obj = null;

					if (k < y) {
						// Solid ground cube
						obj = new Cube();
						obj.matrix.translate(i, k, j);
						obj.textureNum = 1; // Ground texture
					} else if (y === 1 && k === y) {
						// Place water cube at level 1
						obj = new Cube();
						obj.matrix.translate(i, k, j);
						obj.textureNum = 5; // Water texture
					}

					y_array.push(obj);
				}

				x_array.push(y_array);
			}

			this.cubes.push(x_array);
		}
		this.placeTree(2, 23); // Place tree at row 6, column 26
	}

	placeTree(x, z) {
		let baseY = this.hightMap[x][z]; // Get height from the height map
		let trunkHeight = 3;
		let leafStart = baseY + trunkHeight;

		console.log(`Placing tree at (${x}, ${baseY}, ${z})`);

		// --- Create Trunk (3 wood blocks) ---
		for (let h = 0; h < trunkHeight; h++) {
			let trunk = new Cube();
			trunk.matrix.translate(x, baseY + h, z);
			trunk.textureNum = 6; // Wood texture
			this.cubes[x][z][baseY + h] = trunk;
			console.log(`Placed trunk at (${x}, ${baseY + h}, ${z})`);
		}

		// --- Create Cherry Blossom Leaves (Rounded Shape) ---
		let radius = 2; // Controls the roundness
		for (let dx = -radius; dx <= radius; dx++) {
			for (let dz = -radius; dz <= radius; dz++) {
				for (let dy = 0; dy <= radius; dy++) {
					let leafX = x + dx;
					let leafY = leafStart + dy;
					let leafZ = z + dz;

					// Create a rounded shape instead of a cube
					let distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

					// Only place leaves within a rounded radius
					if (distance <= radius + Math.random() * 0.5) {
						if (
							leafX >= 0 &&
							leafX < 32 &&
							leafZ >= 0 &&
							leafZ < 32 &&
							leafY >= 0 &&
							leafY < 32
						) {
							let leaf = new Cube();
							leaf.matrix.translate(leafX, leafY, leafZ);
							leaf.textureNum = 7; // 🌸 Cherry blossom texture
							this.cubes[leafX][leafZ][leafY] = leaf;

							console.log(`Placed leaf at (${leafX}, ${leafY}, ${leafZ})`);
						}
					}
				}
			}
		}
	}

	render() {
		for (let x = 0; x < 32; x++) {
			for (let z = 0; z < 32; z++) {
				for (let y = 0; y < 32; y++) {
					if (this.cubes[x][z][y] !== null) {
						this.cubes[x][z][y].render();
					}
				}
			}
		}
	}
}
