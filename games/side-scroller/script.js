let canvas = document.getElementById("game");
let ctx = canvas.getContext("2d");

const CW = canvas.width;
const CH = canvas.height;

const PH = 40; // Player Height
const PX = 20; // Player X
const PW = 10; // Player Width
const XV = 6; // X velocity
let py = (CH / 3) * 2 - PH; // Player Y
let yv = 0; // Y velocity

// Keys
let up = false;
let down = false;

// Background
let clouds = [];
let terrain = [];

// Blocks
let blocks = [];
const BW = 10; // Block Width

// Game and Rendering
let score = 0;
let hurtDelay = 0;

let prevTime = 0;

document.addEventListener("keydown", e => {
	let used = false;
	if (e.key === "ArrowUp" || e.key === "w" || e.key === " ") up = true, used = true;
	else if (e.key === "ArrowDown" || e.key === "s") down = true, used = true;
	if (used) e.preventDefault();
});

document.addEventListener("keyup", e => {
	let used = false;
	if (e.key === "ArrowUp" || e.key === "w" || e.key === " ") up = false, used = true;
	else if (e.key === "ArrowDown" || e.key === "s") down = false, used = true;
	if (used) e.preventDefault();
});

function onGround() {
	if (py < (CH / 3) * 2 - PH) {
		return false;
	}
	vy = 0;
	py = (CH / 3) * 2 - PH;
	return true;
}

function draw(time) {
	requestAnimationFrame(draw);

	drawRect(0, 0, CW, CH, "#36cdda"); // Sky

	// Moving clouds
	if (Math.random() < 0.05) {
		const col = Math.floor(Math.random() * 50 + 206);
		clouds.push({
			x: CW,
			y: Math.floor(Math.random() * (CH / 3)) - CH / 20,
			w: Math.floor(Math.random() * 50) + 50,
			h: Math.floor(Math.random() * 10) + 10,
			m: Math.floor(Math.random() * 3) + 1,
			c: `rgb(${col}, ${col}, ${col})`
		});
		clouds.sort((a, b) => b.m - a.m);
	}

	for (let i = clouds.length - 1; i >= 0; i--) {
		const cloud = clouds[i];
		roundRect(cloud.x, cloud.y, cloud.w, cloud.h, cloud.c, 5);
		cloud.x -= cloud.m;
		if (cloud.x < -cloud.w) {
			clouds.splice(i, 1);
		}
	}

	// Background Terrain
	if (Math.random() < 1) {
		const h = Math.floor(Math.random() * 120) + 20;
		terrain.push({
			x: CW,
			y: (CH / 3) * 2 - h + 10,
			w: Math.floor(Math.random() * 50) + 100,
			h: h,
			c: `rgb(0, ${200 - Math.floor(Math.sqrt(h)) * 10}, 0)`,
			m: (300 - h) / 60
		});
		terrain.sort((a, b) => b.m - a.m);
	}

	for (let i = terrain.length - 1; i >= 0; i--) {
		const thing = terrain[i];
		roundRect(thing.x, thing.y, thing.w, thing.h, thing.c, 10);
		thing.x -= thing.m;
		if (thing.x < -thing.w) {
			terrain.splice(i, 1);
		}
	}

	drawRect(0, (CH / 3) * 2, CW, CH / 3, "#2b692e"); // Ground Grass
	drawRect(0, (CH / 2.5) * 1.8, CW, CH / 2.5, "#643900"); // Ground Dirt

	// Random block spawning
	if (Math.random() > 0.98) {
		blocks.push({
			x: CW,
			h: Math.floor(Math.random() * 30) + 20,
			c: `rgb(${Math.floor(Math.random() * 100 + 156)}, 0, 0)`
		});
	}

	// Collision detection
	for (let i = blocks.length - 1; i >= 0; i--) {
		const block = blocks[i];
		if (
			block.x <= PX + PW &&
			block.x + BW >= PX &&
			!((CH / 3) * 2 - block.h >= py + PH) &&
			!hurtDelay
		) {
			score -= 50;
			hurtDelay = 90;
			blocks.splice(i, 1);
		}
	}

	for (let i = blocks.length - 1; i >= 0; i--) {
		const block = blocks[i];
		roundRect(block.x, (CH / 3) * 2 - block.h, BW, block.h + 5, block.c, 5);
		block.x -= XV;
		if (block.x < -BW) {
			blocks.splice(i, 1);
		}
	}

	// Jumping
	if (onGround()) {
		if (up) yv = -12;
		else {
			py = (CH / 3) * 2 - PH;
			yv = 0;
		}
	} else {
		if (down) yv = 12;
		else yv += 0.75;
	}
	py += yv;

	// Player
	if (hurtDelay > 0) {
		roundRect(
			PX,
			py,
			PW,
			PH,
			`#000${Math.floor(hurtDelay / 15) % 2 === 0 ? 4 : 6}`,
			5
		);
		hurtDelay--;
	} else {
		roundRect(PX, py, PW, PH, "black", 5);
	}

	// Score Incrementation
	score += (1 / 60) * 10;
	if (score > 0) ctx.fillStyle = "black";
	else ctx.fillStyle = "red";

	ctx.font = "30px bold Courier, monospace";
	ctx.fillText("Score: " + Math.floor(score), 20, 40);
}

function drawRect(x, y, w, h, c) {
	ctx.fillStyle = c;
	ctx.fillRect(x, y, w, h);
}

function roundRect(x, y, w, h, c, radius) {
	if ("number" === typeof radius) {
		radius = {
			tl: radius,
			tr: radius,
			br: radius,
			bl: radius
		};
	} else {
		let f = {
			tl: 0,
			tr: 0,
			br: 0,
			bl: 0
		};
		for (let g in f)
			if ({}.hasOwnProperty.call(g, f)) radius[g] = radius[g] || f[g];
	}

	ctx.fillStyle = c;

	ctx.beginPath();
	ctx.moveTo(x + radius.tl, y);
	ctx.lineTo(x + w - radius.tr, y);
	ctx.quadraticCurveTo(x + w, y, x + w, y + radius.tr);
	ctx.lineTo(x + w, y + h - radius.br);
	ctx.quadraticCurveTo(x + w, y + h, x + w - radius.br, y + h);
	ctx.lineTo(x + radius.bl, y + h);
	ctx.quadraticCurveTo(x, y + h, x, y + h - radius.bl);
	ctx.lineTo(x, y + radius.tl);
	ctx.quadraticCurveTo(x, y, x + radius.tl, y);
	ctx.closePath();
	ctx.fill();
}

requestAnimationFrame(draw);
