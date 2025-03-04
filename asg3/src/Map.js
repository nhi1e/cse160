class Map {
	constructor() {
		this.heightMap = [
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

		this.seasonIndex = 0; // 0: Spring, 1: Summer, 2: Autumn, 3: Winter
		this.seasonTextures = [
			"../textures/grass_spring.png",
			"../textures/grass_summer.png",
			"../textures/grass_autumn.png",
			"../textures/grass_winter.png",
		];
		this.seasonTrunkTextures = [
			"../textures/bark_spring.png",
			"../textures/bark_summer.png",
			"../textures/bark_autumn.png",
			"../textures/bark_winter.png",
		];
		this.seasonLeafTextures = [
			"../textures/leaf_spring.png",
			"../textures/leaf_summer.png",
			"../textures/leaf_autumn.png",
			"../textures/leaf_winter.png",
		];
		this.seasonSkyTextures = [
			"../textures/sky_spring.png",
			"../textures/sky_summer.png",
			"../textures/sky_autumn.png",
			"../textures/sky_winter.png",
		];

		this.createMap();
		this.startSeasonCycle();
	}

	createMap() {
		for (let x = 0; x < 32; x++) {
			let x_array = [];
			for (let z = 0; z < 32; z++) {
				let y = this.heightMap[x][z];
				let y_array = [];

				for (let k = 0; k < 32; k++) {
					let ground = null;

					if (k < y) {
						// Grass block (changes based on season)
						ground = new Cube();
						ground.matrix.translate(x, k, z);
						ground.textureNum = 1;
					} else if (y === 1 && k === y) {
						// Water block (unchanged)
						ground = new Cube();
						ground.matrix.translate(x, k, z);
						ground.textureNum = 5; // Water texture
					}

					y_array.push(ground);
				}

				x_array.push(y_array);
			}

			this.cubes.push(x_array);
		}
		this.placeTree(2, 23); // Place tree at row 6, column 26
	}

	startSeasonCycle() {
		setInterval(() => {
			this.seasonIndex = (this.seasonIndex + 1) % 4; // Cycle through seasons

			let newGrassTexture = this.seasonTextures[this.seasonIndex];
			let newTrunkTexture = this.seasonTrunkTextures[this.seasonIndex];
			let newLeafTexture = this.seasonLeafTextures[this.seasonIndex];
			let newSkyTexture = this.seasonSkyTextures[this.seasonIndex];

			updateSeasonTexture(newGrassTexture); //   Update Grass Texture (TEXTURE1)
			updateTrunkTexture(newTrunkTexture); //   Update Trunk Texture (TEXTURE6)
			updateLeafTexture(newLeafTexture); //   Update Leaf Texture (TEXTURE7)
			updateSkyTexture(newSkyTexture); //   Update Sky Texture (TEXTURE2)

			this.updateSeasonTextures(); // Apply texture update to terrain
			this.updateTrunkTextures(); // Apply texture update to trunks
			this.updateLeafTextures(); // Apply texture update to leaves
			this.updateSkyTextures(); // Apply texture update to sky

			TextToHTML(
				`🌤️ Season: ${["Spring", "Summer", "Autumn", "Winter"][this.seasonIndex]}`,
				"season-display"
			);

			console.log(
				"🌤️ Season changed:",
				["Spring", "Summer", "Autumn", "Winter"][this.seasonIndex]
			);
		}, 15000);
	}

	/** 🎨 Update all grass blocks to the new season's texture */
	updateSeasonTextures() {
		for (let x = 0; x < 32; x++) {
			for (let z = 0; z < 32; z++) {
				for (let y = 0; y < 32; y++) {
					let block = this.cubes[x][z][y];
					if (
						block &&
						block.textureNum === this.seasonTextures[(this.seasonIndex + 3) % 4]
					) {
						block.textureNum = this.seasonTextures[this.seasonIndex]; // Apply new season texture
					}
				}
			}
		}
	}

	updateLeafTextures() {
		for (let x = 0; x < 32; x++) {
			for (let z = 0; z < 32; z++) {
				for (let y = 0; y < 32; y++) {
					let block = this.cubes[x][z][y];

					if (block && block.textureNum === 7) {
						block.textureNum = 7; // Keep using TEXTURE7
					}
				}
			}
		}
	}

	updateTrunkTextures() {
		for (let x = 0; x < 32; x++) {
			for (let z = 0; z < 32; z++) {
				for (let y = 0; y < 32; y++) {
					let block = this.cubes[x][z][y];

					if (block && block.textureNum === 6) {
						block.textureNum = 6;
					}
				}
			}
		}
		console.log("🌲 Updated all tree trunks to new season texture.");
	}
	updateSkyTextures() {
		g_skybox.textureNum = 2; // Keep using TEXTURE2 for skybox
		console.log("🌤️ Updated sky to new season texture.");
	}

	placeTree(x, z) {
		let baseY = this.heightMap[x][z]; // Get height from height map
		let trunkHeight = 3;
		let leafStart = baseY + trunkHeight;

		// --- 🌳 Create Trunk (3 wood blocks) ---
		for (let h = 0; h < trunkHeight; h++) {
			let trunk = new Cube();
			trunk.matrix.translate(x, baseY + h, z);
			trunk.textureNum = 6; //  TEXTURE6 for Trunk (Seasonal)
			this.cubes[x][z][baseY + h] = trunk;
		}

		// --- 🍂 Create Leaves ---
		let radius = 3;
		for (let dx = -radius; dx <= radius; dx++) {
			for (let dz = -radius; dz <= radius; dz++) {
				for (let dy = 0; dy <= radius; dy++) {
					let leafX = x + dx;
					let leafY = leafStart + dy;
					let leafZ = z + dz;

					let distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
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
							leaf.textureNum = 7; 
							this.cubes[leafX][leafZ][leafY] = leaf;
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
