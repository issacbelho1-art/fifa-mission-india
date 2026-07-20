/* =====================================================
   FIFA MISSION INDIA
   EVENT DETAILS PAGE
   event-details.js

   PART 1
   CONFIGURATION • EVENT DATA • STATE
   DOM CACHE • UTILITIES • INITIALIZATION
===================================================== */

"use strict";


/* =====================================================
   BACKEND CONFIGURATION
   Mr. Harsh can replace the local data with API responses.
===================================================== */

const EVENT_DETAILS_CONFIG = Object.freeze({

  apiBaseUrl: "/api/v1",

  endpoints: {

    eventById(eventId) {
      return `${this.apiBaseUrl || "/api/v1"}/events/${encodeURIComponent(eventId)}`;
    },

    relatedEvents(eventId) {
      return `${this.apiBaseUrl || "/api/v1"}/events/${encodeURIComponent(eventId)}/related`;
    },

    registerEvent(eventId) {
      return `${this.apiBaseUrl || "/api/v1"}/events/${encodeURIComponent(eventId)}/register`;
    },

    saveEvent(eventId) {
      return `${this.apiBaseUrl || "/api/v1"}/events/${encodeURIComponent(eventId)}/save`;
    }

  },

  useLocalData: true,

  requestTimeout: 10000,

  savedEventsStorageKey: "fifaMissionIndiaSavedEvents",

  defaultEventId: "minerva-youth-trials",

  fallbackImage: "images/events/event-placeholder.jpg",

  toastDuration: 3500,

  relatedEventsLimit: 3

});


/* =====================================================
   LOCAL EVENT DATA
   Temporary frontend data until backend integration.
===================================================== */

const EVENT_DETAILS_DATA = [

  {

    id: "minerva-youth-trials",

    slug: "minerva-youth-trials",

    title: "Minerva Youth Football Trials 2026",

    shortDescription:
      "A national-level football trial designed to identify talented young players and provide them with a pathway into elite academy development.",

    fullDescription: [

      "Minerva Youth Football Trials 2026 brings together promising young footballers from across India for a professionally organized talent identification programme.",

      "Players will be assessed by qualified coaches and scouts across technical ability, tactical awareness, physical readiness, decision-making and overall potential.",

      "Selected participants may receive opportunities to join Minerva Football Academy programmes, advanced training camps and future competitive squads."

    ],

    category: "Football Trials",

    status: "Registration Open",

    statusType: "open",

    featured: true,

    image: "images/events/minerva-youth-trials.jpg",

    heroImage: "images/events/minerva-youth-trials.jpg",

    date: {

      start: "2026-08-16T08:00:00+05:30",

      end: "2026-08-17T17:30:00+05:30",

      registrationDeadline: "2026-08-12T23:59:59+05:30",

      displayDate: "16–17 August 2026",

      day: "16",

      month: "AUG",

      year: "2026"

    },

    time: "8:00 AM – 5:30 PM",

    location: {

      venue: "Minerva Football Academy",

      address: "Minerva Academy Football Ground, Mohali, Punjab",

      city: "Mohali",

      state: "Punjab",

      country: "India",

      mapUrl:
        "https://www.google.com/maps/search/?api=1&query=Minerva+Football+Academy+Mohali+Punjab",

      coordinates: {

        latitude: 30.7046,

        longitude: 76.7179

      },

      facilities: [

        {
          icon: "fa-solid fa-square-parking",
          label: "Parking Available"
        },

        {
          icon: "fa-solid fa-bottle-water",
          label: "Drinking Water"
        },

        {
          icon: "fa-solid fa-kit-medical",
          label: "Medical Support"
        }

      ]

    },

    organizer: {

      name: "Minerva Football Academy",

      type: "Professional Football Academy",

      logo: "images/academies/minerva-logo.png",

      description:
        "A leading Indian football academy committed to identifying, training and developing young football talent.",

      email: "events@fifamissionindia.com",

      phone: "+91 98765 43210",

      website: "academy-profile.html?id=minerva"

    },

    registration: {

      isOpen: true,

      fee: 499,

      currency: "₹",

      capacity: 400,

      registered: 286,

      minimumAge: 8,

      maximumAge: 18,

      registrationUrl:
        "event-registration.html?id=minerva-youth-trials"

    },

    highlights: [

      {

        icon: "fa-solid fa-user-check",

        title: "Professional Assessment",

        description:
          "Players will be evaluated by experienced academy coaches and football scouts."

      },

      {

        icon: "fa-solid fa-chart-line",

        title: "Performance Evaluation",

        description:
          "Technical, tactical, physical and decision-making abilities will be assessed."

      },

      {

        icon: "fa-solid fa-trophy",

        title: "Elite Development Pathway",

        description:
          "Selected players may receive opportunities to enter advanced academy programmes."

      },

      {

        icon: "fa-solid fa-people-group",

        title: "National Talent Pool",

        description:
          "Promising participants may be considered for future camps, trials and competitions."

      }

    ],

    eligibility: [

      {

        title: "Age Requirement",

        description:
          "Participants must be between 8 and 18 years of age on the event date."

      },

      {

        title: "Player Category",

        description:
          "The trials are open to eligible boys and girls from across India."

      },

      {

        title: "Fitness Requirement",

        description:
          "Players should be physically fit and capable of participating in football assessment activities."

      },

      {

        title: "Registration Requirement",

        description:
          "Every participant must complete the online registration before the deadline."

      }

    ],

    documents: [

      {

        name: "Government-Issued Age Proof",

        description:
          "Birth certificate, Aadhaar card, passport or another valid age-proof document.",

        required: true,

        icon: "fa-solid fa-id-card"

      },

      {

        name: "Recent Passport Photograph",

        description:
          "A clear recent photograph of the participating player.",

        required: true,

        icon: "fa-solid fa-image"

      },

      {

        name: "Medical Fitness Certificate",

        description:
          "A basic fitness certificate issued by a registered medical practitioner.",

        required: true,

        icon: "fa-solid fa-file-medical"

      },

      {

        name: "Previous Football Records",

        description:
          "Optional certificates, achievements or records from clubs, schools or academies.",

        required: false,

        icon: "fa-solid fa-folder-open"

      }

    ],

    schedule: [

      {

        time: "7:30 AM",

        title: "Reporting and Verification",

        description:
          "Participants report at the venue and complete registration and document verification.",

        icon: "fa-solid fa-clipboard-check"

      },

      {

        time: "8:30 AM",

        title: "Player Briefing and Warm-Up",

        description:
          "Coaches explain the trial format, safety guidelines and assessment process.",

        icon: "fa-solid fa-person-running"

      },

      {

        time: "9:00 AM",

        title: "Technical Assessment",

        description:
          "Players complete ball-control, passing, dribbling, finishing and movement exercises.",

        icon: "fa-solid fa-futbol"

      },

      {

        time: "12:30 PM",

        title: "Lunch and Recovery Break",

        description:
          "Participants receive time to rest, hydrate and prepare for the afternoon assessment.",

        icon: "fa-solid fa-utensils"

      },

      {

        time: "2:00 PM",

        title: "Small-Sided Matches",

        description:
          "Players are assessed in competitive match situations and tactical exercises.",

        icon: "fa-solid fa-people-group"

      },

      {

        time: "5:00 PM",

        title: "Closing Briefing",

        description:
          "The coaching team explains the next stage, result process and further communication.",

        icon: "fa-solid fa-flag-checkered"

      }

    ],

    faq: [

      {

        question: "Can players from any Indian state participate?",

        answer:
          "Yes. Eligible players from every state and union territory in India may register for the trials."

      },

      {

        question: "Will accommodation be provided?",

        answer:
          "Accommodation is not automatically included. Participants travelling from outside Mohali should arrange accommodation unless the organizer announces a separate residential package."

      },

      {

        question: "What should players bring to the venue?",

        answer:
          "Players should bring football boots, shin guards, training clothing, drinking water, required documents and their registration confirmation."

      },

      {

        question: "How will selected players be informed?",

        answer:
          "Selected players will be contacted through their registered email address or phone number after the assessment process is completed."

      },

      {

        question: "Is the registration fee refundable?",

        answer:
          "Registration fees are normally non-refundable unless the event is cancelled by the organizer. The final policy will be displayed during registration."

      }

    ],

    tags: [

      "Youth Football",

      "Open Trials",

      "Talent Identification",

      "Mohali",

      "Academy Pathway"

    ]

  },


  {

    id: "national-coaches-workshop",

    slug: "national-coaches-workshop",

    title: "National Youth Coaches Development Workshop",

    shortDescription:
      "A professional learning workshop focused on modern youth coaching, player development and football education.",

    fullDescription: [

      "The National Youth Coaches Development Workshop is designed for coaches, trainers and academy professionals working with young footballers.",

      "Sessions will cover training methodology, player-centred coaching, match analysis, safeguarding, development planning and communication."

    ],

    category: "Workshop",

    status: "Registration Open",

    statusType: "open",

    featured: false,

    image: "images/events/coaches-workshop.jpg",

    heroImage: "images/events/coaches-workshop.jpg",

    date: {

      start: "2026-09-05T09:00:00+05:30",

      end: "2026-09-05T17:00:00+05:30",

      registrationDeadline: "2026-09-01T23:59:59+05:30",

      displayDate: "5 September 2026",

      day: "05",

      month: "SEP",

      year: "2026"

    },

    time: "9:00 AM – 5:00 PM",

    location: {

      venue: "Jawaharlal Nehru Stadium Conference Hall",

      address: "Jawaharlal Nehru Stadium, New Delhi",

      city: "New Delhi",

      state: "Delhi",

      country: "India",

      mapUrl:
        "https://www.google.com/maps/search/?api=1&query=Jawaharlal+Nehru+Stadium+New+Delhi",

      facilities: [

        {
          icon: "fa-solid fa-square-parking",
          label: "Parking Available"
        },

        {
          icon: "fa-solid fa-wheelchair",
          label: "Accessible Venue"
        },

        {
          icon: "fa-solid fa-mug-hot",
          label: "Refreshments"
        }

      ]

    },

    organizer: {

      name: "FIFA Mission India Development Team",

      type: "Football Development Initiative",

      logo: "images/logo.png",

      description:
        "A national football development initiative supporting players, coaches, academies and football communities.",

      email: "coaches@fifamissionindia.com",

      phone: "+91 98765 43211",

      website: "index.html"

    },

    registration: {

      isOpen: true,

      fee: 799,

      currency: "₹",

      capacity: 150,

      registered: 94,

      minimumAge: 18,

      maximumAge: null,

      registrationUrl:
        "event-registration.html?id=national-coaches-workshop"

    },

    highlights: [

      {

        icon: "fa-solid fa-chalkboard-user",

        title: "Expert-Led Sessions",

        description:
          "Learn from experienced coaches, educators and football-development professionals."

      },

      {

        icon: "fa-solid fa-book-open",

        title: "Modern Methodology",

        description:
          "Explore practical approaches for developing technical, tactical and personal qualities."

      },

      {

        icon: "fa-solid fa-certificate",

        title: "Participation Certificate",

        description:
          "Registered attendees completing the workshop receive a participation certificate."

      }

    ],

    eligibility: [

      {

        title: "Coaching Interest",

        description:
          "Open to active coaches, aspiring coaches, academy staff and physical-education professionals."

      },

      {

        title: "Minimum Age",

        description:
          "Participants must be at least 18 years old."

      }

    ],

    documents: [

      {

        name: "Government Identification",

        description:
          "A valid identity document must be presented during event check-in.",

        required: true,

        icon: "fa-solid fa-address-card"

      },

      {

        name: "Coaching Certificate",

        description:
          "Existing coaching certificates may be uploaded but are not mandatory.",

        required: false,

        icon: "fa-solid fa-certificate"

      }

    ],

    schedule: [

      {

        time: "8:30 AM",

        title: "Registration",

        description:
          "Participant check-in, verification and workshop material collection.",

        icon: "fa-solid fa-clipboard-check"

      },

      {

        time: "9:30 AM",

        title: "Youth Development Principles",

        description:
          "Introduction to age-appropriate football development and player-centred coaching.",

        icon: "fa-solid fa-person-chalkboard"

      },

      {

        time: "11:30 AM",

        title: "Practical Coaching Design",

        description:
          "Building structured, engaging and measurable football training sessions.",

        icon: "fa-solid fa-diagram-project"

      },

      {

        time: "2:00 PM",

        title: "Match Analysis",

        description:
          "Using observation and analysis to improve individual and team performance.",

        icon: "fa-solid fa-chart-column"

      },

      {

        time: "4:30 PM",

        title: "Closing and Certification",

        description:
          "Final discussion, participant feedback and certificate distribution.",

        icon: "fa-solid fa-award"

      }

    ],

    faq: [

      {

        question: "Do I need an existing coaching licence?",

        answer:
          "No. Existing licences are welcome, but aspiring coaches may also participate."

      },

      {

        question: "Will practical sessions be included?",

        answer:
          "Yes. The workshop will include demonstrations and practical coaching-design activities."

      }

    ],

    tags: [

      "Coach Education",

      "Youth Development",

      "Workshop",

      "New Delhi"

    ]

  },


  {

    id: "india-football-fans-summit",

    slug: "india-football-fans-summit",

    title: "India Football Fans Summit 2026",

    shortDescription:
      "A national gathering of supporters, creators and football communities working together for the future of Indian football.",

    fullDescription: [

      "The India Football Fans Summit brings together football supporters, community leaders, creators and development advocates from across the country.",

      "The event will feature discussions, supporter activities, networking opportunities and national football-development conversations."

    ],

    category: "Community",

    status: "Coming Soon",

    statusType: "upcoming",

    featured: false,

    image: "images/events/football-fans-summit.jpg",

    heroImage: "images/events/football-fans-summit.jpg",

    date: {

      start: "2026-10-11T10:00:00+05:30",

      end: "2026-10-11T19:00:00+05:30",

      registrationDeadline: "2026-10-07T23:59:59+05:30",

      displayDate: "11 October 2026",

      day: "11",

      month: "OCT",

      year: "2026"

    },

    time: "10:00 AM – 7:00 PM",

    location: {

      venue: "Indira Gandhi Athletic Stadium",

      address: "Sarusajai Sports Complex, Guwahati, Assam",

      city: "Guwahati",

      state: "Assam",

      country: "India",

      mapUrl:
        "https://www.google.com/maps/search/?api=1&query=Indira+Gandhi+Athletic+Stadium+Guwahati",

      facilities: [

        {
          icon: "fa-solid fa-square-parking",
          label: "Parking Available"
        },

        {
          icon: "fa-solid fa-utensils",
          label: "Food Stalls"
        },

        {
          icon: "fa-solid fa-shirt",
          label: "Merchandise Zone"
        }

      ]

    },

    organizer: {

      name: "Bharat Football Fans",

      type: "National Supporter Community",

      logo: "images/logo.png",

      description:
        "A football-supporter movement connecting fans and communities behind India's long-term football mission.",

      email: "community@fifamissionindia.com",

      phone: "+91 98765 43212",

      website: "index.html"

    },

    registration: {

      isOpen: false,

      fee: 0,

      currency: "₹",

      capacity: 2000,

      registered: 0,

      minimumAge: null,

      maximumAge: null,

      registrationUrl:
        "event-registration.html?id=india-football-fans-summit"

    },

    highlights: [

      {

        icon: "fa-solid fa-people-group",

        title: "National Community",

        description:
          "Meet football supporters and communities from different regions of India."

      },

      {

        icon: "fa-solid fa-microphone",

        title: "Football Conversations",

        description:
          "Hear discussions about fan culture, development and the future of Indian football."

      },

      {

        icon: "fa-solid fa-handshake",

        title: "Community Networking",

        description:
          "Connect with supporter groups, creators, organizers and football-development advocates."

      }

    ],

    eligibility: [

      {

        title: "Open Participation",

        description:
          "The summit is open to football supporters, communities, creators and interested citizens."

      }

    ],

    documents: [

      {

        name: "Registration Confirmation",

        description:
          "A digital or printed registration confirmation will be required at entry.",

        required: true,

        icon: "fa-solid fa-ticket"

      }

    ],

    schedule: [

      {

        time: "9:30 AM",

        title: "Entry and Community Check-In",

        description:
          "Attendee registration and supporter-community introductions.",

        icon: "fa-solid fa-users"

      },

      {

        time: "11:00 AM",

        title: "State of Indian Football Fans",

        description:
          "A national conversation about supporter culture and football engagement.",

        icon: "fa-solid fa-comments"

      },

      {

        time: "2:00 PM",

        title: "Community Activities",

        description:
          "Interactive supporter events, networking and creative football activities.",

        icon: "fa-solid fa-flag"

      },

      {

        time: "5:30 PM",

        title: "Mission FIFA 2034 Gathering",

        description:
          "A collective supporter session focused on India's long-term football dream.",

        icon: "fa-solid fa-futbol"

      }

    ],

    faq: [

      {

        question: "Can supporter groups attend together?",

        answer:
          "Yes. Supporter groups and football communities may register and participate together."

      },

      {

        question: "Is the event free?",

        answer:
          "The current plan is for free registration, subject to final organizer confirmation."

      }

    ],

    tags: [

      "Football Fans",

      "Community",

      "Guwahati",

      "Mission FIFA 2034"

    ]

  },


  {

    id: "grassroots-football-festival",

    slug: "grassroots-football-festival",

    title: "Grassroots Football Festival Nagaland",

    shortDescription:
      "A youth football festival promoting participation, learning and community football development.",

    fullDescription: [

      "The Grassroots Football Festival Nagaland provides young players with a welcoming environment to enjoy football, learn fundamental skills and connect with local coaches.",

      "The programme will include fun training activities, small-sided matches and football-development sessions."

    ],

    category: "Grassroots",

    status: "Registration Open",

    statusType: "open",

    featured: false,

    image: "images/events/grassroots-festival.jpg",

    heroImage: "images/events/grassroots-festival.jpg",

    date: {

      start: "2026-09-19T08:00:00+05:30",

      end: "2026-09-19T16:00:00+05:30",

      registrationDeadline: "2026-09-15T23:59:59+05:30",

      displayDate: "19 September 2026",

      day: "19",

      month: "SEP",

      year: "2026"

    },

    time: "8:00 AM – 4:00 PM",

    location: {

      venue: "DDSC Stadium",

      address: "Dimapur District Sports Council Stadium, Dimapur",

      city: "Dimapur",

      state: "Nagaland",

      country: "India",

      mapUrl:
        "https://www.google.com/maps/search/?api=1&query=DDSC+Stadium+Dimapur",

      facilities: [

        {
          icon: "fa-solid fa-kit-medical",
          label: "Medical Support"
        },

        {
          icon: "fa-solid fa-bottle-water",
          label: "Drinking Water"
        },

        {
          icon: "fa-solid fa-restroom",
          label: "Restrooms"
        }

      ]

    },

    organizer: {

      name: "FIFA Mission India Grassroots Team",

      type: "Grassroots Football Programme",

      logo: "images/logo.png",

      description:
        "A football-development programme encouraging participation and opportunity at the grassroots level.",

      email: "grassroots@fifamissionindia.com",

      phone: "+91 98765 43213",

      website: "index.html"

    },

    registration: {

      isOpen: true,

      fee: 0,

      currency: "₹",

      capacity: 300,

      registered: 198,

      minimumAge: 6,

      maximumAge: 14,

      registrationUrl:
        "event-registration.html?id=grassroots-football-festival"

    },

    highlights: [

      {

        icon: "fa-solid fa-child-reaching",

        title: "Fun Football Activities",

        description:
          "Age-appropriate activities designed to make football enjoyable and inclusive."

      },

      {

        icon: "fa-solid fa-futbol",

        title: "Small-Sided Games",

        description:
          "Young players will participate in guided small-sided football matches."

      },

      {

        icon: "fa-solid fa-heart",

        title: "Community Participation",

        description:
          "Families, coaches and local football communities are encouraged to participate."

      }

    ],

    eligibility: [

      {

        title: "Age Group",

        description:
          "Open to children between 6 and 14 years of age."

      },

      {

        title: "Experience",

        description:
          "No previous academy or competitive football experience is required."

      }

    ],

    documents: [

      {

        name: "Age Proof",

        description:
          "A valid document confirming the participant's date of birth.",

        required: true,

        icon: "fa-solid fa-id-card"

      },

      {

        name: "Parent or Guardian Consent",

        description:
          "Consent from a parent or legal guardian is required.",

        required: true,

        icon: "fa-solid fa-file-signature"

      }

    ],

    schedule: [

      {

        time: "8:00 AM",

        title: "Registration and Team Allocation",

        description:
          "Players check in and are assigned to age-appropriate groups.",

        icon: "fa-solid fa-clipboard-check"

      },

      {

        time: "9:00 AM",

        title: "Football Skill Stations",

        description:
          "Fun activities covering movement, passing, dribbling and shooting.",

        icon: "fa-solid fa-futbol"

      },

      {

        time: "12:00 PM",

        title: "Lunch Break",

        description:
          "Rest, hydration and lunch break for participants and volunteers.",

        icon: "fa-solid fa-utensils"

      },

      {

        time: "1:30 PM",

        title: "Small-Sided Festival Matches",

        description:
          "Friendly matches focused on participation, teamwork and enjoyment.",

        icon: "fa-solid fa-people-group"

      },

      {

        time: "3:30 PM",

        title: "Certificates and Closing",

        description:
          "Participation certificates and closing remarks.",

        icon: "fa-solid fa-award"

      }

    ],

    faq: [

      {

        question: "Does my child need football experience?",

        answer:
          "No. The festival welcomes beginners as well as children who already play football."

      },

      {

        question: "Must a parent or guardian attend?",

        answer:
          "A responsible adult should accompany younger participants and remain reachable throughout the event."

      }

    ],

    tags: [

      "Grassroots",

      "Youth Football",

      "Dimapur",

      "Free Event"

    ]

  }

];


