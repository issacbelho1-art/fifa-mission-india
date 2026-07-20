"use strict";

/* =========================================================
   SCOUT-PLAYER-VIEW.JS
   PART 1
   CONFIGURATION, STATE, DOM CACHE, UTILITIES,
   NOTIFICATIONS, SIDEBAR, MODALS AND PROFILE LOADING
========================================================= */


/* =========================================================
   CONFIGURATION
========================================================= */

const SCOUT_PLAYER_VIEW_CONFIG = Object.freeze({
  apiBaseUrl: "/api/v1",
  playerEndpoint: "/players",
  scoutProfileEndpoint: "/scout/profile",
  savePlayerEndpoint: "/scout/saved-players",
  reportsEndpoint: "/scout/reports",
  requestTimeout: 12000,
  toastDuration: 4200,
  mockDelay: 650,
  useMockData: true
});


/* =========================================================
   APPLICATION STATE
========================================================= */

const scoutPlayerViewState = {
  playerId: null,
  player: null,
  scoutProfile: null,
  activeTab: "overview",
  saved: false,
  loading: false,
  reports: [],
  media: [],
  modalTrigger: null,
  abortController: null
};


/* =========================================================
   DOM CACHE
========================================================= */

const scoutPlayerViewDOM = {
  body: document.body,

  appShell: document.getElementById("scoutAppShell"),
  sidebar: document.getElementById("scoutSidebar"),
  sidebarOverlay: document.getElementById("scoutSidebarOverlay"),
  sidebarClose: document.getElementById("scoutSidebarClose"),
  menuButton: document.getElementById("scoutMenuButton"),

  loadingState: document.getElementById("playerLoadingState"),
  errorState: document.getElementById("playerErrorState"),
  errorMessage: document.getElementById("playerErrorMessage"),
  retryButton: document.getElementById("retryPlayerLoadButton"),
  viewContent: document.getElementById("playerViewContent"),

  breadcrumbPlayerName:
    document.getElementById("breadcrumbPlayerName"),

  savePlayerButton:
    document.getElementById("savePlayerButton"),

  sharePlayerButton:
    document.getElementById("sharePlayerButton"),

  createReportLink:
    document.getElementById("createReportLink"),

  reportsCreateLink:
    document.getElementById("reportsCreateLink"),

  playerCoverImage:
    document.getElementById("playerCoverImage"),

  playerProfileImage:
    document.getElementById("playerProfileImage"),

  playerStatusBadge:
    document.getElementById("playerStatusBadge"),

  playerVerifiedBadge:
    document.getElementById("playerVerifiedBadge"),

  playerAvailabilityIndicator:
    document.getElementById("playerAvailabilityIndicator"),

  playerFullName:
    document.getElementById("playerFullName"),

  playerPublicId:
    document.getElementById("playerPublicId"),

  playerPrimaryPosition:
    document.getElementById("playerPrimaryPosition"),

  playerAcademyName:
    document.getElementById("playerAcademyName"),

  playerAge:
    document.getElementById("playerAge"),

  playerLocation:
    document.getElementById("playerLocation"),

  playerPreferredFoot:
    document.getElementById("playerPreferredFoot"),

  playerOverallRating:
    document.getElementById("playerOverallRating"),

  playerReportCount:
    document.getElementById("playerReportCount"),

  playerMatchesViewed:
    document.getElementById("playerMatchesViewed"),

  playerPotentialRating:
    document.getElementById("playerPotentialRating"),

  playerLastScouted:
    document.getElementById("playerLastScouted"),

  playerBiography:
    document.getElementById("playerBiography"),

  detailPlayerFullName:
    document.getElementById("detailPlayerFullName"),

  detailPlayerDob:
    document.getElementById("detailPlayerDob"),

  detailPlayerAge:
    document.getElementById("detailPlayerAge"),

  detailPlayerGender:
    document.getElementById("detailPlayerGender"),

  detailPlayerNationality:
    document.getElementById("detailPlayerNationality"),

  detailPlayerState:
    document.getElementById("detailPlayerState"),

  detailPlayerDistrict:
    document.getElementById("detailPlayerDistrict"),

  detailPlayerRegistrationId:
    document.getElementById("detailPlayerRegistrationId"),

  detailPrimaryPosition:
    document.getElementById("detailPrimaryPosition"),

  detailSecondaryPosition:
    document.getElementById("detailSecondaryPosition"),

  detailPreferredFoot:
    document.getElementById("detailPreferredFoot"),

  detailJerseyNumber:
    document.getElementById("detailJerseyNumber"),

  detailCurrentAcademy:
    document.getElementById("detailCurrentAcademy"),

  detailCurrentTeam:
    document.getElementById("detailCurrentTeam"),

  detailPlayingLevel:
    document.getElementById("detailPlayingLevel"),

  detailExperience:
    document.getElementById("detailExperience"),

  playerHeight:
    document.getElementById("playerHeight"),

  playerWeight:
    document.getElementById("playerWeight"),

  playerBmi:
    document.getElementById("playerBmi"),

  playerDominantFoot:
    document.getElementById("playerDominantFoot"),

  technicalRatingValue:
    document.getElementById("technicalRatingValue"),

  technicalRatingBar:
    document.getElementById("technicalRatingBar"),

  tacticalRatingValue:
    document.getElementById("tacticalRatingValue"),

  tacticalRatingBar:
    document.getElementById("tacticalRatingBar"),

  physicalRatingValue:
    document.getElementById("physicalRatingValue"),

  physicalRatingBar:
    document.getElementById("physicalRatingBar"),

  mentalRatingValue:
    document.getElementById("mentalRatingValue"),

  mentalRatingBar:
    document.getElementById("mentalRatingBar"),

  ratingSourceLabel:
    document.getElementById("ratingSourceLabel"),

  playerReportList:
    document.getElementById("playerReportList"),

  playerReportsEmptyState:
    document.getElementById("playerReportsEmptyState"),

  playerMediaGrid:
    document.getElementById("playerMediaGrid"),

  playerMediaEmptyState:
    document.getElementById("playerMediaEmptyState"),

  playerRecommendationBadge:
    document.getElementById("playerRecommendationBadge"),

  playerRecommendationSummary:
    document.getElementById("playerRecommendationSummary"),

  playerPriority:
    document.getElementById("playerPriority"),

  playerPotentialLabel:
    document.getElementById("playerPotentialLabel"),

  playerConfidenceLevel:
    document.getElementById("playerConfidenceLevel"),

  playerStrengthsList:
    document.getElementById("playerStrengthsList"),

  playerDevelopmentList:
    document.getElementById("playerDevelopmentList"),

  playerEmailLink:
    document.getElementById("playerEmailLink"),

  playerPhoneLink:
    document.getElementById("playerPhoneLink"),

  playerGuardianName:
    document.getElementById("playerGuardianName"),

  guardianPhoneLink:
    document.getElementById("guardianPhoneLink"),

  identityDocumentStatus:
    document.getElementById("identityDocumentStatus"),

  ageDocumentStatus:
    document.getElementById("ageDocumentStatus"),

  guardianConsentStatus:
    document.getElementById("guardianConsentStatus"),

  tabs: Array.from(
    document.querySelectorAll("[data-player-tab]")
  ),

  panels: Array.from(
    document.querySelectorAll("[data-player-panel]")
  ),

  shareModal:
    document.getElementById("sharePlayerModal"),

  playerShareLink:
    document.getElementById("playerShareLink"),

  copyPlayerLinkButton:
    document.getElementById("copyPlayerLinkButton"),

  shareViaWhatsAppButton:
    document.getElementById("shareViaWhatsAppButton"),

  shareViaEmailButton:
    document.getElementById("shareViaEmailButton"),

  nativeShareButton:
    document.getElementById("nativeShareButton"),

  shareModalCloseButtons: Array.from(
    document.querySelectorAll("[data-share-modal-close]")
  ),

  mediaViewerModal:
    document.getElementById("playerMediaViewerModal"),

  mediaViewerTitle:
    document.getElementById("playerMediaViewerTitle"),

  mediaViewerContent:
    document.getElementById("playerMediaViewerContent"),

  mediaModalCloseButtons: Array.from(
    document.querySelectorAll("[data-media-modal-close]")
  ),

  logoutButton:
    document.getElementById("scoutLogoutButton"),

  logoutModal:
    document.getElementById("scoutLogoutModal"),

  logoutModalCloseButtons: Array.from(
    document.querySelectorAll("[data-logout-modal-close]")
  ),

  confirmLogoutButton:
    document.getElementById("confirmScoutLogoutButton"),

  notificationRegion:
    document.getElementById("scoutNotificationRegion"),

  scoutNameElements: Array.from(
    document.querySelectorAll("[data-scout-name]")
  ),

  scoutDesignationElements: Array.from(
    document.querySelectorAll("[data-scout-designation]")
  ),

  scoutOrganizationElements: Array.from(
    document.querySelectorAll("[data-scout-organization]")
  ),

  scoutAvatarElements: Array.from(
    document.querySelectorAll("[data-scout-avatar]")
  )
};


