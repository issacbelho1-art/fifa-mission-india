/* =========================================================
   COACH MATCHES PAGE
   File: coach-matches.js
========================================================= */

"use strict";


/* =========================================================
   DOM HELPERS
========================================================= */

const matchPage = {
  body: document.body,

  get(selector, parent = document) {
    return parent.querySelector(selector);
  },

  getAll(selector, parent = document) {
    return [...parent.querySelectorAll(selector)];
  }
};


/* =========================================================
   PAGE STATE
========================================================= */

const coachMatchState = {
  activeFilter: "all",
  activeMatchId: null,
  pendingDeleteId: null,
  activeDrawerTab: "overview",
  selectedSquad: new Map(),
  visibleMatchCount: 6,
  calendarDate: new Date(2026, 6, 1),
  opponentLogoUrl: null
};


/* =========================================================
   MATCH DATA PLACEHOLDER
========================================================= */

/*
  Backend integration for Mr. Harsh:

  Replace this frontend placeholder data with:

  GET /api/coach/matches
*/

const coachMatches = [
  {
    id: "match-001",
    title: "U-17 League Matchday 8",
    competition: "U-17 League",
    opponent: "Rising Stars Academy",
    status: "upcoming",
    date: "2026-07-19",
    time: "16:00",
    venue: "National Football Ground",
    locationType: "home",
    squadCount: 18
  },

  {
    id: "match-002",
    title: "Academy Cup Quarter Final",
    competition: "Academy Cup",
    opponent: "Elite Football Centre",
    status: "upcoming",
    date: "2026-07-24",
    time: "15:30",
    venue: "District Sports Complex",
    locationType: "away",
    squadCount: 17
  },

  {
    id: "match-003",
    title: "Development Friendly",
    competition: "Friendly Match",
    opponent: "Future Stars FC",
    status: "upcoming",
    date: "2026-07-29",
    time: "14:00",
    venue: "Mission India Training Ground",
    locationType: "home",
    squadCount: 15
  },

  {
    id: "match-004",
    title: "District Championship",
    competition: "District Championship",
    opponent: "United Youth Academy",
    status: "draft",
    date: "2026-08-03",
    time: "15:00",
    venue: "City Football Stadium",
    locationType: "neutral",
    squadCount: 0
  },

  {
    id: "match-005",
    title: "U-17 League Matchday 7",
    competition: "U-17 League",
    opponent: "Young Warriors FC",
    status: "completed",
    date: "2026-07-12",
    time: "16:00",
    venue: "National Football Ground",
    locationType: "home",
    squadCount: 18
  },

  {
    id: "match-006",
    title: "Academy Cup Round of 16",
    competition: "Academy Cup",
    opponent: "City Football Academy",
    status: "completed",
    date: "2026-07-06",
    time: "15:30",
    venue: "District Sports Complex",
    locationType: "away",
    squadCount: 18
  }
];


/* =========================================================
   AVAILABLE PLAYER DATA
========================================================= */

/*
  Backend integration:

  GET /api/coach/players?availability=match
*/

const availableMatchPlayers = [
  {
    id: "player-001",
    name: "Aman Singh",
    position: "Forward",
    number: 9,
    image: "images/player-1.jpg",
    availability: "available"
  },

  {
    id: "player-002",
    name: "Rohit Das",
    position: "Midfielder",
    number: 8,
    image: "images/player-2.jpg",
    availability: "available"
  },

  {
    id: "player-003",
    name: "Kabir Ali",
    position: "Goalkeeper",
    number: 1,
    image: "images/player-3.jpg",
    availability: "available"
  },

  {
    id: "player-004",
    name: "Aditya Kumar",
    position: "Defender",
    number: 4,
    image: "images/player-4.jpg",
    availability: "available"
  },

  {
    id: "player-005",
    name: "Nikhil Rai",
    position: "Defender",
    number: 2,
    image: "images/player-5.jpg",
    availability: "doubtful"
  },

  {
    id: "player-006",
    name: "Sahil Mehta",
    position: "Midfielder",
    number: 10,
    image: "images/player-6.jpg",
    availability: "unavailable"
  }
];


/* =========================================================
   INITIALIZE PAGE
========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  initializeMatchFilters();
  initializeMatchSearch();
  initializeMatchSort();
  initializeMatchMenus();
  initializeCreateMatchModal();
  initializeSquadModal();
  initializePreparationDrawer();
  initializeMatchReportModal();
  initializeDeleteModal();
  initializeLogoutModal();
  initializeCharacterCounters();
  initializeCalendar();
  initializeLoadMore();
  initializeRatingSliders();
  initializeGoalScorers();
  initializeMatchActionDelegation();
  initializeKeyboardControls();
});


/* =========================================================
   FILTER MATCH CARDS
========================================================= */

function initializeMatchFilters() {
  const filterButtons = matchPage.getAll(
    ".matches-filter-tab, [data-match-filter]"
  );

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const filter =
        button.dataset.matchFilter ||
        button.dataset.filter ||
        button.textContent.trim().toLowerCase();

      coachMatchState.activeFilter = normalizeFilter(filter);

      filterButtons.forEach((item) => {
        item.classList.remove("active");
        item.setAttribute("aria-pressed", "false");
      });

      button.classList.add("active");
      button.setAttribute("aria-pressed", "true");

      applyMatchFilters();
    });
  });
}


function normalizeFilter(filter) {
  const value = String(filter).toLowerCase();

  if (value.includes("upcoming")) {
    return "upcoming";
  }

  if (value.includes("completed")) {
    return "completed";
  }

  if (value.includes("draft")) {
    return "draft";
  }

  return "all";
}


/* =========================================================
   SEARCH MATCH CARDS
========================================================= */

function initializeMatchSearch() {
  const searchInput =
    matchPage.get("#matchesSearch") ||
    matchPage.get(".matches-search-box input");

  if (!searchInput) {
    return;
  }

  searchInput.addEventListener(
    "input",
    debounce(() => {
      applyMatchFilters();
    }, 200)
  );
}


/* =========================================================
   SORT MATCH CARDS
========================================================= */

function initializeMatchSort() {
  const sortSelect =
    matchPage.get("#matchesSort") ||
    matchPage.get("[data-match-sort]") ||
    matchPage.get(".matches-toolbar-controls select");

  if (!sortSelect) {
    return;
  }

  sortSelect.addEventListener("change", () => {
    sortMatchCards(sortSelect.value);
  });
}


function sortMatchCards(sortType) {
  const grid = matchPage.get("#matchesGrid");

  if (!grid) {
    return;
  }

  const cards = matchPage.getAll(".match-card", grid);

  cards.sort((firstCard, secondCard) => {
    const firstDate = getMatchCardDate(firstCard);
    const secondDate = getMatchCardDate(secondCard);

    switch (sortType) {
      case "oldest":
      case "date-oldest":
        return firstDate - secondDate;

      case "opponent":
      case "alphabetical":
        return getCardOpponent(firstCard).localeCompare(
          getCardOpponent(secondCard)
        );

      case "latest":
      case "date-latest":
      default:
        return secondDate - firstDate;
    }
  });

  cards.forEach((card) => {
    grid.appendChild(card);
  });
}


function getMatchCardDate(card) {
  const dateValue =
    card.dataset.matchDate ||
    card.dataset.date ||
    card.getAttribute("data-match-date");

  const parsedDate = new Date(dateValue || 0);

  return Number.isNaN(parsedDate.getTime())
    ? new Date(0)
    : parsedDate;
}


function getCardOpponent(card) {
  return (
    card.dataset.opponent ||
    matchPage.get(".match-card-team:last-child strong", card)?.textContent ||
    ""
  ).trim();
}


/* =========================================================
   APPLY ACTIVE FILTERS
========================================================= */