/* =====================================================
   APPLICATION STATE
===================================================== */

const eventDetailsState = {

  initialized: false,

  loading: false,

  eventId: null,

  event: null,

  relatedEvents: [],

  savedEventIds: new Set(),

  countdownInterval: null,

  toastTimeout: null,

  mobileMenuOpen: false,

  activeFaqIndex: null

};


/* =====================================================
   DOM CACHE
===================================================== */

const eventDetailsDOM = {

  loader: null,

  navbar: null,

  mobileMenuButton: null,

  mobileMenu: null,

  mobileMenuCloseButton: null,

  mobileOverlay: null,

  pageContent: null,

  eventNotFound: null,

  heroContainer: null,

  overviewContainer: null,

  highlightsContainer: null,

  eligibilityContainer: null,

  documentsContainer: null,

  scheduleContainer: null,

  organizerContainer: null,

  locationContainer: null,

  faqContainer: null,

  registrationContainer: null,

  quickDetailsContainer: null,

  relatedEventsGrid: null,

  toast: null

};


/* =====================================================
   DOM SELECTOR HELPERS
===================================================== */

function eventDetailsQuery(selector, parent = document) {

  if (!selector || !parent) {

    return null;

  }

  return parent.querySelector(selector);

}


function eventDetailsQueryAll(selector, parent = document) {

  if (!selector || !parent) {

    return [];

  }

  return Array.from(parent.querySelectorAll(selector));

}


function eventDetailsFindFirst(selectors, parent = document) {

  if (!Array.isArray(selectors)) {

    return null;

  }

  for (const selector of selectors) {

    const element = eventDetailsQuery(selector, parent);

    if (element) {

      return element;

    }

  }

  return null;

}


/* =====================================================
   CACHE DOM ELEMENTS
===================================================== */

