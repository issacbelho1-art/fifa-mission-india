"use strict";

/* =========================================================
   SCOUT-MATCHES.JS
   PART 1
   CONFIGURATION, STATE, DOM CACHE, UTILITIES,
   API HELPER, MOCK DATA, SIDEBAR, MODALS,
   NOTIFICATIONS AND MATCH LOADING
========================================================= */


/* =========================================================
   CONFIGURATION
========================================================= */

const SCOUT_MATCHES_CONFIG = Object.freeze({
  apiBaseUrl: "/api/v1",

  matchesEndpoint:
    "/scout/matches",

  saveMatchEndpoint:
    "/scout/matches/saved",

  logoutEndpoint:
    "/auth/logout",

  requestTimeout: 12000,

  toastDuration: 4200,

  mockDelay: 650,

  itemsPerPage: 6,

  useMockData: true
});


/* =========================================================
   APPLICATION STATE
========================================================= */

const scoutMatchesState = {
  allMatches: [],

  filteredMatches: [],

  currentPage: 1,

  itemsPerPage:
    SCOUT_MATCHES_CONFIG.itemsPerPage,

  currentView: "grid",

  activeMatchId: null,

  loading: false,

  filtersApplied: false,

  searchQuery: "",

  filters: {
    status: "all",
    competition: "all",
    ageGroup: "all",
    state: "all",
    dateFrom: "",
    dateTo: ""
  },

  sortBy: "date-asc",

  activeModal: null,

  modalTrigger: null,

  abortController: null
};


/* =========================================================
   DOM CACHE
========================================================= */

const scoutMatchesDOM = {
  body:
    document.body,

  sidebar:
    document.getElementById(
      "scoutSidebar"
    ),

  sidebarOverlay:
    document.getElementById(
      "scoutSidebarOverlay"
    ),

  sidebarClose:
    document.getElementById(
      "scoutSidebarClose"
    ),

  menuButton:
    document.getElementById(
      "scoutMenuButton"
    ),

  totalMatchesCount:
    document.getElementById(
      "totalMatchesCount"
    ),

  upcomingMatchesCount:
    document.getElementById(
      "upcomingMatchesCount"
    ),

  liveMatchesCount:
    document.getElementById(
      "liveMatchesCount"
    ),

  savedMatchesCount:
    document.getElementById(
      "savedMatchesCount"
    ),

  openCalendarViewButton:
    document.getElementById(
      "openCalendarViewButton"
    ),

  addMatchButton:
    document.getElementById(
      "addMatchButton"
    ),

  matchSearchInput:
    document.getElementById(
      "matchSearchInput"
    ),

  matchFilterToggleButton:
    document.getElementById(
      "matchFilterToggleButton"
    ),

  matchFiltersPanel:
    document.getElementById(
      "matchFiltersPanel"
    ),

  matchSortSelect:
    document.getElementById(
      "matchSortSelect"
    ),

  gridViewButton:
    document.getElementById(
      "gridViewButton"
    ),

  listViewButton:
    document.getElementById(
      "listViewButton"
    ),

  matchStatusFilter:
    document.getElementById(
      "matchStatusFilter"
    ),

  matchCompetitionFilter:
    document.getElementById(
      "matchCompetitionFilter"
    ),

  matchAgeGroupFilter:
    document.getElementById(
      "matchAgeGroupFilter"
    ),

  matchStateFilter:
    document.getElementById(
      "matchStateFilter"
    ),

  matchDateFromFilter:
    document.getElementById(
      "matchDateFromFilter"
    ),

  matchDateToFilter:
    document.getElementById(
      "matchDateToFilter"
    ),

  activeFilterSummary:
    document.getElementById(
      "activeFilterSummary"
    ),

  clearMatchFiltersButton:
    document.getElementById(
      "clearMatchFiltersButton"
    ),

  applyMatchFiltersButton:
    document.getElementById(
      "applyMatchFiltersButton"
    ),

  featuredMatchSection:
    document.getElementById(
      "featuredMatchSection"
    ),

  featuredMatchCard:
    document.getElementById(
      "featuredMatchCard"
    ),

  featuredMatchImage:
    document.getElementById(
      "featuredMatchImage"
    ),

  featuredMatchStatus:
    document.getElementById(
      "featuredMatchStatus"
    ),

  featuredMatchCompetition:
    document.getElementById(
      "featuredMatchCompetition"
    ),

  featuredMatchAgeGroup:
    document.getElementById(
      "featuredMatchAgeGroup"
    ),

  featuredHomeTeamLogo:
    document.getElementById(
      "featuredHomeTeamLogo"
    ),

  featuredHomeTeamName:
    document.getElementById(
      "featuredHomeTeamName"
    ),

  featuredAwayTeamLogo:
    document.getElementById(
      "featuredAwayTeamLogo"
    ),

  featuredAwayTeamName:
    document.getElementById(
      "featuredAwayTeamName"
    ),

  featuredMatchDate:
    document.getElementById(
      "featuredMatchDate"
    ),

  featuredMatchScore:
    document.getElementById(
      "featuredMatchScore"
    ),

  featuredMatchTime:
    document.getElementById(
      "featuredMatchTime"
    ),

  featuredMatchVenue:
    document.getElementById(
      "featuredMatchVenue"
    ),

  featuredMatchLocation:
    document.getElementById(
      "featuredMatchLocation"
    ),

  featuredSaveMatchButton:
    document.getElementById(
      "featuredSaveMatchButton"
    ),

  featuredViewMatchButton:
    document.getElementById(
      "featuredViewMatchButton"
    ),

  matchResultCount:
    document.getElementById(
      "matchResultCount"
    ),

  matchLoadingState:
    document.getElementById(
      "matchLoadingState"
    ),

  matchErrorState:
    document.getElementById(
      "matchErrorState"
    ),

  matchErrorMessage:
    document.getElementById(
      "matchErrorMessage"
    ),

  retryMatchesButton:
    document.getElementById(
      "retryMatchesButton"
    ),

  matchEmptyState:
    document.getElementById(
      "matchEmptyState"
    ),

  emptyStateClearFiltersButton:
    document.getElementById(
      "emptyStateClearFiltersButton"
    ),

  matchGrid:
    document.getElementById(
      "matchGrid"
    ),

  matchPagination:
    document.getElementById(
      "matchPagination"
    ),

  previousMatchesPageButton:
    document.getElementById(
      "previousMatchesPageButton"
    ),

  matchPaginationPages:
    document.getElementById(
      "matchPaginationPages"
    ),

  nextMatchesPageButton:
    document.getElementById(
      "nextMatchesPageButton"
    ),

  matchDetailsModal:
    document.getElementById(
      "matchDetailsModal"
    ),

  matchDetailsCloseButtons:
    Array.from(
      document.querySelectorAll(
        "[data-match-details-close]"
      )
    ),

  matchDetailsModalTitle:
    document.getElementById(
      "matchDetailsModalTitle"
    ),

  modalMatchCompetition:
    document.getElementById(
      "modalMatchCompetition"
    ),

  modalMatchStatus:
    document.getElementById(
      "modalMatchStatus"
    ),

  modalHomeTeamLogo:
    document.getElementById(
      "modalHomeTeamLogo"
    ),

  modalHomeTeamName:
    document.getElementById(
      "modalHomeTeamName"
    ),

  modalAwayTeamLogo:
    document.getElementById(
      "modalAwayTeamLogo"
    ),

  modalAwayTeamName:
    document.getElementById(
      "modalAwayTeamName"
    ),

  modalMatchDate:
    document.getElementById(
      "modalMatchDate"
    ),

  modalMatchScore:
    document.getElementById(
      "modalMatchScore"
    ),

  modalMatchTime:
    document.getElementById(
      "modalMatchTime"
    ),

  modalMatchVenue:
    document.getElementById(
      "modalMatchVenue"
    ),

  modalMatchLocation:
    document.getElementById(
      "modalMatchLocation"
    ),

  modalMatchAgeGroup:
    document.getElementById(
      "modalMatchAgeGroup"
    ),

  modalMatchSurface:
    document.getElementById(
      "modalMatchSurface"
    ),

  modalMatchDescription:
    document.getElementById(
      "modalMatchDescription"
    ),

  modalSaveMatchButton:
    document.getElementById(
      "modalSaveMatchButton"
    ),

  modalCreateReportLink:
    document.getElementById(
      "modalCreateReportLink"
    ),

  addMatchModal:
    document.getElementById(
      "addMatchModal"
    ),

  addMatchCloseButtons:
    Array.from(
      document.querySelectorAll(
        "[data-add-match-close]"
      )
    ),

  addMatchForm:
    document.getElementById(
      "addMatchForm"
    ),

  newMatchHomeTeam:
    document.getElementById(
      "newMatchHomeTeam"
    ),

  newMatchAwayTeam:
    document.getElementById(
      "newMatchAwayTeam"
    ),

  newMatchCompetition:
    document.getElementById(
      "newMatchCompetition"
    ),

  newMatchAgeGroup:
    document.getElementById(
      "newMatchAgeGroup"
    ),

  newMatchDate:
    document.getElementById(
      "newMatchDate"
    ),

  newMatchTime:
    document.getElementById(
      "newMatchTime"
    ),

  newMatchVenue:
    document.getElementById(
      "newMatchVenue"
    ),

  newMatchState:
    document.getElementById(
      "newMatchState"
    ),

  newMatchNotes:
    document.getElementById(
      "newMatchNotes"
    ),

  submitNewMatchButton:
    document.getElementById(
      "submitNewMatchButton"
    ),

  logoutButton:
    document.getElementById(
      "scoutLogoutButton"
    ),

  logoutModal:
    document.getElementById(
      "scoutLogoutModal"
    ),

  logoutModalCloseButtons:
    Array.from(
      document.querySelectorAll(
        "[data-logout-modal-close]"
      )
    ),

  confirmLogoutButton:
    document.getElementById(
      "confirmScoutLogoutButton"
    ),

  notificationButton:
    document.getElementById(
      "scoutNotificationButton"
    ),

  notificationBadge:
    document.getElementById(
      "scoutNotificationBadge"
    ),

  notificationRegion:
    document.getElementById(
      "scoutNotificationRegion"
    ),

  scoutNameElements:
    Array.from(
      document.querySelectorAll(
        "[data-scout-name]"
      )
    ),

  scoutDesignationElements:
    Array.from(
      document.querySelectorAll(
        "[data-scout-designation]"
      )
    ),

  scoutOrganizationElements:
    Array.from(
      document.querySelectorAll(
        "[data-scout-organization]"
      )
    ),

  scoutAvatarElements:
    Array.from(
      document.querySelectorAll(
        "[data-scout-avatar]"
      )
    )
};


