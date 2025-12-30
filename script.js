// JavaScript for functionality
document.addEventListener("DOMContentLoaded", function() {
  // Toggle mobile menu
  const toggle = document.querySelector(".toggle");
  const navMenu = document.querySelector(".nav-menu");
  
  if (toggle && navMenu) {
    toggle.addEventListener("click", function() {
      navMenu.classList.toggle("active");
      
      // Change icon
      const icon = this.querySelector("i");
      if (icon) {
        if (navMenu.classList.contains("active")) {
          icon.classList.remove("fa-bars");
          icon.classList.add("fa-times");
        } else {
          icon.classList.remove("fa-times");
          icon.classList.add("fa-bars");
        }
      }
    });
  }
  
  // Close menu when clicking on a link
  const navLinks = document.querySelectorAll(".nav-menu a");
  navLinks.forEach(link => {
    link.addEventListener("click", function() {
      navMenu.classList.remove("active");
      if (toggle) {
        const icon = toggle.querySelector("i");
        if (icon) {
          icon.classList.remove("fa-times");
          icon.classList.add("fa-bars");
        }
      }
    });
  });
  
  // Initialize Typed.js
  if (typeof Typed !== 'undefined') {
    new Typed("#element", {
  strings: [
    "Web Developer",
    "Cyber Security Enthusiast"
  ],
  typeSpeed: 50,
  backSpeed: 30,
  backDelay: 1500,
  loop: true
});

  }
  
  // Theme toggle functionality
  const themeToggle = document.getElementById("themeToggle");
  const themeIcon = themeToggle.querySelector("i");
  
  // Check for saved theme preference or respect OS preference
  const savedTheme = localStorage.getItem("theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  
  if (savedTheme === "light" || (!savedTheme && !prefersDark)) {
    document.body.classList.add("light-mode");
    themeIcon.classList.remove("fa-moon");
    themeIcon.classList.add("fa-sun");
  }
  
  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("light-mode");
    
    if (document.body.classList.contains("light-mode")) {
      themeIcon.classList.remove("fa-moon");
      themeIcon.classList.add("fa-sun");
      localStorage.setItem("theme", "light");
    } else {
      themeIcon.classList.remove("fa-sun");
      themeIcon.classList.add("fa-moon");
      localStorage.setItem("theme", "dark");
    }
  });
  
  // Scroll to top functionality
  const scrollToTopBtn = document.getElementById("scrollToTop");
  
  window.addEventListener("scroll", () => {
    if (window.pageYOffset > 300) {
      scrollToTopBtn.classList.add("show");
    } else {
      scrollToTopBtn.classList.remove("show");
    }
  });
  
  scrollToTopBtn.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  });
  
  // Reveal animations
  function reveal() {
    const reveals = document.querySelectorAll(".reveal");
    const timelineItems = document.querySelectorAll(".timeline-item");
    
    reveals.forEach(el => {
      const windowHeight = window.innerHeight;
      const elementTop = el.getBoundingClientRect().top;
      const elementVisible = 150;
      
      if (elementTop < windowHeight - elementVisible) {
        el.classList.add("active");
      }
    });
    
    timelineItems.forEach((el, index) => {
      const windowHeight = window.innerHeight;
      const elementTop = el.getBoundingClientRect().top;
      const elementVisible = 150;
      
      if (elementTop < windowHeight - elementVisible) {
        setTimeout(() => {
          el.classList.add("show");
        }, index * 200);
      }
    });
  }
  
  window.addEventListener("scroll", reveal);
  reveal(); // Initial call
});
