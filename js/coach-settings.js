"use strict";

/* ======================================================
   COACH SETTINGS
   FRONTEND ONLY
   Backend Integration:
   - Mr. Harsh
====================================================== */


/* ======================================================
   DOM REFERENCES
====================================================== */

const sidebar =
document.getElementById(
    "coachSidebar"
);

const sidebarOverlay =
document.getElementById(
    "coachSidebarOverlay"
);

const menuToggle =
document.getElementById(
    "coachMenuToggle"
);

const closeSidebarButton =
document.getElementById(
    "coachSidebarClose"
);

const settingsNavigationButtons =
document.querySelectorAll(
    ".coach-settings-nav-button"
);

const settingsSections =
document.querySelectorAll(
    ".coach-settings-section"
);

const saveBar =
document.querySelector(
    ".coach-settings-savebar"
);

const profileDropdown =
document.getElementById(
    "coachProfileDropdown"
);

const profileButton =
document.getElementById(
    "coachProfileButton"
);

const notificationPanel =
document.getElementById(
    "coachNotificationPanel"
);

const notificationButton =
document.getElementById(
    "coachNotificationButton"
);

const markAllNotificationsButton =
document.getElementById(
    "markAllNotificationsButton"
);

const form =
document.getElementById(
    "coachSettingsForm"
);

const allInputs =
form
? form.querySelectorAll(
      "input, select, textarea"
  )
: [];



/* ======================================================
   UI STATE
====================================================== */

let hasUnsavedChanges = false;

let activeSection = "profile";



/* ======================================================
   SHOW / HIDE SAVE BAR
====================================================== */

function showSaveBar() {

    if (!saveBar) return;

    saveBar.hidden = false;

}

function hideSaveBar() {

    if (!saveBar) return;

    saveBar.hidden = true;

}



/* ======================================================
   SIDEBAR
====================================================== */

function openSidebar() {

    if (sidebar) {

        sidebar.classList.add(
            "active"
        );

    }

    if (sidebarOverlay) {

        sidebarOverlay.classList.add(
            "active"
        );

    }

    document.body.style.overflow =
        "hidden";

}

function closeSidebar() {

    if (sidebar) {

        sidebar.classList.remove(
            "active"
        );

    }

    if (sidebarOverlay) {

        sidebarOverlay.classList.remove(
            "active"
        );

    }

    document.body.style.overflow =
        "";

}

menuToggle?.addEventListener(
    "click",
    openSidebar
);

closeSidebarButton?.addEventListener(
    "click",
    closeSidebar
);

sidebarOverlay?.addEventListener(
    "click",
    closeSidebar
);



/* ======================================================
   SECTION SWITCHING
====================================================== */

function switchSection(sectionId) {

    activeSection = sectionId;

    settingsNavigationButtons.forEach(
        button => {

            button.classList.remove(
                "active"
            );

            if (
                button.dataset.section ===
                sectionId
            ) {

                button.classList.add(
                    "active"
                );

            }

        }
    );

    settingsSections.forEach(
        section => {

            if (
                section.id === sectionId
            ) {

                section.hidden = false;

            } else {

                section.hidden = true;

            }

        }
    );

    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });

}

settingsNavigationButtons.forEach(
    button => {

        button.addEventListener(
            "click",
            () => {

                switchSection(
                    button.dataset.section
                );

                if (
                    window.innerWidth <
                    992
                ) {

                    closeSidebar();

                }

            }
        );

    }
);



/* ======================================================
   INITIAL SECTION
====================================================== */

switchSection(
    activeSection
);

/* ======================================================
   PROFILE DROPDOWN
====================================================== */

function closeProfileDropdown() {

    if (!profileDropdown) return;

    profileDropdown.hidden = true;

    profileButton?.setAttribute(
        "aria-expanded",
        "false"
    );

}

function toggleProfileDropdown() {

    if (!profileDropdown) return;

    const isHidden =
        profileDropdown.hidden;

    closeNotificationPanel();

    profileDropdown.hidden =
        !isHidden;

    profileButton?.setAttribute(
        "aria-expanded",
        String(isHidden)
    );

}

profileButton?.addEventListener(
    "click",
    event => {

        event.stopPropagation();

        toggleProfileDropdown();

    }
);



/* ======================================================
   NOTIFICATION PANEL
====================================================== */

function closeNotificationPanel() {

    if (!notificationPanel) return;

    notificationPanel.hidden = true;

    notificationButton?.setAttribute(
        "aria-expanded",
        "false"
    );

}

function toggleNotificationPanel() {

    if (!notificationPanel) return;

    const isHidden =
        notificationPanel.hidden;

    closeProfileDropdown();

    notificationPanel.hidden =
        !isHidden;

    notificationButton?.setAttribute(
        "aria-expanded",
        String(isHidden)
    );

}

notificationButton?.addEventListener(
    "click",
    event => {

        event.stopPropagation();

        toggleNotificationPanel();

    }
);



/* ======================================================
   CLOSE DROPDOWNS OUTSIDE
====================================================== */

document.addEventListener(
    "click",
    event => {

        const clickedInsideProfile =
            profileDropdown?.contains(
                event.target
            ) ||
            profileButton?.contains(
                event.target
            );

        const clickedInsideNotifications =
            notificationPanel?.contains(
                event.target
            ) ||
            notificationButton?.contains(
                event.target
            );

        if (!clickedInsideProfile) {

            closeProfileDropdown();

        }

        if (
            !clickedInsideNotifications
        ) {

            closeNotificationPanel();

        }

    }
);



/* ======================================================
   ESCAPE KEY
====================================================== */

document.addEventListener(
    "keydown",
    event => {

        if (
            event.key !== "Escape"
        ) {

            return;

        }

        closeProfileDropdown();

        closeNotificationPanel();

        closeSidebar();

    }
);



/* ======================================================
   MARK NOTIFICATIONS READ
====================================================== */

function updateNotificationBadge() {

    const unreadNotifications =
        document.querySelectorAll(
            ".coach-notification-item.unread"
        );

    const notificationDot =
        document.querySelector(
            ".coach-notification-dot"
        );

    if (!notificationDot) return;

    notificationDot.hidden =
        unreadNotifications.length === 0;

}

function markAllNotificationsRead() {

    const unreadNotifications =
        document.querySelectorAll(
            ".coach-notification-item.unread"
        );

    unreadNotifications.forEach(
        notification => {

            notification.classList.remove(
                "unread"
            );

        }
    );

    updateNotificationBadge();

    showToast(
        "Notifications updated",
        "All notifications have been marked as read.",
        "success"
    );

}

markAllNotificationsButton?.addEventListener(
    "click",
    markAllNotificationsRead
);



/* ======================================================
   INDIVIDUAL NOTIFICATIONS
====================================================== */

const notificationItems =
document.querySelectorAll(
    ".coach-notification-item"
);

