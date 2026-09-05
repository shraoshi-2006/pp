// ======================================================
// SHRAOXI PORTFOLIO — CORE JAVASCRIPT ENGINE
// Includes: Cyber Preloader, Custom Glass Cursor, Sticky Header,
// Mobile Navigation, Interactive Security Console, and EmailJS Modal
// ======================================================

(function () {
  'use strict';
  document.documentElement.setAttribute('data-theme', 'dark');
})();

// ======================================================
// 1. FUTURISTIC CYBER PRELOADER (1 TO 100% ENGINE)
// ======================================================
(function initPreloader() {
  'use strict';

  const preloader = document.getElementById('preloader');
  const counterEl = document.getElementById('preloader-counter');
  const barEl = document.getElementById('preloader-bar');
  const statusEl = document.getElementById('preloader-status');

  if (!preloader || !counterEl || !barEl || !statusEl) return;

  document.body.classList.add('loading');

  const telemetryMessages = [
    { threshold: 0, text: '[SYS_BOOT] INITIALIZING QUANTUM PROTOCOLS...' },
    { threshold: 25, text: '[SEC_CHK] COMPILING DEFENSIVE AUDIT CORE...' },
    { threshold: 55, text: '[DEV_ENG] SYNCHRONIZING FASTAPI & NEXT.JS STACK...' },
    { threshold: 80, text: '[INTERFACE] DECRYPTING PORTFOLIO WORKSTATION...' },
    { threshold: 95, text: '[READY] SYSTEMS ONLINE. PREPARING VIEWPORT...' },
    { threshold: 100, text: '[COMPLETE] ACCESS AUTHORIZED. WELCOME, VISITOR.' }
  ];

  let currentCount = 1;
  const targetCount = 100;
  const totalDuration = 1600; // 1.6s
  const startTime = performance.now();

  function updateTelemetry(val) {
    for (let i = telemetryMessages.length - 1; i >= 0; i--) {
      if (val >= telemetryMessages[i].threshold) {
        statusEl.textContent = telemetryMessages[i].text;
        break;
      }
    }
  }

  function tickPreloader(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / totalDuration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const calculatedCount = Math.min(Math.floor(1 + (targetCount - 1) * eased), 100);

    if (calculatedCount > currentCount) {
      currentCount = calculatedCount;
      counterEl.textContent = currentCount;
      barEl.style.width = currentCount + '%';
      updateTelemetry(currentCount);
    }

    if (progress < 1) {
      requestAnimationFrame(tickPreloader);
    } else {
      counterEl.textContent = '100';
      barEl.style.width = '100%';
      updateTelemetry(100);

      setTimeout(() => {
        preloader.classList.add('loaded');
        document.body.classList.remove('loading');
        setTimeout(() => {
          preloader.style.display = 'none';
        }, 700);
      }, 300);
    }
  }

  requestAnimationFrame(tickPreloader);
})();


