"use strict";

/* =========================================================
   FIFA MISSION INDIA - PLAYER PERFORMANCE
   Frontend demonstration only
========================================================= */

const performanceSummaryGrid =
  document.getElementById("performanceSummaryGrid");

const performanceChart =
  document.getElementById("performanceChart");

const chartLabels =
  document.getElementById("chartLabels");

const breakdownList =
  document.getElementById("breakdownList");

const assessmentList =
  document.getElementById("assessmentList");

const performancePeriod =
  document.getElementById("performancePeriod");

const goalList =
  document.getElementById("goalList");

const addGoalButton =
  document.getElementById("addGoalButton");

const goalModal =
  document.getElementById("goalModal");

const goalModalCloseButton =
  document.getElementById("goalModalCloseButton");

const goalCancelButton =
  document.getElementById("goalCancelButton");

const goalForm =
  document.getElementById("goalForm");

const goalTargetDate =
  document.getElementById("goalTargetDate");


/* ================= DEMONSTRATION DATA ================= */

const performanceData = {
  month: {
    overallScore: 78,
    change: 6,

    categories: [
      {
        name: "Technical Ability",
        icon: "⚽",
        score: 82,
        change: 5
      },
      {
        name: "Physical Fitness",
        icon: "↗",
        score: 74,
        change: 3
      },
      {
        name: "Tactical Awareness",
        icon: "◎",
        score: 76,
        change: 7
      },
      {
        name: "Discipline",
        icon: "✓",
        score: 88,
        change: 2
      }
    ],

    trend: [
      {
        label: "Feb",
        score: 61
      },
      {
        label: "Mar",
        score: 65
      },
      {
        label: "Apr",
        score: 69
      },
      {
        label: "May",
        score: 71
      },
      {
        label: "Jun",
        score: 74
      },
      {
        label: "Jul",
        score: 78
      }
    ]
  },

  quarter: {
    overallScore: 78,
    change: 9,

    categories: [
      {
        name: "Technical Ability",
        icon: "⚽",
        score: 82,
        change: 8
      },
      {
        name: "Physical Fitness",
        icon: "↗",
        score: 74,
        change: 6
      },
      {
        name: "Tactical Awareness",
        icon: "◎",
        score: 76,
        change: 10
      },
      {
        name: "Discipline",
        icon: "✓",
        score: 88,
        change: 4
      }
    ],

    trend: [
      {
        label: "May W1",
        score: 66
      },
      {
        label: "May W3",
        score: 68
      },
      {
        label: "Jun W1",
        score: 71
      },
      {
        label: "Jun W3",
        score: 74
      },
      {
        label: "Jul W1",
        score: 76
      },
      {
        label: "Jul W3",
        score: 78
      }
    ]
  },

  year: {
    overallScore: 78,
    change: 17,

    categories: [
      {
        name: "Technical Ability",
        icon: "⚽",
        score: 82,
        change: 18
      },
      {
        name: "Physical Fitness",
        icon: "↗",
        score: 74,
        change: 13
      },
      {
        name: "Tactical Awareness",
        icon: "◎",
        score: 76,
        change: 19
      },
      {
        name: "Discipline",
        icon: "✓",
        score: 88,
        change: 8
      }
    ],

    trend: [
      {
        label: "Jan",
        score: 58
      },
      {
        label: "Mar",
        score: 63
      },
      {
        label: "Apr",
        score: 67
      },
      {
        label: "May",
        score: 71
      },
      {
        label: "Jun",
        score: 74
      },
      {
        label: "Jul",
        score: 78
      }
    ]
  }
};


const assessments = [
  {
    id: 1,
    title: "Technical Skills Assessment",
    description:
      "Passing, first touch, ball control and shooting evaluation.",
    type: "Technical",
    score: 82,
    date: "2026-07-12"
  },
  {
    id: 2,
    title: "Physical Fitness Review",
    description:
      "Speed, stamina, agility and strength assessment.",
    type: "Physical",
    score: 74,
    date: "2026-07-05"
  },
  {
    id: 3,
    title: "Tactical Awareness Test",
    description:
      "Positioning, decision-making and game understanding.",
    type: "Tactical",
    score: 76,
    date: "2026-06-28"
  }
];


const defaultGoals = [
  {
    id: 1,
    title: "Improve passing accuracy",
    category: "Technical",
    targetDate: "2026-08-30",
    progress: 68
  },
  {
    id: 2,
    title: "Increase match stamina",
    category: "Physical",
    targetDate: "2026-09-15",
    progress: 52
  },
  {
    id: 3,
    title: "Improve defensive positioning",
    category: "Tactical",
    targetDate: "2026-09-30",
    progress: 41
  }
];

