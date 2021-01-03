const aliasedElements = {
	reset: function() {
		Object.keys(this).forEach(key => {
			if (key !== 'reset') delete this[key];
		});
	}
};

const cypressAliasCreators = {
	addNewItemAlias: function() {
		this._sectionAlias('Add New Item');
	},

	addTextFieldAlias: function() {
		this._get('addNewItem').within(() => cy.findByRole('textbox').as('addTextField'));
	},

	addButtonAlias: function() {
		cy.findByText('Add').as('addButton');
	},

	groceriesAlias: function() {
		this._sectionAlias('Groceries');
	},

	itemsAlias: function() {
		this._get('groceries').findAllByRole('listitem').as('items');
	},

	itemAlias: function() {
		this._get('items').eq(1).as('item');
	},

	editButtonAlias: function() {
		this._itemButtonAlias('E', 'editButton');
	},

	deleteButtonAlias: function() {
		this._itemButtonAlias('X', 'deleteButton');
	},

	saveButtonAlias: function() {
		this._itemButtonAlias('S', 'saveButton');
	},

	_itemButtonAlias: function(letter, alias) {
		this._get('item').nextAll(`:contains("${letter}")`).first().as(alias);
	},

	_sectionAlias: function(headingText) {
		const alias = headingText.substring(0, 1).toLowerCase() +
		              headingText.substring(1).replace(/[^a-z]/ig, '');

		cy.findByText(headingText).closest('div').as(alias);
	},

	_get: function(alias) {
		const definedAliases = Object.keys(cy.state('aliases'));
		const aliasKey = `@${alias}`;

		if (!definedAliases.includes(aliasKey)) {
			const creatorFuncName = `${alias}Alias`;
			this[creatorFuncName]();
		}
		return cy.get(aliasKey);
	},
};

const cypressGetters = {
	get: function(target, prop, _receiver) {
		const creatorFuncName = `${prop}Alias`;

		// Special-case custom functions.
		if ('waitForReload' === prop) {
			return () => {
				aliasedElements.reset(); // because page reloads create new DOM elements
				cy.wait('@pageReload');
			}
		}

		// If we don't have a creator func for this, pass through to 'cy' object.
		if (!cypressAliasCreators[creatorFuncName]) {
			const cypressFuncName = prop;
			const cypressFunc = cy[cypressFuncName];

			return function (...args) {
				return cypressFunc.apply(this, args);
			};
		}

		// Otherwise, create & return the Cypress alias for the requested element.
		const alreadyAliased = target;
		const aliasName = prop;

		if (!alreadyAliased[aliasName]) {
			cypressAliasCreators[creatorFuncName]();
			alreadyAliased[aliasName] = true;
		}

		return cy.get(`@${aliasName}`);
	}
};

const page = new Proxy(aliasedElements, cypressGetters);

describe('Grocery List', () => {
  beforeEach(() => {
		aliasedElements.reset();
    cy.visit('src/index.html');
		cy.intercept('/src/index.html').as('pageReload');
  })

	context('an item', () => {
		it('can be marked as purchased by tapping its name', () => {
			const lineThrough = 'line-through solid rgb(0, 0, 0)';

			page.item
				.should('not.have.css', 'text-decoration', lineThrough)
				.click()
				.should('have.css', 'text-decoration', lineThrough);
		})

		it('name is editable', () => {
			const editedName = 'new name for existing item';

			page.findByText(editedName).should('not.exist');
			page.item.should('not.have.attr', 'contenteditable');

			page.editButton.click();

			page.item
				.should('have.attr', 'contenteditable', 'true')
			  .type('{selectall}{backspace}')
				.type(editedName);

			page.saveButton.click();

			page.findByText(editedName).should('exist');
			page.editButton.should('be.visible');
			page.saveButton.should('not.be.visible');
		})

		it('can be deleted', () => {
			page.items
				.should('have.length', 3)
				.then($item => {
					const deletedItemName = $item.text();

					page.deleteButton.click();
					page.waitForReload();

					page.items
						.should('have.length', 2)
						.then($otherItem => {
							const remainingItemName = $otherItem.text();
							expect(remainingItemName).to.not.equal(deletedItemName);
						});
				});
		})
	})

	context('adding', () => {
		it('new item to groceries list', () => {
			const newItem = 'my new item name';
			page.findByText(newItem).should('not.exist');

			page.addTextField.type(newItem);
			page.addButton.click();
			page.waitForReload();

			page.findByText(newItem).should('exist');
		})

		it.skip('does not allow blank items', () => {
			page.items.should('have.length', 3);
			page.addButton.click();
			page.waitForReload();
			page.items.should('have.length', 3);
		})
	})
})
