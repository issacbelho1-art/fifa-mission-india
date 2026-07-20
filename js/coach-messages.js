"use strict";

/* ==========================================================
   FIFA MISSION INDIA
   Coach Messages
   Part 1

   Includes

   • Sidebar
   • Mobile Menu
   • Notification Dropdown
   • Profile Dropdown
   • Conversation Switching
   • Search
   • Conversation Filters
   • Chat Search
   • Pinned Message
   • Utilities
========================================================== */


/* ==========================================================
   PAGE READY
========================================================== */

window.addEventListener("load", () => {

    document.body.classList.remove("performance-page-loading");

    document.body.classList.add("performance-page-ready");

});


/* ==========================================================
   HELPERS
========================================================== */

const $ = selector => document.querySelector(selector);

const $$ = selector => [...document.querySelectorAll(selector)];

const body = document.body;


/* ==========================================================
   SIDEBAR
========================================================== */

const sidebar = $("#coachSidebar");

const sidebarOverlay = $("#coachSidebarOverlay");

const mobileMenuButton = $("#coachMobileMenuButton");

const sidebarCloseButton = $("#coachSidebarClose");


function openSidebar() {

    sidebar.classList.add("active");

    sidebarOverlay.classList.add("active");

    body.classList.add("coach-sidebar-open");

    mobileMenuButton?.setAttribute("aria-expanded", "true");

}


function closeSidebar() {

    sidebar.classList.remove("active");

    sidebarOverlay.classList.remove("active");

    body.classList.remove("coach-sidebar-open");

    mobileMenuButton?.setAttribute("aria-expanded", "false");

}


mobileMenuButton?.addEventListener("click", openSidebar);

sidebarCloseButton?.addEventListener("click", closeSidebar);

sidebarOverlay?.addEventListener("click", closeSidebar);


/* ==========================================================
   ESCAPE CLOSE
========================================================== */

document.addEventListener("keydown", event => {

    if (event.key !== "Escape") return;

    closeSidebar();

});


/* ==========================================================
   NOTIFICATION DROPDOWN
========================================================== */

const notificationButton = $("#coachNotificationButton");

const notificationDropdown = $("#coachNotificationDropdown");


notificationButton?.addEventListener("click", event => {

    event.stopPropagation();

    notificationDropdown.toggleAttribute("aria-hidden");

    const expanded =
        notificationButton.getAttribute("aria-expanded") === "true";

    notificationButton.setAttribute(
        "aria-expanded",
        String(!expanded)
    );

});


/* ==========================================================
   PROFILE DROPDOWN
========================================================== */

const profileButton = $("#coachProfileButton");

const profileDropdown = $("#coachProfileDropdown");


profileButton?.addEventListener("click", event => {

    event.stopPropagation();

    profileDropdown.toggleAttribute("aria-hidden");

    const expanded =
        profileButton.getAttribute("aria-expanded") === "true";

    profileButton.setAttribute(
        "aria-expanded",
        String(!expanded)
    );

});


/* ==========================================================
   CLOSE DROPDOWNS
========================================================== */

document.addEventListener("click", () => {

    if (notificationDropdown) {

        notificationDropdown.setAttribute(
            "aria-hidden",
            "true"
        );

    }

    if (profileDropdown) {

        profileDropdown.setAttribute(
            "aria-hidden",
            "true"
        );

    }

    notificationButton?.setAttribute(
        "aria-expanded",
        "false"
    );

    profileButton?.setAttribute(
        "aria-expanded",
        "false"
    );

});


/* ==========================================================
   CONVERSATION DATA
========================================================== */

const conversationItems = $$(".coach-conversation-item");

const activeConversationName = $("#activeConversationName");

const contactDetailsName = $("#contactDetailsName");


