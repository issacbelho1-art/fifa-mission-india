/* =====================================================
   EVENT REGISTRATION PAGE
   event-registration.js

   PART 1A
   LOADER • NAVBAR • MOBILE MENU
   STEP NAVIGATION • PROGRESS • FORM CONTROLS
   VALIDATION ARCHITECTURE • BACKEND PLACEHOLDERS
===================================================== */

"use strict";


/* =====================================================
   APPLICATION CONFIGURATION
===================================================== */

const EVENT_REGISTRATION_CONFIG = Object.freeze({

  totalSteps: 6,

  maximumFileSize: 5 * 1024 * 1024,

  allowedImageTypes: [
    "image/jpeg",
    "image/png",
    "image/webp"
  ],

  allowedDocumentTypes: [
    "application/pdf",
    "image/jpeg",
    "image/png",
    "image/webp"
  ],

  endpoints: Object.freeze({

    eventDetails:
      "/api/v1/events/:eventId",

    createRegistration:
      "/api/v1/events/:eventId/registrations",

    uploadDocument:
      "/api/v1/events/:eventId/registrations/:registrationId/documents",

    registrationStatus:
      "/api/v1/events/:eventId/registrations/:registrationId"

  }),

  storageKeys: Object.freeze({

    draft:
      "fifaMissionIndiaEventRegistrationDraft",

    currentStep:
      "fifaMissionIndiaEventRegistrationStep"

  })

});


/* =====================================================
   APPLICATION STATE
===================================================== */

const eventRegistrationState = {

  currentStep: 1,

  totalSteps:
    EVENT_REGISTRATION_CONFIG.totalSteps,

  eventId: null,

  eventData: null,

  formData: {},

  uploadedFiles: new Map(),

  isSubmitting: false,

  isMobileMenuOpen: false

};


/* =====================================================
   DOM ELEMENT REFERENCES
===================================================== */

const eventRegistrationElements = {

  loader:
    document.getElementById(
      "eventRegistrationLoader"
    ),

  navbar:
    document.querySelector(
      ".event-registration-navbar"
    ),

  mobileMenuButton:
    document.getElementById(
      "eventRegistrationMenuButton"
    ),

  mobileMenu:
    document.getElementById(
      "eventRegistrationMobileMenu"
    ),

  mobileMenuCloseButton:
    document.getElementById(
      "eventRegistrationMenuClose"
    ),

  mobileOverlay:
    document.getElementById(
      "eventRegistrationMobileOverlay"
    ),

  mobileNavigationLinks:
    document.querySelectorAll(
      ".event-registration-mobile-nav a"
    ),

  registrationForm:
    document.getElementById(
      "eventRegistrationForm"
    ),

  formSteps:
    document.querySelectorAll(
      "[data-registration-step]"
    ),

  stepButtons:
    document.querySelectorAll(
      "[data-step-target]"
    ),

  progressBar:
    document.getElementById(
      "eventRegistrationProgressBar"
    ),

  progressText:
    document.getElementById(
      "eventRegistrationProgressText"
    ),

  progressPercentage:
    document.getElementById(
      "eventRegistrationProgressPercentage"
    ),

  previousButton:
    document.getElementById(
      "eventRegistrationPreviousButton"
    ),

  nextButton:
    document.getElementById(
      "eventRegistrationNextButton"
    ),

  navigationStatus:
    document.getElementById(
      "eventRegistrationNavigationStatus"
    ),

  submitButton:
    document.getElementById(
      "eventRegistrationSubmitButton"
    ),

  downloadButton:
    document.getElementById(
      "eventRegistrationDownloadButton"
    ),

  reviewSummary:
    document.getElementById(
      "eventRegistrationReviewSummary"
    ),

  successModal:
    document.getElementById(
      "eventRegistrationSuccessModal"
    ),

  successId:
    document.getElementById(
      "eventRegistrationSuccessId"
    ),

  successEvent:
    document.getElementById(
      "eventRegistrationSuccessEvent"
    )

};


/* =====================================================
   INITIALIZATION
===================================================== */

document.addEventListener(
  "DOMContentLoaded",
  initializeEventRegistrationPage
);


async function initializeEventRegistrationPage() {

  initializeLoader();

  initializeNavbarScroll();

  initializeMobileMenu();

  initializeStepNavigation();

  initializeFormNavigation();

  initializeFormValidationListeners();

  initializeCharacterCounters();

  initializePhoneNumberFields();

  initializeGuardianAddressToggle();

  initializeEventId();

  restoreSavedDraft();

  updateStepInterface();

  await loadEventDetails();

}


/* =====================================================
   PAGE LOADER
===================================================== */

function initializeLoader() {

  if (!eventRegistrationElements.loader) {
    return;
  }

  window.addEventListener(
    "load",
    hidePageLoader
  );

  window.setTimeout(
    hidePageLoader,
    1800
  );

}


function hidePageLoader() {

  if (!eventRegistrationElements.loader) {
    return;
  }

  eventRegistrationElements.loader.classList.add(
    "is-hidden"
  );

  window.setTimeout(() => {

    eventRegistrationElements.loader.hidden = true;

  }, 400);

}


/* =====================================================
   NAVBAR SCROLL STATE
===================================================== */

function initializeNavbarScroll() {

  if (!eventRegistrationElements.navbar) {
    return;
  }

  const updateNavbarState = () => {

    eventRegistrationElements.navbar.classList.toggle(
      "is-scrolled",
      window.scrollY > 16
    );

  };

  updateNavbarState();

  window.addEventListener(
    "scroll",
    updateNavbarState,
    {
      passive: true
    }
  );

}


