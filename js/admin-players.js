/* =========================================================
   ADMIN PLAYERS
   FILE: admin-players.js
   PART 1A
========================================================= */

"use strict";


/* =========================================================
   CONFIGURATION
========================================================= */

const ADMIN_PLAYERS_CONFIG = Object.freeze({

    apiBaseUrl:
        window.ADMIN_API_BASE_URL ||
        "/api/v1",

    endpoints: {

        players:
            "/admin/players",

        metrics:
            "/admin/players/metrics",

        bulkVerify:
            "/admin/players/bulk/verify",

        bulkVisibility:
            "/admin/players/bulk/visibility",

        bulkDelete:
            "/admin/players/bulk/delete",

        export:
            "/admin/players/export",

        logout:
            "/auth/logout"

    },

    pagination: {

        defaultPage:
            1,

        pageSize:
            10,

        maximumVisiblePages:
            5

    },

    requestTimeout:
        15000,

    searchDebounce:
        400,

    toastDuration:
        4500,

    developmentMode:
        true

});


/* =========================================================
   APPLICATION STATE
========================================================= */

const adminPlayersState = {

    players:
        [],

    filteredPlayers:
        [],

    selectedPlayerIds:
        new Set(),

    currentPlayer:
        null,

    playerPendingVerification:
        null,

    playerPendingDeletion:
        null,

    filters: {

        search:
            "",

        verification:
            "",

        position:
            "",

        ageGroup:
            "",

        state:
            "",

        visibility:
            "",

        sort:
            "latest"

    },

    pagination: {

        currentPage:
            ADMIN_PLAYERS_CONFIG.pagination.defaultPage,

        pageSize:
            ADMIN_PLAYERS_CONFIG.pagination.pageSize,

        totalItems:
            0,

        totalPages:
            1

    },

    metrics: {

        total:
            0,

        verified:
            0,

        pending:
            0,

        scoutVisible:
            0

    },

    loading:
        false,

    initialized:
        false

};


/* =========================================================
   DOM REFERENCES
========================================================= */

const adminPlayersDOM = {

    loadingScreen:
        document.getElementById(
            "adminLoadingScreen"
        ),

    footerYear:
        document.getElementById(
            "adminFooterYear"
        ),

    filterForm:
        document.getElementById(
            "adminPlayersFilterForm"
        ),

    searchInput:
        document.getElementById(
            "adminPlayersSearchInput"
        ),

    verificationFilter:
        document.getElementById(
            "adminPlayerVerificationFilter"
        ),

    positionFilter:
        document.getElementById(
            "adminPlayerPositionFilter"
        ),

    ageGroupFilter:
        document.getElementById(
            "adminPlayerAgeGroupFilter"
        ),

    stateFilter:
        document.getElementById(
            "adminPlayerStateFilter"
        ),

    visibilityFilter:
        document.getElementById(
            "adminPlayerVisibilityFilter"
        ),

    sortFilter:
        document.getElementById(
            "adminPlayersSort"
        ),

    resetFiltersButton:
        document.getElementById(
            "adminResetPlayerFiltersButton"
        ),

    refreshButton:
        document.getElementById(
            "adminRefreshPlayersButton"
        ),

    tableBody:
        document.getElementById(
            "adminPlayersTableBody"
        ),

    tableSummary:
        document.getElementById(
            "adminPlayersTableSummary"
        ),

    selectAllCheckbox:
        document.getElementById(
            "adminSelectAllPlayersCheckbox"
        ),

    bulkActionsBar:
        document.getElementById(
            "adminPlayersBulkActionsBar"
        ),

    selectedPlayersCount:
        document.getElementById(
            "adminSelectedPlayersCount"
        ),

    clearSelectionButton:
        document.getElementById(
            "adminClearPlayersSelectionButton"
        ),

    bulkVerifyButton:
        document.getElementById(
            "adminBulkVerifyPlayersButton"
        ),

    bulkShowButton:
        document.getElementById(
            "adminBulkShowPlayersButton"
        ),

    bulkHideButton:
        document.getElementById(
            "adminBulkHidePlayersButton"
        ),

    bulkDeleteButton:
        document.getElementById(
            "adminBulkDeletePlayersButton"
        ),

    pagination:
        document.getElementById(
            "adminPlayersPagination"
        ),

    previousPageButton:
        document.getElementById(
            "adminPreviousPlayersPageButton"
        ),

    nextPageButton:
        document.getElementById(
            "adminNextPlayersPageButton"
        ),

    toastRegion:
        document.getElementById(
            "adminToastRegion"
        ),

    addPlayerForm:
        document.getElementById(
            "adminAddPlayerForm"
        ),

    editPlayerForm:
        document.getElementById(
            "adminEditPlayerForm"
        ),

    deletePlayerForm:
        document.getElementById(
            "adminDeletePlayerForm"
        ),

    exportPlayersForm:
        document.getElementById(
            "adminExportPlayersForm"
        ),

    playerDetailsContent:
        document.getElementById(
            "adminPlayerDetailsContent"
        ),

    editPlayerFormFields:
        document.getElementById(
            "adminEditPlayerFormFields"
        ),

    editPlayerId:
        document.getElementById(
            "adminEditPlayerId"
        ),

    deletePlayerId:
        document.getElementById(
            "adminDeletePlayerId"
        ),

    deletePlayerName:
        document.getElementById(
            "adminDeletePlayerName"
        ),

    deleteConfirmationInput:
        document.getElementById(
            "adminDeletePlayerConfirmation"
        ),

    verifyPlayerName:
        document.getElementById(
            "adminVerifyPlayerName"
        ),

    exportFormat:
        document.getElementById(
            "adminPlayersExportFormat"
        )

};


/* =========================================================
   DEVELOPMENT MOCK DATA
========================================================= */

const ADMIN_PLAYERS_MOCK_DATA = [

    {

        id:
            "PLY-2034-001",

        name:
            "Aarav Sharma",

        email:
            "aarav.sharma@example.com",

        phone:
            "+91 98765 43210",

        dateOfBirth:
            "2010-04-16",

        gender:
            "male",

        state:
            "Punjab",

        city:
            "Mohali",

        position:
            "forward",

        secondaryPosition:
            "right-winger",

        preferredFoot:
            "right",

        academy:
            "Minerva Football Academy",

        academyLocation:
            "Mohali, Punjab",

        verification:
            "verified",

        visibility:
            "visible",

        profileCompletion:
            94,

        rating:
            4.8,

        lastActive:
            "2026-07-21T07:20:00.000Z",

        createdAt:
            "2026-06-11T10:30:00.000Z",

        profileImage:
            "images/players/player-1.jpg",

        ageGroup:
            "u16",

        height:
            "172 cm",

        weight:
            "61 kg",

        nationality:
            "Indian",

        documentsComplete:
            true,

        guardianName:
            "Rajesh Sharma",

        guardianPhone:
            "+91 97654 32109",

        note:
            "Strong attacking movement and excellent finishing ability."

    },

    {

        id:
            "PLY-2034-002",

        name:
            "Ningthoujam Rohan",

        email:
            "rohan.ningthoujam@example.com",

        phone:
            "+91 98621 14578",

        dateOfBirth:
            "2011-08-04",

        gender:
            "male",

        state:
            "Manipur",

        city:
            "Imphal",

        position:
            "midfielder",

        secondaryPosition:
            "attacking-midfielder",

        preferredFoot:
            "left",

        academy:
            "Classic Football Academy",

        academyLocation:
            "Imphal, Manipur",

        verification:
            "pending",

        visibility:
            "hidden",

        profileCompletion:
            78,

        rating:
            4.4,

        lastActive:
            "2026-07-20T18:40:00.000Z",

        createdAt:
            "2026-07-05T09:15:00.000Z",

        profileImage:
            "",

        ageGroup:
            "u16",

        height:
            "168 cm",

        weight:
            "58 kg",

        nationality:
            "Indian",

        documentsComplete:
            false,

        guardianName:
            "N. Ranjit Singh",

        guardianPhone:
            "+91 98620 11008",

        note:
            "Awaiting birth certificate verification."

    },

    {

        id:
            "PLY-2034-003",

        name:
            "Lalrinzuala Chhangte",

        email:
            "lalrinzuala@example.com",

        phone:
            "+91 89745 62013",

        dateOfBirth:
            "2009-12-11",

        gender:
            "male",

        state:
            "Mizoram",

        city:
            "Aizawl",

        position:
            "defender",

        secondaryPosition:
            "right-back",

        preferredFoot:
            "right",

        academy:
            "Aizawl Youth Academy",

        academyLocation:
            "Aizawl, Mizoram",

        verification:
            "verified",

        visibility:
            "visible",

        profileCompletion:
            88,

        rating:
            4.6,

        lastActive:
            "2026-07-21T05:15:00.000Z",

        createdAt:
            "2026-05-24T12:40:00.000Z",

        profileImage:
            "images/players/player-3.jpg",

        ageGroup:
            "u18",

        height:
            "176 cm",

        weight:
            "65 kg",

        nationality:
            "Indian",

        documentsComplete:
            true,

        guardianName:
            "Lalremruata Chhangte",

        guardianPhone:
            "+91 89745 33456",

        note:
            "Reliable one-versus-one defender with strong recovery pace."

    },

    {

        id:
            "PLY-2034-004",

        name:
            "Aditya Nair",

        email:
            "aditya.nair@example.com",

        phone:
            "+91 98470 24318",

        dateOfBirth:
            "2012-02-20",

        gender:
            "male",

        state:
            "Kerala",

        city:
            "Kochi",

        position:
            "goalkeeper",

        secondaryPosition:
            "",

        preferredFoot:
            "right",

        academy:
            "Kerala Football Development Centre",

        academyLocation:
            "Kochi, Kerala",

        verification:
            "incomplete",

        visibility:
            "restricted",

        profileCompletion:
            54,

        rating:
            3.9,

        lastActive:
            "2026-07-18T14:10:00.000Z",

        createdAt:
            "2026-07-14T08:20:00.000Z",

        profileImage:
            "",

        ageGroup:
            "u14",

        height:
            "164 cm",

        weight:
            "55 kg",

        nationality:
            "Indian",

        documentsComplete:
            false,

        guardianName:
            "Suresh Nair",

        guardianPhone:
            "+91 98471 11223",

        note:
            "Profile missing residential proof and medical declaration."

    },

    {

        id:
            "PLY-2034-005",

        name:
            "Kabir Mehta",

        email:
            "kabir.mehta@example.com",

        phone:
            "+91 99876 14520",

        dateOfBirth:
            "2008-10-06",

        gender:
            "male",

        state:
            "Maharashtra",

        city:
            "Mumbai",

        position:
            "midfielder",

        secondaryPosition:
            "central-midfielder",

        preferredFoot:
            "both",

        academy:
            "Mumbai Elite Football School",

        academyLocation:
            "Mumbai, Maharashtra",

        verification:
            "rejected",

        visibility:
            "hidden",

        profileCompletion:
            82,

        rating:
            4.1,

        lastActive:
            "2026-07-15T11:40:00.000Z",

        createdAt:
            "2026-06-29T16:45:00.000Z",

        profileImage:
            "",

        ageGroup:
            "u18",

        height:
            "174 cm",

        weight:
            "63 kg",

        nationality:
            "Indian",

        documentsComplete:
            false,

        guardianName:
            "Amit Mehta",

        guardianPhone:
            "+91 99875 11004",

        note:
            "Submitted identity document could not be validated."

    },

    {

        id:
            "PLY-2034-006",

        name:
            "Temjen Jamir",

        email:
            "temjen.jamir@example.com",

        phone:
            "+91 70054 31892",

        dateOfBirth:
            "2010-06-23",

        gender:
            "male",

        state:
            "Nagaland",

        city:
            "Dimapur",

        position:
            "forward",

        secondaryPosition:
            "left-winger",

        preferredFoot:
            "left",

        academy:
            "Nagaland Football Academy",

        academyLocation:
            "Dimapur, Nagaland",

        verification:
            "verified",

        visibility:
            "visible",

        profileCompletion:
            96,

        rating:
            4.7,

        lastActive:
            "2026-07-21T06:00:00.000Z",

        createdAt:
            "2026-04-19T07:30:00.000Z",

        profileImage:
            "images/players/player-6.jpg",

        ageGroup:
            "u16",

        height:
            "170 cm",

        weight:
            "59 kg",

        nationality:
            "Indian",

        documentsComplete:
            true,

        guardianName:
            "Imkong Jamir",

        guardianPhone:
            "+91 70055 11890",

        note:
            "Explosive winger with excellent acceleration and close control."

    }

];


