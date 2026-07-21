/* =========================================================
   ADMIN ACADEMIES
   FILE: admin-academies.js
   PART 1A
========================================================= */

"use strict";


/* =========================================================
   CONFIGURATION
========================================================= */

const ADMIN_ACADEMIES_CONFIG = Object.freeze({

    API_BASE_URL:
        "/api/v1/admin",

    ENDPOINTS: Object.freeze({

        list:
            "/academies",

        create:
            "/academies",

        update:
            "/academies",

        remove:
            "/academies",

        verify:
            "/academies",

        bulkVerify:
            "/academies/bulk/verify",

        bulkVisibility:
            "/academies/bulk/visibility",

        bulkDelete:
            "/academies/bulk/delete",

        export:
            "/academies/export"

    }),

    DEFAULT_PAGE:
        1,

    DEFAULT_PAGE_SIZE:
        8,

    SEARCH_DEBOUNCE_MS:
        350,

    TOAST_DURATION_MS:
        4200,

    MODAL_ANIMATION_MS:
        250,

    USE_MOCK_DATA:
        true

});


/* =========================================================
   APPLICATION STATE
========================================================= */

const adminAcademiesState = {

    academies: [],

    filteredAcademies: [],

    selectedAcademyIds:
        new Set(),

    currentPage:
        ADMIN_ACADEMIES_CONFIG.DEFAULT_PAGE,

    pageSize:
        ADMIN_ACADEMIES_CONFIG.DEFAULT_PAGE_SIZE,

    totalPages:
        1,

    activeAcademyId:
        null,

    activeFilters: {

        search:
            "",

        verification:
            "all",

        type:
            "all",

        state:
            "all",

        visibility:
            "all",

        sort:
            "newest"

    },

    loading:
        false,

    initialized:
        false

};


/* =========================================================
   DOM CACHE
========================================================= */

const adminAcademiesDOM = {

    loadingScreen:
        document.getElementById(
            "adminLoadingScreen"
        ),

    tableBody:
        document.getElementById(
            "adminAcademiesTableBody"
        ),

    table:
        document.getElementById(
            "adminAcademiesTable"
        ),

    tableWrapper:
        document.getElementById(
            "adminAcademiesTableWrapper"
        ),

    emptyState:
        document.getElementById(
            "adminAcademiesEmptyState"
        ),

    loadingState:
        document.getElementById(
            "adminAcademiesLoadingState"
        ),

    selectAllCheckbox:
        document.getElementById(
            "adminAcademiesSelectAll"
        ),

    bulkActions:
        document.getElementById(
            "adminAcademiesBulkActions"
        ),

    selectedCount:
        document.getElementById(
            "adminAcademiesSelectedCount"
        ),

    clearSelectionButton:
        document.getElementById(
            "adminAcademiesClearSelectionButton"
        ),

    bulkVerifyButton:
        document.getElementById(
            "adminBulkVerifyAcademiesButton"
        ),

    bulkPublicButton:
        document.getElementById(
            "adminBulkPublicAcademiesButton"
        ),

    bulkHiddenButton:
        document.getElementById(
            "adminBulkHiddenAcademiesButton"
        ),

    bulkDeleteButton:
        document.getElementById(
            "adminBulkDeleteAcademiesButton"
        ),

    searchInput:
        document.getElementById(
            "adminAcademiesSearchInput"
        ),

    verificationFilter:
        document.getElementById(
            "adminAcademiesVerificationFilter"
        ),

    typeFilter:
        document.getElementById(
            "adminAcademiesTypeFilter"
        ),

    stateFilter:
        document.getElementById(
            "adminAcademiesStateFilter"
        ),

    visibilityFilter:
        document.getElementById(
            "adminAcademiesVisibilityFilter"
        ),

    sortFilter:
        document.getElementById(
            "adminAcademiesSortFilter"
        ),

    filterForm:
        document.getElementById(
            "adminAcademiesFilterForm"
        ),

    resetFiltersButton:
        document.getElementById(
            "adminAcademiesResetFiltersButton"
        ),

    addAcademyButton:
        document.getElementById(
            "adminAddAcademyButton"
        ),

    exportAcademiesButton:
        document.getElementById(
            "adminExportAcademiesButton"
        ),

    refreshAcademiesButton:
        document.getElementById(
            "adminRefreshAcademiesButton"
        ),

    pagination:
        document.getElementById(
            "adminAcademiesPagination"
        ),

    previousPageButton:
        document.getElementById(
            "adminAcademiesPreviousPageButton"
        ),

    nextPageButton:
        document.getElementById(
            "adminAcademiesNextPageButton"
        ),

    paginationSummary:
        document.getElementById(
            "adminAcademiesPaginationSummary"
        ),

    metricTotal:
        document.getElementById(
            "adminAcademiesTotalMetric"
        ),

    metricVerified:
        document.getElementById(
            "adminAcademiesVerifiedMetric"
        ),

    metricPending:
        document.getElementById(
            "adminAcademiesPendingMetric"
        ),

    metricPublic:
        document.getElementById(
            "adminAcademiesPublicMetric"
        ),

    toastRegion:
        document.getElementById(
            "adminToastRegion"
        ),

    addModal:
        document.getElementById(
            "adminAddAcademyModal"
        ),

    addModalBackdrop:
        document.getElementById(
            "adminAddAcademyModalBackdrop"
        ),

    addModalCloseButton:
        document.getElementById(
            "adminAddAcademyModalCloseButton"
        ),

    cancelAddButton:
        document.getElementById(
            "adminCancelAddAcademyButton"
        ),

    addForm:
        document.getElementById(
            "adminAddAcademyForm"
        ),

    viewModal:
        document.getElementById(
            "adminViewAcademyModal"
        ),

    viewModalBackdrop:
        document.getElementById(
            "adminViewAcademyModalBackdrop"
        ),

    viewModalCloseButton:
        document.getElementById(
            "adminViewAcademyModalCloseButton"
        ),

    closeDetailsButton:
        document.getElementById(
            "adminCloseAcademyDetailsButton"
        ),

    editFromDetailsButton:
        document.getElementById(
            "adminEditAcademyFromDetailsButton"
        ),

    detailsContent:
        document.getElementById(
            "adminAcademyDetailsContent"
        ),

    editModal:
        document.getElementById(
            "adminEditAcademyModal"
        ),

    editModalBackdrop:
        document.getElementById(
            "adminEditAcademyModalBackdrop"
        ),

    editModalCloseButton:
        document.getElementById(
            "adminEditAcademyModalCloseButton"
        ),

    cancelEditButton:
        document.getElementById(
            "adminCancelEditAcademyButton"
        ),

    editForm:
        document.getElementById(
            "adminEditAcademyForm"
        ),

    editFormFields:
        document.getElementById(
            "adminEditAcademyFormFields"
        ),

    editAcademyId:
        document.getElementById(
            "adminEditAcademyId"
        ),

    verifyModal:
        document.getElementById(
            "adminVerifyAcademyModal"
        ),

    verifyModalBackdrop:
        document.getElementById(
            "adminVerifyAcademyModalBackdrop"
        ),

    verifyModalCloseButton:
        document.getElementById(
            "adminVerifyAcademyModalCloseButton"
        ),

    cancelVerifyButton:
        document.getElementById(
            "adminCancelVerifyAcademyButton"
        ),

    confirmVerifyButton:
        document.getElementById(
            "adminConfirmVerifyAcademyButton"
        ),

    verifyAcademyName:
        document.getElementById(
            "adminVerifyAcademyName"
        ),

    deleteModal:
        document.getElementById(
            "adminDeleteAcademyModal"
        ),

    deleteModalBackdrop:
        document.getElementById(
            "adminDeleteAcademyModalBackdrop"
        ),

    deleteModalCloseButton:
        document.getElementById(
            "adminDeleteAcademyModalCloseButton"
        ),

    cancelDeleteButton:
        document.getElementById(
            "adminCancelDeleteAcademyButton"
        ),

    deleteForm:
        document.getElementById(
            "adminDeleteAcademyForm"
        ),

    deleteAcademyId:
        document.getElementById(
            "adminDeleteAcademyId"
        ),

    deleteAcademyName:
        document.getElementById(
            "adminDeleteAcademyName"
        ),

    deleteConfirmationInput:
        document.getElementById(
            "adminDeleteAcademyConfirmationInput"
        ),

    exportModal:
        document.getElementById(
            "adminExportAcademiesModal"
        ),

    exportModalBackdrop:
        document.getElementById(
            "adminExportAcademiesModalBackdrop"
        ),

    exportModalCloseButton:
        document.getElementById(
            "adminExportAcademiesModalCloseButton"
        ),

    cancelExportButton:
        document.getElementById(
            "adminCancelExportAcademiesButton"
        ),

    exportForm:
        document.getElementById(
            "adminExportAcademiesForm"
        ),

    exportFormat:
        document.getElementById(
            "adminAcademiesExportFormat"
        ),

    logoutButton:
        document.getElementById(
            "adminLogoutButton"
        ),

    logoutModal:
        document.getElementById(
            "adminLogoutModal"
        ),

    logoutModalBackdrop:
        document.getElementById(
            "adminLogoutModalBackdrop"
        ),

    logoutModalCloseButton:
        document.getElementById(
            "adminLogoutModalCloseButton"
        ),

    logoutCancelButton:
        document.getElementById(
            "adminLogoutCancelButton"
        ),

    logoutConfirmButton:
        document.getElementById(
            "adminLogoutConfirmButton"
        )

};


/* =========================================================
   MOCK ACADEMY DATA
========================================================= */

