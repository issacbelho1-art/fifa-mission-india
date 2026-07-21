/* =========================================================
   BHARAT FOOTBALL FANS
   MISSION FIFA 2034
   ADMIN DASHBOARD JAVASCRIPT
   PART 1A

   Frontend-only architecture with backend placeholders.
   ========================================================= */

"use strict";


/* =========================================================
   CONFIGURATION
========================================================= */

const ADMIN_CONFIG = Object.freeze({

    apiBaseUrl: "/api/v1",

    endpoints: Object.freeze({

        session:
            "/admin/auth/session",

        refreshSession:
            "/admin/auth/refresh",

        logout:
            "/admin/auth/logout",

        dashboard:
            "/admin/dashboard",

        activity:
            "/admin/activity?limit=10",

        approvals:
            "/admin/approvals?status=pending&limit=5",

        reports:
            "/admin/reports?status=open&limit=5",

        notifications:
            "/admin/notifications?limit=10",

        markNotificationsRead:
            "/admin/notifications/read-all",

        systemHealth:
            "/admin/system/health",

        exportReport:
            "/admin/reports/export"

    }),

    requestTimeout:
        12000,

    sessionWarningSeconds:
        300,

    sessionCheckInterval:
        30000,

    toastDuration:
        4500,

    loadingDelay:
        350,

    useDemoData:
        true

});


/* =========================================================
   APPLICATION STATE
========================================================= */

const adminState = {

    currentUser: null,

    session: {

        authenticated:
            false,

        expiresAt:
            null,

        warningDisplayed:
            false

    },

    dashboard: {

        metrics:
            null,

        activity:
            [],

        approvals:
            [],

        reports:
            [],

        notifications:
            [],

        health:
            null

    },

    ui: {

        sidebarOpen:
            false,

        activeDropdown:
            null,

        activeModal:
            null,

        lastFocusedElement:
            null,

        loading:
            true

    }

};


/* =========================================================
   DOM ELEMENT CACHE
========================================================= */

const adminElements = {};


/* =========================================================
   SAFE DOM QUERY HELPERS
========================================================= */

function getElement(id) {

    return document.getElementById(id);

}


function queryElement(selector, parent = document) {

    return parent.querySelector(selector);

}


function queryElements(selector, parent = document) {

    return Array.from(
        parent.querySelectorAll(selector)
    );

}


/* =========================================================
   CACHE DOM ELEMENTS
========================================================= */

function cacheAdminElements() {

    adminElements.loadingScreen =
        getElement("adminLoadingScreen");

    adminElements.sessionWarning =
        getElement("adminSessionWarning");

    adminElements.sessionWarningText =
        getElement("adminSessionWarningText");

    adminElements.sessionExtendButton =
        getElement("adminSessionExtendButton");

    adminElements.sessionWarningClose =
        getElement("adminSessionWarningClose");


    adminElements.sidebar =
        getElement("adminSidebar");

    adminElements.sidebarOverlay =
        getElement("adminSidebarOverlay");

    adminElements.sidebarOpenButton =
        getElement("adminSidebarOpenButton");

    adminElements.sidebarCloseButton =
        getElement("adminSidebarCloseButton");


    adminElements.globalSearchForm =
        getElement("adminGlobalSearchForm");

    adminElements.globalSearchInput =
        getElement("adminGlobalSearchInput");

    adminElements.globalSearchResults =
        getElement("adminGlobalSearchResults");


    adminElements.notificationButton =
        getElement("adminNotificationButton");

    adminElements.notificationPanel =
        getElement("adminNotificationPanel");

    adminElements.notificationList =
        getElement("adminNotificationList");

    adminElements.notificationBadge =
        getElement("adminNotificationBadge");

    adminElements.markNotificationsReadButton =
        getElement("adminMarkNotificationsReadButton");


    adminElements.quickCreateButton =
        getElement("adminQuickCreateButton");

    adminElements.quickCreateMenu =
        getElement("adminQuickCreateMenu");


    adminElements.profileMenuButton =
        getElement("adminProfileMenuButton");

    adminElements.profileDropdown =
        getElement("adminProfileDropdown");

    adminElements.topbarProfileButton =
        getElement("adminTopbarProfileButton");

    adminElements.topbarProfileDropdown =
        getElement("adminTopbarProfileDropdown");


    adminElements.logoutButtons =
        queryElements("[data-admin-logout]");


    adminElements.exportButton =
        getElement("adminExportButton");

    adminElements.refreshDashboardButton =
        getElement("adminRefreshDashboardButton");


    adminElements.logoutModal =
        getElement("adminLogoutModal");

    adminElements.logoutModalBackdrop =
        getElement("adminLogoutModalBackdrop");

    adminElements.logoutModalCloseButton =
        getElement("adminLogoutModalCloseButton");

    adminElements.logoutCancelButton =
        getElement("adminLogoutCancelButton");

    adminElements.logoutConfirmButton =
        getElement("adminLogoutConfirmButton");


    adminElements.exportModal =
        getElement("adminExportModal");

    adminElements.exportModalBackdrop =
        getElement("adminExportModalBackdrop");

    adminElements.exportModalCloseButton =
        getElement("adminExportModalCloseButton");

    adminElements.exportCancelButton =
        getElement("adminExportCancelButton");

    adminElements.exportForm =
        getElement("adminExportForm");


    adminElements.confirmationModal =
        getElement("adminConfirmationModal");

    adminElements.confirmationModalBackdrop =
        getElement("adminConfirmationModalBackdrop");

    adminElements.confirmationModalCloseButton =
        getElement("adminConfirmationModalCloseButton");

    adminElements.confirmationModalTitle =
        getElement("adminConfirmationModalTitle");

    adminElements.confirmationModalDescription =
        getElement("adminConfirmationModalDescription");

    adminElements.confirmationModalIcon =
        getElement("adminConfirmationModalIcon");

    adminElements.confirmationCancelButton =
        getElement("adminConfirmationCancelButton");

    adminElements.confirmationConfirmButton =
        getElement("adminConfirmationConfirmButton");


    adminElements.toastRegion =
        getElement("adminToastRegion");

    adminElements.footerYear =
        getElement("adminFooterYear");


    adminElements.totalUsersMetric =
        getElement("totalUsersMetric");

    adminElements.verifiedMembersMetric =
        getElement("verifiedMembersMetric");

    adminElements.pendingApprovalsMetric =
        getElement("pendingApprovalsMetric");

    adminElements.securityAlertsMetric =
        getElement("securityAlertsMetric");

    adminElements.academiesMetric =
        getElement("academiesMetric");

    adminElements.activeEventsMetric =
        getElement("activeEventsMetric");


    adminElements.activityFeed =
        getElement("adminActivityFeed");

    adminElements.approvalList =
        getElement("adminApprovalList");

    adminElements.reportList =
        getElement("adminReportList");


    adminElements.apiHealthBadge =
        getElement("apiHealthBadge");

    adminElements.databaseHealthBadge =
        getElement("databaseHealthBadge");

}


/* =========================================================
   BASIC UTILITY FUNCTIONS
========================================================= */

function sleep(milliseconds) {

    return new Promise((resolve) => {

        window.setTimeout(
            resolve,
            milliseconds
        );

    });

}


function escapeHTML(value) {

    const temporaryElement =
        document.createElement("div");

    temporaryElement.textContent =
        String(value ?? "");

    return temporaryElement.innerHTML;

}


function formatNumber(value) {

    const numericValue =
        Number(value);

    if (!Number.isFinite(numericValue)) {

        return "0";

    }

    return new Intl.NumberFormat(
        "en-IN"
    ).format(numericValue);

}


function formatDateTime(value) {

    if (!value) {

        return "Not available";

    }

    const date =
        new Date(value);

    if (Number.isNaN(date.getTime())) {

        return "Not available";

    }

    return new Intl.DateTimeFormat(
        "en-IN",
        {

            dateStyle:
                "medium",

            timeStyle:
                "short"

        }
    ).format(date);

}


function formatRelativeTime(value) {

    const date =
        new Date(value);

    if (Number.isNaN(date.getTime())) {

        return "Recently";

    }

    const differenceSeconds =
        Math.round(
            (date.getTime() - Date.now()) / 1000
        );

    const absoluteDifference =
        Math.abs(differenceSeconds);

    const formatter =
        new Intl.RelativeTimeFormat(
            "en",
            {

                numeric:
                    "auto"

            }
        );

    if (absoluteDifference < 60) {

        return formatter.format(
            differenceSeconds,
            "second"
        );

    }

    if (absoluteDifference < 3600) {

        return formatter.format(
            Math.round(differenceSeconds / 60),
            "minute"
        );

    }

    if (absoluteDifference < 86400) {

        return formatter.format(
            Math.round(differenceSeconds / 3600),
            "hour"
        );

    }

    return formatter.format(
        Math.round(differenceSeconds / 86400),
        "day"
    );

}


/* =========================================================
   API ERROR CLASS
========================================================= */

class AdminAPIError extends Error {

    constructor(
        message,
        status = 0,
        details = null
    ) {

        super(message);

        this.name =
            "AdminAPIError";

        this.status =
            status;

        this.details =
            details;

    }

}


/* =========================================================
   API REQUEST HELPER
========================================================= */

async function adminApiRequest(
    endpoint,
    options = {}
) {

    const controller =
        new AbortController();

    const timeoutId =
        window.setTimeout(
            () => {

                controller.abort();

            },
            ADMIN_CONFIG.requestTimeout
        );


    const requestOptions = {

        method:
            options.method || "GET",

        credentials:
            "include",

        headers: {

            Accept:
                "application/json",

            ...(options.body
                ? {
                    "Content-Type":
                        "application/json"
                }
                : {}),

            ...options.headers

        },

        signal:
            controller.signal

    };


    if (options.body) {

        requestOptions.body =
            typeof options.body === "string"
                ? options.body
                : JSON.stringify(options.body);

    }


    try {

        const response =
            await fetch(
                `${ADMIN_CONFIG.apiBaseUrl}${endpoint}`,
                requestOptions
            );


        const contentType =
            response.headers.get(
                "content-type"
            ) || "";


        let responseData =
            null;


        if (
            contentType.includes(
                "application/json"
            )
        ) {

            responseData =
                await response.json();

        } else {

            responseData =
                await response.text();

        }


        if (!response.ok) {

            const errorMessage =
                responseData?.message ||
                responseData?.detail ||
                `Request failed with status ${response.status}.`;

            throw new AdminAPIError(
                errorMessage,
                response.status,
                responseData
            );

        }


        return responseData;

    } catch (error) {

        if (
            error.name ===
            "AbortError"
        ) {

            throw new AdminAPIError(
                "The request timed out. Please try again.",
                408
            );

        }


        if (
            error instanceof
            AdminAPIError
        ) {

            throw error;

        }


        throw new AdminAPIError(
            "Unable to connect to the server.",
            0,
            error
        );

    } finally {

        window.clearTimeout(
            timeoutId
        );

    }

}


