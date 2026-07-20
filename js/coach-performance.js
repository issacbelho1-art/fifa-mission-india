/* =========================================================
   FIFA MISSION INDIA
   COACH PERFORMANCE PAGE
   JAVASCRIPT — PART 1A

   Includes:
   - DOM helpers
   - Sidebar controls
   - Mobile overlay
   - Escape-key handling
   - Modal utilities
   - Body scroll locking
   - Logout modal
   - Toast notification system

   Frontend only.
   Backend integration will be handled by Mr. Harsh.
========================================================= */

"use strict";


/* =========================================================
   DOM HELPERS
========================================================= */

const select = (selector, parent = document) =>
  parent.querySelector(selector);

const selectAll = (selector, parent = document) =>
  [...parent.querySelectorAll(selector)];


/* =========================================================
   PAGE ELEMENTS
========================================================= */

const coachSidebar =
  select("#coachSidebar") ||
  select(".coach-sidebar");

const coachSidebarOverlay =
  select("#coachSidebarOverlay") ||
  select(".coach-sidebar-overlay");

const coachMenuButton =
  select("#coachMenuButton") ||
  select(".coach-menu-button");

const coachSidebarCloseButton =
  select("#coachSidebarCloseButton") ||
  select(".coach-sidebar-close-button");

const coachLogoutButton =
  select("#coachLogoutButton") ||
  select(".coach-logout-button");

const logoutModalBackdrop =
  select("#logoutModalBackdrop") ||
  select("#coachLogoutModal") ||
  select(".logout-modal-backdrop");

const logoutModal =
  select("#logoutModal") ||
  logoutModalBackdrop?.querySelector(".performance-confirmation-modal");

const logoutCancelButton =
  select("#logoutCancelButton") ||
  logoutModalBackdrop?.querySelector(
    "[data-logout-cancel]"
  );

const logoutConfirmButton =
  select("#logoutConfirmButton") ||
  logoutModalBackdrop?.querySelector(
    "[data-logout-confirm]"
  );

const toastContainer =
  select("#performanceToastContainer") ||
  select(".performance-toast-container");


/* =========================================================
   PAGE STATE
========================================================= */

const performancePageState = {
  sidebarOpen: false,
  activeModal: null,
  lastFocusedElement: null
};


/* =========================================================
   BODY SCROLL LOCK
========================================================= */

function lockBodyScroll() {
  const scrollbarWidth =
    window.innerWidth -
    document.documentElement.clientWidth;

  document.body.dataset.previousOverflow =
    document.body.style.overflow || "";

  document.body.dataset.previousPaddingRight =
    document.body.style.paddingRight || "";

  document.body.style.overflow = "hidden";

  if (scrollbarWidth > 0) {
    document.body.style.paddingRight =
      `${scrollbarWidth}px`;
  }
}


function unlockBodyScroll() {
  document.body.style.overflow =
    document.body.dataset.previousOverflow || "";

  document.body.style.paddingRight =
    document.body.dataset.previousPaddingRight || "";

  delete document.body.dataset.previousOverflow;
  delete document.body.dataset.previousPaddingRight;
}


/* =========================================================
   MOBILE SIDEBAR
========================================================= */

function openCoachSidebar() {
  if (!coachSidebar) {
    return;
  }

  performancePageState.sidebarOpen = true;

  coachSidebar.classList.add("active");
  coachSidebar.classList.add("is-open");

  coachSidebar.setAttribute(
    "aria-hidden",
    "false"
  );

  coachMenuButton?.setAttribute(
    "aria-expanded",
    "true"
  );

  if (coachSidebarOverlay) {
    coachSidebarOverlay.classList.add("active");
    coachSidebarOverlay.classList.add("is-visible");

    coachSidebarOverlay.setAttribute(
      "aria-hidden",
      "false"
    );
  }

  lockBodyScroll();

  const firstFocusableElement =
    coachSidebar.querySelector(
      "a, button, input, select, textarea, [tabindex]:not([tabindex='-1'])"
    );

  window.setTimeout(() => {
    firstFocusableElement?.focus();
  }, 120);
}


function closeCoachSidebar(options = {}) {
  const {
    restoreFocus = true
  } = options;

  if (!coachSidebar) {
    return;
  }

  performancePageState.sidebarOpen = false;

  coachSidebar.classList.remove("active");
  coachSidebar.classList.remove("is-open");

  coachSidebar.setAttribute(
    "aria-hidden",
    "true"
  );

  coachMenuButton?.setAttribute(
    "aria-expanded",
    "false"
  );

  if (coachSidebarOverlay) {
    coachSidebarOverlay.classList.remove("active");
    coachSidebarOverlay.classList.remove("is-visible");

    coachSidebarOverlay.setAttribute(
      "aria-hidden",
      "true"
    );
  }

  if (!performancePageState.activeModal) {
    unlockBodyScroll();
  }

  if (restoreFocus) {
    coachMenuButton?.focus();
  }
}


function toggleCoachSidebar() {
  if (performancePageState.sidebarOpen) {
    closeCoachSidebar();
  } else {
    openCoachSidebar();
  }
}


/* =========================================================
   RESPONSIVE SIDEBAR RESET
========================================================= */

function handleSidebarViewportChange() {
  const desktopBreakpoint = 900;

  if (
    window.innerWidth > desktopBreakpoint &&
    performancePageState.sidebarOpen
  ) {
    closeCoachSidebar({
      restoreFocus: false
    });
  }
}


/* =========================================================
   GENERIC MODAL UTILITIES
========================================================= */

function getModalFocusableElements(modalElement) {
  if (!modalElement) {
    return [];
  }

  const focusableSelectors = [
    "a[href]",
    "button:not([disabled])",
    "input:not([disabled])",
    "select:not([disabled])",
    "textarea:not([disabled])",
    "[tabindex]:not([tabindex='-1'])"
  ].join(",");

  return selectAll(
    focusableSelectors,
    modalElement
  ).filter((element) => {
    return (
      !element.hasAttribute("hidden") &&
      element.getAttribute("aria-hidden") !== "true"
    );
  });
}


function openPerformanceModal(modalBackdrop) {
  if (!modalBackdrop) {
    return;
  }

  if (performancePageState.sidebarOpen) {
    closeCoachSidebar({
      restoreFocus: false
    });
  }

  if (
    performancePageState.activeModal &&
    performancePageState.activeModal !== modalBackdrop
  ) {
    closePerformanceModal(
      performancePageState.activeModal,
      {
        restoreFocus: false
      }
    );
  }

  performancePageState.lastFocusedElement =
    document.activeElement;

  performancePageState.activeModal =
    modalBackdrop;

  modalBackdrop.classList.add("active");
  modalBackdrop.classList.add("is-open");

  modalBackdrop.setAttribute(
    "aria-hidden",
    "false"
  );

  lockBodyScroll();

  const modalContent =
    modalBackdrop.querySelector(
      ".performance-modal, .performance-confirmation-modal"
    );

  const focusableElements =
    getModalFocusableElements(modalContent);

  window.setTimeout(() => {
    if (focusableElements.length > 0) {
      focusableElements[0].focus();
    } else {
      modalContent?.setAttribute(
        "tabindex",
        "-1"
      );

      modalContent?.focus();
    }
  }, 120);
}


function closePerformanceModal(
  modalBackdrop,
  options = {}
) {
  const {
    restoreFocus = true
  } = options;

  if (!modalBackdrop) {
    return;
  }

  modalBackdrop.classList.remove("active");
  modalBackdrop.classList.remove("is-open");

  modalBackdrop.setAttribute(
    "aria-hidden",
    "true"
  );

  if (
    performancePageState.activeModal ===
    modalBackdrop
  ) {
    performancePageState.activeModal = null;
  }

  if (!performancePageState.sidebarOpen) {
    unlockBodyScroll();
  }

  if (
    restoreFocus &&
    performancePageState.lastFocusedElement instanceof
      HTMLElement
  ) {
    performancePageState.lastFocusedElement.focus();
  }

  performancePageState.lastFocusedElement =
    null;
}


function closeActivePerformanceModal() {
  if (!performancePageState.activeModal) {
    return;
  }

  closePerformanceModal(
    performancePageState.activeModal
  );
}


/* =========================================================
   MODAL FOCUS TRAP
========================================================= */

function trapModalFocus(event) {
  if (
    event.key !== "Tab" ||
    !performancePageState.activeModal
  ) {
    return;
  }

  const modalContent =
    performancePageState.activeModal.querySelector(
      ".performance-modal, .performance-confirmation-modal"
    );

  const focusableElements =
    getModalFocusableElements(modalContent);

  if (focusableElements.length === 0) {
    event.preventDefault();
    return;
  }

  const firstFocusable =
    focusableElements[0];

  const lastFocusable =
    focusableElements[
      focusableElements.length - 1
    ];

  if (
    event.shiftKey &&
    document.activeElement === firstFocusable
  ) {
    event.preventDefault();
    lastFocusable.focus();
    return;
  }

  if (
    !event.shiftKey &&
    document.activeElement === lastFocusable
  ) {
    event.preventDefault();
    firstFocusable.focus();
  }
}


/* =========================================================
   LOGOUT MODAL
========================================================= */

function openLogoutModal() {
  if (!logoutModalBackdrop) {
    showPerformanceToast({
      type: "warning",
      title: "Logout unavailable",
      message:
        "The logout confirmation modal was not found."
    });

    return;
  }

  openPerformanceModal(logoutModalBackdrop);
}


function closeLogoutModal() {
  closePerformanceModal(logoutModalBackdrop);
}


function confirmCoachLogout() {
  if (!logoutConfirmButton) {
    return;
  }

  const originalContent =
    logoutConfirmButton.innerHTML;

  logoutConfirmButton.disabled = true;
  logoutConfirmButton.classList.add("loading");

  logoutConfirmButton.innerHTML = `
    <i class="fa-solid fa-spinner"></i>
    <span>Signing out...</span>
  `;

  /*
    BACKEND INTEGRATION POINT

    Mr. Harsh can replace this simulated logout
    with the real logout endpoint.

    Example:

    await fetch("/api/v1/auth/logout", {
      method: "POST",
      credentials: "include"
    });

    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");

    window.location.href = "login.html";
  */

  window.setTimeout(() => {
    logoutConfirmButton.disabled = false;
    logoutConfirmButton.classList.remove("loading");

    logoutConfirmButton.innerHTML =
      originalContent;

    closeLogoutModal();

    showPerformanceToast({
      type: "success",
      title: "Signed out",
      message:
        "Frontend logout simulation completed."
    });

    window.setTimeout(() => {
      window.location.href = "login.html";
    }, 700);
  }, 900);
}


/* =========================================================
   TOAST ICONS
========================================================= */

const performanceToastIcons = {
  success: "fa-solid fa-circle-check",
  error: "fa-solid fa-circle-xmark",
  warning: "fa-solid fa-triangle-exclamation",
  info: "fa-solid fa-circle-info"
};


/* =========================================================
   TOAST NOTIFICATION
========================================================= */

function showPerformanceToast(options = {}) {
  const {
    type = "info",
    title = "Notification",
    message = "",
    duration = 4000
  } = options;

  if (!toastContainer) {
    console.info(`${title}: ${message}`);
    return null;
  }

  const safeType =
    performanceToastIcons[type]
      ? type
      : "info";

  const toast = document.createElement("article");

  toast.className =
    `performance-toast ${safeType}`;

  toast.setAttribute(
    "role",
    safeType === "error"
      ? "alert"
      : "status"
  );

  toast.setAttribute(
    "aria-live",
    safeType === "error"
      ? "assertive"
      : "polite"
  );

  const toastIcon =
    performanceToastIcons[safeType];

  toast.innerHTML = `
    <span
      class="performance-toast-icon"
      aria-hidden="true"
    >
      <i class="${toastIcon}"></i>
    </span>

    <div class="performance-toast-content">
      <strong></strong>
      <span></span>
    </div>

    <button
      class="performance-toast-close"
      type="button"
      aria-label="Dismiss notification"
    >
      <i
        class="fa-solid fa-xmark"
        aria-hidden="true"
      ></i>
    </button>
  `;

  const titleElement =
    select(
      ".performance-toast-content strong",
      toast
    );

  const messageElement =
    select(
      ".performance-toast-content span",
      toast
    );

  const closeButton =
    select(
      ".performance-toast-close",
      toast
    );

  titleElement.textContent = title;
  messageElement.textContent = message;

  toastContainer.appendChild(toast);

  let removalTimer = null;

  function removeToast() {
    if (
      toast.classList.contains("removing")
    ) {
      return;
    }

    toast.classList.add("removing");

    window.clearTimeout(removalTimer);

    window.setTimeout(() => {
      toast.remove();
    }, 280);
  }

  closeButton?.addEventListener(
    "click",
    removeToast
  );

  if (duration > 0) {
    removalTimer = window.setTimeout(
      removeToast,
      duration
    );
  }

  return toast;
}


/* =========================================================
   BACKDROP CLICK HANDLING
========================================================= */

function handleModalBackdropClick(event) {
  const modalBackdrop =
    event.currentTarget;

  if (event.target !== modalBackdrop) {
    return;
  }

  closePerformanceModal(modalBackdrop);
}


/* =========================================================
   KEYBOARD HANDLING
========================================================= */

function handleGlobalKeydown(event) {
  if (event.key === "Escape") {
    if (performancePageState.activeModal) {
      closeActivePerformanceModal();
      return;
    }

    if (performancePageState.sidebarOpen) {
      closeCoachSidebar();
    }
  }

  trapModalFocus(event);
}


/* =========================================================
   SIDEBAR NAVIGATION ON MOBILE
========================================================= */

function handleSidebarNavigationClick(event) {
  const navigationLink =
    event.target.closest("a");

  if (!navigationLink) {
    return;
  }

  if (window.innerWidth <= 900) {
    closeCoachSidebar({
      restoreFocus: false
    });
  }
}


/* =========================================================
   EVENT LISTENERS
========================================================= */

coachMenuButton?.addEventListener(
  "click",
  toggleCoachSidebar
);

coachSidebarCloseButton?.addEventListener(
  "click",
  () => closeCoachSidebar()
);

coachSidebarOverlay?.addEventListener(
  "click",
  () => closeCoachSidebar()
);

coachSidebar?.addEventListener(
  "click",
  handleSidebarNavigationClick
);

coachLogoutButton?.addEventListener(
  "click",
  openLogoutModal
);

logoutCancelButton?.addEventListener(
  "click",
  closeLogoutModal
);

logoutConfirmButton?.addEventListener(
  "click",
  confirmCoachLogout
);

selectAll(".performance-modal-backdrop")
  .forEach((modalBackdrop) => {
    modalBackdrop.addEventListener(
      "click",
      handleModalBackdropClick
    );
  });

selectAll(
  "[data-modal-close], .performance-modal-close"
).forEach((closeButton) => {
  closeButton.addEventListener(
    "click",
    () => {
      const modalBackdrop =
        closeButton.closest(
          ".performance-modal-backdrop"
        );

      closePerformanceModal(modalBackdrop);
    }
  );
});

document.addEventListener(
  "keydown",
  handleGlobalKeydown
);

window.addEventListener(
  "resize",
  handleSidebarViewportChange
);


/* =========================================================
   INITIAL PAGE SETUP
========================================================= */

function initialisePerformancePageBase() {
  coachMenuButton?.setAttribute(
    "aria-expanded",
    "false"
  );

  if (
    coachSidebar &&
    window.innerWidth <= 900
  ) {
    coachSidebar.setAttribute(
      "aria-hidden",
      "true"
    );
  }

  coachSidebarOverlay?.setAttribute(
    "aria-hidden",
    "true"
  );

  selectAll(".performance-modal-backdrop")
    .forEach((modalBackdrop) => {
      modalBackdrop.setAttribute(
        "aria-hidden",
        "true"
      );
    });
}


/* =========================================================
   DOM READY
========================================================= */

document.addEventListener(
  "DOMContentLoaded",
  initialisePerformancePageBase
);

