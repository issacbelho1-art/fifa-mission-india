/* =====================================================
   LOGIN PAGE
   Frontend-only authentication demonstration

   Backend integration: Mr. Harsh
===================================================== */

document.addEventListener("DOMContentLoaded", () => {

  const loginForm =
    document.getElementById("loginForm");

  const emailInput =
    document.getElementById("loginEmail");

  const passwordInput =
    document.getElementById("loginPassword");

  const passwordToggle =
    document.getElementById("loginPasswordToggle");

  const emailError =
    document.getElementById("loginEmailError");

  const passwordError =
    document.getElementById("loginPasswordError");

  const formStatus =
    document.getElementById("loginFormStatus");

  const submitButton =
    document.getElementById("loginSubmitButton");

  const submitText =
    submitButton?.querySelector(".auth-submit-text");

  const rememberMe =
    document.getElementById("rememberMe");

  const googleLoginButton =
    document.getElementById("googleLoginButton");


  if (
    !loginForm ||
    !emailInput ||
    !passwordInput ||
    !submitButton
  ) {
    return;
  }


  /* ===================================================
     HELPERS
  =================================================== */

  function isValidEmail(emailAddress) {

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
      emailAddress
    );

  }


  function setFieldError(
    inputElement,
    errorElement,
    message
  ) {

    inputElement.classList.toggle(
      "is-invalid",
      Boolean(message)
    );

    inputElement.setAttribute(
      "aria-invalid",
      String(Boolean(message))
    );

    if (errorElement) {
      errorElement.textContent = message;
    }

  }


  function clearFormStatus() {

    if (!formStatus) {
      return;
    }

    formStatus.textContent = "";

    formStatus.classList.remove(
      "is-visible",
      "is-error",
      "is-success"
    );

  }


  function showFormStatus(
    message,
    type = "error"
  ) {

    if (!formStatus) {
      return;
    }

    formStatus.textContent = message;

    formStatus.classList.add("is-visible");

    formStatus.classList.toggle(
      "is-error",
      type === "error"
    );

    formStatus.classList.toggle(
      "is-success",
      type === "success"
    );

  }


  function setLoadingState(isLoading) {

    submitButton.disabled = isLoading;

    submitButton.classList.toggle(
      "is-loading",
      isLoading
    );

    if (submitText) {

      submitText.textContent =
        isLoading
          ? "Signing In"
          : "Sign In";

    }

  }


  /* ===================================================
     PASSWORD VISIBILITY
  =================================================== */

  passwordToggle?.addEventListener(
    "click",
    () => {

      const passwordIsVisible =
        passwordInput.type === "text";

      passwordInput.type =
        passwordIsVisible
          ? "password"
          : "text";

      passwordToggle.setAttribute(
        "aria-pressed",
        String(!passwordIsVisible)
      );

      passwordToggle.setAttribute(
        "aria-label",
        passwordIsVisible
          ? "Show password"
          : "Hide password"
      );

    }
  );


  /* ===================================================
     VALIDATION
  =================================================== */

  function validateLoginForm() {

    const emailAddress =
      emailInput.value.trim();

    const password =
      passwordInput.value;

    let formIsValid = true;


    setFieldError(
      emailInput,
      emailError,
      ""
    );

    setFieldError(
      passwordInput,
      passwordError,
      ""
    );

    clearFormStatus();


    if (!emailAddress) {

      setFieldError(
        emailInput,
        emailError,
        "Please enter your email address."
      );

      formIsValid = false;

    } else if (!isValidEmail(emailAddress)) {

      setFieldError(
        emailInput,
        emailError,
        "Please enter a valid email address."
      );

      formIsValid = false;

    }


    if (!password) {

      setFieldError(
        passwordInput,
        passwordError,
        "Please enter your password."
      );

      formIsValid = false;

    } else if (password.length < 8) {

      setFieldError(
        passwordInput,
        passwordError,
        "Password must contain at least 8 characters."
      );

      formIsValid = false;

    }


    return formIsValid;

  }


  emailInput.addEventListener("input", () => {

    setFieldError(
      emailInput,
      emailError,
      ""
    );

    clearFormStatus();

  });


  passwordInput.addEventListener("input", () => {

    setFieldError(
      passwordInput,
      passwordError,
      ""
    );

    clearFormStatus();

  });


  /* ===================================================
     LOGIN SUBMISSION
  =================================================== */

  loginForm.addEventListener(
    "submit",
    async (event) => {

      event.preventDefault();


      if (!validateLoginForm()) {

        const firstInvalidInput =
          loginForm.querySelector(
            ".is-invalid"
          );

        firstInvalidInput?.focus();

        return;

      }


      const apiEndpoint =
        loginForm.dataset.apiEndpoint;


      const loginPayload = {

        email:
          emailInput.value.trim().toLowerCase(),

        password:
          passwordInput.value,

        rememberMe:
          rememberMe?.checked || false

      };


      console.log(
        "Login payload prepared:",
        {
          email: loginPayload.email,
          rememberMe: loginPayload.rememberMe
        }
      );


      setLoadingState(true);


      /*
        Production backend integration:

        POST /api/auth/login

        Request body:

        {
          "email": "player@example.com",
          "password": "user-password",
          "rememberMe": true
        }
      */


      /*
      try {

        const response = await fetch(
          apiEndpoint,
          {
            method: "POST",

            headers: {
              "Content-Type": "application/json"
            },

            credentials: "include",

            body: JSON.stringify(
              loginPayload
            )
          }
        );


        const responseData =
          await response.json();


        if (!response.ok) {

          throw new Error(
            responseData.message ||
            "Unable to sign in."
          );

        }


        showFormStatus(
          "Login successful. Redirecting...",
          "success"
        );


        const redirectRoute =
          getDashboardRoute(
            responseData.user.role
          );


        window.location.href =
          responseData.redirectTo ||
          redirectRoute;


      } catch (error) {

        console.error(
          "Login error:",
          error
        );


        showFormStatus(
          error.message ||
          "Login failed. Please check your details.",
          "error"
        );


      } finally {

        setLoadingState(false);

      }
      */


      /*
        Temporary frontend demonstration.
        Remove after backend integration.
      */

      window.setTimeout(() => {

        showFormStatus(
          "Frontend login validation successful. The authentication API will be connected by Mr. Harsh.",
          "success"
        );

        setLoadingState(false);

      }, 800);

    }
  );


  /* ===================================================
     DASHBOARD ROUTES
  =================================================== */

  function getDashboardRoute(userRole) {

    const dashboardRoutes = {

      player: "player-dashboard.html",

      coach: "coach-dashboard.html",

      academy: "academy-dashboard.html",

      scout: "scout-dashboard.html",

      supporter: "supporter-dashboard.html",

      admin: "admin-dashboard.html"

    };


    return (
      dashboardRoutes[userRole] ||
      "dashboard.html"
    );

  }


  /* ===================================================
     GOOGLE LOGIN PLACEHOLDER
  =================================================== */

  googleLoginButton?.addEventListener(
    "click",
    () => {

      clearFormStatus();


      showFormStatus(
        "Google authentication will be available after backend OAuth integration.",
        "success"
      );


      /*
        Future route:

        window.location.href =
          "/api/auth/google";
      */

    }
  );

});