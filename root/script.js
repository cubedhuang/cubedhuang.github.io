$(() => {
	$(".scroll-arrow").click(() => {
		$('html, body').animate({
			scrollTop: $(".section-games").first().offset().top
		}, 1000);
	});
});

(() => {
	const canvas = document.getElementById("hero-canvas");
	canvas.width = document.body.clientWidth;
	canvas.height = window.innerHeight;
	const ctx = canvas.getContext("2d");
	const particles = [];

	const mouse = {
		ex: canvas.width / 2,
		ey: canvas.height / 2,
		x: canvas.width / 2,
		y: canvas.height / 2,
		in: false,
		inTime: 0,
		down: false,
		downTime: 0,
	}

	window.onresize = e => {
		canvas.width = document.body.clientWidth;
		canvas.height = window.innerHeight;
	};

	window.onmousemove = e => {
		mouse.ex = e.x;
		mouse.ey = e.y;
		mouse.inTime = Date.now();
		if (!mouse.in) {
			mouse.in = true;
		}
	};

	window.onmouseout = e => {
		mouse.in = false;
	};

	window.onmousedown = window.ontouchstart = e => {
		mouse.down = true;
		mouse.in = true;
		mouse.ex = e.x || e.touches[0].x;
		mouse.ey = e.y || e.touches[0].x;
	}
	document.querySelectorAll("header, .section-banner").forEach(
		e => e.addEventListener("mousedown", e => e.preventDefault()));
	window.onmouseup = window.ontouchend = e => {
		mouse.down = false;
		mouse.downTime = Date.now();
	}

	const range = (a, b) => Math.random() * (b - a) + a;
	const rint = (a, b) => Math.floor(Math.random() * (b - a + 1) + a);

	let hoverDiv = 8;
	let distMult = 0;

	class Particle {
		static colors = [
			"#0984e360",
			"#6c5ce760",
		];

		constructor() {
			this.x = range(0, canvas.width);
			this.y = range(0, canvas.height);
			
			let r = range(0, Math.PI * 2);
			this.vx = Math.cos(r) / range(2, 4);
			this.vy = Math.sin(r) / range(2, 4);

			this.size = range(2, 4);
			this.gsize = this.size; // goal size
			this.asize = this.size; // actual size

			this.color = Particle.colors[rint(0, Particle.colors.length - 1)];

			this.num = rint(4, 7);
			this.vr = range(-0.05, 0.05);
			this.rotation = range(0, Math.PI * 2);

			this.points = [];
			for (let i = 0; i < this.num; i++) {
				const r = Math.PI * (i / this.num * 2) + this.rotation;
				this.points.push([Math.cos(r), Math.sin(r)]);
			}
		}

		dist() {
			if (!mouse.in) return 10000;
			const dx = this.x - mouse.x;
			const dy = this.y - mouse.y;
			return Math.hypot(dx, dy);
		}

		draw() {
			this.points = [];
			this.rotation += this.vr;
			for (let i = 0; i < this.num; i++) {
				const r = Math.PI * (i / this.num * 2) + this.rotation;
				this.points.push([Math.cos(r), Math.sin(r)]);
			}

			const alpha = (this.asize - this.size) / this.size / hoverDiv;
			if (alpha >= 0.01) {
				ctx.beginPath();
				ctx.moveTo(mouse.x, mouse.y);
				ctx.lineTo(this.x, this.y);
				ctx.strokeStyle = `rgba(255, 255, 255, ${ alpha })`;
				ctx.stroke();
			}

			ctx.beginPath();
			for (const m of this.points) {
				ctx.lineTo(this.x + this.asize * m[0], this.y + this.asize * m[1]);
			}
			ctx.closePath();
			ctx.fillStyle = this.color;
			ctx.fill();
		}

		update() {
			this.x += this.vx;
			this.y += this.vy;

			const s2 = this.size * 2;
			let edge = false;
			if (this.x > canvas.width + s2) {
				this.x = -s2;
				edge = true;
			} else if (this.x < -s2) {
				this.x = canvas.width + s2;
				edge = true;
			}
			if (this.y > canvas.height + s2) {
				this.y = -s2;
				edge = true;
			} else if (this.y < -s2) {
				this.y = canvas.height + s2;
				edge = true;
			}
			if (edge) {
				this.asize = this.size;
			}

			// goal size
			const gsize = Math.max(Math.min((distMult * this.size) / this.dist(), this.size * 2), this.size);
			this.asize += (gsize - this.asize) / 4;
		}
	}

	function init() {
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		for (let i = 0; i < 200; i++) {
			particles.push(new Particle());
		}
	}

	function loop() {
		ctx.clearRect(0, 0, canvas.width, canvas.height);

		mouse.x += (mouse.ex - mouse.x) / 4;
		mouse.y += (mouse.ey - mouse.y) / 4;

		const now = Date.now();
		const delay = 1000;
		if (!mouse.down && now - mouse.inTime > delay && now - mouse.downTime > delay) {
			mouse.in = false;
		}

		hoverDiv += ((mouse.down ? 3 : 8) - hoverDiv) / 4;
		distMult = Math.min(window.innerWidth, window.innerHeight) / 5;

		for (const particle of particles) {
			particle.update();
			particle.draw();
		}
		
		requestAnimationFrame(loop);
	}

	init();
	loop();
})();