/* =========================================================
   SECURITY NOTES

   HARSH:
   Keep access and refresh tokens out of normal JavaScript
   storage where possible. Prefer secure server-managed cookies.

   SAMARTH:
   Frontend checks are only interface protections.
   Every admin endpoint must independently verify:
   - authentication
   - admin role
   - permissions
   - token issuer
   - token audience
   - token expiry
   - request origin
   - CSRF token for cookie-based mutations
========================================================= */


/* =========================================================
   DEMO DATA
========================================================= */

function getDemoDashboardData() {

    const now =
        Date.now();

    return {

        user: {

            id:
                "admin-demo-001",

            name:
                "Mission Administrator",

            role:
                "Super Administrator",

            email:
                "admin@bharatfootballfans.in",

            avatar:
                "images/admin/admin-avatar.jpg"

        },

        session: {

            authenticated:
                true,

            expiresAt:
                new Date(
                    now + 45 * 60 * 1000
                ).toISOString()

        },

        metrics: {

            totalUsers:
                18426,

            verifiedMembers:
                12984,

            pendingApprovals:
                73,

            securityAlerts:
                2,

            academies:
                148,

            activeEvents:
                16

        },

        activity: [

            {

                id:
                    "activity-001",

                type:
                    "player",

                title:
                    "New player registration",

                description:
                    "A new player profile was submitted for verification.",

                createdAt:
                    new Date(
                        now - 8 * 60 * 1000
                    ).toISOString()

            },

            {

                id:
                    "activity-002",

                type:
                    "academy",

                title:
                    "Academy profile updated",

                description:
                    "An academy submitted new programme and coaching details.",

                createdAt:
                    new Date(
                        now - 35 * 60 * 1000
                    ).toISOString()

            },

            {

                id:
                    "activity-003",

                type:
                    "event",

                title:
                    "Football event created",

                description:
                    "A new youth development event was added to the platform.",

                createdAt:
                    new Date(
                        now - 2 * 60 * 60 * 1000
                    ).toISOString()

            }

        ],

        approvals: [

            {

                id:
                    "approval-001",

                name:
                    "Aarav Sharma",

                category:
                    "Player",

                location:
                    "Punjab, India",

                avatar:
                    "images/players/player-placeholder.jpg",

                submittedAt:
                    new Date(
                        now - 46 * 60 * 1000
                    ).toISOString()

            },

            {

                id:
                    "approval-002",

                name:
                    "Elite Future Academy",

                category:
                    "Academy",

                location:
                    "Assam, India",

                avatar:
                    "images/academies/academy-placeholder.png",

                submittedAt:
                    new Date(
                        now - 3 * 60 * 60 * 1000
                    ).toISOString()

            }

        ],

        reports: [

            {

                id:
                    "report-001",

                title:
                    "Profile information review",

                description:
                    "A community member reported potentially inaccurate profile information.",

                priority:
                    "medium",

                createdAt:
                    new Date(
                        now - 4 * 60 * 60 * 1000
                    ).toISOString()

            },

            {

                id:
                    "report-002",

                title:
                    "Uploaded image requires review",

                description:
                    "A recently uploaded academy image was flagged for moderation.",

                priority:
                    "high",

                createdAt:
                    new Date(
                        now - 7 * 60 * 60 * 1000
                    ).toISOString()

            }

        ],

        notifications: [

            {

                id:
                    "notification-001",

                title:
                    "New approval requests",

                message:
                    "Several new registrations are waiting for administrative review.",

                type:
                    "approval",

                unread:
                    true,

                createdAt:
                    new Date(
                        now - 18 * 60 * 1000
                    ).toISOString()

            },

            {

                id:
                    "notification-002",

                title:
                    "Security review available",

                message:
                    "The latest platform security summary is ready.",

                type:
                    "security",

                unread:
                    true,

                createdAt:
                    new Date(
                        now - 90 * 60 * 1000
                    ).toISOString()

            }

        ],

        health: {

            api:
                "demo",

            database:
                "demo",

            authentication:
                "ready",

            storage:
                "pending"

        }

    };

}

/* =========================================================
   APPLICATION INITIALIZATION
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    initializeAdminDashboard
);


async function initializeAdminDashboard() {

    cacheAdminElements();

    setFooterYear();

    bindAdminEvents();

    setupKeyboardShortcuts();

    setupResponsiveState();

    setupNavigationHighlight();

    try {

        await loadAdminDashboard();

    } catch (error) {

        handleInitializationError(error);

    } finally {

        await sleep(
            ADMIN_CONFIG.loadingDelay
        );

        hideLoadingScreen();

    }

}


/* =========================================================
   LOAD ADMIN DASHBOARD
========================================================= */

async function loadAdminDashboard() {

    adminState.ui.loading =
        true;

    setDashboardLoadingState(
        true
    );

    try {

        let dashboardData;


        if (ADMIN_CONFIG.useDemoData) {

            dashboardData =
                getDemoDashboardData();

            await sleep(450);

        } else {

            dashboardData =
                await loadDashboardFromBackend();

        }


        applyDashboardData(
            dashboardData
        );

        renderAdminDashboard();

        startSessionMonitoring();

    } catch (error) {

        handleDashboardLoadError(error);

        throw error;

    } finally {

        adminState.ui.loading =
            false;

        setDashboardLoadingState(
            false
        );

    }

}


/* =========================================================
   BACKEND DASHBOARD LOADING
========================================================= */

async function loadDashboardFromBackend() {

    const [
        sessionData,
        dashboardData,
        activityData,
        approvalData,
        reportData,
        notificationData,
        healthData
    ] = await Promise.all([

        adminApiRequest(
            ADMIN_CONFIG.endpoints.session
        ),

        adminApiRequest(
            ADMIN_CONFIG.endpoints.dashboard
        ),

        adminApiRequest(
            ADMIN_CONFIG.endpoints.activity
        ),

        adminApiRequest(
            ADMIN_CONFIG.endpoints.approvals
        ),

        adminApiRequest(
            ADMIN_CONFIG.endpoints.reports
        ),

        adminApiRequest(
            ADMIN_CONFIG.endpoints.notifications
        ),

        adminApiRequest(
            ADMIN_CONFIG.endpoints.systemHealth
        )

    ]);


    return {

        user:
            sessionData.user,

        session: {

            authenticated:
                sessionData.authenticated,

            expiresAt:
                sessionData.expiresAt

        },

        metrics:
            dashboardData.metrics,

        activity:
            activityData.items || activityData,

        approvals:
            approvalData.items || approvalData,

        reports:
            reportData.items || reportData,

        notifications:
            notificationData.items || notificationData,

        health:
            healthData

    };

}


/* =========================================================
   APPLY DASHBOARD DATA TO STATE
========================================================= */

function applyDashboardData(data) {

    if (!data) {

        throw new AdminAPIError(
            "Dashboard data is unavailable."
        );

    }


    adminState.currentUser =
        data.user || null;


    adminState.session.authenticated =
        Boolean(
            data.session?.authenticated
        );


    adminState.session.expiresAt =
        data.session?.expiresAt || null;


    adminState.session.warningDisplayed =
        false;


    adminState.dashboard.metrics =
        data.metrics || {};


    adminState.dashboard.activity =
        Array.isArray(data.activity)
            ? data.activity
            : [];


    adminState.dashboard.approvals =
        Array.isArray(data.approvals)
            ? data.approvals
            : [];


    adminState.dashboard.reports =
        Array.isArray(data.reports)
            ? data.reports
            : [];


    adminState.dashboard.notifications =
        Array.isArray(data.notifications)
            ? data.notifications
            : [];


    adminState.dashboard.health =
        data.health || {};


    if (
        !adminState.session.authenticated &&
        !ADMIN_CONFIG.useDemoData
    ) {

        redirectToAdminLogin();

    }

}


/* =========================================================
   RENDER COMPLETE DASHBOARD
========================================================= */

function renderAdminDashboard() {

    renderCurrentAdmin();

    renderDashboardMetrics();

    renderActivityFeed();

    renderApprovalList();

    renderReportList();

    renderNotifications();

    renderSystemHealth();

}


/* =========================================================
   CURRENT ADMIN PROFILE
========================================================= */

function renderCurrentAdmin() {

    const user =
        adminState.currentUser;


    if (!user) {

        return;

    }


    const adminNameElements =
        queryElements(
            "[data-admin-name]"
        );


    const adminRoleElements =
        queryElements(
            "[data-admin-role]"
        );


    const adminEmailElements =
        queryElements(
            "[data-admin-email]"
        );


    const adminAvatarElements =
        queryElements(
            "[data-admin-avatar]"
        );


    adminNameElements.forEach(
        (element) => {

            element.textContent =
                user.name ||
                "Administrator";

        }
    );


    adminRoleElements.forEach(
        (element) => {

            element.textContent =
                user.role ||
                "Administrator";

        }
    );


    adminEmailElements.forEach(
        (element) => {

            element.textContent =
                user.email ||
                "Not available";

        }
    );


    adminAvatarElements.forEach(
        (element) => {

            if (
                element instanceof
                HTMLImageElement
            ) {

                element.src =
                    user.avatar ||
                    "images/admin/admin-avatar-placeholder.png";

                element.alt =
                    `${user.name || "Administrator"} profile photo`;

                element.addEventListener(
                    "error",
                    handleAdminAvatarError,
                    {
                        once: true
                    }
                );

            }

        }
    );


    const welcomeName =
        queryElement(
            "[data-admin-welcome-name]"
        );


    if (welcomeName) {

        const firstName =
            String(
                user.name ||
                "Administrator"
            )
                .trim()
                .split(/\s+/)[0];

        welcomeName.textContent =
            firstName;

    }

}


function handleAdminAvatarError(event) {

    const image =
        event.currentTarget;

    image.src =
        createAvatarDataURL(
            adminState.currentUser?.name ||
            "Administrator"
        );

}


function createAvatarDataURL(name) {

    const initials =
        String(name)
            .trim()
            .split(/\s+/)
            .slice(0, 2)
            .map((part) => {

                return part.charAt(0).toUpperCase();

            })
            .join("") || "AD";


    const safeInitials =
        initials.replace(
            /[^A-Z0-9]/g,
            ""
        );


    const svg = `
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="128"
            height="128"
            viewBox="0 0 128 128"
        >
            <defs>
                <linearGradient
                    id="avatarGradient"
                    x1="0"
                    y1="0"
                    x2="1"
                    y2="1"
                >
                    <stop
                        offset="0%"
                        stop-color="#139ddf"
                    />
                    <stop
                        offset="100%"
                        stop-color="#0875b3"
                    />
                </linearGradient>
            </defs>

            <rect
                width="128"
                height="128"
                rx="30"
                fill="url(#avatarGradient)"
            />

            <text
                x="64"
                y="72"
                text-anchor="middle"
                fill="#ffffff"
                font-family="Arial, sans-serif"
                font-size="38"
                font-weight="700"
            >
                ${safeInitials}
            </text>
        </svg>
    `;


    return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;

}


