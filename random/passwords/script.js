var mems = [
	"ABCDEFGHIJKLMNOPQRSTUVWXYZ".split(""),
	"thing other word new choose password wow look".split(" "),
	"1234567890".split(""),
	"!@$%&".split("")
];
var easyChars = "1234567890qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM".split("");
var strongChars = "1234567890qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM!@#$%^&*()-=[];\'\"\\<>/".split("");
var insaneChars = "`1234567890-=qwertyuiop[]\\asdfghjkl;\'zxcvbnm,./~!@#$%^&*()_+QWERTYUIOP{}|ASDFGHJKL:\"ZXCVBNM<>?".split("");

function randInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1) + (min));
}

function grsp(array, length) {
	var string = "";
	for (var i = 0; i < length; i++) string += array[randInt(0, array.length - 1)];
	return string;
}

function setPasswords() {
	var mem = "";
	mem += mems[0][Math.floor(Math.random() * mems[0].length)];
	mem += mems[1][Math.floor(Math.random() * mems[1].length)];
	mem += mems[1][Math.floor(Math.random() * mems[1].length)];
	mem += mems[2][Math.floor(Math.random() * mems[2].length)];
	if (Math.random() > 0.5) mem += mems[2][Math.floor(Math.random() * mems[2].length)];
	mem += mems[3][Math.floor(Math.random() * mems[3].length)];
	document.getElementById("memorable").innerHTML = mem;

	document.getElementById("medium").innerHTML = grsp(easyChars, 8);
	document.getElementById("strong").innerHTML = grsp(strongChars, 12);
	document.getElementById("insane").innerHTML = grsp(insaneChars, 20);
}

window.onload = setPasswords;