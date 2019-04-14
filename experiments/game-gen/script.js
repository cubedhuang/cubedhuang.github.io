var types = [
	"An idle",
	"A puzzle",
	"An adventure",
	"A platformer",
	"A first-person-shooter",
	"A simulation",
	"A sports",
	"A strategy",
	"A survival",
	"A pointless",
];
var verbs = [
	"click",
	"eat",
	"shoot",
	"laugh at",
	"find",
	"destroy",
	"conquer",
	"play with",
	"create",
	"fight",
];
var nouns = [
	"hearts",
	"houses",
	"trees",
	"cookies",
	"Earth",
	"planets",
	"computers",
	"life",
	"nothing",
	"everything",
];
var earns = [
	"money",
	"food",
	"water",
	"cookies",
	"memories",
	"fun",
	"nothing",
	"random unnessesary stuff",
];

var seed = document.getElementById("seed");
var out = document.getElementById("output");
var res = document.getElementById("random");

class Random {
	constructor(seed) {
		if (isNaN(seed)) this._seed = 1;
		else {
			this._seed = Math.floor(seed % 2147483647);
			if (this._seed <= 0) this._seed += 2147483646;
		}
	}

	next() {
		return this._seed = this._seed * 16807 % 2147483647;
	}

	nextFloat() {
		return (this.next() - 1) / 2147483646;
	}
}

function pick(arr, rand) {
	return arr[Math.floor(rand.nextFloat() * arr.length)];
}

function create() {
	var rand = new Random(parseInt(seed.value));
	rand.next();

	out.innerHTML =
		pick(types, rand) + " game in which you " +
		pick(verbs, rand) + " " +
		pick(nouns, rand) + " to get " +
		pick(earns, rand) + ".";
}

function reset() {
	seed.value = Math.floor(Math.random() * 100000);
	create();
}

reset();

res.addEventListener("click", reset);
seed.addEventListener("input", create);