conversationItems.forEach(item => {

    item.addEventListener("click", () => {

        conversationItems.forEach(card => {

            card.classList.remove("active");

            card.removeAttribute("aria-current");

        });

        item.classList.add("active");

        item.setAttribute("aria-current", "true");

        const name =
            item.dataset.conversationName || "Conversation";

        activeConversationName.textContent = name;

        contactDetailsName.textContent = name;

        item.classList.remove("unread");

        updateUnreadBadge();

    });

});


/* ==========================================================
   UPDATE UNREAD
========================================================== */

function updateUnreadBadge() {

    const unread =
        document.querySelectorAll(
            ".coach-conversation-item.unread"
        ).length;

    const hero = $("#heroUnreadCount");

    const sidebarBadge =
        $("#sidebarUnreadMessageCount");

    if (hero)
        hero.textContent = unread;

    if (sidebarBadge)
        sidebarBadge.textContent = unread;

}


/* ==========================================================
   CONVERSATION SEARCH
========================================================== */

const conversationSearch =
    $("#conversationSearchInput");

const clearConversationSearch =
    $("#clearConversationSearch");

const conversationEmpty =
    $("#coachConversationEmpty");


conversationSearch?.addEventListener("input", () => {

    const value =
        conversationSearch.value
            .trim()
            .toLowerCase();

    let visible = 0;

    conversationItems.forEach(item => {

        const name =
            item.dataset.conversationName
                .toLowerCase();

        const show =
            name.includes(value);

        item.hidden = !show;

        if (show) visible++;

    });

    conversationEmpty.hidden =
        visible !== 0;

    clearConversationSearch.hidden =
        value.length === 0;

});


clearConversationSearch?.addEventListener("click", () => {

    conversationSearch.value = "";

    conversationItems.forEach(item => {

        item.hidden = false;

    });

    clearConversationSearch.hidden = true;

    conversationEmpty.hidden = true;

});


/* ==========================================================
   FILTERS
========================================================== */

const filterButtons =
    $$(".coach-conversation-filters button");


filterButtons.forEach(button => {

    button.addEventListener("click", () => {

        filterButtons.forEach(btn =>
            btn.classList.remove("active")
        );

        button.classList.add("active");

        const filter =
            button.dataset.conversationFilter;

        conversationItems.forEach(item => {

            switch (filter) {

                case "all":

                    item.hidden = false;

                    break;

                case "unread":

                    item.hidden =
                        !item.classList.contains("unread");

                    break;

                case "groups":

                    item.hidden =
                        item.dataset.conversationType !==
                        "group";

                    break;

                case "archived":

                    item.hidden =
                        item.dataset.conversationStatus !==
                        "archived";

                    break;

            }

        });

    });

});


/* ==========================================================
   CHAT SEARCH
========================================================== */

const chatSearchPanel =
    $("#coachChatSearchPanel");

const chatSearchInput =
    $("#coachChatSearchInput");

const chatMenuSearch =
    document.querySelector(
        '[data-chat-action="search"]'
    );

const closeChatSearch =
    $("#closeCoachChatSearch");


chatMenuSearch?.addEventListener("click", () => {

    chatSearchPanel.hidden = false;

    chatSearchInput.focus();

});


closeChatSearch?.addEventListener("click", () => {

    chatSearchPanel.hidden = true;

    chatSearchInput.value = "";

});


chatSearchInput?.addEventListener("input", () => {

    const value =
        chatSearchInput.value.toLowerCase();

    let results = 0;

    $$(".coach-message").forEach(message => {

        const text =
            (
                message.dataset.messageText || ""
            ).toLowerCase();

        const matched =
            text.includes(value);

        message.classList.toggle(
            "coach-message-highlight",
            matched && value !== ""
        );

        if (matched && value !== "")
            results++;

    });

    $("#coachChatSearchResultCount").textContent =
        `${results} result${results === 1 ? "" : "s"}`;

});


/* ==========================================================
   PINNED MESSAGE
========================================================== */

