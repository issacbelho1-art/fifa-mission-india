/* ==========================================================
   FIFA MISSION INDIA
   COACH PROFILE SCRIPT — PART 1

   Includes:
   - DOM references
   - Application state
   - Utility functions
   - Sidebar controls
   - Search panel controls
   - Account dropdown
   - Notification panel
   - Keyboard controls
   - Outside-click controls
   - Resize handling
   - Initial interface setup
========================================================== */

"use strict";


/* ==========================================================
   DOM REFERENCES
========================================================== */

const coachProfileDOM = {
  body: document.body,

  sidebar: document.getElementById("coachSidebar"),
  sidebarOverlay: document.getElementById("sidebarOverlay"),
  sidebarOpenButton: document.getElementById("mobileMenuButton"),
  sidebarCloseButton: document.getElementById("sidebarCloseButton"),

  searchToggleButton: document.getElementById("profileSearchToggle"),
  searchPanel: document.getElementById("profileSearchPanel"),
  searchForm: document.getElementById("profileSearchForm"),
  searchInput: document.getElementById("profileSearchInput"),
  searchCloseButton: document.getElementById("profileSearchClose"),

  accountMenuButton: document.getElementById("coachAccountButton"),
  accountDropdown: document.getElementById("coachAccountDropdown"),

  notificationButton: document.getElementById("notificationButton"),
  notificationPanel: document.getElementById("notificationPanel"),
  notificationCloseButton: document.getElementById(
    "notificationCloseButton"
  ),
  notificationList: document.getElementById("notificationList"),
  markAllNotificationsButton: document.getElementById(
    "markAllNotificationsButton"
  ),
  notificationBadge: document.getElementById("notificationBadge"),

  editProfileModal: document.getElementById("editProfileModal"),
  previewProfileModal: document.getElementById("previewProfileModal"),
  logoutModal: document.getElementById("logoutModal"),

  toast: document.getElementById("profileToast"),
  toastMessage: document.getElementById("profileToastMessage"),

  visibilityToggle: document.getElementById("profileVisibilityToggle"),

  profileCompletionValue: document.getElementById(
    "profileCompletionValue"
  ),
  profileCompletionBar: document.getElementById(
    "profileCompletionBar"
  ),

  profileStatisticValues: document.querySelectorAll(
    "[data-profile-statistic]"
  ),

  searchableSections: document.querySelectorAll(
    ".searchable-profile-section"
  ),

  modalOpenButtons: document.querySelectorAll("[data-modal-open]"),
  modalCloseButtons: document.querySelectorAll("[data-modal-close]"),
  modalBackdrops: document.querySelectorAll(".portal-modal-backdrop")
};


/* ==========================================================
   APPLICATION STATE
========================================================== */

const coachProfileState = {
  sidebarOpen: false,
  searchOpen: false,
  accountDropdownOpen: false,
  notificationPanelOpen: false,
  activeModal: null,
  toastTimer: null,
  searchTimer: null,
  animationFrame: null,
  mobileBreakpoint: 1024,
  lastFocusedElement: null,
  profileVisibility: true,
  unreadNotifications: 0
};


/* ==========================================================
   GENERAL UTILITY FUNCTIONS
========================================================== */

/**
 * Safely selects a single DOM element.
 *
 * @param {string} selector
 * @param {ParentNode} parent
 * @returns {Element|null}
 */
function selectElement(selector, parent = document) {
  if (!selector || !parent) {
    return null;
  }

  return parent.querySelector(selector);
}


/**
 * Safely selects multiple DOM elements.
 *
 * @param {string} selector
 * @param {ParentNode} parent
 * @returns {Element[]}
 */
function selectElements(selector, parent = document) {
  if (!selector || !parent) {
    return [];
  }

  return Array.from(parent.querySelectorAll(selector));
}


/**
 * Checks whether an element exists.
 *
 * @param {Element|null} element
 * @returns {boolean}
 */
function elementExists(element) {
  return element instanceof Element;
}


/**
 * Sets the hidden state of an element.
 *
 * @param {HTMLElement|null} element
 * @param {boolean} hidden
 */
function setElementHidden(element, hidden) {
  if (!element) {
    return;
  }

  element.hidden = hidden;
  element.setAttribute("aria-hidden", String(hidden));
}


/**
 * Sets the expanded state of a control.
 *
 * @param {HTMLElement|null} element
 * @param {boolean} expanded
 */
function setExpandedState(element, expanded) {
  if (!element) {
    return;
  }

  element.setAttribute("aria-expanded", String(expanded));
}


/**
 * Prevents page scrolling.
 */
function lockPageScroll() {
  document.body.classList.add("portal-scroll-locked");
}


/**
 * Restores page scrolling when no overlay interface is open.
 */
function unlockPageScrollIfPossible() {
  const overlayInterfaceOpen =
    coachProfileState.sidebarOpen ||
    coachProfileState.notificationPanelOpen ||
    Boolean(coachProfileState.activeModal);

  if (!overlayInterfaceOpen) {
    document.body.classList.remove("portal-scroll-locked");
  }
}


/**
 * Returns true when the current viewport is tablet-sized or smaller.
 *
 * @returns {boolean}
 */
function isMobileViewport() {
  return window.innerWidth <= coachProfileState.mobileBreakpoint;
}


/**
 * Normalizes text for search comparison.
 *
 * @param {string} value
 * @returns {string}
 */
function normalizeText(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}


/**
 * Escapes HTML-sensitive characters.
 *
 * @param {string} value
 * @returns {string}
 */
function escapeHTML(value) {
  const temporaryElement = document.createElement("div");

  temporaryElement.textContent = String(value || "");

  return temporaryElement.innerHTML;
}


/**
 * Creates a debounced function.
 *
 * @param {Function} callback
 * @param {number} delay
 * @returns {Function}
 */
function debounce(callback, delay = 250) {
  let timeoutId = null;

  return (...args) => {
    window.clearTimeout(timeoutId);

    timeoutId = window.setTimeout(() => {
      callback(...args);
    }, delay);
  };
}


/**
 * Creates a throttled function.
 *
 * @param {Function} callback
 * @param {number} delay
 * @returns {Function}
 */
function throttle(callback, delay = 150) {
  let canRun = true;

  return (...args) => {
    if (!canRun) {
      return;
    }

    canRun = false;

    callback(...args);

    window.setTimeout(() => {
      canRun = true;
    }, delay);
  };
}


/* ==========================================================
   FOCUS MANAGEMENT
========================================================== */

/**
 * Returns focusable elements inside a container.
 *
 * @param {HTMLElement|null} container
 * @returns {HTMLElement[]}
 */
function getFocusableElements(container) {
  if (!container) {
    return [];
  }

  const focusableSelector = [
    "a[href]",
    "button:not([disabled])",
    "input:not([disabled])",
    "select:not([disabled])",
    "textarea:not([disabled])",
    "[tabindex]:not([tabindex='-1'])"
  ].join(",");

  return selectElements(focusableSelector, container).filter(
    (element) =>
      !element.hidden &&
      element.getAttribute("aria-hidden") !== "true" &&
      element.offsetParent !== null
  );
}


/**
 * Places focus on the first available interactive element.
 *
 * @param {HTMLElement|null} container
 */
function focusFirstElement(container) {
  const focusableElements = getFocusableElements(container);

  if (focusableElements.length > 0) {
    focusableElements[0].focus();
    return;
  }

  if (container) {
    container.setAttribute("tabindex", "-1");
    container.focus();
  }
}


/**
 * Keeps keyboard focus inside an open modal or panel.
 *
 * @param {KeyboardEvent} event
 * @param {HTMLElement|null} container
 */
function trapFocus(event, container) {
  if (
    event.key !== "Tab" ||
    !container ||
    container.hidden
  ) {
    return;
  }

  const focusableElements = getFocusableElements(container);

  if (focusableElements.length === 0) {
    event.preventDefault();
    return;
  }

  const firstFocusableElement = focusableElements[0];
  const lastFocusableElement =
    focusableElements[focusableElements.length - 1];

  if (
    event.shiftKey &&
    document.activeElement === firstFocusableElement
  ) {
    event.preventDefault();
    lastFocusableElement.focus();
    return;
  }

  if (
    !event.shiftKey &&
    document.activeElement === lastFocusableElement
  ) {
    event.preventDefault();
    firstFocusableElement.focus();
  }
}


/* ==========================================================
   SIDEBAR CONTROLS
========================================================== */

/**
 * Opens the coach sidebar on tablet and mobile devices.
 */
function openCoachSidebar() {
  const { sidebar, sidebarOverlay, sidebarOpenButton } =
    coachProfileDOM;

  if (!sidebar || !isMobileViewport()) {
    return;
  }

  closeAccountDropdown();
  closeSearchPanel();
  closeNotificationPanel();

  coachProfileState.lastFocusedElement =
    document.activeElement instanceof HTMLElement
      ? document.activeElement
      : null;

  sidebar.classList.add("open");
  sidebar.setAttribute("aria-hidden", "false");

  if (sidebarOverlay) {
    sidebarOverlay.hidden = false;
    sidebarOverlay.classList.add("visible");
    sidebarOverlay.setAttribute("aria-hidden", "false");
  }

  setExpandedState(sidebarOpenButton, true);

  coachProfileState.sidebarOpen = true;

  lockPageScroll();

  window.requestAnimationFrame(() => {
    focusFirstElement(sidebar);
  });
}


/**
 * Closes the coach sidebar.
 *
 * @param {boolean} restoreFocus
 */
function closeCoachSidebar(restoreFocus = true) {
  const { sidebar, sidebarOverlay, sidebarOpenButton } =
    coachProfileDOM;

  if (!sidebar) {
    return;
  }

  sidebar.classList.remove("open");

  if (isMobileViewport()) {
    sidebar.setAttribute("aria-hidden", "true");
  } else {
    sidebar.setAttribute("aria-hidden", "false");
  }

  if (sidebarOverlay) {
    sidebarOverlay.classList.remove("visible");
    sidebarOverlay.hidden = true;
    sidebarOverlay.setAttribute("aria-hidden", "true");
  }

  setExpandedState(sidebarOpenButton, false);

  coachProfileState.sidebarOpen = false;

  unlockPageScrollIfPossible();

  if (
    restoreFocus &&
    coachProfileState.lastFocusedElement instanceof HTMLElement
  ) {
    coachProfileState.lastFocusedElement.focus();
  }
}


/**
 * Toggles the sidebar.
 */
