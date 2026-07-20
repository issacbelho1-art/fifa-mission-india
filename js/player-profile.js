"use strict";

/* =====================================================
   LOCAL PLAYER PROFILE DATA
   Temporary frontend data until backend integration
===================================================== */

const localPlayers = {

    "arjun-sharma": {

        name: "Arjun Sharma",
        role: "Attacking Midfielder",
        position: "CAM",
        academy: "Delhi Football Academy",
        age: "18",
        state: "Delhi",
        foot: "Right",
        jersey: "10",
        image: "images/player1.jpg",

        summary:
            "A technically gifted attacking midfielder known for creativity, close control and creating opportunities in the final third."

    },

    "rahul-singh": {

        name: "Rahul Singh",
        role: "Striker",
        position: "ST",
        academy: "Manipur Youth Academy",
        age: "17",
        state: "Manipur",
        foot: "Left",
        jersey: "9",
        image: "images/player2.jpg",

        summary:
            "A powerful striker known for intelligent movement, confident finishing and creating danger inside the penalty area."

    },

    "daniel-zeliang": {

        name: "Daniel Zeliang",
        role: "Centre-Back",
        position: "CB",
        academy: "Nagaland Football Academy",
        age: "19",
        state: "Nagaland",
        foot: "Right",
        jersey: "5",
        image: "images/player3.jpg",

        summary:
            "A composed centre-back known for defensive awareness, strength in challenges and reliable ball distribution."

    }

};


/* =====================================================
   GET PLAYER FROM PAGE URL
===================================================== */

const profileUrlParameters =
    new URLSearchParams(
        window.location.search
    );

const requestedLocalPlayerId =
    profileUrlParameters.get("id") ||
    "arjun-sharma";

const selectedLocalPlayer =
    localPlayers[requestedLocalPlayerId] ||
    localPlayers["arjun-sharma"];


/* =====================================================
   SAFE TEXT UPDATE
===================================================== */

function updateProfileText(
    elementId,
    value
) {

    const element =
        document.getElementById(
            elementId
        );

    if (!element) return;

    element.textContent =
        value;

}


/* =====================================================
   APPLY LOCAL PLAYER PROFILE
===================================================== */

function applyLocalPlayerProfile(
    player
) {

    if (!player) return;

    updateProfileText(
        "breadcrumbPlayerName",
        player.name
    );

    updateProfileText(
        "playerName",
        player.name
    );

    updateProfileText(
        "playerRole",
        player.role
    );

    updateProfileText(
        "playerPosition",
        player.position
    );

    updateProfileText(
        "playerPositionBadge",
        player.position
    );

    updateProfileText(
        "playerAcademy",
        player.academy
    );

    updateProfileText(
        "playerClub",
        player.academy
    );

    updateProfileText(
        "playerAge",
        player.age
    );

    updateProfileText(
        "playerState",
        player.state
    );

    updateProfileText(
        "playerLocation",
        player.state
    );

    updateProfileText(
        "playerFoot",
        player.foot
    );

    updateProfileText(
        "playerJersey",
        player.jersey
    );

    updateProfileText(
        "playerSummary",
        player.summary
    );

    updateProfileText(
        "playerBiography",
        player.summary
    );

    updateProfileText(
        "playerFullName",
        player.name
    );

    updateProfileText(
        "playerPrimaryPosition",
        player.role
    );

    updateProfileText(
        "playerPreferredFoot",
        player.foot
    );

    updateProfileText(
        "playerCurrentAcademy",
        player.academy
    );


    const profileImages = [

        document.getElementById(
            "playerProfileImage"
        ),

        document.getElementById(
            "playerPhoto"
        ),

        document.querySelector(
            ".player-profile-photo img"
        )

    ];


    profileImages.forEach(image => {

        if (!image) return;

        image.src =
            player.image;

        image.alt =
            `${player.name} football profile`;

    });


    const mainContent =
        document.getElementById(
            "mainContent"
        );

    if (mainContent) {

        mainContent.dataset.playerId =
            requestedLocalPlayerId;

    }


    document.title =
        `${player.name} | FIFA Mission India`;

}


/* =====================================================
   PLAYER PROFILE
   player-profile.js
   PART 1A
   PAGE LOADER • CURRENT YEAR • STICKY NAVBAR
   MOBILE MENU • SMOOTH SCROLL
===================================================== */

"use strict";

/* =====================================================
   DOM REFERENCES
===================================================== */

const pageLoader =
    document.getElementById("pageLoader");

