"use strict";

var canvas = document.getElementById("game");
var ctx = canvas.getContext("2d");

const CW = canvas.width;
const CH = canvas.height;

var currentLevelSize = "small";
var currentLevelNum = 0;
var currentLevel = null;
var blockSize = 100;

var keyUp = false;
var keyLeft = false;
var keyRight = false;
var toRestart = false;
var inMenu = true;

var playerX = 0;
var playerY = 0;
var playerVX = 0;
var playerVY = 0;
var playerSize = 80;

var jumpSound = new Howl({
	src: ["sounds/jump.wav", "sounds/jump.mp3", "sounds/jump.ogg"]
});
var bounceSound = new Howl({
	src: ["sounds/bounce.wav", "sounds/bounce.mp3", "sounds/bounce.ogg"]
});
var completeSound = new Howl({
	src: ["sounds/complete.wav", "sounds/complete.mp3", "sounds/complete.ogg"]
});
var hurtSound = new Howl({
	src: ["sounds/hurt.wav", "sounds/hurt.mp3", "sounds/hurt.ogg"]
});
var music = new Howl({
	src: ["sounds/bensound-buddy.mp3"],
	autoplay: true,
	loop: true,
	volume: 0.5
});

var logo = new Image();
logo.src = "images/logo.png";

function loadJSON(callback) {
	var xobj = new XMLHttpRequest();
	xobj.overrideMimeType("application/json");
	xobj.open("GET", "levels.json", true);
	xobj.onreadystatechange = function () {
		// eslint-disable-next-line
		if (xobj.readyState == 4 && xobj.status == "200") {
			callback(xobj.responseText);
		}
	};
	xobj.send(null);
}

var levels;
var menuID;
loadJSON(data => {
	levels = JSON.parse(data);
	currentLevel = levels[currentLevelSize][currentLevelNum];
	startLevel();
	// START MENU --------------------------------------------
	menuID = setInterval(menu, 1000 / 60);
});

function startLevel() {
	playerVX = 0;
	playerVY = 0;

	blockSize = currentLevel.length === 6 ? 100 : currentLevel.length === 12 ? 50 : 25;
	playerSize = blockSize * 0.8;

	currentLevel.forEach(function (row, ri) {
		for (var ti = 0; ti < row.length; ti++) {
			if (row[ti] === "P") {
				playerX = blockSize * ti + blockSize / 2;
				playerY = blockSize * ri + blockSize / 2;
			}
		}
	});
}

function nextLevel() {
	if (currentLevelNum + 2 > levels[currentLevelSize].length) {
		currentLevelNum = 0;
		currentLevelSize = currentLevelSize === "small" ? "normal" :
			currentLevelSize === "normal" ? "large" : "small";
	} else currentLevelNum++;
	currentLevel = levels[currentLevelSize][currentLevelNum];
	blockSize = currentLevel.length === 6 ? 100 :
		currentLevel.length === 12 ? 50 : 25;
	startLevel();
}

////////////////////////////////////////////////
// RENDERING -----------------------------------
////////////////////////////////////////////////

function getNeighbors(row, col) {
	var type = currentLevel[row][col];
	var n = {
		left: "0",
		right: "0",
		top: "0",
		bottom: "0",
	};

	var rows = currentLevel.length;
	var cols = currentLevel[0].length;

	if (col !== 0) {
		n.left = currentLevel[row].replace("P", "0")[col - 1];
	}
	if (col !== cols - 1) {
		n.right = currentLevel[row].replace("P", "0")[col + 1];
	}
	if (row !== 0) {
		n.top = currentLevel[row - 1].replace("P", "0")[col];
	}
	if (row !== rows - 1) {
		n.bottom = currentLevel[row + 1].replace("P", "0")[col];
	}

	return n;
}

