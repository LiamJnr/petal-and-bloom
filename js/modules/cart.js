/**
 * Cart State Management & Slide-over Drawer Module
 * Includes persistent localStorage, free shipping meter, auto-syncing images, and Lemon Squeezy integration.
 */
import { showToast } from "./toast.js";
import { getProductBySlug } from "../data/products.js";

const CART_STORAGE_KEY = "petal_bloom_cart";
const FREE_SHIPPING_THRESHOLD = 75;

let cartItems = [];

/**
 * Initialize Cart Module
 */
export function initCart() {
  loadCartFromStorage();
  renderCartDrawerMarkup();
  bindCartEvents();
  updateCartUI();
  setupLemonSqueezyOverlay();
}

/**
 * Load cart from localStorage and sanitize product images with live catalog
 */
function loadCartFromStorage() {
  try {
    const data = localStorage.getItem(CART_STORAGE_KEY);
    cartItems = data ? JSON.parse(data) : [];

    // Automatically heal/sync images and names with live catalog
    let hasChanges = false;
    cartItems = cartItems.map(item => {
      const liveProduct = getProductBySlug(item.slug);
      if (liveProduct) {
        if (item.image !== liveProduct.images.primary || item.name !== liveProduct.name) {
          hasChanges = true;
          return {
            ...item,
            name: liveProduct.name,
            image: liveProduct.images.primary,
            checkoutUrl: liveProduct.checkoutUrls?.[item.size?.id] || liveProduct.checkoutUrls?.standard || item.checkoutUrl
          };
        }
      }
      return item;
    });

    if (hasChanges) {
      saveCartToStorage();
    }
  } catch {
    cartItems = [];
  }
}

/**
 * Persist cart state to localStorage
 */
function saveCartToStorage() {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
  } catch (err) {
    console.error("Failed to save cart to storage", err);
  }
}

/**
 * Add an item or increment quantity
 */
export function addToCart(itemData) {
  const { product, size, vase, giftMessage = "", deliveryDate = "", unitPrice, quantity = 1 } = itemData;

  const itemId = `${product.slug}_${size.id}_${vase.id}_${encodeURIComponent(giftMessage.slice(0, 10))}`;

  const existing = cartItems.find(item => item.id === itemId);

  if (existing) {
    existing.quantity += quantity;
  } else {
    cartItems.push({
      id: itemId,
      slug: product.slug,
      name: product.name,
      image: product.images.primary,
      size: { ...size },
      vase: { ...vase },
      giftMessage,
      deliveryDate,
      unitPrice,
      checkoutUrl: product.checkoutUrls?.[size.id] || product.checkoutUrls?.standard || Object.values(product.checkoutUrls || {})[0],
      quantity
    });
  }

  saveCartToStorage();
  updateCartUI();

  showToast({
    title: "Added to Flower Bag! 🌸",
    message: `${product.name} (${size.name}) is ready in your bag.`,
    icon: "🛍️"
  });
}

/**
 * Remove an item completely
 */
export function removeFromCart(itemId) {
  const item = cartItems.find(i => i.id === itemId);
  cartItems = cartItems.filter(i => i.id !== itemId);
  saveCartToStorage();
  updateCartUI();

  if (item) {
    showToast({
      title: "Item Removed",
      message: `${item.name} was removed from your bag.`,
      icon: "🗑️"
    });
  }
}

/**
 * Update quantity (+1 or -1)
 */
export function updateQuantity(itemId, delta) {
  const item = cartItems.find(i => i.id === itemId);
  if (!item) return;

  const newQty = item.quantity + delta;
  if (newQty <= 0) {
    removeFromCart(itemId);
  } else {
    item.quantity = newQty;
    saveCartToStorage();
    updateCartUI();
  }
}

/**
 * Open the Cart Drawer
 */
export function openCart() {
  const backdrop = document.getElementById("cart-backdrop");
  const drawer = document.getElementById("cart-drawer-aside");
  if (backdrop) {
    backdrop.classList.add("open");
    backdrop.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }
  if (drawer) {
    drawer.classList.add("open");
  }
}

/**
 * Close the Cart Drawer
 */
export function closeCart() {
  const backdrop = document.getElementById("cart-backdrop");
  const drawer = document.getElementById("cart-drawer-aside");
  if (backdrop) {
    backdrop.classList.remove("open");
    backdrop.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }
  if (drawer) {
    drawer.classList.remove("open");
  }
}

/**
 * Calculate Subtotal & Total
 */
