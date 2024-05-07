//JavaScript, injecta componentes a la pagina, algo similar a como ReactJS o angular manejar los componentes modularizados
function fetchHTML(templatePath, containerId) {
	fetch(templatePath)
		.then((response) => response.text())
		.then((data) => {
			document.getElementById(containerId).innerHTML = data;
		})
		.catch((error) => {
			console.error("Error fetching template for " + divId, error);
		});
}

//JavaScript, una funcion para cambiar los menus visibles cuando el usuario hace click en uno de los botones del menu

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

/*
JavaScript, una funcion que chequea el valor de los campos donde el usuario puede incluir su token de agente para acceder a su progreso de juego.
Esta funcion solo revela un botón para validar el token con la API del juego
*/
function checkInputs() {
	var textInput = document.getElementById("spaceTokenInputText");
	var findAgent = document.getElementById("spaceFindAgent");

	findAgent.style.display = textInput.value.trim() !== "" ? "block" : "none";
}
