numberformat.default.opts = {
	sigfigs: 5,
	backend: "decimal.js",
	Decimal: Decimal
};

const p42 = new Vue({
	el: "#infinistruct",

	data: {
		stuff: new Decimal(1),
		structs: [new Decimal(0)],
		difficulty: null,
		diffNames: [
			"Cheap",
			"Easy",
			"Medium",
			"Hard",
			"Impossible"
		]
	},

	computed: {
		costs() {
			const d = this.difficulty;
			return this.structs.map((e, i) =>
				d === 0 ? new Decimal(++i).pow(i) :
					d === 1 ? new Decimal(++i).pow(i + 1) :
						d === 2 ? new Decimal(++i).pow(i + 2) :
							d === 3 ? new Decimal(++i).pow(i * 2) :
								d === 4 ? new Decimal(++i).pow(i).pow(i) : new Decimal(1));
		}
	},

	methods: {
		ordSuff(i) {
			let j = i % 10,
				k = i % 100;
			if (j == 1 && k != 11) return "st";
			else if (j == 2 && k != 12) return "nd";
			else if (j == 3 && k != 13) return "rd";
			return "th";
		},

		buy(tier) {
			if (this.costs[tier].gt(this.stuff)) return;
			if (this.difficulty === null) {
				alert("Choose a difficulty first.");
				return;
			}
			this.stuff = this.stuff.minus(this.costs[tier]);
			this.structs[tier] = this.structs[tier].plus(1);
		},

		next(sPassed) {
			sPassed /= 1000;
			const temp = this.structs.slice();
			for (var i = temp.length - 1; i > 0; i--) {
				temp[i - 1] = temp[i - 1].plus(temp[i].times(sPassed * (this.difficulty > 2 ? 1 : i + 1)));
			}
			this.structs = temp;
			this.stuff = this.stuff.plus(this.structs[0].times(sPassed));
			if (this.structs[this.structs.length - 1].gte(1)) this.structs.push(new Decimal(0));
		},

		setDiff(diff) {
			this.difficulty = diff;
		},
		
		restart() {
			// eslint-disable-next-line
			if (!confirm("Are you sure want to RESTART the game?")) return;
			this.difficulty = null;
			this.stuff = new Decimal(1);
			this.structs = [new Decimal(0)];
		},

		save() {
			if (p42.diff === null) return;
			localStorage.setItem("save", JSON.stringify({
				stuff: p42.stuff.toString(),
				structs: p42.structs.map(e => e.toString()),
				difficulty: p42.difficulty,
				last: new Date().getTime()
			}));
		}
	}
});

let prev = 0;

function loop(ms) {
	requestAnimationFrame(loop);
	if (p42.difficulty !== null) p42.next(ms - prev || 0);
	prev = ms;
}

window.onbeforeunload = p42.save;
window.onpagehide = p42.save;
window.onblur = p42.save;
window.onfocus = p42.save;
setInterval(p42.save, 30000);

onload = () => {
	const save = JSON.parse(localStorage.getItem("save"));
	if (!save) {
		loop();
		return;
	}

	p42.stuff = new Decimal(save.stuff);
	p42.structs = save.structs.map(e => new Decimal(e));
	p42.difficulty = save.difficulty;
	loop(new Date().getTime() - save.last);
	// eslint-disable-next-line
	alert(`You earned ${ numberformat.format(p42.stuff.minus(save.stuff)) } stuff and some more structures while you were away!`);
};