/* =========================================================
   API SERVICE
========================================================= */

const AdminPlayersAPI = {

    async request(
        endpoint,
        options = {}
    ) {

        const controller =
            new AbortController();

        const timeoutId =
            window.setTimeout(
                () => controller.abort(),
                ADMIN_PLAYERS_CONFIG.requestTimeout
            );

        const requestOptions = {

            method:
                options.method || "GET",

            headers: {

                Accept:
                    "application/json",

                ...(options.body
                    ? {
                        "Content-Type":
                            "application/json"
                    }
                    : {}),

                ...(options.headers || {})

            },

            credentials:
                "include",

            signal:
                controller.signal

        };


        if (options.body) {

            requestOptions.body =
                JSON.stringify(
                    options.body
                );

        }


        try {

            const response =
                await fetch(
                    `${ADMIN_PLAYERS_CONFIG.apiBaseUrl}${endpoint}`,
                    requestOptions
                );


            const contentType =
                response.headers.get(
                    "content-type"
                ) || "";


            const responseData =
                contentType.includes(
                    "application/json"
                )
                    ? await response.json()
                    : null;


            if (!response.ok) {

                const errorMessage =
                    responseData?.message ||
                    responseData?.error ||
                    `Request failed with status ${response.status}.`;

                throw new Error(
                    errorMessage
                );

            }


            return responseData;

        } catch (error) {

            if (
                error.name ===
                "AbortError"
            ) {

                throw new Error(
                    "The request timed out. Please try again."
                );

            }


            throw error;

        } finally {

            window.clearTimeout(
                timeoutId
            );

        }

    },


    async getPlayers(
        filters = {}
    ) {

        if (
            ADMIN_PLAYERS_CONFIG.developmentMode
        ) {

            return {

                players:
                    structuredClone(
                        ADMIN_PLAYERS_MOCK_DATA
                    ),

                total:
                    ADMIN_PLAYERS_MOCK_DATA.length

            };

        }


        const params =
            new URLSearchParams();


        Object.entries(
            filters
        ).forEach(
            ([
                key,
                value
            ]) => {

                if (
                    value !== "" &&
                    value !== null &&
                    value !== undefined
                ) {

                    params.set(
                        key,
                        String(value)
                    );

                }

            }
        );


        const query =
            params.toString();


        return this.request(
            `${ADMIN_PLAYERS_CONFIG.endpoints.players}${query ? `?${query}` : ""}`
        );

    },


    async getMetrics() {

        if (
            ADMIN_PLAYERS_CONFIG.developmentMode
        ) {

            return null;

        }


        return this.request(
            ADMIN_PLAYERS_CONFIG.endpoints.metrics
        );

    },


    async createPlayer(
        playerData
    ) {

        if (
            ADMIN_PLAYERS_CONFIG.developmentMode
        ) {

            return {

                player: {

                    ...playerData,

                    id:
                        `PLY-2034-${String(
                            Date.now()
                        ).slice(-5)}`,

                    profileCompletion:
                        45,

                    rating:
                        0,

                    lastActive:
                        new Date().toISOString(),

                    createdAt:
                        new Date().toISOString(),

                    profileImage:
                        "",

                    documentsComplete:
                        false

                }

            };

        }


        return this.request(
            ADMIN_PLAYERS_CONFIG.endpoints.players,
            {

                method:
                    "POST",

                body:
                    playerData

            }
        );

    },


    async updatePlayer(
        playerId,
        playerData
    ) {

        if (
            ADMIN_PLAYERS_CONFIG.developmentMode
        ) {

            return {

                player: {

                    ...playerData,

                    id:
                        playerId

                }

            };

        }


        return this.request(
            `${ADMIN_PLAYERS_CONFIG.endpoints.players}/${encodeURIComponent(playerId)}`,
            {

                method:
                    "PATCH",

                body:
                    playerData

            }
        );

    },


    async verifyPlayer(
        playerId
    ) {

        if (
            ADMIN_PLAYERS_CONFIG.developmentMode
        ) {

            return {

                success:
                    true,

                playerId:
                    playerId

            };

        }


        return this.request(
            `${ADMIN_PLAYERS_CONFIG.endpoints.players}/${encodeURIComponent(playerId)}/verify`,
            {

                method:
                    "PATCH"

            }
        );

    },


    async deletePlayer(
        playerId
    ) {

        if (
            ADMIN_PLAYERS_CONFIG.developmentMode
        ) {

            return {

                success:
                    true,

                playerId:
                    playerId

            };

        }


        return this.request(
            `${ADMIN_PLAYERS_CONFIG.endpoints.players}/${encodeURIComponent(playerId)}`,
            {

                method:
                    "DELETE"

            }
        );

    }

};

/* =========================================================
   ADMIN PLAYERS
   FILE: admin-players.js
   PART 1B
========================================================= */


/* =========================================================
   API SERVICE — BULK ACTIONS
========================================================= */

AdminPlayersAPI.bulkVerifyPlayers =
    async function bulkVerifyPlayers(
        playerIds
    ) {

        if (
            ADMIN_PLAYERS_CONFIG.developmentMode
        ) {

            return {

                success:
                    true,

                playerIds:
                    [...playerIds]

            };

        }


        return this.request(
            ADMIN_PLAYERS_CONFIG.endpoints.bulkVerify,
            {

                method:
                    "PATCH",

                body: {

                    playerIds:
                        [...playerIds]

                }

            }
        );

    };


AdminPlayersAPI.bulkUpdateVisibility =
    async function bulkUpdateVisibility(
        playerIds,
        visibility
    ) {

        if (
            ADMIN_PLAYERS_CONFIG.developmentMode
        ) {

            return {

                success:
                    true,

                playerIds:
                    [...playerIds],

                visibility:
                    visibility

            };

        }


        return this.request(
            ADMIN_PLAYERS_CONFIG.endpoints.bulkVisibility,
            {

                method:
                    "PATCH",

                body: {

                    playerIds:
                        [...playerIds],

                    visibility:
                        visibility

                }

            }
        );

    };


AdminPlayersAPI.bulkDeletePlayers =
    async function bulkDeletePlayers(
        playerIds
    ) {

        if (
            ADMIN_PLAYERS_CONFIG.developmentMode
        ) {

            return {

                success:
                    true,

                playerIds:
                    [...playerIds]

            };

        }


        return this.request(
            ADMIN_PLAYERS_CONFIG.endpoints.bulkDelete,
            {

                method:
                    "DELETE",

                body: {

                    playerIds:
                        [...playerIds]

                }

            }
        );

    };


AdminPlayersAPI.logout =
    async function logout() {

        if (
            ADMIN_PLAYERS_CONFIG.developmentMode
        ) {

            return {

                success:
                    true

            };

        }


        return this.request(
            ADMIN_PLAYERS_CONFIG.endpoints.logout,
            {

                method:
                    "POST"

            }
        );

    };


/* =========================================================
   GENERAL UTILITIES
========================================================= */

function adminPlayersEscapeHTML(
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
            '"',
            "&quot;"
        )
        .replaceAll(
            "'",
            "&#039;"
        );

}


function adminPlayersNormalizeText(
    value
) {

    return String(
        value ?? ""
    )
        .trim()
        .toLowerCase();

}


function adminPlayersFormatLabel(
    value
) {

    if (!value) {

        return "Not specified";

    }


    return String(
        value
    )
        .replaceAll(
            "-",
            " "
        )
        .replaceAll(
            "_",
            " "
        )
        .replace(
            /\b\w/g,
            (letter) =>
                letter.toUpperCase()
        );

}


function adminPlayersGetInitials(
    name
) {

    const words =
        String(
            name || "Player"
        )
            .trim()
            .split(
                /\s+/
            )
            .filter(
                Boolean
            );


    return words
        .slice(
            0,
            2
        )
        .map(
            (word) =>
                word.charAt(
                    0
                )
        )
        .join(
            ""
        )
        .toUpperCase() ||
        "PL";

}


