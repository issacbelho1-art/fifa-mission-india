// ================= MOBILE MENU =================

const menuButton = document.getElementById("menuButton");
const mainNavigation = document.getElementById("mainNavigation");

if (menuButton && mainNavigation) {
  menuButton.addEventListener("click", function () {
    const isOpen = mainNavigation.classList.toggle("active");

    menuButton.classList.toggle("active", isOpen);
    document.body.classList.toggle("menu-open", isOpen);

    menuButton.setAttribute(
      "aria-expanded",
      String(isOpen)
    );
  });

  mainNavigation
    .querySelectorAll('a[href^="#"]')
    .forEach(function (link) {
      link.addEventListener("click", function (event) {
        const targetId = link.getAttribute("href");

        if (!targetId || targetId === "#") {
          return;
        }

        const targetSection =
          document.querySelector(targetId);

        if (!targetSection) {
          return;
        }

        event.preventDefault();

        menuButton.classList.remove("active");
        mainNavigation.classList.remove("active");
        document.body.classList.remove("menu-open");

        menuButton.setAttribute(
          "aria-expanded",
          "false"
        );

        targetSection.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
      });
    });
}


// ================= STICKY NAVBAR =================

const navbar = document.getElementById("navbar");

if (navbar) {
  window.addEventListener("scroll", function () {
    navbar.classList.toggle(
      "scrolled",
      window.scrollY > 70
    );
  });
}


// ================= REVEAL ANIMATION =================

const revealElements =
  document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) {
          return;
        }

        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      });
    },
    {
      threshold: 0.15
    }
  );

  revealElements.forEach(function (element) {
    revealObserver.observe(element);
  });
} else {
  revealElements.forEach(function (element) {
    element.classList.add("visible");
  });
}


// ================= COUNTER ANIMATION =================

const counters = document.querySelectorAll(".counter");

if ("IntersectionObserver" in window) {
  const counterObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) {
          return;
        }

        const counter = entry.target;
        const target = Number(counter.dataset.target);

        if (!Number.isFinite(target)) {
          counterObserver.unobserve(counter);
          return;
        }

        let currentValue = 0;
        const increment = Math.max(
          1,
          Math.ceil(target / 45)
        );

        const interval = window.setInterval(
          function () {
            currentValue += increment;

            if (currentValue >= target) {
              currentValue = target;
              window.clearInterval(interval);
            }

            counter.textContent =
              currentValue.toLocaleString("en-IN");
          },
          35
        );

        counterObserver.unobserve(counter);
      });
    },
    {
      threshold: 0.5
    }
  );

  counters.forEach(function (counter) {
    counterObserver.observe(counter);
  });
}


// ================= SUPPORT FORM =================

const supportForm =
  document.getElementById("supportForm");

const formMessage =
  document.getElementById("formMessage");

if (supportForm && formMessage) {
  supportForm.addEventListener(
    "submit",
    function (event) {
      event.preventDefault();

      const fullNameInput =
        document.getElementById("fullName");

      const fullName = fullNameInput
        ? fullNameInput.value.trim()
        : "";

      formMessage.textContent =
        "Thank you" +
        (fullName ? ", " + fullName : "") +
        ". Your support has been recorded in this prototype.";

      supportForm.reset();
    }
  );
}

/* ================= SUPPORTER COUNTER ================= */

const supporterCounter = document.getElementById("supporterCount");

function animateSupporterCounter() {
  if (!supporterCounter) return;

  const targetCount = Number(
    supporterCounter.dataset.count
  );

  if (!Number.isFinite(targetCount)) return;

  const animationDuration = 1800;
  const startingTime = performance.now();

  function updateCounter(currentTime) {
    const elapsedTime = currentTime - startingTime;

    const progress = Math.min(
      elapsedTime / animationDuration,
      1
    );

    const easedProgress =
      1 - Math.pow(1 - progress, 3);

    const currentCount = Math.floor(
      targetCount * easedProgress
    );

    supporterCounter.textContent =
      currentCount.toLocaleString("en-IN");

    if (progress < 1) {
      requestAnimationFrame(updateCounter);
    }
  }

  requestAnimationFrame(updateCounter);
}

const supporterObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      animateSupporterCounter();
      observer.unobserve(entry.target);
    });
  },
  {
    threshold: 0.35
  }
);

if (supporterCounter) {
  supporterObserver.observe(supporterCounter);
}