export function getCartSubtotal() {
  return cartItems.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0);
}

export function getTotalItemCount() {
  return cartItems.reduce((acc, item) => acc + item.quantity, 0);
}

/**
 * Render the Cart Drawer HTML structure
 */
function renderCartDrawerMarkup() {
  const backdrop = document.getElementById("cart-backdrop");
  if (!backdrop) return;
  if (document.getElementById("cart-drawer-aside")) return; // already rendered

  backdrop.innerHTML = `
    <aside id="cart-drawer-aside" class="cart-drawer" role="dialog" aria-labelledby="cart-drawer-title" aria-modal="true">
      
      <!-- Header -->
      <div class="cart-header">
        <div class="cart-header-title">
          <h3 id="cart-drawer-title">Shopping Bag</h3>
          <span class="cart-drawer-badge" id="cart-drawer-badge">0 items</span>
        </div>
        <button type="button" class="cart-close-btn" id="btn-close-cart" aria-label="Close bag">&times;</button>
      </div>

      <!-- Free Delivery Progress Meter -->
      <div class="cart-shipping-meter">
        <p class="shipping-meter-text" id="shipping-meter-text">
          Add <strong>$75.00</strong> more for <strong>FREE Local Delivery</strong>
        </p>
        <div class="shipping-meter-track">
          <div class="shipping-meter-fill" id="shipping-meter-fill" style="width: 0%"></div>
        </div>
      </div>

      <!-- Cart Items List Container -->
      <div class="cart-body" id="cart-items-container">
        <!-- Populated dynamically -->
      </div>

      <!-- Cart Footer & Checkout -->
      <div class="cart-footer" id="cart-footer">
        <div class="cart-summary-row">
          <span>Subtotal</span>
          <span id="cart-subtotal-val">$0.00</span>
        </div>
        <div class="cart-summary-row">
          <span>Local Florist Delivery</span>
          <span class="badge-included-cart" id="cart-delivery-val">Complimentary</span>
        </div>
        <div class="cart-total-row">
          <span>Total:</span>
          <strong id="cart-total-val">$0.00</strong>
        </div>

        <button
          type="button"
          class="button button-dark cart-checkout-btn"
          id="btn-cart-checkout"
        >
          Process Order &rarr;
        </button>
      </div>

    </aside>
  `;
}

/**
 * Bind Drawer open/close and body clicks
 */
function bindCartEvents() {
  const backdrop = document.getElementById("cart-backdrop");
  const closeBtn = document.getElementById("btn-close-cart");

  closeBtn?.addEventListener("click", closeCart);

  // Close when clicking outside drawer
  backdrop?.addEventListener("click", (e) => {
    if (e.target === backdrop) {
      closeCart();
    }
  });

  // Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && backdrop?.classList.contains("open")) {
      closeCart();
    }
  });

  // Proceed to Checkout button -> Opens Order Details Page
  const checkoutBtn = document.getElementById("btn-cart-checkout");
  checkoutBtn?.addEventListener("click", (e) => {
    e.preventDefault();
    closeCart();
    const event = new CustomEvent("navigate-to-checkout");
    document.dispatchEvent(event);
  });

  // Cart body delegation for steppers & remove buttons
  const body = document.getElementById("cart-items-container");
  body?.addEventListener("click", (e) => {
    const itemEl = e.target.closest(".cart-item");
    if (!itemEl) return;

    const itemId = itemEl.dataset.itemId;
    if (!itemId) return;

    if (e.target.closest(".btn-stepper-minus")) {
      updateQuantity(itemId, -1);
    } else if (e.target.closest(".btn-stepper-plus")) {
      updateQuantity(itemId, 1);
    } else if (e.target.closest(".cart-item-remove-btn")) {
      removeFromCart(itemId);
    }
  });

  // Global custom events
  document.addEventListener("open-cart", openCart);
  document.addEventListener("add-to-cart", (e) => {
    if (e.detail) {
      addToCart(e.detail);
    }
  });
}

/**
 * Synchronize UI with current cart state
 */
