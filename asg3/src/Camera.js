class Camera {
	constructor() {
		this.eye = new Vector3([0, 0, 3]);
		this.at = new Vector3([0, 0, -100]);
		this.up = new Vector3([0, 1, 0]);
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
}
