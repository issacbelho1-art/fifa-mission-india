/* =====================================================
   FIFA MISSION INDIA
   PLAYERS PAGE
   players.js
   PART 1
   ===================================================== */


/* =====================================================
   GLOBAL ELEMENTS
===================================================== */

const playersNavbar =
    document.getElementById("playersNavbar");

const playersMenuButton =
    document.getElementById("playersMenuButton");

const playersNavigation =
    document.getElementById("playersNavigation");

const playersGrid =
    document.getElementById("playersGrid");

const playersCards =
    Array.from(
        document.querySelectorAll(".player-directory-card")
    );

const playersCounterElements =
    document.querySelectorAll(".players-counter");

const backToTopButton =
    document.getElementById("playersBackToTop");


/* =====================================================
   MOBILE MENU
===================================================== */

if (
    playersMenuButton &&
    playersNavigation
) {

    playersMenuButton.addEventListener(

        "click",

        function () {

            const isOpen =
                playersNavigation.classList.toggle("active");

            playersMenuButton.classList.toggle(
                "active",
                isOpen
            );

            document.body.classList.toggle(
                "players-menu-open",
                isOpen
            );

            playersMenuButton.setAttribute(
                "aria-expanded",
                String(isOpen)
            );

        }

    );

}


/* =====================================================
   CLOSE MENU WHEN CLICKING LINKS
===================================================== */

if (playersNavigation) {

    playersNavigation
        .querySelectorAll("a")
        .forEach(function (link) {

            link.addEventListener(

                "click",

                function () {

                    playersNavigation.classList.remove(
                        "active"
                    );

                    playersMenuButton?.classList.remove(
                        "active"
                    );

                    document.body.classList.remove(
                        "players-menu-open"
                    );

                    playersMenuButton?.setAttribute(
                        "aria-expanded",
                        "false"
                    );

                }

            );

        });

}


/* =====================================================
   STICKY NAVBAR
===================================================== */

if (playersNavbar) {

    window.addEventListener(

        "scroll",

        function () {

            playersNavbar.classList.toggle(

                "scrolled",

                window.scrollY > 40

            );

        }

    );

}


/* =====================================================
   HERO COUNTERS
===================================================== */

function animateCounter(counter) {

    const target =
        Number(counter.dataset.target);

    if (!Number.isFinite(target)) return;

    let current = 0;

    const increment =
        Math.max(
            1,
            Math.ceil(target / 55)
        );

    const timer =
        window.setInterval(

            function () {

                current += increment;

                if (current >= target) {

                    current = target;

                    clearInterval(timer);

                }

                counter.textContent =
                    current.toLocaleString("en-IN");

            },

            30

        );

}


/* =====================================================
   COUNTER OBSERVER
===================================================== */

if (
    "IntersectionObserver" in window &&
    playersCounterElements.length
) {

    const counterObserver =
        new IntersectionObserver(

            function (entries) {

                entries.forEach(function (entry) {

                    if (!entry.isIntersecting)
                        return;

                    animateCounter(entry.target);

                    counterObserver.unobserve(
                        entry.target
                    );

                });

            },

            {
                threshold:0.45
            }

        );

    playersCounterElements.forEach(

        function (counter) {

            counterObserver.observe(counter);

        }

    );

}


/* =====================================================
   REVEAL ANIMATIONS
===================================================== */

const revealItems =
    document.querySelectorAll(".reveal");

if (
    "IntersectionObserver" in window &&
    revealItems.length
) {

    const revealObserver =
        new IntersectionObserver(

            function (entries) {

                entries.forEach(function (entry) {

                    if (!entry.isIntersecting)
                        return;

                    entry.target.classList.add(
                        "visible"
                    );

                    revealObserver.unobserve(
                        entry.target
                    );

                });

            },

            {
                threshold:0.15
            }

        );

    revealItems.forEach(function (item) {

        revealObserver.observe(item);

    });

}
else{

    revealItems.forEach(function(item){

        item.classList.add("visible");

    });

}


/* =====================================================
   BACK TO TOP BUTTON
===================================================== */

