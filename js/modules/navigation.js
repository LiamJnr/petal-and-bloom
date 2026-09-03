/**
 * Navigation & Header Interaction Module
 */

export function initNavigation({ onSearchChange, onOpenCart }) {
  const header = document.querySelector(".site-header");
  const menuToggle = document.querySelector(".menu-toggle");
  const navLinks = document.querySelector(".nav-links");
  const searchToggleBtn = document.querySelector(".search-toggle-btn");
  const searchWrapper = document.querySelector(".search-input-wrapper");
  const searchInput = document.querySelector(".search-input");
  const searchClearBtn = document.querySelector(".search-clear-btn");
  const cartTrigger = document.querySelector(".cart-trigger");

  // Sticky header on scroll
  window.addEventListener("scroll", () => {
    if (window.scrollY > 20) {
      header?.classList.add("scrolled");
    } else {
      header?.classList.remove("scrolled");
    }
  }, { passive: true });

  // Mobile menu toggle
  menuToggle?.addEventListener("click", () => {
    const isOpen = navLinks?.classList.toggle("open");
    menuToggle.classList.toggle("open", isOpen);
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  // Close mobile menu on clicking any link
  navLinks?.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("open");
      menuToggle?.classList.remove("open");
      menuToggle?.setAttribute("aria-expanded", "false");
    });
  });

  // Search Bar Expand / Collapse
  searchToggleBtn?.addEventListener("click", (e) => {
    e.stopPropagation();
    const isOpen = searchWrapper?.classList.toggle("open");
    if (isOpen) {
      searchInput?.focus();
    }
  });

  // Close search when clicking outside
  document.addEventListener("click", (e) => {
    if (!searchWrapper?.contains(e.target) && !searchToggleBtn?.contains(e.target)) {
      searchWrapper?.classList.remove("open");
    }
  });

  // Search input change handler with debounce
  let debounceTimer;
  searchInput?.addEventListener("input", (e) => {
    const query = e.target.value.trim();
    if (searchClearBtn) {
      searchClearBtn.classList.toggle("visible", query.length > 0);
    }
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      if (typeof onSearchChange === "function") {
        onSearchChange(query);
      }
    }, 200);
  });

  // Search clear button
  searchClearBtn?.addEventListener("click", () => {
    if (searchInput) {
      searchInput.value = "";
      searchClearBtn.classList.remove("visible");
      if (typeof onSearchChange === "function") {
        onSearchChange("");
      }
      searchInput.focus();
    }
  });

  // Cart trigger click
  cartTrigger?.addEventListener("click", (e) => {
    e.preventDefault();
    if (typeof onOpenCart === "function") {
      onOpenCart();
    }
  });

  // Dynamic copyright year
  const yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}
