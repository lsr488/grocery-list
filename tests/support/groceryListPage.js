import { page } from '../support/page';

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
		const alias = this._textToAlias(headingText);
		cy.findByText(headingText).closest('div').as(alias);
	},
};

page.addAliasCreators(cypressAliasCreators);

export { page };
