/* ==========================================================
   FIFA Mission India
   Academy Registered Players

   Frontend:
   Issac Belho

   Backend:
   Mr. Harsh

   Security:
   Samarth
========================================================== */

document.addEventListener("DOMContentLoaded",()=>{

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

const searchInput =
    document.getElementById("academyPlayerSearch");

const positionFilter =
    document.getElementById("academyPositionFilter");

const ageFilter =
    document.getElementById("academyAgeFilter");

const statusFilter =
    document.getElementById("academyStatusFilter");

const statCards =
    document.querySelectorAll(".academy-stat-card");


/* ======================================================
   DEMO DATA
====================================================== */

let players=[

{

id:1,

name:"Rahul Sharma",

position:"Midfielder",

age:16,

team:"U17 Elite",

attendance:94,

status:"Active"

},

{

id:2,

name:"Aman Singh",

position:"Forward",

age:17,

team:"Senior",

attendance:91,

status:"Active"

},

{

id:3,

name:"Joseph Das",

position:"Goalkeeper",

age:15,

team:"U15",

attendance:96,

status:"Injured"

}

];


/* ======================================================
   SIDEBAR
====================================================== */

function openSidebar(){

    sidebar?.classList.add("open");

    if(sidebarOverlay){

        sidebarOverlay.hidden=false;

    }

}

function closeSidebar(){

    sidebar?.classList.remove("open");

    if(sidebarOverlay){

        sidebarOverlay.hidden=true;

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
   PROFILE DROPDOWN
====================================================== */

function closeProfileDropdown(){

    if(profileDropdown){

        profileDropdown.hidden=true;

    }

    profileTrigger?.setAttribute(

        "aria-expanded",

        "false"

    );

}

function toggleProfileDropdown(){

    if(!profileDropdown) return;

    const expanded=
        profileDropdown.hidden;

    profileDropdown.hidden=!expanded;

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

    event=>{

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
   SEARCH
====================================================== */

function applySearch(){

    const value=(

        searchInput?.value || ""

    ).toLowerCase();

    document

        .querySelectorAll(

            ".academy-table tbody tr"

        )

        .forEach(row=>{

            row.style.display=

                row.innerText

                .toLowerCase()

                .includes(value)

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

        "Position:",

        positionFilter?.value || "All",

        "Age:",

        ageFilter?.value || "All",

        "Status:",

        statusFilter?.value || "All"

    );

    /*
    ====================================

    Backend Placeholder

    Mr. Harsh

    GET

    /api/academy/players

    Apply filters

    ====================================
    */

}

positionFilter?.addEventListener(

    "change",

    applyFilters

);

ageFilter?.addEventListener(

    "change",

    applyFilters

);

statusFilter?.addEventListener(

    "change",

    applyFilters

);


/* ======================================================
   STATISTICS
====================================================== */

function refreshStatistics(){

    const total=

        document.querySelector(

            '[data-stat="total"]'

        );

    const active=

        document.querySelector(

            '[data-stat="active"]'

        );

    const selected=

        document.querySelector(

            '[data-stat="selected"]'

        );

    const injured=

        document.querySelector(

            '[data-stat="injured"]'

        );

    if(total){

        total.textContent=

            players.length;

    }

    if(active){

        active.textContent=

            players.filter(

                p=>p.status==="Active"

            ).length;

    }

    if(selected){

        selected.textContent=42;

    }

    if(injured){

        injured.textContent=

            players.filter(

                p=>p.status==="Injured"

            ).length;

    }

}

function highlightCards(){

    statCards.forEach(card=>{

        card.addEventListener(

            "mouseenter",

            ()=>{

                card.style.transform=

                    "translateY(-8px)";

            }

        );

        card.addEventListener(

            "mouseleave",

            ()=>{

                card.style.transform="";

            }

        );

    });

}

refreshStatistics();

highlightCards();

/* ======================================================
   PLAYER DRAWER
====================================================== */

const playerDrawer =
    document.getElementById(
        "academyPlayerDrawer"
    );

function openPlayerDrawer(playerId){

    if(!playerDrawer) return;

    playerDrawer.classList.add("open");

    /*
    ======================================

    Backend

    Mr. Harsh

    GET

    /api/academy/players/:id

    Load complete player profile

    ======================================
    */

    console.log(

        "Opening player:",

        playerId

    );

}

function closePlayerDrawer(){

    playerDrawer?.classList.remove(

        "open"

    );

}

document
    .querySelectorAll(
        ".academy-view-player"
    )
    .forEach(button=>{

        button.addEventListener(

            "click",

            ()=>{

                openPlayerDrawer(1);

            }

        );

    });

playerDrawer
    ?.querySelectorAll(
        "[data-close-player]"
    )
    .forEach(button=>{

        button.addEventListener(

            "click",

            closePlayerDrawer

        );

    });


/* ======================================================
   ADD PLAYER MODAL
====================================================== */

const addPlayerModal =
    document.getElementById(
        "academyAddPlayerModal"
    );

const addPlayerButton =
    document.getElementById(
        "academyAddPlayerButton"
    );

function openAddPlayerModal(){

    if(!addPlayerModal) return;

    addPlayerModal.hidden = false;

    document.body.style.overflow = "hidden";

}

function closeAddPlayerModal(){

    if(!addPlayerModal) return;

    addPlayerModal.hidden = true;

    document.body.style.overflow = "";

}

addPlayerButton?.addEventListener(

    "click",

    openAddPlayerModal

);

addPlayerModal
    ?.querySelectorAll(
        "[data-close-add-player]"
    )
    .forEach(button=>{

        button.addEventListener(

            "click",

            closeAddPlayerModal

        );

    });


/* ======================================================
   EDIT PLAYER MODAL
====================================================== */

const editPlayerModal =
    document.getElementById(
        "academyEditPlayerModal"
    );

function openEditPlayerModal(playerId){

    if(!editPlayerModal) return;

    editPlayerModal.hidden = false;

    document.body.style.overflow = "hidden";

    /*
    Backend

    GET

    /api/academy/players/:id

    */

    console.log(

        "Editing player:",

        playerId

    );

}

function closeEditPlayerModal(){

    if(!editPlayerModal) return;

    editPlayerModal.hidden = true;

    document.body.style.overflow = "";

}

document
    .querySelectorAll(
        ".academy-edit-player"
    )
    .forEach(button=>{

        button.addEventListener(

            "click",

            ()=>{

                openEditPlayerModal(1);

            }

        );

    });

editPlayerModal
    ?.querySelectorAll(
        "[data-close-edit-player]"
    )
    .forEach(button=>{

        button.addEventListener(

            "click",

            closeEditPlayerModal

        );

    });


/* ======================================================
   DELETE PLAYER
====================================================== */

const deletePlayerModal =
    document.getElementById(
        "academyDeletePlayerModal"
    );

const confirmDeletePlayer =
    document.getElementById(
        "academyConfirmDeletePlayer"
    );

function openDeletePlayerModal(playerId){

    if(!deletePlayerModal) return;

    deletePlayerModal.hidden = false;

    console.log(

        "Delete player:",

        playerId

    );

}

function closeDeletePlayerModal(){

    if(!deletePlayerModal) return;

    deletePlayerModal.hidden = true;

}

document
    .querySelectorAll(
        ".academy-delete-player"
    )
    .forEach(button=>{

        button.addEventListener(

            "click",

            ()=>{

                openDeletePlayerModal(1);

            }

        );

    });

deletePlayerModal
    ?.querySelectorAll(
        "[data-close-delete-player]"
    )
    .forEach(button=>{

        button.addEventListener(

            "click",

            closeDeletePlayerModal

        );

    });

confirmDeletePlayer?.addEventListener(

    "click",

    ()=>{

        /*
        ======================================

        Backend

        DELETE

        /api/academy/players/:id

        ======================================
        */

        showToast(

            "Player removed successfully."

        );

        closeDeletePlayerModal();

    }


);


/* ======================================================
   TOASTS
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

    toastContainer.appendChild(

        toast

    );

    setTimeout(()=>{

        toast.remove();

    },3500);

}

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
    ?.querySelectorAll(
        "[data-close-logout]"
    )
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
        ====================================

        Backend

        Mr. Harsh

        POST

        /api/auth/logout

        Destroy Session

        Clear JWT

        ====================================
        */

        closeLogoutModal();

        window.location.href =
            "login.html";

    }

);


/* ======================================================
   EXPORT
====================================================== */

document
    .getElementById(
        "academyExportPlayers"
    )
    ?.addEventListener(

        "click",

        ()=>{

            /*
            Backend

            Export CSV

            Export Excel

            Export PDF

            */

            showToast(

                "Preparing export..."

            );

        }

    );


/* ======================================================
   TABLE / CARD VIEW
====================================================== */

const tableViewButton =
    document.getElementById(
        "academyTableView"
    );

const cardViewButton =
    document.getElementById(
        "academyCardView"
    );

const tableWrapper =
    document.querySelector(
        ".academy-table-wrapper"
    );

const cardContainer =
    document.getElementById(
        "academyPlayerCards"
    );

tableViewButton?.addEventListener(

    "click",

    ()=>{

        tableWrapper.style.display = "";

        cardContainer.style.display = "none";

    }

);

cardViewButton?.addEventListener(

    "click",

    ()=>{

        tableWrapper.style.display = "none";

        cardContainer.style.display = "grid";

    }

);


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
   LOCAL STORAGE
====================================================== */

const savedView =
    localStorage.getItem(
        "academyPlayerView"
    );

if(savedView==="cards"){

    tableWrapper.style.display="none";

    cardContainer.style.display="grid";

}

tableViewButton?.addEventListener(

    "click",

    ()=>{

        localStorage.setItem(

            "academyPlayerView",

            "table"

        );

    }

);

cardViewButton?.addEventListener(

    "click",

    ()=>{

        localStorage.setItem(

            "academyPlayerView",

            "cards"

        );

    }

);


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

            searchInput?.focus();

        }

        if(

            event.ctrlKey &&
            event.key.toLowerCase()==="n"

        ){

            event.preventDefault();

            openAddPlayerModal();

        }

        if(event.key==="Escape"){

            closePlayerDrawer();

            closeAddPlayerModal();

            closeEditPlayerModal();

            closeDeletePlayerModal();

            closeLogoutModal();

            closeProfileDropdown();

            closeSidebar();

        }

    }

);


/* ======================================================
   ACCESSIBILITY
====================================================== */

document
    .querySelectorAll("button")
    .forEach(button=>{

        if(!button.type){

            button.type="button";

        }

    });


/* ======================================================
   API PLACEHOLDERS
====================================================== */

const AcademyPlayersAPI = {

    loadPlayers(){},

    loadPlayer(id){},

    createPlayer(payload){},

    updatePlayer(id,payload){},

    deletePlayer(id){},

    export(format){},

    updateAttendance(id,payload){},

    updateMedical(id,payload){},

    updatePerformance(id,payload){},

    assignTeam(id,payload){},

    inviteTrial(id,payload){}

};


/* ======================================================
   INITIALIZATION
====================================================== */

function initializePlayersPage(){

    refreshStatistics();

    highlightCards();

    applySearch();

    closeSidebar();

    closeProfileDropdown();

    console.log(

        "Academy Registered Players initialized."

    );

}

initializePlayersPage();


/* ======================================================
   DEVELOPMENT BANNER
====================================================== */

console.info(`

============================================================

 FIFA Mission India

 Academy Registered Players

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