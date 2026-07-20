/* ======================================================
   academies.js
   PART 1A
   APPLICATION CONFIGURATION, STATE & CORE UTILITIES
====================================================== */

"use strict";

/* ======================================================
   BACKEND INTEGRATION CONFIGURATION
====================================================== */

const ACADEMIES_API = {

    academies:
        "/api/v1/academies",

    states:
        "/api/v1/locations/states",

    map:
        "/api/v1/academies/map",

    saveAcademy:
        "/api/v1/users/saved-academies",

    newsletter:
        "/api/v1/newsletter/subscribe"

};

/* ======================================================
   APPLICATION CONFIGURATION
====================================================== */

const ACADEMIES_CONFIG = {

    pageSize:12,

    debounceDelay:350,

    toastDuration:4500,

    defaultSort:"featured",

    defaultView:"grid",

    storageKeys:{

        savedAcademies:
            "fifaMissionIndiaSavedAcademies",

        directoryView:
            "fifaMissionIndiaAcademyView"

    }

};

/* ======================================================
   APPLICATION STATE
====================================================== */

const academiesState = {

    academies:[],

    filteredAcademies:[],

    mapAcademies:[],

    states:[],

    savedAcademies:new Set(),

    filters:{

        search:"",

        state:"",

        city:"",

        programme:"",

        ageGroup:"",

        verification:"",

        quickFilter:""

    },

    sort:
        ACADEMIES_CONFIG.defaultSort,

    view:
        ACADEMIES_CONFIG.defaultView,

    currentPage:1,

    totalPages:1,

    totalResults:0,

    isLoading:false,

    isMapLoading:false,

    activeMapAcademy:null

};

/* ======================================================
   DOM CACHE
====================================================== */

const academiesDOM = {};

/* ======================================================
   DOM INITIALISATION
====================================================== */

function cacheAcademiesDOM(){

    academiesDOM.directorySection =
        document.querySelector(
            ".academies-directory-section"
        );

    academiesDOM.directoryGrid =
        document.getElementById(
            "academiesDirectoryGrid"
        );

    academiesDOM.academyCardTemplate =
        document.getElementById(
            "academyCardTemplate"
        );

    academiesDOM.loadingState =
        document.getElementById(
            "academyLoadingState"
        );

    academiesDOM.errorState =
        document.getElementById(
            "academyErrorState"
        );

    academiesDOM.emptyState =
        document.getElementById(
            "academyEmptyState"
        );

    academiesDOM.resultsCount =
        document.getElementById(
            "academyResultsCount"
        );

    academiesDOM.activeLocation =
        document.getElementById(
            "academyActiveLocation"
        );

    academiesDOM.activeFilters =
        document.getElementById(
            "academyActiveFilters"
        );

    academiesDOM.activeFilterList =
        document.getElementById(
            "activeFilterList"
        );

    academiesDOM.clearAllFilters =
        document.getElementById(
            "clearAllAcademyFilters"
        );

    academiesDOM.searchInput =
        document.getElementById(
            "academyDirectorySearch"
        );

    academiesDOM.searchClear =
        document.getElementById(
            "academyDirectorySearchClear"
        );

    academiesDOM.stateFilter =
        document.getElementById(
            "academyStateFilter"
        );

    academiesDOM.cityFilter =
        document.getElementById(
            "academyCityFilter"
        );

    academiesDOM.programmeFilter =
        document.getElementById(
            "academyProgrammeFilter"
        );

    academiesDOM.ageGroupFilter =
        document.getElementById(
            "academyAgeGroupFilter"
        );

    academiesDOM.verificationFilter =
        document.getElementById(
            "academyVerificationFilter"
        );

    academiesDOM.sortSelect =
        document.getElementById(
            "academyDirectorySort"
        );

    academiesDOM.quickFilterButtons =
        document.querySelectorAll(
            "[data-academy-quick-filter]"
        );

    academiesDOM.resetFiltersButtons =
        document.querySelectorAll(
            "[data-reset-academy-filters]"
        );

    academiesDOM.gridViewButton =
        document.getElementById(
            "academyGridViewButton"
        );

    academiesDOM.listViewButton =
        document.getElementById(
            "academyListViewButton"
        );

    academiesDOM.pagination =
        document.getElementById(
            "academiesPagination"
        );

    academiesDOM.paginationPageList =
        document.getElementById(
            "academyPaginationPages"
        );

    academiesDOM.previousPageButton =
        document.getElementById(
            "academyPreviousPage"
        );

    academiesDOM.nextPageButton =
        document.getElementById(
            "academyNextPage"
        );

    academiesDOM.loadMoreButton =
        document.getElementById(
            "academiesLoadMoreButton"
        );

    academiesDOM.mobileFilterButton =
        document.getElementById(
            "academyMobileFilterButton"
        );

    academiesDOM.mobileFilterCount =
        document.getElementById(
            "academyMobileFilterCount"
        );

    academiesDOM.filterDrawer =
        document.getElementById(
            "academyFilterDrawer"
        );

    academiesDOM.filterDrawerBackdrop =
        document.getElementById(
            "academyFilterDrawerBackdrop"
        );

    academiesDOM.filterDrawerClose =
        document.getElementById(
            "academyFilterDrawerClose"
        );

    academiesDOM.filterDrawerApply =
        document.getElementById(
            "academyFilterDrawerApply"
        );

    academiesDOM.filterDrawerReset =
        document.getElementById(
            "academyFilterDrawerReset"
        );

    academiesDOM.mapStateFilter =
        document.getElementById(
            "academyMapState"
        );

    academiesDOM.mapCityInput =
        document.getElementById(
            "academyMapCity"
        );

    academiesDOM.mapSearchForm =
        document.getElementById(
            "academyMapSearchForm"
        );

    academiesDOM.mapContainer =
        document.getElementById(
            "academyIndiaMap"
        );

    academiesDOM.mapSelectedCard =
        document.getElementById(
            "academyMapSelectedCard"
        );

    academiesDOM.mapSelectedClose =
        document.getElementById(
            "academyMapCardClose"
        );

    academiesDOM.useLocationButton =
        document.getElementById(
            "academyUseLocationButton"
        );

    academiesDOM.locationStatus =
        document.getElementById(
            "academyLocationStatus"
        );

    academiesDOM.newsletterForm =
        document.getElementById(
            "academyNewsletterForm"
        );

    academiesDOM.newsletterEmail =
        document.getElementById(
            "academyNewsletterEmail"
        );

    academiesDOM.newsletterConsent =
        document.getElementById(
            "academyNewsletterConsent"
        );

    academiesDOM.newsletterMessage =
        document.getElementById(
            "academyNewsletterMessage"
        );

    academiesDOM.faqButtons =
        document.querySelectorAll(
            ".academy-faq-question"
        );

    academiesDOM.programmeButtons =
        document.querySelectorAll(
            "[data-programme-filter]"
        );

    academiesDOM.authModal =
        document.getElementById(
            "academyAuthModal"
        );

    academiesDOM.authModalBackdrop =
        document.getElementById(
            "academyAuthModalBackdrop"
        );

    academiesDOM.authModalClose =
        document.getElementById(
            "academyAuthModalClose"
        );

    academiesDOM.toastContainer =
        document.getElementById(
            "academyToastContainer"
        );

    academiesDOM.backToTop =
        document.getElementById(
            "academyBackToTop"
        );

}

/* ======================================================
   GENERAL UTILITIES
====================================================== */

function debounce(callback,delay){

    let timeoutId;

    return function debouncedFunction(...args){

        window.clearTimeout(timeoutId);

        timeoutId =
            window.setTimeout(
                () => callback.apply(this,args),
                delay
            );

    };

}

function safelyParseJSON(value,fallback){

    try{

        return JSON.parse(value);

    }catch(error){

        console.warn(
            "Unable to parse stored academy data.",
            error
        );

        return fallback;

    }

}

function escapeHTML(value){

    return String(value ?? "")
        .replaceAll("&","&amp;")
        .replaceAll("<","&lt;")
        .replaceAll(">","&gt;")
        .replaceAll('"',"&quot;")
        .replaceAll("'","&#039;");

}

function normalizeText(value){

    return String(value ?? "")
        .trim()
        .toLowerCase();

}

function createSlug(value){

    return normalizeText(value)
        .replace(/[^a-z0-9]+/g,"-")
        .replace(/^-+|-+$/g,"");

}

function formatNumber(value){

    return new Intl.NumberFormat(
        "en-IN"
    ).format(
        Number(value) || 0
    );

}

function formatRating(value){

    const rating =
        Number(value);

    if(Number.isNaN(rating)){

        return "New";

    }

    return rating.toFixed(1);

}

function getAcademyIdentifier(academy){

    return String(
        academy.id ||
        academy.academyId ||
        academy.slug ||
        createSlug(academy.name)
    );

}

function isValidEmail(value){

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        .test(
            String(value).trim()
        );

}

function scrollToDirectory(){

    academiesDOM.directorySection
        ?.scrollIntoView({

            behavior:"smooth",

            block:"start"

        });

}

/* ======================================================
   LOCAL STORAGE
====================================================== */

function loadStoredPreferences(){

    const savedAcademies =
        safelyParseJSON(
            localStorage.getItem(
                ACADEMIES_CONFIG
                    .storageKeys
                    .savedAcademies
            ),
            []
        );

    academiesState.savedAcademies =
        new Set(
            Array.isArray(savedAcademies)
                ? savedAcademies.map(String)
                : []
        );

    const storedView =
        localStorage.getItem(
            ACADEMIES_CONFIG
                .storageKeys
                .directoryView
        );

    if(
        storedView === "grid" ||
        storedView === "list"
    ){

        academiesState.view =
            storedView;

    }

}

function saveAcademiesToStorage(){

    localStorage.setItem(

        ACADEMIES_CONFIG
            .storageKeys
            .savedAcademies,

        JSON.stringify(
            Array.from(
                academiesState.savedAcademies
            )
        )

    );

}

function saveViewPreference(){

    localStorage.setItem(

        ACADEMIES_CONFIG
            .storageKeys
            .directoryView,

        academiesState.view

    );

}

/* ======================================================
   TOAST NOTIFICATIONS
====================================================== */

function showAcademyToast({

    title="Notification",

    message="",

    type="info",

    duration=
        ACADEMIES_CONFIG.toastDuration

}={}){

    if(!academiesDOM.toastContainer){

        return;

    }

    const toast =
        document.createElement("article");

    toast.className =
        `academy-toast ${type}`;

    toast.setAttribute(
        "role",
        type === "error"
            ? "alert"
            : "status"
    );

    const iconMap = {

        success:"✓",

        error:"!",

        warning:"⚠",

        info:"i"

    };

    toast.innerHTML = `

        <div class="academy-toast-icon">
            ${iconMap[type] || iconMap.info}
        </div>

        <div class="academy-toast-content">

            <strong>
                ${escapeHTML(title)}
            </strong>

            <p>
                ${escapeHTML(message)}
            </p>

        </div>

        <button
            class="academy-toast-close"
            type="button"
            aria-label="Close notification"
        >
            ×
        </button>

    `;

    const closeButton =
        toast.querySelector(
            ".academy-toast-close"
        );

    function removeToast(){

        toast.remove();

    }

    closeButton?.addEventListener(
        "click",
        removeToast
    );

    academiesDOM.toastContainer
        .appendChild(toast);

    window.setTimeout(
        removeToast,
        duration
    );

}

/* ======================================================
   API REQUEST HELPER
====================================================== */

async function academyApiRequest(

    url,

    options={}

){

    const requestOptions = {

        method:
            options.method || "GET",

        headers:{

            Accept:
                "application/json",

            "Content-Type":
                "application/json",

            ...options.headers

        },

        ...options

    };

    const response =
        await fetch(
            url,
            requestOptions
        );

    if(!response.ok){

        const errorPayload =
            await response
                .json()
                .catch(() => null);

        const error =
            new Error(
                errorPayload?.message ||
                `Request failed with status ${response.status}`
            );

        error.status =
            response.status;

        error.payload =
            errorPayload;

        throw error;

    }

    if(response.status === 204){

        return null;

    }

    return response.json();

}

/* ======================================================
   STATE HELPERS
====================================================== */

function getActiveFilterCount(){

    return Object.values(
        academiesState.filters
    ).filter(Boolean).length;

}

function resetAcademyFiltersState(){

    academiesState.filters = {

        search:"",

        state:"",

        city:"",

        programme:"",

        ageGroup:"",

        verification:"",

        quickFilter:""

    };

    academiesState.currentPage = 1;

}

function updateAcademyFilter(

    filterName,

    filterValue

){

    if(
        !Object.prototype.hasOwnProperty.call(
            academiesState.filters,
            filterName
        )
    ){

        return;

    }

    academiesState.filters[filterName] =
        String(filterValue ?? "").trim();

    academiesState.currentPage = 1;

}

/* ======================================================
   INITIAL APPLICATION BOOTSTRAP
====================================================== */

document.addEventListener(

    "DOMContentLoaded",

    () => {

        cacheAcademiesDOM();

        loadStoredPreferences();

        console.info(
            "Academies directory frontend initialised."
        );

    }

);

/* ======================================================
   academies.js
   PART 1B
   SAMPLE DATA, DATA LOADING & DIRECTORY STATE HANDLING
====================================================== */

/* ======================================================
   FRONTEND FALLBACK DATA
   Replace with live API responses when backend is ready.
====================================================== */