function adminPlayersCalculateAge(
    dateOfBirth
) {

    if (!dateOfBirth) {

        return null;

    }


    const birthDate =
        new Date(
            dateOfBirth
        );


    if (
        Number.isNaN(
            birthDate.getTime()
        )
    ) {

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


    if (
        monthDifference < 0 ||
        (
            monthDifference === 0 &&
            today.getDate() <
            birthDate.getDate()
        )
    ) {

        age -=
            1;

    }


    return age;

}


function adminPlayersFormatDate(
    value,
    options = {}
) {

    if (!value) {

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


function adminPlayersFormatDateTime(
    value
) {

    if (!value) {

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

            hour:
                "2-digit",

            minute:
                "2-digit"

        }
    ).format(
        date
    );

}


function adminPlayersFormatRelativeTime(
    value
) {

    if (!value) {

        return {

            relative:
                "Unknown",

            exact:
                "Not available"

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

            relative:
                "Unknown",

            exact:
                "Not available"

        };

    }


    const difference =
        date.getTime() -
        Date.now();

    const absoluteDifference =
        Math.abs(
            difference
        );


    const units = [

        {

            name:
                "year",

            milliseconds:
                1000 *
                60 *
                60 *
                24 *
                365

        },

        {

            name:
                "month",

            milliseconds:
                1000 *
                60 *
                60 *
                24 *
                30

        },

        {

            name:
                "day",

            milliseconds:
                1000 *
                60 *
                60 *
                24

        },

        {

            name:
                "hour",

            milliseconds:
                1000 *
                60 *
                60

        },

        {

            name:
                "minute",

            milliseconds:
                1000 *
                60

        }

    ];


    const selectedUnit =
        units.find(
            (unit) =>
                absoluteDifference >=
                unit.milliseconds
        );


    if (!selectedUnit) {

        return {

            relative:
                "Just now",

            exact:
                adminPlayersFormatDateTime(
                    value
                )

        };

    }


    const amount =
        Math.round(
            difference /
            selectedUnit.milliseconds
        );


    return {

        relative:
            new Intl.RelativeTimeFormat(
                "en",
                {

                    numeric:
                        "auto"

                }
            ).format(
                amount,
                selectedUnit.name
            ),

        exact:
            adminPlayersFormatDateTime(
                value
            )

    };

}


function adminPlayersCreateDebounce(
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


function adminPlayersGeneratePlayerId() {

    const randomNumber =
        Math.floor(
            100000 +
            Math.random() *
            900000
        );


    return `PLY-2034-${randomNumber}`;

}


/* =========================================================
   STATE HELPERS
========================================================= */

function adminPlayersFindById(
    playerId
) {

    return adminPlayersState.players.find(
        (player) =>
            String(
                player.id
            ) ===
            String(
                playerId
            )
    ) || null;

}


function adminPlayersGetSelectedPlayers() {

    return adminPlayersState.players.filter(
        (player) =>
            adminPlayersState.selectedPlayerIds.has(
                String(
                    player.id
                )
            )
    );

}


function adminPlayersResetPagination() {

    adminPlayersState.pagination.currentPage =
        1;

}


function adminPlayersSetLoading(
    isLoading
) {

    adminPlayersState.loading =
        Boolean(
            isLoading
        );


    if (
        adminPlayersDOM.refreshButton
    ) {

        adminPlayersDOM.refreshButton.disabled =
            adminPlayersState.loading;


        const icon =
            adminPlayersDOM.refreshButton.querySelector(
                "i"
            );


        if (icon) {

            icon.classList.toggle(
                "fa-spin",
                adminPlayersState.loading
            );

        }

    }

}


/* =========================================================
   TOAST NOTIFICATIONS
========================================================= */

function adminPlayersShowToast(
    message,
    type = "info",
    title = ""
) {

    if (
        !adminPlayersDOM.toastRegion
    ) {

        return;

    }


    const toast =
        document.createElement(
            "article"
        );

    const normalizedType =
        [
            "success",
            "warning",
            "error",
            "info"
        ].includes(
            type
        )
            ? type
            : "info";


    const iconMap = {

        success:
            "fa-circle-check",

        warning:
            "fa-triangle-exclamation",

        error:
            "fa-circle-xmark",

        info:
            "fa-circle-info"

    };


    const defaultTitleMap = {

        success:
            "Success",

        warning:
            "Attention",

        error:
            "Something went wrong",

        info:
            "Information"

    };


    toast.className =
        `admin-toast admin-toast-${normalizedType}`;

    toast.setAttribute(
        "role",
        normalizedType === "error"
            ? "alert"
            : "status"
    );


    toast.innerHTML = `

        <div class="admin-toast-icon">

            <i
                class="fa-solid ${iconMap[normalizedType]}"
                aria-hidden="true"
            ></i>

        </div>

        <div class="admin-toast-content">

            <strong>
                ${adminPlayersEscapeHTML(
                    title ||
                    defaultTitleMap[normalizedType]
                )}
            </strong>

            <p>
                ${adminPlayersEscapeHTML(
                    message
                )}
            </p>

        </div>

        <button
            class="admin-toast-close"
            type="button"
            aria-label="Close notification"
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
                toast.classList.contains(
                    "is-leaving"
                )
            ) {

                return;

            }


            toast.classList.add(
                "is-leaving"
            );


            window.setTimeout(
                () => {

                    toast.remove();

                },
                240
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


    adminPlayersDOM.toastRegion.append(
        toast
    );


    window.setTimeout(
        removeToast,
        ADMIN_PLAYERS_CONFIG.toastDuration
    );

}


/* =========================================================
   MODAL UTILITIES
========================================================= */

function adminPlayersGetModal(
    modalId
) {

    return document.getElementById(
        modalId
    );

}


function adminPlayersOpenModal(
    modalId
) {

    const modal =
        adminPlayersGetModal(
            modalId
        );


    if (!modal) {

        return;

    }


    modal.hidden =
        false;

    modal.setAttribute(
        "aria-hidden",
        "false"
    );

    document.body.classList.add(
        "admin-player-modal-open"
    );


    const focusableElement =
        modal.querySelector(
            `
                button:not([disabled]),
                input:not([disabled]),
                select:not([disabled]),
                textarea:not([disabled])
            `
        );


    window.requestAnimationFrame(
        () => {

            focusableElement?.focus();

        }
    );

}


function adminPlayersCloseModal(
    modalId
) {

    const modal =
        adminPlayersGetModal(
            modalId
        );


    if (!modal) {

        return;

    }


    modal.hidden =
        true;

    modal.setAttribute(
        "aria-hidden",
        "true"
    );


    const openModal =
        document.querySelector(
            ".admin-player-modal:not([hidden])"
        );


    if (!openModal) {

        document.body.classList.remove(
            "admin-player-modal-open"
        );

    }

}


function adminPlayersCloseAllModals() {

    document
        .querySelectorAll(
            ".admin-player-modal"
        )
        .forEach(
            (modal) => {

                modal.hidden =
                    true;

                modal.setAttribute(
                    "aria-hidden",
                    "true"
                );

            }
        );


    document.body.classList.remove(
        "admin-player-modal-open"
    );

}


/* =========================================================
   FILTERING AND SORTING
========================================================= */

function adminPlayersReadFilters() {

    adminPlayersState.filters.search =
        adminPlayersDOM.searchInput?.value.trim() ||
        "";

    adminPlayersState.filters.verification =
        adminPlayersDOM.verificationFilter?.value ||
        "";

    adminPlayersState.filters.position =
        adminPlayersDOM.positionFilter?.value ||
        "";

    adminPlayersState.filters.ageGroup =
        adminPlayersDOM.ageGroupFilter?.value ||
        "";

    adminPlayersState.filters.state =
        adminPlayersDOM.stateFilter?.value ||
        "";

    adminPlayersState.filters.visibility =
        adminPlayersDOM.visibilityFilter?.value ||
        "";

    adminPlayersState.filters.sort =
        adminPlayersDOM.sortFilter?.value ||
        "latest";

}


function adminPlayersApplyFilters() {

    adminPlayersReadFilters();


    const searchTerm =
        adminPlayersNormalizeText(
            adminPlayersState.filters.search
        );


    let players =
        [...adminPlayersState.players];


    players =
        players.filter(
            (player) => {

                const searchableText =
                    adminPlayersNormalizeText(
                        [

                            player.name,
                            player.id,
                            player.email,
                            player.phone,
                            player.city,
                            player.state,
                            player.academy,
                            player.position,
                            player.secondaryPosition

                        ].join(
                            " "
                        )
                    );


                const matchesSearch =
                    !searchTerm ||
                    searchableText.includes(
                        searchTerm
                    );


                const matchesVerification =
                    !adminPlayersState.filters.verification ||
                    player.verification ===
                    adminPlayersState.filters.verification;


                const matchesPosition =
                    !adminPlayersState.filters.position ||
                    player.position ===
                    adminPlayersState.filters.position;


                const matchesAgeGroup =
                    !adminPlayersState.filters.ageGroup ||
                    player.ageGroup ===
                    adminPlayersState.filters.ageGroup;


                const matchesState =
                    !adminPlayersState.filters.state ||
                    player.state ===
                    adminPlayersState.filters.state;


                const matchesVisibility =
                    !adminPlayersState.filters.visibility ||
                    player.visibility ===
                    adminPlayersState.filters.visibility;


                return (
                    matchesSearch &&
                    matchesVerification &&
                    matchesPosition &&
                    matchesAgeGroup &&
                    matchesState &&
                    matchesVisibility
                );

            }
        );


    players.sort(
        (firstPlayer, secondPlayer) => {

            switch (
                adminPlayersState.filters.sort
            ) {

                case "oldest":

                    return (
                        new Date(
                            firstPlayer.createdAt
                        ) -
                        new Date(
                            secondPlayer.createdAt
                        )
                    );


                case "name-asc":

                    return String(
                        firstPlayer.name
                    ).localeCompare(
                        String(
                            secondPlayer.name
                        )
                    );


                case "name-desc":

                    return String(
                        secondPlayer.name
                    ).localeCompare(
                        String(
                            firstPlayer.name
                        )
                    );


                case "rating-high":

                    return (
                        Number(
                            secondPlayer.rating
                        ) -
                        Number(
                            firstPlayer.rating
                        )
                    );


                case "completion-high":

                    return (
                        Number(
                            secondPlayer.profileCompletion
                        ) -
                        Number(
                            firstPlayer.profileCompletion
                        )
                    );


                case "latest":
                default:

                    return (
                        new Date(
                            secondPlayer.createdAt
                        ) -
                        new Date(
                            firstPlayer.createdAt
                        )
                    );

            }

        }
    );


    adminPlayersState.filteredPlayers =
        players;

    adminPlayersState.pagination.totalItems =
        players.length;

    adminPlayersState.pagination.totalPages =
        Math.max(
            1,
            Math.ceil(
                players.length /
                adminPlayersState.pagination.pageSize
            )
        );


    if (
        adminPlayersState.pagination.currentPage >
        adminPlayersState.pagination.totalPages
    ) {

        adminPlayersState.pagination.currentPage =
            adminPlayersState.pagination.totalPages;

    }


    adminPlayersRender();

}


/* =========================================================
   PAGINATION HELPERS
========================================================= */

function adminPlayersGetPaginatedPlayers() {

    const startIndex =
        (
            adminPlayersState.pagination.currentPage -
            1
        ) *
        adminPlayersState.pagination.pageSize;

    const endIndex =
        startIndex +
        adminPlayersState.pagination.pageSize;


    return adminPlayersState.filteredPlayers.slice(
        startIndex,
        endIndex
    );

}


function adminPlayersChangePage(
    pageNumber
) {

    const safePage =
        Math.min(
            Math.max(
                Number(
                    pageNumber
                ) || 1,
                1
            ),
            adminPlayersState.pagination.totalPages
        );


    if (
        safePage ===
        adminPlayersState.pagination.currentPage
    ) {

        return;

    }


    adminPlayersState.pagination.currentPage =
        safePage;

    adminPlayersRenderTable();

    adminPlayersRenderPagination();


    adminPlayersDOM.tableBody
        ?.closest(
            ".admin-players-table-card"
        )
        ?.scrollIntoView(
            {

                behavior:
                    "smooth",

                block:
                    "start"

            }
        );

}

/* =========================================================
   ADMIN PLAYERS
   FILE: admin-players.js
   PART 1C
========================================================= */


/* =========================================================
   METRICS
========================================================= */

function adminPlayersCalculateMetrics() {

    const players =
        adminPlayersState.players;


    adminPlayersState.metrics.total =
        players.length;


    adminPlayersState.metrics.verified =
        players.filter(
            (player) =>
                player.verification ===
                "verified"
        ).length;


    adminPlayersState.metrics.pending =
        players.filter(
            (player) =>
                player.verification ===
                "pending"
        ).length;


    adminPlayersState.metrics.scoutVisible =
        players.filter(
            (player) =>
                player.visibility ===
                "visible"
        ).length;

}


function adminPlayersSetMetricValue(
    elementId,
    value
) {

    const element =
        document.getElementById(
            elementId
        );


    if (element) {

        element.textContent =
            new Intl.NumberFormat(
                "en-IN"
            ).format(
                Number(
                    value
                ) || 0
            );

    }

}


function adminPlayersRenderMetrics() {

    adminPlayersCalculateMetrics();


    adminPlayersSetMetricValue(
        "adminTotalPlayersMetric",
        adminPlayersState.metrics.total
    );


    adminPlayersSetMetricValue(
        "adminVerifiedPlayersMetric",
        adminPlayersState.metrics.verified
    );


    adminPlayersSetMetricValue(
        "adminPendingPlayersMetric",
        adminPlayersState.metrics.pending
    );


    adminPlayersSetMetricValue(
        "adminScoutVisiblePlayersMetric",
        adminPlayersState.metrics.scoutVisible
    );

}


/* =========================================================
   TABLE ROW HTML
========================================================= */

function adminPlayersCreateAvatarHTML(
    player
) {

    const escapedName =
        adminPlayersEscapeHTML(
            player.name
        );


    if (player.profileImage) {

        return `

            <div class="admin-player-table-avatar">

                <img
                    src="${adminPlayersEscapeHTML(
                        player.profileImage
                    )}"
                    alt="${escapedName}"
                    loading="lazy"
                    onerror="
                        this.remove();
                        this.parentElement.textContent =
                        '${adminPlayersEscapeHTML(
                            adminPlayersGetInitials(
                                player.name
                            )
                        )}';
                    "
                >

            </div>

        `;

    }


    return `

        <div
            class="admin-player-table-avatar"
            aria-hidden="true"
        >
            ${adminPlayersEscapeHTML(
                adminPlayersGetInitials(
                    player.name
                )
            )}
        </div>

    `;

}


function adminPlayersCreateVerificationBadgeHTML(
    verification
) {

    const verificationMap = {

        verified: {

            icon:
                "fa-circle-check",

            label:
                "Verified",

            className:
                "admin-player-status-verified"

        },

        pending: {

            icon:
                "fa-clock",

            label:
                "Pending",

            className:
                "admin-player-status-pending"

        },

        rejected: {

            icon:
                "fa-circle-xmark",

            label:
                "Rejected",

            className:
                "admin-player-status-rejected"

        },

        incomplete: {

            icon:
                "fa-circle-exclamation",

            label:
                "Incomplete",

            className:
                "admin-player-status-incomplete"

        }

    };


    const status =
        verificationMap[
            verification
        ] ||
        verificationMap.incomplete;


    return `

        <span
            class="
                admin-player-status-badge
                ${status.className}
            "
        >

            <i
                class="fa-solid ${status.icon}"
                aria-hidden="true"
            ></i>

            ${status.label}

        </span>

    `;

}


function adminPlayersCreateVisibilityBadgeHTML(
    visibility
) {

    const visibilityMap = {

        visible: {

            icon:
                "fa-eye",

            label:
                "Visible",

            className:
                "admin-player-visibility-visible"

        },

        hidden: {

            icon:
                "fa-eye-slash",

            label:
                "Hidden",

            className:
                "admin-player-visibility-hidden"

        },

        restricted: {

            icon:
                "fa-lock",

            label:
                "Restricted",

            className:
                "admin-player-visibility-restricted"

        }

    };


    const status =
        visibilityMap[
            visibility
        ] ||
        visibilityMap.hidden;


    return `

        <span
            class="
                admin-player-visibility-badge
                ${status.className}
            "
        >

            <i
                class="fa-solid ${status.icon}"
                aria-hidden="true"
            ></i>

            ${status.label}

        </span>

    `;

}


function adminPlayersCreateTableRowHTML(
    player
) {

    const playerId =
        String(
            player.id
        );

    const isSelected =
        adminPlayersState.selectedPlayerIds.has(
            playerId
        );

    const lastActive =
        adminPlayersFormatRelativeTime(
            player.lastActive
        );

    const age =
        adminPlayersCalculateAge(
            player.dateOfBirth
        );

    const profileCompletion =
        Math.min(
            100,
            Math.max(
                0,
                Number(
                    player.profileCompletion
                ) || 0
            )
        );


    return `

        <tr
            data-player-id="${adminPlayersEscapeHTML(
                playerId
            )}"
        >

            <td>

                <input
                    class="admin-player-row-checkbox"
                    type="checkbox"
                    value="${adminPlayersEscapeHTML(
                        playerId
                    )}"
                    aria-label="Select ${adminPlayersEscapeHTML(
                        player.name
                    )}"
                    ${isSelected ? "checked" : ""}
                >

            </td>

            <td>

                <div class="admin-player-table-identity">

                    ${adminPlayersCreateAvatarHTML(
                        player
                    )}

                    <div class="admin-player-table-copy">

                        <strong>
                            ${adminPlayersEscapeHTML(
                                player.name
                            )}
                        </strong>

                        <span>
                            ${adminPlayersEscapeHTML(
                                player.email
                            )}
                        </span>

                        <small>
                            ${adminPlayersEscapeHTML(
                                player.id
                            )}
                        </small>

                    </div>

                </div>

            </td>

            <td>

                <div class="admin-player-position-cell">

                    <strong>
                        ${adminPlayersEscapeHTML(
                            adminPlayersFormatLabel(
                                player.position
                            )
                        )}
                    </strong>

                    <span>
                        ${adminPlayersEscapeHTML(
                            adminPlayersFormatLabel(
                                player.secondaryPosition
                            )
                        )}
                    </span>

                </div>

            </td>

            <td>

                <span
                    class="admin-player-position-badge"
                >
                    ${adminPlayersEscapeHTML(
                        adminPlayersFormatLabel(
                            player.ageGroup
                        )
                    )}
                    ${age !== null
                        ? `• ${age} yrs`
                        : ""}
                </span>

            </td>

            <td>

                <div class="admin-player-academy-cell">

                    <strong>
                        ${adminPlayersEscapeHTML(
                            player.academy ||
                            "Independent Player"
                        )}
                    </strong>

                    <span>
                        ${adminPlayersEscapeHTML(
                            player.academyLocation ||
                            `${player.city || ""}${player.city && player.state ? ", " : ""}${player.state || ""}`
                        )}
                    </span>

                </div>

            </td>

            <td>

                ${adminPlayersCreateVerificationBadgeHTML(
                    player.verification
                )}

            </td>

            <td>

                ${adminPlayersCreateVisibilityBadgeHTML(
                    player.visibility
                )}

            </td>

            <td>

                <div class="admin-player-profile-progress">

                    <div class="admin-player-profile-progress-header">

                        <span>
                            Profile
                        </span>

                        <strong>
                            ${profileCompletion}%
                        </strong>

                    </div>

                    <div
                        class="admin-player-profile-progress-track"
                        aria-hidden="true"
                    >

                        <div
                            class="admin-player-profile-progress-bar"
                            style="width: ${profileCompletion}%"
                        ></div>

                    </div>

                </div>

            </td>

            <td>

                <div class="admin-player-rating">

                    <i
                        class="fa-solid fa-star"
                        aria-hidden="true"
                    ></i>

                    ${Number(
                        player.rating
                    ).toFixed(
                        1
                    )}

                </div>

            </td>

            <td>

                <div class="admin-player-last-active">

                    <strong>
                        ${adminPlayersEscapeHTML(
                            lastActive.relative
                        )}
                    </strong>

                    <span>
                        ${adminPlayersEscapeHTML(
                            lastActive.exact
                        )}
                    </span>

                </div>

            </td>

            <td>

                <div class="admin-player-row-actions">

                    <button
                        class="admin-player-row-action-button"
                        type="button"
                        data-action="view"
                        data-player-id="${adminPlayersEscapeHTML(
                            playerId
                        )}"
                        aria-label="View ${adminPlayersEscapeHTML(
                            player.name
                        )}"
                        title="View player"
                    >

                        <i
                            class="fa-solid fa-eye"
                            aria-hidden="true"
                        ></i>

                    </button>

                    <button
                        class="admin-player-row-action-button"
                        type="button"
                        data-action="edit"
                        data-player-id="${adminPlayersEscapeHTML(
                            playerId
                        )}"
                        aria-label="Edit ${adminPlayersEscapeHTML(
                            player.name
                        )}"
                        title="Edit player"
                    >

                        <i
                            class="fa-solid fa-pen"
                            aria-hidden="true"
                        ></i>

                    </button>

                    ${
                        player.verification !==
                        "verified"
                            ? `

                                <button
                                    class="
                                        admin-player-row-action-button
                                        success
                                    "
                                    type="button"
                                    data-action="verify"
                                    data-player-id="${adminPlayersEscapeHTML(
                                        playerId
                                    )}"
                                    aria-label="Verify ${adminPlayersEscapeHTML(
                                        player.name
                                    )}"
                                    title="Verify player"
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
                        class="
                            admin-player-row-action-button
                            danger
                        "
                        type="button"
                        data-action="delete"
                        data-player-id="${adminPlayersEscapeHTML(
                            playerId
                        )}"
                        aria-label="Delete ${adminPlayersEscapeHTML(
                            player.name
                        )}"
                        title="Delete player"
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
   TABLE STATES
========================================================= */

function adminPlayersRenderLoadingRows() {

    if (
        !adminPlayersDOM.tableBody
    ) {

        return;

    }


    const rows =
        Array.from(
            {
                length:
                    5
            },
            () => `

                <tr class="admin-players-loading-row">

                    <td>
                        <div class="admin-player-skeleton short"></div>
                    </td>

                    <td>
                        <div class="admin-player-skeleton medium"></div>
                    </td>

                    <td>
                        <div class="admin-player-skeleton short"></div>
                    </td>

                    <td>
                        <div class="admin-player-skeleton short"></div>
                    </td>

                    <td>
                        <div class="admin-player-skeleton medium"></div>
                    </td>

                    <td>
                        <div class="admin-player-skeleton short"></div>
                    </td>

                    <td>
                        <div class="admin-player-skeleton short"></div>
                    </td>

                    <td>
                        <div class="admin-player-skeleton medium"></div>
                    </td>

                    <td>
                        <div class="admin-player-skeleton short"></div>
                    </td>

                    <td>
                        <div class="admin-player-skeleton medium"></div>
                    </td>

                    <td>
                        <div class="admin-player-skeleton medium"></div>
                    </td>

                </tr>

            `
        ).join(
            ""
        );


    adminPlayersDOM.tableBody.innerHTML =
        rows;

}


function adminPlayersRenderEmptyState() {

    if (
        !adminPlayersDOM.tableBody
    ) {

        return;

    }


    adminPlayersDOM.tableBody.innerHTML = `

        <tr>

            <td
                class="admin-players-table-state"
                colspan="11"
            >

                <div class="admin-players-table-state-content">

                    <div class="admin-players-table-state-icon">

                        <i
                            class="fa-solid fa-users-slash"
                            aria-hidden="true"
                        ></i>

                    </div>

                    <h4>
                        No players found
                    </h4>

                    <p>

                        Try changing the search term or clearing
                        one or more filters.

                    </p>

                    <button
                        class="admin-players-secondary-button"
                        id="adminEmptyStateResetFiltersButton"
                        type="button"
                    >
                        Reset Filters
                    </button>

                </div>

            </td>

        </tr>

    `;


    document
        .getElementById(
            "adminEmptyStateResetFiltersButton"
        )
        ?.addEventListener(
            "click",
            adminPlayersResetFilters
        );

}


/* =========================================================
   TABLE RENDER
========================================================= */

function adminPlayersRenderTable() {

    if (
        !adminPlayersDOM.tableBody
    ) {

        return;

    }


    if (
        adminPlayersState.loading
    ) {

        adminPlayersRenderLoadingRows();

        return;

    }


    const paginatedPlayers =
        adminPlayersGetPaginatedPlayers();


    if (
        paginatedPlayers.length ===
        0
    ) {

        adminPlayersRenderEmptyState();

        adminPlayersUpdateTableSummary();

        return;

    }


    adminPlayersDOM.tableBody.innerHTML =
        paginatedPlayers
            .map(
                adminPlayersCreateTableRowHTML
            )
            .join(
                ""
            );


    adminPlayersUpdateTableSummary();

    adminPlayersUpdateSelectAllState();

}


/* =========================================================
   TABLE SUMMARY
========================================================= */

function adminPlayersUpdateTableSummary() {

    if (
        !adminPlayersDOM.tableSummary
    ) {

        return;

    }


    const total =
        adminPlayersState.pagination.totalItems;


    if (
        total ===
        0
    ) {

        adminPlayersDOM.tableSummary.textContent =
            "No players to display.";

        return;

    }


    const start =
        (
            adminPlayersState.pagination.currentPage -
            1
        ) *
        adminPlayersState.pagination.pageSize +
        1;

    const end =
        Math.min(
            start +
            adminPlayersState.pagination.pageSize -
            1,
            total
        );


    adminPlayersDOM.tableSummary.textContent =
        `Showing ${start}–${end} of ${total} players`;

}


/* =========================================================
   PAGINATION RENDER
========================================================= */

function adminPlayersBuildPaginationItems() {

    const totalPages =
        adminPlayersState.pagination.totalPages;

    const currentPage =
        adminPlayersState.pagination.currentPage;

    const maximumVisiblePages =
        ADMIN_PLAYERS_CONFIG.pagination.maximumVisiblePages;


    if (
        totalPages <=
        maximumVisiblePages
    ) {

        return Array.from(
            {
                length:
                    totalPages
            },
            (
                _,
                index
            ) =>
                index +
                1
        );

    }


    const items =
        [1];


    const start =
        Math.max(
            2,
            currentPage -
            1
        );

    const end =
        Math.min(
            totalPages -
            1,
            currentPage +
            1
        );


    if (
        start >
        2
    ) {

        items.push(
            "ellipsis-start"
        );

    }


    for (
        let page =
            start;
        page <=
        end;
        page +=
            1
    ) {

        items.push(
            page
        );

    }


    if (
        end <
        totalPages -
        1
    ) {

        items.push(
            "ellipsis-end"
        );

    }


    items.push(
        totalPages
    );


    return items;

}


function adminPlayersRenderPagination() {

    if (
        !adminPlayersDOM.pagination
    ) {

        return;

    }


    const items =
        adminPlayersBuildPaginationItems();


    adminPlayersDOM.pagination.innerHTML =
        items
            .map(
                (item) => {

                    if (
                        typeof item ===
                        "string"
                    ) {

                        return `

                            <span
                                class="admin-players-pagination-ellipsis"
                                aria-hidden="true"
                            >
                                …
                            </span>

                        `;

                    }


                    const isActive =
                        item ===
                        adminPlayersState.pagination.currentPage;


                    return `

                        <button
                            class="
                                admin-players-page-number
                                ${isActive ? "active" : ""}
                            "
                            type="button"
                            data-page="${item}"
                            aria-label="Go to page ${item}"
                            ${isActive
                                ? 'aria-current="page"'
                                : ""}
                        >
                            ${item}
                        </button>

                    `;

                }
            )
            .join(
                ""
            );


    if (
        adminPlayersDOM.previousPageButton
    ) {

        adminPlayersDOM.previousPageButton.disabled =
            adminPlayersState.pagination.currentPage <=
            1;

    }


    if (
        adminPlayersDOM.nextPageButton
    ) {

        adminPlayersDOM.nextPageButton.disabled =
            adminPlayersState.pagination.currentPage >=
            adminPlayersState.pagination.totalPages;

    }

}


/* =========================================================
   SELECTION
========================================================= */

function adminPlayersUpdateSelectAllState() {

    if (
        !adminPlayersDOM.selectAllCheckbox
    ) {

        return;

    }


    const visiblePlayers =
        adminPlayersGetPaginatedPlayers();

    const visibleIds =
        visiblePlayers.map(
            (player) =>
                String(
                    player.id
                )
        );

    const selectedVisibleCount =
        visibleIds.filter(
            (playerId) =>
                adminPlayersState.selectedPlayerIds.has(
                    playerId
                )
        ).length;


    adminPlayersDOM.selectAllCheckbox.checked =
        visibleIds.length >
        0 &&
        selectedVisibleCount ===
        visibleIds.length;


    adminPlayersDOM.selectAllCheckbox.indeterminate =
        selectedVisibleCount >
        0 &&
        selectedVisibleCount <
        visibleIds.length;


    adminPlayersRenderBulkActions();

}


function adminPlayersRenderBulkActions() {

    if (
        !adminPlayersDOM.bulkActionsBar ||
        !adminPlayersDOM.selectedPlayersCount
    ) {

        return;

    }


    const count =
        adminPlayersState.selectedPlayerIds.size;


    adminPlayersDOM.bulkActionsBar.hidden =
        count ===
        0;


    adminPlayersDOM.selectedPlayersCount.textContent =
        `${count} player${count === 1 ? "" : "s"} selected`;

}


function adminPlayersClearSelection() {

    adminPlayersState.selectedPlayerIds.clear();

    adminPlayersRenderTable();

    adminPlayersRenderBulkActions();

}


/* =========================================================
   MAIN RENDER
========================================================= */

function adminPlayersRender() {

    adminPlayersRenderMetrics();

    adminPlayersRenderTable();

    adminPlayersRenderPagination();

    adminPlayersRenderBulkActions();

}

/* =========================================================
   ADMIN PLAYERS
   FILE: admin-players.js
   PART 1D
========================================================= */


/* =========================================================
   PLAYER DETAILS MODAL
========================================================= */

function adminPlayersCreateDetailItemHTML(
    label,
    value
) {

    return `

        <div class="admin-player-detail-item">

            <span>
                ${adminPlayersEscapeHTML(
                    label
                )}
            </span>

            <strong>
                ${adminPlayersEscapeHTML(
                    value ||
                    "Not available"
                )}
            </strong>

        </div>

    `;

}


function adminPlayersRenderPlayerDetails(
    player
) {

    if (
        !adminPlayersDOM.playerDetailsContent ||
        !player
    ) {

        return;

    }


    const age =
        adminPlayersCalculateAge(
            player.dateOfBirth
        );

    const location =
        [
            player.city,
            player.state
        ]
            .filter(
                Boolean
            )
            .join(
                ", "
            );

    const avatarHTML =
        player.profileImage
            ? `

                <img
                    class="admin-player-details-avatar"
                    src="${adminPlayersEscapeHTML(
                        player.profileImage
                    )}"
                    alt="${adminPlayersEscapeHTML(
                        player.name
                    )}"
                    onerror="
                        this.outerHTML =
                        '<div class=&quot;admin-player-details-avatar-placeholder&quot;>${adminPlayersEscapeHTML(
                            adminPlayersGetInitials(
                                player.name
                            )
                        )}</div>';
                    "
                >

            `
            : `

                <div
                    class="admin-player-details-avatar-placeholder"
                    aria-hidden="true"
                >
                    ${adminPlayersEscapeHTML(
                        adminPlayersGetInitials(
                            player.name
                        )
                    )}
                </div>

            `;


    adminPlayersDOM.playerDetailsContent.innerHTML = `

        <section class="admin-player-details-hero">

            ${avatarHTML}

            <div class="admin-player-details-heading">

                <h3>
                    ${adminPlayersEscapeHTML(
                        player.name
                    )}
                </h3>

                <p>
                    ${adminPlayersEscapeHTML(
                        player.email
                    )}
                </p>

                <div class="admin-player-details-badges">

                    ${adminPlayersCreateVerificationBadgeHTML(
                        player.verification
                    )}

                    ${adminPlayersCreateVisibilityBadgeHTML(
                        player.visibility
                    )}

                    <span class="admin-player-position-badge">

                        ${adminPlayersEscapeHTML(
                            adminPlayersFormatLabel(
                                player.position
                            )
                        )}

                    </span>

                </div>

            </div>

        </section>


        <section class="admin-player-details-grid">

            ${adminPlayersCreateDetailItemHTML(
                "Player ID",
                player.id
            )}

            ${adminPlayersCreateDetailItemHTML(
                "Age",
                age !== null
                    ? `${age} years`
                    : "Not available"
            )}

            ${adminPlayersCreateDetailItemHTML(
                "Date of Birth",
                adminPlayersFormatDate(
                    player.dateOfBirth
                )
            )}

            ${adminPlayersCreateDetailItemHTML(
                "Gender",
                adminPlayersFormatLabel(
                    player.gender
                )
            )}

            ${adminPlayersCreateDetailItemHTML(
                "Location",
                location
            )}

            ${adminPlayersCreateDetailItemHTML(
                "Phone",
                player.phone
            )}

            ${adminPlayersCreateDetailItemHTML(
                "Primary Position",
                adminPlayersFormatLabel(
                    player.position
                )
            )}

            ${adminPlayersCreateDetailItemHTML(
                "Secondary Position",
                adminPlayersFormatLabel(
                    player.secondaryPosition
                )
            )}

            ${adminPlayersCreateDetailItemHTML(
                "Preferred Foot",
                adminPlayersFormatLabel(
                    player.preferredFoot
                )
            )}

            ${adminPlayersCreateDetailItemHTML(
                "Age Group",
                adminPlayersFormatLabel(
                    player.ageGroup
                )
            )}

            ${adminPlayersCreateDetailItemHTML(
                "Height",
                player.height
            )}

            ${adminPlayersCreateDetailItemHTML(
                "Weight",
                player.weight
            )}

            ${adminPlayersCreateDetailItemHTML(
                "Nationality",
                player.nationality
            )}

            ${adminPlayersCreateDetailItemHTML(
                "Academy",
                player.academy ||
                "Independent Player"
            )}

            ${adminPlayersCreateDetailItemHTML(
                "Academy Location",
                player.academyLocation
            )}

            ${adminPlayersCreateDetailItemHTML(
                "Profile Completion",
                `${Number(
                    player.profileCompletion
                ) || 0}%`
            )}

            ${adminPlayersCreateDetailItemHTML(
                "Scout Rating",
                Number(
                    player.rating
                ).toFixed(
                    1
                )
            )}

            ${adminPlayersCreateDetailItemHTML(
                "Documents",
                player.documentsComplete
                    ? "Complete"
                    : "Incomplete"
            )}

            ${adminPlayersCreateDetailItemHTML(
                "Registered",
                adminPlayersFormatDate(
                    player.createdAt
                )
            )}

            ${adminPlayersCreateDetailItemHTML(
                "Last Active",
                adminPlayersFormatDateTime(
                    player.lastActive
                )
            )}

        </section>


        <section class="admin-player-details-section">

            <div class="admin-player-details-section-header">

                <h4>
                    Guardian Information
                </h4>

                <span>
                    Parent or legal guardian
                </span>

            </div>

            <div class="admin-player-details-grid">

                ${adminPlayersCreateDetailItemHTML(
                    "Guardian Name",
                    player.guardianName
                )}

                ${adminPlayersCreateDetailItemHTML(
                    "Guardian Phone",
                    player.guardianPhone
                )}

            </div>

        </section>


        <section class="admin-player-details-note">

            <strong>
                Administrative Note
            </strong>

            <p>
                ${adminPlayersEscapeHTML(
                    player.note ||
                    "No administrative note has been added."
                )}
            </p>

        </section>

    `;

}


/* =========================================================
   EDIT FORM FIELDS
========================================================= */

function adminPlayersCreateEditFormHTML(
    player
) {

    return `

        <label>

            <span>
                Full Name
            </span>

            <input
                id="adminEditPlayerName"
                name="name"
                type="text"
                value="${adminPlayersEscapeHTML(
                    player.name
                )}"
                autocomplete="name"
                required
            >

            <small data-edit-error-for="name"></small>

        </label>


        <label>

            <span>
                Email Address
            </span>

            <input
                id="adminEditPlayerEmail"
                name="email"
                type="email"
                value="${adminPlayersEscapeHTML(
                    player.email
                )}"
                autocomplete="email"
                required
            >

            <small data-edit-error-for="email"></small>

        </label>


        <label>

            <span>
                Phone Number
            </span>

            <input
                id="adminEditPlayerPhone"
                name="phone"
                type="tel"
                value="${adminPlayersEscapeHTML(
                    player.phone
                )}"
                autocomplete="tel"
            >

            <small data-edit-error-for="phone"></small>

        </label>


        <label>

            <span>
                Date of Birth
            </span>

            <input
                id="adminEditPlayerDateOfBirth"
                name="dateOfBirth"
                type="date"
                value="${adminPlayersEscapeHTML(
                    player.dateOfBirth
                )}"
                required
            >

            <small data-edit-error-for="dateOfBirth"></small>

        </label>


        <label>

            <span>
                Gender
            </span>

            <select
                id="adminEditPlayerGender"
                name="gender"
                required
            >

                <option value="">
                    Select gender
                </option>

                <option
                    value="male"
                    ${player.gender === "male" ? "selected" : ""}
                >
                    Male
                </option>

                <option
                    value="female"
                    ${player.gender === "female" ? "selected" : ""}
                >
                    Female
                </option>

                <option
                    value="other"
                    ${player.gender === "other" ? "selected" : ""}
                >
                    Other
                </option>

            </select>

            <small data-edit-error-for="gender"></small>

        </label>


        <label>

            <span>
                State
            </span>

            <input
                id="adminEditPlayerState"
                name="state"
                type="text"
                value="${adminPlayersEscapeHTML(
                    player.state
                )}"
                required
            >

            <small data-edit-error-for="state"></small>

        </label>


        <label>

            <span>
                City
            </span>

            <input
                id="adminEditPlayerCity"
                name="city"
                type="text"
                value="${adminPlayersEscapeHTML(
                    player.city
                )}"
            >

            <small data-edit-error-for="city"></small>

        </label>


        <label>

            <span>
                Primary Position
            </span>

            <select
                id="adminEditPlayerPosition"
                name="position"
                required
            >

                <option value="">
                    Select position
                </option>

                <option
                    value="goalkeeper"
                    ${player.position === "goalkeeper" ? "selected" : ""}
                >
                    Goalkeeper
                </option>

                <option
                    value="defender"
                    ${player.position === "defender" ? "selected" : ""}
                >
                    Defender
                </option>

                <option
                    value="midfielder"
                    ${player.position === "midfielder" ? "selected" : ""}
                >
                    Midfielder
                </option>

                <option
                    value="forward"
                    ${player.position === "forward" ? "selected" : ""}
                >
                    Forward
                </option>

            </select>

            <small data-edit-error-for="position"></small>

        </label>


        <label>

            <span>
                Secondary Position
            </span>

            <input
                id="adminEditPlayerSecondaryPosition"
                name="secondaryPosition"
                type="text"
                value="${adminPlayersEscapeHTML(
                    player.secondaryPosition
                )}"
            >

            <small data-edit-error-for="secondaryPosition"></small>

        </label>


        <label>

            <span>
                Preferred Foot
            </span>

            <select
                id="adminEditPlayerPreferredFoot"
                name="preferredFoot"
            >

                <option value="">
                    Select foot
                </option>

                <option
                    value="right"
                    ${player.preferredFoot === "right" ? "selected" : ""}
                >
                    Right
                </option>

                <option
                    value="left"
                    ${player.preferredFoot === "left" ? "selected" : ""}
                >
                    Left
                </option>

                <option
                    value="both"
                    ${player.preferredFoot === "both" ? "selected" : ""}
                >
                    Both
                </option>

            </select>

            <small data-edit-error-for="preferredFoot"></small>

        </label>


        <label>

            <span>
                Age Group
            </span>

            <select
                id="adminEditPlayerAgeGroup"
                name="ageGroup"
                required
            >

                <option value="">
                    Select age group
                </option>

                <option
                    value="u12"
                    ${player.ageGroup === "u12" ? "selected" : ""}
                >
                    U-12
                </option>

                <option
                    value="u14"
                    ${player.ageGroup === "u14" ? "selected" : ""}
                >
                    U-14
                </option>

                <option
                    value="u16"
                    ${player.ageGroup === "u16" ? "selected" : ""}
                >
                    U-16
                </option>

                <option
                    value="u18"
                    ${player.ageGroup === "u18" ? "selected" : ""}
                >
                    U-18
                </option>

                <option
                    value="u21"
                    ${player.ageGroup === "u21" ? "selected" : ""}
                >
                    U-21
                </option>

            </select>

            <small data-edit-error-for="ageGroup"></small>

        </label>


        <label>

            <span>
                Academy
            </span>

            <input
                id="adminEditPlayerAcademy"
                name="academy"
                type="text"
                value="${adminPlayersEscapeHTML(
                    player.academy
                )}"
            >

            <small data-edit-error-for="academy"></small>

        </label>


        <label>

            <span>
                Verification Status
            </span>

            <select
                id="adminEditPlayerVerification"
                name="verification"
            >

                <option
                    value="pending"
                    ${player.verification === "pending" ? "selected" : ""}
                >
                    Pending
                </option>

                <option
                    value="verified"
                    ${player.verification === "verified" ? "selected" : ""}
                >
                    Verified
                </option>

                <option
                    value="rejected"
                    ${player.verification === "rejected" ? "selected" : ""}
                >
                    Rejected
                </option>

                <option
                    value="incomplete"
                    ${player.verification === "incomplete" ? "selected" : ""}
                >
                    Incomplete
                </option>

            </select>

            <small data-edit-error-for="verification"></small>

        </label>


        <label>

            <span>
                Profile Visibility
            </span>

            <select
                id="adminEditPlayerVisibility"
                name="visibility"
            >

                <option
                    value="visible"
                    ${player.visibility === "visible" ? "selected" : ""}
                >
                    Visible
                </option>

                <option
                    value="hidden"
                    ${player.visibility === "hidden" ? "selected" : ""}
                >
                    Hidden
                </option>

                <option
                    value="restricted"
                    ${player.visibility === "restricted" ? "selected" : ""}
                >
                    Restricted
                </option>

            </select>

            <small data-edit-error-for="visibility"></small>

        </label>


        <label class="admin-player-form-full-width">

            <span>
                Administrative Note
            </span>

            <textarea
                id="adminEditPlayerNote"
                name="note"
                rows="4"
            >${adminPlayersEscapeHTML(
                player.note
            )}</textarea>

            <small data-edit-error-for="note"></small>

        </label>

    `;

}


/* =========================================================
   FORM DATA
========================================================= */

function adminPlayersFormDataToObject(
    form
) {

    return Object.fromEntries(
        new FormData(
            form
        ).entries()
    );

}


function adminPlayersSanitizePlayerData(
    rawData
) {

    return {

        name:
            String(
                rawData.name ||
                ""
            ).trim(),

        email:
            String(
                rawData.email ||
                ""
            ).trim(),

        phone:
            String(
                rawData.phone ||
                ""
            ).trim(),

        dateOfBirth:
            rawData.dateOfBirth ||
            "",

        gender:
            rawData.gender ||
            "",

        state:
            String(
                rawData.state ||
                ""
            ).trim(),

        city:
            String(
                rawData.city ||
                ""
            ).trim(),

        position:
            rawData.position ||
            "",

        secondaryPosition:
            String(
                rawData.secondaryPosition ||
                ""
            ).trim(),

        preferredFoot:
            rawData.preferredFoot ||
            "",

        ageGroup:
            rawData.ageGroup ||
            "",

        academy:
            String(
                rawData.academy ||
                ""
            ).trim(),

        academyLocation:
            String(
                rawData.academyLocation ||
                ""
            ).trim(),

        verification:
            rawData.verification ||
            "pending",

        visibility:
            rawData.visibility ||
            "hidden",

        note:
            String(
                rawData.note ||
                ""
            ).trim(),

        guardianName:
            String(
                rawData.guardianName ||
                ""
            ).trim(),

        guardianPhone:
            String(
                rawData.guardianPhone ||
                ""
            ).trim(),

        nationality:
            String(
                rawData.nationality ||
                "Indian"
            ).trim()

    };

}


/* =========================================================
   FORM VALIDATION
========================================================= */

function adminPlayersClearFormErrors(
    form,
    errorPrefix
) {

    form
        .querySelectorAll(
            "[aria-invalid='true']"
        )
        .forEach(
            (field) => {

                field.removeAttribute(
                    "aria-invalid"
                );

            }
        );


    form
        .querySelectorAll(
            `[data-${errorPrefix}-error-for]`
        )
        .forEach(
            (errorElement) => {

                errorElement.textContent =
                    "";

            }
        );

}


function adminPlayersSetFormError(
    form,
    fieldName,
    message,
    errorPrefix
) {

    const field =
        form.elements[
            fieldName
        ];

    const errorElement =
        form.querySelector(
            `[data-${errorPrefix}-error-for="${fieldName}"]`
        );


    field?.setAttribute(
        "aria-invalid",
        "true"
    );


    if (errorElement) {

        errorElement.textContent =
            message;

    }

}


function adminPlayersValidatePlayerData(
    form,
    playerData,
    errorPrefix
) {

    adminPlayersClearFormErrors(
        form,
        errorPrefix
    );


    const errors =
        {};


    if (
        playerData.name.length <
        2
    ) {

        errors.name =
            "Enter the player's full name.";

    }


    if (
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
            playerData.email
        )
    ) {

        errors.email =
            "Enter a valid email address.";

    }


    if (
        !playerData.dateOfBirth
    ) {

        errors.dateOfBirth =
            "Select the player's date of birth.";

    } else {

        const age =
            adminPlayersCalculateAge(
                playerData.dateOfBirth
            );


        if (
            age === null ||
            age < 5 ||
            age > 30
        ) {

            errors.dateOfBirth =
                "Enter a valid player date of birth.";

        }

    }


    if (
        !playerData.gender
    ) {

        errors.gender =
            "Select a gender.";

    }


    if (
        !playerData.state
    ) {

        errors.state =
            "Enter the player's state.";

    }


    if (
        !playerData.position
    ) {

        errors.position =
            "Select a primary position.";

    }


    if (
        !playerData.ageGroup
    ) {

        errors.ageGroup =
            "Select an age group.";

    }


    Object.entries(
        errors
    ).forEach(
        ([
            fieldName,
            message
        ]) => {

            adminPlayersSetFormError(
                form,
                fieldName,
                message,
                errorPrefix
            );

        }
    );


    const firstInvalidField =
        form.querySelector(
            "[aria-invalid='true']"
        );


    firstInvalidField?.focus();


    return Object.keys(
        errors
    ).length ===
        0;

}


/* =========================================================
   OPEN PLAYER ACTION MODALS
========================================================= */

function adminPlayersOpenViewPlayer(
    playerId
) {

    const player =
        adminPlayersFindById(
            playerId
        );


    if (!player) {

        adminPlayersShowToast(
            "The selected player could not be found.",
            "error"
        );

        return;

    }


    adminPlayersState.currentPlayer =
        player;

    adminPlayersRenderPlayerDetails(
        player
    );

    adminPlayersOpenModal(
        "adminViewPlayerModal"
    );

}


function adminPlayersOpenEditPlayer(
    playerId
) {

    const player =
        adminPlayersFindById(
            playerId
        );


    if (
        !player ||
        !adminPlayersDOM.editPlayerFormFields
    ) {

        adminPlayersShowToast(
            "The selected player could not be loaded.",
            "error"
        );

        return;

    }


    adminPlayersState.currentPlayer =
        player;


    if (
        adminPlayersDOM.editPlayerId
    ) {

        adminPlayersDOM.editPlayerId.value =
            player.id;

    }


    adminPlayersDOM.editPlayerFormFields.innerHTML =
        adminPlayersCreateEditFormHTML(
            player
        );


    adminPlayersOpenModal(
        "adminEditPlayerModal"
    );

}


function adminPlayersOpenVerifyPlayer(
    playerId
) {

    const player =
        adminPlayersFindById(
            playerId
        );


    if (!player) {

        adminPlayersShowToast(
            "The selected player could not be found.",
            "error"
        );

        return;

    }


    adminPlayersState.playerPendingVerification =
        player;


    if (
        adminPlayersDOM.verifyPlayerName
    ) {

        adminPlayersDOM.verifyPlayerName.textContent =
            player.name;

    }


    adminPlayersOpenModal(
        "adminVerifyPlayerModal"
    );

}


function adminPlayersOpenDeletePlayer(
    playerId
) {

    const player =
        adminPlayersFindById(
            playerId
        );


    if (!player) {

        adminPlayersShowToast(
            "The selected player could not be found.",
            "error"
        );

        return;

    }


    adminPlayersState.playerPendingDeletion =
        player;


    if (
        adminPlayersDOM.deletePlayerId
    ) {

        adminPlayersDOM.deletePlayerId.value =
            player.id;

    }


    if (
        adminPlayersDOM.deletePlayerName
    ) {

        adminPlayersDOM.deletePlayerName.textContent =
            player.name;

    }


    if (
        adminPlayersDOM.deleteConfirmationInput
    ) {

        adminPlayersDOM.deleteConfirmationInput.value =
            "";

    }


    adminPlayersOpenModal(
        "adminDeletePlayerModal"
    );

}
/* =========================================================
   ADMIN PLAYERS
   FILE: admin-players.js
   PART 1E
========================================================= */


/* =========================================================
   ADD PLAYER
========================================================= */

async function adminPlayersHandleAddPlayer(
    event
) {

    event.preventDefault();


    if (
        !adminPlayersDOM.addPlayerForm
    ) {

        return;

    }


    const rawData =
        adminPlayersFormDataToObject(
            adminPlayersDOM.addPlayerForm
        );

    const playerData =
        adminPlayersSanitizePlayerData(
            rawData
        );


    const isValid =
        adminPlayersValidatePlayerData(
            adminPlayersDOM.addPlayerForm,
            playerData,
            "add"
        );


    if (!isValid) {

        adminPlayersShowToast(
            "Please correct the highlighted player details.",
            "warning"
        );

        return;

    }


    const submitButton =
        adminPlayersDOM.addPlayerForm.querySelector(
            "button[type='submit']"
        );

    const originalButtonHTML =
        submitButton?.innerHTML;


    try {

        if (submitButton) {

            submitButton.disabled =
                true;

            submitButton.innerHTML = `

                <i
                    class="fa-solid fa-spinner fa-spin"
                    aria-hidden="true"
                ></i>

                Adding Player

            `;

        }


        const response =
            await AdminPlayersAPI.createPlayer(
                playerData
            );


        const createdPlayer = {

            ...playerData,

            ...response?.player,

            id:
                response?.player?.id ||
                adminPlayersGeneratePlayerId(),

            verification:
                response?.player?.verification ||
                playerData.verification ||
                "pending",

            visibility:
                response?.player?.visibility ||
                playerData.visibility ||
                "hidden",

            profileCompletion:
                Number(
                    response?.player?.profileCompletion
                ) || 45,

            rating:
                Number(
                    response?.player?.rating
                ) || 0,

            createdAt:
                response?.player?.createdAt ||
                new Date().toISOString(),

            lastActive:
                response?.player?.lastActive ||
                new Date().toISOString(),

            profileImage:
                response?.player?.profileImage ||
                "",

            documentsComplete:
                Boolean(
                    response?.player?.documentsComplete
                )

        };


        adminPlayersState.players.unshift(
            createdPlayer
        );


        adminPlayersResetPagination();

        adminPlayersApplyFilters();

        adminPlayersDOM.addPlayerForm.reset();

        adminPlayersCloseModal(
            "adminAddPlayerModal"
        );


        adminPlayersShowToast(
            `${createdPlayer.name} was added successfully.`,
            "success",
            "Player Added"
        );

    } catch (error) {

        adminPlayersShowToast(
            error.message ||
            "Unable to add the player.",
            "error"
        );

    } finally {

        if (submitButton) {

            submitButton.disabled =
                false;

            submitButton.innerHTML =
                originalButtonHTML;

        }

    }

}


/* =========================================================
   EDIT PLAYER
========================================================= */

async function adminPlayersHandleEditPlayer(
    event
) {

    event.preventDefault();


    if (
        !adminPlayersDOM.editPlayerForm
    ) {

        return;

    }


    const playerId =
        adminPlayersDOM.editPlayerId?.value ||
        adminPlayersState.currentPlayer?.id;


    if (!playerId) {

        adminPlayersShowToast(
            "The player ID is missing.",
            "error"
        );

        return;

    }


    const rawData =
        adminPlayersFormDataToObject(
            adminPlayersDOM.editPlayerForm
        );

    const playerData =
        adminPlayersSanitizePlayerData(
            rawData
        );


    const isValid =
        adminPlayersValidatePlayerData(
            adminPlayersDOM.editPlayerForm,
            playerData,
            "edit"
        );


    if (!isValid) {

        adminPlayersShowToast(
            "Please correct the highlighted player details.",
            "warning"
        );

        return;

    }


    const submitButton =
        adminPlayersDOM.editPlayerForm.querySelector(
            "button[type='submit']"
        );

    const originalButtonHTML =
        submitButton?.innerHTML;


    try {

        if (submitButton) {

            submitButton.disabled =
                true;

            submitButton.innerHTML = `

                <i
                    class="fa-solid fa-spinner fa-spin"
                    aria-hidden="true"
                ></i>

                Saving Changes

            `;

        }


        const existingPlayer =
            adminPlayersFindById(
                playerId
            );


        const response =
            await AdminPlayersAPI.updatePlayer(
                playerId,
                playerData
            );


        const updatedPlayer = {

            ...existingPlayer,

            ...playerData,

            ...response?.player,

            id:
                playerId

        };


        adminPlayersState.players =
            adminPlayersState.players.map(
                (player) =>
                    String(
                        player.id
                    ) ===
                    String(
                        playerId
                    )
                        ? updatedPlayer
                        : player
            );


        adminPlayersState.currentPlayer =
            updatedPlayer;

        adminPlayersApplyFilters();

        adminPlayersCloseModal(
            "adminEditPlayerModal"
        );


        adminPlayersShowToast(
            `${updatedPlayer.name}'s profile was updated.`,
            "success",
            "Changes Saved"
        );

    } catch (error) {

        adminPlayersShowToast(
            error.message ||
            "Unable to update the player.",
            "error"
        );

    } finally {

        if (submitButton) {

            submitButton.disabled =
                false;

            submitButton.innerHTML =
                originalButtonHTML;

        }

    }

}


