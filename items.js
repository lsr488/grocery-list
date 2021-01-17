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

		// create delete button
		const deleteBtn = document.createElement('div');
		deleteBtn.classList.add("col2");
		deleteBtn.classList.add("btn");
		deleteBtn.classList.add("delete");
		deleteBtn.setAttribute('data-id', itemId);
		deleteBtn.textContent = "X";
		deleteBtn.addEventListener('click', deleteBtnClicked)

		// create edit button
		const editBtn = document.createElement('div');
		editBtn.classList.add("col3");
		editBtn.classList.add("btn");
		editBtn.classList.add("edit");
		editBtn.setAttribute('data-id', itemId);
		editBtn.textContent = "E";
		editBtn.addEventListener('click', editBtnClicked);

		// create save button
		const saveBtn = document.createElement('div');
		saveBtn.classList.add("col4");
		saveBtn.classList.add("btn");
		saveBtn.classList.add("save");
		saveBtn.setAttribute('data-id', itemId);
		saveBtn.classList.add("hidden");
		saveBtn.textContent = "S";
		saveBtn.addEventListener('click', saveBtnClicked);

		itemId+= 1;

		form.appendChild(newGrocery);
		form.appendChild(editBtn);
		form.appendChild(deleteBtn);
		form.appendChild(saveBtn);

		// adds strikethrough if already checked
		if(item.state === true) {
			newGrocery.classList.add("checked");
		}

		// toggles strikethrough on repeat clicks
		newGrocery.addEventListener('click', toggleStrikethrough);

		// EVENT LISTENER FUNCTIONS BELOW
		// I think they need to be inside the forEach loop for proper scoping to remove (and add back) the toggleStrikethrough event listener.
		function toggleStrikethrough(e) {
			newGrocery.classList.toggle("checked");
			if(items[newGrocery.id].state === true) {
				items[newGrocery.id].state = false;
				updateLocalStorage("items", items);
			} else {
				items[newGrocery.id].state = true;
				updateLocalStorage("items", items);
			}
		}

		function editBtnClicked(e) {
			newGrocery.removeEventListener('click', toggleStrikethrough);
			newGrocery.setAttribute("contenteditable", true);

			saveBtn.classList.remove("hidden");
			deleteBtn.classList.add("hidden");
			editBtn.classList.add("hidden");
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

	});
}
