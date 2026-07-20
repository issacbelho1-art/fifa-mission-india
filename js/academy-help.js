/* =========================================================
   ACADEMY HELP & SUPPORT
   FIFA MISSION INDIA

   Frontend-only interaction file.

   Backend integration points are included at the bottom
   for Mr. Harsh to connect later.
========================================================= */

"use strict";

/* =========================================================
   DOM REFERENCES
========================================================= */

const academySidebar = document.getElementById("academySidebar");
const academySidebarToggle = document.getElementById(
  "academySidebarToggle"
);
const academySidebarClose = document.getElementById(
  "academySidebarClose"
);
const academySidebarOverlay = document.getElementById(
  "academySidebarOverlay"
);

const academyProfileTrigger = document.getElementById(
  "academyProfileTrigger"
);
const academyProfileDropdown = document.getElementById(
  "academyProfileDropdown"
);

const academyHelpSearch = document.getElementById(
  "academyHelpSearch"
);
const academySearchButton = document.getElementById(
  "academySearchButton"
);

const academySupportForm = document.getElementById(
  "academySupportForm"
);
const supportName = document.getElementById("supportName");
const supportEmail = document.getElementById("supportEmail");
const supportSubject = document.getElementById("supportSubject");
const supportPriority = document.getElementById("supportPriority");
const supportMessage = document.getElementById("supportMessage");
const supportAttachment = document.getElementById(
  "supportAttachment"
);

const academyLogoutButton = document.getElementById(
  "academyLogoutButton"
);
const academyLogoutModal = document.getElementById(
  "academyLogoutModal"
);
const academyConfirmLogout = document.getElementById(
  "academyConfirmLogout"
);

const academyToastContainer = document.getElementById(
  "academyToastContainer"
);

const faqItems = Array.from(
  document.querySelectorAll(".academy-faq-item")
);

const knowledgeCards = Array.from(
  document.querySelectorAll(".academy-knowledge-card")
);

const quickHelpCards = Array.from(
  document.querySelectorAll(".academy-help-card")
);

const resourceButtons = Array.from(
  document.querySelectorAll(
    ".academy-button-grid .academy-secondary-button"
  )
);

/* =========================================================
   APP STATE
========================================================= */

const AcademyHelpState = {
  sidebarOpen: false,
  profileDropdownOpen: false,
  logoutModalOpen: false,
  activeSearchTerm: "",
  submittingTicket: false
};

/* =========================================================
   GENERAL HELPERS
========================================================= */

function isMobileViewport() {
  return window.matchMedia("(max-width: 991px)").matches;
}

function normalizeText(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}

function escapeHTML(value) {
  const element = document.createElement("div");
  element.textContent = String(value || "");
  return element.innerHTML;
}

function debounce(callback, delay = 250) {
  let timeoutId;

  return (...args) => {
    window.clearTimeout(timeoutId);

    timeoutId = window.setTimeout(() => {
      callback(...args);
    }, delay);
  };
}

function generateTicketId() {
  const randomNumber = Math.floor(1000 + Math.random() * 9000);
  return `SUP-${randomNumber}`;
}

function formatCurrentDate() {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  }).format(new Date());
}

/* =========================================================
   TOAST NOTIFICATIONS
========================================================= */

function showAcademyToast(
  message,
  type = "success",
  duration = 3500
) {
  if (!academyToastContainer) {
    return;
  }

  const toast = document.createElement("div");
  toast.className = `academy-toast ${type}`;
  toast.setAttribute("role", "status");
  toast.setAttribute("aria-live", "polite");

  const iconMap = {
    success: "fa-circle-check",
    error: "fa-circle-exclamation",
    warning: "fa-triangle-exclamation",
    info: "fa-circle-info"
  };

  const icon = iconMap[type] || iconMap.info;

  toast.innerHTML = `
    <i class="fa-solid ${icon}" aria-hidden="true"></i>

    <div>
      <strong>${escapeHTML(
        type.charAt(0).toUpperCase() + type.slice(1)
      )}</strong>

      <p>${escapeHTML(message)}</p>
    </div>
  `;

  academyToastContainer.appendChild(toast);

  window.setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateX(20px)";

    window.setTimeout(() => {
      toast.remove();
    }, 250);
  }, duration);
}

/* =========================================================
   SIDEBAR
========================================================= */

function openAcademySidebar() {
  if (!academySidebar) {
    return;
  }

  academySidebar.classList.add("open");
  AcademyHelpState.sidebarOpen = true;

  if (academySidebarOverlay) {
    academySidebarOverlay.hidden = false;
  }

  document.body.style.overflow = "hidden";

  academySidebarClose?.focus();
}

