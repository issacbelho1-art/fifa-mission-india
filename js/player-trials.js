"use strict";

/* =========================================================
   FIFA MISSION INDIA - PLAYER TRIALS
   Frontend demonstration only
========================================================= */

const trialsGrid =
  document.getElementById("trialsGrid");

const emptyState =
  document.getElementById("emptyState");

const resultCount =
  document.getElementById("resultCount");

const openTrialCount =
  document.getElementById("openTrialCount");

const registeredTrialCount =
  document.getElementById("registeredTrialCount");

const trialSearchInput =
  document.getElementById("trialSearchInput");

const stateFilter =
  document.getElementById("stateFilter");

const trialTypeFilter =
  document.getElementById("trialTypeFilter");

const ageFilter =
  document.getElementById("ageFilter");

const statusFilter =
  document.getElementById("statusFilter");

const clearFilterButton =
  document.getElementById("clearFilterButton");

const emptyClearButton =
  document.getElementById("emptyClearButton");

const trialModal =
  document.getElementById("trialModal");

const modalCloseButton =
  document.getElementById("modalCloseButton");

const modalCancelButton =
  document.getElementById("modalCancelButton");

const registerTrialButton =
  document.getElementById("registerTrialButton");

const modalMessage =
  document.getElementById("modalMessage");

let selectedTrialId = null;


/* ================= DEMONSTRATION DATA ================= */

const trials = [
  {
    id: 1,
    title: "Northeast Regional Talent Trial",
    type: "Open Trial",
    state: "Nagaland",
    city: "Dimapur",
    venue: "Dimapur Sports Complex",
    date: "2026-08-18",
    deadline: "2026-08-12",
    ageCategory: "U-21",
    fee: "Free",
    status: "Open",
    registered: false,
    description:
      "A regional football talent identification programme for emerging players from Northeast India. Selected players may be invited for advanced assessment and development camps.",
    eligibility: [
      "Registered FIFA Mission India player",
      "Players aged 17 to 21 years",
      "Valid identity document required",
      "Medical fitness declaration required"
    ],
    requirements: [
      "Football boots",
      "Training jersey and shorts",
      "Water bottle",
      "Government-issued identity document"
    ]
  },
  {
    id: 2,
    title: "U-17 Elite Academy Selection",
    type: "Academy Selection",
    state: "Assam",
    city: "Guwahati",
    venue: "Guwahati Football Arena",
    date: "2026-08-25",
    deadline: "2026-08-15",
    ageCategory: "U-17",
    fee: "₹300",
    status: "Closing Soon",
    registered: false,
    description:
      "An academy selection event for talented youth players seeking structured football development and competitive exposure.",
    eligibility: [
      "Players born within the eligible U-17 age range",
      "School or academy playing experience preferred",
      "Parent or guardian consent for minors"
    ],
    requirements: [
      "Football kit",
      "Birth certificate",
      "Passport-size photograph",
      "Registration confirmation"
    ]
  },
  {
    id: 3,
    title: "National U-21 Scouting Camp",
    type: "Scouting Camp",
    state: "West Bengal",
    city: "Kolkata",
    venue: "National Football Development Centre",
    date: "2026-09-02",
    deadline: "2026-08-20",
    ageCategory: "U-21",
    fee: "Invitation Only",
    status: "Invite Only",
    registered: false,
    description:
      "A national-level scouting programme where invited players will be assessed by professional scouts and certified coaches.",
    eligibility: [
      "Invitation from FIFA Mission India",
      "Verified player profile",
      "Minimum performance score of 75",
      "Previous competitive playing experience"
    ],
    requirements: [
      "Invitation letter",
      "Football equipment",
      "Medical fitness certificate",
      "Identity document"
    ]
  },
  {
    id: 4,
    title: "Grassroots Development Camp",
    type: "Development Camp",
    state: "Manipur",
    city: "Imphal",
    venue: "Khuman Lampak Practice Ground",
    date: "2026-09-10",
    deadline: "2026-09-01",
    ageCategory: "U-15",
    fee: "Free",
    status: "Open",
    registered: false,
    description:
      "A player-development camp focusing on technical skills, teamwork, discipline and match awareness for young footballers.",
    eligibility: [
      "Players aged 12 to 15 years",
      "Parent or guardian consent",
      "Basic football experience"
    ],
    requirements: [
      "Training kit",
      "Football boots",
      "Water bottle",
      "Parent consent form"
    ]
  },
  {
    id: 5,
    title: "Women’s Open Football Trial",
    type: "Open Trial",
    state: "Meghalaya",
    city: "Shillong",
    venue: "Shillong Sports Centre",
    date: "2026-09-16",
    deadline: "2026-09-08",
    ageCategory: "Open Age",
    fee: "Free",
    status: "Open",
    registered: false,
    description:
      "An open football trial created to identify promising women footballers for development programmes and competitive teams.",
    eligibility: [
      "Women players aged 16 years and above",
      "Registered player profile",
      "No professional experience required"
    ],
    requirements: [
      "Football kit",
      "Identity document",
      "Medical declaration"
    ]
  },
  {
    id: 6,
    title: "Sikkim Youth Football Selection",
    type: "Academy Selection",
    state: "Sikkim",
    city: "Gangtok",
    venue: "Paljor Stadium Training Ground",
    date: "2026-09-24",
    deadline: "2026-09-14",
    ageCategory: "U-19",
    fee: "₹200",
    status: "Open",
    registered: false,
    description:
      "A competitive youth selection event for players seeking entry into a structured football academy development pathway.",
    eligibility: [
      "Players aged 16 to 19 years",
      "Valid age proof",
      "Football playing experience preferred"
    ],
    requirements: [
      "Football kit",
      "Age certificate",
      "Identity document",
      "Registration receipt"
    ]
  }
];


