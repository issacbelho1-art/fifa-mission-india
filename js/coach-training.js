/* =========================================================
   COACH TRAINING PAGE
   coach-training.js
   PART 1
   Sidebar, Dropdowns, Search, Filters,
   Grid/List View and Training Card Menus
========================================================= */

"use strict";


/* =========================================================
   DOM READY
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  initializeCoachSidebar();

  initializeTopbarDropdowns();

  initializeTrainingSearch();

  initializeTrainingFilters();

  initializeTrainingViewToggle();

  initializeTrainingCardMenus();

  initializeTrainingCardActions();

});


/* =========================================================
   SIDEBAR
========================================================= */

function initializeCoachSidebar() {

  const sidebar = document.querySelector(".coach-sidebar");

  const menuToggle = document.querySelector(
    ".coach-menu-toggle"
  );

  const sidebarOverlay = document.querySelector(
    ".coach-sidebar-overlay"
  );

  if (!sidebar || !menuToggle) {
    return;
  }

  function openSidebar() {

    sidebar.classList.add("active");

    menuToggle.setAttribute(
      "aria-expanded",
      "true"
    );

    document.body.classList.add(
      "coach-sidebar-open"
    );

    if (sidebarOverlay) {
      sidebarOverlay.classList.add("active");
    }

  }


  function closeSidebar() {

    sidebar.classList.remove("active");

    menuToggle.setAttribute(
      "aria-expanded",
      "false"
    );

    document.body.classList.remove(
      "coach-sidebar-open"
    );

    if (sidebarOverlay) {
      sidebarOverlay.classList.remove("active");
    }

  }


  menuToggle.addEventListener("click", () => {

    const isOpen = sidebar.classList.contains(
      "active"
    );

    if (isOpen) {
      closeSidebar();
    } else {
      openSidebar();
    }

  });


  if (sidebarOverlay) {

    sidebarOverlay.addEventListener(
      "click",
      closeSidebar
    );

  }


  document.addEventListener("keydown", event => {

    if (
      event.key === "Escape" &&
      sidebar.classList.contains("active")
    ) {
      closeSidebar();
    }

  });


  window.addEventListener("resize", () => {

    if (window.innerWidth > 991) {
      closeSidebar();
    }

  });

}


/* =========================================================
   TOPBAR DROPDOWNS
========================================================= */

function initializeTopbarDropdowns() {

  const dropdowns = document.querySelectorAll(
    ".coach-dropdown"
  );

  if (!dropdowns.length) {
    return;
  }


  dropdowns.forEach(dropdown => {

    const trigger = dropdown.querySelector(
      "[data-dropdown-trigger]"
    );

    const menu = dropdown.querySelector(
      ".coach-dropdown-menu"
    );

    if (!trigger || !menu) {
      return;
    }


    trigger.addEventListener("click", event => {

      event.stopPropagation();

      const isOpen = dropdown.classList.contains(
        "open"
      );

      closeAllTopbarDropdowns(dropdown);

      dropdown.classList.toggle(
        "open",
        !isOpen
      );

      trigger.setAttribute(
        "aria-expanded",
        String(!isOpen)
      );

    });


    menu.addEventListener("click", event => {
      event.stopPropagation();
    });

  });


  document.addEventListener("click", () => {
    closeAllTopbarDropdowns();
  });


  document.addEventListener("keydown", event => {

    if (event.key === "Escape") {
      closeAllTopbarDropdowns();
    }

  });

}


function closeAllTopbarDropdowns(exceptDropdown = null) {

  const dropdowns = document.querySelectorAll(
    ".coach-dropdown.open"
  );

  dropdowns.forEach(dropdown => {

    if (dropdown === exceptDropdown) {
      return;
    }

    dropdown.classList.remove("open");

    const trigger = dropdown.querySelector(
      "[data-dropdown-trigger]"
    );

    if (trigger) {

      trigger.setAttribute(
        "aria-expanded",
        "false"
      );

    }

  });

}


/* =========================================================
   TRAINING SEARCH
========================================================= */

function initializeTrainingSearch() {

  const searchInput = document.querySelector(
    "#trainingSearch"
  );

  if (!searchInput) {
    return;
  }


  searchInput.addEventListener(
    "input",
    debounce(() => {

      applyTrainingFilters();

    }, 180)
  );


  searchInput.addEventListener("keydown", event => {

    if (event.key === "Escape") {

      searchInput.value = "";

      applyTrainingFilters();

      searchInput.blur();

    }

  });

}


/* =========================================================
   TRAINING FILTERS
========================================================= */

function initializeTrainingFilters() {

  const filterControls = document.querySelectorAll(
    [
      "#trainingStatusFilter",
      "#trainingTypeFilter",
      "#trainingDateFilter"
    ].join(",")
  );

  filterControls.forEach(control => {

    control.addEventListener(
      "change",
      applyTrainingFilters
    );

  });


  const filterButtons = document.querySelectorAll(
    "[data-training-filter]"
  );

  filterButtons.forEach(button => {

    button.addEventListener("click", () => {

      const filterGroup =
        button.dataset.filterGroup;

      if (filterGroup) {

        document
          .querySelectorAll(
            `[data-filter-group="${filterGroup}"]`
          )
          .forEach(groupButton => {

            groupButton.classList.remove(
              "active"
            );

            groupButton.setAttribute(
              "aria-pressed",
              "false"
            );

          });

      }

      button.classList.add("active");

      button.setAttribute(
        "aria-pressed",
        "true"
      );

      applyTrainingFilters();

    });

  });


  const resetButton = document.querySelector(
    "#resetTrainingFilters"
  );

  if (resetButton) {

    resetButton.addEventListener("click", () => {

      resetTrainingFilters();

    });

  }

}


/* =========================================================
   APPLY TRAINING FILTERS
========================================================= */

function applyTrainingFilters() {

  const cards = document.querySelectorAll(
    ".training-session-card"
  );

  if (!cards.length) {
    return;
  }


  const searchTerm = getInputValue(
    "#trainingSearch"
  ).toLowerCase();


  const statusFilter = getInputValue(
    "#trainingStatusFilter"
  ).toLowerCase();


  const typeFilter = getInputValue(
    "#trainingTypeFilter"
  ).toLowerCase();


  const dateFilter = getInputValue(
    "#trainingDateFilter"
  ).toLowerCase();


  const activeQuickFilter = document.querySelector(
    "[data-training-filter].active"
  );


  const quickFilter = activeQuickFilter
    ? String(
        activeQuickFilter.dataset.trainingFilter || ""
      ).toLowerCase()
    : "";


  let visibleCount = 0;


  cards.forEach(card => {

    const title = String(
      card.dataset.title ||
      card.querySelector("h4")?.textContent ||
      ""
    ).toLowerCase();


    const description = String(
      card.dataset.description ||
      card.querySelector(
        ".training-session-body > p"
      )?.textContent ||
      ""
    ).toLowerCase();


    const status = String(
      card.dataset.status || ""
    ).toLowerCase();


    const type = String(
      card.dataset.type || ""
    ).toLowerCase();


    const date = String(
      card.dataset.date || ""
    ).toLowerCase();


    const searchableText = [
      title,
      description,
      status,
      type,
      date
    ].join(" ");


    const matchesSearch =
      !searchTerm ||
      searchableText.includes(searchTerm);


    const matchesStatus =
      !statusFilter ||
      statusFilter === "all" ||
      status === statusFilter;


    const matchesType =
      !typeFilter ||
      typeFilter === "all" ||
      type === typeFilter;


    const matchesDate =
      !dateFilter ||
      dateFilter === "all" ||
      matchesTrainingDateFilter(
        date,
        dateFilter
      );


    const matchesQuickFilter =
      !quickFilter ||
      quickFilter === "all" ||
      status === quickFilter ||
      type === quickFilter;


    const shouldDisplay =
      matchesSearch &&
      matchesStatus &&
      matchesType &&
      matchesDate &&
      matchesQuickFilter;


    card.hidden = !shouldDisplay;

    card.classList.toggle(
      "training-hidden",
      !shouldDisplay
    );


    if (shouldDisplay) {
      visibleCount += 1;
    }

  });


  updateTrainingResultCount(
    visibleCount,
    cards.length
  );


  toggleTrainingEmptyState(
    visibleCount === 0
  );

}


/* =========================================================
   DATE FILTER MATCHING
========================================================= */

function matchesTrainingDateFilter(
  sessionDateValue,
  filterValue
) {

  if (!sessionDateValue) {
    return false;
  }


  const sessionDate = new Date(
    sessionDateValue
  );

  if (
    Number.isNaN(
      sessionDate.getTime()
    )
  ) {
    return sessionDateValue === filterValue;
  }


  const today = new Date();

  today.setHours(0, 0, 0, 0);

  sessionDate.setHours(0, 0, 0, 0);


  const differenceInDays = Math.floor(
    (
      sessionDate.getTime() -
      today.getTime()
    ) /
    86400000
  );


  switch (filterValue) {

    case "today":
      return differenceInDays === 0;

    case "tomorrow":
      return differenceInDays === 1;

    case "week":
    case "this-week":
      return (
        differenceInDays >= 0 &&
        differenceInDays <= 7
      );

    case "month":
    case "this-month":
      return (
        sessionDate.getMonth() ===
          today.getMonth() &&
        sessionDate.getFullYear() ===
          today.getFullYear()
      );

    case "past":
      return differenceInDays < 0;

    case "upcoming":
      return differenceInDays >= 0;

    default:
      return true;

  }

}


/* =========================================================
   RESET FILTERS
========================================================= */

function resetTrainingFilters() {

  const searchInput = document.querySelector(
    "#trainingSearch"
  );

  const statusFilter = document.querySelector(
    "#trainingStatusFilter"
  );

  const typeFilter = document.querySelector(
    "#trainingTypeFilter"
  );

  const dateFilter = document.querySelector(
    "#trainingDateFilter"
  );


  if (searchInput) {
    searchInput.value = "";
  }

  if (statusFilter) {
    statusFilter.value = "all";
  }

  if (typeFilter) {
    typeFilter.value = "all";
  }

  if (dateFilter) {
    dateFilter.value = "all";
  }


  const filterButtons = document.querySelectorAll(
    "[data-training-filter]"
  );

  filterButtons.forEach(button => {

    const isDefault =
      button.dataset.trainingFilter === "all";

    button.classList.toggle(
      "active",
      isDefault
    );

    button.setAttribute(
      "aria-pressed",
      String(isDefault)
    );

  });


  applyTrainingFilters();

}


/* =========================================================
   RESULT COUNT
========================================================= */

function updateTrainingResultCount(
  visibleCount,
  totalCount
) {

  const resultElement = document.querySelector(
    "#trainingResultCount"
  );

  if (!resultElement) {
    return;
  }


  resultElement.textContent =
    visibleCount === totalCount
      ? `${totalCount} sessions`
      : `${visibleCount} of ${totalCount} sessions`;

}


/* =========================================================
   EMPTY STATE
========================================================= */

function toggleTrainingEmptyState(showEmptyState) {

  const grid = document.querySelector(
    "#trainingSessionsGrid"
  );

  if (!grid) {
    return;
  }


  let emptyState = grid.querySelector(
    ".training-empty-state"
  );


  if (showEmptyState && !emptyState) {

    emptyState = document.createElement("div");

    emptyState.className =
      "training-empty-state";

    emptyState.innerHTML = `
      <div class="training-empty-icon">
        <i class="fa-solid fa-calendar-xmark"></i>
      </div>

      <h4>No training sessions found</h4>

      <p>
        Try changing your search term or filters
        to view more training sessions.
      </p>

      <button
        type="button"
        class="training-session-action primary"
        id="clearEmptyTrainingFilters"
      >
        <i class="fa-solid fa-rotate-left"></i>
        Clear Filters
      </button>
    `;

    grid.appendChild(emptyState);


    const clearButton = emptyState.querySelector(
      "#clearEmptyTrainingFilters"
    );

    if (clearButton) {

      clearButton.addEventListener(
        "click",
        resetTrainingFilters
      );

    }

  }


  if (emptyState) {

    emptyState.hidden = !showEmptyState;

    emptyState.classList.toggle(
      "training-hidden",
      !showEmptyState
    );

  }

}


/* =========================================================
   GRID AND LIST VIEW
========================================================= */

function initializeTrainingViewToggle() {

  const viewButtons = document.querySelectorAll(
    "[data-training-view]"
  );

  const sessionsGrid = document.querySelector(
    "#trainingSessionsGrid"
  );

  if (!viewButtons.length || !sessionsGrid) {
    return;
  }


  const savedView = localStorage.getItem(
    "coachTrainingView"
  );


  if (
    savedView === "grid" ||
    savedView === "list"
  ) {

    setTrainingView(
      savedView,
      sessionsGrid,
      viewButtons
    );

  }


  viewButtons.forEach(button => {

    button.addEventListener("click", () => {

      const selectedView =
        button.dataset.trainingView;

      if (
        selectedView !== "grid" &&
        selectedView !== "list"
      ) {
        return;
      }


      setTrainingView(
        selectedView,
        sessionsGrid,
        viewButtons
      );


      localStorage.setItem(
        "coachTrainingView",
        selectedView
      );

    });

  });

}


