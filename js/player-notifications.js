"use strict";

/* =========================================================
   FIFA MISSION INDIA
   PLAYER NOTIFICATIONS
   Frontend demonstration only
========================================================= */


/* ================= ELEMENTS ================= */

const notificationsList =
  document.getElementById("notificationsList");

const notificationsEmptyState =
  document.getElementById(
    "notificationsEmptyState"
  );

const notificationSearchInput =
  document.getElementById(
    "notificationSearchInput"
  );

const notificationFilter =
  document.getElementById(
    "notificationFilter"
  );

const markAllReadButton =
  document.getElementById(
    "markAllReadButton"
  );

const clearNotificationFilterButton =
  document.getElementById(
    "clearNotificationFilterButton"
  );

const totalNotificationCount =
  document.getElementById(
    "totalNotificationCount"
  );

const unreadNotificationCount =
  document.getElementById(
    "unreadNotificationCount"
  );

const trialNotificationCount =
  document.getElementById(
    "trialNotificationCount"
  );

const achievementNotificationCount =
  document.getElementById(
    "achievementNotificationCount"
  );

const heroUnreadCount =
  document.getElementById(
    "heroUnreadCount"
  );

const notificationResultCount =
  document.getElementById(
    "notificationResultCount"
  );

const notificationModal =
  document.getElementById(
    "notificationModal"
  );

const notificationModalCloseButton =
  document.getElementById(
    "notificationModalCloseButton"
  );

const notificationModalDismissButton =
  document.getElementById(
    "notificationModalDismissButton"
  );

const modalNotificationIcon =
  document.getElementById(
    "modalNotificationIcon"
  );

const modalNotificationCategory =
  document.getElementById(
    "modalNotificationCategory"
  );

const notificationModalTitle =
  document.getElementById(
    "notificationModalTitle"
  );

const modalNotificationTime =
  document.getElementById(
    "modalNotificationTime"
  );

const modalNotificationMessage =
  document.getElementById(
    "modalNotificationMessage"
  );

const notificationActionLink =
  document.getElementById(
    "notificationActionLink"
  );

const notificationToast =
  document.getElementById(
    "notificationToast"
  );


/* ================= DEMONSTRATION DATA ================= */

const notifications = [
  {
    id: 1,
    category: "trials",
    title: "New trial opportunity in Dimapur",
    message:
      "The Northeast Regional Talent Trial is now accepting registrations. Review the eligibility requirements and submit your registration before the deadline.",
    icon: "⚽",
    createdAt: "2026-07-18T09:30:00",
    read: false,
    priority: "high",
    actionLabel: "View Trial",
    actionUrl: "player-trials.html"
  },
  {
    id: 2,
    category: "documents",
    title: "Identity document verified",
    message:
      "Your government-issued identity document has been reviewed and successfully verified by the platform verification team.",
    icon: "✅",
    createdAt: "2026-07-17T16:15:00",
    read: false,
    priority: "normal",
    actionLabel: "View Documents",
    actionUrl: "player-documents.html"
  },
  {
    id: 3,
    category: "performance",
    title: "Your latest performance report is ready",
    message:
      "Your technical, physical and tactical assessment has been updated. Review the latest scores and development recommendations.",
    icon: "📊",
    createdAt: "2026-07-16T11:45:00",
    read: true,
    priority: "normal",
    actionLabel: "View Performance",
    actionUrl: "player-performance.html"
  },
  {
    id: 4,
    category: "achievements",
    title: "New achievement unlocked",
    message:
      "You have earned the Profile Completion badge after completing all required player profile sections.",
    icon: "🏆",
    createdAt: "2026-07-15T14:20:00",
    read: false,
    priority: "normal",
    actionLabel: "View Achievement",
    actionUrl: "player-achievements.html"
  },
  {
    id: 5,
    category: "account",
    title: "Profile security reminder",
    message:
      "Please review your account password and notification preferences to ensure your player profile remains secure.",
    icon: "🔐",
    createdAt: "2026-07-14T18:10:00",
    read: true,
    priority: "low",
    actionLabel: "Open Settings",
    actionUrl: "player-settings.html"
  },
  {
    id: 6,
    category: "trials",
    title: "Trial registration deadline approaching",
    message:
      "Registration for the U-17 Elite Academy Selection closes soon. Complete your registration before the published deadline.",
    icon: "⏳",
    createdAt: "2026-07-13T08:25:00",
    read: true,
    priority: "high",
    actionLabel: "View Trial",
    actionUrl: "player-trials.html"
  },
  {
    id: 7,
    category: "documents",
    title: "Medical certificate requires attention",
    message:
      "Your medical fitness certificate has not yet been uploaded. Add the document to improve your verification status.",
    icon: "📄",
    createdAt: "2026-07-12T13:40:00",
    read: true,
    priority: "high",
    actionLabel: "Upload Document",
    actionUrl: "player-documents.html"
  },
  {
    id: 8,
    category: "account",
    title: "Welcome to FIFA Mission India",
    message:
      "Your player account has been created successfully. Complete your profile to access personalised opportunities and recommendations.",
    icon: "👋",
    createdAt: "2026-07-10T10:00:00",
    read: true,
    priority: "normal",
    actionLabel: "Complete Profile",
    actionUrl: "player-profile.html"
  }
];


