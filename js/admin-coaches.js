/* ======================================================
   BHARAT FOOTBALL FANS
   ADMIN COACHES
   PART 1A
   CONFIG • STATE • DOM CACHE • MOCK DATA • API LAYER
====================================================== */

"use strict";


/* ======================================================
   CONFIGURATION
====================================================== */

const ADMIN_COACHES_CONFIG = Object.freeze({

    apiBaseURL:
        window.ADMIN_API_BASE_URL ||
        "/api/v1",

    endpoints: Object.freeze({

        coaches:
            "/admin/coaches",

        verifyCoach:
            (coachId) =>
                `/admin/coaches/${coachId}/verify`,

        availability:
            (coachId) =>
                `/admin/coaches/${coachId}/availability`,

        export:
            "/admin/coaches/export",

        logout:
            "/auth/logout"

    }),

    requestTimeout:
        15000,

    pageSize:
        10,

    allowedImageTypes: Object.freeze([

        "image/jpeg",
        "image/png",
        "image/webp"

    ]),

    maxImageSize:
        5 * 1024 * 1024,

    useMockAPI:
        true,

    mockDelay:
        650

});


/* ======================================================
   APPLICATION STATE
====================================================== */

const adminCoachesState = {

    coaches: [],

    filteredCoaches: [],

    selectedCoachIds:
        new Set(),

    filters: {

        search: "",

        verification:
            "all",

        licence:
            "all",

        specialisation:
            "all",

        state:
            "all",

        availability:
            "all",

        sort:
            "newest"

    },

    pagination: {

        currentPage:
            1,

        pageSize:
            ADMIN_COACHES_CONFIG.pageSize,

        totalPages:
            1

    },

    activeCoach:
        null,

    pendingAction:
        null,

    isLoading:
        false,

    isSubmitting:
        false

};


/* ======================================================
   DOM CACHE
====================================================== */

const adminCoachesDOM = {};


function adminCoachesCacheDOM(){

    adminCoachesDOM.loadingScreen =
        document.getElementById(
            "adminLoadingScreen"
        );

    adminCoachesDOM.sidebar =
        document.getElementById(
            "adminSidebar"
        );

    adminCoachesDOM.sidebarOverlay =
        document.getElementById(
            "adminSidebarOverlay"
        );

    adminCoachesDOM.mobileMenuButton =
        document.getElementById(
            "adminMobileMenuButton"
        );

    adminCoachesDOM.sidebarCloseButton =
        document.getElementById(
            "adminSidebarCloseButton"
        );

    adminCoachesDOM.notificationButton =
        document.getElementById(
            "adminNotificationButton"
        );

    adminCoachesDOM.notificationsPanel =
        document.getElementById(
            "adminNotificationsPanel"
        );

    adminCoachesDOM.closeNotificationsButton =
        document.getElementById(
            "closeNotificationsButton"
        );

    adminCoachesDOM.accountButton =
        document.getElementById(
            "adminAccountButton"
        );

    adminCoachesDOM.accountMenu =
        document.getElementById(
            "adminAccountMenu"
        );

    adminCoachesDOM.totalCoachesMetric =
        document.getElementById(
            "totalCoachesMetric"
        );

    adminCoachesDOM.verifiedCoachesMetric =
        document.getElementById(
            "verifiedCoachesMetric"
        );

    adminCoachesDOM.pendingCoachesMetric =
        document.getElementById(
            "pendingCoachesMetric"
        );

    adminCoachesDOM.activeCoachesMetric =
        document.getElementById(
            "activeCoachesMetric"
        );

    adminCoachesDOM.coachSearchInput =
        document.getElementById(
            "coachSearchInput"
        );

    adminCoachesDOM.verificationFilter =
        document.getElementById(
            "verificationFilter"
        );

    adminCoachesDOM.licenceFilter =
        document.getElementById(
            "licenceFilter"
        );

    adminCoachesDOM.specialisationFilter =
        document.getElementById(
            "specialisationFilter"
        );

    adminCoachesDOM.stateFilter =
        document.getElementById(
            "stateFilter"
        );

    adminCoachesDOM.availabilityFilter =
        document.getElementById(
            "availabilityFilter"
        );

    adminCoachesDOM.sortFilter =
        document.getElementById(
            "sortFilter"
        );

    adminCoachesDOM.resetFiltersButton =
        document.getElementById(
            "resetFiltersButton"
        );

    adminCoachesDOM.refreshCoachesButton =
        document.getElementById(
            "refreshCoachesButton"
        );

    adminCoachesDOM.addCoachButton =
        document.getElementById(
            "addCoachButton"
        );

    adminCoachesDOM.exportCoachesButton =
        document.getElementById(
            "exportCoachesButton"
        );

    adminCoachesDOM.coachesTableBody =
        document.getElementById(
            "coachesTableBody"
        );

    adminCoachesDOM.coachesTable =
        document.getElementById(
            "coachesTable"
        );

    adminCoachesDOM.coachesEmptyState =
        document.getElementById(
            "coachesEmptyState"
        );

    adminCoachesDOM.coachesResultCount =
        document.getElementById(
            "coachesResultCount"
        );

    adminCoachesDOM.selectAllCoaches =
        document.getElementById(
            "selectAllCoaches"
        );

    adminCoachesDOM.bulkActions =
        document.getElementById(
            "coachBulkActions"
        );

    adminCoachesDOM.selectedCoachCount =
        document.getElementById(
            "selectedCoachCount"
        );

    adminCoachesDOM.bulkVerifyButton =
        document.getElementById(
            "bulkVerifyButton"
        );

    adminCoachesDOM.bulkAvailableButton =
        document.getElementById(
            "bulkAvailableButton"
        );

    adminCoachesDOM.bulkUnavailableButton =
        document.getElementById(
            "bulkUnavailableButton"
        );

    adminCoachesDOM.bulkDeleteButton =
        document.getElementById(
            "bulkDeleteButton"
        );

    adminCoachesDOM.paginationContainer =
        document.getElementById(
            "coachesPagination"
        );

    adminCoachesDOM.paginationPages =
        document.getElementById(
            "coachesPaginationPages"
        );

    adminCoachesDOM.previousPageButton =
        document.getElementById(
            "previousPageButton"
        );

    adminCoachesDOM.nextPageButton =
        document.getElementById(
            "nextPageButton"
        );

    adminCoachesDOM.paginationSummary =
        document.getElementById(
            "paginationSummary"
        );

    adminCoachesDOM.viewCoachModal =
        document.getElementById(
            "viewCoachModal"
        );

    adminCoachesDOM.viewCoachContent =
        document.getElementById(
            "viewCoachContent"
        );

    adminCoachesDOM.editFromViewButton =
        document.getElementById(
            "editFromViewButton"
        );

    adminCoachesDOM.addCoachModal =
        document.getElementById(
            "addCoachModal"
        );

    adminCoachesDOM.addCoachForm =
        document.getElementById(
            "addCoachForm"
        );

    adminCoachesDOM.submitAddCoachButton =
        document.getElementById(
            "submitAddCoachButton"
        );

    adminCoachesDOM.editCoachModal =
        document.getElementById(
            "editCoachModal"
        );

    adminCoachesDOM.editCoachForm =
        document.getElementById(
            "editCoachForm"
        );

    adminCoachesDOM.submitEditCoachButton =
        document.getElementById(
            "submitEditCoachButton"
        );

    adminCoachesDOM.verifyCoachModal =
        document.getElementById(
            "verifyCoachModal"
        );

    adminCoachesDOM.verifyCoachForm =
        document.getElementById(
            "verifyCoachForm"
        );

    adminCoachesDOM.confirmVerifyCoachButton =
        document.getElementById(
            "confirmVerifyCoachButton"
        );

    adminCoachesDOM.deleteCoachModal =
        document.getElementById(
            "deleteCoachModal"
        );

    adminCoachesDOM.deleteCoachName =
        document.getElementById(
            "deleteCoachName"
        );

    adminCoachesDOM.deleteCoachConfirmationInput =
        document.getElementById(
            "deleteCoachConfirmationInput"
        );

    adminCoachesDOM.confirmDeleteCoachButton =
        document.getElementById(
            "confirmDeleteCoachButton"
        );

    adminCoachesDOM.exportCoachesModal =
        document.getElementById(
            "exportCoachesModal"
        );

    adminCoachesDOM.exportCoachesForm =
        document.getElementById(
            "exportCoachesForm"
        );

    adminCoachesDOM.confirmExportButton =
        document.getElementById(
            "confirmExportButton"
        );

    adminCoachesDOM.logoutModal =
        document.getElementById(
            "logoutModal"
        );

    adminCoachesDOM.logoutButtons =
        document.querySelectorAll(
            "[data-admin-logout]"
        );

    adminCoachesDOM.confirmLogoutButton =
        document.getElementById(
            "confirmLogoutButton"
        );

    adminCoachesDOM.modalCloseButtons =
        document.querySelectorAll(
            "[data-modal-close]"
        );

    adminCoachesDOM.toastRegion =
        document.getElementById(
            "adminToastRegion"
        );

}


/* ======================================================
   MOCK COACH DATA
====================================================== */

const ADMIN_COACHES_MOCK_DATA = [

    {

        id:
            "coach-001",

        firstName:
            "Vikram",

        lastName:
            "Singh",

        fullName:
            "Vikram Singh",

        email:
            "vikram.singh@example.com",

        mobileNumber:
            "+91 98765 41001",

        dateOfBirth:
            "1984-03-18",

        gender:
            "male",

        city:
            "Mohali",

        state:
            "Punjab",

        country:
            "India",

        academy:
            "Minerva Football Academy",

        licence:
            "AFC A",

        specialisation:
            "Youth Development",

        experienceYears:
            16,

        verificationStatus:
            "verified",

        availability:
            "available",

        profileCompletion:
            96,

        playersManaged:
            64,

        matchesManaged:
            138,

        winRate:
            71,

        languages: [

            "English",
            "Hindi",
            "Punjabi"

        ],

        biography:
            "Experienced youth football coach focused on technical development, tactical awareness and long-term player progression.",

        achievements: [

            "AFC Youth Championship finalist",
            "National academy development award",
            "Developed 18 professional players"

        ],

        profileImage:
            "",

        joinedAt:
            "2026-05-09T09:30:00Z",

        lastActiveAt:
            "2026-07-21T06:15:00Z"

    },

    {

        id:
            "coach-002",

        firstName:
            "Anil",

        lastName:
            "Sharma",

        fullName:
            "Anil Sharma",

        email:
            "anil.sharma@example.com",

        mobileNumber:
            "+91 98765 41002",

        dateOfBirth:
            "1988-09-12",

        gender:
            "male",

        city:
            "New Delhi",

        state:
            "Delhi",

        country:
            "India",

        academy:
            "Delhi Football Development Centre",

        licence:
            "AFC B",

        specialisation:
            "Tactical Coaching",

        experienceYears:
            11,

        verificationStatus:
            "pending",

        availability:
            "available",

        profileCompletion:
            82,

        playersManaged:
            38,

        matchesManaged:
            86,

        winRate:
            64,

        languages: [

            "English",
            "Hindi"

        ],

        biography:
            "Tactical coach specialising in structured possession, transition play and match preparation.",

        achievements: [

            "Delhi Youth League champion",
            "AFC grassroots mentor"

        ],

        profileImage:
            "",

        joinedAt:
            "2026-07-18T11:40:00Z",

        lastActiveAt:
            "2026-07-20T14:10:00Z"

    },

    {

        id:
            "coach-003",

        firstName:
            "Meera",

        lastName:
            "Nair",

        fullName:
            "Meera Nair",

        email:
            "meera.nair@example.com",

        mobileNumber:
            "+91 98765 41003",

        dateOfBirth:
            "1990-01-25",

        gender:
            "female",

        city:
            "Kochi",

        state:
            "Kerala",

        country:
            "India",

        academy:
            "Kerala Elite Football School",

        licence:
            "AFC B",

        specialisation:
            "Fitness & Conditioning",

        experienceYears:
            9,

        verificationStatus:
            "verified",

        availability:
            "engaged",

        profileCompletion:
            91,

        playersManaged:
            42,

        matchesManaged:
            73,

        winRate:
            68,

        languages: [

            "English",
            "Malayalam",
            "Hindi"

        ],

        biography:
            "Performance coach with expertise in conditioning, injury prevention and athlete development.",

        achievements: [

            "Certified strength and conditioning specialist",
            "State women football development award"

        ],

        profileImage:
            "",

        joinedAt:
            "2026-04-24T08:20:00Z",

        lastActiveAt:
            "2026-07-21T05:45:00Z"

    },

    {

        id:
            "coach-004",

        firstName:
            "Samuel",

        lastName:
            "Kikon",

        fullName:
            "Samuel Kikon",

        email:
            "samuel.kikon@example.com",

        mobileNumber:
            "+91 98765 41004",

        dateOfBirth:
            "1986-06-04",

        gender:
            "male",

        city:
            "Dimapur",

        state:
            "Nagaland",

        country:
            "India",

        academy:
            "Northeast Football Excellence Centre",

        licence:
            "AFC C",

        specialisation:
            "Grassroots Development",

        experienceYears:
            12,

        verificationStatus:
            "verified",

        availability:
            "available",

        profileCompletion:
            88,

        playersManaged:
            55,

        matchesManaged:
            92,

        winRate:
            66,

        languages: [

            "English",
            "Hindi",
            "Nagamese"

        ],

        biography:
            "Grassroots development coach working to identify and nurture young football talent across Northeast India.",

        achievements: [

            "Regional grassroots coach award",
            "Developed multiple state-level players"

        ],

        profileImage:
            "",

        joinedAt:
            "2026-03-16T07:50:00Z",

        lastActiveAt:
            "2026-07-19T10:30:00Z"

    },

    {

        id:
            "coach-005",

        firstName:
            "Rahul",

        lastName:
            "Deshmukh",

        fullName:
            "Rahul Deshmukh",

        email:
            "rahul.deshmukh@example.com",

        mobileNumber:
            "+91 98765 41005",

        dateOfBirth:
            "1982-11-30",

        gender:
            "male",

        city:
            "Pune",

        state:
            "Maharashtra",

        country:
            "India",

        academy:
            "Pune United Academy",

        licence:
            "AFC Pro",

        specialisation:
            "Head Coach",

        experienceYears:
            20,

        verificationStatus:
            "verified",

        availability:
            "engaged",

        profileCompletion:
            100,

        playersManaged:
            89,

        matchesManaged:
            214,

        winRate:
            74,

        languages: [

            "English",
            "Hindi",
            "Marathi"

        ],

        biography:
            "Senior professional coach experienced in elite development programmes, competition planning and technical leadership.",

        achievements: [

            "National youth league champion",
            "AFC elite coaching distinction",
            "Developed 24 professional players"

        ],

        profileImage:
            "",

        joinedAt:
            "2026-02-04T12:15:00Z",

        lastActiveAt:
            "2026-07-21T04:50:00Z"

    },

    {

        id:
            "coach-006",

        firstName:
            "Arjun",

        lastName:
            "Das",

        fullName:
            "Arjun Das",

        email:
            "arjun.das@example.com",

        mobileNumber:
            "+91 98765 41006",

        dateOfBirth:
            "1992-05-19",

        gender:
            "male",

        city:
            "Kolkata",

        state:
            "West Bengal",

        country:
            "India",

        academy:
            "Bengal Football Institute",

        licence:
            "AFC C",

        specialisation:
            "Goalkeeping",

        experienceYears:
            7,

        verificationStatus:
            "pending",

        availability:
            "available",

        profileCompletion:
            76,

        playersManaged:
            24,

        matchesManaged:
            49,

        winRate:
            59,

        languages: [

            "English",
            "Hindi",
            "Bengali"

        ],

        biography:
            "Goalkeeping coach specialising in technical fundamentals, distribution, positioning and decision-making.",

        achievements: [

            "State goalkeeper development programme coach"

        ],

        profileImage:
            "",

        joinedAt:
            "2026-07-15T13:20:00Z",

        lastActiveAt:
            "2026-07-20T08:30:00Z"

    },

    {

        id:
            "coach-007",

        firstName:
            "Nisha",

        lastName:
            "Verma",

        fullName:
            "Nisha Verma",

        email:
            "nisha.verma@example.com",

        mobileNumber:
            "+91 98765 41007",

        dateOfBirth:
            "1991-08-08",

        gender:
            "female",

        city:
            "Jaipur",

        state:
            "Rajasthan",

        country:
            "India",

        academy:
            "Rajasthan Girls Football Academy",

        licence:
            "AFC B",

        specialisation:
            "Women’s Football",

        experienceYears:
            8,

        verificationStatus:
            "verified",

        availability:
            "available",

        profileCompletion:
            93,

        playersManaged:
            46,

        matchesManaged:
            67,

        winRate:
            70,

        languages: [

            "English",
            "Hindi"

        ],

        biography:
            "Women’s football coach committed to building inclusive development pathways for talented young players.",

        achievements: [

            "State women’s league champion",
            "Women in football leadership award"

        ],

        profileImage:
            "",

        joinedAt:
            "2026-05-27T10:10:00Z",

        lastActiveAt:
            "2026-07-21T07:05:00Z"

    },

    {

        id:
            "coach-008",

        firstName:
            "Abdul",

        lastName:
            "Rahman",

        fullName:
            "Abdul Rahman",

        email:
            "abdul.rahman@example.com",

        mobileNumber:
            "+91 98765 41008",

        dateOfBirth:
            "1987-02-14",

        gender:
            "male",

        city:
            "Hyderabad",

        state:
            "Telangana",

        country:
            "India",

        academy:
            "Hyderabad Football Centre",

        licence:
            "AFC A",

        specialisation:
            "Technical Development",

        experienceYears:
            13,

        verificationStatus:
            "rejected",

        availability:
            "unavailable",

        profileCompletion:
            68,

        playersManaged:
            51,

        matchesManaged:
            108,

        winRate:
            62,

        languages: [

            "English",
            "Hindi",
            "Telugu",
            "Urdu"

        ],

        biography:
            "Technical development coach experienced in individual skill programmes and academy curriculum design.",

        achievements: [

            "Regional technical development award"

        ],

        profileImage:
            "",

        joinedAt:
            "2026-06-22T09:55:00Z",

        lastActiveAt:
            "2026-07-12T12:40:00Z"

    },

    {

        id:
            "coach-009",

        firstName:
            "Lalhmingmawia",

        lastName:
            "Sailo",

        fullName:
            "Lalhmingmawia Sailo",

        email:
            "lalhmingmawia.sailo@example.com",

        mobileNumber:
            "+91 98765 41009",

        dateOfBirth:
            "1985-10-21",

        gender:
            "male",

        city:
            "Aizawl",

        state:
            "Mizoram",

        country:
            "India",

        academy:
            "Mizoram Youth Football Centre",

        licence:
            "AFC B",

        specialisation:
            "Talent Identification",

        experienceYears:
            14,

        verificationStatus:
            "verified",

        availability:
            "engaged",

        profileCompletion:
            95,

        playersManaged:
            72,

        matchesManaged:
            121,

        winRate:
            72,

        languages: [

            "English",
            "Hindi",
            "Mizo"

        ],

        biography:
            "Talent identification specialist with extensive experience scouting and developing players from Northeast India.",

        achievements: [

            "National scouting excellence recognition",
            "Developed 15 national-level youth players"

        ],

        profileImage:
            "",

        joinedAt:
            "2026-01-28T06:40:00Z",

        lastActiveAt:
            "2026-07-21T03:55:00Z"

    },

    {

        id:
            "coach-010",

        firstName:
            "Karan",

        lastName:
            "Malhotra",

        fullName:
            "Karan Malhotra",

        email:
            "karan.malhotra@example.com",

        mobileNumber:
            "+91 98765 41010",

        dateOfBirth:
            "1993-04-10",

        gender:
            "male",

        city:
            "Chandigarh",

        state:
            "Chandigarh",

        country:
            "India",

        academy:
            "Chandigarh Junior Football Club",

        licence:
            "AFC C",

        specialisation:
            "Youth Development",

        experienceYears:
            6,

        verificationStatus:
            "pending",

        availability:
            "available",

        profileCompletion:
            79,

        playersManaged:
            29,

        matchesManaged:
            44,

        winRate:
            61,

        languages: [

            "English",
            "Hindi",
            "Punjabi"

        ],

        biography:
            "Young development coach focused on age-appropriate training, player confidence and technical growth.",

        achievements: [

            "City youth league runner-up"

        ],

        profileImage:
            "",

        joinedAt:
            "2026-07-11T15:25:00Z",

        lastActiveAt:
            "2026-07-20T17:15:00Z"

    },

    {

        id:
            "coach-011",

        firstName:
            "Priya",

        lastName:
            "Reddy",

        fullName:
            "Priya Reddy",

        email:
            "priya.reddy@example.com",

        mobileNumber:
            "+91 98765 41011",

        dateOfBirth:
            "1989-12-03",

        gender:
            "female",

        city:
            "Bengaluru",

        state:
            "Karnataka",

        country:
            "India",

        academy:
            "Bengaluru High Performance Academy",

        licence:
            "AFC A",

        specialisation:
            "Performance Analysis",

        experienceYears:
            10,

        verificationStatus:
            "verified",

        availability:
            "available",

        profileCompletion:
            98,

        playersManaged:
            57,

        matchesManaged:
            116,

        winRate:
            73,

        languages: [

            "English",
            "Hindi",
            "Kannada",
            "Telugu"

        ],

        biography:
            "Performance analysis coach using match data, video review and individual development planning.",

        achievements: [

            "Certified football performance analyst",
            "National youth league analytics lead"

        ],

        profileImage:
            "",

        joinedAt:
            "2026-03-07T10:45:00Z",

        lastActiveAt:
            "2026-07-21T06:50:00Z"

    },

    {

        id:
            "coach-012",

        firstName:
            "Tenzin",

        lastName:
            "Norbu",

        fullName:
            "Tenzin Norbu",

        email:
            "tenzin.norbu@example.com",

        mobileNumber:
            "+91 98765 41012",

        dateOfBirth:
            "1988-07-17",

        gender:
            "male",

        city:
            "Gangtok",

        state:
            "Sikkim",

        country:
            "India",

        academy:
            "Sikkim Football Development Academy",

        licence:
            "AFC B",

        specialisation:
            "Grassroots Development",

        experienceYears:
            10,

        verificationStatus:
            "verified",

        availability:
            "unavailable",

        profileCompletion:
            90,

        playersManaged:
            43,

        matchesManaged:
            80,

        winRate:
            65,

        languages: [

            "English",
            "Hindi",
            "Nepali"

        ],

        biography:
            "Grassroots football coach developing accessible training programmes for young players in mountain communities.",

        achievements: [

            "Sikkim grassroots development award"

        ],

        profileImage:
            "",

        joinedAt:
            "2026-04-10T09:10:00Z",

        lastActiveAt:
            "2026-07-16T11:35:00Z"

    }

];


