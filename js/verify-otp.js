"use strict";

/* =========================================================
   FIFA MISSION INDIA - OTP VERIFICATION
   Frontend only
========================================================= */

const otpForm = document.getElementById(
  "otpVerificationForm"
);

const otpInputs = Array.from(
  document.querySelectorAll(".otp-input")
);

const otpErrorMessage = document.getElementById(
  "otpErrorMessage"
);

const verifyButton = document.getElementById(
  "verifyButton"
);

const verifyButtonLabel = verifyButton.querySelector(
  ".verify-button-label"
);

const resendButton = document.getElementById(
  "resendButton"
);

const resendMessage = document.getElementById(
  "resendMessage"
);

const countdownTimer = document.getElementById(
  "countdownTimer"
);

const changeNumberButton = document.getElementById(
  "changeNumberButton"
);

const verificationModal = document.getElementById(
  "verificationModal"
);

const RESEND_DURATION = 30;

let countdown = RESEND_DURATION;
let countdownInterval = null;


/* ================= OTP INPUT ================= */

otpInputs.forEach((input, index) => {

  input.addEventListener("input", (event) => {

    const value = event.target.value.replace(/\D/g, "");

    event.target.value = value.slice(-1);

    clearOtpError();


    if (
      event.target.value &&
      index < otpInputs.length - 1
    ) {

      otpInputs[index + 1].focus();

    }

  });


  input.addEventListener("keydown", (event) => {

    if (
      event.key === "Backspace" &&
      !input.value &&
      index > 0
    ) {

      otpInputs[index - 1].focus();

    }


    if (
      event.key === "ArrowLeft" &&
      index > 0
    ) {

      otpInputs[index - 1].focus();

    }


    if (
      event.key === "ArrowRight" &&
      index < otpInputs.length - 1
    ) {

      otpInputs[index + 1].focus();

    }

  });


  input.addEventListener("paste", (event) => {

    event.preventDefault();

    const pastedValue = event.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, otpInputs.length);


    if (!pastedValue) {

      return;

    }


    otpInputs.forEach((otpInput, otpIndex) => {

      otpInput.value = pastedValue[otpIndex] || "";

    });


    const nextIndex = Math.min(
      pastedValue.length,
      otpInputs.length - 1
    );

    otpInputs[nextIndex].focus();

    clearOtpError();

  });

});


function getOtpValue() {

  return otpInputs
    .map((input) => input.value)
    .join("");

}


function validateOtp() {

  const otpValue = getOtpValue();

  clearOtpError();


  if (otpValue.length !== otpInputs.length) {

    showOtpError(
      "Enter the complete six-digit verification code."
    );

    focusFirstEmptyInput();

    return false;

  }


  if (!/^\d{6}$/.test(otpValue)) {

    showOtpError(
      "The verification code must contain only numbers."
    );

    return false;

  }

  return true;

}


function showOtpError(message) {

  otpErrorMessage.textContent = message;

  otpInputs.forEach((input) => {

    input.classList.add("error");

    input.setAttribute("aria-invalid", "true");

  });

}


function clearOtpError() {

  otpErrorMessage.textContent = "";

  otpInputs.forEach((input) => {

    input.classList.remove("error");

    input.removeAttribute("aria-invalid");

  });

}


function focusFirstEmptyInput() {

  const emptyInput = otpInputs.find(
    (input) => !input.value
  );

  emptyInput?.focus();

}


/* ================= VERIFY ================= */

otpForm.addEventListener("submit", async (event) => {

  event.preventDefault();


  if (!validateOtp()) {

    return;

  }


  setVerifying(true);


  try {

    const otp = getOtpValue();

    /*
      BACKEND INTEGRATION PLACEHOLDER

      const response = await fetch(
        "/api/v1/auth/verify-otp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          credentials: "include",
          body: JSON.stringify({
            otp,
            verificationToken:
              sessionStorage.getItem("verificationToken")
          })
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "OTP verification failed."
        );
      }

      showSuccessModal();
    */


    console.info(
      "OTP submitted for frontend demonstration:",
      otp
    );


    await new Promise((resolve) => {

      window.setTimeout(resolve, 900);

    });


    showSuccessModal();

  } catch (error) {

    console.error(
      "OTP verification error:",
      error
    );

    showOtpError(
      error.message ||
      "The verification code is incorrect or expired."
    );

  } finally {

    setVerifying(false);

  }

});


function setVerifying(isVerifying) {

  verifyButton.disabled = isVerifying;

  verifyButton.classList.toggle(
    "loading",
    isVerifying
  );

  verifyButtonLabel.textContent =
    isVerifying
      ? "Verifying..."
      : "Verify & Continue";

}


function showSuccessModal() {

  verificationModal.hidden = false;

  document.body.style.overflow = "hidden";

}


/* ================= RESEND OTP ================= */

function startCountdown() {

  clearInterval(countdownInterval);

  countdown = RESEND_DURATION;

  resendButton.disabled = true;

  resendMessage.hidden = false;

  updateCountdownDisplay();


  countdownInterval = window.setInterval(() => {

    countdown -= 1;

    updateCountdownDisplay();


    if (countdown <= 0) {

      clearInterval(countdownInterval);

      resendButton.disabled = false;

      resendMessage.hidden = true;

    }

  }, 1000);

}


function updateCountdownDisplay() {

  const minutes = Math.floor(countdown / 60)
    .toString()
    .padStart(2, "0");

  const seconds = (countdown % 60)
    .toString()
    .padStart(2, "0");

  countdownTimer.textContent =
    `${minutes}:${seconds}`;

}


resendButton.addEventListener("click", async () => {

  resendButton.disabled = true;

  resendButton.textContent = "Sending...";


  try {

    /*
      BACKEND INTEGRATION PLACEHOLDER

      const response = await fetch(
        "/api/v1/auth/resend-otp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          credentials: "include",
          body: JSON.stringify({
            verificationToken:
              sessionStorage.getItem("verificationToken")
          })
        }
      );

      if (!response.ok) {
        throw new Error("Unable to resend OTP.");
      }
    */


    await new Promise((resolve) => {

      window.setTimeout(resolve, 700);

    });


    clearOtpInputs();

    startCountdown();

  } catch (error) {

    console.error(
      "Resend OTP error:",
      error
    );

    otpErrorMessage.textContent =
      "Unable to resend the code. Please try again.";

    resendButton.disabled = false;

  } finally {

    resendButton.textContent = "Resend OTP";

  }

});


function clearOtpInputs() {

  otpInputs.forEach((input) => {

    input.value = "";

  });

  otpInputs[0].focus();

  clearOtpError();

}


/* ================= CHANGE NUMBER ================= */

changeNumberButton.addEventListener("click", () => {

  /*
    Frontend route placeholder.

    Later, this can redirect users to a secure
    phone-number update flow.
  */

  window.location.href = "register.html";

});


/* ================= INITIALISE ================= */

function initialiseOtpPage() {

  /*
    Mr. Harsh can later store masked destination details
    securely after registration.

    Example:

    const maskedPhone =
      sessionStorage.getItem("maskedPhone");

    if (maskedPhone) {
      maskedDestination.textContent = maskedPhone;
    }
  */

  otpInputs[0].focus();

  startCountdown();

}


initialiseOtpPage();