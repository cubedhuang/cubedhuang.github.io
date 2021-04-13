(() => {
	// declarations ----------------------------------------------------------------

	const width = 800;
	const height = 600;

	const canvas = document.getElementById("gameCanvas");
	const ctx = canvas.getContext("2d");

	const PD = {
		W: 10,
		H: 100
	};

	const P = [
		{
			y: 250,
			score: 0
		},
		{
			y: 250,
			vy: 0,
			score: 0
		}
	]

	const B = {
		x: 400,
		y: 300,
		vx: 10,
		vy: Math.random() * 5 - 2.5
	};

	let menu = true;

	let currentTime = 0;
	let survival = false;
	let survivalStart = 0;
	let survivalTime = 0;

	// events ----------------------------------------------------------------

	window.addEventListener("mousemove", e => {
		const rect = canvas.getBoundingClientRect();
		const root = document.documentElement;
		const y = e.clientY - rect.top - root.scrollTop;

		P[0].y = y - PD.H / 2;
	});

	canvas.addEventListener("mousedown", e => {
		if (!menu) return;

		P[0].score = 0;
		P[1].score = 0;

		// left = 0
		survival = !!e.button;
		if (survival) {
			survivalStart = currentTime;
			survivalTime = currentTime;
			B.vx = Math.abs(B.vx);
		}
		
		menu = false;
	});

	canvas.addEventListener("contextmenu", e => e.preventDefault());

	// logic ----------------------------------------------------------------

	function rect(x, y, width, height, color) { // XY = TopLeft corner
		ctx.fillStyle = color;
		ctx.fillRect(x, y, width, height);
	}

	function computerMovement() {
		let center = P[1].y + PD.H / 2;
		
		const movement = survival ? 8 : 1;

		if (center < B.y - 20) {
			P[1].vy += movement;
		} else if (center > B.y + 20) {
			P[1].vy -= movement;
		}

		P[1].y += P[1].vy;

		P[1].vy *= 0.9;
	}

	function ballMovement() {
		B.x += B.vx;
		B.y += B.vy;

		// Hit paddle
		let hitter =
			B.x >= width - 50 && B.x <= width - 20 && B.y > P[1].y - 10 && B.y < P[1].y + PD.H + 10 ? 1 :
			B.x <= 50 && B.x >= 20 && B.y > P[0].y - 10 && B.y < P[0].y + PD.H + 10 ? 0 : -1;

		if (hitter + 1) {
			B.vx = -B.vx;
			B.x = hitter ? width - 50 : 50;

			let deltaY = B.y - (P[hitter].y + PD.H / 2);
			B.vy = deltaY / 5;
		}

		// Change Y Direction
		if (B.y >= height - 10 || B.y <= 10) {
			B.vy = -B.vy;
		}
	}

	function move() {
		computerMovement();
		ballMovement();

		if (survival) {
			survivalTime = currentTime;
		}

		if (B.x - 30 >= width) { // Right side
			if (!(B.y > P[1].y && B.y < P[1].y+PD.H)) {
				P[0].score++;
				resetBall();
			}
		} else if (B.x + 30 <= 0) { // Left side
			if (!(B.y > P[0].y && B.y < P[0].y+PD.H)) {
				P[1].score++;
				resetBall();
			}
		}
	}

	function resetBall() {
		if (survival && P[1].score >= 1) {
			menu = true;
		}
		if (P[0].score >= 10 || P[1].score >= 10) {
			menu = true;
		}

		B.x = width / 2;
		B.y = height / 2;
		B.vx = -B.vx;
		B.vy = Math.random() * 5 - 2.5;
		P[1].y = 300 - PD.H / 2;
		P[1].vy = 0;
	}

	function draw() {
		rect(0, 0, width, height, "black"); // Background

		// Score
		ctx.textAlign = "center";
		ctx.fillStyle = "white";
		ctx.font = "30px bold Courier, monospace";
		if (!survival) {
			ctx.fillText(P[0].score, 30, 40);
			ctx.fillText(P[1].score, width - 30, 40);
		} else {
			ctx.fillText(Math.floor((survivalTime - survivalStart) / 1000), 30, 40);
		}

		if (menu) {
			ctx.fillStyle = "white";

			const x = width / 2;
			const y = height / 2 - 40;

			const winText = survival ? `You survived for ${ Math.floor((survivalTime - survivalStart) / 1000) } seconds!` :
				P[0].score >= 10 ? "You Won!" :
				P[1].score >= 10 ? "The Computer Won..." : "";

			ctx.fillText(winText, x, y);

			ctx.fillText("Left Click to Play Normally", x, y + 50);
			ctx.fillStyle = "red";
			ctx.fillText("Right Click to Play Survival", x, y + 100);
			return;
		}

		for (let i = 10; i < height; i += 40) {
			rect(width / 2 - 1, i, 2, 20, "grey");
		}

		// Paddles
		rect(30, P[0].y, PD.W, PD.H, "white");
		rect(width - PD.W - 30, P[1].y, PD.W, PD.H, survival ? "red" : "white");

		rect(B.x - 10, B.y - 10, 20, 20, "white");
	}

	function update(time) {
		requestAnimationFrame(update);

		currentTime = time;

		if (!menu) move();
		draw();
	}

	requestAnimationFrame(update);
})();