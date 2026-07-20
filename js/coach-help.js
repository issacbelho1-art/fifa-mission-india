/* ======================================================
   DOM REFERENCES
====================================================== */

const coachSidebar =
document.getElementById(
    "coachSidebar"
);

const coachSidebarOverlay =
document.getElementById(
    "coachSidebarOverlay"
);

const coachMenuToggle =
document.getElementById(
    "coachMenuToggle"
);

const coachSidebarClose =
document.getElementById(
    "coachSidebarClose"
);

const coachNotificationButton =
document.getElementById(
    "coachNotificationButton"
);

const coachNotificationPanel =
document.getElementById(
    "coachNotificationPanel"
);

const coachProfileButton =
document.getElementById(
    "coachProfileButton"
);

const coachProfileDropdown =
document.getElementById(
    "coachProfileDropdown"
);

const coachLogoutButton =
document.getElementById(
    "coachLogoutButton"
);

const coachProfileLogoutButton =
document.getElementById(
    "coachProfileLogoutButton"
);

const coachToast =
document.getElementById(
    "coachToast"
);

const closeCoachToastButton =
document.getElementById(
    "closeCoachToastButton"
);

const coachSupportForm =
document.getElementById(
    "coachSupportForm"
);

const coachSupportSuccessModal =
document.getElementById(
    "coachSupportSuccessModal"
);

const closeSupportSuccessModal =
document.getElementById(
    "closeSupportSuccessModal"
);

const coachHelpSearchForm =
document.getElementById(
    "coachHelpSearchForm"
);

const coachHelpSearchInput =
document.getElementById(
    "coachHelpSearchInput"
);

const coachHelpSearchResults =
document.getElementById(
    "coachHelpSearchResults"
);

const coachHelpResultsGrid =
document.getElementById(
    "coachHelpResultsGrid"
);

const coachClearHelpSearch =
document.getElementById(
    "coachClearHelpSearch"
);

const popularSearchButtons =
document.querySelectorAll(
    "[data-help-search]"
);

const categoryButtons =
document.querySelectorAll(
    "[data-help-category]"
);

const faqButtons =
document.querySelectorAll(
    ".coach-faq-question"
);

const markAllNotificationsButton =
document.getElementById(
    "markAllNotificationsButton"
);

const notificationItems =
document.querySelectorAll(
    ".coach-notification-item"
);



/* ======================================================
   APPLICATION STATE
====================================================== */

let toastTimer = null;



/* ======================================================
   SIDEBAR
====================================================== */

function openSidebar() {

    coachSidebar?.classList.add(
        "active"
    );

    coachSidebarOverlay?.classList.add(
        "active"
    );

    document.body.classList.add(
        "coach-sidebar-open"
    );

}

function closeSidebar() {

    coachSidebar?.classList.remove(
        "active"
    );

    coachSidebarOverlay?.classList.remove(
        "active"
    );

    document.body.classList.remove(
        "coach-sidebar-open"
    );

}

coachMenuToggle?.addEventListener(
    "click",
    openSidebar
);

coachSidebarClose?.addEventListener(
    "click",
    closeSidebar
);

coachSidebarOverlay?.addEventListener(
    "click",
    closeSidebar
);



/* ======================================================
   PROFILE DROPDOWN
====================================================== */

function closeProfileDropdown() {

    if (!coachProfileDropdown) return;

    coachProfileDropdown.hidden = true;

    coachProfileButton?.setAttribute(
        "aria-expanded",
        "false"
    );

}

function toggleProfileDropdown() {

    if (!coachProfileDropdown) return;

    const isHidden =
        coachProfileDropdown.hidden;

    closeNotificationPanel();

    coachProfileDropdown.hidden =
        !isHidden;

    coachProfileButton?.setAttribute(
        "aria-expanded",
        String(isHidden)
    );

}

coachProfileButton?.addEventListener(
    "click",
    toggleProfileDropdown
);



/* ======================================================
   NOTIFICATION PANEL
====================================================== */

function closeNotificationPanel() {

    if (!coachNotificationPanel) return;

    coachNotificationPanel.hidden =
        true;

    coachNotificationButton?.setAttribute(
        "aria-expanded",
        "false"
    );

}