/* ======================================================
   HTTP REQUEST HELPER
====================================================== */

async function adminCoachesRequest(

    endpoint,

    options = {}

){

    const controller =
        new AbortController();

    const timeoutId =
        window.setTimeout(

            () =>
                controller.abort(),

            ADMIN_COACHES_CONFIG
                .requestTimeout

        );

    const token =
        localStorage.getItem(
            "adminAccessToken"
        );

    const headers = {

        Accept:
            "application/json",

        ...options.headers

    };

    if(
        !(options.body instanceof FormData)
    ){

        headers["Content-Type"] =
            "application/json";

    }

    if(token){

        headers.Authorization =
            `Bearer ${token}`;

    }

    try{

        const response =
            await fetch(

                `${ADMIN_COACHES_CONFIG.apiBaseURL}${endpoint}`,

                {

                    ...options,

                    headers,

                    signal:
                        controller.signal,

                    credentials:
                        "include"

                }

            );

        const responseType =
            response.headers
                .get("content-type") || "";

        const responseData =
            responseType.includes(
                "application/json"
            )
                ? await response.json()
                : await response.text();

        if(!response.ok){

            const errorMessage =
                responseData?.message ||
                responseData?.detail ||
                `Request failed with status ${response.status}.`;

            throw new Error(
                errorMessage
            );

        }

        return responseData;

    }catch(error){

        if(
            error.name ===
            "AbortError"
        ){

            throw new Error(
                "The request timed out. Please try again."
            );

        }

        throw error;

    }finally{

        window.clearTimeout(
            timeoutId
        );

    }

}


/* ======================================================
   MOCK STORAGE
====================================================== */

let adminCoachesMockDatabase =
    structuredClone(
        ADMIN_COACHES_MOCK_DATA
    );


function adminCoachesMockDelay(){

    return new Promise(

        (resolve) => {

            window.setTimeout(

                resolve,

                ADMIN_COACHES_CONFIG
                    .mockDelay

            );

        }

    );

}


function adminCoachesGenerateId(){

    return `coach-${Date.now()}-${Math.random()
        .toString(36)
        .slice(2,8)}`;

}


/* ======================================================
   API SERVICE
====================================================== */

const adminCoachesAPI = {


    async getCoaches(){

        if(
            ADMIN_COACHES_CONFIG
                .useMockAPI
        ){

            await adminCoachesMockDelay();

            return structuredClone(
                adminCoachesMockDatabase
            );

        }

        const response =
            await adminCoachesRequest(

                ADMIN_COACHES_CONFIG
                    .endpoints
                    .coaches

            );

        return (
            response.data ||
            response.coaches ||
            response
        );

    },


    async createCoach(
        coachData
    ){

        if(
            ADMIN_COACHES_CONFIG
                .useMockAPI
        ){

            await adminCoachesMockDelay();

            const now =
                new Date()
                    .toISOString();

            const newCoach = {

                id:
                    adminCoachesGenerateId(),

                ...coachData,

                fullName:
                    `${coachData.firstName || ""} ${coachData.lastName || ""}`
                        .trim(),

                verificationStatus:
                    coachData.verificationStatus ||
                    "pending",

                availability:
                    coachData.availability ||
                    "available",

                profileCompletion:
                    coachData.profileCompletion ||
                    70,

                playersManaged:
                    coachData.playersManaged ||
                    0,

                matchesManaged:
                    coachData.matchesManaged ||
                    0,

                winRate:
                    coachData.winRate ||
                    0,

                joinedAt:
                    now,

                lastActiveAt:
                    now

            };

            adminCoachesMockDatabase.unshift(
                newCoach
            );

            return structuredClone(
                newCoach
            );

        }

        const response =
            await adminCoachesRequest(

                ADMIN_COACHES_CONFIG
                    .endpoints
                    .coaches,

                {

                    method:
                        "POST",

                    body:
                        coachData instanceof FormData
                            ? coachData
                            : JSON.stringify(
                                coachData
                            )

                }

            );

        return (
            response.data ||
            response.coach ||
            response
        );

    },


    async updateCoach(

        coachId,

        coachData

    ){

        if(
            ADMIN_COACHES_CONFIG
                .useMockAPI
        ){

            await adminCoachesMockDelay();

            const coachIndex =
                adminCoachesMockDatabase
                    .findIndex(

                        (coach) =>
                            coach.id ===
                            coachId

                    );

            if(coachIndex === -1){

                throw new Error(
                    "Coach not found."
                );

            }

            adminCoachesMockDatabase[
                coachIndex
            ] = {

                ...adminCoachesMockDatabase[
                    coachIndex
                ],

                ...coachData,

                fullName:
                    `${coachData.firstName || adminCoachesMockDatabase[coachIndex].firstName} ${coachData.lastName || adminCoachesMockDatabase[coachIndex].lastName}`
                        .trim()

            };

            return structuredClone(

                adminCoachesMockDatabase[
                    coachIndex
                ]

            );

        }

        const response =
            await adminCoachesRequest(

                `${ADMIN_COACHES_CONFIG.endpoints.coaches}/${coachId}`,

                {

                    method:
                        "PATCH",

                    body:
                        coachData instanceof FormData
                            ? coachData
                            : JSON.stringify(
                                coachData
                            )

                }

            );

        return (
            response.data ||
            response.coach ||
            response
        );

    },


    async deleteCoach(
        coachId
    ){

        if(
            ADMIN_COACHES_CONFIG
                .useMockAPI
        ){

            await adminCoachesMockDelay();

            const coachExists =
                adminCoachesMockDatabase
                    .some(

                        (coach) =>
                            coach.id ===
                            coachId

                    );

            if(!coachExists){

                throw new Error(
                    "Coach not found."
                );

            }

            adminCoachesMockDatabase =
                adminCoachesMockDatabase
                    .filter(

                        (coach) =>
                            coach.id !==
                            coachId

                    );

            return {

                success:
                    true,

                coachId

            };

        }

        return adminCoachesRequest(

            `${ADMIN_COACHES_CONFIG.endpoints.coaches}/${coachId}`,

            {

                method:
                    "DELETE"

            }

        );

    },


    async verifyCoach(

        coachId,

        verificationData = {}

    ){

        if(
            ADMIN_COACHES_CONFIG
                .useMockAPI
        ){

            await adminCoachesMockDelay();

            const coach =
                adminCoachesMockDatabase
                    .find(

                        (item) =>
                            item.id ===
                            coachId

                    );

            if(!coach){

                throw new Error(
                    "Coach not found."
                );

            }

            coach.verificationStatus =
                verificationData.status ||
                "verified";

            coach.verificationNotes =
                verificationData.notes ||
                "";

            coach.verifiedAt =
                new Date()
                    .toISOString();

            return structuredClone(
                coach
            );

        }

        const response =
            await adminCoachesRequest(

                ADMIN_COACHES_CONFIG
                    .endpoints
                    .verifyCoach(
                        coachId
                    ),

                {

                    method:
                        "PATCH",

                    body:
                        JSON.stringify(
                            verificationData
                        )

                }

            );

        return (
            response.data ||
            response.coach ||
            response
        );

    },


    async updateAvailability(

        coachId,

        availability

    ){

        if(
            ADMIN_COACHES_CONFIG
                .useMockAPI
        ){

            await adminCoachesMockDelay();

            const coach =
                adminCoachesMockDatabase
                    .find(

                        (item) =>
                            item.id ===
                            coachId

                    );

            if(!coach){

                throw new Error(
                    "Coach not found."
                );

            }

            coach.availability =
                availability;

            return structuredClone(
                coach
            );

        }

        const response =
            await adminCoachesRequest(

                ADMIN_COACHES_CONFIG
                    .endpoints
                    .availability(
                        coachId
                    ),

                {

                    method:
                        "PATCH",

                    body:
                        JSON.stringify({

                            availability

                        })

                }

            );

        return (
            response.data ||
            response.coach ||
            response
        );

    }

};

/* ======================================================
   ADMIN COACHES
   PART 1B
   UTILITIES • FORMATTERS • TOASTS • MODALS • FILTERING
====================================================== */


/* ======================================================
   GENERAL UTILITIES
====================================================== */

function adminCoachesEscapeHTML(
    value
){

    return String(
        value ?? ""
    )
        .replaceAll(
            "&",
            "&amp;"
        )
        .replaceAll(
            "<",
            "&lt;"
        )
        .replaceAll(
            ">",
            "&gt;"
        )
        .replaceAll(
            "\"",
            "&quot;"
        )
        .replaceAll(
            "'",
            "&#039;"
        );

}


function adminCoachesNormalize(
    value
){

    return String(
        value ?? ""
    )
        .trim()
        .toLowerCase();

}


function adminCoachesClone(
    value
){

    return structuredClone(
        value
    );

}


function adminCoachesGetInitials(
    fullName
){

    const initials =
        String(
            fullName || "Coach"
        )
            .trim()
            .split(/\s+/)
            .slice(0,2)
            .map(

                (part) =>
                    part.charAt(0)
                        .toUpperCase()

            )
            .join("");

    return initials || "C";

}


function adminCoachesGenerateFullName(
    coach
){

    const generatedName =
        `${coach?.firstName || ""} ${coach?.lastName || ""}`
            .trim();

    return (
        coach?.fullName ||
        generatedName ||
        "Unnamed Coach"
    );

}


function adminCoachesDebounce(

    callback,

    delay = 300

){

    let timeoutId;

    return function debouncedFunction(
        ...args
    ){

        window.clearTimeout(
            timeoutId
        );

        timeoutId =
            window.setTimeout(

                () =>
                    callback.apply(
                        this,
                        args
                    ),

                delay

            );

    };

}


/* ======================================================
   LABEL HELPERS
====================================================== */

function adminCoachesFormatLabel(
    value
){

    return String(
        value ?? ""
    )
        .replaceAll(
            "_",
            " "
        )
        .replaceAll(
            "-",
            " "
        )
        .replace(
            /\b\w/g,

            (character) =>
                character.toUpperCase()

        );

}


