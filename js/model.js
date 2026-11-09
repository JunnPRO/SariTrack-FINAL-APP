// MODEL: holds all app data and the functions that change it.
// RULES: never touch the DOM and never import a view.

const STORAGE_KEY = 'saritrack-state';

// The one exported state object. Everything the app knows lives here.
// Field names are shared by the whole group, so don't rename them alone.
export const state = {
  products: [
    { id: 1, name: 'Lucky Me Pancit Canton', price: 15, stock: 40 },
    { id: 2, name: 'Coke Mismo', price: 20, stock: 24 },
    { id: 3, name: 'Safeguard Soap', price: 35, stock: 12 },
  ],
  sales: [
    {
      id: 1,
      productId: 1,
      productName: 'Lucky Me Pancit Canton', // snapshot, so old sales don't change
      unitPrice: 15, // snapshot of the price at the time of sale
      qty: 3,
      total: 45,
      date: '2026-11-03',
    },
  ],
};

// Save the current state to the browser's localStorage.
export const saveState = function () {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
};

// Load saved data (if any) into the state object.
// We change the properties in place because `state` is an exported const.
export const loadState = function () {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return;

  const data = JSON.parse(saved);
  state.products = data.products ?? [];
  state.sales = data.sales ?? [];
};

// ---- Products (Member 1) ----

// [ADDED - Member 1] Finds one product by id (used by edit and by sales).
export const getProduct = function (id) {
  return state.products.find(p => p.id === Number(id));
};

// Checks raw form data. Returns an error message, or '' if everything is valid.
// [CHANGED - Member 1] New optional ignoreId so editing a product does not
// count as a duplicate of itself.
export const validateProduct = function (data, ignoreId = null) {
  const name = String(data.name ?? '').trim();
  if (!name) return 'Product name is required.';

  if (
    state.products.some(
      p => p.id !== ignoreId && p.name.toLowerCase() === name.toLowerCase()
    )
  )
    return 'That product already exists.';

  if (String(data.price ?? '').trim() === '') return 'Price is required.';
  const price = Number(data.price);
  if (!Number.isFinite(price) || price <= 0) return 'Price must be greater than 0.';

  if (String(data.stock ?? '').trim() === '') return 'Stock is required.';
  const stock = Number(data.stock);
  if (!Number.isInteger(stock) || stock < 0)
    return 'Stock must be a whole number, 0 or more.';

  return '';
};

// Adds a new product to the state and saves it. Assumes the data was validated.
export const addProduct = function (data) {
  const product = {
    id: Math.max(0, ...state.products.map(p => p.id)) + 1, // never reuses an old id
    name: data.name.trim(),
    price: Number(data.price),
    stock: Number(data.stock),
  };
  state.products.push(product);
  saveState();
  return product;
};

// [ADDED - Member 1] Updates an existing product. Old sales keep their own
// name/price snapshot, so they do not change. Returns null if not found.
export const editProduct = function (id, data) {
  const product = getProduct(id);
  if (!product) return null;
  product.name = data.name.trim();
  product.price = Number(data.price);
  product.stock = Number(data.stock);
  saveState();
  return product;
};

// [ADDED - Member 1] Removes a product. Past sales stay in the history.
export const deleteProduct = function (id) {
  state.products = state.products.filter(p => p.id !== Number(id));
  saveState();
};

// ---- Sales (Member 2) ----

// [ADDED - Member 2] The derived value: price x quantity. Returns 0 when the
// input is not usable yet, so the screen can show it while the user types.
export const calculateSaleTotal = function (productId, qty) {
  const product = getProduct(productId);
  const quantity = Number(qty);

  if (!product || !Number.isFinite(quantity) || quantity <= 0) {
    return 0;
  }

  return Math.round(product.price * quantity * 100) / 100;
};

// [ADDED - Member 2] Checks a sale. Returns an error message, or '' if valid.
export const validateSale = function (data) {
  if (!data.productId) return 'Please choose a product.';

  const product = getProduct(data.productId);
  if (!product) return 'That product no longer exists.';
  if (product.stock === 0) return `${product.name} is out of stock.`;

  if (String(data.qty ?? '').trim() === '') return 'Quantity is required.';
  const qty = Number(data.qty);
  if (!Number.isInteger(qty) || qty <= 0)
    return 'Quantity must be a whole number greater than 0.';
  if (qty > product.stock) return `Only ${product.stock} left in stock.`;

  return '';
};

// [ADDED - Member 2] Records a sale: lowers the stock, stores a snapshot of the
// product name and price, and saves. Assumes the data was validated.
export const recordSale = function (data) {
  const product = getProduct(data.productId);
  const qty = Number(data.qty);

  product.stock -= qty;

  const sale = {
    id: Math.max(0, ...state.sales.map(s => s.id)) + 1,
    productId: product.id,
    productName: product.name,
    unitPrice: product.price,
    qty,
    total: calculateSaleTotal(product.id, qty),
    date: new Date().toLocaleDateString('en-CA'), // local date as YYYY-MM-DD
  };
  state.sales.push(sale);
  saveState();
  return sale;
};

// ---- Summary and History (Member 3) ----

// Get total sales
export const getTotalSales = function () {
  return state.sales.reduce((total, sale) => total + sale.total, 0);
};

// Count transactions
export const getTransactionCount = function () {
  return state.sales.length;
};

// Get products with stock of 5 or below
export const getLowStock = function () {
  return state.products.filter(product => product.stock <= 5);
};

// Void a sale and restore stock
export const voidSale = function (id) {
  const sale = state.sales.find(s => s.id === Number(id));

  if (!sale) return false;

  const product = getProduct(sale.productId);

  if (product) {
    product.stock += sale.qty;
  }

  state.sales = state.sales.filter(s => s.id !== Number(id));

  saveState();
  return true;
};