/* =========================================================
   FIFA MISSION INDIA
   COACH PERFORMANCE PAGE
   JAVASCRIPT — PART 1B

   Includes:
   - Filter controls
   - Refresh performance data
   - Chart period toggles
   - KPI update simulation
   - Match table filtering
   - Player ranking filtering
   - Last updated time
   - Frontend-only performance data simulation
========================================================= */


/* =========================================================
   PERFORMANCE FILTER ELEMENTS
========================================================= */

const performanceSeasonFilter =
  select("#performanceSeasonFilter");

const performanceCompetitionFilter =
  select("#performanceCompetitionFilter");

const performanceTeamFilter =
  select("#performanceTeamFilter");

const performanceRefreshButton =
  select("#performanceRefreshButton");

const performanceLastUpdated =
  select("#performanceLastUpdated");

const performanceMatchTableBody =
  select("#performanceMatchTableBody") ||
  select(".performance-match-table tbody");

const performanceRankingList =
  select("#performanceRankingList") ||
  select(".performance-ranking-list");

const performanceChartToggles =
  selectAll(".performance-chart-toggle");

const performanceChartSvg =
  select(".performance-chart-svg");

const performanceChartLine =
  select(".performance-chart-line");

const performanceChartAreaPath =
  select(".performance-chart-area-path");

const performanceChartPoints =
  select(".performance-chart-points");

const performanceChartXAxis =
  select(".performance-chart-x-axis");


/* =========================================================
   PERFORMANCE FILTER STATE
========================================================= */

const performanceFilterState = {
  season:
    performanceSeasonFilter?.value ||
    "2026",

  competition:
    performanceCompetitionFilter?.value ||
    "all",

  team:
    performanceTeamFilter?.value ||
    "senior",

  chartPeriod:
    select(
      ".performance-chart-toggle.active"
    )?.dataset.chartPeriod ||
    "season",

  refreshing: false
};


/* =========================================================
   FRONTEND PERFORMANCE DATA
========================================================= */

const performanceDataSets = {
  season: {
    labels: [
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun"
    ],

    values: [
      62,
      65,
      68,
      67,
      71,
      74,
      73,
      78,
      80,
      79,
      84,
      86
    ]
  },

  sixMonths: {
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun"
    ],

    values: [
      73,
      78,
      80,
      79,
      84,
      86
    ]
  },

  threeMonths: {
    labels: [
      "Apr",
      "May",
      "Jun"
    ],

    values: [
      79,
      84,
      86
    ]
  },

  month: {
    labels: [
      "W1",
      "W2",
      "W3",
      "W4"
    ],

    values: [
      79,
      82,
      84,
      86
    ]
  }
};


/* =========================================================
   SAMPLE MATCH DATA

   Backend integration:
   Replace this array with API response data.
========================================================= */

const performanceMatchData = [
  {
    id: 1,
    opponent: "Punjab United",
    abbreviation: "PU",
    competition: "league",
    team: "senior",
    season: "2026",
    date: "12 Jun 2026",
    venue: "Home",
    result: "win",
    score: "3–1",
    possession: "61%",
    shots: 14,
    passAccuracy: "87%",
    performanceScore: 8.7
  },

  {
    id: 2,
    opponent: "NorthEast Academy",
    abbreviation: "NE",
    competition: "cup",
    team: "senior",
    season: "2026",
    date: "05 Jun 2026",
    venue: "Away",
    result: "draw",
    score: "2–2",
    possession: "54%",
    shots: 11,
    passAccuracy: "82%",
    performanceScore: 7.8
  },

  {
    id: 3,
    opponent: "Bengal Warriors",
    abbreviation: "BW",
    competition: "league",
    team: "senior",
    season: "2026",
    date: "28 May 2026",
    venue: "Home",
    result: "win",
    score: "2–0",
    possession: "58%",
    shots: 13,
    passAccuracy: "85%",
    performanceScore: 8.4
  },

  {
    id: 4,
    opponent: "Delhi Football Club",
    abbreviation: "DFC",
    competition: "friendly",
    team: "senior",
    season: "2026",
    date: "20 May 2026",
    venue: "Away",
    result: "loss",
    score: "1–2",
    possession: "49%",
    shots: 9,
    passAccuracy: "79%",
    performanceScore: 6.9
  },

  {
    id: 5,
    opponent: "Goa Development XI",
    abbreviation: "GX",
    competition: "league",
    team: "under-18",
    season: "2026",
    date: "16 May 2026",
    venue: "Home",
    result: "win",
    score: "4–1",
    possession: "64%",
    shots: 17,
    passAccuracy: "88%",
    performanceScore: 9.1
  },

  {
    id: 6,
    opponent: "Mumbai Youth",
    abbreviation: "MY",
    competition: "cup",
    team: "under-18",
    season: "2026",
    date: "09 May 2026",
    venue: "Away",
    result: "draw",
    score: "1–1",
    possession: "52%",
    shots: 10,
    passAccuracy: "81%",
    performanceScore: 7.5
  },

  {
    id: 7,
    opponent: "Assam Rising Stars",
    abbreviation: "ARS",
    competition: "league",
    team: "under-15",
    season: "2026",
    date: "01 May 2026",
    venue: "Home",
    result: "win",
    score: "3–0",
    possession: "67%",
    shots: 16,
    passAccuracy: "90%",
    performanceScore: 9.3
  },

  {
    id: 8,
    opponent: "Shillong Juniors",
    abbreviation: "SJ",
    competition: "friendly",
    team: "under-15",
    season: "2025",
    date: "18 Dec 2025",
    venue: "Away",
    result: "loss",
    score: "0–1",
    possession: "48%",
    shots: 8,
    passAccuracy: "77%",
    performanceScore: 6.6
  }
];


/* =========================================================
   SAMPLE PLAYER RANKING DATA
========================================================= */

const performancePlayerData = [
  {
    id: 101,
    name: "Arjun Mehta",
    position: "Forward",
    team: "senior",
    season: "2026",
    competition: "league",
    appearances: 18,
    goals: 14,
    assists: 6,
    rating: 9.1,
    image: "images/players/player-1.jpg"
  },

  {
    id: 102,
    name: "Rohan Singh",
    position: "Midfielder",
    team: "senior",
    season: "2026",
    competition: "league",
    appearances: 19,
    goals: 7,
    assists: 11,
    rating: 8.8,
    image: "images/players/player-2.jpg"
  },

  {
    id: 103,
    name: "Tenzin Dorjee",
    position: "Defender",
    team: "senior",
    season: "2026",
    competition: "cup",
    appearances: 17,
    goals: 2,
    assists: 4,
    rating: 8.6,
    image: "images/players/player-3.jpg"
  },

  {
    id: 104,
    name: "Nikhil Das",
    position: "Goalkeeper",
    team: "senior",
    season: "2026",
    competition: "league",
    appearances: 16,
    goals: 0,
    assists: 1,
    rating: 8.4,
    image: "images/players/player-4.jpg"
  },

  {
    id: 105,
    name: "Aman Rai",
    position: "Forward",
    team: "under-18",
    season: "2026",
    competition: "league",
    appearances: 15,
    goals: 12,
    assists: 5,
    rating: 8.9,
    image: "images/players/player-5.jpg"
  },

  {
    id: 106,
    name: "Kunal Sharma",
    position: "Midfielder",
    team: "under-18",
    season: "2026",
    competition: "cup",
    appearances: 14,
    goals: 5,
    assists: 9,
    rating: 8.5,
    image: "images/players/player-6.jpg"
  },

  {
    id: 107,
    name: "Samuel Kikon",
    position: "Forward",
    team: "under-15",
    season: "2026",
    competition: "league",
    appearances: 13,
    goals: 11,
    assists: 4,
    rating: 9.0,
    image: "images/players/player-7.jpg"
  }
];


/* =========================================================
   SAFE NUMBER HELPER
========================================================= */

function clampNumber(
  value,
  minimum,
  maximum
) {
  return Math.min(
    Math.max(value, minimum),
    maximum
  );
}


/* =========================================================
   CHART COORDINATE GENERATOR
========================================================= */

function createPerformanceChartCoordinates(
  values,
  width = 1000,
  height = 260
) {
  if (
    !Array.isArray(values) ||
    values.length === 0
  ) {
    return [];
  }

  const chartMinimum = 40;
  const chartMaximum = 100;

  const horizontalStep =
    values.length > 1
      ? width / (values.length - 1)
      : width / 2;

  return values.map((value, index) => {
    const safeValue =
      clampNumber(
        Number(value) || chartMinimum,
        chartMinimum,
        chartMaximum
      );

    const x =
      values.length > 1
        ? horizontalStep * index
        : horizontalStep;

    const percentage =
      (safeValue - chartMinimum) /
      (chartMaximum - chartMinimum);

    const y =
      height -
      percentage * height;

    return {
      x,
      y,
      value: safeValue
    };
  });
}


/* =========================================================
   SVG PATH GENERATOR
========================================================= */

function createPerformanceLinePath(
  coordinates
) {
  if (
    !Array.isArray(coordinates) ||
    coordinates.length === 0
  ) {
    return "";
  }

  return coordinates
    .map((point, index) => {
      const command =
        index === 0
          ? "M"
          : "L";

      return `${command} ${point.x} ${point.y}`;
    })
    .join(" ");
}


function createPerformanceAreaPath(
  coordinates,
  chartHeight = 260
) {
  if (
    !Array.isArray(coordinates) ||
    coordinates.length === 0
  ) {
    return "";
  }

  const linePath =
    createPerformanceLinePath(
      coordinates
    );

  const firstPoint =
    coordinates[0];

  const lastPoint =
    coordinates[
      coordinates.length - 1
    ];

  return `
    ${linePath}
    L ${lastPoint.x} ${chartHeight}
    L ${firstPoint.x} ${chartHeight}
    Z
  `;
}


/* =========================================================
   RENDER PERFORMANCE CHART
========================================================= */

function renderPerformanceChart(
  chartPeriod = "season"
) {
  const dataSet =
    performanceDataSets[chartPeriod] ||
    performanceDataSets.season;

  if (
    !performanceChartSvg ||
    !performanceChartLine
  ) {
    return;
  }

  const chartWidth = 1000;
  const chartHeight = 260;

  const coordinates =
    createPerformanceChartCoordinates(
      dataSet.values,
      chartWidth,
      chartHeight
    );

  const linePath =
    createPerformanceLinePath(
      coordinates
    );

  const areaPath =
    createPerformanceAreaPath(
      coordinates,
      chartHeight
    );

  performanceChartLine.setAttribute(
    "d",
    linePath
  );

  performanceChartAreaPath?.setAttribute(
    "d",
    areaPath
  );

  performanceChartSvg.setAttribute(
    "viewBox",
    `0 0 ${chartWidth} ${chartHeight}`
  );

  renderPerformanceChartPoints(
    coordinates
  );

  renderPerformanceXAxis(
    dataSet.labels
  );
}


/* =========================================================
   RENDER CHART POINTS
========================================================= */

function renderPerformanceChartPoints(
  coordinates
) {
  if (!performanceChartPoints) {
    return;
  }

  performanceChartPoints.innerHTML = "";

  coordinates.forEach((point) => {
    const circle =
      document.createElementNS(
        "http://www.w3.org/2000/svg",
        "circle"
      );

    circle.setAttribute(
      "cx",
      String(point.x)
    );

    circle.setAttribute(
      "cy",
      String(point.y)
    );

    circle.setAttribute(
      "r",
      "5"
    );

    circle.setAttribute(
      "tabindex",
      "0"
    );

    circle.setAttribute(
      "role",
      "img"
    );

    circle.setAttribute(
      "aria-label",
      `Performance score ${point.value}`
    );

    const title =
      document.createElementNS(
        "http://www.w3.org/2000/svg",
        "title"
      );

    title.textContent =
      `Performance score: ${point.value}`;

    circle.appendChild(title);

    performanceChartPoints.appendChild(
      circle
    );
  });
}


/* =========================================================
   RENDER CHART X AXIS
========================================================= */

function renderPerformanceXAxis(
  labels
) {
  if (!performanceChartXAxis) {
    return;
  }

  performanceChartXAxis.innerHTML = "";

  labels.forEach((label) => {
    const labelElement =
      document.createElement("span");

    labelElement.textContent = label;

    performanceChartXAxis.appendChild(
      labelElement
    );
  });
}


/* =========================================================
   HANDLE CHART TOGGLE
========================================================= */

function handlePerformanceChartToggle(
  event
) {
  const toggleButton =
    event.currentTarget;

  const selectedPeriod =
    toggleButton.dataset.chartPeriod ||
    toggleButton.dataset.period ||
    "season";

  performanceChartToggles.forEach(
    (button) => {
      const isActive =
        button === toggleButton;

      button.classList.toggle(
        "active",
        isActive
      );

      button.setAttribute(
        "aria-pressed",
        String(isActive)
      );
    }
  );

  performanceFilterState.chartPeriod =
    selectedPeriod;

  renderPerformanceChart(
    selectedPeriod
  );
}


/* =========================================================
   FILTER MATCH DATA
========================================================= */

function getFilteredMatchData() {
  const {
    season,
    competition,
    team
  } = performanceFilterState;

  return performanceMatchData.filter(
    (match) => {
      const matchesSeason =
        season === "all" ||
        match.season === season;

      const matchesCompetition =
        competition === "all" ||
        match.competition === competition;

      const matchesTeam =
        team === "all" ||
        match.team === team;

      return (
        matchesSeason &&
        matchesCompetition &&
        matchesTeam
      );
    }
  );
}


/* =========================================================
   MATCH RESULT LABEL
========================================================= */

function getPerformanceResultLabel(
  result
) {
  const resultLabels = {
    win: "Win",
    draw: "Draw",
    loss: "Loss"
  };

  return (
    resultLabels[result] ||
    "Result"
  );
}


/* =========================================================
   RENDER MATCH TABLE
========================================================= */

function renderPerformanceMatches() {
  if (!performanceMatchTableBody) {
    return;
  }

  const filteredMatches =
    getFilteredMatchData();

  performanceMatchTableBody.innerHTML = "";

  if (filteredMatches.length === 0) {
    const emptyRow =
      document.createElement("tr");

    emptyRow.innerHTML = `
      <td colspan="9">
        <div class="performance-empty-state">
          <i
            class="fa-solid fa-chart-line"
            aria-hidden="true"
          ></i>

          <strong>No match data found</strong>

          <span>
            Try selecting another season,
            competition or team.
          </span>
        </div>
      </td>
    `;

    performanceMatchTableBody.appendChild(
      emptyRow
    );

    return;
  }

  filteredMatches.forEach((match) => {
    const row =
      document.createElement("tr");

    row.dataset.matchId =
      String(match.id);

    row.innerHTML = `
      <td>
        <div class="performance-match-opponent">
          <span
            class="performance-opponent-logo"
            aria-hidden="true"
          >
            ${match.abbreviation}
          </span>

          <div>
            <strong></strong>
            <span></span>
          </div>
        </div>
      </td>

      <td>
        ${match.date}
      </td>

      <td>
        <span
          class="performance-result-badge ${match.result}"
        >
          ${getPerformanceResultLabel(match.result)}
          &nbsp; ${match.score}
        </span>
      </td>

      <td>
        ${match.possession}
      </td>

      <td>
        ${match.shots}
      </td>

      <td>
        ${match.passAccuracy}
      </td>

      <td>
        <div class="performance-table-score">
          <strong>
            ${match.performanceScore}
          </strong>

          <span>
            / 10
          </span>
        </div>
      </td>

      <td>
        <button
          type="button"
          data-match-report="${match.id}"
          aria-label="View ${match.opponent} match report"
        >
          <i
            class="fa-solid fa-arrow-right"
            aria-hidden="true"
          ></i>
        </button>
      </td>
    `;

    const opponentName =
      select(
        ".performance-match-opponent strong",
        row
      );

    const opponentDetails =
      select(
        ".performance-match-opponent span:last-child",
        row
      );

    opponentName.textContent =
      match.opponent;

    opponentDetails.textContent =
      `${match.venue} · ${formatPerformanceCompetition(match.competition)}`;

    performanceMatchTableBody.appendChild(
      row
    );
  });
}


/* =========================================================
   FORMAT COMPETITION NAME
========================================================= */