function toggleNotificationPanel() {

    if (!coachNotificationPanel) return;

    const isHidden =
        coachNotificationPanel.hidden;

    closeProfileDropdown();

    coachNotificationPanel.hidden =
        !isHidden;

    coachNotificationButton?.setAttribute(
        "aria-expanded",
        String(isHidden)
    );

}

coachNotificationButton?.addEventListener(
    "click",
    toggleNotificationPanel
);



/* ======================================================
   CLOSE PANELS OUTSIDE
====================================================== */

document.addEventListener(
    "click",
    event => {

        if (
            coachProfileButton &&
            !coachProfileButton.contains(event.target) &&
            coachProfileDropdown &&
            !coachProfileDropdown.contains(event.target)
        ) {

            closeProfileDropdown();

        }

        if (
            coachNotificationButton &&
            !coachNotificationButton.contains(event.target) &&
            coachNotificationPanel &&
            !coachNotificationPanel.contains(event.target)
        ) {

            closeNotificationPanel();

        }

    }
);



/* ======================================================
   ESC KEY
====================================================== */

document.addEventListener(
    "keydown",
    event => {

        if (event.key !== "Escape") return;

        closeSidebar();

        closeProfileDropdown();

        closeNotificationPanel();

    }
);

/* ======================================================
   TOAST SYSTEM
====================================================== */

function showToast(
    title,
    message,
    type = "success"
) {

    if (!coachToast) return;

    window.clearTimeout(
        toastTimer
    );

    const toastIcon =
        coachToast.querySelector(
            ".coach-toast-icon"
        );

    const toastTitle =
        coachToast.querySelector(
            ".coach-toast-content strong"
        );

    const toastMessage =
        coachToast.querySelector(
            ".coach-toast-content p"
        );

    if (toastTitle) {

        toastTitle.textContent =
            title;

    }

    if (toastMessage) {

        toastMessage.textContent =
            message;

    }

    if (toastIcon) {

        toastIcon.className =
            "coach-toast-icon";

        if (type === "error") {

            toastIcon.classList.add(
                "error"
            );

            toastIcon.innerHTML =
                '<i class="fa-solid fa-circle-exclamation"></i>';

        } else if (
            type === "warning"
        ) {

            toastIcon.classList.add(
                "warning"
            );

            toastIcon.innerHTML =
                '<i class="fa-solid fa-triangle-exclamation"></i>';

        } else {

            toastIcon.innerHTML =
                '<i class="fa-solid fa-circle-check"></i>';

        }

    }

    coachToast.hidden = false;

    requestAnimationFrame(
        () => {

            coachToast.classList.add(
                "active"
            );

        }
    );

    toastTimer =
        window.setTimeout(
            hideToast,
            4500
        );

}



function hideToast() {

    if (!coachToast) return;

    coachToast.classList.remove(
        "active"
    );

    window.setTimeout(
        () => {

            if (
                !coachToast.classList.contains(
                    "active"
                )
            ) {

                coachToast.hidden =
                    true;

            }

        },
        280
    );

}



closeCoachToastButton
?.addEventListener(
    "click",
    hideToast
);



/* ======================================================
   FAQ ACCORDION
====================================================== */

function closeFaqItem(
    faqButton
) {

    const faqItem =
        faqButton.closest(
            ".coach-faq-item"
        );

    const faqAnswer =
        faqItem?.querySelector(
            ".coach-faq-answer"
        );

    faqButton.setAttribute(
        "aria-expanded",
        "false"
    );

    if (faqAnswer) {

        faqAnswer.hidden =
            true;

    }

}



function openFaqItem(
    faqButton
) {

    const faqItem =
        faqButton.closest(
            ".coach-faq-item"
        );

    const faqAnswer =
        faqItem?.querySelector(
            ".coach-faq-answer"
        );

    faqButton.setAttribute(
        "aria-expanded",
        "true"
    );

    if (faqAnswer) {

        faqAnswer.hidden =
            false;

    }

}



faqButtons.forEach(
    faqButton => {

        faqButton.addEventListener(
            "click",
            () => {

                const isExpanded =
                    faqButton.getAttribute(
                        "aria-expanded"
                    ) === "true";

                faqButtons.forEach(
                    otherButton => {

                        if (
                            otherButton !==
                            faqButton
                        ) {

                            closeFaqItem(
                                otherButton
                            );

                        }

                    }
                );

                if (isExpanded) {

                    closeFaqItem(
                        faqButton
                    );

                } else {

                    openFaqItem(
                        faqButton
                    );

                }

            }
        );

    }
);



