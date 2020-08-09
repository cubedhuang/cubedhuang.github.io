let debug = new Vue({
	el: "#app",

	data: {
		buttons: [{
			value: Math.trunc(Math.random() * 100) + 1,
			bg: "red",
			color: "white",
			x: 100,
			y: 0
		}],
		score: 0
	},

	methods: {
		create(i) {
			let temp = this.buttons.slice();
			this.score += temp[i].value;

			let bgc = ["red"  , "blue" , "green", "yellow"];
			let col = ["white", "white", "white", "black"];

			let i1 = Math.floor(Math.random() * bgc.length);
			let i2 = Math.floor(Math.random() * bgc.length);

			temp.push({
				value: Math.trunc(Math.random() * 100) + 1,
				bg: bgc[i1],
				color: col[i1],
				x: temp[i].x,
				y: temp[i].y,
			});
			if (temp.length <= 50) temp.push({
				value: Math.trunc(Math.random() * 100) + 1,
				bg: bgc[i2],
				color: col[i2],
				x: temp[i].x,
				y: temp[i].y,
			});

			temp.splice(i, 1);

			this.buttons = temp;
		},
		
		changePos() {
			let temp = this.buttons.slice();

			for (var i = 0; i < temp.length; i++) {
				temp[i].x = Math.random() * (window.innerWidth - 300) + 100;
				temp[i].y = Math.random() * (window.innerHeight - 100) + 50;
			}

			this.buttons = temp;
		}
	}
});

setInterval(debug.changePos, 1000);