function closeAcademySidebar() {
  if (!academySidebar) {
    return;
  }

  academySidebar.classList.remove("open");
  AcademyHelpState.sidebarOpen = false;

  if (academySidebarOverlay) {
    academySidebarOverlay.hidden = true;
  }

  document.body.style.overflow = "";

  if (isMobileViewport()) {
    academySidebarToggle?.focus();
  }
}

function toggleAcademySidebar() {
  if (AcademyHelpState.sidebarOpen) {
    closeAcademySidebar();
    return;
  }

  openAcademySidebar();
}

academySidebarToggle?.addEventListener(
  "click",
  toggleAcademySidebar
);

academySidebarClose?.addEventListener(
  "click",
  closeAcademySidebar
);

academySidebarOverlay?.addEventListener(
  "click",
  closeAcademySidebar
);

/* =========================================================
   PROFILE DROPDOWN
========================================================= */

function openProfileDropdown() {
  if (!academyProfileDropdown || !academyProfileTrigger) {
    return;
  }

  academyProfileDropdown.hidden = false;
  AcademyHelpState.profileDropdownOpen = true;

  academyProfileTrigger.setAttribute("aria-expanded", "true");
}

function closeProfileDropdown() {
  if (!academyProfileDropdown || !academyProfileTrigger) {
    return;
  }

  academyProfileDropdown.hidden = true;
  AcademyHelpState.profileDropdownOpen = false;

  academyProfileTrigger.setAttribute("aria-expanded", "false");
}

function toggleProfileDropdown() {
  if (AcademyHelpState.profileDropdownOpen) {
    closeProfileDropdown();
    return;
  }

  openProfileDropdown();
}

academyProfileTrigger?.setAttribute("role", "button");
academyProfileTrigger?.setAttribute("tabindex", "0");
academyProfileTrigger?.setAttribute("aria-haspopup", "menu");
academyProfileTrigger?.setAttribute("aria-expanded", "false");

academyProfileTrigger?.addEventListener(
  "click",
  toggleProfileDropdown
);

academyProfileTrigger?.addEventListener(
  "keydown",
  (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      toggleProfileDropdown();
    }
  }
);

document.addEventListener("click", (event) => {
  if (
    AcademyHelpState.profileDropdownOpen &&
    !academyProfileTrigger?.contains(event.target) &&
    !academyProfileDropdown?.contains(event.target)
  ) {
    closeProfileDropdown();
  }
});

/* =========================================================
   FAQ ACCORDION
========================================================= */

function closeFAQItem(item) {
  const question = item.querySelector(".academy-faq-question");
  const answer = item.querySelector(".academy-faq-answer");

  item.classList.remove("active");

  question?.setAttribute("aria-expanded", "false");

  if (answer) {
    answer.hidden = true;
  }
}

function openFAQItem(item) {
  const question = item.querySelector(".academy-faq-question");
  const answer = item.querySelector(".academy-faq-answer");

  item.classList.add("active");

  question?.setAttribute("aria-expanded", "true");

  if (answer) {
    answer.hidden = false;
  }
}

function initializeFAQAccordion() {
  faqItems.forEach((item, index) => {
    const question = item.querySelector(
      ".academy-faq-question"
    );

    const answer = item.querySelector(".academy-faq-answer");

    if (!question || !answer) {
      return;
    }

    const questionId = `academyFaqQuestion${index + 1}`;
    const answerId = `academyFaqAnswer${index + 1}`;

    question.id = questionId;
    answer.id = answerId;

    question.setAttribute("aria-controls", answerId);
    answer.setAttribute("aria-labelledby", questionId);

    const initiallyActive = item.classList.contains("active");

    question.setAttribute(
      "aria-expanded",
      String(initiallyActive)
    );

    answer.hidden = !initiallyActive;

    question.addEventListener("click", () => {
      const isActive = item.classList.contains("active");

      faqItems.forEach((faqItem) => {
        if (faqItem !== item) {
          closeFAQItem(faqItem);
        }
      });

      if (isActive) {
        closeFAQItem(item);
      } else {
        openFAQItem(item);
      }
    });
  });
}

/* =========================================================
   HELP SEARCH
========================================================= */

function getSearchableElements() {
  return [
    ...quickHelpCards,
    ...knowledgeCards,
    ...faqItems
  ];
}

