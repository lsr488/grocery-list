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

	console.log("deleteLS array:", array);
	console.log("deleteLS index:", index);
	console.log("deleteLS item:", item);

	array.splice(index, 1);

	console.log("deleteLS array:", array);

	updateLocalStorage("items", array);
}