/* =========================================================
   DASHBOARD METRICS
========================================================= */

function renderDashboardMetrics() {

    const metrics =
        adminState.dashboard.metrics || {};


    updateMetricElement(
        adminElements.totalUsersMetric,
        metrics.totalUsers
    );


    updateMetricElement(
        adminElements.verifiedMembersMetric,
        metrics.verifiedMembers
    );


    updateMetricElement(
        adminElements.pendingApprovalsMetric,
        metrics.pendingApprovals
    );


    updateMetricElement(
        adminElements.securityAlertsMetric,
        metrics.securityAlerts
    );


    updateMetricElement(
        adminElements.academiesMetric,
        metrics.academies
    );


    updateMetricElement(
        adminElements.activeEventsMetric,
        metrics.activeEvents
    );


    updateNavigationCounts(
        metrics
    );

}


function updateMetricElement(
    element,
    value
) {

    if (!element) {

        return;

    }


    const formattedValue =
        formatNumber(value);


    element.textContent =
        formattedValue;


    element.setAttribute(
        "aria-label",
        formattedValue
    );

}


function updateNavigationCounts(metrics) {

    const countMappings = {

        pendingApprovals:
            "[data-navigation-count='approvals']",

        securityAlerts:
            "[data-navigation-count='security']",

        activeEvents:
            "[data-navigation-count='events']"

    };


    Object.entries(
        countMappings
    ).forEach(
        ([metricKey, selector]) => {

            const element =
                queryElement(selector);


            if (!element) {

                return;

            }


            const value =
                Number(
                    metrics[metricKey]
                ) || 0;


            element.textContent =
                value > 99
                    ? "99+"
                    : String(value);


            element.hidden =
                value <= 0;

        }
    );

}


/* =========================================================
   ACTIVITY FEED
========================================================= */

function renderActivityFeed() {

    const container =
        adminElements.activityFeed;


    if (!container) {

        return;

    }


    const activityItems =
        adminState.dashboard.activity;


    if (!activityItems.length) {

        container.innerHTML =
            createEmptyStateHTML({

                icon:
                    "fa-clock-rotate-left",

                title:
                    "No recent activity",

                message:
                    "User and administrator activity will appear here."

            });

        return;

    }


    container.innerHTML =
        activityItems
            .map(
                createActivityItemHTML
            )
            .join("");

}


function createActivityItemHTML(item) {

    const iconClass =
        getActivityIcon(
            item.type
        );


    return `
        <article
            class="admin-activity-item"
            data-activity-id="${escapeHTML(item.id)}"
        >

            <div class="admin-activity-icon">

                <i
                    class="fa-solid ${iconClass}"
                    aria-hidden="true"
                ></i>

            </div>


            <div class="admin-activity-body">

                <strong>
                    ${escapeHTML(item.title)}
                </strong>

                <p>
                    ${escapeHTML(item.description)}
                </p>

                <time
                    datetime="${escapeHTML(item.createdAt)}"
                    title="${escapeHTML(formatDateTime(item.createdAt))}"
                >
                    ${escapeHTML(formatRelativeTime(item.createdAt))}
                </time>

            </div>

        </article>
    `;

}


function getActivityIcon(type) {

    const icons = {

        player:
            "fa-user-plus",

        academy:
            "fa-building-circle-check",

        coach:
            "fa-person-chalkboard",

        scout:
            "fa-binoculars",

        event:
            "fa-calendar-check",

        trial:
            "fa-futbol",

        news:
            "fa-newspaper",

        security:
            "fa-shield-halved",

        default:
            "fa-clock-rotate-left"

    };


    return icons[type] ||
        icons.default;

}


/* =========================================================
   GENERIC EMPTY STATE
========================================================= */

function createEmptyStateHTML({

    icon =
        "fa-circle-info",

    title =
        "Nothing to display",

    message =
        "New information will appear here."

} = {}) {

    return `
        <div class="admin-empty-state">

            <i
                class="fa-solid ${escapeHTML(icon)}"
                aria-hidden="true"
            ></i>

            <strong>
                ${escapeHTML(title)}
            </strong>

            <p>
                ${escapeHTML(message)}
            </p>

        </div>
    `;

}

/* =========================================================
   APPROVAL LIST
========================================================= */

function renderApprovalList() {

    const container =
        adminElements.approvalList;

    if (!container) {

        return;

    }

    const approvals =
        adminState.dashboard.approvals;

    if (!approvals.length) {

        container.innerHTML =
            createEmptyStateHTML({

                icon:
                    "fa-user-check",

                title:
                    "No pending approvals",

                message:
                    "New player, coach, scout and academy applications will appear here."

            });

        return;

    }

    container.innerHTML =
        approvals
            .map(
                createApprovalItemHTML
            )
            .join("");

    bindApprovalActions();

}


function createApprovalItemHTML(item) {

    const avatar =
        item.avatar ||
        createAvatarDataURL(
            item.name || "Applicant"
        );

    return `
        <article
            class="admin-approval-item"
            data-approval-id="${escapeHTML(item.id)}"
        >

            <img
                class="admin-approval-avatar"
                src="${escapeHTML(avatar)}"
                alt="${escapeHTML(item.name)}"
                loading="lazy"
                data-approval-avatar
            >


            <div class="admin-approval-details">

                <strong>
                    ${escapeHTML(item.name)}
                </strong>

                <span>
                    ${escapeHTML(item.category)}
                </span>

                <small>
                    ${escapeHTML(item.location)}
                    ·
                    ${escapeHTML(formatRelativeTime(item.submittedAt))}
                </small>

            </div>


            <div class="admin-approval-actions">

                <button
                    class="admin-mini-button secondary"
                    type="button"
                    data-approval-action="review"
                    data-approval-id="${escapeHTML(item.id)}"
                >
                    Review
                </button>

                <button
                    class="admin-mini-button primary"
                    type="button"
                    data-approval-action="approve"
                    data-approval-id="${escapeHTML(item.id)}"
                >
                    Approve
                </button>

            </div>

        </article>
    `;

}


/* =========================================================
   APPROVAL ACTION BINDINGS
========================================================= */

function bindApprovalActions() {

    queryElements(
        "[data-approval-action]",
        adminElements.approvalList
    ).forEach(
        (button) => {

            button.addEventListener(
                "click",
                handleApprovalAction
            );

        }
    );


    queryElements(
        "[data-approval-avatar]",
        adminElements.approvalList
    ).forEach(
        (image) => {

            image.addEventListener(
                "error",
                handleApprovalAvatarError,
                {
                    once: true
                }
            );

        }
    );

}


function handleApprovalAvatarError(event) {

    const image =
        event.currentTarget;

    const approvalItem =
        image.closest(
            "[data-approval-id]"
        );

    const approvalId =
        approvalItem?.dataset.approvalId;

    const approval =
        adminState.dashboard.approvals.find(
            (item) => {

                return String(item.id) ===
                    String(approvalId);

            }
        );

    image.src =
        createAvatarDataURL(
            approval?.name ||
            "Applicant"
        );

}


function handleApprovalAction(event) {

    const button =
        event.currentTarget;

    const approvalId =
        button.dataset.approvalId;

    const action =
        button.dataset.approvalAction;

    const approval =
        adminState.dashboard.approvals.find(
            (item) => {

                return String(item.id) ===
                    String(approvalId);

            }
        );

    if (!approval) {

        showAdminToast({

            type:
                "error",

            title:
                "Approval unavailable",

            message:
                "The selected approval request could not be found."

        });

        return;

    }

    if (action === "review") {

        openApprovalReviewPage(
            approval
        );

        return;

    }

    if (action === "approve") {

        requestApprovalConfirmation(
            approval
        );

    }

}


/* =========================================================
   APPROVAL REVIEW NAVIGATION
========================================================= */

function openApprovalReviewPage(approval) {

    const category =
        String(
            approval.category || ""
        ).toLowerCase();

    const pageMappings = {

        player:
            "admin-player-review.html",

        coach:
            "admin-coach-review.html",

        scout:
            "admin-scout-review.html",

        academy:
            "admin-academy-review.html"

    };

    const destination =
        pageMappings[category] ||
        "admin-approvals.html";

    const url =
        new URL(
            destination,
            window.location.href
        );

    url.searchParams.set(
        "id",
        approval.id
    );

    window.location.href =
        url.toString();

}


/* =========================================================
   APPROVAL CONFIRMATION
========================================================= */

function requestApprovalConfirmation(approval) {

    openConfirmationModal({

        title:
            `Approve ${approval.name}?`,

        description:
            `This will mark the ${approval.category.toLowerCase()} profile as verified and visible according to platform rules.`,

        icon:
            "fa-user-check",

        confirmLabel:
            "Approve profile",

        confirmClass:
            "admin-primary-button",

        onConfirm:
            () => approveApplication(approval.id)

    });

}


async function approveApplication(approvalId) {

    const approval =
        adminState.dashboard.approvals.find(
            (item) => {

                return String(item.id) ===
                    String(approvalId);

            }
        );

    if (!approval) {

        return;

    }

    const actionButton =
        queryElement(
            `[data-approval-action="approve"][data-approval-id="${CSS.escape(String(approvalId))}"]`
        );

    setButtonLoading(
        actionButton,
        true,
        "Approving..."
    );

    try {

        if (!ADMIN_CONFIG.useDemoData) {

            await adminApiRequest(
                `/admin/approvals/${encodeURIComponent(approvalId)}/approve`,
                {

                    method:
                        "POST"

                }
            );

        } else {

            await sleep(500);

        }

        adminState.dashboard.approvals =
            adminState.dashboard.approvals.filter(
                (item) => {

                    return String(item.id) !==
                        String(approvalId);

                }
            );

        if (
            adminState.dashboard.metrics &&
            Number(
                adminState.dashboard.metrics.pendingApprovals
            ) > 0
        ) {

            adminState.dashboard.metrics.pendingApprovals -= 1;

        }

        renderApprovalList();

        renderDashboardMetrics();

        showAdminToast({

            type:
                "success",

            title:
                "Profile approved",

            message:
                `${approval.name} has been approved successfully.`

        });

    } catch (error) {

        handleActionError(
            error,
            "Unable to approve this profile."
        );

    } finally {

        setButtonLoading(
            actionButton,
            false
        );

    }

}


