// ================= MOBILE MENU =================

const menuButton = document.getElementById("menuButton");
const navLinks = document.getElementById("navLinks");

menuButton.addEventListener("click", function () {
  menuButton.classList.toggle("active");
  navLinks.classList.toggle("active");
  document.body.classList.toggle("menu-open");
});


// Close mobile menu when a navigation link is clicked

document.querySelectorAll(".nav-links a").forEach(function (link) {
  link.addEventListener("click", function () {
    menuButton.classList.remove("active");
    navLinks.classList.remove("active");
    document.body.classList.remove("menu-open");
  });
});


// ================= STICKY NAVBAR =================

const navbar = document.getElementById("navbar");

window.addEventListener("scroll", function () {
  if (window.scrollY > 70) {
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
  }
});


// ================= HERO REVEAL ANIMATION =================

const revealElements = document.querySelectorAll(".reveal");

const revealObserver = new IntersectionObserver(
  function (entries) {
    entries.forEach(function (entry, index) {
      if (entry.isIntersecting) {
        setTimeout(function () {
          entry.target.classList.add("visible");
        }, index * 100);

        revealObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.15
  }
);

revealElements.forEach(function (element) {
  revealObserver.observe(element);
});


// ================= COUNTER ANIMATION =================

const counters = document.querySelectorAll(".counter");

const counterObserver = new IntersectionObserver(
  function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) {
        return;
      }

      const counter = entry.target;

      const target = Number(counter.getAttribute("data-target"));

      let currentValue = 0;

      const increment = Math.max(1, Math.ceil(target / 45));

      const interval = setInterval(function () {
        currentValue += increment;

        if (currentValue >= target) {
          currentValue = target;

          clearInterval(interval);
        }

        counter.textContent = currentValue;
      }, 35);

      counterObserver.unobserve(counter);
    });
  },
  {
    threshold: 0.5
  }
);

counters.forEach(function (counter) {
  counterObserver.observe(counter);
});


// ================= SUPPORT FORM =================

const supportForm = document.getElementById("supportForm");
const formMessage = document.getElementById("formMessage");

supportForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const fullName = document
    .getElementById("fullName")
    .value
    .trim();

  formMessage.textContent =
    "Thank you, " +
    fullName +
    ". Your support has been recorded in this prototype.";

  supportForm.reset();
});