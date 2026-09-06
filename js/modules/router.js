/**
 * Petal & Bloom — SPA View Router & History Manager
 * Supports URL search params (?product=slug, ?view=shop, ?view=checkout), clean hash routing, and browser back/forward buttons.
 */

let onRouteHomeCallback = null;
let onRouteShopCallback = null;
let onRouteProductCallback = null;
let onRouteCheckoutCallback = null;
let onRouteOrderConfirmationCallback = null;
let onRouteFAQCallback = null;
let onRouteContactCallback = null;
let onRoutePolicyCallback = null;

export function initRouter({ 
  onRouteHome, 
  onRouteShop, 
  onRouteProduct, 
  onRouteCheckout, 
  onRouteOrderConfirmation,
  onRouteFAQ,
  onRouteContact,
  onRoutePolicy
}) {
  onRouteHomeCallback = onRouteHome;
  onRouteShopCallback = onRouteShop;
  onRouteProductCallback = onRouteProduct;
  onRouteCheckoutCallback = onRouteCheckout;
  onRouteOrderConfirmationCallback = onRouteOrderConfirmation;
  onRouteFAQCallback = onRouteFAQ;
  onRouteContactCallback = onRouteContact;
  onRoutePolicyCallback = onRoutePolicy;

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

  if (viewParam === "faq" || hash === "#faq" || hash === "#care" || hash === "#delivery") {
    if (typeof onRouteFAQCallback === "function") {
      const tab = params.get("tab") || (hash.replace("#", "") === "delivery" ? "delivery" : "care");
      onRouteFAQCallback(tab);
    }
    return;
  }

  if (viewParam === "contact" || hash === "#contact") {
    if (typeof onRouteContactCallback === "function") {
      onRouteContactCallback();
    }
    return;
  }

  if (viewParam === "privacy" || viewParam === "terms" || viewParam === "shipping" || hash === "#privacy" || hash === "#terms" || hash === "#shipping") {
    if (typeof onRoutePolicyCallback === "function") {
      const policyType = viewParam || hash.replace("#", "");
      onRoutePolicyCallback(policyType);
    }
    return;
  }

  if (viewParam === "checkout" || hash === "#checkout") {
    if (typeof onRouteCheckoutCallback === "function") {
      onRouteCheckoutCallback();
    }
    return;
  }

  if (viewParam === "order-confirmed" || window.location.pathname === "/order-confirmed") {
    if (typeof onRouteOrderConfirmationCallback === "function") {
      onRouteOrderConfirmationCallback();
    }
    return;
  }

  if (viewParam === "shop" || hash === "#shop" || hash.startsWith("#shop/")) {
    if (typeof onRouteShopCallback === "function") {
      onRouteShopCallback({
        category: params.get("category") || "",
        search: params.get("search") || "",
        occasion: params.get("occasion") || "",
        sort: params.get("sort") || ""
      });
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
 * Navigate to Dedicated Shop Catalog Page
 */
export function navigateToShop(filters = {}, replace = false) {
  const newUrl = new URL(window.location.href);
  newUrl.searchParams.delete("product");
  newUrl.searchParams.delete("order");
  newUrl.searchParams.set("view", "shop");

  if (filters.category) newUrl.searchParams.set("category", filters.category);
  else newUrl.searchParams.delete("category");

  if (filters.search) newUrl.searchParams.set("search", filters.search);
  else newUrl.searchParams.delete("search");

  if (filters.occasion) newUrl.searchParams.set("occasion", filters.occasion);
  else newUrl.searchParams.delete("occasion");

  if (filters.sort) newUrl.searchParams.set("sort", filters.sort);
  else newUrl.searchParams.delete("sort");

  newUrl.hash = "";

  if (replace) {
    window.history.replaceState({ view: "shop", filters }, "", newUrl.toString());
  } else {
    window.history.pushState({ view: "shop", filters }, "", newUrl.toString());
  }

  if (typeof onRouteShopCallback === "function") {
    onRouteShopCallback(filters);
  }

  window.scrollTo({ top: 0, behavior: "smooth" });
}

/**
 * Navigate to Product Detail Page (PDP)
 */
export function navigateToProduct(slug, replace = false) {
  const newUrl = new URL(window.location.href);
  newUrl.searchParams.delete("view");
  newUrl.searchParams.delete("order");
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
  newUrl.searchParams.delete("order");
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
  newUrl.pathname = "/";
  newUrl.searchParams.delete("product");
  newUrl.searchParams.delete("view");
  newUrl.searchParams.delete("order");
  newUrl.searchParams.delete("category");
  newUrl.searchParams.delete("search");
  newUrl.searchParams.delete("occasion");
  newUrl.searchParams.delete("sort");

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

/**
 * Navigate to Customer Care & FAQs Page
 */
export function navigateToFAQ(tab = "care", replace = false) {
  const newUrl = new URL(window.location.href);
  newUrl.searchParams.delete("product");
  newUrl.searchParams.delete("order");
  newUrl.searchParams.set("view", "faq");
  if (tab) newUrl.searchParams.set("tab", tab);
  else newUrl.searchParams.delete("tab");
  newUrl.hash = "";

  if (replace) {
    window.history.replaceState({ view: "faq", tab }, "", newUrl.toString());
  } else {
    window.history.pushState({ view: "faq", tab }, "", newUrl.toString());
  }

  if (typeof onRouteFAQCallback === "function") {
    onRouteFAQCallback(tab);
  }

  window.scrollTo({ top: 0, behavior: "smooth" });
}

/**
 * Navigate to Contact Page
 */
export function navigateToContact(replace = false) {
  const newUrl = new URL(window.location.href);
  newUrl.searchParams.delete("product");
  newUrl.searchParams.delete("order");
  newUrl.searchParams.delete("tab");
  newUrl.searchParams.set("view", "contact");
  newUrl.hash = "";

  if (replace) {
    window.history.replaceState({ view: "contact" }, "", newUrl.toString());
  } else {
    window.history.pushState({ view: "contact" }, "", newUrl.toString());
  }

  if (typeof onRouteContactCallback === "function") {
    onRouteContactCallback();
  }

  window.scrollTo({ top: 0, behavior: "smooth" });
}

/**
 * Navigate to Privacy Policy Page
 */
export function navigateToPrivacy(replace = false) {
  const newUrl = new URL(window.location.href);
  newUrl.searchParams.delete("product");
  newUrl.searchParams.delete("order");
  newUrl.searchParams.delete("tab");
  newUrl.searchParams.set("view", "privacy");
  newUrl.hash = "";

  if (replace) {
    window.history.replaceState({ view: "privacy" }, "", newUrl.toString());
  } else {
    window.history.pushState({ view: "privacy" }, "", newUrl.toString());
  }

  if (typeof onRoutePolicyCallback === "function") {
    onRoutePolicyCallback("privacy");
  }

  window.scrollTo({ top: 0, behavior: "smooth" });
}

/**
 * Navigate to Terms of Service Page
 */
export function navigateToTerms(replace = false) {
  const newUrl = new URL(window.location.href);
  newUrl.searchParams.delete("product");
  newUrl.searchParams.delete("order");
  newUrl.searchParams.delete("tab");
  newUrl.searchParams.set("view", "terms");
  newUrl.hash = "";

  if (replace) {
    window.history.replaceState({ view: "terms" }, "", newUrl.toString());
  } else {
    window.history.pushState({ view: "terms" }, "", newUrl.toString());
  }

  if (typeof onRoutePolicyCallback === "function") {
    onRoutePolicyCallback("terms");
  }

  window.scrollTo({ top: 0, behavior: "smooth" });
}

/**
 * Navigate to Shipping & Returns Policy Page
 */
export function navigateToShipping(replace = false) {
  const newUrl = new URL(window.location.href);
  newUrl.searchParams.delete("product");
  newUrl.searchParams.delete("order");
  newUrl.searchParams.delete("tab");
  newUrl.searchParams.set("view", "shipping");
  newUrl.hash = "";

  if (replace) {
    window.history.replaceState({ view: "shipping" }, "", newUrl.toString());
  } else {
    window.history.pushState({ view: "shipping" }, "", newUrl.toString());
  }

  if (typeof onRoutePolicyCallback === "function") {
    onRoutePolicyCallback("shipping");
  }

  window.scrollTo({ top: 0, behavior: "smooth" });
}

