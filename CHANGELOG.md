# Changelog: work added by Claude for Members 1 and 2

Search the code for `[ADDED` or `[CHANGED` to find every line. Remove these labels before final submission if you want cleaner code.
Disclose this in Section 11 of the report. Members must be able to explain every line listed under their name.

## Member 1 (Products)
| File | What | Label |
|---|---|---|
| model.js | `getProduct()`, `editProduct()`, `deleteProduct()` | ADDED |
| model.js | `validateProduct(data, ignoreId)`: editing no longer counts as a duplicate | CHANGED |
| views/ProductView.js | `addHandlerEdit`, `addHandlerDelete`, `fillForm`, `_setEditMode`, Cancel button, Edit/Delete buttons in each item | ADDED / CHANGED |
| controller.js | `controlStartEdit`, `controlEditProduct`, `controlSaveProduct`, `controlDeleteProduct`, `refreshProducts` | ADDED |
| controller.js | `controlAddProduct` now calls `refreshProducts()`; the form handler is `controlSaveProduct` | CHANGED |
| index.html | hidden `id` field, Cancel button, `btn-submit` class | ADDED |
| css/style.css | edit/delete button styles | ADDED |

## Member 2 (Sales)
| File | What | Label |
|---|---|---|
| model.js | `calculateSaleTotal`, `validateSale`, `recordSale` | ADDED |
| views/SalesView.js | whole file: dropdown render, `addHandlerInput`, `addHandlerSubmit`, `getInput`, `renderTotal`, error and clear methods | ADDED |
| controller.js | `controlSaleInput`, `controlRecordSale` and their wiring in `init()` | ADDED |
| index.html | sales form and error area | ADDED |
| css/style.css | sales form styles | ADDED |

## Bug fix: "adding a product replaces another product"
Cause: `form.reset()` does not clear the hidden `id` input, so after any Edit (saved or cancelled) the form still held that product's id and the next "add" saved over it. Also the edit mode was easy to miss.
Fix: `clearForm()` now sets `_idField.value = ''`. Plus (label `[ADDED - bug fix]` / `[CHANGED - bug fix]`): `ProductView._setEditMode()` now shows a banner and highlights the form while editing; index.html has the `.edit-banner` element; style.css has the styles.

## Not done (needs you)
- Replace the placeholder `views/View.js` with the Week 5 base View class (check that `render()` and `_clear()` names match).
- Create the GitHub repo, add collaborators, and deploy to GitHub Pages.
- Member 3's summary, history and void sale are still to do (placeholders are marked in controller.js and index.html).