function toggleCoachSidebar() {
  if (coachProfileState.sidebarOpen) {
    closeCoachSidebar();
  } else {
    openCoachSidebar();
  }
}


/* ==========================================================
   SEARCH PANEL CONTROLS
========================================================== */

/**
 * Opens the profile search panel.
 */
function openSearchPanel() {
  const { searchPanel, searchToggleButton, searchInput } =
    coachProfileDOM;

  if (!searchPanel) {
    return;
  }

  closeAccountDropdown();
  closeNotificationPanel();

  searchPanel.hidden = false;
  searchPanel.classList.add("open");
  searchPanel.setAttribute("aria-hidden", "false");

  setExpandedState(searchToggleButton, true);

  coachProfileState.searchOpen = true;

  window.requestAnimationFrame(() => {
    searchInput?.focus();
  });
}


/**
 * Clears all profile search states.
 */
function clearProfileSearchState() {
  coachProfileDOM.searchableSections.forEach((section) => {
    section.classList.remove(
      "search-match",
      "search-no-match"
    );
  });
}


/**
 * Closes the profile search panel.
 *
 * @param {boolean} clearInput
 */
function closeSearchPanel(clearInput = false) {
  const { searchPanel, searchToggleButton, searchInput } =
    coachProfileDOM;

  if (!searchPanel) {
    return;
  }

  searchPanel.classList.remove("open");
  searchPanel.hidden = true;
  searchPanel.setAttribute("aria-hidden", "true");

  setExpandedState(searchToggleButton, false);

  coachProfileState.searchOpen = false;

  if (clearInput && searchInput) {
    searchInput.value = "";
    clearProfileSearchState();
  }
}


/**
 * Toggles the profile search panel.
 */
function toggleSearchPanel() {
  if (coachProfileState.searchOpen) {
    closeSearchPanel();
  } else {
    openSearchPanel();
  }
}


/* ==========================================================
   ACCOUNT DROPDOWN CONTROLS
========================================================== */

/**
 * Opens the coach account dropdown.
 */
function openAccountDropdown() {
  const { accountMenuButton, accountDropdown } =
    coachProfileDOM;

  if (!accountDropdown) {
    return;
  }

  closeSearchPanel();
  closeNotificationPanel();

  accountDropdown.hidden = false;
  accountDropdown.classList.add("open");
  accountDropdown.setAttribute("aria-hidden", "false");

  setExpandedState(accountMenuButton, true);

  coachProfileState.accountDropdownOpen = true;
}


/**
 * Closes the coach account dropdown.
 */
function closeAccountDropdown() {
  const { accountMenuButton, accountDropdown } =
    coachProfileDOM;

  if (!accountDropdown) {
    return;
  }

  accountDropdown.classList.remove("open");
  accountDropdown.hidden = true;
  accountDropdown.setAttribute("aria-hidden", "true");

  setExpandedState(accountMenuButton, false);

  coachProfileState.accountDropdownOpen = false;
}


/**
 * Toggles the coach account dropdown.
 */
function toggleAccountDropdown() {
  if (coachProfileState.accountDropdownOpen) {
    closeAccountDropdown();
  } else {
    openAccountDropdown();
  }
}


/* ==========================================================
   NOTIFICATION PANEL CONTROLS
========================================================== */

/**
 * Opens the notification panel.
 */
function openNotificationPanel() {
  const { notificationPanel, notificationButton } =
    coachProfileDOM;

  if (!notificationPanel) {
    return;
  }

  closeAccountDropdown();
  closeSearchPanel();
  closeCoachSidebar(false);

  coachProfileState.lastFocusedElement =
    document.activeElement instanceof HTMLElement
      ? document.activeElement
      : null;

  notificationPanel.hidden = false;
  notificationPanel.classList.add("open");
  notificationPanel.setAttribute("aria-hidden", "false");

  setExpandedState(notificationButton, true);

  coachProfileState.notificationPanelOpen = true;

  document.body.classList.add("notification-open");

  lockPageScroll();

  window.requestAnimationFrame(() => {
    focusFirstElement(notificationPanel);
  });
}


/**
 * Closes the notification panel.
 *
 * @param {boolean} restoreFocus
 */
function closeNotificationPanel(restoreFocus = true) {
  const { notificationPanel, notificationButton } =
    coachProfileDOM;

  if (!notificationPanel) {
    return;
  }

  notificationPanel.classList.remove("open");
  notificationPanel.hidden = true;
  notificationPanel.setAttribute("aria-hidden", "true");

  setExpandedState(notificationButton, false);

  coachProfileState.notificationPanelOpen = false;

  document.body.classList.remove("notification-open");

  unlockPageScrollIfPossible();

  if (
    restoreFocus &&
    coachProfileState.lastFocusedElement instanceof HTMLElement
  ) {
    coachProfileState.lastFocusedElement.focus();
  }
}


/**
 * Toggles the notification panel.
 */
function toggleNotificationPanel() {
  if (coachProfileState.notificationPanelOpen) {
    closeNotificationPanel();
  } else {
    openNotificationPanel();
  }
}


/* ==========================================================
   NOTIFICATION COUNT
========================================================== */

/**
 * Counts unread notifications.
 *
 * @returns {number}
 */
function countUnreadNotifications() {
  if (!coachProfileDOM.notificationList) {
    return 0;
  }

  return selectElements(
    ".notification-item.unread",
    coachProfileDOM.notificationList
  ).length;
}


/**
 * Updates the notification badge.
 */
function updateNotificationBadge() {
  const unreadCount = countUnreadNotifications();

  coachProfileState.unreadNotifications = unreadCount;

  if (!coachProfileDOM.notificationBadge) {
    return;
  }

  coachProfileDOM.notificationBadge.textContent =
    unreadCount > 99 ? "99+" : String(unreadCount);

  coachProfileDOM.notificationBadge.hidden =
    unreadCount === 0;

  coachProfileDOM.notificationBadge.setAttribute(
    "aria-label",
    `${unreadCount} unread notification${
      unreadCount === 1 ? "" : "s"
    }`
  );
}


/**
 * Marks all notifications as read.
 */
function markAllNotificationsAsRead() {
  if (!coachProfileDOM.notificationList) {
    return;
  }

  const unreadNotifications = selectElements(
    ".notification-item.unread",
    coachProfileDOM.notificationList
  );

  unreadNotifications.forEach((notification) => {
    notification.classList.remove("unread");
    notification.setAttribute("data-read", "true");
  });

  updateNotificationBadge();

  if (
    typeof showProfileToast === "function"
  ) {
    showProfileToast(
      "All notifications have been marked as read."
    );
  }
}


/* ==========================================================
   MODAL PLACEHOLDER CONTROLS
   Full modal logic continues in Part 2.
========================================================== */

/**
 * Returns a modal using its ID.
 *
 * @param {string} modalId
 * @returns {HTMLElement|null}
 */
function getModalById(modalId) {
  if (!modalId) {
    return null;
  }

  return document.getElementById(modalId);
}


/**
 * Closes all currently visible portal modals.
 *
 * Full behavior will be extended in Part 2.
 */
function closeAllPortalModals() {
  const modals = selectElements(".portal-modal");

  modals.forEach((modal) => {
    modal.hidden = true;
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
  });

  coachProfileState.activeModal = null;

  document.body.classList.remove("modal-open");

  unlockPageScrollIfPossible();
}


/* ==========================================================
   KEYBOARD CONTROLS
========================================================== */

/**
 * Handles global keyboard controls.
 *
 * @param {KeyboardEvent} event
 */
function handleGlobalKeydown(event) {
  if (event.key === "Escape") {
    if (coachProfileState.activeModal) {
      closeAllPortalModals();
      return;
    }

    if (coachProfileState.notificationPanelOpen) {
      closeNotificationPanel();
      return;
    }

    if (coachProfileState.accountDropdownOpen) {
      closeAccountDropdown();
      return;
    }

    if (coachProfileState.searchOpen) {
      closeSearchPanel();
      return;
    }

    if (coachProfileState.sidebarOpen) {
      closeCoachSidebar();
    }
  }

  if (
    coachProfileState.activeModal &&
    coachProfileState.activeModal instanceof HTMLElement
  ) {
    trapFocus(event, coachProfileState.activeModal);
    return;
  }

  if (
    coachProfileState.notificationPanelOpen &&
    coachProfileDOM.notificationPanel
  ) {
    trapFocus(event, coachProfileDOM.notificationPanel);
    return;
  }

  if (
    coachProfileState.sidebarOpen &&
    coachProfileDOM.sidebar
  ) {
    trapFocus(event, coachProfileDOM.sidebar);
  }
}


/* ==========================================================
   OUTSIDE-CLICK CONTROLS
========================================================== */

/**
 * Handles clicks outside dropdown interfaces.
 *
 * @param {MouseEvent} event
 */
function handleDocumentClick(event) {
  const target = event.target;

  if (!(target instanceof Node)) {
    return;
  }

  if (
    coachProfileState.accountDropdownOpen &&
    coachProfileDOM.accountDropdown &&
    coachProfileDOM.accountMenuButton &&
    !coachProfileDOM.accountDropdown.contains(target) &&
    !coachProfileDOM.accountMenuButton.contains(target)
  ) {
    closeAccountDropdown();
  }

  if (
    coachProfileState.searchOpen &&
    coachProfileDOM.searchPanel &&
    coachProfileDOM.searchToggleButton &&
    !coachProfileDOM.searchPanel.contains(target) &&
    !coachProfileDOM.searchToggleButton.contains(target)
  ) {
    closeSearchPanel();
  }
}


/* ==========================================================
   WINDOW RESIZE HANDLING
========================================================== */

/**
 * Resets responsive interface states after viewport changes.
 */
function handleWindowResize() {
  const { sidebar, sidebarOverlay } = coachProfileDOM;

  if (!isMobileViewport()) {
    coachProfileState.sidebarOpen = false;

    if (sidebar) {
      sidebar.classList.remove("open");
      sidebar.setAttribute("aria-hidden", "false");
    }

    if (sidebarOverlay) {
      sidebarOverlay.classList.remove("visible");
      sidebarOverlay.hidden = true;
      sidebarOverlay.setAttribute("aria-hidden", "true");
    }

    setExpandedState(
      coachProfileDOM.sidebarOpenButton,
      false
    );

    unlockPageScrollIfPossible();
  } else if (
    sidebar &&
    !coachProfileState.sidebarOpen
  ) {
    sidebar.setAttribute("aria-hidden", "true");
  }
}

