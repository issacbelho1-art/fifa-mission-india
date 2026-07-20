"use strict";

/* =========================================================
   FIFA MISSION INDIA - PLAYER DASHBOARD
   Frontend demonstration only
========================================================= */

const dashboardSidebar =
  document.getElementById("dashboardSidebar");

const sidebarOverlay =
  document.getElementById("sidebarOverlay");

const menuButton =
  document.getElementById("menuButton");

const sidebarCloseButton =
  document.getElementById("sidebarCloseButton");

const logoutButton =
  document.getElementById("logoutButton");

const markAllReadButton =
  document.getElementById("markAllReadButton");

const notificationList =
  document.getElementById("notificationList");

const sidebarLinks = Array.from(
  document.querySelectorAll("[data-section-link]")
);


/* ================= DEMONSTRATION PLAYER DATA ================= */

const defaultPlayerData = {
  firstName: "Player",
  lastName: "",
  email: "player@example.com",
  phone: "9876544821",
  city: "Dimapur",
  state: "Nagaland",
  dateOfBirth: "2005-08-15",
  primaryPosition: "Midfielder",
  preferredFoot: "Right Foot",
  experienceLevel: "Academy Level",
  currentClub: "Not provided",
  playerId: "FMI-PLAYER-482193",
  profileCompletion: 72,
  performanceScore: 78
};


/* ================= INITIALISE DASHBOARD ================= */

function initialiseDashboard() {
  const playerData = getPlayerData();

  populatePlayerData(playerData);
  updateProfileCompletion(playerData.profileCompletion);
  initialiseNavigation();
}


function getPlayerData() {
  /*
    Mr. Harsh can later replace this function with an API request:

    GET /api/v1/players/me

    const response = await fetch(
      "/api/v1/players/me",
      {
        method: "GET",
        credentials: "include"
      }
    );

    The server must identify the player using the secure
    server-side session or access token.
  */

  const savedPlayerData =
    sessionStorage.getItem("playerDashboardData");

  if (!savedPlayerData) {
    return defaultPlayerData;
  }

  try {
    return {
      ...defaultPlayerData,
      ...JSON.parse(savedPlayerData)
    };
  } catch (error) {
    console.error(
      "Unable to read saved player data:",
      error
    );

    return defaultPlayerData;
  }
}


/* ================= POPULATE PLAYER DATA ================= */

function populatePlayerData(player) {
  const fullName =
    `${player.firstName} ${player.lastName}`.trim() ||
    "Player";

  const initials =
    `${player.firstName?.charAt(0) || ""}${
      player.lastName?.charAt(0) || ""
    }`.toUpperCase() || "PL";

  setText("headerPlayerName", player.firstName || "Player");
  setText("headerProfileName", fullName);
  setText("headerAvatarInitials", initials);

  setText("playerProfileName", fullName);
  setText("playerProfileInitials", initials);

  setText(
    "playerProfileLocation",
    [player.city, player.state]
      .filter(Boolean)
      .join(", ") || "Location not available"
  );

  setText(
    "playerPositionTag",
    player.primaryPosition || "Position not added"
  );

  setText(
    "playerFootTag",
    player.preferredFoot || "Preferred foot not added"
  );

  setText(
    "playerExperienceTag",
    player.experienceLevel || "Experience not added"
  );

  setText(
    "playerId",
    player.playerId || "Not available"
  );

  setText(
    "playerEmail",
    player.email || "Not available"
  );

  setText(
    "playerPhone",
    formatPhoneNumber(player.phone)
  );

  setText(
    "playerDateOfBirth",
    formatDate(player.dateOfBirth)
  );

  setText(
    "playerClub",
    player.currentClub || "Not provided"
  );

  setText(
    "performanceScore",
    String(player.performanceScore || 0)
  );
}


function setText(elementId, value) {
  const element = document.getElementById(elementId);

  if (element) {
    element.textContent = value;
  }
}


function formatPhoneNumber(phone) {
  const digits = String(phone || "")
    .replace(/\D/g, "")
    .slice(-10);

  if (digits.length !== 10) {
    return "Not available";
  }

  return `+91 ${digits.slice(0, 5)} ${digits.slice(5)}`;
}


