"use strict";

/* ==========================================================
   BHARAT FOOTBALL FANS
   ADMIN TRIAL MANAGEMENT
   FILE: admin-trials.js
   PART 1
========================================================== */


/* ==========================================================
   DOM REFERENCES
========================================================== */

const loadingScreen = document.getElementById("loadingScreen");

const sidebar = document.getElementById("sidebar");

const sidebarOverlay = document.getElementById("sidebarOverlay");

const mobileMenuButton = document.getElementById("mobileMenuButton");

const sidebarCloseButton = document.getElementById("sidebarCloseButton");

const profileButton = document.getElementById("profileButton");

const profileMenu = document.getElementById("profileMenu");

const notificationButton =
document.getElementById("notificationButton");

const notificationsPanel =
document.getElementById("notificationsPanel");

const closeNotificationsButton =
document.getElementById("closeNotificationsButton");

const searchButton =
document.getElementById("searchButton");

const globalSearchOverlay =
document.getElementById("globalSearchOverlay");

const closeGlobalSearchButton =
document.getElementById("closeGlobalSearchButton");

const globalSearchInput =
document.getElementById("globalSearchInput");

const toastRegion =
document.getElementById("toastRegion");

const logoutButton =
document.getElementById("logoutButton");

const profileLogoutButton =
document.getElementById("profileLogoutButton");

const logoutModal =
document.getElementById("logoutModal");

const confirmLogoutButton =
document.getElementById("confirmLogoutButton");


/* ==========================================================
   TABLE
========================================================== */

const trialTableBody =
document.getElementById("trialTableBody");

const selectAllTrials =
document.getElementById("selectAllTrials");

const searchInput =
document.getElementById("trialSearchInput");

const academyFilter =
document.getElementById("academyFilter");

const statusFilter =
document.getElementById("statusFilter");

const ageFilter =
document.getElementById("ageFilter");

const trialDateFilter =
document.getElementById("trialDateFilter");

const resetFiltersButton =
document.getElementById("resetFiltersButton");


/* ==========================================================
   BULK ACTIONS
========================================================== */

const bulkPublishButton =
document.getElementById("bulkPublishButton");

const bulkCancelButton =
document.getElementById("bulkCancelButton");

const bulkDeleteButton =
document.getElementById("bulkDeleteButton");

const exportCsvButton =
document.getElementById("exportCsvButton");

const exportPdfButton =
document.getElementById("exportPdfButton");


/* ==========================================================
   MODALS
========================================================== */

const createTrialButton =
document.getElementById("createTrialButton");

const trialFormModal =
document.getElementById("trialFormModal");

const viewTrialModal =
document.getElementById("viewTrialModal");

const deleteTrialModal =
document.getElementById("deleteTrialModal");

const trialForm =
document.getElementById("trialForm");

const confirmDeleteTrialButton =
document.getElementById("confirmDeleteTrialButton");


/* ==========================================================
   PAGINATION
========================================================== */

const previousPageButton =
document.getElementById("previousPageButton");

const nextPageButton =
document.getElementById("nextPageButton");


/* ==========================================================
   APP STATE
========================================================== */

const state = {

    selectedTrialId: null,

    currentPage: 1,

    pageSize: 10,

    filteredRows: [],

    isSidebarOpen: false,

    isNotificationsOpen: false,

    isSearchOpen: false

};


/* ==========================================================
   INITIALIZATION
========================================================== */

document.addEventListener(
    "DOMContentLoaded",
    initializeAdminTrials
);


function initializeAdminTrials() {

    hideLoadingScreen();

    bindSidebar();

    bindProfileMenu();

    bindNotifications();

    bindGlobalSearch();

    bindLogout();

    bindFilters();

    bindSelectAll();

    bindTableActions();

    bindModals();

    bindBulkButtons();

    bindPagination();

    bindKeyboardShortcuts();

}
/* ==========================================================
   LOADING SCREEN
========================================================== */

function hideLoadingScreen() {

    if (!loadingScreen) return;

    window.setTimeout(() => {

        loadingScreen.classList.add("is-hidden");

        window.setTimeout(() => {

            loadingScreen.remove();

        }, 350);

    }, 400);

}


/* ==========================================================
   SIDEBAR
========================================================== */

function bindSidebar() {

    if (mobileMenuButton) {

        mobileMenuButton.addEventListener(
            "click",
            openSidebar
        );

    }

    if (sidebarCloseButton) {

        sidebarCloseButton.addEventListener(
            "click",
            closeSidebar
        );

    }

    if (sidebarOverlay) {

        sidebarOverlay.addEventListener(
            "click",
            closeSidebar
        );

    }

}

function openSidebar() {

    if (!sidebar) return;

    sidebar.classList.add("is-open");

    sidebarOverlay?.removeAttribute("hidden");

    document.body.classList.add("admin-sidebar-open");

    state.isSidebarOpen = true;

}

function closeSidebar() {

    if (!sidebar) return;

    sidebar.classList.remove("is-open");

    sidebarOverlay?.setAttribute(
        "hidden",
        ""
    );

    document.body.classList.remove(
        "admin-sidebar-open"
    );

    state.isSidebarOpen = false;

}


/* ==========================================================
   PROFILE MENU
========================================================== */

function bindProfileMenu() {

    if (!profileButton || !profileMenu) return;

    profileButton.addEventListener(
        "click",
        (event) => {

            event.stopPropagation();

            profileMenu.toggleAttribute("hidden");

        }
    );

    document.addEventListener(
        "click",
        (event) => {

            if (
                !profileMenu.contains(event.target) &&
                !profileButton.contains(event.target)
            ) {

                profileMenu.setAttribute(
                    "hidden",
                    ""
                );

            }

        }
    );

}