function setTrainingView(
  view,
  sessionsGrid,
  viewButtons
) {

  sessionsGrid.classList.toggle(
    "list-view",
    view === "list"
  );


  sessionsGrid.dataset.currentView = view;


  viewButtons.forEach(button => {

    const isActive =
      button.dataset.trainingView === view;

    button.classList.toggle(
      "active",
      isActive
    );

    button.setAttribute(
      "aria-pressed",
      String(isActive)
    );

  });

}


/* =========================================================
   TRAINING CARD MENUS
========================================================= */

function initializeTrainingCardMenus() {

  const menuButtons = document.querySelectorAll(
    "[data-training-card-menu]"
  );

  menuButtons.forEach(button => {

    button.addEventListener("click", event => {

      event.stopPropagation();

      const menuWrapper = button.closest(
        ".training-card-menu"
      );

      if (!menuWrapper) {
        return;
      }


      const isOpen =
        menuWrapper.classList.contains("open");


      closeAllTrainingCardMenus(
        menuWrapper
      );


      menuWrapper.classList.toggle(
        "open",
        !isOpen
      );


      button.setAttribute(
        "aria-expanded",
        String(!isOpen)
      );

    });

  });


  document.addEventListener("click", () => {
    closeAllTrainingCardMenus();
  });


  document.addEventListener("keydown", event => {

    if (event.key === "Escape") {
      closeAllTrainingCardMenus();
    }

  });

}


function closeAllTrainingCardMenus(
  exceptMenu = null
) {

  const openMenus = document.querySelectorAll(
    ".training-card-menu.open"
  );

  openMenus.forEach(menu => {

    if (menu === exceptMenu) {
      return;
    }


    menu.classList.remove("open");


    const button = menu.querySelector(
      "[data-training-card-menu]"
    );

    if (button) {

      button.setAttribute(
        "aria-expanded",
        "false"
      );

    }

  });

}


/* =========================================================
   TRAINING CARD ACTIONS
========================================================= */

function initializeTrainingCardActions() {

  document.addEventListener("click", event => {

    const actionElement = event.target.closest(
      "[data-training-action]"
    );

    if (!actionElement) {
      return;
    }


    const action =
      actionElement.dataset.trainingAction;

    const card = actionElement.closest(
      ".training-session-card"
    );

    const sessionId =
      actionElement.dataset.sessionId ||
      card?.dataset.sessionId ||
      "";


    switch (action) {

      case "view":
        handleViewTrainingSession(
          sessionId,
          card
        );
        break;

      case "edit":
        handleEditTrainingSession(
          sessionId,
          card
        );
        break;

      case "duplicate":
        handleDuplicateTrainingSession(
          sessionId,
          card
        );
        break;

      case "attendance":
        handleTrainingAttendance(
          sessionId,
          card
        );
        break;

      case "cancel":
        handleCancelTrainingSession(
          sessionId,
          card
        );
        break;

      case "delete":
        handleDeleteTrainingSession(
          sessionId,
          card
        );
        break;

      default:
        break;

    }


    closeAllTrainingCardMenus();

  });

}


/* =========================================================
   FRONTEND ACTION PLACEHOLDERS
========================================================= */

function handleViewTrainingSession(
  sessionId,
  card
) {

  const detailsUrl =
    card?.dataset.detailsUrl ||
    (
      sessionId
        ? `coach-training-details.html?id=${encodeURIComponent(sessionId)}`
        : "coach-training-details.html"
    );


  window.location.href = detailsUrl;

}


function handleEditTrainingSession(
  sessionId,
  card
) {

  document.dispatchEvent(
    new CustomEvent(
      "coachTraining:edit",
      {
        detail: {
          sessionId,
          card
        }
      }
    )
  );

}


function handleDuplicateTrainingSession(
  sessionId,
  card
) {

  document.dispatchEvent(
    new CustomEvent(
      "coachTraining:duplicate",
      {
        detail: {
          sessionId,
          card
        }
      }
    )
  );

}


function handleTrainingAttendance(
  sessionId,
  card
) {

  document.dispatchEvent(
    new CustomEvent(
      "coachTraining:attendance",
      {
        detail: {
          sessionId,
          card
        }
      }
    )
  );

}


function handleCancelTrainingSession(
  sessionId,
  card
) {

  document.dispatchEvent(
    new CustomEvent(
      "coachTraining:cancel",
      {
        detail: {
          sessionId,
          card
        }
      }
    )
  );

}


function handleDeleteTrainingSession(
  sessionId,
  card
) {

  document.dispatchEvent(
    new CustomEvent(
      "coachTraining:delete",
      {
        detail: {
          sessionId,
          card
        }
      }
    )
  );

}


/* =========================================================
   HELPERS
========================================================= */

function getInputValue(selector) {

  const element = document.querySelector(
    selector
  );

  return element
    ? String(element.value || "").trim()
    : "";

}


function debounce(callback, delay = 200) {

  let timeoutId = null;


  return (...args) => {

    window.clearTimeout(timeoutId);

    timeoutId = window.setTimeout(
      () => callback(...args),
      delay
    );

  };

}

/* =========================================================
   COACH TRAINING PAGE
   coach-training.js
   PART 2
   Modal Controls, Session Form, Validation,
   Character Counter, Player Selection and Drills
========================================================= */

"use strict";


/* =========================================================
   DOM READY
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  initializeTrainingModals();

  initializeTrainingSessionForm();

  initializeTrainingCharacterCounters();

  initializeTrainingPlayerSelector();

  initializeTrainingDrills();

  initializeTrainingConfirmationActions();

});


/* =========================================================
   MODAL CONTROLS
========================================================= */

function initializeTrainingModals() {

  document.addEventListener("click", event => {

    const openButton = event.target.closest(
      "[data-open-training-modal]"
    );

    if (openButton) {

      const modalId =
        openButton.dataset.openTrainingModal;

      if (modalId) {

        openTrainingModal(
          modalId,
          openButton
        );

      }

      return;

    }


    const closeButton = event.target.closest(
      "[data-close-training-modal]"
    );

    if (closeButton) {

      const backdrop = closeButton.closest(
        ".training-modal-backdrop"
      );

      closeTrainingModal(backdrop);

    }

  });


  document.addEventListener("click", event => {

    const backdrop = event.target.closest(
      ".training-modal-backdrop"
    );

    if (
      backdrop &&
      event.target === backdrop
    ) {

      closeTrainingModal(backdrop);

    }

  });


  document.addEventListener("keydown", event => {

    if (event.key !== "Escape") {
      return;
    }


    const activeModal = document.querySelector(
      ".training-modal-backdrop.active"
    );

    if (activeModal) {

      closeTrainingModal(
        activeModal
      );

    }

  });

}


/* =========================================================
   OPEN MODAL
========================================================= */

function openTrainingModal(
  modalId,
  triggerElement = null
) {

  const backdrop = document.getElementById(
    modalId
  );

  if (!backdrop) {
    return;
  }


  closeAllTrainingModals(
    backdrop
  );


  backdrop.classList.add("active");

  backdrop.setAttribute(
    "aria-hidden",
    "false"
  );


  document.body.classList.add(
    "training-modal-open"
  );


  if (triggerElement) {

    backdrop._trainingTrigger =
      triggerElement;

  }


  const firstFocusable =
    getFocusableElements(backdrop)[0];


  window.setTimeout(() => {

    if (firstFocusable) {
      firstFocusable.focus();
    }

  }, 50);

}


/* =========================================================
   CLOSE MODAL
========================================================= */

function closeTrainingModal(
  backdrop
) {

  if (!backdrop) {
    return;
  }


  backdrop.classList.remove("active");

  backdrop.setAttribute(
    "aria-hidden",
    "true"
  );


  const hasOtherActiveModal =
    document.querySelector(
      ".training-modal-backdrop.active"
    );


  if (!hasOtherActiveModal) {

    document.body.classList.remove(
      "training-modal-open"
    );

  }


  const previousTrigger =
    backdrop._trainingTrigger;


  if (
    previousTrigger &&
    typeof previousTrigger.focus === "function"
  ) {

    window.setTimeout(() => {

      previousTrigger.focus();

    }, 50);

  }

}


/* =========================================================
   CLOSE ALL MODALS
========================================================= */

function closeAllTrainingModals(
  exceptBackdrop = null
) {

  const modals = document.querySelectorAll(
    ".training-modal-backdrop.active"
  );

  modals.forEach(backdrop => {

    if (backdrop !== exceptBackdrop) {

      backdrop.classList.remove("active");

      backdrop.setAttribute(
        "aria-hidden",
        "true"
      );

    }

  });

}


/* =========================================================
   SESSION FORM
========================================================= */

function initializeTrainingSessionForm() {

  const form = document.querySelector(
    "#trainingSessionForm"
  );

  if (!form) {
    return;
  }


  form.addEventListener("submit", event => {

    event.preventDefault();


    const isValid =
      validateTrainingForm(form);


    if (!isValid) {

      focusFirstInvalidField(form);

      showTrainingToast(
        "error",
        "Check required fields",
        "Please correct the highlighted training session details."
      );

      return;

    }


    const formData =
      collectTrainingFormData(form);


    document.dispatchEvent(
      new CustomEvent(
        "coachTraining:create",
        {
          detail: {
            formData,
            form
          }
        }
      )
    );


    showTrainingToast(
      "success",
      "Training session saved",
      "The session has been saved on the frontend."
    );


    const modal = form.closest(
      ".training-modal-backdrop"
    );


    closeTrainingModal(modal);

    resetTrainingForm(form);

  });


  form.addEventListener("input", event => {

    const field = event.target.closest(
      ".training-form-field"
    );

    if (!field) {
      return;
    }


    clearTrainingFieldState(field);

  });


  form.addEventListener("change", event => {

    const field = event.target.closest(
      ".training-form-field"
    );

    if (!field) {
      return;
    }


    clearTrainingFieldState(field);

  });


  const resetButtons = document.querySelectorAll(
    "[data-reset-training-form]"
  );

  resetButtons.forEach(button => {

    button.addEventListener("click", () => {

      resetTrainingForm(form);

    });

  });

}


/* =========================================================
   VALIDATE FORM
========================================================= */

function validateTrainingForm(form) {

  const requiredFields =
    form.querySelectorAll(
      "[required]"
    );


  let isValid = true;


  requiredFields.forEach(input => {

    const field = input.closest(
      ".training-form-field"
    );


    if (!field) {
      return;
    }


    const value = String(
      input.value || ""
    ).trim();


    let fieldValid = true;


    if (
      input.type === "radio" ||
      input.type === "checkbox"
    ) {

      if (input.type === "radio") {

        const radioGroup = form.querySelectorAll(
          `input[name="${CSS.escape(input.name)}"]`
        );

        fieldValid = Array.from(
          radioGroup
        ).some(radio => radio.checked);

      } else {

        fieldValid = input.checked;

      }

    } else {

      fieldValid = value !== "";

    }


    if (
      fieldValid &&
      input.type === "email"
    ) {

      fieldValid =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
          value
        );

    }


    if (
      fieldValid &&
      input.type === "number"
    ) {

      const numberValue =
        Number(input.value);


      if (
        input.min !== "" &&
        numberValue < Number(input.min)
      ) {

        fieldValid = false;

      }


      if (
        input.max !== "" &&
        numberValue > Number(input.max)
      ) {

        fieldValid = false;

      }

    }


    if (!fieldValid) {

      isValid = false;

      setTrainingFieldError(
        field,
        input.dataset.errorMessage ||
        "This field is required."
      );

    } else {

      setTrainingFieldSuccess(
        field
      );

    }

  });


  const startTime = form.querySelector(
    "#trainingStartTime"
  );

  const endTime = form.querySelector(
    "#trainingEndTime"
  );


  if (
    startTime &&
    endTime &&
    startTime.value &&
    endTime.value
  ) {

    const startMinutes =
      convertTimeToMinutes(
        startTime.value
      );

    const endMinutes =
      convertTimeToMinutes(
        endTime.value
      );


    if (endMinutes <= startMinutes) {

      isValid = false;

      const field = endTime.closest(
        ".training-form-field"
      );


      if (field) {

        setTrainingFieldError(
          field,
          "End time must be later than start time."
        );

      }

    }

  }


  return isValid;

}


/* =========================================================
   FIELD STATES
========================================================= */

function setTrainingFieldError(
  field,
  message
) {

  field.classList.add("has-error");

  field.classList.remove("has-success");


  const errorElement = field.querySelector(
    ".training-form-error"
  );


  if (errorElement) {

    errorElement.textContent =
      message;

  }


  const input = field.querySelector(
    "input, select, textarea"
  );


  if (input) {

    input.setAttribute(
      "aria-invalid",
      "true"
    );

  }

}


function setTrainingFieldSuccess(
  field
) {

  field.classList.remove("has-error");

  field.classList.add("has-success");


  const input = field.querySelector(
    "input, select, textarea"
  );


  if (input) {

    input.setAttribute(
      "aria-invalid",
      "false"
    );

  }

}


function clearTrainingFieldState(
  field
) {

  field.classList.remove(
    "has-error",
    "has-success"
  );


  const input = field.querySelector(
    "input, select, textarea"
  );


  if (input) {

    input.removeAttribute(
      "aria-invalid"
    );

  }

}


/* =========================================================
   FOCUS FIRST INVALID FIELD
========================================================= */