/* ======================================================
   NOTIFICATION BADGE
====================================================== */

function updateNotificationState() {

    const unreadNotifications =
        document.querySelectorAll(
            ".coach-notification-item.unread"
        );

    const notificationDot =
        document.querySelector(
            ".coach-notification-dot"
        );

    const notificationSummary =
        coachNotificationPanel
            ?.querySelector(
                ".coach-notification-panel-header span"
            );

    if (notificationDot) {

        notificationDot.hidden =
            unreadNotifications.length === 0;

    }

    if (notificationSummary) {

        if (
            unreadNotifications.length === 0
        ) {

            notificationSummary.textContent =
                "No unread updates";

        } else if (
            unreadNotifications.length === 1
        ) {

            notificationSummary.textContent =
                "1 unread update";

        } else {

            notificationSummary.textContent =
                `${unreadNotifications.length} unread updates`;

        }

    }

}



/* ======================================================
   MARK ALL NOTIFICATIONS AS READ
====================================================== */

function markAllNotificationsRead() {

    notificationItems.forEach(
        notificationItem => {

            notificationItem.classList.remove(
                "unread"
            );

        }
    );

    updateNotificationState();

    showToast(
        "Notifications updated",
        "All notifications have been marked as read.",
        "success"
    );

}



markAllNotificationsButton
?.addEventListener(
    "click",
    markAllNotificationsRead
);



/* ======================================================
   INDIVIDUAL NOTIFICATION READ
====================================================== */

notificationItems.forEach(
    notificationItem => {

        notificationItem.addEventListener(
            "click",
            () => {

                notificationItem.classList.remove(
                    "unread"
                );

                updateNotificationState();

            }
        );

        notificationItem.setAttribute(
            "tabindex",
            "0"
        );

        notificationItem.setAttribute(
            "role",
            "button"
        );

        notificationItem.addEventListener(
            "keydown",
            event => {

                if (
                    event.key !== "Enter" &&
                    event.key !== " "
                ) {

                    return;

                }

                event.preventDefault();

                notificationItem.classList.remove(
                    "unread"
                );

                updateNotificationState();

            }
        );

    }
);



/* ======================================================
   SUPPORT SUCCESS MODAL
====================================================== */

function openSupportSuccessModal() {

    if (!coachSupportSuccessModal) {

        showToast(
            "Request submitted",
            "Your support request has been submitted successfully.",
            "success"
        );

        return;

    }

    if (
        typeof coachSupportSuccessModal
            .showModal === "function"
    ) {

        coachSupportSuccessModal
            .showModal();

    } else {

        coachSupportSuccessModal.hidden =
            false;

    }

}



function closeSupportModal() {

    if (!coachSupportSuccessModal) return;

    if (
        typeof coachSupportSuccessModal
            .close === "function"
    ) {

        coachSupportSuccessModal.close();

    } else {

        coachSupportSuccessModal.hidden =
            true;

    }

}



closeSupportSuccessModal
?.addEventListener(
    "click",
    closeSupportModal
);



coachSupportSuccessModal
?.addEventListener(
    "click",
    event => {

        if (
            event.target ===
            coachSupportSuccessModal
        ) {

            closeSupportModal();

        }

    }
);



/* ======================================================
   ESCAPE MODAL SUPPORT
====================================================== */

document.addEventListener(
    "keydown",
    event => {

        if (event.key !== "Escape") return;

        hideToast();

        if (
            coachSupportSuccessModal &&
            coachSupportSuccessModal.open
        ) {

            closeSupportModal();

        }

    }
);



/* ======================================================
   INITIAL NOTIFICATION STATE
====================================================== */

updateNotificationState();

/* ======================================================
   HELP ARTICLE DATA
====================================================== */