const profileNavbar =
    document.getElementById("profileNavbar");

const menuButton =
    document.getElementById("profileMenuButton");

const mobileMenu =
    document.getElementById("profileMobileMenu");

const currentYear =
    document.getElementById("currentYear");


/* =====================================================
   PAGE LOADER
===================================================== */

window.addEventListener(
    "load",
    () => {

        if (!pageLoader) return;

        pageLoader.style.opacity = "0";

        pageLoader.style.pointerEvents = "none";

        setTimeout(() => {

            pageLoader.remove();

        }, 500);

    }
);


/* =====================================================
   CURRENT YEAR
===================================================== */

if (currentYear) {

    currentYear.textContent =
        new Date().getFullYear();

}


/* =====================================================
   STICKY NAVBAR
===================================================== */

function updateNavbar() {

    if (!profileNavbar) return;

    if (window.scrollY > 40) {

        profileNavbar.classList.add("scrolled");

    } else {

        profileNavbar.classList.remove("scrolled");

    }

}

updateNavbar();

window.addEventListener(
    "scroll",
    updateNavbar,
    {
        passive: true
    }
);


/* =====================================================
   MOBILE MENU
===================================================== */

if (menuButton && mobileMenu) {

    menuButton.addEventListener(
        "click",
        () => {

            const expanded =
                menuButton.getAttribute("aria-expanded") === "true";

            menuButton.setAttribute(
                "aria-expanded",
                String(!expanded)
            );

            menuButton.classList.toggle("active");

            mobileMenu.hidden = expanded;

        }
    );

}


/* =====================================================
   CLOSE MENU WHEN LINK CLICKED
===================================================== */

document
    .querySelectorAll("#profileMobileMenu a")
    .forEach(link => {

        link.addEventListener(
            "click",
            () => {

                if (!mobileMenu || !menuButton) return;

                mobileMenu.hidden = true;

                menuButton.classList.remove("active");

                menuButton.setAttribute(
                    "aria-expanded",
                    "false"
                );

            }
        );

    });


/* =====================================================
   CLOSE MENU ON RESIZE
===================================================== */

window.addEventListener(
    "resize",
    () => {

        if (
            window.innerWidth > 1120 &&
            mobileMenu &&
            menuButton
        ) {

            mobileMenu.hidden = true;

            menuButton.classList.remove("active");

            menuButton.setAttribute(
                "aria-expanded",
                "false"
            );

        }

    }
);


/* =====================================================
   SMOOTH SECTION NAVIGATION
===================================================== */

document
    .querySelectorAll(
        ".profile-section-link"
    )
    .forEach(link => {

        link.addEventListener(
            "click",
            event => {

                const targetId =
                    link.getAttribute("href");

                if (!targetId?.startsWith("#")) return;

                const target =
                    document.querySelector(targetId);

                if (!target) return;

                event.preventDefault();

                const offset = 140;

                const top =
                    target.getBoundingClientRect().top +
                    window.scrollY -
                    offset;

                window.scrollTo({

                    top,

                    behavior: "smooth"

                });

            }
        );

    });


/* =====================================================
   ACTIVE SECTION NAVIGATION
===================================================== */

const sectionLinks =
    document.querySelectorAll(
        ".profile-section-link"
    );

const sections =
    [...sectionLinks]
        .map(link => {

            const id =
                link.getAttribute("href");

            return document.querySelector(id);

        })
        .filter(Boolean);


function updateActiveSection() {

    let current = "";

    sections.forEach(section => {

        const top =
            section.offsetTop - 180;

        if (window.scrollY >= top) {

            current = "#" + section.id;

        }

    });

    sectionLinks.forEach(link => {

        link.classList.toggle(

            "active",

            link.getAttribute("href") === current

        );

    });

}

updateActiveSection();

window.addEventListener(

    "scroll",

    updateActiveSection,

    {

        passive: true

    }

);

/* =====================================================
   PLAYER PROFILE
   player-profile.js
   PART 1B
   REVEAL ANIMATIONS
   STAT COUNTERS
   ATTRIBUTE PROGRESS
===================================================== */

"use strict";

/* =====================================================
   REVEAL ELEMENTS
===================================================== */

const revealElements =
    document.querySelectorAll(".reveal");


function revealOnScroll(entries, observer) {

    entries.forEach(entry => {

        if (!entry.isIntersecting) return;

        entry.target.classList.add("active");

        observer.unobserve(entry.target);

    });

}


