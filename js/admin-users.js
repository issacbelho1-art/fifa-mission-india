"use strict";

/* =========================================================
   ADMIN USERS PAGE
   Bharat Football Fans
   Mission FIFA 2034
========================================================= */


/* =========================================================
   CONFIGURATION
========================================================= */

const ADMIN_USERS_CONFIG = Object.freeze({

    apiBaseUrl:
        "/api/v1/admin",

    endpoints: {

        users:
            "/users",

        createUser:
            "/users",

        updateUser:
            (userId) => `/users/${userId}`,

        suspendUser:
            (userId) => `/users/${userId}/suspend`,

        restoreUser:
            (userId) => `/users/${userId}/restore`,

        deleteUser:
            (userId) => `/users/${userId}`,

        exportUsers:
            "/users/export",

        logout:
            "/auth/logout"

    },

    pageSize:
        8,

    requestTimeout:
        12000,

    demoMode:
        true

});


/* =========================================================
   APPLICATION STATE
========================================================= */

const adminUsersState = {

    users:
        [],

    filteredUsers:
        [],

    currentPage:
        1,

    pageSize:
        ADMIN_USERS_CONFIG.pageSize,

    totalPages:
        1,

    selectedUserId:
        null,

    filters: {

        search:
            "",

        role:
            "",

        status:
            "",

        state:
            "",

        sort:
            "latest"

    },

    isLoading:
        false,

    activeModal:
        null,

    lastFocusedElement:
        null

};


/* =========================================================
   DEMO DATA
   Replace with backend data from Mr. Harsh
========================================================= */

const ADMIN_USERS_DEMO_DATA = [

    {

        id:
            "usr-1001",

        name:
            "Aarav Sharma",

        email:
            "aarav.sharma@example.com",

        phone:
            "+91 98765 43210",

        role:
            "player",

        state:
            "Punjab",

        status:
            "verified",

        joinedAt:
            "2026-07-18T09:30:00+05:30",

        lastActiveAt:
            "2026-07-21T12:35:00+05:30",

        avatar:
            "",

        note:
            "Registered through the national player scouting campaign."

    },

    {

        id:
            "usr-1002",

        name:
            "Riya Fernandes",

        email:
            "riya.fernandes@example.com",

        phone:
            "+91 98221 88441",

        role:
            "coach",

        state:
            "Goa",

        status:
            "verified",

        joinedAt:
            "2026-07-16T14:15:00+05:30",

        lastActiveAt:
            "2026-07-21T10:40:00+05:30",

        avatar:
            "",

        note:
            "Licensed youth coach working with an academy programme."

    },

    {

        id:
            "usr-1003",

        name:
            "Mohammed Zayan",

        email:
            "zayan.scout@example.com",

        phone:
            "+91 98911 62008",

        role:
            "scout",

        state:
            "Delhi",

        status:
            "pending",

        joinedAt:
            "2026-07-20T16:45:00+05:30",

        lastActiveAt:
            "2026-07-20T18:10:00+05:30",

        avatar:
            "",

        note:
            "Scout verification documents are under review."

    },

    {

        id:
            "usr-1004",

        name:
            "Minerva Football Academy",

        email:
            "academy@example.com",

        phone:
            "+91 98150 33445",

        role:
            "academy",

        state:
            "Punjab",

        status:
            "verified",

        joinedAt:
            "2026-07-10T11:00:00+05:30",

        lastActiveAt:
            "2026-07-21T11:52:00+05:30",

        avatar:
            "",

        note:
            "Featured residential football academy."

    },

    {

        id:
            "usr-1005",

        name:
            "Nikhil Das",

        email:
            "nikhil.das@example.com",

        phone:
            "+91 70020 91234",

        role:
            "supporter",

        state:
            "Assam",

        status:
            "inactive",

        joinedAt:
            "2026-06-28T08:25:00+05:30",

        lastActiveAt:
            "2026-07-02T19:15:00+05:30",

        avatar:
            "",

        note:
            "Joined through the supporter registration page."

    },

    {

        id:
            "usr-1006",

        name:
            "Thangjam Leima",

        email:
            "leima.player@example.com",

        phone:
            "+91 87874 11220",

        role:
            "player",

        state:
            "Manipur",

        status:
            "verified",

        joinedAt:
            "2026-07-12T13:50:00+05:30",

        lastActiveAt:
            "2026-07-21T08:30:00+05:30",

        avatar:
            "",

        note:
            "Selected for regional talent screening."

    },

    {

        id:
            "usr-1007",

        name:
            "Samuel Kikon",

        email:
            "samuel.kikon@example.com",

        phone:
            "+91 87308 99344",

        role:
            "coach",

        state:
            "Nagaland",

        status:
            "suspended",

        joinedAt:
            "2026-06-15T10:10:00+05:30",

        lastActiveAt:
            "2026-07-15T17:20:00+05:30",

        avatar:
            "",

        note:
            "Account temporarily suspended for administrative review."

    },

    {

        id:
            "usr-1008",

        name:
            "Ananya Menon",

        email:
            "ananya.menon@example.com",

        phone:
            "+91 94472 53018",

        role:
            "player",

        state:
            "Kerala",

        status:
            "pending",

        joinedAt:
            "2026-07-21T07:45:00+05:30",

        lastActiveAt:
            "2026-07-21T09:10:00+05:30",

        avatar:
            "",

        note:
            "Identity and age verification pending."

    },

    {

        id:
            "usr-1009",

        name:
            "Vikram Patil",

        email:
            "vikram.patil@example.com",

        phone:
            "+91 98206 44217",

        role:
            "scout",

        state:
            "Maharashtra",

        status:
            "verified",

        joinedAt:
            "2026-07-05T12:30:00+05:30",

        lastActiveAt:
            "2026-07-20T20:55:00+05:30",

        avatar:
            "",

        note:
            "Regional scout assigned to western India."

    },

    {

        id:
            "usr-1010",

        name:
            "Bengal Youth Football Centre",

        email:
            "contact@bengalyouth.example",

        phone:
            "+91 98310 77882",

        role:
            "academy",

        state:
            "West Bengal",

        status:
            "verified",

        joinedAt:
            "2026-06-20T15:40:00+05:30",

        lastActiveAt:
            "2026-07-19T16:15:00+05:30",

        avatar:
            "",

        note:
            "Academy profile information is complete."

    },

    {

        id:
            "usr-1011",

        name:
            "Meera Rao",

        email:
            "meera.rao@example.com",

        phone:
            "+91 99001 62741",

        role:
            "admin",

        state:
            "Karnataka",

        status:
            "verified",

        joinedAt:
            "2026-05-18T09:00:00+05:30",

        lastActiveAt:
            "2026-07-21T12:45:00+05:30",

        avatar:
            "",

        note:
            "Platform operations administrator."

    },

    {

        id:
            "usr-1012",

        name:
            "Arjun Iyer",

        email:
            "arjun.iyer@example.com",

        phone:
            "+91 98402 51387",

        role:
            "supporter",

        state:
            "Tamil Nadu",

        status:
            "verified",

        joinedAt:
            "2026-07-08T18:20:00+05:30",

        lastActiveAt:
            "2026-07-18T12:05:00+05:30",

        avatar:
            "",

        note:
            "Active national campaign supporter."

    }

];


/* =========================================================
   DOM REFERENCES
========================================================= */

const adminUsersDOM = {

    loadingScreen:
        document.getElementById("adminLoadingScreen"),

    tableBody:
        document.getElementById("adminUsersTableBody"),

    searchInput:
        document.getElementById("adminUsersSearchInput"),

    roleFilter:
        document.getElementById("adminUserRoleFilter"),

    statusFilter:
        document.getElementById("adminUserStatusFilter"),

    stateFilter:
        document.getElementById("adminStateFilter"),

    sortFilter:
        document.getElementById("adminUsersSort"),

    filterForm:
        document.getElementById("adminUsersFilterForm"),

    resetFiltersButton:
        document.getElementById("adminResetUserFiltersButton"),

    refreshButton:
        document.getElementById("adminRefreshUsersButton"),

    pagination:
        document.getElementById("adminUsersPagination"),

    previousPageButton:
        document.getElementById("adminPreviousUsersPageButton"),

    nextPageButton:
        document.getElementById("adminNextUsersPageButton"),

    addUserButton:
        document.getElementById("adminAddUserButton"),

    exportUsersButton:
        document.getElementById("adminExportUsersButton"),

    totalUsersMetric:
        document.getElementById("adminTotalUsersMetric"),

    verifiedUsersMetric:
        document.getElementById("adminVerifiedUsersMetric"),

    pendingUsersMetric:
        document.getElementById("adminPendingUsersMetric"),

    suspendedUsersMetric:
        document.getElementById("adminSuspendedUsersMetric"),

    toastRegion:
        document.getElementById("adminToastRegion"),

    footerYear:
        document.getElementById("adminFooterYear")

};


/* =========================================================
   API CLIENT
========================================================= */

