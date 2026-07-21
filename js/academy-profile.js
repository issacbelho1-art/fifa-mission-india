"use strict";

/* ======================================================
   FIFA MISSION INDIA
   ACADEMY PROFILE
====================================================== */


/* ======================================================
   DOM REFERENCES
====================================================== */

const loader =
document.getElementById("academyPageLoader");

const profileMain =
document.getElementById("academyProfileMain");

const notFound =
document.getElementById("academyNotFound");

const mobileMenu =
document.getElementById("academyMobileMenu");

const mobileOverlay =
document.getElementById("academyMobileOverlay");

const menuButton =
document.getElementById("academyMenuToggle");

const closeButton =
document.getElementById("academyMobileMenuClose");

const enquiryModal =
document.getElementById("academyEnquiryModal");

const enquiryButton =
document.getElementById("academyContactButton");

const enquiryClose =
document.getElementById("academyModalClose");

const enquiryCancel =
document.getElementById("academyCancelEnquiry");

const enquiryForm =
document.getElementById("academyEnquiryForm");

const toast =
document.getElementById("academyToast");

const toastMessage =
document.getElementById("academyToastMessage");

const toastIcon =
document.getElementById("academyToastIcon");

const shareButton =
document.getElementById("academyShareButton");


/* ======================================================
   URL PARAMETER
====================================================== */

const academySlug =
new URLSearchParams(window.location.search)
.get("academy") || "minerva";


/* ======================================================
   ACADEMY DATABASE
   (Frontend Demo)
====================================================== */

const academyDatabase = {minerva:{

    id:"minerva",

    name:"Minerva Football Academy",

    verified:true,

    type:"Elite Residential Academy",

    established:"2005",

    location:"Mohali, Punjab",

    players:"420",

    graduates:"180",

    coaches:"18",

    trophies:"41",

    programs:"7",

    category:"Professional Football Academy",

    trainingModel:"UEFA Inspired Development",

    ageGroups:"U-8 to U-21",

    residential:"Available",

    acceptedAge:"8–21 Years",

    playerCategory:"Boys & Girls",

    selectionMethod:"Open Trials + Scouting",

    cover:
    "images/academies/minerva-cover.jpeg",

    logo:
    "images/academies/minerva-logo.png",

    leadership:[

        {
            name:"Mr. Ranjit Bajaj",

            role:"Owner & Primary Director",

            image:
            "images/leadership/ranjit-bajaj.jpeg",

            description:
            "Founder and Owner of Minerva Football Academy. A leading figure in Indian football, committed to developing young talent through professional coaching, world-class infrastructure and long-term player development."
        }

    ],

    description:

    "Minerva Football Academy develops talented footballers through structured coaching, elite competition and long-term player development pathways aimed at national and international football.",

    mission:

    "Develop technically gifted footballers capable of representing club, state and country.",

    philosophy:

    "Player-first coaching focused on discipline, intelligence, technique and character.",

    address:

    "Minerva Academy NH 21, V.P.O. Daon, Sector 120, Punjab-140301, India",

    phone:

    "+91 6284779696",

    email:

    "minervaacademyfootballclub@gmail.com",

        website:

    "https://minervaacademy.com"

    }

};


/* ======================================================
   CURRENT ACADEMY
====================================================== */

const academy =
academyDatabase[academySlug];

/* ======================================================
   EXTENDED ACADEMY CONTENT
====================================================== */

