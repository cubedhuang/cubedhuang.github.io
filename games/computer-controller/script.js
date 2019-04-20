numberformat.default.opts = {
	backend: "decimal.js",
	Decimal: Decimal
}

class Struct {
	constructor(name, index, desc) {
		this.name = name;
		this.index = index;
		this.desc = desc;
		this.amount = new Decimal(0);
		this.delay = Decimal.pow(1.7, index);
		this.time = this.delay;
		this.bcost = Decimal.pow(60, index).times(8);
		this.ccost = index + 1;
		this.pcost = Decimal.pow(10, index);
	}

	buy(bits, chips, prev=false) {
		if (!prev) {
			if (bits.lte(this.cost) && chips.gte(1)) {
				this.amount = this.amount.plus(1);
				return [bits.minus(this.cost), chips.minus(1)]
			} else {
				return false;
			}
		}
	}

	cycle() {
		this.time = this.time.minus(1);
	}
}

new Vue({
	el: "#game",

	created() {

	},

	data: {
		Decimal: Decimal,
		section: 0,

		bits: new Decimal(1),
		chips: new Decimal(1),
		level: 0,
		levels: [
			"Transistor",
			"Motherboard",
			"Qubit",
			"Entanglement",
			"Wormhole",
			"Dimensional"
		],

		structs: [
			new Struct("Byte", 0, "Stings of eight bits."),
			new Struct("File", 1, "Many encoded bytes."),
			new Struct("Folder", 2, "Many structured files."),
			new Struct("Hard Disk", 3, "Data storage device,"),
			new Struct("Cloud Center", 4, "A very huge online hard disk."),
			new Struct("Supercomputer", 5, "A very powerful processor and hard disk."),
			new Struct("Quantum computer", 6, "An extremely powerful computer."),
			new Struct("orbital computer", 7, "A computer that orbits a star."),
			new Struct("Asteroid computer", 8, "A computer built through an asteroid."),
			new Struct("Planet computer", 9, "A computer built through a planet."),
			new Struct("Matrioshka Brain", 10, "A computer encapsulating a star."),
			new Struct("Dark computer", 11, "A computer harnessing dark energy."),
			new Struct("Galactic computer", 12, "A computer spanning a galaxy."),
			new Struct("Time computer", 13, "A computer that uses time travel."),
			new Struct("universal computer", 14, "A computer that utilizes a universe."),
			new Struct("Universe", 15, "A super duper powerful simulation."),
			new Struct("Multiverse", 16, "All possible worlds with our physics."),
			new Struct("Omniverse", 17, "All possible worlds with our dimensions."),
			new Struct("Everything", 18, "All possible Omniverses."),
		],
	},

	computed: {
		max() {
			return this.structs.map((s, i, a) => {
				if (i === 0) return Decimal.floor(this.bits.div(s.bcost));
				return Decimal.min(
					Decimal.floor(this.bits.div(s.bcost)),
					Decimal.floor(a[i - 1].amount.div(s.pcost),
					Decimal.floor(this.chips.div(i + 1)))
				);
			});
		},
		able() {
			return this.structs.map((s, i, a) => {
				if (i === 0) return this.bits.div(s.bcost).gte(1);
				return
					this.bits.div(s.bcost).gte(1) &&
					a[i - 1].amount.div(s.pcost).gte(1) &&
					this.chips.gte(i + 1);
			});
		}
	},

	methods: {
		format(x) {
			return numberformat.format(x);
		},
		capital(s) {
			if (!s) return;
			return s.split(" ").map(s => `${ s[0].toUpperCase() }${ s.slice(1) }`).join(" ");
		}
	}
});