const throttledResizeHandler = throttle(
  handleWindowResize,
  150
);


/* ==========================================================
   SIDEBAR ACTIVE NAVIGATION
========================================================== */

/**
 * Highlights the sidebar link matching the current page.
 */
function setActiveSidebarNavigation() {
  const navigationLinks = selectElements(
    ".coach-sidebar-nav a, .sidebar-navigation a"
  );

  if (navigationLinks.length === 0) {
    return;
  }

  const currentFile =
    window.location.pathname.split("/").pop() ||
    "coach-dashboard.html";

  navigationLinks.forEach((link) => {
    const linkURL = link.getAttribute("href");

    if (!linkURL) {
      return;
    }

    const linkFile = linkURL.split("/").pop()?.split("#")[0];

    const isActive =
      linkFile === currentFile ||
      link.classList.contains("active");

    link.classList.toggle("active", isActive);

    if (isActive) {
      link.setAttribute("aria-current", "page");
    } else {
      link.removeAttribute("aria-current");
    }
  });
}


/* ==========================================================
   DATE INITIALIZATION
========================================================== */

/**
 * Formats date values inside elements with data-current-date.
 */
function initializeCurrentDates() {
  const dateElements = selectElements("[data-current-date]");

  if (dateElements.length === 0) {
    return;
  }

  const formattedDate = new Intl.DateTimeFormat("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric"
  }).format(new Date());

  dateElements.forEach((element) => {
    element.textContent = formattedDate;
    element.setAttribute(
      "datetime",
      new Date().toISOString()
    );
  });
}


/* ==========================================================
   INITIAL ACCESSIBILITY STATES
========================================================== */

/**
 * Establishes the initial ARIA and hidden states.
 */
function initializeAccessibilityStates() {
  if (coachProfileDOM.sidebar) {
    coachProfileDOM.sidebar.setAttribute(
      "aria-hidden",
      String(isMobileViewport())
    );
  }

  if (coachProfileDOM.sidebarOverlay) {
    coachProfileDOM.sidebarOverlay.hidden = true;
    coachProfileDOM.sidebarOverlay.setAttribute(
      "aria-hidden",
      "true"
    );
  }

  if (coachProfileDOM.searchPanel) {
    coachProfileDOM.searchPanel.hidden = true;
    coachProfileDOM.searchPanel.setAttribute(
      "aria-hidden",
      "true"
    );
  }

  if (coachProfileDOM.accountDropdown) {
    coachProfileDOM.accountDropdown.hidden = true;
    coachProfileDOM.accountDropdown.setAttribute(
      "aria-hidden",
      "true"
    );
  }

  if (coachProfileDOM.notificationPanel) {
    coachProfileDOM.notificationPanel.hidden = true;
    coachProfileDOM.notificationPanel.setAttribute(
      "aria-hidden",
      "true"
    );
  }

  coachProfileDOM.modalOpenButtons.forEach((button) => {
    const modalId = button.getAttribute("data-modal-open");

    if (modalId) {
      button.setAttribute("aria-controls", modalId);
      button.setAttribute("aria-haspopup", "dialog");
    }
  });

  selectElements(".portal-modal").forEach((modal) => {
    modal.hidden = true;
    modal.setAttribute("aria-hidden", "true");
    modal.setAttribute("role", "dialog");
    modal.setAttribute("aria-modal", "true");
  });

  setExpandedState(
    coachProfileDOM.sidebarOpenButton,
    false
  );

  setExpandedState(
    coachProfileDOM.searchToggleButton,
    false
  );

  setExpandedState(
    coachProfileDOM.accountMenuButton,
    false
  );

  setExpandedState(
    coachProfileDOM.notificationButton,
    false
  );
}


/* ==========================================================
   EVENT LISTENERS
========================================================== */

/**
 * Registers primary profile interface listeners.
 */
function registerCoachProfileEventListeners() {
  coachProfileDOM.sidebarOpenButton?.addEventListener(
    "click",
    toggleCoachSidebar
  );

  coachProfileDOM.sidebarCloseButton?.addEventListener(
    "click",
    () => closeCoachSidebar()
  );

  coachProfileDOM.sidebarOverlay?.addEventListener(
    "click",
    () => closeCoachSidebar()
  );

  coachProfileDOM.searchToggleButton?.addEventListener(
    "click",
    toggleSearchPanel
  );

  coachProfileDOM.searchCloseButton?.addEventListener(
    "click",
    () => closeSearchPanel(true)
  );

  coachProfileDOM.accountMenuButton?.addEventListener(
    "click",
    (event) => {
      event.stopPropagation();
      toggleAccountDropdown();
    }
  );

  coachProfileDOM.notificationButton?.addEventListener(
    "click",
    toggleNotificationPanel
  );

  coachProfileDOM.notificationCloseButton?.addEventListener(
    "click",
    () => closeNotificationPanel()
  );

  coachProfileDOM.markAllNotificationsButton?.addEventListener(
    "click",
    markAllNotificationsAsRead
  );

  document.addEventListener(
    "keydown",
    handleGlobalKeydown
  );

  document.addEventListener(
    "click",
    handleDocumentClick
  );

  window.addEventListener(
    "resize",
    throttledResizeHandler
  );
}


/* ==========================================================
   INITIAL PROFILE PAGE SETUP
========================================================== */

/**
 * Initializes the first part of the coach profile interface.
 */
function initializeCoachProfileInterface() {
  initializeAccessibilityStates();
  setActiveSidebarNavigation();
  initializeCurrentDates();
  updateNotificationBadge();
  registerCoachProfileEventListeners();
  handleWindowResize();

  document.body.classList.add(
    "coach-profile-initialized"
  );
}


/* ==========================================================
   DOM READY
========================================================== */

if (document.readyState === "loading") {
  document.addEventListener(
    "DOMContentLoaded",
    initializeCoachProfileInterface,
    { once: true }
  );
} else {
  initializeCoachProfileInterface();
}

/* ==========================================================
   FIFA MISSION INDIA
   COACH PROFILE SCRIPT — PART 2

   Paste directly below Part 1.

   Includes:
   - Shared modal controls
   - Edit profile modal
   - Preview profile modal
   - Logout modal
   - Toast notifications
   - Profile visibility toggle
   - Share profile action
   - Profile completion actions
========================================================== */


/* ==========================================================
   EXTENDED DOM REFERENCES
========================================================== */

Object.assign(coachProfileDOM, {
  editProfileButtons: document.querySelectorAll(
    "#editProfileButton, [data-action='edit-profile']"
  ),

  previewProfileButtons: document.querySelectorAll(
    "#previewProfileButton, [data-action='preview-profile']"
  ),

  shareProfileButtons: document.querySelectorAll(
    "#shareProfileButton, [data-action='share-profile']"
  ),

  logoutButtons: document.querySelectorAll(
    "#coachLogoutButton, #accountLogoutButton, [data-action='logout']"
  ),

  logoutCancelButton: document.getElementById(
    "logoutCancelButton"
  ),

  logoutConfirmButton: document.getElementById(
    "logoutConfirmButton"
  ),

  profileCompletionButton: document.getElementById(
    "completeProfileButton"
  ),

  profileEditForm: document.getElementById(
    "profileEditForm"
  ),

  profileSaveButton: document.getElementById(
    "profileSaveButton"
  ),

  previewProfileName: document.getElementById(
    "previewProfileName"
  ),

  previewProfileRole: document.getElementById(
    "previewProfileRole"
  ),

  previewProfileLocation: document.getElementById(
    "previewProfileLocation"
  ),

  previewProfileSummary: document.getElementById(
    "previewProfileSummary"
  ),

  previewProfileAvatar: document.getElementById(
    "previewProfileAvatar"
  ),

  previewProfileCover: document.getElementById(
    "previewProfileCover"
  ),

  profileNameDisplay: document.getElementById(
    "coachProfileName"
  ),

  profileRoleDisplay: document.getElementById(
    "coachProfileRole"
  ),

  profileLocationDisplay: document.getElementById(
    "coachProfileLocation"
  ),

  profileSummaryDisplay: document.getElementById(
    "coachProfileSummary"
  ),

  profileAvatarDisplay: document.getElementById(
    "coachProfileAvatar"
  ),

  profileCoverDisplay: document.getElementById(
    "coachProfileCover"
  ),

  visibilityStatusText: document.getElementById(
    "profileVisibilityStatus"
  )
});


/* ==========================================================
   PROFILE DATA STATE
========================================================== */

coachProfileState.profileData = {
  fullName:
    coachProfileDOM.profileNameDisplay?.textContent.trim() ||
    "Arjun Sharma",

  role:
    coachProfileDOM.profileRoleDisplay?.textContent.trim() ||
    "Professional Football Coach",

  location:
    coachProfileDOM.profileLocationDisplay?.textContent.trim() ||
    "New Delhi, India",

  summary:
    coachProfileDOM.profileSummaryDisplay?.textContent.trim() ||
    "",

  email: "",
  phone: "",
  academy: "",
  experience: "",
  licence: "",
  specialisation: ""
};


/* ==========================================================
   TOAST NOTIFICATIONS
========================================================== */

/**
 * Displays a temporary profile notification.
 *
 * @param {string} message
 * @param {"success"|"error"|"info"|"warning"} type
 * @param {number} duration
 */
function showProfileToast(
  message,
  type = "success",
  duration = 3200
) {
  const { toast, toastMessage } = coachProfileDOM;

  if (!toast || !toastMessage) {
    return;
  }

  window.clearTimeout(coachProfileState.toastTimer);

  toastMessage.textContent = message;

  toast.classList.remove(
    "success",
    "error",
    "info",
    "warning"
  );

  toast.classList.add(type);
  toast.hidden = false;
  toast.setAttribute("aria-hidden", "false");
  toast.setAttribute("role", "status");
  toast.setAttribute("aria-live", "polite");

  window.requestAnimationFrame(() => {
    toast.classList.add("visible");
  });

  coachProfileState.toastTimer = window.setTimeout(() => {
    hideProfileToast();
  }, duration);
}


/**
 * Hides the active toast notification.
 */
function hideProfileToast() {
  const { toast } = coachProfileDOM;

  if (!toast) {
    return;
  }

  toast.classList.remove("visible");

  window.setTimeout(() => {
    toast.hidden = true;
    toast.setAttribute("aria-hidden", "true");
  }, 260);
}


/* ==========================================================
   SHARED MODAL CONTROLS
========================================================== */

