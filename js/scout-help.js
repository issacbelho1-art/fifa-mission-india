"use strict";

/* =========================================================
   SCOUT-HELP.JS
   PART 1
   CONFIGURATION, STATE, DOM CACHE, UTILITIES,
   API HELPER, NOTIFICATIONS, SIDEBAR,
   MODALS, IDENTITY, SEARCH AND ARTICLES
========================================================= */


/* =========================================================
   CONFIGURATION
========================================================= */

const SCOUT_HELP_CONFIG = Object.freeze({
  apiBaseUrl:
    "/api/v1",

  supportEndpoint:
    "/scout/support",

  feedbackEndpoint:
    "/scout/help/feedback",

  logoutEndpoint:
    "/auth/logout",

  requestTimeout:
    12000,

  toastDuration:
    4200,

  mockDelay:
    650,

  maximumAttachmentSize:
    10 * 1024 * 1024,

  allowedAttachmentTypes: [
    "image/png",
    "image/jpeg",
    "image/webp",
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ],

  useMockData:
    true
});


/* =========================================================
   APPLICATION STATE
========================================================= */

const scoutHelpState = {
  searchQuery:
    "",

  selectedCategory:
    "all",

  activeModal:
    null,

  modalTrigger:
    null,

  selectedAttachment:
    null,

  supportSubmitting:
    false,

  feedbackSubmitted:
    false
};


/* =========================================================
   DOM CACHE
========================================================= */