let goals = [];


/* ================= INITIALISE ================= */

function initialisePerformancePage() {
  loadGoals();
  setMinimumGoalDate();
  renderPerformance();
  renderAssessments();
  renderGoals();
}


/* ================= PERFORMANCE ================= */

function renderPerformance() {
  const selectedData =
    performanceData[performancePeriod.value];

  setText(
    "heroPerformanceScore",
    String(selectedData.overallScore)
  );

  setText(
    "heroPerformanceChange",
    `+${selectedData.change} points this period`
  );

  renderSummaryCards(selectedData.categories);
  renderBreakdown(selectedData.categories);
  renderChart(selectedData.trend);
}


function renderSummaryCards(categories) {
  performanceSummaryGrid.innerHTML = "";

  categories.forEach((category) => {
    const card =
      document.createElement("article");

    card.className = "summary-card";

    card.innerHTML = `
      <div class="summary-card-heading">

        <div class="summary-icon">
          ${escapeHtml(category.icon)}
        </div>

        <span class="summary-change">
          +${category.change}
        </span>

      </div>

      <span>
        ${escapeHtml(category.name)}
      </span>

      <div class="summary-score">

        <strong>
          ${category.score}
        </strong>

        <small>
          /100
        </small>

      </div>

      <div class="summary-track">

        <span
          style="width: ${category.score}%"
        ></span>

      </div>
    `;

    performanceSummaryGrid.appendChild(card);
  });
}


function renderBreakdown(categories) {
  breakdownList.innerHTML = "";

  categories.forEach((category) => {
    const item =
      document.createElement("div");

    item.className = "breakdown-item";

    item.innerHTML = `
      <div class="breakdown-item-heading">

        <span>
          ${escapeHtml(category.name)}
        </span>

        <strong>
          ${category.score}%
        </strong>

      </div>

      <div class="breakdown-track">

        <span
          style="width: ${category.score}%"
        ></span>

      </div>
    `;

    breakdownList.appendChild(item);
  });
}


function renderChart(trend) {
  performanceChart.innerHTML = "";
  chartLabels.innerHTML = "";

  trend.forEach((item) => {
    const column =
      document.createElement("div");

    column.className = "chart-column";

    const bar =
      document.createElement("div");

    bar.className = "chart-bar";
    bar.style.height = `${item.score}%`;
    bar.dataset.score = `${item.score}/100`;

    column.appendChild(bar);
    performanceChart.appendChild(column);

    const label =
      document.createElement("span");

    label.textContent = item.label;
    chartLabels.appendChild(label);
  });
}


/* ================= ASSESSMENTS ================= */

function renderAssessments() {
  assessmentList.innerHTML = "";

  assessments.forEach((assessment) => {
    const item =
      document.createElement("article");

    item.className = "assessment-item";

    item.innerHTML = `
      <div class="assessment-score">
        ${assessment.score}
      </div>

      <div class="assessment-details">

        <h4>
          ${escapeHtml(assessment.title)}
        </h4>

        <p>
          ${escapeHtml(assessment.description)}
        </p>

      </div>

      <span class="assessment-type">
        ${escapeHtml(assessment.type)}
      </span>

      <span class="assessment-date-text">
        ${formatDate(assessment.date)}
      </span>
    `;

    assessmentList.appendChild(item);
  });
}


/* ================= GOALS ================= */

function loadGoals() {
  const savedGoals =
    sessionStorage.getItem("playerDevelopmentGoals");

  if (!savedGoals) {
    goals = [...defaultGoals];
    return;
  }

  try {
    goals = JSON.parse(savedGoals);
  } catch (error) {
    console.error(
      "Unable to load development goals:",
      error
    );

    goals = [...defaultGoals];
  }
}


function saveGoals() {
  sessionStorage.setItem(
    "playerDevelopmentGoals",
    JSON.stringify(goals)
  );
}


function renderGoals() {
  goalList.innerHTML = "";

  if (goals.length === 0) {
    goalList.innerHTML = `
      <div class="empty-goals">
        No development goals added yet.
      </div>
    `;

    return;
  }

  goals.forEach((goal) => {
    const item =
      document.createElement("article");

    item.className = "goal-item";

    item.innerHTML = `
      <div class="goal-heading">

        <h4>
          ${escapeHtml(goal.title)}
        </h4>

        <span>
          ${escapeHtml(goal.category)}
        </span>

      </div>

      <div class="goal-progress-row">

        <div class="goal-track">

          <span
            style="width: ${goal.progress}%"
          ></span>

        </div>

        <strong>
          ${goal.progress}%
        </strong>

      </div>

      <div class="goal-footer">

        <span>
          Target: ${formatDate(goal.targetDate)}
        </span>

        <span>
          In progress
        </span>

      </div>
    `;

    goalList.appendChild(item);
  });
}