if (backToTopButton) {

    window.addEventListener(

        "scroll",

        function () {

            backToTopButton.hidden =
                window.scrollY < 500;

        }

    );

    backToTopButton.addEventListener(

        "click",

        function () {

            window.scrollTo({

                top:0,

                behavior:"smooth"

            });

        }

    );

}


/* =====================================================
   CURRENT YEAR
===================================================== */

const currentYear =
    document.getElementById(
        "playersCurrentYear"
    );

if (currentYear) {

    currentYear.textContent =
        new Date().getFullYear();

}


/* =====================================================
   PART 2 CONTINUES BELOW
===================================================== */

/* =====================================================
   SEARCH AND FILTER ELEMENTS
===================================================== */

const playerSearch =
    document.getElementById("playerSearch");

const clearSearchButton =
    document.getElementById("clearSearchButton");

const positionFilter =
    document.getElementById("positionFilter");

const stateFilter =
    document.getElementById("stateFilter");

const academyFilter =
    document.getElementById("academyFilter");

const ageFilter =
    document.getElementById("ageFilter");

const sortPlayers =
    document.getElementById("sortPlayers");

const resetFiltersButton =
    document.getElementById("resetFiltersButton");

const emptyStateResetButton =
    document.getElementById("emptyStateResetButton");

const playersEmptyState =
    document.getElementById("playersEmptyState");

const playersResultText =
    document.getElementById("playersResultText");

const activeFilters =
    document.getElementById("activeFilters");

const playersFilterToggle =
    document.getElementById("playersFilterToggle");

const playersFilters =
    document.getElementById("playersFilters");


/* =====================================================
   FILTER STATE
===================================================== */

const playersFilterState = {

    search: "",

    position: "all",

    state: "all",

    academy: "all",

    ageGroup: "all",

    sort: "featured"

};


/* =====================================================
   MOBILE FILTER TOGGLE
===================================================== */

if (
    playersFilterToggle &&
    playersFilters
) {

    playersFilterToggle.addEventListener(

        "click",

        function () {

            const isOpen =
                playersFilters.classList.toggle("active");

            playersFilterToggle.setAttribute(
                "aria-expanded",
                String(isOpen)
            );

        }

    );

}


/* =====================================================
   NORMALIZE TEXT
===================================================== */

function normalizePlayerText(value) {

    return String(value || "")
        .trim()
        .toLowerCase();

}


/* =====================================================
   CHECK PLAYER AGAINST FILTERS
===================================================== */

function playerMatchesFilters(card) {

    const searchableText = normalizePlayerText([

        card.dataset.name,

        card.dataset.position,

        card.dataset.state,

        card.dataset.academy,

        card.dataset.academyName

    ].join(" "));


    const searchMatches =

        !playersFilterState.search ||

        searchableText.includes(
            normalizePlayerText(
                playersFilterState.search
            )
        );


    const positionMatches =

        playersFilterState.position === "all" ||

        card.dataset.position ===
            playersFilterState.position;


    const stateMatches =

        playersFilterState.state === "all" ||

        card.dataset.state ===
            playersFilterState.state;


    const academyMatches =

        playersFilterState.academy === "all" ||

        card.dataset.academy ===
            playersFilterState.academy;


    const ageMatches =

        playersFilterState.ageGroup === "all" ||

        card.dataset.ageGroup ===
            playersFilterState.ageGroup;


    return (

        searchMatches &&
        positionMatches &&
        stateMatches &&
        academyMatches &&
        ageMatches

    );

}


/* =====================================================
   SORT PLAYER CARDS
===================================================== */

function sortPlayerCards(cards) {

    return [...cards].sort(

        function (firstCard, secondCard) {

            const firstName =
                firstCard.dataset.name || "";

            const secondName =
                secondCard.dataset.name || "";

            const firstRating =
                Number(firstCard.dataset.rating) || 0;

            const secondRating =
                Number(secondCard.dataset.rating) || 0;

            const firstGoals =
                Number(firstCard.dataset.goals) || 0;

            const secondGoals =
                Number(secondCard.dataset.goals) || 0;

            const firstAge =
                Number(firstCard.dataset.age) || 0;

            const secondAge =
                Number(secondCard.dataset.age) || 0;

            const firstFeatured =
                firstCard.dataset.featured === "true"
                    ? 1
                    : 0;

            const secondFeatured =
                secondCard.dataset.featured === "true"
                    ? 1
                    : 0;


            switch (playersFilterState.sort) {

                case "name-asc":

                    return firstName.localeCompare(
                        secondName
                    );


                case "rating-desc":

                    return secondRating - firstRating;


                case "goals-desc":

                    return secondGoals - firstGoals;


                case "youngest":

                    return firstAge - secondAge;


                case "featured":

                default:

                    if (
                        secondFeatured !==
                        firstFeatured
                    ) {

                        return (
                            secondFeatured -
                            firstFeatured
                        );

                    }

                    return secondRating - firstRating;

            }

        }

    );

}