function applyMatchFilters() {
  const cards = matchPage.getAll(".match-card");

  const searchInput =
    matchPage.get("#matchesSearch") ||
    matchPage.get(".matches-search-box input");

  const searchValue = searchInput
    ? searchInput.value.trim().toLowerCase()
    : "";

  let visibleCards = 0;

  cards.forEach((card, index) => {
    const cardStatus =
      card.dataset.status ||
      detectMatchStatus(card);

    const searchableText = card.textContent
      .replace(/\s+/g, " ")
      .trim()
      .toLowerCase();

    const matchesFilter =
      coachMatchState.activeFilter === "all" ||
      cardStatus === coachMatchState.activeFilter;

    const matchesSearch =
      !searchValue ||
      searchableText.includes(searchValue);

    const matchesLimit =
      index < coachMatchState.visibleMatchCount;

    const shouldDisplay =
      matchesFilter &&
      matchesSearch &&
      matchesLimit;

    card.hidden = !shouldDisplay;

    if (shouldDisplay) {
      visibleCards += 1;
    }
  });

  updateMatchesEmptyState(visibleCards);
}


function detectMatchStatus(card) {
  if (card.classList.contains("completed")) {
    return "completed";
  }

  if (card.classList.contains("draft")) {
    return "draft";
  }

  return "upcoming";
}


function updateMatchesEmptyState(visibleCards) {
  const emptyState = matchPage.get(".matches-empty-state");

  if (!emptyState) {
    return;
  }

  emptyState.hidden = visibleCards !== 0;
}


/* =========================================================
   MATCH CARD MENUS
========================================================= */

function initializeMatchMenus() {
  const menuButtons = matchPage.getAll(
    ".match-card-menu-button, [data-match-menu]"
  );

  menuButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      event.stopPropagation();

      const card = button.closest(".match-card");
      const dropdown =
        matchPage.get(".match-card-dropdown", card) ||
        button.nextElementSibling;

      closeAllMatchMenus(dropdown);

      if (!dropdown) {
        return;
      }

      const isOpen = dropdown.classList.toggle("active");

      button.classList.toggle("active", isOpen);
      button.setAttribute("aria-expanded", String(isOpen));
    });
  });

  document.addEventListener("click", () => {
    closeAllMatchMenus();
  });
}


function closeAllMatchMenus(exceptDropdown = null) {
  matchPage.getAll(".match-card-dropdown").forEach((dropdown) => {
    if (dropdown !== exceptDropdown) {
      dropdown.classList.remove("active");

      const card = dropdown.closest(".match-card");
      const button = matchPage.get(
        ".match-card-menu-button, [data-match-menu]",
        card
      );

      if (button) {
        button.classList.remove("active");
        button.setAttribute("aria-expanded", "false");
      }
    }
  });
}


/* =========================================================
   MATCH ACTION DELEGATION
========================================================= */

function initializeMatchActionDelegation() {
  document.addEventListener("click", (event) => {
    const actionButton = event.target.closest(
      "[data-match-action]"
    );

    if (!actionButton) {
      return;
    }

    const action = actionButton.dataset.matchAction;

    const card = actionButton.closest(".match-card");

    const matchId =
      actionButton.dataset.matchId ||
      card?.dataset.matchId ||
      null;

    coachMatchState.activeMatchId = matchId;

    closeAllMatchMenus();

    switch (action) {
      case "edit":
        openEditMatchModal(matchId);
        break;

      case "squad":
        openSquadModal(matchId);
        break;

      case "prepare":
      case "preparation":
        openPreparationDrawer(matchId);
        break;

      case "report":
        openMatchReportModal(matchId);
        break;

      case "delete":
      case "cancel":
        openDeleteModal(matchId, action);
        break;

      case "duplicate":
        duplicateMatch(matchId);
        break;

      case "view":
        showToast(
          "Match opened",
          "The full match detail page will connect to the backend later.",
          "info"
        );
        break;

      default:
        break;
    }
  });
}


/* =========================================================
   CREATE MATCH MODAL
========================================================= */

function initializeCreateMatchModal() {
  const modal = matchPage.get("#matchCreateModal");

  const form = matchPage.get("#matchCreateForm");

  const openButtons = matchPage.getAll(
    [
      "#createMatchButton",
      "#scheduleMatchButton",
      "#addMatchButton",
      ".match-schedule-add-button",
      "[data-open-create-match]"
    ].join(",")
  );

  openButtons.forEach((button) => {
    button.addEventListener("click", () => {
      openCreateMatchModal();
    });
  });

  if (!modal || !form) {
    return;
  }

  form.addEventListener("submit", handleMatchFormSubmit);

  const saveDraftButton = matchPage.get("#saveMatchDraft");

  if (saveDraftButton) {
    saveDraftButton.addEventListener("click", () => {
      saveMatchAsDraft();
    });
  }

  const logoInput = matchPage.get("#matchOpponentLogo");

  if (logoInput) {
    logoInput.addEventListener("change", handleOpponentLogoPreview);
  }

  initializeModalCloseButtons(modal);
}


function openCreateMatchModal() {
  const modal = matchPage.get("#matchCreateModal");

  const form = matchPage.get("#matchCreateForm");

  if (!modal || !form) {
    return;
  }

  form.reset();
  form.dataset.mode = "create";
  delete form.dataset.matchId;

  clearMatchFormErrors();

  const title = matchPage.get("#matchCreateModalTitle");

  if (title) {
    title.textContent = "Schedule a Match";
  }

  const submitButton = matchPage.get(
    ".match-modal-submit-button",
    form
  );

  if (submitButton) {
    submitButton.innerHTML = `
      <i class="fa-solid fa-calendar-plus"></i>
      Schedule Match
    `;
  }

  setMinimumMatchDate();
  clearOpponentLogoPreview();
  openModal(modal);
}


function openEditMatchModal(matchId) {
  const modal = matchPage.get("#matchCreateModal");

  const form = matchPage.get("#matchCreateForm");

  if (!modal || !form) {
    return;
  }

  const match = findMatchById(matchId);

  form.reset();
  form.dataset.mode = "edit";
  form.dataset.matchId = matchId || "";

  clearMatchFormErrors();

  const title = matchPage.get("#matchCreateModalTitle");

  if (title) {
    title.textContent = "Edit Match";
  }

  const submitButton = matchPage.get(
    ".match-modal-submit-button",
    form
  );

  if (submitButton) {
    submitButton.innerHTML = `
      <i class="fa-regular fa-floppy-disk"></i>
      Save Changes
    `;
  }

  if (match) {
    setFormValue("#matchTitle", match.title);
    setFormValue("#matchCompetition", mapCompetitionValue(match.competition));
    setFormValue("#matchOpponent", match.opponent);
    setFormValue("#matchDate", match.date);
    setFormValue("#matchKickoffTime", match.time);
    setFormValue("#matchVenue", match.venue);
    setFormValue("#matchLocationType", match.locationType);
    setFormValue("#matchStatus", match.status);
  }

  openModal(modal);
}


function handleMatchFormSubmit(event) {
  event.preventDefault();

  const form = event.currentTarget;

  const isValid = validateMatchForm(form);

  if (!isValid) {
    showToast(
      "Check match details",
      "Please complete all required fields before continuing.",
      "error"
    );

    return;
  }

  const formData = new FormData(form);

  const payload = Object.fromEntries(formData.entries());

  payload.matchId = form.dataset.matchId || null;
  payload.mode = form.dataset.mode || "create";

  /*
    Backend integration:

    CREATE:
    POST /api/coach/matches

    UPDATE:
    PUT /api/coach/matches/:matchId
  */

  console.log("Match form payload:", payload);

  closeModal(matchPage.get("#matchCreateModal"));

  showToast(
    form.dataset.mode === "edit"
      ? "Match updated"
      : "Match scheduled",
    form.dataset.mode === "edit"
      ? "The fixture details were updated successfully."
      : "The new fixture was added to the frontend schedule.",
    "success"
  );
}