const ACADEMIES_FALLBACK_DATA = [

    {
        id:"minerva-academy",
        name:"Minerva Academy FC",
        slug:"minerva-academy-fc",
        city:"Mohali",
        state:"Punjab",
        location:"Mohali, Punjab",
        description:
            "A leading residential football academy focused on elite youth development, professional pathways and national-level competition.",
        logo:"images/academies/minerva-logo.png",
        coverImage:"images/academies/minerva-cover.jpg",
        verified:true,
        featured:true,
        residential:true,
        rating:4.9,
        reviewCount:186,
        ageGroups:[
            "U-13",
            "U-15",
            "U-17",
            "U-19"
        ],
        programmes:[
            "Youth Development",
            "Elite",
            "Residential"
        ],
        programmeTypes:[
            "youth",
            "elite",
            "residential"
        ],
        established:2005,
        players:220,
        coaches:28,
        profileUrl:
            "academy-profile.html?id=minerva-academy"
    },

    {
        id:"tata-football-academy",
        name:"Tata Football Academy",
        slug:"tata-football-academy",
        city:"Jamshedpur",
        state:"Jharkhand",
        location:"Jamshedpur, Jharkhand",
        description:
            "A renowned academy developing talented young footballers through structured coaching, education and competitive exposure.",
        logo:"images/academies/tata-logo.png",
        coverImage:"images/academies/tata-cover.jpg",
        verified:true,
        featured:true,
        residential:true,
        rating:4.8,
        reviewCount:142,
        ageGroups:[
            "U-14",
            "U-16",
            "U-18"
        ],
        programmes:[
            "Youth Development",
            "Elite",
            "Residential"
        ],
        programmeTypes:[
            "youth",
            "elite",
            "residential"
        ],
        established:1987,
        players:180,
        coaches:22,
        profileUrl:
            "academy-profile.html?id=tata-football-academy"
    },

    {
        id:"reliance-foundation-young-champs",
        name:"Reliance Foundation Young Champs",
        slug:"reliance-foundation-young-champs",
        city:"Navi Mumbai",
        state:"Maharashtra",
        location:"Navi Mumbai, Maharashtra",
        description:
            "A full-time residential football development programme combining elite training, education, sports science and player welfare.",
        logo:"images/academies/rfyc-logo.png",
        coverImage:"images/academies/rfyc-cover.jpg",
        verified:true,
        featured:true,
        residential:true,
        rating:4.8,
        reviewCount:119,
        ageGroups:[
            "U-12",
            "U-14",
            "U-16",
            "U-18"
        ],
        programmes:[
            "Grassroots",
            "Youth Development",
            "Residential"
        ],
        programmeTypes:[
            "grassroots",
            "youth",
            "residential"
        ],
        established:2015,
        players:160,
        coaches:24,
        profileUrl:
            "academy-profile.html?id=reliance-foundation-young-champs"
    },

    {
        id:"bengaluru-fc-academy",
        name:"Bengaluru FC Academy",
        slug:"bengaluru-fc-academy",
        city:"Bengaluru",
        state:"Karnataka",
        location:"Bengaluru, Karnataka",
        description:
            "A professional club academy offering age-group development programmes and pathways towards elite and senior football.",
        logo:"images/academies/bengaluru-fc-logo.png",
        coverImage:"images/academies/bengaluru-fc-cover.jpg",
        verified:true,
        featured:false,
        residential:false,
        rating:4.7,
        reviewCount:103,
        ageGroups:[
            "U-11",
            "U-13",
            "U-15",
            "U-18"
        ],
        programmes:[
            "Grassroots",
            "Youth Development",
            "Elite"
        ],
        programmeTypes:[
            "grassroots",
            "youth",
            "elite"
        ],
        established:2013,
        players:145,
        coaches:18,
        profileUrl:
            "academy-profile.html?id=bengaluru-fc-academy"
    },

    {
        id:"sudeva-delhi-fc-academy",
        name:"Sudeva Delhi FC Academy",
        slug:"sudeva-delhi-fc-academy",
        city:"New Delhi",
        state:"Delhi",
        location:"New Delhi, Delhi",
        description:
            "A player-focused football academy delivering residential training, competitive football and professional development opportunities.",
        logo:"images/academies/sudeva-logo.png",
        coverImage:"images/academies/sudeva-cover.jpg",
        verified:true,
        featured:false,
        residential:true,
        rating:4.6,
        reviewCount:89,
        ageGroups:[
            "U-13",
            "U-15",
            "U-17",
            "U-20"
        ],
        programmes:[
            "Youth Development",
            "Elite",
            "Residential"
        ],
        programmeTypes:[
            "youth",
            "elite",
            "residential"
        ],
        established:2014,
        players:170,
        coaches:20,
        profileUrl:
            "academy-profile.html?id=sudeva-delhi-fc-academy"
    },

    {
        id:"muthoot-football-academy",
        name:"Muthoot Football Academy",
        slug:"muthoot-football-academy",
        city:"Kochi",
        state:"Kerala",
        location:"Kochi, Kerala",
        description:
            "A structured youth football programme supporting grassroots talent identification, technical development and competitive opportunities.",
        logo:"images/academies/muthoot-logo.png",
        coverImage:"images/academies/muthoot-cover.jpg",
        verified:true,
        featured:false,
        residential:false,
        rating:4.5,
        reviewCount:74,
        ageGroups:[
            "U-10",
            "U-12",
            "U-14",
            "U-16"
        ],
        programmes:[
            "Grassroots",
            "Youth Development"
        ],
        programmeTypes:[
            "grassroots",
            "youth"
        ],
        established:2018,
        players:130,
        coaches:16,
        profileUrl:
            "academy-profile.html?id=muthoot-football-academy"
    },

    {
        id:"baichung-bhutia-football-schools",
        name:"Baichung Bhutia Football Schools",
        slug:"baichung-bhutia-football-schools",
        city:"Gurugram",
        state:"Haryana",
        location:"Gurugram, Haryana",
        description:
            "A nationwide football training network focused on grassroots participation, technical development and long-term player progression.",
        logo:"images/academies/bbfs-logo.png",
        coverImage:"images/academies/bbfs-cover.jpg",
        verified:true,
        featured:false,
        residential:false,
        rating:4.5,
        reviewCount:208,
        ageGroups:[
            "U-8",
            "U-10",
            "U-12",
            "U-14",
            "U-16"
        ],
        programmes:[
            "Grassroots",
            "Youth Development"
        ],
        programmeTypes:[
            "grassroots",
            "youth"
        ],
        established:2010,
        players:450,
        coaches:42,
        profileUrl:
            "academy-profile.html?id=baichung-bhutia-football-schools"
    },

    {
        id:"shillong-lajong-academy",
        name:"Shillong Lajong Academy",
        slug:"shillong-lajong-academy",
        city:"Shillong",
        state:"Meghalaya",
        location:"Shillong, Meghalaya",
        description:
            "A respected northeastern football academy known for identifying local talent and providing pathways into competitive senior football.",
        logo:"images/academies/shillong-lajong-logo.png",
        coverImage:"images/academies/shillong-lajong-cover.jpg",
        verified:true,
        featured:false,
        residential:true,
        rating:4.7,
        reviewCount:97,
        ageGroups:[
            "U-13",
            "U-15",
            "U-17",
            "U-19"
        ],
        programmes:[
            "Youth Development",
            "Elite",
            "Residential"
        ],
        programmeTypes:[
            "youth",
            "elite",
            "residential"
        ],
        established:1983,
        players:155,
        coaches:19,
        profileUrl:
            "academy-profile.html?id=shillong-lajong-academy"
    },

    {
        id:"aizawl-fc-academy",
        name:"Aizawl FC Academy",
        slug:"aizawl-fc-academy",
        city:"Aizawl",
        state:"Mizoram",
        location:"Aizawl, Mizoram",
        description:
            "A youth development academy nurturing football talent through disciplined training, local scouting and senior team pathways.",
        logo:"images/academies/aizawl-fc-logo.png",
        coverImage:"images/academies/aizawl-fc-cover.jpg",
        verified:true,
        featured:false,
        residential:false,
        rating:4.6,
        reviewCount:84,
        ageGroups:[
            "U-13",
            "U-15",
            "U-17"
        ],
        programmes:[
            "Youth Development",
            "Elite"
        ],
        programmeTypes:[
            "youth",
            "elite"
        ],
        established:1984,
        players:125,
        coaches:15,
        profileUrl:
            "academy-profile.html?id=aizawl-fc-academy"
    },

    {
        id:"dsk-shivajians-academy",
        name:"DSK Shivajians Academy",
        slug:"dsk-shivajians-academy",
        city:"Pune",
        state:"Maharashtra",
        location:"Pune, Maharashtra",
        description:
            "A football development programme providing technical coaching, structured competition and professional-level training environments.",
        logo:"images/academies/dsk-logo.png",
        coverImage:"images/academies/dsk-cover.jpg",
        verified:false,
        featured:false,
        residential:true,
        rating:4.3,
        reviewCount:51,
        ageGroups:[
            "U-14",
            "U-16",
            "U-18"
        ],
        programmes:[
            "Youth Development",
            "Residential"
        ],
        programmeTypes:[
            "youth",
            "residential"
        ],
        established:2006,
        players:105,
        coaches:14,
        profileUrl:
            "academy-profile.html?id=dsk-shivajians-academy"
    },

    {
        id:"mohun-bagan-youth-academy",
        name:"Mohun Bagan Youth Academy",
        slug:"mohun-bagan-youth-academy",
        city:"Kolkata",
        state:"West Bengal",
        location:"Kolkata, West Bengal",
        description:
            "A historic club youth system focused on developing technically strong footballers for competitive and professional football.",
        logo:"images/academies/mohun-bagan-logo.png",
        coverImage:"images/academies/mohun-bagan-cover.jpg",
        verified:true,
        featured:false,
        residential:false,
        rating:4.7,
        reviewCount:131,
        ageGroups:[
            "U-13",
            "U-15",
            "U-18"
        ],
        programmes:[
            "Youth Development",
            "Elite"
        ],
        programmeTypes:[
            "youth",
            "elite"
        ],
        established:1889,
        players:140,
        coaches:17,
        profileUrl:
            "academy-profile.html?id=mohun-bagan-youth-academy"
    },

    {
        id:"east-bengal-football-school",
        name:"East Bengal Football School",
        slug:"east-bengal-football-school",
        city:"Kolkata",
        state:"West Bengal",
        location:"Kolkata, West Bengal",
        description:
            "A grassroots and youth academy delivering structured football education, technical coaching and competitive match opportunities.",
        logo:"images/academies/east-bengal-logo.png",
        coverImage:"images/academies/east-bengal-cover.jpg",
        verified:true,
        featured:false,
        residential:false,
        rating:4.5,
        reviewCount:112,
        ageGroups:[
            "U-9",
            "U-11",
            "U-13",
            "U-15"
        ],
        programmes:[
            "Grassroots",
            "Youth Development"
        ],
        programmeTypes:[
            "grassroots",
            "youth"
        ],
        established:1920,
        players:190,
        coaches:21,
        profileUrl:
            "academy-profile.html?id=east-bengal-football-school"
    },

    {
        id:"nagaland-football-academy",
        name:"Nagaland Football Academy",
        slug:"nagaland-football-academy",
        city:"Dimapur",
        state:"Nagaland",
        location:"Dimapur, Nagaland",
        description:
            "A developing regional academy supporting young footballers through grassroots coaching, talent identification and competition.",
        logo:"images/academies/nagaland-academy-logo.png",
        coverImage:"images/academies/nagaland-academy-cover.jpg",
        verified:false,
        featured:false,
        residential:false,
        rating:4.2,
        reviewCount:36,
        ageGroups:[
            "U-10",
            "U-13",
            "U-15",
            "U-17"
        ],
        programmes:[
            "Grassroots",
            "Youth Development"
        ],
        programmeTypes:[
            "grassroots",
            "youth"
        ],
        established:2020,
        players:95,
        coaches:11,
        profileUrl:
            "academy-profile.html?id=nagaland-football-academy"
    },

    {
        id:"sports-authority-of-india-imphal",
        name:"SAI Football Academy Imphal",
        slug:"sai-football-academy-imphal",
        city:"Imphal",
        state:"Manipur",
        location:"Imphal, Manipur",
        description:
            "A high-performance football training centre supporting talented athletes through coaching, fitness development and competition.",
        logo:"images/academies/sai-logo.png",
        coverImage:"images/academies/sai-imphal-cover.jpg",
        verified:true,
        featured:false,
        residential:true,
        rating:4.6,
        reviewCount:68,
        ageGroups:[
            "U-14",
            "U-16",
            "U-18"
        ],
        programmes:[
            "Elite",
            "Residential"
        ],
        programmeTypes:[
            "elite",
            "residential"
        ],
        established:1987,
        players:115,
        coaches:16,
        profileUrl:
            "academy-profile.html?id=sports-authority-of-india-imphal"
    }

];

/* ======================================================
   NORMALISE ACADEMY RECORD
====================================================== */

function normalizeAcademyRecord(academy,index=0){

    const name =
        String(
            academy.name ||
            academy.academyName ||
            `Academy ${index + 1}`
        ).trim();

    const identifier =
        String(
            academy.id ||
            academy.academyId ||
            academy.slug ||
            createSlug(name) ||
            `academy-${index + 1}`
        );

    const city =
        String(
            academy.city ||
            academy.address?.city ||
            ""
        ).trim();

    const state =
        String(
            academy.state ||
            academy.address?.state ||
            ""
        ).trim();

    const programmes =
        Array.isArray(academy.programmes)
            ? academy.programmes
            : [];

    const programmeTypes =
        Array.isArray(academy.programmeTypes)
            ? academy.programmeTypes
            : programmes.map(createSlug);

    const ageGroups =
        Array.isArray(academy.ageGroups)
            ? academy.ageGroups
            : [];

    return {

        id:identifier,

        name,

        slug:
            academy.slug ||
            createSlug(name),

        city,

        state,

        location:
            academy.location ||
            [city,state]
                .filter(Boolean)
                .join(", "),

        description:
            academy.description ||
            "Academy profile details will be available soon.",

        logo:
            academy.logo ||
            academy.logoUrl ||
            "images/academies/default-academy-logo.png",

        coverImage:
            academy.coverImage ||
            academy.coverImageUrl ||
            "images/academies/default-academy-cover.jpg",

        verified:
            Boolean(academy.verified),

        featured:
            Boolean(academy.featured),

        residential:
            Boolean(academy.residential),

        rating:
            Number(academy.rating) || 0,

        reviewCount:
            Number(
                academy.reviewCount ||
                academy.reviews
            ) || 0,

        programmes,

        programmeTypes,

        ageGroups,

        established:
            academy.established ||
            academy.establishedYear ||
            "—",

        players:
            Number(
                academy.players ||
                academy.playerCount
            ) || 0,

        coaches:
            Number(
                academy.coaches ||
                academy.coachCount
            ) || 0,

        profileUrl:
            academy.profileUrl ||
            `academy-profile.html?id=${encodeURIComponent(identifier)}`,

        latitude:
            Number(academy.latitude) || null,

        longitude:
            Number(academy.longitude) || null

    };

}

/* ======================================================
   NORMALISE API RESPONSE
====================================================== */

function extractAcademyResponse(payload){

    if(Array.isArray(payload)){

        return {

            academies:payload,

            total:payload.length,

            totalPages:1

        };

    }

    const academies =
        payload?.academies ||
        payload?.results ||
        payload?.data ||
        payload?.items ||
        [];

    return {

        academies:
            Array.isArray(academies)
                ? academies
                : [],

        total:
            Number(
                payload?.total ||
                payload?.totalResults ||
                payload?.count
            ) ||
            academies.length,

        totalPages:
            Number(
                payload?.totalPages ||
                payload?.pages
            ) || 1

    };

}