function adminCoachesVerificationLabel(
    status
){

    const labels = {

        verified:
            "Verified",

        pending:
            "Pending",

        rejected:
            "Rejected"

    };

    return (
        labels[status] ||
        adminCoachesFormatLabel(
            status
        ) ||
        "Unknown"
    );

}


function adminCoachesAvailabilityLabel(
    availability
){

    const labels = {

        available:
            "Available",

        engaged:
            "Engaged",

        unavailable:
            "Unavailable"

    };

    return (
        labels[availability] ||
        adminCoachesFormatLabel(
            availability
        ) ||
        "Unknown"
    );

}


function adminCoachesLicenceLabel(
    licence
){

    return (
        String(
            licence || ""
        ).trim() ||
        "Not provided"
    );

}


/* ======================================================
   DATE AND NUMBER FORMATTERS
====================================================== */

function adminCoachesFormatDate(

    value,

    options = {}

){

    if(!value){

        return "Not available";

    }

    const date =
        new Date(
            value
        );

    if(
        Number.isNaN(
            date.getTime()
        )
    ){

        return "Not available";

    }

    return new Intl.DateTimeFormat(

        "en-IN",

        {

            day:
                "2-digit",

            month:
                "short",

            year:
                "numeric",

            ...options

        }

    ).format(
        date
    );

}


function adminCoachesFormatDateTime(
    value
){

    return adminCoachesFormatDate(

        value,

        {

            hour:
                "2-digit",

            minute:
                "2-digit"

        }

    );

}


function adminCoachesFormatNumber(
    value
){

    const number =
        Number(
            value
        );

    if(
        !Number.isFinite(
            number
        )
    ){

        return "0";

    }

    return new Intl.NumberFormat(
        "en-IN"
    ).format(
        number
    );

}


function adminCoachesCalculateAge(
    dateOfBirth
){

    if(!dateOfBirth){

        return null;

    }

    const birthDate =
        new Date(
            dateOfBirth
        );

    if(
        Number.isNaN(
            birthDate.getTime()
        )
    ){

        return null;

    }

    const today =
        new Date();

    let age =
        today.getFullYear() -
        birthDate.getFullYear();

    const monthDifference =
        today.getMonth() -
        birthDate.getMonth();

    if(
        monthDifference < 0 ||
        (
            monthDifference === 0 &&
            today.getDate() <
            birthDate.getDate()
        )
    ){

        age -= 1;

    }

    return age;

}


/* ======================================================
   RELATIVE TIME
====================================================== */

function adminCoachesRelativeTime(
    value
){

    if(!value){

        return "Never active";

    }

    const date =
        new Date(
            value
        );

    if(
        Number.isNaN(
            date.getTime()
        )
    ){

        return "Unknown";

    }

    const difference =
        date.getTime() -
        Date.now();

    const absoluteDifference =
        Math.abs(
            difference
        );

    const formatter =
        new Intl.RelativeTimeFormat(

            "en",

            {

                numeric:
                    "auto"

            }

        );

    const units = [

        {

            unit:
                "year",

            milliseconds:
                365 * 24 * 60 * 60 * 1000

        },

        {

            unit:
                "month",

            milliseconds:
                30 * 24 * 60 * 60 * 1000

        },

        {

            unit:
                "week",

            milliseconds:
                7 * 24 * 60 * 60 * 1000

        },

        {

            unit:
                "day",

            milliseconds:
                24 * 60 * 60 * 1000

        },

        {

            unit:
                "hour",

            milliseconds:
                60 * 60 * 1000

        },

        {

            unit:
                "minute",

            milliseconds:
                60 * 1000

        }

    ];

    const matchedUnit =
        units.find(

            (item) =>
                absoluteDifference >=
                item.milliseconds

        );

    if(!matchedUnit){

        return "Just now";

    }

    const amount =
        Math.round(

            difference /
            matchedUnit.milliseconds

        );

    return formatter.format(

        amount,

        matchedUnit.unit

    );

}


/* ======================================================
   COLLECTION HELPERS
====================================================== */

function adminCoachesFindById(
    coachId
){

    return adminCoachesState.coaches
        .find(

            (coach) =>
                coach.id ===
                coachId

        ) || null;

}


function adminCoachesReplaceInState(
    updatedCoach
){

    const coachIndex =
        adminCoachesState.coaches
            .findIndex(

                (coach) =>
                    coach.id ===
                    updatedCoach.id

            );

    if(coachIndex === -1){

        adminCoachesState.coaches.unshift(
            adminCoachesClone(
                updatedCoach
            )
        );

        return;

    }

    adminCoachesState.coaches[
        coachIndex
    ] = adminCoachesClone(
        updatedCoach
    );

}


function adminCoachesRemoveFromState(
    coachId
){

    adminCoachesState.coaches =
        adminCoachesState.coaches
            .filter(

                (coach) =>
                    coach.id !==
                    coachId

            );

    adminCoachesState
        .selectedCoachIds
        .delete(
            coachId
        );

}


/* ======================================================
   PAGINATION HELPERS
====================================================== */

function adminCoachesGetPaginatedItems(){

    const {

        currentPage,

        pageSize

    } =
        adminCoachesState.pagination;

    const startIndex =
        (
            currentPage -
            1
        ) *
        pageSize;

    return adminCoachesState
        .filteredCoaches
        .slice(

            startIndex,

            startIndex +
            pageSize

        );

}


function adminCoachesUpdatePagination(){

    const totalItems =
        adminCoachesState
            .filteredCoaches
            .length;

    const totalPages =
        Math.max(

            1,

            Math.ceil(

                totalItems /
                adminCoachesState
                    .pagination
                    .pageSize

            )

        );

    adminCoachesState
        .pagination
        .totalPages =
            totalPages;

    if(
        adminCoachesState
            .pagination
            .currentPage >
        totalPages
    ){

        adminCoachesState
            .pagination
            .currentPage =
                totalPages;

    }

}


function adminCoachesSetPage(
    page
){

    const requestedPage =
        Number(
            page
        );

    if(
        !Number.isInteger(
            requestedPage
        )
    ){

        return;

    }

    adminCoachesState
        .pagination
        .currentPage =
            Math.min(

                Math.max(
                    requestedPage,
                    1
                ),

                adminCoachesState
                    .pagination
                    .totalPages

            );

}


/* ======================================================
   BUTTON LOADING STATE
====================================================== */

function adminCoachesSetButtonLoading(

    button,

    isLoading,

    loadingText =
        "Please wait..."

){

    if(!button){

        return;

    }

    if(isLoading){

        if(
            !button.dataset
                .originalContent
        ){

            button.dataset
                .originalContent =
                    button.innerHTML;

        }

        button.disabled =
            true;

        button.innerHTML = `
            <i
                class="fa-solid fa-spinner fa-spin"
                aria-hidden="true"
            ></i>

            <span>
                ${adminCoachesEscapeHTML(
                    loadingText
                )}
            </span>
        `;

        return;

    }

    button.disabled =
        false;

    if(
        button.dataset
            .originalContent
    ){

        button.innerHTML =
            button.dataset
                .originalContent;

        delete button.dataset
            .originalContent;

    }

}


/* ======================================================
   MAIN LOADING SCREEN
====================================================== */

function adminCoachesShowLoadingScreen(){

    if(
        adminCoachesDOM
            .loadingScreen
    ){

        adminCoachesDOM
            .loadingScreen
            .hidden =
                false;

    }

}


function adminCoachesHideLoadingScreen(){

    if(
        !adminCoachesDOM
            .loadingScreen
    ){

        return;

    }

    adminCoachesDOM
        .loadingScreen
        .classList
        .add(
            "is-hiding"
        );

    window.setTimeout(

        () => {

            adminCoachesDOM
                .loadingScreen
                .hidden =
                    true;

            adminCoachesDOM
                .loadingScreen
                .classList
                .remove(
                    "is-hiding"
                );

        },

        280

    );

}


/* ======================================================
   TOAST NOTIFICATIONS
====================================================== */

function adminCoachesShowToast({

    type =
        "info",

    title =
        "Notification",

    message =
        "",

    duration =
        4200

} = {}){

    const region =
        adminCoachesDOM
            .toastRegion;

    if(!region){

        return;

    }

    const icons = {

        success:
            "fa-circle-check",

        error:
            "fa-circle-xmark",

        warning:
            "fa-triangle-exclamation",

        info:
            "fa-circle-info"

    };

    const toast =
        document.createElement(
            "article"
        );

    toast.className =
        `admin-toast ${type}`;

    toast.setAttribute(
        "role",
        type === "error"
            ? "alert"
            : "status"
    );

    toast.innerHTML = `
        <i
            class="fa-solid ${
                icons[type] ||
                icons.info
            }"
            aria-hidden="true"
        ></i>

        <div>
            <strong>
                ${adminCoachesEscapeHTML(
                    title
                )}
            </strong>

            <p>
                ${adminCoachesEscapeHTML(
                    message
                )}
            </p>
        </div>

        <button
            type="button"
            class="admin-toast-close"
            aria-label="Dismiss notification"
        >
            <i
                class="fa-solid fa-xmark"
                aria-hidden="true"
            ></i>
        </button>
    `;

    const removeToast =
        () => {

            if(
                !toast.isConnected
            ){

                return;

            }

            toast.classList.add(
                "is-leaving"
            );

            window.setTimeout(

                () =>
                    toast.remove(),

                220

            );

        };

    toast
        .querySelector(
            ".admin-toast-close"
        )
        ?.addEventListener(
            "click",
            removeToast
        );

    region.appendChild(
        toast
    );

    window.setTimeout(

        removeToast,

        duration

    );

}


/* ======================================================
   MODAL HELPERS
====================================================== */

function adminCoachesOpenModal(
    modal
){

    if(!modal){

        return;

    }

    modal.hidden =
        false;

    document.body
        .classList
        .add(
            "admin-modal-open"
        );

    const focusTarget =
        modal.querySelector(

            "[autofocus]," +
            "input:not([disabled])," +
            "select:not([disabled])," +
            "textarea:not([disabled])," +
            "button:not([disabled])"

        );

    window.requestAnimationFrame(

        () =>
            focusTarget?.focus()

    );

}


function adminCoachesCloseModal(
    modal
){

    if(!modal){

        return;

    }

    modal.hidden =
        true;

    const anyOpenModal =
        Array.from(

            document.querySelectorAll(
                ".admin-modal"
            )

        )
            .some(

                (item) =>
                    !item.hidden

            );

    if(!anyOpenModal){

        document.body
            .classList
            .remove(
                "admin-modal-open"
            );

    }

}


function adminCoachesCloseAllModals(){

    document
        .querySelectorAll(
            ".admin-modal"
        )
        .forEach(

            (modal) => {

                modal.hidden =
                    true;

            }

        );

    document.body
        .classList
        .remove(
            "admin-modal-open"
        );

}


/* ======================================================
   FORM ERROR HELPERS
====================================================== */

function adminCoachesClearFormErrors(
    form
){

    if(!form){

        return;

    }

    form
        .querySelectorAll(
            ".admin-form-field"
        )
        .forEach(

            (field) => {

                field.classList
                    .remove(
                        "has-error",
                        "has-success"
                    );

                const errorElement =
                    field.querySelector(
                        "[data-field-error]"
                    );

                if(errorElement){

                    errorElement.textContent =
                        "";

                }

            }

        );

}


function adminCoachesSetFieldError(

    input,

    message

){

    if(!input){

        return;

    }

    const field =
        input.closest(
            ".admin-form-field"
        );

    if(!field){

        return;

    }

    field.classList
        .add(
            "has-error"
        );

    field.classList
        .remove(
            "has-success"
        );

    const errorElement =
        field.querySelector(
            "[data-field-error]"
        );

    if(errorElement){

        errorElement.textContent =
            message;

    }

}


function adminCoachesSetFieldSuccess(
    input
){

    if(!input){

        return;

    }

    const field =
        input.closest(
            ".admin-form-field"
        );

    if(!field){

        return;

    }

    field.classList
        .remove(
            "has-error"
        );

    field.classList
        .add(
            "has-success"
        );

}


/* ======================================================
   STATE FILTER OPTIONS
====================================================== */

function adminCoachesPopulateStateFilter(){

    const filter =
        adminCoachesDOM
            .stateFilter;

    if(!filter){

        return;

    }

    const existingValue =
        filter.value;

    const states =
        Array.from(

            new Set(

                adminCoachesState
                    .coaches
                    .map(

                        (coach) =>
                            coach.state

                    )
                    .filter(
                        Boolean
                    )

            )

        )
            .sort(

                (firstState, secondState) =>
                    firstState.localeCompare(
                        secondState
                    )

            );

    filter.innerHTML = `
        <option value="all">
            All States
        </option>

        ${
            states
                .map(

                    (state) => `
                        <option
                            value="${adminCoachesEscapeHTML(
                                state
                            )}"
                        >
                            ${adminCoachesEscapeHTML(
                                state
                            )}
                        </option>
                    `

                )
                .join("")
        }
    `;

    filter.value =
        states.includes(
            existingValue
        )
            ? existingValue
            : "all";

}


/* ======================================================
   FILTERING
====================================================== */

function adminCoachesApplyFilters(){

    const filters =
        adminCoachesState
            .filters;

    const searchTerm =
        adminCoachesNormalize(
            filters.search
        );

    let filteredCoaches =
        adminCoachesState
            .coaches
            .filter(

                (coach) => {

                    const searchableContent =
                        adminCoachesNormalize([

                            adminCoachesGenerateFullName(
                                coach
                            ),

                            coach.email,

                            coach.mobileNumber,

                            coach.city,

                            coach.state,

                            coach.academy,

                            coach.licence,

                            coach.specialisation

                        ].join(" "));

                    const matchesSearch =
                        !searchTerm ||
                        searchableContent.includes(
                            searchTerm
                        );

                    const matchesVerification =
                        filters.verification ===
                            "all" ||
                        coach.verificationStatus ===
                            filters.verification;

                    const matchesLicence =
                        filters.licence ===
                            "all" ||
                        coach.licence ===
                            filters.licence;

                    const matchesSpecialisation =
                        filters.specialisation ===
                            "all" ||
                        coach.specialisation ===
                            filters.specialisation;

                    const matchesState =
                        filters.state ===
                            "all" ||
                        coach.state ===
                            filters.state;

                    const matchesAvailability =
                        filters.availability ===
                            "all" ||
                        coach.availability ===
                            filters.availability;

                    return (

                        matchesSearch &&
                        matchesVerification &&
                        matchesLicence &&
                        matchesSpecialisation &&
                        matchesState &&
                        matchesAvailability

                    );

                }

            );

    filteredCoaches =
        adminCoachesSortItems(

            filteredCoaches,

            filters.sort

        );

    adminCoachesState
        .filteredCoaches =
            filteredCoaches;

    adminCoachesUpdatePagination();

}


/* ======================================================
   SORTING
====================================================== */

function adminCoachesSortItems(

    coaches,

    sortValue

){

    const sortedCoaches =
        [...coaches];

    const dateValue =
        (value) => {

            const parsed =
                new Date(
                    value
                ).getTime();

            return Number.isFinite(
                parsed
            )
                ? parsed
                : 0;

        };

    const nameValue =
        (coach) =>
            adminCoachesGenerateFullName(
                coach
            );

    const sorters = {

        newest:
            (firstCoach, secondCoach) =>
                dateValue(
                    secondCoach.joinedAt
                ) -
                dateValue(
                    firstCoach.joinedAt
                ),

        oldest:
            (firstCoach, secondCoach) =>
                dateValue(
                    firstCoach.joinedAt
                ) -
                dateValue(
                    secondCoach.joinedAt
                ),

        name_asc:
            (firstCoach, secondCoach) =>
                nameValue(
                    firstCoach
                ).localeCompare(
                    nameValue(
                        secondCoach
                    )
                ),

        name_desc:
            (firstCoach, secondCoach) =>
                nameValue(
                    secondCoach
                ).localeCompare(
                    nameValue(
                        firstCoach
                    )
                ),

        experience_high:
            (firstCoach, secondCoach) =>
                Number(
                    secondCoach.experienceYears ||
                    0
                ) -
                Number(
                    firstCoach.experienceYears ||
                    0
                ),

        experience_low:
            (firstCoach, secondCoach) =>
                Number(
                    firstCoach.experienceYears ||
                    0
                ) -
                Number(
                    secondCoach.experienceYears ||
                    0
                ),

        completion_high:
            (firstCoach, secondCoach) =>
                Number(
                    secondCoach.profileCompletion ||
                    0
                ) -
                Number(
                    firstCoach.profileCompletion ||
                    0
                ),

        recently_active:
            (firstCoach, secondCoach) =>
                dateValue(
                    secondCoach.lastActiveAt
                ) -
                dateValue(
                    firstCoach.lastActiveAt
                )

    };

    const sorter =
        sorters[sortValue] ||
        sorters.newest;

    sortedCoaches.sort(
        sorter
    );

    return sortedCoaches;

}