/* ================= STORAGE ================= */

function loadNotificationState() {
  const storedState =
    localStorage.getItem(
      "playerNotificationReadState"
    );

  if (!storedState) {
    return;
  }

  try {
    const parsedState =
      JSON.parse(storedState);

    if (!Array.isArray(parsedState)) {
      return;
    }

    notifications.forEach((notification) => {
      const matchingState =
        parsedState.find(
          (item) =>
            item.id === notification.id
        );

      if (matchingState) {
        notification.read =
          Boolean(matchingState.read);
      }
    });

  } catch (error) {
    console.error(
      "Unable to load notification state:",
      error
    );
  }
}


function saveNotificationState() {
  const state = notifications.map(
    (notification) => ({
      id: notification.id,
      read: notification.read
    })
  );

  localStorage.setItem(
    "playerNotificationReadState",
    JSON.stringify(state)
  );
}


/* ================= RENDER ================= */

function renderNotifications() {
  const filteredNotifications =
    getFilteredNotifications();

  notificationsList.innerHTML = "";

  filteredNotifications.forEach(
    (notification) => {
      notificationsList.appendChild(
        createNotificationCard(
          notification
        )
      );
    }
  );

  const hasResults =
    filteredNotifications.length > 0;

  notificationsList.hidden =
    !hasResults;

  notificationsEmptyState.hidden =
    hasResults;

  notificationResultCount.textContent =
    `${filteredNotifications.length} ${
      filteredNotifications.length === 1
        ? "notification"
        : "notifications"
    }`;

  updateNotificationStatistics();
}


function createNotificationCard(
  notification
) {
  const article =
    document.createElement("article");

  article.className =
    notification.read
      ? "notification-card"
      : "notification-card notification-unread";

  article.dataset.notificationId =
    String(notification.id);

  article.innerHTML = `
    <div class="notification-icon">
      ${escapeHtml(notification.icon)}
    </div>

    <div class="notification-content">

      <div class="notification-card-heading">

        <div>

          <span class="notification-category">
            ${escapeHtml(
              formatCategory(
                notification.category
              )
            )}
          </span>

          <h3>
            ${escapeHtml(
              notification.title
            )}
          </h3>

        </div>

        ${
          !notification.read
            ? `
              <span
                class="unread-indicator"
                aria-label="Unread notification"
              ></span>
            `
            : ""
        }

      </div>

      <p>
        ${escapeHtml(
          notification.message
        )}
      </p>

      <div class="notification-meta">

        <span class="notification-time">
          ${escapeHtml(
            getRelativeTime(
              notification.createdAt
            )
          )}
        </span>

        <span
          class="notification-badge ${
            notification.read
              ? "badge-read"
              : "badge-unread"
          }"
        >
          ${
            notification.read
              ? "Read"
              : "Unread"
          }
        </span>

        ${
          notification.priority === "high"
            ? `
              <span class="priority-badge">
                Important
              </span>
            `
            : ""
        }

      </div>

      <div class="notification-card-actions">

        <button
          type="button"
          class="notification-view-button"
          data-view-notification="${
            notification.id
          }"
        >
          View Notification
        </button>

        ${
          !notification.read
            ? `
              <button
                type="button"
                class="notification-read-button"
                data-mark-read="${
                  notification.id
                }"
              >
                Mark as Read
              </button>
            `
            : ""
        }

      </div>

    </div>
  `;

  return article;
}


