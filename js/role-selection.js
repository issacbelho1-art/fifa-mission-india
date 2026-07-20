"use strict";

/* =====================================================
   ROLE SELECTION PAGE
===================================================== */

document.addEventListener("DOMContentLoaded", () => {
  const currentYear = document.getElementById("currentYear");
  const roleCards = document.querySelectorAll(".role-card");
  const roleButtons = document.querySelectorAll(".role-card-button");

  let lastSelectedRole = null;


  /* =====================================================
     CURRENT YEAR
  ===================================================== */

  if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
  }


  /* =====================================================
     RESTORE LAST SELECTED ROLE
  ===================================================== */

  function restoreLastSelectedRole() {
    try {
      const savedRole = localStorage.getItem(
        "fifaMissionIndiaSelectedRole"
      );

      if (!savedRole) {
        return;
      }

      const matchingCard = document.querySelector(
        `.role-card[data-role="${savedRole}"]`
      );

      if (!matchingCard) {
        return;
      }

      lastSelectedRole = savedRole;
      matchingCard.classList.add("is-last-selected");
    } catch (error) {
      console.warn(
        "Unable to restore the previously selected role:",
        error
      );
    }
  }


  /* =====================================================
     SAVE SELECTED ROLE
  ===================================================== */

  function saveSelectedRole(roleName) {
    if (!roleName) {
      return;
    }

    lastSelectedRole = roleName;

    roleCards.forEach((card) => {
      card.classList.toggle(
        "is-last-selected",
        card.dataset.role === roleName
      );
    });

    try {
      localStorage.setItem(
        "fifaMissionIndiaSelectedRole",
        roleName
      );
    } catch (error) {
      console.warn("Unable to save the selected role:", error);
    }
  }


  /* =====================================================
     ROLE CARD INTERACTION
  ===================================================== */

  roleCards.forEach((card) => {
    const roleName = card.dataset.role;
    const roleButton = card.querySelector(".role-card-button");

    card.setAttribute("tabindex", "0");

    card.addEventListener("mouseenter", () => {
      card.classList.add("is-active");
    });

    card.addEventListener("mouseleave", () => {
      card.classList.remove("is-active");
    });

    card.addEventListener("focus", () => {
      card.classList.add("is-active");
    });

    card.addEventListener("blur", (event) => {
      if (!card.contains(event.relatedTarget)) {
        card.classList.remove("is-active");
      }
    });

    card.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") {
        return;
      }

      event.preventDefault();
      saveSelectedRole(roleName);
      roleButton?.click();
    });
  });


  /* =====================================================
     REGISTRATION LINKS
  ===================================================== */

  roleButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      const roleCard = button.closest(".role-card");
      const roleName = roleCard?.dataset.role;

      if (!roleName) {
        return;
      }

      saveSelectedRole(roleName);

      /*
        BACKEND / AUTH INTEGRATION PLACEHOLDER FOR MR. HARSH

        The role can later be stored temporarily before registration:

        sessionStorage.setItem("registrationRole", roleName);

        It may also be included as a URL parameter:

        player-register.html?role=player

        The registration backend should still validate the role
        independently and must not trust frontend data alone.
      */

      button.classList.add("is-loading");

      const destination = button.getAttribute("href");

      if (
        !destination ||
        destination === "#" ||
        destination.trim() === ""
      ) {
        event.preventDefault();
        button.classList.remove("is-loading");

        showRoleNotification(
          "This registration page is not available yet.",
          "error"
        );
      }
    });
  });


  /* =====================================================
     ROLE NOTIFICATION
  ===================================================== */

  function createNotificationElement() {
    const notification = document.createElement("div");

    notification.className = "role-notification";
    notification.setAttribute("role", "status");
    notification.setAttribute("aria-live", "polite");

    notification.innerHTML = `
      <i class="fa-solid fa-circle-check"></i>
      <span></span>
    `;

    document.body.appendChild(notification);

    return notification;
  }


  const roleNotification = createNotificationElement();
  let notificationTimer = null;


  function showRoleNotification(message, type = "success") {
    const messageElement = roleNotification.querySelector("span");
    const icon = roleNotification.querySelector("i");

    window.clearTimeout(notificationTimer);

    if (messageElement) {
      messageElement.textContent = message;
    }

    roleNotification.classList.toggle(
      "is-error",
      type === "error"
    );

    if (icon) {
      icon.className =
        type === "error"
          ? "fa-solid fa-circle-exclamation"
          : "fa-solid fa-circle-check";
    }

    roleNotification.classList.add("is-visible");

    notificationTimer = window.setTimeout(() => {
      roleNotification.classList.remove("is-visible");
    }, 3000);
  }


  /* =====================================================
     REVEAL ANIMATIONS
  ===================================================== */

  const revealElements = document.querySelectorAll(
    [
      ".role-hero-content",
      ".role-section-heading",
      ".role-card",
      ".role-platform-note"
    ].join(",")
  );

  revealElements.forEach((element, index) => {
    element.classList.add("role-reveal");
    element.style.transitionDelay = `${Math.min(index * 70, 350)}ms`;
  });


  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.12
      }
    );

    revealElements.forEach((element) => {
      revealObserver.observe(element);
    });
  } else {
    revealElements.forEach((element) => {
      element.classList.add("is-visible");
    });
  }


  /* =====================================================
     PAGE READY
  ===================================================== */

  restoreLastSelectedRole();
});