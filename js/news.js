"use strict";

/* ======================================================
   FIFA MISSION INDIA
   FOOTBALL NEWS PAGE
====================================================== */


/* ======================================================
   DOM REFERENCES
====================================================== */

const loader =
document.getElementById("newsPageLoader");

const main =
document.getElementById("newsMain");

const navbar =
document.getElementById("newsNavbar");

const menuToggle =
document.getElementById("newsMenuToggle");

const mobileMenu =
document.getElementById("newsMobileMenu");

const mobileOverlay =
document.getElementById("newsMobileOverlay");

const mobileMenuClose =
document.getElementById("newsMobileMenuClose");

const featuredArticle =
document.getElementById("newsFeaturedArticle");

const newsGrid =
document.getElementById("newsAllGrid");

const searchInput =
document.getElementById("newsSearchInput");

const clearSearchButton =
document.getElementById("newsClearSearch");

const filterBar =
document.getElementById("newsFilterBar");

const sortSelect =
document.getElementById("newsSortSelect");

const resultsText =
document.getElementById("newsResultsText");

const emptyState =
document.getElementById("newsEmptyState");

const resetFiltersButton =
document.getElementById("newsResetFilters");

const loadMoreWrapper =
document.getElementById("newsLoadMoreWrapper");

const loadMoreButton =
document.getElementById("newsLoadMoreButton");

const totalArticles =
document.getElementById("newsTotalArticles");

const newsletterForm =
document.getElementById("newsNewsletterForm");

const newsletterEmail =
document.getElementById("newsNewsletterEmail");

const toast =
document.getElementById("newsToast");

const toastIcon =
document.getElementById("newsToastIcon");

const toastMessage =
document.getElementById("newsToastMessage");


/* ======================================================
   NEWS DATABASE
====================================================== */