function cacheEventDetailsDOM() {

  eventDetailsDOM.loader = eventDetailsFindFirst([

    "#eventDetailsLoader",

    ".event-details-loader"

  ]);


  eventDetailsDOM.navbar = eventDetailsFindFirst([

    "#eventDetailsNavbar",

    ".event-details-navbar"

  ]);


  eventDetailsDOM.mobileMenuButton = eventDetailsFindFirst([

    "#eventDetailsMobileMenuButton",

    "#eventDetailsMenuButton",

    ".event-details-mobile-menu-button"

  ]);


  eventDetailsDOM.mobileMenu = eventDetailsFindFirst([

    "#eventDetailsMobileMenu",

    ".event-details-mobile-menu"

  ]);


  eventDetailsDOM.mobileMenuCloseButton = eventDetailsFindFirst([

    "#eventDetailsMobileMenuClose",

    "#eventDetailsMobileMenuCloseButton",

    ".event-details-mobile-menu-close"

  ]);


  eventDetailsDOM.mobileOverlay = eventDetailsFindFirst([

    "#eventDetailsMobileOverlay",

    ".event-details-mobile-overlay"

  ]);


  eventDetailsDOM.pageContent = eventDetailsFindFirst([

    "#eventDetailsPageContent",

    "#eventDetailsMain",

    ".event-details-page-content",

    "main"

  ]);


  eventDetailsDOM.eventNotFound = eventDetailsFindFirst([

    "#eventDetailsNotFound",

    ".event-details-not-found"

  ]);


  eventDetailsDOM.heroContainer = eventDetailsFindFirst([

    "#eventDetailsHeroCard",

    "#eventDetailsHero",

    ".event-details-hero-card"

  ]);


  eventDetailsDOM.overviewContainer = eventDetailsFindFirst([

    "#eventDetailsOverviewContent",

    "#eventOverviewContent",

    ".event-details-description"

  ]);


  eventDetailsDOM.highlightsContainer = eventDetailsFindFirst([

    "#eventDetailsHighlightsGrid",

    "#eventHighlightsGrid",

    ".event-details-highlights-grid"

  ]);


  eventDetailsDOM.eligibilityContainer = eventDetailsFindFirst([

    "#eventDetailsEligibilityList",

    "#eventEligibilityList",

    ".event-details-eligibility"

  ]);


  eventDetailsDOM.documentsContainer = eventDetailsFindFirst([

    "#eventDetailsDocumentsGrid",

    "#eventDocumentsGrid",

    ".event-details-documents-grid"

  ]);


  eventDetailsDOM.scheduleContainer = eventDetailsFindFirst([

    "#eventDetailsSchedule",

    "#eventSchedule",

    ".event-details-schedule"

  ]);


  eventDetailsDOM.organizerContainer = eventDetailsFindFirst([

    "#eventDetailsOrganizer",

    "#eventOrganizer",

    ".event-details-organizer"

  ]);


  eventDetailsDOM.locationContainer = eventDetailsFindFirst([

    "#eventDetailsLocation",

    "#eventLocation",

    ".event-details-location"

  ]);


  eventDetailsDOM.faqContainer = eventDetailsFindFirst([

    "#eventDetailsFaqList",

    "#eventFaqList",

    ".event-details-faq-list"

  ]);


  eventDetailsDOM.registrationContainer = eventDetailsFindFirst([

    "#eventDetailsRegistrationCard",

    "#eventRegistrationCard",

    ".event-details-registration-card"

  ]);


  eventDetailsDOM.quickDetailsContainer = eventDetailsFindFirst([

    "#eventDetailsQuickInfo",

    "#eventQuickInfo",

    ".event-details-quick-info"

  ]);


  eventDetailsDOM.relatedEventsGrid = eventDetailsFindFirst([

    "#eventDetailsRelatedGrid",

    "#relatedEventsGrid",

    ".event-details-related-grid"

  ]);


  eventDetailsDOM.toast = eventDetailsFindFirst([

    "#eventDetailsToast",

    ".event-details-toast"

  ]);

}


/* =====================================================
   URL PARAMETER HELPERS
===================================================== */

function getEventDetailsUrlParameters() {

  return new URLSearchParams(window.location.search);

}


function getEventDetailsIdFromUrl() {

  const parameters = getEventDetailsUrlParameters();

  const eventId =

    parameters.get("id") ||

    parameters.get("event") ||

    parameters.get("slug");

  if (!eventId) {

    return EVENT_DETAILS_CONFIG.defaultEventId;

  }

  return sanitizeEventDetailsId(eventId);

}


function sanitizeEventDetailsId(value) {

  return String(value || "")

    .trim()

    .toLowerCase()

    .replace(/[^a-z0-9-_]/g, "");

}


/* =====================================================
   DATA HELPERS
===================================================== */

function findEventDetailsById(eventId) {

  const cleanEventId = sanitizeEventDetailsId(eventId);

  return EVENT_DETAILS_DATA.find((event) => {

    return (

      sanitizeEventDetailsId(event.id) === cleanEventId ||

      sanitizeEventDetailsId(event.slug) === cleanEventId

    );

  }) || null;

}


function getRelatedEventDetails(currentEvent, limit = 3) {

  if (!currentEvent) {

    return [];

  }

  const sameCategoryEvents = EVENT_DETAILS_DATA.filter((event) => {

    return (

      event.id !== currentEvent.id &&

      event.category === currentEvent.category

    );

  });


  const otherEvents = EVENT_DETAILS_DATA.filter((event) => {

    return (

      event.id !== currentEvent.id &&

      event.category !== currentEvent.category

    );

  });


  return [

    ...sameCategoryEvents,

    ...otherEvents

  ].slice(0, limit);

}


/* =====================================================
   SAFE VALUE UTILITIES
===================================================== */

function eventDetailsEscapeHTML(value) {

  const temporaryElement = document.createElement("div");

  temporaryElement.textContent = String(value ?? "");

  return temporaryElement.innerHTML;

}


function eventDetailsSafeText(value, fallback = "") {

  if (

    value === null ||

    value === undefined ||

    String(value).trim() === ""

  ) {

    return fallback;

  }

  return String(value).trim();

}


function eventDetailsSafeNumber(value, fallback = 0) {

  const number = Number(value);

  return Number.isFinite(number) ? number : fallback;

}


function eventDetailsClamp(value, minimum, maximum) {

  return Math.min(

    Math.max(value, minimum),

    maximum

  );

}


function eventDetailsCreateElement(

  tagName,

  className = "",

  attributes = {}

) {

  const element = document.createElement(tagName);

  if (className) {

    element.className = className;

  }

  Object.entries(attributes).forEach(([key, value]) => {

    if (

      value === null ||

      value === undefined

    ) {

      return;

    }

    if (key === "text") {

      element.textContent = String(value);

      return;

    }

    if (key === "html") {

      element.innerHTML = String(value);

      return;

    }

    element.setAttribute(key, String(value));

  });

  return element;

}


/* =====================================================
   DATE AND TIME UTILITIES
===================================================== */

function eventDetailsParseDate(value) {

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {

    return null;

  }

  return date;

}


function eventDetailsFormatDate(

  value,

  options = {

    day: "numeric",

    month: "long",

    year: "numeric"

  }

) {

  const date = eventDetailsParseDate(value);

  if (!date) {

    return "";

  }

  try {

    return new Intl.DateTimeFormat(

      "en-IN",

      options

    ).format(date);

  } catch (error) {

    console.warn(

      "Unable to format event date:",

      error

    );

    return date.toLocaleDateString();

  }

}


function eventDetailsFormatCurrency(

  amount,

  currencySymbol = "₹"

) {

  const safeAmount = eventDetailsSafeNumber(amount, 0);

  if (safeAmount <= 0) {

    return "Free";

  }

  return `${currencySymbol}${safeAmount.toLocaleString("en-IN")}`;

}


function eventDetailsCalculateRegistrationPercentage(event) {

  if (!event?.registration) {

    return 0;

  }

  const capacity = eventDetailsSafeNumber(

    event.registration.capacity,

    0

  );

  const registered = eventDetailsSafeNumber(

    event.registration.registered,

    0

  );

  if (capacity <= 0) {

    return 0;

  }

  return eventDetailsClamp(

    Math.round((registered / capacity) * 100),

    0,

    100

  );

}


/* =====================================================
   LOCAL STORAGE HELPERS
===================================================== */

function loadSavedEventDetails() {

  try {

    const storedValue = localStorage.getItem(

      EVENT_DETAILS_CONFIG.savedEventsStorageKey

    );

    if (!storedValue) {

      eventDetailsState.savedEventIds = new Set();

      return;

    }

    const parsedValue = JSON.parse(storedValue);

    if (!Array.isArray(parsedValue)) {

      eventDetailsState.savedEventIds = new Set();

      return;

    }

    eventDetailsState.savedEventIds = new Set(

      parsedValue.map(sanitizeEventDetailsId)

    );

  } catch (error) {

    console.warn(

      "Unable to load saved events:",

      error

    );

    eventDetailsState.savedEventIds = new Set();

  }

}


function persistSavedEventDetails() {

  try {

    localStorage.setItem(

      EVENT_DETAILS_CONFIG.savedEventsStorageKey,

      JSON.stringify(

        Array.from(eventDetailsState.savedEventIds)

      )

    );

  } catch (error) {

    console.warn(

      "Unable to save event preference:",

      error

    );

  }

}


function isEventDetailsSaved(eventId) {

  return eventDetailsState.savedEventIds.has(

    sanitizeEventDetailsId(eventId)

  );

}


/* =====================================================
   LOADER CONTROLS
===================================================== */

function showEventDetailsLoader() {

  eventDetailsState.loading = true;

  if (!eventDetailsDOM.loader) {

    return;

  }

  eventDetailsDOM.loader.hidden = false;

  eventDetailsDOM.loader.classList.remove("is-hidden");

  eventDetailsDOM.loader.setAttribute(

    "aria-hidden",

    "false"

  );

}


function hideEventDetailsLoader() {

  eventDetailsState.loading = false;

  if (!eventDetailsDOM.loader) {

    return;

  }

  eventDetailsDOM.loader.classList.add("is-hidden");

  eventDetailsDOM.loader.setAttribute(

    "aria-hidden",

    "true"

  );

  window.setTimeout(() => {

    if (eventDetailsDOM.loader) {

      eventDetailsDOM.loader.hidden = true;

    }

  }, 350);

}


/* =====================================================
   PAGE VISIBILITY CONTROLS
===================================================== */

function showEventDetailsPage() {

  if (eventDetailsDOM.pageContent) {

    eventDetailsDOM.pageContent.hidden = false;

  }

  if (eventDetailsDOM.eventNotFound) {

    eventDetailsDOM.eventNotFound.hidden = true;

  }

}


function showEventDetailsNotFound() {

  if (eventDetailsDOM.pageContent) {

    eventDetailsDOM.pageContent.hidden = true;

  }

  if (eventDetailsDOM.eventNotFound) {

    eventDetailsDOM.eventNotFound.hidden = false;

  }

  document.title =

    "Event Not Found | FIFA Mission India";

}


/* =====================================================
   API PLACEHOLDERS
===================================================== */

async function fetchEventDetailsFromApi(eventId) {

  const controller = new AbortController();

  const timeoutId = window.setTimeout(() => {

    controller.abort();

  }, EVENT_DETAILS_CONFIG.requestTimeout);

  try {

    const response = await fetch(

      `${EVENT_DETAILS_CONFIG.apiBaseUrl}/events/${encodeURIComponent(eventId)}`,

      {

        method: "GET",

        headers: {

          Accept: "application/json"

        },

        signal: controller.signal

      }

    );

    if (!response.ok) {

      if (response.status === 404) {

        return null;

      }

      throw new Error(

        `Unable to load event. Status: ${response.status}`

      );

    }

    const result = await response.json();

    return result?.data || result || null;

  } finally {

    window.clearTimeout(timeoutId);

  }

}


async function loadEventDetailsData(eventId) {

  if (EVENT_DETAILS_CONFIG.useLocalData) {

    return findEventDetailsById(eventId);

  }

  try {

    return await fetchEventDetailsFromApi(eventId);

  } catch (error) {

    console.error(

      "Event API request failed:",

      error

    );

    return findEventDetailsById(eventId);

  }

}


/* =====================================================
   DOCUMENT TITLE
===================================================== */

function updateEventDetailsDocumentTitle(event) {

  if (!event) {

    return;

  }

  document.title =

    `${event.title} | FIFA Mission India`;

}


