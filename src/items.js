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
// console.log('items:', items);

const itemInput = document.getElementById('item');
const itemButton = document.getElementById('item-button');
const newItems = document.getElementById('new-item');


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
		let deleteButtonObj = new Button('div', 'col2', 'delete', 'X', item);
		let editButtonObj = new Button('div', 'col3', 'edit', 'E', item);
		let saveButtonObj = new Button('div', 'col4', 'save', 'S', item);
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
