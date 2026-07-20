"use strict";

/* =========================================================
   SCOUT-ACADEMIES.JS
   PART 1
   CONFIGURATION, STATE, DOM CACHE, UTILITIES,
   API HELPER, NOTIFICATIONS, SIDEBAR, MODALS,
   MOCK DATA AND DATA LOADING
========================================================= */


/* =========================================================
   CONFIGURATION
========================================================= */

const SCOUT_ACADEMIES_CONFIG = Object.freeze({
  apiBaseUrl: "/api/v1",

  academiesEndpoint:
    "/scout/academies",

  savedAcademiesEndpoint:
    "/scout/academies/saved",

  recommendationsEndpoint:
    "/scout/academies/recommendations",

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

const scoutAcademiesState = {
  allAcademies: [],

  filteredAcademies: [],

  currentPage: 1,

  itemsPerPage:
    SCOUT_ACADEMIES_CONFIG.itemsPerPage,

  currentView: "grid",

  activeAcademyId: null,

  activeModal: null,

  modalTrigger: null,

  loading: false,

  filtersApplied: false,

  searchQuery: "",

  sortBy: "recommended",

  filters: {
    state: "all",
    type: "all",
    ageGroup: "all",
    verification: "all",
    residential: "all",
    rating: "all"
  },

  abortController: null
};


/* =========================================================
   DOM CACHE
========================================================= */

const scoutAcademiesDOM = {
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

  totalAcademiesCount:
    document.getElementById(
      "totalAcademiesCount"
    ),

  verifiedAcademiesCount:
    document.getElementById(
      "verifiedAcademiesCount"
    ),

  academyPlayersCount:
    document.getElementById(
      "academyPlayersCount"
    ),

  savedAcademiesCount:
    document.getElementById(
      "savedAcademiesCount"
    ),

  openAcademyMapButton:
    document.getElementById(
      "openAcademyMapButton"
    ),

  recommendAcademyButton:
    document.getElementById(
      "recommendAcademyButton"
    ),

  academySearchInput:
    document.getElementById(
      "academySearchInput"
    ),

  academyFilterToggleButton:
    document.getElementById(
      "academyFilterToggleButton"
    ),

  academyFiltersPanel:
    document.getElementById(
      "academyFiltersPanel"
    ),

  academySortSelect:
    document.getElementById(
      "academySortSelect"
    ),

  academyGridViewButton:
    document.getElementById(
      "academyGridViewButton"
    ),

  academyListViewButton:
    document.getElementById(
      "academyListViewButton"
    ),

  academyStateFilter:
    document.getElementById(
      "academyStateFilter"
    ),

  academyTypeFilter:
    document.getElementById(
      "academyTypeFilter"
    ),

  academyAgeGroupFilter:
    document.getElementById(
      "academyAgeGroupFilter"
    ),

  academyVerificationFilter:
    document.getElementById(
      "academyVerificationFilter"
    ),

  academyResidentialFilter:
    document.getElementById(
      "academyResidentialFilter"
    ),

  academyRatingFilter:
    document.getElementById(
      "academyRatingFilter"
    ),

  academyActiveFilterSummary:
    document.getElementById(
      "academyActiveFilterSummary"
    ),

  clearAcademyFiltersButton:
    document.getElementById(
      "clearAcademyFiltersButton"
    ),

  applyAcademyFiltersButton:
    document.getElementById(
      "applyAcademyFiltersButton"
    ),

  featuredAcademySection:
    document.getElementById(
      "featuredAcademySection"
    ),

  featuredAcademyCard:
    document.getElementById(
      "featuredAcademyCard"
    ),

  featuredAcademyImage:
    document.getElementById(
      "featuredAcademyImage"
    ),

  featuredAcademyLogo:
    document.getElementById(
      "featuredAcademyLogo"
    ),

  featuredAcademyVerificationBadge:
    document.getElementById(
      "featuredAcademyVerificationBadge"
    ),

  featuredAcademyType:
    document.getElementById(
      "featuredAcademyType"
    ),

  featuredAcademyName:
    document.getElementById(
      "featuredAcademyName"
    ),

  featuredAcademyLocation:
    document.getElementById(
      "featuredAcademyLocation"
    ),

  featuredAcademyDescription:
    document.getElementById(
      "featuredAcademyDescription"
    ),

  featuredAcademyRating:
    document.getElementById(
      "featuredAcademyRating"
    ),

  featuredAcademyPlayers:
    document.getElementById(
      "featuredAcademyPlayers"
    ),

  featuredAcademyCoaches:
    document.getElementById(
      "featuredAcademyCoaches"
    ),

  featuredAcademyEstablished:
    document.getElementById(
      "featuredAcademyEstablished"
    ),

  featuredAcademyProgrammes:
    document.getElementById(
      "featuredAcademyProgrammes"
    ),

  featuredSaveAcademyButton:
    document.getElementById(
      "featuredSaveAcademyButton"
    ),

  featuredViewAcademyButton:
    document.getElementById(
      "featuredViewAcademyButton"
    ),

  academyResultCount:
    document.getElementById(
      "academyResultCount"
    ),

  academyLoadingState:
    document.getElementById(
      "academyLoadingState"
    ),

  academyErrorState:
    document.getElementById(
      "academyErrorState"
    ),

  academyErrorMessage:
    document.getElementById(
      "academyErrorMessage"
    ),

  retryAcademiesButton:
    document.getElementById(
      "retryAcademiesButton"
    ),

  academyEmptyState:
    document.getElementById(
      "academyEmptyState"
    ),

  emptyStateClearAcademyFiltersButton:
    document.getElementById(
      "emptyStateClearAcademyFiltersButton"
    ),

  academyGrid:
    document.getElementById(
      "academyGrid"
    ),

  academyPagination:
    document.getElementById(
      "academyPagination"
    ),

  previousAcademiesPageButton:
    document.getElementById(
      "previousAcademiesPageButton"
    ),

  academyPaginationPages:
    document.getElementById(
      "academyPaginationPages"
    ),

  nextAcademiesPageButton:
    document.getElementById(
      "nextAcademiesPageButton"
    ),

  academyDetailsModal:
    document.getElementById(
      "academyDetailsModal"
    ),

  academyDetailsCloseButtons:
    Array.from(
      document.querySelectorAll(
        "[data-academy-details-close]"
      )
    ),

  academyDetailsModalTitle:
    document.getElementById(
      "academyDetailsModalTitle"
    ),

  modalAcademyCover:
    document.getElementById(
      "modalAcademyCover"
    ),

  modalAcademyVerification:
    document.getElementById(
      "modalAcademyVerification"
    ),

  modalAcademyLogo:
    document.getElementById(
      "modalAcademyLogo"
    ),

  modalAcademyType:
    document.getElementById(
      "modalAcademyType"
    ),

  modalAcademyName:
    document.getElementById(
      "modalAcademyName"
    ),

  modalAcademyLocation:
    document.getElementById(
      "modalAcademyLocation"
    ),

  modalAcademyDescription:
    document.getElementById(
      "modalAcademyDescription"
    ),

  modalAcademyRating:
    document.getElementById(
      "modalAcademyRating"
    ),

  modalAcademyPlayers:
    document.getElementById(
      "modalAcademyPlayers"
    ),

  modalAcademyCoaches:
    document.getElementById(
      "modalAcademyCoaches"
    ),

  modalAcademyEstablished:
    document.getElementById(
      "modalAcademyEstablished"
    ),

  modalAcademyResidential:
    document.getElementById(
      "modalAcademyResidential"
    ),

  modalAcademySurface:
    document.getElementById(
      "modalAcademySurface"
    ),

  modalAcademyProgrammes:
    document.getElementById(
      "modalAcademyProgrammes"
    ),

  modalAcademyFacilities:
    document.getElementById(
      "modalAcademyFacilities"
    ),

  modalAcademyEmail:
    document.getElementById(
      "modalAcademyEmail"
    ),

  modalAcademyPhone:
    document.getElementById(
      "modalAcademyPhone"
    ),

  modalAcademyWebsite:
    document.getElementById(
      "modalAcademyWebsite"
    ),

  modalSaveAcademyButton:
    document.getElementById(
      "modalSaveAcademyButton"
    ),

  modalViewAcademyPlayersLink:
    document.getElementById(
      "modalViewAcademyPlayersLink"
    ),

  recommendAcademyModal:
    document.getElementById(
      "recommendAcademyModal"
    ),

  recommendAcademyCloseButtons:
    Array.from(
      document.querySelectorAll(
        "[data-recommend-academy-close]"
      )
    ),

  recommendAcademyForm:
    document.getElementById(
      "recommendAcademyForm"
    ),

  recommendedAcademyName:
    document.getElementById(
      "recommendedAcademyName"
    ),

  recommendedAcademyType:
    document.getElementById(
      "recommendedAcademyType"
    ),

  recommendedAcademyCity:
    document.getElementById(
      "recommendedAcademyCity"
    ),

  recommendedAcademyState:
    document.getElementById(
      "recommendedAcademyState"
    ),

  recommendedAcademyContact:
    document.getElementById(
      "recommendedAcademyContact"
    ),

  recommendedAcademyEmail:
    document.getElementById(
      "recommendedAcademyEmail"
    ),

  recommendedAcademyPhone:
    document.getElementById(
      "recommendedAcademyPhone"
    ),

  recommendedAcademyWebsite:
    document.getElementById(
      "recommendedAcademyWebsite"
    ),

  recommendedAcademyReason:
    document.getElementById(
      "recommendedAcademyReason"
    ),

  submitAcademyRecommendationButton:
    document.getElementById(
      "submitAcademyRecommendationButton"
    ),

  academyMapModal:
    document.getElementById(
      "academyMapModal"
    ),

  academyMapCloseButtons:
    Array.from(
      document.querySelectorAll(
        "[data-academy-map-close]"
      )
    ),

  academyMapContainer:
    document.getElementById(
      "academyMapContainer"
    ),

  academyMapList:
    document.getElementById(
      "academyMapList"
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


function normalizeString(value) {
  return safeText(
    value,
    ""
  )
    .trim()
    .toLowerCase();
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


function formatNumber(value) {
  const number =
    Number(value);

  if (
    !Number.isFinite(number)
  ) {
    return "0";
  }

  return new Intl.NumberFormat(
    "en-IN"
  ).format(number);
}


function formatRating(value) {
  const rating =
    Number(value);

  if (
    !Number.isFinite(rating)
  ) {
    return "0.0";
  }

  return rating.toFixed(1);
}


function formatAcademyType(value) {
  const typeMap = {
    professional:
      "Professional Club",

    residential:
      "Residential Academy",

    grassroots:
      "Grassroots Centre",

    school:
      "School Academy",

    community:
      "Community Academy"
  };

  return (
    typeMap[
      normalizeString(value)
    ] ||
    safeText(
      value,
      "Academy"
    )
  );
}


function formatAgeGroup(value) {
  const ageGroupMap = {
    u10: "Under 10",
    u12: "Under 12",
    u15: "Under 15",
    u17: "Under 17",
    u19: "Under 19"
  };

  return (
    ageGroupMap[
      normalizeString(value)
    ] ||
    safeText(
      value,
      "Open Programme"
    )
  );
}


function getAcademyLocation(
  academy
) {
  return [
    academy.city,
    academy.state
  ]
    .filter(Boolean)
    .join(", ") ||
    "Location unavailable";
}


function getAcademyById(
  academyId
) {
  return (
    scoutAcademiesState
      .allAcademies
      .find((academy) => {
        return (
          String(academy.id) ===
          String(academyId)
        );
      }) ||
    null
  );
}


function sanitizeWebsiteUrl(value) {
  const trimmedValue =
    safeText(
      value,
      ""
    ).trim();

  if (!trimmedValue) {
    return "";
  }

  if (
    /^https?:\/\//i.test(
      trimmedValue
    )
  ) {
    return trimmedValue;
  }

  return `https://${trimmedValue}`;
}


function sanitizePhoneLink(value) {
  return safeText(
    value,
    ""
  ).replace(
    /[^\d+]/g,
    ""
  );
}


/* =========================================================
   API REQUEST HELPER
========================================================= */

async function scoutAcademiesApiRequest(
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
      SCOUT_ACADEMIES_CONFIG
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
        `${SCOUT_ACADEMIES_CONFIG.apiBaseUrl}${endpoint}`,
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
   TOAST NOTIFICATIONS
========================================================= */

function showScoutAcademyNotification({
  title = "Notification",
  message = "",
  type = "info",
  duration =
    SCOUT_ACADEMIES_CONFIG
      .toastDuration
}) {
  if (
    !scoutAcademiesDOM
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

  const iconMap = {
    success: "✓",
    error: "!",
    warning: "!",
    info: "i"
  };

  icon.textContent =
    iconMap[type] ||
    iconMap.info;

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

  scoutAcademiesDOM
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
      "translateX(18px)";

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
  scoutAcademiesDOM
    .body
    .classList.add(
      "scout-sidebar-open"
    );

  scoutAcademiesDOM
    .menuButton
    ?.setAttribute(
      "aria-expanded",
      "true"
    );

  scoutAcademiesDOM
    .sidebarOverlay
    ?.setAttribute(
      "aria-hidden",
      "false"
    );

  scoutAcademiesDOM
    .sidebarClose
    ?.focus();
}


function closeScoutSidebar({
  restoreFocus = true
} = {}) {
  scoutAcademiesDOM
    .body
    .classList.remove(
      "scout-sidebar-open"
    );

  scoutAcademiesDOM
    .menuButton
    ?.setAttribute(
      "aria-expanded",
      "false"
    );

  scoutAcademiesDOM
    .sidebarOverlay
    ?.setAttribute(
      "aria-hidden",
      "true"
    );

  if (restoreFocus) {
    scoutAcademiesDOM
      .menuButton
      ?.focus();
  }
}


function initializeScoutSidebar() {
  scoutAcademiesDOM
    .menuButton
    ?.addEventListener(
      "click",
      openScoutSidebar
    );

  scoutAcademiesDOM
    .sidebarClose
    ?.addEventListener(
      "click",
      () => {
        closeScoutSidebar();
      }
    );

  scoutAcademiesDOM
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
    return (
      !element.hasAttribute(
        "hidden"
      ) &&
      element.offsetParent !==
        null
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

  scoutAcademiesState.activeModal =
    modal;

  scoutAcademiesState.modalTrigger =
    trigger ||
    document.activeElement;

  modal.hidden = false;

  scoutAcademiesDOM
    .body
    .classList.add(
      "scout-modal-open"
    );

  const focusableElements =
    getFocusableElements(
      modal
    );

  window.requestAnimationFrame(
    () => {
      focusableElements[0]
        ?.focus();
    }
  );
}


function closeModal(modal) {
  if (!modal) {
    return;
  }

  modal.hidden = true;

  if (
    scoutAcademiesState
      .activeModal ===
    modal
  ) {
    scoutAcademiesState.activeModal =
      null;
  }

  const anyModalOpen = [
    scoutAcademiesDOM
      .academyDetailsModal,

    scoutAcademiesDOM
      .recommendAcademyModal,

    scoutAcademiesDOM
      .academyMapModal,

    scoutAcademiesDOM
      .logoutModal
  ].some((candidate) => {
    return (
      candidate &&
      !candidate.hidden
    );
  });

  if (!anyModalOpen) {
    scoutAcademiesDOM
      .body
      .classList.remove(
        "scout-modal-open"
      );
  }

  if (
    scoutAcademiesState
      .modalTrigger instanceof
    HTMLElement
  ) {
    scoutAcademiesState
      .modalTrigger
      .focus();
  }

  scoutAcademiesState.modalTrigger =
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

  const focusableElements =
    getFocusableElements(
      modal
    );

  if (
    focusableElements.length === 0
  ) {
    event.preventDefault();
    return;
  }

  const firstElement =
    focusableElements[0];

  const lastElement =
    focusableElements[
      focusableElements.length -
      1
    ];

  if (
    event.shiftKey &&
    document.activeElement ===
      firstElement
  ) {
    event.preventDefault();

    lastElement.focus();

    return;
  }

  if (
    !event.shiftKey &&
    document.activeElement ===
      lastElement
  ) {
    event.preventDefault();

    firstElement.focus();
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
   MOCK ACADEMY DATA
========================================================= */

function getMockAcademies() {
  return [
    {
      id:
        "academy-001",

      name:
        "Minerva Football Academy",

      type:
        "residential",

      city:
        "Mohali",

      state:
        "Punjab",

      verified:
        true,

      featured:
        true,

      residential:
        true,

      rating:
        4.9,

      playerCount:
        420,

      coachCount:
        28,

      established:
        2005,

      surface:
        "Natural and Artificial Turf",

      programmes: [
        "u10",
        "u12",
        "u15",
        "u17",
        "u19"
      ],

      facilities: [
        "Residential Campus",
        "Fitness Centre",
        "Medical Unit",
        "Video Analysis",
        "Multiple Training Grounds"
      ],

      description:
        "A leading residential football development institution focused on elite youth pathways, national competitions and long-term player progression.",

      logo:
        "images/academy-logo-placeholder.png",

      coverImage:
        "images/academy-cover-placeholder.jpg",

      email:
        "academy@example.com",

      phone:
        "+91 98765 43210",

      website:
        "https://example.com",

      saved:
        true,

      listedAt:
        "2026-07-01"
    },

    {
      id:
        "academy-002",

      name:
        "Reliance Foundation Young Champs",

      type:
        "residential",

      city:
        "Navi Mumbai",

      state:
        "Maharashtra",

      verified:
        true,

      featured:
        false,

      residential:
        true,

      rating:
        4.8,

      playerCount:
        240,

      coachCount:
        22,

      established:
        2015,

      surface:
        "Natural Grass",

      programmes: [
        "u12",
        "u15",
        "u17",
        "u19"
      ],

      facilities: [
        "Residential Programme",
        "Sports Science",
        "Gymnasium",
        "Recovery Centre"
      ],

      description:
        "An elite youth development programme providing structured coaching, education, sports science and competitive exposure.",

      logo:
        "images/academy-logo-placeholder.png",

      coverImage:
        "images/academy-cover-placeholder.jpg",

      email:
        "contact@example.com",

      phone:
        "+91 91234 56789",

      website:
        "https://example.com",

      saved:
        false,

      listedAt:
        "2026-06-21"
    },

    {
      id:
        "academy-003",

      name:
        "Bengaluru FC Academy",

      type:
        "professional",

      city:
        "Bengaluru",

      state:
        "Karnataka",

      verified:
        true,

      featured:
        false,

      residential:
        false,

      rating:
        4.7,

      playerCount:
        310,

      coachCount:
        25,

      established:
        2013,

      surface:
        "Natural Grass",

      programmes: [
        "u10",
        "u12",
        "u15",
        "u17",
        "u19"
      ],

      facilities: [
        "Professional Coaching",
        "Analysis Room",
        "Gymnasium",
        "Medical Support"
      ],

      description:
        "A professional club academy offering a structured pathway from grassroots development to elite youth and senior football.",

      logo:
        "images/academy-logo-placeholder.png",

      coverImage:
        "images/academy-cover-placeholder.jpg",

      email:
        "academy@example.com",

      phone:
        "+91 99887 77665",

      website:
        "https://example.com",

      saved:
        true,

      listedAt:
        "2026-06-10"
    },

    {
      id:
        "academy-004",

      name:
        "Shillong United Youth Academy",

      type:
        "community",

      city:
        "Shillong",

      state:
        "Meghalaya",

      verified:
        true,

      featured:
        false,

      residential:
        false,

      rating:
        4.6,

      playerCount:
        185,

      coachCount:
        16,

      established:
        2012,

      surface:
        "Artificial Turf",

      programmes: [
        "u10",
        "u12",
        "u15",
        "u17"
      ],

      facilities: [
        "Community Training",
        "Youth Leagues",
        "Fitness Area",
        "Education Support"
      ],

      description:
        "A Northeast-focused youth academy supporting grassroots participation and competitive player development.",

      logo:
        "images/academy-logo-placeholder.png",

      coverImage:
        "images/academy-cover-placeholder.jpg",

      email:
        "hello@example.com",

      phone:
        "+91 87945 62130",

      website:
        "https://example.com",

      saved:
        false,

      listedAt:
        "2026-05-30"
    },

    {
      id:
        "academy-005",

      name:
        "Goa Elite Football Centre",

      type:
        "grassroots",

      city:
        "Margao",

      state:
        "Goa",

      verified:
        false,

      featured:
        false,

      residential:
        false,

      rating:
        4.3,

      playerCount:
        160,

      coachCount:
        14,

      established:
        2018,

      surface:
        "Natural Grass",

      programmes: [
        "u10",
        "u12",
        "u15"
      ],

      facilities: [
        "Grassroots Coaching",
        "Weekend Leagues",
        "Technical Training"
      ],

      description:
        "A regional grassroots centre focused on technical development, participation and early-stage talent identification.",

      logo:
        "images/academy-logo-placeholder.png",

      coverImage:
        "images/academy-cover-placeholder.jpg",

      email:
        "goa@example.com",

      phone:
        "+91 90123 45678",

      website:
        "https://example.com",

      saved:
        false,

      listedAt:
        "2026-07-08"
    },

    {
      id:
        "academy-006",

      name:
        "Nagaland Football Development Centre",

      type:
        "community",

      city:
        "Dimapur",

      state:
        "Nagaland",

      verified:
        true,

      featured:
        false,

      residential:
        false,

      rating:
        4.5,

      playerCount:
        210,

      coachCount:
        18,

      established:
        2014,

      surface:
        "Artificial Turf",

      programmes: [
        "u12",
        "u15",
        "u17"
      ],

      facilities: [
        "Regional Scouting",
        "Community Coaching",
        "Strength Training",
        "Youth Competitions"
      ],

      description:
        "A development centre supporting talented players from Nagaland through structured training and regional competition exposure.",

      logo:
        "images/academy-logo-placeholder.png",

      coverImage:
        "images/academy-cover-placeholder.jpg",

      email:
        "nagaland@example.com",

      phone:
        "+91 70056 12345",

      website:
        "https://example.com",

      saved:
        true,

      listedAt:
        "2026-06-27"
    },

    {
      id:
        "academy-007",

      name:
        "Delhi Future Stars Academy",

      type:
        "school",

      city:
        "New Delhi",

      state:
        "Delhi",

      verified:
        false,

      featured:
        false,

      residential:
        false,

      rating:
        4.1,

      playerCount:
        130,

      coachCount:
        11,

      established:
        2020,

      surface:
        "Artificial Turf",

      programmes: [
        "u10",
        "u12",
        "u15"
      ],

      facilities: [
        "School Programme",
        "Technical Coaching",
        "Local Competitions"
      ],

      description:
        "A school-linked football academy helping young players combine education with structured football training.",

      logo:
        "images/academy-logo-placeholder.png",

      coverImage:
        "images/academy-cover-placeholder.jpg",

      email:
        "delhi@example.com",

      phone:
        "+91 98110 22334",

      website:
        "https://example.com",

      saved:
        false,

      listedAt:
        "2026-07-12"
    },

    {
      id:
        "academy-008",

      name:
        "Kerala Youth Performance Academy",

      type:
        "professional",

      city:
        "Kochi",

      state:
        "Kerala",

      verified:
        true,

      featured:
        false,

      residential:
        true,

      rating:
        4.8,

      playerCount:
        275,

      coachCount:
        21,

      established:
        2011,

      surface:
        "Natural Grass",

      programmes: [
        "u12",
        "u15",
        "u17",
        "u19"
      ],

      facilities: [
        "Residential Hostel",
        "Sports Science",
        "Medical Centre",
        "Match Analysis"
      ],

      description:
        "An advanced youth performance academy combining professional coaching, competition and residential player development.",

      logo:
        "images/academy-logo-placeholder.png",

      coverImage:
        "images/academy-cover-placeholder.jpg",

      email:
        "kerala@example.com",

      phone:
        "+91 94470 11223",

      website:
        "https://example.com",

      saved:
        false,

      listedAt:
        "2026-06-18"
    }
  ];
}


/* =========================================================
   DATA NORMALIZATION
========================================================= */

function normalizeAcademy(
  rawAcademy = {}
) {
  const programmes =
    Array.isArray(
      rawAcademy.programmes
    )
      ? rawAcademy.programmes
      : [];

  const facilities =
    Array.isArray(
      rawAcademy.facilities
    )
      ? rawAcademy.facilities
      : [];

  return {
    id:
      rawAcademy.id ||
      rawAcademy.academyId ||
      `academy-${Date.now()}-${Math.random()}`,

    name:
      rawAcademy.name ||
      rawAcademy.academyName ||
      "Unnamed Academy",

    type:
      normalizeString(
        rawAcademy.type ||
        rawAcademy.academyType ||
        "community"
      ),

    city:
      rawAcademy.city ||
      "",

    state:
      rawAcademy.state ||
      "",

    verified:
      Boolean(
        rawAcademy.verified
      ),

    featured:
      Boolean(
        rawAcademy.featured
      ),

    residential:
      Boolean(
        rawAcademy.residential
      ),

    rating:
      Number(
        rawAcademy.rating ||
        0
      ),

    playerCount:
      Number(
        rawAcademy.playerCount ||
        rawAcademy.players ||
        0
      ),

    coachCount:
      Number(
        rawAcademy.coachCount ||
        rawAcademy.coaches ||
        0
      ),

    established:
      rawAcademy.established ||
      rawAcademy.establishedYear ||
      "—",

    surface:
      rawAcademy.surface ||
      "Not specified",

    programmes:
      programmes.map(
        normalizeString
      ),

    facilities:
      facilities.map(
        (facility) => {
          return safeText(
            facility,
            ""
          ).trim();
        }
      ).filter(Boolean),

    description:
      rawAcademy.description ||
      "No academy description available.",

    logo:
      rawAcademy.logo ||
      rawAcademy.logoUrl ||
      "images/academy-logo-placeholder.png",

    coverImage:
      rawAcademy.coverImage ||
      rawAcademy.coverUrl ||
      "images/academy-cover-placeholder.jpg",

    email:
      rawAcademy.email ||
      "",

    phone:
      rawAcademy.phone ||
      "",

    website:
      rawAcademy.website ||
      "",

    saved:
      Boolean(
        rawAcademy.saved
      ),

    listedAt:
      rawAcademy.listedAt ||
      rawAcademy.createdAt ||
      ""
  };
}


/* =========================================================
   IDENTITY RENDERING
========================================================= */

function renderScoutIdentity(
  identity
) {
  scoutAcademiesDOM
    .scoutNameElements
    .forEach((element) => {
      element.textContent =
        identity.name;
    });

  scoutAcademiesDOM
    .scoutDesignationElements
    .forEach((element) => {
      element.textContent =
        identity.designation;
    });

  scoutAcademiesDOM
    .scoutOrganizationElements
    .forEach((element) => {
      element.textContent =
        identity.organization;
    });

  scoutAcademiesDOM
    .scoutAvatarElements
    .forEach((image) => {
      image.src =
        identity.avatar;

      image.alt =
        `${identity.name} profile`;
    });

  if (
    scoutAcademiesDOM
      .notificationBadge
  ) {
    const count =
      Number(
        identity
          .unreadNotifications ||
        0
      );

    scoutAcademiesDOM
      .notificationBadge
      .textContent =
      count > 99
        ? "99+"
        : String(count);

    scoutAcademiesDOM
      .notificationBadge
      .hidden =
      count <= 0;
  }
}


/* =========================================================
   LOADING AND ERROR STATES
========================================================= */

function setAcademiesLoadingState(
  loading
) {
  scoutAcademiesState.loading =
    Boolean(loading);

  if (
    scoutAcademiesDOM
      .academyLoadingState
  ) {
    scoutAcademiesDOM
      .academyLoadingState
      .hidden =
      !loading;
  }

  if (loading) {
    if (
      scoutAcademiesDOM
        .academyErrorState
    ) {
      scoutAcademiesDOM
        .academyErrorState
        .hidden = true;
    }

    if (
      scoutAcademiesDOM
        .academyEmptyState
    ) {
      scoutAcademiesDOM
        .academyEmptyState
        .hidden = true;
    }

    if (
      scoutAcademiesDOM
        .academyGrid
    ) {
      scoutAcademiesDOM
        .academyGrid
        .hidden = true;
    }

    if (
      scoutAcademiesDOM
        .academyPagination
    ) {
      scoutAcademiesDOM
        .academyPagination
        .hidden = true;
    }
  }
}


function showAcademiesError(
  message
) {
  setAcademiesLoadingState(
    false
  );

  if (
    scoutAcademiesDOM
      .academyErrorMessage
  ) {
    scoutAcademiesDOM
      .academyErrorMessage
      .textContent =
      message ||
      "Academies could not be loaded.";
  }

  if (
    scoutAcademiesDOM
      .academyErrorState
  ) {
    scoutAcademiesDOM
      .academyErrorState
      .hidden = false;
  }

  if (
    scoutAcademiesDOM
      .academyEmptyState
  ) {
    scoutAcademiesDOM
      .academyEmptyState
      .hidden = true;
  }

  if (
    scoutAcademiesDOM
      .academyGrid
  ) {
    scoutAcademiesDOM
      .academyGrid
      .hidden = true;
  }
}


/* =========================================================
   ACADEMY FETCHING
========================================================= */

async function fetchAcademies() {
  if (
    SCOUT_ACADEMIES_CONFIG
      .useMockData
  ) {
    await delay(
      SCOUT_ACADEMIES_CONFIG
        .mockDelay
    );

    return {
      academies:
        getMockAcademies()
    };
  }

  return scoutAcademiesApiRequest(
    SCOUT_ACADEMIES_CONFIG
      .academiesEndpoint
  );
}


async function loadAcademies() {
  if (
    scoutAcademiesState
      .abortController
  ) {
    scoutAcademiesState
      .abortController
      .abort();
  }

  scoutAcademiesState.abortController =
    new AbortController();

  setAcademiesLoadingState(
    true
  );

  try {
    const response =
      await fetchAcademies();

    const rawAcademies =
      Array.isArray(response)
        ? response
        : response?.academies ||
          response?.data ||
          [];

    scoutAcademiesState.allAcademies =
      rawAcademies.map(
        normalizeAcademy
      );

    populateAcademyDynamicFilters();

    scoutAcademiesState.currentPage =
      1;

    applyAcademyFiltersAndRender();

    setAcademiesLoadingState(
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
      "Unable to load academies:",
      error
    );

    showAcademiesError(
      error.message ||
      "The academy directory could not be loaded."
    );
  }
}


/* =========================================================
   DYNAMIC FILTER OPTIONS
========================================================= */

function populateSelectOptions(
  select,
  values
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
      value;

    select.append(option);
  });
}


function populateAcademyDynamicFilters() {
  const states =
    uniqueValues(
      scoutAcademiesState
        .allAcademies
        .map((academy) => {
          return academy.state;
        })
    ).sort((a, b) => {
      return a.localeCompare(b);
    });

  populateSelectOptions(
    scoutAcademiesDOM
      .academyStateFilter,
    states
  );
}


/* =========================================================
   END OF SCOUT-ACADEMIES.JS — PART 1
   CONTINUE DIRECTLY WITH PART 2
========================================================= */

/* =========================================================
   SCOUT-ACADEMIES.JS
   PART 2
   FILTERING, SORTING, RENDERING, PAGINATION,
   DETAILS MODAL, SAVING, RECOMMENDATION,
   MAP, EVENTS, LOGOUT AND INITIALIZATION
   CONTINUES DIRECTLY FROM PART 1
========================================================= */


/* =========================================================
   FILTER COLLECTION
========================================================= */

function collectAcademyFilters() {
  return {
    state:
      scoutAcademiesDOM
        .academyStateFilter
        ?.value ||
      "all",

    type:
      scoutAcademiesDOM
        .academyTypeFilter
        ?.value ||
      "all",

    ageGroup:
      scoutAcademiesDOM
        .academyAgeGroupFilter
        ?.value ||
      "all",

    verification:
      scoutAcademiesDOM
        .academyVerificationFilter
        ?.value ||
      "all",

    residential:
      scoutAcademiesDOM
        .academyResidentialFilter
        ?.value ||
      "all",

    rating:
      scoutAcademiesDOM
        .academyRatingFilter
        ?.value ||
      "all"
  };
}


/* =========================================================
   SEARCH AND FILTERING
========================================================= */

function academyPassesSearch(
  academy,
  searchQuery
) {
  if (!searchQuery) {
    return true;
  }

  const searchableText = [
    academy.name,
    academy.type,
    formatAcademyType(
      academy.type
    ),
    academy.city,
    academy.state,
    academy.description,
    academy.surface,
    ...academy.programmes,
    ...academy.facilities
  ]
    .join(" ")
    .toLowerCase();

  return searchableText.includes(
    searchQuery
  );
}


function academyPassesFilters(
  academy,
  filters
) {
  if (
    filters.state !== "all" &&
    academy.state !==
      filters.state
  ) {
    return false;
  }

  if (
    filters.type !== "all" &&
    academy.type !==
      filters.type
  ) {
    return false;
  }

  if (
    filters.ageGroup !== "all" &&
    !academy.programmes.includes(
      filters.ageGroup
    )
  ) {
    return false;
  }

  if (
    filters.verification ===
      "verified" &&
    !academy.verified
  ) {
    return false;
  }

  if (
    filters.verification ===
      "unverified" &&
    academy.verified
  ) {
    return false;
  }

  if (
    filters.residential ===
      "available" &&
    !academy.residential
  ) {
    return false;
  }

  if (
    filters.residential ===
      "unavailable" &&
    academy.residential
  ) {
    return false;
  }

  if (
    filters.rating !== "all" &&
    academy.rating <
      Number(filters.rating)
  ) {
    return false;
  }

  return true;
}


/* =========================================================
   SORTING
========================================================= */

function sortAcademies(
  academies,
  sortBy
) {
  const sortedAcademies =
    [...academies];

  sortedAcademies.sort(
    (academyA, academyB) => {
      if (
        sortBy ===
        "rating-desc"
      ) {
        return (
          academyB.rating -
          academyA.rating
        );
      }

      if (
        sortBy ===
        "players-desc"
      ) {
        return (
          academyB.playerCount -
          academyA.playerCount
        );
      }

      if (
        sortBy ===
        "name-asc"
      ) {
        return academyA.name.localeCompare(
          academyB.name
        );
      }

      if (
        sortBy ===
        "newest"
      ) {
        const dateA =
          new Date(
            academyA.listedAt ||
            0
          ).getTime();

        const dateB =
          new Date(
            academyB.listedAt ||
            0
          ).getTime();

        return dateB - dateA;
      }

      if (
        academyA.featured !==
        academyB.featured
      ) {
        return academyA.featured
          ? -1
          : 1;
      }

      if (
        academyA.verified !==
        academyB.verified
      ) {
        return academyA.verified
          ? -1
          : 1;
      }

      if (
        academyA.rating !==
        academyB.rating
      ) {
        return (
          academyB.rating -
          academyA.rating
        );
      }

      return (
        academyB.playerCount -
        academyA.playerCount
      );
    }
  );

  return sortedAcademies;
}


/* =========================================================
   APPLY FILTERS AND RENDER
========================================================= */

function applyAcademyFiltersAndRender() {
  const searchQuery =
    normalizeString(
      scoutAcademiesDOM
        .academySearchInput
        ?.value ||
      scoutAcademiesState
        .searchQuery
    );

  scoutAcademiesState.searchQuery =
    searchQuery;

  const filteredAcademies =
    scoutAcademiesState
      .allAcademies
      .filter((academy) => {
        return (
          academyPassesSearch(
            academy,
            searchQuery
          ) &&
          academyPassesFilters(
            academy,
            scoutAcademiesState
              .filters
          )
        );
      });

  scoutAcademiesState.filteredAcademies =
    sortAcademies(
      filteredAcademies,
      scoutAcademiesState.sortBy
    );

  const totalPages =
    getAcademyTotalPages();

  if (
    scoutAcademiesState
      .currentPage >
    totalPages
  ) {
    scoutAcademiesState.currentPage =
      Math.max(
        totalPages,
        1
      );
  }

  renderAcademyStatistics();
  renderFeaturedAcademy();
  renderAcademyResults();
  renderAcademyPagination();
  updateAcademyFilterSummary();
}


/* =========================================================
   STATISTICS
========================================================= */

function renderAcademyStatistics() {
  const allAcademies =
    scoutAcademiesState
      .allAcademies;

  const verifiedCount =
    allAcademies.filter(
      (academy) => {
        return academy.verified;
      }
    ).length;

  const playerCount =
    allAcademies.reduce(
      (total, academy) => {
        return (
          total +
          academy.playerCount
        );
      },
      0
    );

  const savedCount =
    allAcademies.filter(
      (academy) => {
        return academy.saved;
      }
    ).length;

  setText(
    scoutAcademiesDOM
      .totalAcademiesCount,
    formatNumber(
      allAcademies.length
    ),
    "0"
  );

  setText(
    scoutAcademiesDOM
      .verifiedAcademiesCount,
    formatNumber(
      verifiedCount
    ),
    "0"
  );

  setText(
    scoutAcademiesDOM
      .academyPlayersCount,
    formatNumber(
      playerCount
    ),
    "0"
  );

  setText(
    scoutAcademiesDOM
      .savedAcademiesCount,
    formatNumber(
      savedCount
    ),
    "0"
  );
}


/* =========================================================
   PROGRAMME AND FACILITY CHIPS
========================================================= */

function renderProgrammeChips(
  container,
  programmes
) {
  if (!container) {
    return;
  }

  const fragment =
    document.createDocumentFragment();

  programmes.forEach(
    (programme) => {
      fragment.append(
        createElement(
          "span",
          "scout-programme-chip",
          formatAgeGroup(
            programme
          )
        )
      );
    }
  );

  container.replaceChildren(
    fragment
  );
}


function renderFacilityChips(
  container,
  facilities
) {
  if (!container) {
    return;
  }

  const fragment =
    document.createDocumentFragment();

  facilities.forEach(
    (facility) => {
      fragment.append(
        createElement(
          "span",
          "scout-facility-chip",
          facility
        )
      );
    }
  );

  container.replaceChildren(
    fragment
  );
}


/* =========================================================
   VERIFICATION BADGES
========================================================= */

function updateVerificationBadge(
  element,
  verified
) {
  if (!element) {
    return;
  }

  element.textContent =
    verified
      ? "Verified Academy"
      : "Verification Pending";

  element.classList.toggle(
    "is-unverified",
    !verified
  );
}


/* =========================================================
   FEATURED ACADEMY
========================================================= */

function renderFeaturedAcademy() {
  const featuredAcademy =
    scoutAcademiesState
      .allAcademies
      .find((academy) => {
        return academy.featured;
      });

  if (
    !featuredAcademy ||
    !scoutAcademiesDOM
      .featuredAcademySection
  ) {
    if (
      scoutAcademiesDOM
        .featuredAcademySection
    ) {
      scoutAcademiesDOM
        .featuredAcademySection
        .hidden = true;
    }

    return;
  }

  scoutAcademiesDOM
    .featuredAcademySection
    .hidden = false;

  scoutAcademiesDOM
    .featuredAcademyCard
    ?.setAttribute(
      "data-academy-id",
      featuredAcademy.id
    );

  if (
    scoutAcademiesDOM
      .featuredAcademyImage
  ) {
    scoutAcademiesDOM
      .featuredAcademyImage
      .src =
      featuredAcademy.coverImage;

    scoutAcademiesDOM
      .featuredAcademyImage
      .alt =
      `${featuredAcademy.name} campus`;
  }

  if (
    scoutAcademiesDOM
      .featuredAcademyLogo
  ) {
    scoutAcademiesDOM
      .featuredAcademyLogo
      .src =
      featuredAcademy.logo;

    scoutAcademiesDOM
      .featuredAcademyLogo
      .alt =
      `${featuredAcademy.name} logo`;
  }

  updateVerificationBadge(
    scoutAcademiesDOM
      .featuredAcademyVerificationBadge,
    featuredAcademy.verified
  );

  setText(
    scoutAcademiesDOM
      .featuredAcademyType,
    formatAcademyType(
      featuredAcademy.type
    )
  );

  setText(
    scoutAcademiesDOM
      .featuredAcademyName,
    featuredAcademy.name
  );

  setText(
    scoutAcademiesDOM
      .featuredAcademyLocation,
    getAcademyLocation(
      featuredAcademy
    )
  );

  setText(
    scoutAcademiesDOM
      .featuredAcademyDescription,
    featuredAcademy.description
  );

  setText(
    scoutAcademiesDOM
      .featuredAcademyRating,
    `★ ${formatRating(
      featuredAcademy.rating
    )}`
  );

  setText(
    scoutAcademiesDOM
      .featuredAcademyPlayers,
    formatNumber(
      featuredAcademy.playerCount
    )
  );

  setText(
    scoutAcademiesDOM
      .featuredAcademyCoaches,
    formatNumber(
      featuredAcademy.coachCount
    )
  );

  setText(
    scoutAcademiesDOM
      .featuredAcademyEstablished,
    featuredAcademy.established
  );

  renderProgrammeChips(
    scoutAcademiesDOM
      .featuredAcademyProgrammes,
    featuredAcademy.programmes
  );

  if (
    scoutAcademiesDOM
      .featuredSaveAcademyButton
  ) {
    scoutAcademiesDOM
      .featuredSaveAcademyButton
      .dataset.academyId =
      featuredAcademy.id;
  }

  if (
    scoutAcademiesDOM
      .featuredViewAcademyButton
  ) {
    scoutAcademiesDOM
      .featuredViewAcademyButton
      .dataset.academyId =
      featuredAcademy.id;
  }

  updateAcademySaveButton(
    scoutAcademiesDOM
      .featuredSaveAcademyButton,
    featuredAcademy
  );
}


/* =========================================================
   ACADEMY CARD CREATION
========================================================= */

function createAcademyCard(
  academy
) {
  const card =
    createElement(
      "article",
      "scout-academy-card"
    );

  card.dataset.academyId =
    academy.id;


  const cover =
    createElement(
      "div",
      "scout-academy-card-cover"
    );

  const coverImage =
    document.createElement(
      "img"
    );

  coverImage.src =
    academy.coverImage;

  coverImage.alt =
    `${academy.name} campus`;

  const verificationBadge =
    createElement(
      "span",
      "scout-academy-verification-badge"
    );

  updateVerificationBadge(
    verificationBadge,
    academy.verified
  );

  const saveButton =
    createElement(
      "button",
      "scout-academy-save-button"
    );

  saveButton.type =
    "button";

  saveButton.dataset.academyId =
    academy.id;

  updateAcademySaveButton(
    saveButton,
    academy
  );

  cover.append(
    coverImage,
    verificationBadge,
    saveButton
  );


  const profile =
    createElement(
      "div",
      "scout-academy-card-profile"
    );

  const logoWrapper =
    createElement(
      "div",
      "scout-academy-card-logo"
    );

  const logo =
    document.createElement(
      "img"
    );

  logo.src =
    academy.logo;

  logo.alt =
    `${academy.name} logo`;

  logoWrapper.append(
    logo
  );

  const profileCopy =
    createElement(
      "div",
      "scout-academy-card-profile-copy"
    );

  profileCopy.append(
    createElement(
      "span",
      "",
      formatAcademyType(
        academy.type
      )
    ),

    createElement(
      "h3",
      "",
      academy.name
    ),

    createElement(
      "p",
      "",
      getAcademyLocation(
        academy
      )
    )
  );

  profile.append(
    logoWrapper,
    profileCopy
  );


  const body =
    createElement(
      "div",
      "scout-academy-card-body"
    );

  body.append(
    createElement(
      "p",
      "scout-academy-card-description",
      academy.description
    )
  );


  const metrics =
    createElement(
      "div",
      "scout-academy-card-metrics"
    );

  metrics.append(
    createAcademyMetric(
      "Rating",
      `★ ${formatRating(
        academy.rating
      )}`
    ),

    createAcademyMetric(
      "Players",
      formatNumber(
        academy.playerCount
      )
    ),

    createAcademyMetric(
      "Established",
      academy.established
    )
  );

  body.append(
    metrics
  );


  const programmes =
    createElement(
      "div",
      "scout-academy-card-programmes"
    );

  academy.programmes
    .slice(0, 4)
    .forEach((programme) => {
      programmes.append(
        createElement(
          "span",
          "",
          formatAgeGroup(
            programme
          )
        )
      );
    });

  if (
    academy.programmes.length >
    4
  ) {
    programmes.append(
      createElement(
        "span",
        "",
        `+${
          academy.programmes.length -
          4
        }`
      )
    );
  }

  body.append(
    programmes
  );


  const actions =
    createElement(
      "div",
      "scout-academy-card-actions"
    );

  const viewButton =
    createElement(
      "button",
      "scout-primary-button scout-academy-view-button",
      "View Academy"
    );

  viewButton.type =
    "button";

  viewButton.dataset.academyId =
    academy.id;

  actions.append(
    viewButton
  );


  card.append(
    cover,
    profile,
    body,
    actions
  );

  return card;
}


function createAcademyMetric(
  label,
  value
) {
  const wrapper =
    createElement("div");

  wrapper.append(
    createElement(
      "span",
      "",
      label
    ),

    createElement(
      "strong",
      "",
      safeText(value)
    )
  );

  return wrapper;
}


/* =========================================================
   PAGINATED DATA
========================================================= */

function getPaginatedAcademies() {
  const startIndex =
    (
      scoutAcademiesState
        .currentPage -
      1
    ) *
    scoutAcademiesState
      .itemsPerPage;

  const endIndex =
    startIndex +
    scoutAcademiesState
      .itemsPerPage;

  return scoutAcademiesState
    .filteredAcademies
    .slice(
      startIndex,
      endIndex
    );
}


/* =========================================================
   RENDER RESULTS
========================================================= */

function renderAcademyResults() {
  setAcademiesLoadingState(
    false
  );

  if (
    scoutAcademiesDOM
      .academyErrorState
  ) {
    scoutAcademiesDOM
      .academyErrorState
      .hidden = true;
  }

  const totalAcademies =
    scoutAcademiesState
      .filteredAcademies
      .length;

  setText(
    scoutAcademiesDOM
      .academyResultCount,
    `${totalAcademies} ${
      totalAcademies === 1
        ? "academy"
        : "academies"
    }`
  );

  if (
    totalAcademies === 0
  ) {
    scoutAcademiesDOM
      .academyGrid
      ?.replaceChildren();

    if (
      scoutAcademiesDOM
        .academyGrid
    ) {
      scoutAcademiesDOM
        .academyGrid
        .hidden = true;
    }

    if (
      scoutAcademiesDOM
        .academyEmptyState
    ) {
      scoutAcademiesDOM
        .academyEmptyState
        .hidden = false;
    }

    if (
      scoutAcademiesDOM
        .academyPagination
    ) {
      scoutAcademiesDOM
        .academyPagination
        .hidden = true;
    }

    return;
  }

  if (
    scoutAcademiesDOM
      .academyEmptyState
  ) {
    scoutAcademiesDOM
      .academyEmptyState
      .hidden = true;
  }

  if (
    !scoutAcademiesDOM
      .academyGrid
  ) {
    return;
  }

  const fragment =
    document.createDocumentFragment();

  getPaginatedAcademies()
    .forEach((academy) => {
      fragment.append(
        createAcademyCard(
          academy
        )
      );
    });

  scoutAcademiesDOM
    .academyGrid
    .replaceChildren(
      fragment
    );

  scoutAcademiesDOM
    .academyGrid
    .hidden = false;

  scoutAcademiesDOM
    .academyGrid
    .classList.toggle(
      "is-list-view",
      scoutAcademiesState
        .currentView ===
        "list"
    );
}


/* =========================================================
   SAVE BUTTONS
========================================================= */

function updateAcademySaveButton(
  button,
  academy
) {
  if (
    !button ||
    !academy
  ) {
    return;
  }

  const isIconButton =
    button.classList.contains(
      "scout-academy-save-button"
    );

  button.classList.toggle(
    "is-saved",
    academy.saved
  );

  button.setAttribute(
    "aria-pressed",
    String(academy.saved)
  );

  button.setAttribute(
    "aria-label",
    academy.saved
      ? "Remove academy from saved list"
      : "Save academy"
  );

  if (isIconButton) {
    button.textContent =
      academy.saved
        ? "★"
        : "☆";
  } else {
    button.textContent =
      academy.saved
        ? "Saved"
        : "Save Academy";
  }
}


/* =========================================================
   PAGINATION
========================================================= */

function getAcademyTotalPages() {
  return Math.ceil(
    scoutAcademiesState
      .filteredAcademies
      .length /
    scoutAcademiesState
      .itemsPerPage
  );
}


function renderAcademyPagination() {
  const totalPages =
    getAcademyTotalPages();

  if (
    !scoutAcademiesDOM
      .academyPagination ||
    totalPages <= 1
  ) {
    if (
      scoutAcademiesDOM
        .academyPagination
    ) {
      scoutAcademiesDOM
        .academyPagination
        .hidden = true;
    }

    return;
  }

  scoutAcademiesDOM
    .academyPagination
    .hidden = false;

  if (
    scoutAcademiesDOM
      .previousAcademiesPageButton
  ) {
    scoutAcademiesDOM
      .previousAcademiesPageButton
      .disabled =
      scoutAcademiesState
        .currentPage === 1;
  }

  if (
    scoutAcademiesDOM
      .nextAcademiesPageButton
  ) {
    scoutAcademiesDOM
      .nextAcademiesPageButton
      .disabled =
      scoutAcademiesState
        .currentPage ===
      totalPages;
  }

  if (
    !scoutAcademiesDOM
      .academyPaginationPages
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
      scoutAcademiesState
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

  scoutAcademiesDOM
    .academyPaginationPages
    .replaceChildren(
      fragment
    );
}


function changeAcademyPage(page) {
  const totalPages =
    getAcademyTotalPages();

  if (
    page < 1 ||
    page > totalPages ||
    page ===
      scoutAcademiesState
        .currentPage
  ) {
    return;
  }

  scoutAcademiesState.currentPage =
    page;

  renderAcademyResults();
  renderAcademyPagination();

  document
    .querySelector(
      ".scout-academy-results-section"
    )
    ?.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
}


/* =========================================================
   FILTER SUMMARY
========================================================= */

function updateAcademyFilterSummary() {
  if (
    !scoutAcademiesDOM
      .academyActiveFilterSummary
  ) {
    return;
  }

  const activeFilters = [];

  const filters =
    scoutAcademiesState.filters;

  if (
    filters.state !== "all"
  ) {
    activeFilters.push(
      filters.state
    );
  }

  if (
    filters.type !== "all"
  ) {
    activeFilters.push(
      formatAcademyType(
        filters.type
      )
    );
  }

  if (
    filters.ageGroup !== "all"
  ) {
    activeFilters.push(
      formatAgeGroup(
        filters.ageGroup
      )
    );
  }

  if (
    filters.verification !==
    "all"
  ) {
    activeFilters.push(
      filters.verification ===
        "verified"
        ? "Verified only"
        : "Pending verification"
    );
  }

  if (
    filters.residential !==
    "all"
  ) {
    activeFilters.push(
      filters.residential ===
        "available"
        ? "Residential"
        : "Non-residential"
    );
  }

  if (
    filters.rating !== "all"
  ) {
    activeFilters.push(
      `${filters.rating}+ rating`
    );
  }

  if (
    scoutAcademiesState
      .searchQuery
  ) {
    activeFilters.push(
      `Search: "${scoutAcademiesState.searchQuery}"`
    );
  }

  scoutAcademiesState.filtersApplied =
    activeFilters.length > 0;

  scoutAcademiesDOM
    .academyActiveFilterSummary
    .textContent =
    activeFilters.length
      ? `${activeFilters.length} active: ${activeFilters.join(", ")}`
      : "No filters applied";
}


/* =========================================================
   APPLY AND CLEAR FILTERS
========================================================= */

function applySelectedAcademyFilters() {
  scoutAcademiesState.filters =
    collectAcademyFilters();

  scoutAcademiesState.currentPage =
    1;

  applyAcademyFiltersAndRender();

  showScoutAcademyNotification({
    title:
      "Filters applied",

    message:
      `${scoutAcademiesState.filteredAcademies.length} academies found.`,

    type:
      "success"
  });
}


function resetAcademyFilterControls() {
  if (
    scoutAcademiesDOM
      .academyStateFilter
  ) {
    scoutAcademiesDOM
      .academyStateFilter
      .value = "all";
  }

  if (
    scoutAcademiesDOM
      .academyTypeFilter
  ) {
    scoutAcademiesDOM
      .academyTypeFilter
      .value = "all";
  }

  if (
    scoutAcademiesDOM
      .academyAgeGroupFilter
  ) {
    scoutAcademiesDOM
      .academyAgeGroupFilter
      .value = "all";
  }

  if (
    scoutAcademiesDOM
      .academyVerificationFilter
  ) {
    scoutAcademiesDOM
      .academyVerificationFilter
      .value = "all";
  }

  if (
    scoutAcademiesDOM
      .academyResidentialFilter
  ) {
    scoutAcademiesDOM
      .academyResidentialFilter
      .value = "all";
  }

  if (
    scoutAcademiesDOM
      .academyRatingFilter
  ) {
    scoutAcademiesDOM
      .academyRatingFilter
      .value = "all";
  }

  if (
    scoutAcademiesDOM
      .academySearchInput
  ) {
    scoutAcademiesDOM
      .academySearchInput
      .value = "";
  }
}


function clearAcademyFilters({
  showNotification = true
} = {}) {
  resetAcademyFilterControls();

  scoutAcademiesState.filters = {
    state: "all",
    type: "all",
    ageGroup: "all",
    verification: "all",
    residential: "all",
    rating: "all"
  };

  scoutAcademiesState.searchQuery =
    "";

  scoutAcademiesState.currentPage =
    1;

  applyAcademyFiltersAndRender();

  if (showNotification) {
    showScoutAcademyNotification({
      title:
        "Filters cleared",

      message:
        "All academies are now visible.",

      type:
        "info"
    });
  }
}


/* =========================================================
   VIEW SWITCHING
========================================================= */

function setAcademyView(view) {
  scoutAcademiesState.currentView =
    view === "list"
      ? "list"
      : "grid";

  scoutAcademiesDOM
    .academyGridViewButton
    ?.classList.toggle(
      "is-active",
      scoutAcademiesState
        .currentView ===
        "grid"
    );

  scoutAcademiesDOM
    .academyListViewButton
    ?.classList.toggle(
      "is-active",
      scoutAcademiesState
        .currentView ===
        "list"
    );

  scoutAcademiesDOM
    .academyGridViewButton
    ?.setAttribute(
      "aria-pressed",
      String(
        scoutAcademiesState
          .currentView ===
          "grid"
      )
    );

  scoutAcademiesDOM
    .academyListViewButton
    ?.setAttribute(
      "aria-pressed",
      String(
        scoutAcademiesState
          .currentView ===
          "list"
      )
    );

  scoutAcademiesDOM
    .academyGrid
    ?.classList.toggle(
      "is-list-view",
      scoutAcademiesState
        .currentView ===
        "list"
    );
}


/* =========================================================
   FILTER PANEL
========================================================= */

function toggleAcademyFiltersPanel() {
  if (
    !scoutAcademiesDOM
      .academyFiltersPanel
  ) {
    return;
  }

  const willHide =
    !scoutAcademiesDOM
      .academyFiltersPanel
      .hidden;

  scoutAcademiesDOM
    .academyFiltersPanel
    .hidden =
    willHide;

  scoutAcademiesDOM
    .academyFilterToggleButton
    ?.setAttribute(
      "aria-expanded",
      String(!willHide)
    );
}


/* =========================================================
   DETAILS MODAL
========================================================= */

function openAcademyDetails(
  academyId,
  trigger = null
) {
  const academy =
    getAcademyById(
      academyId
    );

  if (!academy) {
    showScoutAcademyNotification({
      title:
        "Academy unavailable",

      message:
        "This academy could not be found.",

      type:
        "error"
    });

    return;
  }

  scoutAcademiesState.activeAcademyId =
    academy.id;

  renderAcademyDetailsModal(
    academy
  );

  openModal(
    scoutAcademiesDOM
      .academyDetailsModal,
    trigger
  );
}


function renderAcademyDetailsModal(
  academy
) {
  setText(
    scoutAcademiesDOM
      .academyDetailsModalTitle,
    academy.name
  );

  if (
    scoutAcademiesDOM
      .modalAcademyCover
  ) {
    scoutAcademiesDOM
      .modalAcademyCover
      .src =
      academy.coverImage;

    scoutAcademiesDOM
      .modalAcademyCover
      .alt =
      `${academy.name} campus`;
  }

  if (
    scoutAcademiesDOM
      .modalAcademyLogo
  ) {
    scoutAcademiesDOM
      .modalAcademyLogo
      .src =
      academy.logo;

    scoutAcademiesDOM
      .modalAcademyLogo
      .alt =
      `${academy.name} logo`;
  }

  updateVerificationBadge(
    scoutAcademiesDOM
      .modalAcademyVerification,
    academy.verified
  );

  setText(
    scoutAcademiesDOM
      .modalAcademyType,
    formatAcademyType(
      academy.type
    )
  );

  setText(
    scoutAcademiesDOM
      .modalAcademyName,
    academy.name
  );

  setText(
    scoutAcademiesDOM
      .modalAcademyLocation,
    getAcademyLocation(
      academy
    )
  );

  setText(
    scoutAcademiesDOM
      .modalAcademyDescription,
    academy.description
  );

  setText(
    scoutAcademiesDOM
      .modalAcademyRating,
    `★ ${formatRating(
      academy.rating
    )}`
  );

  setText(
    scoutAcademiesDOM
      .modalAcademyPlayers,
    formatNumber(
      academy.playerCount
    )
  );

  setText(
    scoutAcademiesDOM
      .modalAcademyCoaches,
    formatNumber(
      academy.coachCount
    )
  );

  setText(
    scoutAcademiesDOM
      .modalAcademyEstablished,
    academy.established
  );

  setText(
    scoutAcademiesDOM
      .modalAcademyResidential,
    academy.residential
      ? "Available"
      : "Not Available"
  );

  setText(
    scoutAcademiesDOM
      .modalAcademySurface,
    academy.surface
  );

  renderProgrammeChips(
    scoutAcademiesDOM
      .modalAcademyProgrammes,
    academy.programmes
  );

  renderFacilityChips(
    scoutAcademiesDOM
      .modalAcademyFacilities,
    academy.facilities
  );

  renderAcademyContactLink(
    scoutAcademiesDOM
      .modalAcademyEmail,
    academy.email,
    academy.email
      ? `mailto:${academy.email}`
      : ""
  );

  renderAcademyContactLink(
    scoutAcademiesDOM
      .modalAcademyPhone,
    academy.phone,
    academy.phone
      ? `tel:${sanitizePhoneLink(
          academy.phone
        )}`
      : ""
  );

  const website =
    sanitizeWebsiteUrl(
      academy.website
    );

  renderAcademyContactLink(
    scoutAcademiesDOM
      .modalAcademyWebsite,
    academy.website,
    website
  );

  if (
    scoutAcademiesDOM
      .modalSaveAcademyButton
  ) {
    scoutAcademiesDOM
      .modalSaveAcademyButton
      .dataset.academyId =
      academy.id;
  }

  updateAcademySaveButton(
    scoutAcademiesDOM
      .modalSaveAcademyButton,
    academy
  );

  if (
    scoutAcademiesDOM
      .modalViewAcademyPlayersLink
  ) {
    const params =
      new URLSearchParams({
        academyId:
          academy.id,

        academyName:
          academy.name
      });

    scoutAcademiesDOM
      .modalViewAcademyPlayersLink
      .href =
      `scout-players.html?${params.toString()}`;
  }
}


function renderAcademyContactLink(
  element,
  label,
  href
) {
  if (!element) {
    return;
  }

  element.textContent =
    label || "Not available";

  if (href) {
    element.href =
      href;

    element.removeAttribute(
      "aria-disabled"
    );
  } else {
    element.href =
      "#";

    element.setAttribute(
      "aria-disabled",
      "true"
    );
  }
}


function closeAcademyDetailsModal() {
  closeModal(
    scoutAcademiesDOM
      .academyDetailsModal
  );

  scoutAcademiesState.activeAcademyId =
    null;
}


/* =========================================================
   SAVE OR UNSAVE ACADEMY
========================================================= */

async function toggleSavedAcademy(
  academyId,
  triggerButton = null
) {
  const academy =
    getAcademyById(
      academyId
    );

  if (!academy) {
    return;
  }

  const previousState =
    academy.saved;

  academy.saved =
    !previousState;

  renderAcademyStatistics();
  renderFeaturedAcademy();
  renderAcademyResults();

  if (
    scoutAcademiesState
      .activeAcademyId ===
    academy.id
  ) {
    renderAcademyDetailsModal(
      academy
    );
  }

  setButtonLoading(
    triggerButton,
    true
  );

  try {
    if (
      SCOUT_ACADEMIES_CONFIG
        .useMockData
    ) {
      await delay(450);
    } else if (
      academy.saved
    ) {
      await scoutAcademiesApiRequest(
        SCOUT_ACADEMIES_CONFIG
          .savedAcademiesEndpoint,
        {
          method: "POST",

          body: {
            academyId:
              academy.id
          }
        }
      );
    } else {
      await scoutAcademiesApiRequest(
        `${SCOUT_ACADEMIES_CONFIG.savedAcademiesEndpoint}/${encodeURIComponent(academy.id)}`,
        {
          method: "DELETE"
        }
      );
    }

    showScoutAcademyNotification({
      title:
        academy.saved
          ? "Academy saved"
          : "Academy removed",

      message:
        academy.saved
          ? "The academy was added to your watchlist."
          : "The academy was removed from your watchlist.",

      type:
        "success"
    });
  } catch (error) {
    academy.saved =
      previousState;

    renderAcademyStatistics();
    renderFeaturedAcademy();
    renderAcademyResults();

    if (
      scoutAcademiesState
        .activeAcademyId ===
      academy.id
    ) {
      renderAcademyDetailsModal(
        academy
      );
    }

    console.error(
      "Unable to update saved academy:",
      error
    );

    showScoutAcademyNotification({
      title:
        "Watchlist update failed",

      message:
        error.message ||
        "The academy status could not be updated.",

      type:
        "error"
    });
  } finally {
    setButtonLoading(
      triggerButton,
      false
    );

    updateAcademySaveButton(
      triggerButton,
      getAcademyById(
        academyId
      )
    );
  }
}


/* =========================================================
   RECOMMENDATION MODAL
========================================================= */

function openRecommendAcademyModal() {
  scoutAcademiesDOM
    .recommendAcademyForm
    ?.reset();

  clearAcademyRecommendationErrors();

  openModal(
    scoutAcademiesDOM
      .recommendAcademyModal,
    scoutAcademiesDOM
      .recommendAcademyButton
  );
}


function closeRecommendAcademyModal() {
  closeModal(
    scoutAcademiesDOM
      .recommendAcademyModal
  );

  scoutAcademiesDOM
    .recommendAcademyForm
    ?.reset();

  clearAcademyRecommendationErrors();
}


/* =========================================================
   RECOMMENDATION VALIDATION
========================================================= */

function getRecommendationErrorElement(
  field
) {
  if (!field?.id) {
    return null;
  }

  return document.querySelector(
    `[data-error-for="${field.id}"]`
  );
}


function setRecommendationFieldError(
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
    getRecommendationErrorElement(
      field
    );

  if (errorElement) {
    errorElement.textContent =
      message;
  }
}


function clearRecommendationFieldError(
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
    getRecommendationErrorElement(
      field
    );

  if (errorElement) {
    errorElement.textContent =
      "";
  }
}


function clearAcademyRecommendationErrors() {
  [
    scoutAcademiesDOM
      .recommendedAcademyName,

    scoutAcademiesDOM
      .recommendedAcademyType,

    scoutAcademiesDOM
      .recommendedAcademyCity,

    scoutAcademiesDOM
      .recommendedAcademyState,

    scoutAcademiesDOM
      .recommendedAcademyEmail,

    scoutAcademiesDOM
      .recommendedAcademyPhone,

    scoutAcademiesDOM
      .recommendedAcademyWebsite,

    scoutAcademiesDOM
      .recommendedAcademyReason
  ].forEach(
    clearRecommendationFieldError
  );
}


function isValidEmail(
  value
) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
    value
  );
}


function isValidPhone(
  value
) {
  return /^[+\d][\d\s()-]{6,19}$/.test(
    value
  );
}


function isValidWebsite(
  value
) {
  try {
    const url =
      new URL(
        sanitizeWebsiteUrl(
          value
        )
      );

    return (
      url.protocol === "http:" ||
      url.protocol === "https:"
    );
  } catch {
    return false;
  }
}


function validateAcademyRecommendationForm() {
  clearAcademyRecommendationErrors();

  let valid = true;
  let firstInvalidField =
    null;

  const requiredFields = [
    {
      field:
        scoutAcademiesDOM
          .recommendedAcademyName,

      message:
        "Academy name is required."
    },

    {
      field:
        scoutAcademiesDOM
          .recommendedAcademyType,

      message:
        "Academy type is required."
    },

    {
      field:
        scoutAcademiesDOM
          .recommendedAcademyCity,

      message:
        "City is required."
    },

    {
      field:
        scoutAcademiesDOM
          .recommendedAcademyState,

      message:
        "State is required."
    },

    {
      field:
        scoutAcademiesDOM
          .recommendedAcademyReason,

      message:
        "Please explain why this academy should be listed."
    }
  ];

  requiredFields.forEach(
    ({ field, message }) => {
      if (
        field?.value.trim()
      ) {
        return;
      }

      setRecommendationFieldError(
        field,
        message
      );

      firstInvalidField ||=
        field;

      valid = false;
    }
  );

  const email =
    scoutAcademiesDOM
      .recommendedAcademyEmail
      ?.value
      .trim();

  if (
    email &&
    !isValidEmail(email)
  ) {
    setRecommendationFieldError(
      scoutAcademiesDOM
        .recommendedAcademyEmail,
      "Enter a valid email address."
    );

    firstInvalidField ||=
      scoutAcademiesDOM
        .recommendedAcademyEmail;

    valid = false;
  }

  const phone =
    scoutAcademiesDOM
      .recommendedAcademyPhone
      ?.value
      .trim();

  if (
    phone &&
    !isValidPhone(phone)
  ) {
    setRecommendationFieldError(
      scoutAcademiesDOM
        .recommendedAcademyPhone,
      "Enter a valid phone number."
    );

    firstInvalidField ||=
      scoutAcademiesDOM
        .recommendedAcademyPhone;

    valid = false;
  }

  const website =
    scoutAcademiesDOM
      .recommendedAcademyWebsite
      ?.value
      .trim();

  if (
    website &&
    !isValidWebsite(website)
  ) {
    setRecommendationFieldError(
      scoutAcademiesDOM
        .recommendedAcademyWebsite,
      "Enter a valid website address."
    );

    firstInvalidField ||=
      scoutAcademiesDOM
        .recommendedAcademyWebsite;

    valid = false;
  }

  firstInvalidField?.focus();

  return valid;
}


/* =========================================================
   COLLECT RECOMMENDATION DATA
========================================================= */

function collectAcademyRecommendationData() {
  return {
    academyName:
      scoutAcademiesDOM
        .recommendedAcademyName
        ?.value
        .trim(),

    academyType:
      scoutAcademiesDOM
        .recommendedAcademyType
        ?.value,

    city:
      scoutAcademiesDOM
        .recommendedAcademyCity
        ?.value
        .trim(),

    state:
      scoutAcademiesDOM
        .recommendedAcademyState
        ?.value
        .trim(),

    contactPerson:
      scoutAcademiesDOM
        .recommendedAcademyContact
        ?.value
        .trim(),

    email:
      scoutAcademiesDOM
        .recommendedAcademyEmail
        ?.value
        .trim(),

    phone:
      scoutAcademiesDOM
        .recommendedAcademyPhone
        ?.value
        .trim(),

    website:
      scoutAcademiesDOM
        .recommendedAcademyWebsite
        ?.value
        .trim(),

    reason:
      scoutAcademiesDOM
        .recommendedAcademyReason
        ?.value
        .trim()
  };
}


/* =========================================================
   SUBMIT RECOMMENDATION
========================================================= */

async function submitAcademyRecommendation(
  event
) {
  event.preventDefault();

  if (
    !validateAcademyRecommendationForm()
  ) {
    showScoutAcademyNotification({
      title:
        "Check recommendation",

      message:
        "Complete the required academy information.",

      type:
        "error"
    });

    return;
  }

  const recommendation =
    collectAcademyRecommendationData();

  setButtonLoading(
    scoutAcademiesDOM
      .submitAcademyRecommendationButton,
    true
  );

  try {
    if (
      SCOUT_ACADEMIES_CONFIG
        .useMockData
    ) {
      await delay(750);
    } else {
      await scoutAcademiesApiRequest(
        SCOUT_ACADEMIES_CONFIG
          .recommendationsEndpoint,
        {
          method: "POST",
          body: recommendation
        }
      );
    }

    closeRecommendAcademyModal();

    showScoutAcademyNotification({
      title:
        "Recommendation submitted",

      message:
        `${recommendation.academyName} will be reviewed by the platform team.`,

      type:
        "success"
    });
  } catch (error) {
    console.error(
      "Unable to submit academy recommendation:",
      error
    );

    showScoutAcademyNotification({
      title:
        "Submission failed",

      message:
        error.message ||
        "The academy recommendation could not be submitted.",

      type:
        "error"
    });
  } finally {
    setButtonLoading(
      scoutAcademiesDOM
        .submitAcademyRecommendationButton,
      false
    );
  }
}


/* =========================================================
   ACADEMY MAP
========================================================= */

function renderAcademyMapList() {
  if (
    !scoutAcademiesDOM
      .academyMapList
  ) {
    return;
  }

  const academies =
    scoutAcademiesState
      .filteredAcademies
      .length
      ? scoutAcademiesState
          .filteredAcademies
      : scoutAcademiesState
          .allAcademies;

  const fragment =
    document.createDocumentFragment();

  academies.forEach(
    (academy) => {
      const item =
        createElement(
          "button",
          "scout-academy-map-item"
        );

      item.type =
        "button";

      item.dataset.academyId =
        academy.id;

      item.append(
        createElement(
          "strong",
          "",
          academy.name
        ),

        createElement(
          "span",
          "",
          getAcademyLocation(
            academy
          )
        )
      );

      fragment.append(
        item
      );
    }
  );

  scoutAcademiesDOM
    .academyMapList
    .replaceChildren(
      fragment
    );
}


function openAcademyMapModal() {
  renderAcademyMapList();

  openModal(
    scoutAcademiesDOM
      .academyMapModal,
    scoutAcademiesDOM
      .openAcademyMapButton
  );
}


function closeAcademyMapModal() {
  closeModal(
    scoutAcademiesDOM
      .academyMapModal
  );
}


/* =========================================================
   NOTIFICATIONS BUTTON
========================================================= */

function handleAcademyNotificationButton() {
  showScoutAcademyNotification({
    title:
      "Notifications",

    message:
      "Academy alerts will appear here after backend integration.",

    type:
      "info"
  });
}


/* =========================================================
   LOGOUT
========================================================= */

function openAcademyLogoutModal() {
  openModal(
    scoutAcademiesDOM
      .logoutModal,
    scoutAcademiesDOM
      .logoutButton
  );
}


function closeAcademyLogoutModal() {
  closeModal(
    scoutAcademiesDOM
      .logoutModal
  );
}


async function confirmAcademyLogout() {
  setButtonLoading(
    scoutAcademiesDOM
      .confirmLogoutButton,
    true
  );

  try {
    if (
      SCOUT_ACADEMIES_CONFIG
        .useMockData
    ) {
      await delay(550);

      localStorage.removeItem(
        "scoutAccessToken"
      );

      sessionStorage.clear();
    } else {
      await scoutAcademiesApiRequest(
        SCOUT_ACADEMIES_CONFIG
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

    showScoutAcademyNotification({
      title:
        "Logout failed",

      message:
        error.message ||
        "You could not be logged out.",

      type:
        "error"
    });

    setButtonLoading(
      scoutAcademiesDOM
        .confirmLogoutButton,
      false
    );
  }
}


/* =========================================================
   IMAGE FALLBACKS
========================================================= */

function initializeAcademyImageFallbacks() {
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

      const isCover =
        image.id ===
          "featuredAcademyImage" ||
        image.id ===
          "modalAcademyCover" ||
        image.closest(
          ".scout-academy-card-cover"
        );

      image.src =
        isCover
          ? "images/academy-cover-placeholder.jpg"
          : "images/academy-logo-placeholder.png";
    },
    true
  );
}


/* =========================================================
   GRID DELEGATION
========================================================= */

function handleAcademyGridClick(
  event
) {
  const saveButton =
    event.target.closest(
      ".scout-academy-save-button"
    );

  if (saveButton) {
    toggleSavedAcademy(
      saveButton.dataset
        .academyId,
      saveButton
    );

    return;
  }

  const viewButton =
    event.target.closest(
      ".scout-academy-view-button"
    );

  if (viewButton) {
    openAcademyDetails(
      viewButton.dataset
        .academyId,
      viewButton
    );
  }
}


/* =========================================================
   SEARCH DEBOUNCE
========================================================= */

function createAcademyDebounce(
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


const handleAcademySearchInput =
  createAcademyDebounce(
    () => {
      scoutAcademiesState
        .currentPage = 1;

      applyAcademyFiltersAndRender();
    },
    250
  );


/* =========================================================
   GLOBAL KEYBOARD EVENTS
========================================================= */

function handleAcademyGlobalKeydown(
  event
) {
  const activeModal =
    scoutAcademiesState
      .activeModal;

  if (
    event.key === "Escape"
  ) {
    if (
      activeModal ===
      scoutAcademiesDOM
        .academyDetailsModal
    ) {
      closeAcademyDetailsModal();
      return;
    }

    if (
      activeModal ===
      scoutAcademiesDOM
        .recommendAcademyModal
    ) {
      closeRecommendAcademyModal();
      return;
    }

    if (
      activeModal ===
      scoutAcademiesDOM
        .academyMapModal
    ) {
      closeAcademyMapModal();
      return;
    }

    if (
      activeModal ===
      scoutAcademiesDOM
        .logoutModal
    ) {
      closeAcademyLogoutModal();
      return;
    }

    if (
      scoutAcademiesDOM
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
   FILTER EVENTS
========================================================= */

function initializeAcademyFilterEvents() {
  scoutAcademiesDOM
    .academySearchInput
    ?.addEventListener(
      "input",
      handleAcademySearchInput
    );

  scoutAcademiesDOM
    .academyFilterToggleButton
    ?.addEventListener(
      "click",
      toggleAcademyFiltersPanel
    );

  scoutAcademiesDOM
    .applyAcademyFiltersButton
    ?.addEventListener(
      "click",
      applySelectedAcademyFilters
    );

  scoutAcademiesDOM
    .clearAcademyFiltersButton
    ?.addEventListener(
      "click",
      () => {
        clearAcademyFilters();
      }
    );

  scoutAcademiesDOM
    .emptyStateClearAcademyFiltersButton
    ?.addEventListener(
      "click",
      () => {
        clearAcademyFilters();
      }
    );

  scoutAcademiesDOM
    .academySortSelect
    ?.addEventListener(
      "change",
      (event) => {
        scoutAcademiesState.sortBy =
          event.target.value;

        scoutAcademiesState
          .currentPage = 1;

        applyAcademyFiltersAndRender();
      }
    );

  scoutAcademiesDOM
    .academyGridViewButton
    ?.addEventListener(
      "click",
      () => {
        setAcademyView(
          "grid"
        );
      }
    );

  scoutAcademiesDOM
    .academyListViewButton
    ?.addEventListener(
      "click",
      () => {
        setAcademyView(
          "list"
        );
      }
    );
}


/* =========================================================
   DIRECTORY EVENTS
========================================================= */

function initializeAcademyDirectoryEvents() {
  scoutAcademiesDOM
    .academyGrid
    ?.addEventListener(
      "click",
      handleAcademyGridClick
    );

  scoutAcademiesDOM
    .featuredViewAcademyButton
    ?.addEventListener(
      "click",
      (event) => {
        openAcademyDetails(
          event.currentTarget
            .dataset.academyId,
          event.currentTarget
        );
      }
    );

  scoutAcademiesDOM
    .featuredSaveAcademyButton
    ?.addEventListener(
      "click",
      (event) => {
        toggleSavedAcademy(
          event.currentTarget
            .dataset.academyId,
          event.currentTarget
        );
      }
    );

  scoutAcademiesDOM
    .modalSaveAcademyButton
    ?.addEventListener(
      "click",
      (event) => {
        toggleSavedAcademy(
          event.currentTarget
            .dataset.academyId,
          event.currentTarget
        );
      }
    );

  scoutAcademiesDOM
    .academyDetailsCloseButtons
    .forEach((button) => {
      button.addEventListener(
        "click",
        closeAcademyDetailsModal
      );
    });

  scoutAcademiesDOM
    .retryAcademiesButton
    ?.addEventListener(
      "click",
      loadAcademies
    );

  scoutAcademiesDOM
    .previousAcademiesPageButton
    ?.addEventListener(
      "click",
      () => {
        changeAcademyPage(
          scoutAcademiesState
            .currentPage -
          1
        );
      }
    );

  scoutAcademiesDOM
    .nextAcademiesPageButton
    ?.addEventListener(
      "click",
      () => {
        changeAcademyPage(
          scoutAcademiesState
            .currentPage +
          1
        );
      }
    );

  scoutAcademiesDOM
    .academyPaginationPages
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

        changeAcademyPage(
          Number(
            pageButton
              .dataset.page
          )
        );
      }
    );
}


/* =========================================================
   RECOMMENDATION EVENTS
========================================================= */

function initializeRecommendationEvents() {
  scoutAcademiesDOM
    .recommendAcademyButton
    ?.addEventListener(
      "click",
      openRecommendAcademyModal
    );

  scoutAcademiesDOM
    .recommendAcademyCloseButtons
    .forEach((button) => {
      button.addEventListener(
        "click",
        closeRecommendAcademyModal
      );
    });

  scoutAcademiesDOM
    .recommendAcademyForm
    ?.addEventListener(
      "submit",
      submitAcademyRecommendation
    );

  [
    scoutAcademiesDOM
      .recommendedAcademyName,

    scoutAcademiesDOM
      .recommendedAcademyType,

    scoutAcademiesDOM
      .recommendedAcademyCity,

    scoutAcademiesDOM
      .recommendedAcademyState,

    scoutAcademiesDOM
      .recommendedAcademyEmail,

    scoutAcademiesDOM
      .recommendedAcademyPhone,

    scoutAcademiesDOM
      .recommendedAcademyWebsite,

    scoutAcademiesDOM
      .recommendedAcademyReason
  ].forEach((field) => {
    field?.addEventListener(
      "input",
      () => {
        clearRecommendationFieldError(
          field
        );
      }
    );

    field?.addEventListener(
      "change",
      () => {
        clearRecommendationFieldError(
          field
        );
      }
    );
  });
}


/* =========================================================
   MAP EVENTS
========================================================= */

function initializeAcademyMapEvents() {
  scoutAcademiesDOM
    .openAcademyMapButton
    ?.addEventListener(
      "click",
      openAcademyMapModal
    );

  scoutAcademiesDOM
    .academyMapCloseButtons
    .forEach((button) => {
      button.addEventListener(
        "click",
        closeAcademyMapModal
      );
    });

  scoutAcademiesDOM
    .academyMapList
    ?.addEventListener(
      "click",
      (event) => {
        const mapItem =
          event.target.closest(
            ".scout-academy-map-item"
          );

        if (!mapItem) {
          return;
        }

        closeAcademyMapModal();

        window.setTimeout(
          () => {
            openAcademyDetails(
              mapItem.dataset
                .academyId,
              scoutAcademiesDOM
                .openAcademyMapButton
            );
          },
          80
        );
      }
    );
}


/* =========================================================
   GENERAL EVENTS
========================================================= */

function initializeAcademyGeneralEvents() {
  scoutAcademiesDOM
    .notificationButton
    ?.addEventListener(
      "click",
      handleAcademyNotificationButton
    );

  scoutAcademiesDOM
    .logoutButton
    ?.addEventListener(
      "click",
      openAcademyLogoutModal
    );

  scoutAcademiesDOM
    .logoutModalCloseButtons
    .forEach((button) => {
      button.addEventListener(
        "click",
        closeAcademyLogoutModal
      );
    });

  scoutAcademiesDOM
    .confirmLogoutButton
    ?.addEventListener(
      "click",
      confirmAcademyLogout
    );

  document.addEventListener(
    "keydown",
    handleAcademyGlobalKeydown
  );
}


/* =========================================================
   INITIALIZATION
========================================================= */

async function initializeScoutAcademiesPage() {
  initializeScoutSidebar();
  initializeAcademyFilterEvents();
  initializeAcademyDirectoryEvents();
  initializeRecommendationEvents();
  initializeAcademyMapEvents();
  initializeAcademyGeneralEvents();
  initializeAcademyImageFallbacks();

  renderScoutIdentity(
    getMockScoutIdentity()
  );

  setAcademyView(
    "grid"
  );

  await loadAcademies();
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
    initializeScoutAcademiesPage,
    {
      once: true
    }
  );
} else {
  initializeScoutAcademiesPage();
}


/* =========================================================
   BACKEND INTEGRATION NOTES
========================================================= */

/*
  Change:

  useMockData: false


  GET /api/v1/scout/academies

  Expected response:

  {
    "academies": [
      {
        "id": "academy-id",
        "name": "Academy Name",
        "type": "residential",
        "city": "Dimapur",
        "state": "Nagaland",
        "verified": true,
        "featured": false,
        "residential": true,
        "rating": 4.7,
        "playerCount": 200,
        "coachCount": 18,
        "established": 2015,
        "surface": "Artificial Turf",
        "programmes": [
          "u12",
          "u15",
          "u17"
        ],
        "facilities": [
          "Hostel",
          "Gymnasium",
          "Medical Unit"
        ],
        "description": "Academy description",
        "logo": "/uploads/academies/logo.png",
        "coverImage": "/uploads/academies/cover.jpg",
        "email": "academy@example.com",
        "phone": "+91 00000 00000",
        "website": "https://example.com",
        "saved": false,
        "listedAt": "2026-07-19"
      }
    ]
  }


  POST /api/v1/scout/academies/saved

  Body:

  {
    "academyId": "academy-id"
  }


  DELETE /api/v1/scout/academies/saved/:academyId


  POST /api/v1/scout/academies/recommendations

  Body:

  {
    "academyName": "Academy Name",
    "academyType": "residential",
    "city": "Dimapur",
    "state": "Nagaland",
    "contactPerson": "Contact Name",
    "email": "academy@example.com",
    "phone": "+91 00000 00000",
    "website": "https://example.com",
    "reason": "Recommendation details"
  }


  POST /api/v1/auth/logout
*/


/* =========================================================
   END OF SCOUT-ACADEMIES.JS
========================================================= */