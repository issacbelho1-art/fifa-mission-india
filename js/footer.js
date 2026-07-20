/* =====================================================
   PREMIUM FOOTER
   Frontend-only interaction

   Backend integration: Mr. Harsh
===================================================== */

document.addEventListener("DOMContentLoaded", () => {

  const currentYearElement =
    document.getElementById("footerCurrentYear");

  const newsletterForm =
    document.getElementById("footerNewsletterForm");

  const newsletterEmail =
    document.getElementById("footerNewsletterEmail");

  const newsletterConsent =
    document.getElementById("footerNewsletterConsent");

  const newsletterStatus =
    document.getElementById("footerNewsletterStatus");

  const backToTopButton =
    document.getElementById("footerBackToTop");

  const socialLinks =
    document.querySelectorAll("[data-social-platform]");


  /* ===================================================
     CURRENT YEAR
  =================================================== */

  if (currentYearElement) {

    currentYearElement.textContent =
      new Date().getFullYear();

  }


  /* ===================================================
     EMAIL VALIDATION
  =================================================== */

  function isValidEmail(emailAddress) {

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
      emailAddress
    );

  }


  function updateNewsletterStatus(
    message,
    statusType = "success"
  ) {

    if (!newsletterStatus) {
      return;
    }

    newsletterStatus.textContent = message;

    newsletterStatus.classList.toggle(
      "is-error",
      statusType === "error"
    );

  }


  /* ===================================================
     NEWSLETTER SUBMISSION
  =================================================== */

  newsletterForm?.addEventListener(
    "submit",
    async (event) => {

      event.preventDefault();

      updateNewsletterStatus("");


      const emailAddress =
        newsletterEmail?.value.trim() || "";

      const consentGranted =
        newsletterConsent?.checked || false;


      if (!isValidEmail(emailAddress)) {

        updateNewsletterStatus(
          "Please enter a valid email address.",
          "error"
        );

        newsletterEmail?.focus();

        return;

      }


      if (!consentGranted) {

        updateNewsletterStatus(
          "Please confirm that you agree to receive updates.",
          "error"
        );

        newsletterConsent?.focus();

        return;

      }


      const submitButton =
        newsletterForm.querySelector(
          'button[type="submit"]'
        );

      const apiEndpoint =
        newsletterForm.dataset.apiEndpoint;


      if (submitButton) {

        submitButton.disabled = true;

        submitButton.innerHTML = `
          Submitting
          <span aria-hidden="true">…</span>
        `;

      }


      const newsletterPayload = {
        email: emailAddress,
        consent: consentGranted,
        source: "website-footer"
      };


      console.log(
        "Newsletter subscription:",
        newsletterPayload
      );


      /*
        Backend integration for Mr. Harsh:

        POST /api/newsletter/subscribe

        Request body:

        {
          "email": "user@example.com",
          "consent": true,
          "source": "website-footer"
        }
      */


      /*
      try {

        const response = await fetch(apiEndpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(
            newsletterPayload
          )
        });

        const responseData =
          await response.json();

        if (!response.ok) {

          throw new Error(
            responseData.message ||
            "Unable to complete subscription."
          );

        }

        updateNewsletterStatus(
          "Thank you. You are now subscribed."
        );

        newsletterForm.reset();

      } catch (error) {

        console.error(
          "Newsletter subscription error:",
          error
        );

        updateNewsletterStatus(
          error.message ||
          "Subscription failed. Please try again.",
          "error"
        );

      } finally {

        if (submitButton) {

          submitButton.disabled = false;

          submitButton.innerHTML = `
            Subscribe
            <span aria-hidden="true">→</span>
          `;

        }

      }
      */


      /*
        Temporary frontend demonstration.
        Remove this block after backend connection.
      */

      window.setTimeout(() => {

        updateNewsletterStatus(
          "Frontend validation successful. Newsletter API will be connected by Mr. Harsh."
        );

        newsletterForm.reset();


        if (submitButton) {

          submitButton.disabled = false;

          submitButton.innerHTML = `
            Subscribe
            <span aria-hidden="true">→</span>
          `;

        }

      }, 650);

    }
  );


  /* ===================================================
     CLEAR ERROR WHILE EDITING
  =================================================== */

  newsletterEmail?.addEventListener(
    "input",
    () => {

      if (
        newsletterStatus?.classList.contains(
          "is-error"
        )
      ) {
        updateNewsletterStatus("");
      }

    }
  );


  newsletterConsent?.addEventListener(
    "change",
    () => {

      if (
        newsletterStatus?.classList.contains(
          "is-error"
        )
      ) {
        updateNewsletterStatus("");
      }

    }
  );


  /* ===================================================
     BACK TO TOP BUTTON
  =================================================== */

  function updateBackToTopVisibility() {

    if (!backToTopButton) {
      return;
    }

    const shouldShow =
      window.scrollY > 650;

    backToTopButton.classList.toggle(
      "is-visible",
      shouldShow
    );

  }


  backToTopButton?.addEventListener(
    "click",
    () => {

      const reduceMotion =
        window.matchMedia(
          "(prefers-reduced-motion: reduce)"
        ).matches;

      window.scrollTo({
        top: 0,
        behavior: reduceMotion
          ? "auto"
          : "smooth"
      });

    }
  );


  window.addEventListener(
    "scroll",
    updateBackToTopVisibility,
    {
      passive: true
    }
  );


  updateBackToTopVisibility();


  /* ===================================================
     SOCIAL LINK PLACEHOLDERS
  =================================================== */

  socialLinks.forEach((socialLink) => {

    socialLink.addEventListener(
      "click",
      (event) => {

        const socialUrl =
          socialLink.getAttribute("href");

        const platform =
          socialLink.dataset.socialPlatform;


        if (
          !socialUrl ||
          socialUrl === "#"
        ) {

          event.preventDefault();

          console.log(
            `${platform} social profile has not been connected yet.`
          );

        }

      }
    );

  });

});