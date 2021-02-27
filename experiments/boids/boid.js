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

	show() {
		strokeWeight(6);
		if (hueC.checked()) stroke(map(this.vel.mag(), maxSpeedS.value() / 10, maxSpeedS.value(), 0, 127, true), 255, 255);
		else stroke(255);
		point(this.pos.x, this.pos.y)

		if (visionC.checked()) {
			noStroke()
			fill(255, 4);
			ellipse(this.pos.x, this.pos.y, visionS.value(), visionS.value());
		}
		
		if (directionC.checked()) {
			strokeWeight(0.5);
			stroke(255, 80);
			let end = p5.Vector.add(this.pos, p5.Vector.mult(this.vel, 5));
			line(this.pos.x, this.pos.y, end.x, end.y);
		}
	}

	update() {
		this.vel.add(this.acc);
		this.vel.limit(maxSpeedS.value());
		this.pos.add(this.vel);
		this.acc.mult(0);

		if (this.pos.x < 0) this.pos.x = width;
		if (this.pos.x > width) this.pos.x = 0;
		if (this.pos.y < 0) this.pos.y = height;
		if (this.pos.y > height) this.pos.y = 0;
	}
}