/* =====================================================
   UPDATE RESULT TEXT
===================================================== */

function updatePlayersResultText(count) {

    if (!playersResultText) return;

    if (count === 0) {

        playersResultText.textContent =
            "No player profiles match your search.";

        return;

    }

    if (count === 1) {

        playersResultText.textContent =
            "Showing 1 player profile.";

        return;

    }

    playersResultText.textContent =
        "Showing " +
        count +
        " player profiles.";

}


/* =====================================================
   APPLY SEARCH, FILTERS AND SORTING
===================================================== */

function applyPlayerFilters() {

    if (!playersGrid) return;

    const matchingCards =
        playersCards.filter(
            playerMatchesFilters
        );

    const sortedCards =
        sortPlayerCards(matchingCards);


    playersCards.forEach(function (card) {

        card.hidden = true;

    });


    sortedCards.forEach(function (card) {

        card.hidden = false;

        playersGrid.appendChild(card);

        card.classList.add("visible");

    });


    if (playersEmptyState) {

        playersEmptyState.hidden =
            sortedCards.length !== 0;

    }


    updatePlayersResultText(
        sortedCards.length
    );

    updateActiveFilterChips();

    updateClearSearchButton();

}


/* =====================================================
   SEARCH INPUT
===================================================== */

if (playerSearch) {

    playerSearch.addEventListener(

        "input",

        function () {

            playersFilterState.search =
                playerSearch.value.trim();

            applyPlayerFilters();

        }

    );

}


/* =====================================================
   CLEAR SEARCH BUTTON
===================================================== */

function updateClearSearchButton() {

    if (!clearSearchButton) return;

    clearSearchButton.hidden =
        !playersFilterState.search;

}


if (
    clearSearchButton &&
    playerSearch
) {

    clearSearchButton.addEventListener(

        "click",

        function () {

            playerSearch.value = "";

            playersFilterState.search = "";

            playerSearch.focus();

            applyPlayerFilters();

        }

    );

}


/* =====================================================
   SELECT FILTER EVENTS
===================================================== */

if (positionFilter) {

    positionFilter.addEventListener(

        "change",

        function () {

            playersFilterState.position =
                positionFilter.value;

            applyPlayerFilters();

        }

    );

}


if (stateFilter) {

    stateFilter.addEventListener(

        "change",

        function () {

            playersFilterState.state =
                stateFilter.value;

            applyPlayerFilters();

        }

    );

}


if (academyFilter) {

    academyFilter.addEventListener(

        "change",

        function () {

            playersFilterState.academy =
                academyFilter.value;

            applyPlayerFilters();

        }

    );

}


if (ageFilter) {

    ageFilter.addEventListener(

        "change",

        function () {

            playersFilterState.ageGroup =
                ageFilter.value;

            applyPlayerFilters();

        }

    );

}


if (sortPlayers) {

    sortPlayers.addEventListener(

        "change",

        function () {

            playersFilterState.sort =
                sortPlayers.value;

            applyPlayerFilters();

        }

    );

}


/* =====================================================
   RESET ALL FILTERS
===================================================== */

function resetAllPlayerFilters() {

    playersFilterState.search = "";

    playersFilterState.position = "all";

    playersFilterState.state = "all";

    playersFilterState.academy = "all";

    playersFilterState.ageGroup = "all";

    playersFilterState.sort = "featured";


    if (playerSearch) {

        playerSearch.value = "";

    }

    if (positionFilter) {

        positionFilter.value = "all";

    }

    if (stateFilter) {

        stateFilter.value = "all";

    }

    if (academyFilter) {

        academyFilter.value = "all";

    }

    if (ageFilter) {

        ageFilter.value = "all";

    }

    if (sortPlayers) {

        sortPlayers.value = "featured";

    }


    applyPlayerFilters();

}