/* =========================================================
   GENERAL UTILITIES
========================================================= */

function safeText(
  value,
  fallback = "—"
) {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return fallback;
  }

  return String(value);
}


function setText(
  element,
  value,
  fallback = "—"
) {
  if (!element) {
    return;
  }

  element.textContent =
    safeText(
      value,
      fallback
    );
}


function createElement(
  tagName,
  className = "",
  textContent = ""
) {
  const element =
    document.createElement(
      tagName
    );

  if (className) {
    element.className =
      className;
  }

  if (textContent) {
    element.textContent =
      textContent;
  }

  return element;
}


function deepClone(value) {
  return JSON.parse(
    JSON.stringify(value)
  );
}


function delay(milliseconds) {
  return new Promise(
    (resolve) => {
      window.setTimeout(
        resolve,
        milliseconds
      );
    }
  );
}


function setButtonLoading(
  button,
  loading
) {
  if (!button) {
    return;
  }

  button.classList.toggle(
    "is-loading",
    loading
  );

  button.disabled =
    Boolean(loading);
}


function normalizeString(value) {
  return safeText(
    value,
    ""
  )
    .trim()
    .toLowerCase();
}


function uniqueValues(values) {
  return Array.from(
    new Set(
      values
        .map((value) => {
          return safeText(
            value,
            ""
          ).trim();
        })
        .filter(Boolean)
    )
  );
}


function formatMatchDate(value) {
  if (!value) {
    return "Date unavailable";
  }

  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return "Date unavailable";
  }

  return new Intl.DateTimeFormat(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric"
    }
  ).format(date);
}


function formatMatchTime(value) {
  if (!value) {
    return "Time TBA";
  }

  const timeParts =
    value.split(":");

  if (
    timeParts.length < 2
  ) {
    return value;
  }

  const date =
    new Date();

  date.setHours(
    Number(timeParts[0]),
    Number(timeParts[1]),
    0,
    0
  );

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return value;
  }

  return new Intl.DateTimeFormat(
    "en-IN",
    {
      hour: "numeric",
      minute: "2-digit",
      hour12: true
    }
  ).format(date);
}


function formatAgeGroup(value) {
  const ageGroupMap = {
    u10: "U10",
    u12: "U12",
    u15: "U15",
    u17: "U17",
    u19: "U19",
    senior: "Senior"
  };

  return (
    ageGroupMap[value] ||
    safeText(
      value,
      "Open"
    ).toUpperCase()
  );
}


function getMatchScore(match) {
  if (
    match.status ===
    "completed" ||
    match.status ===
    "live"
  ) {
    return `${match.homeScore ?? 0} - ${match.awayScore ?? 0}`;
  }

  return "VS";
}


function getMatchLocation(match) {
  return [
    match.city,
    match.state
  ]
    .filter(Boolean)
    .join(", ") ||
    "Location TBA";
}


function getStatusLabel(status) {
  const statusMap = {
    upcoming: "Upcoming",
    live: "Live",
    completed: "Completed",
    cancelled: "Cancelled"
  };

  return (
    statusMap[status] ||
    "Upcoming"
  );
}


function getMatchById(matchId) {
  return scoutMatchesState
    .allMatches
    .find((match) => {
      return (
        String(match.id) ===
        String(matchId)
      );
    }) || null;
}


/* =========================================================
   API REQUEST HELPER
========================================================= */

async function scoutMatchesApiRequest(
  endpoint,
  options = {}
) {
  const controller =
    new AbortController();

  const timeoutId =
    window.setTimeout(
      () => {
        controller.abort();
      },
      SCOUT_MATCHES_CONFIG
        .requestTimeout
    );

  const headers = {
    Accept:
      "application/json",
    ...(options.headers || {})
  };

  const requestOptions = {
    method:
      options.method ||
      "GET",

    credentials:
      "include",

    headers,

    signal:
      options.signal ||
      controller.signal
  };

  if (
    options.body !== undefined
  ) {
    requestOptions.headers[
      "Content-Type"
    ] = "application/json";

    requestOptions.body =
      typeof options.body ===
      "string"
        ? options.body
        : JSON.stringify(
            options.body
          );
  }

  try {
    const response =
      await fetch(
        `${SCOUT_MATCHES_CONFIG.apiBaseUrl}${endpoint}`,
        requestOptions
      );

    const contentType =
      response.headers.get(
        "content-type"
      ) || "";

    let responseData = null;

    if (
      response.status !== 204 &&
      contentType.includes(
        "application/json"
      )
    ) {
      responseData =
        await response.json();
    }

    if (!response.ok) {
      const error =
        new Error(
          responseData?.message ||
          "The request could not be completed."
        );

      error.status =
        response.status;

      error.data =
        responseData;

      throw error;
    }

    return responseData;
  } finally {
    window.clearTimeout(
      timeoutId
    );
  }
}


/* =========================================================
   NOTIFICATIONS
========================================================= */

function showScoutMatchesNotification({
  title = "Notification",
  message = "",
  type = "info",
  duration =
    SCOUT_MATCHES_CONFIG
      .toastDuration
}) {
  if (
    !scoutMatchesDOM
      .notificationRegion
  ) {
    return;
  }

  const toast =
    createElement(
      "div",
      `scout-toast is-${type}`
    );

  toast.setAttribute(
    "role",
    type === "error"
      ? "alert"
      : "status"
  );

  const icon =
    createElement(
      "span",
      "scout-toast-icon"
    );

  const icons = {
    success: "✓",
    error: "!",
    warning: "!",
    info: "i"
  };

  icon.textContent =
    icons[type] ||
    icons.info;

  const content =
    createElement(
      "div",
      "scout-toast-content"
    );

  const heading =
    createElement(
      "strong",
      "",
      title
    );

  const description =
    createElement(
      "p",
      "",
      message
    );

  content.append(
    heading,
    description
  );

  const closeButton =
    createElement(
      "button",
      "scout-toast-close",
      "×"
    );

  closeButton.type =
    "button";

  closeButton.setAttribute(
    "aria-label",
    "Dismiss notification"
  );

  toast.append(
    icon,
    content,
    closeButton
  );

  scoutMatchesDOM
    .notificationRegion
    .append(toast);

  let removed = false;

  const removeToast = () => {
    if (removed) {
      return;
    }

    removed = true;

    toast.style.opacity =
      "0";

    toast.style.transform =
      "translateX(16px)";

    window.setTimeout(
      () => {
        toast.remove();
      },
      180
    );
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
  scoutMatchesDOM
    .body
    .classList
    .add(
      "scout-sidebar-open"
    );

  scoutMatchesDOM
    .menuButton
    ?.setAttribute(
      "aria-expanded",
      "true"
    );

  scoutMatchesDOM
    .sidebarOverlay
    ?.setAttribute(
      "aria-hidden",
      "false"
    );

  scoutMatchesDOM
    .sidebarClose
    ?.focus();
}


function closeScoutSidebar({
  restoreFocus = true
} = {}) {
  scoutMatchesDOM
    .body
    .classList
    .remove(
      "scout-sidebar-open"
    );

  scoutMatchesDOM
    .menuButton
    ?.setAttribute(
      "aria-expanded",
      "false"
    );

  scoutMatchesDOM
    .sidebarOverlay
    ?.setAttribute(
      "aria-hidden",
      "true"
    );

  if (restoreFocus) {
    scoutMatchesDOM
      .menuButton
      ?.focus();
  }
}


function initializeScoutSidebar() {
  scoutMatchesDOM
    .menuButton
    ?.addEventListener(
      "click",
      openScoutSidebar
    );

  scoutMatchesDOM
    .sidebarClose
    ?.addEventListener(
      "click",
      () => {
        closeScoutSidebar();
      }
    );

  scoutMatchesDOM
    .sidebarOverlay
    ?.addEventListener(
      "click",
      () => {
        closeScoutSidebar();
      }
    );

  window.addEventListener(
    "resize",
    () => {
      if (
        window.innerWidth >
        960
      ) {
        closeScoutSidebar({
          restoreFocus: false
        });
      }
    }
  );
}


/* =========================================================
   MODAL UTILITIES
========================================================= */

function getFocusableElements(
  container
) {
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
    return !element.hasAttribute(
      "hidden"
    );
  });
}


function openModal(
  modal,
  trigger = null
) {
  if (!modal) {
    return;
  }

  scoutMatchesState.activeModal =
    modal;

  scoutMatchesState.modalTrigger =
    trigger ||
    document.activeElement;

  modal.hidden = false;

  scoutMatchesDOM
    .body
    .classList
    .add(
      "scout-modal-open"
    );

  const focusable =
    getFocusableElements(
      modal
    );

  window.requestAnimationFrame(
    () => {
      focusable[0]?.focus();
    }
  );
}


function closeModal(modal) {
  if (!modal) {
    return;
  }

  modal.hidden = true;

  if (
    scoutMatchesState
      .activeModal === modal
  ) {
    scoutMatchesState.activeModal =
      null;
  }

  const anyModalOpen = [
    scoutMatchesDOM
      .matchDetailsModal,

    scoutMatchesDOM
      .addMatchModal,

    scoutMatchesDOM
      .logoutModal
  ].some((candidate) => {
    return (
      candidate &&
      !candidate.hidden
    );
  });

  if (!anyModalOpen) {
    scoutMatchesDOM
      .body
      .classList
      .remove(
        "scout-modal-open"
      );
  }

  if (
    scoutMatchesState
      .modalTrigger instanceof
    HTMLElement
  ) {
    scoutMatchesState
      .modalTrigger
      .focus();
  }

  scoutMatchesState.modalTrigger =
    null;
}


function trapModalFocus(
  event,
  modal
) {
  if (
    event.key !== "Tab" ||
    !modal ||
    modal.hidden
  ) {
    return;
  }

  const focusable =
    getFocusableElements(
      modal
    );

  if (!focusable.length) {
    event.preventDefault();
    return;
  }

  const first =
    focusable[0];

  const last =
    focusable[
      focusable.length - 1
    ];

  if (
    event.shiftKey &&
    document.activeElement ===
      first
  ) {
    event.preventDefault();
    last.focus();
    return;
  }

  if (
    !event.shiftKey &&
    document.activeElement ===
      last
  ) {
    event.preventDefault();
    first.focus();
  }
}


/* =========================================================
   MOCK SCOUT IDENTITY
========================================================= */

function getMockScoutIdentity() {
  return {
    name:
      "Arjun Mehta",

    designation:
      "Senior Talent Scout",

    organization:
      "FIFA Mission India",

    avatar:
      "images/scout-avatar-placeholder.jpg",

    unreadNotifications:
      3
  };
}


