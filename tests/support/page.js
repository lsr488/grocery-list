const cypressGetters = {
	get: function(page, prop, _receiver) {
		// If Page specifically defines this, pass through to page object.
		const pageFuncNames = Object.getOwnPropertyNames(Page.prototype);
		if (pageFuncNames.includes(prop)) {
			const pageFunc = page[prop];
			return (...args) => pageFunc.apply(page, args);
		}

		// If we don't have a creator func for this, pass through to 'cy' object.
		const creatorFuncName = `${prop}Alias`;
		if (!page.cypressAliasCreators[creatorFuncName]) {
			const cypressFuncName = prop;
			const cypressFunc = cy[cypressFuncName];
			return (...args) => cypressFunc.apply(cy, args);
		}

		// Otherwise, create & return the Cypress alias for the requested element.
		const aliasName = prop;
		if (!page.aliasedElements[aliasName]) {
			page.cypressAliasCreators[creatorFuncName]();
			page.aliasedElements[aliasName] = true;
		}
		return cy.get(`@${aliasName}`);
	}
};

class Page {
	aliasedElements = {}

	cypressAliasCreators = {
		_textToAlias: function(text) {
			return text.substring(0, 1).toLowerCase() +
						 text.substring(1).replace(/[^a-z]/ig, '');
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

	visit(url) {
		this.reset();
		cy.visit(url);
		cy.intercept(url).as('pageReload');
	}

	reset() {
		Object.keys(this.aliasedElements).forEach(key => {
			delete this.aliasedElements[key];
		});
	}

	addAliasCreators(extraAliasCreators) {
		Object.assign(this.cypressAliasCreators, extraAliasCreators);
	}

	waitForReload() {
		this.reset(); // because page reloads create new DOM elements
		cy.wait('@pageReload');
	}
}

const page = new Page();

const pageProxy = new Proxy(page, cypressGetters);

export { pageProxy as page };