function formatPerformanceCompetition(
  competition
) {
  const competitionLabels = {
    league: "League",
    cup: "Cup",
    friendly: "Friendly"
  };

  return (
    competitionLabels[competition] ||
    competition
  );
}


/* =========================================================
   FILTER PLAYER DATA
========================================================= */

function getFilteredPlayerData() {
  const {
    season,
    competition,
    team
  } = performanceFilterState;

  return performancePlayerData
    .filter((player) => {
      const matchesSeason =
        season === "all" ||
        player.season === season;

      const matchesCompetition =
        competition === "all" ||
        player.competition === competition;

      const matchesTeam =
        team === "all" ||
        player.team === team;

      return (
        matchesSeason &&
        matchesCompetition &&
        matchesTeam
      );
    })
    .sort(
      (playerA, playerB) =>
        playerB.rating -
        playerA.rating
    );
}


/* =========================================================
   PLAYER RANKING POSITION CLASS
========================================================= */

function getRankingPositionClass(
  index
) {
  const positionClasses = [
    "first",
    "second",
    "third"
  ];

  return (
    positionClasses[index] ||
    ""
  );
}


/* =========================================================
   RENDER PLAYER RANKINGS
========================================================= */

function renderPerformanceRankings() {
  if (!performanceRankingList) {
    return;
  }

  const filteredPlayers =
    getFilteredPlayerData();

  performanceRankingList.innerHTML = "";

  if (filteredPlayers.length === 0) {
    const emptyState =
      document.createElement("div");

    emptyState.className =
      "performance-empty-state";

    emptyState.innerHTML = `
      <i
        class="fa-solid fa-users"
        aria-hidden="true"
      ></i>

      <strong>No ranked players found</strong>

      <span>
        Change the active filters to view
        another squad.
      </span>
    `;

    performanceRankingList.appendChild(
      emptyState
    );

    return;
  }

  filteredPlayers
    .slice(0, 5)
    .forEach((player, index) => {
      const playerArticle =
        document.createElement("article");

      playerArticle.className =
        "performance-ranking-player";

      playerArticle.dataset.playerId =
        String(player.id);

      playerArticle.innerHTML = `
        <span
          class="performance-ranking-position ${getRankingPositionClass(index)}"
        >
          ${index + 1}
        </span>

        <img
          src="${player.image}"
          alt=""
          loading="lazy"
        />

        <div class="performance-ranking-info">
          <strong></strong>
          <span></span>
        </div>

        <div class="performance-ranking-metrics">
          <span>
            ${player.goals} goals
          </span>

          <span>
            ${player.assists} assists
          </span>

          <span>
            ${player.appearances} apps
          </span>
        </div>

        <strong class="performance-player-rating">
          ${player.rating}
        </strong>

        <button
          type="button"
          data-player-performance="${player.id}"
          aria-label="View ${player.name} performance"
        >
          <i
            class="fa-solid fa-chevron-right"
            aria-hidden="true"
          ></i>
        </button>
      `;

      const playerName =
        select(
          ".performance-ranking-info strong",
          playerArticle
        );

      const playerPosition =
        select(
          ".performance-ranking-info span",
          playerArticle
        );

      playerName.textContent =
        player.name;

      playerPosition.textContent =
        player.position;

      const playerImage =
        select("img", playerArticle);

      playerImage?.addEventListener(
        "error",
        () => {
          playerImage.src =
            "images/default-player.png";
        },
        {
          once: true
        }
      );

      performanceRankingList.appendChild(
        playerArticle
      );
    });
}


/* =========================================================
   UPDATE FILTER STATE
========================================================= */

function updatePerformanceFilterState() {
  performanceFilterState.season =
    performanceSeasonFilter?.value ||
    "all";

  performanceFilterState.competition =
    performanceCompetitionFilter?.value ||
    "all";

  performanceFilterState.team =
    performanceTeamFilter?.value ||
    "all";
}


/* =========================================================
   APPLY PERFORMANCE FILTERS
========================================================= */

function applyPerformanceFilters(
  options = {}
) {
  const {
    showToast = false
  } = options;

  updatePerformanceFilterState();

  renderPerformanceMatches();
  renderPerformanceRankings();
  updatePerformanceSummaryCards();

  if (showToast) {
    showPerformanceToast({
      type: "info",
      title: "Filters updated",
      message:
        "Performance analytics have been refreshed."
    });
  }
}


/* =========================================================
   UPDATE SUMMARY KPI CARDS
========================================================= */

function updatePerformanceSummaryCards() {
  const filteredMatches =
    getFilteredMatchData();

  const totalMatches =
    filteredMatches.length;

  const wins =
    filteredMatches.filter(
      (match) =>
        match.result === "win"
    ).length;

  const averageScore =
    totalMatches > 0
      ? (
          filteredMatches.reduce(
            (total, match) =>
              total +
              match.performanceScore,
            0
          ) / totalMatches
        ).toFixed(1)
      : "0.0";

  const winRate =
    totalMatches > 0
      ? Math.round(
          (wins / totalMatches) * 100
        )
      : 0;

  const totalMatchesElement =
    select(
      "[data-performance-kpi='matches']"
    );

  const winRateElement =
    select(
      "[data-performance-kpi='win-rate']"
    );

  const averageScoreElement =
    select(
      "[data-performance-kpi='average-score']"
    );

  const squadRatingElement =
    select(
      "[data-performance-kpi='squad-rating']"
    );

  if (totalMatchesElement) {
    totalMatchesElement.textContent =
      String(totalMatches);
  }

  if (winRateElement) {
    winRateElement.textContent =
      `${winRate}%`;
  }

  if (averageScoreElement) {
    averageScoreElement.textContent =
      averageScore;
  }

  if (squadRatingElement) {
    const rankedPlayers =
      getFilteredPlayerData();

    const averageRating =
      rankedPlayers.length > 0
        ? (
            rankedPlayers.reduce(
              (total, player) =>
                total +
                player.rating,
              0
            ) / rankedPlayers.length
          ).toFixed(1)
        : "0.0";

    squadRatingElement.textContent =
      averageRating;
  }

  updateSeasonSummary(
    filteredMatches
  );
}


/* =========================================================
   UPDATE SEASON SUMMARY
========================================================= */

function updateSeasonSummary(
  matches
) {
  const wins =
    matches.filter(
      (match) =>
        match.result === "win"
    ).length;

  const draws =
    matches.filter(
      (match) =>
        match.result === "draw"
    ).length;

  const losses =
    matches.filter(
      (match) =>
        match.result === "loss"
    ).length;

  const totalMatches =
    matches.length;

  const winRate =
    totalMatches > 0
      ? Math.round(
          (wins / totalMatches) * 100
        )
      : 0;

  const winsElement =
    select(
      "[data-season-stat='wins']"
    );

  const drawsElement =
    select(
      "[data-season-stat='draws']"
    );

  const lossesElement =
    select(
      "[data-season-stat='losses']"
    );

  const matchesElement =
    select(
      "[data-season-stat='matches']"
    );

  const winRateElement =
    select(
      "[data-season-stat='win-rate']"
    );

  winsElement &&
    (winsElement.textContent =
      String(wins));

  drawsElement &&
    (drawsElement.textContent =
      String(draws));

  lossesElement &&
    (lossesElement.textContent =
      String(losses));

  matchesElement &&
    (matchesElement.textContent =
      String(totalMatches));

  winRateElement &&
    (winRateElement.textContent =
      `${winRate}%`);

  const winRateCircle =
    select(
      ".performance-win-rate-circle"
    );

  if (winRateCircle) {
    const winRateDegrees =
      Math.round(
        (winRate / 100) * 360
      );

    winRateCircle.style.background = `
      conic-gradient(
        var(--coach-primary) 0deg ${winRateDegrees}deg,
        var(--coach-primary-light) ${winRateDegrees}deg 360deg
      )
    `;
  }
}


/* =========================================================
   LAST UPDATED TIME
========================================================= */

function updatePerformanceLastUpdatedTime() {
  if (!performanceLastUpdated) {
    return;
  }

  const currentTime =
    new Intl.DateTimeFormat(
      "en-IN",
      {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true
      }
    ).format(new Date());

  performanceLastUpdated.textContent =
    `Updated at ${currentTime}`;
}


/* =========================================================
   REFRESH PERFORMANCE DATA
========================================================= */

function refreshPerformanceData() {
  if (
    performanceFilterState.refreshing ||
    !performanceRefreshButton
  ) {
    return;
  }

  performanceFilterState.refreshing = true;

  const originalContent =
    performanceRefreshButton.innerHTML;

  performanceRefreshButton.disabled = true;
  performanceRefreshButton.classList.add(
    "loading"
  );

  performanceRefreshButton.innerHTML = `
    <i
      class="fa-solid fa-rotate"
      aria-hidden="true"
    ></i>

    <span>Refreshing...</span>
  `;

  /*
    BACKEND INTEGRATION POINT

    Mr. Harsh can replace this timeout
    with live API requests.

    Example:

    const response = await fetch(
      "/api/v1/coach/performance",
      {
        credentials: "include"
      }
    );

    const data = await response.json();

    Update the arrays and render functions
    using the API response.
  */

  window.setTimeout(() => {
    applyPerformanceFilters();

    renderPerformanceChart(
      performanceFilterState.chartPeriod
    );

    updatePerformanceLastUpdatedTime();

    performanceRefreshButton.disabled =
      false;

    performanceRefreshButton.classList.remove(
      "loading"
    );

    performanceRefreshButton.innerHTML =
      originalContent;

    performanceFilterState.refreshing =
      false;

    showPerformanceToast({
      type: "success",
      title: "Performance refreshed",
      message:
        "The latest frontend performance data is now displayed."
    });
  }, 900);
}


/* =========================================================
   MATCH REPORT ACTION
========================================================= */

function handlePerformanceMatchAction(
  event
) {
  const reportButton =
    event.target.closest(
      "[data-match-report]"
    );

  if (!reportButton) {
    return;
  }

  const matchId =
    Number(
      reportButton.dataset.matchReport
    );

  const selectedMatch =
    performanceMatchData.find(
      (match) =>
        match.id === matchId
    );

  if (!selectedMatch) {
    return;
  }

  showPerformanceToast({
    type: "info",
    title: "Match report",
    message:
      `${selectedMatch.opponent} report will open after backend integration.`
  });
}


/* =========================================================
   PLAYER PERFORMANCE ACTION
========================================================= */

function handlePerformancePlayerAction(
  event
) {
  const playerButton =
    event.target.closest(
      "[data-player-performance]"
    );

  if (!playerButton) {
    return;
  }

  const playerId =
    Number(
      playerButton.dataset.playerPerformance
    );

  const selectedPlayer =
    performancePlayerData.find(
      (player) =>
        player.id === playerId
    );

  if (!selectedPlayer) {
    return;
  }

  showPerformanceToast({
    type: "info",
    title: selectedPlayer.name,
    message:
      `Detailed player analytics will be connected to the player performance API.`
  });
}


/* =========================================================
   FILTER EVENT LISTENERS
========================================================= */

[
  performanceSeasonFilter,
  performanceCompetitionFilter,
  performanceTeamFilter
].forEach((filterElement) => {
  filterElement?.addEventListener(
    "change",
    () => {
      applyPerformanceFilters({
        showToast: true
      });
    }
  );
});


performanceRefreshButton?.addEventListener(
  "click",
  refreshPerformanceData
);


performanceChartToggles.forEach(
  (toggleButton) => {
    toggleButton.addEventListener(
      "click",
      handlePerformanceChartToggle
    );
  }
);


performanceMatchTableBody?.addEventListener(
  "click",
  handlePerformanceMatchAction
);


performanceRankingList?.addEventListener(
  "click",
  handlePerformancePlayerAction
);


/* =========================================================
   INITIALISE PERFORMANCE ANALYTICS
========================================================= */

function initialisePerformanceAnalytics() {
  performanceChartToggles.forEach(
    (button) => {
      const buttonPeriod =
        button.dataset.chartPeriod ||
        button.dataset.period ||
        "season";

      const isActive =
        buttonPeriod ===
        performanceFilterState.chartPeriod;

      button.classList.toggle(
        "active",
        isActive
      );

      button.setAttribute(
        "aria-pressed",
        String(isActive)
      );
    }
  );

  updatePerformanceFilterState();

  renderPerformanceChart(
    performanceFilterState.chartPeriod
  );

  renderPerformanceMatches();

  renderPerformanceRankings();

  updatePerformanceSummaryCards();

  updatePerformanceLastUpdatedTime();
}


/* =========================================================
   DOM READY
========================================================= */

document.addEventListener(
  "DOMContentLoaded",
  initialisePerformanceAnalytics
);

/* =========================================================
   FIFA MISSION INDIA
   COACH PERFORMANCE PAGE
   JAVASCRIPT — PART 1C

   Includes:
   - Assessment modal
   - Player assessment form
   - Rating sliders
   - Draft saving
   - Form validation
   - Assessment submission
   - Export modal
   - Export format selection
   - Report export simulation
========================================================= */


/* =========================================================
   ASSESSMENT MODAL ELEMENTS
========================================================= */

const performanceAssessmentModalBackdrop =
  select("#performanceAssessmentModalBackdrop") ||
  select("#performanceAssessmentModal");

const performanceAssessmentForm =
  select("#performanceAssessmentForm");

const performanceAssessmentOpenButtons =
  selectAll(
    "[data-open-assessment], #openAssessmentButton"
  );

const performanceAssessmentCancelButton =
  select(
    "[data-assessment-cancel]",
    performanceAssessmentModalBackdrop ||
      document
  );

const performanceAssessmentDraftButton =
  select(
    "[data-assessment-draft]",
    performanceAssessmentModalBackdrop ||
      document
  );

const performanceAssessmentSubmitButton =
  select(
    "[data-assessment-submit]",
    performanceAssessmentModalBackdrop ||
      document
  );

const performanceAssessmentPlayerSelect =
  select("#assessmentPlayer");

const performanceAssessmentDateInput =
  select("#assessmentDate");

const performanceAssessmentSessionSelect =
  select("#assessmentSession");

const performanceAssessmentSummary =
  select("#assessmentSummary");

const performanceAssessmentStrengths =
  select("#assessmentStrengths");

const performanceAssessmentImprovements =
  select("#assessmentImprovements");

const performanceAssessmentRecommendation =
  select("#assessmentRecommendation");

const performanceRatingInputs =
  selectAll(
    ".performance-assessment-rating-grid input[type='range']"
  );


/* =========================================================
   EXPORT MODAL ELEMENTS
========================================================= */

const performanceExportModalBackdrop =
  select("#performanceExportModalBackdrop") ||
  select("#performanceExportModal");

const performanceExportOpenButtons =
  selectAll(
    "[data-open-export], #performanceExportButton"
  );

const performanceExportForm =
  select("#performanceExportForm");

const performanceExportCancelButton =
  select(
    "[data-export-cancel]",
    performanceExportModalBackdrop ||
      document
  );

const performanceExportSubmitButton =
  select(
    "[data-export-submit]",
    performanceExportModalBackdrop ||
      document
  );

const performanceExportFormatInputs =
  selectAll(
    "input[name='exportFormat']",
    performanceExportModalBackdrop ||
      document
  );

const performanceExportStartDate =
  select("#exportStartDate");

const performanceExportEndDate =
  select("#exportEndDate");

const performanceExportIncludePlayers =
  select("#exportIncludePlayers");

const performanceExportIncludeMatches =
  select("#exportIncludeMatches");

const performanceExportIncludeInsights =
  select("#exportIncludeInsights");


/* =========================================================
   ASSESSMENT STORAGE KEY
========================================================= */

const performanceAssessmentDraftKey =
  "fifaMissionIndiaCoachPerformanceAssessmentDraft";


/* =========================================================
   SET DEFAULT ASSESSMENT DATE
========================================================= */

function setDefaultAssessmentDate() {
  if (
    !performanceAssessmentDateInput ||
    performanceAssessmentDateInput.value
  ) {
    return;
  }

  const today =
    new Date();

  const localDate =
    new Date(
      today.getTime() -
      today.getTimezoneOffset() *
        60000
    )
      .toISOString()
      .split("T")[0];

  performanceAssessmentDateInput.value =
    localDate;
}


