// Mobile navigation
const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");

menuToggle.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", isOpen);
});

document.querySelectorAll(".nav-links a").forEach(link => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
  });
});

// Product filtering
const filterButtons = document.querySelectorAll(".filter-btn");
const products = document.querySelectorAll(".product-card");

filterButtons.forEach(button => {
  button.addEventListener("click", () => {
    filterButtons.forEach(btn => btn.classList.remove("active"));
    button.classList.add("active");

    const filter = button.dataset.filter;

    products.forEach(product => {
      const category = product.dataset.category;
      product.classList.toggle(
        "hidden",
        filter !== "all" && category !== filter
      );
    });
  });
});

// Current year
document.getElementById("year").textContent = new Date().getFullYear();

// Prevent accidental placeholder checkout links.
// Replace href="#" on each Order button before going live.
document.querySelectorAll('a[href="#"]').forEach(link => {
  if (
    link.classList.contains("order-btn") ||
    link.classList.contains("button-light")
  ) {
    link.addEventListener("click", event => {
      if (link.getAttribute("href") === "#") {
        event.preventDefault();
        alert("Add your Lemon Squeezy checkout link to this product first.");
      }
    });
  }
});

// ── Lemon Squeezy Overlay Checkout ──────────────────────────
// Listen for checkout events from the lemon.js overlay.
// This is for UI feedback only — never use this for order fulfillment.
function setupLemonSqueezy() {
  if (typeof window.LemonSqueezy === "undefined") return;

  window.LemonSqueezy.Setup({
    eventHandler: (event) => {
      if (event.event === "Checkout.Success") {
        showCheckoutToast("Thank you! Your order is confirmed. 🌸");
      }
    },
  });
}

// Show a confirmation toast after a successful checkout.
function showCheckoutToast(message) {
  // Remove any existing toast first
  const existing = document.querySelector(".checkout-toast");
  if (existing) existing.remove();

  const toast = document.createElement("div");
  toast.className = "checkout-toast";
  toast.textContent = message;
  document.body.appendChild(toast);

  // Trigger entrance animation
  requestAnimationFrame(() => toast.classList.add("visible"));

  // Auto-dismiss after 5 seconds
  setTimeout(() => {
    toast.classList.remove("visible");
    toast.addEventListener("transitionend", () => toast.remove());
  }, 5000);
}

// Initialize once lemon.js has loaded (it uses defer, so it runs after DOM).
// We wait a tick to ensure the LemonSqueezy global is available.
if (document.readyState === "complete") {
  setupLemonSqueezy();
} else {
  window.addEventListener("load", setupLemonSqueezy);
}
