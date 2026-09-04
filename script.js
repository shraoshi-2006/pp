// ======================================================
// PORTFOLIO CORE JAVASCRIPT
// Cyber Preloader, Custom Cursor, Navigation, and Reactivity
// ======================================================

(function () {
  'use strict';

  // Ensure dark cosmic aesthetic is active by default
  document.documentElement.setAttribute('data-theme', 'dark');
})();


// ======================================================
// 1 TO 100% FUTURISTIC CYBER PRELOADER ENGINE
// High-tech telemetry logs, numeric ticker, and cyber reveal
// ======================================================

(function () {
  'use strict';

  const preloader = document.getElementById('preloader');
  const counterEl = document.getElementById('preloader-counter');
  const barEl = document.getElementById('preloader-bar');
  const statusEl = document.getElementById('preloader-status');

  if (!preloader || !counterEl || !barEl || !statusEl) return;

  document.body.classList.add('loading');

  const telemetryMessages = [
    { threshold: 0, text: '[SYS_BOOT] INITIALIZING QUANTUM PROTOCOLS...' },
    { threshold: 24, text: '[SEC_CHK] COMPILING CYBER RESILIENCE CORE...' },
    { threshold: 52, text: '[DEV_ENG] SYNCHRONIZING 3D & TECH STACK...' },
    { threshold: 76, text: '[INTERFACE] DECRYPTING PORTFOLIO DATASTREAM...' },
    { threshold: 94, text: '[READY] ACCESS AUTHORIZED. PREPARING VIEWPORT...' },
    { threshold: 100, text: '[COMPLETE] ACCESS GRANTED. WELCOME, VISITOR.' }
  ];

  let currentCount = 1;
  const targetCount = 100;
  const totalDuration = 1800; // 1.8 seconds total
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
    
    // Smooth easing curve (easeOutCubic)
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
      // Reached 100%
      counterEl.textContent = '100';
      barEl.style.width = '100%';
      updateTelemetry(100);

      setTimeout(() => {
        preloader.classList.add('loaded');
        document.body.classList.remove('loading');

        setTimeout(() => {
          preloader.style.display = 'none';
        }, 800);
      }, 350);
    }
  }

  requestAnimationFrame(tickPreloader);
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
      'a, button, input, textarea, select, label, .logo-link, .header-gmail-btn, .skill-item-card, .skill-category-card, .hero-btn, .project-card, .timeline-item, .contact-card, .social-pill, .footer-link, #nav-toggle, #scrollToTop'
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


// ======================================================
// TECHNICAL SKILLS — STRUCTURED DATA & COMPONENT ENGINE
// Reusable data-driven architecture for skills categories and chips
// ======================================================