const newsDatabase = [

    {
        id:"national-football-community",

        title:
        "Building a National Football Community for India's 2034 Dream",

        category:
        "Mission Update",

        date:
        "15 July 2026",

        dateValue:
        "2026-07-15",

        readTime:
        "5 min read",

        image:
        "images/news/news-community.jpg",

        summary:
        "Mission FIFA 2034 aims to connect players, academies, coaches, scouts and supporters through one powerful national development platform.",

        featured:
        true
    },


    {
        id:"grassroots-development",

        title:
        "Why Grassroots Development Matters for Indian Football",

        category:
        "Grassroots",

        date:
        "12 July 2026",

        dateValue:
        "2026-07-12",

        readTime:
        "3 min read",

        image:
        "images/news/news-grassroots.jpg",

        summary:
        "Strong academies, trained coaches and regular competition can create better pathways for talented young footballers.",

        featured:
        false
    },


    {
        id:"supporters-movement",

        title:
        "Supporters Across India Join the Football Mission",

        category:
        "Community",

        date:
        "10 July 2026",

        dateValue:
        "2026-07-10",

        readTime:
        "4 min read",

        image:
        "images/news/news-supporters.jpg",

        summary:
        "Football fans and volunteers are coming together to support a shared vision for the future of Indian football.",

        featured:
        false
    },


    {
        id:"academy-development-network",

        title:
        "Football Academies Join a National Development Network",

        category:
        "Academies",

        date:
        "8 July 2026",

        dateValue:
        "2026-07-08",

        readTime:
        "4 min read",

        image:
        "images/news/news-academies.jpg",

        summary:
        "Academies across India can use a shared platform to publish programs, trials, facilities and player-development opportunities.",

        featured:
        false
    },


    {
        id:"young-player-pathway",

        title:
        "Creating Better Pathways for India's Young Football Players",

        category:
        "Players",

        date:
        "6 July 2026",

        dateValue:
        "2026-07-06",

        readTime:
        "5 min read",

        image:
        "images/news/news-players.jpg",

        summary:
        "Player profiles, verified trials and structured development records can help talented footballers receive greater visibility.",

        featured:
        false
    },


    {
        id:"national-trials-calendar",

        title:
        "A National Football Trials Calendar Can Connect More Talent",

        category:
        "Events",

        date:
        "4 July 2026",

        dateValue:
        "2026-07-04",

        readTime:
        "3 min read",

        image:
        "images/news/news-trials.jpg",

        summary:
        "A central trials calendar can make verified football opportunities easier for players and families to discover.",

        featured:
        false
    },


    {
        id:"coach-education",

        title:
        "Why Coach Education Must Remain Central to Player Development",

        category:
        "Grassroots",

        date:
        "2 July 2026",

        dateValue:
        "2026-07-02",

        readTime:
        "4 min read",

        image:
        "images/news/news-coaches.jpg",

        summary:
        "Qualified coaches create better learning environments and guide young footballers through every stage of development.",

        featured:
        false
    },


    {
        id:"academy-trial-standards",

        title:
        "Building Safer and More Transparent Academy Trial Standards",

        category:
        "Academies",

        date:
        "30 June 2026",

        dateValue:
        "2026-06-30",

        readTime:
        "4 min read",

        image:
        "images/news/news-academy-trials.jpg",

        summary:
        "Verified trial information can improve trust and protect players and families from unclear or misleading opportunities.",

        featured:
        false
    },


    {
        id:"player-performance-records",

        title:
        "Digital Performance Records Can Support Young Footballers",

        category:
        "Players",

        date:
        "27 June 2026",

        dateValue:
        "2026-06-27",

        readTime:
        "5 min read",

        image:
        "images/news/news-performance.jpg",

        summary:
        "Structured technical, physical and match records can help players understand progress and support better evaluation.",

        featured:
        false
    },


    {
        id:"community-volunteers",

        title:
        "Volunteers Can Strengthen Local Football Communities",

        category:
        "Community",

        date:
        "24 June 2026",

        dateValue:
        "2026-06-24",

        readTime:
        "3 min read",

        image:
        "images/news/news-volunteers.jpg",

        summary:
        "Community volunteers can support tournaments, youth programs, awareness campaigns and football events across India.",

        featured:
        false
    },


    {
        id:"youth-football-festival",

        title:
        "Youth Football Festival Planned to Celebrate Emerging Talent",

        category:
        "Events",

        date:
        "20 June 2026",

        dateValue:
        "2026-06-20",

        readTime:
        "3 min read",

        image:
        "images/news/news-festival.jpg",

        summary:
        "A youth football festival can bring players, academies, families and supporters together through competition and celebration.",

        featured:
        false
    },


    {
        id:"mission-platform-progress",

        title:
        "Mission FIFA 2034 Digital Platform Development Moves Forward",

        category:
        "Mission Update",

        date:
        "17 June 2026",

        dateValue:
        "2026-06-17",

        readTime:
        "4 min read",

        image:
        "images/news/news-platform.jpg",

        summary:
        "The platform is being developed to support players, coaches, academies, scouts and supporters through connected digital tools.",

        featured:
        false
    }

];


/* ======================================================
   PAGE STATE
====================================================== */

let activeCategory =
"all";

let searchQuery =
"";

let sortMode =
"latest";

let visibleCount =
6;

const loadIncrement =
3;


/* ======================================================
   ELEMENT HELPERS
====================================================== */

function getElement(id){

    return document.getElementById(id);

}


/* ======================================================
   HTML ESCAPING
====================================================== */

