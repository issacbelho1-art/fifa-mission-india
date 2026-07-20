"use strict";

/* =========================================================
   FIFA MISSION INDIA - SUPPORTER REGISTRATION
   Frontend only
========================================================= */

const form = document.getElementById(
  "supporterRegistrationForm"
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

const profilePhoto =
  document.getElementById("profilePhoto");

const profilePreviewImage =
  document.getElementById("profilePreviewImage");

const profileInitials =
  document.getElementById("profileInitials");

const supportMessage =
  document.getElementById("supportMessage");

const communityExperience =
  document.getElementById("communityExperience");

const messageCharacterCount =
  document.getElementById("messageCharacterCount");

const experienceCharacterCount =
  document.getElementById("experienceCharacterCount");

const successModal =
  document.getElementById("successModal");

const applicationReference =
  document.getElementById("applicationReference");

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

const stepTitles = [
  "Personal Details",
  "Support Preferences",
  "Community Profile",
  "Review & Join"
];

let currentStep = 1;
let profileImageUrl = "";


/* ================= STEP NAVIGATION ================= */

function showStep(stepNumber) {

  currentStep = stepNumber;


  formSteps.forEach((step) => {

    const value = Number(step.dataset.formStep);

    step.classList.toggle(
      "active",
      value === currentStep
    );

  });


  progressSteps.forEach((step) => {

    const value = Number(step.dataset.progressStep);

    step.classList.toggle(
      "active",
      value === currentStep
    );

    step.classList.toggle(
      "completed",
      value < currentStep
    );


    if (value === currentStep) {

      step.setAttribute("aria-current", "step");

    } else {

      step.removeAttribute("aria-current");

    }

  });


  previousButton.hidden =
    currentStep === 1;

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


  if (field.id === "dateOfBirth") {

    const birthDate = new Date(value);
    const today = new Date();

    if (
      Number.isNaN(birthDate.getTime()) ||
      birthDate > today
    ) {

      setFieldError(
        field,
        "Enter a valid date of birth."
      );

      return false;

    }

  }


  if (
    field.id === "supportMessage" &&
    value.length < 30
  ) {

    setFieldError(
      field,
      "Write at least 30 characters about why you support the mission."
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


  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/webp"
  ];


  if (!allowedTypes.includes(file.type)) {

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
      "Please confirm both required declarations before joining.";

    return false;

  }


  consentError.textContent = "";

  return true;

}


function setFieldError(field, message) {

  const group =
    field.closest(".form-group") ||
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

  document
    .querySelector(
      `[data-form-step="${currentStep}"]`
    )
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

  if (
    field.id === "informationConsent" ||
    field.id === "termsConsent"
  ) {

    document.getElementById(
      "consentError"
    ).textContent = "";

  }

});


supportMessage.addEventListener("input", () => {

  messageCharacterCount.textContent =
    supportMessage.value.length;

});


communityExperience.addEventListener("input", () => {

  experienceCharacterCount.textContent =
    communityExperience.value.length;

});


/* ================= PROFILE PHOTO ================= */

profilePhoto.addEventListener("change", () => {

  clearFieldError(profilePhoto);

  const file = profilePhoto.files[0];


  if (!file) {

    resetProfilePreview();
    return;

  }


  if (!validateFile(profilePhoto)) {

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

  profilePreviewImage.hidden = true;
  profilePreviewImage.removeAttribute("src");

  profileInitials.hidden = false;

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

  const firstName =
    document.getElementById("firstName").value.trim();

  const lastName =
    document.getElementById("lastName").value.trim();

  const city =
    document.getElementById("city").value.trim();

  const state =
    getSelectedText("state");

  const fullName =
    `${firstName} ${lastName}`.trim() ||
    "Your Name";

  const initials =
    `${firstName.charAt(0)}${lastName.charAt(0)}`
      .toUpperCase() || "SU";


  document.getElementById(
    "reviewSupporterName"
  ).textContent = fullName;


  document.getElementById(
    "reviewSupporterLocation"
  ).textContent =
    [city, state].filter(Boolean).join(", ") ||
    "Location not entered";


  document.getElementById(
    "reviewEmail"
  ).textContent =
    document.getElementById("email").value ||
    "—";


  document.getElementById(
    "reviewPhone"
  ).textContent =
    document.getElementById("phone").value
      ? `+91 ${document.getElementById("phone").value}`
      : "—";


  document.getElementById(
    "reviewSupporterType"
  ).textContent =
    getSelectedText("supporterType") ||
    "—";


  document.getElementById(
    "reviewInterest"
  ).textContent =
    getSelectedText("primaryInterest") ||
    "—";


  document.getElementById(
    "reviewParticipation"
  ).textContent =
    getSelectedText("participationPreference") ||
    "—";


  document.getElementById(
    "reviewCommunication"
  ).textContent =
    getSelectedText("communicationPreference") ||
    "—";


  document.getElementById(
    "reviewMessage"
  ).textContent =
    supportMessage.value.trim() ||
    "—";


  const reviewInitials =
    document.getElementById("reviewInitials");

  const reviewProfileImage =
    document.getElementById("reviewProfileImage");

  reviewInitials.textContent = initials;


  if (profileImageUrl) {

    reviewProfileImage.src = profileImageUrl;
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
        "/api/v1/supporters/register",
        {
          method: "POST",
          body: formData,
          credentials: "include"
        }
      );

      if (!response.ok) {
        throw new Error("Supporter registration failed.");
      }

      const result = await response.json();

      showSuccessModal(result.supporterReference);
    */

    console.info(
      "Supporter registration payload:",
      Object.fromEntries(formData.entries())
    );


    await new Promise((resolve) => {

      window.setTimeout(resolve, 900);

    });


    showSuccessModal(
      generateSupporterReference()
    );

  } catch (error) {

    console.error(
      "Supporter registration error:",
      error
    );

    window.alert(
      "Supporter registration could not be completed. Please try again."
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
      ? "Joining..."
      : "Join the Mission";

}


function generateSupporterReference() {

  const number = Math.floor(
    100000 + Math.random() * 900000
  );

  return `FMI-SUPPORTER-${number}`;

}


function showSuccessModal(reference) {

  applicationReference.textContent = reference;

  successModal.hidden = false;

  document.body.style.overflow = "hidden";

}


/* ================= INITIALISE ================= */

function initialisePage() {

  const today = new Date();

  document.getElementById("dateOfBirth").max =
    today.toISOString().split("T")[0];

  showStep(1);

}


initialisePage();


window.addEventListener("beforeunload", () => {

  if (profileImageUrl) {

    URL.revokeObjectURL(profileImageUrl);

  }

});