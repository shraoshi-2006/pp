// ======================================================
// THEME TOGGLE — FINAL CLEAN VERSION
// ======================================================

(function () {
  const toggleBtn = document.getElementById("theme-toggle");
  const root = document.documentElement;

  if (!toggleBtn) {
    console.error("❌ Theme toggle button not found");
    return;
  }

  const icon = toggleBtn.querySelector("i");

  // Load saved theme or default light
  const savedTheme = localStorage.getItem("theme") || "light";
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

    icon.className =
      theme === "dark" ? "fas fa-moon" : "fas fa-sun";
  }
})();