/* ==========================================================
   NOTIFICATIONS
========================================================== */

function bindNotifications() {

    if (!notificationButton) return;

    notificationButton.addEventListener(
        "click",
        toggleNotifications
    );

    closeNotificationsButton?.addEventListener(
        "click",
        closeNotifications
    );

}

function toggleNotifications() {

    if (!notificationsPanel) return;

    const opened =
        notificationsPanel.classList.toggle(
            "is-open"
        );

    state.isNotificationsOpen = opened;

    document.body.classList.toggle(
        "admin-notifications-open",
        opened
    );

}

function closeNotifications() {

    if (!notificationsPanel) return;

    notificationsPanel.classList.remove(
        "is-open"
    );

    document.body.classList.remove(
        "admin-notifications-open"
    );

    state.isNotificationsOpen = false;

}


/* ==========================================================
   GLOBAL SEARCH
========================================================== */

function bindGlobalSearch() {

    searchButton?.addEventListener(
        "click",
        openGlobalSearch
    );

    closeGlobalSearchButton?.addEventListener(
        "click",
        closeGlobalSearch
    );

}

function openGlobalSearch() {

    if (!globalSearchOverlay) return;

    globalSearchOverlay.removeAttribute(
        "hidden"
    );

    document.body.classList.add(
        "admin-modal-open"
    );

    state.isSearchOpen = true;

    window.setTimeout(() => {

        globalSearchInput?.focus();

    }, 150);

}

function closeGlobalSearch() {

    if (!globalSearchOverlay) return;

    globalSearchOverlay.setAttribute(
        "hidden",
        ""
    );

    document.body.classList.remove(
        "admin-modal-open"
    );

    state.isSearchOpen = false;

}


/* ==========================================================
   LOGOUT MODAL
========================================================== */

function bindLogout() {

    logoutButton?.addEventListener(
        "click",
        openLogoutModal
    );

    profileLogoutButton?.addEventListener(
        "click",
        openLogoutModal
    );

    confirmLogoutButton?.addEventListener(
        "click",
        performLogout
    );

}

function openLogoutModal() {

    logoutModal?.removeAttribute("hidden");

    document.body.classList.add(
        "admin-modal-open"
    );

}

function closeLogoutModal() {

    logoutModal?.setAttribute(
        "hidden",
        ""
    );

    document.body.classList.remove(
        "admin-modal-open"
    );

}

function performLogout() {

    showToast(
        "Logging out...",
        "success"
    );

    window.setTimeout(() => {

        /*
        =====================================================

        HARSH BACKEND

        Destroy JWT Session

        POST /api/admin/logout

        =====================================================
        */

        window.location.href = "login.html";

    }, 800);

}
/* ==========================================================
   TOAST NOTIFICATION SYSTEM
========================================================== */

function showToast(
    message,
    type = "info",
    duration = 3200
) {

    if (!toastRegion || !message) return;

    const toast = document.createElement("div");

    const iconMap = {
        success: "fa-circle-check",
        error: "fa-circle-exclamation",
        warning: "fa-triangle-exclamation",
        info: "fa-circle-info"
    };

    const safeType = Object.prototype.hasOwnProperty.call(
        iconMap,
        type
    )
        ? type
        : "info";

    toast.className = `admin-toast admin-toast-${safeType}`;

    toast.setAttribute("role", "status");

    toast.innerHTML = `
        <div class="admin-toast-icon">
            <i
                class="fa-solid ${iconMap[safeType]}"
                aria-hidden="true"
            ></i>
        </div>

        <p></p>

        <button
            type="button"
            class="admin-toast-close"
            aria-label="Close notification"
        >
            <i
                class="fa-solid fa-xmark"
                aria-hidden="true"
            ></i>
        </button>
    `;

    const messageElement = toast.querySelector("p");

    const closeButton = toast.querySelector(
        ".admin-toast-close"
    );

    if (messageElement) {

        messageElement.textContent = message;

    }

    toastRegion.appendChild(toast);

    window.requestAnimationFrame(() => {

        toast.classList.add("is-visible");

    });

    const timeoutId = window.setTimeout(() => {

        removeToast(toast);

    }, duration);

    closeButton?.addEventListener(
        "click",
        () => {

            window.clearTimeout(timeoutId);

            removeToast(toast);

        }
    );

}


function removeToast(toast) {

    if (!toast || !toast.isConnected) return;

    toast.classList.remove("is-visible");

    toast.classList.add("is-leaving");

    window.setTimeout(() => {

        toast.remove();

    }, 250);

}


/* ==========================================================
   FILTER EVENT BINDINGS
========================================================== */

function bindFilters() {

    searchInput?.addEventListener(
        "input",
        debounce(applyTrialFilters, 180)
    );

    academyFilter?.addEventListener(
        "change",
        applyTrialFilters
    );

    statusFilter?.addEventListener(
        "change",
        applyTrialFilters
    );

    ageFilter?.addEventListener(
        "change",
        applyTrialFilters
    );

    trialDateFilter?.addEventListener(
        "change",
        applyTrialFilters
    );

    resetFiltersButton?.addEventListener(
        "click",
        resetTrialFilters
    );

    updateFilteredRows();

}


/* ==========================================================
   FILTER TRIAL TABLE
========================================================== */