const academyContentDatabase = {

    minerva:{

        programs:[

            {
                icon:"fa-solid fa-seedling",
                title:"Foundation Program",
                description:
                "Age-appropriate football development focused on coordination, confidence, movement and basic technical skills.",
                age:"U-8 to U-11",
                schedule:"3–4 Sessions Weekly"
            },

            {
                icon:"fa-solid fa-futbol",
                title:"Youth Development Program",
                description:
                "Structured technical and tactical coaching for young players preparing for competitive academy football.",
                age:"U-12 to U-15",
                schedule:"5 Sessions Weekly"
            },

            {
                icon:"fa-solid fa-ranking-star",
                title:"Elite Performance Program",
                description:
                "High-performance training for advanced players targeting national leagues, professional clubs and representative teams.",
                age:"U-16 to U-21",
                schedule:"Full-Time"
            },

            {
                icon:"fa-solid fa-house-user",
                title:"Residential Academy",
                description:
                "Integrated football, education, accommodation, nutrition and player welfare support in a professional environment.",
                age:"U-13 to U-21",
                schedule:"Residential"
            }

        ],


        facilities:[

            {
                icon:"fa-solid fa-futbol",
                title:"Professional Football Pitches",
                description:
                "High-quality natural and artificial training surfaces for year-round player development."
            },

            {
                icon:"fa-solid fa-dumbbell",
                title:"Strength and Conditioning",
                description:
                "Modern fitness facilities supporting physical preparation, mobility and injury prevention."
            },

            {
                icon:"fa-solid fa-bed",
                title:"Residential Accommodation",
                description:
                "Supervised accommodation designed to support player safety, discipline and daily routines."
            },

            {
                icon:"fa-solid fa-utensils",
                title:"Sports Nutrition",
                description:
                "Balanced meal planning and nutritional guidance for growing and high-performance athletes."
            },

            {
                icon:"fa-solid fa-kit-medical",
                title:"Medical and Recovery",
                description:
                "Player assessment, physiotherapy support, rehabilitation and structured recovery programs."
            },

            {
                icon:"fa-solid fa-video",
                title:"Performance Analysis",
                description:
                "Match recording and video analysis to improve tactical awareness and individual decision-making."
            }

        ],


        achievements:[

            {
                icon:"fa-solid fa-trophy",
                title:"National Youth Championships",
                description:
                "Multiple successful campaigns across national-level youth football competitions."
            },

            {
                icon:"fa-solid fa-medal",
                title:"Professional Player Development",
                description:
                "Developed players who progressed into professional clubs, national camps and representative teams."
            },

            {
                icon:"fa-solid fa-earth-asia",
                title:"International Exposure",
                description:
                "Provided competitive tours, tournaments and development opportunities against international opposition."
            },

            {
                icon:"fa-solid fa-people-group",
                title:"Grassroots Contribution",
                description:
                "Expanded access to structured football training and talent identification across multiple regions."
            }

        ],


        coaches:[

            {
                name:"Head Coach",
                role:"Academy Technical Director",
                image:"images/coaches/default-coach-1.jpg",
                description:
                "Leads the academy's technical vision, coaching methodology and long-term player development structure."
            },

            {
                name:"Youth Development Coach",
                role:"U-15 Head Coach",
                image:"images/coaches/default-coach-2.jpg",
                description:
                "Responsible for technical development, tactical education and competitive preparation of youth players."
            },

            {
                name:"Performance Coach",
                role:"Strength and Conditioning",
                image:"images/coaches/default-coach-3.jpg",
                description:
                "Supports player fitness, athletic development, injury prevention and return-to-play programs."
            }

        ],


        pathway:[

            {
                title:"Talent Identification",
                description:
                "Players enter through open trials, academy scouting, recommendations and regional talent programs."
            },

            {
                title:"Foundation Development",
                description:
                "Young players build coordination, ball mastery, confidence, discipline and enjoyment of football."
            },

            {
                title:"Youth Competition",
                description:
                "Players receive structured coaching and regular competitive opportunities against strong opposition."
            },

            {
                title:"Elite Performance",
                description:
                "Advanced players train in a high-performance environment with detailed technical, tactical and physical support."
            },

            {
                title:"Professional Transition",
                description:
                "Outstanding players receive pathways toward senior football, professional clubs and representative opportunities."
            }

        ],


        trials:[

            {
                title:"Elite Residential Academy Trials",
                date:"25 August 2026",
                location:"Mohali, Punjab",
                ageGroup:"U-14 to U-18",
                category:"Boys",
                registrationUrl:"player-trials.html?trial=minerva-elite-2026"
            },

            {
                title:"Girls Development Program Trials",
                date:"12 September 2026",
                location:"Mohali, Punjab",
                ageGroup:"U-13 to U-17",
                category:"Girls",
                registrationUrl:"player-trials.html?trial=minerva-girls-2026"
            }

        ],


        gallery:[

            {
                image:"images/academies/minerva-gallery-1.jpg",
                caption:"Elite academy training session"
            },

            {
                image:"images/academies/minerva-gallery-2.jpg",
                caption:"Youth player development"
            },

            {
                image:"images/academies/minerva-gallery-3.jpg",
                caption:"Competitive match preparation"
            },

            {
                image:"images/academies/minerva-gallery-4.jpg",
                caption:"Academy facilities"
            },

            {
                image:"images/academies/minerva-gallery-5.jpg",
                caption:"Strength and conditioning"
            },

            {
                image:"images/academies/minerva-gallery-6.jpg",
                caption:"Tournament experience"
            }

        ],


        socialLinks: [

    {
        platform: "Facebook",
        icon: "fa-brands fa-facebook-f",
        url: "https://www.facebook.com/MinervaAcademyFootballCricketClub"
    },

    {
        platform: "Instagram",
        icon: "fa-brands fa-instagram",
        url: "https://www.instagram.com/minervapunjabfc/"
    },

    {
        platform: "YouTube",
        icon: "fa-brands fa-youtube",
        url: "#" // Replace with the official Minerva YouTube channel when available
    },

    {
        platform: "X",
        icon: "fa-brands fa-x-twitter",
        url: "https://x.com/minervapunjabfc"
    }

],

    }

};


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

    const element = getElement(id);

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
   SAFE ATTRIBUTE SETTER
====================================================== */

function setAttribute(id,attribute,value){

    const element = getElement(id);

    if(!element || !value){
        return;
    }

    element.setAttribute(attribute,value);

}


/* ======================================================
   IMAGE FALLBACK
====================================================== */

function attachImageFallback(image,fallback){

    if(!image){
        return;
    }

    image.addEventListener(
        "error",
        () => {

            if(image.dataset.fallbackApplied === "true"){
                return;
            }

            image.dataset.fallbackApplied = "true";
            image.src = fallback;

        }
    );

}


/* ======================================================
   RENDER BASIC ACADEMY INFORMATION
====================================================== */