/* =====================================================
   INITIALIZATION
===================================================== */

async function initializeEventDetailsPage() {

  if (eventDetailsState.initialized) {

    return;

  }

  eventDetailsState.initialized = true;

  cacheEventDetailsDOM();

  loadSavedEventDetails();

  showEventDetailsLoader();

  eventDetailsState.eventId = getEventDetailsIdFromUrl();

  try {

    const event = await loadEventDetailsData(

      eventDetailsState.eventId

    );

    if (!event) {

      eventDetailsState.event = null;

      showEventDetailsNotFound();

      return;

    }

    eventDetailsState.event = event;

    eventDetailsState.relatedEvents =

      getRelatedEventDetails(

        event,

        EVENT_DETAILS_CONFIG.relatedEventsLimit

      );

    updateEventDetailsDocumentTitle(event);

    showEventDetailsPage();


    /*
     * Rendering and interaction functions are added
     * in the following parts of event-details.js.
     */

    if (typeof renderCompleteEventDetailsPage === "function") {

      renderCompleteEventDetailsPage();

    }

    if (typeof bindEventDetailsInteractions === "function") {

      bindEventDetailsInteractions();

    }

  } catch (error) {

    console.error(

      "Unable to initialize event details page:",

      error

    );

    showEventDetailsNotFound();

  } finally {

    hideEventDetailsLoader();

  }

}


/* =====================================================
   SAFE STARTUP
===================================================== */

if (document.readyState === "loading") {

  document.addEventListener(

    "DOMContentLoaded",

    initializeEventDetailsPage,

    {

      once: true

    }

  );

} else {

  initializeEventDetailsPage();

}

/* =====================================================
   EVENT DETAILS PAGE
   event-details.js

   PART 2
   HERO • OVERVIEW • HIGHLIGHTS
   ELIGIBILITY • DOCUMENTS
===================================================== */


/* =====================================================
   MAIN PAGE RENDERER
===================================================== */

function renderCompleteEventDetailsPage() {

  const event = eventDetailsState.event;

  if (!event) {

    return;

  }

  renderEventDetailsHero(event);

  renderEventDetailsOverview(event);

  renderEventDetailsHighlights(event);

  renderEventDetailsEligibility(event);

  renderEventDetailsDocuments(event);

  /*
   * The remaining sections are rendered
   * in the next JavaScript parts.
   */

  if (typeof renderEventDetailsSchedule === "function") {

    renderEventDetailsSchedule(event);

  }

  if (typeof renderEventDetailsOrganizer === "function") {

    renderEventDetailsOrganizer(event);

  }

  if (typeof renderEventDetailsLocation === "function") {

    renderEventDetailsLocation(event);

  }

  if (typeof renderEventDetailsFaq === "function") {

    renderEventDetailsFaq(event);

  }

  if (typeof renderEventDetailsRegistration === "function") {

    renderEventDetailsRegistration(event);

  }

  if (typeof renderEventDetailsQuickInfo === "function") {

    renderEventDetailsQuickInfo(event);

  }

  if (typeof renderRelatedEventDetails === "function") {

    renderRelatedEventDetails();

  }

}


/* =====================================================
   HERO RENDERER
===================================================== */

function renderEventDetailsHero(event) {

  const container = eventDetailsDOM.heroContainer;

  if (!container) {

    return;

  }

  const title = eventDetailsEscapeHTML(

    eventDetailsSafeText(

      event.title,

      "Football Event"

    )

  );

  const description = eventDetailsEscapeHTML(

    eventDetailsSafeText(

      event.shortDescription,

      "Discover this football event and explore the available opportunities."

    )

  );

  const category = eventDetailsEscapeHTML(

    eventDetailsSafeText(

      event.category,

      "Football Event"

    )

  );

  const status = eventDetailsEscapeHTML(

    eventDetailsSafeText(

      event.status,

      "Event Update"

    )

  );

  const heroImage = eventDetailsEscapeHTML(

    eventDetailsSafeText(

      event.heroImage || event.image,

      EVENT_DETAILS_CONFIG.fallbackImage

    )

  );

  const displayDate = eventDetailsEscapeHTML(

    eventDetailsSafeText(

      event.date?.displayDate,

      eventDetailsFormatDate(

        event.date?.start

      )

    )

  );

  const day = eventDetailsEscapeHTML(

    eventDetailsSafeText(

      event.date?.day,

      eventDetailsFormatDate(

        event.date?.start,

        {

          day: "2-digit"

        }

      )

    )

  );

  const month = eventDetailsEscapeHTML(

    eventDetailsSafeText(

      event.date?.month,

      eventDetailsFormatDate(

        event.date?.start,

        {

          month: "short"

        }

      ).toUpperCase()

    )

  );

  const time = eventDetailsEscapeHTML(

    eventDetailsSafeText(

      event.time,

      "Time to be announced"

    )

  );

  const venue = eventDetailsEscapeHTML(

    eventDetailsSafeText(

      event.location?.venue,

      "Venue to be announced"

    )

  );

  const city = eventDetailsEscapeHTML(

    eventDetailsSafeText(

      event.location?.city,

      "India"

    )

  );

  const state = eventDetailsEscapeHTML(

    eventDetailsSafeText(

      event.location?.state,

      ""

    )

  );

  const organizer = eventDetailsEscapeHTML(

    eventDetailsSafeText(

      event.organizer?.name,

      "FIFA Mission India"

    )

  );

  const fee = eventDetailsEscapeHTML(

    eventDetailsFormatCurrency(

      event.registration?.fee,

      event.registration?.currency

    )

  );

  const registrationPercentage =

    eventDetailsCalculateRegistrationPercentage(event);

  const registrationUrl = eventDetailsEscapeHTML(

    eventDetailsSafeText(

      event.registration?.registrationUrl,

      `event-registration.html?id=${encodeURIComponent(event.id)}`

    )

  );

  const isSaved = isEventDetailsSaved(event.id);

  const tagMarkup = Array.isArray(event.tags)

    ? event.tags

        .slice(0, 5)

        .map((tag) => {

          return `

            <span>

              <i class="fa-solid fa-check"></i>

              ${eventDetailsEscapeHTML(tag)}

            </span>

          `;

        })

        .join("")

    : "";

  container.classList.remove("is-loading");

  container.innerHTML = `

    <div class="event-details-hero-image">

      <img
        src="${heroImage}"
        alt="${title}"
        id="eventDetailsHeroImage"
        loading="eager"
      />

      <div class="event-details-hero-image-badges">

        <span class="event-details-hero-category">

          <i class="fa-solid fa-futbol"></i>

          ${category}

        </span>

        <span class="event-details-hero-status">

          ${status}

        </span>

      </div>

      <div class="event-details-hero-date-card">

        <strong>${day}</strong>

        <span>${month}</span>

      </div>

    </div>


    <div class="event-details-hero-content">

      <span class="event-details-hero-eyebrow">

        <i class="fa-solid fa-calendar-check"></i>

        Featured Football Event

      </span>

      <h1>${title}</h1>

      <p class="event-details-hero-summary">

        ${description}

      </p>


      <div class="event-details-hero-meta">

        <div class="event-details-hero-meta-item">

          <span class="event-details-hero-meta-icon">

            <i class="fa-solid fa-calendar-days"></i>

          </span>

          <span>

            <small>Date</small>

            <strong>${displayDate}</strong>

          </span>

        </div>


        <div class="event-details-hero-meta-item">

          <span class="event-details-hero-meta-icon">

            <i class="fa-solid fa-clock"></i>

          </span>

          <span>

            <small>Time</small>

            <strong>${time}</strong>

          </span>

        </div>


        <div class="event-details-hero-meta-item">

          <span class="event-details-hero-meta-icon">

            <i class="fa-solid fa-location-dot"></i>

          </span>

          <span>

            <small>Location</small>

            <strong>

              ${venue},

              ${city}${state ? `, ${state}` : ""}

            </strong>

          </span>

        </div>


        <div class="event-details-hero-meta-item">

          <span class="event-details-hero-meta-icon">

            <i class="fa-solid fa-building"></i>

          </span>

          <span>

            <small>Organizer</small>

            <strong>${organizer}</strong>

          </span>

        </div>

      </div>


      <div class="event-details-hero-tags">

        ${tagMarkup}

      </div>


      <div class="event-details-hero-actions">

        <a
          href="${registrationUrl}"
          class="event-details-hero-primary"
          id="eventDetailsHeroRegisterButton"
        >

          <i class="fa-solid fa-user-plus"></i>

          Register Now

        </a>

        <button
          type="button"
          class="event-details-hero-secondary ${
            isSaved ? "is-saved" : ""
          }"
          id="eventDetailsHeroSaveButton"
          aria-pressed="${isSaved}"
        >

          <i class="${
            isSaved
              ? "fa-solid fa-bookmark"
              : "fa-regular fa-bookmark"
          }"></i>

          <span>

            ${isSaved ? "Event Saved" : "Save Event"}

          </span>

        </button>

      </div>


      <div class="event-details-hero-registration">

        <div class="event-details-hero-registration-header">

          <span>

            ${eventDetailsSafeNumber(
              event.registration?.registered,
              0
            ).toLocaleString("en-IN")}
            of
            ${eventDetailsSafeNumber(
              event.registration?.capacity,
              0
            ).toLocaleString("en-IN")}
            places filled

          </span>

          <strong>${registrationPercentage}%</strong>

        </div>

        <div class="event-details-hero-progress-track">

          <span
            style="width:${registrationPercentage}%"
            aria-hidden="true"
          ></span>

        </div>

      </div>

      <span class="sr-only">

        Registration fee: ${fee}

      </span>

    </div>

  `;

  const heroImageElement = eventDetailsQuery(

    "#eventDetailsHeroImage",

    container

  );

  bindEventDetailsImageFallback(

    heroImageElement

  );

}


/* =====================================================
   IMAGE FALLBACK
===================================================== */

function bindEventDetailsImageFallback(imageElement) {

  if (!imageElement) {

    return;

  }

  imageElement.addEventListener(

    "error",

    () => {

      if (

        imageElement.dataset.fallbackApplied === "true"

      ) {

        return;

      }

      imageElement.dataset.fallbackApplied = "true";

      imageElement.src =

        EVENT_DETAILS_CONFIG.fallbackImage;

    },

    {

      once: true

    }

  );

}


/* =====================================================
   OVERVIEW RENDERER
===================================================== */

function renderEventDetailsOverview(event) {

  const container = eventDetailsDOM.overviewContainer;

  if (!container) {

    return;

  }

  const paragraphs = Array.isArray(

    event.fullDescription

  )

    ? event.fullDescription

    : [

        event.shortDescription

      ];

  const validParagraphs = paragraphs.filter(

    (paragraph) => {

      return eventDetailsSafeText(paragraph);

    }

  );

  if (!validParagraphs.length) {

    container.innerHTML = `

      <p>

        Full event details will be published soon.

      </p>

    `;

    return;

  }

  container.innerHTML = validParagraphs

    .map((paragraph, index) => {

      const safeParagraph =

        eventDetailsEscapeHTML(paragraph);

      if (index === 0) {

        return `

          <p>

            <strong>

              ${safeParagraph}

            </strong>

          </p>

        `;

      }

      return `

        <p>${safeParagraph}</p>

      `;

    })

    .join("");

}


/* =====================================================
   HIGHLIGHTS RENDERER
===================================================== */

function renderEventDetailsHighlights(event) {

  const container = eventDetailsDOM.highlightsContainer;

  if (!container) {

    return;

  }

  const highlights = Array.isArray(

    event.highlights

  )

    ? event.highlights

    : [];

  if (!highlights.length) {

    container.innerHTML = `

      <div class="event-details-highlight-card">

        <div class="event-details-highlight-icon">

          <i class="fa-solid fa-circle-info"></i>

        </div>

        <h3>More Information Coming Soon</h3>

        <p>

          Additional event highlights will be published shortly.

        </p>

      </div>

    `;

    return;

  }

  container.innerHTML = highlights

    .map((highlight) => {

      const icon = eventDetailsEscapeHTML(

        eventDetailsSafeText(

          highlight.icon,

          "fa-solid fa-star"

        )

      );

      const title = eventDetailsEscapeHTML(

        eventDetailsSafeText(

          highlight.title,

          "Event Highlight"

        )

      );

      const description = eventDetailsEscapeHTML(

        eventDetailsSafeText(

          highlight.description,

          "Additional information will be available soon."

        )

      );

      return `

        <article class="event-details-highlight-card">

          <div class="event-details-highlight-icon">

            <i class="${icon}"></i>

          </div>

          <h3>${title}</h3>

          <p>${description}</p>

        </article>

      `;

    })

    .join("");

}


