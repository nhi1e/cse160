class Camera {
	constructor() {
		this.eye = new Vector3([0, 1, 5]); // Camera position
		this.at = new Vector3([0, 0, -100]); // Looking direction
		this.up = new Vector3([0, 1, 0]); // Up direction

		this.yaw = 0; // Left/right rotation
		this.pitch = 0; // Up/down rotation
		this.sensitivity = 0.2; // Mouse movement speed
		this.turnSpeed = 2; // Turn speed for Q/E keys
	}

	forward() {
		let f = new Vector3(this.at.elements);
		f.elements[0] -= this.eye.elements[0];
		f.elements[1] -= this.eye.elements[1];
		f.elements[2] -= this.eye.elements[2];

		f.normalize();
		this.eye.elements[0] += f.elements[0];
		this.eye.elements[1] += f.elements[1];
		this.eye.elements[2] += f.elements[2];
		this.at.elements[0] += f.elements[0];
		this.at.elements[1] += f.elements[1];
		this.at.elements[2] += f.elements[2];
	}

	back() {
		let f = new Vector3(this.at.elements);
		f.elements[0] -= this.eye.elements[0];
		f.elements[1] -= this.eye.elements[1];
		f.elements[2] -= this.eye.elements[2];

		f.normalize();
		this.eye.elements[0] -= f.elements[0];
		this.eye.elements[1] -= f.elements[1];
		this.eye.elements[2] -= f.elements[2];
		this.at.elements[0] -= f.elements[0];
		this.at.elements[1] -= f.elements[1];
		this.at.elements[2] -= f.elements[2];
	}

	left() {
		let f = new Vector3(this.eye.elements);
		f.elements[0] -= this.at.elements[0];
		f.elements[1] -= this.at.elements[1];
		f.elements[2] -= this.at.elements[2];

		let s = new Vector3([
			this.up.elements[1] * f.elements[2] - this.up.elements[2] * f.elements[1],
			this.up.elements[2] * f.elements[0] - this.up.elements[0] * f.elements[2],
			this.up.elements[0] * f.elements[1] - this.up.elements[1] * f.elements[0],
		]);

		s.normalize();
		this.eye.elements[0] -= s.elements[0];
		this.eye.elements[1] -= s.elements[1];
		this.eye.elements[2] -= s.elements[2];
		this.at.elements[0] -= s.elements[0];
		this.at.elements[1] -= s.elements[1];
		this.at.elements[2] -= s.elements[2];
	}

	right() {
		let f = new Vector3(this.eye.elements);
		f.elements[0] -= this.at.elements[0];
		f.elements[1] -= this.at.elements[1];
		f.elements[2] -= this.at.elements[2];

		let s = new Vector3([
			this.up.elements[1] * f.elements[2] - this.up.elements[2] * f.elements[1],
			this.up.elements[2] * f.elements[0] - this.up.elements[0] * f.elements[2],
			this.up.elements[0] * f.elements[1] - this.up.elements[1] * f.elements[0],
		]);

		s.normalize();
		this.eye.elements[0] += s.elements[0];
		this.eye.elements[1] += s.elements[1];
		this.eye.elements[2] += s.elements[2];
		this.at.elements[0] += s.elements[0];
		this.at.elements[1] += s.elements[1];
		this.at.elements[2] += s.elements[2];
	}

	panLeft() {
		this.yaw -= this.turnSpeed;
		this.updateRotation();
	}

	panRight() {
		this.yaw += this.turnSpeed;
		this.updateRotation();
	}

	updateRotation() {
		let cosPitch = Math.cos((this.pitch * Math.PI) / 180);
		let sinPitch = Math.sin((this.pitch * Math.PI) / 180);
		let cosYaw = Math.cos((this.yaw * Math.PI) / 180);
		let sinYaw = Math.sin((this.yaw * Math.PI) / 180);

		// Update camera direction
		this.at.elements[0] = this.eye.elements[0] + cosYaw * cosPitch;
		this.at.elements[1] = this.eye.elements[1] + sinPitch;
		this.at.elements[2] = this.eye.elements[2] + sinYaw * cosPitch;
	}
}
