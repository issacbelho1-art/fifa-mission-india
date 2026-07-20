"use strict";

/* ======================================================
   ELEMENTS
====================================================== */

const scoutSidebar =
document.getElementById(
"scoutSidebar"
);

const scoutSidebarOverlay =
document.getElementById(
"scoutSidebarOverlay"
);

const scoutMenuToggle =
document.getElementById(
"scoutMenuToggle"
);

const scoutSidebarClose =
document.getElementById(
"scoutSidebarClose"
);

const scoutNotificationButton =
document.getElementById(
"scoutNotificationButton"
);

const scoutNotificationPanel =
document.getElementById(
"scoutNotificationPanel"
);

const scoutProfileButton =
document.getElementById(
"scoutProfileButton"
);

const scoutProfileDropdown =
document.getElementById(
"scoutProfileDropdown"
);

const scoutToast =
document.getElementById(
"scoutToast"
);

const scoutToastTitle =
scoutToast?.querySelector("strong");

const scoutToastMessage =
scoutToast?.querySelector("p");

const scoutToastClose =
document.getElementById(
"closeScoutToastButton"
);

const scoutSearchInput =
document.getElementById(
"scoutSearchInput"
);

const scoutLogoutButton =
document.getElementById(
"scoutLogoutButton"
);

const scoutFavouriteButtons =
document.querySelectorAll(
".scout-player-favourite"
);

const scoutQuickActionCards =
document.querySelectorAll(
".scout-quick-action-card"
);

const scoutMatchCards =
document.querySelectorAll(
".scout-match-card"
);

const scoutPlayerCards =
document.querySelectorAll(
".scout-player-card"
);

const scoutStatisticCards =
document.querySelectorAll(
".scout-statistics-card"
);

const scoutNavLinks =
document.querySelectorAll(
".scout-nav-link"
);



/* ======================================================
   SIDEBAR
====================================================== */

function openScoutSidebar(){

    scoutSidebar?.classList.add(
        "active"
    );

    scoutSidebarOverlay?.classList.add(
        "active"
    );

}

function closeScoutSidebar(){

    scoutSidebar?.classList.remove(
        "active"
    );

    scoutSidebarOverlay?.classList.remove(
        "active"
    );

}

scoutMenuToggle?.addEventListener(
"click",
openScoutSidebar
);

scoutSidebarClose?.addEventListener(
"click",
closeScoutSidebar
);

scoutSidebarOverlay?.addEventListener(
"click",
closeScoutSidebar
);



/* ======================================================
   TOAST
====================================================== */

let scoutToastTimer;

function showScoutToast(
title,
message
){

    if(!scoutToast) return;

    scoutToastTitle.textContent =
    title;

    scoutToastMessage.textContent =
    message;

    scoutToast.hidden=false;

    requestAnimationFrame(()=>{

        scoutToast.classList.add(
            "show"
        );

    });

    clearTimeout(
        scoutToastTimer
    );

    scoutToastTimer=
    setTimeout(()=>{

        hideScoutToast();

    },3500);

}

function hideScoutToast(){

    if(!scoutToast) return;

    scoutToast.classList.remove(
        "show"
    );

    setTimeout(()=>{

        scoutToast.hidden=true;

    },250);

}

scoutToastClose?.addEventListener(
"click",
hideScoutToast
);



/* ======================================================
   PROFILE MENU
====================================================== */

function closeProfileMenu(){

    scoutProfileDropdown?.classList.remove(
        "active"
    );

}

function toggleProfileMenu(){

    closeNotificationPanel();

    scoutProfileDropdown?.classList.toggle(
        "active"
    );

}

scoutProfileButton?.addEventListener(
"click",
(event)=>{

event.stopPropagation();

toggleProfileMenu();

});

/* ======================================================
   NOTIFICATION PANEL
====================================================== */

function closeNotificationPanel(){

    scoutNotificationPanel?.classList.remove(
        "active"
    );

}