/* =========================================================
   VERIFY PLAYER
========================================================= */

async function adminPlayersHandleVerifyPlayer() {

    const player =
        adminPlayersState.playerPendingVerification;


    if (!player) {

        adminPlayersShowToast(
            "No player was selected for verification.",
            "error"
        );

        return;

    }


    const confirmButton =
        document.getElementById(
            "adminConfirmVerifyPlayerButton"
        );

    const originalButtonHTML =
        confirmButton?.innerHTML;


    try {

        if (confirmButton) {

            confirmButton.disabled =
                true;

            confirmButton.innerHTML = `

                <i
                    class="fa-solid fa-spinner fa-spin"
                    aria-hidden="true"
                ></i>

                Verifying

            `;

        }


        await AdminPlayersAPI.verifyPlayer(
            player.id
        );


        adminPlayersState.players =
            adminPlayersState.players.map(
                (existingPlayer) =>
                    String(
                        existingPlayer.id
                    ) ===
                    String(
                        player.id
                    )
                        ? {

                            ...existingPlayer,

                            verification:
                                "verified"

                        }
                        : existingPlayer
            );


        adminPlayersState.playerPendingVerification =
            null;

        adminPlayersApplyFilters();

        adminPlayersCloseModal(
            "adminVerifyPlayerModal"
        );


        adminPlayersShowToast(
            `${player.name} is now verified.`,
            "success",
            "Player Verified"
        );

    } catch (error) {

        adminPlayersShowToast(
            error.message ||
            "Unable to verify the player.",
            "error"
        );

    } finally {

        if (confirmButton) {

            confirmButton.disabled =
                false;

            confirmButton.innerHTML =
                originalButtonHTML;

        }

    }

}


