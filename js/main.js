(function () {
  "use strict";

  /* ---------- Theme toggle ---------- */
  var root = document.documentElement;
  var themeToggle = document.querySelector(".theme-toggle");
  var storedTheme = null;
  try {
    storedTheme = localStorage.getItem("theme");
  } catch (e) {}

  if (storedTheme === "light" || storedTheme === "dark") {
    root.setAttribute("data-theme", storedTheme);
  }

  if (themeToggle) {
    themeToggle.addEventListener("click", function () {
      var current = root.getAttribute("data-theme") === "light" ? "light" : "dark";
      var next = current === "light" ? "dark" : "light";
      root.setAttribute("data-theme", next);
      try {
        localStorage.setItem("theme", next);
      } catch (e) {}
    });
  }

  /* ---------- Sticky header ---------- */
  var header = document.querySelector(".site-header");
  function onScroll() {
    if (!header) return;
    if (window.scrollY > 20) {
      header.classList.add("is-scrolled");
    } else {
      header.classList.remove("is-scrolled");
    }

    var backToTop = document.querySelector(".back-to-top");
    if (backToTop) {
      backToTop.classList.toggle("is-visible", window.scrollY > 500);
    }
  }
  document.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile nav ---------- */
  var navToggle = document.querySelector(".nav-toggle");
  var navMenu = document.querySelector(".nav-menu");
  if (navToggle && navMenu) {
    navToggle.addEventListener("click", function () {
      var isOpen = navMenu.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });
    navMenu.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        navMenu.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---------- Back to top ---------- */
  var backToTop = document.querySelector(".back-to-top");
  if (backToTop) {
    backToTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ---------- Active nav link on scroll ---------- */
  var sections = Array.prototype.slice.call(document.querySelectorAll("section[id]"));
  var navLinks = Array.prototype.slice.call(document.querySelectorAll(".nav-menu a"));

  function updateActiveNav() {
    var scrollPos = window.scrollY + 120;
    var currentId = sections.length ? sections[0].id : null;
    sections.forEach(function (section) {
      if (section.offsetTop <= scrollPos) {
        currentId = section.id;
      }
    });
    navLinks.forEach(function (link) {
      var isActive = link.getAttribute("href") === "#" + currentId;
      link.classList.toggle("active", isActive);
    });
  }
  document.addEventListener("scroll", updateActiveNav, { passive: true });
  updateActiveNav();

  /* ---------- Scroll reveal ---------- */
  var revealEls = document.querySelectorAll("[data-reveal]");
  if ("IntersectionObserver" in window && revealEls.length) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
    );
    revealEls.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    revealEls.forEach(function (el) {
      el.classList.add("is-visible");
    });
  }

  /* ---------- Animated role headline ---------- */
  var roleEl = document.querySelector("[data-typed]");
  if (roleEl) {
    var roles = JSON.parse(roleEl.getAttribute("data-typed"));
    var roleIndex = 0;
    var charIndex = 0;
    var deleting = false;
    var textSpan = roleEl.querySelector(".typed-text");

    function tick() {
      var current = roles[roleIndex];
      if (!deleting) {
        charIndex++;
        textSpan.textContent = current.slice(0, charIndex);
        if (charIndex === current.length) {
          deleting = true;
          setTimeout(tick, 1600);
          return;
        }
      } else {
        charIndex--;
        textSpan.textContent = current.slice(0, charIndex);
        if (charIndex === 0) {
          deleting = false;
          roleIndex = (roleIndex + 1) % roles.length;
        }
      }
      setTimeout(tick, deleting ? 35 : 65);
    }
    tick();
  }

  /* ---------- Earlier achievements toggle ---------- */
  var earlierToggle = document.querySelector("[data-toggle-earlier]");
  var earlierPanel = document.querySelector(".earlier-achievements");
  if (earlierToggle && earlierPanel) {
    earlierToggle.addEventListener("click", function () {
      var isHidden = earlierPanel.hasAttribute("hidden");
      if (isHidden) {
        earlierPanel.removeAttribute("hidden");
        earlierToggle.textContent = "Hide earlier achievements";
      } else {
        earlierPanel.setAttribute("hidden", "");
        earlierToggle.textContent = "Show earlier achievements";
      }
    });
  }

  /* ---------- Footer year ---------- */
  var yearEl = document.querySelector("[data-year]");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  /* ---------- Contact form ---------- */
  var form = document.getElementById("contact-form");
  if (form) {
    var status = form.querySelector(".form-status");
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var data = new FormData(form);
      status.textContent = "Sending...";
      status.className = "form-status";

      fetch(form.action, {
        method: "POST",
        mode: "no-cors",
        body: data,
      })
        .then(function () {
          status.textContent = "Thanks! Your message has been sent — I'll get back to you soon.";
          status.className = "form-status success";
          form.reset();
        })
        .catch(function () {
          status.textContent = "Something went wrong. Please email me directly at ridoankhan07@gmail.com.";
          status.className = "form-status error";
        });
    });
  }
})();