resetFiltersButton?.addEventListener(

    "click",

    resetAllPlayerFilters

);


emptyStateResetButton?.addEventListener(

    "click",

    resetAllPlayerFilters

);


/* =====================================================
   PART 3 CONTINUES BELOW
===================================================== */

/* =====================================================
   ACTIVE FILTER CHIPS
===================================================== */

function createFilterChip(label, value) {

    const chip =
        document.createElement("span");

    chip.dataset.value = value;

    chip.innerHTML =
        `
        ${label}
        <button
            type="button"
            aria-label="Remove filter"
        >
            ✕
        </button>
        `;

    chip.querySelector("button")
        .addEventListener(

            "click",

            function () {

                switch (value) {

                    case "search":

                        playersFilterState.search = "";

                        if (playerSearch) {

                            playerSearch.value = "";

                        }

                        break;

                    case "position":

                        playersFilterState.position = "all";

                        if (positionFilter) {

                            positionFilter.value = "all";

                        }

                        break;

                    case "state":

                        playersFilterState.state = "all";

                        if (stateFilter) {

                            stateFilter.value = "all";

                        }

                        break;

                    case "academy":

                        playersFilterState.academy = "all";

                        if (academyFilter) {

                            academyFilter.value = "all";

                        }

                        break;

                    case "age":

                        playersFilterState.ageGroup = "all";

                        if (ageFilter) {

                            ageFilter.value = "all";

                        }

                        break;

                }

                applyPlayerFilters();

            }

        );

    return chip;

}


/* =====================================================
   UPDATE ACTIVE FILTER CHIPS
===================================================== */

function updateActiveFilterChips() {

    if (!activeFilters) return;

    activeFilters.innerHTML = "";

    const chips = [];

    if (playersFilterState.search) {

        chips.push(

            createFilterChip(

                "Search: " +
                playersFilterState.search,

                "search"

            )

        );

    }

    if (
        playersFilterState.position !==
        "all"
    ) {

        chips.push(

            createFilterChip(

                "Position: " +
                positionFilter.options[
                    positionFilter.selectedIndex
                ].text,

                "position"

            )

        );

    }

    if (
        playersFilterState.state !==
        "all"
    ) {

        chips.push(

            createFilterChip(

                "State: " +
                stateFilter.options[
                    stateFilter.selectedIndex
                ].text,

                "state"

            )

        );

    }

    if (
        playersFilterState.academy !==
        "all"
    ) {

        chips.push(

            createFilterChip(

                "Academy: " +
                academyFilter.options[
                    academyFilter.selectedIndex
                ].text,

                "academy"

            )

        );

    }

    if (
        playersFilterState.ageGroup !==
        "all"
    ) {

        chips.push(

            createFilterChip(

                "Age: " +
                ageFilter.options[
                    ageFilter.selectedIndex
                ].text,

                "age"

            )

        );

    }

    chips.forEach(function (chip) {

        activeFilters.appendChild(chip);

    });

    activeFilters.hidden =
        chips.length === 0;

}


/* =====================================================
   LOAD MORE PLAYERS
===================================================== */

const loadMorePlayersButton =
    document.getElementById(
        "loadMorePlayersButton"
    );

let visiblePlayerLimit = 6;

function updateVisiblePlayers() {

    const visibleCards =
        playersCards.filter(
            card => !card.hidden
        );

    visibleCards.forEach(function (
        card,
        index
    ) {

        card.style.display =
            index < visiblePlayerLimit
                ? ""
                : "none";

    });

    if (
        loadMorePlayersButton
    ) {

        loadMorePlayersButton.hidden =
            visibleCards.length <=
            visiblePlayerLimit;

    }

}


if (loadMorePlayersButton) {

    loadMorePlayersButton.addEventListener(

        "click",

        function () {

            visiblePlayerLimit += 6;

            updateVisiblePlayers();

        }

    );

}


