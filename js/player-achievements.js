"use strict";

/* =========================================================
   FIFA MISSION INDIA - PLAYER ACHIEVEMENTS
   Frontend demonstration only
========================================================= */

const badgeGrid =
  document.getElementById("badgeGrid");

const certificateGrid =
  document.getElementById("certificateGrid");

const milestoneTimeline =
  document.getElementById("milestoneTimeline");

const badgeFilterButtons =
  document.querySelectorAll(".badge-filter");

const certificateModal =
  document.getElementById("certificateModal");

const certificateModalCloseButton =
  document.getElementById(
    "certificateModalCloseButton"
  );

const certificateCloseButton =
  document.getElementById(
    "certificateCloseButton"
  );

const downloadCertificateButton =
  document.getElementById(
    "downloadCertificateButton"
  );

const certificateModalMessage =
  document.getElementById(
    "certificateModalMessage"
  );

let activeBadgeFilter = "all";
let selectedCertificateId = null;


/* ================= PLAYER DATA ================= */

const defaultPlayerData = {
  firstName: "Player",
  lastName: "Name"
};


/* ================= BADGES ================= */

const badges = [
  {
    id: 1,
    title: "Profile Pioneer",
    description:
      "Completed the essential player profile information.",
    icon: "✓",
    status: "earned",
    awardedDate: "2026-06-18",
    points: 100,
    tier: "standard"
  },
  {
    id: 2,
    title: "Trial Explorer",
    description:
      "Registered for the first verified football trial.",
    icon: "⚽",
    status: "earned",
    awardedDate: "2026-07-03",
    points: 150,
    tier: "standard"
  },
  {
    id: 3,
    title: "Rising Performer",
    description:
      "Achieved a player performance score above 75.",
    icon: "↗",
    status: "earned",
    awardedDate: "2026-07-12",
    points: 250,
    tier: "gold"
  },
  {
    id: 4,
    title: "Development Focus",
    description:
      "Created three active player development goals.",
    icon: "◎",
    status: "earned",
    awardedDate: "2026-07-14",
    points: 120,
    tier: "standard"
  },
  {
    id: 5,
    title: "Elite Performer",
    description:
      "Reach an overall performance score of 90 or above.",
    icon: "★",
    status: "locked",
    awardedDate: "",
    points: 500,
    tier: "gold"
  },
  {
    id: 6,
    title: "National Prospect",
    description:
      "Receive an invitation to a national scouting camp.",
    icon: "🇮🇳",
    status: "locked",
    awardedDate: "",
    points: 750,
    tier: "gold"
  },
  {
    id: 7,
    title: "Consistency Champion",
    description:
      "Complete six consecutive monthly assessments.",
    icon: "🏅",
    status: "locked",
    awardedDate: "",
    points: 400,
    tier: "gold"
  },
  {
    id: 8,
    title: "Community Leader",
    description:
      "Support and encourage other players on the platform.",
    icon: "🤝",
    status: "locked",
    awardedDate: "",
    points: 300,
    tier: "standard"
  }
];


/* ================= CERTIFICATES ================= */

const certificates = [
  {
    id: 1,
    title: "Technical Skills Assessment",
    description:
      "For successfully completing the FIFA Mission India technical football assessment.",
    awardDate: "2026-07-12",
    reference: "FMI-TSA-2026-00182",
    type: "Performance Assessment"
  },
  {
    id: 2,
    title: "Grassroots Development Camp",
    description:
      "For active participation in the regional grassroots football development programme.",
    awardDate: "2026-06-28",
    reference: "FMI-GDC-2026-00419",
    type: "Development Programme"
  },
  {
    id: 3,
    title: "Player Registration",
    description:
      "Official recognition as a verified registered player on FIFA Mission India.",
    awardDate: "2026-06-18",
    reference: "FMI-REG-2026-482193",
    type: "Player Verification"
  }
];


/* ================= MILESTONES ================= */

const milestones = [
  {
    id: 1,
    title: "Registered on FIFA Mission India",
    description:
      "Completed player registration and mobile verification.",
    date: "2026-06-18",
    icon: "✓"
  },
  {
    id: 2,
    title: "Player profile completed",
    description:
      "Added personal information, football profile and playing details.",
    date: "2026-06-21",
    icon: "◉"
  },
  {
    id: 3,
    title: "First trial registration",
    description:
      "Registered for the Northeast Regional Talent Trial.",
    date: "2026-07-03",
    icon: "⚽"
  },
  {
    id: 4,
    title: "First performance assessment",
    description:
      "Completed technical, physical and tactical assessment.",
    date: "2026-07-12",
    icon: "↗"
  },
  {
    id: 5,
    title: "Performance score reached 78",
    description:
      "Earned the Rising Performer achievement badge.",
    date: "2026-07-12",
    icon: "🏆"
  }
];


