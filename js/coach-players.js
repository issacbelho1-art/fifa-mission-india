"use strict";

/* ==========================================================
   COACH PLAYERS
   Frontend Only
   Backend Integration by Mr. Harsh
========================================================== */

/* ==========================================================
   DOM
========================================================== */

const playersGrid = document.getElementById("playersGrid");

const searchInput =
document.getElementById("playerSearch");

const positionFilter =
document.getElementById("positionFilter");

const statusFilter =
document.getElementById("statusFilter");

const ageFilter =
document.getElementById("ageFilter");

const resultCount =
document.getElementById("playersResultCount");

const loadMoreButton =
document.getElementById("loadMorePlayers");

const emptyState =
document.getElementById("playersEmptyState");

const toast =
document.getElementById("coachToast");

/* ==========================================================
   MODALS
========================================================== */

const addPlayerModal =
document.getElementById("addPlayerModal");

const previewModal =
document.getElementById("previewPlayerModal");

const notesModal =
document.getElementById("playerNotesModal");

const logoutModal =
document.getElementById("logoutModal");

/* ==========================================================
   SAMPLE PLAYERS
   Replace with API later
========================================================== */

let players = [

{

id:1,

name:"Rohan Sharma",

position:"Forward",

age:17,

status:"Active",

rating:92,

goals:18,

assists:11,

attendance:96,

photo:"images/player-rohan.jpg",

favorite:false

},

{

id:2,

name:"Ayaan Khan",

position:"Midfielder",

age:16,

status:"Trial",

rating:84,

goals:7,

assists:16,

attendance:91,

photo:"images/player-ayaan.jpg",

favorite:false

},

{

id:3,

name:"Neeraj Singh",

position:"Defender",

age:18,

status:"Active",

rating:89,

goals:2,

assists:5,

attendance:95,

photo:"images/player-neeraj.jpg",

favorite:true

},

{

id:4,

name:"Kabir Patel",

position:"Goalkeeper",

age:17,

status:"Injured",

rating:80,

goals:0,

assists:1,

attendance:78,

photo:"images/player-kabir.jpg",

favorite:false

},

{

id:5,

name:"Lalremruata",

position:"Forward",

age:19,

status:"Active",

rating:90,

goals:21,

assists:9,

attendance:98,

photo:"images/player-lalremruata.jpg",

favorite:true

},

{

id:6,

name:"Tenzin",

position:"Midfielder",

age:18,

status:"Active",

rating:87,

goals:10,

assists:13,

attendance:94,

photo:"images/player-tenzin.jpg",

favorite:false

}

];

/* ==========================================================
   STATE
========================================================== */

let filteredPlayers = [...players];

let visiblePlayers = 6;

/* ==========================================================
   UTILITIES
========================================================== */

function showToast(message,type="success"){

if(!toast) return;

toast.textContent = message;

toast.className = `toast ${type} show`;

setTimeout(()=>{

toast.classList.remove("show");

},3000);

}

/* ==========================================================
   Backend Integration
========================================================== */

/*

Mr. Harsh:

Replace sample players with API.

Example:

GET /api/coach/players

Return:

[
 {
   id,
   name,
   position,
   age,
   status,
   rating,
   goals,
   assists,
   attendance,
   favorite,
   photo
 }
]

*/

/* ==========================================================
   RENDER PLAYER CARDS
========================================================== */

