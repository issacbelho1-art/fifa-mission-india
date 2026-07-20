/* ==========================================================
   FIFA MISSION INDIA
   COACH DASHBOARD JAVASCRIPT

   Frontend-only interactions.
   Backend API integration points are included near the bottom.
========================================================== */

"use strict";


/* ==========================================================
   DOM ELEMENTS
========================================================== */

const coachSidebar = document.getElementById("coachSidebar");
const sidebarOverlay = document.getElementById("sidebarOverlay");
const mobileMenuButton = document.getElementById("mobileMenuButton");
const sidebarCloseButton = document.getElementById("sidebarCloseButton");

const searchToggleButton = document.getElementById("searchToggleButton");
const dashboardSearchPanel = document.getElementById(
  "dashboardSearchPanel"
);
const dashboardSearchForm = document.getElementById(
  "dashboardSearchForm"
);
const dashboardSearchInput = document.getElementById(
  "dashboardSearchInput"
);

const notificationButton = document.getElementById(
  "notificationButton"
);
const notificationPanel = document.getElementById(
  "notificationPanel"
);
const closeNotificationPanelButton = document.getElementById(
  "closeNotificationPanel"
);
const markAllNotificationsReadButton = document.getElementById(
  "markAllNotificationsRead"
);
const notificationIndicator = document.getElementById(
  "notificationIndicator"
);
const notificationList = document.getElementById(
  "notificationList"
);

const coachAccountButton = document.getElementById(
  "coachAccountButton"
);
const coachAccountDropdown = document.getElementById(
  "coachAccountDropdown"
);

const sidebarLogoutButton = document.getElementById(
  "sidebarLogoutButton"
);
const accountLogoutButton = document.getElementById(
  "accountLogoutButton"
);
const logoutModal = document.getElementById("logoutModal");
const cancelLogoutButton = document.getElementById(
  "cancelLogoutButton"
);
const confirmLogoutButton = document.getElementById(
  "confirmLogoutButton"
);

const currentDayName = document.getElementById("currentDayName");
const currentFullDate = document.getElementById("currentFullDate");
const currentYear = document.getElementById("currentYear");

const performancePeriodSelect = document.getElementById(
  "performancePeriodSelect"
);
const performanceScoreRing = document.getElementById(
  "performanceScoreRing"
);
const overallPerformanceScore = document.getElementById(
  "overallPerformanceScore"
);

const coachProfileCompletion = document.getElementById(
  "coachProfileCompletion"
);
const coachProfileProgressBar = document.getElementById(
  "coachProfileProgressBar"
);


/* ==========================================================
   DASHBOARD STATE
========================================================== */

const dashboardState = {
  sidebarOpen: false,
  searchOpen: false,
  notificationPanelOpen: false,
  accountDropdownOpen: false,
  logoutModalOpen: false
};


/* ==========================================================
   UTILITY FUNCTIONS
========================================================== */

function setElementHidden(element, shouldHide) {
  if (!element) {
    return;
  }

  element.hidden = shouldHide;
}


function setBodyState(className, isActive) {
  document.body.classList.toggle(className, isActive);
}


function isDesktopSidebar() {
  return window.matchMedia("(min-width: 1025px)").matches;
}


function safelyFocus(element) {
  if (!element) {
    return;
  }

  window.requestAnimationFrame(() => {
    element.focus();
  });
}


function formatCounterValue(element, value) {
  const elementId = element.id;

  if (elementId === "averageAttendance") {
    return `${value}%`;
  }

  return value.toString();
}


/* ==========================================================
   MOBILE SIDEBAR
========================================================== */

function openSidebar() {
  if (!coachSidebar || isDesktopSidebar()) {
    return;
  }

  dashboardState.sidebarOpen = true;

  coachSidebar.classList.add("active");
  sidebarOverlay?.classList.add("active");

  mobileMenuButton?.setAttribute("aria-expanded", "true");
  sidebarOverlay?.setAttribute("aria-hidden", "false");

  setBodyState("sidebar-open", true);
}