/* =========================================================
   REPORT LIST
========================================================= */

function renderReportList() {

    const container =
        adminElements.reportList;

    if (!container) {

        return;

    }

    const reports =
        adminState.dashboard.reports;

    if (!reports.length) {

        container.innerHTML =
            createEmptyStateHTML({

                icon:
                    "fa-shield-circle-check",

                title:
                    "No open reports",

                message:
                    "Community moderation and security reports will appear here."

            });

        return;

    }

    container.innerHTML =
        reports
            .map(
                createReportItemHTML
            )
            .join("");

    bindReportActions();

}


function createReportItemHTML(report) {

    const priority =
        String(
            report.priority || "normal"
        ).toLowerCase();

    return `
        <article
            class="admin-report-item"
            data-report-id="${escapeHTML(report.id)}"
        >

            <div class="admin-report-icon">

                <i
                    class="fa-solid fa-flag"
                    aria-hidden="true"
                ></i>

            </div>


            <div class="admin-report-details">

                <strong>
                    ${escapeHTML(report.title)}
                </strong>

                <p>
                    ${escapeHTML(report.description)}
                </p>

                <div class="admin-report-meta">

                    <span>
                        Priority:
                        ${escapeHTML(priority)}
                    </span>

                    <span aria-hidden="true">
                        •
                    </span>

                    <time
                        datetime="${escapeHTML(report.createdAt)}"
                        title="${escapeHTML(formatDateTime(report.createdAt))}"
                    >
                        ${escapeHTML(formatRelativeTime(report.createdAt))}
                    </time>

                </div>

            </div>


            <button
                class="admin-mini-button secondary"
                type="button"
                data-report-action="review"
                data-report-id="${escapeHTML(report.id)}"
            >
                Review
            </button>

        </article>
    `;

}


/* =========================================================
   REPORT ACTIONS
========================================================= */

function bindReportActions() {

    queryElements(
        "[data-report-action]",
        adminElements.reportList
    ).forEach(
        (button) => {

            button.addEventListener(
                "click",
                handleReportAction
            );

        }
    );

}


function handleReportAction(event) {

    const button =
        event.currentTarget;

    const reportId =
        button.dataset.reportId;

    const url =
        new URL(
            "admin-report-details.html",
            window.location.href
        );

    url.searchParams.set(
        "id",
        reportId
    );

    window.location.href =
        url.toString();

}


/* =========================================================
   NOTIFICATIONS
========================================================= */

function renderNotifications() {

    const container =
        adminElements.notificationList;

    if (!container) {

        return;

    }

    const notifications =
        adminState.dashboard.notifications;

    const unreadCount =
        notifications.filter(
            (notification) => {

                return notification.unread;

            }
        ).length;

    updateNotificationBadge(
        unreadCount
    );

    if (!notifications.length) {

        container.innerHTML = `
            <div class="admin-empty-notification-state">

                <i
                    class="fa-regular fa-bell-slash"
                    aria-hidden="true"
                ></i>

                <strong>
                    No notifications
                </strong>

                <p>
                    Important platform updates and administrative alerts will appear here.
                </p>

            </div>
        `;

        return;

    }

    container.innerHTML =
        notifications
            .map(
                createNotificationItemHTML
            )
            .join("");

    bindNotificationItems();

}


function createNotificationItemHTML(notification) {

    const icon =
        getNotificationIcon(
            notification.type
        );

    const unreadClass =
        notification.unread
            ? "is-unread"
            : "";

    return `
        <button
            class="admin-notification-item ${unreadClass}"
            type="button"
            data-notification-id="${escapeHTML(notification.id)}"
        >

            <span class="admin-notification-item-icon">

                <i
                    class="fa-solid ${escapeHTML(icon)}"
                    aria-hidden="true"
                ></i>

            </span>


            <span class="admin-notification-item-content">

                <strong>
                    ${escapeHTML(notification.title)}
                </strong>

                <span>
                    ${escapeHTML(notification.message)}
                </span>

                <time
                    datetime="${escapeHTML(notification.createdAt)}"
                    title="${escapeHTML(formatDateTime(notification.createdAt))}"
                >
                    ${escapeHTML(formatRelativeTime(notification.createdAt))}
                </time>

            </span>

        </button>
    `;

}


function getNotificationIcon(type) {

    const icons = {

        approval:
            "fa-user-check",

        security:
            "fa-shield-halved",

        report:
            "fa-flag",

        event:
            "fa-calendar-check",

        user:
            "fa-user",

        system:
            "fa-server",

        default:
            "fa-bell"

    };

    return icons[type] ||
        icons.default;

}


function updateNotificationBadge(count) {

    const badge =
        adminElements.notificationBadge;

    if (!badge) {

        return;

    }

    badge.textContent =
        count > 99
            ? "99+"
            : String(count);

    badge.hidden =
        count <= 0;

    badge.setAttribute(
        "aria-label",
        `${count} unread notifications`
    );

}


/* =========================================================
   NOTIFICATION ITEM ACTIONS
========================================================= */

function bindNotificationItems() {

    queryElements(
        "[data-notification-id]",
        adminElements.notificationList
    ).forEach(
        (item) => {

            item.addEventListener(
                "click",
                handleNotificationClick
            );

        }
    );

}


async function handleNotificationClick(event) {

    const item =
        event.currentTarget;

    const notificationId =
        item.dataset.notificationId;

    const notification =
        adminState.dashboard.notifications.find(
            (entry) => {

                return String(entry.id) ===
                    String(notificationId);

            }
        );

    if (!notification) {

        return;

    }

    notification.unread =
        false;

    renderNotifications();

    const destination =
        getNotificationDestination(
            notification
        );

    if (destination) {

        window.location.href =
            destination;

    }

}


function getNotificationDestination(notification) {

    const destinations = {

        approval:
            "admin-approvals.html",

        security:
            "admin-security.html",

        report:
            "admin-reports.html",

        event:
            "admin-events.html",

        user:
            "admin-users.html",

        system:
            "admin-system-health.html"

    };

    return destinations[notification.type] ||
        null;

}

/* =========================================================
   SYSTEM HEALTH
========================================================= */

function renderSystemHealth() {

    const health =
        adminState.dashboard.health || {};

    updateHealthBadge(
        adminElements.apiHealthBadge,
        health.api
    );

    updateHealthBadge(
        adminElements.databaseHealthBadge,
        health.database
    );


    const authenticationBadge =
        getElement(
            "authenticationHealthBadge"
        );

    const storageBadge =
        getElement(
            "storageHealthBadge"
        );


    updateHealthBadge(
        authenticationBadge,
        health.authentication
    );

    updateHealthBadge(
        storageBadge,
        health.storage
    );

}


function updateHealthBadge(
    element,
    status
) {

    if (!element) {

        return;

    }


    const normalizedStatus =
        String(
            status || "unknown"
        ).toLowerCase();


    const statusMappings = {

        operational: {

            label:
                "Operational",

            className:
                "success"

        },

        healthy: {

            label:
                "Healthy",

            className:
                "success"

        },

        ready: {

            label:
                "Ready",

            className:
                "success"

        },

        online: {

            label:
                "Online",

            className:
                "success"

        },

        demo: {

            label:
                "Demo Mode",

            className:
                "warning"

        },

        pending: {

            label:
                "Pending",

            className:
                "warning"

        },

        degraded: {

            label:
                "Degraded",

            className:
                "warning"

        },

        offline: {

            label:
                "Offline",

            className:
                "danger"

        },

        error: {

            label:
                "Error",

            className:
                "danger"

        },

        unknown: {

            label:
                "Unknown",

            className:
                "warning"

        }

    };


    const statusConfig =
        statusMappings[normalizedStatus] ||
        statusMappings.unknown;


    element.classList.remove(
        "success",
        "warning",
        "danger"
    );


    element.classList.add(
        statusConfig.className
    );


    element.textContent =
        statusConfig.label;


    element.setAttribute(
        "aria-label",
        `System status: ${statusConfig.label}`
    );

}


/* =========================================================
   EVENT BINDINGS
========================================================= */

function bindAdminEvents() {

    adminElements.sidebarOpenButton
        ?.addEventListener(
            "click",
            openAdminSidebar
        );


    adminElements.sidebarCloseButton
        ?.addEventListener(
            "click",
            closeAdminSidebar
        );


    adminElements.sidebarOverlay
        ?.addEventListener(
            "click",
            closeAdminSidebar
        );


    adminElements.globalSearchForm
        ?.addEventListener(
            "submit",
            handleGlobalSearchSubmit
        );


    adminElements.globalSearchInput
        ?.addEventListener(
            "input",
            handleGlobalSearchInput
        );


    adminElements.globalSearchInput
        ?.addEventListener(
            "focus",
            handleGlobalSearchFocus
        );


    adminElements.notificationButton
        ?.addEventListener(
            "click",
            toggleNotificationPanel
        );


    adminElements.markNotificationsReadButton
        ?.addEventListener(
            "click",
            markAllNotificationsRead
        );


    adminElements.quickCreateButton
        ?.addEventListener(
            "click",
            toggleQuickCreateMenu
        );


    adminElements.profileMenuButton
        ?.addEventListener(
            "click",
            toggleSidebarProfileDropdown
        );


    adminElements.topbarProfileButton
        ?.addEventListener(
            "click",
            toggleTopbarProfileDropdown
        );


    adminElements.logoutButtons.forEach(
        (button) => {

            button.addEventListener(
                "click",
                openLogoutModal
            );

        }
    );


    adminElements.exportButton
        ?.addEventListener(
            "click",
            openExportModal
        );


    adminElements.refreshDashboardButton
        ?.addEventListener(
            "click",
            refreshAdminDashboard
        );


    adminElements.logoutModalBackdrop
        ?.addEventListener(
            "click",
            closeLogoutModal
        );


    adminElements.logoutModalCloseButton
        ?.addEventListener(
            "click",
            closeLogoutModal
        );


    adminElements.logoutCancelButton
        ?.addEventListener(
            "click",
            closeLogoutModal
        );


    adminElements.logoutConfirmButton
        ?.addEventListener(
            "click",
            confirmAdminLogout
        );


    adminElements.exportModalBackdrop
        ?.addEventListener(
            "click",
            closeExportModal
        );


    adminElements.exportModalCloseButton
        ?.addEventListener(
            "click",
            closeExportModal
        );


    adminElements.exportCancelButton
        ?.addEventListener(
            "click",
            closeExportModal
        );


    adminElements.exportForm
        ?.addEventListener(
            "submit",
            handleExportSubmit
        );


    adminElements.confirmationModalBackdrop
        ?.addEventListener(
            "click",
            closeConfirmationModal
        );


    adminElements.confirmationModalCloseButton
        ?.addEventListener(
            "click",
            closeConfirmationModal
        );


    adminElements.confirmationCancelButton
        ?.addEventListener(
            "click",
            closeConfirmationModal
        );


    adminElements.sessionExtendButton
        ?.addEventListener(
            "click",
            extendAdminSession
        );


    adminElements.sessionWarningClose
        ?.addEventListener(
            "click",
            hideSessionWarning
        );


    queryElements(
        "[data-quick-create-destination]"
    ).forEach(
        (button) => {

            button.addEventListener(
                "click",
                handleQuickCreateDestination
            );

        }
    );


    document.addEventListener(
        "click",
        handleDocumentClick
    );


    document.addEventListener(
        "keydown",
        handleGlobalKeydown
    );


    window.addEventListener(
        "resize",
        handleWindowResize
    );


    window.addEventListener(
        "beforeunload",
        cleanupAdminDashboard
    );

}