/**
 * Opens a portal modal.
 *
 * @param {HTMLElement|string|null} modalReference
 * @param {HTMLElement|null} triggerElement
 */
function openPortalModal(
  modalReference,
  triggerElement = null
) {
  const modal =
    typeof modalReference === "string"
      ? getModalById(modalReference)
      : modalReference;

  if (!modal) {
    return;
  }

  closeAccountDropdown();
  closeSearchPanel();
  closeNotificationPanel(false);
  closeCoachSidebar(false);

  if (
    coachProfileState.activeModal &&
    coachProfileState.activeModal !== modal
  ) {
    closePortalModal(
      coachProfileState.activeModal,
      false
    );
  }

  coachProfileState.lastFocusedElement =
    triggerElement instanceof HTMLElement
      ? triggerElement
      : document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;

  modal.hidden = false;
  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");

  coachProfileState.activeModal = modal;

  document.body.classList.add("modal-open");

  lockPageScroll();

  window.requestAnimationFrame(() => {
    focusFirstElement(modal);
  });
}


/**
 * Closes a specific portal modal.
 *
 * @param {HTMLElement|string|null} modalReference
 * @param {boolean} restoreFocus
 */
function closePortalModal(
  modalReference,
  restoreFocus = true
) {
  const modal =
    typeof modalReference === "string"
      ? getModalById(modalReference)
      : modalReference;

  if (!modal) {
    return;
  }

  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");

  window.setTimeout(() => {
    modal.hidden = true;
  }, 220);

  if (coachProfileState.activeModal === modal) {
    coachProfileState.activeModal = null;
  }

  if (!coachProfileState.activeModal) {
    document.body.classList.remove("modal-open");
  }

  unlockPageScrollIfPossible();

  if (
    restoreFocus &&
    coachProfileState.lastFocusedElement instanceof HTMLElement
  ) {
    coachProfileState.lastFocusedElement.focus();
  }
}


/**
 * Overrides Part 1 modal closing with full behavior.
 */
function closeAllPortalModals(
  restoreFocus = true
) {
  const openModals = selectElements(
    ".portal-modal.open"
  );

  openModals.forEach((modal) => {
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    modal.hidden = true;
  });

  coachProfileState.activeModal = null;

  document.body.classList.remove("modal-open");

  unlockPageScrollIfPossible();

  if (
    restoreFocus &&
    coachProfileState.lastFocusedElement instanceof HTMLElement
  ) {
    coachProfileState.lastFocusedElement.focus();
  }
}


/* ==========================================================
   MODAL TRIGGER HANDLING
========================================================== */

/**
 * Handles controls using data-modal-open attributes.
 *
 * @param {MouseEvent} event
 */
function handleModalOpenButton(event) {
  const button = event.currentTarget;

  if (!(button instanceof HTMLElement)) {
    return;
  }

  const modalId = button.getAttribute(
    "data-modal-open"
  );

  if (!modalId) {
    return;
  }

  openPortalModal(modalId, button);
}


/**
 * Handles controls using data-modal-close attributes.
 *
 * @param {MouseEvent} event
 */
function handleModalCloseButton(event) {
  const button = event.currentTarget;

  if (!(button instanceof HTMLElement)) {
    return;
  }

  const modalId = button.getAttribute(
    "data-modal-close"
  );

  const modal = modalId
    ? getModalById(modalId)
    : button.closest(".portal-modal");

  closePortalModal(modal);
}


/**
 * Closes a modal when its backdrop is selected.
 *
 * @param {MouseEvent} event
 */
function handleModalBackdropClick(event) {
  const backdrop = event.currentTarget;

  if (!(backdrop instanceof HTMLElement)) {
    return;
  }

  const modal = backdrop.closest(".portal-modal");

  closePortalModal(modal);
}


/* ==========================================================
   EDIT PROFILE MODAL
========================================================== */

/**
 * Returns an input from the edit profile form.
 *
 * @param {string} fieldName
 * @returns {HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement|null}
 */
function getProfileFormField(fieldName) {
  if (!coachProfileDOM.profileEditForm) {
    return null;
  }

  return coachProfileDOM.profileEditForm.elements.namedItem(
    fieldName
  );
}


/**
 * Safely sets a profile form value.
 *
 * @param {string} fieldName
 * @param {string} value
 */
function setProfileFormValue(fieldName, value) {
  const field = getProfileFormField(fieldName);

  if (
    field instanceof HTMLInputElement ||
    field instanceof HTMLTextAreaElement ||
    field instanceof HTMLSelectElement
  ) {
    field.value = value || "";
  }
}


/**
 * Populates the edit profile form with current data.
 */
function populateProfileEditForm() {
  const profileData =
    coachProfileState.profileData;

  setProfileFormValue(
    "fullName",
    profileData.fullName
  );

  setProfileFormValue(
    "role",
    profileData.role
  );

  setProfileFormValue(
    "location",
    profileData.location
  );

  setProfileFormValue(
    "summary",
    profileData.summary
  );

  setProfileFormValue(
    "email",
    profileData.email
  );

  setProfileFormValue(
    "phone",
    profileData.phone
  );

  setProfileFormValue(
    "academy",
    profileData.academy
  );

  setProfileFormValue(
    "experience",
    profileData.experience
  );

  setProfileFormValue(
    "licence",
    profileData.licence
  );

  setProfileFormValue(
    "specialisation",
    profileData.specialisation
  );
}


/**
 * Opens the edit profile modal.
 *
 * @param {HTMLElement|null} triggerElement
 */
function openEditProfileModal(
  triggerElement = null
) {
  populateProfileEditForm();

  openPortalModal(
    coachProfileDOM.editProfileModal,
    triggerElement
  );
}


/**
 * Reads a trimmed string from a form field.
 *
 * @param {FormData} formData
 * @param {string} fieldName
 * @returns {string}
 */
function getTrimmedFormValue(
  formData,
  fieldName
) {
  return String(
    formData.get(fieldName) || ""
  ).trim();
}


/**
 * Validates the edit profile form.
 *
 * @param {HTMLFormElement} form
 * @returns {boolean}
 */
function validateProfileEditForm(form) {
  if (!form.checkValidity()) {
    form.reportValidity();
    return false;
  }

  const fullNameField =
    form.elements.namedItem("fullName");

  const summaryField =
    form.elements.namedItem("summary");

  if (
    fullNameField instanceof HTMLInputElement &&
    fullNameField.value.trim().length < 2
  ) {
    fullNameField.setCustomValidity(
      "Please enter your full name."
    );

    fullNameField.reportValidity();
    fullNameField.focus();

    window.setTimeout(() => {
      fullNameField.setCustomValidity("");
    }, 100);

    return false;
  }

  if (
    summaryField instanceof HTMLTextAreaElement &&
    summaryField.value.trim().length > 600
  ) {
    summaryField.setCustomValidity(
      "Professional summary must be 600 characters or fewer."
    );

    summaryField.reportValidity();
    summaryField.focus();

    window.setTimeout(() => {
      summaryField.setCustomValidity("");
    }, 100);

    return false;
  }

  return true;
}


/**
 * Updates visible profile text.
 *
 * @param {object} profileData
 */
function updateVisibleProfileInformation(
  profileData
) {
  if (coachProfileDOM.profileNameDisplay) {
    coachProfileDOM.profileNameDisplay.textContent =
      profileData.fullName;
  }

  if (coachProfileDOM.profileRoleDisplay) {
    coachProfileDOM.profileRoleDisplay.textContent =
      profileData.role;
  }

  if (coachProfileDOM.profileLocationDisplay) {
    coachProfileDOM.profileLocationDisplay.textContent =
      profileData.location;
  }

  if (coachProfileDOM.profileSummaryDisplay) {
    coachProfileDOM.profileSummaryDisplay.textContent =
      profileData.summary;
  }

  selectElements(
    "[data-coach-name]"
  ).forEach((element) => {
    element.textContent = profileData.fullName;
  });

  selectElements(
    "[data-coach-role]"
  ).forEach((element) => {
    element.textContent = profileData.role;
  });

  selectElements(
    "[data-coach-location]"
  ).forEach((element) => {
    element.textContent = profileData.location;
  });
}


/**
 * Handles the profile edit form submission.
 *
 * @param {SubmitEvent} event
 */
function handleProfileEditSubmit(event) {
  event.preventDefault();

  const form = event.currentTarget;

  if (!(form instanceof HTMLFormElement)) {
    return;
  }

  if (!validateProfileEditForm(form)) {
    return;
  }

  const formData = new FormData(form);

  const updatedProfileData = {
    fullName: getTrimmedFormValue(
      formData,
      "fullName"
    ),

    role: getTrimmedFormValue(
      formData,
      "role"
    ),

    location: getTrimmedFormValue(
      formData,
      "location"
    ),

    summary: getTrimmedFormValue(
      formData,
      "summary"
    ),

    email: getTrimmedFormValue(
      formData,
      "email"
    ),

    phone: getTrimmedFormValue(
      formData,
      "phone"
    ),

    academy: getTrimmedFormValue(
      formData,
      "academy"
    ),

    experience: getTrimmedFormValue(
      formData,
      "experience"
    ),

    licence: getTrimmedFormValue(
      formData,
      "licence"
    ),

    specialisation: getTrimmedFormValue(
      formData,
      "specialisation"
    )
  };

  coachProfileState.profileData = {
    ...coachProfileState.profileData,
    ...updatedProfileData
  };

  updateVisibleProfileInformation(
    coachProfileState.profileData
  );

  updateProfileCompletion();

  closePortalModal(
    coachProfileDOM.editProfileModal
  );

  showProfileToast(
    "Your coach profile has been updated."
  );

  /*
   * BACKEND INTEGRATION PLACEHOLDER
   *
   * Mr. Harsh can replace the frontend-only update with:
   *
   * await fetch("/api/v1/coaches/profile", {
   *   method: "PUT",
   *   headers: {
   *     "Content-Type": "application/json",
   *     "Authorization": `Bearer ${accessToken}`
   *   },
   *   body: JSON.stringify(updatedProfileData)
   * });
   */
}


/* ==========================================================
   PUBLIC PROFILE PREVIEW
========================================================== */

/**
 * Synchronizes the preview modal with current profile data.
 */