/* =========================================================
   DELETE PLAYER
========================================================= */

async function adminPlayersHandleDeletePlayer(
    event
) {

    event.preventDefault();


    const player =
        adminPlayersState.playerPendingDeletion;

    const confirmation =
        adminPlayersDOM.deleteConfirmationInput
            ?.value
            .trim()
            .toUpperCase() ||
        "";


    if (!player) {

        adminPlayersShowToast(
            "No player was selected for deletion.",
            "error"
        );

        return;

    }


    const errorElement =
        adminPlayersDOM.deletePlayerForm?.querySelector(
            '[data-delete-player-error-for="confirmation"]'
        );


    if (
        confirmation !==
        "DELETE"
    ) {

        if (errorElement) {

            errorElement.textContent =
                'Type "DELETE" to confirm.';

        }


        adminPlayersDOM.deleteConfirmationInput?.setAttribute(
            "aria-invalid",
            "true"
        );

        adminPlayersDOM.deleteConfirmationInput?.focus();

        return;

    }


    if (errorElement) {

        errorElement.textContent =
            "";

    }


    adminPlayersDOM.deleteConfirmationInput?.removeAttribute(
        "aria-invalid"
    );


    const submitButton =
        adminPlayersDOM.deletePlayerForm?.querySelector(
            "button[type='submit']"
        );

    const originalButtonHTML =
        submitButton?.innerHTML;


    try {

        if (submitButton) {

            submitButton.disabled =
                true;

            submitButton.innerHTML = `

                <i
                    class="fa-solid fa-spinner fa-spin"
                    aria-hidden="true"
                ></i>

                Deleting

            `;

        }


        await AdminPlayersAPI.deletePlayer(
            player.id
        );


        adminPlayersState.players =
            adminPlayersState.players.filter(
                (existingPlayer) =>
                    String(
                        existingPlayer.id
                    ) !==
                    String(
                        player.id
                    )
            );


        adminPlayersState.selectedPlayerIds.delete(
            String(
                player.id
            )
        );

        adminPlayersState.playerPendingDeletion =
            null;

        adminPlayersApplyFilters();

        adminPlayersCloseModal(
            "adminDeletePlayerModal"
        );


        adminPlayersShowToast(
            `${player.name} was removed from the platform.`,
            "success",
            "Player Deleted"
        );

    } catch (error) {

        adminPlayersShowToast(
            error.message ||
            "Unable to delete the player.",
            "error"
        );

    } finally {

        if (submitButton) {

            submitButton.disabled =
                false;

            submitButton.innerHTML =
                originalButtonHTML;

        }

    }

}


