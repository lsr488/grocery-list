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
				"element": this.element,
			});
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
	// console.log(items);
	// items = defaultItems;
	updateLocalStorage("items", items);
}

// display new items in UI on click
itemButton.addEventListener('click', function(e) {
	e.preventDefault();
	addAdditionalItem(itemInput.value);
	itemInput.value = '';
});

// adds each grocery item to a bulleted list
displayGroceryItems(items);

// input and display additional items
function addAdditionalItem(item) {
	let itemId = items.length;
	// debugger
	let newItem = new Item(itemId, item, false);
	newItem.addItem();
	// items.push({"item": item, "state": false,});
	updateLocalStorage("items", items);
	window.location.reload();
}

// adds items to bulleted list
function displayGroceryItems(items) {
	// let itemId = 0;

	items.forEach(item => {
		// debugger

		// create grocery item name
		// const newGrocery = document.createElement('li');
		// newGrocery.setAttribute("id", itemId);
		// newGrocery.classList.add("col1");
		// newGrocery.textContent = item.item;
		let itemId = items.indexOf(item);
		let newGroceryObj = new Item(itemId, item.item, item.state);

		// create buttons
		// let deleteButton = createButton('div', 'col2', 'delete', 'X', itemId, deleteBtnClicked);
		// let editButton = createButton('div', 'col3', 'edit', 'E', itemId, editBtnClicked);
		// let saveButton = createButton('div', 'col4', 'save', 'S', itemId, saveBtnClicked);
		let deleteButtonObj = new Button('div', 'col2', 'delete', 'X', itemId, deleteBtnClicked);
		let editButtonObj = new Button('div', 'col3', 'edit', 'E', itemId, editBtnClicked);
		let saveButtonObj = new Button('div', 'col4', 'save', 'S', itemId, saveBtnClicked);
		saveButtonObj.hide()

		itemId+= 1;

		// adds strikethrough if already checked
		if(newGroceryObj.state === true) {
			newGroceryObj.element.classList.add("checked");
		}

		form.appendChild(newGroceryObj.element);
		form.appendChild(deleteButtonObj.element);
		form.appendChild(editButtonObj.element);
		form.appendChild(saveButtonObj.element);

		newGroceryObj.element.addEventListener('click', toggleStrikethrough);
		// editButton.addEventListener('click', editBtnClicked);
		//saveButton.addEventListener('click', saveBtnClicked);
		// deleteButton.addEventListener('click', deleteBtnClicked);
	});
}

// EVENT LISTENER FUNCTIONS BELOW
function toggleStrikethrough(e) {
	let item = e.target;
	item.classList.toggle('checked');

	updateItemState(item.id);
}

function updateItemState(itemId) {
	// console.log(itemId);
	// console.log(items[itemId]);
	if(items[itemId].state === true) {
		items[itemId].state = false;
		updateLocalStorage("items", items);
	}	else {
		items[itemId].state = true;
		updateLocalStorage("items", items);
	}
}

function editBtnClicked(e) {
	let button = e.target;
	let _id = e.target.dataset.id;
	let item = document.getElementById(_id);

	item.removeEventListener('click', toggleStrikethrough);
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
	item.addEventListener('click', toggleStrikethrough);
	
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

// function createButton(elementType, column, type, name, itemId) {
// 	const button = document.createElement(elementType);
// 	button.classList.add('btn');
// 	button.classList.add(column);
// 	button.classList.add(type);
// 	button.textContent = name;	
// 	button.setAttribute('data-id', itemId);
// 	return button;
// }