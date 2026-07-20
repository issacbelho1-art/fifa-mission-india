"use strict";

/* =========================================================
   SCOUT-PROFILE.JS
   PART 1
   CONFIGURATION, STATE, DOM CACHE, UTILITIES,
   API HELPER, NOTIFICATIONS, SIDEBAR,
   MODALS, MOCK DATA AND PROFILE LOADING
========================================================= */


/* =========================================================
   CONFIGURATION
========================================================= */

const SCOUT_PROFILE_CONFIG = Object.freeze({
  apiBaseUrl: "/api/v1",
  profileEndpoint: "/scout/profile",
  passwordEndpoint: "/scout/account/password",
  twoFactorEndpoint: "/scout/account/two-factor",
  sessionsEndpoint: "/scout/account/sessions",
  logoutEndpoint: "/auth/logout",
  requestTimeout: 12000,
  toastDuration: 4200,
  mockDelay: 650,
  maximumProfileImageSize: 5 * 1024 * 1024,
  maximumCoverImageSize: 8 * 1024 * 1024,
  allowedImageTypes: [
    "image/jpeg",
    "image/png",
    "image/webp"
  ],
  useMockData: true
});


/* =========================================================
   APPLICATION STATE
========================================================= */

const scoutProfileState = {
  profile: null,
  originalProfile: null,
  additionalRegions: [],
  originalAdditionalRegions: [],
  editMode: false,
  loading: false,
  saving: false,
  dirty: false,
  profileImageFile: null,
  coverImageFile: null,
  profileImagePreviewUrl: null,
  coverImagePreviewUrl: null,
  activeModal: null,
  modalTrigger: null,
  abortController: null
};


/* =========================================================
   DOM CACHE
========================================================= */

const scoutProfileDOM = {
  body: document.body,

  appShell:
    document.getElementById("scoutAppShell"),

  sidebar:
    document.getElementById("scoutSidebar"),

  sidebarOverlay:
    document.getElementById("scoutSidebarOverlay"),

  sidebarClose:
    document.getElementById("scoutSidebarClose"),

  menuButton:
    document.getElementById("scoutMenuButton"),

  loadingState:
    document.getElementById("scoutProfileLoadingState"),

  errorState:
    document.getElementById("scoutProfileErrorState"),

  errorMessage:
    document.getElementById("scoutProfileErrorMessage"),

  retryButton:
    document.getElementById("retryScoutProfileButton"),

  profileContent:
    document.getElementById("scoutProfileContent"),

  profileForm:
    document.getElementById("scoutProfileForm"),

  editProfileButton:
    document.getElementById("editProfileButton"),

  cancelProfileChangesButton:
    document.getElementById("cancelProfileChangesButton"),

  resetProfileFormButton:
    document.getElementById("resetProfileFormButton"),

  saveProfileButton:
    document.getElementById("saveProfileButton"),

  saveActions:
    document.getElementById("scoutProfileSaveActions"),

  profileCoverImage:
    document.getElementById("scoutProfileCoverImage"),

  coverUploadLabel:
    document.getElementById("scoutCoverUploadLabel"),

  coverUploadInput:
    document.getElementById("scoutCoverUploadInput"),

  profileMainImage:
    document.getElementById("scoutProfileMainImage"),

  photoUploadLabel:
    document.getElementById("scoutPhotoUploadLabel"),

  photoUploadInput:
    document.getElementById("scoutPhotoUploadInput"),

  displayName:
    document.getElementById("scoutProfileDisplayName"),

  displayDesignation:
    document.getElementById("scoutProfileDisplayDesignation"),

  displayOrganization:
    document.getElementById("scoutProfileDisplayOrganization"),

  displayRegion:
    document.getElementById("scoutProfileDisplayRegion"),

  memberSince:
    document.getElementById("scoutProfileMemberSince"),

  verificationBadge:
    document.getElementById("scoutProfileVerificationBadge"),

  completionValue:
    document.getElementById("scoutProfileCompletionValue"),

  completionTrack:
    document.getElementById("scoutProfileCompletionTrack"),

  completionBar:
    document.getElementById("scoutProfileCompletionBar"),

  completionMessage:
    document.getElementById("scoutProfileCompletionMessage"),

  reportsCount:
    document.getElementById("scoutProfileReportsCount"),

  playersCount:
    document.getElementById("scoutProfilePlayersCount"),

  matchesCount:
    document.getElementById("scoutProfileMatchesCount"),

  experienceDisplay:
    document.getElementById("scoutProfileExperienceDisplay"),

  firstName:
    document.getElementById("scoutFirstName"),

  lastName:
    document.getElementById("scoutLastName"),

  email:
    document.getElementById("scoutEmail"),

  phone:
    document.getElementById("scoutPhone"),

  dateOfBirth:
    document.getElementById("scoutDateOfBirth"),

  gender:
    document.getElementById("scoutGender"),

  nationality:
    document.getElementById("scoutNationality"),

  languages:
    document.getElementById("scoutLanguages"),

  designation:
    document.getElementById("scoutDesignation"),

  organization:
    document.getElementById("scoutOrganization"),

  licenseNumber:
    document.getElementById("scoutLicenseNumber"),

  experienceYears:
    document.getElementById("scoutExperienceYears"),

  qualifications:
    document.getElementById("scoutQualifications"),

  qualificationsCharacterCount:
    document.getElementById(
      "scoutQualificationsCharacterCount"
    ),

  biography:
    document.getElementById("scoutBiography"),

  biographyCharacterCount:
    document.getElementById(
      "scoutBiographyCharacterCount"
    ),

  country:
    document.getElementById("scoutCountry"),

  state:
    document.getElementById("scoutState"),

  city:
    document.getElementById("scoutCity"),

  travelAvailability:
    document.getElementById("scoutTravelAvailability"),

  selectedRegions:
    document.getElementById("scoutSelectedRegions"),

  regionInputControls:
    document.getElementById("scoutRegionInputControls"),

  additionalRegionInput:
    document.getElementById("scoutAdditionalRegionInput"),

  addRegionButton:
    document.getElementById("addScoutRegionButton"),

  ageGroupFieldset:
    document.getElementById("scoutAgeGroupFieldset"),

  positionFieldset:
    document.getElementById("scoutPositionFieldset"),

  ageGroupCheckboxes: Array.from(
    document.querySelectorAll(
      'input[name="preferredAgeGroups"]'
    )
  ),

  positionCheckboxes: Array.from(
    document.querySelectorAll(
      'input[name="preferredPositions"]'
    )
  ),

  linkedIn:
    document.getElementById("scoutLinkedIn"),

  website:
    document.getElementById("scoutWebsite"),

  instagram:
    document.getElementById("scoutInstagram"),

  xProfile:
    document.getElementById("scoutXProfile"),

  changePasswordButton:
    document.getElementById("changePasswordButton"),

  twoFactorButton:
    document.getElementById("twoFactorButton"),

  viewSessionsButton:
    document.getElementById("viewSessionsButton"),

  changePasswordModal:
    document.getElementById("changePasswordModal"),

  passwordModalCloseButtons: Array.from(
    document.querySelectorAll(
      "[data-password-modal-close]"
    )
  ),

  changePasswordForm:
    document.getElementById("changePasswordForm"),

  currentPassword:
    document.getElementById("currentPassword"),

  newPassword:
    document.getElementById("newPassword"),

  confirmNewPassword:
    document.getElementById("confirmNewPassword"),

  submitPasswordChangeButton:
    document.getElementById("submitPasswordChangeButton"),

  logoutButton:
    document.getElementById("scoutLogoutButton"),

  logoutModal:
    document.getElementById("scoutLogoutModal"),

  logoutModalCloseButtons: Array.from(
    document.querySelectorAll(
      "[data-logout-modal-close]"
    )
  ),

  confirmLogoutButton:
    document.getElementById("confirmScoutLogoutButton"),

  notificationButton:
    document.getElementById("scoutNotificationButton"),

  notificationBadge:
    document.getElementById("scoutNotificationBadge"),

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
  ),

  editableFields: Array.from(
    document.querySelectorAll(
      "#scoutProfileForm input, " +
      "#scoutProfileForm select, " +
      "#scoutProfileForm textarea"
    )
  ),

  fieldErrors: Array.from(
    document.querySelectorAll("[data-error-for]")
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


function deepClone(value) {
  return JSON.parse(
    JSON.stringify(value)
  );
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


function normalizeCommaSeparatedValue(value) {
  if (Array.isArray(value)) {
    return value
      .map((item) => String(item).trim())
      .filter(Boolean);
  }

  if (!isNonEmptyString(value)) {
    return [];
  }

  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}


function uniqueValues(values) {
  return Array.from(
    new Set(
      values
        .map((value) => String(value).trim())
        .filter(Boolean)
    )
  );
}


function delay(milliseconds) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, milliseconds);
  });
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


