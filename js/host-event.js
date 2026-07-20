"use strict";

/* =====================================================
   HOST EVENT PAGE
   Frontend-only JavaScript

   Backend integration placeholder:
   POST /api/v1/events/host
===================================================== */

document.addEventListener("DOMContentLoaded", () => {
  const hostEventForm = document.getElementById("hostEventForm");

  if (!hostEventForm) {
    return;
  }

  /* =====================================================
     ELEMENT REFERENCES
  ====================================================== */

  const mobileMenuButton = document.getElementById("mobileMenuButton");
  const siteNavigation = document.getElementById("siteNavigation");

  const eventDescription = document.getElementById("eventDescription");
  const descriptionCharacterCount = document.getElementById(
    "descriptionCharacterCount"
  );

  const registrationType = document.getElementById("registrationType");
  const registrationFeeField = document.getElementById(
    "registrationFeeField"
  );
  const registrationFee = document.getElementById("registrationFee");

  const eventStartDate = document.getElementById("eventStartDate");
  const eventEndDate = document.getElementById("eventEndDate");
  const registrationDeadline = document.getElementById(
    "registrationDeadline"
  );

  const eventPoster = document.getElementById("eventPoster");
  const eventPosterUploadArea = document.getElementById(
    "eventPosterUploadArea"
  );
  const eventPosterUploadPlaceholder = document.getElementById(
    "eventPosterUploadPlaceholder"
  );
  const eventPosterPreview = document.getElementById("eventPosterPreview");
  const eventPosterPreviewImage = document.getElementById(
    "eventPosterPreviewImage"
  );
  const eventPosterFileName = document.getElementById(
    "eventPosterFileName"
  );
  const eventPosterFileSize = document.getElementById(
    "eventPosterFileSize"
  );
  const eventPosterError = document.getElementById("eventPosterError");
  const browsePosterButton = document.getElementById(
    "browsePosterButton"
  );
  const removePosterButton = document.getElementById(
    "removePosterButton"
  );

  const informationAgreement = document.getElementById(
    "informationAgreement"
  );

  const saveDraftButton = document.getElementById("saveDraftButton");
  const submitEventButton = document.getElementById("submitEventButton");
  const submitButtonDefault = submitEventButton?.querySelector(
    ".submit-button-default"
  );
  const submitButtonLoading = submitEventButton?.querySelector(
    ".submit-button-loading"
  );

  const submissionSuccessModal = document.getElementById(
    "submissionSuccessModal"
  );
  const closeSuccessModalButton = document.getElementById(
    "closeSuccessModalButton"
  );
  const submitAnotherEventButton = document.getElementById(
    "submitAnotherEventButton"
  );
  const submissionReference = document.getElementById(
    "submissionReference"
  );

  const hostEventNotification = document.getElementById(
    "hostEventNotification"
  );
  const hostEventNotificationMessage = document.getElementById(
    "hostEventNotificationMessage"
  );

  const currentYear = document.getElementById("currentYear");

  const DRAFT_STORAGE_KEY = "fmi-host-event-draft";
  const MAX_POSTER_SIZE = 5 * 1024 * 1024;

  const ALLOWED_POSTER_TYPES = [
    "image/jpeg",
    "image/png",
    "image/webp"
  ];

  let selectedPosterFile = null;
  let previewObjectUrl = null;
  let notificationTimer = null;

  /* =====================================================
     INITIAL SETUP
  ====================================================== */

  setCurrentYear();
  setMinimumDates();
  updateDescriptionCharacterCount();
  updateRegistrationFeeVisibility();
  restoreDraft();
  initialiseRevealAnimations();

  /* =====================================================
     CURRENT YEAR
  ====================================================== */

  function setCurrentYear() {
    if (currentYear) {
      currentYear.textContent = String(new Date().getFullYear());
    }
  }

  /* =====================================================
     MOBILE NAVIGATION
  ====================================================== */

  mobileMenuButton?.addEventListener("click", () => {
    const isOpen = siteNavigation.classList.toggle("open");

    mobileMenuButton.setAttribute(
      "aria-expanded",
      String(isOpen)
    );

    mobileMenuButton.setAttribute(
      "aria-label",
      isOpen
        ? "Close navigation menu"
        : "Open navigation menu"
    );
  });

  siteNavigation?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      siteNavigation.classList.remove("open");

      mobileMenuButton?.setAttribute(
        "aria-expanded",
        "false"
      );

      mobileMenuButton?.setAttribute(
        "aria-label",
        "Open navigation menu"
      );
    });
  });

  document.addEventListener("click", (event) => {
    if (
      !siteNavigation?.classList.contains("open") ||
      siteNavigation.contains(event.target) ||
      mobileMenuButton?.contains(event.target)
    ) {
      return;
    }

    siteNavigation.classList.remove("open");

    mobileMenuButton?.setAttribute(
      "aria-expanded",
      "false"
    );
  });

  /* =====================================================
     DESCRIPTION CHARACTER COUNTER
  ====================================================== */

  eventDescription?.addEventListener(
    "input",
    updateDescriptionCharacterCount
  );

  function updateDescriptionCharacterCount() {
    if (!eventDescription || !descriptionCharacterCount) {
      return;
    }

    const currentLength = eventDescription.value.length;
    const maximumLength = Number(
      eventDescription.getAttribute("maxlength")
    ) || 1200;

    descriptionCharacterCount.textContent =
      `${currentLength} / ${maximumLength}`;
  }

  /* =====================================================
     DATE CONTROLS
  ====================================================== */

  function setMinimumDates() {
    const today = new Date();
    const todayValue = formatDateForInput(today);

    if (eventStartDate) {
      eventStartDate.min = todayValue;
    }

    if (eventEndDate) {
      eventEndDate.min = todayValue;
    }

    if (registrationDeadline) {
      registrationDeadline.min = todayValue;
    }
  }

  eventStartDate?.addEventListener("change", () => {
    clearFieldError(eventStartDate);

    if (!eventStartDate.value) {
      return;
    }

    eventEndDate.min = eventStartDate.value;

    if (
      eventEndDate.value &&
      eventEndDate.value < eventStartDate.value
    ) {
      eventEndDate.value = eventStartDate.value;
    }

    registrationDeadline.max = eventStartDate.value;

    if (
      registrationDeadline.value &&
      registrationDeadline.value > eventStartDate.value
    ) {
      registrationDeadline.value = "";
    }
  });

  eventEndDate?.addEventListener("change", () => {
    clearFieldError(eventEndDate);
  });

  registrationDeadline?.addEventListener("change", () => {
    clearFieldError(registrationDeadline);
  });

  function formatDateForInput(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }

  /* =====================================================
     REGISTRATION FEE VISIBILITY
  ====================================================== */

  registrationType?.addEventListener(
    "change",
    updateRegistrationFeeVisibility
  );

  function updateRegistrationFeeVisibility() {
    if (
      !registrationType ||
      !registrationFeeField ||
      !registrationFee
    ) {
      return;
    }

    const isPaid = registrationType.value === "paid";

    registrationFeeField.hidden = !isPaid;
    registrationFee.required = isPaid;

    if (!isPaid) {
      registrationFee.value = "";
      clearFieldError(registrationFee);
    }
  }

  /* =====================================================
     POSTER UPLOAD
  ====================================================== */

  browsePosterButton?.addEventListener("click", () => {
    eventPoster?.click();
  });

  eventPoster?.addEventListener("change", () => {
    const file = eventPoster.files?.[0];

    if (file) {
      processPosterFile(file);
    }
  });

  removePosterButton?.addEventListener("click", () => {
    clearPosterSelection();
  });

  eventPosterUploadArea?.addEventListener("dragenter", (event) => {
    event.preventDefault();
    eventPosterUploadArea.classList.add("is-dragging");
  });

  eventPosterUploadArea?.addEventListener("dragover", (event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "copy";
    eventPosterUploadArea.classList.add("is-dragging");
  });

  eventPosterUploadArea?.addEventListener("dragleave", (event) => {
    if (
      event.currentTarget.contains(event.relatedTarget)
    ) {
      return;
    }

    eventPosterUploadArea.classList.remove("is-dragging");
  });

  eventPosterUploadArea?.addEventListener("drop", (event) => {
    event.preventDefault();

    eventPosterUploadArea.classList.remove("is-dragging");

    const file = event.dataTransfer.files?.[0];

    if (file) {
      processPosterFile(file);
    }
  });

  function processPosterFile(file) {
    clearPosterError();

    if (!ALLOWED_POSTER_TYPES.includes(file.type)) {
      showPosterError(
        "Please select a JPG, PNG or WEBP image."
      );

      return;
    }

    if (file.size > MAX_POSTER_SIZE) {
      showPosterError(
        "The poster must be smaller than 5 MB."
      );

      return;
    }

    selectedPosterFile = file;

    if (previewObjectUrl) {
      URL.revokeObjectURL(previewObjectUrl);
    }

    previewObjectUrl = URL.createObjectURL(file);

    eventPosterPreviewImage.src = previewObjectUrl;
    eventPosterPreviewImage.alt =
      `Preview of ${file.name}`;

    eventPosterFileName.textContent = file.name;
    eventPosterFileSize.textContent = formatFileSize(file.size);

    eventPosterUploadPlaceholder.hidden = true;
    eventPosterPreview.hidden = false;
  }

  function clearPosterSelection() {
    selectedPosterFile = null;

    if (eventPoster) {
      eventPoster.value = "";
    }

    if (previewObjectUrl) {
      URL.revokeObjectURL(previewObjectUrl);
      previewObjectUrl = null;
    }

    if (eventPosterPreviewImage) {
      eventPosterPreviewImage.src = "";
    }

    if (eventPosterFileName) {
      eventPosterFileName.textContent = "Event poster";
    }

    if (eventPosterFileSize) {
      eventPosterFileSize.textContent = "";
    }

    if (eventPosterUploadPlaceholder) {
      eventPosterUploadPlaceholder.hidden = false;
    }

    if (eventPosterPreview) {
      eventPosterPreview.hidden = true;
    }

    clearPosterError();
  }

  function formatFileSize(bytes) {
    if (bytes < 1024) {
      return `${bytes} bytes`;
    }

    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }

    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  function showPosterError(message) {
    if (eventPosterError) {
      eventPosterError.textContent = message;
    }
  }

  function clearPosterError() {
    if (eventPosterError) {
      eventPosterError.textContent = "";
    }
  }

  /* =====================================================
     FIELD VALIDATION
  ====================================================== */

  hostEventForm
    .querySelectorAll("input, select, textarea")
    .forEach((field) => {
      field.addEventListener("input", () => {
        clearFieldError(field);
      });

      field.addEventListener("change", () => {
        clearFieldError(field);
      });

      field.addEventListener("blur", () => {
        validateField(field);
      });
    });

  function validateField(field) {
    if (!field || field.disabled || field.closest("[hidden]")) {
      return true;
    }

    const value =
      field.type === "checkbox"
        ? field.checked
        : field.value.trim();

    let message = "";

    if (field.required) {
      if (field.type === "checkbox" && !field.checked) {
        message =
          "You must confirm the information before submitting.";
      } else if (field.type !== "checkbox" && !value) {
        message = "This field is required.";
      }
    }

    if (!message && value && field.type === "email") {
      const emailPattern =
        /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

      if (!emailPattern.test(value)) {
        message = "Enter a valid email address.";
      }
    }

    if (!message && value && field.type === "tel") {
      const numericPhone = value.replace(/\D/g, "");

      if (
        numericPhone.length < 10 ||
        numericPhone.length > 15
      ) {
        message = "Enter a valid phone number.";
      }
    }

    if (!message && value && field.type === "url") {
      if (!isValidUrl(value)) {
        message =
          "Enter a valid link beginning with http:// or https://.";
      }
    }

    if (!message && field.id === "eventEndDate") {
      if (
        eventStartDate.value &&
        field.value &&
        field.value < eventStartDate.value
      ) {
        message =
          "The end date cannot be before the start date.";
      }
    }

    if (!message && field.id === "registrationDeadline") {
      if (
        eventStartDate.value &&
        field.value &&
        field.value > eventStartDate.value
      ) {
        message =
          "The registration deadline must be on or before the start date.";
      }
    }

    if (!message && field.id === "registrationFee") {
      if (
        registrationType.value === "paid" &&
        (!field.value || Number(field.value) <= 0)
      ) {
        message =
          "Enter a valid registration fee.";
      }
    }

    if (!message && field.id === "maximumParticipants") {
      if (field.value && Number(field.value) < 1) {
        message =
          "Maximum participants must be at least 1.";
      }
    }

    if (message) {
      setFieldError(field, message);
      return false;
    }

    clearFieldError(field);
    return true;
  }

  function validateForm() {
    const fields = [
      ...hostEventForm.querySelectorAll(
        "input, select, textarea"
      )
    ];

    let isValid = true;
    let firstInvalidField = null;

    fields.forEach((field) => {
      const fieldIsValid = validateField(field);

      if (!fieldIsValid) {
        isValid = false;

        if (!firstInvalidField) {
          firstInvalidField = field;
        }
      }
    });

    if (!isValid && firstInvalidField) {
      firstInvalidField.scrollIntoView({
        behavior: "smooth",
        block: "center"
      });

      window.setTimeout(() => {
        firstInvalidField.focus({
          preventScroll: true
        });
      }, 350);
    }

    return isValid;
  }

  function setFieldError(field, message) {
    const fieldContainer =
      field.closest(".host-event-field") ||
      field.closest(".host-event-agreement");

    if (!fieldContainer) {
      return;
    }

    fieldContainer.classList.add("has-error");

    const errorElement =
      fieldContainer.querySelector(".field-error");

    if (errorElement) {
      errorElement.textContent = message;
    }

    field.setAttribute("aria-invalid", "true");
  }

  function clearFieldError(field) {
    const fieldContainer =
      field.closest(".host-event-field") ||
      field.closest(".host-event-agreement");

    if (!fieldContainer) {
      return;
    }

    fieldContainer.classList.remove("has-error");

    const errorElement =
      fieldContainer.querySelector(".field-error");

    if (errorElement) {
      errorElement.textContent = "";
    }

    field.removeAttribute("aria-invalid");
  }

  function clearAllErrors() {
    hostEventForm
      .querySelectorAll(".has-error")
      .forEach((container) => {
        container.classList.remove("has-error");
      });

    hostEventForm
      .querySelectorAll(".field-error")
      .forEach((errorElement) => {
        errorElement.textContent = "";
      });

    hostEventForm
      .querySelectorAll("[aria-invalid]")
      .forEach((field) => {
        field.removeAttribute("aria-invalid");
      });

    clearPosterError();
  }

  function isValidUrl(value) {
    try {
      const parsedUrl = new URL(value);

      return (
        parsedUrl.protocol === "http:" ||
        parsedUrl.protocol === "https:"
      );
    } catch {
      return false;
    }
  }

  /* =====================================================
     SAVE DRAFT
  ====================================================== */

  saveDraftButton?.addEventListener("click", () => {
    const draftData = collectFormData(false);

    try {
      localStorage.setItem(
        DRAFT_STORAGE_KEY,
        JSON.stringify(draftData)
      );

      showNotification(
        "Your event draft has been saved on this device."
      );
    } catch (error) {
      console.error("Could not save event draft:", error);

      showNotification(
        "The draft could not be saved.",
        "error"
      );
    }
  });

  function restoreDraft() {
    let savedDraft = null;

    try {
      savedDraft = localStorage.getItem(DRAFT_STORAGE_KEY);
    } catch (error) {
      console.error("Could not access saved draft:", error);
      return;
    }

    if (!savedDraft) {
      return;
    }

    try {
      const draftData = JSON.parse(savedDraft);

      Object.entries(draftData).forEach(([name, value]) => {
        const field = hostEventForm.elements.namedItem(name);

        if (!field || name === "eventPoster") {
          return;
        }

        if (field.type === "checkbox") {
          field.checked = Boolean(value);
        } else {
          field.value = value ?? "";
        }
      });

      updateDescriptionCharacterCount();
      updateRegistrationFeeVisibility();

      if (
        eventStartDate.value &&
        eventEndDate
      ) {
        eventEndDate.min = eventStartDate.value;
      }

      if (
        eventStartDate.value &&
        registrationDeadline
      ) {
        registrationDeadline.max =
          eventStartDate.value;
      }

      showNotification(
        "Your saved event draft has been restored."
      );
    } catch (error) {
      console.error("Could not restore event draft:", error);

      try {
        localStorage.removeItem(DRAFT_STORAGE_KEY);
      } catch {
        // Ignore storage cleanup errors.
      }
    }
  }

  /* =====================================================
     FORM SUBMISSION
  ====================================================== */

  hostEventForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    clearAllErrors();

    if (!validateForm()) {
      showNotification(
        "Please correct the highlighted fields.",
        "error"
      );

      return;
    }

    setSubmittingState(true);

    const submissionData = collectFormData(true);

    try {
      /*
       * BACKEND INTEGRATION PLACEHOLDER FOR MR. HARSH
       *
       * Replace the simulated request below with:
       *
       * const formData = new FormData();
       *
       * Object.entries(submissionData).forEach(([key, value]) => {
       *   if (value !== null && value !== "") {
       *     formData.append(key, value);
       *   }
       * });
       *
       * if (selectedPosterFile) {
       *   formData.append("eventPoster", selectedPosterFile);
       * }
       *
       * const response = await fetch(
       *   "/api/v1/events/host",
       *   {
       *     method: "POST",
       *     body: formData,
       *     credentials: "include"
       *   }
       * );
       *
       * if (!response.ok) {
       *   throw new Error("Event submission failed.");
       * }
       *
       * const result = await response.json();
       */

      await simulateNetworkRequest();

      const reference = generateSubmissionReference();

      if (submissionReference) {
        submissionReference.textContent = reference;
      }

      try {
        localStorage.removeItem(DRAFT_STORAGE_KEY);
      } catch {
        // Ignore storage cleanup errors.
      }

      openSuccessModal();
    } catch (error) {
      console.error("Event submission failed:", error);

      showNotification(
        "The event could not be submitted. Please try again.",
        "error"
      );
    } finally {
      setSubmittingState(false);
    }
  });

  function collectFormData(includeFileInformation = true) {
    const rawFormData = new FormData(hostEventForm);
    const data = {};

    rawFormData.forEach((value, key) => {
      if (value instanceof File) {
        return;
      }

      data[key] =
        typeof value === "string"
          ? value.trim()
          : value;
    });

    data.informationAgreement =
      Boolean(informationAgreement?.checked);

    if (registrationType?.value !== "paid") {
      data.registrationFee = "";
    }

    if (includeFileInformation) {
      data.eventPoster = selectedPosterFile
        ? {
            name: selectedPosterFile.name,
            type: selectedPosterFile.type,
            size: selectedPosterFile.size
          }
        : null;
    }

    data.submittedAt = new Date().toISOString();
    data.status = "pending-review";

    return data;
  }

  function setSubmittingState(isSubmitting) {
    if (!submitEventButton) {
      return;
    }

    submitEventButton.disabled = isSubmitting;

    if (submitButtonDefault) {
      submitButtonDefault.hidden = isSubmitting;
    }

    if (submitButtonLoading) {
      submitButtonLoading.hidden = !isSubmitting;
    }
  }

  function simulateNetworkRequest() {
    return new Promise((resolve) => {
      window.setTimeout(resolve, 1200);
    });
  }

  function generateSubmissionReference() {
    const now = new Date();

    const year = now.getFullYear();

    const randomNumber = Math.floor(
      1000 + Math.random() * 9000
    );

    return `FMI-EVENT-${year}-${randomNumber}`;
  }

  /* =====================================================
     SUCCESS MODAL
  ====================================================== */

  closeSuccessModalButton?.addEventListener(
    "click",
    closeSuccessModal
  );

  submitAnotherEventButton?.addEventListener("click", () => {
    closeSuccessModal();
    resetForm();

    document
      .getElementById("hostEventFormSection")
      ?.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
  });

  submissionSuccessModal
    ?.querySelector("[data-close-modal]")
    ?.addEventListener("click", closeSuccessModal);

  document.addEventListener("keydown", (event) => {
    if (
      event.key === "Escape" &&
      submissionSuccessModal &&
      !submissionSuccessModal.hidden
    ) {
      closeSuccessModal();
    }
  });

  function openSuccessModal() {
    if (!submissionSuccessModal) {
      return;
    }

    submissionSuccessModal.hidden = false;
    document.body.classList.add("modal-open");

    window.setTimeout(() => {
      closeSuccessModalButton?.focus();
    }, 0);
  }

  function closeSuccessModal() {
    if (!submissionSuccessModal) {
      return;
    }

    submissionSuccessModal.hidden = true;
    document.body.classList.remove("modal-open");
  }

  function resetForm() {
    hostEventForm.reset();

    clearAllErrors();
    clearPosterSelection();

    updateDescriptionCharacterCount();
    updateRegistrationFeeVisibility();
    setMinimumDates();

    if (eventEndDate) {
      eventEndDate.min =
        eventStartDate?.min || "";
    }

    if (registrationDeadline) {
      registrationDeadline.max = "";
    }
  }

  /* =====================================================
     NOTIFICATIONS
  ====================================================== */

  function showNotification(message, type = "success") {
    if (
      !hostEventNotification ||
      !hostEventNotificationMessage
    ) {
      return;
    }

    window.clearTimeout(notificationTimer);

    hostEventNotificationMessage.textContent = message;

    hostEventNotification.classList.toggle(
      "is-error",
      type === "error"
    );

    const icon =
      hostEventNotification.querySelector("i");

    if (icon) {
      icon.className =
        type === "error"
          ? "fa-solid fa-circle-exclamation"
          : "fa-solid fa-circle-check";
    }

    hostEventNotification.classList.add("show");

    notificationTimer = window.setTimeout(() => {
      hostEventNotification.classList.remove("show");
    }, 3600);
  }

  /* =====================================================
     REVEAL ANIMATIONS
  ====================================================== */

  function initialiseRevealAnimations() {
    const revealElements = document.querySelectorAll(
      [
        ".host-event-process-card",
        ".host-event-form-intro",
        ".host-event-form",
        ".host-event-hero-card"
      ].join(",")
    );

    if (
      !("IntersectionObserver" in window) ||
      window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches
    ) {
      revealElements.forEach((element) => {
        element.classList.add("is-visible");
      });

      return;
    }

    revealElements.forEach((element) => {
      element.classList.add("host-event-reveal");
    });

    const observer = new IntersectionObserver(
      (entries, revealObserver) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        });
      },
      {
        threshold: 0.15,
        rootMargin: "0px 0px -40px 0px"
      }
    );

    revealElements.forEach((element) => {
      observer.observe(element);
    });
  }

  /* =====================================================
     CLEANUP
  ====================================================== */

  window.addEventListener("beforeunload", () => {
    if (previewObjectUrl) {
      URL.revokeObjectURL(previewObjectUrl);
    }
  });
});