/* ======================================================
   LOAD ACADEMIES
====================================================== */

async function loadAcademies({

    useFallback=true

}={}){

    setDirectoryLoadingState(true);

    try{

        const payload =
            await academyApiRequest(
                ACADEMIES_API.academies
            );

        const response =
            extractAcademyResponse(payload);

        academiesState.academies =
            response.academies.map(
                normalizeAcademyRecord
            );

        academiesState.totalResults =
            response.total;

        academiesState.totalPages =
            response.totalPages;

    }catch(error){

        console.warn(
            "Academies API unavailable.",
            error
        );

        if(!useFallback){

            showDirectoryErrorState();

            return;

        }

        academiesState.academies =
            ACADEMIES_FALLBACK_DATA.map(
                normalizeAcademyRecord
            );

        academiesState.totalResults =
            academiesState.academies.length;

        academiesState.totalPages =
            Math.max(
                1,
                Math.ceil(
                    academiesState.totalResults /
                    ACADEMIES_CONFIG.pageSize
                )
            );

        showAcademyToast({

            title:"Demo academy data loaded",

            message:
                "Live academy data will appear after the backend API is connected.",

            type:"info",

            duration:5000

        });

    }finally{

        setDirectoryLoadingState(false);

    }

    populateStateFilters();

    populateCityFilter();

    applyAcademyDirectoryState();

}

/* ======================================================
   DIRECTORY LOADING STATE
====================================================== */

function setDirectoryLoadingState(isLoading){

    academiesState.isLoading =
        Boolean(isLoading);

    academiesDOM.loadingState?.toggleAttribute(
        "hidden",
        !academiesState.isLoading
    );

    if(academiesState.isLoading){

        academiesDOM.errorState?.setAttribute(
            "hidden",
            ""
        );

        academiesDOM.emptyState?.setAttribute(
            "hidden",
            ""
        );

        academiesDOM.directoryGrid?.setAttribute(
            "aria-busy",
            "true"
        );

    }else{

        academiesDOM.directoryGrid?.setAttribute(
            "aria-busy",
            "false"
        );

    }

}

/* ======================================================
   DIRECTORY ERROR STATE
====================================================== */

function showDirectoryErrorState(){

    setDirectoryLoadingState(false);

    academiesDOM.directoryGrid?.replaceChildren();

    academiesDOM.errorState?.removeAttribute(
        "hidden"
    );

    academiesDOM.emptyState?.setAttribute(
        "hidden",
        ""
    );

    academiesDOM.pagination?.setAttribute(
        "hidden",
        ""
    );

    academiesDOM.loadMoreButton
        ?.closest(
            ".academies-load-more-wrapper"
        )
        ?.setAttribute(
            "hidden",
            ""
        );

}

/* ======================================================
   DIRECTORY EMPTY STATE
====================================================== */

function updateDirectoryEmptyState(){

    const isEmpty =
        !academiesState.isLoading &&
        academiesState.filteredAcademies.length === 0;

    academiesDOM.emptyState?.toggleAttribute(
        "hidden",
        !isEmpty
    );

    academiesDOM.directoryGrid?.toggleAttribute(
        "hidden",
        isEmpty
    );

    if(!isEmpty){

        academiesDOM.errorState?.setAttribute(
            "hidden",
            ""
        );

    }

}

/* ======================================================
   POPULATE STATE FILTERS
====================================================== */

function populateStateFilters(){

    const stateNames =
        Array.from(
            new Set(
                academiesState.academies
                    .map(academy => academy.state)
                    .filter(Boolean)
            )
        ).sort(
            (first,second) =>
                first.localeCompare(second)
        );

    academiesState.states =
        stateNames;

    const selectElements = [

        academiesDOM.stateFilter,

        academiesDOM.mapStateFilter

    ].filter(Boolean);

    selectElements.forEach(select => {

        const currentValue =
            select.value;

        const firstOption =
            select.options[0]?.cloneNode(true);

        select.replaceChildren();

        if(firstOption){

            select.appendChild(firstOption);

        }else{

            const option =
                document.createElement("option");

            option.value = "";

            option.textContent =
                "All states";

            select.appendChild(option);

        }

        stateNames.forEach(stateName => {

            const option =
                document.createElement("option");

            option.value =
                stateName;

            option.textContent =
                stateName;

            select.appendChild(option);

        });

        if(
            stateNames.includes(
                currentValue
            )
        ){

            select.value =
                currentValue;

        }

    });

}

/* ======================================================
   POPULATE CITY FILTER
====================================================== */

function populateCityFilter(){

    if(!academiesDOM.cityFilter){

        return;

    }

    const selectedState =
        academiesState.filters.state;

    const cityNames =
        Array.from(
            new Set(
                academiesState.academies
                    .filter(academy => {

                        return (
                            !selectedState ||
                            academy.state === selectedState
                        );

                    })
                    .map(academy => academy.city)
                    .filter(Boolean)
            )
        ).sort(
            (first,second) =>
                first.localeCompare(second)
        );

    const currentValue =
        academiesState.filters.city;

    const firstOption =
        academiesDOM.cityFilter
            .options[0]
            ?.cloneNode(true);

    academiesDOM.cityFilter
        .replaceChildren();

    if(firstOption){

        academiesDOM.cityFilter
            .appendChild(firstOption);

    }else{

        const defaultOption =
            document.createElement("option");

        defaultOption.value = "";

        defaultOption.textContent =
            "All cities";

        academiesDOM.cityFilter
            .appendChild(defaultOption);

    }

    cityNames.forEach(cityName => {

        const option =
            document.createElement("option");

        option.value =
            cityName;

        option.textContent =
            cityName;

        academiesDOM.cityFilter
            .appendChild(option);

    });

    if(cityNames.includes(currentValue)){

        academiesDOM.cityFilter.value =
            currentValue;

    }else{

        academiesState.filters.city = "";

        academiesDOM.cityFilter.value = "";

    }

}

/* ======================================================
   FILTER ACADEMIES
====================================================== */

function filterAcademies(academies){

    const {

        search,

        state,

        city,

        programme,

        ageGroup,

        verification,

        quickFilter

    } = academiesState.filters;

    const normalizedSearch =
        normalizeText(search);

    return academies.filter(academy => {

        const searchableText =
            normalizeText([

                academy.name,

                academy.city,

                academy.state,

                academy.location,

                academy.description,

                ...academy.programmes,

                ...academy.ageGroups

            ].join(" "));

        const matchesSearch =
            !normalizedSearch ||
            searchableText.includes(
                normalizedSearch
            );

        const matchesState =
            !state ||
            academy.state === state;

        const matchesCity =
            !city ||
            academy.city === city;

        const normalizedProgramme =
            createSlug(programme);

        const matchesProgramme =
            !programme ||
            academy.programmeTypes.some(
                type =>
                    createSlug(type) ===
                    normalizedProgramme
            ) ||
            academy.programmes.some(
                item =>
                    createSlug(item) ===
                    normalizedProgramme
            );

        const matchesAgeGroup =
            !ageGroup ||
            academy.ageGroups.some(
                group =>
                    normalizeText(group) ===
                    normalizeText(ageGroup)
            );

        let matchesVerification = true;

        if(verification === "verified"){

            matchesVerification =
                academy.verified;

        }

        if(verification === "unverified"){

            matchesVerification =
                !academy.verified;

        }

        let matchesQuickFilter = true;

        switch(quickFilter){

            case "featured":

                matchesQuickFilter =
                    academy.featured;

                break;

            case "verified":

                matchesQuickFilter =
                    academy.verified;

                break;

            case "residential":

                matchesQuickFilter =
                    academy.residential;

                break;

            case "top-rated":

                matchesQuickFilter =
                    academy.rating >= 4.5;

                break;

            case "grassroots":

                matchesQuickFilter =
                    academy.programmeTypes
                        .some(
                            item =>
                                createSlug(item) ===
                                "grassroots"
                        );

                break;

            default:

                matchesQuickFilter = true;

        }

        return (

            matchesSearch &&
            matchesState &&
            matchesCity &&
            matchesProgramme &&
            matchesAgeGroup &&
            matchesVerification &&
            matchesQuickFilter

        );

    });

}

/* ======================================================
   SORT ACADEMIES
====================================================== */

function sortAcademies(academies){

    const sortedAcademies =
        [...academies];

    switch(academiesState.sort){

        case "rating-high":

            sortedAcademies.sort(
                (first,second) =>
                    second.rating -
                    first.rating
            );

            break;

        case "reviews-high":

            sortedAcademies.sort(
                (first,second) =>
                    second.reviewCount -
                    first.reviewCount
            );

            break;

        case "name-asc":

            sortedAcademies.sort(
                (first,second) =>
                    first.name.localeCompare(
                        second.name
                    )
            );

            break;

        case "name-desc":

            sortedAcademies.sort(
                (first,second) =>
                    second.name.localeCompare(
                        first.name
                    )
            );

            break;

        case "newest":

            sortedAcademies.sort(
                (first,second) =>
                    Number(second.established) -
                    Number(first.established)
            );

            break;

        case "oldest":

            sortedAcademies.sort(
                (first,second) =>
                    Number(first.established) -
                    Number(second.established)
            );

            break;

        case "featured":
        default:

            sortedAcademies.sort(
                (first,second) => {

                    if(
                        first.featured !==
                        second.featured
                    ){

                        return Number(
                            second.featured
                        ) -
                        Number(
                            first.featured
                        );

                    }

                    if(
                        first.verified !==
                        second.verified
                    ){

                        return Number(
                            second.verified
                        ) -
                        Number(
                            first.verified
                        );

                    }

                    return (
                        second.rating -
                        first.rating
                    );

                }
            );

    }

    return sortedAcademies;

}

/* ======================================================
   APPLY DIRECTORY STATE
====================================================== */

function applyAcademyDirectoryState({

    append=false

}={}){

    const filtered =
        filterAcademies(
            academiesState.academies
        );

    academiesState.filteredAcademies =
        sortAcademies(filtered);

    academiesState.totalResults =
        academiesState
            .filteredAcademies
            .length;

    academiesState.totalPages =
        Math.max(
            1,
            Math.ceil(
                academiesState.totalResults /
                ACADEMIES_CONFIG.pageSize
            )
        );

    if(
        academiesState.currentPage >
        academiesState.totalPages
    ){

        academiesState.currentPage =
            academiesState.totalPages;

    }

    updateDirectoryResultsSummary();

    updateActiveFiltersUI();

    updateMobileFilterCount();

    updateDirectoryEmptyState();

    renderAcademyDirectory({

        append

    });

    renderPagination();

    updateLoadMoreButton();

}

/* ======================================================
   PAGINATED ACADEMY RESULTS
====================================================== */

function getCurrentAcademyPage(){

    const endIndex =
        academiesState.currentPage *
        ACADEMIES_CONFIG.pageSize;

    const startIndex =
        endIndex -
        ACADEMIES_CONFIG.pageSize;

    return academiesState
        .filteredAcademies
        .slice(
            startIndex,
            endIndex
        );

}

function getLoadedAcademies(){

    const endIndex =
        academiesState.currentPage *
        ACADEMIES_CONFIG.pageSize;

    return academiesState
        .filteredAcademies
        .slice(
            0,
            endIndex
        );

}

/* ======================================================
   DIRECTORY SUMMARY
====================================================== */

function updateDirectoryResultsSummary(){

    if(academiesDOM.resultsCount){

        academiesDOM.resultsCount
            .innerHTML = `

                Showing
                <strong>
                    ${formatNumber(
                        academiesState.totalResults
                    )}
                </strong>
                academies

            `;

    }

    if(academiesDOM.activeLocation){

        const locationParts = [

            academiesState.filters.city,

            academiesState.filters.state

        ].filter(Boolean);

        academiesDOM.activeLocation
            .textContent =
                locationParts.length
                    ? `Near ${locationParts.join(", ")}`
                    : "Across India";

    }

}

/* ======================================================
   MOBILE FILTER COUNT
====================================================== */

function updateMobileFilterCount(){

    if(!academiesDOM.mobileFilterCount){

        return;

    }

    const activeFilterCount =
        getActiveFilterCount();

    academiesDOM.mobileFilterCount
        .textContent =
            String(activeFilterCount);

    academiesDOM.mobileFilterCount
        .toggleAttribute(
            "hidden",
            activeFilterCount === 0
        );

}

/* ======================================================
   INITIAL DATA LOAD
====================================================== */

document.addEventListener(

    "DOMContentLoaded",

    () => {

        loadAcademies();

    }

);

/* ======================================================
   academies.js
   PART 1C
   DIRECTORY CARD RENDERING, ACTIVE FILTERS & PAGINATION
====================================================== */

/* ======================================================
   RENDER ACADEMY DIRECTORY
====================================================== */

function renderAcademyDirectory({

    append=false

}={}){

    if(
        !academiesDOM.directoryGrid ||
        !academiesDOM.academyCardTemplate
    ){

        return;

    }

    const academiesToRender =
        append
            ? getLoadedAcademies()
            : getCurrentAcademyPage();

    if(!append){

        academiesDOM.directoryGrid
            .replaceChildren();

    }else{

        academiesDOM.directoryGrid
            .replaceChildren();

    }

    const fragment =
        document.createDocumentFragment();

    academiesToRender.forEach(academy => {

        const academyCard =
            createAcademyCard(academy);

        fragment.appendChild(
            academyCard
        );

    });

    academiesDOM.directoryGrid
        .appendChild(fragment);

    academiesDOM.directoryGrid
        .classList.toggle(
            "list-view",
            academiesState.view === "list"
        );

    academiesDOM.directoryGrid
        .removeAttribute("hidden");

    updateDirectoryViewButtons();

}

/* ======================================================
   CREATE ACADEMY CARD
====================================================== */