/* ======================================================
   FILTER STATE SYNC
====================================================== */

function adminCoachesReadFilters(){

    adminCoachesState
        .filters
        .search =
            adminCoachesDOM
                .coachSearchInput
                ?.value
                .trim() ||
            "";

    adminCoachesState
        .filters
        .verification =
            adminCoachesDOM
                .verificationFilter
                ?.value ||
            "all";

    adminCoachesState
        .filters
        .licence =
            adminCoachesDOM
                .licenceFilter
                ?.value ||
            "all";

    adminCoachesState
        .filters
        .specialisation =
            adminCoachesDOM
                .specialisationFilter
                ?.value ||
            "all";

    adminCoachesState
        .filters
        .state =
            adminCoachesDOM
                .stateFilter
                ?.value ||
            "all";

    adminCoachesState
        .filters
        .availability =
            adminCoachesDOM
                .availabilityFilter
                ?.value ||
            "all";

    adminCoachesState
        .filters
        .sort =
            adminCoachesDOM
                .sortFilter
                ?.value ||
            "newest";

    adminCoachesState
        .pagination
        .currentPage =
            1;

}


/* ======================================================
   RESET FILTERS
====================================================== */

function adminCoachesResetFilters(){

    adminCoachesState.filters = {

        search:
            "",

        verification:
            "all",

        licence:
            "all",

        specialisation:
            "all",

        state:
            "all",

        availability:
            "all",

        sort:
            "newest"

    };

    if(
        adminCoachesDOM
            .coachSearchInput
    ){

        adminCoachesDOM
            .coachSearchInput
            .value =
                "";

    }

    if(
        adminCoachesDOM
            .verificationFilter
    ){

        adminCoachesDOM
            .verificationFilter
            .value =
                "all";

    }

    if(
        adminCoachesDOM
            .licenceFilter
    ){

        adminCoachesDOM
            .licenceFilter
            .value =
                "all";

    }

    if(
        adminCoachesDOM
            .specialisationFilter
    ){

        adminCoachesDOM
            .specialisationFilter
            .value =
                "all";

    }

    if(
        adminCoachesDOM
            .stateFilter
    ){

        adminCoachesDOM
            .stateFilter
            .value =
                "all";

    }

    if(
        adminCoachesDOM
            .availabilityFilter
    ){

        adminCoachesDOM
            .availabilityFilter
            .value =
                "all";

    }

    if(
        adminCoachesDOM
            .sortFilter
    ){

        adminCoachesDOM
            .sortFilter
            .value =
                "newest";

    }

    adminCoachesState
        .pagination
        .currentPage =
            1;

    adminCoachesApplyFilters();

}

/* ======================================================
   ADMIN COACHES
   PART 1C
   METRICS • TABLE • BADGES • PAGINATION • MAIN RENDER
====================================================== */


/* ======================================================
   METRICS
====================================================== */

function adminCoachesRenderMetrics(){

    const coaches =
        adminCoachesState.coaches;

    const total =
        coaches.length;

    const verified =
        coaches.filter(

            (coach) =>
                coach.verificationStatus ===
                "verified"

        ).length;

    const pending =
        coaches.filter(

            (coach) =>
                coach.verificationStatus ===
                "pending"

        ).length;

    const active =
        coaches.filter(

            (coach) =>
                coach.availability !==
                    "unavailable"

        ).length;

    if(
        adminCoachesDOM
            .totalCoachesMetric
    ){

        adminCoachesDOM
            .totalCoachesMetric
            .textContent =
                adminCoachesFormatNumber(
                    total
                );

    }

    if(
        adminCoachesDOM
            .verifiedCoachesMetric
    ){

        adminCoachesDOM
            .verifiedCoachesMetric
            .textContent =
                adminCoachesFormatNumber(
                    verified
                );

    }

    if(
        adminCoachesDOM
            .pendingCoachesMetric
    ){

        adminCoachesDOM
            .pendingCoachesMetric
            .textContent =
                adminCoachesFormatNumber(
                    pending
                );

    }

    if(
        adminCoachesDOM
            .activeCoachesMetric
    ){

        adminCoachesDOM
            .activeCoachesMetric
            .textContent =
                adminCoachesFormatNumber(
                    active
                );

    }

}


/* ======================================================
   STATUS BADGES
====================================================== */

function adminCoachesRenderVerificationBadge(
    status
){

    const normalizedStatus =
        adminCoachesNormalize(
            status
        ) || "pending";

    return `
        <span
            class="admin-status-badge ${adminCoachesEscapeHTML(
                normalizedStatus
            )}"
        >
            <i
                class="fa-solid ${
                    normalizedStatus ===
                        "verified"
                        ? "fa-circle-check"
                        : normalizedStatus ===
                            "rejected"
                            ? "fa-circle-xmark"
                            : "fa-clock"
                }"
                aria-hidden="true"
            ></i>

            ${adminCoachesEscapeHTML(
                adminCoachesVerificationLabel(
                    normalizedStatus
                )
            )}
        </span>
    `;

}


function adminCoachesRenderAvailabilityBadge(
    availability
){

    const normalizedAvailability =
        adminCoachesNormalize(
            availability
        ) || "unavailable";

    return `
        <span
            class="admin-availability-badge ${adminCoachesEscapeHTML(
                normalizedAvailability
            )}"
        >
            <i
                class="fa-solid ${
                    normalizedAvailability ===
                        "available"
                        ? "fa-circle-check"
                        : normalizedAvailability ===
                            "engaged"
                            ? "fa-briefcase"
                            : "fa-circle-minus"
                }"
                aria-hidden="true"
            ></i>

            ${adminCoachesEscapeHTML(
                adminCoachesAvailabilityLabel(
                    normalizedAvailability
                )
            )}
        </span>
    `;

}


/* ======================================================
   PROGRESS BAR
====================================================== */

function adminCoachesRenderProgress(
    value
){

    const progress =
        Math.min(

            Math.max(

                Number(
                    value
                ) || 0,

                0

            ),

            100

        );

    return `
        <div
            class="admin-progress"
            role="progressbar"
            aria-valuemin="0"
            aria-valuemax="100"
            aria-valuenow="${progress}"
            aria-label="Profile completion ${progress}%"
        >
            <span
                style="width:${progress}%"
            ></span>
        </div>

        <span class="admin-table-muted">
            ${progress}% complete
        </span>
    `;

}


/* ======================================================
   COACH AVATAR
====================================================== */

function adminCoachesRenderAvatar(
    coach
){

    const fullName =
        adminCoachesGenerateFullName(
            coach
        );

    if(coach.profileImage){

        return `
            <div
                class="admin-coach-avatar"
                aria-hidden="true"
            >
                <img
                    src="${adminCoachesEscapeHTML(
                        coach.profileImage
                    )}"
                    alt=""
                    loading="lazy"
                />
            </div>
        `;

    }

    return `
        <div
            class="admin-coach-avatar"
            aria-hidden="true"
        >
            ${adminCoachesEscapeHTML(
                adminCoachesGetInitials(
                    fullName
                )
            )}
        </div>
    `;

}


/* ======================================================
   TABLE ROW
====================================================== */

function adminCoachesRenderTableRow(
    coach
){

    const fullName =
        adminCoachesGenerateFullName(
            coach
        );

    const isSelected =
        adminCoachesState
            .selectedCoachIds
            .has(
                coach.id
            );

    const age =
        adminCoachesCalculateAge(
            coach.dateOfBirth
        );

    return `
        <tr
            data-coach-row="${adminCoachesEscapeHTML(
                coach.id
            )}"
        >
            <td>
                <input
                    type="checkbox"
                    class="admin-coach-checkbox"
                    data-coach-id="${adminCoachesEscapeHTML(
                        coach.id
                    )}"
                    aria-label="Select ${adminCoachesEscapeHTML(
                        fullName
                    )}"
                    ${isSelected
                        ? "checked"
                        : ""}
                />
            </td>

            <td>
                <div class="admin-coach-cell">

                    ${adminCoachesRenderAvatar(
                        coach
                    )}

                    <div class="admin-coach-details">

                        <strong>
                            ${adminCoachesEscapeHTML(
                                fullName
                            )}
                        </strong>

                        <span>
                            ${adminCoachesEscapeHTML(
                                coach.email ||
                                "No email"
                            )}
                        </span>

                    </div>

                </div>
            </td>

            <td>
                <span class="admin-table-value">
                    ${adminCoachesEscapeHTML(
                        coach.licence ||
                        "Not listed"
                    )}
                </span>
            </td>

            <td>
                <span class="admin-table-value">
                    ${adminCoachesEscapeHTML(
                        coach.specialisation ||
                        "Not listed"
                    )}
                </span>
            </td>

            <td>
                <span class="admin-table-value">
                    ${adminCoachesEscapeHTML(
                        coach.academy ||
                        "Independent"
                    )}
                </span>
            </td>

            <td>
                <span class="admin-table-value">
                    ${adminCoachesEscapeHTML(
                        coach.city ||
                        ""
                    )}${
                        coach.city &&
                        coach.state
                            ? ", "
                            : ""
                    }${adminCoachesEscapeHTML(
                        coach.state ||
                        "Not provided"
                    )}
                </span>
            </td>

            <td>
                ${adminCoachesRenderVerificationBadge(
                    coach.verificationStatus
                )}
            </td>

            <td>
                ${adminCoachesRenderAvailabilityBadge(
                    coach.availability
                )}
            </td>

            <td>
                <span class="admin-table-value">
                    ${adminCoachesFormatNumber(
                        coach.experienceYears
                    )} years
                </span>

                ${
                    age !== null
                        ? `
                            <span class="admin-table-muted">
                                Age ${age}
                            </span>
                        `
                        : ""
                }
            </td>

            <td>
                ${adminCoachesRenderProgress(
                    coach.profileCompletion
                )}
            </td>

            <td>
                <span class="admin-table-value">
                    ${adminCoachesRelativeTime(
                        coach.lastActiveAt
                    )}
                </span>

                <span class="admin-table-muted">
                    ${adminCoachesEscapeHTML(
                        adminCoachesFormatDateTime(
                            coach.lastActiveAt
                        )
                    )}
                </span>
            </td>

            <td>
                <div class="admin-table-actions">

                    <button
                        type="button"
                        class="admin-action-button"
                        data-coach-action="view"
                        data-coach-id="${adminCoachesEscapeHTML(
                            coach.id
                        )}"
                        aria-label="View ${adminCoachesEscapeHTML(
                            fullName
                        )}"
                        title="View coach"
                    >
                        <i
                            class="fa-solid fa-eye"
                            aria-hidden="true"
                        ></i>
                    </button>

                    <button
                        type="button"
                        class="admin-action-button"
                        data-coach-action="edit"
                        data-coach-id="${adminCoachesEscapeHTML(
                            coach.id
                        )}"
                        aria-label="Edit ${adminCoachesEscapeHTML(
                            fullName
                        )}"
                        title="Edit coach"
                    >
                        <i
                            class="fa-solid fa-pen"
                            aria-hidden="true"
                        ></i>
                    </button>

                    ${
                        coach.verificationStatus !==
                            "verified"
                            ? `
                                <button
                                    type="button"
                                    class="admin-action-button verify"
                                    data-coach-action="verify"
                                    data-coach-id="${adminCoachesEscapeHTML(
                                        coach.id
                                    )}"
                                    aria-label="Verify ${adminCoachesEscapeHTML(
                                        fullName
                                    )}"
                                    title="Verify coach"
                                >
                                    <i
                                        class="fa-solid fa-user-check"
                                        aria-hidden="true"
                                    ></i>
                                </button>
                            `
                            : ""
                    }

                    <button
                        type="button"
                        class="admin-action-button delete"
                        data-coach-action="delete"
                        data-coach-id="${adminCoachesEscapeHTML(
                            coach.id
                        )}"
                        aria-label="Delete ${adminCoachesEscapeHTML(
                            fullName
                        )}"
                        title="Delete coach"
                    >
                        <i
                            class="fa-solid fa-trash"
                            aria-hidden="true"
                        ></i>
                    </button>

                </div>
            </td>
        </tr>
    `;

}


/* ======================================================
   TABLE RENDER
====================================================== */

function adminCoachesRenderTable(){

    const tableBody =
        adminCoachesDOM
            .coachesTableBody;

    if(!tableBody){

        return;

    }

    const paginatedCoaches =
        adminCoachesGetPaginatedItems();

    if(
        paginatedCoaches.length ===
        0
    ){

        tableBody.innerHTML =
            "";

        if(
            adminCoachesDOM
                .coachesTable
        ){

            adminCoachesDOM
                .coachesTable
                .hidden =
                    true;

        }

        if(
            adminCoachesDOM
                .coachesEmptyState
        ){

            adminCoachesDOM
                .coachesEmptyState
                .hidden =
                    false;

        }

        return;

    }

    if(
        adminCoachesDOM
            .coachesTable
    ){

        adminCoachesDOM
            .coachesTable
            .hidden =
                false;

    }

    if(
        adminCoachesDOM
            .coachesEmptyState
    ){

        adminCoachesDOM
            .coachesEmptyState
            .hidden =
                true;

    }

    tableBody.innerHTML =
        paginatedCoaches
            .map(
                adminCoachesRenderTableRow
            )
            .join("");

}


/* ======================================================
   RESULT COUNT
====================================================== */

function adminCoachesRenderResultCount(){

    const count =
        adminCoachesState
            .filteredCoaches
            .length;

    if(
        adminCoachesDOM
            .coachesResultCount
    ){

        adminCoachesDOM
            .coachesResultCount
            .textContent =
                `${adminCoachesFormatNumber(
                    count
                )} ${
                    count === 1
                        ? "coach"
                        : "coaches"
                } found`;

    }

}


/* ======================================================
   PAGE BUTTONS
====================================================== */

function adminCoachesCreatePageButton(

    page,

    isActive = false

){

    return `
        <button
            type="button"
            class="admin-page-button ${
                isActive
                    ? "active"
                    : ""
            }"
            data-page="${page}"
            aria-label="Go to page ${page}"
            ${
                isActive
                    ? 'aria-current="page"'
                    : ""
            }
        >
            ${page}
        </button>
    `;

}


function adminCoachesGetVisiblePages(){

    const currentPage =
        adminCoachesState
            .pagination
            .currentPage;

    const totalPages =
        adminCoachesState
            .pagination
            .totalPages;

    if(totalPages <= 7){

        return Array.from(

            {

                length:
                    totalPages

            },

            (_, index) =>
                index + 1

        );

    }

    const pages = [

        1

    ];

    if(currentPage > 4){

        pages.push(
            "ellipsis-start"
        );

    }

    const startPage =
        Math.max(

            2,

            currentPage -
            1

        );

    const endPage =
        Math.min(

            totalPages - 1,

            currentPage + 1

        );

    for(
        let page = startPage;
        page <= endPage;
        page += 1
    ){

        pages.push(
            page
        );

    }

    if(
        currentPage <
        totalPages - 3
    ){

        pages.push(
            "ellipsis-end"
        );

    }

    pages.push(
        totalPages
    );

    return pages;

}


/* ======================================================
   PAGINATION RENDER
====================================================== */