/* =========================================================
   UPDATE RATING OUTPUT
========================================================= */

function updatePerformanceRatingOutput(
  rangeInput
) {
  if (!rangeInput) {
    return;
  }

  const outputId =
    rangeInput.dataset.output;

  const outputElement =
    outputId
      ? select(`#${outputId}`)
      : rangeInput
          .closest("label")
          ?.querySelector("output");

  if (outputElement) {
    outputElement.textContent =
      rangeInput.value;
  }

  const minimum =
    Number(rangeInput.min) || 0;

  const maximum =
    Number(rangeInput.max) || 10;

  const currentValue =
    Number(rangeInput.value) || minimum;

  const progress =
    ((currentValue - minimum) /
      (maximum - minimum)) *
    100;

  rangeInput.style.background = `
    linear-gradient(
      90deg,
      var(--coach-primary) 0%,
      var(--coach-primary) ${progress}%,
      #e8edf3 ${progress}%,
      #e8edf3 100%
    )
  `;
}


/* =========================================================
   INITIALISE RATING SLIDERS
========================================================= */

function initialisePerformanceRatingSliders() {
  performanceRatingInputs.forEach(
    (rangeInput) => {
      updatePerformanceRatingOutput(
        rangeInput
      );

      rangeInput.addEventListener(
        "input",
        () => {
          updatePerformanceRatingOutput(
            rangeInput
          );
        }
      );
    }
  );
}


/* =========================================================
   FIELD ERROR HELPERS
========================================================= */

function getPerformanceFieldWrapper(
  field
) {
  return field?.closest(
    ".performance-form-field"
  );
}


function clearPerformanceFieldError(
  field
) {
  if (!field) {
    return;
  }

  const wrapper =
    getPerformanceFieldWrapper(field);

  wrapper?.classList.remove(
    "has-error"
  );

  field.removeAttribute(
    "aria-invalid"
  );

  const errorElement =
    wrapper?.querySelector(
      ".performance-field-error"
    );

  if (errorElement) {
    errorElement.textContent = "";
  }
}


function setPerformanceFieldError(
  field,
  message
) {
  if (!field) {
    return;
  }

  const wrapper =
    getPerformanceFieldWrapper(field);

  wrapper?.classList.add(
    "has-error"
  );

  field.setAttribute(
    "aria-invalid",
    "true"
  );

  let errorElement =
    wrapper?.querySelector(
      ".performance-field-error"
    );

  if (
    !errorElement &&
    wrapper
  ) {
    errorElement =
      document.createElement("span");

    errorElement.className =
      "performance-field-error";

    wrapper.appendChild(
      errorElement
    );
  }

  if (errorElement) {
    errorElement.textContent =
      message;
  }
}


/* =========================================================
   CLEAR ASSESSMENT ERRORS
========================================================= */

function clearPerformanceAssessmentErrors() {
  if (!performanceAssessmentForm) {
    return;
  }

  selectAll(
    "input, select, textarea",
    performanceAssessmentForm
  ).forEach((field) => {
    clearPerformanceFieldError(field);
  });
}


/* =========================================================
   VALIDATE ASSESSMENT FORM
========================================================= */

function validatePerformanceAssessmentForm() {
  if (!performanceAssessmentForm) {
    return false;
  }

  clearPerformanceAssessmentErrors();

  const requiredFields = [
    {
      field:
        performanceAssessmentPlayerSelect,
      message:
        "Please select a player."
    },
    {
      field:
        performanceAssessmentDateInput,
      message:
        "Please select the assessment date."
    },
    {
      field:
        performanceAssessmentSessionSelect,
      message:
        "Please select the session type."
    },
    {
      field:
        performanceAssessmentSummary,
      message:
        "Please enter an assessment summary."
    }
  ];

  let firstInvalidField = null;

  requiredFields.forEach(
    ({ field, message }) => {
      if (!field) {
        return;
      }

      const value =
        field.value.trim();

      if (!value) {
        setPerformanceFieldError(
          field,
          message
        );

        if (!firstInvalidField) {
          firstInvalidField = field;
        }
      }
    }
  );

  if (
    performanceAssessmentSummary &&
    performanceAssessmentSummary.value
      .trim().length > 0 &&
    performanceAssessmentSummary.value
      .trim().length < 20
  ) {
    setPerformanceFieldError(
      performanceAssessmentSummary,
      "Please provide at least 20 characters."
    );

    firstInvalidField =
      firstInvalidField ||
      performanceAssessmentSummary;
  }

  firstInvalidField?.focus();

  return !firstInvalidField;
}


/* =========================================================
   COLLECT ASSESSMENT DATA
========================================================= */

function collectPerformanceAssessmentData() {
  const ratings = {};

  performanceRatingInputs.forEach(
    (input) => {
      const ratingName =
        input.name ||
        input.dataset.rating ||
        input.id;

      ratings[ratingName] =
        Number(input.value);
    }
  );

  return {
    playerId:
      performanceAssessmentPlayerSelect
        ?.value || "",

    assessmentDate:
      performanceAssessmentDateInput
        ?.value || "",

    sessionType:
      performanceAssessmentSessionSelect
        ?.value || "",

    summary:
      performanceAssessmentSummary
        ?.value.trim() || "",

    strengths:
      performanceAssessmentStrengths
        ?.value.trim() || "",

    improvements:
      performanceAssessmentImprovements
        ?.value.trim() || "",

    recommendation:
      performanceAssessmentRecommendation
        ?.value.trim() || "",

    ratings,

    savedAt:
      new Date().toISOString()
  };
}


/* =========================================================
   SAVE ASSESSMENT DRAFT
========================================================= */

function savePerformanceAssessmentDraft() {
  if (!performanceAssessmentForm) {
    return;
  }

  const assessmentData =
    collectPerformanceAssessmentData();

  try {
    localStorage.setItem(
      performanceAssessmentDraftKey,
      JSON.stringify(
        assessmentData
      )
    );

    showPerformanceToast({
      type: "success",
      title: "Draft saved",
      message:
        "Your player assessment draft has been saved on this device."
    });
  } catch (error) {
    console.error(
      "Unable to save assessment draft:",
      error
    );

    showPerformanceToast({
      type: "error",
      title: "Draft not saved",
      message:
        "The browser could not save this assessment draft."
    });
  }
}


/* =========================================================
   LOAD ASSESSMENT DRAFT
========================================================= */

function loadPerformanceAssessmentDraft() {
  if (!performanceAssessmentForm) {
    return;
  }

  let savedDraft = null;

  try {
    const storedDraft =
      localStorage.getItem(
        performanceAssessmentDraftKey
      );

    savedDraft =
      storedDraft
        ? JSON.parse(storedDraft)
        : null;
  } catch (error) {
    console.error(
      "Unable to load assessment draft:",
      error
    );
  }

  if (!savedDraft) {
    return;
  }

  if (
    performanceAssessmentPlayerSelect
  ) {
    performanceAssessmentPlayerSelect.value =
      savedDraft.playerId || "";
  }

  if (
    performanceAssessmentDateInput
  ) {
    performanceAssessmentDateInput.value =
      savedDraft.assessmentDate || "";
  }

  if (
    performanceAssessmentSessionSelect
  ) {
    performanceAssessmentSessionSelect.value =
      savedDraft.sessionType || "";
  }

  if (
    performanceAssessmentSummary
  ) {
    performanceAssessmentSummary.value =
      savedDraft.summary || "";
  }

  if (
    performanceAssessmentStrengths
  ) {
    performanceAssessmentStrengths.value =
      savedDraft.strengths || "";
  }

  if (
    performanceAssessmentImprovements
  ) {
    performanceAssessmentImprovements.value =
      savedDraft.improvements || "";
  }

  if (
    performanceAssessmentRecommendation
  ) {
    performanceAssessmentRecommendation.value =
      savedDraft.recommendation || "";
  }

  performanceRatingInputs.forEach(
    (input) => {
      const ratingName =
        input.name ||
        input.dataset.rating ||
        input.id;

      const savedValue =
        savedDraft.ratings?.[
          ratingName
        ];

      if (
        savedValue !== undefined
      ) {
        input.value =
          String(savedValue);

        updatePerformanceRatingOutput(
          input
        );
      }
    }
  );
}


/* =========================================================
   CLEAR ASSESSMENT DRAFT
========================================================= */

function clearPerformanceAssessmentDraft() {
  try {
    localStorage.removeItem(
      performanceAssessmentDraftKey
    );
  } catch (error) {
    console.error(
      "Unable to remove assessment draft:",
      error
    );
  }
}


/* =========================================================
   RESET ASSESSMENT FORM
========================================================= */

function resetPerformanceAssessmentForm() {
  if (!performanceAssessmentForm) {
    return;
  }

  performanceAssessmentForm.reset();

  clearPerformanceAssessmentErrors();

  setDefaultAssessmentDate();

  performanceRatingInputs.forEach(
    (input) => {
      const defaultValue =
        input.dataset.defaultValue ||
        input.defaultValue ||
        "5";

      input.value =
        defaultValue;

      updatePerformanceRatingOutput(
        input
      );
    }
  );
}


/* =========================================================
   OPEN ASSESSMENT MODAL
========================================================= */

function openPerformanceAssessmentModal(
  event
) {
  const triggerButton =
    event?.currentTarget;

  const playerId =
    triggerButton?.dataset.playerId ||
    triggerButton?.dataset.assessmentPlayer;

  if (
    playerId &&
    performanceAssessmentPlayerSelect
  ) {
    performanceAssessmentPlayerSelect.value =
      playerId;
  }

  setDefaultAssessmentDate();

  openPerformanceModal(
    performanceAssessmentModalBackdrop
  );
}


/* =========================================================
   CLOSE ASSESSMENT MODAL
========================================================= */

function closePerformanceAssessmentModal() {
  closePerformanceModal(
    performanceAssessmentModalBackdrop
  );
}


/* =========================================================
   SUBMIT ASSESSMENT
========================================================= */

function submitPerformanceAssessment(
  event
) {
  event?.preventDefault();

  if (
    !validatePerformanceAssessmentForm() ||
    !performanceAssessmentSubmitButton
  ) {
    return;
  }

  const assessmentData =
    collectPerformanceAssessmentData();

  const originalContent =
    performanceAssessmentSubmitButton
      .innerHTML;

  performanceAssessmentSubmitButton
    .disabled = true;

  performanceAssessmentSubmitButton
    .classList.add("loading");

  performanceAssessmentSubmitButton
    .innerHTML = `
      <i
        class="fa-solid fa-spinner"
        aria-hidden="true"
      ></i>

      <span>Submitting...</span>
  `;

  /*
    BACKEND INTEGRATION POINT

    Mr. Harsh can replace this timeout
    with the real assessment endpoint.

    Example:

    await fetch(
      "/api/v1/coach/player-assessments",
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json"
        },
        credentials: "include",
        body: JSON.stringify(
          assessmentData
        )
      }
    );
  */

  console.info(
    "Assessment submission payload:",
    assessmentData
  );

  window.setTimeout(() => {
    performanceAssessmentSubmitButton
      .disabled = false;

    performanceAssessmentSubmitButton
      .classList.remove("loading");

    performanceAssessmentSubmitButton
      .innerHTML =
        originalContent;

    clearPerformanceAssessmentDraft();

    resetPerformanceAssessmentForm();

    closePerformanceAssessmentModal();

    showPerformanceToast({
      type: "success",
      title: "Assessment submitted",
      message:
        "The player assessment was submitted successfully in frontend simulation."
    });
  }, 1000);
}


/* =========================================================
   ASSESSMENT FIELD CHANGE
========================================================= */

function handlePerformanceAssessmentFieldChange(
  event
) {
  clearPerformanceFieldError(
    event.target
  );
}


/* =========================================================
   SET DEFAULT EXPORT DATES
========================================================= */

function setDefaultPerformanceExportDates() {
  const today = new Date();

  const endDate =
    new Date(
      today.getTime() -
      today.getTimezoneOffset() *
        60000
    )
      .toISOString()
      .split("T")[0];

  const start =
    new Date(today);

  start.setMonth(
    start.getMonth() - 6
  );

  const startDate =
    new Date(
      start.getTime() -
      start.getTimezoneOffset() *
        60000
    )
      .toISOString()
      .split("T")[0];

  if (
    performanceExportStartDate &&
    !performanceExportStartDate.value
  ) {
    performanceExportStartDate.value =
      startDate;
  }

  if (
    performanceExportEndDate &&
    !performanceExportEndDate.value
  ) {
    performanceExportEndDate.value =
      endDate;
  }

  if (
    performanceExportEndDate
  ) {
    performanceExportEndDate.max =
      endDate;
  }
}


/* =========================================================
   OPEN EXPORT MODAL
========================================================= */

function openPerformanceExportModal() {
  setDefaultPerformanceExportDates();

  openPerformanceModal(
    performanceExportModalBackdrop
  );
}


/* =========================================================
   CLOSE EXPORT MODAL
========================================================= */

function closePerformanceExportModal() {
  closePerformanceModal(
    performanceExportModalBackdrop
  );
}


/* =========================================================
   GET EXPORT FORMAT
========================================================= */

function getSelectedPerformanceExportFormat() {
  const selectedInput =
    performanceExportFormatInputs.find(
      (input) =>
        input.checked
    );

  return selectedInput?.value ||
    "pdf";
}


/* =========================================================
   VALIDATE EXPORT FORM
========================================================= */

function validatePerformanceExportForm() {
  if (
    !performanceExportStartDate ||
    !performanceExportEndDate
  ) {
    return true;
  }

  clearPerformanceFieldError(
    performanceExportStartDate
  );

  clearPerformanceFieldError(
    performanceExportEndDate
  );

  if (
    !performanceExportStartDate.value
  ) {
    setPerformanceFieldError(
      performanceExportStartDate,
      "Please select a start date."
    );

    performanceExportStartDate.focus();

    return false;
  }

  if (
    !performanceExportEndDate.value
  ) {
    setPerformanceFieldError(
      performanceExportEndDate,
      "Please select an end date."
    );

    performanceExportEndDate.focus();

    return false;
  }

  const startDate =
    new Date(
      `${performanceExportStartDate.value}T00:00:00`
    );

  const endDate =
    new Date(
      `${performanceExportEndDate.value}T00:00:00`
    );

  if (
    startDate > endDate
  ) {
    setPerformanceFieldError(
      performanceExportEndDate,
      "End date must be after the start date."
    );

    performanceExportEndDate.focus();

    return false;
  }

  return true;
}


/* =========================================================
   COLLECT EXPORT OPTIONS
========================================================= */

function collectPerformanceExportOptions() {
  return {
    format:
      getSelectedPerformanceExportFormat(),

    startDate:
      performanceExportStartDate
        ?.value || "",

    endDate:
      performanceExportEndDate
        ?.value || "",

    includePlayers:
      performanceExportIncludePlayers
        ? performanceExportIncludePlayers.checked
        : true,

    includeMatches:
      performanceExportIncludeMatches
        ? performanceExportIncludeMatches.checked
        : true,

    includeInsights:
      performanceExportIncludeInsights
        ? performanceExportIncludeInsights.checked
        : true,

    filters: {
      ...performanceFilterState
    }
  };
}


/* =========================================================
   FORMAT EXPORT TYPE
========================================================= */

function formatPerformanceExportType(
  format
) {
  const labels = {
    pdf: "PDF",
    csv: "CSV",
    excel: "Excel",
    print: "Print"
  };

  return labels[format] ||
    format.toUpperCase();
}


/* =========================================================
   EXPORT PERFORMANCE REPORT
========================================================= */

