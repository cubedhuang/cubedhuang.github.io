/*****************************************************************************
 * This project uses the recursive backtracking algorithm to generate mazes
 * It uses a stack to avoid recursive callback errors
 * https://en.wikipedia.org/wiki/Maze_generation_algorithm#Recursive_backtracker
 *
 * 1. Choose the initial cell and mark it as visited
 * 2. While there are unvisited cells
 *    1. If the current cell has any neighbours which have not been visited
 *       1. Choose one of the unvisited neighbours as the next cell
 *       2. Push the current cell to the stack
 *       3. Remove the wall between the current cell and the next cell
 *       4. Mark the next cell as the current cell and mark it as visited
 *    2. Else, if the stack is not empty
 *       1. Pop a cell from the stack
 *       2. Make it the current cell
 */

let cols, rows;
let w = 20;

let grid = [];
let stack = [];

let current;

function setup() {
	createCanvas(800, 600).parent(select("#game"));

	cols = floor(width / w);
	rows = floor(height / w);

	for (let j = 0; j < rows; j++) {
		for (let i = 0; i < cols; i++) {
			let cell = new Cell(i, j);
			grid.push(cell);
		}
	}

	// STEP 1
	current = grid[0];
	current.visited = true;
}

function draw() {
	background(255);

	frameRate(200);

	for (let i = 0; i < grid.length; i++) {
		grid[i].show();
	}
	current.highlight();

	// STEP 2

	// STEP 2.1.1
	let next = current.getNeighbor();

	// STEP 2.1
	if (next) {
		// STEP 2.1.2
		stack.push(current);

		// STEP 2.1.3
		removeWalls(current, next);

		// STEP 2.1.4
		current = next;
		current.visited = true;
	} else {
		// STEP 2.2
		back = stack.pop();
		if (back) current = back;
		else {
			background(255);
			for (let i = 0; i < grid.length; i++) {
				grid[i].show();
			}
			stop();
		}
	}
}

function index(i, j) {
	if (i < 0 || j < 0 || i > cols - 1 || j > rows - 1) {
		return -1;
	}
	return i + j * cols;
}

function removeWalls(a, b) {
	let x = a.i - b.i;
	switch (x) {
		case 1:
			a.walls[3] = false;
			b.walls[1] = false;
			break;
		case -1:
			a.walls[1] = false;
			b.walls[3] = false;
	}

	let y = a.j - b.j;
	switch (y) {
		case 1:
			a.walls[0] = false;
			b.walls[2] = false;
			break;
		case -1:
			a.walls[2] = false;
			b.walls[0] = false;
	}
}

class Cell {
	constructor(i, j) {
		this.i = i;
		this.j = j;
		//            top  right bottom left
		this.walls = [true, true, true, true];
		this.visited = false;
	}

	show() {
		let x = this.i * w;
		let y = this.j * w;

		noStroke();

		let render = false;

		if (!this.visited) {
			fill(0, 100);
			render = true;
		} else if (stack.includes(this)) {
			fill(0, 255, 255, 100);
			render = true;
		}

		if (this.i === 0 && this.j === 0) {
			fill(255, 255, 0);
			render = true;
		}
		if (this.i === cols - 1 && this.j === rows - 1) {
			fill(0, 255, 0);
			render = true;
		}

		if (render) rect(x, y, w, w);

		stroke(0);
		if (this.walls[0]) line(x, y, x + w, y);
		if (this.walls[1]) line(x + w, y, x + w, y + w);
		if (this.walls[2]) line(x + w, y + w, x, y + w);
		if (this.walls[3]) line(x, y + w, x, y);
	}

	highlight() {
		let x = this.i * w;
		let y = this.j * w;
		noStroke();
		fill(0, 255, 0);
		rect(x, y, w, w);
	}

	getNeighbor() {
		const i = this.i;
		const j = this.j;
		let neighbors = [];
		let possible = [
			grid[index(i, j - 1)], // top
			grid[index(i + 1, j)], // right
			grid[index(i, j + 1)], // bottom
			grid[index(i - 1, j)] // left
		];
		for (let cell of possible) {
			if (cell && !cell.visited) {
				neighbors.push(cell);
			}
		}
		if (neighbors.length > 0) {
			let neighbor = neighbors[floor(random(0, neighbors.length))];
			return neighbor;
		}
		return undefined;
	}
}