const coachHelpArticles = [

    {
        title:
            "How to update your coach profile",

        category:
            "Account & Profile",

        description:
            "Learn how to update your personal information, coaching experience, certifications and profile photo.",

        keywords: [
            "profile",
            "account",
            "photo",
            "experience",
            "certification"
        ]
    },

    {
        title:
            "Adding and managing players",

        category:
            "Player Management",

        description:
            "Find out how to add players, edit player information, review development data and manage your squad.",

        keywords: [
            "player",
            "squad",
            "team",
            "add player",
            "manage players"
        ]
    },

    {
        title:
            "Creating training sessions",

        category:
            "Training",

        description:
            "Create training plans, schedule sessions, assign drills and track player participation.",

        keywords: [
            "training",
            "session",
            "drill",
            "schedule",
            "attendance"
        ]
    },

    {
        title:
            "Managing matches and results",

        category:
            "Matches",

        description:
            "Learn how to schedule matches, select squads, record results and review match reports.",

        keywords: [
            "match",
            "fixture",
            "result",
            "lineup",
            "report"
        ]
    },

    {
        title:
            "Understanding player analytics",

        category:
            "Analytics",

        description:
            "Review player performance metrics, development reports, attendance and training progress.",

        keywords: [
            "analytics",
            "performance",
            "statistics",
            "progress",
            "report"
        ]
    },

    {
        title:
            "Uploading coaching documents",

        category:
            "Documents",

        description:
            "Upload certificates, licences, identification documents and other coaching records safely.",

        keywords: [
            "document",
            "certificate",
            "licence",
            "upload",
            "verification"
        ]
    },

    {
        title:
            "Changing notification preferences",

        category:
            "Settings",

        description:
            "Control email, platform and activity notifications from your coach account settings.",

        keywords: [
            "notification",
            "email",
            "settings",
            "preference",
            "alerts"
        ]
    },

    {
        title:
            "Resetting your account password",

        category:
            "Security",

        description:
            "Follow the password recovery process and secure your coach portal account.",

        keywords: [
            "password",
            "reset",
            "login",
            "security",
            "account"
        ]
    }

];



/* ======================================================
   NORMALIZE SEARCH TEXT
====================================================== */

function normalizeHelpSearchText(
    value
) {

    return String(
        value || ""
    )
        .trim()
        .toLowerCase();

}



/* ======================================================
   FILTER HELP ARTICLES
====================================================== */

function filterHelpArticles(
    query
) {

    const normalizedQuery =
        normalizeHelpSearchText(
            query
        );

    if (!normalizedQuery) {

        return [];

    }

    return coachHelpArticles.filter(
        article => {

            const searchableText = [

                article.title,

                article.category,

                article.description,

                ...article.keywords

            ]
                .join(" ")
                .toLowerCase();

            return searchableText.includes(
                normalizedQuery
            );

        }
    );

}



/* ======================================================
   CREATE RESULT CARD
====================================================== */

function createHelpResultCard(
    article
) {

    const resultCard =
        document.createElement(
            "article"
        );

    resultCard.className =
        "coach-help-result-card";

    const category =
        document.createElement(
            "span"
        );

    category.textContent =
        article.category;

    const title =
        document.createElement(
            "h3"
        );

    title.textContent =
        article.title;

    const description =
        document.createElement(
            "p"
        );

    description.textContent =
        article.description;

    const openButton =
        document.createElement(
            "button"
        );

    openButton.type =
        "button";

    openButton.innerHTML =
        'Read guide <i class="fa-solid fa-arrow-right"></i>';

    openButton.addEventListener(
        "click",
        () => {

            showToast(
                "Guide selected",
                `${article.title} will be connected to the knowledge base by the backend team.`,
                "success"
            );

        }
    );

    resultCard.append(
        category,
        title,
        description,
        openButton
    );

    return resultCard;

}



/* ======================================================
   RENDER SEARCH RESULTS
====================================================== */

function renderHelpSearchResults(
    query
) {

    if (
        !coachHelpSearchResults ||
        !coachHelpResultsGrid
    ) {

        return;

    }

    const results =
        filterHelpArticles(
            query
        );

    coachHelpResultsGrid.innerHTML =
        "";

    if (results.length === 0) {

        const emptyCard =
            document.createElement(
                "article"
            );

        emptyCard.className =
            "coach-help-result-card";

        emptyCard.innerHTML = `
            <span>No results</span>

            <h3>
                We could not find a matching guide
            </h3>

            <p>
                Try another keyword or submit a support request below.
            </p>
        `;

        coachHelpResultsGrid.appendChild(
            emptyCard
        );

    } else {

        results.forEach(
            article => {

                coachHelpResultsGrid
                    .appendChild(
                        createHelpResultCard(
                            article
                        )
                    );

            }
        );

    }

    coachHelpSearchResults.hidden =
        false;

    coachHelpSearchResults.scrollIntoView(
        {
            behavior:
                "smooth",

            block:
                "start"
        }
    );

}



