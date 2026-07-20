/* =====================================================
   INTERACTIVE INDIA FOOTBALL MAP
   Frontend-only data and interaction

   Backend integration: Mr. Harsh
===================================================== */

document.addEventListener("DOMContentLoaded", () => {

  const mapRegions = document.querySelectorAll(
    ".india-map-region[data-region]"
  );

  const mobileRegionSelector = document.getElementById(
    "indiaRegionSelect"
  );

  const regionName = document.getElementById(
    "indiaRegionName"
  );

  const regionBadge = document.getElementById(
    "indiaRegionBadge"
  );

  const regionDescription = document.getElementById(
    "indiaRegionDescription"
  );

  const regionPlayers = document.getElementById(
    "indiaRegionPlayers"
  );

  const regionAcademies = document.getElementById(
    "indiaRegionAcademies"
  );

  const regionCoaches = document.getElementById(
    "indiaRegionCoaches"
  );

  const regionEvents = document.getElementById(
    "indiaRegionEvents"
  );

  const regionHighlight = document.getElementById(
    "indiaRegionHighlight"
  );

  const regionStateList = document.getElementById(
    "indiaRegionStateList"
  );

  const exploreRegionButton = document.getElementById(
    "exploreRegionButton"
  );


  if (
    mapRegions.length === 0 ||
    !regionName ||
    !regionDescription ||
    !regionPlayers ||
    !regionAcademies ||
    !regionCoaches ||
    !regionEvents ||
    !regionHighlight ||
    !regionStateList ||
    !exploreRegionButton
  ) {
    return;
  }


  /*
    Frontend demonstration data.

    Mr. Harsh can later replace this object using:

    GET /api/map/regions
  */

  const regionData = {

    north: {
      name: "North India",
      badge: "North",
      description:
        "A rapidly developing football region with growing participation from schools, academies and community programmes.",
      players: 3250,
      academies: 82,
      coaches: 164,
      events: 37,
      highlight:
        "Youth football participation continues to grow through school leagues and independent development academies.",
      states: [
        "Delhi",
        "Punjab",
        "Haryana",
        "Uttarakhand"
      ]
    },

    west: {
      name: "West India",
      badge: "West",
      description:
        "A strong football market supported by established clubs, private academies and competitive urban leagues.",
      players: 2840,
      academies: 71,
      coaches: 143,
      events: 42,
      highlight:
        "Club football and private academy networks continue to create new development pathways for young players.",
      states: [
        "Maharashtra",
        "Goa",
        "Gujarat",
        "Rajasthan"
      ]
    },

    central: {
      name: "Central India",
      badge: "Central",
      description:
        "An emerging region where grassroots programmes are expanding access to organised football.",
      players: 1740,
      academies: 44,
      coaches: 91,
      events: 23,
      highlight:
        "Community tournaments and school programmes are helping introduce structured football development.",
      states: [
        "Madhya Pradesh",
        "Chhattisgarh",
        "Vidarbha",
        "Bundelkhand"
      ]
    },

    east: {
      name: "East India",
      badge: "East",
      description:
        "A historically important football region with passionate supporters, established clubs and strong youth talent.",
      players: 2460,
      academies: 63,
      coaches: 128,
      events: 39,
      highlight:
        "Traditional football centres remain key contributors to player development and competitive football culture.",
      states: [
        "West Bengal",
        "Odisha",
        "Jharkhand",
        "Bihar"
      ]
    },

    northeast: {
      name: "North-East India",
      badge: "North-East",
      description:
        "One of India’s richest football talent regions, known for passionate communities and highly skilled young players.",
      players: 3180,
      academies: 76,
      coaches: 151,
      events: 46,
      highlight:
        "The region continues to produce exceptional football talent through community clubs, schools and local academies.",
      states: [
        "Nagaland",
        "Manipur",
        "Mizoram",
        "Meghalaya",
        "Assam"
      ]
    },

    south: {
      name: "South India",
      badge: "South",
      description:
        "A fast-growing football ecosystem supported by professional clubs, modern academies and expanding fan communities.",
      players: 3010,
      academies: 79,
      coaches: 159,
      events: 44,
      highlight:
        "Professional club academies and youth leagues are strengthening long-term player development pathways.",
      states: [
        "Kerala",
        "Karnataka",
        "Tamil Nadu",
        "Telangana",
        "Andhra Pradesh"
      ]
    }

  };


  function formatNumber(value) {

    return new Intl.NumberFormat("en-IN").format(value);

  }


  function updateRegionDetails(regionKey) {

    const selectedRegion = regionData[regionKey];

    if (!selectedRegion) {
      return;
    }


    mapRegions.forEach((region) => {

      const isSelected =
        region.dataset.region === regionKey;

      region.classList.toggle(
        "is-active",
        isSelected
      );

      region.setAttribute(
        "aria-pressed",
        String(isSelected)
      );

    });


    if (mobileRegionSelector) {
      mobileRegionSelector.value = regionKey;
    }


    regionName.textContent = selectedRegion.name;

    regionBadge.textContent = selectedRegion.badge;

    regionDescription.textContent =
      selectedRegion.description;

    regionPlayers.textContent = formatNumber(
      selectedRegion.players
    );

    regionAcademies.textContent = formatNumber(
      selectedRegion.academies
    );

    regionCoaches.textContent = formatNumber(
      selectedRegion.coaches
    );

    regionEvents.textContent = formatNumber(
      selectedRegion.events
    );

    regionHighlight.textContent =
      selectedRegion.highlight;


    regionStateList.replaceChildren();

    selectedRegion.states.forEach((stateName) => {

      const stateTag = document.createElement("span");

      stateTag.textContent = stateName;

      regionStateList.appendChild(stateTag);

    });


    exploreRegionButton.dataset.selectedRegion =
      regionKey;

    exploreRegionButton.firstChild.textContent =
      `Explore ${selectedRegion.name} `;

  }


  mapRegions.forEach((region) => {

    region.addEventListener("click", () => {

      updateRegionDetails(region.dataset.region);

    });


    region.addEventListener("keydown", (event) => {

      if (
        event.key !== "Enter" &&
        event.key !== " "
      ) {
        return;
      }

      event.preventDefault();

      updateRegionDetails(region.dataset.region);

    });

  });


  if (mobileRegionSelector) {

    mobileRegionSelector.addEventListener(
      "change",
      () => {

        updateRegionDetails(
          mobileRegionSelector.value
        );

      }
    );

  }


  /*
    Frontend placeholder action.

    The route can later display region-specific:

    - Players
    - Academies
    - Coaches
    - Scouts
    - Events
    - Trials
  */

  exploreRegionButton.addEventListener("click", () => {

    const selectedRegion =
      exploreRegionButton.dataset.selectedRegion;

    if (!selectedRegion) {
      return;
    }

    console.log(
      `Selected football region: ${selectedRegion}`
    );


    /*
      Future route example:

      window.location.href =
        `discover.html?region=${
          encodeURIComponent(selectedRegion)
        }`;
    */

  });


  /*
    Backend integration placeholder.

    Mr. Harsh can later replace regionData with API data:

    GET /api/map/regions
  */

  async function loadRegionData() {

    const mapVisual = document.getElementById(
      "indiaMapVisual"
    );

    if (!mapVisual) {
      return;
    }

    const apiEndpoint =
      mapVisual.dataset.apiEndpoint;

    if (!apiEndpoint) {
      return;
    }


    /*
      Backend integration example:

      try {

        const response = await fetch(apiEndpoint);

        if (!response.ok) {
          throw new Error(
            "Unable to load regional map data."
          );
        }

        const apiRegionData = await response.json();

        Object.assign(
          regionData,
          apiRegionData
        );

        updateRegionDetails("north");

      } catch (error) {

        console.error(
          "India football map error:",
          error
        );

      }
    */

  }


  /*
    Keep disabled until the backend is available.

    loadRegionData();
  */


  updateRegionDetails("north");

});