/* =========================================================
   MOCK MATCH DATA
========================================================= */

function getMockMatches() {
  return [
    {
      id: "match-001",

      competition:
        "National Youth League",

      ageGroup: "u15",

      status: "upcoming",

      featured: true,

      homeTeam:
        "Minerva Academy U15",

      awayTeam:
        "Reliance Foundation U15",

      homeTeamLogo:
        "images/team-logo-placeholder.png",

      awayTeamLogo:
        "images/team-logo-placeholder.png",

      date:
        "2026-07-22",

      time:
        "16:30",

      venue:
        "Minerva Football Ground",

      city:
        "Mohali",

      state:
        "Punjab",

      surface:
        "Natural Grass",

      description:
        "High-priority youth fixture featuring several nationally tracked players across midfield and attacking positions.",

      homeScore: null,

      awayScore: null,

      saved: true,

      coverImage:
        "images/match-cover-placeholder.jpg"
    },

    {
      id: "match-002",

      competition:
        "Northeast Youth Championship",

      ageGroup: "u17",

      status: "live",

      featured: false,

      homeTeam:
        "Nagaland Football Academy",

      awayTeam:
        "Shillong United Academy",

      homeTeamLogo:
        "images/team-logo-placeholder.png",

      awayTeamLogo:
        "images/team-logo-placeholder.png",

      date:
        "2026-07-19",

      time:
        "15:00",

      venue:
        "Indira Gandhi Stadium",

      city:
        "Kohima",

      state:
        "Nagaland",

      surface:
        "Artificial Turf",

      description:
        "Regional youth championship fixture with strong physical and tactical profiles from both teams.",

      homeScore: 2,

      awayScore: 1,

      saved: false,

      coverImage:
        "images/match-cover-placeholder.jpg"
    },

    {
      id: "match-003",

      competition:
        "AIFF Junior League",

      ageGroup: "u15",

      status:
        "completed",

      featured: false,

      homeTeam:
        "Bengaluru Youth FC",

      awayTeam:
        "Chennai Football Academy",

      homeTeamLogo:
        "images/team-logo-placeholder.png",

      awayTeamLogo:
        "images/team-logo-placeholder.png",

      date:
        "2026-07-17",

      time:
        "17:00",

      venue:
        "Bangalore Football Stadium",

      city:
        "Bengaluru",

      state:
        "Karnataka",

      surface:
        "Natural Grass",

      description:
        "Completed junior league fixture with strong technical performances from wide players and central midfielders.",

      homeScore: 3,

      awayScore: 2,

      saved: true,

      coverImage:
        "images/match-cover-placeholder.jpg"
    },

    {
      id: "match-004",

      competition:
        "Elite Academy Series",

      ageGroup: "u12",

      status:
        "upcoming",

      featured: false,

      homeTeam:
        "Goa Elite Academy",

      awayTeam:
        "Mumbai Future Stars",

      homeTeamLogo:
        "images/team-logo-placeholder.png",

      awayTeamLogo:
        "images/team-logo-placeholder.png",

      date:
        "2026-07-25",

      time:
        "10:30",

      venue:
        "Fatorda Training Ground",

      city:
        "Margao",

      state:
        "Goa",

      surface:
        "Natural Grass",

      description:
        "Development-focused academy fixture featuring technically gifted players in the U12 age category.",

      homeScore: null,

      awayScore: null,

      saved: false,

      coverImage:
        "images/match-cover-placeholder.jpg"
    },

    {
      id: "match-005",

      competition:
        "Delhi Youth Cup",

      ageGroup: "u17",

      status:
        "cancelled",

      featured: false,

      homeTeam:
        "Delhi United Academy",

      awayTeam:
        "Haryana Football Centre",

      homeTeamLogo:
        "images/team-logo-placeholder.png",

      awayTeamLogo:
        "images/team-logo-placeholder.png",

      date:
        "2026-07-20",

      time:
        "14:00",

      venue:
        "Ambedkar Stadium",

      city:
        "New Delhi",

      state:
        "Delhi",

      surface:
        "Natural Grass",

      description:
        "Fixture cancelled due to operational circumstances. Awaiting revised schedule confirmation.",

      homeScore: null,

      awayScore: null,

      saved: false,

      coverImage:
        "images/match-cover-placeholder.jpg"
    },

    {
      id: "match-006",

      competition:
        "National Youth League",

      ageGroup: "u19",

      status:
        "upcoming",

      featured: false,

      homeTeam:
        "Punjab Warriors U19",

      awayTeam:
        "Kerala Development XI",

      homeTeamLogo:
        "images/team-logo-placeholder.png",

      awayTeamLogo:
        "images/team-logo-placeholder.png",

      date:
        "2026-07-27",

      time:
        "18:00",

      venue:
        "Guru Nanak Stadium",

      city:
        "Ludhiana",

      state:
        "Punjab",

      surface:
        "Natural Grass",

      description:
        "National pathway fixture featuring advanced youth prospects nearing senior-level transition.",

      homeScore: null,

      awayScore: null,

      saved: true,

      coverImage:
        "images/match-cover-placeholder.jpg"
    },

    {
      id: "match-007",

      competition:
        "Eastern India Academy Cup",

      ageGroup: "u15",

      status:
        "completed",

      featured: false,

      homeTeam:
        "Kolkata Rising Stars",

      awayTeam:
        "Odisha Youth Academy",

      homeTeamLogo:
        "images/team-logo-placeholder.png",

      awayTeamLogo:
        "images/team-logo-placeholder.png",

      date:
        "2026-07-14",

      time:
        "16:00",

      venue:
        "Salt Lake Training Centre",

      city:
        "Kolkata",

      state:
        "West Bengal",

      surface:
        "Artificial Turf",

      description:
        "Competitive academy match showcasing excellent transition play and several promising defensive prospects.",

      homeScore: 1,

      awayScore: 1,

      saved: false,

      coverImage:
        "images/match-cover-placeholder.jpg"
    },

    {
      id: "match-008",

      competition:
        "Northeast Youth Championship",

      ageGroup: "u15",

      status:
        "upcoming",

      featured: false,

      homeTeam:
        "Assam Football Academy",

      awayTeam:
        "Manipur Youth Centre",

      homeTeamLogo:
        "images/team-logo-placeholder.png",

      awayTeamLogo:
        "images/team-logo-placeholder.png",

      date:
        "2026-07-29",

      time:
        "15:30",

      venue:
        "Sarusajai Sports Complex",

      city:
        "Guwahati",

      state:
        "Assam",

      surface:
        "Natural Grass",

      description:
        "Key Northeast fixture with multiple youth prospects expected to attract national-level scouting attention.",

      homeScore: null,

      awayScore: null,

      saved: false,

      coverImage:
        "images/match-cover-placeholder.jpg"
    }
  ];
}


/* =========================================================
   DATA NORMALIZATION
========================================================= */

function normalizeMatch(
  rawMatch = {}
) {
  return {
    id:
      rawMatch.id ||
      rawMatch.matchId ||
      `match-${Date.now()}-${Math.random()}`,

    competition:
      rawMatch.competition ||
      rawMatch.tournament ||
      "Independent Fixture",

    ageGroup:
      normalizeString(
        rawMatch.ageGroup ||
        "open"
      ),

    status:
      normalizeString(
        rawMatch.status ||
        "upcoming"
      ),

    featured:
      Boolean(
        rawMatch.featured
      ),

    homeTeam:
      rawMatch.homeTeam ||
      rawMatch.homeTeamName ||
      "Home Team",

    awayTeam:
      rawMatch.awayTeam ||
      rawMatch.awayTeamName ||
      "Away Team",

    homeTeamLogo:
      rawMatch.homeTeamLogo ||
      "images/team-logo-placeholder.png",

    awayTeamLogo:
      rawMatch.awayTeamLogo ||
      "images/team-logo-placeholder.png",

    date:
      rawMatch.date ||
      rawMatch.matchDate ||
      "",

    time:
      rawMatch.time ||
      rawMatch.matchTime ||
      "",

    venue:
      rawMatch.venue ||
      "Venue TBA",

    city:
      rawMatch.city ||
      "",

    state:
      rawMatch.state ||
      "",

    surface:
      rawMatch.surface ||
      "Not specified",

    description:
      rawMatch.description ||
      rawMatch.notes ||
      "No additional match information available.",

    homeScore:
      rawMatch.homeScore ??
      null,

    awayScore:
      rawMatch.awayScore ??
      null,

    saved:
      Boolean(
        rawMatch.saved
      ),

    coverImage:
      rawMatch.coverImage ||
      "images/match-cover-placeholder.jpg"
  };
}


/* =========================================================
   IDENTITY RENDERING
========================================================= */

function renderScoutIdentity(
  identity
) {
  scoutMatchesDOM
    .scoutNameElements
    .forEach((element) => {
      element.textContent =
        identity.name;
    });

  scoutMatchesDOM
    .scoutDesignationElements
    .forEach((element) => {
      element.textContent =
        identity.designation;
    });

  scoutMatchesDOM
    .scoutOrganizationElements
    .forEach((element) => {
      element.textContent =
        identity.organization;
    });

  scoutMatchesDOM
    .scoutAvatarElements
    .forEach((image) => {
      image.src =
        identity.avatar;

      image.alt =
        `${identity.name} profile`;
    });

  if (
    scoutMatchesDOM
      .notificationBadge
  ) {
    const count =
      Number(
        identity
          .unreadNotifications ||
        0
      );

    scoutMatchesDOM
      .notificationBadge
      .textContent =
      count > 99
        ? "99+"
        : String(count);

    scoutMatchesDOM
      .notificationBadge
      .hidden =
      count <= 0;
  }
}


/* =========================================================
   LOADING AND ERROR STATES
========================================================= */

function setMatchesLoadingState(
  loading
) {
  scoutMatchesState.loading =
    Boolean(loading);

  if (
    scoutMatchesDOM
      .matchLoadingState
  ) {
    scoutMatchesDOM
      .matchLoadingState
      .hidden =
      !loading;
  }

  if (loading) {
    if (
      scoutMatchesDOM
        .matchErrorState
    ) {
      scoutMatchesDOM
        .matchErrorState
        .hidden = true;
    }

    if (
      scoutMatchesDOM
        .matchEmptyState
    ) {
      scoutMatchesDOM
        .matchEmptyState
        .hidden = true;
    }

    if (
      scoutMatchesDOM
        .matchGrid
    ) {
      scoutMatchesDOM
        .matchGrid
        .hidden = true;
    }

    if (
      scoutMatchesDOM
        .matchPagination
    ) {
      scoutMatchesDOM
        .matchPagination
        .hidden = true;
    }
  }
}