function toggleNotificationPanel(){

    closeProfileMenu();

    scoutNotificationPanel?.classList.toggle(
        "active"
    );

}

scoutNotificationButton?.addEventListener(
"click",
(event)=>{

    event.stopPropagation();

    toggleNotificationPanel();

});



/* ======================================================
   CLOSE FLOATING PANELS
====================================================== */

document.addEventListener(
"click",
(event)=>{

    const clickedInsideProfile =
    scoutProfileDropdown?.contains(
        event.target
    );

    const clickedProfileButton =
    scoutProfileButton?.contains(
        event.target
    );

    const clickedInsideNotifications =
    scoutNotificationPanel?.contains(
        event.target
    );

    const clickedNotificationButton =
    scoutNotificationButton?.contains(
        event.target
    );

    if(
        !clickedInsideProfile &&
        !clickedProfileButton
    ){

        closeProfileMenu();

    }

    if(
        !clickedInsideNotifications &&
        !clickedNotificationButton
    ){

        closeNotificationPanel();

    }

});



/* ======================================================
   ESCAPE KEY
====================================================== */

document.addEventListener(
"keydown",
(event)=>{

    if(event.key !== "Escape") return;

    closeScoutSidebar();

    closeProfileMenu();

    closeNotificationPanel();

    hideScoutToast();

});



/* ======================================================
   MARK NOTIFICATIONS AS READ
====================================================== */

const scoutMarkNotificationsReadButton =
document.getElementById(
"scoutMarkNotificationsReadButton"
);

const scoutNotificationItems =
document.querySelectorAll(
".scout-notification-item"
);

const scoutNotificationDot =
document.querySelector(
".scout-notification-dot"
);

scoutMarkNotificationsReadButton?.addEventListener(
"click",
()=>{

    scoutNotificationItems.forEach(
    (notification)=>{

        notification.classList.remove(
            "unread"
        );

    });

    if(scoutNotificationDot){

        scoutNotificationDot.hidden=true;

    }

    showScoutToast(
        "Notifications Updated",
        "All notifications have been marked as read."
    );

});



/* ======================================================
   PLAYER SHORTLIST
====================================================== */

scoutFavouriteButtons.forEach(
(button)=>{

    button.addEventListener(
    "click",
    (event)=>{

        event.preventDefault();

        event.stopPropagation();

        const playerCard =
        button.closest(
            ".scout-player-card"
        );

        const playerName =
        playerCard?.querySelector(
            "h3"
        )?.textContent?.trim() ||
        "Player";

        const isActive =
        button.classList.toggle(
            "active"
        );

        const icon =
        button.querySelector(
            "i"
        );

        if(icon){

            icon.className =
            isActive
            ? "fa-solid fa-star"
            : "fa-regular fa-star";

        }

        button.setAttribute(
            "aria-label",
            isActive
            ? `Remove ${playerName} from shortlist`
            : `Add ${playerName} to shortlist`
        );

        showScoutToast(
            isActive
            ? "Player Shortlisted"
            : "Player Removed",
            isActive
            ? `${playerName} has been added to your shortlist.`
            : `${playerName} has been removed from your shortlist.`
        );

        /*
        BACKEND INTEGRATION:

        Connect this action to the shortlist API.

        Example payload:

        {
            playerName,
            shortlisted:isActive
        }
        */

    });

});



/* ======================================================
   DASHBOARD SEARCH
====================================================== */

function normalizeScoutSearchValue(
value
){

    return value
    .toLowerCase()
    .trim();

}

function filterScoutDashboard(
query
){

    const normalizedQuery =
    normalizeScoutSearchValue(
        query
    );

    const searchableCards = [
        ...scoutMatchCards,
        ...scoutPlayerCards,
        ...scoutQuickActionCards
    ];

    searchableCards.forEach(
    (card)=>{

        const searchableText =
        normalizeScoutSearchValue(
            card.textContent || ""
        );

        const matches =
        !normalizedQuery ||
        searchableText.includes(
            normalizedQuery
        );

        card.hidden=
        !matches;

    });

}