function adminCoachesRenderPagination(){

    const pagination =
        adminCoachesState.pagination;

    const totalItems =
        adminCoachesState
            .filteredCoaches
            .length;

    const startItem =
        totalItems === 0
            ? 0
            : (
                pagination.currentPage -
                1
            ) *
                pagination.pageSize +
                1;

    const endItem =
        Math.min(

            pagination.currentPage *
                pagination.pageSize,

            totalItems

        );

    if(
        adminCoachesDOM
            .paginationSummary
    ){

        adminCoachesDOM
            .paginationSummary
            .textContent =
                `Showing ${adminCoachesFormatNumber(
                    startItem
                )}–${adminCoachesFormatNumber(
                    endItem
                )} of ${adminCoachesFormatNumber(
                    totalItems
                )}`;

    }

    if(
        adminCoachesDOM
            .previousPageButton
    ){

        adminCoachesDOM
            .previousPageButton
            .disabled =
                pagination.currentPage <= 1;

    }

    if(
        adminCoachesDOM
            .nextPageButton
    ){

        adminCoachesDOM
            .nextPageButton
            .disabled =
                pagination.currentPage >=
                pagination.totalPages;

    }

    if(
        adminCoachesDOM
            .paginationPages
    ){

        adminCoachesDOM
            .paginationPages
            .innerHTML =
                adminCoachesGetVisiblePages()
                    .map(

                        (page) => {

                            if(
                                typeof page !==
                                "number"
                            ){

                                return `
                                    <span
                                        class="admin-pagination-ellipsis"
                                        aria-hidden="true"
                                    >
                                        …
                                    </span>
                                `;

                            }

                            return adminCoachesCreatePageButton(

                                page,

                                page ===
                                    pagination.currentPage

                            );

                        }

                    )
                    .join("");

    }

    if(
        adminCoachesDOM
            .paginationContainer
    ){

        adminCoachesDOM
            .paginationContainer
            .hidden =
                totalItems === 0;

    }

}


/* ======================================================
   SELECTION
====================================================== */

function adminCoachesGetVisibleCoachIds(){

    return adminCoachesGetPaginatedItems()
        .map(

            (coach) =>
                coach.id

        );

}


function adminCoachesUpdateSelectAllState(){

    const selectAll =
        adminCoachesDOM
            .selectAllCoaches;

    if(!selectAll){

        return;

    }

    const visibleIds =
        adminCoachesGetVisibleCoachIds();

    const selectedVisibleCount =
        visibleIds.filter(

            (coachId) =>
                adminCoachesState
                    .selectedCoachIds
                    .has(
                        coachId
                    )

        ).length;

    selectAll.checked =
        visibleIds.length > 0 &&
        selectedVisibleCount ===
            visibleIds.length;

    selectAll.indeterminate =
        selectedVisibleCount > 0 &&
        selectedVisibleCount <
            visibleIds.length;

}


function adminCoachesRenderBulkActions(){

    const selectedCount =
        adminCoachesState
            .selectedCoachIds
            .size;

    if(
        adminCoachesDOM
            .selectedCoachCount
    ){

        adminCoachesDOM
            .selectedCoachCount
            .textContent =
                adminCoachesFormatNumber(
                    selectedCount
                );

    }

    if(
        adminCoachesDOM
            .bulkActions
    ){

        adminCoachesDOM
            .bulkActions
            .hidden =
                selectedCount === 0;

    }

    adminCoachesUpdateSelectAllState();

}


/* ======================================================
   MAIN RENDER
====================================================== */

function adminCoachesRender(){

    adminCoachesApplyFilters();

    adminCoachesRenderMetrics();

    adminCoachesRenderResultCount();

    adminCoachesRenderTable();

    adminCoachesRenderPagination();

    adminCoachesRenderBulkActions();

}

/* ======================================================
   ADMIN COACHES
   PART 1D
   DETAILS MODAL • FORM HELPERS • VALIDATION • FORM DATA
====================================================== */


/* ======================================================
   DETAILS MODAL
====================================================== */

function adminCoachesRenderDetailItem(

    label,

    value,

    icon =
        "fa-circle-info"

){

    return `
        <div class="admin-detail-item">

            <div class="admin-detail-item-icon">

                <i
                    class="fa-solid ${adminCoachesEscapeHTML(
                        icon
                    )}"
                    aria-hidden="true"
                ></i>

            </div>

            <div>

                <span>
                    ${adminCoachesEscapeHTML(
                        label
                    )}
                </span>

                <strong>
                    ${adminCoachesEscapeHTML(
                        value ||
                        "Not provided"
                    )}
                </strong>

            </div>

        </div>
    `;

}


function adminCoachesRenderCoachDetails(
    coach
){

    if(!coach){

        return `
            <div class="admin-empty-state">

                <div class="admin-empty-state-icon">

                    <i
                        class="fa-solid fa-user-slash"
                        aria-hidden="true"
                    ></i>

                </div>

                <h3>
                    Coach not found
                </h3>

                <p>
                    This coach record is unavailable or may have been removed.
                </p>

            </div>
        `;

    }

    const fullName =
        adminCoachesGenerateFullName(
            coach
        );

    const age =
        adminCoachesCalculateAge(
            coach.dateOfBirth
        );

    const languages =
        Array.isArray(
            coach.languages
        ) &&
        coach.languages.length
            ? coach.languages.join(", ")
            : "Not provided";

    const achievements =
        Array.isArray(
            coach.achievements
        ) &&
        coach.achievements.length
            ? coach.achievements
            : [];

    return `
        <section class="admin-coach-detail-profile">

            <div class="admin-coach-detail-hero">

                ${adminCoachesRenderAvatar(
                    coach
                )}

                <div>

                    <div class="admin-coach-detail-heading">

                        <h3>
                            ${adminCoachesEscapeHTML(
                                fullName
                            )}
                        </h3>

                        ${adminCoachesRenderVerificationBadge(
                            coach.verificationStatus
                        )}

                    </div>

                    <p>
                        ${adminCoachesEscapeHTML(
                            coach.specialisation ||
                            "Football Coach"
                        )}
                    </p>

                    <div class="admin-coach-detail-meta">

                        <span>
                            <i
                                class="fa-solid fa-location-dot"
                                aria-hidden="true"
                            ></i>

                            ${adminCoachesEscapeHTML(
                                [
                                    coach.city,
                                    coach.state
                                ]
                                    .filter(
                                        Boolean
                                    )
                                    .join(", ") ||
                                "Location not provided"
                            )}
                        </span>

                        <span>
                            <i
                                class="fa-solid fa-building"
                                aria-hidden="true"
                            ></i>

                            ${adminCoachesEscapeHTML(
                                coach.academy ||
                                "Independent Coach"
                            )}
                        </span>

                    </div>

                </div>

            </div>


            <div class="admin-coach-detail-stats">

                <article>

                    <strong>
                        ${adminCoachesFormatNumber(
                            coach.experienceYears
                        )}
                    </strong>

                    <span>
                        Years Experience
                    </span>

                </article>

                <article>

                    <strong>
                        ${adminCoachesFormatNumber(
                            coach.playersManaged
                        )}
                    </strong>

                    <span>
                        Players Managed
                    </span>

                </article>

                <article>

                    <strong>
                        ${adminCoachesFormatNumber(
                            coach.matchesManaged
                        )}
                    </strong>

                    <span>
                        Matches Managed
                    </span>

                </article>

                <article>

                    <strong>
                        ${adminCoachesFormatNumber(
                            coach.winRate
                        )}%
                    </strong>

                    <span>
                        Win Rate
                    </span>

                </article>

            </div>


            <div class="admin-coach-detail-grid">

                ${adminCoachesRenderDetailItem(
                    "Email",
                    coach.email,
                    "fa-envelope"
                )}

                ${adminCoachesRenderDetailItem(
                    "Mobile",
                    coach.mobileNumber,
                    "fa-phone"
                )}

                ${adminCoachesRenderDetailItem(
                    "Date of Birth",
                    coach.dateOfBirth
                        ? `${adminCoachesFormatDate(
                            coach.dateOfBirth
                        )}${age !== null
                            ? ` • Age ${age}`
                            : ""}`
                        : "Not provided",
                    "fa-calendar"
                )}

                ${adminCoachesRenderDetailItem(
                    "Gender",
                    adminCoachesFormatLabel(
                        coach.gender
                    ),
                    "fa-user"
                )}

                ${adminCoachesRenderDetailItem(
                    "Licence",
                    adminCoachesLicenceLabel(
                        coach.licence
                    ),
                    "fa-certificate"
                )}

                ${adminCoachesRenderDetailItem(
                    "Availability",
                    adminCoachesAvailabilityLabel(
                        coach.availability
                    ),
                    "fa-briefcase"
                )}

                ${adminCoachesRenderDetailItem(
                    "Languages",
                    languages,
                    "fa-language"
                )}

                ${adminCoachesRenderDetailItem(
                    "Profile Completion",
                    `${Number(
                        coach.profileCompletion
                    ) || 0}%`,
                    "fa-chart-line"
                )}

                ${adminCoachesRenderDetailItem(
                    "Joined",
                    adminCoachesFormatDateTime(
                        coach.joinedAt
                    ),
                    "fa-user-plus"
                )}

                ${adminCoachesRenderDetailItem(
                    "Last Active",
                    adminCoachesFormatDateTime(
                        coach.lastActiveAt
                    ),
                    "fa-clock"
                )}

            </div>


            <div class="admin-coach-detail-section">

                <h4>
                    Biography
                </h4>

                <p>
                    ${adminCoachesEscapeHTML(
                        coach.biography ||
                        "No biography has been added."
                    )}
                </p>

            </div>


            <div class="admin-coach-detail-section">

                <h4>
                    Achievements
                </h4>

                ${
                    achievements.length
                        ? `
                            <ul class="admin-achievement-list">

                                ${
                                    achievements
                                        .map(

                                            (achievement) => `
                                                <li>

                                                    <i
                                                        class="fa-solid fa-trophy"
                                                        aria-hidden="true"
                                                    ></i>

                                                    <span>
                                                        ${adminCoachesEscapeHTML(
                                                            achievement
                                                        )}
                                                    </span>

                                                </li>
                                            `

                                        )
                                        .join("")
                                }

                            </ul>
                        `
                        : `
                            <p>
                                No achievements have been added.
                            </p>
                        `
                }

            </div>

        </section>
    `;

}


/* ======================================================
   OPEN VIEW MODAL
====================================================== */

function adminCoachesOpenViewModal(
    coachId
){

    const coach =
        adminCoachesFindById(
            coachId
        );

    if(!coach){

        adminCoachesShowToast({

            type:
                "error",

            title:
                "Coach unavailable",

            message:
                "The selected coach record could not be found."

        });

        return;

    }

    adminCoachesState.activeCoach =
        adminCoachesClone(
            coach
        );

    if(
        adminCoachesDOM
            .viewCoachContent
    ){

        adminCoachesDOM
            .viewCoachContent
            .innerHTML =
                adminCoachesRenderCoachDetails(
                    coach
                );

    }

    adminCoachesOpenModal(
        adminCoachesDOM
            .viewCoachModal
    );

}


/* ======================================================
   FORM VALUE HELPERS
====================================================== */

function adminCoachesSetFormValue(

    form,

    fieldName,

    value

){

    if(!form){

        return;

    }

    const field =
        form.elements[
            fieldName
        ];

    if(!field){

        return;

    }

    if(
        field instanceof RadioNodeList
    ){

        field.value =
            value ?? "";

        return;

    }

    if(
        field.type ===
        "checkbox"
    ){

        field.checked =
            Boolean(
                value
            );

        return;

    }

    field.value =
        value ?? "";

}


function adminCoachesPopulateForm(

    form,

    coach

){

    if(
        !form ||
        !coach
    ){

        return;

    }

    const values = {

        firstName:
            coach.firstName,

        lastName:
            coach.lastName,

        email:
            coach.email,

        mobileNumber:
            coach.mobileNumber,

        dateOfBirth:
            coach.dateOfBirth,

        gender:
            coach.gender,

        city:
            coach.city,

        state:
            coach.state,

        country:
            coach.country ||
            "India",

        academy:
            coach.academy,

        licence:
            coach.licence,

        specialisation:
            coach.specialisation,

        experienceYears:
            coach.experienceYears,

        verificationStatus:
            coach.verificationStatus,

        availability:
            coach.availability,

        biography:
            coach.biography,

        languages:
            Array.isArray(
                coach.languages
            )
                ? coach.languages.join(", ")
                : coach.languages,

        achievements:
            Array.isArray(
                coach.achievements
            )
                ? coach.achievements.join("\n")
                : coach.achievements

    };

    Object.entries(
        values
    )
        .forEach(

            ([
                fieldName,
                value
            ]) => {

                adminCoachesSetFormValue(

                    form,

                    fieldName,

                    value

                );

            }

        );

}


/* ======================================================
   RESET FORM
====================================================== */

function adminCoachesResetForm(
    form
){

    if(!form){

        return;

    }

    form.reset();

    adminCoachesClearFormErrors(
        form
    );

    const countryField =
        form.elements.country;

    if(countryField){

        countryField.value =
            "India";

    }

    const verificationField =
        form.elements
            .verificationStatus;

    if(verificationField){

        verificationField.value =
            "pending";

    }

    const availabilityField =
        form.elements
            .availability;

    if(availabilityField){

        availabilityField.value =
            "available";

    }

}


/* ======================================================
   FORM DATA NORMALIZATION
====================================================== */

function adminCoachesSplitCommaValues(
    value
){

    return String(
        value || ""
    )
        .split(",")
        .map(

            (item) =>
                item.trim()

        )
        .filter(
            Boolean
        );

}


function adminCoachesSplitLineValues(
    value
){

    return String(
        value || ""
    )
        .split(/\r?\n/)
        .map(

            (item) =>
                item.trim()

        )
        .filter(
            Boolean
        );

}


function adminCoachesFormToObject(
    form
){

    const formData =
        new FormData(
            form
        );

    const rawData =
        Object.fromEntries(
            formData.entries()
        );

    return {

        firstName:
            String(
                rawData.firstName ||
                ""
            ).trim(),

        lastName:
            String(
                rawData.lastName ||
                ""
            ).trim(),

        email:
            String(
                rawData.email ||
                ""
            )
                .trim()
                .toLowerCase(),

        mobileNumber:
            String(
                rawData.mobileNumber ||
                ""
            ).trim(),

        dateOfBirth:
            String(
                rawData.dateOfBirth ||
                ""
            ).trim(),

        gender:
            String(
                rawData.gender ||
                ""
            ).trim(),

        city:
            String(
                rawData.city ||
                ""
            ).trim(),

        state:
            String(
                rawData.state ||
                ""
            ).trim(),

        country:
            String(
                rawData.country ||
                "India"
            ).trim(),

        academy:
            String(
                rawData.academy ||
                ""
            ).trim(),

        licence:
            String(
                rawData.licence ||
                ""
            ).trim(),

        specialisation:
            String(
                rawData.specialisation ||
                ""
            ).trim(),

        experienceYears:
            Math.max(

                0,

                Number(
                    rawData.experienceYears
                ) || 0

            ),

        verificationStatus:
            String(
                rawData.verificationStatus ||
                "pending"
            ).trim(),

        availability:
            String(
                rawData.availability ||
                "available"
            ).trim(),

        biography:
            String(
                rawData.biography ||
                ""
            ).trim(),

        languages:
            adminCoachesSplitCommaValues(
                rawData.languages
            ),

        achievements:
            adminCoachesSplitLineValues(
                rawData.achievements
            )

    };

}


/* ======================================================
   FIELD VALIDATORS
====================================================== */

function adminCoachesIsValidEmail(
    value
){

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        .test(
            String(
                value || ""
            ).trim()
        );

}


function adminCoachesIsValidPhone(
    value
){

    const normalizedPhone =
        String(
            value || ""
        )
            .replace(
                /[\s()-]/g,
                ""
            );

    return /^\+?[0-9]{10,15}$/
        .test(
            normalizedPhone
        );

}


function adminCoachesIsValidDateOfBirth(
    value
){

    if(!value){

        return false;

    }

    const date =
        new Date(
            value
        );

    if(
        Number.isNaN(
            date.getTime()
        )
    ){

        return false;

    }

    const today =
        new Date();

    return (
        date <
        today
    );

}


function adminCoachesEmailExists(

    email,

    ignoredCoachId =
        null

){

    const normalizedEmail =
        adminCoachesNormalize(
            email
        );

    return adminCoachesState
        .coaches
        .some(

            (coach) =>
                coach.id !==
                    ignoredCoachId &&
                adminCoachesNormalize(
                    coach.email
                ) ===
                    normalizedEmail

        );

}


/* ======================================================
   FORM VALIDATION
====================================================== */