function clearSearchHighlights() {
  getSearchableElements().forEach((element) => {
    element.style.display = "";
    element.classList.remove("academy-search-match");
  });
}

function searchHelpContent() {
  const searchTerm = normalizeText(academyHelpSearch?.value);

  AcademyHelpState.activeSearchTerm = searchTerm;

  if (!searchTerm) {
    clearSearchHighlights();

    showAcademyToast(
      "Enter a keyword to search the Help Center.",
      "info"
    );

    return;
  }

  let matchCount = 0;
  let firstMatch = null;

  getSearchableElements().forEach((element) => {
    const searchableText = normalizeText(element.textContent);
    const isMatch = searchableText.includes(searchTerm);

    element.style.display = isMatch ? "" : "none";
    element.classList.toggle(
      "academy-search-match",
      isMatch
    );

    if (isMatch) {
      matchCount += 1;

      if (!firstMatch) {
        firstMatch = element;
      }

      if (element.classList.contains("academy-faq-item")) {
        openFAQItem(element);
      }
    }
  });

  if (matchCount === 0) {
    clearSearchHighlights();

    showAcademyToast(
      `No help articles were found for “${searchTerm}”.`,
      "warning",
      4500
    );

    return;
  }

  firstMatch?.scrollIntoView({
    behavior: "smooth",
    block: "center"
  });

  showAcademyToast(
    `${matchCount} matching help ${
      matchCount === 1 ? "item" : "items"
    } found.`,
    "success"
  );
}

const liveHelpSearch = debounce(() => {
  const searchTerm = normalizeText(academyHelpSearch?.value);

  if (!searchTerm) {
    clearSearchHighlights();
  }
}, 200);

academySearchButton?.addEventListener(
  "click",
  searchHelpContent
);

academyHelpSearch?.addEventListener("input", liveHelpSearch);

academyHelpSearch?.addEventListener(
  "keydown",
  (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      searchHelpContent();
    }

    if (event.key === "Escape") {
      academyHelpSearch.value = "";
      clearSearchHighlights();
      academyHelpSearch.blur();
    }
  }
);

/* =========================================================
   QUICK HELP CARD ACTIONS
========================================================= */

function scrollToSectionByEyebrow(label) {
  const headings = Array.from(
    document.querySelectorAll(".academy-section-eyebrow")
  );

  const targetEyebrow = headings.find(
    (heading) =>
      normalizeText(heading.textContent) ===
      normalizeText(label)
  );

  const targetSection = targetEyebrow?.closest(
    ".academy-help-section"
  );

  if (!targetSection) {
    return false;
  }

  targetSection.scrollIntoView({
    behavior: "smooth",
    block: "start"
  });

  return true;
}

quickHelpCards.forEach((card) => {
  const heading = normalizeText(
    card.querySelector("h3")?.textContent
  );

  const button = card.querySelector("button");

  if (!button) {
    return;
  }

  button.addEventListener("click", () => {
    if (heading.includes("frequently asked")) {
      scrollToSectionByEyebrow("FAQ");
      return;
    }

    if (heading.includes("documentation")) {
      showAcademyToast(
        "Platform documentation will be connected by the backend team.",
        "info"
      );
      return;
    }

    if (heading.includes("video tutorials")) {
      showAcademyToast(
        "Video tutorials will be available soon.",
        "info"
      );
      return;
    }

    if (heading.includes("community forum")) {
      showAcademyToast(
        "The Academy Community Forum is coming soon.",
        "info"
      );
    }
  });
});

/* =========================================================
   KNOWLEDGE CARDS
========================================================= */

knowledgeCards.forEach((card) => {
  card.setAttribute("tabindex", "0");
  card.setAttribute("role", "button");

  function openKnowledgeCategory() {
    const category =
      card.querySelector("h3")?.textContent?.trim() ||
      "Help category";

    academyHelpSearch?.focus();

    if (academyHelpSearch) {
      academyHelpSearch.value = category;
    }

    searchHelpContent();
  }

  card.addEventListener("click", openKnowledgeCategory);

  card.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openKnowledgeCategory();
    }
  });
});

/* =========================================================
   RESOURCE BUTTONS
========================================================= */

resourceButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const resourceName =
      button.textContent.trim().replace(/\s+/g, " ");

    showAcademyToast(
      `${resourceName} will be connected when the resource links are available.`,
      "info"
    );
  });
});

/* =========================================================
   SUPPORT FORM VALIDATION
========================================================= */

