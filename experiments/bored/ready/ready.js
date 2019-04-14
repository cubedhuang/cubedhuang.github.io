{
	const text = document.getElementById("screamer");
	const button = document.getElementById("responder");
	let dialogues = [
		["OK"],
		["tbh this won't make you much less bored", "then why is this happening?"],
		["since i feel like it", "can you actually make me less bored"],
		["maybe", "what's that supposed to mean?"],
		["it means what you want it to mean", "is that... a yes?"],
		["it means what you want it to mean", "then do it!"],
		["ARE YOU READY?", "woah, uh"],
		["ARE YOU READY?", "ok..."],
		["ARE YOU READY?"],
		["ARE YOU READY?"],
		["ARE YOU READY?"],
		["ARE YOU READY?"],
		["ARE YOU READY?"],
		["ARE YOU READY?"],
		["ARE YOU READY?"],
		["ARE YOU READY?"],
		["ARE YOU READY?"],
		["ARE YOU READY?"],
		["ARE YOU READY?"],
		["ARE YOU READY?"],
		["ARE YOU READY?"],
		["ha i bet you skipped this the first time round <button onclick=\"trulyReady()\">click this</button>"],
		["ARE YOU READY?<br><br>", "wait"],
		["WHAT IS IT?", "i think i missed some text"],
		["this is a game of boredom. did i really get you excited enough to spam the button?", "oh"],
		["you have to refresh the page now", "ok"],
		["dont worry the button actually doesnt do anything now", "ok"],
	];
	let currentDialogue = 0;

	button.addEventListener("click", () => {
		currentDialogue++;
		let current = dialogues[currentDialogue];
		if (current) {
			text.innerHTML = current[0];
			if (currentDialogue === 5 || currentDialogue === 7) {
				text.classList.add("animated", currentDialogue === 7 ? "rubberBand" : "bounce");
			} else {
				text.classList.remove("animated", "bounce");
			}
			if (current[1]) {
				button.innerHTML = current[1];
			}
		}
	});
}

function trulyReady() {
	document.querySelector("body").innerHTML = "you did it yay thats the end bye click <a href=\"/\">this</a> to go back";
}