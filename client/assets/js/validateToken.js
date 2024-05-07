function validateToken() {
	var tokenID = document.getElementById("spaceTokenInputText").value;

	if (tokenID !== null && tokenID !== "") {
		const payload = {
			headers: {
				"Content-Type": "application/json",
				Authorization: "Bearer " + tokenID,
			},
		};

		console.log(payload);

		fetch("https://api.spacetraders.io/v2/my/agent", payload)
			.then((response) => response.json())
			.then((response) => console.log(response))
			.catch((err) => console.error(err));
	}
}