function focusFirstInvalidField(form) {

  const firstInvalidField =
    form.querySelector(
      ".training-form-field.has-error"
    );


  if (!firstInvalidField) {
    return;
  }


  const input =
    firstInvalidField.querySelector(
      "input, select, textarea, button"
    );


  if (input) {

    input.focus();

    firstInvalidField.scrollIntoView({
      behavior: "smooth",
      block: "center"
    });

  }

}


/* =========================================================
   COLLECT FORM DATA
========================================================= */

function collectTrainingFormData(form) {

  const formData =
    new FormData(form);


  const data = {};


  formData.forEach(
    (value, key) => {

      if (
        Object.prototype.hasOwnProperty.call(
          data,
          key
        )
      ) {

        if (!Array.isArray(data[key])) {

          data[key] = [
            data[key]
          ];

        }


        data[key].push(value);

      } else {

        data[key] = value;

      }

    }
  );


  data.selectedPlayers =
    getSelectedTrainingPlayers();


  data.drills =
    getTrainingDrillsData();


  return data;

}


/* =========================================================
   RESET FORM
========================================================= */

function resetTrainingForm(form) {

  form.reset();


  form
    .querySelectorAll(
      ".training-form-field"
    )
    .forEach(field => {

      clearTrainingFieldState(field);

    });


  document
    .querySelectorAll(
      ".training-character-count"
    )
    .forEach(counter => {

      const targetId =
        counter.dataset.characterTarget;

      const target =
        targetId
          ? document.getElementById(targetId)
          : null;


      if (target) {

        updateTrainingCharacterCount(
          target,
          counter
        );

      }

    });


  document
    .querySelectorAll(
      ".training-player-select-item input[type='checkbox']"
    )
    .forEach(checkbox => {

      checkbox.checked = false;

    });


  updateTrainingPlayerSelection();


  const drillsList = document.querySelector(
    "#trainingDrillsList"
  );


  if (drillsList) {

    drillsList.innerHTML = "";

  }


  updateTrainingDuration();

}


/* =========================================================
   CHARACTER COUNTERS
========================================================= */

function initializeTrainingCharacterCounters() {

  const counters = document.querySelectorAll(
    "[data-character-target]"
  );


  counters.forEach(counter => {

    const targetId =
      counter.dataset.characterTarget;

    const target =
      document.getElementById(
        targetId
      );


    if (!target) {
      return;
    }


    updateTrainingCharacterCount(
      target,
      counter
    );


    target.addEventListener("input", () => {

      updateTrainingCharacterCount(
        target,
        counter
      );

    });

  });

}


/* =========================================================
   UPDATE CHARACTER COUNT
========================================================= */

function updateTrainingCharacterCount(
  input,
  counter
) {

  const currentLength =
    input.value.length;


  const maximumLength =
    Number(
      input.maxLength > 0
        ? input.maxLength
        : counter.dataset.maxLength || 0
    );


  counter.textContent =
    maximumLength > 0
      ? `${currentLength}/${maximumLength}`
      : String(currentLength);


  counter.classList.remove(
    "limit-warning",
    "limit-reached"
  );


  if (
    maximumLength > 0 &&
    currentLength >= maximumLength
  ) {

    counter.classList.add(
      "limit-reached"
    );

  } else if (
    maximumLength > 0 &&
    currentLength >= maximumLength * 0.85
  ) {

    counter.classList.add(
      "limit-warning"
    );

  }

}


/* =========================================================
   TRAINING DURATION
========================================================= */

document.addEventListener("change", event => {

  if (
    event.target.matches(
      "#trainingStartTime, #trainingEndTime"
    )
  ) {

    updateTrainingDuration();

  }

});


function updateTrainingDuration() {

  const startInput = document.querySelector(
    "#trainingStartTime"
  );

  const endInput = document.querySelector(
    "#trainingEndTime"
  );

  const durationDisplay = document.querySelector(
    "#trainingDurationDisplay"
  );


  if (
    !startInput ||
    !endInput ||
    !durationDisplay
  ) {
    return;
  }


  if (
    !startInput.value ||
    !endInput.value
  ) {

    durationDisplay.textContent =
      "Select start and end time";

    return;

  }


  const startMinutes =
    convertTimeToMinutes(
      startInput.value
    );

  const endMinutes =
    convertTimeToMinutes(
      endInput.value
    );


  const totalMinutes =
    endMinutes - startMinutes;


  if (totalMinutes <= 0) {

    durationDisplay.textContent =
      "Invalid duration";

    return;

  }


  const hours =
    Math.floor(
      totalMinutes / 60
    );

  const minutes =
    totalMinutes % 60;


  const durationParts = [];


  if (hours > 0) {

    durationParts.push(
      `${hours} hr${hours > 1 ? "s" : ""}`
    );

  }


  if (minutes > 0) {

    durationParts.push(
      `${minutes} min`
    );

  }


  durationDisplay.textContent =
    durationParts.join(" ");

}


/* =========================================================
   PLAYER SELECTOR
========================================================= */

function initializeTrainingPlayerSelector() {

  const playerList = document.querySelector(
    "#trainingPlayerSelectionList"
  );

  if (!playerList) {
    return;
  }


  const checkboxes =
    playerList.querySelectorAll(
      "input[type='checkbox']"
    );


  checkboxes.forEach(checkbox => {

    checkbox.addEventListener(
      "change",
      updateTrainingPlayerSelection
    );

  });


  const searchInput = document.querySelector(
    "#trainingPlayerSearch"
  );


  if (searchInput) {

    searchInput.addEventListener(
      "input",
      debounce(() => {

        filterTrainingPlayerSelection(
          searchInput.value
        );

      }, 150)
    );

  }


  const selectAllButton =
    document.querySelector(
      "#trainingSelectAllPlayers"
    );


  if (selectAllButton) {

    selectAllButton.addEventListener(
      "click",
      toggleAllTrainingPlayers
    );

  }


  document.addEventListener("click", event => {

    const removeButton =
      event.target.closest(
        "[data-remove-selected-player]"
      );


    if (!removeButton) {
      return;
    }


    const playerId =
      removeButton.dataset.removeSelectedPlayer;


    const checkbox =
      document.querySelector(
        `.training-player-select-item input[value="${CSS.escape(playerId)}"]`
      );


    if (checkbox) {

      checkbox.checked = false;

      updateTrainingPlayerSelection();

    }

  });


  updateTrainingPlayerSelection();

}


/* =========================================================
   FILTER PLAYER SELECTION
========================================================= */

function filterTrainingPlayerSelection(
  searchValue
) {

  const searchTerm =
    String(searchValue || "")
      .trim()
      .toLowerCase();


  const playerItems =
    document.querySelectorAll(
      ".training-player-select-item"
    );


  playerItems.forEach(item => {

    const playerText =
      item.textContent
        .trim()
        .toLowerCase();


    const position =
      String(
        item.dataset.position || ""
      ).toLowerCase();


    const matches =
      !searchTerm ||
      playerText.includes(searchTerm) ||
      position.includes(searchTerm);


    item.hidden = !matches;

  });

}


/* =========================================================
   TOGGLE ALL PLAYERS
========================================================= */

function toggleAllTrainingPlayers() {

  const visibleCheckboxes =
    Array.from(
      document.querySelectorAll(
        ".training-player-select-item:not([hidden]) input[type='checkbox']"
      )
    );


  if (!visibleCheckboxes.length) {
    return;
  }


  const allSelected =
    visibleCheckboxes.every(
      checkbox => checkbox.checked
    );


  visibleCheckboxes.forEach(checkbox => {

    checkbox.checked = !allSelected;

  });


  updateTrainingPlayerSelection();

}


/* =========================================================
   UPDATE SELECTED PLAYERS
========================================================= */

function updateTrainingPlayerSelection() {

  const selectedPlayers =
    getSelectedTrainingPlayers();


  const selectedContainer =
    document.querySelector(
      "#trainingSelectedPlayers"
    );


  const selectedCount =
    document.querySelector(
      "#trainingSelectedPlayerCount"
    );


  if (selectedCount) {

    selectedCount.textContent =
      String(selectedPlayers.length);

  }


  if (!selectedContainer) {
    return;
  }


  selectedContainer.innerHTML = "";


  selectedPlayers.forEach(player => {

    const chip =
      document.createElement("div");


    chip.className =
      "training-selected-player";


    chip.innerHTML = `
      <span class="training-selected-player-avatar">
        ${
          player.image
            ? `<img src="${escapeTrainingHTML(player.image)}" alt="">`
            : escapeTrainingHTML(player.initials)
        }
      </span>

      <span>
        ${escapeTrainingHTML(player.name)}
      </span>

      <button
        type="button"
        class="training-selected-player-remove"
        data-remove-selected-player="${escapeTrainingHTML(player.id)}"
        aria-label="Remove ${escapeTrainingHTML(player.name)}"
      >
        <i class="fa-solid fa-xmark"></i>
      </button>
    `;


    selectedContainer.appendChild(chip);

  });

}


/* =========================================================
   GET SELECTED PLAYERS
========================================================= */

function getSelectedTrainingPlayers() {

  const checkedInputs =
    document.querySelectorAll(
      ".training-player-select-item input[type='checkbox']:checked"
    );


  return Array.from(
    checkedInputs
  ).map(input => {

    const item = input.closest(
      ".training-player-select-item"
    );


    const name =
      item?.querySelector(
        ".training-player-select-info strong"
      )?.textContent?.trim() ||
      input.dataset.playerName ||
      "Player";


    const image =
      item?.querySelector(
        ".training-player-select-avatar img"
      )?.getAttribute("src") ||
      "";


    const initials =
      item?.querySelector(
        ".training-player-select-avatar"
      )?.textContent?.trim() ||
      getTrainingInitials(name);


    return {
      id: input.value,
      name,
      position:
        item?.dataset.position || "",
      image,
      initials
    };

  });

}


/* =========================================================
   TRAINING DRILLS
========================================================= */

function initializeTrainingDrills() {

  const addDrillButton = document.querySelector(
    "#addTrainingDrill"
  );


  if (addDrillButton) {

    addDrillButton.addEventListener(
      "click",
      addTrainingDrill
    );

  }


  document.addEventListener("click", event => {

    const removeButton = event.target.closest(
      "[data-remove-training-drill]"
    );


    if (removeButton) {

      const drillItem = removeButton.closest(
        ".training-drill-item"
      );


      if (drillItem) {

        drillItem.remove();

      }

      return;

    }


    const editButton = event.target.closest(
      "[data-edit-training-drill]"
    );


    if (editButton) {

      const drillItem = editButton.closest(
        ".training-drill-item"
      );


      editTrainingDrill(
        drillItem
      );

    }

  });

}


/* =========================================================
   ADD DRILL
========================================================= */

function addTrainingDrill() {

  const drillNameInput =
    document.querySelector(
      "#trainingDrillName"
    );

  const drillDurationInput =
    document.querySelector(
      "#trainingDrillDuration"
    );

  const drillsList =
    document.querySelector(
      "#trainingDrillsList"
    );


  if (
    !drillNameInput ||
    !drillsList
  ) {
    return;
  }


  const drillName =
    drillNameInput.value.trim();


  const drillDuration =
    drillDurationInput
      ? drillDurationInput.value.trim()
      : "";


  if (!drillName) {

    drillNameInput.focus();

    showTrainingToast(
      "warning",
      "Add a drill name",
      "Enter the exercise or drill before adding it."
    );

    return;

  }


  const drillId =
    `drill-${Date.now()}`;


  const drillItem =
    document.createElement("div");


  drillItem.className =
    "training-drill-item";


  drillItem.dataset.drillId =
    drillId;


  drillItem.innerHTML = `
    <span
      class="training-drill-handle"
      aria-hidden="true"
    >
      <i class="fa-solid fa-grip-vertical"></i>
    </span>

    <div class="training-drill-content">
      <strong>
        ${escapeTrainingHTML(drillName)}
      </strong>

      <span>
        ${
          drillDuration
            ? `${escapeTrainingHTML(drillDuration)} minutes`
            : "Duration not specified"
        }
      </span>
    </div>

    <div class="training-drill-actions">

      <button
        type="button"
        class="training-drill-action"
        data-edit-training-drill
        aria-label="Edit drill"
      >
        <i class="fa-solid fa-pen"></i>
      </button>

      <button
        type="button"
        class="training-drill-action remove"
        data-remove-training-drill
        aria-label="Remove drill"
      >
        <i class="fa-solid fa-trash"></i>
      </button>

    </div>
  `;


  drillsList.appendChild(
    drillItem
  );


  drillNameInput.value = "";


  if (drillDurationInput) {

    drillDurationInput.value = "";

  }


  drillNameInput.focus();

}


/* =========================================================
   EDIT DRILL
========================================================= */

function editTrainingDrill(
  drillItem
) {

  if (!drillItem) {
    return;
  }


  const nameElement =
    drillItem.querySelector(
      ".training-drill-content strong"
    );


  const durationElement =
    drillItem.querySelector(
      ".training-drill-content span"
    );


  if (!nameElement) {
    return;
  }


  const updatedName =
    window.prompt(
      "Edit drill name:",
      nameElement.textContent.trim()
    );


  if (
    updatedName === null ||
    !updatedName.trim()
  ) {
    return;
  }


  nameElement.textContent =
    updatedName.trim();


  const currentDuration =
    durationElement
      ? durationElement.textContent.replace(
          /\D+/g,
          ""
        )
      : "";


  const updatedDuration =
    window.prompt(
      "Edit duration in minutes:",
      currentDuration
    );


  if (
    durationElement &&
    updatedDuration !== null
  ) {

    const cleanDuration =
      updatedDuration.trim();


    durationElement.textContent =
      cleanDuration
        ? `${cleanDuration} minutes`
        : "Duration not specified";

  }

}