/* =========================================================
   GENERAL UTILITIES
========================================================= */

function isNonEmptyString(value) {
  return (
    typeof value === "string" &&
    value.trim().length > 0
  );
}


function safeText(value, fallback = "—") {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return fallback;
  }

  return String(value);
}


function clampNumber(value, min, max) {
  const parsedValue = Number(value);

  if (!Number.isFinite(parsedValue)) {
    return min;
  }

  return Math.min(
    Math.max(parsedValue, min),
    max
  );
}


function formatRating(value) {
  const rating = clampNumber(value, 0, 10);

  return Number.isInteger(rating)
    ? String(rating)
    : rating.toFixed(1);
}


function formatDate(
  value,
  options = {
    day: "2-digit",
    month: "short",
    year: "numeric"
  }
) {
  if (!value) {
    return "—";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return new Intl.DateTimeFormat(
    "en-IN",
    options
  ).format(date);
}


function calculateAge(dateOfBirth) {
  if (!dateOfBirth) {
    return null;
  }

  const birthDate = new Date(dateOfBirth);

  if (Number.isNaN(birthDate.getTime())) {
    return null;
  }

  const today = new Date();

  let age =
    today.getFullYear() -
    birthDate.getFullYear();

  const monthDifference =
    today.getMonth() -
    birthDate.getMonth();

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


function calculateBMI(heightCm, weightKg) {
  const height = Number(heightCm);
  const weight = Number(weightKg);

  if (
    !Number.isFinite(height) ||
    !Number.isFinite(weight) ||
    height <= 0 ||
    weight <= 0
  ) {
    return null;
  }

  const heightInMeters = height / 100;
  const bmi =
    weight /
    (heightInMeters * heightInMeters);

  return bmi.toFixed(1);
}


function formatLocation(...parts) {
  return parts
    .filter((part) => isNonEmptyString(part))
    .map((part) => part.trim())
    .join(", ") || "—";
}


function getQueryParameter(name) {
  const query = new URLSearchParams(
    window.location.search
  );

  return query.get(name);
}


function createElement(
  tagName,
  className = "",
  textContent = ""
) {
  const element = document.createElement(tagName);

  if (className) {
    element.className = className;
  }

  if (textContent) {
    element.textContent = textContent;
  }

  return element;
}


function setText(element, value, fallback = "—") {
  if (!element) {
    return;
  }

  element.textContent = safeText(
    value,
    fallback
  );
}


function setLinkValue(
  element,
  value,
  protocol = ""
) {
  if (!element) {
    return;
  }

  const hasValue = isNonEmptyString(value);

  element.textContent = hasValue
    ? value.trim()
    : "—";

  element.href = hasValue
    ? `${protocol}${value.trim()}`
    : "#";

  element.setAttribute(
    "aria-disabled",
    hasValue ? "false" : "true"
  );

  if (!hasValue) {
    element.addEventListener(
      "click",
      preventDisabledLink,
      { once: true }
    );
  }
}


function preventDisabledLink(event) {
  event.preventDefault();
}


function delay(milliseconds) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, milliseconds);
  });
}


/* =========================================================
   REQUEST HELPER
========================================================= */

async function scoutApiRequest(
  endpoint,
  options = {}
) {
  const controller = new AbortController();

  const timeoutId = window.setTimeout(() => {
    controller.abort();
  }, SCOUT_PLAYER_VIEW_CONFIG.requestTimeout);

  const requestOptions = {
    method: options.method || "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(options.headers || {})
    },
    signal: options.signal || controller.signal,
    credentials: "include"
  };

  if (options.body !== undefined) {
    requestOptions.body =
      typeof options.body === "string"
        ? options.body
        : JSON.stringify(options.body);
  }

  try {
    const response = await fetch(
      `${SCOUT_PLAYER_VIEW_CONFIG.apiBaseUrl}${endpoint}`,
      requestOptions
    );

    const responseData =
      response.status === 204
        ? null
        : await response.json();

    if (!response.ok) {
      const error = new Error(
        responseData?.message ||
        "The request could not be completed."
      );

      error.status = response.status;
      error.data = responseData;

      throw error;
    }

    return responseData;
  } finally {
    window.clearTimeout(timeoutId);
  }
}


/* =========================================================
   NOTIFICATIONS
========================================================= */

function showScoutNotification({
  title = "Notification",
  message = "",
  type = "info",
  duration =
    SCOUT_PLAYER_VIEW_CONFIG.toastDuration
}) {
  if (!scoutPlayerViewDOM.notificationRegion) {
    return;
  }

  const toast = createElement(
    "div",
    `scout-toast is-${type}`
  );

  toast.setAttribute("role", "status");

  const icon = createElement(
    "span",
    "scout-toast-icon"
  );

  const iconMap = {
    success: "✓",
    error: "!",
    warning: "!",
    info: "i"
  };

  icon.textContent =
    iconMap[type] ||
    iconMap.info;

  const content = createElement(
    "div",
    "scout-toast-content"
  );

  const heading = createElement(
    "strong",
    "",
    title
  );

  const description = createElement(
    "p",
    "",
    message
  );

  const closeButton = createElement(
    "button",
    "scout-toast-close",
    "×"
  );

  closeButton.type = "button";
  closeButton.setAttribute(
    "aria-label",
    "Dismiss notification"
  );

  content.append(
    heading,
    description
  );

  toast.append(
    icon,
    content,
    closeButton
  );

  scoutPlayerViewDOM.notificationRegion.append(
    toast
  );

  let removed = false;

  const removeToast = () => {
    if (removed) {
      return;
    }

    removed = true;
    toast.classList.add("is-leaving");

    window.setTimeout(() => {
      toast.remove();
    }, 200);
  };

  closeButton.addEventListener(
    "click",
    removeToast
  );

  window.setTimeout(
    removeToast,
    duration
  );
}


/* =========================================================
   SIDEBAR
========================================================= */

function openScoutSidebar() {
  scoutPlayerViewDOM.body.classList.add(
    "scout-sidebar-open"
  );

  scoutPlayerViewDOM.menuButton?.setAttribute(
    "aria-expanded",
    "true"
  );

  scoutPlayerViewDOM.sidebarOverlay?.setAttribute(
    "aria-hidden",
    "false"
  );

  scoutPlayerViewDOM.sidebarClose?.focus();
}


function closeScoutSidebar({
  restoreFocus = true
} = {}) {
  scoutPlayerViewDOM.body.classList.remove(
    "scout-sidebar-open"
  );

  scoutPlayerViewDOM.menuButton?.setAttribute(
    "aria-expanded",
    "false"
  );

  scoutPlayerViewDOM.sidebarOverlay?.setAttribute(
    "aria-hidden",
    "true"
  );

  if (restoreFocus) {
    scoutPlayerViewDOM.menuButton?.focus();
  }
}


function initializeScoutSidebar() {
  scoutPlayerViewDOM.menuButton?.addEventListener(
    "click",
    openScoutSidebar
  );

  scoutPlayerViewDOM.sidebarClose?.addEventListener(
    "click",
    () => {
      closeScoutSidebar();
    }
  );

  scoutPlayerViewDOM.sidebarOverlay?.addEventListener(
    "click",
    () => {
      closeScoutSidebar();
    }
  );

  window.addEventListener("resize", () => {
    if (window.innerWidth > 960) {
      closeScoutSidebar({
        restoreFocus: false
      });
    }
  });
}


/* =========================================================
   MODAL UTILITIES
========================================================= */

function getFocusableElements(container) {
  if (!container) {
    return [];
  }

  return Array.from(
    container.querySelectorAll(
      [
        "a[href]",
        "button:not([disabled])",
        "input:not([disabled])",
        "select:not([disabled])",
        "textarea:not([disabled])",
        "[tabindex]:not([tabindex='-1'])"
      ].join(",")
    )
  ).filter((element) => {
    return !element.hasAttribute("hidden");
  });
}


function trapModalFocus(event, modal) {
  if (
    event.key !== "Tab" ||
    !modal ||
    modal.hidden
  ) {
    return;
  }

  const focusableElements =
    getFocusableElements(modal);

  if (!focusableElements.length) {
    event.preventDefault();
    return;
  }

  const firstElement =
    focusableElements[0];

  const lastElement =
    focusableElements[
      focusableElements.length - 1
    ];

  if (
    event.shiftKey &&
    document.activeElement === firstElement
  ) {
    event.preventDefault();
    lastElement.focus();
    return;
  }

  if (
    !event.shiftKey &&
    document.activeElement === lastElement
  ) {
    event.preventDefault();
    firstElement.focus();
  }
}


