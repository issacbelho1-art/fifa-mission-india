"use strict";

/* =========================================================
   FIFA MISSION INDIA
   PLAYER DOCUMENTS & VERIFICATION

   Frontend demonstration only.

   Backend responsibilities for Mr. Harsh:
   - Authenticate the player.
   - Return only documents owned by the logged-in player.
   - Validate file type and size on the server.
   - Scan uploaded files for malware.
   - Store files securely.
   - Generate protected preview and download URLs.
   - Record verification history.
========================================================= */


/* ================= ELEMENTS ================= */

const documentsList =
  document.getElementById("documentsList");

const openUploadModalButton =
  document.getElementById("openUploadModalButton");

const uploadModal =
  document.getElementById("uploadModal");

const closeUploadModalButton =
  document.getElementById("closeUploadModalButton");

const cancelUploadButton =
  document.getElementById("cancelUploadButton");

const documentUploadForm =
  document.getElementById("documentUploadForm");

const documentTypeInput =
  document.getElementById("documentType");

const documentFileInput =
  document.getElementById("documentFile");

const selectedFileName =
  document.getElementById("selectedFileName");

const uploadMessage =
  document.getElementById("uploadMessage");

const verificationPercentage =
  document.getElementById("verificationPercentage");

const verificationProgressBar =
  document.getElementById("verificationProgressBar");

const totalDocumentCount =
  document.getElementById("totalDocumentCount");

const verifiedDocumentCount =
  document.getElementById("verifiedDocumentCount");

const pendingDocumentCount =
  document.getElementById("pendingDocumentCount");

const missingDocumentCount =
  document.getElementById("missingDocumentCount");


/* ================= SETTINGS ================= */

const allowedFileTypes = [
  "application/pdf",
  "image/jpeg",
  "image/png"
];

const maximumFileSize = 5 * 1024 * 1024;


/* ================= DEMO DOCUMENT DATA ================= */

const documents = [
  {
    id: "identity",
    title: "Identity Proof",
    description:
      "Aadhaar card, voter identity card or another government-issued identity document.",
    icon: "▣",
    required: true,
    status: "verified",
    fileName: "identity-proof.pdf",
    uploadedDate: "2026-07-04",
    verifiedDate: "2026-07-06"
  },
  {
    id: "birth-certificate",
    title: "Birth Certificate",
    description:
      "Official document confirming the player's name and date of birth.",
    icon: "◫",
    required: true,
    status: "verified",
    fileName: "birth-certificate.pdf",
    uploadedDate: "2026-07-04",
    verifiedDate: "2026-07-07"
  },
  {
    id: "player-photo",
    title: "Passport-size Photograph",
    description:
      "A recent, clear photograph with the player's face fully visible.",
    icon: "◉",
    required: true,
    status: "pending",
    fileName: "player-photo.jpg",
    uploadedDate: "2026-07-15",
    verifiedDate: ""
  },
  {
    id: "medical-certificate",
    title: "Medical Fitness Certificate",
    description:
      "A recent certificate confirming that the player is medically fit to participate.",
    icon: "✚",
    required: true,
    status: "missing",
    fileName: "",
    uploadedDate: "",
    verifiedDate: ""
  },
  {
    id: "football-record",
    title: "Football Registration Record",
    description:
      "Academy, club, district or state football registration proof, where applicable.",
    icon: "⚽",
    required: true,
    status: "missing",
    fileName: "",
    uploadedDate: "",
    verifiedDate: ""
  }
];


/* ================= INITIALISE ================= */

function initialiseDocumentsPage() {
  renderDocuments();
  updateVerificationSummary();
  registerEventListeners();
}

document.addEventListener(
  "DOMContentLoaded",
  initialiseDocumentsPage
);


/* ================= RENDER DOCUMENTS ================= */

