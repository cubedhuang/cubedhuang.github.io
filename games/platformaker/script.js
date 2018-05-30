// --------------------------- //
// --- VARIABLE GENERATION --- //
// --------------------------- //

const canvas = document.getElementsByTagName("canvas")[0];
const ctx = canvas.getContext("2d");

const CW = 800;
const CH = 600;

const levels = {
	small: [
		"00000000",
		"00000000",
		"00000000",
		"00000000",
		"P0000000",
		"1111111G"
	],
	medium: [
		"0000000000000000",
		"0000000000000000",
		"0000000000000000",
		"0000000000000000",
		"0000000000000000",
		"0000000000000000",
		"0000000000000000",
		"0000000000000000",
		"0000000000000000",
		"0000000000000000",
		"P000000000000000",
		"111111111111111G"
	],
	large: [
		"00000000000000000000000000000000",
		"00000000000000000000000000000000",
		"00000000000000000000000000000000",
		"00000000000000000000000000000000",
		"00000000000000000000000000000000",
		"00000000000000000000000000000000",
		"00000000000000000000000000000000",
		"00000000000000000000000000000000",
		"00000000000000000000000000000000",
		"00000000000000000000000000000000",
		"00000000000000000000000000000000",
		"00000000000000000000000000000000",
		"00000000000000000000000000000000",
		"00000000000000000000000000000000",
		"00000000000000000000000000000000",
		"00000000000000000000000000000000",
		"00000000000000000000000000000000",
		"00000000000000000000000000000000",
		"00000000000000000000000000000000",
		"00000000000000000000000000000000",
		"00000000000000000000000000000000",
		"00000000000000000000000000000000",
		"P0000000000000000000000000000000",
		"1111111111111111111111111111111G"
	],
};

let currentLevel = levels.small;
let blockSize = 100;
let brush = "1";
let drawing = false;

let mouseX = -1;
let mouseY = -1;

// --------------------------- //
// --- RENDERING FUNCTIONS --- //
// --------------------------- //

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

const blockRenderer = new Map([
	// Placeholders
	["0", () => {}], // eslint-disable-line
	["P", (row, col) => {
		ctx.fillStyle = "black";
		const playerSize = blockSize * 0.8;
		const offset = blockSize * 0.1;
		roundRect(col * blockSize + offset, row * blockSize + offset, playerSize, playerSize, blockSize / 20);
	}],
	["1", (row, col, baseColor = "1", topColor = "1") => {
		topColor = topColor === "1" ? "lime" : "red";
		baseColor = baseColor === "3" ? "blueviolet" :
			baseColor === "G" ? "yellow" : "#643a02";

		const neighbors = getNeighbors(row, col);
		const top = neighbors.top === "0";
		const left = neighbors.left === "0";
		const right = neighbors.right === "0";
		const bottom = neighbors.bottom === "0";
		const round = blockSize / 20;

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
	currentLevel.forEach((row, ri) => {
		for (var ti = 0; ti < row.length; ti++) {
			var type = currentLevel[ri][ti];
			blockRenderer.get(type)(ri, ti);
		}
	});
}

// ------------------- //
// --- UPDATE LOOP --- //
// ------------------- //

function update() {
	// Sky
	ctx.fillStyle = "cyan";
	ctx.fillRect(0, 0, CW, CH);

	renderLevel();

	ctx.fillStyle = "#0005";
	const x = Math.floor(mouseX / blockSize);
	const y = Math.floor(mouseY / blockSize);
	roundRect(x * blockSize, y * blockSize, blockSize, blockSize, blockSize / 20);

	if (drawing) {
		if (brush === "P" || brush === "G") {
			currentLevel.forEach((row, ri) => {
				for (var ti = 0; ti < row.length; ti++) {
					if (currentLevel[ri][ti] === brush) {
						currentLevel[ri] = row.substr(0, ti) + "0" + row.substr(ti + 1);
					}
				}
			});
		}

		if (currentLevel[y][x] !== "P" && currentLevel[y][x] !== "G") {
			const row = currentLevel[y];
			currentLevel[y] = row.substr(0, x) + brush + row.substr(x + 1);
		}
	}

	// Player
	// ctx.fillStyle = "black";
	// roundRect(playerX - playerSize / 2, playerY - playerSize / 2, playerSize, playerSize, blockSize / 20);
}

// ----------------------- //
// --- EVENT LISTENERS --- //
// ----------------------- //

canvas.addEventListener("mousemove", e => {
	const rect = canvas.getBoundingClientRect();
	mouseX = e.clientX - rect.left,
	mouseY = e.clientY - rect.top
});
canvas.addEventListener("mouseleave", () => mouseX = -1, mouseY = -1, drawing = false);

canvas.addEventListener("mousedown", () => drawing = true);
canvas.addEventListener("mouseup", () => drawing = false);

document.getElementById("size").addEventListener("input", e => {
	currentLevel = levels[e.target.value];
	blockSize = CH / currentLevel.length;
});
document.getElementById("current").addEventListener("input", e => brush = e.target.value);

document.getElementById("create").addEventListener("click", () => {
	const codeEl = document.getElementById("code");
	codeEl.value = currentLevel.join("-");

	codeEl.select();
	document.execCommand("copy");
	alert("Code copied! Now, go to Platformer Game to test your level!")
});

setInterval(update, 1000 / 60);