function createAcademyCard(academy){

    const templateContent =
        academiesDOM
            .academyCardTemplate
            .content
            .cloneNode(true);

    const card =
        templateContent.querySelector(
            ".academy-directory-card"
        );

    if(!card){

        return templateContent;

    }

    const academyId =
        getAcademyIdentifier(academy);

    card.dataset.academyId =
        academyId;

    card.dataset.academyName =
        academy.name;

    const imageLink =
        card.querySelector(
            ".academy-card-image-link"
        );

    const titleLink =
        card.querySelector(
            ".academy-card-title-link"
        );

    const profileButton =
        card.querySelector(
            ".academy-profile-button"
        );

    [
        imageLink,
        titleLink,
        profileButton
    ].forEach(link => {

        if(link){

            link.href =
                academy.profileUrl;

        }

    });

    const coverImage =
        card.querySelector(
            ".academy-card-cover-image"
        );

    if(coverImage){

        coverImage.src =
            academy.coverImage;

        coverImage.alt =
            `${academy.name} football academy`;

        coverImage.addEventListener(
            "error",
            () => {

                coverImage.src =
                    "images/academies/default-academy-cover.jpg";

            },
            {
                once:true
            }
        );

    }

    const logo =
        card.querySelector(
            ".academy-card-logo"
        );

    if(logo){

        logo.src =
            academy.logo;

        logo.alt =
            `${academy.name} logo`;

        logo.addEventListener(
            "error",
            () => {

                logo.src =
                    "images/academies/default-academy-logo.png";

            },
            {
                once:true
            }
        );

    }

    const title =
        card.querySelector(
            ".academy-card-title"
        );

    if(title){

        title.textContent =
            academy.name;

    }

    const subtitle =
        card.querySelector(
            ".academy-card-subtitle"
        );

    if(subtitle){

        subtitle.textContent =
            academy.featured
                ? "Featured Football Academy"
                : "Football Development Academy";

    }

    const description =
        card.querySelector(
            ".academy-card-description"
        );

    if(description){

        description.textContent =
            academy.description;

    }

    const location =
        card.querySelector(
            ".academy-card-location span"
        );

    if(location){

        location.textContent =
            academy.location ||
            "India";

    }

    updateAcademyCardBadges(
        card,
        academy
    );

    renderAcademyProgrammes(
        card,
        academy
    );

    updateAcademyCardDetails(
        card,
        academy
    );

    updateAcademyCardRating(
        card,
        academy
    );

    initialiseAcademySaveButton(
        card,
        academy
    );

    return card;

}

/* ======================================================
   CARD BADGES
====================================================== */

function updateAcademyCardBadges(

    card,

    academy

){

    const verifiedBadge =
        card.querySelector(
            ".academy-verification-badge"
        );

    const featuredBadge =
        card.querySelector(
            ".academy-featured-badge"
        );

    verifiedBadge?.toggleAttribute(
        "hidden",
        !academy.verified
    );

    featuredBadge?.toggleAttribute(
        "hidden",
        !academy.featured
    );

}

/* ======================================================
   PROGRAMME TAGS
====================================================== */

function renderAcademyProgrammes(

    card,

    academy

){

    const programmesContainer =
        card.querySelector(
            ".academy-card-programs"
        );

    if(!programmesContainer){

        return;

    }

    programmesContainer
        .replaceChildren();

    const visibleProgrammes =
        academy.programmes.slice(0,2);

    visibleProgrammes.forEach(
        programme => {

            const tag =
                document.createElement(
                    "span"
                );

            tag.className =
                "academy-program-tag";

            tag.textContent =
                programme;

            programmesContainer
                .appendChild(tag);

        }
    );

    const remainingCount =
        academy.programmes.length -
        visibleProgrammes.length;

    if(remainingCount > 0){

        const moreTag =
            document.createElement(
                "span"
            );

        moreTag.className =
            "academy-program-tag more";

        moreTag.textContent =
            `+${remainingCount} more`;

        programmesContainer
            .appendChild(moreTag);

    }

}

/* ======================================================
   CARD DETAILS
====================================================== */

function updateAcademyCardDetails(

    card,

    academy

){

    const established =
        card.querySelector(
            "[data-academy-established]"
        );

    const players =
        card.querySelector(
            "[data-academy-players]"
        );

    const coaches =
        card.querySelector(
            "[data-academy-coaches]"
        );

    if(established){

        established.textContent =
            academy.established;

    }

    if(players){

        players.textContent =
            formatNumber(
                academy.players
            );

    }

    if(coaches){

        coaches.textContent =
            formatNumber(
                academy.coaches
            );

    }

}

/* ======================================================
   CARD RATING
====================================================== */

function updateAcademyCardRating(

    card,

    academy

){

    const rating =
        card.querySelector(
            "[data-academy-rating]"
        );

    const reviews =
        card.querySelector(
            "[data-academy-reviews]"
        );

    if(rating){

        rating.textContent =
            formatRating(
                academy.rating
            );

    }

    if(reviews){

        reviews.textContent =
            academy.reviewCount > 0
                ? `(${formatNumber(
                    academy.reviewCount
                )} reviews)`
                : "(No reviews yet)";

    }

}

/* ======================================================
   SAVE ACADEMY BUTTON
====================================================== */

function initialiseAcademySaveButton(

    card,

    academy

){

    const saveButton =
        card.querySelector(
            ".academy-save-button"
        );

    if(!saveButton){

        return;

    }

    const academyId =
        getAcademyIdentifier(academy);

    const isSaved =
        academiesState
            .savedAcademies
            .has(academyId);

    saveButton.dataset.academyId =
        academyId;

    saveButton.setAttribute(
        "aria-pressed",
        String(isSaved)
    );

    saveButton.setAttribute(
        "aria-label",
        isSaved
            ? `Remove ${academy.name} from saved academies`
            : `Save ${academy.name}`
    );

    saveButton.title =
        isSaved
            ? "Remove saved academy"
            : "Save academy";

    saveButton.addEventListener(
        "click",
        event => {

            event.preventDefault();

            event.stopPropagation();

            toggleSavedAcademy(
                academy,
                saveButton
            );

        }
    );

}

/* ======================================================
   TOGGLE SAVED ACADEMY
====================================================== */

async function toggleSavedAcademy(

    academy,

    button

){

    const academyId =
        getAcademyIdentifier(academy);

    const isCurrentlySaved =
        academiesState
            .savedAcademies
            .has(academyId);

    if(isCurrentlySaved){

        academiesState
            .savedAcademies
            .delete(academyId);

    }else{

        academiesState
            .savedAcademies
            .add(academyId);

    }

    saveAcademiesToStorage();

    const isNowSaved =
        !isCurrentlySaved;

    button.setAttribute(
        "aria-pressed",
        String(isNowSaved)
    );

    button.setAttribute(
        "aria-label",
        isNowSaved
            ? `Remove ${academy.name} from saved academies`
            : `Save ${academy.name}`
    );

    button.title =
        isNowSaved
            ? "Remove saved academy"
            : "Save academy";

    showAcademyToast({

        title:
            isNowSaved
                ? "Academy saved"
                : "Academy removed",

        message:
            isNowSaved
                ? `${academy.name} was added to your saved academies.`
                : `${academy.name} was removed from your saved academies.`,

        type:"success"

    });

    try{

        await academyApiRequest(

            isNowSaved
                ? ACADEMIES_API.saveAcademy
                : `${ACADEMIES_API.saveAcademy}/${encodeURIComponent(
                    academyId
                )}`,

            {

                method:
                    isNowSaved
                        ? "POST"
                        : "DELETE",

                body:
                    isNowSaved
                        ? JSON.stringify({

                            academyId

                        })
                        : undefined

            }

        );

    }catch(error){

        console.info(
            "Saved academy change stored locally.",
            error
        );

    }

}

/* ======================================================
   ACTIVE FILTERS
====================================================== */

function updateActiveFiltersUI(){

    if(
        !academiesDOM.activeFilters ||
        !academiesDOM.activeFilterList
    ){

        return;

    }

    academiesDOM.activeFilterList
        .replaceChildren();

    const activeFilters =
        buildActiveFilterEntries();

    academiesDOM.activeFilters
        .toggleAttribute(
            "hidden",
            activeFilters.length === 0
        );

    activeFilters.forEach(filter => {

        const chip =
            document.createElement(
                "span"
            );

        chip.className =
            "active-filter-chip";

        chip.innerHTML = `

            <span>
                ${escapeHTML(filter.label)}
            </span>

            <button
                type="button"
                aria-label="Remove ${escapeHTML(
                    filter.label
                )} filter"
            >
                ×
            </button>

        `;

        chip.querySelector("button")
            ?.addEventListener(
                "click",
                () => {

                    removeAcademyFilter(
                        filter.key
                    );

                }
            );

        academiesDOM.activeFilterList
            .appendChild(chip);

    });

}

/* ======================================================
   BUILD ACTIVE FILTER ENTRIES
====================================================== */

function buildActiveFilterEntries(){

    const filters =
        academiesState.filters;

    const entries = [];

    const filterLabels = {

        search:
            value =>
                `Search: ${value}`,

        state:
            value =>
                `State: ${value}`,

        city:
            value =>
                `City: ${value}`,

        programme:
            value =>
                `Programme: ${value}`,

        ageGroup:
            value =>
                `Age: ${value}`,

        verification:
            value =>
                value === "verified"
                    ? "Verified only"
                    : "Unverified only",

        quickFilter:
            value =>
                value
                    .split("-")
                    .map(
                        word =>
                            word.charAt(0)
                                .toUpperCase() +
                            word.slice(1)
                    )
                    .join(" ")

    };

    Object.entries(filters)
        .forEach(([key,value]) => {

            if(!value){

                return;

            }

            entries.push({

                key,

                label:
                    filterLabels[key]
                        ? filterLabels[key](value)
                        : value

            });

        });

    return entries;

}

/* ======================================================
   REMOVE INDIVIDUAL FILTER
====================================================== */

function removeAcademyFilter(

    filterKey

){

    updateAcademyFilter(
        filterKey,
        ""
    );

    syncFilterControlsFromState();

    if(filterKey === "state"){

        populateCityFilter();

    }

    applyAcademyDirectoryState();

}

/* ======================================================
   RESET ALL FILTERS
====================================================== */

function resetAllAcademyFilters({

    scroll=true

}={}){

    resetAcademyFiltersState();

    syncFilterControlsFromState();

    populateCityFilter();

    applyAcademyDirectoryState();

    if(scroll){

        scrollToDirectory();

    }

}

/* ======================================================
   SYNC FILTER CONTROLS
====================================================== */

function syncFilterControlsFromState(){

    const filters =
        academiesState.filters;

    if(academiesDOM.searchInput){

        academiesDOM.searchInput.value =
            filters.search;

    }

    if(academiesDOM.stateFilter){

        academiesDOM.stateFilter.value =
            filters.state;

    }

    if(academiesDOM.cityFilter){

        academiesDOM.cityFilter.value =
            filters.city;

    }

    if(academiesDOM.programmeFilter){

        academiesDOM.programmeFilter.value =
            filters.programme;

    }

    if(academiesDOM.ageGroupFilter){

        academiesDOM.ageGroupFilter.value =
            filters.ageGroup;

    }

    if(academiesDOM.verificationFilter){

        academiesDOM.verificationFilter.value =
            filters.verification;

    }

    if(academiesDOM.sortSelect){

        academiesDOM.sortSelect.value =
            academiesState.sort;

    }

    academiesDOM.quickFilterButtons
        ?.forEach(button => {

            const isActive =
                button.dataset
                    .academyQuickFilter ===
                filters.quickFilter;

            button.classList.toggle(
                "active",
                isActive
            );

            button.setAttribute(
                "aria-pressed",
                String(isActive)
            );

        });

    academiesDOM.searchClear
        ?.toggleAttribute(
            "hidden",
            !filters.search
        );

}

/* ======================================================
   DIRECTORY VIEW CONTROLS
====================================================== */

function updateDirectoryViewButtons(){

    const isGrid =
        academiesState.view === "grid";

    academiesDOM.gridViewButton
        ?.setAttribute(
            "aria-pressed",
            String(isGrid)
        );

    academiesDOM.listViewButton
        ?.setAttribute(
            "aria-pressed",
            String(!isGrid)
        );

    academiesDOM.gridViewButton
        ?.classList.toggle(
            "active",
            isGrid
        );

    academiesDOM.listViewButton
        ?.classList.toggle(
            "active",
            !isGrid
        );

}

/* ======================================================
   SET DIRECTORY VIEW
====================================================== */

function setAcademyDirectoryView(

    view

){

    if(
        view !== "grid" &&
        view !== "list"
    ){

        return;

    }

    academiesState.view =
        view;

    saveViewPreference();

    academiesDOM.directoryGrid
        ?.classList.toggle(
            "list-view",
            view === "list"
        );

    updateDirectoryViewButtons();

}

/* ======================================================
   PAGINATION
====================================================== */

function renderPagination(){

    if(
        !academiesDOM.pagination ||
        !academiesDOM.paginationPageList
    ){

        return;

    }

    const shouldShowPagination =
        academiesState.totalResults >
        ACADEMIES_CONFIG.pageSize;

    academiesDOM.pagination
        .toggleAttribute(
            "hidden",
            !shouldShowPagination
        );

    if(!shouldShowPagination){

        return;

    }

    academiesDOM.paginationPageList
        .replaceChildren();

    const pages =
        getPaginationPageNumbers();

    pages.forEach(page => {

        if(page === "..."){

            const ellipsis =
                document.createElement(
                    "span"
                );

            ellipsis.className =
                "pagination-ellipsis";

            ellipsis.textContent =
                "…";

            academiesDOM
                .paginationPageList
                .appendChild(ellipsis);

            return;

        }

        const button =
            document.createElement(
                "button"
            );

        button.type =
            "button";

        button.className =
            "pagination-page-button";

        button.textContent =
            String(page);

        button.setAttribute(
            "aria-label",
            `Go to academy page ${page}`
        );

        if(
            page ===
            academiesState.currentPage
        ){

            button.classList.add(
                "active"
            );

            button.setAttribute(
                "aria-current",
                "page"
            );

        }

        button.addEventListener(
            "click",
            () => {

                changeAcademyPage(page);

            }
        );

        academiesDOM
            .paginationPageList
            .appendChild(button);

    });

    if(
        academiesDOM.previousPageButton
    ){

        academiesDOM
            .previousPageButton
            .disabled =
                academiesState.currentPage <= 1;

    }

    if(
        academiesDOM.nextPageButton
    ){

        academiesDOM
            .nextPageButton
            .disabled =
                academiesState.currentPage >=
                academiesState.totalPages;

    }

}

/* ======================================================
   PAGINATION PAGE NUMBERS
====================================================== */

function getPaginationPageNumbers(){

    const current =
        academiesState.currentPage;

    const total =
        academiesState.totalPages;

    if(total <= 7){

        return Array.from(
            {
                length:total
            },
            (_,index) => index + 1
        );

    }

    if(current <= 4){

        return [
            1,
            2,
            3,
            4,
            5,
            "...",
            total
        ];

    }

    if(current >= total - 3){

        return [
            1,
            "...",
            total - 4,
            total - 3,
            total - 2,
            total - 1,
            total
        ];

    }

    return [
        1,
        "...",
        current - 1,
        current,
        current + 1,
        "...",
        total
    ];

}