function saveMatchAsDraft() {
  const form = matchPage.get("#matchCreateForm");

  if (!form) {
    return;
  }

  const titleInput = matchPage.get("#matchTitle");

  const opponentInput = matchPage.get("#matchOpponent");

  if (!titleInput?.value.trim() && !opponentInput?.value.trim()) {
    showToast(
      "Add basic details",
      "Enter a match title or opponent before saving a draft.",
      "warning"
    );

    return;
  }

  const formData = new FormData(form);

  const payload = Object.fromEntries(formData.entries());

  payload.status = "draft";

  /*
    Backend integration:

    POST /api/coach/matches
    body.status = "draft"
  */

  console.log("Draft match payload:", payload);

  closeModal(matchPage.get("#matchCreateModal"));

  showToast(
    "Draft saved",
    "The fixture draft was saved successfully.",
    "success"
  );
}


/* =========================================================
   MATCH FORM VALIDATION
========================================================= */

function validateMatchForm(form) {
  clearMatchFormErrors();

  const requiredFields = matchPage.getAll(
    "[required]",
    form
  );

  let isValid = true;

  requiredFields.forEach((field) => {
    if (!String(field.value).trim()) {
      setFieldError(field, "This field is required.");
      isValid = false;
    }
  });

  const matchDate = matchPage.get("#matchDate", form);

  if (matchDate?.value) {
    const selectedDate = new Date(`${matchDate.value}T00:00:00`);

    const today = new Date();

    today.setHours(0, 0, 0, 0);

    if (
      form.dataset.mode !== "edit" &&
      selectedDate < today
    ) {
      setFieldError(
        matchDate,
        "Select today or a future date."
      );

      isValid = false;
    }
  }

  const logoInput = matchPage.get("#matchOpponentLogo", form);

  if (logoInput?.files?.[0]) {
    const file = logoInput.files[0];

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp"
    ];

    if (!allowedTypes.includes(file.type)) {
      setFieldError(
        logoInput,
        "Upload a JPG, PNG or WebP image."
      );

      isValid = false;
    }

    if (file.size > 2 * 1024 * 1024) {
      setFieldError(
        logoInput,
        "The image must be smaller than 2 MB."
      );

      isValid = false;
    }
  }

  return isValid;
}


function setFieldError(field, message) {
  const wrapper =
    field.closest(".match-form-field") ||
    field.parentElement;

  field.setAttribute("aria-invalid", "true");

  const error = matchPage.get(
    ".match-field-error",
    wrapper
  );

  if (error) {
    error.textContent = message;
  }
}


function clearMatchFormErrors() {
  matchPage.getAll(".match-field-error").forEach((error) => {
    error.textContent = "";
  });

  matchPage.getAll("[aria-invalid='true']").forEach((field) => {
    field.removeAttribute("aria-invalid");
  });
}


/* =========================================================
   OPPONENT LOGO PREVIEW
========================================================= */

function handleOpponentLogoPreview(event) {
  const file = event.target.files?.[0];

  const preview = matchPage.get(
    "#matchOpponentLogoPreview"
  );

  if (!file || !preview) {
    clearOpponentLogoPreview();
    return;
  }

  if (coachMatchState.opponentLogoUrl) {
    URL.revokeObjectURL(
      coachMatchState.opponentLogoUrl
    );
  }

  coachMatchState.opponentLogoUrl =
    URL.createObjectURL(file);

  preview.innerHTML = `
    <div class="match-upload-preview-content">
      <img
        src="${coachMatchState.opponentLogoUrl}"
        alt="Opponent logo preview"
      />

      <div>
        <strong>${escapeHTML(file.name)}</strong>
        <span>${formatFileSize(file.size)}</span>
      </div>

      <button
        type="button"
        id="removeOpponentLogo"
        aria-label="Remove opponent logo"
      >
        <i class="fa-solid fa-xmark"></i>
      </button>
    </div>
  `;

  preview.hidden = false;

  matchPage
    .get("#removeOpponentLogo", preview)
    ?.addEventListener("click", () => {
      const input = matchPage.get("#matchOpponentLogo");

      if (input) {
        input.value = "";
      }

      clearOpponentLogoPreview();
    });
}


function clearOpponentLogoPreview() {
  const preview = matchPage.get(
    "#matchOpponentLogoPreview"
  );

  if (coachMatchState.opponentLogoUrl) {
    URL.revokeObjectURL(
      coachMatchState.opponentLogoUrl
    );

    coachMatchState.opponentLogoUrl = null;
  }

  if (preview) {
    preview.innerHTML = "";
    preview.hidden = true;
  }
}


/* =========================================================
   CHARACTER COUNTERS
========================================================= */

function initializeCharacterCounters() {
  initializeCharacterCounter(
    "#matchNotes",
    "#matchNotesCount"
  );

  initializeCharacterCounter(
    "#matchPreparationNotes",
    "#matchPreparationNotesCount"
  );
}


function initializeCharacterCounter(
  inputSelector,
  outputSelector
) {
  const input = matchPage.get(inputSelector);

  const output = matchPage.get(outputSelector);

  if (!input || !output) {
    return;
  }

  const updateCounter = () => {
    output.textContent =
      String(input.value.length);
  };

  input.addEventListener("input", updateCounter);

  updateCounter();
}


/* =========================================================
   GENERIC MODAL CONTROLS
========================================================= */

function openModal(modal) {
  if (!modal) {
    return;
  }

  closeAllMatchMenus();

  modal.classList.add("active");
  modal.setAttribute("aria-hidden", "false");

  matchPage.body.classList.add(
    "match-modal-open"
  );

  const dialog = matchPage.get(
    "[role='dialog']",
    modal
  );

  window.setTimeout(() => {
    dialog?.focus();
  }, 50);
}


function closeModal(modal) {
  if (!modal) {
    return;
  }

  modal.classList.remove("active");
  modal.setAttribute("aria-hidden", "true");

  const hasOpenModal = matchPage.get(
    ".match-modal-backdrop.active"
  );

  if (!hasOpenModal) {
    matchPage.body.classList.remove(
      "match-modal-open"
    );
  }
}


function initializeModalCloseButtons(modal) {
  matchPage
    .getAll("[data-close-match-modal]", modal)
    .forEach((button) => {
      button.addEventListener("click", () => {
        closeModal(modal);
      });
    });

  modal.addEventListener("click", (event) => {
    if (event.target === modal) {
      closeModal(modal);
    }
  });
}


/* =========================================================
   UTILITY FUNCTIONS
========================================================= */

function findMatchById(matchId) {
  return coachMatches.find(
    (match) => match.id === matchId
  );
}


function setFormValue(selector, value) {
  const field = matchPage.get(selector);

  if (!field || value === undefined || value === null) {
    return;
  }

  field.value = value;
}


function mapCompetitionValue(competition) {
  const competitionMap = {
    "U-17 League": "u17-league",
    "Academy Cup": "academy-cup",
    "Friendly Match": "friendly",
    "District Championship": "district-championship",
    Tournament: "tournament"
  };

  return competitionMap[competition] || "other";
}


function setMinimumMatchDate() {
  const input = matchPage.get("#matchDate");

  if (!input) {
    return;
  }

  const today = new Date();

  input.min = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, "0"),
    String(today.getDate()).padStart(2, "0")
  ].join("-");
}


function duplicateMatch(matchId) {
  const match = findMatchById(matchId);

  if (!match) {
    showToast(
      "Match unavailable",
      "The selected fixture could not be duplicated.",
      "error"
    );

    return;
  }

  openCreateMatchModal();

  setFormValue(
    "#matchTitle",
    `${match.title} Copy`
  );

  setFormValue(
    "#matchCompetition",
    mapCompetitionValue(match.competition)
  );

  setFormValue(
    "#matchOpponent",
    match.opponent
  );

  setFormValue(
    "#matchVenue",
    match.venue
  );

  setFormValue(
    "#matchLocationType",
    match.locationType
  );
}