const TECHNICAL_SKILLS_DATA = [
  {
    id: 'frontend',
    index: '01',
    category: 'FRONTEND',
    countText: '6 Technologies',
    accent: '#38bdf8',
    glow: 'rgba(56, 189, 248, 0.25)',
    iconClass: 'fas fa-layer-group',
    gridClass: 'card-frontend',
    technologies: [
      { name: 'React', icon: '<i class="devicon-react-original colored" aria-hidden="true"></i>' },
      { name: 'JavaScript', icon: '<i class="devicon-javascript-plain colored" aria-hidden="true"></i>' },
      { name: 'TypeScript', icon: '<i class="devicon-typescript-plain colored" aria-hidden="true"></i>' },
      { name: 'HTML5', icon: '<i class="devicon-html5-plain colored" aria-hidden="true"></i>' },
      { name: 'CSS3', icon: '<i class="devicon-css3-plain colored" aria-hidden="true"></i>' },
      { name: 'Tailwind CSS', icon: '<i class="devicon-tailwindcss-original colored" aria-hidden="true"></i>' }
    ]
  },
  {
    id: 'backend',
    index: '02',
    category: 'BACKEND',
    countText: '4 Technologies',
    accent: '#34d399',
    glow: 'rgba(52, 211, 153, 0.25)',
    iconClass: 'fas fa-server',
    gridClass: 'card-backend',
    technologies: [
      { name: 'Node.js', icon: '<i class="devicon-nodejs-plain colored" aria-hidden="true"></i>' },
      { name: 'REST APIs', icon: '<i class="fas fa-network-wired" style="color: #34d399;" aria-hidden="true"></i>' },
      { name: 'dotenv', icon: '<i class="fas fa-sliders" style="color: #6ee7b7;" aria-hidden="true"></i>' },
      { name: 'JWT', icon: '<i class="fas fa-key" style="color: #fbbf24;" aria-hidden="true"></i>' }
    ]
  },
  {
    id: 'database',
    index: '04',
    category: 'DATABASE',
    countText: '3 Technologies',
    accent: '#818cf8',
    glow: 'rgba(129, 140, 248, 0.25)',
    iconClass: 'fas fa-database',
    gridClass: 'card-database',
    technologies: [
      { name: 'PostgreSQL', icon: '<i class="devicon-postgresql-plain colored" aria-hidden="true"></i>' },
      { name: 'SQLite', icon: '<i class="devicon-sqlite-plain colored" aria-hidden="true"></i>' },
      { name: 'SQL', icon: '<i class="fas fa-table-columns" style="color: #818cf8;" aria-hidden="true"></i>' }
    ]
  },
  {
    id: 'devops',
    index: '03',
    category: 'DEV & DEPLOYMENT',
    countText: '6 Technologies',
    accent: '#c084fc',
    glow: 'rgba(192, 132, 252, 0.25)',
    iconClass: 'fas fa-cloud-arrow-up',
    gridClass: 'card-devops',
    technologies: [
      { name: 'Git', icon: '<i class="devicon-git-plain colored" aria-hidden="true"></i>' },
      { name: 'GitHub', icon: '<i class="devicon-github-original" aria-hidden="true"></i>' },
      { name: 'Vercel', icon: '<i class="devicon-vercel-original" aria-hidden="true"></i>' },
      { name: 'Render', icon: '<i class="fas fa-cloud" style="color: #46e3b7;" aria-hidden="true"></i>' },
      { name: 'npm', icon: '<i class="devicon-npm-original-wordmark colored" aria-hidden="true"></i>' },
      { name: 'VS Code', icon: '<i class="devicon-vscode-plain colored" aria-hidden="true"></i>' }
    ]
  },
  {
    id: 'automation',
    index: '05',
    category: 'AUTOMATION & INTEGRATION',
    countText: '1 Technology',
    accent: '#f43f5e',
    glow: 'rgba(244, 63, 94, 0.25)',
    iconClass: 'fas fa-plug-circle-bolt',
    gridClass: 'card-automation',
    technologies: [
      { name: 'APIs', icon: '<i class="fas fa-bolt" style="color: #f43f5e;" aria-hidden="true"></i>' }
    ]
  }
];

// Interactive Constellation & Skill Chips enhancement
(function initTechnicalSkillsComponent() {
  const bentoGrid = document.getElementById('skills-bento-grid');
  if (!bentoGrid) return;

  // Add subtle interactive spotlight coordinate tracking for each card
  const cards = bentoGrid.querySelectorAll('.bento-skill-card');
  cards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      card.style.setProperty('--mouse-x', `${x}%`);
      card.style.setProperty('--mouse-y', `${y}%`);
    });
  });
})();


// ======================================================
// INTERACTIVE CYBER EMAIL DIALOGUE MODAL ENGINE
// ======================================================

