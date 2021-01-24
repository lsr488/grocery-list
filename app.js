import Items from './Items.js';
import Data from './localstorage.js';

const form = document.getElementById('form');
const itemInput = document.getElementById('item');
const itemButton = document.getElementById('item-button');
const newItems = document.getElementById('new-item');

let testData = new Data();
// console.log(localStorage);


// clears localStorage when clicked
clear.addEventListener('click', function(e) {
	e.preventDefault();

	data.clear();
	window.location.reload();
});



let testItems = new Items();
testItems.updateFromLocalStorage(testData);
console.log(testItems);

JSON.parse(data.getItem("items"))