notificationItems.forEach(
    notification => {

        notification.addEventListener(
            "click",
            () => {

                notification.classList.remove(
                    "unread"
                );

                updateNotificationBadge();

            }
        );

    }
);



/* ======================================================
   RESPONSIVE SIDEBAR RESET
====================================================== */

window.addEventListener(
    "resize",
    () => {

        if (
            window.innerWidth >=
            992
        ) {

            closeSidebar();

        }

    }
);



/* ======================================================
   INITIAL DROPDOWN STATE
====================================================== */

closeProfileDropdown();

closeNotificationPanel();

updateNotificationBadge();

/* ======================================================
   UNSAVED CHANGES DETECTION
====================================================== */

function markSettingsChanged() {

    hasUnsavedChanges = true;

    showSaveBar();

}

function clearUnsavedChanges() {

    hasUnsavedChanges = false;

    hideSaveBar();

}

allInputs.forEach(
    input => {

        const eventName =
            input.type === "checkbox" ||
            input.type === "radio" ||
            input.tagName === "SELECT"
                ? "change"
                : "input";

        input.addEventListener(
            eventName,
            markSettingsChanged
        );

    }
);



/* ======================================================
   FORM VALIDATION HELPERS
====================================================== */

function clearFieldError(field) {

    if (!field) return;

    field.classList.remove(
        "coach-field-error"
    );

    const group =
        field.closest(
            ".coach-form-group"
        );

    const errorMessage =
        group?.querySelector(
            ".coach-form-error"
        );

    if (errorMessage) {

        errorMessage.remove();

    }

}

function showFieldError(
    field,
    message
) {

    if (!field) return;

    clearFieldError(field);

    field.classList.add(
        "coach-field-error"
    );

    const group =
        field.closest(
            ".coach-form-group"
        );

    if (!group) return;

    const errorElement =
        document.createElement(
            "small"
        );

    errorElement.className =
        "coach-form-error";

    errorElement.textContent =
        message;

    group.appendChild(
        errorElement
    );

}

function isValidEmail(email) {

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        .test(email);

}

function isValidPhone(phone) {

    const cleanedPhone =
        phone.replace(
            /[\s()+-]/g,
            ""
        );

    return /^[0-9]{8,15}$/
        .test(cleanedPhone);

}



/* ======================================================
   PROFILE FIELD REFERENCES
====================================================== */

const coachFullName =
document.getElementById(
    "coachFullName"
);

const coachEmail =
document.getElementById(
    "coachEmail"
);

const coachPhone =
document.getElementById(
    "coachPhone"
);

const coachDateOfBirth =
document.getElementById(
    "coachDateOfBirth"
);

const coachBiography =
document.getElementById(
    "coachBiography"
);

const biographyCounter =
document.getElementById(
    "coachBiographyCounter"
);



/* ======================================================
   BIOGRAPHY COUNTER
====================================================== */

function updateBiographyCounter() {

    if (
        !coachBiography ||
        !biographyCounter
    ) {

        return;

    }

    const maximumLength =
        Number(
            coachBiography.maxLength
        ) || 500;

    const currentLength =
        coachBiography.value.length;

    biographyCounter.textContent =
        `${currentLength}/${maximumLength}`;

}

coachBiography?.addEventListener(
    "input",
    updateBiographyCounter
);

updateBiographyCounter();



/* ======================================================
   LIVE FIELD VALIDATION
====================================================== */

coachFullName?.addEventListener(
    "blur",
    () => {

        const value =
            coachFullName.value.trim();

        if (value.length < 2) {

            showFieldError(
                coachFullName,
                "Enter your full name."
            );

            return;

        }

        clearFieldError(
            coachFullName
        );

    }
);

coachEmail?.addEventListener(
    "blur",
    () => {

        const value =
            coachEmail.value.trim();

        if (!isValidEmail(value)) {

            showFieldError(
                coachEmail,
                "Enter a valid email address."
            );

            return;

        }

        clearFieldError(
            coachEmail
        );

    }
);

coachPhone?.addEventListener(
    "blur",
    () => {

        const value =
            coachPhone.value.trim();

        if (
            value &&
            !isValidPhone(value)
        ) {

            showFieldError(
                coachPhone,
                "Enter a valid phone number."
            );

            return;

        }

        clearFieldError(
            coachPhone
        );

    }
);



/* ======================================================
   FORM VALIDATION
====================================================== */

function validateSettingsForm() {

    let isValid = true;

    const firstInvalidField = {
        element: null
    };

    if (coachFullName) {

        const nameValue =
            coachFullName.value.trim();

        if (nameValue.length < 2) {

            showFieldError(
                coachFullName,
                "Enter your full name."
            );

            isValid = false;

            firstInvalidField.element ??=
                coachFullName;

        } else {

            clearFieldError(
                coachFullName
            );

        }

    }

    if (coachEmail) {

        const emailValue =
            coachEmail.value.trim();

        if (
            !isValidEmail(
                emailValue
            )
        ) {

            showFieldError(
                coachEmail,
                "Enter a valid email address."
            );

            isValid = false;

            firstInvalidField.element ??=
                coachEmail;

        } else {

            clearFieldError(
                coachEmail
            );

        }

    }

    if (coachPhone) {

        const phoneValue =
            coachPhone.value.trim();

        if (
            phoneValue &&
            !isValidPhone(
                phoneValue
            )
        ) {

            showFieldError(
                coachPhone,
                "Enter a valid phone number."
            );

            isValid = false;

            firstInvalidField.element ??=
                coachPhone;

        } else {

            clearFieldError(
                coachPhone
            );

        }

    }

    if (coachDateOfBirth) {

        const selectedDate =
            new Date(
                coachDateOfBirth.value
            );

        const today =
            new Date();

        if (
            coachDateOfBirth.value &&
            selectedDate > today
        ) {

            showFieldError(
                coachDateOfBirth,
                "Date of birth cannot be in the future."
            );

            isValid = false;

            firstInvalidField.element ??=
                coachDateOfBirth;

        } else {

            clearFieldError(
                coachDateOfBirth
            );

        }

    }

    if (
        firstInvalidField.element
    ) {

        firstInvalidField.element
            .focus();

        firstInvalidField.element
            .scrollIntoView({

                behavior: "smooth",

                block: "center"

            });

    }

    return isValid;

}



/* ======================================================
   PREVENT ACCIDENTAL PAGE EXIT
====================================================== */

window.addEventListener(
    "beforeunload",
    event => {

        if (
            !hasUnsavedChanges
        ) {

            return;

        }

        event.preventDefault();

        event.returnValue = "";

    }
);

/* ======================================================
   PASSWORD FIELD REFERENCES
====================================================== */

const currentPassword =
document.getElementById(
    "currentPassword"
);

const newPassword =
document.getElementById(
    "newPassword"
);

