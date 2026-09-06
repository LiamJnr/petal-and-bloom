/**
 * Petal & Bloom — Main Application Entrypoint
 * Coordinates modular architecture: Navigation, Router, Shop, Catalog, PDP, Reviews, Cart, Checkout, Toast
 */

import { initNavigation, setActiveNav } from "./modules/navigation.js";
import { 
  initRouter, 
  navigateToProduct, 
  navigateToHome, 
  navigateToShop, 
  navigateToCheckout,
  navigateToFAQ,
  navigateToContact,
  navigateToPrivacy,
  navigateToTerms,
  navigateToShipping
} from "./modules/router.js";
import { initCatalog } from "./modules/catalog.js";
import { initShop, renderShop, setShopSearchQuery, setShopCategory } from "./modules/shop.js";
import { initPDP, renderPDP } from "./modules/pdp.js";
import { initReviews } from "./modules/reviews.js";
import { initCart, addToCart, openCart } from "./modules/cart.js";
import { initWishlist, openWishlist } from "./modules/wishlist.js";
import { renderCheckoutPage } from "./modules/checkout.js";
import { renderOrderConfirmationPage } from "./modules/order-confirmation.js";
import { renderFAQPage, renderContactPage, renderPolicyPage } from "./modules/info-pages.js";
import { showToast } from "./modules/toast.js";
import { getProductBySlug } from "./data/products.js";
import { ICONS } from "./lib/icons.js";

document.addEventListener("DOMContentLoaded", () => {
  // 1. Initialize Shopping Cart & Storage
  initCart();

  // 2. Initialize Wishlist & Storage
  initWishlist({
    onProductClick: (slug) => {
      navigateToProduct(slug);
    },
    onAddToCart: (itemData) => {
      addToCart(itemData);
    },
    onExploreShop: () => {
      navigateToShop();
    }
  });

  // 2. Toast Notification Listener
  document.addEventListener("show-toast", (e) => {
    if (e.detail) {
      showToast(e.detail);
    }
  });

  // Helper for quick product addition from cards
  const handleQuickAdd = (slug) => {
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
  };

  // 3. Navigation & Search Interactions
  initNavigation({
    onNavigateHome: () => {
      navigateToHome();
    },
    onNavigateShop: (filters = {}) => {
      navigateToShop(filters);
    },
    onNavigateFAQ: (tab = "care") => {
      navigateToFAQ(tab);
    },
    onNavigateContact: () => {
      navigateToContact();
    },
    onNavigatePrivacy: () => {
      navigateToPrivacy();
    },
    onNavigateTerms: () => {
      navigateToTerms();
    },
    onNavigateShipping: () => {
      navigateToShipping();
    },
    onSearchChange: (query) => {
      const shopView = document.getElementById("shop-view");
      const isShopActive = shopView && shopView.style.display === "block";

      if (!isShopActive && query) {
        navigateToShop({ search: query });
      } else {
        setShopSearchQuery(query);
      }
    },
    onOpenCart: () => {
      openCart();
    },
    onOpenWishlist: () => {
      openWishlist();
    }
  });

  // 4. Curated Home Featured Catalog Grid
  initCatalog({
    onProductClick: (slug) => {
      navigateToProduct(slug);
    },
    onQuickAdd: (slug) => {
      handleQuickAdd(slug);
    },
    onExploreShop: () => {
      navigateToShop();
    }
  });

  // 5. Dedicated Full Catalog Shop Page
  initShop({
    onProductClick: (slug) => {
      navigateToProduct(slug);
    },
    onQuickAdd: (slug) => {
      handleQuickAdd(slug);
    }
  });

  // 6. Product Detail Page (PDP)
  initPDP({
    onAddToCart: (itemData) => {
      addToCart(itemData);
    }
  });

  // 7. Client Reviews & Testimonials System
  initReviews({
    onReviewAdded: (newReview) => {
      showToast({
        title: "Review Published!",
        message: `Thank you, ${newReview.author}! Your review has been added.`,
        icon: ICONS.write
      });
    }
  });

  // Helper to hide all views before switching
  const hideAllViews = () => {
    const homeView = document.getElementById("home-view");
    const shopView = document.getElementById("shop-view");
    const pdpView = document.getElementById("pdp-view");
    const checkoutView = document.getElementById("checkout-view");
    const confirmationView = document.getElementById("order-confirmation-view");
    const infoView = document.getElementById("info-view");

    if (homeView) homeView.style.display = "none";
    if (shopView) shopView.style.display = "none";
    if (pdpView) pdpView.style.display = "none";
    if (checkoutView) checkoutView.style.display = "none";
    if (confirmationView) confirmationView.style.display = "none";
    if (infoView) infoView.style.display = "none";
  };

  // 8. SPA Router & History
  initRouter({
    onRouteHome: () => {
      hideAllViews();
      const homeView = document.getElementById("home-view");
      if (homeView) homeView.style.display = "block";

      setActiveNav("home");
      document.title = "Petal & Bloom — Artisan Florist & Botanical Boutique";
    },
    onRouteShop: (filters = {}) => {
      hideAllViews();
      const shopView = document.getElementById("shop-view");
      if (shopView) shopView.style.display = "block";

      setActiveNav("shop");
      renderShop(filters);
      document.title = "Shop All Blooms & Floral Gifts — Petal & Bloom";
    },
    onRouteProduct: (slug) => {
      hideAllViews();
      setActiveNav("");
      renderPDP(slug);
    },
    onRouteCheckout: () => {
      hideAllViews();
      setActiveNav("");
      renderCheckoutPage();
    },
    onRouteOrderConfirmation: () => {
      hideAllViews();
      setActiveNav("");
      renderOrderConfirmationPage();
    },
    onRouteFAQ: (tab = "care") => {
      hideAllViews();
      const infoView = document.getElementById("info-view");
      if (infoView) infoView.style.display = "block";
      setActiveNav("faq");
      renderFAQPage(tab);
    },
    onRouteContact: () => {
      hideAllViews();
      const infoView = document.getElementById("info-view");
      if (infoView) infoView.style.display = "block";
      setActiveNav("contact");
      renderContactPage();
    },
    onRoutePolicy: (type = "privacy") => {
      hideAllViews();
      const infoView = document.getElementById("info-view");
      if (infoView) infoView.style.display = "block";
      setActiveNav("");
      renderPolicyPage(type);
    }
  });

  // Listen for custom PDP navigation event
  document.addEventListener("navigate-to-pdp", (e) => {
    if (e.detail?.slug) {
      navigateToProduct(e.detail.slug);
    }
  });

  // Listen for custom Shop navigation event
  document.addEventListener("navigate-to-shop", (e) => {
    navigateToShop(e.detail?.filters || {});
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