function renderAcademyInformation(){

    if(!academy){
        return;
    }

    document.title =
    `${academy.name} | FIFA Mission India`;


    setText(
        "academyName",
        academy.name,
        "Football Academy"
    );


    setText(
        "academyLocation",
        academy.location,
        "India"
    );


    setText(
        "academyEstablishedYear",
        academy.established
    );


    setText(
        "academyPlayerCount",
        academy.players
    );


    setText(
        "academyGraduatesCount",
        academy.graduates
    );


    setText(
        "academyCoachesCount",
        academy.coaches
    );


    setText(
        "academyTrophiesCount",
        academy.trophies
    );


    setText(
        "academyProgramsCount",
        academy.programs
    );


    setText(
        "academyShortDescription",
        academy.description
    );


    setText(
        "academyFullDescription",
        academy.description
    );


    setText(
        "academyCategory",
        academy.category
    );


    setText(
        "academyTrainingModel",
        academy.trainingModel
    );


    setText(
        "academyAgeGroups",
        academy.ageGroups
    );


    setText(
        "academyResidentialStatus",
        academy.residential
    );


    setText(
        "academyMission",
        academy.mission
    );


    setText(
        "academyCoachingPhilosophy",
        academy.philosophy
    );


    setText(
        "academyAddress",
        academy.address,
        "Address not available"
    );


    setText(
        "academyAcceptedAge",
        academy.acceptedAge
    );


    setText(
        "academyPlayerCategory",
        academy.playerCategory
    );


    setText(
        "academyResidentialEligibility",
        academy.residential
    );


    setText(
        "academySelectionMethod",
        academy.selectionMethod
    );


    renderAcademyBadges();

    renderAcademyImages();

    renderAcademyContactLinks();

}


/* ======================================================
   RENDER BADGES
====================================================== */

function renderAcademyBadges(){

    const statusBadge =
    getElement("academyStatusBadge");

    const typeBadge =
    getElement("academyTypeBadge");


    if(statusBadge){

        if(academy.verified){

            statusBadge.innerHTML = `
                <i class="fa-solid fa-circle-check"></i>
                Verified Academy
            `;

        }else{

            statusBadge.innerHTML = `
                <i class="fa-solid fa-clock"></i>
                Verification Pending
            `;

        }

    }


    if(typeBadge){

        typeBadge.textContent =
        academy.type || "Football Academy";

    }

}


/* ======================================================
   RENDER COVER AND LOGO
====================================================== */

function renderAcademyImages(){

    const coverImage =
    getElement("academyCoverImage");

    const logoImage =
    getElement("academyLogoImage");


    if(coverImage){

        coverImage.src =
        academy.cover ||
        "images/academies/default-academy-cover.jpg";

        coverImage.alt =
        `${academy.name} cover image`;

        attachImageFallback(
            coverImage,
            "images/academies/default-academy-cover.jpg"
        );

    }


    if(logoImage){

        logoImage.src =
        academy.logo ||
        "images/academies/default-academy-logo.png";

        logoImage.alt =
        `${academy.name} logo`;

        attachImageFallback(
            logoImage,
            "images/academies/default-academy-logo.png"
        );

    }

}


/* ======================================================
   RENDER CONTACT LINKS
====================================================== */

