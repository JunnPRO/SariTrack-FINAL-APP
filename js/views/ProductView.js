// VIEW (Member 1): shows the product list, the form's error message, and the
// edit/delete buttons. RULES: extends View, never imports the model,
// never changes state.

import View from './View.js';

class ProductView extends View {
  _parentElement = document.querySelector('.product-list');
  _form = document.querySelector('.product-form');
  _errorElement = document.querySelector('.product-error');
  // [ADDED - Member 1] elements used for edit mode
  _idField = document.querySelector('.product-form [name="id"]');
  _submitButton = document.querySelector('.product-form .btn-submit');
  _cancelButton = document.querySelector('.product-form .btn-cancel');
  _editBanner = document.querySelector('.edit-banner'); // [ADDED - bug fix]

  constructor() {
    super();
    // [ADDED - Member 1] Cancel only changes the form's look, so the view handles it alone.
    this._cancelButton.addEventListener('click', () => this.clearForm());
  }

  // The controller subscribes here; the view only passes the form data along.
  addHandlerSubmit(handler) {
    this._form.addEventListener('submit', e => {
      e.preventDefault();
      handler(Object.fromEntries(new FormData(this._form)));
    });
  }

  // [ADDED - Member 1] Event delegation: one listener on the list catches every Edit button.
  addHandlerEdit(handler) {
    this._parentElement.addEventListener('click', e => {
      const btn = e.target.closest('[data-action="edit"]');
      if (!btn) return;
      handler(Number(btn.dataset.id));
    });
  }

  // [ADDED - Member 1] Same idea for Delete; the view asks the user to confirm first.
  addHandlerDelete(handler) {
    this._parentElement.addEventListener('click', e => {
      const btn = e.target.closest('[data-action="delete"]');
      if (!btn) return;
      const name = btn.closest('.product-item').querySelector('strong').textContent;
      if (!window.confirm(`Delete "${name}"?`)) return;
      handler(Number(btn.dataset.id));
    });
  }

  renderError(message) {
    this._errorElement.textContent = message;
    this._errorElement.hidden = false;
  }

  clearError() {
    this._errorElement.textContent = '';
    this._errorElement.hidden = true;
  }

  // [CHANGED - Member 1] Also leaves edit mode.
  clearForm() {
    this._form.reset();
    this._idField.value = ''; // [CHANGED - bug fix] reset() does NOT clear hidden inputs
    this._setEditMode(false);
    this._form.querySelector('[name="name"]').focus();
  }

  // [ADDED - Member 1] Puts a product's values in the form and switches to edit mode.
  fillForm(product) {
    this.clearError();
    this._idField.value = product.id;
    this._form.querySelector('[name="name"]').value = product.name;
    this._form.querySelector('[name="price"]').value = product.price;
    this._form.querySelector('[name="stock"]').value = product.stock;
    this._setEditMode(true, product.name); // [CHANGED - bug fix] pass the name for the banner
    this._form.querySelector('[name="name"]').focus();
  }

  // [ADDED - Member 1] Switches the button text and shows/hides Cancel.
  // [CHANGED - bug fix] Also shows a banner and highlights the form while editing,
  // so the user knows pressing the button will change that product, not add a new one.
  _setEditMode(isEditing, name = '') {
    this._submitButton.textContent = isEditing ? 'Save changes' : 'Add product';
    this._cancelButton.hidden = !isEditing;
    this._form.classList.toggle('product-form--editing', isEditing);
    this._editBanner.hidden = !isEditing;
    this._editBanner.textContent = isEditing
      ? `Editing "${name}". Press Cancel to add a new product instead.`
      : '';
  }

  _generateMarkup() {
    if (!this._data.length)
      return '<p class="empty-message">No products yet. Add one above.</p>';
    return this._data.map(p => this._generateItem(p)).join('');
  }

  // [CHANGED - Member 1] Each item now has Edit and Delete buttons (no inline onclick).
  _generateItem(p) {
    return `
      <div class="product-item" data-id="${p.id}">
        <div>
          <strong>${this._escape(p.name)}</strong>
          <div class="product-item__meta">₱${p.price.toFixed(2)} · stock: ${p.stock}</div>
        </div>
        <div class="product-item__actions">
          <button type="button" data-action="edit" data-id="${p.id}">Edit</button>
          <button type="button" data-action="delete" data-id="${p.id}">Delete</button>
        </div>
      </div>`;
  }

  // Stops a typed name like <b> from being read as HTML.
  _escape(text) {
    const el = document.createElement('div');
    el.textContent = text;
    return el.innerHTML;
  }
}

export default new ProductView();
 