function formatFileSize(bytes) {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  return `${(
    bytes /
    (1024 * 1024)
  ).toFixed(1)} MB`;
}


function escapeHTML(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}


function debounce(callback, delay = 250) {
  let timeoutId;

  return (...args) => {
    window.clearTimeout(timeoutId);

    timeoutId = window.setTimeout(() => {
      callback(...args);
    }, delay);
  };
}

/* =========================================================
   SQUAD SELECTION MODAL
========================================================= */

function initializeSquadModal() {
  const modal = matchPage.get("#matchSquadModal");

  if (!modal) {
    return;
  }

  initializeModalCloseButtons(modal);

  const searchInput =
    matchPage.get("#matchSquadSearch", modal) ||
    matchPage.get(".match-squad-search input", modal);

  const positionFilter =
    matchPage.get("#matchSquadPositionFilter", modal) ||
    matchPage.get(".match-squad-toolbar select", modal);

  const selectAllButton =
    matchPage.get("#selectAllSquadPlayers", modal) ||
    matchPage.get("[data-select-all-players]", modal);

  const clearSelectionButton =
    matchPage.get("#clearSquadSelection", modal) ||
    matchPage.get("[data-clear-squad]", modal);

  const saveSquadButton =
    matchPage.get("#saveMatchSquad", modal) ||
    matchPage.get("[data-save-squad]", modal);

  searchInput?.addEventListener(
    "input",
    debounce(renderSquadPlayerList, 150)
  );

  positionFilter?.addEventListener(
    "change",
    renderSquadPlayerList
  );

  selectAllButton?.addEventListener(
    "click",
    selectAllAvailablePlayers
  );

  clearSelectionButton?.addEventListener(
    "click",
    clearSquadSelection
  );

  saveSquadButton?.addEventListener(
    "click",
    saveSelectedSquad
  );

  modal.addEventListener("click", (event) => {
    const playerRow = event.target.closest(
      "[data-squad-player-id]"
    );

    if (playerRow) {
      const playerId =
        playerRow.dataset.squadPlayerId;

      toggleSquadPlayer(playerId);
      return;
    }

    const removeButton = event.target.closest(
      "[data-remove-selected-player]"
    );

    if (removeButton) {
      const playerId =
        removeButton.dataset.removeSelectedPlayer;

      removeSquadPlayer(playerId);
    }
  });
}


function openSquadModal(matchId) {
  const modal = matchPage.get("#matchSquadModal");

  if (!modal) {
    return;
  }

  coachMatchState.activeMatchId = matchId;

  const match = findMatchById(matchId);

  const opponentName = matchPage.get(
    "#squadMatchOpponent",
    modal
  );

  const matchDate = matchPage.get(
    "#squadMatchDate",
    modal
  );

  if (opponentName) {
    opponentName.textContent =
      match?.opponent || "Selected opponent";
  }

  if (matchDate) {
    matchDate.textContent = match?.date
      ? formatReadableDate(match.date)
      : "Date not set";
  }

  coachMatchState.selectedSquad.clear();

  preloadMatchSquad(matchId);

  const searchInput = matchPage.get(
    "#matchSquadSearch",
    modal
  );

  const positionFilter = matchPage.get(
    "#matchSquadPositionFilter",
    modal
  );

  if (searchInput) {
    searchInput.value = "";
  }

  if (positionFilter) {
    positionFilter.value = "all";
  }

  renderSquadPlayerList();
  renderSelectedSquad();
  openModal(modal);
}


function preloadMatchSquad(matchId) {
  /*
    Backend integration:

    GET /api/coach/matches/:matchId/squad

    Add each returned player to:
    coachMatchState.selectedSquad
  */

  const match = findMatchById(matchId);

  if (!match || match.squadCount === 0) {
    return;
  }

  availableMatchPlayers
    .filter(
      (player) =>
        player.availability !== "unavailable"
    )
    .slice(0, Math.min(match.squadCount, 4))
    .forEach((player) => {
      coachMatchState.selectedSquad.set(
        player.id,
        player
      );
    });
}


function renderSquadPlayerList() {
  const modal = matchPage.get("#matchSquadModal");

  const list =
    matchPage.get("#matchSquadPlayerList", modal) ||
    matchPage.get(".match-squad-player-list", modal);

  if (!modal || !list) {
    return;
  }

  const searchValue =
    (
      matchPage.get("#matchSquadSearch", modal)
        ?.value || ""
    )
      .trim()
      .toLowerCase();

  const positionValue =
    matchPage.get(
      "#matchSquadPositionFilter",
      modal
    )?.value || "all";

  const players = availableMatchPlayers.filter(
    (player) => {
      const matchesSearch =
        !searchValue ||
        player.name
          .toLowerCase()
          .includes(searchValue) ||
        player.position
          .toLowerCase()
          .includes(searchValue) ||
        String(player.number).includes(searchValue);

      const matchesPosition =
        positionValue === "all" ||
        player.position.toLowerCase() ===
          positionValue.toLowerCase();

      return matchesSearch && matchesPosition;
    }
  );

  if (!players.length) {
    list.innerHTML = `
      <div class="match-selected-squad-empty">
        <i class="fa-solid fa-user-slash"></i>
        <strong>No players found</strong>
        <span>
          Try another player name or position.
        </span>
      </div>
    `;

    return;
  }

  list.innerHTML = players
    .map((player) => {
      const isSelected =
        coachMatchState.selectedSquad.has(
          player.id
        );

      const isUnavailable =
        player.availability === "unavailable";

      return `
        <label
          class="match-squad-player ${
            isUnavailable ? "disabled" : ""
          }"
          data-squad-player-id="${player.id}"
        >
          <input
            type="checkbox"
            ${isSelected ? "checked" : ""}
            ${isUnavailable ? "disabled" : ""}
            aria-label="Select ${escapeHTML(
              player.name
            )}"
          />

          <span class="match-squad-check">
            <i class="fa-solid fa-check"></i>
          </span>

          <img
            src="${escapeHTML(player.image)}"
            alt="${escapeHTML(player.name)}"
            loading="lazy"
          />

          <span class="match-squad-player-info">
            <strong>
              ${escapeHTML(player.name)}
            </strong>

            <small>
              #${player.number} ·
              ${escapeHTML(player.position)}
            </small>
          </span>

          <span
            class="match-player-availability ${
              player.availability
            }"
          >
            ${capitalizeWord(
              player.availability
            )}
          </span>
        </label>
      `;
    })
    .join("");
}


function toggleSquadPlayer(playerId) {
  const player = availableMatchPlayers.find(
    (item) => item.id === playerId
  );

  if (
    !player ||
    player.availability === "unavailable"
  ) {
    return;
  }

  if (
    coachMatchState.selectedSquad.has(playerId)
  ) {
    coachMatchState.selectedSquad.delete(playerId);
  } else {
    const maximumSquadSize = 23;

    if (
      coachMatchState.selectedSquad.size >=
      maximumSquadSize
    ) {
      showToast(
        "Squad limit reached",
        `A maximum of ${maximumSquadSize} players can be selected.`,
        "warning"
      );

      return;
    }

    coachMatchState.selectedSquad.set(
      playerId,
      player
    );
  }

  renderSquadPlayerList();
  renderSelectedSquad();
}


function removeSquadPlayer(playerId) {
  coachMatchState.selectedSquad.delete(playerId);

  renderSquadPlayerList();
  renderSelectedSquad();
}


function selectAllAvailablePlayers() {
  const maximumSquadSize = 23;

  availableMatchPlayers
    .filter(
      (player) =>
        player.availability !== "unavailable"
    )
    .slice(0, maximumSquadSize)
    .forEach((player) => {
      coachMatchState.selectedSquad.set(
        player.id,
        player
      );
    });

  renderSquadPlayerList();
  renderSelectedSquad();
}


