const priceInput = document.getElementById('number');
const priceButton = document.getElementById('calc-button');
const prices = document.getElementById('prices');

let math = JSON.parse(data.getItem("prices"));

// checks if localStorage exists, creates from default array if not, or updates from localStorage if it does
if(!math) {
	math = [];
	updateLocalStorage("prices", math);
}

priceButton.addEventListener('click', function(e) {
	e.preventDefault();
	addAdditionalPrice(priceInput.value);
});

displayPrices();
addAndDisplaySumPrices();

function addAdditionalPrice(price) {
	math.push(priceInput.value);

	priceInput.value = "";
	
	math = math.map(Number);
	updateLocalStorage("prices", math);

	window.location.reload();
}

function displayPrices() {
	let priceId = 0;

	// clears prices display so there aren't duplicate prices listed
	prices.textContent = "";

	// displays individual price
	math.forEach(price => {
		const entry = document.createElement('li');
		entry.setAttribute("data-price-id", priceId);
		entry.textContent = `$${price.toFixed(2)}`;
		entry.classList.add("col1");

		// create delete button
		const deleteBtn = document.createElement('div');
		deleteBtn.classList.add("col3");
		deleteBtn.classList.add("btn");
		deleteBtn.classList.add("delete");
		deleteBtn.textContent = "X";
		deleteBtn.addEventListener('click', function() {
			deleteLocalStorageItem(math, entry.dataset.priceId);
			updateLocalStorage("prices", math);
			window.location.reload();
		});

		priceId++;

		prices.appendChild(entry);
		prices.appendChild(deleteBtn);
	});
}

function addAndDisplaySumPrices() {
	// add prices together and displays
	if(math.length >= 1) {
		const results = document.getElementById('results');
		const sums = (accumulator, currentValue) => accumulator + currentValue;
		results.textContent = `$${math.reduce(sums).toFixed(2)}`;
	}
}