/**
 * Petal & Bloom — SPA View Router & History Manager
 * Supports URL search params (?product=slug), clean hash routing, and browser back/forward buttons.
 */

let onRouteHomeCallback = null;
let onRouteProductCallback = null;

export function initRouter({ onRouteHome, onRouteProduct }) {
  onRouteHomeCallback = onRouteHome;
  onRouteProductCallback = onRouteProduct;

  // Listen for browser Back/Forward navigation
  window.addEventListener("popstate", () => {
    handleCurrentLocation();
  });

  // Intercept logo clicks or home links
  document.querySelectorAll("#nav-logo, .footer-brand a, a[href='#']").forEach(link => {
    link.addEventListener("click", (e) => {
      if (link.getAttribute("href") === "#" || link.id === "nav-logo") {
        e.preventDefault();
        navigateToHome();
      }
    });
  });

  // Initial route dispatch based on current URL
  handleCurrentLocation();
}

/**
 * Inspect the current URL to decide which view to render
 */
function handleCurrentLocation() {
  const params = new URLSearchParams(window.location.search);
  const productParam = params.get("product");

  // Also check hash #product/slug as fallback
  const hash = window.location.hash;
  let hashProduct = null;
  if (hash.startsWith("#product/")) {
    hashProduct = hash.replace("#product/", "").trim();
  }

  const slug = productParam || hashProduct;

  if (slug) {
    if (typeof onRouteProductCallback === "function") {
      onRouteProductCallback(slug);
    }
  } else {
    if (typeof onRouteHomeCallback === "function") {
      onRouteHomeCallback();
    }
  }
}

/**
 * Navigate to Product Detail Page (PDP)
 */
export function navigateToProduct(slug, replace = false) {
  const newUrl = new URL(window.location.href);
  newUrl.searchParams.set("product", slug);
  newUrl.hash = "";

  if (replace) {
    window.history.replaceState({ product: slug }, "", newUrl.toString());
  } else {
    window.history.pushState({ product: slug }, "", newUrl.toString());
  }

  if (typeof onRouteProductCallback === "function") {
    onRouteProductCallback(slug);
  }

  window.scrollTo({ top: 0, behavior: "smooth" });
}

/**
 * Navigate back to Home Storefront
 */
export function navigateToHome(replace = false) {
  const newUrl = new URL(window.location.href);
  newUrl.searchParams.delete("product");

  if (replace) {
    window.history.replaceState({}, "", newUrl.pathname);
  } else {
    window.history.pushState({}, "", newUrl.pathname);
  }

  if (typeof onRouteHomeCallback === "function") {
    onRouteHomeCallback();
  }

  window.scrollTo({ top: 0, behavior: "smooth" });
}