$("#dismissPinnedMessage")
    ?.addEventListener("click", () => {

        $("#coachPinnedMessage").remove();

    });


/* ==========================================================
   MARK ALL READ
========================================================== */

$("#markAllNotificationsRead")
    ?.addEventListener("click", () => {

        $$(".coach-notification-item")
            .forEach(item => {

                item.classList.remove("unread");

                item.dataset.read = "true";

            });

        const badge =
            notificationButton?.querySelector(
                ".coach-notification-badge"
            );

        if (badge)
            badge.textContent = "0";

    });


/* ==========================================================
   AUTO CLOSE SIDEBAR
========================================================== */

window.addEventListener("resize", () => {

    if (window.innerWidth > 1180) {

        closeSidebar();

    }

});

"use strict";

/* ==========================================================
   FIFA MISSION INDIA
   Coach Messages
   Part 2

   Includes

   • Message Composer
   • Auto Resize
   • Emoji Picker
   • File Attachment
   • Send Message
   • Typing Indicator
   • Auto Scroll
   • LocalStorage Draft
   • Backend Integration Hooks
========================================================== */


/* ==========================================================
   ELEMENTS
========================================================== */

const messageForm =
    $("#coachMessageForm");

const messageInput =
    $("#coachMessageInput");

const sendButton =
    $("#coachMessageSendButton");

const messagesContainer =
    $("#coachChatMessages");

const typingIndicator =
    $("#coachTypingIndicator");

const emojiButton =
    $("#coachEmojiButton");

const emojiPicker =
    $("#coachEmojiPicker");

const attachmentInput =
    $("#coachAttachmentInput");

const addAttachmentButton =
    $("#coachComposerAddButton");

const draftKey =
    "coach-message-draft";


/* ==========================================================
   AUTO RESIZE
========================================================== */

function resizeComposer() {

    messageInput.style.height = "auto";

    messageInput.style.height =
        `${messageInput.scrollHeight}px`;

}

messageInput?.addEventListener(
    "input",
    resizeComposer
);


/* ==========================================================
   SAVE DRAFT
========================================================== */

messageInput?.addEventListener("input", () => {

    localStorage.setItem(
        draftKey,
        messageInput.value
    );

});


/* ==========================================================
   RESTORE DRAFT
========================================================== */

const savedDraft =
    localStorage.getItem(draftKey);

if (savedDraft) {

    messageInput.value = savedDraft;

    resizeComposer();

}


/* ==========================================================
   EMOJI PICKER
========================================================== */

emojiButton?.addEventListener("click", event => {

    event.stopPropagation();

    emojiPicker.hidden =
        !emojiPicker.hidden;

});


document.addEventListener("click", () => {

    emojiPicker.hidden = true;

});


emojiPicker?.addEventListener(
    "click",
    event => {

        const button =
            event.target.closest("button");

        if (!button) return;

        const emoji =
            button.dataset.emoji || "";

        messageInput.value += emoji;

        resizeComposer();

        messageInput.focus();

    }
);


/* ==========================================================
   ATTACHMENTS
========================================================== */

addAttachmentButton?.addEventListener(
    "click",
    () => {

        attachmentInput.click();

    }
);


attachmentInput?.addEventListener(
    "change",
    () => {

        if (!attachmentInput.files.length)
            return;

        const file =
            attachmentInput.files[0];

        showToast(
            `${file.name} attached`,
            "success"
        );

    }
);


/* ==========================================================
   CREATE MESSAGE
========================================================== */

function createOutgoingMessage(text) {

    const wrapper =
        document.createElement("article");

    wrapper.className =
        "coach-message sent";

    wrapper.dataset.messageText =
        text;

    wrapper.innerHTML = `

<div class="coach-message-content">

<div class="coach-message-bubble">

<p>${text}</p>

</div>

<div class="coach-message-meta">

<time>${currentTime()}</time>

<i class="fa-solid fa-check message-read-status"></i>

</div>

</div>

`;

    messagesContainer.append(wrapper);

}