/* =====================================================
   PATCH FILTER FUNCTION
===================================================== */

const originalApplyPlayerFilters =
    applyPlayerFilters;

applyPlayerFilters =
    function () {

        originalApplyPlayerFilters();

        visiblePlayerLimit = 6;

        updateVisiblePlayers();

    };


/* =====================================================
   INITIALIZE
===================================================== */

document.addEventListener(

    "DOMContentLoaded",

    function () {

        applyPlayerFilters();

    }

);


/* =====================================================
   BACKEND PLACEHOLDER
===================================================== */

/*

Future Backend Integration
--------------------------

GET
/api/v1/players

POST
/api/v1/player/favorite

DELETE
/api/v1/player/favorite/{id}

GET
/api/v1/player/{id}

Mr. Harsh can replace the static
HTML cards by dynamically rendering
API responses into #playersGrid.

*/


/* =====================================================
   END OF PART 3
===================================================== */

/* =====================================================
   FAVORITE PLAYERS
   PART 4
===================================================== */

const playersNotification =
    document.getElementById(
        "playersNotification"
    );

const savePlayerButtons =
    document.querySelectorAll(
        ".player-save-button"
    );

const PLAYER_FAVORITES_KEY =
    "fifaMissionIndiaFavoritePlayers";

let favoritePlayers =
    loadFavoritePlayers();


/* =====================================================
   LOAD FAVORITES
===================================================== */

function loadFavoritePlayers() {

    try {

        const savedPlayers =
            localStorage.getItem(
                PLAYER_FAVORITES_KEY
            );

        if (!savedPlayers) {

            return [];

        }

        return JSON.parse(savedPlayers);

    }

    catch (error) {

        console.error(error);

        return [];

    }

}


/* =====================================================
   SAVE FAVORITES
===================================================== */

function saveFavoritePlayers() {

    localStorage.setItem(

        PLAYER_FAVORITES_KEY,

        JSON.stringify(
            favoritePlayers
        )

    );

}


/* =====================================================
   NOTIFICATION
===================================================== */

function showPlayersNotification(

    message,

    type = "success"

) {

    if (!playersNotification)
        return;

    playersNotification.textContent =
        message;

    playersNotification.className =
        "players-notification show " +
        type;

    clearTimeout(
        playersNotification.timer
    );

    playersNotification.timer =
        window.setTimeout(

            function () {

                playersNotification.classList.remove(
                    "show"
                );

            },

            3000

        );

}


/* =====================================================
   UPDATE BUTTON
===================================================== */

function updateFavoriteButton(

    button,

    isFavorite

) {

    button.classList.toggle(

        "saved",

        isFavorite

    );

    button.setAttribute(

        "aria-pressed",

        String(isFavorite)

    );

    button.textContent =
        isFavorite
            ? "♥"
            : "♡";

}


/* =====================================================
   TOGGLE FAVORITE
===================================================== */

function toggleFavoritePlayer(

    playerId,

    button

) {

    const existingIndex =
        favoritePlayers.indexOf(
            playerId
        );

    if (existingIndex === -1) {

        favoritePlayers.push(
            playerId
        );

        updateFavoriteButton(
            button,
            true
        );

        showPlayersNotification(

            "Player added to favorites."

        );

    }

    else {

        favoritePlayers.splice(

            existingIndex,

            1

        );

        updateFavoriteButton(
            button,
            false
        );

        showPlayersNotification(

            "Player removed from favorites.",

            "error"

        );

    }

    saveFavoritePlayers();

}


/* =====================================================
   INITIALIZE FAVORITES
===================================================== */

savePlayerButtons.forEach(

    function (button) {

        const playerId =
            button.dataset.savePlayer;

        const alreadySaved =
            favoritePlayers.includes(
                playerId
            );

        updateFavoriteButton(

            button,

            alreadySaved

        );

        button.addEventListener(

            "click",

            function () {

                toggleFavoritePlayer(

                    playerId,

                    button

                );

            }

        );

    }

);


/* =====================================================
   BACKEND PLACEHOLDER

   Mr. Harsh

   POST
   /api/v1/player/favorites

   DELETE
   /api/v1/player/favorites/{id}

   GET
   /api/v1/player/favorites

===================================================== */