function openModal(modal, trigger = null) {
  if (!modal) {
    return;
  }

  scoutPlayerViewState.modalTrigger =
    trigger ||
    document.activeElement;

  modal.hidden = false;

  scoutPlayerViewDOM.body.classList.add(
    "scout-modal-open"
  );

  const focusableElements =
    getFocusableElements(modal);

  window.requestAnimationFrame(() => {
    focusableElements[0]?.focus();
  });
}


function closeModal(modal) {
  if (!modal) {
    return;
  }

  modal.hidden = true;

  const anyOpenModal = [
    scoutPlayerViewDOM.shareModal,
    scoutPlayerViewDOM.mediaViewerModal,
    scoutPlayerViewDOM.logoutModal
  ].some((candidate) => {
    return candidate && !candidate.hidden;
  });

  if (!anyOpenModal) {
    scoutPlayerViewDOM.body.classList.remove(
      "scout-modal-open"
    );
  }

  if (
    scoutPlayerViewState.modalTrigger instanceof
    HTMLElement
  ) {
    scoutPlayerViewState.modalTrigger.focus();
  }

  scoutPlayerViewState.modalTrigger = null;
}


/* =========================================================
   LOADING AND ERROR STATES
========================================================= */

function setPlayerLoadingState(isLoading) {
  scoutPlayerViewState.loading = isLoading;

  if (scoutPlayerViewDOM.loadingState) {
    scoutPlayerViewDOM.loadingState.hidden =
      !isLoading;
  }

  if (isLoading) {
    if (scoutPlayerViewDOM.errorState) {
      scoutPlayerViewDOM.errorState.hidden = true;
    }

    if (scoutPlayerViewDOM.viewContent) {
      scoutPlayerViewDOM.viewContent.hidden = true;
    }
  }
}


function showPlayerError(message) {
  setPlayerLoadingState(false);

  if (scoutPlayerViewDOM.errorMessage) {
    scoutPlayerViewDOM.errorMessage.textContent =
      message ||
      "We could not load this player's information.";
  }

  if (scoutPlayerViewDOM.errorState) {
    scoutPlayerViewDOM.errorState.hidden = false;
  }

  if (scoutPlayerViewDOM.viewContent) {
    scoutPlayerViewDOM.viewContent.hidden = true;
  }
}


function showPlayerContent() {
  setPlayerLoadingState(false);

  if (scoutPlayerViewDOM.errorState) {
    scoutPlayerViewDOM.errorState.hidden = true;
  }

  if (scoutPlayerViewDOM.viewContent) {
    scoutPlayerViewDOM.viewContent.hidden = false;
  }
}


/* =========================================================
   MOCK DATA
========================================================= */

function getMockPlayerData(playerId) {
  return {
    id: playerId || "player-001",
    publicId: "FMI-PLR-2034-1028",
    registrationId: "REG-IND-2026-1028",

    firstName: "Aarav",
    lastName: "Sharma",
    fullName: "Aarav Sharma",

    profileImage:
      "images/player-avatar-placeholder.jpg",

    coverImage:
      "images/scout-player-cover-placeholder.jpg",

    biography:
      "A technically gifted attacking midfielder with strong close control, intelligent movement between the lines and excellent awareness in transition. Aarav has shown consistent development and demonstrates the discipline required for elite youth football.",

    dateOfBirth: "2011-08-14",
    gender: "Male",
    nationality: "Indian",
    state: "Punjab",
    district: "Mohali",
    city: "Mohali",

    status: "active",
    verified: true,
    availableForScouting: true,

    primaryPosition: "Attacking Midfielder",
    secondaryPosition: "Right Winger",
    preferredFoot: "Right",
    dominantFoot: "Right",
    jerseyNumber: 10,
    currentAcademy: "Punjab Elite Football Academy",
    currentTeam: "Punjab Elite U-15",
    playingLevel: "Elite Academy",
    experienceYears: 6,

    heightCm: 164,
    weightKg: 54,

    overallRating: 8.4,
    potentialRating: 9.1,
    potentialLabel: "Elite Potential",
    reportCount: 4,
    matchesViewed: 8,
    lastScoutedAt: "2026-07-15T10:30:00Z",

    ratings: {
      technical: 8.8,
      tactical: 8.2,
      physical: 7.6,
      mental: 8.5
    },

    ratingSource:
      "Latest Scout Assessment",

    recommendation: {
      status: "recommended",
      label: "Highly Recommended",
      summary:
        "Strong candidate for advanced regional assessment and national youth development monitoring.",
      priority: "High",
      confidence: "Strong"
    },

    strengths: [
      "Excellent first touch and close control",
      "Strong decision-making in attacking areas",
      "Creative passing under pressure",
      "High work rate and coachability"
    ],

    developmentAreas: [
      "Increase upper-body strength",
      "Improve defensive positioning",
      "Develop weaker-foot confidence"
    ],

    contact: {
      email: "player@example.com",
      phone: "+919876543210",
      guardianName: "Rajesh Sharma",
      guardianPhone: "+919876540001"
    },

    documents: {
      identityProof: "verified",
      ageProof: "verified",
      guardianConsent: "pending"
    },

    savedByCurrentScout: false,

    reports: [
      {
        id: "report-001",
        title: "Regional League Assessment",
        matchName:
          "Punjab Elite U-15 vs Chandigarh Youth",
        createdAt: "2026-07-15T10:30:00Z",
        scoutName: "Scout Name",
        rating: 8.4
      },
      {
        id: "report-002",
        title: "Technical Development Review",
        matchName:
          "Punjab Elite Training Assessment",
        createdAt: "2026-06-29T09:00:00Z",
        scoutName: "Scout Name",
        rating: 8.1
      }
    ],

    media: [
      {
        id: "media-001",
        type: "image",
        title: "Match Action",
        url: "images/scout-player-cover-placeholder.jpg"
      },
      {
        id: "media-002",
        type: "image",
        title: "Academy Training",
        url: "images/player-avatar-placeholder.jpg"
      }
    ]
  };
}


function getMockScoutProfile() {
  return {
    id: "scout-001",
    name: "Scout Name",
    designation: "Talent Scout",
    organization: "FIFA Mission India",
    avatar:
      "images/scout-avatar-placeholder.jpg"
  };
}


/* =========================================================
   DATA NORMALIZATION
========================================================= */

