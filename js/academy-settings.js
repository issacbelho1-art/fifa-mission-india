/* ==========================================================
   FIFA Mission India
   Academy Settings

   Frontend : Issac Belho
   Backend  : Mr. Harsh
   Security : Samarth
========================================================== */

"use strict";


/* ==========================================================
   DOM ELEMENTS
========================================================== */

const academySidebar = document.querySelector(".academy-sidebar");

const academySidebarToggle = document.querySelector(
  "#academySidebarToggle"
);

const academySidebarClose = document.querySelector(
  "#academySidebarClose"
);

const academyProfileTrigger = document.querySelector(
  "#academyProfileTrigger"
);

const academyProfileDropdown = document.querySelector(
  ".academy-dropdown"
);

const academySettingsTabs = document.querySelectorAll(
  ".academy-settings-tab"
);

const academySettingsSections = document.querySelectorAll(
  ".academy-settings-section"
);

const academySaveAllButton = document.querySelector(
  "#academySaveAllChanges"
);

const academyLogoutButton = document.querySelector(
  "#academyLogoutButton"
);

const academyLogoutModal = document.querySelector(
  "#academyLogoutModal"
);

const academyConfirmLogout = document.querySelector(
  "#academyConfirmLogout"
);

const academyLogoutCloseButtons = document.querySelectorAll(
  "[data-close-logout]"
);

const academyToastContainer = document.querySelector(
  "#academyToastContainer"
);

const academyResetSettingsButton = document.querySelector(
  "#academyResetSettings"
);

const academyClearCacheButton = document.querySelector(
  "#academyClearCache"
);

const academyDeleteAcademyButton = document.querySelector(
  "#academyDeleteAcademy"
);


/* ==========================================================
   STORAGE CONFIGURATION
========================================================== */

const ACADEMY_SETTINGS_STORAGE_KEY =
  "fmi_academy_settings";

const ACADEMY_ACTIVE_TAB_KEY =
  "fmi_academy_settings_active_tab";

const ACADEMY_THEME_KEY =
  "fmi_academy_theme";


/* ==========================================================
   APPLICATION STATE
========================================================== */

let academySettingsState = {};

let academyInitialSettingsState = {};

let academyHasUnsavedChanges = false;

let academyLogoPreviewUrl = "";

let academyCoverPreviewUrl = "";


/* ==========================================================
   DEFAULT SETTINGS
========================================================== */

const academyDefaultSettings = {

  profile: {

    academyName: "Green Valley Football Academy",

    academyEmail: "academy@example.com",

    academyPhone: "+91 9876543210",

    academyWebsite: "https://academy.com",

    academyAddress: "Dimapur, Nagaland, India",

    academyAbout:
      "Developing football talent through professional coaching, discipline and competitive opportunities."

  },

  account: {

    registeredEmail: "academy@example.com",

    twoFactorAuthentication: "Disabled"

  },

  notifications: {

    newApplications: true,

    newMessages: true,

    trialReminders: true,

    playerRegistrations: true,

    documentVerification: true,

    smsNotifications: false,

    emailNotifications: true,

    pushNotifications: true

  },

  branding: {

    primaryColor: "#003B95",

    secondaryColor: "#0A6CF1",

    academyLogo: "",

    coverImage: ""

  },

  preferences: {

    language: "English",

    timeZone: "Asia/Kolkata",

    dateFormat: "DD/MM/YYYY",

    defaultView: "Table",

    darkMode: false,

    compactLayout: true

  }

};


/* ==========================================================
   UTILITY FUNCTIONS
========================================================== */

function academyDeepClone(value) {

  return JSON.parse(JSON.stringify(value));

}


function academyEscapeHTML(value) {

  const temporaryElement = document.createElement("div");

  temporaryElement.textContent = String(value);

  return temporaryElement.innerHTML;

}


function academyNormalizeText(value) {

  return String(value || "").trim();

}


function academyIsValidEmail(email) {

  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

}


function academyIsValidUrl(url) {

  if (!url) {

    return true;

  }

  try {

    new URL(url);

    return true;

  } catch {

    return false;

  }

}


function academyIsModalOpen(modal) {

  return Boolean(modal && !modal.hidden);

}


/* ==========================================================
   TOAST NOTIFICATIONS
========================================================== */

function academyShowToast(

  message,

  type = "success",

  duration = 3200

) {

  if (!academyToastContainer) {

    return;

  }

  const toast = document.createElement("div");

  toast.className = `academy-toast academy-toast-${type}`;

  toast.setAttribute("role", "status");

  toast.setAttribute("aria-live", "polite");

  const iconMap = {

    success: "fa-circle-check",

    error: "fa-circle-xmark",

    warning: "fa-triangle-exclamation",

    info: "fa-circle-info"

  };

  toast.innerHTML = `

    <i class="fa-solid ${
      iconMap[type] || iconMap.info
    }" aria-hidden="true"></i>

    <span>${academyEscapeHTML(message)}</span>

    <button
      type="button"
      class="academy-toast-close"
      aria-label="Close notification"
    >

      <i class="fa-solid fa-xmark"></i>

    </button>

  `;

  academyToastContainer.appendChild(toast);

  const closeButton = toast.querySelector(
    ".academy-toast-close"
  );

  const removeToast = () => {

    toast.classList.add("academy-toast-leaving");

    window.setTimeout(() => {

      toast.remove();

    }, 250);

  };

  closeButton?.addEventListener("click", removeToast);

  window.setTimeout(removeToast, duration);

}


/* ==========================================================
   SIDEBAR
========================================================== */

function academyOpenSidebar() {

  if (!academySidebar) {

    return;

  }

  academySidebar.classList.add("open");

  academySidebarToggle?.setAttribute(
    "aria-expanded",
    "true"
  );

}


function academyCloseSidebar() {

  if (!academySidebar) {

    return;

  }

  academySidebar.classList.remove("open");

  academySidebarToggle?.setAttribute(
    "aria-expanded",
    "false"
  );

}