/* =========================================================
   GET DRILLS DATA
========================================================= */

function getTrainingDrillsData() {

  const drillItems =
    document.querySelectorAll(
      ".training-drill-item"
    );


  return Array.from(
    drillItems
  ).map(item => {

    const name =
      item.querySelector(
        ".training-drill-content strong"
      )?.textContent?.trim() || "";


    const durationText =
      item.querySelector(
        ".training-drill-content span"
      )?.textContent || "";


    const durationMatch =
      durationText.match(/\d+/);


    return {
      id: item.dataset.drillId || "",
      name,
      durationMinutes:
        durationMatch
          ? Number(durationMatch[0])
          : null
    };

  });

}


/* =========================================================
   CONFIRMATION ACTIONS
========================================================= */

function initializeTrainingConfirmationActions() {

  document.addEventListener(
    "coachTraining:delete",
    event => {

      prepareTrainingConfirmation({
        action: "delete",
        sessionId:
          event.detail?.sessionId || "",
        title: "Delete training session?",
        message:
          "This removes the session from the frontend training list.",
        confirmText: "Delete Session",
        type: "danger"
      });

    }
  );


  document.addEventListener(
    "coachTraining:cancel",
    event => {

      prepareTrainingConfirmation({
        action: "cancel",
        sessionId:
          event.detail?.sessionId || "",
        title: "Cancel training session?",
        message:
          "Players will see this session as cancelled once connected to the backend.",
        confirmText: "Cancel Session",
        type: "warning"
      });

    }
  );


  const confirmButton =
    document.querySelector(
      "#confirmTrainingAction"
    );


  if (confirmButton) {

    confirmButton.addEventListener(
      "click",
      executeTrainingConfirmation
    );

  }

}


/* =========================================================
   PREPARE CONFIRMATION
========================================================= */

function prepareTrainingConfirmation(
  options
) {

  const modalId =
    "trainingConfirmationModal";


  const backdrop =
    document.getElementById(
      modalId
    );


  if (!backdrop) {
    return;
  }


  const title =
    backdrop.querySelector(
      "#trainingConfirmationTitle"
    );


  const message =
    backdrop.querySelector(
      "#trainingConfirmationMessage"
    );


  const confirmButton =
    backdrop.querySelector(
      "#confirmTrainingAction"
    );


  const icon =
    backdrop.querySelector(
      ".training-confirmation-icon"
    );


  if (title) {

    title.textContent =
      options.title || "Confirm action";

  }


  if (message) {

    message.textContent =
      options.message || "";

  }


  if (confirmButton) {

    confirmButton.textContent =
      options.confirmText || "Confirm";

    confirmButton.dataset.action =
      options.action || "";

    confirmButton.dataset.sessionId =
      options.sessionId || "";

  }


  if (icon) {

    icon.classList.remove(
      "warning",
      "success"
    );


    if (options.type === "warning") {

      icon.classList.add("warning");

    }

  }


  openTrainingModal(
    modalId
  );

}


/* =========================================================
   EXECUTE CONFIRMATION
========================================================= */

function executeTrainingConfirmation(
  event
) {

  const button =
    event.currentTarget;


  const action =
    button.dataset.action;


  const sessionId =
    button.dataset.sessionId;


  if (action === "delete") {

    removeTrainingSessionCard(
      sessionId
    );


    showTrainingToast(
      "success",
      "Session deleted",
      "The training session was removed from the frontend."
    );

  }


  if (action === "cancel") {

    markTrainingSessionCancelled(
      sessionId
    );


    showTrainingToast(
      "warning",
      "Session cancelled",
      "The session status has been changed to cancelled."
    );

  }


  closeTrainingModal(
    button.closest(
      ".training-modal-backdrop"
    )
  );

}


/* =========================================================
   CARD UPDATES
========================================================= */

function removeTrainingSessionCard(
  sessionId
) {

  if (!sessionId) {
    return;
  }


  const card =
    document.querySelector(
      `.training-session-card[data-session-id="${CSS.escape(sessionId)}"]`
    );


  if (card) {

    card.remove();

    applyTrainingFilters();

  }

}


function markTrainingSessionCancelled(
  sessionId
) {

  if (!sessionId) {
    return;
  }


  const card =
    document.querySelector(
      `.training-session-card[data-session-id="${CSS.escape(sessionId)}"]`
    );


  if (!card) {
    return;
  }


  card.dataset.status =
    "cancelled";


  const badge =
    card.querySelector(
      ".training-session-status"
    );


  if (badge) {

    badge.className =
      "training-session-status cancelled";

    badge.textContent =
      "Cancelled";

  }


  applyTrainingFilters();

}


/* =========================================================
   TOAST NOTIFICATIONS
========================================================= */

function showTrainingToast(
  type,
  title,
  message
) {

  let container =
    document.querySelector(
      ".training-toast-container"
    );


  if (!container) {

    container =
      document.createElement("div");


    container.className =
      "training-toast-container";


    container.setAttribute(
      "aria-live",
      "polite"
    );


    document.body.appendChild(
      container
    );

  }


  const toast =
    document.createElement("div");


  toast.className =
    `training-toast ${type || ""}`;


  const iconClass =
    getTrainingToastIcon(type);


  toast.innerHTML = `
    <div class="training-toast-icon">
      <i class="${iconClass}"></i>
    </div>

    <div class="training-toast-content">
      <strong>
        ${escapeTrainingHTML(title)}
      </strong>

      <p>
        ${escapeTrainingHTML(message)}
      </p>
    </div>

    <button
      type="button"
      class="training-toast-close"
      aria-label="Close notification"
    >
      <i class="fa-solid fa-xmark"></i>
    </button>
  `;


  container.appendChild(
    toast
  );


  requestAnimationFrame(() => {

    toast.classList.add("show");

  });


  const closeButton =
    toast.querySelector(
      ".training-toast-close"
    );


  if (closeButton) {

    closeButton.addEventListener(
      "click",
      () => removeTrainingToast(toast)
    );

  }


  window.setTimeout(() => {

    removeTrainingToast(
      toast
    );

  }, 4500);

}


/* =========================================================
   REMOVE TOAST
========================================================= */

function removeTrainingToast(
  toast
) {

  if (
    !toast ||
    !toast.isConnected
  ) {
    return;
  }


  toast.classList.remove("show");


  window.setTimeout(() => {

    toast.remove();

  }, 250);

}


/* =========================================================
   HELPERS
========================================================= */

function convertTimeToMinutes(
  timeValue
) {

  const [
    hours,
    minutes
  ] = String(timeValue)
    .split(":")
    .map(Number);


  return (
    hours * 60 +
    minutes
  );

}


function getFocusableElements(
  container
) {

  return Array.from(
    container.querySelectorAll(
      [
        "button:not([disabled])",
        "a[href]",
        "input:not([disabled])",
        "select:not([disabled])",
        "textarea:not([disabled])",
        "[tabindex]:not([tabindex='-1'])"
      ].join(",")
    )
  ).filter(element => {

    return (
      !element.hidden &&
      element.offsetParent !== null
    );

  });

}


function getTrainingInitials(
  name
) {

  return String(name || "")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map(word => word.charAt(0))
    .join("")
    .toUpperCase() || "P";

}


function getTrainingToastIcon(
  type
) {

  switch (type) {

    case "success":
      return "fa-solid fa-circle-check";

    case "warning":
      return "fa-solid fa-triangle-exclamation";

    case "error":
      return "fa-solid fa-circle-xmark";

    default:
      return "fa-solid fa-circle-info";

  }

}


function escapeTrainingHTML(
  value
) {

  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

}

/* =========================================================
   COACH TRAINING PAGE
   coach-training.js
   PART 3
   Calendar Navigation, Session Details Drawer,
   Attendance Management, Analytics Controls,
   Quick Actions and Final Page Interactions
========================================================= */

"use strict";


/* =========================================================
   DOM READY
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  initializeTrainingCalendar();

  initializeTrainingDrawer();

  initializeTrainingAttendance();

  initializeTrainingAnalytics();

  initializeTrainingQuickActions();

  initializeTrainingResources();

  initializeTrainingNotes();

  initializeTrainingPagination();

});


/* =========================================================
   TRAINING CALENDAR
========================================================= */

function initializeTrainingCalendar() {

  const calendar = document.querySelector(
    "#trainingWeekCalendar"
  );

  if (!calendar) {
    return;
  }


  const previousButton = document.querySelector(
    "#trainingPreviousWeek"
  );

  const nextButton = document.querySelector(
    "#trainingNextWeek"
  );

  const todayButton = document.querySelector(
    "#trainingCalendarToday"
  );


  let currentWeekStart =
    getTrainingWeekStart(
      new Date()
    );


  const storedDate =
    calendar.dataset.weekStart;


  if (storedDate) {

    const parsedDate =
      new Date(storedDate);


    if (
      !Number.isNaN(
        parsedDate.getTime()
      )
    ) {

      currentWeekStart =
        getTrainingWeekStart(
          parsedDate
        );

    }

  }


  renderTrainingCalendarWeek(
    currentWeekStart
  );


  if (previousButton) {

    previousButton.addEventListener(
      "click",
      () => {

        currentWeekStart =
          addTrainingDays(
            currentWeekStart,
            -7
          );


        renderTrainingCalendarWeek(
          currentWeekStart
        );

      }
    );

  }


  if (nextButton) {

    nextButton.addEventListener(
      "click",
      () => {

        currentWeekStart =
          addTrainingDays(
            currentWeekStart,
            7
          );


        renderTrainingCalendarWeek(
          currentWeekStart
        );

      }
    );

  }


  if (todayButton) {

    todayButton.addEventListener(
      "click",
      () => {

        currentWeekStart =
          getTrainingWeekStart(
            new Date()
          );


        renderTrainingCalendarWeek(
          currentWeekStart
        );

      }
    );

  }


  document.addEventListener(
    "click",
    event => {

      const calendarEvent =
        event.target.closest(
          ".training-calendar-event"
        );


      if (!calendarEvent) {
        return;
      }


      event.preventDefault();


      const sessionId =
        calendarEvent.dataset.sessionId || "";


      openTrainingSessionDrawer(
        sessionId,
        calendarEvent
      );

    }
  );

}


/* =========================================================
   RENDER CALENDAR WEEK
========================================================= */

function renderTrainingCalendarWeek(
  weekStart
) {

  const calendar = document.querySelector(
    "#trainingWeekCalendar"
  );

  if (!calendar) {
    return;
  }


  calendar.dataset.weekStart =
    formatTrainingDateValue(
      weekStart
    );


  updateTrainingCalendarHeading(
    weekStart
  );


  updateTrainingCalendarDays(
    weekStart
  );


  highlightTrainingCalendarToday();

  updateTrainingCurrentTimeLine();

}


/* =========================================================
   CALENDAR HEADING
========================================================= */

function updateTrainingCalendarHeading(
  weekStart
) {

  const heading = document.querySelector(
    "#trainingCalendarCurrent"
  );

  if (!heading) {
    return;
  }


  const weekEnd =
    addTrainingDays(
      weekStart,
      6
    );


  const sameMonth =
    weekStart.getMonth() ===
    weekEnd.getMonth();


  const sameYear =
    weekStart.getFullYear() ===
    weekEnd.getFullYear();


  const startOptions = {
    month: "short",
    day: "numeric"
  };


  const endOptions = {
    month: sameMonth
      ? undefined
      : "short",
    day: "numeric",
    year: sameYear
      ? undefined
      : "numeric"
  };


  const startText =
    weekStart.toLocaleDateString(
      "en-IN",
      startOptions
    );


  const endText =
    weekEnd.toLocaleDateString(
      "en-IN",
      endOptions
    );


  const yearText =
    sameYear
      ? ` ${weekEnd.getFullYear()}`
      : "";


  heading.textContent =
    `${startText} – ${endText}${yearText}`;

}


/* =========================================================
   CALENDAR DAY HEADINGS
========================================================= */

function updateTrainingCalendarDays(
  weekStart
) {

  const dayElements =
    document.querySelectorAll(
      "[data-calendar-day-index]"
    );


  dayElements.forEach(dayElement => {

    const dayIndex =
      Number(
        dayElement.dataset.calendarDayIndex
      );


    const date =
      addTrainingDays(
        weekStart,
        dayIndex
      );


    const dayName =
      dayElement.querySelector("span");


    const dayNumber =
      dayElement.querySelector("strong");


    if (dayName) {

      dayName.textContent =
        date.toLocaleDateString(
          "en-IN",
          {
            weekday: "short"
          }
        );

    }


    if (dayNumber) {

      dayNumber.textContent =
        String(date.getDate());

    }


    dayElement.dataset.date =
      formatTrainingDateValue(date);

  });


  updateTrainingCalendarCells(
    weekStart
  );

}


/* =========================================================
   CALENDAR CELLS
========================================================= */

function updateTrainingCalendarCells(
  weekStart
) {

  const cells =
    document.querySelectorAll(
      "[data-calendar-cell-day]"
    );


  cells.forEach(cell => {

    const dayIndex =
      Number(
        cell.dataset.calendarCellDay
      );


    const date =
      addTrainingDays(
        weekStart,
        dayIndex
      );


    cell.dataset.date =
      formatTrainingDateValue(date);

  });

}


