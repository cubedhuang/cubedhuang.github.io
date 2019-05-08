numberformat.default.opts = {
	backend: "decimal.js",
	Decimal: Decimal
}

const thing = new Vue({
	el: "#thing",

	created() {
		this.loadGame();
		setInterval(() => this.collect(this.machines.mul(Decimal.pow(2, this.ml))), 1000);
		setInterval(this.saveGame, 30000);
	},
	
	data: {
		total: new Decimal("0"),
		parts: new Decimal("0"),
		boxes: new Decimal("1"),
		machines: new Decimal("0"),
		bc: new Decimal("10"),
		bl: new Decimal("0"),
		blc: new Decimal("1000"),
		mc: new Decimal("1000"),
		ml: new Decimal("0"),
		mlc: new Decimal("1000000"),
		boost: new Decimal("1"),
		version: "1.3.5"
	},

	computed: {
		boostGain() {
			return Decimal.max(Decimal.floor(Decimal.pow(this.total.div("10"), 1/3)).minus(this.boost).plus("1"), 0);
		}
	},

	methods: {
		collect(amount) {
			let add = Decimal.round(Decimal.pow(1.2, this.bl).mul(this.boxes).mul(this.boost).mul(amount));
			this.total = this.total.plus(add);
			this.parts = this.parts.plus(add);
		},

		buildBox() {
			if (this.parts.gte(this.bc)) {
				this.parts = this.parts.minus(this.bc);
				this.boxes = this.boxes.plus("1");
				this.bc = Decimal.round(this.bc.mul("1.1"));
			}
		},

		upgradeBox() {
			if (this.parts.gte(this.blc)) {
				this.parts = this.parts.minus(this.blc);
				this.bl = this.bl.plus("1");
				this.blc = Decimal.round(this.blc.mul("2"));
			}
		},

		buildMachine() {
			if (this.parts.gte(this.mc)) {
				this.parts = this.parts.minus(this.mc);
				this.machines = this.machines.plus("1");
				this.mc = Decimal.round(this.mc.mul("1.2"));
			}
		},

		upgradeMachine() {
			if (this.parts.gte(this.mlc)) {
				this.parts = this.parts.minus(this.mlc);
				this.ml = this.ml.plus("1");
				this.mlc = Decimal.round(this.mlc.mul("5"));
			}
		},

		study() {
			if (!confirm("Are you ABSOLUTELY sure you want to restart?")) return;
			this.boost += this.boostGain;
			this.boxes = 1;
			this.machines = 0;
			this.parts = 0;
			this.bc = 10;
			this.bl = 0;
			this.blc = 1000;
			this.mc = 1000;
			this.ml = 0;
			this.mlc = 1000000;
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
			if (save === null) return;
			else if (save.version != this.version) this.reset(true);
			var data = save.data;

			this.total = new Decimal(data.total);
			this.parts = new Decimal(data.parts);
			this.boxes = new Decimal(data.boxes);
			this.machines = new Decimal(data.machines);
			this.bc = new Decimal(data.bc);
			this.bl = new Decimal(data.bl);
			this.blc = new Decimal(data.blc);
			this.mc = new Decimal(data.mc);
			this.ml = new Decimal(data.ml);
			this.mlc = new Decimal(data.mlc);
			this.boost = new Decimal(data.boost);
		},

		reset(force) {
			if (force) {
				window.onbeforeunload = () => localStorage.removeItem("save");
				location.reload(true);
				return;
			}
			if (confirm("This will COMPLETELY WIPE YOUR SAVE! Are you sure you want to continue?")) {
				window.onbeforeunload = () => localStorage.removeItem("save");
				location.reload(true);
			}
		}
	}
});

window.onbeforeunload = thing.saveGame;