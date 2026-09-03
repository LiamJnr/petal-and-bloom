/**
 * Petal & Bloom — SPA View Router & History Manager
 * Supports URL search params (?product=slug, ?view=checkout), clean hash routing, and browser back/forward buttons.
 */

let onRouteHomeCallback = null;
let onRouteProductCallback = null;
let onRouteCheckoutCallback = null;

export function initRouter({ onRouteHome, onRouteProduct, onRouteCheckout }) {
  onRouteHomeCallback = onRouteHome;
  onRouteProductCallback = onRouteProduct;
  onRouteCheckoutCallback = onRouteCheckout;

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
  const viewParam = params.get("view");
  const productParam = params.get("product");

  // Also check hash fallbacks
  const hash = window.location.hash;
  let hashProduct = null;
  if (hash.startsWith("#product/")) {
    hashProduct = hash.replace("#product/", "").trim();
  }

  if (viewParam === "checkout" || hash === "#checkout") {
    if (typeof onRouteCheckoutCallback === "function") {
      onRouteCheckoutCallback();
    }
    return;
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
  newUrl.searchParams.delete("view");
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
 * Navigate to Order & Recipient Checkout Details Page
 */
export function navigateToCheckout(replace = false) {
  const newUrl = new URL(window.location.href);
  newUrl.searchParams.delete("product");
  newUrl.searchParams.set("view", "checkout");
  newUrl.hash = "";

  if (replace) {
    window.history.replaceState({ view: "checkout" }, "", newUrl.toString());
  } else {
    window.history.pushState({ view: "checkout" }, "", newUrl.toString());
  }

  if (typeof onRouteCheckoutCallback === "function") {
    onRouteCheckoutCallback();
  }

  window.scrollTo({ top: 0, behavior: "smooth" });
}

/**
 * Navigate back to Home Storefront
 */
export function navigateToHome(replace = false) {
  const newUrl = new URL(window.location.href);
  newUrl.searchParams.delete("product");
  newUrl.searchParams.delete("view");

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