function escapeHTML(value){

    return String(value ?? "")
    .replace(/&/g,"&amp;")
    .replace(/</g,"&lt;")
    .replace(/>/g,"&gt;")
    .replace(/"/g,"&quot;")
    .replace(/'/g,"&#039;");

}


function escapeAttribute(value){

    return escapeHTML(value);

}


/* ======================================================
   IMAGE FALLBACK
====================================================== */

function attachImageFallback(image){

    if(!image){
        return;
    }


    image.addEventListener(
        "error",
        () => {

            if(
                image.dataset.fallbackApplied ===
                "true"
            ){
                return;
            }


            image.dataset.fallbackApplied =
            "true";


            image.src =
            "images/news/default-news.jpg";

        }
    );

}


/* ======================================================
   RENDER FEATURED ARTICLE
====================================================== */

function renderFeaturedArticle(){

    if(!featuredArticle){
        return;
    }


    const featured =
    newsDatabase.find(item => item.featured) ||
    newsDatabase[0];


    if(!featured){

        featuredArticle.innerHTML = `
            <div class="news-empty-state">
                <h3>No featured story available.</h3>
            </div>
        `;

        return;
    }


    featuredArticle.innerHTML = `
        <div class="news-featured-image">

            <img
                src="${escapeAttribute(featured.image)}"
                alt="${escapeAttribute(featured.title)}"
            >

            <span class="news-featured-category">
                ${escapeHTML(featured.category)}
            </span>

        </div>


        <div class="news-featured-content">

            <div class="news-featured-meta">

                <span>
                    <i class="fa-regular fa-calendar"></i>
                    ${escapeHTML(featured.date)}
                </span>

                <span>
                    <i class="fa-regular fa-clock"></i>
                    ${escapeHTML(featured.readTime)}
                </span>

            </div>


            <h3>
                ${escapeHTML(featured.title)}
            </h3>


            <p>
                ${escapeHTML(featured.summary)}
            </p>


            <a
                href="news-details.html?article=${encodeURIComponent(
                    featured.id
                )}"
                class="news-featured-link"
            >
                Read Featured Story

                <i class="fa-solid fa-arrow-right"></i>
            </a>

        </div>
    `;


    attachImageFallback(
        featuredArticle.querySelector("img")
    );

}


/* ======================================================
   FILTER AND SORT NEWS
====================================================== */

function getFilteredNews(){

    const normalizedSearch =
    searchQuery.toLowerCase();


    let filteredNews =
    newsDatabase.filter(article => {

        const matchesCategory =

        activeCategory === "all" ||
        article.category === activeCategory;


        const searchableText =

        `${article.title}
         ${article.summary}
         ${article.category}`
        .toLowerCase();


        const matchesSearch =

        normalizedSearch === "" ||
        searchableText.includes(
            normalizedSearch
        );


        return (
            matchesCategory &&
            matchesSearch
        );

    });


    filteredNews =
    [...filteredNews];


    if(sortMode === "latest"){

        filteredNews.sort(
            (a,b) =>
            new Date(b.dateValue) -
            new Date(a.dateValue)
        );

    }


    if(sortMode === "oldest"){

        filteredNews.sort(
            (a,b) =>
            new Date(a.dateValue) -
            new Date(b.dateValue)
        );

    }


    if(sortMode === "title"){

        filteredNews.sort(
            (a,b) =>
            a.title.localeCompare(
                b.title
            )
        );

    }


    return filteredNews;

}


/* ======================================================
   CREATE NEWS CARD
====================================================== */

function createNewsCard(article){

    const card =
    document.createElement("article");


    card.className =
    "news-page-card";


    const articleUrl =
    `news-details.html?article=${encodeURIComponent(
        article.id
    )}`;


    card.innerHTML = `
        <a
            href="${articleUrl}"
            class="news-page-card-image"
            aria-label="${escapeAttribute(
                `Read ${article.title}`
            )}"
        >

            <img
                src="${escapeAttribute(article.image)}"
                alt="${escapeAttribute(article.title)}"
                loading="lazy"
            >

            <span class="news-page-card-category">
                ${escapeHTML(article.category)}
            </span>

        </a>


        <div class="news-page-card-content">

            <div class="news-page-card-meta">

                <span>
                    <i class="fa-regular fa-calendar"></i>
                    ${escapeHTML(article.date)}
                </span>

                <span>
                    <i class="fa-regular fa-clock"></i>
                    ${escapeHTML(article.readTime)}
                </span>

            </div>


            <h3>

                <a href="${articleUrl}">
                    ${escapeHTML(article.title)}
                </a>

            </h3>


            <p>
                ${escapeHTML(article.summary)}
            </p>


            <a
                href="${articleUrl}"
                class="news-page-card-link"
            >

                Read Full Story

                <i class="fa-solid fa-arrow-right"></i>

            </a>

        </div>
    `;


    attachImageFallback(
        card.querySelector("img")
    );


    return card;

}


/* ======================================================
   RENDER NEWS GRID
====================================================== */

function renderNewsGrid(){

    if(!newsGrid){
        return;
    }


    const filteredNews =
    getFilteredNews();


    const visibleNews =
    filteredNews.slice(
        0,
        visibleCount
    );


    newsGrid.innerHTML = "";


    visibleNews.forEach(article => {

        newsGrid.appendChild(
            createNewsCard(article)
        );

    });


    updateResultsInformation(
        filteredNews.length
    );


    updateEmptyState(
        filteredNews.length
    );


    updateLoadMoreButton(
        filteredNews.length
    );

}


/* ======================================================
   RESULTS INFORMATION
====================================================== */

function updateResultsInformation(total){

    if(!resultsText){
        return;
    }


    if(total === 0){

        resultsText.textContent =
        "No football stories found";

        return;

    }


    const categoryText =

    activeCategory === "all"
        ? "all categories"
        : activeCategory;


    if(searchQuery){

        resultsText.textContent =
        `Found ${total} ${
            total === 1
                ? "story"
                : "stories"
        } matching "${searchQuery}" in ${categoryText}`;

        return;

    }


    resultsText.textContent =
    `Showing ${Math.min(
        visibleCount,
        total
    )} of ${total} football ${
        total === 1
            ? "story"
            : "stories"
    }`;

}


/* ======================================================
   EMPTY STATE
====================================================== */

function updateEmptyState(total){

    if(!emptyState){
        return;
    }


    emptyState.hidden =
    total !== 0;


    if(newsGrid){

        newsGrid.hidden =
        total === 0;

    }

}


/* ======================================================
   LOAD MORE STATE
====================================================== */

function updateLoadMoreButton(total){

    if(!loadMoreWrapper){
        return;
    }


    loadMoreWrapper.hidden =
    total === 0 ||
    visibleCount >= total;

}


/* ======================================================
   ACTIVE FILTER BUTTON
====================================================== */

function updateActiveFilterButton(){

    filterBar
    ?.querySelectorAll(
        ".news-filter-button"
    )
    .forEach(button => {

        button.classList.toggle(
            "active",
            button.dataset.category ===
            activeCategory
        );

    });

}


/* ======================================================
   SET CATEGORY
====================================================== */

function setCategory(category){

    activeCategory =
    category || "all";


    visibleCount =
    6;


    updateActiveFilterButton();

    renderNewsGrid();


    getElement("latestStories")
    ?.scrollIntoView({
        behavior:"smooth",
        block:"start"
    });

}


/* ======================================================
   INITIALIZE FILTER BUTTONS
====================================================== */

function initializeFilters(){

    filterBar
    ?.querySelectorAll(
        ".news-filter-button"
    )
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                setCategory(
                    button.dataset.category ||
                    "all"
                );

            }
        );

    });


    document
    .querySelectorAll(
        ".news-category-card"
    )
    .forEach(card => {

        card.addEventListener(
            "click",
            () => {

                setCategory(
                    card.dataset.categoryTarget ||
                    "all"
                );

            }
        );

    });

}