const ADMIN_ACADEMIES_MOCK_DATA = [

    {

        id:
            "academy-minerva",

        name:
            "Minerva Football Academy",

        email:
            "academy@minervafootball.com",

        phone:
            "+91 98765 10001",

        type:
            "elite-residential",

        establishedYear:
            2005,

        ownerName:
            "Mr. Ranjit Bajaj",

        state:
            "Punjab",

        city:
            "Mohali",

        address:
            "Mohali, Punjab, India",

        players:
            420,

        coaches:
            18,

        graduates:
            180,

        trophies:
            41,

        ageGroups:
            "U-8 to U-21",

        residential:
            "available",

        verification:
            "verified",

        visibility:
            "public",

        profileCompletion:
            100,

        description:
            "Elite residential football academy focused on professional player development, national scouting and structured youth pathways.",

        note:
            "Priority academy profile for the Mission FIFA 2034 national directory.",

        logo:
            "images/academies/minerva-logo.png",

        createdAt:
            "2026-07-01T09:20:00.000Z",

        updatedAt:
            "2026-07-20T10:45:00.000Z"

    },

    {

        id:
            "academy-reliance",

        name:
            "Reliance Foundation Young Champs",

        email:
            "contact@rfyc.in",

        phone:
            "+91 98765 10002",

        type:
            "professional",

        establishedYear:
            2015,

        ownerName:
            "Reliance Foundation",

        state:
            "Maharashtra",

        city:
            "Mumbai",

        address:
            "Navi Mumbai, Maharashtra, India",

        players:
            168,

        coaches:
            15,

        graduates:
            74,

        trophies:
            18,

        ageGroups:
            "U-12 to U-18",

        residential:
            "available",

        verification:
            "verified",

        visibility:
            "public",

        profileCompletion:
            96,

        description:
            "Residential youth development programme supporting elite Indian football talent with education, coaching and competitive exposure.",

        note:
            "",

        logo:
            "",

        createdAt:
            "2026-07-03T11:10:00.000Z",

        updatedAt:
            "2026-07-18T14:30:00.000Z"

    },

    {

        id:
            "academy-tata",

        name:
            "Tata Football Academy",

        email:
            "football@tataacademy.in",

        phone:
            "+91 98765 10003",

        type:
            "professional",

        establishedYear:
            1987,

        ownerName:
            "Tata Steel",

        state:
            "Jharkhand",

        city:
            "Jamshedpur",

        address:
            "Jamshedpur, Jharkhand, India",

        players:
            205,

        coaches:
            16,

        graduates:
            142,

        trophies:
            33,

        ageGroups:
            "U-14 to U-21",

        residential:
            "available",

        verification:
            "pending",

        visibility:
            "restricted",

        profileCompletion:
            88,

        description:
            "Historic Indian football academy recognised for producing technically strong players through residential development.",

        note:
            "Awaiting final verification documents.",

        logo:
            "",

        createdAt:
            "2026-07-05T08:40:00.000Z",

        updatedAt:
            "2026-07-17T09:05:00.000Z"

    },

    {

        id:
            "academy-bengaluru",

        name:
            "Bengaluru FC Academy",

        email:
            "academy@bengalurufc.com",

        phone:
            "+91 98765 10004",

        type:
            "club",

        establishedYear:
            2013,

        ownerName:
            "JSW Sports",

        state:
            "Karnataka",

        city:
            "Bengaluru",

        address:
            "Bengaluru, Karnataka, India",

        players:
            240,

        coaches:
            20,

        graduates:
            90,

        trophies:
            22,

        ageGroups:
            "U-9 to U-18",

        residential:
            "limited",

        verification:
            "verified",

        visibility:
            "public",

        profileCompletion:
            94,

        description:
            "Professional club academy with age-group teams, scouting programmes and structured progression into senior football.",

        note:
            "",

        logo:
            "",

        createdAt:
            "2026-07-06T10:15:00.000Z",

        updatedAt:
            "2026-07-16T12:40:00.000Z"

    },

    {

        id:
            "academy-northeast",

        name:
            "NorthEast United FC Academy",

        email:
            "youth@northeastunitedfc.com",

        phone:
            "+91 98765 10005",

        type:
            "club",

        establishedYear:
            2014,

        ownerName:
            "NorthEast United FC",

        state:
            "Assam",

        city:
            "Guwahati",

        address:
            "Guwahati, Assam, India",

        players:
            186,

        coaches:
            13,

        graduates:
            61,

        trophies:
            12,

        ageGroups:
            "U-10 to U-18",

        residential:
            "limited",

        verification:
            "pending",

        visibility:
            "public",

        profileCompletion:
            82,

        description:
            "Regional youth academy identifying and developing football talent across the eight northeastern states.",

        note:
            "Contact details require confirmation.",

        logo:
            "",

        createdAt:
            "2026-07-07T13:25:00.000Z",

        updatedAt:
            "2026-07-15T16:10:00.000Z"

    },

    {

        id:
            "academy-sesa",

        name:
            "Sesa Football Academy",

        email:
            "academy@sesafootball.in",

        phone:
            "+91 98765 10006",

        type:
            "professional",

        establishedYear:
            1999,

        ownerName:
            "Sesa Goa",

        state:
            "Goa",

        city:
            "Sanquelim",

        address:
            "Sanquelim, Goa, India",

        players:
            132,

        coaches:
            11,

        graduates:
            88,

        trophies:
            16,

        ageGroups:
            "U-13 to U-20",

        residential:
            "available",

        verification:
            "verified",

        visibility:
            "public",

        profileCompletion:
            91,

        description:
            "Residential football academy supporting talented young players through professional coaching and competitive development.",

        note:
            "",

        logo:
            "",

        createdAt:
            "2026-07-08T09:55:00.000Z",

        updatedAt:
            "2026-07-14T10:25:00.000Z"

    },

    {

        id:
            "academy-punjab-grassroots",

        name:
            "Punjab Grassroots Football Centre",

        email:
            "info@punjabgrassroots.in",

        phone:
            "+91 98765 10007",

        type:
            "grassroots",

        establishedYear:
            2019,

        ownerName:
            "Punjab Football Development Trust",

        state:
            "Punjab",

        city:
            "Ludhiana",

        address:
            "Ludhiana, Punjab, India",

        players:
            310,

        coaches:
            14,

        graduates:
            30,

        trophies:
            7,

        ageGroups:
            "U-6 to U-16",

        residential:
            "not-available",

        verification:
            "incomplete",

        visibility:
            "hidden",

        profileCompletion:
            58,

        description:
            "Community-oriented grassroots programme providing accessible football coaching for children across multiple age groups.",

        note:
            "Missing registration certificate and coaching credentials.",

        logo:
            "",

        createdAt:
            "2026-07-09T12:30:00.000Z",

        updatedAt:
            "2026-07-13T08:15:00.000Z"

    },

    {

        id:
            "academy-dimapur",

        name:
            "Dimapur Youth Football Academy",

        email:
            "contact@dimapuryouthfootball.in",

        phone:
            "+91 98765 10008",

        type:
            "community",

        establishedYear:
            2021,

        ownerName:
            "Dimapur Youth Sports Society",

        state:
            "Nagaland",

        city:
            "Dimapur",

        address:
            "Dimapur, Nagaland, India",

        players:
            145,

        coaches:
            9,

        graduates:
            18,

        trophies:
            5,

        ageGroups:
            "U-8 to U-17",

        residential:
            "not-available",

        verification:
            "pending",

        visibility:
            "restricted",

        profileCompletion:
            74,

        description:
            "Community football academy focused on discovering and supporting youth talent from Dimapur and nearby districts.",

        note:
            "Pending academy director identity verification.",

        logo:
            "",

        createdAt:
            "2026-07-10T07:35:00.000Z",

        updatedAt:
            "2026-07-12T14:00:00.000Z"

    },

    {

        id:
            "academy-kerala-school",

        name:
            "Kerala School Football Centre",

        email:
            "football@ksfc.edu.in",

        phone:
            "+91 98765 10009",

        type:
            "school",

        establishedYear:
            2018,

        ownerName:
            "Kerala School Sports Council",

        state:
            "Kerala",

        city:
            "Kochi",

        address:
            "Kochi, Kerala, India",

        players:
            275,

        coaches:
            17,

        graduates:
            52,

        trophies:
            14,

        ageGroups:
            "U-8 to U-18",

        residential:
            "limited",

        verification:
            "rejected",

        visibility:
            "hidden",

        profileCompletion:
            68,

        description:
            "School-linked football programme integrating academic education with structured youth training and inter-school competition.",

        note:
            "Verification rejected due to expired supporting documents.",

        logo:
            "",

        createdAt:
            "2026-07-11T15:20:00.000Z",

        updatedAt:
            "2026-07-11T17:10:00.000Z"

    }

];


/* =========================================================
   API SERVICE PLACEHOLDERS
========================================================= */

const adminAcademiesAPI = {

    async getAcademies() {

        if (
            ADMIN_ACADEMIES_CONFIG.USE_MOCK_DATA
        ) {

            await adminAcademiesDelay(
                500
            );

            return structuredClone(
                ADMIN_ACADEMIES_MOCK_DATA
            );

        }


        const response =
            await fetch(
                `${ADMIN_ACADEMIES_CONFIG.API_BASE_URL}${ADMIN_ACADEMIES_CONFIG.ENDPOINTS.list}`,
                {

                    method:
                        "GET",

                    credentials:
                        "include",

                    headers: {

                        Accept:
                            "application/json"

                    }

                }
            );


        if (
            !response.ok
        ) {

            throw new Error(
                "Unable to load academy records."
            );

        }


        return response.json();

    },


    async createAcademy(
        academyData
    ) {

        if (
            ADMIN_ACADEMIES_CONFIG.USE_MOCK_DATA
        ) {

            await adminAcademiesDelay(
                650
            );

            return {

                ...academyData,

                id:
                    `academy-${crypto.randomUUID()}`,

                createdAt:
                    new Date().toISOString(),

                updatedAt:
                    new Date().toISOString()

            };

        }


        const response =
            await fetch(
                `${ADMIN_ACADEMIES_CONFIG.API_BASE_URL}${ADMIN_ACADEMIES_CONFIG.ENDPOINTS.create}`,
                {

                    method:
                        "POST",

                    credentials:
                        "include",

                    headers: {

                        "Content-Type":
                            "application/json",

                        Accept:
                            "application/json"

                    },

                    body:
                        JSON.stringify(
                            academyData
                        )

                }
            );


        if (
            !response.ok
        ) {

            throw new Error(
                "Unable to create academy."
            );

        }


        return response.json();

    },


    async updateAcademy(
        academyId,
        academyData
    ) {

        if (
            ADMIN_ACADEMIES_CONFIG.USE_MOCK_DATA
        ) {

            await adminAcademiesDelay(
                600
            );

            return {

                ...academyData,

                id:
                    academyId,

                updatedAt:
                    new Date().toISOString()

            };

        }


        const response =
            await fetch(
                `${ADMIN_ACADEMIES_CONFIG.API_BASE_URL}${ADMIN_ACADEMIES_CONFIG.ENDPOINTS.update}/${encodeURIComponent(academyId)}`,
                {

                    method:
                        "PATCH",

                    credentials:
                        "include",

                    headers: {

                        "Content-Type":
                            "application/json",

                        Accept:
                            "application/json"

                    },

                    body:
                        JSON.stringify(
                            academyData
                        )

                }
            );


        if (
            !response.ok
        ) {

            throw new Error(
                "Unable to update academy."
            );

        }


        return response.json();

    },


    async deleteAcademy(
        academyId
    ) {

        if (
            ADMIN_ACADEMIES_CONFIG.USE_MOCK_DATA
        ) {

            await adminAcademiesDelay(
                550
            );

            return {

                success:
                    true

            };

        }


        const response =
            await fetch(
                `${ADMIN_ACADEMIES_CONFIG.API_BASE_URL}${ADMIN_ACADEMIES_CONFIG.ENDPOINTS.remove}/${encodeURIComponent(academyId)}`,
                {

                    method:
                        "DELETE",

                    credentials:
                        "include",

                    headers: {

                        Accept:
                            "application/json"

                    }

                }
            );


        if (
            !response.ok
        ) {

            throw new Error(
                "Unable to delete academy."
            );

        }


        return response.json();

    },


    async verifyAcademy(
        academyId
    ) {

        if (
            ADMIN_ACADEMIES_CONFIG.USE_MOCK_DATA
        ) {

            await adminAcademiesDelay(
                500
            );

            return {

                success:
                    true,

                verification:
                    "verified"

            };

        }


        const response =
            await fetch(
                `${ADMIN_ACADEMIES_CONFIG.API_BASE_URL}${ADMIN_ACADEMIES_CONFIG.ENDPOINTS.verify}/${encodeURIComponent(academyId)}/verify`,
                {

                    method:
                        "PATCH",

                    credentials:
                        "include",

                    headers: {

                        "Content-Type":
                            "application/json",

                        Accept:
                            "application/json"

                    },

                    body:
                        JSON.stringify({

                            verification:
                                "verified"

                        })

                }
            );


        if (
            !response.ok
        ) {

            throw new Error(
                "Unable to verify academy."
            );

        }


        return response.json();

    }

};

/* =========================================================
   ADMIN ACADEMIES
   FILE: admin-academies.js
   PART 1B
========================================================= */


/* =========================================================
   GENERAL UTILITIES
========================================================= */

function adminAcademiesDelay(
    milliseconds
) {

    return new Promise(
        (
            resolve
        ) => {

            window.setTimeout(
                resolve,
                milliseconds
            );

        }
    );

}