/* =====================================================
   MOBILE MENU
===================================================== */

function initializeMobileMenu() {

  const {
    mobileMenuButton,
    mobileMenuCloseButton,
    mobileMenu,
    mobileOverlay,
    mobileNavigationLinks
  } = eventRegistrationElements;

  if (
    !mobileMenuButton ||
    !mobileMenu ||
    !mobileOverlay
  ) {
    return;
  }

  mobileMenuButton.addEventListener(
    "click",
    openMobileMenu
  );

  mobileMenuCloseButton?.addEventListener(
    "click",
    closeMobileMenu
  );

  mobileOverlay.addEventListener(
    "click",
    closeMobileMenu
  );

  mobileNavigationLinks.forEach(link => {

    link.addEventListener(
      "click",
      closeMobileMenu
    );

  });

  document.addEventListener(
    "keydown",
    handleMobileMenuKeyboard
  );

  window.addEventListener(
    "resize",
    handleResponsiveMenuReset
  );

}


function openMobileMenu() {

  const {
    mobileMenu,
    mobileOverlay,
    mobileMenuButton
  } = eventRegistrationElements;

  if (
    !mobileMenu ||
    !mobileOverlay
  ) {
    return;
  }

  eventRegistrationState.isMobileMenuOpen = true;

  mobileOverlay.hidden = false;

  mobileMenu.hidden = false;

  document.body.classList.add(
    "event-registration-menu-open"
  );

  mobileMenuButton?.setAttribute(
    "aria-expanded",
    "true"
  );

  requestAnimationFrame(() => {

    mobileOverlay.classList.add(
      "is-visible"
    );

    mobileMenu.classList.add(
      "is-open"
    );

  });

  const firstFocusableElement =
    mobileMenu.querySelector(
      "button, a, input, select, textarea"
    );

  firstFocusableElement?.focus();

}


function closeMobileMenu() {

  const {
    mobileMenu,
    mobileOverlay,
    mobileMenuButton
  } = eventRegistrationElements;

  if (
    !mobileMenu ||
    !mobileOverlay
  ) {
    return;
  }

  eventRegistrationState.isMobileMenuOpen = false;

  mobileOverlay.classList.remove(
    "is-visible"
  );

  mobileMenu.classList.remove(
    "is-open"
  );

  document.body.classList.remove(
    "event-registration-menu-open"
  );

  mobileMenuButton?.setAttribute(
    "aria-expanded",
    "false"
  );

  window.setTimeout(() => {

    mobileOverlay.hidden = true;

    mobileMenu.hidden = true;

  }, 300);

}


function handleMobileMenuKeyboard(event) {

  if (
    event.key === "Escape" &&
    eventRegistrationState.isMobileMenuOpen
  ) {
    closeMobileMenu();
  }

}


function handleResponsiveMenuReset() {

  if (
    window.innerWidth > 900 &&
    eventRegistrationState.isMobileMenuOpen
  ) {
    closeMobileMenu();
  }

}


/* =====================================================
   EVENT ID
===================================================== */

function initializeEventId() {

  const queryParameters =
    new URLSearchParams(
      window.location.search
    );

  const queryEventId =
    queryParameters.get("event");

  const formEventId =
    eventRegistrationElements.registrationForm
      ?.dataset.eventId;

  eventRegistrationState.eventId =
    queryEventId ||
    formEventId ||
    "default-event";

}


/* =====================================================
   STEP NAVIGATION
===================================================== */

function initializeStepNavigation() {

  eventRegistrationElements.stepButtons
    .forEach(button => {

      button.addEventListener(
        "click",
        handleStepButtonClick
      );

    });

}


function handleStepButtonClick(event) {

  const stepButton =
    event.currentTarget;

  const requestedStep =
    Number(
      stepButton.dataset.stepTarget
    );

  if (
    !Number.isInteger(requestedStep) ||
    requestedStep < 1 ||
    requestedStep >
      eventRegistrationState.totalSteps
  ) {
    return;
  }

  if (
    requestedStep >
    eventRegistrationState.currentStep
  ) {

    const currentStepIsValid =
      validateCurrentStep();

    if (!currentStepIsValid) {
      return;
    }

  }

  goToStep(requestedStep);

}


/* =====================================================
   FORM NAVIGATION BUTTONS
===================================================== */

function initializeFormNavigation() {

  eventRegistrationElements.previousButton
    ?.addEventListener(
      "click",
      goToPreviousStep
    );

  eventRegistrationElements.nextButton
    ?.addEventListener(
      "click",
      goToNextStep
    );

  eventRegistrationElements.registrationForm
    ?.addEventListener(
      "submit",
      handleRegistrationSubmit
    );

}


function goToPreviousStep() {

  const previousStep =
    eventRegistrationState.currentStep - 1;

  if (previousStep < 1) {
    return;
  }

  saveFormDraft();

  goToStep(previousStep);

}


function goToNextStep() {

  if (!validateCurrentStep()) {
    return;
  }

  saveFormDraft();

  const nextStep =
    eventRegistrationState.currentStep + 1;

  if (
    nextStep >
    eventRegistrationState.totalSteps
  ) {
    return;
  }

  goToStep(nextStep);

}


function goToStep(stepNumber) {

  eventRegistrationState.currentStep =
    stepNumber;

  sessionStorage.setItem(
    EVENT_REGISTRATION_CONFIG
      .storageKeys.currentStep,
    String(stepNumber)
  );

  updateStepInterface();

  scrollToRegistrationContent();

}