function clearSquadSelection() {
  coachMatchState.selectedSquad.clear();

  renderSquadPlayerList();
  renderSelectedSquad();
}


function renderSelectedSquad() {
  const modal = matchPage.get("#matchSquadModal");

  const list =
    matchPage.get(
      "#matchSelectedSquadList",
      modal
    ) ||
    matchPage.get(
      ".match-selected-squad-list",
      modal
    );

  const countElements = matchPage.getAll(
    [
      "#selectedSquadCount",
      "#matchSelectedCount",
      "[data-selected-squad-count]"
    ].join(","),
    modal
  );

  if (!modal || !list) {
    return;
  }

  const selectedPlayers = [
    ...coachMatchState.selectedSquad.values()
  ];

  countElements.forEach((element) => {
    element.textContent =
      String(selectedPlayers.length);
  });

  if (!selectedPlayers.length) {
    list.innerHTML = `
      <div class="match-selected-squad-empty">
        <i class="fa-solid fa-users"></i>

        <strong>No players selected</strong>

        <span>
          Select available players to build
          the match-day squad.
        </span>
      </div>
    `;

    updateSquadRequirements(selectedPlayers);
    return;
  }

  list.innerHTML = selectedPlayers
    .map(
      (player) => `
        <article class="match-selected-player-item">
          <img
            src="${escapeHTML(player.image)}"
            alt="${escapeHTML(player.name)}"
          />

          <div>
            <strong>
              ${escapeHTML(player.name)}
            </strong>

            <span>
              #${player.number} ·
              ${escapeHTML(player.position)}
            </span>
          </div>

          <button
            type="button"
            data-remove-selected-player="${player.id}"
            aria-label="Remove ${escapeHTML(
              player.name
            )}"
          >
            <i class="fa-solid fa-xmark"></i>
          </button>
        </article>
      `
    )
    .join("");

  updateSquadRequirements(selectedPlayers);
}


function updateSquadRequirements(players) {
  const modal = matchPage.get("#matchSquadModal");

  if (!modal) {
    return;
  }

  const goalkeeperCount = players.filter(
    (player) =>
      player.position.toLowerCase() ===
      "goalkeeper"
  ).length;

  const outfieldCount =
    players.length - goalkeeperCount;

  updateRequirement(
    "[data-squad-requirement='minimum']",
    players.length >= 11,
    `${players.length}/11 minimum players`
  );

  updateRequirement(
    "[data-squad-requirement='goalkeeper']",
    goalkeeperCount >= 1,
    `${goalkeeperCount}/1 goalkeeper`
  );

  updateRequirement(
    "[data-squad-requirement='outfield']",
    outfieldCount >= 10,
    `${outfieldCount}/10 outfield players`
  );
}


function updateRequirement(
  selector,
  completed,
  label
) {
  const requirement = matchPage.get(selector);

  if (!requirement) {
    return;
  }

  requirement.classList.toggle(
    "completed",
    completed
  );

  const icon = matchPage.get("i", requirement);

  if (icon) {
    icon.className = completed
      ? "fa-solid fa-circle-check"
      : "fa-regular fa-circle";
  }

  const text = matchPage.get(
    "span, small, strong",
    requirement
  );

  if (text) {
    text.textContent = label;
  }
}


function saveSelectedSquad() {
  const players = [
    ...coachMatchState.selectedSquad.values()
  ];

  const goalkeeperCount = players.filter(
    (player) =>
      player.position.toLowerCase() ===
      "goalkeeper"
  ).length;

  if (players.length < 11) {
    showToast(
      "Squad incomplete",
      "Select at least 11 players before saving.",
      "warning"
    );

    return;
  }

  if (goalkeeperCount < 1) {
    showToast(
      "Goalkeeper required",
      "Select at least one goalkeeper.",
      "warning"
    );

    return;
  }

  const payload = {
    matchId: coachMatchState.activeMatchId,
    playerIds: players.map(
      (player) => player.id
    )
  };

  /*
    Backend integration:

    PUT /api/coach/matches/:matchId/squad
  */

  console.log("Selected squad payload:", payload);

  updateMatchCardSquadCount(
    coachMatchState.activeMatchId,
    players.length
  );

  closeModal(matchPage.get("#matchSquadModal"));

  showToast(
    "Squad saved",
    `${players.length} players were selected for the fixture.`,
    "success"
  );
}


function updateMatchCardSquadCount(
  matchId,
  squadCount
) {
  const card = matchPage.get(
    `.match-card[data-match-id="${matchId}"]`
  );

  if (!card) {
    return;
  }

  const countElement = matchPage.get(
    "[data-match-squad-count]",
    card
  );

  if (countElement) {
    countElement.textContent =
      String(squadCount);
  }
}


/* =========================================================
   MATCH PREPARATION DRAWER
========================================================= */

function initializePreparationDrawer() {
  const drawer = matchPage.get(
    "#matchPreparationDrawer"
  );

  const overlay = matchPage.get(
    "#matchDrawerOverlay"
  );

  if (!drawer) {
    return;
  }

  matchPage
    .getAll(
      [
        ".match-drawer-close",
        "[data-close-match-drawer]"
      ].join(","),
      drawer
    )
    .forEach((button) => {
      button.addEventListener(
        "click",
        closePreparationDrawer
      );
    });

  overlay?.addEventListener(
    "click",
    closePreparationDrawer
  );

  const tabs = matchPage.getAll(
    "[data-drawer-tab]",
    drawer
  );

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      activatePreparationTab(
        tab.dataset.drawerTab
      );
    });
  });

  const checklistInputs = matchPage.getAll(
    ".match-preparation-checkbox input",
    drawer
  );

  checklistInputs.forEach((input) => {
    input.addEventListener("change", () => {
      const item = input.closest(
        ".match-preparation-checkbox"
      );

      item?.classList.toggle(
        "completed",
        input.checked
      );

      updatePreparationProgress();
    });
  });

  const saveButton =
    matchPage.get("#saveMatchPreparation") ||
    matchPage.get(
      "[data-save-match-preparation]",
      drawer
    );

  saveButton?.addEventListener(
    "click",
    saveMatchPreparation
  );
}


function openPreparationDrawer(matchId) {
  const drawer = matchPage.get(
    "#matchPreparationDrawer"
  );

  const overlay = matchPage.get(
    "#matchDrawerOverlay"
  );

  if (!drawer) {
    return;
  }

  coachMatchState.activeMatchId = matchId;

  const match = findMatchById(matchId);

  const opponent = matchPage.get(
    "#preparationOpponent",
    drawer
  );

  const date = matchPage.get(
    "#preparationMatchDate",
    drawer
  );

  const venue = matchPage.get(
    "#preparationVenue",
    drawer
  );

  if (opponent) {
    opponent.textContent =
      match?.opponent || "Selected opponent";
  }

  if (date) {
    date.textContent = match?.date
      ? formatReadableDate(match.date)
      : "Date pending";
  }

  if (venue) {
    venue.textContent =
      match?.venue || "Venue pending";
  }

  drawer.classList.add("active");
  drawer.setAttribute("aria-hidden", "false");

  overlay?.classList.add("active");

  matchPage.body.classList.add(
    "match-drawer-open"
  );

  activatePreparationTab("overview");
  updatePreparationProgress();
}


function closePreparationDrawer() {
  const drawer = matchPage.get(
    "#matchPreparationDrawer"
  );

  const overlay = matchPage.get(
    "#matchDrawerOverlay"
  );

  drawer?.classList.remove("active");

  drawer?.setAttribute(
    "aria-hidden",
    "true"
  );

  overlay?.classList.remove("active");

  matchPage.body.classList.remove(
    "match-drawer-open"
  );
}


