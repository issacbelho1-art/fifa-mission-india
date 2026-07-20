/* =====================================================
   FIFA MISSION INDIA
   SCOUT REPORTS
   scout-reports.js
   Part 1
===================================================== */

"use strict";

/* =====================================================
   ELEMENTS
===================================================== */

const sidebar =
document.querySelector(".scout-sidebar");

const sidebarOverlay =
document.querySelector(".scout-sidebar-overlay");

const menuButton =
document.getElementById("scoutMenuToggle");

const profileButton =
document.getElementById("scoutProfileButton");

const profileDropdown =
document.getElementById("scoutProfileDropdown");

const notificationButton =
document.getElementById("scoutNotificationButton");

const notificationPanel =
document.getElementById("scoutNotificationPanel");

const searchInput =
document.getElementById("scoutSearch");

const reportGrid =
document.getElementById("scoutReportGrid");

const reportCards =
[
    ...document.querySelectorAll(".scout-report-card")
];

const statusFilter =
document.getElementById("filterStatus");

const positionFilter =
document.getElementById("filterPosition");

const stateFilter =
document.getElementById("filterState");

const sortFilter =
document.getElementById("sortReports");

const applyButton =
document.getElementById("applyReportFilters");

const loadMoreButton =
document.getElementById("loadMoreReportsButton");

const toast =
document.getElementById("scoutToast");

const toastTitle =
document.getElementById("scoutToastTitle");

const toastMessage =
document.getElementById("scoutToastMessage");

/* =====================================================
   MOBILE SIDEBAR
===================================================== */

if(menuButton){

    menuButton.addEventListener(

        "click",

        () => {

            sidebar.classList.toggle("active");

            sidebarOverlay.classList.toggle("active");

        }

    );

}

if(sidebarOverlay){

    sidebarOverlay.addEventListener(

        "click",

        () => {

            sidebar.classList.remove("active");

            sidebarOverlay.classList.remove("active");

        }

    );

}

/* =====================================================
   PROFILE MENU
===================================================== */

if(profileButton){

    profileButton.addEventListener(

        "click",

        event => {

            event.stopPropagation();

            profileDropdown.classList.toggle("active");

            notificationPanel.classList.remove("active");

        }

    );

}

/* =====================================================
   NOTIFICATION PANEL
===================================================== */

if(notificationButton){

    notificationButton.addEventListener(

        "click",

        event => {

            event.stopPropagation();

            notificationPanel.classList.toggle("active");

            profileDropdown.classList.remove("active");

        }

    );

}

/* =====================================================
   CLOSE DROPDOWNS
===================================================== */

document.addEventListener(

    "click",

    event => {

        if(
            profileDropdown &&
            !profileDropdown.contains(event.target)
        ){

            profileDropdown.classList.remove("active");

        }

        if(
            notificationPanel &&
            !notificationPanel.contains(event.target)
        ){

            notificationPanel.classList.remove("active");

        }

    }

);



document.addEventListener(

    "keydown",

    event => {

        if(event.key !== "Escape"){

            return;

        }

        if(profileDropdown){

            profileDropdown.classList.remove("active");

        }

        if(notificationPanel){

            notificationPanel.classList.remove("active");

        }

        if(sidebar){

            sidebar.classList.remove("active");

        }

        if(sidebarOverlay){

            sidebarOverlay.classList.remove("active");

        }

    }

);

/* =====================================================
   TOAST
===================================================== */

let toastTimer;

function showToast(
    title,
    message
){

    if(
        !toast ||
        !toastTitle ||
        !toastMessage
    ){

        return;

    }

    clearTimeout(toastTimer);

    toastTitle.textContent =
    title;

    toastMessage.textContent =
    message;

    toast.classList.add("show");

    toastTimer = setTimeout(

        () => {

            toast.classList.remove("show");

        },

        3200

    );

}

/* =====================================================
   NORMALIZE VALUES
===================================================== */

function normalizeValue(value){

    return String(value || "")
        .trim()
        .toLowerCase();

}

/* =====================================================
   FILTER REPORTS
===================================================== */

function filterReports(){

    const selectedStatus =
    normalizeValue(statusFilter?.value);

    const selectedPosition =
    normalizeValue(positionFilter?.value);

    const selectedState =
    normalizeValue(stateFilter?.value);

    const searchTerm =
    normalizeValue(searchInput?.value);

    let visibleCount = 0;

    reportCards.forEach(

        card => {

            const cardStatus =
            normalizeValue(card.dataset.status);

            const cardPosition =
            normalizeValue(card.dataset.position);

            const cardState =
            normalizeValue(card.dataset.state);

            const cardText =
            normalizeValue(card.textContent);

            const matchesStatus =
            !selectedStatus ||
            cardStatus === selectedStatus;

            const matchesPosition =
            !selectedPosition ||
            cardPosition.includes(selectedPosition);

            const matchesState =
            !selectedState ||
            cardState === selectedState;

            const matchesSearch =
            !searchTerm ||
            cardText.includes(searchTerm);

            const shouldDisplay =
            matchesStatus &&
            matchesPosition &&
            matchesState &&
            matchesSearch;

            card.hidden =
            !shouldDisplay;

            if(shouldDisplay){

                visibleCount += 1;

            }

        }

    );

    return visibleCount;

}