export function updateCartUI() {
  const container = document.getElementById("cart-items-container");
  const footer = document.getElementById("cart-footer");
  const badge = document.getElementById("cart-badge");
  const drawerBadge = document.getElementById("cart-drawer-badge");
  const subtotalEl = document.getElementById("cart-subtotal-val");
  const totalEl = document.getElementById("cart-total-val");
  const shippingText = document.getElementById("shipping-meter-text");
  const shippingFill = document.getElementById("shipping-meter-fill");

  const totalCount = getTotalItemCount();
  const subtotal = getCartSubtotal();

  // 1. Update Navbar Badge
  if (badge) {
    badge.textContent = totalCount;
    badge.classList.toggle("has-items", totalCount > 0);
  }

  // 2. Update Drawer Badge
  if (drawerBadge) {
    drawerBadge.textContent = `${totalCount} item${totalCount === 1 ? "" : "s"}`;
  }

  // 3. Free Delivery Progress
  if (shippingText && shippingFill) {
    const remaining = FREE_SHIPPING_THRESHOLD - subtotal;
    const pct = Math.min(100, Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100));
    shippingFill.style.width = `${pct}%`;

    if (remaining <= 0 && subtotal > 0) {
      shippingText.innerHTML = `🎉 <strong>Congratulations!</strong> You unlocked <strong>FREE Local Florist Delivery</strong>!`;
      shippingFill.classList.add("unlocked");
    } else {
      shippingText.innerHTML = `Add <strong>$${Math.max(0, remaining).toFixed(2)}</strong> more for <strong>FREE Local Delivery</strong>`;
      shippingFill.classList.remove("unlocked");
    }
  }

  // 4. Render Cart Items
  if (!container) return;

  if (cartItems.length === 0) {
    container.innerHTML = `
      <div class="cart-empty">
        <div class="cart-empty-icon">🌸</div>
        <h4>Your Shopping Bag is Empty</h4>
        <p>Explore our freshly cut bouquets and artisanal botanical gifts.</p>
        <button class="button button-dark" id="btn-start-shopping" type="button">
          Explore Flower Collection &rarr;
        </button>
      </div>
    `;

    document.getElementById("btn-start-shopping")?.addEventListener("click", () => {
      closeCart();
      document.getElementById("collection")?.scrollIntoView({ behavior: "smooth" });
    });

    if (footer) footer.style.display = "none";
    return;
  }

  if (footer) footer.style.display = "flex";

  // Build items HTML with verified live product image
  container.innerHTML = cartItems.map(item => {
    const liveProduct = getProductBySlug(item.slug);
    const itemImg = liveProduct?.images.primary || item.image;

    return `
      <article class="cart-item" data-item-id="${item.id}">
        <div class="cart-item-img">
          <img src="${itemImg}" alt="${item.name}" loading="lazy" />
        </div>

        <div class="cart-item-details">
          <div class="cart-item-title-row">
            <h4 class="cart-item-title">${item.name}</h4>
            <button class="cart-item-remove-btn" type="button" aria-label="Remove ${item.name} from bag">&times;</button>
          </div>

          <div class="cart-item-meta">
            <span>Tier: <strong>${item.size.name}</strong></span>
            <span>Wrap: <strong>${item.vase.name}</strong></span>
            ${item.giftMessage ? `<span class="cart-item-note">💌 Note: "${item.giftMessage.slice(0, 24)}${item.giftMessage.length > 24 ? "..." : ""}"</span>` : ""}
          </div>

          <div class="cart-item-bottom">
            <div class="cart-stepper">
              <button class="stepper-btn btn-stepper-minus" type="button" aria-label="Decrease quantity">−</button>
              <span class="stepper-count">${item.quantity}</span>
              <button class="stepper-btn btn-stepper-plus" type="button" aria-label="Increase quantity">+</button>
            </div>

            <div class="cart-item-price">
              $${(item.unitPrice * item.quantity).toFixed(2)}
            </div>
          </div>
        </div>
      </article>
    `;
  }).join("");

  // 5. Update Totals
  if (subtotalEl) subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
  if (totalEl) totalEl.textContent = `$${subtotal.toFixed(2)}`;
}

/**
 * Lemon Squeezy Overlay event listener
 */
function setupLemonSqueezyOverlay() {
  if (typeof window.LemonSqueezy === "undefined") return;

  try {
    window.LemonSqueezy.Setup({
      eventHandler: (event) => {
        if (event.event === "Checkout.Success") {
          // Clear cart on successful purchase
          cartItems = [];
          saveCartToStorage();
          updateCartUI();
          closeCart();

          showToast({
            title: "Order Confirmed! 🌸",
            message: "Thank you for your order! Your blooms are being prepared with love.",
            icon: "🎉",
            duration: 8000
          });
        }
      }
    });
  } catch (err) {
    console.warn("Lemon Squeezy overlay setup deferred:", err);
  }
}