/* ======================================================
   SEARCH
====================================================== */

function initializeSearch(){

    searchInput?.addEventListener(
        "input",
        event => {

            searchQuery =
            event.target.value.trim();


            visibleCount =
            6;


            if(clearSearchButton){

                clearSearchButton.hidden =
                searchQuery === "";

            }


            renderNewsGrid();

        }
    );


    clearSearchButton?.addEventListener(
        "click",
        () => {

            if(searchInput){

                searchInput.value =
                "";

                searchInput.focus();

            }


            searchQuery =
            "";


            clearSearchButton.hidden =
            true;


            visibleCount =
            6;


            renderNewsGrid();

        }
    );

}


/* ======================================================
   SORTING
====================================================== */

function initializeSorting(){

    sortSelect?.addEventListener(
        "change",
        event => {

            sortMode =
            event.target.value;


            visibleCount =
            6;


            renderNewsGrid();

        }
    );

}


/* ======================================================
   LOAD MORE
====================================================== */

function initializeLoadMore(){

    loadMoreButton?.addEventListener(
        "click",
        () => {

            visibleCount +=
            loadIncrement;


            renderNewsGrid();

        }
    );

}


/* ======================================================
   RESET FILTERS
====================================================== */

function resetFilters(){

    activeCategory =
    "all";

    searchQuery =
    "";

    sortMode =
    "latest";

    visibleCount =
    6;


    if(searchInput){

        searchInput.value =
        "";

    }


    if(clearSearchButton){

        clearSearchButton.hidden =
        true;

    }


    if(sortSelect){

        sortSelect.value =
        "latest";

    }


    updateActiveFilterButton();

    renderNewsGrid();

}


