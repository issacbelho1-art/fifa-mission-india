"use strict";

/* =========================================================
   FIFA MISSION INDIA - PLAYER REGISTRATION
   Frontend-only registration logic
========================================================= */

const registrationForm = document.getElementById(
  "playerRegistrationForm"
);

const formSteps = Array.from(
  document.querySelectorAll("[data-form-step]")
);

const progressSteps = Array.from(
  document.querySelectorAll("[data-progress-step]")
);

const previousButton = document.getElementById("previousButton");
const nextButton = document.getElementById("nextButton");
const submitButton = document.getElementById("submitButton");

const mobileStepLabel = document.getElementById("mobileStepLabel");
const mobileStepTitle = document.getElementById("mobileStepTitle");
const progressBarFill = document.getElementById("progressBarFill");
const progressBar = document.querySelector(".progress-bar");

const playerBio = document.getElementById("playerBio");
const bioCharacterCount = document.getElementById(
  "bioCharacterCount"
);

const profilePhoto = document.getElementById("profilePhoto");
const profilePreviewImage = document.getElementById(
  "profilePreviewImage"
);
const profileInitials = document.getElementById("profileInitials");

const identityDocument = document.getElementById(
  "identityDocument"
);
const highlightVideo = document.getElementById("highlightVideo");

const identityDocumentName = document.getElementById(
  "identityDocumentName"
);
const highlightVideoName = document.getElementById(
  "highlightVideoName"
);

const successModal = document.getElementById("successModal");
const applicationReference = document.getElementById(
  "applicationReference"
);

const stepTitles = [
  "Personal Details",
  "Football Profile",
  "Media & Documents",
  "Review & Submit"
];

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const MAX_DOCUMENT_SIZE = 10 * 1024 * 1024;
const MAX_VIDEO_SIZE = 100 * 1024 * 1024;

let currentStep = 1;
let profileImageUrl = "";


/* ================= STEP NAVIGATION ================= */

function showStep(stepNumber) {
  currentStep = stepNumber;

  formSteps.forEach((step) => {
    const stepValue = Number(step.dataset.formStep);

    step.classList.toggle("active", stepValue === currentStep);
  });

  progressSteps.forEach((step) => {
    const stepValue = Number(step.dataset.progressStep);

    step.classList.toggle("active", stepValue === currentStep);
    step.classList.toggle("completed", stepValue < currentStep);

    if (stepValue === currentStep) {
      step.setAttribute("aria-current", "step");
    } else {
      step.removeAttribute("aria-current");
    }
  });

  previousButton.hidden = currentStep === 1;
  nextButton.hidden = currentStep === formSteps.length;
  submitButton.hidden = currentStep !== formSteps.length;

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
  const progressPercentage =
    (currentStep / formSteps.length) * 100;

  mobileStepLabel.textContent =
    `Step ${currentStep} of ${formSteps.length}`;

  mobileStepTitle.textContent =
    stepTitles[currentStep - 1];

  progressBarFill.style.width = `${progressPercentage}%`;

  progressBar.setAttribute(
    "aria-valuenow",
    String(currentStep)
  );
}


nextButton.addEventListener("click", () => {
  const isCurrentStepValid = validateStep(currentStep);

  if (!isCurrentStepValid) {
    focusFirstInvalidField();
    return;
  }

  showStep(Math.min(currentStep + 1, formSteps.length));
});


previousButton.addEventListener("click", () => {
  showStep(Math.max(currentStep - 1, 1));
});


/* ================= VALIDATION ================= */

function validateStep(stepNumber) {
  const activeStep = document.querySelector(
    `[data-form-step="${stepNumber}"]`
  );

  if (!activeStep) {
    return false;
  }

  const fields = Array.from(
    activeStep.querySelectorAll(
      "input:not([type='hidden']), select, textarea"
    )
  );

  let stepIsValid = true;

  fields.forEach((field) => {
    if (!validateField(field)) {
      stepIsValid = false;
    }
  });

  if (stepNumber === 4 && !validateConsent()) {
    stepIsValid = false;
  }

  return stepIsValid;
}


