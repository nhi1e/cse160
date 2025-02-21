class Camera {
	constructor() {
		this.eye = new Vector3([16, 4, 10]);
		this.at = new Vector3([16, 4, 11]);
		this.up = new Vector3([0, 1, 0]);

		this.angle_x = 0;
		this.angle_y = 0;

		this.speed = 7.0;
		this.select_dist = 15;

		this.placeCube = null;
		this.RemoveCube = null;

	}

	rotateX(angle) {
		let delta_ang = angle - this.angle_x;
		this.angle_x = angle;
		this.at.sub(this.eye);
		var matrix = new Matrix4().setRotate(delta_ang, 1, 0, 0);
		this.at = matrix.multiplyVector3(this.at);
		this.at.add(this.eye);
	}

	rotateY(angle) {
		let delta_ang = angle - this.angle_y;
		this.angle_y = angle;
		this.at.sub(this.eye);
		var matrix = new Matrix4().setRotate(delta_ang, 0, 1, 0);
		this.at = matrix.multiplyVector3(this.at);
		this.at.add(this.eye);
	}

	rotate(xAng, yAng) {
		let delta_ang_y = yAng - this.angle_y;
		this.angle_y = yAng;
		let delta_ang_x = xAng - this.angle_x;
		this.angle_x = xAng;
		this.at.sub(this.eye);

		var x_vector = Vector3.cross(this.at, this.up).normalize();

		var matrix = new Matrix4().rotate(delta_ang_y, 0, 1, 0);
		this.at = matrix.multiplyVector3(this.at);

		matrix = new Matrix4().rotate(
			delta_ang_x,
			x_vector.elements[0],
			x_vector.elements[1],
			x_vector.elements[2]
		);
		this.at = matrix.multiplyVector3(this.at);

		this.at.add(this.eye);
	}

	handle_movement(forward, back, right, left, up, down, delta_time) {
		if (!forward && !back && !right && !left && !up && !down) {
			return;
		}

		var wanted_vector = new Vector3();
		var forward_vect = new Vector3().set(this.at).sub(this.eye);
		var LR_vector = Vector3.cross(forward_vect, this.up).normalize();

		if (forward) wanted_vector.add(forward_vect);
		if (back) wanted_vector.sub(forward_vect);
		if (right) wanted_vector.add(LR_vector);
		if (left) wanted_vector.sub(LR_vector);
		if (up) wanted_vector.add(this.up);
		if (down) wanted_vector.sub(this.up);

		if (wanted_vector.magnitude() == 0) return;

		wanted_vector.normalize().mul(delta_time * this.speed);
		this.eye.add(wanted_vector);
		this.at.add(wanted_vector);
	}

	castRay() {
		if (
			this.eye.elements[0] < 0 ||
			this.eye.elements[0] > 32 ||
			this.eye.elements[1] < 0 ||
			this.eye.elements[1] > 32 ||
			this.eye.elements[2] < 0 ||
			this.eye.elements[2] > 32
		) {
			this.placeCube = null;
			this.RemoveCube = null;
			return;
		}

		let direction_vect = new Vector3().set(this.at).sub(this.eye).normalize();
		let mapX = Math.floor(this.eye.elements[0]);
		let mapY = Math.floor(this.eye.elements[1]);
		let mapZ = Math.floor(this.eye.elements[2]);

		let deltDistX =
			direction_vect.elements[0] === 0
				? Infinity
				: Math.abs(1 / direction_vect.elements[0]);
		let deltDistY =
			direction_vect.elements[1] === 0
				? Infinity
				: Math.abs(1 / direction_vect.elements[1]);
		let deltDistZ =
			direction_vect.elements[2] === 0
				? Infinity
				: Math.abs(1 / direction_vect.elements[2]);

		let stepX = direction_vect.elements[0] < 0 ? -1 : 1;
		let sideDistX =
			direction_vect.elements[0] < 0
				? (this.eye.elements[0] - mapX) * deltDistX
				: (mapX + 1 - this.eye.elements[0]) * deltDistX;
		let stepY = direction_vect.elements[1] < 0 ? -1 : 1;
		let sideDistY =
			direction_vect.elements[1] < 0
				? (this.eye.elements[1] - mapY) * deltDistY
				: (mapY + 1 - this.eye.elements[1]) * deltDistY;
		let stepZ = direction_vect.elements[2] < 0 ? -1 : 1;
		let sideDistZ =
			direction_vect.elements[2] < 0
				? (this.eye.elements[2] - mapZ) * deltDistZ
				: (mapZ + 1 - this.eye.elements[2]) * deltDistZ;

		let hit = 0;
		let side = 0;

		while (hit == 0) {
			if (sideDistX < sideDistY && sideDistX < sideDistZ) {
				sideDistX += deltDistX;
				mapX += stepX;
				side = 0;
			} else if (sideDistY < sideDistZ) {
				sideDistY += deltDistY;
				mapY += stepY;
				side = 1;
			} else {
				sideDistZ += deltDistZ;
				mapZ += stepZ;
				side = 2;
			}

			if (
				mapX < 0 ||
				mapX > 31 ||
				mapZ < 0 ||
				mapZ > 31 ||
				mapY < 0 ||
				mapY > 31
			) {
				this.placeCube = null;
				this.RemoveCube = null;
				return;
			}

			if (g_map.cubes[mapX][mapZ][mapY] !== null) {
				hit = 1;
			}
		}

		switch (side) {
			case 0:
				this.placeCube = [mapX - stepX, mapY, mapZ];
				break;
			case 1:
				this.placeCube = [mapX, mapY - stepY, mapZ];
				break;
			case 2:
				this.placeCube = [mapX, mapY, mapZ - stepZ];
				break;
			default:
				this.placeCube = null;
				break;
		}

		this.RemoveCube = [mapX, mapY, mapZ];

	}
}
