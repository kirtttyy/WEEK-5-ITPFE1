import View from "./View.js";

class DetailView extends View {
  _parentElement = document.querySelector(".detail");
  _errorMessage = "That listing could not be found.";

  _peso = new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    maximumFractionDigits: 0,
  });

  renderError(message = this._errorMessage) {
    const markup = `<p class="error">${message}</p>`;
    this._clear();
    this._parentElement.insertAdjacentHTML("afterbegin", markup);
  }

  _generateBreakdownMarkup(breakdown) {
    if (!breakdown) return "";

    if (breakdown.error) {
      return `<p class="error">${breakdown.error}</p>`;
    }

    const { rentPerHead, utilitiesPerHead, transportPerHead, totalPerHead } =
      breakdown;

    return `
      <p class="breakdown__line">
        <span>Rent</span><span>${this._peso.format(rentPerHead)}</span>
      </p>
      <p class="breakdown__line">
        <span>Utilities</span><span>${this._peso.format(utilitiesPerHead)}</span>
      </p>
      <p class="breakdown__line">
        <span>Transport</span><span>${this._peso.format(transportPerHead)}</span>
      </p>
      <p class="breakdown__total">
        <span>Per person</span><span>${this._peso.format(totalPerHead)}</span>
      </p>
    `;
  }

  _generateMarkup() {
    const { listing, occupants, includeTransport, breakdown } = this._data;
    const { name, barangay, monthlyRent, maxOccupants } = listing;

    return `
      <h2 class="detail__name">${name}</h2>
      <p class="detail__where">${barangay} &middot; ${this._peso.format(monthlyRent)} / month</p>
      <fieldset class="splitter">
        <legend class="splitter__legend">Split the cost</legend>

        <div class="splitter__row">
          <label for="occupants-demo">Sharing with</label>
          <input
            class="field__input"
            type="number"
            id="occupants-demo"
            min="1"
            max="${maxOccupants}"
            value="${occupants}"
          />
        </div>

        <div class="splitter__row">
          <label for="transport-demo">Include daily fare</label>
          <input type="checkbox" id="transport-demo" ${includeTransport ? "checked" : ""} />
        </div>
      </fieldset>

      <div class="breakdown">
        ${this._generateBreakdownMarkup(breakdown)}
      </div>
    `;
  }

  updateBreakdown(breakdown) {
    const breakdownContainer = this._parentElement.querySelector(".breakdown");
    if (!breakdownContainer) return;
    breakdownContainer.innerHTML = this._generateBreakdownMarkup(breakdown);
  }

  addOccupantsHandler(handler) {
    this._parentElement.addEventListener("input", (e) => {
      if (e.target.id === "occupants-demo") {
        handler(Number(e.target.value));
      }
    });
  }

  addTransportHandler(handler) {
    this._parentElement.addEventListener("input", (e) => {
      if (e.target.id === "transport-demo") {
        handler(e.target.checked);
      }
    });
  }
}

export default new DetailView();