function academyInitializeSidebar() {

  academySidebarToggle?.addEventListener(

    "click",

    academyOpenSidebar

  );

  academySidebarClose?.addEventListener(

    "click",

    academyCloseSidebar

  );

  document.addEventListener("click", (event) => {

    if (

      window.innerWidth <= 992 &&

      academySidebar?.classList.contains("open") &&

      !academySidebar.contains(event.target) &&

      !academySidebarToggle?.contains(event.target)

    ) {

      academyCloseSidebar();

    }

  });

  window.addEventListener("resize", () => {

    if (window.innerWidth > 992) {

      academyCloseSidebar();

    }

  });

}


/* ==========================================================
   PROFILE DROPDOWN
========================================================== */

function academyCloseProfileDropdown() {

  if (!academyProfileDropdown) {

    return;

  }

  academyProfileDropdown.hidden = true;

  academyProfileTrigger?.setAttribute(
    "aria-expanded",
    "false"
  );

}


function academyToggleProfileDropdown() {

  if (!academyProfileDropdown) {

    return;

  }

  const shouldOpen = academyProfileDropdown.hidden;

  academyProfileDropdown.hidden = !shouldOpen;

  academyProfileTrigger?.setAttribute(

    "aria-expanded",

    String(shouldOpen)

  );

}


function academyInitializeProfileDropdown() {

  academyProfileTrigger?.addEventListener(

    "click",

    (event) => {

      event.stopPropagation();

      academyToggleProfileDropdown();

    }

  );

  document.addEventListener("click", (event) => {

    if (

      !academyProfileDropdown?.contains(event.target) &&

      !academyProfileTrigger?.contains(event.target)

    ) {

      academyCloseProfileDropdown();

    }

  });

}


/* ==========================================================
   SETTINGS TAB NAVIGATION
========================================================== */

function academyActivateSettingsTab(tabName) {

  if (!tabName) {

    return;

  }

  academySettingsTabs.forEach((tab) => {

    const targetName =
      tab.dataset.settingsTab ||
      tab.dataset.tab ||
      tab.getAttribute("aria-controls");

    const isActive = targetName === tabName;

    tab.classList.toggle("active", isActive);

    tab.setAttribute(
      "aria-selected",
      String(isActive)
    );

    tab.tabIndex = isActive ? 0 : -1;

  });

  academySettingsSections.forEach((section) => {

    const isActive = section.id === tabName;

    section.classList.toggle("active", isActive);

    section.hidden = !isActive;

  });

  localStorage.setItem(

    ACADEMY_ACTIVE_TAB_KEY,

    tabName

  );

}


function academyInitializeTabs() {

  academySettingsTabs.forEach((tab, index) => {

    const tabName =
      tab.dataset.settingsTab ||
      tab.dataset.tab ||
      tab.getAttribute("aria-controls");

    tab.setAttribute("role", "tab");

    tab.tabIndex = index === 0 ? 0 : -1;

    tab.addEventListener("click", () => {

      academyActivateSettingsTab(tabName);

    });

    tab.addEventListener("keydown", (event) => {

      if (

        event.key !== "ArrowRight" &&

        event.key !== "ArrowLeft"

      ) {

        return;

      }

      event.preventDefault();

      const currentIndex = Array.from(
        academySettingsTabs
      ).indexOf(tab);

      const direction =
        event.key === "ArrowRight" ? 1 : -1;

      const nextIndex =
        (

          currentIndex +

          direction +

          academySettingsTabs.length

        ) %

        academySettingsTabs.length;

      academySettingsTabs[nextIndex].focus();

      academySettingsTabs[nextIndex].click();

    });

  });

  const savedTab = localStorage.getItem(
    ACADEMY_ACTIVE_TAB_KEY
  );

  const validSavedTab = Array.from(
    academySettingsSections
  ).some((section) => section.id === savedTab);

  const initialTab = validSavedTab
    ? savedTab
    : academySettingsSections[0]?.id;

  academyActivateSettingsTab(initialTab);

}


/* ==========================================================
   FORM FIELD HELPERS
========================================================== */

function academyFindField(...selectors) {

  for (const selector of selectors) {

    const element = document.querySelector(selector);

    if (element) {

      return element;

    }

  }

  return null;

}


function academyFindLabelControl(labelText) {

  const labels = Array.from(
    document.querySelectorAll(
      ".academy-settings-section label"
    )
  );

  const matchedLabel = labels.find((label) => {

    const labelContent = academyNormalizeText(
      label.childNodes[0]?.textContent
    ).toLowerCase();

    return labelContent.includes(
      labelText.toLowerCase()
    );

  });

  return matchedLabel?.querySelector(
    "input, textarea, select"
  ) || null;

}


/* ==========================================================
   FIELD REFERENCES
========================================================== */