function exportPerformanceReport(
  event
) {
  event?.preventDefault();

  if (
    !validatePerformanceExportForm() ||
    !performanceExportSubmitButton
  ) {
    return;
  }

  const exportOptions =
    collectPerformanceExportOptions();

  const originalContent =
    performanceExportSubmitButton
      .innerHTML;

  performanceExportSubmitButton
    .disabled = true;

  performanceExportSubmitButton
    .classList.add("loading");

  performanceExportSubmitButton
    .innerHTML = `
      <i
        class="fa-solid fa-spinner"
        aria-hidden="true"
      ></i>

      <span>Preparing...</span>
  `;

  /*
    BACKEND INTEGRATION POINT

    Mr. Harsh can connect this to a
    server-generated report endpoint.

    Example:

    POST /api/v1/coach/performance/export

    The server may return a PDF, Excel
    or CSV file download URL.
  */

  console.info(
    "Performance export options:",
    exportOptions
  );

  window.setTimeout(() => {
    performanceExportSubmitButton
      .disabled = false;

    performanceExportSubmitButton
      .classList.remove("loading");

    performanceExportSubmitButton
      .innerHTML =
        originalContent;

    closePerformanceExportModal();

    showPerformanceToast({
      type: "success",
      title: "Report prepared",
      message:
        `${formatPerformanceExportType(
          exportOptions.format
        )} performance export simulation completed.`
    });
  }, 1000);
}


/* =========================================================
   EXPORT FORMAT ACCESSIBILITY
========================================================= */

function handlePerformanceExportFormatChange(
  selectedInput
) {
  performanceExportFormatInputs.forEach(
    (input) => {
      const option =
        input.closest(
          ".performance-export-option"
        );

      option?.setAttribute(
        "aria-selected",
        String(
          input === selectedInput
        )
      );
    }
  );
}


/* =========================================================
   ASSESSMENT EVENT LISTENERS
========================================================= */

performanceAssessmentOpenButtons.forEach(
  (button) => {
    button.addEventListener(
      "click",
      openPerformanceAssessmentModal
    );
  }
);

performanceAssessmentCancelButton
  ?.addEventListener(
    "click",
    closePerformanceAssessmentModal
  );

performanceAssessmentDraftButton
  ?.addEventListener(
    "click",
    savePerformanceAssessmentDraft
  );

performanceAssessmentForm
  ?.addEventListener(
    "submit",
    submitPerformanceAssessment
  );

performanceAssessmentForm
  ?.addEventListener(
    "input",
    handlePerformanceAssessmentFieldChange
  );

performanceAssessmentForm
  ?.addEventListener(
    "change",
    handlePerformanceAssessmentFieldChange
  );


/* =========================================================
   EXPORT EVENT LISTENERS
========================================================= */

performanceExportOpenButtons.forEach(
  (button) => {
    button.addEventListener(
      "click",
      openPerformanceExportModal
    );
  }
);

performanceExportCancelButton
  ?.addEventListener(
    "click",
    closePerformanceExportModal
  );

performanceExportForm
  ?.addEventListener(
    "submit",
    exportPerformanceReport
  );

performanceExportStartDate
  ?.addEventListener(
    "change",
    () => {
      clearPerformanceFieldError(
        performanceExportStartDate
      );
    }
  );

performanceExportEndDate
  ?.addEventListener(
    "change",
    () => {
      clearPerformanceFieldError(
        performanceExportEndDate
      );
    }
  );

performanceExportFormatInputs.forEach(
  (input) => {
    input.addEventListener(
      "change",
      () => {
        handlePerformanceExportFormatChange(
          input
        );
      }
    );
  }
);


/* =========================================================
   INITIALISE FORMS
========================================================= */

function initialisePerformanceForms() {
  setDefaultAssessmentDate();

  initialisePerformanceRatingSliders();

  loadPerformanceAssessmentDraft();

  setDefaultPerformanceExportDates();

  const selectedExportFormat =
    performanceExportFormatInputs.find(
      (input) =>
        input.checked
    );

  if (selectedExportFormat) {
    handlePerformanceExportFormatChange(
      selectedExportFormat
    );
  }
}


/* =========================================================
   DOM READY
========================================================= */

document.addEventListener(
  "DOMContentLoaded",
  initialisePerformanceForms
);

/* =========================================================
   FIFA MISSION INDIA
   COACH PERFORMANCE PAGE
   JAVASCRIPT — PART 1D

   Includes:
   - Global search
   - Profile dropdown
   - Notification dropdown
   - Insight actions
   - View-all player action
   - Development card animation
   - Progress bar animation
   - Availability interactions
   - Image fallback handling
   - Final page initialisation

   Frontend only.
========================================================= */


/* =========================================================
   TOPBAR ELEMENTS
========================================================= */

const performanceSearchInput =
  select("#coachGlobalSearch") ||
  select("#performanceGlobalSearch") ||
  select(".coach-global-search input");

const performanceSearchResults =
  select("#performanceSearchResults") ||
  select(".performance-search-results");

const performanceProfileButton =
  select("#coachProfileButton") ||
  select(".coach-profile-button");

const performanceProfileDropdown =
  select("#coachProfileDropdown") ||
  select(".coach-profile-dropdown");

const performanceNotificationButton =
  select("#coachNotificationButton") ||
  select(".coach-notification-button");

const performanceNotificationDropdown =
  select("#coachNotificationDropdown") ||
  select(".coach-notification-dropdown");

const performanceViewAllPlayersButton =
  select("#performanceViewAllPlayers") ||
  select(".performance-view-all-button");

const performanceInsightButtons =
  selectAll(
    ".performance-insight-card button"
  );

const performanceDevelopmentCards =
  selectAll(
    ".performance-development-card"
  );

const performanceProgressBars =
  selectAll(
    ".performance-progress-track span"
  );

const performanceAvailabilityCard =
  select(".performance-availability-card");

const performanceInjuryItems =
  selectAll(
    ".performance-injury-list article"
  );


/* =========================================================
   SEARCH DATA
========================================================= */

const performanceSearchData = [
  {
    title: "Team performance",
    description:
      "View the complete squad performance overview.",
    type: "section",
    target:
      ".performance-primary-grid",
    icon:
      "fa-solid fa-chart-line"
  },

  {
    title: "Player rankings",
    description:
      "Review the highest-rated players in the squad.",
    type: "section",
    target:
      ".performance-ranking-card",
    icon:
      "fa-solid fa-ranking-star"
  },

  {
    title: "Development metrics",
    description:
      "Review technical, physical and tactical progress.",
    type: "section",
    target:
      ".performance-development-section",
    icon:
      "fa-solid fa-arrow-trend-up"
  },

  {
    title: "Match analysis",
    description:
      "Review recent match performance statistics.",
    type: "section",
    target:
      ".performance-match-analysis-section",
    icon:
      "fa-solid fa-futbol"
  },

  {
    title: "Player availability",
    description:
      "Review available, doubtful and unavailable players.",
    type: "section",
    target:
      ".performance-availability-card",
    icon:
      "fa-solid fa-user-check"
  },

  {
    title: "Coaching insights",
    description:
      "Review priority recommendations and opportunities.",
    type: "section",
    target:
      ".performance-insights-section",
    icon:
      "fa-solid fa-lightbulb"
  },

  ...performancePlayerData.map(
    (player) => ({
      title: player.name,
      description:
        `${player.position} · Rating ${player.rating}`,
      type: "player",
      playerId: player.id,
      icon:
        "fa-solid fa-user"
    })
  ),

  ...performanceMatchData.map(
    (match) => ({
      title: match.opponent,
      description:
        `${match.date} · ${match.score}`,
      type: "match",
      matchId: match.id,
      icon:
        "fa-solid fa-shield-halved"
    })
  )
];


/* =========================================================
   DROPDOWN HELPERS
========================================================= */

function closePerformanceDropdowns(
  exception = null
) {
  [
    performanceProfileDropdown,
    performanceNotificationDropdown,
    performanceSearchResults
  ].forEach((dropdown) => {
    if (
      !dropdown ||
      dropdown === exception
    ) {
      return;
    }

    dropdown.classList.remove(
      "active",
      "is-open"
    );

    dropdown.setAttribute(
      "aria-hidden",
      "true"
    );
  });

  if (
    exception !==
    performanceProfileDropdown
  ) {
    performanceProfileButton
      ?.setAttribute(
        "aria-expanded",
        "false"
      );
  }

  if (
    exception !==
    performanceNotificationDropdown
  ) {
    performanceNotificationButton
      ?.setAttribute(
        "aria-expanded",
        "false"
      );
  }
}


function togglePerformanceDropdown(
  button,
  dropdown
) {
  if (
    !button ||
    !dropdown
  ) {
    return;
  }

  const willOpen =
    !dropdown.classList.contains(
      "active"
    );

  closePerformanceDropdowns(
    willOpen
      ? dropdown
      : null
  );

  dropdown.classList.toggle(
    "active",
    willOpen
  );

  dropdown.classList.toggle(
    "is-open",
    willOpen
  );

  dropdown.setAttribute(
    "aria-hidden",
    String(!willOpen)
  );

  button.setAttribute(
    "aria-expanded",
    String(willOpen)
  );
}


/* =========================================================
   PROFILE DROPDOWN
========================================================= */

function togglePerformanceProfileDropdown(
  event
) {
  event.stopPropagation();

  togglePerformanceDropdown(
    performanceProfileButton,
    performanceProfileDropdown
  );
}


/* =========================================================
   NOTIFICATION DROPDOWN
========================================================= */

function togglePerformanceNotificationDropdown(
  event
) {
  event.stopPropagation();

  togglePerformanceDropdown(
    performanceNotificationButton,
    performanceNotificationDropdown
  );
}


/* =========================================================
   NORMALISE SEARCH VALUE
========================================================= */

function normalisePerformanceSearchValue(
  value
) {
  return String(value)
    .trim()
    .toLowerCase();
}


/* =========================================================
   GET SEARCH RESULTS
========================================================= */

function getPerformanceSearchResults(
  searchValue
) {
  const query =
    normalisePerformanceSearchValue(
      searchValue
    );

  if (query.length < 2) {
    return [];
  }

  return performanceSearchData
    .filter((item) => {
      const combinedText =
        `${item.title} ${item.description}`
          .toLowerCase();

      return combinedText.includes(
        query
      );
    })
    .slice(0, 6);
}


/* =========================================================
   OPEN SEARCH RESULTS
========================================================= */

function openPerformanceSearchResults() {
  if (!performanceSearchResults) {
    return;
  }

  closePerformanceDropdowns(
    performanceSearchResults
  );

  performanceSearchResults
    .classList.add(
      "active",
      "is-open"
    );

  performanceSearchResults
    .setAttribute(
      "aria-hidden",
      "false"
    );
}


/* =========================================================
   CLOSE SEARCH RESULTS
========================================================= */

function closePerformanceSearchResults() {
  if (!performanceSearchResults) {
    return;
  }

  performanceSearchResults
    .classList.remove(
      "active",
      "is-open"
    );

  performanceSearchResults
    .setAttribute(
      "aria-hidden",
      "true"
    );
}


/* =========================================================
   RENDER SEARCH RESULTS
========================================================= */

function renderPerformanceSearchResults(
  searchValue
) {
  if (!performanceSearchResults) {
    return;
  }

  const query =
    normalisePerformanceSearchValue(
      searchValue
    );

  performanceSearchResults.innerHTML = "";

  if (query.length < 2) {
    closePerformanceSearchResults();
    return;
  }

  const results =
    getPerformanceSearchResults(
      query
    );

  if (results.length === 0) {
    performanceSearchResults.innerHTML = `
      <div class="performance-search-empty">
        <i
          class="fa-solid fa-magnifying-glass"
          aria-hidden="true"
        ></i>

        <strong>No results found</strong>

        <span>
          Try another player, match or section.
        </span>
      </div>
    `;

    openPerformanceSearchResults();
    return;
  }

  results.forEach((result) => {
    const resultButton =
      document.createElement("button");

    resultButton.type = "button";

    resultButton.className =
      "performance-search-result";

    resultButton.dataset.resultType =
      result.type;

    if (result.target) {
      resultButton.dataset.target =
        result.target;
    }

    if (result.playerId) {
      resultButton.dataset.playerId =
        String(result.playerId);
    }

    if (result.matchId) {
      resultButton.dataset.matchId =
        String(result.matchId);
    }

    resultButton.innerHTML = `
      <span
        class="performance-search-result-icon"
        aria-hidden="true"
      >
        <i class="${result.icon}"></i>
      </span>

      <span class="performance-search-result-copy">
        <strong></strong>
        <small></small>
      </span>

      <i
        class="fa-solid fa-arrow-right"
        aria-hidden="true"
      ></i>
    `;

    select(
      ".performance-search-result-copy strong",
      resultButton
    ).textContent =
      result.title;

    select(
      ".performance-search-result-copy small",
      resultButton
    ).textContent =
      result.description;

    performanceSearchResults.appendChild(
      resultButton
    );
  });

  openPerformanceSearchResults();
}


/* =========================================================
   SCROLL TO PERFORMANCE SECTION
========================================================= */

function scrollToPerformanceSection(
  selector
) {
  const targetSection =
    select(selector);

  if (!targetSection) {
    return;
  }

  targetSection.scrollIntoView({
    behavior: "smooth",
    block: "start"
  });

  targetSection.classList.add(
    "performance-highlight"
  );

  window.setTimeout(() => {
    targetSection.classList.remove(
      "performance-highlight"
    );
  }, 1400);
}


/* =========================================================
   HANDLE SEARCH RESULT ACTION
========================================================= */

function handlePerformanceSearchResultClick(
  event
) {
  const resultButton =
    event.target.closest(
      ".performance-search-result"
    );

  if (!resultButton) {
    return;
  }

  const resultType =
    resultButton.dataset.resultType;

  if (
    resultType === "section" &&
    resultButton.dataset.target
  ) {
    scrollToPerformanceSection(
      resultButton.dataset.target
    );
  }

  if (
    resultType === "player" &&
    resultButton.dataset.playerId
  ) {
    const playerId =
      Number(
        resultButton.dataset.playerId
      );

    const player =
      performancePlayerData.find(
        (item) =>
          item.id === playerId
      );

    if (player) {
      showPerformanceToast({
        type: "info",
        title: player.name,
        message:
          `${player.position} · Current rating ${player.rating}.`
      });

      scrollToPerformanceSection(
        ".performance-ranking-card"
      );
    }
  }

  if (
    resultType === "match" &&
    resultButton.dataset.matchId
  ) {
    const matchId =
      Number(
        resultButton.dataset.matchId
      );

    const match =
      performanceMatchData.find(
        (item) =>
          item.id === matchId
      );

    if (match) {
      showPerformanceToast({
        type: "info",
        title: match.opponent,
        message:
          `${match.date} · ${match.score} · Rating ${match.performanceScore}.`
      });

      scrollToPerformanceSection(
        ".performance-match-analysis-section"
      );
    }
  }

  performanceSearchInput.value = "";

  closePerformanceSearchResults();
}


/* =========================================================
   HANDLE GLOBAL SEARCH
========================================================= */

function handlePerformanceGlobalSearch(
  event
) {
  renderPerformanceSearchResults(
    event.target.value
  );
}


/* =========================================================
   SEARCH KEYBOARD CONTROLS
========================================================= */

function handlePerformanceSearchKeydown(
  event
) {
  if (
    event.key === "Escape"
  ) {
    closePerformanceSearchResults();

    performanceSearchInput?.blur();

    return;
  }

  if (
    event.key !== "ArrowDown"
  ) {
    return;
  }

  const firstResult =
    performanceSearchResults
      ?.querySelector(
        ".performance-search-result"
      );

  if (firstResult) {
    event.preventDefault();
    firstResult.focus();
  }
}


/* =========================================================
   SEARCH RESULT KEYBOARD NAVIGATION
========================================================= */

function handlePerformanceSearchResultKeydown(
  event
) {
  const currentResult =
    event.target.closest(
      ".performance-search-result"
    );

  if (!currentResult) {
    return;
  }

  const results =
    selectAll(
      ".performance-search-result",
      performanceSearchResults
    );

  const currentIndex =
    results.indexOf(
      currentResult
    );

  if (
    event.key === "ArrowDown"
  ) {
    event.preventDefault();

    const nextResult =
      results[
        currentIndex + 1
      ] || results[0];

    nextResult?.focus();
  }

  if (
    event.key === "ArrowUp"
  ) {
    event.preventDefault();

    if (currentIndex === 0) {
      performanceSearchInput?.focus();
      return;
    }

    results[
      currentIndex - 1
    ]?.focus();
  }

  if (
    event.key === "Escape"
  ) {
    closePerformanceSearchResults();
    performanceSearchInput?.focus();
  }
}