function synchronizeProfilePreview() {
  const profileData =
    coachProfileState.profileData;

  if (coachProfileDOM.previewProfileName) {
    coachProfileDOM.previewProfileName.textContent =
      profileData.fullName;
  }

  if (coachProfileDOM.previewProfileRole) {
    coachProfileDOM.previewProfileRole.textContent =
      profileData.role;
  }

  if (coachProfileDOM.previewProfileLocation) {
    coachProfileDOM.previewProfileLocation.textContent =
      profileData.location;
  }

  if (coachProfileDOM.previewProfileSummary) {
    coachProfileDOM.previewProfileSummary.textContent =
      profileData.summary ||
      "No professional summary has been added yet.";
  }

  if (
    coachProfileDOM.previewProfileAvatar &&
    coachProfileDOM.profileAvatarDisplay
  ) {
    coachProfileDOM.previewProfileAvatar.src =
      coachProfileDOM.profileAvatarDisplay.src;

    coachProfileDOM.previewProfileAvatar.alt =
      `${profileData.fullName} profile photograph`;
  }

  if (
    coachProfileDOM.previewProfileCover &&
    coachProfileDOM.profileCoverDisplay
  ) {
    coachProfileDOM.previewProfileCover.src =
      coachProfileDOM.profileCoverDisplay.src;

    coachProfileDOM.previewProfileCover.alt =
      `${profileData.fullName} profile cover`;
  }
}


/**
 * Opens the public profile preview.
 *
 * @param {HTMLElement|null} triggerElement
 */
function openPreviewProfileModal(
  triggerElement = null
) {
  synchronizeProfilePreview();

  openPortalModal(
    coachProfileDOM.previewProfileModal,
    triggerElement
  );
}


/* ==========================================================
   PROFILE VISIBILITY
========================================================== */

/**
 * Updates profile visibility text and state.
 *
 * @param {boolean} isVisible
 * @param {boolean} showToast
 */
function updateProfileVisibility(
  isVisible,
  showToast = true
) {
  coachProfileState.profileVisibility =
    Boolean(isVisible);

  if (coachProfileDOM.visibilityToggle) {
    coachProfileDOM.visibilityToggle.checked =
      coachProfileState.profileVisibility;

    coachProfileDOM.visibilityToggle.setAttribute(
      "aria-checked",
      String(coachProfileState.profileVisibility)
    );
  }

  if (coachProfileDOM.visibilityStatusText) {
    coachProfileDOM.visibilityStatusText.textContent =
      coachProfileState.profileVisibility
        ? "Your profile is visible to players, academies and scouts."
        : "Your profile is currently private.";
  }

  document.body.classList.toggle(
    "profile-is-private",
    !coachProfileState.profileVisibility
  );

  if (showToast) {
    showProfileToast(
      coachProfileState.profileVisibility
        ? "Your profile is now publicly visible."
        : "Your profile is now private.",
      "info"
    );
  }

  /*
   * BACKEND INTEGRATION PLACEHOLDER
   *
   * PATCH /api/v1/coaches/profile/visibility
   *
   * Request body:
   * {
   *   "is_public": coachProfileState.profileVisibility
   * }
   */
}


/**
 * Handles profile visibility changes.
 *
 * @param {Event} event
 */
function handleVisibilityToggle(event) {
  const toggle = event.currentTarget;

  if (!(toggle instanceof HTMLInputElement)) {
    return;
  }

  updateProfileVisibility(toggle.checked);
}


/* ==========================================================
   SHARE PROFILE
========================================================== */

/**
 * Builds a public coach profile URL.
 *
 * @returns {string}
 */
function getPublicProfileURL() {
  const profileSlug =
    coachProfileState.profileData.fullName
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

  const baseURL =
    window.location.origin &&
    window.location.origin !== "null"
      ? window.location.origin
      : "https://fifamissionindia.com";

  return `${baseURL}/coach/${profileSlug || "profile"}`;
}


/**
 * Shares or copies the public profile URL.
 */
async function shareCoachProfile() {
  const profileURL = getPublicProfileURL();

  const shareData = {
    title: `${coachProfileState.profileData.fullName} — Coach Profile`,
    text: `View ${coachProfileState.profileData.fullName}'s coaching profile.`,
    url: profileURL
  };

  try {
    if (
      navigator.share &&
      isMobileViewport()
    ) {
      await navigator.share(shareData);

      showProfileToast(
        "Profile shared successfully."
      );

      return;
    }

    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(
        profileURL
      );

      showProfileToast(
        "Profile link copied to clipboard."
      );

      return;
    }

    const temporaryInput =
      document.createElement("textarea");

    temporaryInput.value = profileURL;
    temporaryInput.setAttribute(
      "readonly",
      ""
    );

    temporaryInput.style.position = "fixed";
    temporaryInput.style.opacity = "0";

    document.body.appendChild(
      temporaryInput
    );

    temporaryInput.select();

    document.execCommand("copy");

    temporaryInput.remove();

    showProfileToast(
      "Profile link copied to clipboard."
    );
  } catch (error) {
    if (error?.name === "AbortError") {
      return;
    }

    console.error(
      "Unable to share coach profile:",
      error
    );

    showProfileToast(
      "The profile link could not be shared.",
      "error"
    );
  }
}


/* ==========================================================
   PROFILE COMPLETION
========================================================== */

/**
 * Calculates frontend profile completion.
 *
 * @returns {number}
 */
function calculateProfileCompletion() {
  const profileData =
    coachProfileState.profileData;

  const completionFields = [
    profileData.fullName,
    profileData.role,
    profileData.location,
    profileData.summary,
    profileData.email,
    profileData.phone,
    profileData.academy,
    profileData.experience,
    profileData.licence,
    profileData.specialisation
  ];

  const completedFields =
    completionFields.filter((value) =>
      Boolean(String(value || "").trim())
    ).length;

  const avatarComplete =
    Boolean(
      coachProfileDOM.profileAvatarDisplay?.src
    );

  const coverComplete =
    Boolean(
      coachProfileDOM.profileCoverDisplay?.src
    );

  const totalItems =
    completionFields.length + 2;

  const completedItems =
    completedFields +
    Number(avatarComplete) +
    Number(coverComplete);

  return Math.round(
    (completedItems / totalItems) * 100
  );
}


/**
 * Updates the profile completion interface.
 */
function updateProfileCompletion() {
  const completion =
    calculateProfileCompletion();

  if (
    coachProfileDOM.profileCompletionValue
  ) {
    coachProfileDOM.profileCompletionValue.textContent =
      `${completion}%`;
  }

  if (
    coachProfileDOM.profileCompletionBar
  ) {
    coachProfileDOM.profileCompletionBar.style.width =
      `${completion}%`;

    coachProfileDOM.profileCompletionBar.setAttribute(
      "aria-valuenow",
      String(completion)
    );
  }

  if (
    coachProfileDOM.profileCompletionButton
  ) {
    coachProfileDOM.profileCompletionButton.textContent =
      completion >= 100
        ? "Profile Complete"
        : "Complete Profile";

    coachProfileDOM.profileCompletionButton.disabled =
      completion >= 100;
  }
}


/**
 * Opens the edit modal from the completion card.
 */
function handleProfileCompletionAction() {
  if (calculateProfileCompletion() >= 100) {
    showProfileToast(
      "Your coach profile is already complete."
    );

    return;
  }

  openEditProfileModal(
    coachProfileDOM.profileCompletionButton
  );
}


/* ==========================================================
   LOGOUT MODAL
========================================================== */

/**
 * Opens the logout confirmation modal.
 *
 * @param {HTMLElement|null} triggerElement
 */
function openLogoutModal(
  triggerElement = null
) {
  openPortalModal(
    coachProfileDOM.logoutModal,
    triggerElement
  );
}


/**
 * Closes the logout confirmation modal.
 */
function closeLogoutModal() {
  closePortalModal(
    coachProfileDOM.logoutModal
  );
}


/**
 * Handles confirmed logout.
 */
function confirmCoachLogout() {
  const confirmButton =
    coachProfileDOM.logoutConfirmButton;

  if (confirmButton) {
    confirmButton.disabled = true;
    confirmButton.classList.add("loading");
    confirmButton.setAttribute(
      "aria-busy",
      "true"
    );
  }

  /*
   * BACKEND INTEGRATION PLACEHOLDER
   *
   * 1. POST /api/v1/auth/logout
   * 2. Revoke refresh token
   * 3. Clear secure authentication session
   * 4. Redirect to login page
   */

  window.setTimeout(() => {
    try {
      sessionStorage.removeItem(
        "coachProfileDraft"
      );

      localStorage.removeItem(
        "coachAccessToken"
      );

      localStorage.removeItem(
        "coachRefreshToken"
      );
    } catch (error) {
      console.warn(
        "Unable to clear local authentication data:",
        error
      );
    }

    showProfileToast(
      "You have been logged out.",
      "info",
      1800
    );

    closePortalModal(
      coachProfileDOM.logoutModal,
      false
    );

    window.setTimeout(() => {
      window.location.href =
        "login.html";
    }, 700);
  }, 450);
}


/* ==========================================================
   EDIT AND PREVIEW BUTTON LISTENERS
========================================================== */

/**
 * Registers extended modal and profile listeners.
 */
function registerCoachProfilePartTwoListeners() {
  coachProfileDOM.modalOpenButtons.forEach(
    (button) => {
      button.addEventListener(
        "click",
        handleModalOpenButton
      );
    }
  );

  coachProfileDOM.modalCloseButtons.forEach(
    (button) => {
      button.addEventListener(
        "click",
        handleModalCloseButton
      );
    }
  );

  coachProfileDOM.modalBackdrops.forEach(
    (backdrop) => {
      backdrop.addEventListener(
        "click",
        handleModalBackdropClick
      );
    }
  );

  coachProfileDOM.editProfileButtons.forEach(
    (button) => {
      button.addEventListener(
        "click",
        () => openEditProfileModal(button)
      );
    }
  );

  coachProfileDOM.previewProfileButtons.forEach(
    (button) => {
      button.addEventListener(
        "click",
        () => openPreviewProfileModal(button)
      );
    }
  );

  coachProfileDOM.shareProfileButtons.forEach(
    (button) => {
      button.addEventListener(
        "click",
        shareCoachProfile
      );
    }
  );

  coachProfileDOM.logoutButtons.forEach(
    (button) => {
      button.addEventListener(
        "click",
        () => openLogoutModal(button)
      );
    }
  );

  coachProfileDOM.logoutCancelButton?.addEventListener(
    "click",
    closeLogoutModal
  );

  coachProfileDOM.logoutConfirmButton?.addEventListener(
    "click",
    confirmCoachLogout
  );

  coachProfileDOM.profileEditForm?.addEventListener(
    "submit",
    handleProfileEditSubmit
  );

  coachProfileDOM.visibilityToggle?.addEventListener(
    "change",
    handleVisibilityToggle
  );

  coachProfileDOM.profileCompletionButton?.addEventListener(
    "click",
    handleProfileCompletionAction
  );
}