const confirmPassword =
document.getElementById(
    "confirmPassword"
);

const passwordToggleButtons =
document.querySelectorAll(
    ".coach-password-toggle"
);

const passwordStrengthBars =
document.querySelectorAll(
    ".coach-password-strength-bars span"
);

const passwordStrengthText =
document.querySelector(
    ".coach-password-strength small"
);



/* ======================================================
   PASSWORD VISIBILITY
====================================================== */

passwordToggleButtons.forEach(
    button => {

        button.addEventListener(
            "click",
            () => {

                const targetId =
                    button.dataset.target;

                const passwordField =
                    document.getElementById(
                        targetId
                    );

                if (!passwordField) return;

                const isPasswordVisible =
                    passwordField.type ===
                    "text";

                passwordField.type =
                    isPasswordVisible
                        ? "password"
                        : "text";

                button.setAttribute(
                    "aria-label",
                    isPasswordVisible
                        ? "Show password"
                        : "Hide password"
                );

                button.setAttribute(
                    "aria-pressed",
                    String(
                        !isPasswordVisible
                    )
                );

                const icon =
                    button.querySelector(
                        "i"
                    );

                if (icon) {

                    icon.classList.toggle(
                        "fa-eye",
                        isPasswordVisible
                    );

                    icon.classList.toggle(
                        "fa-eye-slash",
                        !isPasswordVisible
                    );

                }

            }
        );

    }
);



/* ======================================================
   PASSWORD STRENGTH
====================================================== */

function calculatePasswordStrength(
    password
) {

    let score = 0;

    if (password.length >= 8) {

        score += 1;

    }

    if (password.length >= 12) {

        score += 1;

    }

    if (
        /[A-Z]/.test(password) &&
        /[a-z]/.test(password)
    ) {

        score += 1;

    }

    if (
        /\d/.test(password) &&
        /[^A-Za-z0-9]/.test(password)
    ) {

        score += 1;

    }

    return score;

}

function updatePasswordStrength() {

    if (!newPassword) return;

    const password =
        newPassword.value;

    const strength =
        calculatePasswordStrength(
            password
        );

    const strengthLabels = [

        "Enter a new password.",

        "Weak password",

        "Fair password",

        "Good password",

        "Strong password"

    ];

    const strengthColors = [

        "#e5e7eb",

        "#dc2626",

        "#f59e0b",

        "#2563eb",

        "#16a34a"

    ];

    passwordStrengthBars.forEach(
        (bar, index) => {

            if (
                index < strength
            ) {

                bar.style.background =
                    strengthColors[
                        strength
                    ];

            } else {

                bar.style.background =
                    "#e5e7eb";

            }

        }
    );

    if (passwordStrengthText) {

        passwordStrengthText.textContent =
            strengthLabels[
                strength
            ];

        passwordStrengthText.style.color =
            strengthColors[
                strength
            ];

    }

}



/* ======================================================
   PASSWORD REQUIREMENTS
====================================================== */

function isStrongPassword(
    password
) {

    return (
        password.length >= 8 &&
        /[A-Z]/.test(password) &&
        /[a-z]/.test(password) &&
        /\d/.test(password) &&
        /[^A-Za-z0-9]/.test(password)
    );

}

function validatePasswordFields() {

    let isValid = true;

    if (
        currentPassword &&
        (
            newPassword?.value ||
            confirmPassword?.value
        ) &&
        !currentPassword.value
            .trim()
    ) {

        showFieldError(
            currentPassword,
            "Enter your current password."
        );

        isValid = false;

    } else {

        clearFieldError(
            currentPassword
        );

    }

    if (
        newPassword &&
        newPassword.value &&
        !isStrongPassword(
            newPassword.value
        )
    ) {

        showFieldError(
            newPassword,
            "Use at least 8 characters with uppercase, lowercase, number and symbol."
        );

        isValid = false;

    } else {

        clearFieldError(
            newPassword
        );

    }

    if (
        confirmPassword &&
        confirmPassword.value !==
        newPassword?.value
    ) {

        showFieldError(
            confirmPassword,
            "Passwords do not match."
        );

        isValid = false;

    } else {

        clearFieldError(
            confirmPassword
        );

    }

    return isValid;

}

newPassword?.addEventListener(
    "input",
    updatePasswordStrength
);

newPassword?.addEventListener(
    "blur",
    validatePasswordFields
);

confirmPassword?.addEventListener(
    "blur",
    validatePasswordFields
);

currentPassword?.addEventListener(
    "blur",
    validatePasswordFields
);

updatePasswordStrength();



/* ======================================================
   PROFILE PHOTO REFERENCES
====================================================== */

const profilePhotoInput =
document.getElementById(
    "coachProfilePhotoInput"
);

const profilePhotoPreview =
document.getElementById(
    "coachProfilePhotoPreview"
);

const removeProfilePhotoButton =
document.getElementById(
    "removeProfilePhotoButton"
);

let originalProfilePhoto =
profilePhotoPreview?.src || "";



/* ======================================================
   PROFILE PHOTO PREVIEW
====================================================== */

profilePhotoInput?.addEventListener(
    "change",
    event => {

        const selectedFile =
            event.target.files?.[0];

        if (!selectedFile) return;

        const acceptedTypes = [

            "image/jpeg",

            "image/png",

            "image/webp"

        ];

        if (
            !acceptedTypes.includes(
                selectedFile.type
            )
        ) {

            showToast(
                "Invalid image",
                "Choose a JPG, PNG or WebP image.",
                "error"
            );

            profilePhotoInput.value =
                "";

            return;

        }

        const maximumSize =
            5 * 1024 * 1024;

        if (
            selectedFile.size >
            maximumSize
        ) {

            showToast(
                "Image too large",
                "Profile images must be below 5 MB.",
                "error"
            );

            profilePhotoInput.value =
                "";

            return;

        }

        const reader =
            new FileReader();

        reader.addEventListener(
            "load",
            () => {

                if (
                    profilePhotoPreview &&
                    typeof reader.result ===
                    "string"
                ) {

                    profilePhotoPreview.src =
                        reader.result;

                    markSettingsChanged();

                }

            }
        );

        reader.readAsDataURL(
            selectedFile
        );

    }
);



/* ======================================================
   REMOVE PROFILE PHOTO
====================================================== */

removeProfilePhotoButton?.addEventListener(
    "click",
    () => {

        if (!profilePhotoPreview) return;

        profilePhotoPreview.src =
            "images/default-coach-avatar.png";

        if (profilePhotoInput) {

            profilePhotoInput.value =
                "";

        }

        markSettingsChanged();

        showToast(
            "Photo removed",
            "Your default profile image will be used after saving.",
            "success"
        );

    }
);

/* ======================================================
   THEME REFERENCES
====================================================== */

const themeOptions =
document.querySelectorAll(
    'input[name="coachTheme"]'
);