/* =========================================================
   SIDEBAR CONTROLS
========================================================= */

function openAdminSidebar() {

    if (!adminElements.sidebar) {

        return;

    }


    adminState.ui.sidebarOpen =
        true;


    adminElements.sidebar.classList.add(
        "is-open"
    );


    adminElements.sidebarOverlay
        ?.classList.add(
            "is-visible"
        );


    adminElements.sidebarOverlay
        ?.removeAttribute(
            "hidden"
        );


    document.body.classList.add(
        "admin-sidebar-active"
    );


    adminElements.sidebarOpenButton
        ?.setAttribute(
            "aria-expanded",
            "true"
        );


    adminElements.sidebarCloseButton
        ?.focus();

}


function closeAdminSidebar() {

    adminState.ui.sidebarOpen =
        false;


    adminElements.sidebar
        ?.classList.remove(
            "is-open"
        );


    adminElements.sidebarOverlay
        ?.classList.remove(
            "is-visible"
        );


    adminElements.sidebarOverlay
        ?.setAttribute(
            "hidden",
            ""
        );


    document.body.classList.remove(
        "admin-sidebar-active"
    );


    adminElements.sidebarOpenButton
        ?.setAttribute(
            "aria-expanded",
            "false"
        );

}


/* =========================================================
   DROPDOWN MANAGEMENT
========================================================= */

function toggleNotificationPanel(event) {

    event.stopPropagation();

    toggleDropdown(
        adminElements.notificationPanel,
        adminElements.notificationButton,
        "notifications"
    );

}


function toggleQuickCreateMenu(event) {

    event.stopPropagation();

    toggleDropdown(
        adminElements.quickCreateMenu,
        adminElements.quickCreateButton,
        "quick-create"
    );

}


function toggleSidebarProfileDropdown(event) {

    event.stopPropagation();

    toggleDropdown(
        adminElements.profileDropdown,
        adminElements.profileMenuButton,
        "sidebar-profile"
    );

}


function toggleTopbarProfileDropdown(event) {

    event.stopPropagation();

    toggleDropdown(
        adminElements.topbarProfileDropdown,
        adminElements.topbarProfileButton,
        "topbar-profile"
    );

}


function toggleDropdown(
    dropdown,
    trigger,
    dropdownName
) {

    if (!dropdown || !trigger) {

        return;

    }


    const isOpen =
        !dropdown.hasAttribute(
            "hidden"
        );


    closeAllDropdowns();


    if (isOpen) {

        return;

    }


    dropdown.removeAttribute(
        "hidden"
    );


    trigger.setAttribute(
        "aria-expanded",
        "true"
    );


    adminState.ui.activeDropdown =
        dropdownName;

}


function closeAllDropdowns() {

    const dropdownMappings = [

        {

            dropdown:
                adminElements.notificationPanel,

            trigger:
                adminElements.notificationButton

        },

        {

            dropdown:
                adminElements.quickCreateMenu,

            trigger:
                adminElements.quickCreateButton

        },

        {

            dropdown:
                adminElements.profileDropdown,

            trigger:
                adminElements.profileMenuButton

        },

        {

            dropdown:
                adminElements.topbarProfileDropdown,

            trigger:
                adminElements.topbarProfileButton

        }

    ];


    dropdownMappings.forEach(
        ({ dropdown, trigger }) => {

            dropdown
                ?.setAttribute(
                    "hidden",
                    ""
                );


            trigger
                ?.setAttribute(
                    "aria-expanded",
                    "false"
                );

        }
    );


    adminState.ui.activeDropdown =
        null;

}


/* =========================================================
   GLOBAL SEARCH
========================================================= */

function handleGlobalSearchInput(event) {

    const query =
        event.currentTarget.value
            .trim()
            .toLowerCase();


    if (query.length < 2) {

        hideGlobalSearchResults();

        return;

    }


    const results =
        searchAdminDestinations(
            query
        );


    renderGlobalSearchResults(
        results
    );

}


function handleGlobalSearchFocus() {

    const query =
        adminElements.globalSearchInput
            ?.value
            .trim();


    if (
        query &&
        query.length >= 2
    ) {

        renderGlobalSearchResults(
            searchAdminDestinations(
                query.toLowerCase()
            )
        );

    }

}


function handleGlobalSearchSubmit(event) {

    event.preventDefault();


    const query =
        adminElements.globalSearchInput
            ?.value
            .trim();


    if (!query) {

        showAdminToast({

            type:
                "warning",

            title:
                "Enter a search term",

            message:
                "Search for users, academies, events, reports or admin pages."

        });

        return;

    }


    const results =
        searchAdminDestinations(
            query.toLowerCase()
        );


    if (results.length === 1) {

        window.location.href =
            results[0].url;

        return;

    }


    renderGlobalSearchResults(
        results
    );

}


function searchAdminDestinations(query) {

    const destinations = [

        {

            title:
                "Dashboard",

            description:
                "Admin overview and platform metrics",

            keywords:
                "dashboard overview metrics home",

            url:
                "admin-dashboard.html",

            icon:
                "fa-chart-line"

        },

        {

            title:
                "Users",

            description:
                "Manage registered platform users",

            keywords:
                "users players coaches scouts supporters accounts",

            url:
                "admin-users.html",

            icon:
                "fa-users"

        },

        {

            title:
                "Approvals",

            description:
                "Review pending profiles and registrations",

            keywords:
                "approvals verify verification pending profile",

            url:
                "admin-approvals.html",

            icon:
                "fa-user-check"

        },

        {

            title:
                "Academies",

            description:
                "Manage football academy profiles",

            keywords:
                "academies clubs training centres schools",

            url:
                "admin-academies.html",

            icon:
                "fa-building"

        },

        {

            title:
                "Events",

            description:
                "Create and manage platform events",

            keywords:
                "events matches programmes calendar",

            url:
                "admin-events.html",

            icon:
                "fa-calendar-days"

        },

        {

            title:
                "Trials",

            description:
                "Manage football trials and registrations",

            keywords:
                "trials selections scouting registrations",

            url:
                "admin-trials.html",

            icon:
                "fa-futbol"

        },

        {

            title:
                "News",

            description:
                "Publish and manage news articles",

            keywords:
                "news articles stories publish media",

            url:
                "admin-news.html",

            icon:
                "fa-newspaper"

        },

        {

            title:
                "Reports",

            description:
                "Review moderation and community reports",

            keywords:
                "reports moderation flags complaints",

            url:
                "admin-reports.html",

            icon:
                "fa-flag"

        },

        {

            title:
                "Security",

            description:
                "Review security alerts and audit activity",

            keywords:
                "security audit logs alerts sessions",

            url:
                "admin-security.html",

            icon:
                "fa-shield-halved"

        },

        {

            title:
                "Settings",

            description:
                "Manage administrative platform settings",

            keywords:
                "settings configuration preferences system",

            url:
                "admin-settings.html",

            icon:
                "fa-gear"

        }

    ];


    return destinations.filter(
        (destination) => {

            const searchableText = `
                ${destination.title}
                ${destination.description}
                ${destination.keywords}
            `.toLowerCase();


            return searchableText.includes(
                query
            );

        }
    );

}


function renderGlobalSearchResults(results) {

    const container =
        adminElements.globalSearchResults;


    if (!container) {

        return;

    }


    if (!results.length) {

        container.innerHTML = `
            <div class="admin-search-empty">

                <i
                    class="fa-solid fa-magnifying-glass"
                    aria-hidden="true"
                ></i>

                <strong>
                    No results found
                </strong>

                <span>
                    Try searching with another keyword.
                </span>

            </div>
        `;

        container.removeAttribute(
            "hidden"
        );

        return;

    }


    container.innerHTML =
        results
            .map(
                (result) => {

                    return `
                        <a
                            class="admin-search-result-item"
                            href="${escapeHTML(result.url)}"
                        >

                            <i
                                class="fa-solid ${escapeHTML(result.icon)}"
                                aria-hidden="true"
                            ></i>

                            <span>

                                <strong>
                                    ${escapeHTML(result.title)}
                                </strong>

                                <small>
                                    ${escapeHTML(result.description)}
                                </small>

                            </span>

                        </a>
                    `;

                }
            )
            .join("");


    container.removeAttribute(
        "hidden"
    );

}


function hideGlobalSearchResults() {

    adminElements.globalSearchResults
        ?.setAttribute(
            "hidden",
            ""
        );

}

/* =========================================================
   NOTIFICATION ACTIONS
========================================================= */

async function markAllNotificationsRead() {

    const unreadNotifications =
        adminState.dashboard.notifications.filter(
            (notification) => {

                return notification.unread;

            }
        );

    if (!unreadNotifications.length) {

        showAdminToast({

            type:
                "info",

            title:
                "No unread notifications",

            message:
                "All notifications are already marked as read."

        });

        return;

    }


    setButtonLoading(
        adminElements.markNotificationsReadButton,
        true,
        "Updating..."
    );


    try {

        if (!ADMIN_CONFIG.useDemoData) {

            await adminApiRequest(
                ADMIN_CONFIG.endpoints.markNotificationsRead,
                {

                    method:
                        "POST"

                }
            );

        } else {

            await sleep(400);

        }


        adminState.dashboard.notifications =
            adminState.dashboard.notifications.map(
                (notification) => {

                    return {

                        ...notification,

                        unread:
                            false

                    };

                }
            );


        renderNotifications();


        showAdminToast({

            type:
                "success",

            title:
                "Notifications updated",

            message:
                "All notifications have been marked as read."

        });

    } catch (error) {

        handleActionError(
            error,
            "Unable to update notifications."
        );

    } finally {

        setButtonLoading(
            adminElements.markNotificationsReadButton,
            false
        );

    }

}


/* =========================================================
   QUICK CREATE NAVIGATION
========================================================= */