/* =========================================================
   TODAY HIGHLIGHT
========================================================= */

function highlightTrainingCalendarToday() {

  const todayValue =
    formatTrainingDateValue(
      new Date()
    );


  document
    .querySelectorAll(
      ".training-week-day"
    )
    .forEach(day => {

      day.classList.toggle(
        "today",
        day.dataset.date === todayValue
      );

    });


  document
    .querySelectorAll(
      ".training-calendar-cell"
    )
    .forEach(cell => {

      cell.classList.toggle(
        "today",
        cell.dataset.date === todayValue
      );

    });

}


/* =========================================================
   CURRENT TIME LINE
========================================================= */

function updateTrainingCurrentTimeLine() {

  const timeLine = document.querySelector(
    "#trainingCurrentTimeLine"
  );

  if (!timeLine) {
    return;
  }


  const todayValue =
    formatTrainingDateValue(
      new Date()
    );


  const visibleToday =
    document.querySelector(
      `.training-calendar-cell[data-date="${todayValue}"]`
    );


  if (!visibleToday) {

    timeLine.hidden = true;

    return;

  }


  const calendarStartHour =
    Number(
      timeLine.dataset.startHour || 6
    );


  const calendarEndHour =
    Number(
      timeLine.dataset.endHour || 20
    );


  const rowHeight =
    Number(
      timeLine.dataset.rowHeight || 82
    );


  const now = new Date();


  const currentMinutes =
    now.getHours() * 60 +
    now.getMinutes();


  const startMinutes =
    calendarStartHour * 60;


  const endMinutes =
    calendarEndHour * 60;


  if (
    currentMinutes < startMinutes ||
    currentMinutes > endMinutes
  ) {

    timeLine.hidden = true;

    return;

  }


  const minutesFromStart =
    currentMinutes -
    startMinutes;


  const pixelsPerMinute =
    rowHeight / 60;


  timeLine.style.top =
    `${minutesFromStart * pixelsPerMinute}px`;


  timeLine.hidden = false;


  const label =
    timeLine.querySelector(
      ".training-current-time-label"
    );


  if (label) {

    label.textContent =
      now.toLocaleTimeString(
        "en-IN",
        {
          hour: "2-digit",
          minute: "2-digit"
        }
      );

  }

}


/* =========================================================
   TRAINING DRAWER
========================================================= */

function initializeTrainingDrawer() {

  document.addEventListener(
    "click",
    event => {

      const openButton =
        event.target.closest(
          "[data-open-training-drawer]"
        );


      if (openButton) {

        const drawerId =
          openButton.dataset.openTrainingDrawer;


        openTrainingDrawer(
          drawerId,
          openButton
        );

        return;

      }


      const closeButton =
        event.target.closest(
          "[data-close-training-drawer]"
        );


      if (closeButton) {

        closeTrainingDrawer();

      }

    }
  );


  const overlay =
    document.querySelector(
      ".training-drawer-overlay"
    );


  if (overlay) {

    overlay.addEventListener(
      "click",
      closeTrainingDrawer
    );

  }


  document.addEventListener(
    "keydown",
    event => {

      if (event.key === "Escape") {

        closeTrainingDrawer();

      }

    }
  );

}


/* =========================================================
   OPEN DRAWER
========================================================= */

function openTrainingDrawer(
  drawerId,
  triggerElement = null
) {

  const drawer =
    drawerId
      ? document.getElementById(drawerId)
      : document.querySelector(
          ".training-drawer"
        );


  const overlay =
    document.querySelector(
      ".training-drawer-overlay"
    );


  if (!drawer) {
    return;
  }


  drawer.classList.add("active");

  drawer.setAttribute(
    "aria-hidden",
    "false"
  );


  if (overlay) {

    overlay.classList.add("active");

  }


  document.body.classList.add(
    "training-modal-open"
  );


  drawer._trainingTrigger =
    triggerElement;


  const firstFocusable =
    getFocusableElements(drawer)[0];


  window.setTimeout(() => {

    if (firstFocusable) {

      firstFocusable.focus();

    }

  }, 70);

}


/* =========================================================
   CLOSE DRAWER
========================================================= */

function closeTrainingDrawer() {

  const drawer =
    document.querySelector(
      ".training-drawer.active"
    );


  const overlay =
    document.querySelector(
      ".training-drawer-overlay.active"
    );


  if (!drawer) {
    return;
  }


  drawer.classList.remove("active");

  drawer.setAttribute(
    "aria-hidden",
    "true"
  );


  if (overlay) {

    overlay.classList.remove("active");

  }


  document.body.classList.remove(
    "training-modal-open"
  );


  const trigger =
    drawer._trainingTrigger;


  if (
    trigger &&
    typeof trigger.focus === "function"
  ) {

    window.setTimeout(() => {

      trigger.focus();

    }, 70);

  }

}


/* =========================================================
   SESSION DETAILS DRAWER
========================================================= */

function openTrainingSessionDrawer(
  sessionId,
  triggerElement = null
) {

  const drawer =
    document.querySelector(
      "#trainingSessionDrawer"
    );


  if (!drawer) {

    handleViewTrainingSession(
      sessionId,
      null
    );

    return;

  }


  populateTrainingSessionDrawer(
    sessionId,
    drawer
  );


  openTrainingDrawer(
    "trainingSessionDrawer",
    triggerElement
  );

}


/* =========================================================
   POPULATE SESSION DRAWER
========================================================= */

function populateTrainingSessionDrawer(
  sessionId,
  drawer
) {

  const source =
    document.querySelector(
      `.training-session-card[data-session-id="${CSS.escape(sessionId)}"]`
    );


  const title =
    source?.dataset.title ||
    source?.querySelector(
      ".training-session-body h4"
    )?.textContent?.trim() ||
    "Training Session";


  const description =
    source?.dataset.description ||
    source?.querySelector(
      ".training-session-body > p"
    )?.textContent?.trim() ||
    "Training session information will appear here.";


  const status =
    source?.dataset.status ||
    "upcoming";


  const type =
    source?.dataset.type ||
    "training";


  const date =
    source?.dataset.date ||
    "";


  const titleElement =
    drawer.querySelector(
      "[data-drawer-session-title]"
    );


  const descriptionElement =
    drawer.querySelector(
      "[data-drawer-session-description]"
    );


  const statusElement =
    drawer.querySelector(
      "[data-drawer-session-status]"
    );


  const typeElement =
    drawer.querySelector(
      "[data-drawer-session-type]"
    );


  const dateElement =
    drawer.querySelector(
      "[data-drawer-session-date]"
    );


  if (titleElement) {

    titleElement.textContent =
      title;

  }


  if (descriptionElement) {

    descriptionElement.textContent =
      description;

  }


  if (statusElement) {

    statusElement.textContent =
      capitalizeTrainingText(status);

    statusElement.className =
      `training-session-status ${status}`;

  }


  if (typeElement) {

    typeElement.textContent =
      capitalizeTrainingText(type);

  }


  if (dateElement) {

    dateElement.textContent =
      formatTrainingDisplayDate(date);

  }


  drawer.dataset.sessionId =
    sessionId || "";

}


/* =========================================================
   ATTENDANCE MANAGEMENT
========================================================= */

function initializeTrainingAttendance() {

  document.addEventListener(
    "coachTraining:attendance",
    event => {

      const sessionId =
        event.detail?.sessionId || "";


      prepareTrainingAttendance(
        sessionId
      );

    }
  );


  const saveButton =
    document.querySelector(
      "#saveTrainingAttendance"
    );


  if (saveButton) {

    saveButton.addEventListener(
      "click",
      saveTrainingAttendance
    );

  }


  const markAllPresent =
    document.querySelector(
      "#markAllTrainingPresent"
    );


  if (markAllPresent) {

    markAllPresent.addEventListener(
      "click",
      () => {

        setAllTrainingAttendance(
          "present"
        );

      }
    );

  }


  const clearAttendance =
    document.querySelector(
      "#clearTrainingAttendance"
    );


  if (clearAttendance) {

    clearAttendance.addEventListener(
      "click",
      clearAllTrainingAttendance
    );

  }


  document.addEventListener(
    "change",
    event => {

      if (
        event.target.matches(
          ".training-attendance-status-option input"
        )
      ) {

        updateTrainingAttendanceSummary();

      }

    }
  );

}


/* =========================================================
   PREPARE ATTENDANCE
========================================================= */

function prepareTrainingAttendance(
  sessionId
) {

  const modal =
    document.querySelector(
      "#trainingAttendanceModal"
    );


  if (!modal) {
    return;
  }


  modal.dataset.sessionId =
    sessionId;


  const title =
    modal.querySelector(
      "#trainingAttendanceSessionTitle"
    );


  const card =
    document.querySelector(
      `.training-session-card[data-session-id="${CSS.escape(sessionId)}"]`
    );


  if (title) {

    title.textContent =
      card?.dataset.title ||
      card?.querySelector(
        ".training-session-body h4"
      )?.textContent?.trim() ||
      "Training Session";

  }


  updateTrainingAttendanceSummary();


  openTrainingModal(
    "trainingAttendanceModal"
  );

}


/* =========================================================
   SET ALL ATTENDANCE
========================================================= */

function setAllTrainingAttendance(
  status
) {

  const modal =
    document.querySelector(
      "#trainingAttendanceModal"
    );


  if (!modal) {
    return;
  }


  const rows =
    modal.querySelectorAll(
      ".training-attendance-table tbody tr"
    );


  rows.forEach(row => {

    const input =
      row.querySelector(
        `input[value="${CSS.escape(status)}"]`
      );


    if (input) {

      input.checked = true;

    }

  });


  updateTrainingAttendanceSummary();

}


/* =========================================================
   CLEAR ATTENDANCE
========================================================= */

function clearAllTrainingAttendance() {

  const inputs =
    document.querySelectorAll(
      "#trainingAttendanceModal .training-attendance-status-option input"
    );


  inputs.forEach(input => {

    input.checked = false;

  });


  updateTrainingAttendanceSummary();

}


/* =========================================================
   ATTENDANCE SUMMARY
========================================================= */

function updateTrainingAttendanceSummary() {

  const modal =
    document.querySelector(
      "#trainingAttendanceModal"
    );


  if (!modal) {
    return;
  }


  const selectedInputs =
    modal.querySelectorAll(
      ".training-attendance-status-option input:checked"
    );


  const totals = {
    present: 0,
    late: 0,
    absent: 0
  };


  selectedInputs.forEach(input => {

    if (
      Object.prototype.hasOwnProperty.call(
        totals,
        input.value
      )
    ) {

      totals[input.value] += 1;

    }

  });


  updateTrainingAttendanceValue(
    "#trainingPresentCount",
    totals.present
  );


  updateTrainingAttendanceValue(
    "#trainingLateCount",
    totals.late
  );


  updateTrainingAttendanceValue(
    "#trainingAbsentCount",
    totals.absent
  );


  updateTrainingAttendanceValue(
    "#trainingAttendanceMarkedCount",
    selectedInputs.length
  );

}


/* =========================================================
   SAVE ATTENDANCE
========================================================= */

function saveTrainingAttendance() {

  const modal =
    document.querySelector(
      "#trainingAttendanceModal"
    );


  if (!modal) {
    return;
  }


  const rows =
    modal.querySelectorAll(
      ".training-attendance-table tbody tr"
    );


  const attendance = [];


  rows.forEach(row => {

    const selected =
      row.querySelector(
        ".training-attendance-status-option input:checked"
      );


    attendance.push({
      playerId:
        row.dataset.playerId || "",
      status:
        selected?.value || "unmarked",
      note:
        row.querySelector(
          "[data-attendance-note]"
        )?.value?.trim() || ""
    });

  });


  document.dispatchEvent(
    new CustomEvent(
      "coachTraining:attendanceSaved",
      {
        detail: {
          sessionId:
            modal.dataset.sessionId || "",
          attendance
        }
      }
    )
  );


  showTrainingToast(
    "success",
    "Attendance saved",
    "Player attendance has been updated on the frontend."
  );


  closeTrainingModal(modal);

}


/* =========================================================
   ANALYTICS CONTROLS
========================================================= */

function initializeTrainingAnalytics() {

  const selectors =
    document.querySelectorAll(
      "[data-training-analytics-period]"
    );


  selectors.forEach(selector => {

    selector.addEventListener(
      "change",
      () => {

        updateTrainingAnalytics(
          selector.value
        );

      }
    );

  });


  document.addEventListener(
    "click",
    event => {

      const refreshButton =
        event.target.closest(
          "[data-refresh-training-analytics]"
        );


      if (!refreshButton) {
        return;
      }


      refreshTrainingAnalytics(
        refreshButton
      );

    }
  );


  initializeTrainingChartTooltips();

}


/* =========================================================
   UPDATE ANALYTICS
========================================================= */

function updateTrainingAnalytics(
  period
) {

  const analyticsCards =
    document.querySelectorAll(
      ".training-analytics-card"
    );


  analyticsCards.forEach(card => {

    card.dataset.period =
      period;

  });


  document.dispatchEvent(
    new CustomEvent(
      "coachTraining:analyticsPeriodChanged",
      {
        detail: {
          period
        }
      }
    )
  );


  showTrainingToast(
    "info",
    "Analytics updated",
    `Training insights are now showing ${formatTrainingPeriod(period)}.`
  );

}


