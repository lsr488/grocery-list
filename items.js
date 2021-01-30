// initialize elements 
const form = document.getElementById('form');
let items = JSON.parse(data.getItem("items"));

// checks if localStorage exists, creates from default array if not, or updates from localStorage if it does
if(!items) {
	items = defaultItems;
	updateLocalStorage("items", items);
}

const itemInput = document.getElementById('item');
const itemButton = document.getElementById('item-button');
const newItems = document.getElementById('new-item');

// display new items in UI on click
itemButton.addEventListener('click', function(e) {
	e.preventDefault();
	addAdditionalItem(itemInput.value);
	itemInput.value = '';
});

// input and display additional items
function addAdditionalItem(item) {
	items.push({"item": item, "state": false,});
	updateLocalStorage("items", items);
	window.location.reload();
}

// adds each grocery item to a bulleted list
displayGroceryItems(items);

// adds items to UI
function displayGroceryItems(items) {
	let itemId = 0;

	items.forEach(item => {
		// create grocery item name
		const newGrocery = document.createElement('li');
		newGrocery.setAttribute("id", itemId);
		newGrocery.classList.add("col1");
		newGrocery.textContent = item.item;

		// create buttons
		let deleteButton = createButton('div', 'col2', 'delete', 'X', itemId, deleteBtnClicked);
		let editButton = createButton('div', 'col3', 'edit', 'E', itemId, editBtnClicked);
		let saveButton = createButton('div', 'col4', 'save', 'S', itemId, saveBtnClicked);
		saveButton.classList.add("hidden");

		itemId+= 1;

		form.appendChild(newGrocery);
		form.appendChild(deleteButton);
		form.appendChild(editButton);
		form.appendChild(saveButton);

		// adds strikethrough if already checked
		if(item.state === true) {
			newGrocery.classList.add("checked");
		}

		// toggles strikethrough on repeat clicks
		newGrocery.addEventListener('click', toggleStrikethrough);
		editButton.addEventListener('click', editBtnClicked);
		saveButton.addEventListener('click', saveBtnClicked);

	});
}

// function initializeButtons(nameButton, nameClass) {
// 	nameButton = document.getElementsByClassName(nameClass);
// }

// EVENT LISTENER FUNCTIONS BELOW
		// I think they need to be inside the forEach loop for proper scoping to remove (and add back) the toggleStrikethrough event listener.
function toggleStrikethrough(e) {
	let item = e.target;
	console.log("grocery item:", item);
	item.classList.toggle('checked');

	if(items[item.id].state === true) {
		items[item.id].state = false;
		updateLocalStorage("items", items);
	}	else {
		items[item.id].state = true;
		updateLocalStorage("items", items);
	}
}

function editBtnClicked(e) {
	let button = e.target;
	let _id = e.target.dataset.id;
	console.log(button);
	console.log(_id);
	let item = document.getElementById(_id);
	console.log(item);
	 
	item.removeEventListener('click', toggleStrikethrough);
	item.classList.remove('checked');
	item.setAttribute("contenteditable", true);

	let saves = document.getElementsByClassName('save');
	let deletes = document.getElementsByClassName('delete');
	// console.log(saves);
	// console.log(saves[_id]);

	saves[_id].classList.remove("hidden");
	deletes[_id].classList.add("hidden");
	button.classList.add("hidden");
}

function saveBtnClicked(e) {
	newGrocery.setAttribute("contenteditable", false);
	newGrocery.addEventListener('click', toggleStrikethrough);

	items[newGrocery.id].item = newGrocery.textContent;

	updateLocalStorage("items", items);

	saveBtn.classList.add("hidden");
	deleteBtn.classList.remove("hidden");
	editBtn.classList.remove("hidden");
}

		function deleteBtnClicked(e) {
			console.log('Delete Button Clicked');

			deleteLocalStorageItem(items, newGrocery.id);
			updateLocalStorage("items", items);

			window.location.reload();
		}

function createButton(elementType, column, type, name, itemId) {
	const button = document.createElement(elementType);
	button.classList.add('btn');
	button.classList.add(column);
	button.classList.add(type);
	button.textContent = name;	
	button.setAttribute('data-id', itemId);
	// button.addEventListener('click', eventListener);
	return button;
}