function renderPlayers() {

  if (!playersGrid) return;

  playersGrid.innerHTML = "";

  const visible = filteredPlayers.slice(0, visiblePlayers);

  if (visible.length === 0) {

    if (emptyState) emptyState.hidden = false;

    if (loadMoreButton) loadMoreButton.style.display = "none";

    updateResultCount();

    return;

  }

  if (emptyState) emptyState.hidden = true;

  visible.forEach(player => {

    const card = document.createElement("article");

    card.className = "player-card card";

    card.dataset.id = player.id;

    card.innerHTML = `

      <div class="player-card-media">

        <img
          src="${player.photo}"
          alt="${player.name}"
          loading="lazy"
          onerror="this.src='images/player-placeholder.jpg'"
        >

        <span class="player-status-badge ${player.status.toLowerCase()}">
          ${player.status}
        </span>

        <button
          class="player-favourite-button ${player.favorite ? "active" : ""}"
          data-action="favorite"
          data-id="${player.id}"
          aria-label="Favourite Player"
        >
          <i class="fa-solid fa-star"></i>
        </button>

      </div>

      <div class="player-card-body">

        <div class="player-card-identity">

          <div>

            <span class="player-card-position">
              ${player.position}
            </span>

            <h3>${player.name}</h3>

            <p>
              <i class="fa-solid fa-user"></i>
              ${player.age} Years
            </p>

          </div>

          <div class="player-shirt-number">
            ${player.id}
          </div>

        </div>

        <div class="player-meta-row">

          <span>
            <i class="fa-solid fa-futbol"></i>
            ${player.goals} Goals
          </span>

          <span>
            <i class="fa-solid fa-handshake"></i>
            ${player.assists} Assists
          </span>

          <span>
            <i class="fa-solid fa-calendar-check"></i>
            ${player.attendance}%
          </span>

        </div>

        <div class="player-rating-row">

          <div>

            <small>Performance Rating</small>

            <strong>${player.rating}</strong>

          </div>

          <span class="rating-indicator ${player.rating >= 90 ? "excellent" : "good"}">

            ${player.rating >= 90 ? "Excellent" : "Good"}

          </span>

        </div>

        <div class="player-progress-block">

          <div class="progress-heading">

            <span>Season Progress</span>

            <strong>${player.rating}%</strong>

          </div>

          <div class="progress-track">

            <span style="width:${player.rating}%"></span>

          </div>

        </div>

      </div>

      <div class="player-card-actions">

        <button
          class="player-primary-card-action"
          data-action="preview"
          data-id="${player.id}"
        >
          View Profile
        </button>

        <button
          data-action="notes"
          data-id="${player.id}"
          aria-label="Notes"
        >
          <i class="fa-solid fa-note-sticky"></i>
        </button>

      </div>

    `;

    playersGrid.appendChild(card);

  });

  if (loadMoreButton) {

    loadMoreButton.style.display =
      filteredPlayers.length > visiblePlayers
        ? "inline-flex"
        : "none";

  }

  updateResultCount();

  updateOverviewCards();

}


/* ==========================================================
   RESULT COUNT
========================================================== */

function updateResultCount() {

  if (!resultCount) return;

  resultCount.textContent =
    `${filteredPlayers.length} Player${filteredPlayers.length !== 1 ? "s" : ""}`;

}


/* ==========================================================
   OVERVIEW CARDS
========================================================== */

function updateOverviewCards() {

  const totalPlayers =
    document.getElementById("totalPlayersValue");

  const activePlayers =
    document.getElementById("activePlayersValue");

  const averageRating =
    document.getElementById("averageRatingValue");

  const attendance =
    document.getElementById("attendanceValue");

  if (totalPlayers)
    totalPlayers.textContent = players.length;

  if (activePlayers) {

    activePlayers.textContent =
      players.filter(player => player.status === "Active").length;

  }

  if (averageRating) {

    const average = Math.round(

      players.reduce(

        (sum, player) => sum + player.rating,

        0

      ) / players.length

    );

    averageRating.textContent = average;

  }

  if (attendance) {

    const averageAttendance = Math.round(

      players.reduce(

        (sum, player) => sum + player.attendance,

        0

      ) / players.length

    );

    attendance.textContent = `${averageAttendance}%`;

  }

}

/* ==========================================================
   SEARCH & FILTER
========================================================== */

function applyFilters() {

  const searchValue =
    searchInput.value.trim().toLowerCase();

  const positionValue =
    positionFilter.value;

  const statusValue =
    statusFilter.value;

  const ageValue =
    ageFilter.value;

  filteredPlayers = players.filter(player => {

    const searchMatch =

      player.name.toLowerCase().includes(searchValue) ||

      player.position.toLowerCase().includes(searchValue);

    const positionMatch =

      !positionValue ||

      player.position === positionValue;

    const statusMatch =

      !statusValue ||

      player.status === statusValue;

    let ageMatch = true;

    if (ageValue === "under16") {

      ageMatch = player.age < 16;

    }

    else if (ageValue === "16-18") {

      ageMatch = player.age >= 16 &&
                 player.age <= 18;

    }

    else if (ageValue === "18plus") {

      ageMatch = player.age > 18;

    }

    return (

      searchMatch &&

      positionMatch &&

      statusMatch &&

      ageMatch

    );

  });

  visiblePlayers = 6;

  renderPlayers();

}

/* ==========================================================
   EVENT LISTENERS
========================================================== */

searchInput?.addEventListener(
  "input",
  applyFilters
);

positionFilter?.addEventListener(
  "change",
  applyFilters
);

statusFilter?.addEventListener(
  "change",
  applyFilters
);

ageFilter?.addEventListener(
  "change",
  applyFilters
);

/* ==========================================================
   LOAD MORE
========================================================== */

loadMoreButton?.addEventListener(

  "click",

  () => {

    visiblePlayers += 6;

    renderPlayers();

  }

);

