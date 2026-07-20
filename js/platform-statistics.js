/* =====================================================
   PLATFORM STATISTICS
   Frontend-only animated counters

   Backend integration will be handled by Mr. Harsh.
===================================================== */

document.addEventListener("DOMContentLoaded", () => {

  const statisticsSection = document.getElementById(
    "platform-statistics"
  );

  const statisticCards = document.querySelectorAll(
    "[data-stat-card]"
  );

  const statisticValues = document.querySelectorAll(
    ".stat-value[data-stat-target]"
  );

  if (!statisticsSection || statisticValues.length === 0) {
    return;
  }


  let statisticsAnimated = false;


  /**
   * Formats large numbers using the visitor's locale.
   *
   * Example:
   * 12500 becomes 12,500
   */
  function formatStatisticValue(value) {

    return new Intl.NumberFormat("en-IN").format(value);

  }


  /**
   * Animates an individual statistic from zero
   * to its configured target value.
   */
  function animateStatistic(element) {

    const targetValue = Number(
      element.dataset.statTarget
    );

    const duration = Number(
      element.dataset.statDuration
    ) || 1800;

    if (!Number.isFinite(targetValue) || targetValue < 0) {
      return;
    }

    const animationStartTime = performance.now();


    function updateStatistic(currentTime) {

      const elapsedTime = currentTime - animationStartTime;

      const animationProgress = Math.min(
        elapsedTime / duration,
        1
      );

      /*
        Ease-out cubic animation.
      */
      const easedProgress =
        1 - Math.pow(1 - animationProgress, 3);

      const currentValue = Math.floor(
        targetValue * easedProgress
      );

      element.textContent = formatStatisticValue(
        currentValue
      );

      if (animationProgress < 1) {

        window.requestAnimationFrame(updateStatistic);

      } else {

        element.textContent = formatStatisticValue(
          targetValue
        );

      }

    }

    window.requestAnimationFrame(updateStatistic);

  }


  /**
   * Starts all card and number animations.
   */
  function startStatisticsAnimation() {

    if (statisticsAnimated) {
      return;
    }

    statisticsAnimated = true;

    statisticCards.forEach((card, index) => {

      window.setTimeout(() => {
        card.classList.add("is-visible");
      }, index * 110);

    });

    statisticValues.forEach((value, index) => {

      window.setTimeout(() => {
        animateStatistic(value);
      }, index * 120);

    });

  }


  /**
   * Run animations only when the section
   * becomes visible on screen.
   */
  const statisticsObserver = new IntersectionObserver(
    (entries, observer) => {

      entries.forEach((entry) => {

        if (!entry.isIntersecting) {
          return;
        }

        startStatisticsAnimation();
        observer.unobserve(entry.target);

      });

    },
    {
      threshold: 0.25
    }
  );

  statisticsObserver.observe(statisticsSection);


  /*
    Accessibility fallback:

    Show the final values immediately for visitors who
    prefer reduced motion.
  */

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  );

  if (prefersReducedMotion.matches) {

    statisticsObserver.disconnect();

    statisticCards.forEach((card) => {
      card.classList.add("is-visible");
    });

    statisticValues.forEach((value) => {

      const targetValue = Number(
        value.dataset.statTarget
      );

      value.textContent = formatStatisticValue(
        targetValue
      );

    });

    statisticsAnimated = true;

  }


  /*
    Backend integration placeholder.

    Mr. Harsh may later replace the demonstration values
    using an API request.

    Suggested endpoint:

    GET /api/platform/statistics
  */

  async function loadPlatformStatistics() {

    const statisticsGrid = document.getElementById(
      "platformStatsGrid"
    );

    if (!statisticsGrid) {
      return;
    }

    const apiEndpoint =
      statisticsGrid.dataset.apiEndpoint;

    if (!apiEndpoint) {
      return;
    }

    /*
      Backend integration example:

      try {

        const response = await fetch(apiEndpoint);

        if (!response.ok) {
          throw new Error("Unable to load statistics.");
        }

        const statistics = await response.json();

        Object.entries(statistics).forEach(
          ([statisticKey, statisticValue]) => {

            const statisticElement =
              document.querySelector(
                `[data-stat-key="${statisticKey}"]`
              );

            if (!statisticElement) {
              return;
            }

            statisticElement.dataset.statTarget =
              String(statisticValue);

          }
        );

      } catch (error) {

        console.error(
          "Platform statistics error:",
          error
        );

      }
    */

  }


  /*
    Keep disabled until the backend API is ready.

    loadPlatformStatistics();
  */

});