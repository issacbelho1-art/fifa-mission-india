/* =========================================================
   PLAYER MESSAGES
   FIFA Mission India
   Frontend Only
   Backend Integration Ready
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  const conversationList = document.getElementById("conversationList");
  const searchInput = document.getElementById("conversationSearch");
  const messageInput = document.getElementById("messageInput");
  const sendBtn = document.getElementById("sendBtn");
  const chatMessages = document.getElementById("chatMessages");
  const typingIndicator = document.getElementById("typingIndicator");

  /* ===========================================
      Conversation Selection
  =========================================== */

  const conversations = document.querySelectorAll(".conversation");

  conversations.forEach(card => {

    card.addEventListener("click", () => {

      conversations.forEach(c => c.classList.remove("active"));
      card.classList.add("active");

      // Remove unread badge after opening
      const badge = card.querySelector(".conversation-badge");
      if (badge) badge.remove();

      /*
      ===============================================
      BACKEND INTEGRATION (Mr. Harsh)

      Load selected conversation.

      loadConversation(conversationId);

      ===============================================
      */

    });

  });

  /* ===========================================
      Search Conversations
  =========================================== */

  if (searchInput) {

    searchInput.addEventListener("keyup", function () {

      const keyword = this.value.toLowerCase();

      conversations.forEach(item => {

        const name = item.querySelector("h3").textContent.toLowerCase();

        item.style.display =
          name.includes(keyword)
            ? "flex"
            : "none";

      });

    });

  }

  /* ===========================================
      Filter Buttons
  =========================================== */

  const filterButtons = document.querySelectorAll(".conversation-filters button");

  filterButtons.forEach(btn => {

    btn.addEventListener("click", () => {

      filterButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      const filter = btn.textContent.trim().toLowerCase();

      conversations.forEach(item => {

        if (filter === "all") {

          item.style.display = "flex";
          return;

        }

        const name = item.textContent.toLowerCase();

        if (name.includes(filter)) {

          item.style.display = "flex";

        } else {

          item.style.display = "none";

        }

      });

    });

  });

  /* ===========================================
      Send Message
  =========================================== */

  function sendMessage() {

    const text = messageInput.value.trim();

    if (!text) return;

    typingIndicator.style.display = "none";

    const message = document.createElement("div");
    message.className = "message sent";

    message.innerHTML = `

      <div class="bubble">

        <p>${text}</p>

        <span>

          ${currentTime()}

          <i class="fa-solid fa-check-double"></i>

        </span>

      </div>

    `;

    chatMessages.appendChild(message);

    messageInput.value = "";

    scrollBottom();

    /*
    ============================================
    BACKEND

    sendMessage({
       conversationId,
       message:text
    });

    ============================================
    */

    fakeReply();

  }

  sendBtn.addEventListener("click", sendMessage);

  messageInput.addEventListener("keypress", e => {

    if (e.key === "Enter") {

      e.preventDefault();
      sendMessage();

    }

  });

  /* ===========================================
      Fake Reply
  =========================================== */

  function fakeReply() {

    typingIndicator.style.display = "flex";

    scrollBottom();

    setTimeout(() => {

      typingIndicator.style.display = "none";

      const reply = document.createElement("div");

      reply.className = "message received";

      reply.innerHTML = `

        <img
          src="images/academy1.jpg"
          alt="Academy">

        <div class="bubble">

          <p>
            Thank you. Your message has been received.
          </p>

          <span>${currentTime()}</span>

        </div>

      `;

      chatMessages.appendChild(reply);

      scrollBottom();

    }, 1800);

  }

  /* ===========================================
      Current Time
  =========================================== */

  function currentTime() {

    const now = new Date();

    return now.toLocaleTimeString([], {

      hour: "2-digit",
      minute: "2-digit"

    });

  }

  /* ===========================================
      Scroll Bottom
  =========================================== */

  function scrollBottom() {

    chatMessages.scrollTop = chatMessages.scrollHeight;

  }

  scrollBottom();

  /* ===========================================
      Composer Buttons (Frontend Demo)
  =========================================== */

  document.querySelectorAll(".chat-composer button").forEach(btn => {

    if (!btn.classList.contains("send-btn")) {

      btn.addEventListener("click", () => {

        // Placeholder for emoji, attachments,
        // images, voice etc.

      });

    }

  });

  /* ===========================================
      New Message Button
  =========================================== */

  const newMessageBtn = document.querySelector(".new-message-btn");

  if (newMessageBtn) {

    newMessageBtn.addEventListener("click", () => {

      alert("Frontend Demo\n\nCompose New Message");

      /*
      BACKEND

      Open Compose Modal

      */

    });

  }

});