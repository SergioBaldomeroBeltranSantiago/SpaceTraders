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
			.then((response) => {
				if (!response.ok) {
					throw new Error(
						"Token not found. Status:" + response.status,
					);
				}
				response.json();
			})
			.then((response) => {
				document.getElementById("tokenHolder").innerText = tokenID;
				alert("Token found, redirecting to menu");
			})
			.catch((error) => {
				console.error(error);
				alert("Token was not found, please try again");
			});
	}
}