/* ======================================================
   CHANGE PAGE
====================================================== */

function changeAcademyPage(page){

    const nextPage =
        Number(page);

    if(
        Number.isNaN(nextPage) ||
        nextPage < 1 ||
        nextPage >
            academiesState.totalPages
    ){

        return;

    }

    academiesState.currentPage =
        nextPage;

    renderAcademyDirectory();

    renderPagination();

    updateLoadMoreButton();

    scrollToDirectory();

}

/* ======================================================
   LOAD MORE BUTTON
====================================================== */

function updateLoadMoreButton(){

    if(!academiesDOM.loadMoreButton){

        return;

    }

    const wrapper =
        academiesDOM.loadMoreButton
            .closest(
                ".academies-load-more-wrapper"
            );

    const shouldShow =
        academiesState.totalResults >
            ACADEMIES_CONFIG.pageSize &&
        academiesState.currentPage <
            academiesState.totalPages;

    wrapper?.toggleAttribute(
        "hidden",
        !shouldShow
    );

    academiesDOM.loadMoreButton
        .disabled =
            !shouldShow;

}

/* ======================================================
   LOAD MORE ACADEMIES
====================================================== */

function loadMoreAcademies(){

    if(
        academiesState.currentPage >=
        academiesState.totalPages
    ){

        return;

    }

    academiesState.currentPage += 1;

    renderAcademyDirectory({

        append:true

    });

    renderPagination();

    updateLoadMoreButton();

}

/* ======================================================
   RETRY DIRECTORY LOAD
====================================================== */

function initialiseDirectoryRetryButton(){

    const retryButton =
        academiesDOM.errorState
            ?.querySelector(
                ".directory-retry-button"
            );

    retryButton?.addEventListener(
        "click",
        () => {

            loadAcademies({

                useFallback:true

            });

        }
    );

}

/* ======================================================
   INITIAL DIRECTORY UI SETUP
====================================================== */

document.addEventListener(

    "DOMContentLoaded",

    () => {

        syncFilterControlsFromState();

        initialiseDirectoryRetryButton();

    }

);

/* ======================================================
   academies.js
   PART 1D
   DIRECTORY EVENTS, FILTER DRAWER & VIEW INTERACTIONS
====================================================== */

/* ======================================================
   SEARCH HANDLER
====================================================== */

const handleAcademySearch =
    debounce(
        event => {

            updateAcademyFilter(
                "search",
                event.target.value
            );

            academiesDOM.searchClear
                ?.toggleAttribute(
                    "hidden",
                    !event.target.value.trim()
                );

            applyAcademyDirectoryState();

        },
        ACADEMIES_CONFIG.debounceDelay
    );

/* ======================================================
   FILTER CONTROL EVENTS
====================================================== */

function initialiseAcademyDirectoryControls(){

    academiesDOM.searchInput
        ?.addEventListener(
            "input",
            handleAcademySearch
        );

    academiesDOM.searchClear
        ?.addEventListener(
            "click",
            () => {

                if(
                    academiesDOM.searchInput
                ){

                    academiesDOM
                        .searchInput
                        .value = "";

                    academiesDOM
                        .searchInput
                        .focus();

                }

                updateAcademyFilter(
                    "search",
                    ""
                );

                academiesDOM.searchClear
                    ?.setAttribute(
                        "hidden",
                        ""
                    );

                applyAcademyDirectoryState();

            }
        );

    academiesDOM.stateFilter
        ?.addEventListener(
            "change",
            event => {

                updateAcademyFilter(
                    "state",
                    event.target.value
                );

                updateAcademyFilter(
                    "city",
                    ""
                );

                populateCityFilter();

                applyAcademyDirectoryState();

            }
        );

    academiesDOM.cityFilter
        ?.addEventListener(
            "change",
            event => {

                updateAcademyFilter(
                    "city",
                    event.target.value
                );

                applyAcademyDirectoryState();

            }
        );

    academiesDOM.programmeFilter
        ?.addEventListener(
            "change",
            event => {

                updateAcademyFilter(
                    "programme",
                    event.target.value
                );

                applyAcademyDirectoryState();

            }
        );

    academiesDOM.ageGroupFilter
        ?.addEventListener(
            "change",
            event => {

                updateAcademyFilter(
                    "ageGroup",
                    event.target.value
                );

                applyAcademyDirectoryState();

            }
        );

    academiesDOM.verificationFilter
        ?.addEventListener(
            "change",
            event => {

                updateAcademyFilter(
                    "verification",
                    event.target.value
                );

                applyAcademyDirectoryState();

            }
        );

    academiesDOM.sortSelect
        ?.addEventListener(
            "change",
            event => {

                academiesState.sort =
                    event.target.value ||
                    ACADEMIES_CONFIG.defaultSort;

                academiesState.currentPage =
                    1;

                applyAcademyDirectoryState();

            }
        );

}

/* ======================================================
   QUICK FILTER EVENTS
====================================================== */

function initialiseAcademyQuickFilters(){

    academiesDOM.quickFilterButtons
        ?.forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const selectedFilter =
                        button.dataset
                            .academyQuickFilter ||
                        "";

                    const isAlreadyActive =
                        academiesState
                            .filters
                            .quickFilter ===
                        selectedFilter;

                    updateAcademyFilter(
                        "quickFilter",
                        isAlreadyActive
                            ? ""
                            : selectedFilter
                    );

                    syncFilterControlsFromState();

                    applyAcademyDirectoryState();

                }
            );

        });

}

/* ======================================================
   RESET FILTER EVENTS
====================================================== */

function initialiseAcademyResetButtons(){

    academiesDOM.resetFiltersButtons
        ?.forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    resetAllAcademyFilters();

                }
            );

        });

    academiesDOM.clearAllFilters
        ?.addEventListener(
            "click",
            () => {

                resetAllAcademyFilters();

            }
        );

    const emptyStateReset =
        academiesDOM.emptyState
            ?.querySelector(
                ".directory-reset-button"
            );

    emptyStateReset
        ?.addEventListener(
            "click",
            () => {

                resetAllAcademyFilters();

            }
        );

}

/* ======================================================
   DIRECTORY VIEW EVENTS
====================================================== */

function initialiseDirectoryViewControls(){

    academiesDOM.gridViewButton
        ?.addEventListener(
            "click",
            () => {

                setAcademyDirectoryView(
                    "grid"
                );

            }
        );

    academiesDOM.listViewButton
        ?.addEventListener(
            "click",
            () => {

                setAcademyDirectoryView(
                    "list"
                );

            }
        );

}

/* ======================================================
   PAGINATION EVENTS
====================================================== */

function initialiseAcademyPaginationEvents(){

    academiesDOM.previousPageButton
        ?.addEventListener(
            "click",
            () => {

                changeAcademyPage(
                    academiesState
                        .currentPage - 1
                );

            }
        );

    academiesDOM.nextPageButton
        ?.addEventListener(
            "click",
            () => {

                changeAcademyPage(
                    academiesState
                        .currentPage + 1
                );

            }
        );

    academiesDOM.loadMoreButton
        ?.addEventListener(
            "click",
            loadMoreAcademies
        );

}

/* ======================================================
   FILTER DRAWER
====================================================== */

function openAcademyFilterDrawer(){

    if(!academiesDOM.filterDrawer){

        return;

    }

    academiesDOM.filterDrawer
        .classList.add("open");

    academiesDOM.filterDrawer
        .setAttribute(
            "aria-hidden",
            "false"
        );

    document.body
        .classList.add(
            "drawer-open"
        );

    academiesDOM.filterDrawerClose
        ?.focus();

}

function closeAcademyFilterDrawer(){

    if(!academiesDOM.filterDrawer){

        return;

    }

    academiesDOM.filterDrawer
        .classList.remove("open");

    academiesDOM.filterDrawer
        .setAttribute(
            "aria-hidden",
            "true"
        );

    document.body
        .classList.remove(
            "drawer-open"
        );

    academiesDOM.mobileFilterButton
        ?.focus();

}

/* ======================================================
   FILTER DRAWER EVENTS
====================================================== */

function initialiseAcademyFilterDrawer(){

    academiesDOM.mobileFilterButton
        ?.addEventListener(
            "click",
            openAcademyFilterDrawer
        );

    academiesDOM.filterDrawerClose
        ?.addEventListener(
            "click",
            closeAcademyFilterDrawer
        );

    academiesDOM.filterDrawerBackdrop
        ?.addEventListener(
            "click",
            closeAcademyFilterDrawer
        );

    academiesDOM.filterDrawerApply
        ?.addEventListener(
            "click",
            () => {

                closeAcademyFilterDrawer();

                scrollToDirectory();

            }
        );

    academiesDOM.filterDrawerReset
        ?.addEventListener(
            "click",
            () => {

                resetAllAcademyFilters({

                    scroll:false

                });

            }
        );

}

/* ======================================================
   PROGRAMME CARD FILTER EVENTS
====================================================== */

function initialiseProgrammeFilterButtons(){

    academiesDOM.programmeButtons
        ?.forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const programme =
                        button.dataset
                            .programmeFilter ||
                        "";

                    updateAcademyFilter(
                        "programme",
                        programme
                    );

                    syncFilterControlsFromState();

                    applyAcademyDirectoryState();

                    scrollToDirectory();

                }
            );

        });

}

/* ======================================================
   KEYBOARD INTERACTIONS
====================================================== */

function handleAcademiesGlobalKeyboard(

    event

){

    if(event.key !== "Escape"){

        return;

    }

    if(
        academiesDOM.filterDrawer
            ?.classList
            .contains("open")
    ){

        closeAcademyFilterDrawer();

    }

    if(
        academiesDOM.authModal
            ?.classList
            .contains("open")
    ){

        closeAcademyAuthModal();

    }

    if(
        academiesDOM.mapSelectedCard &&
        !academiesDOM.mapSelectedCard
            .hasAttribute("hidden")
    ){

        hideSelectedAcademyMapCard();

    }

}

/* ======================================================
   RESPONSIVE FILTER SYNCHRONISATION
====================================================== */

function synchroniseDrawerFilters(){

    const drawer =
        academiesDOM.filterDrawer;

    if(!drawer){

        return;

    }

    const desktopFilterContainer =
        document.querySelector(
            ".directory-toolbar-filters"
        );

    const drawerFilterContainer =
        drawer.querySelector(
            ".academy-filter-drawer-content"
        );

    if(
        !desktopFilterContainer ||
        !drawerFilterContainer
    ){

        return;

    }

    if(
        drawerFilterContainer
            .children
            .length === 0
    ){

        const clonedFilters =
            desktopFilterContainer
                .cloneNode(true);

        clonedFilters
            .removeAttribute("id");

        clonedFilters
            .querySelectorAll("[id]")
            .forEach(element => {

                element.removeAttribute(
                    "id"
                );

            });

        drawerFilterContainer
            .appendChild(
                clonedFilters
            );

    }

}

/* ======================================================
   DRAWER FILTER DELEGATION
====================================================== */

function initialiseDrawerFilterDelegation(){

    const drawerContent =
        academiesDOM.filterDrawer
            ?.querySelector(
                ".academy-filter-drawer-content"
            );

    if(!drawerContent){

        return;

    }

    drawerContent.addEventListener(
        "change",
        event => {

            const control =
                event.target;

            if(
                !(control instanceof HTMLSelectElement)
            ){

                return;

            }

            const controlName =
                control.name ||
                control.dataset.filterName ||
                "";

            const filterMap = {

                state:"state",

                city:"city",

                programme:"programme",

                ageGroup:"ageGroup",

                verification:"verification",

                sort:"sort"

            };

            const stateKey =
                filterMap[controlName];

            if(!stateKey){

                return;

            }

            if(stateKey === "sort"){

                academiesState.sort =
                    control.value ||
                    ACADEMIES_CONFIG.defaultSort;

            }else{

                updateAcademyFilter(
                    stateKey,
                    control.value
                );

            }

            if(stateKey === "state"){

                updateAcademyFilter(
                    "city",
                    ""
                );

                populateCityFilter();

            }

            syncFilterControlsFromState();

            applyAcademyDirectoryState();

        }
    );

}

/* ======================================================
   BACK TO TOP
====================================================== */

function updateBackToTopVisibility(){

    if(!academiesDOM.backToTop){

        return;

    }

    const shouldShow =
        window.scrollY > 550;

    academiesDOM.backToTop
        .toggleAttribute(
            "hidden",
            !shouldShow
        );

}

function initialiseBackToTop(){

    academiesDOM.backToTop
        ?.addEventListener(
            "click",
            () => {

                window.scrollTo({

                    top:0,

                    behavior:"smooth"

                });

            }
        );

    window.addEventListener(
        "scroll",
        debounce(
            updateBackToTopVisibility,
            80
        ),
        {
            passive:true
        }
    );

    updateBackToTopVisibility();

}

/* ======================================================
   INITIALISE DIRECTORY INTERACTIONS
====================================================== */

document.addEventListener(

    "DOMContentLoaded",

    () => {

        initialiseAcademyDirectoryControls();

        initialiseAcademyQuickFilters();

        initialiseAcademyResetButtons();

        initialiseDirectoryViewControls();

        initialiseAcademyPaginationEvents();

        synchroniseDrawerFilters();

        initialiseAcademyFilterDrawer();

        initialiseDrawerFilterDelegation();

        initialiseProgrammeFilterButtons();

        initialiseBackToTop();

        document.addEventListener(
            "keydown",
            handleAcademiesGlobalKeyboard
        );

    }

);

/* ======================================================
   academies.js
   PART 1E
   MAP SEARCH, LOCATION ACCESS & SELECTED ACADEMY CARD
====================================================== */

/* ======================================================
   MAP POSITION DATA
   Frontend-only approximate marker positions.
   Backend can later provide latitude and longitude.
====================================================== */

const ACADEMY_MAP_POSITIONS = {

    Punjab:{
        x:31,
        y:24
    },

    Haryana:{
        x:35,
        y:30
    },

    Delhi:{
        x:37,
        y:31
    },

    Maharashtra:{
        x:38,
        y:56
    },

    Karnataka:{
        x:43,
        y:69
    },

    Kerala:{
        x:43,
        y:83
    },

    Jharkhand:{
        x:60,
        y:48
    },

    "West Bengal":{
        x:67,
        y:48
    },

    Meghalaya:{
        x:78,
        y:39
    },

    Nagaland:{
        x:87,
        y:41
    },

    Manipur:{
        x:87,
        y:46
    },

    Mizoram:{
        x:84,
        y:53
    }

};

/* ======================================================
   PREPARE MAP ACADEMY DATA
====================================================== */

