/* =========================================================
   FIFA MISSION INDIA
   SCOUT PORTAL — CREATE PLAYER REPORT
   File: scout-report-create.js
   Part 1
   Frontend-only architecture with backend integration hooks
========================================================= */

"use strict";

/* =========================================================
   APPLICATION CONFIGURATION
========================================================= */

const ScoutReportCreateConfig = Object.freeze({
  api: {
    createReport: "/api/v1/scout/reports",
    saveDraft: "/api/v1/scout/reports/draft",
    uploadMedia: "/api/v1/scout/reports/media",
    searchPlayers: "/api/v1/scout/players/search",
    getPlayer: "/api/v1/scout/players",
    getScoutProfile: "/api/v1/scout/profile"
  },

  storageKeys: {
    draft: "fmi_scout_report_create_draft",
    preferences: "fmi_scout_report_preferences"
  },

  limits: {
    playerName: 100,
    academyName: 120,
    location: 150,
    summary: 1500,
    strengths: 1200,
    weaknesses: 1200,
    recommendation: 1500,
    privateNotes: 2000,
    maxMediaFiles: 6,
    maxImageSize: 5 * 1024 * 1024,
    maxVideoSize: 50 * 1024 * 1024
  },

  autosaveDelay: 1200,
  notificationDuration: 4000,
  searchDebounceDelay: 350,

  allowedImageTypes: [
    "image/jpeg",
    "image/png",
    "image/webp"
  ],

  allowedVideoTypes: [
    "video/mp4",
    "video/webm",
    "video/quicktime"
  ]
});


/* =========================================================
   APPLICATION STATE
========================================================= */

const ScoutReportCreateState = {
  initialized: false,
  isSubmitting: false,
  isSavingDraft: false,
  hasUnsavedChanges: false,
  currentStep: 1,
  totalSteps: 1,
  selectedPlayer: null,
  uploadedFiles: [],
  uploadedMediaIds: [],
  searchResults: [],
  activeSearchIndex: -1,
  autosaveTimer: null,
  playerSearchTimer: null,
  lastSavedAt: null,
  initialFormSnapshot: "",
  abortControllers: {
    playerSearch: null,
    submit: null,
    draft: null,
    upload: null
  }
};


/* =========================================================
   DOM REFERENCES
========================================================= */

const ScoutReportCreateDOM = {
  page: null,
  form: null,

  sidebar: null,
  sidebarOverlay: null,
  sidebarToggle: null,
  sidebarClose: null,

  stepPanels: [],
  stepButtons: [],
  progressBar: null,
  progressText: null,

  previousButton: null,
  nextButton: null,
  submitButton: null,
  saveDraftButton: null,
  resetButton: null,
  cancelButton: null,

  playerSearchInput: null,
  playerSearchResults: null,
  selectedPlayerCard: null,
  selectedPlayerName: null,
  selectedPlayerMeta: null,
  selectedPlayerImage: null,
  selectedPlayerIdInput: null,
  clearSelectedPlayerButton: null,

  reportTitleInput: null,
  reportDateInput: null,
  matchDateInput: null,
  competitionInput: null,
  venueInput: null,

  playerNameInput: null,
  playerAgeInput: null,
  playerDobInput: null,
  playerPositionInput: null,
  preferredFootInput: null,
  playerAcademyInput: null,
  playerLocationInput: null,
  jerseyNumberInput: null,

  technicalInputs: [],
  physicalInputs: [],
  tacticalInputs: [],
  mentalInputs: [],

  overallRatingInput: null,
  overallRatingOutput: null,
  potentialRatingInput: null,
  potentialRatingOutput: null,

  summaryInput: null,
  strengthsInput: null,
  weaknessesInput: null,
  recommendationInput: null,
  privateNotesInput: null,

  recommendationStatusInput: null,
  priorityInput: null,
  visibilityInput: null,

  mediaInput: null,
  mediaDropzone: null,
  mediaPreviewList: null,
  mediaCounter: null,

  consentCheckbox: null,
  confirmationCheckbox: null,

  notificationContainer: null,
  validationSummary: null,
  autosaveStatus: null,

  unsavedChangesBar: null,
  unsavedChangesText: null,

  characterCounterElements: []
};


/* =========================================================
   DOM INITIALIZATION
========================================================= */

function cacheScoutReportCreateDOM() {
  ScoutReportCreateDOM.page =
    document.querySelector("[data-scout-report-create-page]") ||
    document.querySelector(".scout-report-create-page") ||
    document.body;

  ScoutReportCreateDOM.form =
    document.getElementById("scoutReportCreateForm") ||
    document.querySelector("[data-scout-report-form]");

  ScoutReportCreateDOM.sidebar =
    document.getElementById("scoutSidebar") ||
    document.querySelector(".scout-sidebar");

  ScoutReportCreateDOM.sidebarOverlay =
    document.getElementById("scoutSidebarOverlay") ||
    document.querySelector(".scout-sidebar-overlay");

  ScoutReportCreateDOM.sidebarToggle =
    document.getElementById("scoutSidebarToggle") ||
    document.querySelector("[data-sidebar-toggle]");

  ScoutReportCreateDOM.sidebarClose =
    document.getElementById("scoutSidebarClose") ||
    document.querySelector("[data-sidebar-close]");

  ScoutReportCreateDOM.stepPanels = Array.from(
    document.querySelectorAll(
      "[data-report-step], .scout-report-step-panel"
    )
  );

  ScoutReportCreateDOM.stepButtons = Array.from(
    document.querySelectorAll(
      "[data-step-target], .scout-report-step-button"
    )
  );

  ScoutReportCreateDOM.progressBar =
    document.getElementById("reportProgressBar") ||
    document.querySelector("[data-report-progress-bar]");

  ScoutReportCreateDOM.progressText =
    document.getElementById("reportProgressText") ||
    document.querySelector("[data-report-progress-text]");

  ScoutReportCreateDOM.previousButton =
    document.getElementById("previousStepButton") ||
    document.querySelector("[data-report-previous]");

  ScoutReportCreateDOM.nextButton =
    document.getElementById("nextStepButton") ||
    document.querySelector("[data-report-next]");

  ScoutReportCreateDOM.submitButton =
    document.getElementById("submitScoutReportButton") ||
    document.querySelector("[data-report-submit]");

  ScoutReportCreateDOM.saveDraftButton =
    document.getElementById("saveReportDraftButton") ||
    document.querySelector("[data-report-save-draft]");

  ScoutReportCreateDOM.resetButton =
    document.getElementById("resetScoutReportButton") ||
    document.querySelector("[data-report-reset]");

  ScoutReportCreateDOM.cancelButton =
    document.getElementById("cancelScoutReportButton") ||
    document.querySelector("[data-report-cancel]");

  ScoutReportCreateDOM.playerSearchInput =
    document.getElementById("playerSearchInput") ||
    document.querySelector("[data-player-search-input]");

  ScoutReportCreateDOM.playerSearchResults =
    document.getElementById("playerSearchResults") ||
    document.querySelector("[data-player-search-results]");

  ScoutReportCreateDOM.selectedPlayerCard =
    document.getElementById("selectedPlayerCard") ||
    document.querySelector("[data-selected-player-card]");

  ScoutReportCreateDOM.selectedPlayerName =
    document.getElementById("selectedPlayerName") ||
    document.querySelector("[data-selected-player-name]");

  ScoutReportCreateDOM.selectedPlayerMeta =
    document.getElementById("selectedPlayerMeta") ||
    document.querySelector("[data-selected-player-meta]");

  ScoutReportCreateDOM.selectedPlayerImage =
    document.getElementById("selectedPlayerImage") ||
    document.querySelector("[data-selected-player-image]");

  ScoutReportCreateDOM.selectedPlayerIdInput =
    document.getElementById("selectedPlayerId") ||
    document.querySelector('[name="playerId"]');

  ScoutReportCreateDOM.clearSelectedPlayerButton =
    document.getElementById("clearSelectedPlayerButton") ||
    document.querySelector("[data-clear-selected-player]");

  ScoutReportCreateDOM.reportTitleInput =
    document.getElementById("reportTitle") ||
    document.querySelector('[name="reportTitle"]');

  ScoutReportCreateDOM.reportDateInput =
    document.getElementById("reportDate") ||
    document.querySelector('[name="reportDate"]');

  ScoutReportCreateDOM.matchDateInput =
    document.getElementById("matchDate") ||
    document.querySelector('[name="matchDate"]');

  ScoutReportCreateDOM.competitionInput =
    document.getElementById("competitionName") ||
    document.querySelector('[name="competition"]');

  ScoutReportCreateDOM.venueInput =
    document.getElementById("matchVenue") ||
    document.querySelector('[name="venue"]');

  ScoutReportCreateDOM.playerNameInput =
    document.getElementById("playerName") ||
    document.querySelector('[name="playerName"]');

  ScoutReportCreateDOM.playerAgeInput =
    document.getElementById("playerAge") ||
    document.querySelector('[name="playerAge"]');

  ScoutReportCreateDOM.playerDobInput =
    document.getElementById("playerDateOfBirth") ||
    document.querySelector('[name="playerDateOfBirth"]');

  ScoutReportCreateDOM.playerPositionInput =
    document.getElementById("playerPosition") ||
    document.querySelector('[name="playerPosition"]');

  ScoutReportCreateDOM.preferredFootInput =
    document.getElementById("preferredFoot") ||
    document.querySelector('[name="preferredFoot"]');

  ScoutReportCreateDOM.playerAcademyInput =
    document.getElementById("playerAcademy") ||
    document.querySelector('[name="playerAcademy"]');

  ScoutReportCreateDOM.playerLocationInput =
    document.getElementById("playerLocation") ||
    document.querySelector('[name="playerLocation"]');

  ScoutReportCreateDOM.jerseyNumberInput =
    document.getElementById("jerseyNumber") ||
    document.querySelector('[name="jerseyNumber"]');

  ScoutReportCreateDOM.technicalInputs = Array.from(
    document.querySelectorAll(
      '[data-rating-category="technical"], [name^="technical"]'
    )
  );

  ScoutReportCreateDOM.physicalInputs = Array.from(
    document.querySelectorAll(
      '[data-rating-category="physical"], [name^="physical"]'
    )
  );

  ScoutReportCreateDOM.tacticalInputs = Array.from(
    document.querySelectorAll(
      '[data-rating-category="tactical"], [name^="tactical"]'
    )
  );

  ScoutReportCreateDOM.mentalInputs = Array.from(
    document.querySelectorAll(
      '[data-rating-category="mental"], [name^="mental"]'
    )
  );

  ScoutReportCreateDOM.overallRatingInput =
    document.getElementById("overallRating") ||
    document.querySelector('[name="overallRating"]');

  ScoutReportCreateDOM.overallRatingOutput =
    document.getElementById("overallRatingValue") ||
    document.querySelector("[data-overall-rating-value]");

  ScoutReportCreateDOM.potentialRatingInput =
    document.getElementById("potentialRating") ||
    document.querySelector('[name="potentialRating"]');

  ScoutReportCreateDOM.potentialRatingOutput =
    document.getElementById("potentialRatingValue") ||
    document.querySelector("[data-potential-rating-value]");

  ScoutReportCreateDOM.summaryInput =
    document.getElementById("reportSummary") ||
    document.querySelector('[name="summary"]');

  ScoutReportCreateDOM.strengthsInput =
    document.getElementById("playerStrengths") ||
    document.querySelector('[name="strengths"]');

  ScoutReportCreateDOM.weaknessesInput =
    document.getElementById("developmentAreas") ||
    document.querySelector('[name="weaknesses"]');

  ScoutReportCreateDOM.recommendationInput =
    document.getElementById("scoutRecommendation") ||
    document.querySelector('[name="recommendation"]');

  ScoutReportCreateDOM.privateNotesInput =
    document.getElementById("privateScoutNotes") ||
    document.querySelector('[name="privateNotes"]');

  ScoutReportCreateDOM.recommendationStatusInput =
    document.getElementById("recommendationStatus") ||
    document.querySelector('[name="recommendationStatus"]');

  ScoutReportCreateDOM.priorityInput =
    document.getElementById("reportPriority") ||
    document.querySelector('[name="priority"]');

  ScoutReportCreateDOM.visibilityInput =
    document.getElementById("reportVisibility") ||
    document.querySelector('[name="visibility"]');

  ScoutReportCreateDOM.mediaInput =
    document.getElementById("reportMediaInput") ||
    document.querySelector('[name="reportMedia"]');

  ScoutReportCreateDOM.mediaDropzone =
    document.getElementById("reportMediaDropzone") ||
    document.querySelector("[data-media-dropzone]");

  ScoutReportCreateDOM.mediaPreviewList =
    document.getElementById("reportMediaPreviewList") ||
    document.querySelector("[data-media-preview-list]");

  ScoutReportCreateDOM.mediaCounter =
    document.getElementById("reportMediaCounter") ||
    document.querySelector("[data-media-counter]");

  ScoutReportCreateDOM.consentCheckbox =
    document.getElementById("playerConsentConfirmation") ||
    document.querySelector('[name="playerConsent"]');

  ScoutReportCreateDOM.confirmationCheckbox =
    document.getElementById("reportAccuracyConfirmation") ||
    document.querySelector('[name="accuracyConfirmation"]');

  ScoutReportCreateDOM.notificationContainer =
    document.getElementById("scoutNotificationContainer") ||
    document.querySelector("[data-notification-container]");

  ScoutReportCreateDOM.validationSummary =
    document.getElementById("reportValidationSummary") ||
    document.querySelector("[data-validation-summary]");

  ScoutReportCreateDOM.autosaveStatus =
    document.getElementById("reportAutosaveStatus") ||
    document.querySelector("[data-autosave-status]");

  ScoutReportCreateDOM.unsavedChangesBar =
    document.getElementById("reportUnsavedChangesBar") ||
    document.querySelector("[data-unsaved-changes-bar]");

  ScoutReportCreateDOM.unsavedChangesText =
    document.getElementById("reportUnsavedChangesText") ||
    document.querySelector("[data-unsaved-changes-text]");

  ScoutReportCreateDOM.characterCounterElements = Array.from(
    document.querySelectorAll("[data-character-counter]")
  );

  ScoutReportCreateState.totalSteps =
    ScoutReportCreateDOM.stepPanels.length || 1;
}


/* =========================================================
   GENERAL UTILITIES
========================================================= */

function safelyParseJSON(value, fallback = null) {
  if (typeof value !== "string" || value.trim() === "") {
    return fallback;
  }

  try {
    return JSON.parse(value);
  } catch (error) {
    console.warn("Unable to parse stored JSON data.", error);
    return fallback;
  }
}


function escapeHTML(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}


function normalizeText(value) {
  return String(value ?? "")
    .replace(/\s+/g, " ")
    .trim();
}


function clampNumber(value, minimum, maximum) {
  const parsedValue = Number(value);

  if (!Number.isFinite(parsedValue)) {
    return minimum;
  }

  return Math.min(Math.max(parsedValue, minimum), maximum);
}


function debounce(callback, delay = 300) {
  let timeoutId = null;

  return (...args) => {
    window.clearTimeout(timeoutId);

    timeoutId = window.setTimeout(() => {
      callback(...args);
    }, delay);
  };
}


function formatDateForInput(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}


function formatReadableDateTime(dateValue) {
  const date =
    dateValue instanceof Date
      ? dateValue
      : new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(date);
}


function generateClientReference(prefix = "SCR") {
  const timestamp = Date.now().toString(36).toUpperCase();
  const randomPart = Math.random()
    .toString(36)
    .slice(2, 8)
    .toUpperCase();

  return `${prefix}-${timestamp}-${randomPart}`;
}


function getAuthToken() {
  return (
    localStorage.getItem("fmi_access_token") ||
    sessionStorage.getItem("fmi_access_token") ||
    localStorage.getItem("accessToken") ||
    sessionStorage.getItem("accessToken") ||
    ""
  );
}


function setElementHidden(element, shouldHide) {
  if (!element) {
    return;
  }

  element.hidden = Boolean(shouldHide);
  element.setAttribute(
    "aria-hidden",
    shouldHide ? "true" : "false"
  );
}


function setButtonLoading(button, isLoading, loadingText = "Please wait...") {
  if (!button) {
    return;
  }

  if (isLoading) {
    if (!button.dataset.originalText) {
      button.dataset.originalText = button.innerHTML;
    }

    button.disabled = true;
    button.setAttribute("aria-busy", "true");

    button.innerHTML = `
      <span class="button-loading-spinner" aria-hidden="true"></span>
      <span>${escapeHTML(loadingText)}</span>
    `;

    return;
  }

  button.disabled = false;
  button.removeAttribute("aria-busy");

  if (button.dataset.originalText) {
    button.innerHTML = button.dataset.originalText;
    delete button.dataset.originalText;
  }
}


function scrollElementIntoView(element) {
  if (!element) {
    return;
  }

  element.scrollIntoView({
    behavior: "smooth",
    block: "center"
  });
}


/* =========================================================
   ACCESSIBLE NOTIFICATION SYSTEM
========================================================= */

function ensureNotificationContainer() {
  if (ScoutReportCreateDOM.notificationContainer) {
    return ScoutReportCreateDOM.notificationContainer;
  }

  const container = document.createElement("div");

  container.id = "scoutNotificationContainer";
  container.className = "scout-notification-container";
  container.setAttribute("data-notification-container", "");
  container.setAttribute("aria-live", "polite");
  container.setAttribute("aria-atomic", "false");

  document.body.appendChild(container);

  ScoutReportCreateDOM.notificationContainer = container;

  return container;
}


function showScoutNotification(
  message,
  type = "info",
  options = {}
) {
  const {
    title = "",
    duration = ScoutReportCreateConfig.notificationDuration,
    persistent = false
  } = options;

  const container = ensureNotificationContainer();
  const notification = document.createElement("div");
  const notificationId = generateClientReference("NOTIFY");

  const allowedTypes = [
    "success",
    "error",
    "warning",
    "info"
  ];

  const safeType = allowedTypes.includes(type)
    ? type
    : "info";

  notification.id = notificationId;
  notification.className =
    `scout-notification scout-notification-${safeType}`;

  notification.setAttribute(
    "role",
    safeType === "error" ? "alert" : "status"
  );

  notification.innerHTML = `
    <div class="scout-notification-icon" aria-hidden="true">
      ${getNotificationIcon(safeType)}
    </div>

    <div class="scout-notification-content">
      ${
        title
          ? `<strong class="scout-notification-title">${escapeHTML(title)}</strong>`
          : ""
      }

      <p class="scout-notification-message">
        ${escapeHTML(message)}
      </p>
    </div>

    <button
      class="scout-notification-close"
      type="button"
      aria-label="Close notification"
    >
      ×
    </button>
  `;

  container.appendChild(notification);

  window.requestAnimationFrame(() => {
    notification.classList.add("is-visible");
  });

  const closeButton = notification.querySelector(
    ".scout-notification-close"
  );

  const removeNotification = () => {
    notification.classList.remove("is-visible");
    notification.classList.add("is-leaving");

    window.setTimeout(() => {
      notification.remove();
    }, 250);
  };

  closeButton?.addEventListener(
    "click",
    removeNotification,
    { once: true }
  );

  if (!persistent && duration > 0) {
    window.setTimeout(removeNotification, duration);
  }

  return notificationId;
}


function getNotificationIcon(type) {
  const icons = {
    success: "✓",
    error: "!",
    warning: "⚠",
    info: "i"
  };

  return icons[type] || icons.info;
}


/* =========================================================
   RESPONSIVE SIDEBAR
========================================================= */

function openScoutSidebar() {
  if (!ScoutReportCreateDOM.sidebar) {
    return;
  }

  ScoutReportCreateDOM.sidebar.classList.add("is-open");
  ScoutReportCreateDOM.sidebarOverlay?.classList.add("is-visible");

  document.body.classList.add("scout-sidebar-open");

  ScoutReportCreateDOM.sidebarToggle?.setAttribute(
    "aria-expanded",
    "true"
  );

  ScoutReportCreateDOM.sidebar.setAttribute(
    "aria-hidden",
    "false"
  );
}


function closeScoutSidebar() {
  if (!ScoutReportCreateDOM.sidebar) {
    return;
  }

  ScoutReportCreateDOM.sidebar.classList.remove("is-open");
  ScoutReportCreateDOM.sidebarOverlay?.classList.remove(
    "is-visible"
  );

  document.body.classList.remove("scout-sidebar-open");

  ScoutReportCreateDOM.sidebarToggle?.setAttribute(
    "aria-expanded",
    "false"
  );

  if (window.matchMedia("(max-width: 991px)").matches) {
    ScoutReportCreateDOM.sidebar.setAttribute(
      "aria-hidden",
      "true"
    );
  }
}


function handleResponsiveSidebarState() {
  if (!ScoutReportCreateDOM.sidebar) {
    return;
  }

  const isMobile = window.matchMedia(
    "(max-width: 991px)"
  ).matches;

  if (!isMobile) {
    ScoutReportCreateDOM.sidebar.classList.remove("is-open");
    ScoutReportCreateDOM.sidebarOverlay?.classList.remove(
      "is-visible"
    );

    document.body.classList.remove("scout-sidebar-open");

    ScoutReportCreateDOM.sidebar.setAttribute(
      "aria-hidden",
      "false"
    );

    ScoutReportCreateDOM.sidebarToggle?.setAttribute(
      "aria-expanded",
      "false"
    );

    return;
  }

  const isOpen =
    ScoutReportCreateDOM.sidebar.classList.contains("is-open");

  ScoutReportCreateDOM.sidebar.setAttribute(
    "aria-hidden",
    isOpen ? "false" : "true"
  );
}


function initializeResponsiveSidebar() {
  ScoutReportCreateDOM.sidebarToggle?.addEventListener(
    "click",
    openScoutSidebar
  );

  ScoutReportCreateDOM.sidebarClose?.addEventListener(
    "click",
    closeScoutSidebar
  );

  ScoutReportCreateDOM.sidebarOverlay?.addEventListener(
    "click",
    closeScoutSidebar
  );

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") {
      return;
    }

    closeScoutSidebar();
    closePlayerSearchResults();
  });

  window.addEventListener(
    "resize",
    debounce(handleResponsiveSidebarState, 150)
  );

  handleResponsiveSidebarState();
}


/* =========================================================
   INITIAL FORM DEFAULTS
========================================================= */

function applyInitialFormDefaults() {
  const today = new Date();
  const formattedToday = formatDateForInput(today);

  if (
    ScoutReportCreateDOM.reportDateInput &&
    !ScoutReportCreateDOM.reportDateInput.value
  ) {
    ScoutReportCreateDOM.reportDateInput.value =
      formattedToday;
  }

  if (ScoutReportCreateDOM.matchDateInput) {
    ScoutReportCreateDOM.matchDateInput.max =
      formattedToday;
  }

  if (ScoutReportCreateDOM.reportDateInput) {
    ScoutReportCreateDOM.reportDateInput.max =
      formattedToday;
  }

  if (
    ScoutReportCreateDOM.overallRatingInput &&
    !ScoutReportCreateDOM.overallRatingInput.value
  ) {
    ScoutReportCreateDOM.overallRatingInput.value = "5";
  }

  if (
    ScoutReportCreateDOM.potentialRatingInput &&
    !ScoutReportCreateDOM.potentialRatingInput.value
  ) {
    ScoutReportCreateDOM.potentialRatingInput.value = "5";
  }

  updateRatingOutput(
    ScoutReportCreateDOM.overallRatingInput,
    ScoutReportCreateDOM.overallRatingOutput
  );

  updateRatingOutput(
    ScoutReportCreateDOM.potentialRatingInput,
    ScoutReportCreateDOM.potentialRatingOutput
  );
}


/* =========================================================
   RATING CONTROLS
========================================================= */

function updateRatingOutput(input, output) {
  if (!input || !output) {
    return;
  }

  const minimum = Number(input.min || 1);
  const maximum = Number(input.max || 10);
  const value = clampNumber(
    input.value,
    minimum,
    maximum
  );

  output.textContent = String(value);
  output.dataset.ratingValue = String(value);

  const percentage =
    maximum === minimum
      ? 0
      : ((value - minimum) / (maximum - minimum)) * 100;

  input.style.setProperty(
    "--range-progress",
    `${percentage}%`
  );

  updateRatingDescription(output, value);
}


function updateRatingDescription(output, value) {
  if (!output) {
    return;
  }

  let description = "Developing";

  if (value >= 9) {
    description = "Exceptional";
  } else if (value >= 8) {
    description = "Excellent";
  } else if (value >= 7) {
    description = "Very good";
  } else if (value >= 6) {
    description = "Good";
  } else if (value >= 5) {
    description = "Average";
  } else if (value >= 3) {
    description = "Needs development";
  }

  const descriptionElement =
    output.parentElement?.querySelector(
      "[data-rating-description]"
    );

  if (descriptionElement) {
    descriptionElement.textContent = description;
  }
}


function initializeRatingControls() {
  const ratingInputs = Array.from(
    document.querySelectorAll(
      'input[type="range"][data-rating], input[type="range"].scout-rating-input'
    )
  );

  ratingInputs.forEach((input) => {
    const targetId =
      input.dataset.outputTarget ||
      input.getAttribute("aria-controls");

    const output =
      (targetId && document.getElementById(targetId)) ||
      input.parentElement?.querySelector(
        "output, [data-rating-value]"
      );

    updateRatingOutput(input, output);

    input.addEventListener("input", () => {
      updateRatingOutput(input, output);
      markReportAsChanged();
      calculateSuggestedOverallRating();
    });
  });

  ScoutReportCreateDOM.overallRatingInput?.addEventListener(
    "input",
    () => {
      updateRatingOutput(
        ScoutReportCreateDOM.overallRatingInput,
        ScoutReportCreateDOM.overallRatingOutput
      );

      markReportAsChanged();
    }
  );

  ScoutReportCreateDOM.potentialRatingInput?.addEventListener(
    "input",
    () => {
      updateRatingOutput(
        ScoutReportCreateDOM.potentialRatingInput,
        ScoutReportCreateDOM.potentialRatingOutput
      );

      markReportAsChanged();
    }
  );
}


function calculateSuggestedOverallRating() {
  const categoryInputs = [
    ...ScoutReportCreateDOM.technicalInputs,
    ...ScoutReportCreateDOM.physicalInputs,
    ...ScoutReportCreateDOM.tacticalInputs,
    ...ScoutReportCreateDOM.mentalInputs
  ].filter((input) => {
    return (
      input instanceof HTMLInputElement &&
      input.type === "range" &&
      input.value !== ""
    );
  });

  if (
    categoryInputs.length === 0 ||
    !ScoutReportCreateDOM.overallRatingInput
  ) {
    return;
  }

  const total = categoryInputs.reduce(
    (sum, input) => sum + Number(input.value || 0),
    0
  );

  const average = Math.round(
    (total / categoryInputs.length) * 10
  ) / 10;

  const suggestedElement = document.querySelector(
    "[data-suggested-overall-rating]"
  );

  if (suggestedElement) {
    suggestedElement.textContent =
      average.toFixed(1);
  }
}


/* =========================================================
   PLAYER AGE CALCULATION
========================================================= */