function handleQuickCreateDestination(event) {

    const button =
        event.currentTarget;

    const destination =
        button.dataset.quickCreateDestination;

    if (!destination) {

        return;

    }

    closeAllDropdowns();

    window.location.href =
        destination;

}


/* =========================================================
   MODAL CORE
========================================================= */

function openModal(
    modal,
    modalName
) {

    if (!modal) {

        return;

    }

    closeAllDropdowns();

    adminState.ui.lastFocusedElement =
        document.activeElement;

    adminState.ui.activeModal =
        modalName;

    modal.removeAttribute(
        "hidden"
    );

    modal.setAttribute(
        "aria-hidden",
        "false"
    );

    document.body.classList.add(
        "admin-modal-open"
    );

    const firstFocusable =
        getFocusableElements(
            modal
        )[0];

    window.setTimeout(
        () => {

            firstFocusable?.focus();

        },
        30
    );

}


function closeModal(modal) {

    if (!modal) {

        return;

    }

    modal.setAttribute(
        "hidden",
        ""
    );

    modal.setAttribute(
        "aria-hidden",
        "true"
    );

    adminState.ui.activeModal =
        null;

    document.body.classList.remove(
        "admin-modal-open"
    );

    const lastFocusedElement =
        adminState.ui.lastFocusedElement;

    if (
        lastFocusedElement instanceof
        HTMLElement
    ) {

        lastFocusedElement.focus();

    }

    adminState.ui.lastFocusedElement =
        null;

}


/* =========================================================
   LOGOUT MODAL
========================================================= */

function openLogoutModal(event) {

    event?.preventDefault();

    openModal(
        adminElements.logoutModal,
        "logout"
    );

}


function closeLogoutModal() {

    closeModal(
        adminElements.logoutModal
    );

}


async function confirmAdminLogout() {

    const button =
        adminElements.logoutConfirmButton;

    setButtonLoading(
        button,
        true,
        "Signing out..."
    );

    try {

        if (!ADMIN_CONFIG.useDemoData) {

            await adminApiRequest(
                ADMIN_CONFIG.endpoints.logout,
                {

                    method:
                        "POST"

                }
            );

        } else {

            await sleep(600);

        }

        adminState.currentUser =
            null;

        adminState.session.authenticated =
            false;

        adminState.session.expiresAt =
            null;

        window.location.replace(
            "admin-login.html"
        );

    } catch (error) {

        handleActionError(
            error,
            "Unable to sign out safely."
        );

        setButtonLoading(
            button,
            false
        );

    }

}


/* =========================================================
   EXPORT MODAL
========================================================= */

function openExportModal(event) {

    event?.preventDefault();

    openModal(
        adminElements.exportModal,
        "export"
    );

}


function closeExportModal() {

    closeModal(
        adminElements.exportModal
    );

}


async function handleExportSubmit(event) {

    event.preventDefault();

    const form =
        event.currentTarget;

    const submitButton =
        queryElement(
            '[type="submit"]',
            form
        );

    const formData =
        new FormData(form);

    const reportType =
        formData.get(
            "reportType"
        ) || "summary";


    setButtonLoading(
        submitButton,
        true,
        "Preparing..."
    );


    try {

        if (ADMIN_CONFIG.useDemoData) {

            await sleep(650);

            downloadDemoReport(
                reportType
            );

        } else {

            await exportBackendReport(
                reportType
            );

        }


        closeExportModal();


        showAdminToast({

            type:
                "success",

            title:
                "Report exported",

            message:
                "The dashboard report has been prepared successfully."

        });

    } catch (error) {

        handleActionError(
            error,
            "Unable to export the selected report."
        );

    } finally {

        setButtonLoading(
            submitButton,
            false
        );

    }

}


/* =========================================================
   BACKEND REPORT EXPORT
========================================================= */

async function exportBackendReport(
    reportType
) {

    const controller =
        new AbortController();

    const timeoutId =
        window.setTimeout(
            () => {

                controller.abort();

            },
            ADMIN_CONFIG.requestTimeout
        );


    try {

        const response =
            await fetch(
                `${ADMIN_CONFIG.apiBaseUrl}${ADMIN_CONFIG.endpoints.exportReport}`,
                {

                    method:
                        "POST",

                    credentials:
                        "include",

                    headers: {

                        Accept:
                            "text/csv, application/pdf, application/json",

                        "Content-Type":
                            "application/json"

                    },

                    body:
                        JSON.stringify({

                            reportType

                        }),

                    signal:
                        controller.signal

                }
            );


        if (!response.ok) {

            let message =
                "Report export failed.";

            try {

                const errorData =
                    await response.json();

                message =
                    errorData.message ||
                    errorData.detail ||
                    message;

            } catch {

                // Keep fallback message.

            }

            throw new AdminAPIError(
                message,
                response.status
            );

        }


        const blob =
            await response.blob();

        const disposition =
            response.headers.get(
                "content-disposition"
            );

        const filename =
            extractDownloadFilename(
                disposition
            ) ||
            `admin-${reportType}-report`;

        triggerBlobDownload(
            blob,
            filename
        );

    } catch (error) {

        if (
            error.name ===
            "AbortError"
        ) {

            throw new AdminAPIError(
                "The export request timed out.",
                408
            );

        }

        throw error;

    } finally {

        window.clearTimeout(
            timeoutId
        );

    }

}


/* =========================================================
   DEMO REPORT DOWNLOAD
========================================================= */

function downloadDemoReport(
    reportType
) {

    const metrics =
        adminState.dashboard.metrics || {};

    const rows = [

        [
            "Bharat Football Fans",
            "Mission FIFA 2034"
        ],

        [
            "Report Type",
            String(reportType)
        ],

        [
            "Generated At",
            new Date().toISOString()
        ],

        [
            "Total Users",
            metrics.totalUsers || 0
        ],

        [
            "Verified Members",
            metrics.verifiedMembers || 0
        ],

        [
            "Pending Approvals",
            metrics.pendingApprovals || 0
        ],

        [
            "Security Alerts",
            metrics.securityAlerts || 0
        ],

        [
            "Registered Academies",
            metrics.academies || 0
        ],

        [
            "Active Events",
            metrics.activeEvents || 0
        ]

    ];


    const csv =
        rows
            .map(
                (row) => {

                    return row
                        .map(
                            escapeCSVValue
                        )
                        .join(",");

                }
            )
            .join("\n");


    const blob =
        new Blob(
            [csv],
            {

                type:
                    "text/csv;charset=utf-8"

            }
        );


    const date =
        new Date()
            .toISOString()
            .slice(0, 10);


    triggerBlobDownload(
        blob,
        `admin-${reportType}-report-${date}.csv`
    );

}


function escapeCSVValue(value) {

    const text =
        String(
            value ?? ""
        );

    return `"${text.replace(/"/g, '""')}"`;

}


function extractDownloadFilename(
    contentDisposition
) {

    if (!contentDisposition) {

        return null;

    }


    const utfMatch =
        contentDisposition.match(
            /filename\*=UTF-8''([^;]+)/i
        );


    if (utfMatch?.[1]) {

        return decodeURIComponent(
            utfMatch[1]
        );

    }


    const normalMatch =
        contentDisposition.match(
            /filename="?([^"]+)"?/i
        );


    return normalMatch?.[1] || null;

}


function triggerBlobDownload(
    blob,
    filename
) {

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

    link.hidden =
        true;

    document.body.appendChild(
        link
    );

    link.click();

    link.remove();

    window.setTimeout(
        () => {

            URL.revokeObjectURL(
                url
            );

        },
        1000
    );

}


/* =========================================================
   CONFIRMATION MODAL
========================================================= */

let pendingConfirmationAction =
    null;


function openConfirmationModal({

    title,
    description,
    icon =
        "fa-circle-question",

    confirmLabel =
        "Confirm",

    confirmClass =
        "admin-primary-button",

    onConfirm =
        null

} = {}) {

    if (
        !adminElements.confirmationModal
    ) {

        return;

    }


    if (
        adminElements.confirmationModalTitle
    ) {

        adminElements.confirmationModalTitle.textContent =
            title ||
            "Confirm action";

    }


    if (
        adminElements.confirmationModalDescription
    ) {

        adminElements.confirmationModalDescription.textContent =
            description ||
            "Are you sure you want to continue?";

    }


    if (
        adminElements.confirmationModalIcon
    ) {

        adminElements.confirmationModalIcon.className =
            `fa-solid ${icon}`;

    }


    const confirmButton =
        adminElements.confirmationConfirmButton;


    if (confirmButton) {

        confirmButton.textContent =
            confirmLabel;

        confirmButton.className =
            confirmClass;

        confirmButton.type =
            "button";

    }


    pendingConfirmationAction =
        typeof onConfirm === "function"
            ? onConfirm
            : null;


    confirmButton
        ?.removeEventListener(
            "click",
            executeConfirmationAction
        );


    confirmButton
        ?.addEventListener(
            "click",
            executeConfirmationAction
        );


    openModal(
        adminElements.confirmationModal,
        "confirmation"
    );

}


function closeConfirmationModal() {

    pendingConfirmationAction =
        null;

    closeModal(
        adminElements.confirmationModal
    );

}


async function executeConfirmationAction() {

    const action =
        pendingConfirmationAction;

    pendingConfirmationAction =
        null;

    closeModal(
        adminElements.confirmationModal
    );


    if (
        typeof action !==
        "function"
    ) {

        return;

    }


    try {

        await action();

    } catch (error) {

        handleActionError(
            error,
            "The requested action could not be completed."
        );

    }

}

/* =========================================================
   SESSION MONITORING
========================================================= */

let adminSessionIntervalId =
    null;


function startSessionMonitoring() {

    stopSessionMonitoring();


    if (
        !adminState.session.authenticated ||
        !adminState.session.expiresAt
    ) {

        return;

    }


    checkAdminSession();


    adminSessionIntervalId =
        window.setInterval(
            checkAdminSession,
            ADMIN_CONFIG.sessionCheckInterval
        );

}


function stopSessionMonitoring() {

    if (
        adminSessionIntervalId !==
        null
    ) {

        window.clearInterval(
            adminSessionIntervalId
        );

        adminSessionIntervalId =
            null;

    }

}


function checkAdminSession() {

    const expiresAt =
        new Date(
            adminState.session.expiresAt
        ).getTime();


    if (
        !Number.isFinite(expiresAt)
    ) {

        return;

    }


    const remainingMilliseconds =
        expiresAt - Date.now();


    const remainingSeconds =
        Math.floor(
            remainingMilliseconds / 1000
        );


    if (remainingSeconds <= 0) {

        stopSessionMonitoring();

        handleExpiredSession();

        return;

    }


    if (
        remainingSeconds <=
        ADMIN_CONFIG.sessionWarningSeconds
    ) {

        showSessionWarning(
            remainingSeconds
        );

        return;

    }


    hideSessionWarning();

}