function adminCoachesValidateForm(

    form,

    ignoredCoachId =
        null

){

    if(!form){

        return false;

    }

    adminCoachesClearFormErrors(
        form
    );

    let isValid =
        true;

    const requiredFields = [

        {

            name:
                "firstName",

            message:
                "Enter the coach’s first name."

        },

        {

            name:
                "lastName",

            message:
                "Enter the coach’s last name."

        },

        {

            name:
                "email",

            message:
                "Enter the coach’s email address."

        },

        {

            name:
                "mobileNumber",

            message:
                "Enter the coach’s mobile number."

        },

        {

            name:
                "dateOfBirth",

            message:
                "Select the coach’s date of birth."

        },

        {

            name:
                "gender",

            message:
                "Select the coach’s gender."

        },

        {

            name:
                "city",

            message:
                "Enter the coach’s city."

        },

        {

            name:
                "state",

            message:
                "Enter the coach’s state."

        },

        {

            name:
                "licence",

            message:
                "Select the coach’s licence."

        },

        {

            name:
                "specialisation",

            message:
                "Select a coaching specialisation."

        }

    ];

    requiredFields.forEach(

        ({
            name,
            message
        }) => {

            const input =
                form.elements[
                    name
                ];

            const value =
                String(
                    input?.value ||
                    ""
                ).trim();

            if(!value){

                adminCoachesSetFieldError(

                    input,

                    message

                );

                isValid =
                    false;

            }else{

                adminCoachesSetFieldSuccess(
                    input
                );

            }

        }

    );

    const emailInput =
        form.elements.email;

    const email =
        String(
            emailInput?.value ||
            ""
        )
            .trim()
            .toLowerCase();

    if(
        email &&
        !adminCoachesIsValidEmail(
            email
        )
    ){

        adminCoachesSetFieldError(

            emailInput,

            "Enter a valid email address."

        );

        isValid =
            false;

    }else if(
        email &&
        adminCoachesEmailExists(

            email,

            ignoredCoachId

        )
    ){

        adminCoachesSetFieldError(

            emailInput,

            "A coach with this email already exists."

        );

        isValid =
            false;

    }

    const mobileInput =
        form.elements
            .mobileNumber;

    const mobileNumber =
        mobileInput?.value;

    if(
        mobileNumber &&
        !adminCoachesIsValidPhone(
            mobileNumber
        )
    ){

        adminCoachesSetFieldError(

            mobileInput,

            "Enter a valid 10 to 15 digit mobile number."

        );

        isValid =
            false;

    }

    const dateOfBirthInput =
        form.elements
            .dateOfBirth;

    if(
        dateOfBirthInput?.value &&
        !adminCoachesIsValidDateOfBirth(
            dateOfBirthInput.value
        )
    ){

        adminCoachesSetFieldError(

            dateOfBirthInput,

            "Select a valid date in the past."

        );

        isValid =
            false;

    }

    const experienceInput =
        form.elements
            .experienceYears;

    const experience =
        Number(
            experienceInput?.value
        );

    if(
        experienceInput?.value &&
        (
            !Number.isFinite(
                experience
            ) ||
            experience < 0 ||
            experience > 60
        )
    ){

        adminCoachesSetFieldError(

            experienceInput,

            "Experience must be between 0 and 60 years."

        );

        isValid =
            false;

    }

    const biographyInput =
        form.elements
            .biography;

    if(
        biographyInput?.value &&
        biographyInput.value
            .trim()
            .length >
        1200
    ){

        adminCoachesSetFieldError(

            biographyInput,

            "Biography cannot exceed 1,200 characters."

        );

        isValid =
            false;

    }

    if(!isValid){

        const firstInvalidInput =
            form.querySelector(
                ".has-error input, .has-error select, .has-error textarea"
            );

        firstInvalidInput?.focus();

    }

    return isValid;

}


/* ======================================================
   OPEN ADD MODAL
====================================================== */

function adminCoachesOpenAddModal(){

    adminCoachesState.activeCoach =
        null;

    adminCoachesResetForm(
        adminCoachesDOM
            .addCoachForm
    );

    adminCoachesOpenModal(
        adminCoachesDOM
            .addCoachModal
    );

}


/* ======================================================
   OPEN EDIT MODAL
====================================================== */

function adminCoachesOpenEditModal(
    coachId
){

    const coach =
        adminCoachesFindById(
            coachId
        );

    if(!coach){

        adminCoachesShowToast({

            type:
                "error",

            title:
                "Coach unavailable",

            message:
                "The selected coach record could not be found."

        });

        return;

    }

    adminCoachesState.activeCoach =
        adminCoachesClone(
            coach
        );

    adminCoachesResetForm(
        adminCoachesDOM
            .editCoachForm
    );

    adminCoachesPopulateForm(

        adminCoachesDOM
            .editCoachForm,

        coach

    );

    adminCoachesOpenModal(
        adminCoachesDOM
            .editCoachModal
    );

}


/* ======================================================
   CREATE COACH
====================================================== */

async function adminCoachesHandleCreate(
    event
){

    event.preventDefault();

    const form =
        adminCoachesDOM
            .addCoachForm;

    if(
        adminCoachesState
            .isSubmitting ||
        !adminCoachesValidateForm(
            form
        )
    ){

        return;

    }

    adminCoachesState
        .isSubmitting =
            true;

    adminCoachesSetButtonLoading(

        adminCoachesDOM
            .submitAddCoachButton,

        true,

        "Adding coach..."

    );

    try{

        const coachData =
            adminCoachesFormToObject(
                form
            );

        const createdCoach =
            await adminCoachesAPI
                .createCoach(
                    coachData
                );

        adminCoachesState
            .coaches
            .unshift(
                adminCoachesClone(
                    createdCoach
                )
            );

        adminCoachesPopulateStateFilter();

        adminCoachesState
            .pagination
            .currentPage =
                1;

        adminCoachesRender();

        adminCoachesCloseModal(
            adminCoachesDOM
                .addCoachModal
        );

        adminCoachesResetForm(
            form
        );

        adminCoachesShowToast({

            type:
                "success",

            title:
                "Coach added",

            message:
                `${adminCoachesGenerateFullName(
                    createdCoach
                )} has been added successfully.`

        });

    }catch(error){

        adminCoachesShowToast({

            type:
                "error",

            title:
                "Unable to add coach",

            message:
                error.message ||
                "Please try again."

        });

    }finally{

        adminCoachesState
            .isSubmitting =
                false;

        adminCoachesSetButtonLoading(

            adminCoachesDOM
                .submitAddCoachButton,

            false

        );

    }

}


/* ======================================================
   UPDATE COACH
====================================================== */

async function adminCoachesHandleUpdate(
    event
){

    event.preventDefault();

    const form =
        adminCoachesDOM
            .editCoachForm;

    const activeCoach =
        adminCoachesState
            .activeCoach;

    if(
        !activeCoach ||
        adminCoachesState
            .isSubmitting ||
        !adminCoachesValidateForm(

            form,

            activeCoach.id

        )
    ){

        return;

    }

    adminCoachesState
        .isSubmitting =
            true;

    adminCoachesSetButtonLoading(

        adminCoachesDOM
            .submitEditCoachButton,

        true,

        "Saving changes..."

    );

    try{

        const coachData =
            adminCoachesFormToObject(
                form
            );

        const updatedCoach =
            await adminCoachesAPI
                .updateCoach(

                    activeCoach.id,

                    coachData

                );

        adminCoachesReplaceInState(
            updatedCoach
        );

        adminCoachesState.activeCoach =
            adminCoachesClone(
                updatedCoach
            );

        adminCoachesPopulateStateFilter();

        adminCoachesRender();

        adminCoachesCloseModal(
            adminCoachesDOM
                .editCoachModal
        );

        adminCoachesShowToast({

            type:
                "success",

            title:
                "Coach updated",

            message:
                `${adminCoachesGenerateFullName(
                    updatedCoach
                )} has been updated successfully.`

        });

    }catch(error){

        adminCoachesShowToast({

            type:
                "error",

            title:
                "Unable to update coach",

            message:
                error.message ||
                "Please try again."

        });

    }finally{

        adminCoachesState
            .isSubmitting =
                false;

        adminCoachesSetButtonLoading(

            adminCoachesDOM
                .submitEditCoachButton,

            false

        );

    }

}

/* ======================================================
   ADMIN COACHES
   PART 1E
   VERIFY • DELETE • AVAILABILITY • BULK ACTIONS
====================================================== */


/* ======================================================
   OPEN VERIFY MODAL
====================================================== */

function adminCoachesOpenVerifyModal(
    coachId
){

    const coach =
        adminCoachesFindById(
            coachId
        );

    if(!coach){

        adminCoachesShowToast({

            type:
                "error",

            title:
                "Coach unavailable",

            message:
                "The selected coach record could not be found."

        });

        return;

    }

    adminCoachesState.activeCoach =
        adminCoachesClone(
            coach
        );

    const form =
        adminCoachesDOM
            .verifyCoachForm;

    if(form){

        form.reset();

        adminCoachesClearFormErrors(
            form
        );

        if(
            form.elements
                .verificationStatus
        ){

            form.elements
                .verificationStatus
                .value =
                    coach.verificationStatus ===
                        "verified"
                        ? "verified"
                        : "verified";

        }

        if(
            form.elements
                .verificationNotes
        ){

            form.elements
                .verificationNotes
                .value =
                    coach.verificationNotes ||
                    "";

        }

    }

    const coachNameElement =
        adminCoachesDOM
            .verifyCoachModal
            ?.querySelector(
                "[data-verify-coach-name]"
            );

    if(coachNameElement){

        coachNameElement.textContent =
            adminCoachesGenerateFullName(
                coach
            );

    }

    adminCoachesOpenModal(
        adminCoachesDOM
            .verifyCoachModal
    );

}


/* ======================================================
   VERIFY FORM DATA
====================================================== */

function adminCoachesGetVerificationData(){

    const form =
        adminCoachesDOM
            .verifyCoachForm;

    if(!form){

        return {

            status:
                "verified",

            notes:
                ""

        };

    }

    const formData =
        new FormData(
            form
        );

    return {

        status:
            String(
                formData.get(
                    "verificationStatus"
                ) ||
                "verified"
            ).trim(),

        notes:
            String(
                formData.get(
                    "verificationNotes"
                ) ||
                ""
            ).trim()

    };

}


/* ======================================================
   CONFIRM VERIFY
====================================================== */

async function adminCoachesHandleVerify(
    event
){

    event?.preventDefault();

    const activeCoach =
        adminCoachesState
            .activeCoach;

    if(
        !activeCoach ||
        adminCoachesState
            .isSubmitting
    ){

        return;

    }

    const verificationData =
        adminCoachesGetVerificationData();

    const allowedStatuses = [

        "verified",
        "pending",
        "rejected"

    ];

    if(
        !allowedStatuses.includes(
            verificationData.status
        )
    ){

        adminCoachesShowToast({

            type:
                "error",

            title:
                "Invalid status",

            message:
                "Select a valid verification status."

        });

        return;

    }

    adminCoachesState
        .isSubmitting =
            true;

    adminCoachesSetButtonLoading(

        adminCoachesDOM
            .confirmVerifyCoachButton,

        true,

        "Updating status..."

    );

    try{

        const updatedCoach =
            await adminCoachesAPI
                .verifyCoach(

                    activeCoach.id,

                    verificationData

                );

        adminCoachesReplaceInState(
            updatedCoach
        );

        adminCoachesState.activeCoach =
            adminCoachesClone(
                updatedCoach
            );

        adminCoachesRender();

        adminCoachesCloseModal(
            adminCoachesDOM
                .verifyCoachModal
        );

        adminCoachesShowToast({

            type:
                verificationData.status ===
                    "rejected"
                    ? "warning"
                    : "success",

            title:
                verificationData.status ===
                    "verified"
                    ? "Coach verified"
                    : verificationData.status ===
                        "rejected"
                        ? "Verification rejected"
                        : "Verification updated",

            message:
                `${adminCoachesGenerateFullName(
                    updatedCoach
                )} is now marked as ${adminCoachesVerificationLabel(
                    verificationData.status
                ).toLowerCase()}.`

        });

    }catch(error){

        adminCoachesShowToast({

            type:
                "error",

            title:
                "Unable to update verification",

            message:
                error.message ||
                "Please try again."

        });

    }finally{

        adminCoachesState
            .isSubmitting =
                false;

        adminCoachesSetButtonLoading(

            adminCoachesDOM
                .confirmVerifyCoachButton,

            false

        );

    }

}


/* ======================================================
   UPDATE SINGLE AVAILABILITY
====================================================== */

async function adminCoachesHandleAvailabilityUpdate(

    coachId,

    availability

){

    const coach =
        adminCoachesFindById(
            coachId
        );

    const allowedAvailability = [

        "available",
        "engaged",
        "unavailable"

    ];

    if(
        !coach ||
        !allowedAvailability.includes(
            availability
        )
    ){

        return;

    }

    try{

        const updatedCoach =
            await adminCoachesAPI
                .updateAvailability(

                    coachId,

                    availability

                );

        adminCoachesReplaceInState(
            updatedCoach
        );

        adminCoachesRender();

        adminCoachesShowToast({

            type:
                "success",

            title:
                "Availability updated",

            message:
                `${adminCoachesGenerateFullName(
                    updatedCoach
                )} is now ${adminCoachesAvailabilityLabel(
                    availability
                ).toLowerCase()}.`

        });

    }catch(error){

        adminCoachesShowToast({

            type:
                "error",

            title:
                "Unable to update availability",

            message:
                error.message ||
                "Please try again."

        });

    }

}


/* ======================================================
   OPEN DELETE MODAL
====================================================== */

function adminCoachesOpenDeleteModal(
    coachId
){

    const coach =
        adminCoachesFindById(
            coachId
        );

    if(!coach){

        adminCoachesShowToast({

            type:
                "error",

            title:
                "Coach unavailable",

            message:
                "The selected coach record could not be found."

        });

        return;

    }

    adminCoachesState.activeCoach =
        adminCoachesClone(
            coach
        );

    adminCoachesState.pendingAction = {

        type:
            "delete-single",

        coachIds: [

            coach.id

        ]

    };

    if(
        adminCoachesDOM
            .deleteCoachName
    ){

        adminCoachesDOM
            .deleteCoachName
            .textContent =
                adminCoachesGenerateFullName(
                    coach
                );

    }

    if(
        adminCoachesDOM
            .deleteCoachConfirmationInput
    ){

        adminCoachesDOM
            .deleteCoachConfirmationInput
            .value =
                "";

    }

    if(
        adminCoachesDOM
            .confirmDeleteCoachButton
    ){

        adminCoachesDOM
            .confirmDeleteCoachButton
            .disabled =
                true;

    }

    adminCoachesOpenModal(
        adminCoachesDOM
            .deleteCoachModal
    );

}


/* ======================================================
   OPEN BULK DELETE MODAL
====================================================== */

function adminCoachesOpenBulkDeleteModal(){

    const coachIds =
        Array.from(
            adminCoachesState
                .selectedCoachIds
        );

    if(
        coachIds.length ===
        0
    ){

        return;

    }

    adminCoachesState.activeCoach =
        null;

    adminCoachesState.pendingAction = {

        type:
            "delete-bulk",

        coachIds

    };

    if(
        adminCoachesDOM
            .deleteCoachName
    ){

        adminCoachesDOM
            .deleteCoachName
            .textContent =
                `${adminCoachesFormatNumber(
                    coachIds.length
                )} selected coaches`;

    }

    if(
        adminCoachesDOM
            .deleteCoachConfirmationInput
    ){

        adminCoachesDOM
            .deleteCoachConfirmationInput
            .value =
                "";

    }

    if(
        adminCoachesDOM
            .confirmDeleteCoachButton
    ){

        adminCoachesDOM
            .confirmDeleteCoachButton
            .disabled =
                true;

    }

    adminCoachesOpenModal(
        adminCoachesDOM
            .deleteCoachModal
    );

}


/* ======================================================
   DELETE CONFIRMATION INPUT
====================================================== */

function adminCoachesHandleDeleteConfirmationInput(){

    const input =
        adminCoachesDOM
            .deleteCoachConfirmationInput;

    const button =
        adminCoachesDOM
            .confirmDeleteCoachButton;

    if(
        !input ||
        !button
    ){

        return;

    }

    button.disabled =
        adminCoachesNormalize(
            input.value
        ) !==
        "delete";

}


/* ======================================================
   CONFIRM DELETE
====================================================== */

