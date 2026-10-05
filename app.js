import * as model from "./model.js";
import searchView from "./views/SearchView.js";
import resultsView from "./views/ResultsView.js";
import detailView from "./views/DetailView.js";

// CONTROLLERS

const resultsController = () => {
  // TODO 2: update the count, render the filtered listings,
  //         then re-mark the selected card
  searchView.renderCount(model.state.filtered.length);
  resultsView.render(model.state.filtered);
  if (model.state.selectedId) {
    resultsView.markSelected(model.state.selectedId);
  }
};

const selectController = (id) => {
  // TODO 3: save selectedId, find the listing (guard!),
  //         set occupants, mark the card, render the detail
  model.setSelected(id);
  const listing = model.getSelectedListing();
  if (!listing) return;
  resultsView.markSelected(id);
  detailView.render({
    listing,
    occupants: model.state.occupants,
    includeTransport: model.state.includeTransport,
    breakdown: model.getBreakdown(),
  });
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

const occupantsController = (value) => {
  model.setOccupants(value);
  detailView.updateBreakdown(model.getBreakdown());
};

const transportController = (value) => {
  model.setTransport(value);
  detailView.updateBreakdown(model.getBreakdown());
};

const init = () => {
  // TODO 5: subscribe every handler, then do the first render
  searchView.addSearchHandler(searchController);
  searchView.addMaxRentHandler(maxRentController);
  searchView.addFormHandler();
  resultsView.addSelectHandler(selectController);
  detailView.addOccupantsHandler(occupantsController);
  detailView.addTransportHandler(transportController);
  resultsController();
};

init();