/* ==========================================================
   INITIALIZE PART 2
========================================================== */

/**
 * Initializes profile modal and visibility features.
 */
function initializeCoachProfilePartTwo() {
  const initialVisibility =
    coachProfileDOM.visibilityToggle
      ? coachProfileDOM.visibilityToggle.checked
      : true;

  updateProfileVisibility(
    initialVisibility,
    false
  );

  updateProfileCompletion();

  synchronizeProfilePreview();

  registerCoachProfilePartTwoListeners();
}


/* ==========================================================
   PART 2 DOM READY
========================================================== */

if (document.readyState === "loading") {
  document.addEventListener(
    "DOMContentLoaded",
    initializeCoachProfilePartTwo,
    { once: true }
  );
} else {
  initializeCoachProfilePartTwo();
}

/* ==========================================================
   FIFA MISSION INDIA
   COACH PROFILE SCRIPT — PART 3

   Paste directly below Part 2.

   Includes:
   - Avatar image upload and preview
   - Cover image upload and preview
   - File validation
   - Live edit-form preview
   - Profile section search
   - Animated statistics
   - Experience, qualification and achievement actions
   - Draft persistence
   - Backend-ready profile loading
   - Final initialization
========================================================== */


/* ==========================================================
   ADDITIONAL DOM REFERENCES
========================================================== */

Object.assign(coachProfileDOM, {
  avatarUploadInput: document.getElementById(
    "avatarUploadInput"
  ),

  coverUploadInput: document.getElementById(
    "coverUploadInput"
  ),

  avatarUploadButton: document.getElementById(
    "avatarUploadButton"
  ),

  coverUploadButton: document.getElementById(
    "coverUploadButton"
  ),

  profileHeroName: document.getElementById(
    "coachProfileName"
  ),

  profileHeroRole: document.getElementById(
    "coachProfileRole"
  ),

  profileHeroLocation: document.getElementById(
    "coachProfileLocation"
  ),

  profileHeroSummary: document.getElementById(
    "coachProfileSummary"
  ),

  profileSearchResultText: document.getElementById(
    "profileSearchResultText"
  ),

  experienceAddButtons: document.querySelectorAll(
    "[data-action='add-experience']"
  ),

  qualificationAddButtons: document.querySelectorAll(
    "[data-action='add-qualification']"
  ),

  achievementAddButtons: document.querySelectorAll(
    "[data-action='add-achievement']"
  ),

  experienceOptionButtons: document.querySelectorAll(
    ".experience-item .item-options-button"
  ),

  qualificationViewButtons: document.querySelectorAll(
    ".qualification-view-button"
  ),

  cardEditButtons: document.querySelectorAll(
    ".card-edit-button, .icon-card-edit-button"
  )
});


/* ==========================================================
   MEDIA STATE
========================================================== */

coachProfileState.avatarObjectURL = null;
coachProfileState.coverObjectURL = null;
coachProfileState.statisticsAnimated = false;
coachProfileState.profileLoaded = false;


/* ==========================================================
   IMAGE UPLOAD CONFIGURATION
========================================================== */

const coachProfileUploadConfig = {
  acceptedTypes: [
    "image/jpeg",
    "image/png",
    "image/webp"
  ],

  avatarMaximumSize: 4 * 1024 * 1024,
  coverMaximumSize: 8 * 1024 * 1024,

  avatarRecommendedWidth: 600,
  avatarRecommendedHeight: 600,

  coverRecommendedWidth: 1600,
  coverRecommendedHeight: 600
};


/* ==========================================================
   FILE SIZE FORMATTING
========================================================== */

/**
 * Converts bytes into readable file-size text.
 *
 * @param {number} bytes
 * @returns {string}
 */
function formatFileSize(bytes) {
  const numericBytes = Number(bytes);

  if (!Number.isFinite(numericBytes) || numericBytes <= 0) {
    return "0 KB";
  }

  const units = ["B", "KB", "MB", "GB"];
  const unitIndex = Math.min(
    Math.floor(
      Math.log(numericBytes) / Math.log(1024)
    ),
    units.length - 1
  );

  const size =
    numericBytes / Math.pow(1024, unitIndex);

  return `${size.toFixed(
    unitIndex === 0 ? 0 : 1
  )} ${units[unitIndex]}`;
}


/* ==========================================================
   IMAGE FILE VALIDATION
========================================================== */

/**
 * Validates an uploaded image file.
 *
 * @param {File} file
 * @param {"avatar"|"cover"} imageType
 * @returns {{valid: boolean, message: string}}
 */
function validateProfileImageFile(
  file,
  imageType
) {
  if (!(file instanceof File)) {
    return {
      valid: false,
      message: "Please select an image file."
    };
  }

  if (
    !coachProfileUploadConfig.acceptedTypes.includes(
      file.type
    )
  ) {
    return {
      valid: false,
      message:
        "Please upload a JPG, PNG or WebP image."
    };
  }

  const maximumSize =
    imageType === "avatar"
      ? coachProfileUploadConfig.avatarMaximumSize
      : coachProfileUploadConfig.coverMaximumSize;

  if (file.size > maximumSize) {
    return {
      valid: false,
      message: `${
        imageType === "avatar"
          ? "Profile"
          : "Cover"
      } image must be smaller than ${formatFileSize(
        maximumSize
      )}.`
    };
  }

  return {
    valid: true,
    message: ""
  };
}


/* ==========================================================
   IMAGE DIMENSION READER
========================================================== */

/**
 * Reads image dimensions from a local file.
 *
 * @param {File} file
 * @returns {Promise<{width: number, height: number}>}
 */
function readImageDimensions(file) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    const objectURL = URL.createObjectURL(file);

    image.onload = () => {
      const dimensions = {
        width: image.naturalWidth,
        height: image.naturalHeight
      };

      URL.revokeObjectURL(objectURL);
      resolve(dimensions);
    };

    image.onerror = () => {
      URL.revokeObjectURL(objectURL);

      reject(
        new Error(
          "The selected image could not be read."
        )
      );
    };

    image.src = objectURL;
  });
}


/* ==========================================================
   IMAGE SOURCE UPDATE
========================================================== */

/**
 * Updates all profile avatar images.
 *
 * @param {string} imageSource
 */
function updateProfileAvatarImages(
  imageSource
) {
  if (!imageSource) {
    return;
  }

  const avatarImages = selectElements(
    [
      "#coachProfileAvatar",
      "#previewProfileAvatar",
      "[data-coach-avatar]",
      ".coach-summary-avatar img",
      ".coach-account-button img"
    ].join(",")
  );

  avatarImages.forEach((image) => {
    if (image instanceof HTMLImageElement) {
      image.src = imageSource;

      image.alt =
        `${coachProfileState.profileData.fullName} profile photograph`;
    }
  });

  synchronizeProfilePreview();
}


/**
 * Updates all profile cover images.
 *
 * @param {string} imageSource
 */
function updateProfileCoverImages(
  imageSource
) {
  if (!imageSource) {
    return;
  }

  const coverImages = selectElements(
    [
      "#coachProfileCover",
      "#previewProfileCover",
      "[data-coach-cover]"
    ].join(",")
  );

  coverImages.forEach((image) => {
    if (image instanceof HTMLImageElement) {
      image.src = imageSource;

      image.alt =
        `${coachProfileState.profileData.fullName} profile cover`;
    }
  });

  synchronizeProfilePreview();
}


/* ==========================================================
   AVATAR UPLOAD
========================================================== */

/**
 * Handles profile avatar selection.
 *
 * @param {Event} event
 */
async function handleAvatarUpload(event) {
  const input = event.currentTarget;

  if (!(input instanceof HTMLInputElement)) {
    return;
  }

  const file = input.files?.[0];

  if (!file) {
    return;
  }

  const validation = validateProfileImageFile(
    file,
    "avatar"
  );

  if (!validation.valid) {
    input.value = "";

    showProfileToast(
      validation.message,
      "error"
    );

    return;
  }

  try {
    const dimensions =
      await readImageDimensions(file);

    if (
      dimensions.width < 250 ||
      dimensions.height < 250
    ) {
      input.value = "";

      showProfileToast(
        "Please choose an avatar image of at least 250 × 250 pixels.",
        "warning"
      );

      return;
    }

    if (coachProfileState.avatarObjectURL) {
      URL.revokeObjectURL(
        coachProfileState.avatarObjectURL
      );
    }

    const objectURL =
      URL.createObjectURL(file);

    coachProfileState.avatarObjectURL =
      objectURL;

    updateProfileAvatarImages(objectURL);

    updateProfileCompletion();

    showProfileToast(
      "Profile photo preview updated."
    );

    /*
     * BACKEND INTEGRATION PLACEHOLDER
     *
     * const uploadData = new FormData();
     * uploadData.append("avatar", file);
     *
     * await fetch("/api/v1/coaches/profile/avatar", {
     *   method: "POST",
     *   headers: {
     *     "Authorization": `Bearer ${accessToken}`
     *   },
     *   body: uploadData
     * });
     */
  } catch (error) {
    console.error(
      "Avatar upload failed:",
      error
    );

    input.value = "";

    showProfileToast(
      "The profile photo could not be loaded.",
      "error"
    );
  }
}


/* ==========================================================
   COVER IMAGE UPLOAD
========================================================== */

/**
 * Handles profile cover selection.
 *
 * @param {Event} event
 */
