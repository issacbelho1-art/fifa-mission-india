"use strict";

/* =========================================================
   FIFA MISSION INDIA - ACADEMY REGISTRATION
   Frontend only
========================================================= */

const form = document.getElementById(
  "academyRegistrationForm"
);

const formSteps = Array.from(
  document.querySelectorAll("[data-form-step]")
);

const progressSteps = Array.from(
  document.querySelectorAll("[data-progress-step]")
);

const previousButton =
  document.getElementById("previousButton");

const nextButton =
  document.getElementById("nextButton");

const submitButton =
  document.getElementById("submitButton");

const mobileStepLabel =
  document.getElementById("mobileStepLabel");

const mobileStepTitle =
  document.getElementById("mobileStepTitle");

const progressBarFill =
  document.getElementById("progressBarFill");

const progressBar =
  document.querySelector(".progress-bar");

const academyLogo =
  document.getElementById("academyLogo");

const profilePreviewImage =
  document.getElementById("profilePreviewImage");

const profileInitials =
  document.getElementById("profileInitials");

const registrationDocument =
  document.getElementById("registrationDocument");

const representativeId =
  document.getElementById("representativeId");

const registrationDocumentName =
  document.getElementById("registrationDocumentName");

const representativeIdName =
  document.getElementById("representativeIdName");

const programmes =
  document.getElementById("programmes");

const facilities =
  document.getElementById("facilities");

const academyDescription =
  document.getElementById("academyDescription");

const programmesCharacterCount =
  document.getElementById("programmesCharacterCount");

const facilitiesCharacterCount =
  document.getElementById("facilitiesCharacterCount");

const descriptionCharacterCount =
  document.getElementById("descriptionCharacterCount");

const successModal =
  document.getElementById("successModal");

const applicationReference =
  document.getElementById("applicationReference");

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const MAX_DOCUMENT_SIZE = 10 * 1024 * 1024;

const stepTitles = [
  "Academy Details",
  "Football Programmes",
  "Media & Documents",
  "Review & Submit"
];

let currentStep = 1;
let academyLogoUrl = "";


/* ================= STEP NAVIGATION ================= */

function showStep(stepNumber) {

  currentStep = stepNumber;

  formSteps.forEach((step) => {

    const stepValue = Number(step.dataset.formStep);

    step.classList.toggle(
      "active",
      stepValue === currentStep
    );

  });


  progressSteps.forEach((step) => {

    const stepValue = Number(step.dataset.progressStep);

    step.classList.toggle(
      "active",
      stepValue === currentStep
    );

    step.classList.toggle(
      "completed",
      stepValue < currentStep
    );

    if (stepValue === currentStep) {

      step.setAttribute("aria-current", "step");

    } else {

      step.removeAttribute("aria-current");

    }

  });


  previousButton.hidden = currentStep === 1;

  nextButton.hidden =
    currentStep === formSteps.length;

  submitButton.hidden =
    currentStep !== formSteps.length;

  updateMobileProgress();


  if (currentStep === formSteps.length) {

    populateReviewSection();

  }


  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });

}


function updateMobileProgress() {

  const percentage =
    (currentStep / formSteps.length) * 100;

  mobileStepLabel.textContent =
    `Step ${currentStep} of ${formSteps.length}`;

  mobileStepTitle.textContent =
    stepTitles[currentStep - 1];

  progressBarFill.style.width =
    `${percentage}%`;

  progressBar.setAttribute(
    "aria-valuenow",
    String(currentStep)
  );

}


nextButton.addEventListener("click", () => {

  if (!validateStep(currentStep)) {

    focusFirstInvalidField();
    return;

  }

  showStep(
    Math.min(currentStep + 1, formSteps.length)
  );

});


previousButton.addEventListener("click", () => {

  showStep(
    Math.max(currentStep - 1, 1)
  );

});


/* ================= VALIDATION ================= */

function validateStep(stepNumber) {

  const activeStep = document.querySelector(
    `[data-form-step="${stepNumber}"]`
  );

  const fields = Array.from(
    activeStep.querySelectorAll(
      "input:not([type='checkbox']), select, textarea"
    )
  );

  let isValid = true;


  fields.forEach((field) => {

    if (!validateField(field)) {

      isValid = false;

    }

  });


  if (stepNumber === 4 && !validateConsent()) {

    isValid = false;

  }

  return isValid;

}