function closeSidebar() {
  dashboardState.sidebarOpen = false;

  coachSidebar?.classList.remove("active");
  sidebarOverlay?.classList.remove("active");

  mobileMenuButton?.setAttribute("aria-expanded", "false");
  sidebarOverlay?.setAttribute("aria-hidden", "true");

  setBodyState("sidebar-open", false);
}


mobileMenuButton?.addEventListener("click", openSidebar);
sidebarCloseButton?.addEventListener("click", closeSidebar);
sidebarOverlay?.addEventListener("click", closeSidebar);


/* ==========================================================
   SEARCH PANEL
========================================================== */

function openSearchPanel() {
  if (!dashboardSearchPanel) {
    return;
  }

  dashboardState.searchOpen = true;

  setElementHidden(dashboardSearchPanel, false);
  searchToggleButton?.setAttribute("aria-expanded", "true");

  safelyFocus(dashboardSearchInput);
}


function closeSearchPanel() {
  dashboardState.searchOpen = false;

  setElementHidden(dashboardSearchPanel, true);
  searchToggleButton?.setAttribute("aria-expanded", "false");

  if (dashboardSearchInput) {
    dashboardSearchInput.value = "";
  }
}


function toggleSearchPanel() {
  if (dashboardState.searchOpen) {
    closeSearchPanel();
    return;
  }

  closeAccountDropdown();
  closeNotificationPanel();
  openSearchPanel();
}


searchToggleButton?.setAttribute(
  "aria-expanded",
  dashboardState.searchOpen.toString()
);

searchToggleButton?.addEventListener("click", toggleSearchPanel);


dashboardSearchForm?.addEventListener("submit", (event) => {
  event.preventDefault();

  const query = dashboardSearchInput?.value.trim() || "";

  if (!query) {
    dashboardSearchInput?.focus();
    return;
  }

  /*
    BACKEND / FULL SEARCH INTEGRATION:

    Replace this placeholder behaviour with navigation such as:

    window.location.href =
      `coach-search.html?q=${encodeURIComponent(query)}`;

    Or connect it to:

    GET /api/v1/coaches/search?q=<query>
  */

  console.info("Coach dashboard search:", query);

  const searchableElements = document.querySelectorAll(
    [
      ".training-session-item",
      ".player-alert-item",
      ".trial-invitation-item",
      ".recent-message-item",
      ".timeline-item"
    ].join(",")
  );

  let firstMatch = null;

  searchableElements.forEach((element) => {
    const content = element.textContent
      .toLowerCase()
      .replace(/\s+/g, " ");

    const matches = content.includes(query.toLowerCase());

    element.style.outline = matches
      ? "3px solid rgba(10, 132, 255, 0.25)"
      : "";

    element.style.outlineOffset = matches ? "3px" : "";

    if (matches && !firstMatch) {
      firstMatch = element;
    }
  });

  if (firstMatch) {
    firstMatch.scrollIntoView({
      behavior: "smooth",
      block: "center"
    });

    window.setTimeout(() => {
      searchableElements.forEach((element) => {
        element.style.outline = "";
        element.style.outlineOffset = "";
      });
    }, 3000);
  } else {
    window.alert(
      `No dashboard result was found for "${query}".`
    );
  }
});


/* ==========================================================
   ACCOUNT DROPDOWN
========================================================== */

function openAccountDropdown() {
  if (!coachAccountDropdown) {
    return;
  }

  dashboardState.accountDropdownOpen = true;

  setElementHidden(coachAccountDropdown, false);
  coachAccountButton?.setAttribute("aria-expanded", "true");
}


function closeAccountDropdown() {
  dashboardState.accountDropdownOpen = false;

  setElementHidden(coachAccountDropdown, true);
  coachAccountButton?.setAttribute("aria-expanded", "false");
}


function toggleAccountDropdown() {
  if (dashboardState.accountDropdownOpen) {
    closeAccountDropdown();
    return;
  }

  closeSearchPanel();
  closeNotificationPanel();
  openAccountDropdown();
}


coachAccountButton?.addEventListener(
  "click",
  toggleAccountDropdown
);


/* ==========================================================
   NOTIFICATION PANEL
========================================================== */

