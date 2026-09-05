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
// 2. INTERACTIVE EMAIL DIALOGUE MODAL (EmailJS)
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
    if (!overlay) return;
    overlay.classList.add('active');
    overlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    updateGmailShortcut();
    setTimeout(() => {
      if (fromInput) fromInput.focus();
    }, 120);
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
          statusEl.textContent = 'Please fill out all required fields.';
          statusEl.className = 'email-dialog-status error';
        }
        return;
      }

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span>Sending...</span> <i class="fas fa-spinner fa-spin" aria-hidden="true"></i>';
      }

      if (statusEl) {
        statusEl.textContent = 'Sending message...';
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
              statusEl.textContent = 'Message sent successfully! Thank you for reaching out.';
              statusEl.className = 'email-dialog-status success';
            }
            form.reset();
            setTimeout(window.closeEmailModal, 1800);
          })
          .catch(function (error) {
            console.warn('EmailJS fallback to mailto:', error);
            const mailtoUrl = `mailto:shraoshibasak.9090@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent('From: ' + sender + '\n\n' + message)}`;
            window.location.href = mailtoUrl;
            if (statusEl) {
              statusEl.textContent = 'Opening your email client...';
              statusEl.className = 'email-dialog-status success';
            }
            setTimeout(window.closeEmailModal, 1800);
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
        setTimeout(window.closeEmailModal, 1800);
      }
    });
  }
})();