function normalizePlayerData(rawPlayer = {}) {
  const firstName =
    safeText(rawPlayer.firstName, "").trim();

  const lastName =
    safeText(rawPlayer.lastName, "").trim();

  const computedFullName =
    [firstName, lastName]
      .filter(Boolean)
      .join(" ");

  const dateOfBirth =
    rawPlayer.dateOfBirth ||
    rawPlayer.dob ||
    null;

  const calculatedAge =
    calculateAge(dateOfBirth);

  return {
    id:
      rawPlayer.id ||
      rawPlayer.playerId ||
      scoutPlayerViewState.playerId,

    publicId:
      rawPlayer.publicId ||
      rawPlayer.playerCode ||
      "FMI-PLAYER",

    registrationId:
      rawPlayer.registrationId ||
      rawPlayer.registrationNumber ||
      "—",

    fullName:
      rawPlayer.fullName ||
      computedFullName ||
      "Player Name",

    profileImage:
      rawPlayer.profileImage ||
      rawPlayer.avatar ||
      "images/player-avatar-placeholder.jpg",

    coverImage:
      rawPlayer.coverImage ||
      "images/scout-player-cover-placeholder.jpg",

    biography:
      rawPlayer.biography ||
      rawPlayer.about ||
      "No player biography is available.",

    dateOfBirth,

    age:
      rawPlayer.age ??
      calculatedAge ??
      "—",

    gender:
      rawPlayer.gender ||
      "—",

    nationality:
      rawPlayer.nationality ||
      "Indian",

    state:
      rawPlayer.state ||
      "—",

    district:
      rawPlayer.district ||
      "—",

    city:
      rawPlayer.city ||
      "",

    status:
      rawPlayer.status ||
      "active",

    verified:
      Boolean(rawPlayer.verified),

    availableForScouting:
      rawPlayer.availableForScouting !== false,

    primaryPosition:
      rawPlayer.primaryPosition ||
      rawPlayer.position ||
      "—",

    secondaryPosition:
      rawPlayer.secondaryPosition ||
      "—",

    preferredFoot:
      rawPlayer.preferredFoot ||
      "—",

    dominantFoot:
      rawPlayer.dominantFoot ||
      rawPlayer.preferredFoot ||
      "—",

    jerseyNumber:
      rawPlayer.jerseyNumber ??
      "—",

    currentAcademy:
      rawPlayer.currentAcademy ||
      rawPlayer.academyName ||
      "Independent Player",

    currentTeam:
      rawPlayer.currentTeam ||
      rawPlayer.teamName ||
      "—",

    playingLevel:
      rawPlayer.playingLevel ||
      "—",

    experienceYears:
      rawPlayer.experienceYears ??
      rawPlayer.yearsOfExperience ??
      "—",

    heightCm:
      rawPlayer.heightCm ??
      rawPlayer.height ??
      null,

    weightKg:
      rawPlayer.weightKg ??
      rawPlayer.weight ??
      null,

    overallRating:
      clampNumber(
        rawPlayer.overallRating,
        0,
        10
      ),

    potentialRating:
      clampNumber(
        rawPlayer.potentialRating,
        0,
        10
      ),

    potentialLabel:
      rawPlayer.potentialLabel ||
      "—",

    reportCount:
      Number(
        rawPlayer.reportCount ??
        rawPlayer.reports?.length ??
        0
      ),

    matchesViewed:
      Number(
        rawPlayer.matchesViewed ??
        0
      ),

    lastScoutedAt:
      rawPlayer.lastScoutedAt ||
      null,

    ratings: {
      technical:
        clampNumber(
          rawPlayer.ratings?.technical,
          0,
          10
        ),

      tactical:
        clampNumber(
          rawPlayer.ratings?.tactical,
          0,
          10
        ),

      physical:
        clampNumber(
          rawPlayer.ratings?.physical,
          0,
          10
        ),

      mental:
        clampNumber(
          rawPlayer.ratings?.mental,
          0,
          10
        )
    },

    ratingSource:
      rawPlayer.ratingSource ||
      "Latest Scout Assessment",

    recommendation: {
      status:
        rawPlayer.recommendation?.status ||
        "pending",

      label:
        rawPlayer.recommendation?.label ||
        "Pending Review",

      summary:
        rawPlayer.recommendation?.summary ||
        "No final recommendation has been recorded.",

      priority:
        rawPlayer.recommendation?.priority ||
        "—",

      confidence:
        rawPlayer.recommendation?.confidence ||
        "—"
    },

    strengths:
      Array.isArray(rawPlayer.strengths)
        ? rawPlayer.strengths
        : [],

    developmentAreas:
      Array.isArray(
        rawPlayer.developmentAreas
      )
        ? rawPlayer.developmentAreas
        : [],

    contact: {
      email:
        rawPlayer.contact?.email ||
        rawPlayer.email ||
        "",

      phone:
        rawPlayer.contact?.phone ||
        rawPlayer.phone ||
        "",

      guardianName:
        rawPlayer.contact?.guardianName ||
        rawPlayer.guardianName ||
        "—",

      guardianPhone:
        rawPlayer.contact?.guardianPhone ||
        rawPlayer.guardianPhone ||
        ""
    },

    documents: {
      identityProof:
        rawPlayer.documents?.identityProof ||
        "pending",

      ageProof:
        rawPlayer.documents?.ageProof ||
        "pending",

      guardianConsent:
        rawPlayer.documents?.guardianConsent ||
        "pending"
    },

    savedByCurrentScout:
      Boolean(rawPlayer.savedByCurrentScout),

    reports:
      Array.isArray(rawPlayer.reports)
        ? rawPlayer.reports
        : [],

    media:
      Array.isArray(rawPlayer.media)
        ? rawPlayer.media
        : []
  };
}


/* =========================================================
   SCOUT PROFILE
========================================================= */

function normalizeScoutProfile(rawProfile = {}) {
  return {
    id:
      rawProfile.id ||
      rawProfile.scoutId ||
      null,

    name:
      rawProfile.name ||
      rawProfile.fullName ||
      "Scout Name",

    designation:
      rawProfile.designation ||
      rawProfile.role ||
      "Talent Scout",

    organization:
      rawProfile.organization ||
      "FIFA Mission India",

    avatar:
      rawProfile.avatar ||
      rawProfile.profileImage ||
      "images/scout-avatar-placeholder.jpg"
  };
}


function renderScoutProfile(profile) {
  scoutPlayerViewDOM.scoutNameElements.forEach(
    (element) => {
      element.textContent = profile.name;
    }
  );

  scoutPlayerViewDOM.scoutDesignationElements.forEach(
    (element) => {
      element.textContent =
        profile.designation;
    }
  );

  scoutPlayerViewDOM.scoutOrganizationElements.forEach(
    (element) => {
      element.textContent =
        profile.organization;
    }
  );

  scoutPlayerViewDOM.scoutAvatarElements.forEach(
    (element) => {
      element.src = profile.avatar;
      element.alt = `${profile.name} profile`;
    }
  );
}


async function loadScoutProfile() {
  try {
    let profileData;

    if (SCOUT_PLAYER_VIEW_CONFIG.useMockData) {
      await delay(250);
      profileData = getMockScoutProfile();
    } else {
      profileData = await scoutApiRequest(
        SCOUT_PLAYER_VIEW_CONFIG
          .scoutProfileEndpoint
      );
    }

    scoutPlayerViewState.scoutProfile =
      normalizeScoutProfile(profileData);

    renderScoutProfile(
      scoutPlayerViewState.scoutProfile
    );
  } catch (error) {
    console.error(
      "Unable to load scout profile:",
      error
    );
  }
}


/* =========================================================
   PLAYER FETCHING
========================================================= */

async function fetchPlayerProfile(playerId) {
  if (SCOUT_PLAYER_VIEW_CONFIG.useMockData) {
    await delay(
      SCOUT_PLAYER_VIEW_CONFIG.mockDelay
    );

    return getMockPlayerData(playerId);
  }

  return scoutApiRequest(
    `${SCOUT_PLAYER_VIEW_CONFIG.playerEndpoint}/${encodeURIComponent(playerId)}`
  );
}


async function loadPlayerProfile() {
  const playerId =
    scoutPlayerViewState.playerId;

  if (!playerId) {
    showPlayerError(
      "No player was selected. Return to the player directory and choose a player."
    );

    return;
  }

  if (
    scoutPlayerViewState.abortController
  ) {
    scoutPlayerViewState
      .abortController
      .abort();
  }

  scoutPlayerViewState.abortController =
    new AbortController();

  setPlayerLoadingState(true);

  try {
    const rawPlayer =
      await fetchPlayerProfile(playerId);

    const player =
      normalizePlayerData(rawPlayer);

    scoutPlayerViewState.player = player;
    scoutPlayerViewState.saved =
      player.savedByCurrentScout;
    scoutPlayerViewState.reports =
      player.reports;
    scoutPlayerViewState.media =
      player.media;

    renderPlayerProfile(player);
    showPlayerContent();
  } catch (error) {
    if (error.name === "AbortError") {
      return;
    }

    console.error(
      "Unable to load player profile:",
      error
    );

    showPlayerError(
      error.message ||
      "The player profile could not be loaded."
    );
  }
}


/* =========================================================
   PLAYER RENDERING
========================================================= */

function renderPlayerProfile(player) {
  document.title =
    `${player.fullName} | FIFA Mission India Scout Portal`;

  setText(
    scoutPlayerViewDOM.breadcrumbPlayerName,
    player.fullName,
    "Player Profile"
  );

  if (scoutPlayerViewDOM.playerCoverImage) {
    scoutPlayerViewDOM.playerCoverImage.src =
      player.coverImage;
  }

  if (scoutPlayerViewDOM.playerProfileImage) {
    scoutPlayerViewDOM.playerProfileImage.src =
      player.profileImage;

    scoutPlayerViewDOM.playerProfileImage.alt =
      `${player.fullName} profile`;
  }

  renderPlayerStatus(player);
  renderPlayerIdentity(player);
  renderPlayerStatistics(player);
  renderPlayerDetails(player);
  renderPerformanceRatings(player);
  renderRecommendation(player);
  renderInsightLists(player);
  renderContactDetails(player);
  renderDocumentStatuses(player);
  renderPlayerReports(player.reports);
  renderPlayerMedia(player.media);
  updateSavePlayerButton();
  updatePlayerLinks(player);
}


/* =========================================================
   PLAYER STATUS
========================================================= */

function renderPlayerStatus(player) {
  const status =
    safeText(player.status, "active")
      .toLowerCase();

  if (scoutPlayerViewDOM.playerStatusBadge) {
    scoutPlayerViewDOM
      .playerStatusBadge
      .className =
      "scout-player-status-badge";

    scoutPlayerViewDOM
      .playerStatusBadge
      .classList.add(`is-${status}`);

    scoutPlayerViewDOM
      .playerStatusBadge
      .textContent =
      status.charAt(0).toUpperCase() +
      status.slice(1);
  }

  if (scoutPlayerViewDOM.playerVerifiedBadge) {
    scoutPlayerViewDOM
      .playerVerifiedBadge
      .hidden =
      !player.verified;
  }

  if (
    scoutPlayerViewDOM
      .playerAvailabilityIndicator
  ) {
    scoutPlayerViewDOM
      .playerAvailabilityIndicator
      .classList.toggle(
        "is-unavailable",
        !player.availableForScouting
      );

    scoutPlayerViewDOM
      .playerAvailabilityIndicator
      .title =
      player.availableForScouting
        ? "Available for scouting"
        : "Currently unavailable for scouting";
  }
}