/* =====================================================
   ELIGIBILITY RENDERER
===================================================== */

function renderEventDetailsEligibility(event) {

  const container = eventDetailsDOM.eligibilityContainer;

  if (!container) {

    return;

  }

  const eligibilityItems = Array.isArray(

    event.eligibility

  )

    ? event.eligibility

    : [];

  if (!eligibilityItems.length) {

    container.innerHTML = `

      <div class="event-details-eligibility-item">

        <i class="fa-solid fa-circle-check"></i>

        <div>

          <strong>Open Participation</strong>

          <p>

            Final eligibility requirements will be announced by the organizer.

          </p>

        </div>

      </div>

    `;

    return;

  }

  container.innerHTML = eligibilityItems

    .map((item) => {

      const title = eventDetailsEscapeHTML(

        eventDetailsSafeText(

          item.title,

          "Eligibility Requirement"

        )

      );

      const description = eventDetailsEscapeHTML(

        eventDetailsSafeText(

          item.description,

          "Please review the official registration requirements."

        )

      );

      return `

        <div class="event-details-eligibility-item">

          <i
            class="fa-solid fa-circle-check"
            aria-hidden="true"
          ></i>

          <div>

            <strong>${title}</strong>

            <p>${description}</p>

          </div>

        </div>

      `;

    })

    .join("");

}


/* =====================================================
   DOCUMENTS RENDERER
===================================================== */

function renderEventDetailsDocuments(event) {

  const container = eventDetailsDOM.documentsContainer;

  if (!container) {

    return;

  }

  const documents = Array.isArray(

    event.documents

  )

    ? event.documents

    : [];

  if (!documents.length) {

    container.innerHTML = `

      <article class="event-details-document-card">

        <div class="event-details-document-icon">

          <i class="fa-solid fa-file-circle-check"></i>

        </div>

        <div class="event-details-document-info">

          <strong>No Documents Listed</strong>

          <p>

            The organizer has not listed any required documents yet.

          </p>

        </div>

      </article>

    `;

    return;

  }

  container.innerHTML = documents

    .map((documentItem) => {

      const icon = eventDetailsEscapeHTML(

        eventDetailsSafeText(

          documentItem.icon,

          "fa-solid fa-file"

        )

      );

      const name = eventDetailsEscapeHTML(

        eventDetailsSafeText(

          documentItem.name,

          "Supporting Document"

        )

      );

      const description = eventDetailsEscapeHTML(

        eventDetailsSafeText(

          documentItem.description,

          "Review the registration form for document requirements."

        )

      );

      const requirementLabel =

        documentItem.required

          ? `

            <span class="event-details-document-required">

              <i class="fa-solid fa-circle-check"></i>

              Required

            </span>

          `

          : `

            <span class="event-details-document-required">

              <i class="fa-solid fa-circle-info"></i>

              Optional

            </span>

          `;

      return `

        <article class="event-details-document-card">

          <div class="event-details-document-icon">

            <i class="${icon}"></i>

          </div>

          <div class="event-details-document-info">

            <strong>${name}</strong>

            <p>${description}</p>

            ${requirementLabel}

          </div>

        </article>

      `;

    })

    .join("");

}

/* =====================================================
   EVENT DETAILS PAGE
   event-details.js

   PART 3
   SCHEDULE • ORGANIZER • LOCATION • FAQ
===================================================== */


/* =====================================================
   SCHEDULE RENDERER
===================================================== */

function renderEventDetailsSchedule(event) {

  const container = eventDetailsDOM.scheduleContainer;

  if (!container) {

    return;

  }

  const scheduleItems = Array.isArray(event.schedule)

    ? event.schedule

    : [];

  if (!scheduleItems.length) {

    container.innerHTML = `

      <div class="event-details-schedule-item">

        <div class="event-details-schedule-marker">

          <i class="fa-solid fa-clock"></i>

        </div>

        <div class="event-details-schedule-content">

          <span>To Be Announced</span>

          <h3>Event Schedule Coming Soon</h3>

          <p>

            The organizer will publish the complete event schedule shortly.

          </p>

        </div>

      </div>

    `;

    return;

  }

  container.innerHTML = scheduleItems

    .map((scheduleItem, index) => {

      const time = eventDetailsEscapeHTML(

        eventDetailsSafeText(

          scheduleItem.time,

          "Time to be announced"

        )

      );

      const title = eventDetailsEscapeHTML(

        eventDetailsSafeText(

          scheduleItem.title,

          `Schedule Item ${index + 1}`

        )

      );

      const description = eventDetailsEscapeHTML(

        eventDetailsSafeText(

          scheduleItem.description,

          "Further information will be shared by the organizer."

        )

      );

      const icon = eventDetailsEscapeHTML(

        eventDetailsSafeText(

          scheduleItem.icon,

          "fa-solid fa-clock"

        )

      );

      return `

        <div class="event-details-schedule-item">

          <div class="event-details-schedule-marker">

            <i class="${icon}" aria-hidden="true"></i>

          </div>

          <div class="event-details-schedule-content">

            <span>${time}</span>

            <h3>${title}</h3>

            <p>${description}</p>

          </div>

        </div>

      `;

    })

    .join("");

}


/* =====================================================
   ORGANIZER RENDERER
===================================================== */

function renderEventDetailsOrganizer(event) {

  const container = eventDetailsDOM.organizerContainer;

  if (!container) {

    return;

  }

  const organizer = event.organizer || {};

  const name = eventDetailsEscapeHTML(

    eventDetailsSafeText(

      organizer.name,

      "FIFA Mission India"

    )

  );

  const type = eventDetailsEscapeHTML(

    eventDetailsSafeText(

      organizer.type,

      "Football Development Organization"

    )

  );

  const logo = eventDetailsEscapeHTML(

    eventDetailsSafeText(

      organizer.logo,

      "images/logo.png"

    )

  );

  const description = eventDetailsEscapeHTML(

    eventDetailsSafeText(

      organizer.description,

      "Supporting football development opportunities across India."

    )

  );

  const email = eventDetailsSafeText(

    organizer.email,

    ""

  );

  const phone = eventDetailsSafeText(

    organizer.phone,

    ""

  );

  const website = eventDetailsSafeText(

    organizer.website,

    ""

  );

  const emailMarkup = email

    ? `

      <a
        href="mailto:${eventDetailsEscapeHTML(email)}"
        class="event-details-organizer-contact-card"
      >

        <span>

          <i class="fa-solid fa-envelope"></i>

        </span>

        <div>

          <small>Email</small>

          <strong>${eventDetailsEscapeHTML(email)}</strong>

        </div>

      </a>

    `

    : "";

  const phoneMarkup = phone

    ? `

      <a
        href="tel:${eventDetailsEscapeHTML(
          phone.replace(/\s+/g, "")
        )}"
        class="event-details-organizer-contact-card"
      >

        <span>

          <i class="fa-solid fa-phone"></i>

        </span>

        <div>

          <small>Phone</small>

          <strong>${eventDetailsEscapeHTML(phone)}</strong>

        </div>

      </a>

    `

    : "";

  const websiteMarkup = website

    ? `

      <a
        href="${eventDetailsEscapeHTML(website)}"
        class="event-details-organizer-contact-card"
      >

        <span>

          <i class="fa-solid fa-arrow-up-right-from-square"></i>

        </span>

        <div>

          <small>Profile</small>

          <strong>View Organizer</strong>

        </div>

      </a>

    `

    : "";

  container.innerHTML = `

    <div class="event-details-organizer-profile">

      <div class="event-details-organizer-logo">

        <img
          src="${logo}"
          alt="${name} logo"
          id="eventDetailsOrganizerLogo"
          loading="lazy"
        />

      </div>

      <div class="event-details-organizer-info">

        <span>${type}</span>

        <h3>${name}</h3>

        <p>${description}</p>

      </div>

    </div>

    <div class="event-details-organizer-contacts">

      ${emailMarkup}

      ${phoneMarkup}

      ${websiteMarkup}

    </div>

  `;

  bindEventDetailsImageFallback(

    eventDetailsQuery(

      "#eventDetailsOrganizerLogo",

      container

    )

  );

}


/* =====================================================
   LOCATION RENDERER
===================================================== */

function renderEventDetailsLocation(event) {

  const container = eventDetailsDOM.locationContainer;

  if (!container) {

    return;

  }

  const location = event.location || {};

  const venue = eventDetailsEscapeHTML(

    eventDetailsSafeText(

      location.venue,

      "Venue to be announced"

    )

  );

  const address = eventDetailsEscapeHTML(

    eventDetailsSafeText(

      location.address,

      "Full address will be published soon."

    )

  );

  const city = eventDetailsEscapeHTML(

    eventDetailsSafeText(

      location.city,

      ""

    )

  );

  const state = eventDetailsEscapeHTML(

    eventDetailsSafeText(

      location.state,

      ""

    )

  );

  const country = eventDetailsEscapeHTML(

    eventDetailsSafeText(

      location.country,

      "India"

    )

  );

  const mapUrl = eventDetailsSafeText(

    location.mapUrl,

    ""

  );

  const facilities = Array.isArray(location.facilities)

    ? location.facilities

    : [];

  const directionsMarkup = mapUrl

    ? `

      <a
        href="${eventDetailsEscapeHTML(mapUrl)}"
        target="_blank"
        rel="noopener noreferrer"
        class="event-details-location-directions"
      >

        <i class="fa-solid fa-diamond-turn-right"></i>

        Get Directions

      </a>

    `

    : "";

  const facilitiesMarkup = facilities.length

    ? facilities

        .map((facility) => {

          const icon = eventDetailsEscapeHTML(

            eventDetailsSafeText(

              facility.icon,

              "fa-solid fa-circle-check"

            )

          );

          const label = eventDetailsEscapeHTML(

            eventDetailsSafeText(

              facility.label,

              "Available Facility"

            )

          );

          return `

            <div class="event-details-facility-item">

              <i class="${icon}" aria-hidden="true"></i>

              <span>${label}</span>

            </div>

          `;

        })

        .join("")

    : `

      <div class="event-details-facility-item">

        <i class="fa-solid fa-circle-info"></i>

        <span>Facility information coming soon</span>

      </div>

    `;

  container.innerHTML = `

    <div class="event-details-location-address-card">

      <div class="event-details-location-icon">

        <i class="fa-solid fa-location-dot"></i>

      </div>

      <div class="event-details-location-address">

        <span>Event Venue</span>

        <h3>${venue}</h3>

        <p>${address}</p>

        <small>

          ${city}${city && state ? ", " : ""}${state}
          ${(city || state) && country ? ", " : ""}${country}

        </small>

      </div>

      ${directionsMarkup}

    </div>


    <div class="event-details-map-placeholder">

      <div class="event-details-map-marker">

        <i class="fa-solid fa-location-dot"></i>

      </div>

      <div class="event-details-map-label">

        <strong>${venue}</strong>

        <span>

          ${city}${city && state ? ", " : ""}${state}

        </span>

      </div>

    </div>


    <div class="event-details-facilities">

      ${facilitiesMarkup}

    </div>

  `;

}


/* =====================================================
   FAQ RENDERER
===================================================== */