function applyTrialFilters() {

    const rows = getTrialRows();

    const searchValue =
        normalizeText(searchInput?.value);

    const academyValue =
        normalizeText(academyFilter?.value);

    const statusValue =
        normalizeText(statusFilter?.value);

    const ageValue =
        normalizeText(ageFilter?.value);

    const dateValue =
        normalizeText(trialDateFilter?.value);

    rows.forEach((row) => {

        const rowSearchText = normalizeText(
            [
                row.dataset.trialName,
                row.dataset.academy,
                row.dataset.status,
                row.dataset.age,
                row.dataset.date,
                row.textContent
            ].join(" ")
        );

        const rowAcademy = normalizeText(
            row.dataset.academy
        );

        const rowStatus = normalizeText(
            row.dataset.status
        );

        const rowAge = normalizeText(
            row.dataset.age
        );

        const rowDate = normalizeText(
            row.dataset.date
        );

        const matchesSearch =
            !searchValue ||
            rowSearchText.includes(searchValue);

        const matchesAcademy =
            !academyValue ||
            academyValue === "all" ||
            rowAcademy === academyValue ||
            rowAcademy.includes(academyValue);

        const matchesStatus =
            !statusValue ||
            statusValue === "all" ||
            rowStatus === statusValue;

        const matchesAge =
            !ageValue ||
            ageValue === "all" ||
            rowAge === ageValue ||
            rowAge.includes(ageValue);

        const matchesDate =
            !dateValue ||
            rowDate === dateValue;

        const shouldShow =
            matchesSearch &&
            matchesAcademy &&
            matchesStatus &&
            matchesAge &&
            matchesDate;

        row.hidden = !shouldShow;

        if (!shouldShow) {

            const checkbox = getRowCheckbox(row);

            if (checkbox) {

                checkbox.checked = false;

            }

            row.classList.remove("is-selected");

        }

    });

    state.currentPage = 1;

    updateFilteredRows();

    updateSelectAllState();

    updateBulkActionState();

    updatePagination();

    showOrHideEmptyState();

}


/* ==========================================================
   RESET FILTERS
========================================================== */

function resetTrialFilters() {

    if (searchInput) {

        searchInput.value = "";

    }

    if (academyFilter) {

        academyFilter.selectedIndex = 0;

    }

    if (statusFilter) {

        statusFilter.selectedIndex = 0;

    }

    if (ageFilter) {

        ageFilter.selectedIndex = 0;

    }

    if (trialDateFilter) {

        trialDateFilter.value = "";

    }

    applyTrialFilters();

    showToast(
        "Trial filters have been reset.",
        "info"
    );

}


/* ==========================================================
   TABLE ROW HELPERS
========================================================== */

function getTrialRows() {

    if (!trialTableBody) return [];

    return Array.from(
        trialTableBody.querySelectorAll(
            "tr[data-trial-id]"
        )
    );

}


function getVisibleTrialRows() {

    return getTrialRows().filter(
        (row) => !row.hidden
    );

}


function getSelectedTrialRows() {

    return getTrialRows().filter((row) => {

        const checkbox = getRowCheckbox(row);

        return Boolean(checkbox?.checked);

    });

}


function getRowCheckbox(row) {

    if (!row) return null;

    return row.querySelector(
        'input[type="checkbox"]'
    );

}


function updateFilteredRows() {

    state.filteredRows = getVisibleTrialRows();

}


/* ==========================================================
   SELECT ALL CHECKBOX
========================================================== */

function bindSelectAll() {

    selectAllTrials?.addEventListener(
        "change",
        handleSelectAllTrials
    );

    if (!trialTableBody) return;

    trialTableBody.addEventListener(
        "change",
        handleTrialCheckboxChange
    );

}


function handleSelectAllTrials() {

    const visibleRows = getVisibleTrialRows();

    visibleRows.forEach((row) => {

        const checkbox = getRowCheckbox(row);

        if (!checkbox || checkbox.disabled) return;

        checkbox.checked = Boolean(
            selectAllTrials?.checked
        );

        row.classList.toggle(
            "is-selected",
            checkbox.checked
        );

    });

    updateSelectAllState();

    updateBulkActionState();

}


function handleTrialCheckboxChange(event) {

    const checkbox = event.target.closest(
        'input[type="checkbox"]'
    );

    if (!checkbox) return;

    const row = checkbox.closest(
        "tr[data-trial-id]"
    );

    row?.classList.toggle(
        "is-selected",
        checkbox.checked
    );

    updateSelectAllState();

    updateBulkActionState();

}


/* ==========================================================
   SELECT ALL VISUAL STATE
========================================================== */

function updateSelectAllState() {

    if (!selectAllTrials) return;

    const visibleCheckboxes = getVisibleTrialRows()
        .map(getRowCheckbox)
        .filter(
            (checkbox) =>
                checkbox &&
                !checkbox.disabled
        );

    const checkedCheckboxes =
        visibleCheckboxes.filter(
            (checkbox) => checkbox.checked
        );

    if (visibleCheckboxes.length === 0) {

        selectAllTrials.checked = false;

        selectAllTrials.indeterminate = false;

        selectAllTrials.disabled = true;

        return;

    }

    selectAllTrials.disabled = false;

    selectAllTrials.checked =
        checkedCheckboxes.length ===
        visibleCheckboxes.length;

    selectAllTrials.indeterminate =
        checkedCheckboxes.length > 0 &&
        checkedCheckboxes.length <
        visibleCheckboxes.length;

}


/* ==========================================================
   BULK BUTTON STATE
========================================================== */

function updateBulkActionState() {

    const selectedCount =
        getSelectedTrialRows().length;

    const bulkButtons = [
        bulkPublishButton,
        bulkCancelButton,
        bulkDeleteButton
    ];

    bulkButtons.forEach((button) => {

        if (!button) return;

        button.disabled = selectedCount === 0;

        button.setAttribute(
            "aria-disabled",
            String(selectedCount === 0)
        );

    });

    updateSelectedCountDisplay(selectedCount);

}