function calculateAgeFromDateOfBirth(dateOfBirth) {
  if (!dateOfBirth) {
    return null;
  }

  const birthDate = new Date(`${dateOfBirth}T00:00:00`);

  if (Number.isNaN(birthDate.getTime())) {
    return null;
  }

  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();

  const monthDifference =
    today.getMonth() - birthDate.getMonth();

  if (
    monthDifference < 0 ||
    (
      monthDifference === 0 &&
      today.getDate() < birthDate.getDate()
    )
  ) {
    age -= 1;
  }

  return age >= 0 ? age : null;
}


function updatePlayerAgeFromDateOfBirth() {
  if (
    !ScoutReportCreateDOM.playerDobInput ||
    !ScoutReportCreateDOM.playerAgeInput
  ) {
    return;
  }

  const age = calculateAgeFromDateOfBirth(
    ScoutReportCreateDOM.playerDobInput.value
  );

  if (age === null) {
    return;
  }

  ScoutReportCreateDOM.playerAgeInput.value =
    String(age);

  ScoutReportCreateDOM.playerAgeInput.dispatchEvent(
    new Event("change", {
      bubbles: true
    })
  );
}


/* =========================================================
   PLAYER SEARCH UI
========================================================= */

function closePlayerSearchResults() {
  if (!ScoutReportCreateDOM.playerSearchResults) {
    return;
  }

  ScoutReportCreateDOM.playerSearchResults.innerHTML = "";
  ScoutReportCreateDOM.playerSearchResults.classList.remove(
    "is-visible"
  );

  ScoutReportCreateDOM.playerSearchInput?.setAttribute(
    "aria-expanded",
    "false"
  );

  ScoutReportCreateState.activeSearchIndex = -1;
}


function showPlayerSearchLoading() {
  if (!ScoutReportCreateDOM.playerSearchResults) {
    return;
  }

  ScoutReportCreateDOM.playerSearchResults.innerHTML = `
    <div class="player-search-state player-search-loading">
      <span
        class="player-search-spinner"
        aria-hidden="true"
      ></span>

      <span>Searching registered players...</span>
    </div>
  `;

  ScoutReportCreateDOM.playerSearchResults.classList.add(
    "is-visible"
  );

  ScoutReportCreateDOM.playerSearchInput?.setAttribute(
    "aria-expanded",
    "true"
  );
}


function showPlayerSearchMessage(message) {
  if (!ScoutReportCreateDOM.playerSearchResults) {
    return;
  }

  ScoutReportCreateDOM.playerSearchResults.innerHTML = `
    <div class="player-search-state">
      ${escapeHTML(message)}
    </div>
  `;

  ScoutReportCreateDOM.playerSearchResults.classList.add(
    "is-visible"
  );

  ScoutReportCreateDOM.playerSearchInput?.setAttribute(
    "aria-expanded",
    "true"
  );
}


/* =========================================================
   END OF SCOUT-REPORT-CREATE.JS — PART 1
   CONTINUE DIRECTLY WITH PART 2
========================================================= */

/* =========================================================
   SCOUT-REPORT-CREATE.JS
   PART 2A
   PLAYER SEARCH ENGINE AND PLAYER SELECTION
   CONTINUES DIRECTLY FROM PART 1
========================================================= */


/* =========================================================
   API REQUEST HELPER
========================================================= */

async function scoutApiRequest(
  url,
  options = {}
) {
  const {
    method = "GET",
    body = null,
    signal = null,
    headers = {}
  } = options;

  const requestHeaders = {
    Accept: "application/json",
    ...headers
  };

  const token = getAuthToken();

  if (token) {
    requestHeaders.Authorization = `Bearer ${token}`;
  }

  const requestOptions = {
    method,
    headers: requestHeaders,
    signal,
    credentials: "include"
  };

  if (body !== null) {
    if (body instanceof FormData) {
      requestOptions.body = body;
    } else {
      requestHeaders["Content-Type"] = "application/json";
      requestOptions.body = JSON.stringify(body);
    }
  }

  const response = await fetch(url, requestOptions);

  let responseData = null;

  const contentType =
    response.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    responseData = await response.json();
  } else {
    const responseText = await response.text();

    responseData = responseText
      ? {
          message: responseText
        }
      : null;
  }

  if (!response.ok) {
    const error = new Error(
      responseData?.message ||
      responseData?.detail ||
      "The request could not be completed."
    );

    error.status = response.status;
    error.data = responseData;

    throw error;
  }

  return responseData;
}


/* =========================================================
   PLAYER DATA NORMALIZATION
========================================================= */

function normalizePlayerSearchResult(player = {}) {
  const profile =
    player.profile ||
    player.playerProfile ||
    {};

  const academy =
    player.academy ||
    profile.academy ||
    {};

  const location =
    player.location ||
    profile.location ||
    {};

  const playerId =
    player.id ||
    player.playerId ||
    player.player_id ||
    profile.id ||
    "";

  const fullName =
    player.fullName ||
    player.full_name ||
    player.name ||
    profile.fullName ||
    profile.full_name ||
    "";

  const firstName =
    player.firstName ||
    player.first_name ||
    profile.firstName ||
    profile.first_name ||
    "";

  const lastName =
    player.lastName ||
    player.last_name ||
    profile.lastName ||
    profile.last_name ||
    "";

  const resolvedName =
    normalizeText(
      fullName ||
      `${firstName} ${lastName}`
    ) || "Unnamed Player";

  const dateOfBirth =
    player.dateOfBirth ||
    player.date_of_birth ||
    player.dob ||
    profile.dateOfBirth ||
    profile.date_of_birth ||
    profile.dob ||
    "";

  const resolvedAge =
    player.age ??
    profile.age ??
    calculateAgeFromDateOfBirth(dateOfBirth);

  const position =
    player.position ||
    player.primaryPosition ||
    player.primary_position ||
    profile.position ||
    profile.primaryPosition ||
    profile.primary_position ||
    "";

  const preferredFoot =
    player.preferredFoot ||
    player.preferred_foot ||
    profile.preferredFoot ||
    profile.preferred_foot ||
    "";

  const academyName =
    player.academyName ||
    player.academy_name ||
    academy.name ||
    profile.academyName ||
    profile.academy_name ||
    "";

  const city =
    player.city ||
    location.city ||
    profile.city ||
    "";

  const state =
    player.state ||
    location.state ||
    profile.state ||
    "";

  const country =
    player.country ||
    location.country ||
    profile.country ||
    "India";

  const locationText =
    player.locationText ||
    player.location_text ||
    normalizeText(
      [
        city,
        state,
        country
      ]
        .filter(Boolean)
        .join(", ")
    );

  const profileImage =
    player.profileImage ||
    player.profile_image ||
    player.avatar ||
    player.photoUrl ||
    player.photo_url ||
    profile.profileImage ||
    profile.profile_image ||
    profile.avatar ||
    "";

  const jerseyNumber =
    player.jerseyNumber ??
    player.jersey_number ??
    profile.jerseyNumber ??
    profile.jersey_number ??
    "";

  return {
    id: String(playerId),
    name: resolvedName,
    age:
      resolvedAge !== null &&
      resolvedAge !== undefined
        ? Number(resolvedAge)
        : null,
    dateOfBirth,
    position,
    preferredFoot,
    academyName,
    location: locationText,
    city,
    state,
    country,
    profileImage,
    jerseyNumber,
    registrationNumber:
      player.registrationNumber ||
      player.registration_number ||
      profile.registrationNumber ||
      profile.registration_number ||
      "",
    raw: player
  };
}


function normalizePlayerSearchResponse(responseData) {
  const possibleCollections = [
    responseData?.players,
    responseData?.results,
    responseData?.items,
    responseData?.data,
    responseData
  ];

  const playerCollection =
    possibleCollections.find(Array.isArray) || [];

  return playerCollection
    .map(normalizePlayerSearchResult)
    .filter((player) => {
      return player.id || player.name;
    });
}


/* =========================================================
   FRONTEND MOCK PLAYER SEARCH
   REMOVE OR DISABLE WHEN BACKEND IS CONNECTED
========================================================= */

function getMockPlayerSearchResults(searchTerm) {
  const mockPlayers = [
    {
      id: "player-demo-001",
      fullName: "Aarav Sharma",
      age: 16,
      dateOfBirth: "2010-03-14",
      position: "Centre Forward",
      preferredFoot: "Right",
      academyName: "Delhi Youth Football Academy",
      city: "New Delhi",
      state: "Delhi",
      country: "India",
      jerseyNumber: 9,
      profileImage: ""
    },
    {
      id: "player-demo-002",
      fullName: "Liam Kikon",
      age: 15,
      dateOfBirth: "2011-01-20",
      position: "Right Winger",
      preferredFoot: "Left",
      academyName: "Nagaland Football Academy",
      city: "Dimapur",
      state: "Nagaland",
      country: "India",
      jerseyNumber: 11,
      profileImage: ""
    },
    {
      id: "player-demo-003",
      fullName: "Rohan Singh",
      age: 17,
      dateOfBirth: "2009-06-08",
      position: "Central Midfielder",
      preferredFoot: "Right",
      academyName: "Punjab Elite Football Centre",
      city: "Ludhiana",
      state: "Punjab",
      country: "India",
      jerseyNumber: 8,
      profileImage: ""
    },
    {
      id: "player-demo-004",
      fullName: "Ningthoujam Dev",
      age: 16,
      dateOfBirth: "2010-09-02",
      position: "Centre Back",
      preferredFoot: "Right",
      academyName: "Manipur Football Development Centre",
      city: "Imphal",
      state: "Manipur",
      country: "India",
      jerseyNumber: 5,
      profileImage: ""
    },
    {
      id: "player-demo-005",
      fullName: "Sahil Fernandes",
      age: 15,
      dateOfBirth: "2011-02-17",
      position: "Goalkeeper",
      preferredFoot: "Right",
      academyName: "Goa Rising Stars Academy",
      city: "Margao",
      state: "Goa",
      country: "India",
      jerseyNumber: 1,
      profileImage: ""
    }
  ];

  const normalizedSearchTerm =
    normalizeText(searchTerm).toLowerCase();

  if (!normalizedSearchTerm) {
    return [];
  }

  return mockPlayers
    .filter((player) => {
      const searchableText = [
        player.fullName,
        player.position,
        player.academyName,
        player.city,
        player.state
      ]
        .join(" ")
        .toLowerCase();

      return searchableText.includes(
        normalizedSearchTerm
      );
    })
    .map(normalizePlayerSearchResult);
}


/* =========================================================
   PLAYER SEARCH REQUEST
========================================================= */

async function requestPlayerSearch(searchTerm) {
  if (
    ScoutReportCreateState.abortControllers.playerSearch
  ) {
    ScoutReportCreateState.abortControllers.playerSearch.abort();
  }

  const controller = new AbortController();

  ScoutReportCreateState.abortControllers.playerSearch =
    controller;

  const queryParameters = new URLSearchParams({
    q: searchTerm,
    limit: "10"
  });

  const requestUrl =
    `${ScoutReportCreateConfig.api.searchPlayers}` +
    `?${queryParameters.toString()}`;

  try {
    const responseData = await scoutApiRequest(
      requestUrl,
      {
        method: "GET",
        signal: controller.signal
      }
    );

    return normalizePlayerSearchResponse(
      responseData
    );
  } catch (error) {
    if (error.name === "AbortError") {
      return null;
    }

    /*
     * FRONTEND FALLBACK:
     * This fallback keeps the UI demonstrable before
     * Mr. Harsh connects the real player search API.
     */
    console.warn(
      "Player search API unavailable. Using demo data.",
      error
    );

    return getMockPlayerSearchResults(searchTerm);
  } finally {
    if (
      ScoutReportCreateState.abortControllers.playerSearch ===
      controller
    ) {
      ScoutReportCreateState.abortControllers.playerSearch =
        null;
    }
  }
}


/* =========================================================
   PLAYER SEARCH RESULT RENDERING
========================================================= */

function getPlayerInitials(playerName) {
  const parts = normalizeText(playerName)
    .split(" ")
    .filter(Boolean)
    .slice(0, 2);

  if (parts.length === 0) {
    return "P";
  }

  return parts
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}


function buildPlayerMetaText(player) {
  return [
    player.age
      ? `${player.age} years`
      : "",
    player.position,
    player.academyName
  ]
    .filter(Boolean)
    .join(" • ");
}


function buildPlayerLocationText(player) {
  return player.location || "Location not provided";
}


function renderPlayerSearchResults(players) {
  const container =
    ScoutReportCreateDOM.playerSearchResults;

  if (!container) {
    return;
  }

  ScoutReportCreateState.searchResults = players;
  ScoutReportCreateState.activeSearchIndex = -1;

  if (!players.length) {
    showPlayerSearchMessage(
      "No registered players matched your search."
    );

    return;
  }

  container.innerHTML = players
    .map((player, index) => {
      const playerMeta =
        buildPlayerMetaText(player);

      const playerLocation =
        buildPlayerLocationText(player);

      const avatarMarkup = player.profileImage
        ? `
          <img
            src="${escapeHTML(player.profileImage)}"
            alt=""
            loading="lazy"
            decoding="async"
          />
        `
        : `
          <span
            class="player-search-avatar-initials"
            aria-hidden="true"
          >
            ${escapeHTML(getPlayerInitials(player.name))}
          </span>
        `;

      return `
        <button
          class="player-search-result"
          type="button"
          role="option"
          id="playerSearchOption-${index}"
          data-player-result-index="${index}"
          aria-selected="false"
          tabindex="-1"
        >
          <span class="player-search-result-avatar">
            ${avatarMarkup}
          </span>

          <span class="player-search-result-content">
            <strong class="player-search-result-name">
              ${escapeHTML(player.name)}
            </strong>

            ${
              playerMeta
                ? `
                  <span class="player-search-result-meta">
                    ${escapeHTML(playerMeta)}
                  </span>
                `
                : ""
            }

            <span class="player-search-result-location">
              ${escapeHTML(playerLocation)}
            </span>
          </span>

          <span
            class="player-search-result-action"
            aria-hidden="true"
          >
            Select
          </span>
        </button>
      `;
    })
    .join("");

  container.classList.add("is-visible");

  ScoutReportCreateDOM.playerSearchInput?.setAttribute(
    "aria-expanded",
    "true"
  );

  const resultButtons = Array.from(
    container.querySelectorAll(
      "[data-player-result-index]"
    )
  );

  resultButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const resultIndex = Number(
        button.dataset.playerResultIndex
      );

      const selectedPlayer =
        ScoutReportCreateState.searchResults[
          resultIndex
        ];

      if (selectedPlayer) {
        selectPlayerForReport(selectedPlayer);
      }
    });

    button.addEventListener("mouseenter", () => {
      const resultIndex = Number(
        button.dataset.playerResultIndex
      );

      setActivePlayerSearchResult(resultIndex);
    });
  });
}


/* =========================================================
   PLAYER SEARCH EXECUTION
========================================================= */

async function executePlayerSearch(searchTerm) {
  const normalizedSearchTerm =
    normalizeText(searchTerm);

  if (normalizedSearchTerm.length < 2) {
    ScoutReportCreateState.searchResults = [];
    closePlayerSearchResults();

    return;
  }

  showPlayerSearchLoading();

  const players = await requestPlayerSearch(
    normalizedSearchTerm
  );

  if (players === null) {
    return;
  }

  const currentInputValue =
    normalizeText(
      ScoutReportCreateDOM.playerSearchInput?.value
    );

  if (currentInputValue !== normalizedSearchTerm) {
    return;
  }

  renderPlayerSearchResults(players);
}


function schedulePlayerSearch() {
  window.clearTimeout(
    ScoutReportCreateState.playerSearchTimer
  );

  const searchTerm =
    ScoutReportCreateDOM.playerSearchInput?.value || "";

  ScoutReportCreateState.playerSearchTimer =
    window.setTimeout(() => {
      executePlayerSearch(searchTerm);
    }, ScoutReportCreateConfig.searchDebounceDelay);
}


/* =========================================================
   KEYBOARD SEARCH NAVIGATION
========================================================= */

function getPlayerSearchResultButtons() {
  if (!ScoutReportCreateDOM.playerSearchResults) {
    return [];
  }

  return Array.from(
    ScoutReportCreateDOM.playerSearchResults.querySelectorAll(
      "[data-player-result-index]"
    )
  );
}


function setActivePlayerSearchResult(index) {
  const resultButtons =
    getPlayerSearchResultButtons();

  if (!resultButtons.length) {
    ScoutReportCreateState.activeSearchIndex = -1;
    return;
  }

  const normalizedIndex =
    ((index % resultButtons.length) +
      resultButtons.length) %
    resultButtons.length;

  ScoutReportCreateState.activeSearchIndex =
    normalizedIndex;

  resultButtons.forEach((button, buttonIndex) => {
    const isActive =
      buttonIndex === normalizedIndex;

    button.classList.toggle(
      "is-active",
      isActive
    );

    button.setAttribute(
      "aria-selected",
      isActive ? "true" : "false"
    );

    button.tabIndex = isActive ? 0 : -1;
  });

  const activeButton =
    resultButtons[normalizedIndex];

  ScoutReportCreateDOM.playerSearchInput?.setAttribute(
    "aria-activedescendant",
    activeButton.id
  );

  activeButton.scrollIntoView({
    block: "nearest"
  });
}


function handlePlayerSearchKeyboardNavigation(event) {
  const resultButtons =
    getPlayerSearchResultButtons();

  const isResultsVisible =
    ScoutReportCreateDOM.playerSearchResults
      ?.classList.contains("is-visible");

  if (event.key === "Escape") {
    closePlayerSearchResults();
    return;
  }

  if (!isResultsVisible || !resultButtons.length) {
    return;
  }

  if (event.key === "ArrowDown") {
    event.preventDefault();

    setActivePlayerSearchResult(
      ScoutReportCreateState.activeSearchIndex + 1
    );

    return;
  }

  if (event.key === "ArrowUp") {
    event.preventDefault();

    const nextIndex =
      ScoutReportCreateState.activeSearchIndex <= 0
        ? resultButtons.length - 1
        : ScoutReportCreateState.activeSearchIndex - 1;

    setActivePlayerSearchResult(nextIndex);

    return;
  }

  if (event.key === "Enter") {
    const activeIndex =
      ScoutReportCreateState.activeSearchIndex;

    if (activeIndex < 0) {
      return;
    }

    event.preventDefault();

    const selectedPlayer =
      ScoutReportCreateState.searchResults[
        activeIndex
      ];

    if (selectedPlayer) {
      selectPlayerForReport(selectedPlayer);
    }
  }
}


/* =========================================================
   PLAYER FORM POPULATION
========================================================= */

function safelySetFormValue(element, value) {
  if (!element) {
    return;
  }

  const resolvedValue =
    value === null || value === undefined
      ? ""
      : String(value);

  element.value = resolvedValue;

  element.dispatchEvent(
    new Event("input", {
      bubbles: true
    })
  );

  element.dispatchEvent(
    new Event("change", {
      bubbles: true
    })
  );
}


function populatePlayerFormFields(player) {
  safelySetFormValue(
    ScoutReportCreateDOM.selectedPlayerIdInput,
    player.id
  );

  safelySetFormValue(
    ScoutReportCreateDOM.playerNameInput,
    player.name
  );

  safelySetFormValue(
    ScoutReportCreateDOM.playerAgeInput,
    player.age
  );

  safelySetFormValue(
    ScoutReportCreateDOM.playerDobInput,
    player.dateOfBirth
  );

  safelySetFormValue(
    ScoutReportCreateDOM.playerPositionInput,
    player.position
  );

  safelySetFormValue(
    ScoutReportCreateDOM.preferredFootInput,
    player.preferredFoot
  );

  safelySetFormValue(
    ScoutReportCreateDOM.playerAcademyInput,
    player.academyName
  );

  safelySetFormValue(
    ScoutReportCreateDOM.playerLocationInput,
    player.location
  );

  safelySetFormValue(
    ScoutReportCreateDOM.jerseyNumberInput,
    player.jerseyNumber
  );
}


/* =========================================================
   SELECTED PLAYER CARD
========================================================= */

function renderSelectedPlayerCard(player) {
  const selectedPlayerCard =
    ScoutReportCreateDOM.selectedPlayerCard;

  if (!selectedPlayerCard) {
    return;
  }

  if (ScoutReportCreateDOM.selectedPlayerName) {
    ScoutReportCreateDOM.selectedPlayerName.textContent =
      player.name;
  }

  if (ScoutReportCreateDOM.selectedPlayerMeta) {
    ScoutReportCreateDOM.selectedPlayerMeta.textContent =
      [
        player.age
          ? `${player.age} years`
          : "",
        player.position,
        player.academyName,
        player.location
      ]
        .filter(Boolean)
        .join(" • ");
  }

  if (ScoutReportCreateDOM.selectedPlayerImage) {
    const imageElement =
      ScoutReportCreateDOM.selectedPlayerImage;

    if (
      imageElement instanceof HTMLImageElement &&
      player.profileImage
    ) {
      imageElement.src = player.profileImage;
      imageElement.alt = `${player.name} profile`;
      imageElement.hidden = false;
    } else if (
      imageElement instanceof HTMLImageElement
    ) {
      imageElement.removeAttribute("src");
      imageElement.alt = "";
      imageElement.hidden = true;
    } else {
      imageElement.textContent =
        getPlayerInitials(player.name);
    }
  }

  selectedPlayerCard.hidden = false;
  selectedPlayerCard.classList.add("is-visible");

  selectedPlayerCard.setAttribute(
    "aria-hidden",
    "false"
  );
}


/* =========================================================
   PLAYER SELECTION
========================================================= */

function selectPlayerForReport(player) {
  if (!player) {
    return;
  }

  const normalizedPlayer =
    normalizePlayerSearchResult(player);

  ScoutReportCreateState.selectedPlayer =
    normalizedPlayer;

  populatePlayerFormFields(normalizedPlayer);
  renderSelectedPlayerCard(normalizedPlayer);

  if (ScoutReportCreateDOM.playerSearchInput) {
    ScoutReportCreateDOM.playerSearchInput.value =
      normalizedPlayer.name;

    ScoutReportCreateDOM.playerSearchInput.setAttribute(
      "data-selected-player-id",
      normalizedPlayer.id
    );
  }

  closePlayerSearchResults();
  markReportAsChanged();

  showScoutNotification(
    `${normalizedPlayer.name} has been added to the report.`,
    "success",
    {
      title: "Player selected"
    }
  );
}


/* =========================================================
   CLEAR SELECTED PLAYER
========================================================= */

function clearSelectedPlayer(options = {}) {
  const {
    clearPlayerFields = true,
    notify = true
  } = options;

  ScoutReportCreateState.selectedPlayer = null;

  if (ScoutReportCreateDOM.selectedPlayerIdInput) {
    ScoutReportCreateDOM.selectedPlayerIdInput.value =
      "";
  }

  if (ScoutReportCreateDOM.playerSearchInput) {
    ScoutReportCreateDOM.playerSearchInput.value =
      "";

    ScoutReportCreateDOM.playerSearchInput.removeAttribute(
      "data-selected-player-id"
    );
  }

  if (clearPlayerFields) {
    const fieldsToClear = [
      ScoutReportCreateDOM.playerNameInput,
      ScoutReportCreateDOM.playerAgeInput,
      ScoutReportCreateDOM.playerDobInput,
      ScoutReportCreateDOM.playerPositionInput,
      ScoutReportCreateDOM.preferredFootInput,
      ScoutReportCreateDOM.playerAcademyInput,
      ScoutReportCreateDOM.playerLocationInput,
      ScoutReportCreateDOM.jerseyNumberInput
    ];

    fieldsToClear.forEach((field) => {
      if (field) {
        field.value = "";
      }
    });
  }

  if (ScoutReportCreateDOM.selectedPlayerCard) {
    ScoutReportCreateDOM.selectedPlayerCard.classList.remove(
      "is-visible"
    );

    ScoutReportCreateDOM.selectedPlayerCard.hidden = true;

    ScoutReportCreateDOM.selectedPlayerCard.setAttribute(
      "aria-hidden",
      "true"
    );
  }

  closePlayerSearchResults();
  markReportAsChanged();

  if (notify) {
    showScoutNotification(
      "The selected player has been removed.",
      "info"
    );
  }

  ScoutReportCreateDOM.playerSearchInput?.focus();
}


/* =========================================================
   PLAYER DETAILS FETCH
   BACKEND INTEGRATION PLACEHOLDER FOR MR. HARSH
========================================================= */

async function fetchPlayerById(playerId) {
  if (!playerId) {
    return null;
  }

  const requestUrl =
    `${ScoutReportCreateConfig.api.getPlayer}/` +
    `${encodeURIComponent(playerId)}`;

  try {
    const responseData = await scoutApiRequest(
      requestUrl,
      {
        method: "GET"
      }
    );

    const playerData =
      responseData?.player ||
      responseData?.data ||
      responseData;

    return normalizePlayerSearchResult(
      playerData
    );
  } catch (error) {
    console.error(
      "Unable to retrieve player details.",
      error
    );

    showScoutNotification(
      error.message ||
      "The player details could not be loaded.",
      "error",
      {
        title: "Player loading failed"
      }
    );

    return null;
  }
}


/* =========================================================
   RESTORE SELECTED PLAYER
========================================================= */

async function restoreSelectedPlayer(playerData) {
  if (!playerData) {
    return;
  }

  if (typeof playerData === "object") {
    selectPlayerForReport(playerData);
    return;
  }

  const restoredPlayer =
    await fetchPlayerById(playerData);

  if (restoredPlayer) {
    selectPlayerForReport(restoredPlayer);
  }
}


/* =========================================================
   CLICK OUTSIDE SEARCH RESULTS
========================================================= */

function handlePlayerSearchOutsideClick(event) {
  const searchInput =
    ScoutReportCreateDOM.playerSearchInput;

  const searchResults =
    ScoutReportCreateDOM.playerSearchResults;

  if (!searchInput || !searchResults) {
    return;
  }

  const clickedInsideInput =
    searchInput.contains(event.target);

  const clickedInsideResults =
    searchResults.contains(event.target);

  if (
    !clickedInsideInput &&
    !clickedInsideResults
  ) {
    closePlayerSearchResults();
  }
}


/* =========================================================
   PLAYER SEARCH ACCESSIBILITY
========================================================= */

function configurePlayerSearchAccessibility() {
  const searchInput =
    ScoutReportCreateDOM.playerSearchInput;

  const searchResults =
    ScoutReportCreateDOM.playerSearchResults;

  if (!searchInput || !searchResults) {
    return;
  }

  if (!searchResults.id) {
    searchResults.id = "playerSearchResults";
  }

  searchInput.setAttribute(
    "role",
    "combobox"
  );

  searchInput.setAttribute(
    "aria-autocomplete",
    "list"
  );

  searchInput.setAttribute(
    "aria-controls",
    searchResults.id
  );

  searchInput.setAttribute(
    "aria-expanded",
    "false"
  );

  searchResults.setAttribute(
    "role",
    "listbox"
  );

  searchResults.setAttribute(
    "aria-label",
    "Registered player search results"
  );
}


/* =========================================================
   INITIALIZE PLAYER SEARCH
========================================================= */

