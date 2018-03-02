function submit() {
	if (document.getElementById("code").value === "t3st_b3ta") {
		document.getElementById("hidden").classList.remove("hidden");
	}
}

document.getElementById("submit-code").addEventListener("click", submit);