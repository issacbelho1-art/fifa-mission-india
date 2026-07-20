"use strict";

/* =========================================================
   FIFA MISSION INDIA - PLAYER PROFILE EDIT
   Frontend demonstration only
========================================================= */

const profileForm =
  document.getElementById("playerProfileForm");

const saveProfileButton =
  document.getElementById("saveProfileButton");

const profilePhoto =
  document.getElementById("profilePhoto");

const profilePreviewImage =
  document.getElementById("profilePreviewImage");

const profileInitials =
  document.getElementById("profileInitials");

const removePhotoButton =
  document.getElementById("removePhotoButton");

const playerBio =
  document.getElementById("playerBio");

const bioCharacterCount =
  document.getElementById("bioCharacterCount");

const completionBar =
  document.getElementById("completionBar");

const completionPercentage =
  document.getElementById("completionPercentage");

const successToast =
  document.getElementById("successToast");

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

let profileImageUrl = "";
let savedProfileImage = "";


/* ================= DEFAULT PROFILE ================= */

const defaultPlayerProfile = {
  firstName: "Player",
  lastName: "",
  dateOfBirth: "2005-08-15",
  gender: "",
  email: "player@example.com",
  phone: "9876544821",
  state: "Nagaland",
  city: "Dimapur",
  primaryPosition: "Central Midfielder",
  secondaryPosition: "Attacking Midfielder",
  preferredFoot: "Right Foot",
  experienceLevel: "Academy Level",
  height: "173",
  weight: "66",
  currentClub: "",
  highlightUrl: "",
  playerBio:
    "I am a committed football player working to improve my technical ability, fitness and tactical awareness."
};


/* ================= INITIALISE ================= */

function initialiseProfilePage() {
  const playerProfile = getSavedPlayerProfile();

  populateProfileForm(playerProfile);
  updateInitials();
  updateBioCount();
  calculateProfileCompletion();

  const today = new Date();

  document.getElementById("dateOfBirth").max =
    today.toISOString().split("T")[0];
}


function getSavedPlayerProfile() {
  const storedProfile =
    sessionStorage.getItem("playerDashboardData");

  if (!storedProfile) {
    return defaultPlayerProfile;
  }

  try {
    return {
      ...defaultPlayerProfile,
      ...JSON.parse(storedProfile)
    };
  } catch (error) {
    console.error(
      "Unable to load player profile:",
      error
    );

    return defaultPlayerProfile;
  }
}


function populateProfileForm(player) {
  Object.entries(player).forEach(([key, value]) => {
    const field = document.getElementById(key);

    if (
      field &&
      typeof value !== "object" &&
      key !== "profileImage"
    ) {
      field.value = value ?? "";
    }
  });

  if (player.profileImage) {
    savedProfileImage = player.profileImage;

    profilePreviewImage.src = savedProfileImage;
    profilePreviewImage.hidden = false;
    profileInitials.hidden = true;
  }
}


/* ================= VALIDATION ================= */

function validateForm() {
  const fields = Array.from(
    profileForm.querySelectorAll(
      "input:not([type='file']), select, textarea"
    )
  );

  let formIsValid = true;

  fields.forEach((field) => {
    if (!validateField(field)) {
      formIsValid = false;
    }
  });

  const primaryPosition =
    document.getElementById("primaryPosition");

  const secondaryPosition =
    document.getElementById("secondaryPosition");

  if (
    primaryPosition.value &&
    secondaryPosition.value &&
    primaryPosition.value === secondaryPosition.value
  ) {
    setFieldError(
      secondaryPosition,
      "Secondary position must differ from primary position."
    );

    formIsValid = false;
  }

  return formIsValid;
}


