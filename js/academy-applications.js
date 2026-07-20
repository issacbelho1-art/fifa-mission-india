/* =========================================================
   ACADEMY PLAYER APPLICATIONS
   FIFA Mission India

   Frontend interaction layer only.
   Backend integration points are provided near the end
   of the complete file.
========================================================= */

"use strict";


document.addEventListener("DOMContentLoaded", () => {

  /* =======================================================
     DOM REFERENCES
  ======================================================= */

  const body = document.body;

  const sidebar = document.getElementById("academySidebar");
  const sidebarOverlay = document.getElementById(
    "academySidebarOverlay"
  );
  const menuButton = document.getElementById(
    "academyMenuButton"
  );
  const sidebarCloseButton = document.getElementById(
    "academySidebarClose"
  );

  const profileTrigger = document.getElementById(
    "academyProfileTrigger"
  );
  const profileDropdown = document.getElementById(
    "academyProfileDropdown"
  );

  const searchInput = document.getElementById(
    "academyApplicationSearch"
  );
  const statusFilter = document.getElementById(
    "academyApplicationStatus"
  );
  const ageGroupFilter = document.getElementById(
    "academyApplicationAgeGroup"
  );
  const positionFilter = document.getElementById(
    "academyApplicationPosition"
  );
  const sortFilter = document.getElementById(
    "academyApplicationSort"
  );

  const resetFilterButton = document.getElementById(
    "academyApplicationReset"
  );
  const emptyResetButton = document.getElementById(
    "academyEmptyResetFilters"
  );

  const tableWrapper = document.getElementById(
    "academyApplicationsTableWrapper"
  );
  const tableBody = document.getElementById(
    "academyApplicationsTableBody"
  );
  const gridContainer = document.getElementById(
    "academyApplicationsGrid"
  );
  const emptyState = document.getElementById(
    "academyApplicationsEmpty"
  );

  const resultText = document.getElementById(
    "academyApplicationsResultText"
  );
  const paginationText = document.getElementById(
    "academyPaginationText"
  );

  const viewButtons = document.querySelectorAll(
    "[data-application-view]"
  );
  const statCards = document.querySelectorAll(
    "[data-status-filter]"
  );

  const applicationRows = Array.from(
    document.querySelectorAll(".academy-application-row")
  );

  let currentView = "table";
  let activeStatus = "all";


  /* =======================================================
     SAFETY HELPERS
  ======================================================= */

  function normalizeValue(value) {
    return String(value || "")
      .trim()
      .toLowerCase();
  }


  function escapeHtml(value) {
    return String(value || "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }


  function formatStatus(status) {
    const normalizedStatus = normalizeValue(status);

    if (!normalizedStatus) {
      return "Pending";
    }

    return normalizedStatus
      .charAt(0)
      .toUpperCase() +
      normalizedStatus.slice(1);
  }


  function getInitials(name) {
    const parts = String(name || "")
      .trim()
      .split(/\s+/)
      .filter(Boolean);

    if (!parts.length) {
      return "PL";
    }

    return parts
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join("");
  }


  function getRowData(row) {
    if (!row) {
      return null;
    }

    const playerCell = row.querySelector(
      ".academy-player-cell"
    );
    const playerImage = playerCell?.querySelector("img");
    const playerFoot = playerCell?.querySelector("small");
    const applicationType = row.querySelector(
      ".academy-application-id span"
    );
    const documentButton = row.querySelector(
      ".academy-document-status"
    );

    return {
      element: row,
      id: row.dataset.applicationId || "",
      name: row.dataset.playerName || "Player",
      status: normalizeValue(
        row.dataset.status || "pending"
      ),
      ageGroup: normalizeValue(
        row.dataset.ageGroup || ""
      ),
      position: normalizeValue(
        row.dataset.position || ""
      ),
      rating: Number(row.dataset.rating || 0),
      location: row.dataset.location || "",
      submitted: row.dataset.submitted || "",
      image:
        playerImage?.getAttribute("src") ||
        "images/player-avatar-placeholder.png",
      foot:
        playerFoot?.textContent?.trim() ||
        "Not specified",
      applicationType:
        applicationType?.textContent?.trim() ||
        "Academy application",
      documentText:
        documentButton?.textContent
          ?.replace(/\s+/g, " ")
          .trim() || "0/4",
      documentsComplete:
        documentButton?.classList.contains("complete") ||
        false
    };
  }


  /* =======================================================
     SIDEBAR
  ======================================================= */

  function openSidebar() {
    if (!sidebar) {
      return;
    }

    sidebar.classList.add("active");

    if (sidebarOverlay) {
      sidebarOverlay.hidden = false;
    }

    body.classList.add("academy-sidebar-open");
  }


  function closeSidebar() {
    if (!sidebar) {
      return;
    }

    sidebar.classList.remove("active");

    if (sidebarOverlay) {
      sidebarOverlay.hidden = true;
    }

    body.classList.remove("academy-sidebar-open");
  }


  menuButton?.addEventListener("click", openSidebar);
  sidebarCloseButton?.addEventListener(
    "click",
    closeSidebar
  );
  sidebarOverlay?.addEventListener(
    "click",
    closeSidebar
  );


  /* =======================================================
     PROFILE DROPDOWN
  ======================================================= */

  function closeProfileDropdown() {
    if (!profileDropdown || !profileTrigger) {
      return;
    }

    profileDropdown.hidden = true;

    profileTrigger.setAttribute(
      "aria-expanded",
      "false"
    );
  }


  function toggleProfileDropdown() {
    if (!profileDropdown || !profileTrigger) {
      return;
    }

    const willOpen = profileDropdown.hidden;

    profileDropdown.hidden = !willOpen;

    profileTrigger.setAttribute(
      "aria-expanded",
      String(willOpen)
    );
  }


  profileTrigger?.addEventListener(
    "click",
    (event) => {

      event.stopPropagation();

      toggleProfileDropdown();

    }
  );


  document.addEventListener("click", (event) => {

    if (
      profileDropdown &&
      profileTrigger &&
      !profileDropdown.contains(event.target) &&
      !profileTrigger.contains(event.target)
    ) {
      closeProfileDropdown();
    }

  });


  /* =======================================================
     ROW VISIBILITY
  ======================================================= */

  function rowMatchesSearch(row, query) {
    if (!query) {
      return true;
    }

    const rowData = getRowData(row);

    if (!rowData) {
      return false;
    }

    const searchableText = [
      rowData.id,
      rowData.name,
      rowData.location,
      rowData.position,
      rowData.ageGroup,
      rowData.status,
      rowData.applicationType
    ]
      .join(" ")
      .toLowerCase();

    return searchableText.includes(query);
  }


  function rowMatchesStatus(row, status) {
    if (status === "all") {
      return true;
    }

    return normalizeValue(
      row.dataset.status
    ) === status;
  }


  function rowMatchesAgeGroup(row, ageGroup) {
    if (ageGroup === "all") {
      return true;
    }

    return normalizeValue(
      row.dataset.ageGroup
    ) === ageGroup;
  }


  function rowMatchesPosition(row, position) {
    if (position === "all") {
      return true;
    }

    return normalizeValue(
      row.dataset.position
    ) === position;
  }


  function getFilteredRows() {
    const query = normalizeValue(searchInput?.value);
    const selectedStatus = normalizeValue(
      statusFilter?.value || activeStatus
    );
    const selectedAgeGroup = normalizeValue(
      ageGroupFilter?.value || "all"
    );
    const selectedPosition = normalizeValue(
      positionFilter?.value || "all"
    );

    return applicationRows.filter((row) => {

      return (
        rowMatchesSearch(row, query) &&
        rowMatchesStatus(row, selectedStatus) &&
        rowMatchesAgeGroup(row, selectedAgeGroup) &&
        rowMatchesPosition(row, selectedPosition)
      );

    });
  }


  /* =======================================================
     SORTING
  ======================================================= */

  function sortRows(rows) {
    const selectedSort = normalizeValue(
      sortFilter?.value || "newest"
    );

    const sortedRows = [...rows];

    sortedRows.sort((firstRow, secondRow) => {

      const firstData = getRowData(firstRow);
      const secondData = getRowData(secondRow);

      if (!firstData || !secondData) {
        return 0;
      }

      switch (selectedSort) {

        case "oldest":
          return (
            new Date(firstData.submitted) -
            new Date(secondData.submitted)
          );

        case "name":
          return firstData.name.localeCompare(
            secondData.name
          );

        case "rating":
          return secondData.rating - firstData.rating;

        case "newest":
        default:
          return (
            new Date(secondData.submitted) -
            new Date(firstData.submitted)
          );

      }

    });

    return sortedRows;
  }


  /* =======================================================
     RESULT COUNTS
  ======================================================= */

  function updateResultInformation(visibleCount) {
    const totalCount = applicationRows.length;

    if (resultText) {
      resultText.textContent =
        `Showing ${visibleCount} of ${totalCount} applications`;
    }

    if (paginationText) {
      if (visibleCount === 0) {
        paginationText.textContent = `0 of ${totalCount}`;
      } else {
        paginationText.textContent =
          `1–${visibleCount} of ${totalCount}`;
      }
    }
  }


  /* =======================================================
     EMPTY STATE
  ======================================================= */

  function updateEmptyState(visibleCount) {
    const hasResults = visibleCount > 0;

    if (emptyState) {
      emptyState.hidden = hasResults;
    }

    if (currentView === "table") {

      if (tableWrapper) {
        tableWrapper.hidden = !hasResults;
      }

      if (gridContainer) {
        gridContainer.hidden = true;
      }

    } else {

      if (tableWrapper) {
        tableWrapper.hidden = true;
      }

      if (gridContainer) {
        gridContainer.hidden = !hasResults;
      }

    }
  }


  /* =======================================================
     TABLE RENDERING
  ======================================================= */

  function renderTableRows(sortedRows) {
    const visibleRows = new Set(sortedRows);

    applicationRows.forEach((row) => {

      row.hidden = !visibleRows.has(row);

    });

    sortedRows.forEach((row) => {

      tableBody?.appendChild(row);

    });
  }


  /* =======================================================
     GRID CARD CREATION
  ======================================================= */

  function createApplicationCard(rowData) {
    const article = document.createElement("article");

    article.className = "academy-application-card";

    article.dataset.applicationId = rowData.id;
    article.dataset.status = rowData.status;

    article.innerHTML = `
      <label class="academy-table-checkbox academy-card-select">

        <input
          type="checkbox"
          class="academy-grid-application-select"
          data-application-id="${escapeHtml(rowData.id)}"
          aria-label="Select ${escapeHtml(rowData.name)}"
        >

        <span>
          <i class="fa-solid fa-check"></i>
        </span>

      </label>


      <div class="academy-application-card-header">

        <img
          src="${escapeHtml(rowData.image)}"
          alt="${escapeHtml(rowData.name)}"
        >

        <div>

          <h3>
            ${escapeHtml(rowData.name)}
          </h3>

          <p>
            <i class="fa-solid fa-location-dot"></i>
            ${escapeHtml(rowData.location)}
          </p>

        </div>

        <span
          class="academy-status-badge
          ${escapeHtml(rowData.status)}
          academy-application-card-status"
        >
          ${escapeHtml(formatStatus(rowData.status))}
        </span>

      </div>


      <div class="academy-card-details">

        <div>

          <span>
            Application ID
          </span>

          <strong>
            ${escapeHtml(rowData.id)}
          </strong>

        </div>

        <div>

          <span>
            Age Group
          </span>

          <strong>
            ${escapeHtml(
              rowData.ageGroup.toUpperCase()
            )}
          </strong>

        </div>

        <div>

          <span>
            Position
          </span>

          <strong>
            ${escapeHtml(
              formatStatus(rowData.position)
            )}
          </strong>

        </div>

        <div>

          <span>
            Rating
          </span>

          <strong class="academy-card-rating">

            <i class="fa-solid fa-star"></i>

            ${escapeHtml(
              rowData.rating.toFixed(1)
            )}

          </strong>

        </div>

        <div>

          <span>
            Playing Foot
          </span>

          <strong>
            ${escapeHtml(rowData.foot)}
          </strong>

        </div>

        <div>

          <span>
            Documents
          </span>

          <strong>
            ${escapeHtml(rowData.documentText)}
          </strong>

        </div>

      </div>


      <div class="academy-card-footer">

        <button
          type="button"
          class="academy-row-primary-action"
          data-grid-view-application
          data-application-id="${escapeHtml(rowData.id)}"
        >
          View Application
        </button>

        <div class="academy-row-actions">

          <button
            type="button"
            class="academy-row-menu-button"
            data-grid-menu-trigger
            aria-label="More actions"
            aria-expanded="false"
          >

            <i class="fa-solid fa-ellipsis-vertical"></i>

          </button>


          <div
            class="academy-row-action-menu"
            hidden
          >

            <button
              type="button"
              data-grid-action="shortlisted"
              data-application-id="${escapeHtml(rowData.id)}"
            >

              <i class="fa-solid fa-star"></i>

              Shortlist

            </button>

            <button
              type="button"
              data-grid-action="accepted"
              data-application-id="${escapeHtml(rowData.id)}"
            >

              <i class="fa-solid fa-check"></i>

              Accept

            </button>

            <button
              type="button"
              data-grid-trial-invite
              data-application-id="${escapeHtml(rowData.id)}"
            >

              <i class="fa-solid fa-calendar-check"></i>

              Invite to Trial

            </button>

            <button
              type="button"
              class="danger"
              data-grid-action="rejected"
              data-application-id="${escapeHtml(rowData.id)}"
            >

              <i class="fa-solid fa-xmark"></i>

              Reject

            </button>

          </div>

        </div>

      </div>
    `;

    return article;
  }


  function renderGrid(sortedRows) {
    if (!gridContainer) {
      return;
    }

    gridContainer.innerHTML = "";

    const fragment = document.createDocumentFragment();

    sortedRows.forEach((row) => {

      const rowData = getRowData(row);

      if (!rowData) {
        return;
      }

      fragment.appendChild(
        createApplicationCard(rowData)
      );

    });

    gridContainer.appendChild(fragment);
  }


  /* =======================================================
     MAIN FILTER FUNCTION
  ======================================================= */

  function applyApplicationFilters() {
    const filteredRows = getFilteredRows();
    const sortedRows = sortRows(filteredRows);

    renderTableRows(sortedRows);
    renderGrid(sortedRows);

    updateResultInformation(sortedRows.length);
    updateEmptyState(sortedRows.length);

    return sortedRows;
  }


  /* =======================================================
     FILTER EVENTS
  ======================================================= */

  searchInput?.addEventListener(
    "input",
    applyApplicationFilters
  );

  statusFilter?.addEventListener(
    "change",
    () => {

      activeStatus = normalizeValue(
        statusFilter.value
      );

      updateActiveStatCard();
      applyApplicationFilters();

    }
  );

  ageGroupFilter?.addEventListener(
    "change",
    applyApplicationFilters
  );

  positionFilter?.addEventListener(
    "change",
    applyApplicationFilters
  );

  sortFilter?.addEventListener(
    "change",
    applyApplicationFilters
  );


  /* =======================================================
     STAT CARD FILTERING
  ======================================================= */

  function updateActiveStatCard() {
    statCards.forEach((card) => {

      const cardStatus = normalizeValue(
        card.dataset.statusFilter
      );

      card.classList.toggle(
        "active",
        cardStatus === activeStatus
      );

    });
  }


  statCards.forEach((card) => {

    card.setAttribute("tabindex", "0");
    card.setAttribute("role", "button");

    function activateCard() {
      activeStatus = normalizeValue(
        card.dataset.statusFilter || "all"
      );

      if (statusFilter) {
        statusFilter.value = activeStatus;
      }

      updateActiveStatCard();
      applyApplicationFilters();
    }

    card.addEventListener("click", activateCard);

    card.addEventListener("keydown", (event) => {

      if (
        event.key === "Enter" ||
        event.key === " "
      ) {
        event.preventDefault();
        activateCard();
      }

    });

  });


  /* =======================================================
     RESET FILTERS
  ======================================================= */

  function resetFilters() {
    if (searchInput) {
      searchInput.value = "";
    }

    if (statusFilter) {
      statusFilter.value = "all";
    }

    if (ageGroupFilter) {
      ageGroupFilter.value = "all";
    }

    if (positionFilter) {
      positionFilter.value = "all";
    }

    if (sortFilter) {
      sortFilter.value = "newest";
    }

    activeStatus = "all";

    updateActiveStatCard();
    applyApplicationFilters();
  }


  resetFilterButton?.addEventListener(
    "click",
    resetFilters
  );

  emptyResetButton?.addEventListener(
    "click",
    resetFilters
  );


  /* =======================================================
     VIEW SWITCHING
  ======================================================= */

  function setApplicationView(view) {
    const validView =
      view === "grid" ? "grid" : "table";

    currentView = validView;

    viewButtons.forEach((button) => {

      const buttonView =
        button.dataset.applicationView;

      const isActive =
        buttonView === currentView;

      button.classList.toggle(
        "active",
        isActive
      );

      button.setAttribute(
        "aria-pressed",
        String(isActive)
      );

    });

    const visibleRows = getFilteredRows();

    updateEmptyState(visibleRows.length);

    try {
      localStorage.setItem(
        "academyApplicationsView",
        currentView
      );
    } catch (error) {
      console.warn(
        "Could not save application view preference.",
        error
      );
    }
  }


  viewButtons.forEach((button) => {

    button.addEventListener("click", () => {

      setApplicationView(
        button.dataset.applicationView
      );

    });

  });


  /* =======================================================
     RESTORE VIEW PREFERENCE
  ======================================================= */

  function restoreViewPreference() {
    let storedView = "table";

    try {
      storedView =
        localStorage.getItem(
          "academyApplicationsView"
        ) || "table";
    } catch (error) {
      console.warn(
        "Could not read application view preference.",
        error
      );
    }

    setApplicationView(storedView);
  }


  /* =======================================================
     GRID MENU TOGGLING
  ======================================================= */

  function closeAllGridMenus(exception = null) {
    document
      .querySelectorAll(
        "[data-grid-menu-trigger]"
      )
      .forEach((trigger) => {

        if (trigger === exception) {
          return;
        }

        trigger.setAttribute(
          "aria-expanded",
          "false"
        );

        const menu =
          trigger.parentElement?.querySelector(
            ".academy-row-action-menu"
          );

        if (menu) {
          menu.hidden = true;
        }

      });
  }


  gridContainer?.addEventListener(
    "click",
    (event) => {

      const trigger = event.target.closest(
        "[data-grid-menu-trigger]"
      );

      if (!trigger) {
        return;
      }

      event.stopPropagation();

      const menu =
        trigger.parentElement?.querySelector(
          ".academy-row-action-menu"
        );

      if (!menu) {
        return;
      }

      const willOpen = menu.hidden;

      closeAllGridMenus(trigger);

      menu.hidden = !willOpen;

      trigger.setAttribute(
        "aria-expanded",
        String(willOpen)
      );

    }
  );


  document.addEventListener("click", (event) => {

    if (
      !event.target.closest(
        ".academy-row-actions"
      )
    ) {
      closeAllGridMenus();
    }

  });


  /* =======================================================
     INITIAL PAGE SETUP
  ======================================================= */

  updateActiveStatCard();
  applyApplicationFilters();
  restoreViewPreference();

    /* =======================================================
     ADDITIONAL DOM REFERENCES
  ======================================================= */

  const selectAllCheckbox = document.getElementById(
    "academySelectAllApplications"
  );

  const bulkActionsBar = document.getElementById(
    "academyBulkActions"
  );

  const selectedCountText = document.getElementById(
    "academySelectedCount"
  );

  const clearSelectionButton = document.getElementById(
    "academyClearSelection"
  );

  const bulkActionButtons = document.querySelectorAll(
    "[data-bulk-action]"
  );

  const applicationDrawer = document.getElementById(
    "academyApplicationDrawer"
  );

  const drawerApplicationId = document.getElementById(
    "academyDrawerApplicationId"
  );

  const drawerPlayerImage = document.getElementById(
    "academyDrawerPlayerImage"
  );

  const drawerPlayerName = document.getElementById(
    "academyDrawerPlayerName"
  );

  const drawerPlayerLocation = document.getElementById(
    "academyDrawerPlayerLocation"
  );

  const drawerStatus = document.getElementById(
    "academyDrawerStatus"
  );

  const drawerRating = document.getElementById(
    "academyDrawerRating"
  );

  const drawerPosition = document.getElementById(
    "academyDrawerPosition"
  );

  const drawerNotes = document.getElementById(
    "academyApplicationNotes"
  );

  const saveNotesButton = document.getElementById(
    "academySaveApplicationNotes"
  );

  const drawerTrialButton = document.getElementById(
    "academyDrawerTrialInvite"
  );

  const drawerActionButtons = document.querySelectorAll(
    "[data-drawer-action]"
  );

  let selectedApplicationIds = new Set();
  let activeApplicationRow = null;


  /* =======================================================
     APPLICATION LOOKUP
  ======================================================= */

  function findApplicationRow(applicationId) {
    const normalizedId = String(
      applicationId || ""
    ).trim();

    return applicationRows.find((row) => {
      return row.dataset.applicationId === normalizedId;
    }) || null;
  }


  function getApplicationIdFromElement(element) {
    if (!element) {
      return "";
    }

    const row = element.closest(
      ".academy-application-row"
    );

    if (row) {
      return row.dataset.applicationId || "";
    }

    const card = element.closest(
      ".academy-application-card"
    );

    if (card) {
      return card.dataset.applicationId || "";
    }

    return element.dataset.applicationId || "";
  }


  /* =======================================================
     TABLE ROW ACTION MENUS
  ======================================================= */

  function closeAllTableMenus(exception = null) {
    document
      .querySelectorAll("[data-row-menu-trigger]")
      .forEach((trigger) => {

        if (trigger === exception) {
          return;
        }

        trigger.setAttribute(
          "aria-expanded",
          "false"
        );

        const menu =
          trigger.parentElement?.querySelector(
            ".academy-row-action-menu"
          );

        if (menu) {
          menu.hidden = true;
        }

      });
  }


  tableBody?.addEventListener("click", (event) => {

    const trigger = event.target.closest(
      "[data-row-menu-trigger]"
    );

    if (!trigger) {
      return;
    }

    event.stopPropagation();

    const menu =
      trigger.parentElement?.querySelector(
        ".academy-row-action-menu"
      );

    if (!menu) {
      return;
    }

    const willOpen = menu.hidden;

    closeAllTableMenus(trigger);
    closeAllGridMenus();

    menu.hidden = !willOpen;

    trigger.setAttribute(
      "aria-expanded",
      String(willOpen)
    );

  });


  document.addEventListener("click", (event) => {

    if (
      !event.target.closest(
        ".academy-row-actions"
      )
    ) {
      closeAllTableMenus();
    }

  });


  /* =======================================================
     SELECTION HELPERS
  ======================================================= */

  function getVisibleApplicationIds() {
    return getFilteredRows().map((row) => {
      return row.dataset.applicationId;
    });
  }


  function isApplicationSelected(applicationId) {
    return selectedApplicationIds.has(
      applicationId
    );
  }


  function syncTableCheckboxes() {
    applicationRows.forEach((row) => {

      const applicationId =
        row.dataset.applicationId;

      const checkbox = row.querySelector(
        ".academy-application-select"
      );

      const isSelected =
        isApplicationSelected(applicationId);

      if (checkbox) {
        checkbox.checked = isSelected;
      }

      row.classList.toggle(
        "selected",
        isSelected
      );

    });
  }


  function syncGridCheckboxes() {
    gridContainer
      ?.querySelectorAll(
        ".academy-application-card"
      )
      .forEach((card) => {

        const applicationId =
          card.dataset.applicationId;

        const checkbox = card.querySelector(
          ".academy-grid-application-select"
        );

        const isSelected =
          isApplicationSelected(applicationId);

        if (checkbox) {
          checkbox.checked = isSelected;
        }

        card.classList.toggle(
          "selected",
          isSelected
        );

      });
  }


  function syncSelectAllCheckbox() {
    if (!selectAllCheckbox) {
      return;
    }

    const visibleIds = getVisibleApplicationIds();

    const visibleSelectedCount =
      visibleIds.filter((applicationId) => {
        return selectedApplicationIds.has(
          applicationId
        );
      }).length;

    selectAllCheckbox.checked =
      visibleIds.length > 0 &&
      visibleSelectedCount === visibleIds.length;

    selectAllCheckbox.indeterminate =
      visibleSelectedCount > 0 &&
      visibleSelectedCount < visibleIds.length;
  }


  function updateBulkActionBar() {
    const selectedCount =
      selectedApplicationIds.size;

    if (bulkActionsBar) {
      bulkActionsBar.hidden =
        selectedCount === 0;
    }

    if (selectedCountText) {
      selectedCountText.textContent =
        `${selectedCount} application${
          selectedCount === 1 ? "" : "s"
        } selected`;
    }
  }


  function syncApplicationSelection() {
    syncTableCheckboxes();
    syncGridCheckboxes();
    syncSelectAllCheckbox();
    updateBulkActionBar();
  }


  function selectApplication(
    applicationId,
    shouldSelect
  ) {
    if (!applicationId) {
      return;
    }

    if (shouldSelect) {
      selectedApplicationIds.add(
        applicationId
      );
    } else {
      selectedApplicationIds.delete(
        applicationId
      );
    }

    syncApplicationSelection();
  }


  function clearApplicationSelection() {
    selectedApplicationIds.clear();

    syncApplicationSelection();
  }


  /* =======================================================
     TABLE CHECKBOX EVENTS
  ======================================================= */

  tableBody?.addEventListener("change", (event) => {

    const checkbox = event.target.closest(
      ".academy-application-select"
    );

    if (!checkbox) {
      return;
    }

    const applicationId =
      getApplicationIdFromElement(checkbox);

    selectApplication(
      applicationId,
      checkbox.checked
    );

  });


  /* =======================================================
     GRID CHECKBOX EVENTS
  ======================================================= */

  gridContainer?.addEventListener(
    "change",
    (event) => {

      const checkbox = event.target.closest(
        ".academy-grid-application-select"
      );

      if (!checkbox) {
        return;
      }

      const applicationId =
        checkbox.dataset.applicationId;

      selectApplication(
        applicationId,
        checkbox.checked
      );

    }
  );


  /* =======================================================
     SELECT ALL
  ======================================================= */

  selectAllCheckbox?.addEventListener(
    "change",
    () => {

      const visibleIds =
        getVisibleApplicationIds();

      visibleIds.forEach((applicationId) => {

        if (selectAllCheckbox.checked) {
          selectedApplicationIds.add(
            applicationId
          );
        } else {
          selectedApplicationIds.delete(
            applicationId
          );
        }

      });

      syncApplicationSelection();

    }
  );


  clearSelectionButton?.addEventListener(
    "click",
    clearApplicationSelection
  );


  /* =======================================================
     KEEP SELECTION SYNCHRONIZED AFTER FILTERING
  ======================================================= */

  const originalApplyApplicationFilters =
    applyApplicationFilters;

  applyApplicationFilters = function () {
    const sortedRows =
      originalApplyApplicationFilters();

    syncApplicationSelection();

    return sortedRows;
  };


  /* =======================================================
     PLAYER DRAWER CONTENT
  ======================================================= */

  function createLocationMarkup(location) {
    return `
      <i class="fa-solid fa-location-dot"></i>
      ${escapeHtml(location || "Location unavailable")}
    `;
  }


  function updateDrawerMetaInformation(rowData) {
    const metaContainer =
      applicationDrawer?.querySelector(
        ".academy-drawer-player-meta"
      );

    if (!metaContainer) {
      return;
    }

    const ageLabel =
      rowData.ageGroup
        ? rowData.ageGroup.toUpperCase()
        : "Age not specified";

    const positionLabel =
      formatStatus(rowData.position);

    metaContainer.innerHTML = `
      <span>
        <i class="fa-solid fa-layer-group"></i>
        ${escapeHtml(ageLabel)}
      </span>

      <span>
        <i class="fa-solid fa-shirt"></i>
        ${escapeHtml(positionLabel)}
      </span>

      <span>
        <i class="fa-solid fa-shoe-prints"></i>
        ${escapeHtml(rowData.foot)}
      </span>
    `;
  }


  function updateDrawerStatus(status) {
    if (!drawerStatus) {
      return;
    }

    const normalizedStatus =
      normalizeValue(status || "pending");

    drawerStatus.className =
      `academy-status-badge ${normalizedStatus}`;

    drawerStatus.textContent =
      formatStatus(normalizedStatus);
  }


  function populateApplicationDrawer(row) {
    const rowData = getRowData(row);

    if (!rowData) {
      return;
    }

    activeApplicationRow = row;

    if (drawerApplicationId) {
      drawerApplicationId.textContent =
        rowData.id;
    }

    if (drawerPlayerImage) {
      drawerPlayerImage.src =
        rowData.image;

      drawerPlayerImage.alt =
        rowData.name;
    }

    if (drawerPlayerName) {
      drawerPlayerName.textContent =
        rowData.name;
    }

    if (drawerPlayerLocation) {
      drawerPlayerLocation.innerHTML =
        createLocationMarkup(
          rowData.location
        );
    }

    if (drawerRating) {
      drawerRating.textContent =
        rowData.rating.toFixed(1);
    }

    if (drawerPosition) {
      drawerPosition.textContent =
        formatStatus(rowData.position);
    }

    updateDrawerStatus(rowData.status);
    updateDrawerMetaInformation(rowData);

    const storedNotesKey =
      `academyApplicationNotes:${rowData.id}`;

    if (drawerNotes) {
      try {
        drawerNotes.value =
          localStorage.getItem(
            storedNotesKey
          ) || "";
      } catch (error) {
        drawerNotes.value = "";

        console.warn(
          "Could not load application notes.",
          error
        );
      }
    }

  }


  /* =======================================================
     OPEN AND CLOSE DRAWER
  ======================================================= */

  function openApplicationDrawer(row) {
    if (!applicationDrawer || !row) {
      return;
    }

    populateApplicationDrawer(row);

    applicationDrawer.classList.add(
      "active"
    );

    applicationDrawer.setAttribute(
      "aria-hidden",
      "false"
    );

    body.classList.add(
      "academy-modal-open"
    );

    const closeButton =
      applicationDrawer.querySelector(
        "[data-close-application-drawer]"
      );

    window.setTimeout(() => {
      closeButton?.focus();
    }, 100);
  }


  function closeApplicationDrawer() {
    if (!applicationDrawer) {
      return;
    }

    applicationDrawer.classList.remove(
      "active"
    );

    applicationDrawer.setAttribute(
      "aria-hidden",
      "true"
    );

    body.classList.remove(
      "academy-modal-open"
    );

    activeApplicationRow = null;
  }


  applicationDrawer
    ?.querySelectorAll(
      "[data-close-application-drawer]"
    )
    .forEach((button) => {

      button.addEventListener(
        "click",
        closeApplicationDrawer
      );

    });


  /* =======================================================
     TABLE VIEW APPLICATION BUTTON
  ======================================================= */

  tableBody?.addEventListener("click", (event) => {

    const viewButton = event.target.closest(
      "[data-view-application]"
    );

    if (!viewButton) {
      return;
    }

    const row = viewButton.closest(
      ".academy-application-row"
    );

    openApplicationDrawer(row);

  });


  /* =======================================================
     GRID VIEW APPLICATION BUTTON
  ======================================================= */

  gridContainer?.addEventListener(
    "click",
    (event) => {

      const viewButton = event.target.closest(
        "[data-grid-view-application]"
      );

      if (!viewButton) {
        return;
      }

      const applicationId =
        viewButton.dataset.applicationId;

      const row =
        findApplicationRow(applicationId);

      openApplicationDrawer(row);

    }
  );


  /* =======================================================
     DOCUMENT MODAL PREPARATION
  ======================================================= */

  const documentsModal = document.getElementById(
    "academyDocumentsModal"
  );

  const documentsPlayerName = document.getElementById(
    "academyDocumentsPlayerName"
  );


  function openDocumentsModal(row) {
    if (!documentsModal || !row) {
      return;
    }

    const rowData = getRowData(row);

    if (!rowData) {
      return;
    }

    if (documentsPlayerName) {
      documentsPlayerName.textContent =
        `${rowData.name} · ${rowData.id}`;
    }

    documentsModal.hidden = false;

    body.classList.add(
      "academy-modal-open"
    );
  }


  function closeDocumentsModal() {
    if (!documentsModal) {
      return;
    }

    documentsModal.hidden = true;

    body.classList.remove(
      "academy-modal-open"
    );
  }


  documentsModal
    ?.querySelectorAll(
      "[data-close-documents-modal]"
    )
    .forEach((button) => {

      button.addEventListener(
        "click",
        closeDocumentsModal
      );

    });


  tableBody?.addEventListener("click", (event) => {

    const documentButton = event.target.closest(
      "[data-document-action]"
    );

    if (!documentButton) {
      return;
    }

    const row = documentButton.closest(
      ".academy-application-row"
    );

    openDocumentsModal(row);

  });


  /* =======================================================
     APPLICATION NOTES
  ======================================================= */

  saveNotesButton?.addEventListener(
    "click",
    () => {

      if (
        !activeApplicationRow ||
        !drawerNotes
      ) {
        return;
      }

      const applicationId =
        activeApplicationRow.dataset.applicationId;

      const storageKey =
        `academyApplicationNotes:${applicationId}`;

      try {
        localStorage.setItem(
          storageKey,
          drawerNotes.value.trim()
        );

        showAcademyToast(
          "Application notes saved.",
          "success"
        );
      } catch (error) {
        console.error(
          "Could not save application notes.",
          error
        );

        showAcademyToast(
          "Unable to save notes.",
          "error"
        );
      }

      /*
        BACKEND INTEGRATION — MR. HARSH

        Replace localStorage with:

        PATCH /api/academy/applications/:applicationId/notes

        Body:
        {
          notes: drawerNotes.value.trim()
        }
      */

    }
  );


  /* =======================================================
     GENERIC TABLE ACTION ROUTING
  ======================================================= */

  tableBody?.addEventListener("click", (event) => {

    const actionButton = event.target.closest(
      "[data-application-action]"
    );

    if (!actionButton) {
      return;
    }

    const row = actionButton.closest(
      ".academy-application-row"
    );

    const action =
      actionButton.dataset.applicationAction;

    closeAllTableMenus();

    routeApplicationAction(
      row,
      action
    );

  });


  /* =======================================================
     GENERIC GRID ACTION ROUTING
  ======================================================= */

  gridContainer?.addEventListener(
    "click",
    (event) => {

      const actionButton = event.target.closest(
        "[data-grid-action]"
      );

      if (!actionButton) {
        return;
      }

      const applicationId =
        actionButton.dataset.applicationId;

      const action =
        actionButton.dataset.gridAction;

      const row =
        findApplicationRow(applicationId);

      closeAllGridMenus();

      routeApplicationAction(
        row,
        action
      );

    }
  );


  /* =======================================================
     TRIAL INVITATION ROUTING
  ======================================================= */

  tableBody?.addEventListener("click", (event) => {

    const trialButton = event.target.closest(
      "[data-invite-trial]"
    );

    if (!trialButton) {
      return;
    }

    const row = trialButton.closest(
      ".academy-application-row"
    );

    closeAllTableMenus();

    openTrialInvitationModal(row);

  });


  gridContainer?.addEventListener(
    "click",
    (event) => {

      const trialButton = event.target.closest(
        "[data-grid-trial-invite]"
      );

      if (!trialButton) {
        return;
      }

      const applicationId =
        trialButton.dataset.applicationId;

      const row =
        findApplicationRow(applicationId);

      closeAllGridMenus();

      openTrialInvitationModal(row);

    }
  );


  drawerTrialButton?.addEventListener(
    "click",
    () => {

      if (!activeApplicationRow) {
        return;
      }

      openTrialInvitationModal(
        activeApplicationRow
      );

    }
  );


  /* =======================================================
     DRAWER STATUS ACTIONS
  ======================================================= */

  drawerActionButtons.forEach((button) => {

    button.addEventListener("click", () => {

      if (!activeApplicationRow) {
        return;
      }

      const action =
        button.dataset.drawerAction;

      routeApplicationAction(
        activeApplicationRow,
        action
      );

    });

  });


  /* =======================================================
     BULK ACTION ROUTING
  ======================================================= */

  bulkActionButtons.forEach((button) => {

    button.addEventListener("click", () => {

      const action =
        button.dataset.bulkAction;

      const selectedRows =
        Array.from(
          selectedApplicationIds
        )
          .map(findApplicationRow)
          .filter(Boolean);

      if (!selectedRows.length) {
        showAcademyToast(
          "Select at least one application.",
          "warning"
        );

        return;
      }

      routeBulkApplicationAction(
        selectedRows,
        action
      );

    });

  });


  /* =======================================================
     KEYBOARD DRAWER CONTROL
  ======================================================= */

  document.addEventListener("keydown", (event) => {

    if (
      event.key === "Escape" &&
      applicationDrawer?.classList.contains(
        "active"
      )
    ) {
      closeApplicationDrawer();
    }

  });


  /* =======================================================
     RE-SYNC AFTER INITIAL RENDER
  ======================================================= */

  syncApplicationSelection();


  /* =======================================================
     FUNCTIONS PROVIDED IN PART 3

     The following functions will be created next:

     - showAcademyToast()
     - routeApplicationAction()
     - routeBulkApplicationAction()
     - openTrialInvitationModal()
     - openRejectApplicationModal()
     - updateApplicationStatus()
     - modal open and close handlers
     - trial invitation submission
     - rejection submission
     - export applications
     - add application demo
     - logout controls
     - pagination interactions
  ======================================================= */

    /* =======================================================
     TOAST NOTIFICATIONS
  ======================================================= */

  const toastContainer = document.getElementById(
    "academyToastContainer"
  );

  function showAcademyToast(message, type = "success") {

    if (!toastContainer) return;

    const icons = {
      success: "fa-circle-check",
      error: "fa-circle-xmark",
      warning: "fa-triangle-exclamation",
      info: "fa-circle-info"
    };

    const toast = document.createElement("article");

    toast.className = `academy-toast academy-toast-${type}`;

    toast.innerHTML = `
      <div class="academy-toast-icon">
        <i class="fa-solid ${icons[type] || icons.info}"></i>
      </div>

      <p>${escapeHtml(message)}</p>

      <button type="button">
        <i class="fa-solid fa-xmark"></i>
      </button>
    `;

    toastContainer.appendChild(toast);

    requestAnimationFrame(() => {
      toast.classList.add("show");
    });

    const removeToast = () => {
      toast.classList.remove("show");
      toast.classList.add("removing");

      setTimeout(() => {
        toast.remove();
      }, 250);
    };

    toast
      .querySelector("button")
      ?.addEventListener("click", removeToast);

    setTimeout(removeToast, 3500);
  }


  /* =======================================================
     STATUS HELPERS
  ======================================================= */

  function updateApplicationStatus(row, status) {

    if (!row) return;

    row.dataset.status = status;

    const badge = row.querySelector(
      ".academy-status-badge"
    );

    if (badge) {
      badge.className =
        `academy-status-badge ${status}`;

      badge.textContent =
        formatStatus(status);
    }

    if (
      activeApplicationRow === row
    ) {
      updateDrawerStatus(status);
    }

    applyApplicationFilters();

    /*
    ==========================================================
    BACKEND INTEGRATION — MR. HARSH

    PATCH

    /api/academy/applications/:id/status

    {
      status : status
    }

    ==========================================================
    */

  }


  /* =======================================================
     BULK STATUS UPDATE
  ======================================================= */

  function updateMultipleApplications(
    rows,
    status
  ) {

    rows.forEach((row) => {

      updateApplicationStatus(
        row,
        status
      );

    });

    clearApplicationSelection();

    showAcademyToast(
      `${rows.length} application${
        rows.length > 1 ? "s" : ""
      } updated.`,
      "success"
    );

  }


  /* =======================================================
     ACTION ROUTER
  ======================================================= */

  function routeApplicationAction(
    row,
    action
  ) {

    if (!row) return;

    switch (action) {

      case "accepted":

        updateApplicationStatus(
          row,
          "accepted"
        );

        showAcademyToast(
          "Application accepted.",
          "success"
        );

        break;


      case "shortlisted":

        updateApplicationStatus(
          row,
          "shortlisted"
        );

        showAcademyToast(
          "Player shortlisted.",
          "success"
        );

        break;


      case "pending":

        updateApplicationStatus(
          row,
          "pending"
        );

        showAcademyToast(
          "Moved back to pending.",
          "info"
        );

        break;


      case "rejected":

        openRejectApplicationModal(
          row
        );

        break;

    }

  }


  /* =======================================================
     BULK ROUTER
  ======================================================= */

  function routeBulkApplicationAction(
    rows,
    action
  ) {

    switch (action) {

      case "accepted":

        updateMultipleApplications(
          rows,
          "accepted"
        );

        break;

      case "shortlisted":

        updateMultipleApplications(
          rows,
          "shortlisted"
        );

        break;

      case "pending":

        updateMultipleApplications(
          rows,
          "pending"
        );

        break;

      case "rejected":

        rows.forEach((row) => {

          updateApplicationStatus(
            row,
            "rejected"
          );

        });

        clearApplicationSelection();

        showAcademyToast(
          "Applications rejected.",
          "warning"
        );

        break;

      default:

        showAcademyToast(
          "Unknown bulk action.",
          "error"
        );

    }

  }


  /* =======================================================
     EXPORT (Frontend Demo)
  ======================================================= */

  const exportButton = document.getElementById(
    "academyExportApplications"
  );

  exportButton?.addEventListener(
    "click",
    () => {

      showAcademyToast(
        "Export started (Frontend Demo).",
        "info"
      );

      /*
      =========================================================
      BACKEND INTEGRATION — MR HARSH

      GET

      /api/academy/applications/export

      CSV / Excel / PDF

      =========================================================
      */

    }
  );


  /* =======================================================
     ADD APPLICATION BUTTON
  ======================================================= */

  document
    .getElementById(
      "academyAddApplication"
    )
    ?.addEventListener(
      "click",
      () => {

        showAcademyToast(
          "Application creation will be connected to backend.",
          "info"
        );

      }
    );

      /* =======================================================
     REJECT APPLICATION MODAL
  ======================================================= */

  const rejectModal = document.getElementById(
    "academyRejectModal"
  );

  const rejectPlayerPreview = document.getElementById(
    "academyRejectPlayerPreview"
  );

  const rejectReason = document.getElementById(
    "academyRejectReason"
  );

  const rejectNotes = document.getElementById(
    "academyRejectNotes"
  );

  const rejectSubmitButton = document.getElementById(
    "academyRejectSubmit"
  );

  let rejectTargetRow = null;

  function openRejectApplicationModal(row) {

    if (!row || !rejectModal) return;

    rejectTargetRow = row;

    const data = getRowData(row);

    rejectPlayerPreview.innerHTML = `
      <span>${getInitials(data.name)}</span>

      <div>
        <strong>${escapeHtml(data.name)}</strong>
        <small>${escapeHtml(data.id)}</small>
      </div>
    `;

    rejectReason.value = "";
    rejectNotes.value = "";

    rejectModal.hidden = false;
    body.classList.add("academy-modal-open");
  }

  function closeRejectApplicationModal() {

    rejectModal.hidden = true;
    body.classList.remove("academy-modal-open");

    rejectTargetRow = null;
  }

  rejectModal
    ?.querySelectorAll("[data-close-reject-modal]")
    .forEach((button) => {

      button.addEventListener(
        "click",
        closeRejectApplicationModal
      );

    });

  rejectSubmitButton?.addEventListener(
    "click",
    () => {

      if (!rejectTargetRow) return;

      if (!rejectReason.value.trim()) {

        showAcademyToast(
          "Please select a rejection reason.",
          "warning"
        );

        rejectReason.focus();

        return;
      }

      updateApplicationStatus(
        rejectTargetRow,
        "rejected"
      );

      showAcademyToast(
        "Application rejected.",
        "success"
      );

      /*
      ==========================================================
      BACKEND INTEGRATION — MR. HARSH

      PATCH

      /api/academy/applications/:id/reject

      {
          reason: rejectReason.value,
          notes: rejectNotes.value
      }

      ==========================================================
      */

      closeRejectApplicationModal();

    }
  );


  /* =======================================================
     TRIAL INVITATION MODAL
  ======================================================= */

  const trialModal = document.getElementById(
    "academyTrialModal"
  );

  const trialPlayerPreview = document.getElementById(
    "academyTrialPlayerPreview"
  );

  const trialDate = document.getElementById(
    "academyTrialDate"
  );

  const trialTime = document.getElementById(
    "academyTrialTime"
  );

  const trialVenue = document.getElementById(
    "academyTrialVenue"
  );

  const trialCoach = document.getElementById(
    "academyTrialCoach"
  );

  const trialInstructions = document.getElementById(
    "academyTrialInstructions"
  );

  const trialSubmitButton = document.getElementById(
    "academyTrialSubmit"
  );

  let trialTargetRow = null;

  function openTrialInvitationModal(row) {

    if (!row || !trialModal) return;

    trialTargetRow = row;

    const data = getRowData(row);

    trialPlayerPreview.innerHTML = `
      <span>${getInitials(data.name)}</span>

      <div>
        <strong>${escapeHtml(data.name)}</strong>
        <small>${escapeHtml(data.id)}</small>
      </div>
    `;

    trialDate.value = "";
    trialTime.value = "";
    trialVenue.value = "";
    trialCoach.value = "";
    trialInstructions.value = "";

    trialModal.hidden = false;

    body.classList.add("academy-modal-open");
  }

  function closeTrialInvitationModal() {

    trialModal.hidden = true;

    body.classList.remove("academy-modal-open");

    trialTargetRow = null;
  }

  trialModal
    ?.querySelectorAll("[data-close-trial-modal]")
    .forEach((button) => {

      button.addEventListener(
        "click",
        closeTrialInvitationModal
      );

    });


  trialSubmitButton?.addEventListener(
    "click",
    () => {

      if (!trialTargetRow) return;

      if (
        !trialDate.value ||
        !trialTime.value ||
        !trialVenue.value.trim()
      ) {

        showAcademyToast(
          "Please complete all required fields.",
          "warning"
        );

        return;
      }

      updateApplicationStatus(
        trialTargetRow,
        "shortlisted"
      );

      showAcademyToast(
        "Trial invitation created.",
        "success"
      );

      /*
      ==========================================================
      BACKEND INTEGRATION — MR. HARSH

      POST

      /api/academy/trials/invite

      {
          applicationId,
          date,
          time,
          venue,
          coach,
          instructions
      }

      Send Email
      Send Notification
      Save Trial Record

      ==========================================================
      */

      closeTrialInvitationModal();

    }
  );


  /* =======================================================
     GENERIC MODAL ESCAPE HANDLER
  ======================================================= */

  document.addEventListener(
    "keydown",
    (event) => {

      if (event.key !== "Escape") return;

      if (
        !rejectModal.hidden
      ) {
        closeRejectApplicationModal();
      }

      if (
        !trialModal.hidden
      ) {
        closeTrialInvitationModal();
      }

      if (
        documentsModal &&
        !documentsModal.hidden
      ) {
        closeDocumentsModal();
      }

    }
  );


  /* =======================================================
     BACKDROP CLOSE
  ======================================================= */

  document
    .querySelectorAll(".academy-modal")
    .forEach((modal) => {

      modal.addEventListener(
        "click",
        (event) => {

          if (
            event.target === modal
          ) {

            if (modal === rejectModal) {
              closeRejectApplicationModal();
            }

            if (modal === trialModal) {
              closeTrialInvitationModal();
            }

            if (modal === documentsModal) {
              closeDocumentsModal();
            }

          }

        }
      );

    });

      /* =======================================================
     LOGOUT MODAL
  ======================================================= */

  const logoutModal = document.getElementById(
    "academyLogoutModal"
  );

  const logoutButton = document.getElementById(
    "academyLogoutButton"
  );

  const confirmLogoutButton = document.getElementById(
    "academyConfirmLogout"
  );

  function openLogoutModal() {

    if (!logoutModal) return;

    logoutModal.hidden = false;

    body.classList.add("academy-modal-open");
  }

  function closeLogoutModal() {

    if (!logoutModal) return;

    logoutModal.hidden = true;

    body.classList.remove("academy-modal-open");
  }

  logoutButton?.addEventListener(
    "click",
    openLogoutModal
  );

  logoutModal
    ?.querySelectorAll(
      "[data-close-logout-modal]"
    )
    .forEach((button) => {

      button.addEventListener(
        "click",
        closeLogoutModal
      );

    });

  confirmLogoutButton?.addEventListener(
    "click",
    () => {

      showAcademyToast(
        "Logging out...",
        "info"
      );

      /*
      ==========================================================
      BACKEND INTEGRATION — MR. HARSH

      POST

      /api/logout

      Destroy session
      Clear JWT
      Redirect to Login Page

      ==========================================================
      */

      setTimeout(() => {

        window.location.href =
          "login.html";

      }, 900);

    }
  );


  /* =======================================================
     PAGINATION DEMO
  ======================================================= */

  const paginationButtons =
    document.querySelectorAll(
      "[data-page]"
    );

  paginationButtons.forEach((button) => {

    button.addEventListener(
      "click",
      () => {

        paginationButtons.forEach((btn) => {

          btn.classList.remove(
            "active"
          );

        });

        button.classList.add(
          "active"
        );

        showAcademyToast(
          `Demo page ${button.dataset.page}`,
          "info"
        );

        /*
        Backend:

        GET

        /api/academy/applications?page=2

        */

      }
    );

  });


  /* =======================================================
     PREVIOUS / NEXT
  ======================================================= */

  document
    .querySelectorAll(
      "[data-pagination-control]"
    )
    .forEach((button) => {

      button.addEventListener(
        "click",
        () => {

          showAcademyToast(
            "Pagination demo.",
            "info"
          );

        }
      );

    });


  /* =======================================================
     KEYBOARD SHORTCUTS
  ======================================================= */

  document.addEventListener(
    "keydown",
    (event) => {

      if (
        event.ctrlKey &&
        event.key.toLowerCase() === "f"
      ) {

        event.preventDefault();

        searchInput?.focus();
      }

      if (
        event.ctrlKey &&
        event.key.toLowerCase() === "e"
      ) {

        event.preventDefault();

        exportButton?.click();
      }

      if (
        event.ctrlKey &&
        event.key.toLowerCase() === "r"
      ) {

        event.preventDefault();

        applyApplicationFilters();

        showAcademyToast(
          "Applications refreshed.",
          "info"
        );
      }

    }
  );


  /* =======================================================
     AUTO SAVE NOTES (Frontend)
  ======================================================= */

  let notesSaveTimer = null;

  drawerNotes?.addEventListener(
    "input",
    () => {

      clearTimeout(
        notesSaveTimer
      );

      notesSaveTimer =
        setTimeout(() => {

          if (
            !activeApplicationRow
          ) return;

          try {

            localStorage.setItem(

              `academyApplicationDraft:${activeApplicationRow.dataset.applicationId}`,

              drawerNotes.value

            );

          }

          catch (error) {

            console.warn(error);

          }

        }, 700);

    }
  );


  /* =======================================================
     RESTORE DRAFT NOTES
  ======================================================= */

  function restoreDraftNotes(
    applicationId
  ) {

    if (
      !drawerNotes
    ) return;

    try {

      const draft =
        localStorage.getItem(

          `academyApplicationDraft:${applicationId}`

        );

      if (
        draft &&
        !drawerNotes.value
      ) {

        drawerNotes.value =
          draft;

      }

    }

    catch (error) {

      console.warn(error);

    }

  }


  /* =======================================================
     WINDOW RESIZE
  ======================================================= */

  window.addEventListener(
    "resize",
    () => {

      if (
        window.innerWidth > 992
      ) {

        closeSidebar();

      }

    }
  );


  /* =======================================================
     BEFORE UNLOAD
  ======================================================= */

  window.addEventListener(
    "beforeunload",
    (event) => {

      if (
        drawerNotes &&
        drawerNotes.value.trim()
      ) {

        event.preventDefault();

        event.returnValue = "";

      }

    }
  );


  /* =======================================================
     APPLICATION COUNTS
  ======================================================= */

  function refreshStatistics() {

    const counts = {
      total: 0,
      pending: 0,
      shortlisted: 0,
      accepted: 0,
      rejected: 0
    };

    applicationRows.forEach((row) => {

      counts.total++;

      const status =
        normalizeValue(
          row.dataset.status
        );

      if (
        counts[status] !== undefined
      ) {

        counts[status]++;

      }

    });

    document
      .querySelectorAll(
        "[data-stat-count]"
      )
      .forEach((element) => {

        const key =
          element.dataset.statCount;

        if (
          counts[key] !== undefined
        ) {

          element.textContent =
            counts[key];

        }

      });

  }


  const originalStatusUpdater =
    updateApplicationStatus;

  updateApplicationStatus =
    function(row,status){

      originalStatusUpdater(
        row,
        status
      );

      refreshStatistics();

    };


  refreshStatistics();

    /* =======================================================
     BACKEND INTEGRATION PLACEHOLDERS
     -------------------------------------------------------
     These functions are intentionally left as clean
     integration points for Mr. Harsh.

     Frontend should NOT contain API logic.
  ======================================================= */

  const AcademyApplicationsAPI = {

    loadApplications() {

      /*
      =======================================================
      GET

      /api/academy/applications

      Response Example:

      [
          {
              id,
              player,
              ageGroup,
              position,
              rating,
              documents,
              status
          }
      ]

      Render table
      Render grid
      Update statistics

      =======================================================
      */

    },



    loadSingleApplication(applicationId) {

      /*
      GET

      /api/academy/applications/:id

      Populate drawer

      */

    },



    updateStatus(applicationId, status) {

      /*
      PATCH

      /api/academy/applications/:id/status

      */

    },



    rejectApplication(applicationId, payload) {

      /*
      PATCH

      /reject

      */

    },



    invitePlayer(applicationId, payload) {

      /*
      POST

      /trial/invite

      */

    },



    saveNotes(applicationId, notes) {

      /*
      PATCH

      /notes

      */

    },



    exportApplications(format) {

      /*
      GET

      CSV

      Excel

      PDF

      */

    }

  };


  /* =======================================================
     ACCESSIBILITY
  ======================================================= */

  document
    .querySelectorAll("button")
    .forEach((button) => {

      if (
        !button.getAttribute("type")
      ) {

        button.type = "button";

      }

    });

  document
    .querySelectorAll(
      ".academy-row-action-menu button"
    )
    .forEach((button) => {

      button.setAttribute(
        "tabindex",
        "0"
      );

    });


  /* =======================================================
     DRAWER FOCUS TRAP
  ======================================================= */

  applicationDrawer?.addEventListener(
    "keydown",
    (event) => {

      if (
        event.key !== "Tab"
      ) return;

      const focusable =
        applicationDrawer.querySelectorAll(

          'button,[href],input,textarea,select,[tabindex]:not([tabindex="-1"])'

        );

      if (
        !focusable.length
      ) return;

      const first =
        focusable[0];

      const last =
        focusable[
          focusable.length - 1
        ];

      if (
        event.shiftKey &&
        document.activeElement === first
      ) {

        event.preventDefault();

        last.focus();

      }

      else if (

        !event.shiftKey &&
        document.activeElement === last

      ) {

        event.preventDefault();

        first.focus();

      }

    }
  );


  /* =======================================================
     DEMO DATA INDICATOR
  ======================================================= */

  console.info(

`
========================================================

 FIFA Mission India

 Academy Player Applications

 Frontend Build

 Backend:
 Mr. Harsh

 Security:
 Samarth

 Frontend:
 Issac Belho

========================================================

This page currently uses demo frontend data.

All API calls should be connected through
AcademyApplicationsAPI.

========================================================
`

  );


  /* =======================================================
     INITIAL PAGE LOAD
  ======================================================= */

  applyApplicationFilters();

  syncApplicationSelection();

  refreshStatistics();

  updateActiveStatCard();

  closeAllGridMenus();

  closeAllTableMenus();

  closeProfileDropdown();

  closeSidebar();

  console.log(
    "Academy Player Applications Loaded."
  );


  /* =======================================================
     FUTURE ROADMAP

     Backend:
       ✓ Authentication
       ✓ Pagination
       ✓ Export
       ✓ Notes
       ✓ Trial Scheduling
       ✓ Notifications
       ✓ Email
       ✓ Push Notifications
       ✓ Player Timeline

     Future Frontend:
       ✓ AI Player Recommendation
       ✓ Advanced Search
       ✓ Compare Players
       ✓ Performance Charts
       ✓ Trial Attendance
       ✓ Live Notifications
       ✓ Drag & Drop Evaluation

  ======================================================= */

});