function renderEventDetailsFaq(event) {

  const container = eventDetailsDOM.faqContainer;

  if (!container) {

    return;

  }

  const faqItems = Array.isArray(event.faq)

    ? event.faq

    : [];

  eventDetailsState.activeFaqIndex = null;

  if (!faqItems.length) {

    container.innerHTML = `

      <div class="event-details-faq-item">

        <button
          type="button"
          class="event-details-faq-question"
          aria-expanded="false"
        >

          <span>Where can I get more information?</span>

          <i class="fa-solid fa-plus"></i>

        </button>

        <div
          class="event-details-faq-answer"
          hidden
        >

          <p>

            Contact the event organizer using the details provided on this page.

          </p>

        </div>

      </div>

    `;

    return;

  }

  container.innerHTML = faqItems

    .map((faqItem, index) => {

      const question = eventDetailsEscapeHTML(

        eventDetailsSafeText(

          faqItem.question,

          `Frequently Asked Question ${index + 1}`

        )

      );

      const answer = eventDetailsEscapeHTML(

        eventDetailsSafeText(

          faqItem.answer,

          "Further information will be provided by the organizer."

        )

      );

      return `

        <div
          class="event-details-faq-item"
          data-faq-index="${index}"
        >

          <button
            type="button"
            class="event-details-faq-question"
            aria-expanded="false"
            aria-controls="eventDetailsFaqAnswer${index}"
            id="eventDetailsFaqQuestion${index}"
          >

            <span>${question}</span>

            <i
              class="fa-solid fa-plus"
              aria-hidden="true"
            ></i>

          </button>

          <div
            class="event-details-faq-answer"
            id="eventDetailsFaqAnswer${index}"
            role="region"
            aria-labelledby="eventDetailsFaqQuestion${index}"
            hidden
          >

            <p>${answer}</p>

          </div>

        </div>

      `;

    })

    .join("");

}


/* =====================================================
   FAQ INTERACTIONS
===================================================== */

function bindEventDetailsFaqInteractions() {

  const container = eventDetailsDOM.faqContainer;

  if (!container) {

    return;

  }

  container.addEventListener(

    "click",

    (eventObject) => {

      const button = eventObject.target.closest(

        ".event-details-faq-question"

      );

      if (!button) {

        return;

      }

      const faqItem = button.closest(

        ".event-details-faq-item"

      );

      if (!faqItem) {

        return;

      }

      const index = Number(

        faqItem.dataset.faqIndex

      );

      const answer = faqItem.querySelector(

        ".event-details-faq-answer"

      );

      const icon = button.querySelector("i");

      const isOpen = faqItem.classList.contains(

        "is-open"

      );

      closeAllEventDetailsFaqItems();

      if (isOpen) {

        eventDetailsState.activeFaqIndex = null;

        return;

      }

      faqItem.classList.add("is-open");

      button.setAttribute(

        "aria-expanded",

        "true"

      );

      if (answer) {

        answer.hidden = false;

      }

      if (icon) {

        icon.classList.remove("fa-plus");

        icon.classList.add("fa-minus");

      }

      eventDetailsState.activeFaqIndex =

        Number.isFinite(index)

          ? index

          : null;

    }

  );

}


function closeAllEventDetailsFaqItems() {

  const container = eventDetailsDOM.faqContainer;

  if (!container) {

    return;

  }

  eventDetailsQueryAll(

    ".event-details-faq-item",

    container

  ).forEach((item) => {

    item.classList.remove("is-open");

    const button = eventDetailsQuery(

      ".event-details-faq-question",

      item

    );

    const answer = eventDetailsQuery(

      ".event-details-faq-answer",

      item

    );

    const icon = button

      ? eventDetailsQuery("i", button)

      : null;

    if (button) {

      button.setAttribute(

        "aria-expanded",

        "false"

      );

    }

    if (answer) {

      answer.hidden = true;

    }

    if (icon) {

      icon.classList.remove("fa-minus");

      icon.classList.add("fa-plus");

    }

  });

}


/* =====================================================
   PART 3 INTERACTION HOOK
===================================================== */

function initializeEventDetailsPartThree() {

  bindEventDetailsFaqInteractions();

}

/* =====================================================
   EVENT DETAILS PAGE
   event-details.js

   PART 4
   REGISTRATION CARD • COUNTDOWN
   QUICK INFORMATION • SAVE EVENT
===================================================== */


/* =====================================================
   REGISTRATION CARD RENDERER
===================================================== */

function renderEventDetailsRegistration(event) {

  const container = eventDetailsDOM.registrationContainer;

  if (!container) {

    return;

  }

  const registration = event.registration || {};

  const statusType = eventDetailsSafeText(

    event.statusType,

    registration.isOpen ? "open" : "closed"

  );

  const statusLabel = eventDetailsSafeText(

    event.status,

    registration.isOpen
      ? "Registration Open"
      : "Registration Closed"

  );

  const capacity = eventDetailsSafeNumber(

    registration.capacity,

    0

  );

  const registered = eventDetailsSafeNumber(

    registration.registered,

    0

  );

  const remainingPlaces = Math.max(

    capacity - registered,

    0

  );

  const percentage =

    eventDetailsCalculateRegistrationPercentage(event);

  const fee = eventDetailsFormatCurrency(

    registration.fee,

    registration.currency

  );

  const registrationUrl = eventDetailsSafeText(

    registration.registrationUrl,

    `event-registration.html?id=${encodeURIComponent(
      event.id
    )}`

  );

  const registrationDeadline =

    eventDetailsParseDate(

      event.date?.registrationDeadline

    );

  const now = new Date();

  const registrationExpired =

    registrationDeadline

      ? registrationDeadline.getTime() <= now.getTime()

      : false;

  const isOpen = Boolean(

    registration.isOpen &&

    !registrationExpired &&

    remainingPlaces > 0

  );

  const isSaved = isEventDetailsSaved(event.id);

  let statusClass = "closed";

  if (isOpen) {

    statusClass =

      statusType === "closing"

        ? "closing"

        : "open";

  }

  let registrationMessage =

    "Registration is currently unavailable.";

  if (isOpen && remainingPlaces <= 25) {

    registrationMessage =

      `Only ${remainingPlaces} places remaining.`;

  } else if (isOpen) {

    registrationMessage =

      "Secure your place before registration closes.";

  } else if (remainingPlaces <= 0) {

    registrationMessage =

      "All available places have been filled.";

  } else if (registrationExpired) {

    registrationMessage =

      "The registration deadline has passed.";

  }

  container.classList.remove(

    "open",

    "closing",

    "closed"

  );

  container.classList.add(statusClass);

  container.innerHTML = `

    <div class="event-details-registration-header">

      <div>

        <span>Event Registration</span>

        <h3>${eventDetailsEscapeHTML(statusLabel)}</h3>

      </div>

      <span
        class="event-details-registration-status ${statusClass}"
      >

        <i class="fa-solid fa-circle"></i>

        ${eventDetailsEscapeHTML(statusLabel)}

      </span>

    </div>


    <div class="event-details-registration-price">

      <span>Registration Fee</span>

      <strong>${eventDetailsEscapeHTML(fee)}</strong>

      <small>

        ${eventDetailsEscapeHTML(registrationMessage)}

      </small>

    </div>


    <div class="event-details-registration-progress">

      <div class="event-details-registration-progress-header">

        <span>

          ${registered.toLocaleString("en-IN")}
          registered

        </span>

        <strong>${percentage}% filled</strong>

      </div>

      <div
        class="event-details-registration-progress-track"
        role="progressbar"
        aria-valuemin="0"
        aria-valuemax="100"
        aria-valuenow="${percentage}"
        aria-label="Event registration progress"
      >

        <span style="width:${percentage}%"></span>

      </div>

      <div class="event-details-registration-capacity">

        <span>

          <i class="fa-solid fa-users"></i>

          Capacity:
          ${capacity.toLocaleString("en-IN")}

        </span>

        <span>

          <i class="fa-solid fa-ticket"></i>

          ${remainingPlaces.toLocaleString("en-IN")}
          places left

        </span>

      </div>

    </div>


    <div class="event-details-countdown">

      <span class="event-details-countdown-label">

        <i class="fa-solid fa-hourglass-half"></i>

        Registration closes in

      </span>

      <div
        class="event-details-countdown-grid"
        id="eventDetailsCountdown"
        aria-live="polite"
      >

        <div>

          <strong id="eventDetailsCountdownDays">00</strong>

          <span>Days</span>

        </div>

        <div>

          <strong id="eventDetailsCountdownHours">00</strong>

          <span>Hours</span>

        </div>

        <div>

          <strong id="eventDetailsCountdownMinutes">00</strong>

          <span>Minutes</span>

        </div>

        <div>

          <strong id="eventDetailsCountdownSeconds">00</strong>

          <span>Seconds</span>

        </div>

      </div>

    </div>


    <div class="event-details-registration-actions">

      <a
        href="${eventDetailsEscapeHTML(registrationUrl)}"
        class="event-details-register-button ${
          isOpen ? "" : "is-disabled"
        }"
        id="eventDetailsRegisterButton"
        aria-disabled="${!isOpen}"
        ${isOpen ? "" : 'tabindex="-1"'}
      >

        <i class="fa-solid fa-user-plus"></i>

        <span>

          ${isOpen ? "Register for Event" : "Registration Unavailable"}

        </span>

      </a>

      <button
        type="button"
        class="event-details-save-button ${
          isSaved ? "is-saved" : ""
        }"
        id="eventDetailsSaveButton"
        aria-pressed="${isSaved}"
      >

        <i class="${
          isSaved
            ? "fa-solid fa-bookmark"
            : "fa-regular fa-bookmark"
        }"></i>

        <span>

          ${isSaved ? "Event Saved" : "Save Event"}

        </span>

      </button>

    </div>


    <div class="event-details-registration-note">

      <i class="fa-solid fa-shield-halved"></i>

      <p>

        Registration data will be securely processed
        after backend integration.

      </p>

    </div>

  `;

  startEventDetailsCountdown(

    event.date?.registrationDeadline

  );

}


/* =====================================================
   COUNTDOWN TIMER
===================================================== */

function startEventDetailsCountdown(deadlineValue) {

  stopEventDetailsCountdown();

  const deadline = eventDetailsParseDate(

    deadlineValue

  );

  if (!deadline) {

    updateEventDetailsCountdownDisplay(

      0,

      0,

      0,

      0,

      "Date to be announced"

    );

    return;

  }

  function updateCountdown() {

    const currentTime = Date.now();

    const remainingMilliseconds =

      deadline.getTime() - currentTime;

    if (remainingMilliseconds <= 0) {

      updateEventDetailsCountdownDisplay(

        0,

        0,

        0,

        0,

        "Registration closed"

      );

      stopEventDetailsCountdown();

      handleEventDetailsRegistrationExpiry();

      return;

    }

    const totalSeconds = Math.floor(

      remainingMilliseconds / 1000

    );

    const days = Math.floor(

      totalSeconds / 86400

    );

    const hours = Math.floor(

      (totalSeconds % 86400) / 3600

    );

    const minutes = Math.floor(

      (totalSeconds % 3600) / 60

    );

    const seconds =

      totalSeconds % 60;

    updateEventDetailsCountdownDisplay(

      days,

      hours,

      minutes,

      seconds

    );

  }

  updateCountdown();

  eventDetailsState.countdownInterval =

    window.setInterval(

      updateCountdown,

      1000

    );

}


function stopEventDetailsCountdown() {

  if (!eventDetailsState.countdownInterval) {

    return;

  }

  window.clearInterval(

    eventDetailsState.countdownInterval

  );

  eventDetailsState.countdownInterval = null;

}


function updateEventDetailsCountdownDisplay(

  days,

  hours,

  minutes,

  seconds,

  statusText = ""

) {

  const daysElement = eventDetailsQuery(

    "#eventDetailsCountdownDays"

  );

  const hoursElement = eventDetailsQuery(

    "#eventDetailsCountdownHours"

  );

  const minutesElement = eventDetailsQuery(

    "#eventDetailsCountdownMinutes"

  );

  const secondsElement = eventDetailsQuery(

    "#eventDetailsCountdownSeconds"

  );

  const countdownContainer = eventDetailsQuery(

    "#eventDetailsCountdown"

  );

  if (daysElement) {

    daysElement.textContent =

      String(days).padStart(2, "0");

  }

  if (hoursElement) {

    hoursElement.textContent =

      String(hours).padStart(2, "0");

  }

  if (minutesElement) {

    minutesElement.textContent =

      String(minutes).padStart(2, "0");

  }

  if (secondsElement) {

    secondsElement.textContent =

      String(seconds).padStart(2, "0");

  }

  if (countdownContainer) {

    countdownContainer.setAttribute(

      "aria-label",

      statusText ||

      `${days} days, ${hours} hours, ${minutes} minutes and ${seconds} seconds remaining`

    );

  }

}


