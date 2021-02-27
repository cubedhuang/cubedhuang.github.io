const flock = [];

let debugP;
let pauseC, directionC, hueC, visionC;
let alignS, cohesionS, separationS, alignP, cohesionP, separationP;
let visionS, visionP;
let maxForceS, maxForceP, maxSpeedS, maxSpeedP;

function setup() {
	createCanvas(800, 600);
	colorMode(HSB, 255);

	createP("use your mouse buttons to move the boids, or just watch their flocking patterns!");
	
	pauseC = createCheckbox(" paused", false);
	directionC = createCheckbox(" show direction", true);
	hueC = createCheckbox(" change hue to indicate speed", true);
	visionC = createCheckbox(" show vision radius", false);

	visionP = createP("vision: 75");
	visionS = createSlider(0, 250, 75, 5);

	alignP = createP("alignment force: 1");
	alignS = createSlider(0, 5, 1, 0.1);
	cohesionP = createP("cohesion force: 1");
	cohesionS = createSlider(0, 5, 1, 0.1);
	separationP = createP("separation force: 1");
	separationS = createSlider(0, 5, 1, 0.1);

	maxForceP = createP("steering force: 0.2");
	maxForceS = createSlider(0, 2, 0.2, 0.05);

	maxSpeedP = createP("max speed: 10");
	maxSpeedS = createSlider(0, 20, 10, 0.5);

	background(31);
	for (let i = 0; i < 150; i++) {
		flock.push(new Boid());
	}
}

function draw() {
	if (!pauseC.checked()) {
		background(31, 31, 31, 180);
	
		for (const boid of flock) {
			boid.flock(flock);
			boid.update();
			boid.show();
		}
	} else {
		background(31, 31, 31, 180);
	
		for (const boid of flock) {
			boid.show();
		}
	}

	visionP.html("vision: " + visionS.value());
	alignP.html("alignment force: " + alignS.value());
	cohesionP.html("cohesion force: " + cohesionS.value());
	separationP.html("separation force: " + separationS.value());
	maxForceP.html("steering force: " + maxForceS.value());
	maxSpeedP.html("max speed: " + maxSpeedS.value());
}

setTimeout(() => {
	document.querySelector("canvas").addEventListener('contextmenu', event => event.preventDefault());
}, 1000);