/* ======================================================
   FIFA MISSION INDIA
   SCOUT PLAYERS JAVASCRIPT
   PART 1A
   Sidebar • Overlay • Dropdown • Notifications
====================================================== */

"use strict";

/* ======================================================
   ELEMENTS
====================================================== */

const sidebar =
document.getElementById("scoutSidebar");

const sidebarOverlay =
document.getElementById("scoutSidebarOverlay");

const menuButton =
document.getElementById("scoutMenuToggle");

const sidebarClose =
document.getElementById("scoutSidebarClose");

const profileButton =
document.getElementById("scoutProfileButton");

const profileDropdown =
document.getElementById("scoutProfileDropdown");

const notificationButton =
document.getElementById("scoutNotificationButton");

const notificationPanel =
document.getElementById("scoutNotificationPanel");

const markReadButton =
document.getElementById("scoutMarkNotificationsReadButton");

const toast =
document.getElementById("scoutToast");

const toastTitle =
document.getElementById("scoutToastTitle");

const toastMessage =
document.getElementById("scoutToastMessage");



/* ======================================================
   TOAST
====================================================== */

function showToast(title,message){

toastTitle.textContent=title;

toastMessage.textContent=message;

toast.classList.add("show");

clearTimeout(showToast.timeout);

showToast.timeout=setTimeout(()=>{

toast.classList.remove("show");

},3000);

}



/* ======================================================
   SIDEBAR
====================================================== */

function openSidebar(){

sidebar.classList.add("active");

sidebarOverlay.classList.add("active");

document.body.style.overflow="hidden";

}

function closeSidebar(){

sidebar.classList.remove("active");

sidebarOverlay.classList.remove("active");

document.body.style.overflow="";

}

menuButton?.addEventListener(
"click",
openSidebar
);

sidebarClose?.addEventListener(
"click",
closeSidebar
);

sidebarOverlay?.addEventListener(
"click",
closeSidebar
);



/* ======================================================
   PROFILE DROPDOWN
====================================================== */

profileButton?.addEventListener(
"click",
()=>{

profileDropdown.classList.toggle("active");

notificationPanel.classList.remove("active");

}
);



/* ======================================================
   NOTIFICATION PANEL
====================================================== */

notificationButton?.addEventListener(
"click",
()=>{

notificationPanel.classList.toggle("active");

profileDropdown.classList.remove("active");

}
);



/* ======================================================
   MARK AS READ
====================================================== */

markReadButton?.addEventListener(
"click",
()=>{

document
.querySelectorAll(".scout-notification-item.unread")
.forEach(item=>{

item.classList.remove("unread");

});

showToast(
"Notifications",
"All notifications marked as read."
);

}
);



/* ======================================================
   CLOSE DROPDOWNS
====================================================== */

document.addEventListener(
"click",
event=>{

if(
!profileButton.contains(event.target) &&
!profileDropdown.contains(event.target)
){

profileDropdown.classList.remove("active");

}

if(
!notificationButton.contains(event.target) &&
!notificationPanel.contains(event.target)
){

notificationPanel.classList.remove("active");

}

}
);

/* ======================================================
   PLAYER SEARCH
====================================================== */

const scoutSearchInput =
document.getElementById("scoutSearchInput");

const playerCards =
Array.from(
document.querySelectorAll(".scout-player-card")
);

function normalizeText(value){

return String(value || "")
.toLowerCase()
.trim();

}

function filterPlayersBySearch(){

const searchTerm =
normalizeText(scoutSearchInput?.value);

playerCards.forEach(card=>{

const playerName =
normalizeText(
card.querySelector("h3")?.textContent
);

const playerPosition =
normalizeText(
card.dataset.position
);

const playerState =
normalizeText(
card.dataset.state
);

const playerFoot =
normalizeText(
card.dataset.foot
);

const searchableText =
`${playerName} ${playerPosition} ${playerState} ${playerFoot}`;

card.hidden =
searchTerm !== "" &&
!searchableText.includes(searchTerm);

});

updateVisiblePlayerCount();

}

scoutSearchInput?.addEventListener(
"input",
filterPlayersBySearch
);



/* ======================================================
   PLAYER FILTERS
====================================================== */