/* =========================================================
   VIEW ALL PLAYERS
========================================================= */

function handlePerformanceViewAllPlayers() {
  /*
    BACKEND / ROUTING INTEGRATION POINT

    Replace the toast with:
    window.location.href =
      "coach-players.html";
  */

  showPerformanceToast({
    type: "info",
    title: "Player directory",
    message:
      "The complete player directory will open from the Coach Players page."
  });
}


/* =========================================================
   COACHING INSIGHT ACTIONS
========================================================= */

function handlePerformanceInsightAction(
  event
) {
  const insightCard =
    event.currentTarget.closest(
      ".performance-insight-card"
    );

  const insightTitle =
    insightCard
      ?.querySelector("h3")
      ?.textContent
      ?.trim() ||
    "Coaching insight";

  const insightType =
    insightCard?.classList.contains(
      "priority"
    )
      ? "warning"
      : insightCard?.classList.contains(
          "positive"
        )
        ? "success"
        : "info";

  showPerformanceToast({
    type: insightType,
    title: insightTitle,
    message:
      "Detailed recommendations will be connected to the coaching analytics API."
  });
}


/* =========================================================
   AVAILABILITY PLAYER ACTION
========================================================= */

function handlePerformanceAvailabilityAction(
  event
) {
  const injuryItem =
    event.target.closest(
      ".performance-injury-list article"
    );

  if (!injuryItem) {
    return;
  }

  const playerName =
    injuryItem
      .querySelector("strong")
      ?.textContent
      ?.trim() ||
    "Player";

  const injuryStatus =
    injuryItem
      .querySelector("small")
      ?.textContent
      ?.trim() ||
    "Status pending";

  showPerformanceToast({
    type:
      injuryStatus
        .toLowerCase()
        .includes("unavailable")
        ? "error"
        : "warning",

    title: playerName,

    message:
      `${injuryStatus}. Medical details will be available after backend integration.`
  });
}


/* =========================================================
   ANIMATE PROGRESS BARS
========================================================= */

function animatePerformanceProgressBars() {
  if (
    performanceProgressBars.length === 0
  ) {
    return;
  }

  const progressObserver =
    new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          const progressBar =
            entry.target;

          const targetWidth =
            progressBar.dataset.progress ||
            progressBar.style.width ||
            "0%";

          progressBar.style.width =
            "0%";

          requestAnimationFrame(() => {
            progressBar.style.transition =
              "width 900ms cubic-bezier(0.22, 1, 0.36, 1)";

            progressBar.style.width =
              targetWidth;
          });

          observer.unobserve(
            progressBar
          );
        });
      },
      {
        threshold: 0.25
      }
    );

  performanceProgressBars.forEach(
    (progressBar) => {
      if (
        !progressBar.dataset.progress
      ) {
        progressBar.dataset.progress =
          progressBar.style.width ||
          "0%";
      }

      progressObserver.observe(
        progressBar
      );
    }
  );
}


/* =========================================================
   ANIMATE DEVELOPMENT CARDS
========================================================= */

function animatePerformanceDevelopmentCards() {
  if (
    performanceDevelopmentCards.length === 0
  ) {
    return;
  }

  const cardObserver =
    new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          const card =
            entry.target;

          const cardIndex =
            performanceDevelopmentCards
              .indexOf(card);

          window.setTimeout(() => {
            card.classList.add(
              "is-visible"
            );
          }, cardIndex * 90);

          observer.unobserve(card);
        });
      },
      {
        threshold: 0.16
      }
    );

  performanceDevelopmentCards.forEach(
    (card) => {
      card.classList.add(
        "performance-reveal-card"
      );

      cardObserver.observe(card);
    }
  );
}


/* =========================================================
   GLOBAL IMAGE FALLBACK
========================================================= */

function initialisePerformanceImageFallbacks() {
  selectAll(
    "img",
    select(".coach-performance-page") ||
      document
  ).forEach((image) => {
    image.addEventListener(
      "error",
      () => {
        const fallbackImage =
          image.dataset.fallback ||
          "images/default-player.png";

        if (
          image.src.endsWith(
            fallbackImage
          )
        ) {
          return;
        }

        image.src =
          fallbackImage;
      },
      {
        once: true
      }
    );
  });
}


/* =========================================================
   DOCUMENT CLICK
========================================================= */

function handlePerformanceDocumentClick(
  event
) {
  const clickedInsideProfile =
    performanceProfileButton
      ?.contains(event.target) ||
    performanceProfileDropdown
      ?.contains(event.target);

  const clickedInsideNotifications =
    performanceNotificationButton
      ?.contains(event.target) ||
    performanceNotificationDropdown
      ?.contains(event.target);

  const clickedInsideSearch =
    performanceSearchInput
      ?.contains(event.target) ||
    performanceSearchResults
      ?.contains(event.target);

  if (
    !clickedInsideProfile &&
    !clickedInsideNotifications &&
    !clickedInsideSearch
  ) {
    closePerformanceDropdowns();
  }
}


/* =========================================================
   FINAL KEYBOARD HANDLING
========================================================= */

function handlePerformanceInterfaceKeydown(
  event
) {
  if (
    event.key !== "Escape"
  ) {
    return;
  }

  closePerformanceDropdowns();
}


/* =========================================================
   EVENT LISTENERS
========================================================= */

performanceProfileButton
  ?.addEventListener(
    "click",
    togglePerformanceProfileDropdown
  );

performanceNotificationButton
  ?.addEventListener(
    "click",
    togglePerformanceNotificationDropdown
  );

performanceSearchInput
  ?.addEventListener(
    "input",
    handlePerformanceGlobalSearch
  );

performanceSearchInput
  ?.addEventListener(
    "keydown",
    handlePerformanceSearchKeydown
  );

performanceSearchResults
  ?.addEventListener(
    "click",
    handlePerformanceSearchResultClick
  );

performanceSearchResults
  ?.addEventListener(
    "keydown",
    handlePerformanceSearchResultKeydown
  );

performanceViewAllPlayersButton
  ?.addEventListener(
    "click",
    handlePerformanceViewAllPlayers
  );

performanceInsightButtons.forEach(
  (button) => {
    button.addEventListener(
      "click",
      handlePerformanceInsightAction
    );
  }
);

performanceAvailabilityCard
  ?.addEventListener(
    "click",
    handlePerformanceAvailabilityAction
  );

document.addEventListener(
  "click",
  handlePerformanceDocumentClick
);

document.addEventListener(
  "keydown",
  handlePerformanceInterfaceKeydown
);


/* =========================================================
   INITIAL ACCESSIBILITY ATTRIBUTES
========================================================= */

function initialisePerformanceDropdownAccessibility() {
  performanceProfileButton
    ?.setAttribute(
      "aria-expanded",
      "false"
    );

  performanceNotificationButton
    ?.setAttribute(
      "aria-expanded",
      "false"
    );

  performanceProfileDropdown
    ?.setAttribute(
      "aria-hidden",
      "true"
    );

  performanceNotificationDropdown
    ?.setAttribute(
      "aria-hidden",
      "true"
    );

  performanceSearchResults
    ?.setAttribute(
      "aria-hidden",
      "true"
    );
}


/* =========================================================
   FINAL PAGE INITIALISATION
========================================================= */

function initialisePerformancePageEnhancements() {
  initialisePerformanceDropdownAccessibility();

  initialisePerformanceImageFallbacks();

  animatePerformanceProgressBars();

  animatePerformanceDevelopmentCards();

  performanceInjuryItems.forEach(
    (item) => {
      item.setAttribute(
        "tabindex",
        "0"
      );

      item.setAttribute(
        "role",
        "button"
      );
    }
  );
}


/* =========================================================
   DOM READY
========================================================= */

document.addEventListener(
  "DOMContentLoaded",
  initialisePerformancePageEnhancements
);

/* =========================================================
   FIFA MISSION INDIA
   COACH PERFORMANCE PAGE
   JAVASCRIPT — PART 1E

   Includes:
   - Match report modal simulation
   - Player performance modal simulation
   - Print report action
   - Download button actions
   - Notification interactions
   - Mark notifications as read
   - Profile dropdown actions
   - Keyboard accessibility
   - Counter animations
   - Reveal animations
   - Final defensive setup
   - Page cleanup

   Frontend only.
========================================================= */


/* =========================================================
   ADDITIONAL ACTION ELEMENTS
========================================================= */

const performancePrintButtons =
  selectAll(
    "[data-print-performance], #performancePrintButton"
  );

const performanceDownloadButtons =
  selectAll(
    "[data-download-performance]"
  );

const performanceMatchReportButtons =
  selectAll(
    "[data-view-match-report]"
  );

const performancePlayerDetailButtons =
  selectAll(
    "[data-view-player-performance]"
  );

const performanceNotificationItems =
  selectAll(
    ".coach-notification-item"
  );

const performanceMarkAllNotificationsButton =
  select("#markAllNotificationsRead") ||
  select("[data-mark-all-notifications]");

const performanceNotificationBadge =
  select(".coach-notification-badge");

const performanceProfileActionLinks =
  selectAll(
    ".coach-profile-dropdown a, .coach-profile-dropdown button"
  );

const performanceAnimatedCounters =
  selectAll(
    "[data-animate-counter]"
  );

const performanceRevealElements =
  selectAll(
    "[data-performance-reveal]"
  );


/* =========================================================
   GENERAL FORMAT HELPERS
========================================================= */

function formatPerformanceTeamName(
  team
) {
  const teamNames = {
    senior: "Senior Team",
    "under-18": "Under-18 Team",
    "under-15": "Under-15 Team",
    all: "All Teams"
  };

  return (
    teamNames[team] ||
    team
  );
}


function formatPerformanceSeason(
  season
) {
  if (
    !season ||
    season === "all"
  ) {
    return "All Seasons";
  }

  return `Season ${season}`;
}


/* =========================================================
   FIND MATCH
========================================================= */

function getPerformanceMatchById(
  matchId
) {
  return performanceMatchData.find(
    (match) =>
      match.id === Number(matchId)
  );
}


/* =========================================================
   FIND PLAYER
========================================================= */

function getPerformancePlayerById(
  playerId
) {
  return performancePlayerData.find(
    (player) =>
      player.id === Number(playerId)
  );
}


/* =========================================================
   MATCH REPORT PANEL
========================================================= */

function showPerformanceMatchReport(
  matchId
) {
  const match =
    getPerformanceMatchById(
      matchId
    );

  if (!match) {
    showPerformanceToast({
      type: "error",
      title: "Report unavailable",
      message:
        "The selected match report could not be found."
    });

    return;
  }

  const reportBackdrop =
    document.createElement("div");

  reportBackdrop.className =
    "performance-modal-backdrop performance-dynamic-modal";

  reportBackdrop.setAttribute(
    "aria-hidden",
    "true"
  );

  reportBackdrop.innerHTML = `
    <section
      class="performance-modal performance-export-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="dynamicMatchReportTitle"
    >
      <header class="performance-modal-header">
        <div>
          <span>Match Analysis</span>

          <h2 id="dynamicMatchReportTitle">
            Match Performance Report
          </h2>

          <p>
            Frontend overview of the selected
            match performance.
          </p>
        </div>

        <button
          class="performance-modal-close"
          type="button"
          aria-label="Close match report"
          data-dynamic-modal-close
        >
          <i
            class="fa-solid fa-xmark"
            aria-hidden="true"
          ></i>
        </button>
      </header>

      <div class="performance-modal-body">
        <div class="performance-report-opponent">
          <span
            class="performance-opponent-logo"
            aria-hidden="true"
          >
            ${match.abbreviation}
          </span>

          <div>
            <span>
              ${match.date}
            </span>

            <h3>
              ${match.opponent}
            </h3>

            <p>
              ${match.venue}
              ·
              ${formatPerformanceCompetition(
                match.competition
              )}
            </p>
          </div>

          <span
            class="performance-result-badge ${match.result}"
          >
            ${getPerformanceResultLabel(
              match.result
            )}
            &nbsp;
            ${match.score}
          </span>
        </div>

        <div class="performance-report-stat-grid">
          <article>
            <span>Possession</span>
            <strong>${match.possession}</strong>
          </article>

          <article>
            <span>Total Shots</span>
            <strong>${match.shots}</strong>
          </article>

          <article>
            <span>Pass Accuracy</span>
            <strong>${match.passAccuracy}</strong>
          </article>

          <article>
            <span>Performance</span>
            <strong>
              ${match.performanceScore}/10
            </strong>
          </article>
        </div>

        <section class="performance-form-section">
          <div class="performance-form-section-heading">
            <span>
              <i
                class="fa-solid fa-lightbulb"
                aria-hidden="true"
              ></i>
            </span>

            <div>
              <h3>Coach Summary</h3>

              <p>
                Automated frontend placeholder
                for tactical analysis.
              </p>
            </div>
          </div>

          <p class="performance-report-summary">
            The team recorded
            ${match.possession}
            possession with
            ${match.shots}
            total shots and
            ${match.passAccuracy}
            passing accuracy.

            The overall match performance
            rating was
            ${match.performanceScore}
            out of 10.
          </p>
        </section>
      </div>

      <footer class="performance-modal-footer">
        <button
          class="performance-modal-cancel-button"
          type="button"
          data-dynamic-modal-close
        >
          Close
        </button>

        <button
          class="performance-modal-submit-button"
          type="button"
          data-dynamic-print-report
        >
          <i
            class="fa-solid fa-print"
            aria-hidden="true"
          ></i>

          <span>Print Report</span>
        </button>
      </footer>
    </section>
  `;

  document.body.appendChild(
    reportBackdrop
  );

  const closeButtons =
    selectAll(
      "[data-dynamic-modal-close]",
      reportBackdrop
    );

  const printButton =
    select(
      "[data-dynamic-print-report]",
      reportBackdrop
    );

  function removeMatchReportModal() {
    closePerformanceModal(
      reportBackdrop,
      {
        restoreFocus: true
      }
    );

    window.setTimeout(() => {
      reportBackdrop.remove();
    }, 320);
  }

  closeButtons.forEach(
    (button) => {
      button.addEventListener(
        "click",
        removeMatchReportModal
      );
    }
  );

  printButton?.addEventListener(
    "click",
    () => {
      window.print();
    }
  );

  reportBackdrop.addEventListener(
    "click",
    (event) => {
      if (
        event.target ===
        reportBackdrop
      ) {
        removeMatchReportModal();
      }
    }
  );

  openPerformanceModal(
    reportBackdrop
  );
}


/* =========================================================
   PLAYER PERFORMANCE PANEL
========================================================= */