function updateSelectedCountDisplay(count) {

    const display = document.getElementById(
        "selectedTrialCount"
    );

    if (!display) return;

    display.textContent =
        count === 1
            ? "1 trial selected"
            : `${count} trials selected`;

}


/* ==========================================================
   EMPTY FILTER RESULT
========================================================== */

function showOrHideEmptyState() {

    if (!trialTableBody) return;

    const existingEmptyRow =
        trialTableBody.querySelector(
            ".trial-filter-empty-row"
        );

    const visibleRows = getVisibleTrialRows();

    if (visibleRows.length > 0) {

        existingEmptyRow?.remove();

        return;

    }

    if (existingEmptyRow) return;

    const emptyRow = document.createElement("tr");

    emptyRow.className =
        "trial-filter-empty-row";

    emptyRow.innerHTML = `
        <td
            colspan="10"
            class="trial-table-empty"
        >
            <div class="trial-empty-state">

                <div class="trial-empty-state-icon">
                    <i
                        class="fa-solid fa-magnifying-glass"
                        aria-hidden="true"
                    ></i>
                </div>

                <h4>No trials found</h4>

                <p>
                    No trial matches the selected search
                    and filter options.
                </p>

            </div>
        </td>
    `;

    trialTableBody.appendChild(emptyRow);

}


/* ==========================================================
   NORMALIZE SEARCH VALUES
========================================================== */

function normalizeText(value) {

    return String(value ?? "")
        .trim()
        .toLowerCase();

}


/* ==========================================================
   DEBOUNCE UTILITY
========================================================== */

function debounce(callback, delay = 200) {

    let timeoutId = null;

    return function debouncedFunction(...args) {

        window.clearTimeout(timeoutId);

        timeoutId = window.setTimeout(
            () => {

                callback.apply(this, args);

            },
            delay
        );

    };

}
/* ==========================================================
   TABLE ACTION BUTTONS
========================================================== */

function bindTableActions() {

    if (!trialTableBody) return;

    trialTableBody.addEventListener(
        "click",
        handleTableButtonClick
    );

}

function handleTableButtonClick(event) {

    const button = event.target.closest(
        "[data-action]"
    );

    if (!button) return;

    const row = button.closest(
        "tr[data-trial-id]"
    );

    if (!row) return;

    const action = button.dataset.action;

    switch (action) {

        case "view":
            openViewTrialModal(row);
            break;

        case "edit":
            openEditTrialModal(row);
            break;

        case "delete":
            openDeleteTrialModal(row);
            break;

        default:
            break;

    }

}


/* ==========================================================
   READ ROW DATA
========================================================== */

function getTrialData(row) {

    return {

        id: row.dataset.trialId || "",

        name: row.dataset.trialName || "",

        academy: row.dataset.academy || "",

        age: row.dataset.age || "",

        status: row.dataset.status || "",

        date: row.dataset.date || "",

        venue: row.dataset.venue || "",

        capacity: row.dataset.capacity || "",

        registered: row.dataset.registered || "",

        description: row.dataset.description || ""

    };

}


/* ==========================================================
   VIEW TRIAL MODAL
========================================================== */

function openViewTrialModal(row) {

    if (!viewTrialModal) return;

    const trial = getTrialData(row);

    state.selectedTrialId = trial.id;

    setText("viewTrialName", trial.name);

    setText("viewTrialAcademy", trial.academy);

    setText("viewTrialAge", trial.age);

    setText("viewTrialStatus", trial.status);

    setText("viewTrialDate", trial.date);

    setText("viewTrialVenue", trial.venue);

    setText("viewTrialCapacity", trial.capacity);

    setText("viewTrialRegistered", trial.registered);

    setText("viewTrialDescription", trial.description);

    openModal(viewTrialModal);

}


/* ==========================================================
   CREATE TRIAL
========================================================== */

function bindModals() {

    createTrialButton?.addEventListener(
        "click",
        openCreateTrialModal
    );

    document.querySelectorAll(
        "[data-close-modal]"
    ).forEach((button) => {

        button.addEventListener(
            "click",
            closeParentModal
        );

    });

    trialForm?.addEventListener(
        "submit",
        saveTrial
    );

}

function openCreateTrialModal() {

    if (!trialFormModal) return;

    state.selectedTrialId = null;

    trialForm?.reset();

    clearValidationErrors();

    setText(
        "trialFormTitle",
        "Create New Trial"
    );

    openModal(trialFormModal);

}


/* ==========================================================
   EDIT TRIAL
========================================================== */

function openEditTrialModal(row) {

    if (!trialFormModal) return;

    const trial = getTrialData(row);

    state.selectedTrialId = trial.id;

    clearValidationErrors();

    setText(
        "trialFormTitle",
        "Edit Trial"
    );

    setValue("trialName", trial.name);

    setValue("academy", trial.academy);

    setValue("age", trial.age);

    setValue("capacity", trial.capacity);

    setValue("trialDate", trial.date);

    setValue("venue", trial.venue);

    setValue(
        "trialDescription",
        trial.description
    );

    openModal(trialFormModal);

}


/* ==========================================================
   SAVE TRIAL
========================================================== */

function saveTrial(event) {

    event.preventDefault();

    if (!validateTrialForm()) {

        showToast(
            "Please correct the highlighted fields.",
            "error"
        );

        return;

    }

    showToast(
        state.selectedTrialId
            ? "Trial updated successfully."
            : "Trial created successfully.",
        "success"
    );

    /*
    ======================================================

    HARSH BACKEND PLACEHOLDER

    POST /api/admin/trials

    PUT /api/admin/trials/{id}

    ======================================================
    */

    closeModal(trialFormModal);

}


/* ==========================================================
   FORM VALIDATION
========================================================== */