/* ================= FILTERING ================= */

function getFilteredNotifications() {
  const searchTerm =
    notificationSearchInput.value
      .trim()
      .toLowerCase();

  const selectedFilter =
    notificationFilter.value;

  return notifications
    .filter((notification) => {
      const searchableContent = [
        notification.title,
        notification.message,
        notification.category
      ]
        .join(" ")
        .toLowerCase();

      const matchesSearch =
        !searchTerm ||
        searchableContent.includes(
          searchTerm
        );

      let matchesFilter = true;

      if (selectedFilter === "unread") {
        matchesFilter =
          !notification.read;
      } else if (
        selectedFilter !== "all"
      ) {
        matchesFilter =
          notification.category ===
          selectedFilter;
      }

      return (
        matchesSearch &&
        matchesFilter
      );
    })
    .sort(
      (firstNotification,
       secondNotification) =>
        new Date(
          secondNotification.createdAt
        ) -
        new Date(
          firstNotification.createdAt
        )
    );
}


function clearNotificationFilters() {
  notificationSearchInput.value = "";
  notificationFilter.value = "all";

  renderNotifications();
}


/* ================= STATISTICS ================= */

function updateNotificationStatistics() {
  const unreadCount =
    notifications.filter(
      (notification) =>
        !notification.read
    ).length;

  const trialCount =
    notifications.filter(
      (notification) =>
        notification.category ===
        "trials"
    ).length;

  const achievementCount =
    notifications.filter(
      (notification) =>
        notification.category ===
        "achievements"
    ).length;

  totalNotificationCount.textContent =
    String(notifications.length);

  unreadNotificationCount.textContent =
    String(unreadCount);

  trialNotificationCount.textContent =
    String(trialCount);

  achievementNotificationCount.textContent =
    String(achievementCount);

  heroUnreadCount.textContent =
    String(unreadCount);

  markAllReadButton.disabled =
    unreadCount === 0;
}


/* ================= READ STATUS ================= */

function markNotificationAsRead(
  notificationId
) {
  const notification =
    notifications.find(
      (item) =>
        item.id === notificationId
    );

  if (
    !notification ||
    notification.read
  ) {
    return;
  }

  notification.read = true;

  saveNotificationState();
  renderNotifications();

  showToast(
    "Notification marked as read."
  );
}


function markAllNotificationsAsRead() {
  const hasUnreadNotifications =
    notifications.some(
      (notification) =>
        !notification.read
    );

  if (!hasUnreadNotifications) {
    return;
  }

  notifications.forEach(
    (notification) => {
      notification.read = true;
    }
  );

  saveNotificationState();
  renderNotifications();

  showToast(
    "All notifications marked as read."
  );
}


/* ================= MODAL ================= */

function openNotificationModal(
  notificationId
) {
  const notification =
    notifications.find(
      (item) =>
        item.id === notificationId
    );

  if (!notification) {
    return;
  }

  modalNotificationIcon.textContent =
    notification.icon;

  modalNotificationCategory.textContent =
    formatCategory(
      notification.category
    );

  notificationModalTitle.textContent =
    notification.title;

  modalNotificationTime.textContent =
    formatFullDate(
      notification.createdAt
    );

  modalNotificationMessage.textContent =
    notification.message;

  notificationActionLink.textContent =
    notification.actionLabel;

  notificationActionLink.href =
    notification.actionUrl;

  notificationModal.hidden = false;

  document.body.classList.add(
    "modal-open"
  );

  if (!notification.read) {
    notification.read = true;

    saveNotificationState();
    renderNotifications();
  }

  notificationModalCloseButton.focus();
}