/* =====================================================
   END PART 4
===================================================== */
/* =====================================================
   FIFA MISSION INDIA
   PLAYERS PAGE
   players.js
   PART 5 (FINAL)
===================================================== */


/* =====================================================
   LOADING STATE
===================================================== */

function showPlayersLoading() {

    if (!playersGrid) return;

    playersGrid.classList.add("loading");

}

function hidePlayersLoading() {

    if (!playersGrid) return;

    playersGrid.classList.remove("loading");

}


/* =====================================================
   KEYBOARD SHORTCUTS
===================================================== */

document.addEventListener(

    "keydown",

    function (event) {

        if (

            event.key === "/" &&

            playerSearch &&

            document.activeElement !== playerSearch

        ) {

            event.preventDefault();

            playerSearch.focus();

        }

        if (

            event.key === "Escape"

        ) {

            if (

                playersNavigation &&
                playersNavigation.classList.contains("active")

            ) {

                playersNavigation.classList.remove("active");

                playersMenuButton?.classList.remove("active");

                document.body.classList.remove(
                    "players-menu-open"
                );

                playersMenuButton?.setAttribute(
                    "aria-expanded",
                    "false"
                );

            }

        }

    }

);


/* =====================================================
   IMAGE LAZY ENHANCEMENT
===================================================== */

document
    .querySelectorAll(".player-card-image img")
    .forEach(function (image) {

        image.loading = "lazy";

        image.decoding = "async";

    });


/* =====================================================
   CARD HOVER EFFECT
===================================================== */

playersCards.forEach(function (card) {

    card.addEventListener(

        "mousemove",

        function (event) {

            const rect =
                card.getBoundingClientRect();

            const x =
                event.clientX - rect.left;

            const y =
                event.clientY - rect.top;

            card.style.setProperty(
                "--mouse-x",
                x + "px"
            );

            card.style.setProperty(
                "--mouse-y",
                y + "px"
            );

        }

    );

});


/* =====================================================
   REFRESH DIRECTORY
===================================================== */

function refreshPlayerDirectory() {

    showPlayersLoading();

    setTimeout(function () {

        applyPlayerFilters();

        hidePlayersLoading();

    }, 250);

}


/* =====================================================
   PLAYER DATA PLACEHOLDER
===================================================== */

const playerDirectoryApi = {

    async getPlayers() {

        /*
        GET
        /api/v1/players
        */

        return [];

    },

    async getPlayer(playerId) {

        /*
        GET
        /api/v1/player/{id}
        */

        return null;

    },

    async saveFavorite(playerId) {

        /*
        POST
        /api/v1/player/favorites
        */

    },

    async removeFavorite(playerId) {

        /*
        DELETE
        /api/v1/player/favorites/{id}
        */

    },

    async searchPlayers(filters) {

        /*
        GET
        /api/v1/players?search=&position=&state=&academy=&age_group=&sort=
        */

        return [];

    }

};


/* =====================================================
   PUBLIC HELPERS
===================================================== */

window.playersPage = {

    refresh: refreshPlayerDirectory,

    applyFilters: applyPlayerFilters,

    resetFilters: resetAllPlayerFilters,

    showNotification: showPlayersNotification,

    api: playerDirectoryApi

};


/* =====================================================
   INITIAL PAGE SETUP
===================================================== */

document.addEventListener(

    "DOMContentLoaded",

    function () {

        hidePlayersLoading();

        applyPlayerFilters();

        updateVisiblePlayers();

        updateClearSearchButton();

        updateActiveFilterChips();

    }

);


/* =====================================================
   FUTURE FEATURES

   ✔ Infinite Scroll
   ✔ Scout Shortlisting
   ✔ Coach Recommendations
   ✔ Compare Players
   ✔ Share Player Profile
   ✔ Download Player Card
   ✔ AI Performance Analysis
   ✔ Player Verification Badge
   ✔ Trial Invitation System

   Backend Integration:
   - Mr. Harsh (FastAPI)
   - PostgreSQL
   - JWT Authentication
   - REST API
===================================================== */


/* =====================================================
   END OF players.js
===================================================== */