function activatePreparationTab(tabName) {
  const drawer = matchPage.get(
    "#matchPreparationDrawer"
  );

  if (!drawer) {
    return;
  }

  coachMatchState.activeDrawerTab =
    tabName || "overview";

  matchPage
    .getAll("[data-drawer-tab]", drawer)
    .forEach((button) => {
      const isActive =
        button.dataset.drawerTab ===
        coachMatchState.activeDrawerTab;

      button.classList.toggle(
        "active",
        isActive
      );

      button.setAttribute(
        "aria-selected",
        String(isActive)
      );
    });

  matchPage
    .getAll("[data-drawer-panel]", drawer)
    .forEach((panel) => {
      const isActive =
        panel.dataset.drawerPanel ===
        coachMatchState.activeDrawerTab;

      panel.hidden = !isActive;
      panel.classList.toggle(
        "active",
        isActive
      );
    });
}


function updatePreparationProgress() {
  const drawer = matchPage.get(
    "#matchPreparationDrawer"
  );

  if (!drawer) {
    return;
  }

  const checklistInputs = matchPage.getAll(
    ".match-preparation-checkbox input",
    drawer
  );

  const total = checklistInputs.length;

  const completed = checklistInputs.filter(
    (input) => input.checked
  ).length;

  const percentage = total
    ? Math.round((completed / total) * 100)
    : 0;

  const progressText = matchPage.get(
    "#matchPreparationPercentage",
    drawer
  );

  const progressBar =
    matchPage.get(
      "#matchPreparationProgressBar",
      drawer
    ) ||
    matchPage.get(
      ".match-drawer-progress .match-progress-track span",
      drawer
    );

  if (progressText) {
    progressText.textContent =
      `${percentage}%`;
  }

  if (progressBar) {
    progressBar.style.width =
      `${percentage}%`;

    progressBar.setAttribute(
      "aria-valuenow",
      String(percentage)
    );
  }
}


function saveMatchPreparation() {
  const drawer = matchPage.get(
    "#matchPreparationDrawer"
  );

  if (!drawer) {
    return;
  }

  const completedTaskIds = matchPage
    .getAll(
      ".match-preparation-checkbox input:checked",
      drawer
    )
    .map(
      (input) =>
        input.value ||
        input.dataset.taskId ||
        input.id
    );

  const notes =
    matchPage.get(
      "#matchPreparationNotes",
      drawer
    )?.value.trim() || "";

  const payload = {
    matchId: coachMatchState.activeMatchId,
    completedTaskIds,
    notes,
    formation:
      matchPage.get(
        "#matchFormationSelect",
        drawer
      )?.value || "",
    mentality:
      matchPage.get(
        "#matchMentalitySelect",
        drawer
      )?.value || "",
    pressing:
      matchPage.get(
        "#matchPressingSelect",
        drawer
      )?.value || ""
  };

  /*
    Backend integration:

    PUT /api/coach/matches/:matchId/preparation
  */

  console.log(
    "Match preparation payload:",
    payload
  );

  closePreparationDrawer();

  showToast(
    "Preparation saved",
    "The match-day preparation plan was updated.",
    "success"
  );
}


/* =========================================================
   MATCH REPORT MODAL
========================================================= */

function initializeMatchReportModal() {
  const modal = matchPage.get(
    "#matchReportModal"
  );

  const form = matchPage.get(
    "#matchReportForm"
  );

  if (!modal || !form) {
    return;
  }

  initializeModalCloseButtons(modal);

  form.addEventListener(
    "submit",
    submitMatchReport
  );
}


function openMatchReportModal(matchId) {
  const modal = matchPage.get(
    "#matchReportModal"
  );

  const form = matchPage.get(
    "#matchReportForm"
  );

  if (!modal || !form) {
    return;
  }

  coachMatchState.activeMatchId = matchId;

  const match = findMatchById(matchId);

  form.reset();
  form.dataset.matchId = matchId || "";

  const homeTeamName = matchPage.get(
    "#matchReportHomeTeam"
  );

  const awayTeamName = matchPage.get(
    "#matchReportAwayTeam"
  );

  const matchName = matchPage.get(
    "#matchReportFixtureName"
  );

  if (matchName) {
    matchName.textContent = match
      ? `Mission India Academy vs ${match.opponent}`
      : "Match Report";
  }

  if (homeTeamName) {
    homeTeamName.textContent =
      match?.locationType === "away"
        ? match.opponent
        : "Mission India Academy";
  }

  if (awayTeamName) {
    awayTeamName.textContent =
      match?.locationType === "away"
        ? "Mission India Academy"
        : match?.opponent ||
          "Opponent Academy";
  }

  resetReportEvents();
  resetRatingOutputs();
  openModal(modal);
}


function submitMatchReport(event) {
  event.preventDefault();

  const form = event.currentTarget;

  const homeScore = Number(
    matchPage.get(
      "#matchReportHomeScore",
      form
    )?.value
  );

  const awayScore = Number(
    matchPage.get(
      "#matchReportAwayScore",
      form
    )?.value
  );

  if (
    !Number.isFinite(homeScore) ||
    !Number.isFinite(awayScore) ||
    homeScore < 0 ||
    awayScore < 0
  ) {
    showToast(
      "Invalid final score",
      "Enter a valid score for both teams.",
      "error"
    );

    return;
  }

  const formData = new FormData(form);

  const payload =
    Object.fromEntries(formData.entries());

  payload.matchId =
    form.dataset.matchId ||
    coachMatchState.activeMatchId;

  payload.events = collectReportEvents(form);

  payload.ratings = collectReportRatings(
    form
  );

  /*
    Backend integration:

    POST /api/coach/matches/:matchId/report
  */

  console.log("Match report payload:", payload);

  closeModal(matchPage.get("#matchReportModal"));

  showToast(
    "Report published",
    "The final score and coaching analysis were saved.",
    "success"
  );
}


/* =========================================================
   GOAL SCORER / EVENT ROWS
========================================================= */

function initializeGoalScorers() {
  const addEventButton =
    matchPage.get("#addMatchEvent") ||
    matchPage.get("[data-add-match-event]");

  addEventButton?.addEventListener(
    "click",
    addMatchEventRow
  );

  document.addEventListener(
    "click",
    (event) => {
      const removeButton =
        event.target.closest(
          "[data-remove-match-event]"
        );

      if (!removeButton) {
        return;
      }

      const eventRow = removeButton.closest(
        ".match-event-row"
      );

      eventRow?.remove();
    }
  );
}


function addMatchEventRow() {
  const eventList =
    matchPage.get("#matchEventList") ||
    matchPage.get(".match-event-list");

  if (!eventList) {
    return;
  }

  const eventIndex =
    eventList.children.length;

  const row = document.createElement("div");

  row.className = "match-event-row";

  row.innerHTML = `
    <select
      name="events[${eventIndex}][player]"
      aria-label="Select player"
    >
      <option value="">
        Select player
      </option>

      ${availableMatchPlayers
        .map(
          (player) => `
            <option value="${player.id}">
              ${escapeHTML(player.name)}
            </option>
          `
        )
        .join("")}
    </select>

    <input
      type="number"
      name="events[${eventIndex}][minute]"
      min="1"
      max="130"
      placeholder="Min"
      aria-label="Event minute"
    />

    <select
      name="events[${eventIndex}][type]"
      aria-label="Event type"
    >
      <option value="goal">Goal</option>
      <option value="assist">Assist</option>
      <option value="yellow-card">
        Yellow card
      </option>
      <option value="red-card">
        Red card
      </option>
      <option value="substitution">
        Substitution
      </option>
    </select>

    <button
      type="button"
      data-remove-match-event
      aria-label="Remove event"
    >
      <i class="fa-solid fa-trash"></i>
    </button>
  `;

  eventList.appendChild(row);
}