const revealObserver =
    new IntersectionObserver(

        revealOnScroll,

        {

            threshold: 0.15

        }

    );


revealElements.forEach(element => {

    revealObserver.observe(element);

});


/* =====================================================
   NUMBER COUNTERS
===================================================== */

const statNumbers =
    document.querySelectorAll(
        ".player-stat-number"
    );


function animateCounter(element) {

    const target =
        Number(
            element.dataset.count
        );

    if (!target) return;

    const duration = 1800;

    const startTime =
        performance.now();

    function update(time) {

        const progress =
            Math.min(

                (time - startTime) / duration,

                1

            );

        const eased =
            1 -
            Math.pow(

                1 - progress,

                3

            );

        const current =
            Math.floor(
                eased * target
            );

        element.textContent =
            current;

        if (progress < 1) {

            requestAnimationFrame(update);

        } else {

            element.textContent =
                target;

        }

    }

    requestAnimationFrame(update);

}


const counterObserver =
    new IntersectionObserver(

        entries => {

            entries.forEach(entry => {

                if (!entry.isIntersecting) return;

                animateCounter(entry.target);

                counterObserver.unobserve(
                    entry.target
                );

            });

        },

        {

            threshold: 0.45

        }

    );


statNumbers.forEach(stat => {

    counterObserver.observe(stat);

});


/* =====================================================
   ATTRIBUTE PROGRESS BARS
===================================================== */

const attributes =
    document.querySelectorAll(
        ".player-attribute"
    );


const attributeObserver =
    new IntersectionObserver(

        entries => {

            entries.forEach(entry => {

                if (!entry.isIntersecting) return;

                const value =
                    entry.target.dataset.value || 0;

                entry.target.style.setProperty(

                    "--attribute-value",

                    `${value}%`

                );

                entry.target.classList.add(
                    "attribute-active"
                );

                attributeObserver.unobserve(
                    entry.target
                );

            });

        },

        {

            threshold: 0.30

        }

    );


attributes.forEach(attribute => {

    attributeObserver.observe(attribute);

});


/* =====================================================
   CARD HOVER TILT
===================================================== */

const tiltCards =
    document.querySelectorAll(

        ".player-stat-card, \
         .player-achievement-card, \
         .player-highlight-card"

    );


tiltCards.forEach(card => {

    card.addEventListener(

        "mousemove",

        event => {

            if (
                window.innerWidth < 992
            ) return;

            const rect =
                card.getBoundingClientRect();

            const x =
                event.clientX -
                rect.left;

            const y =
                event.clientY -
                rect.top;

            const rotateX =
                ((y / rect.height) - 0.5) * -8;

            const rotateY =
                ((x / rect.width) - 0.5) * 8;

            card.style.transform =

                `perspective(900px)
                 rotateX(${rotateX}deg)
                 rotateY(${rotateY}deg)
                 translateY(-6px)`;

        }

    );


    card.addEventListener(

        "mouseleave",

        () => {

            card.style.transform = "";

        }

    );

});


/* =====================================================
   HERO IMAGE PARALLAX
===================================================== */

const heroImage =
    document.querySelector(
        ".player-profile-photo img"
    );


window.addEventListener(

    "scroll",

    () => {

        if (!heroImage) return;

        if (window.innerWidth < 992)
            return;

        const offset =
            window.scrollY * 0.18;

        heroImage.style.transform =

            `translateY(${offset}px)`;

    },

    {

        passive: true

    }

);


/* =====================================================
   FADE HERO CONTENT
===================================================== */

const heroSection =
    document.querySelector(
        ".player-profile-hero"
    );


window.addEventListener(

    "scroll",

    () => {

        if (!heroSection) return;

        const opacity =
            Math.max(

                1 -
                window.scrollY / 600,

                0

            );

        heroSection.style.opacity =
            opacity;

    },

    {

        passive: true

    }

);

/* =====================================================
   PLAYER PROFILE
   player-profile.js
   PART 1C
   VIDEO MODAL • ENQUIRY MODAL • VALIDATION
   SHARE PROFILE • NOTIFICATIONS • API PLACEHOLDERS
===================================================== */


/* =====================================================
   DOM REFERENCES
===================================================== */

const videoModal =
    document.getElementById("videoModal");

const profileHighlightVideo =
    document.getElementById("profileHighlightVideo");

const highlightCards =
    document.querySelectorAll(
        ".player-highlight-card"
    );

const enquiryModal =
    document.getElementById("enquiryModal");