scoutSearchInput?.addEventListener(
"input",
(event)=>{

    filterScoutDashboard(
        event.target.value
    );

});

scoutSearchInput?.addEventListener(
"keydown",
(event)=>{

    if(event.key !== "Enter") return;

    const searchValue =
    scoutSearchInput.value.trim();

    if(!searchValue){

        showScoutToast(
            "Search Players",
            "Enter a player, match, region or scouting activity."
        );

        return;

    }

    showScoutToast(
        "Dashboard Search",
        `Showing results for "${searchValue}".`
    );

});



/* ======================================================
   ACTIVE NAVIGATION
====================================================== */

scoutNavLinks.forEach(
(link)=>{

    link.addEventListener(
    "click",
    ()=>{

        scoutNavLinks.forEach(
        (navLink)=>{

            navLink.classList.remove(
                "active"
            );

        });

        link.classList.add(
            "active"
        );

        if(
            window.innerWidth <= 992
        ){

            closeScoutSidebar();

        }

    });

});



/* ======================================================
   STATISTICS COUNTER ANIMATION
====================================================== */

function animateScoutCounter(
element
){

    const originalValue =
    element.textContent.trim();

    const numericValue =
    Number(
        originalValue.replace(
            /[^0-9.]/g,
            ""
        )
    );

    if(
        Number.isNaN(
            numericValue
        )
    ) return;

    const containsDecimal =
    originalValue.includes(
        "."
    );

    const suffix =
    originalValue.replace(
        /[0-9.]/g,
        ""
    );

    const duration=1100;

    const startTime=
    performance.now();

    function updateCounter(
    currentTime
    ){

        const elapsed =
        currentTime-startTime;

        const progress =
        Math.min(
            elapsed/duration,
            1
        );

        const easedProgress =
        1-Math.pow(
            1-progress,
            3
        );

        const currentValue =
        numericValue*
        easedProgress;

        element.textContent =
        containsDecimal
        ? `${currentValue.toFixed(1)}${suffix}`
        : `${Math.round(currentValue)}${suffix}`;

        if(progress < 1){

            requestAnimationFrame(
                updateCounter
            );

        }else{

            element.textContent =
            originalValue;

        }

    }

    requestAnimationFrame(
        updateCounter
    );

}

const scoutStatisticsObserver =
new IntersectionObserver(
(entries,observer)=>{

    entries.forEach(
    (entry)=>{

        if(
            !entry.isIntersecting
        ) return;

        const valueElement =
        entry.target.querySelector(
            "strong"
        );

        if(valueElement){

            animateScoutCounter(
                valueElement
            );

        }

        observer.unobserve(
            entry.target
        );

    });

},
{
    threshold:.35
}
);

scoutStatisticCards.forEach(
(card)=>{

    scoutStatisticsObserver.observe(
        card
    );

});

/* ======================================================
   QUICK ACTION FEEDBACK
====================================================== */

scoutQuickActionCards.forEach(
(card)=>{

    card.addEventListener(
    "click",
    ()=>{

        const actionTitle =
        card.querySelector(
            "h3"
        )?.textContent?.trim();

        if(!actionTitle) return;

        sessionStorage.setItem(
            "scoutLastQuickAction",
            actionTitle
        );

    });

});



/* ======================================================
   MATCH CARD FEEDBACK
====================================================== */

scoutMatchCards.forEach(
(card)=>{

    const actionButton =
    card.querySelector(
        ".scout-match-action"
    );

    actionButton?.addEventListener(
    "click",
    ()=>{

        const matchTitle =
        card.querySelector(
            "h3"
        )?.textContent?.trim() ||
        "Selected match";

        sessionStorage.setItem(
            "scoutSelectedMatch",
            matchTitle
        );

    });

});



