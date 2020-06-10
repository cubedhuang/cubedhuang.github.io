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
		setInterval(() => this.collect(this.machines.mul(Decimal.mul(machineMult, Decimal.pow("1.05", this.uu)))), 1000);
		setInterval(this.saveGame, 10000);
		setTimeout(() => {
			this.allowWatch = true;
		}, 0);
	},
	
	data: {
		total: new Decimal("0"),
		curTotal: new Decimal("0"),
		parts: new Decimal("0"),

		boxes: new Decimal("1"),
		bc: new Decimal("10"), // box cost
		bl: new Decimal("0"), // box level
		blc: new Decimal("1000"), // box level cost

		machines: new Decimal("0"),
		mc: new Decimal("1000"), // machine cost
		ml: new Decimal("0"), // machine level
		mlc: new Decimal("1000000"), // machine level cost
		
		degree: new Decimal("0"),
		tp: new Decimal("0"), // transcendence points

		mm: new Decimal("0"), // mortal mediation
		mmc: new Decimal("1"),
		cc: new Decimal("0"), // calculated creation
		ccc: new Decimal("1"),
		uu: new Decimal("0"), // ultimate upgrades
		uuc: new Decimal("1"),
		
		prestigeConfirm: false,
		prestigeMode: false,
		
		version: "2.0.0",
		allowWatch: false,
	},

	watch: {
		parts(val, prev) {
			let change = val.sub(prev);
			if (change.gt("0") && this.allowWatch) {
				this.total = this.total.add(change);
				this.curTotal = this.curTotal.add(change);
			}
		},
		degree(val, prev) {
			let change = val.sub(prev);
			if (this.allowWatch) this.tp = this.tp.add(change);
		}
	},

	computed: {
		degreeGain() {
			return Decimal.max(Decimal.floor(Decimal.pow(this.total.div("10"), 1 / 3)).minus(this.degree), 0);
		},
		degreeMult() {
			return Decimal.add("1", this.degree.div("20"));
		}
	},

	methods: {
		collect(amount, click) {
			let boxMult = "1.1";
			let add = Decimal.round(
				Decimal.pow(Decimal.mul(boxMult, Decimal.pow("1.05", this.uu)), this.bl)
				.mul(this.boxes)
				.mul(this.degreeMult)
				.mul(amount)
				.mul(click ? Decimal.pow(2, this.mm) : "1"));
			this.parts = this.parts.plus(add);
		},

		getBuyingData(parts, amount, cost, multiplier, max) {
			if (max) {
				while (parts.gte(cost)) {
					parts = parts.minus(cost);
					amount = amount.plus("1");
					cost = Decimal.floor(cost.mul(multiplier));
				}
			} else {
				if (parts.gte(cost)) {
					parts = parts.minus(cost);
					amount = amount.plus("1");
					cost = Decimal.floor(cost.mul(multiplier));
				}
			}
			return { parts, amount, cost }
		},

		calcCC(val) {
			return Decimal.sub(val, "1").mul(Decimal.pow("0.95", this.cc)).plus("1");
		},

		buildBox(max) {
			let calc = this.getBuyingData(this.parts, this.boxes, this.bc, this.calcCC("1.1"), max);
			this.parts = calc.parts;
			this.boxes = calc.amount;
			this.bc = calc.cost;
		},

		upgradeBox(max) {
			let calc = this.getBuyingData(this.parts, this.bl, this.blc, this.calcCC("2"), max);
			this.parts = calc.parts;
			this.bl = calc.amount;
			this.blc = calc.cost;
		},

		buildMachine(max) {
			let calc = this.getBuyingData(this.parts, this.machines, this.mc, this.calcCC("1.5"), max);
			this.parts = calc.parts;
			this.machines = calc.amount;
			this.mc = calc.cost;
		},

		upgradeMachine(max) {
			let calc = this.getBuyingData(this.parts, this.ml, this.mlc, this.calcCC("5"), max);
			this.parts = calc.parts;
			this.ml = calc.amount;
			this.mlc = calc.cost;
		},

		buyMM() {
			let calc = this.getBuyingData(this.tp, this.mm, this.mmc, "5", false);
			this.tp = calc.parts;
			this.mm = calc.amount;
			this.mmc = calc.cost;
		},

		buyCC() {
			let calc = this.getBuyingData(this.tp, this.cc, this.ccc, "5", false);
			this.tp = calc.parts;
			this.cc = calc.amount;
			this.ccc = calc.cost;
		},

		buyUU() {
			let calc = this.getBuyingData(this.tp, this.uu, this.uuc, "5", false);
			this.tp = calc.parts;
			this.uu = calc.amount;
			this.uuc = calc.cost;
		},

		prestige() {
			this.curTotal = new Decimal("0");
			this.boxes = new Decimal("1");
			this.machines = new Decimal("0");
			this.parts = new Decimal("0");
			this.bc = new Decimal("10");
			this.bl = new Decimal("0");
			this.blc = new Decimal("1000");
			this.mc = new Decimal("1000");
			this.ml = new Decimal("0");
			this.mlc = new Decimal("1000000");

			this.prestigeMode = true;
			this.prestigeConfirm = false;
			this.degree = this.degree.plus(this.degreeGain);
		},

		saveGame() {
			localStorage.setItem("save", JSON.stringify(
				{
					data: this.$data,
					time: Math.floor(Date.now() / 1000)
				}
			));
		},

		loadGame() {
			var save = JSON.parse(localStorage.getItem("save"));
			if (save === null || save.data.version !== this.version) return;
			else if (save.data.version != this.version) {
				window.onbeforeunload = () => localStorage.removeItem("save");
				location.reload(true);
			}

			let raw = ["version", "prestigeConfirm", "prestigeMode"];
			for(let i in save.data) {
				if (save.data.hasOwnProperty(i)) {
					if (i === "allowWatch") this.$data[i] = false;
					else if (raw.includes(i)) this.$data[i] = save.data[i];
					else this.$data[i] = new Decimal(save.data[i])
				}
			}

			let elapsed = Math.floor(Date.now() / 1000) - save.time;
			this.collect(this.machines.mul(Decimal.mul("1.2", Decimal.pow("1.05", this.uu).mul(elapsed))));
		},

		reset() {
			if (
				confirm("This will COMPLETELY WIPE YOUR SAVE! Are you sure you want to continue?") &&
				confirm("This is you last chance to turn back before you lost your progress forever!")
			) {
				window.onbeforeunload = () => localStorage.removeItem("save");
				location.reload(true);
			}
		}
	}
});

window.onbeforeunload = thing.saveGame;