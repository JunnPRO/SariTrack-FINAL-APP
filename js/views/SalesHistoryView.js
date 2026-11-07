
import View from './View.js';

class SalesHistoryView extends View {
  _parentElement = document.querySelector('.history-panel');

  // Listen for Void button clicks
  addHandlerVoid(handler) {
    this._parentElement.addEventListener('click', e => {
      const button = e.target.closest('.btn-void');

      if (!button) return;

      handler(Number(button.dataset.id));
    });
  }

  _generateMarkup() {
    if (this._data.length === 0) {
      return `
        <h2>Sales History</h2>
        <p>No sales recorded yet.</p>
      `;
    }

    return `
      <h2>Sales History</h2>

      <div class="history-list">
        ${this._data.map(sale => `
          <div class="history-item">
            <h3>${this._escape(sale.productName)}</h3>

            <p>Quantity: ${sale.qty}</p>
            <p>Unit Price: ₱${sale.unitPrice.toFixed(2)}</p>
            <p>Total: ₱${sale.total.toFixed(2)}</p>
            <p>Date: ${this._escape(sale.date)}</p>

            <button
              type="button"
              class="btn-void"
              data-id="${sale.id}">
              Void Sale
            </button>
          </div>
        `).join('')}
      </div>
    `;
  }
}

export default new SalesHistoryView();