function academyGetFields() {

  return {

    academyName: academyFindField(
      "#academyName",
      '[name="academyName"]'
    ) || academyFindLabelControl("Academy Name"),

    academyEmail: academyFindField(
      "#academyEmail",
      '[name="academyEmail"]'
    ) || academyFindLabelControl("Email Address"),

    academyPhone: academyFindField(
      "#academyPhone",
      '[name="academyPhone"]'
    ) || academyFindLabelControl("Phone Number"),

    academyWebsite: academyFindField(
      "#academyWebsite",
      '[name="academyWebsite"]'
    ) || academyFindLabelControl("Website"),

    academyAddress: academyFindField(
      "#academyAddress",
      '[name="academyAddress"]'
    ) || academyFindLabelControl("Academy Address"),

    academyAbout: academyFindField(
      "#academyAbout",
      '[name="academyAbout"]'
    ) || academyFindLabelControl("About Academy"),

    registeredEmail: academyFindField(
      "#academyRegisteredEmail",
      '[name="registeredEmail"]'
    ) || academyFindLabelControl("Registered Email"),

    accountNewPassword: academyFindField(
      "#academyAccountNewPassword",
      '[name="accountNewPassword"]'
    ),

    accountConfirmPassword: academyFindField(
      "#academyAccountConfirmPassword",
      '[name="accountConfirmPassword"]'
    ),

    twoFactorAuthentication: academyFindField(
      "#academyTwoFactorAuthentication",
      '[name="twoFactorAuthentication"]'
    ) || academyFindLabelControl(
      "Two-Factor Authentication"
    ),

    securityCurrentPassword: academyFindField(
      "#academyCurrentPassword",
      '[name="currentPassword"]'
    ),

    securityNewPassword: academyFindField(
      "#academySecurityNewPassword",
      '[name="securityNewPassword"]'
    ),

    securityConfirmPassword: academyFindField(
      "#academySecurityConfirmPassword",
      '[name="securityConfirmPassword"]'
    ),

    passwordStrength: academyFindField(
      "#academyPasswordStrength",
      'progress'
    ),

    academyLogo: academyFindField(
      "#academyLogoUpload",
      '[name="academyLogo"]'
    ),

    academyCover: academyFindField(
      "#academyCoverUpload",
      '[name="academyCover"]'
    ),

    primaryColor: academyFindField(
      "#academyPrimaryColor",
      '[name="primaryColor"]'
    ) || document.querySelector(
      '#branding input[type="color"]:nth-of-type(1)'
    ),

    secondaryColor: academyFindField(
      "#academySecondaryColor",
      '[name="secondaryColor"]'
    ) || document.querySelectorAll(
      '#branding input[type="color"]'
    )[1],

    language: academyFindField(
      "#academyLanguage",
      '[name="language"]'
    ) || academyFindLabelControl("Language"),

    timeZone: academyFindField(
      "#academyTimeZone",
      '[name="timeZone"]'
    ) || academyFindLabelControl("Time Zone"),

    dateFormat: academyFindField(
      "#academyDateFormat",
      '[name="dateFormat"]'
    ) || academyFindLabelControl("Date Format"),

    defaultView: academyFindField(
      "#academyDefaultView",
      '[name="defaultView"]'
    ) || academyFindLabelControl("Default View"),

    darkMode: academyFindField(
      "#academyDarkMode",
      '[name="darkMode"]'
    ) || academyFindLabelControl("Enable Dark Mode"),

    compactLayout: academyFindField(
      "#academyCompactLayout",
      '[name="compactLayout"]'
    ) || academyFindLabelControl("Compact Layout")

  };

}


/* ==========================================================
   NOTIFICATION FIELDS
========================================================== */

function academyGetNotificationCheckboxes() {

  const notificationSection =
    document.querySelector("#notifications");

  if (!notificationSection) {

    return {};

  }

  const checkboxLabels = Array.from(
    notificationSection.querySelectorAll("label")
  );

  const findCheckbox = (text) => {

    return checkboxLabels.find((label) =>

      academyNormalizeText(
        label.textContent
      ).toLowerCase().includes(text.toLowerCase())

    )?.querySelector('input[type="checkbox"]') || null;

  };

  return {

    newApplications:
      findCheckbox("New Player Applications"),

    newMessages:
      findCheckbox("New Messages"),

    trialReminders:
      findCheckbox("Trial Reminders"),

    playerRegistrations:
      findCheckbox("Player Registrations"),

    documentVerification:
      findCheckbox("Document Verification"),

    smsNotifications:
      findCheckbox("SMS Notifications"),

    emailNotifications:
      findCheckbox("Email Notifications"),

    pushNotifications:
      findCheckbox("Push Notifications")

  };

}


/* ==========================================================
   READ SETTINGS FROM PAGE
========================================================== */

function academyCollectSettingsFromPage() {

  const fields = academyGetFields();

  const notifications =
    academyGetNotificationCheckboxes();

  return {

    profile: {

      academyName:
        academyNormalizeText(
          fields.academyName?.value
        ),

      academyEmail:
        academyNormalizeText(
          fields.academyEmail?.value
        ),

      academyPhone:
        academyNormalizeText(
          fields.academyPhone?.value
        ),

      academyWebsite:
        academyNormalizeText(
          fields.academyWebsite?.value
        ),

      academyAddress:
        academyNormalizeText(
          fields.academyAddress?.value
        ),

      academyAbout:
        academyNormalizeText(
          fields.academyAbout?.value
        )

    },

    account: {

      registeredEmail:
        academyNormalizeText(
          fields.registeredEmail?.value
        ),

      twoFactorAuthentication:
        fields.twoFactorAuthentication?.value ||
        "Disabled"

    },

    notifications: {

      newApplications:
        Boolean(
          notifications.newApplications?.checked
        ),

      newMessages:
        Boolean(
          notifications.newMessages?.checked
        ),

      trialReminders:
        Boolean(
          notifications.trialReminders?.checked
        ),

      playerRegistrations:
        Boolean(
          notifications.playerRegistrations?.checked
        ),

      documentVerification:
        Boolean(
          notifications.documentVerification?.checked
        ),

      smsNotifications:
        Boolean(
          notifications.smsNotifications?.checked
        ),

      emailNotifications:
        Boolean(
          notifications.emailNotifications?.checked
        ),

      pushNotifications:
        Boolean(
          notifications.pushNotifications?.checked
        )

    },

    branding: {

      primaryColor:
        fields.primaryColor?.value || "#003B95",

      secondaryColor:
        fields.secondaryColor?.value || "#0A6CF1",

      academyLogo:
        academyLogoPreviewUrl ||
        academySettingsState.branding?.academyLogo ||
        "",

      coverImage:
        academyCoverPreviewUrl ||
        academySettingsState.branding?.coverImage ||
        ""

    },

    preferences: {

      language:
        fields.language?.value || "English",

      timeZone:
        fields.timeZone?.value ||
        "Asia/Kolkata",

      dateFormat:
        fields.dateFormat?.value ||
        "DD/MM/YYYY",

      defaultView:
        fields.defaultView?.value ||
        "Table",

      darkMode:
        Boolean(fields.darkMode?.checked),

      compactLayout:
        Boolean(fields.compactLayout?.checked)

    }

  };

}


/* ==========================================================
   POPULATE PAGE
========================================================== */

function academySetFieldValue(field, value) {

  if (!field || value === undefined) {

    return;

  }

  if (field.type === "checkbox") {

    field.checked = Boolean(value);

    return;

  }

  field.value = value;

}


