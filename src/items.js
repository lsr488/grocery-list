// initialize elements 
const form = document.getElementById('form');

const itemData = JSON.parse(data.getItem("items")) || [];

// the for loop and the .map() do the same thing
// let items = [];
// for(let i = 0; i < itemData.length; i++) {
// 	const itemDatum = itemData[i];
// 	items.push(new Item(i, itemDatum.name, itemDatum.state));
// }
let items = itemData.map((x, i) => new Item(i, x.name, x.state));

const itemInput = document.getElementById('item');
const itemButton = document.getElementById('item-button');
const newItems = document.getElementById('new-item');

class Button {
	constructor(elementType, column, type, name, item, eventType) {
		this.elementType = elementType;
		this.column = column;
		this.type = type;
		this.name = name;
		this.item = item;
		this.itemId = item.id;
		this.element = this.createElement();

		if (eventType) {
		  this.element.addEventListener('click', eventType);
	  } else {
	  	this.element.addEventListener('click', this.edit.bind(this));
	  }
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

	edit() {
		console.log("Button edit this:", this);
		console.log('Button edit this.item:', this.item);

		this.item.editingItem();

		const saveBtn = document.querySelector(`.save[data-id="${this.item.id}"]`);
		const deleteBtn = document.querySelector(`.delete[data-id="${this.item.id}"]`);

		saveBtn.classList.remove("hidden");
		deleteBtn.classList.add("hidden");
		this.hide();
	}
}

// checks if localStorage exists, creates from default array if not, or updates from localStorage if it does
if(items.length === 0) {
	// items = [];
	defaultItems.forEach(item => {
		let itemId = defaultItems.indexOf(item);
		let newItem = new Item(itemId, item.name, item.state);
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
		// create buttons
		let deleteButtonObj = new Button('div', 'col2', 'delete', 'X', item, deleteBtnClicked);
		let editButtonObj = new Button('div', 'col3', 'edit', 'E', item);
		let saveButtonObj = new Button('div', 'col4', 'save', 'S', item, saveBtnClicked);
		saveButtonObj.hide()

		// adds strikethrough if already checked
		if(item.state === true) {
			item.element.classList.add("checked");
		}

		form.appendChild(item.element);
		form.appendChild(deleteButtonObj.element);
		form.appendChild(editButtonObj.element);
		form.appendChild(saveButtonObj.element);
	});
}

function saveBtnClicked(e) {
	let button = e.target;
	let _id = e.target.dataset.id;
	let item = document.getElementById(_id);

	item.setAttribute("contenteditable", false);
	item.classList.remove('editing');
	
	// item.addEventListener('click', item.strike);
	// item.addEventListener('click', toggleStrikethrough);
	
	items[item.id].name = item.textContent;

	// TODO FIXME why doesn't update state when unchecked

	updateLocalStorage("items", items);

	let deletes = document.getElementsByClassName('delete');
	let edits = document.getElementsByClassName('edit');

	button.classList.add("hidden");
	deletes[_id].classList.remove("hidden");
	edits[_id].classList.remove("hidden");
}

function deleteBtnClicked(e) {
	let button = e.target;
	let _id = e.target.dataset.id;
	const item = items[_id];

	deleteLocalStorageItem(items, item);

	window.location.reload();
}
