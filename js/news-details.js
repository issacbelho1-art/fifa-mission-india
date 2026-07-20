"use strict";

/* ======================================================
   FIFA MISSION INDIA
   NEWS DETAILS PAGE
====================================================== */


/* ======================================================
   DOM REFERENCES
====================================================== */

const loader =
document.getElementById("newsDetailsLoader");

const main =
document.getElementById("newsDetailsMain");

const notFound =
document.getElementById("newsArticleNotFound");

const navbar =
document.getElementById("newsDetailsNavbar");

const menuToggle =
document.getElementById("newsMenuToggle");

const mobileMenu =
document.getElementById("newsMobileMenu");

const mobileOverlay =
document.getElementById("newsMobileOverlay");

const mobileMenuClose =
document.getElementById("newsMobileMenuClose");

const navbarShareButton =
document.getElementById("newsNavbarShareButton");

const copyLinkButton =
document.getElementById("newsCopyLinkButton");

const whatsAppShare =
document.getElementById("newsWhatsAppShare");

const facebookShare =
document.getElementById("newsFacebookShare");

const twitterShare =
document.getElementById("newsTwitterShare");

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
   URL ARTICLE PARAMETER
====================================================== */

const articleSlug =
new URLSearchParams(window.location.search)
.get("article") || "national-football-community";


/* ======================================================
   NEWS DATABASE
====================================================== */