function validateField(field) {
  if (
    field.type === "checkbox" &&
    field.closest(".consent-section")
  ) {
    return true;
  }

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
    setFieldError(field, "This field is required.");
    return false;
  }

  if (!field.required && !value) {
    return true;
  }

  if (field.type === "email" && !isValidEmail(value)) {
    setFieldError(field, "Enter a valid email address.");
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

  if (field.id === "dateOfBirth") {
    if (!isValidDateOfBirth(value)) {
      setFieldError(
        field,
        "Enter a valid date of birth."
      );

      return false;
    }
  }

  if (
    field.id === "height" &&
    (
      Number(value) < 100 ||
      Number(value) > 230
    )
  ) {
    setFieldError(
      field,
      "Height must be between 100 cm and 230 cm."
    );

    return false;
  }

  if (
    field.id === "weight" &&
    (
      Number(value) < 25 ||
      Number(value) > 200
    )
  ) {
    setFieldError(
      field,
      "Weight must be between 25 kg and 200 kg."
    );

    return false;
  }

  if (
    field.id === "playerBio" &&
    value.length < 40
  ) {
    setFieldError(
      field,
      "Write at least 40 characters about your football journey."
    );

    return false;
  }

  if (
    field.id === "highlightUrl" &&
    value &&
    !isValidUrl(value)
  ) {
    setFieldError(field, "Enter a valid public video URL.");
    return false;
  }

  if (
    field.id === "primaryPosition" &&
    field.value &&
    field.value ===
      document.getElementById("secondaryPosition").value
  ) {
    setFieldError(
      document.getElementById("secondaryPosition"),
      "Secondary position must differ from primary position."
    );

    return false;
  }

  if (field.type === "file") {
    return validateFileField(field);
  }

  return true;
}