/* ==========================================================
   FAVORITE PLAYER
========================================================== */

function toggleFavorite(id) {

  const player = players.find(

    player => player.id === id

  );

  if (!player) return;

  player.favorite = !player.favorite;

  showToast(

    player.favorite

      ? `${player.name} added to favourites.`

      : `${player.name} removed from favourites.`

  );

  renderPlayers();

}

/* ==========================================================
   CARD ACTIONS
========================================================== */

playersGrid?.addEventListener(

  "click",

  event => {

    const button = event.target.closest("button");

    if (!button) return;

    const id = Number(button.dataset.id);

    const action = button.dataset.action;

    switch (action) {

      case "favorite":

        toggleFavorite(id);

        break;

      case "preview":

        openPreviewModal(id);

        break;

      case "notes":

        openNotesModal(id);

        break;

      default:

        break;

    }

  }

);

/* ==========================================================
   MODAL HELPERS
========================================================== */

function openModal(modal) {

  if (!modal) return;

  modal.classList.add("active");

  document.body.style.overflow = "hidden";

}

function closeModal(modal) {

  if (!modal) return;

  modal.classList.remove("active");

  document.body.style.overflow = "";

}

/* ==========================================================
   PLAYER PREVIEW
========================================================== */

function openPreviewModal(id) {

  const player = players.find(player => player.id === id);

  if (!player || !previewModal) return;

  const image =
    previewModal.querySelector("[data-preview-image]");

  const name =
    previewModal.querySelector("[data-preview-name]");

  const position =
    previewModal.querySelector("[data-preview-position]");

  const rating =
    previewModal.querySelector("[data-preview-rating]");

  const attendance =
    previewModal.querySelector("[data-preview-attendance]");

  const goals =
    previewModal.querySelector("[data-preview-goals]");

  const assists =
    previewModal.querySelector("[data-preview-assists]");

  if (image) image.src = player.photo;

  if (name) name.textContent = player.name;

  if (position) position.textContent = player.position;

  if (rating) rating.textContent = player.rating;

  if (attendance) attendance.textContent = `${player.attendance}%`;

  if (goals) goals.textContent = player.goals;

  if (assists) assists.textContent = player.assists;

  openModal(previewModal);

}

/* ==========================================================
   COACH NOTES
========================================================== */

function openNotesModal(id) {

  const player = players.find(player => player.id === id);

  if (!player || !notesModal) return;

  notesModal.dataset.playerId = id;

  const title =
    notesModal.querySelector("[data-player-name]");

  if (title) {

    title.textContent = player.name;

  }

  openModal(notesModal);

}

/* ==========================================================
   ADD PLAYER
========================================================== */

function addPlayer(event) {

  event.preventDefault();

  /*
  ==========================================================
  BACKEND INTEGRATION

  Mr. Harsh:

  POST /api/coach/players

  Send form data.

  On success,
  reload player list.

  ==========================================================
  */

  showToast("Player added successfully.");

  closeModal(addPlayerModal);

}

/* ==========================================================
   LOGOUT
========================================================== */

function logoutCoach() {

  /*
  ==========================================================
  BACKEND INTEGRATION

  Destroy session/token.

  Redirect to login.

  ==========================================================
  */

  window.location.href = "login.html";

}

/* ==========================================================
   CLOSE MODALS
========================================================== */

document.querySelectorAll(

  "[data-close-modal]"

).forEach(button => {

  button.addEventListener(

    "click",

    () => {

      closeModal(

        button.closest(".modal-overlay")

      );

    }

  );

});

document.querySelectorAll(

  ".modal-overlay"

).forEach(modal => {

  modal.addEventListener(

    "click",

    event => {

      if (event.target === modal) {

        closeModal(modal);

      }

    }

  );

});

/* ==========================================================
   BUTTONS
========================================================== */

document
  .getElementById("addPlayerForm")
  ?.addEventListener("submit", addPlayer);

document
  .getElementById("logoutConfirmButton")
  ?.addEventListener("click", logoutCoach);

document
  .getElementById("openAddPlayerModal")
  ?.addEventListener("click", () => {

    openModal(addPlayerModal);

});

/* ==========================================================
   ESC KEY
========================================================== */

document.addEventListener(

  "keydown",

  event => {

    if (event.key !== "Escape") return;

    document

      .querySelectorAll(".modal-overlay.active")

      .forEach(closeModal);

  }

);

/* ==========================================================
   INITIALIZE
========================================================== */

function initCoachPlayers() {

  renderPlayers();

}

/* ==========================================================
   START
========================================================== */

document.addEventListener(

  "DOMContentLoaded",

  initCoachPlayers

);