function validateField(field) {

  clearFieldError(field);

  const value =
    field.type === "file"
      ? field.files
      : field.value.trim();


  if (
    field.required &&
    (
      (field.type === "file" && value.length === 0) ||
      (field.type !== "file" && !value)
    )
  ) {

    setFieldError(
      field,
      "This field is required."
    );

    return false;

  }


  if (!field.required && !value) {

    return true;

  }


  if (
    field.type === "email" &&
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
  ) {

    setFieldError(
      field,
      "Enter a valid email address."
    );

    return false;

  }


  if (
    field.id === "phone" &&
    !/^[6-9]\d{9}$/.test(value)
  ) {

    setFieldError(
      field,
      "Enter a valid 10-digit Indian mobile number."
    );

    return false;

  }


  if (
    field.type === "url" &&
    value &&
    !isValidUrl(value)
  ) {

    setFieldError(
      field,
      "Enter a valid public URL."
    );

    return false;

  }


  if (field.id === "yearEstablished") {

    const year = Number(value);
    const currentYear = new Date().getFullYear();

    if (year < 1900 || year > currentYear) {

      setFieldError(
        field,
        `Enter a year between 1900 and ${currentYear}.`
      );

      return false;

    }

  }


  if (
    field.id === "playerCapacity" &&
    (
      Number(value) < 1 ||
      Number(value) > 10000
    )
  ) {

    setFieldError(
      field,
      "Enter a valid player capacity."
    );

    return false;

  }


  if (
    field.id === "coachCount" &&
    (
      Number(value) < 1 ||
      Number(value) > 500
    )
  ) {

    setFieldError(
      field,
      "Enter a valid number of coaches."
    );

    return false;

  }


  if (
    field.id === "maximumAge" &&
    Number(value) <=
      Number(document.getElementById("minimumAge").value)
  ) {

    setFieldError(
      field,
      "Maximum age must be greater than minimum age."
    );

    return false;

  }


  if (
    field.id === "programmes" &&
    value.length < 40
  ) {

    setFieldError(
      field,
      "Describe your programmes using at least 40 characters."
    );

    return false;

  }


  if (
    field.id === "facilities" &&
    value.length < 30
  ) {

    setFieldError(
      field,
      "Describe your facilities using at least 30 characters."
    );

    return false;

  }


  if (
    field.id === "academyDescription" &&
    value.length < 60
  ) {

    setFieldError(
      field,
      "Write at least 60 characters about your academy."
    );

    return false;

  }


  if (field.type === "file") {

    return validateFile(field);

  }

  return true;

}


function validateFile(field) {

  const file = field.files[0];

  if (!file) {

    return !field.required;

  }


  if (field.id === "academyLogo") {

    const allowedImageTypes = [
      "image/jpeg",
      "image/png",
      "image/webp"
    ];

    if (!allowedImageTypes.includes(file.type)) {

      setFieldError(
        field,
        "Upload a JPG, PNG or WEBP image."
      );

      return false;

    }


    if (file.size > MAX_IMAGE_SIZE) {

      setFieldError(
        field,
        "Academy logo must be smaller than 5 MB."
      );

      return false;

    }

  }


  if (
    field.id === "registrationDocument" ||
    field.id === "representativeId"
  ) {

    const allowedDocumentTypes = [
      "application/pdf",
      "image/jpeg",
      "image/png"
    ];

    if (!allowedDocumentTypes.includes(file.type)) {

      setFieldError(
        field,
        "Upload a PDF, JPG or PNG file."
      );

      return false;

    }


    if (file.size > MAX_DOCUMENT_SIZE) {

      setFieldError(
        field,
        "Document must be smaller than 10 MB."
      );

      return false;

    }

  }

  return true;

}


function validateConsent() {

  const informationConsent =
    document.getElementById("informationConsent");

  const termsConsent =
    document.getElementById("termsConsent");

  const consentError =
    document.getElementById("consentError");


  if (
    !informationConsent.checked ||
    !termsConsent.checked
  ) {

    consentError.textContent =
      "Please confirm both declarations before submitting.";

    return false;

  }


  consentError.textContent = "";

  return true;

}