function resetReportEvents() {
  const eventList =
    matchPage.get("#matchEventList") ||
    matchPage.get(".match-event-list");

  if (!eventList) {
    return;
  }

  eventList.innerHTML = "";

  addMatchEventRow();
}


function collectReportEvents(form) {
  return matchPage
    .getAll(".match-event-row", form)
    .map((row) => {
      const fields = matchPage.getAll(
        "input, select",
        row
      );

      return {
        playerId: fields[0]?.value || "",
        minute: Number(
          fields[1]?.value || 0
        ),
        type: fields[2]?.value || ""
      };
    })
    .filter(
      (event) =>
        event.playerId ||
        event.minute ||
        event.type
    );
}


/* =========================================================
   RATING SLIDERS
========================================================= */

function initializeRatingSliders() {
  matchPage
    .getAll(
      ".match-rating-grid input[type='range']"
    )
    .forEach((slider) => {
      const output = findRatingOutput(slider);

      const update = () => {
        if (output) {
          output.value = slider.value;
          output.textContent =
            slider.value;
        }
      };

      slider.addEventListener(
        "input",
        update
      );

      update();
    });
}


function findRatingOutput(slider) {
  const label = slider.closest("label");

  return (
    label?.querySelector("output") ||
    matchPage.get(
      `[data-rating-output="${slider.name}"]`
    )
  );
}


function resetRatingOutputs() {
  matchPage
    .getAll(
      ".match-rating-grid input[type='range']"
    )
    .forEach((slider) => {
      const output = findRatingOutput(slider);

      if (output) {
        output.value = slider.value;
        output.textContent =
          slider.value;
      }
    });
}


function collectReportRatings(form) {
  return matchPage
    .getAll(
      ".match-rating-grid input[type='range']",
      form
    )
    .reduce((ratings, slider) => {
      ratings[slider.name || slider.id] =
        Number(slider.value);

      return ratings;
    }, {});
}


/* =========================================================
   DELETE / CANCEL MATCH MODAL
========================================================= */

function initializeDeleteModal() {
  const modal = matchPage.get(
    "#matchDeleteModal"
  );

  if (!modal) {
    return;
  }

  initializeModalCloseButtons(modal);

  const confirmButton =
    matchPage.get("#confirmDeleteMatch") ||
    matchPage.get(
      "[data-confirm-delete-match]",
      modal
    );

  confirmButton?.addEventListener(
    "click",
    confirmDeleteMatch
  );
}


function openDeleteModal(
  matchId,
  action = "delete"
) {
  const modal = matchPage.get(
    "#matchDeleteModal"
  );

  if (!modal) {
    return;
  }

  coachMatchState.pendingDeleteId =
    matchId;

  modal.dataset.deleteAction = action;

  const match = findMatchById(matchId);

  const title = matchPage.get(
    "#matchDeleteTitle",
    modal
  );

  const description = matchPage.get(
    "#matchDeleteDescription",
    modal
  );

  const confirmButton =
    matchPage.get(
      "#confirmDeleteMatch",
      modal
    ) ||
    matchPage.get(
      "[data-confirm-delete-match]",
      modal
    );

  if (action === "cancel") {
    if (title) {
      title.textContent =
        "Cancel this fixture?";
    }

    if (description) {
      description.textContent =
        `The match against ${
          match?.opponent || "this opponent"
        } will be marked as cancelled.`;
    }

    if (confirmButton) {
      confirmButton.innerHTML = `
        <i class="fa-solid fa-ban"></i>
        Cancel Match
      `;
    }
  } else {
    if (title) {
      title.textContent =
        "Delete this match?";
    }

    if (description) {
      description.textContent =
        `The fixture against ${
          match?.opponent || "this opponent"
        } will be permanently removed.`;
    }

    if (confirmButton) {
      confirmButton.innerHTML = `
        <i class="fa-solid fa-trash"></i>
        Delete Match
      `;
    }
  }

  openModal(modal);
}


function confirmDeleteMatch() {
  const modal = matchPage.get(
    "#matchDeleteModal"
  );

  const matchId =
    coachMatchState.pendingDeleteId;

  if (!modal || !matchId) {
    return;
  }

  const action =
    modal.dataset.deleteAction ||
    "delete";

  /*
    Backend integration:

    DELETE:
    DELETE /api/coach/matches/:matchId

    CANCEL:
    PATCH /api/coach/matches/:matchId
    body.status = "cancelled"
  */

  if (action === "delete") {
    const card = matchPage.get(
      `.match-card[data-match-id="${matchId}"]`
    );

    card?.remove();

    showToast(
      "Match deleted",
      "The fixture was removed successfully.",
      "success"
    );
  } else {
    const card = matchPage.get(
      `.match-card[data-match-id="${matchId}"]`
    );

    if (card) {
      card.dataset.status = "cancelled";

      const badge = matchPage.get(
        ".match-status-badge",
        card
      );

      if (badge) {
        badge.className =
          "match-status-badge draft";

        badge.textContent = "Cancelled";
      }
    }

    showToast(
      "Match cancelled",
      "The fixture has been marked as cancelled.",
      "success"
    );
  }

  coachMatchState.pendingDeleteId = null;

  closeModal(modal);
  applyMatchFilters();
}


/* =========================================================
   LOGOUT MODAL
========================================================= */

function initializeLogoutModal() {
  const modal = matchPage.get(
    "#coachLogoutModal"
  );

  const openButtons = matchPage.getAll(
    [
      "#coachLogoutButton",
      "[data-coach-logout]"
    ].join(",")
  );

  openButtons.forEach((button) => {
    button.addEventListener("click", () => {
      openModal(modal);
    });
  });

  if (!modal) {
    return;
  }

  initializeModalCloseButtons(modal);

  const confirmButton =
    matchPage.get(
      "#confirmCoachLogout",
      modal
    ) ||
    matchPage.get(
      "[data-confirm-logout]",
      modal
    );

  confirmButton?.addEventListener(
    "click",
    handleCoachLogout
  );
}


function handleCoachLogout() {
  /*
    Backend integration:

    POST /api/auth/logout
    Clear authentication token/session.
  */

  showToast(
    "Signing out",
    "Your coach session has ended.",
    "info"
  );

  window.setTimeout(() => {
    window.location.href =
      "login.html";
  }, 500);
}


/* =========================================================
   MATCH CALENDAR
========================================================= */

function initializeCalendar() {
  const calendarGrid = matchPage.get(
    "#matchCalendarGrid"
  );

  if (!calendarGrid) {
    return;
  }

  const previousButton =
    matchPage.get(
      "#previousMatchCalendarMonth"
    ) ||
    matchPage.get(
      "[data-calendar-direction='previous']"
    );

  const nextButton =
    matchPage.get(
      "#nextMatchCalendarMonth"
    ) ||
    matchPage.get(
      "[data-calendar-direction='next']"
    );

  const todayButton =
    matchPage.get(
      "#matchCalendarToday"
    ) ||
    matchPage.get(
      "[data-calendar-today]"
    );

  previousButton?.addEventListener(
    "click",
    () => {
      coachMatchState.calendarDate.setMonth(
        coachMatchState.calendarDate.getMonth() -
          1
      );

      renderMatchCalendar();
    }
  );

  nextButton?.addEventListener(
    "click",
    () => {
      coachMatchState.calendarDate.setMonth(
        coachMatchState.calendarDate.getMonth() +
          1
      );

      renderMatchCalendar();
    }
  );

  todayButton?.addEventListener(
    "click",
    () => {
      coachMatchState.calendarDate =
        new Date();

      renderMatchCalendar();
    }
  );

  calendarGrid.addEventListener(
    "click",
    (event) => {
      const calendarDay =
        event.target.closest(
          "[data-calendar-date]"
        );

      if (!calendarDay) {
        return;
      }

      const date =
        calendarDay.dataset.calendarDate;

      const match = coachMatches.find(
        (item) => item.date === date
      );

      if (match) {
        coachMatchState.activeMatchId =
          match.id;

        showToast(
          match.opponent,
          `${formatReadableDate(
            match.date
          )} at ${formatReadableTime(
            match.time
          )}`,
          "info"
        );
      } else {
        openCreateMatchModal();
        setFormValue("#matchDate", date);
      }
    }
  );

  renderMatchCalendar();
}