/* =====================================================
   VISION 2034 TIMELINE ANIMATION
===================================================== */

const visionSection = document.querySelector(".vision2034");

if (visionSection) {

    const timelineObserver = new IntersectionObserver(

        (entries) => {

            entries.forEach((entry) => {

                if (entry.isIntersecting) {

                    visionSection.classList.add("timeline-active");

                    timelineObserver.unobserve(entry.target);

                }

            });

        },

        {
            threshold: 0.35
        }

    );

    timelineObserver.observe(visionSection);

}

/* =====================================================
   FEATURED ACADEMIES
===================================================== */

const featuredAcademyCards =
  document.querySelectorAll(
    ".featured-academies .academy-card"
  );

const academyProfileButtons =
  document.querySelectorAll(
    ".featured-academies .academy-button"
  );

const exploreAcademiesButton =
  document.querySelector(
    ".view-all-academies"
  );


/* =====================================================
   ACADEMY IMAGE FALLBACK
===================================================== */

featuredAcademyCards.forEach(function (card) {

  const academyImage =
    card.querySelector(".academy-image img");

  if (!academyImage) return;

  academyImage.addEventListener(
    "error",
    function () {

      if (
        academyImage.dataset.fallbackApplied ===
        "true"
      ) {
        return;
      }

      academyImage.dataset.fallbackApplied =
        "true";

      academyImage.src =
        "images/academy-placeholder.jpg";

      academyImage.alt =
        "Football academy image unavailable";

      academyImage.classList.add(
        "academy-image-fallback"
      );

    }
  );

});


/* =====================================================
   ACADEMY PROFILE LINK VALIDATION
===================================================== */

academyProfileButtons.forEach(function (button) {

  button.addEventListener(
    "click",
    function (event) {

      const academyCard =
        button.closest(".academy-card");

      if (!academyCard) return;

      const academyId =
        academyCard.dataset.academyId;

      if (!academyId) {

        event.preventDefault();

        showAcademyNotification(
          "Academy profile is currently unavailable.",
          "error"
        );

        return;
      }

      const profileUrl =
        new URL(
          button.getAttribute("href"),
          window.location.href
        );

      profileUrl.searchParams.set(
        "id",
        academyId
      );

      button.href =
        profileUrl.pathname +
        profileUrl.search;

    }
  );

});


/* =====================================================
   EXPLORE ALL ACADEMIES
===================================================== */

if (exploreAcademiesButton) {

  exploreAcademiesButton.addEventListener(
    "click",
    function (event) {

      const destination =
        exploreAcademiesButton.getAttribute(
          "href"
        );

      const directoryUnavailable =
        !destination ||
        destination === "#" ||
        destination ===
          "javascript:void(0);";

      if (!directoryUnavailable) {
        return;
      }

      event.preventDefault();

      showAcademyNotification(
        "The complete academies directory is coming soon.",
        "info"
      );

    }
  );

}


/* =====================================================
   ACADEMY NOTIFICATION
===================================================== */

let academyNotificationTimer = null;

function showAcademyNotification(
  message,
  type = "success"
) {

  let notification =
    document.getElementById(
      "academyNotification"
    );

  if (!notification) {

    notification =
      document.createElement("div");

    notification.id =
      "academyNotification";

    notification.className =
      "academy-notification";

    notification.setAttribute(
      "role",
      "status"
    );

    notification.setAttribute(
      "aria-live",
      "polite"
    );

    document.body.appendChild(
      notification
    );

  }

  notification.textContent =
    message;

  notification.className =
    "academy-notification " +
    type +
    " show";

  window.clearTimeout(
    academyNotificationTimer
  );

  academyNotificationTimer =
    window.setTimeout(
      function () {

        notification.classList.remove(
          "show"
        );

      },
      3200
    );

}


/* =====================================================
   BACKEND INTEGRATION PLACEHOLDER
===================================================== */

const featuredAcademiesApi = {

  async getFeaturedAcademies() {

    /*
      Future backend endpoint:

      GET /api/v1/academies/featured
    */

    return [];

  }

};


/* =====================================================
   PUBLIC BACKEND HOOK
===================================================== */

window.featuredAcademies = {

  cards: featuredAcademyCards,

  showNotification:
    showAcademyNotification,

  api: featuredAcademiesApi

};


/* =====================================================
   END FEATURED ACADEMIES
===================================================== */