function prepareAcademyMapData(){

    academiesState.mapAcademies =
        academiesState.academies
            .filter(academy => {

                return Boolean(
                    academy.state
                );

            })
            .map(
                (academy,index) => {

                    const defaultPosition =
                        ACADEMY_MAP_POSITIONS[
                            academy.state
                        ] || {

                            x:
                                25 +
                                (
                                    index * 7
                                ) % 60,

                            y:
                                25 +
                                (
                                    index * 11
                                ) % 55

                        };

                    return {

                        ...academy,

                        mapX:
                            Number(
                                academy.mapX
                            ) ||
                            defaultPosition.x,

                        mapY:
                            Number(
                                academy.mapY
                            ) ||
                            defaultPosition.y

                    };

                }
            );

}

/* ======================================================
   RENDER ACADEMY MAP MARKERS
====================================================== */

function renderAcademyMapMarkers(

    academies =
        academiesState.mapAcademies

){

    if(!academiesDOM.mapContainer){

        return;

    }

    academiesDOM.mapContainer
        .querySelectorAll(
            ".academy-map-marker"
        )
        .forEach(marker => {

            marker.remove();

        });

    const markerLayer =
        getAcademyMapMarkerLayer();

    if(!markerLayer){

        return;

    }

    const fragment =
        document.createDocumentFragment();

    academies.forEach(academy => {

        const marker =
            createAcademyMapMarker(
                academy
            );

        fragment.appendChild(marker);

    });

    markerLayer.appendChild(fragment);

}

/* ======================================================
   GET OR CREATE MAP MARKER LAYER
====================================================== */

function getAcademyMapMarkerLayer(){

    if(!academiesDOM.mapContainer){

        return null;

    }

    let markerLayer =
        academiesDOM.mapContainer
            .querySelector(
                ".academy-map-marker-layer"
            );

    if(!markerLayer){

        markerLayer =
            document.createElement(
                "div"
            );

        markerLayer.className =
            "academy-map-marker-layer";

        markerLayer.setAttribute(
            "aria-label",
            "Football academies across India"
        );

        academiesDOM.mapContainer
            .appendChild(markerLayer);

    }

    return markerLayer;

}

/* ======================================================
   CREATE MAP MARKER
====================================================== */

function createAcademyMapMarker(

    academy

){

    const marker =
        document.createElement(
            "button"
        );

    marker.type =
        "button";

    marker.className =
        "academy-map-marker";

    if(academy.featured){

        marker.classList.add(
            "featured"
        );

    }

    if(academy.verified){

        marker.classList.add(
            "verified"
        );

    }

    marker.style.left =
        `${academy.mapX}%`;

    marker.style.top =
        `${academy.mapY}%`;

    marker.dataset.academyId =
        getAcademyIdentifier(
            academy
        );

    marker.setAttribute(
        "aria-label",
        `View ${academy.name} in ${academy.location}`
    );

    marker.innerHTML = `

        <span
            class="academy-map-marker-dot"
            aria-hidden="true"
        ></span>

        <span
            class="academy-map-marker-tooltip"
            role="tooltip"
        >

            <strong>
                ${escapeHTML(
                    academy.name
                )}
            </strong>

            <small>
                ${escapeHTML(
                    academy.location
                )}
            </small>

        </span>

    `;

    marker.addEventListener(
        "click",
        () => {

            selectAcademyMapMarker(
                academy,
                marker
            );

        }
    );

    return marker;

}

/* ======================================================
   SELECT MAP MARKER
====================================================== */

function selectAcademyMapMarker(

    academy,

    marker

){

    academiesDOM.mapContainer
        ?.querySelectorAll(
            ".academy-map-marker.active"
        )
        .forEach(activeMarker => {

            activeMarker.classList
                .remove("active");

            activeMarker.setAttribute(
                "aria-pressed",
                "false"
            );

        });

    marker?.classList.add(
        "active"
    );

    marker?.setAttribute(
        "aria-pressed",
        "true"
    );

    academiesState.activeMapAcademy =
        academy;

    renderSelectedAcademyMapCard(
        academy
    );

}

/* ======================================================
   RENDER SELECTED MAP ACADEMY
====================================================== */

function renderSelectedAcademyMapCard(

    academy

){

    if(!academiesDOM.mapSelectedCard){

        return;

    }

    const card =
        academiesDOM.mapSelectedCard;

    const image =
        card.querySelector(
            ".academy-map-card-image"
        );

    const logo =
        card.querySelector(
            ".academy-map-card-logo"
        );

    const name =
        card.querySelector(
            ".academy-map-card-name"
        );

    const location =
        card.querySelector(
            ".academy-map-card-location"
        );

    const description =
        card.querySelector(
            ".academy-map-card-description"
        );

    const rating =
        card.querySelector(
            "[data-map-academy-rating]"
        );

    const reviews =
        card.querySelector(
            "[data-map-academy-reviews]"
        );

    const profileLink =
        card.querySelector(
            ".academy-map-profile-link"
        );

    const verifiedBadge =
        card.querySelector(
            ".academy-map-verified"
        );

    if(image){

        image.src =
            academy.coverImage;

        image.alt =
            `${academy.name} academy campus`;

        image.onerror = () => {

            image.src =
                "images/academies/default-academy-cover.jpg";

        };

    }

    if(logo){

        logo.src =
            academy.logo;

        logo.alt =
            `${academy.name} logo`;

        logo.onerror = () => {

            logo.src =
                "images/academies/default-academy-logo.png";

        };

    }

    if(name){

        name.textContent =
            academy.name;

    }

    if(location){

        location.textContent =
            academy.location;

    }

    if(description){

        description.textContent =
            academy.description;

    }

    if(rating){

        rating.textContent =
            formatRating(
                academy.rating
            );

    }

    if(reviews){

        reviews.textContent =
            `${formatNumber(
                academy.reviewCount
            )} reviews`;

    }

    if(profileLink){

        profileLink.href =
            academy.profileUrl;

    }

    verifiedBadge?.toggleAttribute(
        "hidden",
        !academy.verified
    );

    card.removeAttribute(
        "hidden"
    );

    card.setAttribute(
        "aria-hidden",
        "false"
    );

}

/* ======================================================
   HIDE SELECTED MAP CARD
====================================================== */

function hideSelectedAcademyMapCard(){

    academiesState.activeMapAcademy =
        null;

    academiesDOM.mapSelectedCard
        ?.setAttribute(
            "hidden",
            ""
        );

    academiesDOM.mapSelectedCard
        ?.setAttribute(
            "aria-hidden",
            "true"
        );

    academiesDOM.mapContainer
        ?.querySelectorAll(
            ".academy-map-marker.active"
        )
        .forEach(marker => {

            marker.classList.remove(
                "active"
            );

            marker.setAttribute(
                "aria-pressed",
                "false"
            );

        });

}

/* ======================================================
   MAP SEARCH
====================================================== */

function searchAcademiesOnMap({

    state="",

    city=""

}={}){

    const normalizedCity =
        normalizeText(city);

    const matchingAcademies =
        academiesState
            .mapAcademies
            .filter(academy => {

                const matchesState =
                    !state ||
                    academy.state === state;

                const matchesCity =
                    !normalizedCity ||
                    normalizeText(
                        academy.city
                    ).includes(
                        normalizedCity
                    ) ||
                    normalizeText(
                        academy.location
                    ).includes(
                        normalizedCity
                    );

                return (
                    matchesState &&
                    matchesCity
                );

            });

    renderAcademyMapMarkers(
        matchingAcademies
    );

    hideSelectedAcademyMapCard();

    if(matchingAcademies.length === 0){

        showAcademyToast({

            title:"No academies found",

            message:
                "Try another state or city in the map search.",

            type:"warning"

        });

        return;

    }

    showAcademyToast({

        title:
            `${formatNumber(
                matchingAcademies.length
            )} academies found`,

        message:
            state || city
                ? `Showing academies near ${
                    [city,state]
                        .filter(Boolean)
                        .join(", ")
                }.`
                : "Showing academies across India.",

        type:"success",

        duration:3200

    });

}

/* ======================================================
   MAP SEARCH FORM
====================================================== */

function initialiseAcademyMapSearch(){

    academiesDOM.mapSearchForm
        ?.addEventListener(
            "submit",
            event => {

                event.preventDefault();

                const state =
                    academiesDOM
                        .mapStateFilter
                        ?.value
                        .trim() ||
                    "";

                const city =
                    academiesDOM
                        .mapCityInput
                        ?.value
                        .trim() ||
                    "";

                searchAcademiesOnMap({

                    state,

                    city

                });

            }
        );

    academiesDOM.mapStateFilter
        ?.addEventListener(
            "change",
            () => {

                const state =
                    academiesDOM
                        .mapStateFilter
                        ?.value ||
                    "";

                const city =
                    academiesDOM
                        .mapCityInput
                        ?.value ||
                    "";

                searchAcademiesOnMap({

                    state,

                    city

                });

            }
        );

    academiesDOM.mapSelectedClose
        ?.addEventListener(
            "click",
            hideSelectedAcademyMapCard
        );

}

/* ======================================================
   USER GEOLOCATION
====================================================== */

function requestUserLocation(){

    if(
        !navigator.geolocation
    ){

        updateLocationStatus(
            "Location access is not supported by this browser.",
            "error"
        );

        showAcademyToast({

            title:"Location unavailable",

            message:
                "Your browser does not support location access.",

            type:"error"

        });

        return;

    }

    setLocationButtonLoading(true);

    updateLocationStatus(
        "Finding your location...",
        "loading"
    );

    navigator.geolocation
        .getCurrentPosition(

            handleUserLocationSuccess,

            handleUserLocationError,

            {

                enableHighAccuracy:false,

                timeout:10000,

                maximumAge:300000

            }

        );

}

/* ======================================================
   LOCATION SUCCESS
====================================================== */

function handleUserLocationSuccess(

    position

){

    setLocationButtonLoading(false);

    const latitude =
        position.coords.latitude;

    const longitude =
        position.coords.longitude;

    const nearestAcademy =
        findNearestAcademy({

            latitude,

            longitude

        });

    if(!nearestAcademy){

        updateLocationStatus(
            "Location detected. No nearby academy data is available yet.",
            "warning"
        );

        return;

    }

    updateLocationStatus(
        `Nearest listed academy: ${nearestAcademy.name}`,
        "success"
    );

    updateAcademyFilter(
        "state",
        nearestAcademy.state
    );

    updateAcademyFilter(
        "city",
        nearestAcademy.city
    );

    syncFilterControlsFromState();

    populateCityFilter();

    applyAcademyDirectoryState();

    if(academiesDOM.mapStateFilter){

        academiesDOM.mapStateFilter.value =
            nearestAcademy.state;

    }

    if(academiesDOM.mapCityInput){

        academiesDOM.mapCityInput.value =
            nearestAcademy.city;

    }

    searchAcademiesOnMap({

        state:
            nearestAcademy.state,

        city:
            nearestAcademy.city

    });

    scrollToDirectory();

    showAcademyToast({

        title:"Nearby academies updated",

        message:
            `Showing academies near ${nearestAcademy.city}, ${nearestAcademy.state}.`,

        type:"success"

    });

}

/* ======================================================
   LOCATION ERROR
====================================================== */

function handleUserLocationError(

    error

){

    setLocationButtonLoading(false);

    let message =
        "We could not access your location.";

    switch(error.code){

        case error.PERMISSION_DENIED:

            message =
                "Location permission was denied. You can search by state or city instead.";

            break;

        case error.POSITION_UNAVAILABLE:

            message =
                "Your current location could not be determined.";

            break;

        case error.TIMEOUT:

            message =
                "Location detection took too long. Please try again.";

            break;

        default:

            message =
                "An unexpected location error occurred.";

    }

    updateLocationStatus(
        message,
        "error"
    );

    showAcademyToast({

        title:"Location not available",

        message,

        type:"warning"

    });

}

/* ======================================================
   FIND NEAREST ACADEMY
====================================================== */

function findNearestAcademy({

    latitude,

    longitude

}){

    const academiesWithCoordinates =
        academiesState.mapAcademies
            .filter(academy => {

                return (
                    Number.isFinite(
                        academy.latitude
                    ) &&
                    Number.isFinite(
                        academy.longitude
                    )
                );

            });

    if(
        academiesWithCoordinates.length === 0
    ){

        return findNearestAcademyFallback(

            latitude,

            longitude

        );

    }

    return academiesWithCoordinates
        .map(academy => {

            return {

                academy,

                distance:
                    calculateCoordinateDistance(

                        latitude,

                        longitude,

                        academy.latitude,

                        academy.longitude

                    )

            };

        })
        .sort(
            (first,second) =>
                first.distance -
                second.distance
        )[0]?.academy || null;

}

/* ======================================================
   FRONTEND LOCATION FALLBACK
====================================================== */

function findNearestAcademyFallback(

    latitude,

    longitude

){

    const regionalLocations = [

        {
            state:"Punjab",
            latitude:30.73,
            longitude:76.78
        },

        {
            state:"Delhi",
            latitude:28.61,
            longitude:77.20
        },

        {
            state:"Maharashtra",
            latitude:19.07,
            longitude:72.87
        },

        {
            state:"Karnataka",
            latitude:12.97,
            longitude:77.59
        },

        {
            state:"Kerala",
            latitude:9.93,
            longitude:76.27
        },

        {
            state:"West Bengal",
            latitude:22.57,
            longitude:88.36
        },

        {
            state:"Jharkhand",
            latitude:22.80,
            longitude:86.20
        },

        {
            state:"Meghalaya",
            latitude:25.57,
            longitude:91.88
        },

        {
            state:"Nagaland",
            latitude:25.91,
            longitude:93.72
        },

        {
            state:"Manipur",
            latitude:24.82,
            longitude:93.94
        },

        {
            state:"Mizoram",
            latitude:23.72,
            longitude:92.72
        }

    ];

    const nearestRegion =
        regionalLocations
            .map(region => {

                return {

                    ...region,

                    distance:
                        calculateCoordinateDistance(

                            latitude,

                            longitude,

                            region.latitude,

                            region.longitude

                        )

                };

            })
            .sort(
                (first,second) =>
                    first.distance -
                    second.distance
            )[0];

    if(!nearestRegion){

        return null;

    }

    return academiesState.mapAcademies
        .filter(
            academy =>
                academy.state ===
                nearestRegion.state
        )
        .sort(
            (first,second) =>
                second.rating -
                first.rating
        )[0] || null;

}

/* ======================================================
   CALCULATE DISTANCE
====================================================== */