/* ================= STORAGE ================= */

function loadRegisteredTrials() {
  const storedTrialIds =
    sessionStorage.getItem("registeredTrialIds");

  if (!storedTrialIds) {
    return;
  }

  try {
    const registeredIds =
      JSON.parse(storedTrialIds);

    trials.forEach((trial) => {
      trial.registered =
        registeredIds.includes(trial.id);
    });
  } catch (error) {
    console.error(
      "Unable to load registered trials:",
      error
    );
  }
}


function saveRegisteredTrials() {
  const registeredIds = trials
    .filter((trial) => trial.registered)
    .map((trial) => trial.id);

  sessionStorage.setItem(
    "registeredTrialIds",
    JSON.stringify(registeredIds)
  );
}


/* ================= FILTER OPTIONS ================= */

function populateStateFilter() {
  const states = [
    ...new Set(
      trials.map((trial) => trial.state)
    )
  ].sort();

  states.forEach((state) => {
    const option =
      document.createElement("option");

    option.value = state;
    option.textContent = state;

    stateFilter.appendChild(option);
  });
}


/* ================= RENDER ================= */

function renderTrials() {
  const filteredTrials = getFilteredTrials();

  trialsGrid.innerHTML = "";

  filteredTrials.forEach((trial) => {
    trialsGrid.appendChild(
      createTrialCard(trial)
    );
  });

  const hasResults =
    filteredTrials.length > 0;

  trialsGrid.hidden = !hasResults;
  emptyState.hidden = hasResults;

  resultCount.textContent =
    `${filteredTrials.length} ${
      filteredTrials.length === 1
        ? "opportunity"
        : "opportunities"
    } found`;

  updateStatistics();
}


function createTrialCard(trial) {
  const article =
    document.createElement("article");

  article.className = "trial-card";

  article.innerHTML = `
    <div class="trial-card-banner">

      <span class="trial-card-type">
        ${escapeHtml(trial.type.toUpperCase())}
      </span>

      <h3>
        ${escapeHtml(trial.title)}
      </h3>

      <p class="trial-location">
        ${escapeHtml(trial.city)}, ${escapeHtml(trial.state)}
      </p>

    </div>

    <div class="trial-card-body">

      <div class="trial-meta-grid">

        <div class="trial-meta-item">
          <span>Date</span>
          <strong>${formatDate(trial.date)}</strong>
        </div>

        <div class="trial-meta-item">
          <span>Age Group</span>
          <strong>${escapeHtml(trial.ageCategory)}</strong>
        </div>

        <div class="trial-meta-item">
          <span>Venue</span>
          <strong>${escapeHtml(trial.venue)}</strong>
        </div>

        <div class="trial-meta-item">
          <span>Entry Fee</span>
          <strong>${escapeHtml(trial.fee)}</strong>
        </div>

      </div>

      <div class="trial-card-status">

        <span class="status-badge ${getStatusClass(trial)}">
          ${
            trial.registered
              ? "Registered"
              : escapeHtml(trial.status)
          }
        </span>

        <span class="trial-deadline">
          Closes ${formatShortDate(trial.deadline)}
        </span>

      </div>

      <div class="trial-card-actions">

        <button
          type="button"
          class="details-button"
          data-details-id="${trial.id}"
        >
          View Details
        </button>

        <button
          type="button"
          class="quick-register-button"
          data-register-id="${trial.id}"
          ${
            trial.registered ||
            trial.status === "Invite Only"
              ? "disabled"
              : ""
          }
        >
          ${
            trial.registered
              ? "Registered"
              : trial.status === "Invite Only"
                ? "Invite Required"
                : "Register"
          }
        </button>

      </div>

    </div>
  `;

  return article;
}


