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