const newsDatabase = {

    "national-football-community":{

        id:"national-football-community",

        title:
        "Building a National Football Community for India's 2034 Dream",

        category:
        "Mission Update",

        featured:
        true,

        date:
        "15 July 2026",

        readTime:
        "5 min read",

        author:
        "FIFA Mission India",

        image:
        "images/news/news-community.jpg",

        summary:
        "Mission FIFA 2034 aims to unite football players, academies, coaches, scouts and supporters through one national development platform.",

        highlight:
        "India’s football dream will become stronger when every player, academy, coach and supporter becomes part of one shared national mission.",

        content:`

            <p class="news-article-introduction">
                Indian football has talent, passion and millions of supporters.
                What it needs is a connected national ecosystem that allows
                players, academies, coaches, scouts and communities to work
                toward one shared vision.
            </p>

            <p>
                Mission FIFA 2034 is being developed as a national football
                movement focused on creating stronger pathways for young
                players and bringing every important part of the football
                ecosystem onto one platform.
            </p>


            <h2>
                One Mission, One Football Community
            </h2>

            <p>
                Football development cannot depend on players alone. Strong
                progress requires academies that provide professional training,
                coaches who understand long-term development, scouts who can
                identify talent and supporters who continue to strengthen the
                movement.
            </p>

            <p>
                By connecting these groups, the platform can make football
                opportunities easier to discover and help talented players
                receive the visibility they deserve.
            </p>


            <figure class="news-article-image">

                <img
                    src="images/news/news-community.jpg"
                    alt="Young Indian football players training together"
                    loading="lazy"
                >

                <figcaption>
                    Young footballers represent the future of India's national
                    football development mission.
                </figcaption>

            </figure>


            <h2>
                Creating Better Player Pathways
            </h2>

            <p>
                One of the biggest challenges in football development is the
                gap between local talent and professional opportunities.
                Players may have ability, but many do not know where to find
                trials, verified academies, coaches or scouting opportunities.
            </p>

            <p>
                Mission FIFA 2034 aims to reduce that gap through structured
                player profiles, academy discovery, trial information,
                performance records and transparent development pathways.
            </p>

            <ul>

                <li>
                    Player profiles highlighting skills, achievements and
                    development history.
                </li>

                <li>
                    Verified academy pages with programs, facilities, coaches
                    and trial information.
                </li>

                <li>
                    Coach and scout portals supporting player evaluation and
                    talent identification.
                </li>

                <li>
                    Football events, competitions and national development
                    updates.
                </li>

            </ul>


            <blockquote>
                A stronger football nation begins when talent can be discovered,
                supported and developed regardless of location or background.
            </blockquote>


            <h2>
                The Role of Academies and Coaches
            </h2>

            <p>
                Academies form the foundation of long-term player development.
                They provide structured training environments where young
                footballers can improve technically, tactically, physically
                and mentally.
            </p>

            <p>
                Coaches are equally important. They guide players through each
                stage of development and help them understand discipline,
                teamwork, decision-making and professional standards.
            </p>


            <h2>
                Bringing Supporters Into the Mission
            </h2>

            <p>
                Football supporters are not simply spectators. They create
                energy, visibility and momentum for the sport. A national
                football movement becomes stronger when supporters contribute
                through volunteering, awareness, events and community
                participation.
            </p>

            <p>
                Mission FIFA 2034 therefore includes supporters as an important
                part of the development journey.
            </p>


            <h2>
                Looking Toward 2034
            </h2>

            <p>
                Reaching the highest level of international football requires a
                long-term commitment. It requires better grassroots programs,
                stronger academies, qualified coaches, regular competition,
                reliable scouting and a united national community.
            </p>

            <p>
                The journey toward 2034 begins by building these systems today.
                Every player developed, every coach trained and every academy
                strengthened moves Indian football one step forward.
            </p>

        `

    },


    "grassroots-development":{

        id:"grassroots-development",

        title:
        "Why Grassroots Development Matters for Indian Football",

        category:
        "Grassroots",

        featured:
        false,

        date:
        "12 July 2026",

        readTime:
        "3 min read",

        author:
        "FIFA Mission India",

        image:
        "images/news/news-grassroots.jpg",

        summary:
        "Strong academies, trained coaches and regular competition can create better pathways for talented young footballers.",

        highlight:
        "Grassroots football is where confidence, discipline, creativity and the love of the game are first developed.",

        content:`

            <p class="news-article-introduction">
                The future of Indian football depends on what happens at the
                grassroots level today. Young players need safe environments,
                trained coaches, regular competition and opportunities to
                develop without unnecessary pressure.
            </p>

            <p>
                Grassroots football creates the first connection between a
                child and the sport. It is where players learn movement,
                coordination, teamwork and confidence.
            </p>


            <h2>
                Development Must Begin Early
            </h2>

            <p>
                Young players benefit from age-appropriate coaching that allows
                them to learn through play. At the earliest stages, development
                should focus on enjoyment, ball control, movement and
                creativity.
            </p>

            <p>
                Winning should not become more important than learning. When
                young players receive the right environment, they are more
                likely to stay involved in football and reach their potential.
            </p>


            <figure class="news-article-image">

                <img
                    src="images/news/news-grassroots.jpg"
                    alt="Football coach training young academy players"
                    loading="lazy"
                >

                <figcaption>
                    Qualified coaches help young players develop strong
                    technical and personal foundations.
                </figcaption>

            </figure>


            <h2>
                Qualified Coaches Make the Difference
            </h2>

            <p>
                Grassroots coaches influence how young players understand the
                game. Coaches must know how to communicate positively, design
                suitable sessions and support different levels of ability.
            </p>

            <p>
                Coach education should therefore remain a central part of every
                serious football development program.
            </p>


            <h2>
                Regular Competition Creates Confidence
            </h2>

            <p>
                Training is important, but players also need meaningful
                matches. Regular competition allows young footballers to apply
                their skills, solve problems and become comfortable under
                pressure.
            </p>

            <ul>

                <li>
                    Local school and community leagues.
                </li>

                <li>
                    Academy development tournaments.
                </li>

                <li>
                    Age-group competitions with proper safeguarding.
                </li>

                <li>
                    Regional talent identification events.
                </li>

            </ul>


            <blockquote>
                Grassroots development is not only about finding the best
                players. It is about giving every young footballer the chance to
                learn, play and improve.
            </blockquote>


            <h2>
                Building Sustainable Football Communities
            </h2>

            <p>
                Grassroots programs become stronger when schools, academies,
                families, local authorities and supporters work together.
                Facilities, equipment and trained volunteers can create lasting
                football opportunities within communities.
            </p>

            <p>
                A strong national football system must grow from thousands of
                healthy local football environments.
            </p>

        `

    },


    "supporters-movement":{

        id:"supporters-movement",

        title:
        "Supporters Across India Join the Football Mission",

        category:
        "Community",

        featured:
        false,

        date:
        "10 July 2026",

        readTime:
        "4 min read",

        author:
        "FIFA Mission India",

        image:
        "images/news/news-supporters.jpg",

        summary:
        "Football fans and volunteers are coming together to support a shared vision for the future of Indian football.",

        highlight:
        "A football movement becomes powerful when supporters from every region believe that progress is possible.",

        content:`

            <p class="news-article-introduction">
                Football supporters across India are becoming an important
                part of the Mission FIFA 2034 movement. Their passion, voices
                and participation can help football reach more communities and
                inspire the next generation.
            </p>

            <p>
                A national football mission cannot be built only by
                institutions. It must also belong to the people who watch,
                celebrate, volunteer and continue believing in Indian
                football.
            </p>


            <h2>
                Supporters Give Football Its Energy
            </h2>

            <p>
                Stadium atmospheres, local tournaments, school matches and
                community events all become stronger when supporters actively
                participate.
            </p>

            <p>
                Their encouragement helps young players feel that their effort
                matters and that football can become a meaningful pathway.
            </p>


            <figure class="news-article-image">

                <img
                    src="images/news/news-supporters.jpg"
                    alt="Indian football supporters celebrating in a stadium"
                    loading="lazy"
                >

                <figcaption>
                    Supporters can help Indian football grow through
                    participation, awareness and community action.
                </figcaption>

            </figure>


            <h2>
                More Than Watching Matches
            </h2>

            <p>
                Supporters can contribute to football development in many
                practical ways. They can promote local events, volunteer at
                youth competitions, support academies and help important
                football stories reach wider audiences.
            </p>

            <ul>

                <li>
                    Sharing verified trial and academy opportunities.
                </li>

                <li>
                    Supporting local football events and competitions.
                </li>

                <li>
                    Encouraging young players and their families.
                </li>

                <li>
                    Promoting positive and respectful football culture.
                </li>

            </ul>


            <blockquote>
                Supporters are the bridge between football development and the
                wider community.
            </blockquote>


            <h2>
                Building a National Identity
            </h2>

            <p>
                Indian football includes many regions, languages and
                communities. A shared national mission can bring these
                different football cultures together without losing their local
                identity.
            </p>

            <p>
                When supporters across the country unite around player
                development and long-term progress, the movement gains greater
                strength and visibility.
            </p>


            <h2>
                Every Supporter Has a Role
            </h2>

            <p>
                Some supporters may contribute through volunteering, others
                through digital promotion, event participation or local
                football initiatives. Every positive contribution can help the
                sport grow.
            </p>

            <p>
                Mission FIFA 2034 welcomes supporters who believe in building a
                stronger future for Indian football.
            </p>

        `

    }

};


