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
	sphere.matrix.scale(3, 3, 3);
	sphere.matrix.translate(0, -1, -1.3);
	sphere.render();

	// Point Light ==================================

	var light = new Cube();
	light.color = [2, 2, 0, 1];
	light.matrix.translate(g_lightPos[0], g_lightPos[1], g_lightPos[2]);
	light.matrix.scale(-0.1, -0.1, -0.1);
	light.matrix.translate(-0.5, -1, -0.5);
	light.render();

	// Sky =====================================
	var sky = new Cube();
	sky.color = [0.5, 0.5, 0.5, 1];
	// sky.textureNum = 1;
	if (g_normalOn) sky.textureNum = -3;
	sky.matrix.scale(-10, -10, -10);
	sky.matrix.translate(-0.5, -0.5, -0.5);
	sky.render();

	// Floor ===================================
	// var floor = new Cube();
	// floor.color = [0.2, 0.9, 0.4, 1];
	// floor.textureNum = 1;
	// floor.matrix.translate(0, -0.25, 0);
	// floor.matrix.scale(10, 0, 10);
	// floor.matrix.translate(-0.5, 0, -0.5);
	// floor.render();
}
