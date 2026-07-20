/* ======================================================
   FIFA Mission India
   Academy Notifications

   Frontend : Issac Belho
   Backend  : Mr. Harsh
   Security : Samarth
====================================================== */

document.addEventListener(

    "DOMContentLoaded",

    ()=>{

/* ======================================================
   ELEMENT REFERENCES
====================================================== */

const sidebar =
    document.getElementById(
        "academySidebar"
    );

const sidebarOverlay =
    document.getElementById(
        "academySidebarOverlay"
    );

const menuButton =
    document.getElementById(
        "academyMenuButton"
    );

const sidebarClose =
    document.getElementById(
        "academySidebarClose"
    );

const profileTrigger =
    document.getElementById(
        "academyProfileTrigger"
    );

const profileDropdown =
    document.getElementById(
        "academyProfileDropdown"
    );

const notificationSearch =
    document.getElementById(
        "academyNotificationSearch"
    );

const notificationFilter =
    document.getElementById(
        "academyNotificationFilter"
    );

const notificationCards =
    document.querySelectorAll(
        ".academy-notification-card"
    );

const notificationDrawer =
    document.getElementById(
        "academyNotificationDrawer"
    );

const toastContainer =
    document.getElementById(
        "academyToastContainer"
    );

const markAllButton =
    document.getElementById(
        "academyMarkAllRead"
    );

const clearAllButton =
    document.getElementById(
        "academyClearNotifications"
    );

/* ======================================================
   DEMO DATA
====================================================== */

const notifications = [

    {

        id:1,

        title:"New Player Application",

        category:"applications",

        priority:"high",

        read:false

    },

    {

        id:2,

        title:"New Message",

        category:"messages",

        priority:"medium",

        read:true

    },

    {

        id:3,

        title:"Medical Verified",

        category:"documents",

        priority:"success",

        read:true

    }

];

/* ======================================================
   SIDEBAR
====================================================== */

function openSidebar(){

    sidebar?.classList.add(
        "open"
    );

    if(sidebarOverlay){

        sidebarOverlay.hidden=false;

    }

}

function closeSidebar(){

    sidebar?.classList.remove(
        "open"
    );

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

function openProfileDropdown(){

    profileDropdown.hidden=false;

}

function closeProfileDropdown(){

    profileDropdown.hidden=true;

}

profileTrigger?.addEventListener(

    "click",

    event=>{

        event.stopPropagation();

        profileDropdown.hidden

            ? openProfileDropdown()

            : closeProfileDropdown();

    }

);

document.addEventListener(

    "click",

    event=>{

        if(

            profileDropdown &&

            !profileDropdown.contains(
                event.target
            ) &&

            !profileTrigger.contains(
                event.target
            )

        ){

            closeProfileDropdown();

        }

    }

);

/* ======================================================
   SEARCH
====================================================== */

notificationSearch?.addEventListener(

    "input",

    ()=>{

        const keyword =
            notificationSearch.value
            .toLowerCase();

        notificationCards.forEach(card=>{

            const text =
                card.innerText
                .toLowerCase();

            card.style.display =

                text.includes(keyword)

                ? ""

                : "none";

        });

    }

);

/* ======================================================
   FILTER
====================================================== */

notificationFilter?.addEventListener(

    "change",

    ()=>{

        const filter =
            notificationFilter.value;

        notificationCards.forEach(card=>{

            if(filter==="all"){

                card.style.display="";

                return;

            }

            if(filter==="unread"){

                card.style.display=

                    card.classList.contains("unread")

                    ? ""

                    : "none";

                return;

            }

            if(filter==="read"){

                card.style.display=

                    !card.classList.contains("unread")

                    ? ""

                    : "none";

                return;

            }

            card.style.display=

                card.innerHTML
                    .toLowerCase()
                    .includes(filter)

                ? ""

                : "none";

        });

    }

);

/* ======================================================
   NOTIFICATION DRAWER
====================================================== */

function openNotificationDrawer(){

    notificationDrawer?.classList.add(
        "open"
    );

}

function closeNotificationDrawer(){

    notificationDrawer?.classList.remove(
        "open"
    );

}

document
.querySelectorAll(
    ".academy-icon-button .fa-eye"
)
.forEach(icon=>{

    icon.parentElement.addEventListener(

        "click",

        ()=>{

            openNotificationDrawer();

            /*
            ======================================

            Backend
            Mr. Harsh

            GET

            /api/notifications/:id

            ======================================
            */

        }

    );

});

document
.querySelectorAll(
    "[data-close-notification-drawer]"
)
.forEach(button=>{

    button.addEventListener(

        "click",

        closeNotificationDrawer

    );

});


/* ======================================================
   MARK AS READ
====================================================== */

document
.querySelectorAll(
    ".academy-icon-button .fa-check"
)
.forEach(icon=>{

    icon.parentElement.addEventListener(

        "click",

        event=>{

            const card =
                event.currentTarget.closest(
                    ".academy-notification-card"
                );

            card?.classList.remove(
                "unread"
            );

            showToast(

                "Notification marked as read."

            );

            /*
            ======================================

            Backend
            Mr. Harsh

            PATCH

            /api/notifications/read

            ======================================
            */

        }

    );

});


/* ======================================================
   MARK ALL AS READ
====================================================== */

markAllButton?.addEventListener(

    "click",

    ()=>{

        notificationCards.forEach(card=>{

            card.classList.remove(
                "unread"
            );

        });

        showToast(

            "All notifications marked as read."

        );

        /*
        ======================================

        Backend
        Mr. Harsh

        PATCH

        /api/notifications/read-all

        ======================================
        */

    }

);


/* ======================================================
   CLEAR ALL
====================================================== */

clearAllButton?.addEventListener(

    "click",

    ()=>{

        notificationCards.forEach(card=>{

            card.remove();

        });

        showToast(

            "All notifications cleared."

        );

        /*
        ======================================

        Backend
        Mr. Harsh

        DELETE

        /api/notifications/clear

        ======================================
        */

    }

);


/* ======================================================
   DELETE NOTIFICATION
====================================================== */

const deleteModal =
    document.getElementById(
        "academyDeleteNotificationModal"
    );

const confirmDelete =
    document.getElementById(
        "academyConfirmDeleteNotification"
    );

let selectedNotification = null;

document
.querySelectorAll(
    "[data-open-delete-notification]"
)
.forEach(button=>{

    button.addEventListener(

        "click",

        event=>{

            selectedNotification =
                event.currentTarget.closest(
                    ".academy-notification-card"
                );

            deleteModal.hidden = false;

            document.body.style.overflow = "hidden";

        }

    );

});

function closeDeleteModal(){

    deleteModal.hidden = true;

    document.body.style.overflow = "";

}

deleteModal
.querySelectorAll(
    "[data-close-delete-notification]"
)
.forEach(button=>{

    button.addEventListener(

        "click",

        closeDeleteModal

    );

});

confirmDelete?.addEventListener(

    "click",

    ()=>{

        selectedNotification?.remove();

        closeDeleteModal();

        showToast(

            "Notification deleted."

        );

        /*
        ======================================

        Backend
        Mr. Harsh

        DELETE

        /api/notifications/:id

        ======================================
        */

    }

);


/* ======================================================
   TOASTS
====================================================== */

function showToast(message){

    if(!toastContainer) return;

    const toast =
        document.createElement("div");

    toast.className =
        "academy-toast";

    toast.textContent =
        message;

    toastContainer.appendChild(
        toast
    );

    setTimeout(()=>{

        toast.remove();

    },3000);

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

        ======================================
        */

        closeLogoutModal();

        window.location.href =
            "login.html";

    }

);


/* ======================================================
   LOCAL STORAGE
====================================================== */

const savedFilter =
    localStorage.getItem(
        "academyNotificationFilter"
    );

if(savedFilter && notificationFilter){

    notificationFilter.value =
        savedFilter;

}

notificationFilter?.addEventListener(

    "change",

    ()=>{

        localStorage.setItem(

            "academyNotificationFilter",

            notificationFilter.value

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

            notificationSearch?.focus();

        }

        if(

            event.ctrlKey &&
            event.key.toLowerCase()==="a"

        ){

            event.preventDefault();

            markAllButton?.click();

        }

        if(event.key==="Escape"){

            closeSidebar();

            closeProfileDropdown();

            closeNotificationDrawer();

            closeDeleteModal();

            closeLogoutModal();

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

const AcademyNotificationsAPI = {

    loadNotifications(){},

    loadNotification(id){},

    markAsRead(id){},

    markAllRead(){},

    deleteNotification(id){},

    clearNotifications(){},

    search(keyword){},

    filter(category){},

    loadStatistics(){},

    subscribeRealtime(){}

};


/* ======================================================
   INITIALIZATION
====================================================== */

function initializeNotificationsPage(){

    closeSidebar();

    closeProfileDropdown();

    console.log(

        "Academy Notifications initialized."

    );

}

initializeNotificationsPage();


/* ======================================================
   DEVELOPMENT CONSOLE
====================================================== */

console.info(`

============================================================

 FIFA Mission India

 Academy Notifications

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

 ✓ Notification Centre Ready

 ✓ API Placeholders Added

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