/* ================= INITIALISE ================= */

function initialiseAchievementsPage() {
  renderBadges();
  renderCertificates();
  renderMilestones();
  updateSummary();
}


/* ================= SUMMARY ================= */

function updateSummary() {
  const earnedBadges = badges.filter(
    (badge) => badge.status === "earned"
  );

  const points = earnedBadges.reduce(
    (total, badge) => total + badge.points,
    0
  );

  setText(
    "totalAchievements",
    String(
      earnedBadges.length +
      certificates.length
    )
  );

  setText(
    "earnedBadgeCount",
    String(earnedBadges.length)
  );

  setText(
    "certificateCount",
    String(certificates.length)
  );

  setText(
    "achievementPoints",
    String(points)
  );
}


/* ================= RENDER BADGES ================= */

function renderBadges() {
  badgeGrid.innerHTML = "";

  const filteredBadges = badges.filter(
    (badge) =>
      activeBadgeFilter === "all" ||
      badge.status === activeBadgeFilter
  );

  filteredBadges.forEach((badge) => {
    const card =
      document.createElement("article");

    card.className = [
      "badge-card",
      badge.status === "locked"
        ? "locked"
        : "",
      badge.tier === "gold"
        ? "gold"
        : ""
    ]
      .filter(Boolean)
      .join(" ");

    card.innerHTML = `
      <div class="badge-medal">
        ${escapeHtml(badge.icon)}
      </div>

      <h3>
        ${escapeHtml(badge.title)}
      </h3>

      <p>
        ${escapeHtml(badge.description)}
      </p>

      <div class="badge-meta">

        <span class="badge-status">
          ${
            badge.status === "earned"
              ? `Earned ${formatShortDate(
                  badge.awardedDate
                )}`
              : "Not Yet Earned"
          }
        </span>

        <span class="badge-points">
          ${badge.points} Points
        </span>

      </div>
    `;

    badgeGrid.appendChild(card);
  });
}


/* ================= RENDER CERTIFICATES ================= */

function renderCertificates() {
  certificateGrid.innerHTML = "";

  certificates.forEach((certificate) => {
    const card =
      document.createElement("article");

    card.className = "certificate-card";

    card.innerHTML = `
      <div class="certificate-thumbnail">

        <span>
          ${escapeHtml(
            certificate.type.toUpperCase()
          )}
        </span>

        <h3>
          ${escapeHtml(certificate.title)}
        </h3>

        <p>
          Awarded ${formatDate(
            certificate.awardDate
          )}
        </p>

      </div>

      <div class="certificate-card-body">

        <div class="certificate-information">

          <div>

            <span>
              Certificate ID
            </span>

            <strong>
              ${escapeHtml(certificate.reference)}
            </strong>

          </div>

          <span class="certificate-verified">
            Verified
          </span>

        </div>

        <div class="certificate-actions">

          <button
            type="button"
            class="preview-certificate-button"
            data-preview-certificate="${
              certificate.id
            }"
          >
            Preview
          </button>

          <button
            type="button"
            class="download-certificate-button"
            data-download-certificate="${
              certificate.id
            }"
          >
            Download
          </button>

        </div>

      </div>
    `;

    certificateGrid.appendChild(card);
  });
}


/* ================= RENDER MILESTONES ================= */

function renderMilestones() {
  milestoneTimeline.innerHTML = "";

  const sortedMilestones = [...milestones]
    .sort(
      (first, second) =>
        new Date(second.date) -
        new Date(first.date)
    );

  sortedMilestones.forEach((milestone) => {
    const item =
      document.createElement("article");

    item.className = "milestone-item";

    item.innerHTML = `
      <div class="milestone-marker">
        ${escapeHtml(milestone.icon)}
      </div>

      <div class="milestone-content">

        <div class="milestone-heading">

          <h3>
            ${escapeHtml(milestone.title)}
          </h3>

          <span>
            ${formatDate(milestone.date)}
          </span>

        </div>

        <p>
          ${escapeHtml(milestone.description)}
        </p>

      </div>
    `;

    milestoneTimeline.appendChild(item);
  });
}