/* ======================================================
   CURRENT ARTICLE
====================================================== */

const article =
newsDatabase[articleSlug];


/* ======================================================
   ELEMENT HELPER
====================================================== */

function getElement(id){

    return document.getElementById(id);

}


/* ======================================================
   SAFE TEXT SETTER
====================================================== */

function setText(id,value,fallback = "—"){

    const element =
    getElement(id);

    if(!element){
        return;
    }

    element.textContent =
    value !== undefined &&
    value !== null &&
    String(value).trim() !== ""
        ? value
        : fallback;

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
   RENDER ARTICLE
====================================================== */

function renderArticle(){

    if(!article){
        return;
    }


    document.title =
    `${article.title} | FIFA Mission India`;


    const heroImage =
    getElement("newsArticleHeroImage");


    if(heroImage){

        heroImage.src =
        article.image ||
        "images/news/default-news.jpg";

        heroImage.alt =
        article.title;

        attachImageFallback(
            heroImage
        );

    }


    setText(
        "newsArticleCategory",
        article.category,
        "Football News"
    );


    setText(
        "newsArticleTitle",
        article.title,
        "Football News"
    );


    setText(
        "newsArticleSummary",
        article.summary,
        "Read the latest Indian football development story."
    );


    setText(
        "newsArticleAuthor",
        article.author,
        "FIFA Mission India"
    );


    setText(
        "newsArticleDate",
        article.date
    );


    setText(
        "newsArticleReadTime",
        article.readTime
    );


    setText(
        "newsSidebarCategory",
        article.category
    );


    setText(
        "newsSidebarDate",
        article.date
    );


    setText(
        "newsSidebarReadTime",
        article.readTime
    );


    setText(
        "newsArticleHighlight",
        article.highlight
    );


    const featuredBadge =
    getElement("newsFeaturedBadge");


    if(featuredBadge){

        featuredBadge.hidden =
        !article.featured;

    }


    const articleContent =
    getElement("newsArticleContent");


    if(articleContent){

        articleContent.innerHTML =
        article.content || `
            <p>
                This article content will be published soon.
            </p>
        `;


        articleContent
        .querySelectorAll("img")
        .forEach(image => {

            attachImageFallback(
                image
            );

        });

    }


    renderRelatedStories();

    configureShareLinks();

}


/* ======================================================
   RENDER RELATED STORIES
====================================================== */

function renderRelatedStories(){

    const relatedGrid =
    getElement("newsRelatedGrid");

    if(!relatedGrid){
        return;
    }


    const relatedStories =
    Object.values(newsDatabase)
    .filter(item => {

        return item.id !== article.id;

    })
    .slice(0,2);


    relatedGrid.innerHTML = "";


    relatedStories.forEach(story => {

        const card =
        document.createElement("article");

        card.className =
        "news-related-card";


        card.innerHTML = `
            <div class="news-related-card-image">

                <img
                    src="${escapeAttribute(
                        story.image ||
                        "images/news/default-news.jpg"
                    )}"
                    alt="${escapeAttribute(story.title)}"
                    loading="lazy"
                >

            </div>


            <div class="news-related-card-content">

                <span class="news-related-card-category">
                    ${escapeHTML(story.category)}
                </span>

                <h3>
                    ${escapeHTML(story.title)}
                </h3>

                <p>
                    ${escapeHTML(story.summary)}
                </p>

                <a
                    href="news-details.html?article=${encodeURIComponent(
                        story.id
                    )}"
                >
                    Read Story
                    <i class="fa-solid fa-arrow-right"></i>
                </a>

            </div>
        `;


        attachImageFallback(
            card.querySelector("img")
        );


        relatedGrid.appendChild(card);

    });

}


/* ======================================================
   ESCAPE HELPERS
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
   NAVBAR SCROLL
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


    mobileMenu.hidden = false;

    mobileOverlay.hidden = false;

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


    mobileMenu.hidden = true;

    mobileOverlay.hidden = true;

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

            if(window.innerWidth > 1100){

                closeMobileMenu();

            }

        }
    );

}


/* ======================================================
   SHARE LINKS
====================================================== */

function configureShareLinks(){

    const pageUrl =
    encodeURIComponent(
        window.location.href
    );

    const pageTitle =
    encodeURIComponent(
        article.title
    );


    if(whatsAppShare){

        whatsAppShare.href =
        `https://wa.me/?text=${pageTitle}%20${pageUrl}`;

    }


    if(facebookShare){

        facebookShare.href =
        `https://www.facebook.com/sharer/sharer.php?u=${pageUrl}`;

    }


    if(twitterShare){

        twitterShare.href =
        `https://twitter.com/intent/tweet?text=${pageTitle}&url=${pageUrl}`;

    }

}


/* ======================================================
   SHARE ARTICLE
====================================================== */

async function shareArticle(){

    if(!article){
        return;
    }


    const shareData = {

        title:
        article.title,

        text:
        article.summary,

        url:
        window.location.href

    };


    try{

        if(navigator.share){

            await navigator.share(
                shareData
            );

            return;

        }


        await copyArticleLink();

    }catch(error){

        if(error?.name === "AbortError"){
            return;
        }


        console.error(
            "Article share error:",
            error
        );


        showToast(
            "Unable to share this article.",
            "error"
        );

    }

}


/* ======================================================
   COPY ARTICLE LINK
====================================================== */

async function copyArticleLink(){

    try{

        if(navigator.clipboard){

            await navigator.clipboard.writeText(
                window.location.href
            );


            showToast(
                "Article link copied successfully.",
                "success"
            );

            return;

        }


        const temporaryInput =
        document.createElement("textarea");

        temporaryInput.value =
        window.location.href;

        temporaryInput.style.position =
        "fixed";

        temporaryInput.style.opacity =
        "0";


        document.body.appendChild(
            temporaryInput
        );


        temporaryInput.select();

        document.execCommand(
            "copy"
        );

        temporaryInput.remove();


        showToast(
            "Article link copied successfully.",
            "success"
        );

    }catch(error){

        console.error(
            "Copy link error:",
            error
        );


        showToast(
            "Unable to copy the article link.",
            "error"
        );

    }

}


/* ======================================================
   NEWSLETTER SUBMISSION
====================================================== */

async function handleNewsletterSubmission(event){

    event.preventDefault();


    const email =
    newsletterEmail?.value.trim() || "";


    if(
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/
        .test(email)
    ){

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

        submitButton.disabled = true;

        submitButton.innerHTML = `
            <i class="fa-solid fa-spinner fa-spin"></i>
            Subscribing...
        `;

    }


    const subscriptionPayload = {

        email:
        email,

        source:
        "news-details",

        articleId:
        article?.id || null,

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
            "You are now subscribed to football updates.",
            "success"
        );

    }catch(error){

        console.error(
            "Newsletter subscription error:",
            error
        );


        showToast(
            "Unable to subscribe right now. Please try again.",
            "error"
        );

    }finally{

        if(submitButton){

            submitButton.disabled = false;

            submitButton.innerHTML =
            originalContent || `
                Subscribe
                <i class="fa-solid fa-arrow-right"></i>
            `;

        }

    }

}