/* =========================================================
   PLAYER IDENTITY
========================================================= */

function renderPlayerIdentity(player) {
  setText(
    scoutPlayerViewDOM.playerFullName,
    player.fullName,
    "Player Name"
  );

  setText(
    scoutPlayerViewDOM.playerPublicId,
    player.publicId,
    "FMI-PLAYER"
  );

  setText(
    scoutPlayerViewDOM.playerPrimaryPosition,
    player.primaryPosition
  );

  setText(
    scoutPlayerViewDOM.playerAcademyName,
    player.currentAcademy
  );

  setText(
    scoutPlayerViewDOM.playerAge,
    player.age
  );

  setText(
    scoutPlayerViewDOM.playerLocation,
    formatLocation(
      player.city,
      player.district,
      player.state
    )
  );

  setText(
    scoutPlayerViewDOM.playerPreferredFoot,
    player.preferredFoot
  );
}


/* =========================================================
   PLAYER STATISTICS
========================================================= */

function renderPlayerStatistics(player) {
  setText(
    scoutPlayerViewDOM.playerOverallRating,
    formatRating(player.overallRating)
  );

  setText(
    scoutPlayerViewDOM.playerReportCount,
    player.reportCount,
    "0"
  );

  setText(
    scoutPlayerViewDOM.playerMatchesViewed,
    player.matchesViewed,
    "0"
  );

  setText(
    scoutPlayerViewDOM.playerPotentialRating,
    formatRating(player.potentialRating)
  );

  setText(
    scoutPlayerViewDOM.playerLastScouted,
    formatDate(
      player.lastScoutedAt,
      {
        day: "2-digit",
        month: "short"
      }
    )
  );
}


/* =========================================================
   PLAYER DETAILS
========================================================= */

function renderPlayerDetails(player) {
  setText(
    scoutPlayerViewDOM.playerBiography,
    player.biography,
    "No player biography is available."
  );

  setText(
    scoutPlayerViewDOM.detailPlayerFullName,
    player.fullName
  );

  setText(
    scoutPlayerViewDOM.detailPlayerDob,
    formatDate(player.dateOfBirth)
  );

  setText(
    scoutPlayerViewDOM.detailPlayerAge,
    player.age
  );

  setText(
    scoutPlayerViewDOM.detailPlayerGender,
    player.gender
  );

  setText(
    scoutPlayerViewDOM.detailPlayerNationality,
    player.nationality
  );

  setText(
    scoutPlayerViewDOM.detailPlayerState,
    player.state
  );

  setText(
    scoutPlayerViewDOM.detailPlayerDistrict,
    player.district
  );

  setText(
    scoutPlayerViewDOM.detailPlayerRegistrationId,
    player.registrationId
  );

  setText(
    scoutPlayerViewDOM.detailPrimaryPosition,
    player.primaryPosition
  );

  setText(
    scoutPlayerViewDOM.detailSecondaryPosition,
    player.secondaryPosition
  );

  setText(
    scoutPlayerViewDOM.detailPreferredFoot,
    player.preferredFoot
  );

  setText(
    scoutPlayerViewDOM.detailJerseyNumber,
    player.jerseyNumber
  );

  setText(
    scoutPlayerViewDOM.detailCurrentAcademy,
    player.currentAcademy
  );

  setText(
    scoutPlayerViewDOM.detailCurrentTeam,
    player.currentTeam
  );

  setText(
    scoutPlayerViewDOM.detailPlayingLevel,
    player.playingLevel
  );

  const experienceText =
    Number.isFinite(
      Number(player.experienceYears)
    )
      ? `${player.experienceYears} years`
      : player.experienceYears;

  setText(
    scoutPlayerViewDOM.detailExperience,
    experienceText
  );

  setText(
    scoutPlayerViewDOM.playerHeight,
    player.heightCm
      ? `${player.heightCm} cm`
      : "—"
  );

  setText(
    scoutPlayerViewDOM.playerWeight,
    player.weightKg
      ? `${player.weightKg} kg`
      : "—"
  );

  setText(
    scoutPlayerViewDOM.playerBmi,
    calculateBMI(
      player.heightCm,
      player.weightKg
    )
  );

  setText(
    scoutPlayerViewDOM.playerDominantFoot,
    player.dominantFoot
  );
}


/* =========================================================
   END OF SCOUT-PLAYER-VIEW.JS — PART 1
   CONTINUE DIRECTLY WITH PART 2
========================================================= */

/* =========================================================
   SCOUT-PLAYER-VIEW.JS
   PART 2
   PERFORMANCE, RECOMMENDATIONS, REPORTS, MEDIA,
   SAVE PLAYER, SHARING, TABS, LOGOUT AND INITIALIZATION
   CONTINUES DIRECTLY FROM PART 1
========================================================= */


/* =========================================================
   PERFORMANCE RATINGS
========================================================= */

function updateRatingElement(
  valueElement,
  barElement,
  rating
) {
  const normalizedRating =
    clampNumber(rating, 0, 10);

  const percentage =
    normalizedRating * 10;

  setText(
    valueElement,
    formatRating(normalizedRating),
    "0"
  );

  if (barElement) {
    barElement.style.width =
      `${percentage}%`;

    const progressTrack =
      barElement.parentElement;

    if (progressTrack) {
      progressTrack.setAttribute(
        "aria-valuenow",
        String(normalizedRating)
      );
    }
  }
}


function renderPerformanceRatings(player) {
  updateRatingElement(
    scoutPlayerViewDOM.technicalRatingValue,
    scoutPlayerViewDOM.technicalRatingBar,
    player.ratings.technical
  );

  updateRatingElement(
    scoutPlayerViewDOM.tacticalRatingValue,
    scoutPlayerViewDOM.tacticalRatingBar,
    player.ratings.tactical
  );

  updateRatingElement(
    scoutPlayerViewDOM.physicalRatingValue,
    scoutPlayerViewDOM.physicalRatingBar,
    player.ratings.physical
  );

  updateRatingElement(
    scoutPlayerViewDOM.mentalRatingValue,
    scoutPlayerViewDOM.mentalRatingBar,
    player.ratings.mental
  );

  setText(
    scoutPlayerViewDOM.ratingSourceLabel,
    player.ratingSource,
    "Latest Scout Assessment"
  );
}


/* =========================================================
   RECOMMENDATION
========================================================= */

function getRecommendationClass(status) {
  const normalizedStatus =
    safeText(status, "pending")
      .toLowerCase()
      .replace(/\s+/g, "-");

  const classMap = {
    recommended: "is-recommended",
    "highly-recommended":
      "is-recommended",
    monitor: "is-monitor",
    monitoring: "is-monitor",
    "not-recommended":
      "is-not-recommended",
    rejected:
      "is-not-recommended",
    pending: ""
  };

  return classMap[normalizedStatus] || "";
}


function renderRecommendation(player) {
  const recommendation =
    player.recommendation;

  if (
    scoutPlayerViewDOM
      .playerRecommendationBadge
  ) {
    scoutPlayerViewDOM
      .playerRecommendationBadge
      .className =
      "scout-recommendation-badge";

    const recommendationClass =
      getRecommendationClass(
        recommendation.status
      );

    if (recommendationClass) {
      scoutPlayerViewDOM
        .playerRecommendationBadge
        .classList.add(
          recommendationClass
        );
    }

    scoutPlayerViewDOM
      .playerRecommendationBadge
      .textContent =
      recommendation.label;
  }

  setText(
    scoutPlayerViewDOM
      .playerRecommendationSummary,
    recommendation.summary,
    "No final recommendation has been recorded."
  );

  setText(
    scoutPlayerViewDOM.playerPriority,
    recommendation.priority
  );

  setText(
    scoutPlayerViewDOM.playerPotentialLabel,
    player.potentialLabel
  );

  setText(
    scoutPlayerViewDOM.playerConfidenceLevel,
    recommendation.confidence
  );
}


/* =========================================================
   INSIGHT LISTS
========================================================= */

function renderInsightList(
  listElement,
  items,
  emptyText
) {
  if (!listElement) {
    return;
  }

  listElement.replaceChildren();

  if (
    !Array.isArray(items) ||
    items.length === 0
  ) {
    const emptyItem =
      createElement(
        "li",
        "",
        emptyText
      );

    listElement.append(emptyItem);
    return;
  }

  const fragment =
    document.createDocumentFragment();

  items.forEach((item) => {
    const listItem =
      createElement(
        "li",
        "",
        safeText(item)
      );

    fragment.append(listItem);
  });

  listElement.append(fragment);
}


function renderInsightLists(player) {
  renderInsightList(
    scoutPlayerViewDOM.playerStrengthsList,
    player.strengths,
    "No strengths recorded yet."
  );

  renderInsightList(
    scoutPlayerViewDOM.playerDevelopmentList,
    player.developmentAreas,
    "No development areas recorded yet."
  );
}


