"use strict";

document.addEventListener("DOMContentLoaded", () => {

    const STORAGE_KEY = "bffAdminCoaches";
    const PAGE_SIZE = 10;

    const byId = (id) =>
        document.getElementById(id);


    /* ======================================================
       DOM ELEMENTS
    ====================================================== */

    const elements = {

        loading:
            byId("adminCoachesLoadingScreen"),

        sidebar:
            byId("adminSidebar"),

        sidebarOverlay:
            byId("adminSidebarOverlay"),

        mobileMenu:
            byId("adminMobileMenuButton"),

        sidebarClose:
            byId("adminSidebarCloseButton"),


        globalSearch:
            byId("adminGlobalSearch"),

        notificationsButton:
            byId("adminNotificationsButton"),

        notificationsPanel:
            byId("adminNotificationsPanel"),

        notificationsClose:
            byId("adminNotificationsCloseButton"),

        accountButton:
            byId("adminAccountButton"),

        accountMenu:
            byId("adminAccountMenu"),


        logoutButton:
            byId("adminLogoutButton"),

        accountLogoutButton:
            byId("adminAccountLogoutButton"),

        logoutModal:
            byId("adminLogoutModal"),

        logoutBackdrop:
            byId("adminLogoutModalBackdrop"),

        logoutClose:
            byId("adminLogoutModalCloseButton"),

        logoutCancel:
            byId("adminLogoutCancelButton"),

        logoutConfirm:
            byId("adminLogoutConfirmButton"),


        metricTotal:
            byId("coachMetricTotal"),

        metricVerified:
            byId("coachMetricVerified"),

        metricPending:
            byId("coachMetricPending"),

        metricActive:
            byId("coachMetricActive"),


        filterForm:
            byId("coachFilterForm"),

        search:
            byId("coachSearchInput"),

        verification:
            byId("coachVerificationFilter"),

        licence:
            byId("coachLicenceFilter"),

        specialisation:
            byId("coachSpecialisationFilter"),

        state:
            byId("coachStateFilter"),

        availability:
            byId("coachAvailabilityFilter"),

        sort:
            byId("coachSortFilter"),

        reset:
            byId("resetCoachFiltersButton"),

        refresh:
            byId("refreshCoachesButton"),


        addButton:
            byId("addCoachButton"),

        emptyAddButton:
            byId("emptyAddCoachButton"),

        exportButton:
            byId("exportCoachesButton"),


        table:
            byId("coachTable"),

        tableBody:
            byId("coachTableBody"),

        tableWrapper:
            byId("coachTableWrapper"),

        emptyState:
            byId("coachEmptyState"),

        pagination:
            byId("coachPagination"),

        paginationSummary:
            byId("coachPaginationSummary"),

        previousPage:
            byId("previousCoachPageButton"),

        nextPage:
            byId("nextCoachPageButton"),

        selectAll:
            byId("selectAllCoachesCheckbox"),


        bulkActions:
            byId("coachBulkActions"),

        selectedCount:
            byId("selectedCoachCount"),

        bulkVerify:
            byId("bulkVerifyCoachesButton"),

        bulkAvailable:
            byId("bulkAvailableCoachesButton"),

        bulkUnavailable:
            byId("bulkUnavailableCoachesButton"),

        bulkDelete:
            byId("bulkDeleteCoachesButton"),

        clearSelection:
            byId("clearCoachSelectionButton"),


        viewModal:
            byId("viewCoachModal"),

        viewBackdrop:
            byId("viewCoachModalBackdrop"),

        viewClose:
            byId("viewCoachModalCloseButton"),

        detailsContent:
            byId("coachDetailsContent"),

        editFromDetails:
            byId("editFromCoachDetailsButton"),

        closeDetails:
            byId("closeCoachDetailsButton"),


        addModal:
            byId("addCoachModal"),

        addBackdrop:
            byId("addCoachModalBackdrop"),

        addClose:
            byId("addCoachModalCloseButton"),

        addForm:
            byId("addCoachForm"),

        addCancel:
            byId("cancelAddCoachButton"),


        editModal:
            byId("editCoachModal"),

        editBackdrop:
            byId("editCoachModalBackdrop"),

        editClose:
            byId("editCoachModalCloseButton"),

        editForm:
            byId("editCoachForm"),

        editCancel:
            byId("cancelEditCoachButton"),


        verifyModal:
            byId("verifyCoachModal"),

        verifyBackdrop:
            byId("verifyCoachModalBackdrop"),

        verifyClose:
            byId("verifyCoachModalCloseButton"),

        verifyCancel:
            byId("cancelVerifyCoachButton"),

        verifyConfirm:
            byId("confirmVerifyCoachButton"),

        verifyName:
            byId("verifyCoachName"),


        deleteModal:
            byId("deleteCoachModal"),

        deleteBackdrop:
            byId("deleteCoachModalBackdrop"),

        deleteClose:
            byId("deleteCoachModalCloseButton"),

        deleteCancel:
            byId("cancelDeleteCoachButton"),

        deleteForm:
            byId("deleteCoachForm"),

        deleteId:
            byId("deleteCoachId"),

        deleteName:
            byId("deleteCoachName"),

        deleteConfirmation:
            byId("deleteCoachConfirmationInput"),


        exportModal:
            byId("exportCoachesModal"),

        exportBackdrop:
            byId("exportCoachesModalBackdrop"),

        exportClose:
            byId("exportCoachesModalCloseButton"),

        exportCancel:
            byId("cancelExportCoachesButton"),

        exportForm:
            byId("exportCoachesForm"),


        toastRegion:
            byId("adminCoachToastRegion")

    };


    /* ======================================================
       CREATE DEMO COACH
    ====================================================== */

    function createCoach(
        id,
        name,
        email,
        phone,
        stateName,
        city,
        licence,
        specialisation,
        experienceYears,
        playersManaged,
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

            state:
                stateName,

            city,
            address: "",

            licence,

            licenceNumber:
                `BFF-${id}`,

            specialisation,
            experienceYears,

            currentOrganisation:
                "Independent",

            playersManaged,

            preferredAgeGroup:
                "U-13 to U-21",

            availability,
            verification,
            accountStatus,

            profileCompletion:
                85,

            bio:
                "Football coach supporting player development across India.",

            note: "",

            createdAt:
                updatedAt,

            updatedAt

        };

    }


    /* ======================================================
       DEMO COACHES
    ====================================================== */

    const demoCoaches = [

        createCoach(
            "CO-1001",
            "Vikram Singh",
            "vikram.singh@example.com",
            "+91 98765 41001",
            "Punjab",
            "Mohali",
            "afc-a",
            "youth-development",
            16,
            64,
            "verified",
            "available",
            "active",
            "2026-07-21T06:15:00Z"
        ),

        createCoach(
            "CO-1002",
            "Anil Sharma",
            "anil.sharma@example.com",
            "+91 98765 41002",
            "Delhi",
            "New Delhi",
            "afc-b",
            "head-coach",
            11,
            38,
            "pending",
            "available",
            "active",
            "2026-07-20T14:10:00Z"
        ),

        createCoach(
            "CO-1003",
            "Meera Nair",
            "meera.nair@example.com",
            "+91 98765 41003",
            "Kerala",
            "Kochi",
            "afc-b",
            "fitness",
            9,
            42,
            "verified",
            "engaged",
            "active",
            "2026-07-21T05:45:00Z"
        ),

        createCoach(
            "CO-1004",
            "Samuel Kikon",
            "samuel.kikon@example.com",
            "+91 98765 41004",
            "Nagaland",
            "Dimapur",
            "afc-c",
            "youth-development",
            12,
            55,
            "verified",
            "available",
            "active",
            "2026-07-19T10:30:00Z"
        ),

        createCoach(
            "CO-1005",
            "Rahul Deshmukh",
            "rahul.deshmukh@example.com",
            "+91 98765 41005",
            "Maharashtra",
            "Pune",
            "afc-pro",
            "head-coach",
            20,
            89,
            "verified",
            "engaged",
            "active",
            "2026-07-21T04:50:00Z"
        ),

        createCoach(
            "CO-1006",
            "Arjun Das",
            "arjun.das@example.com",
            "+91 98765 41006",
            "West Bengal",
            "Kolkata",
            "afc-c",
            "goalkeeping",
            7,
            24,
            "pending",
            "available",
            "active",
            "2026-07-20T08:30:00Z"
        ),

        createCoach(
            "CO-1007",
            "Nisha Verma",
            "nisha.verma@example.com",
            "+91 98765 41007",
            "Rajasthan",
            "Jaipur",
            "afc-b",
            "assistant-coach",
            8,
            46,
            "verified",
            "available",
            "active",
            "2026-07-21T07:05:00Z"
        ),

        createCoach(
            "CO-1008",
            "Abdul Rahman",
            "abdul.rahman@example.com",
            "+91 98765 41008",
            "Telangana",
            "Hyderabad",
            "afc-a",
            "technical",
            13,
            51,
            "rejected",
            "unavailable",
            "suspended",
            "2026-07-12T12:40:00Z"
        ),

        createCoach(
            "CO-1009",
            "Lalhmingmawia Sailo",
            "lalhmingmawia.sailo@example.com",
            "+91 98765 41009",
            "Mizoram",
            "Aizawl",
            "afc-b",
            "youth-development",
            14,
            72,
            "verified",
            "engaged",
            "active",
            "2026-07-21T03:55:00Z"
        ),

        createCoach(
            "CO-1010",
            "Karan Malhotra",
            "karan.malhotra@example.com",
            "+91 98765 41010",
            "Chandigarh",
            "Chandigarh",
            "afc-c",
            "youth-development",
            6,
            29,
            "pending",
            "available",
            "active",
            "2026-07-20T17:15:00Z"
        ),

        createCoach(
            "CO-1011",
            "Priya Reddy",
            "priya.reddy@example.com",
            "+91 98765 41011",
            "Karnataka",
            "Bengaluru",
            "afc-a",
            "technical",
            10,
            57,
            "verified",
            "available",
            "active",
            "2026-07-21T06:50:00Z"
        ),

        createCoach(
            "CO-1012",
            "Tenzin Norbu",
            "tenzin.norbu@example.com",
            "+91 98765 41012",
            "Sikkim",
            "Gangtok",
            "afc-b",
            "youth-development",
            10,
            43,
            "verified",
            "unavailable",
            "inactive",
            "2026-07-16T11:35:00Z"
        )

    ];


    /* ======================================================
       APPLICATION STATE
    ====================================================== */

    const state = {

        coaches:
            loadCoaches(),

        filtered: [],

        selected:
            new Set(),

        page: 1,

        currentId:
            null,

        deletingMany:
            false

    };


    /* ======================================================
       LOCAL STORAGE
    ====================================================== */

    function loadCoaches() {

        try {

            const saved =
                localStorage.getItem(
                    STORAGE_KEY
                );

            if (saved) {

                const parsed =
                    JSON.parse(saved);

                if (
                    Array.isArray(parsed)
                ) {

                    return parsed;

                }

            }

        } catch (error) {

            console.error(
                "Unable to load coaches:",
                error
            );

        }

        const initial =
            JSON.parse(
                JSON.stringify(
                    demoCoaches
                )
            );

        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(initial)
        );

        return initial;

    }


    function saveCoaches() {

        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(
                state.coaches
            )
        );

    }


    /* ======================================================
       HELPERS
    ====================================================== */

    function escapeHTML(value) {

        const element =
            document.createElement("div");

        element.textContent =
            value == null
                ? ""
                : String(value);

        return element.innerHTML;

    }


    function formatLabel(value) {

        if (!value) {

            return "Not provided";

        }

        return String(value)
            .replace(
                /[-_]/g,
                " "
            )
            .replace(
                /\b\w/g,
                (character) =>
                    character.toUpperCase()
            );

    }


    function initials(name) {

        return String(
            name || "CO"
        )
            .trim()
            .split(/\s+/)
            .slice(0, 2)
            .map(
                (word) =>
                    word[0] || ""
            )
            .join("")
            .toUpperCase();

    }


    function formatDate(value) {

        const date =
            new Date(value);

        if (
            Number.isNaN(
                date.getTime()
            )
        ) {

            return "—";

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


    function getCoach(id) {

        return state.coaches.find(
            (coach) =>
                coach.id === id
        );

    }


    /* ======================================================
       TOAST MESSAGE
    ====================================================== */

    function showToast(
        title,
        message,
        type = "success"
    ) {

        if (!elements.toastRegion) {

            return;

        }

        const toast =
            document.createElement("div");

        toast.className =
            `admin-toast ${type}`;

        toast.innerHTML = `
            <strong>
                ${escapeHTML(title)}
            </strong>

            <span>
                ${escapeHTML(message)}
            </span>
        `;

        elements.toastRegion.appendChild(
            toast
        );

        window.setTimeout(
            () => {

                toast.remove();

            },
            3500
        );

    }


    /* ======================================================
       MODALS
    ====================================================== */

    function openModal(modal) {

        if (!modal) {

            return;

        }

        modal.hidden =
            false;

        modal.classList.add(
            "is-open"
        );

        document.body.classList.add(
            "admin-modal-open"
        );

    }


    function closeModal(modal) {

        if (!modal) {

            return;

        }

        modal.classList.remove(
            "is-open"
        );

        modal.hidden =
            true;

        if (
            !document.querySelector(
                ".admin-modal.is-open"
            )
        ) {

            document.body.classList.remove(
                "admin-modal-open"
            );

        }

    }


    function closeAllModals() {

        [
            elements.viewModal,
            elements.addModal,
            elements.editModal,
            elements.verifyModal,
            elements.deleteModal,
            elements.exportModal,
            elements.logoutModal
        ].forEach(closeModal);

    }


    /* ======================================================
       STATE FILTER OPTIONS
    ====================================================== */

    function populateStateFilter() {

        if (!elements.state) {

            return;

        }

        const current =
            elements.state.value || "all";

        const states = [

            ...new Set(

                state.coaches
                    .map(
                        (coach) =>
                            coach.state
                    )
                    .filter(Boolean)

            )

        ].sort();


        elements.state.innerHTML = `

            <option value="all">
                All States
            </option>

            ${states
                .map(
                    (item) => `

                        <option value="${escapeHTML(item)}">
                            ${escapeHTML(item)}
                        </option>

                    `
                )
                .join("")}

        `;


        elements.state.value =
            states.includes(current)
                ? current
                : "all";

    }


    /* ======================================================
       FILTER COACHES
    ====================================================== */

    function applyFilters() {

        const searchValue =
            (
                elements.search?.value ||
                ""
            )
                .trim()
                .toLowerCase();


        const verification =
            elements.verification?.value ||
            "all";


        const licence =
            elements.licence?.value ||
            "all";


        const specialisation =
            elements.specialisation?.value ||
            "all";


        const stateName =
            elements.state?.value ||
            "all";


        const availability =
            elements.availability?.value ||
            "all";


        const sort =
            elements.sort?.value ||
            "newest";


        state.filtered =
            state.coaches.filter(
                (coach) => {

                    const searchable =
                        Object.values(coach)
                            .join(" ")
                            .toLowerCase();


                    return (

                        (
                            !searchValue ||
                            searchable.includes(
                                searchValue
                            )
                        ) &&

                        (
                            verification === "all" ||
                            coach.verification ===
                                verification
                        ) &&

                        (
                            licence === "all" ||
                            coach.licence ===
                                licence
                        ) &&

                        (
                            specialisation === "all" ||
                            coach.specialisation ===
                                specialisation
                        ) &&

                        (
                            stateName === "all" ||
                            coach.state ===
                                stateName
                        ) &&

                        (
                            availability === "all" ||
                            coach.availability ===
                                availability
                        )

                    );

                }
            );


        const sorters = {

            newest:
                (first, second) =>
                    new Date(
                        second.createdAt
                    ) -
                    new Date(
                        first.createdAt
                    ),

            oldest:
                (first, second) =>
                    new Date(
                        first.createdAt
                    ) -
                    new Date(
                        second.createdAt
                    ),

            "name-asc":
                (first, second) =>
                    first.name.localeCompare(
                        second.name
                    ),

            "name-desc":
                (first, second) =>
                    second.name.localeCompare(
                        first.name
                    ),

            "experience-high":
                (first, second) =>
                    second.experienceYears -
                    first.experienceYears,

            "players-high":
                (first, second) =>
                    second.playersManaged -
                    first.playersManaged

        };


        state.filtered.sort(
            sorters[sort] ||
            sorters.newest
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
        /* ======================================================
       RENDER EVERYTHING
    ====================================================== */

    function renderAll() {

        renderMetrics();
        renderTable();
        renderPagination();
        renderBulkActions();

    }


    /* ======================================================
       METRICS
    ====================================================== */

    function renderMetrics() {

        if (elements.metricTotal) {

            elements.metricTotal.textContent =
                state.coaches.length;

        }


        if (elements.metricVerified) {

            elements.metricVerified.textContent =
                state.coaches.filter(
                    (coach) =>
                        coach.verification ===
                        "verified"
                ).length;

        }


        if (elements.metricPending) {

            elements.metricPending.textContent =
                state.coaches.filter(
                    (coach) =>
                        coach.verification ===
                        "pending"
                ).length;

        }


        if (elements.metricActive) {

            elements.metricActive.textContent =
                state.coaches.filter(
                    (coach) =>
                        coach.accountStatus ===
                            "active" &&
                        coach.availability !==
                            "unavailable"
                ).length;

        }

    }


    /* ======================================================
       COACH TABLE
    ====================================================== */

    function renderTable() {

        if (!elements.tableBody) {

            return;

        }


        const start =
            (
                state.page - 1
            ) *
            PAGE_SIZE;


        const visibleCoaches =
            state.filtered.slice(
                start,
                start + PAGE_SIZE
            );


        elements.tableBody.innerHTML =
            visibleCoaches
                .map(
                    (coach) => `

                        <tr>

                            <td>

                                <input
                                    class="coach-row-checkbox"
                                    type="checkbox"
                                    data-id="${escapeHTML(coach.id)}"
                                    aria-label="Select ${escapeHTML(coach.name)}"
                                    ${
                                        state.selected.has(
                                            coach.id
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
                                            coach.photo
                                                ? `
                                                    <img
                                                        src="${escapeHTML(coach.photo)}"
                                                        alt="${escapeHTML(coach.name)}"
                                                    >
                                                `
                                                : escapeHTML(
                                                    initials(
                                                        coach.name
                                                    )
                                                )
                                        }

                                    </div>


                                    <div>

                                        <strong>
                                            ${escapeHTML(coach.name)}
                                        </strong>

                                        <span>
                                            ${escapeHTML(coach.email)}
                                        </span>

                                    </div>

                                </div>

                            </td>


                            <td>

                                <strong>
                                    ${escapeHTML(
                                        formatLabel(
                                            coach.licence
                                        )
                                    )}
                                </strong>

                                <small>
                                    ${escapeHTML(
                                        coach.licenceNumber ||
                                        "—"
                                    )}
                                </small>

                            </td>


                            <td>
                                ${escapeHTML(
                                    formatLabel(
                                        coach.specialisation
                                    )
                                )}
                            </td>


                            <td>
                                ${escapeHTML(coach.city)},
                                ${escapeHTML(coach.state)}
                            </td>


                            <td>
                                ${
                                    Number(
                                        coach.experienceYears
                                    ) || 0
                                }
                                yrs
                            </td>


                            <td>
                                ${
                                    Number(
                                        coach.playersManaged
                                    ) || 0
                                }
                            </td>


                            <td>

                                <span class="admin-status-badge ${escapeHTML(coach.verification)}">

                                    ${escapeHTML(
                                        formatLabel(
                                            coach.verification
                                        )
                                    )}

                                </span>

                            </td>


                            <td>

                                <span class="admin-availability-badge ${escapeHTML(coach.availability)}">

                                    ${escapeHTML(
                                        formatLabel(
                                            coach.availability
                                        )
                                    )}

                                </span>

                            </td>


                            <td>
                                ${formatDate(
                                    coach.updatedAt
                                )}
                            </td>


                            <td>

                                <div class="admin-table-actions">

                                    <button
                                        class="admin-table-action-button"
                                        type="button"
                                        data-action="view"
                                        data-id="${escapeHTML(coach.id)}"
                                        aria-label="View ${escapeHTML(coach.name)}"
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
                                        data-id="${escapeHTML(coach.id)}"
                                        aria-label="Edit ${escapeHTML(coach.name)}"
                                    >

                                        <i
                                            class="fa-regular fa-pen-to-square"
                                            aria-hidden="true"
                                        ></i>

                                    </button>


                                    ${
                                        coach.verification !==
                                        "verified"
                                            ? `

                                                <button
                                                    class="admin-table-action-button"
                                                    type="button"
                                                    data-action="verify"
                                                    data-id="${escapeHTML(coach.id)}"
                                                    aria-label="Verify ${escapeHTML(coach.name)}"
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
                                        data-id="${escapeHTML(coach.id)}"
                                        aria-label="Delete ${escapeHTML(coach.name)}"
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
            visibleCoaches.length === 0;


        if (elements.tableWrapper) {

            elements.tableWrapper.hidden =
                false;

        }


        if (elements.table) {

            elements.table.hidden =
                noResults;

        }


        if (elements.emptyState) {

            elements.emptyState.hidden =
                !noResults;

        }


        if (elements.paginationSummary) {

            elements.paginationSummary.textContent =
                noResults
                    ? "Showing 0 coaches"
                    : `Showing ${
                        start + 1
                    }–${
                        start +
                        visibleCoaches.length
                    } of ${
                        state.filtered.length
                    } coaches`;

        }


        updateSelectAll(
            visibleCoaches
        );

    }


    /* ======================================================
       SELECT ALL CHECKBOX
    ====================================================== */

    function updateSelectAll(
        visibleCoaches
    ) {

        if (!elements.selectAll) {

            return;

        }


        const visibleIds =
            visibleCoaches.map(
                (coach) =>
                    coach.id
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


        elements.selectAll.checked =
            allSelected;


        elements.selectAll.indeterminate =
            someSelected &&
            !allSelected;

    }


    /* ======================================================
       PAGINATION
    ====================================================== */

    function renderPagination() {

        if (!elements.pagination) {

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


        elements.pagination.innerHTML =
            Array.from(
                {
                    length:
                        totalPages
                },
                (_, index) => {

                    const page =
                        index + 1;


                    return `

                        <button
                            class="admin-pagination-page ${
                                page ===
                                state.page
                                    ? "active"
                                    : ""
                            }"
                            type="button"
                            data-page="${page}"
                            aria-label="Go to page ${page}"
                            ${
                                page ===
                                state.page
                                    ? 'aria-current="page"'
                                    : ""
                            }
                        >
                            ${page}
                        </button>

                    `;

                }
            ).join("");


        if (elements.previousPage) {

            elements.previousPage.disabled =
                state.page === 1;

        }


        if (elements.nextPage) {

            elements.nextPage.disabled =
                state.page ===
                totalPages;

        }

    }


    /* ======================================================
       BULK ACTIONS
    ====================================================== */

    function renderBulkActions() {

        if (!elements.bulkActions) {

            return;

        }


        const count =
            state.selected.size;


        elements.bulkActions.hidden =
            count === 0;


        if (elements.selectedCount) {

            elements.selectedCount.textContent =
                `${count} coach${
                    count === 1
                        ? ""
                        : "es"
                } selected`;

        }

    }


    /* ======================================================
       COACH DETAILS
    ====================================================== */

    function detailItem(
        label,
        value
    ) {

        return `

            <div class="admin-detail-item">

                <span>
                    ${escapeHTML(label)}
                </span>

                <strong>
                    ${escapeHTML(
                        value ??
                        "—"
                    )}
                </strong>

            </div>

        `;

    }


    function openCoachDetails(id) {

        const coach =
            getCoach(id);


        if (!coach) {

            showToast(
                "Coach not found",
                "The selected coach record could not be found.",
                "error"
            );

            return;

        }


        state.currentId =
            id;


        if (elements.detailsContent) {

            elements.detailsContent.innerHTML = `

                <div class="admin-coach-details-profile">

                    <div class="admin-coach-details-avatar">

                        ${
                            coach.photo
                                ? `
                                    <img
                                        src="${escapeHTML(coach.photo)}"
                                        alt="${escapeHTML(coach.name)}"
                                    >
                                `
                                : escapeHTML(
                                    initials(
                                        coach.name
                                    )
                                )
                        }

                    </div>


                    <div>

                        <h3>
                            ${escapeHTML(coach.name)}
                        </h3>

                        <p>
                            ${escapeHTML(
                                formatLabel(
                                    coach.specialisation
                                )
                            )}
                        </p>

                        <div class="admin-coach-details-badges">

                            <span class="admin-status-badge ${escapeHTML(coach.verification)}">
                                ${escapeHTML(
                                    formatLabel(
                                        coach.verification
                                    )
                                )}
                            </span>

                            <span class="admin-availability-badge ${escapeHTML(coach.availability)}">
                                ${escapeHTML(
                                    formatLabel(
                                        coach.availability
                                    )
                                )}
                            </span>

                        </div>

                    </div>

                </div>


                <div class="admin-detail-grid">

                    ${detailItem(
                        "Email",
                        coach.email
                    )}

                    ${detailItem(
                        "Mobile Number",
                        coach.phone
                    )}

                    ${detailItem(
                        "Date of Birth",
                        coach.dateOfBirth ||
                        "Not provided"
                    )}

                    ${detailItem(
                        "Gender",
                        formatLabel(
                            coach.gender
                        )
                    )}

                    ${detailItem(
                        "Location",
                        `${coach.city}, ${coach.state}`
                    )}

                    ${detailItem(
                        "Full Address",
                        coach.address ||
                        "Not provided"
                    )}

                    ${detailItem(
                        "Licence",
                        formatLabel(
                            coach.licence
                        )
                    )}

                    ${detailItem(
                        "Licence Number",
                        coach.licenceNumber ||
                        "Not provided"
                    )}

                    ${detailItem(
                        "Specialisation",
                        formatLabel(
                            coach.specialisation
                        )
                    )}

                    ${detailItem(
                        "Experience",
                        `${coach.experienceYears} years`
                    )}

                    ${detailItem(
                        "Current Academy / Club",
                        coach.currentOrganisation ||
                        "Not provided"
                    )}

                    ${detailItem(
                        "Players Managed",
                        coach.playersManaged
                    )}

                    ${detailItem(
                        "Preferred Age Group",
                        coach.preferredAgeGroup ||
                        "Not provided"
                    )}

                    ${detailItem(
                        "Availability",
                        formatLabel(
                            coach.availability
                        )
                    )}

                    ${detailItem(
                        "Verification",
                        formatLabel(
                            coach.verification
                        )
                    )}

                    ${detailItem(
                        "Account Status",
                        formatLabel(
                            coach.accountStatus
                        )
                    )}

                    ${detailItem(
                        "Profile Completion",
                        `${coach.profileCompletion}%`
                    )}

                    ${detailItem(
                        "Biography",
                        coach.bio ||
                        "Not provided"
                    )}

                    ${detailItem(
                        "Administrative Note",
                        coach.note ||
                        "No administrative note"
                    )}

                    ${detailItem(
                        "Last Updated",
                        formatDate(
                            coach.updatedAt
                        )
                    )}

                </div>

            `;

        }


        openModal(
            elements.viewModal
        );

    }


    /* ======================================================
       FORM DATA
    ====================================================== */

    function formToCoach(form) {

        const data =
            new FormData(form);


        return {

            name:
                String(
                    data.get("name") ||
                    ""
                ).trim(),

            email:
                String(
                    data.get("email") ||
                    ""
                ).trim(),

            phone:
                String(
                    data.get("phone") ||
                    ""
                ).trim(),

            dateOfBirth:
                String(
                    data.get("dateOfBirth") ||
                    ""
                ),

            gender:
                String(
                    data.get("gender") ||
                    ""
                ),

            photo:
                String(
                    data.get("photo") ||
                    ""
                ).trim(),

            state:
                String(
                    data.get("state") ||
                    ""
                ).trim(),

            city:
                String(
                    data.get("city") ||
                    ""
                ).trim(),

            address:
                String(
                    data.get("address") ||
                    ""
                ).trim(),

            licence:
                String(
                    data.get("licence") ||
                    ""
                ),

            licenceNumber:
                String(
                    data.get("licenceNumber") ||
                    ""
                ).trim(),

            specialisation:
                String(
                    data.get("specialisation") ||
                    ""
                ),

            experienceYears:
                Number(
                    data.get(
                        "experienceYears"
                    )
                ) || 0,

            currentOrganisation:
                String(
                    data.get(
                        "currentOrganisation"
                    ) ||
                    ""
                ).trim(),

            playersManaged:
                Number(
                    data.get(
                        "playersManaged"
                    )
                ) || 0,

            preferredAgeGroup:
                String(
                    data.get(
                        "preferredAgeGroup"
                    ) ||
                    ""
                ).trim(),

            availability:
                String(
                    data.get(
                        "availability"
                    ) ||
                    "available"
                ),

            verification:
                String(
                    data.get(
                        "verification"
                    ) ||
                    "pending"
                ),

            accountStatus:
                String(
                    data.get(
                        "accountStatus"
                    ) ||
                    "active"
                ),

            profileCompletion:
                Math.min(
                    100,
                    Math.max(
                        0,
                        Number(
                            data.get(
                                "profileCompletion"
                            )
                        ) || 0
                    )
                ),

            bio:
                String(
                    data.get("bio") ||
                    ""
                ).trim(),

            note:
                String(
                    data.get("note") ||
                    ""
                ).trim(),

            updatedAt:
                new Date()
                    .toISOString()

        };

    }


    /* ======================================================
       VALIDATION
    ====================================================== */

    function clearFormErrors(
        form,
        errorAttribute
    ) {

        if (!form) {

            return;

        }


        form.querySelectorAll(
            `[${errorAttribute}]`
        ).forEach(
            (errorElement) => {

                errorElement.textContent =
                    "";

            }
        );


        form.querySelectorAll(
            ".has-error"
        ).forEach(
            (field) => {

                field.classList.remove(
                    "has-error"
                );

            }
        );

    }


    function setFormError(
        form,
        errorAttribute,
        fieldName,
        message
    ) {

        const field =
            form?.elements.namedItem(
                fieldName
            );


        const errorElement =
            form?.querySelector(
                `[${errorAttribute}="${fieldName}"]`
            );


        field?.closest(
            ".admin-form-field"
        )?.classList.add(
            "has-error"
        );


        if (errorElement) {

            errorElement.textContent =
                message;

        }

    }


    function validateCoachForm(
        form,
        mode
    ) {

        if (!form) {

            return false;

        }


        const errorAttribute =
            mode === "add"
                ? "data-add-coach-error-for"
                : "data-edit-coach-error-for";


        clearFormErrors(
            form,
            errorAttribute
        );


        const coach =
            formToCoach(form);


        let isValid =
            true;


        const requiredFields = [

            [
                "name",
                "Enter the coach's full name."
            ],

            [
                "email",
                "Enter the coach's email address."
            ],

            [
                "phone",
                "Enter the coach's mobile number."
            ],

            [
                "dateOfBirth",
                "Select the coach's date of birth."
            ],

            [
                "gender",
                "Select the coach's gender."
            ],

            [
                "state",
                "Enter the coach's state."
            ],

            [
                "city",
                "Enter the coach's city."
            ],

            [
                "address",
                "Enter the coach's full address."
            ],

            [
                "licence",
                "Select the coach's licence."
            ],

            [
                "specialisation",
                "Select a coaching specialisation."
            ],

            [
                "availability",
                "Select the coach's availability."
            ],

            [
                "bio",
                "Enter the coach's biography."
            ]

        ];


        requiredFields.forEach(
            ([fieldName, message]) => {

                if (!coach[fieldName]) {

                    setFormError(
                        form,
                        errorAttribute,
                        fieldName,
                        message
                    );

                    isValid =
                        false;

                }

            }
        );


        if (
            coach.name &&
            coach.name.length < 3
        ) {

            setFormError(
                form,
                errorAttribute,
                "name",
                "The name must contain at least 3 characters."
            );

            isValid =
                false;

        }


        const emailPattern =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


        if (
            coach.email &&
            !emailPattern.test(
                coach.email
            )
        ) {

            setFormError(
                form,
                errorAttribute,
                "email",
                "Enter a valid email address."
            );

            isValid =
                false;

        }


        if (
            coach.phone &&
            coach.phone.replace(
                /\D/g,
                ""
            ).length < 10
        ) {

            setFormError(
                form,
                errorAttribute,
                "phone",
                "Enter a valid mobile number."
            );

            isValid =
                false;

        }


        if (
            coach.bio &&
            coach.bio.length < 20
        ) {

            setFormError(
                form,
                errorAttribute,
                "bio",
                "The biography must contain at least 20 characters."
            );

            isValid =
                false;

        }


        if (
            coach.photo
        ) {

            try {

                new URL(
                    coach.photo
                );

            } catch {

                setFormError(
                    form,
                    errorAttribute,
                    "photo",
                    "Enter a valid profile photo URL."
                );

                isValid =
                    false;

            }

        }


        return isValid;

    }


    /* ======================================================
       FILL EDIT FORM
    ====================================================== */

    function fillCoachForm(
        form,
        coach
    ) {

        if (
            !form ||
            !coach
        ) {

            return;

        }


        Object.entries(
            coach
        ).forEach(
            ([name, value]) => {

                const field =
                    form.elements.namedItem(
                        name
                    );


                if (field) {

                    field.value =
                        value ?? "";

                }

            }
        );


        const idField =
            form.elements.namedItem(
                "coachId"
            );


        if (idField) {

            idField.value =
                coach.id;

        }

    }


    /* ======================================================
       GENERATE NEW COACH ID
    ====================================================== */

    function generateCoachId() {

        const highestNumber =
            state.coaches.reduce(
                (
                    highest,
                    coach
                ) => {

                    const number =
                        Number(
                            String(
                                coach.id
                            ).replace(
                                /\D/g,
                                ""
                            )
                        ) || 1000;


                    return Math.max(
                        highest,
                        number
                    );

                },
                1000
            );


        return `CO-${
            highestNumber + 1
        }`;

    }


    /* ======================================================
       OPEN EDIT MODAL
    ====================================================== */

    function openEditCoach(id) {

        const coach =
            getCoach(id);


        if (!coach) {

            showToast(
                "Coach not found",
                "The selected coach record could not be found.",
                "error"
            );

            return;

        }


        state.currentId =
            id;


        clearFormErrors(
            elements.editForm,
            "data-edit-coach-error-for"
        );


        fillCoachForm(
            elements.editForm,
            coach
        );


        closeModal(
            elements.viewModal
        );


        openModal(
            elements.editModal
        );

    }


    /* ======================================================
       OPEN VERIFY MODAL
    ====================================================== */

    function openVerifyCoach(id) {

        const coach =
            getCoach(id);


        if (!coach) {

            return;

        }


        state.currentId =
            id;


        if (elements.verifyName) {

            elements.verifyName.textContent =
                coach.name;

        }


        openModal(
            elements.verifyModal
        );

    }


    /* ======================================================
       OPEN DELETE MODAL
    ====================================================== */

    function openDeleteCoach(
        id,
        deletingMany = false
    ) {

        state.currentId =
            id;


        state.deletingMany =
            deletingMany;


        const coach =
            getCoach(id);


        if (elements.deleteName) {

            elements.deleteName.textContent =
                deletingMany
                    ? `${state.selected.size} selected coaches`
                    : coach?.name ||
                      "this coach";

        }


        if (elements.deleteId) {

            elements.deleteId.value =
                id || "";

        }


        if (elements.deleteConfirmation) {

            elements.deleteConfirmation.value =
                "";

        }


        const deleteError =
            elements.deleteForm?.querySelector(
                '[data-delete-coach-error-for="confirmation"]'
            );


        if (deleteError) {

            deleteError.textContent =
                "";

        }


        openModal(
            elements.deleteModal
        );

    }
        /* ======================================================
       ADD COACH
    ====================================================== */

    function openAddCoachModal() {

        if (!elements.addForm) {

            return;

        }

        elements.addForm.reset();

        clearFormErrors(
            elements.addForm,
            "data-add-coach-error-for"
        );

        const availabilityField =
            elements.addForm.elements.namedItem(
                "availability"
            );

        const verificationField =
            elements.addForm.elements.namedItem(
                "verification"
            );

        const accountStatusField =
            elements.addForm.elements.namedItem(
                "accountStatus"
            );

        const profileCompletionField =
            elements.addForm.elements.namedItem(
                "profileCompletion"
            );

        const playersManagedField =
            elements.addForm.elements.namedItem(
                "playersManaged"
            );

        if (availabilityField) {

            availabilityField.value =
                "available";

        }

        if (verificationField) {

            verificationField.value =
                "pending";

        }

        if (accountStatusField) {

            accountStatusField.value =
                "active";

        }

        if (profileCompletionField) {

            profileCompletionField.value =
                "60";

        }

        if (playersManagedField) {

            playersManagedField.value =
                "0";

        }

        openModal(
            elements.addModal
        );

    }


    elements.addForm?.addEventListener(
        "submit",
        (event) => {

            event.preventDefault();

            if (
                !validateCoachForm(
                    elements.addForm,
                    "add"
                )
            ) {

                showToast(
                    "Check the form",
                    "Please correct the highlighted fields.",
                    "error"
                );

                return;

            }

            const coachData =
                formToCoach(
                    elements.addForm
                );

            const emailExists =
                state.coaches.some(
                    (coach) =>
                        coach.email
                            .toLowerCase() ===
                        coachData.email
                            .toLowerCase()
                );

            if (emailExists) {

                setFormError(
                    elements.addForm,
                    "data-add-coach-error-for",
                    "email",
                    "A coach with this email address already exists."
                );

                showToast(
                    "Duplicate email",
                    "Use a different email address.",
                    "error"
                );

                return;

            }

            const now =
                new Date()
                    .toISOString();

            const newCoach = {

                id:
                    generateCoachId(),

                ...coachData,

                createdAt:
                    now,

                updatedAt:
                    now

            };

            state.coaches.unshift(
                newCoach
            );

            saveCoaches();

            populateStateFilter();

            state.page =
                1;

            closeModal(
                elements.addModal
            );

            applyFilters();

            showToast(
                "Coach added",
                `${newCoach.name} was added successfully.`
            );

        }
    );


    /* ======================================================
       EDIT COACH
    ====================================================== */

    elements.editForm?.addEventListener(
        "submit",
        (event) => {

            event.preventDefault();

            if (
                !validateCoachForm(
                    elements.editForm,
                    "edit"
                )
            ) {

                showToast(
                    "Check the form",
                    "Please correct the highlighted fields.",
                    "error"
                );

                return;

            }

            const idField =
                elements.editForm
                    .elements
                    .namedItem(
                        "coachId"
                    );

            const coachId =
                idField?.value ||
                state.currentId;

            const coachIndex =
                state.coaches.findIndex(
                    (coach) =>
                        coach.id ===
                        coachId
                );

            if (
                coachIndex === -1
            ) {

                showToast(
                    "Coach not found",
                    "The selected coach could not be updated.",
                    "error"
                );

                return;

            }

            const coachData =
                formToCoach(
                    elements.editForm
                );

            const emailExists =
                state.coaches.some(
                    (coach) =>
                        coach.id !==
                            coachId &&
                        coach.email
                            .toLowerCase() ===
                        coachData.email
                            .toLowerCase()
                );

            if (emailExists) {

                setFormError(
                    elements.editForm,
                    "data-edit-coach-error-for",
                    "email",
                    "Another coach already uses this email address."
                );

                showToast(
                    "Duplicate email",
                    "Use a different email address.",
                    "error"
                );

                return;

            }

            state.coaches[
                coachIndex
            ] = {

                ...state.coaches[
                    coachIndex
                ],

                ...coachData,

                id:
                    coachId,

                createdAt:
                    state.coaches[
                        coachIndex
                    ].createdAt

            };

            saveCoaches();

            populateStateFilter();

            closeModal(
                elements.editModal
            );

            applyFilters();

            showToast(
                "Coach updated",
                `${coachData.name}'s profile was updated successfully.`
            );

        }
    );


    /* ======================================================
       VERIFY COACH
    ====================================================== */

    elements.verifyConfirm?.addEventListener(
        "click",
        () => {

            const coach =
                getCoach(
                    state.currentId
                );

            if (!coach) {

                closeModal(
                    elements.verifyModal
                );

                return;

            }

            coach.verification =
                "verified";

            coach.updatedAt =
                new Date()
                    .toISOString();

            saveCoaches();

            closeModal(
                elements.verifyModal
            );

            applyFilters();

            showToast(
                "Coach verified",
                `${coach.name} is now verified.`
            );

        }
    );


    /* ======================================================
       DELETE COACH
    ====================================================== */

    elements.deleteForm?.addEventListener(
        "submit",
        (event) => {

            event.preventDefault();

            const confirmation =
                elements
                    .deleteConfirmation
                    ?.value
                    .trim();

            const errorElement =
                elements.deleteForm
                    .querySelector(
                        '[data-delete-coach-error-for="confirmation"]'
                    );

            if (
                confirmation !==
                "DELETE"
            ) {

                if (errorElement) {

                    errorElement.textContent =
                        "Type DELETE exactly to confirm.";

                }

                return;

            }

            if (
                state.deletingMany
            ) {

                const deletedCount =
                    state.selected.size;

                state.coaches =
                    state.coaches.filter(
                        (coach) =>
                            !state.selected.has(
                                coach.id
                            )
                    );

                state.selected.clear();

                saveCoaches();

                populateStateFilter();

                closeModal(
                    elements.deleteModal
                );

                applyFilters();

                showToast(
                    "Coaches deleted",
                    `${deletedCount} coach records were deleted.`
                );

                return;

            }

            const coach =
                getCoach(
                    state.currentId
                );

            if (!coach) {

                closeModal(
                    elements.deleteModal
                );

                return;

            }

            state.coaches =
                state.coaches.filter(
                    (item) =>
                        item.id !==
                        coach.id
                );

            state.selected.delete(
                coach.id
            );

            saveCoaches();

            populateStateFilter();

            closeModal(
                elements.deleteModal
            );

            applyFilters();

            showToast(
                "Coach deleted",
                `${coach.name} was deleted successfully.`
            );

        }
    );


    /* ======================================================
       TABLE ACTIONS
    ====================================================== */

    elements.tableBody?.addEventListener(
        "click",
        (event) => {

            const button =
                event.target.closest(
                    "[data-action][data-id]"
                );

            if (!button) {

                return;

            }

            const action =
                button.dataset.action;

            const id =
                button.dataset.id;

            if (
                action === "view"
            ) {

                openCoachDetails(id);

            }

            if (
                action === "edit"
            ) {

                openEditCoach(id);

            }

            if (
                action === "verify"
            ) {

                openVerifyCoach(id);

            }

            if (
                action === "delete"
            ) {

                openDeleteCoach(id);

            }

        }
    );


    /* ======================================================
       ROW SELECTION
    ====================================================== */

    elements.tableBody?.addEventListener(
        "change",
        (event) => {

            const checkbox =
                event.target.closest(
                    ".coach-row-checkbox"
                );

            if (!checkbox) {

                return;

            }

            const id =
                checkbox.dataset.id;

            if (
                checkbox.checked
            ) {

                state.selected.add(id);

            } else {

                state.selected.delete(id);

            }

            renderBulkActions();

            const visibleCheckboxes =
                [
                    ...elements.tableBody
                        .querySelectorAll(
                            ".coach-row-checkbox"
                        )
                ];

            const allChecked =
                visibleCheckboxes.length >
                    0 &&
                visibleCheckboxes.every(
                    (item) =>
                        item.checked
                );

            const someChecked =
                visibleCheckboxes.some(
                    (item) =>
                        item.checked
                );

            if (
                elements.selectAll
            ) {

                elements.selectAll.checked =
                    allChecked;

                elements.selectAll.indeterminate =
                    someChecked &&
                    !allChecked;

            }

        }
    );


    elements.selectAll?.addEventListener(
        "change",
        () => {

            const start =
                (
                    state.page - 1
                ) *
                PAGE_SIZE;

            const visibleCoaches =
                state.filtered.slice(
                    start,
                    start +
                    PAGE_SIZE
                );

            visibleCoaches.forEach(
                (coach) => {

                    if (
                        elements
                            .selectAll
                            .checked
                    ) {

                        state.selected.add(
                            coach.id
                        );

                    } else {

                        state.selected.delete(
                            coach.id
                        );

                    }

                }
            );

            renderTable();
            renderBulkActions();

        }
    );


    elements.clearSelection?.addEventListener(
        "click",
        () => {

            state.selected.clear();

            renderTable();
            renderBulkActions();

        }
    );


    /* ======================================================
       BULK ACTION BUTTONS
    ====================================================== */

    elements.bulkVerify?.addEventListener(
        "click",
        () => {

            if (
                state.selected.size ===
                0
            ) {

                return;

            }

            state.coaches.forEach(
                (coach) => {

                    if (
                        state.selected.has(
                            coach.id
                        )
                    ) {

                        coach.verification =
                            "verified";

                        coach.updatedAt =
                            new Date()
                                .toISOString();

                    }

                }
            );

            saveCoaches();

            applyFilters();

            showToast(
                "Coaches verified",
                `${state.selected.size} selected coaches were verified.`
            );

        }
    );


    elements.bulkAvailable?.addEventListener(
        "click",
        () => {

            if (
                state.selected.size ===
                0
            ) {

                return;

            }

            state.coaches.forEach(
                (coach) => {

                    if (
                        state.selected.has(
                            coach.id
                        )
                    ) {

                        coach.availability =
                            "available";

                        coach.updatedAt =
                            new Date()
                                .toISOString();

                    }

                }
            );

            saveCoaches();

            applyFilters();

            showToast(
                "Availability updated",
                "Selected coaches were marked available."
            );

        }
    );


    elements.bulkUnavailable?.addEventListener(
        "click",
        () => {

            if (
                state.selected.size ===
                0
            ) {

                return;

            }

            state.coaches.forEach(
                (coach) => {

                    if (
                        state.selected.has(
                            coach.id
                        )
                    ) {

                        coach.availability =
                            "unavailable";

                        coach.updatedAt =
                            new Date()
                                .toISOString();

                    }

                }
            );

            saveCoaches();

            applyFilters();

            showToast(
                "Availability updated",
                "Selected coaches were marked unavailable."
            );

        }
    );


    elements.bulkDelete?.addEventListener(
        "click",
        () => {

            if (
                state.selected.size ===
                0
            ) {

                return;

            }

            openDeleteCoach(
                "",
                true
            );

        }
    );


    /* ======================================================
       FILTER EVENTS
    ====================================================== */

    elements.filterForm?.addEventListener(
        "submit",
        (event) => {

            event.preventDefault();

            state.page =
                1;

            applyFilters();

        }
    );


    elements.search?.addEventListener(
        "input",
        () => {

            state.page =
                1;

            applyFilters();

        }
    );


    [
        elements.verification,
        elements.licence,
        elements.specialisation,
        elements.state,
        elements.availability,
        elements.sort
    ].forEach(
        (element) => {

            element?.addEventListener(
                "change",
                () => {

                    state.page =
                        1;

                    applyFilters();

                }
            );

        }
    );


    elements.reset?.addEventListener(
        "click",
        () => {

            elements.filterForm?.reset();

            if (
                elements.state
            ) {

                elements.state.value =
                    "all";

            }

            state.page =
                1;

            applyFilters();

            showToast(
                "Filters reset",
                "All coach filters were cleared.",
                "info"
            );

        }
    );


    elements.refresh?.addEventListener(
        "click",
        () => {

            state.coaches =
                loadCoaches();

            populateStateFilter();

            applyFilters();

            showToast(
                "Directory refreshed",
                "Coach records were refreshed.",
                "info"
            );

        }
    );


    /* ======================================================
       PAGINATION EVENTS
    ====================================================== */

    elements.pagination?.addEventListener(
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
                ) || 1;

            renderTable();
            renderPagination();

            elements.tableWrapper
                ?.scrollIntoView(
                    {
                        behavior:
                            "smooth",

                        block:
                            "start"
                    }
                );

        }
    );


    elements.previousPage?.addEventListener(
        "click",
        () => {

            if (
                state.page > 1
            ) {

                state.page -=
                    1;

                renderTable();
                renderPagination();

            }

        }
    );


    elements.nextPage?.addEventListener(
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

                state.page +=
                    1;

                renderTable();
                renderPagination();

            }

        }
    );


    /* ======================================================
       EXPORT COACHES
    ====================================================== */

    function getExportRecords(
        scope
    ) {

        if (
            scope ===
            "filtered"
        ) {

            return [
                ...state.filtered
            ];

        }

        if (
            scope ===
            "selected"
        ) {

            return state.coaches.filter(
                (coach) =>
                    state.selected.has(
                        coach.id
                    )
            );

        }

        return [
            ...state.coaches
        ];

    }


    function csvEscape(value) {

        const text =
            String(
                value ?? ""
            );

        return `"${text.replace(
            /"/g,
            '""'
        )}"`;

    }


    function downloadTextFile(
        filename,
        content,
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

        const url =
            URL.createObjectURL(
                blob
            );

        const link =
            document.createElement(
                "a"
            );

        link.href =
            url;

        link.download =
            filename;

        document.body.appendChild(
            link
        );

        link.click();

        link.remove();

        URL.revokeObjectURL(
            url
        );

    }


    elements.exportForm?.addEventListener(
        "submit",
        (event) => {

            event.preventDefault();

            const formData =
                new FormData(
                    elements.exportForm
                );

            const scope =
                String(
                    formData.get(
                        "scope"
                    ) ||
                    "all"
                );

            const format =
                String(
                    formData.get(
                        "format"
                    ) ||
                    "csv"
                );

            const records =
                getExportRecords(
                    scope
                );

            if (
                records.length ===
                0
            ) {

                showToast(
                    "Nothing to export",
                    "No coach records are available for the selected scope.",
                    "error"
                );

                return;

            }

            const dateStamp =
                new Date()
                    .toISOString()
                    .slice(
                        0,
                        10
                    );

            if (
                format ===
                "json"
            ) {

                downloadTextFile(
                    `bff-coaches-${dateStamp}.json`,
                    JSON.stringify(
                        records,
                        null,
                        2
                    ),
                    "application/json"
                );

            } else {

                const columns = [

                    "id",
                    "name",
                    "email",
                    "phone",
                    "dateOfBirth",
                    "gender",
                    "state",
                    "city",
                    "address",
                    "licence",
                    "licenceNumber",
                    "specialisation",
                    "experienceYears",
                    "currentOrganisation",
                    "playersManaged",
                    "preferredAgeGroup",
                    "availability",
                    "verification",
                    "accountStatus",
                    "profileCompletion",
                    "bio",
                    "note",
                    "createdAt",
                    "updatedAt"

                ];

                const csv = [

                    columns
                        .map(
                            csvEscape
                        )
                        .join(","),

                    ...records.map(
                        (record) =>
                            columns
                                .map(
                                    (column) =>
                                        csvEscape(
                                            record[
                                                column
                                            ]
                                        )
                                )
                                .join(",")
                    )

                ].join("\n");

                downloadTextFile(
                    `bff-coaches-${dateStamp}.csv`,
                    csv,
                    "text/csv;charset=utf-8"
                );

            }

            closeModal(
                elements.exportModal
            );

            showToast(
                "Export complete",
                `${records.length} coach records were exported.`
            );

        }
    );


    /* ======================================================
       OPEN AND CLOSE MODAL BUTTONS
    ====================================================== */

    elements.addButton?.addEventListener(
        "click",
        openAddCoachModal
    );

    elements.emptyAddButton?.addEventListener(
        "click",
        openAddCoachModal
    );

    elements.exportButton?.addEventListener(
        "click",
        () => {

            openModal(
                elements.exportModal
            );

        }
    );


    elements.editFromDetails?.addEventListener(
        "click",
        () => {

            if (
                state.currentId
            ) {

                openEditCoach(
                    state.currentId
                );

            }

        }
    );


    [
        [
            elements.viewBackdrop,
            elements.viewModal
        ],

        [
            elements.viewClose,
            elements.viewModal
        ],

        [
            elements.closeDetails,
            elements.viewModal
        ],

        [
            elements.addBackdrop,
            elements.addModal
        ],

        [
            elements.addClose,
            elements.addModal
        ],

        [
            elements.addCancel,
            elements.addModal
        ],

        [
            elements.editBackdrop,
            elements.editModal
        ],

        [
            elements.editClose,
            elements.editModal
        ],

        [
            elements.editCancel,
            elements.editModal
        ],

        [
            elements.verifyBackdrop,
            elements.verifyModal
        ],

        [
            elements.verifyClose,
            elements.verifyModal
        ],

        [
            elements.verifyCancel,
            elements.verifyModal
        ],

        [
            elements.deleteBackdrop,
            elements.deleteModal
        ],

        [
            elements.deleteClose,
            elements.deleteModal
        ],

        [
            elements.deleteCancel,
            elements.deleteModal
        ],

        [
            elements.exportBackdrop,
            elements.exportModal
        ],

        [
            elements.exportClose,
            elements.exportModal
        ],

        [
            elements.exportCancel,
            elements.exportModal
        ],

        [
            elements.logoutBackdrop,
            elements.logoutModal
        ],

        [
            elements.logoutClose,
            elements.logoutModal
        ],

        [
            elements.logoutCancel,
            elements.logoutModal
        ]

    ].forEach(
        ([button, modal]) => {

            button?.addEventListener(
                "click",
                () => {

                    closeModal(
                        modal
                    );

                }
            );

        }
    );


    /* ======================================================
       MOBILE SIDEBAR
    ====================================================== */

    function openSidebar() {

        elements.sidebar
            ?.classList.add(
                "is-open"
            );

        if (
            elements.sidebarOverlay
        ) {

            elements.sidebarOverlay.hidden =
                false;

        }

        elements.mobileMenu
            ?.setAttribute(
                "aria-expanded",
                "true"
            );

        document.body.classList.add(
            "admin-sidebar-open"
        );

    }


    function closeSidebar() {

        elements.sidebar
            ?.classList.remove(
                "is-open"
            );

        if (
            elements.sidebarOverlay
        ) {

            elements.sidebarOverlay.hidden =
                true;

        }

        elements.mobileMenu
            ?.setAttribute(
                "aria-expanded",
                "false"
            );

        document.body.classList.remove(
            "admin-sidebar-open"
        );

    }


    elements.mobileMenu?.addEventListener(
        "click",
        openSidebar
    );

    elements.sidebarClose?.addEventListener(
        "click",
        closeSidebar
    );

    elements.sidebarOverlay?.addEventListener(
        "click",
        closeSidebar
    );


    /* ======================================================
       NOTIFICATIONS PANEL
    ====================================================== */

    function toggleNotifications() {

        if (
            !elements.notificationsPanel
        ) {

            return;

        }

        const willOpen =
            elements
                .notificationsPanel
                .hidden;

        elements.notificationsPanel.hidden =
            !willOpen;

        elements.notificationsPanel
            .classList.toggle(
                "is-open",
                willOpen
            );

        if (
            willOpen &&
            elements.accountMenu
        ) {

            elements.accountMenu.hidden =
                true;

            elements.accountMenu.classList.remove(
                "is-open"
            );

            elements.accountButton
                ?.setAttribute(
                    "aria-expanded",
                    "false"
                );

        }

    }


    elements.notificationsButton
        ?.addEventListener(
            "click",
            (event) => {

                event.stopPropagation();

                toggleNotifications();

            }
        );


    elements.notificationsClose
        ?.addEventListener(
            "click",
            () => {

                if (
                    elements.notificationsPanel
                ) {

                    elements.notificationsPanel.hidden =
                        true;

                    elements.notificationsPanel
                        .classList.remove(
                            "is-open"
                        );

                }

            }
        );


    /* ======================================================
       ACCOUNT MENU
    ====================================================== */

    elements.accountButton?.addEventListener(
        "click",
        (event) => {

            event.stopPropagation();

            if (
                !elements.accountMenu
            ) {

                return;

            }

            const willOpen =
                elements.accountMenu.hidden;

            elements.accountMenu.hidden =
                !willOpen;

            elements.accountMenu
                .classList.toggle(
                    "is-open",
                    willOpen
                );

            elements.accountButton
                .setAttribute(
                    "aria-expanded",
                    String(
                        willOpen
                    )
                );

            if (
                willOpen &&
                elements.notificationsPanel
            ) {

                elements.notificationsPanel.hidden =
                    true;

                elements.notificationsPanel
                    .classList.remove(
                        "is-open"
                    );

            }

        }
    );


    document.addEventListener(
        "click",
        (event) => {

            if (
                elements.accountMenu &&
                !elements.accountMenu.hidden &&
                !elements.accountMenu.contains(
                    event.target
                ) &&
                !elements.accountButton?.contains(
                    event.target
                )
            ) {

                elements.accountMenu.hidden =
                    true;

                elements.accountMenu.classList.remove(
                    "is-open"
                );

                elements.accountButton
                    ?.setAttribute(
                        "aria-expanded",
                        "false"
                    );

            }

            if (
                elements.notificationsPanel &&
                !elements.notificationsPanel.hidden &&
                !elements.notificationsPanel.contains(
                    event.target
                ) &&
                !elements.notificationsButton?.contains(
                    event.target
                )
            ) {

                elements.notificationsPanel.hidden =
                    true;

                elements.notificationsPanel
                    .classList.remove(
                        "is-open"
                    );

            }

        }
    );


    /* ======================================================
       LOGOUT
    ====================================================== */

    function openLogoutModal() {

        if (
            elements.accountMenu
        ) {

            elements.accountMenu.hidden =
                true;

            elements.accountMenu.classList.remove(
                "is-open"
            );

        }

        openModal(
            elements.logoutModal
        );

    }


    elements.logoutButton?.addEventListener(
        "click",
        openLogoutModal
    );


    elements.accountLogoutButton
        ?.addEventListener(
            "click",
            openLogoutModal
        );


    elements.logoutConfirm?.addEventListener(
        "click",
        () => {

            closeModal(
                elements.logoutModal
            );

            showToast(
                "Signing out",
                "Redirecting to the admin login page.",
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


    /* ======================================================
       GLOBAL SEARCH
    ====================================================== */

    elements.globalSearch?.addEventListener(
        "input",
        () => {

            if (
                elements.search
            ) {

                elements.search.value =
                    elements.globalSearch.value;

            }

            state.page =
                1;

            applyFilters();

        }
    );


    document.addEventListener(
        "keydown",
        (event) => {

            if (
                event.key ===
                    "/" &&
                ![
                    "INPUT",
                    "TEXTAREA",
                    "SELECT"
                ].includes(
                    document
                        .activeElement
                        ?.tagName
                )
            ) {

                event.preventDefault();

                elements.globalSearch
                    ?.focus();

            }

            if (
                event.key ===
                "Escape"
            ) {

                closeAllModals();

                closeSidebar();

                if (
                    elements.accountMenu
                ) {

                    elements.accountMenu.hidden =
                        true;

                    elements.accountMenu.classList.remove(
                        "is-open"
                    );

                }

                if (
                    elements.notificationsPanel
                ) {

                    elements.notificationsPanel.hidden =
                        true;

                    elements.notificationsPanel.classList.remove(
                        "is-open"
                    );

                }

            }

        }
    );


    /* ======================================================
       INITIALISE PAGE
    ====================================================== */

    populateStateFilter();

    applyFilters();


    window.setTimeout(
        () => {

            if (
                elements.loading
            ) {

                elements.loading.classList.add(
                    "is-hidden"
                );

                window.setTimeout(
                    () => {

                        elements.loading.remove();

                    },
                    350
                );

            }

        },
        500
    );

});