async function adminCoachesHandleDelete(){

    const pendingAction =
        adminCoachesState
            .pendingAction;

    if(
        !pendingAction ||
        adminCoachesState
            .isSubmitting
    ){

        return;

    }

    const confirmationValue =
        adminCoachesNormalize(

            adminCoachesDOM
                .deleteCoachConfirmationInput
                ?.value

        );

    if(
        confirmationValue !==
        "delete"
    ){

        adminCoachesShowToast({

            type:
                "warning",

            title:
                "Confirmation required",

            message:
                "Type DELETE to confirm this action."

        });

        return;

    }

    const coachIds =
        pendingAction.coachIds || [];

    if(
        coachIds.length ===
        0
    ){

        return;

    }

    adminCoachesState
        .isSubmitting =
            true;

    adminCoachesSetButtonLoading(

        adminCoachesDOM
            .confirmDeleteCoachButton,

        true,

        coachIds.length > 1
            ? "Deleting coaches..."
            : "Deleting coach..."

    );

    try{

        const results =
            await Promise.allSettled(

                coachIds.map(

                    (coachId) =>
                        adminCoachesAPI
                            .deleteCoach(
                                coachId
                            )

                )

            );

        const deletedCoachIds = [];

        const failedDeletes = [];

        results.forEach(

            (
                result,
                index
            ) => {

                if(
                    result.status ===
                    "fulfilled"
                ){

                    deletedCoachIds.push(
                        coachIds[
                            index
                        ]
                    );

                }else{

                    failedDeletes.push(
                        coachIds[
                            index
                        ]
                    );

                }

            }

        );

        deletedCoachIds.forEach(

            (coachId) =>
                adminCoachesRemoveFromState(
                    coachId
                )

        );

        adminCoachesState.activeCoach =
            null;

        adminCoachesState.pendingAction =
            null;

        adminCoachesPopulateStateFilter();

        adminCoachesRender();

        adminCoachesCloseModal(
            adminCoachesDOM
                .deleteCoachModal
        );

        if(
            deletedCoachIds.length >
            0
        ){

            adminCoachesShowToast({

                type:
                    "success",

                title:
                    deletedCoachIds.length ===
                        1
                        ? "Coach deleted"
                        : "Coaches deleted",

                message:
                    deletedCoachIds.length ===
                        1
                        ? "The coach record has been removed successfully."
                        : `${adminCoachesFormatNumber(
                            deletedCoachIds.length
                        )} coach records were removed successfully.`

            });

        }

        if(
            failedDeletes.length >
            0
        ){

            adminCoachesShowToast({

                type:
                    "warning",

                title:
                    "Some records were not deleted",

                message:
                    `${adminCoachesFormatNumber(
                        failedDeletes.length
                    )} coach records could not be removed.`

            });

        }

    }catch(error){

        adminCoachesShowToast({

            type:
                "error",

            title:
                "Unable to delete coach",

            message:
                error.message ||
                "Please try again."

        });

    }finally{

        adminCoachesState
            .isSubmitting =
                false;

        adminCoachesSetButtonLoading(

            adminCoachesDOM
                .confirmDeleteCoachButton,

            false

        );

        adminCoachesHandleDeleteConfirmationInput();

    }

}


/* ======================================================
   SELECT SINGLE COACH
====================================================== */

function adminCoachesHandleRowSelection(
    checkbox
){

    const coachId =
        checkbox.dataset
            .coachId;

    if(!coachId){

        return;

    }

    if(checkbox.checked){

        adminCoachesState
            .selectedCoachIds
            .add(
                coachId
            );

    }else{

        adminCoachesState
            .selectedCoachIds
            .delete(
                coachId
            );

    }

    adminCoachesRenderBulkActions();

}


/* ======================================================
   SELECT ALL VISIBLE COACHES
====================================================== */

function adminCoachesHandleSelectAll(
    event
){

    const shouldSelect =
        event.target.checked;

    const visibleCoachIds =
        adminCoachesGetVisibleCoachIds();

    visibleCoachIds.forEach(

        (coachId) => {

            if(shouldSelect){

                adminCoachesState
                    .selectedCoachIds
                    .add(
                        coachId
                    );

            }else{

                adminCoachesState
                    .selectedCoachIds
                    .delete(
                        coachId
                    );

            }

        }

    );

    adminCoachesRenderTable();

    adminCoachesRenderBulkActions();

}


/* ======================================================
   BULK VERIFY
====================================================== */

async function adminCoachesHandleBulkVerify(){

    const coachIds =
        Array.from(
            adminCoachesState
                .selectedCoachIds
        );

    if(
        coachIds.length ===
        0 ||
        adminCoachesState
            .isSubmitting
    ){

        return;

    }

    adminCoachesState
        .isSubmitting =
            true;

    adminCoachesSetButtonLoading(

        adminCoachesDOM
            .bulkVerifyButton,

        true,

        "Verifying..."

    );

    try{

        const results =
            await Promise.allSettled(

                coachIds.map(

                    (coachId) =>
                        adminCoachesAPI
                            .verifyCoach(

                                coachId,

                                {

                                    status:
                                        "verified",

                                    notes:
                                        "Verified through bulk admin action."

                                }

                            )

                )

            );

        let updatedCount =
            0;

        results.forEach(

            (result) => {

                if(
                    result.status ===
                    "fulfilled"
                ){

                    adminCoachesReplaceInState(
                        result.value
                    );

                    updatedCount +=
                        1;

                }

            }

        );

        adminCoachesState
            .selectedCoachIds
            .clear();

        adminCoachesRender();

        adminCoachesShowToast({

            type:
                updatedCount ===
                    coachIds.length
                    ? "success"
                    : "warning",

            title:
                "Bulk verification complete",

            message:
                `${adminCoachesFormatNumber(
                    updatedCount
                )} of ${adminCoachesFormatNumber(
                    coachIds.length
                )} coaches were verified.`

        });

    }catch(error){

        adminCoachesShowToast({

            type:
                "error",

            title:
                "Bulk verification failed",

            message:
                error.message ||
                "Please try again."

        });

    }finally{

        adminCoachesState
            .isSubmitting =
                false;

        adminCoachesSetButtonLoading(

            adminCoachesDOM
                .bulkVerifyButton,

            false

        );

    }

}


/* ======================================================
   BULK AVAILABILITY
====================================================== */

async function adminCoachesHandleBulkAvailability(
    availability
){

    const coachIds =
        Array.from(
            adminCoachesState
                .selectedCoachIds
        );

    if(
        coachIds.length ===
        0 ||
        adminCoachesState
            .isSubmitting
    ){

        return;

    }

    const button =
        availability ===
            "available"
            ? adminCoachesDOM
                .bulkAvailableButton
            : adminCoachesDOM
                .bulkUnavailableButton;

    adminCoachesState
        .isSubmitting =
            true;

    adminCoachesSetButtonLoading(

        button,

        true,

        "Updating..."

    );

    try{

        const results =
            await Promise.allSettled(

                coachIds.map(

                    (coachId) =>
                        adminCoachesAPI
                            .updateAvailability(

                                coachId,

                                availability

                            )

                )

            );

        let updatedCount =
            0;

        results.forEach(

            (result) => {

                if(
                    result.status ===
                    "fulfilled"
                ){

                    adminCoachesReplaceInState(
                        result.value
                    );

                    updatedCount +=
                        1;

                }

            }

        );

        adminCoachesState
            .selectedCoachIds
            .clear();

        adminCoachesRender();

        adminCoachesShowToast({

            type:
                updatedCount ===
                    coachIds.length
                    ? "success"
                    : "warning",

            title:
                "Availability updated",

            message:
                `${adminCoachesFormatNumber(
                    updatedCount
                )} of ${adminCoachesFormatNumber(
                    coachIds.length
                )} coaches were marked ${adminCoachesAvailabilityLabel(
                    availability
                ).toLowerCase()}.`

        });

    }catch(error){

        adminCoachesShowToast({

            type:
                "error",

            title:
                "Bulk update failed",

            message:
                error.message ||
                "Please try again."

        });

    }finally{

        adminCoachesState
            .isSubmitting =
                false;

        adminCoachesSetButtonLoading(

            button,

            false

        );

    }

}


/* ======================================================
   EDIT FROM VIEW MODAL
====================================================== */

function adminCoachesHandleEditFromView(){

    const activeCoach =
        adminCoachesState
            .activeCoach;

    if(!activeCoach){

        return;

    }

    adminCoachesCloseModal(
        adminCoachesDOM
            .viewCoachModal
    );

    adminCoachesOpenEditModal(
        activeCoach.id
    );

}


/* ======================================================
   TABLE ACTION HANDLER
====================================================== */

function adminCoachesHandleTableAction(
    event
){

    const actionButton =
        event.target.closest(
            "[data-coach-action]"
        );

    if(!actionButton){

        return;

    }

    const action =
        actionButton.dataset
            .coachAction;

    const coachId =
        actionButton.dataset
            .coachId;

    if(
        !action ||
        !coachId
    ){

        return;

    }

    const actions = {

        view:
            () =>
                adminCoachesOpenViewModal(
                    coachId
                ),

        edit:
            () =>
                adminCoachesOpenEditModal(
                    coachId
                ),

        verify:
            () =>
                adminCoachesOpenVerifyModal(
                    coachId
                ),

        delete:
            () =>
                adminCoachesOpenDeleteModal(
                    coachId
                ),

        available:
            () =>
                adminCoachesHandleAvailabilityUpdate(

                    coachId,

                    "available"

                ),

        engaged:
            () =>
                adminCoachesHandleAvailabilityUpdate(

                    coachId,

                    "engaged"

                ),

        unavailable:
            () =>
                adminCoachesHandleAvailabilityUpdate(

                    coachId,

                    "unavailable"

                )

    };

    actions[action]?.();

}

/* ======================================================
   ADMIN COACHES
   PART 1F
   EXPORT • PANELS • INTERACTIONS • EVENTS • INITIALIZATION
====================================================== */


/* ======================================================
   CSV VALUE ESCAPING
====================================================== */

function adminCoachesEscapeCSVValue(
    value
){

    const normalizedValue =
        Array.isArray(
            value
        )
            ? value.join(", ")
            : String(
                value ?? ""
            );

    return `"${normalizedValue.replaceAll(
        "\"",
        "\"\""
    )}"`;

}


/* ======================================================
   EXPORT DATA PREPARATION
====================================================== */

function adminCoachesGetExportRecords(
    scope =
        "filtered"
){

    if(
        scope ===
        "selected"
    ){

        return adminCoachesState
            .coaches
            .filter(

                (coach) =>
                    adminCoachesState
                        .selectedCoachIds
                        .has(
                            coach.id
                        )

            );

    }

    if(
        scope ===
        "all"
    ){

        return [
            ...adminCoachesState.coaches
        ];

    }

    return [
        ...adminCoachesState.filteredCoaches
    ];

}


/* ======================================================
   BUILD CSV
====================================================== */

function adminCoachesBuildCSV(
    coaches
){

    const headers = [

        "Coach ID",
        "First Name",
        "Last Name",
        "Full Name",
        "Email",
        "Mobile Number",
        "Date of Birth",
        "Gender",
        "City",
        "State",
        "Country",
        "Academy",
        "Licence",
        "Specialisation",
        "Experience Years",
        "Verification Status",
        "Availability",
        "Languages",
        "Achievements",
        "Profile Completion",
        "Players Managed",
        "Matches Managed",
        "Win Rate",
        "Joined Date",
        "Last Active",
        "Biography"

    ];

    const rows =
        coaches.map(

            (coach) => [

                coach.id,

                coach.firstName,

                coach.lastName,

                adminCoachesGenerateFullName(
                    coach
                ),

                coach.email,

                coach.mobileNumber,

                coach.dateOfBirth,

                coach.gender,

                coach.city,

                coach.state,

                coach.country,

                coach.academy,

                coach.licence,

                coach.specialisation,

                coach.experienceYears,

                coach.verificationStatus,

                coach.availability,

                coach.languages,

                coach.achievements,

                coach.profileCompletion,

                coach.playersManaged,

                coach.matchesManaged,

                coach.winRate,

                coach.joinedAt,

                coach.lastActiveAt,

                coach.biography

            ]
                .map(
                    adminCoachesEscapeCSVValue
                )
                .join(",")

        );

    return [

        headers
            .map(
                adminCoachesEscapeCSVValue
            )
            .join(","),

        ...rows

    ].join("\n");

}


/* ======================================================
   DOWNLOAD FILE
====================================================== */

function adminCoachesDownloadFile({

    content,

    fileName,

    mimeType =
        "text/plain;charset=utf-8"

}){

    const blob =
        new Blob(

            [
                "\uFEFF",
                content
            ],

            {

                type:
                    mimeType

            }

        );

    const objectURL =
        URL.createObjectURL(
            blob
        );

    const downloadLink =
        document.createElement(
            "a"
        );

    downloadLink.href =
        objectURL;

    downloadLink.download =
        fileName;

    downloadLink.hidden =
        true;

    document.body.appendChild(
        downloadLink
    );

    downloadLink.click();

    downloadLink.remove();

    window.setTimeout(

        () =>
            URL.revokeObjectURL(
                objectURL
            ),

        1000

    );

}


/* ======================================================
   EXPORT COACHES
====================================================== */

function adminCoachesHandleExport(
    scope =
        "filtered"
){

    const coaches =
        adminCoachesGetExportRecords(
            scope
        );

    if(
        coaches.length ===
        0
    ){

        adminCoachesShowToast({

            type:
                "warning",

            title:
                "Nothing to export",

            message:
                "No coach records are available for the selected export scope."

        });

        return;

    }

    const csvContent =
        adminCoachesBuildCSV(
            coaches
        );

    const dateStamp =
        new Date()
            .toISOString()
            .slice(
                0,
                10
            );

    const fileName =
        `bharat-football-fans-coaches-${scope}-${dateStamp}.csv`;

    adminCoachesDownloadFile({

        content:
            csvContent,

        fileName,

        mimeType:
            "text/csv;charset=utf-8"

    });

    adminCoachesCloseModal(
        adminCoachesDOM
            .exportCoachModal
    );

    adminCoachesShowToast({

        type:
            "success",

        title:
            "Export complete",

        message:
            `${adminCoachesFormatNumber(
                coaches.length
            )} coach records were exported successfully.`

    });

}


/* ======================================================
   OPEN EXPORT MODAL
====================================================== */

function adminCoachesOpenExportModal(){

    const selectedCount =
        adminCoachesState
            .selectedCoachIds
            .size;

    const selectedOption =
        adminCoachesDOM
            .exportCoachModal
            ?.querySelector(
                '[value="selected"]'
            );

    if(selectedOption){

        selectedOption.disabled =
            selectedCount === 0;

    }

    const exportForm =
        adminCoachesDOM
            .exportCoachForm;

    if(exportForm){

        exportForm.reset();

        const filteredOption =
            exportForm.elements
                .exportScope;

        if(filteredOption){

            filteredOption.value =
                "filtered";

        }

    }

    adminCoachesOpenModal(
        adminCoachesDOM
            .exportCoachModal
    );

}


/* ======================================================
   EXPORT FORM SUBMISSION
====================================================== */

function adminCoachesHandleExportSubmit(
    event
){

    event.preventDefault();

    const formData =
        new FormData(
            event.currentTarget
        );

    const scope =
        String(
            formData.get(
                "exportScope"
            ) ||
            "filtered"
        );

    adminCoachesHandleExport(
        scope
    );

}


/* ======================================================
   SIDEBAR
====================================================== */

function adminCoachesOpenSidebar(){

    adminCoachesDOM
        .sidebar
        ?.classList
        .add(
            "is-open"
        );

    adminCoachesDOM
        .sidebarOverlay
        ?.classList
        .add(
            "is-visible"
        );

    document.body
        .classList
        .add(
            "admin-sidebar-open"
        );

}


function adminCoachesCloseSidebar(){

    adminCoachesDOM
        .sidebar
        ?.classList
        .remove(
            "is-open"
        );

    adminCoachesDOM
        .sidebarOverlay
        ?.classList
        .remove(
            "is-visible"
        );

    document.body
        .classList
        .remove(
            "admin-sidebar-open"
        );

}


function adminCoachesToggleSidebar(){

    const isOpen =
        adminCoachesDOM
            .sidebar
            ?.classList
            .contains(
                "is-open"
            );

    if(isOpen){

        adminCoachesCloseSidebar();

    }else{

        adminCoachesOpenSidebar();

    }

}


/* ======================================================
   NOTIFICATIONS PANEL
====================================================== */

function adminCoachesOpenNotifications(){

    adminCoachesCloseAccountMenu();

    if(
        adminCoachesDOM
            .notificationPanel
    ){

        adminCoachesDOM
            .notificationPanel
            .hidden =
                false;

    }

}


function adminCoachesCloseNotifications(){

    if(
        adminCoachesDOM
            .notificationPanel
    ){

        adminCoachesDOM
            .notificationPanel
            .hidden =
                true;

    }

}


