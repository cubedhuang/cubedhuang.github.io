const rand = new Math.seedrandom("seed");
const { floor } = Math;

const randint = (a, b) =>
	floor(b ? rand() * (b - a + 1) + a : rand() * (a + 1));
const char = pool => {
	const skewedRandom = rand() ** 2;
	return pool[floor(skewedRandom * pool.length)];
};

function syllable() {
	const consonants = "tsnhrdlcmfwgpbvkjz";
	const vowels = "eaiou";
	const all = consonants + vowels;

	const length = randint(2, 3);

	let text = "";

	for (let i = 0; i < length; i++) {
		if (i === 0) {
			// First character can be anything
			text += char(all);
		} else if (consonants.indexOf(text[i - 1]) === -1) {
			// Last character was a vowel, now we want a consonant
			text += char(consonants);
		} else {
			// Last character was a consonant, now we want a vowel
			text += char(vowels);
		}
	}

	return text;
}

function word() {
	const length = randint(1, 3);

	let text = "";

	for (let i = 0; i < length; i++) text += syllable();

	return text;
}

function sentence() {
	const length = randint(2, 10);

	let first = word();
	let text = first.substr(0, 1).toUpperCase() + first.substr(1);

	for (let i = 1; i < length; i++) {
		let w = word();
		if (rand() < 0.05) {
			let t = rand() < 0.5 ? "b" : "i";
			w = `<${t}>${w}</${t}>`;
		}
		text += " " + w;
		if (rand() < 0.1 && i !== length - 1) {
			text += ",";
		}
	}

	return text + ".";
}

function paragraph() {
	const length = randint(3, 8);

	let text = "<p>";

	for (let i = 0; i < length; i++) text += " " + sentence();
	if (rand() < 0.1) {
		text += "</p><p>";
		for (let i = 0; i < length; i++) text += " " + sentence();
	}

	return text + "</p>";
}

const sections = (() => {
	const arr = [];
	for (let i = 65; i < 65 + 26; i++) {
		arr.push([String.fromCharCode(i), paragraph()]);
	}
	return arr;
})();

const $container = document.getElementById("container");
const $nav = document.getElementById("sidenav");

for (const section of sections) {
	$container.innerHTML += `
	<div id="${section[0].toLowerCase()}">
		<h3>${section[0]}</h3>
		${section[1]}
	</div>
	`;
	$nav.innerHTML += `
	<a href="#${section[0].toLowerCase()}">${section[0]}</a>
	`;
}