/* =========================================================
   REFRESH ANALYTICS
========================================================= */

function refreshTrainingAnalytics(
  button
) {

  if (button.disabled) {
    return;
  }


  button.disabled = true;

  button.classList.add("loading");


  const icon =
    button.querySelector(
      "i, svg"
    );


  if (icon) {

    icon.classList.add(
      "fa-spin"
    );

  }


  window.setTimeout(() => {

    button.disabled = false;

    button.classList.remove("loading");


    if (icon) {

      icon.classList.remove(
        "fa-spin"
      );

    }


    document.dispatchEvent(
      new CustomEvent(
        "coachTraining:analyticsRefresh"
      )
    );


    showTrainingToast(
      "success",
      "Analytics refreshed",
      "The latest frontend training figures are now displayed."
    );

  }, 700);

}


/* =========================================================
   CHART TOOLTIPS
========================================================= */

function initializeTrainingChartTooltips() {

  const bars =
    document.querySelectorAll(
      ".training-chart-bar"
    );


  bars.forEach(bar => {

    const value =
      bar.dataset.value;


    if (
      value &&
      !bar.querySelector(
        ".training-chart-tooltip"
      )
    ) {

      const tooltip =
        document.createElement("span");


      tooltip.className =
        "training-chart-tooltip";


      tooltip.textContent =
        value;


      bar.appendChild(
        tooltip
      );

    }

  });

}


/* =========================================================
   QUICK ACTIONS
========================================================= */

function initializeTrainingQuickActions() {

  document.addEventListener(
    "click",
    event => {

      const actionButton =
        event.target.closest(
          "[data-training-quick-action]"
        );


      if (!actionButton) {
        return;
      }


      const action =
        actionButton.dataset.trainingQuickAction;


      switch (action) {

        case "create-session":

          openTrainingModal(
            "trainingSessionModal",
            actionButton
          );

          break;


        case "take-attendance":

          openMostRecentTrainingAttendance();

          break;


        case "print":

          window.print();

          break;


        case "export":

          exportTrainingSessions();

          break;


        case "calendar":

          scrollToTrainingSection(
            "#trainingCalendarSection"
          );

          break;


        case "analytics":

          scrollToTrainingSection(
            "#trainingAnalyticsSection"
          );

          break;


        default:

          document.dispatchEvent(
            new CustomEvent(
              "coachTraining:quickAction",
              {
                detail: {
                  action
                }
              }
            )
          );

          break;

      }

    }
  );

}


/* =========================================================
   MOST RECENT ATTENDANCE
========================================================= */

function openMostRecentTrainingAttendance() {

  const firstSession =
    document.querySelector(
      '.training-session-card:not([hidden])[data-status="upcoming"], .training-session-card:not([hidden])'
    );


  if (!firstSession) {

    showTrainingToast(
      "warning",
      "No session available",
      "Create or display a training session before taking attendance."
    );

    return;

  }


  prepareTrainingAttendance(
    firstSession.dataset.sessionId || ""
  );

}


/* =========================================================
   EXPORT TRAINING SESSIONS
========================================================= */

function exportTrainingSessions() {

  const cards =
    document.querySelectorAll(
      ".training-session-card"
    );


  const sessionData =
    Array.from(cards).map(card => {

      return {
        id:
          card.dataset.sessionId || "",
        title:
          card.dataset.title ||
          card.querySelector(
            ".training-session-body h4"
          )?.textContent?.trim() ||
          "",
        type:
          card.dataset.type || "",
        status:
          card.dataset.status || "",
        date:
          card.dataset.date || "",
        description:
          card.dataset.description ||
          card.querySelector(
            ".training-session-body > p"
          )?.textContent?.trim() ||
          ""
      };

    });


  const fileContent =
    JSON.stringify(
      sessionData,
      null,
      2
    );


  const fileBlob =
    new Blob(
      [fileContent],
      {
        type: "application/json"
      }
    );


  const fileUrl =
    URL.createObjectURL(
      fileBlob
    );


  const downloadLink =
    document.createElement("a");


  downloadLink.href =
    fileUrl;


  downloadLink.download =
    `coach-training-sessions-${formatTrainingDateValue(new Date())}.json`;


  document.body.appendChild(
    downloadLink
  );


  downloadLink.click();

  downloadLink.remove();


  URL.revokeObjectURL(
    fileUrl
  );


  showTrainingToast(
    "success",
    "Training data exported",
    "The frontend session data file has been downloaded."
  );

}


/* =========================================================
   TRAINING RESOURCES
========================================================= */

function initializeTrainingResources() {

  document.addEventListener(
    "click",
    event => {

      const resourceButton =
        event.target.closest(
          "[data-training-resource-action]"
        );


      if (!resourceButton) {
        return;
      }


      const action =
        resourceButton.dataset.trainingResourceAction;


      const resourceItem =
        resourceButton.closest(
          ".training-resource-item"
        );


      const resourceName =
        resourceItem?.querySelector(
          ".training-resource-info strong"
        )?.textContent?.trim() ||
        "Training resource";


      if (action === "preview") {

        showTrainingToast(
          "info",
          resourceName,
          "Resource preview will be connected to the backend file service."
        );

      }


      if (action === "download") {

        showTrainingToast(
          "success",
          "Download prepared",
          `${resourceName} is ready for backend file integration.`
        );

      }

    }
  );

}


/* =========================================================
   TRAINING NOTES
========================================================= */

function initializeTrainingNotes() {

  const addNoteForm =
    document.querySelector(
      "#trainingNoteForm"
    );


  if (addNoteForm) {

    addNoteForm.addEventListener(
      "submit",
      event => {

        event.preventDefault();


        const input =
          addNoteForm.querySelector(
            "textarea, input"
          );


        const noteText =
          input?.value?.trim() || "";


        if (!noteText) {

          showTrainingToast(
            "warning",
            "Add a note",
            "Enter a coaching note before saving."
          );

          return;

        }


        addTrainingNote(
          noteText
        );


        addNoteForm.reset();

      }
    );

  }


  document.addEventListener(
    "click",
    event => {

      const deleteButton =
        event.target.closest(
          "[data-delete-training-note]"
        );


      if (deleteButton) {

        const note =
          deleteButton.closest(
            ".training-note-item"
          );


        if (note) {

          note.remove();


          showTrainingToast(
            "success",
            "Note removed",
            "The coaching note has been deleted from the frontend."
          );

        }

      }

    }
  );

}


/* =========================================================
   ADD NOTE
========================================================= */

function addTrainingNote(
  noteText
) {

  const notesList =
    document.querySelector(
      "#trainingNotesList"
    );


  if (!notesList) {
    return;
  }


  const note =
    document.createElement("div");


  note.className =
    "training-note-item";


  note.dataset.noteId =
    `note-${Date.now()}`;


  note.innerHTML = `
    <p>
      ${escapeTrainingHTML(noteText)}
    </p>

    <div class="training-note-meta">

      <span>
        Added just now
      </span>

      <div class="training-note-actions">

        <button
          type="button"
          class="training-note-action"
          data-delete-training-note
          aria-label="Delete note"
        >
          <i class="fa-solid fa-trash"></i>
        </button>

      </div>

    </div>
  `;


  notesList.prepend(
    note
  );


  showTrainingToast(
    "success",
    "Note added",
    "The coaching note has been saved on the frontend."
  );

}


/* =========================================================
   PAGINATION
========================================================= */

function initializeTrainingPagination() {

  document.addEventListener(
    "click",
    event => {

      const pageButton =
        event.target.closest(
          "[data-training-page]"
        );


      if (!pageButton) {
        return;
      }


      const page =
        Number(
          pageButton.dataset.trainingPage
        );


      if (
        !Number.isFinite(page) ||
        page < 1
      ) {
        return;
      }


      setTrainingPage(
        page
      );

    }
  );

}


/* =========================================================
   SET TRAINING PAGE
========================================================= */

function setTrainingPage(
  page
) {

  const pagination =
    document.querySelector(
      ".training-pagination"
    );


  if (!pagination) {
    return;
  }


  pagination.dataset.currentPage =
    String(page);


  pagination
    .querySelectorAll(
      "[data-training-page]"
    )
    .forEach(button => {

      const isActive =
        Number(
          button.dataset.trainingPage
        ) === page;


      button.classList.toggle(
        "active",
        isActive
      );


      button.setAttribute(
        "aria-current",
        isActive
          ? "page"
          : "false"
      );

    });


  document.dispatchEvent(
    new CustomEvent(
      "coachTraining:pageChanged",
      {
        detail: {
          page
        }
      }
    )
  );


  scrollToTrainingSection(
    "#trainingSessionsSection"
  );

}


/* =========================================================
   GENERAL HELPERS
========================================================= */

function getTrainingWeekStart(
  date
) {

  const result =
    new Date(date);


  result.setHours(
    0,
    0,
    0,
    0
  );


  const day =
    result.getDay();


  const difference =
    day === 0
      ? -6
      : 1 - day;


  result.setDate(
    result.getDate() +
    difference
  );


  return result;

}


function addTrainingDays(
  date,
  days
) {

  const result =
    new Date(date);


  result.setDate(
    result.getDate() +
    days
  );


  return result;

}


function formatTrainingDateValue(
  date
) {

  const year =
    date.getFullYear();


  const month =
    String(
      date.getMonth() + 1
    ).padStart(
      2,
      "0"
    );


  const day =
    String(
      date.getDate()
    ).padStart(
      2,
      "0"
    );


  return `${year}-${month}-${day}`;

}


function formatTrainingDisplayDate(
  dateValue
) {

  if (!dateValue) {

    return "Date not specified";

  }


  const date =
    new Date(dateValue);


  if (
    Number.isNaN(
      date.getTime()
    )
  ) {

    return dateValue;

  }


  return date.toLocaleDateString(
    "en-IN",
    {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric"
    }
  );

}


function capitalizeTrainingText(
  value
) {

  return String(value || "")
    .replaceAll("-", " ")
    .replace(/\b\w/g, character =>
      character.toUpperCase()
    );

}


function formatTrainingPeriod(
  value
) {

  const periodMap = {
    week: "this week",
    month: "this month",
    quarter: "this quarter",
    year: "this year",
    "7-days": "the last 7 days",
    "30-days": "the last 30 days",
    "90-days": "the last 90 days"
  };


  return (
    periodMap[value] ||
    String(value || "the selected period")
  );

}


function updateTrainingAttendanceValue(
  selector,
  value
) {

  const element =
    document.querySelector(
      selector
    );


  if (element) {

    element.textContent =
      String(value);

  }

}


function scrollToTrainingSection(
  selector
) {

  const section =
    document.querySelector(
      selector
    );


  if (!section) {
    return;
  }


  section.scrollIntoView({
    behavior:
      window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches
        ? "auto"
        : "smooth",
    block: "start"
  });

}

/* =========================================================
   COACH TRAINING PAGE
   coach-training.js
   PART 4
   Edit Session, Duplicate Session, Dynamic Card Creation,
   Keyboard Accessibility, Focus Trap, Live Updates,
   Local Storage and Final Initialization
========================================================= */

"use strict";


/* =========================================================
   DOM READY
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  initializeTrainingEditEvents();

  initializeTrainingDuplicateEvents();

  initializeTrainingFocusTrap();

  initializeTrainingKeyboardActions();

  initializeTrainingLiveTime();

  initializeTrainingLocalStorage();

  initializeTrainingCardKeyboardAccess();

  initializeTrainingSessionCounters();

  applyTrainingFilters();

});


/* =========================================================
   EDIT SESSION EVENTS
========================================================= */

function initializeTrainingEditEvents() {

  document.addEventListener(
    "coachTraining:edit",
    event => {

      const sessionId =
        event.detail?.sessionId || "";


      const card =
        event.detail?.card ||
        findTrainingSessionCard(
          sessionId
        );


      prepareTrainingSessionEdit(
        sessionId,
        card
      );

    }
  );

}


/* =========================================================
   PREPARE SESSION EDIT
========================================================= */

function prepareTrainingSessionEdit(
  sessionId,
  card
) {

  const form =
    document.querySelector(
      "#trainingSessionForm"
    );


  const modal =
    document.querySelector(
      "#trainingSessionModal"
    );


  if (
    !form ||
    !modal
  ) {
    return;
  }


  resetTrainingForm(form);


  form.dataset.mode =
    "edit";


  form.dataset.sessionId =
    sessionId || "";


  populateTrainingEditForm(
    form,
    card
  );


  updateTrainingModalForEdit(
    modal
  );


  openTrainingModal(
    "trainingSessionModal"
  );

}


/* =========================================================
   POPULATE EDIT FORM
========================================================= */