function showMatchesError(
  message
) {
  setMatchesLoadingState(
    false
  );

  if (
    scoutMatchesDOM
      .matchErrorMessage
  ) {
    scoutMatchesDOM
      .matchErrorMessage
      .textContent =
      message ||
      "Matches could not be loaded.";
  }

  if (
    scoutMatchesDOM
      .matchErrorState
  ) {
    scoutMatchesDOM
      .matchErrorState
      .hidden = false;
  }

  if (
    scoutMatchesDOM
      .matchEmptyState
  ) {
    scoutMatchesDOM
      .matchEmptyState
      .hidden = true;
  }

  if (
    scoutMatchesDOM
      .matchGrid
  ) {
    scoutMatchesDOM
      .matchGrid
      .hidden = true;
  }
}


/* =========================================================
   MATCH FETCHING
========================================================= */

async function fetchMatches() {
  if (
    SCOUT_MATCHES_CONFIG
      .useMockData
  ) {
    await delay(
      SCOUT_MATCHES_CONFIG
        .mockDelay
    );

    return {
      matches:
        getMockMatches()
    };
  }

  return scoutMatchesApiRequest(
    SCOUT_MATCHES_CONFIG
      .matchesEndpoint
  );
}


async function loadMatches() {
  if (
    scoutMatchesState
      .abortController
  ) {
    scoutMatchesState
      .abortController
      .abort();
  }

  scoutMatchesState.abortController =
    new AbortController();

  setMatchesLoadingState(
    true
  );

  try {
    const response =
      await fetchMatches();

    const rawMatches =
      Array.isArray(response)
        ? response
        : response?.matches ||
          response?.data ||
          [];

    scoutMatchesState.allMatches =
      rawMatches.map(
        normalizeMatch
      );

    populateDynamicFilters();

    scoutMatchesState.currentPage =
      1;

    applyMatchFiltersAndRender();

    setMatchesLoadingState(
      false
    );
  } catch (error) {
    if (
      error.name ===
      "AbortError"
    ) {
      return;
    }

    console.error(
      "Unable to load matches:",
      error
    );

    showMatchesError(
      error.message ||
      "The match directory could not be loaded."
    );
  }
}


/* =========================================================
   DYNAMIC FILTER OPTIONS
========================================================= */

function populateSelectOptions(
  select,
  values,
  formatter = null
) {
  if (!select) {
    return;
  }

  while (
    select.options.length > 1
  ) {
    select.remove(1);
  }

  values.forEach((value) => {
    const option =
      document.createElement(
        "option"
      );

    option.value =
      value;

    option.textContent =
      formatter
        ? formatter(value)
        : value;

    select.append(option);
  });
}


function populateDynamicFilters() {
  const competitions =
    uniqueValues(
      scoutMatchesState
        .allMatches
        .map((match) => {
          return match.competition;
        })
    ).sort((a, b) => {
      return a.localeCompare(b);
    });

  const states =
    uniqueValues(
      scoutMatchesState
        .allMatches
        .map((match) => {
          return match.state;
        })
    ).sort((a, b) => {
      return a.localeCompare(b);
    });

  populateSelectOptions(
    scoutMatchesDOM
      .matchCompetitionFilter,
    competitions
  );

  populateSelectOptions(
    scoutMatchesDOM
      .matchStateFilter,
    states
  );
}


/* =========================================================
   END OF SCOUT-MATCHES.JS — PART 1
   CONTINUE DIRECTLY WITH PART 2
========================================================= */

/* =========================================================
   SCOUT-MATCHES.JS
   PART 2
   FILTERING, SORTING, RENDERING, PAGINATION,
   FEATURED MATCH, MATCH DETAILS, SAVING,
   ADD MATCH, EVENTS, LOGOUT AND INITIALIZATION
   CONTINUES DIRECTLY FROM PART 1
========================================================= */


/* =========================================================
   FILTER COLLECTION
========================================================= */

function collectMatchFilters() {
  return {
    status:
      scoutMatchesDOM
        .matchStatusFilter
        ?.value ||
      "all",

    competition:
      scoutMatchesDOM
        .matchCompetitionFilter
        ?.value ||
      "all",

    ageGroup:
      scoutMatchesDOM
        .matchAgeGroupFilter
        ?.value ||
      "all",

    state:
      scoutMatchesDOM
        .matchStateFilter
        ?.value ||
      "all",

    dateFrom:
      scoutMatchesDOM
        .matchDateFromFilter
        ?.value ||
      "",

    dateTo:
      scoutMatchesDOM
        .matchDateToFilter
        ?.value ||
      ""
  };
}


/* =========================================================
   MATCH FILTERING
========================================================= */

function matchPassesSearch(
  match,
  searchQuery
) {
  if (!searchQuery) {
    return true;
  }

  const searchableText = [
    match.homeTeam,
    match.awayTeam,
    match.competition,
    match.venue,
    match.city,
    match.state,
    match.ageGroup,
    match.status
  ]
    .join(" ")
    .toLowerCase();

  return searchableText.includes(
    searchQuery
  );
}


function matchPassesFilters(
  match,
  filters
) {
  if (
    filters.status !== "all" &&
    match.status !== filters.status
  ) {
    return false;
  }

  if (
    filters.competition !== "all" &&
    match.competition !==
      filters.competition
  ) {
    return false;
  }

  if (
    filters.ageGroup !== "all" &&
    match.ageGroup !==
      filters.ageGroup
  ) {
    return false;
  }

  if (
    filters.state !== "all" &&
    match.state !== filters.state
  ) {
    return false;
  }

  const matchDate =
    match.date
      ? new Date(
          `${match.date}T00:00:00`
        )
      : null;

  if (
    filters.dateFrom &&
    matchDate
  ) {
    const dateFrom =
      new Date(
        `${filters.dateFrom}T00:00:00`
      );

    if (matchDate < dateFrom) {
      return false;
    }
  }

  if (
    filters.dateTo &&
    matchDate
  ) {
    const dateTo =
      new Date(
        `${filters.dateTo}T23:59:59`
      );

    if (matchDate > dateTo) {
      return false;
    }
  }

  return true;
}


/* =========================================================
   MATCH SORTING
========================================================= */

function sortMatches(
  matches,
  sortBy
) {
  const sortedMatches =
    [...matches];

  sortedMatches.sort(
    (matchA, matchB) => {
      if (
        sortBy ===
        "competition"
      ) {
        return matchA
          .competition
          .localeCompare(
            matchB.competition
          );
      }

      if (sortBy === "status") {
        const statusOrder = {
          live: 0,
          upcoming: 1,
          completed: 2,
          cancelled: 3
        };

        return (
          (statusOrder[
            matchA.status
          ] ?? 99) -
          (statusOrder[
            matchB.status
          ] ?? 99)
        );
      }

      const dateA =
        new Date(
          `${matchA.date || "1970-01-01"}T${matchA.time || "00:00"}`
        ).getTime();

      const dateB =
        new Date(
          `${matchB.date || "1970-01-01"}T${matchB.time || "00:00"}`
        ).getTime();

      if (
        sortBy ===
        "date-desc"
      ) {
        return dateB - dateA;
      }

      return dateA - dateB;
    }
  );

  return sortedMatches;
}


/* =========================================================
   APPLY FILTERS AND RENDER
========================================================= */

function applyMatchFiltersAndRender() {
  const searchQuery =
    normalizeString(
      scoutMatchesDOM
        .matchSearchInput
        ?.value ||
      scoutMatchesState
        .searchQuery
    );

  scoutMatchesState.searchQuery =
    searchQuery;

  const filteredMatches =
    scoutMatchesState
      .allMatches
      .filter((match) => {
        return (
          matchPassesSearch(
            match,
            searchQuery
          ) &&
          matchPassesFilters(
            match,
            scoutMatchesState
              .filters
          )
        );
      });

  scoutMatchesState.filteredMatches =
    sortMatches(
      filteredMatches,
      scoutMatchesState.sortBy
    );

  const totalPages =
    getTotalPages();

  if (
    scoutMatchesState
      .currentPage >
    totalPages
  ) {
    scoutMatchesState.currentPage =
      Math.max(totalPages, 1);
  }

  renderMatchStatistics();
  renderFeaturedMatch();
  renderMatchResults();
  renderPagination();
  updateFilterSummary();
}


/* =========================================================
   MATCH STATISTICS
========================================================= */

function renderMatchStatistics() {
  const allMatches =
    scoutMatchesState
      .allMatches;

  const upcomingCount =
    allMatches.filter(
      (match) => {
        return (
          match.status ===
          "upcoming"
        );
      }
    ).length;

  const liveCount =
    allMatches.filter(
      (match) => {
        return (
          match.status ===
          "live"
        );
      }
    ).length;

  const savedCount =
    allMatches.filter(
      (match) => {
        return match.saved;
      }
    ).length;

  setText(
    scoutMatchesDOM
      .totalMatchesCount,
    allMatches.length,
    "0"
  );

  setText(
    scoutMatchesDOM
      .upcomingMatchesCount,
    upcomingCount,
    "0"
  );

  setText(
    scoutMatchesDOM
      .liveMatchesCount,
    liveCount,
    "0"
  );

  setText(
    scoutMatchesDOM
      .savedMatchesCount,
    savedCount,
    "0"
  );
}


/* =========================================================
   FEATURED MATCH
========================================================= */

