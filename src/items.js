// initialize elements 
const form = document.getElementById('form');
let items = JSON.parse(data.getItem("items"));
const itemInput = document.getElementById('item');
const itemButton = document.getElementById('item-button');
const newItems = document.getElementById('new-item');

class Button {
	constructor(elementType, column, type, name, itemId, eventType) {
		this.elementType = elementType;
		this.column = column;
		this.type = type;
		this.name = name;
		this.itemId = itemId;
		this.element = this.createElement();
		this.element.addEventListener('click', eventType);
	}

	createElement() {
		const button = document.createElement(this.elementType);
		button.classList.add('btn');
		button.classList.add(this.column);
		button.classList.add(this.type);
		button.textContent = this.name;	
		button.setAttribute('data-id', this.itemId);
		return button;		
	}

	hide() {
		this.element.classList.add("hidden");
		return this.element;
	}
}

class Item {
	constructor(itemId, name, state) {
		this.id = itemId;
		this.name = name;
		this.state = state;
		this.element = this.createElement();
		// console.log(this.strike);
		// this.striked = this.strike;
		this.savedListener = this.strike.bind(this);
		this.element.addEventListener('click', this.savedListener, false);
		// console.log(this.savedListener);
		// console.log(this);
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
		items.push({
				"id": this.id,
				"item": this.name,
				"state": this.state,
				"element": this.element.outerHTML,
				"savedListener": this.savedListener,
			});
		console.log(items);
		updateLocalStorage("items", items);
	}

	strike() {
		console.log('hello from strike', this);
		this.element.classList.toggle('checked');

		if(items[this.id].state === true) {
			this.state = false;
			items[this.id].state = false;
			// console.log(this);
		}  else {
			this.state = true;
			items[this.id].state = true;
		}
		// console.log(items);
		updateLocalStorage("items", items);
	}

	removeStrike() {
		console.log('hello from removeStrike', this);
		// this.removeEventListener('click', this.savedListener, false);
	}

	updateState() {
		// make me at some point, and remove the state updating from .strike()
	}
}

// checks if localStorage exists, creates from default array if not, or updates from localStorage if it does
if(!items) {
	items = [];
	defaultItems.forEach(item => {
		let itemId = defaultItems.indexOf(item);
		let newItem = new Item(itemId, item.item, item.state);
		newItem.addItem();
	});
}

// input and display new items in UI on submit
itemButton.addEventListener('click', function(e) {
	e.preventDefault();
	let name = itemInput.value;
	let itemId = items.length;
	let item = new Item(itemId, name, false);
	item.addItem();
	itemInput.value = '';
	window.location.reload();
});

// adds each grocery item to a bulleted list
displayGroceryItems(items);

// adds items to bulleted list
function displayGroceryItems(items) {

	items.forEach(item => {
		// create grocery item name
		let itemId = items.indexOf(item);
		let newGroceryObj = new Item(itemId, item.item, item.state);

		// create buttons
		let deleteButtonObj = new Button('div', 'col2', 'delete', 'X', itemId, deleteBtnClicked);
		let editButtonObj = new Button('div', 'col3', 'edit', 'E', itemId, editBtnClicked);
		let saveButtonObj = new Button('div', 'col4', 'save', 'S', itemId, saveBtnClicked);
		saveButtonObj.hide()

		// adds strikethrough if already checked
		if(newGroceryObj.state === true) {
			newGroceryObj.element.classList.add("checked");
		}

		form.appendChild(newGroceryObj.element);
		form.appendChild(deleteButtonObj.element);
		form.appendChild(editButtonObj.element);
		form.appendChild(saveButtonObj.element);

		// newGroceryObj.element.addEventListener('click', newGroceryObj.strike);
	});
	console.log(items);
}

// EVENT LISTENER FUNCTIONS BELOW
// function toggleStrikethrough(e) {
// 	let item = e.target;
// 	item.classList.toggle('checked');

// 	updateItemState(item.id);
// }

function updateItemState(itemId) {
	if(items[itemId].state === true) {
		items[itemId].state = false;
		// updateLocalStorage("items", items);
	}	else {
		items[itemId].state = true;
		// updateLocalStorage("items", items);
	}
	updateLocalStorage("items", items);
}

function editBtnClicked(e) {
	let button = e.target;
	let _id = e.target.dataset.id;
	let item = document.getElementById(_id);

	let itemObj = items[_id];
	console.log(itemObj.savedListener);
	// itemObj.removeStrike();
	// itemObj.setId();
	console.log("EditBtn this:", this);

	// item.removeEventListener('click', toggleStrikethrough);
	item.classList.remove('checked');
	item.classList.add('editing');
	item.setAttribute("contenteditable", true);

	updateItemState(_id);

	let saves = document.getElementsByClassName('save');
	let deletes = document.getElementsByClassName('delete');

	saves[_id].classList.remove("hidden");
	deletes[_id].classList.add("hidden");
	button.classList.add("hidden");
}

function saveBtnClicked(e) {
	let button = e.target;
	let _id = e.target.dataset.id;
	let item = document.getElementById(_id);

	item.setAttribute("contenteditable", false);
	item.classList.remove('editing');
	item.addEventListener('click', item.strike);
	
	items[item.id].item = item.textContent;

	updateItemState(_id);

	let deletes = document.getElementsByClassName('delete');
	let edits = document.getElementsByClassName('edit');

	button.classList.add("hidden");
	deletes[_id].classList.remove("hidden");
	edits[_id].classList.remove("hidden");
}

function deleteBtnClicked(e) {
	let button = e.target;
	let _id = e.target.dataset.id;
	let item = document.getElementById(_id);

	deleteLocalStorageItem(items, item.id);
	updateLocalStorage("items", items);

	window.location.reload();
}

// const a = new Item(43, 'bananas', false);
// const b = new Item(4, 'coffee', false);
// console.log('a:', a);
// console.log('b:', b);
// console.log('comparison:', a.savedListener == b.savedListener);