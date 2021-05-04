class Block {
	constructor(x, y, vx, vy, size, color) {
		this.x = x;
		this.y = y;
		this.vx = vx;
		this.vy = vy;
		this.size = size;
		this.dead = false;
		this.color = color || "white";
		this.isPoint = this.color !== "white";
	}

	move(canvas) {
		if (this.y + this.size / 2 + this.vy >= canvas.height) {
			this.dead = true;
		}
		this.x += this.vx;
		this.y += this.vy;
	}

	render(ctx) {
		let hs = this.size / 2;
		ctx.fillStyle = this.color;
		ctx.fillRect(this.x - hs, this.y - hs, this.size, this.size);
	}
}