function showPerformancePlayerReport(
  playerId
) {
  const player =
    getPerformancePlayerById(
      playerId
    );

  if (!player) {
    showPerformanceToast({
      type: "error",
      title: "Player unavailable",
      message:
        "The selected player data could not be found."
    });

    return;
  }

  const playerBackdrop =
    document.createElement("div");

  playerBackdrop.className =
    "performance-modal-backdrop performance-dynamic-modal";

  playerBackdrop.setAttribute(
    "aria-hidden",
    "true"
  );

  playerBackdrop.innerHTML = `
    <section
      class="performance-modal performance-export-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="dynamicPlayerReportTitle"
    >
      <header class="performance-modal-header">
        <div>
          <span>Player Analytics</span>

          <h2 id="dynamicPlayerReportTitle">
            Player Performance
          </h2>

          <p>
            Individual player performance
            overview and current rating.
          </p>
        </div>

        <button
          class="performance-modal-close"
          type="button"
          aria-label="Close player performance"
          data-dynamic-player-close
        >
          <i
            class="fa-solid fa-xmark"
            aria-hidden="true"
          ></i>
        </button>
      </header>

      <div class="performance-modal-body">
        <div class="performance-player-report-header">
          <img
            src="${player.image}"
            alt="${player.name}"
            data-fallback="images/default-player.png"
          />

          <div>
            <span>
              ${formatPerformanceTeamName(
                player.team
              )}
            </span>

            <h3>
              ${player.name}
            </h3>

            <p>
              ${player.position}
              ·
              ${formatPerformanceSeason(
                player.season
              )}
            </p>
          </div>

          <strong>
            ${player.rating}
          </strong>
        </div>

        <div class="performance-report-stat-grid">
          <article>
            <span>Appearances</span>
            <strong>
              ${player.appearances}
            </strong>
          </article>

          <article>
            <span>Goals</span>
            <strong>
              ${player.goals}
            </strong>
          </article>

          <article>
            <span>Assists</span>
            <strong>
              ${player.assists}
            </strong>
          </article>

          <article>
            <span>Rating</span>
            <strong>
              ${player.rating}/10
            </strong>
          </article>
        </div>

        <section class="performance-form-section">
          <div class="performance-form-section-heading">
            <span>
              <i
                class="fa-solid fa-chart-simple"
                aria-hidden="true"
              ></i>
            </span>

            <div>
              <h3>Performance Summary</h3>

              <p>
                Frontend placeholder for
                detailed player analytics.
              </p>
            </div>
          </div>

          <p class="performance-report-summary">
            ${player.name}
            has registered
            ${player.goals}
            goals and
            ${player.assists}
            assists across
            ${player.appearances}
            appearances.

            The player's current overall
            performance rating is
            ${player.rating}
            out of 10.
          </p>
        </section>
      </div>

      <footer class="performance-modal-footer">
        <button
          class="performance-modal-cancel-button"
          type="button"
          data-dynamic-player-close
        >
          Close
        </button>

        <button
          class="performance-modal-submit-button"
          type="button"
          data-dynamic-player-assessment="${player.id}"
        >
          <i
            class="fa-solid fa-clipboard-check"
            aria-hidden="true"
          ></i>

          <span>Add Assessment</span>
        </button>
      </footer>
    </section>
  `;

  document.body.appendChild(
    playerBackdrop
  );

  const closeButtons =
    selectAll(
      "[data-dynamic-player-close]",
      playerBackdrop
    );

  const assessmentButton =
    select(
      "[data-dynamic-player-assessment]",
      playerBackdrop
    );

  const playerImage =
    select(
      ".performance-player-report-header img",
      playerBackdrop
    );

  playerImage?.addEventListener(
    "error",
    () => {
      playerImage.src =
        playerImage.dataset.fallback ||
        "images/default-player.png";
    },
    {
      once: true
    }
  );

  function removePlayerReportModal(
    options = {}
  ) {
    closePerformanceModal(
      playerBackdrop,
      {
        restoreFocus:
          options.restoreFocus !== false
      }
    );

    window.setTimeout(() => {
      playerBackdrop.remove();
    }, 320);
  }

  closeButtons.forEach(
    (button) => {
      button.addEventListener(
        "click",
        () => {
          removePlayerReportModal();
        }
      );
    }
  );

  assessmentButton?.addEventListener(
    "click",
    () => {
      removePlayerReportModal({
        restoreFocus: false
      });

      window.setTimeout(() => {
        if (
          performanceAssessmentPlayerSelect
        ) {
          performanceAssessmentPlayerSelect.value =
            String(player.id);
        }

        setDefaultAssessmentDate();

        openPerformanceModal(
          performanceAssessmentModalBackdrop
        );
      }, 340);
    }
  );

  playerBackdrop.addEventListener(
    "click",
    (event) => {
      if (
        event.target ===
        playerBackdrop
      ) {
        removePlayerReportModal();
      }
    }
  );

  openPerformanceModal(
    playerBackdrop
  );
}


/* =========================================================
   ENHANCED MATCH TABLE ACTION
========================================================= */

function handleEnhancedMatchReportAction(
  event
) {
  const reportButton =
    event.target.closest(
      "[data-match-report], [data-view-match-report]"
    );

  if (!reportButton) {
    return;
  }

  event.preventDefault();

  const matchId =
    reportButton.dataset.matchReport ||
    reportButton.dataset.viewMatchReport;

  showPerformanceMatchReport(
    matchId
  );
}


/* =========================================================
   ENHANCED PLAYER ACTION
========================================================= */

function handleEnhancedPlayerReportAction(
  event
) {
  const playerButton =
    event.target.closest(
      "[data-player-performance], [data-view-player-performance]"
    );

  if (!playerButton) {
    return;
  }

  event.preventDefault();

  const playerId =
    playerButton.dataset.playerPerformance ||
    playerButton.dataset.viewPlayerPerformance;

  showPerformancePlayerReport(
    playerId
  );
}


/* =========================================================
   PRINT PERFORMANCE PAGE
========================================================= */

function printPerformancePage() {
  closePerformanceDropdowns();

  showPerformanceToast({
    type: "info",
    title: "Preparing print view",
    message:
      "The performance report is ready for printing.",
    duration: 1800
  });

  window.setTimeout(() => {
    window.print();
  }, 250);
}


/* =========================================================
   DOWNLOAD ACTION
========================================================= */

function handlePerformanceDownload(
  event
) {
  const downloadButton =
    event.currentTarget;

  const downloadType =
    downloadButton.dataset.downloadPerformance ||
    "report";

  showPerformanceToast({
    type: "info",
    title: "Download preparation",
    message:
      `${downloadType.toUpperCase()} download will be connected to the report API.`
  });
}


/* =========================================================
   NOTIFICATION COUNT
========================================================= */

function updatePerformanceNotificationCount() {
  const unreadNotifications =
    performanceNotificationItems.filter(
      (item) =>
        item.classList.contains(
          "unread"
        ) ||
        item.dataset.read === "false"
    );

  if (!performanceNotificationBadge) {
    return;
  }

  const unreadCount =
    unreadNotifications.length;

  performanceNotificationBadge.textContent =
    unreadCount > 9
      ? "9+"
      : String(unreadCount);

  performanceNotificationBadge.hidden =
    unreadCount === 0;

  performanceNotificationButton
    ?.setAttribute(
      "aria-label",
      unreadCount > 0
        ? `${unreadCount} unread notifications`
        : "No unread notifications"
    );
}


/* =========================================================
   MARK NOTIFICATION READ
========================================================= */

function markPerformanceNotificationRead(
  notificationItem
) {
  if (!notificationItem) {
    return;
  }

  notificationItem.classList.remove(
    "unread"
  );

  notificationItem.dataset.read =
    "true";

  notificationItem.setAttribute(
    "aria-label",
    "Notification read"
  );

  updatePerformanceNotificationCount();
}


/* =========================================================
   NOTIFICATION ACTION
========================================================= */

function handlePerformanceNotificationAction(
  event
) {
  const notificationItem =
    event.target.closest(
      ".coach-notification-item"
    );

  if (!notificationItem) {
    return;
  }

  markPerformanceNotificationRead(
    notificationItem
  );

  const title =
    notificationItem
      .querySelector("strong")
      ?.textContent
      ?.trim() ||
    "Notification";

  showPerformanceToast({
    type: "info",
    title,
    message:
      "Notification details will open after backend integration."
  });
}


/* =========================================================
   MARK ALL NOTIFICATIONS READ
========================================================= */

function markAllPerformanceNotificationsRead() {
  performanceNotificationItems.forEach(
    (notificationItem) => {
      markPerformanceNotificationRead(
        notificationItem
      );
    }
  );

  showPerformanceToast({
    type: "success",
    title: "Notifications cleared",
    message:
      "All notifications have been marked as read."
  });
}


/* =========================================================
   PROFILE DROPDOWN ACTION
========================================================= */

function handlePerformanceProfileAction(
  event
) {
  const profileAction =
    event.currentTarget;

  const actionName =
    profileAction.dataset.profileAction;

  if (!actionName) {
    return;
  }

  if (
    actionName === "logout"
  ) {
    event.preventDefault();

    closePerformanceDropdowns();

    openLogoutModal();

    return;
  }

  if (
    actionName === "profile"
  ) {
    event.preventDefault();

    window.location.href =
      "coach-profile.html";

    return;
  }

  if (
    actionName === "settings"
  ) {
    event.preventDefault();

    window.location.href =
      "coach-settings.html";

    return;
  }

  showPerformanceToast({
    type: "info",
    title: "Coach account",
    message:
      "This account action will be connected during portal integration."
  });
}


/* =========================================================
   AVAILABILITY KEYBOARD ACTION
========================================================= */

function handlePerformanceAvailabilityKeydown(
  event
) {
  if (
    event.key !== "Enter" &&
    event.key !== " "
  ) {
    return;
  }

  const injuryItem =
    event.target.closest(
      ".performance-injury-list article"
    );

  if (!injuryItem) {
    return;
  }

  event.preventDefault();

  injuryItem.click();
}


/* =========================================================
   COUNTER ANIMATION
========================================================= */

function animatePerformanceCounter(
  element
) {
  if (!element) {
    return;
  }

  const rawTarget =
    element.dataset.animateCounter ||
    element.textContent;

  const targetValue =
    Number(
      String(rawTarget)
        .replace(/[^\d.-]/g, "")
    );

  if (
    Number.isNaN(targetValue)
  ) {
    return;
  }

  const prefix =
    element.dataset.counterPrefix ||
    "";

  const suffix =
    element.dataset.counterSuffix ||
    (
      String(rawTarget).includes("%")
        ? "%"
        : ""
    );

  const decimals =
    Number(
      element.dataset.counterDecimals ||
      (
        String(rawTarget).includes(".")
          ? 1
          : 0
      )
    );

  const duration =
    Number(
      element.dataset.counterDuration
    ) || 900;

  const startTime =
    performance.now();

  function updateCounter(
    currentTime
  ) {
    const elapsed =
      currentTime - startTime;

    const progress =
      Math.min(
        elapsed / duration,
        1
      );

    const easedProgress =
      1 -
      Math.pow(
        1 - progress,
        3
      );

    const currentValue =
      targetValue *
      easedProgress;

    element.textContent =
      `${prefix}${currentValue.toFixed(
        decimals
      )}${suffix}`;

    if (progress < 1) {
      requestAnimationFrame(
        updateCounter
      );
    }
  }

  requestAnimationFrame(
    updateCounter
  );
}


/* =========================================================
   INITIALISE COUNTER OBSERVER
========================================================= */

function initialisePerformanceCounterAnimations() {
  if (
    performanceAnimatedCounters.length === 0
  ) {
    return;
  }

  const counterObserver =
    new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          animatePerformanceCounter(
            entry.target
          );

          observer.unobserve(
            entry.target
          );
        });
      },
      {
        threshold: 0.5
      }
    );

  performanceAnimatedCounters.forEach(
    (counter) => {
      counterObserver.observe(
        counter
      );
    }
  );
}


/* =========================================================
   REVEAL ANIMATIONS
========================================================= */

function initialisePerformanceRevealAnimations() {
  if (
    performanceRevealElements.length === 0
  ) {
    return;
  }

  const revealObserver =
    new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          entry.target.classList.add(
            "is-visible"
          );

          observer.unobserve(
            entry.target
          );
        });
      },
      {
        threshold: 0.12
      }
    );

  performanceRevealElements.forEach(
    (element, index) => {
      element.style.setProperty(
        "--performance-reveal-delay",
        `${Math.min(index * 60, 300)}ms`
      );

      revealObserver.observe(
        element
      );
    }
  );
}


/* =========================================================
   SET CURRENT YEAR
========================================================= */

function initialisePerformanceCurrentYear() {
  selectAll(
    "[data-current-year]"
  ).forEach((element) => {
    element.textContent =
      String(
        new Date().getFullYear()
      );
  });
}


/* =========================================================
   REMOVE PAGE LOADING STATE
========================================================= */

function completePerformancePageLoading() {
  const pageElement =
    select(".coach-performance-page") ||
    document.body;

  window.requestAnimationFrame(() => {
    pageElement.classList.add(
      "performance-page-ready"
    );

    pageElement.classList.remove(
      "performance-page-loading"
    );
  });
}


/* =========================================================
   DEFENSIVE EXTERNAL LINK SETUP
========================================================= */

function initialisePerformanceExternalLinks() {
  selectAll(
    "a[target='_blank']"
  ).forEach((link) => {
    const existingRel =
      link.getAttribute("rel") ||
      "";

    const relValues =
      new Set(
        existingRel
          .split(/\s+/)
          .filter(Boolean)
      );

    relValues.add("noopener");
    relValues.add("noreferrer");

    link.setAttribute(
      "rel",
      [...relValues].join(" ")
    );
  });
}


/* =========================================================
   UNLOAD CLEANUP
========================================================= */

function cleanupPerformancePage() {
  document.body.style.overflow = "";
  document.body.style.paddingRight = "";

  delete document.body.dataset
    .previousOverflow;

  delete document.body.dataset
    .previousPaddingRight;
}


/* =========================================================
   EVENT LISTENERS
========================================================= */

performancePrintButtons.forEach(
  (button) => {
    button.addEventListener(
      "click",
      printPerformancePage
    );
  }
);

performanceDownloadButtons.forEach(
  (button) => {
    button.addEventListener(
      "click",
      handlePerformanceDownload
    );
  }
);

performanceMatchReportButtons.forEach(
  (button) => {
    button.addEventListener(
      "click",
      handleEnhancedMatchReportAction
    );
  }
);

performancePlayerDetailButtons.forEach(
  (button) => {
    button.addEventListener(
      "click",
      handleEnhancedPlayerReportAction
    );
  }
);

performanceMatchTableBody
  ?.removeEventListener(
    "click",
    handlePerformanceMatchAction
  );

performanceMatchTableBody
  ?.addEventListener(
    "click",
    handleEnhancedMatchReportAction
  );

performanceRankingList
  ?.removeEventListener(
    "click",
    handlePerformancePlayerAction
  );

performanceRankingList
  ?.addEventListener(
    "click",
    handleEnhancedPlayerReportAction
  );

performanceNotificationDropdown
  ?.addEventListener(
    "click",
    handlePerformanceNotificationAction
  );

performanceMarkAllNotificationsButton
  ?.addEventListener(
    "click",
    markAllPerformanceNotificationsRead
  );

performanceProfileActionLinks.forEach(
  (profileAction) => {
    profileAction.addEventListener(
      "click",
      handlePerformanceProfileAction
    );
  }
);

performanceAvailabilityCard
  ?.addEventListener(
    "keydown",
    handlePerformanceAvailabilityKeydown
  );

window.addEventListener(
  "beforeunload",
  cleanupPerformancePage
);


/* =========================================================
   FINAL INITIALISATION
========================================================= */

function initialisePerformanceFinalFeatures() {
  updatePerformanceNotificationCount();

  initialisePerformanceCounterAnimations();

  initialisePerformanceRevealAnimations();

  initialisePerformanceCurrentYear();

  initialisePerformanceExternalLinks();

  completePerformancePageLoading();

  performanceInjuryItems.forEach(
    (item) => {
      item.setAttribute(
        "aria-label",
        "Open player availability details"
      );
    }
  );

  console.info(
    "Coach Performance frontend initialised."
  );
}


/* =========================================================
   DOM READY
========================================================= */

document.addEventListener(
  "DOMContentLoaded",
  initialisePerformanceFinalFeatures
);
/* =========================================================
   FIFA MISSION INDIA
   COACH PERFORMANCE PAGE
   JAVASCRIPT — PART 1F

   Final additions:
   - Browser compatibility safeguards
   - Reduced-motion support
   - Online/offline status
   - Form auto-save
   - Date validation
   - Keyboard shortcuts
   - Dynamic modal cleanup
   - Duplicate-action protection
   - Final diagnostics

   Frontend only.
========================================================= */


/* =========================================================
   USER MOTION PREFERENCE
========================================================= */

const performancePrefersReducedMotion =
  window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  );


function shouldReducePerformanceMotion() {
  return performancePrefersReducedMotion.matches;
}


/* =========================================================
   SAFE SCROLL HELPER
========================================================= */

function performanceSafeScrollIntoView(
  element,
  options = {}
) {
  if (!element) {
    return;
  }

  const {
    block = "start",
    inline = "nearest"
  } = options;

  element.scrollIntoView({
    behavior:
      shouldReducePerformanceMotion()
        ? "auto"
        : "smooth",

    block,
    inline
  });
}


