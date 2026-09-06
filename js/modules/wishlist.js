/**
 * Petal & Bloom — Wishlist State & Drawer Module
 * Persistent favorites stored in localStorage with full slide-out drawer, badge count, and quick-add actions.
 */

import { showToast } from "./toast.js";
import { getProductBySlug } from "../data/products.js";
import { ICONS } from "../lib/icons.js";

const STORAGE_KEY = "petal_bloom_wishlist_v1";

let wishlist = [];
let productClickHandler = null;
let addToCartHandler = null;
let exploreShopHandler = null;

export function initWishlist({ onProductClick, onAddToCart, onExploreShop }) {
  productClickHandler = onProductClick;
  addToCartHandler = onAddToCart;
  exploreShopHandler = onExploreShop;

  loadWishlistFromStorage();
  createWishlistDrawerDOM();
  bindWishlistDrawerEvents();
  updateWishlistUI();
}

/**
 * Load saved wishlist from localStorage
 */
function loadWishlistFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    wishlist = raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.error("Failed to parse wishlist from storage:", err);
    wishlist = [];
  }
}

/**
 * Save current wishlist to localStorage
 */
function saveWishlistToStorage() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(wishlist));
  } catch (err) {
    console.error("Failed to save wishlist to storage:", err);
  }
}

/**
 * Check if a product slug is already in the wishlist
 */
export function isInWishlist(slug) {
  return wishlist.some(item => item.slug === slug);
}

/**
 * Toggle product in wishlist (Add if not present, remove if present)
 */
export function toggleWishlist(product) {
  if (!product) return false;

  const exists = isInWishlist(product.slug);
  if (exists) {
    wishlist = wishlist.filter(item => item.slug !== product.slug);
    saveWishlistToStorage();
    updateWishlistUI();
    updatePDPWishlistButton(product.slug, false);
    return false;
  } else {
    const minPrice = Math.min(...product.sizes.map(s => s.price));
    wishlist.push({
      slug: product.slug,
      name: product.name,
      category: product.category,
      occasion: product.occasion,
      price: minPrice,
      image: product.images.primary,
      rating: product.rating,
      addedAt: new Date().toISOString()
    });
    saveWishlistToStorage();
    updateWishlistUI();
    updatePDPWishlistButton(product.slug, true);
    showToast({
      title: "Saved to Wishlist!",
      message: `${product.name} has been added to your favorites.`,
      icon: ICONS.heart
    });
    return true;
  }
}

/**
 * Remove an item from wishlist
 */
export function removeFromWishlist(slug) {
  wishlist = wishlist.filter(item => item.slug !== slug);
  saveWishlistToStorage();
  updateWishlistUI();
  updatePDPWishlistButton(slug, false);
}

/**
 * Update the PDP heart button if currently visible
 */
function updatePDPWishlistButton(slug, isSaved) {
  const pdpWishlistBtn = document.getElementById("btn-pdp-wishlist");
  if (pdpWishlistBtn) {
    pdpWishlistBtn.classList.toggle("active", isSaved);
    pdpWishlistBtn.setAttribute("title", isSaved ? "Remove from wishlist" : "Add to wishlist");
    pdpWishlistBtn.setAttribute("aria-label", isSaved ? "Remove from wishlist" : "Add to wishlist");
    
    // Update SVG fill
    const svgPath = pdpWishlistBtn.querySelector("path");
    if (svgPath) {
      if (isSaved) {
        svgPath.setAttribute("fill", "currentColor");
      } else {
        svgPath.setAttribute("fill", "none");
      }
    }
  }
}

/**
 * Clear the entire wishlist
 */
export function clearWishlist() {
  wishlist = [];
  saveWishlistToStorage();
  updateWishlistUI();
  updatePDPWishlistButton(null, false);
}

/**
 * Open the Wishlist Drawer
 */
export function openWishlist() {
  const backdrop = document.getElementById("wishlist-backdrop");
  const drawer = document.getElementById("wishlist-drawer-aside");
  if (backdrop && drawer) {
    backdrop.classList.add("open");
    drawer.classList.add("open");
    document.body.style.overflow = "hidden";
  }
}

/**
 * Close the Wishlist Drawer
 */
export function closeWishlist() {
  const backdrop = document.getElementById("wishlist-backdrop");
  const drawer = document.getElementById("wishlist-drawer-aside");
  if (backdrop && drawer) {
    backdrop.classList.remove("open");
    drawer.classList.remove("open");
    document.body.style.overflow = "";
  }
}

/**
 * Create Wishlist Drawer DOM containers if not present in HTML
 */
function createWishlistDrawerDOM() {
  if (document.getElementById("wishlist-drawer-aside")) return;

  const backdrop = document.createElement("div");
  backdrop.id = "wishlist-backdrop";
  backdrop.className = "cart-backdrop";
  backdrop.setAttribute("aria-hidden", "true");

  const drawer = document.createElement("aside");
  drawer.id = "wishlist-drawer-aside";
  drawer.className = "wishlist-drawer";
  drawer.setAttribute("role", "dialog");
  drawer.setAttribute("aria-label", "Your Wishlist");
  drawer.innerHTML = `
    <div class="wishlist-drawer-header">
      <div class="wishlist-drawer-title-row">
        <h3>My Wishlist</h3>
        <span class="wishlist-header-count" id="wishlist-header-count">0 items</span>
      </div>
      <button type="button" class="wishlist-drawer-close" id="btn-close-wishlist" aria-label="Close wishlist">&times;</button>
    </div>

    <div class="wishlist-drawer-body" id="wishlist-items-body">
      <!-- Items populated via updateWishlistUI() -->
    </div>

    <div class="wishlist-drawer-footer" id="wishlist-drawer-footer">
      <button type="button" class="btn-wishlist-add-all" id="btn-wishlist-add-all">
        Move All to Bag ${ICONS.bag}
      </button>
    </div>
  `;

  document.body.appendChild(backdrop);
  document.body.appendChild(drawer);
}