function renderDocuments() {
  if (!documentsList) {
    return;
  }

  documentsList.innerHTML = "";

  documents.forEach((documentItem) => {
    const card = document.createElement("article");

    card.className = "document-item";

    card.dataset.documentId = documentItem.id;

    const statusText = getStatusText(
      documentItem.status
    );

    const statusClass = getStatusClass(
      documentItem.status
    );

    card.innerHTML = `
      <div class="document-icon" aria-hidden="true">
        ${escapeHtml(documentItem.icon)}
      </div>

      <div class="document-information">

        <div class="document-title-row">

          <div>

            <h3>
              ${escapeHtml(documentItem.title)}
            </h3>

            ${
              documentItem.required
                ? `
                  <span class="required-document-label">
                    Required
                  </span>
                `
                : ""
            }

          </div>

          <span class="document-status ${statusClass}">
            ${statusText}
          </span>

        </div>

        <p>
          ${escapeHtml(documentItem.description)}
        </p>

        ${renderDocumentMetadata(documentItem)}

      </div>

      <div class="document-actions">
        ${renderDocumentActions(documentItem)}
      </div>
    `;

    documentsList.appendChild(card);
  });
}


/* ================= DOCUMENT METADATA ================= */

function renderDocumentMetadata(documentItem) {
  if (documentItem.status === "missing") {
    return `
      <div class="document-meta">
        <span>
          No document submitted
        </span>
      </div>
    `;
  }

  return `
    <div class="document-meta">

      <span>
        File:
        <strong>
          ${escapeHtml(documentItem.fileName)}
        </strong>
      </span>

      <span>
        Uploaded:
        <strong>
          ${formatDate(documentItem.uploadedDate)}
        </strong>
      </span>

      ${
        documentItem.status === "verified"
          ? `
            <span>
              Verified:
              <strong>
                ${formatDate(
                  documentItem.verifiedDate
                )}
              </strong>
            </span>
          `
          : ""
      }

    </div>
  `;
}


/* ================= DOCUMENT ACTIONS ================= */

function renderDocumentActions(documentItem) {
  if (documentItem.status === "missing") {
    return `
      <button
        type="button"
        class="primary-document-action"
        data-upload-document="${escapeHtml(
          documentItem.id
        )}"
      >
        Upload
      </button>
    `;
  }

  return `
    <button
      type="button"
      class="secondary-document-action"
      data-preview-document="${escapeHtml(
        documentItem.id
      )}"
    >
      Preview
    </button>

    <button
      type="button"
      class="secondary-document-action"
      data-replace-document="${escapeHtml(
        documentItem.id
      )}"
    >
      Replace
    </button>
  `;
}


/* ================= SUMMARY ================= */

function updateVerificationSummary() {
  const total = documents.length;

  const verified = documents.filter(
    (documentItem) =>
      documentItem.status === "verified"
  ).length;

  const pending = documents.filter(
    (documentItem) =>
      documentItem.status === "pending"
  ).length;

  const missing = documents.filter(
    (documentItem) =>
      documentItem.status === "missing"
  ).length;

  const submitted = verified + pending;

  const percentage =
    total === 0
      ? 0
      : Math.round((submitted / total) * 100);

  setText(
    totalDocumentCount,
    String(total)
  );

  setText(
    verifiedDocumentCount,
    String(verified)
  );

  setText(
    pendingDocumentCount,
    String(pending)
  );

  setText(
    missingDocumentCount,
    String(missing)
  );

  setText(
    verificationPercentage,
    `${percentage}%`
  );

  if (verificationProgressBar) {
    verificationProgressBar.style.width =
      `${percentage}%`;
  }

  updateHeroProgressMessage(
    submitted,
    total
  );
}


/* ================= HERO MESSAGE ================= */

function updateHeroProgressMessage(
  submitted,
  total
) {
  const progressMessage =
    document.querySelector(
      ".hero-status-card small"
    );

  if (!progressMessage) {
    return;
  }

  progressMessage.textContent =
    `${submitted} of ${total} required documents submitted`;
}


/* ================= MODAL ================= */

function openUploadModal(documentId = "") {
  if (!uploadModal) {
    return;
  }

  resetUploadForm();

  if (documentId && documentTypeInput) {
    documentTypeInput.value = documentId;
  }

  uploadModal.hidden = false;

  document.body.classList.add("modal-open");

  window.setTimeout(() => {
    if (
      documentId &&
      documentFileInput
    ) {
      documentFileInput.focus();
    } else if (documentTypeInput) {
      documentTypeInput.focus();
    }
  }, 50);
}


function closeUploadModal() {
  if (!uploadModal) {
    return;
  }

  uploadModal.hidden = true;

  document.body.classList.remove(
    "modal-open"
  );

  resetUploadForm();

  if (openUploadModalButton) {
    openUploadModalButton.focus();
  }
}