function setFieldInvalid(field, message) {
  if (!field) {
    return;
  }

  field.setAttribute("aria-invalid", "true");
  field.style.borderColor = "var(--academy-danger)";

  field.setCustomValidity(message);
}

function clearFieldInvalid(field) {
  if (!field) {
    return;
  }

  field.removeAttribute("aria-invalid");
  field.style.borderColor = "";
  field.setCustomValidity("");
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validateSupportForm() {
  let isValid = true;
  let firstInvalidField = null;

  const nameValue = supportName?.value.trim() || "";
  const emailValue = supportEmail?.value.trim() || "";
  const subjectValue = supportSubject?.value.trim() || "";
  const messageValue = supportMessage?.value.trim() || "";

  [
    supportName,
    supportEmail,
    supportSubject,
    supportMessage,
    supportAttachment
  ].forEach(clearFieldInvalid);

  if (nameValue.length < 2) {
    setFieldInvalid(
      supportName,
      "Please enter your full name."
    );

    firstInvalidField ||= supportName;
    isValid = false;
  }

  if (!validateEmail(emailValue)) {
    setFieldInvalid(
      supportEmail,
      "Please enter a valid email address."
    );

    firstInvalidField ||= supportEmail;
    isValid = false;
  }

  if (subjectValue.length < 5) {
    setFieldInvalid(
      supportSubject,
      "The subject must contain at least 5 characters."
    );

    firstInvalidField ||= supportSubject;
    isValid = false;
  }

  if (messageValue.length < 20) {
    setFieldInvalid(
      supportMessage,
      "Please describe the issue using at least 20 characters."
    );

    firstInvalidField ||= supportMessage;
    isValid = false;
  }

  if (supportAttachment?.files?.length) {
    const file = supportAttachment.files[0];

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ];

    const maximumSize = 5 * 1024 * 1024;

    if (!allowedTypes.includes(file.type)) {
      setFieldInvalid(
        supportAttachment,
        "Only JPG, PNG, PDF, DOC and DOCX files are allowed."
      );

      firstInvalidField ||= supportAttachment;
      isValid = false;
    }

    if (file.size > maximumSize) {
      setFieldInvalid(
        supportAttachment,
        "The attachment must be smaller than 5 MB."
      );

      firstInvalidField ||= supportAttachment;
      isValid = false;
    }
  }

  if (!isValid) {
    firstInvalidField?.focus();

    showAcademyToast(
      "Please correct the highlighted fields.",
      "error"
    );
  }

  return isValid;
}

[
  supportName,
  supportEmail,
  supportSubject,
  supportMessage,
  supportAttachment
].forEach((field) => {
  field?.addEventListener("input", () => {
    clearFieldInvalid(field);
  });

  field?.addEventListener("change", () => {
    clearFieldInvalid(field);
  });
});

/* =========================================================
   SUPPORT TICKET LOCAL DEMO
========================================================= */

function saveTicketLocally(ticket) {
  try {
    const existingTickets = JSON.parse(
      localStorage.getItem("academySupportTickets") || "[]"
    );

    existingTickets.unshift(ticket);

    localStorage.setItem(
      "academySupportTickets",
      JSON.stringify(existingTickets)
    );
  } catch (error) {
    console.warn(
      "Unable to save the support ticket locally:",
      error
    );
  }
}

function getPriorityBadgeClass(priority) {
  const normalizedPriority = normalizeText(priority);

  if (
    normalizedPriority === "high" ||
    normalizedPriority === "critical"
  ) {
    return "danger";
  }

  if (normalizedPriority === "medium") {
    return "warning";
  }

  return "";
}

function addTicketToTable(ticket) {
  const tableBody = document.querySelector(
    ".academy-simple-table tbody"
  );

  if (!tableBody) {
    return;
  }

  const row = document.createElement("tr");

  row.innerHTML = `
    <td>#${escapeHTML(ticket.id)}</td>

    <td>${escapeHTML(ticket.subject)}</td>

    <td>
      <span class="academy-badge ${getPriorityBadgeClass(
        ticket.priority
      )}">
        ${escapeHTML(ticket.priority)}
      </span>
    </td>

    <td>
      <span class="academy-badge pending">
        Open
      </span>
    </td>

    <td>Just Now</td>
  `;

  tableBody.prepend(row);
}

