/* =====================================================
   JOIN THE MISSION
   Frontend-only interaction

   Backend integration will be handled by Mr. Harsh.
===================================================== */

document.addEventListener("DOMContentLoaded", () => {

  const roleModal = document.getElementById("roleRegistrationModal");
  const roleButtons = document.querySelectorAll("[data-join-role]");
  const closeModalButtons = document.querySelectorAll(
    "[data-close-role-modal]"
  );

  const modalTitle = document.getElementById("roleModalTitle");
  const modalDescription = document.getElementById(
    "roleModalDescription"
  );
  const modalIcon = document.getElementById("roleModalIcon");

  const continueRegistrationButton = document.getElementById(
    "continueRoleRegistration"
  );

  if (
    !roleModal ||
    !modalTitle ||
    !modalDescription ||
    !modalIcon ||
    !continueRegistrationButton
  ) {
    return;
  }


  /*
    Frontend role configuration.

    Mr. Harsh can replace or populate this data through:
    GET /api/participation-roles
  */

  const roleData = {

    player: {
      title: "Join as a Player",
      icon: "⚽",
      description:
        "Create your player profile and begin showcasing your football journey to academies, coaches and scouts."
    },

    coach: {
      title: "Join as a Coach",
      icon: "📋",
      description:
        "Build your coaching identity and connect with players, academies and football development programmes."
    },

    academy: {
      title: "Register Your Academy",
      icon: "🏟️",
      description:
        "Create an official academy profile and showcase your programmes, facilities and development opportunities."
    },

    scout: {
      title: "Join as a Scout",
      icon: "🔍",
      description:
        "Discover emerging football talent and create meaningful connections across India’s football network."
    },

    supporter: {
      title: "Become a Supporter",
      icon: "🇮🇳",
      description:
        "Join the national supporter community and follow India’s journey towards the FIFA World Cup."
    }

  };


  let lastFocusedElement = null;


  function openRoleModal(role) {

    const selectedRole = roleData[role];

    if (!selectedRole) {
      return;
    }

    lastFocusedElement = document.activeElement;

    modalTitle.textContent = selectedRole.title;
    modalDescription.textContent = selectedRole.description;
    modalIcon.textContent = selectedRole.icon;

    continueRegistrationButton.dataset.selectedRole = role;

    roleModal.classList.add("is-open");
    roleModal.setAttribute("aria-hidden", "false");

    document.body.classList.add("role-modal-open");

    window.setTimeout(() => {
      continueRegistrationButton.focus();
    }, 150);

  }


  function closeRoleModal() {

    roleModal.classList.remove("is-open");
    roleModal.setAttribute("aria-hidden", "true");

    document.body.classList.remove("role-modal-open");

    if (lastFocusedElement) {
      lastFocusedElement.focus();
    }

  }


  roleButtons.forEach((button) => {

    button.addEventListener("click", () => {

      const selectedRole = button.dataset.joinRole;

      openRoleModal(selectedRole);

    });

  });


  closeModalButtons.forEach((button) => {
    button.addEventListener("click", closeRoleModal);
  });


  document.addEventListener("keydown", (event) => {

    if (
      event.key === "Escape" &&
      roleModal.classList.contains("is-open")
    ) {
      closeRoleModal();
    }

  });


  /*
    Temporary frontend-only action.

    Mr. Harsh can later replace this with:

    window.location.href =
      `/register.html?role=${selectedRole}`;

    Or submit to:

    POST /api/auth/register
  */

  continueRegistrationButton.addEventListener("click", () => {

    const selectedRole =
      continueRegistrationButton.dataset.selectedRole;

    if (!selectedRole) {
      return;
    }

    console.log(
      `Frontend registration selected for role: ${selectedRole}`
    );

    /*
      Temporary route placeholder.

      This expects a future register.html page.
      Uncomment after the Login/Register UI is created.

      window.location.href =
        `register.html?role=${encodeURIComponent(selectedRole)}`;
    */

    closeRoleModal();

  });


  /*
    Keyboard support for complete role cards.
  */

  const roleCards = document.querySelectorAll(".join-role-card");

  roleCards.forEach((card) => {

    card.addEventListener("keydown", (event) => {

      if (event.key !== "Enter" && event.key !== " ") {
        return;
      }

      if (event.target.closest("button")) {
        return;
      }

      event.preventDefault();

      const role = card.dataset.role;

      openRoleModal(role);

    });

  });

});