function validateTrialForm() {

    let valid = true;

    clearValidationErrors();

    const requiredFields = [

        "trialName",

        "academy",

        "age",

        "capacity",

        "trialDate",

        "venue"

    ];

    requiredFields.forEach((id) => {

        const input =
            document.getElementById(id);

        if (!input) return;

        if (!input.value.trim()) {

            showValidationError(input);

            valid = false;

        }

    });

    return valid;

}

function showValidationError(input) {

    const field = input.closest(".trial-field");

    field?.classList.add("has-error");

}

function clearValidationErrors() {

    document
        .querySelectorAll(".trial-field")
        .forEach((field) => {

            field.classList.remove(
                "has-error"
            );

        });

}


/* ==========================================================
   DELETE TRIAL
========================================================== */

function openDeleteTrialModal(row) {

    const trial = getTrialData(row);

    state.selectedTrialId = trial.id;

    setText(
        "deleteTrialName",
        trial.name
    );

    openModal(deleteTrialModal);

}

confirmDeleteTrialButton?.addEventListener(
    "click",
    () => {

        /*
        ===============================================

        HARSH BACKEND

        DELETE

        /api/admin/trials/{id}

        ===============================================
        */

        showToast(
            "Trial deleted successfully.",
            "success"
        );

        closeModal(deleteTrialModal);

    }
);


/* ==========================================================
   GENERIC MODALS
========================================================== */

function openModal(modal) {

    if (!modal) return;

    modal.removeAttribute("hidden");

    document.body.classList.add(
        "admin-modal-open"
    );

}

function closeModal(modal) {

    if (!modal) return;

    modal.setAttribute(
        "hidden",
        ""
    );

    document.body.classList.remove(
        "admin-modal-open"
    );

}

function closeParentModal(event) {

    const modal =
        event.target.closest(".trial-modal");

    closeModal(modal);

}


/* ==========================================================
   HELPERS
========================================================== */

function setText(id, value) {

    const element =
        document.getElementById(id);

    if (element) {

        element.textContent = value || "-";

    }

}

function setValue(id, value) {

    const element =
        document.getElementById(id);

    if (element) {

        element.value = value || "";

    }

}
/* ==========================================================
   BULK ACTION BUTTONS
========================================================== */

function bindBulkButtons() {

    bulkPublishButton?.addEventListener(
        "click",
        () => handleBulkStatusUpdate("upcoming")
    );

    bulkCancelButton?.addEventListener(
        "click",
        () => handleBulkStatusUpdate("cancelled")
    );

    bulkDeleteButton?.addEventListener(
        "click",
        handleBulkDelete
    );

    exportCsvButton?.addEventListener(
        "click",
        exportTrialsToCsv
    );

    exportPdfButton?.addEventListener(
        "click",
        exportTrialsToPdf
    );

    updateBulkActionState();

}


/* ==========================================================
   BULK STATUS UPDATE
========================================================== */

function handleBulkStatusUpdate(newStatus) {

    const selectedRows = getSelectedTrialRows();

    if (selectedRows.length === 0) {

        showToast(
            "Select at least one trial first.",
            "warning"
        );

        return;

    }

    selectedRows.forEach((row) => {

        updateTrialRowStatus(
            row,
            newStatus
        );

        const checkbox = getRowCheckbox(row);

        if (checkbox) {

            checkbox.checked = false;

        }

        row.classList.remove("is-selected");

    });

    /*
    ======================================================

    HARSH BACKEND PLACEHOLDER

    PATCH /api/admin/trials/bulk-status

    Example request body:

    {
        "trialIds": ["trial-001", "trial-002"],
        "status": "upcoming"
    }

    ======================================================
    */

    const readableStatus =
        newStatus === "cancelled"
            ? "cancelled"
            : "published";

    showToast(
        `${selectedRows.length} trial${
            selectedRows.length === 1 ? "" : "s"
        } ${readableStatus} successfully.`,
        "success"
    );

    applyTrialFilters();

}


/* ==========================================================
   UPDATE ROW STATUS
========================================================== */

function updateTrialRowStatus(
    row,
    newStatus
) {

    if (!row) return;

    row.dataset.status = newStatus;

    const statusBadge = row.querySelector(
        ".trial-status"
    );

    if (!statusBadge) return;

    statusBadge.className =
        `trial-status ${newStatus}`;

    statusBadge.textContent =
        formatStatusLabel(newStatus);

}


/* ==========================================================
   FORMAT STATUS LABEL
========================================================== */

function formatStatusLabel(status) {

    const labels = {
        upcoming: "Upcoming",
        live: "Live",
        completed: "Completed",
        cancelled: "Cancelled",
        draft: "Draft"
    };

    return labels[status] || "Unknown";

}


/* ==========================================================
   BULK DELETE
========================================================== */

function handleBulkDelete() {

    const selectedRows = getSelectedTrialRows();

    if (selectedRows.length === 0) {

        showToast(
            "Select at least one trial first.",
            "warning"
        );

        return;

    }

    const confirmed = window.confirm(
        `Delete ${selectedRows.length} selected trial${
            selectedRows.length === 1 ? "" : "s"
        }? This action cannot be undone.`
    );

    if (!confirmed) return;

    const selectedIds = selectedRows.map(
        (row) => row.dataset.trialId
    );

    selectedRows.forEach((row) => {

        row.remove();

    });

    /*
    ======================================================

    HARSH BACKEND PLACEHOLDER

    DELETE /api/admin/trials/bulk

    Example request body:

    {
        "trialIds": selectedIds
    }

    ======================================================
    */

    showToast(
        `${selectedIds.length} trial${
            selectedIds.length === 1 ? "" : "s"
        } deleted successfully.`,
        "success"
    );

    applyTrialFilters();

    updateDashboardStatistics();

}