function adminAcademiesEscapeHTML(
    value
) {

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


function adminAcademiesCreateInitials(
    name
) {

    const normalizedName =
        String(
            name ?? ""
        )
            .trim();


    if (
        !normalizedName
    ) {

        return "A";

    }


    return normalizedName
        .split(
            /\s+/
        )
        .slice(
            0,
            2
        )
        .map(
            (
                word
            ) => word.charAt(
                0
            )
        )
        .join(
            ""
        )
        .toUpperCase();

}


function adminAcademiesNormalizeValue(
    value
) {

    return String(
        value ?? ""
    )
        .trim()
        .toLowerCase();

}


function adminAcademiesFormatLabel(
    value
) {

    const normalizedValue =
        String(
            value ?? ""
        )
            .trim();


    if (
        !normalizedValue
    ) {

        return "Not available";

    }


    return normalizedValue
        .replaceAll(
            "-",
            " "
        )
        .replace(
            /\b\w/g,
            (
                character
            ) => character.toUpperCase()
        );

}


function adminAcademiesFormatDate(
    value,
    options = {}
) {

    if (
        !value
    ) {

        return "Not available";

    }


    const date =
        new Date(
            value
        );


    if (
        Number.isNaN(
            date.getTime()
        )
    ) {

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


function adminAcademiesFormatDateTime(
    value
) {

    if (
        !value
    ) {

        return {

            date:
                "Not available",

            time:
                ""

        };

    }


    const date =
        new Date(
            value
        );


    if (
        Number.isNaN(
            date.getTime()
        )
    ) {

        return {

            date:
                "Not available",

            time:
                ""

        };

    }


    return {

        date:
            new Intl.DateTimeFormat(
                "en-IN",
                {

                    day:
                        "2-digit",

                    month:
                        "short",

                    year:
                        "numeric"

                }
            ).format(
                date
            ),

        time:
            new Intl.DateTimeFormat(
                "en-IN",
                {

                    hour:
                        "2-digit",

                    minute:
                        "2-digit"

                }
            ).format(
                date
            )

    };

}


function adminAcademiesFormatNumber(
    value
) {

    const numberValue =
        Number(
            value
        );


    if (
        !Number.isFinite(
            numberValue
        )
    ) {

        return "0";

    }


    return new Intl.NumberFormat(
        "en-IN"
    ).format(
        numberValue
    );

}


function adminAcademiesGenerateId() {

    if (
        typeof crypto !== "undefined" &&
        typeof crypto.randomUUID === "function"
    ) {

        return `academy-${crypto.randomUUID()}`;

    }


    return `academy-${Date.now()}-${Math.random()
        .toString(
            16
        )
        .slice(
            2
        )}`;

}


function adminAcademiesDebounce(
    callback,
    delay
) {

    let timeoutId =
        null;


    return function debouncedFunction(
        ...args
    ) {

        window.clearTimeout(
            timeoutId
        );


        timeoutId =
            window.setTimeout(
                () => {

                    callback.apply(
                        this,
                        args
                    );

                },
                delay
            );

    };

}


function adminAcademiesGetAcademyById(
    academyId
) {

    return adminAcademiesState.academies.find(
        (
            academy
        ) => academy.id === academyId
    ) ?? null;

}


function adminAcademiesGetVisiblePageRecords() {

    const startIndex =
        (
            adminAcademiesState.currentPage - 1
        ) *
        adminAcademiesState.pageSize;


    const endIndex =
        startIndex +
        adminAcademiesState.pageSize;


    return adminAcademiesState.filteredAcademies.slice(
        startIndex,
        endIndex
    );

}


function adminAcademiesClampCurrentPage() {

    adminAcademiesState.totalPages =
        Math.max(
            1,
            Math.ceil(
                adminAcademiesState.filteredAcademies.length /
                adminAcademiesState.pageSize
            )
        );


    if (
        adminAcademiesState.currentPage >
        adminAcademiesState.totalPages
    ) {

        adminAcademiesState.currentPage =
            adminAcademiesState.totalPages;

    }


    if (
        adminAcademiesState.currentPage <
        1
    ) {

        adminAcademiesState.currentPage =
            1;

    }

}


/* =========================================================
   SAFE STRUCTURED CLONE
========================================================= */

function adminAcademiesCloneData(
    data
) {

    if (
        typeof structuredClone === "function"
    ) {

        return structuredClone(
            data
        );

    }


    return JSON.parse(
        JSON.stringify(
            data
        )
    );

}


/* =========================================================
   TOAST NOTIFICATIONS
========================================================= */

function adminAcademiesShowToast(
    title,
    message,
    type = "info"
) {

    if (
        !adminAcademiesDOM.toastRegion
    ) {

        return;

    }


    const supportedTypes =
        new Set([

            "success",
            "error",
            "warning",
            "info"

        ]);


    const normalizedType =
        supportedTypes.has(
            type
        )
            ? type
            : "info";


    const iconMap = {

        success:
            "fa-circle-check",

        error:
            "fa-circle-exclamation",

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
        `admin-toast ${normalizedType}`;


    toast.setAttribute(
        "role",
        normalizedType === "error"
            ? "alert"
            : "status"
    );


    toast.innerHTML = `

        <div class="admin-toast-icon" aria-hidden="true">

            <i class="fa-solid ${iconMap[normalizedType]}"></i>

        </div>


        <div class="admin-toast-content">

            <strong>
                ${adminAcademiesEscapeHTML(title)}
            </strong>

            <p>
                ${adminAcademiesEscapeHTML(message)}
            </p>

        </div>


        <button
            class="admin-toast-close"
            type="button"
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

            if (
                !toast.isConnected
            ) {

                return;

            }


            toast.classList.add(
                "removing"
            );


            window.setTimeout(
                () => {

                    toast.remove();

                },
                250
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


    adminAcademiesDOM.toastRegion.append(
        toast
    );


    window.setTimeout(
        removeToast,
        ADMIN_ACADEMIES_CONFIG.TOAST_DURATION_MS
    );

}


/* =========================================================
   LOADING STATES
========================================================= */

function adminAcademiesSetPageLoading(
    isLoading
) {

    adminAcademiesState.loading =
        Boolean(
            isLoading
        );


    if (
        adminAcademiesDOM.loadingState
    ) {

        adminAcademiesDOM.loadingState.hidden =
            !adminAcademiesState.loading;

    }


    if (
        adminAcademiesDOM.table
    ) {

        adminAcademiesDOM.table.hidden =
            adminAcademiesState.loading;

    }


    if (
        adminAcademiesDOM.emptyState
    ) {

        adminAcademiesDOM.emptyState.hidden =
            true;

    }


    const controls = [

        adminAcademiesDOM.refreshAcademiesButton,
        adminAcademiesDOM.addAcademyButton,
        adminAcademiesDOM.exportAcademiesButton,
        adminAcademiesDOM.previousPageButton,
        adminAcademiesDOM.nextPageButton

    ];


    controls.forEach(
        (
            control
        ) => {

            if (
                control
            ) {

                control.disabled =
                    adminAcademiesState.loading;

            }

        }
    );

}


function adminAcademiesSetButtonLoading(
    button,
    isLoading,
    loadingText = "Processing"
) {

    if (
        !button
    ) {

        return;

    }


    if (
        isLoading
    ) {

        if (
            !button.dataset.originalHtml
        ) {

            button.dataset.originalHtml =
                button.innerHTML;

        }


        button.disabled =
            true;


        button.classList.add(
            "admin-button-loading"
        );


        button.innerHTML = `

            <i
                class="fa-solid fa-spinner"
                aria-hidden="true"
            ></i>

            ${adminAcademiesEscapeHTML(loadingText)}

        `;

        return;

    }


    button.disabled =
        false;


    button.classList.remove(
        "admin-button-loading"
    );


    if (
        button.dataset.originalHtml
    ) {

        button.innerHTML =
            button.dataset.originalHtml;


        delete button.dataset.originalHtml;

    }

}


/* =========================================================
   MODAL MANAGEMENT
========================================================= */

function adminAcademiesGetOpenModal() {

    return document.querySelector(
        ".admin-academy-modal:not([hidden])"
    );

}


function adminAcademiesOpenModal(
    modal
) {

    if (
        !modal
    ) {

        return;

    }


    const currentlyOpenModal =
        adminAcademiesGetOpenModal();


    if (
        currentlyOpenModal &&
        currentlyOpenModal !== modal
    ) {

        adminAcademiesCloseModal(
            currentlyOpenModal
        );

    }


    modal.hidden =
        false;


    modal.setAttribute(
        "aria-hidden",
        "false"
    );


    document.body.style.overflow =
        "hidden";


    const focusableElement =
        modal.querySelector(
            [
                "button:not([disabled])",
                "input:not([disabled])",
                "select:not([disabled])",
                "textarea:not([disabled])",
                "[tabindex]:not([tabindex='-1'])"
            ].join(
                ","
            )
        );


    window.requestAnimationFrame(
        () => {

            focusableElement?.focus();

        }
    );

}


function adminAcademiesCloseModal(
    modal
) {

    if (
        !modal
    ) {

        return;

    }


    modal.hidden =
        true;


    modal.setAttribute(
        "aria-hidden",
        "true"
    );


    if (
        !adminAcademiesGetOpenModal()
    ) {

        document.body.style.overflow =
            "";

    }

}


function adminAcademiesCloseAllModals() {

    document
        .querySelectorAll(
            ".admin-academy-modal:not([hidden])"
        )
        .forEach(
            (
                modal
            ) => {

                adminAcademiesCloseModal(
                    modal
                );

            }
        );

}


/* =========================================================
   FORM ERROR HELPERS
========================================================= */

function adminAcademiesClearFormErrors(
    form
) {

    if (
        !form
    ) {

        return;

    }


    form
        .querySelectorAll(
            "[aria-invalid='true']"
        )
        .forEach(
            (
                field
            ) => {

                field.removeAttribute(
                    "aria-invalid"
                );

            }
        );


    form
        .querySelectorAll(
            "small[data-add-error-for], small[data-edit-error-for], small[data-delete-academy-error-for]"
        )
        .forEach(
            (
                errorElement
            ) => {

                errorElement.textContent =
                    "";

            }
        );

}


function adminAcademiesSetFieldError(
    field,
    message,
    errorSelector
) {

    if (
        field
    ) {

        field.setAttribute(
            "aria-invalid",
            "true"
        );

    }


    const errorElement =
        document.querySelector(
            errorSelector
        );


    if (
        errorElement
    ) {

        errorElement.textContent =
            message;

    }

}


/* =========================================================
   FILTER OPTION POPULATION
========================================================= */

function adminAcademiesPopulateStateFilter() {

    if (
        !adminAcademiesDOM.stateFilter
    ) {

        return;

    }


    const existingValue =
        adminAcademiesDOM.stateFilter.value;


    const states =
        Array.from(
            new Set(
                adminAcademiesState.academies
                    .map(
                        (
                            academy
                        ) => String(
                            academy.state ?? ""
                        ).trim()
                    )
                    .filter(
                        Boolean
                    )
            )
        )
            .sort(
                (
                    firstState,
                    secondState
                ) => firstState.localeCompare(
                    secondState
                )
            );


    adminAcademiesDOM.stateFilter.innerHTML = `

        <option value="all">
            All States
        </option>

        ${states
            .map(
                (
                    state
                ) => `

                    <option value="${adminAcademiesEscapeHTML(state)}">
                        ${adminAcademiesEscapeHTML(state)}
                    </option>

                `
            )
            .join(
                ""
            )}

    `;


    if (
        states.includes(
            existingValue
        )
    ) {

        adminAcademiesDOM.stateFilter.value =
            existingValue;

    }

}


/* =========================================================
   FILTERING AND SORTING
========================================================= */

function adminAcademiesReadFilters() {

    adminAcademiesState.activeFilters = {

        search:
            adminAcademiesDOM.searchInput?.value.trim() ??
            "",

        verification:
            adminAcademiesDOM.verificationFilter?.value ??
            "all",

        type:
            adminAcademiesDOM.typeFilter?.value ??
            "all",

        state:
            adminAcademiesDOM.stateFilter?.value ??
            "all",

        visibility:
            adminAcademiesDOM.visibilityFilter?.value ??
            "all",

        sort:
            adminAcademiesDOM.sortFilter?.value ??
            "newest"

    };

}


function adminAcademiesApplyFilters(
    resetPage = true
) {

    adminAcademiesReadFilters();


    const filters =
        adminAcademiesState.activeFilters;


    const normalizedSearch =
        adminAcademiesNormalizeValue(
            filters.search
        );


    let records =
        adminAcademiesState.academies.filter(
            (
                academy
            ) => {

                const searchableText =
                    adminAcademiesNormalizeValue(
                        [

                            academy.name,
                            academy.email,
                            academy.phone,
                            academy.ownerName,
                            academy.state,
                            academy.city,
                            academy.address,
                            academy.type

                        ].join(
                            " "
                        )
                    );


                const matchesSearch =
                    !normalizedSearch ||
                    searchableText.includes(
                        normalizedSearch
                    );


                const matchesVerification =
                    filters.verification === "all" ||
                    academy.verification ===
                        filters.verification;


                const matchesType =
                    filters.type === "all" ||
                    academy.type ===
                        filters.type;


                const matchesState =
                    filters.state === "all" ||
                    academy.state ===
                        filters.state;


                const matchesVisibility =
                    filters.visibility === "all" ||
                    academy.visibility ===
                        filters.visibility;


                return (
                    matchesSearch &&
                    matchesVerification &&
                    matchesType &&
                    matchesState &&
                    matchesVisibility
                );

            }
        );


    records =
        adminAcademiesSortRecords(
            records,
            filters.sort
        );


    adminAcademiesState.filteredAcademies =
        records;


    if (
        resetPage
    ) {

        adminAcademiesState.currentPage =
            1;

    }


    adminAcademiesClampCurrentPage();


    adminAcademiesRender();

}


function adminAcademiesSortRecords(
    records,
    sortMethod
) {

    const sortedRecords =
        [
            ...records
        ];


    switch (
        sortMethod
    ) {

        case "oldest":

            sortedRecords.sort(
                (
                    firstAcademy,
                    secondAcademy
                ) => new Date(
                    firstAcademy.createdAt
                ) -
                new Date(
                    secondAcademy.createdAt
                )
            );

            break;


        case "name-asc":

            sortedRecords.sort(
                (
                    firstAcademy,
                    secondAcademy
                ) => firstAcademy.name.localeCompare(
                    secondAcademy.name
                )
            );

            break;


        case "name-desc":

            sortedRecords.sort(
                (
                    firstAcademy,
                    secondAcademy
                ) => secondAcademy.name.localeCompare(
                    firstAcademy.name
                )
            );

            break;


        case "players-high":

            sortedRecords.sort(
                (
                    firstAcademy,
                    secondAcademy
                ) => Number(
                    secondAcademy.players
                ) -
                Number(
                    firstAcademy.players
                )
            );

            break;


        case "players-low":

            sortedRecords.sort(
                (
                    firstAcademy,
                    secondAcademy
                ) => Number(
                    firstAcademy.players
                ) -
                Number(
                    secondAcademy.players
                )
            );

            break;


        case "completion-high":

            sortedRecords.sort(
                (
                    firstAcademy,
                    secondAcademy
                ) => Number(
                    secondAcademy.profileCompletion
                ) -
                Number(
                    firstAcademy.profileCompletion
                )
            );

            break;


        case "newest":
        default:

            sortedRecords.sort(
                (
                    firstAcademy,
                    secondAcademy
                ) => new Date(
                    secondAcademy.createdAt
                ) -
                new Date(
                    firstAcademy.createdAt
                )
            );

            break;

    }


    return sortedRecords;

}


/* =========================================================
   FILTER RESET
========================================================= */

function adminAcademiesResetFilters() {

    if (
        adminAcademiesDOM.filterForm
    ) {

        adminAcademiesDOM.filterForm.reset();

    }


    if (
        adminAcademiesDOM.searchInput
    ) {

        adminAcademiesDOM.searchInput.value =
            "";

    }


    if (
        adminAcademiesDOM.verificationFilter
    ) {

        adminAcademiesDOM.verificationFilter.value =
            "all";

    }


    if (
        adminAcademiesDOM.typeFilter
    ) {

        adminAcademiesDOM.typeFilter.value =
            "all";

    }


    if (
        adminAcademiesDOM.stateFilter
    ) {

        adminAcademiesDOM.stateFilter.value =
            "all";

    }


    if (
        adminAcademiesDOM.visibilityFilter
    ) {

        adminAcademiesDOM.visibilityFilter.value =
            "all";

    }


    if (
        adminAcademiesDOM.sortFilter
    ) {

        adminAcademiesDOM.sortFilter.value =
            "newest";

    }


    adminAcademiesState.currentPage =
        1;


    adminAcademiesApplyFilters(
        true
    );


    adminAcademiesShowToast(
        "Filters reset",
        "All academy filters have been cleared.",
        "info"
    );

}

/* =========================================================
   ADMIN ACADEMIES
   FILE: admin-academies.js
   PART 1C
========================================================= */


/* =========================================================
   METRIC RENDERING
========================================================= */

function adminAcademiesRenderMetrics() {

    const totalAcademies =
        adminAcademiesState.academies.length;


    const verifiedAcademies =
        adminAcademiesState.academies.filter(
            (
                academy
            ) => academy.verification === "verified"
        ).length;


    const pendingAcademies =
        adminAcademiesState.academies.filter(
            (
                academy
            ) => academy.verification === "pending"
        ).length;


    const publicAcademies =
        adminAcademiesState.academies.filter(
            (
                academy
            ) => academy.visibility === "public"
        ).length;


    if (
        adminAcademiesDOM.metricTotal
    ) {

        adminAcademiesDOM.metricTotal.textContent =
            adminAcademiesFormatNumber(
                totalAcademies
            );

    }


    if (
        adminAcademiesDOM.metricVerified
    ) {

        adminAcademiesDOM.metricVerified.textContent =
            adminAcademiesFormatNumber(
                verifiedAcademies
            );

    }


    if (
        adminAcademiesDOM.metricPending
    ) {

        adminAcademiesDOM.metricPending.textContent =
            adminAcademiesFormatNumber(
                pendingAcademies
            );

    }


    if (
        adminAcademiesDOM.metricPublic
    ) {

        adminAcademiesDOM.metricPublic.textContent =
            adminAcademiesFormatNumber(
                publicAcademies
            );

    }

}


/* =========================================================
   TABLE ROW GENERATION
========================================================= */

function adminAcademiesCreateTableRow(
    academy
) {

    const updatedDate =
        adminAcademiesFormatDateTime(
            academy.updatedAt
        );


    const isSelected =
        adminAcademiesState.selectedAcademyIds.has(
            academy.id
        );


    const logoMarkup =
        academy.logo
            ? `

                <img
                    src="${adminAcademiesEscapeHTML(academy.logo)}"
                    alt="${adminAcademiesEscapeHTML(academy.name)} logo"
                    loading="lazy"
                    onerror="this.hidden=true; this.nextElementSibling.hidden=false;"
                >

                <span
                    class="admin-academy-logo-placeholder"
                    hidden
                    aria-hidden="true"
                >
                    ${adminAcademiesEscapeHTML(
                        adminAcademiesCreateInitials(
                            academy.name
                        )
                    )}
                </span>

            `
            : `

                <span
                    class="admin-academy-logo-placeholder"
                    aria-hidden="true"
                >
                    ${adminAcademiesEscapeHTML(
                        adminAcademiesCreateInitials(
                            academy.name
                        )
                    )}
                </span>

            `;


    const verificationAction =
        academy.verification === "verified"
            ? ""
            : `

                <button
                    class="admin-academy-action-button verify"
                    type="button"
                    data-academy-action="verify"
                    data-academy-id="${adminAcademiesEscapeHTML(academy.id)}"
                    aria-label="Verify ${adminAcademiesEscapeHTML(academy.name)}"
                    title="Verify academy"
                >

                    <i
                        class="fa-solid fa-circle-check"
                        aria-hidden="true"
                    ></i>

                </button>

            `;


    return `

        <tr data-academy-row="${adminAcademiesEscapeHTML(academy.id)}">

            <td>

                <input
                    class="admin-academy-row-checkbox"
                    type="checkbox"
                    value="${adminAcademiesEscapeHTML(academy.id)}"
                    aria-label="Select ${adminAcademiesEscapeHTML(academy.name)}"
                    ${isSelected ? "checked" : ""}
                >

            </td>


            <td>

                <div class="admin-academy-cell">

                    <div class="admin-academy-logo">

                        ${logoMarkup}

                    </div>


                    <div class="admin-academy-meta">

                        <strong>
                            ${adminAcademiesEscapeHTML(academy.name)}
                        </strong>

                        <small>
                            ${adminAcademiesEscapeHTML(academy.email)}
                        </small>

                    </div>

                </div>

            </td>


            <td>

                <span class="admin-academy-type-badge">

                    ${adminAcademiesEscapeHTML(
                        adminAcademiesFormatLabel(
                            academy.type
                        )
                    )}

                </span>

            </td>


            <td>

                <div class="admin-academy-location">

                    <strong>
                        ${adminAcademiesEscapeHTML(academy.city)}
                    </strong>

                    <span>
                        ${adminAcademiesEscapeHTML(academy.state)}
                    </span>

                </div>

            </td>


            <td>

                <div class="admin-academy-owner">

                    <strong>
                        ${adminAcademiesEscapeHTML(academy.ownerName)}
                    </strong>

                    <span>
                        Established ${adminAcademiesEscapeHTML(
                            academy.establishedYear
                        )}
                    </span>

                </div>

            </td>


            <td>

                <span class="admin-academy-player-count">

                    ${adminAcademiesFormatNumber(academy.players)}

                </span>

            </td>


            <td>

                <span
                    class="admin-academy-status-badge ${adminAcademiesEscapeHTML(
                        academy.verification
                    )}"
                >

                    ${adminAcademiesEscapeHTML(
                        adminAcademiesFormatLabel(
                            academy.verification
                        )
                    )}

                </span>

            </td>


            <td>

                <span
                    class="admin-academy-visibility-badge ${adminAcademiesEscapeHTML(
                        academy.visibility
                    )}"
                >

                    ${adminAcademiesEscapeHTML(
                        adminAcademiesFormatLabel(
                            academy.visibility
                        )
                    )}

                </span>

            </td>


            <td>

                <div class="admin-academy-progress">

                    <div
                        class="admin-academy-progress-bar"
                        role="progressbar"
                        aria-valuemin="0"
                        aria-valuemax="100"
                        aria-valuenow="${adminAcademiesEscapeHTML(
                            academy.profileCompletion
                        )}"
                        aria-label="Profile completion"
                    >

                        <div
                            class="admin-academy-progress-fill"
                            style="width: ${Math.min(
                                100,
                                Math.max(
                                    0,
                                    Number(
                                        academy.profileCompletion
                                    ) || 0
                                )
                            )}%"
                        ></div>

                    </div>

                    <span>
                        ${adminAcademiesEscapeHTML(
                            academy.profileCompletion
                        )}% complete
                    </span>

                </div>

            </td>


            <td>

                <div class="admin-academy-updated-date">

                    <strong>
                        ${adminAcademiesEscapeHTML(updatedDate.date)}
                    </strong>

                    <span>
                        ${adminAcademiesEscapeHTML(updatedDate.time)}
                    </span>

                </div>

            </td>


            <td>

                <div class="admin-academy-action-group">

                    <button
                        class="admin-academy-action-button"
                        type="button"
                        data-academy-action="view"
                        data-academy-id="${adminAcademiesEscapeHTML(academy.id)}"
                        aria-label="View ${adminAcademiesEscapeHTML(academy.name)}"
                        title="View academy"
                    >

                        <i
                            class="fa-solid fa-eye"
                            aria-hidden="true"
                        ></i>

                    </button>


                    <button
                        class="admin-academy-action-button"
                        type="button"
                        data-academy-action="edit"
                        data-academy-id="${adminAcademiesEscapeHTML(academy.id)}"
                        aria-label="Edit ${adminAcademiesEscapeHTML(academy.name)}"
                        title="Edit academy"
                    >

                        <i
                            class="fa-solid fa-pen"
                            aria-hidden="true"
                        ></i>

                    </button>


                    ${verificationAction}


                    <button
                        class="admin-academy-action-button delete"
                        type="button"
                        data-academy-action="delete"
                        data-academy-id="${adminAcademiesEscapeHTML(academy.id)}"
                        aria-label="Delete ${adminAcademiesEscapeHTML(academy.name)}"
                        title="Delete academy"
                    >

                        <i
                            class="fa-solid fa-trash-can"
                            aria-hidden="true"
                        ></i>

                    </button>

                </div>

            </td>

        </tr>

    `;

}


/* =========================================================
   TABLE RENDERING
========================================================= */

function adminAcademiesRenderTable() {

    if (
        !adminAcademiesDOM.tableBody
    ) {

        return;

    }


    const pageRecords =
        adminAcademiesGetVisiblePageRecords();


    if (
        adminAcademiesDOM.table
    ) {

        adminAcademiesDOM.table.hidden =
            adminAcademiesState.loading ||
            pageRecords.length === 0;

    }


    if (
        adminAcademiesDOM.emptyState
    ) {

        adminAcademiesDOM.emptyState.hidden =
            adminAcademiesState.loading ||
            pageRecords.length > 0;

    }


    if (
        pageRecords.length === 0
    ) {

        adminAcademiesDOM.tableBody.innerHTML =
            "";

        return;

    }


    adminAcademiesDOM.tableBody.innerHTML =
        pageRecords
            .map(
                adminAcademiesCreateTableRow
            )
            .join(
                ""
            );

}


/* =========================================================
   PAGINATION RENDERING
========================================================= */

function adminAcademiesCreatePaginationPages() {

    const totalPages =
        adminAcademiesState.totalPages;


    const currentPage =
        adminAcademiesState.currentPage;


    if (
        totalPages <= 7
    ) {

        return Array.from(
            {
                length:
                    totalPages
            },
            (
                _,
                index
            ) => index + 1
        );

    }


    if (
        currentPage <= 4
    ) {

        return [

            1,
            2,
            3,
            4,
            5,
            "ellipsis",
            totalPages

        ];

    }


    if (
        currentPage >= totalPages - 3
    ) {

        return [

            1,
            "ellipsis",
            totalPages - 4,
            totalPages - 3,
            totalPages - 2,
            totalPages - 1,
            totalPages

        ];

    }


    return [

        1,
        "ellipsis",
        currentPage - 1,
        currentPage,
        currentPage + 1,
        "ellipsis",
        totalPages

    ];

}


function adminAcademiesRenderPagination() {

    adminAcademiesClampCurrentPage();


    const totalRecords =
        adminAcademiesState.filteredAcademies.length;


    const startRecord =
        totalRecords === 0
            ? 0
            : (
                adminAcademiesState.currentPage - 1
            ) *
            adminAcademiesState.pageSize +
            1;


    const endRecord =
        Math.min(
            totalRecords,
            adminAcademiesState.currentPage *
            adminAcademiesState.pageSize
        );


    if (
        adminAcademiesDOM.paginationSummary
    ) {

        adminAcademiesDOM.paginationSummary.textContent =
            totalRecords === 0
                ? "No academy records found"
                : `Showing ${startRecord}–${endRecord} of ${totalRecords} academies`;

    }


    if (
        adminAcademiesDOM.previousPageButton
    ) {

        adminAcademiesDOM.previousPageButton.disabled =
            adminAcademiesState.loading ||
            adminAcademiesState.currentPage <= 1;

    }


    if (
        adminAcademiesDOM.nextPageButton
    ) {

        adminAcademiesDOM.nextPageButton.disabled =
            adminAcademiesState.loading ||
            adminAcademiesState.currentPage >=
                adminAcademiesState.totalPages;

    }


    if (
        !adminAcademiesDOM.pagination
    ) {

        return;

    }


    const pageItems =
        adminAcademiesCreatePaginationPages();


    adminAcademiesDOM.pagination.innerHTML =
        pageItems
            .map(
                (
                    page
                ) => {

                    if (
                        page === "ellipsis"
                    ) {

                        return `

                            <span
                                class="admin-academies-pagination-ellipsis"
                                aria-hidden="true"
                            >
                                …
                            </span>

                        `;

                    }


                    return `

                        <button
                            class="admin-academies-page-number ${
                                page ===
                                adminAcademiesState.currentPage
                                    ? "active"
                                    : ""
                            }"
                            type="button"
                            data-academies-page="${page}"
                            aria-label="Go to page ${page}"
                            ${
                                page ===
                                adminAcademiesState.currentPage
                                    ? 'aria-current="page"'
                                    : ""
                            }
                        >
                            ${page}
                        </button>

                    `;

                }
            )
            .join(
                ""
            );

}


/* =========================================================
   SELECTION MANAGEMENT
========================================================= */

function adminAcademiesGetVisibleAcademyIds() {

    return adminAcademiesGetVisiblePageRecords()
        .map(
            (
                academy
            ) => academy.id
        );

}


function adminAcademiesUpdateSelectAllState() {

    if (
        !adminAcademiesDOM.selectAllCheckbox
    ) {

        return;

    }


    const visibleAcademyIds =
        adminAcademiesGetVisibleAcademyIds();


    const selectedVisibleCount =
        visibleAcademyIds.filter(
            (
                academyId
            ) => adminAcademiesState
                .selectedAcademyIds
                .has(
                    academyId
                )
        ).length;


    adminAcademiesDOM.selectAllCheckbox.checked =
        visibleAcademyIds.length > 0 &&
        selectedVisibleCount ===
            visibleAcademyIds.length;


    adminAcademiesDOM.selectAllCheckbox.indeterminate =
        selectedVisibleCount > 0 &&
        selectedVisibleCount <
            visibleAcademyIds.length;


    adminAcademiesDOM.selectAllCheckbox.disabled =
        visibleAcademyIds.length === 0 ||
        adminAcademiesState.loading;

}


function adminAcademiesRenderBulkActions() {

    const selectedCount =
        adminAcademiesState.selectedAcademyIds.size;


    if (
        adminAcademiesDOM.bulkActions
    ) {

        adminAcademiesDOM.bulkActions.hidden =
            selectedCount === 0;

    }


    if (
        adminAcademiesDOM.selectedCount
    ) {

        adminAcademiesDOM.selectedCount.textContent =
            `${selectedCount} ${
                selectedCount === 1
                    ? "academy"
                    : "academies"
            } selected`;

    }


    const hasSelection =
        selectedCount > 0;


    [

        adminAcademiesDOM.bulkVerifyButton,
        adminAcademiesDOM.bulkPublicButton,
        adminAcademiesDOM.bulkHiddenButton,
        adminAcademiesDOM.bulkDeleteButton

    ].forEach(
        (
            button
        ) => {

            if (
                button
            ) {

                button.disabled =
                    !hasSelection ||
                    adminAcademiesState.loading;

            }

        }
    );


    adminAcademiesUpdateSelectAllState();

}


function adminAcademiesToggleAcademySelection(
    academyId,
    shouldSelect
) {

    if (
        shouldSelect
    ) {

        adminAcademiesState
            .selectedAcademyIds
            .add(
                academyId
            );

    } else {

        adminAcademiesState
            .selectedAcademyIds
            .delete(
                academyId
            );

    }


    adminAcademiesRenderBulkActions();

}


function adminAcademiesToggleVisibleSelection(
    shouldSelect
) {

    const visibleAcademyIds =
        adminAcademiesGetVisibleAcademyIds();


    visibleAcademyIds.forEach(
        (
            academyId
        ) => {

            if (
                shouldSelect
            ) {

                adminAcademiesState
                    .selectedAcademyIds
                    .add(
                        academyId
                    );

            } else {

                adminAcademiesState
                    .selectedAcademyIds
                    .delete(
                        academyId
                    );

            }

        }
    );


    adminAcademiesRenderTable();

    adminAcademiesRenderBulkActions();

}


function adminAcademiesClearSelection() {

    adminAcademiesState
        .selectedAcademyIds
        .clear();


    adminAcademiesRenderTable();

    adminAcademiesRenderBulkActions();

}


/* =========================================================
   MAIN RENDER
========================================================= */

function adminAcademiesRender() {

    adminAcademiesRenderMetrics();

    adminAcademiesRenderTable();

    adminAcademiesRenderPagination();

    adminAcademiesRenderBulkActions();

}

/* =========================================================
   ADMIN ACADEMIES
   FILE: admin-academies.js
   PART 1D
========================================================= */


/* =========================================================
   ACADEMY DETAILS RENDERING
========================================================= */

function adminAcademiesRenderDetails(
    academy
) {

    if (
        !adminAcademiesDOM.detailsContent ||
        !academy
    ) {

        return;

    }


    const logoMarkup =
        academy.logo
            ? `

                <img
                    src="${adminAcademiesEscapeHTML(academy.logo)}"
                    alt="${adminAcademiesEscapeHTML(academy.name)} logo"
                    onerror="this.hidden=true; this.nextElementSibling.hidden=false;"
                >

                <span hidden aria-hidden="true">

                    ${adminAcademiesEscapeHTML(
                        adminAcademiesCreateInitials(
                            academy.name
                        )
                    )}

                </span>

            `
            : `

                <span aria-hidden="true">

                    ${adminAcademiesEscapeHTML(
                        adminAcademiesCreateInitials(
                            academy.name
                        )
                    )}

                </span>

            `;


    adminAcademiesDOM.detailsContent.innerHTML = `

        <section class="admin-academy-details-hero">

            <div class="admin-academy-details-logo">

                ${logoMarkup}

            </div>


            <div class="admin-academy-details-heading">

                <h3>
                    ${adminAcademiesEscapeHTML(academy.name)}
                </h3>

                <p>
                    ${adminAcademiesEscapeHTML(academy.address)}
                </p>

            </div>


            <div class="admin-academy-details-badges">

                <span
                    class="admin-academy-status-badge ${adminAcademiesEscapeHTML(
                        academy.verification
                    )}"
                >
                    ${adminAcademiesEscapeHTML(
                        adminAcademiesFormatLabel(
                            academy.verification
                        )
                    )}
                </span>

                <span
                    class="admin-academy-visibility-badge ${adminAcademiesEscapeHTML(
                        academy.visibility
                    )}"
                >
                    ${adminAcademiesEscapeHTML(
                        adminAcademiesFormatLabel(
                            academy.visibility
                        )
                    )}
                </span>

            </div>

        </section>


        <section class="admin-academy-details-grid">

            <article class="admin-academy-details-card">

                <h4>
                    <i
                        class="fa-solid fa-building"
                        aria-hidden="true"
                    ></i>

                    Academy Information
                </h4>

                <dl class="admin-academy-details-list">

                    <div>

                        <dt>
                            Academy Type
                        </dt>

                        <dd>
                            ${adminAcademiesEscapeHTML(
                                adminAcademiesFormatLabel(
                                    academy.type
                                )
                            )}
                        </dd>

                    </div>


                    <div>

                        <dt>
                            Established
                        </dt>

                        <dd>
                            ${adminAcademiesEscapeHTML(
                                academy.establishedYear
                            )}
                        </dd>

                    </div>


                    <div>

                        <dt>
                            Age Groups
                        </dt>

                        <dd>
                            ${adminAcademiesEscapeHTML(
                                academy.ageGroups
                            )}
                        </dd>

                    </div>


                    <div>

                        <dt>
                            Residential
                        </dt>

                        <dd>
                            ${adminAcademiesEscapeHTML(
                                adminAcademiesFormatLabel(
                                    academy.residential
                                )
                            )}
                        </dd>

                    </div>

                </dl>

            </article>


            <article class="admin-academy-details-card">

                <h4>
                    <i
                        class="fa-solid fa-address-card"
                        aria-hidden="true"
                    ></i>

                    Contact Details
                </h4>

                <dl class="admin-academy-details-list">

                    <div>

                        <dt>
                            Email
                        </dt>

                        <dd>
                            ${adminAcademiesEscapeHTML(academy.email)}
                        </dd>

                    </div>


                    <div>

                        <dt>
                            Phone
                        </dt>

                        <dd>
                            ${adminAcademiesEscapeHTML(academy.phone)}
                        </dd>

                    </div>


                    <div>

                        <dt>
                            City
                        </dt>

                        <dd>
                            ${adminAcademiesEscapeHTML(academy.city)}
                        </dd>

                    </div>


                    <div>

                        <dt>
                            State
                        </dt>

                        <dd>
                            ${adminAcademiesEscapeHTML(academy.state)}
                        </dd>

                    </div>

                </dl>

            </article>


            <article class="admin-academy-details-card">

                <h4>
                    <i
                        class="fa-solid fa-user-tie"
                        aria-hidden="true"
                    ></i>

                    Ownership
                </h4>

                <dl class="admin-academy-details-list">

                    <div>

                        <dt>
                            Owner / Director
                        </dt>

                        <dd>
                            ${adminAcademiesEscapeHTML(
                                academy.ownerName
                            )}
                        </dd>

                    </div>


                    <div>

                        <dt>
                            Created
                        </dt>

                        <dd>
                            ${adminAcademiesEscapeHTML(
                                adminAcademiesFormatDate(
                                    academy.createdAt
                                )
                            )}
                        </dd>

                    </div>


                    <div>

                        <dt>
                            Last Updated
                        </dt>

                        <dd>
                            ${adminAcademiesEscapeHTML(
                                adminAcademiesFormatDate(
                                    academy.updatedAt
                                )
                            )}
                        </dd>

                    </div>


                    <div>

                        <dt>
                            Completion
                        </dt>

                        <dd>
                            ${adminAcademiesEscapeHTML(
                                academy.profileCompletion
                            )}%
                        </dd>

                    </div>

                </dl>

            </article>


            <article class="admin-academy-details-card full-width">

                <h4>
                    <i
                        class="fa-solid fa-chart-column"
                        aria-hidden="true"
                    ></i>

                    Academy Statistics
                </h4>

                <div class="admin-academy-stat-grid">

                    <div class="admin-academy-stat-item">

                        <strong>
                            ${adminAcademiesFormatNumber(academy.players)}
                        </strong>

                        <span>
                            Players
                        </span>

                    </div>


                    <div class="admin-academy-stat-item">

                        <strong>
                            ${adminAcademiesFormatNumber(academy.coaches)}
                        </strong>

                        <span>
                            Coaches
                        </span>

                    </div>


                    <div class="admin-academy-stat-item">

                        <strong>
                            ${adminAcademiesFormatNumber(academy.graduates)}
                        </strong>

                        <span>
                            Graduates
                        </span>

                    </div>


                    <div class="admin-academy-stat-item">

                        <strong>
                            ${adminAcademiesFormatNumber(academy.trophies)}
                        </strong>

                        <span>
                            Trophies
                        </span>

                    </div>

                </div>

            </article>


            <article class="admin-academy-details-card full-width">

                <h4>
                    <i
                        class="fa-solid fa-align-left"
                        aria-hidden="true"
                    ></i>

                    Description
                </h4>

                <p class="admin-academy-details-text">

                    ${adminAcademiesEscapeHTML(
                        academy.description ||
                        "No academy description has been added."
                    )}

                </p>

            </article>


            <article class="admin-academy-details-card full-width">

                <h4>
                    <i
                        class="fa-solid fa-note-sticky"
                        aria-hidden="true"
                    ></i>

                    Administrative Note
                </h4>

                <p class="admin-academy-details-text">

                    ${adminAcademiesEscapeHTML(
                        academy.note ||
                        "No administrative note has been added."
                    )}

                </p>

            </article>

        </section>

    `;

}


/* =========================================================
   ADD ACADEMY FORM DATA
========================================================= */

function adminAcademiesReadFormData(
    form
) {

    const formData =
        new FormData(
            form
        );


    return {

        name:
            String(
                formData.get(
                    "name"
                ) ?? ""
            ).trim(),

        email:
            String(
                formData.get(
                    "email"
                ) ?? ""
            ).trim(),

        phone:
            String(
                formData.get(
                    "phone"
                ) ?? ""
            ).trim(),

        type:
            String(
                formData.get(
                    "type"
                ) ?? ""
            ).trim(),

        establishedYear:
            Number(
                formData.get(
                    "establishedYear"
                )
            ) || "",

        ownerName:
            String(
                formData.get(
                    "ownerName"
                ) ?? ""
            ).trim(),

        state:
            String(
                formData.get(
                    "state"
                ) ?? ""
            ).trim(),

        city:
            String(
                formData.get(
                    "city"
                ) ?? ""
            ).trim(),

        address:
            String(
                formData.get(
                    "address"
                ) ?? ""
            ).trim(),

        players:
            Number(
                formData.get(
                    "players"
                )
            ) || 0,

        coaches:
            Number(
                formData.get(
                    "coaches"
                )
            ) || 0,

        graduates:
            Number(
                formData.get(
                    "graduates"
                )
            ) || 0,

        trophies:
            Number(
                formData.get(
                    "trophies"
                )
            ) || 0,

        ageGroups:
            String(
                formData.get(
                    "ageGroups"
                ) ?? ""
            ).trim(),

        residential:
            String(
                formData.get(
                    "residential"
                ) ?? ""
            ).trim(),

        verification:
            String(
                formData.get(
                    "verification"
                ) ?? "pending"
            ).trim(),

        visibility:
            String(
                formData.get(
                    "visibility"
                ) ?? "restricted"
            ).trim(),

        profileCompletion:
            Math.min(
                100,
                Math.max(
                    0,
                    Number(
                        formData.get(
                            "profileCompletion"
                        )
                    ) || 0
                )
            ),

        description:
            String(
                formData.get(
                    "description"
                ) ?? ""
            ).trim(),

        note:
            String(
                formData.get(
                    "note"
                ) ?? ""
            ).trim(),

        logo:
            String(
                formData.get(
                    "logo"
                ) ?? ""
            ).trim()

    };

}


/* =========================================================
   FORM VALIDATION
========================================================= */

function adminAcademiesValidateForm(
    form,
    mode
) {

    adminAcademiesClearFormErrors(
        form
    );


    const data =
        adminAcademiesReadFormData(
            form
        );


    const errorAttribute =
        mode === "edit"
            ? "data-edit-error-for"
            : "data-add-error-for";


    let firstInvalidField =
        null;


    const setError =
        (
            fieldName,
            message
        ) => {

            const field =
                form.elements.namedItem(
                    fieldName
                );


            if (
                !firstInvalidField
            ) {

                firstInvalidField =
                    field;

            }


            adminAcademiesSetFieldError(
                field,
                message,
                `small[${errorAttribute}="${fieldName}"]`
            );

        };


    if (
        data.name.length < 3
    ) {

        setError(
            "name",
            "Enter an academy name with at least 3 characters."
        );

    }


    if (
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
            data.email
        )
    ) {

        setError(
            "email",
            "Enter a valid academy email address."
        );

    }


    if (
        data.phone.length < 8
    ) {

        setError(
            "phone",
            "Enter a valid contact number."
        );

    }


    if (
        !data.type
    ) {

        setError(
            "type",
            "Select an academy type."
        );

    }


    const currentYear =
        new Date().getFullYear();


    if (
        !Number.isInteger(
            data.establishedYear
        ) ||
        data.establishedYear < 1900 ||
        data.establishedYear > currentYear
    ) {

        setError(
            "establishedYear",
            `Enter a year between 1900 and ${currentYear}.`
        );

    }


    if (
        data.ownerName.length < 2
    ) {

        setError(
            "ownerName",
            "Enter the academy owner or director name."
        );

    }


    if (
        data.state.length < 2
    ) {

        setError(
            "state",
            "Enter the academy state."
        );

    }


    if (
        data.city.length < 2
    ) {

        setError(
            "city",
            "Enter the academy city."
        );

    }


    if (
        data.address.length < 5
    ) {

        setError(
            "address",
            "Enter the complete academy address."
        );

    }


    if (
        !data.ageGroups
    ) {

        setError(
            "ageGroups",
            "Enter the academy age groups."
        );

    }


    if (
        !data.residential
    ) {

        setError(
            "residential",
            "Select the residential availability."
        );

    }


    if (
        data.description.length < 20
    ) {

        setError(
            "description",
            "Enter a description with at least 20 characters."
        );

    }


    if (
        firstInvalidField
    ) {

        firstInvalidField.focus();


        return {

            valid:
                false,

            data

        };

    }


    return {

        valid:
            true,

        data

    };

}


/* =========================================================
   CREATE ACADEMY
========================================================= */

async function adminAcademiesHandleCreate(
    event
) {

    event.preventDefault();


    const form =
        event.currentTarget;


    const validation =
        adminAcademiesValidateForm(
            form,
            "add"
        );


    if (
        !validation.valid
    ) {

        adminAcademiesShowToast(
            "Check academy details",
            "Please correct the highlighted fields.",
            "warning"
        );

        return;

    }


    const submitButton =
        form.querySelector(
            "[type='submit']"
        );


    adminAcademiesSetButtonLoading(
        submitButton,
        true,
        "Adding Academy"
    );


    try {

        const createdAcademy =
            await adminAcademiesAPI.createAcademy({

                ...validation.data,

                id:
                    adminAcademiesGenerateId(),

                createdAt:
                    new Date().toISOString(),

                updatedAt:
                    new Date().toISOString()

            });


        adminAcademiesState.academies.unshift(
            createdAcademy
        );


        adminAcademiesPopulateStateFilter();

        adminAcademiesApplyFilters(
            true
        );


        form.reset();


        adminAcademiesClearFormErrors(
            form
        );


        adminAcademiesCloseModal(
            adminAcademiesDOM.addModal
        );


        adminAcademiesShowToast(
            "Academy added",
            `${createdAcademy.name} has been added successfully.`,
            "success"
        );

    } catch (
        error
    ) {

        console.error(
            error
        );


        adminAcademiesShowToast(
            "Unable to add academy",
            error.message ||
            "An unexpected error occurred.",
            "error"
        );

    } finally {

        adminAcademiesSetButtonLoading(
            submitButton,
            false
        );

    }

}


/* =========================================================
   EDIT FORM POPULATION
========================================================= */

function adminAcademiesPopulateEditForm(
    academy
) {

    if (
        !adminAcademiesDOM.editForm ||
        !academy
    ) {

        return;

    }


    const form =
        adminAcademiesDOM.editForm;


    const values = {

        name:
            academy.name,

        email:
            academy.email,

        phone:
            academy.phone,

        type:
            academy.type,

        establishedYear:
            academy.establishedYear,

        ownerName:
            academy.ownerName,

        state:
            academy.state,

        city:
            academy.city,

        address:
            academy.address,

        players:
            academy.players,

        coaches:
            academy.coaches,

        graduates:
            academy.graduates,

        trophies:
            academy.trophies,

        ageGroups:
            academy.ageGroups,

        residential:
            academy.residential,

        verification:
            academy.verification,

        visibility:
            academy.visibility,

        profileCompletion:
            academy.profileCompletion,

        description:
            academy.description,

        note:
            academy.note,

        logo:
            academy.logo

    };


    Object.entries(
        values
    ).forEach(
        (
            [
                fieldName,
                fieldValue
            ]
        ) => {

            const field =
                form.elements.namedItem(
                    fieldName
                );


            if (
                field
            ) {

                field.value =
                    fieldValue ?? "";

            }

        }
    );


    if (
        adminAcademiesDOM.editAcademyId
    ) {

        adminAcademiesDOM.editAcademyId.value =
            academy.id;

    }


    adminAcademiesClearFormErrors(
        form
    );

}


/* =========================================================
   UPDATE ACADEMY
========================================================= */

async function adminAcademiesHandleUpdate(
    event
) {

    event.preventDefault();


    const form =
        event.currentTarget;


    const academyId =
        adminAcademiesDOM.editAcademyId?.value ||
        adminAcademiesState.activeAcademyId;


    const existingAcademy =
        adminAcademiesGetAcademyById(
            academyId
        );


    if (
        !existingAcademy
    ) {

        adminAcademiesShowToast(
            "Academy not found",
            "The selected academy record is unavailable.",
            "error"
        );

        return;

    }


    const validation =
        adminAcademiesValidateForm(
            form,
            "edit"
        );


    if (
        !validation.valid
    ) {

        adminAcademiesShowToast(
            "Check academy details",
            "Please correct the highlighted fields.",
            "warning"
        );

        return;

    }


    const submitButton =
        form.querySelector(
            "[type='submit']"
        );


    adminAcademiesSetButtonLoading(
        submitButton,
        true,
        "Saving Changes"
    );


    try {

        const updatedAcademy =
            await adminAcademiesAPI.updateAcademy(
                academyId,
                {

                    ...existingAcademy,

                    ...validation.data,

                    createdAt:
                        existingAcademy.createdAt,

                    updatedAt:
                        new Date().toISOString()

                }
            );


        adminAcademiesState.academies =
            adminAcademiesState.academies.map(
                (
                    academy
                ) => academy.id === academyId
                    ? {

                        ...existingAcademy,
                        ...updatedAcademy

                    }
                    : academy
            );


        adminAcademiesPopulateStateFilter();

        adminAcademiesApplyFilters(
            false
        );


        adminAcademiesCloseModal(
            adminAcademiesDOM.editModal
        );


        adminAcademiesShowToast(
            "Academy updated",
            `${updatedAcademy.name} has been updated successfully.`,
            "success"
        );

    } catch (
        error
    ) {

        console.error(
            error
        );


        adminAcademiesShowToast(
            "Unable to update academy",
            error.message ||
            "An unexpected error occurred.",
            "error"
        );

    } finally {

        adminAcademiesSetButtonLoading(
            submitButton,
            false
        );

    }

}

/* =========================================================
   ADMIN ACADEMIES
   FILE: admin-academies.js
   PART 1E
========================================================= */


/* =========================================================
   OPEN ACADEMY ACTIONS
========================================================= */

function adminAcademiesOpenDetails(
    academyId
) {

    const academy =
        adminAcademiesGetAcademyById(
            academyId
        );


    if (
        !academy
    ) {

        adminAcademiesShowToast(
            "Academy unavailable",
            "The selected academy record could not be found.",
            "error"
        );

        return;

    }


    adminAcademiesState.activeAcademyId =
        academyId;


    adminAcademiesRenderDetails(
        academy
    );


    adminAcademiesOpenModal(
        adminAcademiesDOM.viewModal
    );

}


function adminAcademiesOpenEdit(
    academyId
) {

    const academy =
        adminAcademiesGetAcademyById(
            academyId
        );


    if (
        !academy
    ) {

        adminAcademiesShowToast(
            "Academy unavailable",
            "The selected academy record could not be found.",
            "error"
        );

        return;

    }


    adminAcademiesState.activeAcademyId =
        academyId;


    adminAcademiesPopulateEditForm(
        academy
    );


    adminAcademiesOpenModal(
        adminAcademiesDOM.editModal
    );

}


function adminAcademiesOpenVerify(
    academyId
) {

    const academy =
        adminAcademiesGetAcademyById(
            academyId
        );


    if (
        !academy
    ) {

        adminAcademiesShowToast(
            "Academy unavailable",
            "The selected academy record could not be found.",
            "error"
        );

        return;

    }


    adminAcademiesState.activeAcademyId =
        academyId;


    if (
        adminAcademiesDOM.verifyAcademyName
    ) {

        adminAcademiesDOM.verifyAcademyName.textContent =
            academy.name;

    }


    adminAcademiesOpenModal(
        adminAcademiesDOM.verifyModal
    );

}


function adminAcademiesOpenDelete(
    academyId
) {

    const academy =
        adminAcademiesGetAcademyById(
            academyId
        );


    if (
        !academy
    ) {

        adminAcademiesShowToast(
            "Academy unavailable",
            "The selected academy record could not be found.",
            "error"
        );

        return;

    }


    adminAcademiesState.activeAcademyId =
        academyId;


    if (
        adminAcademiesDOM.deleteAcademyId
    ) {

        adminAcademiesDOM.deleteAcademyId.value =
            academyId;

    }


    if (
        adminAcademiesDOM.deleteAcademyName
    ) {

        adminAcademiesDOM.deleteAcademyName.textContent =
            academy.name;

    }


    if (
        adminAcademiesDOM.deleteConfirmationInput
    ) {

        adminAcademiesDOM.deleteConfirmationInput.value =
            "";

        adminAcademiesDOM.deleteConfirmationInput.removeAttribute(
            "aria-invalid"
        );

    }


    adminAcademiesClearFormErrors(
        adminAcademiesDOM.deleteForm
    );


    adminAcademiesOpenModal(
        adminAcademiesDOM.deleteModal
    );

}


/* =========================================================
   VERIFY ACADEMY
========================================================= */

async function adminAcademiesHandleVerify() {

    const academyId =
        adminAcademiesState.activeAcademyId;


    const academy =
        adminAcademiesGetAcademyById(
            academyId
        );


    if (
        !academy
    ) {

        adminAcademiesShowToast(
            "Academy unavailable",
            "The selected academy record could not be found.",
            "error"
        );

        return;

    }


    adminAcademiesSetButtonLoading(
        adminAcademiesDOM.confirmVerifyButton,
        true,
        "Verifying"
    );


    try {

        await adminAcademiesAPI.verifyAcademy(
            academyId
        );


        academy.verification =
            "verified";


        academy.updatedAt =
            new Date().toISOString();


        adminAcademiesApplyFilters(
            false
        );


        adminAcademiesCloseModal(
            adminAcademiesDOM.verifyModal
        );


        adminAcademiesShowToast(
            "Academy verified",
            `${academy.name} is now marked as verified.`,
            "success"
        );

    } catch (
        error
    ) {

        console.error(
            error
        );


        adminAcademiesShowToast(
            "Verification failed",
            error.message ||
            "The academy could not be verified.",
            "error"
        );

    } finally {

        adminAcademiesSetButtonLoading(
            adminAcademiesDOM.confirmVerifyButton,
            false
        );

    }

}


/* =========================================================
   DELETE ACADEMY
========================================================= */

async function adminAcademiesHandleDelete(
    event
) {

    event.preventDefault();


    const academyId =
        adminAcademiesDOM.deleteAcademyId?.value ||
        adminAcademiesState.activeAcademyId;


    const academy =
        adminAcademiesGetAcademyById(
            academyId
        );


    if (
        !academy
    ) {

        adminAcademiesShowToast(
            "Academy unavailable",
            "The selected academy record could not be found.",
            "error"
        );

        return;

    }


    const confirmationValue =
        adminAcademiesDOM.deleteConfirmationInput?.value
            .trim()
            .toLowerCase() ??
        "";


    if (
        confirmationValue !== "delete"
    ) {

        adminAcademiesSetFieldError(
            adminAcademiesDOM.deleteConfirmationInput,
            "Type DELETE to confirm this action.",
            "small[data-delete-academy-error-for='confirmation']"
        );


        adminAcademiesDOM.deleteConfirmationInput?.focus();


        return;

    }


    const submitButton =
        adminAcademiesDOM.deleteForm?.querySelector(
            "[type='submit']"
        );


    adminAcademiesSetButtonLoading(
        submitButton,
        true,
        "Deleting"
    );


    try {

        await adminAcademiesAPI.deleteAcademy(
            academyId
        );


        adminAcademiesState.academies =
            adminAcademiesState.academies.filter(
                (
                    academyRecord
                ) => academyRecord.id !== academyId
            );


        adminAcademiesState
            .selectedAcademyIds
            .delete(
                academyId
            );


        adminAcademiesPopulateStateFilter();

        adminAcademiesApplyFilters(
            false
        );


        adminAcademiesCloseModal(
            adminAcademiesDOM.deleteModal
        );


        adminAcademiesShowToast(
            "Academy deleted",
            `${academy.name} has been removed.`,
            "success"
        );

    } catch (
        error
    ) {

        console.error(
            error
        );


        adminAcademiesShowToast(
            "Unable to delete academy",
            error.message ||
            "The academy could not be deleted.",
            "error"
        );

    } finally {

        adminAcademiesSetButtonLoading(
            submitButton,
            false
        );

    }

}


/* =========================================================
   BULK ACTIONS
========================================================= */

async function adminAcademiesHandleBulkVerify() {

    const selectedIds =
        Array.from(
            adminAcademiesState.selectedAcademyIds
        );


    if (
        selectedIds.length === 0
    ) {

        return;

    }


    adminAcademiesSetButtonLoading(
        adminAcademiesDOM.bulkVerifyButton,
        true,
        "Verifying"
    );


    try {

        if (
            !ADMIN_ACADEMIES_CONFIG.USE_MOCK_DATA
        ) {

            const response =
                await fetch(
                    `${ADMIN_ACADEMIES_CONFIG.API_BASE_URL}${ADMIN_ACADEMIES_CONFIG.ENDPOINTS.bulkVerify}`,
                    {

                        method:
                            "PATCH",

                        credentials:
                            "include",

                        headers: {

                            "Content-Type":
                                "application/json",

                            Accept:
                                "application/json"

                        },

                        body:
                            JSON.stringify({

                                academyIds:
                                    selectedIds

                            })

                    }
                );


            if (
                !response.ok
            ) {

                throw new Error(
                    "Unable to verify selected academies."
                );

            }

        } else {

            await adminAcademiesDelay(
                650
            );

        }


        adminAcademiesState.academies.forEach(
            (
                academy
            ) => {

                if (
                    adminAcademiesState
                        .selectedAcademyIds
                        .has(
                            academy.id
                        )
                ) {

                    academy.verification =
                        "verified";

                    academy.updatedAt =
                        new Date().toISOString();

                }

            }
        );


        adminAcademiesClearSelection();

        adminAcademiesApplyFilters(
            false
        );


        adminAcademiesShowToast(
            "Academies verified",
            `${selectedIds.length} selected academies were verified.`,
            "success"
        );

    } catch (
        error
    ) {

        console.error(
            error
        );


        adminAcademiesShowToast(
            "Bulk verification failed",
            error.message ||
            "The selected academies could not be verified.",
            "error"
        );

    } finally {

        adminAcademiesSetButtonLoading(
            adminAcademiesDOM.bulkVerifyButton,
            false
        );

    }

}


async function adminAcademiesHandleBulkVisibility(
    visibility
) {

    const selectedIds =
        Array.from(
            adminAcademiesState.selectedAcademyIds
        );


    if (
        selectedIds.length === 0
    ) {

        return;

    }


    const activeButton =
        visibility === "public"
            ? adminAcademiesDOM.bulkPublicButton
            : adminAcademiesDOM.bulkHiddenButton;


    adminAcademiesSetButtonLoading(
        activeButton,
        true,
        "Updating"
    );


    try {

        if (
            !ADMIN_ACADEMIES_CONFIG.USE_MOCK_DATA
        ) {

            const response =
                await fetch(
                    `${ADMIN_ACADEMIES_CONFIG.API_BASE_URL}${ADMIN_ACADEMIES_CONFIG.ENDPOINTS.bulkVisibility}`,
                    {

                        method:
                            "PATCH",

                        credentials:
                            "include",

                        headers: {

                            "Content-Type":
                                "application/json",

                            Accept:
                                "application/json"

                        },

                        body:
                            JSON.stringify({

                                academyIds:
                                    selectedIds,

                                visibility

                            })

                    }
                );


            if (
                !response.ok
            ) {

                throw new Error(
                    "Unable to update academy visibility."
                );

            }

        } else {

            await adminAcademiesDelay(
                600
            );

        }


        adminAcademiesState.academies.forEach(
            (
                academy
            ) => {

                if (
                    adminAcademiesState
                        .selectedAcademyIds
                        .has(
                            academy.id
                        )
                ) {

                    academy.visibility =
                        visibility;

                    academy.updatedAt =
                        new Date().toISOString();

                }

            }
        );


        adminAcademiesClearSelection();

        adminAcademiesApplyFilters(
            false
        );


        adminAcademiesShowToast(
            "Visibility updated",
            `${selectedIds.length} academies are now ${visibility}.`,
            "success"
        );

    } catch (
        error
    ) {

        console.error(
            error
        );


        adminAcademiesShowToast(
            "Visibility update failed",
            error.message ||
            "The selected academies could not be updated.",
            "error"
        );

    } finally {

        adminAcademiesSetButtonLoading(
            activeButton,
            false
        );

    }

}


async function adminAcademiesHandleBulkDelete() {

    const selectedIds =
        Array.from(
            adminAcademiesState.selectedAcademyIds
        );


    if (
        selectedIds.length === 0
    ) {

        return;

    }


    const confirmed =
        window.confirm(
            `Delete ${selectedIds.length} selected academies? This action cannot be undone.`
        );


    if (
        !confirmed
    ) {

        return;

    }


    adminAcademiesSetButtonLoading(
        adminAcademiesDOM.bulkDeleteButton,
        true,
        "Deleting"
    );


    try {

        if (
            !ADMIN_ACADEMIES_CONFIG.USE_MOCK_DATA
        ) {

            const response =
                await fetch(
                    `${ADMIN_ACADEMIES_CONFIG.API_BASE_URL}${ADMIN_ACADEMIES_CONFIG.ENDPOINTS.bulkDelete}`,
                    {

                        method:
                            "DELETE",

                        credentials:
                            "include",

                        headers: {

                            "Content-Type":
                                "application/json",

                            Accept:
                                "application/json"

                        },

                        body:
                            JSON.stringify({

                                academyIds:
                                    selectedIds

                            })

                    }
                );


            if (
                !response.ok
            ) {

                throw new Error(
                    "Unable to delete selected academies."
                );

            }

        } else {

            await adminAcademiesDelay(
                700
            );

        }


        adminAcademiesState.academies =
            adminAcademiesState.academies.filter(
                (
                    academy
                ) => !adminAcademiesState
                    .selectedAcademyIds
                    .has(
                        academy.id
                    )
            );


        adminAcademiesClearSelection();

        adminAcademiesPopulateStateFilter();

        adminAcademiesApplyFilters(
            false
        );


        adminAcademiesShowToast(
            "Academies deleted",
            `${selectedIds.length} selected academies were removed.`,
            "success"
        );

    } catch (
        error
    ) {

        console.error(
            error
        );


        adminAcademiesShowToast(
            "Bulk delete failed",
            error.message ||
            "The selected academies could not be deleted.",
            "error"
        );

    } finally {

        adminAcademiesSetButtonLoading(
            adminAcademiesDOM.bulkDeleteButton,
            false
        );

    }

}

/* =========================================================
   ADMIN ACADEMIES
   FILE: admin-academies.js
   PART 1F
========================================================= */


/* =========================================================
   EXPORT HELPERS
========================================================= */

function adminAcademiesConvertToCSV(
    academies
) {

    const headers = [

        "Academy ID",
        "Academy Name",
        "Email",
        "Phone",
        "Type",
        "Established Year",
        "Owner / Director",
        "State",
        "City",
        "Address",
        "Players",
        "Coaches",
        "Graduates",
        "Trophies",
        "Age Groups",
        "Residential",
        "Verification",
        "Visibility",
        "Profile Completion",
        "Description",
        "Administrative Note",
        "Created At",
        "Updated At"

    ];


    const rows =
        academies.map(
            (
                academy
            ) => [

                academy.id,
                academy.name,
                academy.email,
                academy.phone,
                adminAcademiesFormatLabel(
                    academy.type
                ),
                academy.establishedYear,
                academy.ownerName,
                academy.state,
                academy.city,
                academy.address,
                academy.players,
                academy.coaches,
                academy.graduates,
                academy.trophies,
                academy.ageGroups,
                adminAcademiesFormatLabel(
                    academy.residential
                ),
                adminAcademiesFormatLabel(
                    academy.verification
                ),
                adminAcademiesFormatLabel(
                    academy.visibility
                ),
                `${academy.profileCompletion}%`,
                academy.description,
                academy.note,
                academy.createdAt,
                academy.updatedAt

            ]
        );


    const escapeCSVValue =
        (
            value
        ) => {

            const stringValue =
                String(
                    value ?? ""
                );


            return `"${stringValue.replaceAll(
                "\"",
                "\"\""
            )}"`;

        };


    return [

        headers.map(
            escapeCSVValue
        ).join(
            ","
        ),

        ...rows.map(
            (
                row
            ) => row.map(
                escapeCSVValue
            ).join(
                ","
            )
        )

    ].join(
        "\n"
    );

}