/* ======================================================
   SEARCH FORM
====================================================== */

coachHelpSearchForm
?.addEventListener(
    "submit",
    event => {

        event.preventDefault();

        const query =
            coachHelpSearchInput
                ?.value
                .trim();

        if (!query) {

            showToast(
                "Enter a search term",
                "Type a topic before searching the help centre.",
                "warning"
            );

            coachHelpSearchInput
                ?.focus();

            return;

        }

        renderHelpSearchResults(
            query
        );

    }
);



/* ======================================================
   CLEAR SEARCH
====================================================== */

coachClearHelpSearch
?.addEventListener(
    "click",
    () => {

        if (
            coachHelpSearchInput
        ) {

            coachHelpSearchInput.value =
                "";

            coachHelpSearchInput.focus();

        }

        if (
            coachHelpResultsGrid
        ) {

            coachHelpResultsGrid.innerHTML =
                "";

        }

        if (
            coachHelpSearchResults
        ) {

            coachHelpSearchResults.hidden =
                true;

        }

    }
);



/* ======================================================
   POPULAR SEARCH BUTTONS
====================================================== */

popularSearchButtons.forEach(
    button => {

        button.addEventListener(
            "click",
            () => {

                const searchTerm =
                    button.dataset
                        .helpSearch;

                if (
                    coachHelpSearchInput
                ) {

                    coachHelpSearchInput.value =
                        searchTerm;

                }

                renderHelpSearchResults(
                    searchTerm
                );

            }
        );

    }
);



/* ======================================================
   CATEGORY BUTTONS
====================================================== */

categoryButtons.forEach(
    button => {

        button.addEventListener(
            "click",
            () => {

                const category =
                    button.dataset
                        .helpCategory;

                if (
                    coachHelpSearchInput
                ) {

                    coachHelpSearchInput.value =
                        category;

                }

                renderHelpSearchResults(
                    category
                );

            }
        );

    }
);



/* ======================================================
   SUPPORT FORM REFERENCES
====================================================== */

const supportNameInput =
document.getElementById(
    "supportName"
);

const supportEmailInput =
document.getElementById(
    "supportEmail"
);

const supportCategoryInput =
document.getElementById(
    "supportCategory"
);

const supportSubjectInput =
document.getElementById(
    "supportSubject"
);

const supportMessageInput =
document.getElementById(
    "supportMessage"
);

const supportAttachmentInput =
document.getElementById(
    "supportAttachment"
);

const supportSubmitButton =
document.getElementById(
    "supportSubmitButton"
);



/* ======================================================
   FORM ERROR HELPERS
====================================================== */

function removeFieldError(
    field
) {

    if (!field) return;

    field.classList.remove(
        "invalid"
    );

    const formGroup =
        field.closest(
            ".coach-form-group"
        );

    const error =
        formGroup?.querySelector(
            ".coach-form-error"
        );

    error?.remove();

}



function showFieldError(
    field,
    message
) {

    if (!field) return;

    removeFieldError(
        field
    );

    field.classList.add(
        "invalid"
    );

    const formGroup =
        field.closest(
            ".coach-form-group"
        );

    const error =
        document.createElement(
            "small"
        );

    error.className =
        "coach-form-error";

    error.textContent =
        message;

    formGroup?.appendChild(
        error
    );

}



/* ======================================================
   EMAIL VALIDATION
====================================================== */

function isValidEmail(
    email
) {

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        .test(
            email
        );

}



/* ======================================================
   ATTACHMENT VALIDATION
====================================================== */

function validateAttachment() {

    if (
        !supportAttachmentInput ||
        !supportAttachmentInput.files.length
    ) {

        return true;

    }

    const attachment =
        supportAttachmentInput.files[0];

    const allowedTypes = [

        "image/jpeg",

        "image/png",

        "image/webp",

        "application/pdf"

    ];

    const maximumSize =
        5 * 1024 * 1024;

    if (
        !allowedTypes.includes(
            attachment.type
        )
    ) {

        showFieldError(
            supportAttachmentInput,
            "Upload a JPG, PNG, WEBP or PDF file."
        );

        return false;

    }

    if (
        attachment.size >
        maximumSize
    ) {

        showFieldError(
            supportAttachmentInput,
            "The attachment must be smaller than 5 MB."
        );

        return false;

    }

    removeFieldError(
        supportAttachmentInput
    );

    return true;

}



