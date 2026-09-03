// ======================================================
// THEME TOGGLE
// ======================================================

(function () {
  const toggleBtn = document.getElementById("theme-toggle");
  const root = document.documentElement;

  if (!toggleBtn) {
    console.warn("Theme toggle button not found");
    return;
  }

  const icon = toggleBtn.querySelector("i");

  // Load saved theme or default dark for space aesthetic
  const savedTheme = localStorage.getItem("theme") || "dark";
  root.setAttribute("data-theme", savedTheme);
  updateIcon(savedTheme);

  // Toggle on click
  toggleBtn.addEventListener("click", () => {
    const currentTheme = root.getAttribute("data-theme");
    const newTheme = currentTheme === "dark" ? "light" : "dark";

    root.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
    updateIcon(newTheme);
  });

  function updateIcon(theme) {
    if (!icon) return;
    icon.className = theme === "dark" ? "fas fa-moon" : "fas fa-sun";
  }
})();


// ======================================================
// CUSTOM CURSOR SYSTEM (DevHQ style)
// ======================================================

(function () {
  const cursorDot = document.querySelector('[data-cursor-dot]');
  const cursorOutline = document.querySelector('[data-cursor-outline]');

  if (!cursorDot || !cursorOutline) return;

  // Track mouse coordinates
  window.addEventListener('mousemove', function (e) {
    const posX = e.clientX;
    const posY = e.clientY;

    cursorDot.style.left = `${posX}px`;
    cursorDot.style.top = `${posY}px`;

    cursorOutline.animate(
      {
        left: `${posX}px`,
        top: `${posY}px`
      },
      { duration: 500, fill: "forwards" }
    );
  });

  // Magnetic / Expand Hover Effect for interactables
  function initCursorHover() {
    const interactables = document.querySelectorAll(
      'a, button, input, textarea, select, .logo, .hero-btn, .project-card, .timeline-item, .contact-card, #theme-toggle, #nav-toggle, #scrollToTop'
    );

    interactables.forEach((el) => {
      el.addEventListener('mouseenter', () => {
        cursorOutline.classList.add('hovered');
      });
      el.addEventListener('mouseleave', () => {
        cursorOutline.classList.remove('hovered');
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCursorHover);
  } else {
    initCursorHover();
  }
})();


// ======================================================
// NAVIGATION & SCROLL CONTROLS
// ======================================================

(function () {
  // Mobile Nav Toggle
  const navToggle = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', String(!isExpanded));
      navMenu.classList.toggle('active');
    });

    // Close menu when clicking link
    navMenu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Scroll to Top Button
  const scrollToTop = document.getElementById('scrollToTop');
  if (scrollToTop) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 350) {
        scrollToTop.classList.add('visible');
      } else {
        scrollToTop.classList.remove('visible');
      }
    });

    scrollToTop.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
})();
