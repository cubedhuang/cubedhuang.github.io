numberformat.default.opts = {
	backend: "decimal.js",
	Decimal: Decimal,
	sigfigs: 5
}

const thing = new Vue({
	el: "#thing",

	created() {
		this.loadGame();
		let machineMult = 1.2;
		setInterval(() => this.collect(this.machines.mul(Decimal.pow(machineMult, this.ml))), 1000);
		setInterval(this.saveGame, 10000);
	},
	
	data: {
		total: new Decimal("0"),
		curTotal: new Decimal("0"),
		parts: new Decimal("0"),
		boxes: new Decimal("1"),
		machines: new Decimal("0"),
		bc: new Decimal("10"), // box cost
		bl: new Decimal("0"), // box level
		blc: new Decimal("1000"), // box level cost
		mc: new Decimal("1000"), // machine cost
		ml: new Decimal("0"), // machine level
		mlc: new Decimal("1000000"), // machine level cost
		boost: new Decimal("1"),
		version: "1.4"
	},

	watch: {
		parts(val, prev) {
			let change = val.sub(prev);
			if (change.gt("0")) {
				this.total = this.total.add(change);
				this.curTotal = this.curTotal.add(change);
			}
		}
	},

	computed: {
		boostGain() {
			return Decimal.max(Decimal.floor(Decimal.pow(this.total.div("10"), 1/3)).minus(this.boost).plus("1"), 0);
		}
	},

	methods: {
		collect(amount) {
			let boxMult = 1.1;
			let add = Decimal.round(Decimal.pow(boxMult, this.bl).mul(this.boxes).mul(this.boost).mul(amount));
			this.parts = this.parts.plus(add);
		},

		getBuyingData(parts, amount, cost, multiplier, max) {
			if (max) {
				while (parts.gte(cost)) {
					parts = parts.minus(cost);
					amount = amount.plus("1");
					cost = Decimal.round(cost.mul(multiplier));
				}
			} else {
				if (parts.gte(cost)) {
					parts = parts.minus(cost);
					amount = amount.plus("1");
					cost = Decimal.round(cost.mul(multiplier));
				}
			}
			return { parts, amount, cost }
		},

		buildBox(max) {
			let calc = this.getBuyingData(this.parts, this.boxes, this.bc, "1.1", max);
			this.parts = calc.parts;
			this.boxes = calc.amount;
			this.bc = calc.cost;
		},

		upgradeBox(max) {
			let calc = this.getBuyingData(this.parts, this.bl, this.blc, "2", max);
			this.parts = calc.parts;
			this.bl = calc.amount;
			this.blc = calc.cost;
		},

		buildMachine(max) {
			let calc = this.getBuyingData(this.parts, this.machines, this.mc, "1.5", max);
			this.parts = calc.parts;
			this.machines = calc.amount;
			this.mc = calc.cost;
		},

		upgradeMachine(max) {
			let calc = this.getBuyingData(this.parts, this.ml, this.mlc, "5", max);
			this.parts = calc.parts;
			this.ml = calc.amount;
			this.mlc = calc.cost;
		},

		prestige() {
			if (!confirm("Are you ABSOLUTELY sure you want to restart?")) return;
			this.curTotal = new Decimal("0");
			this.boost = this.boost.plus(this.boostGain);
			this.boxes = new Decimal("1");
			this.machines = new Decimal("0");
			this.parts = new Decimal("0");
			this.bc = new Decimal("10");
			this.bl = new Decimal("0");
			this.blc = new Decimal("1000");
			this.mc = new Decimal("1000");
			this.ml = new Decimal("0");
			this.mlc = new Decimal("1000000");
		},

		saveGame() {
			localStorage.setItem("save", JSON.stringify(
				{
					data: this.$data,
					version: this.version
				}
			));
		},

		loadGame() {
			var save = JSON.parse(localStorage.getItem("save"));
			if (save === null || save.version !== this.version) return;
			else if (save.version != this.version) {
				window.onbeforeunload = () => localStorage.removeItem("save");
				location.reload(true);
			};
			var s = save.data;

			this.total = new Decimal(s.total);
			this.curTotal = new Decimal(s.curTotal);
			this.parts = new Decimal(s.parts);
			this.boxes = new Decimal(s.boxes);
			this.machines = new Decimal(s.machines);
			this.bc = new Decimal(s.bc);
			this.bl = new Decimal(s.bl);
			this.blc = new Decimal(s.blc);
			this.mc = new Decimal(s.mc);
			this.ml = new Decimal(s.ml);
			this.mlc = new Decimal(s.mlc);
			this.boost = new Decimal(s.boost);
		},

		reset() {
			if (
				confirm("This will COMPLETELY WIPE YOUR SAVE! Are you sure you want to continue?") &&
				confirm("Are you seriously actually sure you want to do this?") &&
				confirm("This is you last chance to turn back before you lost your progress forever!") &&
				confirm("Fine then, just click this button.")
			) {
				window.onbeforeunload = () => localStorage.removeItem("save");
				location.reload(true);
			}
		}
	}
});

window.onbeforeunload = thing.saveGame;