function adminAcademiesDownloadFile(
    content,
    filename,
    mimeType
) {

    const blob =
        new Blob(
            [
                content
            ],
            {

                type:
                    mimeType

            }
        );


    const downloadURL =
        URL.createObjectURL(
            blob
        );


    const link =
        document.createElement(
            "a"
        );


    link.href =
        downloadURL;


    link.download =
        filename;


    link.hidden =
        true;


    document.body.append(
        link
    );


    link.click();


    link.remove();


    window.setTimeout(
        () => {

            URL.revokeObjectURL(
                downloadURL
            );

        },
        1000
    );

}


function adminAcademiesGetExportRecords(
    scope
) {

    switch (
        scope
    ) {

        case "selected":

            return adminAcademiesState.academies.filter(
                (
                    academy
                ) => adminAcademiesState
                    .selectedAcademyIds
                    .has(
                        academy.id
                    )
            );


        case "filtered":

            return [

                ...adminAcademiesState.filteredAcademies

            ];


        case "all":
        default:

            return [

                ...adminAcademiesState.academies

            ];

    }

}


/* =========================================================
   EXPORT ACADEMIES
========================================================= */

async function adminAcademiesHandleExport(
    event
) {

    event.preventDefault();


    const form =
        event.currentTarget;


    const formData =
        new FormData(
            form
        );


    const format =
        String(
            formData.get(
                "format"
            ) ??
            adminAcademiesDOM.exportFormat?.value ??
            "csv"
        )
            .trim()
            .toLowerCase();


    const scope =
        String(
            formData.get(
                "scope"
            ) ??
            "all"
        )
            .trim()
            .toLowerCase();


    const exportRecords =
        adminAcademiesGetExportRecords(
            scope
        );


    if (
        exportRecords.length === 0
    ) {

        adminAcademiesShowToast(
            "Nothing to export",
            "No academy records match the selected export scope.",
            "warning"
        );

        return;

    }


    const submitButton =
        form.querySelector(
            "[type='submit']"
        );


    adminAcademiesSetButtonLoading(
        submitButton,
        true,
        "Preparing Export"
    );


    try {

        const dateStamp =
            new Date()
                .toISOString()
                .slice(
                    0,
                    10
                );


        if (
            ADMIN_ACADEMIES_CONFIG.USE_MOCK_DATA
        ) {

            await adminAcademiesDelay(
                550
            );


            if (
                format === "json"
            ) {

                adminAcademiesDownloadFile(
                    JSON.stringify(
                        exportRecords,
                        null,
                        2
                    ),
                    `admin-academies-${dateStamp}.json`,
                    "application/json;charset=utf-8"
                );

            } else {

                const csvContent =
                    `\uFEFF${adminAcademiesConvertToCSV(
                        exportRecords
                    )}`;


                adminAcademiesDownloadFile(
                    csvContent,
                    `admin-academies-${dateStamp}.csv`,
                    "text/csv;charset=utf-8"
                );

            }

        } else {

            const response =
                await fetch(
                    `${ADMIN_ACADEMIES_CONFIG.API_BASE_URL}${ADMIN_ACADEMIES_CONFIG.ENDPOINTS.export}`,
                    {

                        method:
                            "POST",

                        credentials:
                            "include",

                        headers: {

                            "Content-Type":
                                "application/json",

                            Accept:
                                "application/octet-stream"

                        },

                        body:
                            JSON.stringify({

                                academyIds:
                                    exportRecords.map(
                                        (
                                            academy
                                        ) => academy.id
                                    ),

                                format,

                                scope

                            })

                    }
                );


            if (
                !response.ok
            ) {

                throw new Error(
                    "Unable to export academy records."
                );

            }


            const exportedBlob =
                await response.blob();


            const downloadURL =
                URL.createObjectURL(
                    exportedBlob
                );


            const link =
                document.createElement(
                    "a"
                );


            link.href =
                downloadURL;


            link.download =
                `admin-academies-${dateStamp}.${format}`;


            document.body.append(
                link
            );


            link.click();


            link.remove();


            window.setTimeout(
                () => {

                    URL.revokeObjectURL(
                        downloadURL
                    );

                },
                1000
            );

        }


        adminAcademiesCloseModal(
            adminAcademiesDOM.exportModal
        );


        adminAcademiesShowToast(
            "Export ready",
            `${exportRecords.length} academy records were exported successfully.`,
            "success"
        );

    } catch (
        error
    ) {

        console.error(
            error
        );


        adminAcademiesShowToast(
            "Export failed",
            error.message ||
            "The academy export could not be completed.",
            "error"
        );

    } finally {

        adminAcademiesSetButtonLoading(
            submitButton,
            false
        );

    }

}