// ======================================================
// 2. NEXT-GEN CUSTOM GLASS CURSOR (DESKTOP ONLY)
// ======================================================
(function initCursor() {
  'use strict';

  if (window.matchMedia('(pointer: coarse)').matches) return;

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

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    if (!isVisible) {
      isVisible = true;
      cursorDot.classList.add('active');
      cursorRing.classList.add('active');
      if (cursorGlow) cursorGlow.classList.add('active');
    }

    cursorDot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
  }, { passive: true });

  function renderCursor() {
    ringX += (mouseX - ringX) * 0.2;
    ringY += (mouseY - ringY) * 0.2;
    const ringScale = isHovered ? 'scale(1.4)' : 'scale(1)';
    cursorRing.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%) ${ringScale}`;

    if (cursorGlow) {
      glowX += (mouseX - glowX) * 0.12;
      glowY += (mouseY - glowY) * 0.12;
      const glowScale = isHovered ? 'scale(1.6)' : 'scale(1)';
      cursorGlow.style.transform = `translate3d(${glowX}px, ${glowY}px, 0) translate(-50%, -50%) ${glowScale}`;
    }

    requestAnimationFrame(renderCursor);
  }
  requestAnimationFrame(renderCursor);

  window.addEventListener('mousedown', () => cursorRing.classList.add('clicking'));
  window.addEventListener('mouseup', () => cursorRing.classList.remove('clicking'));

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

  function bindHoverEvents() {
    const targets = document.querySelectorAll('a, button, input, textarea, .cmd-chip, .tech-chip-item, .standard-project-card, .cert-card, .repo-card-mini');
    targets.forEach((el) => {
      el.addEventListener('mouseenter', () => {
        isHovered = true;
        cursorRing.classList.add('hovered');
      });
      el.addEventListener('mouseleave', () => {
        isHovered = false;
        cursorRing.classList.remove('hovered');
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bindHoverEvents);
  } else {
    bindHoverEvents();
  }
})();


// ======================================================
// 3. HEADER SCROLL, ACTIVE NAVIGATION & MOBILE DRAWER
// ======================================================
(function initNavigation() {
  'use strict';

  const header = document.getElementById('site-header');
  const navToggle = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');
  const scrollToTop = document.getElementById('scrollToTop');

  // Sticky header background transition
  function handleScroll() {
    const scrollY = window.scrollY;
    if (header) {
      if (scrollY > 30) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }

    if (scrollToTop) {
      if (scrollY > 400) {
        scrollToTop.classList.add('visible');
      } else {
        scrollToTop.classList.remove('visible');
      }
    }
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  if (scrollToTop) {
    scrollToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Mobile menu toggle
  if (navToggle && navMenu) {
    const icon = navToggle.querySelector('i');

    function openNav() {
      navMenu.classList.add('active');
      navToggle.setAttribute('aria-expanded', 'true');
      if (icon) icon.className = 'fas fa-times';
    }

    function closeNav() {
      navMenu.classList.remove('active');
      navToggle.setAttribute('aria-expanded', 'false');
      if (icon) icon.className = 'fas fa-bars';
    }

    navToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      if (navMenu.classList.contains('active')) {
        closeNav();
      } else {
        openNav();
      }
    });

    navMenu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', closeNav);
    });

    document.addEventListener('click', (e) => {
      if (navMenu.classList.contains('active') && !navMenu.contains(e.target) && !navToggle.contains(e.target)) {
        closeNav();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navMenu.classList.contains('active')) {
        closeNav();
      }
    });
  }

  // Active section indicator with IntersectionObserver
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');

  if ('IntersectionObserver' in window && sections.length > 0) {
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -60% 0px',
      threshold: 0
    };

    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const currentId = entry.target.getAttribute('id');
          navLinks.forEach((link) => {
            if (link.getAttribute('href') === `#${currentId}`) {
              link.classList.add('active');
            } else {
              link.classList.remove('active');
            }
          });
        }
      });
    }, observerOptions);

    sections.forEach((sec) => sectionObserver.observe(sec));
  }
})();





