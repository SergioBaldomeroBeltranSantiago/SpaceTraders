function checkInputs() {
	var fileInput = document.getElementById("spaceTokenInputFile");
	var textInput = document.getElementById("spaceTokenInputText");
	var findAgent = document.getElementById("spaceFindAgent");

	findAgent.style.display =
		fileInput.files.length > 0 || textInput.value.trim() !== ""
			? "block"
			: "none";
}
