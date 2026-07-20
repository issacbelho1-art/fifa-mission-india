/* =========================================================
   PLAYER SETTINGS & PRIVACY
   FIFA Mission India
   Frontend Only
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  /* ===========================================
      ELEMENTS
  =========================================== */

  const navItems =
    document.querySelectorAll("[data-settings-target]");

  const panels =
    document.querySelectorAll("[data-settings-panel]");

  const saveButton =
    document.getElementById("saveSettingsBtn");

  const saveStatus =
    document.getElementById("saveStatus");

  const avatarInput =
    document.getElementById("settingsAvatarInput");

  const avatarPreview =
    document.getElementById("settingsAvatarPreview");

  const removePhotoBtn =
    document.getElementById("removePhotoBtn");

  const modal =
    document.getElementById("settingsModal");

  const modalTitle =
    document.getElementById("settingsModalTitle");

  const modalText =
    document.getElementById("settingsModalText");

  const modalConfirmBtn =
    document.getElementById("modalConfirmBtn");

  const deactivateBtn =
    document.getElementById("deactivateAccountBtn");

  const deleteBtn =
    document.getElementById("deleteAccountBtn");

  let pendingAction = null;

  let defaultAvatar =
    avatarPreview ? avatarPreview.src : "";



  /* ===========================================
      SETTINGS NAVIGATION
  =========================================== */

  function openPanel(id) {

    navItems.forEach(item => {

      item.classList.remove("active");

      if (item.dataset.settingsTarget === id) {

        item.classList.add("active");

      }

    });

    panels.forEach(panel => {

      panel.hidden = true;
      panel.classList.remove("active");

      if (panel.id === id) {

        panel.hidden = false;
        panel.classList.add("active");

      }

    });

    window.scrollTo({

      top: 0,
      behavior: "smooth"

    });

  }

  navItems.forEach(item => {

    item.addEventListener("click", () => {

      openPanel(item.dataset.settingsTarget);

    });

  });



  /* ===========================================
      PROFILE PHOTO
  =========================================== */

  if (avatarInput) {

    avatarInput.addEventListener("change", e => {

      const file = e.target.files[0];

      if (!file) return;

      if (!file.type.startsWith("image/")) {

        alert("Please select an image.");

        return;

      }

      if (file.size > 5 * 1024 * 1024) {

        alert("Maximum size is 5 MB");

        return;

      }

      const reader = new FileReader();

      reader.onload = function () {

        avatarPreview.src = reader.result;

      };

      reader.readAsDataURL(file);

    });

  }

  if (removePhotoBtn) {

    removePhotoBtn.addEventListener("click", () => {

      avatarPreview.src = defaultAvatar;

      avatarInput.value = "";

    });

  }



  /* ===========================================
      PASSWORD TOGGLE
  =========================================== */

  const toggles =
    document.querySelectorAll(".password-toggle");

  toggles.forEach(toggle => {

    toggle.addEventListener("click", () => {

      const input =
        document.getElementById(toggle.dataset.passwordToggle);

      if (!input) return;

      if (input.type === "password") {

        input.type = "text";

        toggle.innerHTML =
          '<i class="fa-regular fa-eye-slash"></i>';

      } else {

        input.type = "password";

        toggle.innerHTML =
          '<i class="fa-regular fa-eye"></i>';

      }

    });

  });



  /* ===========================================
      CHANGE PASSWORD
  =========================================== */

  const passwordBtn =
    document.getElementById("changePasswordBtn");

  if (passwordBtn) {

    passwordBtn.addEventListener("click", () => {

      const current =
        document.getElementById("currentPassword").value;

      const password =
        document.getElementById("newPassword").value;

      const confirm =
        document.getElementById("confirmPassword").value;

      if (
        !current ||
        !password ||
        !confirm
      ) {

        alert("Fill all password fields.");

        return;

      }

      if (password.length < 8) {

        alert("Password should be at least 8 characters.");

        return;

      }

      if (password !== confirm) {

        alert("Passwords do not match.");

        return;

      }

      /*
      ============================================

      BACKEND (MR HARSH)

      updatePassword()

      ============================================

      */

      document.getElementById("currentPassword").value = "";
      document.getElementById("newPassword").value = "";
      document.getElementById("confirmPassword").value = "";

      saveStatus.textContent =
        "Password ready for backend integration.";

    });

  }

    /* ===========================================
      SAVE SETTINGS
  =========================================== */

  if (saveButton) {

    saveButton.addEventListener("click", () => {

      saveButton.disabled = true;

      saveButton.innerHTML = `
        <i class="fa-solid fa-spinner fa-spin"></i>
        Saving...
      `;

      const settings = collectSettings();

      /*
      ===============================================

      BACKEND (MR HARSH)

      await savePlayerSettings(settings);

      ===============================================
      */

      console.log(settings);

      setTimeout(() => {

        saveButton.disabled = false;

        saveButton.innerHTML = `
          <i class="fa-solid fa-floppy-disk"></i>
          Save Changes
        `;

        saveStatus.textContent =
          "All changes saved successfully.";

        setTimeout(() => {

          saveStatus.textContent = "";

        }, 3000);

      }, 1000);

    });

  }



  /* ===========================================
      COLLECT SETTINGS
  =========================================== */

  function collectSettings() {

    return {

      firstName:
        document.getElementById("firstName").value,

      lastName:
        document.getElementById("lastName").value,

      displayName:
        document.getElementById("displayName").value,

      email:
        document.getElementById("emailAddress").value,

      phone:
        document.getElementById("phoneNumber").value,

      dob:
        document.getElementById("dateOfBirth").value,

      location:
        document.getElementById("location").value,



      twoFactor:
        document.getElementById("twoFactorToggle").checked,



      profileVisibility:
        document.getElementById("profileVisibility").value,

      scoutDiscovery:
        document.getElementById("scoutDiscovery").checked,

      academyInvitations:
        document.getElementById("academyInvitations").checked,

      showContact:
        document.getElementById("showContactInfo").checked,

      showPerformance:
        document.getElementById("showPerformance").checked,

      onlineStatus:
        document.getElementById("onlineStatus").checked,



      language:
        document.getElementById("languagePreference").value,

      timezone:
        document.getElementById("timezonePreference").value,

      measurement:
        document.getElementById("measurementPreference").value,

      theme:
        document.getElementById("themePreference").value,

      reduceMotion:
        document.getElementById("reduceMotionToggle").checked,



      notifications:

        [...document.querySelectorAll(".notification-row")]

        .map(row => {

          const title =
            row.querySelector("h3").textContent;

          const boxes =
            row.querySelectorAll("input");

          return {

            name: title,

            email: boxes[0].checked,

            push: boxes[1].checked

          };

        })

    };

  }



  /* ===========================================
      NOTIFICATION CHECKBOXES
  =========================================== */

  const checks =
    document.querySelectorAll(".check-control input");

  checks.forEach(box => {

    box.addEventListener("change", () => {

      /*
      Backend can autosave here if needed.
      */

    });

  });



  /* ===========================================
      TWO FACTOR
  =========================================== */

  const twoFactor =
    document.getElementById("twoFactorToggle");

  if (twoFactor) {

    twoFactor.addEventListener("change", () => {

      if (twoFactor.checked) {

        saveStatus.textContent =
          "Two-factor authentication enabled.";

      } else {

        saveStatus.textContent =
          "Two-factor authentication disabled.";

      }

      setTimeout(() => {

        saveStatus.textContent = "";

      }, 2500);

    });

  }



  /* ===========================================
      REDUCE MOTION
  =========================================== */

  const reduceMotion =
    document.getElementById("reduceMotionToggle");

  if (reduceMotion) {

    reduceMotion.addEventListener("change", () => {

      document.body.classList.toggle(

        "reduce-motion",

        reduceMotion.checked

      );

    });

  }

   /* ===========================================
      DEVICE SESSION LOGOUT
  =========================================== */

  const sessionButtons =
    document.querySelectorAll(".session-logout-btn");

  sessionButtons.forEach(button => {

    button.addEventListener("click", () => {

      button.disabled = true;

      button.textContent = "Logged Out";

      saveStatus.textContent =
        "Device session ended.";

      /*
      ===========================================

      BACKEND (MR HARSH)

      logoutSession(sessionId);

      ===========================================
      */

      setTimeout(() => {

        saveStatus.textContent = "";

      }, 2500);

    });

  });



  /* ===========================================
      DEACTIVATE ACCOUNT
  =========================================== */

  if (deactivateBtn) {

    deactivateBtn.addEventListener("click", () => {

      pendingAction = "deactivate";

      openModal(

        "Deactivate Account",

        "Your profile will be hidden until you sign in again.",

        "Deactivate"

      );

    });

  }



  /* ===========================================
      DELETE ACCOUNT
  =========================================== */

  if (deleteBtn) {

    deleteBtn.addEventListener("click", () => {

      pendingAction = "delete";

      openModal(

        "Delete Account",

        "This action is permanent and cannot be undone.",

        "Delete"

      );

    });

  }



  /* ===========================================
      MODAL FUNCTIONS
  =========================================== */

  function openModal(title, text, buttonText) {

    modal.hidden = false;

    modalTitle.textContent = title;

    modalText.textContent = text;

    modalConfirmBtn.textContent = buttonText;

    document.body.style.overflow = "hidden";

  }



  function closeModal() {

    modal.hidden = true;

    document.body.style.overflow = "";

    pendingAction = null;

  }



  document.querySelectorAll("[data-modal-close]")

    .forEach(button => {

      button.addEventListener("click", closeModal);

    });



  modalConfirmBtn.addEventListener("click", () => {

    if (pendingAction === "deactivate") {

      /*
      ===========================================

      BACKEND

      deactivateAccount()

      ===========================================
      */

      saveStatus.textContent =
        "Account deactivation request ready.";

    }

    if (pendingAction === "delete") {

      /*
      ===========================================

      BACKEND

      deleteAccount()

      ===========================================
      */

      saveStatus.textContent =
        "Delete request requires backend confirmation.";

    }

    closeModal();

  });



  /* ===========================================
      ESC KEY CLOSES MODAL
  =========================================== */

  document.addEventListener("keydown", e => {

    if (

      e.key === "Escape" &&

      !modal.hidden

    ) {

      closeModal();

    }

  });



  /* ===========================================
      HELPER
  =========================================== */

  function showStatus(message) {

    saveStatus.textContent = message;

    setTimeout(() => {

      saveStatus.textContent = "";

    }, 3000);

  }



  /* ===========================================
      FRONTEND READY
  =========================================== */

  console.log(

    "Player Settings frontend loaded successfully."

  );

}); 