/* ==========================================================
   EXPORT CSV
========================================================== */

function exportTrialsToCsv() {

    const rowsToExport =
        getSelectedTrialRows().length > 0
            ? getSelectedTrialRows()
            : getVisibleTrialRows();

    if (rowsToExport.length === 0) {

        showToast(
            "There are no trials available to export.",
            "warning"
        );

        return;

    }

    const csvRows = [
        [
            "Trial ID",
            "Trial Name",
            "Academy",
            "Age Group",
            "Status",
            "Date",
            "Venue",
            "Capacity",
            "Registered"
        ]
    ];

    rowsToExport.forEach((row) => {

        const trial = getTrialData(row);

        csvRows.push([
            trial.id,
            trial.name,
            trial.academy,
            trial.age,
            trial.status,
            trial.date,
            trial.venue,
            trial.capacity,
            trial.registered
        ]);

    });

    const csvContent = csvRows
        .map((row) => {

            return row
                .map(escapeCsvValue)
                .join(",");

        })
        .join("\n");

    const fileName =
        `admin-trials-${getCurrentDateStamp()}.csv`;

    downloadTextFile(
        csvContent,
        fileName,
        "text/csv;charset=utf-8"
    );

    showToast(
        `${rowsToExport.length} trial${
            rowsToExport.length === 1 ? "" : "s"
        } exported to CSV.`,
        "success"
    );

}


/* ==========================================================
   CSV VALUE ESCAPING
========================================================== */