const playerEnquiryButton =
    document.getElementById("playerEnquiryButton");

const playerEnquiryForm =
    document.getElementById("playerEnquiryForm");

const shareProfileButton =
    document.getElementById("shareProfileButton");

const profileNotification =
    document.getElementById("profileNotification");


let activeModal = null;

let lastFocusedElement = null;

let notificationTimer = null;


/* =====================================================
   NOTIFICATION
===================================================== */

function showProfileNotification(
    message,
    type = "default"
) {

    if (!profileNotification) return;

    window.clearTimeout(
        notificationTimer
    );

    profileNotification.textContent =
        message;

    profileNotification.classList.remove(
        "success",
        "error",
        "show"
    );

    if (
        type === "success" ||
        type === "error"
    ) {

        profileNotification.classList.add(
            type
        );

    }

    requestAnimationFrame(() => {

        profileNotification.classList.add(
            "show"
        );

    });

    notificationTimer =
        window.setTimeout(() => {

            profileNotification.classList.remove(
                "show"
            );

        }, 4200);

}


/* =====================================================
   MODAL UTILITIES
===================================================== */

function getFocusableElements(modal) {

    if (!modal) return [];

    return Array.from(

        modal.querySelectorAll(

            'a[href], button:not([disabled]), input:not([disabled]), ' +
            'select:not([disabled]), textarea:not([disabled]), ' +
            '[tabindex]:not([tabindex="-1"])'

        )

    ).filter(element => {

        return !element.hidden &&
            element.offsetParent !== null;

    });

}


function openProfileModal(modal) {

    if (!modal) return;

    lastFocusedElement =
        document.activeElement;

    activeModal = modal;

    modal.hidden = false;

    document.body.classList.add(
        "modal-open"
    );

    const focusableElements =
        getFocusableElements(modal);

    if (focusableElements.length) {

        window.setTimeout(() => {

            focusableElements[0].focus();

        }, 50);

    }

}


function closeProfileModal(modal) {

    if (!modal) return;

    modal.hidden = true;

    document.body.classList.remove(
        "modal-open"
    );

    activeModal = null;

    if (
        lastFocusedElement &&
        typeof lastFocusedElement.focus === "function"
    ) {

        lastFocusedElement.focus();

    }

}


/* =====================================================
   MODAL KEYBOARD CONTROL
===================================================== */

document.addEventListener(
    "keydown",
    event => {

        if (!activeModal) return;

        if (event.key === "Escape") {

            if (
                activeModal === videoModal &&
                profileHighlightVideo
            ) {

                profileHighlightVideo.pause();

                profileHighlightVideo.removeAttribute(
                    "src"
                );

                profileHighlightVideo.load();

            }

            closeProfileModal(
                activeModal
            );

            return;

        }

        if (event.key !== "Tab") return;

        const focusableElements =
            getFocusableElements(
                activeModal
            );

        if (!focusableElements.length) return;

        const firstElement =
            focusableElements[0];

        const lastElement =
            focusableElements[
                focusableElements.length - 1
            ];

        if (
            event.shiftKey &&
            document.activeElement === firstElement
        ) {

            event.preventDefault();

            lastElement.focus();

        } else if (
            !event.shiftKey &&
            document.activeElement === lastElement
        ) {

            event.preventDefault();

            firstElement.focus();

        }

    }
);


/* =====================================================
   VIDEO MODAL
===================================================== */

function openHighlightVideo(card) {

    if (
        !card ||
        !videoModal ||
        !profileHighlightVideo
    ) return;

    const videoSource =
        card.dataset.videoSrc;

    if (!videoSource) {

        showProfileNotification(
            "This highlight video is not available yet.",
            "error"
        );

        return;

    }

    profileHighlightVideo.src =
        videoSource;

    openProfileModal(
        videoModal
    );

    profileHighlightVideo
        .play()
        .catch(() => {

            /*
             Browsers may block autoplay.
             The user can still press the video play button.
            */

        });

}


highlightCards.forEach(card => {

    const playButton =
        card.querySelector(
            ".highlight-play-button"
        );

    if (!playButton) return;

    playButton.addEventListener(
        "click",
        event => {

            event.preventDefault();

            openHighlightVideo(card);

        }
    );

});