/* =====================================================
   PARTNERSHIP MODAL OPENING
===================================================== */

const partnerModal = document.getElementById("partnerEnquiryModal");
const partnerTypeSelect = document.getElementById("partnerType");

const partnerModalOpenButtons = document.querySelectorAll(
  "[data-open-partner-modal]"
);

const partnerModalCloseButtons = document.querySelectorAll(
  "[data-close-partner-modal]"
);

let lastPartnerModalTrigger = null;


function openPartnerModal(partnershipType = "") {
  if (!partnerModal) {
    return;
  }

  partnerModal.classList.add("is-open");
  partnerModal.setAttribute("aria-hidden", "false");

  document.body.classList.add("partner-modal-open");

  if (partnerTypeSelect) {
    partnerTypeSelect.value = partnershipType;
  }

  window.setTimeout(() => {
    const firstInput = partnerModal.querySelector(
      "input, select, textarea, button"
    );

    firstInput?.focus();
  }, 100);
}


function closePartnerModal() {
  if (!partnerModal) {
    return;
  }

  partnerModal.classList.remove("is-open");
  partnerModal.setAttribute("aria-hidden", "true");

  document.body.classList.remove("partner-modal-open");

  lastPartnerModalTrigger?.focus();
}


partnerModalOpenButtons.forEach((button) => {
  button.addEventListener("click", () => {
    lastPartnerModalTrigger = button;

    const partnershipType =
      button.dataset.partnershipType || "";

    openPartnerModal(partnershipType);
  });
});


partnerModalCloseButtons.forEach((button) => {
  button.addEventListener("click", closePartnerModal);
});


document.addEventListener("keydown", (event) => {
  if (
    event.key === "Escape" &&
    partnerModal?.classList.contains("is-open")
  ) {
    closePartnerModal();
  }
});

/* =====================================================
   INFINITE AUTO-SLIDING TESTIMONIAL CAROUSEL
===================================================== */

