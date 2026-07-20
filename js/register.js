/* =====================================================
   REGISTRATION ROLE SELECTION
   Frontend-only role selection

   Backend integration: Mr. Harsh
===================================================== */

document.addEventListener("DOMContentLoaded", () => {

  const roleGrid =
    document.getElementById("registerRoleGrid");

  const roleCards = Array.from(
    document.querySelectorAll("[data-register-role]")
  );

  const selectedRoleIcon =
    document.getElementById("selectedRoleIcon");

  const selectedRoleTitle =
    document.getElementById("selectedRoleTitle");

  const selectedRoleDescription =
    document.getElementById("selectedRoleDescription");

  const selectedRoleVerification =
    document.getElementById("selectedRoleVerification");

  const selectedRoleFeatures =
    document.getElementById("selectedRoleFeatures");

  const continueButton =
    document.getElementById("registerContinueButton");

  const currentYear =
    document.getElementById("registerCurrentYear");


  if (
    !roleGrid ||
    roleCards.length === 0 ||
    !continueButton
  ) {
    return;
  }


  /* ===================================================
     ROLE INFORMATION
  =================================================== */

  const roleInformation = {

    player: {

      title: "Player",

      icon: "⚽",

      description:
        "Create your football identity, showcase your skills and build a profile that may be discovered by verified football organisations.",

      verification:
        "Player information may require identity, age and guardian verification depending on the account holder’s age.",

      features: [
        "Personal football profile",
        "Playing history and achievements",
        "Approved football media",
        "Opportunity notifications"
      ]

    },


    coach: {

      title: "Coach",

      icon: "📋",

      description:
        "Present your coaching experience, qualifications, philosophy and the teams or age groups you have worked with.",

      verification:
        "Coaching licences, employment history and organisation associations may be reviewed before professional verification.",

      features: [
        "Professional coaching profile",
        "Qualification and licence records",
        "Coaching history",
        "Academy and player connections"
      ]

    },


    academy: {

      title: "Academy",

      icon: "🏟️",

      description:
        "Register your academy, club or football training organisation and present its programmes to players and families.",

      verification:
        "Organisation documents, authorised representatives and official contact information should be reviewed before publication.",

      features: [
        "Public academy listing",
        "Programme and facility information",
        "Coach management",
        "Trials and opportunity announcements"
      ]

    },


    scout: {

      title: "Scout",

      icon: "🔍",

      description:
        "Discover emerging football talent and build organised player watchlists for verified football opportunities.",

      verification:
        "Identity, professional role and organisation association must be verified before access to scouting features is granted.",

      features: [
        "Verified scout profile",
        "Player discovery tools",
        "Talent watchlists",
        "Controlled player contact requests"
      ]

    },


    supporter: {

      title: "Supporter",

      icon: "♥",

      description:
        "Join the football community, follow the national mission and receive stories, events and platform updates.",

      verification:
        "Basic email or mobile verification may be required. Professional football access is not included with this role.",

      features: [
        "Community supporter profile",
        "Mission and event updates",
        "Saved stories and content",
        "Volunteer opportunities"
      ]

    }

  };


  let selectedRole = "player";


  /* ===================================================
     RENDER SELECTED ROLE
  =================================================== */

  function renderFeatureList(features) {

    if (!selectedRoleFeatures) {
      return;
    }

    selectedRoleFeatures.innerHTML =
      features
        .map(
          (feature) => `
            <li>
              <span aria-hidden="true">✓</span>
              ${feature}
            </li>
          `
        )
        .join("");

  }


  function updateSelectedRole(roleName) {

    const roleData =
      roleInformation[roleName];

    const selectedCard =
      roleCards.find(
        (card) =>
          card.dataset.registerRole ===
          roleName
      );


    if (!roleData || !selectedCard) {
      return;
    }


    selectedRole = roleName;


    roleCards.forEach((card) => {

      const cardIsSelected =
        card === selectedCard;

      card.classList.toggle(
        "is-selected",
        cardIsSelected
      );

      card.setAttribute(
        "aria-checked",
        String(cardIsSelected)
      );

    });


    if (selectedRoleIcon) {
      selectedRoleIcon.textContent =
        roleData.icon;
    }

    if (selectedRoleTitle) {
      selectedRoleTitle.textContent =
        roleData.title;
    }

    if (selectedRoleDescription) {
      selectedRoleDescription.textContent =
        roleData.description;
    }

    if (selectedRoleVerification) {
      selectedRoleVerification.textContent =
        roleData.verification;
    }


    renderFeatureList(
      roleData.features
    );


    const registrationRoute =
      selectedCard.dataset.roleRoute;

    const registrationEndpoint =
      selectedCard.dataset.roleEndpoint;


    continueButton.dataset.selectedRoute =
      registrationRoute || "";

    continueButton.dataset.selectedEndpoint =
      registrationEndpoint || "";

    continueButton.innerHTML = `
      Continue as ${roleData.title}
      <span aria-hidden="true">→</span>
    `;


    /*
      Store only the role name temporarily.

      Do not store personal data in localStorage.
    */

    try {

      sessionStorage.setItem(
        "missionSelectedRole",
        roleName
      );

    } catch (error) {

      console.warn(
        "Unable to save selected role:",
        error
      );

    }

  }


  /* ===================================================
     CARD EVENTS
  =================================================== */

  roleCards.forEach((card) => {

    card.addEventListener("click", () => {

      const roleName =
        card.dataset.registerRole;

      updateSelectedRole(roleName);

    });

  });


  /* ===================================================
     KEYBOARD NAVIGATION
  =================================================== */

  roleGrid.addEventListener(
    "keydown",
    (event) => {

      const currentCard =
        event.target.closest(
          "[data-register-role]"
        );

      if (!currentCard) {
        return;
      }


      const currentIndex =
        roleCards.indexOf(currentCard);

      if (currentIndex === -1) {
        return;
      }


      let nextIndex = currentIndex;


      if (
        event.key === "ArrowRight" ||
        event.key === "ArrowDown"
      ) {

        nextIndex =
          (currentIndex + 1) %
          roleCards.length;

      } else if (
        event.key === "ArrowLeft" ||
        event.key === "ArrowUp"
      ) {

        nextIndex =
          (
            currentIndex -
            1 +
            roleCards.length
          ) % roleCards.length;

      } else if (event.key === "Home") {

        nextIndex = 0;

      } else if (event.key === "End") {

        nextIndex =
          roleCards.length - 1;

      } else {

        return;

      }


      event.preventDefault();

      roleCards[nextIndex].focus();

      updateSelectedRole(
        roleCards[nextIndex].dataset.registerRole
      );

    }
  );


  /* ===================================================
     CONTINUE TO REGISTRATION
  =================================================== */

  continueButton.addEventListener(
    "click",
    () => {

      const selectedRoute =
        continueButton.dataset.selectedRoute;

      const selectedEndpoint =
        continueButton.dataset.selectedEndpoint;


      console.log(
        "Selected account role:",
        selectedRole
      );

      console.log(
        "Registration route:",
        selectedRoute
      );

      console.log(
        "Future backend endpoint:",
        selectedEndpoint
      );


      if (!selectedRoute) {

        console.error(
          "No registration route configured."
        );

        return;

      }


      window.location.href =
        selectedRoute;

    }
  );


  /* ===================================================
     RESTORE SELECTION
  =================================================== */

  function restoreSelectedRole() {

    try {

      const storedRole =
        sessionStorage.getItem(
          "missionSelectedRole"
        );


      if (
        storedRole &&
        roleInformation[storedRole]
      ) {

        updateSelectedRole(
          storedRole
        );

        return;

      }

    } catch (error) {

      console.warn(
        "Unable to restore selected role:",
        error
      );

    }


    updateSelectedRole("player");

  }


  /* ===================================================
     CURRENT YEAR
  =================================================== */

  if (currentYear) {

    currentYear.textContent =
      new Date().getFullYear();

  }


  restoreSelectedRole();

});