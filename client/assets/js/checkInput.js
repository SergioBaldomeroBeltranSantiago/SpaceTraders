function checkInputs() {
	var textInput = document.getElementById("spaceTokenInputText");
	var findAgent = document.getElementById("spaceFindAgent");

	findAgent.style.display = textInput.value.trim() !== "" ? "block" : "none";
}
