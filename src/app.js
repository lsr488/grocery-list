const data = {
	getItem: (key) => localStorage.getItem(key),
	setItem: (key, value) => localStorage.setItem(key, value),
	clear: () => localStorage.clear(),
}

// clears localStorage when clicked
clear.addEventListener('click', function(e) {
	e.preventDefault();

	data.clear();
	window.location.reload();
});

function updateLocalStorage(name, elements) {
	data.setItem(name, JSON.stringify(elements));
}

function deleteLocalStorageItem(array, item) {
	const index = array.indexOf(item);
	array.splice(index, 1);

	updateLocalStorage("items", array);
}