function setFormSubmitting(isSubmitting) {
  AcademyHelpState.submittingTicket = isSubmitting;

  const submitButton = academySupportForm?.querySelector(
    'button[type="submit"]'
  );

  if (!submitButton) {
    return;
  }

  submitButton.disabled = isSubmitting;

  submitButton.innerHTML = isSubmitting
    ? `
      <i class="fa-solid fa-spinner fa-spin"></i>
      Submitting...
    `
    : `
      <i class="fa-solid fa-paper-plane"></i>
      Submit Ticket
    `;
}

async function handleSupportFormSubmission(event) {
  event.preventDefault();

  if (
    AcademyHelpState.submittingTicket ||
    !validateSupportForm()
  ) {
    return;
  }

  setFormSubmitting(true);

  const ticket = {
    id: generateTicketId(),
    name: supportName.value.trim(),
    email: supportEmail.value.trim(),
    subject: supportSubject.value.trim(),
    priority: supportPriority.value,
    message: supportMessage.value.trim(),
    attachmentName:
      supportAttachment.files[0]?.name || null,
    status: "Open",
    createdAt: new Date().toISOString(),
    displayDate: formatCurrentDate()
  };

  try {
    /*
      FRONTEND DEMO DELAY

      Replace this delay with:

      await AcademyHelpAPI.createTicket(ticket);

      when Mr. Harsh connects the backend.
    */

    await new Promise((resolve) => {
      window.setTimeout(resolve, 900);
    });

    saveTicketLocally(ticket);
    addTicketToTable(ticket);

    academySupportForm.reset();

    showAcademyToast(
      `Ticket #${ticket.id} was submitted successfully.`,
      "success",
      5000
    );

    document
      .querySelector(".academy-simple-table")
      ?.scrollIntoView({
        behavior: "smooth",
        block: "center"
      });
  } catch (error) {
    console.error("Support ticket submission failed:", error);

    showAcademyToast(
      "The support ticket could not be submitted. Please try again.",
      "error"
    );
  } finally {
    setFormSubmitting(false);
  }
}

academySupportForm?.addEventListener(
  "submit",
  handleSupportFormSubmission
);

/* =========================================================
   ATTACHMENT PREVIEW FEEDBACK
========================================================= */

supportAttachment?.addEventListener("change", () => {
  const file = supportAttachment.files[0];

  if (!file) {
    return;
  }

  const fileSizeInMB = file.size / (1024 * 1024);

  if (fileSizeInMB > 5) {
    showAcademyToast(
      "The selected attachment exceeds the 5 MB limit.",
      "warning"
    );

    return;
  }

  showAcademyToast(
    `${file.name} selected successfully.`,
    "info"
  );
});

/* =========================================================
   LOGOUT MODAL
========================================================= */

function openLogoutModal() {
  if (!academyLogoutModal) {
    return;
  }

  closeProfileDropdown();

  academyLogoutModal.hidden = false;
  AcademyHelpState.logoutModalOpen = true;

  document.body.style.overflow = "hidden";

  academyConfirmLogout?.focus();
}

function closeLogoutModal() {
  if (!academyLogoutModal) {
    return;
  }

  academyLogoutModal.hidden = true;
  AcademyHelpState.logoutModalOpen = false;

  document.body.style.overflow = "";

  academyLogoutButton?.focus();
}

academyLogoutButton?.addEventListener(
  "click",
  openLogoutModal
);

document
  .querySelectorAll("[data-close-logout]")
  .forEach((button) => {
    button.addEventListener("click", closeLogoutModal);
  });

academyLogoutModal?.addEventListener("click", (event) => {
  if (event.target === academyLogoutModal) {
    closeLogoutModal();
  }
});

academyConfirmLogout?.addEventListener("click", () => {
  showAcademyToast(
    "Logout successful. Redirecting...",
    "success"
  );

  /*
    BACKEND AUTH PLACEHOLDER

    Mr. Harsh can replace the timeout with:

    await AcademyHelpAPI.logout();
  */

  window.setTimeout(() => {
    window.location.href = "login.html";
  }, 1000);
});

/* =========================================================
   KEYBOARD CONTROLS
========================================================= */

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    if (AcademyHelpState.logoutModalOpen) {
      closeLogoutModal();
      return;
    }

    if (AcademyHelpState.profileDropdownOpen) {
      closeProfileDropdown();
      return;
    }

    if (AcademyHelpState.sidebarOpen) {
      closeAcademySidebar();
    }
  }

  const target = event.target;
  const isTyping =
    target instanceof HTMLInputElement ||
    target instanceof HTMLTextAreaElement ||
    target instanceof HTMLSelectElement;

  if (
    event.key === "/" &&
    !isTyping &&
    academyHelpSearch
  ) {
    event.preventDefault();
    academyHelpSearch.focus();
  }
});