function validateField(field) {
  clearFieldError(field);

  const value = field.value.trim();

  if (field.required && !value) {
    setFieldError(field, "This field is required.");
    return false;
  }

  if (!field.required && !value) {
    return true;
  }

  if (
    field.type === "email" &&
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
  ) {
    setFieldError(field, "Enter a valid email address.");
    return false;
  }

  if (
    field.id === "phone" &&
    !/^[6-9]\d{9}$/.test(value)
  ) {
    setFieldError(
      field,
      "Enter a valid 10-digit Indian mobile number."
    );

    return false;
  }

  if (
    field.id === "height" &&
    (
      Number(value) < 100 ||
      Number(value) > 230
    )
  ) {
    setFieldError(
      field,
      "Height must be between 100 cm and 230 cm."
    );

    return false;
  }

  if (
    field.id === "weight" &&
    (
      Number(value) < 25 ||
      Number(value) > 200
    )
  ) {
    setFieldError(
      field,
      "Weight must be between 25 kg and 200 kg."
    );

    return false;
  }

  if (
    field.id === "playerBio" &&
    value.length < 40
  ) {
    setFieldError(
      field,
      "Write at least 40 characters about your football journey."
    );

    return false;
  }

  if (
    field.type === "url" &&
    value &&
    !isValidUrl(value)
  ) {
    setFieldError(
      field,
      "Enter a valid public URL."
    );

    return false;
  }

  if (
    field.id === "dateOfBirth" &&
    !isValidDateOfBirth(value)
  ) {
    setFieldError(
      field,
      "Enter a valid date of birth."
    );

    return false;
  }

  return true;
}


function isValidUrl(value) {
  try {
    const url = new URL(value);

    return (
      url.protocol === "http:" ||
      url.protocol === "https:"
    );
  } catch {
    return false;
  }
}


function isValidDateOfBirth(value) {
  const birthDate = new Date(`${value}T00:00:00`);

  if (Number.isNaN(birthDate.getTime())) {
    return false;
  }

  const today = new Date();

  if (birthDate > today) {
    return false;
  }

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
      today.getDate() < birthDate.getDate()
    )
  ) {
    age -= 1;
  }

  return age >= 5 && age <= 60;
}


function setFieldError(field, message) {
  const formGroup = field.closest(".form-group");

  if (!formGroup) {
    return;
  }

  formGroup.classList.add("invalid");

  const errorElement =
    formGroup.querySelector(".error-message");

  if (errorElement) {
    errorElement.textContent = message;
  }

  field.setAttribute("aria-invalid", "true");
}


function clearFieldError(field) {
  const formGroup = field.closest(".form-group");

  if (!formGroup) {
    return;
  }

  formGroup.classList.remove("invalid");

  const errorElement =
    formGroup.querySelector(".error-message");

  if (errorElement) {
    errorElement.textContent = "";
  }

  field.removeAttribute("aria-invalid");
}


function focusFirstInvalidField() {
  profileForm
    .querySelector('[aria-invalid="true"]')
    ?.focus();
}


/* ================= LIVE EVENTS ================= */

profileForm.addEventListener("input", (event) => {
  const field = event.target;

  if (field.matches("input, select, textarea")) {
    clearFieldError(field);
    calculateProfileCompletion();
  }

  if (
    field.id === "firstName" ||
    field.id === "lastName"
  ) {
    updateInitials();
  }
});


profileForm.addEventListener("change", (event) => {
  const field = event.target;

  if (field.matches("input, select, textarea")) {
    clearFieldError(field);
    calculateProfileCompletion();
  }
});


playerBio.addEventListener("input", updateBioCount);


function updateBioCount() {
  bioCharacterCount.textContent =
    String(playerBio.value.length);
}


/* ================= INITIALS ================= */

function updateInitials() {
  const firstName =
    document.getElementById("firstName").value.trim();

  const lastName =
    document.getElementById("lastName").value.trim();

  const initials =
    `${firstName.charAt(0)}${lastName.charAt(0)}`
      .toUpperCase() || "PL";

  profileInitials.textContent = initials;
}


/* ================= PHOTO ================= */

