const debug = new Vue({
	el: "#app",

	data: {
		rawDebaters: "",
		pairings: [],
		type: 0
	},

	computed: {
		debaters() {
			let list = [];

			this.rawDebaters.split("\n").forEach(c => {
				if (c !== "") list.push(c);
			});

			return list;
		}
	},

	methods: {
		generate(type) {
			this.type = type;

			let shuffled = this.debaters.map(c => c);

			for (let i = shuffled.length - 1; i > 0; i--) {
				let j = Math.floor(Math.random() * (i + 1));
				[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
			}

			this.pairings = shuffled;
		},
		
		generateR(type) {
			function isAny(val, ...checks) {
				let output = false;
				for (let i = 0; i < checks.length; i++) {
					if (val === checks[i]) output = true;
				}
				return output;
			}

			function checkContain(arr, ...checks) {
				let output = true;
				for (let i = 0; i < checks.length; i++) {
					if (!arr.includes(checks[i])) output = false;
				}
				return output;
			}

			if (!checkContain(this.debaters, "Karthik", "Pranaya", "Ananya", "Saanvi", "Daniel") || type === 2) {
				this.generate(type);
				return;
			}

			this.type = type;

			let shuffled = this.debaters.map(c => c);

			for (let i = shuffled.length - 1; i > 0; i--) {
				let j = Math.floor(Math.random() * (i + 1));
				[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
			}

			let setIndex = 0;
			for (let i = 0; i < shuffled.length; i++) {
				if (isAny(shuffled[i], "Karthik", "Pranaya")){
					[shuffled[i], shuffled[setIndex]] = [shuffled[setIndex], shuffled[i]];
					setIndex++;
				}
			}
			for (let i = 0; i < shuffled.length; i++) {
				if (isAny(shuffled[i], "Ananya", "Saanvi")){
					[shuffled[i], shuffled[setIndex]] = [shuffled[setIndex], shuffled[i]];
					setIndex++;
				}
			}
			for (let i = 0; i < shuffled.length; i++) {
				if (isAny(shuffled[i], "Daniel")){
					[shuffled[i], shuffled[setIndex]] = [shuffled[setIndex], shuffled[i]];
					setIndex++;
				}
			}

			this.pairings = shuffled;
		}
	}
});