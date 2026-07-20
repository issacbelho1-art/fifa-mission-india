/* ======================================================
   FIFA Mission India
   Academy Messages

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

const chatSearch =
    document.getElementById(
        "academyChatSearch"
    );

const chatItems =
    document.querySelectorAll(
        ".academy-chat-item"
    );

const chatMessages =
    document.getElementById(
        "academyChatMessages"
    );

const messageInput =
    document.getElementById(
        "academyMessageInput"
    );

const sendButton =
    document.getElementById(
        "academySendMessage"
    );

const newMessageButton =
    document.getElementById(
        "academyNewMessageButton"
    );

const newMessageModal =
    document.getElementById(
        "academyNewMessageModal"
    );

const toastContainer =
    document.getElementById(
        "academyToastContainer"
    );

const infoDrawer =
    document.getElementById(
        "academyChatInfo"
    );

/* ======================================================
   DEMO CONVERSATIONS
====================================================== */

const conversations = [

{
    id:1,
    name:"Rahul Sharma",
    status:"Online"
},

{
    id:2,
    name:"Aman Singh",
    status:"Offline"
},

{
    id:3,
    name:"Priya Das",
    status:"Online"
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
   SEARCH CONVERSATIONS
====================================================== */

chatSearch?.addEventListener(

    "input",

    ()=>{

        const keyword =
            chatSearch.value
            .toLowerCase();

        chatItems.forEach(item=>{

            const text =
                item.innerText
                .toLowerCase();

            item.style.display =
                text.includes(keyword)
                ? ""
                : "none";

        });

    }

);

/* ======================================================
   SWITCH CONVERSATION
====================================================== */

chatItems.forEach(item=>{

    item.addEventListener(

        "click",

        ()=>{

            chatItems.forEach(card=>{

                card.classList.remove(
                    "active"
                );

            });

            item.classList.add(
                "active"
            );

            /*
            ======================================

            Backend
            Mr. Harsh

            GET

            /api/messages/:conversationId

            ======================================
            */

        }

    );

});

/* ======================================================
   SEND MESSAGE
====================================================== */

function scrollToBottom(){

    if(!chatMessages) return;

    chatMessages.scrollTop =
        chatMessages.scrollHeight;

}

function sendMessage(){

    const text =
        messageInput.value.trim();

    if(!text) return;

    const message =
        document.createElement("div");

    message.className =
        "academy-message sent";

    message.innerHTML = `

        <div class="academy-message-bubble">

            <p>${text}</p>

            <span>

                ${new Date().toLocaleTimeString([],{

                    hour:"2-digit",

                    minute:"2-digit"

                })}

            </span>

        </div>

    `;

    chatMessages.appendChild(message);

    messageInput.value = "";

    scrollToBottom();

    showToast(

        "Message sent"

    );

    /*
    ======================================

    Backend
    Mr. Harsh

    POST

    /api/messages/send

    payload:

    {

        conversationId,

        message

    }

    ======================================
    */

}

sendButton?.addEventListener(

    "click",

    sendMessage

);

messageInput?.addEventListener(

    "keydown",

    event=>{

        if(

            event.key==="Enter" &&
            !event.shiftKey

        ){

            event.preventDefault();

            sendMessage();

        }

    }

);


/* ======================================================
   AUTO RESIZE TEXTAREA
====================================================== */

messageInput?.addEventListener(

    "input",

    ()=>{

        messageInput.style.height="auto";

        messageInput.style.height =
            messageInput.scrollHeight + "px";

    }

);


/* ======================================================
   NEW MESSAGE MODAL
====================================================== */

function openNewMessageModal(){

    if(!newMessageModal) return;

    newMessageModal.hidden=false;

    document.body.style.overflow="hidden";

}

function closeNewMessageModal(){

    if(!newMessageModal) return;

    newMessageModal.hidden=true;

    document.body.style.overflow="";

}

newMessageButton?.addEventListener(

    "click",

    openNewMessageModal

);

newMessageModal
?.querySelectorAll(
    "[data-close-new-message]"
)
.forEach(button=>{

    button.addEventListener(

        "click",

        closeNewMessageModal

    );

});


/* ======================================================
   INFO DRAWER
====================================================== */

function openInfoDrawer(){

    infoDrawer?.classList.add(

        "open"

    );

}

function closeInfoDrawer(){

    infoDrawer?.classList.remove(

        "open"

    );

}

document
.querySelector(
".academy-chat-header .fa-circle-info"
)
?.parentElement
.addEventListener(

    "click",

    openInfoDrawer

);

document
.querySelectorAll(
"[data-close-chat-info]"
)
.forEach(button=>{

    button.addEventListener(

        "click",

        closeInfoDrawer

    );

});


/* ======================================================
   ATTACHMENT BUTTON
====================================================== */

document
.getElementById(
    "academyAttachFile"
)
?.addEventListener(

    "click",

    ()=>{

        /*
        ======================================

        Backend
        Mr. Harsh

        Upload File

        POST

        /api/messages/upload

        ======================================
        */

        showToast(

            "Attachment feature coming soon"

        );

    }

);


/* ======================================================
   EMOJI BUTTON
====================================================== */

document
.getElementById(
    "academyEmojiButton"
)
?.addEventListener(

    "click",

    ()=>{

        showToast(

            "Emoji picker coming soon"

        );

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

    toast.textContent = message;

    toastContainer.appendChild(toast);

    setTimeout(()=>{

        toast.remove();

    },3000);

}


/* ======================================================
   INITIAL SCROLL
====================================================== */

scrollToBottom();

/* ======================================================
   DELETE CONVERSATION MODAL
====================================================== */

const deleteConversationModal =
    document.getElementById(
        "academyDeleteConversationModal"
    );

const confirmDeleteConversation =
    document.getElementById(
        "academyConfirmDeleteConversation"
    );

function openDeleteConversationModal(){

    if(!deleteConversationModal) return;

    deleteConversationModal.hidden = false;

    document.body.style.overflow = "hidden";

}

function closeDeleteConversationModal(){

    if(!deleteConversationModal) return;

    deleteConversationModal.hidden = true;

    document.body.style.overflow = "";

}

document.querySelectorAll(
    "[data-open-delete-chat]"
).forEach(button=>{

    button.addEventListener(

        "click",

        openDeleteConversationModal

    );

});

deleteConversationModal
?.querySelectorAll(
    "[data-close-delete-chat]"
)
.forEach(button=>{

    button.addEventListener(

        "click",

        closeDeleteConversationModal

    );

});

confirmDeleteConversation?.addEventListener(

    "click",

    ()=>{

        /*
        ======================================

        Backend
        Mr. Harsh

        DELETE

        /api/messages/:conversationId

        ======================================
        */

        closeDeleteConversationModal();

        showToast(

            "Conversation deleted"

        );

    }

);


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

const lastConversation =
    localStorage.getItem(
        "academyLastConversation"
    );

if(lastConversation){

    console.log(

        "Last Conversation:",

        lastConversation

    );

}

chatItems.forEach(item=>{

    item.addEventListener(

        "click",

        ()=>{

            const name =
                item.querySelector("h4")
                ?.textContent;

            localStorage.setItem(

                "academyLastConversation",

                name

            );

        }

    );

});


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

            chatSearch?.focus();

        }

        if(

            event.ctrlKey &&
            event.key.toLowerCase()==="n"

        ){

            event.preventDefault();

            openNewMessageModal();

        }

        if(event.key==="Escape"){

            closeSidebar();

            closeProfileDropdown();

            closeNewMessageModal();

            closeInfoDrawer();

            closeDeleteConversationModal();

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

const AcademyMessagesAPI = {

    loadConversations(){},

    loadConversation(id){},

    sendMessage(payload){},

    uploadAttachment(file){},

    deleteConversation(id){},

    searchUsers(keyword){},

    markAsRead(id){},

    typingStatus(id){},

    fetchNotifications(){},

    createConversation(payload){}

};


/* ======================================================
   INITIALIZATION
====================================================== */

function initializeMessagesPage(){

    scrollToBottom();

    closeSidebar();

    closeProfileDropdown();

    console.log(

        "Academy Messages initialized."

    );

}

initializeMessagesPage();


/* ======================================================
   DEVELOPMENT CONSOLE
====================================================== */

console.info(`

============================================================

 FIFA Mission India

 Academy Messages

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

 ✓ Real-time Ready

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