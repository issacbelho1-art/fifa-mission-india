"use strict";

document.addEventListener("DOMContentLoaded", () => {
    const PAGE_SIZE = 10;
    const STORAGE_KEY = "bharatFootballFansAdminScouts";

    const $ = (id) => document.getElementById(id);

    const els = {
        loading: $("adminScoutsLoadingScreen"),
        sidebar: $("adminSidebar"),
        overlay: $("adminSidebarOverlay"),
        menu: $("adminMobileMenuButton"),
        sidebarClose: $("adminSidebarCloseButton"),

        globalSearch: $("adminGlobalSearch"),

        notificationsButton: $("adminNotificationsButton"),
        notificationsPanel: $("adminNotificationsPanel"),
        notificationsClose: $("adminNotificationsCloseButton"),

        accountButton: $("adminAccountButton"),
        accountMenu: $("adminAccountMenu"),

        logoutButton: $("adminLogoutButton"),
        accountLogout: $("adminAccountLogoutButton"),
        logoutModal: $("adminLogoutModal"),
        logoutBackdrop: $("adminLogoutModalBackdrop"),
        logoutClose: $("adminLogoutModalCloseButton"),
        logoutCancel: $("adminLogoutCancelButton"),
        logoutConfirm: $("adminLogoutConfirmButton"),

        total: $("scoutMetricTotal"),
        verified: $("scoutMetricVerified"),
        pending: $("scoutMetricPending"),
        active: $("scoutMetricActive"),

        filterForm: $("scoutFilterForm"),
        search: $("scoutSearchInput"),
        verification: $("scoutVerificationFilter"),
        accreditation: $("scoutLicenceFilter"),
        focus: $("scoutScouting FocusFilter"),
        state: $("scoutStateFilter"),
        availability: $("scoutAvailabilityFilter"),
        sort: $("scoutSortFilter"),
        reset: $("resetScoutFiltersButton"),
        refresh: $("refreshScoutsButton"),

        add: $("addScoutButton"),
        emptyAdd: $("emptyAddScoutButton"),
        export: $("exportScoutsButton"),

        tbody: $("scoutTableBody"),
        wrapper: $("scoutTableWrapper"),
        empty: $("scoutEmptyState"),
        summary: $("scoutPaginationSummary"),

        pagination: $("scoutPagination"),
        previous: $("previousScoutPageButton"),
        next: $("nextScoutPageButton"),

        selectAll: $("selectAllScoutsCheckbox"),

        bulk: $("scoutBulkActions"),
        selectedCount: $("selectedScoutCount"),
        bulkVerify: $("bulkVerifyScoutsButton"),
        bulkAvailable: $("bulkAvailableScoutsButton"),
        bulkUnavailable: $("bulkUnavailableScoutsButton"),
        bulkDelete: $("bulkDeleteScoutsButton"),
        clearSelection: $("clearScoutSelectionButton"),

        viewModal: $("viewScoutModal"),
        viewBackdrop: $("viewScoutModalBackdrop"),
        viewClose: $("viewScoutModalCloseButton"),
        viewContent: $("scoutDetailsContent"),
        viewEdit: $("editFromScoutDetailsButton"),
        viewDone: $("closeScoutDetailsButton"),

        addModal: $("addScoutModal"),
        addBackdrop: $("addScoutModalBackdrop"),
        addClose: $("addScoutModalCloseButton"),
        addForm: $("addScoutForm"),
        addCancel: $("cancelAddScoutButton"),

        editModal: $("editScoutModal"),
        editBackdrop: $("editScoutModalBackdrop"),
        editClose: $("editScoutModalCloseButton"),
        editForm: $("editScoutForm"),
        editCancel: $("cancelEditScoutButton"),

        verifyModal: $("verifyScoutModal"),
        verifyBackdrop: $("verifyScoutModalBackdrop"),
        verifyClose: $("verifyScoutModalCloseButton"),
        verifyName: $("verifyScoutName"),
        verifyCancel: $("cancelVerifyScoutButton"),
        verifyConfirm: $("confirmVerifyScoutButton"),

        deleteModal: $("deleteScoutModal"),
        deleteBackdrop: $("deleteScoutModalBackdrop"),
        deleteClose: $("deleteScoutModalCloseButton"),
        deleteForm: $("deleteScoutForm"),
        deleteId: $("deleteScoutId"),
        deleteName: $("deleteScoutName"),
        deleteConfirmInput: $("deleteScoutConfirmationInput"),
        deleteCancel: $("cancelDeleteScoutButton"),

        exportModal: $("exportScoutsModal"),
        exportBackdrop: $("exportScoutsModalBackdrop"),
        exportClose: $("exportScoutsModalCloseButton"),
        exportForm: $("exportScoutsForm"),
        exportCancel: $("cancelExportScoutsButton"),

        toast: $("adminScoutToastRegion")
    };

    const demoScouts = [
        createDemoScout(
            "SC-1001",
            "Arjun Mehta",
            "arjun.mehta@example.com",
            "+91 98765 41001",
            "Punjab",
            "Mohali",
            "elite",
            "talent-identification",
            12,
            74,
            "verified",
            "available",
            "active",
            "2026-07-21T17:45:00+05:30"
        ),

        createDemoScout(
            "SC-1002",
            "Neha Sharma",
            "neha.sharma@example.com",
            "+91 98765 41002",
            "Delhi",
            "New Delhi",
            "advanced",
            "data-analysis",
            8,
            63,
            "verified",
            "engaged",
            "active",
            "2026-07-20T14:10:00+05:30"
        ),

        createDemoScout(
            "SC-1003",
            "Samuel Ao",
            "samuel.ao@example.com",
            "+91 98765 41003",
            "Nagaland",
            "Dimapur",
            "intermediate",
            "regional-scouting",
            7,
            41,
            "pending",
            "available",
            "active",
            "2026-07-21T09:15:00+05:30"
        ),

        createDemoScout(
            "SC-1004",
            "Rohit Nair",
            "rohit.nair@example.com",
            "+91 98765 41004",
            "Kerala",
            "Kochi",
            "elite",
            "opposition-analysis",
            15,
            108,
            "verified",
            "engaged",
            "active",
            "2026-07-19T19:30:00+05:30"
        ),

        createDemoScout(
            "SC-1005",
            "Priya Das",
            "priya.das@example.com",
            "+91 98765 41005",
            "West Bengal",
            "Kolkata",
            "grassroots",
            "youth-scouting",
            5,
            29,
            "pending",
            "available",
            "active",
            "2026-07-21T08:40:00+05:30"
        ),

        createDemoScout(
            "SC-1006",
            "Vikram Singh",
            "vikram.singh@example.com",
            "+91 98765 41006",
            "Haryana",
            "Gurugram",
            "advanced",
            "goalkeeper-scouting",
            10,
            52,
            "verified",
            "unavailable",
            "inactive",
            "2026-07-18T16:20:00+05:30"
        ),

        createDemoScout(
            "SC-1007",
            "Farhan Ali",
            "farhan.ali@example.com",
            "+91 98765 41007",
            "Maharashtra",
            "Mumbai",
            "independent",
            "talent-identification",
            6,
            18,
            "rejected",
            "available",
            "suspended",
            "2026-07-20T10:05:00+05:30"
        ),

        createDemoScout(
            "SC-1008",
            "Tashi Bhutia",
            "tashi.bhutia@example.com",
            "+91 98765 41008",
            "Sikkim",
            "Gangtok",
            "advanced",
            "regional-scouting",
            11,
            69,
            "verified",
            "available",
            "active",
            "2026-07-17T12:30:00+05:30"
        ),

        createDemoScout(
            "SC-1009",
            "Ananya Reddy",
            "ananya.reddy@example.com",
            "+91 98765 41009",
            "Telangana",
            "Hyderabad",
            "intermediate",
            "data-analysis",
            6,
            34,
            "pending",
            "engaged",
            "active",
            "2026-07-21T16:00:00+05:30"
        )
    ];

    const state = {
        scouts: loadScoutData(),
        filtered: [],
        selected: new Set(),
        page: 1,
        currentId: null,
        deleteMany: false
    };

    function createDemoScout(
        id,
        name,
        email,
        phone,
        stateName,
        city,
        accreditation,
        specialisation,
        experienceYears,
        reportsSubmitted,
        verification,
        availability,
        accountStatus,
        updatedAt
    ) {
        return {
            id,
            name,
            email,
            phone,
            dateOfBirth: "",
            gender: "",
            photo: "",
            state: stateName,
            city,
            address: "",
            accreditation,
            accreditationNumber: `BFF-${id}`,
            specialisation,
            experienceYears,
            currentOrganisation: "Independent",
            playersScouted: Math.max(reportsSubmitted * 2, 20),
            preferredAgeGroup: "U-13 to U-21",
            availability,
            verification,
            accountStatus,
            profileCompletion: 85,
            reportsSubmitted,
            bio: "Football scout supporting talent identification across India.",
            note: "",
            createdAt: updatedAt,
            updatedAt
        };
    }

    function loadScoutData() {
        try {
            const storedData = localStorage.getItem(STORAGE_KEY);

            if (storedData) {
                const parsedData = JSON.parse(storedData);

                if (Array.isArray(parsedData)) {
                    return parsedData;
                }
            }
        } catch (error) {
            console.error("Unable to load scout data:", error);
        }

        const clonedData =
            typeof structuredClone === "function"
                ? structuredClone(demoScouts)
                : JSON.parse(JSON.stringify(demoScouts));

        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(clonedData)
        );

        return clonedData;
    }

    function saveScoutData() {
        try {
            localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify(state.scouts)
            );
        } catch (error) {
            console.error("Unable to save scout data:", error);

            showToast(
                "Save failed",
                "Scout data could not be saved.",
                "error"
            );
        }
    }

    function getScoutById(id) {
        return state.scouts.find(
            (scout) => scout.id === id
        );
    }

    function escapeHtml(value) {
        const element = document.createElement("div");

        element.textContent =
            value === undefined || value === null
                ? ""
                : String(value);

        return element.innerHTML;
    }

    function formatLabel(value) {
        if (!value) {
            return "Not provided";
        }

        return String(value)
            .replace(/[-_]/g, " ")
            .replace(
                /\b\w/g,
                (character) => character.toUpperCase()
            );
    }

    function getInitials(name) {
        return String(name || "SC")
            .trim()
            .split(/\s+/)
            .slice(0, 2)
            .map((word) => word.charAt(0))
            .join("")
            .toUpperCase();
    }

    function formatDate(value) {
        const dateObject = new Date(value);

        if (Number.isNaN(dateObject.getTime())) {
            return "—";
        }

        return new Intl.DateTimeFormat(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric"
            }
        ).format(dateObject);
    }

    function openModal(modal) {
        if (!modal) {
            return;
        }

        modal.hidden = false;
        modal.classList.add("is-open");

        document.body.classList.add(
            "admin-modal-open"
        );
    }

    function closeModal(modal) {
        if (!modal) {
            return;
        }

        modal.classList.remove("is-open");
        modal.hidden = true;

        const modalStillOpen =
            document.querySelector(
                ".admin-modal.is-open"
            );

        if (!modalStillOpen) {
            document.body.classList.remove(
                "admin-modal-open"
            );
        }
    }

    function closeAllModals() {
        [
            els.viewModal,
            els.addModal,
            els.editModal,
            els.verifyModal,
            els.deleteModal,
            els.exportModal,
            els.logoutModal
        ].forEach(closeModal);
    }

    function showToast(
        title,
        message,
        type = "success"
    ) {
        if (!els.toast) {
            return;
        }

        const toast = document.createElement("div");

        toast.className =
            `admin-toast ${type}`;

        toast.innerHTML = `
            <strong>
                ${escapeHtml(title)}
            </strong>

            <span>
                ${escapeHtml(message)}
            </span>
        `;

        els.toast.appendChild(toast);

        window.setTimeout(
            () => {
                toast.remove();
            },
            3500
        );
    }

    function populateStateFilter() {
        if (!els.state) {
            return;
        }

        const currentValue =
            els.state.value || "all";

        const states = [
            ...new Set(
                state.scouts
                    .map((scout) => scout.state)
                    .filter(Boolean)
            )
        ].sort();

        els.state.innerHTML = `
            <option value="all">
                All States
            </option>

            ${states
                .map(
                    (stateName) => `
                        <option value="${escapeHtml(stateName)}">
                            ${escapeHtml(stateName)}
                        </option>
                    `
                )
                .join("")}
        `;

        els.state.value =
            states.includes(currentValue)
                ? currentValue
                : "all";
    }

    function applyFilters() {
        const searchValue =
            (els.search?.value || "")
                .trim()
                .toLowerCase();

        const verification =
            els.verification?.value || "all";

        const accreditation =
            els.accreditation?.value || "all";

        const specialisation =
            els.focus?.value || "all";

        const stateName =
            els.state?.value || "all";

        const availability =
            els.availability?.value || "all";

        const sort =
            els.sort?.value || "newest";

        state.filtered =
            state.scouts.filter(
                (scout) => {
                    const searchableText =
                        Object.values(scout)
                            .join(" ")
                            .toLowerCase();

                    return (
                        (
                            !searchValue ||
                            searchableText.includes(
                                searchValue
                            )
                        ) &&
                        (
                            verification === "all" ||
                            scout.verification ===
                                verification
                        ) &&
                        (
                            accreditation === "all" ||
                            scout.accreditation ===
                                accreditation
                        ) &&
                        (
                            specialisation === "all" ||
                            scout.specialisation ===
                                specialisation
                        ) &&
                        (
                            stateName === "all" ||
                            scout.state === stateName
                        ) &&
                        (
                            availability === "all" ||
                            scout.availability ===
                                availability
                        )
                    );
                }
            );

        const sortingFunctions = {
            newest: (first, second) =>
                new Date(second.createdAt) -
                new Date(first.createdAt),

            oldest: (first, second) =>
                new Date(first.createdAt) -
                new Date(second.createdAt),

            "name-asc": (first, second) =>
                first.name.localeCompare(
                    second.name
                ),

            "name-desc": (first, second) =>
                second.name.localeCompare(
                    first.name
                ),

            "experience-high": (
                first,
                second
            ) =>
                second.experienceYears -
                first.experienceYears,

            "reports-high": (
                first,
                second
            ) =>
                second.reportsSubmitted -
                first.reportsSubmitted
        };

        state.filtered.sort(
            sortingFunctions[sort] ||
            sortingFunctions.newest
        );

        const totalPages =
            Math.max(
                1,
                Math.ceil(
                    state.filtered.length /
                    PAGE_SIZE
                )
            );

        state.page =
            Math.min(
                state.page,
                totalPages
            );

        renderAll();
    }

    function renderAll() {
        renderMetrics();
        renderTable();
        renderPagination();
        renderBulkActions();
    }

    function renderMetrics() {
        if (els.total) {
            els.total.textContent =
                state.scouts.length;
        }

        if (els.verified) {
            els.verified.textContent =
                state.scouts.filter(
                    (scout) =>
                        scout.verification ===
                        "verified"
                ).length;
        }

        if (els.pending) {
            els.pending.textContent =
                state.scouts.filter(
                    (scout) =>
                        scout.verification ===
                        "pending"
                ).length;
        }

        if (els.active) {
            els.active.textContent =
                state.scouts.filter(
                    (scout) =>
                        scout.accountStatus ===
                        "active"
                ).length;
        }
    }

    function renderTable() {
        if (!els.tbody) {
            return;
        }

        const startIndex =
            (state.page - 1) *
            PAGE_SIZE;

        const visibleScouts =
            state.filtered.slice(
                startIndex,
                startIndex + PAGE_SIZE
            );

        els.tbody.innerHTML =
            visibleScouts
                .map(
                    (scout) => `
                        <tr>

                            <td>
                                <input
                                    class="scout-row-checkbox"
                                    type="checkbox"
                                    data-id="${escapeHtml(
                                        scout.id
                                    )}"
                                    ${
                                        state.selected.has(
                                            scout.id
                                        )
                                            ? "checked"
                                            : ""
                                    }
                                >
                            </td>

                            <td>

                                <div class="admin-table-person">

                                    <div class="admin-table-avatar">

                                        ${
                                            scout.photo
                                                ? `
                                                    <img
                                                        src="${escapeHtml(
                                                            scout.photo
                                                        )}"
                                                        alt=""
                                                    >
                                                `
                                                : escapeHtml(
                                                    getInitials(
                                                        scout.name
                                                    )
                                                )
                                        }

                                    </div>

                                    <div>

                                        <strong>
                                            ${escapeHtml(
                                                scout.name
                                            )}
                                        </strong>

                                        <span>
                                            ${escapeHtml(
                                                scout.email
                                            )}
                                        </span>

                                    </div>

                                </div>

                            </td>

                            <td>

                                <strong>
                                    ${escapeHtml(
                                        formatLabel(
                                            scout.accreditation
                                        )
                                    )}
                                </strong>

                                <br>

                                <small>
                                    ${escapeHtml(
                                        scout.accreditationNumber ||
                                        "—"
                                    )}
                                </small>

                            </td>

                            <td>
                                ${escapeHtml(
                                    formatLabel(
                                        scout.specialisation
                                    )
                                )}
                            </td>

                            <td>
                                ${escapeHtml(
                                    scout.city
                                )},
                                ${escapeHtml(
                                    scout.state
                                )}
                            </td>

                            <td>
                                ${
                                    Number(
                                        scout.experienceYears
                                    ) || 0
                                } yrs
                            </td>

                            <td>
                                ${
                                    Number(
                                        scout.reportsSubmitted
                                    ) || 0
                                }
                            </td>

                            <td>

                                <span
                                    class="admin-status-badge ${escapeHtml(
                                        scout.verification
                                    )}"
                                >
                                    ${escapeHtml(
                                        formatLabel(
                                            scout.verification
                                        )
                                    )}
                                </span>

                            </td>

                            <td>

                                <span
                                    class="admin-availability-badge ${escapeHtml(
                                        scout.availability
                                    )}"
                                >
                                    ${escapeHtml(
                                        formatLabel(
                                            scout.availability
                                        )
                                    )}
                                </span>

                            </td>

                            <td>
                                ${formatDate(
                                    scout.updatedAt
                                )}
                            </td>

                            <td>

                                <div class="admin-table-actions">

                                    <button
                                        class="admin-table-action-button"
                                        type="button"
                                        data-action="view"
                                        data-id="${escapeHtml(
                                            scout.id
                                        )}"
                                        aria-label="View scout"
                                    >

                                        <i
                                            class="fa-regular fa-eye"
                                            aria-hidden="true"
                                        ></i>

                                    </button>

                                    <button
                                        class="admin-table-action-button"
                                        type="button"
                                        data-action="edit"
                                        data-id="${escapeHtml(
                                            scout.id
                                        )}"
                                        aria-label="Edit scout"
                                    >

                                        <i
                                            class="fa-regular fa-pen-to-square"
                                            aria-hidden="true"
                                        ></i>

                                    </button>

                                    ${
                                        scout.verification !==
                                        "verified"
                                            ? `
                                                <button
                                                    class="admin-table-action-button"
                                                    type="button"
                                                    data-action="verify"
                                                    data-id="${escapeHtml(
                                                        scout.id
                                                    )}"
                                                    aria-label="Verify scout"
                                                >

                                                    <i
                                                        class="fa-solid fa-circle-check"
                                                        aria-hidden="true"
                                                    ></i>

                                                </button>
                                            `
                                            : ""
                                    }

                                    <button
                                        class="admin-table-action-button danger"
                                        type="button"
                                        data-action="delete"
                                        data-id="${escapeHtml(
                                            scout.id
                                        )}"
                                        aria-label="Delete scout"
                                    >

                                        <i
                                            class="fa-regular fa-trash-can"
                                            aria-hidden="true"
                                        ></i>

                                    </button>

                                </div>

                            </td>

                        </tr>
                    `
                )
                .join("");

        const noResults =
            visibleScouts.length === 0;

        if (els.wrapper) {
            els.wrapper.hidden =
                noResults;
        }

        if (els.empty) {
            els.empty.hidden =
                !noResults;
        }

        if (els.summary) {
            els.summary.textContent =
                noResults
                    ? "Showing 0 scouts"
                    : `Showing ${
                        startIndex + 1
                    }–${
                        startIndex +
                        visibleScouts.length
                    } of ${
                        state.filtered.length
                    } scouts`;
        }

        updateSelectAllCheckbox(
            visibleScouts
        );
    }

    function updateSelectAllCheckbox(
        visibleScouts
    ) {
        if (!els.selectAll) {
            return;
        }

        const visibleIds =
            visibleScouts.map(
                (scout) => scout.id
            );

        const allSelected =
            visibleIds.length > 0 &&
            visibleIds.every(
                (id) =>
                    state.selected.has(id)
            );

        const someSelected =
            visibleIds.some(
                (id) =>
                    state.selected.has(id)
            );

        els.selectAll.checked =
            allSelected;

        els.selectAll.indeterminate =
            someSelected &&
            !allSelected;
    }

    function renderPagination() {
        if (!els.pagination) {
            return;
        }

        const totalPages =
            Math.max(
                1,
                Math.ceil(
                    state.filtered.length /
                    PAGE_SIZE
                )
            );

        els.pagination.innerHTML =
            Array.from(
                {
                    length:
                        totalPages
                },
                (_, index) => {
                    const pageNumber =
                        index + 1;

                    return `
                        <button
                            class="admin-pagination-page ${
                                pageNumber ===
                                state.page
                                    ? "active"
                                    : ""
                            }"
                            type="button"
                            data-page="${pageNumber}"
                        >
                            ${pageNumber}
                        </button>
                    `;
                }
            ).join("");

        if (els.previous) {
            els.previous.disabled =
                state.page === 1;
        }

        if (els.next) {
            els.next.disabled =
                state.page ===
                totalPages;
        }
    }

    function renderBulkActions() {
        if (!els.bulk) {
            return;
        }

        const selectedAmount =
            state.selected.size;

        els.bulk.hidden =
            selectedAmount === 0;

        if (els.selectedCount) {
            els.selectedCount.textContent =
                `${selectedAmount} scout${
                    selectedAmount === 1
                        ? ""
                        : "s"
                } selected`;
        }
    }

    function showScoutDetails(id) {
        const scout =
            getScoutById(id);

        if (!scout) {
            return;
        }

        state.currentId =
            id;

        if (els.viewContent) {
            els.viewContent.innerHTML = `
                <div class="admin-detail-grid">

                    ${createDetailItem(
                        "Name",
                        scout.name
                    )}

                    ${createDetailItem(
                        "Email",
                        scout.email
                    )}

                    ${createDetailItem(
                        "Phone",
                        scout.phone
                    )}

                    ${createDetailItem(
                        "Location",
                        `${scout.city}, ${scout.state}`
                    )}

                    ${createDetailItem(
                        "Accreditation",
                        formatLabel(
                            scout.accreditation
                        )
                    )}

                    ${createDetailItem(
                        "Licence Number",
                        scout.accreditationNumber
                    )}

                    ${createDetailItem(
                        "Scouting Focus",
                        formatLabel(
                            scout.specialisation
                        )
                    )}

                    ${createDetailItem(
                        "Experience",
                        `${scout.experienceYears} years`
                    )}

                    ${createDetailItem(
                        "Reports",
                        scout.reportsSubmitted
                    )}

                    ${createDetailItem(
                        "Availability",
                        formatLabel(
                            scout.availability
                        )
                    )}

                    ${createDetailItem(
                        "Verification",
                        formatLabel(
                            scout.verification
                        )
                    )}

                    ${createDetailItem(
                        "Account",
                        formatLabel(
                            scout.accountStatus
                        )
                    )}

                    ${createDetailItem(
                        "Bio",
                        scout.bio ||
                        "Not provided"
                    )}

                </div>
            `;
        }

        openModal(
            els.viewModal
        );
    }

    function createDetailItem(
        title,
        value
    ) {
        return `
            <div class="admin-detail-item">

                <span>
                    ${escapeHtml(title)}
                </span>

                <strong>
                    ${escapeHtml(
                        value ?? "—"
                    )}
                </strong>

            </div>
        `;
    }

    function readFormData(form) {
        const formData =
            new FormData(form);

        const currentTime =
            new Date()
                .toISOString();

        return {
            name:
                String(
                    formData.get("name") ||
                    ""
                ).trim(),

            email:
                String(
                    formData.get("email") ||
                    ""
                ).trim(),

            phone:
                String(
                    formData.get("phone") ||
                    ""
                ).trim(),

            dateOfBirth:
                String(
                    formData.get(
                        "dateOfBirth"
                    ) || ""
                ),

            gender:
                String(
                    formData.get("gender") ||
                    ""
                ),

            photo:
                String(
                    formData.get("photo") ||
                    ""
                ).trim(),

            state:
                String(
                    formData.get("state") ||
                    ""
                ).trim(),

            city:
                String(
                    formData.get("city") ||
                    ""
                ).trim(),

            address:
                String(
                    formData.get("address") ||
                    ""
                ).trim(),

            accreditation:
                String(
                    formData.get(
                        "accreditation"
                    ) || "other"
                ),

            accreditationNumber:
                String(
                    formData.get(
                        "accreditationNumber"
                    ) || ""
                ).trim(),

            specialisation:
                String(
                    formData.get(
                        "scouting focus"
                    ) || "other"
                ),

            experienceYears:
                Number(
                    formData.get(
                        "experienceYears"
                    )
                ) || 0,

            currentOrganisation:
                String(
                    formData.get(
                        "currentOrganisation"
                    ) || ""
                ).trim(),

            playersScouted:
                Number(
                    formData.get(
                        "playersScouted"
                    )
                ) || 0,

            preferredAgeGroup:
                String(
                    formData.get(
                        "preferredAgeGroup"
                    ) || ""
                ).trim(),

            availability:
                String(
                    formData.get(
                        "availability"
                    ) || "available"
                ),

            verification:
                String(
                    formData.get(
                        "verification"
                    ) || "pending"
                ),

            accountStatus:
                String(
                    formData.get(
                        "accountStatus"
                    ) || "active"
                ),

            profileCompletion:
                Math.min(
                    100,
                    Math.max(
                        0,
                        Number(
                            formData.get(
                                "profileCompletion"
                            )
                        ) || 0
                    )
                ),

            bio:
                String(
                    formData.get("bio") ||
                    ""
                ).trim(),

            note:
                String(
                    formData.get("note") ||
                    ""
                ).trim(),

            reportsSubmitted: 0,

            updatedAt:
                currentTime
        };
    }

    function validateScoutData(data) {
        if (
            !data.name ||
            !data.email ||
            !data.phone ||
            !data.state ||
            !data.city
        ) {
            showToast(
                "Missing information",
                "Complete all required fields.",
                "error"
            );

            return false;
        }

        const validEmail =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (
            !validEmail.test(
                data.email
            )
        ) {
            showToast(
                "Invalid email",
                "Enter a valid email address.",
                "error"
            );

            return false;
        }

        return true;
    }

    function fillScoutForm(
        form,
        scout
    ) {
        if (
            !form ||
            !scout
        ) {
            return;
        }

        Object.entries(
            scout
        ).forEach(
            ([key, value]) => {
                const fieldName =
                    key === "specialisation"
                        ? "scouting focus"
                        : key;

                const field =
                    form.elements.namedItem(
                        fieldName
                    );

                if (field) {
                    field.value =
                        value ?? "";
                }
            }
        );

        const hiddenId =
            form.elements.namedItem(
                "scoutId"
            );

        if (hiddenId) {
            hiddenId.value =
                scout.id;
        }
    }

    function createNextScoutId() {
        const highestNumber =
            state.scouts.reduce(
                (
                    currentHighest,
                    scout
                ) => {
                    const number =
                        Number(
                            String(
                                scout.id
                            ).replace(
                                /\D/g,
                                ""
                            )
                        ) || 1000;

                    return Math.max(
                        currentHighest,
                        number
                    );
                },
                1000
            );

        return `SC-${
            highestNumber + 1
        }`;
    }

    function openEditScout(id) {
        const scout =
            getScoutById(id);

        if (!scout) {
            return;
        }

        state.currentId =
            id;

        fillScoutForm(
            els.editForm,
            scout
        );

        closeModal(
            els.viewModal
        );

        openModal(
            els.editModal
        );
    }

    function openVerifyScout(id) {
        const scout =
            getScoutById(id);

        if (!scout) {
            return;
        }

        state.currentId =
            id;

        if (els.verifyName) {
            els.verifyName.textContent =
                scout.name;
        }

        openModal(
            els.verifyModal
        );
    }

    function openDeleteScout(
        id,
        deleteMany = false
    ) {
        state.currentId =
            id;

        state.deleteMany =
            deleteMany;

        const scout =
            getScoutById(id);

        if (els.deleteName) {
            els.deleteName.textContent =
                deleteMany
                    ? `${state.selected.size} selected scouts`
                    : scout?.name ||
                      "this scout";
        }

        if (els.deleteId) {
            els.deleteId.value =
                id || "";
        }

        if (els.deleteConfirmInput) {
            els.deleteConfirmInput.value =
                "";
        }

        openModal(
            els.deleteModal
        );
    }

    function downloadFile(
        content,
        fileName,
        mimeType
    ) {
        const blob =
            new Blob(
                [content],
                {
                    type:
                        mimeType
                }
            );

        const objectUrl =
            URL.createObjectURL(
                blob
            );

        const link =
            document.createElement(
                "a"
            );

        link.href =
            objectUrl;

        link.download =
            fileName;

        document.body.appendChild(
            link
        );

        link.click();

        link.remove();

        URL.revokeObjectURL(
            objectUrl
        );
    }

    function exportScouts(
        scope,
        format
    ) {
        let exportList =
            state.scouts;

        if (
            scope === "selected"
        ) {
            exportList =
                state.scouts.filter(
                    (scout) =>
                        state.selected.has(
                            scout.id
                        )
                );
        }

        if (
            scope === "filtered"
        ) {
            exportList =
                state.filtered;
        }

        if (
            exportList.length === 0
        ) {
            showToast(
                "Nothing to export",
                "No scout records match the selected scope.",
                "warning"
            );

            return;
        }

        if (
            format === "json"
        ) {
            downloadFile(
                JSON.stringify(
                    exportList,
                    null,
                    2
                ),
                "admin-scouts.json",
                "application/json"
            );
        } else {
            const keys = [
                "id",
                "name",
                "email",
                "phone",
                "state",
                "city",
                "accreditation",
                "specialisation",
                "experienceYears",
                "reportsSubmitted",
                "verification",
                "availability",
                "accountStatus",
                "updatedAt"
            ];

            const csvRows = [
                keys.join(","),

                ...exportList.map(
                    (scout) =>
                        keys
                            .map(
                                (key) =>
                                    `"${String(
                                        scout[key] ??
                                        ""
                                    ).replace(
                                        /"/g,
                                        '""'
                                    )}"`
                            )
                            .join(",")
                )
            ];

            downloadFile(
                csvRows.join("\n"),
                "admin-scouts.csv",
                "text/csv"
            );
        }

        closeModal(
            els.exportModal
        );

        showToast(
            "Export complete",
            `${exportList.length} scout records exported.`
        );
    }

    function bindEvents() {
        els.menu?.addEventListener(
            "click",
            () => {
                els.sidebar?.classList.add(
                    "is-open"
                );

                if (els.overlay) {
                    els.overlay.hidden =
                        false;
                }
            }
        );

        [
            els.sidebarClose,
            els.overlay
        ].forEach(
            (element) =>
                element?.addEventListener(
                    "click",
                    () => {
                        els.sidebar?.classList.remove(
                            "is-open"
                        );

                        if (els.overlay) {
                            els.overlay.hidden =
                                true;
                        }
                    }
                )
        );

        els.notificationsButton?.addEventListener(
            "click",
            () => {
                if (
                    els.notificationsPanel
                ) {
                    els.notificationsPanel.hidden =
                        !els.notificationsPanel.hidden;
                }
            }
        );

        els.notificationsClose?.addEventListener(
            "click",
            () => {
                if (
                    els.notificationsPanel
                ) {
                    els.notificationsPanel.hidden =
                        true;
                }
            }
        );

        els.accountButton?.addEventListener(
            "click",
            (event) => {
                event.stopPropagation();

                if (els.accountMenu) {
                    els.accountMenu.hidden =
                        !els.accountMenu.hidden;
                }
            }
        );

        [
            els.logoutButton,
            els.accountLogout
        ].forEach(
            (element) =>
                element?.addEventListener(
                    "click",
                    () =>
                        openModal(
                            els.logoutModal
                        )
                )
        );

        [
            els.logoutBackdrop,
            els.logoutClose,
            els.logoutCancel
        ].forEach(
            (element) =>
                element?.addEventListener(
                    "click",
                    () =>
                        closeModal(
                            els.logoutModal
                        )
                )
        );

        els.logoutConfirm?.addEventListener(
            "click",
            () => {
                showToast(
                    "Signed out",
                    "Redirecting to login.",
                    "info"
                );

                window.setTimeout(
                    () => {
                        window.location.href =
                            "admin-login.html";
                    },
                    700
                );
            }
        );

        els.globalSearch?.addEventListener(
            "input",
            () => {
                if (els.search) {
                    els.search.value =
                        els.globalSearch.value;
                }

                state.page = 1;

                applyFilters();
            }
        );

        els.filterForm?.addEventListener(
            "submit",
            (event) => {
                event.preventDefault();

                state.page = 1;

                applyFilters();
            }
        );

        [
            els.search,
            els.verification,
            els.accreditation,
            els.focus,
            els.state,
            els.availability,
            els.sort
        ].forEach(
            (element) => {
                if (!element) {
                    return;
                }

                const eventName =
                    element === els.search
                        ? "input"
                        : "change";

                element.addEventListener(
                    eventName,
                    () => {
                        state.page = 1;

                        applyFilters();
                    }
                );
            }
        );

        els.reset?.addEventListener(
            "click",
            () => {
                els.filterForm?.reset();

                state.page = 1;

                applyFilters();
            }
        );

        els.refresh?.addEventListener(
            "click",
            () => {
                populateStateFilter();

                applyFilters();

                showToast(
                    "Refreshed",
                    "Scout directory updated.",
                    "info"
                );
            }
        );

        [
            els.add,
            els.emptyAdd
        ].forEach(
            (element) =>
                element?.addEventListener(
                    "click",
                    () => {
                        els.addForm?.reset();

                        openModal(
                            els.addModal
                        );
                    }
                )
        );

        [
            els.addBackdrop,
            els.addClose,
            els.addCancel
        ].forEach(
            (element) =>
                element?.addEventListener(
                    "click",
                    () =>
                        closeModal(
                            els.addModal
                        )
                )
        );

        els.addForm?.addEventListener(
            "submit",
            (event) => {
                event.preventDefault();

                const data =
                    readFormData(
                        els.addForm
                    );

                if (
                    !validateScoutData(
                        data
                    )
                ) {
                    return;
                }

                data.id =
                    createNextScoutId();

                data.createdAt =
                    data.updatedAt;

                state.scouts.unshift(
                    data
                );

                saveScoutData();

                populateStateFilter();

                applyFilters();

                closeModal(
                    els.addModal
                );

                showToast(
                    "Scout added",
                    `${data.name} was added successfully.`
                );
            }
        );

        [
            els.editBackdrop,
            els.editClose,
            els.editCancel
        ].forEach(
            (element) =>
                element?.addEventListener(
                    "click",
                    () =>
                        closeModal(
                            els.editModal
                        )
                )
        );

        els.editForm?.addEventListener(
            "submit",
            (event) => {
                event.preventDefault();

                const data =
                    readFormData(
                        els.editForm
                    );

                if (
                    !validateScoutData(
                        data
                    )
                ) {
                    return;
                }

                const existingScout =
                    getScoutById(
                        state.currentId
                    );

                if (!existingScout) {
                    return;
                }

                Object.assign(
                    existingScout,
                    data,
                    {
                        id:
                            existingScout.id,

                        createdAt:
                            existingScout.createdAt,

                        reportsSubmitted:
                            existingScout.reportsSubmitted
                    }
                );

                saveScoutData();

                populateStateFilter();

                applyFilters();

                closeModal(
                    els.editModal
                );

                showToast(
                    "Scout updated",
                    `${existingScout.name} was updated.`
                );
            }
        );

        [
            els.viewBackdrop,
            els.viewClose,
            els.viewDone
        ].forEach(
            (element) =>
                element?.addEventListener(
                    "click",
                    () =>
                        closeModal(
                            els.viewModal
                        )
                )
        );

        els.viewEdit?.addEventListener(
            "click",
            () =>
                openEditScout(
                    state.currentId
                )
        );

        [
            els.verifyBackdrop,
            els.verifyClose,
            els.verifyCancel
        ].forEach(
            (element) =>
                element?.addEventListener(
                    "click",
                    () =>
                        closeModal(
                            els.verifyModal
                        )
                )
        );

        els.verifyConfirm?.addEventListener(
            "click",
            () => {
                const scout =
                    getScoutById(
                        state.currentId
                    );

                if (!scout) {
                    return;
                }

                scout.verification =
                    "verified";

                scout.updatedAt =
                    new Date()
                        .toISOString();

                saveScoutData();

                applyFilters();

                closeModal(
                    els.verifyModal
                );

                showToast(
                    "Scout verified",
                    `${scout.name} is now verified.`
                );
            }
        );

        [
            els.deleteBackdrop,
            els.deleteClose,
            els.deleteCancel
        ].forEach(
            (element) =>
                element?.addEventListener(
                    "click",
                    () =>
                        closeModal(
                            els.deleteModal
                        )
                )
        );

        els.deleteForm?.addEventListener(
            "submit",
            (event) => {
                event.preventDefault();

                const confirmation =
                    (
                        els.deleteConfirmInput
                            ?.value || ""
                    )
                        .trim()
                        .toUpperCase();

                if (
                    confirmation !==
                    "DELETE"
                ) {
                    showToast(
                        "Confirmation required",
                        "Type DELETE to continue.",
                        "error"
                    );

                    return;
                }

                if (
                    state.deleteMany
                ) {
                    state.scouts =
                        state.scouts.filter(
                            (scout) =>
                                !state.selected.has(
                                    scout.id
                                )
                        );

                    state.selected.clear();
                } else {
                    state.scouts =
                        state.scouts.filter(
                            (scout) =>
                                scout.id !==
                                state.currentId
                        );

                    state.selected.delete(
                        state.currentId
                    );
                }

                saveScoutData();

                populateStateFilter();

                applyFilters();

                closeModal(
                    els.deleteModal
                );

                showToast(
                    "Deleted",
                    "Scout record removed."
                );
            }
        );

        els.export?.addEventListener(
            "click",
            () =>
                openModal(
                    els.exportModal
                )
        );

        [
            els.exportBackdrop,
            els.exportClose,
            els.exportCancel
        ].forEach(
            (element) =>
                element?.addEventListener(
                    "click",
                    () =>
                        closeModal(
                            els.exportModal
                        )
                )
        );

        els.exportForm?.addEventListener(
            "submit",
            (event) => {
                event.preventDefault();

                const formData =
                    new FormData(
                        els.exportForm
                    );

                exportScouts(
                    String(
                        formData.get(
                            "scope"
                        ) || "all"
                    ),
                    String(
                        formData.get(
                            "format"
                        ) || "csv"
                    )
                );
            }
        );

        els.tbody?.addEventListener(
            "click",
            (event) => {
                const button =
                    event.target.closest(
                        "[data-action]"
                    );

                if (!button) {
                    return;
                }

                const action =
                    button.dataset.action;

                const scoutId =
                    button.dataset.id;

                if (
                    action === "view"
                ) {
                    showScoutDetails(
                        scoutId
                    );
                }

                if (
                    action === "edit"
                ) {
                    openEditScout(
                        scoutId
                    );
                }

                if (
                    action === "verify"
                ) {
                    openVerifyScout(
                        scoutId
                    );
                }

                if (
                    action === "delete"
                ) {
                    openDeleteScout(
                        scoutId
                    );
                }
            }
        );

        els.tbody?.addEventListener(
            "change",
            (event) => {
                if (
                    !event.target.matches(
                        ".scout-row-checkbox"
                    )
                ) {
                    return;
                }

                const scoutId =
                    event.target.dataset.id;

                if (
                    event.target.checked
                ) {
                    state.selected.add(
                        scoutId
                    );
                } else {
                    state.selected.delete(
                        scoutId
                    );
                }

                renderAll();
            }
        );

        els.selectAll?.addEventListener(
            "change",
            () => {
                const startIndex =
                    (state.page - 1) *
                    PAGE_SIZE;

                const visibleScouts =
                    state.filtered.slice(
                        startIndex,
                        startIndex +
                        PAGE_SIZE
                    );

                visibleScouts.forEach(
                    (scout) => {
                        if (
                            els.selectAll.checked
                        ) {
                            state.selected.add(
                                scout.id
                            );
                        } else {
                            state.selected.delete(
                                scout.id
                            );
                        }
                    }
                );

                renderAll();
            }
        );

        els.pagination?.addEventListener(
            "click",
            (event) => {
                const button =
                    event.target.closest(
                        "[data-page]"
                    );

                if (!button) {
                    return;
                }

                state.page =
                    Number(
                        button.dataset.page
                    );

                renderAll();
            }
        );

        els.previous?.addEventListener(
            "click",
            () => {
                if (
                    state.page > 1
                ) {
                    state.page -= 1;

                    renderAll();
                }
            }
        );

        els.next?.addEventListener(
            "click",
            () => {
                const totalPages =
                    Math.max(
                        1,
                        Math.ceil(
                            state.filtered.length /
                            PAGE_SIZE
                        )
                    );

                if (
                    state.page <
                    totalPages
                ) {
                    state.page += 1;

                    renderAll();
                }
            }
        );

        els.clearSelection?.addEventListener(
            "click",
            () => {
                state.selected.clear();

                renderAll();
            }
        );

        els.bulkVerify?.addEventListener(
            "click",
            () => {
                state.scouts.forEach(
                    (scout) => {
                        if (
                            state.selected.has(
                                scout.id
                            )
                        ) {
                            scout.verification =
                                "verified";
                        }
                    }
                );

                saveScoutData();

                applyFilters();

                showToast(
                    "Scouts verified",
                    "Selected scouts were verified."
                );
            }
        );

        els.bulkAvailable?.addEventListener(
            "click",
            () => {
                state.scouts.forEach(
                    (scout) => {
                        if (
                            state.selected.has(
                                scout.id
                            )
                        ) {
                            scout.availability =
                                "available";
                        }
                    }
                );

                saveScoutData();

                applyFilters();

                showToast(
                    "Availability updated",
                    "Selected scouts are now available."
                );
            }
        );

        els.bulkUnavailable?.addEventListener(
            "click",
            () => {
                state.scouts.forEach(
                    (scout) => {
                        if (
                            state.selected.has(
                                scout.id
                            )
                        ) {
                            scout.availability =
                                "unavailable";
                        }
                    }
                );

                saveScoutData();

                applyFilters();

                showToast(
                    "Availability updated",
                    "Selected scouts are now unavailable."
                );
            }
        );

        els.bulkDelete?.addEventListener(
            "click",
            () =>
                openDeleteScout(
                    "",
                    true
                )
        );

        document.addEventListener(
            "click",
            (event) => {
                if (
                    els.accountMenu &&
                    !els.accountMenu.hidden &&
                    !els.accountMenu.contains(
                        event.target
                    ) &&
                    !els.accountButton?.contains(
                        event.target
                    )
                ) {
                    els.accountMenu.hidden =
                        true;
                }
            }
        );

        document.addEventListener(
            "keydown",
            (event) => {
                if (
                    event.key === "Escape"
                ) {
                    closeAllModals();
                }

                if (
                    event.key === "/" &&
                    !/INPUT|TEXTAREA|SELECT/.test(
                        document.activeElement
                            .tagName
                    )
                ) {
                    event.preventDefault();

                    els.globalSearch?.focus();
                }
            }
        );
    }

    populateStateFilter();

    bindEvents();

    applyFilters();

    window.setTimeout(
        () => {
            if (!els.loading) {
                return;
            }

            els.loading.classList.add(
                "is-hidden"
            );

            window.setTimeout(
                () => {
                    els.loading.hidden =
                        true;
                },
                400
            );
        },
        350
    );
});