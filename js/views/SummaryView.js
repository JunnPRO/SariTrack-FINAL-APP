
import View from './View.js';

class SummaryView extends View {
  _parentElement = document.querySelector('.summary-panel');

  _generateMarkup() {
    const { totalSales, transactionCount, lowStock } = this._data;

    return `
      <h2>Sales Summary</h2>

      <div class="summary-item">
        <h3>Total Sales</h3>
        <p>₱${totalSales.toFixed(2)}</p>
      </div>

      <div class="summary-item">
        <h3>Transactions</h3>
        <p>${transactionCount}</p>
      </div>

      <div class="low-stock">
        <h3>Low Stock Warning</h3>

        ${
          lowStock.length === 0
            ? '<p>No low-stock products.</p>'
            : lowStock.map(product => `
                <p>
                  ${this._escape(product.name)} -
                  ${product.stock} remaining
                </p>
              `).join('')
        }
      </div>
    `;
  }
}

export default new SummaryView();
