function switchMenuOption(evt, selectedOption) {
	var index, optionsList, optionsButton;

	optionsList = document.getElementsByClassName("spaceSubMenu");
	for (index = 0; index < optionsList.length; index++) {
		optionsList[index].style.display = "none";
	}

	optionsButton = document.getElementsByClassName("spaceMenuButton");
	for (index = 0; index < optionsButton.length; index++) {
		optionsButton[index].className = optionsButton[index].className.replace(
			" active",
			"",
		);
	}

	document.getElementById(selectedOption).style.display = "block";
	evt.currentTarget.className += " active";
}