const systemThemeQuery =
window.matchMedia(
    "(prefers-color-scheme: dark)"
);



/* ======================================================
   APPLY THEME
====================================================== */

function applyTheme(theme) {

    let resolvedTheme =
        theme;

    if (theme === "system") {

        resolvedTheme =
            systemThemeQuery.matches
                ? "dark"
                : "light";

    }

    document.documentElement
        .setAttribute(
            "data-theme",
            resolvedTheme
        );

    document.documentElement
        .setAttribute(
            "data-theme-preference",
            theme
        );

}



/* ======================================================
   LOAD SAVED THEME
====================================================== */

function loadSavedTheme() {

    const savedTheme =
        localStorage.getItem(
            "coachTheme"
        ) || "light";

    themeOptions.forEach(
        option => {

            option.checked =
                option.value ===
                savedTheme;

        }
    );

    applyTheme(
        savedTheme
    );

}



/* ======================================================
   THEME CHANGE
====================================================== */

themeOptions.forEach(
    option => {

        option.addEventListener(
            "change",
            () => {

                if (!option.checked) {

                    return;

                }

                applyTheme(
                    option.value
                );

                markSettingsChanged();

            }
        );

    }
);



/* ======================================================
   SYSTEM THEME CHANGE
====================================================== */

systemThemeQuery.addEventListener?.(
    "change",
    () => {

        const selectedTheme =
            document.querySelector(
                'input[name="coachTheme"]:checked'
            );

        if (
            selectedTheme?.value ===
            "system"
        ) {

            applyTheme(
                "system"
            );

        }

    }
);



/* ======================================================
   LANGUAGE AND TIMEZONE
====================================================== */

const languageSelect =
document.getElementById(
    "coachLanguage"
);

const timezoneSelect =
document.getElementById(
    "coachTimezone"
);

function loadRegionalPreferences() {

    const savedLanguage =
        localStorage.getItem(
            "coachLanguage"
        );

    const savedTimezone =
        localStorage.getItem(
            "coachTimezone"
        );

    if (
        languageSelect &&
        savedLanguage
    ) {

        languageSelect.value =
            savedLanguage;

    }

    if (
        timezoneSelect &&
        savedTimezone
    ) {

        timezoneSelect.value =
            savedTimezone;

    }

}



/* ======================================================
   NOTIFICATION PREFERENCES
====================================================== */

const notificationPreferenceInputs =
document.querySelectorAll(
    '[data-notification-setting]'
);

function loadNotificationPreferences() {

    notificationPreferenceInputs.forEach(
        input => {

            const storageKey =
                input.dataset
                    .notificationSetting;

            if (!storageKey) return;

            const savedValue =
                localStorage.getItem(
                    storageKey
                );

            if (savedValue === null) {

                return;

            }

            input.checked =
                savedValue === "true";

        }
    );

}



/* ======================================================
   PRIVACY PREFERENCES
====================================================== */

const privacyPreferenceInputs =
document.querySelectorAll(
    '[data-privacy-setting]'
);

function loadPrivacyPreferences() {

    privacyPreferenceInputs.forEach(
        input => {

            const storageKey =
                input.dataset
                    .privacySetting;

            if (!storageKey) return;

            const savedValue =
                localStorage.getItem(
                    storageKey
                );

            if (savedValue === null) {

                return;

            }

            input.checked =
                savedValue === "true";

        }
    );

}



/* ======================================================
   ACCESSIBILITY PREFERENCES
====================================================== */

const reducedMotionToggle =
document.getElementById(
    "coachReducedMotion"
);

const highContrastToggle =
document.getElementById(
    "coachHighContrast"
);

const compactModeToggle =
document.getElementById(
    "coachCompactMode"
);

function applyAccessibilityPreferences() {

    document.documentElement
        .classList.toggle(
            "coach-reduced-motion",
            Boolean(
                reducedMotionToggle
                    ?.checked
            )
        );

    document.documentElement
        .classList.toggle(
            "coach-high-contrast",
            Boolean(
                highContrastToggle
                    ?.checked
            )
        );

    document.documentElement
        .classList.toggle(
            "coach-compact-mode",
            Boolean(
                compactModeToggle
                    ?.checked
            )
        );

}

[
    reducedMotionToggle,
    highContrastToggle,
    compactModeToggle
]
.filter(Boolean)
.forEach(
    toggle => {

        toggle.addEventListener(
            "change",
            () => {

                applyAccessibilityPreferences();

                markSettingsChanged();

            }
        );

    }
);



/* ======================================================
   LOAD ACCESSIBILITY PREFERENCES
====================================================== */

function loadAccessibilityPreferences() {

    if (reducedMotionToggle) {

        reducedMotionToggle.checked =
            localStorage.getItem(
                "coachReducedMotion"
            ) === "true";

    }

    if (highContrastToggle) {

        highContrastToggle.checked =
            localStorage.getItem(
                "coachHighContrast"
            ) === "true";

    }

    if (compactModeToggle) {

        compactModeToggle.checked =
            localStorage.getItem(
                "coachCompactMode"
            ) === "true";

    }

    applyAccessibilityPreferences();

}



/* ======================================================
   SETTINGS SNAPSHOT
====================================================== */

let initialSettingsSnapshot = "";

function createSettingsSnapshot() {

    if (!form) return "";

    const formData =
        new FormData(
            form
        );

    const snapshot = {};

    formData.forEach(
        (value, key) => {

            if (
                value instanceof File
            ) {

                snapshot[key] =
                    value.name;

                return;

            }

            if (
                Object.prototype
                    .hasOwnProperty
                    .call(
                        snapshot,
                        key
                    )
            ) {

                if (
                    !Array.isArray(
                        snapshot[key]
                    )
                ) {

                    snapshot[key] = [
                        snapshot[key]
                    ];

                }

                snapshot[key].push(
                    value
                );

                return;

            }

            snapshot[key] =
                value;

        }
    );

    form.querySelectorAll(
        'input[type="checkbox"]'
    ).forEach(
        checkbox => {

            snapshot[
                checkbox.name ||
                checkbox.id
            ] = checkbox.checked;

        }
    );

    return JSON.stringify(
        snapshot
    );

}

function refreshInitialSnapshot() {

    initialSettingsSnapshot =
        createSettingsSnapshot();

}



/* ======================================================
   INITIALIZE PREFERENCES
====================================================== */

loadSavedTheme();

loadRegionalPreferences();

loadNotificationPreferences();

loadPrivacyPreferences();

loadAccessibilityPreferences();

refreshInitialSnapshot();

clearUnsavedChanges();

/* ======================================================
   SAVE / RESET / CANCEL REFERENCES
====================================================== */

const saveSettingsButton =
document.getElementById(
    "saveSettingsButton"
);

const resetSettingsButton =
document.getElementById(
    "resetSettingsButton"
);

