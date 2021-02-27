class Boid {
	constructor () {
		this.pos = createVector(random(width), random(height));
		this.vel = p5.Vector.random2D();
		this.vel.setMag(random(0.5, 1))
		this.acc = createVector();
	}

	flock(boids) {
		let total = 0;
		let alignment = createVector();
		let cohesion = createVector();
		let separation = createVector();

		for (const boid of boids) {
			if (boid === this) continue;

			let d = this.pos.dist(boid.pos);
			
			if (d <= visionS.value()) {
				alignment.add(boid.vel);
				cohesion.add(boid.pos);

				let diff = p5.Vector.sub(this.pos, boid.pos);
				diff.div(d * d);
				separation.add(diff);
				
				total++;
			}
		}
		if (total > 0) {
			alignment.div(total);
			alignment.setMag(maxSpeedS.value());
			alignment.sub(this.vel);
			alignment.limit(maxForceS.value());

			cohesion.div(total);
			cohesion.sub(this.pos);
			cohesion.setMag(maxSpeedS.value());
			cohesion.sub(this.vel);
			cohesion.limit(maxForceS.value());

			separation.div(total);
			separation.setMag(maxSpeedS.value());
			separation.sub(this.vel);
			separation.limit(maxForceS.value());
		}

		alignment.mult(alignS.value());
		cohesion.mult(cohesionS.value());
		separation.mult(separationS.value());

		if (mouseIsPressed && mouseX >= 0 && mouseX <= width && mouseY >= 0 && mouseY <= height) {
			let mouseVector = createVector(mouseX, mouseY);
			mouseVector.sub(this.pos);
			
			if (mouseButton === LEFT) {
				mouseVector.div(mouseVector.dist(this.pos));
				this.acc.add(mouseVector);
			} else if (mouseButton === RIGHT) {
				mouseVector.normalize();
				mouseVector.mult(mouseVector.dist(this.pos));
				mouseVector.div(1000);
				this.acc.sub(mouseVector);
			}
		}

		this.acc.add(alignment);
		this.acc.add(cohesion);
		this.acc.add(separation);
	}

	showData() {
		if (vision1C.checked() || vision2C.checked()) {
			if (vision1C.checked()) fill(255, 4);
			else noFill();

			if (vision2C.checked()) {
				strokeWeight(0.5);
				stroke(255, 80);
			}
			else noStroke();
			
			let dia = visionS.value() * 2;
			ellipse(this.pos.x, this.pos.y, dia, dia);
		}
		
		if (directionC.checked()) {
			strokeWeight(0.5);
			stroke(255, 80);
			let end = p5.Vector.add(this.pos, p5.Vector.mult(this.vel, 5));
			line(this.pos.x, this.pos.y, end.x, end.y);
		}
	}

	showSelf() {
		strokeWeight(6);
		if (hueC.checked()) stroke(map(this.vel.mag(), maxSpeedS.value() / 10, maxSpeedS.value(), 0, 127, true), 255, 255);
		else stroke(255);
		point(this.pos.x, this.pos.y)
	}

	update() {
		this.vel.add(this.acc);
		this.vel.limit(maxSpeedS.value());
		this.pos.add(this.vel);
		this.acc.mult(0);

		if (bounceC.checked()) {
			let ran = false;
			if (this.pos.x < 0 || this.pos.x > width) {
				ran = true;
				this.vel.x = -this.vel.x;
			}
			if (this.pos.y < 0 || this.pos.y > height) {
				ran = true;
				this.vel.y = -this.vel.y;
			}
			if (ran) {
				let center = createVector(width / 2, height / 2);
				center.sub(this.pos);
				center.div(center.dist(this.pos));
				this.acc.add(center);
				this.pos.x = constrain(this.pos.x, 0, width);
				this.pos.y = constrain(this.pos.y, 0, height);
			}
		} else {
			if (this.pos.x < 0) this.pos.x = width;
			if (this.pos.x > width) this.pos.x = 0;
			if (this.pos.y < 0) this.pos.y = height;
			if (this.pos.y > height) this.pos.y = 0;
		}
	}
}