/* ================= FORM ================= */

function resetUploadForm() {
  if (documentUploadForm) {
    documentUploadForm.reset();
  }

  if (selectedFileName) {
    selectedFileName.textContent =
      "No file selected";
  }

  hideUploadMessage();
}


function handleSelectedFile() {
  const file =
    documentFileInput?.files?.[0];

  if (!selectedFileName) {
    return;
  }

  if (!file) {
    selectedFileName.textContent =
      "No file selected";

    return;
  }

  selectedFileName.textContent =
    `${file.name} · ${formatFileSize(
      file.size
    )}`;

  hideUploadMessage();
}


function handleDocumentUpload(event) {
  event.preventDefault();

  const selectedDocumentType =
    documentTypeInput?.value || "";

  const selectedFile =
    documentFileInput?.files?.[0];

  if (!selectedDocumentType) {
    showUploadMessage(
      "Please select a document type.",
      "error"
    );

    documentTypeInput?.focus();

    return;
  }

  if (!selectedFile) {
    showUploadMessage(
      "Please choose a file to upload.",
      "error"
    );

    documentFileInput?.focus();

    return;
  }

  if (
    !allowedFileTypes.includes(
      selectedFile.type
    )
  ) {
    showUploadMessage(
      "Only PDF, JPG and PNG files are supported.",
      "error"
    );

    return;
  }

  if (
    selectedFile.size >
    maximumFileSize
  ) {
    showUploadMessage(
      "The file must be 5 MB or smaller.",
      "error"
    );

    return;
  }

  const documentItem =
    documents.find(
      (item) =>
        item.id === selectedDocumentType
    );

  if (!documentItem) {
    showUploadMessage(
      "The selected document type is invalid.",
      "error"
    );

    return;
  }

  /*
    BACKEND INTEGRATION PLACEHOLDER

    Suggested request:

    POST /api/v1/players/me/documents

    Use multipart/form-data containing:

    - documentType
    - documentFile

    The backend must not rely only on:
    - The browser-provided MIME type.
    - The file extension.
    - The player ID supplied by the frontend.

    The backend should:
    - Read the authenticated player identity from the session or token.
    - Validate the actual file content.
    - Reject oversized or dangerous files.
    - Rename stored files securely.
    - Store metadata separately from the physical file.
    - Return a document ID and verification status.
  */

  simulateSuccessfulUpload(
    documentItem,
    selectedFile
  );
}


/* ================= DEMO UPLOAD ================= */

function simulateSuccessfulUpload(
  documentItem,
  selectedFile
) {
  documentItem.status = "pending";
  documentItem.fileName =
    selectedFile.name;
  documentItem.uploadedDate =
    getCurrentDateString();
  documentItem.verifiedDate = "";

  renderDocuments();
  updateVerificationSummary();

  showUploadMessage(
    "Document submitted successfully. It is now under review.",
    "success"
  );

  documentTypeInput.disabled = true;
  documentFileInput.disabled = true;

  const submitButton =
    documentUploadForm?.querySelector(
      ".submit-upload-button"
    );

  if (submitButton) {
    submitButton.disabled = true;
    submitButton.textContent =
      "Submitted";
  }

  window.setTimeout(() => {
    closeUploadModal();

    enableUploadFormControls();

    const uploadedCard =
      document.querySelector(
        `[data-document-id="${CSS.escape(
          documentItem.id
        )}"]`
      );

    uploadedCard?.scrollIntoView({
      behavior: "smooth",
      block: "center"
    });
  }, 1400);
}


function enableUploadFormControls() {
  if (documentTypeInput) {
    documentTypeInput.disabled = false;
  }

  if (documentFileInput) {
    documentFileInput.disabled = false;
  }

  const submitButton =
    documentUploadForm?.querySelector(
      ".submit-upload-button"
    );

  if (submitButton) {
    submitButton.disabled = false;
    submitButton.textContent =
      "Submit Document";
  }
}


/* ================= PREVIEW ================= */

