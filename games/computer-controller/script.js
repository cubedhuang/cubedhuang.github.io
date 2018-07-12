numberformat.default.opts = {
	backend: "decimal.js",
	Decimal: Decimal
}

new Vue({
	el: "#game",

	data: {
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
				name: "Meteoroid computer",
				desc: "A computer the size of a meteoroid."
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
				name: "Black Hole computer",
				desc: "A computer harnessing a black hole."
			},
			{
				name: "Galactic computer",
				desc: "A computer spanning a galaxy."
			},
			{
				name: "Time computer",
				desc: "A computer that uses time travel."
			},
		]
	},

	methods: {
		format(x) {
			return numberformat.format(x);
		}
	}
});