function openNotificationPanel() {
  if (!notificationPanel) {
    return;
  }

  dashboardState.notificationPanelOpen = true;

  setElementHidden(notificationPanel, false);
  notificationButton?.setAttribute("aria-expanded", "true");

  setBodyState("notification-open", true);

  safelyFocus(closeNotificationPanelButton);
}


function closeNotificationPanel() {
  dashboardState.notificationPanelOpen = false;

  setElementHidden(notificationPanel, true);
  notificationButton?.setAttribute("aria-expanded", "false");

  setBodyState("notification-open", false);
}


function toggleNotificationPanel() {
  if (dashboardState.notificationPanelOpen) {
    closeNotificationPanel();
    return;
  }

  closeSearchPanel();
  closeAccountDropdown();
  closeSidebar();
  openNotificationPanel();
}


notificationButton?.setAttribute(
  "aria-expanded",
  dashboardState.notificationPanelOpen.toString()
);

notificationButton?.addEventListener(
  "click",
  toggleNotificationPanel
);

closeNotificationPanelButton?.addEventListener(
  "click",
  closeNotificationPanel
);


/* ==========================================================
   NOTIFICATION READ STATE
========================================================== */

function updateNotificationIndicator() {
  const unreadNotifications =
    notificationList?.querySelectorAll(
      ".notification-item.unread"
    ) || [];

  if (!notificationIndicator) {
    return;
  }

  notificationIndicator.hidden =
    unreadNotifications.length === 0;
}


function markNotificationAsRead(notificationItem) {
  if (!notificationItem) {
    return;
  }

  notificationItem.classList.remove("unread");

  updateNotificationIndicator();

  const notificationId =
    notificationItem.dataset.notificationId;

  /*
    BACKEND INTEGRATION:

    PATCH /api/v1/coaches/notifications/{notificationId}/read
  */

  console.info(
    "Notification marked as read:",
    notificationId
  );
}


notificationList?.addEventListener("click", (event) => {
  const notificationItem = event.target.closest(
    ".notification-item"
  );

  if (!notificationItem) {
    return;
  }

  markNotificationAsRead(notificationItem);
});


markAllNotificationsReadButton?.addEventListener(
  "click",
  () => {
    const unreadNotifications =
      notificationList?.querySelectorAll(
        ".notification-item.unread"
      ) || [];

    unreadNotifications.forEach((notificationItem) => {
      notificationItem.classList.remove("unread");
    });

    updateNotificationIndicator();

    /*
      BACKEND INTEGRATION:

      PATCH /api/v1/coaches/notifications/read
    */

    console.info("All coach notifications marked as read.");
  }
);


/* ==========================================================
   LOGOUT MODAL
========================================================== */

function openLogoutModal() {
  if (!logoutModal) {
    return;
  }

  dashboardState.logoutModalOpen = true;

  closeAccountDropdown();
  closeNotificationPanel();
  closeSidebar();

  setElementHidden(logoutModal, false);
  setBodyState("modal-open", true);

  safelyFocus(cancelLogoutButton);
}


function closeLogoutModal() {
  dashboardState.logoutModalOpen = false;

  setElementHidden(logoutModal, true);
  setBodyState("modal-open", false);
}


sidebarLogoutButton?.addEventListener(
  "click",
  openLogoutModal
);

accountLogoutButton?.addEventListener(
  "click",
  openLogoutModal
);

cancelLogoutButton?.addEventListener(
  "click",
  closeLogoutModal
);


logoutModal
  ?.querySelector(".portal-modal-backdrop")
  ?.addEventListener("click", closeLogoutModal);


confirmLogoutButton?.addEventListener("click", async () => {
  confirmLogoutButton.disabled = true;
  confirmLogoutButton.textContent = "Logging out...";

  try {
    /*
      BACKEND INTEGRATION EXAMPLE:

      const response = await fetch("/api/v1/auth/logout", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        }
      });

      if (!response.ok) {
        throw new Error("Logout request failed.");
      }

      localStorage.removeItem("accessToken");
      sessionStorage.clear();

      window.location.href = "../login.html";
    */

    console.info("Coach logout confirmed.");

    window.setTimeout(() => {
      window.location.href = "../login.html";
    }, 500);
  } catch (error) {
    console.error("Unable to log out:", error);

    window.alert(
      "Logout could not be completed. Please try again."
    );

    confirmLogoutButton.disabled = false;
    confirmLogoutButton.textContent = "Logout";
  }
});