/* ================= FILTER EVENTS ================= */

badgeFilterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    activeBadgeFilter =
      button.dataset.badgeFilter;

    badgeFilterButtons.forEach(
      (filterButton) => {
        filterButton.classList.toggle(
          "active",
          filterButton === button
        );
      }
    );

    renderBadges();
  });
});


/* ================= CERTIFICATE MODAL ================= */

function openCertificateModal(certificateId) {
  const certificate = certificates.find(
    (item) => item.id === certificateId
  );

  if (!certificate) {
    return;
  }

  selectedCertificateId = certificate.id;

  const player = getPlayerData();

  const fullName =
    `${player.firstName || ""} ${
      player.lastName || ""
    }`.trim() || "Player Name";

  setText(
    "certificateModalTitle",
    certificate.title
  );

  setText(
    "certificatePlayerName",
    fullName
  );

  setText(
    "certificateDescription",
    certificate.description
  );

  setText(
    "certificateAwardDate",
    formatDate(certificate.awardDate)
  );

  setText(
    "certificateReference",
    certificate.reference
  );

  certificateModalMessage.hidden = true;
  certificateModalMessage.textContent = "";

  certificateModal.hidden = false;

  document.body.classList.add("modal-open");

  certificateModalCloseButton.focus();
}


function closeCertificateModal() {
  certificateModal.hidden = true;

  document.body.classList.remove("modal-open");

  selectedCertificateId = null;
}


function getPlayerData() {
  const storedData =
    sessionStorage.getItem(
      "playerDashboardData"
    );

  if (!storedData) {
    return defaultPlayerData;
  }

  try {
    return {
      ...defaultPlayerData,
      ...JSON.parse(storedData)
    };
  } catch (error) {
    console.error(
      "Unable to read player data:",
      error
    );

    return defaultPlayerData;
  }
}


/* ================= CERTIFICATE DOWNLOAD ================= */

function downloadCertificate(certificateId) {
  const certificate = certificates.find(
    (item) => item.id === certificateId
  );

  if (!certificate) {
    return;
  }

  /*
    BACKEND INTEGRATION PLACEHOLDER

    Suggested endpoint:

    GET /api/v1/players/me/certificates/${certificate.id}/download

    The backend should:

    - Authenticate the player.
    - Verify certificate ownership.
    - Generate or return the official PDF.
    - Use a secure temporary download URL.
    - Prevent access to another player's certificate.
    - Record certificate download activity.
  */

  certificateModalMessage.textContent =
    "Certificate download will be connected when the secure PDF service is ready.";

  certificateModalMessage.hidden = false;

  console.info(
    "Certificate download requested:",
    certificate.reference
  );
}


/* ================= CARD EVENTS ================= */

certificateGrid.addEventListener(
  "click",
  (event) => {
    const previewButton =
      event.target.closest(
        "[data-preview-certificate]"
      );

    const downloadButton =
      event.target.closest(
        "[data-download-certificate]"
      );

    if (previewButton) {
      openCertificateModal(
        Number(
          previewButton.dataset
            .previewCertificate
        )
      );

      return;
    }

    if (downloadButton) {
      const certificateId = Number(
        downloadButton.dataset
          .downloadCertificate
      );

      openCertificateModal(certificateId);

      window.setTimeout(() => {
        downloadCertificate(certificateId);
      }, 250);
    }
  }
);


downloadCertificateButton.addEventListener(
  "click",
  () => {
    if (selectedCertificateId !== null) {
      downloadCertificate(
        selectedCertificateId
      );
    }
  }
);


certificateModalCloseButton.addEventListener(
  "click",
  closeCertificateModal
);

certificateCloseButton.addEventListener(
  "click",
  closeCertificateModal
);


certificateModal.addEventListener(
  "click",
  (event) => {
    if (event.target === certificateModal) {
      closeCertificateModal();
    }
  }
);


document.addEventListener(
  "keydown",
  (event) => {
    if (
      event.key === "Escape" &&
      !certificateModal.hidden
    ) {
      closeCertificateModal();
    }
  }
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

  if (Number.isNaN(date.getTime())) {
    return "Not available";
  }

  return new Intl.DateTimeFormat(
    "en-IN",
    {
      day: "2-digit",
      month: "long",
      year: "numeric"
    }
  ).format(date);
}


function formatShortDate(dateValue) {
  const date =
    new Date(`${dateValue}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return "";
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


initialiseAchievementsPage();