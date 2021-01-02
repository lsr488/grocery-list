describe('Grocery List', () => {
  beforeEach(() => {
    cy.visit('src/index.html');
  })

	context('an item', () => {
		beforeEach(() => {
			createSecondItemAlias();
		})

		it('can be marked as purchased by tapping its name', () => {
			const lineThrough = 'line-through solid rgb(0, 0, 0)';
			cy.get('@secondItem').should('not.have.css', 'text-decoration', lineThrough);
			cy.get('@secondItem').click();
			cy.get('@secondItem').should('have.css', 'text-decoration', lineThrough);
		})

		it('name is editable', () => {
			const editedName = 'new name for existing item';
			cy.findByText(editedName).should('not.exist');

			cy.get('@secondItem').next(':contains("E")').click();
			cy.get('@secondItem').clear().type(editedName);
			cy.get('@secondItem').nextAll(':contains("S")').first().click(); // Why doesn't next work?

			cy.findByText(editedName).should('exist');
			cy.get('@secondItem').next(':contains("E")').should('be.visible');
			cy.get('@secondItem').nextAll(':contains("S")').should('not.be.visible');
		})

		it('can be deleted', () => {
			cy.get('@items').should('have.length', 3);

			cy.get('@secondItem').then($item => {
				const deletedItemName = $item.text();

				cy.get('@secondItem').nextAll(':contains("X")').first().click();
				cy.get('@items').should('have.length', 2);

				cy.get('@secondItem').then($otherItem => {
					const remainingItemName = $otherItem.text();
					expect(remainingItemName).to.not.equal(deletedItemName);
				});
			});

		})
	})

	context('adding', () => {
		it('new item to groceries list', () => {
			const newItem = 'my new item name';
			cy.findByText(newItem).should('not.exist');

			createSectionAlias('Add New Item');
			withinSection('Add New Item', () => cy.findByRole('textbox').type(newItem));
			cy.findByText('Add').click();

			cy.findByText(newItem).should('exist');
		})

		it.skip('does not allow blank items', () => {
			createSectionAlias('Groceries');
			createItemsAlias();

			cy.get('@items').should('have.length', 3);
			cy.findByText('Add').click();
			cy.get('@items').should('have.length', 3);
		})
	})
})

function createSectionAlias(headingText) {
	return cy.findByText(headingText).closest('div').as(headingText);
}

function withinSection(headingText, cypressFuncs) {
	return cy.get(`@${headingText}`).within(cypressFuncs);
}

function createSecondItemAlias() {
	createSectionAlias('Groceries');
	createItemsAlias();
	return cy.get('@items').eq(1).as('secondItem');
}

function createItemsAlias() {
	return cy.get('@Groceries').findAllByRole('listitem').as('items');
}

/*
 * roles: https://www.w3.org/TR/html-aria/#allowed-aria-roles-states-and-properties
 */
