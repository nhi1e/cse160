class Camera {
	constructor() {
		// Camera position and orientation
		this.position = new Vector3([16, 4, 10]);
		this.target = new Vector3([16, 4, 11]);
		this.upVector = new Vector3([0, 1, 0]);

		// Rotation angles
		this.rotationX = 0;
		this.rotationY = 0;

		// Movement settings
		this.movementSpeed = 7.0;
		this.selectionDistance = 15;

		// Cube placement/removal tracking
		this.placementPosition = null;
		this.removalPosition = null;
	}

	rotateX(angle) {
		let deltaAngle = angle - this.rotationX;
		this.rotationX = angle;

		this.target.sub(this.position);
		let rotationMatrix = new Matrix4().setRotate(deltaAngle, 1, 0, 0);
		this.target = rotationMatrix.multiplyVector3(this.target);
		this.target.add(this.position);
	}

	rotateY(angle) {
		let deltaAngle = angle - this.rotationY;
		this.rotationY = angle;

		this.target.sub(this.position);
		let rotationMatrix = new Matrix4().setRotate(deltaAngle, 0, 1, 0);
		this.target = rotationMatrix.multiplyVector3(this.target);
		this.target.add(this.position);
	}

	rotate(xAngle, yAngle) {
		let deltaAngleY = yAngle - this.rotationY;
		this.rotationY = yAngle;

		let deltaAngleX = xAngle - this.rotationX;
		this.rotationX = xAngle;

		this.target.sub(this.position);

		// Compute the horizontal axis for rotation
		let horizontalAxis = Vector3.cross(this.target, this.upVector).normalize();

		// Apply Y-axis rotation
		let rotationMatrix = new Matrix4().rotate(deltaAngleY, 0, 1, 0);
		this.target = rotationMatrix.multiplyVector3(this.target);

		// Apply X-axis rotation around the computed horizontal axis
		rotationMatrix = new Matrix4().rotate(
			deltaAngleX,
			horizontalAxis.elements[0],
			horizontalAxis.elements[1],
			horizontalAxis.elements[2]
		);
		this.target = rotationMatrix.multiplyVector3(this.target);
		this.target.add(this.position);
	}

	handleMovement(forward, backward, right, left, upward, downward, deltaTime) {
		if (!(forward || backward || right || left || upward || downward)) {
			return;
		}

		let movementVector = new Vector3();
		let forwardVector = new Vector3().set(this.target).sub(this.position);
		let strafeVector = Vector3.cross(forwardVector, this.upVector).normalize();

		if (forward) movementVector.add(forwardVector);
		if (backward) movementVector.sub(forwardVector);
		if (right) movementVector.add(strafeVector);
		if (left) movementVector.sub(strafeVector);
		if (upward) movementVector.add(this.upVector);
		if (downward) movementVector.sub(this.upVector);

		if (movementVector.magnitude() === 0) return;

		// Normalize movement and apply speed
		movementVector.normalize().mul(deltaTime * this.movementSpeed);
		this.position.add(movementVector);
		this.target.add(movementVector);
	}

	castRay() {
		if (this.position.elements.some((coord) => coord < 0 || coord > 32)) {
			this.placementPosition = null;
			this.removalPosition = null;
			return;
		}

		let direction = new Vector3()
			.set(this.target)
			.sub(this.position)
			.normalize();

		let mapX = Math.floor(this.position.elements[0]);
		let mapY = Math.floor(this.position.elements[1]);
		let mapZ = Math.floor(this.position.elements[2]);

		let deltaDistX =
			direction.elements[0] === 0
				? Infinity
				: Math.abs(1 / direction.elements[0]);
		let deltaDistY =
			direction.elements[1] === 0
				? Infinity
				: Math.abs(1 / direction.elements[1]);
		let deltaDistZ =
			direction.elements[2] === 0
				? Infinity
				: Math.abs(1 / direction.elements[2]);

		let stepX = direction.elements[0] < 0 ? -1 : 1;
		let sideDistX =
			direction.elements[0] < 0
				? (this.position.elements[0] - mapX) * deltaDistX
				: (mapX + 1 - this.position.elements[0]) * deltaDistX;

		let stepY = direction.elements[1] < 0 ? -1 : 1;
		let sideDistY =
			direction.elements[1] < 0
				? (this.position.elements[1] - mapY) * deltaDistY
				: (mapY + 1 - this.position.elements[1]) * deltaDistY;

		let stepZ = direction.elements[2] < 0 ? -1 : 1;
		let sideDistZ =
			direction.elements[2] < 0
				? (this.position.elements[2] - mapZ) * deltaDistZ
				: (mapZ + 1 - this.position.elements[2]) * deltaDistZ;

		let hit = false;
		let hitSide = 0;

		while (!hit) {
			if (sideDistX < sideDistY && sideDistX < sideDistZ) {
				sideDistX += deltaDistX;
				mapX += stepX;
				hitSide = 0;
			} else if (sideDistY < sideDistZ) {
				sideDistY += deltaDistY;
				mapY += stepY;
				hitSide = 1;
			} else {
				sideDistZ += deltaDistZ;
				mapZ += stepZ;
				hitSide = 2;
			}

			// Check if out of bounds
			if (
				mapX < 0 ||
				mapX > 31 ||
				mapY < 0 ||
				mapY > 31 ||
				mapZ < 0 ||
				mapZ > 31
			) {
				this.placementPosition = null;
				this.removalPosition = null;
				return;
			}

			// If a block is hit
			if (g_map.cubes[mapX][mapZ][mapY] !== null) {
				hit = true;
			}
		}

		// Determine placement position based on hit side
		switch (hitSide) {
			case 0:
				this.placementPosition = [mapX - stepX, mapY, mapZ];
				break;
			case 1:
				this.placementPosition = [mapX, mapY - stepY, mapZ];
				break;
			case 2:
				this.placementPosition = [mapX, mapY, mapZ - stepZ];
				break;
			default:
				this.placementPosition = null;
				break;
		}

		this.removalPosition = [mapX, mapY, mapZ];
	}
}