async function handleCoverUpload(event) {
  const input = event.currentTarget;

  if (!(input instanceof HTMLInputElement)) {
    return;
  }

  const file = input.files?.[0];

  if (!file) {
    return;
  }

  const validation = validateProfileImageFile(
    file,
    "cover"
  );

  if (!validation.valid) {
    input.value = "";

    showProfileToast(
      validation.message,
      "error"
    );

    return;
  }

  try {
    const dimensions =
      await readImageDimensions(file);

    if (
      dimensions.width < 700 ||
      dimensions.height < 250
    ) {
      input.value = "";

      showProfileToast(
        "Please choose a cover image of at least 700 × 250 pixels.",
        "warning"
      );

      return;
    }

    if (coachProfileState.coverObjectURL) {
      URL.revokeObjectURL(
        coachProfileState.coverObjectURL
      );
    }

    const objectURL =
      URL.createObjectURL(file);

    coachProfileState.coverObjectURL =
      objectURL;

    updateProfileCoverImages(objectURL);

    updateProfileCompletion();

    showProfileToast(
      "Cover image preview updated."
    );

    /*
     * BACKEND INTEGRATION PLACEHOLDER
     *
     * const uploadData = new FormData();
     * uploadData.append("cover", file);
     *
     * await fetch("/api/v1/coaches/profile/cover", {
     *   method: "POST",
     *   headers: {
     *     "Authorization": `Bearer ${accessToken}`
     *   },
     *   body: uploadData
     * });
     */
  } catch (error) {
    console.error(
      "Cover upload failed:",
      error
    );

    input.value = "";

    showProfileToast(
      "The cover image could not be loaded.",
      "error"
    );
  }
}


/* ==========================================================
   UPLOAD BUTTON CONTROLS
========================================================== */

/**
 * Opens the avatar file picker.
 */
function openAvatarFilePicker() {
  coachProfileDOM.avatarUploadInput?.click();
}


/**
 * Opens the cover file picker.
 */
function openCoverFilePicker() {
  coachProfileDOM.coverUploadInput?.click();
}


/* ==========================================================
   LIVE EDIT FORM PREVIEW
========================================================== */

/**
 * Reads current edit-form values.
 *
 * @returns {object}
 */
function readLiveProfileFormData() {
  const form =
    coachProfileDOM.profileEditForm;

  if (!form) {
    return {
      ...coachProfileState.profileData
    };
  }

  const formData = new FormData(form);

  return {
    ...coachProfileState.profileData,

    fullName:
      getTrimmedFormValue(
        formData,
        "fullName"
      ) ||
      coachProfileState.profileData.fullName,

    role:
      getTrimmedFormValue(
        formData,
        "role"
      ) ||
      coachProfileState.profileData.role,

    location:
      getTrimmedFormValue(
        formData,
        "location"
      ) ||
      coachProfileState.profileData.location,

    summary:
      getTrimmedFormValue(
        formData,
        "summary"
      )
  };
}


/**
 * Synchronizes live form values with preview fields.
 */
function updateLiveProfilePreview() {
  const liveData =
    readLiveProfileFormData();

  if (coachProfileDOM.previewProfileName) {
    coachProfileDOM.previewProfileName.textContent =
      liveData.fullName;
  }

  if (coachProfileDOM.previewProfileRole) {
    coachProfileDOM.previewProfileRole.textContent =
      liveData.role;
  }

  if (
    coachProfileDOM.previewProfileLocation
  ) {
    coachProfileDOM.previewProfileLocation.textContent =
      liveData.location;
  }

  if (
    coachProfileDOM.previewProfileSummary
  ) {
    coachProfileDOM.previewProfileSummary.textContent =
      liveData.summary ||
      "No professional summary has been added yet.";
  }
}

const debouncedLivePreview =
  debounce(updateLiveProfilePreview, 120);


/* ==========================================================
   PROFILE SEARCH
========================================================== */

/**
 * Updates the search result message.
 *
 * @param {string} message
 */
function updateProfileSearchMessage(
  message
) {
  if (
    coachProfileDOM.profileSearchResultText
  ) {
    coachProfileDOM.profileSearchResultText.textContent =
      message;
  }
}


/**
 * Returns searchable text from a section.
 *
 * @param {Element} section
 * @returns {string}
 */
function getSectionSearchText(section) {
  const searchKeywords =
    section.getAttribute("data-search-keywords") ||
    "";

  return normalizeText(
    `${section.textContent || ""} ${searchKeywords}`
  );
}


/**
 * Runs profile-section search.
 *
 * @param {string} searchTerm
 */
function searchCoachProfileSections(
  searchTerm
) {
  const normalizedSearchTerm =
    normalizeText(searchTerm);

  if (!normalizedSearchTerm) {
    clearProfileSearchState();

    updateProfileSearchMessage(
      "Search your profile information."
    );

    return;
  }

  let matchCount = 0;
  let firstMatchingSection = null;

  coachProfileDOM.searchableSections.forEach(
    (section) => {
      const sectionText =
        getSectionSearchText(section);

      const matches =
        sectionText.includes(
          normalizedSearchTerm
        );

      section.classList.toggle(
        "search-match",
        matches
      );

      section.classList.toggle(
        "search-no-match",
        !matches
      );

      if (matches) {
        matchCount += 1;

        if (!firstMatchingSection) {
          firstMatchingSection = section;
        }
      }
    }
  );

  if (matchCount === 0) {
    updateProfileSearchMessage(
      `No profile sections found for “${searchTerm.trim()}”.`
    );

    return;
  }

  updateProfileSearchMessage(
    `${matchCount} matching section${
      matchCount === 1 ? "" : "s"
    } found.`
  );

  firstMatchingSection?.scrollIntoView({
    behavior: "smooth",
    block: "center"
  });
}


/**
 * Handles profile search submission.
 *
 * @param {SubmitEvent} event
 */
function handleProfileSearchSubmit(event) {
  event.preventDefault();

  const searchTerm =
    coachProfileDOM.searchInput?.value || "";

  searchCoachProfileSections(
    searchTerm
  );
}


/**
 * Handles live profile search input.
 *
 * @param {Event} event
 */
function handleProfileSearchInput(event) {
  const input = event.currentTarget;

  if (!(input instanceof HTMLInputElement)) {
    return;
  }

  window.clearTimeout(
    coachProfileState.searchTimer
  );

  coachProfileState.searchTimer =
    window.setTimeout(() => {
      searchCoachProfileSections(
        input.value
      );
    }, 260);
}


/* ==========================================================
   STATISTIC ANIMATION
========================================================== */

/**
 * Extracts a numeric value from text.
 *
 * @param {string} text
 * @returns {number}
 */
function parseStatisticValue(text) {
  const numericValue = Number.parseFloat(
    String(text || "").replace(
      /[^0-9.-]/g,
      ""
    )
  );

  return Number.isFinite(numericValue)
    ? numericValue
    : 0;
}


/**
 * Detects suffixes such as +, %, or K.
 *
 * @param {string} value
 * @returns {string}
 */
function getStatisticSuffix(value) {
  const text = String(value || "");

  if (text.includes("%")) {
    return "%";
  }

  if (text.toLowerCase().includes("k")) {
    return "K";
  }

  if (text.includes("+")) {
    return "+";
  }

  return "";
}


/**
 * Animates an individual statistic value.
 *
 * @param {HTMLElement} element
 */
function animateProfileStatistic(element) {
  const originalValue =
    element.getAttribute("data-value") ||
    element.textContent ||
    "0";

  const targetValue =
    parseStatisticValue(originalValue);

  const suffix =
    element.getAttribute("data-suffix") ||
    getStatisticSuffix(originalValue);

  const duration = 950;
  const startTime = performance.now();

  function updateStatistic(currentTime) {
    const elapsed =
      currentTime - startTime;

    const progress = Math.min(
      elapsed / duration,
      1
    );

    const easedProgress =
      1 - Math.pow(1 - progress, 3);

    const currentValue =
      targetValue * easedProgress;

    const displayValue =
      Number.isInteger(targetValue)
        ? Math.round(currentValue)
        : currentValue.toFixed(1);

    element.textContent =
      `${displayValue}${suffix}`;

    if (progress < 1) {
      window.requestAnimationFrame(
        updateStatistic
      );
    } else {
      element.textContent =
        `${targetValue}${suffix}`;
    }
  }

  window.requestAnimationFrame(
    updateStatistic
  );
}


/**
 * Animates all statistics once.
 */
function animateProfileStatistics() {
  if (
    coachProfileState.statisticsAnimated
  ) {
    return;
  }

  coachProfileState.statisticsAnimated = true;

  coachProfileDOM.profileStatisticValues.forEach(
    (element) => {
      if (element instanceof HTMLElement) {
        animateProfileStatistic(element);
      }
    }
  );
}


/**
 * Observes the statistics section.
 */
function initializeStatisticsObserver() {
  if (
    coachProfileDOM.profileStatisticValues.length === 0
  ) {
    return;
  }

  if (
    !("IntersectionObserver" in window)
  ) {
    animateProfileStatistics();
    return;
  }

  const firstStatistic =
    coachProfileDOM.profileStatisticValues[0];

  const statisticsContainer =
    firstStatistic.closest(
      ".profile-statistics-grid"
    ) || firstStatistic;

  const observer = new IntersectionObserver(
    (entries, currentObserver) => {
      const isVisible = entries.some(
        (entry) => entry.isIntersecting
      );

      if (!isVisible) {
        return;
      }

      animateProfileStatistics();

      currentObserver.disconnect();
    },
    {
      threshold: 0.3
    }
  );

  observer.observe(statisticsContainer);
}


/* ==========================================================
   PROFILE ITEM ACTIONS
========================================================== */

/**
 * Opens the edit modal for unfinished card actions.
 *
 * @param {string} sectionName
 * @param {HTMLElement|null} trigger
 */
function openSectionEditPlaceholder(
  sectionName,
  trigger = null
) {
  showProfileToast(
    `${sectionName} editing is ready for backend integration.`,
    "info"
  );

  /*
   * Backend integration can replace this placeholder
   * with a dedicated section modal or route.
   */

  if (
    trigger &&
    sectionName === "Professional profile"
  ) {
    openEditProfileModal(trigger);
  }
}


/**
 * Handles card edit controls.
 *
 * @param {MouseEvent} event
 */
function handleCardEditAction(event) {
  const button = event.currentTarget;

  if (!(button instanceof HTMLElement)) {
    return;
  }

  const sectionName =
    button.getAttribute("data-section") ||
    button.closest(".profile-card")
      ?.querySelector("h2")
      ?.textContent
      ?.trim() ||
    "Profile section";

  openSectionEditPlaceholder(
    sectionName,
    button
  );
}


/**
 * Handles adding a new timeline item.
 *
 * @param {string} itemType
 */
function handleAddProfileItem(itemType) {
  showProfileToast(
    `Add ${itemType} form will be connected to the coach profile API.`,
    "info"
  );

  /*
   * Suggested endpoints:
   *
   * POST /api/v1/coaches/profile/experience
   * POST /api/v1/coaches/profile/qualifications
   * POST /api/v1/coaches/profile/achievements
   */
}


/**
 * Handles experience option buttons.
 *
 * @param {MouseEvent} event
 */