function initializeResetFilters(){

    resetFiltersButton?.addEventListener(
        "click",
        resetFilters
    );

}


/* ======================================================
   NAVBAR SCROLL STATE
====================================================== */

function initializeNavbar(){

    if(!navbar){
        return;
    }


    const updateNavbar = () => {

        navbar.classList.toggle(
            "scrolled",
            window.scrollY > 20
        );

    };


    updateNavbar();


    window.addEventListener(
        "scroll",
        updateNavbar,
        {
            passive:true
        }
    );

}


/* ======================================================
   MOBILE MENU
====================================================== */

function openMobileMenu(){

    if(
        !mobileMenu ||
        !mobileOverlay ||
        !menuToggle
    ){
        return;
    }


    mobileMenu.hidden =
    false;


    mobileOverlay.hidden =
    false;


    menuToggle.setAttribute(
        "aria-expanded",
        "true"
    );


    document.body.style.overflow =
    "hidden";


    mobileMenu
    .querySelector("a, button")
    ?.focus();

}


function closeMobileMenu(){

    if(
        !mobileMenu ||
        !mobileOverlay ||
        !menuToggle
    ){
        return;
    }


    mobileMenu.hidden =
    true;


    mobileOverlay.hidden =
    true;


    menuToggle.setAttribute(
        "aria-expanded",
        "false"
    );


    document.body.style.overflow =
    "";

}


function initializeMobileMenu(){

    menuToggle?.addEventListener(
        "click",
        () => {

            if(mobileMenu?.hidden){

                openMobileMenu();

            }else{

                closeMobileMenu();

            }

        }
    );


    mobileMenuClose?.addEventListener(
        "click",
        closeMobileMenu
    );


    mobileOverlay?.addEventListener(
        "click",
        closeMobileMenu
    );


    mobileMenu
    ?.querySelectorAll("a")
    .forEach(link => {

        link.addEventListener(
            "click",
            closeMobileMenu
        );

    });


    window.addEventListener(
        "resize",
        () => {

            if(window.innerWidth > 1150){

                closeMobileMenu();

            }

        }
    );

}


/* ======================================================
   NEWSLETTER
====================================================== */

function isValidEmail(email){

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    .test(email);

}