/* =========================================================
   OVERRIDE SECTION SCROLL FOR REDUCED MOTION
========================================================= */

function scrollToPerformanceSectionSafely(
  selector
) {
  const targetSection =
    select(selector);

  if (!targetSection) {
    return;
  }

  performanceSafeScrollIntoView(
    targetSection,
    {
      block: "start"
    }
  );

  if (
    shouldReducePerformanceMotion()
  ) {
    return;
  }

  targetSection.classList.add(
    "performance-highlight"
  );

  window.setTimeout(() => {
    targetSection.classList.remove(
      "performance-highlight"
    );
  }, 1400);
}


/* =========================================================
   ONLINE / OFFLINE STATUS
========================================================= */

let performanceOfflineToastVisible =
  false;


function handlePerformanceOfflineStatus() {
  if (
    performanceOfflineToastVisible
  ) {
    return;
  }

  performanceOfflineToastVisible = true;

  document.documentElement.classList.add(
    "performance-offline"
  );

  showPerformanceToast({
    type: "warning",
    title: "You are offline",
    message:
      "Some performance data may not update until your connection returns.",
    duration: 0
  });
}


function handlePerformanceOnlineStatus() {
  performanceOfflineToastVisible = false;

  document.documentElement.classList.remove(
    "performance-offline"
  );

  showPerformanceToast({
    type: "success",
    title: "Connection restored",
    message:
      "You are back online and performance data can be refreshed."
  });
}


/* =========================================================
   ASSESSMENT AUTO-SAVE
========================================================= */

let performanceAssessmentAutoSaveTimer =
  null;


function schedulePerformanceAssessmentAutoSave() {
  if (!performanceAssessmentForm) {
    return;
  }

  window.clearTimeout(
    performanceAssessmentAutoSaveTimer
  );

  performanceAssessmentAutoSaveTimer =
    window.setTimeout(() => {
      const draft =
        collectPerformanceAssessmentData();

      const hasDraftContent =
        Boolean(
          draft.playerId ||
          draft.summary ||
          draft.strengths ||
          draft.improvements ||
          draft.recommendation
        );

      if (!hasDraftContent) {
        return;
      }

      try {
        localStorage.setItem(
          performanceAssessmentDraftKey,
          JSON.stringify(draft)
        );
      } catch (error) {
        console.warn(
          "Assessment auto-save failed:",
          error
        );
      }
    }, 700);
}


/* =========================================================
   ASSESSMENT CHARACTER COUNTERS
========================================================= */

function createPerformanceCharacterCounter(
  field,
  maximumLength
) {
  if (
    !field ||
    !maximumLength
  ) {
    return;
  }

  const wrapper =
    getPerformanceFieldWrapper(field) ||
    field.parentElement;

  if (!wrapper) {
    return;
  }

  let counter =
    wrapper.querySelector(
      ".performance-character-counter"
    );

  if (!counter) {
    counter =
      document.createElement("small");

    counter.className =
      "performance-character-counter";

    counter.setAttribute(
      "aria-live",
      "polite"
    );

    wrapper.appendChild(counter);
  }

  function updateCounter() {
    const currentLength =
      field.value.length;

    counter.textContent =
      `${currentLength}/${maximumLength}`;

    counter.classList.toggle(
      "near-limit",
      currentLength >=
        maximumLength * 0.85
    );

    counter.classList.toggle(
      "at-limit",
      currentLength >=
        maximumLength
    );
  }

  field.maxLength =
    maximumLength;

  field.addEventListener(
    "input",
    updateCounter
  );

  updateCounter();
}


/* =========================================================
   EXPORT DATE LIMITS
========================================================= */

function synchronisePerformanceExportDates() {
  if (
    !performanceExportStartDate ||
    !performanceExportEndDate
  ) {
    return;
  }

  if (
    performanceExportStartDate.value
  ) {
    performanceExportEndDate.min =
      performanceExportStartDate.value;
  }

  if (
    performanceExportEndDate.value
  ) {
    performanceExportStartDate.max =
      performanceExportEndDate.value;
  }
}


/* =========================================================
   FILTER QUERY PARAMETERS
========================================================= */

function savePerformanceFiltersToURL() {
  const currentURL =
    new URL(window.location.href);

  const {
    season,
    competition,
    team,
    chartPeriod
  } = performanceFilterState;

  currentURL.searchParams.set(
    "season",
    season
  );

  currentURL.searchParams.set(
    "competition",
    competition
  );

  currentURL.searchParams.set(
    "team",
    team
  );

  currentURL.searchParams.set(
    "period",
    chartPeriod
  );

  window.history.replaceState(
    {},
    "",
    currentURL
  );
}


/* =========================================================
   RESTORE FILTERS FROM URL
========================================================= */

function restorePerformanceFiltersFromURL() {
  const urlParameters =
    new URLSearchParams(
      window.location.search
    );

  const season =
    urlParameters.get("season");

  const competition =
    urlParameters.get("competition");

  const team =
    urlParameters.get("team");

  const period =
    urlParameters.get("period");

  if (
    season &&
    performanceSeasonFilter
  ) {
    const seasonOption =
      select(
        `option[value="${CSS.escape(
          season
        )}"]`,
        performanceSeasonFilter
      );

    if (seasonOption) {
      performanceSeasonFilter.value =
        season;
    }
  }

  if (
    competition &&
    performanceCompetitionFilter
  ) {
    const competitionOption =
      select(
        `option[value="${CSS.escape(
          competition
        )}"]`,
        performanceCompetitionFilter
      );

    if (competitionOption) {
      performanceCompetitionFilter.value =
        competition;
    }
  }

  if (
    team &&
    performanceTeamFilter
  ) {
    const teamOption =
      select(
        `option[value="${CSS.escape(
          team
        )}"]`,
        performanceTeamFilter
      );

    if (teamOption) {
      performanceTeamFilter.value =
        team;
    }
  }

  if (period) {
    const matchingPeriodButton =
      performanceChartToggles.find(
        (button) => {
          return (
            button.dataset.chartPeriod ===
              period ||
            button.dataset.period ===
              period
          );
        }
      );

    if (matchingPeriodButton) {
      performanceFilterState.chartPeriod =
        period;

      performanceChartToggles.forEach(
        (button) => {
          const isActive =
            button ===
            matchingPeriodButton;

          button.classList.toggle(
            "active",
            isActive
          );

          button.setAttribute(
            "aria-pressed",
            String(isActive)
          );
        }
      );
    }
  }

  updatePerformanceFilterState();
}


/* =========================================================
   ENHANCED FILTER CHANGE
========================================================= */

function handleFinalPerformanceFilterChange() {
  applyPerformanceFilters();

  savePerformanceFiltersToURL();
}


/* =========================================================
   CHART PERIOD URL UPDATE
========================================================= */

function handlePerformancePeriodURLUpdate(
  event
) {
  const button =
    event.currentTarget;

  const selectedPeriod =
    button.dataset.chartPeriod ||
    button.dataset.period ||
    "season";

  performanceFilterState.chartPeriod =
    selectedPeriod;

  savePerformanceFiltersToURL();
}


/* =========================================================
   KEYBOARD SHORTCUTS
========================================================= */

function handlePerformanceKeyboardShortcuts(
  event
) {
  const target =
    event.target;

  const isTyping =
    target instanceof HTMLInputElement ||
    target instanceof HTMLTextAreaElement ||
    target instanceof HTMLSelectElement ||
    target?.isContentEditable;

  if (
    isTyping &&
    event.key !== "Escape"
  ) {
    return;
  }

  if (
    event.key === "/" &&
    !event.ctrlKey &&
    !event.metaKey
  ) {
    event.preventDefault();

    performanceSearchInput?.focus();

    return;
  }

  if (
    event.altKey &&
    event.key.toLowerCase() === "a"
  ) {
    event.preventDefault();

    setDefaultAssessmentDate();

    openPerformanceModal(
      performanceAssessmentModalBackdrop
    );

    return;
  }

  if (
    event.altKey &&
    event.key.toLowerCase() === "e"
  ) {
    event.preventDefault();

    openPerformanceExportModal();

    return;
  }

  if (
    event.altKey &&
    event.key.toLowerCase() === "r"
  ) {
    event.preventDefault();

    refreshPerformanceData();
  }
}


/* =========================================================
   INJURY ITEM KEYBOARD ACTIVATION
========================================================= */

function activatePerformanceAvailabilityItem(
  event
) {
  if (
    event.key !== "Enter" &&
    event.key !== " "
  ) {
    return;
  }

  const item =
    event.currentTarget;

  event.preventDefault();

  const playerName =
    item.querySelector("strong")
      ?.textContent
      ?.trim() ||
    "Player";

  const status =
    item.querySelector("small")
      ?.textContent
      ?.trim() ||
    "Availability details pending";

  showPerformanceToast({
    type:
      status
        .toLowerCase()
        .includes("unavailable")
        ? "error"
        : "warning",

    title: playerName,
    message: status
  });
}


/* =========================================================
   DYNAMIC MODAL CLEANUP
========================================================= */

function removeOrphanedPerformanceModals() {
  selectAll(
    ".performance-dynamic-modal"
  ).forEach((modal) => {
    if (
      modal !==
      performancePageState.activeModal
    ) {
      modal.remove();
    }
  });
}


/* =========================================================
   PREVENT DUPLICATE FORM SUBMISSION
========================================================= */

function preventRepeatedPerformanceSubmission(
  form
) {
  if (!form) {
    return;
  }

  form.addEventListener(
    "submit",
    (event) => {
      if (
        form.dataset.submitting ===
        "true"
      ) {
        event.preventDefault();
        return;
      }

      form.dataset.submitting =
        "true";

      window.setTimeout(() => {
        form.dataset.submitting =
          "false";
      }, 1300);
    },
    {
      capture: true
    }
  );
}


/* =========================================================
   INTERSECTION OBSERVER FALLBACK
========================================================= */

function applyPerformanceObserverFallback() {
  if (
    "IntersectionObserver" in window
  ) {
    return;
  }

  performanceDevelopmentCards.forEach(
    (card) => {
      card.classList.add(
        "is-visible"
      );
    }
  );

  performanceRevealElements.forEach(
    (element) => {
      element.classList.add(
        "is-visible"
      );
    }
  );

  performanceProgressBars.forEach(
    (bar) => {
      bar.style.width =
        bar.dataset.progress ||
        bar.style.width ||
        "0%";
    }
  );
}


/* =========================================================
   CSS ESCAPE FALLBACK
========================================================= */

function initialisePerformanceCSSEscapeFallback() {
  if (
    window.CSS &&
    typeof window.CSS.escape ===
      "function"
  ) {
    return;
  }

  window.CSS =
    window.CSS || {};

  window.CSS.escape =
    function escapeCSSValue(value) {
      return String(value).replace(
        /[^a-zA-Z0-9_-]/g,
        "\\$&"
      );
    };
}


/* =========================================================
   ACCESSIBLE STATUS REGION
========================================================= */

function initialisePerformanceStatusRegion() {
  if (
    select("#performanceStatusRegion")
  ) {
    return;
  }

  const statusRegion =
    document.createElement("div");

  statusRegion.id =
    "performanceStatusRegion";

  statusRegion.className =
    "performance-sr-only";

  statusRegion.setAttribute(
    "role",
    "status"
  );

  statusRegion.setAttribute(
    "aria-live",
    "polite"
  );

  statusRegion.setAttribute(
    "aria-atomic",
    "true"
  );

  document.body.appendChild(
    statusRegion
  );
}


/* =========================================================
   ANNOUNCE STATUS
========================================================= */

function announcePerformanceStatus(
  message
) {
  const region =
    select("#performanceStatusRegion");

  if (!region) {
    return;
  }

  region.textContent = "";

  window.setTimeout(() => {
    region.textContent =
      message;
  }, 50);
}


/* =========================================================
   PAGE VISIBILITY HANDLING
========================================================= */

function handlePerformancePageVisibility() {
  if (
    document.visibilityState !==
    "visible"
  ) {
    return;
  }

  updatePerformanceLastUpdatedTime();

  removeOrphanedPerformanceModals();
}


/* =========================================================
   FINAL EVENT BINDING
========================================================= */

function bindPerformanceFinalEvents() {
  performanceAssessmentForm
    ?.addEventListener(
      "input",
      schedulePerformanceAssessmentAutoSave
    );

  performanceExportStartDate
    ?.addEventListener(
      "change",
      synchronisePerformanceExportDates
    );

  performanceExportEndDate
    ?.addEventListener(
      "change",
      synchronisePerformanceExportDates
    );

  [
    performanceSeasonFilter,
    performanceCompetitionFilter,
    performanceTeamFilter
  ].forEach((filter) => {
    filter?.addEventListener(
      "change",
      handleFinalPerformanceFilterChange
    );
  });

  performanceChartToggles.forEach(
    (button) => {
      button.addEventListener(
        "click",
        handlePerformancePeriodURLUpdate
      );
    }
  );

  performanceInjuryItems.forEach(
    (item) => {
      item.addEventListener(
        "keydown",
        activatePerformanceAvailabilityItem
      );
    }
  );

  document.addEventListener(
    "keydown",
    handlePerformanceKeyboardShortcuts
  );

  document.addEventListener(
    "visibilitychange",
    handlePerformancePageVisibility
  );

  window.addEventListener(
    "offline",
    handlePerformanceOfflineStatus
  );

  window.addEventListener(
    "online",
    handlePerformanceOnlineStatus
  );
}


/* =========================================================
   FINAL PAGE DIAGNOSTICS
========================================================= */

function runPerformancePageDiagnostics() {
  const diagnostics = {
    sidebar:
      Boolean(coachSidebar),

    filters:
      Boolean(
        performanceSeasonFilter &&
        performanceCompetitionFilter &&
        performanceTeamFilter
      ),

    chart:
      Boolean(
        performanceChartSvg &&
        performanceChartLine
      ),

    matchTable:
      Boolean(
        performanceMatchTableBody
      ),

    rankings:
      Boolean(
        performanceRankingList
      ),

    assessmentModal:
      Boolean(
        performanceAssessmentModalBackdrop &&
        performanceAssessmentForm
      ),

    exportModal:
      Boolean(
        performanceExportModalBackdrop
      ),

    toastContainer:
      Boolean(toastContainer)
  };

  const missingFeatures =
    Object.entries(diagnostics)
      .filter(
        ([, available]) =>
          !available
      )
      .map(
        ([feature]) =>
          feature
      );

  if (
    missingFeatures.length > 0
  ) {
    console.warn(
      "Coach Performance optional elements not found:",
      missingFeatures
    );

    return;
  }

  console.info(
    "Coach Performance page diagnostics passed."
  );
}


/* =========================================================
   FINAL INITIALISATION
========================================================= */

function initialiseCoachPerformanceFinalLayer() {
  initialisePerformanceCSSEscapeFallback();

  applyPerformanceObserverFallback();

  initialisePerformanceStatusRegion();

  restorePerformanceFiltersFromURL();

  renderPerformanceChart(
    performanceFilterState.chartPeriod
  );

  renderPerformanceMatches();

  renderPerformanceRankings();

  updatePerformanceSummaryCards();

  synchronisePerformanceExportDates();

  createPerformanceCharacterCounter(
    performanceAssessmentSummary,
    500
  );

  createPerformanceCharacterCounter(
    performanceAssessmentStrengths,
    400
  );

  createPerformanceCharacterCounter(
    performanceAssessmentImprovements,
    400
  );

  createPerformanceCharacterCounter(
    performanceAssessmentRecommendation,
    400
  );

  preventRepeatedPerformanceSubmission(
    performanceAssessmentForm
  );

  preventRepeatedPerformanceSubmission(
    performanceExportForm
  );

  bindPerformanceFinalEvents();

  if (!navigator.onLine) {
    handlePerformanceOfflineStatus();
  }

  announcePerformanceStatus(
    "Coach performance dashboard loaded."
  );

  runPerformancePageDiagnostics();
}


/* =========================================================
   DOM READY
========================================================= */

document.addEventListener(
  "DOMContentLoaded",
  initialiseCoachPerformanceFinalLayer
);