function academyPopulateSettings(settings) {

  const fields = academyGetFields();

  const notifications =
    academyGetNotificationCheckboxes();

  academySetFieldValue(
    fields.academyName,
    settings.profile?.academyName
  );

  academySetFieldValue(
    fields.academyEmail,
    settings.profile?.academyEmail
  );

  academySetFieldValue(
    fields.academyPhone,
    settings.profile?.academyPhone
  );

  academySetFieldValue(
    fields.academyWebsite,
    settings.profile?.academyWebsite
  );

  academySetFieldValue(
    fields.academyAddress,
    settings.profile?.academyAddress
  );

  academySetFieldValue(
    fields.academyAbout,
    settings.profile?.academyAbout
  );

  academySetFieldValue(
    fields.registeredEmail,
    settings.account?.registeredEmail
  );

  academySetFieldValue(
    fields.twoFactorAuthentication,
    settings.account?.twoFactorAuthentication
  );

  Object.entries(notifications).forEach(
    ([key, checkbox]) => {

      academySetFieldValue(
        checkbox,
        settings.notifications?.[key]
      );

    }
  );

  academySetFieldValue(
    fields.primaryColor,
    settings.branding?.primaryColor
  );

  academySetFieldValue(
    fields.secondaryColor,
    settings.branding?.secondaryColor
  );

  academySetFieldValue(
    fields.language,
    settings.preferences?.language
  );

  academySetFieldValue(
    fields.timeZone,
    settings.preferences?.timeZone
  );

  academySetFieldValue(
    fields.dateFormat,
    settings.preferences?.dateFormat
  );

  academySetFieldValue(
    fields.defaultView,
    settings.preferences?.defaultView
  );

  academySetFieldValue(
    fields.darkMode,
    settings.preferences?.darkMode
  );

  academySetFieldValue(
    fields.compactLayout,
    settings.preferences?.compactLayout
  );

  academyApplyBrandColors(settings.branding);

  academyApplyPreferenceClasses(
    settings.preferences
  );

}


/* ==========================================================
   LOCAL STORAGE
========================================================== */

function academyLoadSettings() {

  const storedSettings = localStorage.getItem(
    ACADEMY_SETTINGS_STORAGE_KEY
  );

  if (!storedSettings) {

    return academyDeepClone(
      academyDefaultSettings
    );

  }

  try {

    const parsedSettings = JSON.parse(
      storedSettings
    );

    return {

      profile: {

        ...academyDefaultSettings.profile,

        ...parsedSettings.profile

      },

      account: {

        ...academyDefaultSettings.account,

        ...parsedSettings.account

      },

      notifications: {

        ...academyDefaultSettings.notifications,

        ...parsedSettings.notifications

      },

      branding: {

        ...academyDefaultSettings.branding,

        ...parsedSettings.branding

      },

      preferences: {

        ...academyDefaultSettings.preferences,

        ...parsedSettings.preferences

      }

    };

  } catch (error) {

    console.error(
      "Unable to load academy settings:",
      error
    );

    return academyDeepClone(
      academyDefaultSettings
    );

  }

}


function academyPersistSettings(settings) {

  localStorage.setItem(

    ACADEMY_SETTINGS_STORAGE_KEY,

    JSON.stringify(settings)

  );

}


/* ==========================================================
   VALIDATION
========================================================== */

function academyValidateProfile(settings) {

  if (!settings.profile.academyName) {

    academyShowToast(
      "Academy name is required.",
      "error"
    );

    academyActivateSettingsTab("profile");

    return false;

  }

  if (

    settings.profile.academyEmail &&

    !academyIsValidEmail(
      settings.profile.academyEmail
    )

  ) {

    academyShowToast(
      "Enter a valid academy email address.",
      "error"
    );

    academyActivateSettingsTab("profile");

    return false;

  }

  if (

    settings.profile.academyWebsite &&

    !academyIsValidUrl(
      settings.profile.academyWebsite
    )

  ) {

    academyShowToast(
      "Enter a valid website address.",
      "error"
    );

    academyActivateSettingsTab("profile");

    return false;

  }

  return true;

}


function academyValidateAccount(settings) {

  const fields = academyGetFields();

  if (

    settings.account.registeredEmail &&

    !academyIsValidEmail(
      settings.account.registeredEmail
    )

  ) {

    academyShowToast(
      "Enter a valid registered email.",
      "error"
    );

    academyActivateSettingsTab("account");

    return false;

  }

  const newPassword =
    fields.accountNewPassword?.value || "";

  const confirmPassword =
    fields.accountConfirmPassword?.value || "";

  if (

    newPassword &&

    newPassword.length < 8

  ) {

    academyShowToast(
      "New password must contain at least 8 characters.",
      "error"
    );

    academyActivateSettingsTab("account");

    return false;

  }

  if (

    newPassword !== confirmPassword

  ) {

    academyShowToast(
      "Account password confirmation does not match.",
      "error"
    );

    academyActivateSettingsTab("account");

    return false;

  }

  return true;

}


function academyValidateSecurity() {

  const fields = academyGetFields();

  const newPassword =
    fields.securityNewPassword?.value || "";

  const confirmPassword =
    fields.securityConfirmPassword?.value || "";

  if (!newPassword && !confirmPassword) {

    return true;

  }

  if (!fields.securityCurrentPassword?.value) {

    academyShowToast(
      "Enter your current password.",
      "error"
    );

    academyActivateSettingsTab("security");

    return false;

  }

  if (newPassword.length < 8) {

    academyShowToast(
      "Security password must contain at least 8 characters.",
      "error"
    );

    academyActivateSettingsTab("security");

    return false;

  }

  if (newPassword !== confirmPassword) {

    academyShowToast(
      "Security password confirmation does not match.",
      "error"
    );

    academyActivateSettingsTab("security");

    return false;

  }

  return true;

}


function academyValidateSettings(settings) {

  return (

    academyValidateProfile(settings) &&

    academyValidateAccount(settings) &&

    academyValidateSecurity()

  );

}


/* ==========================================================
   SAVE SETTINGS
========================================================== */