function renderFeaturedMatch() {
  const featuredMatch =
    scoutMatchesState
      .allMatches
      .find((match) => {
        return match.featured;
      });

  if (
    !featuredMatch ||
    !scoutMatchesDOM
      .featuredMatchSection
  ) {
    if (
      scoutMatchesDOM
        .featuredMatchSection
    ) {
      scoutMatchesDOM
        .featuredMatchSection
        .hidden = true;
    }

    return;
  }

  scoutMatchesDOM
    .featuredMatchSection
    .hidden = false;

  scoutMatchesDOM
    .featuredMatchCard
    ?.setAttribute(
      "data-match-id",
      featuredMatch.id
    );

  if (
    scoutMatchesDOM
      .featuredMatchImage
  ) {
    scoutMatchesDOM
      .featuredMatchImage
      .src =
      featuredMatch.coverImage;

    scoutMatchesDOM
      .featuredMatchImage
      .alt =
      `${featuredMatch.homeTeam} versus ${featuredMatch.awayTeam}`;
  }

  setText(
    scoutMatchesDOM
      .featuredMatchCompetition,
    featuredMatch.competition
  );

  setText(
    scoutMatchesDOM
      .featuredMatchAgeGroup,
    formatAgeGroup(
      featuredMatch.ageGroup
    )
  );

  setText(
    scoutMatchesDOM
      .featuredHomeTeamName,
    featuredMatch.homeTeam
  );

  setText(
    scoutMatchesDOM
      .featuredAwayTeamName,
    featuredMatch.awayTeam
  );

  if (
    scoutMatchesDOM
      .featuredHomeTeamLogo
  ) {
    scoutMatchesDOM
      .featuredHomeTeamLogo
      .src =
      featuredMatch.homeTeamLogo;

    scoutMatchesDOM
      .featuredHomeTeamLogo
      .alt =
      `${featuredMatch.homeTeam} logo`;
  }

  if (
    scoutMatchesDOM
      .featuredAwayTeamLogo
  ) {
    scoutMatchesDOM
      .featuredAwayTeamLogo
      .src =
      featuredMatch.awayTeamLogo;

    scoutMatchesDOM
      .featuredAwayTeamLogo
      .alt =
      `${featuredMatch.awayTeam} logo`;
  }

  setText(
    scoutMatchesDOM
      .featuredMatchDate,
    formatMatchDate(
      featuredMatch.date
    )
  );

  setText(
    scoutMatchesDOM
      .featuredMatchScore,
    getMatchScore(
      featuredMatch
    )
  );

  setText(
    scoutMatchesDOM
      .featuredMatchTime,
    formatMatchTime(
      featuredMatch.time
    )
  );

  setText(
    scoutMatchesDOM
      .featuredMatchVenue,
    featuredMatch.venue
  );

  setText(
    scoutMatchesDOM
      .featuredMatchLocation,
    getMatchLocation(
      featuredMatch
    )
  );

  updateStatusElement(
    scoutMatchesDOM
      .featuredMatchStatus,
    featuredMatch.status
  );

  updateSaveButton(
    scoutMatchesDOM
      .featuredSaveMatchButton,
    featuredMatch
  );

  if (
    scoutMatchesDOM
      .featuredSaveMatchButton
  ) {
    scoutMatchesDOM
      .featuredSaveMatchButton
      .dataset.matchId =
      featuredMatch.id;
  }

  if (
    scoutMatchesDOM
      .featuredViewMatchButton
  ) {
    scoutMatchesDOM
      .featuredViewMatchButton
      .dataset.matchId =
      featuredMatch.id;
  }
}


/* =========================================================
   STATUS ELEMENT
========================================================= */

function updateStatusElement(
  element,
  status
) {
  if (!element) {
    return;
  }

  element.textContent =
    getStatusLabel(status);

  element.classList.remove(
    "is-live",
    "is-completed",
    "is-cancelled"
  );

  if (
    status === "live" ||
    status === "completed" ||
    status === "cancelled"
  ) {
    element.classList.add(
      `is-${status}`
    );
  }
}


/* =========================================================
   MATCH CARD CREATION
========================================================= */

function createMatchCard(match) {
  const card =
    createElement(
      "article",
      "scout-match-card"
    );

  card.dataset.matchId =
    match.id;

  const header =
    createElement(
      "div",
      "scout-match-card-header"
    );

  const headerCopy =
    createElement("div");

  const competition =
    createElement(
      "strong",
      "scout-match-card-competition",
      match.competition
    );

  const meta =
    createElement(
      "div",
      "scout-match-card-meta"
    );

  meta.append(
    createElement(
      "span",
      "",
      formatAgeGroup(
        match.ageGroup
      )
    ),

    createElement(
      "span",
      "",
      "•"
    ),

    createElement(
      "span",
      "",
      match.state ||
      "India"
    )
  );

  headerCopy.append(
    competition,
    meta
  );

  const statusBadge =
    createElement(
      "span",
      "scout-match-status-badge"
    );

  updateStatusElement(
    statusBadge,
    match.status
  );

  header.append(
    headerCopy,
    statusBadge
  );


  const body =
    createElement(
      "div",
      "scout-match-card-body"
    );

  const teams =
    createElement(
      "div",
      "scout-match-card-teams"
    );

  const homeTeam =
    createMatchCardTeam(
      match.homeTeam,
      match.homeTeamLogo
    );

  const score =
    createElement(
      "div",
      "scout-match-card-score"
    );

  score.append(
    createElement(
      "span",
      "",
      formatMatchDate(
        match.date
      )
    ),

    createElement(
      "strong",
      "",
      getMatchScore(match)
    ),

    createElement(
      "small",
      "",
      formatMatchTime(
        match.time
      )
    )
  );

  const awayTeam =
    createMatchCardTeam(
      match.awayTeam,
      match.awayTeamLogo
    );

  teams.append(
    homeTeam,
    score,
    awayTeam
  );


  const details =
    createElement(
      "div",
      "scout-match-card-details"
    );

  details.append(
    createMatchDetailRow(
      "📍",
      match.venue
    ),

    createMatchDetailRow(
      "🗺",
      getMatchLocation(
        match
      )
    ),

    createMatchDetailRow(
      "⚽",
      match.surface
    )
  );

  body.append(
    teams,
    details
  );


  const actions =
    createElement(
      "div",
      "scout-match-card-actions"
    );

  const saveButton =
    createElement(
      "button",
      "scout-match-save-button"
    );

  saveButton.type =
    "button";

  saveButton.dataset.matchId =
    match.id;

  saveButton.setAttribute(
    "aria-label",
    match.saved
      ? "Remove match from saved list"
      : "Save match"
  );

  updateSaveButton(
    saveButton,
    match
  );

  const viewButton =
    createElement(
      "button",
      "scout-primary-button scout-match-view-button",
      "View Match"
    );

  viewButton.type =
    "button";

  viewButton.dataset.matchId =
    match.id;

  actions.append(
    saveButton,
    viewButton
  );

  card.append(
    header,
    body,
    actions
  );

  return card;
}


function createMatchCardTeam(
  name,
  logo
) {
  const team =
    createElement(
      "div",
      "scout-match-card-team"
    );

  const image =
    document.createElement(
      "img"
    );

  image.src =
    logo ||
    "images/team-logo-placeholder.png";

  image.alt =
    `${name} logo`;

  const teamName =
    createElement(
      "strong",
      "",
      name
    );

  team.append(
    image,
    teamName
  );

  return team;
}


function createMatchDetailRow(
  icon,
  value
) {
  const row =
    createElement("span");

  const iconElement =
    createElement(
      "span",
      "",
      icon
    );

  iconElement.setAttribute(
    "aria-hidden",
    "true"
  );

  const text =
    createElement(
      "strong",
      "",
      value
    );

  row.append(
    iconElement,
    text
  );

  return row;
}


/* =========================================================
   MATCH RESULT RENDERING
========================================================= */

function getPaginatedMatches() {
  const startIndex =
    (
      scoutMatchesState
        .currentPage -
      1
    ) *
    scoutMatchesState
      .itemsPerPage;

  const endIndex =
    startIndex +
    scoutMatchesState
      .itemsPerPage;

  return scoutMatchesState
    .filteredMatches
    .slice(
      startIndex,
      endIndex
    );
}


function renderMatchResults() {
  setMatchesLoadingState(
    false
  );

  if (
    scoutMatchesDOM
      .matchErrorState
  ) {
    scoutMatchesDOM
      .matchErrorState
      .hidden = true;
  }

  const totalMatches =
    scoutMatchesState
      .filteredMatches
      .length;

  setText(
    scoutMatchesDOM
      .matchResultCount,
    `${totalMatches} ${totalMatches === 1 ? "match" : "matches"}`
  );

  if (
    totalMatches === 0
  ) {
    if (
      scoutMatchesDOM
        .matchGrid
    ) {
      scoutMatchesDOM
        .matchGrid
        .replaceChildren();

      scoutMatchesDOM
        .matchGrid
        .hidden = true;
    }

    if (
      scoutMatchesDOM
        .matchEmptyState
    ) {
      scoutMatchesDOM
        .matchEmptyState
        .hidden = false;
    }

    if (
      scoutMatchesDOM
        .matchPagination
    ) {
      scoutMatchesDOM
        .matchPagination
        .hidden = true;
    }

    return;
  }

  if (
    scoutMatchesDOM
      .matchEmptyState
  ) {
    scoutMatchesDOM
      .matchEmptyState
      .hidden = true;
  }

  if (
    !scoutMatchesDOM
      .matchGrid
  ) {
    return;
  }

  const fragment =
    document.createDocumentFragment();

  getPaginatedMatches()
    .forEach((match) => {
      fragment.append(
        createMatchCard(match)
      );
    });

  scoutMatchesDOM
    .matchGrid
    .replaceChildren(
      fragment
    );

  scoutMatchesDOM
    .matchGrid
    .hidden = false;

  scoutMatchesDOM
    .matchGrid
    .classList.toggle(
      "is-list-view",
      scoutMatchesState
        .currentView ===
        "list"
    );
}


/* =========================================================
   SAVE BUTTON DISPLAY
========================================================= */

function updateSaveButton(
  button,
  match
) {
  if (
    !button ||
    !match
  ) {
    return;
  }

  const isIconButton =
    button.classList.contains(
      "scout-match-save-button"
    );

  button.classList.toggle(
    "is-saved",
    match.saved
  );

  button.setAttribute(
    "aria-pressed",
    String(match.saved)
  );

  button.setAttribute(
    "aria-label",
    match.saved
      ? "Remove match from saved list"
      : "Save match"
  );

  if (isIconButton) {
    button.textContent =
      match.saved
        ? "★"
        : "☆";
  } else {
    button.textContent =
      match.saved
        ? "Saved"
        : "Save Match";
  }
}


/* =========================================================
   PAGINATION
========================================================= */

function getTotalPages() {
  return Math.ceil(
    scoutMatchesState
      .filteredMatches
      .length /
    scoutMatchesState
      .itemsPerPage
  );
}


function renderPagination() {
  const totalPages =
    getTotalPages();

  if (
    !scoutMatchesDOM
      .matchPagination ||
    totalPages <= 1
  ) {
    if (
      scoutMatchesDOM
        .matchPagination
    ) {
      scoutMatchesDOM
        .matchPagination
        .hidden = true;
    }

    return;
  }

  scoutMatchesDOM
    .matchPagination
    .hidden = false;

  if (
    scoutMatchesDOM
      .previousMatchesPageButton
  ) {
    scoutMatchesDOM
      .previousMatchesPageButton
      .disabled =
      scoutMatchesState
        .currentPage === 1;
  }

  if (
    scoutMatchesDOM
      .nextMatchesPageButton
  ) {
    scoutMatchesDOM
      .nextMatchesPageButton
      .disabled =
      scoutMatchesState
        .currentPage ===
      totalPages;
  }

  if (
    !scoutMatchesDOM
      .matchPaginationPages
  ) {
    return;
  }

  const fragment =
    document.createDocumentFragment();

  for (
    let page = 1;
    page <= totalPages;
    page += 1
  ) {
    const pageButton =
      createElement(
        "button",
        "scout-pagination-page",
        String(page)
      );

    pageButton.type =
      "button";

    pageButton.dataset.page =
      String(page);

    pageButton.setAttribute(
      "aria-label",
      `Go to page ${page}`
    );

    if (
      page ===
      scoutMatchesState
        .currentPage
    ) {
      pageButton.classList.add(
        "is-active"
      );

      pageButton.setAttribute(
        "aria-current",
        "page"
      );
    }

    fragment.append(
      pageButton
    );
  }

  scoutMatchesDOM
    .matchPaginationPages
    .replaceChildren(
      fragment
    );
}