/* =========================================================
   CONTACT DETAILS
========================================================= */

function renderContactDetails(player) {
  setLinkValue(
    scoutPlayerViewDOM.playerEmailLink,
    player.contact.email,
    "mailto:"
  );

  setLinkValue(
    scoutPlayerViewDOM.playerPhoneLink,
    player.contact.phone,
    "tel:"
  );

  setText(
    scoutPlayerViewDOM.playerGuardianName,
    player.contact.guardianName
  );

  setLinkValue(
    scoutPlayerViewDOM.guardianPhoneLink,
    player.contact.guardianPhone,
    "tel:"
  );
}


/* =========================================================
   DOCUMENT STATUS
========================================================= */

function formatDocumentStatus(status) {
  const normalizedStatus =
    safeText(status, "pending")
      .trim()
      .toLowerCase();

  return normalizedStatus
    .split("-")
    .map((word) => {
      return (
        word.charAt(0).toUpperCase() +
        word.slice(1)
      );
    })
    .join(" ");
}


function renderDocumentStatus(
  element,
  status
) {
  if (!element) {
    return;
  }

  const normalizedStatus =
    safeText(status, "pending")
      .trim()
      .toLowerCase();

  element.className = "";

  if (
    normalizedStatus === "verified" ||
    normalizedStatus === "approved"
  ) {
    element.classList.add(
      "is-verified"
    );
  } else if (
    normalizedStatus === "rejected" ||
    normalizedStatus === "invalid"
  ) {
    element.classList.add(
      "is-rejected"
    );
  } else {
    element.classList.add(
      "is-pending"
    );
  }

  element.textContent =
    formatDocumentStatus(
      normalizedStatus
    );
}


function renderDocumentStatuses(player) {
  renderDocumentStatus(
    scoutPlayerViewDOM
      .identityDocumentStatus,
    player.documents.identityProof
  );

  renderDocumentStatus(
    scoutPlayerViewDOM
      .ageDocumentStatus,
    player.documents.ageProof
  );

  renderDocumentStatus(
    scoutPlayerViewDOM
      .guardianConsentStatus,
    player.documents.guardianConsent
  );
}


/* =========================================================
   PLAYER REPORTS
========================================================= */

function createReportItem(report) {
  const article =
    createElement(
      "article",
      "scout-player-report-item"
    );

  const icon =
    createElement(
      "div",
      "scout-report-item-icon",
      "▤"
    );

  const content =
    createElement(
      "div",
      "scout-report-item-content"
    );

  const title =
    createElement(
      "h4",
      "",
      safeText(
        report.title,
        "Scouting Report"
      )
    );

  const meta =
    createElement(
      "div",
      "scout-report-item-meta"
    );

  const match =
    createElement(
      "span",
      "",
      safeText(
        report.matchName,
        "General Assessment"
      )
    );

  const date =
    createElement(
      "span",
      "",
      formatDate(
        report.createdAt
      )
    );

  const scout =
    createElement(
      "span",
      "",
      safeText(
        report.scoutName,
        "Scout"
      )
    );

  meta.append(
    match,
    date,
    scout
  );

  content.append(
    title,
    meta
  );

  const rating =
    createElement(
      "div",
      "scout-report-item-rating"
    );

  const ratingValue =
    createElement(
      "strong",
      "",
      formatRating(
        report.rating
      )
    );

  const ratingLabel =
    createElement(
      "small",
      "",
      "Rating"
    );

  rating.append(
    ratingValue,
    ratingLabel
  );

  const actions =
    createElement(
      "div",
      "scout-report-item-actions"
    );

  const viewLink =
    createElement(
      "a",
      "scout-report-action-link",
      "View Report"
    );

  viewLink.href =
    `scout-reports.html?reportId=${encodeURIComponent(
      report.id || ""
    )}`;

  const editLink =
    createElement(
      "a",
      "scout-report-action-link",
      "Edit Report"
    );

  editLink.href =
    `scout-report-create.html?reportId=${encodeURIComponent(
      report.id || ""
    )}&playerId=${encodeURIComponent(
      scoutPlayerViewState.playerId || ""
    )}`;

  actions.append(
    viewLink,
    editLink
  );

  article.append(
    icon,
    content,
    rating,
    actions
  );

  return article;
}


function renderPlayerReports(reports) {
  if (
    !scoutPlayerViewDOM
      .playerReportList
  ) {
    return;
  }

  scoutPlayerViewDOM
    .playerReportList
    .replaceChildren();

  const validReports =
    Array.isArray(reports)
      ? reports
      : [];

  if (validReports.length === 0) {
    scoutPlayerViewDOM
      .playerReportList
      .hidden = true;

    if (
      scoutPlayerViewDOM
        .playerReportsEmptyState
    ) {
      scoutPlayerViewDOM
        .playerReportsEmptyState
        .hidden = false;
    }

    return;
  }

  scoutPlayerViewDOM
    .playerReportList
    .hidden = false;

  if (
    scoutPlayerViewDOM
      .playerReportsEmptyState
  ) {
    scoutPlayerViewDOM
      .playerReportsEmptyState
      .hidden = true;
  }

  const fragment =
    document.createDocumentFragment();

  validReports.forEach((report) => {
    fragment.append(
      createReportItem(report)
    );
  });

  scoutPlayerViewDOM
    .playerReportList
    .append(fragment);
}


/* =========================================================
   PLAYER MEDIA
========================================================= */

function createMediaPreview(media) {
  const mediaItem =
    createElement(
      "button",
      "scout-player-media-item"
    );

  mediaItem.type = "button";

  mediaItem.dataset.mediaId =
    safeText(media.id, "");

  mediaItem.setAttribute(
    "aria-label",
    `Open ${safeText(
      media.title,
      "player media"
    )}`
  );

  const mediaType =
    safeText(media.type, "image")
      .toLowerCase();

  let mediaElement;

  if (mediaType === "video") {
    mediaElement =
      document.createElement("video");

    mediaElement.src =
      safeText(media.url, "");

    mediaElement.muted = true;
    mediaElement.preload = "metadata";
    mediaElement.playsInline = true;
  } else {
    mediaElement =
      document.createElement("img");

    mediaElement.src =
      safeText(
        media.thumbnailUrl ||
        media.url,
        "images/scout-player-cover-placeholder.jpg"
      );

    mediaElement.alt =
      safeText(
        media.title,
        "Player media"
      );

    mediaElement.loading = "lazy";
  }

  const overlay =
    createElement(
      "div",
      "scout-player-media-overlay"
    );

  const title =
    createElement(
      "span",
      "scout-player-media-title",
      safeText(
        media.title,
        "Player Media"
      )
    );

  const typeIcon =
    createElement(
      "span",
      "scout-player-media-type",
      mediaType === "video"
        ? "▶"
        : "◫"
    );

  overlay.append(
    title,
    typeIcon
  );

  mediaItem.append(
    mediaElement,
    overlay
  );

  if (
    mediaType === "video" &&
    isNonEmptyString(media.duration)
  ) {
    const duration =
      createElement(
        "span",
        "scout-player-media-duration",
        media.duration
      );

    mediaItem.append(duration);
  }

  mediaItem.addEventListener(
    "click",
    () => {
      openMediaViewer(
        media,
        mediaItem
      );
    }
  );

  return mediaItem;
}


function renderPlayerMedia(mediaItems) {
  if (
    !scoutPlayerViewDOM
      .playerMediaGrid
  ) {
    return;
  }

  scoutPlayerViewDOM
    .playerMediaGrid
    .replaceChildren();

  const validMedia =
    Array.isArray(mediaItems)
      ? mediaItems
      : [];

  if (validMedia.length === 0) {
    scoutPlayerViewDOM
      .playerMediaGrid
      .hidden = true;

    if (
      scoutPlayerViewDOM
        .playerMediaEmptyState
    ) {
      scoutPlayerViewDOM
        .playerMediaEmptyState
        .hidden = false;
    }

    return;
  }

  scoutPlayerViewDOM
    .playerMediaGrid
    .hidden = false;

  if (
    scoutPlayerViewDOM
      .playerMediaEmptyState
  ) {
    scoutPlayerViewDOM
      .playerMediaEmptyState
      .hidden = true;
  }

  const fragment =
    document.createDocumentFragment();

  validMedia.forEach((media) => {
    fragment.append(
      createMediaPreview(media)
    );
  });

  scoutPlayerViewDOM
    .playerMediaGrid
    .append(fragment);
}


/* =========================================================
   MEDIA VIEWER
========================================================= */