/* ======================================================
   PLAYER CARD FEEDBACK
====================================================== */

scoutPlayerCards.forEach(
(card)=>{

    const playerLink =
    card.querySelector(
        ".scout-player-view-button"
    );

    playerLink?.addEventListener(
    "click",
    ()=>{

        const playerName =
        card.querySelector(
            "h3"
        )?.textContent?.trim() ||
        "Selected player";

        sessionStorage.setItem(
            "scoutSelectedPlayer",
            playerName
        );

    });

});



/* ======================================================
   LOGOUT
====================================================== */

scoutLogoutButton?.addEventListener(
"click",
(event)=>{

    event.preventDefault();

    const confirmed =
    window.confirm(
        "Are you sure you want to log out?"
    );

    if(!confirmed) return;

    showScoutToast(
        "Logging Out",
        "Your scout session is being closed securely."
    );

    /*
    BACKEND INTEGRATION:

    1. Revoke access token.
    2. Revoke refresh token.
    3. Clear authenticated scout session.
    4. Redirect to login page.
    */

    setTimeout(()=>{

        window.location.href =
        "login.html";

    },900);

});



/* ======================================================
   PROFILE DROPDOWN LOGOUT
====================================================== */

const scoutDropdownLogout =
document.querySelector(
".scout-profile-dropdown-link.logout"
);

scoutDropdownLogout?.addEventListener(
"click",
(event)=>{

    event.preventDefault();

    scoutLogoutButton?.click();

});



/* ======================================================
   RESPONSIVE RESET
====================================================== */

window.addEventListener(
"resize",
()=>{

    if(
        window.innerWidth > 992
    ){

        closeScoutSidebar();

    }

    closeProfileMenu();

    closeNotificationPanel();

});



/* ======================================================
   ONLINE AND OFFLINE STATUS
====================================================== */

window.addEventListener(
"offline",
()=>{

    showScoutToast(
        "You Are Offline",
        "Some dashboard features may be unavailable until your connection returns."
    );

});

window.addEventListener(
"online",
()=>{

    showScoutToast(
        "Connection Restored",
        "You are back online and your scouting tools are available."
    );

});



/* ======================================================
   ACCESSIBILITY
====================================================== */

function updateScoutExpandedState(
button,
panel
){

    if(
        !button ||
        !panel
    ) return;

    const isOpen =
    panel.classList.contains(
        "active"
    );

    button.setAttribute(
        "aria-expanded",
        String(isOpen)
    );

}

scoutNotificationButton?.addEventListener(
"click",
()=>{

    setTimeout(()=>{

        updateScoutExpandedState(
            scoutNotificationButton,
            scoutNotificationPanel
        );

    },0);

});

scoutProfileButton?.addEventListener(
"click",
()=>{

    setTimeout(()=>{

        updateScoutExpandedState(
            scoutProfileButton,
            scoutProfileDropdown
        );

    },0);

});



/* ======================================================
   INITIALIZATION
====================================================== */

document.addEventListener(
"DOMContentLoaded",
()=>{

    scoutProfileButton?.setAttribute(
        "aria-expanded",
        "false"
    );

    scoutNotificationButton?.setAttribute(
        "aria-expanded",
        "false"
    );

    scoutProfileButton?.setAttribute(
        "aria-haspopup",
        "menu"
    );

    scoutNotificationButton?.setAttribute(
        "aria-haspopup",
        "dialog"
    );

    if(
        scoutSearchInput
    ){

        scoutSearchInput.value="";

    }

    console.info(
        "Scout dashboard initialized."
    );

    /*
    BACKEND INTEGRATION:

    Load dashboard data from API endpoints.

    Suggested endpoints:

    GET /api/v1/scouts/dashboard
    GET /api/v1/scouts/reports/recent
    GET /api/v1/scouts/matches/upcoming
    GET /api/v1/scouts/shortlist
    GET /api/v1/scouts/notifications
    */

});