async function academySaveAllSettings() {

  const collectedSettings =
    academyCollectSettingsFromPage();

  if (

    !academyValidateSettings(
      collectedSettings
    )

  ) {

    return;

  }

  const originalButtonHTML =
    academySaveAllButton?.innerHTML;

  if (academySaveAllButton) {

    academySaveAllButton.disabled = true;

    academySaveAllButton.innerHTML = `

      <i class="fa-solid fa-spinner fa-spin"></i>

      Saving...

    `;

  }

  try {

    /*
      Backend integration for Mr. Harsh:

      await AcademySettingsAPI.updateAll(
        collectedSettings
      );
    */

    await new Promise((resolve) =>

      window.setTimeout(resolve, 700)

    );

    academySettingsState =
      academyDeepClone(collectedSettings);

    academyInitialSettingsState =
      academyDeepClone(collectedSettings);

    academyPersistSettings(
      academySettingsState
    );

    academySetUnsavedChanges(false);

    academyClearPasswordFields();

    academyShowToast(
      "All settings saved successfully.",
      "success"
    );

  } catch (error) {

    console.error(
      "Unable to save academy settings:",
      error
    );

    academyShowToast(
      "Settings could not be saved.",
      "error"
    );

  } finally {

    if (academySaveAllButton) {

      academySaveAllButton.disabled = false;

      academySaveAllButton.innerHTML =
        originalButtonHTML ||
        "Save All Changes";

    }

  }

}


/* ==========================================================
   UNSAVED CHANGES
========================================================== */

function academySetUnsavedChanges(value) {

  academyHasUnsavedChanges = value;

  document.body.classList.toggle(
    "academy-has-unsaved-changes",
    value
  );

  if (academySaveAllButton) {

    academySaveAllButton.classList.toggle(
      "has-changes",
      value
    );

  }

}


function academyHandleSettingsChange() {

  const currentSettings =
    academyCollectSettingsFromPage();

  const hasChanged =

    JSON.stringify(currentSettings) !==

    JSON.stringify(academyInitialSettingsState);

  academySetUnsavedChanges(hasChanged);

}


function academyInitializeChangeTracking() {

  document
    .querySelectorAll(
      ".academy-settings-section input, " +
      ".academy-settings-section textarea, " +
      ".academy-settings-section select"
    )
    .forEach((control) => {

      control.addEventListener(
        "input",
        academyHandleSettingsChange
      );

      control.addEventListener(
        "change",
        academyHandleSettingsChange
      );

    });

}


/* ==========================================================
   PASSWORD STRENGTH
========================================================== */

function academyCalculatePasswordStrength(password) {

  let score = 0;

  if (password.length >= 8) {

    score += 25;

  }

  if (password.length >= 12) {

    score += 15;

  }

  if (/[a-z]/.test(password)) {

    score += 15;

  }

  if (/[A-Z]/.test(password)) {

    score += 15;

  }

  if (/\d/.test(password)) {

    score += 15;

  }

  if (/[^A-Za-z0-9]/.test(password)) {

    score += 15;

  }

  return Math.min(score, 100);

}


function academyUpdatePasswordStrength(password) {

  const fields = academyGetFields();

  if (!fields.passwordStrength) {

    return;

  }

  const score =
    academyCalculatePasswordStrength(password);

  fields.passwordStrength.value = score;

  fields.passwordStrength.setAttribute(
    "aria-valuenow",
    String(score)
  );

}


function academyInitializePasswordStrength() {

  const fields = academyGetFields();

  fields.securityNewPassword?.addEventListener(

    "input",

    (event) => {

      academyUpdatePasswordStrength(
        event.target.value
      );

    }

  );

}


/* ==========================================================
   SHOW / HIDE PASSWORDS
========================================================== */

function academyCreatePasswordToggle(passwordField) {

  if (

    !passwordField ||

    passwordField.parentElement?.querySelector(
      ".academy-password-toggle"
    )

  ) {

    return;

  }

  const wrapper = document.createElement("div");

  wrapper.className =
    "academy-password-field";

  passwordField.parentNode.insertBefore(
    wrapper,
    passwordField
  );

  wrapper.appendChild(passwordField);

  const toggleButton =
    document.createElement("button");

  toggleButton.type = "button";

  toggleButton.className =
    "academy-password-toggle";

  toggleButton.setAttribute(
    "aria-label",
    "Show password"
  );

  toggleButton.innerHTML = `

    <i class="fa-solid fa-eye"></i>

  `;

  wrapper.appendChild(toggleButton);

  toggleButton.addEventListener("click", () => {

    const shouldShow =
      passwordField.type === "password";

    passwordField.type =
      shouldShow ? "text" : "password";

    toggleButton.setAttribute(

      "aria-label",

      shouldShow
        ? "Hide password"
        : "Show password"

    );

    toggleButton.innerHTML = `

      <i class="fa-solid ${
        shouldShow ? "fa-eye-slash" : "fa-eye"
      }"></i>

    `;

  });

}


function academyInitializePasswordToggles() {

  document
    .querySelectorAll(
      '.academy-settings-section input[type="password"]'
    )
    .forEach(academyCreatePasswordToggle);

}


function academyClearPasswordFields() {

  document
    .querySelectorAll(
      '.academy-settings-section input[type="password"], ' +
      '.academy-settings-section input[type="text"].password-visible'
    )
    .forEach((field) => {

      field.value = "";

    });

  academyUpdatePasswordStrength("");

}


/* ==========================================================
   IMAGE PREVIEWS
========================================================== */

function academyReadImageFile(file) {

  return new Promise((resolve, reject) => {

    const reader = new FileReader();

    reader.onload = () => resolve(reader.result);

    reader.onerror = () => reject(
      new Error("Unable to read image file.")
    );

    reader.readAsDataURL(file);

  });

}


function academyValidateImageFile(file) {

  const allowedTypes = [

    "image/jpeg",

    "image/png",

    "image/webp"

  ];

  const maximumSize =
    5 * 1024 * 1024;

  if (!allowedTypes.includes(file.type)) {

    academyShowToast(
      "Use a JPG, PNG or WebP image.",
      "error"
    );

    return false;

  }

  if (file.size > maximumSize) {

    academyShowToast(
      "Image size must be below 5 MB.",
      "error"
    );

    return false;

  }

  return true;

}