/* ======================================================
   SUPPORT FORM VALIDATION
====================================================== */

function validateSupportForm() {

    let isValid =
        true;

    const name =
        supportNameInput
            ?.value
            .trim();

    const email =
        supportEmailInput
            ?.value
            .trim();

    const category =
        supportCategoryInput
            ?.value
            .trim();

    const subject =
        supportSubjectInput
            ?.value
            .trim();

    const message =
        supportMessageInput
            ?.value
            .trim();

    if (
        !name ||
        name.length < 2
    ) {

        showFieldError(
            supportNameInput,
            "Enter your full name."
        );

        isValid =
            false;

    }

    if (
        !email ||
        !isValidEmail(email)
    ) {

        showFieldError(
            supportEmailInput,
            "Enter a valid email address."
        );

        isValid =
            false;

    }

    if (!category) {

        showFieldError(
            supportCategoryInput,
            "Select a support category."
        );

        isValid =
            false;

    }

    if (
        !subject ||
        subject.length < 5
    ) {

        showFieldError(
            supportSubjectInput,
            "Enter a subject with at least 5 characters."
        );

        isValid =
            false;

    }

    if (
        !message ||
        message.length < 20
    ) {

        showFieldError(
            supportMessageInput,
            "Describe the issue using at least 20 characters."
        );

        isValid =
            false;

    }

    if (
        !validateAttachment()
    ) {

        isValid =
            false;

    }

    return isValid;

}

/* ======================================================
   CLEAR FORM ERRORS ON INPUT
====================================================== */

[
    supportNameInput,
    supportEmailInput,
    supportCategoryInput,
    supportSubjectInput,
    supportMessageInput,
    supportAttachmentInput
]
.forEach(
    field => {

        field?.addEventListener(
            "input",
            () => {

                removeFieldError(
                    field
                );

            }
        );

        field?.addEventListener(
            "change",
            () => {

                removeFieldError(
                    field
                );

            }
        );

    }
);



/* ======================================================
   SUPPORT FORM SUBMISSION
====================================================== */

coachSupportForm
?.addEventListener(
    "submit",
    event => {

        event.preventDefault();

        const isValid =
            validateSupportForm();

        if (!isValid) {

            showToast(
                "Check the form",
                "Please correct the highlighted fields before submitting.",
                "error"
            );

            const firstInvalidField =
                coachSupportForm.querySelector(
                    ".invalid"
                );

            firstInvalidField?.focus();

            return;

        }

        if (!navigator.onLine) {

            showToast(
                "You are offline",
                "Reconnect to the internet before submitting your support request.",
                "warning"
            );

            return;

        }

        supportSubmitButton?.setAttribute(
            "disabled",
            "true"
        );

        if (supportSubmitButton) {

            supportSubmitButton.innerHTML = `
                <i class="fa-solid fa-spinner fa-spin"></i>
                Submitting...
            `;

        }

        const supportRequest = {

            name:
                supportNameInput
                    ?.value
                    .trim(),

            email:
                supportEmailInput
                    ?.value
                    .trim(),

            category:
                supportCategoryInput
                    ?.value,

            subject:
                supportSubjectInput
                    ?.value
                    .trim(),

            message:
                supportMessageInput
                    ?.value
                    .trim(),

            attachment:
                supportAttachmentInput
                    ?.files[0]
                    ?.name || null,

            createdAt:
                new Date()
                    .toISOString(),

            status:
                "pending"

        };

        console.log(
            "Frontend support request:",
            supportRequest
        );

        /*
            BACKEND INTEGRATION POINT

            Mr. Harsh can replace this timeout with:

            fetch("/api/coach/support", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(
                    supportRequest
                )
            });
        */

        window.setTimeout(
            () => {

                coachSupportForm.reset();

                [
                    supportNameInput,
                    supportEmailInput,
                    supportCategoryInput,
                    supportSubjectInput,
                    supportMessageInput,
                    supportAttachmentInput
                ]
                .forEach(
                    field => {

                        removeFieldError(
                            field
                        );

                    }
                );

                supportSubmitButton?.removeAttribute(
                    "disabled"
                );

                if (supportSubmitButton) {

                    supportSubmitButton.innerHTML = `
                        <i class="fa-solid fa-paper-plane"></i>
                        Submit Request
                    `;

                }

                openSupportSuccessModal();

            },
            900
        );

    }
);