function escapeCsvValue(value) {

    const stringValue =
        String(value ?? "");

    const escapedValue =
        stringValue.replace(/"/g, '""');

    return `"${escapedValue}"`;

}


/* ==========================================================
   DOWNLOAD TEXT FILE
========================================================== */

function downloadTextFile(
    content,
    fileName,
    mimeType
) {

    const blob = new Blob(
        [content],
        {
            type: mimeType
        }
    );

    const downloadUrl =
        URL.createObjectURL(blob);

    const link =
        document.createElement("a");

    link.href = downloadUrl;

    link.download = fileName;

    link.style.display = "none";

    document.body.appendChild(link);

    link.click();

    link.remove();

    window.setTimeout(() => {

        URL.revokeObjectURL(downloadUrl);

    }, 1000);

}


/* ==========================================================
   EXPORT PDF
========================================================== */

function exportTrialsToPdf() {

    const rowsToExport =
        getSelectedTrialRows().length > 0
            ? getSelectedTrialRows()
            : getVisibleTrialRows();

    if (rowsToExport.length === 0) {

        showToast(
            "There are no trials available to print.",
            "warning"
        );

        return;

    }

    /*
    ======================================================

    FRONTEND PDF APPROACH

    The browser print window opens.

    The administrator can select:
    "Save as PDF"

    Harsh can later replace this with:
    GET /api/admin/trials/export/pdf

    ======================================================
    */

    showToast(
        "Opening the print window. Select Save as PDF.",
        "info"
    );

    window.setTimeout(() => {

        window.print();

    }, 350);

}


/* ==========================================================
   DATE STAMP
========================================================== */

function getCurrentDateStamp() {

    const today = new Date();

    const year =
        today.getFullYear();

    const month =
        String(today.getMonth() + 1)
            .padStart(2, "0");

    const day =
        String(today.getDate())
            .padStart(2, "0");

    return `${year}-${month}-${day}`;

}


/* ==========================================================
   PAGINATION BINDINGS
========================================================== */

function bindPagination() {

    previousPageButton?.addEventListener(
        "click",
        () => changePage(-1)
    );

    nextPageButton?.addEventListener(
        "click",
        () => changePage(1)
    );

    updatePagination();

}


/* ==========================================================
   CHANGE PAGE
========================================================== */

function changePage(direction) {

    updateFilteredRows();

    const totalPages =
        getTotalPages();

    const nextPage =
        state.currentPage + direction;

    if (
        nextPage < 1 ||
        nextPage > totalPages
    ) {

        return;

    }

    state.currentPage = nextPage;

    renderCurrentPage();

}


/* ==========================================================
   TOTAL PAGE COUNT
========================================================== */

function getTotalPages() {

    const totalRows =
        state.filteredRows.length;

    return Math.max(
        1,
        Math.ceil(
            totalRows / state.pageSize
        )
    );

}


/* ==========================================================
   UPDATE PAGINATION
========================================================== */

function updatePagination() {

    updateFilteredRows();

    const totalPages =
        getTotalPages();

    if (state.currentPage > totalPages) {

        state.currentPage = totalPages;

    }

    renderCurrentPage();

}


/* ==========================================================
   RENDER CURRENT PAGE
========================================================== */

function renderCurrentPage() {

    const filteredRows =
        state.filteredRows;

    const totalPages =
        getTotalPages();

    const startIndex =
        (state.currentPage - 1) *
        state.pageSize;

    const endIndex =
        startIndex +
        state.pageSize;

    getTrialRows().forEach((row) => {

        const matchesFilters =
            filteredRows.includes(row);

        if (!matchesFilters) return;

        const filteredIndex =
            filteredRows.indexOf(row);

        row.hidden =
            filteredIndex < startIndex ||
            filteredIndex >= endIndex;

    });

    if (previousPageButton) {

        previousPageButton.disabled =
            state.currentPage <= 1;

    }

    if (nextPageButton) {

        nextPageButton.disabled =
            state.currentPage >= totalPages;

    }

    updatePaginationInformation(
        filteredRows.length,
        startIndex,
        endIndex,
        totalPages
    );

    updateSelectAllState();

}


/* ==========================================================
   PAGINATION INFORMATION
========================================================== */

function updatePaginationInformation(
    totalRows,
    startIndex,
    endIndex,
    totalPages
) {

    const pageInfo =
        document.getElementById(
            "paginationInfo"
        );

    if (!pageInfo) return;

    if (totalRows === 0) {

        pageInfo.textContent =
            "No trials found";

        return;

    }

    const firstVisible =
        startIndex + 1;

    const lastVisible =
        Math.min(
            endIndex,
            totalRows
        );

    pageInfo.textContent =
        `Showing ${firstVisible}–${lastVisible} ` +
        `of ${totalRows} trials · ` +
        `Page ${state.currentPage} of ${totalPages}`;

}


/* ==========================================================
   GLOBAL SEARCH ENHANCEMENTS
========================================================== */

function initializeAdminTrialsEnhancements() {

    globalSearchInput?.addEventListener(
        "input",
        debounce(
            handleGlobalSearchInput,
            180
        )
    );

    globalSearchOverlay?.addEventListener(
        "click",
        handleGlobalSearchBackdropClick
    );

    bindLogoutModalCloseButtons();

    bindModalBackdropClosing();

    bindLiveFormValidation();

    updateDashboardStatistics();

    applyTrialFilters();

}


/* ==========================================================
   GLOBAL SEARCH INPUT
========================================================== */

function handleGlobalSearchInput() {

    const query =
        normalizeText(
            globalSearchInput?.value
        );

    const resultsContainer =
        document.getElementById(
            "globalSearchResults"
        );

    if (!resultsContainer) return;

    resultsContainer.replaceChildren();

    if (!query) {

        const message =
            document.createElement("p");

        message.className =
            "admin-global-search-empty";

        message.textContent =
            "Search trials, academies, players or admin pages.";

        resultsContainer.appendChild(message);

        return;

    }

    const matchingRows =
        getTrialRows()
            .filter((row) => {

                const trial =
                    getTrialData(row);

                const searchableText =
                    normalizeText(
                        [
                            trial.name,
                            trial.academy,
                            trial.age,
                            trial.status,
                            trial.venue
                        ].join(" ")
                    );

                return searchableText.includes(
                    query
                );

            })
            .slice(0, 8);

    if (matchingRows.length === 0) {

        const message =
            document.createElement("p");

        message.className =
            "admin-global-search-empty";

        message.textContent =
            "No matching trial was found.";

        resultsContainer.appendChild(message);

        return;

    }

    matchingRows.forEach((row) => {

        const trial =
            getTrialData(row);

        const resultButton =
            createGlobalSearchResult(
                trial
            );

        resultButton.addEventListener(
            "click",
            () => {

                closeGlobalSearch();

                openViewTrialModal(row);

            }
        );

        resultsContainer.appendChild(
            resultButton
        );

    });

}


/* ==========================================================
   CREATE GLOBAL SEARCH RESULT
========================================================== */

function createGlobalSearchResult(trial) {

    const button =
        document.createElement("button");

    button.type = "button";

    button.className =
        "admin-global-search-result";

    const iconWrapper =
        document.createElement("span");

    iconWrapper.className =
        "admin-global-search-result-icon";

    const icon =
        document.createElement("i");

    icon.className =
        "fa-solid fa-futbol";

    icon.setAttribute(
        "aria-hidden",
        "true"
    );

    iconWrapper.appendChild(icon);

    const copy =
        document.createElement("span");

    copy.className =
        "admin-global-search-result-copy";

    const title =
        document.createElement("strong");

    title.textContent =
        trial.name || "Unnamed Trial";

    const details =
        document.createElement("span");

    details.textContent =
        [
            trial.academy,
            trial.age,
            formatStatusLabel(
                trial.status
            )
        ]
            .filter(Boolean)
            .join(" · ");

    copy.append(
        title,
        details
    );

    button.append(
        iconWrapper,
        copy
    );

    return button;

}


/* ==========================================================
   GLOBAL SEARCH BACKDROP
========================================================== */

function handleGlobalSearchBackdropClick(event) {

    if (
        event.target === globalSearchOverlay
    ) {

        closeGlobalSearch();

    }

}


/* ==========================================================
   MODAL BACKDROP CLOSING
========================================================== */

function bindModalBackdropClosing() {

    document
        .querySelectorAll(
            ".trial-modal"
        )
        .forEach((modal) => {

            modal.addEventListener(
                "click",
                (event) => {

                    if (
                        event.target === modal ||
                        event.target.classList.contains(
                            "trial-modal-backdrop"
                        )
                    ) {

                        closeModal(modal);

                    }

                }
            );

        });

}


/* ==========================================================
   LOGOUT MODAL CLOSE BUTTONS
========================================================== */

function bindLogoutModalCloseButtons() {

    if (!logoutModal) return;

    logoutModal
        .querySelectorAll(
            "[data-close-logout]"
        )
        .forEach((button) => {

            button.addEventListener(
                "click",
                closeLogoutModal
            );

        });

    logoutModal.addEventListener(
        "click",
        (event) => {

            if (
                event.target === logoutModal
            ) {

                closeLogoutModal();

            }

        }
    );

}


/* ==========================================================
   LIVE FORM VALIDATION
========================================================== */

function bindLiveFormValidation() {

    if (!trialForm) return;

    trialForm.addEventListener(
        "input",
        (event) => {

            const input =
                event.target.closest(
                    "input, select, textarea"
                );

            if (!input) return;

            const field =
                input.closest(
                    ".trial-field"
                );

            if (
                field &&
                String(input.value).trim()
            ) {

                field.classList.remove(
                    "has-error"
                );

            }

        }
    );

}


/* ==========================================================
   KEYBOARD SHORTCUTS
========================================================== */

function bindKeyboardShortcuts() {

    document.addEventListener(
        "keydown",
        handleKeyboardShortcut
    );

}


/* ==========================================================
   HANDLE KEYBOARD SHORTCUT
========================================================== */

function handleKeyboardShortcut(event) {

    const isSearchShortcut =
        (event.ctrlKey || event.metaKey) &&
        event.key.toLowerCase() === "k";

    if (isSearchShortcut) {

        event.preventDefault();

        if (state.isSearchOpen) {

            closeGlobalSearch();

        } else {

            openGlobalSearch();

        }

        return;

    }

    if (event.key !== "Escape") return;

    closeTopmostInterface();

}


/* ==========================================================
   CLOSE TOPMOST INTERFACE
========================================================== */

function closeTopmostInterface() {

    const openTrialModal =
        Array.from(
            document.querySelectorAll(
                ".trial-modal:not([hidden])"
            )
        ).pop();

    if (openTrialModal) {

        closeModal(openTrialModal);

        return;

    }

    if (
        logoutModal &&
        !logoutModal.hasAttribute("hidden")
    ) {

        closeLogoutModal();

        return;

    }

    if (state.isSearchOpen) {

        closeGlobalSearch();

        return;

    }

    if (state.isNotificationsOpen) {

        closeNotifications();

        return;

    }

    if (
        profileMenu &&
        !profileMenu.hasAttribute("hidden")
    ) {

        profileMenu.setAttribute(
            "hidden",
            ""
        );

        return;

    }

    if (state.isSidebarOpen) {

        closeSidebar();

    }

}


/* ==========================================================
   DELETE SELECTED TRIAL
========================================================== */

function deleteSelectedTrialFromPage() {

    if (!state.selectedTrialId) return;

    const row =
        getTrialRows().find(
            (trialRow) =>
                trialRow.dataset.trialId ===
                state.selectedTrialId
        );

    if (row) {

        row.remove();

    }

    state.selectedTrialId = null;

    applyTrialFilters();

    updateDashboardStatistics();

}


/* ==========================================================
   FINAL DELETE BUTTON BEHAVIOUR
========================================================== */

if (confirmDeleteTrialButton) {

    confirmDeleteTrialButton.addEventListener(
        "click",
        deleteSelectedTrialFromPage
    );

}


/* ==========================================================
   STATISTICS UPDATE
========================================================== */

function updateDashboardStatistics() {

    const rows =
        getTrialRows();

    const statusCounts = {
        upcoming: 0,
        live: 0,
        completed: 0,
        cancelled: 0
    };

    rows.forEach((row) => {

        const status =
            normalizeText(
                row.dataset.status
            );

        if (
            Object.prototype.hasOwnProperty.call(
                statusCounts,
                status
            )
        ) {

            statusCounts[status] += 1;

        }

    });

    updateStatisticValue(
        [
            "totalTrialsCount",
            "totalTrialCount"
        ],
        rows.length
    );

    updateStatisticValue(
        [
            "upcomingTrialsCount",
            "upcomingTrialCount"
        ],
        statusCounts.upcoming
    );

    updateStatisticValue(
        [
            "liveTrialsCount",
            "liveTrialCount"
        ],
        statusCounts.live
    );

    updateStatisticValue(
        [
            "completedTrialsCount",
            "completedTrialCount"
        ],
        statusCounts.completed
    );

    updateStatisticValue(
        [
            "cancelledTrialsCount",
            "cancelledTrialCount"
        ],
        statusCounts.cancelled
    );

}


/* ==========================================================
   STATISTIC VALUE HELPER
========================================================== */

function updateStatisticValue(
    possibleIds,
    value
) {

    possibleIds.some((id) => {

        const element =
            document.getElementById(id);

        if (!element) return false;

        element.textContent =
            String(value);

        return true;

    });

}


/* ==========================================================
   SAFE BACKEND REQUEST HELPER
========================================================== */

async function requestAdminApi(
    endpoint,
    options = {}
) {

    const requestOptions = {
        method: options.method || "GET",

        headers: {
            "Content-Type": "application/json",
            ...(options.headers || {})
        },

        credentials: "include",

        ...options
    };

    try {

        const response = await fetch(
            endpoint,
            requestOptions
        );

        const responseType =
            response.headers.get(
                "content-type"
            ) || "";

        const data =
            responseType.includes(
                "application/json"
            )
                ? await response.json()
                : null;

        if (!response.ok) {

            throw new Error(
                data?.message ||
                `Request failed with status ${response.status}.`
            );

        }

        return data;

    } catch (error) {

        console.error(
            "Admin API request failed:",
            error
        );

        throw error;

    }

}


/* ==========================================================
   BACKEND ENDPOINT CONFIGURATION
========================================================== */

const ADMIN_TRIAL_API = Object.freeze({

    list:
        "/api/admin/trials",

    create:
        "/api/admin/trials",

    update:
        (trialId) =>
            `/api/admin/trials/${encodeURIComponent(trialId)}`,

    delete:
        (trialId) =>
            `/api/admin/trials/${encodeURIComponent(trialId)}`,

    bulkStatus:
        "/api/admin/trials/bulk-status",

    bulkDelete:
        "/api/admin/trials/bulk",

    logout:
        "/api/admin/logout"

});


/* ==========================================================
   FINAL PAGE ENHANCEMENT INITIALIZATION
========================================================== */

if (document.readyState === "loading") {

    document.addEventListener(
        "DOMContentLoaded",
        initializeAdminTrialsEnhancements,
        {
            once: true
        }
    );

} else {

    initializeAdminTrialsEnhancements();

}