function roundRect(x, y, w, h, radius) {
	if ("number" === typeof radius) {
		radius = {
			tl: radius,
			tr: radius,
			br: radius,
			bl: radius
		};
	} else {
		var f = {
			tl: 0,
			tr: 0,
			br: 0,
			bl: 0
		};
		for (var g in f)
			if ({}.hasOwnProperty.call(g, f)) radius[g] = radius[g] || f[g];
	}

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

const blockRenderer = new Map([
	// Placeholders
	["0", () => {}], // eslint-disable-line
	["P", () => {}], // eslint-disable-line
	["1", (row, col, baseColor = "1", topColor = "1") => {
		topColor = topColor === "1" ? "lime" : "red";
		baseColor = baseColor === "3" ? "blueviolet" :
			baseColor === "G" ? "yellow" : "#643a02";

		var neighbors = getNeighbors(row, col);
		var top = neighbors.top === "0";
		var left = neighbors.left === "0";
		var right = neighbors.right === "0";
		var bottom = neighbors.bottom === "0";
		var round = blockSize / 20;

		ctx.fillStyle = baseColor;
		roundRect(col * blockSize, row * blockSize, blockSize, blockSize, {
			tl: top && left ? round * 1.25 : 0,
			tr: top && right ? round * 1.25 : 0,
			bl: left && bottom ? round : 0,
			br: right && bottom ? round : 0
		}, true, false);

		if (baseColor === "#643a02" && top) {
			ctx.fillStyle = topColor;
			roundRect(col * blockSize, row * blockSize, blockSize, blockSize / 5, {
				tl: left ? round : 0,
				tr: right ? round : 0,
				bl: 0,
				br: 0
			}, true, false);
		}
	}],
	["2", (row, col) => {
		blockRenderer.get("1")(row, col, null, "2");
	}],
	["3", (row, col) => {
		blockRenderer.get("1")(row, col, "3");
	}],
	["G", (row, col) => {
		blockRenderer.get("1")(row, col, "G");
	}]
]);

function renderLevel() {
	currentLevel.forEach(function (row, ri) {
		for (var ti = 0; ti < row.length; ti++) {
			var type = currentLevel[ri][ti];
			blockRenderer.get(type)(ri, ti);
		}
	});
}

////////////////////////////////////////////////
// MOVEMENT ------------------------------------
////////////////////////////////////////////////

function xMove() {
	var speed = currentLevelSize === "small" ? 2.5 :
		currentLevelSize === "normal" ? 1.2 : 0.7; // "large"
	if (keyRight) playerVX += speed;
	if (keyLeft) playerVX -= speed;

	playerVX *= 0.8;

	if (playerX + playerVX <= playerSize / 2) {
		playerX = playerSize / 2 - playerVX;
	} else if (playerX + playerVX >= CW - playerSize / 2) {
		playerX = CW - playerSize / 2 - playerVX;
	}

	playerX += playerVX;
}

function yMove() {
	var onGround = false;
	var jumpAcc = currentLevelSize === "small" ? -10 :
		currentLevelSize === "normal" ? -5 : -2.5;
	var trampDiff = 1.45;
	
	currentLevel.forEach(function (row, ri) {
		for (var ti = 0; ti < row.length; ti++) {
			var type = row[ti];

			var topY = ri * blockSize;
			var bottomY = topY + blockSize;
			var rightX = ti * blockSize;
			var leftX = rightX + blockSize;

			var pnx = playerX + playerVX;
			var pny = playerY + playerVY;

			if (pny + playerSize / 2 >= topY && pny + playerSize / 2 < topY + blockSize / 4 &&
				pnx + playerSize / 2 >= rightX && pnx - playerSize / 2 <= leftX && playerVY >= 0
			) {
				switch (type) {
				case "1":
					playerVY = 0;
					playerY = topY - playerSize / 2;
					onGround = true;
					break;
				case "G":
					nextLevel();
					completeSound.play();
					// eslint-disable-next-line
				case "2":
					startLevel();
					if (type === "2") hurtSound.play();
					break;
				case "3":
					playerY = playerVY >= 0 ? topY - playerSize / 2 : playerY;
					playerVY = Math.min(-playerVY * 0.8, jumpAcc * trampDiff);
					bounceSound.play();
				}
			}
			if (pny - playerSize / 2 >= bottomY - blockSize / 4 && pny - playerSize / 2 <= bottomY &&
				pnx + playerSize / 2 >= rightX && pnx - playerSize / 2 <= leftX && playerVY <= 0
			) {
				switch (type) {
				case "1":
				case "2":
					playerVY = 0;
					playerY = bottomY + playerSize / 2;
					break;
				case "G":
					nextLevel();
					completeSound.play();
					// eslint-disable-next-line
				case "3":
					if (playerVY <= 0) {
						playerY = bottomY + playerSize / 2;
						playerVY = 5;
						bounceSound.play();
					}
				}
			}
		}
	});
	if (onGround && keyUp) {
		playerVY = jumpAcc;
		jumpSound.play();
	}
	if (!onGround) {
		playerVY += jumpAcc * -0.05;
	}
	if (playerY - playerSize / 2 >= CH) {
		startLevel();
		hurtSound.play();
	}
	playerY += playerVY;
}

////////////////////////////////////////////////
// GENERAL -------------------------------------
////////////////////////////////////////////////

function menu() {
	// Sky
	ctx.fillStyle = "cyan";
	ctx.fillRect(0, 0, CW, CH);

	// Level
	renderLevel();
	startLevel();
	ctx.fillStyle = "black";
	roundRect(playerX - playerSize / 2, playerY - playerSize / 2, playerSize, playerSize, 5);

	// Logo
	ctx.drawImage(logo, 150, 30);
	ctx.fillStyle = "black";
	ctx.textAlign = "center";
	ctx.font = "50px \"Open Sans\", Lato, sans-serif";
	ctx.fillText("Click to Begin!", CW / 2, 200);

	if (!inMenu) {
		setInterval(update, 1000 / 60);
		clearInterval(menuID);
	}
}

function update() {
	// Sky
	ctx.fillStyle = "cyan";
	ctx.fillRect(0, 0, CW, CH);

	renderLevel();

	// Player
	ctx.fillStyle = "black";
	roundRect(playerX - playerSize / 2, playerY - playerSize / 2, playerSize, playerSize, blockSize / 20);
	yMove();
	xMove();

	// Score
	ctx.textAlign = "right";
	ctx.font = "30px \"Open Sans\", Lato, sans-serif";
	ctx.fillText(
		`Level: ${currentLevelNum+1} | Level Size: ${currentLevelSize[0].toLocaleUpperCase()}${currentLevelSize.slice(1)}`,
		CW - 10, 40);

	if (toRestart) {
		startLevel();
		toRestart = false;
	}
}

var currentKeys = [];
var fullKeys = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];
var cheatMode = false;

function keyHandler(evt) {
	var setDir = evt.type === "keydown" ? true : false;

	switch (evt.keyCode) {
	case 37:
	case 65:
		keyLeft = setDir;
		break;
	case 38:
	case 87:
		keyUp = setDir;
		break;
	case 39:
	case 68:
		keyRight = setDir;
		break;
	case 82:
		toRestart = setDir;
	}

	if (cheatMode && evt.keyCode === 40 && !setDir) nextLevel();

	if (setDir === false) {
		currentKeys.push(evt.keyCode);
		if (currentKeys.length > fullKeys.length) currentKeys.shift();
		var correct = true;
		for (var i = 0; i < fullKeys.length; i++) {
			if (currentKeys[i] !== fullKeys[i]) {
				correct = false;
				break;
			}
		}
		cheatMode = cheatMode || correct;
	}
}

document.addEventListener("keydown", keyHandler);
document.addEventListener("keyup", keyHandler);

canvas.addEventListener("click", () => inMenu = false);