/* ==========================================================
   CURRENT DATE AND YEAR
========================================================== */

function updateDashboardDate() {
  const now = new Date();

  const dayFormatter = new Intl.DateTimeFormat(
    "en-IN",
    {
      weekday: "long"
    }
  );

  const fullDateFormatter = new Intl.DateTimeFormat(
    "en-IN",
    {
      day: "numeric",
      month: "long",
      year: "numeric"
    }
  );

  if (currentDayName) {
    currentDayName.textContent =
      dayFormatter.format(now);
  }

  if (currentFullDate) {
    currentFullDate.textContent =
      fullDateFormatter.format(now);
  }

  if (currentYear) {
    currentYear.textContent =
      now.getFullYear().toString();
  }
}


/* ==========================================================
   ANIMATED STATISTICS COUNTERS
========================================================== */

function animateCounter(element) {
  const targetValue = Number(element.dataset.count);

  if (!Number.isFinite(targetValue)) {
    return;
  }

  const duration = 900;
  const startTime = performance.now();

  function updateCounter(currentTime) {
    const elapsedTime = currentTime - startTime;
    const progress = Math.min(elapsedTime / duration, 1);

    const easedProgress =
      1 - Math.pow(1 - progress, 3);

    const currentValue = Math.round(
      targetValue * easedProgress
    );

    element.textContent = formatCounterValue(
      element,
      currentValue
    );

    if (progress < 1) {
      window.requestAnimationFrame(updateCounter);
    }
  }

  window.requestAnimationFrame(updateCounter);
}


function initialiseDashboardCounters() {
  const counterElements = document.querySelectorAll(
    ".stat-card-value[data-count]"
  );

  if (!("IntersectionObserver" in window)) {
    counterElements.forEach(animateCounter);
    return;
  }

  const counterObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        animateCounter(entry.target);
        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.45
    }
  );

  counterElements.forEach((element) => {
    counterObserver.observe(element);
  });
}


/* ==========================================================
   PERFORMANCE PERIOD DATA
========================================================== */

const performanceData = {
  month: {
    overall: 82,
    metrics: [84, 78, 86, 80],
    changeText: "↑ 6% from last month",
    changeType: "positive"
  },

  quarter: {
    overall: 79,
    metrics: [81, 76, 83, 77],
    changeText: "↑ 3% over the last quarter",
    changeType: "positive"
  },

  season: {
    overall: 85,
    metrics: [87, 82, 88, 83],
    changeText: "↑ 8% during the current season",
    changeType: "positive"
  }
};


function updatePerformanceDisplay(period) {
  const data = performanceData[period];

  if (!data) {
    return;
  }

  if (performanceScoreRing) {
    performanceScoreRing.style.setProperty(
      "--performance-value",
      data.overall
    );
  }

  if (overallPerformanceScore) {
    overallPerformanceScore.textContent =
      data.overall.toString();
  }

  const metricElements = document.querySelectorAll(
    ".performance-metric"
  );

  metricElements.forEach((metricElement, index) => {
    const metricValue = data.metrics[index];

    if (typeof metricValue !== "number") {
      return;
    }

    const valueElement =
      metricElement.querySelector(
        ".metric-heading strong"
      );

    const progressElement =
      metricElement.querySelector(
        ".metric-progress span"
      );

    if (valueElement) {
      valueElement.textContent = `${metricValue}%`;
    }

    if (progressElement) {
      progressElement.style.width = `${metricValue}%`;
    }
  });

  const performanceChange = document.querySelector(
    ".performance-change"
  );

  if (performanceChange) {
    performanceChange.textContent = data.changeText;

    performanceChange.classList.remove(
      "positive",
      "negative"
    );

    performanceChange.classList.add(
      data.changeType
    );
  }
}


performancePeriodSelect?.addEventListener(
  "change",
  (event) => {
    updatePerformanceDisplay(event.target.value);

    /*
      BACKEND INTEGRATION:

      GET /api/v1/coaches/performance?period=<period>
    */
  }
);