async function academyHandleImageUpload(

  event,

  imageType

) {

  const file = event.target.files?.[0];

  if (!file) {

    return;

  }

  if (!academyValidateImageFile(file)) {

    event.target.value = "";

    return;

  }

  try {

    const imageUrl =
      await academyReadImageFile(file);

    if (imageType === "logo") {

      academyLogoPreviewUrl = imageUrl;

      academyUpdateLogoPreview(imageUrl);

    } else {

      academyCoverPreviewUrl = imageUrl;

      academyUpdateCoverPreview(imageUrl);

    }

    academyHandleSettingsChange();

    academyShowToast(
      `${
        imageType === "logo"
          ? "Logo"
          : "Cover image"
      } selected. Save changes to keep it.`,
      "info"
    );

  } catch (error) {

    console.error(error);

    academyShowToast(
      "The selected image could not be processed.",
      "error"
    );

  }

}


function academyUpdateLogoPreview(imageUrl) {

  const previewSelectors = [

    "#academyLogoPreview",

    ".academy-logo-preview img",

    ".academy-sidebar .academy-logo img"

  ];

  previewSelectors.forEach((selector) => {

    document
      .querySelectorAll(selector)
      .forEach((image) => {

        image.src = imageUrl;

      });

  });

}


function academyUpdateCoverPreview(imageUrl) {

  const coverPreview = document.querySelector(
    "#academyCoverPreview"
  );

  if (coverPreview?.tagName === "IMG") {

    coverPreview.src = imageUrl;

  } else if (coverPreview) {

    coverPreview.style.backgroundImage =
      `url("${imageUrl}")`;

  }

}


function academyInitializeImageUploads() {

  const fields = academyGetFields();

  fields.academyLogo?.addEventListener(

    "change",

    (event) => {

      academyHandleImageUpload(
        event,
        "logo"
      );

    }

  );

  fields.academyCover?.addEventListener(

    "change",

    (event) => {

      academyHandleImageUpload(
        event,
        "cover"
      );

    }

  );

}


/* ==========================================================
   BRANDING
========================================================== */

function academyApplyBrandColors(branding = {}) {

  const primaryColor =
    branding.primaryColor || "#003B95";

  const secondaryColor =
    branding.secondaryColor || "#0A6CF1";

  document.documentElement.style.setProperty(
    "--primary",
    primaryColor
  );

  document.documentElement.style.setProperty(
    "--academy-brand-secondary",
    secondaryColor
  );

  const hero = document.querySelector(
    ".academy-page-hero"
  );

  if (hero) {

    hero.style.background = `linear-gradient(
      135deg,
      ${primaryColor},
      ${secondaryColor}
    )`;

  }

}


function academyInitializeBrandingControls() {

  const fields = academyGetFields();

  const handleColorUpdate = () => {

    academyApplyBrandColors({

      primaryColor:
        fields.primaryColor?.value,

      secondaryColor:
        fields.secondaryColor?.value

    });

    academyHandleSettingsChange();

  };

  fields.primaryColor?.addEventListener(
    "input",
    handleColorUpdate
  );

  fields.secondaryColor?.addEventListener(
    "input",
    handleColorUpdate
  );

}


/* ==========================================================
   PREFERENCES
========================================================== */

function academyApplyPreferenceClasses(
  preferences = {}
) {

  document.body.classList.toggle(

    "academy-dark-mode",

    Boolean(preferences.darkMode)

  );

  document.body.classList.toggle(

    "academy-compact-mode",

    Boolean(preferences.compactLayout)

  );

  localStorage.setItem(

    ACADEMY_THEME_KEY,

    preferences.darkMode ? "dark" : "light"

  );

}


function academyInitializePreferences() {

  const fields = academyGetFields();

  const handlePreferenceChange = () => {

    academyApplyPreferenceClasses({

      darkMode:
        Boolean(fields.darkMode?.checked),

      compactLayout:
        Boolean(fields.compactLayout?.checked)

    });

    academyHandleSettingsChange();

  };

  fields.darkMode?.addEventListener(

    "change",

    handlePreferenceChange

  );

  fields.compactLayout?.addEventListener(

    "change",

    handlePreferenceChange

  );

}


/* ==========================================================
   DATA MANAGEMENT
========================================================== */

function academyDownloadJSONFile(

  filename,

  data

) {

  const blob = new Blob(

    [JSON.stringify(data, null, 2)],

    { type: "application/json" }

  );

  const downloadUrl =
    URL.createObjectURL(blob);

  const anchor =
    document.createElement("a");

  anchor.href = downloadUrl;

  anchor.download = filename;

  document.body.appendChild(anchor);

  anchor.click();

  anchor.remove();

  URL.revokeObjectURL(downloadUrl);

}


function academyInitializeDataActions() {

  const dataSection =
    document.querySelector("#data");

  if (!dataSection) {

    return;

  }

  const buttons = Array.from(
    dataSection.querySelectorAll("button")
  );

  buttons.forEach((button) => {

    const buttonText =
      academyNormalizeText(
        button.textContent
      ).toLowerCase();

    button.addEventListener("click", () => {

      if (buttonText.includes("export players")) {

        /*
          Backend:
          GET /api/settings/export?type=players
        */

        academyDownloadJSONFile(
          "academy-players-export.json",
          {
            message:
              "Player export placeholder",
            generatedAt:
              new Date().toISOString()
          }
        );

        academyShowToast(
          "Player export generated.",
          "success"
        );

        return;

      }

      if (buttonText.includes("export documents")) {

        academyDownloadJSONFile(
          "academy-documents-export.json",
          {
            message:
              "Document export placeholder",
            generatedAt:
              new Date().toISOString()
          }
        );

        academyShowToast(
          "Document export generated.",
          "success"
        );

        return;

      }

      if (buttonText.includes("export applications")) {

        academyDownloadJSONFile(
          "academy-applications-export.json",
          {
            message:
              "Application export placeholder",
            generatedAt:
              new Date().toISOString()
          }
        );

        academyShowToast(
          "Application export generated.",
          "success"
        );

        return;

      }

      if (buttonText.includes("download reports")) {

        academyShowToast(
          "Report generation will be connected to the backend.",
          "info"
        );

        return;

      }

      if (buttonText.includes("backup data")) {

        academyDownloadJSONFile(
          "academy-settings-backup.json",
          academyCollectSettingsFromPage()
        );

        academyShowToast(
          "Settings backup downloaded.",
          "success"
        );

        return;

      }

      if (buttonText.includes("restore backup")) {

        academyCreateRestoreInput();

      }

    });

  });

}