/* =====================================================
   STEP INTERFACE UPDATE
===================================================== */

function updateStepInterface() {

  updateVisibleStep();

  updateStepButtons();

  updateProgressBar();

  updateNavigationButtons();

  updateNavigationStatus();

  if (
    eventRegistrationState.currentStep ===
    eventRegistrationState.totalSteps
  ) {
    populateReviewSummary();
  }

}


function updateVisibleStep() {

  eventRegistrationElements.formSteps
    .forEach(stepElement => {

      const stepNumber =
        Number(
          stepElement.dataset.registrationStep
        );

      const isActive =
        stepNumber ===
        eventRegistrationState.currentStep;

      stepElement.hidden = !isActive;

      stepElement.classList.toggle(
        "active",
        isActive
      );

      stepElement.setAttribute(
        "aria-hidden",
        String(!isActive)
      );

    });

}


function updateStepButtons() {

  eventRegistrationElements.stepButtons
    .forEach(button => {

      const stepNumber =
        Number(
          button.dataset.stepTarget
        );

      const isActive =
        stepNumber ===
        eventRegistrationState.currentStep;

      const isCompleted =
        stepNumber <
        eventRegistrationState.currentStep;

      button.classList.toggle(
        "active",
        isActive
      );

      button.classList.toggle(
        "completed",
        isCompleted
      );

      button.setAttribute(
        "aria-current",
        isActive ? "step" : "false"
      );

      const numberElement =
        button.querySelector("span");

      if (!numberElement) {
        return;
      }

      numberElement.innerHTML =
        isCompleted
          ? '<i class="fa-solid fa-check"></i>'
          : String(stepNumber);

    });

}


function updateProgressBar() {

  const completedPercentage =
    Math.round(
      (
        eventRegistrationState.currentStep /
        eventRegistrationState.totalSteps
      ) * 100
    );

  if (eventRegistrationElements.progressBar) {

    eventRegistrationElements.progressBar
      .style.width =
      `${completedPercentage}%`;

    eventRegistrationElements.progressBar
      .setAttribute(
        "aria-valuenow",
        String(completedPercentage)
      );

  }

  if (eventRegistrationElements.progressText) {

    eventRegistrationElements.progressText
      .textContent =
      `Step ${eventRegistrationState.currentStep} of ${eventRegistrationState.totalSteps}`;

  }

  if (
    eventRegistrationElements
      .progressPercentage
  ) {

    eventRegistrationElements
      .progressPercentage
      .textContent =
      `${completedPercentage}% Complete`;

  }

}


function updateNavigationButtons() {

  const isFirstStep =
    eventRegistrationState.currentStep === 1;

  const isFinalStep =
    eventRegistrationState.currentStep ===
    eventRegistrationState.totalSteps;

  if (eventRegistrationElements.previousButton) {

    eventRegistrationElements.previousButton
      .disabled =
      isFirstStep;

    eventRegistrationElements.previousButton
      .hidden =
      isFirstStep;

  }

  if (eventRegistrationElements.nextButton) {

    eventRegistrationElements.nextButton
      .hidden =
      isFinalStep;

  }

}


function updateNavigationStatus() {

  if (
    !eventRegistrationElements.navigationStatus
  ) {
    return;
  }

  const stepNames = {

    1: "Participant Details",

    2: "Parent or Guardian",

    3: "Football Information",

    4: "Document Upload",

    5: "Emergency Contact and Consent",

    6: "Review and Submit"

  };

  const currentStepName =
    stepNames[
      eventRegistrationState.currentStep
    ] || "Registration";

  eventRegistrationElements.navigationStatus
    .innerHTML =
    `
      <i class="fa-solid fa-circle-info"></i>
      <span>
        ${escapeHtml(currentStepName)}
      </span>
    `;

}


/* =====================================================
   PAGE SCROLL
===================================================== */

function scrollToRegistrationContent() {

  const progressCard =
    document.querySelector(
      ".event-registration-progress-card"
    );

  if (!progressCard) {
    return;
  }

  const navbarHeight =
    eventRegistrationElements.navbar
      ?.offsetHeight || 0;

  const elementPosition =
    progressCard.getBoundingClientRect().top +
    window.scrollY;

  window.scrollTo({

    top:
      elementPosition -
      navbarHeight -
      18,

    behavior:
      "smooth"

  });

}


/* =====================================================
   VALIDATION LISTENERS
===================================================== */

function initializeFormValidationListeners() {

  const form =
    eventRegistrationElements.registrationForm;

  if (!form) {
    return;
  }

  const fields =
    form.querySelectorAll(
      "input, select, textarea"
    );

  fields.forEach(field => {

    field.addEventListener(
      "blur",
      () => validateField(field)
    );

    field.addEventListener(
      "input",
      () => {

        clearFieldError(field);

        saveFormDraftDebounced();

      }
    );

    field.addEventListener(
      "change",
      () => {

        validateField(field);

        saveFormDraftDebounced();

      }
    );

  });

}


/* =====================================================
   CURRENT STEP VALIDATION
===================================================== */

function validateCurrentStep() {

  const currentStepElement =
    document.querySelector(
      `[data-registration-step="${eventRegistrationState.currentStep}"]`
    );

  if (!currentStepElement) {
    return true;
  }

  const fields =
    currentStepElement.querySelectorAll(
      "input, select, textarea"
    );

  let stepIsValid = true;

  let firstInvalidField = null;

  fields.forEach(field => {

    if (
      field.disabled ||
      field.type === "hidden"
    ) {
      return;
    }

    const fieldIsValid =
      validateField(field);

    if (!fieldIsValid) {

      stepIsValid = false;

      if (!firstInvalidField) {
        firstInvalidField = field;
      }

    }

  });

  if (!stepIsValid && firstInvalidField) {

    firstInvalidField.focus({
      preventScroll: true
    });

    firstInvalidField.scrollIntoView({

      behavior: "smooth",

      block: "center"

    });

  }

  return stepIsValid;

}