/* =========================================================
   LOAD ACADEMIES
========================================================= */

async function adminAcademiesLoadData(
    showRefreshMessage = false
) {

    adminAcademiesSetPageLoading(
        true
    );


    if (
        showRefreshMessage
    ) {

        adminAcademiesSetButtonLoading(
            adminAcademiesDOM.refreshAcademiesButton,
            true,
            "Refreshing"
        );

    }


    try {

        const response =
            await adminAcademiesAPI.getAcademies();


        const academies =
            Array.isArray(
                response
            )
                ? response
                : Array.isArray(
                    response?.data
                )
                    ? response.data
                    : Array.isArray(
                        response?.academies
                    )
                        ? response.academies
                        : [];


        adminAcademiesState.academies =
            adminAcademiesCloneData(
                academies
            );


        adminAcademiesState
            .selectedAcademyIds
            .clear();


        adminAcademiesPopulateStateFilter();

        adminAcademiesApplyFilters(
            true
        );


        if (
            showRefreshMessage
        ) {

            adminAcademiesShowToast(
                "Academies refreshed",
                "The latest academy records have been loaded.",
                "success"
            );

        }

    } catch (
        error
    ) {

        console.error(
            error
        );


        adminAcademiesState.academies =
            [];


        adminAcademiesState.filteredAcademies =
            [];


        adminAcademiesRender();


        adminAcademiesShowToast(
            "Unable to load academies",
            error.message ||
            "Academy records could not be loaded.",
            "error"
        );

    } finally {

        adminAcademiesSetPageLoading(
            false
        );


        adminAcademiesSetButtonLoading(
            adminAcademiesDOM.refreshAcademiesButton,
            false
        );


        adminAcademiesRender();

    }

}


