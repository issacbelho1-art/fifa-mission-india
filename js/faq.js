/* =====================================================
   FREQUENTLY ASKED QUESTIONS
   Frontend-only accordion, filtering and search

   Backend integration: Mr. Harsh
===================================================== */

document.addEventListener("DOMContentLoaded", () => {

  const faqList = document.getElementById("faqList");

  const faqItems = Array.from(
    document.querySelectorAll("[data-faq-item]")
  );

  const categoryButtons = document.querySelectorAll(
    "[data-faq-filter]"
  );

  const searchInput = document.getElementById(
    "faqSearchInput"
  );

  const clearSearchButton = document.getElementById(
    "faqSearchClear"
  );

  const resetSearchButton = document.getElementById(
    "resetFaqSearch"
  );

  const emptyState = document.getElementById(
    "faqEmptyState"
  );

  const resultsHeading = document.getElementById(
    "faqResultsHeading"
  );

  const resultsCount = document.getElementById(
    "faqResultsCount"
  );

  const supportButton = document.getElementById(
    "faqSupportButton"
  );


  if (
    !faqList ||
    faqItems.length === 0 ||
    !searchInput
  ) {
    return;
  }


  let activeCategory = "all";
  let searchQuery = "";


  const categoryTitles = {
    all: "All Questions",
    general: "General Questions",
    players: "Player Questions",
    academies: "Academy Questions",
    scouting: "Scouting Questions",
    security: "Safety and Privacy"
  };


  /* ===================================================
     ACCORDION
  =================================================== */

  function openFaqItem(item) {

    const button = item.querySelector(
      ".faq-question-button"
    );

    const answer = item.querySelector(
      ".faq-answer"
    );

    if (!button || !answer) {
      return;
    }

    item.classList.add("is-open");

    button.setAttribute(
      "aria-expanded",
      "true"
    );

    answer.hidden = false;

  }


  function closeFaqItem(item) {

    const button = item.querySelector(
      ".faq-question-button"
    );

    const answer = item.querySelector(
      ".faq-answer"
    );

    if (!button || !answer) {
      return;
    }

    item.classList.remove("is-open");

    button.setAttribute(
      "aria-expanded",
      "false"
    );


    /*
      Keep the element available during the closing
      animation, then apply hidden.
    */

    window.setTimeout(() => {

      if (!item.classList.contains("is-open")) {
        answer.hidden = true;
      }

    }, 410);

  }


  function closeAllFaqItems(exceptItem = null) {

    faqItems.forEach((item) => {

      if (item === exceptItem) {
        return;
      }

      closeFaqItem(item);

    });

  }


  faqItems.forEach((item) => {

    const button = item.querySelector(
      ".faq-question-button"
    );

    if (!button) {
      return;
    }


    button.addEventListener("click", () => {

      const itemIsOpen =
        item.classList.contains("is-open");

      closeAllFaqItems(item);


      if (itemIsOpen) {

        closeFaqItem(item);

      } else {

        openFaqItem(item);

      }

    });

  });


  /* ===================================================
     SEARCH AND FILTERING
  =================================================== */

  function normaliseText(value) {

    return value
      .toLowerCase()
      .trim()
      .replace(/\s+/g, " ");

  }


  function getFaqSearchText(item) {

    const question =
      item.querySelector(
        ".faq-question-text"
      )?.textContent || "";

    const answer =
      item.querySelector(
        ".faq-answer-inner p"
      )?.textContent || "";

    const keywords =
      item.dataset.faqKeywords || "";

    return normaliseText(
      `${question} ${answer} ${keywords}`
    );

  }


  function updateCategoryButtons() {

    categoryButtons.forEach((button) => {

      const isActive =
        button.dataset.faqFilter ===
        activeCategory;

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


  function updateFaqResults() {

    const normalisedQuery =
      normaliseText(searchQuery);

    let visibleCount = 0;


    faqItems.forEach((item) => {

      const categoryMatches =
        activeCategory === "all" ||
        item.dataset.faqCategory ===
          activeCategory;

      const searchMatches =
        normalisedQuery === "" ||
        getFaqSearchText(item).includes(
          normalisedQuery
        );

      const shouldShow =
        categoryMatches && searchMatches;


      item.classList.toggle(
        "is-hidden",
        !shouldShow
      );


      if (!shouldShow) {

        closeFaqItem(item);

      } else {

        visibleCount += 1;

      }

    });


    if (resultsHeading) {

      resultsHeading.textContent =
        normalisedQuery
          ? `Search Results for “${searchQuery.trim()}”`
          : categoryTitles[activeCategory];

    }


    if (resultsCount) {

      resultsCount.textContent =
        `${visibleCount} ${
          visibleCount === 1
            ? "question"
            : "questions"
        }`;

    }


    if (emptyState) {

      emptyState.hidden =
        visibleCount !== 0;

    }


    faqList.hidden =
      visibleCount === 0;


    if (clearSearchButton) {

      clearSearchButton.hidden =
        searchQuery.length === 0;

    }


    updateCategoryButtons();


    /*
      Open the first matching question when filtering,
      but not while the user is actively typing.
    */

    if (
      visibleCount > 0 &&
      normalisedQuery === ""
    ) {

      const firstVisibleItem =
        faqItems.find(
          (item) =>
            !item.classList.contains("is-hidden")
        );

      closeAllFaqItems(firstVisibleItem);

      if (firstVisibleItem) {
        openFaqItem(firstVisibleItem);
      }

    }

  }


  categoryButtons.forEach((button) => {

    button.addEventListener("click", () => {

      activeCategory =
        button.dataset.faqFilter || "all";

      updateFaqResults();

    });

  });


  searchInput.addEventListener("input", () => {

    searchQuery = searchInput.value;

    updateFaqResults();

  });


  function resetFaqFilters() {

    activeCategory = "all";
    searchQuery = "";

    searchInput.value = "";

    updateFaqResults();

    searchInput.focus();

  }


  clearSearchButton?.addEventListener(
    "click",
    () => {

      searchQuery = "";
      searchInput.value = "";

      updateFaqResults();

      searchInput.focus();

    }
  );


  resetSearchButton?.addEventListener(
    "click",
    resetFaqFilters
  );


  /* ===================================================
     KEYBOARD NAVIGATION
  =================================================== */

  faqList.addEventListener(
    "keydown",
    (event) => {

      const currentButton =
        event.target.closest(
          ".faq-question-button"
        );

      if (!currentButton) {
        return;
      }


      const visibleButtons = faqItems
        .filter(
          (item) =>
            !item.classList.contains("is-hidden")
        )
        .map(
          (item) =>
            item.querySelector(
              ".faq-question-button"
            )
        )
        .filter(Boolean);


      const currentIndex =
        visibleButtons.indexOf(currentButton);


      if (currentIndex === -1) {
        return;
      }


      let nextIndex = currentIndex;


      if (event.key === "ArrowDown") {

        nextIndex =
          (currentIndex + 1) %
          visibleButtons.length;

      } else if (event.key === "ArrowUp") {

        nextIndex =
          (
            currentIndex -
            1 +
            visibleButtons.length
          ) % visibleButtons.length;

      } else if (event.key === "Home") {

        nextIndex = 0;

      } else if (event.key === "End") {

        nextIndex =
          visibleButtons.length - 1;

      } else {

        return;

      }


      event.preventDefault();

      visibleButtons[nextIndex].focus();

    }
  );


  /* ===================================================
     SUPPORT BUTTON PLACEHOLDER
  =================================================== */

  supportButton?.addEventListener(
    "click",
    () => {

      const supportRoute =
        supportButton.dataset.supportRoute;

      console.log(
        "FAQ support route:",
        supportRoute
      );


      /*
        Future frontend route:

        window.location.href =
          supportRoute || "contact.html";
      */

    }
  );


  /* ===================================================
     BACKEND FAQ PLACEHOLDER
  =================================================== */

  async function loadFaqs() {

    const apiEndpoint =
      faqList.dataset.apiEndpoint;

    if (!apiEndpoint) {
      return;
    }


    /*
      Backend integration example:

      try {

        const response = await fetch(apiEndpoint);

        if (!response.ok) {
          throw new Error(
            "Unable to load frequently asked questions."
          );
        }

        const faqs = await response.json();

        renderFaqItems(faqs);

      } catch (error) {

        console.error(
          "FAQ loading error:",
          error
        );

      }
    */

  }


  /*
    Keep disabled until Mr. Harsh connects the API.

    loadFaqs();
  */


  updateFaqResults();

});