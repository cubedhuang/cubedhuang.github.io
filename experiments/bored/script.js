const text = document.getElementById("bored-text");
const button = document.getElementById("bored-button");

const dialogues = [
	["hello"],
	["you know what"],
	["you're probably here since you're bored", "yeah"],
	["why are you bored", "i have nothing to do"],
	["ok", "ok?"],
	["i'll help you", "how?"],
	["observe", "ok..."],
];
let currentDialogue = 0;

button.addEventListener("click", () => {
	currentDialogue++;
	let current = dialogues[currentDialogue];
	if (current) {
		text.innerHTML = current[0];
		if (current[1]) {
			button.innerHTML = current[1];
		}
	} else {
		window.location.href = /.+\//.exec(window.location.href)[0] + "ready";
	}
});