function validateFileField(field) {
  const file = field.files[0];

  if (!file) {
    return !field.required;
  }

  if (field.id === "profilePhoto") {
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
        "Profile photo must be smaller than 5 MB."
      );

      return false;
    }
  }

  if (field.id === "identityDocument") {
    const allowedDocumentTypes = [
      "application/pdf",
      "image/jpeg",
      "image/png"
    ];

    if (!allowedDocumentTypes.includes(file.type)) {
      setFieldError(
        field,
        "Upload a PDF, JPG or PNG document."
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

  if (field.id === "highlightVideo") {
    const allowedVideoTypes = [
      "video/mp4",
      "video/webm",
      "video/quicktime"
    ];

    if (!allowedVideoTypes.includes(file.type)) {
      setFieldError(
        field,
        "Upload an MP4, WEBM or MOV video."
      );

      return false;
    }

    if (file.size > MAX_VIDEO_SIZE) {
      setFieldError(
        field,
        "Highlight video must be smaller than 100 MB."
      );

      return false;
    }
  }

  return true;
}


function validateConsent() {
  const informationConsent = document.getElementById(
    "informationConsent"
  );

  const termsConsent = document.getElementById(
    "termsConsent"
  );

  const consentError = document.getElementById(
    "consentError"
  );

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
  const formGroup =
    field.closest(".form-group") ||
    field.closest(".document-upload") ||
    field.closest(".profile-upload-copy");

  if (!formGroup) {
    return;
  }

  formGroup.classList.add("invalid");

  const errorElement =
    formGroup.querySelector(".error-message");

  if (errorElement) {
    errorElement.textContent = message;
  }

  field.setAttribute("aria-invalid", "true");
}


function clearFieldError(field) {
  const formGroup =
    field.closest(".form-group") ||
    field.closest(".document-upload") ||
    field.closest(".profile-upload-copy");

  if (!formGroup) {
    return;
  }

  formGroup.classList.remove("invalid");

  const errorElement =
    formGroup.querySelector(".error-message");

  if (errorElement) {
    errorElement.textContent = "";
  }

  field.removeAttribute("aria-invalid");
}


function focusFirstInvalidField() {
  const activeStep = document.querySelector(
    `[data-form-step="${currentStep}"]`
  );

  const firstInvalidField = activeStep?.querySelector(
    '[aria-invalid="true"]'
  );

  firstInvalidField?.focus();
}


/* ================= VALIDATION HELPERS ================= */

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}


function isValidUrl(url) {
  try {
    const parsedUrl = new URL(url);

    return (
      parsedUrl.protocol === "http:" ||
      parsedUrl.protocol === "https:"
    );
  } catch {
    return false;
  }
}


function isValidDateOfBirth(dateValue) {
  const birthDate = new Date(dateValue);

  if (Number.isNaN(birthDate.getTime())) {
    return false;
  }

  const today = new Date();

  if (birthDate > today) {
    return false;
  }

  const age =
    today.getFullYear() - birthDate.getFullYear();

  return age >= 5 && age <= 60;
}


/* ================= LIVE FIELD EVENTS ================= */

registrationForm.addEventListener("input", (event) => {
  const field = event.target;

  if (
    field.matches("input, select, textarea")
  ) {
    clearFieldError(field);
  }
});


registrationForm.addEventListener("change", (event) => {
  const field = event.target;

  if (
    field.matches("input, select, textarea")
  ) {
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


playerBio.addEventListener("input", () => {
  bioCharacterCount.textContent =
    String(playerBio.value.length);
});


/* ================= PROFILE PHOTO PREVIEW ================= */

profilePhoto.addEventListener("change", () => {
  clearFieldError(profilePhoto);

  const file = profilePhoto.files[0];

  if (!file) {
    resetProfilePreview();
    return;
  }

  if (!validateFileField(profilePhoto)) {
    profilePhoto.value = "";
    resetProfilePreview();
    return;
  }

  if (profileImageUrl) {
    URL.revokeObjectURL(profileImageUrl);
  }

  profileImageUrl = URL.createObjectURL(file);

  profilePreviewImage.src = profileImageUrl;
  profilePreviewImage.hidden = false;
  profileInitials.hidden = true;
});


function resetProfilePreview() {
  if (profileImageUrl) {
    URL.revokeObjectURL(profileImageUrl);
  }

  profileImageUrl = "";

  profilePreviewImage.removeAttribute("src");
  profilePreviewImage.hidden = true;
  profileInitials.hidden = false;
}


/* ================= FILE NAME DISPLAY ================= */

identityDocument.addEventListener("change", () => {
  updateSelectedFileName(
    identityDocument,
    identityDocumentName,
    "No file selected"
  );
});


highlightVideo.addEventListener("change", () => {
  updateSelectedFileName(
    highlightVideo,
    highlightVideoName,
    "No video selected"
  );
});


function updateSelectedFileName(
  input,
  displayElement,
  fallbackText
) {
  clearFieldError(input);

  const file = input.files[0];

  if (!file) {
    displayElement.textContent = fallbackText;
    return;
  }

  if (!validateFileField(input)) {
    input.value = "";
    displayElement.textContent = fallbackText;
    return;
  }

  displayElement.textContent = file.name;
}


/* ================= REVIEW SECTION ================= */

function populateReviewSection() {
  const firstName =
    document.getElementById("firstName").value.trim();

  const lastName =
    document.getElementById("lastName").value.trim();

  const city =
    document.getElementById("city").value.trim();

  const stateSelect =
    document.getElementById("state");

  const stateName =
    stateSelect.options[stateSelect.selectedIndex]?.text || "";

  const primaryPosition =
    getSelectedOptionText("primaryPosition");

  const preferredFoot =
    getSelectedOptionText("preferredFoot");

  const experienceLevel =
    getSelectedOptionText("experienceLevel");

  const playerName =
    `${firstName} ${lastName}`.trim() || "Your Name";

  const initials =
    `${firstName.charAt(0)}${lastName.charAt(0)}`
      .toUpperCase() || "PL";

  document.getElementById(
    "reviewPlayerName"
  ).textContent = playerName;

  document.getElementById(
    "reviewPlayerLocation"
  ).textContent =
    [city, stateName].filter(Boolean).join(", ") ||
    "Location not entered";

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
    "reviewPosition"
  ).textContent = primaryPosition || "—";

  document.getElementById(
    "reviewFoot"
  ).textContent = preferredFoot || "—";

  document.getElementById(
    "reviewExperience"
  ).textContent = experienceLevel || "—";

  const height =
    document.getElementById("height").value;

  const weight =
    document.getElementById("weight").value;

  document.getElementById(
    "reviewPhysical"
  ).textContent =
    height && weight
      ? `${height} cm / ${weight} kg`
      : "—";

  document.getElementById(
    "reviewClub"
  ).textContent =
    document.getElementById("currentClub").value.trim() ||
    "Not provided";

  document.getElementById(
    "reviewBio"
  ).textContent =
    document.getElementById("playerBio").value.trim() ||
    "—";

  document.getElementById(
    "reviewInitials"
  ).textContent = initials;

  const reviewProfileImage =
    document.getElementById("reviewProfileImage");

  const reviewInitials =
    document.getElementById("reviewInitials");

  if (profileImageUrl) {
    reviewProfileImage.src = profileImageUrl;
    reviewProfileImage.hidden = false;
    reviewInitials.hidden = true;
  } else {
    reviewProfileImage.hidden = true;
    reviewInitials.hidden = false;
  }
}


function getSelectedOptionText(selectId) {
  const select = document.getElementById(selectId);

  if (!select.value) {
    return "";
  }

  return select.options[select.selectedIndex].text;
}


/* ================= FORM SUBMISSION ================= */

registrationForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  if (!validateStep(4)) {
    focusFirstInvalidField();
    return;
  }

  setSubmittingState(true);

  try {
    const formData = new FormData(registrationForm);

    /*
      BACKEND INTEGRATION PLACEHOLDER
      --------------------------------

      Mr. Harsh can later replace the demonstration block with:

      const response = await fetch(
        "/api/v1/players/register",
        {
          method: "POST",
          body: formData,
          credentials: "include"
        }
      );

      if (!response.ok) {
        throw new Error("Player registration failed.");
      }

      const result = await response.json();

      sessionStorage.setItem(
        "verificationToken",
        result.verificationToken
      );

      sessionStorage.setItem(
        "maskedDestination",
        result.maskedDestination
      );

      sessionStorage.setItem(
        "registrationRole",
        "player"
      );

      window.location.href = "verify-otp.html";

      SECURITY REQUIREMENTS:
      - Validate all fields again on the server.
      - Never trust client-side file type validation.
      - Scan uploaded files before storage.
      - Apply authentication and authorisation.
      - Add CSRF protection where applicable.
      - Add rate limiting.
      - Sanitise user-generated text.
      - Store files outside publicly executable paths.
    */

    await simulateFrontendRequest(formData);

    /*
      FRONTEND DEMONSTRATION ONLY

      Store temporary information so the OTP page knows
      that the user came from the Player Registration page.
    */

    sessionStorage.setItem(
      "registrationRole",
      "player"
    );

    sessionStorage.setItem(
      "maskedDestination",
      getMaskedPhoneNumber()
    );

    /*
      Redirect the user to the OTP verification page.
    */

    window.location.href = "verify-otp.html";

  } catch (error) {
    console.error("Registration error:", error);

    window.alert(
      "We could not submit your registration. Please try again."
    );
  } finally {
    setSubmittingState(false);
  }
});


function simulateFrontendRequest(formData) {
  /*
    This function only demonstrates a loading state.
    It does not send or permanently store any data.
  */

  console.info(
    "Frontend player registration payload prepared:",
    Object.fromEntries(formData.entries())
  );

  return new Promise((resolve) => {
    window.setTimeout(resolve, 900);
  });
}


function getMaskedPhoneNumber() {
  const phoneInput = document.getElementById("phone");

  if (!phoneInput || !phoneInput.value.trim()) {
    return "+91 •••••• 0000";
  }

  const phoneNumber = phoneInput.value
    .replace(/\D/g, "")
    .slice(-10);

  const lastFourDigits = phoneNumber.slice(-4);

  return `+91 •••••• ${lastFourDigits}`;
}


function setSubmittingState(isSubmitting) {
  submitButton.classList.toggle(
    "loading",
    isSubmitting
  );

  submitButton.disabled = isSubmitting;

  const buttonLabel =
    submitButton.querySelector(".button-label");

  if (buttonLabel) {
    buttonLabel.textContent = isSubmitting
      ? "Submitting..."
      : "Submit Application";
  }
}


/* ================= INITIALISE ================= */

function initialiseRegistrationPage() {
  showStep(1);

  const today = new Date();

  document.getElementById("dateOfBirth").max =
    today.toISOString().split("T")[0];
}

initialiseRegistrationPage();


/* ================= CLEANUP ================= */

window.addEventListener("beforeunload", () => {
  if (profileImageUrl) {
    URL.revokeObjectURL(profileImageUrl);
  }
});