document
    .querySelectorAll("[data-close-modal]")
    .forEach(closeButton => {

        closeButton.addEventListener(
            "click",
            () => {

                if (profileHighlightVideo) {

                    profileHighlightVideo.pause();

                    profileHighlightVideo.removeAttribute(
                        "src"
                    );

                    profileHighlightVideo.load();

                }

                closeProfileModal(
                    videoModal
                );

            }
        );

    });


/* =====================================================
   ENQUIRY MODAL
===================================================== */

if (
    playerEnquiryButton &&
    enquiryModal
) {

    playerEnquiryButton.addEventListener(
        "click",
        () => {

            openProfileModal(
                enquiryModal
            );

        }
    );

}


document
    .querySelectorAll("[data-close-enquiry]")
    .forEach(closeButton => {

        closeButton.addEventListener(
            "click",
            () => {

                closeProfileModal(
                    enquiryModal
                );

            }
        );

    });


/* =====================================================
   FORM VALIDATION
===================================================== */

function validateEnquiryField(field) {

    if (!field) return false;

    const value =
        field.value.trim();

    let valid = true;

    if (field.required && !value) {

        valid = false;

    }

    if (
        field.type === "email" &&
        value
    ) {

        const emailPattern =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        valid =
            emailPattern.test(value);

    }

    field.classList.toggle(
        "invalid",
        !valid
    );

    field.setAttribute(
        "aria-invalid",
        String(!valid)
    );

    return valid;

}


function validateEnquiryForm() {

    if (!playerEnquiryForm) return false;

    const fields =
        playerEnquiryForm.querySelectorAll(
            "input, select, textarea"
        );

    let formIsValid = true;

    fields.forEach(field => {

        const fieldIsValid =
            validateEnquiryField(field);

        if (!fieldIsValid) {

            formIsValid = false;

        }

    });

    return formIsValid;

}


if (playerEnquiryForm) {

    playerEnquiryForm
        .querySelectorAll(
            "input, select, textarea"
        )
        .forEach(field => {

            field.addEventListener(
                "input",
                () => {

                    if (
                        field.classList.contains(
                            "invalid"
                        )
                    ) {

                        validateEnquiryField(
                            field
                        );

                    }

                }
            );

            field.addEventListener(
                "change",
                () => {

                    validateEnquiryField(
                        field
                    );

                }
            );

        });

}


/* =====================================================
   GET CURRENT PLAYER ID
===================================================== */

function getCurrentPlayerId() {

    const queryParameters =
        new URLSearchParams(
            window.location.search
        );

    const playerIdFromUrl =
        queryParameters.get("id");

    const mainContent =
        document.getElementById(
            "mainContent"
        );

    const playerIdFromPage =
        mainContent?.dataset.playerId;

    return (
        playerIdFromUrl ||
        playerIdFromPage ||
        null
    );

}


/* =====================================================
   SUBMIT SCOUT ENQUIRY
===================================================== */

async function submitPlayerEnquiry(
    formData
) {

    const playerId =
        getCurrentPlayerId();

    const enquiryPayload = {

        playerId,

        name:
            String(
                formData.get("name") || ""
            ).trim(),

        email:
            String(
                formData.get("email") || ""
            ).trim(),

        organisation:
            String(
                formData.get("organisation") || ""
            ).trim(),

        role:
            String(
                formData.get("role") || ""
            ).trim(),

        message:
            String(
                formData.get("message") || ""
            ).trim(),

        source:
            "public-player-profile",

        submittedAt:
            new Date().toISOString()

    };


    /*
     =====================================================
     BACKEND INTEGRATION PLACEHOLDER FOR MR. HARSH

     Replace the temporary frontend response below with:

     const response = await fetch(
         `/api/v1/players/${playerId}/enquiries`,
         {
             method: "POST",
             headers: {
                 "Content-Type": "application/json"
             },
             body: JSON.stringify(enquiryPayload)
         }
     );

     if (!response.ok) {
         throw new Error(
             "Unable to submit player enquiry."
         );
     }

     return await response.json();
     =====================================================
    */


    await new Promise(resolve => {

        window.setTimeout(
            resolve,
            900
        );

    });

    console.info(
        "Player enquiry payload:",
        enquiryPayload
    );

    return {

        success: true,

        message:
            "Your enquiry has been submitted for review."

    };

}