function initializePlayerSearch() {
  const searchInput =
    ScoutReportCreateDOM.playerSearchInput;

  configurePlayerSearchAccessibility();

  searchInput?.addEventListener(
    "input",
    () => {
      const selectedPlayerId =
        searchInput.getAttribute(
          "data-selected-player-id"
        );

      if (selectedPlayerId) {
        searchInput.removeAttribute(
          "data-selected-player-id"
        );

        ScoutReportCreateState.selectedPlayer =
          null;

        if (
          ScoutReportCreateDOM.selectedPlayerIdInput
        ) {
          ScoutReportCreateDOM.selectedPlayerIdInput.value =
            "";
        }

        if (
          ScoutReportCreateDOM.selectedPlayerCard
        ) {
          ScoutReportCreateDOM.selectedPlayerCard.hidden =
            true;

          ScoutReportCreateDOM.selectedPlayerCard.classList.remove(
            "is-visible"
          );
        }
      }

      schedulePlayerSearch();
    }
  );

  searchInput?.addEventListener(
    "keydown",
    handlePlayerSearchKeyboardNavigation
  );

  searchInput?.addEventListener(
    "focus",
    () => {
      const searchTerm =
        normalizeText(searchInput.value);

      if (
        searchTerm.length >= 2 &&
        ScoutReportCreateState.searchResults.length
      ) {
        renderPlayerSearchResults(
          ScoutReportCreateState.searchResults
        );
      }
    }
  );

  ScoutReportCreateDOM.clearSelectedPlayerButton
    ?.addEventListener(
      "click",
      () => {
        clearSelectedPlayer();
      }
    );

  ScoutReportCreateDOM.playerDobInput
    ?.addEventListener(
      "change",
      updatePlayerAgeFromDateOfBirth
    );

  document.addEventListener(
    "click",
    handlePlayerSearchOutsideClick
  );
}


/* =========================================================
   END OF SCOUT-REPORT-CREATE.JS — PART 2A
   CONTINUE DIRECTLY WITH PART 2B
========================================================= */

/* =========================================================
   SCOUT-REPORT-CREATE.JS
   PART 2B
   MEDIA UPLOAD, VALIDATION AND PREVIEW SYSTEM
   CONTINUES DIRECTLY FROM PART 2A
========================================================= */


/* =========================================================
   MEDIA FILE HELPERS
========================================================= */

function isAllowedImageFile(file) {
  return (
    file instanceof File &&
    ScoutReportCreateConfig.allowedImageTypes.includes(
      file.type
    )
  );
}


function isAllowedVideoFile(file) {
  return (
    file instanceof File &&
    ScoutReportCreateConfig.allowedVideoTypes.includes(
      file.type
    )
  );
}


function isAllowedMediaFile(file) {
  return (
    isAllowedImageFile(file) ||
    isAllowedVideoFile(file)
  );
}


function getMediaFileCategory(file) {
  if (isAllowedImageFile(file)) {
    return "image";
  }

  if (isAllowedVideoFile(file)) {
    return "video";
  }

  return "unsupported";
}


function getMaximumFileSize(file) {
  const category = getMediaFileCategory(file);

  if (category === "image") {
    return ScoutReportCreateConfig.limits.maxImageSize;
  }

  if (category === "video") {
    return ScoutReportCreateConfig.limits.maxVideoSize;
  }

  return 0;
}


function formatFileSize(sizeInBytes) {
  const bytes = Number(sizeInBytes);

  if (!Number.isFinite(bytes) || bytes <= 0) {
    return "0 bytes";
  }

  const units = [
    "bytes",
    "KB",
    "MB",
    "GB"
  ];

  const unitIndex = Math.min(
    Math.floor(Math.log(bytes) / Math.log(1024)),
    units.length - 1
  );

  const size =
    bytes / Math.pow(1024, unitIndex);

  const decimals =
    unitIndex === 0 || size >= 10
      ? 0
      : 1;

  return `${size.toFixed(decimals)} ${units[unitIndex]}`;
}


function createMediaFileId(file) {
  return [
    file.name,
    file.size,
    file.lastModified,
    file.type
  ].join("-");
}


function sanitizeMediaFileName(fileName) {
  return normalizeText(fileName)
    .replace(/[^\w.\-()\s]/g, "")
    .slice(0, 120);
}


function isDuplicateMediaFile(file) {
  const fileId = createMediaFileId(file);

  return ScoutReportCreateState.uploadedFiles.some(
    (mediaItem) => mediaItem.id === fileId
  );
}


/* =========================================================
   MEDIA FILE VALIDATION
========================================================= */

function validateSingleMediaFile(file) {
  if (!(file instanceof File)) {
    return {
      valid: false,
      message: "An invalid file was selected."
    };
  }

  if (!isAllowedMediaFile(file)) {
    return {
      valid: false,
      message:
        `${file.name} is not supported. ` +
        "Upload JPG, PNG, WEBP, MP4, WEBM or MOV files."
    };
  }

  const maximumSize = getMaximumFileSize(file);

  if (file.size > maximumSize) {
    const fileCategory =
      getMediaFileCategory(file);

    return {
      valid: false,
      message:
        `${file.name} exceeds the ` +
        `${formatFileSize(maximumSize)} ` +
        `${fileCategory} upload limit.`
    };
  }

  if (file.size <= 0) {
    return {
      valid: false,
      message: `${file.name} appears to be empty.`
    };
  }

  if (isDuplicateMediaFile(file)) {
    return {
      valid: false,
      message: `${file.name} has already been selected.`
    };
  }

  return {
    valid: true,
    message: ""
  };
}


function validateMediaFileCollection(files) {
  const acceptedFiles = [];
  const rejectedFiles = [];

  const availableSlots =
    ScoutReportCreateConfig.limits.maxMediaFiles -
    ScoutReportCreateState.uploadedFiles.length;

  Array.from(files || []).forEach((file) => {
    if (acceptedFiles.length >= availableSlots) {
      rejectedFiles.push({
        file,
        message:
          `A maximum of ` +
          `${ScoutReportCreateConfig.limits.maxMediaFiles} ` +
          "media files can be attached."
      });

      return;
    }

    const validationResult =
      validateSingleMediaFile(file);

    if (validationResult.valid) {
      acceptedFiles.push(file);
    } else {
      rejectedFiles.push({
        file,
        message: validationResult.message
      });
    }
  });

  return {
    acceptedFiles,
    rejectedFiles
  };
}


/* =========================================================
   MEDIA PREVIEW CREATION
========================================================= */

function createMediaPreviewUrl(file) {
  try {
    return URL.createObjectURL(file);
  } catch (error) {
    console.error(
      "Unable to create media preview URL.",
      error
    );

    return "";
  }
}


function revokeMediaPreviewUrl(mediaItem) {
  if (!mediaItem?.previewUrl) {
    return;
  }

  try {
    URL.revokeObjectURL(mediaItem.previewUrl);
  } catch (error) {
    console.warn(
      "Unable to revoke media preview URL.",
      error
    );
  }
}


function createMediaStateItem(file) {
  return {
    id: createMediaFileId(file),
    file,
    name: sanitizeMediaFileName(file.name),
    size: file.size,
    type: file.type,
    category: getMediaFileCategory(file),
    previewUrl: createMediaPreviewUrl(file),
    status: "pending",
    progress: 0,
    serverMediaId: "",
    serverUrl: "",
    errorMessage: ""
  };
}


/* =========================================================
   MEDIA PREVIEW RENDERING
========================================================= */

function buildMediaPreviewMarkup(mediaItem, index) {
  const safeName = escapeHTML(mediaItem.name);
  const safeType = escapeHTML(mediaItem.type);
  const safeSize = escapeHTML(
    formatFileSize(mediaItem.size)
  );

  let previewMarkup = `
    <div
      class="report-media-file-icon"
      aria-hidden="true"
    >
      FILE
    </div>
  `;

  if (
    mediaItem.category === "image" &&
    mediaItem.previewUrl
  ) {
    previewMarkup = `
      <img
        class="report-media-preview-image"
        src="${escapeHTML(mediaItem.previewUrl)}"
        alt="Preview of ${safeName}"
        loading="lazy"
        decoding="async"
      />
    `;
  }

  if (
    mediaItem.category === "video" &&
    mediaItem.previewUrl
  ) {
    previewMarkup = `
      <video
        class="report-media-preview-video"
        src="${escapeHTML(mediaItem.previewUrl)}"
        preload="metadata"
        muted
        playsinline
        aria-label="Preview of ${safeName}"
      ></video>

      <span
        class="report-media-video-badge"
        aria-hidden="true"
      >
        VIDEO
      </span>
    `;
  }

  const statusText =
    mediaItem.status === "uploaded"
      ? "Uploaded"
      : mediaItem.status === "uploading"
        ? `Uploading ${Math.round(mediaItem.progress)}%`
        : mediaItem.status === "failed"
          ? "Upload failed"
          : "Ready to upload";

  return `
    <article
      class="report-media-preview-item
      ${mediaItem.status === "failed" ? "has-error" : ""}
      ${mediaItem.status === "uploaded" ? "is-uploaded" : ""}"
      data-media-item-id="${escapeHTML(mediaItem.id)}"
      data-media-index="${index}"
    >
      <div class="report-media-preview-visual">
        ${previewMarkup}
      </div>

      <div class="report-media-preview-content">
        <div class="report-media-preview-heading">
          <strong title="${safeName}">
            ${safeName}
          </strong>

          <button
            class="report-media-remove-button"
            type="button"
            data-remove-media-id="${escapeHTML(mediaItem.id)}"
            aria-label="Remove ${safeName}"
          >
            ×
          </button>
        </div>

        <div class="report-media-preview-meta">
          <span>${safeSize}</span>
          <span>${safeType}</span>
        </div>

        <div
          class="report-media-upload-status"
          data-media-status
        >
          ${escapeHTML(statusText)}
        </div>

        <div
          class="report-media-progress"
          role="progressbar"
          aria-label="Upload progress for ${safeName}"
          aria-valuemin="0"
          aria-valuemax="100"
          aria-valuenow="${Math.round(mediaItem.progress)}"
          ${
            mediaItem.status === "uploading"
              ? ""
              : "hidden"
          }
        >
          <span
            class="report-media-progress-bar"
            style="width: ${clampNumber(
              mediaItem.progress,
              0,
              100
            )}%"
          ></span>
        </div>

        ${
          mediaItem.errorMessage
            ? `
              <p class="report-media-error-message">
                ${escapeHTML(mediaItem.errorMessage)}
              </p>
            `
            : ""
        }
      </div>
    </article>
  `;
}


function renderMediaPreviewList() {
  const previewList =
    ScoutReportCreateDOM.mediaPreviewList;

  if (!previewList) {
    updateMediaCounter();
    return;
  }

  if (
    ScoutReportCreateState.uploadedFiles.length === 0
  ) {
    previewList.innerHTML = `
      <div class="report-media-empty-state">
        No media files selected.
      </div>
    `;

    previewList.classList.add("is-empty");
    updateMediaCounter();

    return;
  }

  previewList.classList.remove("is-empty");

  previewList.innerHTML =
    ScoutReportCreateState.uploadedFiles
      .map(buildMediaPreviewMarkup)
      .join("");

  previewList
    .querySelectorAll("[data-remove-media-id]")
    .forEach((removeButton) => {
      removeButton.addEventListener("click", () => {
        const mediaId =
          removeButton.dataset.removeMediaId;

        removeMediaFile(mediaId);
      });
    });

  updateMediaCounter();
}


/* =========================================================
   MEDIA COUNTER
========================================================= */

function updateMediaCounter() {
  const currentCount =
    ScoutReportCreateState.uploadedFiles.length;

  const maximumCount =
    ScoutReportCreateConfig.limits.maxMediaFiles;

  if (ScoutReportCreateDOM.mediaCounter) {
    ScoutReportCreateDOM.mediaCounter.textContent =
      `${currentCount} / ${maximumCount}`;
  }

  if (ScoutReportCreateDOM.mediaInput) {
    ScoutReportCreateDOM.mediaInput.disabled =
      currentCount >= maximumCount;
  }

  ScoutReportCreateDOM.mediaDropzone?.classList.toggle(
    "is-disabled",
    currentCount >= maximumCount
  );

  ScoutReportCreateDOM.mediaDropzone?.setAttribute(
    "aria-disabled",
    currentCount >= maximumCount
      ? "true"
      : "false"
  );
}


/* =========================================================
   ADD MEDIA FILES
========================================================= */

function addMediaFiles(files) {
  const {
    acceptedFiles,
    rejectedFiles
  } = validateMediaFileCollection(files);

  acceptedFiles.forEach((file) => {
    const mediaItem =
      createMediaStateItem(file);

    ScoutReportCreateState.uploadedFiles.push(
      mediaItem
    );
  });

  rejectedFiles.forEach(({ message }) => {
    showScoutNotification(
      message,
      "warning",
      {
        title: "File not added"
      }
    );
  });

  if (acceptedFiles.length > 0) {
    renderMediaPreviewList();
    markReportAsChanged();

    showScoutNotification(
      `${acceptedFiles.length} media ` +
      `${acceptedFiles.length === 1 ? "file" : "files"} ` +
      "added to the report.",
      "success"
    );
  }

  if (ScoutReportCreateDOM.mediaInput) {
    ScoutReportCreateDOM.mediaInput.value = "";
  }
}


/* =========================================================
   REMOVE MEDIA FILE
========================================================= */

function removeMediaFile(mediaId, options = {}) {
  const {
    notify = true,
    markChanged = true
  } = options;

  const mediaIndex =
    ScoutReportCreateState.uploadedFiles.findIndex(
      (mediaItem) => mediaItem.id === mediaId
    );

  if (mediaIndex < 0) {
    return;
  }

  const [removedMediaItem] =
    ScoutReportCreateState.uploadedFiles.splice(
      mediaIndex,
      1
    );

  revokeMediaPreviewUrl(removedMediaItem);

  if (removedMediaItem.serverMediaId) {
    ScoutReportCreateState.uploadedMediaIds =
      ScoutReportCreateState.uploadedMediaIds.filter(
        (mediaServerId) =>
          mediaServerId !==
          removedMediaItem.serverMediaId
      );
  }

  renderMediaPreviewList();

  if (markChanged) {
    markReportAsChanged();
  }

  if (notify) {
    showScoutNotification(
      `${removedMediaItem.name} was removed.`,
      "info"
    );
  }
}


/* =========================================================
   CLEAR ALL MEDIA FILES
========================================================= */

function clearAllMediaFiles(options = {}) {
  const {
    notify = false,
    markChanged = true
  } = options;

  ScoutReportCreateState.uploadedFiles.forEach(
    revokeMediaPreviewUrl
  );

  ScoutReportCreateState.uploadedFiles = [];
  ScoutReportCreateState.uploadedMediaIds = [];

  if (ScoutReportCreateDOM.mediaInput) {
    ScoutReportCreateDOM.mediaInput.value = "";
  }

  renderMediaPreviewList();

  if (markChanged) {
    markReportAsChanged();
  }

  if (notify) {
    showScoutNotification(
      "All report media files were removed.",
      "info"
    );
  }
}


/* =========================================================
   DRAG AND DROP MEDIA
========================================================= */

function preventMediaDragDefaults(event) {
  event.preventDefault();
  event.stopPropagation();
}


function handleMediaDragEnter(event) {
  preventMediaDragDefaults(event);

  if (
    ScoutReportCreateDOM.mediaDropzone
      ?.classList.contains("is-disabled")
  ) {
    return;
  }

  ScoutReportCreateDOM.mediaDropzone?.classList.add(
    "is-drag-active"
  );
}


function handleMediaDragLeave(event) {
  preventMediaDragDefaults(event);

  const dropzone =
    ScoutReportCreateDOM.mediaDropzone;

  if (!dropzone) {
    return;
  }

  if (
    event.relatedTarget &&
    dropzone.contains(event.relatedTarget)
  ) {
    return;
  }

  dropzone.classList.remove("is-drag-active");
}


function handleMediaDrop(event) {
  preventMediaDragDefaults(event);

  const dropzone =
    ScoutReportCreateDOM.mediaDropzone;

  dropzone?.classList.remove("is-drag-active");

  if (
    dropzone?.classList.contains("is-disabled")
  ) {
    showScoutNotification(
      `Only ${ScoutReportCreateConfig.limits.maxMediaFiles} ` +
      "media files can be attached.",
      "warning"
    );

    return;
  }

  const droppedFiles =
    event.dataTransfer?.files;

  if (!droppedFiles?.length) {
    return;
  }

  addMediaFiles(droppedFiles);
}


/* =========================================================
   MEDIA DROPZONE KEYBOARD SUPPORT
========================================================= */

function handleMediaDropzoneKeydown(event) {
  if (
    event.key !== "Enter" &&
    event.key !== " "
  ) {
    return;
  }

  event.preventDefault();

  if (
    ScoutReportCreateDOM.mediaDropzone
      ?.classList.contains("is-disabled")
  ) {
    return;
  }

  ScoutReportCreateDOM.mediaInput?.click();
}


/* =========================================================
   UPDATE MEDIA ITEM STATUS
========================================================= */

function updateMediaItemState(
  mediaId,
  updates = {}
) {
  const mediaItem =
    ScoutReportCreateState.uploadedFiles.find(
      (item) => item.id === mediaId
    );

  if (!mediaItem) {
    return null;
  }

  Object.assign(mediaItem, updates);

  renderMediaPreviewList();

  return mediaItem;
}


/* =========================================================
   MOCK MEDIA UPLOAD
   FRONTEND DEMONSTRATION ONLY
========================================================= */

function simulateMediaUploadProgress(
  mediaItem,
  signal
) {
  return new Promise((resolve, reject) => {
    let progress = 0;

    const intervalId = window.setInterval(() => {
      if (signal?.aborted) {
        window.clearInterval(intervalId);

        const abortError = new DOMException(
          "Upload cancelled.",
          "AbortError"
        );

        reject(abortError);
        return;
      }

      progress += Math.floor(
        Math.random() * 18
      ) + 8;

      progress = Math.min(progress, 100);

      mediaItem.progress = progress;
      mediaItem.status = "uploading";

      renderMediaPreviewList();

      if (progress >= 100) {
        window.clearInterval(intervalId);

        const mockMediaId =
          generateClientReference("MEDIA");

        resolve({
          id: mockMediaId,
          mediaId: mockMediaId,
          url: mediaItem.previewUrl,
          type: mediaItem.category
        });
      }
    }, 180);
  });
}


/* =========================================================
   UPLOAD SINGLE MEDIA FILE
   BACKEND PLACEHOLDER FOR MR. HARSH
========================================================= */

async function uploadSingleMediaFile(
  mediaItem,
  signal = null
) {
  if (!mediaItem?.file) {
    throw new Error(
      "The selected media file is unavailable."
    );
  }

  mediaItem.status = "uploading";
  mediaItem.progress = 0;
  mediaItem.errorMessage = "";

  renderMediaPreviewList();

  const formData = new FormData();

  formData.append(
    "file",
    mediaItem.file,
    mediaItem.name
  );

  formData.append(
    "media_type",
    mediaItem.category
  );

  formData.append(
    "client_reference",
    mediaItem.id
  );

  /*
   * MR. HARSH BACKEND CONTRACT SUGGESTION
   *
   * POST /api/v1/scout/reports/media
   *
   * Request:
   * multipart/form-data
   * file
   * media_type
   * client_reference
   *
   * Suggested response:
   * {
   *   "media": {
   *     "id": "uuid",
   *     "url": "https://...",
   *     "type": "image"
   *   }
   * }
   */

  try {
    const responseData = await scoutApiRequest(
      ScoutReportCreateConfig.api.uploadMedia,
      {
        method: "POST",
        body: formData,
        signal
      }
    );

    const uploadedMedia =
      responseData?.media ||
      responseData?.data ||
      responseData;

    const mediaServerId =
      uploadedMedia?.id ||
      uploadedMedia?.mediaId ||
      uploadedMedia?.media_id ||
      "";

    if (!mediaServerId) {
      throw new Error(
        "The server did not return a media ID."
      );
    }

    return {
      id: String(mediaServerId),
      mediaId: String(mediaServerId),
      url:
        uploadedMedia?.url ||
        uploadedMedia?.mediaUrl ||
        uploadedMedia?.media_url ||
        "",
      type:
        uploadedMedia?.type ||
        mediaItem.category
    };
  } catch (error) {
    if (error.name === "AbortError") {
      throw error;
    }

    /*
     * FRONTEND FALLBACK:
     * Use simulated uploads while the backend endpoint
     * is unavailable during frontend development.
     */
    console.warn(
      "Media upload API unavailable. Using simulated upload.",
      error
    );

    return simulateMediaUploadProgress(
      mediaItem,
      signal
    );
  }
}


/* =========================================================
   UPLOAD ALL PENDING MEDIA FILES
========================================================= */

async function uploadPendingMediaFiles() {
  const pendingMediaItems =
    ScoutReportCreateState.uploadedFiles.filter(
      (mediaItem) =>
        mediaItem.status !== "uploaded" ||
        !mediaItem.serverMediaId
    );

  if (pendingMediaItems.length === 0) {
    return ScoutReportCreateState.uploadedMediaIds;
  }

  if (
    ScoutReportCreateState.abortControllers.upload
  ) {
    ScoutReportCreateState.abortControllers.upload.abort();
  }

  const controller = new AbortController();

  ScoutReportCreateState.abortControllers.upload =
    controller;

  const uploadedIds = [];

  try {
    for (const mediaItem of pendingMediaItems) {
      try {
        const uploadResult =
          await uploadSingleMediaFile(
            mediaItem,
            controller.signal
          );

        mediaItem.status = "uploaded";
        mediaItem.progress = 100;
        mediaItem.serverMediaId =
          uploadResult.mediaId || uploadResult.id;
        mediaItem.serverUrl =
          uploadResult.url || "";
        mediaItem.errorMessage = "";

        uploadedIds.push(
          mediaItem.serverMediaId
        );

        renderMediaPreviewList();
      } catch (error) {
        if (error.name === "AbortError") {
          throw error;
        }

        mediaItem.status = "failed";
        mediaItem.progress = 0;
        mediaItem.errorMessage =
          error.message ||
          "The file could not be uploaded.";

        renderMediaPreviewList();

        throw new Error(
          `${mediaItem.name} could not be uploaded.`
        );
      }
    }

    const existingUploadedIds =
      ScoutReportCreateState.uploadedFiles
        .map((mediaItem) => mediaItem.serverMediaId)
        .filter(Boolean);

    ScoutReportCreateState.uploadedMediaIds =
      Array.from(
        new Set([
          ...ScoutReportCreateState.uploadedMediaIds,
          ...existingUploadedIds,
          ...uploadedIds
        ])
      );

    return ScoutReportCreateState.uploadedMediaIds;
  } finally {
    if (
      ScoutReportCreateState.abortControllers.upload ===
      controller
    ) {
      ScoutReportCreateState.abortControllers.upload =
        null;
    }
  }
}


/* =========================================================
   RETRY FAILED MEDIA UPLOAD
========================================================= */

async function retryMediaUpload(mediaId) {
  const mediaItem =
    ScoutReportCreateState.uploadedFiles.find(
      (item) => item.id === mediaId
    );

  if (!mediaItem) {
    return;
  }

  mediaItem.status = "pending";
  mediaItem.progress = 0;
  mediaItem.errorMessage = "";

  renderMediaPreviewList();

  try {
    await uploadPendingMediaFiles();

    showScoutNotification(
      `${mediaItem.name} uploaded successfully.`,
      "success"
    );
  } catch (error) {
    showScoutNotification(
      error.message ||
      "The media upload could not be completed.",
      "error",
      {
        title: "Upload failed"
      }
    );
  }
}


/* =========================================================
   RESTORE MEDIA METADATA FROM DRAFT
========================================================= */

function restoreDraftMediaItems(mediaItems = []) {
  clearAllMediaFiles({
    notify: false,
    markChanged: false
  });

  if (!Array.isArray(mediaItems)) {
    return;
  }

  const restoredItems = mediaItems
    .slice(
      0,
      ScoutReportCreateConfig.limits.maxMediaFiles
    )
    .map((mediaItem, index) => {
      const mediaServerId =
        mediaItem.serverMediaId ||
        mediaItem.mediaId ||
        mediaItem.id ||
        "";

      return {
        id:
          mediaItem.clientId ||
          `restored-media-${index}-${mediaServerId}`,
        file: null,
        name:
          mediaItem.name ||
          `Uploaded media ${index + 1}`,
        size: Number(mediaItem.size || 0),
        type:
          mediaItem.type ||
          "application/octet-stream",
        category:
          mediaItem.category ||
          (
            String(mediaItem.type || "")
              .startsWith("video/")
              ? "video"
              : "image"
          ),
        previewUrl:
          mediaItem.url ||
          mediaItem.serverUrl ||
          "",
        status:
          mediaServerId
            ? "uploaded"
            : "pending",
        progress:
          mediaServerId
            ? 100
            : 0,
        serverMediaId:
          String(mediaServerId),
        serverUrl:
          mediaItem.url ||
          mediaItem.serverUrl ||
          "",
        errorMessage: ""
      };
    });

  ScoutReportCreateState.uploadedFiles =
    restoredItems;

  ScoutReportCreateState.uploadedMediaIds =
    restoredItems
      .map((mediaItem) => mediaItem.serverMediaId)
      .filter(Boolean);

  renderMediaPreviewList();
}


/* =========================================================
   SERIALIZE MEDIA FOR LOCAL DRAFT
========================================================= */

function serializeMediaForDraft() {
  return ScoutReportCreateState.uploadedFiles.map(
    (mediaItem) => ({
      clientId: mediaItem.id,
      name: mediaItem.name,
      size: mediaItem.size,
      type: mediaItem.type,
      category: mediaItem.category,
      status: mediaItem.status,
      serverMediaId: mediaItem.serverMediaId,
      serverUrl: mediaItem.serverUrl,
      url:
        mediaItem.serverUrl ||
        (
          mediaItem.status === "uploaded"
            ? mediaItem.previewUrl
            : ""
        )
    })
  );
}


/* =========================================================
   MEDIA INPUT INITIALIZATION
========================================================= */

function initializeMediaUpload() {
  const mediaInput =
    ScoutReportCreateDOM.mediaInput;

  const dropzone =
    ScoutReportCreateDOM.mediaDropzone;

  mediaInput?.addEventListener(
    "change",
    () => {
      if (mediaInput.files?.length) {
        addMediaFiles(mediaInput.files);
      }
    }
  );

  if (dropzone) {
    dropzone.setAttribute(
      "role",
      dropzone.getAttribute("role") || "button"
    );

    if (!dropzone.hasAttribute("tabindex")) {
      dropzone.tabIndex = 0;
    }

    dropzone.setAttribute(
      "aria-label",
      dropzone.getAttribute("aria-label") ||
      "Upload scouting report photos or videos"
    );

    [
      "dragenter",
      "dragover"
    ].forEach((eventName) => {
      dropzone.addEventListener(
        eventName,
        handleMediaDragEnter
      );
    });

    dropzone.addEventListener(
      "dragleave",
      handleMediaDragLeave
    );

    dropzone.addEventListener(
      "drop",
      handleMediaDrop
    );

    dropzone.addEventListener(
      "keydown",
      handleMediaDropzoneKeydown
    );

    dropzone.addEventListener("click", (event) => {
      if (
        event.target.closest(
          "button, a, input, video"
        )
      ) {
        return;
      }

      if (
        dropzone.classList.contains("is-disabled")
      ) {
        return;
      }

      mediaInput?.click();
    });
  }

  renderMediaPreviewList();
}