function handleEventDetailsRegistrationExpiry() {

  const registerButton = eventDetailsQuery(

    "#eventDetailsRegisterButton"

  );

  if (registerButton) {

    registerButton.classList.add(

      "is-disabled"

    );

    registerButton.setAttribute(

      "aria-disabled",

      "true"

    );

    registerButton.setAttribute(

      "tabindex",

      "-1"

    );

    const buttonText = eventDetailsQuery(

      "span",

      registerButton

    );

    if (buttonText) {

      buttonText.textContent =

        "Registration Closed";

    }

  }

}


/* =====================================================
   QUICK INFORMATION RENDERER
===================================================== */

function renderEventDetailsQuickInfo(event) {

  const container =

    eventDetailsDOM.quickDetailsContainer;

  if (!container) {

    return;

  }

  const registration = event.registration || {};

  const minimumAge =

    eventDetailsSafeNumber(

      registration.minimumAge,

      0

    );

  const maximumAge =

    eventDetailsSafeNumber(

      registration.maximumAge,

      0

    );

  let ageLabel = "All age groups";

  if (minimumAge && maximumAge) {

    ageLabel = `${minimumAge}–${maximumAge} years`;

  } else if (minimumAge) {

    ageLabel = `${minimumAge}+ years`;

  } else if (maximumAge) {

    ageLabel = `Up to ${maximumAge} years`;

  }

  const quickItems = [

    {

      icon: "fa-solid fa-calendar-days",

      label: "Event Date",

      value: eventDetailsSafeText(

        event.date?.displayDate,

        eventDetailsFormatDate(

          event.date?.start

        )

      )

    },

    {

      icon: "fa-solid fa-clock",

      label: "Event Time",

      value: eventDetailsSafeText(

        event.time,

        "To be announced"

      )

    },

    {

      icon: "fa-solid fa-location-dot",

      label: "Location",

      value: eventDetailsSafeText(

        event.location?.city,

        "India"

      )

    },

    {

      icon: "fa-solid fa-person",

      label: "Age Group",

      value: ageLabel

    },

    {

      icon: "fa-solid fa-indian-rupee-sign",

      label: "Entry Fee",

      value: eventDetailsFormatCurrency(

        registration.fee,

        registration.currency

      )

    },

    {

      icon: "fa-solid fa-users",

      label: "Capacity",

      value:

        eventDetailsSafeNumber(

          registration.capacity,

          0

        ).toLocaleString("en-IN")

    }

  ];

  container.innerHTML = quickItems

    .map((item) => {

      return `

        <div class="event-details-quick-info-row">

          <span>

            <i class="${eventDetailsEscapeHTML(
              item.icon
            )}"></i>

          </span>

          <div>

            <small>

              ${eventDetailsEscapeHTML(
                item.label
              )}

            </small>

            <strong>

              ${eventDetailsEscapeHTML(
                item.value
              )}

            </strong>

          </div>

        </div>

      `;

    })

    .join("");

}


/* =====================================================
   SAVE EVENT
===================================================== */

function toggleEventDetailsSavedState() {

  const event = eventDetailsState.event;

  if (!event) {

    return;

  }

  const eventId = sanitizeEventDetailsId(

    event.id

  );

  const wasSaved =

    eventDetailsState.savedEventIds.has(

      eventId

    );

  if (wasSaved) {

    eventDetailsState.savedEventIds.delete(

      eventId

    );

  } else {

    eventDetailsState.savedEventIds.add(

      eventId

    );

  }

  persistSavedEventDetails();

  updateEventDetailsSaveButtons(

    !wasSaved

  );

  showEventDetailsToast(

    wasSaved

      ? "Event removed from your saved list."

      : "Event saved successfully.",

    wasSaved ? "info" : "success"

  );

  syncSavedEventDetailsWithBackend(

    eventId,

    !wasSaved

  );

}


function updateEventDetailsSaveButtons(isSaved) {

  const buttons = [

    eventDetailsQuery(

      "#eventDetailsSaveButton"

    ),

    eventDetailsQuery(

      "#eventDetailsHeroSaveButton"

    )

  ].filter(Boolean);

  buttons.forEach((button) => {

    button.classList.toggle(

      "is-saved",

      isSaved

    );

    button.setAttribute(

      "aria-pressed",

      String(isSaved)

    );

    const icon = eventDetailsQuery(

      "i",

      button

    );

    const text = eventDetailsQuery(

      "span",

      button

    );

    if (icon) {

      icon.classList.toggle(

        "fa-solid",

        isSaved

      );

      icon.classList.toggle(

        "fa-regular",

        !isSaved

      );

      icon.classList.add(

        "fa-bookmark"

      );

    }

    if (text) {

      text.textContent =

        isSaved

          ? "Event Saved"

          : "Save Event";

    }

  });

}


/* =====================================================
   BACKEND SAVE PLACEHOLDER
===================================================== */

async function syncSavedEventDetailsWithBackend(

  eventId,

  shouldSave

) {

  if (EVENT_DETAILS_CONFIG.useLocalData) {

    return;

  }

  try {

    const response = await fetch(

      `${EVENT_DETAILS_CONFIG.apiBaseUrl}/events/${encodeURIComponent(
        eventId
      )}/save`,

      {

        method: shouldSave

          ? "POST"

          : "DELETE",

        headers: {

          "Content-Type": "application/json",

          Accept: "application/json"

        },

        credentials: "include"

      }

    );

    if (!response.ok) {

      throw new Error(

        `Save request failed with status ${response.status}`

      );

    }

  } catch (error) {

    console.warn(

      "Unable to synchronize saved event:",

      error

    );

  }

}


/* =====================================================
   REGISTRATION INTERACTIONS
===================================================== */

function bindEventDetailsRegistrationInteractions() {

  document.addEventListener(

    "click",

    (eventObject) => {

      const saveButton =

        eventObject.target.closest(

          "#eventDetailsSaveButton, #eventDetailsHeroSaveButton"

        );

      if (saveButton) {

        eventObject.preventDefault();

        toggleEventDetailsSavedState();

        return;

      }

      const registrationButton =

        eventObject.target.closest(

          "#eventDetailsRegisterButton, #eventDetailsHeroRegisterButton"

        );

      if (!registrationButton) {

        return;

      }

      if (

        registrationButton.classList.contains(

          "is-disabled"

        ) ||

        registrationButton.getAttribute(

          "aria-disabled"

        ) === "true"

      ) {

        eventObject.preventDefault();

        showEventDetailsToast(

          "Registration is currently unavailable.",

          "warning"

        );

      }

    }

  );

}


/* =====================================================
   CLEANUP
===================================================== */

function cleanupEventDetailsPartFour() {

  stopEventDetailsCountdown();

}


window.addEventListener(

  "beforeunload",

  cleanupEventDetailsPartFour

);

/* =====================================================
   EVENT DETAILS PAGE
   event-details.js

   PART 5
   SHARE BUTTONS • RELATED EVENTS
   MOBILE NAVIGATION • TOASTS
   FINAL INTERACTION BINDING
===================================================== */


/* =====================================================
   SHARE SECTION RENDERER
===================================================== */

function renderEventDetailsShareSection() {

  const shareContainer = eventDetailsFindFirst([

    "#eventDetailsShare",

    "#eventShare",

    ".event-details-share"

  ]);

  if (!shareContainer) {

    return;

  }

  shareContainer.innerHTML = `

    <span class="event-details-share-label">

      Share this event

    </span>

    <div class="event-details-share-buttons">

      <button
        type="button"
        class="event-details-share-button whatsapp"
        data-share-platform="whatsapp"
        aria-label="Share event on WhatsApp"
      >

        <i class="fa-brands fa-whatsapp"></i>

      </button>

      <button
        type="button"
        class="event-details-share-button facebook"
        data-share-platform="facebook"
        aria-label="Share event on Facebook"
      >

        <i class="fa-brands fa-facebook-f"></i>

      </button>

      <button
        type="button"
        class="event-details-share-button twitter"
        data-share-platform="twitter"
        aria-label="Share event on X"
      >

        <i class="fa-brands fa-x-twitter"></i>

      </button>

      <button
        type="button"
        class="event-details-share-button copy"
        data-share-platform="copy"
        aria-label="Copy event link"
      >

        <i class="fa-solid fa-link"></i>

      </button>

    </div>

  `;

}


/* =====================================================
   SHARE DATA
===================================================== */

function getEventDetailsShareData() {

  const event = eventDetailsState.event;

  if (!event) {

    return null;

  }

  return {

    title: eventDetailsSafeText(

      event.title,

      "FIFA Mission India Event"

    ),

    text: eventDetailsSafeText(

      event.shortDescription,

      "Discover this football event on FIFA Mission India."

    ),

    url: window.location.href

  };

}


/* =====================================================
   SHARE HANDLER
===================================================== */

async function handleEventDetailsShare(platform) {

  const shareData = getEventDetailsShareData();

  if (!shareData) {

    return;

  }

  const encodedUrl = encodeURIComponent(

    shareData.url

  );

  const encodedTitle = encodeURIComponent(

    shareData.title

  );

  const encodedText = encodeURIComponent(

    `${shareData.title}\n${shareData.text}`

  );

  try {

    switch (platform) {

      case "whatsapp":

        window.open(

          `https://wa.me/?text=${encodedText}%0A${encodedUrl}`,

          "_blank",

          "noopener,noreferrer"

        );

        break;


      case "facebook":

        window.open(

          `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,

          "_blank",

          "noopener,noreferrer"

        );

        break;


      case "twitter":

        window.open(

          `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,

          "_blank",

          "noopener,noreferrer"

        );

        break;


      case "copy":

        await copyEventDetailsLink(

          shareData.url

        );

        break;


      case "native":

        if (!navigator.share) {

          await copyEventDetailsLink(

            shareData.url

          );

          return;

        }

        await navigator.share({

          title: shareData.title,

          text: shareData.text,

          url: shareData.url

        });

        break;


      default:

        await copyEventDetailsLink(

          shareData.url

        );

    }

  } catch (error) {

    if (error?.name === "AbortError") {

      return;

    }

    console.warn(

      "Unable to share event:",

      error

    );

    showEventDetailsToast(

      "Unable to share this event right now.",

      "error"

    );

  }

}


/* =====================================================
   COPY LINK
===================================================== */

async function copyEventDetailsLink(url) {

  if (

    navigator.clipboard &&

    window.isSecureContext

  ) {

    await navigator.clipboard.writeText(url);

    showEventDetailsToast(

      "Event link copied successfully.",

      "success"

    );

    return;

  }

  const temporaryInput = document.createElement(

    "textarea"

  );

  temporaryInput.value = url;

  temporaryInput.setAttribute(

    "readonly",

    ""

  );

  temporaryInput.style.position = "fixed";

  temporaryInput.style.opacity = "0";

  temporaryInput.style.pointerEvents = "none";

  document.body.appendChild(

    temporaryInput

  );

  temporaryInput.select();

  const copied = document.execCommand(

    "copy"

  );

  temporaryInput.remove();

  showEventDetailsToast(

    copied

      ? "Event link copied successfully."

      : "Copying the event link failed.",

    copied ? "success" : "error"

  );

}


/* =====================================================
   SHARE INTERACTIONS
===================================================== */

function bindEventDetailsShareInteractions() {

  document.addEventListener(

    "click",

    (eventObject) => {

      const shareButton =

        eventObject.target.closest(

          "[data-share-platform]"

        );

      if (!shareButton) {

        return;

      }

      const platform =

        shareButton.dataset.sharePlatform;

      handleEventDetailsShare(platform);

    }

  );

}


/* =====================================================
   RELATED EVENTS RENDERER
===================================================== */