function setFieldError(field, message) {

  const group =
    field.closest(".form-group") ||
    field.closest(".document-upload") ||
    field.closest(".profile-upload-copy");

  if (!group) {

    return;

  }

  group.classList.add("invalid");

  const errorElement =
    group.querySelector(".error-message");

  if (errorElement) {

    errorElement.textContent = message;

  }

  field.setAttribute("aria-invalid", "true");

}


function clearFieldError(field) {

  const group =
    field.closest(".form-group") ||
    field.closest(".document-upload") ||
    field.closest(".profile-upload-copy");

  if (!group) {

    return;

  }

  group.classList.remove("invalid");

  const errorElement =
    group.querySelector(".error-message");

  if (errorElement) {

    errorElement.textContent = "";

  }

  field.removeAttribute("aria-invalid");

}


function focusFirstInvalidField() {

  const activeStep = document.querySelector(
    `[data-form-step="${currentStep}"]`
  );

  activeStep
    ?.querySelector('[aria-invalid="true"]')
    ?.focus();

}


function isValidUrl(value) {

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


/* ================= LIVE INPUT ================= */

form.addEventListener("input", (event) => {

  const field = event.target;

  if (field.matches("input, select, textarea")) {

    clearFieldError(field);

  }

});


form.addEventListener("change", (event) => {

  const field = event.target;

  if (field.matches("input, select, textarea")) {

    clearFieldError(field);

  }


  if (
    field.id === "informationConsent" ||
    field.id === "termsConsent"
  ) {

    document.getElementById(
      "consentError"
    ).textContent = "";

  }

});


programmes.addEventListener("input", () => {

  programmesCharacterCount.textContent =
    programmes.value.length;

});


facilities.addEventListener("input", () => {

  facilitiesCharacterCount.textContent =
    facilities.value.length;

});


academyDescription.addEventListener("input", () => {

  descriptionCharacterCount.textContent =
    academyDescription.value.length;

});


/* ================= ACADEMY LOGO ================= */

academyLogo.addEventListener("change", () => {

  clearFieldError(academyLogo);

  const file = academyLogo.files[0];

  if (!file) {

    resetLogoPreview();
    return;

  }


  if (!validateFile(academyLogo)) {

    academyLogo.value = "";

    resetLogoPreview();

    return;

  }


  if (academyLogoUrl) {

    URL.revokeObjectURL(academyLogoUrl);

  }


  academyLogoUrl = URL.createObjectURL(file);

  profilePreviewImage.src = academyLogoUrl;
  profilePreviewImage.hidden = false;

  profileInitials.hidden = true;

});


function resetLogoPreview() {

  if (academyLogoUrl) {

    URL.revokeObjectURL(academyLogoUrl);

  }

  academyLogoUrl = "";

  profilePreviewImage.hidden = true;
  profilePreviewImage.removeAttribute("src");

  profileInitials.hidden = false;

}


/* ================= DOCUMENT FILE NAMES ================= */

registrationDocument.addEventListener("change", () => {

  updateFileName(
    registrationDocument,
    registrationDocumentName,
    "No file selected"
  );

});


representativeId.addEventListener("change", () => {

  updateFileName(
    representativeId,
    representativeIdName,
    "No file selected"
  );

});


function updateFileName(
  input,
  displayElement,
  fallback
) {

  clearFieldError(input);

  const file = input.files[0];

  if (!file) {

    displayElement.textContent = fallback;

    return;

  }


  if (!validateFile(input)) {

    input.value = "";

    displayElement.textContent = fallback;

    return;

  }


  displayElement.textContent = file.name;

}


/* ================= REVIEW ================= */

function getSelectedText(selectId) {

  const select = document.getElementById(selectId);

  if (!select.value) {

    return "";

  }

  return select.options[
    select.selectedIndex
  ].text;

}


function populateReviewSection() {

  const academyName =
    document.getElementById("academyName").value.trim();

  const city =
    document.getElementById("city").value.trim();

  const state =
    getSelectedText("state");

  const contactName =
    document.getElementById("contactName").value.trim();

  const contactRole =
    document.getElementById("contactRole").value.trim();

  const initials = academyName
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word.charAt(0))
    .join("")
    .toUpperCase() || "FA";


  document.getElementById(
    "reviewAcademyName"
  ).textContent =
    academyName || "Academy Name";


  document.getElementById(
    "reviewAcademyLocation"
  ).textContent =
    [city, state].filter(Boolean).join(", ") ||
    "Location not entered";


  document.getElementById(
    "reviewAcademyType"
  ).textContent =
    getSelectedText("academyType") || "—";


  document.getElementById(
    "reviewEstablished"
  ).textContent =
    document.getElementById("yearEstablished").value ||
    "—";


  document.getElementById(
    "reviewEmail"
  ).textContent =
    document.getElementById("email").value || "—";


  document.getElementById(
    "reviewPhone"
  ).textContent =
    document.getElementById("phone").value
      ? `+91 ${document.getElementById("phone").value}`
      : "—";


  document.getElementById(
    "reviewContact"
  ).textContent =
    [contactName, contactRole]
      .filter(Boolean)
      .join(" — ") || "—";


  document.getElementById(
    "reviewLevel"
  ).textContent =
    getSelectedText("academyLevel") || "—";


  document.getElementById(
    "reviewCapacity"
  ).textContent =
    document.getElementById("playerCapacity").value ||
    "—";


  document.getElementById(
    "reviewCoachCount"
  ).textContent =
    document.getElementById("coachCount").value ||
    "—";


  document.getElementById(
    "reviewDescription"
  ).textContent =
    academyDescription.value.trim() || "—";


  const reviewInitials =
    document.getElementById("reviewInitials");

  const reviewProfileImage =
    document.getElementById("reviewProfileImage");

  reviewInitials.textContent = initials;


  if (academyLogoUrl) {

    reviewProfileImage.src = academyLogoUrl;

    reviewProfileImage.hidden = false;

    reviewInitials.hidden = true;

  } else {

    reviewProfileImage.hidden = true;

    reviewInitials.hidden = false;

  }

}


