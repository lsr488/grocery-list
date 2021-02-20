class Button {
	constructor(elementType, column, type, name, item) {
		this.elementType = elementType;
		this.column = column;
		this.type = type;
		this.name = name;
		this.item = item;
		this.itemId = item.id;
		this.element = this.createElement();

	  if(this.type === 'delete') {
		  this.element.addEventListener('click', this.delete.bind(this));
	  }
	  if(this.type === 'edit') {
	  	this.element.addEventListener('click', this.edit.bind(this));
	  }
	  if(this.type === 'save') {
	  	this.element.addEventListener('click', this.save.bind(this));	  	
	  }
	}

	createElement() {
		const button = document.createElement(this.elementType);
		button.classList.add('btn');
		button.classList.add(this.column);
		button.classList.add(this.type);
		button.textContent = this.name;	
		button.setAttribute('data-id', this.itemId);
		return button;		
	}

	hide() {
		this.element.classList.add("hidden");
		return this.element;
	}

	edit() {
		this.item.editingItem();

		const saveBtn = document.querySelector(`.save[data-id="${this.item.id}"]`);
		const deleteBtn = document.querySelector(`.delete[data-id="${this.item.id}"]`);

		saveBtn.classList.remove("hidden");
		deleteBtn.classList.add("hidden");
		this.hide();
	}

	save() {
		this.item.savingItem();

		const editBtn = document.querySelector(`.edit[data-id="${this.item.id}"]`);
		const deleteBtn = document.querySelector(`.delete[data-id="${this.item.id}"]`);

		editBtn.classList.remove("hidden");
		deleteBtn.classList.remove("hidden");
		this.hide();
	}

	delete() {
		this.item.deletingItem();
	}
}