function changeMatchPage(page) {
  const totalPages =
    getTotalPages();

  if (
    page < 1 ||
    page > totalPages ||
    page ===
      scoutMatchesState
        .currentPage
  ) {
    return;
  }

  scoutMatchesState.currentPage =
    page;

  renderMatchResults();
  renderPagination();

  document
    .querySelector(
      ".scout-match-results-section"
    )
    ?.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
}


/* =========================================================
   FILTER SUMMARY
========================================================= */

function updateFilterSummary() {
  if (
    !scoutMatchesDOM
      .activeFilterSummary
  ) {
    return;
  }

  const activeFilters = [];

  if (
    scoutMatchesState
      .filters.status !==
    "all"
  ) {
    activeFilters.push(
      getStatusLabel(
        scoutMatchesState
          .filters.status
      )
    );
  }

  if (
    scoutMatchesState
      .filters.competition !==
    "all"
  ) {
    activeFilters.push(
      scoutMatchesState
        .filters.competition
    );
  }

  if (
    scoutMatchesState
      .filters.ageGroup !==
    "all"
  ) {
    activeFilters.push(
      formatAgeGroup(
        scoutMatchesState
          .filters.ageGroup
      )
    );
  }

  if (
    scoutMatchesState
      .filters.state !==
    "all"
  ) {
    activeFilters.push(
      scoutMatchesState
        .filters.state
    );
  }

  if (
    scoutMatchesState
      .filters.dateFrom
  ) {
    activeFilters.push(
      `From ${formatMatchDate(
        scoutMatchesState
          .filters.dateFrom
      )}`
    );
  }

  if (
    scoutMatchesState
      .filters.dateTo
  ) {
    activeFilters.push(
      `To ${formatMatchDate(
        scoutMatchesState
          .filters.dateTo
      )}`
    );
  }

  if (
    scoutMatchesState
      .searchQuery
  ) {
    activeFilters.push(
      `Search: "${scoutMatchesState.searchQuery}"`
    );
  }

  scoutMatchesState.filtersApplied =
    activeFilters.length > 0;

  scoutMatchesDOM
    .activeFilterSummary
    .textContent =
    activeFilters.length
      ? `${activeFilters.length} active: ${activeFilters.join(", ")}`
      : "No filters applied";
}


/* =========================================================
   APPLY AND CLEAR FILTERS
========================================================= */

function applySelectedMatchFilters() {
  scoutMatchesState.filters =
    collectMatchFilters();

  scoutMatchesState.currentPage =
    1;

  applyMatchFiltersAndRender();

  showScoutMatchesNotification({
    title: "Filters applied",
    message:
      `${scoutMatchesState.filteredMatches.length} matches found.`,
    type: "success"
  });
}


function resetMatchFilterControls() {
  if (
    scoutMatchesDOM
      .matchStatusFilter
  ) {
    scoutMatchesDOM
      .matchStatusFilter
      .value = "all";
  }

  if (
    scoutMatchesDOM
      .matchCompetitionFilter
  ) {
    scoutMatchesDOM
      .matchCompetitionFilter
      .value = "all";
  }

  if (
    scoutMatchesDOM
      .matchAgeGroupFilter
  ) {
    scoutMatchesDOM
      .matchAgeGroupFilter
      .value = "all";
  }

  if (
    scoutMatchesDOM
      .matchStateFilter
  ) {
    scoutMatchesDOM
      .matchStateFilter
      .value = "all";
  }

  if (
    scoutMatchesDOM
      .matchDateFromFilter
  ) {
    scoutMatchesDOM
      .matchDateFromFilter
      .value = "";
  }

  if (
    scoutMatchesDOM
      .matchDateToFilter
  ) {
    scoutMatchesDOM
      .matchDateToFilter
      .value = "";
  }

  if (
    scoutMatchesDOM
      .matchSearchInput
  ) {
    scoutMatchesDOM
      .matchSearchInput
      .value = "";
  }
}


function clearMatchFilters({
  showNotification = true
} = {}) {
  resetMatchFilterControls();

  scoutMatchesState.filters = {
    status: "all",
    competition: "all",
    ageGroup: "all",
    state: "all",
    dateFrom: "",
    dateTo: ""
  };

  scoutMatchesState.searchQuery =
    "";

  scoutMatchesState.currentPage =
    1;

  applyMatchFiltersAndRender();

  if (showNotification) {
    showScoutMatchesNotification({
      title: "Filters cleared",
      message:
        "All available matches are now visible.",
      type: "info"
    });
  }
}


/* =========================================================
   VIEW SWITCHING
========================================================= */

function setMatchView(view) {
  scoutMatchesState.currentView =
    view === "list"
      ? "list"
      : "grid";

  scoutMatchesDOM
    .gridViewButton
    ?.classList.toggle(
      "is-active",
      scoutMatchesState
        .currentView ===
        "grid"
    );

  scoutMatchesDOM
    .listViewButton
    ?.classList.toggle(
      "is-active",
      scoutMatchesState
        .currentView ===
        "list"
    );

  scoutMatchesDOM
    .gridViewButton
    ?.setAttribute(
      "aria-pressed",
      String(
        scoutMatchesState
          .currentView ===
          "grid"
      )
    );

  scoutMatchesDOM
    .listViewButton
    ?.setAttribute(
      "aria-pressed",
      String(
        scoutMatchesState
          .currentView ===
          "list"
      )
    );

  scoutMatchesDOM
    .matchGrid
    ?.classList.toggle(
      "is-list-view",
      scoutMatchesState
        .currentView ===
        "list"
    );
}


/* =========================================================
   FILTER PANEL TOGGLE
========================================================= */

function toggleMatchFiltersPanel() {
  if (
    !scoutMatchesDOM
      .matchFiltersPanel
  ) {
    return;
  }

  const willHide =
    !scoutMatchesDOM
      .matchFiltersPanel
      .hidden;

  scoutMatchesDOM
    .matchFiltersPanel
    .hidden =
    willHide;

  scoutMatchesDOM
    .matchFilterToggleButton
    ?.setAttribute(
      "aria-expanded",
      String(!willHide)
    );
}


/* =========================================================
   MATCH DETAILS MODAL
========================================================= */

function openMatchDetails(
  matchId,
  trigger = null
) {
  const match =
    getMatchById(matchId);

  if (!match) {
    showScoutMatchesNotification({
      title: "Match unavailable",
      message:
        "This match could not be found.",
      type: "error"
    });

    return;
  }

  scoutMatchesState.activeMatchId =
    match.id;

  renderMatchDetailsModal(match);

  openModal(
    scoutMatchesDOM
      .matchDetailsModal,
    trigger
  );
}


function renderMatchDetailsModal(match) {
  setText(
    scoutMatchesDOM
      .matchDetailsModalTitle,
    `${match.homeTeam} vs ${match.awayTeam}`
  );

  setText(
    scoutMatchesDOM
      .modalMatchCompetition,
    match.competition
  );

  updateStatusElement(
    scoutMatchesDOM
      .modalMatchStatus,
    match.status
  );

  setText(
    scoutMatchesDOM
      .modalHomeTeamName,
    match.homeTeam
  );

  setText(
    scoutMatchesDOM
      .modalAwayTeamName,
    match.awayTeam
  );

  if (
    scoutMatchesDOM
      .modalHomeTeamLogo
  ) {
    scoutMatchesDOM
      .modalHomeTeamLogo
      .src =
      match.homeTeamLogo;

    scoutMatchesDOM
      .modalHomeTeamLogo
      .alt =
      `${match.homeTeam} logo`;
  }

  if (
    scoutMatchesDOM
      .modalAwayTeamLogo
  ) {
    scoutMatchesDOM
      .modalAwayTeamLogo
      .src =
      match.awayTeamLogo;

    scoutMatchesDOM
      .modalAwayTeamLogo
      .alt =
      `${match.awayTeam} logo`;
  }

  setText(
    scoutMatchesDOM
      .modalMatchDate,
    formatMatchDate(
      match.date
    )
  );

  setText(
    scoutMatchesDOM
      .modalMatchScore,
    getMatchScore(match)
  );

  setText(
    scoutMatchesDOM
      .modalMatchTime,
    formatMatchTime(
      match.time
    )
  );

  setText(
    scoutMatchesDOM
      .modalMatchVenue,
    match.venue
  );

  setText(
    scoutMatchesDOM
      .modalMatchLocation,
    getMatchLocation(match)
  );

  setText(
    scoutMatchesDOM
      .modalMatchAgeGroup,
    formatAgeGroup(
      match.ageGroup
    )
  );

  setText(
    scoutMatchesDOM
      .modalMatchSurface,
    match.surface
  );

  setText(
    scoutMatchesDOM
      .modalMatchDescription,
    match.description
  );

  updateSaveButton(
    scoutMatchesDOM
      .modalSaveMatchButton,
    match
  );

  if (
    scoutMatchesDOM
      .modalSaveMatchButton
  ) {
    scoutMatchesDOM
      .modalSaveMatchButton
      .dataset.matchId =
      match.id;
  }

  if (
    scoutMatchesDOM
      .modalCreateReportLink
  ) {
    const params =
      new URLSearchParams({
        matchId: match.id,
        homeTeam: match.homeTeam,
        awayTeam: match.awayTeam,
        competition:
          match.competition
      });

    scoutMatchesDOM
      .modalCreateReportLink
      .href =
      `scout-report-create.html?${params.toString()}`;
  }
}


function closeMatchDetailsModal() {
  closeModal(
    scoutMatchesDOM
      .matchDetailsModal
  );

  scoutMatchesState.activeMatchId =
    null;
}


/* =========================================================
   SAVE OR UNSAVE MATCH
========================================================= */