/* =========================================================
   BULK ACTIONS
========================================================= */

async function adminPlayersHandleBulkVerify() {

    const selectedPlayers =
        adminPlayersGetSelectedPlayers();


    if (
        selectedPlayers.length ===
        0
    ) {

        return;

    }


    const playerIds =
        selectedPlayers.map(
            (player) =>
                String(
                    player.id
                )
        );


    try {

        await AdminPlayersAPI.bulkVerifyPlayers(
            playerIds
        );


        adminPlayersState.players =
            adminPlayersState.players.map(
                (player) =>
                    playerIds.includes(
                        String(
                            player.id
                        )
                    )
                        ? {

                            ...player,

                            verification:
                                "verified"

                        }
                        : player
            );


        adminPlayersClearSelection();

        adminPlayersApplyFilters();


        adminPlayersShowToast(
            `${playerIds.length} player profiles were verified.`,
            "success",
            "Bulk Verification Complete"
        );

    } catch (error) {

        adminPlayersShowToast(
            error.message ||
            "Unable to verify the selected players.",
            "error"
        );

    }

}


async function adminPlayersHandleBulkVisibility(
    visibility
) {

    const selectedPlayers =
        adminPlayersGetSelectedPlayers();


    if (
        selectedPlayers.length ===
        0
    ) {

        return;

    }


    const playerIds =
        selectedPlayers.map(
            (player) =>
                String(
                    player.id
                )
        );


    try {

        await AdminPlayersAPI.bulkUpdateVisibility(
            playerIds,
            visibility
        );


        adminPlayersState.players =
            adminPlayersState.players.map(
                (player) =>
                    playerIds.includes(
                        String(
                            player.id
                        )
                    )
                        ? {

                            ...player,

                            visibility:
                                visibility

                        }
                        : player
            );


        adminPlayersClearSelection();

        adminPlayersApplyFilters();


        adminPlayersShowToast(
            `${playerIds.length} player profiles are now ${visibility}.`,
            "success",
            "Visibility Updated"
        );

    } catch (error) {

        adminPlayersShowToast(
            error.message ||
            "Unable to update player visibility.",
            "error"
        );

    }

}