const filterPosition =
document.getElementById("filterPosition");

const filterAge =
document.getElementById("filterAge");

const filterState =
document.getElementById("filterState");

const filterFoot =
document.getElementById("filterFoot");

const applyPlayerFilters =
document.getElementById("applyPlayerFilters");

function applyFilters(){

const selectedPosition =
normalizeText(filterPosition?.value);

const selectedAge =
normalizeText(filterAge?.value);

const selectedState =
normalizeText(filterState?.value);

const selectedFoot =
normalizeText(filterFoot?.value);

let matchedPlayers = 0;

playerCards.forEach(card=>{

const cardPosition =
normalizeText(card.dataset.position);

const cardAge =
normalizeText(card.dataset.age);

const cardState =
normalizeText(card.dataset.state);

const cardFoot =
normalizeText(card.dataset.foot);

const positionMatch =
!selectedPosition ||
cardPosition === selectedPosition;

const ageMatch =
!selectedAge ||
cardAge === selectedAge;

const stateMatch =
!selectedState ||
cardState === selectedState;

const footMatch =
!selectedFoot ||
cardFoot === selectedFoot;

const isMatch =
positionMatch &&
ageMatch &&
stateMatch &&
footMatch;

card.hidden = !isMatch;

if(isMatch){

matchedPlayers += 1;

}

});

updateVisiblePlayerCount();

showToast(
"Filters Applied",
`${matchedPlayers} player${matchedPlayers === 1 ? "" : "s"} matched your selection.`
);

}

applyPlayerFilters?.addEventListener(
"click",
applyFilters
);



/* ======================================================
   VISIBLE PLAYER COUNT
====================================================== */

const resultsCount =
document.querySelector(
".scout-results-meta strong"
);

function updateVisiblePlayerCount(){

const visiblePlayers =
playerCards.filter(
card=>!card.hidden
).length;

if(resultsCount){

resultsCount.textContent =
`${visiblePlayers} Player${visiblePlayers === 1 ? "" : "s"}`;

}

}

/* ======================================================
   PLAYER SHORTLIST
====================================================== */

const shortlistButtons =
document.querySelectorAll(".scout-player-save");

shortlistButtons.forEach(button=>{

button.addEventListener("click",()=>{

const playerCard =
button.closest(".scout-player-card");

const playerName =
playerCard?.querySelector("h3")?.textContent?.trim() ||
"Player";

const icon =
button.querySelector("i");

const isActive =
button.classList.toggle("active");

if(icon){

icon.classList.toggle("fa-solid",isActive);
icon.classList.toggle("fa-regular",!isActive);

}

button.setAttribute(
"aria-label",
isActive
? `Remove ${playerName} from shortlist`
: `Add ${playerName} to shortlist`
);

showToast(
isActive
? "Added to Shortlist"
: "Removed from Shortlist",
isActive
? `${playerName} has been added to your shortlist.`
: `${playerName} has been removed from your shortlist.`
);

});

});



/* ======================================================
   LOAD MORE PLAYERS
====================================================== */

const loadMorePlayersButton =
document.getElementById("loadMorePlayersButton");

let additionalPlayersLoaded = false;