document.addEventListener("DOMContentLoaded", () => {

  const testimonialSlider =
    document.getElementById("testimonialSlider");

  const testimonialSlides = Array.from(
    document.querySelectorAll("[data-testimonial-slide]")
  );

  const previousButton =
    document.getElementById("testimonialPreviousButton");

  const nextButton =
    document.getElementById("testimonialNextButton");

  const pagination =
    document.getElementById("testimonialPagination");

  const currentNumber =
    document.getElementById("testimonialCurrentNumber");

  const totalNumber =
    document.getElementById("testimonialTotalNumber");

  const progressBar =
    document.getElementById("testimonialProgressBar");

  const filterButtons = document.querySelectorAll(
    "[data-testimonial-filter]"
  );

  const emptyState =
    document.getElementById("testimonialEmptyState");


  if (!testimonialSlider || testimonialSlides.length === 0) {
    return;
  }


  /* =====================================================
     CONFIGURATION
  ===================================================== */

  const AUTOPLAY_DELAY = 6000;
  const SWIPE_THRESHOLD = 45;

  let activeSlides = [...testimonialSlides];
  let currentIndex = 0;
  let autoplayTimer = null;
  let currentFilter = "all";
  let touchStartX = 0;
  let touchEndX = 0;
  let isPaused = false;


  /* =====================================================
     HELPERS
  ===================================================== */

  function formatNumber(number) {
    return String(number).padStart(2, "0");
  }


  function getCurrentSlide() {
    return activeSlides[currentIndex] || null;
  }


  /* =====================================================
     PAGINATION
  ===================================================== */

  function buildPagination() {
    if (!pagination) {
      return;
    }

    pagination.innerHTML = "";

    activeSlides.forEach((slide, index) => {
      const dot = document.createElement("button");

      dot.type = "button";
      dot.className = "testimonial-pagination-dot";

      dot.setAttribute(
        "aria-label",
        `Show testimonial ${index + 1}`
      );

      dot.setAttribute(
        "aria-current",
        index === currentIndex ? "true" : "false"
      );

      if (index === currentIndex) {
        dot.classList.add("is-active");
      }

      dot.addEventListener("click", () => {
        showSlide(index);
        restartAutoplay();
      });

      pagination.appendChild(dot);
    });
  }


  function updatePagination() {
    if (!pagination) {
      return;
    }

    const dots = pagination.querySelectorAll(
      ".testimonial-pagination-dot"
    );

    dots.forEach((dot, index) => {
      const isActive = index === currentIndex;

      dot.classList.toggle("is-active", isActive);

      dot.setAttribute(
        "aria-current",
        isActive ? "true" : "false"
      );
    });
  }


  /* =====================================================
     SHOW SLIDE
  ===================================================== */

  function showSlide(index, direction = "next") {
    if (activeSlides.length === 0) {
      return;
    }

    /*
      Infinite looping:

      Last slide + next = first slide
      First slide + previous = last slide
    */

    if (index >= activeSlides.length) {
      currentIndex = 0;
    } else if (index < 0) {
      currentIndex = activeSlides.length - 1;
    } else {
      currentIndex = index;
    }


    testimonialSlides.forEach((slide) => {
      slide.classList.remove(
        "is-active",
        "is-entering-next",
        "is-entering-previous"
      );

      slide.setAttribute("aria-hidden", "true");
      slide.setAttribute("tabindex", "-1");
    });


    const activeSlide = getCurrentSlide();

    if (!activeSlide) {
      return;
    }

    activeSlide.classList.add(
      "is-active",
      direction === "previous"
        ? "is-entering-previous"
        : "is-entering-next"
    );

    activeSlide.setAttribute("aria-hidden", "false");
    activeSlide.setAttribute("tabindex", "0");


    window.setTimeout(() => {
      activeSlide.classList.remove(
        "is-entering-next",
        "is-entering-previous"
      );
    }, 700);


    updateSliderInformation();
    updatePagination();
  }


  /* =====================================================
     SLIDER INFORMATION
  ===================================================== */

  function updateSliderInformation() {
    const totalSlides = activeSlides.length;

    if (currentNumber) {
      currentNumber.textContent =
        formatNumber(currentIndex + 1);
    }

    if (totalNumber) {
      totalNumber.textContent =
        formatNumber(totalSlides);
    }

    if (progressBar) {
      const progress =
        totalSlides > 0
          ? ((currentIndex + 1) / totalSlides) * 100
          : 0;

      progressBar.style.width = `${progress}%`;
    }

    const disableControls = totalSlides <= 1;

    if (previousButton) {
      previousButton.disabled = disableControls;
    }

    if (nextButton) {
      nextButton.disabled = disableControls;
    }
  }


  /* =====================================================
     NEXT AND PREVIOUS
  ===================================================== */

  function showNextSlide() {
    showSlide(currentIndex + 1, "next");
  }


  function showPreviousSlide() {
    showSlide(currentIndex - 1, "previous");
  }


  previousButton?.addEventListener("click", () => {
    showPreviousSlide();
    restartAutoplay();
  });


  nextButton?.addEventListener("click", () => {
    showNextSlide();
    restartAutoplay();
  });


  /* =====================================================
     AUTOPLAY
  ===================================================== */

  function startAutoplay() {
    stopAutoplay();

    if (
      activeSlides.length <= 1 ||
      isPaused ||
      document.hidden
    ) {
      return;
    }

    autoplayTimer = window.setInterval(() => {
      showNextSlide();
    }, AUTOPLAY_DELAY);
  }


  function stopAutoplay() {
    if (autoplayTimer) {
      window.clearInterval(autoplayTimer);
      autoplayTimer = null;
    }
  }


  function restartAutoplay() {
    stopAutoplay();
    startAutoplay();
  }


  /* =====================================================
     PAUSE ON HOVER AND FOCUS
  ===================================================== */

  testimonialSlider.addEventListener("mouseenter", () => {
    isPaused = true;
    stopAutoplay();
  });


  testimonialSlider.addEventListener("mouseleave", () => {
    isPaused = false;
    startAutoplay();
  });


  testimonialSlider.addEventListener("focusin", () => {
    isPaused = true;
    stopAutoplay();
  });


  testimonialSlider.addEventListener("focusout", (event) => {
    if (!testimonialSlider.contains(event.relatedTarget)) {
      isPaused = false;
      startAutoplay();
    }
  });


  /* =====================================================
     PAUSE WHEN TAB IS HIDDEN
  ===================================================== */

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      stopAutoplay();
    } else {
      startAutoplay();
    }
  });


  /* =====================================================
     FILTER TESTIMONIALS
  ===================================================== */

  function filterTestimonials(category) {
    currentFilter = category;

    activeSlides = testimonialSlides.filter((slide) => {
      const slideCategory =
        slide.dataset.testimonialCategory;

      return (
        category === "all" ||
        slideCategory === category
      );
    });


    testimonialSlides.forEach((slide) => {
      const matchesFilter =
        category === "all" ||
        slide.dataset.testimonialCategory === category;

      slide.hidden = !matchesFilter;
      slide.classList.remove("is-active");
      slide.setAttribute("aria-hidden", "true");
    });


    filterButtons.forEach((button) => {
      const isActive =
        button.dataset.testimonialFilter === category;

      button.classList.toggle("is-active", isActive);

      button.setAttribute(
        "aria-pressed",
        isActive ? "true" : "false"
      );
    });


    currentIndex = 0;


    if (emptyState) {
      emptyState.hidden = activeSlides.length !== 0;
    }


    testimonialSlider.hidden =
      activeSlides.length === 0;


    if (activeSlides.length > 0) {
      buildPagination();
      showSlide(0);
      restartAutoplay();
    } else {
      stopAutoplay();

      if (currentNumber) {
        currentNumber.textContent = "00";
      }

      if (totalNumber) {
        totalNumber.textContent = "00";
      }

      if (progressBar) {
        progressBar.style.width = "0%";
      }
    }
  }


  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const category =
        button.dataset.testimonialFilter || "all";

      filterTestimonials(category);
    });
  });


  /* =====================================================
     KEYBOARD NAVIGATION
  ===================================================== */

  testimonialSlider.addEventListener("keydown", (event) => {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      showNextSlide();
      restartAutoplay();
    }

    if (event.key === "ArrowLeft") {
      event.preventDefault();
      showPreviousSlide();
      restartAutoplay();
    }

    if (event.key === "Home") {
      event.preventDefault();
      showSlide(0);
      restartAutoplay();
    }

    if (event.key === "End") {
      event.preventDefault();
      showSlide(activeSlides.length - 1);
      restartAutoplay();
    }
  });


  /* =====================================================
     MOBILE SWIPE
  ===================================================== */

  testimonialSlider.addEventListener(
    "touchstart",
    (event) => {
      touchStartX = event.changedTouches[0].screenX;
      touchEndX = touchStartX;

      isPaused = true;
      stopAutoplay();
    },
    {
      passive: true
    }
  );


  testimonialSlider.addEventListener(
    "touchmove",
    (event) => {
      touchEndX = event.changedTouches[0].screenX;
    },
    {
      passive: true
    }
  );


  testimonialSlider.addEventListener(
    "touchend",
    () => {
      const swipeDistance =
        touchEndX - touchStartX;

      if (Math.abs(swipeDistance) >= SWIPE_THRESHOLD) {
        if (swipeDistance < 0) {
          showNextSlide();
        } else {
          showPreviousSlide();
        }
      }

      isPaused = false;
      restartAutoplay();
    },
    {
      passive: true
    }
  );


  /* =====================================================
     REDUCED MOTION
  ===================================================== */

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  );


  function handleReducedMotion(event) {
    if (event.matches) {
      stopAutoplay();
    } else {
      startAutoplay();
    }
  }


  prefersReducedMotion.addEventListener?.(
    "change",
    handleReducedMotion
  );


  /* =====================================================
     INITIALISE
  ===================================================== */

  testimonialSlider.setAttribute("tabindex", "0");

  filterTestimonials(currentFilter);

  if (!prefersReducedMotion.matches) {
    startAutoplay();
  }

});

/* =====================================================
   EXPLORE REGION BUTTON
===================================================== */

const exploreRegionButton =
document.getElementById("exploreRegionButton");

const regionPages = {

    north:{
        label:"North India",
        page:"north-india.html"
    },

    northeast:{
        label:"North-East India",
        page:"north-east-india.html"
    },

    west:{
        label:"West India",
        page:"west-india.html"
    },

    east:{
        label:"East India",
        page:"east-india.html"
    },

    central:{
        label:"Central India",
        page:"central-india.html"
    },

    south:{
        label:"South India",
        page:"south-india.html"
    }

};


function updateExploreRegionButton(regionKey){

    if(!exploreRegionButton){
        return;
    }

    const region=regionPages[regionKey];

    if(!region){
        return;
    }

    exploreRegionButton.href=region.page;

    exploreRegionButton.dataset.selectedRegion=regionKey;

    exploreRegionButton.innerHTML=`
        Explore ${region.label}
        <span aria-hidden="true">→</span>
    `;

}