/* =========================================================
   TABLE INTERACTIONS
========================================================= */

function adminAcademiesHandleTableClick(
    event
) {

    const actionButton =
        event.target.closest(
            "[data-academy-action]"
        );


    if (
        !actionButton
    ) {

        return;

    }


    const academyId =
        actionButton.dataset.academyId;


    const academyAction =
        actionButton.dataset.academyAction;


    if (
        !academyId ||
        !academyAction
    ) {

        return;

    }


    switch (
        academyAction
    ) {

        case "view":

            adminAcademiesOpenDetails(
                academyId
            );

            break;


        case "edit":

            adminAcademiesOpenEdit(
                academyId
            );

            break;


        case "verify":

            adminAcademiesOpenVerify(
                academyId
            );

            break;


        case "delete":

            adminAcademiesOpenDelete(
                academyId
            );

            break;


        default:

            break;

    }

}


function adminAcademiesHandleTableChange(
    event
) {

    const checkbox =
        event.target.closest(
            ".admin-academy-row-checkbox"
        );


    if (
        !checkbox
    ) {

        return;

    }


    adminAcademiesToggleAcademySelection(
        checkbox.value,
        checkbox.checked
    );

}


/* =========================================================
   PAGINATION INTERACTIONS
========================================================= */

function adminAcademiesChangePage(
    nextPage
) {

    const normalizedPage =
        Math.min(
            adminAcademiesState.totalPages,
            Math.max(
                1,
                Number(
                    nextPage
                ) || 1
            )
        );


    if (
        normalizedPage ===
        adminAcademiesState.currentPage
    ) {

        return;

    }


    adminAcademiesState.currentPage =
        normalizedPage;


    adminAcademiesRenderTable();

    adminAcademiesRenderPagination();

    adminAcademiesRenderBulkActions();


    adminAcademiesDOM.tableWrapper?.scrollIntoView({

        behavior:
            "smooth",

        block:
            "start"

    });

}