/**
 * Bind interactive events on the Wishlist Drawer
 */
function bindWishlistDrawerEvents() {
  const backdrop = document.getElementById("wishlist-backdrop");
  const closeBtn = document.getElementById("btn-close-wishlist");
  const drawer = document.getElementById("wishlist-drawer-aside");
  const addAllBtn = document.getElementById("btn-wishlist-add-all");

  backdrop?.addEventListener("click", closeWishlist);
  closeBtn?.addEventListener("click", closeWishlist);

  // Keyboard Escape key closes drawer
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && drawer?.classList.contains("open")) {
      closeWishlist();
    }
  });

  // Move All to Bag -> Transfers all items to Cart & clears wishlist
  addAllBtn?.addEventListener("click", () => {
    if (wishlist.length === 0) return;

    wishlist.forEach(item => {
      const fullProduct = getProductBySlug(item.slug);
      if (fullProduct && typeof addToCartHandler === "function") {
        const itemData = {
          product: fullProduct,
          size: fullProduct.sizes.find(s => s.default) || fullProduct.sizes[0],
          vase: fullProduct.vases[0],
          giftMessage: "",
          deliveryDate: "",
          unitPrice: (fullProduct.sizes.find(s => s.default) || fullProduct.sizes[0]).price,
          quantity: 1
        };
        addToCartHandler(itemData);
      }
    });

    clearWishlist();
    closeWishlist();
  });

  // Delegated clicks inside wishlist items body
  const body = document.getElementById("wishlist-items-body");
  body?.addEventListener("click", (e) => {
    // 1. Remove button
    const removeBtn = e.target.closest(".btn-wishlist-item-remove");
    if (removeBtn) {
      e.stopPropagation();
      const slug = removeBtn.dataset.slug;
      if (slug) removeFromWishlist(slug);
      return;
    }

    // 2. Add to bag button -> Adds to Cart & removes from Wishlist
    const addBagBtn = e.target.closest(".btn-wishlist-item-add");
    if (addBagBtn) {
      e.stopPropagation();
      const slug = addBagBtn.dataset.slug;
      const fullProduct = getProductBySlug(slug);
      if (fullProduct && typeof addToCartHandler === "function") {
        const itemData = {
          product: fullProduct,
          size: fullProduct.sizes.find(s => s.default) || fullProduct.sizes[0],
          vase: fullProduct.vases[0],
          giftMessage: "",
          deliveryDate: "",
          unitPrice: (fullProduct.sizes.find(s => s.default) || fullProduct.sizes[0]).price,
          quantity: 1
        };
        addToCartHandler(itemData);
        removeFromWishlist(slug);
      }
      return;
    }

    // 3. Card click -> Navigate to PDP
    const card = e.target.closest(".wishlist-item-card");
    if (card) {
      const slug = card.dataset.slug;
      if (slug && typeof productClickHandler === "function") {
        closeWishlist();
        productClickHandler(slug);
      }
    }
  });
}

/**
 * Synchronize UI elements (header count badge & drawer contents)
 */
export function updateWishlistUI() {
  const badge = document.getElementById("wishlist-badge");
  const headerCount = document.getElementById("wishlist-header-count");
  const body = document.getElementById("wishlist-items-body");
  const footer = document.getElementById("wishlist-drawer-footer");

  const count = wishlist.length;

  // Header Badge
  if (badge) {
    badge.textContent = count;
    badge.style.display = count > 0 ? "flex" : "none";
  }

  // Header count in drawer
  if (headerCount) {
    headerCount.textContent = `${count} item${count === 1 ? "" : "s"}`;
  }

  // Footer visibility
  if (footer) {
    footer.style.display = count > 0 ? "block" : "none";
  }

  // Body content
  if (!body) return;

  if (count === 0) {
    body.innerHTML = `
      <div class="wishlist-empty-state">
        <div class="wishlist-empty-icon">${ICONS.heart}</div>
        <h4>Your Wishlist is Empty</h4>
        <p>Save your favorite floral arrangements and gifts here to easily browse or order later.</p>
        <button type="button" class="button button-dark" id="btn-wishlist-explore">
          Explore All Flowers
        </button>
      </div>
    `;

    body.querySelector("#btn-wishlist-explore")?.addEventListener("click", () => {
      closeWishlist();
      if (typeof exploreShopHandler === "function") {
        exploreShopHandler();
      }
    });
    return;
  }

  body.innerHTML = wishlist.map(item => `
    <article class="wishlist-item-card" data-slug="${item.slug}">
      <div class="wishlist-item-thumb">
        <img src="${item.image}" alt="${item.name}" loading="lazy" />
      </div>

      <div class="wishlist-item-info">
        <span class="wishlist-item-category">${item.category} • ${item.occasion}</span>
        <h4 class="wishlist-item-name">${item.name}</h4>
        <div class="wishlist-item-price">Starting from <strong>$${item.price}</strong></div>
        
        <div class="wishlist-item-actions">
          <button type="button" class="btn-wishlist-item-add" data-slug="${item.slug}">
            + Add to Bag
          </button>
          <button type="button" class="btn-wishlist-item-remove" data-slug="${item.slug}" aria-label="Remove from wishlist" title="Remove">
            &times;
          </button>
        </div>
      </div>
    </article>
  `).join("");
}