function getStatusClass(trial) {
  if (trial.registered) {
    return "registered-badge";
  }

  if (trial.status === "Closing Soon") {
    return "status-closing";
  }

  if (trial.status === "Invite Only") {
    return "status-invite";
  }

  return "status-open";
}


/* ================= FILTERING ================= */

function getFilteredTrials() {
  const searchTerm =
    trialSearchInput.value
      .trim()
      .toLowerCase();

  return trials.filter((trial) => {
    const searchContent = [
      trial.title,
      trial.type,
      trial.state,
      trial.city,
      trial.venue
    ]
      .join(" ")
      .toLowerCase();

    const matchesSearch =
      !searchTerm ||
      searchContent.includes(searchTerm);

    const matchesState =
      stateFilter.value === "all" ||
      trial.state === stateFilter.value;

    const matchesType =
      trialTypeFilter.value === "all" ||
      trial.type === trialTypeFilter.value;

    const matchesAge =
      ageFilter.value === "all" ||
      trial.ageCategory === ageFilter.value;

    const matchesStatus =
      statusFilter.value === "all" ||
      trial.status === statusFilter.value;

    return (
      matchesSearch &&
      matchesState &&
      matchesType &&
      matchesAge &&
      matchesStatus
    );
  });
}


function clearFilters() {
  trialSearchInput.value = "";
  stateFilter.value = "all";
  trialTypeFilter.value = "all";
  ageFilter.value = "all";
  statusFilter.value = "all";

  renderTrials();
}


/* ================= STATISTICS ================= */

function updateStatistics() {
  const openTrials = trials.filter(
    (trial) =>
      trial.status === "Open" ||
      trial.status === "Closing Soon"
  );

  const registeredTrials = trials.filter(
    (trial) => trial.registered
  );

  openTrialCount.textContent =
    String(openTrials.length);

  registeredTrialCount.textContent =
    String(registeredTrials.length);
}


/* ================= MODAL ================= */

function openTrialModal(trialId) {
  const trial = trials.find(
    (item) => item.id === trialId
  );

  if (!trial) {
    return;
  }

  selectedTrialId = trial.id;

  setText("modalTrialType", trial.type.toUpperCase());
  setText("modalTrialTitle", trial.title);
  setText(
    "modalTrialLocation",
    `${trial.venue}, ${trial.city}, ${trial.state}`
  );

  setText("modalTrialDate", formatDate(trial.date));
  setText("modalTrialAge", trial.ageCategory);
  setText(
    "modalTrialDeadline",
    formatDate(trial.deadline)
  );

  setText("modalTrialFee", trial.fee);
  setText(
    "modalTrialDescription",
    trial.description
  );

  populateList(
    "modalEligibilityList",
    trial.eligibility
  );

  populateList(
    "modalRequirementsList",
    trial.requirements
  );

  modalMessage.hidden = true;
  modalMessage.className = "modal-message";
  modalMessage.textContent = "";

  updateModalRegisterButton(trial);

  trialModal.hidden = false;
  document.body.classList.add("modal-open");

  modalCloseButton.focus();
}


function closeTrialModal() {
  trialModal.hidden = true;
  document.body.classList.remove("modal-open");

  selectedTrialId = null;
}


function updateModalRegisterButton(trial) {
  registerTrialButton.disabled = false;
  registerTrialButton.classList.remove("loading");

  const label =
    registerTrialButton.querySelector(
      ".button-label"
    );

  if (trial.registered) {
    label.textContent = "Already Registered";
    registerTrialButton.disabled = true;
    return;
  }

  if (trial.status === "Invite Only") {
    label.textContent = "Invitation Required";
    registerTrialButton.disabled = true;
    return;
  }

  label.textContent = "Register for Trial";
}