const adminUsersApi = {

    async request(
        endpoint,
        options = {}
    ) {

        const controller =
            new AbortController();

        const timeoutId =
            window.setTimeout(
                () => controller.abort(),
                ADMIN_USERS_CONFIG.requestTimeout
            );

        try {

            const response =
                await fetch(
                    `${ADMIN_USERS_CONFIG.apiBaseUrl}${endpoint}`,
                    {

                        credentials:
                            "include",

                        headers: {

                            "Content-Type":
                                "application/json",

                            ...options.headers

                        },

                        signal:
                            controller.signal,

                        ...options

                    }
                );

            const contentType =
                response.headers.get("content-type") || "";

            const payload =
                contentType.includes("application/json")
                    ? await response.json()
                    : null;

            if (!response.ok) {

                const error =
                    new Error(
                        payload?.message ||
                        "Unable to complete the request."
                    );

                error.status =
                    response.status;

                error.payload =
                    payload;

                throw error;

            }

            return payload;

        } catch (error) {

            if (error.name === "AbortError") {

                throw new Error(
                    "The request timed out. Please try again."
                );

            }

            throw error;

        } finally {

            window.clearTimeout(timeoutId);

        }

    },


    async getUsers() {

        if (ADMIN_USERS_CONFIG.demoMode) {

            await adminUsersUtilities.delay(450);

            return {

                users:
                    structuredClone(
                        ADMIN_USERS_DEMO_DATA
                    )

            };

        }

        return this.request(
            ADMIN_USERS_CONFIG.endpoints.users
        );

    },


    async createUser(userData) {

        if (ADMIN_USERS_CONFIG.demoMode) {

            await adminUsersUtilities.delay(500);

            return {

                user: {

                    ...userData,

                    id:
                        `usr-${Date.now()}`,

                    joinedAt:
                        new Date().toISOString(),

                    lastActiveAt:
                        null,

                    avatar:
                        ""

                }

            };

        }

        return this.request(
            ADMIN_USERS_CONFIG.endpoints.createUser,
            {

                method:
                    "POST",

                body:
                    JSON.stringify(userData)

            }
        );

    },


    async updateUser(
        userId,
        userData
    ) {

        if (ADMIN_USERS_CONFIG.demoMode) {

            await adminUsersUtilities.delay(450);

            return {

                user: {

                    ...userData,

                    id:
                        userId

                }

            };

        }

        return this.request(
            ADMIN_USERS_CONFIG.endpoints.updateUser(userId),
            {

                method:
                    "PATCH",

                body:
                    JSON.stringify(userData)

            }
        );

    },


    async suspendUser(
        userId,
        suspensionData
    ) {

        if (ADMIN_USERS_CONFIG.demoMode) {

            await adminUsersUtilities.delay(420);

            return {

                userId,
                status:
                    "suspended",

                ...suspensionData

            };

        }

        return this.request(
            ADMIN_USERS_CONFIG.endpoints.suspendUser(userId),
            {

                method:
                    "POST",

                body:
                    JSON.stringify(suspensionData)

            }
        );

    },


    async restoreUser(userId) {

        if (ADMIN_USERS_CONFIG.demoMode) {

            await adminUsersUtilities.delay(400);

            return {

                userId,
                status:
                    "verified"

            };

        }

        return this.request(
            ADMIN_USERS_CONFIG.endpoints.restoreUser(userId),
            {

                method:
                    "POST"

            }
        );

    },


    async deleteUser(
        userId,
        deleteRelatedData
    ) {

        if (ADMIN_USERS_CONFIG.demoMode) {

            await adminUsersUtilities.delay(500);

            return {

                success:
                    true,

                userId,
                deleteRelatedData

            };

        }

        return this.request(
            ADMIN_USERS_CONFIG.endpoints.deleteUser(userId),
            {

                method:
                    "DELETE",

                body:
                    JSON.stringify({

                        deleteRelatedData

                    })

            }
        );

    }

};


/* =========================================================
   UTILITIES
========================================================= */