/* =========================================================
   SESSION WARNING
========================================================= */

function showSessionWarning(
    remainingSeconds
) {

    const banner =
        adminElements.sessionWarning;


    if (!banner) {

        return;

    }


    const minutes =
        Math.max(
            1,
            Math.ceil(
                remainingSeconds / 60
            )
        );


    if (
        adminElements.sessionWarningText
    ) {

        adminElements.sessionWarningText.textContent =
            `Your secure admin session will expire in approximately ${minutes} minute${minutes === 1 ? "" : "s"}.`;

    }


    banner.removeAttribute(
        "hidden"
    );


    banner.setAttribute(
        "aria-hidden",
        "false"
    );


    adminState.session.warningDisplayed =
        true;

}


function hideSessionWarning() {

    adminElements.sessionWarning
        ?.setAttribute(
            "hidden",
            ""
        );


    adminElements.sessionWarning
        ?.setAttribute(
            "aria-hidden",
            "true"
        );


    adminState.session.warningDisplayed =
        false;

}


/* =========================================================
   EXTEND SESSION
========================================================= */

async function extendAdminSession() {

    const button =
        adminElements.sessionExtendButton;


    setButtonLoading(
        button,
        true,
        "Extending..."
    );


    try {

        let sessionData;


        if (ADMIN_CONFIG.useDemoData) {

            await sleep(500);


            sessionData = {

                authenticated:
                    true,

                expiresAt:
                    new Date(
                        Date.now() +
                        45 * 60 * 1000
                    ).toISOString()

            };

        } else {

            sessionData =
                await adminApiRequest(
                    ADMIN_CONFIG.endpoints.refreshSession,
                    {

                        method:
                            "POST"

                    }
                );

        }


        adminState.session.authenticated =
            Boolean(
                sessionData.authenticated ??
                true
            );


        adminState.session.expiresAt =
            sessionData.expiresAt;


        adminState.session.warningDisplayed =
            false;


        hideSessionWarning();

        startSessionMonitoring();


        showAdminToast({

            type:
                "success",

            title:
                "Session extended",

            message:
                "Your secure administrator session has been renewed."

        });

    } catch (error) {

        handleActionError(
            error,
            "Unable to extend your session."
        );

    } finally {

        setButtonLoading(
            button,
            false
        );

    }

}


/* =========================================================
   EXPIRED SESSION
========================================================= */

function handleExpiredSession() {

    adminState.session.authenticated =
        false;


    adminState.session.expiresAt =
        null;


    hideSessionWarning();


    showAdminToast({

        type:
            "warning",

        title:
            "Session expired",

        message:
            "Please sign in again to continue managing the platform.",

        duration:
            2200

    });


    window.setTimeout(
        redirectToAdminLogin,
        2200
    );

}


function redirectToAdminLogin() {

    const returnUrl =
        encodeURIComponent(
            `${window.location.pathname}${window.location.search}`
        );


    window.location.replace(
        `admin-login.html?returnUrl=${returnUrl}`
    );

}


/* =========================================================
   DASHBOARD REFRESH
========================================================= */

async function refreshAdminDashboard() {

    const button =
        adminElements.refreshDashboardButton;


    setButtonLoading(
        button,
        true,
        "Refreshing..."
    );


    closeAllDropdowns();


    try {

        await loadAdminDashboard();


        showAdminToast({

            type:
                "success",

            title:
                "Dashboard refreshed",

            message:
                "The latest platform information is now displayed."

        });

    } catch (error) {

        handleActionError(
            error,
            "Unable to refresh the dashboard."
        );

    } finally {

        setButtonLoading(
            button,
            false
        );

    }

}


/* =========================================================
   LOADING STATES
========================================================= */

function setDashboardLoadingState(
    isLoading
) {

    const dashboard =
        queryElement(
            "[data-admin-dashboard]"
        );


    if (!dashboard) {

        return;

    }


    dashboard.classList.toggle(
        "is-loading",
        Boolean(isLoading)
    );


    dashboard.setAttribute(
        "aria-busy",
        String(
            Boolean(isLoading)
        )
    );

}


function hideLoadingScreen() {

    const loadingScreen =
        adminElements.loadingScreen;


    if (!loadingScreen) {

        return;

    }


    loadingScreen.classList.add(
        "is-hidden"
    );


    loadingScreen.setAttribute(
        "aria-hidden",
        "true"
    );


    window.setTimeout(
        () => {

            loadingScreen.setAttribute(
                "hidden",
                ""
            );

        },
        400
    );

}


/* =========================================================
   BUTTON LOADING STATE
========================================================= */

function setButtonLoading(
    button,
    isLoading,
    loadingText =
        "Please wait..."
) {

    if (!button) {

        return;

    }


    if (isLoading) {

        if (
            !button.dataset.originalContent
        ) {

            button.dataset.originalContent =
                button.innerHTML;

        }


        button.disabled =
            true;


        button.setAttribute(
            "aria-busy",
            "true"
        );


        button.innerHTML = `
            <i
                class="fa-solid fa-circle-notch fa-spin"
                aria-hidden="true"
            ></i>

            <span>
                ${escapeHTML(loadingText)}
            </span>
        `;


        return;

    }


    button.disabled =
        false;


    button.removeAttribute(
        "aria-busy"
    );


    if (
        button.dataset.originalContent
    ) {

        button.innerHTML =
            button.dataset.originalContent;


        delete button.dataset.originalContent;

    }

}


/* =========================================================
   TOAST NOTIFICATIONS
========================================================= */

function showAdminToast({

    type =
        "info",

    title =
        "Notification",

    message =
        "",

    duration =
        ADMIN_CONFIG.toastDuration

} = {}) {

    const region =
        adminElements.toastRegion;


    if (!region) {

        return;

    }


    const toast =
        document.createElement(
            "article"
        );


    const icon =
        getToastIcon(
            type
        );


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
                class="fa-solid ${escapeHTML(icon)}"
                aria-hidden="true"
            ></i>

        </div>


        <div class="admin-toast-content">

            <strong>
                ${escapeHTML(title)}
            </strong>

            <p>
                ${escapeHTML(message)}
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


    const closeButton =
        queryElement(
            ".admin-toast-close",
            toast
        );


    closeButton
        ?.addEventListener(
            "click",
            () => {

                removeAdminToast(
                    toast
                );

            }
        );


    region.appendChild(
        toast
    );


    window.setTimeout(
        () => {

            removeAdminToast(
                toast
            );

        },
        Math.max(
            1200,
            Number(duration) ||
            ADMIN_CONFIG.toastDuration
        )
    );

}


function getToastIcon(type) {

    const icons = {

        success:
            "fa-circle-check",

        error:
            "fa-circle-exclamation",

        warning:
            "fa-triangle-exclamation",

        info:
            "fa-circle-info"

    };


    return icons[type] ||
        icons.info;

}


function removeAdminToast(
    toast
) {

    if (
        !toast ||
        !toast.isConnected
    ) {

        return;

    }


    toast.classList.add(
        "is-removing"
    );


    window.setTimeout(
        () => {

            toast.remove();

        },
        250
    );

}


/* =========================================================
   ERROR HANDLING
========================================================= */

function handleInitializationError(
    error
) {

    console.error(
        "Admin dashboard initialization failed:",
        error
    );


    showAdminToast({

        type:
            "error",

        title:
            "Dashboard unavailable",

        message:
            error?.message ||
            "The administrator dashboard could not be initialized."

    });

}


function handleDashboardLoadError(
    error
) {

    console.error(
        "Admin dashboard loading failed:",
        error
    );


    if (
        error instanceof AdminAPIError &&
        error.status === 401
    ) {

        redirectToAdminLogin();

        return;

    }


    renderDashboardFailureState();


    showAdminToast({

        type:
            "error",

        title:
            "Unable to load dashboard",

        message:
            error?.message ||
            "Please check your connection and try again."

    });

}


function handleActionError(
    error,
    fallbackMessage
) {

    console.error(
        "Admin action failed:",
        error
    );


    if (
        error instanceof AdminAPIError &&
        error.status === 401
    ) {

        handleExpiredSession();

        return;

    }


    if (
        error instanceof AdminAPIError &&
        error.status === 403
    ) {

        showAdminToast({

            type:
                "error",

            title:
                "Permission denied",

            message:
                "Your administrator account does not have permission to perform this action."

        });

        return;

    }


    showAdminToast({

        type:
            "error",

        title:
            "Action failed",

        message:
            error?.message ||
            fallbackMessage ||
            "The requested action could not be completed."

    });

}


/* =========================================================
   FAILURE STATE
========================================================= */

function renderDashboardFailureState() {

    const containers = [

        adminElements.activityFeed,

        adminElements.approvalList,

        adminElements.reportList

    ];


    containers.forEach(
        (container) => {

            if (!container) {

                return;

            }


            container.innerHTML =
                createEmptyStateHTML({

                    icon:
                        "fa-cloud-arrow-down",

                    title:
                        "Unable to load information",

                    message:
                        "Refresh the dashboard to try loading this section again."

                });

        }
    );

}


/* =========================================================
   FOOTER YEAR
========================================================= */

function setFooterYear() {

    if (
        adminElements.footerYear
    ) {

        adminElements.footerYear.textContent =
            String(
                new Date().getFullYear()
            );

    }

}
/* =========================================================
   KEYBOARD SHORTCUTS
========================================================= */

function setupKeyboardShortcuts() {

    document.addEventListener(
        "keydown",
        handleAdminKeyboardShortcuts
    );

}


function handleAdminKeyboardShortcuts(event) {

    const activeElement =
        document.activeElement;

    const isTyping =
        activeElement instanceof HTMLInputElement ||
        activeElement instanceof HTMLTextAreaElement ||
        activeElement instanceof HTMLSelectElement ||
        activeElement?.isContentEditable;


    if (
        (event.ctrlKey || event.metaKey) &&
        event.key.toLowerCase() === "k"
    ) {

        event.preventDefault();

        adminElements.globalSearchInput
            ?.focus();

        adminElements.globalSearchInput
            ?.select();

        return;

    }


    if (
        !isTyping &&
        event.key === "/"
    ) {

        event.preventDefault();

        adminElements.globalSearchInput
            ?.focus();

        return;

    }


    if (
        !isTyping &&
        event.key.toLowerCase() === "r" &&
        !event.ctrlKey &&
        !event.metaKey &&
        !event.altKey
    ) {

        event.preventDefault();

        refreshAdminDashboard();

    }

}


/* =========================================================
   GLOBAL KEYDOWN HANDLER
========================================================= */

