// CONTROLLER: the only layer that talks to both the model and the views.
// RULES: wire user actions to model changes and re-renders; never build HTML here.

import * as model from './model.js';
import productView from './views/ProductView.js';
import salesView from './views/SalesView.js';

// Re-draws everything on the screen after any change.
// Member 3: add the summary and history renders here.
const refreshAll = function () {
  productView.render(model.state.products);
  salesView.render(model.state.products);
  // keep the live total correct if a price or stock just changed
  controlSaleInput(salesView.getInput());
};

// ---- Products (Member 1) ----
const controlAddProduct = function (formData) {
  const error = model.validateProduct(formData);
  if (error) {
    productView.renderError(error);
    return;
  }
  productView.clearError();
  model.addProduct(formData);
  refreshAll(); // [CHANGED - Member 1] was productView.render(...) only
  productView.clearForm();
};

// [ADDED - Member 1] Edit button clicked: fetch the product and fill the form.
const controlStartEdit = function (id) {
  const product = model.getProduct(id);
  if (product) productView.fillForm(product);
};

// [ADDED - Member 1] Form submitted in edit mode.
const controlEditProduct = function (formData) {
  const id = Number(formData.id);
  const error = model.validateProduct(formData, id);
  if (error) {
    productView.renderError(error);
    return;
  }
  if (!model.editProduct(id, formData)) {
    productView.renderError('That product no longer exists.');
    return;
  }
  productView.clearError();
  refreshAll();
  productView.clearForm();
};

// [ADDED - Member 1] One form, two modes: a filled hidden id means "edit".
const controlSaveProduct = function (formData) {
  if (formData.id) controlEditProduct(formData);
  else controlAddProduct(formData);
};

// [ADDED - Member 1] Delete confirmed in the view.
const controlDeleteProduct = function (id) {
  model.deleteProduct(id);
  refreshAll();
};

// ---- Sales (Member 2) ----

// [ADDED - Member 2] Runs on every keystroke/choice: recompute the total.
const controlSaleInput = function ({ productId, qty }) {
  salesView.renderTotal(model.calculateSaleTotal(productId, qty));
};

// [ADDED - Member 2] Sale form submitted: validate, record, refresh the screen.
const controlRecordSale = function (formData) {
  const error = model.validateSale(formData);
  if (error) {
    salesView.renderError(error);
    return;
  }
  salesView.clearError();
  model.recordSale(formData);
  refreshAll(); // stock changed, so products and the dropdown must update
  salesView.clearForm();
};

// Runs once when the page opens.
const init = function () {
  model.loadState(); // restore saved data after a page reload
  model.saveState(); // make sure the first visit is saved too

  refreshAll();
  productView.addHandlerSubmit(controlSaveProduct); // [CHANGED - Member 1]
  productView.addHandlerEdit(controlStartEdit); // [ADDED - Member 1]
  productView.addHandlerDelete(controlDeleteProduct); // [ADDED - Member 1]
  salesView.addHandlerInput(controlSaleInput); // [ADDED - Member 2]
  salesView.addHandlerSubmit(controlRecordSale); // [ADDED - Member 2]
  // Member 3 adds their handler lines here.
};

init();