function academyCreateRestoreInput() {

  const restoreInput =
    document.createElement("input");

  restoreInput.type = "file";

  restoreInput.accept =
    "application/json,.json";

  restoreInput.hidden = true;

  document.body.appendChild(restoreInput);

  restoreInput.addEventListener(
    "change",
    async () => {

      const file =
        restoreInput.files?.[0];

      if (!file) {

        restoreInput.remove();

        return;

      }

      try {

        const fileText =
          await file.text();

        const restoredSettings =
          JSON.parse(fileText);

        academySettingsState = {

          profile: {

            ...academyDefaultSettings.profile,

            ...restoredSettings.profile

          },

          account: {

            ...academyDefaultSettings.account,

            ...restoredSettings.account

          },

          notifications: {

            ...academyDefaultSettings.notifications,

            ...restoredSettings.notifications

          },

          branding: {

            ...academyDefaultSettings.branding,

            ...restoredSettings.branding

          },

          preferences: {

            ...academyDefaultSettings.preferences,

            ...restoredSettings.preferences

          }

        };

        academyPopulateSettings(
          academySettingsState
        );

        academySetUnsavedChanges(true);

        academyShowToast(
          "Backup restored. Save changes to confirm.",
          "success"
        );

      } catch (error) {

        console.error(error);

        academyShowToast(
          "Invalid backup file.",
          "error"
        );

      } finally {

        restoreInput.remove();

      }

    }
  );

  restoreInput.click();

}


/* ==========================================================
   ACTIVE SESSIONS
========================================================== */

function academyInitializeSessionActions() {

  const accountSection =
    document.querySelector("#account");

  if (!accountSection) {

    return;

  }

  accountSection
    .querySelectorAll(
      ".academy-simple-table .academy-danger-button"
    )
    .forEach((button) => {

      button.addEventListener("click", () => {

        const row = button.closest("tr");

        button.disabled = true;

        button.textContent = "Logged out";

        row?.classList.add(
          "academy-session-ended"
        );

        academyShowToast(
          "The selected session has been logged out.",
          "success"
        );

        /*
          Backend:
          DELETE /api/settings/sessions/:id
        */

      });

    });

}


/* ==========================================================
   SECURITY ACTIONS
========================================================== */

function academyInitializeSecurityActions() {

  const securitySection =
    document.querySelector("#security");

  if (!securitySection) {

    return;

  }

  const logoutOtherDevicesButton =
    Array.from(
      securitySection.querySelectorAll("button")
    ).find((button) =>

      academyNormalizeText(
        button.textContent
      ).toLowerCase().includes(
        "logout other devices"
      )

    );

  logoutOtherDevicesButton?.addEventListener(

    "click",

    () => {

      const confirmed = window.confirm(

        "Logout all other active devices?"

      );

      if (!confirmed) {

        return;

      }

      /*
        Backend:
        POST /api/settings/security/logout-other-devices
      */

      academyShowToast(
        "All other devices have been logged out.",
        "success"
      );

    }

  );

}


/* ==========================================================
   DANGER ZONE
========================================================== */

function academyResetSettings() {

  const confirmed = window.confirm(

    "Reset all settings to their default values?"

  );

  if (!confirmed) {

    return;

  }

  academySettingsState =
    academyDeepClone(academyDefaultSettings);

  academyPopulateSettings(
    academySettingsState
  );

  academySetUnsavedChanges(true);

  academyShowToast(
    "Default settings restored. Save changes to confirm.",
    "warning"
  );

}


function academyClearCache() {

  const confirmed = window.confirm(

    "Clear saved frontend cache and temporary settings?"

  );

  if (!confirmed) {

    return;

  }

  localStorage.removeItem(
    ACADEMY_ACTIVE_TAB_KEY
  );

  sessionStorage.clear();

  academyLogoPreviewUrl = "";

  academyCoverPreviewUrl = "";

  academyShowToast(
    "Temporary cache cleared.",
    "success"
  );

}


function academyDeleteAcademy() {

  const confirmationText = window.prompt(

    'Type "DELETE" to confirm academy account deletion.'

  );

  if (confirmationText !== "DELETE") {

    academyShowToast(
      "Academy deletion cancelled.",
      "info"
    );

    return;

  }

  /*
    Backend for Mr. Harsh:

    await AcademySettingsAPI.deleteAccount();
  */

  academyShowToast(
    "Frontend deletion request confirmed. Backend connection is required.",
    "warning",
    5000
  );

}


function academyInitializeDangerZone() {

  academyResetSettingsButton?.addEventListener(

    "click",

    academyResetSettings

  );

  academyClearCacheButton?.addEventListener(

    "click",

    academyClearCache

  );

  academyDeleteAcademyButton?.addEventListener(

    "click",

    academyDeleteAcademy

  );

}


/* ==========================================================
   LOGOUT MODAL
========================================================== */

function academyOpenLogoutModal() {

  if (!academyLogoutModal) {

    return;

  }

  academyLogoutModal.hidden = false;

  document.body.classList.add(
    "academy-modal-open"
  );

  academyConfirmLogout?.focus();

}


function academyCloseLogoutModal() {

  if (!academyLogoutModal) {

    return;

  }

  academyLogoutModal.hidden = true;

  document.body.classList.remove(
    "academy-modal-open"
  );

  academyLogoutButton?.focus();

}


function academyHandleLogout() {

  /*
    Backend integration:

    POST /api/auth/logout
  */

  localStorage.removeItem(
    "fmi_academy_auth_token"
  );

  sessionStorage.clear();

  academyShowToast(
    "Logging out...",
    "info",
    1200
  );

  window.setTimeout(() => {

    window.location.href = "login.html";

  }, 900);

}


