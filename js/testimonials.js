/* =====================================================
   TESTIMONIALS
   Frontend-only carousel and filtering

   Backend integration: Mr. Harsh
===================================================== */

document.addEventListener("DOMContentLoaded", () => {

  const testimonialSlider = document.getElementById(
    "testimonialSlider"
  );

  const testimonialViewport = document.getElementById(
    "testimonialSliderViewport"
  );

  const allSlides = Array.from(
    document.querySelectorAll("[data-testimonial-slide]")
  );

  const filterButtons = document.querySelectorAll(
    "[data-testimonial-filter]"
  );

  const previousButton = document.getElementById(
    "testimonialPreviousButton"
  );

  const nextButton = document.getElementById(
    "testimonialNextButton"
  );

  const pagination = document.getElementById(
    "testimonialPagination"
  );

  const currentNumber = document.getElementById(
    "testimonialCurrentNumber"
  );

  const totalNumber = document.getElementById(
    "testimonialTotalNumber"
  );

  const progressBar = document.getElementById(
    "testimonialProgressBar"
  );

  const emptyState = document.getElementById(
    "testimonialEmptyState"
  );


  if (
    !testimonialSlider ||
    !testimonialViewport ||
    allSlides.length === 0 ||
    !previousButton ||
    !nextButton ||
    !pagination
  ) {
    return;
  }


  const AUTO_PLAY_DELAY = 7000;

  let visibleSlides = [...allSlides];
  let activeIndex = 0;
  let autoPlayTimer = null;
  let touchStartX = 0;
  let touchEndX = 0;
  let isPointerInside = false;
  let selectedFilter = "all";


  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;


  function formatSlideNumber(number) {

    return String(number).padStart(2, "0");

  }


  function updateFilterButtons(filterValue) {

    filterButtons.forEach((button) => {

      const isActive =
        button.dataset.testimonialFilter === filterValue;

      button.classList.toggle(
        "is-active",
        isActive
      );

      button.setAttribute(
        "aria-pressed",
        String(isActive)
      );

    });

  }


  function createPagination() {

    pagination.replaceChildren();


    visibleSlides.forEach((slide, index) => {

      const paginationButton =
        document.createElement("button");

      paginationButton.type = "button";

      paginationButton.className =
        "testimonial-pagination-btn";

      paginationButton.setAttribute(
        "aria-label",
        `Show testimonial ${index + 1}`
      );

      paginationButton.addEventListener(
        "click",
        () => {

          showSlide(index, "next");
          restartAutoPlay();

        }
      );

      pagination.appendChild(paginationButton);

    });

  }


  function updateSliderInterface() {

    const paginationButtons =
      pagination.querySelectorAll(
        ".testimonial-pagination-btn"
      );


    paginationButtons.forEach((button, index) => {

      const isActive = index === activeIndex;

      button.classList.toggle(
        "is-active",
        isActive
      );

      button.setAttribute(
        "aria-current",
        isActive ? "true" : "false"
      );

    });


    if (currentNumber) {

      currentNumber.textContent =
        formatSlideNumber(activeIndex + 1);

    }


    if (totalNumber) {

      totalNumber.textContent =
        formatSlideNumber(visibleSlides.length);

    }


    if (progressBar) {

      const progressPercentage =
        ((activeIndex + 1) / visibleSlides.length) * 100;

      progressBar.style.width =
        `${progressPercentage}%`;

    }


    const controlsShouldDisable =
      visibleSlides.length <= 1;

    previousButton.disabled =
      controlsShouldDisable;

    nextButton.disabled =
      controlsShouldDisable;

  }


  function showSlide(newIndex, direction = "next") {

    if (visibleSlides.length === 0) {
      return;
    }


    if (newIndex < 0) {

      newIndex = visibleSlides.length - 1;

    } else if (newIndex >= visibleSlides.length) {

      newIndex = 0;

    }


    const previousSlide =
      visibleSlides[activeIndex];

    const nextSlide =
      visibleSlides[newIndex];


    if (
      previousSlide === nextSlide &&
      previousSlide.classList.contains("is-active")
    ) {

      updateSliderInterface();
      return;

    }


    allSlides.forEach((slide) => {

      slide.classList.remove(
        "is-exiting-left",
        "is-exiting-right"
      );

    });


    if (previousSlide) {

      previousSlide.classList.remove("is-active");

      previousSlide.classList.add(
        direction === "next"
          ? "is-exiting-left"
          : "is-exiting-right"
      );

      previousSlide.setAttribute(
        "aria-hidden",
        "true"
      );


      window.setTimeout(() => {

        previousSlide.classList.remove(
          "is-exiting-left",
          "is-exiting-right"
        );

      }, prefersReducedMotion ? 0 : 560);

    }


    activeIndex = newIndex;

    nextSlide.classList.add("is-active");

    nextSlide.setAttribute(
      "aria-hidden",
      "false"
    );


    updateSliderInterface();

  }


  function showNextSlide() {

    showSlide(activeIndex + 1, "next");

  }


  function showPreviousSlide() {

    showSlide(activeIndex - 1, "previous");

  }


  function filterTestimonials(filterValue) {

    selectedFilter = filterValue;


    visibleSlides = allSlides.filter((slide) => {

      return (
        filterValue === "all" ||
        slide.dataset.testimonialCategory === filterValue
      );

    });


    allSlides.forEach((slide) => {

      slide.classList.remove(
        "is-active",
        "is-exiting-left",
        "is-exiting-right"
      );

      slide.setAttribute(
        "aria-hidden",
        "true"
      );

      slide.hidden = !visibleSlides.includes(slide);

    });


    updateFilterButtons(filterValue);


    if (visibleSlides.length === 0) {

      testimonialViewport.hidden = true;

      if (emptyState) {
        emptyState.hidden = false;
      }

      previousButton.disabled = true;
      nextButton.disabled = true;

      pagination.replaceChildren();

      if (currentNumber) {
        currentNumber.textContent = "00";
      }

      if (totalNumber) {
        totalNumber.textContent = "00";
      }

      if (progressBar) {
        progressBar.style.width = "0%";
      }

      stopAutoPlay();

      return;

    }


    testimonialViewport.hidden = false;

    if (emptyState) {
      emptyState.hidden = true;
    }


    activeIndex = 0;

    visibleSlides[0].hidden = false;
    visibleSlides[0].classList.add("is-active");

    visibleSlides[0].setAttribute(
      "aria-hidden",
      "false"
    );


    createPagination();
    updateSliderInterface();
    restartAutoPlay();

  }


  function startAutoPlay() {

    if (
      prefersReducedMotion ||
      visibleSlides.length <= 1 ||
      document.hidden ||
      isPointerInside
    ) {
      return;
    }


    stopAutoPlay();


    autoPlayTimer = window.setInterval(() => {

      showNextSlide();

    }, AUTO_PLAY_DELAY);

  }


  function stopAutoPlay() {

    if (!autoPlayTimer) {
      return;
    }

    window.clearInterval(autoPlayTimer);
    autoPlayTimer = null;

  }


  function restartAutoPlay() {

    stopAutoPlay();
    startAutoPlay();

  }


  previousButton.addEventListener("click", () => {

    showPreviousSlide();
    restartAutoPlay();

  });


  nextButton.addEventListener("click", () => {

    showNextSlide();
    restartAutoPlay();

  });


  filterButtons.forEach((button) => {

    button.addEventListener("click", () => {

      const selectedCategory =
        button.dataset.testimonialFilter;

      filterTestimonials(selectedCategory);

    });

  });


  /* ===================================================
     KEYBOARD NAVIGATION
  =================================================== */

  testimonialSlider.addEventListener(
    "keydown",
    (event) => {

      if (event.key === "ArrowRight") {

        event.preventDefault();

        showNextSlide();
        restartAutoPlay();

      }


      if (event.key === "ArrowLeft") {

        event.preventDefault();

        showPreviousSlide();
        restartAutoPlay();

      }

    }
  );


  /*
    Makes the carousel itself keyboard-focusable
    without adding it to every normal tab sequence.
  */

  testimonialSlider.setAttribute(
    "tabindex",
    "0"
  );


  /* ===================================================
     TOUCH / SWIPE SUPPORT
  =================================================== */

  testimonialViewport.addEventListener(
    "touchstart",
    (event) => {

      touchStartX =
        event.changedTouches[0].screenX;

      stopAutoPlay();

    },
    {
      passive: true
    }
  );


  testimonialViewport.addEventListener(
    "touchend",
    (event) => {

      touchEndX =
        event.changedTouches[0].screenX;

      const swipeDistance =
        touchStartX - touchEndX;


      if (Math.abs(swipeDistance) >= 50) {

        if (swipeDistance > 0) {

          showNextSlide();

        } else {

          showPreviousSlide();

        }

      }

      restartAutoPlay();

    },
    {
      passive: true
    }
  );


  /* ===================================================
     PAUSE DURING INTERACTION
  =================================================== */

  testimonialSlider.addEventListener(
    "mouseenter",
    () => {

      isPointerInside = true;
      stopAutoPlay();

    }
  );


  testimonialSlider.addEventListener(
    "mouseleave",
    () => {

      isPointerInside = false;
      startAutoPlay();

    }
  );


  testimonialSlider.addEventListener(
    "focusin",
    stopAutoPlay
  );


  testimonialSlider.addEventListener(
    "focusout",
    (event) => {

      if (
        testimonialSlider.contains(
          event.relatedTarget
        )
      ) {
        return;
      }

      startAutoPlay();

    }
  );


  document.addEventListener(
    "visibilitychange",
    () => {

      if (document.hidden) {

        stopAutoPlay();

      } else {

        startAutoPlay();

      }

    }
  );


  /* ===================================================
     BACKEND INTEGRATION PLACEHOLDER
  =================================================== */

  async function loadTestimonials() {

    const apiEndpoint =
      testimonialSlider.dataset.apiEndpoint;

    if (!apiEndpoint) {
      return;
    }


    /*
      Backend integration example:

      try {

        const response = await fetch(apiEndpoint);

        if (!response.ok) {
          throw new Error(
            "Unable to load testimonials."
          );
        }

        const testimonials =
          await response.json();

        renderTestimonials(testimonials);

      } catch (error) {

        console.error(
          "Testimonial loading error:",
          error
        );

      }
    */

  }


  /*
    Keep disabled until Mr. Harsh connects the API.

    loadTestimonials();
  */


  filterTestimonials(selectedFilter);

});