if (playerEnquiryForm) {

    playerEnquiryForm.addEventListener(
        "submit",
        async event => {

            event.preventDefault();

            const formIsValid =
                validateEnquiryForm();

            if (!formIsValid) {

                const firstInvalidField =
                    playerEnquiryForm.querySelector(
                        ".invalid"
                    );

                firstInvalidField?.focus();

                showProfileNotification(
                    "Please complete all required enquiry fields correctly.",
                    "error"
                );

                return;

            }

            const submitButton =
                playerEnquiryForm.querySelector(
                    ".enquiry-submit-button"
                );

            const originalButtonText =
                submitButton?.textContent;

            if (submitButton) {

                submitButton.disabled = true;

                submitButton.textContent =
                    "Submitting...";

            }

            try {

                const result =
                    await submitPlayerEnquiry(

                        new FormData(
                            playerEnquiryForm
                        )

                    );

                playerEnquiryForm.reset();

                playerEnquiryForm
                    .querySelectorAll(".invalid")
                    .forEach(field => {

                        field.classList.remove(
                            "invalid"
                        );

                        field.removeAttribute(
                            "aria-invalid"
                        );

                    });

                closeProfileModal(
                    enquiryModal
                );

                showProfileNotification(
                    result.message ||
                    "Your enquiry has been submitted successfully.",
                    "success"
                );

            } catch (error) {

                console.error(
                    "Player enquiry submission failed:",
                    error
                );

                showProfileNotification(
                    "We could not submit your enquiry. Please try again.",
                    "error"
                );

            } finally {

                if (submitButton) {

                    submitButton.disabled = false;

                    submitButton.textContent =
                        originalButtonText ||
                        "Submit Enquiry";

                }

            }

        }
    );

}


/* =====================================================
   SHARE PROFILE
===================================================== */

async function copyProfileLink() {

    try {

        await navigator.clipboard.writeText(
            window.location.href
        );

        showProfileNotification(
            "Player profile link copied.",
            "success"
        );

    } catch (error) {

        const temporaryInput =
            document.createElement(
                "textarea"
            );

        temporaryInput.value =
            window.location.href;

        temporaryInput.setAttribute(
            "readonly",
            ""
        );

        temporaryInput.style.position =
            "fixed";

        temporaryInput.style.opacity =
            "0";

        document.body.appendChild(
            temporaryInput
        );

        temporaryInput.select();

        const copied =
            document.execCommand("copy");

        temporaryInput.remove();

        showProfileNotification(

            copied
                ? "Player profile link copied."
                : "Unable to copy the profile link.",

            copied
                ? "success"
                : "error"

        );

    }

}


if (shareProfileButton) {

    shareProfileButton.addEventListener(
        "click",
        async () => {

            const playerName =
                document
                    .getElementById(
                        "playerName"
                    )
                    ?.textContent
                    ?.trim() ||
                "Player";

            const shareData = {

                title:
                    `${playerName} | FIFA Mission India`,

                text:
                    `View ${playerName}'s football profile on FIFA Mission India.`,

                url:
                    window.location.href

            };

            if (
                typeof navigator.share ===
                "function"
            ) {

                try {

                    await navigator.share(
                        shareData
                    );

                } catch (error) {

                    if (
                        error.name !==
                        "AbortError"
                    ) {

                        await copyProfileLink();

                    }

                }

                return;

            }

            await copyProfileLink();

        }
    );

}

/* =====================================================
   PLAYER PROFILE
   player-profile.js
   PART 1D
   SAVE PLAYER • MODAL BACKDROP • PROFILE DATA
   ERROR HANDLING • FINAL INITIALISATION
===================================================== */


/* =====================================================
   ADDITIONAL DOM REFERENCES
===================================================== */

const savePlayerButton =
    document.getElementById("savePlayerButton");

const playerNameElement =
    document.getElementById("playerName");

const playerPositionElement =
    document.getElementById("playerPosition");

const playerClubElement =
    document.getElementById("playerClub");

const playerLocationElement =
    document.getElementById("playerLocation");

const playerAgeElement =
    document.getElementById("playerAge");

const playerFootElement =
    document.getElementById("playerFoot");

const playerHeightElement =
    document.getElementById("playerHeight");

const playerPhotoElement =
    document.getElementById("playerPhoto");

const playerBiographyElement =
    document.getElementById("playerBiography");


/* =====================================================
   CLOSE MODAL WHEN BACKDROP IS CLICKED
===================================================== */

document.addEventListener(
    "click",
    event => {

        const videoBackdrop =
            event.target.closest(
                ".profile-modal-backdrop"
            );

        if (!videoBackdrop) return;

        const modal =
            videoBackdrop.closest(
                ".profile-modal"
            );

        if (!modal) return;

        if (
            modal === videoModal &&
            profileHighlightVideo
        ) {

            profileHighlightVideo.pause();

            profileHighlightVideo.removeAttribute(
                "src"
            );

            profileHighlightVideo.load();

        }

        closeProfileModal(modal);

    }
);