function calculateCoordinateDistance(

    firstLatitude,

    firstLongitude,

    secondLatitude,

    secondLongitude

){

    const earthRadius =
        6371;

    const latitudeDifference =
        degreesToRadians(
            secondLatitude -
            firstLatitude
        );

    const longitudeDifference =
        degreesToRadians(
            secondLongitude -
            firstLongitude
        );

    const calculation =
        Math.sin(
            latitudeDifference / 2
        ) ** 2 +
        Math.cos(
            degreesToRadians(
                firstLatitude
            )
        ) *
        Math.cos(
            degreesToRadians(
                secondLatitude
            )
        ) *
        Math.sin(
            longitudeDifference / 2
        ) ** 2;

    return (
        earthRadius *
        2 *
        Math.atan2(
            Math.sqrt(calculation),
            Math.sqrt(1 - calculation)
        )
    );

}

function degreesToRadians(

    degrees

){

    return (
        degrees *
        Math.PI /
        180
    );

}

/* ======================================================
   LOCATION UI
====================================================== */

function setLocationButtonLoading(

    isLoading

){

    if(!academiesDOM.useLocationButton){

        return;

    }

    academiesDOM.useLocationButton
        .disabled =
            Boolean(isLoading);

    academiesDOM.useLocationButton
        .classList.toggle(
            "loading",
            Boolean(isLoading)
        );

    academiesDOM.useLocationButton
        .setAttribute(
            "aria-busy",
            String(
                Boolean(isLoading)
            )
        );

}

function updateLocationStatus(

    message,

    status="info"

){

    if(!academiesDOM.locationStatus){

        return;

    }

    academiesDOM.locationStatus
        .textContent =
            message;

    academiesDOM.locationStatus
        .className =
            `academy-location-status ${status}`;

}

/* ======================================================
   LOCATION BUTTON
====================================================== */

function initialiseAcademyLocationButton(){

    academiesDOM.useLocationButton
        ?.addEventListener(
            "click",
            requestUserLocation
        );

}

/* ======================================================
   INITIALISE MAP
====================================================== */

function initialiseAcademyMap(){

    prepareAcademyMapData();

    renderAcademyMapMarkers();

    initialiseAcademyMapSearch();

    initialiseAcademyLocationButton();

}

/* ======================================================
   INITIAL MAP BOOTSTRAP
====================================================== */

window.addEventListener(

    "load",

    () => {

        window.setTimeout(
            initialiseAcademyMap,
            100
        );

    }

);

/* ======================================================
   academies.js
   PART 1F
   FAQ, NEWSLETTER, AUTH MODAL & FINAL PAGE INTERACTIONS
====================================================== */

/* ======================================================
   FAQ ACCORDION
====================================================== */

function initialiseAcademyFAQ(){

    academiesDOM.faqButtons
        ?.forEach(button => {

            const answerId =
                button.getAttribute(
                    "aria-controls"
                );

            const answer =
                answerId
                    ? document.getElementById(
                        answerId
                    )
                    : button
                        .closest(
                            ".academy-faq-item"
                        )
                        ?.querySelector(
                            ".academy-faq-answer"
                        );

            if(!answer){

                return;

            }

            const isInitiallyOpen =
                button.getAttribute(
                    "aria-expanded"
                ) === "true";

            answer.toggleAttribute(
                "hidden",
                !isInitiallyOpen
            );

            button.addEventListener(
                "click",
                () => {

                    toggleAcademyFAQItem(
                        button,
                        answer
                    );

                }
            );

        });

}

/* ======================================================
   TOGGLE FAQ ITEM
====================================================== */

function toggleAcademyFAQItem(

    selectedButton,

    selectedAnswer

){

    const isOpen =
        selectedButton.getAttribute(
            "aria-expanded"
        ) === "true";

    academiesDOM.faqButtons
        ?.forEach(button => {

            const answerId =
                button.getAttribute(
                    "aria-controls"
                );

            const answer =
                answerId
                    ? document.getElementById(
                        answerId
                    )
                    : button
                        .closest(
                            ".academy-faq-item"
                        )
                        ?.querySelector(
                            ".academy-faq-answer"
                        );

            button.setAttribute(
                "aria-expanded",
                "false"
            );

            answer?.setAttribute(
                "hidden",
                ""
            );

        });

    if(!isOpen){

        selectedButton.setAttribute(
            "aria-expanded",
            "true"
        );

        selectedAnswer.removeAttribute(
            "hidden"
        );

    }

}

/* ======================================================
   NEWSLETTER FORM
====================================================== */

async function handleAcademyNewsletterSubmit(

    event

){

    event.preventDefault();

    const email =
        academiesDOM.newsletterEmail
            ?.value
            .trim() ||
        "";

    const hasConsent =
        academiesDOM.newsletterConsent
            ?.checked ??
        true;

    clearNewsletterMessage();

    if(!email){

        showNewsletterMessage(
            "Please enter your email address.",
            "error"
        );

        academiesDOM.newsletterEmail
            ?.focus();

        return;

    }

    if(!isValidEmail(email)){

        showNewsletterMessage(
            "Please enter a valid email address.",
            "error"
        );

        academiesDOM.newsletterEmail
            ?.focus();

        return;

    }

    if(!hasConsent){

        showNewsletterMessage(
            "Please accept the consent checkbox to subscribe.",
            "error"
        );

        academiesDOM.newsletterConsent
            ?.focus();

        return;

    }

    const submitButton =
        academiesDOM.newsletterForm
            ?.querySelector(
                'button[type="submit"]'
            );

    setNewsletterLoading(
        submitButton,
        true
    );

    try{

        await academyApiRequest(

            ACADEMIES_API.newsletter,

            {

                method:"POST",

                body:
                    JSON.stringify({

                        email,

                        source:
                            "academies-directory",

                        consent:
                            hasConsent

                    })

            }

        );

        showNewsletterSuccess(email);

    }catch(error){

        console.info(
            "Newsletter API unavailable. Subscription stored locally.",
            error
        );

        storeNewsletterSubscription(
            email
        );

        showNewsletterSuccess(email);

    }finally{

        setNewsletterLoading(
            submitButton,
            false
        );

    }

}

/* ======================================================
   NEWSLETTER SUCCESS
====================================================== */

function showNewsletterSuccess(email){

    showNewsletterMessage(
        `Thank you. Updates will be sent to ${email}.`,
        "success"
    );

    academiesDOM.newsletterForm
        ?.reset();

    showAcademyToast({

        title:"Subscription confirmed",

        message:
            "You have joined the academy updates list.",

        type:"success"

    });

}

/* ======================================================
   NEWSLETTER MESSAGE
====================================================== */

function showNewsletterMessage(

    message,

    type="info"

){

    if(!academiesDOM.newsletterMessage){

        return;

    }

    academiesDOM.newsletterMessage
        .textContent =
            message;

    academiesDOM.newsletterMessage
        .className =
            `academy-newsletter-message ${type}`;

}

function clearNewsletterMessage(){

    if(!academiesDOM.newsletterMessage){

        return;

    }

    academiesDOM.newsletterMessage
        .textContent = "";

    academiesDOM.newsletterMessage
        .className =
            "academy-newsletter-message";

}

/* ======================================================
   NEWSLETTER LOADING STATE
====================================================== */

function setNewsletterLoading(

    button,

    isLoading

){

    if(!button){

        return;

    }

    if(isLoading){

        button.dataset.originalText =
            button.textContent.trim();

        button.textContent =
            "Subscribing...";

    }else{

        button.textContent =
            button.dataset.originalText ||
            "Subscribe";

    }

    button.disabled =
        Boolean(isLoading);

    button.setAttribute(
        "aria-busy",
        String(Boolean(isLoading))
    );

}

/* ======================================================
   LOCAL NEWSLETTER STORAGE
====================================================== */

function storeNewsletterSubscription(

    email

){

    const storageKey =
        "fifaMissionIndiaAcademyNewsletter";

    const existingSubscriptions =
        safelyParseJSON(
            localStorage.getItem(
                storageKey
            ),
            []
        );

    const subscriptions =
        Array.isArray(
            existingSubscriptions
        )
            ? existingSubscriptions
            : [];

    if(
        !subscriptions.includes(email)
    ){

        subscriptions.push(email);

    }

    localStorage.setItem(

        storageKey,

        JSON.stringify(
            subscriptions
        )

    );

}

/* ======================================================
   INITIALISE NEWSLETTER
====================================================== */

function initialiseAcademyNewsletter(){

    academiesDOM.newsletterForm
        ?.addEventListener(
            "submit",
            handleAcademyNewsletterSubmit
        );

    academiesDOM.newsletterEmail
        ?.addEventListener(
            "input",
            clearNewsletterMessage
        );

    academiesDOM.newsletterConsent
        ?.addEventListener(
            "change",
            clearNewsletterMessage
        );

}

/* ======================================================
   AUTH MODAL
====================================================== */

function openAcademyAuthModal({

    title=
        "Sign in required",

    message=
        "Please sign in to save academies and manage your football profile.",

    redirectUrl="login.html"

}={}){

    if(!academiesDOM.authModal){

        window.location.href =
            redirectUrl;

        return;

    }

    const titleElement =
        academiesDOM.authModal
            .querySelector(
                ".academy-auth-modal-title"
            );

    const messageElement =
        academiesDOM.authModal
            .querySelector(
                ".academy-auth-modal-message"
            );

    const primaryLink =
        academiesDOM.authModal
            .querySelector(
                ".academy-auth-modal-primary"
            );

    if(titleElement){

        titleElement.textContent =
            title;

    }

    if(messageElement){

        messageElement.textContent =
            message;

    }

    if(primaryLink){

        primaryLink.href =
            redirectUrl;

    }

    academiesDOM.authModal
        .classList.add("open");

    academiesDOM.authModal
        .setAttribute(
            "aria-hidden",
            "false"
        );

    document.body
        .classList.add(
            "modal-open"
        );

    academiesDOM.authModalClose
        ?.focus();

}

/* ======================================================
   CLOSE AUTH MODAL
====================================================== */

function closeAcademyAuthModal(){

    if(!academiesDOM.authModal){

        return;

    }

    academiesDOM.authModal
        .classList.remove("open");

    academiesDOM.authModal
        .setAttribute(
            "aria-hidden",
            "true"
        );

    document.body
        .classList.remove(
            "modal-open"
        );

}

/* ======================================================
   AUTH MODAL EVENTS
====================================================== */

function initialiseAcademyAuthModal(){

    academiesDOM.authModalClose
        ?.addEventListener(
            "click",
            closeAcademyAuthModal
        );

    academiesDOM.authModalBackdrop
        ?.addEventListener(
            "click",
            closeAcademyAuthModal
        );

    academiesDOM.authModal
        ?.querySelector(
            ".academy-auth-modal-secondary"
        )
        ?.addEventListener(
            "click",
            event => {

                event.preventDefault();

                closeAcademyAuthModal();

            }
        );

}

/* ======================================================
   CTA BUTTONS
====================================================== */

function initialiseAcademyCTAButtons(){

    document.querySelectorAll(
        "[data-academy-register]"
    ).forEach(button => {

        button.addEventListener(
            "click",
            event => {

                const targetUrl =
                    button.getAttribute(
                        "href"
                    ) ||
                    "academy-register.html";

                if(
                    button.dataset
                        .requiresAuth ===
                    "true"
                ){

                    event.preventDefault();

                    openAcademyAuthModal({

                        title:
                            "Register your academy",

                        message:
                            "Sign in or create an account to submit and manage your academy profile.",

                        redirectUrl:
                            `login.html?redirect=${encodeURIComponent(
                                targetUrl
                            )}`

                    });

                }

            }
        );

    });

}

/* ======================================================
   HERO SEARCH
====================================================== */

function initialiseAcademyHeroSearch(){

    const heroForm =
        document.getElementById(
            "academyHeroSearchForm"
        );

    const heroSearchInput =
        document.getElementById(
            "academyHeroSearchInput"
        );

    heroForm?.addEventListener(
        "submit",
        event => {

            event.preventDefault();

            const searchValue =
                heroSearchInput
                    ?.value
                    .trim() ||
                "";

            updateAcademyFilter(
                "search",
                searchValue
            );

            syncFilterControlsFromState();

            applyAcademyDirectoryState();

            scrollToDirectory();

        }
    );

}

/* ======================================================
   DIRECTORY ANCHOR BUTTONS
====================================================== */

function initialiseAcademyDirectoryLinks(){

    document.querySelectorAll(
        '[data-scroll-to-academies]'
    ).forEach(button => {

        button.addEventListener(
            "click",
            event => {

                event.preventDefault();

                scrollToDirectory();

            }
        );

    });

}

/* ======================================================
   CURRENT YEAR
====================================================== */

function updateAcademyFooterYear(){

    document.querySelectorAll(
        "[data-current-year]"
    ).forEach(element => {

        element.textContent =
            String(
                new Date().getFullYear()
            );

    });

}

/* ======================================================
   IMAGE LAZY LOADING
====================================================== */

function enableAcademyImageLazyLoading(){

    document.querySelectorAll(
        "img:not([loading])"
    ).forEach(image => {

        if(
            image.closest(
                ".academies-hero"
            )
        ){

            return;

        }

        image.loading =
            "lazy";

        image.decoding =
            "async";

    });

}

/* ======================================================
   EXTERNAL LINK SECURITY
====================================================== */

function secureAcademyExternalLinks(){

    document.querySelectorAll(
        'a[target="_blank"]'
    ).forEach(link => {

        const relValues =
            new Set(
                (
                    link.getAttribute(
                        "rel"
                    ) ||
                    ""
                )
                    .split(/\s+/)
                    .filter(Boolean)
            );

        relValues.add(
            "noopener"
        );

        relValues.add(
            "noreferrer"
        );

        link.setAttribute(
            "rel",
            Array.from(relValues)
                .join(" ")
        );

    });

}

/* ======================================================
   FINAL INITIALISATION
====================================================== */

document.addEventListener(

    "DOMContentLoaded",

    () => {

        initialiseAcademyFAQ();

        initialiseAcademyNewsletter();

        initialiseAcademyAuthModal();

        initialiseAcademyCTAButtons();

        initialiseAcademyHeroSearch();

        initialiseAcademyDirectoryLinks();

        updateAcademyFooterYear();

        enableAcademyImageLazyLoading();

        secureAcademyExternalLinks();

    }

);

/* ======================================================
   academies.js
   PART 1G
   ACCESSIBILITY, NAVIGATION, SCROLL REVEAL & FINAL POLISH
====================================================== */

/* ======================================================
   ACCESSIBLE FOCUS TRAP
====================================================== */