function populateTrainingEditForm(
  form,
  card
) {

  if (!card) {
    return;
  }


  setTrainingFormValue(
    form,
    [
      "#trainingTitle",
      "[name='title']",
      "[name='sessionTitle']"
    ],
    card.dataset.title ||
    getTrainingCardTitle(card)
  );


  setTrainingFormValue(
    form,
    [
      "#trainingDescription",
      "[name='description']"
    ],
    card.dataset.description ||
    getTrainingCardDescription(card)
  );


  setTrainingFormValue(
    form,
    [
      "#trainingDate",
      "[name='date']",
      "[name='sessionDate']"
    ],
    card.dataset.date || ""
  );


  setTrainingFormValue(
    form,
    [
      "#trainingLocation",
      "[name='location']",
      "[name='venue']"
    ],
    card.dataset.location ||
    getTrainingCardLocation(card)
  );


  setTrainingFormValue(
    form,
    [
      "#trainingStartTime",
      "[name='startTime']"
    ],
    card.dataset.startTime || ""
  );


  setTrainingFormValue(
    form,
    [
      "#trainingEndTime",
      "[name='endTime']"
    ],
    card.dataset.endTime || ""
  );


  setTrainingFormValue(
    form,
    [
      "#trainingStatus",
      "[name='status']"
    ],
    card.dataset.status || "upcoming"
  );


  setTrainingFormRadioValue(
    form,
    "trainingType",
    card.dataset.type
  );


  setTrainingFormRadioValue(
    form,
    "intensity",
    card.dataset.intensity
  );


  selectTrainingPlayersFromCard(
    card
  );


  populateTrainingDrillsFromCard(
    card
  );


  updateTrainingDuration();


  document
    .querySelectorAll(
      ".training-character-count"
    )
    .forEach(counter => {

      const target =
        document.getElementById(
          counter.dataset.characterTarget
        );


      if (target) {

        updateTrainingCharacterCount(
          target,
          counter
        );

      }

    });

}


/* =========================================================
   UPDATE MODAL FOR EDIT
========================================================= */

function updateTrainingModalForEdit(
  modal
) {

  const eyebrow =
    modal.querySelector(
      ".training-modal-heading span"
    );


  const title =
    modal.querySelector(
      ".training-modal-heading h3"
    );


  const description =
    modal.querySelector(
      ".training-modal-heading p"
    );


  const submitButton =
    modal.querySelector(
      "[type='submit']"
    );


  if (eyebrow) {

    eyebrow.textContent =
      "Edit session";

  }


  if (title) {

    title.textContent =
      "Update Training Session";

  }


  if (description) {

    description.textContent =
      "Review and update the selected training session details.";

  }


  if (submitButton) {

    submitButton.innerHTML = `
      <i class="fa-solid fa-floppy-disk"></i>
      Update Session
    `;

  }

}


/* =========================================================
   RESET MODAL TO CREATE MODE
========================================================= */

function resetTrainingModalToCreate() {

  const form =
    document.querySelector(
      "#trainingSessionForm"
    );


  const modal =
    document.querySelector(
      "#trainingSessionModal"
    );


  if (!form || !modal) {
    return;
  }


  form.dataset.mode =
    "create";


  delete form.dataset.sessionId;


  const eyebrow =
    modal.querySelector(
      ".training-modal-heading span"
    );


  const title =
    modal.querySelector(
      ".training-modal-heading h3"
    );


  const description =
    modal.querySelector(
      ".training-modal-heading p"
    );


  const submitButton =
    modal.querySelector(
      "[type='submit']"
    );


  if (eyebrow) {

    eyebrow.textContent =
      "New session";

  }


  if (title) {

    title.textContent =
      "Create Training Session";

  }


  if (description) {

    description.textContent =
      "Plan a professional training session for your players.";

  }


  if (submitButton) {

    submitButton.innerHTML = `
      <i class="fa-solid fa-calendar-plus"></i>
      Create Session
    `;

  }

}


/* =========================================================
   DUPLICATE SESSION EVENTS
========================================================= */

function initializeTrainingDuplicateEvents() {

  document.addEventListener(
    "coachTraining:duplicate",
    event => {

      const sessionId =
        event.detail?.sessionId || "";


      const sourceCard =
        event.detail?.card ||
        findTrainingSessionCard(
          sessionId
        );


      duplicateTrainingSessionCard(
        sourceCard
      );

    }
  );

}


/* =========================================================
   DUPLICATE SESSION
========================================================= */

function duplicateTrainingSessionCard(
  sourceCard
) {

  if (!sourceCard) {

    showTrainingToast(
      "warning",
      "Session unavailable",
      "The selected training session could not be duplicated."
    );

    return;

  }


  const sessionsGrid =
    document.querySelector(
      "#trainingSessionsGrid"
    );


  if (!sessionsGrid) {
    return;
  }


  const duplicatedCard =
    sourceCard.cloneNode(true);


  const newSessionId =
    createTrainingSessionId();


  duplicatedCard.dataset.sessionId =
    newSessionId;


  duplicatedCard.dataset.status =
    "draft";


  const originalTitle =
    sourceCard.dataset.title ||
    getTrainingCardTitle(
      sourceCard
    );


  const duplicateTitle =
    `${originalTitle} Copy`;


  duplicatedCard.dataset.title =
    duplicateTitle;


  const titleElement =
    duplicatedCard.querySelector(
      ".training-session-body h4, .training-session-title"
    );


  if (titleElement) {

    titleElement.textContent =
      duplicateTitle;

  }


  updateDuplicatedTrainingStatus(
    duplicatedCard
  );


  updateTrainingCardSessionReferences(
    duplicatedCard,
    newSessionId
  );


  duplicatedCard.hidden = false;

  duplicatedCard.classList.remove(
    "training-hidden"
  );


  sessionsGrid.prepend(
    duplicatedCard
  );


  saveTrainingSessionsToStorage();

  applyTrainingFilters();

  initializeTrainingSessionCounters();


  showTrainingToast(
    "success",
    "Session duplicated",
    "A draft copy of the selected training session has been created."
  );


  duplicatedCard.scrollIntoView({
    behavior:
      prefersReducedTrainingMotion()
        ? "auto"
        : "smooth",
    block: "center"
  });

}


/* =========================================================
   DUPLICATED STATUS
========================================================= */

function updateDuplicatedTrainingStatus(
  card
) {

  const statusBadge =
    card.querySelector(
      ".training-session-status"
    );


  if (statusBadge) {

    statusBadge.className =
      "training-session-status draft";


    statusBadge.textContent =
      "Draft";

  }

}


/* =========================================================
   UPDATE SESSION REFERENCES
========================================================= */

function updateTrainingCardSessionReferences(
  card,
  sessionId
) {

  card
    .querySelectorAll(
      "[data-session-id]"
    )
    .forEach(element => {

      element.dataset.sessionId =
        sessionId;

    });


  card
    .querySelectorAll(
      "[id]"
    )
    .forEach(element => {

      if (
        element.id.includes(
          "session"
        )
      ) {

        element.removeAttribute(
          "id"
        );

      }

    });

}


/* =========================================================
   CREATE TRAINING SESSION CARD
========================================================= */

function createTrainingSessionCard(
  data
) {

  const card =
    document.createElement("article");


  const sessionId =
    data.id ||
    createTrainingSessionId();


  const title =
    data.title ||
    data.sessionTitle ||
    "New Training Session";


  const description =
    data.description ||
    "Training session details will be added soon.";


  const status =
    data.status ||
    "upcoming";


  const type =
    data.trainingType ||
    data.type ||
    "technical";


  const date =
    data.date ||
    data.sessionDate ||
    "";


  const location =
    data.location ||
    data.venue ||
    "Training Ground";


  const startTime =
    data.startTime || "";


  const endTime =
    data.endTime || "";


  const players =
    Array.isArray(
      data.selectedPlayers
    )
      ? data.selectedPlayers
      : [];


  card.className =
    "training-session-card";


  card.dataset.sessionId =
    sessionId;


  card.dataset.title =
    title;


  card.dataset.description =
    description;


  card.dataset.status =
    status;


  card.dataset.type =
    type;


  card.dataset.date =
    date;


  card.dataset.location =
    location;


  card.dataset.startTime =
    startTime;


  card.dataset.endTime =
    endTime;


  card.innerHTML = `
    <div class="training-session-card-header">

      <div class="training-session-type-icon">
        <i class="${getTrainingTypeIcon(type)}"></i>
      </div>

      <span class="training-session-status ${escapeTrainingHTML(status)}">
        ${escapeTrainingHTML(capitalizeTrainingText(status))}
      </span>

      <div class="training-card-menu">

        <button
          type="button"
          class="training-session-icon-button"
          data-training-card-menu
          aria-label="Open session actions"
          aria-expanded="false"
        >
          <i class="fa-solid fa-ellipsis-vertical"></i>
        </button>

        <div class="training-card-dropdown">

          <button
            type="button"
            data-training-action="view"
            data-session-id="${escapeTrainingHTML(sessionId)}"
          >
            <i class="fa-regular fa-eye"></i>
            View Details
          </button>

          <button
            type="button"
            data-training-action="edit"
            data-session-id="${escapeTrainingHTML(sessionId)}"
          >
            <i class="fa-regular fa-pen-to-square"></i>
            Edit Session
          </button>

          <button
            type="button"
            data-training-action="duplicate"
            data-session-id="${escapeTrainingHTML(sessionId)}"
          >
            <i class="fa-regular fa-copy"></i>
            Duplicate
          </button>

          <button
            type="button"
            data-training-action="attendance"
            data-session-id="${escapeTrainingHTML(sessionId)}"
          >
            <i class="fa-solid fa-user-check"></i>
            Attendance
          </button>

          <button
            type="button"
            class="danger"
            data-training-action="delete"
            data-session-id="${escapeTrainingHTML(sessionId)}"
          >
            <i class="fa-regular fa-trash-can"></i>
            Delete
          </button>

        </div>

      </div>

    </div>

    <div class="training-session-body">

      <div class="training-session-date">
        <i class="fa-regular fa-calendar"></i>

        <span>
          ${escapeTrainingHTML(formatTrainingDisplayDate(date))}
        </span>
      </div>

      <h4>
        ${escapeTrainingHTML(title)}
      </h4>

      <p>
        ${escapeTrainingHTML(description)}
      </p>

      <div class="training-session-meta">

        <span>
          <i class="fa-regular fa-clock"></i>

          ${
            startTime || endTime
              ? `${escapeTrainingHTML(startTime)}${
                  endTime
                    ? ` – ${escapeTrainingHTML(endTime)}`
                    : ""
                }`
              : "Time not set"
          }
        </span>

        <span>
          <i class="fa-solid fa-location-dot"></i>

          ${escapeTrainingHTML(location)}
        </span>

      </div>

      <div class="training-session-focus-tags">

        <span class="training-focus-tag">
          ${escapeTrainingHTML(capitalizeTrainingText(type))}
        </span>

      </div>

    </div>

    <div class="training-session-footer">

      <div class="training-attendance-avatars">
        ${createTrainingPlayerAvatars(players)}
      </div>

      <span class="training-player-total">
        ${players.length} player${players.length === 1 ? "" : "s"}
      </span>

      <button
        type="button"
        class="training-session-action"
        data-training-action="view"
        data-session-id="${escapeTrainingHTML(sessionId)}"
      >
        View Session
        <i class="fa-solid fa-arrow-right"></i>
      </button>

    </div>
  `;


  return card;

}


/* =========================================================
   HANDLE FORM CREATED OR UPDATED SESSION
========================================================= */

document.addEventListener(
  "coachTraining:create",
  event => {

    const data =
      event.detail?.formData;


    const form =
      event.detail?.form;


    if (!data || !form) {
      return;
    }


    const mode =
      form.dataset.mode ||
      "create";


    if (mode === "edit") {

      updateTrainingSessionCard(
        form.dataset.sessionId,
        data
      );

    } else {

      appendTrainingSessionCard(
        data
      );

    }


    resetTrainingModalToCreate();

    saveTrainingSessionsToStorage();

    initializeTrainingSessionCounters();

  }
);


/* =========================================================
   APPEND NEW CARD
========================================================= */

function appendTrainingSessionCard(
  data
) {

  const sessionsGrid =
    document.querySelector(
      "#trainingSessionsGrid"
    );


  if (!sessionsGrid) {
    return;
  }


  const card =
    createTrainingSessionCard(
      data
    );


  const emptyState =
    sessionsGrid.querySelector(
      ".training-empty-state"
    );


  if (emptyState) {

    sessionsGrid.insertBefore(
      card,
      emptyState
    );

  } else {

    sessionsGrid.prepend(
      card
    );

  }


  applyTrainingFilters();

}


/* =========================================================
   UPDATE EXISTING CARD
========================================================= */

function updateTrainingSessionCard(
  sessionId,
  data
) {

  const oldCard =
    findTrainingSessionCard(
      sessionId
    );


  if (!oldCard) {

    appendTrainingSessionCard(
      data
    );

    return;

  }


  const updatedData = {
    ...data,
    id: sessionId
  };


  const updatedCard =
    createTrainingSessionCard(
      updatedData
    );


  oldCard.replaceWith(
    updatedCard
  );


  applyTrainingFilters();


  showTrainingToast(
    "success",
    "Session updated",
    "The training session changes have been saved on the frontend."
  );

}


/* =========================================================
   PLAYER AVATARS
========================================================= */

function createTrainingPlayerAvatars(
  players
) {

  if (!players.length) {

    return `
      <span class="training-attendance-avatar">
        <i class="fa-solid fa-user"></i>
      </span>
    `;

  }


  const visiblePlayers =
    players.slice(0, 4);


  const avatars =
    visiblePlayers.map(player => {

      return `
        <span
          class="training-attendance-avatar"
          title="${escapeTrainingHTML(player.name || "Player")}"
        >
          ${
            player.image
              ? `
                <img
                  src="${escapeTrainingHTML(player.image)}"
                  alt="${escapeTrainingHTML(player.name || "Player")}"
                >
              `
              : escapeTrainingHTML(
                  player.initials ||
                  getTrainingInitials(
                    player.name
                  )
                )
          }
        </span>
      `;

    }).join("");


  const remaining =
    players.length -
    visiblePlayers.length;


  return `
    ${avatars}

    ${
      remaining > 0
        ? `
          <span class="training-attendance-avatar more">
            +${remaining}
          </span>
        `
        : ""
    }
  `;

}


