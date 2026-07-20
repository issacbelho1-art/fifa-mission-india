/* ======================================================
   FIFA Mission India
   Academy Documents

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

const documentSearch =
    document.getElementById(
        "academyDocumentSearch"
    );

const categoryFilter =
    document.getElementById(
        "academyCategoryFilter"
    );

const statusFilter =
    document.getElementById(
        "academyStatusFilter"
    );

const documentRows =
    document.querySelectorAll(
        ".academy-document-row"
    );

const uploadButton =
    document.getElementById(
        "academyUploadDocument"
    );

const uploadModal =
    document.getElementById(
        "academyUploadModal"
    );

const drawer =
    document.getElementById(
        "academyDocumentDrawer"
    );

const toastContainer =
    document.getElementById(
        "academyToastContainer"
    );

const selectAll =
    document.getElementById(
        "academySelectAll"
    );

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

function openProfile(){

    profileDropdown.hidden=false;

}

function closeProfile(){

    profileDropdown.hidden=true;

}

profileTrigger?.addEventListener(

    "click",

    event=>{

        event.stopPropagation();

        profileDropdown.hidden

            ? openProfile()

            : closeProfile();

    }

);

document.addEventListener(

    "click",

    event=>{

        if(

            profileDropdown &&

            !profileDropdown.contains(event.target)

            &&

            !profileTrigger.contains(event.target)

        ){

            closeProfile();

        }

    }

);

/* ======================================================
   SEARCH
====================================================== */

documentSearch?.addEventListener(

    "input",

    ()=>{

        const keyword =
            documentSearch.value
            .toLowerCase();

        documentRows.forEach(row=>{

            row.style.display =

                row.innerText
                .toLowerCase()
                .includes(keyword)

                ? ""

                : "none";

        });

    }

);

/* ======================================================
   CATEGORY FILTER
====================================================== */

categoryFilter?.addEventListener(

    "change",

    ()=>{

        applyFilters();

    }

);

/* ======================================================
   STATUS FILTER
====================================================== */

statusFilter?.addEventListener(

    "change",

    ()=>{

        applyFilters();

    }

);

function applyFilters(){

    const category =
        categoryFilter.value.toLowerCase();

    const status =
        statusFilter.value.toLowerCase();

    documentRows.forEach(row=>{

        let visible=true;

        if(

            category!=="all" &&

            !row.innerHTML
            .toLowerCase()
            .includes(category)

        ){

            visible=false;

        }

        if(

            status!=="all" &&

            !row.classList.contains(status)

        ){

            visible=false;

        }

        row.style.display =

            visible

            ? ""

            : "none";

    });

}

/* ======================================================
   SELECT ALL
====================================================== */

selectAll?.addEventListener(

    "change",

    ()=>{

        document
        .querySelectorAll(

            ".academy-document-row input[type='checkbox']"

        )

        .forEach(box=>{

            box.checked =
                selectAll.checked;

        });

    }

);

/* ======================================================
   DOCUMENT PREVIEW DRAWER
====================================================== */

function openDrawer(){

    drawer?.classList.add("open");

}

function closeDrawer(){

    drawer?.classList.remove("open");

}

document
.querySelectorAll(".fa-eye")
.forEach(icon=>{

    icon.closest("button")?.addEventListener(

        "click",

        ()=>{

            openDrawer();

            /*
            =========================================

            Backend
            Mr. Harsh

            GET

            /api/documents/:id

            =========================================
            */

        }

    );

});

document
.querySelectorAll("[data-close-document-drawer]")
.forEach(button=>{

    button.addEventListener(

        "click",

        closeDrawer

    );

});


/* ======================================================
   UPLOAD MODAL
====================================================== */

const uploadForm =
    document.getElementById(
        "academyUploadForm"
    );

document
.querySelectorAll(
    "[data-close-upload-modal]"
)
.forEach(button=>{

    button.addEventListener(

        "click",

        ()=>{

            uploadModal.hidden=true;

            document.body.style.overflow="";

        }

    );

});

uploadButton?.addEventListener(

    "click",

    ()=>{

        uploadModal.hidden=false;

        document.body.style.overflow="hidden";

    }

);

uploadForm?.addEventListener(

    "submit",

    event=>{

        event.preventDefault();

        uploadModal.hidden=true;

        document.body.style.overflow="";

        showToast(

            "Document uploaded successfully."

        );

        /*
        =========================================

        Backend
        Mr. Harsh

        POST

        /api/documents/upload

        =========================================
        */

    }

);


/* ======================================================
   DOWNLOAD
====================================================== */

document
.querySelectorAll(".fa-download")
.forEach(icon=>{

    icon.closest("button")?.addEventListener(

        "click",

        ()=>{

            showToast(

                "Download will begin after backend integration."

            );

            /*
            =========================================

            Backend

            GET

            /api/documents/download/:id

            =========================================
            */

        }

    );

});


/* ======================================================
   VERIFY DOCUMENT
====================================================== */

document
.querySelectorAll(".academy-success-button")
.forEach(button=>{

    button.addEventListener(

        "click",

        ()=>{

            showToast(

                "Document verified."

            );

            /*
            =========================================

            Backend

            PATCH

            /api/documents/verify

            =========================================
            */

        }

    );

});


/* ======================================================
   REJECT DOCUMENT
====================================================== */