function closeNotificationModal() {
  notificationModal.hidden = true;

  document.body.classList.remove(
    "modal-open"
  );
}


/* ================= TOAST ================= */

let toastTimer = null;

function showToast(message) {
  notificationToast.textContent =
    message;

  notificationToast.hidden = false;

  window.clearTimeout(toastTimer);

  toastTimer = window.setTimeout(
    () => {
      notificationToast.hidden = true;
    },
    2500
  );
}


/* ================= EVENTS ================= */

notificationsList.addEventListener(
  "click",
  (event) => {
    const viewButton =
      event.target.closest(
        "[data-view-notification]"
      );

    const markReadButton =
      event.target.closest(
        "[data-mark-read]"
      );

    if (viewButton) {
      openNotificationModal(
        Number(
          viewButton.dataset
            .viewNotification
        )
      );

      return;
    }

    if (markReadButton) {
      markNotificationAsRead(
        Number(
          markReadButton.dataset
            .markRead
        )
      );
    }
  }
);


notificationSearchInput.addEventListener(
  "input",
  renderNotifications
);


notificationFilter.addEventListener(
  "change",
  renderNotifications
);


markAllReadButton.addEventListener(
  "click",
  markAllNotificationsAsRead
);


clearNotificationFilterButton.addEventListener(
  "click",
  clearNotificationFilters
);


notificationModalCloseButton.addEventListener(
  "click",
  closeNotificationModal
);


notificationModalDismissButton.addEventListener(
  "click",
  closeNotificationModal
);


notificationModal.addEventListener(
  "click",
  (event) => {
    if (
      event.target ===
      notificationModal
    ) {
      closeNotificationModal();
    }
  }
);


document.addEventListener(
  "keydown",
  (event) => {
    if (
      event.key === "Escape" &&
      !notificationModal.hidden
    ) {
      closeNotificationModal();
    }
  }
);


/* ================= HELPERS ================= */

function formatCategory(category) {
  const categoryLabels = {
    trials: "Trial Update",
    performance: "Performance",
    documents: "Document Verification",
    achievements: "Achievement",
    account: "Account"
  };

  return (
    categoryLabels[category] ||
    "Notification"
  );
}


function getRelativeTime(dateValue) {
  const notificationDate =
    new Date(dateValue);

  const currentDate =
    new Date();

  const difference =
    currentDate - notificationDate;

  const minute =
    60 * 1000;

  const hour =
    60 * minute;

  const day =
    24 * hour;

  if (difference < minute) {
    return "Just now";
  }

  if (difference < hour) {
    const minutes =
      Math.floor(
        difference / minute
      );

    return `${minutes} ${
      minutes === 1
        ? "minute"
        : "minutes"
    } ago`;
  }

  if (difference < day) {
    const hours =
      Math.floor(
        difference / hour
      );

    return `${hours} ${
      hours === 1
        ? "hour"
        : "hours"
    } ago`;
  }

  const days =
    Math.floor(
      difference / day
    );

  if (days <= 7) {
    return `${days} ${
      days === 1
        ? "day"
        : "days"
    } ago`;
  }

  return formatFullDate(dateValue);
}


function formatFullDate(dateValue) {
  const date =
    new Date(dateValue);

  return new Intl.DateTimeFormat(
    "en-IN",
    {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    }
  ).format(date);
}


function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}


/* ================= INITIALISE ================= */

function initialiseNotificationsPage() {
  /*
    BACKEND INTEGRATION PLACEHOLDER

    Suggested endpoint:

    GET /api/v1/player/notifications

    Mr. Harsh can replace the demonstration
    notification array with authenticated API data.

    Additional suggested endpoints:

    PATCH /api/v1/player/notifications/:id/read
    PATCH /api/v1/player/notifications/read-all

    SECURITY REQUIREMENTS:
    - Authenticate the logged-in player.
    - Return only that player's notifications.
    - Validate notification ownership.
    - Do not trust player IDs from the frontend.
    - Apply rate limiting.
  */

  loadNotificationState();
  renderNotifications();
}

initialiseNotificationsPage();