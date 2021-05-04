const chars = [
	"%",
	"@",
	"/",
	"'",
	"!",
	" ",
	",",
	"-",
	".",
	"0",
	"1",
	"2",
	"3",
	"4",
	"5",
	"6",
	"7",
	"8",
	"9",
	":",
	";",
	"=",
	"?",
	"A",
	"B",
	"C",
	"D",
	"E",
	"F",
	"G",
	"H",
	"I",
	"J",
	"K",
	"L",
	"M",
	"N",
	"O",
	"P",
	"Q",
	"R",
	"S",
	"T",
	"U",
	"V",
	"W",
	"X",
	"Y",
	"Z",
	"a",
	"b",
	"c",
	"d",
	"e",
	"f",
	"g",
	"h",
	"i",
	"j",
	"k",
	"l",
	"m",
	"n",
	"o",
	"p",
	"q",
	"r",
	"s",
	"t",
	"u",
	"v",
	"w",
	"x",
	"y",
	"z"
];

class DNA {
	// Create DNA randomly.
	constructor(tg) {
		this.fitness = 0;
		this.genes = [];
		this.target = tg;
		for (let i = 0; i < this.target.length; i++) {
			this.genes[i] = chars[Math.floor(Math.random() * chars.length)];
		}
	}

	// Calculate fitness.
	calcFitness() {
		let score = 0;
		for (let i = 0; i < this.genes.length; i++) {
			if (this.genes[i] == this.target[i]) {
				score++;
			}
		}
		this.fitness = score / this.target.length;
		this.fitness **= 2;
	}

	// Crossover
	crossover(partner) {
		let child = new DNA(this.target);
		let midpoint = Math.floor(Math.random() * (this.genes.length + 1));
		for (let i = 0; i < this.genes.length; i++) {
			if (i > midpoint) child.genes[i] = this.genes[i];
			else child.genes[i] = partner.genes[i];
		}
		return child;
	}

	// Mutation
	mutate(mutationRate) {
		for (let i = 0; i < this.genes.length; i++) {
			if (Math.random() < mutationRate) {
				this.genes[i] = chars[Math.floor(Math.random() * chars.length)];
			}
		}
	}

	// Convert to String—PHENOTYPE.
	getPhrase() {
		return this.genes.join("");
	}
}