/* ==========================================================
   PROFILE COMPLETION
========================================================== */

function updateProfileCompletion(completionValue) {
  const safeValue = Math.min(
    Math.max(Number(completionValue) || 0, 0),
    100
  );

  if (coachProfileCompletion) {
    coachProfileCompletion.textContent =
      `${safeValue}%`;
  }

  if (coachProfileProgressBar) {
    coachProfileProgressBar.style.width =
      `${safeValue}%`;
  }
}


/* ==========================================================
   TRAINING SESSION MENU PLACEHOLDER
========================================================== */

document
  .getElementById("trainingSessionList")
  ?.addEventListener("click", (event) => {
    const menuButton = event.target.closest(
      ".session-menu-button"
    );

    if (!menuButton) {
      return;
    }

    const sessionItem = menuButton.closest(
      ".training-session-item"
    );

    const sessionId = sessionItem?.dataset.sessionId;

    console.info(
      "Training session options requested:",
      sessionId
    );

    /*
      Replace this alert with a contextual dropdown menu
      when edit/delete/reschedule functionality is added.
    */

    window.alert(
      "Training session options will be connected to the coaching API."
    );
  });


/* ==========================================================
   ACTIVE SIDEBAR LINK
========================================================== */

function setActiveSidebarLink() {
  const currentPage =
    window.location.pathname.split("/").pop() ||
    "coach-dashboard.html";

  const sidebarLinks = document.querySelectorAll(
    ".sidebar-link"
  );

  sidebarLinks.forEach((link) => {
    const linkPage =
      link.getAttribute("href")?.split("?")[0];

    const isActive = linkPage === currentPage;

    link.classList.toggle("active", isActive);

    if (isActive) {
      link.setAttribute("aria-current", "page");
    } else {
      link.removeAttribute("aria-current");
    }
  });
}


/* ==========================================================
   CLOSE PANELS WHEN CLICKING OUTSIDE
========================================================== */

document.addEventListener("click", (event) => {
  const target = event.target;

  if (
    dashboardState.accountDropdownOpen &&
    coachAccountButton &&
    coachAccountDropdown &&
    !coachAccountButton.contains(target) &&
    !coachAccountDropdown.contains(target)
  ) {
    closeAccountDropdown();
  }

  if (
    dashboardState.searchOpen &&
    dashboardSearchPanel &&
    searchToggleButton &&
    !dashboardSearchPanel.contains(target) &&
    !searchToggleButton.contains(target)
  ) {
    closeSearchPanel();
  }
});


/* ==========================================================
   KEYBOARD ACCESSIBILITY
========================================================== */

document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") {
    return;
  }

  if (dashboardState.logoutModalOpen) {
    closeLogoutModal();
    return;
  }

  if (dashboardState.notificationPanelOpen) {
    closeNotificationPanel();
    notificationButton?.focus();
    return;
  }

  if (dashboardState.accountDropdownOpen) {
    closeAccountDropdown();
    coachAccountButton?.focus();
    return;
  }

  if (dashboardState.searchOpen) {
    closeSearchPanel();
    searchToggleButton?.focus();
    return;
  }

  if (dashboardState.sidebarOpen) {
    closeSidebar();
    mobileMenuButton?.focus();
  }
});


/* ==========================================================
   WINDOW RESIZE HANDLING
========================================================== */

window.addEventListener("resize", () => {
  if (isDesktopSidebar()) {
    closeSidebar();
  }
});


/* ==========================================================
   BACKEND-READY DASHBOARD DATA LOADER
========================================================== */

