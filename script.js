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