/* =====================================================
   FIELD VALIDATION
===================================================== */

function validateField(field) {

  if (!field) {
    return true;
  }

  const value =
    typeof field.value === "string"
      ? field.value.trim()
      : "";

  let errorMessage = "";

  if (
    field.required &&
    field.type === "checkbox" &&
    !field.checked
  ) {

    errorMessage =
      "Please accept this required declaration.";

  } else if (
    field.required &&
    field.type === "file" &&
    field.files.length === 0
  ) {

    errorMessage =
      "Please upload the required file.";

  } else if (
    field.required &&
    value === ""
  ) {

    errorMessage =
      "This field is required.";

  } else if (
    field.type === "email" &&
    value &&
    !isValidEmail(value)
  ) {

    errorMessage =
      "Enter a valid email address.";

  } else if (
    field.type === "url" &&
    value &&
    !isValidUrl(value)
  ) {

    errorMessage =
      "Enter a valid website or video link.";

  } else if (
    field.type === "tel" &&
    value &&
    !isValidIndianPhoneNumber(value)
  ) {

    errorMessage =
      "Enter a valid 10-digit mobile number.";

  } else if (
    field.type === "number" &&
    value
  ) {

    errorMessage =
      validateNumberField(field);

  } else if (
    field.minLength > 0 &&
    value &&
    value.length < field.minLength
  ) {

    errorMessage =
      `Enter at least ${field.minLength} characters.`;

  } else if (
    field.maxLength > 0 &&
    value.length > field.maxLength
  ) {

    errorMessage =
      `Maximum ${field.maxLength} characters allowed.`;

  }

  if (errorMessage) {

    showFieldError(
      field,
      errorMessage
    );

    return false;

  }

  markFieldAsValid(field);

  return true;

}


/* =====================================================
   NUMBER FIELD VALIDATION
===================================================== */

function validateNumberField(field) {

  const numericValue =
    Number(field.value);

  if (
    Number.isNaN(numericValue)
  ) {
    return "Enter a valid number.";
  }

  if (
    field.min !== "" &&
    numericValue < Number(field.min)
  ) {
    return `Minimum value is ${field.min}.`;
  }

  if (
    field.max !== "" &&
    numericValue > Number(field.max)
  ) {
    return `Maximum value is ${field.max}.`;
  }

  return "";

}


/* =====================================================
   ERROR DISPLAY
===================================================== */

function showFieldError(
  field,
  message
) {

  const fieldContainer =
    findFieldContainer(field);

  const errorElement =
    document.querySelector(
      `[data-error-for="${field.id}"]`
    );

  fieldContainer?.classList.add(
    "has-error"
  );

  fieldContainer?.classList.remove(
    "is-valid"
  );

  field.setAttribute(
    "aria-invalid",
    "true"
  );

  if (errorElement) {

    errorElement.textContent =
      message;

  }

}


function clearFieldError(field) {

  const fieldContainer =
    findFieldContainer(field);

  const errorElement =
    document.querySelector(
      `[data-error-for="${field.id}"]`
    );

  fieldContainer?.classList.remove(
    "has-error"
  );

  field.removeAttribute(
    "aria-invalid"
  );

  if (errorElement) {

    errorElement.textContent = "";

  }

}


function markFieldAsValid(field) {

  const fieldContainer =
    findFieldContainer(field);

  clearFieldError(field);

  if (
    field.value ||
    field.checked ||
    (
      field.type === "file" &&
      field.files.length > 0
    )
  ) {

    fieldContainer?.classList.add(
      "is-valid"
    );

  } else {

    fieldContainer?.classList.remove(
      "is-valid"
    );

  }

}


function findFieldContainer(field) {

  return (
    field.closest(
      ".event-registration-field"
    ) ||
    field.closest(
      ".event-registration-upload-card"
    ) ||
    field.closest(
      ".event-registration-consent-list"
    )
  );

}


/* =====================================================
   VALIDATION HELPERS
===================================================== */

function isValidEmail(value) {

  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    .test(value);

}


function isValidIndianPhoneNumber(value) {

  const sanitizedValue =
    value.replace(/\D/g, "");

  return /^[6-9]\d{9}$/
    .test(sanitizedValue);

}


function isValidUrl(value) {

  try {

    const parsedUrl =
      new URL(value);

    return [
      "http:",
      "https:"
    ].includes(
      parsedUrl.protocol
    );

  } catch {

    return false;

  }

}


/* =====================================================
   PHONE NUMBER INPUTS
===================================================== */

function initializePhoneNumberFields() {

  const phoneFields =
    document.querySelectorAll(
      'input[type="tel"]'
    );

  phoneFields.forEach(field => {

    field.addEventListener(
      "input",
      () => {

        field.value =
          field.value
            .replace(/\D/g, "")
            .slice(0, 10);

      }
    );

  });

}


/* =====================================================
   CHARACTER COUNTERS
===================================================== */