/* =====================================================
   SAVE PLAYER STATE
===================================================== */

function getSavedPlayers() {

    try {

        const savedPlayers =
            localStorage.getItem(
                "fifaMissionSavedPlayers"
            );

        return savedPlayers
            ? JSON.parse(savedPlayers)
            : [];

    } catch (error) {

        console.error(
            "Unable to read saved players:",
            error
        );

        return [];

    }

}


function storeSavedPlayers(players) {

    try {

        localStorage.setItem(

            "fifaMissionSavedPlayers",

            JSON.stringify(players)

        );

        return true;

    } catch (error) {

        console.error(
            "Unable to save player:",
            error
        );

        return false;

    }

}


function updateSavePlayerButton() {

    if (!savePlayerButton) return;

    const playerId =
        getCurrentPlayerId() ||
        "default-player";

    const savedPlayers =
        getSavedPlayers();

    const isSaved =
        savedPlayers.includes(
            playerId
        );

    savePlayerButton.classList.toggle(
        "saved",
        isSaved
    );

    savePlayerButton.setAttribute(
        "aria-pressed",
        String(isSaved)
    );

    savePlayerButton.setAttribute(

        "aria-label",

        isSaved
            ? "Remove player from saved profiles"
            : "Save player profile"

    );

    const buttonText =
        savePlayerButton.querySelector(
            "[data-save-text]"
        );

    if (buttonText) {

        buttonText.textContent =
            isSaved
                ? "Saved"
                : "Save Player";

    }

}


if (savePlayerButton) {

    savePlayerButton.addEventListener(
        "click",
        () => {

            const playerId =
                getCurrentPlayerId() ||
                "default-player";

            const savedPlayers =
                getSavedPlayers();

            const playerIndex =
                savedPlayers.indexOf(
                    playerId
                );

            let message = "";

            if (playerIndex >= 0) {

                savedPlayers.splice(
                    playerIndex,
                    1
                );

                message =
                    "Player removed from saved profiles.";

            } else {

                savedPlayers.push(
                    playerId
                );

                message =
                    "Player saved successfully.";

            }

            const stored =
                storeSavedPlayers(
                    savedPlayers
                );

            if (!stored) {

                showProfileNotification(
                    "Unable to update saved players.",
                    "error"
                );

                return;

            }

            updateSavePlayerButton();

            showProfileNotification(
                message,
                "success"
            );

        }
    );

}


/* =====================================================
   PLAYER DATA RENDERING
===================================================== */

function safelySetText(
    element,
    value,
    fallback = "Not available"
) {

    if (!element) return;

    element.textContent =
        value || fallback;

}


function renderPlayerProfile(player) {

    if (!player) return;

    safelySetText(
        playerNameElement,
        player.fullName
    );

    safelySetText(
        playerPositionElement,
        player.position
    );

    safelySetText(
        playerClubElement,
        player.club
    );

    safelySetText(
        playerLocationElement,
        player.location
    );

    safelySetText(
        playerAgeElement,
        player.age
            ? `${player.age} years`
            : ""
    );

    safelySetText(
        playerFootElement,
        player.preferredFoot
    );

    safelySetText(
        playerHeightElement,
        player.height
    );

    safelySetText(
        playerBiographyElement,
        player.biography
    );

    if (
        playerPhotoElement &&
        player.profileImage
    ) {

        playerPhotoElement.src =
            player.profileImage;

        playerPhotoElement.alt =
            `${player.fullName || "Player"} football profile`;

    }

    document.title =
        `${player.fullName || "Player Profile"} | FIFA Mission India`;

}


/* =====================================================
   STATISTICS RENDERING
===================================================== */

function renderPlayerStatistics(
    statistics = {}
) {

    document
        .querySelectorAll(
            "[data-stat-key]"
        )
        .forEach(element => {

            const key =
                element.dataset.statKey;

            if (
                !Object.prototype.hasOwnProperty.call(
                    statistics,
                    key
                )
            ) return;

            const value =
                Number(
                    statistics[key]
                ) || 0;

            element.dataset.count =
                String(value);

            element.textContent = "0";

        });

}


/* =====================================================
   ATTRIBUTE RENDERING
===================================================== */