function initEmailDialogueModal() {
  const mailBtn = document.getElementById('header-mail-btn');
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
    const ov = document.getElementById('email-modal-overlay');
    if (!ov) return;
    ov.classList.add('active');
    ov.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    updateGmailShortcut();
    setTimeout(() => {
      const fi = document.getElementById('email-modal-from');
      if (fi) fi.focus();
    }, 150);
  };

  window.closeEmailModal = function () {
    const ov = document.getElementById('email-modal-overlay');
    if (!ov) return;
    ov.classList.remove('active');
    ov.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    const st = document.getElementById('email-dialog-status');
    if (st) {
      st.textContent = '';
      st.className = 'email-dialog-status';
    }
  };

  function updateGmailShortcut() {
    const gs = document.getElementById('email-gmail-shortcut');
    const subIn = document.getElementById('email-modal-subject');
    const fromIn = document.getElementById('email-modal-from');
    const msgIn = document.getElementById('email-modal-message');
    if (!gs || !subIn || !fromIn || !msgIn) return;
    const recipient = 'shraoshibasak.9090@gmail.com';
    const sub = encodeURIComponent(subIn.value.trim());
    const body = encodeURIComponent(
      `From: ${fromIn.value.trim()}\n\n${msgIn.value.trim()}`
    );
    gs.href = `https://mail.google.com/mail/?view=cm&fs=1&to=${recipient}&su=${sub}&body=${body}`;
  }

  if (fromInput) fromInput.addEventListener('input', updateGmailShortcut);
  if (subjectInput) subjectInput.addEventListener('input', updateGmailShortcut);
  if (messageInput) messageInput.addEventListener('input', updateGmailShortcut);

  if (mailBtn) {
    mailBtn.addEventListener('click', window.openEmailModal);
  }

  if (closeBtn) closeBtn.addEventListener('click', window.closeEmailModal);
  if (cancelBtn) cancelBtn.addEventListener('click', window.closeEmailModal);

  if (overlay) {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        window.closeEmailModal();
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const ov = document.getElementById('email-modal-overlay');
      if (ov && ov.classList.contains('active')) {
        window.closeEmailModal();
      }
    }
  });

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      const fi = document.getElementById('email-modal-from');
      const si = document.getElementById('email-modal-subject');
      const mi = document.getElementById('email-modal-message');
      const st = document.getElementById('email-dialog-status');
      const sb = document.getElementById('email-modal-submit');

      const sender = fi ? fi.value.trim() : '';
      const subject = si ? si.value.trim() : '';
      const message = mi ? mi.value.trim() : '';

      if (!sender || !subject || !message) {
        if (st) {
          st.textContent = 'Please fill out all fields.';
          st.className = 'email-dialog-status error';
        }
        return;
      }

      if (sb) {
        sb.disabled = true;
        sb.innerHTML = '<span>Sending...</span> <i class="fas fa-spinner fa-spin" aria-hidden="true"></i>';
      }

      if (st) {
        st.textContent = 'Preparing secure dispatch...';
        st.className = 'email-dialog-status';
      }

      // Attempt dispatch via EmailJS if loaded, with fallback to mailto
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
            if (st) {
              st.textContent = 'Message delivered successfully! Thank you.';
              st.className = 'email-dialog-status success';
            }
            form.reset();
            setTimeout(window.closeEmailModal, 1600);
          })
          .catch(function (error) {
            console.warn('EmailJS dispatch failed, falling back to mail client:', error);
            const mailtoUrl = `mailto:shraoshibasak.9090@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent('From: ' + sender + '\n\n' + message)}`;
            window.location.href = mailtoUrl;
            if (st) {
              st.textContent = 'Opening your mail client...';
              st.className = 'email-dialog-status success';
            }
            setTimeout(window.closeEmailModal, 1600);
          })
          .finally(function () {
            if (sb) {
              sb.disabled = false;
              sb.innerHTML = '<span>Send</span> <i class="fas fa-paper-plane" aria-hidden="true"></i>';
            }
          });
      } else {
        const mailtoUrl = `mailto:shraoshibasak.9090@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent('From: ' + sender + '\n\n' + message)}`;
        window.location.href = mailtoUrl;
        if (st) {
          st.textContent = 'Opening your mail client...';
          st.className = 'email-dialog-status success';
        }
        if (sb) {
          sb.disabled = false;
          sb.innerHTML = '<span>Send</span> <i class="fas fa-paper-plane" aria-hidden="true"></i>';
        }
        setTimeout(window.closeEmailModal, 1600);
      }
    });
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initEmailDialogueModal);
} else {
  initEmailDialogueModal();
}


