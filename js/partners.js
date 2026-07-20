/* =====================================================
   SPONSORS & PARTNERS
   Frontend-only interaction

   Backend integration: Mr. Harsh
===================================================== */

document.addEventListener("DOMContentLoaded", () => {

  const filterButtons = document.querySelectorAll(
    "[data-partner-filter]"
  );

  const partnerItems = document.querySelectorAll(
    "[data-partner-item]"
  );

  const emptyState = document.getElementById(
    "partnerEmptyState"
  );

  const openModalButton = document.getElementById(
    "openPartnerModal"
  );

  const partnerModal = document.getElementById(
    "partnerEnquiryModal"
  );

  const closeModalButtons = document.querySelectorAll(
    "[data-close-partner-modal]"
  );

  const partnerForm = document.getElementById(
    "partnerEnquiryForm"
  );

  const messageField = document.getElementById(
    "partnerMessage"
  );

  const messageCount = document.getElementById(
    "partnerMessageCount"
  );

  const formStatus = document.getElementById(
    "partnerFormStatus"
  );


  let lastFocusedElement = null;


  /* ===================================================
     PARTNER FILTERING
  =================================================== */

  function filterPartners(selectedCategory) {

    let visiblePartnerCount = 0;

    partnerItems.forEach((partnerItem) => {

      const partnerCategory =
        partnerItem.dataset.partnerCategory;

      const shouldShow =
        selectedCategory === "all" ||
        partnerCategory === selectedCategory;

      partnerItem.classList.toggle(
        "is-hidden",
        !shouldShow
      );

      if (shouldShow) {
        visiblePartnerCount += 1;
      }

    });


    filterButtons.forEach((button) => {

      const isActive =
        button.dataset.partnerFilter ===
        selectedCategory;

      button.classList.toggle(
        "is-active",
        isActive
      );

      button.setAttribute(
        "aria-pressed",
        String(isActive)
      );

    });


    if (emptyState) {
      emptyState.hidden = visiblePartnerCount !== 0;
    }

  }


  filterButtons.forEach((button) => {

    button.addEventListener("click", () => {

      const selectedCategory =
        button.dataset.partnerFilter;

      filterPartners(selectedCategory);

    });

  });


  /* ===================================================
     MODAL CONTROLS
  =================================================== */

  function openPartnerModal() {

    if (!partnerModal) {
      return;
    }

    lastFocusedElement = document.activeElement;

    partnerModal.classList.add("is-open");
    partnerModal.setAttribute("aria-hidden", "false");

    document.body.classList.add(
      "partner-modal-open"
    );

    window.setTimeout(() => {

      const firstInput =
        partnerModal.querySelector("input");

      firstInput?.focus();

    }, 150);

  }


  function closePartnerModal() {

    if (!partnerModal) {
      return;
    }

    partnerModal.classList.remove("is-open");
    partnerModal.setAttribute("aria-hidden", "true");

    document.body.classList.remove(
      "partner-modal-open"
    );

    if (lastFocusedElement) {
      lastFocusedElement.focus();
    }

  }


  openModalButton?.addEventListener(
    "click",
    openPartnerModal
  );


  closeModalButtons.forEach((button) => {

    button.addEventListener(
      "click",
      closePartnerModal
    );

  });


  document.addEventListener("keydown", (event) => {

    if (
      event.key === "Escape" &&
      partnerModal?.classList.contains("is-open")
    ) {
      closePartnerModal();
    }

  });


  /* ===================================================
     MESSAGE CHARACTER COUNTER
  =================================================== */

  function updateMessageCount() {

    if (!messageField || !messageCount) {
      return;
    }

    messageCount.textContent =
      `${messageField.value.length} / 800`;

  }


  messageField?.addEventListener(
    "input",
    updateMessageCount
  );


  /* ===================================================
     FRONTEND VALIDATION
  =================================================== */

  function showFieldError(field, message) {

    const formGroup = field.closest(
      ".partner-form-group"
    );

    const errorElement = formGroup?.querySelector(
      ".partner-form-error"
    );

    formGroup?.classList.add("has-error");

    if (errorElement) {
      errorElement.textContent = message;
    }

    field.setAttribute("aria-invalid", "true");

  }


  function clearFieldError(field) {

    const formGroup = field.closest(
      ".partner-form-group"
    );

    const errorElement = formGroup?.querySelector(
      ".partner-form-error"
    );

    formGroup?.classList.remove("has-error");

    if (errorElement) {
      errorElement.textContent = "";
    }

    field.removeAttribute("aria-invalid");

  }


  function validateEmail(email) {

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
      email
    );

  }


  function validatePartnerForm() {

    if (!partnerForm) {
      return false;
    }

    const organisationName =
      partnerForm.elements.organisationName;

    const contactName =
      partnerForm.elements.contactName;

    const email =
      partnerForm.elements.email;

    const partnershipType =
      partnerForm.elements.partnershipType;

    const message =
      partnerForm.elements.message;


    const requiredFields = [
      organisationName,
      contactName,
      email,
      partnershipType,
      message
    ];


    requiredFields.forEach((field) => {
      clearFieldError(field);
    });


    let isValid = true;


    if (organisationName.value.trim().length < 2) {

      showFieldError(
        organisationName,
        "Enter a valid organisation name."
      );

      isValid = false;

    }


    if (contactName.value.trim().length < 2) {

      showFieldError(
        contactName,
        "Enter the contact person's name."
      );

      isValid = false;

    }


    if (!validateEmail(email.value.trim())) {

      showFieldError(
        email,
        "Enter a valid official email address."
      );

      isValid = false;

    }


    if (!partnershipType.value) {

      showFieldError(
        partnershipType,
        "Select a partnership type."
      );

      isValid = false;

    }


    if (message.value.trim().length < 20) {

      showFieldError(
        message,
        "Please provide at least 20 characters."
      );

      isValid = false;

    }


    return isValid;

  }


  partnerForm?.querySelectorAll(
    "input, select, textarea"
  ).forEach((field) => {

    field.addEventListener("input", () => {
      clearFieldError(field);
    });

    field.addEventListener("change", () => {
      clearFieldError(field);
    });

  });


  /* ===================================================
     FRONTEND-ONLY FORM SUBMISSION
  =================================================== */

  partnerForm?.addEventListener(
    "submit",
    (event) => {

      event.preventDefault();

      if (formStatus) {
        formStatus.textContent = "";
      }


      const formIsValid =
        validatePartnerForm();

      if (!formIsValid) {

        const firstInvalidField =
          partnerForm.querySelector(
            '[aria-invalid="true"]'
          );

        firstInvalidField?.focus();

        return;

      }


      const formData =
        new FormData(partnerForm);

      const partnershipEnquiry =
        Object.fromEntries(formData.entries());


      console.log(
        "Frontend partnership enquiry:",
        partnershipEnquiry
      );


      /*
        Backend integration example:

        const apiEndpoint =
          partnerForm.dataset.apiEndpoint;

        try {

          const response = await fetch(apiEndpoint, {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify(
              partnershipEnquiry
            )
          });

          if (!response.ok) {
            throw new Error(
              "Unable to submit partnership enquiry."
            );
          }

          formStatus.textContent =
            "Your partnership enquiry has been submitted.";

          partnerForm.reset();
          updateMessageCount();

        } catch (error) {

          formStatus.textContent =
            "We could not submit your enquiry. Please try again.";

          console.error(
            "Partnership enquiry error:",
            error
          );

        }
      */


      /*
        Temporary frontend demonstration response.
      */

      if (formStatus) {

        formStatus.textContent =
          "Frontend validation successful. Backend submission will be connected by Mr. Harsh.";

      }

    }
  );


  /* ===================================================
     BACKEND PARTNER DATA PLACEHOLDER
  =================================================== */

  async function loadPartners() {

    const partnerLogoGrid =
      document.getElementById("partnerLogoGrid");

    if (!partnerLogoGrid) {
      return;
    }

    const apiEndpoint =
      partnerLogoGrid.dataset.apiEndpoint;

    if (!apiEndpoint) {
      return;
    }


    /*
      Backend integration example:

      try {

        const response = await fetch(apiEndpoint);

        if (!response.ok) {
          throw new Error(
            "Unable to load partners."
          );
        }

        const partners = await response.json();

        renderPartnerCards(partners);

      } catch (error) {

        console.error(
          "Partner loading error:",
          error
        );

      }
    */

  }


  /*
    Keep disabled until the API is available.

    loadPartners();
  */


  updateMessageCount();
  filterPartners("all");

});