/* =========================================================
   MEDIA CLEANUP BEFORE PAGE UNLOAD
========================================================= */

function cleanupMediaResources() {
  ScoutReportCreateState.uploadedFiles.forEach(
    (mediaItem) => {
      if (
        mediaItem.file &&
        mediaItem.previewUrl
      ) {
        revokeMediaPreviewUrl(mediaItem);
      }
    }
  );

  ScoutReportCreateState.abortControllers.upload
    ?.abort();
}


/* =========================================================
   END OF SCOUT-REPORT-CREATE.JS — PART 2B
   CONTINUE DIRECTLY WITH PART 2C
========================================================= */

/* =========================================================
   SCOUT-REPORT-CREATE.JS
   PART 2C
   FORM VALIDATION, STEP VALIDATION AND ERROR DISPLAY
   CONTINUES DIRECTLY FROM PART 2B
========================================================= */


/* =========================================================
   VALIDATION CONFIGURATION
========================================================= */

const ScoutReportValidationRules = Object.freeze({
  reportTitle: {
    required: true,
    minLength: 4,
    maxLength: 150,
    label: "Report title"
  },

  reportDate: {
    required: true,
    label: "Report date"
  },

  matchDate: {
    required: true,
    label: "Match date"
  },

  competition: {
    required: true,
    minLength: 2,
    maxLength: 120,
    label: "Competition"
  },

  venue: {
    required: true,
    minLength: 2,
    maxLength: 150,
    label: "Venue"
  },

  playerName: {
    required: true,
    minLength: 2,
    maxLength:
      ScoutReportCreateConfig.limits.playerName,
    label: "Player name"
  },

  playerAge: {
    required: true,
    minimum: 5,
    maximum: 45,
    label: "Player age"
  },

  playerPosition: {
    required: true,
    label: "Player position"
  },

  preferredFoot: {
    required: true,
    label: "Preferred foot"
  },

  playerAcademy: {
    required: false,
    maxLength:
      ScoutReportCreateConfig.limits.academyName,
    label: "Academy or club"
  },

  playerLocation: {
    required: true,
    minLength: 2,
    maxLength:
      ScoutReportCreateConfig.limits.location,
    label: "Player location"
  },

  jerseyNumber: {
    required: false,
    minimum: 1,
    maximum: 99,
    label: "Jersey number"
  },

  summary: {
    required: true,
    minLength: 40,
    maxLength:
      ScoutReportCreateConfig.limits.summary,
    label: "Scouting summary"
  },

  strengths: {
    required: true,
    minLength: 20,
    maxLength:
      ScoutReportCreateConfig.limits.strengths,
    label: "Player strengths"
  },

  weaknesses: {
    required: true,
    minLength: 20,
    maxLength:
      ScoutReportCreateConfig.limits.weaknesses,
    label: "Development areas"
  },

  recommendation: {
    required: true,
    minLength: 20,
    maxLength:
      ScoutReportCreateConfig.limits.recommendation,
    label: "Scout recommendation"
  },

  privateNotes: {
    required: false,
    maxLength:
      ScoutReportCreateConfig.limits.privateNotes,
    label: "Private scout notes"
  },

  recommendationStatus: {
    required: true,
    label: "Recommendation status"
  },

  priority: {
    required: true,
    label: "Report priority"
  },

  visibility: {
    required: true,
    label: "Report visibility"
  }
});


/* =========================================================
   VALIDATION RESULT HELPERS
========================================================= */

function createValidationResult(
  valid = true,
  message = ""
) {
  return {
    valid: Boolean(valid),
    message: String(message || "")
  };
}


function getValidationRuleLabel(
  rule,
  fallback = "This field"
) {
  return normalizeText(rule?.label) || fallback;
}


function getFieldValue(field) {
  if (!field) {
    return "";
  }

  if (
    field instanceof HTMLInputElement &&
    (
      field.type === "checkbox" ||
      field.type === "radio"
    )
  ) {
    return field.checked
      ? field.value || "true"
      : "";
  }

  return normalizeText(field.value);
}


function isEmptyFieldValue(value) {
  return (
    value === null ||
    value === undefined ||
    normalizeText(value) === ""
  );
}


/* =========================================================
   GENERIC TEXT FIELD VALIDATION
========================================================= */

function validateTextField(
  field,
  rule = {}
) {
  if (!field) {
    return createValidationResult(true);
  }

  const value = getFieldValue(field);
  const label = getValidationRuleLabel(rule);

  if (
    rule.required &&
    isEmptyFieldValue(value)
  ) {
    return createValidationResult(
      false,
      `${label} is required.`
    );
  }

  if (
    isEmptyFieldValue(value) &&
    !rule.required
  ) {
    return createValidationResult(true);
  }

  if (
    Number.isFinite(rule.minLength) &&
    value.length < rule.minLength
  ) {
    return createValidationResult(
      false,
      `${label} must contain at least ` +
      `${rule.minLength} characters.`
    );
  }

  if (
    Number.isFinite(rule.maxLength) &&
    value.length > rule.maxLength
  ) {
    return createValidationResult(
      false,
      `${label} cannot exceed ` +
      `${rule.maxLength} characters.`
    );
  }

  return createValidationResult(true);
}


/* =========================================================
   NUMBER FIELD VALIDATION
========================================================= */

function validateNumberField(
  field,
  rule = {}
) {
  if (!field) {
    return createValidationResult(true);
  }

  const rawValue = normalizeText(field.value);
  const label = getValidationRuleLabel(rule);

  if (
    rule.required &&
    rawValue === ""
  ) {
    return createValidationResult(
      false,
      `${label} is required.`
    );
  }

  if (
    rawValue === "" &&
    !rule.required
  ) {
    return createValidationResult(true);
  }

  const value = Number(rawValue);

  if (!Number.isFinite(value)) {
    return createValidationResult(
      false,
      `${label} must be a valid number.`
    );
  }

  if (
    Number.isFinite(rule.minimum) &&
    value < rule.minimum
  ) {
    return createValidationResult(
      false,
      `${label} cannot be lower than ` +
      `${rule.minimum}.`
    );
  }

  if (
    Number.isFinite(rule.maximum) &&
    value > rule.maximum
  ) {
    return createValidationResult(
      false,
      `${label} cannot be higher than ` +
      `${rule.maximum}.`
    );
  }

  return createValidationResult(true);
}


/* =========================================================
   DATE FIELD VALIDATION
========================================================= */

function parseInputDate(value) {
  if (!value) {
    return null;
  }

  const parsedDate = new Date(
    `${value}T00:00:00`
  );

  if (Number.isNaN(parsedDate.getTime())) {
    return null;
  }

  return parsedDate;
}


function isDateAfterToday(value) {
  const selectedDate = parseInputDate(value);

  if (!selectedDate) {
    return false;
  }

  const today = new Date();

  today.setHours(0, 0, 0, 0);

  return selectedDate.getTime() > today.getTime();
}


function validateDateField(
  field,
  rule = {},
  options = {}
) {
  if (!field) {
    return createValidationResult(true);
  }

  const {
    allowFuture = false,
    minimumDate = "",
    maximumDate = ""
  } = options;

  const value = normalizeText(field.value);
  const label = getValidationRuleLabel(rule);

  if (
    rule.required &&
    value === ""
  ) {
    return createValidationResult(
      false,
      `${label} is required.`
    );
  }

  if (
    value === "" &&
    !rule.required
  ) {
    return createValidationResult(true);
  }

  const parsedDate = parseInputDate(value);

  if (!parsedDate) {
    return createValidationResult(
      false,
      `${label} must be a valid date.`
    );
  }

  if (
    !allowFuture &&
    isDateAfterToday(value)
  ) {
    return createValidationResult(
      false,
      `${label} cannot be in the future.`
    );
  }

  if (minimumDate) {
    const parsedMinimumDate =
      parseInputDate(minimumDate);

    if (
      parsedMinimumDate &&
      parsedDate < parsedMinimumDate
    ) {
      return createValidationResult(
        false,
        `${label} must be on or after ` +
        `${minimumDate}.`
      );
    }
  }

  if (maximumDate) {
    const parsedMaximumDate =
      parseInputDate(maximumDate);

    if (
      parsedMaximumDate &&
      parsedDate > parsedMaximumDate
    ) {
      return createValidationResult(
        false,
        `${label} must be on or before ` +
        `${maximumDate}.`
      );
    }
  }

  return createValidationResult(true);
}


/* =========================================================
   REPORT DATE RELATIONSHIP VALIDATION
========================================================= */

function validateReportAndMatchDates() {
  const reportDate =
    ScoutReportCreateDOM.reportDateInput?.value || "";

  const matchDate =
    ScoutReportCreateDOM.matchDateInput?.value || "";

  if (!reportDate || !matchDate) {
    return createValidationResult(true);
  }

  const parsedReportDate =
    parseInputDate(reportDate);

  const parsedMatchDate =
    parseInputDate(matchDate);

  if (
    !parsedReportDate ||
    !parsedMatchDate
  ) {
    return createValidationResult(true);
  }

  if (parsedReportDate < parsedMatchDate) {
    return createValidationResult(
      false,
      "The report date cannot be earlier than the match date."
    );
  }

  return createValidationResult(true);
}


/* =========================================================
   PLAYER DATE OF BIRTH VALIDATION
========================================================= */

function validatePlayerDateOfBirth() {
  const field =
    ScoutReportCreateDOM.playerDobInput;

  if (!field || !field.value) {
    return createValidationResult(true);
  }

  const parsedDate =
    parseInputDate(field.value);

  if (!parsedDate) {
    return createValidationResult(
      false,
      "Player date of birth must be valid."
    );
  }

  if (isDateAfterToday(field.value)) {
    return createValidationResult(
      false,
      "Player date of birth cannot be in the future."
    );
  }

  const calculatedAge =
    calculateAgeFromDateOfBirth(field.value);

  if (
    calculatedAge !== null &&
    (
      calculatedAge < 5 ||
      calculatedAge > 45
    )
  ) {
    return createValidationResult(
      false,
      "Player age must be between 5 and 45 years."
    );
  }

  return createValidationResult(true);
}


/* =========================================================
   RATING FIELD VALIDATION
========================================================= */

function validateRatingInput(input) {
  if (!input) {
    return createValidationResult(true);
  }

  const label =
    input.dataset.ratingLabel ||
    input.getAttribute("aria-label") ||
    input.name ||
    "Rating";

  const minimum = Number(
    input.min || 1
  );

  const maximum = Number(
    input.max || 10
  );

  const value = Number(input.value);

  if (!Number.isFinite(value)) {
    return createValidationResult(
      false,
      `${label} must be provided.`
    );
  }

  if (
    value < minimum ||
    value > maximum
  ) {
    return createValidationResult(
      false,
      `${label} must be between ` +
      `${minimum} and ${maximum}.`
    );
  }

  return createValidationResult(true);
}


function validateAllRatingInputs() {
  const ratingInputs = Array.from(
    document.querySelectorAll(
      'input[type="range"][data-rating], ' +
      'input[type="range"].scout-rating-input'
    )
  );

  const errors = [];

  ratingInputs.forEach((input) => {
    const result =
      validateRatingInput(input);

    if (!result.valid) {
      errors.push({
        field: input,
        message: result.message
      });
    }
  });

  return errors;
}


/* =========================================================
   CHECKBOX VALIDATION
========================================================= */

function validateConfirmationCheckbox(
  checkbox,
  message
) {
  if (!checkbox) {
    return createValidationResult(true);
  }

  if (!checkbox.checked) {
    return createValidationResult(
      false,
      message
    );
  }

  return createValidationResult(true);
}


/* =========================================================
   FIELD ERROR ELEMENT MANAGEMENT
========================================================= */

function getFieldErrorId(field) {
  if (!field) {
    return "";
  }

  if (!field.id) {
    field.id = generateClientReference(
      "FIELD"
    );
  }

  return `${field.id}-error`;
}


function getFieldContainer(field) {
  if (!field) {
    return null;
  }

  return (
    field.closest(
      ".scout-form-group, " +
      ".form-group, " +
      ".scout-field, " +
      "[data-field-container]"
    ) ||
    field.parentElement
  );
}


function getOrCreateFieldErrorElement(field) {
  if (!field) {
    return null;
  }

  const errorId = getFieldErrorId(field);
  let errorElement =
    document.getElementById(errorId);

  if (errorElement) {
    return errorElement;
  }

  errorElement =
    document.createElement("p");

  errorElement.id = errorId;
  errorElement.className =
    "scout-field-error-message";

  errorElement.setAttribute(
    "data-field-error",
    ""
  );

  errorElement.setAttribute(
    "role",
    "alert"
  );

  errorElement.hidden = true;

  const fieldContainer =
    getFieldContainer(field);

  fieldContainer?.appendChild(
    errorElement
  );

  return errorElement;
}


/* =========================================================
   DISPLAY AND CLEAR FIELD ERRORS
========================================================= */

function displayFieldError(
  field,
  message
) {
  if (!field) {
    return;
  }

  const fieldContainer =
    getFieldContainer(field);

  const errorElement =
    getOrCreateFieldErrorElement(field);

  field.classList.add("has-error");

  field.setAttribute(
    "aria-invalid",
    "true"
  );

  if (errorElement) {
    errorElement.textContent = message;
    errorElement.hidden = false;

    const describedByIds = new Set(
      normalizeText(
        field.getAttribute("aria-describedby")
      )
        .split(" ")
        .filter(Boolean)
    );

    describedByIds.add(errorElement.id);

    field.setAttribute(
      "aria-describedby",
      Array.from(describedByIds).join(" ")
    );
  }

  fieldContainer?.classList.add(
    "has-error"
  );
}


function clearFieldError(field) {
  if (!field) {
    return;
  }

  const fieldContainer =
    getFieldContainer(field);

  const errorId = getFieldErrorId(field);
  const errorElement =
    document.getElementById(errorId);

  field.classList.remove("has-error");

  field.removeAttribute(
    "aria-invalid"
  );

  fieldContainer?.classList.remove(
    "has-error"
  );

  if (errorElement) {
    errorElement.textContent = "";
    errorElement.hidden = true;
  }

  const describedByIds =
    normalizeText(
      field.getAttribute("aria-describedby")
    )
      .split(" ")
      .filter(
        (id) => id && id !== errorId
      );

  if (describedByIds.length) {
    field.setAttribute(
      "aria-describedby",
      describedByIds.join(" ")
    );
  } else {
    field.removeAttribute(
      "aria-describedby"
    );
  }
}


function clearAllFieldErrors() {
  if (!ScoutReportCreateDOM.form) {
    return;
  }

  const invalidFields = Array.from(
    ScoutReportCreateDOM.form.querySelectorAll(
      ".has-error, [aria-invalid='true']"
    )
  );

  invalidFields.forEach((field) => {
    if (
      field.matches(
        "input, select, textarea"
      )
    ) {
      clearFieldError(field);
    } else {
      field.classList.remove("has-error");
    }
  });

  ScoutReportCreateDOM.form
    .querySelectorAll("[data-field-error]")
    .forEach((errorElement) => {
      errorElement.hidden = true;
      errorElement.textContent = "";
    });
}


/* =========================================================
   VALIDATION SUMMARY
========================================================= */

function ensureValidationSummary() {
  if (ScoutReportCreateDOM.validationSummary) {
    return ScoutReportCreateDOM.validationSummary;
  }

  if (!ScoutReportCreateDOM.form) {
    return null;
  }

  const summary =
    document.createElement("section");

  summary.id = "reportValidationSummary";
  summary.className =
    "scout-validation-summary";

  summary.setAttribute(
    "data-validation-summary",
    ""
  );

  summary.setAttribute(
    "role",
    "alert"
  );

  summary.setAttribute(
    "aria-live",
    "assertive"
  );

  summary.hidden = true;

  ScoutReportCreateDOM.form.prepend(summary);

  ScoutReportCreateDOM.validationSummary =
    summary;

  return summary;
}


function renderValidationSummary(errors = []) {
  const summary =
    ensureValidationSummary();

  if (!summary) {
    return;
  }

  if (!errors.length) {
    summary.innerHTML = "";
    summary.hidden = true;
    summary.classList.remove("is-visible");

    return;
  }

  const uniqueErrors = [];
  const seenMessages = new Set();

  errors.forEach((error) => {
    const message =
      normalizeText(error?.message);

    if (
      !message ||
      seenMessages.has(message)
    ) {
      return;
    }

    seenMessages.add(message);
    uniqueErrors.push(error);
  });

  summary.innerHTML = `
    <div class="scout-validation-summary-header">
      <strong>
        Please correct the following:
      </strong>

      <span>
        ${uniqueErrors.length}
        ${
          uniqueErrors.length === 1
            ? "issue"
            : "issues"
        }
      </span>
    </div>

    <ul>
      ${uniqueErrors
        .map((error, index) => {
          const fieldId =
            error.field?.id || "";

          return `
            <li>
              ${
                fieldId
                  ? `
                    <button
                      type="button"
                      data-validation-focus="${escapeHTML(fieldId)}"
                    >
                      ${escapeHTML(error.message)}
                    </button>
                  `
                  : escapeHTML(error.message)
              }
            </li>
          `;
        })
        .join("")}
    </ul>
  `;

  summary.hidden = false;
  summary.classList.add("is-visible");

  summary
    .querySelectorAll("[data-validation-focus]")
    .forEach((button) => {
      button.addEventListener("click", () => {
        const targetField =
          document.getElementById(
            button.dataset.validationFocus
          );

        if (!targetField) {
          return;
        }

        const stepPanel =
          targetField.closest(
            "[data-report-step], " +
            ".scout-report-step-panel"
          );

        if (stepPanel) {
          const stepNumber =
            getStepNumberFromPanel(
              stepPanel
            );

          if (stepNumber) {
            showReportStep(
              stepNumber,
              {
                validateCurrentStep: false
              }
            );
          }
        }

        scrollElementIntoView(
          targetField
        );

        targetField.focus({
          preventScroll: true
        });
      });
    });
}


/* =========================================================
   INDIVIDUAL FIELD VALIDATION MAP
========================================================= */

function validateKnownField(field) {
  if (!field) {
    return createValidationResult(true);
  }

  if (
    field ===
    ScoutReportCreateDOM.reportTitleInput
  ) {
    return validateTextField(
      field,
      ScoutReportValidationRules.reportTitle
    );
  }

  if (
    field ===
    ScoutReportCreateDOM.reportDateInput
  ) {
    return validateDateField(
      field,
      ScoutReportValidationRules.reportDate
    );
  }

  if (
    field ===
    ScoutReportCreateDOM.matchDateInput
  ) {
    return validateDateField(
      field,
      ScoutReportValidationRules.matchDate
    );
  }

  if (
    field ===
    ScoutReportCreateDOM.competitionInput
  ) {
    return validateTextField(
      field,
      ScoutReportValidationRules.competition
    );
  }

  if (
    field ===
    ScoutReportCreateDOM.venueInput
  ) {
    return validateTextField(
      field,
      ScoutReportValidationRules.venue
    );
  }

  if (
    field ===
    ScoutReportCreateDOM.playerNameInput
  ) {
    return validateTextField(
      field,
      ScoutReportValidationRules.playerName
    );
  }

  if (
    field ===
    ScoutReportCreateDOM.playerAgeInput
  ) {
    return validateNumberField(
      field,
      ScoutReportValidationRules.playerAge
    );
  }

  if (
    field ===
    ScoutReportCreateDOM.playerDobInput
  ) {
    return validatePlayerDateOfBirth();
  }

  if (
    field ===
    ScoutReportCreateDOM.playerPositionInput
  ) {
    return validateTextField(
      field,
      ScoutReportValidationRules.playerPosition
    );
  }

  if (
    field ===
    ScoutReportCreateDOM.preferredFootInput
  ) {
    return validateTextField(
      field,
      ScoutReportValidationRules.preferredFoot
    );
  }

  if (
    field ===
    ScoutReportCreateDOM.playerAcademyInput
  ) {
    return validateTextField(
      field,
      ScoutReportValidationRules.playerAcademy
    );
  }

  if (
    field ===
    ScoutReportCreateDOM.playerLocationInput
  ) {
    return validateTextField(
      field,
      ScoutReportValidationRules.playerLocation
    );
  }

  if (
    field ===
    ScoutReportCreateDOM.jerseyNumberInput
  ) {
    return validateNumberField(
      field,
      ScoutReportValidationRules.jerseyNumber
    );
  }

  if (
    field ===
    ScoutReportCreateDOM.summaryInput
  ) {
    return validateTextField(
      field,
      ScoutReportValidationRules.summary
    );
  }

  if (
    field ===
    ScoutReportCreateDOM.strengthsInput
  ) {
    return validateTextField(
      field,
      ScoutReportValidationRules.strengths
    );
  }

  if (
    field ===
    ScoutReportCreateDOM.weaknessesInput
  ) {
    return validateTextField(
      field,
      ScoutReportValidationRules.weaknesses
    );
  }

  if (
    field ===
    ScoutReportCreateDOM.recommendationInput
  ) {
    return validateTextField(
      field,
      ScoutReportValidationRules.recommendation
    );
  }

  if (
    field ===
    ScoutReportCreateDOM.privateNotesInput
  ) {
    return validateTextField(
      field,
      ScoutReportValidationRules.privateNotes
    );
  }

  if (
    field ===
    ScoutReportCreateDOM.recommendationStatusInput
  ) {
    return validateTextField(
      field,
      ScoutReportValidationRules.recommendationStatus
    );
  }

  if (
    field ===
    ScoutReportCreateDOM.priorityInput
  ) {
    return validateTextField(
      field,
      ScoutReportValidationRules.priority
    );
  }

  if (
    field ===
    ScoutReportCreateDOM.visibilityInput
  ) {
    return validateTextField(
      field,
      ScoutReportValidationRules.visibility
    );
  }

  if (
    field.matches(
      'input[type="range"]'
    )
  ) {
    return validateRatingInput(field);
  }

  if (field.required) {
    return validateTextField(field, {
      required: true,
      label:
        field.dataset.label ||
        field.getAttribute("aria-label") ||
        field.name ||
        "This field"
    });
  }

  return createValidationResult(true);
}


/* =========================================================
   VALIDATE AND DISPLAY SINGLE FIELD
========================================================= */

function validateAndDisplayField(field) {
  const result =
    validateKnownField(field);

  if (result.valid) {
    clearFieldError(field);
  } else {
    displayFieldError(
      field,
      result.message
    );
  }

  return result;
}


/* =========================================================
   GET STEP NUMBER FROM PANEL
========================================================= */

function getStepNumberFromPanel(panel) {
  if (!panel) {
    return null;
  }

  const explicitStep =
    panel.dataset.reportStep ||
    panel.dataset.step ||
    "";

  const parsedStep =
    Number(explicitStep);

  if (
    Number.isInteger(parsedStep) &&
    parsedStep > 0
  ) {
    return parsedStep;
  }

  const panelIndex =
    ScoutReportCreateDOM.stepPanels.indexOf(
      panel
    );

  return panelIndex >= 0
    ? panelIndex + 1
    : null;
}


/* =========================================================
   COLLECT VALIDATION ERRORS FOR CONTAINER
========================================================= */

function collectContainerValidationErrors(
  container
) {
  if (!container) {
    return [];
  }

  const errors = [];

  const fields = Array.from(
    container.querySelectorAll(
      "input, select, textarea"
    )
  ).filter((field) => {
    if (field.disabled) {
      return false;
    }

    if (
      field.type === "hidden" &&
      !field.required
    ) {
      return false;
    }

    return true;
  });

  fields.forEach((field) => {
    if (
      field ===
      ScoutReportCreateDOM.consentCheckbox ||
      field ===
      ScoutReportCreateDOM.confirmationCheckbox
    ) {
      return;
    }

    const result =
      validateKnownField(field);

    if (result.valid) {
      clearFieldError(field);
    } else {
      displayFieldError(
        field,
        result.message
      );

      errors.push({
        field,
        message: result.message
      });
    }
  });

  return errors;
}


/* =========================================================
   CROSS-FIELD VALIDATION
========================================================= */

function collectCrossFieldValidationErrors() {
  const errors = [];

  const dateRelationshipResult =
    validateReportAndMatchDates();

  if (!dateRelationshipResult.valid) {
    const targetField =
      ScoutReportCreateDOM.reportDateInput ||
      ScoutReportCreateDOM.matchDateInput;

    if (targetField) {
      displayFieldError(
        targetField,
        dateRelationshipResult.message
      );
    }

    errors.push({
      field: targetField,
      message:
        dateRelationshipResult.message
    });
  }

  const dateOfBirthResult =
    validatePlayerDateOfBirth();

  if (!dateOfBirthResult.valid) {
    if (
      ScoutReportCreateDOM.playerDobInput
    ) {
      displayFieldError(
        ScoutReportCreateDOM.playerDobInput,
        dateOfBirthResult.message
      );
    }

    errors.push({
      field:
        ScoutReportCreateDOM.playerDobInput,
      message:
        dateOfBirthResult.message
    });
  }

  const allRatingErrors =
    validateAllRatingInputs();

  allRatingErrors.forEach((error) => {
    displayFieldError(
      error.field,
      error.message
    );

    errors.push(error);
  });

  return errors;
}


/* =========================================================
   FINAL CONFIRMATION VALIDATION
========================================================= */

function collectConfirmationValidationErrors() {
  const errors = [];

  const consentResult =
    validateConfirmationCheckbox(
      ScoutReportCreateDOM.consentCheckbox,
      "Confirm that the required player or guardian consent has been obtained."
    );

  if (!consentResult.valid) {
    displayFieldError(
      ScoutReportCreateDOM.consentCheckbox,
      consentResult.message
    );

    errors.push({
      field:
        ScoutReportCreateDOM.consentCheckbox,
      message: consentResult.message
    });
  } else {
    clearFieldError(
      ScoutReportCreateDOM.consentCheckbox
    );
  }

  const accuracyResult =
    validateConfirmationCheckbox(
      ScoutReportCreateDOM.confirmationCheckbox,
      "Confirm that the report information is accurate."
    );

  if (!accuracyResult.valid) {
    displayFieldError(
      ScoutReportCreateDOM.confirmationCheckbox,
      accuracyResult.message
    );

    errors.push({
      field:
        ScoutReportCreateDOM.confirmationCheckbox,
      message: accuracyResult.message
    });
  } else {
    clearFieldError(
      ScoutReportCreateDOM.confirmationCheckbox
    );
  }

  return errors;
}


/* =========================================================
   SELECTED PLAYER VALIDATION
========================================================= */

function validateSelectedPlayerRequirement() {
  const playerName =
    normalizeText(
      ScoutReportCreateDOM.playerNameInput?.value
    );

  const playerId =
    normalizeText(
      ScoutReportCreateDOM.selectedPlayerIdInput?.value
    );

  if (!playerName) {
    return {
      field:
        ScoutReportCreateDOM.playerNameInput ||
        ScoutReportCreateDOM.playerSearchInput,
      message:
        "Select or enter the player being assessed."
    };
  }

  const requiresRegisteredPlayer =
    ScoutReportCreateDOM.playerSearchInput
      ?.dataset.requireRegisteredPlayer ===
    "true";

  if (
    requiresRegisteredPlayer &&
    !playerId
  ) {
    return {
      field:
        ScoutReportCreateDOM.playerSearchInput,
      message:
        "Select a registered player from the search results."
    };
  }

  return null;
}