function formatDate(dateValue) {
  if (!dateValue) {
    return "Not available";
  }

  const date = new Date(`${dateValue}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return "Not available";
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric"
  }).format(date);
}


/* ================= PROFILE COMPLETION ================= */

function updateProfileCompletion(value) {
  const completion = Math.min(
    Math.max(Number(value) || 0, 0),
    100
  );

  setText(
    "profileCompletionText",
    `${completion}%`
  );

  const completionBar =
    document.getElementById("profileCompletionBar");

  if (completionBar) {
    completionBar.style.width =
      `${completion}%`;
  }

  const circle =
    document.querySelector(".completion-value");

  if (circle) {
    const circumference = 314;
    const offset =
      circumference -
      (completion / 100) * circumference;

    circle.style.strokeDashoffset =
      String(offset);
  }

  const circleValue =
    document.querySelector(
      ".completion-circle strong"
    );

  if (circleValue) {
    circleValue.textContent =
      `${completion}%`;
  }
}


/* ================= SIDEBAR ================= */

function openSidebar() {
  dashboardSidebar.classList.add("open");
  sidebarOverlay.hidden = false;
  document.body.classList.add("sidebar-open");
}


function closeSidebar() {
  dashboardSidebar.classList.remove("open");
  sidebarOverlay.hidden = true;
  document.body.classList.remove("sidebar-open");
}


menuButton.addEventListener("click", openSidebar);

sidebarCloseButton.addEventListener(
  "click",
  closeSidebar
);

sidebarOverlay.addEventListener(
  "click",
  closeSidebar
);


window.addEventListener("resize", () => {
  if (window.innerWidth > 920) {
    closeSidebar();
  }
});


/* ================= NAVIGATION ================= */

function initialiseNavigation() {
  sidebarLinks.forEach((link) => {
    link.addEventListener("click", () => {
      setActiveNavigationLink(link);
      closeSidebar();
    });
  });
}


function setActiveNavigationLink(activeLink) {
  sidebarLinks.forEach((link) => {
    link.classList.toggle(
      "active",
      link === activeLink
    );
  });
}


/* ================= NOTIFICATIONS ================= */

markAllReadButton.addEventListener("click", () => {
  const unreadNotifications =
    notificationList.querySelectorAll(
      ".notification-item.unread"
    );

  unreadNotifications.forEach((notification) => {
    notification.classList.remove("unread");
  });

  markAllReadButton.textContent = "All Read";

  const notificationBadges =
    document.querySelectorAll(".sidebar-badge");

  notificationBadges.forEach((badge) => {
    if (
      badge.closest('[href="#notifications"]')
    ) {
      badge.textContent = "0";
    }
  });

  const headerNotificationCount =
    document.querySelector(
      ".notification-button b"
    );

  if (headerNotificationCount) {
    headerNotificationCount.textContent = "0";
  }
});


/* ================= PROFILE ACTION ================= */

document
  .getElementById("editProfileButton")
  .addEventListener("click", () => {
    window.location.href =
      "player-profile-edit.html";
  });


/* ================= PERFORMANCE PERIOD ================= */

document
  .getElementById("performancePeriod")
  .addEventListener("change", (event) => {
    const selectedPeriod = event.target.value;

    /*
      Backend integration placeholder:

      GET /api/v1/players/me/performance?period=month
    */

    console.info(
      "Selected performance period:",
      selectedPeriod
    );
  });


/* ================= LOGOUT ================= */

logoutButton.addEventListener("click", () => {
  const userConfirmed = window.confirm(
    "Are you sure you want to log out?"
  );

  if (!userConfirmed) {
    return;
  }

  /*
    BACKEND INTEGRATION PLACEHOLDER

    POST /api/v1/auth/logout

    The server should:
    - Destroy the server-side session.
    - Clear authentication cookies.
    - Invalidate refresh tokens when applicable.
  */

  sessionStorage.removeItem("registrationRole");
  sessionStorage.removeItem("maskedDestination");
  sessionStorage.removeItem("playerDashboardData");

  window.location.href = "login.html";
});


initialiseDashboard();