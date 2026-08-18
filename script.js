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