/* =====================================================
   SORT REPORTS
===================================================== */

function sortReports(){

    if(
        !reportGrid ||
        !sortFilter
    ){

        return;

    }

    const sortValue =
    normalizeValue(sortFilter.value);

    const sortedCards =
    [...reportCards].sort(

        (firstCard, secondCard) => {

            const firstRating =
            Number(firstCard.dataset.rating || 0);

            const secondRating =
            Number(secondCard.dataset.rating || 0);

            const firstDateText =
            firstCard.querySelector(
                ".scout-report-details div:nth-child(3) strong"
            )?.textContent || "";

            const secondDateText =
            secondCard.querySelector(
                ".scout-report-details div:nth-child(3) strong"
            )?.textContent || "";

            const firstDate =
            new Date(firstDateText);

            const secondDate =
            new Date(secondDateText);

            if(
                sortValue === "highest rating"
            ){

                return secondRating - firstRating;

            }

            if(
                sortValue === "lowest rating"
            ){

                return firstRating - secondRating;

            }

            if(
                sortValue === "oldest first"
            ){

                return firstDate - secondDate;

            }

            return secondDate - firstDate;

        }

    );

    sortedCards.forEach(

        card => {

            reportGrid.appendChild(card);

        }

    );

}

/* =====================================================
   APPLY FILTERS
===================================================== */

if(applyButton){

    applyButton.addEventListener(

        "click",

        () => {

            sortReports();

            const visibleCount =
            filterReports();

            showToast(
                "Filters Applied",
                `${visibleCount} report${visibleCount === 1 ? "" : "s"} found.`
            );

        }

    );

}

/* =====================================================
   LIVE SEARCH
===================================================== */

if(searchInput){

    searchInput.addEventListener(

        "input",

        () => {

            filterReports();

        }

    );

}

/* =====================================================
   FILTER CHANGE
===================================================== */

[
    statusFilter,
    positionFilter,
    stateFilter
].forEach(

    filter => {

        if(!filter){

            return;

        }

        filter.addEventListener(

            "change",

            () => {

                filterReports();

            }

        );

    }

);

if(sortFilter){

    sortFilter.addEventListener(

        "change",

        () => {

            sortReports();

            filterReports();

        }

    );

}

/* =====================================================
   LOAD MORE REPORTS
===================================================== */

if(loadMoreButton){

    loadMoreButton.addEventListener(

        "click",

        () => {

            showToast(
                "All Reports Loaded",
                "No additional frontend demo reports are available."
            );

            loadMoreButton.disabled = true;

            loadMoreButton.innerHTML = `
                <i class="fa-solid fa-circle-check"></i>
                All Reports Loaded
            `;

        }

    );

}

/* =====================================================
   REPORT ACTIONS
===================================================== */

reportCards.forEach(

    card => {

        const viewButton =
        card.querySelector(
            'a[href="scout-report-view.html"]'
        );

        const editButton =
        card.querySelector(
            'a[href="scout-report-edit.html"]'
        );

        if(viewButton){

            viewButton.addEventListener(

                "click",

                event => {

                    const reportId =
                    card.querySelector(
                        ".scout-report-id"
                    )?.textContent.trim();

                    if(reportId){

                        sessionStorage.setItem(
                            "selectedScoutReport",
                            reportId
                        );

                    }

                }

            );

        }

        if(editButton){

            editButton.addEventListener(

                "click",

                event => {

                    const reportId =
                    card.querySelector(
                        ".scout-report-id"
                    )?.textContent.trim();

                    if(reportId){

                        sessionStorage.setItem(
                            "selectedScoutReport",
                            reportId
                        );

                    }

                }

            );

        }

    }

);

/* =====================================================
   LOGOUT BUTTONS
===================================================== */

const logoutButtons =
document.querySelectorAll(
    ".scout-logout button, .scout-profile-dropdown-footer button"
);

logoutButtons.forEach(

    button => {

        button.addEventListener(

            "click",

            () => {

                showToast(
                    "Logout",
                    "Logout will be connected to the backend authentication system."
                );

            }

        );

    }

);

/* =====================================================
   CLOSE SIDEBAR AFTER NAVIGATION
===================================================== */

const sidebarLinks =
document.querySelectorAll(
    ".scout-sidebar-nav a"
);

sidebarLinks.forEach(

    link => {

        link.addEventListener(

            "click",

            () => {

                if(
                    window.innerWidth <= 991
                ){

                    sidebar?.classList.remove("active");

                    sidebarOverlay?.classList.remove("active");

                }

            }

        );

    }

);

/* =====================================================
   INITIALIZE REPORTS
===================================================== */

sortReports();

filterReports();

/* =====================================================
   BACKEND INTEGRATION PLACEHOLDERS
===================================================== */

/*
    Future backend endpoints:

    GET    /api/v1/scout/reports
    GET    /api/v1/scout/reports/:reportId
    POST   /api/v1/scout/reports
    PUT    /api/v1/scout/reports/:reportId
    DELETE /api/v1/scout/reports/:reportId

    Replace the static report cards with API responses
    when Mr. Harsh connects the FastAPI backend.
*/