async function toggleSavedMatch(
  matchId,
  triggerButton = null
) {
  const match =
    getMatchById(matchId);

  if (!match) {
    return;
  }

  const previousSavedState =
    match.saved;

  match.saved =
    !previousSavedState;

  renderMatchStatistics();
  renderFeaturedMatch();
  renderMatchResults();

  if (
    scoutMatchesState
      .activeMatchId ===
    match.id
  ) {
    renderMatchDetailsModal(
      match
    );
  }

  setButtonLoading(
    triggerButton,
    true
  );

  try {
    if (
      SCOUT_MATCHES_CONFIG
        .useMockData
    ) {
      await delay(450);
    } else if (match.saved) {
      await scoutMatchesApiRequest(
        SCOUT_MATCHES_CONFIG
          .saveMatchEndpoint,
        {
          method: "POST",
          body: {
            matchId:
              match.id
          }
        }
      );
    } else {
      await scoutMatchesApiRequest(
        `${SCOUT_MATCHES_CONFIG.saveMatchEndpoint}/${encodeURIComponent(match.id)}`,
        {
          method: "DELETE"
        }
      );
    }

    showScoutMatchesNotification({
      title: match.saved
        ? "Match saved"
        : "Match removed",
      message: match.saved
        ? "The fixture was added to your scouting watchlist."
        : "The fixture was removed from your watchlist.",
      type: "success"
    });
  } catch (error) {
    match.saved =
      previousSavedState;

    renderMatchStatistics();
    renderFeaturedMatch();
    renderMatchResults();

    if (
      scoutMatchesState
        .activeMatchId ===
      match.id
    ) {
      renderMatchDetailsModal(
        match
      );
    }

    console.error(
      "Unable to update saved match:",
      error
    );

    showScoutMatchesNotification({
      title: "Watchlist update failed",
      message:
        error.message ||
        "The saved match status could not be updated.",
      type: "error"
    });
  } finally {
    setButtonLoading(
      triggerButton,
      false
    );

    const latestMatch =
      getMatchById(matchId);

    updateSaveButton(
      triggerButton,
      latestMatch
    );
  }
}


/* =========================================================
   ADD MATCH MODAL
========================================================= */

function openAddMatchModal() {
  scoutMatchesDOM
    .addMatchForm
    ?.reset();

  clearAddMatchErrors();

  if (
    scoutMatchesDOM
      .newMatchDate
  ) {
    const today =
      new Date();

    const year =
      today.getFullYear();

    const month =
      String(
        today.getMonth() + 1
      ).padStart(2, "0");

    const day =
      String(
        today.getDate()
      ).padStart(2, "0");

    scoutMatchesDOM
      .newMatchDate
      .min =
      `${year}-${month}-${day}`;
  }

  openModal(
    scoutMatchesDOM
      .addMatchModal,
    scoutMatchesDOM
      .addMatchButton
  );
}


function closeAddMatchModal() {
  closeModal(
    scoutMatchesDOM
      .addMatchModal
  );

  scoutMatchesDOM
    .addMatchForm
    ?.reset();

  clearAddMatchErrors();
}


/* =========================================================
   ADD MATCH VALIDATION
========================================================= */

function getAddMatchErrorElement(
  field
) {
  if (!field?.id) {
    return null;
  }

  return document.querySelector(
    `[data-error-for="${field.id}"]`
  );
}


function setAddMatchFieldError(
  field,
  message
) {
  if (!field) {
    return;
  }

  field
    .closest(
      ".scout-form-group"
    )
    ?.classList.add(
      "is-invalid"
    );

  field.setAttribute(
    "aria-invalid",
    "true"
  );

  const errorElement =
    getAddMatchErrorElement(
      field
    );

  if (errorElement) {
    errorElement.textContent =
      message;
  }
}


function clearAddMatchFieldError(
  field
) {
  if (!field) {
    return;
  }

  field
    .closest(
      ".scout-form-group"
    )
    ?.classList.remove(
      "is-invalid"
    );

  field.removeAttribute(
    "aria-invalid"
  );

  const errorElement =
    getAddMatchErrorElement(
      field
    );

  if (errorElement) {
    errorElement.textContent =
      "";
  }
}


function clearAddMatchErrors() {
  [
    scoutMatchesDOM
      .newMatchHomeTeam,

    scoutMatchesDOM
      .newMatchAwayTeam,

    scoutMatchesDOM
      .newMatchCompetition,

    scoutMatchesDOM
      .newMatchDate
  ].forEach(
    clearAddMatchFieldError
  );
}


function validateAddMatchForm() {
  clearAddMatchErrors();

  let valid = true;
  let firstInvalidField =
    null;

  const requiredFields = [
    {
      field:
        scoutMatchesDOM
          .newMatchHomeTeam,
      message:
        "Home team is required."
    },

    {
      field:
        scoutMatchesDOM
          .newMatchAwayTeam,
      message:
        "Away team is required."
    },

    {
      field:
        scoutMatchesDOM
          .newMatchCompetition,
      message:
        "Competition is required."
    },

    {
      field:
        scoutMatchesDOM
          .newMatchDate,
      message:
        "Match date is required."
    }
  ];

  requiredFields.forEach(
    ({ field, message }) => {
      if (
        field?.value.trim()
      ) {
        return;
      }

      setAddMatchFieldError(
        field,
        message
      );

      firstInvalidField ||=
        field;

      valid = false;
    }
  );

  const homeTeam =
    normalizeString(
      scoutMatchesDOM
        .newMatchHomeTeam
        ?.value
    );

  const awayTeam =
    normalizeString(
      scoutMatchesDOM
        .newMatchAwayTeam
        ?.value
    );

  if (
    homeTeam &&
    awayTeam &&
    homeTeam === awayTeam
  ) {
    setAddMatchFieldError(
      scoutMatchesDOM
        .newMatchAwayTeam,
      "Home and away teams must be different."
    );

    firstInvalidField ||=
      scoutMatchesDOM
        .newMatchAwayTeam;

    valid = false;
  }

  firstInvalidField?.focus();

  return valid;
}


/* =========================================================
   COLLECT NEW MATCH
========================================================= */

function collectNewMatchFormData() {
  return normalizeMatch({
    id:
      `match-${Date.now()}`,

    competition:
      scoutMatchesDOM
        .newMatchCompetition
        ?.value
        .trim(),

    ageGroup:
      scoutMatchesDOM
        .newMatchAgeGroup
        ?.value ||
      "open",

    status:
      "upcoming",

    featured:
      false,

    homeTeam:
      scoutMatchesDOM
        .newMatchHomeTeam
        ?.value
        .trim(),

    awayTeam:
      scoutMatchesDOM
        .newMatchAwayTeam
        ?.value
        .trim(),

    date:
      scoutMatchesDOM
        .newMatchDate
        ?.value,

    time:
      scoutMatchesDOM
        .newMatchTime
        ?.value,

    venue:
      scoutMatchesDOM
        .newMatchVenue
        ?.value
        .trim() ||
      "Venue TBA",

    city: "",

    state:
      scoutMatchesDOM
        .newMatchState
        ?.value
        .trim(),

    surface:
      "Not specified",

    description:
      scoutMatchesDOM
        .newMatchNotes
        ?.value
        .trim() ||
      "Match added by scout.",

    saved:
      true
  });
}


/* =========================================================
   SUBMIT NEW MATCH
========================================================= */

async function submitNewMatch(
  event
) {
  event.preventDefault();

  if (!validateAddMatchForm()) {
    showScoutMatchesNotification({
      title: "Check match details",
      message:
        "Complete the required fields before adding the match.",
      type: "error"
    });

    return;
  }

  const newMatch =
    collectNewMatchFormData();

  setButtonLoading(
    scoutMatchesDOM
      .submitNewMatchButton,
    true
  );

  try {
    let savedMatch =
      newMatch;

    if (
      SCOUT_MATCHES_CONFIG
        .useMockData
    ) {
      await delay(700);
    } else {
      const response =
        await scoutMatchesApiRequest(
          SCOUT_MATCHES_CONFIG
            .matchesEndpoint,
          {
            method: "POST",
            body: newMatch
          }
        );

      savedMatch =
        normalizeMatch(
          response?.match ||
          response?.data ||
          response ||
          newMatch
        );
    }

    scoutMatchesState
      .allMatches
      .push(savedMatch);

    populateDynamicFilters();

    closeAddMatchModal();

    scoutMatchesState.filters = {
      status: "all",
      competition: "all",
      ageGroup: "all",
      state: "all",
      dateFrom: "",
      dateTo: ""
    };

    resetMatchFilterControls();

    scoutMatchesState.currentPage =
      1;

    applyMatchFiltersAndRender();

    showScoutMatchesNotification({
      title: "Match added",
      message:
        `${savedMatch.homeTeam} vs ${savedMatch.awayTeam} was added successfully.`,
      type: "success"
    });
  } catch (error) {
    console.error(
      "Unable to add match:",
      error
    );

    showScoutMatchesNotification({
      title: "Match could not be added",
      message:
        error.message ||
        "The fixture could not be saved.",
      type: "error"
    });
  } finally {
    setButtonLoading(
      scoutMatchesDOM
        .submitNewMatchButton,
      false
    );
  }
}


/* =========================================================
   CALENDAR VIEW
========================================================= */

function openCalendarView() {
  const upcomingMatches =
    scoutMatchesState
      .allMatches
      .filter((match) => {
        return (
          match.status ===
          "upcoming"
        );
      })
      .sort((matchA, matchB) => {
        return (
          new Date(
            `${matchA.date}T${matchA.time || "00:00"}`
          ) -
          new Date(
            `${matchB.date}T${matchB.time || "00:00"}`
          )
        );
      });

  if (
    upcomingMatches.length === 0
  ) {
    showScoutMatchesNotification({
      title: "No upcoming matches",
      message:
        "There are no scheduled fixtures to display.",
      type: "info"
    });

    return;
  }

  const calendarSummary =
    upcomingMatches
      .slice(0, 8)
      .map((match) => {
        return (
          `${formatMatchDate(match.date)} — ` +
          `${match.homeTeam} vs ${match.awayTeam}`
        );
      })
      .join("\n");

  window.alert(
    `Upcoming Match Calendar\n\n${calendarSummary}`
  );
}


/* =========================================================
   NOTIFICATION BUTTON
========================================================= */

function handleNotificationButton() {
  showScoutMatchesNotification({
    title: "Notifications",
    message:
      "Your complete notification centre will be connected during backend integration.",
    type: "info"
  });
}


/* =========================================================
   LOGOUT
========================================================= */

function openLogoutModal() {
  openModal(
    scoutMatchesDOM
      .logoutModal,
    scoutMatchesDOM
      .logoutButton
  );
}


function closeLogoutModal() {
  closeModal(
    scoutMatchesDOM
      .logoutModal
  );
}


