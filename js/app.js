/**
 * Petal & Bloom — Main Application Entrypoint
 * Coordinates modular architecture: Navigation, Router, Catalog, PDP, Reviews, Cart, Checkout, Toast
 */

import { initNavigation } from "./modules/navigation.js";
import { initRouter, navigateToProduct, navigateToHome, navigateToCheckout } from "./modules/router.js";
import { initCatalog, setSearchQuery } from "./modules/catalog.js";
import { initPDP, renderPDP } from "./modules/pdp.js";
import { initReviews } from "./modules/reviews.js";
import { initCart, addToCart, openCart } from "./modules/cart.js";
import { renderCheckoutPage } from "./modules/checkout.js";
import { showToast } from "./modules/toast.js";
import { getProductBySlug } from "./data/products.js";

document.addEventListener("DOMContentLoaded", () => {
  // 1. Initialize Shopping Cart & Storage
  initCart();

  // 2. Toast Notification Listener
  document.addEventListener("show-toast", (e) => {
    if (e.detail) {
      showToast(e.detail);
    }
  });

  // 3. Navigation & Search Interactions
  initNavigation({
    onSearchChange: (query) => {
      setSearchQuery(query);
      const collectionSection = document.getElementById("collection");
      if (query && window.scrollY < 200) {
        collectionSection?.scrollIntoView({ behavior: "smooth" });
      }
    },
    onOpenCart: () => {
      openCart();
    }
  });

  // 4. Catalog Grid & Filtering
  initCatalog({
    onProductClick: (slug) => {
      navigateToProduct(slug);
    },
    onQuickAdd: (slug) => {
      const product = getProductBySlug(slug);
      if (product) {
        const itemData = {
          product,
          size: product.sizes.find(s => s.default) || product.sizes[0],
          vase: product.vases[0],
          giftMessage: "",
          deliveryDate: "",
          unitPrice: (product.sizes.find(s => s.default) || product.sizes[0]).price,
          quantity: 1
        };
        addToCart(itemData);
      }
    }
  });

  // 5. Product Detail Page (PDP)
  initPDP({
    onAddToCart: (itemData) => {
      addToCart(itemData);
    }
  });

  // 6. Client Reviews & Testimonials System
  initReviews({
    onReviewAdded: (newReview) => {
      showToast({
        title: "Review Published! 🌸",
        message: `Thank you, ${newReview.author}! Your review has been added.`,
        icon: "✍️"
      });
    }
  });

  // 7. SPA Router & History
  initRouter({
    onRouteHome: () => {
      const homeView = document.getElementById("home-view");
      const pdpView = document.getElementById("pdp-view");
      const checkoutView = document.getElementById("checkout-view");
      if (homeView) homeView.style.display = "block";
      if (pdpView) pdpView.style.display = "none";
      if (checkoutView) checkoutView.style.display = "none";
      document.title = "Petal & Bloom — Artisan Florist & Botanical Boutique";
    },
    onRouteProduct: (slug) => {
      const checkoutView = document.getElementById("checkout-view");
      if (checkoutView) checkoutView.style.display = "none";
      renderPDP(slug);
    },
    onRouteCheckout: () => {
      renderCheckoutPage();
    }
  });

  // Listen for custom PDP navigation event
  document.addEventListener("navigate-to-pdp", (e) => {
    if (e.detail?.slug) {
      navigateToProduct(e.detail.slug);
    }
  });

  // Listen for custom Checkout navigation event
  document.addEventListener("navigate-to-checkout", () => {
    navigateToCheckout();
  });

  // Birthday banner CTA buttons
  const birthdayTriggers = [
    document.getElementById("btn-view-birthday-bundle"),
    document.getElementById("event-showcase-trigger")
  ];
  birthdayTriggers.forEach(btn => {
    btn?.addEventListener("click", (e) => {
      const slug = e.currentTarget.dataset.slug || "birthday-bloom-box";
      navigateToProduct(slug);
    });
  });
});
