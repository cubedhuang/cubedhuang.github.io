const thing = new Vue({
	el: "#thing",

	created() {
		setInterval(() => this.get(this.machines), 1000);
	},
	
	data: {
		total: 0,
		parts: 0,
		boxes: 1,
		machines: 0,
		bc: 10,
		mc: 1000,
		boost: 1
	},

	computed: {
		boostGain() {
			return Math.max(Math.floor(Math.pow(this.total / 10, 1 / 3)) - this.boost + 1, 0);
		}
	},

	methods: {
		get(amount) {
			this.total += Math.round(this.boxes * this.boost * amount);
			this.parts += Math.round(this.boxes * this.boost * amount);
		},

		buildBox() {
			if (this.parts >= this.bc) {
				this.parts -= this.bc;
				this.boxes++;
				this.bc = Math.round(this.bc * 1.1);
			}
		},

		buildMachine() {
			if (this.parts >= this.mc) {
				this.parts -= this.mc;
				this.machines++;
				this.mc = Math.round(this.mc * 1.2);
			}
		},

		study() {
			if (!confirm("Are you ABSOLUTELY sure you want to restart?")) return;
			this.boost += this.boostGain;
			this.boxes = 1;
			this.machines = 0;
			this.parts = 0;
			this.bc = 10;
			this.mc = 1000;
		}
	}
});