function openMediaViewer(
  media,
  trigger
) {
  if (
    !scoutPlayerViewDOM
      .mediaViewerModal ||
    !scoutPlayerViewDOM
      .mediaViewerContent
  ) {
    return;
  }

  scoutPlayerViewDOM
    .mediaViewerContent
    .replaceChildren();

  setText(
    scoutPlayerViewDOM
      .mediaViewerTitle,
    media.title,
    "Player Media"
  );

  const mediaType =
    safeText(media.type, "image")
      .toLowerCase();

  let mediaElement;

  if (mediaType === "video") {
    mediaElement =
      document.createElement("video");

    mediaElement.src =
      safeText(media.url, "");

    mediaElement.controls = true;
    mediaElement.autoplay = true;
    mediaElement.playsInline = true;
  } else {
    mediaElement =
      document.createElement("img");

    mediaElement.src =
      safeText(
        media.url,
        "images/scout-player-cover-placeholder.jpg"
      );

    mediaElement.alt =
      safeText(
        media.title,
        "Player media"
      );
  }

  scoutPlayerViewDOM
    .mediaViewerContent
    .append(mediaElement);

  openModal(
    scoutPlayerViewDOM
      .mediaViewerModal,
    trigger
  );
}


function closeMediaViewer() {
  if (
    scoutPlayerViewDOM
      .mediaViewerContent
  ) {
    const video =
      scoutPlayerViewDOM
        .mediaViewerContent
        .querySelector("video");

    video?.pause();

    scoutPlayerViewDOM
      .mediaViewerContent
      .replaceChildren();
  }

  closeModal(
    scoutPlayerViewDOM
      .mediaViewerModal
  );
}


/* =========================================================
   SAVE PLAYER
========================================================= */

function updateSavePlayerButton() {
  const button =
    scoutPlayerViewDOM.savePlayerButton;

  if (!button) {
    return;
  }

  button.classList.toggle(
    "is-saved",
    scoutPlayerViewState.saved
  );

  button.setAttribute(
    "aria-pressed",
    String(
      scoutPlayerViewState.saved
    )
  );

  const icon =
    button.querySelector(
      "span:first-child"
    );

  const label =
    button.querySelector(
      "span:last-child"
    );

  if (icon) {
    icon.textContent =
      scoutPlayerViewState.saved
        ? "★"
        : "☆";
  }

  if (label) {
    label.textContent =
      scoutPlayerViewState.saved
        ? "Player Saved"
        : "Save Player";
  }
}


async function toggleSavePlayer() {
  const button =
    scoutPlayerViewDOM.savePlayerButton;

  if (
    !button ||
    !scoutPlayerViewState.playerId
  ) {
    return;
  }

  button.classList.add(
    "is-loading"
  );

  button.disabled = true;

  const previousSavedState =
    scoutPlayerViewState.saved;

  const nextSavedState =
    !previousSavedState;

  try {
    if (
      SCOUT_PLAYER_VIEW_CONFIG
        .useMockData
    ) {
      await delay(500);
    } else if (nextSavedState) {
      await scoutApiRequest(
        SCOUT_PLAYER_VIEW_CONFIG
          .savePlayerEndpoint,
        {
          method: "POST",
          body: {
            playerId:
              scoutPlayerViewState
                .playerId
          }
        }
      );
    } else {
      await scoutApiRequest(
        `${SCOUT_PLAYER_VIEW_CONFIG.savePlayerEndpoint}/${encodeURIComponent(
          scoutPlayerViewState.playerId
        )}`,
        {
          method: "DELETE"
        }
      );
    }

    scoutPlayerViewState.saved =
      nextSavedState;

    updateSavePlayerButton();

    showScoutNotification({
      title: nextSavedState
        ? "Player saved"
        : "Player removed",
      message: nextSavedState
        ? "This player has been added to your scouting shortlist."
        : "This player has been removed from your saved list.",
      type: "success"
    });
  } catch (error) {
    console.error(
      "Unable to update saved player:",
      error
    );

    scoutPlayerViewState.saved =
      previousSavedState;

    updateSavePlayerButton();

    showScoutNotification({
      title: "Update failed",
      message:
        error.message ||
        "The saved player status could not be updated.",
      type: "error"
    });
  } finally {
    button.classList.remove(
      "is-loading"
    );

    button.disabled = false;
  }
}


/* =========================================================
   PLAYER LINKS
========================================================= */

function updatePlayerLinks(player) {
  const playerId =
    encodeURIComponent(
      player.id ||
      scoutPlayerViewState.playerId ||
      ""
    );

  const reportUrl =
    `scout-report-create.html?playerId=${playerId}`;

  if (
    scoutPlayerViewDOM
      .createReportLink
  ) {
    scoutPlayerViewDOM
      .createReportLink
      .href = reportUrl;
  }

  if (
    scoutPlayerViewDOM
      .reportsCreateLink
  ) {
    scoutPlayerViewDOM
      .reportsCreateLink
      .href = reportUrl;
  }
}


/* =========================================================
   SHARING
========================================================= */

function getPlayerShareUrl() {
  const url =
    new URL(
      window.location.href
    );

  url.searchParams.set(
    "playerId",
    scoutPlayerViewState.playerId || ""
  );

  return url.toString();
}


function openShareModal() {
  const shareUrl =
    getPlayerShareUrl();

  if (
    scoutPlayerViewDOM
      .playerShareLink
  ) {
    scoutPlayerViewDOM
      .playerShareLink
      .value = shareUrl;
  }

  openModal(
    scoutPlayerViewDOM.shareModal,
    scoutPlayerViewDOM
      .sharePlayerButton
  );
}


async function copyPlayerShareLink() {
  const shareUrl =
    getPlayerShareUrl();

  try {
    if (
      navigator.clipboard &&
      window.isSecureContext
    ) {
      await navigator.clipboard.writeText(
        shareUrl
      );
    } else {
      const temporaryInput =
        document.createElement(
          "textarea"
        );

      temporaryInput.value =
        shareUrl;

      temporaryInput.style.position =
        "fixed";

      temporaryInput.style.opacity =
        "0";

      document.body.append(
        temporaryInput
      );

      temporaryInput.select();

      document.execCommand("copy");

      temporaryInput.remove();
    }

    showScoutNotification({
      title: "Link copied",
      message:
        "The player profile link has been copied.",
      type: "success"
    });
  } catch (error) {
    console.error(
      "Unable to copy player link:",
      error
    );

    showScoutNotification({
      title: "Copy failed",
      message:
        "Please copy the profile link manually.",
      type: "error"
    });
  }
}


function shareViaWhatsApp() {
  const playerName =
    scoutPlayerViewState
      .player
      ?.fullName ||
    "Player";

  const text =
    `View ${playerName}'s FIFA Mission India player profile: ${getPlayerShareUrl()}`;

  window.open(
    `https://wa.me/?text=${encodeURIComponent(
      text
    )}`,
    "_blank",
    "noopener,noreferrer"
  );
}


function shareViaEmail() {
  const playerName =
    scoutPlayerViewState
      .player
      ?.fullName ||
    "Player";

  const subject =
    `${playerName} - FIFA Mission India Player Profile`;

  const body =
    `View this player profile:\n\n${getPlayerShareUrl()}`;

  window.location.href =
    `mailto:?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(
      body
    )}`;
}


async function useNativeShare() {
  const player =
    scoutPlayerViewState.player;

  if (!player) {
    return;
  }

  const shareData = {
    title:
      `${player.fullName} | FIFA Mission India`,
    text:
      `View ${player.fullName}'s player profile.`,
    url:
      getPlayerShareUrl()
  };

  if (navigator.share) {
    try {
      await navigator.share(
        shareData
      );
    } catch (error) {
      if (
        error.name !== "AbortError"
      ) {
        console.error(
          "Native share failed:",
          error
        );
      }
    }

    return;
  }

  await copyPlayerShareLink();
}


/* =========================================================
   TABS
========================================================= */

function activatePlayerTab(
  tabName,
  {
    focus = false
  } = {}
) {
  const selectedTab =
    scoutPlayerViewDOM.tabs.find(
      (tab) => {
        return (
          tab.dataset.playerTab ===
          tabName
        );
      }
    );

  const selectedPanel =
    scoutPlayerViewDOM.panels.find(
      (panel) => {
        return (
          panel.dataset.playerPanel ===
          tabName
        );
      }
    );

  if (
    !selectedTab ||
    !selectedPanel
  ) {
    return;
  }

  scoutPlayerViewState.activeTab =
    tabName;

  scoutPlayerViewDOM.tabs.forEach(
    (tab) => {
      const isActive =
        tab === selectedTab;

      tab.classList.toggle(
        "is-active",
        isActive
      );

      tab.setAttribute(
        "aria-selected",
        String(isActive)
      );

      tab.tabIndex =
        isActive ? 0 : -1;
    }
  );

  scoutPlayerViewDOM.panels.forEach(
    (panel) => {
      const isActive =
        panel === selectedPanel;

      panel.hidden = !isActive;

      panel.classList.toggle(
        "is-active",
        isActive
      );
    }
  );

  const pageUrl =
    new URL(
      window.location.href
    );

  pageUrl.searchParams.set(
    "tab",
    tabName
  );

  window.history.replaceState(
    {},
    "",
    pageUrl
  );

  if (focus) {
    selectedTab.focus();
  }
}


