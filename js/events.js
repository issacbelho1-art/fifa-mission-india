/* =====================================================
   FIFA MISSION INDIA
   EVENTS DIRECTORY PAGE
   FRONTEND-ONLY JAVASCRIPT

   Backend integration placeholders are included for
   Mr. Harsh to connect APIs later.
===================================================== */

(function () {

  "use strict";


  /* =====================================================
     EVENTS DATABASE
  ===================================================== */

  const eventsDatabase = [

    {
      id: "national-youth-selection-camp",
      title: "National Youth Selection Camp",
      category: "Football Trial",
      date: "2026-07-25",
      time: "9:00 AM",
      city: "New Delhi",
      venue: "National Football Centre",
      status: "Registration Open",
      registrationOpen: true,
      featured: true,
      ageGroup: "U-17",
      level: "National Event",
      image: "images/events/youth-selection-camp.jpg",
      description:
        "Open football trials for talented U-17 players looking to enter structured national development pathways."
    },

    {
      id: "grassroots-coaching-program",
      title: "Grassroots Coaching Development Program",
      category: "Coaching Workshop",
      date: "2026-08-08",
      time: "10:30 AM",
      city: "Bengaluru",
      venue: "Football Development Centre",
      status: "Closing Soon",
      registrationOpen: true,
      featured: false,
      ageGroup: "Coaches",
      level: "Certified Program",
      image: "images/events/coaching-program.jpg",
      description:
        "A professional coaching workshop focused on youth development, training methodology and grassroots football education."
    },

    {
      id: "mission-fifa-2034-meetup",
      title: "Mission FIFA 2034 National Meetup",
      category: "Community Event",
      date: "2026-09-18",
      time: "6:00 PM",
      city: "Mumbai",
      venue: "National Sports Auditorium",
      status: "Upcoming",
      registrationOpen: true,
      featured: false,
      ageGroup: "Open Entry",
      level: "Mission FIFA 2034",
      image: "images/events/mission-meetup.jpg",
      description:
        "Football supporters, volunteers, players, coaches and academies come together to strengthen India's football movement."
    },

    {
      id: "elite-academy-open-day",
      title: "Elite Academy Open Day",
      category: "Academy Event",
      date: "2026-08-22",
      time: "8:30 AM",
      city: "Mohali",
      venue: "Elite Football Academy Campus",
      status: "Registration Open",
      registrationOpen: true,
      featured: false,
      ageGroup: "U-8 to U-21",
      level: "Academy Program",
      image: "images/events/academy-open-day.jpg",
      description:
        "Players and parents can explore academy facilities, training programs, residential options and development pathways."
    },

    {
      id: "national-junior-football-cup",
      title: "National Junior Football Cup",
      category: "Tournament",
      date: "2026-10-03",
      time: "7:30 AM",
      city: "Kolkata",
      venue: "National Youth Stadium",
      status: "Upcoming",
      registrationOpen: true,
      featured: false,
      ageGroup: "U-15",
      level: "National Tournament",
      image: "images/events/junior-football-cup.jpg",
      description:
        "A competitive youth football tournament featuring academy and club teams from different regions of India."
    },

    {
      id: "goalkeeper-development-camp",
      title: "Goalkeeper Development Camp",
      category: "Academy Event",
      date: "2026-09-05",
      time: "9:30 AM",
      city: "Goa",
      venue: "Coastal Football Centre",
      status: "Registration Open",
      registrationOpen: true,
      featured: false,
      ageGroup: "U-13 to U-19",
      level: "Specialist Camp",
      image: "images/events/goalkeeper-camp.jpg",
      description:
        "Specialized goalkeeper coaching focused on positioning, distribution, decision-making and match preparation."
    },

    {
      id: "women-football-trial",
      title: "National Women's Football Trial",
      category: "Football Trial",
      date: "2026-09-12",
      time: "8:00 AM",
      city: "Pune",
      venue: "Western Football Training Centre",
      status: "Registration Open",
      registrationOpen: true,
      featured: false,
      ageGroup: "U-18",
      level: "Women's Development",
      image: "images/events/women-football-trial.jpg",
      description:
        "A national selection opportunity designed to identify and support talented young women footballers."
    },

    {
      id: "youth-coach-leadership-workshop",
      title: "Youth Coach Leadership Workshop",
      category: "Coaching Workshop",
      date: "2026-10-17",
      time: "10:00 AM",
      city: "Hyderabad",
      venue: "Sports Education Centre",
      status: "Upcoming",
      registrationOpen: true,
      featured: false,
      ageGroup: "Coaches",
      level: "Professional Development",
      image: "images/events/coach-leadership.jpg",
      description:
        "A leadership and player-management workshop for coaches working in youth and academy football."
    },

    {
      id: "northeast-grassroots-festival",
      title: "Northeast Grassroots Football Festival",
      category: "Community Event",
      date: "2026-11-07",
      time: "9:00 AM",
      city: "Guwahati",
      venue: "Regional Sports Complex",
      status: "Upcoming",
      registrationOpen: true,
      featured: false,
      ageGroup: "All Ages",
      level: "Regional Festival",
      image: "images/events/northeast-festival.jpg",
      description:
        "A celebration of grassroots football featuring youth activities, coaching sessions and community participation."
    },

    {
      id: "inter-academy-championship",
      title: "Inter-Academy Football Championship",
      category: "Tournament",
      date: "2026-11-21",
      time: "8:00 AM",
      city: "Chennai",
      venue: "Southern Football Arena",
      status: "Upcoming",
      registrationOpen: false,
      featured: false,
      ageGroup: "U-16",
      level: "Academy Competition",
      image: "images/events/inter-academy-championship.jpg",
      description:
        "Academies compete in a structured youth championship designed to provide meaningful competitive exposure."
    },

    {
      id: "football-volunteer-orientation",
      title: "Football Volunteer Orientation",
      category: "Community Event",
      date: "2026-08-29",
      time: "4:00 PM",
      city: "New Delhi",
      venue: "Mission FIFA Community Centre",
      status: "Registration Open",
      registrationOpen: true,
      featured: false,
      ageGroup: "18+",
      level: "Volunteer Program",
      image: "images/events/volunteer-orientation.jpg",
      description:
        "An orientation session for volunteers interested in supporting football events, campaigns and community programs."
    },

    {
      id: "talent-identification-seminar",
      title: "Football Talent Identification Seminar",
      category: "Coaching Workshop",
      date: "2026-12-05",
      time: "11:00 AM",
      city: "Mumbai",
      venue: "National Sports Auditorium",
      status: "Upcoming",
      registrationOpen: true,
      featured: false,
      ageGroup: "Coaches & Scouts",
      level: "Technical Seminar",
      image: "images/events/talent-identification.jpg",
      description:
        "A technical seminar covering scouting principles, player observation and long-term talent identification."
    }

  ];


  /* =====================================================
     STATE
  ===================================================== */

  const state = {

    selectedCategory: "all",

    selectedCity: "all",

    searchTerm: "",

    sortBy: "soonest",

    visibleCount: 6,

    increment: 3

  };


  /* =====================================================
     DOM REFERENCES
  ===================================================== */

  const elements = {

    loader: document.getElementById("eventsPageLoader"),

    navbar: document.getElementById("eventsNavbar"),

    menuToggle: document.getElementById("eventsMenuToggle"),

    mobileMenu: document.getElementById("eventsMobileMenu"),

    mobileOverlay: document.getElementById("eventsMobileOverlay"),

    mobileMenuClose: document.getElementById("eventsMobileMenuClose"),

    totalCount: document.getElementById("eventsTotalCount"),

    openCount: document.getElementById("eventsOpenCount"),

    cityCount: document.getElementById("eventsCityCount"),

    featuredCard: document.getElementById("eventsFeaturedCard"),

    searchInput: document.getElementById("eventsSearchInput"),

    clearSearchButton: document.getElementById("eventsClearSearch"),

    categoryFilters: document.getElementById("eventsCategoryFilters"),

    cityFilter: document.getElementById("eventsCityFilter"),

    sortSelect: document.getElementById("eventsSortSelect"),

    resultsText: document.getElementById("eventsResultsText"),

    resetButton: document.getElementById("eventsResetButton"),

    directoryGrid: document.getElementById("eventsDirectoryGrid"),

    emptyState: document.getElementById("eventsEmptyState"),

    emptyResetButton: document.getElementById("eventsEmptyResetButton"),

    loadMoreWrapper: document.getElementById("eventsLoadMoreWrapper"),

    loadMoreButton: document.getElementById("eventsLoadMoreButton"),

    newsletterForm: document.getElementById("eventsNewsletterForm"),

    newsletterEmail: document.getElementById("eventsNewsletterEmail"),

    toast: document.getElementById("eventsToast"),

    toastIcon: document.getElementById("eventsToastIcon"),

    toastMessage: document.getElementById("eventsToastMessage")

  };


  let toastTimer = null;


  /* =====================================================
     UTILITIES
  ===================================================== */

  function escapeHTML(value) {

    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");

  }


  function formatDate(dateString) {

    const date = new Date(`${dateString}T00:00:00`);

    return new Intl.DateTimeFormat(
      "en-IN",
      {
        day: "2-digit",
        month: "long",
        year: "numeric"
      }
    ).format(date);

  }


  function getDateParts(dateString) {

    const date = new Date(`${dateString}T00:00:00`);

    return {

      day: new Intl.DateTimeFormat(
        "en-IN",
        {
          day: "2-digit"
        }
      ).format(date),

      month: new Intl.DateTimeFormat(
        "en-IN",
        {
          month: "short"
        }
      ).format(date),

      full: formatDate(dateString)

    };

  }


  function getStatusClass(status) {

    const normalizedStatus = String(status).toLowerCase();

    if (normalizedStatus.includes("open")) {

      return "is-open";

    }

    if (normalizedStatus.includes("closing")) {

      return "is-closing";

    }

    if (normalizedStatus.includes("closed")) {

      return "is-closed";

    }

    return "is-upcoming";

  }


  function isValidEmail(email) {

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  }


  /* =====================================================
     TOAST
  ===================================================== */

  function showToast(
    message,
    type = "success"
  ) {

    if (
      !elements.toast ||
      !elements.toastMessage ||
      !elements.toastIcon
    ) {

      return;

    }

    window.clearTimeout(toastTimer);

    elements.toastMessage.textContent = message;

    if (type === "error") {

      elements.toastIcon.className =
        "fa-solid fa-circle-exclamation";

      elements.toastIcon.style.color = "#ff5d68";

    } else {

      elements.toastIcon.className =
        "fa-solid fa-circle-check";

      elements.toastIcon.style.color = "#39df8a";

    }

    elements.toast.hidden = false;

    toastTimer = window.setTimeout(
      function () {

        elements.toast.hidden = true;

      },
      3500
    );

  }


  /* =====================================================
     LOADER
  ===================================================== */

  function hideLoader() {

    if (!elements.loader) {

      return;

    }

    elements.loader.classList.add("is-hidden");

    window.setTimeout(
      function () {

        elements.loader.hidden = true;

      },
      400
    );

  }


  /* =====================================================
     STATISTICS
  ===================================================== */

  function renderStatistics() {

    const openEvents = eventsDatabase.filter(
      function (event) {

        return event.registrationOpen;

      }
    ).length;


    const cities = new Set(
      eventsDatabase.map(
        function (event) {

          return event.city;

        }
      )
    );


    if (elements.totalCount) {

      elements.totalCount.textContent =
        String(eventsDatabase.length);

    }


    if (elements.openCount) {

      elements.openCount.textContent =
        String(openEvents);

    }


    if (elements.cityCount) {

      elements.cityCount.textContent =
        String(cities.size);

    }

  }


  /* =====================================================
     FEATURED EVENT
  ===================================================== */

  function renderFeaturedEvent() {

    if (!elements.featuredCard) {

      return;

    }

    const featuredEvent =
      eventsDatabase.find(
        function (event) {

          return event.featured;

        }
      ) || eventsDatabase[0];


    if (!featuredEvent) {

      elements.featuredCard.innerHTML = "";

      return;

    }


    const dateParts =
      getDateParts(featuredEvent.date);


    elements.featuredCard.innerHTML = `

      <div class="events-featured-image">

        <img
          src="${escapeHTML(featuredEvent.image)}"
          alt="${escapeHTML(featuredEvent.title)}"
          loading="eager"
        >

        <div class="events-featured-image-overlay"></div>

        <span class="events-featured-status ${getStatusClass(featuredEvent.status)}">

          ${escapeHTML(featuredEvent.status)}

        </span>

        <div class="events-featured-date">

          <strong>
            ${escapeHTML(dateParts.day)}
          </strong>

          <span>
            ${escapeHTML(dateParts.month)}
          </span>

        </div>

      </div>


      <div class="events-featured-content">

        <div class="events-featured-tags">

          <span>
            ${escapeHTML(featuredEvent.category)}
          </span>

          <span>
            ${escapeHTML(featuredEvent.level)}
          </span>

          <span>
            ${escapeHTML(featuredEvent.ageGroup)}
          </span>

        </div>


        <h3>
          ${escapeHTML(featuredEvent.title)}
        </h3>


        <p>
          ${escapeHTML(featuredEvent.description)}
        </p>


        <div class="events-featured-information">

          <div>

            <i class="fa-regular fa-calendar"></i>

            <span>

              <small>
                Event Date
              </small>

              ${escapeHTML(dateParts.full)}

            </span>

          </div>


          <div>

            <i class="fa-regular fa-clock"></i>

            <span>

              <small>
                Starting Time
              </small>

              ${escapeHTML(featuredEvent.time)}

            </span>

          </div>


          <div>

            <i class="fa-solid fa-location-dot"></i>

            <span>

              <small>
                Location
              </small>

              ${escapeHTML(featuredEvent.city)}

            </span>

          </div>


          <div>

            <i class="fa-solid fa-building"></i>

            <span>

              <small>
                Venue
              </small>

              ${escapeHTML(featuredEvent.venue)}

            </span>

          </div>

        </div>


        <div class="events-featured-actions">

          <a
            href="event-details.html?event=${encodeURIComponent(featuredEvent.id)}"
            class="events-featured-secondary"
          >

            View Event Details

          </a>


          <a
            href="event-register.html?event=${encodeURIComponent(featuredEvent.id)}"
            class="events-featured-primary"
          >

            Register Now

            <i class="fa-solid fa-arrow-right"></i>

          </a>

        </div>

      </div>

    `;

  }


  /* =====================================================
     CITY FILTER
  ===================================================== */

  function populateCityFilter() {

    if (!elements.cityFilter) {

      return;

    }

    const cities = Array.from(
      new Set(
        eventsDatabase.map(
          function (event) {

            return event.city;

          }
        )
      )
    ).sort(
      function (firstCity, secondCity) {

        return firstCity.localeCompare(secondCity);

      }
    );


    elements.cityFilter.innerHTML = `

      <option value="all">
        All Cities
      </option>

      ${cities.map(
        function (city) {

          return `

            <option value="${escapeHTML(city)}">
              ${escapeHTML(city)}
            </option>

          `;

        }
      ).join("")}

    `;

  }


  /* =====================================================
     FILTERING AND SORTING
  ===================================================== */

  function getFilteredEvents() {

    const normalizedSearch =
      state.searchTerm.trim().toLowerCase();


    let filteredEvents =
      eventsDatabase.filter(
        function (event) {

          const categoryMatches =
            state.selectedCategory === "all" ||
            event.category === state.selectedCategory;


          const cityMatches =
            state.selectedCity === "all" ||
            event.city === state.selectedCity;


          const searchableContent = [

            event.title,

            event.category,

            event.city,

            event.venue,

            event.status,

            event.ageGroup,

            event.level,

            event.description

          ]
            .join(" ")
            .toLowerCase();


          const searchMatches =
            !normalizedSearch ||
            searchableContent.includes(normalizedSearch);


          return (
            categoryMatches &&
            cityMatches &&
            searchMatches
          );

        }
      );


    filteredEvents.sort(
      function (firstEvent, secondEvent) {

        if (state.sortBy === "latest") {

          return (
            new Date(secondEvent.date) -
            new Date(firstEvent.date)
          );

        }


        if (state.sortBy === "title") {

          return firstEvent.title.localeCompare(
            secondEvent.title
          );

        }


        return (
          new Date(firstEvent.date) -
          new Date(secondEvent.date)
        );

      }
    );


    return filteredEvents;

  }


  /* =====================================================
     EVENT CARD
  ===================================================== */

  function createEventCard(event) {

    const dateParts =
      getDateParts(event.date);


    const registerText =
      event.registrationOpen
        ? "Register Now"
        : "View Details";


    const registerHref =
      event.registrationOpen
        ? `event-register.html?event=${encodeURIComponent(event.id)}`
        : `event-details.html?event=${encodeURIComponent(event.id)}`;


    return `

      <article class="events-directory-card">

        <div class="events-directory-image">

          <img
            src="${escapeHTML(event.image)}"
            alt="${escapeHTML(event.title)}"
            loading="lazy"
          >

          <div class="events-directory-date">

            <strong>
              ${escapeHTML(dateParts.day)}
            </strong>

            <span>
              ${escapeHTML(dateParts.month)}
            </span>

          </div>


          <span class="events-directory-status ${getStatusClass(event.status)}">

            ${escapeHTML(event.status)}

          </span>


          <span class="events-directory-category">

            ${escapeHTML(event.category)}

          </span>

        </div>


        <div class="events-directory-content">

          <h3>
            ${escapeHTML(event.title)}
          </h3>


          <p>
            ${escapeHTML(event.description)}
          </p>


          <div class="events-directory-info">

            <div>

              <i class="fa-solid fa-location-dot"></i>

              <span>

                <small>
                  Location
                </small>

                ${escapeHTML(event.city)}

              </span>

            </div>


            <div>

              <i class="fa-regular fa-clock"></i>

              <span>

                <small>
                  Starting Time
                </small>

                ${escapeHTML(event.time)}

              </span>

            </div>

          </div>


          <div class="events-directory-actions">

            <a
              href="event-details.html?event=${encodeURIComponent(event.id)}"
              class="events-directory-details"
            >

              View Details

            </a>


            <a
              href="${registerHref}"
              class="events-directory-register"
            >

              ${registerText}

            </a>

          </div>

        </div>

      </article>

    `;

  }


  /* =====================================================
     RESULTS TEXT
  ===================================================== */

  function updateResultsText(
    visibleEvents,
    totalFilteredEvents
  ) {

    if (!elements.resultsText) {

      return;

    }

    if (totalFilteredEvents === 0) {

      elements.resultsText.textContent =
        "No football events found";

      return;

    }


    const visibleAmount =
      Math.min(
        visibleEvents,
        totalFilteredEvents
      );


    elements.resultsText.textContent =
      `Showing ${visibleAmount} of ${totalFilteredEvents} football events`;

  }


  /* =====================================================
     RESET BUTTON VISIBILITY
  ===================================================== */

  function updateResetButtonVisibility() {

    if (!elements.resetButton) {

      return;

    }

    const filtersAreActive =

      state.selectedCategory !== "all" ||

      state.selectedCity !== "all" ||

      state.searchTerm !== "" ||

      state.sortBy !== "soonest";


    elements.resetButton.hidden =
      !filtersAreActive;

  }


  /* =====================================================
     RENDER DIRECTORY
  ===================================================== */

  function renderEventsDirectory() {

    if (!elements.directoryGrid) {

      return;

    }


    const filteredEvents =
      getFilteredEvents();


    const visibleEvents =
      filteredEvents.slice(
        0,
        state.visibleCount
      );


    elements.directoryGrid.innerHTML =
      visibleEvents
        .map(createEventCard)
        .join("");


    if (elements.emptyState) {

      elements.emptyState.hidden =
        filteredEvents.length !== 0;

    }


    if (elements.loadMoreWrapper) {

      elements.loadMoreWrapper.hidden =
        filteredEvents.length === 0 ||
        state.visibleCount >= filteredEvents.length;

    }


    updateResultsText(
      visibleEvents.length,
      filteredEvents.length
    );


    updateResetButtonVisibility();

  }


  /* =====================================================
     RESET FILTERS
  ===================================================== */

  function resetFilters() {

    state.selectedCategory = "all";

    state.selectedCity = "all";

    state.searchTerm = "";

    state.sortBy = "soonest";

    state.visibleCount = 6;


    if (elements.searchInput) {

      elements.searchInput.value = "";

    }


    if (elements.clearSearchButton) {

      elements.clearSearchButton.hidden = true;

    }


    if (elements.cityFilter) {

      elements.cityFilter.value = "all";

    }


    if (elements.sortSelect) {

      elements.sortSelect.value = "soonest";

    }


    document
      .querySelectorAll(".events-filter-button")
      .forEach(
        function (button) {

          button.classList.toggle(
            "active",
            button.dataset.category === "all"
          );

        }
      );


    renderEventsDirectory();

  }


  /* =====================================================
     CATEGORY SELECTION
  ===================================================== */

  function selectCategory(category) {

    state.selectedCategory = category;

    state.visibleCount = 6;


    document
      .querySelectorAll(".events-filter-button")
      .forEach(
        function (button) {

          button.classList.toggle(
            "active",
            button.dataset.category === category
          );

        }
      );


    renderEventsDirectory();


    const exploreSection =
      document.getElementById("exploreEvents");


    if (exploreSection) {

      exploreSection.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });

    }

  }


  /* =====================================================
     MOBILE MENU
  ===================================================== */

  function openMobileMenu() {

    if (
      !elements.mobileMenu ||
      !elements.mobileOverlay
    ) {

      return;

    }

    elements.mobileMenu.hidden = false;

    elements.mobileOverlay.hidden = false;

    document.body.classList.add(
      "events-menu-open"
    );


    if (elements.menuToggle) {

      elements.menuToggle.setAttribute(
        "aria-expanded",
        "true"
      );

    }

  }


  function closeMobileMenu() {

    if (
      !elements.mobileMenu ||
      !elements.mobileOverlay
    ) {

      return;

    }

    elements.mobileMenu.hidden = true;

    elements.mobileOverlay.hidden = true;

    document.body.classList.remove(
      "events-menu-open"
    );


    if (elements.menuToggle) {

      elements.menuToggle.setAttribute(
        "aria-expanded",
        "false"
      );

    }

  }


  /* =====================================================
     NEWSLETTER
  ===================================================== */

  function handleNewsletterSubmit(event) {

    event.preventDefault();


    if (!elements.newsletterEmail) {

      return;

    }


    const email =
      elements.newsletterEmail.value.trim();


    if (!email) {

      showToast(
        "Please enter your email address.",
        "error"
      );

      elements.newsletterEmail.focus();

      return;

    }


    if (!isValidEmail(email)) {

      showToast(
        "Please enter a valid email address.",
        "error"
      );

      elements.newsletterEmail.focus();

      return;

    }


    /*
      BACKEND INTEGRATION PLACEHOLDER FOR MR. HARSH

      Suggested endpoint:

      POST /api/v1/newsletter/subscribe

      Example payload:

      {
        email: email,
        source: "events-page"
      }
    */


    showToast(
      "You have subscribed to football event updates."
    );


    elements.newsletterForm.reset();

  }


  /* =====================================================
     EVENT LISTENERS
  ===================================================== */

  function attachEventListeners() {

    if (elements.menuToggle) {

      elements.menuToggle.addEventListener(
        "click",
        openMobileMenu
      );

    }


    if (elements.mobileMenuClose) {

      elements.mobileMenuClose.addEventListener(
        "click",
        closeMobileMenu
      );

    }


    if (elements.mobileOverlay) {

      elements.mobileOverlay.addEventListener(
        "click",
        closeMobileMenu
      );

    }


    if (elements.mobileMenu) {

      elements.mobileMenu
        .querySelectorAll("a")
        .forEach(
          function (link) {

            link.addEventListener(
              "click",
              closeMobileMenu
            );

          }
        );

    }


    document.addEventListener(
      "keydown",
      function (event) {

        if (event.key === "Escape") {

          closeMobileMenu();

        }

      }
    );


    window.addEventListener(
      "scroll",
      function () {

        if (!elements.navbar) {

          return;

        }

        elements.navbar.classList.toggle(
          "scrolled",
          window.scrollY > 30
        );

      },
      {
        passive: true
      }
    );


    if (elements.searchInput) {

      elements.searchInput.addEventListener(
        "input",
        function (event) {

          state.searchTerm =
            event.target.value.trim();

          state.visibleCount = 6;


          if (elements.clearSearchButton) {

            elements.clearSearchButton.hidden =
              state.searchTerm.length === 0;

          }


          renderEventsDirectory();

        }
      );

    }


    if (elements.clearSearchButton) {

      elements.clearSearchButton.addEventListener(
        "click",
        function () {

          state.searchTerm = "";

          state.visibleCount = 6;


          if (elements.searchInput) {

            elements.searchInput.value = "";

            elements.searchInput.focus();

          }


          elements.clearSearchButton.hidden = true;

          renderEventsDirectory();

        }
      );

    }


    if (elements.categoryFilters) {

      elements.categoryFilters.addEventListener(
        "click",
        function (event) {

          const button =
            event.target.closest(
              ".events-filter-button"
            );


          if (!button) {

            return;

          }


          selectCategory(
            button.dataset.category || "all"
          );

        }
      );

    }


    document
      .querySelectorAll(
        ".events-category-card[data-category-target]"
      )
      .forEach(
        function (card) {

          card.addEventListener(
            "click",
            function () {

              selectCategory(
                card.dataset.categoryTarget
              );

            }
          );

        }
      );


    if (elements.cityFilter) {

      elements.cityFilter.addEventListener(
        "change",
        function (event) {

          state.selectedCity =
            event.target.value;

          state.visibleCount = 6;

          renderEventsDirectory();

        }
      );

    }


    if (elements.sortSelect) {

      elements.sortSelect.addEventListener(
        "change",
        function (event) {

          state.sortBy =
            event.target.value;

          state.visibleCount = 6;

          renderEventsDirectory();

        }
      );

    }


    if (elements.resetButton) {

      elements.resetButton.addEventListener(
        "click",
        resetFilters
      );

    }


    if (elements.emptyResetButton) {

      elements.emptyResetButton.addEventListener(
        "click",
        resetFilters
      );

    }


    if (elements.loadMoreButton) {

      elements.loadMoreButton.addEventListener(
        "click",
        function () {

          state.visibleCount += state.increment;

          renderEventsDirectory();

        }
      );

    }


    if (elements.newsletterForm) {

      elements.newsletterForm.addEventListener(
        "submit",
        handleNewsletterSubmit
      );

    }


    window.addEventListener(
      "resize",
      function () {

        if (window.innerWidth > 1100) {

          closeMobileMenu();

        }

      }
    );

  }


  /* =====================================================
     IMAGE FALLBACK
  ===================================================== */

  function activateImageFallbacks() {

    document.addEventListener(
      "error",
      function (event) {

        const image = event.target;


        if (
          !(image instanceof HTMLImageElement) ||
          image.dataset.fallbackApplied === "true"
        ) {

          return;

        }


        image.dataset.fallbackApplied = "true";

        image.src =
          "images/events/event-placeholder.jpg";

      },
      true
    );

  }


  /* =====================================================
     INITIALIZATION
  ===================================================== */

  function initializeEventsPage() {

    try {

      activateImageFallbacks();

      renderStatistics();

      renderFeaturedEvent();

      populateCityFilter();

      renderEventsDirectory();

      attachEventListeners();

    } catch (error) {

      console.error(
        "Events page initialization failed:",
        error
      );

      showToast(
        "Some event features could not be loaded.",
        "error"
      );

    } finally {

      window.setTimeout(
        hideLoader,
        450
      );

    }

  }


  /* =====================================================
     SAFE START
  ===================================================== */

  if (document.readyState === "loading") {

    document.addEventListener(
      "DOMContentLoaded",
      initializeEventsPage,
      {
        once: true
      }
    );

  } else {

    initializeEventsPage();

  }


  /*
    Loader safety fallback.

    Even if an unexpected error occurs before normal
    initialization finishes, the page loader will disappear.
  */

  window.addEventListener(
    "load",
    function () {

      window.setTimeout(
        hideLoader,
        1200
      );

    },
    {
      once: true
    }
  );

})();