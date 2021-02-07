// initialize elements 
let recipes = JSON.parse(data.getItem("recipes"));

// checks if localStorage exists, creates from default array if not, or updates from localStorage if it does
if(!recipes) {
	recipes = defaultRecipes
	updateLocalStorage("recipes", recipes);
}

// adds each recipe to a bulleted list
const links = document.getElementById('links');

recipes.forEach(recipe => {
	const listItem = document.createElement('li');

	if(recipe.url) {
		const url = document.createElement('a');
		url.setAttribute('href', `${recipe.url}`);
		url.setAttribute('target', '_blank');
		url.textContent = recipe.name;
		listItem.appendChild(url);
		links.appendChild(listItem);
	} else {
		listItem.textContent = recipe.name;
		links.appendChild(listItem);
	}

	if(recipe.notes) {
		let splitNotes = recipe.notes.split(';');

		const noteContainer = document.createElement('ul');

		splitNotes.forEach(note => {
			const listNote = document.createElement('li');
			listNote.textContent = note;
			noteContainer.appendChild(listNote);
			listItem.appendChild(noteContainer);
		});
	}
});