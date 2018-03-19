const thing = new Vue({
	el: "#thing",

	created() {
		setInterval(() => this.get(this.machines * Math.pow(3, this.ml)), 1000);
		setInterval(this.saveGame, 30000);
	},
	
	data: {
		total: 0,
		parts: 0,
		boxes: 1,
		machines: 0,
		bc: 10,
		bl: 0,
		blc: 1000,
		mc: 1000,
		ml: 0,
		mlc: 1000000,
		boost: 1
	},

	computed: {
		boostGain() {
			return Math.max(Math.floor(Math.pow(this.total / 10, 1 / 3)) - this.boost + 1, 0);
		}
	},

	methods: {
		get(amount) {
			this.total += Math.round(Math.pow(1.5, this.bl) * this.boxes * this.boost * amount);
			this.parts += Math.round(Math.pow(1.5, this.bl) * this.boxes * this.boost * amount);
		},

		buildBox() {
			if (this.parts >= this.bc) {
				this.parts -= this.bc;
				this.boxes++;
				this.bc = Math.round(this.bc * 1.1);
			}
		},

		upgradeBox() {
			if (this.parts >= this.blc) {
				this.parts -= this.blc;
				this.bl++;
				this.blc = Math.round(this.blc * 2);
			}
		},

		buildMachine() {
			if (this.parts >= this.mc) {
				this.parts -= this.mc;
				this.machines++;
				this.mc = Math.round(this.mc * 1.2);
			}
		},

		upgradeMachine() {
			if (this.parts >= this.mlc) {
				this.parts -= this.mlc;
				this.ml++;
				this.mlc = Math.round(this.mlc * 5);
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
			localStorage.setItem("save", JSON.stringify(this.$data));
		},

		loadGame() {
			var save = JSON.parse(localStorage.getItem("save"));
			if (!save) return;
			this.total = save.total;
			this.parts = save.parts;
			this.boxes = save.boxes;
			this.machines = save.machines;
			this.bc = save.bc;
			this.bl = save.bl;
			this.blc = save.blc;
			this.mc = save.mc;
			this.ml = save.ml;
			this.mlc = save.mlc;
			this.boost = save.boost;
		},

		reset() {
			if (confirm("This will COMPLETELY WIPE YOUR SAVE! Are you sure you want to continue?")) {
				localStorage.removeItem("save");
				location.reload(true);
			}
		}
	}
});

window.onbeforeunload = thing.saveGame;
window.onload = thing.loadGame;