const cancelSettingsButton =
document.getElementById(
    "cancelSettingsButton"
);

const confirmResetButton =
document.getElementById(
    "confirmResetButton"
);

const closeResetModalButton =
document.getElementById(
    "closeResetModalButton"
);

const resetSettingsModal =
document.getElementById(
    "resetSettingsModal"
);



/* ======================================================
   SAVE PREFERENCES LOCALLY
====================================================== */

function saveThemePreference() {

    const selectedTheme =
        document.querySelector(
            'input[name="coachTheme"]:checked'
        );

    if (!selectedTheme) return;

    localStorage.setItem(
        "coachTheme",
        selectedTheme.value
    );

}

function saveRegionalPreferences() {

    if (languageSelect) {

        localStorage.setItem(
            "coachLanguage",
            languageSelect.value
        );

    }

    if (timezoneSelect) {

        localStorage.setItem(
            "coachTimezone",
            timezoneSelect.value
        );

    }

}

function saveNotificationPreferences() {

    notificationPreferenceInputs
        .forEach(
            input => {

                const storageKey =
                    input.dataset
                        .notificationSetting;

                if (!storageKey) return;

                localStorage.setItem(
                    storageKey,
                    String(
                        input.checked
                    )
                );

            }
        );

}

function savePrivacyPreferences() {

    privacyPreferenceInputs
        .forEach(
            input => {

                const storageKey =
                    input.dataset
                        .privacySetting;

                if (!storageKey) return;

                localStorage.setItem(
                    storageKey,
                    String(
                        input.checked
                    )
                );

            }
        );

}

function saveAccessibilityPreferences() {

    localStorage.setItem(
        "coachReducedMotion",
        String(
            Boolean(
                reducedMotionToggle
                    ?.checked
            )
        )
    );

    localStorage.setItem(
        "coachHighContrast",
        String(
            Boolean(
                highContrastToggle
                    ?.checked
            )
        )
    );

    localStorage.setItem(
        "coachCompactMode",
        String(
            Boolean(
                compactModeToggle
                    ?.checked
            )
        )
    );

}



/* ======================================================
   BUILD SETTINGS PAYLOAD
====================================================== */

function buildSettingsPayload() {

    const formData =
        form
            ? new FormData(form)
            : new FormData();

    const payload = {};

    formData.forEach(
        (value, key) => {

            if (
                value instanceof File
            ) {

                if (value.name) {

                    payload[key] = {

                        name: value.name,

                        size: value.size,

                        type: value.type

                    };

                }

                return;

            }

            if (
                Object.prototype
                    .hasOwnProperty
                    .call(
                        payload,
                        key
                    )
            ) {

                if (
                    !Array.isArray(
                        payload[key]
                    )
                ) {

                    payload[key] = [
                        payload[key]
                    ];

                }

                payload[key].push(
                    value
                );

                return;

            }

            payload[key] =
                value;

        }
    );

    form?.querySelectorAll(
        'input[type="checkbox"]'
    ).forEach(
        checkbox => {

            payload[
                checkbox.name ||
                checkbox.id
            ] = checkbox.checked;

        }
    );

    return payload;

}



/* ======================================================
   SAVE SETTINGS
====================================================== */

async function saveSettings() {

    const formIsValid =
        validateSettingsForm();

    const passwordsAreValid =
        validatePasswordFields();

    if (
        !formIsValid ||
        !passwordsAreValid
    ) {

        showToast(
            "Check your information",
            "Please correct the highlighted fields before saving.",
            "error"
        );

        return;

    }

    if (saveSettingsButton) {

        saveSettingsButton.disabled =
            true;

        saveSettingsButton.innerHTML =
            `
                <i class="fa-solid fa-spinner fa-spin"></i>
                Saving...
            `;

    }

    const settingsPayload =
        buildSettingsPayload();

    try {

        /*
        ==================================================
        BACKEND INTEGRATION PLACEHOLDER

        Replace this simulated request with:

        const response = await fetch(
            "/api/v1/coaches/settings",
            {
                method: "PUT",
                headers: {
                    "Content-Type":
                        "application/json",
                    Authorization:
                        `Bearer ${token}`
                },
                body: JSON.stringify(
                    settingsPayload
                )
            }
        );

        if (!response.ok) {
            throw new Error(
                "Unable to save settings."
            );
        }
        ==================================================
        */

        await new Promise(
            resolve => {

                window.setTimeout(
                    resolve,
                    700
                );

            }
        );

        console.log(
            "Coach settings payload:",
            settingsPayload
        );

        saveThemePreference();

        saveRegionalPreferences();

        saveNotificationPreferences();

        savePrivacyPreferences();

        saveAccessibilityPreferences();

        refreshInitialSnapshot();

        clearUnsavedChanges();

        if (currentPassword) {

            currentPassword.value =
                "";

        }

        if (newPassword) {

            newPassword.value =
                "";

        }

        if (confirmPassword) {

            confirmPassword.value =
                "";

        }

        updatePasswordStrength();

        showToast(
            "Settings saved",
            "Your coach account settings have been updated successfully.",
            "success"
        );

    } catch (error) {

        console.error(
            "Unable to save coach settings:",
            error
        );

        showToast(
            "Save failed",
            "Your settings could not be saved. Please try again.",
            "error"
        );

    } finally {

        if (saveSettingsButton) {

            saveSettingsButton.disabled =
                false;

            saveSettingsButton.innerHTML =
                `
                    <i class="fa-solid fa-floppy-disk"></i>
                    Save Changes
                `;

        }

    }

}



/* ======================================================
   RESTORE SETTINGS SNAPSHOT
====================================================== */

function restoreSettingsSnapshot() {

    if (
        !form ||
        !initialSettingsSnapshot
    ) {

        return;

    }

    let snapshot;

    try {

        snapshot =
            JSON.parse(
                initialSettingsSnapshot
            );

    } catch (error) {

        console.error(
            "Unable to restore settings:",
            error
        );

        return;

    }

    form.querySelectorAll(
        "input, select, textarea"
    ).forEach(
        field => {

            const fieldKey =
                field.name ||
                field.id;

            if (!fieldKey) return;

            if (
                field.type ===
                "file"
            ) {

                field.value = "";

                return;

            }

            if (
                field.type ===
                "checkbox"
            ) {

                field.checked =
                    Boolean(
                        snapshot[
                            fieldKey
                        ]
                    );

                return;

            }

            if (
                field.type ===
                "radio"
            ) {

                field.checked =
                    snapshot[
                        fieldKey
                    ] === field.value;

                return;

            }

            if (
                Object.prototype
                    .hasOwnProperty
                    .call(
                        snapshot,
                        fieldKey
                    )
            ) {

                const savedValue =
                    snapshot[
                        fieldKey
                    ];

                field.value =
                    Array.isArray(
                        savedValue
                    )
                        ? savedValue[0]
                        : savedValue;

            }

        }
    );

    if (
        profilePhotoPreview &&
        originalProfilePhoto
    ) {

        profilePhotoPreview.src =
            originalProfilePhoto;

    }

    const selectedTheme =
        document.querySelector(
            'input[name="coachTheme"]:checked'
        );

    if (selectedTheme) {

        applyTheme(
            selectedTheme.value
        );

    }

    applyAccessibilityPreferences();

    updateBiographyCounter();

    updatePasswordStrength();

    form.querySelectorAll(
        ".coach-field-error"
    ).forEach(
        field => {

            clearFieldError(
                field
            );

        }
    );

}