function renderPlayerAttributes(
    attributesData = {}
) {

    document
        .querySelectorAll(
            ".player-attribute[data-attribute-key]"
        )
        .forEach(attribute => {

            const key =
                attribute.dataset.attributeKey;

            if (
                !Object.prototype.hasOwnProperty.call(
                    attributesData,
                    key
                )
            ) return;

            const value =
                Math.min(

                    Math.max(

                        Number(
                            attributesData[key]
                        ) || 0,

                        0

                    ),

                    100

                );

            attribute.dataset.value =
                String(value);

            const valueElement =
                attribute.querySelector(
                    ".attribute-value"
                );

            if (valueElement) {

                valueElement.textContent =
                    String(value);

            }

        });

}


/* =====================================================
   FETCH PLAYER PROFILE
===================================================== */

async function fetchPlayerProfile() {

    const playerId =
        getCurrentPlayerId();

    if (!playerId) {

        return null;

    }


    /*
     =====================================================
     BACKEND INTEGRATION PLACEHOLDER FOR MR. HARSH

     Replace the temporary return below with:

     const response = await fetch(
         `/api/v1/players/${encodeURIComponent(playerId)}`,
         {
             method: "GET",
             headers: {
                 "Accept": "application/json"
             }
         }
     );

     if (response.status === 404) {
         throw new Error("PLAYER_NOT_FOUND");
     }

     if (!response.ok) {
         throw new Error("PLAYER_FETCH_FAILED");
     }

     return await response.json();
     =====================================================
    */


    return null;

}


/* =====================================================
   LOAD DYNAMIC PLAYER PROFILE
===================================================== */

async function loadBackendPlayerProfile() {

    try {

        const player =
            await fetchPlayerProfile();

        if (!player) {

            return;

        }

        renderPlayerProfile(player);

        renderPlayerStatistics(
            player.statistics
        );

        renderPlayerAttributes(
            player.attributes
        );

    } catch (error) {

        console.error(
            "Unable to load player profile:",
            error
        );

        if (
            error.message ===
            "PLAYER_NOT_FOUND"
        ) {

            showProfileNotification(
                "This player profile could not be found.",
                "error"
            );

            return;

        }

        showProfileNotification(
            "Some player information could not be loaded.",
            "error"
        );

    }

}


/* =====================================================
   IMAGE ERROR FALLBACK
===================================================== */

document
    .querySelectorAll(
        "img[data-fallback-src]"
    )
    .forEach(image => {

        image.addEventListener(
            "error",
            () => {

                const fallbackSource =
                    image.dataset.fallbackSrc;

                if (
                    !fallbackSource ||
                    image.src.endsWith(
                        fallbackSource
                    )
                ) return;

                image.src =
                    fallbackSource;

            }
        );

    });


/* =====================================================
   EXTERNAL LINK SECURITY
===================================================== */

document
    .querySelectorAll(
        'a[target="_blank"]'
    )
    .forEach(link => {

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

            Array.from(
                relValues
            ).join(" ")

        );

    });


/* =====================================================
   PREVENT RAPID FORM RESUBMISSION
===================================================== */

let lastEnquirySubmissionTime = 0;

if (playerEnquiryForm) {

    playerEnquiryForm.addEventListener(
        "submit",
        event => {

            const currentTime =
                Date.now();

            if (
                currentTime -
                lastEnquirySubmissionTime <
                2500
            ) {

                event.preventDefault();

                showProfileNotification(
                    "Please wait before submitting again.",
                    "error"
                );

                return;

            }

            lastEnquirySubmissionTime =
                currentTime;

        },
        true
    );

}


/* =====================================================
   ONLINE AND OFFLINE STATUS
===================================================== */

window.addEventListener(
    "offline",
    () => {

        showProfileNotification(
            "You are offline. Some profile features may not work.",
            "error"
        );

    }
);


window.addEventListener(
    "online",
    () => {

        showProfileNotification(
            "Internet connection restored.",
            "success"
        );

    }
);


/* =====================================================
   FINAL PAGE INITIALISATION
===================================================== */

async function initialisePlayerProfile() {

    applyLocalPlayerProfile(
        selectedLocalPlayer
    );

    updateSavePlayerButton();

    await loadBackendPlayerProfile();

    document.documentElement.classList.add(
        "profile-page-ready"
    );

}


if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        initialisePlayerProfile
    );

} else {

    initialisePlayerProfile();

}


/* =====================================================
   PLAYER PROFILE JAVASCRIPT COMPLETE
===================================================== */