/* ==========================================================
   TIME
========================================================== */

function currentTime() {

    return new Date().toLocaleTimeString([], {

        hour: "2-digit",

        minute: "2-digit"

    });

}


/* ==========================================================
   SCROLL
========================================================== */

function scrollConversation() {

    messagesContainer.scrollTop =
        messagesContainer.scrollHeight;

}


/* ==========================================================
   SEND
========================================================== */

messageForm?.addEventListener(
    "submit",
    event => {

        event.preventDefault();

        const text =
            messageInput.value.trim();

        if (!text) return;

        createOutgoingMessage(text);

        localStorage.removeItem(draftKey);

        messageInput.value = "";

        resizeComposer();

        scrollConversation();

        simulateReply();

        backendSendMessage({

            text,

            conversation:
                activeConversationName.textContent

        });

    }
);


/* ==========================================================
   ENTER
========================================================== */

messageInput?.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Enter" &&
            !event.shiftKey
        ) {

            event.preventDefault();

            messageForm.requestSubmit();

        }

    }
);


/* ==========================================================
   TYPING
========================================================== */

function showTyping() {

    typingIndicator.hidden = false;

    scrollConversation();

}

function hideTyping() {

    typingIndicator.hidden = true;

}


/* ==========================================================
   SIMULATED REPLY
========================================================== */

function simulateReply() {

    showTyping();

    setTimeout(() => {

        hideTyping();

        const reply =
            document.createElement("article");

        reply.className =
            "coach-message received";

        reply.dataset.messageText =
            "This is a frontend preview. Backend integration will be handled by Mr. Harsh.";

        reply.innerHTML = `

<img
src="images/avatar-placeholder.jpg"
alt="Coach"
/>

<div class="coach-message-content">

<div class="coach-message-bubble">

<p>
This is a frontend preview.
Backend integration will be handled by Mr. Harsh.
</p>

</div>

<div class="coach-message-meta">

<time>${currentTime()}</time>

</div>

</div>

`;

        messagesContainer.append(reply);

        scrollConversation();

    }, 1800);

}


/* ==========================================================
   TOAST
========================================================== */

const toastContainer =
    $("#coachToastContainer");


function showToast(message, type = "success") {

    if (!toastContainer) return;

    const toast =
        document.createElement("div");

    toast.className =
        `coach-toast ${type}`;

    toast.innerHTML = `

<i class="fa-solid fa-circle-check"></i>

<span>${message}</span>

`;

    toastContainer.append(toast);

    setTimeout(() => {

        toast.remove();

    }, 3500);

}


/* ==========================================================
   BACKEND PLACEHOLDER
========================================================== */

function backendSendMessage(payload) {

    /*
    ==================================================

    HARSH BACKEND INTEGRATION

    POST

    /api/coach/messages/send

    Body

    {

        conversationId,

        senderId,

        receiverId,

        text,

        attachment,

        timestamp

    }

    ==================================================
    */

    console.log(
        "Backend Send Placeholder",
        payload
    );

}


/* ==========================================================
   AUTO SCROLL
========================================================== */

scrollConversation();


/* ==========================================================
   ONLINE STATUS PLACEHOLDER
========================================================== */

function refreshOnlineStatus() {

    /*
    GET

    /api/coach/users/status

    Backend integration
    */

}


/* ==========================================================
   FETCH MESSAGES PLACEHOLDER
========================================================== */

function fetchConversationMessages() {

    /*
    GET

    /api/coach/messages

    Backend integration
    */

}


/* ==========================================================
   MARK READ PLACEHOLDER
========================================================== */

function markConversationRead() {

    /*
    PATCH

    /api/coach/messages/read

    Backend integration
    */

}


/* ==========================================================
   AUTO REFRESH PLACEHOLDER
========================================================== */

setInterval(() => {

    refreshOnlineStatus();

}, 30000);