/* =========================================================
   STEP VALIDATION
========================================================= */

function validateReportStep(
  stepNumber,
  options = {}
) {
  const {
    showSummary = true,
    focusFirstError = true
  } = options;

  const panel =
    ScoutReportCreateDOM.stepPanels[
      stepNumber - 1
    ];

  if (!panel) {
    return {
      valid: true,
      errors: []
    };
  }

  const errors =
    collectContainerValidationErrors(
      panel
    );

  const playerRequirementError =
    validateSelectedPlayerRequirement();

  if (
    playerRequirementError &&
    (
      panel.contains(
        playerRequirementError.field
      ) ||
      panel.contains(
        ScoutReportCreateDOM.playerSearchInput
      )
    )
  ) {
    displayFieldError(
      playerRequirementError.field,
      playerRequirementError.message
    );

    errors.push(
      playerRequirementError
    );
  }

  if (showSummary) {
    renderValidationSummary(errors);
  }

  if (
    errors.length &&
    focusFirstError
  ) {
    const firstField =
      errors[0]?.field;

    if (firstField) {
      scrollElementIntoView(firstField);

      window.setTimeout(() => {
        firstField.focus({
          preventScroll: true
        });
      }, 250);
    }
  }

  return {
    valid: errors.length === 0,
    errors
  };
}


/* =========================================================
   COMPLETE FORM VALIDATION
========================================================= */

function validateEntireScoutReport(
  options = {}
) {
  const {
    showSummary = true,
    focusFirstError = true
  } = options;

  clearAllFieldErrors();

  let errors = [];

  if (ScoutReportCreateDOM.form) {
    errors = [
      ...collectContainerValidationErrors(
        ScoutReportCreateDOM.form
      ),
      ...collectCrossFieldValidationErrors(),
      ...collectConfirmationValidationErrors()
    ];
  }

  const playerRequirementError =
    validateSelectedPlayerRequirement();

  if (playerRequirementError) {
    displayFieldError(
      playerRequirementError.field,
      playerRequirementError.message
    );

    errors.push(
      playerRequirementError
    );
  }

  if (showSummary) {
    renderValidationSummary(errors);
  }

  if (
    errors.length &&
    focusFirstError
  ) {
    const firstError =
      errors.find((error) => error.field);

    if (firstError?.field) {
      const stepPanel =
        firstError.field.closest(
          "[data-report-step], " +
          ".scout-report-step-panel"
        );

      if (stepPanel) {
        const stepNumber =
          getStepNumberFromPanel(
            stepPanel
          );

        if (stepNumber) {
          showReportStep(
            stepNumber,
            {
              validateCurrentStep: false
            }
          );
        }
      }

      scrollElementIntoView(
        firstError.field
      );

      window.setTimeout(() => {
        firstError.field.focus({
          preventScroll: true
        });
      }, 250);
    }
  }

  return {
    valid: errors.length === 0,
    errors
  };
}


/* =========================================================
   REAL-TIME VALIDATION
========================================================= */

function handleFieldValidationEvent(event) {
  const field = event.target;

  if (
    !field?.matches(
      "input, select, textarea"
    )
  ) {
    return;
  }

  const shouldValidate =
    field.classList.contains("has-error") ||
    field.hasAttribute("aria-invalid") ||
    event.type === "change";

  if (!shouldValidate) {
    return;
  }

  validateAndDisplayField(field);

  if (
    field ===
    ScoutReportCreateDOM.reportDateInput ||
    field ===
    ScoutReportCreateDOM.matchDateInput
  ) {
    const relationshipResult =
      validateReportAndMatchDates();

    if (!relationshipResult.valid) {
      displayFieldError(
        ScoutReportCreateDOM.reportDateInput ||
        ScoutReportCreateDOM.matchDateInput,
        relationshipResult.message
      );
    }
  }
}


/* =========================================================
   CHARACTER COUNTERS
========================================================= */

function getCharacterLimitForField(field) {
  if (!field) {
    return 0;
  }

  const explicitLimit =
    Number(
      field.dataset.characterLimit ||
      field.maxLength
    );

  if (
    Number.isFinite(explicitLimit) &&
    explicitLimit > 0
  ) {
    return explicitLimit;
  }

  if (
    field ===
    ScoutReportCreateDOM.summaryInput
  ) {
    return ScoutReportCreateConfig.limits.summary;
  }

  if (
    field ===
    ScoutReportCreateDOM.strengthsInput
  ) {
    return ScoutReportCreateConfig.limits.strengths;
  }

  if (
    field ===
    ScoutReportCreateDOM.weaknessesInput
  ) {
    return ScoutReportCreateConfig.limits.weaknesses;
  }

  if (
    field ===
    ScoutReportCreateDOM.recommendationInput
  ) {
    return ScoutReportCreateConfig.limits.recommendation;
  }

  if (
    field ===
    ScoutReportCreateDOM.privateNotesInput
  ) {
    return ScoutReportCreateConfig.limits.privateNotes;
  }

  return 0;
}


function getCharacterCounterElement(field) {
  if (!field) {
    return null;
  }

  const explicitCounterId =
    field.dataset.counterTarget;

  if (explicitCounterId) {
    return document.getElementById(
      explicitCounterId
    );
  }

  return (
    field
      .closest(
        ".scout-form-group, " +
        ".form-group, " +
        ".scout-field, " +
        "[data-field-container]"
      )
      ?.querySelector(
        "[data-character-counter]"
      ) || null
  );
}


function updateCharacterCounter(field) {
  if (!field) {
    return;
  }

  const limit =
    getCharacterLimitForField(field);

  if (!limit) {
    return;
  }

  const counter =
    getCharacterCounterElement(field);

  if (!counter) {
    return;
  }

  const currentLength =
    String(field.value || "").length;

  counter.textContent =
    `${currentLength} / ${limit}`;

  counter.classList.toggle(
    "is-near-limit",
    currentLength >= limit * 0.85
  );

  counter.classList.toggle(
    "is-over-limit",
    currentLength > limit
  );

  counter.setAttribute(
    "aria-label",
    `${currentLength} of ${limit} characters used`
  );
}


function initializeCharacterCounters() {
  const textFields = [
    ScoutReportCreateDOM.summaryInput,
    ScoutReportCreateDOM.strengthsInput,
    ScoutReportCreateDOM.weaknessesInput,
    ScoutReportCreateDOM.recommendationInput,
    ScoutReportCreateDOM.privateNotesInput
  ].filter(Boolean);

  textFields.forEach((field) => {
    const limit =
      getCharacterLimitForField(field);

    if (
      limit &&
      (
        !field.maxLength ||
        field.maxLength < 0
      )
    ) {
      field.maxLength = limit;
    }

    updateCharacterCounter(field);

    field.addEventListener("input", () => {
      updateCharacterCounter(field);
    });
  });
}


/* =========================================================
   REQUIRED FIELD ACCESSIBILITY
========================================================= */

function configureRequiredFieldAccessibility() {
  const requiredFieldMap = [
    [
      ScoutReportCreateDOM.reportTitleInput,
      ScoutReportValidationRules.reportTitle
    ],
    [
      ScoutReportCreateDOM.reportDateInput,
      ScoutReportValidationRules.reportDate
    ],
    [
      ScoutReportCreateDOM.matchDateInput,
      ScoutReportValidationRules.matchDate
    ],
    [
      ScoutReportCreateDOM.competitionInput,
      ScoutReportValidationRules.competition
    ],
    [
      ScoutReportCreateDOM.venueInput,
      ScoutReportValidationRules.venue
    ],
    [
      ScoutReportCreateDOM.playerNameInput,
      ScoutReportValidationRules.playerName
    ],
    [
      ScoutReportCreateDOM.playerAgeInput,
      ScoutReportValidationRules.playerAge
    ],
    [
      ScoutReportCreateDOM.playerPositionInput,
      ScoutReportValidationRules.playerPosition
    ],
    [
      ScoutReportCreateDOM.preferredFootInput,
      ScoutReportValidationRules.preferredFoot
    ],
    [
      ScoutReportCreateDOM.playerLocationInput,
      ScoutReportValidationRules.playerLocation
    ],
    [
      ScoutReportCreateDOM.summaryInput,
      ScoutReportValidationRules.summary
    ],
    [
      ScoutReportCreateDOM.strengthsInput,
      ScoutReportValidationRules.strengths
    ],
    [
      ScoutReportCreateDOM.weaknessesInput,
      ScoutReportValidationRules.weaknesses
    ],
    [
      ScoutReportCreateDOM.recommendationInput,
      ScoutReportValidationRules.recommendation
    ],
    [
      ScoutReportCreateDOM.recommendationStatusInput,
      ScoutReportValidationRules.recommendationStatus
    ],
    [
      ScoutReportCreateDOM.priorityInput,
      ScoutReportValidationRules.priority
    ],
    [
      ScoutReportCreateDOM.visibilityInput,
      ScoutReportValidationRules.visibility
    ]
  ];

  requiredFieldMap.forEach(
    ([field, rule]) => {
      if (!field || !rule.required) {
        return;
      }

      field.required = true;

      field.setAttribute(
        "aria-required",
        "true"
      );
    }
  );

  [
    ScoutReportCreateDOM.consentCheckbox,
    ScoutReportCreateDOM.confirmationCheckbox
  ]
    .filter(Boolean)
    .forEach((checkbox) => {
      checkbox.required = true;

      checkbox.setAttribute(
        "aria-required",
        "true"
      );
    });
}


/* =========================================================
   VALIDATION INITIALIZATION
========================================================= */

function initializeReportValidation() {
  if (!ScoutReportCreateDOM.form) {
    return;
  }

  ScoutReportCreateDOM.form.noValidate = true;

  configureRequiredFieldAccessibility();
  initializeCharacterCounters();

  ScoutReportCreateDOM.form.addEventListener(
    "input",
    handleFieldValidationEvent
  );

  ScoutReportCreateDOM.form.addEventListener(
    "change",
    handleFieldValidationEvent
  );

  ScoutReportCreateDOM.form.addEventListener(
    "focusout",
    (event) => {
      const field = event.target;

      if (
        !field?.matches(
          "input, select, textarea"
        )
      ) {
        return;
      }

      if (
        field.required ||
        field.classList.contains("has-error")
      ) {
        validateAndDisplayField(field);
      }
    }
  );
}


/* =========================================================
   END OF SCOUT-REPORT-CREATE.JS — PART 2C
   CONTINUE DIRECTLY WITH PART 2D
========================================================= */

/* =========================================================
   SCOUT-REPORT-CREATE.JS
   PART 2D
   DRAFT STORAGE, AUTOSAVE AND UNSAVED CHANGE TRACKING
   CONTINUES DIRECTLY FROM PART 2C
========================================================= */


/* =========================================================
   FORM SERIALIZATION HELPERS
========================================================= */

function serializeFormToObject(form) {
  if (!form) {
    return {};
  }

  const formData = new FormData(form);
  const serializedData = {};

  formData.forEach((value, key) => {
    if (value instanceof File) {
      return;
    }

    if (
      Object.prototype.hasOwnProperty.call(
        serializedData,
        key
      )
    ) {
      if (!Array.isArray(serializedData[key])) {
        serializedData[key] = [
          serializedData[key]
        ];
      }

      serializedData[key].push(value);
      return;
    }

    serializedData[key] = value;
  });

  form
    .querySelectorAll(
      'input[type="checkbox"][name]'
    )
    .forEach((checkbox) => {
      if (
        !Object.prototype.hasOwnProperty.call(
          serializedData,
          checkbox.name
        )
      ) {
        serializedData[checkbox.name] = false;
      } else if (
        !Array.isArray(
          serializedData[checkbox.name]
        )
      ) {
        serializedData[checkbox.name] =
          checkbox.checked;
      }
    });

  form
    .querySelectorAll(
      'input[type="radio"][name]'
    )
    .forEach((radio) => {
      if (
        !Object.prototype.hasOwnProperty.call(
          serializedData,
          radio.name
        )
      ) {
        serializedData[radio.name] = "";
      }
    });

  return serializedData;
}


function createStableFormSnapshot() {
  const formData = serializeFormToObject(
    ScoutReportCreateDOM.form
  );

  const snapshotData = {
    formData,
    selectedPlayerId:
      ScoutReportCreateState.selectedPlayer?.id ||
      ScoutReportCreateDOM.selectedPlayerIdInput?.value ||
      "",
    media: ScoutReportCreateState.uploadedFiles.map(
      (mediaItem) => ({
        id: mediaItem.id,
        name: mediaItem.name,
        size: mediaItem.size,
        type: mediaItem.type,
        serverMediaId:
          mediaItem.serverMediaId || ""
      })
    )
  };

  return JSON.stringify(snapshotData);
}


/* =========================================================
   DRAFT DATA CREATION
========================================================= */

function buildLocalDraftPayload() {
  return {
    version: 1,
    clientReference:
      ScoutReportCreateDOM.form?.dataset
        .clientReference ||
      generateClientReference("REPORT"),
    savedAt: new Date().toISOString(),
    currentStep:
      ScoutReportCreateState.currentStep,
    formData: serializeFormToObject(
      ScoutReportCreateDOM.form
    ),
    selectedPlayer:
      ScoutReportCreateState.selectedPlayer
        ? {
            id:
              ScoutReportCreateState.selectedPlayer.id,
            name:
              ScoutReportCreateState.selectedPlayer.name,
            age:
              ScoutReportCreateState.selectedPlayer.age,
            dateOfBirth:
              ScoutReportCreateState.selectedPlayer
                .dateOfBirth,
            position:
              ScoutReportCreateState.selectedPlayer
                .position,
            preferredFoot:
              ScoutReportCreateState.selectedPlayer
                .preferredFoot,
            academyName:
              ScoutReportCreateState.selectedPlayer
                .academyName,
            location:
              ScoutReportCreateState.selectedPlayer
                .location,
            profileImage:
              ScoutReportCreateState.selectedPlayer
                .profileImage,
            jerseyNumber:
              ScoutReportCreateState.selectedPlayer
                .jerseyNumber
          }
        : null,
    media: serializeMediaForDraft()
  };
}


/* =========================================================
   LOCAL STORAGE OPERATIONS
========================================================= */

function saveDraftToLocalStorage(draftPayload) {
  try {
    localStorage.setItem(
      ScoutReportCreateConfig.storageKeys.draft,
      JSON.stringify(draftPayload)
    );

    return true;
  } catch (error) {
    console.error(
      "Unable to save report draft locally.",
      error
    );

    return false;
  }
}


function getLocalDraft() {
  try {
    const storedDraft = localStorage.getItem(
      ScoutReportCreateConfig.storageKeys.draft
    );

    return safelyParseJSON(storedDraft, null);
  } catch (error) {
    console.error(
      "Unable to retrieve the local report draft.",
      error
    );

    return null;
  }
}


function removeLocalDraft() {
  try {
    localStorage.removeItem(
      ScoutReportCreateConfig.storageKeys.draft
    );

    return true;
  } catch (error) {
    console.warn(
      "Unable to remove the local report draft.",
      error
    );

    return false;
  }
}


/* =========================================================
   AUTOSAVE STATUS UI
========================================================= */

function ensureAutosaveStatusElement() {
  if (ScoutReportCreateDOM.autosaveStatus) {
    return ScoutReportCreateDOM.autosaveStatus;
  }

  const statusElement =
    document.createElement("div");

  statusElement.id = "reportAutosaveStatus";
  statusElement.className =
    "scout-report-autosave-status";

  statusElement.setAttribute(
    "data-autosave-status",
    ""
  );

  statusElement.setAttribute(
    "role",
    "status"
  );

  statusElement.setAttribute(
    "aria-live",
    "polite"
  );

  const targetContainer =
    ScoutReportCreateDOM.saveDraftButton
      ?.parentElement ||
    ScoutReportCreateDOM.form;

  targetContainer?.appendChild(statusElement);

  ScoutReportCreateDOM.autosaveStatus =
    statusElement;

  return statusElement;
}


function updateAutosaveStatus(
  status,
  message = ""
) {
  const statusElement =
    ensureAutosaveStatusElement();

  if (!statusElement) {
    return;
  }

  const allowedStatuses = [
    "idle",
    "saving",
    "saved",
    "error"
  ];

  const safeStatus =
    allowedStatuses.includes(status)
      ? status
      : "idle";

  statusElement.dataset.status = safeStatus;

  statusElement.classList.remove(
    "is-saving",
    "is-saved",
    "has-error"
  );

  if (safeStatus === "saving") {
    statusElement.classList.add("is-saving");
  }

  if (safeStatus === "saved") {
    statusElement.classList.add("is-saved");
  }

  if (safeStatus === "error") {
    statusElement.classList.add("has-error");
  }

  const defaultMessages = {
    idle: "",
    saving: "Saving draft...",
    saved: "Draft saved",
    error: "Draft could not be saved"
  };

  statusElement.textContent =
    message || defaultMessages[safeStatus];
}


/* =========================================================
   UNSAVED CHANGES UI
========================================================= */

function ensureUnsavedChangesBar() {
  if (ScoutReportCreateDOM.unsavedChangesBar) {
    return ScoutReportCreateDOM.unsavedChangesBar;
  }

  const bar = document.createElement("div");

  bar.id = "reportUnsavedChangesBar";
  bar.className =
    "scout-report-unsaved-bar";

  bar.setAttribute(
    "data-unsaved-changes-bar",
    ""
  );

  bar.setAttribute(
    "role",
    "status"
  );

  bar.hidden = true;

  bar.innerHTML = `
    <span
      class="scout-report-unsaved-text"
      data-unsaved-changes-text
    >
      You have unsaved report changes.
    </span>

    <button
      class="scout-report-unsaved-save"
      type="button"
      data-unsaved-save-button
    >
      Save draft
    </button>
  `;

  document.body.appendChild(bar);

  ScoutReportCreateDOM.unsavedChangesBar = bar;
  ScoutReportCreateDOM.unsavedChangesText =
    bar.querySelector(
      "[data-unsaved-changes-text]"
    );

  bar
    .querySelector("[data-unsaved-save-button]")
    ?.addEventListener("click", () => {
      saveScoutReportDraft({
        manual: true
      });
    });

  return bar;
}


function updateUnsavedChangesUI() {
  const bar = ensureUnsavedChangesBar();

  if (!bar) {
    return;
  }

  if (
    ScoutReportCreateState.hasUnsavedChanges
  ) {
    bar.hidden = false;
    bar.classList.add("is-visible");

    if (
      ScoutReportCreateDOM.unsavedChangesText
    ) {
      ScoutReportCreateDOM.unsavedChangesText.textContent =
        ScoutReportCreateState.lastSavedAt
          ? "Changes made after the last saved draft."
          : "You have unsaved report changes.";
    }

    return;
  }

  bar.classList.remove("is-visible");
  bar.hidden = true;
}


/* =========================================================
   CHANGE TRACKING
========================================================= */

function markReportAsChanged(options = {}) {
  const {
    scheduleAutosave = true
  } = options;

  ScoutReportCreateState.hasUnsavedChanges = true;

  updateUnsavedChangesUI();

  if (scheduleAutosave) {
    scheduleReportAutosave();
  }
}


function markReportAsSaved() {
  ScoutReportCreateState.hasUnsavedChanges = false;
  ScoutReportCreateState.lastSavedAt =
    new Date();

  ScoutReportCreateState.initialFormSnapshot =
    createStableFormSnapshot();

  updateUnsavedChangesUI();

  updateAutosaveStatus(
    "saved",
    `Draft saved ${formatReadableDateTime(
      ScoutReportCreateState.lastSavedAt
    )}`
  );
}


function detectReportChanges() {
  if (!ScoutReportCreateDOM.form) {
    return;
  }

  const currentSnapshot =
    createStableFormSnapshot();

  const hasChanged =
    currentSnapshot !==
    ScoutReportCreateState.initialFormSnapshot;

  ScoutReportCreateState.hasUnsavedChanges =
    hasChanged;

  updateUnsavedChangesUI();

  if (hasChanged) {
    scheduleReportAutosave();
  }
}


/* =========================================================
   LOCAL DRAFT SAVE
========================================================= */

function saveDraftLocally() {
  const draftPayload =
    buildLocalDraftPayload();

  const saved =
    saveDraftToLocalStorage(draftPayload);

  if (!saved) {
    throw new Error(
      "The browser could not store the report draft."
    );
  }

  return draftPayload;
}


/* =========================================================
   SERVER DRAFT PAYLOAD
========================================================= */

function buildServerDraftPayload(
  localDraftPayload
) {
  return {
    client_reference:
      localDraftPayload.clientReference,
    current_step:
      localDraftPayload.currentStep,
    player_id:
      localDraftPayload.selectedPlayer?.id ||
      null,
    report_data:
      localDraftPayload.formData,
    media_ids:
      ScoutReportCreateState.uploadedMediaIds,
    saved_at:
      localDraftPayload.savedAt
  };
}


/* =========================================================
   SAVE DRAFT TO BACKEND
   INTEGRATION PLACEHOLDER FOR MR. HARSH
========================================================= */

async function saveDraftToServer(
  localDraftPayload
) {
  if (
    ScoutReportCreateState.abortControllers.draft
  ) {
    ScoutReportCreateState.abortControllers.draft.abort();
  }

  const controller = new AbortController();

  ScoutReportCreateState.abortControllers.draft =
    controller;

  try {
    /*
     * MR. HARSH BACKEND CONTRACT SUGGESTION
     *
     * POST /api/v1/scout/reports/draft
     *
     * Suggested request:
     * {
     *   "client_reference": "REPORT-...",
     *   "current_step": 2,
     *   "player_id": "uuid-or-null",
     *   "report_data": {},
     *   "media_ids": [],
     *   "saved_at": "ISO date"
     * }
     *
     * Suggested response:
     * {
     *   "draft": {
     *     "id": "uuid",
     *     "updated_at": "ISO date"
     *   }
     * }
     */

    return await scoutApiRequest(
      ScoutReportCreateConfig.api.saveDraft,
      {
        method: "POST",
        body: buildServerDraftPayload(
          localDraftPayload
        ),
        signal: controller.signal
      }
    );
  } finally {
    if (
      ScoutReportCreateState.abortControllers.draft ===
      controller
    ) {
      ScoutReportCreateState.abortControllers.draft =
        null;
    }
  }
}


/* =========================================================
   MAIN DRAFT SAVE CONTROLLER
========================================================= */

async function saveScoutReportDraft(
  options = {}
) {
  const {
    manual = false,
    syncWithServer = true,
    showNotification = manual
  } = options;

  if (
    ScoutReportCreateState.isSavingDraft ||
    ScoutReportCreateState.isSubmitting
  ) {
    return null;
  }

  ScoutReportCreateState.isSavingDraft = true;

  window.clearTimeout(
    ScoutReportCreateState.autosaveTimer
  );

  updateAutosaveStatus(
    "saving",
    manual
      ? "Saving report draft..."
      : "Autosaving..."
  );

  setButtonLoading(
    ScoutReportCreateDOM.saveDraftButton,
    manual,
    "Saving..."
  );

  try {
    const localDraftPayload =
      saveDraftLocally();

    if (syncWithServer && navigator.onLine) {
      try {
        const serverResponse =
          await saveDraftToServer(
            localDraftPayload
          );

        const draftData =
          serverResponse?.draft ||
          serverResponse?.data ||
          serverResponse;

        if (
          draftData?.id &&
          ScoutReportCreateDOM.form
        ) {
          ScoutReportCreateDOM.form.dataset.draftId =
            String(draftData.id);
        }
      } catch (error) {
        if (error.name === "AbortError") {
          return null;
        }

        console.warn(
          "Draft saved locally but server sync failed.",
          error
        );

        markReportAsSaved();

        updateAutosaveStatus(
          "saved",
          "Draft saved on this device"
        );

        if (showNotification) {
          showScoutNotification(
            "The draft was saved on this device, but could not be synced with the server.",
            "warning",
            {
              title: "Saved locally"
            }
          );
        }

        return localDraftPayload;
      }
    }

    markReportAsSaved();

    if (showNotification) {
      showScoutNotification(
        "Your scouting report draft has been saved.",
        "success",
        {
          title: "Draft saved"
        }
      );
    }

    return localDraftPayload;
  } catch (error) {
    console.error(
      "Unable to save scouting report draft.",
      error
    );

    updateAutosaveStatus(
      "error",
      "Draft could not be saved"
    );

    if (showNotification || manual) {
      showScoutNotification(
        error.message ||
        "The scouting report draft could not be saved.",
        "error",
        {
          title: "Draft save failed"
        }
      );
    }

    return null;
  } finally {
    ScoutReportCreateState.isSavingDraft = false;

    setButtonLoading(
      ScoutReportCreateDOM.saveDraftButton,
      false
    );
  }
}


/* =========================================================
   AUTOSAVE SCHEDULING
========================================================= */

function scheduleReportAutosave() {
  if (
    !ScoutReportCreateState.initialized ||
    ScoutReportCreateState.isSubmitting
  ) {
    return;
  }

  window.clearTimeout(
    ScoutReportCreateState.autosaveTimer
  );

  updateAutosaveStatus(
    "idle",
    "Unsaved changes"
  );

  ScoutReportCreateState.autosaveTimer =
    window.setTimeout(() => {
      if (
        !ScoutReportCreateState.hasUnsavedChanges
      ) {
        return;
      }

      saveScoutReportDraft({
        manual: false,
        syncWithServer: true,
        showNotification: false
      });
    }, ScoutReportCreateConfig.autosaveDelay);
}


/* =========================================================
   RESTORE FORM VALUES
========================================================= */

function restoreFormFieldValue(
  field,
  value
) {
  if (!field) {
    return;
  }

  if (
    field instanceof HTMLInputElement &&
    field.type === "checkbox"
  ) {
    field.checked =
      value === true ||
      value === "true" ||
      value === field.value;

    return;
  }

  if (
    field instanceof HTMLInputElement &&
    field.type === "radio"
  ) {
    field.checked =
      String(field.value) ===
      String(value);

    return;
  }

  if (Array.isArray(value)) {
    field.value =
      value.length
        ? String(value[0])
        : "";

    return;
  }

  field.value =
    value === null ||
    value === undefined
      ? ""
      : String(value);
}