document
.querySelectorAll(".academy-danger-button")
.forEach(button=>{

    if(button.id==="academyConfirmDeleteDocument"){

        return;

    }

    button.addEventListener(

        "click",

        ()=>{

            showToast(

                "Document rejected."

            );

            /*
            =========================================

            Backend

            PATCH

            /api/documents/reject

            =========================================
            */

        }

    );

});


/* ======================================================
   REPLACE DOCUMENT
====================================================== */

document
.querySelectorAll(".academy-secondary-button")
.forEach(button=>{

    if(

        button.textContent
        .includes("Replace")

    ){

        button.addEventListener(

            "click",

            ()=>{

                showToast(

                    "Replace document feature."

                );

                /*
                =====================================

                Backend

                PUT

                /api/documents/:id

                =====================================
                */

            }

        );

    }

});


/* ======================================================
   DELETE DOCUMENT
====================================================== */

const deleteModal =
    document.getElementById(
        "academyDeleteDocumentModal"
    );

const confirmDelete =
    document.getElementById(
        "academyConfirmDeleteDocument"
    );

let selectedRow=null;

document
.querySelectorAll(
    "[data-open-delete-document]"
)
.forEach(button=>{

    button.addEventListener(

        "click",

        event=>{

            selectedRow=

                event.currentTarget.closest("tr");

            deleteModal.hidden=false;

            document.body.style.overflow="hidden";

        }

    );

});

document
.querySelectorAll(
    "[data-close-delete-document]"
)
.forEach(button=>{

    button.addEventListener(

        "click",

        ()=>{

            deleteModal.hidden=true;

            document.body.style.overflow="";

        }

    );

});

confirmDelete?.addEventListener(

    "click",

    ()=>{

        selectedRow?.remove();

        deleteModal.hidden=true;

        document.body.style.overflow="";

        showToast(

            "Document deleted."

        );

        /*
        =========================================

        Backend

        DELETE

        /api/documents/:id

        =========================================
        */

    }

);


/* ======================================================
   TOASTS
====================================================== */

function showToast(message){

    if(!toastContainer) return;

    const toast=document.createElement("div");

    toast.className="academy-toast";

    toast.textContent=message;

    toastContainer.appendChild(toast);

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
   BULK VERIFY
====================================================== */

const bulkVerify =
    document.getElementById(
        "academyBulkVerify"
    );

bulkVerify?.addEventListener(

    "click",

    ()=>{

        const checked =
            document.querySelectorAll(

                ".academy-document-row input[type='checkbox']:checked"

            );

        if(!checked.length){

            showToast(

                "Select at least one document."

            );

            return;

        }

        showToast(

            `${checked.length} document(s) verified.`

        );

        /*
        Backend

        PATCH

        /api/documents/verify
        */

    }

);


/* ======================================================
   BULK DELETE
====================================================== */

const bulkDelete =
    document.getElementById(
        "academyBulkDelete"
    );

bulkDelete?.addEventListener(

    "click",

    ()=>{

        const checked =
            document.querySelectorAll(

                ".academy-document-row input[type='checkbox']:checked"

            );

        if(!checked.length){

            showToast(

                "Select documents first."

            );

            return;

        }

        checked.forEach(box=>{

            box.closest("tr")?.remove();

        });

        showToast(

            "Selected documents deleted."

        );

        /*
        Backend

        DELETE

        /api/documents
        */

    }

);


/* ======================================================
   LOCAL STORAGE
====================================================== */

const savedCategory =
    localStorage.getItem(
        "academyDocumentCategory"
    );

const savedStatus =
    localStorage.getItem(
        "academyDocumentStatus"
    );

if(savedCategory){

    categoryFilter.value =
        savedCategory;

}

if(savedStatus){

    statusFilter.value =
        savedStatus;

}

categoryFilter?.addEventListener(

    "change",

    ()=>{

        localStorage.setItem(

            "academyDocumentCategory",

            categoryFilter.value

        );

    }

);

statusFilter?.addEventListener(

    "change",

    ()=>{

        localStorage.setItem(

            "academyDocumentStatus",

            statusFilter.value

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

            documentSearch?.focus();

        }

        if(

            event.ctrlKey &&

            event.key.toLowerCase()==="u"

        ){

            event.preventDefault();

            uploadButton?.click();

        }

        if(event.key==="Escape"){

            closeSidebar();

            closeProfile();

            closeDrawer();

            closeLogoutModal();

            uploadModal.hidden = true;

            deleteModal.hidden = true;

            document.body.style.overflow = "";

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
   API PLACEHOLDER
====================================================== */

const AcademyDocumentsAPI = {

    loadDocuments(){},

    loadDocument(id){},

    uploadDocument(){},

    verifyDocument(id){},

    rejectDocument(id){},

    replaceDocument(id){},

    deleteDocument(id){},

    bulkDelete(){},

    bulkVerify(){},

    downloadDocument(id){}

};


/* ======================================================
   INITIALIZATION
====================================================== */

function initializeDocumentsPage(){

    closeSidebar();

    closeProfile();

    console.log(

        "Academy Documents initialized."

    );

}

initializeDocumentsPage();


/* ======================================================
   DEVELOPMENT CONSOLE
====================================================== */

console.info(`

============================================================

 FIFA Mission India

 Academy Documents

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

 ✓ Document Management Ready

 ✓ Upload Interface Ready

 ✓ Preview Drawer Ready

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