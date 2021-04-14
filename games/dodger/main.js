let canvas = document.createElement("canvas");
canvas.width = 800;
canvas.height = 600;

let ctx = canvas.getContext("2d");

document.getElementById("game").appendChild(canvas);

let blocks = [];

let upKey = false;
let downKey = false;
let rightKey = false;
let leftKey = false;

let player = {
	x: canvas.width / 2 - 25,
	y: canvas.height / 3 * 2 - 25,
	vx: 0,
	vy: 0,
	ac: 2,
	size: 50,
	dead: false
};

let points = 0;
let highscore = 0;

const random = (min, max) => Math.random() * (max - min) + min;

function newBlock() {
	let point = false;
	if (Math.random() < 0.3) point = true;
	let newSize = point ? random(5, 10) : random(10, 20);
	blocks.push(new Block(
		random(newSize * 2, canvas.width - newSize * 2),
		-newSize,
		random(0, 0.3) * (point ? 1.2 : 1),
		random(3, 5) * (point ? 1.2 : 1),
		newSize,
		point ? "lime" : "white"
	));
}

function collisions() {
	blocks.forEach((block, index, arr) => {
		if (block.dead) {
			blocks.splice(index, 1);
			return;
		}
		if (block.x >= player.x - block.size / 2 && block.x <= player.x + player.size + block.size / 2 &&
			block.y >= player.y - block.size / 2 && block.y <= player.y + player.size + block.size / 2) {
				if (block.isPoint) {
					points++;
					arr.splice(index, 1);
				} else player.dead = true;
		}
	});
}

function movement() {
	if (rightKey) player.vx += player.ac;
	if (leftKey) player.vx -= player.ac;
	if (downKey) player.vy += player.ac;
	if (upKey) player.vy -= player.ac;

	if (player.vx + player.x <= 0 ||
		player.vx + player.x + player.size >= canvas.width) { player.vx = 0; }
	if (player.vy + player.y <= 0 ||
		player.vy + player.y + player.size >= canvas.height) { player.vy = 0; }

	player.vx *= 0.7;
	player.vy *= 0.7;
	player.x += player.vx;
	player.y += player.vy;

	blocks.forEach(block => block.move(canvas));
}

function update() {
	loopID = requestAnimationFrame(update);

	ctx.fillStyle = "black";
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	ctx.fillStyle = "cyan";
	ctx.fillRect(player.x, player.y, player.size, player.size);

	if (Math.random() < 0.1 && blocks.length < 1000) newBlock();
	
	ctx.fillStyle = "white";
	blocks.forEach(block => block.render(ctx));

	for (let i = 0; i < 50; ++i) {
		ctx.fillStyle = `rgba(0, 0, 0, ${(50 - i) / 50})`
		ctx.fillRect(0, i * 5, canvas.width, 5);
	}

	ctx.fillStyle = "cyan";
	ctx.font = "20px bold Courier, monospace";
	ctx.textAlign = "left";
	ctx.textBaseline = "hanging";
	ctx.fillText(`Points: ${points}`, 10, 10);

	if (points > highscore) highscore = points;
	
	ctx.textAlign = "right";
	ctx.textBaseline = "hanging";
	ctx.fillText(`Highscore: ${highscore}`, canvas.width - 10, 10);

	collisions();
	movement();

	if (player.dead) killPlayer();
}

function killPlayer() {
	ctx.fillStyle = "red";
	ctx.font = "50px monospace";
	ctx.textAlign = ctx.textBaseline = "center";
	ctx.fillText("GAME OVER", canvas.width / 2, canvas.height / 2 - 100);
	ctx.font = "30px monospace";
	ctx.fillText("Press [SPACE] to restart.", canvas.width / 2, canvas.height / 2);
	cancelAnimationFrame(loopID);
	loopID = false;
}

function restart() {
	if (loopID === false)
		loopID = requestAnimationFrame(update),
		player.dead = false,
		player.x = canvas.width / 2 - 25,
		player.y = canvas.height / 3 * 2 - 25,
		player.vx = player.vy = 0,
		blocks = [],
		points = 0;
}

document.addEventListener("keydown", evt => {
	switch (evt.keyCode) {
		case 38: case 87:
			upKey = true;
			break;
		case 40: case 83:
			downKey = true;
			break;
		case 39: case 68:
			rightKey = true;
			break;
		case 37: case 65:
			leftKey = true;
			break;
		case 32:
			restart();
	}
});

document.addEventListener("keyup", evt => {
	switch (evt.keyCode) {
		case 38: case 87:
			upKey = false;
			break;
		case 40: case 83:
			downKey = false;
			break;
		case 39: case 68:
			rightKey = false;
			break;
		case 37: case 65:
			leftKey = false;
			break;
		case 32:
			restart();
	}
});

let loopID = requestAnimationFrame(update);

window.onload = function() {
	let score = localStorage.getItem("highscore");
	if (score) highscore = score;
}

window.onbeforeunload = function() {
	localStorage.setItem("highscore", highscore)
}