function populateList(elementId, items) {
  const list =
    document.getElementById(elementId);

  list.innerHTML = "";

  items.forEach((item) => {
    const listItem =
      document.createElement("li");

    listItem.textContent = item;
    list.appendChild(listItem);
  });
}


/* ================= REGISTRATION ================= */

async function registerForTrial(trialId) {
  const trial = trials.find(
    (item) => item.id === trialId
  );

  if (
    !trial ||
    trial.registered ||
    trial.status === "Invite Only"
  ) {
    return;
  }

  setRegisterLoading(true);

  try {
    /*
      BACKEND INTEGRATION PLACEHOLDER

      Suggested endpoint:

      POST /api/v1/player/trials/${trial.id}/register

      const response = await fetch(
        `/api/v1/player/trials/${trial.id}/register`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json"
          }
        }
      );

      if (!response.ok) {
        throw new Error("Trial registration failed.");
      }

      SECURITY REQUIREMENTS:
      - Authenticate the player on the server.
      - Verify player eligibility.
      - Prevent duplicate registrations.
      - Validate registration deadlines.
      - Apply rate limiting.
      - Do not trust trial IDs from the client.
    */

    await new Promise((resolve) => {
      window.setTimeout(resolve, 900);
    });

    trial.registered = true;

    saveRegisteredTrials();
    renderTrials();

    modalMessage.textContent =
      "Registration successful. This trial has been added to your player dashboard.";

    modalMessage.className =
      "modal-message success";

    modalMessage.hidden = false;

    updateModalRegisterButton(trial);

  } catch (error) {
    console.error(
      "Trial registration error:",
      error
    );

    modalMessage.textContent =
      "We could not complete your registration. Please try again.";

    modalMessage.className =
      "modal-message error";

    modalMessage.hidden = false;

  } finally {
    setRegisterLoading(false);
  }
}


function setRegisterLoading(isLoading) {
  registerTrialButton.classList.toggle(
    "loading",
    isLoading
  );

  registerTrialButton.disabled = isLoading;

  const label =
    registerTrialButton.querySelector(
      ".button-label"
    );

  if (isLoading) {
    label.textContent = "Registering...";
  }
}


/* ================= EVENTS ================= */

trialsGrid.addEventListener("click", (event) => {
  const detailsButton =
    event.target.closest("[data-details-id]");

  const registerButton =
    event.target.closest("[data-register-id]");

  if (detailsButton) {
    openTrialModal(
      Number(detailsButton.dataset.detailsId)
    );

    return;
  }

  if (registerButton) {
    openTrialModal(
      Number(registerButton.dataset.registerId)
    );
  }
});


registerTrialButton.addEventListener(
  "click",
  () => {
    if (selectedTrialId !== null) {
      registerForTrial(selectedTrialId);
    }
  }
);


modalCloseButton.addEventListener(
  "click",
  closeTrialModal
);

modalCancelButton.addEventListener(
  "click",
  closeTrialModal
);


trialModal.addEventListener("click", (event) => {
  if (event.target === trialModal) {
    closeTrialModal();
  }
});


document.addEventListener("keydown", (event) => {
  if (
    event.key === "Escape" &&
    !trialModal.hidden
  ) {
    closeTrialModal();
  }
});


[
  trialSearchInput,
  stateFilter,
  trialTypeFilter,
  ageFilter,
  statusFilter
].forEach((control) => {
  control.addEventListener(
    control.tagName === "INPUT"
      ? "input"
      : "change",
    renderTrials
  );
});


clearFilterButton.addEventListener(
  "click",
  clearFilters
);

emptyClearButton.addEventListener(
  "click",
  clearFilters
);


/* ================= HELPERS ================= */

function setText(elementId, value) {
  const element =
    document.getElementById(elementId);

  if (element) {
    element.textContent = value;
  }
}


function formatDate(dateValue) {
  const date =
    new Date(`${dateValue}T00:00:00`);

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric"
  }).format(date);
}


function formatShortDate(dateValue) {
  const date =
    new Date(`${dateValue}T00:00:00`);

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short"
  }).format(date);
}


function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}


/* ================= INITIALISE ================= */

function initialiseTrialsPage() {
  loadRegisteredTrials();
  populateStateFilter();
  renderTrials();
}

initialiseTrialsPage();