/* ================= GOAL MODAL ================= */

function openGoalModal() {
  goalModal.hidden = false;
  document.body.classList.add("modal-open");

  document.getElementById("goalTitle").focus();
}


function closeGoalModal() {
  goalModal.hidden = true;
  document.body.classList.remove("modal-open");

  goalForm.reset();
  clearGoalErrors();
}


function setMinimumGoalDate() {
  const tomorrow = new Date();

  tomorrow.setDate(tomorrow.getDate() + 1);

  goalTargetDate.min =
    tomorrow.toISOString().split("T")[0];
}


goalForm.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!validateGoalForm()) {
    return;
  }

  const newGoal = {
    id: Date.now(),
    title:
      document
        .getElementById("goalTitle")
        .value
        .trim(),

    category:
      document
        .getElementById("goalCategory")
        .value,

    targetDate:
      document
        .getElementById("goalTargetDate")
        .value,

    progress: 0
  };

  /*
    BACKEND INTEGRATION PLACEHOLDER

    Suggested endpoint:

    POST /api/v1/players/me/development-goals

    The backend should:
    - Authenticate the player.
    - Validate the goal fields.
    - Apply length limits.
    - Store the goal against the authenticated player.
  */

  goals.unshift(newGoal);

  saveGoals();
  renderGoals();
  closeGoalModal();
});


function validateGoalForm() {
  const fields = Array.from(
    goalForm.querySelectorAll(
      "input, select"
    )
  );

  let isValid = true;

  fields.forEach((field) => {
    clearGoalFieldError(field);

    if (!field.value.trim()) {
      setGoalFieldError(
        field,
        "This field is required."
      );

      isValid = false;
    }
  });

  if (
    goalTargetDate.value &&
    new Date(`${goalTargetDate.value}T00:00:00`) <=
      new Date()
  ) {
    setGoalFieldError(
      goalTargetDate,
      "Select a future target date."
    );

    isValid = false;
  }

  if (!isValid) {
    goalForm
      .querySelector('[aria-invalid="true"]')
      ?.focus();
  }

  return isValid;
}


function setGoalFieldError(field, message) {
  const group =
    field.closest(".form-group");

  group.classList.add("invalid");

  group.querySelector(
    ".error-message"
  ).textContent = message;

  field.setAttribute(
    "aria-invalid",
    "true"
  );
}


function clearGoalFieldError(field) {
  const group =
    field.closest(".form-group");

  group.classList.remove("invalid");

  group.querySelector(
    ".error-message"
  ).textContent = "";

  field.removeAttribute("aria-invalid");
}


function clearGoalErrors() {
  goalForm
    .querySelectorAll("input, select")
    .forEach(clearGoalFieldError);
}


/* ================= EVENTS ================= */

performancePeriod.addEventListener(
  "change",
  () => {
    /*
      BACKEND INTEGRATION PLACEHOLDER

      GET /api/v1/players/me/performance
          ?period=month
    */

    renderPerformance();
  }
);


addGoalButton.addEventListener(
  "click",
  openGoalModal
);

goalModalCloseButton.addEventListener(
  "click",
  closeGoalModal
);

goalCancelButton.addEventListener(
  "click",
  closeGoalModal
);


goalModal.addEventListener(
  "click",
  (event) => {
    if (event.target === goalModal) {
      closeGoalModal();
    }
  }
);


goalForm.addEventListener(
  "input",
  (event) => {
    if (
      event.target.matches(
        "input, select"
      )
    ) {
      clearGoalFieldError(
        event.target
      );
    }
  }
);


document.addEventListener(
  "keydown",
  (event) => {
    if (
      event.key === "Escape" &&
      !goalModal.hidden
    ) {
      closeGoalModal();
    }
  }
);


document
  .getElementById("viewAllAssessmentsButton")
  .addEventListener("click", () => {
    window.alert(
      "The complete assessment history page will be connected later."
    );
  });


document
  .getElementById("assessmentDetailsButton")
  .addEventListener("click", () => {
    window.alert(
      "Assessment details and attendance confirmation will be connected later."
    );
  });


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

  if (Number.isNaN(date.getTime())) {
    return "Not available";
  }

  return new Intl.DateTimeFormat(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric"
    }
  ).format(date);
}


function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}


initialisePerformancePage();