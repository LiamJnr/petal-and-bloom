/**
 * Cart State Management & Slide-over Drawer Module
 * Includes persistent localStorage, free shipping meter, and Lemon Squeezy integration.
 */
import { showToast } from "./toast.js";

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
 * Load cart from localStorage
 */
function loadCartFromStorage() {
  try {
    const data = localStorage.getItem(CART_STORAGE_KEY);
    cartItems = data ? JSON.parse(data) : [];
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
      checkoutUrl: product.checkoutUrls[size.id] || product.checkoutUrls.classic,
      quantity
    });
  }

  saveCartToStorage();
  updateCartUI();
  openCart();

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
  if (backdrop) {
    backdrop.classList.add("open");
    backdrop.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }
}

/**
 * Close the Cart Drawer
 */
export function closeCart() {
  const backdrop = document.getElementById("cart-backdrop");
  if (backdrop) {
    backdrop.classList.remove("open");
    backdrop.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
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
  if (document.getElementById("cart-backdrop")) return;

  const markup = `
    <div id="cart-backdrop" class="cart-backdrop" aria-hidden="true">
      <aside class="cart-drawer" role="dialog" aria-labelledby="cart-drawer-title" aria-modal="true">
        
        <!-- Header -->
        <div class="cart-header">
          <div class="cart-header-title">
            <h3 id="cart-drawer-title">Shopping Bag</h3>
            <span class="badge badge-rose" id="cart-drawer-badge">0 items</span>
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
            <span>Local Delivery</span>
            <span id="cart-delivery-val">Free (Standard)</span>
          </div>
          <div class="cart-total-row">
            <span>Total:</span>
            <strong id="cart-total-val">$0.00</strong>
          </div>

          <a 
            href="#" 
            class="button button-dark cart-checkout-btn lemonsqueezy-button" 
            id="btn-cart-checkout"
          >
            Proceed to Secure Checkout 🌸
          </a>

          <div class="cart-trust-note">
            <span>🔒 SSL Encrypted • Powered by Lemon Squeezy</span>
          </div>
        </div>

      </aside>
    </div>
  `;

  document.body.insertAdjacentHTML("beforeend", markup);
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
  const checkoutBtn = document.getElementById("btn-cart-checkout");
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
        <h4>Your Bag is Empty</h4>
        <p>You haven't chosen any bouquets yet. Explore our freshly picked seasonal blooms.</p>
        <button class="button button-dark" id="btn-start-shopping" type="button">
          Start Shopping ✿
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

  // Build items HTML
  container.innerHTML = cartItems.map(item => `
    <article class="cart-item" data-item-id="${item.id}">
      <div class="cart-item-img">
        <img src="${item.image}" alt="${item.name}" />
      </div>

      <div class="cart-item-details">
        <div class="cart-item-title-row">
          <h4 class="cart-item-title">${item.name}</h4>
          <button class="cart-item-remove-btn" type="button" aria-label="Remove ${item.name} from bag">&times;</button>
        </div>

        <div class="cart-item-meta">
          <span>Tier: <strong>${item.size.name}</strong> (${item.size.stems || "Arrangement"})</span>
          <span>Vase: <strong>${item.vase.name}</strong></span>
          ${item.deliveryDate ? `<span>📅 Delivery: <strong>${item.deliveryDate}</strong></span>` : ""}
          ${item.giftMessage ? `<span class="cart-item-note">💌 Note: "${item.giftMessage.slice(0, 30)}${item.giftMessage.length > 30 ? "..." : ""}"</span>` : ""}
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
  `).join("");

  // 5. Update Totals & Lemon Squeezy Checkout Link
  if (subtotalEl) subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
  if (totalEl) totalEl.textContent = `$${subtotal.toFixed(2)}`;

  if (checkoutBtn) {
    // Primary item checkout or active item link
    const primaryCheckout = cartItems[0]?.checkoutUrl || "https://petal-bloom.lemonsqueezy.com";
    checkoutBtn.href = primaryCheckout;
  }
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
    console.warn("Lemon Squeezy overlay initialization notice:", err);
  }
}