const scoutHelpDOM = {
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

  helpSearchInput:
    document.getElementById(
      "helpSearchInput"
    ),

  helpSearchButton:
    document.getElementById(
      "helpSearchButton"
    ),

  helpSearchSuggestionButtons:
    Array.from(
      document.querySelectorAll(
        "[data-help-search-term]"
      )
    ),

  helpCategoryButtons:
    Array.from(
      document.querySelectorAll(
        "[data-help-category]"
      )
    ),

  helpArticleList:
    document.getElementById(
      "helpArticleList"
    ),

  helpArticles:
    Array.from(
      document.querySelectorAll(
        ".scout-help-article"
      )
    ),

  helpArticleToggles:
    Array.from(
      document.querySelectorAll(
        ".scout-help-article-toggle"
      )
    ),

  helpResultCount:
    document.getElementById(
      "helpResultCount"
    ),

  helpEmptyState:
    document.getElementById(
      "helpEmptyState"
    ),

  clearHelpSearchButton:
    document.getElementById(
      "clearHelpSearchButton"
    ),

  openSupportFormButtons:
    Array.from(
      document.querySelectorAll(
        "[data-open-support-form]"
      )
    ),

  supportSection:
    document.getElementById(
      "scoutContactSupportSection"
    ),

  supportForm:
    document.getElementById(
      "scoutSupportForm"
    ),

  supportCategory:
    document.getElementById(
      "supportCategory"
    ),

  supportPriority:
    document.getElementById(
      "supportPriority"
    ),

  supportSubject:
    document.getElementById(
      "supportSubject"
    ),

  supportMessage:
    document.getElementById(
      "supportMessage"
    ),

  supportMessageCount:
    document.getElementById(
      "supportMessageCount"
    ),

  supportAttachment:
    document.getElementById(
      "supportAttachment"
    ),

  supportSelectedFile:
    document.getElementById(
      "supportSelectedFile"
    ),

  supportSelectedFileName:
    document.getElementById(
      "supportSelectedFileName"
    ),

  removeSupportAttachmentButton:
    document.getElementById(
      "removeSupportAttachmentButton"
    ),

  submitSupportRequestButton:
    document.getElementById(
      "submitSupportRequestButton"
    ),

  openScoutGuideButton:
    document.getElementById(
      "openScoutGuideButton"
    ),

  scoutGuideModal:
    document.getElementById(
      "scoutGuideModal"
    ),

  scoutGuideCloseButtons:
    Array.from(
      document.querySelectorAll(
        "[data-scout-guide-close]"
      )
    ),

  openVideoTutorialsButton:
    document.getElementById(
      "openVideoTutorialsButton"
    ),

  videoTutorialsModal:
    document.getElementById(
      "videoTutorialsModal"
    ),

  videoTutorialsCloseButtons:
    Array.from(
      document.querySelectorAll(
        "[data-video-tutorials-close]"
      )
    ),

  videoTutorialCards:
    Array.from(
      document.querySelectorAll(
        ".scout-video-tutorial-card"
      )
    ),

  reportCriticalIssueButton:
    document.getElementById(
      "reportCriticalIssueButton"
    ),

  feedbackButtons:
    Array.from(
      document.querySelectorAll(
        "[data-helpful-feedback]"
      )
    ),

  helpFeedbackMessage:
    document.getElementById(
      "helpFeedbackMessage"
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
  fallback = ""
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


function normalizeString(
  value
) {
  return safeText(
    value
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


function delay(
  milliseconds
) {
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


function formatFileSize(
  bytes
) {
  const size =
    Number(bytes);

  if (
    !Number.isFinite(size) ||
    size <= 0
  ) {
    return "0 KB";
  }

  const units = [
    "Bytes",
    "KB",
    "MB",
    "GB"
  ];

  const index =
    Math.min(
      Math.floor(
        Math.log(size) /
        Math.log(1024)
      ),
      units.length - 1
    );

  const value =
    size /
    1024 ** index;

  return `${value.toFixed(
    index === 0
      ? 0
      : 1
  )} ${units[index]}`;
}


/* =========================================================
   API REQUEST HELPER
========================================================= */

async function scoutHelpApiRequest(
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
      SCOUT_HELP_CONFIG
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
    if (
      options.body instanceof
      FormData
    ) {
      requestOptions.body =
        options.body;
    } else {
      requestOptions.headers[
        "Content-Type"
      ] =
        "application/json";

      requestOptions.body =
        typeof options.body ===
        "string"
          ? options.body
          : JSON.stringify(
              options.body
            );
    }
  }

  try {
    const response =
      await fetch(
        `${SCOUT_HELP_CONFIG.apiBaseUrl}${endpoint}`,
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

function showScoutHelpNotification({
  title = "Notification",
  message = "",
  type = "info",
  duration =
    SCOUT_HELP_CONFIG
      .toastDuration
}) {
  if (
    !scoutHelpDOM
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

  content.append(
    heading,
    description
  );

  toast.append(
    icon,
    content,
    closeButton
  );

  scoutHelpDOM
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

function openScoutHelpSidebar() {
  scoutHelpDOM
    .body
    .classList.add(
      "scout-sidebar-open"
    );

  scoutHelpDOM
    .menuButton
    ?.setAttribute(
      "aria-expanded",
      "true"
    );

  scoutHelpDOM
    .sidebarOverlay
    ?.setAttribute(
      "aria-hidden",
      "false"
    );

  scoutHelpDOM
    .sidebarClose
    ?.focus();
}


function closeScoutHelpSidebar({
  restoreFocus = true
} = {}) {
  scoutHelpDOM
    .body
    .classList.remove(
      "scout-sidebar-open"
    );

  scoutHelpDOM
    .menuButton
    ?.setAttribute(
      "aria-expanded",
      "false"
    );

  scoutHelpDOM
    .sidebarOverlay
    ?.setAttribute(
      "aria-hidden",
      "true"
    );

  if (restoreFocus) {
    scoutHelpDOM
      .menuButton
      ?.focus();
  }
}


function initializeScoutHelpSidebar() {
  scoutHelpDOM
    .menuButton
    ?.addEventListener(
      "click",
      openScoutHelpSidebar
    );

  scoutHelpDOM
    .sidebarClose
    ?.addEventListener(
      "click",
      () => {
        closeScoutHelpSidebar();
      }
    );

  scoutHelpDOM
    .sidebarOverlay
    ?.addEventListener(
      "click",
      () => {
        closeScoutHelpSidebar();
      }
    );

  window.addEventListener(
    "resize",
    () => {
      if (
        window.innerWidth >
        960
      ) {
        closeScoutHelpSidebar({
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


function openScoutHelpModal(
  modal,
  trigger = null
) {
  if (!modal) {
    return;
  }

  scoutHelpState.activeModal =
    modal;

  scoutHelpState.modalTrigger =
    trigger ||
    document.activeElement;

  modal.hidden =
    false;

  scoutHelpDOM
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


function closeScoutHelpModal(
  modal
) {
  if (!modal) {
    return;
  }

  modal.hidden =
    true;

  if (
    scoutHelpState
      .activeModal ===
    modal
  ) {
    scoutHelpState.activeModal =
      null;
  }

  const anyModalOpen = [
    scoutHelpDOM
      .scoutGuideModal,

    scoutHelpDOM
      .videoTutorialsModal,

    scoutHelpDOM
      .logoutModal
  ].some((candidate) => {
    return (
      candidate &&
      !candidate.hidden
    );
  });

  if (!anyModalOpen) {
    scoutHelpDOM
      .body
      .classList.remove(
        "scout-modal-open"
      );
  }

  if (
    scoutHelpState
      .modalTrigger instanceof
    HTMLElement
  ) {
    scoutHelpState
      .modalTrigger
      .focus();
  }

  scoutHelpState.modalTrigger =
    null;
}


function trapScoutHelpModalFocus(
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

function getMockScoutHelpIdentity() {
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
   IDENTITY RENDERING
========================================================= */

function renderScoutHelpIdentity(
  identity
) {
  scoutHelpDOM
    .scoutNameElements
    .forEach((element) => {
      element.textContent =
        identity.name;
    });

  scoutHelpDOM
    .scoutDesignationElements
    .forEach((element) => {
      element.textContent =
        identity.designation;
    });

  scoutHelpDOM
    .scoutOrganizationElements
    .forEach((element) => {
      element.textContent =
        identity.organization;
    });

  scoutHelpDOM
    .scoutAvatarElements
    .forEach((image) => {
      image.src =
        identity.avatar;

      image.alt =
        `${identity.name} profile`;
    });

  if (
    scoutHelpDOM
      .notificationBadge
  ) {
    const count =
      Number(
        identity
          .unreadNotifications ||
        0
      );

    scoutHelpDOM
      .notificationBadge
      .textContent =
      count > 99
        ? "99+"
        : String(count);

    scoutHelpDOM
      .notificationBadge
      .hidden =
      count <= 0;
  }
}


/* =========================================================
   ARTICLE TOGGLE
========================================================= */

function setHelpArticleOpen(
  article,
  open
) {
  if (!article) {
    return;
  }

  const toggle =
    article.querySelector(
      ".scout-help-article-toggle"
    );

  const content =
    article.querySelector(
      ".scout-help-article-content"
    );

  article.classList.toggle(
    "is-open",
    open
  );

  toggle?.setAttribute(
    "aria-expanded",
    String(open)
  );

  if (content) {
    content.hidden =
      !open;
  }
}


function closeAllHelpArticles({
  except = null
} = {}) {
  scoutHelpDOM
    .helpArticles
    .forEach((article) => {
      if (
        article === except
      ) {
        return;
      }

      setHelpArticleOpen(
        article,
        false
      );
    });
}


function toggleHelpArticle(
  toggleButton
) {
  const article =
    toggleButton.closest(
      ".scout-help-article"
    );

  if (!article) {
    return;
  }

  const currentlyOpen =
    article.classList.contains(
      "is-open"
    );

  closeAllHelpArticles({
    except:
      currentlyOpen
        ? null
        : article
  });

  setHelpArticleOpen(
    article,
    !currentlyOpen
  );
}


/* =========================================================
   SEARCH MATCHING
========================================================= */

function helpArticleMatchesSearch(
  article,
  searchQuery
) {
  if (!searchQuery) {
    return true;
  }

  const keywords =
    normalizeString(
      article.dataset
        .helpKeywords
    );

  const content =
    normalizeString(
      article.textContent
    );

  return (
    keywords.includes(
      searchQuery
    ) ||
    content.includes(
      searchQuery
    )
  );
}


function helpArticleMatchesCategory(
  article,
  category
) {
  if (
    !category ||
    category === "all"
  ) {
    return true;
  }

  return (
    article.dataset
      .helpCategory ===
    category
  );
}


/* =========================================================
   HELP FILTERING
========================================================= */

function applyHelpFilters() {
  const searchQuery =
    normalizeString(
      scoutHelpState
        .searchQuery
    );

  let visibleCount = 0;

  scoutHelpDOM
    .helpArticles
    .forEach((article) => {
      const visible =
        helpArticleMatchesSearch(
          article,
          searchQuery
        ) &&
        helpArticleMatchesCategory(
          article,
          scoutHelpState
            .selectedCategory
        );

      article.hidden =
        !visible;

      if (visible) {
        visibleCount += 1;
      } else {
        setHelpArticleOpen(
          article,
          false
        );
      }
    });

  if (
    scoutHelpDOM
      .helpResultCount
  ) {
    scoutHelpDOM
      .helpResultCount
      .textContent =
      `${visibleCount} ${
        visibleCount === 1
          ? "article"
          : "articles"
      }`;
  }

  if (
    scoutHelpDOM
      .helpEmptyState
  ) {
    scoutHelpDOM
      .helpEmptyState
      .hidden =
      visibleCount > 0;
  }

  if (
    scoutHelpDOM
      .helpArticleList
  ) {
    scoutHelpDOM
      .helpArticleList
      .hidden =
      visibleCount === 0;
  }
}


/* =========================================================
   SEARCH ACTIONS
========================================================= */

function performHelpSearch({
  focusResults = false
} = {}) {
  scoutHelpState.searchQuery =
    scoutHelpDOM
      .helpSearchInput
      ?.value ||
    "";

  applyHelpFilters();

  if (focusResults) {
    document
      .getElementById(
        "scoutHelpArticlesSection"
      )
      ?.scrollIntoView({
        behavior:
          "smooth",

        block:
          "start"
      });
  }
}


function clearHelpSearchAndCategory() {
  scoutHelpState.searchQuery =
    "";

  scoutHelpState.selectedCategory =
    "all";

  if (
    scoutHelpDOM
      .helpSearchInput
  ) {
    scoutHelpDOM
      .helpSearchInput
      .value = "";
  }

  scoutHelpDOM
    .helpCategoryButtons
    .forEach((button) => {
      button.classList.remove(
        "is-active"
      );

      button.setAttribute(
        "aria-pressed",
        "false"
      );
    });

  closeAllHelpArticles();

  applyHelpFilters();

  scoutHelpDOM
    .helpSearchInput
    ?.focus();
}


/* =========================================================
   CATEGORY SELECTION
========================================================= */

function selectHelpCategory(
  category,
  trigger
) {
  const isSameCategory =
    scoutHelpState
      .selectedCategory ===
    category;

  scoutHelpState.selectedCategory =
    isSameCategory
      ? "all"
      : category;

  scoutHelpDOM
    .helpCategoryButtons
    .forEach((button) => {
      const active =
        button === trigger &&
        !isSameCategory;

      button.classList.toggle(
        "is-active",
        active
      );

      button.setAttribute(
        "aria-pressed",
        String(active)
      );
    });

  applyHelpFilters();

  document
    .getElementById(
      "scoutHelpArticlesSection"
    )
    ?.scrollIntoView({
      behavior:
        "smooth",

      block:
        "start"
    });
}


/* =========================================================
   SEARCH DEBOUNCE
========================================================= */

function createHelpDebounce(
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


const handleHelpSearchInput =
  createHelpDebounce(
    () => {
      performHelpSearch();
    },
    220
  );


/* =========================================================
   SEARCH AND ARTICLE EVENTS
========================================================= */

function initializeHelpSearchEvents() {
  scoutHelpDOM
    .helpSearchInput
    ?.addEventListener(
      "input",
      handleHelpSearchInput
    );

  scoutHelpDOM
    .helpSearchInput
    ?.addEventListener(
      "keydown",
      (event) => {
        if (
          event.key ===
          "Enter"
        ) {
          event.preventDefault();

          performHelpSearch({
            focusResults:
              true
          });
        }
      }
    );

  scoutHelpDOM
    .helpSearchButton
    ?.addEventListener(
      "click",
      () => {
        performHelpSearch({
          focusResults:
            true
        });
      }
    );

  scoutHelpDOM
    .helpSearchSuggestionButtons
    .forEach((button) => {
      button.addEventListener(
        "click",
        () => {
          const searchTerm =
            button.dataset
              .helpSearchTerm ||
            "";

          if (
            scoutHelpDOM
              .helpSearchInput
          ) {
            scoutHelpDOM
              .helpSearchInput
              .value =
              searchTerm;
          }

          scoutHelpState.searchQuery =
            searchTerm;

          applyHelpFilters();

          document
            .getElementById(
              "scoutHelpArticlesSection"
            )
            ?.scrollIntoView({
              behavior:
                "smooth",

              block:
                "start"
            });
        }
      );
    });

  scoutHelpDOM
    .helpCategoryButtons
    .forEach((button) => {
      button.setAttribute(
        "aria-pressed",
        "false"
      );

      button.addEventListener(
        "click",
        () => {
          selectHelpCategory(
            button.dataset
              .helpCategory ||
            "all",
            button
          );
        }
      );
    });

  scoutHelpDOM
    .helpArticleToggles
    .forEach((toggle) => {
      toggle.addEventListener(
        "click",
        () => {
          toggleHelpArticle(
            toggle
          );
        }
      );
    });

  scoutHelpDOM
    .clearHelpSearchButton
    ?.addEventListener(
      "click",
      clearHelpSearchAndCategory
    );
}


/* =========================================================
   OPEN SUPPORT FORM
========================================================= */

function openScoutSupportForm({
  category = "",
  priority = "",
  subject = ""
} = {}) {
  if (
    category &&
    scoutHelpDOM
      .supportCategory
  ) {
    scoutHelpDOM
      .supportCategory
      .value =
      category;
  }

  if (
    priority &&
    scoutHelpDOM
      .supportPriority
  ) {
    scoutHelpDOM
      .supportPriority
      .value =
      priority;
  }

  if (
    subject &&
    scoutHelpDOM
      .supportSubject
  ) {
    scoutHelpDOM
      .supportSubject
      .value =
      subject;
  }

  scoutHelpDOM
    .supportSection
    ?.scrollIntoView({
      behavior:
        "smooth",

      block:
        "start"
    });

  window.setTimeout(
    () => {
      if (
        !scoutHelpDOM
          .supportCategory
          ?.value
      ) {
        scoutHelpDOM
          .supportCategory
          ?.focus();
      } else if (
        !scoutHelpDOM
          .supportSubject
          ?.value
      ) {
        scoutHelpDOM
          .supportSubject
          ?.focus();
      } else {
        scoutHelpDOM
          .supportMessage
          ?.focus();
      }
    },
    420
  );
}


/* =========================================================
   END OF SCOUT-HELP.JS — PART 1
   CONTINUE DIRECTLY WITH PART 2
========================================================= */

/* =========================================================
   SCOUT-HELP.JS
   PART 2
   SUPPORT VALIDATION, ATTACHMENTS, SUBMISSION,
   GUIDE, VIDEOS, FEEDBACK, NOTIFICATIONS,
   LOGOUT, KEYBOARD EVENTS AND INITIALIZATION
   CONTINUES DIRECTLY FROM PART 1
========================================================= */


/* =========================================================
   SUPPORT FIELD HELPERS
========================================================= */

function getSupportErrorElement(
  field
) {
  if (!field?.id) {
    return null;
  }

  return document.querySelector(
    `[data-error-for="${field.id}"]`
  );
}


function setSupportFieldError(
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
    getSupportErrorElement(
      field
    );

  if (errorElement) {
    errorElement.textContent =
      message;
  }
}


function clearSupportFieldError(
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
    getSupportErrorElement(
      field
    );

  if (errorElement) {
    errorElement.textContent =
      "";
  }
}


function clearAllSupportErrors() {
  [
    scoutHelpDOM
      .supportCategory,

    scoutHelpDOM
      .supportSubject,

    scoutHelpDOM
      .supportMessage,

    scoutHelpDOM
      .supportAttachment
  ].forEach(
    clearSupportFieldError
  );
}


/* =========================================================
   SUPPORT MESSAGE COUNTER
========================================================= */

function updateSupportMessageCounter() {
  if (
    !scoutHelpDOM
      .supportMessage ||
    !scoutHelpDOM
      .supportMessageCount
  ) {
    return;
  }

  const currentLength =
    scoutHelpDOM
      .supportMessage
      .value
      .length;

  const maximumLength =
    Number(
      scoutHelpDOM
        .supportMessage
        .maxLength ||
      1600
    );

  scoutHelpDOM
    .supportMessageCount
    .textContent =
    `${currentLength} / ${maximumLength}`;
}


/* =========================================================
   ATTACHMENT VALIDATION
========================================================= */

function validateSupportAttachment(
  file
) {
  if (!file) {
    return {
      valid: true,
      message: ""
    };
  }

  if (
    file.size >
    SCOUT_HELP_CONFIG
      .maximumAttachmentSize
  ) {
    return {
      valid: false,
      message:
        "Attachment must be 10 MB or smaller."
    };
  }

  if (
    file.type &&
    !SCOUT_HELP_CONFIG
      .allowedAttachmentTypes
      .includes(
        file.type
      )
  ) {
    return {
      valid: false,
      message:
        "Upload a PNG, JPG, WEBP, PDF, DOC or DOCX file."
    };
  }

  return {
    valid: true,
    message: ""
  };
}


/* =========================================================
   ATTACHMENT DISPLAY
========================================================= */

function renderSelectedSupportAttachment(
  file
) {
  scoutHelpState.selectedAttachment =
    file || null;

  if (
    !file ||
    !scoutHelpDOM
      .supportSelectedFile
  ) {
    if (
      scoutHelpDOM
        .supportSelectedFile
    ) {
      scoutHelpDOM
        .supportSelectedFile
        .hidden = true;
    }

    if (
      scoutHelpDOM
        .supportSelectedFileName
    ) {
      scoutHelpDOM
        .supportSelectedFileName
        .textContent =
        "";
    }

    return;
  }

  scoutHelpDOM
    .supportSelectedFile
    .hidden = false;

  if (
    scoutHelpDOM
      .supportSelectedFileName
  ) {
    scoutHelpDOM
      .supportSelectedFileName
      .textContent =
      `${file.name} · ${formatFileSize(
        file.size
      )}`;
  }
}


function removeSupportAttachment() {
  scoutHelpState.selectedAttachment =
    null;

  if (
    scoutHelpDOM
      .supportAttachment
  ) {
    scoutHelpDOM
      .supportAttachment
      .value = "";
  }

  renderSelectedSupportAttachment(
    null
  );

  clearSupportFieldError(
    scoutHelpDOM
      .supportAttachment
  );
}


/* =========================================================
   SUPPORT FORM VALIDATION
========================================================= */

function validateScoutSupportForm() {
  clearAllSupportErrors();

  let valid = true;
  let firstInvalidField =
    null;

  if (
    !scoutHelpDOM
      .supportCategory
      ?.value
  ) {
    setSupportFieldError(
      scoutHelpDOM
        .supportCategory,
      "Select a support category."
    );

    firstInvalidField ||=
      scoutHelpDOM
        .supportCategory;

    valid = false;
  }

  const subject =
    scoutHelpDOM
      .supportSubject
      ?.value
      .trim() ||
    "";

  if (!subject) {
    setSupportFieldError(
      scoutHelpDOM
        .supportSubject,
      "Enter a subject."
    );

    firstInvalidField ||=
      scoutHelpDOM
        .supportSubject;

    valid = false;
  } else if (
    subject.length < 5
  ) {
    setSupportFieldError(
      scoutHelpDOM
        .supportSubject,
      "Subject must contain at least 5 characters."
    );

    firstInvalidField ||=
      scoutHelpDOM
        .supportSubject;

    valid = false;
  }

  const message =
    scoutHelpDOM
      .supportMessage
      ?.value
      .trim() ||
    "";

  if (!message) {
    setSupportFieldError(
      scoutHelpDOM
        .supportMessage,
      "Enter your support message."
    );

    firstInvalidField ||=
      scoutHelpDOM
        .supportMessage;

    valid = false;
  } else if (
    message.length < 20
  ) {
    setSupportFieldError(
      scoutHelpDOM
        .supportMessage,
      "Message must contain at least 20 characters."
    );

    firstInvalidField ||=
      scoutHelpDOM
        .supportMessage;

    valid = false;
  }

  const attachmentValidation =
    validateSupportAttachment(
      scoutHelpState
        .selectedAttachment
    );

  if (
    !attachmentValidation.valid
  ) {
    setSupportFieldError(
      scoutHelpDOM
        .supportAttachment,
      attachmentValidation.message
    );

    firstInvalidField ||=
      scoutHelpDOM
        .supportAttachment;

    valid = false;
  }

  firstInvalidField?.focus();

  return valid;
}


/* =========================================================
   SUPPORT FORM DATA
========================================================= */

function collectScoutSupportData() {
  return {
    category:
      scoutHelpDOM
        .supportCategory
        ?.value ||
      "",

    priority:
      scoutHelpDOM
        .supportPriority
        ?.value ||
      "normal",

    subject:
      scoutHelpDOM
        .supportSubject
        ?.value
        .trim() ||
      "",

    message:
      scoutHelpDOM
        .supportMessage
        ?.value
        .trim() ||
      ""
  };
}


/* =========================================================
   RESET SUPPORT FORM
========================================================= */

function resetScoutSupportForm() {
  scoutHelpDOM
    .supportForm
    ?.reset();

  removeSupportAttachment();

  clearAllSupportErrors();

  updateSupportMessageCounter();

  if (
    scoutHelpDOM
      .supportPriority
  ) {
    scoutHelpDOM
      .supportPriority
      .value =
      "normal";
  }
}


/* =========================================================
   SUPPORT SUBMISSION
========================================================= */

async function submitScoutSupportRequest(
  event
) {
  event.preventDefault();

  if (
    scoutHelpState
      .supportSubmitting
  ) {
    return;
  }

  if (
    !validateScoutSupportForm()
  ) {
    showScoutHelpNotification({
      title:
        "Check support request",

      message:
        "Complete the required fields before submitting.",

      type:
        "error"
    });

    return;
  }

  const supportData =
    collectScoutSupportData();

  scoutHelpState.supportSubmitting =
    true;

  setButtonLoading(
    scoutHelpDOM
      .submitSupportRequestButton,
    true
  );

  try {
    if (
      SCOUT_HELP_CONFIG
        .useMockData
    ) {
      await delay(
        SCOUT_HELP_CONFIG
          .mockDelay
      );
    } else {
      const formData =
        new FormData();

      Object.entries(
        supportData
      ).forEach(
        ([key, value]) => {
          formData.append(
            key,
            value
          );
        }
      );

      if (
        scoutHelpState
          .selectedAttachment
      ) {
        formData.append(
          "attachment",
          scoutHelpState
            .selectedAttachment
        );
      }

      await scoutHelpApiRequest(
        SCOUT_HELP_CONFIG
          .supportEndpoint,
        {
          method: "POST",
          body: formData
        }
      );
    }

    resetScoutSupportForm();

    showScoutHelpNotification({
      title:
        "Support request submitted",

      message:
        "The FIFA Mission India support team will review your request.",

      type:
        "success"
    });
  } catch (error) {
    console.error(
      "Support request submission failed:",
      error
    );

    showScoutHelpNotification({
      title:
        "Submission failed",

      message:
        error.message ||
        "Your support request could not be submitted.",

      type:
        "error"
    });
  } finally {
    scoutHelpState.supportSubmitting =
      false;

    setButtonLoading(
      scoutHelpDOM
        .submitSupportRequestButton,
      false
    );
  }
}


/* =========================================================
   SUPPORT FORM EVENTS
========================================================= */

function initializeScoutSupportEvents() {
  scoutHelpDOM
    .openSupportFormButtons
    .forEach((button) => {
      button.addEventListener(
        "click",
        () => {
          openScoutSupportForm({
            category:
              "account",

            subject:
              "Account access problem"
          });
        }
      );
    });

  scoutHelpDOM
    .supportForm
    ?.addEventListener(
      "submit",
      submitScoutSupportRequest
    );

  scoutHelpDOM
    .supportCategory
    ?.addEventListener(
      "change",
      () => {
        clearSupportFieldError(
          scoutHelpDOM
            .supportCategory
        );
      }
    );

  scoutHelpDOM
    .supportSubject
    ?.addEventListener(
      "input",
      () => {
        clearSupportFieldError(
          scoutHelpDOM
            .supportSubject
        );
      }
    );

  scoutHelpDOM
    .supportMessage
    ?.addEventListener(
      "input",
      () => {
        clearSupportFieldError(
          scoutHelpDOM
            .supportMessage
        );

        updateSupportMessageCounter();
      }
    );

  scoutHelpDOM
    .supportAttachment
    ?.addEventListener(
      "change",
      (event) => {
        const file =
          event.target
            .files?.[0] ||
          null;

        const validation =
          validateSupportAttachment(
            file
          );

        if (
          !validation.valid
        ) {
          renderSelectedSupportAttachment(
            null
          );

          setSupportFieldError(
            scoutHelpDOM
              .supportAttachment,
            validation.message
          );

          event.target.value =
            "";

          showScoutHelpNotification({
            title:
              "Attachment rejected",

            message:
              validation.message,

            type:
              "error"
          });

          return;
        }

        clearSupportFieldError(
          scoutHelpDOM
            .supportAttachment
        );

        renderSelectedSupportAttachment(
          file
        );
      }
    );

  scoutHelpDOM
    .removeSupportAttachmentButton
    ?.addEventListener(
      "click",
      removeSupportAttachment
    );

  scoutHelpDOM
    .reportCriticalIssueButton
    ?.addEventListener(
      "click",
      () => {
        openScoutSupportForm({
          category:
            "technical",

          priority:
            "urgent",

          subject:
            "Critical platform issue"
        });
      }
    );
}


/* =========================================================
   GUIDE MODAL
========================================================= */

function openScoutGuideModal() {
  openScoutHelpModal(
    scoutHelpDOM
      .scoutGuideModal,
    scoutHelpDOM
      .openScoutGuideButton
  );
}


function closeScoutGuideModal() {
  closeScoutHelpModal(
    scoutHelpDOM
      .scoutGuideModal
  );
}


/* =========================================================
   VIDEO MODAL
========================================================= */

function openVideoTutorialsModal() {
  openScoutHelpModal(
    scoutHelpDOM
      .videoTutorialsModal,
    scoutHelpDOM
      .openVideoTutorialsButton
  );
}


function closeVideoTutorialsModal() {
  closeScoutHelpModal(
    scoutHelpDOM
      .videoTutorialsModal
  );
}


/* =========================================================
   GUIDE AND VIDEO EVENTS
========================================================= */

function initializeHelpResourceEvents() {
  scoutHelpDOM
    .openScoutGuideButton
    ?.addEventListener(
      "click",
      openScoutGuideModal
    );

  scoutHelpDOM
    .scoutGuideCloseButtons
    .forEach((button) => {
      button.addEventListener(
        "click",
        closeScoutGuideModal
      );
    });

  scoutHelpDOM
    .openVideoTutorialsButton
    ?.addEventListener(
      "click",
      openVideoTutorialsModal
    );

  scoutHelpDOM
    .videoTutorialsCloseButtons
    .forEach((button) => {
      button.addEventListener(
        "click",
        closeVideoTutorialsModal
      );
    });

  scoutHelpDOM
    .videoTutorialCards
    .forEach((card) => {
      card.addEventListener(
        "click",
        () => {
          showScoutHelpNotification({
            title:
              "Tutorial coming soon",

            message:
              "This video will be connected when the media library is available.",

            type:
              "info"
          });
        }
      );
    });
}


/* =========================================================
   FEEDBACK
========================================================= */

async function submitHelpFeedback(
  feedback,
  button
) {
  if (
    scoutHelpState
      .feedbackSubmitted
  ) {
    return;
  }

  scoutHelpState.feedbackSubmitted =
    true;

  scoutHelpDOM
    .feedbackButtons
    .forEach((candidate) => {
      candidate.classList.toggle(
        "is-selected",
        candidate === button
      );

      candidate.disabled =
        true;
    });

  if (
    scoutHelpDOM
      .helpFeedbackMessage
  ) {
    scoutHelpDOM
      .helpFeedbackMessage
      .textContent =
      "Thank you for sharing your feedback.";
  }

  try {
    if (
      !SCOUT_HELP_CONFIG
        .useMockData
    ) {
      await scoutHelpApiRequest(
        SCOUT_HELP_CONFIG
          .feedbackEndpoint,
        {
          method: "POST",

          body: {
            helpful:
              feedback === "yes",

            page:
              "scout-help"
          }
        }
      );
    }

    showScoutHelpNotification({
      title:
        "Feedback received",

      message:
        "Thank you for helping us improve Scout support.",

      type:
        "success"
    });
  } catch (error) {
    scoutHelpState.feedbackSubmitted =
      false;

    scoutHelpDOM
      .feedbackButtons
      .forEach((candidate) => {
        candidate.classList.remove(
          "is-selected"
        );

        candidate.disabled =
          false;
      });

    if (
      scoutHelpDOM
        .helpFeedbackMessage
    ) {
      scoutHelpDOM
        .helpFeedbackMessage
        .textContent =
        "Your feedback could not be submitted. Please try again.";
    }

    showScoutHelpNotification({
      title:
        "Feedback failed",

      message:
        error.message ||
        "Your feedback could not be submitted.",

      type:
        "error"
    });
  }
}


function initializeHelpFeedbackEvents() {
  scoutHelpDOM
    .feedbackButtons
    .forEach((button) => {
      button.addEventListener(
        "click",
        () => {
          submitHelpFeedback(
            button.dataset
              .helpfulFeedback,
            button
          );
        }
      );
    });
}


/* =========================================================
   NOTIFICATIONS
========================================================= */

function handleScoutHelpNotificationButton() {
  if (
    scoutHelpDOM
      .notificationBadge
  ) {
    scoutHelpDOM
      .notificationBadge
      .hidden = true;
  }

  showScoutHelpNotification({
    title:
      "Notifications",

    message:
      "Notification history will be connected after backend integration.",

    type:
      "info"
  });
}


/* =========================================================
   LOGOUT
========================================================= */

function openScoutHelpLogoutModal() {
  openScoutHelpModal(
    scoutHelpDOM
      .logoutModal,
    scoutHelpDOM
      .logoutButton
  );
}


function closeScoutHelpLogoutModal() {
  closeScoutHelpModal(
    scoutHelpDOM
      .logoutModal
  );
}


async function confirmScoutHelpLogout() {
  setButtonLoading(
    scoutHelpDOM
      .confirmLogoutButton,
    true
  );

  try {
    if (
      SCOUT_HELP_CONFIG
        .useMockData
    ) {
      await delay(
        SCOUT_HELP_CONFIG
          .mockDelay
      );

      localStorage.removeItem(
        "scoutAccessToken"
      );

      sessionStorage.clear();
    } else {
      await scoutHelpApiRequest(
        SCOUT_HELP_CONFIG
          .logoutEndpoint,
        {
          method:
            "POST"
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

    showScoutHelpNotification({
      title:
        "Logout failed",

      message:
        error.message ||
        "You could not be logged out.",

      type:
        "error"
    });

    setButtonLoading(
      scoutHelpDOM
        .confirmLogoutButton,
      false
    );
  }
}


/* =========================================================
   LOGOUT EVENTS
========================================================= */

function initializeScoutHelpLogoutEvents() {
  scoutHelpDOM
    .logoutButton
    ?.addEventListener(
      "click",
      openScoutHelpLogoutModal
    );

  scoutHelpDOM
    .logoutModalCloseButtons
    .forEach((button) => {
      button.addEventListener(
        "click",
        closeScoutHelpLogoutModal
      );
    });

  scoutHelpDOM
    .confirmLogoutButton
    ?.addEventListener(
      "click",
      confirmScoutHelpLogout
    );
}


/* =========================================================
   IMAGE FALLBACKS
========================================================= */

function initializeScoutHelpImageFallbacks() {
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

      image.src =
        "images/scout-avatar-placeholder.jpg";
    },
    true
  );
}


/* =========================================================
   GLOBAL KEYBOARD EVENTS
========================================================= */

function handleScoutHelpGlobalKeydown(
  event
) {
  const activeModal =
    scoutHelpState
      .activeModal;

  if (
    event.key === "Escape"
  ) {
    if (
      activeModal ===
      scoutHelpDOM
        .scoutGuideModal
    ) {
      closeScoutGuideModal();
      return;
    }

    if (
      activeModal ===
      scoutHelpDOM
        .videoTutorialsModal
    ) {
      closeVideoTutorialsModal();
      return;
    }

    if (
      activeModal ===
      scoutHelpDOM
        .logoutModal
    ) {
      closeScoutHelpLogoutModal();
      return;
    }

    if (
      scoutHelpDOM
        .body
        .classList
        .contains(
          "scout-sidebar-open"
        )
    ) {
      closeScoutHelpSidebar();
    }
  }

  if (activeModal) {
    trapScoutHelpModalFocus(
      event,
      activeModal
    );
  }
}


/* =========================================================
   GENERAL EVENTS
========================================================= */

function initializeScoutHelpGeneralEvents() {
  scoutHelpDOM
    .notificationButton
    ?.addEventListener(
      "click",
      handleScoutHelpNotificationButton
    );

  document.addEventListener(
    "keydown",
    handleScoutHelpGlobalKeydown
  );
}


/* =========================================================
   INITIALIZATION
========================================================= */

function initializeScoutHelpPage() {
  initializeScoutHelpSidebar();
  initializeHelpSearchEvents();
  initializeScoutSupportEvents();
  initializeHelpResourceEvents();
  initializeHelpFeedbackEvents();
  initializeScoutHelpLogoutEvents();
  initializeScoutHelpGeneralEvents();
  initializeScoutHelpImageFallbacks();

  renderScoutHelpIdentity(
    getMockScoutHelpIdentity()
  );

  updateSupportMessageCounter();

  applyHelpFilters();
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
    initializeScoutHelpPage,
    {
      once: true
    }
  );
} else {
  initializeScoutHelpPage();
}


/* =========================================================
   BACKEND INTEGRATION NOTES
========================================================= */

/*
  Change:

  useMockData: false


  POST /api/v1/scout/support

  Multipart form-data:

  category
  priority
  subject
  message
  attachment


  POST /api/v1/scout/help/feedback

  JSON body:

  {
    "helpful": true,
    "page": "scout-help"
  }


  POST /api/v1/auth/logout
*/


/* =========================================================
   END OF SCOUT-HELP.JS
========================================================= */