function academyInitializeLogout() {

  academyLogoutButton?.addEventListener(

    "click",

    academyOpenLogoutModal

  );

  academyLogoutCloseButtons.forEach(
    (button) => {

      button.addEventListener(

        "click",

        academyCloseLogoutModal

      );

    }
  );

  academyConfirmLogout?.addEventListener(

    "click",

    academyHandleLogout

  );

  academyLogoutModal?.addEventListener(

    "click",

    (event) => {

      if (event.target === academyLogoutModal) {

        academyCloseLogoutModal();

      }

    }

  );

}


/* ==========================================================
   KEYBOARD SHORTCUTS
========================================================== */

function academyInitializeKeyboardShortcuts() {

  document.addEventListener("keydown", (event) => {

    if (

      event.key === "Escape" &&

      academyIsModalOpen(academyLogoutModal)

    ) {

      academyCloseLogoutModal();

      return;

    }

    if (

      (event.ctrlKey || event.metaKey) &&

      event.key.toLowerCase() === "s"

    ) {

      event.preventDefault();

      academySaveAllSettings();

    }

  });

}


/* ==========================================================
   ACCESSIBILITY
========================================================== */

function academyInitializeAccessibility() {

  academySettingsTabs.forEach((tab) => {

    const targetName =
      tab.dataset.settingsTab ||
      tab.dataset.tab ||
      tab.getAttribute("aria-controls");

    tab.setAttribute("aria-controls", targetName);

  });

  academySettingsSections.forEach((section) => {

    section.setAttribute("role", "tabpanel");

    section.setAttribute("tabindex", "0");

  });

  if (academyLogoutModal) {

    academyLogoutModal.setAttribute(
      "role",
      "dialog"
    );

    academyLogoutModal.setAttribute(
      "aria-modal",
      "true"
    );

    academyLogoutModal.setAttribute(
      "aria-labelledby",
      "academyLogoutModalTitle"
    );

  }

}


/* ==========================================================
   API PLACEHOLDER
========================================================== */

class AcademySettingsAPI {

  static async request(

    endpoint,

    options = {}

  ) {

    const response = await fetch(endpoint, {

      headers: {

        "Content-Type": "application/json",

        ...options.headers

      },

      ...options

    });

    if (!response.ok) {

      throw new Error(

        `Academy settings API error: ${response.status}`

      );

    }

    if (response.status === 204) {

      return null;

    }

    return response.json();

  }


  static getSettings() {

    return this.request(
      "/api/settings"
    );

  }


  static updateProfile(profileData) {

    return this.request(
      "/api/settings/profile",
      {
        method: "PUT",
        body: JSON.stringify(profileData)
      }
    );

  }


  static updateAccount(accountData) {

    return this.request(
      "/api/settings/account",
      {
        method: "PUT",
        body: JSON.stringify(accountData)
      }
    );

  }


  static updateSecurity(securityData) {

    return this.request(
      "/api/settings/security",
      {
        method: "PUT",
        body: JSON.stringify(securityData)
      }
    );

  }


  static updatePreferences(preferenceData) {

    return this.request(
      "/api/settings/preferences",
      {
        method: "PUT",
        body: JSON.stringify(preferenceData)
      }
    );

  }


  static updateNotifications(notificationData) {

    return this.request(
      "/api/settings/notifications",
      {
        method: "PUT",
        body: JSON.stringify(notificationData)
      }
    );

  }


  static uploadLogo(formData) {

    return fetch(
      "/api/settings/logo",
      {
        method: "POST",
        body: formData
      }
    );

  }


  static uploadCover(formData) {

    return fetch(
      "/api/settings/cover",
      {
        method: "POST",
        body: formData
      }
    );

  }


  static createBackup() {

    return this.request(
      "/api/settings/backup",
      {
        method: "POST"
      }
    );

  }


  static restoreBackup(backupData) {

    return this.request(
      "/api/settings/restore",
      {
        method: "POST",
        body: JSON.stringify(backupData)
      }
    );

  }


  static deleteAccount() {

    return this.request(
      "/api/settings/account",
      {
        method: "DELETE"
      }
    );

  }

}


/* ==========================================================
   BEFORE UNLOAD PROTECTION
========================================================== */

function academyInitializeBeforeUnload() {

  window.addEventListener(

    "beforeunload",

    (event) => {

      if (!academyHasUnsavedChanges) {

        return;

      }

      event.preventDefault();

      event.returnValue = "";

    }

  );

}


/* ==========================================================
   INITIALIZATION
========================================================== */

function academyInitializeSettingsPage() {

  academySettingsState =
    academyLoadSettings();

  academyInitialSettingsState =
    academyDeepClone(
      academySettingsState
    );

  academyPopulateSettings(
    academySettingsState
  );

  academyInitializeSidebar();

  academyInitializeProfileDropdown();

  academyInitializeTabs();

  academyInitializeChangeTracking();

  academyInitializePasswordStrength();

  academyInitializePasswordToggles();

  academyInitializeImageUploads();

  academyInitializeBrandingControls();

  academyInitializePreferences();

  academyInitializeDataActions();

  academyInitializeSessionActions();

  academyInitializeSecurityActions();

  academyInitializeDangerZone();

  academyInitializeLogout();

  academyInitializeKeyboardShortcuts();

  academyInitializeAccessibility();

  academyInitializeBeforeUnload();

  academySaveAllButton?.addEventListener(

    "click",

    academySaveAllSettings

  );

  academySetUnsavedChanges(false);

}


/* ==========================================================
   START APPLICATION
========================================================== */

document.addEventListener(

  "DOMContentLoaded",

  academyInitializeSettingsPage

);


/* ==========================================================
   GLOBAL FRONTEND API
========================================================== */

window.AcademySettingsAPI =
  AcademySettingsAPI;

window.AcademySettings = {

  save: academySaveAllSettings,

  reset: academyResetSettings,

  getState() {

    return academyDeepClone(
      academySettingsState
    );

  }

};