function handleTabKeyboard(event) {
  const currentIndex =
    scoutPlayerViewDOM.tabs.indexOf(
      event.currentTarget
    );

  if (currentIndex < 0) {
    return;
  }

  let nextIndex = currentIndex;

  if (
    event.key === "ArrowRight"
  ) {
    nextIndex =
      (currentIndex + 1) %
      scoutPlayerViewDOM.tabs.length;
  } else if (
    event.key === "ArrowLeft"
  ) {
    nextIndex =
      (
        currentIndex -
        1 +
        scoutPlayerViewDOM
          .tabs
          .length
      ) %
      scoutPlayerViewDOM.tabs.length;
  } else if (
    event.key === "Home"
  ) {
    nextIndex = 0;
  } else if (
    event.key === "End"
  ) {
    nextIndex =
      scoutPlayerViewDOM
        .tabs
        .length - 1;
  } else {
    return;
  }

  event.preventDefault();

  const nextTab =
    scoutPlayerViewDOM
      .tabs[nextIndex];

  activatePlayerTab(
    nextTab.dataset.playerTab,
    {
      focus: true
    }
  );
}


function initializePlayerTabs() {
  scoutPlayerViewDOM.tabs.forEach(
    (tab) => {
      tab.addEventListener(
        "click",
        () => {
          activatePlayerTab(
            tab.dataset.playerTab
          );
        }
      );

      tab.addEventListener(
        "keydown",
        handleTabKeyboard
      );
    }
  );

  const requestedTab =
    getQueryParameter("tab");

  const validRequestedTab =
    scoutPlayerViewDOM.tabs.some(
      (tab) => {
        return (
          tab.dataset.playerTab ===
          requestedTab
        );
      }
    );

  activatePlayerTab(
    validRequestedTab
      ? requestedTab
      : "overview"
  );
}


/* =========================================================
   LOGOUT
========================================================= */

function openLogoutModal() {
  openModal(
    scoutPlayerViewDOM.logoutModal,
    scoutPlayerViewDOM.logoutButton
  );
}


async function confirmScoutLogout() {
  const button =
    scoutPlayerViewDOM
      .confirmLogoutButton;

  if (!button) {
    return;
  }

  button.classList.add(
    "is-loading"
  );

  button.disabled = true;

  try {
    if (
      SCOUT_PLAYER_VIEW_CONFIG
        .useMockData
    ) {
      await delay(450);

      localStorage.removeItem(
        "scoutAccessToken"
      );

      sessionStorage.clear();
    } else {
      await scoutApiRequest(
        "/auth/logout",
        {
          method: "POST"
        }
      );
    }

    window.location.href =
      "login.html";
  } catch (error) {
    console.error(
      "Logout failed:",
      error
    );

    showScoutNotification({
      title: "Logout failed",
      message:
        error.message ||
        "You could not be logged out. Please try again.",
      type: "error"
    });

    button.classList.remove(
      "is-loading"
    );

    button.disabled = false;
  }
}


/* =========================================================
   GLOBAL KEYBOARD HANDLING
========================================================= */

function handleGlobalKeydown(event) {
  const openModalElement = [
    scoutPlayerViewDOM.shareModal,
    scoutPlayerViewDOM.mediaViewerModal,
    scoutPlayerViewDOM.logoutModal
  ].find((modal) => {
    return (
      modal &&
      !modal.hidden
    );
  });

  if (event.key === "Escape") {
    if (openModalElement) {
      if (
        openModalElement ===
        scoutPlayerViewDOM
          .mediaViewerModal
      ) {
        closeMediaViewer();
      } else {
        closeModal(
          openModalElement
        );
      }

      return;
    }

    if (
      scoutPlayerViewDOM.body
        .classList
        .contains(
          "scout-sidebar-open"
        )
    ) {
      closeScoutSidebar();
    }
  }

  if (openModalElement) {
    trapModalFocus(
      event,
      openModalElement
    );
  }
}


/* =========================================================
   EVENT BINDINGS
========================================================= */

function initializePlayerActions() {
  scoutPlayerViewDOM
    .retryButton
    ?.addEventListener(
      "click",
      loadPlayerProfile
    );

  scoutPlayerViewDOM
    .savePlayerButton
    ?.addEventListener(
      "click",
      toggleSavePlayer
    );

  scoutPlayerViewDOM
    .sharePlayerButton
    ?.addEventListener(
      "click",
      openShareModal
    );

  scoutPlayerViewDOM
    .copyPlayerLinkButton
    ?.addEventListener(
      "click",
      copyPlayerShareLink
    );

  scoutPlayerViewDOM
    .shareViaWhatsAppButton
    ?.addEventListener(
      "click",
      shareViaWhatsApp
    );

  scoutPlayerViewDOM
    .shareViaEmailButton
    ?.addEventListener(
      "click",
      shareViaEmail
    );

  scoutPlayerViewDOM
    .nativeShareButton
    ?.addEventListener(
      "click",
      useNativeShare
    );

  scoutPlayerViewDOM
    .shareModalCloseButtons
    .forEach((button) => {
      button.addEventListener(
        "click",
        () => {
          closeModal(
            scoutPlayerViewDOM
              .shareModal
          );
        }
      );
    });

  scoutPlayerViewDOM
    .mediaModalCloseButtons
    .forEach((button) => {
      button.addEventListener(
        "click",
        closeMediaViewer
      );
    });

  scoutPlayerViewDOM
    .logoutButton
    ?.addEventListener(
      "click",
      openLogoutModal
    );

  scoutPlayerViewDOM
    .logoutModalCloseButtons
    .forEach((button) => {
      button.addEventListener(
        "click",
        () => {
          closeModal(
            scoutPlayerViewDOM
              .logoutModal
          );
        }
      );
    });

  scoutPlayerViewDOM
    .confirmLogoutButton
    ?.addEventListener(
      "click",
      confirmScoutLogout
    );

  document.addEventListener(
    "keydown",
    handleGlobalKeydown
  );
}


/* =========================================================
   IMAGE FALLBACKS
========================================================= */

function initializeImageFallbacks() {
  document.addEventListener(
    "error",
    (event) => {
      const target =
        event.target;

      if (
        !(target instanceof HTMLImageElement)
      ) {
        return;
      }

      if (
        target.dataset
          .fallbackApplied === "true"
      ) {
        return;
      }

      target.dataset
        .fallbackApplied = "true";

      if (
        target ===
        scoutPlayerViewDOM
          .playerCoverImage
      ) {
        target.src =
          "images/scout-player-cover-placeholder.jpg";
      } else if (
        scoutPlayerViewDOM
          .scoutAvatarElements
          .includes(target)
      ) {
        target.src =
          "images/scout-avatar-placeholder.jpg";
      } else {
        target.src =
          "images/player-avatar-placeholder.jpg";
      }
    },
    true
  );
}


/* =========================================================
   PAGE INITIALIZATION
========================================================= */

async function initializeScoutPlayerView() {
  scoutPlayerViewState.playerId =
    getQueryParameter("playerId") ||
    getQueryParameter("id") ||
    "player-001";

  initializeScoutSidebar();
  initializePlayerTabs();
  initializePlayerActions();
  initializeImageFallbacks();

  await Promise.allSettled([
    loadScoutProfile(),
    loadPlayerProfile()
  ]);
}


/* =========================================================
   START APPLICATION
========================================================= */

if (
  document.readyState === "loading"
) {
  document.addEventListener(
    "DOMContentLoaded",
    initializeScoutPlayerView,
    {
      once: true
    }
  );
} else {
  initializeScoutPlayerView();
}


/* =========================================================
   BACKEND INTEGRATION NOTES
========================================================= */

/*
  Mr. Harsh can replace mock mode by changing:

  useMockData: false

  Expected endpoints:

  GET /api/v1/players/:playerId

  GET /api/v1/scout/profile

  POST /api/v1/scout/saved-players
  Body:
  {
    "playerId": "player-id"
  }

  DELETE /api/v1/scout/saved-players/:playerId

  POST /api/v1/auth/logout

  Expected player response may include:

  {
    "id": "player-id",
    "publicId": "FMI-PLR-2034-1028",
    "fullName": "Player Name",
    "profileImage": "https://...",
    "coverImage": "https://...",
    "dateOfBirth": "2011-08-14",
    "primaryPosition": "Midfielder",
    "currentAcademy": "Academy Name",
    "ratings": {
      "technical": 8.5,
      "tactical": 8.0,
      "physical": 7.8,
      "mental": 8.4
    },
    "recommendation": {
      "status": "recommended",
      "label": "Highly Recommended",
      "summary": "Assessment summary",
      "priority": "High",
      "confidence": "Strong"
    },
    "reports": [],
    "media": []
  }
*/


/* =========================================================
   END OF SCOUT-PLAYER-VIEW.JS
========================================================= */