function restoreFormData(formData = {}) {
  if (
    !ScoutReportCreateDOM.form ||
    !formData ||
    typeof formData !== "object"
  ) {
    return;
  }

  Object.entries(formData).forEach(
    ([fieldName, storedValue]) => {
      const escapedFieldName =
        window.CSS?.escape
          ? CSS.escape(fieldName)
          : fieldName.replace(
              /["\\]/g,
              "\\$&"
            );

      const matchingFields = Array.from(
        ScoutReportCreateDOM.form.querySelectorAll(
          `[name="${escapedFieldName}"]`
        )
      );

      if (!matchingFields.length) {
        return;
      }

      matchingFields.forEach((field) => {
        if (
          field instanceof HTMLInputElement &&
          field.type === "checkbox" &&
          Array.isArray(storedValue)
        ) {
          field.checked =
            storedValue
              .map(String)
              .includes(String(field.value));

          return;
        }

        restoreFormFieldValue(
          field,
          storedValue
        );
      });
    }
  );

  updateRatingOutput(
    ScoutReportCreateDOM.overallRatingInput,
    ScoutReportCreateDOM.overallRatingOutput
  );

  updateRatingOutput(
    ScoutReportCreateDOM.potentialRatingInput,
    ScoutReportCreateDOM.potentialRatingOutput
  );

  document
    .querySelectorAll(
      'input[type="range"][data-rating], ' +
      'input[type="range"].scout-rating-input'
    )
    .forEach((input) => {
      const targetId =
        input.dataset.outputTarget ||
        input.getAttribute("aria-controls");

      const output =
        (targetId &&
          document.getElementById(targetId)) ||
        input.parentElement?.querySelector(
          "output, [data-rating-value]"
        );

      updateRatingOutput(input, output);
    });

  [
    ScoutReportCreateDOM.summaryInput,
    ScoutReportCreateDOM.strengthsInput,
    ScoutReportCreateDOM.weaknessesInput,
    ScoutReportCreateDOM.recommendationInput,
    ScoutReportCreateDOM.privateNotesInput
  ]
    .filter(Boolean)
    .forEach(updateCharacterCounter);
}


/* =========================================================
   RESTORE LOCAL DRAFT
========================================================= */

function restoreLocalDraft(
  draftPayload,
  options = {}
) {
  const {
    notify = true
  } = options;

  if (
    !draftPayload ||
    typeof draftPayload !== "object"
  ) {
    return false;
  }

  restoreFormData(
    draftPayload.formData || {}
  );

  if (draftPayload.selectedPlayer) {
    const normalizedPlayer =
      normalizePlayerSearchResult(
        draftPayload.selectedPlayer
      );

    ScoutReportCreateState.selectedPlayer =
      normalizedPlayer;

    populatePlayerFormFields(
      normalizedPlayer
    );

    renderSelectedPlayerCard(
      normalizedPlayer
    );

    if (
      ScoutReportCreateDOM.playerSearchInput
    ) {
      ScoutReportCreateDOM.playerSearchInput.value =
        normalizedPlayer.name;

      ScoutReportCreateDOM.playerSearchInput.setAttribute(
        "data-selected-player-id",
        normalizedPlayer.id
      );
    }
  }

  restoreDraftMediaItems(
    draftPayload.media || []
  );

  const restoredStep =
    clampNumber(
      draftPayload.currentStep || 1,
      1,
      ScoutReportCreateState.totalSteps
    );

  showReportStep(restoredStep, {
    validateCurrentStep: false,
    updateHistory: false
  });

  if (
    draftPayload.clientReference &&
    ScoutReportCreateDOM.form
  ) {
    ScoutReportCreateDOM.form.dataset.clientReference =
      draftPayload.clientReference;
  }

  ScoutReportCreateState.lastSavedAt =
    draftPayload.savedAt
      ? new Date(draftPayload.savedAt)
      : null;

  ScoutReportCreateState.initialFormSnapshot =
    createStableFormSnapshot();

  ScoutReportCreateState.hasUnsavedChanges =
    false;

  updateUnsavedChangesUI();

  if (ScoutReportCreateState.lastSavedAt) {
    updateAutosaveStatus(
      "saved",
      `Draft restored from ${formatReadableDateTime(
        ScoutReportCreateState.lastSavedAt
      )}`
    );
  }

  if (notify) {
    showScoutNotification(
      "Your saved scouting report draft has been restored.",
      "success",
      {
        title: "Draft restored"
      }
    );
  }

  return true;
}


/* =========================================================
   DRAFT RESTORE PROMPT
========================================================= */

function shouldRestoreDraftAutomatically(
  draftPayload
) {
  if (!draftPayload?.savedAt) {
    return true;
  }

  const savedAt =
    new Date(draftPayload.savedAt);

  if (Number.isNaN(savedAt.getTime())) {
    return true;
  }

  const maximumDraftAge =
    30 * 24 * 60 * 60 * 1000;

  return (
    Date.now() - savedAt.getTime() <=
    maximumDraftAge
  );
}


function offerDraftRestoration(
  draftPayload
) {
  if (!draftPayload) {
    return;
  }

  const restoreButton =
    document.querySelector(
      "[data-restore-report-draft]"
    );

  const discardButton =
    document.querySelector(
      "[data-discard-report-draft]"
    );

  const draftPrompt =
    document.querySelector(
      "[data-report-draft-prompt]"
    );

  if (
    draftPrompt &&
    restoreButton &&
    discardButton
  ) {
    draftPrompt.hidden = false;
    draftPrompt.classList.add("is-visible");

    restoreButton.addEventListener(
      "click",
      () => {
        restoreLocalDraft(draftPayload);

        draftPrompt.classList.remove(
          "is-visible"
        );

        draftPrompt.hidden = true;
      },
      {
        once: true
      }
    );

    discardButton.addEventListener(
      "click",
      () => {
        removeLocalDraft();

        draftPrompt.classList.remove(
          "is-visible"
        );

        draftPrompt.hidden = true;

        showScoutNotification(
          "The saved report draft was discarded.",
          "info"
        );
      },
      {
        once: true
      }
    );

    return;
  }

  if (
    shouldRestoreDraftAutomatically(
      draftPayload
    )
  ) {
    restoreLocalDraft(draftPayload, {
      notify: true
    });
  }
}


/* =========================================================
   DISCARD CURRENT DRAFT
========================================================= */

function discardScoutReportDraft(
  options = {}
) {
  const {
    resetForm = false,
    notify = true
  } = options;

  removeLocalDraft();

  ScoutReportCreateDOM.form?.removeAttribute(
    "data-draft-id"
  );

  ScoutReportCreateDOM.form?.removeAttribute(
    "data-client-reference"
  );

  ScoutReportCreateState.lastSavedAt = null;

  if (resetForm) {
    ScoutReportCreateDOM.form?.reset();

    clearSelectedPlayer({
      clearPlayerFields: true,
      notify: false
    });

    clearAllMediaFiles({
      notify: false,
      markChanged: false
    });

    applyInitialFormDefaults();

    showReportStep(1, {
      validateCurrentStep: false,
      updateHistory: false
    });

    clearAllFieldErrors();
    renderValidationSummary([]);
  }

  ScoutReportCreateState.initialFormSnapshot =
    createStableFormSnapshot();

  ScoutReportCreateState.hasUnsavedChanges =
    false;

  updateUnsavedChangesUI();
  updateAutosaveStatus("idle", "");

  if (notify) {
    showScoutNotification(
      "The report draft has been discarded.",
      "info"
    );
  }
}


/* =========================================================
   ONLINE AND OFFLINE DRAFT SYNC
========================================================= */

function handleNetworkStatusChange() {
  if (navigator.onLine) {
    showScoutNotification(
      "Internet connection restored.",
      "success"
    );

    if (
      ScoutReportCreateState.hasUnsavedChanges
    ) {
      scheduleReportAutosave();
    }

    return;
  }

  showScoutNotification(
    "You are offline. Drafts will continue saving on this device.",
    "warning",
    {
      title: "Offline mode"
    }
  );

  updateAutosaveStatus(
    "idle",
    "Offline — drafts save locally"
  );
}


/* =========================================================
   PAGE EXIT PROTECTION
========================================================= */

function handleBeforeUnload(event) {
  if (
    !ScoutReportCreateState.hasUnsavedChanges ||
    ScoutReportCreateState.isSubmitting
  ) {
    return;
  }

  event.preventDefault();
  event.returnValue = "";
}


function handlePageVisibilityChange() {
  if (
    document.visibilityState !== "hidden" ||
    !ScoutReportCreateState.hasUnsavedChanges ||
    ScoutReportCreateState.isSubmitting
  ) {
    return;
  }

  try {
    saveDraftLocally();
  } catch (error) {
    console.warn(
      "Unable to save draft while leaving the page.",
      error
    );
  }
}


/* =========================================================
   INITIALIZE DRAFT MANAGEMENT
========================================================= */

function initializeDraftManagement() {
  if (!ScoutReportCreateDOM.form) {
    return;
  }

  ensureAutosaveStatusElement();
  ensureUnsavedChangesBar();

  if (
    !ScoutReportCreateDOM.form.dataset
      .clientReference
  ) {
    ScoutReportCreateDOM.form.dataset.clientReference =
      generateClientReference("REPORT");
  }

  ScoutReportCreateState.initialFormSnapshot =
    createStableFormSnapshot();

  ScoutReportCreateDOM.form.addEventListener(
    "input",
    () => {
      markReportAsChanged();
    }
  );

  ScoutReportCreateDOM.form.addEventListener(
    "change",
    () => {
      markReportAsChanged();
    }
  );

  ScoutReportCreateDOM.saveDraftButton
    ?.addEventListener("click", () => {
      saveScoutReportDraft({
        manual: true
      });
    });

  window.addEventListener(
    "online",
    handleNetworkStatusChange
  );

  window.addEventListener(
    "offline",
    handleNetworkStatusChange
  );

  window.addEventListener(
    "beforeunload",
    handleBeforeUnload
  );

  document.addEventListener(
    "visibilitychange",
    handlePageVisibilityChange
  );

  const localDraft = getLocalDraft();

  if (localDraft) {
    offerDraftRestoration(localDraft);
  }
}


/* =========================================================
   END OF SCOUT-REPORT-CREATE.JS — PART 2D
   CONTINUE DIRECTLY WITH PART 2E
========================================================= */

/* =========================================================
   SCOUT-REPORT-CREATE.JS
   PART 2E
   REPORT PAYLOAD, SUBMISSION AND SUCCESS HANDLING
   CONTINUES DIRECTLY FROM PART 2D
========================================================= */


/* =========================================================
   FORM VALUE HELPERS
========================================================= */

function getFormControlValue(
  control,
  fallback = ""
) {
  if (!control) {
    return fallback;
  }

  if (
    control instanceof HTMLInputElement &&
    control.type === "checkbox"
  ) {
    return control.checked;
  }

  if (
    control instanceof HTMLInputElement &&
    control.type === "radio"
  ) {
    const selectedRadio =
      ScoutReportCreateDOM.form?.querySelector(
        `input[type="radio"][name="${control.name}"]:checked`
      );

    return selectedRadio?.value ?? fallback;
  }

  const value = control.value;

  return value === undefined ||
    value === null
    ? fallback
    : value;
}


function getTrimmedFormControlValue(
  control,
  fallback = ""
) {
  return normalizeText(
    getFormControlValue(
      control,
      fallback
    )
  );
}


function getNumericFormControlValue(
  control,
  fallback = null
) {
  if (!control) {
    return fallback;
  }

  const rawValue =
    normalizeText(control.value);

  if (rawValue === "") {
    return fallback;
  }

  const numericValue =
    Number(rawValue);

  return Number.isFinite(numericValue)
    ? numericValue
    : fallback;
}


/* =========================================================
   RATING DATA COLLECTION
========================================================= */

function createRatingKey(input, index) {
  const rawKey =
    input.dataset.ratingKey ||
    input.name ||
    input.id ||
    `rating_${index + 1}`;

  return normalizeText(rawKey)
    .replace(/\[\]$/, "")
    .replace(/[^a-zA-Z0-9_]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .toLowerCase();
}


function serializeRatingInputs(inputs = []) {
  const serializedRatings = {};

  inputs
    .filter((input) => {
      return (
        input instanceof HTMLInputElement &&
        input.type === "range"
      );
    })
    .forEach((input, index) => {
      const key =
        createRatingKey(input, index);

      serializedRatings[key] =
        getNumericFormControlValue(
          input,
          0
        );
    });

  return serializedRatings;
}


function buildReportRatingPayload() {
  const technicalRatings =
    serializeRatingInputs(
      ScoutReportCreateDOM.technicalInputs
    );

  const physicalRatings =
    serializeRatingInputs(
      ScoutReportCreateDOM.physicalInputs
    );

  const tacticalRatings =
    serializeRatingInputs(
      ScoutReportCreateDOM.tacticalInputs
    );

  const mentalRatings =
    serializeRatingInputs(
      ScoutReportCreateDOM.mentalInputs
    );

  return {
    technical: technicalRatings,
    physical: physicalRatings,
    tactical: tacticalRatings,
    mental: mentalRatings,
    overall:
      getNumericFormControlValue(
        ScoutReportCreateDOM.overallRatingInput,
        null
      ),
    potential:
      getNumericFormControlValue(
        ScoutReportCreateDOM.potentialRatingInput,
        null
      )
  };
}


/* =========================================================
   ADDITIONAL FORM DATA
========================================================= */

function collectAdditionalReportFields() {
  if (!ScoutReportCreateDOM.form) {
    return {};
  }

  const knownElements = new Set(
    [
      ScoutReportCreateDOM.selectedPlayerIdInput,
      ScoutReportCreateDOM.reportTitleInput,
      ScoutReportCreateDOM.reportDateInput,
      ScoutReportCreateDOM.matchDateInput,
      ScoutReportCreateDOM.competitionInput,
      ScoutReportCreateDOM.venueInput,
      ScoutReportCreateDOM.playerNameInput,
      ScoutReportCreateDOM.playerAgeInput,
      ScoutReportCreateDOM.playerDobInput,
      ScoutReportCreateDOM.playerPositionInput,
      ScoutReportCreateDOM.preferredFootInput,
      ScoutReportCreateDOM.playerAcademyInput,
      ScoutReportCreateDOM.playerLocationInput,
      ScoutReportCreateDOM.jerseyNumberInput,
      ScoutReportCreateDOM.overallRatingInput,
      ScoutReportCreateDOM.potentialRatingInput,
      ScoutReportCreateDOM.summaryInput,
      ScoutReportCreateDOM.strengthsInput,
      ScoutReportCreateDOM.weaknessesInput,
      ScoutReportCreateDOM.recommendationInput,
      ScoutReportCreateDOM.privateNotesInput,
      ScoutReportCreateDOM.recommendationStatusInput,
      ScoutReportCreateDOM.priorityInput,
      ScoutReportCreateDOM.visibilityInput,
      ScoutReportCreateDOM.consentCheckbox,
      ScoutReportCreateDOM.confirmationCheckbox,
      ScoutReportCreateDOM.mediaInput,
      ...ScoutReportCreateDOM.technicalInputs,
      ...ScoutReportCreateDOM.physicalInputs,
      ...ScoutReportCreateDOM.tacticalInputs,
      ...ScoutReportCreateDOM.mentalInputs
    ].filter(Boolean)
  );

  const additionalData = {};

  const controls = Array.from(
    ScoutReportCreateDOM.form.elements
  ).filter((control) => {
    return (
      control instanceof
        HTMLInputElement ||
      control instanceof
        HTMLSelectElement ||
      control instanceof
        HTMLTextAreaElement
    );
  });

  controls.forEach((control) => {
    if (
      knownElements.has(control) ||
      control.disabled ||
      !control.name ||
      control.type === "file" ||
      control.type === "submit" ||
      control.type === "button" ||
      control.type === "reset"
    ) {
      return;
    }

    if (
      control instanceof HTMLInputElement &&
      control.type === "radio"
    ) {
      if (!control.checked) {
        return;
      }

      additionalData[control.name] =
        control.value;

      return;
    }

    if (
      control instanceof HTMLInputElement &&
      control.type === "checkbox"
    ) {
      if (
        Object.prototype.hasOwnProperty.call(
          additionalData,
          control.name
        )
      ) {
        const existingValue =
          additionalData[control.name];

        if (!Array.isArray(existingValue)) {
          additionalData[control.name] = [
            existingValue
          ];
        }

        if (control.checked) {
          additionalData[
            control.name
          ].push(
            control.value || true
          );
        }

        return;
      }

      additionalData[control.name] =
        control.checked
          ? control.value || true
          : false;

      return;
    }

    additionalData[control.name] =
      normalizeText(control.value);
  });

  return additionalData;
}


/* =========================================================
   REPORT PAYLOAD CREATION
========================================================= */

function buildScoutReportPayload() {
  const selectedPlayerId =
    getTrimmedFormControlValue(
      ScoutReportCreateDOM.selectedPlayerIdInput
    ) ||
    ScoutReportCreateState.selectedPlayer?.id ||
    null;

  const clientReference =
    ScoutReportCreateDOM.form?.dataset
      .clientReference ||
    generateClientReference("REPORT");

  const draftId =
    ScoutReportCreateDOM.form?.dataset
      .draftId ||
    null;

  return {
    client_reference: clientReference,
    draft_id: draftId,

    player: {
      id: selectedPlayerId,
      name:
        getTrimmedFormControlValue(
          ScoutReportCreateDOM.playerNameInput
        ),
      age:
        getNumericFormControlValue(
          ScoutReportCreateDOM.playerAgeInput,
          null
        ),
      date_of_birth:
        getTrimmedFormControlValue(
          ScoutReportCreateDOM.playerDobInput
        ) || null,
      primary_position:
        getTrimmedFormControlValue(
          ScoutReportCreateDOM.playerPositionInput
        ),
      preferred_foot:
        getTrimmedFormControlValue(
          ScoutReportCreateDOM.preferredFootInput
        ),
      academy_name:
        getTrimmedFormControlValue(
          ScoutReportCreateDOM.playerAcademyInput
        ) || null,
      location:
        getTrimmedFormControlValue(
          ScoutReportCreateDOM.playerLocationInput
        ),
      jersey_number:
        getNumericFormControlValue(
          ScoutReportCreateDOM.jerseyNumberInput,
          null
        )
    },

    observation: {
      title:
        getTrimmedFormControlValue(
          ScoutReportCreateDOM.reportTitleInput
        ),
      report_date:
        getTrimmedFormControlValue(
          ScoutReportCreateDOM.reportDateInput
        ),
      match_date:
        getTrimmedFormControlValue(
          ScoutReportCreateDOM.matchDateInput
        ),
      competition:
        getTrimmedFormControlValue(
          ScoutReportCreateDOM.competitionInput
        ),
      venue:
        getTrimmedFormControlValue(
          ScoutReportCreateDOM.venueInput
        )
    },

    ratings:
      buildReportRatingPayload(),

    assessment: {
      summary:
        getTrimmedFormControlValue(
          ScoutReportCreateDOM.summaryInput
        ),
      strengths:
        getTrimmedFormControlValue(
          ScoutReportCreateDOM.strengthsInput
        ),
      development_areas:
        getTrimmedFormControlValue(
          ScoutReportCreateDOM.weaknessesInput
        ),
      recommendation:
        getTrimmedFormControlValue(
          ScoutReportCreateDOM.recommendationInput
        ),
      private_notes:
        getTrimmedFormControlValue(
          ScoutReportCreateDOM.privateNotesInput
        ) || null
    },

    decision: {
      recommendation_status:
        getTrimmedFormControlValue(
          ScoutReportCreateDOM.recommendationStatusInput
        ),
      priority:
        getTrimmedFormControlValue(
          ScoutReportCreateDOM.priorityInput
        ),
      visibility:
        getTrimmedFormControlValue(
          ScoutReportCreateDOM.visibilityInput
        )
    },

    confirmations: {
      player_or_guardian_consent:
        Boolean(
          ScoutReportCreateDOM.consentCheckbox
            ?.checked
        ),
      report_accuracy_confirmed:
        Boolean(
          ScoutReportCreateDOM.confirmationCheckbox
            ?.checked
        )
    },

    media_ids:
      Array.from(
        new Set(
          ScoutReportCreateState.uploadedMediaIds
            .filter(Boolean)
            .map(String)
        )
      ),

    additional_fields:
      collectAdditionalReportFields(),

    submitted_from: {
      platform: "web",
      portal: "scout",
      timezone:
        Intl.DateTimeFormat()
          .resolvedOptions()
          .timeZone || "Asia/Kolkata",
      language:
        document.documentElement.lang ||
        navigator.language ||
        "en-IN"
    }
  };
}


/* =========================================================
   REPORT PAYLOAD SANITIZATION
========================================================= */

function removeUndefinedValues(value) {
  if (Array.isArray(value)) {
    return value
      .map(removeUndefinedValues)
      .filter(
        (item) => item !== undefined
      );
  }

  if (
    value &&
    typeof value === "object" &&
    !(value instanceof Date)
  ) {
    return Object.fromEntries(
      Object.entries(value)
        .map(([key, nestedValue]) => [
          key,
          removeUndefinedValues(
            nestedValue
          )
        ])
        .filter(
          ([, nestedValue]) =>
            nestedValue !== undefined
        )
    );
  }

  return value === undefined
    ? undefined
    : value;
}


function sanitizeScoutReportPayload(
  payload
) {
  return removeUndefinedValues(payload);
}


/* =========================================================
   SUBMISSION API REQUEST
========================================================= */

async function submitScoutReportToServer(
  reportPayload
) {
  if (
    ScoutReportCreateState.abortControllers.submit
  ) {
    ScoutReportCreateState.abortControllers.submit.abort();
  }

  const controller =
    new AbortController();

  ScoutReportCreateState.abortControllers.submit =
    controller;

  try {
    /*
     * MR. HARSH BACKEND CONTRACT SUGGESTION
     *
     * POST /api/v1/scout/reports
     *
     * Authorization:
     * Bearer JWT
     *
     * Suggested success response:
     * {
     *   "report": {
     *     "id": "uuid",
     *     "reference_number": "SCR-2026-0001",
     *     "status": "submitted",
     *     "created_at": "ISO date"
     *   },
     *   "message": "Report submitted successfully"
     * }
     *
     * Suggested validation error response:
     * {
     *   "message": "Validation failed",
     *   "errors": {
     *     "player.name": [
     *       "Player name is required"
     *     ]
     *   }
     * }
     */

    return await scoutApiRequest(
      ScoutReportCreateConfig.api.createReport,
      {
        method: "POST",
        body:
          sanitizeScoutReportPayload(
            reportPayload
          ),
        signal:
          controller.signal
      }
    );
  } finally {
    if (
      ScoutReportCreateState.abortControllers.submit ===
      controller
    ) {
      ScoutReportCreateState.abortControllers.submit =
        null;
    }
  }
}


/* =========================================================
   FRONTEND SUBMISSION FALLBACK
========================================================= */

function createMockReportSubmission(
  reportPayload
) {
  return new Promise((resolve) => {
    window.setTimeout(() => {
      const referenceNumber =
        generateClientReference("SCR");

      resolve({
        report: {
          id:
            generateClientReference(
              "REPORT"
            ),
          reference_number:
            referenceNumber,
          status: "submitted",
          created_at:
            new Date().toISOString(),
          player_name:
            reportPayload.player.name
        },
        message:
          "Report submitted successfully in frontend demonstration mode.",
        demo: true
      });
    }, 900);
  });
}


/* =========================================================
   SUBMISSION ERROR NORMALIZATION
========================================================= */

function normalizeServerValidationErrors(
  errorData
) {
  const normalizedErrors = [];

  const sourceErrors =
    errorData?.errors ||
    errorData?.field_errors ||
    errorData?.validation_errors ||
    {};

  if (Array.isArray(sourceErrors)) {
    sourceErrors.forEach(
      (errorItem) => {
        if (
          typeof errorItem === "string"
        ) {
          normalizedErrors.push({
            fieldPath: "",
            message: errorItem
          });

          return;
        }

        normalizedErrors.push({
          fieldPath:
            errorItem.field ||
            errorItem.path ||
            errorItem.location ||
            "",
          message:
            errorItem.message ||
            errorItem.msg ||
            "Invalid report data."
        });
      }
    );

    return normalizedErrors;
  }

  if (
    sourceErrors &&
    typeof sourceErrors === "object"
  ) {
    Object.entries(sourceErrors).forEach(
      ([fieldPath, messages]) => {
        const resolvedMessages =
          Array.isArray(messages)
            ? messages
            : [messages];

        resolvedMessages.forEach(
          (message) => {
            normalizedErrors.push({
              fieldPath,
              message:
                typeof message === "string"
                  ? message
                  : message?.message ||
                    message?.msg ||
                    "Invalid value."
            });
          }
        );
      }
    );
  }

  return normalizedErrors;
}


/* =========================================================
   SERVER FIELD MAPPING
========================================================= */

function getFieldForServerPath(
  fieldPath
) {
  const normalizedPath =
    normalizeText(fieldPath)
      .replace(/\[(\w+)\]/g, ".$1")
      .toLowerCase();

  const fieldMap = {
    "player.id":
      ScoutReportCreateDOM.selectedPlayerIdInput ||
      ScoutReportCreateDOM.playerSearchInput,

    "player.name":
      ScoutReportCreateDOM.playerNameInput,

    "player.age":
      ScoutReportCreateDOM.playerAgeInput,

    "player.date_of_birth":
      ScoutReportCreateDOM.playerDobInput,

    "player.primary_position":
      ScoutReportCreateDOM.playerPositionInput,

    "player.preferred_foot":
      ScoutReportCreateDOM.preferredFootInput,

    "player.academy_name":
      ScoutReportCreateDOM.playerAcademyInput,

    "player.location":
      ScoutReportCreateDOM.playerLocationInput,

    "player.jersey_number":
      ScoutReportCreateDOM.jerseyNumberInput,

    "observation.title":
      ScoutReportCreateDOM.reportTitleInput,

    "observation.report_date":
      ScoutReportCreateDOM.reportDateInput,

    "observation.match_date":
      ScoutReportCreateDOM.matchDateInput,

    "observation.competition":
      ScoutReportCreateDOM.competitionInput,

    "observation.venue":
      ScoutReportCreateDOM.venueInput,

    "ratings.overall":
      ScoutReportCreateDOM.overallRatingInput,

    "ratings.potential":
      ScoutReportCreateDOM.potentialRatingInput,

    "assessment.summary":
      ScoutReportCreateDOM.summaryInput,

    "assessment.strengths":
      ScoutReportCreateDOM.strengthsInput,

    "assessment.development_areas":
      ScoutReportCreateDOM.weaknessesInput,

    "assessment.recommendation":
      ScoutReportCreateDOM.recommendationInput,

    "assessment.private_notes":
      ScoutReportCreateDOM.privateNotesInput,

    "decision.recommendation_status":
      ScoutReportCreateDOM.recommendationStatusInput,

    "decision.priority":
      ScoutReportCreateDOM.priorityInput,

    "decision.visibility":
      ScoutReportCreateDOM.visibilityInput,

    "confirmations.player_or_guardian_consent":
      ScoutReportCreateDOM.consentCheckbox,

    "confirmations.report_accuracy_confirmed":
      ScoutReportCreateDOM.confirmationCheckbox
  };

  if (fieldMap[normalizedPath]) {
    return fieldMap[normalizedPath];
  }

  const finalSegment =
    normalizedPath
      .split(".")
      .filter(Boolean)
      .at(-1);

  if (
    !finalSegment ||
    !ScoutReportCreateDOM.form
  ) {
    return null;
  }

  const possibleNames = [
    finalSegment,
    finalSegment.replace(
      /_([a-z])/g,
      (_, letter) =>
        letter.toUpperCase()
    )
  ];

  for (
    const possibleName of possibleNames
  ) {
    const escapedName =
      window.CSS?.escape
        ? CSS.escape(possibleName)
        : possibleName.replace(
            /["\\]/g,
            "\\$&"
          );

    const matchingField =
      ScoutReportCreateDOM.form.querySelector(
        `[name="${escapedName}"]`
      );

    if (matchingField) {
      return matchingField;
    }
  }

  return null;
}


/* =========================================================
   SERVER VALIDATION ERROR DISPLAY
========================================================= */

function displayServerValidationErrors(
  errorData
) {
  const normalizedErrors =
    normalizeServerValidationErrors(
      errorData
    );

  if (!normalizedErrors.length) {
    return false;
  }

  const summaryErrors =
    normalizedErrors.map(
      ({ fieldPath, message }) => {
        const field =
          getFieldForServerPath(
            fieldPath
          );

        if (field) {
          displayFieldError(
            field,
            message
          );
        }

        return {
          field,
          message
        };
      }
    );

  renderValidationSummary(
    summaryErrors
  );

  const firstField =
    summaryErrors.find(
      (error) => error.field
    )?.field;

  if (firstField) {
    const stepPanel =
      firstField.closest(
        "[data-report-step], " +
        ".scout-report-step-panel"
      );

    const stepNumber =
      getStepNumberFromPanel(
        stepPanel
      );

    if (stepNumber) {
      showReportStep(stepNumber, {
        validateCurrentStep: false
      });
    }

    scrollElementIntoView(firstField);

    window.setTimeout(() => {
      firstField.focus({
        preventScroll: true
      });
    }, 250);
  }

  return true;
}


/* =========================================================
   SUCCESS MODAL
========================================================= */

function ensureReportSuccessModal() {
  let modal =
    document.getElementById(
      "scoutReportSuccessModal"
    );

  if (modal) {
    return modal;
  }

  modal =
    document.createElement("div");

  modal.id =
    "scoutReportSuccessModal";

  modal.className =
    "scout-report-success-modal";

  modal.setAttribute(
    "data-report-success-modal",
    ""
  );

  modal.setAttribute(
    "role",
    "dialog"
  );

  modal.setAttribute(
    "aria-modal",
    "true"
  );

  modal.setAttribute(
    "aria-labelledby",
    "scoutReportSuccessTitle"
  );

  modal.hidden = true;

  modal.innerHTML = `
    <div
      class="scout-report-success-backdrop"
      data-success-modal-close
    ></div>

    <div
      class="scout-report-success-dialog"
      role="document"
    >
      <div
        class="scout-report-success-icon"
        aria-hidden="true"
      >
        ✓
      </div>

      <h2 id="scoutReportSuccessTitle">
        Report submitted
      </h2>

      <p data-success-modal-message>
        The scouting report has been submitted successfully.
      </p>

      <div
        class="scout-report-success-reference"
        data-success-reference-container
        hidden
      >
        <span>Report reference</span>

        <strong
          data-success-reference
        ></strong>
      </div>

      <div
        class="scout-report-success-actions"
      >
        <button
          type="button"
          class="scout-secondary-button"
          data-create-another-report
        >
          Create another report
        </button>

        <a
          class="scout-primary-button"
          href="scout-reports.html"
          data-view-submitted-reports
        >
          View reports
        </a>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  modal
    .querySelectorAll(
      "[data-success-modal-close]"
    )
    .forEach((closeTarget) => {
      closeTarget.addEventListener(
        "click",
        closeReportSuccessModal
      );
    });

  modal
    .querySelector(
      "[data-create-another-report]"
    )
    ?.addEventListener(
      "click",
      () => {
        closeReportSuccessModal();
        resetScoutReportForm({
          notify: false
        });
      }
    );

  return modal;
}


/* =========================================================
   SUCCESS MODAL CONTROLS
========================================================= */

function openReportSuccessModal(
  reportData = {},
  message = ""
) {
  const modal =
    ensureReportSuccessModal();

  const referenceNumber =
    reportData.reference_number ||
    reportData.referenceNumber ||
    reportData.id ||
    "";

  const messageElement =
    modal.querySelector(
      "[data-success-modal-message]"
    );

  const referenceContainer =
    modal.querySelector(
      "[data-success-reference-container]"
    );

  const referenceElement =
    modal.querySelector(
      "[data-success-reference]"
    );

  if (messageElement) {
    messageElement.textContent =
      message ||
      "The scouting report has been submitted successfully.";
  }

  if (
    referenceContainer &&
    referenceElement
  ) {
    if (referenceNumber) {
      referenceElement.textContent =
        String(referenceNumber);

      referenceContainer.hidden =
        false;
    } else {
      referenceElement.textContent =
        "";

      referenceContainer.hidden =
        true;
    }
  }

  modal.hidden = false;
  modal.classList.add("is-visible");

  document.body.classList.add(
    "scout-modal-open"
  );

  const firstFocusable =
    modal.querySelector(
      "button, a[href]"
    );

  window.setTimeout(() => {
    firstFocusable?.focus();
  }, 50);
}


function closeReportSuccessModal() {
  const modal =
    document.getElementById(
      "scoutReportSuccessModal"
    );

  if (!modal) {
    return;
  }

  modal.classList.remove(
    "is-visible"
  );

  document.body.classList.remove(
    "scout-modal-open"
  );

  window.setTimeout(() => {
    modal.hidden = true;
  }, 200);
}


/* =========================================================
   FORM RESET AFTER SUBMISSION
========================================================= */

function resetScoutReportForm(
  options = {}
) {
  const {
    notify = true
  } = options;

  window.clearTimeout(
    ScoutReportCreateState.autosaveTimer
  );

  ScoutReportCreateState.abortControllers
    .playerSearch?.abort();

  ScoutReportCreateState.abortControllers
    .draft?.abort();

  ScoutReportCreateDOM.form?.reset();

  ScoutReportCreateState.selectedPlayer =
    null;

  if (
    ScoutReportCreateDOM.playerSearchInput
  ) {
    ScoutReportCreateDOM.playerSearchInput.value =
      "";

    ScoutReportCreateDOM.playerSearchInput
      .removeAttribute(
        "data-selected-player-id"
      );
  }

  if (
    ScoutReportCreateDOM.selectedPlayerCard
  ) {
    ScoutReportCreateDOM.selectedPlayerCard.hidden =
      true;

    ScoutReportCreateDOM.selectedPlayerCard
      .classList.remove("is-visible");

    ScoutReportCreateDOM.selectedPlayerCard
      .setAttribute(
        "aria-hidden",
        "true"
      );
  }

  closePlayerSearchResults();

  clearAllMediaFiles({
    notify: false,
    markChanged: false
  });

  removeLocalDraft();

  ScoutReportCreateDOM.form
    ?.removeAttribute(
      "data-draft-id"
    );

  if (ScoutReportCreateDOM.form) {
    ScoutReportCreateDOM.form.dataset
      .clientReference =
      generateClientReference("REPORT");
  }

  applyInitialFormDefaults();
  clearAllFieldErrors();
  renderValidationSummary([]);

  showReportStep(1, {
    validateCurrentStep: false,
    updateHistory: false
  });

  [
    ScoutReportCreateDOM.summaryInput,
    ScoutReportCreateDOM.strengthsInput,
    ScoutReportCreateDOM.weaknessesInput,
    ScoutReportCreateDOM.recommendationInput,
    ScoutReportCreateDOM.privateNotesInput
  ]
    .filter(Boolean)
    .forEach(updateCharacterCounter);

  ScoutReportCreateState.lastSavedAt =
    null;

  ScoutReportCreateState.hasUnsavedChanges =
    false;

  ScoutReportCreateState.initialFormSnapshot =
    createStableFormSnapshot();

  updateUnsavedChangesUI();
  updateAutosaveStatus("idle", "");

  if (notify) {
    showScoutNotification(
      "The report form has been reset.",
      "info"
    );
  }

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}


/* =========================================================
   SUCCESSFUL SUBMISSION HANDLING
========================================================= */

function handleSuccessfulReportSubmission(
  responseData
) {
  const reportData =
    responseData?.report ||
    responseData?.data ||
    responseData ||
    {};

  const successMessage =
    responseData?.message ||
    "The scouting report has been submitted successfully.";

  removeLocalDraft();

  ScoutReportCreateState.hasUnsavedChanges =
    false;

  ScoutReportCreateState.lastSavedAt =
    null;

  ScoutReportCreateState.initialFormSnapshot =
    createStableFormSnapshot();

  updateUnsavedChangesUI();
  updateAutosaveStatus(
    "saved",
    "Report submitted"
  );

  showScoutNotification(
    successMessage,
    "success",
    {
      title: "Report submitted",
      duration: 5000
    }
  );

  openReportSuccessModal(
    reportData,
    successMessage
  );

  document.dispatchEvent(
    new CustomEvent(
      "fmi:scout-report-submitted",
      {
        detail: {
          report: reportData,
          response: responseData
        }
      }
    )
  );
}


/* =========================================================
   MAIN REPORT SUBMISSION CONTROLLER
========================================================= */

async function handleScoutReportSubmission(
  event
) {
  event?.preventDefault();

  if (
    ScoutReportCreateState.isSubmitting ||
    ScoutReportCreateState.isSavingDraft
  ) {
    return;
  }

  const validationResult =
    validateEntireScoutReport({
      showSummary: true,
      focusFirstError: true
    });

  if (!validationResult.valid) {
    showScoutNotification(
      "Please correct the highlighted fields before submitting the report.",
      "error",
      {
        title: "Report incomplete"
      }
    );

    return;
  }

  ScoutReportCreateState.isSubmitting =
    true;

  window.clearTimeout(
    ScoutReportCreateState.autosaveTimer
  );

  setButtonLoading(
    ScoutReportCreateDOM.submitButton,
    true,
    "Submitting report..."
  );

  if (
    ScoutReportCreateDOM.saveDraftButton
  ) {
    ScoutReportCreateDOM.saveDraftButton.disabled =
      true;
  }

  updateAutosaveStatus(
    "saving",
    "Preparing report..."
  );

  try {
    if (
      ScoutReportCreateState.uploadedFiles.length
    ) {
      updateAutosaveStatus(
        "saving",
        "Uploading report media..."
      );

      await uploadPendingMediaFiles();
    }

    const failedMedia =
      ScoutReportCreateState.uploadedFiles.filter(
        (mediaItem) =>
          mediaItem.status === "failed"
      );

    if (failedMedia.length) {
      throw new Error(
        "One or more media files could not be uploaded. Remove them or retry before submitting."
      );
    }

    updateAutosaveStatus(
      "saving",
      "Submitting scouting report..."
    );

    const reportPayload =
      buildScoutReportPayload();

    let responseData;

    try {
      responseData =
        await submitScoutReportToServer(
          reportPayload
        );
    } catch (error) {
      if (error.name === "AbortError") {
        return;
      }

      if (
        error.status === 400 ||
        error.status === 409 ||
        error.status === 422
      ) {
        const displayed =
          displayServerValidationErrors(
            error.data
          );

        if (displayed) {
          throw new Error(
            error.message ||
            "The server rejected some report fields."
          );
        }
      }

      /*
       * FRONTEND FALLBACK:
       * Remove this fallback once the live backend
       * endpoint is available in production.
       */
      if (
        !navigator.onLine ||
        error.status >= 500 ||
        !error.status
      ) {
        console.warn(
          "Report API unavailable. Using frontend demonstration response.",
          error
        );

        responseData =
          await createMockReportSubmission(
            reportPayload
          );
      } else {
        throw error;
      }
    }

    handleSuccessfulReportSubmission(
      responseData
    );
  } catch (error) {
    if (error.name === "AbortError") {
      updateAutosaveStatus(
        "idle",
        "Submission cancelled"
      );

      return;
    }

    console.error(
      "Scouting report submission failed.",
      error
    );

    updateAutosaveStatus(
      "error",
      "Report submission failed"
    );

    showScoutNotification(
      error.message ||
      "The scouting report could not be submitted.",
      "error",
      {
        title: "Submission failed",
        persistent: true
      }
    );
  } finally {
    ScoutReportCreateState.isSubmitting =
      false;

    setButtonLoading(
      ScoutReportCreateDOM.submitButton,
      false
    );

    if (
      ScoutReportCreateDOM.saveDraftButton
    ) {
      ScoutReportCreateDOM.saveDraftButton.disabled =
        false;
    }
  }
}


/* =========================================================
   SUBMISSION CANCELLATION
========================================================= */

function cancelActiveReportSubmission() {
  ScoutReportCreateState.abortControllers.submit
    ?.abort();

  ScoutReportCreateState.abortControllers.upload
    ?.abort();

  ScoutReportCreateState.abortControllers.submit =
    null;

  ScoutReportCreateState.abortControllers.upload =
    null;

  ScoutReportCreateState.isSubmitting =
    false;

  setButtonLoading(
    ScoutReportCreateDOM.submitButton,
    false
  );

  updateAutosaveStatus(
    "idle",
    "Submission cancelled"
  );
}


/* =========================================================
   CANCEL BUTTON HANDLING
========================================================= */

function handleCancelReportAction() {
  if (
    ScoutReportCreateState.isSubmitting
  ) {
    cancelActiveReportSubmission();

    showScoutNotification(
      "Report submission was cancelled.",
      "info"
    );

    return;
  }

  if (
    ScoutReportCreateState.hasUnsavedChanges
  ) {
    const shouldLeave =
      window.confirm(
        "You have unsaved report changes. Leave this page without saving them?"
      );

    if (!shouldLeave) {
      return;
    }
  }

  ScoutReportCreateState.hasUnsavedChanges =
    false;

  window.location.href =
    ScoutReportCreateDOM.cancelButton
      ?.dataset.cancelUrl ||
    "scout-reports.html";
}


/* =========================================================
   RESET BUTTON HANDLING
========================================================= */

function handleResetReportAction() {
  if (
    ScoutReportCreateState.isSubmitting
  ) {
    return;
  }

  const shouldReset =
    window.confirm(
      "Reset the entire scouting report? All unsaved information and selected media will be removed."
    );

  if (!shouldReset) {
    return;
  }

  resetScoutReportForm({
    notify: true
  });
}


/* =========================================================
   SUBMISSION EVENT INITIALIZATION
========================================================= */

function initializeReportSubmission() {
  if (!ScoutReportCreateDOM.form) {
    return;
  }

  ScoutReportCreateDOM.form.addEventListener(
    "submit",
    handleScoutReportSubmission
  );

  ScoutReportCreateDOM.submitButton
    ?.addEventListener(
      "click",
      (event) => {
        if (
          ScoutReportCreateDOM.submitButton
            .type !== "submit"
        ) {
          handleScoutReportSubmission(
            event
          );
        }
      }
    );

  ScoutReportCreateDOM.resetButton
    ?.addEventListener(
      "click",
      handleResetReportAction
    );

  ScoutReportCreateDOM.cancelButton
    ?.addEventListener(
      "click",
      (event) => {
        event.preventDefault();
        handleCancelReportAction();
      }
    );

  document.addEventListener(
    "keydown",
    (event) => {
      if (
        event.key === "Escape" &&
        document
          .getElementById(
            "scoutReportSuccessModal"
          )
          ?.classList.contains(
            "is-visible"
          )
      ) {
        closeReportSuccessModal();
      }
    }
  );
}


/* =========================================================
   END OF SCOUT-REPORT-CREATE.JS — PART 2E
   CONTINUE DIRECTLY WITH PART 2F
========================================================= */

/* =========================================================
   SCOUT-REPORT-CREATE.JS
   PART 2F
   MULTI-STEP NAVIGATION, PROGRESS AND REVIEW PREVIEW
   CONTINUES DIRECTLY FROM PART 2E
========================================================= */


/* =========================================================
   STEP COLLECTION
========================================================= */

function collectReportStepElements() {
  ScoutReportCreateDOM.stepPanels = Array.from(
    document.querySelectorAll(
      "[data-report-step], .scout-report-step-panel"
    )
  );

  ScoutReportCreateDOM.stepIndicators = Array.from(
    document.querySelectorAll(
      "[data-step-indicator], .scout-step-indicator"
    )
  );

  ScoutReportCreateDOM.nextStepButtons = Array.from(
    document.querySelectorAll(
      "[data-next-step]"
    )
  );

  ScoutReportCreateDOM.previousStepButtons = Array.from(
    document.querySelectorAll(
      "[data-previous-step]"
    )
  );

  ScoutReportCreateDOM.stepNavigationButtons =
    Array.from(
      document.querySelectorAll(
        "[data-go-to-step]"
      )
    );

  ScoutReportCreateDOM.progressBar =
    document.querySelector(
      "[data-report-progress-bar]"
    );

  ScoutReportCreateDOM.progressText =
    document.querySelector(
      "[data-report-progress-text]"
    );

  ScoutReportCreateDOM.currentStepText =
    document.querySelector(
      "[data-current-step]"
    );

  ScoutReportCreateDOM.totalStepsText =
    document.querySelector(
      "[data-total-steps]"
    );

  ScoutReportCreateState.totalSteps =
    Math.max(
      ScoutReportCreateDOM.stepPanels.length,
      1
    );
}


/* =========================================================
   STEP VALUE NORMALIZATION
========================================================= */

function normalizeReportStepNumber(stepNumber) {
  const numericStep =
    Number(stepNumber);

  if (!Number.isFinite(numericStep)) {
    return 1;
  }

  return clampNumber(
    Math.round(numericStep),
    1,
    ScoutReportCreateState.totalSteps
  );
}


/* =========================================================
   STEP PROGRESS CALCULATION
========================================================= */

function calculateReportProgress(stepNumber) {
  const totalSteps =
    ScoutReportCreateState.totalSteps;

  if (totalSteps <= 1) {
    return 100;
  }

  return Math.round(
    ((stepNumber - 1) /
      (totalSteps - 1)) *
      100
  );
}


/* =========================================================
   UPDATE STEP PROGRESS UI
========================================================= */

function updateReportStepProgress(stepNumber) {
  const normalizedStep =
    normalizeReportStepNumber(
      stepNumber
    );

  const progress =
    calculateReportProgress(
      normalizedStep
    );

  if (
    ScoutReportCreateDOM.progressBar
  ) {
    ScoutReportCreateDOM.progressBar.style.width =
      `${progress}%`;

    ScoutReportCreateDOM.progressBar.setAttribute(
      "aria-valuemin",
      "0"
    );

    ScoutReportCreateDOM.progressBar.setAttribute(
      "aria-valuemax",
      "100"
    );

    ScoutReportCreateDOM.progressBar.setAttribute(
      "aria-valuenow",
      String(progress)
    );
  }

  if (
    ScoutReportCreateDOM.progressText
  ) {
    ScoutReportCreateDOM.progressText.textContent =
      `${progress}% complete`;
  }

  if (
    ScoutReportCreateDOM.currentStepText
  ) {
    ScoutReportCreateDOM.currentStepText.textContent =
      String(normalizedStep);
  }

  if (
    ScoutReportCreateDOM.totalStepsText
  ) {
    ScoutReportCreateDOM.totalStepsText.textContent =
      String(
        ScoutReportCreateState.totalSteps
      );
  }
}


/* =========================================================
   UPDATE STEP INDICATORS
========================================================= */

function updateReportStepIndicators(
  activeStep
) {
  ScoutReportCreateDOM.stepIndicators.forEach(
    (indicator, index) => {
      const indicatorStep =
        Number(
          indicator.dataset.stepIndicator ||
          indicator.dataset.step ||
          indicator.dataset.goToStep ||
          index + 1
        );

      const isCurrent =
        indicatorStep === activeStep;

      const isCompleted =
        indicatorStep < activeStep;

      const isUpcoming =
        indicatorStep > activeStep;

      indicator.classList.toggle(
        "is-active",
        isCurrent
      );

      indicator.classList.toggle(
        "is-complete",
        isCompleted
      );

      indicator.classList.toggle(
        "is-upcoming",
        isUpcoming
      );

      indicator.setAttribute(
        "aria-current",
        isCurrent ? "step" : "false"
      );

      if (
        indicator.matches(
          "button, [role='button']"
        )
      ) {
        indicator.setAttribute(
          "aria-label",
          isCompleted
            ? `Step ${indicatorStep}, completed`
            : isCurrent
              ? `Step ${indicatorStep}, current step`
              : `Step ${indicatorStep}`
        );
      }
    }
  );
}


/* =========================================================
   UPDATE STEP PANEL VISIBILITY
========================================================= */

function updateReportStepPanels(
  activeStep
) {
  ScoutReportCreateDOM.stepPanels.forEach(
    (panel, index) => {
      const panelStep =
        getStepNumberFromPanel(panel) ||
        index + 1;

      const isActive =
        panelStep === activeStep;

      panel.hidden = !isActive;

      panel.classList.toggle(
        "is-active",
        isActive
      );

      panel.classList.toggle(
        "is-complete",
        panelStep < activeStep
      );

      panel.setAttribute(
        "aria-hidden",
        isActive ? "false" : "true"
      );

      if (isActive) {
        panel.removeAttribute("inert");
      } else {
        panel.setAttribute("inert", "");
      }
    }
  );
}


/* =========================================================
   UPDATE NAVIGATION BUTTON STATE
========================================================= */

function updateStepNavigationButtons(
  activeStep
) {
  const isFirstStep =
    activeStep <= 1;

  const isFinalStep =
    activeStep >=
    ScoutReportCreateState.totalSteps;

  ScoutReportCreateDOM.previousStepButtons.forEach(
    (button) => {
      button.disabled = isFirstStep;

      button.classList.toggle(
        "is-disabled",
        isFirstStep
      );

      button.setAttribute(
        "aria-disabled",
        isFirstStep ? "true" : "false"
      );
    }
  );

  ScoutReportCreateDOM.nextStepButtons.forEach(
    (button) => {
      const buttonStep =
        Number(
          button.dataset.nextStep
        );

      const shouldHide =
        isFinalStep &&
        (
          !Number.isFinite(buttonStep) ||
          buttonStep >
            ScoutReportCreateState.totalSteps
        );

      button.hidden = shouldHide;
    }
  );

  if (
    ScoutReportCreateDOM.submitButton
  ) {
    const submitOnlyOnFinalStep =
      ScoutReportCreateDOM.submitButton
        .dataset.finalStepOnly !== "false";

    if (submitOnlyOnFinalStep) {
      ScoutReportCreateDOM.submitButton.hidden =
        !isFinalStep;
    }
  }
}


/* =========================================================
   STEP HEADING FOCUS
========================================================= */

function focusActiveStepHeading(panel) {
  if (!panel) {
    return;
  }

  const heading =
    panel.querySelector(
      "[data-step-heading], h1, h2, h3"
    );

  if (!heading) {
    return;
  }

  if (
    !heading.hasAttribute("tabindex")
  ) {
    heading.tabIndex = -1;
  }

  window.setTimeout(() => {
    heading.focus({
      preventScroll: true
    });
  }, 200);
}


/* =========================================================
   STEP HISTORY
========================================================= */

function updateReportStepHistory(
  stepNumber
) {
  if (
    !window.history?.replaceState
  ) {
    return;
  }

  const url =
    new URL(window.location.href);

  url.searchParams.set(
    "step",
    String(stepNumber)
  );

  window.history.replaceState(
    {
      reportStep: stepNumber
    },
    "",
    url
  );
}


/* =========================================================
   SHOW REPORT STEP
========================================================= */

function showReportStep(
  stepNumber,
  options = {}
) {
  const {
    validateCurrentStep = false,
    updateHistory = true,
    scrollToTop = true,
    focusHeading = false
  } = options;

  const targetStep =
    normalizeReportStepNumber(
      stepNumber
    );

  const currentStep =
    ScoutReportCreateState.currentStep;

  if (
    validateCurrentStep &&
    targetStep > currentStep
  ) {
    const validation =
      validateReportStep(
        currentStep,
        {
          showSummary: true,
          focusFirstError: true
        }
      );

    if (!validation.valid) {
      showScoutNotification(
        "Complete the required fields before continuing.",
        "warning",
        {
          title: "Step incomplete"
        }
      );

      return false;
    }
  }

  ScoutReportCreateState.currentStep =
    targetStep;

  updateReportStepPanels(
    targetStep
  );

  updateReportStepIndicators(
    targetStep
  );

  updateReportStepProgress(
    targetStep
  );

  updateStepNavigationButtons(
    targetStep
  );

  if (
    targetStep ===
    ScoutReportCreateState.totalSteps
  ) {
    updateReportReviewPreview();
  }

  if (updateHistory) {
    updateReportStepHistory(
      targetStep
    );
  }

  const activePanel =
    ScoutReportCreateDOM.stepPanels[
      targetStep - 1
    ];

  if (
    scrollToTop &&
    activePanel
  ) {
    activePanel.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  }

  if (
    focusHeading &&
    activePanel
  ) {
    focusActiveStepHeading(
      activePanel
    );
  }

  document.dispatchEvent(
    new CustomEvent(
      "fmi:scout-report-step-change",
      {
        detail: {
          currentStep: targetStep,
          previousStep: currentStep,
          totalSteps:
            ScoutReportCreateState.totalSteps
        }
      }
    )
  );

  return true;
}


/* =========================================================
   NEXT AND PREVIOUS STEP
========================================================= */

function moveToNextReportStep() {
  const nextStep =
    ScoutReportCreateState.currentStep + 1;

  return showReportStep(nextStep, {
    validateCurrentStep: true,
    updateHistory: true,
    scrollToTop: true,
    focusHeading: true
  });
}


function moveToPreviousReportStep() {
  const previousStep =
    ScoutReportCreateState.currentStep - 1;

  return showReportStep(
    previousStep,
    {
      validateCurrentStep: false,
      updateHistory: true,
      scrollToTop: true,
      focusHeading: true
    }
  );
}


/* =========================================================
   DIRECT STEP NAVIGATION
========================================================= */

function handleDirectStepNavigation(
  targetStep
) {
  const normalizedTarget =
    normalizeReportStepNumber(
      targetStep
    );

  const currentStep =
    ScoutReportCreateState.currentStep;

  if (
    normalizedTarget > currentStep
  ) {
    for (
      let step = currentStep;
      step < normalizedTarget;
      step += 1
    ) {
      const validation =
        validateReportStep(
          step,
          {
            showSummary: true,
            focusFirstError: true
          }
        );

      if (!validation.valid) {
        showReportStep(step, {
          validateCurrentStep: false
        });

        showScoutNotification(
          `Complete step ${step} before continuing.`,
          "warning"
        );

        return;
      }
    }
  }

  showReportStep(
    normalizedTarget,
    {
      validateCurrentStep: false,
      updateHistory: true,
      scrollToTop: true,
      focusHeading: true
    }
  );
}


/* =========================================================
   REVIEW PREVIEW HELPERS
========================================================= */

function setReviewText(
  selector,
  value,
  fallback = "Not provided"
) {
  const element =
    document.querySelector(selector);

  if (!element) {
    return;
  }

  const resolvedValue =
    normalizeText(value);

  element.textContent =
    resolvedValue || fallback;

  element.classList.toggle(
    "is-empty",
    !resolvedValue
  );
}


function setReviewRating(
  selector,
  value
) {
  const element =
    document.querySelector(selector);

  if (!element) {
    return;
  }

  const numericValue =
    Number(value);

  if (!Number.isFinite(numericValue)) {
    element.textContent =
      "Not rated";

    element.classList.add(
      "is-empty"
    );

    return;
  }

  element.textContent =
    `${numericValue}/10`;

  element.classList.remove(
    "is-empty"
  );
}


function getReadableSelectValue(select) {
  if (!select) {
    return "";
  }

  if (
    select instanceof HTMLSelectElement
  ) {
    return normalizeText(
      select.selectedOptions[0]?.textContent ||
      select.value
    );
  }

  return getTrimmedFormControlValue(
    select
  );
}


/* =========================================================
   REVIEW PLAYER SECTION
========================================================= */

function updatePlayerReviewPreview() {
  setReviewText(
    "[data-review-player-name]",
    ScoutReportCreateDOM.playerNameInput
      ?.value
  );

  setReviewText(
    "[data-review-player-age]",
    ScoutReportCreateDOM.playerAgeInput
      ?.value
      ? `${ScoutReportCreateDOM.playerAgeInput.value} years`
      : ""
  );

  setReviewText(
    "[data-review-player-position]",
    getReadableSelectValue(
      ScoutReportCreateDOM.playerPositionInput
    )
  );

  setReviewText(
    "[data-review-preferred-foot]",
    getReadableSelectValue(
      ScoutReportCreateDOM.preferredFootInput
    )
  );

  setReviewText(
    "[data-review-player-academy]",
    ScoutReportCreateDOM.playerAcademyInput
      ?.value
  );

  setReviewText(
    "[data-review-player-location]",
    ScoutReportCreateDOM.playerLocationInput
      ?.value
  );

  setReviewText(
    "[data-review-jersey-number]",
    ScoutReportCreateDOM.jerseyNumberInput
      ?.value
  );
}


/* =========================================================
   REVIEW OBSERVATION SECTION
========================================================= */

function updateObservationReviewPreview() {
  setReviewText(
    "[data-review-report-title]",
    ScoutReportCreateDOM.reportTitleInput
      ?.value
  );

  setReviewText(
    "[data-review-report-date]",
    ScoutReportCreateDOM.reportDateInput
      ?.value
  );

  setReviewText(
    "[data-review-match-date]",
    ScoutReportCreateDOM.matchDateInput
      ?.value
  );

  setReviewText(
    "[data-review-competition]",
    ScoutReportCreateDOM.competitionInput
      ?.value
  );

  setReviewText(
    "[data-review-venue]",
    ScoutReportCreateDOM.venueInput
      ?.value
  );
}


/* =========================================================
   REVIEW ASSESSMENT SECTION
========================================================= */

function updateAssessmentReviewPreview() {
  setReviewText(
    "[data-review-summary]",
    ScoutReportCreateDOM.summaryInput
      ?.value
  );

  setReviewText(
    "[data-review-strengths]",
    ScoutReportCreateDOM.strengthsInput
      ?.value
  );

  setReviewText(
    "[data-review-weaknesses]",
    ScoutReportCreateDOM.weaknessesInput
      ?.value
  );

  setReviewText(
    "[data-review-recommendation]",
    ScoutReportCreateDOM.recommendationInput
      ?.value
  );

  setReviewText(
    "[data-review-recommendation-status]",
    getReadableSelectValue(
      ScoutReportCreateDOM
        .recommendationStatusInput
    )
  );

  setReviewText(
    "[data-review-priority]",
    getReadableSelectValue(
      ScoutReportCreateDOM.priorityInput
    )
  );

  setReviewText(
    "[data-review-visibility]",
    getReadableSelectValue(
      ScoutReportCreateDOM.visibilityInput
    )
  );

  setReviewRating(
    "[data-review-overall-rating]",
    ScoutReportCreateDOM
      .overallRatingInput?.value
  );

  setReviewRating(
    "[data-review-potential-rating]",
    ScoutReportCreateDOM
      .potentialRatingInput?.value
  );
}


/* =========================================================
   REVIEW MEDIA SECTION
========================================================= */

function updateMediaReviewPreview() {
  const mediaReviewContainer =
    document.querySelector(
      "[data-review-media-list]"
    );

  const mediaCountElement =
    document.querySelector(
      "[data-review-media-count]"
    );

  const mediaItems =
    ScoutReportCreateState.uploadedFiles;

  if (mediaCountElement) {
    mediaCountElement.textContent =
      `${mediaItems.length} ${
        mediaItems.length === 1
          ? "file"
          : "files"
      }`;
  }

  if (!mediaReviewContainer) {
    return;
  }

  if (!mediaItems.length) {
    mediaReviewContainer.innerHTML = `
      <p class="scout-review-empty">
        No media files attached.
      </p>
    `;

    return;
  }

  mediaReviewContainer.innerHTML =
    mediaItems
      .map((mediaItem) => {
        const previewSource =
          mediaItem.serverUrl ||
          mediaItem.previewUrl ||
          "";

        const visualMarkup =
          mediaItem.category === "image" &&
          previewSource
            ? `
              <img
                src="${escapeHTML(previewSource)}"
                alt=""
                loading="lazy"
              />
            `
            : `
              <span aria-hidden="true">
                ${
                  mediaItem.category ===
                  "video"
                    ? "VIDEO"
                    : "FILE"
                }
              </span>
            `;

        return `
          <article class="scout-review-media-item">
            <div class="scout-review-media-visual">
              ${visualMarkup}
            </div>

            <div class="scout-review-media-details">
              <strong>
                ${escapeHTML(mediaItem.name)}
              </strong>

              <span>
                ${escapeHTML(
                  formatFileSize(
                    mediaItem.size
                  )
                )}
              </span>
            </div>
          </article>
        `;
      })
      .join("");
}


/* =========================================================
   COMPLETE REVIEW PREVIEW
========================================================= */

function updateReportReviewPreview() {
  updatePlayerReviewPreview();
  updateObservationReviewPreview();
  updateAssessmentReviewPreview();
  updateMediaReviewPreview();

  document.dispatchEvent(
    new CustomEvent(
      "fmi:scout-report-review-updated",
      {
        detail: {
          currentStep:
            ScoutReportCreateState.currentStep
        }
      }
    )
  );
}


/* =========================================================
   EDIT SECTION BUTTONS
========================================================= */

function initializeReviewEditButtons() {
  document
    .querySelectorAll(
      "[data-edit-report-step]"
    )
    .forEach((button) => {
      button.addEventListener(
        "click",
        () => {
          const targetStep =
            Number(
              button.dataset.editReportStep
            );

          if (!targetStep) {
            return;
          }

          showReportStep(
            targetStep,
            {
              validateCurrentStep: false,
              updateHistory: true,
              scrollToTop: true,
              focusHeading: true
            }
          );
        }
      );
    });
}


/* =========================================================
   URL STEP RESTORATION
========================================================= */

function getInitialStepFromURL() {
  try {
    const url =
      new URL(window.location.href);

    const step =
      Number(
        url.searchParams.get("step")
      );

    if (!Number.isFinite(step)) {
      return 1;
    }

    return normalizeReportStepNumber(
      step
    );
  } catch (error) {
    return 1;
  }
}


/* =========================================================
   BROWSER HISTORY STEP HANDLING
========================================================= */

function handleReportStepPopState(event) {
  const stateStep =
    Number(
      event.state?.reportStep
    );

  const urlStep =
    getInitialStepFromURL();

  showReportStep(
    stateStep || urlStep,
    {
      validateCurrentStep: false,
      updateHistory: false,
      scrollToTop: true,
      focusHeading: false
    }
  );
}


/* =========================================================
   STEP KEYBOARD SHORTCUTS
========================================================= */

function handleReportStepKeyboardShortcuts(
  event
) {
  if (
    event.defaultPrevented ||
    event.altKey ||
    event.ctrlKey ||
    event.metaKey
  ) {
    return;
  }

  const activeElement =
    document.activeElement;

  const isTyping =
    activeElement?.matches(
      "input, textarea, select, [contenteditable='true']"
    );

  if (isTyping) {
    return;
  }

  if (
    event.key === "ArrowRight"
  ) {
    moveToNextReportStep();
  }

  if (
    event.key === "ArrowLeft"
  ) {
    moveToPreviousReportStep();
  }
}


/* =========================================================
   STEP NAVIGATION INITIALIZATION
========================================================= */

function initializeReportStepNavigation() {
  collectReportStepElements();

  if (
    !ScoutReportCreateDOM.stepPanels.length
  ) {
    return;
  }

  ScoutReportCreateDOM.nextStepButtons.forEach(
    (button) => {
      button.addEventListener(
        "click",
        (event) => {
          event.preventDefault();

          const explicitTarget =
            Number(
              button.dataset.nextStep
            );

          if (
            Number.isFinite(explicitTarget) &&
            explicitTarget > 0
          ) {
            showReportStep(
              explicitTarget,
              {
                validateCurrentStep: true,
                updateHistory: true,
                scrollToTop: true,
                focusHeading: true
              }
            );

            return;
          }

          moveToNextReportStep();
        }
      );
    }
  );

  ScoutReportCreateDOM.previousStepButtons.forEach(
    (button) => {
      button.addEventListener(
        "click",
        (event) => {
          event.preventDefault();

          const explicitTarget =
            Number(
              button.dataset.previousStep
            );

          if (
            Number.isFinite(explicitTarget) &&
            explicitTarget > 0
          ) {
            showReportStep(
              explicitTarget,
              {
                validateCurrentStep: false,
                updateHistory: true,
                scrollToTop: true,
                focusHeading: true
              }
            );

            return;
          }

          moveToPreviousReportStep();
        }
      );
    }
  );

  ScoutReportCreateDOM.stepNavigationButtons.forEach(
    (button) => {
      button.addEventListener(
        "click",
        () => {
          handleDirectStepNavigation(
            button.dataset.goToStep
          );
        }
      );
    }
  );

  ScoutReportCreateDOM.stepIndicators.forEach(
    (indicator) => {
      if (
        !indicator.dataset.goToStep
      ) {
        return;
      }

      indicator.addEventListener(
        "click",
        () => {
          handleDirectStepNavigation(
            indicator.dataset.goToStep
          );
        }
      );
    }
  );

  initializeReviewEditButtons();

  window.addEventListener(
    "popstate",
    handleReportStepPopState
  );

  document.addEventListener(
    "keydown",
    handleReportStepKeyboardShortcuts
  );

  const initialStep =
    getInitialStepFromURL();

  showReportStep(initialStep, {
    validateCurrentStep: false,
    updateHistory: false,
    scrollToTop: false,
    focusHeading: false
  });
}


/* =========================================================
   LIVE REVIEW REFRESH
========================================================= */

function initializeLiveReviewRefresh() {
  if (!ScoutReportCreateDOM.form) {
    return;
  }

  const refreshReview =
    debounce(
      updateReportReviewPreview,
      180
    );

  ScoutReportCreateDOM.form.addEventListener(
    "input",
    () => {
      if (
        ScoutReportCreateState.currentStep ===
        ScoutReportCreateState.totalSteps
      ) {
        refreshReview();
      }
    }
  );

  ScoutReportCreateDOM.form.addEventListener(
    "change",
    () => {
      if (
        ScoutReportCreateState.currentStep ===
        ScoutReportCreateState.totalSteps
      ) {
        refreshReview();
      }
    }
  );

  document.addEventListener(
    "fmi:scout-report-media-change",
    refreshReview
  );
}


/* =========================================================
   END OF SCOUT-REPORT-CREATE.JS — PART 2F
   CONTINUE DIRECTLY WITH PART 2G
========================================================= */

/* =========================================================
   SCOUT-REPORT-CREATE.JS
   PART 2G
   PROFILE LOADING, GLOBAL EVENTS AND APPLICATION BOOTSTRAP
   CONTINUES DIRECTLY FROM PART 2F
========================================================= */


/* =========================================================
   SCOUT PROFILE NORMALIZATION
========================================================= */

function normalizeScoutProfile(profileData = {}) {
  const user =
    profileData.user ||
    profileData.account ||
    {};

  const profile =
    profileData.profile ||
    profileData.scout ||
    profileData;

  return {
    id:
      profile.id ||
      profile.scoutId ||
      profile.scout_id ||
      user.id ||
      "",

    name:
      profile.fullName ||
      profile.full_name ||
      profile.name ||
      user.fullName ||
      user.full_name ||
      user.name ||
      "Scout",

    email:
      profile.email ||
      user.email ||
      "",

    organization:
      profile.organization ||
      profile.club ||
      profile.academy ||
      profile.company ||
      "",

    designation:
      profile.designation ||
      profile.role ||
      profile.position ||
      "Scout",

    profileImage:
      profile.profileImage ||
      profile.profile_image ||
      profile.avatar ||
      user.profileImage ||
      user.profile_image ||
      user.avatar ||
      "",

    location:
      profile.location ||
      [
        profile.city,
        profile.state,
        profile.country
      ]
        .filter(Boolean)
        .join(", "),

    raw: profileData
  };
}


/* =========================================================
   SCOUT PROFILE UI
========================================================= */

function updateScoutProfileUI(profile) {
  if (!profile) {
    return;
  }

  document
    .querySelectorAll(
      "[data-scout-name]"
    )
    .forEach((element) => {
      element.textContent =
        profile.name || "Scout";
    });

  document
    .querySelectorAll(
      "[data-scout-email]"
    )
    .forEach((element) => {
      element.textContent =
        profile.email || "";
    });

  document
    .querySelectorAll(
      "[data-scout-designation]"
    )
    .forEach((element) => {
      element.textContent =
        profile.designation || "Scout";
    });

  document
    .querySelectorAll(
      "[data-scout-organization]"
    )
    .forEach((element) => {
      element.textContent =
        profile.organization ||
        "Independent Scout";
    });

  document
    .querySelectorAll(
      "[data-scout-location]"
    )
    .forEach((element) => {
      element.textContent =
        profile.location || "";
    });

  document
    .querySelectorAll(
      "img[data-scout-avatar]"
    )
    .forEach((image) => {
      if (profile.profileImage) {
        image.src = profile.profileImage;
        image.alt =
          `${profile.name} profile image`;
      }
    });

  document
    .querySelectorAll(
      "[data-scout-initials]"
    )
    .forEach((element) => {
      element.textContent =
        getPlayerInitials(profile.name);
    });
}


/* =========================================================
   LOAD SCOUT PROFILE
   BACKEND PLACEHOLDER FOR MR. HARSH
========================================================= */

async function loadScoutProfile() {
  try {
    const responseData =
      await scoutApiRequest(
        ScoutReportCreateConfig.api.profile,
        {
          method: "GET"
        }
      );

    const normalizedProfile =
      normalizeScoutProfile(
        responseData
      );

    ScoutReportCreateState.scoutProfile =
      normalizedProfile;

    updateScoutProfileUI(
      normalizedProfile
    );

    return normalizedProfile;
  } catch (error) {
    console.warn(
      "Scout profile could not be loaded.",
      error
    );

    const fallbackProfile =
      normalizeScoutProfile({
        name: "Scout"
      });

    ScoutReportCreateState.scoutProfile =
      fallbackProfile;

    updateScoutProfileUI(
      fallbackProfile
    );

    return fallbackProfile;
  }
}


/* =========================================================
   REPORT FORM CHANGE EVENTS
========================================================= */

function dispatchReportChangeEvent(
  changeType,
  detail = {}
) {
  document.dispatchEvent(
    new CustomEvent(
      "fmi:scout-report-change",
      {
        detail: {
          changeType,
          currentStep:
            ScoutReportCreateState.currentStep,
          hasUnsavedChanges:
            ScoutReportCreateState
              .hasUnsavedChanges,
          ...detail
        }
      }
    )
  );
}


function initializeGlobalReportChangeEvents() {
  ScoutReportCreateDOM.form?.addEventListener(
    "input",
    (event) => {
      dispatchReportChangeEvent(
        "input",
        {
          fieldName:
            event.target?.name ||
            event.target?.id ||
            ""
        }
      );
    }
  );

  ScoutReportCreateDOM.form?.addEventListener(
    "change",
    (event) => {
      dispatchReportChangeEvent(
        "change",
        {
          fieldName:
            event.target?.name ||
            event.target?.id ||
            ""
        }
      );
    }
  );

  document.addEventListener(
    "fmi:scout-report-submitted",
    () => {
      dispatchReportChangeEvent(
        "submitted"
      );
    }
  );
}


/* =========================================================
   MEDIA CHANGE EVENT SUPPORT
========================================================= */

function dispatchMediaChangeEvent(
  action,
  mediaItem = null
) {
  document.dispatchEvent(
    new CustomEvent(
      "fmi:scout-report-media-change",
      {
        detail: {
          action,
          mediaItem,
          totalMedia:
            ScoutReportCreateState
              .uploadedFiles.length
        }
      }
    )
  );
}


/* =========================================================
   PATCH MEDIA CHANGE EVENTS
========================================================= */

const originalAddMediaFiles =
  addMediaFiles;

addMediaFiles = function patchedAddMediaFiles(
  files
) {
  const previousCount =
    ScoutReportCreateState
      .uploadedFiles.length;

  originalAddMediaFiles(files);

  const addedCount =
    ScoutReportCreateState
      .uploadedFiles.length -
    previousCount;

  if (addedCount > 0) {
    dispatchMediaChangeEvent(
      "added",
      {
        addedCount
      }
    );
  }
};


const originalRemoveMediaFile =
  removeMediaFile;

removeMediaFile =
  function patchedRemoveMediaFile(
    mediaId,
    options = {}
  ) {
    const mediaItem =
      ScoutReportCreateState
        .uploadedFiles.find(
          (item) => item.id === mediaId
        );

    originalRemoveMediaFile(
      mediaId,
      options
    );

    if (mediaItem) {
      dispatchMediaChangeEvent(
        "removed",
        mediaItem
      );
    }
  };


const originalClearAllMediaFiles =
  clearAllMediaFiles;

clearAllMediaFiles =
  function patchedClearAllMediaFiles(
    options = {}
  ) {
    const previousCount =
      ScoutReportCreateState
        .uploadedFiles.length;

    originalClearAllMediaFiles(
      options
    );

    if (previousCount > 0) {
      dispatchMediaChangeEvent(
        "cleared",
        {
          removedCount:
            previousCount
        }
      );
    }
  };


/* =========================================================
   FORM DATA NORMALIZATION
========================================================= */

function normalizeNumericInputs() {
  ScoutReportCreateDOM.form
    ?.querySelectorAll(
      'input[type="number"]'
    )
    .forEach((input) => {
      input.addEventListener(
        "input",
        () => {
          if (input.value === "") {
            return;
          }

          const numericValue =
            Number(input.value);

          if (
            Number.isFinite(
              Number(input.min)
            ) &&
            numericValue <
              Number(input.min)
          ) {
            input.value = input.min;
          }

          if (
            Number.isFinite(
              Number(input.max)
            ) &&
            numericValue >
              Number(input.max)
          ) {
            input.value = input.max;
          }
        }
      );
    });
}


function normalizeTextInputsOnBlur() {
  ScoutReportCreateDOM.form
    ?.querySelectorAll(
      'input[type="text"], textarea'
    )
    .forEach((field) => {
      field.addEventListener(
        "blur",
        () => {
          const normalizedValue =
            normalizeText(field.value);

          if (
            field.value !==
            normalizedValue
          ) {
            field.value =
              normalizedValue;

            field.dispatchEvent(
              new Event(
                "input",
                {
                  bubbles: true
                }
              )
            );
          }
        }
      );
    });
}


/* =========================================================
   DATE INPUT LIMITS
========================================================= */

function configureDateInputLimits() {
  const today =
    formatDateForInput(
      new Date()
    );

  [
    ScoutReportCreateDOM.reportDateInput,
    ScoutReportCreateDOM.matchDateInput,
    ScoutReportCreateDOM.playerDobInput
  ]
    .filter(Boolean)
    .forEach((input) => {
      if (!input.max) {
        input.max = today;
      }
    });

  ScoutReportCreateDOM.matchDateInput
    ?.addEventListener(
      "change",
      () => {
        if (
          ScoutReportCreateDOM
            .reportDateInput
        ) {
          ScoutReportCreateDOM
            .reportDateInput.min =
            ScoutReportCreateDOM
              .matchDateInput.value ||
            "";
        }
      }
    );
}


/* =========================================================
   MOBILE VIEWPORT SUPPORT
========================================================= */

function updateViewportHeightVariable() {
  const viewportHeight =
    window.innerHeight * 0.01;

  document.documentElement.style.setProperty(
    "--scout-viewport-height",
    `${viewportHeight}px`
  );
}


function initializeViewportSupport() {
  updateViewportHeightVariable();

  const updateViewport =
    debounce(
      updateViewportHeightVariable,
      100
    );

  window.addEventListener(
    "resize",
    updateViewport
  );

  window.addEventListener(
    "orientationchange",
    updateViewport
  );
}


/* =========================================================
   KEYBOARD FOCUS MODE
========================================================= */

function initializeKeyboardFocusMode() {
  document.addEventListener(
    "keydown",
    (event) => {
      if (event.key === "Tab") {
        document.body.classList.add(
          "using-keyboard"
        );
      }
    }
  );

  document.addEventListener(
    "mousedown",
    () => {
      document.body.classList.remove(
        "using-keyboard"
      );
    }
  );

  document.addEventListener(
    "touchstart",
    () => {
      document.body.classList.remove(
        "using-keyboard"
      );
    },
    {
      passive: true
    }
  );
}


/* =========================================================
   GLOBAL ESCAPE KEY HANDLER
========================================================= */

function handleGlobalEscapeKey(event) {
  if (event.key !== "Escape") {
    return;
  }

  const successModal =
    document.getElementById(
      "scoutReportSuccessModal"
    );

  if (
    successModal?.classList.contains(
      "is-visible"
    )
  ) {
    closeReportSuccessModal();
    return;
  }

  const searchResultsVisible =
    ScoutReportCreateDOM
      .playerSearchResults
      ?.classList.contains(
        "is-visible"
      );

  if (searchResultsVisible) {
    closePlayerSearchResults();

    ScoutReportCreateDOM
      .playerSearchInput
      ?.focus();

    return;
  }

  const sidebarOpen =
    document.body.classList.contains(
      "scout-sidebar-open"
    );

  if (sidebarOpen) {
    closeScoutSidebar();
  }
}


/* =========================================================
   APPLICATION CLEANUP
========================================================= */

function cleanupScoutReportCreate() {
  window.clearTimeout(
    ScoutReportCreateState
      .autosaveTimer
  );

  window.clearTimeout(
    ScoutReportCreateState
      .playerSearchTimer
  );

  Object.values(
    ScoutReportCreateState
      .abortControllers
  ).forEach((controller) => {
    controller?.abort?.();
  });

  cleanupMediaResources();

  document.body.classList.remove(
    "scout-modal-open",
    "scout-sidebar-open"
  );
}


/* =========================================================
   APPLICATION READINESS CHECK
========================================================= */

function validateApplicationRequirements() {
  const missingRequirements = [];

  if (!ScoutReportCreateDOM.form) {
    missingRequirements.push(
      "Scout report form"
    );
  }

  if (
    !ScoutReportCreateDOM.stepPanels
      ?.length
  ) {
    console.warn(
      "No report step panels were found. The form will operate without multi-step navigation."
    );
  }

  if (missingRequirements.length) {
    console.error(
      "Scout report creation page could not initialize:",
      missingRequirements
    );

    return false;
  }

  return true;
}


/* =========================================================
   INITIAL STATE PREPARATION
========================================================= */

function prepareScoutReportInitialState() {
  ScoutReportCreateState.currentStep =
    1;

  ScoutReportCreateState.totalSteps =
    1;

  ScoutReportCreateState.hasUnsavedChanges =
    false;

  ScoutReportCreateState.isSubmitting =
    false;

  ScoutReportCreateState.isSavingDraft =
    false;

  ScoutReportCreateState.selectedPlayer =
    null;

  ScoutReportCreateState.searchResults =
    [];

  ScoutReportCreateState.activeSearchIndex =
    -1;

  ScoutReportCreateState.uploadedFiles =
    [];

  ScoutReportCreateState.uploadedMediaIds =
    [];

  ScoutReportCreateState.lastSavedAt =
    null;
}


/* =========================================================
   MAIN APPLICATION INITIALIZATION
========================================================= */

async function initializeScoutReportCreate() {
  if (
    ScoutReportCreateState.initialized
  ) {
    return;
  }

  prepareScoutReportInitialState();
  cacheScoutReportCreateDOM();

  if (
    !validateApplicationRequirements()
  ) {
    showScoutNotification(
      "The scouting report form could not be initialized.",
      "error",
      {
        title:
          "Page initialization failed",
        persistent: true
      }
    );

    return;
  }

  ScoutReportCreateState.initialized =
    true;

  initializeViewportSupport();
  initializeKeyboardFocusMode();
  initializeResponsiveSidebar();

  applyInitialFormDefaults();
  configureDateInputLimits();
  normalizeNumericInputs();
  normalizeTextInputsOnBlur();

  initializeRatingControls();
  initializePlayerSearch();
  initializeMediaUpload();
  initializeReportValidation();
  initializeReportStepNavigation();
  initializeLiveReviewRefresh();
  initializeDraftManagement();
  initializeReportSubmission();
  initializeGlobalReportChangeEvents();

  document.addEventListener(
    "keydown",
    handleGlobalEscapeKey
  );

  window.addEventListener(
    "pagehide",
    cleanupScoutReportCreate
  );

  window.addEventListener(
    "resize",
    debounce(
      handleResponsiveSidebarState,
      120
    )
  );

  await loadScoutProfile();

  updateReportReviewPreview();
  updateUnsavedChangesUI();

  if (
    !getLocalDraft()
  ) {
    ScoutReportCreateState
      .initialFormSnapshot =
      createStableFormSnapshot();
  }

  document.body.classList.add(
    "scout-report-create-ready"
  );

  document.dispatchEvent(
    new CustomEvent(
      "fmi:scout-report-create-ready",
      {
        detail: {
          initialized: true,
          totalSteps:
            ScoutReportCreateState
              .totalSteps
        }
      }
    )
  );
}


/* =========================================================
   DOM READY BOOTSTRAP
========================================================= */

if (
  document.readyState === "loading"
) {
  document.addEventListener(
    "DOMContentLoaded",
    initializeScoutReportCreate,
    {
      once: true
    }
  );
} else {
  initializeScoutReportCreate();
}


/* =========================================================
   OPTIONAL GLOBAL API
========================================================= */

window.FMIScoutReportCreate =
  Object.freeze({
    initialize:
      initializeScoutReportCreate,

    saveDraft:
      saveScoutReportDraft,

    submit:
      handleScoutReportSubmission,

    validate:
      validateEntireScoutReport,

    reset:
      resetScoutReportForm,

    discardDraft:
      discardScoutReportDraft,

    showStep:
      showReportStep,

    getState() {
      return {
        initialized:
          ScoutReportCreateState
            .initialized,

        currentStep:
          ScoutReportCreateState
            .currentStep,

        totalSteps:
          ScoutReportCreateState
            .totalSteps,

        hasUnsavedChanges:
          ScoutReportCreateState
            .hasUnsavedChanges,

        isSubmitting:
          ScoutReportCreateState
            .isSubmitting,

        isSavingDraft:
          ScoutReportCreateState
            .isSavingDraft,

        selectedPlayer:
          ScoutReportCreateState
            .selectedPlayer,

        uploadedMediaCount:
          ScoutReportCreateState
            .uploadedFiles.length,

        lastSavedAt:
          ScoutReportCreateState
            .lastSavedAt
      };
    },

    getPayload() {
      return sanitizeScoutReportPayload(
        buildScoutReportPayload()
      );
    }
  });


/* =========================================================
   END OF SCOUT-REPORT-CREATE.JS — PART 2G
========================================================= */
