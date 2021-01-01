const priceInput = document.getElementById('number');
const priceButton = document.getElementById('calc-button');
const prices = document.getElementById('prices');

let math = JSON.parse(data.getItem("prices"));

// checks if localStorage exists, creates from default array if not, or updates from localStorage if it does
if(!math) {
	math = [];
	updateLocalStorage("prices", math);
} else {
	// displays price
	math.forEach(price => {
		const entry = document.createElement('li');
		entry.textContent = `$${price.toFixed(2)}`;
		prices.appendChild(entry);
	});

	priceInput.value = "";

	// add prices together and display
	if(math.length >= 1) {
		const results = document.getElementById('results');
		const sums = (accumulator, currentValue) => accumulator + currentValue;
		results.textContent = `$${math.reduce(sums).toFixed(2)}`;
	}
}

// input and display prices
priceButton.addEventListener('click', function(e) {
	e.preventDefault();

	// input individual price
	if(priceInput.value) {
		math.push(priceInput.value);
		math = math.map(Number);
		data.setItem("prices", JSON.stringify(math));

		// clears prices display so there aren't duplicate prices listed
		prices.textContent = "";

		// displays price
		math.forEach(price => {
			const entry = document.createElement('li');
			entry.textContent = `$${price.toFixed(2)}`;
			prices.appendChild(entry);
			priceInput.value = "";
		});

		// add prices together and display
		const results = document.getElementById('results');
		const sums = (accumulator, currentValue) => accumulator + currentValue;
		results.textContent = `$${math.reduce(sums).toFixed(2)}`;
	}
});

const itemInput = document.getElementById('item');
const itemButton = document.getElementById('item-button');
const newItems = document.getElementById('new-item');

// display new items in UI on click
itemButton.addEventListener('click', function(e) {
	e.preventDefault();
	addAdditionalItem(itemInput.value);
	itemInput.value = '';
});