/* ======================================================
   CANCEL CHANGES
====================================================== */

function cancelSettingsChanges() {

    restoreSettingsSnapshot();

    clearUnsavedChanges();

    showToast(
        "Changes cancelled",
        "Your unsaved settings have been restored.",
        "success"
    );

}



/* ======================================================
   RESET MODAL
====================================================== */

function openResetModal() {

    if (!resetSettingsModal) {

        resetAllSettings();

        return;

    }

    if (
        typeof resetSettingsModal
            .showModal ===
        "function"
    ) {

        resetSettingsModal.showModal();

    } else {

        resetSettingsModal.hidden =
            false;

    }

}

function closeResetModal() {

    if (!resetSettingsModal) return;

    if (
        typeof resetSettingsModal
            .close ===
        "function"
    ) {

        resetSettingsModal.close();

    } else {

        resetSettingsModal.hidden =
            true;

    }

}



/* ======================================================
   RESET ALL SETTINGS
====================================================== */

function resetAllSettings() {

    if (form) {

        form.reset();

    }

    if (profilePhotoPreview) {

        profilePhotoPreview.src =
            originalProfilePhoto ||
            "images/default-coach-avatar.png";

    }

    if (profilePhotoInput) {

        profilePhotoInput.value =
            "";

    }

    themeOptions.forEach(
        option => {

            option.checked =
                option.value ===
                "light";

        }
    );

    applyTheme(
        "light"
    );

    updateBiographyCounter();

    updatePasswordStrength();

    applyAccessibilityPreferences();

    markSettingsChanged();

    closeResetModal();

    showToast(
        "Settings reset",
        "Review the default settings and save to apply them.",
        "success"
    );

}



/* ======================================================
   BUTTON EVENTS
====================================================== */

saveSettingsButton?.addEventListener(
    "click",
    saveSettings
);

resetSettingsButton?.addEventListener(
    "click",
    openResetModal
);

cancelSettingsButton?.addEventListener(
    "click",
    cancelSettingsChanges
);

confirmResetButton?.addEventListener(
    "click",
    resetAllSettings
);

closeResetModalButton?.addEventListener(
    "click",
    closeResetModal
);

resetSettingsModal?.addEventListener(
    "click",
    event => {

        if (
            event.target ===
            resetSettingsModal
        ) {

            closeResetModal();

        }

    }
);



/* ======================================================
   FORM SUBMIT
====================================================== */

form?.addEventListener(
    "submit",
    event => {

        event.preventDefault();

        saveSettings();

    }
);

/* ======================================================
   TOAST REFERENCES
====================================================== */

const coachToast =
document.getElementById(
    "coachToast"
);

const coachToastIcon =
coachToast?.querySelector(
    ".coach-toast-icon"
);

const coachToastTitle =
coachToast?.querySelector(
    ".coach-toast-content strong"
);

const coachToastMessage =
coachToast?.querySelector(
    ".coach-toast-content p"
);

let toastTimeout = null;



/* ======================================================
   SHOW TOAST
====================================================== */

function showToast(
    title,
    message,
    type = "success"
) {

    if (!coachToast) {

        console.log(
            `${title}: ${message}`
        );

        return;

    }

    window.clearTimeout(
        toastTimeout
    );

    if (coachToastTitle) {

        coachToastTitle.textContent =
            title;

    }

    if (coachToastMessage) {

        coachToastMessage.textContent =
            message;

    }

    if (coachToastIcon) {

        coachToastIcon.className =
            "coach-toast-icon";

        if (type === "error") {

            coachToastIcon.classList.add(
                "error"
            );

            coachToastIcon.innerHTML =
                '<i class="fa-solid fa-circle-exclamation"></i>';

        } else if (
            type === "warning"
        ) {

            coachToastIcon.classList.add(
                "warning"
            );

            coachToastIcon.innerHTML =
                '<i class="fa-solid fa-triangle-exclamation"></i>';

        } else {

            coachToastIcon.classList.add(
                "success"
            );

            coachToastIcon.innerHTML =
                '<i class="fa-solid fa-check"></i>';

        }

    }

    coachToast.hidden = false;

    coachToast.classList.add(
        "active"
    );

    toastTimeout =
        window.setTimeout(
            hideToast,
            4500
        );

}



/* ======================================================
   HIDE TOAST
====================================================== */

function hideToast() {

    if (!coachToast) return;

    coachToast.classList.remove(
        "active"
    );

    window.setTimeout(
        () => {

            if (
                !coachToast.classList
                    .contains("active")
            ) {

                coachToast.hidden = true;

            }

        },
        250
    );

}



/* ======================================================
   CLOSE TOAST BUTTON
====================================================== */

const closeToastButton =
document.getElementById(
    "closeCoachToastButton"
);

closeToastButton?.addEventListener(
    "click",
    hideToast
);



/* ======================================================
   TWO-FACTOR AUTHENTICATION
====================================================== */

const enableTwoFactorButton =
document.getElementById(
    "enableTwoFactorButton"
);

const disableTwoFactorButton =
document.getElementById(
    "disableTwoFactorButton"
);

enableTwoFactorButton?.addEventListener(
    "click",
    () => {

        showToast(
            "Two-factor authentication",
            "Two-factor authentication setup will be connected to the backend.",
            "success"
        );

    }
);

disableTwoFactorButton?.addEventListener(
    "click",
    () => {

        showToast(
            "Two-factor authentication",
            "Two-factor authentication removal will require account verification.",
            "warning"
        );

    }
);



/* ======================================================
   SESSION REMOVAL
====================================================== */

const sessionRemoveButtons =
document.querySelectorAll(
    ".coach-session-remove"
);

sessionRemoveButtons.forEach(
    button => {

        button.addEventListener(
            "click",
            () => {

                const sessionItem =
                    button.closest(
                        ".coach-session-item"
                    );

                if (!sessionItem) return;

                sessionItem.remove();

                showToast(
                    "Session removed",
                    "The selected device session has been signed out.",
                    "success"
                );

                /*
                BACKEND PLACEHOLDER

                DELETE
                /api/v1/coaches/sessions/{sessionId}
                */

            }
        );

    }
);



/* ======================================================
   SIGN OUT OTHER DEVICES
====================================================== */

