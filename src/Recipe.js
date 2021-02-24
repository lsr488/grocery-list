class Recipe {
	constructor(url, name, notes) {
		this.url = url;
		this.name = name;
		this.notes = notes;
	}

	addRecipeToLocalStorage() {
		recipes.push(this);
		updateLocalStorage("recipes", recipes);
	}
}