export default class Data {
	constructor(data) {
		this.data = data;
	}

	getItem(key) {
		localStorage.getItem(key);
	}

	setItem(key, value) {
		localStorage.setItem(key, value);
	}
	
	clear() {
		localStorage.clear();
	}

	updateLocalStorage(name, elements) {
		this.data.setItem(name, JSON.stringify(elements));
	}

	deleteLocalStorageItem(array, index) {
		array.splice(index, 1);
	}
}