function renderRelatedEventDetails() {

  const container =

    eventDetailsDOM.relatedEventsGrid;

  if (!container) {

    return;

  }

  const relatedEvents =

    eventDetailsState.relatedEvents;

  if (!Array.isArray(relatedEvents) ||

      !relatedEvents.length) {

    container.innerHTML = `

      <article class="event-details-related-card">

        <div class="event-details-related-content">

          <h3>No Related Events Available</h3>

          <p>

            More football events will be published soon.

          </p>

          <a href="events.html">

            Explore All Events

            <i class="fa-solid fa-arrow-right"></i>

          </a>

        </div>

      </article>

    `;

    return;

  }

  container.innerHTML = relatedEvents

    .map((event) => {

      const title = eventDetailsEscapeHTML(

        eventDetailsSafeText(

          event.title,

          "Football Event"

        )

      );

      const image = eventDetailsEscapeHTML(

        eventDetailsSafeText(

          event.image,

          EVENT_DETAILS_CONFIG.fallbackImage

        )

      );

      const category = eventDetailsEscapeHTML(

        eventDetailsSafeText(

          event.category,

          "Football Event"

        )

      );

      const day = eventDetailsEscapeHTML(

        eventDetailsSafeText(

          event.date?.day,

          eventDetailsFormatDate(

            event.date?.start,

            {

              day: "2-digit"

            }

          )

        )

      );

      const month = eventDetailsEscapeHTML(

        eventDetailsSafeText(

          event.date?.month,

          eventDetailsFormatDate(

            event.date?.start,

            {

              month: "short"

            }

          ).toUpperCase()

        )

      );

      const displayDate = eventDetailsEscapeHTML(

        eventDetailsSafeText(

          event.date?.displayDate,

          eventDetailsFormatDate(

            event.date?.start

          )

        )

      );

      const location = eventDetailsEscapeHTML(

        eventDetailsSafeText(

          event.location?.city,

          "India"

        )

      );

      const fee = eventDetailsEscapeHTML(

        eventDetailsFormatCurrency(

          event.registration?.fee,

          event.registration?.currency

        )

      );

      const url = `event-details.html?id=${encodeURIComponent(
        event.id
      )}`;

      return `

        <article class="event-details-related-card">

          <div class="event-details-related-image">

            <img
              src="${image}"
              alt="${title}"
              loading="lazy"
              data-event-image-fallback
            />

            <div class="event-details-related-date">

              <strong>${day}</strong>

              <span>${month}</span>

            </div>

            <span class="event-details-related-category">

              ${category}

            </span>

          </div>

          <div class="event-details-related-content">

            <h3>${title}</h3>

            <div class="event-details-related-meta">

              <div>

                <i class="fa-solid fa-calendar-days"></i>

                <span>${displayDate}</span>

              </div>

              <div>

                <i class="fa-solid fa-location-dot"></i>

                <span>${location}</span>

              </div>

              <div>

                <i class="fa-solid fa-ticket"></i>

                <span>${fee}</span>

              </div>

            </div>

            <a href="${url}">

              View Event

              <i class="fa-solid fa-arrow-right"></i>

            </a>

          </div>

        </article>

      `;

    })

    .join("");

  eventDetailsQueryAll(

    "[data-event-image-fallback]",

    container

  ).forEach((image) => {

    bindEventDetailsImageFallback(image);

  });

}


/* =====================================================
   MOBILE NAVIGATION
===================================================== */

function openEventDetailsMobileMenu() {

  const menu = eventDetailsDOM.mobileMenu;

  const overlay = eventDetailsDOM.mobileOverlay;

  const button =

    eventDetailsDOM.mobileMenuButton;

  if (!menu) {

    return;

  }

  eventDetailsState.mobileMenuOpen = true;

  menu.classList.add("is-open");

  menu.hidden = false;

  menu.setAttribute(

    "aria-hidden",

    "false"

  );

  if (overlay) {

    overlay.classList.add("is-visible");

    overlay.hidden = false;

    overlay.setAttribute(

      "aria-hidden",

      "false"

    );

  }

  if (button) {

    button.setAttribute(

      "aria-expanded",

      "true"

    );

  }

  document.body.classList.add(

    "event-details-menu-open"

  );

  const firstFocusableElement =

    eventDetailsFindFirst([

      "a",

      "button"

    ], menu);

  if (firstFocusableElement) {

    window.setTimeout(() => {

      firstFocusableElement.focus();

    }, 50);

  }

}


function closeEventDetailsMobileMenu() {

  const menu = eventDetailsDOM.mobileMenu;

  const overlay = eventDetailsDOM.mobileOverlay;

  const button =

    eventDetailsDOM.mobileMenuButton;

  eventDetailsState.mobileMenuOpen = false;

  if (menu) {

    menu.classList.remove("is-open");

    menu.setAttribute(

      "aria-hidden",

      "true"

    );

    window.setTimeout(() => {

      if (!eventDetailsState.mobileMenuOpen) {

        menu.hidden = true;

      }

    }, 250);

  }

  if (overlay) {

    overlay.classList.remove("is-visible");

    overlay.setAttribute(

      "aria-hidden",

      "true"

    );

    window.setTimeout(() => {

      if (!eventDetailsState.mobileMenuOpen) {

        overlay.hidden = true;

      }

    }, 250);

  }

  if (button) {

    button.setAttribute(

      "aria-expanded",

      "false"

    );

  }

  document.body.classList.remove(

    "event-details-menu-open"

  );

}


function toggleEventDetailsMobileMenu() {

  if (eventDetailsState.mobileMenuOpen) {

    closeEventDetailsMobileMenu();

  } else {

    openEventDetailsMobileMenu();

  }

}


function bindEventDetailsMobileNavigation() {

  const openButton =

    eventDetailsDOM.mobileMenuButton;

  const closeButton =

    eventDetailsDOM.mobileMenuCloseButton;

  const overlay =

    eventDetailsDOM.mobileOverlay;

  const menu =

    eventDetailsDOM.mobileMenu;

  if (openButton) {

    openButton.addEventListener(

      "click",

      toggleEventDetailsMobileMenu

    );

  }

  if (closeButton) {

    closeButton.addEventListener(

      "click",

      closeEventDetailsMobileMenu

    );

  }

  if (overlay) {

    overlay.addEventListener(

      "click",

      closeEventDetailsMobileMenu

    );

  }

  if (menu) {

    menu.addEventListener(

      "click",

      (eventObject) => {

        if (

          eventObject.target.closest("a")

        ) {

          closeEventDetailsMobileMenu();

        }

      }

    );

  }

  document.addEventListener(

    "keydown",

    (eventObject) => {

      if (

        eventObject.key === "Escape" &&

        eventDetailsState.mobileMenuOpen

      ) {

        closeEventDetailsMobileMenu();

        if (openButton) {

          openButton.focus();

        }

      }

    }

  );

  window.addEventListener(

    "resize",

    () => {

      if (

        window.innerWidth > 900 &&

        eventDetailsState.mobileMenuOpen

      ) {

        closeEventDetailsMobileMenu();

      }

    }

  );

}


/* =====================================================
   NAVBAR SCROLL EFFECT
===================================================== */

function bindEventDetailsNavbarScroll() {

  const navbar = eventDetailsDOM.navbar;

  if (!navbar) {

    return;

  }

  function updateNavbarState() {

    navbar.classList.toggle(

      "is-scrolled",

      window.scrollY > 20

    );

  }

  updateNavbarState();

  window.addEventListener(

    "scroll",

    updateNavbarState,

    {

      passive: true

    }

  );

}


/* =====================================================
   TOAST NOTIFICATIONS
===================================================== */

function showEventDetailsToast(

  message,

  type = "success"

) {

  const safeMessage = eventDetailsSafeText(

    message,

    "Action completed."

  );

  let toast = eventDetailsDOM.toast;

  if (!toast) {

    toast = eventDetailsCreateElement(

      "div",

      "event-details-toast",

      {

        id: "eventDetailsToast",

        role: "status",

        "aria-live": "polite",

        "aria-atomic": "true"

      }

    );

    document.body.appendChild(toast);

    eventDetailsDOM.toast = toast;

  }

  if (eventDetailsState.toastTimeout) {

    window.clearTimeout(

      eventDetailsState.toastTimeout

    );

  }

  const iconMap = {

    success: "fa-solid fa-circle-check",

    error: "fa-solid fa-circle-xmark",

    warning:
      "fa-solid fa-triangle-exclamation",

    info: "fa-solid fa-circle-info"

  };

  const icon =

    iconMap[type] ||

    iconMap.success;

  toast.className =

    `event-details-toast ${type}`;

  toast.innerHTML = `

    <i class="${icon}" aria-hidden="true"></i>

    <span>

      ${eventDetailsEscapeHTML(safeMessage)}

    </span>

  `;

  toast.hidden = false;

  toast.classList.remove("is-hiding");

  eventDetailsState.toastTimeout =

    window.setTimeout(() => {

      hideEventDetailsToast();

    }, EVENT_DETAILS_CONFIG.toastDuration);

}


function hideEventDetailsToast() {

  const toast = eventDetailsDOM.toast;

  if (!toast) {

    return;

  }

  toast.classList.add("is-hiding");

  window.setTimeout(() => {

    toast.hidden = true;

    toast.classList.remove("is-hiding");

  }, 250);

}


/* =====================================================
   SMOOTH ANCHOR LINKS
===================================================== */

function bindEventDetailsSmoothScrolling() {

  document.addEventListener(

    "click",

    (eventObject) => {

      const anchor = eventObject.target.closest(

        'a[href^="#"]'

      );

      if (!anchor) {

        return;

      }

      const targetId = anchor.getAttribute(

        "href"

      );

      if (

        !targetId ||

        targetId === "#"

      ) {

        return;

      }

      const targetElement =

        eventDetailsQuery(targetId);

      if (!targetElement) {

        return;

      }

      eventObject.preventDefault();

      targetElement.scrollIntoView({

        behavior: "smooth",

        block: "start"

      });

    }

  );

}


/* =====================================================
   BROWSER BACK/FORWARD SUPPORT
===================================================== */

function bindEventDetailsHistoryChanges() {

  window.addEventListener(

    "popstate",

    async () => {

      const nextEventId =

        getEventDetailsIdFromUrl();

      if (

        nextEventId ===

        eventDetailsState.eventId

      ) {

        return;

      }

      stopEventDetailsCountdown();

      showEventDetailsLoader();

      eventDetailsState.eventId =

        nextEventId;

      try {

        const event =

          await loadEventDetailsData(

            nextEventId

          );

        if (!event) {

          eventDetailsState.event = null;

          showEventDetailsNotFound();

          return;

        }

        eventDetailsState.event = event;

        eventDetailsState.relatedEvents =

          getRelatedEventDetails(

            event,

            EVENT_DETAILS_CONFIG.relatedEventsLimit

          );

        updateEventDetailsDocumentTitle(event);

        showEventDetailsPage();

        renderCompleteEventDetailsPage();

      } catch (error) {

        console.error(

          "Unable to update event page:",

          error

        );

        showEventDetailsNotFound();

      } finally {

        hideEventDetailsLoader();

      }

    }

  );

}


/* =====================================================
   FINAL INTERACTION BINDING
===================================================== */

function bindEventDetailsInteractions() {

  if (

    document.documentElement.dataset
      .eventDetailsInteractionsBound === "true"

  ) {

    return;

  }

  document.documentElement.dataset
    .eventDetailsInteractionsBound = "true";

  renderEventDetailsShareSection();

  bindEventDetailsFaqInteractions();

  bindEventDetailsRegistrationInteractions();

  bindEventDetailsShareInteractions();

  bindEventDetailsMobileNavigation();

  bindEventDetailsNavbarScroll();

  bindEventDetailsSmoothScrolling();

  bindEventDetailsHistoryChanges();

}


/* =====================================================
   FINAL CLEANUP
===================================================== */

function cleanupEventDetailsPage() {

  stopEventDetailsCountdown();

  if (eventDetailsState.toastTimeout) {

    window.clearTimeout(

      eventDetailsState.toastTimeout

    );

    eventDetailsState.toastTimeout = null;

  }

}


window.addEventListener(

  "pagehide",

  cleanupEventDetailsPage

);