function initializeCharacterCounters() {

  const fields =
    document.querySelectorAll(
      "textarea[maxlength], input[maxlength]"
    );

  fields.forEach(field => {

    const counter =
      document.querySelector(
        `[data-character-count-for="${field.id}"]`
      );

    if (!counter) {
      return;
    }

    const updateCounter = () => {

      counter.textContent =
        `${field.value.length}/${field.maxLength}`;

    };

    updateCounter();

    field.addEventListener(
      "input",
      updateCounter
    );

  });

}


/* =====================================================
   GUARDIAN ADDRESS TOGGLE
===================================================== */

function initializeGuardianAddressToggle() {

  const sameAddressCheckbox =
    document.getElementById(
      "guardianSameAddress"
    );

  if (!sameAddressCheckbox) {
    return;
  }

  sameAddressCheckbox.addEventListener(
    "change",
    handleGuardianAddressToggle
  );

  handleGuardianAddressToggle();

}


function handleGuardianAddressToggle() {

  const checkbox =
    document.getElementById(
      "guardianSameAddress"
    );

  const participantAddress =
    document.getElementById(
      "participantAddress"
    );

  const guardianAddress =
    document.getElementById(
      "guardianAddress"
    );

  const participantCity =
    document.getElementById(
      "participantCity"
    );

  const guardianCity =
    document.getElementById(
      "guardianCity"
    );

  const participantPostalCode =
    document.getElementById(
      "participantPostalCode"
    );

  const guardianPostalCode =
    document.getElementById(
      "guardianPostalCode"
    );

  if (!checkbox) {
    return;
  }

  if (checkbox.checked) {

    if (
      participantAddress &&
      guardianAddress
    ) {
      guardianAddress.value =
        participantAddress.value;
    }

    if (
      participantCity &&
      guardianCity
    ) {
      guardianCity.value =
        participantCity.value;
    }

    if (
      participantPostalCode &&
      guardianPostalCode
    ) {
      guardianPostalCode.value =
        participantPostalCode.value;
    }

  }

  [
    guardianAddress,
    guardianCity,
    guardianPostalCode
  ].forEach(field => {

    if (!field) {
      return;
    }

    field.readOnly =
      checkbox.checked;

  });

}


/* =====================================================
   DRAFT SAVE
===================================================== */

function saveFormDraft() {

  const form =
    eventRegistrationElements.registrationForm;

  if (!form) {
    return;
  }

  const formData =
    new FormData(form);

  const serializableData = {};

  formData.forEach(
    (value, key) => {

      if (value instanceof File) {
        return;
      }

      if (
        Object.prototype.hasOwnProperty.call(
          serializableData,
          key
        )
      ) {

        const existingValue =
          serializableData[key];

        serializableData[key] =
          Array.isArray(existingValue)
            ? [
                ...existingValue,
                value
              ]
            : [
                existingValue,
                value
              ];

      } else {

        serializableData[key] =
          value;

      }

    }
  );

  const checkboxes =
    form.querySelectorAll(
      'input[type="checkbox"]'
    );

  checkboxes.forEach(checkbox => {

    serializableData[checkbox.name] =
      checkbox.checked;

  });

  eventRegistrationState.formData =
    serializableData;

  localStorage.setItem(
    EVENT_REGISTRATION_CONFIG
      .storageKeys.draft,
    JSON.stringify(
      serializableData
    )
  );

}


let draftSaveTimer = null;


function saveFormDraftDebounced() {

  window.clearTimeout(
    draftSaveTimer
  );

  draftSaveTimer =
    window.setTimeout(
      saveFormDraft,
      350
    );

}


/* =====================================================
   DRAFT RESTORE
===================================================== */

function restoreSavedDraft() {

  const form =
    eventRegistrationElements.registrationForm;

  if (!form) {
    return;
  }

  const savedDraft =
    localStorage.getItem(
      EVENT_REGISTRATION_CONFIG
        .storageKeys.draft
    );

  if (savedDraft) {

    try {

      const parsedDraft =
        JSON.parse(savedDraft);

      Object.entries(parsedDraft)
        .forEach(
          ([fieldName, fieldValue]) => {

            const field =
              form.elements.namedItem(
                fieldName
              );

            if (!field) {
              return;
            }

            if (
              field instanceof RadioNodeList
            ) {
              return;
            }

            if (
              field.type === "checkbox"
            ) {

              field.checked =
                Boolean(fieldValue);

            } else if (
              field.type !== "file"
            ) {

              field.value =
                String(fieldValue ?? "");

            }

          }
        );

      eventRegistrationState.formData =
        parsedDraft;

    } catch (error) {

      console.warn(
        "Unable to restore registration draft.",
        error
      );

    }

  }

  const savedStep =
    Number(
      sessionStorage.getItem(
        EVENT_REGISTRATION_CONFIG
          .storageKeys.currentStep
      )
    );

  if (
    Number.isInteger(savedStep) &&
    savedStep >= 1 &&
    savedStep <=
      eventRegistrationState.totalSteps
  ) {

    eventRegistrationState.currentStep =
      savedStep;

  }

  handleGuardianAddressToggle();

}


/* =====================================================
   EVENT DETAILS BACKEND PLACEHOLDER
===================================================== */

