import { page } from '../support/groceryListPage';

describe('Grocery List', () => {
	beforeEach(() => {
		page.visit('src/index.html');
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
