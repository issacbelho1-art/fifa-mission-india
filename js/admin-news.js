"use strict";

/* =========================================================
   BHARAT FOOTBALL FANS
   ADMIN NEWS MANAGEMENT

   FRONTEND-ONLY CONTROLLER

   Backend integration can later replace:
   - localStorage loading
   - localStorage saving
   - create/update/delete operations
   - authentication logout
========================================================= */

(() => {

    /* =====================================================
       APPLICATION CONSTANTS
    ====================================================== */

    const STORAGE_KEY = "bff_admin_news_articles_v1";

    const PAGE_SIZE = 6;

    const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

    const ALLOWED_IMAGE_TYPES = new Set([
        "image/jpeg",
        "image/png",
        "image/webp"
    ]);


    /* =====================================================
       DOM QUERY HELPERS
    ====================================================== */

    const $ = (
        selector,
        scope = document
    ) => scope.querySelector(selector);

    const $$ = (
        selector,
        scope = document
    ) => Array.from(
        scope.querySelectorAll(selector)
    );


    /* =====================================================
       DOM ELEMENT CACHE
    ====================================================== */

    const elements = {

        /* Loading */

        loadingScreen: $("#loadingScreen"),


        /* Sidebar */

        sidebar: $("#sidebar"),

        sidebarOverlay: $("#sidebarOverlay"),

        sidebarCloseButton: $("#sidebarCloseButton"),

        mobileMenuButton: $("#mobileMenuButton"),


        /* Topbar */

        searchButton: $("#searchButton"),

        notificationButton: $("#notificationButton"),

        notificationCount: $("#notificationCount"),

        profileButton: $("#profileButton"),

        profileMenu: $("#profileMenu"),


        /* Page controls */

        createNewsButton: $("#createNewsButton"),


        /* Search and filters */

        newsSearchInput: $("#newsSearchInput"),

        categoryFilter: $("#categoryFilter"),

        statusFilter: $("#statusFilter"),

        authorFilter: $("#authorFilter"),

        publishDateFilter: $("#publishDateFilter"),

        resetFiltersButton: $("#resetFiltersButton"),


        /* Bulk actions */

        bulkPublishButton: $("#bulkPublishButton"),

        bulkArchiveButton: $("#bulkArchiveButton"),

        bulkDeleteButton: $("#bulkDeleteButton"),

        exportCsvButton: $("#exportCsvButton"),

        exportPdfButton: $("#exportPdfButton"),


        /* News table */

        newsTableBody: $("#newsTableBody"),

        selectAllNews: $("#selectAllNews"),

        newsEmptyState: $("#newsEmptyState"),


        /* Pagination */

        paginationInfo: $("#paginationInfo"),

        previousPageButton: $("#previousPageButton"),

        nextPageButton: $("#nextPageButton"),

        currentPageNumber: $("#currentPageNumber"),


        /* Statistics */

        totalNewsCount: $("#totalNewsCount"),

        publishedNewsCount: $("#publishedNewsCount"),

        draftNewsCount: $("#draftNewsCount"),

        featuredNewsCount: $("#featuredNewsCount"),

        archivedNewsCount: $("#archivedNewsCount"),


        /* Preview modal */

        previewNewsModal: $("#previewNewsModal"),

        previewNewsImage: $("#previewNewsImage"),

        previewNewsCategory: $("#previewNewsCategory"),

        previewNewsAuthor: $("#previewNewsAuthor"),

        previewNewsDate: $("#previewNewsDate"),

        previewNewsViews: $("#previewNewsViews"),

        previewNewsHeading: $("#previewNewsHeading"),

        previewNewsExcerpt: $("#previewNewsExcerpt"),

        previewNewsBody: $("#previewNewsBody"),

        editFromPreviewButton: $("#editFromPreviewButton"),


        /* Create and edit modal */

        newsFormModal: $("#newsFormModal"),

        newsForm: $("#newsForm"),

        newsFormTitle: $("#newsFormTitle"),


        /* Main article fields */

        newsTitle: $("#newsTitle"),

        newsSlug: $("#newsSlug"),

        newsExcerpt: $("#newsExcerpt"),

        newsContentEditor: $("#newsContentEditor"),

        newsContent: $("#newsContent"),

        clearArticleFormattingButton:
            $("#clearArticleFormattingButton"),


        /* Featured image */

        newsImageUpload: $("#newsImageUpload"),

        newsImageInput: $("#newsImageInput"),

        newsImagePlaceholder:
            $("#newsImagePlaceholder"),

        chooseNewsImageButton:
            $("#chooseNewsImageButton"),

        newsImagePreview:
            $("#newsImagePreview"),

        newsImagePreviewElement:
            $("#newsImagePreviewElement"),

        replaceNewsImageButton:
            $("#replaceNewsImageButton"),

        removeNewsImageButton:
            $("#removeNewsImageButton"),


        /* SEO fields */

        newsSeoTitle: $("#newsSeoTitle"),

        newsSeoDescription:
            $("#newsSeoDescription"),

        newsKeywords: $("#newsKeywords"),


        /* Publishing fields */

        newsStatus: $("#newsStatus"),

        newsCategory: $("#newsCategory"),

        newsAuthor: $("#newsAuthor"),

        newsPublishDate:
            $("#newsPublishDate"),

        newsPublishTime:
            $("#newsPublishTime"),

        scheduleTimeField:
            $("#scheduleTimeField"),

        newsFeatured:
            $("#newsFeatured"),

        newsAllowSharing:
            $("#newsAllowSharing"),

        newsAllowComments:
            $("#newsAllowComments"),


        /* Character counters */

        newsTitleCount:
            $("#newsTitleCount"),

        newsExcerptCount:
            $("#newsExcerptCount"),

        newsSeoTitleCount:
            $("#newsSeoTitleCount"),

        newsSeoDescriptionCount:
            $("#newsSeoDescriptionCount"),


        /* Article summary */

        newsReadingTime:
            $("#newsReadingTime"),

        newsWordCount:
            $("#newsWordCount"),

        newsLastSaved:
            $("#newsLastSaved"),

        newsSaveStatus:
            $("#newsSaveStatus"),


        /* Form buttons */

        saveNewsDraftButton:
            $("#saveNewsDraftButton"),

        previewFormNewsButton:
            $("#previewFormNewsButton"),

        saveNewsButton:
            $("#saveNewsButton"),


        /* Delete modal */

        deleteNewsModal:
            $("#deleteNewsModal"),

        deleteNewsName:
            $("#deleteNewsName"),

        confirmDeleteNewsButton:
            $("#confirmDeleteNewsButton"),


        /* Global search */

        globalSearchOverlay:
            $("#globalSearchOverlay"),

        globalSearchInput:
            $("#globalSearchInput"),

        globalSearchResults:
            $("#globalSearchResults"),

        closeGlobalSearchButton:
            $("#closeGlobalSearchButton"),


        /* Notifications */

        notificationsPanel:
            $("#notificationsPanel"),

        closeNotificationsButton:
            $("#closeNotificationsButton"),


        /* Logout */

        logoutButton:
            $("#logoutButton"),

        profileLogoutButton:
            $("#profileLogoutButton"),

        logoutModal:
            $("#logoutModal"),

        confirmLogoutButton:
            $("#confirmLogoutButton"),


        /* Toasts */

        toastRegion:
            $("#toastRegion")
    };


    /* =====================================================
       APPLICATION STATE
    ====================================================== */

    const state = {

        articles: [],

        filteredArticles: [],

        currentPage: 1,

        selectedIds: new Set(),

        editingId: null,

        previewingId: null,

        previewArticle: null,

        deletingIds: [],

        imageDataUrl: "",

        imageObjectUrl: "",

        slugManuallyEdited: false,

        lastFocusedElement: null,

        baseStats: null,

        initialSampleStats: null
    };


    /* =====================================================
       CATEGORY LABELS
    ====================================================== */

    const categoryLabels = {

        announcement: "Announcement",

        academy: "Academy",

        players: "Players",

        trials: "Trials",

        events: "Events",

        "national-team": "National Team"
    };


    /* =====================================================
       SAMPLE ARTICLE BODY CONTENT
    ====================================================== */

    const defaultArticleBodies = {

        "news-001": `
            <p>
                Bharat Football Fans officially launches Mission FIFA 2034,
                a national movement created to unite supporters, academies,
                players, coaches and football communities behind India's
                long-term football dream.
            </p>

            <p>
                The initiative will focus on grassroots visibility, player
                development, supporter participation and transparent
                progress updates.
            </p>
        `,

        "news-002": `
            <p>
                Minerva Academy has opened registrations for its newest
                intake. Talented young footballers will have an opportunity
                to enter a structured development environment focused on
                technical, tactical, physical and personal growth.
            </p>
        `,

        "news-003": `
            <p>
                A nationwide talent identification programme is scheduled
                to begin, giving promising players across India an
                opportunity to be seen by qualified coaches and scouts.
            </p>
        `,

        "news-004": `
            <p>
                This editorial feature highlights promising young
                footballers whose performances, discipline and development
                potential make them players to watch.
            </p>
        `,

        "news-005": `
            <p>
                The Grassroots Football Festival will bring together young
                players, families, coaches and supporters for a celebration
                of community football.
            </p>
        `,

        "news-006": `
            <p>
                The Indian U17 squad continued its preparation programme
                with focused training sessions, match analysis and
                development planning.
            </p>
        `
    };


    /* =====================================================
       SECURITY AND TEXT UTILITIES
    ====================================================== */

    function escapeHtml(value) {

        return String(value ?? "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }


    function stripHtml(html) {

        const container =
            document.createElement("div");

        container.innerHTML =
            html || "";

        return (
            container.textContent || ""
        )
            .replace(/\s+/g, " ")
            .trim();
    }


    function slugify(value) {

        return String(value || "")
            .normalize("NFKD")
            .replace(
                /[\u0300-\u036f]/g,
                ""
            )
            .toLowerCase()
            .trim()
            .replace(
                /[^a-z0-9]+/g,
                "-"
            )
            .replace(
                /^-+|-+$/g,
                ""
            )
            .slice(
                0,
                100
            );
    }


    function normalizeAuthor(value) {

        return String(value || "")
            .trim()
            .toLowerCase();
    }


    /* =====================================================
       DATE UTILITIES
    ====================================================== */

    function toIsoDate(date) {

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


    function formatDate(value) {

        if (!value) {

            return "Not scheduled";
        }

        const date =
            new Date(
                `${value}T00:00:00`
            );

        if (
            Number.isNaN(
                date.getTime()
            )
        ) {

            return value;
        }

        return new Intl.DateTimeFormat(
            "en-GB",
            {
                day: "2-digit",
                month: "short",
                year: "numeric"
            }
        ).format(date);
    }


    /* =====================================================
       NUMBER AND ID UTILITIES
    ====================================================== */

    function formatViews(value) {

        const number =
            Number(value);

        if (
            !Number.isFinite(number) ||
            number <= 0
        ) {

            return "—";
        }

        return new Intl.NumberFormat(
            "en-IN"
        ).format(number);
    }


    function generateId() {

        if (
            window.crypto &&
            typeof window.crypto.randomUUID ===
                "function"
        ) {

            return `news-${window.crypto.randomUUID()}`;
        }

        return (
            `news-${Date.now()}-` +
            Math.random()
                .toString(16)
                .slice(2)
        );
    }


    function readNumber(
        element,
        fallback = 0
    ) {

        const text =
            element?.textContent || "";

        const number =
            Number(
                String(text)
                    .replace(
                        /[^0-9.-]/g,
                        ""
                    )
            );

        return Number.isFinite(number)
            ? number
            : fallback;
    }


    /* =====================================================
       NEWS STATISTICS
    ====================================================== */

    function getSampleStats(articles) {

        return {

            total:
                articles.length,

            published:
                articles.filter(
                    article =>
                        article.status ===
                        "published"
                ).length,

            draft:
                articles.filter(
                    article =>
                        article.status ===
                        "draft"
                ).length,

            featured:
                articles.filter(
                    article =>
                        article.featured
                ).length,

            archived:
                articles.filter(
                    article =>
                        article.status ===
                        "archived"
                ).length
        };
    }


    function getCurrentStats() {

        return getSampleStats(
            state.articles
        );
    }


    function captureBaseStats() {

        state.baseStats = {

            total:
                readNumber(
                    elements.totalNewsCount
                ),

            published:
                readNumber(
                    elements.publishedNewsCount
                ),

            draft:
                readNumber(
                    elements.draftNewsCount
                ),

            featured:
                readNumber(
                    elements.featuredNewsCount
                ),

            archived:
                readNumber(
                    elements.archivedNewsCount
                )
        };

        state.initialSampleStats =
            getSampleStats(
                state.articles
            );
    }


    function updateStatistics() {

        if (
            !state.baseStats ||
            !state.initialSampleStats
        ) {

            return;
        }

        const current =
            getCurrentStats();

        const display = {};

        Object.keys(
            state.baseStats
        ).forEach(key => {

            display[key] =
                Math.max(
                    0,
                    state.baseStats[key] +
                    current[key] -
                    state.initialSampleStats[key]
                );
        });

        elements.totalNewsCount.textContent =
            display.total;

        elements.publishedNewsCount.textContent =
            display.published;

        elements.draftNewsCount.textContent =
            display.draft;

        elements.featuredNewsCount.textContent =
            display.featured;

        elements.archivedNewsCount.textContent =
            display.archived;
    }


    /* =====================================================
       INITIAL ARTICLE PARSER
    ====================================================== */

    function parseInitialArticles() {

        const rows = $$(
            "tr[data-news-id]",
            elements.newsTableBody
        );

        return rows.map(row => {

            const cells =
                row.cells;

            const title =
                row.dataset.title ||
                $(
                    "td:nth-child(2) strong",
                    row
                )?.textContent.trim() ||
                "Untitled";

            const excerpt =
                $(
                    "td:nth-child(2) span",
                    row
                )?.textContent.trim() ||
                "";

            const viewsText =
                cells[5]
                    ?.textContent
                    .trim()
                    .replace(
                        /,/g,
                        ""
                    ) ||
                "0";

            const views =
                Number(viewsText);

            const id =
                row.dataset.newsId;

            return {

                id,

                title,

                slug:
                    slugify(title),

                excerpt,

                content:
                    defaultArticleBodies[id] ||
                    `<p>${escapeHtml(excerpt)}</p>`,

                category:
                    row.dataset.category ||
                    "announcement",

                author:
                    row.dataset.author ||
                    "Admin",

                status:
                    row.dataset.status ||
                    "draft",

                publishDate:
                    row.dataset.date ||
                    toIsoDate(
                        new Date()
                    ),

                publishTime:
                    "09:00",

                featured:
                    row.dataset.featured ===
                    "true",

                allowSharing:
                    true,

                allowComments:
                    false,

                views:
                    Number.isFinite(views)
                        ? views
                        : 0,

                image:
                    id === "news-001"
                        ? "images/news/mission-fifa-2034.jpg"
                        : "",

                seoTitle:
                    "",

                seoDescription:
                    "",

                keywords:
                    "",

                createdAt:
                    new Date()
                        .toISOString(),

                updatedAt:
                    new Date()
                        .toISOString()
            };
        });
    }


    /* =====================================================
       LOCAL DATA LOADING
    ====================================================== */

    function loadArticles() {

        const initialArticles =
            parseInitialArticles();

        let storedArticles =
            null;

        try {

            const stored =
                localStorage.getItem(
                    STORAGE_KEY
                );

            if (stored) {

                const parsed =
                    JSON.parse(stored);

                if (
                    Array.isArray(parsed)
                ) {

                    storedArticles =
                        parsed;
                }
            }

        } catch (error) {

            console.warn(
                "Unable to load saved articles:",
                error
            );
        }

        state.articles =
            storedArticles ||
            initialArticles;

        state.initialSampleStats =
            getSampleStats(
                initialArticles
            );
    }


    /* =====================================================
       LOCAL DATA SAVING
    ====================================================== */

    function saveArticles() {

        try {

            localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify(
                    state.articles
                )
            );

        } catch (error) {

            console.warn(
                "Unable to persist articles:",
                error
            );

            showToast(
                "Storage warning",
                "Changes are active for this session but could not be saved locally.",
                "warning"
            );
        }
    }


    /* =====================================================
       BUTTON LOADING STATE
    ====================================================== */

    function setButtonLoading(
        button,
        isLoading
    ) {

        if (!button) {

            return;
        }

        button.classList.toggle(
            "is-loading",
            isLoading
        );

        button.disabled =
            isLoading;

        button.setAttribute(
            "aria-busy",
            String(isLoading)
        );
    }


    /* =====================================================
       TOAST NOTIFICATION
    ====================================================== */

    function showToast(
        title,
        message,
        type = "success",
        duration = 4500
    ) {

        if (
            !elements.toastRegion
        ) {

            return;
        }

        const iconMap = {

            success:
                "fa-circle-check",

            warning:
                "fa-triangle-exclamation",

            error:
                "fa-circle-xmark",

            danger:
                "fa-circle-xmark",

            info:
                "fa-circle-info"
        };

        const toast =
            document.createElement(
                "article"
            );

        toast.className =
            `admin-toast ${type}`;

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

            <div class="admin-toast-copy">

                <strong>
                    ${escapeHtml(title)}
                </strong>

                <p>
                    ${escapeHtml(message)}
                </p>

            </div>

            <button
                type="button"
                class="admin-toast-close"
                aria-label="Dismiss notification"
            >

                <i
                    class="fa-solid fa-xmark"
                    aria-hidden="true"
                ></i>

            </button>
        `;

        const dismiss = () => {

            if (
                !toast.isConnected
            ) {

                return;
            }

            toast.classList.add(
                "is-leaving"
            );

            window.setTimeout(
                () => toast.remove(),
                300
            );
        };

        $(
            ".admin-toast-close",
            toast
        )?.addEventListener(
            "click",
            dismiss
        );

        elements.toastRegion
            .appendChild(toast);

        window.setTimeout(
            dismiss,
            duration
        );
    }


    /* =====================================================
       BODY SCROLL CONTROL
    ====================================================== */

    function lockBody() {

        document.body.classList.add(
            "modal-open"
        );
    }


    function unlockBodyIfPossible() {

        const anyOpenModal =
            $$(".news-modal")
                .some(
                    modal =>
                        !modal.hidden
                );

        const anyPanelOpen =
            !elements.notificationsPanel
                ?.hidden ||
            !elements.globalSearchOverlay
                ?.hidden;

        const sidebarOpen =
            elements.sidebar
                ?.classList
                .contains("is-open");

        if (
            !anyOpenModal &&
            !anyPanelOpen &&
            !sidebarOpen
        ) {

            document.body.classList.remove(
                "modal-open",
                "panel-open",
                "sidebar-open"
            );
        }
    }


    /* =====================================================
       GENERIC MODAL OPEN
    ====================================================== */

    function openModal(
        modal,
        focusTarget = null
    ) {

        if (!modal) {

            return;
        }

        state.lastFocusedElement =
            document.activeElement;

        modal.hidden =
            false;

        requestAnimationFrame(() => {

            modal.classList.add(
                "is-open"
            );
        });

        lockBody();

        window.setTimeout(() => {

            const target =
                focusTarget ||
                $(
                    `
                    button,
                    input,
                    select,
                    textarea,
                    [contenteditable="true"],
                    [tabindex]:not([tabindex="-1"])
                    `,
                    modal
                );

            target?.focus();

        }, 40);
    }


    /* =====================================================
       GENERIC MODAL CLOSE
    ====================================================== */

    function closeModal(modal) {

        if (
            !modal ||
            modal.hidden
        ) {

            return;
        }

        modal.classList.remove(
            "is-open"
        );

        window.setTimeout(() => {

            modal.hidden =
                true;

            unlockBodyIfPossible();

            state.lastFocusedElement
                ?.focus?.();

        }, 180);
    }


    /* =====================================================
       CLOSE ALL TEMPORARY INTERFACES
    ====================================================== */

    function closeAllTransientUi() {

        closeSidebar();

        closeGlobalSearch();

        closeNotifications();

        closeProfileMenu();
    }


    /* =====================================================
       MOBILE SIDEBAR
    ====================================================== */

    function openSidebar() {

        elements.sidebar
            ?.classList
            .add("is-open");

        if (
            elements.sidebarOverlay
        ) {

            elements.sidebarOverlay.hidden =
                false;
        }

        document.body.classList.add(
            "sidebar-open"
        );

        elements.mobileMenuButton
            ?.setAttribute(
                "aria-expanded",
                "true"
            );
    }


    function closeSidebar() {

        elements.sidebar
            ?.classList
            .remove("is-open");

        if (
            elements.sidebarOverlay
        ) {

            elements.sidebarOverlay.hidden =
                true;
        }

        document.body.classList.remove(
            "sidebar-open"
        );

        elements.mobileMenuButton
            ?.setAttribute(
                "aria-expanded",
                "false"
            );

        unlockBodyIfPossible();
    }


    /* =====================================================
       ARTICLE FILTERING
    ====================================================== */

    function getFilteredArticles() {

        const searchTerm =
            elements.newsSearchInput
                .value
                .trim()
                .toLowerCase();

        const category =
            elements.categoryFilter
                .value;

        const status =
            elements.statusFilter
                .value;

        const author =
            elements.authorFilter
                .value;

        const date =
            elements.publishDateFilter
                .value;

        return state.articles.filter(
            article => {

                const haystack = [

                    article.title,

                    article.excerpt,

                    article.author,

                    categoryLabels[
                        article.category
                    ],

                    stripHtml(
                        article.content
                    )

                ]
                    .join(" ")
                    .toLowerCase();

                const matchesSearch =
                    !searchTerm ||
                    haystack.includes(
                        searchTerm
                    );

                const matchesCategory =
                    category === "all" ||
                    article.category ===
                        category;

                const matchesStatus =
                    status === "all" ||
                    article.status ===
                        status;

                const matchesAuthor =
                    author === "all" ||
                    normalizeAuthor(
                        article.author
                    ).includes(author);

                const matchesDate =
                    !date ||
                    article.publishDate ===
                        date;

                return (
                    matchesSearch &&
                    matchesCategory &&
                    matchesStatus &&
                    matchesAuthor &&
                    matchesDate
                );
            }
        );
    }


    /* =====================================================
       STATUS BADGE HTML
    ====================================================== */

    function renderStatus(status) {

        const label =
            status
                .charAt(0)
                .toUpperCase() +
            status.slice(1);

        return `
            <span
                class="news-status ${escapeHtml(status)}"
            >
                ${escapeHtml(label)}
            </span>
        `;
    }


    /* =====================================================
       TABLE ARTICLE ROW HTML
    ====================================================== */

    function renderArticleRow(article) {

        const featuredHtml =
            article.featured
                ? `
                    <span class="featured-badge">
                        ★ Featured
                    </span>
                `
                : "No";

        const selected =
            state.selectedIds.has(
                article.id
            )
                ? "checked"
                : "";

        return `
            <tr
                data-news-id="${escapeHtml(article.id)}"
                data-title="${escapeHtml(article.title)}"
                data-category="${escapeHtml(article.category)}"
                data-author="${escapeHtml(article.author)}"
                data-status="${escapeHtml(article.status)}"
                data-date="${escapeHtml(article.publishDate)}"
                data-featured="${article.featured}"
            >

                <td>

                    <input
                        type="checkbox"
                        class="news-checkbox"
                        aria-label="Select ${escapeHtml(article.title)}"
                        ${selected}
                    >

                </td>

                <td>

                    <strong>
                        ${escapeHtml(article.title)}
                    </strong>

                    <span>
                        ${escapeHtml(
                            article.excerpt ||
                            "No excerpt added"
                        )}
                    </span>

                </td>

                <td>
                    ${escapeHtml(
                        categoryLabels[
                            article.category
                        ] ||
                        article.category
                    )}
                </td>

                <td>
                    ${escapeHtml(article.author)}
                </td>

                <td>
                    ${renderStatus(article.status)}
                </td>

                <td>
                    ${formatViews(article.views)}
                </td>

                <td>
                    ${escapeHtml(
                        formatDate(
                            article.publishDate
                        )
                    )}
                </td>

                <td>
                    ${featuredHtml}
                </td>

                <td>

                    <div class="news-actions">

                        <button
                            type="button"
                            class="news-action-button"
                            data-action="preview"
                            title="Preview"
                            aria-label="Preview ${escapeHtml(article.title)}"
                        >

                            <i
                                class="fa-solid fa-eye"
                                aria-hidden="true"
                            ></i>

                        </button>

                        <button
                            type="button"
                            class="news-action-button"
                            data-action="edit"
                            title="Edit"
                            aria-label="Edit ${escapeHtml(article.title)}"
                        >

                            <i
                                class="fa-solid fa-pen"
                                aria-hidden="true"
                            ></i>

                        </button>

                        <button
                            type="button"
                            class="news-action-button danger"
                            data-action="delete"
                            title="Delete"
                            aria-label="Delete ${escapeHtml(article.title)}"
                        >

                            <i
                                class="fa-solid fa-trash"
                                aria-hidden="true"
                            ></i>

                        </button>

                    </div>

                </td>

            </tr>
        `;
    }


    /* =====================================================
       TABLE RENDERING
    ====================================================== */

    function renderTable() {

        state.filteredArticles =
            getFilteredArticles();

        const totalPages =
            Math.max(
                1,
                Math.ceil(
                    state.filteredArticles.length /
                    PAGE_SIZE
                )
            );

        state.currentPage =
            Math.min(
                Math.max(
                    1,
                    state.currentPage
                ),
                totalPages
            );

        const startIndex =
            (
                state.currentPage -
                1
            ) *
            PAGE_SIZE;

        const pageArticles =
            state.filteredArticles.slice(
                startIndex,
                startIndex +
                PAGE_SIZE
            );

        elements.newsTableBody.innerHTML =
            pageArticles
                .map(renderArticleRow)
                .join("");

        elements.newsEmptyState.hidden =
            state.filteredArticles.length >
            0;

        const tableWrapper =
            $(".news-table-wrapper");

        if (tableWrapper) {

            tableWrapper.hidden =
                state.filteredArticles.length ===
                0;
        }

        const shownStart =
            state.filteredArticles.length
                ? startIndex + 1
                : 0;

        const shownEnd =
            Math.min(
                startIndex +
                PAGE_SIZE,
                state.filteredArticles.length
            );

        elements.paginationInfo.textContent =
            `Showing ${shownStart}–${shownEnd} of ` +
            `${state.filteredArticles.length} articles`;

        elements.currentPageNumber.textContent =
            String(
                state.currentPage
            );

        elements.previousPageButton.disabled =
            state.currentPage <= 1;

        elements.nextPageButton.disabled =
            state.currentPage >=
            totalPages;

        syncSelectAllCheckbox();

        updateStatistics();
    }


    /* =====================================================
       SELECT ALL CHECKBOX STATE
    ====================================================== */

    function syncSelectAllCheckbox() {

        const visibleCheckboxes =
            $$(
                ".news-checkbox",
                elements.newsTableBody
            );

        const checkedCount =
            visibleCheckboxes.filter(
                checkbox =>
                    checkbox.checked
            ).length;

        elements.selectAllNews.checked =
            visibleCheckboxes.length >
                0 &&
            checkedCount ===
                visibleCheckboxes.length;

        elements.selectAllNews.indeterminate =
            checkedCount > 0 &&
            checkedCount <
                visibleCheckboxes.length;
    }


    /* =====================================================
       APPLY FILTERS
    ====================================================== */

    function applyFilters() {

        state.currentPage =
            1;

        renderTable();
    }


    /* =====================================================
       RESET FILTERS
    ====================================================== */

    function resetFilters() {

        elements.newsSearchInput.value =
            "";

        elements.categoryFilter.value =
            "all";

        elements.statusFilter.value =
            "all";

        elements.authorFilter.value =
            "all";

        elements.publishDateFilter.value =
            "";

        state.currentPage =
            1;

        renderTable();

        showToast(
            "Filters reset",
            "All news filters have been cleared.",
            "info"
        );
    }
        /* =====================================================
       FIND ARTICLE BY ID
    ====================================================== */

    function getArticleById(articleId) {

        return state.articles.find(
            article =>
                article.id === articleId
        ) || null;
    }


    /* =====================================================
       FIND ARTICLE ROW ID
    ====================================================== */

    function getRowArticleId(target) {

        const row =
            target.closest(
                "tr[data-news-id]"
            );

        return (
            row?.dataset.newsId ||
            null
        );
    }


    /* =====================================================
       CLEAR SELECTED ARTICLES
    ====================================================== */

    function clearSelectedArticles() {

        state.selectedIds.clear();

        if (
            elements.selectAllNews
        ) {

            elements.selectAllNews.checked =
                false;

            elements.selectAllNews.indeterminate =
                false;
        }

        $$(
            ".news-checkbox",
            elements.newsTableBody
        ).forEach(checkbox => {

            checkbox.checked =
                false;
        });
    }


    /* =====================================================
       PROFILE MENU
    ====================================================== */

    function openProfileMenu() {

        if (
            !elements.profileMenu ||
            !elements.profileButton
        ) {

            return;
        }

        closeNotifications();
        closeGlobalSearch();

        elements.profileMenu.hidden =
            false;

        elements.profileButton.setAttribute(
            "aria-expanded",
            "true"
        );

        requestAnimationFrame(() => {

            elements.profileMenu.classList.add(
                "is-open"
            );
        });
    }


    function closeProfileMenu() {

        if (
            !elements.profileMenu
        ) {

            return;
        }

        elements.profileMenu.classList.remove(
            "is-open"
        );

        elements.profileButton
            ?.setAttribute(
                "aria-expanded",
                "false"
            );

        window.setTimeout(() => {

            elements.profileMenu.hidden =
                true;

        }, 160);
    }


    function toggleProfileMenu() {

        if (
            elements.profileMenu.hidden
        ) {

            openProfileMenu();

        } else {

            closeProfileMenu();
        }
    }


    /* =====================================================
       GLOBAL SEARCH DATA
    ====================================================== */

    function getGlobalSearchItems() {

        const staticItems = [

            {
                title: "Admin Dashboard",
                description:
                    "View platform statistics and activity.",
                url: "admin-dashboard.html",
                icon: "fa-chart-pie",
                type: "Page"
            },

            {
                title: "Users Management",
                description:
                    "Manage registered platform users.",
                url: "admin-users.html",
                icon: "fa-users",
                type: "Page"
            },

            {
                title: "Players Management",
                description:
                    "Review football player profiles.",
                url: "admin-players.html",
                icon: "fa-person-running",
                type: "Page"
            },

            {
                title: "Coaches Management",
                description:
                    "Manage registered coaches.",
                url: "admin-coaches.html",
                icon: "fa-chalkboard-user",
                type: "Page"
            },

            {
                title: "Scouts Management",
                description:
                    "Manage football scouts and reports.",
                url: "admin-scouts.html",
                icon: "fa-binoculars",
                type: "Page"
            },

            {
                title: "Academies Management",
                description:
                    "Review and manage academy profiles.",
                url: "admin-academies.html",
                icon: "fa-building-columns",
                type: "Page"
            },

            {
                title: "Trials Management",
                description:
                    "Manage football trial listings.",
                url: "admin-trials.html",
                icon: "fa-stopwatch",
                type: "Page"
            },

            {
                title: "News Management",
                description:
                    "Create, publish and manage news.",
                url: "admin-news.html",
                icon: "fa-newspaper",
                type: "Page"
            },

            {
                title: "Events Management",
                description:
                    "Manage platform events.",
                url: "admin-events.html",
                icon: "fa-calendar-days",
                type: "Page"
            },

            {
                title: "Media Management",
                description:
                    "Manage photos and videos.",
                url: "admin-media.html",
                icon: "fa-photo-film",
                type: "Page"
            }

        ];

        const articleItems =
            state.articles.map(article => ({

                title:
                    article.title,

                description:
                    `${categoryLabels[
                        article.category
                    ] || article.category} · ` +
                    `${article.status}`,

                url:
                    "#",

                icon:
                    "fa-newspaper",

                type:
                    "Article",

                articleId:
                    article.id
            }));

        return [
            ...staticItems,
            ...articleItems
        ];
    }


    /* =====================================================
       RENDER GLOBAL SEARCH RESULTS
    ====================================================== */

    function renderGlobalSearchResults(
        searchTerm
    ) {

        if (
            !elements.globalSearchResults
        ) {

            return;
        }

        const query =
            String(searchTerm || "")
                .trim()
                .toLowerCase();

        if (!query) {

            elements.globalSearchResults.innerHTML = `
                <p class="admin-global-search-empty">
                    Start typing to search...
                </p>
            `;

            return;
        }

        const results =
            getGlobalSearchItems()
                .filter(item => {

                    const searchableText =
                        `${item.title} ${item.description} ${item.type}`
                            .toLowerCase();

                    return searchableText.includes(
                        query
                    );
                })
                .slice(
                    0,
                    12
                );

        if (
            results.length === 0
        ) {

            elements.globalSearchResults.innerHTML = `
                <p class="admin-global-search-empty">
                    No matching results found.
                </p>
            `;

            return;
        }

        elements.globalSearchResults.innerHTML =
            results.map(item => `
                <button
                    type="button"
                    class="admin-global-search-result"
                    data-search-type="${escapeHtml(item.type)}"
                    data-search-url="${escapeHtml(item.url)}"
                    data-article-id="${escapeHtml(item.articleId || "")}"
                >

                    <span class="admin-global-search-result-icon">

                        <i
                            class="fa-solid ${escapeHtml(item.icon)}"
                            aria-hidden="true"
                        ></i>

                    </span>

                    <span class="admin-global-search-result-copy">

                        <strong>
                            ${escapeHtml(item.title)}
                        </strong>

                        <small>
                            ${escapeHtml(item.description)}
                        </small>

                    </span>

                    <span class="admin-global-search-result-type">
                        ${escapeHtml(item.type)}
                    </span>

                </button>
            `).join("");
    }


    /* =====================================================
       OPEN GLOBAL SEARCH
    ====================================================== */

    function openGlobalSearch() {

        if (
            !elements.globalSearchOverlay
        ) {

            return;
        }

        closeNotifications();
        closeProfileMenu();

        elements.globalSearchOverlay.hidden =
            false;

        document.body.classList.add(
            "panel-open"
        );

        requestAnimationFrame(() => {

            elements.globalSearchOverlay.classList.add(
                "is-open"
            );
        });

        elements.globalSearchInput.value =
            "";

        renderGlobalSearchResults("");

        window.setTimeout(() => {

            elements.globalSearchInput
                ?.focus();

        }, 60);
    }


    /* =====================================================
       CLOSE GLOBAL SEARCH
    ====================================================== */

    function closeGlobalSearch() {

        if (
            !elements.globalSearchOverlay ||
            elements.globalSearchOverlay.hidden
        ) {

            return;
        }

        elements.globalSearchOverlay.classList.remove(
            "is-open"
        );

        window.setTimeout(() => {

            elements.globalSearchOverlay.hidden =
                true;

            elements.globalSearchInput.value =
                "";

            renderGlobalSearchResults("");

            document.body.classList.remove(
                "panel-open"
            );

            unlockBodyIfPossible();

        }, 160);
    }


    /* =====================================================
       GLOBAL SEARCH RESULT ACTION
    ====================================================== */

    function handleGlobalSearchResult(
        button
    ) {

        const type =
            button.dataset.searchType;

        const url =
            button.dataset.searchUrl;

        const articleId =
            button.dataset.articleId;

        if (
            type === "Article" &&
            articleId
        ) {

            closeGlobalSearch();

            window.setTimeout(() => {

                openArticlePreview(
                    articleId
                );

            }, 180);

            return;
        }

        if (
            url &&
            url !== "#"
        ) {

            window.location.href =
                url;
        }
    }


    /* =====================================================
       NOTIFICATIONS PANEL
    ====================================================== */

    function openNotifications() {

        if (
            !elements.notificationsPanel
        ) {

            return;
        }

        closeGlobalSearch();
        closeProfileMenu();

        elements.notificationsPanel.hidden =
            false;

        document.body.classList.add(
            "panel-open"
        );

        requestAnimationFrame(() => {

            elements.notificationsPanel.classList.add(
                "is-open"
            );
        });

        if (
            elements.notificationCount
        ) {

            elements.notificationCount.textContent =
                "0";

            elements.notificationCount.hidden =
                true;
        }
    }


    function closeNotifications() {

        if (
            !elements.notificationsPanel ||
            elements.notificationsPanel.hidden
        ) {

            return;
        }

        elements.notificationsPanel.classList.remove(
            "is-open"
        );

        window.setTimeout(() => {

            elements.notificationsPanel.hidden =
                true;

            document.body.classList.remove(
                "panel-open"
            );

            unlockBodyIfPossible();

        }, 180);
    }


    function toggleNotifications() {

        if (
            elements.notificationsPanel.hidden
        ) {

            openNotifications();

        } else {

            closeNotifications();
        }
    }


    /* =====================================================
       LOGOUT MODAL
    ====================================================== */

    function openLogoutModal() {

        closeProfileMenu();
        closeNotifications();
        closeGlobalSearch();
        closeSidebar();

        openModal(
            elements.logoutModal,
            elements.confirmLogoutButton
        );
    }


    function closeLogoutModal() {

        closeModal(
            elements.logoutModal
        );
    }


    function confirmLogout() {

        setButtonLoading(
            elements.confirmLogoutButton,
            true
        );

        window.setTimeout(() => {

            try {

                sessionStorage.removeItem(
                    "bff_admin_session"
                );

                localStorage.removeItem(
                    "bff_admin_auth"
                );

            } catch (error) {

                console.warn(
                    "Unable to clear admin session:",
                    error
                );
            }

            showToast(
                "Logged out",
                "Your admin session has ended.",
                "success",
                1800
            );

            window.setTimeout(() => {

                window.location.href =
                    "admin-login.html";

            }, 900);

        }, 500);
    }


    /* =====================================================
       IMAGE OBJECT URL CLEANUP
    ====================================================== */

    function revokeCurrentImageObjectUrl() {

        if (
            state.imageObjectUrl
        ) {

            URL.revokeObjectURL(
                state.imageObjectUrl
            );

            state.imageObjectUrl =
                "";
        }
    }


    /* =====================================================
       RESET FIELD VALIDATION
    ====================================================== */

    function clearFieldValidation() {

        $$(
            ".news-field",
            elements.newsForm
        ).forEach(field => {

            field.classList.remove(
                "has-error",
                "is-valid"
            );
        });

        $$(
            "[aria-invalid='true']",
            elements.newsForm
        ).forEach(control => {

            control.removeAttribute(
                "aria-invalid"
            );
        });
    }


    /* =====================================================
       UPDATE CHARACTER COUNTER
    ====================================================== */

    function updateCharacterCounter(
        input,
        counter,
        maximum
    ) {

        if (
            !input ||
            !counter
        ) {

            return;
        }

        const length =
            input.value.length;

        counter.textContent =
            `${length} / ${maximum}`;

        counter.classList.toggle(
            "is-warning",
            length >= maximum * 0.85 &&
            length < maximum
        );

        counter.classList.toggle(
            "is-limit",
            length >= maximum
        );
    }


    /* =====================================================
       UPDATE ALL CHARACTER COUNTERS
    ====================================================== */

    function updateAllCharacterCounters() {

        updateCharacterCounter(
            elements.newsTitle,
            elements.newsTitleCount,
            120
        );

        updateCharacterCounter(
            elements.newsExcerpt,
            elements.newsExcerptCount,
            240
        );

        updateCharacterCounter(
            elements.newsSeoTitle,
            elements.newsSeoTitleCount,
            60
        );

        updateCharacterCounter(
            elements.newsSeoDescription,
            elements.newsSeoDescriptionCount,
            160
        );
    }


    /* =====================================================
       UPDATE WORD COUNT AND READING TIME
    ====================================================== */

    function updateArticleSummary() {

        const text =
            stripHtml(
                elements.newsContentEditor
                    ?.innerHTML || ""
            );

        const words =
            text
                ? text
                    .split(/\s+/)
                    .filter(Boolean)
                : [];

        const wordCount =
            words.length;

        const readingTime =
            wordCount === 0
                ? 0
                : Math.max(
                    1,
                    Math.ceil(
                        wordCount / 220
                    )
                );

        elements.newsWordCount.textContent =
            `${wordCount} ${
                wordCount === 1
                    ? "word"
                    : "words"
            }`;

        elements.newsReadingTime.textContent =
            `${readingTime} min`;

        elements.newsContent.value =
            elements.newsContentEditor
                .innerHTML
                .trim();
    }


    /* =====================================================
       UPDATE SCHEDULE FIELD
    ====================================================== */

    function updateScheduleField() {

        const isScheduled =
            elements.newsStatus.value ===
            "scheduled";

        elements.scheduleTimeField.hidden =
            !isScheduled;

        elements.newsPublishTime.required =
            isScheduled;

        if (
            isScheduled &&
            !elements.newsPublishTime.value
        ) {

            elements.newsPublishTime.value =
                "09:00";
        }
    }


    /* =====================================================
       RESET FEATURED IMAGE
    ====================================================== */

    function resetFeaturedImage() {

        revokeCurrentImageObjectUrl();

        state.imageDataUrl =
            "";

        elements.newsImageInput.value =
            "";

        elements.newsImagePreviewElement.src =
            "";

        elements.newsImagePreview.hidden =
            true;

        elements.newsImagePlaceholder.hidden =
            false;

        elements.newsImageUpload.classList.remove(
            "has-image",
            "is-dragging",
            "has-error"
        );
    }


    /* =====================================================
       SHOW FEATURED IMAGE
    ====================================================== */

    function showFeaturedImage(
        imageSource
    ) {

        if (!imageSource) {

            resetFeaturedImage();

            return;
        }

        state.imageDataUrl =
            imageSource;

        elements.newsImagePreviewElement.src =
            imageSource;

        elements.newsImagePlaceholder.hidden =
            true;

        elements.newsImagePreview.hidden =
            false;

        elements.newsImageUpload.classList.add(
            "has-image"
        );

        elements.newsImageUpload.classList.remove(
            "has-error"
        );
    }


    /* =====================================================
       RESET NEWS FORM
    ====================================================== */

    function resetNewsForm() {

        elements.newsForm.reset();

        state.editingId =
            null;

        state.previewArticle =
            null;

        state.slugManuallyEdited =
            false;

        elements.newsFormTitle.textContent =
            "Create News Article";

        elements.newsTitle.value =
            "";

        elements.newsSlug.value =
            "";

        elements.newsExcerpt.value =
            "";

        elements.newsContentEditor.innerHTML =
            "";

        elements.newsContent.value =
            "";

        elements.newsSeoTitle.value =
            "";

        elements.newsSeoDescription.value =
            "";

        elements.newsKeywords.value =
            "";

        elements.newsStatus.value =
            "draft";

        elements.newsCategory.value =
            "";

        elements.newsAuthor.value =
            "";

        elements.newsPublishDate.value =
            toIsoDate(
                new Date()
            );

        elements.newsPublishTime.value =
            "09:00";

        elements.newsFeatured.checked =
            false;

        elements.newsAllowSharing.checked =
            true;

        elements.newsAllowComments.checked =
            false;

        elements.newsLastSaved.textContent =
            "Not saved";

        elements.newsSaveStatus.textContent =
            "";

        elements.saveNewsButton.innerHTML = `
            <i
                class="fa-solid fa-check"
                aria-hidden="true"
            ></i>

            Save Article
        `;

        clearFieldValidation();

        resetFeaturedImage();

        updateScheduleField();

        updateAllCharacterCounters();

        updateArticleSummary();
    }


    /* =====================================================
       POPULATE NEWS FORM
    ====================================================== */

    function populateNewsForm(
        article
    ) {

        if (!article) {

            return;
        }

        resetNewsForm();

        state.editingId =
            article.id;

        state.slugManuallyEdited =
            true;

        elements.newsFormTitle.textContent =
            "Edit News Article";

        elements.newsTitle.value =
            article.title || "";

        elements.newsSlug.value =
            article.slug || "";

        elements.newsExcerpt.value =
            article.excerpt || "";

        elements.newsContentEditor.innerHTML =
            article.content || "";

        elements.newsContent.value =
            article.content || "";

        elements.newsSeoTitle.value =
            article.seoTitle || "";

        elements.newsSeoDescription.value =
            article.seoDescription || "";

        elements.newsKeywords.value =
            article.keywords || "";

        elements.newsStatus.value =
            article.status || "draft";

        elements.newsCategory.value =
            article.category || "";

        elements.newsAuthor.value =
            article.author || "";

        elements.newsPublishDate.value =
            article.publishDate ||
            toIsoDate(
                new Date()
            );

        elements.newsPublishTime.value =
            article.publishTime ||
            "09:00";

        elements.newsFeatured.checked =
            Boolean(
                article.featured
            );

        elements.newsAllowSharing.checked =
            article.allowSharing !==
            false;

        elements.newsAllowComments.checked =
            Boolean(
                article.allowComments
            );

        if (
            article.image
        ) {

            showFeaturedImage(
                article.image
            );
        }

        elements.newsLastSaved.textContent =
            article.updatedAt
                ? new Intl.DateTimeFormat(
                    "en-IN",
                    {
                        day: "2-digit",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit"
                    }
                ).format(
                    new Date(
                        article.updatedAt
                    )
                )
                : "Not saved";

        elements.saveNewsButton.innerHTML = `
            <i
                class="fa-solid fa-check"
                aria-hidden="true"
            ></i>

            Update Article
        `;

        updateScheduleField();

        updateAllCharacterCounters();

        updateArticleSummary();
    }


    /* =====================================================
       OPEN CREATE ARTICLE FORM
    ====================================================== */

    function openCreateNewsForm() {

        resetNewsForm();

        openModal(
            elements.newsFormModal,
            elements.newsTitle
        );
    }


    /* =====================================================
       OPEN EDIT ARTICLE FORM
    ====================================================== */

    function openEditNewsForm(
        articleId
    ) {

        const article =
            getArticleById(
                articleId
            );

        if (!article) {

            showToast(
                "Article unavailable",
                "The selected article could not be found.",
                "error"
            );

            return;
        }

        populateNewsForm(
            article
        );

        openModal(
            elements.newsFormModal,
            elements.newsTitle
        );
    }


    /* =====================================================
       CLOSE NEWS FORM
    ====================================================== */

    function closeNewsForm() {

        closeModal(
            elements.newsFormModal
        );

        window.setTimeout(() => {

            resetNewsForm();

        }, 220);
    }


    /* =====================================================
       PREVIEW ARTICLE DATA
    ====================================================== */

    function displayPreviewArticle(
        article
    ) {

        if (!article) {

            return;
        }

        state.previewArticle =
            article;

        state.previewingId =
            article.id || null;

        elements.previewNewsImage.src =
            article.image ||
            "images/news/mission-fifa-2034.jpg";

        elements.previewNewsImage.alt =
            `${article.title || "Article"} featured image`;

        elements.previewNewsCategory.textContent =
            categoryLabels[
                article.category
            ] ||
            article.category ||
            "News";

        elements.previewNewsAuthor.textContent =
            article.author ||
            "Admin";

        elements.previewNewsDate.textContent =
            formatDate(
                article.publishDate
            );

        elements.previewNewsViews.textContent =
            article.views
                ? `${formatViews(article.views)} views`
                : "Not published";

        elements.previewNewsHeading.textContent =
            article.title ||
            "Untitled Article";

        elements.previewNewsExcerpt.textContent =
            article.excerpt ||
            "No excerpt has been added.";

        elements.previewNewsBody.innerHTML =
            article.content ||
            "<p>No article content has been added.</p>";
    }


    /* =====================================================
       OPEN ARTICLE PREVIEW
    ====================================================== */

    function openArticlePreview(
        articleId
    ) {

        const article =
            getArticleById(
                articleId
            );

        if (!article) {

            showToast(
                "Preview unavailable",
                "The selected article could not be found.",
                "error"
            );

            return;
        }

        displayPreviewArticle(
            article
        );

        openModal(
            elements.previewNewsModal
        );
    }


    /* =====================================================
       CLOSE ARTICLE PREVIEW
    ====================================================== */

    function closeArticlePreview() {

        closeModal(
            elements.previewNewsModal
        );
    }


    /* =====================================================
       PREVIEW CURRENT FORM ARTICLE
    ====================================================== */

    function previewCurrentFormArticle() {

        updateArticleSummary();

        const temporaryArticle = {

            id:
                state.editingId ||
                "temporary-preview",

            title:
                elements.newsTitle.value.trim() ||
                "Untitled Article",

            slug:
                elements.newsSlug.value.trim(),

            excerpt:
                elements.newsExcerpt.value.trim() ||
                "No excerpt has been added.",

            content:
                elements.newsContent.value ||
                "<p>No article content has been added.</p>",

            category:
                elements.newsCategory.value ||
                "announcement",

            author:
                elements.newsAuthor.value ||
                "Admin",

            status:
                elements.newsStatus.value ||
                "draft",

            publishDate:
                elements.newsPublishDate.value ||
                toIsoDate(
                    new Date()
                ),

            publishTime:
                elements.newsPublishTime.value ||
                "09:00",

            featured:
                elements.newsFeatured.checked,

            allowSharing:
                elements.newsAllowSharing.checked,

            allowComments:
                elements.newsAllowComments.checked,

            views:
                state.editingId
                    ? getArticleById(
                        state.editingId
                    )?.views || 0
                    : 0,

            image:
                state.imageDataUrl ||
                "",

            seoTitle:
                elements.newsSeoTitle.value.trim(),

            seoDescription:
                elements.newsSeoDescription.value.trim(),

            keywords:
                elements.newsKeywords.value.trim()
        };

        displayPreviewArticle(
            temporaryArticle
        );

        closeModal(
            elements.newsFormModal
        );

        window.setTimeout(() => {

            openModal(
                elements.previewNewsModal
            );

        }, 200);
    }


    /* =====================================================
       EDIT ARTICLE FROM PREVIEW
    ====================================================== */

    function editArticleFromPreview() {

        const previewArticle =
            state.previewArticle;

        closeArticlePreview();

        window.setTimeout(() => {

            if (
                previewArticle?.id &&
                previewArticle.id !==
                    "temporary-preview"
            ) {

                openEditNewsForm(
                    previewArticle.id
                );

                return;
            }

            openModal(
                elements.newsFormModal,
                elements.newsTitle
            );

        }, 200);
    }


    /* =====================================================
       OPEN DELETE ARTICLE MODAL
    ====================================================== */

    function openDeleteModal(
        articleIds
    ) {

        const ids =
            Array.isArray(articleIds)
                ? articleIds.filter(Boolean)
                : [articleIds].filter(Boolean);

        if (
            ids.length === 0
        ) {

            showToast(
                "Nothing selected",
                "Select at least one article first.",
                "warning"
            );

            return;
        }

        state.deletingIds =
            ids;

        if (
            ids.length === 1
        ) {

            const article =
                getArticleById(
                    ids[0]
                );

            elements.deleteNewsName.textContent =
                article?.title ||
                "Selected article";

            elements.confirmDeleteNewsButton.innerHTML = `
                <i
                    class="fa-solid fa-trash"
                    aria-hidden="true"
                ></i>

                Delete Article
            `;

        } else {

            elements.deleteNewsName.textContent =
                `${ids.length} selected articles`;

            elements.confirmDeleteNewsButton.innerHTML = `
                <i
                    class="fa-solid fa-trash"
                    aria-hidden="true"
                ></i>

                Delete ${ids.length} Articles
            `;
        }

        openModal(
            elements.deleteNewsModal,
            elements.confirmDeleteNewsButton
        );
    }


    /* =====================================================
       CLOSE DELETE ARTICLE MODAL
    ====================================================== */

    function closeDeleteModal() {

        closeModal(
            elements.deleteNewsModal
        );

        window.setTimeout(() => {

            state.deletingIds =
                [];

        }, 220);
    }


    /* =====================================================
       DELETE SELECTED ARTICLES
    ====================================================== */

    function confirmArticleDeletion() {

        if (
            state.deletingIds.length === 0
        ) {

            closeDeleteModal();

            return;
        }

        setButtonLoading(
            elements.confirmDeleteNewsButton,
            true
        );

        const idsToDelete =
            new Set(
                state.deletingIds
            );

        const deletedCount =
            idsToDelete.size;

        window.setTimeout(() => {

            state.articles =
                state.articles.filter(
                    article =>
                        !idsToDelete.has(
                            article.id
                        )
                );

            idsToDelete.forEach(id => {

                state.selectedIds.delete(
                    id
                );
            });

            saveArticles();

            setButtonLoading(
                elements.confirmDeleteNewsButton,
                false
            );

            closeDeleteModal();

            renderTable();

            showToast(
                deletedCount === 1
                    ? "Article deleted"
                    : "Articles deleted",
                deletedCount === 1
                    ? "The article was permanently removed."
                    : `${deletedCount} articles were permanently removed.`,
                "success"
            );

        }, 450);
    }


    /* =====================================================
       TABLE ACTION HANDLER
    ====================================================== */

    function handleTableAction(
        event
    ) {

        const actionButton =
            event.target.closest(
                "[data-action]"
            );

        if (!actionButton) {

            return;
        }

        const articleId =
            getRowArticleId(
                actionButton
            );

        if (!articleId) {

            return;
        }

        const action =
            actionButton.dataset.action;

        if (
            action === "preview"
        ) {

            openArticlePreview(
                articleId
            );

            return;
        }

        if (
            action === "edit"
        ) {

            openEditNewsForm(
                articleId
            );

            return;
        }

        if (
            action === "delete"
        ) {

            openDeleteModal(
                articleId
            );
        }
    }


    /* =====================================================
       INDIVIDUAL CHECKBOX CHANGE
    ====================================================== */

    function handleArticleCheckboxChange(
        checkbox
    ) {

        const articleId =
            getRowArticleId(
                checkbox
            );

        if (!articleId) {

            return;
        }

        if (
            checkbox.checked
        ) {

            state.selectedIds.add(
                articleId
            );

        } else {

            state.selectedIds.delete(
                articleId
            );
        }

        syncSelectAllCheckbox();
    }


    /* =====================================================
       SELECT ALL VISIBLE ARTICLES
    ====================================================== */

    function handleSelectAllChange() {

        const visibleCheckboxes =
            $$(
                ".news-checkbox",
                elements.newsTableBody
            );

        visibleCheckboxes.forEach(
            checkbox => {

                checkbox.checked =
                    elements.selectAllNews.checked;

                const articleId =
                    getRowArticleId(
                        checkbox
                    );

                if (!articleId) {

                    return;
                }

                if (
                    elements.selectAllNews.checked
                ) {

                    state.selectedIds.add(
                        articleId
                    );

                } else {

                    state.selectedIds.delete(
                        articleId
                    );
                }
            }
        );

        syncSelectAllCheckbox();
    }


    /* =====================================================
       PAGINATION ACTIONS
    ====================================================== */

    function goToPreviousPage() {

        if (
            state.currentPage <= 1
        ) {

            return;
        }

        state.currentPage -=
            1;

        renderTable();

        elements.newsTableBody
            ?.closest(
                ".news-table-card"
            )
            ?.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
    }


    function goToNextPage() {

        const totalPages =
            Math.max(
                1,
                Math.ceil(
                    state.filteredArticles.length /
                    PAGE_SIZE
                )
            );

        if (
            state.currentPage >=
            totalPages
        ) {

            return;
        }

        state.currentPage +=
            1;

        renderTable();

        elements.newsTableBody
            ?.closest(
                ".news-table-card"
            )
            ?.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
    }
        /* =====================================================
       FORM FIELD VALIDATION HELPERS
    ====================================================== */

    function markFieldInvalid(
        control
    ) {

        if (!control) {

            return;
        }

        const field =
            control.closest(
                ".news-field"
            );

        field?.classList.add(
            "has-error"
        );

        field?.classList.remove(
            "is-valid"
        );

        control.setAttribute(
            "aria-invalid",
            "true"
        );
    }


    function markFieldValid(
        control
    ) {

        if (!control) {

            return;
        }

        const field =
            control.closest(
                ".news-field"
            );

        field?.classList.remove(
            "has-error"
        );

        field?.classList.add(
            "is-valid"
        );

        control.removeAttribute(
            "aria-invalid"
        );
    }


    function isEditorEmpty() {

        const text =
            stripHtml(
                elements.newsContentEditor
                    .innerHTML
            );

        return text.length === 0;
    }


    /* =====================================================
       VALIDATE NEWS FORM
    ====================================================== */

    function validateNewsForm() {

        clearFieldValidation();

        updateArticleSummary();

        const invalidControls =
            [];

        const title =
            elements.newsTitle
                .value
                .trim();

        const excerpt =
            elements.newsExcerpt
                .value
                .trim();

        const category =
            elements.newsCategory
                .value;

        const author =
            elements.newsAuthor
                .value;

        if (!title) {

            markFieldInvalid(
                elements.newsTitle
            );

            invalidControls.push(
                elements.newsTitle
            );

        } else {

            markFieldValid(
                elements.newsTitle
            );
        }

        if (!excerpt) {

            markFieldInvalid(
                elements.newsExcerpt
            );

            invalidControls.push(
                elements.newsExcerpt
            );

        } else {

            markFieldValid(
                elements.newsExcerpt
            );
        }

        if (
            isEditorEmpty()
        ) {

            markFieldInvalid(
                elements.newsContentEditor
            );

            invalidControls.push(
                elements.newsContentEditor
            );

        } else {

            markFieldValid(
                elements.newsContentEditor
            );
        }

        if (!category) {

            markFieldInvalid(
                elements.newsCategory
            );

            invalidControls.push(
                elements.newsCategory
            );

        } else {

            markFieldValid(
                elements.newsCategory
            );
        }

        if (!author) {

            markFieldInvalid(
                elements.newsAuthor
            );

            invalidControls.push(
                elements.newsAuthor
            );

        } else {

            markFieldValid(
                elements.newsAuthor
            );
        }

        if (
            elements.newsStatus.value ===
                "scheduled"
        ) {

            if (
                !elements.newsPublishDate
                    .value
            ) {

                markFieldInvalid(
                    elements.newsPublishDate
                );

                invalidControls.push(
                    elements.newsPublishDate
                );

            } else {

                markFieldValid(
                    elements.newsPublishDate
                );
            }

            if (
                !elements.newsPublishTime
                    .value
            ) {

                markFieldInvalid(
                    elements.newsPublishTime
                );

                invalidControls.push(
                    elements.newsPublishTime
                );

            } else {

                markFieldValid(
                    elements.newsPublishTime
                );
            }
        }

        if (
            invalidControls.length >
            0
        ) {

            invalidControls[0]
                ?.focus();

            showToast(
                "Complete required fields",
                "Please correct the highlighted article fields.",
                "warning"
            );

            return false;
        }

        return true;
    }


    /* =====================================================
       CREATE ARTICLE OBJECT FROM FORM
    ====================================================== */

    function buildArticleFromForm(
        statusOverride = null
    ) {

        updateArticleSummary();

        const existingArticle =
            state.editingId
                ? getArticleById(
                    state.editingId
                )
                : null;

        const now =
            new Date()
                .toISOString();

        const selectedStatus =
            statusOverride ||
            elements.newsStatus.value ||
            "draft";

        const title =
            elements.newsTitle
                .value
                .trim();

        return {

            id:
                existingArticle?.id ||
                generateId(),

            title,

            slug:
                elements.newsSlug
                    .value
                    .trim() ||
                slugify(title),

            excerpt:
                elements.newsExcerpt
                    .value
                    .trim(),

            content:
                elements.newsContent
                    .value
                    .trim(),

            category:
                elements.newsCategory
                    .value,

            author:
                elements.newsAuthor
                    .value,

            status:
                selectedStatus,

            publishDate:
                elements.newsPublishDate
                    .value ||
                toIsoDate(
                    new Date()
                ),

            publishTime:
                elements.newsPublishTime
                    .value ||
                "09:00",

            featured:
                elements.newsFeatured
                    .checked,

            allowSharing:
                elements.newsAllowSharing
                    .checked,

            allowComments:
                elements.newsAllowComments
                    .checked,

            views:
                existingArticle?.views ||
                0,

            image:
                state.imageDataUrl ||
                existingArticle?.image ||
                "",

            seoTitle:
                elements.newsSeoTitle
                    .value
                    .trim(),

            seoDescription:
                elements.newsSeoDescription
                    .value
                    .trim(),

            keywords:
                elements.newsKeywords
                    .value
                    .trim(),

            createdAt:
                existingArticle?.createdAt ||
                now,

            updatedAt:
                now
        };
    }


    /* =====================================================
       SAVE OR UPDATE ARTICLE
    ====================================================== */

    function persistArticle(
        article
    ) {

        const existingIndex =
            state.articles.findIndex(
                item =>
                    item.id === article.id
            );

        if (
            existingIndex >= 0
        ) {

            state.articles[
                existingIndex
            ] = article;

        } else {

            state.articles.unshift(
                article
            );
        }

        saveArticles();
    }


    /* =====================================================
       SUBMIT NEWS FORM
    ====================================================== */

    function handleNewsFormSubmit(
        event
    ) {

        event.preventDefault();

        if (
            !validateNewsForm()
        ) {

            return;
        }

        setButtonLoading(
            elements.saveNewsButton,
            true
        );

        const wasEditing =
            Boolean(
                state.editingId
            );

        const article =
            buildArticleFromForm();

        window.setTimeout(() => {

            persistArticle(
                article
            );

            setButtonLoading(
                elements.saveNewsButton,
                false
            );

            closeNewsForm();

            state.currentPage =
                1;

            clearSelectedArticles();

            renderTable();

            showToast(
                wasEditing
                    ? "Article updated"
                    : "Article created",
                wasEditing
                    ? "The news article was updated successfully."
                    : "The news article was created successfully.",
                "success"
            );

        }, 500);
    }


    /* =====================================================
       SAVE ARTICLE AS DRAFT
    ====================================================== */

    function saveArticleAsDraft() {

        const title =
            elements.newsTitle
                .value
                .trim();

        if (!title) {

            markFieldInvalid(
                elements.newsTitle
            );

            elements.newsTitle.focus();

            showToast(
                "Title required",
                "Add an article title before saving the draft.",
                "warning"
            );

            return;
        }

        updateArticleSummary();

        setButtonLoading(
            elements.saveNewsDraftButton,
            true
        );

        const wasEditing =
            Boolean(
                state.editingId
            );

        const article =
            buildArticleFromForm(
                "draft"
            );

        window.setTimeout(() => {

            persistArticle(
                article
            );

            state.editingId =
                article.id;

            elements.newsStatus.value =
                "draft";

            elements.newsFormTitle.textContent =
                "Edit News Article";

            elements.saveNewsButton.innerHTML = `
                <i
                    class="fa-solid fa-check"
                    aria-hidden="true"
                ></i>

                Update Article
            `;

            const savedTime =
                new Intl.DateTimeFormat(
                    "en-IN",
                    {
                        hour: "2-digit",
                        minute: "2-digit"
                    }
                ).format(
                    new Date()
                );

            elements.newsLastSaved.textContent =
                savedTime;

            elements.newsSaveStatus.textContent =
                "Draft saved";

            setButtonLoading(
                elements.saveNewsDraftButton,
                false
            );

            renderTable();

            showToast(
                wasEditing
                    ? "Draft updated"
                    : "Draft saved",
                "The article has been saved as a draft.",
                "success"
            );

            window.setTimeout(() => {

                if (
                    elements.newsSaveStatus
                        .textContent ===
                    "Draft saved"
                ) {

                    elements.newsSaveStatus.textContent =
                        "";
                }

            }, 3500);

        }, 450);
    }


    /* =====================================================
       AUTOMATIC SLUG GENERATION
    ====================================================== */

    function handleTitleInput() {

        updateCharacterCounter(
            elements.newsTitle,
            elements.newsTitleCount,
            120
        );

        if (
            !state.slugManuallyEdited
        ) {

            elements.newsSlug.value =
                slugify(
                    elements.newsTitle
                        .value
                );
        }

        const field =
            elements.newsTitle.closest(
                ".news-field"
            );

        if (
            elements.newsTitle
                .value
                .trim()
        ) {

            field?.classList.remove(
                "has-error"
            );

            elements.newsTitle
                .removeAttribute(
                    "aria-invalid"
                );
        }
    }


    function handleSlugInput() {

        state.slugManuallyEdited =
            true;

        const cursorPosition =
            elements.newsSlug
                .selectionStart;

        elements.newsSlug.value =
            slugify(
                elements.newsSlug
                    .value
            );

        const nextPosition =
            Math.min(
                cursorPosition,
                elements.newsSlug
                    .value
                    .length
            );

        elements.newsSlug
            .setSelectionRange(
                nextPosition,
                nextPosition
            );
    }


    function handleSlugBlur() {

        if (
            !elements.newsSlug
                .value
                .trim()
        ) {

            state.slugManuallyEdited =
                false;

            elements.newsSlug.value =
                slugify(
                    elements.newsTitle
                        .value
                );
        }
    }


    /* =====================================================
       FIELD INPUT HANDLERS
    ====================================================== */

    function handleExcerptInput() {

        updateCharacterCounter(
            elements.newsExcerpt,
            elements.newsExcerptCount,
            240
        );

        if (
            elements.newsExcerpt
                .value
                .trim()
        ) {

            markFieldValid(
                elements.newsExcerpt
            );
        }
    }


    function handleSeoTitleInput() {

        updateCharacterCounter(
            elements.newsSeoTitle,
            elements.newsSeoTitleCount,
            60
        );
    }


    function handleSeoDescriptionInput() {

        updateCharacterCounter(
            elements.newsSeoDescription,
            elements.newsSeoDescriptionCount,
            160
        );
    }


    function handleContentInput() {

        updateArticleSummary();

        if (
            !isEditorEmpty()
        ) {

            markFieldValid(
                elements.newsContentEditor
            );
        }
    }


    /* =====================================================
       RICH TEXT EDITOR COMMANDS
    ====================================================== */

    function executeEditorCommand(
        command
    ) {

        elements.newsContentEditor
            .focus();

        if (
            command ===
            "createLink"
        ) {

            const selection =
                window.getSelection();

            if (
                !selection ||
                selection.rangeCount ===
                    0 ||
                selection.isCollapsed
            ) {

                showToast(
                    "Select text first",
                    "Highlight the text you want to turn into a link.",
                    "warning"
                );

                return;
            }

            const url =
                window.prompt(
                    "Enter the full link URL:"
                );

            if (!url) {

                return;
            }

            let normalizedUrl =
                url.trim();

            if (
                !/^(https?:\/\/|mailto:|tel:)/i
                    .test(
                        normalizedUrl
                    )
            ) {

                normalizedUrl =
                    `https://${normalizedUrl}`;
            }

            document.execCommand(
                "createLink",
                false,
                normalizedUrl
            );

            updateArticleSummary();

            return;
        }

        document.execCommand(
            command,
            false,
            null
        );

        updateArticleSummary();
    }


    /* =====================================================
       CLEAR ARTICLE FORMATTING
    ====================================================== */

    function clearArticleFormatting() {

        elements.newsContentEditor
            .focus();

        const selection =
            window.getSelection();

        if (
            selection &&
            !selection.isCollapsed
        ) {

            document.execCommand(
                "removeFormat",
                false,
                null
            );

            document.execCommand(
                "unlink",
                false,
                null
            );

        } else {

            const plainText =
                stripHtml(
                    elements.newsContentEditor
                        .innerHTML
                );

            elements.newsContentEditor.textContent =
                plainText;
        }

        updateArticleSummary();

        showToast(
            "Formatting cleared",
            "Article formatting was removed.",
            "info"
        );
    }


    /* =====================================================
       RICH TEXT EDITOR KEYBOARD SHORTCUTS
    ====================================================== */

    function handleEditorKeyboardShortcuts(
        event
    ) {

        if (
            !event.ctrlKey &&
            !event.metaKey
        ) {

            return;
        }

        const key =
            event.key
                .toLowerCase();

        if (
            key === "b"
        ) {

            event.preventDefault();

            executeEditorCommand(
                "bold"
            );

            return;
        }

        if (
            key === "i"
        ) {

            event.preventDefault();

            executeEditorCommand(
                "italic"
            );

            return;
        }

        if (
            key === "k"
        ) {

            event.preventDefault();

            executeEditorCommand(
                "createLink"
            );
        }
    }


    /* =====================================================
       CLEAN PASTED RICH TEXT
    ====================================================== */

    function handleEditorPaste(
        event
    ) {

        event.preventDefault();

        const clipboardData =
            event.clipboardData ||
            window.clipboardData;

        const plainText =
            clipboardData.getData(
                "text/plain"
            );

        document.execCommand(
            "insertText",
            false,
            plainText
        );

        updateArticleSummary();
    }


    /* =====================================================
       IMAGE FILE VALIDATION
    ====================================================== */

    function validateImageFile(
        file
    ) {

        if (!file) {

            return false;
        }

        if (
            !ALLOWED_IMAGE_TYPES.has(
                file.type
            )
        ) {

            showToast(
                "Unsupported image",
                "Choose a JPG, PNG or WebP image.",
                "error"
            );

            elements.newsImageUpload
                .classList
                .add("has-error");

            return false;
        }

        if (
            file.size >
            MAX_IMAGE_SIZE
        ) {

            showToast(
                "Image is too large",
                "The featured image must be 5 MB or smaller.",
                "error"
            );

            elements.newsImageUpload
                .classList
                .add("has-error");

            return false;
        }

        elements.newsImageUpload
            .classList
            .remove("has-error");

        return true;
    }


    /* =====================================================
       LOAD SELECTED IMAGE
    ====================================================== */

    function loadSelectedImage(
        file
    ) {

        if (
            !validateImageFile(
                file
            )
        ) {

            elements.newsImageInput.value =
                "";

            return;
        }

        revokeCurrentImageObjectUrl();

        const objectUrl =
            URL.createObjectURL(
                file
            );

        state.imageObjectUrl =
            objectUrl;

        const reader =
            new FileReader();

        elements.newsImageUpload
            .classList
            .add("is-loading");

        reader.onload = event => {

            const dataUrl =
                String(
                    event.target
                        ?.result ||
                    ""
                );

            state.imageDataUrl =
                dataUrl;

            elements.newsImagePreviewElement.src =
                objectUrl;

            elements.newsImagePlaceholder.hidden =
                true;

            elements.newsImagePreview.hidden =
                false;

            elements.newsImageUpload
                .classList
                .remove(
                    "is-loading",
                    "has-error"
                );

            elements.newsImageUpload
                .classList
                .add("has-image");

            showToast(
                "Image selected",
                "The featured image is ready.",
                "success"
            );
        };

        reader.onerror = () => {

            elements.newsImageUpload
                .classList
                .remove("is-loading");

            resetFeaturedImage();

            showToast(
                "Image could not be read",
                "Please choose the image again.",
                "error"
            );
        };

        reader.readAsDataURL(
            file
        );
    }


    /* =====================================================
       IMAGE INPUT CHANGE
    ====================================================== */

    function handleImageInputChange() {

        const file =
            elements.newsImageInput
                .files?.[0];

        if (!file) {

            return;
        }

        loadSelectedImage(
            file
        );
    }


    /* =====================================================
       REMOVE FEATURED IMAGE
    ====================================================== */

    function removeFeaturedImage() {

        resetFeaturedImage();

        showToast(
            "Image removed",
            "The featured image was removed from the article.",
            "info"
        );
    }


    /* =====================================================
       IMAGE DRAG AND DROP
    ====================================================== */

    function preventImageDragDefaults(
        event
    ) {

        event.preventDefault();

        event.stopPropagation();
    }


    function handleImageDragEnter(
        event
    ) {

        preventImageDragDefaults(
            event
        );

        elements.newsImageUpload
            .classList
            .add("is-dragging");
    }


    function handleImageDragLeave(
        event
    ) {

        preventImageDragDefaults(
            event
        );

        if (
            event.currentTarget
                .contains(
                    event.relatedTarget
                )
        ) {

            return;
        }

        elements.newsImageUpload
            .classList
            .remove("is-dragging");
    }


    function handleImageDrop(
        event
    ) {

        preventImageDragDefaults(
            event
        );

        elements.newsImageUpload
            .classList
            .remove("is-dragging");

        const file =
            event.dataTransfer
                ?.files?.[0];

        if (!file) {

            return;
        }

        loadSelectedImage(
            file
        );
    }


    /* =====================================================
       BULK ACTION GUARD
    ====================================================== */

    function getSelectedArticleIds() {

        return Array.from(
            state.selectedIds
        ).filter(id =>
            Boolean(
                getArticleById(id)
            )
        );
    }


    function requireSelectedArticles() {

        const selectedIds =
            getSelectedArticleIds();

        if (
            selectedIds.length === 0
        ) {

            showToast(
                "No articles selected",
                "Select at least one article before using a bulk action.",
                "warning"
            );

            return null;
        }

        return selectedIds;
    }


    /* =====================================================
       BULK PUBLISH ARTICLES
    ====================================================== */

    function bulkPublishArticles() {

        const selectedIds =
            requireSelectedArticles();

        if (!selectedIds) {

            return;
        }

        const selectedSet =
            new Set(
                selectedIds
            );

        const today =
            toIsoDate(
                new Date()
            );

        state.articles =
            state.articles.map(article => {

                if (
                    !selectedSet.has(
                        article.id
                    )
                ) {

                    return article;
                }

                return {

                    ...article,

                    status:
                        "published",

                    publishDate:
                        article.publishDate ||
                        today,

                    updatedAt:
                        new Date()
                            .toISOString()
                };
            });

        saveArticles();

        clearSelectedArticles();

        renderTable();

        showToast(
            "Articles published",
            `${selectedIds.length} article${
                selectedIds.length === 1
                    ? ""
                    : "s"
            } published successfully.`,
            "success"
        );
    }


    /* =====================================================
       BULK ARCHIVE ARTICLES
    ====================================================== */

    function bulkArchiveArticles() {

        const selectedIds =
            requireSelectedArticles();

        if (!selectedIds) {

            return;
        }

        const selectedSet =
            new Set(
                selectedIds
            );

        state.articles =
            state.articles.map(article => {

                if (
                    !selectedSet.has(
                        article.id
                    )
                ) {

                    return article;
                }

                return {

                    ...article,

                    status:
                        "archived",

                    featured:
                        false,

                    updatedAt:
                        new Date()
                            .toISOString()
                };
            });

        saveArticles();

        clearSelectedArticles();

        renderTable();

        showToast(
            "Articles archived",
            `${selectedIds.length} article${
                selectedIds.length === 1
                    ? ""
                    : "s"
            } moved to the archive.`,
            "success"
        );
    }


    /* =====================================================
       BULK DELETE ARTICLES
    ====================================================== */

    function bulkDeleteArticles() {

        const selectedIds =
            requireSelectedArticles();

        if (!selectedIds) {

            return;
        }

        openDeleteModal(
            selectedIds
        );
    }
        /* =====================================================
       CSV VALUE ESCAPING
    ====================================================== */

    function escapeCsvValue(
        value
    ) {

        const text =
            String(
                value ?? ""
            );

        if (
            text.includes(",") ||
            text.includes('"') ||
            text.includes("\n") ||
            text.includes("\r")
        ) {

            return `"${text.replace(
                /"/g,
                '""'
            )}"`;
        }

        return text;
    }


    /* =====================================================
       BUILD CSV CONTENT
    ====================================================== */

    function buildNewsCsv() {

        const headers = [

            "Article ID",

            "Title",

            "Slug",

            "Category",

            "Author",

            "Status",

            "Publish Date",

            "Publish Time",

            "Featured",

            "Views",

            "Excerpt",

            "SEO Title",

            "SEO Description",

            "Keywords"
        ];

        const rows =
            state.filteredArticles.length
                ? state.filteredArticles
                : state.articles;

        const csvRows = [

            headers.map(
                escapeCsvValue
            ).join(","),

            ...rows.map(article => [

                article.id,

                article.title,

                article.slug,

                categoryLabels[
                    article.category
                ] || article.category,

                article.author,

                article.status,

                article.publishDate,

                article.publishTime,

                article.featured
                    ? "Yes"
                    : "No",

                article.views,

                article.excerpt,

                article.seoTitle,

                article.seoDescription,

                article.keywords

            ]
                .map(
                    escapeCsvValue
                )
                .join(",")
            )
        ];

        return csvRows.join(
            "\r\n"
        );
    }


    /* =====================================================
       DOWNLOAD TEXT FILE
    ====================================================== */

    function downloadTextFile(
        fileName,
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

        link.hidden =
            true;

        document.body.appendChild(
            link
        );

        link.click();

        link.remove();

        window.setTimeout(() => {

            URL.revokeObjectURL(
                objectUrl
            );

        }, 1000);
    }


    /* =====================================================
       EXPORT ARTICLES AS CSV
    ====================================================== */

    function exportArticlesAsCsv() {

        if (
            state.articles.length === 0
        ) {

            showToast(
                "No articles available",
                "There are no articles to export.",
                "warning"
            );

            return;
        }

        setButtonLoading(
            elements.exportCsvButton,
            true
        );

        window.setTimeout(() => {

            const csv =
                buildNewsCsv();

            const date =
                toIsoDate(
                    new Date()
                );

            downloadTextFile(
                `bff-news-${date}.csv`,
                `\uFEFF${csv}`,
                "text/csv;charset=utf-8"
            );

            setButtonLoading(
                elements.exportCsvButton,
                false
            );

            showToast(
                "CSV exported",
                "The news article report has been exported.",
                "success"
            );

        }, 350);
    }


    /* =====================================================
       CREATE PRINT REPORT HTML
    ====================================================== */

    function buildPrintableNewsReport() {

        const articles =
            state.filteredArticles.length
                ? state.filteredArticles
                : state.articles;

        const generatedAt =
            new Intl.DateTimeFormat(
                "en-IN",
                {
                    dateStyle:
                        "medium",

                    timeStyle:
                        "short"
                }
            ).format(
                new Date()
            );

        const tableRows =
            articles.map(
                (
                    article,
                    index
                ) => `
                    <tr>

                        <td>
                            ${index + 1}
                        </td>

                        <td>
                            ${escapeHtml(article.title)}
                        </td>

                        <td>
                            ${escapeHtml(
                                categoryLabels[
                                    article.category
                                ] ||
                                article.category
                            )}
                        </td>

                        <td>
                            ${escapeHtml(article.author)}
                        </td>

                        <td>
                            ${escapeHtml(article.status)}
                        </td>

                        <td>
                            ${escapeHtml(
                                formatDate(
                                    article.publishDate
                                )
                            )}
                        </td>

                        <td>
                            ${escapeHtml(
                                formatViews(
                                    article.views
                                )
                            )}
                        </td>

                        <td>
                            ${
                                article.featured
                                    ? "Yes"
                                    : "No"
                            }
                        </td>

                    </tr>
                `
            ).join("");

        return `
            <!DOCTYPE html>

            <html lang="en">

            <head>

                <meta charset="UTF-8">

                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1.0"
                >

                <title>
                    Bharat Football Fans News Report
                </title>

                <style>

                    * {
                        box-sizing: border-box;
                    }

                    body {
                        margin: 0;
                        padding: 32px;
                        color: #172033;
                        font-family: Arial, sans-serif;
                        background: #ffffff;
                    }

                    .report-header {
                        display: flex;
                        align-items: flex-start;
                        justify-content: space-between;
                        gap: 24px;
                        margin-bottom: 28px;
                        padding-bottom: 20px;
                        border-bottom: 2px solid #172033;
                    }

                    .report-header h1 {
                        margin: 0 0 8px;
                        font-size: 25px;
                    }

                    .report-header p {
                        margin: 0;
                        color: #667085;
                        font-size: 13px;
                    }

                    .report-badge {
                        padding: 8px 12px;
                        border: 1px solid #d0d5dd;
                        border-radius: 8px;
                        font-size: 12px;
                        font-weight: 700;
                    }

                    .report-summary {
                        display: grid;
                        grid-template-columns: repeat(5, 1fr);
                        gap: 12px;
                        margin-bottom: 25px;
                    }

                    .summary-card {
                        padding: 14px;
                        border: 1px solid #d0d5dd;
                        border-radius: 8px;
                    }

                    .summary-card strong {
                        display: block;
                        margin-bottom: 4px;
                        font-size: 21px;
                    }

                    .summary-card span {
                        color: #667085;
                        font-size: 11px;
                    }

                    table {
                        width: 100%;
                        border-collapse: collapse;
                        font-size: 11px;
                    }

                    th,
                    td {
                        padding: 9px;
                        border: 1px solid #d0d5dd;
                        text-align: left;
                        vertical-align: top;
                    }

                    th {
                        color: #ffffff;
                        background: #172033;
                    }

                    tr:nth-child(even) {
                        background: #f8fafc;
                    }

                    .report-footer {
                        margin-top: 24px;
                        color: #667085;
                        font-size: 10px;
                        text-align: center;
                    }

                    @media print {

                        body {
                            padding: 12px;
                        }

                        .report-summary {
                            grid-template-columns: repeat(5, 1fr);
                        }

                        @page {
                            size: landscape;
                            margin: 12mm;
                        }
                    }

                </style>

            </head>

            <body>

                <header class="report-header">

                    <div>

                        <h1>
                            Bharat Football Fans
                        </h1>

                        <p>
                            Admin News Management Report
                        </p>

                        <p>
                            Generated ${escapeHtml(generatedAt)}
                        </p>

                    </div>

                    <span class="report-badge">
                        ${
                            articles.length
                        } Articles
                    </span>

                </header>

                <section class="report-summary">

                    <div class="summary-card">

                        <strong>
                            ${state.articles.length}
                        </strong>

                        <span>
                            Total Articles
                        </span>

                    </div>

                    <div class="summary-card">

                        <strong>
                            ${
                                state.articles.filter(
                                    article =>
                                        article.status ===
                                        "published"
                                ).length
                            }
                        </strong>

                        <span>
                            Published
                        </span>

                    </div>

                    <div class="summary-card">

                        <strong>
                            ${
                                state.articles.filter(
                                    article =>
                                        article.status ===
                                        "draft"
                                ).length
                            }
                        </strong>

                        <span>
                            Drafts
                        </span>

                    </div>

                    <div class="summary-card">

                        <strong>
                            ${
                                state.articles.filter(
                                    article =>
                                        article.featured
                                ).length
                            }
                        </strong>

                        <span>
                            Featured
                        </span>

                    </div>

                    <div class="summary-card">

                        <strong>
                            ${
                                state.articles.filter(
                                    article =>
                                        article.status ===
                                        "archived"
                                ).length
                            }
                        </strong>

                        <span>
                            Archived
                        </span>

                    </div>

                </section>

                <table>

                    <thead>

                        <tr>

                            <th>
                                #
                            </th>

                            <th>
                                Article
                            </th>

                            <th>
                                Category
                            </th>

                            <th>
                                Author
                            </th>

                            <th>
                                Status
                            </th>

                            <th>
                                Published
                            </th>

                            <th>
                                Views
                            </th>

                            <th>
                                Featured
                            </th>

                        </tr>

                    </thead>

                    <tbody>
                        ${tableRows}
                    </tbody>

                </table>

                <footer class="report-footer">
                    Bharat Football Fans Admin Portal
                </footer>

            </body>

            </html>
        `;
    }


    /* =====================================================
       EXPORT OR PRINT PDF REPORT
    ====================================================== */

    function exportArticlesAsPdf() {

        if (
            state.articles.length === 0
        ) {

            showToast(
                "No articles available",
                "There are no articles to export.",
                "warning"
            );

            return;
        }

        setButtonLoading(
            elements.exportPdfButton,
            true
        );

        const printWindow =
            window.open(
                "",
                "_blank",
                "width=1200,height=800"
            );

        if (!printWindow) {

            setButtonLoading(
                elements.exportPdfButton,
                false
            );

            showToast(
                "Popup blocked",
                "Allow popups to open the printable PDF report.",
                "warning"
            );

            return;
        }

        printWindow.document.open();

        printWindow.document.write(
            buildPrintableNewsReport()
        );

        printWindow.document.close();

        window.setTimeout(() => {

            setButtonLoading(
                elements.exportPdfButton,
                false
            );

            printWindow.focus();

            printWindow.print();

            showToast(
                "PDF report ready",
                "Choose Save as PDF in the print window.",
                "success"
            );

        }, 600);
    }


    /* =====================================================
       LIVE FILTER INPUT DEBOUNCE
    ====================================================== */

    function debounce(
        callback,
        delay = 250
    ) {

        let timeoutId =
            null;

        return (...args) => {

            window.clearTimeout(
                timeoutId
            );

            timeoutId =
                window.setTimeout(
                    () => {

                        callback(
                            ...args
                        );

                    },
                    delay
                );
        };
    }


    const debouncedNewsSearch =
        debounce(
            applyFilters,
            220
        );


    const debouncedGlobalSearch =
        debounce(
            event => {

                renderGlobalSearchResults(
                    event.target.value
                );

            },
            180
        );


    /* =====================================================
       HANDLE GENERAL FORM FIELD CHANGE
    ====================================================== */

    function handleRequiredSelectChange(
        control
    ) {

        if (
            control.value
        ) {

            markFieldValid(
                control
            );

        } else {

            control.closest(
                ".news-field"
            )?.classList.remove(
                "is-valid"
            );
        }
    }


    /* =====================================================
       ESCAPE KEY HANDLER
    ====================================================== */

    function handleEscapeKey(
        event
    ) {

        if (
            event.key !==
            "Escape"
        ) {

            return;
        }

        if (
            !elements.deleteNewsModal
                .hidden
        ) {

            closeDeleteModal();

            return;
        }

        if (
            !elements.previewNewsModal
                .hidden
        ) {

            closeArticlePreview();

            return;
        }

        if (
            !elements.newsFormModal
                .hidden
        ) {

            closeNewsForm();

            return;
        }

        if (
            !elements.logoutModal
                .hidden
        ) {

            closeLogoutModal();

            return;
        }

        if (
            !elements.globalSearchOverlay
                .hidden
        ) {

            closeGlobalSearch();

            return;
        }

        if (
            !elements.notificationsPanel
                .hidden
        ) {

            closeNotifications();

            return;
        }

        if (
            !elements.profileMenu
                .hidden
        ) {

            closeProfileMenu();

            return;
        }

        closeSidebar();
    }


    /* =====================================================
       MODAL FOCUS TRAP
    ====================================================== */

    function trapModalFocus(
        event
    ) {

        if (
            event.key !==
            "Tab"
        ) {

            return;
        }

        const openModalElement =
            $$(".news-modal").find(
                modal =>
                    !modal.hidden
            );

        if (
            !openModalElement
        ) {

            return;
        }

        const focusableElements =
            $$(
                `
                button:not([disabled]),
                input:not([disabled]):not([type="hidden"]),
                select:not([disabled]),
                textarea:not([disabled]),
                [contenteditable="true"],
                a[href],
                [tabindex]:not([tabindex="-1"])
                `,
                openModalElement
            ).filter(element => {

                return (
                    !element.hidden &&
                    element.offsetParent !==
                        null
                );
            });

        if (
            focusableElements.length ===
            0
        ) {

            return;
        }

        const firstElement =
            focusableElements[0];

        const lastElement =
            focusableElements[
                focusableElements.length -
                1
            ];

        if (
            event.shiftKey &&
            document.activeElement ===
                firstElement
        ) {

            event.preventDefault();

            lastElement.focus();

            return;
        }

        if (
            !event.shiftKey &&
            document.activeElement ===
                lastElement
        ) {

            event.preventDefault();

            firstElement.focus();
        }
    }


    /* =====================================================
       GLOBAL KEYBOARD SHORTCUTS
    ====================================================== */

    function handleGlobalKeyboardShortcuts(
        event
    ) {

        const isModifier =
            event.ctrlKey ||
            event.metaKey;

        const key =
            event.key
                .toLowerCase();

        if (
            isModifier &&
            key === "k"
        ) {

            if (
                document.activeElement ===
                elements.newsContentEditor
            ) {

                return;
            }

            event.preventDefault();

            openGlobalSearch();

            return;
        }

        if (
            isModifier &&
            key === "n"
        ) {

            event.preventDefault();

            openCreateNewsForm();

            return;
        }

        if (
            isModifier &&
            key === "s" &&
            !elements.newsFormModal
                .hidden
        ) {

            event.preventDefault();

            saveArticleAsDraft();
        }
    }


    /* =====================================================
       CLICK OUTSIDE PROFILE MENU
    ====================================================== */

    function handleDocumentClick(
        event
    ) {

        const clickedProfileButton =
            elements.profileButton
                ?.contains(
                    event.target
                );

        const clickedProfileMenu =
            elements.profileMenu
                ?.contains(
                    event.target
                );

        if (
            !clickedProfileButton &&
            !clickedProfileMenu &&
            !elements.profileMenu
                ?.hidden
        ) {

            closeProfileMenu();
        }
    }


    /* =====================================================
       WINDOW RESIZE HANDLER
    ====================================================== */

    function handleWindowResize() {

        if (
            window.innerWidth >
            1024
        ) {

            closeSidebar();
        }
    }


    /* =====================================================
       CLOSE BUTTONS FOR NEWS MODALS
    ====================================================== */

    function handleModalCloseButton(
        button
    ) {

        const modal =
            button.closest(
                ".news-modal"
            );

        if (
            modal ===
            elements.previewNewsModal
        ) {

            closeArticlePreview();

            return;
        }

        if (
            modal ===
            elements.newsFormModal
        ) {

            closeNewsForm();

            return;
        }

        if (
            modal ===
            elements.deleteNewsModal
        ) {

            closeDeleteModal();

            return;
        }

        closeModal(
            modal
        );
    }


    /* =====================================================
       CLOSE LOGOUT BUTTONS
    ====================================================== */

    function handleLogoutCloseButton() {

        closeLogoutModal();
    }


    /* =====================================================
       TABLE BODY CLICK EVENT
    ====================================================== */

    function handleNewsTableClick(
        event
    ) {

        handleTableAction(
            event
        );
    }


    /* =====================================================
       TABLE BODY CHANGE EVENT
    ====================================================== */

    function handleNewsTableChange(
        event
    ) {

        const checkbox =
            event.target.closest(
                ".news-checkbox"
            );

        if (!checkbox) {

            return;
        }

        handleArticleCheckboxChange(
            checkbox
        );
    }


    /* =====================================================
       EDITOR TOOLBAR CLICK
    ====================================================== */

    function handleEditorToolbarClick(
        event
    ) {

        const button =
            event.target.closest(
                "[data-editor-command]"
            );

        if (!button) {

            return;
        }

        const command =
            button.dataset.editorCommand;

        if (!command) {

            return;
        }

        executeEditorCommand(
            command
        );
    }


    /* =====================================================
       GLOBAL SEARCH RESULTS CLICK
    ====================================================== */

    function handleGlobalSearchResultsClick(
        event
    ) {

        const resultButton =
            event.target.closest(
                ".admin-global-search-result"
            );

        if (!resultButton) {

            return;
        }

        handleGlobalSearchResult(
            resultButton
        );
    }


    /* =====================================================
       CREATE EVENT LISTENER HELPER
    ====================================================== */

    function listen(
        element,
        eventName,
        handler,
        options
    ) {

        if (
            !element ||
            typeof handler !==
                "function"
        ) {

            return;
        }

        element.addEventListener(
            eventName,
            handler,
            options
        );
    }


    /* =====================================================
       BIND SIDEBAR EVENTS
    ====================================================== */

    function bindSidebarEvents() {

        listen(
            elements.mobileMenuButton,
            "click",
            openSidebar
        );

        listen(
            elements.sidebarCloseButton,
            "click",
            closeSidebar
        );

        listen(
            elements.sidebarOverlay,
            "click",
            closeSidebar
        );
    }


    /* =====================================================
       BIND TOPBAR EVENTS
    ====================================================== */

    function bindTopbarEvents() {

        listen(
            elements.searchButton,
            "click",
            openGlobalSearch
        );

        listen(
            elements.notificationButton,
            "click",
            toggleNotifications
        );

        listen(
            elements.profileButton,
            "click",
            toggleProfileMenu
        );

        listen(
            elements.closeNotificationsButton,
            "click",
            closeNotifications
        );

        listen(
            elements.closeGlobalSearchButton,
            "click",
            closeGlobalSearch
        );

        listen(
            elements.globalSearchInput,
            "input",
            debouncedGlobalSearch
        );

        listen(
            elements.globalSearchResults,
            "click",
            handleGlobalSearchResultsClick
        );
    }


    /* =====================================================
       BIND SEARCH AND FILTER EVENTS
    ====================================================== */

    function bindFilterEvents() {

        listen(
            elements.newsSearchInput,
            "input",
            debouncedNewsSearch
        );

        listen(
            elements.categoryFilter,
            "change",
            applyFilters
        );

        listen(
            elements.statusFilter,
            "change",
            applyFilters
        );

        listen(
            elements.authorFilter,
            "change",
            applyFilters
        );

        listen(
            elements.publishDateFilter,
            "change",
            applyFilters
        );

        listen(
            elements.resetFiltersButton,
            "click",
            resetFilters
        );
    }


    /* =====================================================
       BIND TABLE EVENTS
    ====================================================== */

    function bindTableEvents() {

        listen(
            elements.newsTableBody,
            "click",
            handleNewsTableClick
        );

        listen(
            elements.newsTableBody,
            "change",
            handleNewsTableChange
        );

        listen(
            elements.selectAllNews,
            "change",
            handleSelectAllChange
        );

        listen(
            elements.previousPageButton,
            "click",
            goToPreviousPage
        );

        listen(
            elements.nextPageButton,
            "click",
            goToNextPage
        );
    }


    /* =====================================================
       BIND BULK AND EXPORT EVENTS
    ====================================================== */

    function bindBulkActionEvents() {

        listen(
            elements.bulkPublishButton,
            "click",
            bulkPublishArticles
        );

        listen(
            elements.bulkArchiveButton,
            "click",
            bulkArchiveArticles
        );

        listen(
            elements.bulkDeleteButton,
            "click",
            bulkDeleteArticles
        );

        listen(
            elements.exportCsvButton,
            "click",
            exportArticlesAsCsv
        );

        listen(
            elements.exportPdfButton,
            "click",
            exportArticlesAsPdf
        );
    }


    /* =====================================================
       BIND FORM FIELD EVENTS
    ====================================================== */

    function bindFormFieldEvents() {

        listen(
            elements.newsTitle,
            "input",
            handleTitleInput
        );

        listen(
            elements.newsSlug,
            "input",
            handleSlugInput
        );

        listen(
            elements.newsSlug,
            "blur",
            handleSlugBlur
        );

        listen(
            elements.newsExcerpt,
            "input",
            handleExcerptInput
        );

        listen(
            elements.newsSeoTitle,
            "input",
            handleSeoTitleInput
        );

        listen(
            elements.newsSeoDescription,
            "input",
            handleSeoDescriptionInput
        );

        listen(
            elements.newsContentEditor,
            "input",
            handleContentInput
        );

        listen(
            elements.newsContentEditor,
            "keydown",
            handleEditorKeyboardShortcuts
        );

        listen(
            elements.newsContentEditor,
            "paste",
            handleEditorPaste
        );

        listen(
            elements.newsStatus,
            "change",
            updateScheduleField
        );

        listen(
            elements.newsCategory,
            "change",
            () => {

                handleRequiredSelectChange(
                    elements.newsCategory
                );
            }
        );

        listen(
            elements.newsAuthor,
            "change",
            () => {

                handleRequiredSelectChange(
                    elements.newsAuthor
                );
            }
        );

        listen(
            $(".news-editor-toolbar"),
            "click",
            handleEditorToolbarClick
        );

        listen(
            elements.clearArticleFormattingButton,
            "click",
            clearArticleFormatting
        );
    }
        /* =====================================================
       BIND IMAGE UPLOAD EVENTS
    ====================================================== */

    function bindImageEvents() {

        listen(
            elements.chooseNewsImageButton,
            "click",
            () => {

                elements.newsImageInput
                    ?.click();
            }
        );

        listen(
            elements.replaceNewsImageButton,
            "click",
            () => {

                elements.newsImageInput
                    ?.click();
            }
        );

        listen(
            elements.removeNewsImageButton,
            "click",
            removeFeaturedImage
        );

        listen(
            elements.newsImageInput,
            "change",
            handleImageInputChange
        );

        listen(
            elements.newsImageUpload,
            "dragenter",
            handleImageDragEnter
        );

        listen(
            elements.newsImageUpload,
            "dragover",
            preventImageDragDefaults
        );

        listen(
            elements.newsImageUpload,
            "dragleave",
            handleImageDragLeave
        );

        listen(
            elements.newsImageUpload,
            "drop",
            handleImageDrop
        );

        listen(
            elements.newsImageUpload,
            "click",
            event => {

                const clickedControl =
                    event.target.closest(
                        "button"
                    );

                if (
                    clickedControl
                ) {

                    return;
                }

                elements.newsImageInput
                    ?.click();
            }
        );

        listen(
            elements.newsImageUpload,
            "keydown",
            event => {

                if (
                    event.key !== "Enter" &&
                    event.key !== " "
                ) {

                    return;
                }

                event.preventDefault();

                elements.newsImageInput
                    ?.click();
            }
        );
    }


    /* =====================================================
       BIND ARTICLE FORM EVENTS
    ====================================================== */

    function bindNewsFormEvents() {

        listen(
            elements.createNewsButton,
            "click",
            openCreateNewsForm
        );

        listen(
            elements.newsForm,
            "submit",
            handleNewsFormSubmit
        );

        listen(
            elements.saveNewsDraftButton,
            "click",
            saveArticleAsDraft
        );

        listen(
            elements.previewFormNewsButton,
            "click",
            previewCurrentFormArticle
        );

        listen(
            elements.editFromPreviewButton,
            "click",
            editArticleFromPreview
        );

        listen(
            elements.confirmDeleteNewsButton,
            "click",
            confirmArticleDeletion
        );
    }


    /* =====================================================
       BIND MODAL EVENTS
    ====================================================== */

    function bindModalEvents() {

        $$(
            "[data-modal-close]"
        ).forEach(button => {

            listen(
                button,
                "click",
                () => {

                    handleModalCloseButton(
                        button
                    );
                }
            );
        });

        $$(
            ".news-modal"
        ).forEach(modal => {

            listen(
                modal,
                "click",
                event => {

                    if (
                        event.target !==
                        modal
                    ) {

                        return;
                    }

                    if (
                        modal ===
                        elements.newsFormModal
                    ) {

                        closeNewsForm();

                        return;
                    }

                    if (
                        modal ===
                        elements.previewNewsModal
                    ) {

                        closeArticlePreview();

                        return;
                    }

                    if (
                        modal ===
                        elements.deleteNewsModal
                    ) {

                        closeDeleteModal();

                        return;
                    }

                    if (
                        modal ===
                        elements.logoutModal
                    ) {

                        closeLogoutModal();
                    }
                }
            );
        });

        $$(
            "[data-close-modal]"
        ).forEach(button => {

            listen(
                button,
                "click",
                () => {

                    const modal =
                        button.closest(
                            ".news-modal"
                        );

                    if (
                        modal ===
                        elements.newsFormModal
                    ) {

                        closeNewsForm();

                        return;
                    }

                    if (
                        modal ===
                        elements.previewNewsModal
                    ) {

                        closeArticlePreview();

                        return;
                    }

                    if (
                        modal ===
                        elements.deleteNewsModal
                    ) {

                        closeDeleteModal();

                        return;
                    }

                    if (
                        modal ===
                        elements.logoutModal
                    ) {

                        closeLogoutModal();
                    }
                }
            );
        });
    }


    /* =====================================================
       BIND LOGOUT EVENTS
    ====================================================== */

    function bindLogoutEvents() {

        listen(
            elements.logoutButton,
            "click",
            openLogoutModal
        );

        listen(
            elements.profileLogoutButton,
            "click",
            openLogoutModal
        );

        listen(
            elements.confirmLogoutButton,
            "click",
            confirmLogout
        );

        $$(
            "[data-logout-close]"
        ).forEach(button => {

            listen(
                button,
                "click",
                handleLogoutCloseButton
            );
        });
    }


    /* =====================================================
       BIND NOTIFICATION ACTIONS
    ====================================================== */

    function bindNotificationEvents() {

        const markAllReadButton =
            $(
                "[data-mark-notifications-read]"
            );

        listen(
            markAllReadButton,
            "click",
            () => {

                $$(
                    ".admin-notification-item"
                ).forEach(item => {

                    item.classList.remove(
                        "is-unread",
                        "unread"
                    );
                });

                if (
                    elements.notificationCount
                ) {

                    elements.notificationCount
                        .textContent = "0";

                    elements.notificationCount
                        .hidden = true;
                }

                showToast(
                    "Notifications updated",
                    "All notifications have been marked as read.",
                    "success"
                );
            }
        );

        listen(
            elements.notificationsPanel,
            "click",
            event => {

                const notification =
                    event.target.closest(
                        ".admin-notification-item"
                    );

                if (
                    !notification
                ) {

                    return;
                }

                notification.classList.remove(
                    "is-unread",
                    "unread"
                );
            }
        );
    }


    /* =====================================================
       UPDATE AUTHOR FILTER OPTIONS
    ====================================================== */

    function updateAuthorFilterOptions() {

        if (
            !elements.authorFilter
        ) {

            return;
        }

        const currentValue =
            elements.authorFilter.value;

        const authors =
            Array.from(
                new Set(
                    state.articles
                        .map(
                            article =>
                                article.author
                                    ?.trim()
                        )
                        .filter(Boolean)
                )
            ).sort(
                (
                    firstAuthor,
                    secondAuthor
                ) => {

                    return firstAuthor.localeCompare(
                        secondAuthor
                    );
                }
            );

        elements.authorFilter.innerHTML = `
            <option value="all">
                All Authors
            </option>

            ${authors.map(author => `
                <option
                    value="${escapeHtml(
                        normalizeAuthor(
                            author
                        )
                    )}"
                >
                    ${escapeHtml(author)}
                </option>
            `).join("")}
        `;

        const optionExists =
            Array.from(
                elements.authorFilter
                    .options
            ).some(option => {

                return (
                    option.value ===
                    currentValue
                );
            });

        elements.authorFilter.value =
            optionExists
                ? currentValue
                : "all";
    }


    /* =====================================================
       ENSURE MODALS START CLOSED
    ====================================================== */

    function initializeHiddenInterfaces() {

        const hiddenElements = [

            elements.profileMenu,

            elements.notificationsPanel,

            elements.globalSearchOverlay,

            elements.previewNewsModal,

            elements.newsFormModal,

            elements.deleteNewsModal,

            elements.logoutModal,

            elements.sidebarOverlay

        ];

        hiddenElements.forEach(
            element => {

                if (
                    element
                ) {

                    element.hidden =
                        true;

                    element.classList.remove(
                        "is-open"
                    );
                }
            }
        );

        elements.profileButton
            ?.setAttribute(
                "aria-expanded",
                "false"
            );

        elements.mobileMenuButton
            ?.setAttribute(
                "aria-expanded",
                "false"
            );

        document.body.classList.remove(
            "modal-open",
            "panel-open",
            "sidebar-open"
        );
    }


    /* =====================================================
       PREPARE IMAGE UPLOAD ACCESSIBILITY
    ====================================================== */

    function initializeImageUploadArea() {

        if (
            !elements.newsImageUpload
        ) {

            return;
        }

        if (
            !elements.newsImageUpload
                .hasAttribute(
                    "tabindex"
                )
        ) {

            elements.newsImageUpload
                .setAttribute(
                    "tabindex",
                    "0"
                );
        }

        elements.newsImageUpload
            .setAttribute(
                "role",
                "button"
            );

        elements.newsImageUpload
            .setAttribute(
                "aria-label",
                "Upload featured news image"
            );
    }


    /* =====================================================
       PREPARE CONTENT EDITOR
    ====================================================== */

    function initializeContentEditor() {

        if (
            !elements.newsContentEditor
        ) {

            return;
        }

        elements.newsContentEditor
            .setAttribute(
                "contenteditable",
                "true"
            );

        elements.newsContentEditor
            .setAttribute(
                "role",
                "textbox"
            );

        elements.newsContentEditor
            .setAttribute(
                "aria-multiline",
                "true"
            );

        elements.newsContentEditor
            .setAttribute(
                "spellcheck",
                "true"
            );

        if (
            !elements.newsContentEditor
                .hasAttribute(
                    "tabindex"
                )
        ) {

            elements.newsContentEditor
                .setAttribute(
                    "tabindex",
                    "0"
                );
        }
    }


    /* =====================================================
       HANDLE LOADING SCREEN
    ====================================================== */

    function hideLoadingScreen() {

        if (
            !elements.loadingScreen
        ) {

            return;
        }

        elements.loadingScreen
            .classList
            .add(
                "is-hidden"
            );

        window.setTimeout(() => {

            elements.loadingScreen.hidden =
                true;

        }, 400);
    }


    /* =====================================================
       REMOVE INVALID SELECTED IDS
    ====================================================== */

    function cleanSelectedArticleIds() {

        const existingIds =
            new Set(
                state.articles.map(
                    article =>
                        article.id
                )
            );

        state.selectedIds.forEach(
            articleId => {

                if (
                    !existingIds.has(
                        articleId
                    )
                ) {

                    state.selectedIds.delete(
                        articleId
                    );
                }
            }
        );
    }


    /* =====================================================
       NORMALIZE LOADED ARTICLES
    ====================================================== */

    function normalizeLoadedArticles() {

        state.articles =
            state.articles.map(
                article => {

                    const now =
                        new Date()
                            .toISOString();

                    const title =
                        String(
                            article.title ||
                            "Untitled Article"
                        ).trim();

                    return {

                        id:
                            article.id ||
                            generateId(),

                        title,

                        slug:
                            article.slug ||
                            slugify(title),

                        excerpt:
                            article.excerpt ||
                            "",

                        content:
                            article.content ||
                            "",

                        category:
                            article.category ||
                            "announcement",

                        author:
                            article.author ||
                            "Admin",

                        status:
                            [
                                "draft",
                                "published",
                                "scheduled",
                                "archived"
                            ].includes(
                                article.status
                            )
                                ? article.status
                                : "draft",

                        publishDate:
                            article.publishDate ||
                            toIsoDate(
                                new Date()
                            ),

                        publishTime:
                            article.publishTime ||
                            "09:00",

                        featured:
                            Boolean(
                                article.featured
                            ),

                        allowSharing:
                            article.allowSharing !==
                            false,

                        allowComments:
                            Boolean(
                                article.allowComments
                            ),

                        views:
                            Number.isFinite(
                                Number(
                                    article.views
                                )
                            )
                                ? Number(
                                    article.views
                                )
                                : 0,

                        image:
                            article.image ||
                            "",

                        seoTitle:
                            article.seoTitle ||
                            "",

                        seoDescription:
                            article.seoDescription ||
                            "",

                        keywords:
                            article.keywords ||
                            "",

                        createdAt:
                            article.createdAt ||
                            now,

                        updatedAt:
                            article.updatedAt ||
                            now
                    };
                }
            );
    }


    /* =====================================================
       BIND DOCUMENT AND WINDOW EVENTS
    ====================================================== */

    function bindGlobalEvents() {

        listen(
            document,
            "click",
            handleDocumentClick
        );

        listen(
            document,
            "keydown",
            handleEscapeKey
        );

        listen(
            document,
            "keydown",
            trapModalFocus
        );

        listen(
            document,
            "keydown",
            handleGlobalKeyboardShortcuts
        );

        listen(
            window,
            "resize",
            debounce(
                handleWindowResize,
                120
            )
        );

        listen(
            window,
            "beforeunload",
            revokeCurrentImageObjectUrl
        );
    }


    /* =====================================================
       BIND ALL EVENTS
    ====================================================== */

    function bindAllEvents() {

        bindSidebarEvents();

        bindTopbarEvents();

        bindFilterEvents();

        bindTableEvents();

        bindBulkActionEvents();

        bindFormFieldEvents();

        bindImageEvents();

        bindNewsFormEvents();

        bindModalEvents();

        bindLogoutEvents();

        bindNotificationEvents();

        bindGlobalEvents();
    }


    /* =====================================================
       APPLICATION INITIALIZATION
    ====================================================== */

    function initializeAdminNews() {

        initializeHiddenInterfaces();

        initializeImageUploadArea();

        initializeContentEditor();

        loadArticles();

        normalizeLoadedArticles();

        cleanSelectedArticleIds();

        captureBaseStats();

        updateAuthorFilterOptions();

        resetNewsForm();

        bindAllEvents();

        renderTable();

        window.setTimeout(
            hideLoadingScreen,
            450
        );
    }


    /* =====================================================
       START APPLICATION
    ====================================================== */

    if (
        document.readyState ===
        "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            initializeAdminNews,
            {
                once: true
            }
        );

    } else {

        initializeAdminNews();
    }

})();