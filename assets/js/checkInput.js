function checkInputs() {
	var fileInput = document.getElementById("spaceTokenInputFile");
	var textInput = document.getElementById("spaceTokenInputText");
	var findAgent = document.getElementById("spaceFindAgent");
	var clearFileInput = document.getElementById("spaceClearInputFile");

	clearFileInput.style.display =
		fileInput.files.length > 0 ? "block" : "none";

	findAgent.style.display =
		fileInput.files.length > 0 || textInput.value.trim() !== ""
			? "block"
			: "none";
}
