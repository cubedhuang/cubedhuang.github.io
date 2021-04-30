let debug = Vue.createApp({
	data: () => ({
		buttons: [{
			value: Math.trunc(Math.random() * 100) + 1,
			bg: "red",
			x: 100,
			y: 0
		}],
		score: 0
	}),

	methods: {
		create(i, event) {
			// prevent enter
			if (event.x === 0 && event.y === 0) return;

			let temp = this.buttons.slice();
			this.score += temp[i].value;

			let bgc = ["red"  , "blue" , "green", "yellow"];

			let i1 = Math.floor(Math.random() * bgc.length);

			if (temp.length <= 50) temp.push({
				value: Math.trunc(Math.random() * 100) + 1,
				bg: bgc[i1],
				x: temp[i].x,
				y: temp[i].y,
			});

			this.buttons = temp;
			this.changePos();
		},
		
		changePos() {
			let temp = this.buttons.slice();

			for (var i = 0; i < temp.length; i++) {
				temp[i].x = Math.random() * (window.innerWidth - 80);
				temp[i].y = Math.random() * (window.innerHeight - 80);
			}

			this.buttons = temp;
		}
	}
}).mount("#app");

setInterval(debug.changePos, 1000);