function renderAcademyContactLinks(){

    const phoneLink =
    getElement("academyPhoneLink");

    const emailLink =
    getElement("academyEmailLink");

    const websiteLink =
    getElement("academyWebsiteLink");


    if(phoneLink){

        if(academy.phone){

            phoneLink.textContent =
            academy.phone;

            phoneLink.href =
            `tel:${academy.phone.replace(/\s+/g,"")}`;

        }else{

            phoneLink.textContent =
            "Not available";

            phoneLink.removeAttribute("href");

        }

    }


    if(emailLink){

        if(academy.email){

            emailLink.textContent =
            academy.email;

            emailLink.href =
            `mailto:${academy.email}`;

        }else{

            emailLink.textContent =
            "Not available";

            emailLink.removeAttribute("href");

        }

    }


    if(websiteLink){

        if(academy.website){

            websiteLink.textContent =
            academy.website
            .replace(/^https?:\/\//,"")
            .replace(/\/$/,"");

            websiteLink.href =
            academy.website;

        }else{

            websiteLink.textContent =
            "Not available";

            websiteLink.removeAttribute("href");

        }

    }

}

/* ======================================================
   RENDER PROGRAMS
====================================================== */

function renderPrograms(content){

    const programsGrid =
    getElement("academyProgramsGrid");

    const programSelect =
    getElement("enquiryProgram");

    if(!programsGrid){
        return;
    }

    const programs =
    Array.isArray(content.programs)
        ? content.programs
        : [];


    programsGrid.innerHTML = "";


    if(programSelect){

        programSelect.innerHTML = `
            <option value="">
                Select Program
            </option>
        `;

    }


    if(programs.length === 0){

        programsGrid.innerHTML = `
            <div class="academy-empty-state">
                <div class="academy-empty-state-icon">
                    <i class="fa-solid fa-person-running"></i>
                </div>

                <h3>
                    Programs Coming Soon
                </h3>

                <p>
                    This academy has not published its training programs yet.
                </p>
            </div>
        `;

        return;

    }


    programs.forEach((program,index) => {

        const card =
        document.createElement("article");

        card.className =
        "academy-program-card";

        card.innerHTML = `
            <div class="academy-card-icon">
                <i class="${program.icon || "fa-solid fa-futbol"}"></i>
            </div>

            <h3>
                ${escapeHTML(program.title || `Program ${index + 1}`)}
            </h3>

            <p>
                ${escapeHTML(
                    program.description ||
                    "Structured football development program."
                )}
            </p>

            <div class="academy-program-meta">

                <span>
                    <i class="fa-solid fa-users"></i>
                    ${escapeHTML(program.age || "All Ages")}
                </span>

                <span>
                    <i class="fa-regular fa-clock"></i>
                    ${escapeHTML(program.schedule || "Schedule Available Soon")}
                </span>

            </div>
        `;

        programsGrid.appendChild(card);


        if(programSelect){

            const option =
            document.createElement("option");

            option.value =
            program.title || `program-${index + 1}`;

            option.textContent =
            program.title || `Program ${index + 1}`;

            programSelect.appendChild(option);

        }

    });

}


/* ======================================================
   RENDER FACILITIES
====================================================== */

function renderFacilities(content){

    const facilitiesGrid =
    getElement("academyFacilitiesGrid");

    if(!facilitiesGrid){
        return;
    }

    const facilities =
    Array.isArray(content.facilities)
        ? content.facilities
        : [];


    facilitiesGrid.innerHTML = "";


    if(facilities.length === 0){

        facilitiesGrid.innerHTML = `
            <div class="academy-empty-state">
                <div class="academy-empty-state-icon">
                    <i class="fa-solid fa-building"></i>
                </div>

                <h3>
                    Facility Information Unavailable
                </h3>

                <p>
                    Facility details will be added by the academy.
                </p>
            </div>
        `;

        return;

    }


    facilities.forEach((facility,index) => {

        const card =
        document.createElement("article");

        card.className =
        "academy-facility-card";

        card.innerHTML = `
            <i class="${facility.icon || "fa-solid fa-building"}"></i>

            <h3>
                ${escapeHTML(
                    facility.title ||
                    `Facility ${index + 1}`
                )}
            </h3>

            <p>
                ${escapeHTML(
                    facility.description ||
                    "Academy facility information."
                )}
            </p>
        `;

        facilitiesGrid.appendChild(card);

    });

}

/* ======================================================
   RENDER ACADEMY LEADERSHIP
====================================================== */

function renderLeadership(){

    const leadershipGrid =
    getElement("academyLeadershipGrid");

    if(!leadershipGrid){
        return;
    }


    const leadership =
    Array.isArray(academy.leadership)
        ? academy.leadership
        : [];


    leadershipGrid.innerHTML = "";


    if(leadership.length === 0){

        leadershipGrid.innerHTML = `
            <div class="academy-leadership-empty">

                <i class="fa-solid fa-user-tie"></i>

                <h3>
                    Leadership Information Coming Soon
                </h3>

                <p>
                    Academy leadership details have not been published yet.
                </p>

            </div>
        `;

        return;

    }


    leadership.forEach((leader,index) => {

        const card =
        document.createElement("article");

        card.className =
        "academy-leadership-card";


        const leaderImage =
        leader.image ||
        "images/leadership/default-leader.jpg";


        card.innerHTML = `
            <div class="academy-leadership-image">

                <img
                    src="${escapeAttribute(leaderImage)}"
                    alt="${escapeAttribute(
                        `${leader.name || "Academy leader"} profile`
                    )}"
                    loading="lazy"
                >

            </div>


            <div class="academy-leadership-content">

                <span class="academy-leadership-label">
                    Academy Leadership
                </span>

                <h3>
                    ${escapeHTML(
                        leader.name ||
                        `Leader ${index + 1}`
                    )}
                </h3>

                <div class="academy-leadership-role">
                    ${escapeHTML(
                        leader.role ||
                        "Academy Director"
                    )}
                </div>

                <p>
                    ${escapeHTML(
                        leader.description ||
                        "Supports the academy's leadership, vision and long-term football development."
                    )}
                </p>

            </div>
        `;


        const image =
        card.querySelector("img");


        attachImageFallback(
            image,
            "images/leadership/default-leader.jpg"
        );


        leadershipGrid.appendChild(card);

    });

}

/* ======================================================
   RENDER ACHIEVEMENTS
====================================================== */

function renderAchievements(content){

    const achievementsList =
    getElement("academyAchievementsList");

    if(!achievementsList){
        return;
    }

    const achievements =
    Array.isArray(content.achievements)
        ? content.achievements
        : [];


    achievementsList.innerHTML = "";


    if(achievements.length === 0){

        achievementsList.innerHTML = `
            <div class="academy-empty-state">
                <div class="academy-empty-state-icon">
                    <i class="fa-solid fa-trophy"></i>
                </div>

                <h3>
                    Achievements Coming Soon
                </h3>

                <p>
                    Academy achievements and milestones will appear here.
                </p>
            </div>
        `;

        return;

    }


    achievements.forEach((achievement,index) => {

        const card =
        document.createElement("article");

        card.className =
        "academy-achievement-card";

        card.innerHTML = `
            <div class="academy-achievement-icon">
                <i class="${achievement.icon || "fa-solid fa-trophy"}"></i>
            </div>

            <div class="academy-achievement-content">

                <h3>
                    ${escapeHTML(
                        achievement.title ||
                        `Achievement ${index + 1}`
                    )}
                </h3>

                <p>
                    ${escapeHTML(
                        achievement.description ||
                        "Academy achievement information."
                    )}
                </p>

            </div>
        `;

        achievementsList.appendChild(card);

    });

}


/* ======================================================
   RENDER COACHES
====================================================== */

function renderCoaches(content){

    const coachesGrid =
    getElement("academyCoachesGrid");

    if(!coachesGrid){
        return;
    }

    const coaches =
    Array.isArray(content.coaches)
        ? content.coaches
        : [];


    coachesGrid.innerHTML = "";


    if(coaches.length === 0){

        coachesGrid.innerHTML = `
            <div class="academy-empty-state">
                <div class="academy-empty-state-icon">
                    <i class="fa-solid fa-user-tie"></i>
                </div>

                <h3>
                    Coaching Team Coming Soon
                </h3>

                <p>
                    Coaching staff profiles will be published here.
                </p>
            </div>
        `;

        return;

    }


    coaches.forEach((coach,index) => {

        const card =
        document.createElement("article");

        card.className =
        "academy-coach-card";


        const coachImage =
        coach.image ||
        "images/coaches/default-coach.jpg";


        card.innerHTML = `
            <div class="academy-coach-image">

                <img
                    src="${escapeAttribute(coachImage)}"
                    alt="${escapeAttribute(
                        `${coach.name || "Academy coach"} profile`
                    )}"
                    loading="lazy"
                >

            </div>

            <div class="academy-coach-info">

                <h3>
                    ${escapeHTML(
                        coach.name ||
                        `Coach ${index + 1}`
                    )}
                </h3>

                <div class="academy-coach-role">
                    ${escapeHTML(
                        coach.role ||
                        "Academy Coach"
                    )}
                </div>

                <p>
                    ${escapeHTML(
                        coach.description ||
                        "Supports the academy's player development program."
                    )}
                </p>

            </div>
        `;


        const image =
        card.querySelector("img");

        attachImageFallback(
            image,
            "images/coaches/default-coach.jpg"
        );


        coachesGrid.appendChild(card);

    });

}


/* ======================================================
   RENDER PLAYER PATHWAY
====================================================== */

function renderPathway(content){

    const pathwayList =
    getElement("academyPathwayList");

    if(!pathwayList){
        return;
    }

    const pathway =
    Array.isArray(content.pathway)
        ? content.pathway
        : [];


    pathwayList.innerHTML = "";


    if(pathway.length === 0){

        pathwayList.innerHTML = `
            <div class="academy-empty-state">
                <div class="academy-empty-state-icon">
                    <i class="fa-solid fa-route"></i>
                </div>

                <h3>
                    Player Pathway Coming Soon
                </h3>

                <p>
                    Player development pathway information will appear here.
                </p>
            </div>
        `;

        return;

    }


    pathway.forEach((step,index) => {

        const item =
        document.createElement("article");

        item.className =
        "academy-pathway-step";

        item.innerHTML = `
            <h3>
                ${index + 1}. ${escapeHTML(
                    step.title ||
                    `Development Stage ${index + 1}`
                )}
            </h3>

            <p>
                ${escapeHTML(
                    step.description ||
                    "Player development stage information."
                )}
            </p>
        `;

        pathwayList.appendChild(item);

    });

}


/* ======================================================
   RENDER TRIALS
====================================================== */

function renderTrials(content){

    const trialsList =
    getElement("academyTrialsList");

    const emptyState =
    getElement("academyTrialsEmptyState");

    if(!trialsList){
        return;
    }

    const trials =
    Array.isArray(content.trials)
        ? content.trials
        : [];


    trialsList.innerHTML = "";


    if(trials.length === 0){

        if(emptyState){
            emptyState.hidden = false;
        }

        return;

    }


    if(emptyState){
        emptyState.hidden = true;
    }


    trials.forEach((trial,index) => {

        const card =
        document.createElement("article");

        card.className =
        "academy-trial-card";

        card.innerHTML = `
            <div class="academy-trial-header">

                <div>

                    <h3>
                        ${escapeHTML(
                            trial.title ||
                            `Academy Trial ${index + 1}`
                        )}
                    </h3>

                    <div class="academy-trial-date">
                        <i class="fa-regular fa-calendar"></i>
                        ${escapeHTML(
                            trial.date ||
                            "Date to be announced"
                        )}
                    </div>

                </div>

            </div>


            <div class="academy-trial-details">

                <div>

                    <span>
                        Location
                    </span>

                    <strong>
                        ${escapeHTML(
                            trial.location ||
                            academy.location ||
                            "India"
                        )}
                    </strong>

                </div>


                <div>

                    <span>
                        Age Group
                    </span>

                    <strong>
                        ${escapeHTML(
                            trial.ageGroup ||
                            academy.acceptedAge ||
                            "Open Category"
                        )}
                    </strong>

                </div>


                <div>

                    <span>
                        Player Category
                    </span>

                    <strong>
                        ${escapeHTML(
                            trial.category ||
                            academy.playerCategory ||
                            "All Players"
                        )}
                    </strong>

                </div>

            </div>


            <a
                class="academy-trial-button"
                href="${escapeAttribute(
                    trial.registrationUrl ||
                    "player-trials.html"
                )}"
            >
                <i class="fa-solid fa-arrow-up-right-from-square"></i>
                View Trial Details
            </a>
        `;

        trialsList.appendChild(card);

    });

}

/* ======================================================
   RENDER GALLERY
====================================================== */

function renderGallery(content){

    const galleryGrid =
    getElement("academyGalleryGrid");

    if(!galleryGrid){
        return;
    }

    const gallery =
    Array.isArray(content.gallery)
        ? content.gallery
        : [];


    galleryGrid.innerHTML = "";


    if(gallery.length === 0){

        galleryGrid.innerHTML = `
            <div class="academy-empty-state">

                <div class="academy-empty-state-icon">
                    <i class="fa-solid fa-images"></i>
                </div>

                <h3>
                    Gallery Coming Soon
                </h3>

                <p>
                    Academy training and facility photos will appear here.
                </p>

            </div>
        `;

        return;

    }


    gallery.forEach((item,index) => {

        const galleryItem =
        document.createElement("button");

        galleryItem.type =
        "button";

        galleryItem.className =
        "academy-gallery-item";

        galleryItem.setAttribute(
            "aria-label",
            `View ${item.caption || `academy image ${index + 1}`}`
        );

        galleryItem.innerHTML = `
            <img
                src="${escapeAttribute(
                    item.image ||
                    "images/academies/default-academy-cover.jpg"
                )}"
                alt="${escapeAttribute(
                    item.caption ||
                    `${academy.name} gallery image ${index + 1}`
                )}"
                loading="lazy"
            >

            <span class="academy-gallery-overlay">

                <span>
                    ${escapeHTML(
                        item.caption ||
                        `Academy Image ${index + 1}`
                    )}
                </span>

            </span>
        `;


        const image =
        galleryItem.querySelector("img");

        attachImageFallback(
            image,
            "images/academies/default-academy-cover.jpg"
        );


        galleryItem.addEventListener(
            "click",
            () => {

                openGalleryPreview(
                    item.image,
                    item.caption
                );

            }
        );


        galleryGrid.appendChild(galleryItem);

    });

}


/* ======================================================
   GALLERY PREVIEW
====================================================== */

function openGalleryPreview(imageSource,caption){

    if(!imageSource){
        return;
    }

    const preview =
    document.createElement("div");

    preview.className =
    "academy-gallery-preview";

    preview.setAttribute(
        "role",
        "dialog"
    );

    preview.setAttribute(
        "aria-modal",
        "true"
    );

    preview.setAttribute(
        "aria-label",
        caption || "Academy gallery preview"
    );

    preview.innerHTML = `
        <div class="academy-gallery-preview-backdrop"></div>

        <div class="academy-gallery-preview-dialog">

            <button
                class="academy-gallery-preview-close"
                type="button"
                aria-label="Close gallery preview"
            >
                <i class="fa-solid fa-xmark"></i>
            </button>

            <img
                src="${escapeAttribute(imageSource)}"
                alt="${escapeAttribute(
                    caption || "Academy gallery image"
                )}"
            >

            <p>
                ${escapeHTML(
                    caption || academy.name
                )}
            </p>

        </div>
    `;


    document.body.appendChild(preview);

    document.body.style.overflow =
    "hidden";


    const closePreview = () => {

        preview.remove();

        document.body.style.overflow =
        "";

        document.removeEventListener(
            "keydown",
            handlePreviewEscape
        );

    };


    const handlePreviewEscape = event => {

        if(event.key === "Escape"){
            closePreview();
        }

    };


    preview
    .querySelector(".academy-gallery-preview-close")
    ?.addEventListener(
        "click",
        closePreview
    );


    preview
    .querySelector(".academy-gallery-preview-backdrop")
    ?.addEventListener(
        "click",
        closePreview
    );


    document.addEventListener(
        "keydown",
        handlePreviewEscape
    );

}


/* ======================================================
   RENDER SOCIAL LINKS
====================================================== */

function renderSocialLinks(content){

    const socialLinksContainer =
    getElement("academySocialLinks");

    if(!socialLinksContainer){
        return;
    }

    const socialLinks =
    Array.isArray(content.socialLinks)
        ? content.socialLinks
        : [];


    socialLinksContainer.innerHTML = "";


    if(socialLinks.length === 0){

        socialLinksContainer.innerHTML = `
            <p class="academy-social-empty">
                Social links have not been added yet.
            </p>
        `;

        return;

    }


    socialLinks.forEach(link => {

        const anchor =
        document.createElement("a");

        anchor.className =
        "academy-social-link";

        anchor.href =
        link.url && link.url !== "#"
            ? link.url
            : "#";

        anchor.innerHTML = `
            <i class="${link.icon || "fa-solid fa-link"}"></i>

            <span>
                ${escapeHTML(link.platform || "Social Profile")}
            </span>

            <i class="fa-solid fa-arrow-up-right-from-square"></i>
        `;


        if(link.url && link.url !== "#"){

            anchor.target =
            "_blank";

            anchor.rel =
            "noopener noreferrer";

        }else{

            anchor.addEventListener(
                "click",
                event => {

                    event.preventDefault();

                    showToast(
                        `${link.platform || "Social"} link will be added soon.`,
                        "info"
                    );

                }
            );

        }


        socialLinksContainer.appendChild(anchor);

    });

}


/* ======================================================
   RENDER COMPLETE DYNAMIC CONTENT
====================================================== */

function renderDynamicContent(){

    const content =
    academyContentDatabase[academySlug] || {

        programs:[],
        facilities:[],
        achievements:[],
        coaches:[],
        pathway:[],
        trials:[],
        gallery:[],
        socialLinks:[]

    };


    renderPrograms(content);

    renderFacilities(content);

    renderLeadership();

    renderAchievements(content);

    renderCoaches(content);

    renderPathway(content);

    renderTrials(content);

    renderGallery(content);

    renderSocialLinks(content);

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


/* ======================================================
   ATTRIBUTE ESCAPING
====================================================== */

function escapeAttribute(value){

    return escapeHTML(value);

}

/* ======================================================
   MOBILE MENU
====================================================== */

function openMobileMenu(){

    if(
        !mobileMenu ||
        !mobileOverlay ||
        !menuButton
    ){
        return;
    }

    mobileMenu.hidden = false;
    mobileOverlay.hidden = false;

    menuButton.setAttribute(
        "aria-expanded",
        "true"
    );

    document.body.style.overflow =
    "hidden";


    const firstLink =
    mobileMenu.querySelector(
        "a, button"
    );

    firstLink?.focus();

}


function closeMobileMenu(){

    if(
        !mobileMenu ||
        !mobileOverlay ||
        !menuButton
    ){
        return;
    }

    mobileMenu.hidden = true;
    mobileOverlay.hidden = true;

    menuButton.setAttribute(
        "aria-expanded",
        "false"
    );

    document.body.style.overflow =
    "";

}


function initializeMobileMenu(){

    menuButton?.addEventListener(
        "click",
        () => {

            if(mobileMenu?.hidden){
                openMobileMenu();
            }else{
                closeMobileMenu();
            }

        }
    );


    closeButton?.addEventListener(
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
   NAVBAR SCROLL STATE
====================================================== */

function initializeNavbarScroll(){

    const navbar =
    getElement("academyNavbar");

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
   ENQUIRY MODAL
====================================================== */

function openEnquiryModal(){

    if(!enquiryModal){
        return;
    }

    enquiryModal.hidden = false;

    document.body.style.overflow =
    "hidden";


    window.setTimeout(
        () => {

            getElement("enquiryName")
            ?.focus();

        },
        50
    );

}


function closeEnquiryModal(){

    if(!enquiryModal){
        return;
    }

    enquiryModal.hidden = true;

    document.body.style.overflow =
    "";

}


function initializeEnquiryModal(){

    enquiryButton?.addEventListener(
        "click",
        openEnquiryModal
    );


    enquiryClose?.addEventListener(
        "click",
        closeEnquiryModal
    );


    enquiryCancel?.addEventListener(
        "click",
        closeEnquiryModal
    );


    enquiryModal
    ?.querySelector(".academy-modal-backdrop")
    ?.addEventListener(
        "click",
        closeEnquiryModal
    );

}


/* ======================================================
   ENQUIRY FORM VALIDATION
====================================================== */

function getFormValue(id){

    return getElement(id)
    ?.value
    .trim() || "";

}


function isValidEmail(email){

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    .test(email);

}


function isValidPhone(phone){

    if(phone === ""){
        return true;
    }

    return /^[+\d][\d\s-]{7,17}$/
    .test(phone);

}


function validateEnquiryForm(){

    const name =
    getFormValue("enquiryName");

    const email =
    getFormValue("enquiryEmail");

    const phone =
    getFormValue("enquiryPhone");

    const message =
    getFormValue("enquiryMessage");


    if(name.length < 2){

        showToast(
            "Please enter your full name.",
            "error"
        );

        getElement("enquiryName")
        ?.focus();

        return false;

    }


    if(!isValidEmail(email)){

        showToast(
            "Please enter a valid email address.",
            "error"
        );

        getElement("enquiryEmail")
        ?.focus();

        return false;

    }


    if(!isValidPhone(phone)){

        showToast(
            "Please enter a valid mobile number.",
            "error"
        );

        getElement("enquiryPhone")
        ?.focus();

        return false;

    }


    if(message && message.length < 10){

        showToast(
            "Please write a slightly longer message.",
            "error"
        );

        getElement("enquiryMessage")
        ?.focus();

        return false;

    }


    return true;

}


/* ======================================================
   ENQUIRY SUBMISSION
====================================================== */

async function handleEnquirySubmission(event){

    event.preventDefault();


    if(!validateEnquiryForm()){
        return;
    }


    const submitButton =
    enquiryForm?.querySelector(
        'button[type="submit"]'
    );


    const originalButtonContent =
    submitButton?.innerHTML;


    if(submitButton){

        submitButton.disabled = true;

        submitButton.innerHTML = `
            <i class="fa-solid fa-spinner fa-spin"></i>
            Sending...
        `;

    }


    const enquiryPayload = {

        academyId:
        academy.id,

        academySlug:
        academySlug,

        academyName:
        academy.name,

        name:
        getFormValue("enquiryName"),

        email:
        getFormValue("enquiryEmail"),

        phone:
        getFormValue("enquiryPhone"),

        program:
        getFormValue("enquiryProgram"),

        message:
        getFormValue("enquiryMessage"),

        source:
        "academy-profile",

        submittedAt:
        new Date().toISOString()

    };


    try{

        /*
        ==================================================
        BACKEND INTEGRATION PLACEHOLDER FOR MR. HARSH

        Replace the frontend simulation below with:

        const response = await fetch(
            `/api/v1/academies/${academy.id}/enquiries`,
            {
                method:"POST",
                headers:{
                    "Content-Type":"application/json"
                },
                body:JSON.stringify(enquiryPayload)
            }
        );

        if(!response.ok){
            throw new Error("Unable to submit enquiry.");
        }
        ==================================================
        */


        await new Promise(resolve => {

            window.setTimeout(
                resolve,
                900
            );

        });


        console.info(
            "Academy enquiry payload:",
            enquiryPayload
        );


        enquiryForm?.reset();

        closeEnquiryModal();


        showToast(
            `Your enquiry for ${academy.name} has been prepared successfully.`,
            "success"
        );

    }catch(error){

        console.error(
            "Academy enquiry error:",
            error
        );


        showToast(
            "Unable to send the enquiry. Please try again.",
            "error"
        );

    }finally{

        if(submitButton){

            submitButton.disabled = false;

            submitButton.innerHTML =
            originalButtonContent ||
            `
                <i class="fa-solid fa-paper-plane"></i>
                Send Enquiry
            `;

        }

    }

}


/* ======================================================
   SHARE ACADEMY
====================================================== */

async function shareAcademyProfile(){

    const shareData = {

        title:
        `${academy.name} | FIFA Mission India`,

        text:
        `View ${academy.name} on FIFA Mission India.`,

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


        if(navigator.clipboard){

            await navigator.clipboard.writeText(
                window.location.href
            );

            showToast(
                "Academy profile link copied.",
                "success"
            );

            return;

        }


        showToast(
            "Copy the page URL from your browser.",
            "info"
        );

    }catch(error){

        if(error?.name === "AbortError"){
            return;
        }


        console.error(
            "Academy share error:",
            error
        );


        showToast(
            "Unable to share this academy profile.",
            "error"
        );

    }

}


/* ======================================================
   TOAST NOTIFICATION
====================================================== */

let toastTimeout = null;


function showToast(message,type = "success"){

    if(
        !toast ||
        !toastMessage ||
        !toastIcon
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
                enquiryModal &&
                !enquiryModal.hidden
            ){

                closeEnquiryModal();
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
   INITIAL PAGE STATE
====================================================== */

function showAcademyProfile(){

    if(profileMain){
        profileMain.hidden = false;
    }

    if(notFound){
        notFound.hidden = true;
    }

}


function showAcademyNotFound(){

    if(profileMain){
        profileMain.hidden = true;
    }

    if(notFound){
        notFound.hidden = false;
    }

}

/* ======================================================
   RESET PAGE OVERLAYS
====================================================== */

function resetPageOverlays(){

    if(loader){

        loader.hidden = false;

        loader.style.opacity = "1";

        loader.style.visibility = "visible";

        loader.style.pointerEvents = "auto";

    }


    if(mobileMenu){

        mobileMenu.hidden = true;

    }


    if(mobileOverlay){

        mobileOverlay.hidden = true;

    }


    if(enquiryModal){

        enquiryModal.hidden = true;

    }


    if(toast){

        toast.hidden = true;

    }


    document.body.style.overflow = "";

}

/* ======================================================
   REMOVE PAGE LOADER
====================================================== */

function hidePageLoader(){

    if(!loader){
        return;
    }


    loader.style.opacity = "0";

    loader.style.visibility = "hidden";

    loader.style.pointerEvents = "none";


    window.setTimeout(
        () => {

            loader.hidden = true;

            loader.style.display = "none";

        },
        350
    );

}


/* ======================================================
   APPLICATION INITIALIZATION
====================================================== */

function initializeAcademyProfile(){

    resetPageOverlays();


    initializeMobileMenu();

    initializeNavbarScroll();

    initializeEnquiryModal();

    initializeKeyboardEvents();


    enquiryForm?.addEventListener(
        "submit",
        handleEnquirySubmission
    );


    shareButton?.addEventListener(
        "click",
        shareAcademyProfile
    );


    if(!academy){

        showAcademyNotFound();

        hidePageLoader();

        return;

    }


    renderAcademyInformation();

    renderDynamicContent();

    showAcademyProfile();

    hidePageLoader();

}

/* ======================================================
   START APPLICATION
====================================================== */

if(document.readyState === "loading"){

    document.addEventListener(
        "DOMContentLoaded",
        initializeAcademyProfile
    );

}else{

    initializeAcademyProfile();

}