async function loadEventDetails() {

  if (
    !eventRegistrationState.eventId
  ) {
    return;
  }

  try {

    /*
      BACKEND INTEGRATION PLACEHOLDER FOR MR. HARSH

      Replace the mock event data below with:

      const endpoint =
        EVENT_REGISTRATION_CONFIG
          .endpoints.eventDetails
          .replace(
            ":eventId",
            encodeURIComponent(
              eventRegistrationState.eventId
            )
          );

      const response = await fetch(
        endpoint,
        {
          method: "GET",
          headers: {
            "Accept": "application/json"
          },
          credentials: "include"
        }
      );

      if (!response.ok) {
        throw new Error(
          "Unable to load event details."
        );
      }

      const result =
        await response.json();

      eventRegistrationState.eventData =
        result.data || result;
    */

    eventRegistrationState.eventData = {

      id:
        eventRegistrationState.eventId,

      title:
        "National Youth Football Talent Identification Camp",

      date:
        "15 August 2026",

      time:
        "8:00 AM – 4:30 PM",

      venue:
        "Regional Football Training Centre",

      city:
        "New Delhi",

      registrationFee:
        0,

      image:
        "images/events/youth-football-camp.jpg"

    };

    populateEventSummary(
      eventRegistrationState.eventData
    );

  } catch (error) {

    console.error(
      "Event details error:",
      error
    );

    showNotification(
      "Unable to load complete event details. You may still continue with the form.",
      "warning"
    );

  }

}


/* =====================================================
   EVENT SUMMARY POPULATION
===================================================== */

function populateEventSummary(eventData) {

  if (!eventData) {
    return;
  }

  const titleElements =
    document.querySelectorAll(
      "[data-event-title]"
    );

  const dateElements =
    document.querySelectorAll(
      "[data-event-date]"
    );

  const timeElements =
    document.querySelectorAll(
      "[data-event-time]"
    );

  const venueElements =
    document.querySelectorAll(
      "[data-event-venue]"
    );

  const feeElements =
    document.querySelectorAll(
      "[data-event-fee]"
    );

  const eventImages =
    document.querySelectorAll(
      "[data-event-image]"
    );

  titleElements.forEach(element => {

    element.textContent =
      eventData.title ||
      "Football Event";

  });

  dateElements.forEach(element => {

    element.textContent =
      eventData.date ||
      "Date to be announced";

  });

  timeElements.forEach(element => {

    element.textContent =
      eventData.time ||
      "Time to be announced";

  });

  venueElements.forEach(element => {

    element.textContent =
      [
        eventData.venue,
        eventData.city
      ]
        .filter(Boolean)
        .join(", ") ||
      "Venue to be announced";

  });

  feeElements.forEach(element => {

    element.textContent =
      formatRegistrationFee(
        eventData.registrationFee
      );

  });

  eventImages.forEach(image => {

    if (
      image instanceof HTMLImageElement &&
      eventData.image
    ) {

      image.src =
        eventData.image;

      image.alt =
        `${eventData.title || "Football event"} banner`;

    }

  });

  if (
    eventRegistrationElements.successEvent
  ) {

    eventRegistrationElements.successEvent
      .textContent =
      eventData.title ||
      "Football Event";

  }

}


/* =====================================================
   REGISTRATION FEE FORMAT
===================================================== */

function formatRegistrationFee(value) {

  const numericValue =
    Number(value);

  if (
    !Number.isFinite(numericValue) ||
    numericValue <= 0
  ) {
    return "Free";
  }

  return new Intl.NumberFormat(
    "en-IN",
    {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    }
  ).format(numericValue);

}


/* =====================================================
   SUBMISSION PLACEHOLDER
===================================================== */

async function handleRegistrationSubmit(event) {

  event.preventDefault();

  if (
    eventRegistrationState.isSubmitting
  ) {
    return;
  }

  const formIsValid =
    validateCompleteForm();

  if (!formIsValid) {
    return;
  }

  /*
    Full backend submission logic continues
    in event-registration.js Part 1B.
  */

  console.info(
    "Registration form is ready for backend submission."
  );

}


/* =====================================================
   COMPLETE FORM VALIDATION
===================================================== */

function validateCompleteForm() {

  const form =
    eventRegistrationElements.registrationForm;

  if (!form) {
    return false;
  }

  const fields =
    form.querySelectorAll(
      "input, select, textarea"
    );

  let formIsValid = true;

  let firstInvalidField = null;

  let invalidStep = null;

  fields.forEach(field => {

    if (
      field.disabled ||
      field.type === "hidden"
    ) {
      return;
    }

    const fieldIsValid =
      validateField(field);

    if (!fieldIsValid) {

      formIsValid = false;

      if (!firstInvalidField) {

        firstInvalidField = field;

        const stepElement =
          field.closest(
            "[data-registration-step]"
          );

        invalidStep =
          Number(
            stepElement?.dataset
              .registrationStep
          );

      }

    }

  });

  if (!formIsValid) {

    if (
      Number.isInteger(invalidStep)
    ) {
      goToStep(invalidStep);
    }

    window.setTimeout(() => {

      firstInvalidField?.focus();

    }, 350);

    showNotification(
      "Please complete all required fields before submitting.",
      "error"
    );

  }

  return formIsValid;

}


/* =====================================================
   REVIEW PLACEHOLDER
===================================================== */

function populateReviewSummary() {

  /*
    Complete dynamic review rendering continues
    in event-registration.js Part 1B.
  */

  saveFormDraft();

}


/* =====================================================
   NOTIFICATION UTILITY
===================================================== */

