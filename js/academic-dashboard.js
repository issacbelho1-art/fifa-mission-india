/* =========================================================
   ACADEMY DASHBOARD
   FIFA Mission India
   Frontend Interactions Only
========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;

  const sidebar =
    document.getElementById("academySidebar");

  const menuButton =
    document.getElementById("academyMenuButton");

  const sidebarCloseButton =
    document.getElementById("academySidebarClose");

  const sidebarOverlay =
    document.getElementById("academySidebarOverlay");

  const logoutButton =
    document.getElementById("academyLogoutButton");

  const logoutModal =
    document.getElementById("academyLogoutModal");

  const logoutConfirmButton =
    document.getElementById("academyLogoutConfirm");

  const profileButton =
    document.querySelector(".academy-topbar-profile");

  const activityHistoryButton =
    document.querySelector(
      ".academy-activity-card .academy-card-header > button"
    );

  let previouslyFocusedElement = null;


  /* =========================================================
     MOBILE SIDEBAR
  ========================================================= */

  function openSidebar() {
    body.classList.add("academy-menu-open");

    menuButton?.setAttribute(
      "aria-expanded",
      "true"
    );

    sidebar?.setAttribute(
      "aria-hidden",
      "false"
    );

    window.setTimeout(() => {
      sidebarCloseButton?.focus();
    }, 100);
  }


  function closeSidebar() {
    body.classList.remove("academy-menu-open");

    menuButton?.setAttribute(
      "aria-expanded",
      "false"
    );

    if (window.innerWidth <= 1180) {
      sidebar?.setAttribute(
        "aria-hidden",
        "true"
      );
    }

    menuButton?.focus();
  }


  menuButton?.addEventListener(
    "click",
    openSidebar
  );


  sidebarCloseButton?.addEventListener(
    "click",
    closeSidebar
  );


  sidebarOverlay?.addEventListener(
    "click",
    closeSidebar
  );


  document
    .querySelectorAll(".academy-nav-link")
    .forEach(link => {
      link.addEventListener("click", () => {
        if (window.innerWidth <= 1180) {
          closeSidebar();
        }
      });
    });


  function updateSidebarAccessibility() {
    const mobileView =
      window.innerWidth <= 1180;

    if (mobileView) {
      const sidebarIsOpen =
        body.classList.contains(
          "academy-menu-open"
        );

      sidebar?.setAttribute(
        "aria-hidden",
        String(!sidebarIsOpen)
      );

      menuButton?.setAttribute(
        "aria-expanded",
        String(sidebarIsOpen)
      );
    } else {
      body.classList.remove(
        "academy-menu-open"
      );

      sidebar?.setAttribute(
        "aria-hidden",
        "false"
      );

      menuButton?.setAttribute(
        "aria-expanded",
        "false"
      );
    }
  }


  window.addEventListener(
    "resize",
    updateSidebarAccessibility
  );

  updateSidebarAccessibility();


  /* =========================================================
     LOGOUT MODAL
  ========================================================= */

  function openLogoutModal() {
    if (!logoutModal) {
      return;
    }

    previouslyFocusedElement =
      document.activeElement;

    logoutModal.hidden = false;

    body.classList.add(
      "academy-modal-open"
    );

    window.setTimeout(() => {
      logoutModal
        .querySelector(
          ".academy-modal-cancel"
        )
        ?.focus();
    }, 50);
  }


  function closeLogoutModal() {
    if (!logoutModal) {
      return;
    }

    logoutModal.hidden = true;

    body.classList.remove(
      "academy-modal-open"
    );

    previouslyFocusedElement?.focus();
  }


  logoutButton?.addEventListener(
    "click",
    openLogoutModal
  );


  document
    .querySelectorAll(
      "[data-academy-modal-close]"
    )
    .forEach(element => {
      element.addEventListener(
        "click",
        closeLogoutModal
      );
    });


  logoutConfirmButton?.addEventListener(
    "click",
    async () => {
      logoutConfirmButton.disabled = true;

      logoutConfirmButton.innerHTML = `
        <i class="fa-solid fa-spinner fa-spin"></i>
        Logging Out
      `;

      /*
      =========================================================

      BACKEND INTEGRATION — MR. HARSH

      Replace the frontend delay below with the real logout
      process.

      Example:

      await academyAuthLogout();

      After successful logout:

      window.location.href = "login.html";

      =========================================================
      */

      try {
        await demoDelay(700);

        window.location.href =
          "login.html";
      } catch (error) {
        console.error(
          "Academy logout failed:",
          error
        );

        logoutConfirmButton.disabled =
          false;

        logoutConfirmButton.textContent =
          "Log Out";
      }
    }
  );


  /* =========================================================
     KEYBOARD CONTROLS
  ========================================================= */

  document.addEventListener(
    "keydown",
    event => {
      if (event.key === "Escape") {
        if (
          logoutModal &&
          !logoutModal.hidden
        ) {
          closeLogoutModal();
          return;
        }

        if (
          body.classList.contains(
            "academy-menu-open"
          )
        ) {
          closeSidebar();
        }
      }

      if (
        event.key === "Tab" &&
        logoutModal &&
        !logoutModal.hidden
      ) {
        trapModalFocus(
          event,
          logoutModal
        );
      }
    }
  );


  function trapModalFocus(
    event,
    modal
  ) {
    const focusableElements =
      Array.from(
        modal.querySelectorAll(
          `
          button:not([disabled]),
          a[href],
          input:not([disabled]),
          select:not([disabled]),
          textarea:not([disabled]),
          [tabindex]:not([tabindex="-1"])
          `
        )
      );

    if (!focusableElements.length) {
      return;
    }

    const firstElement =
      focusableElements[0];

    const lastElement =
      focusableElements[
        focusableElements.length - 1
      ];

    if (
      event.shiftKey &&
      document.activeElement ===
        firstElement
    ) {
      event.preventDefault();
      lastElement.focus();
    } else if (
      !event.shiftKey &&
      document.activeElement ===
        lastElement
    ) {
      event.preventDefault();
      firstElement.focus();
    }
  }


  /* =========================================================
     PROFILE DROPDOWN
  ========================================================= */

  if (profileButton) {
    profileButton.setAttribute(
      "aria-expanded",
      "false"
    );

    const profileDropdown =
      createProfileDropdown();

    profileButton.parentElement?.appendChild(
      profileDropdown
    );

    profileButton.addEventListener(
      "click",
      event => {
        event.stopPropagation();

        const isOpen =
          profileDropdown.classList.toggle(
            "open"
          );

        profileButton.setAttribute(
          "aria-expanded",
          String(isOpen)
        );
      }
    );

    profileDropdown.addEventListener(
      "click",
      event => {
        event.stopPropagation();
      }
    );

    document.addEventListener(
      "click",
      () => {
        profileDropdown.classList.remove(
          "open"
        );

        profileButton.setAttribute(
          "aria-expanded",
          "false"
        );
      }
    );
  }


  function createProfileDropdown() {
    const dropdown =
      document.createElement("div");

    dropdown.className =
      "academy-profile-dropdown";

    dropdown.innerHTML = `
      <a href="academy-profile.html">
        <i class="fa-regular fa-building"></i>
        Academy Profile
      </a>

      <a href="academy-settings.html">
        <i class="fa-solid fa-gear"></i>
        Settings
      </a>

      <button
        type="button"
        data-dropdown-logout
      >
        <i class="fa-solid fa-arrow-right-from-bracket"></i>
        Log Out
      </button>
    `;

    dropdown
      .querySelector(
        "[data-dropdown-logout]"
      )
      ?.addEventListener(
        "click",
        () => {
          dropdown.classList.remove(
            "open"
          );

          profileButton?.setAttribute(
            "aria-expanded",
            "false"
          );

          openLogoutModal();
        }
      );

    return dropdown;
  }


  /* =========================================================
     APPLICATION ROW ACTIONS
  ========================================================= */

  document
    .querySelectorAll(
      ".academy-application-item"
    )
    .forEach(item => {
      const actionButton =
        item.querySelector(
          ".academy-row-action"
        );

      actionButton?.addEventListener(
        "click",
        () => {
          const playerName =
            item
              .querySelector(
                ".academy-player-info strong"
              )
              ?.textContent.trim() ||
            "Player";

          /*
          =====================================================

          BACKEND INTEGRATION — MR. HARSH

          Replace this demo interaction with navigation to the
          real application details page using the application ID.

          Example:

          window.location.href =
            `academy-application-details.html?id=${applicationId}`;

          =====================================================
          */

          showDashboardToast(
            `Opening ${playerName}'s application.`
          );
        }
      );
    });


  /* =========================================================
     ACTIVITY HISTORY
  ========================================================= */

  activityHistoryButton?.addEventListener(
    "click",
    () => {
      showDashboardToast(
        "Full academy activity history will appear here."
      );
    }
  );


  /* =========================================================
     STAT CARD ENTRANCE ANIMATION
  ========================================================= */

  const animatedCards =
    document.querySelectorAll(
      `
      .academy-stat-card,
      .academy-dashboard-card
      `
    );

  if (
    "IntersectionObserver" in window
  ) {
    const observer =
      new IntersectionObserver(
        entries => {
          entries.forEach(entry => {
            if (!entry.isIntersecting) {
              return;
            }

            entry.target.classList.add(
              "academy-card-visible"
            );

            observer.unobserve(
              entry.target
            );
          });
        },
        {
          threshold: 0.12
        }
      );

    animatedCards.forEach(card => {
      card.classList.add(
        "academy-card-animate"
      );

      observer.observe(card);
    });
  }


  /* =========================================================
     TOAST NOTIFICATION
  ========================================================= */

  function showDashboardToast(
    message,
    type = "info"
  ) {
    let toastContainer =
      document.getElementById(
        "academyToastContainer"
      );

    if (!toastContainer) {
      toastContainer =
        document.createElement("div");

      toastContainer.id =
        "academyToastContainer";

      toastContainer.className =
        "academy-toast-container";

      document.body.appendChild(
        toastContainer
      );
    }

    const toast =
      document.createElement("div");

    toast.className =
      `academy-toast ${type}`;

    toast.setAttribute(
      "role",
      "status"
    );

    toast.innerHTML = `
      <span class="academy-toast-icon">
        <i class="fa-solid fa-circle-info"></i>
      </span>

      <p>${escapeHtml(message)}</p>

      <button
        type="button"
        aria-label="Dismiss notification"
      >
        <i class="fa-solid fa-xmark"></i>
      </button>
    `;

    toastContainer.appendChild(toast);

    window.requestAnimationFrame(() => {
      toast.classList.add("show");
    });

    const dismissButton =
      toast.querySelector("button");

    dismissButton?.addEventListener(
      "click",
      () => {
        removeToast(toast);
      }
    );

    window.setTimeout(() => {
      removeToast(toast);
    }, 3500);
  }


  function removeToast(toast) {
    if (
      !toast ||
      toast.classList.contains(
        "removing"
      )
    ) {
      return;
    }

    toast.classList.add("removing");

    window.setTimeout(() => {
      toast.remove();
    }, 280);
  }


  /* =========================================================
     HELPERS
  ========================================================= */

  function demoDelay(milliseconds) {
    return new Promise(resolve => {
      window.setTimeout(
        resolve,
        milliseconds
      );
    });
  }


  function escapeHtml(value) {
    const element =
      document.createElement("div");

    element.textContent =
      String(value);

    return element.innerHTML;
  }


  console.log(
    "Academy Dashboard frontend loaded successfully."
  );
});