/* =========================================================
   WINDOW RESIZE
========================================================= */

window.addEventListener(
  "resize",
  debounce(() => {
    if (!isMobileViewport() && AcademyHelpState.sidebarOpen) {
      closeAcademySidebar();
    }
  }, 150)
);

/* =========================================================
   ACTIVE SIDEBAR LINK
========================================================= */

function setActiveSidebarLink() {
  const currentPage =
    window.location.pathname.split("/").pop() ||
    "academy-help.html";

  const sidebarLinks = Array.from(
    document.querySelectorAll(".academy-sidebar nav a")
  );

  sidebarLinks.forEach((link) => {
    const linkPage = link
      .getAttribute("href")
      ?.split("/")
      .pop();

    link.classList.toggle(
      "active",
      linkPage === currentPage
    );
  });
}

/* =========================================================
   LOCAL TICKET RESTORATION
========================================================= */

function restoreLocalTickets() {
  let tickets = [];

  try {
    tickets = JSON.parse(
      localStorage.getItem("academySupportTickets") || "[]"
    );
  } catch (error) {
    console.warn(
      "Unable to restore locally saved support tickets:",
      error
    );

    return;
  }

  if (!Array.isArray(tickets)) {
    return;
  }

  tickets
    .slice(0, 5)
    .reverse()
    .forEach((ticket) => {
      addTicketToTable(ticket);
    });
}

/* =========================================================
   INITIALIZATION
========================================================= */

function initializeAcademyHelpPage() {
  initializeFAQAccordion();
  setActiveSidebarLink();
  restoreLocalTickets();

  if (academySidebarOverlay) {
    academySidebarOverlay.hidden = true;
  }

  if (academyProfileDropdown) {
    academyProfileDropdown.hidden = true;
  }

  if (academyLogoutModal) {
    academyLogoutModal.hidden = true;
  }

  console.info(
    "FIFA Mission India Academy Help & Support initialized."
  );
}

if (document.readyState === "loading") {
  document.addEventListener(
    "DOMContentLoaded",
    initializeAcademyHelpPage
  );
} else {
  initializeAcademyHelpPage();
}

/* =========================================================
   BACKEND API PLACEHOLDERS
   FOR MR. HARSH
========================================================= */

class AcademyHelpAPI {
  static baseURL = "/api/support";

  static async request(endpoint, options = {}) {
    const response = await fetch(
      `${this.baseURL}${endpoint}`,
      {
        headers: {
          "Content-Type": "application/json",
          ...options.headers
        },
        credentials: "include",
        ...options
      }
    );

    if (!response.ok) {
      const errorMessage =
        `Request failed with status ${response.status}`;

      throw new Error(errorMessage);
    }

    const contentType =
      response.headers.get("content-type") || "";

    if (contentType.includes("application/json")) {
      return response.json();
    }

    return response.text();
  }

  static async getArticles(searchTerm = "") {
    const params = new URLSearchParams();

    if (searchTerm) {
      params.set("search", searchTerm);
    }

    const queryString = params.toString();

    return this.request(
      `/articles${queryString ? `?${queryString}` : ""}`
    );
  }

  static async getFAQs() {
    return this.request("/faqs");
  }

  static async getTickets() {
    return this.request("/tickets");
  }

  static async createTicket(ticketData) {
    return this.request("/ticket", {
      method: "POST",
      body: JSON.stringify(ticketData)
    });
  }

  static async uploadAttachment(file) {
    const formData = new FormData();
    formData.append("attachment", file);

    const response = await fetch(
      `${this.baseURL}/upload`,
      {
        method: "POST",
        credentials: "include",
        body: formData
      }
    );

    if (!response.ok) {
      throw new Error(
        `Attachment upload failed with status ${response.status}`
      );
    }

    return response.json();
  }

  static async getPlatformStatus() {
    return this.request("/status");
  }

  static async getResources() {
    return this.request("/resources");
  }

  static async logout() {
    const response = await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include"
    });

    if (!response.ok) {
      throw new Error("Logout request failed.");
    }

    return response.json();
  }
}

/* =========================================================
   BACKEND ENDPOINT REFERENCE

   GET    /api/support/articles
   GET    /api/support/faqs
   GET    /api/support/tickets
   POST   /api/support/ticket
   POST   /api/support/upload
   GET    /api/support/status
   GET    /api/support/resources

   Authentication:

   POST   /api/auth/logout
========================================================= */