loadMorePlayersButton?.addEventListener("click",()=>{

if(additionalPlayersLoaded){

showToast(
"Players Loaded",
"All available demo players are already displayed."
);

return;

}

const additionalPlayers = [

{
name:"Lalrinzuala Hmar",
position:"Left Winger",
age:"Under 17",
state:"Mizoram",
foot:"Right",
rating:"8.8",
image:"images/player-lalrinzuala.jpg",
years:"16 Years",
attributes:[
["Pace","94"],
["Dribbling","91"],
["Crossing","86"],
["Agility","93"]
],
tags:["Direct","Quick","Creative"]
},

{
name:"Aman Thapa",
position:"Full Back",
age:"Under 19",
state:"Sikkim",
foot:"Left",
rating:"8.3",
image:"images/player-aman.jpg",
years:"18 Years",
attributes:[
["Pace","89"],
["Tackling","88"],
["Stamina","92"],
["Crossing","84"]
],
tags:["Energetic","Defensive","Reliable"]
},

{
name:"Kevin D'Souza",
position:"Defensive Midfielder",
age:"Under 17",
state:"Goa",
foot:"Both",
rating:"8.6",
image:"images/player-kevin.jpg",
years:"17 Years",
attributes:[
["Interceptions","91"],
["Passing","88"],
["Positioning","90"],
["Strength","86"]
],
tags:["Ball Winner","Composed","Leader"]
}

];

additionalPlayers.forEach(player=>{

const card =
document.createElement("article");

card.className="scout-player-card";

card.dataset.position=player.position;
card.dataset.age=player.age;
card.dataset.state=player.state;
card.dataset.foot=player.foot;

card.innerHTML=`

<div class="scout-player-image">

<img
src="${player.image}"
alt="${player.name}"
>

<span class="scout-player-rating">
${player.rating}
</span>

<button
class="scout-player-save"
type="button"
aria-label="Add ${player.name} to shortlist"
>

<i class="fa-regular fa-star"></i>

</button>

</div>

<div class="scout-player-content">

<div class="scout-player-header">

<div>

<h3>${player.name}</h3>

<p>${player.position}</p>

</div>

<span class="scout-player-age">
${player.years}
</span>

</div>

<div class="scout-player-meta">

<span>

<i class="fa-solid fa-location-dot"></i>

${player.state}

</span>

<span>

<i class="fa-solid fa-shoe-prints"></i>

${player.foot} Foot

</span>

</div>

<div class="scout-player-attributes">

${player.attributes.map(attribute=>`

<div>

<span>${attribute[0]}</span>

<strong>${attribute[1]}</strong>

</div>

`).join("")}

</div>

<div class="scout-player-tags">

${player.tags.map(tag=>`

<span>${tag}</span>

`).join("")}

</div>

<div class="scout-player-actions">

<a
href="scout-player-profile.html"
class="scout-primary-button"
>

<i class="fa-solid fa-eye"></i>

View Profile

</a>

<a
href="scout-report-create.html"
class="scout-secondary-button"
>

<i class="fa-solid fa-file-circle-plus"></i>

Report

</a>

</div>

</div>

`;

document
.getElementById("scoutPlayersGrid")
?.appendChild(card);

playerCards.push(card);

});

additionalPlayersLoaded=true;

initializeShortlistButtons();

updateVisiblePlayerCount();

showToast(
"Players Loaded",
"3 additional player profiles have been added."
);

loadMorePlayersButton.innerHTML=`

<i class="fa-solid fa-check"></i>

All Players Loaded

`;

loadMorePlayersButton.disabled=true;

});



/* ======================================================
   INITIALIZE DYNAMIC SHORTLIST BUTTONS
====================================================== */

function initializeShortlistButtons(){

document
.querySelectorAll(".scout-player-save")
.forEach(button=>{

if(button.dataset.initialized==="true"){

return;

}

button.dataset.initialized="true";

button.addEventListener("click",()=>{

const playerCard =
button.closest(".scout-player-card");

const playerName =
playerCard?.querySelector("h3")?.textContent?.trim() ||
"Player";

const icon =
button.querySelector("i");

const isActive =
button.classList.toggle("active");

if(icon){

icon.classList.toggle("fa-solid",isActive);
icon.classList.toggle("fa-regular",!isActive);

}

button.setAttribute(
"aria-label",
isActive
? `Remove ${playerName} from shortlist`
: `Add ${playerName} to shortlist`
);

showToast(
isActive
? "Added to Shortlist"
: "Removed from Shortlist",
isActive
? `${playerName} has been added to your shortlist.`
: `${playerName} has been removed from your shortlist.`
);

});

});

}

/* ======================================================
   LOGOUT
====================================================== */

const scoutLogoutButton =
document.getElementById("scoutLogoutButton");

const dropdownLogoutButton =
document.querySelector(
".scout-profile-dropdown-link.logout"
);

function handleScoutLogout(event){

event?.preventDefault();

showToast(
"Logging Out",
"Your scout session is being closed."
);

setTimeout(()=>{

window.location.href="login.html";

},1200);

}

scoutLogoutButton?.addEventListener(
"click",
handleScoutLogout
);