const signOutOtherDevicesButton =
document.getElementById(
    "signOutOtherDevicesButton"
);

signOutOtherDevicesButton
?.addEventListener(
    "click",
    () => {

        const sessionItems =
            document.querySelectorAll(
                ".coach-session-item"
            );

        sessionItems.forEach(
            sessionItem => {

                const isCurrentSession =
                    sessionItem.querySelector(
                        ".coach-current-session-badge"
                    );

                if (!isCurrentSession) {

                    sessionItem.remove();

                }

            }
        );

        showToast(
            "Other devices signed out",
            "Your account remains active only on this device.",
            "success"
        );

        /*
        BACKEND PLACEHOLDER

        POST
        /api/v1/coaches/sessions/revoke-others
        */

    }
);



/* ======================================================
   DOWNLOAD ACCOUNT DATA
====================================================== */

const downloadDataButton =
document.getElementById(
    "downloadCoachDataButton"
);

downloadDataButton?.addEventListener(
    "click",
    () => {

        const accountData = {

            exportedAt:
                new Date()
                    .toISOString(),

            profile:
                buildSettingsPayload(),

            note:
                "Frontend demonstration export"

        };

        const dataBlob =
            new Blob(
                [
                    JSON.stringify(
                        accountData,
                        null,
                        2
                    )
                ],
                {
                    type:
                        "application/json"
                }
            );

        const downloadUrl =
            URL.createObjectURL(
                dataBlob
            );

        const downloadLink =
            document.createElement(
                "a"
            );

        downloadLink.href =
            downloadUrl;

        downloadLink.download =
            "coach-account-data.json";

        document.body.appendChild(
            downloadLink
        );

        downloadLink.click();

        downloadLink.remove();

        URL.revokeObjectURL(
            downloadUrl
        );

        showToast(
            "Download started",
            "Your coach account data is being downloaded.",
            "success"
        );

    }
);



/* ======================================================
   DELETE ACCOUNT MODAL
====================================================== */

const deleteAccountButton =
document.getElementById(
    "deleteCoachAccountButton"
);

const deleteAccountModal =
document.getElementById(
    "deleteAccountModal"
);

const closeDeleteModalButton =
document.getElementById(
    "closeDeleteModalButton"
);

const confirmDeleteAccountButton =
document.getElementById(
    "confirmDeleteAccountButton"
);

const deleteAccountConfirmation =
document.getElementById(
    "deleteAccountConfirmation"
);



/* ======================================================
   OPEN DELETE MODAL
====================================================== */

function openDeleteAccountModal() {

    if (!deleteAccountModal) return;

    if (
        typeof deleteAccountModal
            .showModal ===
        "function"
    ) {

        deleteAccountModal.showModal();

    } else {

        deleteAccountModal.hidden =
            false;

    }

    deleteAccountConfirmation
        ?.focus();

}



/* ======================================================
   CLOSE DELETE MODAL
====================================================== */

function closeDeleteAccountModal() {

    if (!deleteAccountModal) return;

    if (
        typeof deleteAccountModal
            .close ===
        "function"
    ) {

        deleteAccountModal.close();

    } else {

        deleteAccountModal.hidden =
            true;

    }

    if (
        deleteAccountConfirmation
    ) {

        deleteAccountConfirmation.value =
            "";

    }

}



/* ======================================================
   CONFIRM ACCOUNT DELETION
====================================================== */

async function confirmAccountDeletion() {

    const confirmationValue =
        deleteAccountConfirmation
            ?.value
            .trim()
            .toUpperCase();

    if (
        confirmationValue !==
        "DELETE"
    ) {

        showToast(
            "Confirmation required",
            'Type "DELETE" to confirm account deletion.',
            "error"
        );

        deleteAccountConfirmation
            ?.focus();

        return;

    }

    if (
        confirmDeleteAccountButton
    ) {

        confirmDeleteAccountButton
            .disabled = true;

        confirmDeleteAccountButton
            .innerHTML =
            `
                <i class="fa-solid fa-spinner fa-spin"></i>
                Deleting...
            `;

    }

    try {

        /*
        BACKEND INTEGRATION PLACEHOLDER

        const response = await fetch(
            "/api/v1/coaches/account",
            {
                method: "DELETE",
                headers: {
                    Authorization:
                        `Bearer ${token}`
                }
            }
        );

        if (!response.ok) {
            throw new Error(
                "Account deletion failed."
            );
        }
        */

        await new Promise(
            resolve => {

                window.setTimeout(
                    resolve,
                    800
                );

            }
        );

        closeDeleteAccountModal();

        showToast(
            "Deletion request received",
            "Account deletion will be completed after backend verification.",
            "warning"
        );

    } catch (error) {

        console.error(
            "Unable to delete account:",
            error
        );

        showToast(
            "Deletion failed",
            "Your account could not be deleted. Please try again.",
            "error"
        );

    } finally {

        if (
            confirmDeleteAccountButton
        ) {

            confirmDeleteAccountButton
                .disabled = false;

            confirmDeleteAccountButton
                .innerHTML =
                `
                    <i class="fa-solid fa-trash"></i>
                    Delete Account
                `;

        }

    }

}

deleteAccountButton
?.addEventListener(
    "click",
    openDeleteAccountModal
);

closeDeleteModalButton
?.addEventListener(
    "click",
    closeDeleteAccountModal
);

confirmDeleteAccountButton
?.addEventListener(
    "click",
    confirmAccountDeletion
);

deleteAccountModal?.addEventListener(
    "click",
    event => {

        if (
            event.target ===
            deleteAccountModal
        ) {

            closeDeleteAccountModal();

        }

    }
);



/* ======================================================
   LOGOUT
====================================================== */

const logoutButton =
document.getElementById(
    "coachLogoutButton"
);

logoutButton?.addEventListener(
    "click",
    () => {

        if (hasUnsavedChanges) {

            const shouldLeave =
                window.confirm(
                    "You have unsaved changes. Log out anyway?"
                );

            if (!shouldLeave) {

                return;

            }

        }

        /*
        BACKEND PLACEHOLDER

        POST /api/v1/auth/logout

        Clear JWT access token and refresh token
        after backend integration.
        */

        window.location.href =
            "login.html";

    }
);



/* ======================================================
   KEYBOARD MODAL CONTROL
====================================================== */

document.addEventListener(
    "keydown",
    event => {

        if (
            event.key !== "Escape"
        ) {

            return;

        }

        closeResetModal();

        closeDeleteAccountModal();

        hideToast();

    }
);



/* ======================================================
   INITIAL PAGE STATE
====================================================== */