function trapFocusWithinElement(

    container,

    event

){

    if(
        !container ||
        event.key !== "Tab"
    ){

        return;

    }

    const focusableElements =
        Array.from(
            container.querySelectorAll(
                `
                a[href],
                button:not([disabled]),
                input:not([disabled]),
                select:not([disabled]),
                textarea:not([disabled]),
                [tabindex]:not([tabindex="-1"])
                `
            )
        ).filter(element => {

            return (
                !element.hasAttribute("hidden") &&
                element.offsetParent !== null
            );

        });

    if(
        focusableElements.length === 0
    ){

        return;

    }

    const firstElement =
        focusableElements[0];

    const lastElement =
        focusableElements[
            focusableElements.length - 1
        ];

    if(
        event.shiftKey &&
        document.activeElement ===
            firstElement
    ){

        event.preventDefault();

        lastElement.focus();

        return;

    }

    if(
        !event.shiftKey &&
        document.activeElement ===
            lastElement
    ){

        event.preventDefault();

        firstElement.focus();

    }

}

/* ======================================================
   MODAL AND DRAWER FOCUS MANAGEMENT
====================================================== */

function initialiseAcademyFocusManagement(){

    academiesDOM.authModal
        ?.addEventListener(
            "keydown",
            event => {

                if(
                    academiesDOM.authModal
                        ?.classList
                        .contains("open")
                ){

                    trapFocusWithinElement(
                        academiesDOM.authModal,
                        event
                    );

                }

            }
        );

    academiesDOM.filterDrawer
        ?.addEventListener(
            "keydown",
            event => {

                if(
                    academiesDOM.filterDrawer
                        ?.classList
                        .contains("open")
                ){

                    trapFocusWithinElement(
                        academiesDOM.filterDrawer,
                        event
                    );

                }

            }
        );

}

/* ======================================================
   NAVIGATION SCROLL STATE
====================================================== */

function updateAcademiesNavbarState(){

    const navbar =
        document.querySelector(
            ".academy-page-navbar"
        ) ||
        document.querySelector(
            ".navbar"
        );

    if(!navbar){

        return;

    }

    navbar.classList.toggle(
        "scrolled",
        window.scrollY > 30
    );

}

/* ======================================================
   MOBILE NAVIGATION
====================================================== */

function initialiseAcademiesMobileNavigation(){

    const menuButton =
        document.getElementById(
            "academyMobileMenuButton"
        ) ||
        document.querySelector(
            ".mobile-menu-button"
        );

    const mobileMenu =
        document.getElementById(
            "academyMobileMenu"
        ) ||
        document.querySelector(
            ".mobile-navigation"
        );

    const mobileMenuBackdrop =
        document.getElementById(
            "academyMobileMenuBackdrop"
        );

    const mobileMenuClose =
        document.getElementById(
            "academyMobileMenuClose"
        );

    if(
        !menuButton ||
        !mobileMenu
    ){

        return;

    }

    function openMobileMenu(){

        mobileMenu.classList.add(
            "open"
        );

        mobileMenu.setAttribute(
            "aria-hidden",
            "false"
        );

        menuButton.setAttribute(
            "aria-expanded",
            "true"
        );

        document.body.classList.add(
            "drawer-open"
        );

        mobileMenuClose?.focus();

    }

    function closeMobileMenu(){

        mobileMenu.classList.remove(
            "open"
        );

        mobileMenu.setAttribute(
            "aria-hidden",
            "true"
        );

        menuButton.setAttribute(
            "aria-expanded",
            "false"
        );

        document.body.classList.remove(
            "drawer-open"
        );

        menuButton.focus();

    }

    menuButton.addEventListener(
        "click",
        () => {

            const isOpen =
                mobileMenu.classList
                    .contains("open");

            if(isOpen){

                closeMobileMenu();

            }else{

                openMobileMenu();

            }

        }
    );

    mobileMenuClose
        ?.addEventListener(
            "click",
            closeMobileMenu
        );

    mobileMenuBackdrop
        ?.addEventListener(
            "click",
            closeMobileMenu
        );

    mobileMenu.querySelectorAll(
        "a"
    ).forEach(link => {

        link.addEventListener(
            "click",
            closeMobileMenu
        );

    });

    mobileMenu.addEventListener(
        "keydown",
        event => {

            if(event.key === "Escape"){

                closeMobileMenu();

                return;

            }

            trapFocusWithinElement(
                mobileMenu,
                event
            );

        }
    );

}

/* ======================================================
   SCROLL REVEAL
====================================================== */

function initialiseAcademiesScrollReveal(){

    const revealElements =
        document.querySelectorAll(
            ".reveal"
        );

    if(
        revealElements.length === 0
    ){

        return;

    }

    if(
        !("IntersectionObserver" in window)
    ){

        revealElements.forEach(
            element => {

                element.classList.add(
                    "revealed"
                );

            }
        );

        return;

    }

    const observer =
        new IntersectionObserver(

            entries => {

                entries.forEach(entry => {

                    if(!entry.isIntersecting){

                        return;

                    }

                    entry.target.classList.add(
                        "revealed"
                    );

                    observer.unobserve(
                        entry.target
                    );

                });

            },

            {

                threshold:0.12,

                rootMargin:
                    "0px 0px -40px 0px"

            }

        );

    revealElements.forEach(
        element => {

            observer.observe(element);

        }
    );

}

/* ======================================================
   STAT COUNTER ANIMATION
====================================================== */

function animateAcademyStatistic(

    element

){

    const target =
        Number(
            element.dataset.count ||
            element.textContent
                .replace(/[^\d.]/g,"")
        );

    if(
        !Number.isFinite(target)
    ){

        return;

    }

    const suffix =
        element.dataset.suffix ||
        "";

    const prefix =
        element.dataset.prefix ||
        "";

    const duration =
        Number(
            element.dataset.duration
        ) || 1400;

    const startTime =
        performance.now();

    function updateCounter(

        currentTime

    ){

        const elapsed =
            currentTime -
            startTime;

        const progress =
            Math.min(
                elapsed / duration,
                1
            );

        const easedProgress =
            1 -
            Math.pow(
                1 - progress,
                3
            );

        const currentValue =
            Math.round(
                target *
                easedProgress
            );

        element.textContent =
            `${prefix}${formatNumber(
                currentValue
            )}${suffix}`;

        if(progress < 1){

            window.requestAnimationFrame(
                updateCounter
            );

        }

    }

    window.requestAnimationFrame(
        updateCounter
    );

}

/* ======================================================
   INITIALISE STAT COUNTERS
====================================================== */

function initialiseAcademyStatCounters(){

    const counters =
        document.querySelectorAll(
            "[data-count]"
        );

    if(
        counters.length === 0
    ){

        return;

    }

    if(
        !("IntersectionObserver" in window)
    ){

        counters.forEach(
            animateAcademyStatistic
        );

        return;

    }

    const observer =
        new IntersectionObserver(

            entries => {

                entries.forEach(entry => {

                    if(!entry.isIntersecting){

                        return;

                    }

                    animateAcademyStatistic(
                        entry.target
                    );

                    observer.unobserve(
                        entry.target
                    );

                });

            },

            {

                threshold:0.5

            }

        );

    counters.forEach(
        counter => {

            observer.observe(counter);

        }
    );

}

/* ======================================================
   PROFILE COMPLETION BAR
====================================================== */

function initialiseAcademyProfileProgress(){

    document.querySelectorAll(
        "[data-profile-progress]"
    ).forEach(progressElement => {

        const progress =
            Math.min(
                100,
                Math.max(
                    0,
                    Number(
                        progressElement
                            .dataset
                            .profileProgress
                    ) || 0
                )
            );

        const progressBar =
            progressElement.querySelector(
                ".academy-profile-progress-fill"
            );

        const progressText =
            progressElement.querySelector(
                ".academy-profile-progress-value"
            );

        if(progressBar){

            window.requestAnimationFrame(
                () => {

                    progressBar.style.width =
                        `${progress}%`;

                }
            );

        }

        if(progressText){

            progressText.textContent =
                `${progress}%`;

        }

        progressElement.setAttribute(
            "aria-valuenow",
            String(progress)
        );

    });

}

/* ======================================================
   CARD KEYBOARD SUPPORT
====================================================== */

function initialiseAcademyCardKeyboardSupport(){

    academiesDOM.directoryGrid
        ?.addEventListener(
            "keydown",
            event => {

                const card =
                    event.target.closest(
                        ".academy-directory-card"
                    );

                if(!card){

                    return;

                }

                if(
                    event.key !== "Enter" &&
                    event.key !== " "
                ){

                    return;

                }

                if(
                    event.target.closest(
                        "button, a, input, select"
                    )
                ){

                    return;

                }

                event.preventDefault();

                const profileLink =
                    card.querySelector(
                        ".academy-profile-button"
                    ) ||
                    card.querySelector(
                        ".academy-card-title-link"
                    );

                profileLink?.click();

            }
        );

}

/* ======================================================
   QUERY PARAMETER FILTERS
====================================================== */

function applyAcademyQueryParameters(){

    const parameters =
        new URLSearchParams(
            window.location.search
        );

    const supportedFilters = {

        search:"search",

        state:"state",

        city:"city",

        programme:"programme",

        age:"ageGroup",

        verification:"verification",

        quick:"quickFilter"

    };

    Object.entries(
        supportedFilters
    ).forEach(([parameter,key]) => {

        const value =
            parameters.get(parameter);

        if(value){

            updateAcademyFilter(
                key,
                value
            );

        }

    });

    const sort =
        parameters.get("sort");

    if(sort){

        academiesState.sort =
            sort;

    }

    const view =
        parameters.get("view");

    if(
        view === "grid" ||
        view === "list"
    ){

        academiesState.view =
            view;

    }

}

/* ======================================================
   UPDATE PAGE URL
====================================================== */

function updateAcademyDirectoryURL(){

    const parameters =
        new URLSearchParams();

    const filters =
        academiesState.filters;

    if(filters.search){

        parameters.set(
            "search",
            filters.search
        );

    }

    if(filters.state){

        parameters.set(
            "state",
            filters.state
        );

    }

    if(filters.city){

        parameters.set(
            "city",
            filters.city
        );

    }

    if(filters.programme){

        parameters.set(
            "programme",
            filters.programme
        );

    }

    if(filters.ageGroup){

        parameters.set(
            "age",
            filters.ageGroup
        );

    }

    if(filters.verification){

        parameters.set(
            "verification",
            filters.verification
        );

    }

    if(filters.quickFilter){

        parameters.set(
            "quick",
            filters.quickFilter
        );

    }

    if(
        academiesState.sort !==
        ACADEMIES_CONFIG.defaultSort
    ){

        parameters.set(
            "sort",
            academiesState.sort
        );

    }

    if(
        academiesState.view !==
        ACADEMIES_CONFIG.defaultView
    ){

        parameters.set(
            "view",
            academiesState.view
        );

    }

    const queryString =
        parameters.toString();

    const nextURL =
        queryString
            ? `${window.location.pathname}?${queryString}`
            : window.location.pathname;

    window.history.replaceState(
        null,
        "",
        nextURL
    );

}

/* ======================================================
   PATCH DIRECTORY STATE TO UPDATE URL
====================================================== */

const originalApplyAcademyDirectoryState =
    applyAcademyDirectoryState;

applyAcademyDirectoryState =
    function patchedApplyAcademyDirectoryState(

        options={}

    ){

        originalApplyAcademyDirectoryState(
            options
        );

        updateAcademyDirectoryURL();

    };

/* ======================================================
   NETWORK STATUS
====================================================== */

function initialiseAcademyNetworkStatus(){

    window.addEventListener(
        "offline",
        () => {

            showAcademyToast({

                title:"You are offline",

                message:
                    "Some academy information may not update until your connection returns.",

                type:"warning",

                duration:6000

            });

        }
    );

    window.addEventListener(
        "online",
        () => {

            showAcademyToast({

                title:"Connection restored",

                message:
                    "You are back online.",

                type:"success"

            });

        }
    );

}

/* ======================================================
   GLOBAL ERROR PROTECTION
====================================================== */

function initialiseAcademyErrorProtection(){

    window.addEventListener(
        "unhandledrejection",
        event => {

            console.error(
                "Unhandled academy page request error:",
                event.reason
            );

        }
    );

    window.addEventListener(
        "error",
        event => {

            if(
                event.target instanceof
                HTMLImageElement
            ){

                return;

            }

            console.error(
                "Academy page runtime error:",
                event.error ||
                event.message
            );

        },
        true
    );

}

/* ======================================================
   FINAL APPLICATION START
====================================================== */

document.addEventListener(

    "DOMContentLoaded",

    () => {

        applyAcademyQueryParameters();

        initialiseAcademyFocusManagement();

        initialiseAcademiesMobileNavigation();

        initialiseAcademiesScrollReveal();

        initialiseAcademyStatCounters();

        initialiseAcademyProfileProgress();

        initialiseAcademyCardKeyboardSupport();

        initialiseAcademyNetworkStatus();

        initialiseAcademyErrorProtection();

        updateAcademiesNavbarState();

        window.addEventListener(
            "scroll",
            debounce(
                updateAcademiesNavbarState,
                60
            ),
            {
                passive:true
            }
        );

    }

);

/* ======================================================
   PUBLIC FRONTEND INTEGRATION HOOKS
====================================================== */

window.FIFAMissionAcademies = {

    reload(){

        return loadAcademies({

            useFallback:true

        });

    },

    filter(filterName,value){

        updateAcademyFilter(
            filterName,
            value
        );

        syncFilterControlsFromState();

        applyAcademyDirectoryState();

    },

    resetFilters(){

        resetAllAcademyFilters();

    },

    getState(){

        return {

            ...academiesState,

            savedAcademies:
                Array.from(
                    academiesState
                        .savedAcademies
                )

        };

    },

    showToast:
        showAcademyToast,

    openAuthModal:
        openAcademyAuthModal,

    closeAuthModal:
        closeAcademyAuthModal

};

/* ======================================================
   PAGE LOADER
====================================================== */

function hideAcademiesPageLoader() {

    const pageLoader =
        document.getElementById("pageLoader");

    if (!pageLoader) {
        return;
    }

    pageLoader.classList.add("page-loader-hidden");

    window.setTimeout(() => {
        pageLoader.hidden = true;
    }, 400);
}

if (document.readyState === "complete") {

    hideAcademiesPageLoader();

} else {

    window.addEventListener(
        "load",
        hideAcademiesPageLoader
    );

}

/* Safety fallback */
window.setTimeout(
    hideAcademiesPageLoader,
    3000
);