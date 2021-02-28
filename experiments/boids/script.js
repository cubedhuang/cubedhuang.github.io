const flock = [];

let debugP;
let pauseC, directionC, desiredC, hueC, vision1C, vision2C, neighborsC;
let alignS, alignP,
	cohesionS, cohesionP,
	separationS, separationP;
let trailS, trailP;
let noiseS, noiseP;
let visionS, visionP;
let maxForceS, maxForceP, maxSpeedS, maxSpeedP;
let mouseForce;

function setup() {
	createCanvas(800, 600);
	colorMode(HSB, 255);

	createP("use your mouse buttons to move the boids, or just watch their flocking patterns!");
	
	pauseC = createCheckbox(" paused", false);
	directionC = createCheckbox(" show direction", true);
	desiredC = createCheckbox(" show desired direction", false);
	hueC = createCheckbox(" change hue to indicate speed", true);
	vision1C = createCheckbox(" show vision areas", false);
	vision2C = createCheckbox(" show vision outlines", false);
	neighborsC = createCheckbox(" show visible neighbors", false);
	bounceC = createCheckbox(" bounce off of edges", false);

	trailP = createP("trail opacity: 50");
	trailS = createSlider(0, 120, 50, 5);

	noiseP = createP("movement randomness: 0.2");
	noiseS = createSlider(0, 5, 2, 0.5);

	visionP = createP("boid vision: 50");
	visionS = createSlider(0, 200, 50, 5);

	alignP = createP("alignment force: 1");
	alignS = createSlider(0, 4, 1, 0.1);
	cohesionP = createP("cohesion force: 1");
	cohesionS = createSlider(0, 4, 1, 0.1);
	separationP = createP("separation force: 1");
	separationS = createSlider(0, 4, 1, 0.1);

	maxForceP = createP("steering force: 0.2");
	maxForceS = createSlider(0, 1, 0.2, 0.05);

	maxSpeedP = createP("max speed: 10");
	maxSpeedS = createSlider(0, 20, 10, 0.5);

	background(31);
	for (let i = 0; i < 150; i++) {
		flock.push(new Boid(i));
	}

	document.querySelector("canvas").addEventListener("contextmenu", e => e.preventDefault());
}

function draw() {
	if (!pauseC.checked()) {
		background(31, 31, 31, 255 - trailS.value());

		mouseForce = max((alignS.value() + cohesionS.value() + separationS.value()) / 3, 1);
	
		for (const boid of flock) {
			boid.flock(flock);
		}
		for (const boid of flock) {
			boid.update();
			boid.showData();
		}
		for (const boid of flock) {
			boid.showSelf();
		}
	} else {
		background(31, 31, 31, 255);
	
		for (const boid of flock) {
			boid.showData();
		}
		for (const boid of flock) {
			boid.showSelf();
		}
	}

	trailP.html("trail opacity: " + trailS.value());
	noiseP.html("movement randomness: " + noiseS.value());
	visionP.html("boid vision: " + visionS.value());
	alignP.html("alignment force: " + alignS.value());
	cohesionP.html("cohesion force: " + cohesionS.value());
	separationP.html("separation force: " + separationS.value());
	maxForceP.html("steering force: " + maxForceS.value());
	maxSpeedP.html("max speed: " + maxSpeedS.value());
}