function handleExperienceOptions(event) {
  const button = event.currentTarget;

  if (!(button instanceof HTMLElement)) {
    return;
  }

  const experienceItem =
    button.closest(".experience-item");

  const experienceTitle =
    experienceItem
      ?.querySelector("h3")
      ?.textContent
      ?.trim() ||
    "experience";

  showProfileToast(
    `Options for ${experienceTitle} will be available after backend integration.`,
    "info"
  );
}


/**
 * Handles qualification document preview.
 *
 * @param {MouseEvent} event
 */
function handleQualificationView(event) {
  const button = event.currentTarget;

  if (!(button instanceof HTMLElement)) {
    return;
  }

  const qualificationCard =
    button.closest(".qualification-card");

  const qualificationName =
    qualificationCard
      ?.querySelector("h3")
      ?.textContent
      ?.trim() ||
    "qualification";

  showProfileToast(
    `${qualificationName} document preview is not uploaded yet.`,
    "info"
  );

  /*
   * Backend integration:
   *
   * GET /api/v1/coaches/profile/qualifications/:id/document
   */
}


/* ==========================================================
   LOCAL DRAFT PERSISTENCE
========================================================== */

/**
 * Saves form data temporarily in session storage.
 */
function saveProfileDraft() {
  const form =
    coachProfileDOM.profileEditForm;

  if (!form) {
    return;
  }

  const formData = new FormData(form);
  const draft = {};

  formData.forEach((value, key) => {
    if (typeof value === "string") {
      draft[key] = value;
    }
  });

  try {
    sessionStorage.setItem(
      "coachProfileDraft",
      JSON.stringify(draft)
    );
  } catch (error) {
    console.warn(
      "Unable to save profile draft:",
      error
    );
  }
}

const debouncedSaveProfileDraft =
  debounce(saveProfileDraft, 500);


/**
 * Restores an unfinished form draft.
 */
function restoreProfileDraft() {
  const form =
    coachProfileDOM.profileEditForm;

  if (!form) {
    return;
  }

  try {
    const storedDraft =
      sessionStorage.getItem(
        "coachProfileDraft"
      );

    if (!storedDraft) {
      return;
    }

    const draft =
      JSON.parse(storedDraft);

    Object.entries(draft).forEach(
      ([fieldName, value]) => {
        const field =
          form.elements.namedItem(fieldName);

        if (
          field instanceof HTMLInputElement ||
          field instanceof HTMLTextAreaElement ||
          field instanceof HTMLSelectElement
        ) {
          field.value = String(value);
        }
      }
    );
  } catch (error) {
    console.warn(
      "Unable to restore profile draft:",
      error
    );
  }
}


/**
 * Clears the saved form draft.
 */
function clearProfileDraft() {
  try {
    sessionStorage.removeItem(
      "coachProfileDraft"
    );
  } catch (error) {
    console.warn(
      "Unable to clear profile draft:",
      error
    );
  }
}


/* ==========================================================
   PROFILE DATA APPLICATION
========================================================== */

/**
 * Applies API profile data to page state.
 *
 * @param {object} apiProfile
 */
function applyLoadedProfileData(
  apiProfile
) {
  if (
    !apiProfile ||
    typeof apiProfile !== "object"
  ) {
    return;
  }

  const normalizedProfile = {
    fullName:
      apiProfile.fullName ||
      apiProfile.full_name ||
      coachProfileState.profileData.fullName,

    role:
      apiProfile.role ||
      apiProfile.coaching_role ||
      coachProfileState.profileData.role,

    location:
      apiProfile.location ||
      coachProfileState.profileData.location,

    summary:
      apiProfile.summary ||
      apiProfile.professional_summary ||
      coachProfileState.profileData.summary,

    email:
      apiProfile.email ||
      coachProfileState.profileData.email,

    phone:
      apiProfile.phone ||
      coachProfileState.profileData.phone,

    academy:
      apiProfile.academy ||
      apiProfile.current_academy ||
      coachProfileState.profileData.academy,

    experience:
      apiProfile.experience ||
      apiProfile.years_of_experience ||
      coachProfileState.profileData.experience,

    licence:
      apiProfile.licence ||
      apiProfile.license ||
      coachProfileState.profileData.licence,

    specialisation:
      apiProfile.specialisation ||
      apiProfile.specialization ||
      coachProfileState.profileData.specialisation
  };

  coachProfileState.profileData = {
    ...coachProfileState.profileData,
    ...normalizedProfile
  };

  updateVisibleProfileInformation(
    coachProfileState.profileData
  );

  populateProfileEditForm();
  synchronizeProfilePreview();
  updateProfileCompletion();

  if (apiProfile.avatar_url) {
    updateProfileAvatarImages(
      apiProfile.avatar_url
    );
  }

  if (apiProfile.cover_url) {
    updateProfileCoverImages(
      apiProfile.cover_url
    );
  }

  if (
    typeof apiProfile.is_public === "boolean"
  ) {
    updateProfileVisibility(
      apiProfile.is_public,
      false
    );
  }
}


/* ==========================================================
   BACKEND PROFILE LOADER
========================================================== */

/**
 * Loads the coach profile.
 *
 * This currently preserves static HTML content.
 * Mr. Harsh can activate the fetch block later.
 */
async function loadCoachProfile() {
  coachProfileState.profileLoaded = false;

  try {
    /*
     * BACKEND INTEGRATION PLACEHOLDER
     *
     * const accessToken =
     *   localStorage.getItem("coachAccessToken");
     *
     * const response = await fetch(
     *   "/api/v1/coaches/profile",
     *   {
     *     method: "GET",
     *     headers: {
     *       "Accept": "application/json",
     *       "Authorization":
     *         `Bearer ${accessToken}`
     *     }
     *   }
     * );
     *
     * if (!response.ok) {
     *   throw new Error(
     *     `Profile request failed: ${response.status}`
     *   );
     * }
     *
     * const responseData =
     *   await response.json();
     *
     * applyLoadedProfileData(
     *   responseData.data ||
     *   responseData.profile ||
     *   responseData
     * );
     */

    applyLoadedProfileData(
      coachProfileState.profileData
    );

    coachProfileState.profileLoaded = true;
  } catch (error) {
    console.error(
      "Unable to load coach profile:",
      error
    );

    coachProfileState.profileLoaded = false;

    showProfileToast(
      "Your profile information could not be refreshed.",
      "error"
    );
  }
}


/* ==========================================================
   FORM SAVE COMPLETION ENHANCEMENT
========================================================== */

/**
 * Clears saved drafts after a successful profile submit.
 */
function registerProfileDraftCleanup() {
  coachProfileDOM.profileEditForm?.addEventListener(
    "submit",
    () => {
      window.setTimeout(
        clearProfileDraft,
        0
      );
    }
  );
}


/* ==========================================================
   PAGE CLEANUP
========================================================== */

/**
 * Releases temporary image URLs.
 */
function cleanupCoachProfileResources() {
  if (coachProfileState.avatarObjectURL) {
    URL.revokeObjectURL(
      coachProfileState.avatarObjectURL
    );

    coachProfileState.avatarObjectURL =
      null;
  }

  if (coachProfileState.coverObjectURL) {
    URL.revokeObjectURL(
      coachProfileState.coverObjectURL
    );

    coachProfileState.coverObjectURL =
      null;
  }

  window.clearTimeout(
    coachProfileState.toastTimer
  );

  window.clearTimeout(
    coachProfileState.searchTimer
  );
}


/* ==========================================================
   PART 3 EVENT LISTENERS
========================================================== */

/**
 * Registers media, search and section listeners.
 */
function registerCoachProfilePartThreeListeners() {
  coachProfileDOM.avatarUploadButton?.addEventListener(
    "click",
    openAvatarFilePicker
  );

  coachProfileDOM.coverUploadButton?.addEventListener(
    "click",
    openCoverFilePicker
  );

  coachProfileDOM.avatarUploadInput?.addEventListener(
    "change",
    handleAvatarUpload
  );

  coachProfileDOM.coverUploadInput?.addEventListener(
    "change",
    handleCoverUpload
  );

  coachProfileDOM.searchForm?.addEventListener(
    "submit",
    handleProfileSearchSubmit
  );

  coachProfileDOM.searchInput?.addEventListener(
    "input",
    handleProfileSearchInput
  );

  coachProfileDOM.profileEditForm?.addEventListener(
    "input",
    (event) => {
      debouncedLivePreview();
      debouncedSaveProfileDraft();

      const target = event.target;

      if (
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        target instanceof HTMLSelectElement
      ) {
        target.setCustomValidity("");
      }
    }
  );

  coachProfileDOM.experienceAddButtons.forEach(
    (button) => {
      button.addEventListener(
        "click",
        () => handleAddProfileItem(
          "experience"
        )
      );
    }
  );

  coachProfileDOM.qualificationAddButtons.forEach(
    (button) => {
      button.addEventListener(
        "click",
        () => handleAddProfileItem(
          "qualification"
        )
      );
    }
  );

  coachProfileDOM.achievementAddButtons.forEach(
    (button) => {
      button.addEventListener(
        "click",
        () => handleAddProfileItem(
          "achievement"
        )
      );
    }
  );

  coachProfileDOM.experienceOptionButtons.forEach(
    (button) => {
      button.addEventListener(
        "click",
        handleExperienceOptions
      );
    }
  );

  coachProfileDOM.qualificationViewButtons.forEach(
    (button) => {
      button.addEventListener(
        "click",
        handleQualificationView
      );
    }
  );

  coachProfileDOM.cardEditButtons.forEach(
    (button) => {
      button.addEventListener(
        "click",
        handleCardEditAction
      );
    }
  );

  window.addEventListener(
    "beforeunload",
    cleanupCoachProfileResources
  );
}


/* ==========================================================
   FINAL INITIALIZATION
========================================================== */

/**
 * Initializes Part 3 profile functionality.
 */
async function initializeCoachProfilePartThree() {
  restoreProfileDraft();

  registerProfileDraftCleanup();
  registerCoachProfilePartThreeListeners();

  initializeStatisticsObserver();

  await loadCoachProfile();

  updateLiveProfilePreview();

  document.body.classList.add(
    "coach-profile-fully-initialized"
  );
}


/* ==========================================================
   PART 3 DOM READY
========================================================== */

if (document.readyState === "loading") {
  document.addEventListener(
    "DOMContentLoaded",
    initializeCoachProfilePartThree,
    { once: true }
  );
} else {
  initializeCoachProfilePartThree();
}