function initializeCoachSettingsPage() {

    hideSaveBar();

    if (coachToast) {

        coachToast.hidden = true;

    }

    if (
        resetSettingsModal &&
        typeof resetSettingsModal
            .close !== "function"
    ) {

        resetSettingsModal.hidden =
            true;

    }

    if (
        deleteAccountModal &&
        typeof deleteAccountModal
            .close !== "function"
    ) {

        deleteAccountModal.hidden =
            true;

    }

    updateBiographyCounter();

    updatePasswordStrength();

    updateNotificationBadge();

}



/* ======================================================
   INITIALIZE
====================================================== */

if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        initializeCoachSettingsPage
    );

} else {

    initializeCoachSettingsPage();

}

/* ======================================================
   OPTIONAL ACCESSIBILITY SHORTCUTS
====================================================== */

document.addEventListener(
    "keydown",
    event => {

        const saveShortcut =
            (
                event.ctrlKey ||
                event.metaKey
            ) &&
            event.key.toLowerCase() ===
            "s";

        if (!saveShortcut) return;

        event.preventDefault();

        if (
            hasUnsavedChanges
        ) {

            saveSettings();

        }

    }
);



/* ======================================================
   NAVIGATION HASH SUPPORT
====================================================== */

function openSectionFromHash() {

    const sectionHash =
        window.location.hash
            .replace("#", "")
            .trim();

    if (!sectionHash) return;

    const matchingSection =
        document.getElementById(
            sectionHash
        );

    const matchingButton =
        document.querySelector(
            `.coach-settings-nav-button[data-section="${sectionHash}"]`
        );

    if (
        matchingSection &&
        matchingButton
    ) {

        switchSection(
            sectionHash
        );

    }

}

window.addEventListener(
    "hashchange",
    openSectionFromHash
);

openSectionFromHash();



/* ======================================================
   UPDATE URL WHEN SECTION CHANGES
====================================================== */

settingsNavigationButtons.forEach(
    button => {

        button.addEventListener(
            "click",
            () => {

                const sectionId =
                    button.dataset.section;

                if (!sectionId) return;

                history.replaceState(
                    null,
                    "",
                    `#${sectionId}`
                );

            }
        );

    }
);



/* ======================================================
   SETTINGS SEARCH
====================================================== */

const settingsSearchInput =
document.getElementById(
    "coachSettingsSearch"
);

const settingsSearchResults =
document.getElementById(
    "coachSettingsSearchResults"
);

const searchableSettings = [];

settingsNavigationButtons.forEach(
    button => {

        const sectionId =
            button.dataset.section;

        const title =
            button.querySelector(
                "strong"
            )?.textContent
                .trim() || "";

        const description =
            button.querySelector(
                "small"
            )?.textContent
                .trim() || "";

        if (
            sectionId &&
            title
        ) {

            searchableSettings.push({

                sectionId,

                title,

                description

            });

        }

    }
);



/* ======================================================
   RENDER SETTINGS SEARCH RESULTS
====================================================== */

function clearSettingsSearchResults() {

    if (!settingsSearchResults) return;

    settingsSearchResults.innerHTML =
        "";

    settingsSearchResults.hidden =
        true;

}

function renderSettingsSearchResults(
    results
) {

    if (!settingsSearchResults) return;

    settingsSearchResults.innerHTML =
        "";

    if (!results.length) {

        const emptyState =
            document.createElement(
                "div"
            );

        emptyState.className =
            "coach-settings-search-empty";

        emptyState.textContent =
            "No matching settings found.";

        settingsSearchResults
            .appendChild(
                emptyState
            );

        settingsSearchResults.hidden =
            false;

        return;

    }

    results.forEach(
        result => {

            const resultButton =
                document.createElement(
                    "button"
                );

            resultButton.type =
                "button";

            resultButton.className =
                "coach-settings-search-result";

            resultButton.innerHTML =
                `
                    <strong>
                        ${result.title}
                    </strong>

                    <small>
                        ${result.description}
                    </small>
                `;

            resultButton.addEventListener(
                "click",
                () => {

                    switchSection(
                        result.sectionId
                    );

                    history.replaceState(
                        null,
                        "",
                        `#${result.sectionId}`
                    );

                    clearSettingsSearchResults();

                    if (
                        settingsSearchInput
                    ) {

                        settingsSearchInput.value =
                            "";

                    }

                }
            );

            settingsSearchResults
                .appendChild(
                    resultButton
                );

        }
    );

    settingsSearchResults.hidden =
        false;

}



/* ======================================================
   FILTER SETTINGS SEARCH
====================================================== */

settingsSearchInput?.addEventListener(
    "input",
    () => {

        const searchValue =
            settingsSearchInput.value
                .trim()
                .toLowerCase();

        if (!searchValue) {

            clearSettingsSearchResults();

            return;

        }

        const matchingResults =
            searchableSettings.filter(
                setting => {

                    const searchableText =
                        `
                            ${setting.title}
                            ${setting.description}
                            ${setting.sectionId}
                        `
                            .toLowerCase();

                    return searchableText
                        .includes(
                            searchValue
                        );

                }
            );

        renderSettingsSearchResults(
            matchingResults
        );

    }
);



/* ======================================================
   CLOSE SEARCH RESULTS OUTSIDE
====================================================== */

document.addEventListener(
    "click",
    event => {

        const clickedInsideSearch =
            settingsSearchInput
                ?.contains(
                    event.target
                ) ||
            settingsSearchResults
                ?.contains(
                    event.target
                );

        if (!clickedInsideSearch) {

            clearSettingsSearchResults();

        }

    }
);



/* ======================================================
   ONLINE / OFFLINE STATUS
====================================================== */

function updateConnectionStatus() {

    if (navigator.onLine) {

        document.body.classList.remove(
            "coach-page-offline"
        );

        return;

    }

    document.body.classList.add(
        "coach-page-offline"
    );

    showToast(
        "You are offline",
        "Changes cannot be synchronized until your connection returns.",
        "warning"
    );

}

window.addEventListener(
    "online",
    () => {

        document.body.classList.remove(
            "coach-page-offline"
        );

        showToast(
            "Connection restored",
            "You are back online.",
            "success"
        );

    }
);

window.addEventListener(
    "offline",
    updateConnectionStatus
);

updateConnectionStatus();



/* ======================================================
   FORM FIELD AUTOCOMPLETE SUPPORT
====================================================== */

if (coachFullName) {

    coachFullName.autocomplete =
        "name";

}

if (coachEmail) {

    coachEmail.autocomplete =
        "email";

}

if (coachPhone) {

    coachPhone.autocomplete =
        "tel";

}

if (currentPassword) {

    currentPassword.autocomplete =
        "current-password";

}

if (newPassword) {

    newPassword.autocomplete =
        "new-password";

}

if (confirmPassword) {

    confirmPassword.autocomplete =
        "new-password";

}



/* ======================================================
   FINAL INITIAL STATE
====================================================== */

clearSettingsSearchResults();

clearUnsavedChanges();

console.info(
    "Coach settings frontend initialized."
);