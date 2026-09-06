// ======================================================
// SHRAOXI PORTFOLIO — CORE JAVASCRIPT
// Handles: Sticky Navigation, Mobile Menu, Active Section Highlight,
// Scroll-to-Top, and EmailJS Interactive Dialogue Modal.
// ======================================================

(function () {
  'use strict';
  document.documentElement.setAttribute('data-theme', 'dark');
})();

// ======================================================
// 0. LANDING SCREEN / PRELOADER & LIVE DATE/TIME ENGINE
// ======================================================
(function initLandingPreloader() {
  'use strict';

  const preloader = document.getElementById('preloader');
  if (!preloader) return;

  // Lock body scrolling while preloader is active
  document.body.classList.add('loading');

  const counterEl = document.getElementById('preloader-counter');
  const barEl = document.getElementById('preloader-bar');
  const statusEl = document.getElementById('preloader-status');
  const skipBtn = document.getElementById('preloader-skip');
  const dateEl = document.getElementById('landing-live-date');
  const timeEl = document.getElementById('landing-live-time');
  const tzEl = document.getElementById('landing-tz-badge');

  // ----------------------------------------------------
  // Live Date & Time Widget (Top Right)
  // ----------------------------------------------------
  let clockInterval = null;

  function updateClock() {
    const now = new Date();

    if (dateEl) {
      try {
        const dateOptions = { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' };
        dateEl.textContent = now.toLocaleDateString('en-US', dateOptions).toUpperCase();
      } catch (e) {
        const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
        const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
        const dayStr = days[now.getDay()];
        const dateNum = String(now.getDate()).padStart(2, '0');
        const monthStr = months[now.getMonth()];
        const year = now.getFullYear();
        dateEl.textContent = `${dayStr}, ${dateNum} ${monthStr} ${year}`;
      }
    }

    if (timeEl) {
      try {
        const timeOptions = { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true };
        timeEl.textContent = now.toLocaleTimeString('en-US', timeOptions);
      } catch (e) {
        let hours = now.getHours();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12 || 12;
        const mins = String(now.getMinutes()).padStart(2, '0');
        const secs = String(now.getSeconds()).padStart(2, '0');
        timeEl.textContent = `${String(hours).padStart(2, '0')}:${mins}:${secs} ${ampm}`;
      }
    }

    if (tzEl && !tzEl.dataset.initialized) {
      try {
        const tzMatch = new Date().toLocaleTimeString('en-us', { timeZoneName: 'short' }).split(' ');
        const tzAbbr = tzMatch[tzMatch.length - 1];
        if (tzAbbr && tzAbbr.length <= 5 && !tzAbbr.includes(':')) {
          tzEl.textContent = tzAbbr;
        } else {
          const offset = -now.getTimezoneOffset();
          const sign = offset >= 0 ? '+' : '-';
          const offHours = Math.floor(Math.abs(offset) / 60);
          const offMins = Math.abs(offset) % 60;
          tzEl.textContent = `GMT${sign}${offHours}${offMins > 0 ? ':' + String(offMins).padStart(2, '0') : ''}`;
        }
      } catch (e) {
        tzEl.textContent = 'LOCAL';
      }
      tzEl.dataset.initialized = 'true';
    }
  }

  // Initial update and start 1-second interval
  updateClock();
  clockInterval = setInterval(updateClock, 1000);

  // ----------------------------------------------------
  // Slower Preloader Counter Progression (~3.4s)
  // ----------------------------------------------------
  const telemetryStages = [
    { threshold: 0, text: '[SYS_BOOT] INITIALIZING SECURE PROTOCOLS...' },
    { threshold: 20, text: '[DEFENSE_CORE] VERIFYING PERIMETER INTEGRITY...' },
    { threshold: 45, text: '[CRYPT_ENGINE] SYNCHRONIZING NETWORK STACK...' },
    { threshold: 70, text: '[SYS_DIAG] OPTIMIZING GRAPHICS & REPOSITORIES...' },
    { threshold: 88, text: '[AUTHENTICATED] ACCESS GRANTED. PREPARING VIEWPORT...' },
    { threshold: 100, text: '[COMPLETE] WELCOME TO SHRAOXI BASAK\'S PORTFOLIO' }
  ];

  let currentPercent = 0;
  let isDismissed = false;
  const totalDuration = 3400; // Paced smoothly to ~3.4 seconds
  const startTime = performance.now();

  function easeOutCubic(x) {
    return 1 - Math.pow(1 - x, 3);
  }

  function updateTelemetry(pct) {
    if (!statusEl) return;
    for (let i = telemetryStages.length - 1; i >= 0; i--) {
      if (pct >= telemetryStages[i].threshold) {
        if (statusEl.textContent !== telemetryStages[i].text) {
          statusEl.textContent = telemetryStages[i].text;
        }
        break;
      }
    }
  }

  function tick(currentTime) {
    if (isDismissed) return;

    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / totalDuration, 1);
    const easedProgress = easeOutCubic(progress);
    currentPercent = Math.min(100, Math.floor(easedProgress * 100));

    if (counterEl) counterEl.textContent = currentPercent;
    if (barEl) barEl.style.width = currentPercent + '%';
    updateTelemetry(currentPercent);

    if (progress < 1) {
      requestAnimationFrame(tick);
    } else {
      currentPercent = 100;
      if (counterEl) counterEl.textContent = '100';
      if (barEl) barEl.style.width = '100%';
      updateTelemetry(100);
      setTimeout(dismissPreloader, 340);
    }
  }

  requestAnimationFrame(tick);

  // ----------------------------------------------------
  // Dismissal & Clean Exit
  // ----------------------------------------------------
  function dismissPreloader() {
    if (isDismissed) return;
    isDismissed = true;

    if (counterEl) counterEl.textContent = '100';
    if (barEl) barEl.style.width = '100%';
    if (statusEl) statusEl.textContent = '[COMPLETE] ACCESS GRANTED. WELCOME!';

    preloader.classList.add('loaded');
    document.body.classList.remove('loading');

    // Clean up DOM and clock timer after transition ends
    setTimeout(() => {
      preloader.style.display = 'none';
      if (clockInterval) {
        clearInterval(clockInterval);
        clockInterval = null;
      }
    }, 900);
  }

  // Skip button handler
  if (skipBtn) {
    skipBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      dismissPreloader();
    });
  }

  // Escape or Space key to quickly skip
  window.addEventListener('keydown', (e) => {
    if ((e.key === 'Escape' || e.key === ' ') && !isDismissed && preloader.style.display !== 'none') {
      dismissPreloader();
    }
  });

  // Safety fallback after 6s in case backgrounded
  setTimeout(() => {
    if (!isDismissed) {
      dismissPreloader();
    }
  }, 6000);
})();

