const aliasedElements = {
	reset: function() {
		Object.keys(this).forEach(key => {
			if (key !== 'reset') delete this[key];
		});
	}
};

const cypressAliasCreators = {
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

		if ('reset' === prop) {
			return () => aliasedElements.reset();
		}

		if ('addAliasCreators' === prop) {
			return (extraAliasCreators) => {
				Object.assign(cypressAliasCreators, extraAliasCreators);
			};
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

export const page = new Proxy(aliasedElements, cypressGetters);