dropdownLogoutButton?.addEventListener(
"click",
handleScoutLogout
);



/* ======================================================
   CLOSE SIDEBAR AFTER MOBILE NAVIGATION
====================================================== */

document
.querySelectorAll(".scout-nav-link")
.forEach(link=>{

link.addEventListener("click",()=>{

if(window.innerWidth<=1100){

closeSidebar();

}

});

});



/* ======================================================
   ACTIVE NAVIGATION
====================================================== */

function setActiveNavigation(){

const currentPage =
window.location.pathname
.split("/")
.pop() ||
"scout-players.html";

document
.querySelectorAll(".scout-nav-link")
.forEach(link=>{

const linkPage =
link.getAttribute("href");

const isActive =
linkPage===currentPage;

link.classList.toggle(
"active",
isActive
);

if(isActive){

link.setAttribute(
"aria-current",
"page"
);

}else{

link.removeAttribute(
"aria-current"
);

}

});

}



/* ======================================================
   KEYBOARD ACCESSIBILITY
====================================================== */

document.addEventListener(
"keydown",
event=>{

if(event.key==="Escape"){

closeSidebar();

profileDropdown?.classList.remove(
"active"
);

notificationPanel?.classList.remove(
"active"
);

toast?.classList.remove(
"show"
);

}

}
);



/* ======================================================
   WINDOW RESIZE
====================================================== */

window.addEventListener(
"resize",
()=>{

if(window.innerWidth>1100){

closeSidebar();

}

}
);



/* ======================================================
   ONLINE AND OFFLINE STATUS
====================================================== */

window.addEventListener(
"offline",
()=>{

showToast(
"Connection Lost",
"You are currently offline. Some player data may be unavailable."
);

}
);

window.addEventListener(
"online",
()=>{

showToast(
"Connection Restored",
"You are back online."
);

}
);



/* ======================================================
   PLAYER CARD KEYBOARD SUPPORT
====================================================== */

function initializePlayerCardAccessibility(){

document
.querySelectorAll(".scout-player-card")
.forEach(card=>{

card.setAttribute(
"tabindex",
"0"
);

card.addEventListener(
"keydown",
event=>{

if(
event.key!=="Enter" &&
event.key!==" "
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

card
.querySelector(
".scout-player-actions .scout-primary-button"
)
?.click();

}
);

});

}



/* ======================================================
   IMAGE FALLBACK
====================================================== */

function initializePlayerImageFallbacks(){

document
.querySelectorAll(".scout-player-image img")
.forEach(image=>{

image.addEventListener(
"error",
()=>{

image.src=
"images/default-player.jpg";

},
{
once:true
}
);

});

}



/* ======================================================
   BACKEND INTEGRATION PLACEHOLDERS
====================================================== */

/*

Backend endpoints for Mr. Harsh:

GET /api/v1/scout/players

GET /api/v1/scout/players?position=
GET /api/v1/scout/players?age_group=
GET /api/v1/scout/players?state=
GET /api/v1/scout/players?preferred_foot=
GET /api/v1/scout/players?search=

GET /api/v1/scout/players/:playerId

POST /api/v1/scout/shortlist
{
  "player_id": "PLAYER_ID"
}

DELETE /api/v1/scout/shortlist/:playerId

POST /api/v1/scout/reports
{
  "player_id": "PLAYER_ID",
  "match_id": "MATCH_ID",
  "technical_rating": 0,
  "physical_rating": 0,
  "tactical_rating": 0,
  "mental_rating": 0,
  "overall_rating": 0,
  "recommendation": "",
  "notes": ""
}

GET /api/v1/scout/notifications

PATCH /api/v1/scout/notifications/read-all

POST /api/v1/auth/logout

Do not remove the existing frontend demo data until
the backend API integration is ready.

*/



/* ======================================================
   INITIALIZATION
====================================================== */

function initializeScoutPlayersPage(){

setActiveNavigation();

initializeShortlistButtons();

initializePlayerCardAccessibility();

initializePlayerImageFallbacks();

updateVisiblePlayerCount();

}

document.addEventListener(
"DOMContentLoaded",
initializeScoutPlayersPage
);