/* ======================================================
   TOAST
====================================================== */

let toastTimeout = null;


function showToast(message,type = "success"){

    if(
        !toast ||
        !toastIcon ||
        !toastMessage
    ){
        return;
    }


    const icons = {

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
    icons[type] ||
    icons.success;


    toast.dataset.type =
    type;


    toast.hidden = false;


    if(toastTimeout){

        window.clearTimeout(
            toastTimeout
        );

    }


    toastTimeout =
    window.setTimeout(
        () => {

            toast.hidden = true;

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
   PAGE STATE
====================================================== */

function showArticle(){

    if(main){
        main.hidden = false;
    }

    if(notFound){
        notFound.hidden = true;
    }

}


function showArticleNotFound(){

    if(main){
        main.hidden = true;
    }

    if(notFound){
        notFound.hidden = false;
    }

}


/* ======================================================
   RESET PAGE OVERLAYS
====================================================== */

function resetPageState(){

    if(mobileMenu){
        mobileMenu.hidden = true;
    }

    if(mobileOverlay){
        mobileOverlay.hidden = true;
    }

    if(toast){
        toast.hidden = true;
    }

    document.body.style.overflow =
    "";

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

            loader.hidden = true;

            loader.style.display =
            "none";

        },
        350
    );

}


/* ======================================================
   INITIALIZE APPLICATION
====================================================== */

function initializeNewsDetails(){

    resetPageState();

    initializeNavbar();

    initializeMobileMenu();

    initializeKeyboardEvents();


    navbarShareButton?.addEventListener(
        "click",
        shareArticle
    );


    copyLinkButton?.addEventListener(
        "click",
        copyArticleLink
    );


    newsletterForm?.addEventListener(
        "submit",
        handleNewsletterSubmission
    );


    if(!article){

        showArticleNotFound();

        hideLoader();

        return;

    }


    renderArticle();

    showArticle();

    hideLoader();

}


/* ======================================================
   START APPLICATION
====================================================== */

if(document.readyState === "loading"){

    document.addEventListener(
        "DOMContentLoaded",
        initializeNewsDetails
    );

}else{

    initializeNewsDetails();

}