async function loadCoachDashboardData() {
  /*
    Enable this function when Mr. Harsh connects the API.

    Suggested endpoint:

    GET /api/v1/coaches/dashboard

    Example response structure:

    {
      "coach": {
        "firstName": "Arjun",
        "fullName": "Arjun Singh",
        "role": "Head Coach",
        "avatarUrl": "..."
      },

      "assignment": {
        "academyName": "Minerva Football Academy",
        "teamName": "Under-17 Elite Team",
        "season": "2026–27",
        "teamSize": 24
      },

      "statistics": {
        "assignedPlayers": 24,
        "trainingSessions": 18,
        "averageAttendance": 91,
        "trialInvitations": 3
      },

      "profileCompletion": 75,

      "notifications": [],
      "trainingSessions": [],
      "schedule": [],
      "performance": {},
      "playerAlerts": [],
      "trialInvitations": [],
      "recentMessages": []
    }
  */

  try {
    /*
    const response = await fetch(
      "/api/v1/coaches/dashboard",
      {
        method: "GET",
        credentials: "include",
        headers: {
          "Accept": "application/json"
        }
      }
    );

    if (!response.ok) {
      throw new Error(
        `Dashboard request failed: ${response.status}`
      );
    }

    const dashboardData = await response.json();

    renderCoachDashboard(dashboardData);
    */

    console.info(
      "Coach dashboard is using frontend demonstration data."
    );
  } catch (error) {
    console.error(
      "Unable to load coach dashboard:",
      error
    );
  }
}


/* ==========================================================
   BACKEND DATA RENDERER
========================================================== */

function renderCoachDashboard(data) {
  if (!data || typeof data !== "object") {
    return;
  }

  const coach = data.coach || {};
  const assignment = data.assignment || {};
  const statistics = data.statistics || {};

  const topbarCoachName = document.getElementById(
    "topbarCoachName"
  );

  const topbarCoachRole = document.getElementById(
    "topbarCoachRole"
  );

  const topbarCoachAvatar = document.getElementById(
    "topbarCoachAvatar"
  );

  const welcomeCoachName = document.getElementById(
    "welcomeCoachName"
  );

  const assignedAcademyName = document.getElementById(
    "assignedAcademyName"
  );

  const assignedTeamName = document.getElementById(
    "assignedTeamName"
  );

  const currentSeason = document.getElementById(
    "currentSeason"
  );

  const currentTeamSize = document.getElementById(
    "currentTeamSize"
  );

  if (coach.fullName && topbarCoachName) {
    topbarCoachName.textContent = coach.fullName;
  }

  if (coach.role && topbarCoachRole) {
    topbarCoachRole.textContent = coach.role;
  }

  if (coach.avatarUrl && topbarCoachAvatar) {
    topbarCoachAvatar.src = coach.avatarUrl;
  }

  if (coach.firstName && welcomeCoachName) {
    welcomeCoachName.textContent =
      `Coach ${coach.firstName}`;
  }

  if (
    assignment.academyName &&
    assignedAcademyName
  ) {
    assignedAcademyName.textContent =
      assignment.academyName;
  }

  if (assignment.teamName && assignedTeamName) {
    assignedTeamName.textContent =
      assignment.teamName;
  }

  if (assignment.season && currentSeason) {
    currentSeason.textContent =
      assignment.season;
  }

  if (
    Number.isFinite(assignment.teamSize) &&
    currentTeamSize
  ) {
    currentTeamSize.textContent =
      `${assignment.teamSize} Players`;
  }

  updateStatisticElement(
    "assignedPlayersCount",
    statistics.assignedPlayers
  );

  updateStatisticElement(
    "trainingSessionCount",
    statistics.trainingSessions
  );

  updateStatisticElement(
    "averageAttendance",
    statistics.averageAttendance
  );

  updateStatisticElement(
    "trialInvitationCount",
    statistics.trialInvitations
  );

  if (data.profileCompletion !== undefined) {
    updateProfileCompletion(
      data.profileCompletion
    );
  }
}


function updateStatisticElement(elementId, value) {
  const element = document.getElementById(elementId);

  if (
    !element ||
    !Number.isFinite(Number(value))
  ) {
    return;
  }

  const numericValue = Number(value);

  element.dataset.count = numericValue.toString();
  element.textContent = formatCounterValue(
    element,
    numericValue
  );
}


/* ==========================================================
   INITIALISE DASHBOARD
========================================================== */

function initialiseCoachDashboard() {
  updateDashboardDate();
  setActiveSidebarLink();
  initialiseDashboardCounters();
  updateNotificationIndicator();
  updateProfileCompletion(75);
  loadCoachDashboardData();
}


document.addEventListener(
  "DOMContentLoaded",
  initialiseCoachDashboard
);