async function confirmScoutLogout() {
  setButtonLoading(
    scoutMatchesDOM
      .confirmLogoutButton,
    true
  );

  try {
    if (
      SCOUT_MATCHES_CONFIG
        .useMockData
    ) {
      await delay(550);

      localStorage.removeItem(
        "scoutAccessToken"
      );

      sessionStorage.clear();
    } else {
      await scoutMatchesApiRequest(
        SCOUT_MATCHES_CONFIG
          .logoutEndpoint,
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

    showScoutMatchesNotification({
      title: "Logout failed",
      message:
        error.message ||
        "You could not be logged out.",
      type: "error"
    });

    setButtonLoading(
      scoutMatchesDOM
        .confirmLogoutButton,
      false
    );
  }
}


/* =========================================================
   IMAGE FALLBACKS
========================================================= */

function initializeImageFallbacks() {
  document.addEventListener(
    "error",
    (event) => {
      const image =
        event.target;

      if (
        !(
          image instanceof
          HTMLImageElement
        )
      ) {
        return;
      }

      if (
        image.dataset
          .fallbackApplied ===
        "true"
      ) {
        return;
      }

      image.dataset
        .fallbackApplied =
        "true";

      if (
        image ===
        scoutMatchesDOM
          .featuredMatchImage
      ) {
        image.src =
          "images/match-cover-placeholder.jpg";
      } else {
        image.src =
          "images/team-logo-placeholder.png";
      }
    },
    true
  );
}


/* =========================================================
   MATCH GRID DELEGATION
========================================================= */

function handleMatchGridClick(
  event
) {
  const saveButton =
    event.target.closest(
      ".scout-match-save-button"
    );

  if (saveButton) {
    toggleSavedMatch(
      saveButton.dataset.matchId,
      saveButton
    );

    return;
  }

  const viewButton =
    event.target.closest(
      ".scout-match-view-button"
    );

  if (viewButton) {
    openMatchDetails(
      viewButton.dataset.matchId,
      viewButton
    );
  }
}


/* =========================================================
   SEARCH DEBOUNCE
========================================================= */

function createDebounce(
  callback,
  delayTime
) {
  let timeoutId = null;

  return (...args) => {
    window.clearTimeout(
      timeoutId
    );

    timeoutId =
      window.setTimeout(
        () => {
          callback(...args);
        },
        delayTime
      );
  };
}


const handleSearchInput =
  createDebounce(() => {
    scoutMatchesState
      .currentPage = 1;

    applyMatchFiltersAndRender();
  }, 250);


/* =========================================================
   GLOBAL KEYBOARD EVENTS
========================================================= */

function handleGlobalKeydown(
  event
) {
  const activeModal =
    scoutMatchesState
      .activeModal;

  if (
    event.key === "Escape"
  ) {
    if (
      activeModal ===
      scoutMatchesDOM
        .matchDetailsModal
    ) {
      closeMatchDetailsModal();
      return;
    }

    if (
      activeModal ===
      scoutMatchesDOM
        .addMatchModal
    ) {
      closeAddMatchModal();
      return;
    }

    if (
      activeModal ===
      scoutMatchesDOM
        .logoutModal
    ) {
      closeLogoutModal();
      return;
    }

    if (
      scoutMatchesDOM
        .body
        .classList
        .contains(
          "scout-sidebar-open"
        )
    ) {
      closeScoutSidebar();
      return;
    }
  }

  if (activeModal) {
    trapModalFocus(
      event,
      activeModal
    );
  }
}


/* =========================================================
   INITIALIZE FILTER EVENTS
========================================================= */

function initializeFilterEvents() {
  scoutMatchesDOM
    .matchSearchInput
    ?.addEventListener(
      "input",
      handleSearchInput
    );

  scoutMatchesDOM
    .matchFilterToggleButton
    ?.addEventListener(
      "click",
      toggleMatchFiltersPanel
    );

  scoutMatchesDOM
    .applyMatchFiltersButton
    ?.addEventListener(
      "click",
      applySelectedMatchFilters
    );

  scoutMatchesDOM
    .clearMatchFiltersButton
    ?.addEventListener(
      "click",
      () => {
        clearMatchFilters();
      }
    );

  scoutMatchesDOM
    .emptyStateClearFiltersButton
    ?.addEventListener(
      "click",
      () => {
        clearMatchFilters();
      }
    );

  scoutMatchesDOM
    .matchSortSelect
    ?.addEventListener(
      "change",
      (event) => {
        scoutMatchesState.sortBy =
          event.target.value;

        scoutMatchesState
          .currentPage = 1;

        applyMatchFiltersAndRender();
      }
    );

  scoutMatchesDOM
    .gridViewButton
    ?.addEventListener(
      "click",
      () => {
        setMatchView(
          "grid"
        );
      }
    );

  scoutMatchesDOM
    .listViewButton
    ?.addEventListener(
      "click",
      () => {
        setMatchView(
          "list"
        );
      }
    );
}


/* =========================================================
   INITIALIZE MATCH EVENTS
========================================================= */

function initializeMatchEvents() {
  scoutMatchesDOM
    .matchGrid
    ?.addEventListener(
      "click",
      handleMatchGridClick
    );

  scoutMatchesDOM
    .featuredViewMatchButton
    ?.addEventListener(
      "click",
      (event) => {
        openMatchDetails(
          event.currentTarget
            .dataset.matchId,
          event.currentTarget
        );
      }
    );

  scoutMatchesDOM
    .featuredSaveMatchButton
    ?.addEventListener(
      "click",
      (event) => {
        toggleSavedMatch(
          event.currentTarget
            .dataset.matchId,
          event.currentTarget
        );
      }
    );

  scoutMatchesDOM
    .modalSaveMatchButton
    ?.addEventListener(
      "click",
      (event) => {
        toggleSavedMatch(
          event.currentTarget
            .dataset.matchId,
          event.currentTarget
        );
      }
    );

  scoutMatchesDOM
    .matchDetailsCloseButtons
    .forEach((button) => {
      button.addEventListener(
        "click",
        closeMatchDetailsModal
      );
    });

  scoutMatchesDOM
    .retryMatchesButton
    ?.addEventListener(
      "click",
      loadMatches
    );

  scoutMatchesDOM
    .previousMatchesPageButton
    ?.addEventListener(
      "click",
      () => {
        changeMatchPage(
          scoutMatchesState
            .currentPage -
          1
        );
      }
    );

  scoutMatchesDOM
    .nextMatchesPageButton
    ?.addEventListener(
      "click",
      () => {
        changeMatchPage(
          scoutMatchesState
            .currentPage +
          1
        );
      }
    );

  scoutMatchesDOM
    .matchPaginationPages
    ?.addEventListener(
      "click",
      (event) => {
        const pageButton =
          event.target.closest(
            ".scout-pagination-page"
          );

        if (!pageButton) {
          return;
        }

        changeMatchPage(
          Number(
            pageButton
              .dataset.page
          )
        );
      }
    );
}


/* =========================================================
   INITIALIZE ADD MATCH EVENTS
========================================================= */

function initializeAddMatchEvents() {
  scoutMatchesDOM
    .addMatchButton
    ?.addEventListener(
      "click",
      openAddMatchModal
    );

  scoutMatchesDOM
    .addMatchCloseButtons
    .forEach((button) => {
      button.addEventListener(
        "click",
        closeAddMatchModal
      );
    });

  scoutMatchesDOM
    .addMatchForm
    ?.addEventListener(
      "submit",
      submitNewMatch
    );

  [
    scoutMatchesDOM
      .newMatchHomeTeam,

    scoutMatchesDOM
      .newMatchAwayTeam,

    scoutMatchesDOM
      .newMatchCompetition,

    scoutMatchesDOM
      .newMatchDate
  ].forEach((field) => {
    field?.addEventListener(
      "input",
      () => {
        clearAddMatchFieldError(
          field
        );
      }
    );
  });
}


/* =========================================================
   INITIALIZE GENERAL ACTIONS
========================================================= */

function initializeGeneralEvents() {
  scoutMatchesDOM
    .openCalendarViewButton
    ?.addEventListener(
      "click",
      openCalendarView
    );

  scoutMatchesDOM
    .notificationButton
    ?.addEventListener(
      "click",
      handleNotificationButton
    );

  scoutMatchesDOM
    .logoutButton
    ?.addEventListener(
      "click",
      openLogoutModal
    );

  scoutMatchesDOM
    .logoutModalCloseButtons
    .forEach((button) => {
      button.addEventListener(
        "click",
        closeLogoutModal
      );
    });

  scoutMatchesDOM
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
   INITIALIZATION
========================================================= */

async function initializeScoutMatchesPage() {
  initializeScoutSidebar();
  initializeFilterEvents();
  initializeMatchEvents();
  initializeAddMatchEvents();
  initializeGeneralEvents();
  initializeImageFallbacks();

  renderScoutIdentity(
    getMockScoutIdentity()
  );

  setMatchView("grid");

  await loadMatches();
}


/* =========================================================
   START APPLICATION
========================================================= */

if (
  document.readyState ===
  "loading"
) {
  document.addEventListener(
    "DOMContentLoaded",
    initializeScoutMatchesPage,
    {
      once: true
    }
  );
} else {
  initializeScoutMatchesPage();
}


/* =========================================================
   BACKEND INTEGRATION NOTES
========================================================= */

/*
  Change:

  useMockData: false


  Expected endpoints:


  GET /api/v1/scout/matches

  Expected response:

  {
    "matches": [
      {
        "id": "match-id",
        "competition": "National Youth League",
        "ageGroup": "u15",
        "status": "upcoming",
        "featured": false,
        "homeTeam": "Home Team",
        "awayTeam": "Away Team",
        "homeTeamLogo": "/uploads/teams/home.png",
        "awayTeamLogo": "/uploads/teams/away.png",
        "date": "2026-07-22",
        "time": "16:30",
        "venue": "Football Ground",
        "city": "Mohali",
        "state": "Punjab",
        "surface": "Natural Grass",
        "description": "Match information",
        "homeScore": null,
        "awayScore": null,
        "saved": false,
        "coverImage": "/uploads/matches/cover.jpg"
      }
    ]
  }


  POST /api/v1/scout/matches

  Body:

  {
    "competition": "Tournament",
    "ageGroup": "u15",
    "status": "upcoming",
    "homeTeam": "Home Team",
    "awayTeam": "Away Team",
    "date": "2026-07-22",
    "time": "16:30",
    "venue": "Venue",
    "state": "State",
    "description": "Notes"
  }


  POST /api/v1/scout/matches/saved

  Body:

  {
    "matchId": "match-id"
  }


  DELETE /api/v1/scout/matches/saved/:matchId


  POST /api/v1/auth/logout
*/


/* =========================================================
   END OF SCOUT-MATCHES.JS
========================================================= */