const adminUsersUtilities = {

    delay(milliseconds) {

        return new Promise(
            (resolve) =>
                window.setTimeout(
                    resolve,
                    milliseconds
                )
        );

    },


    escapeHTML(value = "") {

        return String(value)
            .replaceAll("&", "&amp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replaceAll('"', "&quot;")
            .replaceAll("'", "&#039;");

    },


    getInitials(name = "") {

        return name
            .trim()
            .split(/\s+/)
            .slice(0, 2)
            .map((part) => part.charAt(0))
            .join("")
            .toUpperCase() || "US";

    },


    formatRole(role = "") {

        const labels = {

            player:
                "Player",

            coach:
                "Coach",

            scout:
                "Scout",

            academy:
                "Academy",

            supporter:
                "Supporter",

            admin:
                "Administrator"

        };

        return labels[role] || "User";

    },


    formatStatus(status = "") {

        const labels = {

            verified:
                "Verified",

            pending:
                "Pending",

            suspended:
                "Suspended",

            inactive:
                "Inactive"

        };

        return labels[status] || "Unknown";

    },


    formatDate(dateValue) {

        if (!dateValue) {

            return "Not available";

        }

        const date =
            new Date(dateValue);

        if (Number.isNaN(date.getTime())) {

            return "Not available";

        }

        return new Intl.DateTimeFormat(
            "en-IN",
            {

                day:
                    "2-digit",

                month:
                    "short",

                year:
                    "numeric"

            }
        ).format(date);

    },


    formatDateTime(dateValue) {

        if (!dateValue) {

            return "Never";

        }

        const date =
            new Date(dateValue);

        if (Number.isNaN(date.getTime())) {

            return "Unavailable";

        }

        return new Intl.DateTimeFormat(
            "en-IN",
            {

                day:
                    "2-digit",

                month:
                    "short",

                year:
                    "numeric",

                hour:
                    "2-digit",

                minute:
                    "2-digit"

            }
        ).format(date);

    },


    formatRelativeTime(dateValue) {

        if (!dateValue) {

            return "Never active";

        }

        const date =
            new Date(dateValue);

        const difference =
            Date.now() - date.getTime();

        if (Number.isNaN(difference)) {

            return "Unavailable";

        }

        const minutes =
            Math.floor(difference / 60000);

        if (minutes < 1) {

            return "Just now";

        }

        if (minutes < 60) {

            return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;

        }

        const hours =
            Math.floor(minutes / 60);

        if (hours < 24) {

            return `${hours} hour${hours === 1 ? "" : "s"} ago`;

        }

        const days =
            Math.floor(hours / 24);

        return `${days} day${days === 1 ? "" : "s"} ago`;

    }

};

/* =========================================================
   USER LOOKUP
========================================================= */

function adminUsersGetUserById(userId) {

    return adminUsersState.users.find(
        (user) => user.id === userId
    ) || null;

}


/* =========================================================
   LOADING STATE
========================================================= */

function adminUsersSetLoading(isLoading) {

    adminUsersState.isLoading =
        Boolean(isLoading);

    if (adminUsersDOM.refreshButton) {

        adminUsersDOM.refreshButton.disabled =
            adminUsersState.isLoading;

    }

    if (adminUsersDOM.tableBody && isLoading) {

        adminUsersRenderLoadingRows();

    }

}


function adminUsersRenderLoadingRows() {

    if (!adminUsersDOM.tableBody) {

        return;

    }

    const rows =
        Array.from(
            {
                length:
                    adminUsersState.pageSize
            },
            (_, index) => {

                return `
                    <tr
                        class="admin-users-loading-row"
                        aria-hidden="true"
                    >
                        <td>
                            <input
                                type="checkbox"
                                disabled
                                aria-label="Loading user ${index + 1}"
                            >
                        </td>

                        <td>
                            <div
                                class="admin-users-skeleton"
                                style="width: 210px;"
                            ></div>
                        </td>

                        <td>
                            <div
                                class="admin-users-skeleton"
                                style="width: 85px;"
                            ></div>
                        </td>

                        <td>
                            <div
                                class="admin-users-skeleton"
                                style="width: 90px;"
                            ></div>
                        </td>

                        <td>
                            <div
                                class="admin-users-skeleton"
                                style="width: 95px;"
                            ></div>
                        </td>

                        <td>
                            <div
                                class="admin-users-skeleton"
                                style="width: 105px;"
                            ></div>
                        </td>

                        <td>
                            <div
                                class="admin-users-skeleton"
                                style="width: 110px;"
                            ></div>
                        </td>

                        <td>
                            <div
                                class="admin-users-skeleton"
                                style="width: 120px;"
                            ></div>
                        </td>
                    </tr>
                `;

            }
        ).join("");

    adminUsersDOM.tableBody.innerHTML =
        rows;

}


/* =========================================================
   FILTERING AND SORTING
========================================================= */

function adminUsersReadFilters() {

    adminUsersState.filters.search =
        adminUsersDOM.searchInput?.value
            .trim()
            .toLowerCase() || "";

    adminUsersState.filters.role =
        adminUsersDOM.roleFilter?.value || "";

    adminUsersState.filters.status =
        adminUsersDOM.statusFilter?.value || "";

    adminUsersState.filters.state =
        adminUsersDOM.stateFilter?.value || "";

    adminUsersState.filters.sort =
        adminUsersDOM.sortFilter?.value || "latest";

}


function adminUsersApplyFilters() {

    adminUsersReadFilters();

    const {

        search,
        role,
        status,
        state,
        sort

    } = adminUsersState.filters;

    let filteredUsers =
        [...adminUsersState.users];

    if (search) {

        filteredUsers =
            filteredUsers.filter(
                (user) => {

                    const searchableText = [

                        user.name,
                        user.email,
                        user.phone,
                        user.role,
                        user.state,
                        user.status

                    ]
                        .filter(Boolean)
                        .join(" ")
                        .toLowerCase();

                    return searchableText.includes(search);

                }
            );

    }

    if (role) {

        filteredUsers =
            filteredUsers.filter(
                (user) => user.role === role
            );

    }

    if (status) {

        filteredUsers =
            filteredUsers.filter(
                (user) => user.status === status
            );

    }

    if (state) {

        filteredUsers =
            filteredUsers.filter(
                (user) => user.state === state
            );

    }

    filteredUsers.sort(
        (firstUser, secondUser) => {

            switch (sort) {

                case "oldest":

                    return (
                        new Date(firstUser.joinedAt).getTime() -
                        new Date(secondUser.joinedAt).getTime()
                    );

                case "name_asc":

                    return firstUser.name.localeCompare(
                        secondUser.name,
                        "en",
                        {
                            sensitivity:
                                "base"
                        }
                    );

                case "name_desc":

                    return secondUser.name.localeCompare(
                        firstUser.name,
                        "en",
                        {
                            sensitivity:
                                "base"
                        }
                    );

                case "recent_activity":

                    return (
                        new Date(
                            secondUser.lastActiveAt || 0
                        ).getTime() -
                        new Date(
                            firstUser.lastActiveAt || 0
                        ).getTime()
                    );

                case "latest":
                default:

                    return (
                        new Date(secondUser.joinedAt).getTime() -
                        new Date(firstUser.joinedAt).getTime()
                    );

            }

        }
    );

    adminUsersState.filteredUsers =
        filteredUsers;

    adminUsersState.totalPages =
        Math.max(
            1,
            Math.ceil(
                filteredUsers.length /
                adminUsersState.pageSize
            )
        );

    if (
        adminUsersState.currentPage >
        adminUsersState.totalPages
    ) {

        adminUsersState.currentPage =
            adminUsersState.totalPages;

    }

    adminUsersRender();

}


/* =========================================================
   TABLE RENDERING
========================================================= */

function adminUsersGetCurrentPageUsers() {

    const startIndex =
        (
            adminUsersState.currentPage - 1
        ) * adminUsersState.pageSize;

    const endIndex =
        startIndex +
        adminUsersState.pageSize;

    return adminUsersState.filteredUsers.slice(
        startIndex,
        endIndex
    );

}


function adminUsersRender() {

    adminUsersRenderTable();

    adminUsersRenderPagination();

    adminUsersRenderMetrics();

    adminUsersUpdateBulkActions();

}


function adminUsersRenderTable() {

    if (!adminUsersDOM.tableBody) {

        return;

    }

    const users =
        adminUsersGetCurrentPageUsers();

    if (users.length === 0) {

        adminUsersDOM.tableBody.innerHTML = `
            <tr>
                <td colspan="8">
                    <div class="admin-users-empty">

                        <div class="admin-users-empty-icon">
                            <i
                                class="fa-solid fa-users-slash"
                                aria-hidden="true"
                            ></i>
                        </div>

                        <h3>
                            No users found
                        </h3>

                        <p>
                            No accounts match the selected search and filters.
                            Reset the filters or try another search.
                        </p>

                        <button
                            class="admin-secondary-button"
                            id="adminEmptyResetFiltersButton"
                            type="button"
                        >
                            <i
                                class="fa-solid fa-rotate-left"
                                aria-hidden="true"
                            ></i>

                            Reset Filters
                        </button>

                    </div>
                </td>
            </tr>
        `;

        document
            .getElementById("adminEmptyResetFiltersButton")
            ?.addEventListener(
                "click",
                adminUsersResetFilters
            );

        return;

    }

    adminUsersDOM.tableBody.innerHTML =
        users
            .map(adminUsersCreateTableRow)
            .join("");

}


function adminUsersCreateTableRow(user) {

    const escapedId =
        adminUsersUtilities.escapeHTML(user.id);

    const escapedName =
        adminUsersUtilities.escapeHTML(user.name);

    const escapedEmail =
        adminUsersUtilities.escapeHTML(user.email);

    const escapedState =
        adminUsersUtilities.escapeHTML(
            user.state || "Not provided"
        );

    const escapedPhone =
        adminUsersUtilities.escapeHTML(
            user.phone || "Not provided"
        );

    const roleLabel =
        adminUsersUtilities.formatRole(user.role);

    const statusLabel =
        adminUsersUtilities.formatStatus(user.status);

    const avatarMarkup =
        user.avatar
            ? `
                <img
                    class="admin-user-avatar"
                    src="${adminUsersUtilities.escapeHTML(user.avatar)}"
                    alt="${escapedName}"
                    loading="lazy"
                >
            `
            : `
                <div
                    class="admin-user-avatar-placeholder"
                    aria-hidden="true"
                >
                    ${adminUsersUtilities.escapeHTML(
                        adminUsersUtilities.getInitials(user.name)
                    )}
                </div>
            `;

    const accountAction =
        user.status === "suspended"
            ? `
                <button
                    class="admin-user-action-button success"
                    type="button"
                    data-user-action="restore"
                    data-user-id="${escapedId}"
                    aria-label="Restore ${escapedName}"
                    title="Restore user"
                >
                    <i
                        class="fa-solid fa-user-check"
                        aria-hidden="true"
                    ></i>
                </button>
            `
            : `
                <button
                    class="admin-user-action-button"
                    type="button"
                    data-user-action="suspend"
                    data-user-id="${escapedId}"
                    aria-label="Suspend ${escapedName}"
                    title="Suspend user"
                >
                    <i
                        class="fa-solid fa-user-lock"
                        aria-hidden="true"
                    ></i>
                </button>
            `;

    return `
        <tr data-user-row="${escapedId}">

            <td>
                <input
                    class="admin-user-row-checkbox"
                    type="checkbox"
                    value="${escapedId}"
                    aria-label="Select ${escapedName}"
                    data-user-select="${escapedId}"
                >
            </td>

            <td>

                <div class="admin-user-cell">

                    ${avatarMarkup}

                    <div class="admin-user-information">

                        <strong class="admin-user-name">
                            ${escapedName}
                        </strong>

                        <span class="admin-user-email">
                            ${escapedEmail}
                        </span>

                    </div>

                </div>

            </td>

            <td>

                <span
                    class="admin-role-badge admin-role-${adminUsersUtilities.escapeHTML(user.role)}"
                >
                    ${adminUsersUtilities.escapeHTML(roleLabel)}
                </span>

            </td>

            <td>
                ${escapedState}
            </td>

            <td>
                ${escapedPhone}
            </td>

            <td>

                <span
                    class="admin-status-badge admin-status-${adminUsersUtilities.escapeHTML(user.status)}"
                >
                    ${adminUsersUtilities.escapeHTML(statusLabel)}
                </span>

            </td>

            <td>

                <div class="admin-last-active">

                    <strong>
                        ${adminUsersUtilities.escapeHTML(
                            adminUsersUtilities.formatRelativeTime(
                                user.lastActiveAt
                            )
                        )}
                    </strong>

                    <small>
                        ${adminUsersUtilities.escapeHTML(
                            adminUsersUtilities.formatDateTime(
                                user.lastActiveAt
                            )
                        )}
                    </small>

                </div>

            </td>

            <td>

                <div class="admin-user-actions">

                    <button
                        class="admin-user-action-button"
                        type="button"
                        data-user-action="view"
                        data-user-id="${escapedId}"
                        aria-label="View ${escapedName}"
                        title="View user"
                    >
                        <i
                            class="fa-solid fa-eye"
                            aria-hidden="true"
                        ></i>
                    </button>

                    <button
                        class="admin-user-action-button"
                        type="button"
                        data-user-action="edit"
                        data-user-id="${escapedId}"
                        aria-label="Edit ${escapedName}"
                        title="Edit user"
                    >
                        <i
                            class="fa-solid fa-pen"
                            aria-hidden="true"
                        ></i>
                    </button>

                    ${accountAction}

                    <button
                        class="admin-user-action-button danger"
                        type="button"
                        data-user-action="delete"
                        data-user-id="${escapedId}"
                        aria-label="Delete ${escapedName}"
                        title="Delete user"
                    >
                        <i
                            class="fa-solid fa-trash-can"
                            aria-hidden="true"
                        ></i>
                    </button>

                </div>

            </td>

        </tr>
    `;

}


/* =========================================================
   METRICS
========================================================= */

function adminUsersRenderMetrics() {

    const totalUsers =
        adminUsersState.users.length;

    const verifiedUsers =
        adminUsersState.users.filter(
            (user) => user.status === "verified"
        ).length;

    const pendingUsers =
        adminUsersState.users.filter(
            (user) => user.status === "pending"
        ).length;

    const suspendedUsers =
        adminUsersState.users.filter(
            (user) => user.status === "suspended"
        ).length;

    if (adminUsersDOM.totalUsersMetric) {

        adminUsersDOM.totalUsersMetric.textContent =
            totalUsers.toLocaleString("en-IN");

    }

    if (adminUsersDOM.verifiedUsersMetric) {

        adminUsersDOM.verifiedUsersMetric.textContent =
            verifiedUsers.toLocaleString("en-IN");

    }

    if (adminUsersDOM.pendingUsersMetric) {

        adminUsersDOM.pendingUsersMetric.textContent =
            pendingUsers.toLocaleString("en-IN");

    }

    if (adminUsersDOM.suspendedUsersMetric) {

        adminUsersDOM.suspendedUsersMetric.textContent =
            suspendedUsers.toLocaleString("en-IN");

    }

}


/* =========================================================
   PAGINATION
========================================================= */

function adminUsersRenderPagination() {

    if (!adminUsersDOM.pagination) {

        return;

    }

    const totalPages =
        adminUsersState.totalPages;

    const currentPage =
        adminUsersState.currentPage;

    const pageNumbers =
        adminUsersCreatePageNumberList(
            currentPage,
            totalPages
        );

    adminUsersDOM.pagination.innerHTML =
        pageNumbers
            .map(
                (pageNumber) => {

                    if (pageNumber === "...") {

                        return `
                            <span
                                class="admin-pagination-ellipsis"
                                aria-hidden="true"
                            >
                                …
                            </span>
                        `;

                    }

                    const activeClass =
                        pageNumber === currentPage
                            ? "active"
                            : "";

                    const currentAttribute =
                        pageNumber === currentPage
                            ? 'aria-current="page"'
                            : "";

                    return `
                        <button
                            class="admin-pagination-page ${activeClass}"
                            type="button"
                            data-page-number="${pageNumber}"
                            ${currentAttribute}
                        >
                            ${pageNumber}
                        </button>
                    `;

                }
            )
            .join("");

    if (adminUsersDOM.previousPageButton) {

        adminUsersDOM.previousPageButton.disabled =
            currentPage <= 1;

    }

    if (adminUsersDOM.nextPageButton) {

        adminUsersDOM.nextPageButton.disabled =
            currentPage >= totalPages;

    }

}


function adminUsersCreatePageNumberList(
    currentPage,
    totalPages
) {

    if (totalPages <= 7) {

        return Array.from(
            {
                length:
                    totalPages
            },
            (_, index) => index + 1
        );

    }

    const pages =
        [1];

    if (currentPage > 4) {

        pages.push("...");

    }

    const rangeStart =
        Math.max(
            2,
            currentPage - 1
        );

    const rangeEnd =
        Math.min(
            totalPages - 1,
            currentPage + 1
        );

    for (
        let page = rangeStart;
        page <= rangeEnd;
        page += 1
    ) {

        pages.push(page);

    }

    if (currentPage < totalPages - 3) {

        pages.push("...");

    }

    pages.push(totalPages);

    return pages;

}


function adminUsersGoToPage(pageNumber) {

    const safePage =
        Math.min(
            Math.max(
                Number(pageNumber) || 1,
                1
            ),
            adminUsersState.totalPages
        );

    if (
        safePage ===
        adminUsersState.currentPage
    ) {

        return;

    }

    adminUsersState.currentPage =
        safePage;

    adminUsersRenderTable();

    adminUsersRenderPagination();

    adminUsersUpdateBulkActions();

    document
        .querySelector(".admin-users-table-card")
        ?.scrollIntoView(
            {
                behavior:
                    "smooth",

                block:
                    "start"
            }
        );

}


/* =========================================================
   RESET FILTERS
========================================================= */

function adminUsersResetFilters() {

    if (adminUsersDOM.searchInput) {

        adminUsersDOM.searchInput.value =
            "";

    }

    if (adminUsersDOM.roleFilter) {

        adminUsersDOM.roleFilter.value =
            "";

    }

    if (adminUsersDOM.statusFilter) {

        adminUsersDOM.statusFilter.value =
            "";

    }

    if (adminUsersDOM.stateFilter) {

        adminUsersDOM.stateFilter.value =
            "";

    }

    if (adminUsersDOM.sortFilter) {

        adminUsersDOM.sortFilter.value =
            "latest";

    }

    adminUsersState.currentPage =
        1;

    adminUsersApplyFilters();

}


/* =========================================================
   BULK SELECTION
========================================================= */

function adminUsersGetSelectedUserIds() {

    return Array.from(
        document.querySelectorAll(
            ".admin-user-row-checkbox:checked"
        )
    ).map(
        (checkbox) => checkbox.value
    );

}


function adminUsersUpdateBulkActions() {

    const selectedIds =
        adminUsersGetSelectedUserIds();

    const bulkActionsBar =
        document.getElementById(
            "adminUsersBulkActionsBar"
        );

    const selectedCount =
        document.getElementById(
            "adminSelectedUsersCount"
        );

    const selectAllCheckbox =
        document.getElementById(
            "adminSelectAllUsersCheckbox"
        );

    const visibleCheckboxes =
        Array.from(
            document.querySelectorAll(
                ".admin-user-row-checkbox"
            )
        );

    if (selectedCount) {

        selectedCount.textContent =
            `${selectedIds.length} selected`;

    }

    if (bulkActionsBar) {

        bulkActionsBar.hidden =
            selectedIds.length === 0;

    }

    if (selectAllCheckbox) {

        const selectedVisibleCount =
            visibleCheckboxes.filter(
                (checkbox) => checkbox.checked
            ).length;

        selectAllCheckbox.checked =
            visibleCheckboxes.length > 0 &&
            selectedVisibleCount === visibleCheckboxes.length;

        selectAllCheckbox.indeterminate =
            selectedVisibleCount > 0 &&
            selectedVisibleCount < visibleCheckboxes.length;

    }

}


function adminUsersToggleSelectAll(event) {

    const isChecked =
        event.target.checked;

    document
        .querySelectorAll(
            ".admin-user-row-checkbox"
        )
        .forEach(
            (checkbox) => {

                checkbox.checked =
                    isChecked;

            }
        );

    adminUsersUpdateBulkActions();

}


function adminUsersClearSelection() {

    document
        .querySelectorAll(
            ".admin-user-row-checkbox"
        )
        .forEach(
            (checkbox) => {

                checkbox.checked =
                    false;

            }
        );

    const selectAllCheckbox =
        document.getElementById(
            "adminSelectAllUsersCheckbox"
        );

    if (selectAllCheckbox) {

        selectAllCheckbox.checked =
            false;

        selectAllCheckbox.indeterminate =
            false;

    }

    adminUsersUpdateBulkActions();

}
/* =========================================================
   MODAL REFERENCES
========================================================= */

const adminUsersModalDOM = {

    addUserModal:
        document.getElementById("adminAddUserModal"),

    addUserForm:
        document.getElementById("adminAddUserForm"),

    addUserCloseButton:
        document.getElementById(
            "adminAddUserModalCloseButton"
        ),

    addUserCancelButton:
        document.getElementById(
            "adminCancelAddUserButton"
        ),

    addUserBackdrop:
        document.getElementById(
            "adminAddUserModalBackdrop"
        ),


    userDetailsModal:
        document.getElementById(
            "adminUserDetailsModal"
        ),

    userDetailsContent:
        document.getElementById(
            "adminUserDetailsContent"
        ),

    userDetailsCloseButton:
        document.getElementById(
            "adminUserDetailsModalCloseButton"
        ),

    userDetailsFooterCloseButton:
        document.getElementById(
            "adminCloseUserDetailsButton"
        ),

    userDetailsBackdrop:
        document.getElementById(
            "adminUserDetailsModalBackdrop"
        ),

    editFromDetailsButton:
        document.getElementById(
            "adminEditUserFromDetailsButton"
        ),


    editUserModal:
        document.getElementById(
            "adminEditUserModal"
        ),

    editUserForm:
        document.getElementById(
            "adminEditUserForm"
        ),

    editUserCloseButton:
        document.getElementById(
            "adminEditUserModalCloseButton"
        ),

    editUserCancelButton:
        document.getElementById(
            "adminCancelEditUserButton"
        ),

    editUserBackdrop:
        document.getElementById(
            "adminEditUserModalBackdrop"
        ),


    suspendUserModal:
        document.getElementById(
            "adminSuspendUserModal"
        ),

    suspendUserForm:
        document.getElementById(
            "adminSuspendUserForm"
        ),

    suspendUserCloseButton:
        document.getElementById(
            "adminSuspendUserModalCloseButton"
        ),

    suspendUserCancelButton:
        document.getElementById(
            "adminCancelSuspendUserButton"
        ),

    suspendUserBackdrop:
        document.getElementById(
            "adminSuspendUserModalBackdrop"
        ),


    restoreUserModal:
        document.getElementById(
            "adminRestoreUserModal"
        ),

    restoreUserCloseButton:
        document.getElementById(
            "adminRestoreUserModalCloseButton"
        ),

    restoreUserCancelButton:
        document.getElementById(
            "adminCancelRestoreUserButton"
        ),

    restoreUserConfirmButton:
        document.getElementById(
            "adminConfirmRestoreUserButton"
        ),

    restoreUserBackdrop:
        document.getElementById(
            "adminRestoreUserModalBackdrop"
        ),


    deleteUserModal:
        document.getElementById(
            "adminDeleteUserModal"
        ),

    deleteUserForm:
        document.getElementById(
            "adminDeleteUserForm"
        ),

    deleteUserCloseButton:
        document.getElementById(
            "adminDeleteUserModalCloseButton"
        ),

    deleteUserCancelButton:
        document.getElementById(
            "adminCancelDeleteUserButton"
        ),

    deleteUserBackdrop:
        document.getElementById(
            "adminDeleteUserModalBackdrop"
        ),


    exportUsersModal:
        document.getElementById(
            "adminExportUsersModal"
        ),

    exportUsersForm:
        document.getElementById(
            "adminExportUsersForm"
        ),

    exportUsersCloseButton:
        document.getElementById(
            "adminExportUsersModalCloseButton"
        ),

    exportUsersCancelButton:
        document.getElementById(
            "adminCancelExportUsersButton"
        ),

    exportUsersBackdrop:
        document.getElementById(
            "adminExportUsersModalBackdrop"
        ),


    logoutModal:
        document.getElementById(
            "adminLogoutModal"
        ),

    logoutOpenButton:
        document.getElementById(
            "adminLogoutButton"
        ),

    logoutCloseButton:
        document.getElementById(
            "adminLogoutModalCloseButton"
        ),

    logoutCancelButton:
        document.getElementById(
            "adminLogoutCancelButton"
        ),

    logoutConfirmButton:
        document.getElementById(
            "adminLogoutConfirmButton"
        ),

    logoutBackdrop:
        document.getElementById(
            "adminLogoutModalBackdrop"
        )

};


/* =========================================================
   MODAL CONTROLLER
========================================================= */

function adminUsersOpenModal(
    modal,
    initialFocusElement = null
) {

    if (!modal) {

        return;

    }

    if (
        adminUsersState.activeModal &&
        adminUsersState.activeModal !== modal
    ) {

        adminUsersCloseModal(
            adminUsersState.activeModal,
            false
        );

    }

    adminUsersState.lastFocusedElement =
        document.activeElement;

    adminUsersState.activeModal =
        modal;

    modal.hidden =
        false;

    modal.setAttribute(
        "aria-hidden",
        "false"
    );

    document.body.classList.add(
        "admin-modal-open"
    );

    window.requestAnimationFrame(
        () => {

            const focusTarget =
                initialFocusElement ||
                modal.querySelector(
                    "input:not([type='hidden']), select, textarea, button"
                );

            focusTarget?.focus();

        }
    );

}


function adminUsersCloseModal(
    modal,
    restoreFocus = true
) {

    if (!modal) {

        return;

    }

    modal.hidden =
        true;

    modal.setAttribute(
        "aria-hidden",
        "true"
    );

    if (
        adminUsersState.activeModal === modal
    ) {

        adminUsersState.activeModal =
            null;

    }

    if (
        !document.querySelector(
            ".admin-modal:not([hidden])"
        )
    ) {

        document.body.classList.remove(
            "admin-modal-open"
        );

    }

    if (
        restoreFocus &&
        adminUsersState.lastFocusedElement instanceof HTMLElement
    ) {

        adminUsersState.lastFocusedElement.focus();

    }

}


function adminUsersHandleModalKeyboard(event) {

    const modal =
        adminUsersState.activeModal;

    if (!modal) {

        return;

    }

    if (event.key === "Escape") {

        event.preventDefault();

        adminUsersCloseModal(modal);

        return;

    }

    if (event.key !== "Tab") {

        return;

    }

    const focusableElements =
        Array.from(
            modal.querySelectorAll(
                [
                    "a[href]",
                    "button:not([disabled])",
                    "input:not([disabled]):not([type='hidden'])",
                    "select:not([disabled])",
                    "textarea:not([disabled])",
                    "[tabindex]:not([tabindex='-1'])"
                ].join(",")
            )
        ).filter(
            (element) =>
                element.offsetParent !== null
        );

    if (focusableElements.length === 0) {

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


/* =========================================================
   FORM VALIDATION HELPERS
========================================================= */

function adminUsersClearFormErrors(
    form,
    errorAttribute
) {

    if (!form) {

        return;

    }

    form
        .querySelectorAll(
            `[${errorAttribute}]`
        )
        .forEach(
            (errorElement) => {

                errorElement.textContent =
                    "";

            }
        );

    form
        .querySelectorAll(
            "[aria-invalid='true']"
        )
        .forEach(
            (field) => {

                field.removeAttribute(
                    "aria-invalid"
                );

            }
        );

}


function adminUsersSetFieldError(
    form,
    fieldName,
    message,
    errorAttribute
) {

    const field =
        form?.elements?.namedItem(fieldName);

    const errorElement =
        form?.querySelector(
            `[${errorAttribute}="${fieldName}"]`
        );

    if (field instanceof HTMLElement) {

        field.setAttribute(
            "aria-invalid",
            "true"
        );

    }

    if (errorElement) {

        errorElement.textContent =
            message;

    }

}


function adminUsersIsValidEmail(email) {

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        email
    );

}


function adminUsersIsValidPhone(phone) {

    if (!phone) {

        return true;

    }

    return /^[+\d][\d\s()-]{7,19}$/.test(
        phone
    );

}


/* =========================================================
   ADD USER
========================================================= */

function adminUsersOpenAddUserModal() {

    const form =
        adminUsersModalDOM.addUserForm;

    form?.reset();

    adminUsersClearFormErrors(
        form,
        "data-error-for"
    );

    const statusField =
        document.getElementById(
            "adminNewUserStatus"
        );

    if (statusField) {

        statusField.value =
            "pending";

    }

    const invitationField =
        document.getElementById(
            "adminSendInvitationEmail"
        );

    const passwordField =
        document.getElementById(
            "adminRequirePasswordReset"
        );

    if (invitationField) {

        invitationField.checked =
            true;

    }

    if (passwordField) {

        passwordField.checked =
            true;

    }

    adminUsersOpenModal(
        adminUsersModalDOM.addUserModal,
        document.getElementById(
            "adminNewUserName"
        )
    );

}


function adminUsersValidateAddUserForm() {

    const form =
        adminUsersModalDOM.addUserForm;

    if (!form) {

        return false;

    }

    adminUsersClearFormErrors(
        form,
        "data-error-for"
    );

    const formData =
        new FormData(form);

    const name =
        String(
            formData.get("name") || ""
        ).trim();

    const email =
        String(
            formData.get("email") || ""
        ).trim();

    const phone =
        String(
            formData.get("phone") || ""
        ).trim();

    const role =
        String(
            formData.get("role") || ""
        );

    const state =
        String(
            formData.get("state") || ""
        );

    const status =
        String(
            formData.get("status") || ""
        );

    let isValid =
        true;

    if (name.length < 2) {

        adminUsersSetFieldError(
            form,
            "name",
            "Enter a valid full name.",
            "data-error-for"
        );

        isValid =
            false;

    }

    if (!adminUsersIsValidEmail(email)) {

        adminUsersSetFieldError(
            form,
            "email",
            "Enter a valid email address.",
            "data-error-for"
        );

        isValid =
            false;

    }

    const duplicateEmail =
        adminUsersState.users.some(
            (user) =>
                user.email.toLowerCase() ===
                email.toLowerCase()
        );

    if (duplicateEmail) {

        adminUsersSetFieldError(
            form,
            "email",
            "An account already uses this email.",
            "data-error-for"
        );

        isValid =
            false;

    }

    if (!adminUsersIsValidPhone(phone)) {

        adminUsersSetFieldError(
            form,
            "phone",
            "Enter a valid phone number.",
            "data-error-for"
        );

        isValid =
            false;

    }

    if (!role) {

        adminUsersSetFieldError(
            form,
            "role",
            "Select a user role.",
            "data-error-for"
        );

        isValid =
            false;

    }

    if (!state) {

        adminUsersSetFieldError(
            form,
            "state",
            "Select a state.",
            "data-error-for"
        );

        isValid =
            false;

    }

    if (!status) {

        adminUsersSetFieldError(
            form,
            "status",
            "Select an account status.",
            "data-error-for"
        );

        isValid =
            false;

    }

    return isValid;

}


async function adminUsersHandleAddUserSubmit(
    event
) {

    event.preventDefault();

    if (!adminUsersValidateAddUserForm()) {

        return;

    }

    const form =
        event.currentTarget;

    const submitButton =
        document.getElementById(
            "adminCreateUserButton"
        );

    const formData =
        new FormData(form);

    const userData = {

        name:
            String(
                formData.get("name")
            ).trim(),

        email:
            String(
                formData.get("email")
            ).trim(),

        phone:
            String(
                formData.get("phone") || ""
            ).trim(),

        role:
            String(
                formData.get("role")
            ),

        state:
            String(
                formData.get("state")
            ),

        status:
            String(
                formData.get("status")
            ),

        note:
            String(
                formData.get("note") || ""
            ).trim(),

        sendInvitation:
            formData.get("sendInvitation") === "on",

        requirePasswordReset:
            formData.get(
                "requirePasswordReset"
            ) === "on"

    };

    try {

        adminUsersSetButtonLoading(
            submitButton,
            true,
            "Creating..."
        );

        const response =
            await adminUsersApi.createUser(
                userData
            );

        adminUsersState.users.unshift(
            response.user
        );

        adminUsersState.currentPage =
            1;

        adminUsersApplyFilters();

        adminUsersCloseModal(
            adminUsersModalDOM.addUserModal
        );

        adminUsersShowToast(
            "success",
            "User created",
            `${response.user.name} has been added successfully.`
        );

    } catch (error) {

        adminUsersShowToast(
            "error",
            "Unable to create user",
            error.message
        );

    } finally {

        adminUsersSetButtonLoading(
            submitButton,
            false
        );

    }

}


/* =========================================================
   USER DETAILS
========================================================= */

function adminUsersOpenUserDetails(userId) {

    const user =
        adminUsersGetUserById(userId);

    if (!user) {

        adminUsersShowToast(
            "error",
            "User not found",
            "The selected account is no longer available."
        );

        return;

    }

    adminUsersState.selectedUserId =
        user.id;

    adminUsersRenderUserDetails(user);

    adminUsersOpenModal(
        adminUsersModalDOM.userDetailsModal,
        adminUsersModalDOM.userDetailsCloseButton
    );

}


function adminUsersRenderUserDetails(user) {

    const container =
        adminUsersModalDOM.userDetailsContent;

    if (!container) {

        return;

    }

    const escapedName =
        adminUsersUtilities.escapeHTML(
            user.name
        );

    const avatarMarkup =
        user.avatar
            ? `
                <img
                    class="admin-user-details-avatar"
                    src="${adminUsersUtilities.escapeHTML(user.avatar)}"
                    alt="${escapedName}"
                >
            `
            : `
                <div
                    class="admin-user-details-avatar-placeholder"
                    aria-hidden="true"
                >
                    ${adminUsersUtilities.escapeHTML(
                        adminUsersUtilities.getInitials(
                            user.name
                        )
                    )}
                </div>
            `;

    container.innerHTML = `
        <section class="admin-user-details-hero">

            ${avatarMarkup}

            <div class="admin-user-details-heading">

                <h3>
                    ${escapedName}
                </h3>

                <p>
                    ${adminUsersUtilities.escapeHTML(user.email)}
                </p>

                <div class="admin-user-details-badges">

                    <span
                        class="admin-role-badge admin-role-${adminUsersUtilities.escapeHTML(user.role)}"
                    >
                        ${adminUsersUtilities.escapeHTML(
                            adminUsersUtilities.formatRole(
                                user.role
                            )
                        )}
                    </span>

                    <span
                        class="admin-status-badge admin-status-${adminUsersUtilities.escapeHTML(user.status)}"
                    >
                        ${adminUsersUtilities.escapeHTML(
                            adminUsersUtilities.formatStatus(
                                user.status
                            )
                        )}
                    </span>

                </div>

            </div>

        </section>


        <section class="admin-user-details-grid">

            <div class="admin-user-detail-item">

                <span>
                    User ID
                </span>

                <strong>
                    ${adminUsersUtilities.escapeHTML(user.id)}
                </strong>

            </div>


            <div class="admin-user-detail-item">

                <span>
                    Phone
                </span>

                <strong>
                    ${adminUsersUtilities.escapeHTML(
                        user.phone ||
                        "Not provided"
                    )}
                </strong>

            </div>


            <div class="admin-user-detail-item">

                <span>
                    State
                </span>

                <strong>
                    ${adminUsersUtilities.escapeHTML(
                        user.state ||
                        "Not provided"
                    )}
                </strong>

            </div>


            <div class="admin-user-detail-item">

                <span>
                    Joined
                </span>

                <strong>
                    ${adminUsersUtilities.escapeHTML(
                        adminUsersUtilities.formatDate(
                            user.joinedAt
                        )
                    )}
                </strong>

            </div>


            <div class="admin-user-detail-item">

                <span>
                    Last Active
                </span>

                <strong>
                    ${adminUsersUtilities.escapeHTML(
                        adminUsersUtilities.formatDateTime(
                            user.lastActiveAt
                        )
                    )}
                </strong>

            </div>


            <div class="admin-user-detail-item">

                <span>
                    Account Role
                </span>

                <strong>
                    ${adminUsersUtilities.escapeHTML(
                        adminUsersUtilities.formatRole(
                            user.role
                        )
                    )}
                </strong>

            </div>

        </section>


        <section class="admin-user-details-note">

            <strong>
                Administrator Note
            </strong>

            <p>
                ${adminUsersUtilities.escapeHTML(
                    user.note ||
                    "No internal note has been added."
                )}
            </p>

        </section>
    `;

}


/* =========================================================
   EDIT USER
========================================================= */

function adminUsersOpenEditUserModal(userId) {

    const user =
        adminUsersGetUserById(userId);

    if (!user) {

        adminUsersShowToast(
            "error",
            "User not found",
            "The selected account is unavailable."
        );

        return;

    }

    adminUsersState.selectedUserId =
        user.id;

    adminUsersClearFormErrors(
        adminUsersModalDOM.editUserForm,
        "data-edit-error-for"
    );

    document.getElementById(
        "adminEditUserId"
    ).value = user.id;

    document.getElementById(
        "adminEditUserName"
    ).value = user.name || "";

    document.getElementById(
        "adminEditUserEmail"
    ).value = user.email || "";

    document.getElementById(
        "adminEditUserPhone"
    ).value = user.phone || "";

    document.getElementById(
        "adminEditUserRole"
    ).value = user.role || "player";

    document.getElementById(
        "adminEditUserState"
    ).value = user.state || "";

    document.getElementById(
        "adminEditUserStatus"
    ).value = user.status || "pending";

    document.getElementById(
        "adminEditUserNote"
    ).value = user.note || "";

    adminUsersOpenModal(
        adminUsersModalDOM.editUserModal,
        document.getElementById(
            "adminEditUserName"
        )
    );

}


function adminUsersValidateEditUserForm() {

    const form =
        adminUsersModalDOM.editUserForm;

    if (!form) {

        return false;

    }

    adminUsersClearFormErrors(
        form,
        "data-edit-error-for"
    );

    const formData =
        new FormData(form);

    const userId =
        String(
            formData.get("userId") || ""
        );

    const name =
        String(
            formData.get("name") || ""
        ).trim();

    const email =
        String(
            formData.get("email") || ""
        ).trim();

    const phone =
        String(
            formData.get("phone") || ""
        ).trim();

    const role =
        String(
            formData.get("role") || ""
        );

    const state =
        String(
            formData.get("state") || ""
        ).trim();

    const status =
        String(
            formData.get("status") || ""
        );

    let isValid =
        true;

    if (name.length < 2) {

        adminUsersSetFieldError(
            form,
            "name",
            "Enter a valid full name.",
            "data-edit-error-for"
        );

        isValid =
            false;

    }

    if (!adminUsersIsValidEmail(email)) {

        adminUsersSetFieldError(
            form,
            "email",
            "Enter a valid email address.",
            "data-edit-error-for"
        );

        isValid =
            false;

    }

    const duplicateEmail =
        adminUsersState.users.some(
            (user) =>
                user.id !== userId &&
                user.email.toLowerCase() ===
                email.toLowerCase()
        );

    if (duplicateEmail) {

        adminUsersSetFieldError(
            form,
            "email",
            "Another user already uses this email.",
            "data-edit-error-for"
        );

        isValid =
            false;

    }

    if (!adminUsersIsValidPhone(phone)) {

        adminUsersSetFieldError(
            form,
            "phone",
            "Enter a valid phone number.",
            "data-edit-error-for"
        );

        isValid =
            false;

    }

    if (!role) {

        adminUsersSetFieldError(
            form,
            "role",
            "Select a user role.",
            "data-edit-error-for"
        );

        isValid =
            false;

    }

    if (!state) {

        adminUsersSetFieldError(
            form,
            "state",
            "Enter the user's state.",
            "data-edit-error-for"
        );

        isValid =
            false;

    }

    if (!status) {

        adminUsersSetFieldError(
            form,
            "status",
            "Select an account status.",
            "data-edit-error-for"
        );

        isValid =
            false;

    }

    return isValid;

}


async function adminUsersHandleEditUserSubmit(
    event
) {

    event.preventDefault();

    if (!adminUsersValidateEditUserForm()) {

        return;

    }

    const form =
        event.currentTarget;

    const formData =
        new FormData(form);

    const userId =
        String(
            formData.get("userId")
        );

    const submitButton =
        document.getElementById(
            "adminSaveUserChangesButton"
        );

    const existingUser =
        adminUsersGetUserById(userId);

    if (!existingUser) {

        adminUsersShowToast(
            "error",
            "User not found",
            "The selected account is unavailable."
        );

        return;

    }

    const updatedData = {

        name:
            String(
                formData.get("name")
            ).trim(),

        email:
            String(
                formData.get("email")
            ).trim(),

        phone:
            String(
                formData.get("phone") || ""
            ).trim(),

        role:
            String(
                formData.get("role")
            ),

        state:
            String(
                formData.get("state")
            ).trim(),

        status:
            String(
                formData.get("status")
            ),

        note:
            String(
                formData.get("note") || ""
            ).trim()

    };

    try {

        adminUsersSetButtonLoading(
            submitButton,
            true,
            "Saving..."
        );

        const response =
            await adminUsersApi.updateUser(
                userId,
                updatedData
            );

        const userIndex =
            adminUsersState.users.findIndex(
                (user) => user.id === userId
            );

        adminUsersState.users[userIndex] = {

            ...existingUser,
            ...response.user

        };

        adminUsersApplyFilters();

        adminUsersCloseModal(
            adminUsersModalDOM.editUserModal
        );

        adminUsersShowToast(
            "success",
            "User updated",
            `${updatedData.name}'s account has been updated.`
        );

    } catch (error) {

        adminUsersShowToast(
            "error",
            "Unable to update user",
            error.message
        );

    } finally {

        adminUsersSetButtonLoading(
            submitButton,
            false
        );

    }

}


/* =========================================================
   SUSPEND USER
========================================================= */

function adminUsersOpenSuspendUserModal(userId) {

    const user =
        adminUsersGetUserById(userId);

    if (!user) {

        adminUsersShowToast(
            "error",
            "User not found",
            "The selected account is unavailable."
        );

        return;

    }

    adminUsersState.selectedUserId =
        user.id;

    adminUsersModalDOM.suspendUserForm?.reset();

    adminUsersClearFormErrors(
        adminUsersModalDOM.suspendUserForm,
        "data-suspend-error-for"
    );

    document.getElementById(
        "adminSuspendUserId"
    ).value = user.id;

    document.getElementById(
        "adminSuspendUserName"
    ).textContent = user.name;

    const notifyCheckbox =
        document.getElementById(
            "adminNotifySuspendedUser"
        );

    if (notifyCheckbox) {

        notifyCheckbox.checked =
            true;

    }

    adminUsersOpenModal(
        adminUsersModalDOM.suspendUserModal,
        document.getElementById(
            "adminSuspendReason"
        )
    );

}


function adminUsersValidateSuspendForm() {

    const form =
        adminUsersModalDOM.suspendUserForm;

    if (!form) {

        return false;

    }

    adminUsersClearFormErrors(
        form,
        "data-suspend-error-for"
    );

    const formData =
        new FormData(form);

    const reason =
        String(
            formData.get("reason") || ""
        );

    const note =
        String(
            formData.get("note") || ""
        ).trim();

    let isValid =
        true;

    if (!reason) {

        adminUsersSetFieldError(
            form,
            "reason",
            "Select a suspension reason.",
            "data-suspend-error-for"
        );

        isValid =
            false;

    }

    if (note.length < 5) {

        adminUsersSetFieldError(
            form,
            "note",
            "Add a brief administrator note.",
            "data-suspend-error-for"
        );

        isValid =
            false;

    }

    return isValid;

}


async function adminUsersHandleSuspendSubmit(
    event
) {

    event.preventDefault();

    if (!adminUsersValidateSuspendForm()) {

        return;

    }

    const formData =
        new FormData(event.currentTarget);

    const userId =
        String(
            formData.get("userId")
        );

    const user =
        adminUsersGetUserById(userId);

    const submitButton =
        document.getElementById(
            "adminConfirmSuspendUserButton"
        );

    if (!user) {

        return;

    }

    const suspensionData = {

        reason:
            String(
                formData.get("reason")
            ),

        note:
            String(
                formData.get("note")
            ).trim(),

        notifyUser:
            formData.get("notifyUser") === "on"

    };

    try {

        adminUsersSetButtonLoading(
            submitButton,
            true,
            "Suspending..."
        );

        await adminUsersApi.suspendUser(
            userId,
            suspensionData
        );

        user.status =
            "suspended";

        user.note =
            suspensionData.note;

        adminUsersApplyFilters();

        adminUsersCloseModal(
            adminUsersModalDOM.suspendUserModal
        );

        adminUsersShowToast(
            "warning",
            "User suspended",
            `${user.name}'s account has been suspended.`
        );

    } catch (error) {

        adminUsersShowToast(
            "error",
            "Unable to suspend user",
            error.message
        );

    } finally {

        adminUsersSetButtonLoading(
            submitButton,
            false
        );

    }

}

/* =========================================================
   RESTORE USER
========================================================= */

function adminUsersOpenRestoreUserModal(userId) {

    const user =
        adminUsersGetUserById(userId);

    if (!user) {

        adminUsersShowToast(
            "error",
            "User not found",
            "The selected account is unavailable."
        );

        return;

    }

    adminUsersState.selectedUserId =
        user.id;

    const restoreUserName =
        document.getElementById(
            "adminRestoreUserName"
        );

    if (restoreUserName) {

        restoreUserName.textContent =
            user.name;

    }

    adminUsersOpenModal(
        adminUsersModalDOM.restoreUserModal,
        adminUsersModalDOM.restoreUserConfirmButton
    );

}


async function adminUsersHandleRestoreUser() {

    const userId =
        adminUsersState.selectedUserId;

    const user =
        adminUsersGetUserById(userId);

    const confirmButton =
        adminUsersModalDOM.restoreUserConfirmButton;

    if (!user) {

        adminUsersShowToast(
            "error",
            "User not found",
            "The selected account is unavailable."
        );

        return;

    }

    try {

        adminUsersSetButtonLoading(
            confirmButton,
            true,
            "Restoring..."
        );

        await adminUsersApi.restoreUser(
            user.id
        );

        user.status =
            "verified";

        user.note =
            "Account access restored by an administrator.";

        adminUsersApplyFilters();

        adminUsersCloseModal(
            adminUsersModalDOM.restoreUserModal
        );

        adminUsersShowToast(
            "success",
            "Access restored",
            `${user.name}'s account is active again.`
        );

    } catch (error) {

        adminUsersShowToast(
            "error",
            "Unable to restore user",
            error.message
        );

    } finally {

        adminUsersSetButtonLoading(
            confirmButton,
            false
        );

    }

}


/* =========================================================
   DELETE USER
========================================================= */

function adminUsersOpenDeleteUserModal(userId) {

    const user =
        adminUsersGetUserById(userId);

    if (!user) {

        adminUsersShowToast(
            "error",
            "User not found",
            "The selected account is unavailable."
        );

        return;

    }

    adminUsersState.selectedUserId =
        user.id;

    adminUsersModalDOM.deleteUserForm?.reset();

    adminUsersClearFormErrors(
        adminUsersModalDOM.deleteUserForm,
        "data-delete-error-for"
    );

    const userIdField =
        document.getElementById(
            "adminDeleteUserId"
        );

    const userNameElement =
        document.getElementById(
            "adminDeleteUserName"
        );

    if (userIdField) {

        userIdField.value =
            user.id;

    }

    if (userNameElement) {

        userNameElement.textContent =
            user.name;

    }

    adminUsersOpenModal(
        adminUsersModalDOM.deleteUserModal,
        document.getElementById(
            "adminDeleteUserConfirmation"
        )
    );

}


function adminUsersValidateDeleteForm() {

    const form =
        adminUsersModalDOM.deleteUserForm;

    if (!form) {

        return false;

    }

    adminUsersClearFormErrors(
        form,
        "data-delete-error-for"
    );

    const confirmation =
        String(
            new FormData(form).get(
                "confirmation"
            ) || ""
        ).trim();

    if (confirmation !== "DELETE") {

        adminUsersSetFieldError(
            form,
            "confirmation",
            "Type DELETE exactly to confirm.",
            "data-delete-error-for"
        );

        return false;

    }

    return true;

}


async function adminUsersHandleDeleteSubmit(
    event
) {

    event.preventDefault();

    if (!adminUsersValidateDeleteForm()) {

        return;

    }

    const formData =
        new FormData(event.currentTarget);

    const userId =
        String(
            formData.get("userId") || ""
        );

    const deleteRelatedData =
        formData.get(
            "deleteRelatedData"
        ) === "on";

    const user =
        adminUsersGetUserById(userId);

    const submitButton =
        document.getElementById(
            "adminConfirmDeleteUserButton"
        );

    if (!user) {

        adminUsersShowToast(
            "error",
            "User not found",
            "The selected account is unavailable."
        );

        return;

    }

    try {

        adminUsersSetButtonLoading(
            submitButton,
            true,
            "Deleting..."
        );

        await adminUsersApi.deleteUser(
            userId,
            deleteRelatedData
        );

        adminUsersState.users =
            adminUsersState.users.filter(
                (item) => item.id !== userId
            );

        adminUsersState.selectedUserId =
            null;

        adminUsersApplyFilters();

        adminUsersCloseModal(
            adminUsersModalDOM.deleteUserModal
        );

        adminUsersShowToast(
            "success",
            "User deleted",
            `${user.name}'s account has been removed.`
        );

    } catch (error) {

        adminUsersShowToast(
            "error",
            "Unable to delete user",
            error.message
        );

    } finally {

        adminUsersSetButtonLoading(
            submitButton,
            false
        );

    }

}


/* =========================================================
   EXPORT USERS
========================================================= */

function adminUsersOpenExportModal() {

    adminUsersModalDOM.exportUsersForm?.reset();

    adminUsersOpenModal(
        adminUsersModalDOM.exportUsersModal,
        document.getElementById(
            "adminUsersExportFormat"
        )
    );

}


function adminUsersConvertToCSV(users) {

    const headers = [

        "User ID",
        "Name",
        "Email",
        "Phone",
        "Role",
        "State",
        "Status",
        "Joined",
        "Last Active"

    ];

    const escapeCSVValue =
        (value) => {

            const safeValue =
                String(value ?? "");

            return `"${safeValue.replaceAll(
                '"',
                '""'
            )}"`;

        };

    const rows =
        users.map(
            (user) => [

                user.id,
                user.name,
                user.email,
                user.phone,
                adminUsersUtilities.formatRole(
                    user.role
                ),
                user.state,
                adminUsersUtilities.formatStatus(
                    user.status
                ),
                adminUsersUtilities.formatDateTime(
                    user.joinedAt
                ),
                adminUsersUtilities.formatDateTime(
                    user.lastActiveAt
                )

            ]
                .map(escapeCSVValue)
                .join(",")
        );

    return [

        headers
            .map(escapeCSVValue)
            .join(","),

        ...rows

    ].join("\n");

}


function adminUsersDownloadFile(
    content,
    filename,
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

    const downloadUrl =
        URL.createObjectURL(blob);

    const link =
        document.createElement("a");

    link.href =
        downloadUrl;

    link.download =
        filename;

    document.body.appendChild(link);

    link.click();

    link.remove();

    URL.revokeObjectURL(
        downloadUrl
    );

}


async function adminUsersHandleExportSubmit(
    event
) {

    event.preventDefault();

    const formData =
        new FormData(event.currentTarget);

    const format =
        String(
            formData.get("format") || "csv"
        );

    const scope =
        String(
            formData.get("scope") || "filtered"
        );

    const includeContactData =
        formData.get(
            "includeContactData"
        ) === "on";

    const submitButton =
        document.getElementById(
            "adminConfirmExportUsersButton"
        );

    let usersToExport = [];

    if (scope === "all") {

        usersToExport =
            [...adminUsersState.users];

    } else if (scope === "current_page") {

        usersToExport =
            adminUsersGetCurrentPageUsers();

    } else {

        usersToExport =
            [...adminUsersState.filteredUsers];

    }

    if (!includeContactData) {

        usersToExport =
            usersToExport.map(
                (user) => ({

                    ...user,

                    email:
                        "Restricted",

                    phone:
                        "Restricted"

                })
            );

    }

    if (usersToExport.length === 0) {

        adminUsersShowToast(
            "warning",
            "Nothing to export",
            "No user records are available for the selected scope."
        );

        return;

    }

    try {

        adminUsersSetButtonLoading(
            submitButton,
            true,
            "Preparing..."
        );

        await adminUsersUtilities.delay(
            500
        );

        const dateStamp =
            new Date()
                .toISOString()
                .slice(0, 10);

        if (format === "csv") {

            const csv =
                adminUsersConvertToCSV(
                    usersToExport
                );

            adminUsersDownloadFile(
                `\uFEFF${csv}`,
                `admin-users-${dateStamp}.csv`,
                "text/csv;charset=utf-8"
            );

        } else {

            const exportData =
                JSON.stringify(
                    usersToExport,
                    null,
                    2
                );

            adminUsersDownloadFile(
                exportData,
                `admin-users-${dateStamp}-${format}.json`,
                "application/json"
            );

            adminUsersShowToast(
                "warning",
                "Frontend placeholder",
                `${format.toUpperCase()} generation will be connected to the backend export service. A JSON file was downloaded for testing.`
            );

        }

        adminUsersCloseModal(
            adminUsersModalDOM.exportUsersModal
        );

        adminUsersShowToast(
            "success",
            "Export completed",
            `${usersToExport.length} user record${
                usersToExport.length === 1
                    ? ""
                    : "s"
            } exported successfully.`
        );

    } catch (error) {

        adminUsersShowToast(
            "error",
            "Export failed",
            error.message
        );

    } finally {

        adminUsersSetButtonLoading(
            submitButton,
            false
        );

    }

}


/* =========================================================
   BUTTON LOADING
========================================================= */

function adminUsersSetButtonLoading(
    button,
    isLoading,
    loadingText = "Processing..."
) {

    if (!button) {

        return;

    }

    if (isLoading) {

        if (!button.dataset.originalContent) {

            button.dataset.originalContent =
                button.innerHTML;

        }

        button.disabled =
            true;

        button.innerHTML = `
            <i
                class="fa-solid fa-spinner fa-spin"
                aria-hidden="true"
            ></i>

            ${adminUsersUtilities.escapeHTML(
                loadingText
            )}
        `;

        return;

    }

    button.disabled =
        false;

    if (button.dataset.originalContent) {

        button.innerHTML =
            button.dataset.originalContent;

        delete button.dataset.originalContent;

    }

}


/* =========================================================
   TOAST NOTIFICATIONS
========================================================= */

function adminUsersShowToast(
    type,
    title,
    message,
    duration = 4200
) {

    const region =
        adminUsersDOM.toastRegion;

    if (!region) {

        return;

    }

    const iconMap = {

        success:
            "fa-circle-check",

        error:
            "fa-circle-exclamation",

        warning:
            "fa-triangle-exclamation",

        info:
            "fa-circle-info"

    };

    const toast =
        document.createElement("article");

    toast.className =
        `admin-toast admin-toast-${type}`;

    toast.setAttribute(
        "role",
        type === "error"
            ? "alert"
            : "status"
    );

    toast.innerHTML = `
        <div class="admin-toast-icon">

            <i
                class="fa-solid ${
                    iconMap[type] ||
                    iconMap.info
                }"
                aria-hidden="true"
            ></i>

        </div>

        <div class="admin-toast-content">

            <strong>
                ${adminUsersUtilities.escapeHTML(
                    title
                )}
            </strong>

            <p>
                ${adminUsersUtilities.escapeHTML(
                    message
                )}
            </p>

        </div>

        <button
            class="admin-toast-close"
            type="button"
            aria-label="Dismiss notification"
        >
            <i
                class="fa-solid fa-xmark"
                aria-hidden="true"
            ></i>
        </button>
    `;

    const removeToast =
        () => {

            toast.classList.add(
                "is-leaving"
            );

            window.setTimeout(
                () => toast.remove(),
                220
            );

        };

    toast
        .querySelector(
            ".admin-toast-close"
        )
        ?.addEventListener(
            "click",
            removeToast
        );

    region.appendChild(toast);

    window.setTimeout(
        removeToast,
        duration
    );

}


/* =========================================================
   TABLE ACTION HANDLER
========================================================= */

function adminUsersHandleTableClick(event) {

    const actionButton =
        event.target.closest(
            "[data-user-action]"
        );

    if (!actionButton) {

        return;

    }

    const userId =
        actionButton.dataset.userId;

    const action =
        actionButton.dataset.userAction;

    switch (action) {

        case "view":

            adminUsersOpenUserDetails(
                userId
            );

            break;

        case "edit":

            adminUsersOpenEditUserModal(
                userId
            );

            break;

        case "suspend":

            adminUsersOpenSuspendUserModal(
                userId
            );

            break;

        case "restore":

            adminUsersOpenRestoreUserModal(
                userId
            );

            break;

        case "delete":

            adminUsersOpenDeleteUserModal(
                userId
            );

            break;

        default:

            break;

    }

}


/* =========================================================
   FILTER EVENTS
========================================================= */

let adminUsersSearchTimeout =
    null;


function adminUsersHandleSearchInput() {

    window.clearTimeout(
        adminUsersSearchTimeout
    );

    adminUsersSearchTimeout =
        window.setTimeout(
            () => {

                adminUsersState.currentPage =
                    1;

                adminUsersApplyFilters();

            },
            250
        );

}


function adminUsersHandleFilterSubmit(
    event
) {

    event.preventDefault();

    adminUsersState.currentPage =
        1;

    adminUsersApplyFilters();

}


function adminUsersHandlePaginationClick(
    event
) {

    const pageButton =
        event.target.closest(
            "[data-page-number]"
        );

    if (!pageButton) {

        return;

    }

    adminUsersGoToPage(
        pageButton.dataset.pageNumber
    );

}


/* =========================================================
   USER DETAILS TO EDIT
========================================================= */

function adminUsersHandleEditFromDetails() {

    const userId =
        adminUsersState.selectedUserId;

    if (!userId) {

        return;

    }

    adminUsersCloseModal(
        adminUsersModalDOM.userDetailsModal,
        false
    );

    adminUsersOpenEditUserModal(
        userId
    );

}


/* =========================================================
   LOGOUT
========================================================= */

function adminUsersOpenLogoutModal() {

    adminUsersOpenModal(
        adminUsersModalDOM.logoutModal,
        adminUsersModalDOM.logoutConfirmButton
    );

}


async function adminUsersHandleLogout() {

    const button =
        adminUsersModalDOM.logoutConfirmButton;

    try {

        adminUsersSetButtonLoading(
            button,
            true,
            "Signing Out..."
        );

        if (
            !ADMIN_USERS_CONFIG.demoMode
        ) {

            await adminUsersApi.request(
                ADMIN_USERS_CONFIG.endpoints.logout,
                {
                    method:
                        "POST"
                }
            );

        } else {

            await adminUsersUtilities.delay(
                450
            );

        }

        window.location.href =
            "admin-login.html";

    } catch (error) {

        adminUsersSetButtonLoading(
            button,
            false
        );

        adminUsersShowToast(
            "error",
            "Sign out failed",
            error.message
        );

    }

}


/* =========================================================
   DATA LOADING
========================================================= */

async function adminUsersLoadUsers() {

    try {

        adminUsersSetLoading(
            true
        );

        const response =
            await adminUsersApi.getUsers();

        adminUsersState.users =
            Array.isArray(response?.users)
                ? response.users
                : [];

        adminUsersState.currentPage =
            1;

        adminUsersApplyFilters();

    } catch (error) {

        adminUsersState.users =
            [];

        adminUsersState.filteredUsers =
            [];

        adminUsersRender();

        adminUsersShowToast(
            "error",
            "Unable to load users",
            error.message
        );

    } finally {

        adminUsersSetLoading(
            false
        );

    }

}


/* =========================================================
   EVENT BINDING
========================================================= */

function adminUsersBindModalCloseEvents() {

    const closeBindings = [

        [
            adminUsersModalDOM.addUserCloseButton,
            adminUsersModalDOM.addUserModal
        ],

        [
            adminUsersModalDOM.addUserCancelButton,
            adminUsersModalDOM.addUserModal
        ],

        [
            adminUsersModalDOM.addUserBackdrop,
            adminUsersModalDOM.addUserModal
        ],

        [
            adminUsersModalDOM.userDetailsCloseButton,
            adminUsersModalDOM.userDetailsModal
        ],

        [
            adminUsersModalDOM.userDetailsFooterCloseButton,
            adminUsersModalDOM.userDetailsModal
        ],

        [
            adminUsersModalDOM.userDetailsBackdrop,
            adminUsersModalDOM.userDetailsModal
        ],

        [
            adminUsersModalDOM.editUserCloseButton,
            adminUsersModalDOM.editUserModal
        ],

        [
            adminUsersModalDOM.editUserCancelButton,
            adminUsersModalDOM.editUserModal
        ],

        [
            adminUsersModalDOM.editUserBackdrop,
            adminUsersModalDOM.editUserModal
        ],

        [
            adminUsersModalDOM.suspendUserCloseButton,
            adminUsersModalDOM.suspendUserModal
        ],

        [
            adminUsersModalDOM.suspendUserCancelButton,
            adminUsersModalDOM.suspendUserModal
        ],

        [
            adminUsersModalDOM.suspendUserBackdrop,
            adminUsersModalDOM.suspendUserModal
        ],

        [
            adminUsersModalDOM.restoreUserCloseButton,
            adminUsersModalDOM.restoreUserModal
        ],

        [
            adminUsersModalDOM.restoreUserCancelButton,
            adminUsersModalDOM.restoreUserModal
        ],

        [
            adminUsersModalDOM.restoreUserBackdrop,
            adminUsersModalDOM.restoreUserModal
        ],

        [
            adminUsersModalDOM.deleteUserCloseButton,
            adminUsersModalDOM.deleteUserModal
        ],

        [
            adminUsersModalDOM.deleteUserCancelButton,
            adminUsersModalDOM.deleteUserModal
        ],

        [
            adminUsersModalDOM.deleteUserBackdrop,
            adminUsersModalDOM.deleteUserModal
        ],

        [
            adminUsersModalDOM.exportUsersCloseButton,
            adminUsersModalDOM.exportUsersModal
        ],

        [
            adminUsersModalDOM.exportUsersCancelButton,
            adminUsersModalDOM.exportUsersModal
        ],

        [
            adminUsersModalDOM.exportUsersBackdrop,
            adminUsersModalDOM.exportUsersModal
        ],

        [
            adminUsersModalDOM.logoutCloseButton,
            adminUsersModalDOM.logoutModal
        ],

        [
            adminUsersModalDOM.logoutCancelButton,
            adminUsersModalDOM.logoutModal
        ],

        [
            adminUsersModalDOM.logoutBackdrop,
            adminUsersModalDOM.logoutModal
        ]

    ];

    closeBindings.forEach(
        ([trigger, modal]) => {

            trigger?.addEventListener(
                "click",
                () => adminUsersCloseModal(
                    modal
                )
            );

        }
    );

}


function adminUsersBindEvents() {

    adminUsersDOM.filterForm
        ?.addEventListener(
            "submit",
            adminUsersHandleFilterSubmit
        );

    adminUsersDOM.searchInput
        ?.addEventListener(
            "input",
            adminUsersHandleSearchInput
        );

    adminUsersDOM.roleFilter
        ?.addEventListener(
            "change",
            adminUsersHandleFilterSubmit
        );

    adminUsersDOM.statusFilter
        ?.addEventListener(
            "change",
            adminUsersHandleFilterSubmit
        );

    adminUsersDOM.stateFilter
        ?.addEventListener(
            "change",
            adminUsersHandleFilterSubmit
        );

    adminUsersDOM.sortFilter
        ?.addEventListener(
            "change",
            adminUsersHandleFilterSubmit
        );

    adminUsersDOM.resetFiltersButton
        ?.addEventListener(
            "click",
            adminUsersResetFilters
        );

    adminUsersDOM.refreshButton
        ?.addEventListener(
            "click",
            adminUsersLoadUsers
        );

    adminUsersDOM.addUserButton
        ?.addEventListener(
            "click",
            adminUsersOpenAddUserModal
        );

    adminUsersDOM.exportUsersButton
        ?.addEventListener(
            "click",
            adminUsersOpenExportModal
        );

    adminUsersDOM.tableBody
        ?.addEventListener(
            "click",
            adminUsersHandleTableClick
        );

    adminUsersDOM.tableBody
        ?.addEventListener(
            "change",
            adminUsersUpdateBulkActions
        );

    adminUsersDOM.pagination
        ?.addEventListener(
            "click",
            adminUsersHandlePaginationClick
        );

    adminUsersDOM.previousPageButton
        ?.addEventListener(
            "click",
            () => adminUsersGoToPage(
                adminUsersState.currentPage - 1
            )
        );

    adminUsersDOM.nextPageButton
        ?.addEventListener(
            "click",
            () => adminUsersGoToPage(
                adminUsersState.currentPage + 1
            )
        );

    document
        .getElementById(
            "adminSelectAllUsersCheckbox"
        )
        ?.addEventListener(
            "change",
            adminUsersToggleSelectAll
        );

    document
        .getElementById(
            "adminClearUsersSelectionButton"
        )
        ?.addEventListener(
            "click",
            adminUsersClearSelection
        );

    adminUsersModalDOM.addUserForm
        ?.addEventListener(
            "submit",
            adminUsersHandleAddUserSubmit
        );

    adminUsersModalDOM.editUserForm
        ?.addEventListener(
            "submit",
            adminUsersHandleEditUserSubmit
        );

    adminUsersModalDOM.suspendUserForm
        ?.addEventListener(
            "submit",
            adminUsersHandleSuspendSubmit
        );

    adminUsersModalDOM.restoreUserConfirmButton
        ?.addEventListener(
            "click",
            adminUsersHandleRestoreUser
        );

    adminUsersModalDOM.deleteUserForm
        ?.addEventListener(
            "submit",
            adminUsersHandleDeleteSubmit
        );

    adminUsersModalDOM.exportUsersForm
        ?.addEventListener(
            "submit",
            adminUsersHandleExportSubmit
        );

    adminUsersModalDOM.editFromDetailsButton
        ?.addEventListener(
            "click",
            adminUsersHandleEditFromDetails
        );

    adminUsersModalDOM.logoutOpenButton
        ?.addEventListener(
            "click",
            adminUsersOpenLogoutModal
        );

    adminUsersModalDOM.logoutConfirmButton
        ?.addEventListener(
            "click",
            adminUsersHandleLogout
        );

    document.addEventListener(
        "keydown",
        adminUsersHandleModalKeyboard
    );

    adminUsersBindModalCloseEvents();

}


/* =========================================================
   INITIALIZATION
========================================================= */

async function adminUsersInitialize() {

    if (adminUsersDOM.footerYear) {

        adminUsersDOM.footerYear.textContent =
            new Date()
                .getFullYear()
                .toString();

    }

    adminUsersBindEvents();

    await adminUsersLoadUsers();

    if (adminUsersDOM.loadingScreen) {

        adminUsersDOM.loadingScreen.classList.add(
            "is-hidden"
        );

        window.setTimeout(
            () => {

                adminUsersDOM.loadingScreen.hidden =
                    true;

            },
            300
        );

    }

}


if (
    document.readyState === "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        adminUsersInitialize,
        {
            once:
                true
        }
    );

} else {

    adminUsersInitialize();

}