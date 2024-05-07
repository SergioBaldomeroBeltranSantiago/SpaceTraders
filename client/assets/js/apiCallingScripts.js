/*
JavaScript, la función se comunica con la API de SpaceTraders usando 
un token existente para obtener los datos del agente, 
si este agente es encontrado, se procederá a un menú diferente para 
controlar diferentes acciones
*/

function validateToken() {
	var tokenID = document.getElementById("spaceTokenInputText").value;

	if (tokenID !== null && tokenID !== "") {
		const payload = {
			headers: {
				"Content-Type": "application/json",
				Authorization: "Bearer " + tokenID,
			},
		};

		fetch("https://api.spacetraders.io/v2/my/agent", payload)
			.then((response) => response.json())
			.then((response) => {
				document.getElementById("tokenHolder").innerText = tokenID;
			})
			.catch((err) => console.error(err));
	}
}
