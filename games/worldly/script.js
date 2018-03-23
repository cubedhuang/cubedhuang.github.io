let worldly = new Vue({
	el: "#app",

	data: {
		stage: ["Townly"],

		pow: {
			a: 0,
			g: 1,
			t: 1000,
			e: true
		},

		upgrades: [
			{
				name: "More Followers",
				does: "1.5x Faster Conquering",
				cost: 5,
				bought: false,
				buy(pow) {
					if (pow.a >= this.cost) {
						this.bought = true;
						pow.a -= this.cost;
						pow.t /= 1.5;
					}
				}
			},
			{
				name: "Better Weapons",
				does: "2x More Power Per Conquer",
				cost: 10,
				bought: false,
				buy(pow) {
					if (pow.a >= this.cost) {
						this.bought = true;
						pow.a -= this.cost;
						pow.g *= 2;
					}
				}
			},
			{
				name: "Persuasive Techniques",
				does: "1.5x More Power Per Conquer",
				cost: 30,
				bought: false,
				buy(pow) {
					if (pow.a >= this.cost) {
						this.bought = true;
						pow.a -= this.cost;
						pow.g *= 1.5;
					}
				}
			},
			{
				name: "Diplomacy (Go to Expansion)",
				does: "1.33x Faster Conquering",
				cost: 300,
				bought: false,
				buy(pow) {
					if (pow.a >= this.cost) {
						this.bought = true;
						pow.a -= this.cost;
						pow.t /= 1.333333;
					}
				}
			},
			{
				name: "Unification",
				does: "2x More Power Per Conquer",
				cost: 500,
				bought: false,
				buy(pow) {
					if (pow.a >= this.cost) {
						this.bought = true;
						pow.a -= this.cost;
						pow.g *= 2;
					}
				}
			}
		],

		expansion: [
			{
				name: "Stately",
				does: "5x More Power Per Conquer",
				cost: 80,
				buy(pow, stage) {
					if (pow.a >= this.cost) {
						this.bought = true;
						pow.a -= this.cost;
						pow.g *= 5;
						stage[0] = this.name;
					}
				}
			},
			{
				name: "Nationly",
				does: "5x More Power Per Conquer",
				cost: 1000,
				buy(pow, stage) {
					if (pow.a >= this.cost) {
						this.bought = true;
						pow.a -= this.cost;
						pow.g *= 5;
						stage[0] = this.name;
					}
				}
			}
		]
	},

	methods: {
		gain() {
			if (this.pow.e) {
				this.pow.a += this.pow.g;
				setTimeout(() => this.pow.e = true, this.pow.t);
			}
			this.pow.e = false;
		}
	}
});