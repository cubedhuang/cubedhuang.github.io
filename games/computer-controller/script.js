numberformat.default.opts = {
	backend: "decimal.js",
	Decimal: Decimal
}

new Vue({
	el: "#game",

	created() {
		this.loop(0);
		this.amounts = this.items.map(() => new Decimal(0));
	},

	data: {
		pTime: 0,

		bits: new Decimal(10000000),

		items: [
			{
				name: "Byte",
				desc: "Stings of eight bits."
			},
			{
				name: "File",
				desc: "Many encoded bytes."
			},
			{
				name: "Folder",
				desc: "Many structured files."
			},
			{
				name: "Hard Disk",
				desc: "Data storage device,"
			},
			{
				name: "Cloud Center",
				desc: "A very huge online hard disk."
			},
			{
				name: "Supercomputer",
				desc: "A very huge processor and hard disk."
			},
			{
				name: "Quantum computer",
				desc: "An extremely powerful computer."
			},
			{
				name: "orbital computer",
				desc: "A computer that orbits a star."
			},
			{
				name: "Asteriod computer",
				desc: "A computer built through an asteroid."
			},
			{
				name: "Planet computer",
				desc: "A computer built through a planet."
			},
			{
				name: "Matrioshka Brain",
				desc: "A computer encapsulating a star."
			},
			{
				name: "Dark computer",
				desc: "A computer harnessing dark energy."
			},
			{
				name: "Galactic computer",
				desc: "A computer spanning a galaxy."
			},
			{
				name: "Time computer",
				desc: "A computer that uses time travel."
			},
			{
				name: "universal computer",
				desc: "A computer that utilizes a universe."
			},
			{
				name: "Universe",
				desc: "Simulation time!"
			},
			{
				name: "Multiverse",
				desc: "All possible worlds with our physics."
			},
			{
				name: "Omniverse",
				desc: "All possible worlds with our dimensions."
			},
			{
				name: "Everything",
				desc: "All possible Omniverses."
			},
		],

		amounts: []
	},

	computed: {
		max() {
			return this.items.map((_, i, a) => {
				if (i === 0) return Decimal.floor(Decimal.pow(60, i).times(8).div(this.bits));
				return Decimal.min(
					Decimal.floor(Decimal.pow(60, i).times(8).div(this.bits)),
					Decimal.floor(Decimal.pow(1.7, i).div(this.amounts[i - 1]))
				);
			});
		},
		able() {
			return this.items.map((_, i, a) => {
				return Decimal.min(
					Decimal.floor(Decimal.pow(60, i).times(8).div(this.bits)),
					Decimal.floor(Decimal.pow(1.7, i).div(i - 1))
				);
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
		},

		loop(ms) {
			requestAnimationFrame(this.loop);
			const passed = (ms - this.pTime) / 1000;
			
			this.pTime = ms;
		}
	}
});