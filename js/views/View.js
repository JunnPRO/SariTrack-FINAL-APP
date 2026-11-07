// PLACEHOLDER base View. Replace the contents with the Week 5 View class
// from your course materials, then keep every view extending it.
export default class View {
  _parentElement;
  _data;

  render(data) {
    this._data = data;
    const markup = this._generateMarkup();
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  _clear() {
    this._parentElement.innerHTML = '';
  }

  _generateMarkup() {
    return '';
  }
}
