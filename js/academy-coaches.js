/* ==========================================================
   FIFA Mission India
   Academy Coaches & Staff

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
    document.getElementById("academyStaffSearch");

const roleFilter =
    document.getElementById("academyRoleFilter");

const teamFilter =
    document.getElementById("academyTeamFilter");

const statusFilter =
    document.getElementById("academyStatusFilter");

const statCards =
    document.querySelectorAll(".academy-stat-card");


/* ======================================================
   DEMO STAFF DATA
====================================================== */

let staff=[

{

id:1,

name:"Rahul Mehta",

role:"Head Coach",

team:"Senior",

license:"AFC A",

experience:12,

attendance:96,

status:"Active"

},

{

id:2,

name:"David Joseph",

role:"Fitness Trainer",

team:"U17",

license:"AIFF C",

experience:8,

attendance:91,

status:"Active"

},

{

id:3,

name:"Samuel Das",

role:"Physiotherapist",

team:"All Teams",

license:"Certified",

experience:6,

attendance:98,

status:"Active"

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

        "Role:",

        roleFilter?.value || "All",

        "Team:",

        teamFilter?.value || "All",

        "Status:",

        statusFilter?.value || "All"

    );

    /*
    ====================================

    Backend Placeholder

    Mr. Harsh

    GET

    /api/academy/staff

    Apply filters

    ====================================
    */

}

roleFilter?.addEventListener(

    "change",

    applyFilters

);

teamFilter?.addEventListener(

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

    const total =
        document.querySelector(
            '[data-stat="total"]'
        );

    const licensed =
        document.querySelector(
            '[data-stat="licensed"]'
        );

    const medical =
        document.querySelector(
            '[data-stat="medical"]'
        );

    const attendance =
        document.querySelector(
            '[data-stat="attendance"]'
        );

    if(total){

        total.textContent =
            staff.length;

    }

    if(licensed){

        licensed.textContent =
            staff.filter(

                s=>s.license

            ).length;

    }

    if(medical){

        medical.textContent =
            staff.filter(

                s=>

                s.role.includes("Physio")

            ).length;

    }

    if(attendance){

        attendance.textContent="96%";

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
   STAFF PROFILE DRAWER
====================================================== */

const staffDrawer =
    document.getElementById(
        "academyStaffDrawer"
    );

function openStaffDrawer(staffId){

    if(!staffDrawer) return;

    staffDrawer.classList.add("open");

    /*
    ======================================

    Backend

    Mr. Harsh

    GET

    /api/academy/staff/:id

    Load complete staff profile

    ======================================
    */

    console.log(

        "Opening staff:",

        staffId

    );

}

function closeStaffDrawer(){

    staffDrawer?.classList.remove(

        "open"

    );

}

document
    .querySelectorAll(
        ".academy-view-staff"
    )
    .forEach(button=>{

        button.addEventListener(

            "click",

            ()=>{

                openStaffDrawer(1);

            }

        );

    });

staffDrawer
    ?.querySelectorAll(
        "[data-close-staff-drawer]"
    )
    .forEach(button=>{

        button.addEventListener(

            "click",

            closeStaffDrawer

        );

    });


/* ======================================================
   ADD STAFF MODAL
====================================================== */

const addStaffModal =
    document.getElementById(
        "academyAddStaffModal"
    );

const addStaffButton =
    document.getElementById(
        "academyAddStaffButton"
    );

function openAddStaffModal(){

    if(!addStaffModal) return;

    addStaffModal.hidden = false;

    document.body.style.overflow = "hidden";

}

function closeAddStaffModal(){

    if(!addStaffModal) return;

    addStaffModal.hidden = true;

    document.body.style.overflow = "";

}

addStaffButton?.addEventListener(

    "click",

    openAddStaffModal

);

addStaffModal
    ?.querySelectorAll(
        "[data-close-add-staff]"
    )
    .forEach(button=>{

        button.addEventListener(

            "click",

            closeAddStaffModal

        );

    });


/* ======================================================
   EDIT STAFF MODAL
====================================================== */

const editStaffModal =
    document.getElementById(
        "academyEditStaffModal"
    );

function openEditStaffModal(staffId){

    if(!editStaffModal) return;

    editStaffModal.hidden = false;

    document.body.style.overflow = "hidden";

    /*
    ======================================

    Backend

    GET

    /api/academy/staff/:id

    ======================================
    */

    console.log(

        "Editing staff:",

        staffId

    );

}

function closeEditStaffModal(){

    if(!editStaffModal) return;

    editStaffModal.hidden = true;

    document.body.style.overflow = "";

}

document
    .querySelectorAll(
        ".academy-edit-staff"
    )
    .forEach(button=>{

        button.addEventListener(

            "click",

            ()=>{

                openEditStaffModal(1);

            }

        );

    });

editStaffModal
    ?.querySelectorAll(
        "[data-close-edit-staff]"
    )
    .forEach(button=>{

        button.addEventListener(

            "click",

            closeEditStaffModal

        );

    });


/* ======================================================
   DELETE STAFF
====================================================== */

const deleteStaffModal =
    document.getElementById(
        "academyDeleteStaffModal"
    );

const confirmDeleteStaff =
    document.getElementById(
        "academyConfirmDeleteStaff"
    );

function openDeleteStaffModal(staffId){

    if(!deleteStaffModal) return;

    deleteStaffModal.hidden = false;

    console.log(

        "Delete staff:",

        staffId

    );

}

function closeDeleteStaffModal(){

    if(!deleteStaffModal) return;

    deleteStaffModal.hidden = true;

}

document
    .querySelectorAll(
        ".academy-delete-staff"
    )
    .forEach(button=>{

        button.addEventListener(

            "click",

            ()=>{

                openDeleteStaffModal(1);

            }

        );

    });

deleteStaffModal
    ?.querySelectorAll(
        "[data-close-delete-staff]"
    )
    .forEach(button=>{

        button.addEventListener(

            "click",

            closeDeleteStaffModal

        );

    });

confirmDeleteStaff?.addEventListener(

    "click",

    ()=>{

        /*
        ======================================

        Backend

        DELETE

        /api/academy/staff/:id

        ======================================
        */

        showToast(

            "Staff member removed successfully."

        );

        closeDeleteStaffModal();

    }

);


/* ======================================================
   TOAST NOTIFICATIONS
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
        ======================================

        Backend
        Mr. Harsh

        POST
        /api/auth/logout

        Destroy Session
        Clear JWT

        ======================================
        */

        closeLogoutModal();

        window.location.href = "login.html";

    }

);


