/* =========================================================
   PLAYER HELP & SUPPORT
   FIFA Mission India
   Frontend Only
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  const searchInput =
    document.getElementById("supportSearch");

  const searchButton =
    document.getElementById("supportSearchBtn");

  const faqItems =
    Array.from(document.querySelectorAll(".faq-item"));

  const faqCount =
    document.getElementById("faqResultCount");

  const faqEmptyState =
    document.getElementById("faqEmptyState");

  const supportModal =
    document.getElementById("supportModal");

  const ticketForm =
    document.getElementById("supportTicketForm");

  const ticketCategory =
    document.getElementById("ticketCategory");

  const ticketPriority =
    document.getElementById("ticketPriority");

  const ticketSubject =
    document.getElementById("ticketSubject");

  const ticketDescription =
    document.getElementById("ticketDescription");

  const ticketAttachment =
    document.getElementById("ticketAttachment");

  const ticketUploadLabel =
    document.getElementById("ticketUploadLabel");

  const ticketCounter =
    document.getElementById("ticketCharacterCounter");

  const ticketMessage =
    document.getElementById("ticketFormMessage");

  const ticketSubmitButton =
    document.getElementById("ticketSubmitBtn");

  const requestDetailsModal =
    document.getElementById("requestDetailsModal");

  const requestDetailsContent =
    document.getElementById("requestDetailsContent");


  /* ===========================================
      FAQ ACCORDION
  =========================================== */

  document
    .querySelectorAll(".faq-question")
    .forEach(button => {

      button.addEventListener("click", () => {

        const item =
          button.closest(".faq-item");

        const answer =
          item.querySelector(".faq-answer");

        const isOpen =
          item.classList.contains("open");

        document
          .querySelectorAll(".faq-item.open")
          .forEach(openItem => {

            if (openItem !== item) {

              openItem.classList.remove("open");

              const openButton =
                openItem.querySelector(".faq-question");

              const openAnswer =
                openItem.querySelector(".faq-answer");

              openButton.setAttribute(
                "aria-expanded",
                "false"
              );

              openAnswer.hidden = true;

            }

          });

        item.classList.toggle(
          "open",
          !isOpen
        );

        button.setAttribute(
          "aria-expanded",
          String(!isOpen)
        );

        answer.hidden = isOpen;

      });

    });


  /* ===========================================
      FAQ SEARCH
  =========================================== */

  function filterFaqs(
    searchTerm = "",
    selectedCategory = ""
  ) {

    const query =
      searchTerm.trim().toLowerCase();

    let visibleCount = 0;

    faqItems.forEach(item => {

      const searchableText = [

        item.dataset.search || "",

        item.textContent || ""

      ]
        .join(" ")
        .toLowerCase();

      const matchesSearch =
        !query ||
        searchableText.includes(query);

      const matchesCategory =
        !selectedCategory ||
        item.dataset.category === selectedCategory;

      const showItem =
        matchesSearch && matchesCategory;

      item.hidden = !showItem;

      if (showItem) {

        visibleCount += 1;

      }

    });

    faqCount.textContent =

      `${visibleCount} ${
        visibleCount === 1
          ? "question"
          : "questions"
      }`;

    faqEmptyState.hidden =
      visibleCount !== 0;

  }


  function runSearch() {

    clearCategorySelection();

    filterFaqs(
      searchInput.value
    );

    scrollToFaq();

  }


  if (searchButton) {

    searchButton.addEventListener(
      "click",
      runSearch
    );

  }


  if (searchInput) {

    searchInput.addEventListener(
      "input",
      () => {

        clearCategorySelection();

        filterFaqs(
          searchInput.value
        );

      }
    );

    searchInput.addEventListener(
      "keydown",
      event => {

        if (event.key === "Enter") {

          event.preventDefault();

          runSearch();

        }

      }
    );

  }


  /* ===========================================
      POPULAR SEARCH BUTTONS
  =========================================== */

  document
    .querySelectorAll("[data-search-term]")
    .forEach(button => {

      button.addEventListener(
        "click",
        () => {

          searchInput.value =
            button.dataset.searchTerm;

          runSearch();

        }
      );

    });


  /* ===========================================
      CATEGORY FILTERS
  =========================================== */

  document
    .querySelectorAll("[data-category]")
    .forEach(card => {

      if (
        !card.classList.contains(
          "support-category-card"
        )
      ) {

        return;

      }

      card.addEventListener(
        "click",
        () => {

          const category =
            card.dataset.category;

          const isAlreadyActive =
            card.classList.contains("active");

          clearCategorySelection();

          searchInput.value = "";

          if (!isAlreadyActive) {

            card.classList.add("active");

            filterFaqs(
              "",
              category
            );

          } else {

            filterFaqs();

          }

          scrollToFaq();

        }
      );

    });


  function clearCategorySelection() {

    document
      .querySelectorAll(
        ".support-category-card.active"
      )
      .forEach(card => {

        card.classList.remove("active");

      });

  }


  function scrollToFaq() {

    document
      .querySelector(".faq-panel")
      ?.scrollIntoView({

        behavior: "smooth",

        block: "start"

      });

  }

    /* ===========================================
      SUPPORT MODAL
  =========================================== */

  const supportOpenButtons = [

    document.getElementById("openTicketBtn"),

    document.getElementById("sideContactBtn"),

    document.querySelector(".empty-contact-btn")

  ].filter(Boolean);


  supportOpenButtons.forEach(button => {

    button.addEventListener(
      "click",
      () => {

        openSupportModal();

      }
    );

  });


  function openSupportModal(
    category = ""
  ) {

    supportModal.hidden = false;

    document.body.style.overflow =
      "hidden";

    if (category) {

      ticketCategory.value =
        category;

    }

    setTimeout(() => {

      ticketCategory.focus();

    }, 0);

  }


  function closeSupportModal() {

    supportModal.hidden = true;

    document.body.style.overflow =
      "";

  }


  document
    .querySelectorAll(
      "[data-support-close]"
    )
    .forEach(element => {

      element.addEventListener(
        "click",
        closeSupportModal
      );

    });


  /* ===========================================
      DESCRIPTION CHARACTER COUNTER
  =========================================== */

  if (ticketDescription) {

    ticketDescription.addEventListener(
      "input",
      () => {

        ticketCounter.textContent =

          `${ticketDescription.value.length} / 1200`;

      }
    );

  }


  /* ===========================================
      ATTACHMENT VALIDATION
  =========================================== */

  if (ticketAttachment) {

    ticketAttachment.addEventListener(
      "change",
      () => {

        const file =
          ticketAttachment.files[0];

        if (!file) {

          ticketUploadLabel.textContent =
            "Upload screenshot or document";

          return;

        }

        const validTypes = [

          "image/png",

          "image/jpeg",

          "application/pdf"

        ];

        const maximumSize =
          5 * 1024 * 1024;

        if (
          !validTypes.includes(
            file.type
          )
        ) {

          showTicketMessage(

            "Please upload a PNG, JPG or PDF file.",

            true

          );

          ticketAttachment.value =
            "";

          ticketUploadLabel.textContent =
            "Upload screenshot or document";

          return;

        }

        if (
          file.size > maximumSize
        ) {

          showTicketMessage(

            "Attachment must be smaller than 5 MB.",

            true

          );

          ticketAttachment.value =
            "";

          ticketUploadLabel.textContent =
            "Upload screenshot or document";

          return;

        }

        ticketUploadLabel.textContent =
          file.name;

        showTicketMessage("");

      }
    );

  }


  /* ===========================================
      SUPPORT TICKET FORM
  =========================================== */

  if (ticketForm) {

    ticketForm.addEventListener(
      "submit",
      async event => {

        event.preventDefault();

        if (
          !ticketForm.checkValidity()
        ) {

          ticketForm.reportValidity();

          return;

        }

        const ticketData = {

          category:
            ticketCategory.value,

          priority:
            ticketPriority.value,

          subject:
            ticketSubject.value.trim(),

          description:
            ticketDescription.value.trim(),

          attachment:
            ticketAttachment.files[0] ||
            null,

          createdAt:
            new Date().toISOString()

        };


        ticketSubmitButton.disabled =
          true;

        ticketSubmitButton.innerHTML = `
          <i class="fa-solid fa-spinner fa-spin"></i>
          Submitting
        `;


        /*
        ===============================================

        BACKEND INTEGRATION — MR. HARSH

        1. Upload the optional attachment securely.

        2. Save the support ticket in the database.

        3. Return the real ticket ID and status.

        Example:

        const createdTicket =
          await createSupportTicket(ticketData);

        ===============================================
        */


        try {

          await demoDelay(800);

          const ticketReference =

            `FMI-${
              String(Date.now()).slice(-5)
            }`;


          addDemoRequest(

            ticketData,

            ticketReference

          );


          showTicketMessage(

            `Request #${ticketReference} submitted successfully.`

          );


          ticketForm.reset();

          ticketCounter.textContent =
            "0 / 1200";

          ticketUploadLabel.textContent =
            "Upload screenshot or document";


          setTimeout(() => {

            closeSupportModal();

            showTicketMessage("");

          }, 1300);

        } catch (error) {

          console.error(error);

          showTicketMessage(

            "The request could not be submitted. Please try again.",

            true

          );

        } finally {

          ticketSubmitButton.disabled =
            false;

          ticketSubmitButton.innerHTML = `
            <i class="fa-solid fa-paper-plane"></i>
            Submit Request
          `;

        }

      }
    );

  }


  /* ===========================================
      TICKET MESSAGE
  =========================================== */

  function showTicketMessage(
    message,
    isError = false
  ) {

    ticketMessage.textContent =
      message;

    ticketMessage.style.color =

      isError
        ? "#d63d46"
        : "#14815e";

  }


  /* ===========================================
      ADD NEW DEMO REQUEST
  =========================================== */

  function addDemoRequest(
    ticketData,
    ticketReference
  ) {

    const list =
      document.getElementById(
        "supportRequestList"
      );

    const article =
      document.createElement(
        "article"
      );

    article.className =
      "support-request-card";


    article.dataset.request =
      JSON.stringify({

        reference:
          ticketReference,

        subject:
          ticketData.subject,

        category:
          categoryLabel(
            ticketData.category
          ),

        priority:
          ticketData.priority,

        status:
          "Open",

        submitted:
          new Date().toLocaleDateString(
            "en-IN",
            {

              day: "numeric",

              month: "long",

              year: "numeric"

            }
          )

      });


    article.innerHTML = `

      <div class="request-main">

        <span class="request-icon">

          <i class="fa-solid fa-headset"></i>

        </span>


        <div>

          <span class="request-reference">

            #${escapeHtml(
              ticketReference
            )}

          </span>


          <h3>

            ${escapeHtml(
              ticketData.subject
            )}

          </h3>


          <p>

            Submitted today ·

            ${escapeHtml(
              categoryLabel(
                ticketData.category
              )
            )}

          </p>

        </div>

      </div>


      <span class="request-status in-progress">

        Open

      </span>


      <button

        type="button"

        class="request-details-btn"

        aria-label="View support request ${escapeHtml(
          ticketReference
        )}"

      >

        <i class="fa-solid fa-chevron-right"></i>

      </button>

    `;


    list.prepend(article);


    attachRequestDetailsHandler(

      article.querySelector(
        ".request-details-btn"
      )

    );

  }

    /* ===========================================
      EXISTING REQUEST DATA
  =========================================== */

  const requestData = {

    "FMI-20341": {

      reference:
        "FMI-20341",

      subject:
        "Document verification taking longer than expected",

      category:
        "Documents",

      priority:
        "Normal",

      status:
        "In Progress",

      submitted:
        "15 July 2026"

    },


    "FMI-20287": {

      reference:
        "FMI-20287",

      subject:
        "Unable to submit trial application",

      category:
        "Trials & Applications",

      priority:
        "Normal",

      status:
        "Resolved",

      submitted:
        "9 July 2026"

    }

  };


  /* ===========================================
      REQUEST DETAILS BUTTONS
  =========================================== */

  document
    .querySelectorAll(
      ".request-details-btn"
    )
    .forEach(button => {

      attachRequestDetailsHandler(
        button
      );

    });


  function attachRequestDetailsHandler(
    button
  ) {

    button.addEventListener(
      "click",
      () => {

        const card =
          button.closest(
            ".support-request-card"
          );


        const customData =
          card.dataset.request

            ? JSON.parse(
                card.dataset.request
              )

            : null;


        const referenceText =

          card
            .querySelector(
              ".request-reference"
            )
            .textContent
            .replace("#", "")
            .trim();


        const details =

          customData ||

          requestData[
            referenceText
          ];


        if (!details) {

          return;

        }


        requestDetailsContent.innerHTML = `

          <div class="request-detail-grid">

            ${requestDetailRow(
              "Reference",
              `#${details.reference}`
            )}

            ${requestDetailRow(
              "Subject",
              details.subject
            )}

            ${requestDetailRow(
              "Category",
              details.category
            )}

            ${requestDetailRow(
              "Priority",
              capitalise(
                details.priority
              )
            )}

            ${requestDetailRow(
              "Status",
              details.status
            )}

            ${requestDetailRow(
              "Submitted",
              details.submitted
            )}

          </div>

        `;


        requestDetailsModal.hidden =
          false;


        document.body.style.overflow =
          "hidden";

      }
    );

  }


  /* ===========================================
      CLOSE REQUEST DETAILS MODAL
  =========================================== */

  document
    .querySelectorAll(
      "[data-request-close]"
    )
    .forEach(element => {

      element.addEventListener(
        "click",
        () => {

          requestDetailsModal.hidden =
            true;

          document.body.style.overflow =
            "";

        }
      );

    });


  /* ===========================================
      ESCAPE KEY
  =========================================== */

  document.addEventListener(
    "keydown",
    event => {

      if (
        event.key !== "Escape"
      ) {

        return;

      }


      if (
        supportModal &&
        !supportModal.hidden
      ) {

        closeSupportModal();

      }


      if (
        requestDetailsModal &&
        !requestDetailsModal.hidden
      ) {

        requestDetailsModal.hidden =
          true;

        document.body.style.overflow =
          "";

      }

    }
  );


  /* ===========================================
      REQUEST DETAIL ROW
  =========================================== */

  function requestDetailRow(
    label,
    value
  ) {

    return `

      <div class="request-detail-row">

        <span>

          ${escapeHtml(label)}

        </span>

        <strong>

          ${escapeHtml(value)}

        </strong>

      </div>

    `;

  }


  /* ===========================================
      CATEGORY LABEL
  =========================================== */

  function categoryLabel(
    value
  ) {

    const labels = {

      account:
        "Account & Profile",

      trials:
        "Trials & Applications",

      documents:
        "Documents",

      performance:
        "Performance Data",

      messages:
        "Messages & Notifications",

      privacy:
        "Safety & Privacy",

      other:
        "Other"

    };


    return labels[value] || "Other";

  }


  /* ===========================================
      CAPITALISE TEXT
  =========================================== */

  function capitalise(
    value
  ) {

    return String(value)

      .replaceAll(
        "-",
        " "
      )

      .replace(

        /\b\w/g,

        character =>
          character.toUpperCase()

      );

  }


  /* ===========================================
      ESCAPE HTML
  =========================================== */

  function escapeHtml(
    value
  ) {

    const element =
      document.createElement(
        "div"
      );


    element.textContent =
      String(value);


    return element.innerHTML;

  }


  /* ===========================================
      FRONTEND DEMO DELAY
  =========================================== */

  function demoDelay(
    milliseconds
  ) {

    return new Promise(
      resolve => {

        setTimeout(

          resolve,

          milliseconds

        );

      }
    );

  }


  /* ===========================================
      FRONTEND READY
  =========================================== */

  console.log(
    "Player Help & Support frontend loaded successfully."
  );

});