function previewDocument(documentId) {
  const documentItem =
    documents.find(
      (item) => item.id === documentId
    );

  if (
    !documentItem ||
    documentItem.status === "missing"
  ) {
    return;
  }

  /*
    BACKEND INTEGRATION PLACEHOLDER

    Suggested endpoint:

    GET /api/v1/players/me/documents/${documentId}/preview

    The backend should return a secure,
    short-lived preview URL after confirming
    ownership and permission.
  */

  window.alert(
    `${documentItem.title}\n\n` +
    `File: ${documentItem.fileName}\n` +
    `Status: ${getStatusText(
      documentItem.status
    )}\n\n` +
    "Secure document preview will be connected to the backend."
  );
}


/* ================= EVENTS ================= */

function registerEventListeners() {
  openUploadModalButton?.addEventListener(
    "click",
    () => openUploadModal()
  );

  closeUploadModalButton?.addEventListener(
    "click",
    closeUploadModal
  );

  cancelUploadButton?.addEventListener(
    "click",
    closeUploadModal
  );

  documentFileInput?.addEventListener(
    "change",
    handleSelectedFile
  );

  documentUploadForm?.addEventListener(
    "submit",
    handleDocumentUpload
  );

  documentsList?.addEventListener(
    "click",
    handleDocumentAction
  );

  uploadModal?.addEventListener(
    "click",
    (event) => {
      if (event.target === uploadModal) {
        closeUploadModal();
      }
    }
  );

  document.addEventListener(
    "keydown",
    (event) => {
      if (
        event.key === "Escape" &&
        uploadModal &&
        !uploadModal.hidden
      ) {
        closeUploadModal();
      }
    }
  );
}


/* ================= DOCUMENT LIST ACTIONS ================= */

function handleDocumentAction(event) {
  const uploadButton =
    event.target.closest(
      "[data-upload-document]"
    );

  const replaceButton =
    event.target.closest(
      "[data-replace-document]"
    );

  const previewButton =
    event.target.closest(
      "[data-preview-document]"
    );

  if (uploadButton) {
    openUploadModal(
      uploadButton.dataset.uploadDocument
    );

    return;
  }

  if (replaceButton) {
    openUploadModal(
      replaceButton.dataset.replaceDocument
    );

    return;
  }

  if (previewButton) {
    previewDocument(
      previewButton.dataset.previewDocument
    );
  }
}


/* ================= MESSAGE ================= */

function showUploadMessage(
  message,
  type
) {
  if (!uploadMessage) {
    return;
  }

  uploadMessage.textContent = message;

  uploadMessage.className =
    `upload-message ${type}`;

  uploadMessage.hidden = false;
}


function hideUploadMessage() {
  if (!uploadMessage) {
    return;
  }

  uploadMessage.hidden = true;
  uploadMessage.textContent = "";
  uploadMessage.className =
    "upload-message";
}


/* ================= STATUS HELPERS ================= */

function getStatusText(status) {
  const statusLabels = {
    verified: "Verified",
    pending: "Under Review",
    rejected: "Rejected",
    missing: "Not Submitted"
  };

  return statusLabels[status] ||
    "Unknown";
}


function getStatusClass(status) {
  const statusClasses = {
    verified: "status-verified",
    pending: "status-review",
    rejected: "status-rejected",
    missing: "status-missing"
  };

  return statusClasses[status] ||
    "status-missing";
}


/* ================= GENERAL HELPERS ================= */

function setText(element, value) {
  if (element) {
    element.textContent = value;
  }
}


function formatDate(dateValue) {
  if (!dateValue) {
    return "Not available";
  }

  const date = new Date(
    `${dateValue}T00:00:00`
  );

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


function formatFileSize(bytes) {
  if (!Number.isFinite(bytes)) {
    return "";
  }

  if (bytes < 1024) {
    return `${bytes} B`;
  }

  const kilobytes = bytes / 1024;

  if (kilobytes < 1024) {
    return `${kilobytes.toFixed(1)} KB`;
  }

  const megabytes =
    kilobytes / 1024;

  return `${megabytes.toFixed(1)} MB`;
}


function getCurrentDateString() {
  const currentDate = new Date();

  const year =
    currentDate.getFullYear();

  const month =
    String(
      currentDate.getMonth() + 1
    ).padStart(2, "0");

  const day =
    String(
      currentDate.getDate()
    ).padStart(2, "0");

  return `${year}-${month}-${day}`;
}


function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}