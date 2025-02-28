function renderAllShapes() {
	// Pass light pos to GLSL
	gl.uniform3f(u_lightPos, g_lightPos[0], g_lightPos[1], g_lightPos[2]);
	gl.uniform3f(
		u_cameraPos,
		g_camera.eye.elements[0],
		g_camera.eye.elements[1],
		g_camera.eye.elements[2]
	);
	gl.uniform1i(u_lightOn, g_lightOn);

	// Sphere ==================================
	var sphere = new Sphere(20);
	sphere.color = [0.9, 0.6, 0.95, 1];
	sphere.textureNum = 0;
	if (g_normalOn) sphere.textureNum = -3;
	sphere.matrix.scale(2.2, 2.2, 2.2);
	sphere.matrix.translate(0, -1, -0.8);
	sphere.render();

	// Point Light ==================================

	var light = new Cube();
	light.color = [2, 2, 0, 1];
	light.matrix.translate(g_lightPos[0], g_lightPos[1], g_lightPos[2]);
	light.matrix.scale(-0.1, -0.1, -0.1);
	light.matrix.translate(-0.5, -1, -0.5);
	light.render();

	// Spot Light ==================================
	var spot = new Cube();
	spot.color = [0, 0, 2, 1];
	spot.matrix.translate(
		g_spotlightPos[0],
		g_spotlightPos[1],
		g_spotlightPos[2]
	);
	spot.matrix.scale(-0.1, -0.1, -0.1);
	spot.render();

	// Sky =====================================
	var room = new Cube();
	room.color = [0.5, 0.5, 0.5, 1];
	if (g_normalOn) room.textureNum = -3;
	room.matrix.scale(-10, -10, -10);
	room.matrix.translate(-0.5, -0.5, -0.5);
	room.render();

	// Floor ===================================
	var floor = new Cube();
	floor.color = [0.2, 0.9, 0.4, 1];
	floor.textureNum = 1;
	if (g_normalOn) floor.textureNum = -3;
	floor.matrix.translate(0, -4.8, 0);
	floor.matrix.scale(10, 0, 10);
	floor.matrix.translate(-0.5, 0, -0.5);
	floor.render();
}