async function adminPlayersHandleBulkDelete() {

    const selectedPlayers =
        adminPlayersGetSelectedPlayers();


    if (
        selectedPlayers.length ===
        0
    ) {

        return;

    }


    const confirmed =
        window.confirm(
            `Delete ${selectedPlayers.length} selected player profile${selectedPlayers.length === 1 ? "" : "s"}? This action cannot be undone.`
        );


    if (!confirmed) {

        return;

    }


    const playerIds =
        selectedPlayers.map(
            (player) =>
                String(
                    player.id
                )
        );


    try {

        await AdminPlayersAPI.bulkDeletePlayers(
            playerIds
        );


        adminPlayersState.players =
            adminPlayersState.players.filter(
                (player) =>
                    !playerIds.includes(
                        String(
                            player.id
                        )
                    )
            );


        adminPlayersClearSelection();

        adminPlayersApplyFilters();


        adminPlayersShowToast(
            `${playerIds.length} player profiles were deleted.`,
            "success",
            "Bulk Delete Complete"
        );

    } catch (error) {

        adminPlayersShowToast(
            error.message ||
            "Unable to delete the selected players.",
            "error"
        );

    }

}


/* =========================================================
   EXPORT PLAYERS
========================================================= */

function adminPlayersConvertToCSV(
    players
) {

    const headers = [

        "Player ID",
        "Name",
        "Email",
        "Phone",
        "Date of Birth",
        "Gender",
        "State",
        "City",
        "Primary Position",
        "Secondary Position",
        "Preferred Foot",
        "Age Group",
        "Academy",
        "Verification",
        "Visibility",
        "Profile Completion",
        "Rating",
        "Registered",
        "Last Active"

    ];


    const rows =
        players.map(
            (player) => [

                player.id,
                player.name,
                player.email,
                player.phone,
                player.dateOfBirth,
                player.gender,
                player.state,
                player.city,
                player.position,
                player.secondaryPosition,
                player.preferredFoot,
                player.ageGroup,
                player.academy,
                player.verification,
                player.visibility,
                player.profileCompletion,
                player.rating,
                player.createdAt,
                player.lastActive

            ]
        );


    return [
        headers,
        ...rows
    ]
        .map(
            (row) =>
                row
                    .map(
                        (value) =>
                            `"${String(
                                value ?? ""
                            ).replaceAll(
                                '"',
                                '""'
                            )}"`
                    )
                    .join(
                        ","
                    )
        )
        .join(
            "\n"
        );

}


function adminPlayersDownloadFile(
    content,
    filename,
    mimeType
) {

    const blob =
        new Blob(
            [content],
            {
                type:
                    mimeType
            }
        );

    const downloadUrl =
        URL.createObjectURL(
            blob
        );

    const link =
        document.createElement(
            "a"
        );


    link.href =
        downloadUrl;

    link.download =
        filename;

    document.body.append(
        link
    );

    link.click();

    link.remove();


    window.setTimeout(
        () =>
            URL.revokeObjectURL(
                downloadUrl
            ),
        1000
    );

}


async function adminPlayersHandleExport(
    event
) {

    event.preventDefault();


    const format =
        adminPlayersDOM.exportFormat?.value ||
        "csv";

    const players =
        adminPlayersState.filteredPlayers.length >
        0
            ? adminPlayersState.filteredPlayers
            : adminPlayersState.players;


    if (
        players.length ===
        0
    ) {

        adminPlayersShowToast(
            "There are no player records to export.",
            "warning"
        );

        return;

    }


    const dateStamp =
        new Date()
            .toISOString()
            .slice(
                0,
                10
            );


    if (
        format ===
        "json"
    ) {

        adminPlayersDownloadFile(
            JSON.stringify(
                players,
                null,
                2
            ),
            `admin-players-${dateStamp}.json`,
            "application/json"
        );

    } else {

        adminPlayersDownloadFile(
            adminPlayersConvertToCSV(
                players
            ),
            `admin-players-${dateStamp}.csv`,
            "text/csv;charset=utf-8"
        );

    }


    adminPlayersCloseModal(
        "adminExportPlayersModal"
    );


    adminPlayersShowToast(
        `${players.length} player records were exported.`,
        "success",
        "Export Complete"
    );

}


/* =========================================================
   FILTER RESET
========================================================= */

function adminPlayersResetFilters() {

    adminPlayersDOM.filterForm?.reset();


    adminPlayersState.filters = {

        search:
            "",

        verification:
            "",

        position:
            "",

        ageGroup:
            "",

        state:
            "",

        visibility:
            "",

        sort:
            "latest"

    };


    adminPlayersResetPagination();

    adminPlayersApplyFilters();

}


/* =========================================================
   TABLE EVENT HANDLERS
========================================================= */

