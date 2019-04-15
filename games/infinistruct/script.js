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
	},

	computed: {
		costs() {
			return this.structs.map((e, i) => new Decimal(++i).pow(i * 2));
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
			this.stuff = this.stuff.minus(this.costs[tier]);
			this.structs[tier] = this.structs[tier].plus(1);
		},

		next(sPassed) {
			sPassed /= 1000;
			const temp = this.structs.slice();
			for (var i = 0; i < temp.length; i++) {
				temp[i - 1] = temp[i - 1].plus(temp[i].times(sPassed * (i + 1)));
			}
			this.structs = temp;
			this.stuff = this.stuff.plus(this.structs[0].times(sPassed));
			if (this.structs[this.structs.length - 1].gte(1)) this.structs.push(new Decimal(0));
		},
		
		restart() {
			// eslint-disable-next-line
			if (!confirm("Are you sure want to RESTART the game?")) return;
			this.stuff = new Decimal(1);
			this.structs = [new Decimal(0)];
		},

		save() {
			localStorage.setItem("save", JSON.stringify({
				stuff: p42.stuff.toString(),
				structs: p42.structs.map(e => e.toString()),
				last: new Date().getTime()
			}));
		}
	}
});

let prev = 0;

function loop(ms) {
	requestAnimationFrame(loop);
	p42.next(ms - prev);
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
	loop(new Date().getTime() - save.last);
	setTimeout(() => {
		alert(`You earned ${ numberformat.format(p42.stuff.minus(save.stuff)) } stuff and some more structures while you were away!`);
	}, 100)
};