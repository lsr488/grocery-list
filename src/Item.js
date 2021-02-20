class Item {
	constructor(itemId, name, state) {
		this.id = itemId;
		this.name = name;
		this.state = state;
		this.element = this.createElement();

		// these three options for savedListener all work to remove the eventListern
		// this.savedListener = () => this.toggleChecked();
		// this.savedListener = function() { this.toggleChecked() };
		this.savedListener = this.toggleChecked.bind(this);

		this.element.addEventListener('click', this.savedListener, false);
	}

	createElement() {
		const item = document.createElement('li');
		item.setAttribute('id', this.id);
		item.classList.add('col1');
		item.textContent = this.name;
		return item;
	}

	setId() {}

	addItem() {
		items.push(this);
		updateLocalStorage("items", items);
	}

	toggleChecked() {
	 	this.element.classList.toggle('checked');
		this.updateState();
	}

	editingItem() {
		this.element.removeEventListener('click', this.savedListener, false);
		this.element.classList.remove('checked');
		this.element.classList.add('editing');
		this.element.setAttribute('contenteditable', true);
	}

	savingItem() {
		console.log('savingItem this:', this);
		// this.element.removeEventListener('click', this.savedListener, false);
		this.element.setAttribute('contenteditable', false);
		this.element.classList.remove('editing');
		this.name = this.element.textContent;
		this.element.classList.remo

		console.log("data.getItem:", data.getItem("items"));
		console.log("JSON.stringify this:", JSON.stringify(this));
		this.updateState();
	}

	updateState() {
		// console.log('updateState this:', this);

		if(this.element.className.includes('checked')) {
			// console.log("is this checked?", this.element.className.includes('checked'));
			// items[this.id].state === true;
			this.state = true;
		} else {
			// console.log("is this checked?", this.element.className.includes('checked'));
			this.state = false;
		}

		updateLocalStorage("items", items);
		console.log("data.getItem:", data.getItem("items"));
	}
}