function showNotification(
  message,
  type = "info"
) {

  let notificationContainer =
    document.getElementById(
      "eventRegistrationNotificationContainer"
    );

  if (!notificationContainer) {

    notificationContainer =
      document.createElement("div");

    notificationContainer.id =
      "eventRegistrationNotificationContainer";

    notificationContainer.className =
      "event-registration-notification-container";

    notificationContainer.setAttribute(
      "aria-live",
      "polite"
    );

    document.body.appendChild(
      notificationContainer
    );

  }

  const notification =
    document.createElement("div");

  notification.className =
    `event-registration-notification ${type}`;

  const iconMap = {

    success:
      "fa-circle-check",

    error:
      "fa-circle-exclamation",

    warning:
      "fa-triangle-exclamation",

    info:
      "fa-circle-info"

  };

  notification.innerHTML =
    `
      <i class="fa-solid ${iconMap[type] || iconMap.info}"></i>

      <span>
        ${escapeHtml(message)}
      </span>

      <button
        type="button"
        aria-label="Close notification"
      >
        <i class="fa-solid fa-xmark"></i>
      </button>
    `;

  notificationContainer.appendChild(
    notification
  );

  const closeButton =
    notification.querySelector(
      "button"
    );

  const removeNotification = () => {

    notification.classList.add(
      "is-leaving"
    );

    window.setTimeout(() => {

      notification.remove();

    }, 250);

  };

  closeButton?.addEventListener(
    "click",
    removeNotification
  );

  window.setTimeout(
    removeNotification,
    5000
  );

}


/* =====================================================
   HTML ESCAPING UTILITY
===================================================== */

function escapeHtml(value) {

  return String(value ?? "")
    .replace(
      /&/g,
      "&amp;"
    )
    .replace(
      /</g,
      "&lt;"
    )
    .replace(
      />/g,
      "&gt;"
    )
    .replace(
      /"/g,
      "&quot;"
    )
    .replace(
      /'/g,
      "&#039;"
    );

}

/* =====================================================
   EVENT REGISTRATION PAGE
   event-registration.js

   PART 1B
   FILE UPLOADS • REVIEW SUMMARY
   DOWNLOAD SUMMARY • FINAL SUBMISSION
   SUCCESS MODAL • BACKEND PLACEHOLDERS
===================================================== */


/* =====================================================
   FILE UPLOAD INITIALIZATION
===================================================== */

initializeFileUploads();

function initializeFileUploads() {

  const fileInputs =
    document.querySelectorAll(
      'input[type="file"]'
    );

  fileInputs.forEach(input => {

    input.addEventListener(
      "change",
      handleFileSelection
    );

    const uploadZone =
      document.querySelector(
        `[data-upload-zone="${input.id}"]`
      );

    if (!uploadZone) {
      return;
    }

    uploadZone.addEventListener(
      "dragover",
      handleUploadDragOver
    );

    uploadZone.addEventListener(
      "dragleave",
      handleUploadDragLeave
    );

    uploadZone.addEventListener(
      "drop",
      event => handleFileDrop(event, input)
    );

  });

  document
    .querySelectorAll("[data-remove-file]")
    .forEach(button => {

      button.addEventListener(
        "click",
        handleRemoveFile
      );

    });

}


function handleUploadDragOver(event) {

  event.preventDefault();

  event.currentTarget.classList.add(
    "is-dragging"
  );

}


function handleUploadDragLeave(event) {

  event.currentTarget.classList.remove(
    "is-dragging"
  );

}


function handleFileDrop(
  event,
  input
) {

  event.preventDefault();

  event.currentTarget.classList.remove(
    "is-dragging"
  );

  if (
    !event.dataTransfer.files.length
  ) {
    return;
  }

  input.files =
    event.dataTransfer.files;

  handleFileSelection({
    currentTarget: input
  });

}


function handleFileSelection(event) {

  const input =
    event.currentTarget;

  if (
    !input.files.length
  ) {
    return;
  }

  const file =
    input.files[0];

  if (
    !validateUploadedFile(
      input,
      file
    )
  ) {

    input.value = "";

    return;

  }

  eventRegistrationState
    .uploadedFiles
    .set(
      input.id,
      file
    );

  updateFilePreview(
    input,
    file
  );

  clearFieldError(input);

  saveFormDraft();

}


function validateUploadedFile(
  input,
  file
) {

  const maximumSize =
    EVENT_REGISTRATION_CONFIG
      .maximumFileSize;

  if (
    file.size >
    maximumSize
  ) {

    showFieldError(
      input,
      "Maximum file size is 5 MB."
    );

    return false;

  }

  const allowedTypes =
    input.accept.includes("pdf")
      ? EVENT_REGISTRATION_CONFIG
          .allowedDocumentTypes
      : EVENT_REGISTRATION_CONFIG
          .allowedImageTypes;

  if (
    !allowedTypes.includes(
      file.type
    )
  ) {

    showFieldError(
      input,
      "Unsupported file format."
    );

    return false;

  }

  return true;

}


function updateFilePreview(
  input,
  file
) {

  const preview =
    document.querySelector(
      `[data-file-preview-for="${input.id}"]`
    );

  if (!preview) {
    return;
  }

  preview.hidden = false;

  preview
    .querySelector("[data-file-name]")
    .textContent =
    file.name;

  preview
    .querySelector("[data-file-size]")
    .textContent =
    formatFileSize(file.size);

}


function handleRemoveFile(event) {

  const button =
    event.currentTarget;

  const inputId =
    button.dataset.removeFile;

  const input =
    document.getElementById(
      inputId
    );

  const preview =
    document.querySelector(
      `[data-file-preview-for="${inputId}"]`
    );

  if (input) {

    input.value = "";

  }

  if (preview) {

    preview.hidden = true;

  }

  eventRegistrationState
    .uploadedFiles
    .delete(inputId);

}


function formatFileSize(bytes) {

  if (
    bytes < 1024
  ) {
    return `${bytes} B`;
  }

  if (
    bytes < 1024 * 1024
  ) {
    return `${(
      bytes / 1024
    ).toFixed(1)} KB`;
  }

  return `${(
    bytes /
    1024 /
    1024
  ).toFixed(2)} MB`;

}