function setInputValue(element, value = "") {
  if (!element) {
    return;
  }

  element.value =
    value === null ||
    value === undefined
      ? ""
      : String(value);
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

  button.disabled = loading;
}


function createElement(
  tagName,
  className = "",
  textContent = ""
) {
  const element =
    document.createElement(tagName);

  if (className) {
    element.className = className;
  }

  if (textContent) {
    element.textContent = textContent;
  }

  return element;
}


function getFullName(profile) {
  return [
    profile.firstName,
    profile.lastName
  ]
    .filter(isNonEmptyString)
    .join(" ")
    .trim() || "Scout Name";
}


function getPrimaryRegion(profile) {
  return [
    profile.city,
    profile.state,
    profile.country
  ]
    .filter(isNonEmptyString)
    .join(", ") || "India";
}


function revokePreviewUrl(url) {
  if (
    isNonEmptyString(url) &&
    url.startsWith("blob:")
  ) {
    URL.revokeObjectURL(url);
  }
}


/* =========================================================
   API REQUEST HELPER
========================================================= */

async function scoutProfileApiRequest(
  endpoint,
  options = {}
) {
  const controller =
    new AbortController();

  const timeoutId =
    window.setTimeout(() => {
      controller.abort();
    }, SCOUT_PROFILE_CONFIG.requestTimeout);

  const headers = {
    Accept: "application/json",
    ...(options.headers || {})
  };

  const requestOptions = {
    method: options.method || "GET",
    credentials: "include",
    headers,
    signal:
      options.signal ||
      controller.signal
  };

  if (options.body instanceof FormData) {
    requestOptions.body = options.body;
  } else if (
    options.body !== undefined
  ) {
    requestOptions.headers[
      "Content-Type"
    ] = "application/json";

    requestOptions.body =
      typeof options.body === "string"
        ? options.body
        : JSON.stringify(options.body);
  }

  try {
    const response = await fetch(
      `${SCOUT_PROFILE_CONFIG.apiBaseUrl}${endpoint}`,
      requestOptions
    );

    let responseData = null;

    const contentType =
      response.headers.get(
        "content-type"
      ) || "";

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

function showScoutProfileNotification({
  title = "Notification",
  message = "",
  type = "info",
  duration =
    SCOUT_PROFILE_CONFIG.toastDuration
}) {
  if (
    !scoutProfileDOM.notificationRegion
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

  closeButton.type = "button";

  closeButton.setAttribute(
    "aria-label",
    "Dismiss notification"
  );

  toast.append(
    icon,
    content,
    closeButton
  );

  scoutProfileDOM
    .notificationRegion
    .append(toast);

  let removed = false;

  const removeToast = () => {
    if (removed) {
      return;
    }

    removed = true;

    toast.style.opacity = "0";
    toast.style.transform =
      "translateX(16px)";

    window.setTimeout(() => {
      toast.remove();
    }, 180);
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
  scoutProfileDOM.body.classList.add(
    "scout-sidebar-open"
  );

  scoutProfileDOM.menuButton?.setAttribute(
    "aria-expanded",
    "true"
  );

  scoutProfileDOM.sidebarOverlay?.setAttribute(
    "aria-hidden",
    "false"
  );

  scoutProfileDOM.sidebarClose?.focus();
}


function closeScoutSidebar({
  restoreFocus = true
} = {}) {
  scoutProfileDOM.body.classList.remove(
    "scout-sidebar-open"
  );

  scoutProfileDOM.menuButton?.setAttribute(
    "aria-expanded",
    "false"
  );

  scoutProfileDOM.sidebarOverlay?.setAttribute(
    "aria-hidden",
    "true"
  );

  if (restoreFocus) {
    scoutProfileDOM.menuButton?.focus();
  }
}


function initializeScoutSidebar() {
  scoutProfileDOM.menuButton?.addEventListener(
    "click",
    openScoutSidebar
  );

  scoutProfileDOM.sidebarClose?.addEventListener(
    "click",
    () => {
      closeScoutSidebar();
    }
  );

  scoutProfileDOM.sidebarOverlay?.addEventListener(
    "click",
    () => {
      closeScoutSidebar();
    }
  );

  window.addEventListener(
    "resize",
    () => {
      if (window.innerWidth > 960) {
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


function openModal(
  modal,
  trigger = null
) {
  if (!modal) {
    return;
  }

  scoutProfileState.activeModal =
    modal;

  scoutProfileState.modalTrigger =
    trigger ||
    document.activeElement;

  modal.hidden = false;

  scoutProfileDOM.body.classList.add(
    "scout-modal-open"
  );

  const focusable =
    getFocusableElements(modal);

  window.requestAnimationFrame(() => {
    focusable[0]?.focus();
  });
}


function closeModal(modal) {
  if (!modal) {
    return;
  }

  modal.hidden = true;

  if (
    scoutProfileState.activeModal ===
    modal
  ) {
    scoutProfileState.activeModal =
      null;
  }

  const anyModalOpen = [
    scoutProfileDOM.changePasswordModal,
    scoutProfileDOM.logoutModal
  ].some((candidate) => {
    return (
      candidate &&
      !candidate.hidden
    );
  });

  if (!anyModalOpen) {
    scoutProfileDOM.body.classList.remove(
      "scout-modal-open"
    );
  }

  if (
    scoutProfileState.modalTrigger instanceof
    HTMLElement
  ) {
    scoutProfileState.modalTrigger.focus();
  }

  scoutProfileState.modalTrigger = null;
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
    getFocusableElements(modal);

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
    document.activeElement === first
  ) {
    event.preventDefault();
    last.focus();
    return;
  }

  if (
    !event.shiftKey &&
    document.activeElement === last
  ) {
    event.preventDefault();
    first.focus();
  }
}


/* =========================================================
   PROFILE PAGE STATES
========================================================= */

function setProfileLoadingState(isLoading) {
  scoutProfileState.loading =
    isLoading;

  if (scoutProfileDOM.loadingState) {
    scoutProfileDOM.loadingState.hidden =
      !isLoading;
  }

  if (isLoading) {
    if (scoutProfileDOM.errorState) {
      scoutProfileDOM.errorState.hidden =
        true;
    }

    if (scoutProfileDOM.profileContent) {
      scoutProfileDOM.profileContent.hidden =
        true;
    }
  }
}


function showProfileError(message) {
  setProfileLoadingState(false);

  if (scoutProfileDOM.errorMessage) {
    scoutProfileDOM.errorMessage.textContent =
      message ||
      "We were unable to retrieve your scout profile.";
  }

  if (scoutProfileDOM.errorState) {
    scoutProfileDOM.errorState.hidden =
      false;
  }

  if (scoutProfileDOM.profileContent) {
    scoutProfileDOM.profileContent.hidden =
      true;
  }
}


function showProfileContent() {
  setProfileLoadingState(false);

  if (scoutProfileDOM.errorState) {
    scoutProfileDOM.errorState.hidden =
      true;
  }

  if (scoutProfileDOM.profileContent) {
    scoutProfileDOM.profileContent.hidden =
      false;
  }
}


/* =========================================================
   MOCK PROFILE DATA
========================================================= */

function getMockScoutProfile() {
  return {
    id: "scout-001",

    firstName: "Arjun",
    lastName: "Mehta",

    email: "arjun.mehta@example.com",
    phone: "+91 98765 43210",

    dateOfBirth: "1990-04-18",
    gender: "male",
    nationality: "Indian",

    languages: [
      "English",
      "Hindi",
      "Punjabi"
    ],

    designation: "Senior Talent Scout",
    organization: "FIFA Mission India",

    licenseNumber: "FMI-SCOUT-2026-048",
    experienceYears: 9,

    qualifications:
      "AIFF D License\nYouth Talent Identification Certificate\nAdvanced Match Analysis Workshop",

    biography:
      "Football talent scout with extensive experience evaluating youth players across northern India. Focused on technical intelligence, player development potential and long-term national pathway suitability.",

    country: "India",
    state: "Punjab",
    city: "Mohali",

    travelAvailability: "national",

    additionalRegions: [
      "Haryana",
      "Delhi",
      "Himachal Pradesh"
    ],

    preferredAgeGroups: [
      "u12",
      "u15",
      "u17"
    ],

    preferredPositions: [
      "midfielder",
      "winger",
      "forward"
    ],

    linkedin:
      "https://linkedin.com/in/arjun-mehta",

    website:
      "https://example.com/arjun-scouting",

    instagram: "@arjunscouts",
    xProfile: "@arjunscouts",

    avatar:
      "images/scout-avatar-placeholder.jpg",

    coverImage:
      "images/scout-profile-cover-placeholder.jpg",

    verified: true,

    memberSince: "2025-09-14T00:00:00Z",

    profileCompletion: 92,

    statistics: {
      reportsCreated: 148,
      playersScouted: 386,
      matchesAttended: 112
    },

    account: {
      twoFactorEnabled: false,
      activeSessions: 3,
      unreadNotifications: 3
    }
  };
}


/* =========================================================
   PROFILE NORMALIZATION
========================================================= */

function normalizeScoutProfile(
  rawProfile = {}
) {
  const firstName =
    safeText(
      rawProfile.firstName,
      ""
    ).trim();

  const lastName =
    safeText(
      rawProfile.lastName,
      ""
    ).trim();

  return {
    id:
      rawProfile.id ||
      rawProfile.scoutId ||
      null,

    firstName,

    lastName,

    email:
      rawProfile.email ||
      "",

    phone:
      rawProfile.phone ||
      rawProfile.mobile ||
      "",

    dateOfBirth:
      rawProfile.dateOfBirth ||
      rawProfile.dob ||
      "",

    gender:
      rawProfile.gender ||
      "",

    nationality:
      rawProfile.nationality ||
      "Indian",

    languages:
      normalizeCommaSeparatedValue(
        rawProfile.languages
      ),

    designation:
      rawProfile.designation ||
      rawProfile.role ||
      "Talent Scout",

    organization:
      rawProfile.organization ||
      "FIFA Mission India",

    licenseNumber:
      rawProfile.licenseNumber ||
      rawProfile.scoutLicenseNumber ||
      "",

    experienceYears:
      clampNumber(
        rawProfile.experienceYears ??
        rawProfile.yearsOfExperience ??
        0,
        0,
        60
      ),

    qualifications:
      rawProfile.qualifications ||
      "",

    biography:
      rawProfile.biography ||
      rawProfile.about ||
      "",

    country:
      rawProfile.country ||
      "India",

    state:
      rawProfile.state ||
      "",

    city:
      rawProfile.city ||
      rawProfile.district ||
      "",

    travelAvailability:
      rawProfile.travelAvailability ||
      "",

    additionalRegions:
      uniqueValues(
        rawProfile.additionalRegions ||
        []
      ),

    preferredAgeGroups:
      uniqueValues(
        rawProfile.preferredAgeGroups ||
        []
      ),

    preferredPositions:
      uniqueValues(
        rawProfile.preferredPositions ||
        []
      ),

    linkedin:
      rawProfile.linkedin ||
      rawProfile.linkedIn ||
      "",

    website:
      rawProfile.website ||
      "",

    instagram:
      rawProfile.instagram ||
      "",

    xProfile:
      rawProfile.xProfile ||
      rawProfile.twitter ||
      "",

    avatar:
      rawProfile.avatar ||
      rawProfile.profileImage ||
      "images/scout-avatar-placeholder.jpg",

    coverImage:
      rawProfile.coverImage ||
      "images/scout-profile-cover-placeholder.jpg",

    verified:
      Boolean(rawProfile.verified),

    memberSince:
      rawProfile.memberSince ||
      rawProfile.createdAt ||
      null,

    profileCompletion:
      clampNumber(
        rawProfile.profileCompletion ??
        0,
        0,
        100
      ),

    statistics: {
      reportsCreated:
        Number(
          rawProfile.statistics
            ?.reportsCreated ??
          rawProfile.reportsCreated ??
          0
        ),

      playersScouted:
        Number(
          rawProfile.statistics
            ?.playersScouted ??
          rawProfile.playersScouted ??
          0
        ),

      matchesAttended:
        Number(
          rawProfile.statistics
            ?.matchesAttended ??
          rawProfile.matchesAttended ??
          0
        )
    },

    account: {
      twoFactorEnabled:
        Boolean(
          rawProfile.account
            ?.twoFactorEnabled ??
          rawProfile.twoFactorEnabled
        ),

      activeSessions:
        Number(
          rawProfile.account
            ?.activeSessions ??
          rawProfile.activeSessions ??
          0
        ),

      unreadNotifications:
        Number(
          rawProfile.account
            ?.unreadNotifications ??
          rawProfile.unreadNotifications ??
          0
        )
    }
  };
}


/* =========================================================
   PROFILE FETCHING
========================================================= */

async function fetchScoutProfile() {
  if (
    SCOUT_PROFILE_CONFIG.useMockData
  ) {
    await delay(
      SCOUT_PROFILE_CONFIG.mockDelay
    );

    return getMockScoutProfile();
  }

  return scoutProfileApiRequest(
    SCOUT_PROFILE_CONFIG.profileEndpoint
  );
}


async function loadScoutProfile() {
  if (
    scoutProfileState.abortController
  ) {
    scoutProfileState
      .abortController
      .abort();
  }

  scoutProfileState.abortController =
    new AbortController();

  setProfileLoadingState(true);

  try {
    const rawProfile =
      await fetchScoutProfile();

    const profile =
      normalizeScoutProfile(
        rawProfile
      );

    scoutProfileState.profile =
      profile;

    scoutProfileState.originalProfile =
      deepClone(profile);

    scoutProfileState.additionalRegions =
      [...profile.additionalRegions];

    scoutProfileState.originalAdditionalRegions =
      [...profile.additionalRegions];

    renderScoutProfile(profile);
    setProfileEditMode(false);
    showProfileContent();
  } catch (error) {
    if (
      error.name === "AbortError"
    ) {
      return;
    }

    console.error(
      "Unable to load scout profile:",
      error
    );

    showProfileError(
      error.message ||
      "Your scout profile could not be loaded."
    );
  }
}


/* =========================================================
   TOPBAR AND SIDEBAR PROFILE
========================================================= */

function renderGlobalScoutIdentity(
  profile
) {
  const fullName =
    getFullName(profile);

  scoutProfileDOM.scoutNameElements.forEach(
    (element) => {
      element.textContent = fullName;
    }
  );

  scoutProfileDOM
    .scoutDesignationElements
    .forEach((element) => {
      element.textContent =
        profile.designation;
    });

  scoutProfileDOM
    .scoutOrganizationElements
    .forEach((element) => {
      element.textContent =
        profile.organization;
    });

  scoutProfileDOM
    .scoutAvatarElements
    .forEach((element) => {
      element.src = profile.avatar;
      element.alt =
        `${fullName} profile`;
    });
}


/* =========================================================
   MAIN PROFILE RENDERING
========================================================= */

function renderScoutProfile(profile) {
  const fullName =
    getFullName(profile);

  document.title =
    `${fullName} | Scout Profile`;

  renderGlobalScoutIdentity(profile);

  if (
    scoutProfileDOM.profileCoverImage
  ) {
    scoutProfileDOM.profileCoverImage.src =
      profile.coverImage;
  }

  if (
    scoutProfileDOM.profileMainImage
  ) {
    scoutProfileDOM.profileMainImage.src =
      profile.avatar;

    scoutProfileDOM.profileMainImage.alt =
      `${fullName} profile`;
  }

  setText(
    scoutProfileDOM.displayName,
    fullName,
    "Scout Name"
  );

  setText(
    scoutProfileDOM.displayDesignation,
    profile.designation,
    "Talent Scout"
  );

  setText(
    scoutProfileDOM.displayOrganization,
    profile.organization,
    "FIFA Mission India"
  );

  setText(
    scoutProfileDOM.displayRegion,
    getPrimaryRegion(profile),
    "India"
  );

  setText(
    scoutProfileDOM.memberSince,
    formatDate(profile.memberSince)
  );

  if (
    scoutProfileDOM.verificationBadge
  ) {
    scoutProfileDOM.verificationBadge.hidden =
      !profile.verified;
  }

  setText(
    scoutProfileDOM.reportsCount,
    profile.statistics.reportsCreated,
    "0"
  );

  setText(
    scoutProfileDOM.playersCount,
    profile.statistics.playersScouted,
    "0"
  );

  setText(
    scoutProfileDOM.matchesCount,
    profile.statistics.matchesAttended,
    "0"
  );

  setText(
    scoutProfileDOM.experienceDisplay,
    profile.experienceYears > 0
      ? `${profile.experienceYears} years`
      : "New Scout"
  );

  renderProfileCompletion(profile);
  populateProfileForm(profile);
  renderAdditionalRegions();
  updateSecurityButtons(profile);
  updateNotificationBadge(profile);
}


/* =========================================================
   PROFILE COMPLETION
========================================================= */

function calculateProfileCompletion(
  profile
) {
  const fields = [
    profile.firstName,
    profile.lastName,
    profile.email,
    profile.phone,
    profile.dateOfBirth,
    profile.nationality,
    profile.designation,
    profile.organization,
    profile.experienceYears,
    profile.biography,
    profile.country,
    profile.state,
    profile.travelAvailability,
    profile.preferredAgeGroups.length,
    profile.preferredPositions.length,
    profile.avatar,
    profile.coverImage
  ];

  const completedFields =
    fields.filter((value) => {
      if (
        typeof value === "number"
      ) {
        return value > 0;
      }

      if (Array.isArray(value)) {
        return value.length > 0;
      }

      return Boolean(value);
    }).length;

  return Math.round(
    (
      completedFields /
      fields.length
    ) * 100
  );
}


function renderProfileCompletion(
  profile
) {
  const calculatedCompletion =
    calculateProfileCompletion(
      profile
    );

  const completion =
    profile.profileCompletion > 0
      ? profile.profileCompletion
      : calculatedCompletion;

  setText(
    scoutProfileDOM.completionValue,
    `${completion}%`,
    "0%"
  );

  if (
    scoutProfileDOM.completionBar
  ) {
    window.requestAnimationFrame(() => {
      scoutProfileDOM
        .completionBar
        .style.width =
        `${completion}%`;
    });
  }

  if (
    scoutProfileDOM.completionTrack
  ) {
    scoutProfileDOM
      .completionTrack
      .setAttribute(
        "aria-valuenow",
        String(completion)
      );
  }

  if (
    scoutProfileDOM.completionMessage
  ) {
    if (completion >= 100) {
      scoutProfileDOM
        .completionMessage
        .textContent =
        "Your scout profile is fully complete.";
    } else if (completion >= 80) {
      scoutProfileDOM
        .completionMessage
        .textContent =
        "Your profile is nearly complete.";
    } else if (completion >= 50) {
      scoutProfileDOM
        .completionMessage
        .textContent =
        "Add more professional details to strengthen your profile.";
    } else {
      scoutProfileDOM
        .completionMessage
        .textContent =
        "Complete your profile to improve scouting credibility.";
    }
  }
}


/* =========================================================
   FORM POPULATION
========================================================= */

function populateProfileForm(profile) {
  setInputValue(
    scoutProfileDOM.firstName,
    profile.firstName
  );

  setInputValue(
    scoutProfileDOM.lastName,
    profile.lastName
  );

  setInputValue(
    scoutProfileDOM.email,
    profile.email
  );

  setInputValue(
    scoutProfileDOM.phone,
    profile.phone
  );

  setInputValue(
    scoutProfileDOM.dateOfBirth,
    profile.dateOfBirth
  );

  setInputValue(
    scoutProfileDOM.gender,
    profile.gender
  );

  setInputValue(
    scoutProfileDOM.nationality,
    profile.nationality
  );

  setInputValue(
    scoutProfileDOM.languages,
    profile.languages.join(", ")
  );

  setInputValue(
    scoutProfileDOM.designation,
    profile.designation
  );

  setInputValue(
    scoutProfileDOM.organization,
    profile.organization
  );

  setInputValue(
    scoutProfileDOM.licenseNumber,
    profile.licenseNumber
  );

  setInputValue(
    scoutProfileDOM.experienceYears,
    profile.experienceYears
  );

  setInputValue(
    scoutProfileDOM.qualifications,
    profile.qualifications
  );

  setInputValue(
    scoutProfileDOM.biography,
    profile.biography
  );

  setInputValue(
    scoutProfileDOM.country,
    profile.country
  );

  setInputValue(
    scoutProfileDOM.state,
    profile.state
  );

  setInputValue(
    scoutProfileDOM.city,
    profile.city
  );

  setInputValue(
    scoutProfileDOM.travelAvailability,
    profile.travelAvailability
  );

  setInputValue(
    scoutProfileDOM.linkedIn,
    profile.linkedin
  );

  setInputValue(
    scoutProfileDOM.website,
    profile.website
  );

  setInputValue(
    scoutProfileDOM.instagram,
    profile.instagram
  );

  setInputValue(
    scoutProfileDOM.xProfile,
    profile.xProfile
  );

  setCheckboxValues(
    scoutProfileDOM.ageGroupCheckboxes,
    profile.preferredAgeGroups
  );

  setCheckboxValues(
    scoutProfileDOM.positionCheckboxes,
    profile.preferredPositions
  );

  updateCharacterCounters();
}


/* =========================================================
   CHECKBOX HELPERS
========================================================= */

function setCheckboxValues(
  checkboxes,
  selectedValues
) {
  const selectedSet =
    new Set(selectedValues);

  checkboxes.forEach((checkbox) => {
    checkbox.checked =
      selectedSet.has(
        checkbox.value
      );
  });
}


function getCheckedValues(
  checkboxes
) {
  return checkboxes
    .filter((checkbox) => {
      return checkbox.checked;
    })
    .map((checkbox) => {
      return checkbox.value;
    });
}


/* =========================================================
   CHARACTER COUNTERS
========================================================= */

function updateCharacterCounter(
  field,
  counter
) {
  if (
    !field ||
    !counter
  ) {
    return;
  }

  counter.textContent =
    String(field.value.length);
}


function updateCharacterCounters() {
  updateCharacterCounter(
    scoutProfileDOM.qualifications,
    scoutProfileDOM
      .qualificationsCharacterCount
  );

  updateCharacterCounter(
    scoutProfileDOM.biography,
    scoutProfileDOM
      .biographyCharacterCount
  );
}


/* =========================================================
   SECURITY DISPLAY
========================================================= */

function updateSecurityButtons(profile) {
  if (
    scoutProfileDOM.twoFactorButton
  ) {
    const enabled =
      profile.account
        .twoFactorEnabled;

    scoutProfileDOM
      .twoFactorButton
      .textContent =
      enabled
        ? "Disable"
        : "Enable";

    scoutProfileDOM
      .twoFactorButton
      .classList.toggle(
        "is-enabled",
        enabled
      );

    scoutProfileDOM
      .twoFactorButton
      .setAttribute(
        "aria-pressed",
        String(enabled)
      );
  }

  if (
    scoutProfileDOM.viewSessionsButton
  ) {
    const sessionCount =
      profile.account.activeSessions;

    scoutProfileDOM
      .viewSessionsButton
      .textContent =
      sessionCount > 0
        ? `View Sessions (${sessionCount})`
        : "View Sessions";
  }
}


/* =========================================================
   NOTIFICATION BADGE
========================================================= */

function updateNotificationBadge(
  profile
) {
  if (
    !scoutProfileDOM
      .notificationBadge
  ) {
    return;
  }

  const unreadCount =
    profile.account
      .unreadNotifications;

  scoutProfileDOM
    .notificationBadge
    .textContent =
    unreadCount > 99
      ? "99+"
      : String(unreadCount);

  scoutProfileDOM
    .notificationBadge
    .hidden =
    unreadCount <= 0;
}


/* =========================================================
   END OF SCOUT-PROFILE.JS — PART 1
   CONTINUE DIRECTLY WITH PART 2
========================================================= */

/* =========================================================
   SCOUT-PROFILE.JS
   PART 2
   EDIT MODE, REGIONS, VALIDATION, IMAGE PREVIEWS,
   PROFILE SAVE, PASSWORD, SECURITY, LOGOUT,
   EVENTS AND INITIALIZATION
   CONTINUES DIRECTLY FROM PART 1
========================================================= */


/* =========================================================
   EDIT MODE
========================================================= */

function setProfileEditMode(enabled) {
  scoutProfileState.editMode =
    Boolean(enabled);

  scoutProfileDOM.editableFields.forEach(
    (field) => {
      if (
        field ===
          scoutProfileDOM
            .additionalRegionInput
      ) {
        return;
      }

      field.disabled =
        !scoutProfileState.editMode;
    }
  );

  if (
    scoutProfileDOM.ageGroupFieldset
  ) {
    scoutProfileDOM
      .ageGroupFieldset
      .disabled =
      !scoutProfileState.editMode;
  }

  if (
    scoutProfileDOM.positionFieldset
  ) {
    scoutProfileDOM
      .positionFieldset
      .disabled =
      !scoutProfileState.editMode;
  }

  if (
    scoutProfileDOM.editProfileButton
  ) {
    scoutProfileDOM
      .editProfileButton
      .hidden =
      scoutProfileState.editMode;
  }

  if (
    scoutProfileDOM
      .cancelProfileChangesButton
  ) {
    scoutProfileDOM
      .cancelProfileChangesButton
      .hidden =
      !scoutProfileState.editMode;
  }

  if (
    scoutProfileDOM.coverUploadLabel
  ) {
    scoutProfileDOM
      .coverUploadLabel
      .hidden =
      !scoutProfileState.editMode;
  }

  if (
    scoutProfileDOM.photoUploadLabel
  ) {
    scoutProfileDOM
      .photoUploadLabel
      .hidden =
      !scoutProfileState.editMode;
  }

  if (
    scoutProfileDOM
      .regionInputControls
  ) {
    scoutProfileDOM
      .regionInputControls
      .hidden =
      !scoutProfileState.editMode;
  }

  if (
    scoutProfileDOM
      .additionalRegionInput
  ) {
    scoutProfileDOM
      .additionalRegionInput
      .disabled =
      !scoutProfileState.editMode;
  }

  renderAdditionalRegions();
  updateSaveActionsVisibility();
}


function enableProfileEditing() {
  setProfileEditMode(true);

  scoutProfileDOM.firstName?.focus();

  showScoutProfileNotification({
    title: "Edit mode enabled",
    message:
      "You can now update your scout profile.",
    type: "info"
  });
}


function cancelProfileEditing() {
  restoreOriginalProfile();
  setProfileEditMode(false);

  showScoutProfileNotification({
    title: "Changes cancelled",
    message:
      "Your profile has been restored.",
    type: "info"
  });
}


/* =========================================================
   DIRTY STATE
========================================================= */

function setProfileDirty(dirty) {
  scoutProfileState.dirty =
    Boolean(dirty);

  updateSaveActionsVisibility();
}


function updateSaveActionsVisibility() {
  if (!scoutProfileDOM.saveActions) {
    return;
  }

  scoutProfileDOM.saveActions.hidden =
    !(
      scoutProfileState.editMode &&
      scoutProfileState.dirty
    );
}


function markProfileDirty() {
  if (!scoutProfileState.editMode) {
    return;
  }

  setProfileDirty(true);
}


/* =========================================================
   ADDITIONAL REGIONS
========================================================= */

function renderAdditionalRegions() {
  if (!scoutProfileDOM.selectedRegions) {
    return;
  }

  scoutProfileDOM
    .selectedRegions
    .replaceChildren();

  if (
    scoutProfileState
      .additionalRegions
      .length === 0
  ) {
    const emptyMessage =
      createElement(
        "span",
        "scout-region-empty",
        "No additional regions added."
      );

    scoutProfileDOM
      .selectedRegions
      .append(emptyMessage);

    return;
  }

  const fragment =
    document.createDocumentFragment();

  scoutProfileState
    .additionalRegions
    .forEach((region) => {
      const tag =
        createElement(
          "span",
          "scout-region-tag"
        );

      const text =
        createElement(
          "span",
          "",
          region
        );

      tag.append(text);

      if (
        scoutProfileState.editMode
      ) {
        const removeButton =
          createElement(
            "button",
            "",
            "×"
          );

        removeButton.type = "button";

        removeButton.setAttribute(
          "aria-label",
          `Remove ${region}`
        );

        removeButton.addEventListener(
          "click",
          () => {
            removeAdditionalRegion(
              region
            );
          }
        );

        tag.append(removeButton);
      }

      fragment.append(tag);
    });

  scoutProfileDOM
    .selectedRegions
    .append(fragment);
}


function addAdditionalRegion() {
  const input =
    scoutProfileDOM
      .additionalRegionInput;

  if (!input) {
    return;
  }

  const region =
    input.value.trim();

  if (!region) {
    showScoutProfileNotification({
      title: "Region required",
      message:
        "Enter a state or scouting region.",
      type: "warning"
    });

    input.focus();
    return;
  }

  const alreadyExists =
    scoutProfileState
      .additionalRegions
      .some((existingRegion) => {
        return (
          existingRegion
            .toLowerCase() ===
          region.toLowerCase()
        );
      });

  if (alreadyExists) {
    showScoutProfileNotification({
      title: "Region already added",
      message:
        `${region} is already in your scouting regions.`,
      type: "warning"
    });

    input.select();
    return;
  }

  scoutProfileState
    .additionalRegions
    .push(region);

  input.value = "";

  renderAdditionalRegions();
  markProfileDirty();
  input.focus();
}


function removeAdditionalRegion(region) {
  scoutProfileState
    .additionalRegions =
    scoutProfileState
      .additionalRegions
      .filter((item) => {
        return item !== region;
      });

  renderAdditionalRegions();
  markProfileDirty();
}


/* =========================================================
   FORM DATA COLLECTION
========================================================= */

function collectProfileFormData() {
  return {
    id:
      scoutProfileState
        .profile
        ?.id ||
      null,

    firstName:
      scoutProfileDOM
        .firstName
        ?.value
        .trim() ||
      "",

    lastName:
      scoutProfileDOM
        .lastName
        ?.value
        .trim() ||
      "",

    email:
      scoutProfileDOM
        .email
        ?.value
        .trim() ||
      "",

    phone:
      scoutProfileDOM
        .phone
        ?.value
        .trim() ||
      "",

    dateOfBirth:
      scoutProfileDOM
        .dateOfBirth
        ?.value ||
      "",

    gender:
      scoutProfileDOM
        .gender
        ?.value ||
      "",

    nationality:
      scoutProfileDOM
        .nationality
        ?.value
        .trim() ||
      "",

    languages:
      normalizeCommaSeparatedValue(
        scoutProfileDOM
          .languages
          ?.value ||
        ""
      ),

    designation:
      scoutProfileDOM
        .designation
        ?.value
        .trim() ||
      "",

    organization:
      scoutProfileDOM
        .organization
        ?.value
        .trim() ||
      "",

    licenseNumber:
      scoutProfileDOM
        .licenseNumber
        ?.value
        .trim() ||
      "",

    experienceYears:
      clampNumber(
        scoutProfileDOM
          .experienceYears
          ?.value ||
        0,
        0,
        60
      ),

    qualifications:
      scoutProfileDOM
        .qualifications
        ?.value
        .trim() ||
      "",

    biography:
      scoutProfileDOM
        .biography
        ?.value
        .trim() ||
      "",

    country:
      scoutProfileDOM
        .country
        ?.value
        .trim() ||
      "",

    state:
      scoutProfileDOM
        .state
        ?.value
        .trim() ||
      "",

    city:
      scoutProfileDOM
        .city
        ?.value
        .trim() ||
      "",

    travelAvailability:
      scoutProfileDOM
        .travelAvailability
        ?.value ||
      "",

    additionalRegions:
      [
        ...scoutProfileState
          .additionalRegions
      ],

    preferredAgeGroups:
      getCheckedValues(
        scoutProfileDOM
          .ageGroupCheckboxes
      ),

    preferredPositions:
      getCheckedValues(
        scoutProfileDOM
          .positionCheckboxes
      ),

    linkedin:
      scoutProfileDOM
        .linkedIn
        ?.value
        .trim() ||
      "",

    website:
      scoutProfileDOM
        .website
        ?.value
        .trim() ||
      "",

    instagram:
      scoutProfileDOM
        .instagram
        ?.value
        .trim() ||
      "",

    xProfile:
      scoutProfileDOM
        .xProfile
        ?.value
        .trim() ||
      "",

    avatar:
      scoutProfileState
        .profileImagePreviewUrl ||
      scoutProfileState
        .profile
        ?.avatar ||
      "",

    coverImage:
      scoutProfileState
        .coverImagePreviewUrl ||
      scoutProfileState
        .profile
        ?.coverImage ||
      "",

    verified:
      Boolean(
        scoutProfileState
          .profile
          ?.verified
      ),

    memberSince:
      scoutProfileState
        .profile
        ?.memberSince ||
      null,

    profileCompletion:
      0,

    statistics:
      deepClone(
        scoutProfileState
          .profile
          ?.statistics || {
          reportsCreated: 0,
          playersScouted: 0,
          matchesAttended: 0
        }
      ),

    account:
      deepClone(
        scoutProfileState
          .profile
          ?.account || {
          twoFactorEnabled: false,
          activeSessions: 0,
          unreadNotifications: 0
        }
      )
  };
}


/* =========================================================
   FIELD VALIDATION HELPERS
========================================================= */

function getFieldErrorElement(field) {
  if (!field?.id) {
    return null;
  }

  return document.querySelector(
    `[data-error-for="${field.id}"]`
  );
}


function clearFieldError(field) {
  if (!field) {
    return;
  }

  const group =
    field.closest(
      ".scout-form-group"
    );

  group?.classList.remove(
    "is-invalid"
  );

  field.removeAttribute(
    "aria-invalid"
  );

  const errorElement =
    getFieldErrorElement(field);

  if (errorElement) {
    errorElement.textContent = "";
  }
}


function setFieldError(
  field,
  message
) {
  if (!field) {
    return;
  }

  const group =
    field.closest(
      ".scout-form-group"
    );

  group?.classList.add(
    "is-invalid"
  );

  field.setAttribute(
    "aria-invalid",
    "true"
  );

  const errorElement =
    getFieldErrorElement(field);

  if (errorElement) {
    errorElement.textContent =
      message;
  }
}


function clearAllProfileErrors() {
  scoutProfileDOM
    .fieldErrors
    .forEach((errorElement) => {
      errorElement.textContent = "";
    });

  document
    .querySelectorAll(
      ".scout-form-group.is-invalid"
    )
    .forEach((group) => {
      group.classList.remove(
        "is-invalid"
      );
    });

  scoutProfileDOM
    .editableFields
    .forEach((field) => {
      field.removeAttribute(
        "aria-invalid"
      );
    });
}


function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
    value
  );
}


function isValidPhone(value) {
  const cleaned =
    value.replace(
      /[\s()+-]/g,
      ""
    );

  return /^\d{7,15}$/.test(
    cleaned
  );
}


function isValidUrl(value) {
  if (!value) {
    return true;
  }

  try {
    const url = new URL(value);

    return (
      url.protocol === "http:" ||
      url.protocol === "https:"
    );
  } catch {
    return false;
  }
}


/* =========================================================
   PROFILE VALIDATION
========================================================= */

function validateProfileForm() {
  clearAllProfileErrors();

  let valid = true;
  let firstInvalidField = null;

  const requiredFields = [
    {
      field:
        scoutProfileDOM.firstName,
      message:
        "First name is required."
    },
    {
      field:
        scoutProfileDOM.lastName,
      message:
        "Last name is required."
    },
    {
      field:
        scoutProfileDOM.email,
      message:
        "Email address is required."
    },
    {
      field:
        scoutProfileDOM.phone,
      message:
        "Phone number is required."
    },
    {
      field:
        scoutProfileDOM.designation,
      message:
        "Professional designation is required."
    },
    {
      field:
        scoutProfileDOM.country,
      message:
        "Country is required."
    },
    {
      field:
        scoutProfileDOM.state,
      message:
        "Primary state is required."
    }
  ];

  requiredFields.forEach(
    ({ field, message }) => {
      if (
        !field ||
        field.value.trim()
      ) {
        return;
      }

      setFieldError(
        field,
        message
      );

      firstInvalidField ||= field;
      valid = false;
    }
  );

  if (
    scoutProfileDOM.email &&
    scoutProfileDOM.email.value.trim() &&
    !isValidEmail(
      scoutProfileDOM.email.value.trim()
    )
  ) {
    setFieldError(
      scoutProfileDOM.email,
      "Enter a valid email address."
    );

    firstInvalidField ||=
      scoutProfileDOM.email;

    valid = false;
  }

  if (
    scoutProfileDOM.phone &&
    scoutProfileDOM.phone.value.trim() &&
    !isValidPhone(
      scoutProfileDOM.phone.value.trim()
    )
  ) {
    setFieldError(
      scoutProfileDOM.phone,
      "Enter a valid phone number."
    );

    firstInvalidField ||=
      scoutProfileDOM.phone;

    valid = false;
  }

  if (
    scoutProfileDOM.experienceYears
  ) {
    const experience =
      Number(
        scoutProfileDOM
          .experienceYears
          .value
      );

    if (
      !Number.isFinite(experience) ||
      experience < 0 ||
      experience > 60
    ) {
      setFieldError(
        scoutProfileDOM
          .experienceYears,
        "Experience must be between 0 and 60 years."
      );

      firstInvalidField ||=
        scoutProfileDOM
          .experienceYears;

      valid = false;
    }
  }

  if (
    scoutProfileDOM.linkedIn &&
    !isValidUrl(
      scoutProfileDOM
        .linkedIn
        .value
        .trim()
    )
  ) {
    setFieldError(
      scoutProfileDOM.linkedIn,
      "Enter a valid LinkedIn URL."
    );

    firstInvalidField ||=
      scoutProfileDOM.linkedIn;

    valid = false;
  }

  if (
    scoutProfileDOM.website &&
    !isValidUrl(
      scoutProfileDOM
        .website
        .value
        .trim()
    )
  ) {
    setFieldError(
      scoutProfileDOM.website,
      "Enter a valid website URL."
    );

    firstInvalidField ||=
      scoutProfileDOM.website;

    valid = false;
  }

  if (!valid) {
    firstInvalidField?.focus();

    showScoutProfileNotification({
      title: "Check your information",
      message:
        "Correct the highlighted fields before saving.",
      type: "error"
    });
  }

  return valid;
}


/* =========================================================
   IMAGE VALIDATION
========================================================= */

function validateImageFile(
  file,
  maximumSize
) {
  if (!file) {
    return {
      valid: false,
      message:
        "No image was selected."
    };
  }

  if (
    !SCOUT_PROFILE_CONFIG
      .allowedImageTypes
      .includes(file.type)
  ) {
    return {
      valid: false,
      message:
        "Use a JPG, PNG or WebP image."
    };
  }

  if (file.size > maximumSize) {
    return {
      valid: false,
      message:
        `Image size must be below ${Math.round(
          maximumSize /
          (1024 * 1024)
        )} MB.`
    };
  }

  return {
    valid: true,
    message: ""
  };
}


/* =========================================================
   PROFILE IMAGE PREVIEW
========================================================= */

function handleProfileImageSelection(
  event
) {
  const file =
    event.target.files?.[0];

  const validation =
    validateImageFile(
      file,
      SCOUT_PROFILE_CONFIG
        .maximumProfileImageSize
    );

  if (!validation.valid) {
    showScoutProfileNotification({
      title: "Invalid profile image",
      message:
        validation.message,
      type: "error"
    });

    event.target.value = "";
    return;
  }

  revokePreviewUrl(
    scoutProfileState
      .profileImagePreviewUrl
  );

  const previewUrl =
    URL.createObjectURL(file);

  scoutProfileState.profileImageFile =
    file;

  scoutProfileState.profileImagePreviewUrl =
    previewUrl;

  if (
    scoutProfileDOM.profileMainImage
  ) {
    scoutProfileDOM
      .profileMainImage
      .src = previewUrl;
  }

  scoutProfileDOM
    .scoutAvatarElements
    .forEach((image) => {
      image.src = previewUrl;
    });

  markProfileDirty();

  showScoutProfileNotification({
    title: "Profile image selected",
    message:
      "Save your changes to update the image.",
    type: "success"
  });
}


/* =========================================================
   COVER IMAGE PREVIEW
========================================================= */

function handleCoverImageSelection(
  event
) {
  const file =
    event.target.files?.[0];

  const validation =
    validateImageFile(
      file,
      SCOUT_PROFILE_CONFIG
        .maximumCoverImageSize
    );

  if (!validation.valid) {
    showScoutProfileNotification({
      title: "Invalid cover image",
      message:
        validation.message,
      type: "error"
    });

    event.target.value = "";
    return;
  }

  revokePreviewUrl(
    scoutProfileState
      .coverImagePreviewUrl
  );

  const previewUrl =
    URL.createObjectURL(file);

  scoutProfileState.coverImageFile =
    file;

  scoutProfileState.coverImagePreviewUrl =
    previewUrl;

  if (
    scoutProfileDOM.profileCoverImage
  ) {
    scoutProfileDOM
      .profileCoverImage
      .src = previewUrl;
  }

  markProfileDirty();

  showScoutProfileNotification({
    title: "Cover image selected",
    message:
      "Save your changes to update the cover.",
    type: "success"
  });
}


/* =========================================================
   RESET IMAGE PREVIEWS
========================================================= */

function clearImagePreviews() {
  revokePreviewUrl(
    scoutProfileState
      .profileImagePreviewUrl
  );

  revokePreviewUrl(
    scoutProfileState
      .coverImagePreviewUrl
  );

  scoutProfileState.profileImageFile =
    null;

  scoutProfileState.coverImageFile =
    null;

  scoutProfileState.profileImagePreviewUrl =
    null;

  scoutProfileState.coverImagePreviewUrl =
    null;

  if (
    scoutProfileDOM.photoUploadInput
  ) {
    scoutProfileDOM
      .photoUploadInput
      .value = "";
  }

  if (
    scoutProfileDOM.coverUploadInput
  ) {
    scoutProfileDOM
      .coverUploadInput
      .value = "";
  }
}


/* =========================================================
   RESTORE ORIGINAL PROFILE
========================================================= */

function restoreOriginalProfile() {
  if (
    !scoutProfileState
      .originalProfile
  ) {
    return;
  }

  clearImagePreviews();
  clearAllProfileErrors();

  const originalProfile =
    deepClone(
      scoutProfileState
        .originalProfile
    );

  scoutProfileState.profile =
    originalProfile;

  scoutProfileState.additionalRegions =
    [
      ...scoutProfileState
        .originalAdditionalRegions
    ];

  populateProfileForm(
    originalProfile
  );

  renderScoutProfile(
    originalProfile
  );

  setProfileDirty(false);
}


/* =========================================================
   RESET FORM
========================================================= */

function resetProfileForm() {
  restoreOriginalProfile();

  showScoutProfileNotification({
    title: "Form reset",
    message:
      "All unsaved changes have been removed.",
    type: "info"
  });
}


/* =========================================================
   PROFILE SAVE PAYLOAD
========================================================= */

function createProfileFormDataPayload(
  profile
) {
  const formData =
    new FormData();

  formData.append(
    "profile",
    JSON.stringify(profile)
  );

  if (
    scoutProfileState
      .profileImageFile
  ) {
    formData.append(
      "profileImage",
      scoutProfileState
        .profileImageFile
    );
  }

  if (
    scoutProfileState
      .coverImageFile
  ) {
    formData.append(
      "coverImage",
      scoutProfileState
        .coverImageFile
    );
  }

  return formData;
}


/* =========================================================
   SAVE PROFILE
========================================================= */

async function saveScoutProfile(event) {
  event?.preventDefault();

  if (
    scoutProfileState.saving ||
    !scoutProfileState.editMode
  ) {
    return;
  }

  if (!validateProfileForm()) {
    return;
  }

  const updatedProfile =
    collectProfileFormData();

  updatedProfile.profileCompletion =
    calculateProfileCompletion(
      updatedProfile
    );

  scoutProfileState.saving = true;

  setButtonLoading(
    scoutProfileDOM.saveProfileButton,
    true
  );

  try {
    let responseProfile;

    if (
      SCOUT_PROFILE_CONFIG.useMockData
    ) {
      await delay(800);

      responseProfile = {
        ...updatedProfile,

        avatar:
          scoutProfileState
            .profileImagePreviewUrl ||
          updatedProfile.avatar,

        coverImage:
          scoutProfileState
            .coverImagePreviewUrl ||
          updatedProfile.coverImage
      };
    } else {
      const payload =
        createProfileFormDataPayload(
          updatedProfile
        );

      responseProfile =
        await scoutProfileApiRequest(
          SCOUT_PROFILE_CONFIG
            .profileEndpoint,
          {
            method: "PUT",
            body: payload
          }
        );
    }

    const normalizedProfile =
      normalizeScoutProfile(
        responseProfile ||
        updatedProfile
      );

    scoutProfileState.profile =
      normalizedProfile;

    scoutProfileState.originalProfile =
      deepClone(
        normalizedProfile
      );

    scoutProfileState.additionalRegions =
      [
        ...normalizedProfile
          .additionalRegions
      ];

    scoutProfileState.originalAdditionalRegions =
      [
        ...normalizedProfile
          .additionalRegions
      ];

    clearImagePreviews();
    renderScoutProfile(
      normalizedProfile
    );

    setProfileDirty(false);
    setProfileEditMode(false);

    showScoutProfileNotification({
      title: "Profile updated",
      message:
        "Your scout profile has been saved successfully.",
      type: "success"
    });
  } catch (error) {
    console.error(
      "Unable to save scout profile:",
      error
    );

    showScoutProfileNotification({
      title: "Profile update failed",
      message:
        error.message ||
        "Your profile changes could not be saved.",
      type: "error"
    });
  } finally {
    scoutProfileState.saving =
      false;

    setButtonLoading(
      scoutProfileDOM
        .saveProfileButton,
      false
    );
  }
}


/* =========================================================
   PASSWORD MODAL
========================================================= */

function openChangePasswordModal() {
  scoutProfileDOM
    .changePasswordForm
    ?.reset();

  clearPasswordErrors();

  openModal(
    scoutProfileDOM
      .changePasswordModal,
    scoutProfileDOM
      .changePasswordButton
  );
}


function closeChangePasswordModal() {
  closeModal(
    scoutProfileDOM
      .changePasswordModal
  );

  scoutProfileDOM
    .changePasswordForm
    ?.reset();

  clearPasswordErrors();
}


function clearPasswordErrors() {
  [
    scoutProfileDOM.currentPassword,
    scoutProfileDOM.newPassword,
    scoutProfileDOM.confirmNewPassword
  ].forEach((field) => {
    clearFieldError(field);
  });
}


/* =========================================================
   PASSWORD VALIDATION
========================================================= */

function validatePasswordForm() {
  clearPasswordErrors();

  const currentPassword =
    scoutProfileDOM
      .currentPassword
      ?.value ||
    "";

  const newPassword =
    scoutProfileDOM
      .newPassword
      ?.value ||
    "";

  const confirmPassword =
    scoutProfileDOM
      .confirmNewPassword
      ?.value ||
    "";

  let valid = true;
  let firstInvalidField = null;

  if (!currentPassword) {
    setFieldError(
      scoutProfileDOM
        .currentPassword,
      "Current password is required."
    );

    firstInvalidField ||=
      scoutProfileDOM
        .currentPassword;

    valid = false;
  }

  if (newPassword.length < 8) {
    setFieldError(
      scoutProfileDOM
        .newPassword,
      "New password must contain at least 8 characters."
    );

    firstInvalidField ||=
      scoutProfileDOM
        .newPassword;

    valid = false;
  }

  if (
    newPassword &&
    currentPassword === newPassword
  ) {
    setFieldError(
      scoutProfileDOM
        .newPassword,
      "New password must be different from the current password."
    );

    firstInvalidField ||=
      scoutProfileDOM
        .newPassword;

    valid = false;
  }

  if (
    confirmPassword !==
    newPassword
  ) {
    setFieldError(
      scoutProfileDOM
        .confirmNewPassword,
      "Passwords do not match."
    );

    firstInvalidField ||=
      scoutProfileDOM
        .confirmNewPassword;

    valid = false;
  }

  firstInvalidField?.focus();

  return valid;
}


/* =========================================================
   CHANGE PASSWORD
========================================================= */

async function submitPasswordChange(
  event
) {
  event.preventDefault();

  if (!validatePasswordForm()) {
    return;
  }

  const payload = {
    currentPassword:
      scoutProfileDOM
        .currentPassword
        .value,

    newPassword:
      scoutProfileDOM
        .newPassword
        .value
  };

  setButtonLoading(
    scoutProfileDOM
      .submitPasswordChangeButton,
    true
  );

  try {
    if (
      SCOUT_PROFILE_CONFIG
        .useMockData
    ) {
      await delay(750);
    } else {
      await scoutProfileApiRequest(
        SCOUT_PROFILE_CONFIG
          .passwordEndpoint,
        {
          method: "PUT",
          body: payload
        }
      );
    }

    closeChangePasswordModal();

    showScoutProfileNotification({
      title: "Password updated",
      message:
        "Your account password has been changed.",
      type: "success"
    });
  } catch (error) {
    console.error(
      "Password change failed:",
      error
    );

    showScoutProfileNotification({
      title: "Password update failed",
      message:
        error.message ||
        "Your password could not be changed.",
      type: "error"
    });
  } finally {
    setButtonLoading(
      scoutProfileDOM
        .submitPasswordChangeButton,
      false
    );
  }
}


/* =========================================================
   TWO-FACTOR AUTHENTICATION
========================================================= */

async function toggleTwoFactorAuthentication() {
  const profile =
    scoutProfileState.profile;

  if (!profile) {
    return;
  }

  const currentlyEnabled =
    profile.account
      .twoFactorEnabled;

  setButtonLoading(
    scoutProfileDOM.twoFactorButton,
    true
  );

  try {
    if (
      SCOUT_PROFILE_CONFIG
        .useMockData
    ) {
      await delay(600);
    } else {
      await scoutProfileApiRequest(
        SCOUT_PROFILE_CONFIG
          .twoFactorEndpoint,
        {
          method: currentlyEnabled
            ? "DELETE"
            : "POST"
        }
      );
    }

    profile.account
      .twoFactorEnabled =
      !currentlyEnabled;

    scoutProfileState
      .originalProfile
      .account
      .twoFactorEnabled =
      !currentlyEnabled;

    updateSecurityButtons(
      profile
    );

    showScoutProfileNotification({
      title: currentlyEnabled
        ? "Two-factor authentication disabled"
        : "Two-factor authentication enabled",
      message: currentlyEnabled
        ? "The additional sign-in verification has been removed."
        : "Your scout account now has additional protection.",
      type: "success"
    });
  } catch (error) {
    console.error(
      "Two-factor update failed:",
      error
    );

    showScoutProfileNotification({
      title: "Security update failed",
      message:
        error.message ||
        "Two-factor authentication could not be updated.",
      type: "error"
    });
  } finally {
    setButtonLoading(
      scoutProfileDOM.twoFactorButton,
      false
    );
  }
}


/* =========================================================
   ACTIVE SESSIONS
========================================================= */

async function viewActiveSessions() {
  setButtonLoading(
    scoutProfileDOM
      .viewSessionsButton,
    true
  );

  try {
    let sessions;

    if (
      SCOUT_PROFILE_CONFIG
        .useMockData
    ) {
      await delay(500);

      sessions = [
        {
          device:
            "Chrome on Windows",
          location:
            "Dimapur, India",
          current: true
        },
        {
          device:
            "Chrome on Android",
          location:
            "Dimapur, India",
          current: false
        },
        {
          device:
            "Samsung Internet",
          location:
            "Kohima, India",
          current: false
        }
      ];
    } else {
      const response =
        await scoutProfileApiRequest(
          SCOUT_PROFILE_CONFIG
            .sessionsEndpoint
        );

      sessions =
        response?.sessions ||
        [];
    }

    const sessionSummary =
      sessions.length > 0
        ? sessions
            .map((session) => {
              return `${session.device} — ${session.location}${session.current ? " (Current)" : ""}`;
            })
            .join("\n")
        : "No active sessions were found.";

    window.alert(
      `Active Sessions\n\n${sessionSummary}`
    );
  } catch (error) {
    console.error(
      "Unable to load sessions:",
      error
    );

    showScoutProfileNotification({
      title: "Sessions unavailable",
      message:
        error.message ||
        "Active sessions could not be loaded.",
      type: "error"
    });
  } finally {
    setButtonLoading(
      scoutProfileDOM
        .viewSessionsButton,
      false
    );
  }
}


/* =========================================================
   NOTIFICATION BUTTON
========================================================= */

function handleNotificationButton() {
  showScoutProfileNotification({
    title: "Notifications",
    message:
      "Your notification centre will be connected during backend integration.",
    type: "info"
  });
}


/* =========================================================
   LOGOUT
========================================================= */

function openLogoutModal() {
  openModal(
    scoutProfileDOM.logoutModal,
    scoutProfileDOM.logoutButton
  );
}


function closeLogoutModal() {
  closeModal(
    scoutProfileDOM.logoutModal
  );
}


async function confirmScoutLogout() {
  setButtonLoading(
    scoutProfileDOM
      .confirmLogoutButton,
    true
  );

  try {
    if (
      SCOUT_PROFILE_CONFIG
        .useMockData
    ) {
      await delay(550);

      localStorage.removeItem(
        "scoutAccessToken"
      );

      sessionStorage.clear();
    } else {
      await scoutProfileApiRequest(
        SCOUT_PROFILE_CONFIG
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

    showScoutProfileNotification({
      title: "Logout failed",
      message:
        error.message ||
        "You could not be logged out.",
      type: "error"
    });

    setButtonLoading(
      scoutProfileDOM
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
        scoutProfileDOM
          .profileCoverImage
      ) {
        image.src =
          "images/scout-profile-cover-placeholder.jpg";
      } else {
        image.src =
          "images/scout-avatar-placeholder.jpg";
      }
    },
    true
  );
}


/* =========================================================
   UNSAVED CHANGES WARNING
========================================================= */

function handleBeforeUnload(event) {
  if (
    !scoutProfileState.dirty
  ) {
    return;
  }

  event.preventDefault();

  event.returnValue = "";
}


/* =========================================================
   GLOBAL KEYBOARD HANDLING
========================================================= */

function handleGlobalKeydown(event) {
  const activeModal =
    scoutProfileState
      .activeModal;

  if (
    event.key === "Escape"
  ) {
    if (
      activeModal ===
      scoutProfileDOM
        .changePasswordModal
    ) {
      closeChangePasswordModal();
      return;
    }

    if (
      activeModal ===
      scoutProfileDOM
        .logoutModal
    ) {
      closeLogoutModal();
      return;
    }

    if (
      scoutProfileDOM
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
   FORM INPUT EVENTS
========================================================= */

function initializeProfileFormEvents() {
  scoutProfileDOM
    .profileForm
    ?.addEventListener(
      "submit",
      saveScoutProfile
    );

  scoutProfileDOM
    .editableFields
    .forEach((field) => {
      field.addEventListener(
        "input",
        () => {
          clearFieldError(field);
          markProfileDirty();
          updateCharacterCounters();
        }
      );

      field.addEventListener(
        "change",
        () => {
          clearFieldError(field);
          markProfileDirty();
        }
      );
    });

  scoutProfileDOM
    .additionalRegionInput
    ?.addEventListener(
      "keydown",
      (event) => {
        if (
          event.key === "Enter"
        ) {
          event.preventDefault();
          addAdditionalRegion();
        }
      }
    );

  scoutProfileDOM
    .addRegionButton
    ?.addEventListener(
      "click",
      addAdditionalRegion
    );

  scoutProfileDOM
    .photoUploadInput
    ?.addEventListener(
      "change",
      handleProfileImageSelection
    );

  scoutProfileDOM
    .coverUploadInput
    ?.addEventListener(
      "change",
      handleCoverImageSelection
    );
}


/* =========================================================
   ACTION EVENTS
========================================================= */

function initializeProfileActionEvents() {
  scoutProfileDOM
    .editProfileButton
    ?.addEventListener(
      "click",
      enableProfileEditing
    );

  scoutProfileDOM
    .cancelProfileChangesButton
    ?.addEventListener(
      "click",
      cancelProfileEditing
    );

  scoutProfileDOM
    .resetProfileFormButton
    ?.addEventListener(
      "click",
      resetProfileForm
    );

  scoutProfileDOM
    .retryButton
    ?.addEventListener(
      "click",
      loadScoutProfile
    );

  scoutProfileDOM
    .changePasswordButton
    ?.addEventListener(
      "click",
      openChangePasswordModal
    );

  scoutProfileDOM
    .passwordModalCloseButtons
    .forEach((button) => {
      button.addEventListener(
        "click",
        closeChangePasswordModal
      );
    });

  scoutProfileDOM
    .changePasswordForm
    ?.addEventListener(
      "submit",
      submitPasswordChange
    );

  scoutProfileDOM
    .twoFactorButton
    ?.addEventListener(
      "click",
      toggleTwoFactorAuthentication
    );

  scoutProfileDOM
    .viewSessionsButton
    ?.addEventListener(
      "click",
      viewActiveSessions
    );

  scoutProfileDOM
    .notificationButton
    ?.addEventListener(
      "click",
      handleNotificationButton
    );

  scoutProfileDOM
    .logoutButton
    ?.addEventListener(
      "click",
      openLogoutModal
    );

  scoutProfileDOM
    .logoutModalCloseButtons
    .forEach((button) => {
      button.addEventListener(
        "click",
        closeLogoutModal
      );
    });

  scoutProfileDOM
    .confirmLogoutButton
    ?.addEventListener(
      "click",
      confirmScoutLogout
    );
}


/* =========================================================
   INITIALIZATION
========================================================= */

async function initializeScoutProfilePage() {
  initializeScoutSidebar();
  initializeProfileFormEvents();
  initializeProfileActionEvents();
  initializeImageFallbacks();

  document.addEventListener(
    "keydown",
    handleGlobalKeydown
  );

  window.addEventListener(
    "beforeunload",
    handleBeforeUnload
  );

  await loadScoutProfile();
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
    initializeScoutProfilePage,
    {
      once: true
    }
  );
} else {
  initializeScoutProfilePage();
}


/* =========================================================
   BACKEND INTEGRATION NOTES
========================================================= */

/*
  Change:

  useMockData: false

  Expected endpoints:

  GET /api/v1/scout/profile

  PUT /api/v1/scout/profile
  Content-Type: multipart/form-data

  Form fields:

  profile:
  JSON string containing the scout profile data

  profileImage:
  Optional JPG, PNG or WebP file

  coverImage:
  Optional JPG, PNG or WebP file


  PUT /api/v1/scout/account/password

  Body:

  {
    "currentPassword": "current-password",
    "newPassword": "new-password"
  }


  POST /api/v1/scout/account/two-factor

  DELETE /api/v1/scout/account/two-factor


  GET /api/v1/scout/account/sessions

  Expected response:

  {
    "sessions": [
      {
        "id": "session-id",
        "device": "Chrome on Windows",
        "location": "Dimapur, India",
        "current": true,
        "lastActiveAt": "2026-07-19T12:00:00Z"
      }
    ]
  }


  POST /api/v1/auth/logout
*/


/* =========================================================
   END OF SCOUT-PROFILE.JS
========================================================= */