function adminPlayersHandleTableClick(
    event
) {

    const actionButton =
        event.target.closest(
            "[data-action][data-player-id]"
        );


    if (!actionButton) {

        return;

    }


    const action =
        actionButton.dataset.action;

    const playerId =
        actionButton.dataset.playerId;


    switch (action) {

        case "view":

            adminPlayersOpenViewPlayer(
                playerId
            );

            break;


        case "edit":

            adminPlayersOpenEditPlayer(
                playerId
            );

            break;


        case "verify":

            adminPlayersOpenVerifyPlayer(
                playerId
            );

            break;


        case "delete":

            adminPlayersOpenDeletePlayer(
                playerId
            );

            break;


        default:

            break;

    }

}


function adminPlayersHandleRowSelection(
    event
) {

    const checkbox =
        event.target.closest(
            ".admin-player-row-checkbox"
        );


    if (!checkbox) {

        return;

    }


    const playerId =
        String(
            checkbox.value
        );


    if (checkbox.checked) {

        adminPlayersState.selectedPlayerIds.add(
            playerId
        );

    } else {

        adminPlayersState.selectedPlayerIds.delete(
            playerId
        );

    }


    adminPlayersUpdateSelectAllState();

}


function adminPlayersHandleSelectAll(
    event
) {

    const shouldSelect =
        event.target.checked;

    const visiblePlayers =
        adminPlayersGetPaginatedPlayers();


    visiblePlayers.forEach(
        (player) => {

            const playerId =
                String(
                    player.id
                );


            if (shouldSelect) {

                adminPlayersState.selectedPlayerIds.add(
                    playerId
                );

            } else {

                adminPlayersState.selectedPlayerIds.delete(
                    playerId
                );

            }

        }
    );


    adminPlayersRenderTable();

}


/* =========================================================
   LOAD PLAYERS
========================================================= */

async function adminPlayersLoadPlayers() {

    adminPlayersSetLoading(
        true
    );

    adminPlayersRenderTable();


    try {

        const response =
            await AdminPlayersAPI.getPlayers(
                adminPlayersState.filters
            );


        adminPlayersState.players =
            Array.isArray(
                response?.players
            )
                ? response.players
                : [];


        adminPlayersState.selectedPlayerIds.clear();

        adminPlayersResetPagination();

    } catch (error) {

        adminPlayersState.players =
            [];

        adminPlayersShowToast(
            error.message ||
            "Unable to load player records.",
            "error"
        );

    } finally {

        adminPlayersSetLoading(
            false
        );

        adminPlayersApplyFilters();

    }

}


/* =========================================================
   LOGOUT
========================================================= */

async function adminPlayersHandleLogout() {

    const confirmButton =
        document.getElementById(
            "adminLogoutConfirmButton"
        );

    const originalButtonHTML =
        confirmButton?.innerHTML;


    try {

        if (confirmButton) {

            confirmButton.disabled =
                true;

            confirmButton.innerHTML = `

                <i
                    class="fa-solid fa-spinner fa-spin"
                    aria-hidden="true"
                ></i>

                Signing Out

            `;

        }


        await AdminPlayersAPI.logout();


        window.location.href =
            "admin-login.html";

    } catch (error) {

        adminPlayersShowToast(
            error.message ||
            "Unable to sign out.",
            "error"
        );

    } finally {

        if (confirmButton) {

            confirmButton.disabled =
                false;

            confirmButton.innerHTML =
                originalButtonHTML;

        }

    }

}


/* =========================================================
   STATIC BUTTON BINDING
========================================================= */

function adminPlayersBindButton(
    elementId,
    callback
) {

    document
        .getElementById(
            elementId
        )
        ?.addEventListener(
            "click",
            callback
        );

}


function adminPlayersBindModalControls() {

    const modalControls = [

        [
            "adminAddPlayerButton",
            () =>
                adminPlayersOpenModal(
                    "adminAddPlayerModal"
                )
        ],

        [
            "adminAddPlayerModalCloseButton",
            () =>
                adminPlayersCloseModal(
                    "adminAddPlayerModal"
                )
        ],

        [
            "adminAddPlayerModalBackdrop",
            () =>
                adminPlayersCloseModal(
                    "adminAddPlayerModal"
                )
        ],

        [
            "adminCancelAddPlayerButton",
            () =>
                adminPlayersCloseModal(
                    "adminAddPlayerModal"
                )
        ],

        [
            "adminViewPlayerModalCloseButton",
            () =>
                adminPlayersCloseModal(
                    "adminViewPlayerModal"
                )
        ],

        [
            "adminViewPlayerModalBackdrop",
            () =>
                adminPlayersCloseModal(
                    "adminViewPlayerModal"
                )
        ],

        [
            "adminClosePlayerDetailsButton",
            () =>
                adminPlayersCloseModal(
                    "adminViewPlayerModal"
                )
        ],

        [
            "adminEditPlayerFromDetailsButton",
            () => {

                const playerId =
                    adminPlayersState.currentPlayer?.id;


                adminPlayersCloseModal(
                    "adminViewPlayerModal"
                );


                if (playerId) {

                    adminPlayersOpenEditPlayer(
                        playerId
                    );

                }

            }
        ],

        [
            "adminEditPlayerModalCloseButton",
            () =>
                adminPlayersCloseModal(
                    "adminEditPlayerModal"
                )
        ],

        [
            "adminEditPlayerModalBackdrop",
            () =>
                adminPlayersCloseModal(
                    "adminEditPlayerModal"
                )
        ],

        [
            "adminCancelEditPlayerButton",
            () =>
                adminPlayersCloseModal(
                    "adminEditPlayerModal"
                )
        ],

        [
            "adminVerifyPlayerModalBackdrop",
            () =>
                adminPlayersCloseModal(
                    "adminVerifyPlayerModal"
                )
        ],

        [
            "adminCancelVerifyPlayerButton",
            () =>
                adminPlayersCloseModal(
                    "adminVerifyPlayerModal"
                )
        ],

        [
            "adminConfirmVerifyPlayerButton",
            adminPlayersHandleVerifyPlayer
        ],

        [
            "adminDeletePlayerModalBackdrop",
            () =>
                adminPlayersCloseModal(
                    "adminDeletePlayerModal"
                )
        ],

        [
            "adminCancelDeletePlayerButton",
            () =>
                adminPlayersCloseModal(
                    "adminDeletePlayerModal"
                )
        ],

        [
            "adminExportPlayersButton",
            () =>
                adminPlayersOpenModal(
                    "adminExportPlayersModal"
                )
        ],

        [
            "adminExportPlayersModalBackdrop",
            () =>
                adminPlayersCloseModal(
                    "adminExportPlayersModal"
                )
        ],

        [
            "adminCancelExportPlayersButton",
            () =>
                adminPlayersCloseModal(
                    "adminExportPlayersModal"
                )
        ],

        [
            "adminLogoutButton",
            () =>
                adminPlayersOpenModal(
                    "adminLogoutModal"
                )
        ],

        [
            "adminLogoutModalBackdrop",
            () =>
                adminPlayersCloseModal(
                    "adminLogoutModal"
                )
        ],

        [
            "adminLogoutCancelButton",
            () =>
                adminPlayersCloseModal(
                    "adminLogoutModal"
                )
        ],

        [
            "adminLogoutConfirmButton",
            adminPlayersHandleLogout
        ]

    ];


    modalControls.forEach(
        ([
            elementId,
            callback
        ]) =>
            adminPlayersBindButton(
                elementId,
                callback
            )
    );

}


/* =========================================================
   EVENT BINDING
========================================================= */

function adminPlayersBindEvents() {

    const debouncedSearch =
        adminPlayersCreateDebounce(
            () => {

                adminPlayersResetPagination();

                adminPlayersApplyFilters();

            },
            ADMIN_PLAYERS_CONFIG.searchDebounce
        );


    adminPlayersDOM.searchInput?.addEventListener(
        "input",
        debouncedSearch
    );


    [
        adminPlayersDOM.verificationFilter,
        adminPlayersDOM.positionFilter,
        adminPlayersDOM.ageGroupFilter,
        adminPlayersDOM.stateFilter,
        adminPlayersDOM.visibilityFilter,
        adminPlayersDOM.sortFilter
    ].forEach(
        (filterElement) => {

            filterElement?.addEventListener(
                "change",
                () => {

                    adminPlayersResetPagination();

                    adminPlayersApplyFilters();

                }
            );

        }
    );


    adminPlayersDOM.filterForm?.addEventListener(
        "submit",
        (event) => {

            event.preventDefault();

            adminPlayersResetPagination();

            adminPlayersApplyFilters();

        }
    );


    adminPlayersDOM.resetFiltersButton?.addEventListener(
        "click",
        adminPlayersResetFilters
    );


    adminPlayersDOM.refreshButton?.addEventListener(
        "click",
        adminPlayersLoadPlayers
    );


    adminPlayersDOM.tableBody?.addEventListener(
        "click",
        adminPlayersHandleTableClick
    );


    adminPlayersDOM.tableBody?.addEventListener(
        "change",
        adminPlayersHandleRowSelection
    );


    adminPlayersDOM.selectAllCheckbox?.addEventListener(
        "change",
        adminPlayersHandleSelectAll
    );


    adminPlayersDOM.pagination?.addEventListener(
        "click",
        (event) => {

            const pageButton =
                event.target.closest(
                    "[data-page]"
                );


            if (!pageButton) {

                return;

            }


            adminPlayersChangePage(
                pageButton.dataset.page
            );

        }
    );


    adminPlayersDOM.previousPageButton?.addEventListener(
        "click",
        () =>
            adminPlayersChangePage(
                adminPlayersState.pagination.currentPage -
                1
            )
    );


    adminPlayersDOM.nextPageButton?.addEventListener(
        "click",
        () =>
            adminPlayersChangePage(
                adminPlayersState.pagination.currentPage +
                1
            )
    );


    adminPlayersDOM.clearSelectionButton?.addEventListener(
        "click",
        adminPlayersClearSelection
    );


    adminPlayersDOM.bulkVerifyButton?.addEventListener(
        "click",
        adminPlayersHandleBulkVerify
    );


    adminPlayersDOM.bulkShowButton?.addEventListener(
        "click",
        () =>
            adminPlayersHandleBulkVisibility(
                "visible"
            )
    );


    adminPlayersDOM.bulkHideButton?.addEventListener(
        "click",
        () =>
            adminPlayersHandleBulkVisibility(
                "hidden"
            )
    );


    adminPlayersDOM.bulkDeleteButton?.addEventListener(
        "click",
        adminPlayersHandleBulkDelete
    );


    adminPlayersDOM.addPlayerForm?.addEventListener(
        "submit",
        adminPlayersHandleAddPlayer
    );


    adminPlayersDOM.editPlayerForm?.addEventListener(
        "submit",
        adminPlayersHandleEditPlayer
    );


    adminPlayersDOM.deletePlayerForm?.addEventListener(
        "submit",
        adminPlayersHandleDeletePlayer
    );


    adminPlayersDOM.exportPlayersForm?.addEventListener(
        "submit",
        adminPlayersHandleExport
    );


    document.addEventListener(
        "keydown",
        (event) => {

            if (
                event.key ===
                "Escape"
            ) {

                adminPlayersCloseAllModals();

            }

        }
    );


    adminPlayersBindModalControls();

}


/* =========================================================
   INITIAL PAGE SETUP
========================================================= */

function adminPlayersSetFooterYear() {

    if (
        adminPlayersDOM.footerYear
    ) {

        adminPlayersDOM.footerYear.textContent =
            new Date().getFullYear();

    }

}


function adminPlayersHideLoadingScreen() {

    if (
        !adminPlayersDOM.loadingScreen
    ) {

        return;

    }


    adminPlayersDOM.loadingScreen.classList.add(
        "is-hidden"
    );


    window.setTimeout(
        () => {

            adminPlayersDOM.loadingScreen.hidden =
                true;

        },
        320
    );

}


async function adminPlayersInitialize() {

    if (
        adminPlayersState.initialized
    ) {

        return;

    }


    adminPlayersState.initialized =
        true;


    adminPlayersSetFooterYear();

    adminPlayersBindEvents();

    adminPlayersRenderBulkActions();


    await adminPlayersLoadPlayers();


    adminPlayersHideLoadingScreen();

}


/* =========================================================
   BOOTSTRAP
========================================================= */

if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        adminPlayersInitialize,
        {
            once:
                true
        }
    );

} else {

    adminPlayersInitialize();

}