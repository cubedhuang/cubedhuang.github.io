var canvas = document.getElementById('game');
var ctx = canvas.getContext('2d');

const CW = canvas.width;
const CH = canvas.height;

const PH = 40; // Player Height
const PX = 20; // Player X
const PW = 10; // Player Width
const XV = 5; // X velocity
var py = (CH/3*2)-PH; // Player Y
var yv = 0 // Y velocity

// Keys
var up = false;
var down = false;

// Background
var clouds = [];
var terrain = [];

// Blocks
var blocks = [];
const BW = 10; // Block Width

// Game and Rendering
var score = 0;
var hurtDelay = 0;

document.addEventListener('keydown', function(e) {
	if (e.keyCode == 38 || e.keyCode == 87) { // Up key or W key
		up = true;
	} else if (e.keyCode == 40 || e.keyCode == 83) { // Down key or S key
		down = true;
	}
});

document.addEventListener('keyup', function(e) {
	if (e.keyCode == 38 || e.keyCode == 87) {
		up = false;
	} else if (e.keyCode == 40 || e.keyCode == 83) {
		down = false;
	}
});

function onGround() {
	if (py < (CH/3*2)-PH) {
		return false;
	};
	vy = 0;
	py = (CH/3*2)-PH;
	return true;
}

function draw() {
	requestAnimationFrame(draw);

	drawRect(0, 0, CW, CH, '#36cdda'); // Sky
	// Moving clouds
	if (Math.random() > 0.98) {
		clouds.push({
			x: CW,
			y: Math.floor(Math.random() * (CH/3)) - CH/20,
			w: Math.floor(Math.random() * 50) + 50,
			h: Math.floor(Math.random() * 10) + 10,
			m: Math.floor(Math.random() * 3) + 1
		});
	}
	clouds.forEach(function(cloud, index) {
		drawRect(cloud.x, cloud.y, cloud.w, cloud.h, 'white');
		cloud.x -= cloud.m;
		if (cloud.x < -cloud.w) {
			clouds.splice(index, 1);
		}
	});
	// Background Terrain
	if (Math.random() > 0.7) {
		terrain.push({
			x: CW,
			w: Math.floor(Math.random() * 50) + 50,
			h: Math.floor(Math.random() * 30) + 30,
		});
		var item = terrain[terrain.length-1]
		item.y = (CH/3*2)-item.h;
	}
	terrain.forEach(function(value, index) {
		drawRect(value.x, value.y, value.w, value.h, 'lightgreen');
		value.x -= 3;
		if (value.x < -value.w) {
			terrain.splice(index, 1);
		}
	});

	// Player
	if (hurtDelay > 0) {
		drawRect(PX, py, PW, PH, 'red');
	} else {
		drawRect(PX, py, PW, PH, 'black');
	}
	hurtDelay--;

	drawRect(0, CH/3*2, CW, CH/3, 'lime'); // Ground Grass
	drawRect(0, CH/2.5*1.8, CW, CH/2.5, '#643900'); // Ground Dirt
	
	// Random block spawning
	if (Math.random() > 0.98) {
		blocks.push({
			x: CW,
			h: Math.floor(Math.random() * 30) + 20
		})
	}

	// Render and move Blocks
	blocks.forEach(function(block) {
		drawRect(block.x, (CH/3*2)-block.h, BW, block.h, 'red');
		block.x -= XV;
		if (block.x < -BW) {
			blocks.shift();
		}
	});

	// Collision detection
	blocks.forEach(function(block) {
		if (block.x <= PX+PW && block.x+BW >= PX &&
			!((CH/3*2)-block.h >= py+PH)) {
			score -= 4;
			hurtDelay = 10;
		}
	});

	// Ground-Pounding
	if (down && !onGround()) {
		yv = 8;
	}

	// Jumping
	if (up && onGround()) {
		yv = -8;
	} else if (!onGround()) {
		yv += 0.2;
	}
	py += yv;

	// Score Incrementation
	score += 0.1;
	if (score > 0) {
		ctx.fillStyle = 'black';
	} else {
		ctx.fillStyle = 'red';
	}
    ctx.font = "30px Courier, monospace";
    ctx.fillText('Score: ' + Math.round(score), 20, 40);
}

function drawRect(x, y, w, h, c) {
	ctx.fillStyle = c;
	ctx.fillRect(x, y, w, h);
}

requestAnimationFrame(draw);