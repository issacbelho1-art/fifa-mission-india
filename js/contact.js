"use strict";

/* =====================================================
   CONTACT PAGE APPLICATION
===================================================== */

document.addEventListener("DOMContentLoaded", () => {
  const contactForm = document.getElementById("contactForm");

  const mobileMenuButton = document.getElementById("mobileMenuButton");
  const siteNavigation = document.getElementById("siteNavigation");

  const contactSubject = document.getElementById("contactSubject");
  const contactTitle = document.getElementById("contactTitle");
  const contactMessage = document.getElementById("contactMessage");

  const titleCharacterCount = document.getElementById(
    "contactTitleCharacterCount"
  );

  const messageCharacterCount = document.getElementById(
    "contactMessageCharacterCount"
  );

  const contactAttachment = document.getElementById("contactAttachment");
  const contactUploadArea = document.getElementById("contactUploadArea");
  const contactUploadPlaceholder = document.getElementById(
    "contactUploadPlaceholder"
  );
  const contactUploadPreview = document.getElementById(
    "contactUploadPreview"
  );
  const contactBrowseFileButton = document.getElementById(
    "contactBrowseFileButton"
  );
  const contactRemoveFileButton = document.getElementById(
    "contactRemoveFileButton"
  );
  const contactFileName = document.getElementById("contactFileName");
  const contactFileSize = document.getElementById("contactFileSize");
  const contactFileTypeIcon = document.getElementById(
    "contactFileTypeIcon"
  );
  const contactUploadError = document.getElementById("contactUploadError");

  const contactSubmitButton = document.getElementById(
    "contactSubmitButton"
  );
  const contactSubmitDefault = document.querySelector(
    ".contact-submit-default"
  );
  const contactSubmitLoading = document.querySelector(
    ".contact-submit-loading"
  );

  const contactSuccessModal = document.getElementById(
    "contactSuccessModal"
  );
  const contactModalCloseButton = document.getElementById(
    "contactModalCloseButton"
  );
  const contactSendAnotherButton = document.getElementById(
    "contactSendAnotherButton"
  );
  const contactReferenceNumber = document.getElementById(
    "contactReferenceNumber"
  );

  const contactNotification = document.getElementById(
    "contactNotification"
  );
  const contactNotificationMessage = document.getElementById(
    "contactNotificationMessage"
  );

  const currentYear = document.getElementById("currentYear");

  const maximumFileSize = 5 * 1024 * 1024;

  const allowedFileTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "image/jpeg",
    "image/png",
    "image/webp"
  ];

  let selectedAttachment = null;
  let notificationTimer = null;


  /* =====================================================
     CURRENT YEAR
  ===================================================== */

  if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
  }


  /* =====================================================
     MOBILE NAVIGATION
  ===================================================== */

  function closeMobileNavigation() {
    if (!siteNavigation || !mobileMenuButton) {
      return;
    }

    siteNavigation.classList.remove("mobile-open");
    mobileMenuButton.setAttribute("aria-expanded", "false");
  }


  if (mobileMenuButton && siteNavigation) {
    mobileMenuButton.addEventListener("click", () => {
      const menuIsOpen = siteNavigation.classList.toggle("mobile-open");

      mobileMenuButton.setAttribute(
        "aria-expanded",
        String(menuIsOpen)
      );
    });


    siteNavigation.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeMobileNavigation);
    });


    document.addEventListener("click", (event) => {
      const clickedInsideMenu = siteNavigation.contains(event.target);
      const clickedMenuButton = mobileMenuButton.contains(event.target);

      if (!clickedInsideMenu && !clickedMenuButton) {
        closeMobileNavigation();
      }
    });


    window.addEventListener("resize", () => {
      if (window.innerWidth > 1080) {
        closeMobileNavigation();
      }
    });
  }


  /* =====================================================
     CHARACTER COUNTERS
  ===================================================== */

  function updateCharacterCounter(input, counter, maximumLength) {
    if (!input || !counter) {
      return;
    }

    counter.textContent = `${input.value.length} / ${maximumLength}`;
  }


  if (contactTitle && titleCharacterCount) {
    updateCharacterCounter(contactTitle, titleCharacterCount, 120);

    contactTitle.addEventListener("input", () => {
      updateCharacterCounter(
        contactTitle,
        titleCharacterCount,
        120
      );

      clearFieldError(contactTitle);
    });
  }


  if (contactMessage && messageCharacterCount) {
    updateCharacterCounter(
      contactMessage,
      messageCharacterCount,
      1500
    );

    contactMessage.addEventListener("input", () => {
      updateCharacterCounter(
        contactMessage,
        messageCharacterCount,
        1500
      );

      clearFieldError(contactMessage);
    });
  }


  /* =====================================================
     DEPARTMENT AUTO-SELECTION
  ===================================================== */

  document
    .querySelectorAll(".contact-department-button")
    .forEach((button) => {
      button.addEventListener("click", () => {
        const selectedSubject = button.dataset.subject;

        if (contactSubject && selectedSubject) {
          contactSubject.value = selectedSubject;
          clearFieldError(contactSubject);
        }

        document
          .getElementById("contactFormSection")
          ?.scrollIntoView({
            behavior: "smooth",
            block: "start"
          });

        window.setTimeout(() => {
          contactTitle?.focus();
        }, 500);
      });
    });


  /* =====================================================
     FAQ ACCORDION
  ===================================================== */

  const faqItems = document.querySelectorAll(".contact-faq-item");

  faqItems.forEach((item) => {
    const button = item.querySelector(".contact-faq-button");

    button?.addEventListener("click", () => {
      const isActive = item.classList.contains("active");

      faqItems.forEach((faqItem) => {
        faqItem.classList.remove("active");
      });

      if (!isActive) {
        item.classList.add("active");
      }
    });
  });


  /* =====================================================
     FILE UPLOAD
  ===================================================== */

  function formatFileSize(sizeInBytes) {
    if (sizeInBytes < 1024) {
      return `${sizeInBytes} bytes`;
    }

    if (sizeInBytes < 1024 * 1024) {
      return `${(sizeInBytes / 1024).toFixed(1)} KB`;
    }

    return `${(sizeInBytes / (1024 * 1024)).toFixed(2)} MB`;
  }


  function getFileIconClass(file) {
    if (file.type === "application/pdf") {
      return "fa-file-pdf";
    }

    if (
      file.type === "application/msword" ||
      file.type ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      return "fa-file-word";
    }

    if (file.type.startsWith("image/")) {
      return "fa-file-image";
    }

    return "fa-file";
  }


  function clearUploadError() {
    contactUploadArea?.classList.remove("has-error");

    if (contactUploadError) {
      contactUploadError.textContent = "";
    }
  }


  function showUploadError(message) {
    contactUploadArea?.classList.add("has-error");

    if (contactUploadError) {
      contactUploadError.textContent = message;
    }
  }


  function resetAttachment() {
    selectedAttachment = null;

    if (contactAttachment) {
      contactAttachment.value = "";
    }

    if (contactUploadPlaceholder) {
      contactUploadPlaceholder.hidden = false;
    }

    if (contactUploadPreview) {
      contactUploadPreview.hidden = true;
    }

    clearUploadError();
  }


  function validateAttachment(file) {
    if (!file) {
      return false;
    }

    if (!allowedFileTypes.includes(file.type)) {
      showUploadError(
        "Please upload a PDF, DOC, DOCX, JPG, PNG or WEBP file."
      );

      return false;
    }

    if (file.size > maximumFileSize) {
      showUploadError("The selected file must not exceed 5 MB.");

      return false;
    }

    return true;
  }


  function displayAttachment(file) {
    if (!validateAttachment(file)) {
      resetAttachment();
      return;
    }

    selectedAttachment = file;
    clearUploadError();

    if (contactFileName) {
      contactFileName.textContent = file.name;
    }

    if (contactFileSize) {
      contactFileSize.textContent = formatFileSize(file.size);
    }

    if (contactFileTypeIcon) {
      contactFileTypeIcon.className = `fa-regular ${getFileIconClass(
        file
      )}`;
    }

    if (contactUploadPlaceholder) {
      contactUploadPlaceholder.hidden = true;
    }

    if (contactUploadPreview) {
      contactUploadPreview.hidden = false;
    }
  }


  contactBrowseFileButton?.addEventListener("click", () => {
    contactAttachment?.click();
  });


  contactAttachment?.addEventListener("change", () => {
    const file = contactAttachment.files?.[0];

    if (file) {
      displayAttachment(file);
    }
  });


  contactRemoveFileButton?.addEventListener("click", resetAttachment);


  if (contactUploadArea) {
    ["dragenter", "dragover"].forEach((eventName) => {
      contactUploadArea.addEventListener(eventName, (event) => {
        event.preventDefault();

        contactUploadArea.classList.add("is-dragging");
      });
    });


    ["dragleave", "drop"].forEach((eventName) => {
      contactUploadArea.addEventListener(eventName, (event) => {
        event.preventDefault();

        contactUploadArea.classList.remove("is-dragging");
      });
    });


    contactUploadArea.addEventListener("drop", (event) => {
      const file = event.dataTransfer?.files?.[0];

      if (!file) {
        return;
      }

      displayAttachment(file);
    });
  }


  /* =====================================================
     FORM VALIDATION
  ===================================================== */

  function getFieldWrapper(field) {
    return field?.closest(".contact-field");
  }


  function setFieldError(field, message) {
    if (!field) {
      return;
    }

    const fieldWrapper = getFieldWrapper(field);
    const errorElement = fieldWrapper?.querySelector(
      ".contact-field-error"
    );

    fieldWrapper?.classList.add("has-error");

    if (errorElement) {
      errorElement.textContent = message;
    }
  }


  function clearFieldError(field) {
    if (!field) {
      return;
    }

    const fieldWrapper = getFieldWrapper(field);
    const errorElement = fieldWrapper?.querySelector(
      ".contact-field-error"
    );

    fieldWrapper?.classList.remove("has-error");

    if (errorElement) {
      errorElement.textContent = "";
    }
  }


  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }


  function validatePhone(phone) {
    return /^[+\d][\d\s()-]{7,19}$/.test(phone);
  }


  function validateContactForm() {
    if (!contactForm) {
      return false;
    }

    let formIsValid = true;

    const requiredFields = [
      {
        id: "contactName",
        message: "Please enter your full name."
      },
      {
        id: "contactEmail",
        message: "Please enter your email address."
      },
      {
        id: "contactUserType",
        message: "Please select your role."
      },
      {
        id: "contactSubject",
        message: "Please select an enquiry department."
      },
      {
        id: "contactTitle",
        message: "Please enter the enquiry subject."
      },
      {
        id: "contactMessage",
        message: "Please enter your message."
      }
    ];


    requiredFields.forEach(({ id, message }) => {
      const field = document.getElementById(id);

      clearFieldError(field);

      if (!field?.value.trim()) {
        setFieldError(field, message);
        formIsValid = false;
      }
    });


    const emailField = document.getElementById("contactEmail");
    const phoneField = document.getElementById("contactPhone");
    const nameField = document.getElementById("contactName");
    const agreementField = document.getElementById("contactAgreement");
    const agreementWrapper = agreementField?.closest(
      ".contact-agreement"
    );
    const agreementError = agreementWrapper?.querySelector(
      ".contact-field-error"
    );


    if (
      emailField?.value.trim() &&
      !validateEmail(emailField.value.trim())
    ) {
      setFieldError(
        emailField,
        "Please enter a valid email address."
      );

      formIsValid = false;
    }


    if (
      phoneField?.value.trim() &&
      !validatePhone(phoneField.value.trim())
    ) {
      setFieldError(
        phoneField,
        "Please enter a valid phone number."
      );

      formIsValid = false;
    }


    if (
      nameField?.value.trim() &&
      nameField.value.trim().length < 2
    ) {
      setFieldError(
        nameField,
        "Your name must contain at least two characters."
      );

      formIsValid = false;
    }


    agreementWrapper?.classList.remove("has-error");

    if (agreementError) {
      agreementError.textContent = "";
    }


    if (!agreementField?.checked) {
      agreementWrapper?.classList.add("has-error");

      if (agreementError) {
        agreementError.textContent =
          "Please confirm the information and contact agreement.";
      }

      formIsValid = false;
    }


    if (!formIsValid) {
      const firstInvalidField = contactForm.querySelector(
        ".has-error input, .has-error select, .has-error textarea"
      );

      firstInvalidField?.focus();

      showNotification(
        "Please review the highlighted fields.",
        "error"
      );
    }

    return formIsValid;
  }


  contactForm
    ?.querySelectorAll("input, select, textarea")
    .forEach((field) => {
      field.addEventListener("input", () => {
        clearFieldError(field);
      });

      field.addEventListener("change", () => {
        clearFieldError(field);
      });
    });


  document
    .getElementById("contactAgreement")
    ?.addEventListener("change", () => {
      const agreementWrapper = document
        .getElementById("contactAgreement")
        ?.closest(".contact-agreement");

      const agreementError = agreementWrapper?.querySelector(
        ".contact-field-error"
      );

      agreementWrapper?.classList.remove("has-error");

      if (agreementError) {
        agreementError.textContent = "";
      }
    });


  /* =====================================================
     NOTIFICATION
  ===================================================== */

  function showNotification(message, type = "success") {
    if (
      !contactNotification ||
      !contactNotificationMessage
    ) {
      return;
    }

    window.clearTimeout(notificationTimer);

    contactNotificationMessage.textContent = message;

    contactNotification.classList.toggle(
      "error",
      type === "error"
    );

    contactNotification.classList.add("show");


    notificationTimer = window.setTimeout(() => {
      contactNotification.classList.remove("show");
    }, 3200);
  }


  /* =====================================================
     MODAL
  ===================================================== */

  function generateReferenceNumber() {
    const datePart = new Date()
      .toISOString()
      .slice(0, 10)
      .replaceAll("-", "");

    const randomPart = Math.floor(
      100000 + Math.random() * 900000
    );

    return `FMI-CONTACT-${datePart}-${randomPart}`;
  }


  function openSuccessModal(referenceNumber) {
    if (!contactSuccessModal) {
      return;
    }

    if (contactReferenceNumber) {
      contactReferenceNumber.textContent = referenceNumber;
    }

    contactSuccessModal.hidden = false;
    document.body.classList.add("modal-open");

    contactModalCloseButton?.focus();
  }


  function closeSuccessModal() {
    if (!contactSuccessModal) {
      return;
    }

    contactSuccessModal.hidden = true;
    document.body.classList.remove("modal-open");
  }


  contactModalCloseButton?.addEventListener(
    "click",
    closeSuccessModal
  );


  contactSendAnotherButton?.addEventListener("click", () => {
    closeSuccessModal();

    document
      .getElementById("contactFormSection")
      ?.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });

    window.setTimeout(() => {
      document.getElementById("contactName")?.focus();
    }, 450);
  });


  contactSuccessModal
    ?.querySelectorAll("[data-close-modal]")
    .forEach((element) => {
      element.addEventListener("click", closeSuccessModal);
    });


  document.addEventListener("keydown", (event) => {
    if (
      event.key === "Escape" &&
      contactSuccessModal &&
      !contactSuccessModal.hidden
    ) {
      closeSuccessModal();
    }
  });


  /* =====================================================
     FORM RESET
  ===================================================== */

  contactForm?.addEventListener("reset", () => {
    window.setTimeout(() => {
      contactForm
        .querySelectorAll(".contact-field")
        .forEach((fieldWrapper) => {
          fieldWrapper.classList.remove("has-error");

          const errorElement = fieldWrapper.querySelector(
            ".contact-field-error"
          );

          if (errorElement) {
            errorElement.textContent = "";
          }
        });


      const agreementWrapper = document
        .getElementById("contactAgreement")
        ?.closest(".contact-agreement");

      agreementWrapper?.classList.remove("has-error");

      const agreementError = agreementWrapper?.querySelector(
        ".contact-field-error"
      );

      if (agreementError) {
        agreementError.textContent = "";
      }


      updateCharacterCounter(
        contactTitle,
        titleCharacterCount,
        120
      );

      updateCharacterCounter(
        contactMessage,
        messageCharacterCount,
        1500
      );

      resetAttachment();

      showNotification("The contact form has been cleared.");
    }, 0);
  });


  /* =====================================================
     FORM SUBMISSION
  ===================================================== */

  function setSubmittingState(isSubmitting) {
    if (!contactSubmitButton) {
      return;
    }

    contactSubmitButton.disabled = isSubmitting;

    if (contactSubmitDefault) {
      contactSubmitDefault.hidden = isSubmitting;
    }

    if (contactSubmitLoading) {
      contactSubmitLoading.hidden = !isSubmitting;
    }
  }


  function buildContactPayload() {
    if (!contactForm) {
      return null;
    }

    const formData = new FormData(contactForm);

    return {
      fullName: formData.get("contactName")?.toString().trim(),
      email: formData.get("contactEmail")?.toString().trim(),
      phone: formData.get("contactPhone")?.toString().trim(),
      userType: formData.get("contactUserType"),
      state: formData.get("contactState")?.toString().trim(),
      department: formData.get("contactSubject"),
      subject: formData.get("contactTitle")?.toString().trim(),
      message: formData.get("contactMessage")?.toString().trim(),
      reference: formData
        .get("contactReference")
        ?.toString()
        .trim(),
      preferredContactMethod: formData.get(
        "preferredContactMethod"
      ),
      attachment: selectedAttachment,
      submittedAt: new Date().toISOString()
    };
  }


  async function submitContactForm(payload) {
    /*
      BACKEND INTEGRATION PLACEHOLDER FOR MR. HARSH

      Recommended endpoint:
      POST /api/v1/contact/enquiries

      When an attachment is included, submit the form using FormData.

      Example:

      const formData = new FormData();

      formData.append("fullName", payload.fullName);
      formData.append("email", payload.email);
      formData.append("phone", payload.phone);
      formData.append("userType", payload.userType);
      formData.append("state", payload.state);
      formData.append("department", payload.department);
      formData.append("subject", payload.subject);
      formData.append("message", payload.message);
      formData.append("reference", payload.reference);
      formData.append(
        "preferredContactMethod",
        payload.preferredContactMethod
      );

      if (payload.attachment) {
        formData.append("attachment", payload.attachment);
      }

      const response = await fetch(
        "/api/v1/contact/enquiries",
        {
          method: "POST",
          body: formData
        }
      );

      if (!response.ok) {
        throw new Error("Contact submission failed.");
      }

      return response.json();
    */


    return new Promise((resolve) => {
      window.setTimeout(() => {
        resolve({
          success: true,
          referenceNumber: generateReferenceNumber()
        });
      }, 1400);
    });
  }


  contactForm?.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!validateContactForm()) {
      return;
    }

    const contactPayload = buildContactPayload();

    if (!contactPayload) {
      showNotification(
        "Unable to prepare the contact request.",
        "error"
      );

      return;
    }

    setSubmittingState(true);

    try {
      const result = await submitContactForm(contactPayload);

      const referenceNumber =
        result.referenceNumber || generateReferenceNumber();

      contactForm.reset();
      resetAttachment();

      openSuccessModal(referenceNumber);
    } catch (error) {
      console.error("Contact form submission error:", error);

      showNotification(
        "The message could not be sent. Please try again.",
        "error"
      );
    } finally {
      setSubmittingState(false);
    }
  });


  /* =====================================================
     REPORT CONCERN BUTTON
  ===================================================== */

  document
    .querySelector(".contact-emergency-button")
    ?.addEventListener("click", () => {
      if (contactSubject) {
        contactSubject.value = "report-concern";
      }

      window.setTimeout(() => {
        contactTitle?.focus();
      }, 450);
    });


  /* =====================================================
     REVEAL ANIMATIONS
  ===================================================== */

  const revealElements = document.querySelectorAll(
    [
      ".contact-section-heading",
      ".contact-department-card",
      ".contact-form-intro",
      ".contact-form",
      ".contact-office-content",
      ".contact-map-card",
      ".contact-faq-item",
      ".contact-social-card",
      ".contact-emergency-card"
    ].join(",")
  );


  revealElements.forEach((element) => {
    element.classList.add("contact-reveal");
  });


  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.12
      }
    );


    revealElements.forEach((element) => {
      revealObserver.observe(element);
    });
  } else {
    revealElements.forEach((element) => {
      element.classList.add("is-visible");
    });
  }
});

/* =====================================================
   PRESELECT SUBJECT FROM URL
===================================================== */

document.addEventListener("DOMContentLoaded", () => {

  const contactSubject =
    document.getElementById("contactSubject");

  if (!contactSubject) {
    return;
  }

  const urlParams = new URLSearchParams(
    window.location.search
  );

  const subject =
    urlParams.get("subject");

  if (!subject) {
    return;
  }

  const optionExists = Array.from(
    contactSubject.options
  ).some((option) => option.value === subject);

  if (optionExists) {
    contactSubject.value = subject;
  }

});