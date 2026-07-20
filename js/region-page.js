/* =========================================================
   MISSION FIFA 2034
   SHARED REGIONAL PAGE JAVASCRIPT
   File: region-page.js
========================================================= */

"use strict";


/* =========================================================
   1. REGIONAL PAGE APPLICATION
========================================================= */

const RegionPageApp = (() => {

  const state = {
    menuOpen: false,
    countersStarted: false,
    currentSection: "",
    prefersReducedMotion: false
  };


  const elements = {
    body: document.body,
    header: document.getElementById("regionHeader"),
    menuButton: document.getElementById("regionMobileMenuButton"),
    navigation: document.getElementById("regionNavigation"),
    navigationOverlay: document.getElementById(
      "regionNavigationOverlay"
    ),
    currentYear: document.getElementById("regionCurrentYear"),
    navigationLinks: [],
    counters: [],
    revealElements: [],
    sections: []
  };


  /* =========================================================
     2. INITIALISE
  ========================================================= */

  function init() {

    state.prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    cacheElements();
    setCurrentYear();
    setupHeaderScroll();
    setupMobileNavigation();
    setupSmoothNavigation();
    setupActiveNavigation();
    setupCounters();
    setupRevealAnimations();
    setupExternalLinkSecurity();
    setupKeyboardControls();
    setupResizeHandling();
  }


  /* =========================================================
     3. CACHE ELEMENTS
  ========================================================= */

  function cacheElements() {

    elements.navigationLinks = Array.from(
      document.querySelectorAll(
        ".region-navigation a[href^='#']"
      )
    );

    elements.counters = Array.from(
      document.querySelectorAll(
        "[data-region-counter]"
      )
    );

    elements.sections = elements.navigationLinks
      .map((link) => {

        const sectionId = link.getAttribute("href");

        if (!sectionId || sectionId === "#") {
          return null;
        }

        return document.querySelector(sectionId);

      })
      .filter(Boolean);

    elements.revealElements = Array.from(
      document.querySelectorAll(
        [
          ".region-section-heading",
          ".region-stat-card",
          ".region-data-note",
          ".region-area-card",
          ".region-opportunities-panel",
          ".region-academy-card",
          ".region-event-card",
          ".region-cta-panel"
        ].join(",")
      )
    );

  }


  /* =========================================================
     4. CURRENT YEAR
  ========================================================= */

  function setCurrentYear() {

    if (!elements.currentYear) {
      return;
    }

    elements.currentYear.textContent =
      new Date().getFullYear().toString();

  }


  /* =========================================================
     5. HEADER SCROLL EFFECT
  ========================================================= */

  function setupHeaderScroll() {

    if (!elements.header) {
      return;
    }

    updateHeaderState();

    window.addEventListener(
      "scroll",
      throttle(updateHeaderState, 80),
      { passive: true }
    );

  }


  function updateHeaderState() {

    if (!elements.header) {
      return;
    }

    const hasScrolled = window.scrollY > 18;

    elements.header.classList.toggle(
      "region-header-scrolled",
      hasScrolled
    );

  }


  /* =========================================================
     6. MOBILE NAVIGATION
  ========================================================= */

  function setupMobileNavigation() {

    if (
      !elements.menuButton ||
      !elements.navigation
    ) {
      return;
    }

    elements.menuButton.addEventListener(
      "click",
      toggleMobileMenu
    );

    if (elements.navigationOverlay) {

      elements.navigationOverlay.addEventListener(
        "click",
        closeMobileMenu
      );

    }

    elements.navigationLinks.forEach((link) => {

      link.addEventListener(
        "click",
        closeMobileMenu
      );

    });

  }


  function toggleMobileMenu() {

    if (state.menuOpen) {
      closeMobileMenu();
    } else {
      openMobileMenu();
    }

  }


  function openMobileMenu() {

    if (
      !elements.menuButton ||
      !elements.navigation
    ) {
      return;
    }

    state.menuOpen = true;

    elements.menuButton.classList.add(
      "region-menu-active"
    );

    elements.navigation.classList.add(
      "region-navigation-open"
    );

    elements.menuButton.setAttribute(
      "aria-expanded",
      "true"
    );

    elements.menuButton.setAttribute(
      "aria-label",
      "Close navigation menu"
    );

    elements.body.classList.add(
      "region-menu-open"
    );

    if (elements.navigationOverlay) {
      elements.navigationOverlay.hidden = false;
    }

  }


  function closeMobileMenu() {

    if (
      !elements.menuButton ||
      !elements.navigation
    ) {
      return;
    }

    state.menuOpen = false;

    elements.menuButton.classList.remove(
      "region-menu-active"
    );

    elements.navigation.classList.remove(
      "region-navigation-open"
    );

    elements.menuButton.setAttribute(
      "aria-expanded",
      "false"
    );

    elements.menuButton.setAttribute(
      "aria-label",
      "Open navigation menu"
    );

    elements.body.classList.remove(
      "region-menu-open"
    );

    if (elements.navigationOverlay) {
      elements.navigationOverlay.hidden = true;
    }

  }


  /* =========================================================
     7. SMOOTH SECTION NAVIGATION
  ========================================================= */

  function setupSmoothNavigation() {

    const internalLinks = document.querySelectorAll(
      'a[href^="#"]:not([href="#"])'
    );

    internalLinks.forEach((link) => {

      link.addEventListener(
        "click",
        handleSmoothNavigation
      );

    });

  }


  function handleSmoothNavigation(event) {

    const link = event.currentTarget;
    const targetId = link.getAttribute("href");

    if (!targetId) {
      return;
    }

    const targetSection =
      document.querySelector(targetId);

    if (!targetSection) {
      return;
    }

    event.preventDefault();

    const headerHeight =
      elements.header
        ? elements.header.offsetHeight
        : 0;

    const targetPosition =
      targetSection.getBoundingClientRect().top +
      window.scrollY -
      headerHeight -
      10;

    window.scrollTo({
      top: targetPosition,
      behavior:
        state.prefersReducedMotion
          ? "auto"
          : "smooth"
    });

    if (history.pushState) {

      history.pushState(
        null,
        "",
        targetId
      );

    }

  }


  /* =========================================================
     8. ACTIVE NAVIGATION
  ========================================================= */

  function setupActiveNavigation() {

    if (
      !elements.sections.length ||
      !elements.navigationLinks.length
    ) {
      return;
    }

    if ("IntersectionObserver" in window) {

      const sectionObserver =
        new IntersectionObserver(
          handleSectionIntersection,
          {
            root: null,
            rootMargin: "-35% 0px -55% 0px",
            threshold: 0
          }
        );

      elements.sections.forEach((section) => {
        sectionObserver.observe(section);
      });

    } else {

      window.addEventListener(
        "scroll",
        throttle(updateActiveSectionFallback, 120),
        { passive: true }
      );

      updateActiveSectionFallback();

    }

  }


  function handleSectionIntersection(entries) {

    const visibleEntries = entries.filter(
      (entry) => entry.isIntersecting
    );

    if (!visibleEntries.length) {
      return;
    }

    const activeEntry = visibleEntries.sort(
      (firstEntry, secondEntry) =>
        secondEntry.intersectionRatio -
        firstEntry.intersectionRatio
    )[0];

    setActiveNavigation(
      activeEntry.target.id
    );

  }


  function updateActiveSectionFallback() {

    const headerOffset =
      elements.header
        ? elements.header.offsetHeight + 70
        : 100;

    let activeSectionId = "";

    elements.sections.forEach((section) => {

      const sectionTop =
        section.offsetTop - headerOffset;

      if (window.scrollY >= sectionTop) {
        activeSectionId = section.id;
      }

    });

    if (activeSectionId) {
      setActiveNavigation(activeSectionId);
    }

  }


  function setActiveNavigation(sectionId) {

    if (
      !sectionId ||
      state.currentSection === sectionId
    ) {
      return;
    }

    state.currentSection = sectionId;

    elements.navigationLinks.forEach((link) => {

      const isActive =
        link.getAttribute("href") ===
        `#${sectionId}`;

      link.classList.toggle(
        "region-nav-active",
        isActive
      );

      if (isActive) {

        link.setAttribute(
          "aria-current",
          "location"
        );

      } else {

        link.removeAttribute(
          "aria-current"
        );

      }

    });

  }


  /* =========================================================
     9. ANIMATED STATISTIC COUNTERS
  ========================================================= */

  function setupCounters() {

    if (!elements.counters.length) {
      return;
    }

    if (state.prefersReducedMotion) {

      elements.counters.forEach(
        displayFinalCounterValue
      );

      state.countersStarted = true;
      return;
    }

    const statisticsSection =
      document.getElementById("statistics");

    if (
      statisticsSection &&
      "IntersectionObserver" in window
    ) {

      const counterObserver =
        new IntersectionObserver(
          (entries, observer) => {

            entries.forEach((entry) => {

              if (
                entry.isIntersecting &&
                !state.countersStarted
              ) {

                state.countersStarted = true;

                elements.counters.forEach(
                  animateCounter
                );

                observer.unobserve(entry.target);

              }

            });

          },
          {
            threshold: 0.25
          }
        );

      counterObserver.observe(
        statisticsSection
      );

    } else {

      state.countersStarted = true;

      elements.counters.forEach(
        animateCounter
      );

    }

  }


  function animateCounter(counterElement) {

    const targetValue = Number.parseInt(
      counterElement.dataset.regionCounter,
      10
    );

    if (
      !Number.isFinite(targetValue) ||
      targetValue < 0
    ) {
      counterElement.textContent = "0";
      return;
    }

    const duration = 1500;
    const startTime = performance.now();

    function updateCounter(currentTime) {

      const elapsed = currentTime - startTime;

      const progress = Math.min(
        elapsed / duration,
        1
      );

      const easedProgress =
        1 - Math.pow(1 - progress, 3);

      const currentValue = Math.floor(
        targetValue * easedProgress
      );

      counterElement.textContent =
        formatNumber(currentValue);

      if (progress < 1) {

        window.requestAnimationFrame(
          updateCounter
        );

      } else {

        counterElement.textContent =
          formatNumber(targetValue);

      }

    }

    window.requestAnimationFrame(
      updateCounter
    );

  }


  function displayFinalCounterValue(counterElement) {

    const targetValue = Number.parseInt(
      counterElement.dataset.regionCounter,
      10
    );

    counterElement.textContent =
      Number.isFinite(targetValue)
        ? formatNumber(targetValue)
        : "0";

  }


  function formatNumber(value) {

    return new Intl.NumberFormat(
      "en-IN"
    ).format(value);

  }


  /* =========================================================
     10. REVEAL ANIMATIONS
  ========================================================= */

  function setupRevealAnimations() {

    if (!elements.revealElements.length) {
      return;
    }

    elements.revealElements.forEach(
      (element, index) => {

        element.classList.add(
          "region-reveal"
        );

        element.style.transitionDelay =
          `${Math.min(index % 4, 3) * 70}ms`;

      }
    );

    if (state.prefersReducedMotion) {

      elements.revealElements.forEach(
        revealElement
      );

      return;
    }

    if ("IntersectionObserver" in window) {

      const revealObserver =
        new IntersectionObserver(
          (entries, observer) => {

            entries.forEach((entry) => {

              if (!entry.isIntersecting) {
                return;
              }

              revealElement(entry.target);
              observer.unobserve(entry.target);

            });

          },
          {
            threshold: 0.12,
            rootMargin: "0px 0px -45px 0px"
          }
        );

      elements.revealElements.forEach(
        (element) => {
          revealObserver.observe(element);
        }
      );

    } else {

      elements.revealElements.forEach(
        revealElement
      );

    }

  }


  function revealElement(element) {

    element.classList.add(
      "region-visible"
    );

    element.style.transitionDelay = "";

  }


  /* =========================================================
     11. EXTERNAL LINK SECURITY
  ========================================================= */

  function setupExternalLinkSecurity() {

    const externalLinks = document.querySelectorAll(
      'a[target="_blank"]'
    );

    externalLinks.forEach((link) => {

      const currentRel =
        link.getAttribute("rel") || "";

      const relValues =
        new Set(
          currentRel
            .split(/\s+/)
            .filter(Boolean)
        );

      relValues.add("noopener");
      relValues.add("noreferrer");

      link.setAttribute(
        "rel",
        Array.from(relValues).join(" ")
      );

    });

  }


  /* =========================================================
     12. KEYBOARD CONTROLS
  ========================================================= */

  function setupKeyboardControls() {

    document.addEventListener(
      "keydown",
      (event) => {

        if (
          event.key === "Escape" &&
          state.menuOpen
        ) {

          closeMobileMenu();

          if (elements.menuButton) {
            elements.menuButton.focus();
          }

        }

      }
    );

  }


  /* =========================================================
     13. RESIZE HANDLING
  ========================================================= */

  function setupResizeHandling() {

    window.addEventListener(
      "resize",
      debounce(() => {

        if (
          window.innerWidth > 980 &&
          state.menuOpen
        ) {

          closeMobileMenu();

        }

      }, 140)
    );

  }


  /* =========================================================
     14. UTILITY: THROTTLE
  ========================================================= */

  function throttle(callback, delay) {

    let isWaiting = false;
    let latestArguments = null;
    let latestContext = null;

    return function throttledFunction(...args) {

      latestArguments = args;
      latestContext = this;

      if (isWaiting) {
        return;
      }

      callback.apply(
        latestContext,
        latestArguments
      );

      isWaiting = true;

      window.setTimeout(() => {

        isWaiting = false;

        if (latestArguments) {

          callback.apply(
            latestContext,
            latestArguments
          );

          latestArguments = null;
          latestContext = null;

        }

      }, delay);

    };

  }


  /* =========================================================
     15. UTILITY: DEBOUNCE
  ========================================================= */

  function debounce(callback, delay) {

    let timeoutId;

    return function debouncedFunction(...args) {

      window.clearTimeout(timeoutId);

      timeoutId = window.setTimeout(
        () => {
          callback.apply(this, args);
        },
        delay
      );

    };

  }


  /* =========================================================
     16. PUBLIC API
  ========================================================= */

  return {
    init,
    openMobileMenu,
    closeMobileMenu
  };

})();


/* =========================================================
   17. START APPLICATION
========================================================= */

if (document.readyState === "loading") {

  document.addEventListener(
    "DOMContentLoaded",
    RegionPageApp.init
  );

} else {

  RegionPageApp.init();

}