/* ================= SUBMISSION ================= */

form.addEventListener("submit", async (event) => {

  event.preventDefault();


  if (!validateStep(4)) {

    focusFirstInvalidField();

    return;

  }


  setSubmitting(true);


  try {

    const formData = new FormData(form);

    /*
      BACKEND INTEGRATION PLACEHOLDER

      const response = await fetch(
        "/api/v1/academies/register",
        {
          method: "POST",
          body: formData,
          credentials: "include"
        }
      );

      if (!response.ok) {
        throw new Error("Academy registration failed.");
      }

      const result = await response.json();

      showSuccessModal(result.applicationReference);
    */

    console.info(
      "Academy registration payload:",
      Object.fromEntries(formData.entries())
    );


    await new Promise((resolve) => {

      window.setTimeout(resolve, 900);

    });


    showSuccessModal(
      generateApplicationReference()
    );

  } catch (error) {

    console.error(
      "Academy registration error:",
      error
    );

    window.alert(
      "Academy registration could not be submitted. Please try again."
    );

  } finally {

    setSubmitting(false);

  }

});


function setSubmitting(isSubmitting) {

  submitButton.disabled = isSubmitting;

  submitButton.classList.toggle(
    "loading",
    isSubmitting
  );

  submitButton.querySelector(
    ".button-label"
  ).textContent =
    isSubmitting
      ? "Submitting..."
      : "Submit Academy";

}


function generateApplicationReference() {

  const number = Math.floor(
    100000 + Math.random() * 900000
  );

  return `FMI-ACADEMY-${number}`;

}


function showSuccessModal(reference) {

  applicationReference.textContent = reference;

  successModal.hidden = false;

  document.body.style.overflow = "hidden";

}


/* ================= INITIALISE ================= */

function initialisePage() {

  const currentYear = new Date().getFullYear();

  document.getElementById(
    "yearEstablished"
  ).max = String(currentYear);

  showStep(1);

}


initialisePage();


window.addEventListener("beforeunload", () => {

  if (academyLogoUrl) {

    URL.revokeObjectURL(academyLogoUrl);

  }

});