/* =========================================================
   MODAL FOCUS TRAP
========================================================= */

function initializeTrainingFocusTrap() {

  document.addEventListener(
    "keydown",
    event => {

      if (event.key !== "Tab") {
        return;
      }


      const activeContainer =
        document.querySelector(
          ".training-modal-backdrop.active .training-modal, .training-drawer.active"
        );


      if (!activeContainer) {
        return;
      }


      const focusableElements =
        getFocusableElements(
          activeContainer
        );


      if (!focusableElements.length) {

        event.preventDefault();

        activeContainer.focus();

        return;

      }


      const firstElement =
        focusableElements[0];


      const lastElement =
        focusableElements[
          focusableElements.length - 1
        ];


      if (
        event.shiftKey &&
        document.activeElement === firstElement
      ) {

        event.preventDefault();

        lastElement.focus();

      } else if (
        !event.shiftKey &&
        document.activeElement === lastElement
      ) {

        event.preventDefault();

        firstElement.focus();

      }

    }
  );

}


/* =========================================================
   KEYBOARD ACTIONS
========================================================= */

function initializeTrainingKeyboardActions() {

  document.addEventListener(
    "keydown",
    event => {

      const target =
        event.target;


      const isTyping =
        target.matches(
          "input, textarea, select, [contenteditable='true']"
        );


      if (isTyping) {
        return;
      }


      if (
        event.key.toLowerCase() === "n" &&
        !event.ctrlKey &&
        !event.metaKey &&
        !event.altKey
      ) {

        const modal =
          document.querySelector(
            "#trainingSessionModal"
          );


        if (modal) {

          event.preventDefault();

          resetTrainingModalToCreate();

          openTrainingModal(
            "trainingSessionModal"
          );

        }

      }


      if (
        event.key === "/" &&
        !event.ctrlKey &&
        !event.metaKey
      ) {

        const search =
          document.querySelector(
            "#trainingSearch"
          );


        if (search) {

          event.preventDefault();

          search.focus();

        }

      }

    }
  );

}


/* =========================================================
   CARD KEYBOARD ACCESS
========================================================= */

function initializeTrainingCardKeyboardAccess() {

  const cards =
    document.querySelectorAll(
      ".training-session-card"
    );


  cards.forEach(card => {

    if (!card.hasAttribute("tabindex")) {

      card.setAttribute(
        "tabindex",
        "0"
      );

    }


    card.addEventListener(
      "keydown",
      event => {

        if (
          event.key !== "Enter" &&
          event.key !== " "
        ) {
          return;
        }


        if (
          event.target.closest(
            "button, a, input, select, textarea"
          )
        ) {
          return;
        }


        event.preventDefault();


        handleViewTrainingSession(
          card.dataset.sessionId || "",
          card
        );

      }
    );

  });

}


/* =========================================================
   LIVE TIME UPDATE
========================================================= */

function initializeTrainingLiveTime() {

  updateTrainingCurrentTimeLine();


  window.setInterval(
    updateTrainingCurrentTimeLine,
    60000
  );

}


/* =========================================================
   SESSION COUNTERS
========================================================= */

function initializeTrainingSessionCounters() {

  const cards =
    document.querySelectorAll(
      ".training-session-card"
    );


  const totals = {
    all: cards.length,
    upcoming: 0,
    completed: 0,
    cancelled: 0,
    draft: 0
  };


  cards.forEach(card => {

    const status =
      card.dataset.status;


    if (
      Object.prototype.hasOwnProperty.call(
        totals,
        status
      )
    ) {

      totals[status] += 1;

    }

  });


  Object.entries(
    totals
  ).forEach(([key, value]) => {

    document
      .querySelectorAll(
        `[data-training-count="${key}"]`
      )
      .forEach(element => {

        element.textContent =
          String(value);

      });

  });

}


/* =========================================================
   LOCAL STORAGE
========================================================= */

function initializeTrainingLocalStorage() {

  restoreTrainingSessionsFromStorage();


  document.addEventListener(
    "coachTraining:attendanceSaved",
    event => {

      const sessionId =
        event.detail?.sessionId || "";


      const attendance =
        event.detail?.attendance || [];


      saveTrainingAttendanceToStorage(
        sessionId,
        attendance
      );

    }
  );

}


/* =========================================================
   SAVE TRAINING SESSIONS
========================================================= */

function saveTrainingSessionsToStorage() {

  const cards =
    document.querySelectorAll(
      ".training-session-card"
    );


  const sessions =
    Array.from(cards).map(card => {

      return {
        id:
          card.dataset.sessionId || "",
        title:
          card.dataset.title ||
          getTrainingCardTitle(card),
        description:
          card.dataset.description ||
          getTrainingCardDescription(card),
        status:
          card.dataset.status || "",
        type:
          card.dataset.type || "",
        date:
          card.dataset.date || "",
        location:
          card.dataset.location ||
          getTrainingCardLocation(card),
        startTime:
          card.dataset.startTime || "",
        endTime:
          card.dataset.endTime || ""
      };

    });


  try {

    localStorage.setItem(
      "coachTrainingSessions",
      JSON.stringify(sessions)
    );

  } catch (error) {

    console.warn(
      "Unable to save training sessions:",
      error
    );

  }

}


/* =========================================================
   RESTORE TRAINING SESSIONS
========================================================= */

function restoreTrainingSessionsFromStorage() {

  let storedSessions = [];


  try {

    storedSessions =
      JSON.parse(
        localStorage.getItem(
          "coachTrainingSessions"
        ) || "[]"
      );

  } catch (error) {

    storedSessions = [];

  }


  if (
    !Array.isArray(storedSessions) ||
    !storedSessions.length
  ) {
    return;
  }


  const sessionsGrid =
    document.querySelector(
      "#trainingSessionsGrid"
    );


  if (!sessionsGrid) {
    return;
  }


  storedSessions.forEach(session => {

    if (
      !session.id ||
      findTrainingSessionCard(
        session.id
      )
    ) {
      return;
    }


    const card =
      createTrainingSessionCard(
        session
      );


    const emptyState =
      sessionsGrid.querySelector(
        ".training-empty-state"
      );


    if (emptyState) {

      sessionsGrid.insertBefore(
        card,
        emptyState
      );

    } else {

      sessionsGrid.appendChild(
        card
      );

    }

  });


  initializeTrainingCardKeyboardAccess();

  initializeTrainingSessionCounters();

  applyTrainingFilters();

}


/* =========================================================
   SAVE ATTENDANCE STORAGE
========================================================= */

function saveTrainingAttendanceToStorage(
  sessionId,
  attendance
) {

  if (!sessionId) {
    return;
  }


  let storedAttendance = {};


  try {

    storedAttendance =
      JSON.parse(
        localStorage.getItem(
          "coachTrainingAttendance"
        ) || "{}"
      );

  } catch (error) {

    storedAttendance = {};

  }


  storedAttendance[sessionId] = {
    attendance,
    updatedAt:
      new Date().toISOString()
  };


  try {

    localStorage.setItem(
      "coachTrainingAttendance",
      JSON.stringify(
        storedAttendance
      )
    );

  } catch (error) {

    console.warn(
      "Unable to save attendance:",
      error
    );

  }

}


/* =========================================================
   SELECT PLAYERS FROM CARD
========================================================= */

function selectTrainingPlayersFromCard(
  card
) {

  document
    .querySelectorAll(
      ".training-player-select-item input[type='checkbox']"
    )
    .forEach(checkbox => {

      checkbox.checked = false;

    });


  const playerIds =
    String(
      card?.dataset.playerIds || ""
    )
      .split(",")
      .map(value => value.trim())
      .filter(Boolean);


  playerIds.forEach(playerId => {

    const checkbox =
      document.querySelector(
        `.training-player-select-item input[value="${CSS.escape(playerId)}"]`
      );


    if (checkbox) {

      checkbox.checked = true;

    }

  });


  updateTrainingPlayerSelection();

}


/* =========================================================
   POPULATE DRILLS FROM CARD
========================================================= */

function populateTrainingDrillsFromCard(
  card
) {

  const drillsList =
    document.querySelector(
      "#trainingDrillsList"
    );


  if (!drillsList) {
    return;
  }


  drillsList.innerHTML = "";


  let drills = [];


  try {

    drills =
      JSON.parse(
        card?.dataset.drills || "[]"
      );

  } catch (error) {

    drills = [];

  }


  if (!Array.isArray(drills)) {
    return;
  }


  drills.forEach(drill => {

    const drillItem =
      document.createElement("div");


    drillItem.className =
      "training-drill-item";


    drillItem.dataset.drillId =
      drill.id ||
      `drill-${Date.now()}-${Math.random()}`;


    drillItem.innerHTML = `
      <span
        class="training-drill-handle"
        aria-hidden="true"
      >
        <i class="fa-solid fa-grip-vertical"></i>
      </span>

      <div class="training-drill-content">

        <strong>
          ${escapeTrainingHTML(drill.name || "Training Drill")}
        </strong>

        <span>
          ${
            drill.durationMinutes
              ? `${Number(drill.durationMinutes)} minutes`
              : "Duration not specified"
          }
        </span>

      </div>

      <div class="training-drill-actions">

        <button
          type="button"
          class="training-drill-action"
          data-edit-training-drill
          aria-label="Edit drill"
        >
          <i class="fa-solid fa-pen"></i>
        </button>

        <button
          type="button"
          class="training-drill-action remove"
          data-remove-training-drill
          aria-label="Remove drill"
        >
          <i class="fa-solid fa-trash"></i>
        </button>

      </div>
    `;


    drillsList.appendChild(
      drillItem
    );

  });

}


/* =========================================================
   FORM VALUE HELPERS
========================================================= */

function setTrainingFormValue(
  form,
  selectors,
  value
) {

  for (const selector of selectors) {

    const input =
      form.querySelector(
        selector
      );


    if (input) {

      input.value =
        value ?? "";

      return;

    }

  }

}


function setTrainingFormRadioValue(
  form,
  name,
  value
) {

  if (!value) {
    return;
  }


  const input =
    form.querySelector(
      `input[name="${CSS.escape(name)}"][value="${CSS.escape(value)}"]`
    );


  if (input) {

    input.checked = true;

  }

}


/* =========================================================
   CARD VALUE HELPERS
========================================================= */

function findTrainingSessionCard(
  sessionId
) {

  if (!sessionId) {
    return null;
  }


  return document.querySelector(
    `.training-session-card[data-session-id="${CSS.escape(sessionId)}"]`
  );

}


function getTrainingCardTitle(
  card
) {

  return (
    card?.querySelector(
      ".training-session-body h4, .training-session-title"
    )?.textContent?.trim() ||
    "Training Session"
  );

}


function getTrainingCardDescription(
  card
) {

  return (
    card?.querySelector(
      ".training-session-body > p, .training-session-description"
    )?.textContent?.trim() ||
    ""
  );

}


function getTrainingCardLocation(
  card
) {

  return (
    card?.querySelector(
      ".training-session-location"
    )?.textContent?.trim() ||
    "Training Ground"
  );

}


/* =========================================================
   SESSION ID
========================================================= */

function createTrainingSessionId() {

  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {

    return `training-${crypto.randomUUID()}`;

  }


  return `training-${Date.now()}-${Math.random()
    .toString(16)
    .slice(2)}`;

}


/* =========================================================
   TRAINING TYPE ICON
========================================================= */

function getTrainingTypeIcon(
  type
) {

  const icons = {
    technical:
      "fa-solid fa-futbol",

    tactical:
      "fa-solid fa-chess-board",

    physical:
      "fa-solid fa-dumbbell",

    recovery:
      "fa-solid fa-heart-pulse",

    fitness:
      "fa-solid fa-person-running",

    goalkeeper:
      "fa-solid fa-mitten",

    match:
      "fa-solid fa-trophy"
  };


  return (
    icons[String(type || "").toLowerCase()] ||
    "fa-solid fa-futbol"
  );

}


/* =========================================================
   REDUCED MOTION
========================================================= */

function prefersReducedTrainingMotion() {

  return window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

}


/* =========================================================
   STORAGE UPDATE AFTER DELETE OR CANCEL
========================================================= */

document.addEventListener(
  "coachTraining:delete",
  () => {

    window.setTimeout(
      saveTrainingSessionsToStorage,
      100
    );

  }
);


document.addEventListener(
  "coachTraining:cancel",
  () => {

    window.setTimeout(
      saveTrainingSessionsToStorage,
      100
    );

  }
);


/* =========================================================
   RESET CREATE MODE WHEN OPENING NEW SESSION
========================================================= */

document.addEventListener(
  "click",
  event => {

    const createButton =
      event.target.closest(
        '[data-open-training-modal="trainingSessionModal"], [data-training-quick-action="create-session"]'
      );


    if (!createButton) {
      return;
    }


    const form =
      document.querySelector(
        "#trainingSessionForm"
      );


    if (form) {

      resetTrainingForm(form);

    }


    resetTrainingModalToCreate();

  }
);