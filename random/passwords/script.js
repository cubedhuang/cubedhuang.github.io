var mems = [
	["temp"],
	"1234567890".split(""),
	"!@$%&".split("")
];

fetch("./words.txt").then(res => res.text()).then(text => {
	mems[0] = text.split("\n");
	setPasswords();
});

var easyChars = "1234567890qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM".split("");
var strongChars ="1234567890qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM!@#$%^&*()-=[];\'\"\\<>/".
	split("");
var insaneChars =
"`1234567890-=qwertyuiop[]\\asdfghjkl;\'zxcvbnm,./~!@#$%^&*()_+QWERTYUIOP{}|ASDFGHJKL:\"ZXCVBNM<>?".
	split("");

strongChars[strongChars.indexOf("<")] = "&lt;";
strongChars[strongChars.indexOf("&")] = "&amp;";
insaneChars[insaneChars.indexOf("<")] = "&lt;";
insaneChars[insaneChars.indexOf("&")] = "&amp;";

function randInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1) + min);
}

function pick(array) {
	return array[randInt(0, array.length - 1)];
}

function grsp(array, length) {
	var string = "";
	for (var i = 0; i < length; i++) string += pick(array);
	return string;
}

function setPasswords() {
	if (mems[1].length !== 1) {
		var mem = "";
		var w1 = pick(mems[0]);
		mem += w1[0].toUpperCase() + w1.slice(1);
		mem += pick(mems[1]);
		mem += pick(mems[1]);
		mem += pick(mems[2]);

		document.getElementById("memorable").innerHTML = mem;
	} else document.getElementById("memorable").innerHTML = "LOADING WORDS...";

	document.getElementById("medium").innerHTML = grsp(easyChars, 8);
	document.getElementById("strong").innerHTML = grsp(strongChars, 12);
	document.getElementById("insane").innerHTML = grsp(insaneChars, 20);
}

window.onload = setPasswords;