function handleGlobalKeydown(event) {

    if (event.key === "Escape") {

        if (adminState.ui.activeModal) {

            closeActiveModal();

            return;

        }


        if (adminState.ui.activeDropdown) {

            closeAllDropdowns();

            return;

        }


        if (adminState.ui.sidebarOpen) {

            closeAdminSidebar();

            adminElements.sidebarOpenButton
                ?.focus();

            return;

        }


        hideGlobalSearchResults();

    }


    if (
        event.key === "Tab" &&
        adminState.ui.activeModal
    ) {

        trapModalFocus(
            event
        );

    }

}


/* =========================================================
   CLOSE ACTIVE MODAL
========================================================= */

function closeActiveModal() {

    switch (
        adminState.ui.activeModal
    ) {

        case "logout":

            closeLogoutModal();

            break;


        case "export":

            closeExportModal();

            break;


        case "confirmation":

            closeConfirmationModal();

            break;


        default:

            adminState.ui.activeModal =
                null;

            document.body.classList.remove(
                "admin-modal-open"
            );

    }

}


/* =========================================================
   MODAL FOCUS TRAP
========================================================= */

function trapModalFocus(event) {

    const modal =
        getActiveModalElement();


    if (!modal) {

        return;

    }


    const focusableElements =
        getFocusableElements(
            modal
        );


    if (!focusableElements.length) {

        event.preventDefault();

        modal.focus();

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

        return;

    }


    if (
        !event.shiftKey &&
        document.activeElement === lastElement
    ) {

        event.preventDefault();

        firstElement.focus();

    }

}


function getActiveModalElement() {

    const modalMappings = {

        logout:
            adminElements.logoutModal,

        export:
            adminElements.exportModal,

        confirmation:
            adminElements.confirmationModal

    };


    return modalMappings[
        adminState.ui.activeModal
    ] || null;

}


function getFocusableElements(
    container
) {

    if (!container) {

        return [];

    }


    const selector = [
        "a[href]",
        "button:not([disabled])",
        "input:not([disabled])",
        "select:not([disabled])",
        "textarea:not([disabled])",
        "[tabindex]:not([tabindex='-1'])"
    ].join(",");


    return queryElements(
        selector,
        container
    ).filter(
        (element) => {

            return (
                !element.hasAttribute("hidden") &&
                element.getAttribute("aria-hidden") !== "true" &&
                element.offsetParent !== null
            );

        }
    );

}


/* =========================================================
   DOCUMENT CLICK HANDLING
========================================================= */

function handleDocumentClick(event) {

    const target =
        event.target;


    if (
        !(target instanceof Node)
    ) {

        return;

    }


    const clickedInsideDropdown =
        adminElements.notificationPanel
            ?.contains(target) ||

        adminElements.quickCreateMenu
            ?.contains(target) ||

        adminElements.profileDropdown
            ?.contains(target) ||

        adminElements.topbarProfileDropdown
            ?.contains(target);


    const clickedDropdownTrigger =
        adminElements.notificationButton
            ?.contains(target) ||

        adminElements.quickCreateButton
            ?.contains(target) ||

        adminElements.profileMenuButton
            ?.contains(target) ||

        adminElements.topbarProfileButton
            ?.contains(target);


    if (
        !clickedInsideDropdown &&
        !clickedDropdownTrigger
    ) {

        closeAllDropdowns();

    }


    const clickedInsideSearch =
        adminElements.globalSearchForm
            ?.contains(target) ||

        adminElements.globalSearchResults
            ?.contains(target);


    if (!clickedInsideSearch) {

        hideGlobalSearchResults();

    }

}


/* =========================================================
   RESPONSIVE SETUP
========================================================= */

function setupResponsiveState() {

    applyResponsiveState();

}


function handleWindowResize() {

    applyResponsiveState();

}


function applyResponsiveState() {

    const mobileSidebarMode =
        window.matchMedia(
            "(max-width: 1080px)"
        ).matches;


    if (!mobileSidebarMode) {

        adminState.ui.sidebarOpen =
            false;


        adminElements.sidebar
            ?.classList.remove(
                "is-open"
            );


        adminElements.sidebarOverlay
            ?.classList.remove(
                "is-visible"
            );


        adminElements.sidebarOverlay
            ?.setAttribute(
                "hidden",
                ""
            );


        document.body.classList.remove(
            "admin-sidebar-active"
        );


        adminElements.sidebarOpenButton
            ?.setAttribute(
                "aria-expanded",
                "false"
            );

    }


    if (
        window.matchMedia(
            "(min-width: 681px)"
        ).matches
    ) {

        document.body.classList.remove(
            "admin-mobile-search-active"
        );

    }

}


/* =========================================================
   NAVIGATION HIGHLIGHT
========================================================= */

function setupNavigationHighlight() {

    const currentPage =
        window.location.pathname
            .split("/")
            .pop() ||
        "admin-dashboard.html";


    const navigationLinks =
        queryElements(
            ".admin-navigation-link"
        );


    navigationLinks.forEach(
        (link) => {

            const href =
                link.getAttribute(
                    "href"
                );


            if (!href) {

                return;

            }


            const linkedPage =
                href
                    .split("?")[0]
                    .split("#")[0]
                    .split("/")
                    .pop();


            const isCurrentPage =
                linkedPage === currentPage;


            link.classList.toggle(
                "active",
                isCurrentPage
            );


            if (isCurrentPage) {

                link.setAttribute(
                    "aria-current",
                    "page"
                );

            } else {

                link.removeAttribute(
                    "aria-current"
                );

            }

        }
    );

}


/* =========================================================
   PAGE VISIBILITY HANDLING
========================================================= */

function handleVisibilityChange() {

    if (
        document.visibilityState !==
        "visible"
    ) {

        return;

    }


    checkAdminSession();


    if (
        !ADMIN_CONFIG.useDemoData &&
        adminState.session.authenticated
    ) {

        refreshHealthStatusSilently();

    }

}


async function refreshHealthStatusSilently() {

    try {

        const healthData =
            await adminApiRequest(
                ADMIN_CONFIG.endpoints.systemHealth
            );


        adminState.dashboard.health =
            healthData || {};


        renderSystemHealth();

    } catch (error) {

        console.warn(
            "Silent health refresh failed:",
            error
        );

    }

}


document.addEventListener(
    "visibilitychange",
    handleVisibilityChange
);


/* =========================================================
   ONLINE AND OFFLINE STATUS
========================================================= */

function handleConnectionOnline() {

    showAdminToast({

        type:
            "success",

        title:
            "Connection restored",

        message:
            "The administrator dashboard is back online."

    });


    refreshAdminDashboard();

}


function handleConnectionOffline() {

    showAdminToast({

        type:
            "warning",

        title:
            "You are offline",

        message:
            "Some administrator actions may be unavailable until your connection returns.",

        duration:
            7000

    });


    updateHealthBadge(
        adminElements.apiHealthBadge,
        "offline"
    );

}


window.addEventListener(
    "online",
    handleConnectionOnline
);


window.addEventListener(
    "offline",
    handleConnectionOffline
);


/* =========================================================
   SAFE CSS ESCAPE FALLBACK
========================================================= */

function safeCSSEscape(value) {

    const stringValue =
        String(value ?? "");


    if (
        window.CSS &&
        typeof window.CSS.escape ===
        "function"
    ) {

        return window.CSS.escape(
            stringValue
        );

    }


    return stringValue.replace(
        /[^a-zA-Z0-9_-]/g,
        (character) => {

            return `\\${character}`;

        }
    );

}


/* =========================================================
   CLEANUP
========================================================= */

function cleanupAdminDashboard() {

    stopSessionMonitoring();

    closeAllDropdowns();

    hideGlobalSearchResults();

}


/* =========================================================
   DEVELOPMENT VALIDATION
========================================================= */

function validateAdminDashboardSetup() {

    const requiredElements = [

        {
            key:
                "sidebar",

            label:
                "Admin sidebar"
        },

        {
            key:
                "globalSearchForm",

            label:
                "Global search form"
        },

        {
            key:
                "notificationButton",

            label:
                "Notification button"
        },

        {
            key:
                "toastRegion",

            label:
                "Toast region"
        },

        {
            key:
                "activityFeed",

            label:
                "Activity feed"
        },

        {
            key:
                "approvalList",

            label:
                "Approval list"
        },

        {
            key:
                "reportList",

            label:
                "Report list"
        }

    ];


    const missingElements =
        requiredElements.filter(
            ({ key }) => {

                return !adminElements[key];

            }
        );


    if (missingElements.length) {

        console.warn(
            "Admin dashboard is missing expected elements:",
            missingElements.map(
                ({ label }) => label
            )
        );


        return false;

    }


    return true;

}


/* =========================================================
   OPTIONAL DEVELOPMENT LOG
========================================================= */

function logAdminDevelopmentStatus() {

    if (
        !ADMIN_CONFIG.useDemoData
    ) {

        return;

    }


    console.info(
        [
            "Bharat Football Fans Admin Dashboard",
            "Mission FIFA 2034",
            "Frontend demo mode is active.",
            "Set ADMIN_CONFIG.useDemoData to false after backend integration."
        ].join("\n")
    );

}


/* =========================================================
   INITIALIZATION EXTENSIONS
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        window.setTimeout(
            () => {

                validateAdminDashboardSetup();

                logAdminDevelopmentStatus();

            },
            0
        );

    }
);


/* =========================================================
   BACKEND INTEGRATION NOTES

   HARSH — FASTAPI / POSTGRESQL
   --------------------------------
   Expected response contracts should remain consistent:

   GET /api/v1/admin/auth/session
   {
       "authenticated": true,
       "expiresAt": "ISO_DATE",
       "user": {
           "id": "uuid",
           "name": "Admin Name",
           "email": "admin@example.com",
           "role": "super_admin",
           "avatar": "/uploads/avatar.jpg"
       }
   }

   GET /api/v1/admin/dashboard
   {
       "metrics": {
           "totalUsers": 0,
           "verifiedMembers": 0,
           "pendingApprovals": 0,
           "securityAlerts": 0,
           "academies": 0,
           "activeEvents": 0
       }
   }

   All mutation routes should return:
   {
       "success": true,
       "message": "Action completed"
   }


   SAMARTH — SECURITY REVIEW
   --------------------------------
   Confirm before production:

   1. Every /admin route verifies server-side RBAC.
   2. JWT algorithm is allow-listed server-side.
   3. Issuer, audience and expiry are validated.
   4. Refresh tokens rotate after each use.
   5. Cookies use HttpOnly, Secure and SameSite.
   6. CSRF protection covers cookie-auth mutations.
   7. Login and sensitive actions are rate-limited.
   8. Audit logs cannot be edited by normal admins.
   9. File uploads validate MIME type and content.
   10. Sensitive admin actions require re-authentication.
   11. Security headers include CSP and frame protection.
   12. Database permissions follow least privilege.
========================================================= */