profilePhoto.addEventListener("change", () => {
  const errorElement =
    document.getElementById("profilePhotoError");

  errorElement.textContent = "";

  const file = profilePhoto.files[0];

  if (!file) {
    return;
  }

  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/webp"
  ];

  if (!allowedTypes.includes(file.type)) {
    errorElement.textContent =
      "Upload a JPG, PNG or WEBP image.";

    profilePhoto.value = "";
    return;
  }

  if (file.size > MAX_IMAGE_SIZE) {
    errorElement.textContent =
      "Profile photo must be smaller than 5 MB.";

    profilePhoto.value = "";
    return;
  }

  if (profileImageUrl) {
    URL.revokeObjectURL(profileImageUrl);
  }

  profileImageUrl = URL.createObjectURL(file);

  profilePreviewImage.src = profileImageUrl;
  profilePreviewImage.hidden = false;
  profileInitials.hidden = true;

  calculateProfileCompletion();
});


removePhotoButton.addEventListener("click", () => {
  if (profileImageUrl) {
    URL.revokeObjectURL(profileImageUrl);
  }

  profileImageUrl = "";
  savedProfileImage = "";

  profilePhoto.value = "";

  profilePreviewImage.hidden = true;
  profilePreviewImage.removeAttribute("src");

  profileInitials.hidden = false;

  calculateProfileCompletion();
});


/* ================= COMPLETION ================= */

function calculateProfileCompletion() {
  const importantFieldIds = [
    "firstName",
    "lastName",
    "dateOfBirth",
    "email",
    "phone",
    "state",
    "city",
    "primaryPosition",
    "preferredFoot",
    "experienceLevel",
    "height",
    "weight",
    "playerBio"
  ];

  let completedItems = 0;

  importantFieldIds.forEach((fieldId) => {
    const field = document.getElementById(fieldId);

    if (field?.value.trim()) {
      completedItems += 1;
    }
  });

  if (profileImageUrl || savedProfileImage) {
    completedItems += 1;
  }

  if (
    document
      .getElementById("highlightUrl")
      .value
      .trim()
  ) {
    completedItems += 1;
  }

  const totalItems =
    importantFieldIds.length + 2;

  const completion = Math.round(
    (completedItems / totalItems) * 100
  );

  completionBar.style.width =
    `${completion}%`;

  completionPercentage.textContent =
    `${completion}%`;

  return completion;
}


/* ================= SUBMISSION ================= */

profileForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  if (!validateForm()) {
    focusFirstInvalidField();
    return;
  }

  setSubmitting(true);

  try {
    const formData = new FormData(profileForm);

    /*
      BACKEND INTEGRATION PLACEHOLDER

      const response = await fetch(
        "/api/v1/players/me",
        {
          method: "PATCH",
          body: formData,
          credentials: "include"
        }
      );

      if (!response.ok) {
        throw new Error("Profile update failed.");
      }

      const updatedPlayer = await response.json();
    */

    await new Promise((resolve) => {
      window.setTimeout(resolve, 900);
    });

    const playerData =
      Object.fromEntries(formData.entries());

    delete playerData.profilePhoto;

    playerData.profileCompletion =
      calculateProfileCompletion();

    playerData.profileImage =
      savedProfileImage || "";

    sessionStorage.setItem(
      "playerDashboardData",
      JSON.stringify(playerData)
    );

    showSuccessToast();

  } catch (error) {
    console.error(
      "Player profile update error:",
      error
    );

    window.alert(
      "We could not update your profile. Please try again."
    );

  } finally {
    setSubmitting(false);
  }
});


function setSubmitting(isSubmitting) {
  saveProfileButton.disabled = isSubmitting;

  saveProfileButton.classList.toggle(
    "loading",
    isSubmitting
  );

  const label =
    saveProfileButton.querySelector(".button-label");

  label.textContent = isSubmitting
    ? "Saving..."
    : "Save Changes";
}


function showSuccessToast() {
  successToast.hidden = false;

  window.setTimeout(() => {
    successToast.hidden = true;

    window.location.href =
      "player-dashboard.html";
  }, 1600);
}


/* ================= CLEANUP ================= */

window.addEventListener("beforeunload", () => {
  if (profileImageUrl) {
    URL.revokeObjectURL(profileImageUrl);
  }
});


initialiseProfilePage();