function adminCoachesToggleNotifications(){

    const panel =
        adminCoachesDOM
            .notificationPanel;

    if(!panel){

        return;

    }

    const shouldOpen =
        panel.hidden;

    if(shouldOpen){

        adminCoachesOpenNotifications();

    }else{

        adminCoachesCloseNotifications();

    }

}


/* ======================================================
   ACCOUNT MENU
====================================================== */

function adminCoachesOpenAccountMenu(){

    adminCoachesCloseNotifications();

    if(
        adminCoachesDOM
            .accountMenu
    ){

        adminCoachesDOM
            .accountMenu
            .hidden =
                false;

    }

}


function adminCoachesCloseAccountMenu(){

    if(
        adminCoachesDOM
            .accountMenu
    ){

        adminCoachesDOM
            .accountMenu
            .hidden =
                true;

    }

}


function adminCoachesToggleAccountMenu(){

    const menu =
        adminCoachesDOM
            .accountMenu;

    if(!menu){

        return;

    }

    const shouldOpen =
        menu.hidden;

    if(shouldOpen){

        adminCoachesOpenAccountMenu();

    }else{

        adminCoachesCloseAccountMenu();

    }

}


/* ======================================================
   LOGOUT MODAL
====================================================== */

function adminCoachesOpenLogoutModal(){

    adminCoachesCloseAccountMenu();

    adminCoachesOpenModal(
        adminCoachesDOM
            .logoutModal
    );

}


async function adminCoachesHandleLogout(){

    if(
        adminCoachesState
            .isSubmitting
    ){

        return;

    }

    adminCoachesState
        .isSubmitting =
            true;

    adminCoachesSetButtonLoading(

        adminCoachesDOM
            .confirmLogoutButton,

        true,

        "Signing out..."

    );

    try{

        /*
         * BACKEND INTEGRATION PLACEHOLDER FOR HARSH
         *
         * await adminCoachesRequest(
         *     `${adminCoachesConfig.apiBaseURL}/auth/logout`,
         *     {
         *         method: "POST"
         *     }
         * );
         */

        await new Promise(

            (resolve) =>
                window.setTimeout(
                    resolve,
                    500
                )

        );

        localStorage.removeItem(
            adminCoachesConfig.authTokenKey
        );

        sessionStorage.clear();

        window.location.href =
            adminCoachesConfig.loginPageURL ||
            "admin-login.html";

    }catch(error){

        adminCoachesShowToast({

            type:
                "error",

            title:
                "Unable to sign out",

            message:
                error.message ||
                "Please try again."

        });

    }finally{

        adminCoachesState
            .isSubmitting =
                false;

        adminCoachesSetButtonLoading(

            adminCoachesDOM
                .confirmLogoutButton,

            false

        );

    }

}


/* ======================================================
   FILTER CHANGE HANDLER
====================================================== */

function adminCoachesHandleFilterChange(){

    adminCoachesReadFilters();

    adminCoachesRender();

}


/* ======================================================
   SEARCH HANDLER
====================================================== */

const adminCoachesHandleSearch =
    adminCoachesDebounce(

        () => {

            adminCoachesReadFilters();

            adminCoachesRender();

        },

        300

    );


/* ======================================================
   PAGE SIZE CHANGE
====================================================== */

function adminCoachesHandlePageSizeChange(
    event
){

    const pageSize =
        Number(
            event.target.value
        );

    if(
        !Number.isInteger(
            pageSize
        ) ||
        pageSize <= 0
    ){

        return;

    }

    adminCoachesState
        .pagination
        .pageSize =
            pageSize;

    adminCoachesState
        .pagination
        .currentPage =
            1;

    adminCoachesRender();

}


/* ======================================================
   PAGINATION ACTIONS
====================================================== */

function adminCoachesHandlePaginationClick(
    event
){

    const pageButton =
        event.target.closest(
            "[data-page]"
        );

    if(!pageButton){

        return;

    }

    const page =
        Number(
            pageButton.dataset.page
        );

    adminCoachesSetPage(
        page
    );

    adminCoachesRender();

}


function adminCoachesGoToPreviousPage(){

    adminCoachesSetPage(

        adminCoachesState
            .pagination
            .currentPage -
            1

    );

    adminCoachesRender();

}


function adminCoachesGoToNextPage(){

    adminCoachesSetPage(

        adminCoachesState
            .pagination
            .currentPage +
            1

    );

    adminCoachesRender();

}


/* ======================================================
   MODAL CLOSE ACTIONS
====================================================== */

function adminCoachesHandleModalClose(
    event
){

    const closeButton =
        event.target.closest(
            "[data-modal-close]"
        );

    if(!closeButton){

        return;

    }

    const modal =
        closeButton.closest(
            ".admin-modal"
        );

    adminCoachesCloseModal(
        modal
    );

}


function adminCoachesHandleModalBackdrop(
    event
){

    if(
        event.target ===
        event.currentTarget
    ){

        adminCoachesCloseModal(
            event.currentTarget
        );

    }

}


/* ======================================================
   OUTSIDE CLICK HANDLER
====================================================== */

function adminCoachesHandleDocumentClick(
    event
){

    const clickedNotificationControl =
        event.target.closest(
            "[data-notification-control]"
        );

    const clickedAccountControl =
        event.target.closest(
            "[data-account-control]"
        );

    if(!clickedNotificationControl){

        adminCoachesCloseNotifications();

    }

    if(!clickedAccountControl){

        adminCoachesCloseAccountMenu();

    }

}


/* ======================================================
   KEYBOARD INTERACTIONS
====================================================== */

function adminCoachesHandleKeyboard(
    event
){

    if(
        event.key ===
        "Escape"
    ){

        adminCoachesCloseNotifications();

        adminCoachesCloseAccountMenu();

        adminCoachesCloseSidebar();

        const openModals =
            Array.from(

                document.querySelectorAll(
                    ".admin-modal:not([hidden])"
                )

            );

        const lastOpenModal =
            openModals.at(
                -1
            );

        if(lastOpenModal){

            adminCoachesCloseModal(
                lastOpenModal
            );

        }

    }

    if(
        (
            event.ctrlKey ||
            event.metaKey
        ) &&
        event.key.toLowerCase() ===
            "k"
    ){

        event.preventDefault();

        adminCoachesDOM
            .coachSearchInput
            ?.focus();

    }

}


/* ======================================================
   WINDOW RESIZE
====================================================== */

function adminCoachesHandleResize(){

    if(
        window.innerWidth >
        1024
    ){

        adminCoachesCloseSidebar();

    }

}


/* ======================================================
   CLEAR SELECTION
====================================================== */

function adminCoachesClearSelection(){

    adminCoachesState
        .selectedCoachIds
        .clear();

    adminCoachesRenderTable();

    adminCoachesRenderBulkActions();

}


/* ======================================================
   EMPTY STATE RESET
====================================================== */

function adminCoachesHandleEmptyStateReset(){

    adminCoachesResetFilters();

    adminCoachesRender();

}


/* ======================================================
   REGISTER FORM EVENTS
====================================================== */

function adminCoachesRegisterFormEvents(){

    adminCoachesDOM
        .addCoachForm
        ?.addEventListener(
            "submit",
            adminCoachesHandleCreate
        );

    adminCoachesDOM
        .editCoachForm
        ?.addEventListener(
            "submit",
            adminCoachesHandleUpdate
        );

    adminCoachesDOM
        .verifyCoachForm
        ?.addEventListener(
            "submit",
            adminCoachesHandleVerify
        );

    adminCoachesDOM
        .exportCoachForm
        ?.addEventListener(
            "submit",
            adminCoachesHandleExportSubmit
        );

}


/* ======================================================
   REGISTER FILTER EVENTS
====================================================== */

function adminCoachesRegisterFilterEvents(){

    adminCoachesDOM
        .coachSearchInput
        ?.addEventListener(
            "input",
            adminCoachesHandleSearch
        );

    [

        adminCoachesDOM
            .verificationFilter,

        adminCoachesDOM
            .licenceFilter,

        adminCoachesDOM
            .specialisationFilter,

        adminCoachesDOM
            .stateFilter,

        adminCoachesDOM
            .availabilityFilter,

        adminCoachesDOM
            .sortFilter

    ]
        .filter(
            Boolean
        )
        .forEach(

            (filter) =>
                filter.addEventListener(
                    "change",
                    adminCoachesHandleFilterChange
                )

        );

    adminCoachesDOM
        .pageSizeFilter
        ?.addEventListener(
            "change",
            adminCoachesHandlePageSizeChange
        );

    adminCoachesDOM
        .resetFiltersButton
        ?.addEventListener(
            "click",
            () => {

                adminCoachesResetFilters();

                adminCoachesRender();

            }
        );

    adminCoachesDOM
        .emptyStateResetButton
        ?.addEventListener(
            "click",
            adminCoachesHandleEmptyStateReset
        );

}


/* ======================================================
   REGISTER TABLE EVENTS
====================================================== */

function adminCoachesRegisterTableEvents(){

    adminCoachesDOM
        .coachesTableBody
        ?.addEventListener(
            "click",
            adminCoachesHandleTableAction
        );

    adminCoachesDOM
        .coachesTableBody
        ?.addEventListener(

            "change",

            (event) => {

                const checkbox =
                    event.target.closest(
                        ".admin-coach-checkbox"
                    );

                if(checkbox){

                    adminCoachesHandleRowSelection(
                        checkbox
                    );

                }

            }

        );

    adminCoachesDOM
        .selectAllCoaches
        ?.addEventListener(
            "change",
            adminCoachesHandleSelectAll
        );

}


/* ======================================================
   REGISTER PAGINATION EVENTS
====================================================== */

function adminCoachesRegisterPaginationEvents(){

    adminCoachesDOM
        .paginationPages
        ?.addEventListener(
            "click",
            adminCoachesHandlePaginationClick
        );

    adminCoachesDOM
        .previousPageButton
        ?.addEventListener(
            "click",
            adminCoachesGoToPreviousPage
        );

    adminCoachesDOM
        .nextPageButton
        ?.addEventListener(
            "click",
            adminCoachesGoToNextPage
        );

}


/* ======================================================
   REGISTER ACTION EVENTS
====================================================== */

function adminCoachesRegisterActionEvents(){

    adminCoachesDOM
        .addCoachButton
        ?.addEventListener(
            "click",
            adminCoachesOpenAddModal
        );

    adminCoachesDOM
        .exportCoachButton
        ?.addEventListener(
            "click",
            adminCoachesOpenExportModal
        );

    adminCoachesDOM
        .editCoachFromViewButton
        ?.addEventListener(
            "click",
            adminCoachesHandleEditFromView
        );

    adminCoachesDOM
        .confirmDeleteCoachButton
        ?.addEventListener(
            "click",
            adminCoachesHandleDelete
        );

    adminCoachesDOM
        .deleteCoachConfirmationInput
        ?.addEventListener(
            "input",
            adminCoachesHandleDeleteConfirmationInput
        );

    adminCoachesDOM
        .bulkVerifyButton
        ?.addEventListener(
            "click",
            adminCoachesHandleBulkVerify
        );

    adminCoachesDOM
        .bulkAvailableButton
        ?.addEventListener(

            "click",

            () =>
                adminCoachesHandleBulkAvailability(
                    "available"
                )

        );

    adminCoachesDOM
        .bulkUnavailableButton
        ?.addEventListener(

            "click",

            () =>
                adminCoachesHandleBulkAvailability(
                    "unavailable"
                )

        );

    adminCoachesDOM
        .bulkDeleteButton
        ?.addEventListener(
            "click",
            adminCoachesOpenBulkDeleteModal
        );

    adminCoachesDOM
        .clearSelectionButton
        ?.addEventListener(
            "click",
            adminCoachesClearSelection
        );

}


/* ======================================================
   REGISTER NAVIGATION EVENTS
====================================================== */

function adminCoachesRegisterNavigationEvents(){

    adminCoachesDOM
        .sidebarToggleButton
        ?.addEventListener(
            "click",
            adminCoachesToggleSidebar
        );

    adminCoachesDOM
        .sidebarCloseButton
        ?.addEventListener(
            "click",
            adminCoachesCloseSidebar
        );

    adminCoachesDOM
        .sidebarOverlay
        ?.addEventListener(
            "click",
            adminCoachesCloseSidebar
        );

    adminCoachesDOM
        .notificationButton
        ?.addEventListener(
            "click",
            adminCoachesToggleNotifications
        );

    adminCoachesDOM
        .notificationCloseButton
        ?.addEventListener(
            "click",
            adminCoachesCloseNotifications
        );

    adminCoachesDOM
        .accountButton
        ?.addEventListener(
            "click",
            adminCoachesToggleAccountMenu
        );

    adminCoachesDOM
        .logoutButton
        ?.addEventListener(
            "click",
            adminCoachesOpenLogoutModal
        );

    adminCoachesDOM
        .accountLogoutButton
        ?.addEventListener(
            "click",
            adminCoachesOpenLogoutModal
        );

    adminCoachesDOM
        .confirmLogoutButton
        ?.addEventListener(
            "click",
            adminCoachesHandleLogout
        );

}


/* ======================================================
   REGISTER MODAL EVENTS
====================================================== */

function adminCoachesRegisterModalEvents(){

    document
        .querySelectorAll(
            "[data-modal-close]"
        )
        .forEach(

            (button) =>
                button.addEventListener(
                    "click",
                    adminCoachesHandleModalClose
                )

        );

    document
        .querySelectorAll(
            ".admin-modal"
        )
        .forEach(

            (modal) =>
                modal.addEventListener(
                    "click",
                    adminCoachesHandleModalBackdrop
                )

        );

}


/* ======================================================
   REGISTER GLOBAL EVENTS
====================================================== */

function adminCoachesRegisterGlobalEvents(){

    document.addEventListener(
        "click",
        adminCoachesHandleDocumentClick
    );

    document.addEventListener(
        "keydown",
        adminCoachesHandleKeyboard
    );

    window.addEventListener(
        "resize",
        adminCoachesDebounce(
            adminCoachesHandleResize,
            150
        )
    );

}


/* ======================================================
   REGISTER ALL EVENTS
====================================================== */

function adminCoachesRegisterEvents(){

    adminCoachesRegisterFormEvents();

    adminCoachesRegisterFilterEvents();

    adminCoachesRegisterTableEvents();

    adminCoachesRegisterPaginationEvents();

    adminCoachesRegisterActionEvents();

    adminCoachesRegisterNavigationEvents();

    adminCoachesRegisterModalEvents();

    adminCoachesRegisterGlobalEvents();

}


/* ======================================================
   LOAD COACHES
====================================================== */

async function adminCoachesLoadData(){

    adminCoachesShowLoadingScreen();

    try{

        const coaches =
            await adminCoachesAPI
                .getCoaches();

        adminCoachesState.coaches =
            Array.isArray(
                coaches
            )
                ? coaches
                : [];

        adminCoachesState
            .selectedCoachIds
            .clear();

        adminCoachesPopulateStateFilter();

        adminCoachesRender();

    }catch(error){

        adminCoachesState.coaches =
            [];

        adminCoachesRender();

        adminCoachesShowToast({

            type:
                "error",

            title:
                "Unable to load coaches",

            message:
                error.message ||
                "Coach records could not be loaded."

        });

    }finally{

        adminCoachesHideLoadingScreen();

    }

}


/* ======================================================
   AUTHENTICATION PLACEHOLDER
====================================================== */

function adminCoachesCheckAuthentication(){

    /*
     * BACKEND INTEGRATION PLACEHOLDER FOR HARSH
     *
     * const token =
     *     localStorage.getItem(
     *         adminCoachesConfig.authTokenKey
     *     );
     *
     * if(!token){
     *
     *     window.location.href =
     *         adminCoachesConfig.loginPageURL;
     *
     *     return false;
     *
     * }
     */

    return true;

}


/* ======================================================
   APPLICATION INITIALIZATION
====================================================== */

async function adminCoachesInitialize(){

    const isAuthenticated =
        adminCoachesCheckAuthentication();

    if(!isAuthenticated){

        return;

    }

    adminCoachesRegisterEvents();

    await adminCoachesLoadData();

}


/* ======================================================
   APPLICATION BOOTSTRAP
====================================================== */

if(
    document.readyState ===
    "loading"
){

    document.addEventListener(

        "DOMContentLoaded",

        adminCoachesInitialize,

        {

            once:
                true

        }

    );

}else{

    adminCoachesInitialize();

}