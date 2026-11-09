// VIEW (Member 2): the sales form, the live total and the sale error message.
// [ADDED - Member 2] whole file.
// RULES: extends View, never imports the model, never changes state.

import View from './View.js';

class SalesView extends View {
  // The product dropdown is the element this view renders into.
  _parentElement = document.querySelector('.sales-product');
  _form = document.querySelector('.sales-form');
  _qtyField = document.querySelector('.sales-form [name="qty"]');
  _totalElement = document.querySelector('.sale-total');
  _errorElement = document.querySelector('.sales-error');

  // Rebuilds the dropdown options but keeps the user's current choice.
  render(products) {
    const selected = this._parentElement.value;
    super.render(products);
    this._parentElement.value = selected; // falls back to '' if it no longer exists
  }

  // The controller subscribes here; fires whenever the product or quantity changes.
  
addHandlerInput(handler) {
  this._form.addEventListener('input', () => {
    this.clearError();
    handler(this.getInput());
  });
}

  addHandlerSubmit(handler) {
    this._form.addEventListener('submit', e => {
      e.preventDefault();
      handler(this.getInput());
    });
  }

  // Reads what the user has typed or chosen (the view never touches the model).
  getInput() {
    return {
      productId: this._parentElement.value,
      qty: this._qtyField.value,
    };
  }

  renderTotal(total) {
    this._totalElement.textContent = `Total: ₱${total.toFixed(2)}`;
  }

  renderError(message) {
    this._errorElement.textContent = message;
    this._errorElement.hidden = false;
  }

  clearError() {
    this._errorElement.textContent = '';
    this._errorElement.hidden = true;
  }

  clearForm() {
    this._form.reset();
    this.renderTotal(0);
  }

  _generateMarkup() {
    const options = this._data
      .map(
        p => `
        <option value="${p.id}" ${p.stock === 0 ? 'disabled' : ''}>
          ${this._escape(p.name)} (₱${p.price.toFixed(2)}, stock ${p.stock})
        </option>`
      )
      .join('');
    return `<option value="">Select a product</option>${options}`;
  }

  _escape(text) {
    const el = document.createElement('div');
    el.textContent = text;
    return el.innerHTML;
  }
}

export default new SalesView();
