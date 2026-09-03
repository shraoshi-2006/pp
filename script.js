// ======================================================
// PORTFOLIO CORE JAVASCRIPT
// Cyber Glass Cursor, Navigation, and Header Reactivity
// ======================================================

(function () {
  'use strict';

  // Ensure dark cosmic aesthetic is active by default
  document.documentElement.setAttribute('data-theme', 'dark');
})();


// ======================================================
// NEXT-GEN CYBER GLASS CURSOR SYSTEM
// Butter-smooth requestAnimationFrame lerp, magnetic glass
// expansion on interactables, click pulse, and edge fading.
// ======================================================

(function () {
  'use strict';

  // Check if device is touch or coarse pointer
  if (window.matchMedia('(pointer: coarse)').matches) {
    return;
  }

  const cursorDot = document.querySelector('[data-cursor-dot]');
  const cursorRing = document.querySelector('[data-cursor-ring]');
  const cursorGlow = document.querySelector('[data-cursor-glow]');

  if (!cursorDot || !cursorRing) return;

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let ringX = mouseX;
  let ringY = mouseY;
  let glowX = mouseX;
  let glowY = mouseY;
  let isHovered = false;
  let isVisible = false;

  // Track raw mouse position
  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    if (!isVisible) {
      isVisible = true;
      cursorDot.classList.add('active');
      cursorRing.classList.add('active');
      if (cursorGlow) cursorGlow.classList.add('active');
    }

    // Instant position for the precision core dot
    cursorDot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
  }, { passive: true });

  // Smooth lerp render loop for outer ring & glow aura
  function renderCursor() {
    // Lerp outer ring
    ringX += (mouseX - ringX) * 0.2;
    ringY += (mouseY - ringY) * 0.2;

    const ringScale = isHovered ? 'scale(1.5)' : 'scale(1)';
    cursorRing.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%) ${ringScale}`;

    // Lerp soft glow aura with gentler lag
    if (cursorGlow) {
      glowX += (mouseX - glowX) * 0.12;
      glowY += (mouseY - glowY) * 0.12;
      const glowScale = isHovered ? 'scale(1.8)' : 'scale(1)';
      cursorGlow.style.transform = `translate3d(${glowX}px, ${glowY}px, 0) translate(-50%, -50%) ${glowScale}`;
    }

    requestAnimationFrame(renderCursor);
  }
  requestAnimationFrame(renderCursor);

  // Mouse Down / Up click animation
  window.addEventListener('mousedown', () => {
    cursorRing.classList.add('clicking');
  });

  window.addEventListener('mouseup', () => {
    cursorRing.classList.remove('clicking');
  });

  // Window edge fading
  document.addEventListener('mouseleave', () => {
    isVisible = false;
    cursorDot.classList.remove('active');
    cursorRing.classList.remove('active');
    if (cursorGlow) cursorGlow.classList.remove('active');
  });

  document.addEventListener('mouseenter', () => {
    isVisible = true;
    cursorDot.classList.add('active');
    cursorRing.classList.add('active');
    if (cursorGlow) cursorGlow.classList.add('active');
  });

  // Magnetic & Frosted Glass Hover on Interactive Elements
  function bindInteractiveHovers() {
    const interactables = document.querySelectorAll(
      'a, button, input, textarea, select, label, .logo, .hero-btn, .project-card, .timeline-item, .contact-card, .social-pill, .footer-link, #nav-toggle, #scrollToTop'
    );

    interactables.forEach((el) => {
      el.addEventListener('mouseenter', () => {
        isHovered = true;
        cursorRing.classList.add('hovered');
        if (cursorGlow) cursorGlow.classList.add('hovered');
      });

      el.addEventListener('mouseleave', () => {
        isHovered = false;
        cursorRing.classList.remove('hovered');
        if (cursorGlow) cursorGlow.classList.remove('hovered');
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bindInteractiveHovers);
  } else {
    bindInteractiveHovers();
  }
})();


// ======================================================
// NAVIGATION & DYNAMIC GLASS HEADER SCROLL EFFECT
// ======================================================

(function () {
  'use strict';

  const header = document.querySelector('header');
  const navToggle = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');
  const scrollToTop = document.getElementById('scrollToTop');

  // Glass Header Scroll Reactivity
  function handleScroll() {
    const scrollY = window.scrollY;

    // Header frosted compression
    if (header) {
      if (scrollY > 30) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }

    // Scroll to Top Button Visibility
    if (scrollToTop) {
      if (scrollY > 350) {
        scrollToTop.classList.add('visible');
      } else {
        scrollToTop.classList.remove('visible');
      }
    }
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // Initial check

  // Scroll to Top Smooth Click
  if (scrollToTop) {
    scrollToTop.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // Mobile Nav Toggle & Responsive Menu Interaction
  if (navToggle && navMenu) {
    const toggleIcon = navToggle.querySelector('i');

    function closeMenu() {
      navMenu.classList.remove('active');
      navToggle.setAttribute('aria-expanded', 'false');
      if (toggleIcon) {
        toggleIcon.className = 'fas fa-bars';
      }
    }

    function openMenu() {
      navMenu.classList.add('active');
      navToggle.setAttribute('aria-expanded', 'true');
      if (toggleIcon) {
        toggleIcon.className = 'fas fa-times';
      }
    }

    navToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
      if (isExpanded) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    // Close mobile menu when clicking any nav link
    navMenu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        closeMenu();
      });
    });

    // Close mobile menu when clicking anywhere outside
    document.addEventListener('click', (e) => {
      if (navMenu.classList.contains('active') && !navMenu.contains(e.target) && !navToggle.contains(e.target)) {
        closeMenu();
      }
    });

    // Close mobile menu on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navMenu.classList.contains('active')) {
        closeMenu();
      }
    });
  }
})();