// ======================================================
// 1. HEADER SCROLL, ACTIVE NAVIGATION & MOBILE DRAWER
// ======================================================
(function initNavigation() {
  'use strict';

  const header = document.getElementById('site-header');
  const navToggle = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');
  const scrollToTop = document.getElementById('scrollToTop');

  // Sticky header background state
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
      if (scrollY > 350) {
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

  // Mobile menu toggle & backdrop
  const navBackdrop = document.getElementById('nav-backdrop');

  if (navToggle && navMenu) {
    const icon = navToggle.querySelector('i');

    function openNav() {
      navMenu.classList.add('active');
      if (navBackdrop) navBackdrop.classList.add('active');
      document.body.classList.add('nav-open');
      navToggle.setAttribute('aria-expanded', 'true');
      if (icon) icon.className = 'fas fa-times';
    }

    function closeNav() {
      navMenu.classList.remove('active');
      if (navBackdrop) navBackdrop.classList.remove('active');
      document.body.classList.remove('nav-open');
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

    if (navBackdrop) {
      navBackdrop.addEventListener('click', closeNav);
    }

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

    window.addEventListener('resize', () => {
      if (window.innerWidth > 880 && navMenu.classList.contains('active')) {
        closeNav();
      }
    }, { passive: true });
  }

  // Active section indicator using IntersectionObserver
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');

  if ('IntersectionObserver' in window && sections.length > 0) {
    const observerOptions = {
      root: null,
      rootMargin: '-25% 0px -65% 0px',
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
// 2. INTERACTIVE EMAIL CARD (EmailJS + Direct Client)
// ======================================================
(function initEmailModal() {
  'use strict';

  // Initialize EmailJS
  if (typeof emailjs !== 'undefined' && emailjs.init) {
    try {
      emailjs.init({ publicKey: "ZSyUTeaB8bz8sFtX4" });
    } catch (err) {
      console.warn('EmailJS init note:', err);
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
    if (overlay) {
      overlay.classList.add('active');
      overlay.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    } else {
      const contactSection = document.getElementById('contact');
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
    updateGmailShortcut();
    setTimeout(() => {
      if (fromInput) fromInput.focus();
    }, overlay ? 120 : 450);
  };

  window.closeEmailModal = function () {
    if (overlay) {
      overlay.classList.remove('active');
      overlay.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }
    if (statusEl && overlay) {
      statusEl.textContent = '';
      statusEl.className = 'mail-status-feedback';
    }
  };

  function updateGmailShortcut() {
    if (!gmailShortcut) return;
    const recipient = 'shraoshibasak.9090@gmail.com';
    const sub = encodeURIComponent((subjectInput && subjectInput.value.trim()) || 'Portfolio Inquiry');
    const sender = fromInput ? fromInput.value.trim() : '';
    const msg = messageInput ? messageInput.value.trim() : '';
    const body = encodeURIComponent(
      `From: ${sender}\n\n${msg}`
    );
    gmailShortcut.href = `https://mail.google.com/mail/?view=cm&fs=1&to=${recipient}&su=${sub}&body=${body}`;
  }

  if (fromInput) fromInput.addEventListener('input', updateGmailShortcut);
  if (subjectInput) subjectInput.addEventListener('input', updateGmailShortcut);
  if (messageInput) messageInput.addEventListener('input', updateGmailShortcut);
  updateGmailShortcut();

  // Dynamic Spotlight Glow tracking across the dialogue box
  const card = document.getElementById('mail-dialog-card');
  if (card) {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    }, { passive: true });
  }

  // Quick Topic Pills Auto-Fill
  const topicPills = document.querySelectorAll('.topic-pill');
  topicPills.forEach((pill) => {
    pill.addEventListener('click', () => {
      topicPills.forEach((p) => p.classList.remove('active'));
      pill.classList.add('active');
      const topic = pill.getAttribute('data-topic');
      if (subjectInput && topic) {
        subjectInput.value = topic;
        updateGmailShortcut();
        subjectInput.focus();
      }
    });
  });

  // Live Character Counter
  const charCounter = document.getElementById('message-char-counter');
  if (messageInput && charCounter) {
    messageInput.addEventListener('input', () => {
      const len = messageInput.value.length;
      charCounter.textContent = `${len} / 1000`;
      if (len > 900) {
        charCounter.classList.add('near-limit');
      } else {
        charCounter.classList.remove('near-limit');
      }
    });
  }

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
          statusEl.textContent = 'Please fill out all required fields.';
          statusEl.className = 'mail-status-feedback error';
        }
        return;
      }

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span>Sending...</span> <i class="fas fa-spinner fa-spin" aria-hidden="true"></i>';
      }

      if (statusEl) {
        statusEl.textContent = 'Sending message...';
        statusEl.className = 'mail-status-feedback';
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
              statusEl.textContent = 'Message sent successfully! Thank you for reaching out.';
              statusEl.className = 'mail-status-feedback success';
            }
            form.reset();
            updateGmailShortcut();
            setTimeout(() => {
              if (overlay) {
                window.closeEmailModal();
              } else if (statusEl) {
                setTimeout(() => {
                  statusEl.textContent = '';
                  statusEl.className = 'mail-status-feedback';
                }, 4000);
              }
            }, 1800);
          })
          .catch(function (error) {
            console.warn('EmailJS fallback to mailto:', error);
            const mailtoUrl = `mailto:shraoshibasak.9090@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent('From: ' + sender + '\n\n' + message)}`;
            window.location.href = mailtoUrl;
            if (statusEl) {
              statusEl.textContent = 'Opening your email client...';
              statusEl.className = 'mail-status-feedback success';
            }
            setTimeout(() => {
              if (overlay) window.closeEmailModal();
            }, 1800);
          })
          .finally(function () {
            if (submitBtn) {
              submitBtn.disabled = false;
              submitBtn.innerHTML = '<span>Say Hello</span> <i class="fas fa-paper-plane" aria-hidden="true"></i>';
            }
          });
      } else {
        const mailtoUrl = `mailto:shraoshibasak.9090@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent('From: ' + sender + '\n\n' + message)}`;
        window.location.href = mailtoUrl;
        if (statusEl) {
          statusEl.textContent = 'Opening your email client...';
          statusEl.className = 'mail-status-feedback success';
        }
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = '<span>Say Hello</span> <i class="fas fa-paper-plane" aria-hidden="true"></i>';
        }
        setTimeout(() => {
          if (overlay) window.closeEmailModal();
        }, 1800);
      }
    });
  }
})();




