numberformat.default.opts = {
	sigfigs: 5,
	backend: "decimal.js",
	Decimal: Decimal
};

const format = numberformat.format;

new Vue({
	el: "#app",

	data: {
		eff: new Decimal(0),
		chance: new Decimal(0.5),
		gain: new Decimal(1),

		evolve: new Decimal(1000),
		stage: 0,

		upgrades: [
			{
				name: "Faster Mating",
				level: new Decimal(1),
				effect: "Increases Chance",
				cost: new Decimal(3),
				prgm: "chance",
			}
		]
	},

	watch: {
		eff(val) {
			if (val.gte(this.evolve)) {
				this.evolve = this.evolve.times(1000);
				this.stage++;
			}
		}
	},

	computed: {
		stageName() {
			return ["Bacteria", "Algae"][this.stage];
		}
	},

	methods: {
		mutate() {
			if (this.chance.gte(Math.random())) this.eff = this.eff.plus(this.gain);
		},

		getUpgrade(id) {
			if (this.eff >= this.upgrades[id].cost) {
				const upgrade = this.upgrades[id];

				this.eff = this.eff.minus(upgrade.cost);
				upgrade.cost = upgrade.cost.times(2);
				upgrade.level = upgrade.level.plus(1);

				//const prgm = upgrade.prgm.split(" ");
				this.chance = this.chance.plus((1 - this.chance) / 100);
			}
		}
	}
});