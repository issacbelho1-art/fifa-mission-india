/* =====================================================
   FINAL MISSION CALL-TO-ACTION
   Frontend-only interaction

   Backend integration: Mr. Harsh
===================================================== */

document.addEventListener("DOMContentLoaded", () => {

  const joinButton = document.getElementById(
    "missionCtaJoinButton"
  );

  const roleCards = document.querySelectorAll(
    "[data-mission-role]"
  );

  const modalRoleButtons = document.querySelectorAll(
    "[data-modal-mission-role]"
  );

  const roleModal = document.getElementById(
    "missionRoleModal"
  );

  const closeModalButtons = document.querySelectorAll(
    "[data-close-mission-modal]"
  );

  const statisticsSection = document.getElementById(
    "missionCtaStatistics"
  );

  const counterElements = document.querySelectorAll(
    "[data-mission-counter]"
  );


  let lastFocusedElement = null;
  let countersHaveStarted = false;


  /* ===================================================
     ROLE MODAL
  =================================================== */

  function openRoleModal() {

    if (!roleModal) {
      return;
    }

    lastFocusedElement = document.activeElement;

    roleModal.classList.add("is-open");

    roleModal.setAttribute(
      "aria-hidden",
      "false"
    );

    document.body.classList.add(
      "mission-modal-open"
    );


    window.setTimeout(() => {

      const firstRoleButton =
        roleModal.querySelector(
          "[data-modal-mission-role]"
        );

      firstRoleButton?.focus();

    }, 150);

  }


  function closeRoleModal() {

    if (!roleModal) {
      return;
    }

    roleModal.classList.remove("is-open");

    roleModal.setAttribute(
      "aria-hidden",
      "true"
    );

    document.body.classList.remove(
      "mission-modal-open"
    );


    if (lastFocusedElement) {
      lastFocusedElement.focus();
    }

  }


  joinButton?.addEventListener(
    "click",
    openRoleModal
  );


  closeModalButtons.forEach((button) => {

    button.addEventListener(
      "click",
      closeRoleModal
    );

  });


  document.addEventListener("keydown", (event) => {

    if (
      event.key === "Escape" &&
      roleModal?.classList.contains("is-open")
    ) {
      closeRoleModal();
    }

  });


  /* ===================================================
     REGISTRATION ROUTE PLACEHOLDER
  =================================================== */

  function handleRoleSelection(button) {

    const selectedRole =
      button.dataset.missionRole ||
      button.dataset.modalMissionRole;

    const registrationRoute =
      button.dataset.registrationRoute;

    const registrationEndpoint =
      button.dataset.registrationEndpoint;


    console.log(
      "Selected mission role:",
      selectedRole
    );

    console.log(
      "Frontend registration route:",
      registrationRoute
    );

    if (registrationEndpoint) {

      console.log(
        "Future backend endpoint:",
        registrationEndpoint
      );

    }


    /*
      Future frontend navigation:

      window.location.href =
        registrationRoute;
    */


    /*
      Registration endpoints for Mr. Harsh:

      POST /api/register/player
      POST /api/register/coach
      POST /api/register/academy
      POST /api/register/scout
      POST /api/register/supporter
    */


    if (
      roleModal?.classList.contains("is-open")
    ) {
      closeRoleModal();
    }

  }


  roleCards.forEach((card) => {

    card.addEventListener("click", () => {

      handleRoleSelection(card);

    });

  });


  modalRoleButtons.forEach((button) => {

    button.addEventListener("click", () => {

      handleRoleSelection(button);

    });

  });


  /* ===================================================
     ANIMATED COUNTERS
  =================================================== */

  function formatCounterValue(value) {

    return new Intl.NumberFormat("en-IN").format(
      Math.floor(value)
    );

  }


  function animateCounter(counterElement) {

    const targetValue = Number(
      counterElement.dataset.counterTarget
    );

    if (
      !Number.isFinite(targetValue) ||
      targetValue < 0
    ) {
      return;
    }


    const animationDuration = 1800;
    const startTime = performance.now();


    function updateCounter(currentTime) {

      const elapsedTime =
        currentTime - startTime;

      const progress = Math.min(
        elapsedTime / animationDuration,
        1
      );


      /*
        Ease-out cubic animation.
      */

      const easedProgress =
        1 - Math.pow(1 - progress, 3);

      const currentValue =
        targetValue * easedProgress;


      counterElement.textContent =
        formatCounterValue(currentValue);


      if (progress < 1) {

        window.requestAnimationFrame(
          updateCounter
        );

      } else {

        counterElement.textContent =
          formatCounterValue(targetValue);

      }

    }


    window.requestAnimationFrame(
      updateCounter
    );

  }


  function startCounters() {

    if (countersHaveStarted) {
      return;
    }

    countersHaveStarted = true;

    counterElements.forEach(
      animateCounter
    );

  }


  if (
    statisticsSection &&
    "IntersectionObserver" in window
  ) {

    const counterObserver =
      new IntersectionObserver(
        (entries, observer) => {

          entries.forEach((entry) => {

            if (!entry.isIntersecting) {
              return;
            }

            startCounters();

            observer.unobserve(entry.target);

          });

        },
        {
          threshold: 0.35
        }
      );


    counterObserver.observe(
      statisticsSection
    );

  } else {

    startCounters();

  }


  /* ===================================================
     BACKEND STATISTICS PLACEHOLDER
  =================================================== */

  async function loadMissionStatistics() {

    if (!statisticsSection) {
      return;
    }

    const apiEndpoint =
      statisticsSection.dataset.apiEndpoint;

    if (!apiEndpoint) {
      return;
    }


    /*
      Mr. Harsh can later connect:

      GET /api/platform/statistics

      Suggested response:

      {
        "players": 10000,
        "academies": 500,
        "scoutsAndCoaches": 100
      }
    */


    /*
      Backend integration example:

      try {

        const response = await fetch(apiEndpoint);

        if (!response.ok) {
          throw new Error(
            "Unable to load platform statistics."
          );
        }

        const statistics =
          await response.json();

        const playerCounter =
          document.querySelector(
            '[data-counter-target="10000"]'
          );

        const academyCounter =
          document.querySelector(
            '[data-counter-target="500"]'
          );

        const scoutCounter =
          document.querySelector(
            '[data-counter-target="100"]'
          );

        if (playerCounter) {
          playerCounter.dataset.counterTarget =
            statistics.players;
        }

        if (academyCounter) {
          academyCounter.dataset.counterTarget =
            statistics.academies;
        }

        if (scoutCounter) {
          scoutCounter.dataset.counterTarget =
            statistics.scoutsAndCoaches;
        }

      } catch (error) {

        console.error(
          "Mission statistics error:",
          error
        );

      }
    */

  }


  /*
    Keep disabled until the API is ready.

    loadMissionStatistics();
  */

});