/* ======================================================
   EXPORT STAFF
====================================================== */

document
    .getElementById(
        "academyExportStaff"
    )
    ?.addEventListener(

        "click",

        ()=>{

            /*
            ======================================

            Backend
            Mr. Harsh

            Export PDF
            Export Excel
            Export CSV

            ======================================
            */

            showToast(

                "Preparing export..."

            );

        }

    );


/* ======================================================
   BULK SELECTION
====================================================== */

const selectAll =
    document.getElementById(
        "academySelectAllStaff"
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

const savedFilter =
    localStorage.getItem(
        "academyStaffRole"
    );

if(savedFilter && roleFilter){

    roleFilter.value = savedFilter;

}

roleFilter?.addEventListener(

    "change",

    ()=>{

        localStorage.setItem(

            "academyStaffRole",

            roleFilter.value

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

            openAddStaffModal();

        }

        if(event.key==="Escape"){

            closeStaffDrawer();

            closeAddStaffModal();

            closeEditStaffModal();

            closeDeleteStaffModal();

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

            button.type = "button";

        }

    });


/* ======================================================
   API PLACEHOLDERS
====================================================== */

const AcademyStaffAPI = {

    loadStaff(){},

    loadStaffMember(id){},

    createStaff(payload){},

    updateStaff(id,payload){},

    deleteStaff(id){},

    uploadCertificate(id,file){},

    assignTeam(id,payload){},

    updateAttendance(id,payload){},

    updatePerformance(id,payload){},

    export(format){}

};


/* ======================================================
   INITIALIZATION
====================================================== */

function initializeStaffPage(){

    refreshStatistics();

    highlightCards();

    applySearch();

    closeSidebar();

    closeProfileDropdown();

    console.log(

        "Academy Coaches & Staff initialized."

    );

}

initializeStaffPage();


/* ======================================================
   DEVELOPMENT CONSOLE
====================================================== */

console.info(`

============================================================

 FIFA Mission India

 Academy Coaches & Staff

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

        event.returnValue = "";

    }

);


/* ======================================================
   END
====================================================== */

});