function adminAcademiesHandlePaginationClick(
    event
) {

    const pageButton =
        event.target.closest(
            "[data-academies-page]"
        );


    if (
        !pageButton
    ) {

        return;

    }


    adminAcademiesChangePage(
        pageButton.dataset.academiesPage
    );

}


/* =========================================================
   VIEW DETAILS TO EDIT
========================================================= */

function adminAcademiesHandleEditFromDetails() {

    const academyId =
        adminAcademiesState.activeAcademyId;


    if (
        !academyId
    ) {

        return;

    }


    adminAcademiesCloseModal(
        adminAcademiesDOM.viewModal
    );


    adminAcademiesOpenEdit(
        academyId
    );

}


/* =========================================================
   DELETE CONFIRMATION INPUT
========================================================= */

function adminAcademiesHandleDeleteConfirmationInput() {

    if (
        !adminAcademiesDOM.deleteConfirmationInput
    ) {

        return;

    }


    const isValid =
        adminAcademiesDOM.deleteConfirmationInput.value
            .trim()
            .toLowerCase() ===
        "delete";


    if (
        isValid
    ) {

        adminAcademiesDOM.deleteConfirmationInput.removeAttribute(
            "aria-invalid"
        );


        const errorElement =
            document.querySelector(
                "small[data-delete-academy-error-for='confirmation']"
            );


        if (
            errorElement
        ) {

            errorElement.textContent =
                "";

        }

    }

}