/* ======================================================
   SUPPORT FORM RESET
====================================================== */

coachSupportForm
?.addEventListener(
    "reset",
    () => {

        window.setTimeout(
            () => {

                [
                    supportNameInput,
                    supportEmailInput,
                    supportCategoryInput,
                    supportSubjectInput,
                    supportMessageInput,
                    supportAttachmentInput
                ]
                .forEach(
                    field => {

                        removeFieldError(
                            field
                        );

                    }
                );

            },
            0
        );

    }
);



/* ======================================================
   LOGOUT
====================================================== */

function handleCoachLogout() {

    const shouldLogout =
        window.confirm(
            "Are you sure you want to log out?"
        );

    if (!shouldLogout) return;

    showToast(
        "Logging out",
        "Your coach session is being closed.",
        "success"
    );

    /*
        BACKEND INTEGRATION POINT

        Replace the timeout with the real logout
        request and session cleanup.
    */

    window.setTimeout(
        () => {

            window.location.href =
                "login.html";

        },
        700
    );

}



coachLogoutButton
?.addEventListener(
    "click",
    handleCoachLogout
);



coachProfileLogoutButton
?.addEventListener(
    "click",
    handleCoachLogout
);



/* ======================================================
   ONLINE AND OFFLINE STATUS
====================================================== */

window.addEventListener(
    "offline",
    () => {

        showToast(
            "Connection lost",
            "Some help centre features may be unavailable while offline.",
            "warning"
        );

    }
);



window.addEventListener(
    "online",
    () => {

        showToast(
            "Connection restored",
            "You are back online.",
            "success"
        );

    }
);



/* ======================================================
   KEYBOARD SHORTCUTS
====================================================== */

document.addEventListener(
    "keydown",
    event => {

        const targetTag =
            event.target.tagName;

        const isTyping =
            targetTag === "INPUT" ||
            targetTag === "TEXTAREA" ||
            targetTag === "SELECT";

        if (
            event.key === "/" &&
            !isTyping
        ) {

            event.preventDefault();

            coachHelpSearchInput?.focus();

        }

        if (
            event.altKey &&
            event.key.toLowerCase() === "s"
        ) {

            event.preventDefault();

            document
                .getElementById(
                    "coach-contact-support"
                )
                ?.scrollIntoView(
                    {
                        behavior:
                            "smooth",

                        block:
                            "start"
                    }
                );

        }

    }
);



/* ======================================================
   RESPONSIVE SIDEBAR RESET
====================================================== */

window.addEventListener(
    "resize",
    () => {

        if (
            window.innerWidth >
            992
        ) {

            closeSidebar();

        }

    }
);



/* ======================================================
   INITIAL FAQ STATE
====================================================== */

function initializeFaqState() {

    faqButtons.forEach(
        faqButton => {

            const isExpanded =
                faqButton.getAttribute(
                    "aria-expanded"
                ) === "true";

            const faqItem =
                faqButton.closest(
                    ".coach-faq-item"
                );

            const faqAnswer =
                faqItem?.querySelector(
                    ".coach-faq-answer"
                );

            if (faqAnswer) {

                faqAnswer.hidden =
                    !isExpanded;

            }

        }
    );

}



/* ======================================================
   INITIAL PANEL STATE
====================================================== */

function initializePanels() {

    if (coachProfileDropdown) {

        coachProfileDropdown.hidden =
            true;

    }

    if (coachNotificationPanel) {

        coachNotificationPanel.hidden =
            true;

    }

    if (coachHelpSearchResults) {

        coachHelpSearchResults.hidden =
            true;

    }

    coachProfileButton?.setAttribute(
        "aria-expanded",
        "false"
    );

    coachNotificationButton?.setAttribute(
        "aria-expanded",
        "false"
    );

}



/* ======================================================
   APPLICATION INITIALIZATION
====================================================== */

function initializeCoachHelpPage() {

    initializePanels();

    initializeFaqState();

    updateNotificationState();

    if (
        !navigator.onLine
    ) {

        showToast(
            "Offline mode",
            "You can browse existing help content, but support submission is unavailable.",
            "warning"
        );

    }

}



/* ======================================================
   START APPLICATION
====================================================== */

document.addEventListener(
    "DOMContentLoaded",
    initializeCoachHelpPage
);