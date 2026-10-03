import * as model from "./model.js";
import searchView from "./views/SearchView.js";
import resultsView from "./views/ResultsView.js";

const $ = (s) => document.querySelector(s);
const peso = (n) => "₱" + Math.round(n).toLocaleString();

let selectedId = null;
let occupants = 1;

const markSelected = () =>
  document.querySelectorAll(".card").forEach((c) => c.setAttribute("aria-pressed", c.dataset.id === selectedId));

const updateBreakdown = () => {
  const l = model.state.listings.find((x) => x.id === selectedId);
  if (!l) return;
  const p = Number($("#occupants-demo").value);
  const ok = Number.isInteger(p) && p >= 1 && p <= l.maxOccupants;

  $("#detail-error").style.display = ok ? "none" : "block";
  $("#detail-breakdown").style.display = ok ? "grid" : "none";
  if (!ok) return ($("#detail-error").textContent = `Must be between 1 and ${l.maxOccupants} occupants.`);

  const u = l.utilitiesIncluded ? 0 : Object.values(l.estimatedUtilities || {}).reduce((a, b) => a + b, 0) / p;
  const f = $("#transport-demo").checked ? l.fareOneWay * 44 : 0;
  const r = l.monthlyRent / p;

  $("#rent-val").textContent = peso(r);
  $("#utilities-val").textContent = peso(u);
  $("#transport-val").textContent = peso(f);
  $("#total-val").textContent = peso(r + u + f);
};

const renderDetail = (l) => {
  $("#detail-empty").style.display = "none";
  $("#detail-content").style.display = "block";
  $("#detail-name").textContent = l.name;
  $("#detail-where").textContent = `${l.barangay} · ${peso(l.monthlyRent)} / month`;
  $("#occupants-demo").max = l.maxOccupants;
  $("#occupants-demo").value = occupants;
  $("#transport-demo").checked = false;
  updateBreakdown();
};

// CONTROLLERS

const resultsController = () => {
  // TODO 2: update the count, render the filtered listings,
  //         then re-mark the selected card
  searchView.renderCount(model.state.filtered.length);
  resultsView.render(model.state.filtered);
  markSelected();
};

const selectController = (id) => {
  // TODO 3: save selectedId, find the listing (guard!),
  //         set occupants, mark the card, render the detail
  selectedId = id;
  const listing = model.state.listings.find((item) => item.id === id);
  if (!listing) return;

  occupants = listing.maxOccupants;
  markSelected();
  renderDetail(listing);
};

const searchController = (term) => {
  model.setSearchTerm(term);
  // TODO 4: call the right controller
  resultsController();
};

const maxRentController = (value) => {
  model.setMaxRent(value);
  // TODO 4
  resultsController();
};

const init = () => {
  // TODO 5: subscribe every handler, then do the first render
  searchView.addSearchHandler(searchController);
  searchView.addMaxRentHandler(maxRentController);
  searchView.addFormHandler();

  $(".results__list").addEventListener("click", (e) => {
    const card = e.target.closest(".card");
    if (card) selectController(card.dataset.id);
  });

  $("#occupants-demo").addEventListener("input", updateBreakdown);
  $("#transport-demo").addEventListener("change", updateBreakdown);

  resultsController();
};

init();