/* =========================================================
   LOGOUT
========================================================= */

async function adminAcademiesHandleLogout() {

    adminAcademiesSetButtonLoading(
        adminAcademiesDOM.logoutConfirmButton,
        true,
        "Signing Out"
    );


    try {

        if (
            ADMIN_ACADEMIES_CONFIG.USE_MOCK_DATA
        ) {

            await adminAcademiesDelay(
                500
            );

        } else {

            const response =
                await fetch(
                    `${ADMIN_ACADEMIES_CONFIG.API_BASE_URL}/auth/logout`,
                    {

                        method:
                            "POST",

                        credentials:
                            "include",

                        headers: {

                            Accept:
                                "application/json"

                        }

                    }
                );


            if (
                !response.ok
            ) {

                throw new Error(
                    "Unable to sign out."
                );

            }

        }


        localStorage.removeItem(
            "adminAccessToken"
        );


        sessionStorage.removeItem(
            "adminAccessToken"
        );


        window.location.href =
            "admin-login.html";

    } catch (
        error
    ) {

        console.error(
            error
        );


        adminAcademiesShowToast(
            "Logout failed",
            error.message ||
            "You could not be signed out.",
            "error"
        );


        adminAcademiesSetButtonLoading(
            adminAcademiesDOM.logoutConfirmButton,
            false
        );

    }

}


/* =========================================================
   KEYBOARD INTERACTIONS
========================================================= */

function adminAcademiesHandleGlobalKeydown(
    event
) {

    if (
        event.key === "Escape"
    ) {

        adminAcademiesCloseAllModals();

        return;

    }


    const openModal =
        adminAcademiesGetOpenModal();


    if (
        event.key !== "Tab" ||
        !openModal
    ) {

        return;

    }


    const focusableElements =
        Array.from(
            openModal.querySelectorAll(
                [

                    "a[href]",
                    "button:not([disabled])",
                    "input:not([disabled])",
                    "select:not([disabled])",
                    "textarea:not([disabled])",
                    "[tabindex]:not([tabindex='-1'])"

                ].join(
                    ","
                )
            )
        ).filter(
            (
                element
            ) => !element.hidden
        );


    if (
        focusableElements.length === 0
    ) {

        event.preventDefault();

        return;

    }


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


/* =========================================================
   EVENT LISTENER REGISTRATION
========================================================= */

function adminAcademiesBindEvents() {

    const debouncedSearch =
        adminAcademiesDebounce(
            () => {

                adminAcademiesApplyFilters(
                    true
                );

            },
            ADMIN_ACADEMIES_CONFIG.SEARCH_DEBOUNCE_MS
        );


    adminAcademiesDOM.searchInput?.addEventListener(
        "input",
        debouncedSearch
    );


    adminAcademiesDOM.filterForm?.addEventListener(
        "submit",
        (
            event
        ) => {

            event.preventDefault();

            adminAcademiesApplyFilters(
                true
            );

        }
    );


    [

        adminAcademiesDOM.verificationFilter,
        adminAcademiesDOM.typeFilter,
        adminAcademiesDOM.stateFilter,
        adminAcademiesDOM.visibilityFilter,
        adminAcademiesDOM.sortFilter

    ].forEach(
        (
            field
        ) => {

            field?.addEventListener(
                "change",
                () => {

                    adminAcademiesApplyFilters(
                        true
                    );

                }
            );

        }
    );


    adminAcademiesDOM.resetFiltersButton?.addEventListener(
        "click",
        adminAcademiesResetFilters
    );


    adminAcademiesDOM.refreshAcademiesButton?.addEventListener(
        "click",
        () => {

            adminAcademiesLoadData(
                true
            );

        }
    );


    adminAcademiesDOM.addAcademyButton?.addEventListener(
        "click",
        () => {

            adminAcademiesDOM.addForm?.reset();


            adminAcademiesClearFormErrors(
                adminAcademiesDOM.addForm
            );


            adminAcademiesOpenModal(
                adminAcademiesDOM.addModal
            );

        }
    );


    adminAcademiesDOM.exportAcademiesButton?.addEventListener(
        "click",
        () => {

            adminAcademiesOpenModal(
                adminAcademiesDOM.exportModal
            );

        }
    );


    adminAcademiesDOM.tableBody?.addEventListener(
        "click",
        adminAcademiesHandleTableClick
    );


    adminAcademiesDOM.tableBody?.addEventListener(
        "change",
        adminAcademiesHandleTableChange
    );


    adminAcademiesDOM.selectAllCheckbox?.addEventListener(
        "change",
        (
            event
        ) => {

            adminAcademiesToggleVisibleSelection(
                event.currentTarget.checked
            );

        }
    );


    adminAcademiesDOM.clearSelectionButton?.addEventListener(
        "click",
        adminAcademiesClearSelection
    );


    adminAcademiesDOM.bulkVerifyButton?.addEventListener(
        "click",
        adminAcademiesHandleBulkVerify
    );


    adminAcademiesDOM.bulkPublicButton?.addEventListener(
        "click",
        () => {

            adminAcademiesHandleBulkVisibility(
                "public"
            );

        }
    );


    adminAcademiesDOM.bulkHiddenButton?.addEventListener(
        "click",
        () => {

            adminAcademiesHandleBulkVisibility(
                "hidden"
            );

        }
    );


    adminAcademiesDOM.bulkDeleteButton?.addEventListener(
        "click",
        adminAcademiesHandleBulkDelete
    );


    adminAcademiesDOM.pagination?.addEventListener(
        "click",
        adminAcademiesHandlePaginationClick
    );


    adminAcademiesDOM.previousPageButton?.addEventListener(
        "click",
        () => {

            adminAcademiesChangePage(
                adminAcademiesState.currentPage - 1
            );

        }
    );


    adminAcademiesDOM.nextPageButton?.addEventListener(
        "click",
        () => {

            adminAcademiesChangePage(
                adminAcademiesState.currentPage + 1
            );

        }
    );


    adminAcademiesDOM.addForm?.addEventListener(
        "submit",
        adminAcademiesHandleCreate
    );


    adminAcademiesDOM.editForm?.addEventListener(
        "submit",
        adminAcademiesHandleUpdate
    );


    adminAcademiesDOM.deleteForm?.addEventListener(
        "submit",
        adminAcademiesHandleDelete
    );


    adminAcademiesDOM.exportForm?.addEventListener(
        "submit",
        adminAcademiesHandleExport
    );


    adminAcademiesDOM.confirmVerifyButton?.addEventListener(
        "click",
        adminAcademiesHandleVerify
    );


    adminAcademiesDOM.editFromDetailsButton?.addEventListener(
        "click",
        adminAcademiesHandleEditFromDetails
    );


    adminAcademiesDOM.deleteConfirmationInput?.addEventListener(
        "input",
        adminAcademiesHandleDeleteConfirmationInput
    );


    adminAcademiesDOM.logoutButton?.addEventListener(
        "click",
        () => {

            adminAcademiesOpenModal(
                adminAcademiesDOM.logoutModal
            );

        }
    );


    adminAcademiesDOM.logoutConfirmButton?.addEventListener(
        "click",
        adminAcademiesHandleLogout
    );


    const modalCloseBindings = [

        [

            adminAcademiesDOM.addModalCloseButton,
            adminAcademiesDOM.addModal

        ],

        [

            adminAcademiesDOM.cancelAddButton,
            adminAcademiesDOM.addModal

        ],

        [

            adminAcademiesDOM.addModalBackdrop,
            adminAcademiesDOM.addModal

        ],

        [

            adminAcademiesDOM.viewModalCloseButton,
            adminAcademiesDOM.viewModal

        ],

        [

            adminAcademiesDOM.closeDetailsButton,
            adminAcademiesDOM.viewModal

        ],

        [

            adminAcademiesDOM.viewModalBackdrop,
            adminAcademiesDOM.viewModal

        ],

        [

            adminAcademiesDOM.editModalCloseButton,
            adminAcademiesDOM.editModal

        ],

        [

            adminAcademiesDOM.cancelEditButton,
            adminAcademiesDOM.editModal

        ],

        [

            adminAcademiesDOM.editModalBackdrop,
            adminAcademiesDOM.editModal

        ],

        [

            adminAcademiesDOM.verifyModalCloseButton,
            adminAcademiesDOM.verifyModal

        ],

        [

            adminAcademiesDOM.cancelVerifyButton,
            adminAcademiesDOM.verifyModal

        ],

        [

            adminAcademiesDOM.verifyModalBackdrop,
            adminAcademiesDOM.verifyModal

        ],

        [

            adminAcademiesDOM.deleteModalCloseButton,
            adminAcademiesDOM.deleteModal

        ],

        [

            adminAcademiesDOM.cancelDeleteButton,
            adminAcademiesDOM.deleteModal

        ],

        [

            adminAcademiesDOM.deleteModalBackdrop,
            adminAcademiesDOM.deleteModal

        ],

        [

            adminAcademiesDOM.exportModalCloseButton,
            adminAcademiesDOM.exportModal

        ],

        [

            adminAcademiesDOM.cancelExportButton,
            adminAcademiesDOM.exportModal

        ],

        [

            adminAcademiesDOM.exportModalBackdrop,
            adminAcademiesDOM.exportModal

        ],

        [

            adminAcademiesDOM.logoutModalCloseButton,
            adminAcademiesDOM.logoutModal

        ],

        [

            adminAcademiesDOM.logoutCancelButton,
            adminAcademiesDOM.logoutModal

        ],

        [

            adminAcademiesDOM.logoutModalBackdrop,
            adminAcademiesDOM.logoutModal

        ]

    ];


    modalCloseBindings.forEach(
        (
            [
                trigger,
                modal
            ]
        ) => {

            trigger?.addEventListener(
                "click",
                () => {

                    adminAcademiesCloseModal(
                        modal
                    );

                }
            );

        }
    );


    document.addEventListener(
        "keydown",
        adminAcademiesHandleGlobalKeydown
    );

}


/* =========================================================
   INITIALIZE ADMIN ACADEMIES
========================================================= */

async function adminAcademiesInitialize() {

    if (
        adminAcademiesState.initialized
    ) {

        return;

    }


    adminAcademiesState.initialized =
        true;


    adminAcademiesBindEvents();


    try {

        await adminAcademiesLoadData();

    } finally {

        if (
            adminAcademiesDOM.loadingScreen
        ) {

            adminAcademiesDOM.loadingScreen.classList.add(
                "hidden"
            );


            window.setTimeout(
                () => {

                    adminAcademiesDOM.loadingScreen?.remove();

                },
                350
            );

        }

    }

}


/* =========================================================
   DOCUMENT READY
========================================================= */

if (
    document.readyState === "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        adminAcademiesInitialize,
        {

            once:
                true

        }
    );

} else {

    adminAcademiesInitialize();

}