/* =====================================================
   REVIEW SUMMARY
===================================================== */

function populateReviewSummary() {

  const container =
    eventRegistrationElements.reviewSummary;

  if (!container) {
    return;
  }

  saveFormDraft();

  const data =
    eventRegistrationState.formData;

  container.innerHTML = `

<div class="event-registration-review-section">

<div class="event-registration-review-section-header">

<div>

<span>
<i class="fa-solid fa-user"></i>
</span>

<h3>
Participant Details
</h3>

</div>

<button
type="button"
data-review-step="1"
>

Edit

</button>

</div>

<div class="event-registration-review-grid">

<div class="event-registration-review-item">

<span>Name</span>

<strong>
${escapeHtml(
data.participantName || "-"
)}
</strong>

</div>

<div class="event-registration-review-item">

<span>Date of Birth</span>

<strong>
${escapeHtml(
data.participantDateOfBirth || "-"
)}
</strong>

</div>

<div class="event-registration-review-item">

<span>Email</span>

<strong>
${escapeHtml(
data.participantEmail || "-"
)}
</strong>

</div>

<div class="event-registration-review-item">

<span>Phone</span>

<strong>
${escapeHtml(
data.participantPhone || "-"
)}
</strong>

</div>

</div>

</div>

`;

  container
    .querySelectorAll(
      "[data-review-step]"
    )
    .forEach(button => {

      button.addEventListener(
        "click",
        () => {

          goToStep(
            Number(
              button.dataset.reviewStep
            )
          );

        }
      );

    });

}


/* =====================================================
   DOWNLOAD SUMMARY
===================================================== */

eventRegistrationElements
  .downloadButton
  ?.addEventListener(
    "click",
    downloadRegistrationSummary
  );

function downloadRegistrationSummary() {

  saveFormDraft();

  const data =
    eventRegistrationState.formData;

  const summary = `

FIFA MISSION INDIA
EVENT REGISTRATION SUMMARY

----------------------------------------

Participant:
${data.participantName || ""}

Email:
${data.participantEmail || ""}

Phone:
${data.participantPhone || ""}

Guardian:
${data.guardianName || ""}

Position:
${data.primaryPosition || ""}

Generated:
${new Date().toLocaleString()}

`;

  const blob =
    new Blob(
      [summary],
      {
        type:
          "text/plain;charset=utf-8"
      }
    );

  const url =
    URL.createObjectURL(blob);

  const anchor =
    document.createElement("a");

  anchor.href = url;

  anchor.download =
    "event-registration-summary.txt";

  anchor.click();

  URL.revokeObjectURL(url);

}


/* =====================================================
   FINAL SUBMISSION
===================================================== */

async function handleRegistrationSubmit(
  event
) {

  event.preventDefault();

  if (
    eventRegistrationState.isSubmitting
  ) {
    return;
  }

  if (
    !validateCompleteForm()
  ) {
    return;
  }

  eventRegistrationState.isSubmitting =
    true;

  const submitButton =
    eventRegistrationElements.submitButton;

  submitButton?.classList.add(
    "is-loading"
  );

  submitButton?.setAttribute(
    "disabled",
    "true"
  );

  try {

    /*
    ====================================================

    BACKEND PLACEHOLDER FOR MR. HARSH

    1. POST registration

    2. Receive registrationId

    3. Upload all documents

    4. Send confirmation email

    5. Send SMS

    6. Redirect to dashboard

    ====================================================
    */

    await simulateNetworkDelay(
      1400
    );

    const registrationId =
      generateRegistrationId();

    if (
      eventRegistrationElements
        .successId
    ) {

      eventRegistrationElements
        .successId
        .textContent =
        registrationId;

    }

    localStorage.removeItem(
      EVENT_REGISTRATION_CONFIG
        .storageKeys.draft
    );

    sessionStorage.removeItem(
      EVENT_REGISTRATION_CONFIG
        .storageKeys.currentStep
    );

    showRegistrationSuccess();

  } catch (error) {

    console.error(error);

    showNotification(
      "Registration could not be submitted.",
      "error"
    );

  } finally {

    eventRegistrationState.isSubmitting =
      false;

    submitButton?.removeAttribute(
      "disabled"
    );

    submitButton?.classList.remove(
      "is-loading"
    );

  }

}


/* =====================================================
   SUCCESS MODAL
===================================================== */

function showRegistrationSuccess() {

  const modal =
    eventRegistrationElements
      .successModal;

  if (!modal) {
    return;
  }

  modal.hidden = false;

  requestAnimationFrame(() => {

    modal.classList.add(
      "is-visible"
    );

  });

}


/* =====================================================
   REGISTRATION ID
===================================================== */

function generateRegistrationId() {

  const randomNumber =
    Math.floor(
      100000 +
      Math.random() *
      900000
    );

  return `REG-${randomNumber}`;

}


/* =====================================================
   SIMULATED NETWORK
===================================================== */

function simulateNetworkDelay(
  milliseconds
) {

  return new Promise(resolve => {

    window.setTimeout(
      resolve,
      milliseconds
    );

  });

}


/* =====================================================
   BEFORE LEAVING PAGE
===================================================== */

window.addEventListener(
  "beforeunload",
  event => {

    if (
      eventRegistrationState
        .isSubmitting
    ) {
      return;
    }

    saveFormDraft();

    event.preventDefault();

    event.returnValue = "";

  }
);


/* =====================================================
   END OF FILE
===================================================== */