// ======================================================
// 5. INTERACTIVE EMAIL DIALOGUE MODAL ENGINE (EmailJS)
// ======================================================
(function initEmailModal() {
  'use strict';

  // Initialize EmailJS with preserved key
  if (typeof emailjs !== 'undefined' && emailjs.init) {
    try {
      emailjs.init({ publicKey: "ZSyUTeaB8bz8sFtX4" });
    } catch (err) {
      console.warn('EmailJS init notice:', err);
    }
  }

  const overlay = document.getElementById('email-modal-overlay');
  const closeBtn = document.getElementById('email-dialog-close');
  const cancelBtn = document.getElementById('email-modal-cancel');
  const form = document.getElementById('email-dialog-form');
  const fromInput = document.getElementById('email-modal-from');
  const subjectInput = document.getElementById('email-modal-subject');
  const messageInput = document.getElementById('email-modal-message');
  const statusEl = document.getElementById('email-dialog-status');
  const submitBtn = document.getElementById('email-modal-submit');
  const gmailShortcut = document.getElementById('email-gmail-shortcut');

  window.openEmailModal = function (e) {
    if (e && e.preventDefault) e.preventDefault();
    if (!overlay) return;
    overlay.classList.add('active');
    overlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    updateGmailShortcut();
    setTimeout(() => {
      if (fromInput) fromInput.focus();
    }, 150);
  };

  window.closeEmailModal = function () {
    if (!overlay) return;
    overlay.classList.remove('active');
    overlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (statusEl) {
      statusEl.textContent = '';
      statusEl.className = 'email-dialog-status';
    }
  };

  function updateGmailShortcut() {
    if (!gmailShortcut || !subjectInput || !fromInput || !messageInput) return;
    const recipient = 'shraoshibasak.9090@gmail.com';
    const sub = encodeURIComponent(subjectInput.value.trim() || 'Portfolio Inquiry');
    const body = encodeURIComponent(
      `From: ${fromInput.value.trim()}\n\n${messageInput.value.trim()}`
    );
    gmailShortcut.href = `https://mail.google.com/mail/?view=cm&fs=1&to=${recipient}&su=${sub}&body=${body}`;
  }

  if (fromInput) fromInput.addEventListener('input', updateGmailShortcut);
  if (subjectInput) subjectInput.addEventListener('input', updateGmailShortcut);
  if (messageInput) messageInput.addEventListener('input', updateGmailShortcut);

  if (closeBtn) closeBtn.addEventListener('click', window.closeEmailModal);
  if (cancelBtn) cancelBtn.addEventListener('click', window.closeEmailModal);

  if (overlay) {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) window.closeEmailModal();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay && overlay.classList.contains('active')) {
      window.closeEmailModal();
    }
  });

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      const sender = fromInput ? fromInput.value.trim() : '';
      const subject = subjectInput ? subjectInput.value.trim() : '';
      const message = messageInput ? messageInput.value.trim() : '';

      if (!sender || !subject || !message) {
        if (statusEl) {
          statusEl.textContent = 'Please complete all required fields.';
          statusEl.className = 'email-dialog-status error';
        }
        return;
      }

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span>Sending...</span> <i class="fas fa-spinner fa-spin" aria-hidden="true"></i>';
      }

      if (statusEl) {
        statusEl.textContent = 'Transmitting secure dispatch...';
        statusEl.className = 'email-dialog-status';
      }

      if (typeof emailjs !== 'undefined' && emailjs.send) {
        const templateParams = {
          from_email: sender,
          to_email: 'shraoshibasak.9090@gmail.com',
          subject: subject,
          message: message,
          reply_to: sender
        };

        emailjs.send('service_ommgjzi', 'template_715eyqi', templateParams)
          .then(function () {
            if (statusEl) {
              statusEl.textContent = 'Message delivered successfully! Thank you.';
              statusEl.className = 'email-dialog-status success';
            }
            form.reset();
            setTimeout(window.closeEmailModal, 1600);
          })
          .catch(function (error) {
            console.warn('EmailJS fallback to mailto:', error);
            const mailtoUrl = `mailto:shraoshibasak.9090@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent('From: ' + sender + '\n\n' + message)}`;
            window.location.href = mailtoUrl;
            if (statusEl) {
              statusEl.textContent = 'Opening your email client...';
              statusEl.className = 'email-dialog-status success';
            }
            setTimeout(window.closeEmailModal, 1600);
          })
          .finally(function () {
            if (submitBtn) {
              submitBtn.disabled = false;
              submitBtn.innerHTML = '<span>Send Message</span> <i class="fas fa-paper-plane" aria-hidden="true"></i>';
            }
          });
      } else {
        const mailtoUrl = `mailto:shraoshibasak.9090@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent('From: ' + sender + '\n\n' + message)}`;
        window.location.href = mailtoUrl;
        if (statusEl) {
          statusEl.textContent = 'Opening your email client...';
          statusEl.className = 'email-dialog-status success';
        }
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = '<span>Send Message</span> <i class="fas fa-paper-plane" aria-hidden="true"></i>';
        }
        setTimeout(window.closeEmailModal, 1600);
      }
    });
  }
})();
