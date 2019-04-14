new Vue({
	el: "#within",

	created() {
		fetch("data.json").then(res => res.json()).then(data => {
			this.data = [];
			const temp = [];
			for (let i = 0; i < data.length; i++) {
				data[i].id = i;
				if (data[i].hasOwnProperty("inside")) for (let j = 0; j < data[i].inside.length; j++) {
					data[i].inside[j] = data.findIndex(val => val.name === data[i].inside[j]);
				} else data[i].inside = [];
				temp.push(data[i]);
			}

			this.data = temp;
		});
	},

	data: {
		dir: [0],
		data: [
			{
				name: "LOADING",
				id: 0,
				desc: `
					If you are seeing this message,
					either an error has occured or the data is taking a while to load.
					If this message doesn't disappear,
					then reload or press Ctrl+F5 on your keyboard.
					If that doesn't work, tell me in the comments on the home page.
				`,
				inside: []
			}
		]
	},

	computed: {
		current() {
			return this.dir[this.dir.length - 1];
		}
	},

	methods: {
		next(id) {
			if (this.dir.includes(id)) {
				const len = this.dir.indexOf(id) + 1;
				while (this.dir.length > len) this.dir.pop();
			}
			else this.dir.push(id);
		}
	}
});