function renderMatchCalendar() {
  const grid = matchPage.get(
    "#matchCalendarGrid"
  );

  const monthLabel =
    matchPage.get("#matchCalendarMonth") ||
    matchPage.get(
      "[data-calendar-month-label]"
    );

  if (!grid) {
    return;
  }

  const displayedDate =
    coachMatchState.calendarDate;

  const year = displayedDate.getFullYear();

  const month = displayedDate.getMonth();

  if (monthLabel) {
    monthLabel.textContent =
      displayedDate.toLocaleDateString(
        "en-IN",
        {
          month: "long",
          year: "numeric"
        }
      );
  }

  const firstDay = new Date(
    year,
    month,
    1
  );

  const lastDay = new Date(
    year,
    month + 1,
    0
  );

  const startOffset =
    firstDay.getDay();

  const totalCells = 42;

  const today = new Date();

  today.setHours(0, 0, 0, 0);

  const cells = [];

  for (
    let index = 0;
    index < totalCells;
    index += 1
  ) {
    const dayNumber =
      index - startOffset + 1;

    const cellDate = new Date(
      year,
      month,
      dayNumber
    );

    const dateKey =
      formatDateForInput(cellDate);

    const relatedMatch = coachMatches.find(
      (match) => match.date === dateKey
    );

    const outsideMonth =
      cellDate.getMonth() !== month;

    const isToday =
      cellDate.getTime() ===
      today.getTime();

    cells.push(`
      <button
        type="button"
        class="match-calendar-day
          ${
            outsideMonth
              ? "outside-month"
              : ""
          }
          ${
            isToday
              ? "current-day"
              : ""
          }
          ${
            relatedMatch?.status ||
            ""
          }
        "
        data-calendar-date="${dateKey}"
        aria-label="${cellDate.toLocaleDateString(
          "en-IN",
          {
            day: "numeric",
            month: "long",
            year: "numeric"
          }
        )}"
      >
        <span>
          ${cellDate.getDate()}
        </span>

        ${
          relatedMatch
            ? `
              <small>
                ${escapeHTML(
                  relatedMatch.opponent
                )}
              </small>

              <i
                class="fa-solid fa-circle"
                aria-hidden="true"
              ></i>
            `
            : ""
        }
      </button>
    `);
  }

  grid.innerHTML = cells.join("");
}


/* =========================================================
   LOAD MORE MATCHES
========================================================= */

function initializeLoadMore() {
  const button =
    matchPage.get("#loadMoreMatches") ||
    matchPage.get(
      ".match-load-more-button"
    );

  if (!button) {
    return;
  }

  button.addEventListener("click", () => {
    coachMatchState.visibleMatchCount += 4;

    applyMatchFilters();

    const totalCards =
      matchPage.getAll(".match-card").length;

    if (
      coachMatchState.visibleMatchCount >=
      totalCards
    ) {
      button.hidden = true;

      showToast(
        "All matches loaded",
        "There are no more fixtures to display.",
        "info"
      );
    }
  });
}


/* =========================================================
   TOAST NOTIFICATIONS
========================================================= */

function showToast(
  title,
  message,
  type = "info",
  duration = 4000
) {
  let container = matchPage.get(
    "#matchToastContainer"
  );

  if (!container) {
    container =
      document.createElement("div");

    container.id = "matchToastContainer";
    container.className =
      "match-toast-container";

    container.setAttribute(
      "aria-live",
      "polite"
    );

    matchPage.body.appendChild(container);
  }

  const toast = document.createElement(
    "article"
  );

  toast.className =
    `match-toast ${type}`;

  toast.innerHTML = `
    <span class="match-toast-icon">
      <i class="${getToastIcon(type)}"></i>
    </span>

    <span class="match-toast-content">
      <strong>
        ${escapeHTML(title)}
      </strong>

      <span>
        ${escapeHTML(message)}
      </span>
    </span>

    <button
      type="button"
      class="match-toast-close"
      aria-label="Close notification"
    >
      <i class="fa-solid fa-xmark"></i>
    </button>
  `;

  container.appendChild(toast);

  const closeButton = matchPage.get(
    ".match-toast-close",
    toast
  );

  const removeToast = () => {
    toast.style.opacity = "0";
    toast.style.transform =
      "translateY(12px)";

    window.setTimeout(() => {
      toast.remove();
    }, 220);
  };

  closeButton?.addEventListener(
    "click",
    removeToast
  );

  window.setTimeout(
    removeToast,
    duration
  );
}


function getToastIcon(type) {
  const iconMap = {
    success: "fa-solid fa-circle-check",
    error:
      "fa-solid fa-triangle-exclamation",
    warning:
      "fa-solid fa-circle-exclamation",
    info: "fa-solid fa-circle-info"
  };

  return iconMap[type] || iconMap.info;
}


/* =========================================================
   KEYBOARD ACCESSIBILITY
========================================================= */

function initializeKeyboardControls() {
  document.addEventListener(
    "keydown",
    (event) => {
      if (event.key !== "Escape") {
        return;
      }

      closeAllMatchMenus();

      const openModalElement =
        matchPage.get(
          ".match-modal-backdrop.active"
        );

      if (openModalElement) {
        closeModal(openModalElement);
      }

      const openDrawer = matchPage.get(
        "#matchPreparationDrawer.active"
      );

      if (openDrawer) {
        closePreparationDrawer();
      }
    }
  );
}


/* =========================================================
   DATE AND TEXT UTILITIES
========================================================= */

function formatReadableDate(dateValue) {
  const date = new Date(
    `${dateValue}T00:00:00`
  );

  if (Number.isNaN(date.getTime())) {
    return dateValue;
  }

  return date.toLocaleDateString(
    "en-IN",
    {
      day: "numeric",
      month: "short",
      year: "numeric"
    }
  );
}


function formatReadableTime(timeValue) {
  if (!timeValue) {
    return "";
  }

  const [hours, minutes] =
    timeValue.split(":");

  const date = new Date();

  date.setHours(
    Number(hours),
    Number(minutes),
    0,
    0
  );

  return date.toLocaleTimeString(
    "en-IN",
    {
      hour: "numeric",
      minute: "2-digit"
    }
  );
}


function formatDateForInput(date) {
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(
      2,
      "0"
    ),
    String(date.getDate()).padStart(
      2,
      "0"
    )
  ].join("-");
}


function capitalizeWord(value) {
  const text = String(value || "");

  return text
    ? text.charAt(0).toUpperCase() +
        text.slice(1)
    : "";
}


/* =========================================================
   BACKEND INTEGRATION REFERENCE
========================================================= */

/*
  Recommended backend endpoints for Mr. Harsh:

  GET    /api/coach/matches
  POST   /api/coach/matches
  GET    /api/coach/matches/:matchId
  PUT    /api/coach/matches/:matchId
  PATCH  /api/coach/matches/:matchId
  DELETE /api/coach/matches/:matchId

  GET    /api/coach/matches/:matchId/squad
  PUT    /api/coach/matches/:matchId/squad

  GET    /api/coach/matches/:matchId/preparation
  PUT    /api/coach/matches/:matchId/preparation

  GET    /api/coach/matches/:matchId/report
  POST   /api/coach/matches/:matchId/report

  GET    /api/coach/players?availability=match

  All frontend request points are isolated in this file
  so API calls can replace placeholder logic cleanly.
*/
