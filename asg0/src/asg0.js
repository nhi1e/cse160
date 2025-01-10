function main() {
	var canvas = document.getElementById("canvas");
	if (!canvas) {
		console.log("Failed to retrieve the <canvas> element");
		return false;
	}
	var ctx = canvas.getContext("2d");
	ctx.fillStyle = "rgba(0, 0, 0, 1.0)";
	ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawVector(v, color) {
	var canvas = document.getElementById("canvas");
	var ctx = canvas.getContext("2d");

	// Set the origin to the center of the canvas
	ctx.setTransform(1, 0, 0, 1, canvas.width / 2, canvas.height / 2);

	// Set the color for the vector
	ctx.strokeStyle = color;

	// Begin the path
	ctx.beginPath();
	ctx.moveTo(0, 0);
	ctx.lineTo(v.elements[0] * 20, -v.elements[1] * 20); // Scale the vector and invert y-axis
	ctx.stroke();
}

function handleDrawEvent() {
	var canvas = document.getElementById("canvas");
	var ctx = canvas.getContext("2d");

	// Reset transformation matrix to the default
	ctx.setTransform(1, 0, 0, 1, 0, 0);

	// Clear the canvas
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	// Reset the background
	ctx.fillStyle = "rgba(0, 0, 0, 1.0)";
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	console.log("Canvas cleared and background reset");

	//read v1 values from input fields
	let v1_x = document.getElementById("v1.x").value;
	let v1_y = document.getElementById("v1.y").value;
	let v1 = new Vector3([v1_x, v1_y]);
	drawVector(v1, "red");

	//read v2 values from input fields
	let v2_x = document.getElementById("v2.x").value;
	let v2_y = document.getElementById("v2.y").value;
	let v2 = new Vector3([v2_x, v2_y]);
	drawVector(v2, "blue");
}
function handleDrawOperationEvent() {
	// Get the canvas and its context
	var canvas = document.getElementById("canvas");
	var ctx = canvas.getContext("2d");

	// Reset transformation matrix to the default
	ctx.setTransform(1, 0, 0, 1, 0, 0);

	// Clear the canvas
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	// Reset the background
	ctx.fillStyle = "rgba(0, 0, 0, 1.0)";
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	console.log("Canvas cleared and background reset");

	// Read v1 values from input fields
	let v1_x = parseFloat(document.getElementById("v1.x").value);
	let v1_y = parseFloat(document.getElementById("v1.y").value);
	if (isNaN(v1_x) || isNaN(v1_y)) {
		alert("Invalid input for v1. Please enter numeric values.");
		return;
	}
	let v1 = new Vector3([v1_x, v1_y]);
	drawVector(v1, "red");

	// Read v2 values from input fields
	let v2_x = parseFloat(document.getElementById("v2.x").value);
	let v2_y = parseFloat(document.getElementById("v2.y").value);
	if (isNaN(v2_x) || isNaN(v2_y)) {
		alert("Invalid input for v2. Please enter numeric values.");
		return;
	}
	let v2 = new Vector3([v2_x, v2_y]);
	drawVector(v2, "blue");

	// Read scalar value
	let scalar = parseFloat(document.getElementById("scalar").value);

	// Read operation from the dropdown
	let operation = document.getElementById("op-select").value;
	let result1 = new Vector3([0, 0]);
	let result2 = new Vector3([0, 0]);

	switch (operation) {
		case "add":
			result1 = v1.add(v2);
			// console.log(result1);
			drawVector(result1, "green");
			break;
		case "subtract":
			result1 = v1.sub(v2);
			// console.log(result1);
			drawVector(result1, "green");
			break;
		case "multiply":
			result1 = v1.mul(scalar);
			result2 = v2.mul(scalar);
			// console.log(result1);
			// console.log(result2);
			drawVector(result1, "green");
			drawVector(result2, "green");
			break;
		case "divide":
			if (scalar === 0) {
				alert("Division by zero is not allowed.");
				return;
			}
			result1 = v1.div(scalar);
			result2 = v2.div(scalar);
			// console.log(result1);
			// console.log(result2);
			drawVector(result1, "green");
			drawVector(result2, "green");
			break;
		case "magnitude":
			let magnitude1 = v1.magnitude();
			let magnitude2 = v2.magnitude();
			console.log("Magnitude v1: ", magnitude1);
			console.log("Magnitude v2: ", magnitude2);
			break;
		case "normalize":
			let normalized1 = v1.normalize();
			let normalized2 = v2.normalize();
			console.log("Normalized v1: ", normalized1);
			console.log("Normalized v2: ", normalized2);
			drawVector(normalized1, "green");
			drawVector(normalized2, "green");
			break;
		case "angle":
			let angle = angleBetween(v1, v2);
			console.log("Angle: ", angle);
			break;
		case "area":
			let area = areaTriangle(v1, v2);
			console.log("Area of triangle:", area);
			break;
	}
}
function angleBetween(v1, v2) {
	const dotProduct = Vector3.dot(v1, v2);
	const magnitudeV1 = Math.sqrt(Vector3.dot(v1, v1));
	const magnitudeV2 = Math.sqrt(Vector3.dot(v2, v2));
	const cosAlpha = Math.min(
		1,
		Math.max(-1, dotProduct / (magnitudeV1 * magnitudeV2))
	); // Clamp value
	const radians = Math.acos(cosAlpha);
	const degrees = radians * (180 / Math.PI);
	return degrees;
}

function areaTriangle(v1, v2) {
	const crossProduct = Vector3.cross(v1, v2);
	const area = crossProduct / 2;
	return area;
}