async function handleNewsletterSubmission(event){

    event.preventDefault();


    const email =
    newsletterEmail?.value.trim() || "";


    if(!isValidEmail(email)){

        showToast(
            "Please enter a valid email address.",
            "error"
        );


        newsletterEmail?.focus();

        return;

    }


    const submitButton =
    newsletterForm
    ?.querySelector(
        'button[type="submit"]'
    );


    const originalContent =
    submitButton?.innerHTML;


    if(submitButton){

        submitButton.disabled =
        true;


        submitButton.innerHTML = `
            <i class="fa-solid fa-spinner fa-spin"></i>
            Subscribing...
        `;

    }


    const subscriptionPayload = {

        email:
        email,

        source:
        "news-page",

        subscribedAt:
        new Date().toISOString()

    };


    try{

        /*
        ==================================================
        BACKEND INTEGRATION PLACEHOLDER FOR MR. HARSH

        Replace the frontend simulation with:

        const response = await fetch(
            "/api/v1/newsletter/subscribe",
            {
                method:"POST",
                headers:{
                    "Content-Type":"application/json"
                },
                body:JSON.stringify(subscriptionPayload)
            }
        );

        if(!response.ok){
            throw new Error("Subscription failed.");
        }
        ==================================================
        */


        await new Promise(resolve => {

            window.setTimeout(
                resolve,
                800
            );

        });


        console.info(
            "Newsletter subscription:",
            subscriptionPayload
        );


        newsletterForm?.reset();


        showToast(
            "You are now subscribed to football news.",
            "success"
        );

    }catch(error){

        console.error(
            "Newsletter error:",
            error
        );


        showToast(
            "Unable to subscribe. Please try again.",
            "error"
        );

    }finally{

        if(submitButton){

            submitButton.disabled =
            false;


            submitButton.innerHTML =
            originalContent || `
                Subscribe
                <i class="fa-solid fa-arrow-right"></i>
            `;

        }

    }

}


/* ======================================================
   TOAST NOTIFICATION
====================================================== */

let toastTimeout =
null;


function showToast(message,type = "success"){

    if(
        !toast ||
        !toastIcon ||
        !toastMessage
    ){
        return;
    }


    const iconMap = {

        success:
        "fa-solid fa-circle-check",

        error:
        "fa-solid fa-circle-exclamation",

        info:
        "fa-solid fa-circle-info"

    };


    toastMessage.textContent =
    message;


    toastIcon.className =
    iconMap[type] ||
    iconMap.success;


    toast.dataset.type =
    type;


    toast.hidden =
    false;


    if(toastTimeout){

        window.clearTimeout(
            toastTimeout
        );

    }


    toastTimeout =
    window.setTimeout(
        () => {

            toast.hidden =
            true;

        },
        3500
    );

}


/* ======================================================
   KEYBOARD EVENTS
====================================================== */

function initializeKeyboardEvents(){

    document.addEventListener(
        "keydown",
        event => {

            if(event.key !== "Escape"){
                return;
            }


            if(
                mobileMenu &&
                !mobileMenu.hidden
            ){

                closeMobileMenu();

            }

        }
    );

}


/* ======================================================
   RESET PAGE STATE
====================================================== */

function resetPageState(){

    if(mobileMenu){

        mobileMenu.hidden =
        true;

    }


    if(mobileOverlay){

        mobileOverlay.hidden =
        true;

    }


    if(toast){

        toast.hidden =
        true;

    }


    document.body.style.overflow =
    "";

}


/* ======================================================
   SHOW PAGE
====================================================== */

function showPage(){

    if(main){

        main.hidden =
        false;

    }

}


/* ======================================================
   HIDE LOADER
====================================================== */

function hideLoader(){

    if(!loader){
        return;
    }


    loader.style.opacity =
    "0";


    loader.style.visibility =
    "hidden";


    loader.style.pointerEvents =
    "none";


    window.setTimeout(
        () => {

            loader.hidden =
            true;


            loader.style.display =
            "none";

        },
        350
    );

}


/* ======================================================
   INITIALIZE APPLICATION
====================================================== */

function initializeNewsPage(){

    resetPageState();


    initializeNavbar();

    initializeMobileMenu();

    initializeFilters();

    initializeSearch();

    initializeSorting();

    initializeLoadMore();

    initializeResetFilters();

    initializeKeyboardEvents();


    newsletterForm?.addEventListener(
        "submit",
        handleNewsletterSubmission
    );


    if(totalArticles){

        totalArticles.textContent =
        String(newsDatabase.length);

    }


    renderFeaturedArticle();

    renderNewsGrid();

    showPage();

    hideLoader();

}


/* ======================================================
   START APPLICATION
====================================================== */

if(document.readyState === "loading"){

    document.addEventListener(
        "DOMContentLoaded",
        initializeNewsPage
    );

}else{

    initializeNewsPage();

}