let totalPopulation;
let target;

let mutationRate;

let population;
let matingPool;

let highest;
let generation = 0;
let fitSum = 0;

// Step 1: Initialize Population
function startPop() {
	population = [];
	for (let i = 0; i < totalPopulation; i++) {
		population[i] = new DNA(target);
	}
}

function randInt(a) {
	return Math.floor(Math.random() * a);
}

function next() {
	display();

	if (fitSum / totalPopulation === 1) return;

	// Step 2: Selection
	// Step 2a: Calculate fitness.

	fitSum = 0;
	highest = new DNA(target);
	for (let i = 0; i < population.length; i++) {
		population[i].calcFitness();
		fitSum += population[i].fitness;
		if (population[i].fitness > highest.fitness) {
			highest = population[i];
		}
	}
	if (highest.fitness >= 1) {
		display();
		return;
	}
	// Step 2b: Build mating pool.
	let matingPool = [];

	for (let i = 0; i < population.length; i++) {
		// Add each member n times according to its fitness score.
		let n = Math.floor(population[i].fitness * target.length * 2);
		for (let j = 0; j < n; j++) {
			matingPool.push(population[i]);
		}
	}
	
	if (matingPool.length == 0) {
		startPop();
	}

	// Step 3: Reproduction
	else {
		for (let i = 0; i < population.length; i++) {
			let a = randInt(matingPool.length);
			let b = randInt(matingPool.length);
			let partnerA = matingPool[a];
			let partnerB = matingPool[b];
			// Crossover
			let child;
			if (partnerA.fitness === highest.fitness && partnerB.fitness === highest.fitness) child = partnerA.crossover(partnerB);
			if (partnerA.fitness === highest.fitness) child = partnerA.crossover(partnerA);
			if (partnerB.fitness === highest.fitness) child = partnerB.crossover(partnerB);
			else child = partnerA.crossover(partnerB);
			// Mutation
			if (!(partnerA.fitness === highest.fitness || partnerB.fitness === highest.fitness)) child.mutate(mutationRate);
			else if(Math.random() < mutationRate) child.mutate(mutationRate);

			// Overwriting population members with new generation
			population[i] = child;
		}
	}
	generation++;
	
	requestAnimationFrame(next);
}

const highestDisplay = document.getElementById("highest");
const averageDisplay = document.getElementById("avg");
const genDisplay = document.getElementById("generation");
const popDisplay = document.getElementById("population");
const highFitDisplay = document.getElementById("highest-fit");

function display() {
	highestDisplay.textContent = highest.getPhrase();
	highFitDisplay.textContent = (highest.fitness).toFixed(3);
	averageDisplay.textContent = (fitSum / totalPopulation).toFixed(3);

	genDisplay.textContent = generation;

	let html = "";
	for (let i = 0; i < population.length && i < 50; i++) {
		html += `${population[i].getPhrase()}<br>`;
	}
	if (totalPopulation > 50) html += ".<br>.<br>.<br><br>";
	popDisplay.innerHTML = html;
}

function begin() {
	generation = 0;
	try {
		target = document.getElementById("target").value;
		totalPopulation = parseInt(document.getElementById("popsize").value);
	} catch (err) {
		alert(err);
		throw err;
	}
	mutationRate = (1/Math.E) / (target.length);
	document.getElementById("mutation").innerHTML = mutationRate.toFixed(8);
	startPop();
	highest = new DNA(target);
	requestAnimationFrame(next);
}
// setTimeout(() => {
// }, 0)