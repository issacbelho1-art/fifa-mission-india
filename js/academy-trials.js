/* ==========================================================
   FIFA Mission India
   Academy Trials Management

   Frontend:
   Issac Belho

   Backend:
   Mr. Harsh

   Security:
   Samarth
========================================================== */

document.addEventListener("DOMContentLoaded", () => {

    /* ======================================================
       ELEMENTS
    ====================================================== */

    const sidebar =
        document.getElementById("academySidebar");

    const sidebarOverlay =
        document.getElementById("academySidebarOverlay");

    const menuButton =
        document.getElementById("academyMenuButton");

    const sidebarClose =
        document.getElementById("academySidebarClose");

    const profileTrigger =
        document.getElementById("academyProfileTrigger");

    const profileDropdown =
        document.getElementById("academyProfileDropdown");

    const calendarGrid =
        document.getElementById("academyCalendarGrid");

    const searchInput =
        document.getElementById("academyTrialSearch");

    const statusFilter =
        document.getElementById("academyTrialStatus");

    const ageFilter =
        document.getElementById("academyAgeFilter");

    const resetFilters =
        document.getElementById("academyResetFilters");

    const statCards =
        document.querySelectorAll(".academy-stat-card");


    /* ======================================================
       DEMO DATA
    ====================================================== */

    let trials = [

        {
            id:1,
            title:"Elite U17 Selection",
            date:14,
            month:7,
            status:"Upcoming",
            venue:"Main Ground"
        },

        {
            id:2,
            title:"Senior Open Trial",
            date:18,
            month:7,
            status:"Live",
            venue:"Stadium"
        },

        {
            id:3,
            title:"U15 Trial",
            date:22,
            month:7,
            status:"Completed",
            venue:"Training Field"
        }

    ];


    /* ======================================================
       SIDEBAR
    ====================================================== */

   function openSidebar(){

    sidebar?.classList.add("open");

    if(sidebarOverlay){
        sidebarOverlay.hidden = false;
    }

}

function closeSidebar(){

    sidebar?.classList.remove("open");

    if(sidebarOverlay){
        sidebarOverlay.hidden = true;
    }

}

    menuButton?.addEventListener(
        "click",
        openSidebar
    );

    sidebarClose?.addEventListener(
        "click",
        closeSidebar
    );

    sidebarOverlay?.addEventListener(
        "click",
        closeSidebar
    );


    /* ======================================================
       PROFILE MENU
    ====================================================== */

    function closeProfileDropdown(){

    if(profileDropdown){
        profileDropdown.hidden = true;
    }

    profileTrigger?.setAttribute(
        "aria-expanded",
        "false"
    );

}

    function toggleProfileDropdown(){

    if(!profileDropdown) return;

    const expanded = profileDropdown.hidden;

    profileDropdown.hidden = !expanded;

    profileTrigger?.setAttribute(
        "aria-expanded",
        String(expanded)
    );

}

    profileTrigger?.addEventListener(
        "click",
        toggleProfileDropdown
    );

    document.addEventListener(
        "click",
        (event)=>{

            if(
                !event.target.closest(
                    ".academy-profile-dropdown-wrapper"
                )
            ){

                closeProfileDropdown();

            }

        }
    );


    /* ======================================================
       CALENDAR
    ====================================================== */

    function buildCalendar(){

        if(!calendarGrid) return;

        calendarGrid.innerHTML = "";

        for(let day=1; day<=35; day++){

            const card =
                document.createElement("div");

            card.className =
                "academy-calendar-day";

            if(day===14){

                card.classList.add("today");

            }

            card.innerHTML = `

                <div class="academy-calendar-number">

                    ${day}

                </div>

            `;

            const trial =
                trials.find(
                    item=>item.date===day
                );

            if(trial){

                card.classList.add(
                    "has-event"
                );

                card.innerHTML += `

                    <div class="academy-calendar-event">

                        ${trial.title}

                    </div>

                `;

            }

            calendarGrid.appendChild(card);

        }

    }


    /* ======================================================
       SEARCH
    ====================================================== */

    function applySearch(){

        const value =
    (searchInput?.value || "")
    .toLowerCase();

        document
            .querySelectorAll(".academy-trial-card")
            .forEach(card=>{

                const text =
                    card.innerText
                    .toLowerCase();

                card.style.display =
                    text.includes(value)
                    ? ""
                    : "none";

            });

    }

    searchInput?.addEventListener(
        "input",
        applySearch
    );


    /* ======================================================
   FILTERS
====================================================== */

function applyFilters(){

    console.log(
        "Status:",
        statusFilter?.value || "all",

        "Age:",
        ageFilter?.value || "all"
    );

    /*
    =====================================

    Backend placeholder

    Mr. Harsh:

    Filter results
    from API

    =====================================
    */

}

statusFilter?.addEventListener(
    "change",
    applyFilters
);

ageFilter?.addEventListener(
    "change",
    applyFilters
);

resetFilters?.addEventListener(
    "click",
    ()=>{

        if(searchInput){
            searchInput.value = "";
        }

        if(statusFilter){
            statusFilter.selectedIndex = 0;
        }

        if(ageFilter){
            ageFilter.selectedIndex = 0;
        }

        applySearch();
        applyFilters();

    }
);


    /* ======================================================
   STATISTICS
====================================================== */

function refreshStatistics(){

    const totalStat = document.querySelector(
        '[data-stat="total"]'
    );

    if(totalStat){

        totalStat.textContent = trials.length;

    }

}

function highlightCards(){

    statCards.forEach(card=>{

        card.addEventListener(

            "mouseenter",

            ()=>{

                card.style.transform =
                    "translateY(-8px)";

            }

        );

        card.addEventListener(

            "mouseleave",

            ()=>{

                card.style.transform = "";

            }

        );

    });

}

    /* ======================================================
       CREATE TRIAL MODAL
    ====================================================== */

    const createTrialModal =
        document.getElementById(
            "academyCreateTrialModal"
        );

    const createTrialButton =
        document.getElementById(
            "academyCreateTrialButton"
        );

    function openCreateTrialModal(){

        if(!createTrialModal) return;

        createTrialModal.hidden = false;

        document.body.style.overflow = "hidden";

    }

    function closeCreateTrialModal(){

        if(!createTrialModal) return;

        createTrialModal.hidden = true;

        document.body.style.overflow = "";

    }

    createTrialButton?.addEventListener(

        "click",

        openCreateTrialModal

    );

    createTrialModal
        ?.querySelectorAll("[data-close-modal]")
        .forEach(button=>{

            button.addEventListener(

                "click",

                closeCreateTrialModal

            );

        });


    /* ======================================================
   LOGOUT MODAL
====================================================== */

const logoutModal =
    document.getElementById(
        "academyLogoutModal"
    );

const logoutButton =
    document.getElementById(
        "academyLogoutButton"
    );

const confirmLogout =
    document.getElementById(
        "academyConfirmLogout"
    );

function openLogoutModal(){

    if(!logoutModal) return;

    logoutModal.hidden = false;

    document.body.style.overflow = "hidden";

}

function closeLogoutModal(){

    if(!logoutModal) return;

    logoutModal.hidden = true;

    document.body.style.overflow = "";

}

logoutButton?.addEventListener(

    "click",

    openLogoutModal

);

logoutModal
    ?.querySelectorAll("[data-close-logout]")
    .forEach(button=>{

        button.addEventListener(

            "click",

            closeLogoutModal

        );

    });

confirmLogout?.addEventListener(

    "click",

    ()=>{

        /*
        ===================================

        Backend

        Mr. Harsh

        Destroy Session
        Clear JWT Token
        Redirect User

        Example:

        POST /api/auth/logout

        ===================================
        */

        closeLogoutModal();

        window.location.href =
            "login.html";

    }

);


    /* ======================================================
       TOAST
    ====================================================== */

    const toastContainer =
        document.getElementById(
            "academyToastContainer"
        );

    function showToast(

        message,

        type="success"

    ){

        if(!toastContainer) return;

        const toast =
            document.createElement("div");

        toast.className =
            `academy-toast ${type}`;

        toast.innerHTML = `

            <strong>

                ${message}

            </strong>

        `;

        toastContainer.appendChild(toast);

        setTimeout(()=>{

            toast.remove();

        },3500);

    }


    /* ======================================================
       CREATE TRIAL SUBMIT
    ====================================================== */

    createTrialModal
        ?.querySelector("form")
        ?.addEventListener(

            "submit",

            event=>{

                event.preventDefault();

                /*
                =====================================

                Backend

                POST

                /api/academy/trials

                Mr Harsh

                =====================================
                */

                showToast(

                    "Trial created successfully."

                );

                closeCreateTrialModal();

            }

        );


    /* ======================================================
       CARD BUTTONS
    ====================================================== */

    document
        .querySelectorAll(
            ".academy-card-actions button"
        )
        .forEach(button=>{

            button.addEventListener(

                "click",

                ()=>{

                    showToast(

                        "Opening trial details..."

                    );

                }

            );

        });


    /* ======================================================
       TABLE BUTTONS
    ====================================================== */

    document
        .querySelectorAll(
            ".academy-table .academy-secondary-button"
        )
        .forEach(button=>{

            button.addEventListener(

                "click",

                ()=>{

                    showToast(

                        "Opening evaluation panel..."

                    );

                }

            );

        });


    /* ======================================================
       CALENDAR NAVIGATION
    ====================================================== */

    let currentMonth = 7;

    document
        .getElementById(
            "academyPreviousMonth"
        )
        ?.addEventListener(

            "click",

            ()=>{

                currentMonth--;

                showToast(

                    "Previous month"

                );

                buildCalendar();

            }

        );

    document
        .getElementById(
            "academyNextMonth"
        )
        ?.addEventListener(

            "click",

            ()=>{

                currentMonth++;

                showToast(

                    "Next month"

                );

                buildCalendar();

            }

        );

    document
        .getElementById(
            "academyTodayButton"
        )
        ?.addEventListener(

            "click",

            ()=>{

                currentMonth = 7;

                buildCalendar();

                showToast(

                    "Returned to current month."

                );

            }

        );


    /* ======================================================
       CALENDAR VIEW
    ====================================================== */

    document
        .getElementById(
            "academyCalendarView"
        )
        ?.addEventListener(

            "change",

            event=>{

                const mode =
                    event.target.value;

                /*
                Future

                Month

                Week

                Day

                */

                console.log(mode);

                showToast(

                    mode + " view selected."

                );

            }

        );

           /* ======================================================
       ATTENDANCE MANAGEMENT
    ====================================================== */

    function updateAttendance(playerId, status){

        /*
        =======================================

        Backend Placeholder
        Mr. Harsh

        PATCH

        /api/trials/:trialId/attendance

        =======================================
        */

        showToast(

            `Attendance updated to ${status}.`

        );

    }

    document
        .querySelectorAll(".academy-status")
        .forEach(status=>{

            status.addEventListener(

                "click",

                ()=>{

                    updateAttendance(

                        1,

                        "Checked In"

                    );

                }

            );

        });


    /* ======================================================
       EVALUATION DRAWER
    ====================================================== */

    const evaluationDrawer =
        document.querySelector(
            ".academy-evaluation-drawer"
        );

    function openEvaluationDrawer(playerId){

        if(!evaluationDrawer){

            showToast(
                "Evaluation panel opening..."
            );

            return;

        }

        evaluationDrawer.classList.add("open");

        /*
        =====================================

        Backend

        GET

        /api/player/:id

        Load player evaluation

        =====================================
        */

    }

    function closeEvaluationDrawer(){

        evaluationDrawer?.classList.remove("open");

    }

    document
        .querySelectorAll(
            ".academy-table .academy-secondary-button"
        )
        .forEach(button=>{

            button.addEventListener(

                "click",

                ()=>{

                    openEvaluationDrawer(1);

                }

            );

        });


    /* ======================================================
       RESULT MANAGEMENT
    ====================================================== */

    function updateTrialResult(

        playerId,

        result

    ){

        /*
        Backend

        PATCH

        /result

        */

        showToast(

            "Player marked as " + result

        );

    }


    /* ======================================================
       BULK SELECTION
    ====================================================== */

    const selectAll =
        document.querySelector(
            "thead input[type='checkbox']"
        );

    selectAll?.addEventListener(

        "change",

        event=>{

            document
                .querySelectorAll(
                    "tbody input[type='checkbox']"
                )
                .forEach(box=>{

                    box.checked =
                        event.target.checked;

                });

        }

    );


    /* ======================================================
       EXPORT
    ====================================================== */

    document
        .getElementById(
            "academyExportTrials"
        )
        ?.addEventListener(

            "click",

            ()=>{

                /*
                ===================================

                Backend

                CSV

                Excel

                PDF

                Mr Harsh

                ===================================
                */

                showToast(

                    "Preparing export..."

                );

            }

        );


    /* ======================================================
       LOCAL STORAGE
    ====================================================== */

    const calendarView =
        document.getElementById(
            "academyCalendarView"
        );

    if(calendarView){

        const savedView =
            localStorage.getItem(
                "academyTrialCalendarView"
            );

        if(savedView){

            calendarView.value =
                savedView;

        }

        calendarView.addEventListener(

            "change",

            ()=>{

                localStorage.setItem(

                    "academyTrialCalendarView",

                    calendarView.value

                );

            }

        );

    }


    /* ======================================================
       KEYBOARD SHORTCUTS
    ====================================================== */

    document.addEventListener(

        "keydown",

        event=>{

            if(

                event.ctrlKey &&
                event.key.toLowerCase()==="f"

            ){

                event.preventDefault();

                searchInput.focus();

            }

            if(

                event.ctrlKey &&
                event.key.toLowerCase()==="n"

            ){

                event.preventDefault();

                openCreateTrialModal();

            }

            if(

                event.ctrlKey &&
                event.key.toLowerCase()==="e"

            ){

                event.preventDefault();

                document
                    .getElementById(
                        "academyExportTrials"
                    )
                    ?.click();

            }

        }

    );


    /* ======================================================
       DYNAMIC STATS
    ====================================================== */

    function updateDashboardNumbers(){

        document.querySelector(

            '[data-stat="total"]'

        ).textContent =
            trials.length;

        document.querySelector(

            '[data-stat="upcoming"]'

        ).textContent =
            trials.filter(

                t=>t.status==="Upcoming"

            ).length;

        document.querySelector(

            '[data-stat="selected"]'

        ).textContent =

            Math.floor(

                Math.random()*60

            );

    }

    updateDashboardNumbers();


    /* ======================================================
       WINDOW RESIZE
    ====================================================== */

    window.addEventListener(

        "resize",

        ()=>{

            closeSidebar();

            closeProfileDropdown();

        }

    );


    /* ======================================================
       AUTO REFRESH PLACEHOLDER
    ====================================================== */

    /*
    =========================================

    Backend

    Future WebSocket / SSE

    Live trial updates

    Notifications

    Attendance

    Check-ins

    Evaluation status

    =========================================
    */

    setInterval(()=>{

        console.log(

            "Waiting for backend updates..."

        );

    },30000); 

        /* ======================================================
       ACCESSIBILITY
    ====================================================== */

    document
        .querySelectorAll("button")
        .forEach(button=>{

            if(!button.getAttribute("type")){

                button.type = "button";

            }

        });


    /* ======================================================
       ESC KEY
    ====================================================== */

    document.addEventListener(

        "keydown",

        event=>{

            if(event.key !== "Escape") return;

            closeCreateTrialModal();

            closeLogoutModal();

            closeEvaluationDrawer();

            closeProfileDropdown();

            closeSidebar();

        }

    );


    /* ======================================================
       CLICK OUTSIDE MODALS
    ====================================================== */

    [
        createTrialModal,
        logoutModal
    ].forEach(modal=>{

        modal?.addEventListener(

            "click",

            event=>{

                if(event.target===modal){

                    modal.hidden=true;

                    document.body.style.overflow="";

                }

            }

        );

    });


    /* ======================================================
       BACKEND API PLACEHOLDERS
    ====================================================== */

    const AcademyTrialsAPI = {

        loadTrials(){

            /*
            =======================================

            GET

            /api/academy/trials

            Returns

            Upcoming

            Live

            Completed

            Cancelled

            =======================================
            */

        },

        createTrial(payload){

            /*
            POST

            /api/academy/trials

            */

        },

        updateTrial(id,payload){

            /*
            PATCH

            /api/academy/trials/:id

            */

        },

        deleteTrial(id){

            /*
            DELETE

            /api/academy/trials/:id

            */

        },

        loadParticipants(id){

            /*
            GET

            /api/trials/:id/players

            */

        },

        markAttendance(playerId,status){

            /*
            PATCH

            /attendance

            */

        },

        submitEvaluation(playerId,payload){

            /*
            PATCH

            /evaluation

            */

        },

        updateResult(playerId,result){

            /*
            PATCH

            /result

            */

        },

        export(format){

            /*
            GET

            CSV

            Excel

            PDF

            */

        },

        notifyPlayers(ids){

            /*
            POST

            Email

            SMS

            Push Notification

            */

        }

    };


    /* ======================================================
       FUTURE FEATURES
    ====================================================== */

    /*
    ===========================================

    Planned Frontend Upgrades

    • QR Attendance Scanner

    • GPS Attendance

    • AI Recommendation

    • Trial Heat Maps

    • Performance Charts

    • Live Match Tracking

    • Injury Tracking

    • Coach Collaboration

    • Auto-generated Trial Reports

    • FIFA Scout Dashboard

    ===========================================
    */


    /* ======================================================
       PAGE INITIALIZATION
    ====================================================== */

    function initializeTrialsPage(){

        buildCalendar();

        refreshStatistics();

        updateDashboardNumbers();

        highlightCards();

        applySearch();

        closeSidebar();

        closeProfileDropdown();

        console.log(

            "Academy Trials Management initialized."

        );

    }

    initializeTrialsPage();


    /* ======================================================
       DEVELOPMENT BANNER
    ====================================================== */

    console.info(`

============================================================

 FIFA Mission India

 Academy Trials Management

------------------------------------------------------------

 Frontend Lead
 Issac Belho

 Backend Lead
 Mr. Harsh

 Security Engineer
 Samarth

------------------------------------------------------------

 Status

 ✓ Premium Frontend Complete

 ✓ Responsive

 ✓ Accessible

 ✓ Backend Ready

 ✓ API Integration Points Added

------------------------------------------------------------

 Waiting for Backend Integration...

============================================================

`);


    /* ======================================================
       BEFORE UNLOAD
    ====================================================== */

    window.addEventListener(

        "beforeunload",

        event=>{

            const unsavedChanges = false;

            if(!unsavedChanges) return;

            event.preventDefault();

            event.returnValue="";

        }

    );


    /* ======================================================
       END
    ====================================================== */

});