// ======================================================
// 3. CUSTOM SMOOTH CURSOR (RING + DOT)
// ======================================================
(function initCursor() {
  'use strict';

  // Return early on touch / coarse pointer devices
  if (window.matchMedia('(pointer: coarse)').matches || window.matchMedia('(hover: none)').matches) {
    return;
  }

  const dot = document.querySelector('.cursor-dot');
  const ring = document.querySelector('.cursor-ring');
  if (!dot || !ring) return;

  let mouseX = -100;
  let mouseY = -100;
  let ringX = -100;
  let ringY = -100;
  let isHovered = false;
  let isClicking = false;
  let isVisible = false;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    if (!isVisible) {
      isVisible = true;
      dot.classList.add('visible');
      ring.classList.add('visible');
      ringX = mouseX;
      ringY = mouseY;
    }

    dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
  }, { passive: true });

  function renderRing() {
    if (isVisible) {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;

      const scale = isClicking ? 'scale(0.85)' : (isHovered ? 'scale(1.15)' : 'scale(1)');
      ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%) ${scale}`;
    }
    requestAnimationFrame(renderRing);
  }
  requestAnimationFrame(renderRing);

  window.addEventListener('mousedown', () => {
    isClicking = true;
    ring.classList.add('clicking');
  });

  window.addEventListener('mouseup', () => {
    isClicking = false;
    ring.classList.remove('clicking');
  });

  document.addEventListener('mouseleave', () => {
    isVisible = false;
    dot.classList.remove('visible');
    ring.classList.remove('visible');
  });

  document.addEventListener('mouseenter', () => {
    isVisible = true;
    dot.classList.add('visible');
    ring.classList.add('visible');
  });

  // Attach hover state to all interactive elements
  function bindHoverTargets() {
    const interactiveSelectors = 'a, button, input, textarea, select, label, .tag, .stat-card, .pillar-card, .project-card, .repo-item, .meta-pill, .topic-pill, .mail-window-dots, .mail-chip';
    const targets = document.querySelectorAll(interactiveSelectors);

    targets.forEach((el) => {
      el.addEventListener('mouseenter', () => {
        isHovered = true;
        ring.classList.add('hovered');
        dot.classList.add('hovered');
      });
      el.addEventListener('mouseleave', () => {
        isHovered = false;
        ring.classList.remove('hovered');
        dot.classList.remove('hovered');
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bindHoverTargets);
  } else {
    bindHoverTargets();
  }
})();

