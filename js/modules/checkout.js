/**
 * Order Details & Recipient Information Checkout Module
 * Gathers recipient delivery logistics, address, date/time window, and gift note.
 * Styled to conform with the Product Detail Page (PDP) design system.
 */
import { getCartSubtotal, getTotalItemCount, openCart } from "./cart.js";
import { navigateToHome } from "./router.js";
import { showToast } from "./toast.js";
import { getProductBySlug } from "../data/products.js";

let selectedTimeWindow = "morning";
let selectedLocationType = "residential";

// SVG Assets for Location Types
const homeSvg = `
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
    <polyline points="9 22 9 12 15 12 15 22"/>
  </svg>
`;

const businessSvg = `
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
    <rect width="16" height="20" x="4" y="2" rx="2" ry="2"/>
    <path d="M9 22v-4h6v4"/>
    <path d="M8 6h.01"/>
    <path d="M16 6h.01"/>
    <path d="M12 6h.01"/>
    <path d="M12 10h.01"/>
    <path d="M12 14h.01"/>
    <path d="M16 10h.01"/>
    <path d="M16 14h.01"/>
    <path d="M8 10h.01"/>
    <path d="M8 14h.01"/>
  </svg>
`;

const hospitalSvg = `
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
    <path d="M12 6v12"/>
    <path d="M6 12h12"/>
    <rect width="18" height="18" x="3" y="3" rx="2"/>
  </svg>
`;

const venueSvg = `
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
    <path d="M5.8 11.3 2 22l10.7-3.79"/>
    <path d="M4 3h.01"/>
    <path d="M22 8h.01"/>
    <path d="M15 2h.01"/>
    <path d="M22 20h.01"/>
    <path d="m22 2-2.24.75a2.9 2.9 0 0 0-1.96 3.12v0c.1.86-.57 1.63-1.45 1.63h-.38e-1a3 3 0 0 1-3.07-2.93 2.9 2.9 0 0 0-3.18-2.84L7.8 2"/>
  </svg>
`;

// SVG Assets for Delivery Time Windows
const sunSvg = `
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="12" cy="12" r="4"/>
    <path d="M12 2v2"/>
    <path d="M12 20v2"/>
    <path d="m4.93 4.93 1.41 1.41"/>
    <path d="m17.66 17.66 1.41 1.41"/>
    <path d="M2 12h2"/>
    <path d="M20 12h2"/>
    <path d="m6.34 17.66-1.41 1.41"/>
    <path d="m19.07 4.93-1.41 1.41"/>
  </svg>
`;

const afternoonSvg = `
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
    <path d="M12 2a7 7 0 0 0-7 7c0 2.38 1.19 4.47 3 5.74V17a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2v-2.26c1.81-1.27 3-3.36 3-5.74a7 7 0 0 0-7-7z"/>
    <path d="M9 21h6"/>
  </svg>
`;

const moonSvg = `
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
    <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>
  </svg>
`;

// Trust Strip SVGs
const leafSvg = `
  <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor">
    <path d="M0 0h16v16H0z" fill="none" />
    <path fill="currentColor" d="M1.4 1.7c.217.289.65.84 1.725 1.274c1.093.44 2.885.774 5.834.528c2.02-.168 3.431.51 4.326 1.556C14.161 6.082 14.5 7.41 14.5 8.5q0 .344-.027.734C13.387 8.252 11.877 7.76 10.39 7.5c-2.016-.288-4.188-.445-5.59-2.045c-.142-.162-.402-.102-.379.112c.108.985 1.104 1.82 1.844 2.308c2.37 1.566 5.772-.118 7.6 3.071c.505.8 1.374 2.7 1.75 4.292c.07.298-.066.611-.354.715a.7.7 0 0 1-.161.042a1 1 0 0 1-1.08-.794c-.13-.97-.396-1.913-.868-2.77C12.173 13.386 10.565 14 8 14c-1.854 0-3.32-.544-4.45-1.435c-1.124-.887-1.889-2.095-2.39-3.383c-1-2.562-1-5.536-.65-7.28L.73.806z" />
  </svg>
`;

const ribbonSvg = `
  <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 64 64" fill="currentColor">
    <path d="M0 0h64v64H0z" fill="none" />
    <path fill="currentColor" d="m50.245 25.553l1.208.167c6.916.959 11.574-1.293 10.352-5.004c-1.223-3.709-1.223-9.782 0-13.491c1.223-3.711-3.436-5.963-10.352-5.004l-5.537.769c-3.914.542-7.414 2.363-9.723 4.759c-.59-1.621-1.827-.518-4.192-.518s-3.603-1.104-4.193.518C25.5 5.353 21.999 3.532 18.086 2.99l-5.537-.769C5.632 1.262.973 3.514 2.195 7.225c1.225 3.709 1.225 9.782 0 13.491c-1.223 3.711 3.437 5.963 10.354 5.004l1.207-.167C12.105 32.051 8.766 39.892 2 46h13v16s11.145-15.834 13.212-40.953c.69.596 1.867-.132 3.789-.132c1.921 0 3.098.727 3.788.132C37.856 46.166 49 62 49 62V46h13c-6.766-6.108-10.105-13.949-11.755-20.447m-32.432-2.406l-5.537.769c-.968.134-1.904.202-2.785.202c-3.064 0-4.764-.794-5.332-1.536c-.189-.245-.814-.797-.271-1.316c6.43-6.149 23.231-3.101 23.231-3.101c-1.949 2.466-5.431 4.445-9.306 4.982m28.376 0c-3.875-.537-7.357-2.517-9.307-4.982c0 0 16.803-3.049 23.23 3.101c.545.52-.082 1.071-.27 1.316c-.568.742-2.268 1.536-5.332 1.536c-.881 0-1.818-.068-2.785-.202z" />
  </svg>
`;

const cardSvg = `
  <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 20 20" fill="currentColor">
    <path d="M0 0h20v20H0z" fill="none" />
    <path fill="currentColor" d="m1.574 5.286l7.5 4.029c.252.135.578.199.906.199s.654-.064.906-.199l7.5-4.029c.489-.263.951-1.286.054-1.286H1.521c-.897 0-.435 1.023.053 1.286m17.039 2.203l-7.727 4.027c-.34.178-.578.199-.906.199s-.566-.021-.906-.199s-7.133-3.739-7.688-4.028C.996 7.284 1 7.523 1 7.707V15c0 .42.566 1 1 1h16c.434 0 1-.58 1-1V7.708c0-.184.004-.423-.387-.219" />
  </svg>
`;

const lockSvg = `
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
    <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
`;

/**
 * Render the full Order Details & Recipient Information Page
 */
export function renderCheckoutPage() {
  const checkoutView = document.getElementById("checkout-view");
  const homeView = document.getElementById("home-view");
  const pdpView = document.getElementById("pdp-view");

  if (!checkoutView) return;

  // View visibility
  if (homeView) homeView.style.display = "none";
  if (pdpView) pdpView.style.display = "none";
  checkoutView.style.display = "block";
  document.title = "Order Details & Recipient Information — Flower Shop";

  // Load items from local storage
  let cart = [];
  try {
    const raw = localStorage.getItem("petal_bloom_cart");
    cart = raw ? JSON.parse(raw) : [];
  } catch {
    cart = [];
  }

  if (cart.length === 0) {
    checkoutView.innerHTML = `
      <header class="pdp-page-header">
        <div class="container">
          <h1>Order Details</h1>
          <nav class="pdp-breadcrumb" aria-label="Breadcrumb">
            <a href="#" class="btn-checkout-home">Home</a>
            <span>/</span>
            <a href="#" class="btn-checkout-home">Shop</a>
            <span>/</span>
            <span class="pdp-breadcrumb-current">Order Details</span>
          </nav>
        </div>
      </header>

      <div class="container text-center" style="padding: 60px 0 100px;">
        <div class="cart-empty" style="max-width: 480px; margin: 0 auto;">
          <div class="cart-empty-icon" style="font-size: 3rem; margin-bottom: 16px;">🌸</div>
          <h2 style="font-size: 1.8rem; margin-bottom: 10px;">Your Flower Bag is Empty</h2>
          <p style="color: var(--muted); margin-bottom: 24px;">Please select a floral bouquet or botanical gift before proceeding to recipient details.</p>
          <button class="button button-dark" id="btn-empty-checkout-home">Explore Flower Collection</button>
        </div>
      </div>
    `;

    document.getElementById("btn-empty-checkout-home")?.addEventListener("click", () => {
      navigateToHome();
    });
    return;
  }

  const subtotal = getCartSubtotal();
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDateStr = tomorrow.toISOString().split("T")[0];

  // Primary checkout URL for Lemon Squeezy
  const primaryCheckoutUrl = cart[0]?.checkoutUrl || "https://petal-bloom.lemonsqueezy.com";

  checkoutView.innerHTML = `
    <!-- Top PDP-Style Page Header & Breadcrumbs Banner -->
    <header class="pdp-page-header">
      <div class="container">
        <h1>Order Details</h1>
        <nav class="pdp-breadcrumb" aria-label="Breadcrumb">
          <a href="#" class="btn-checkout-home">Home</a>
          <span>/</span>
          <a href="#" class="btn-checkout-cart">Shopping Bag</a>
          <span>/</span>
          <span class="pdp-breadcrumb-current">Recipient &amp; Delivery</span>
        </nav>
      </div>
    </header>

    <div class="checkout-page-section">
      <div class="container">
        <div class="checkout-layout">
          
          <!-- Left: Recipient & Delivery Information Form -->
          <div class="checkout-form-card">
            
            <div class="checkout-header-intro">
              <h2>Recipient &amp; Delivery Logistics</h2>
              <p class="checkout-subtitle">Please provide the delivery destination and flower recipient details below.</p>
            </div>

            <form id="recipient-order-form">
              
              <!-- 1. Recipient Information -->
              <fieldset class="checkout-fieldset">
                <legend class="checkout-legend">
                  <span class="legend-num">1</span>
                  <span>Recipient Information</span>
                </legend>

                <div class="form-row">
                  <div class="form-group">
                    <label for="rec-name">Recipient Full Name *</label>
                    <input type="text" id="rec-name" class="form-control" placeholder="e.g. Clara Harrington" required />
                  </div>
                  <div class="form-group">
                    <label for="rec-email">Recipient Email *</label>
                    <input type="email" id="rec-email" class="form-control" placeholder="e.g. clara@example.com" required />
                  </div>
                </div>
              </fieldset>

              <!-- 2. Hand-Delivery Address & Location -->
              <fieldset class="checkout-fieldset">
                <legend class="checkout-legend">
                  <span class="legend-num">2</span>
                  <span>Hand-Delivery Destination</span>
                </legend>

                <div class="form-group">
                  <label for="rec-address">Street Address *</label>
                  <input type="text" id="rec-address" class="form-control" placeholder="e.g. 742 Evergreen Terrace" required />
                </div>

                <div class="form-row">
                  <div class="form-group">
                    <label for="rec-suite">Apt / Suite / Floor (Optional)</label>
                    <input type="text" id="rec-suite" class="form-control" placeholder="e.g. Apt 4B" />
                  </div>
                  <div class="form-group">
                    <label for="rec-city">City *</label>
                    <input type="text" id="rec-city" class="form-control" placeholder="e.g. New York" required />
                  </div>
                </div>

                <div class="form-row">
                  <div class="form-group">
                    <label for="rec-state">State / Province *</label>
                    <input type="text" id="rec-state" class="form-control" placeholder="e.g. NY" required />
                  </div>
                  <div class="form-group">
                    <label for="rec-zip">Postal / ZIP Code *</label>
                    <input type="text" id="rec-zip" class="form-control" placeholder="e.g. 10001" required />
                  </div>
                </div>

                <div class="form-group">
                  <label>Destination Location Type:</label>
                  <div class="location-type-grid">
                    <label class="location-type-label active" data-type="residential">
                      <input type="radio" name="loc-type" value="residential" checked />
                      <div class="location-type-icon">${homeSvg}</div>
                      <span class="location-type-name">Residential</span>
                    </label>
                    <label class="location-type-label" data-type="business">
                      <input type="radio" name="loc-type" value="business" />
                      <div class="location-type-icon">${businessSvg}</div>
                      <span class="location-type-name">Business</span>
                    </label>
                    <label class="location-type-label" data-type="hospital">
                      <input type="radio" name="loc-type" value="hospital" />
                      <div class="location-type-icon">${hospitalSvg}</div>
                      <span class="location-type-name">Hospital</span>
                    </label>
                    <label class="location-type-label" data-type="venue">
                      <input type="radio" name="loc-type" value="venue" />
                      <div class="location-type-icon">${venueSvg}</div>
                      <span class="location-type-name">Event Venue</span>
                    </label>
                  </div>
                </div>

                <div class="form-group">
                  <label for="rec-notes">Courier Notes / Gate Code (Optional)</label>
                  <input type="text" id="rec-notes" class="form-control" placeholder="e.g. Leave with concierge on 1st floor, ring buzzer #4" />
                </div>
              </fieldset>

              <!-- 3. Delivery Schedule & Preferred Window -->
              <fieldset class="checkout-fieldset">
                <legend class="checkout-legend">
                  <span class="legend-num">3</span>
                  <span>Delivery Schedule &amp; Timing</span>
                </legend>

                <div class="form-group">
                  <label for="rec-delivery-date">Requested Delivery Date *</label>
                  <input 
                    type="date" 
                    id="rec-delivery-date" 
                    class="form-control" 
                    value="${minDateStr}" 
                    min="${minDateStr}" 
                    required 
                  />
                </div>

                <div class="form-group">
                  <label>Preferred Delivery Time Window:</label>
                  <div class="time-window-grid">
                    <div class="time-window-pill active" data-window="morning">
                      <div class="time-window-icon">${sunSvg}</div>
                      <span class="time-window-title">Morning</span>
                      <span class="time-window-hours">9:00 AM – 1:00 PM</span>
                    </div>
                    <div class="time-window-pill" data-window="afternoon">
                      <div class="time-window-icon">${afternoonSvg}</div>
                      <span class="time-window-title">Afternoon</span>
                      <span class="time-window-hours">1:00 PM – 5:00 PM</span>
                    </div>
                    <div class="time-window-pill" data-window="evening">
                      <div class="time-window-icon">${moonSvg}</div>
                      <span class="time-window-title">Evening</span>
                      <span class="time-window-hours">5:00 PM – 8:00 PM</span>
                    </div>
                  </div>
                </div>
              </fieldset>

              <!-- 4. Handwritten Letterpress Card Note -->
              <fieldset class="checkout-fieldset">
                <legend class="checkout-legend">
                  <span class="legend-num">4</span>
                  <span>Complimentary Letterpress Card Note</span>
                </legend>

                <div class="form-group">
                  <label for="rec-card-msg">Personal Gift Note (Printed on luxury cardstock)</label>
                  <textarea 
                    id="rec-card-msg" 
                    class="form-control" 
                    rows="3" 
                    maxlength="250" 
                    placeholder="Write your heartfelt note for the recipient..."
                  >${cart[0]?.giftMessage || ""}</textarea>
                  <div class="checkout-gift-note-footer">
                    <span>Handwritten by our studio team</span>
                    <span id="checkout-char-count">${(cart[0]?.giftMessage || "").length} / 250</span>
                  </div>
                </div>
              </fieldset>

              <button type="submit" class="btn-proceed-payment" id="btn-submit-order-details">
                Proceed to Checkout &rarr;
              </button>
            </form>
          </div>

          <!-- Right: Sticky Order Summary Sidebar -->
          <aside class="checkout-summary-card">
            <div class="checkout-summary-header">
              <h3>Order Summary</h3>
              <button type="button" class="btn-edit-bag" id="btn-edit-cart-bag">Edit Bag</button>
            </div>

            <!-- Itemized List -->
            <div class="checkout-items-list">
              ${cart.map(item => {
                const liveProduct = getProductBySlug(item.slug);
                const itemImg = liveProduct?.images.primary || item.image;
                return `
                  <div class="checkout-item-row">
                    <div class="checkout-item-thumb">
                      <img src="${itemImg}" alt="${item.name}" loading="lazy" />
                    </div>
                    <div class="checkout-item-info">
                      <h4>${item.name}</h4>
                      <div class="checkout-item-meta">
                        <span>${item.size.name} • ${item.quantity}x</span>
                        <span>${item.vase.name}</span>
                      </div>
                    </div>
                    <div class="checkout-item-price">
                      $${(item.unitPrice * item.quantity).toFixed(2)}
                    </div>
                  </div>
                `;
              }).join("")}
            </div>

            <!-- Totals & Calculations -->
            <div class="checkout-calc-rows">
              <div class="checkout-calc-row">
                <span>Subtotal</span>
                <span>$${subtotal.toFixed(2)}</span>
              </div>
              <div class="checkout-calc-row">
                <span>Local Florist Delivery</span>
                <span class="badge-included">Complimentary</span>
              </div>
              <div class="checkout-calc-row">
                <span>Letterpress Card Note</span>
                <span class="badge-included">Included</span>
              </div>
              <div class="checkout-total-row">
                <span>Total Due:</span>
                <strong>$${subtotal.toFixed(2)}</strong>
              </div>
            </div>

            <!-- Trust & Freshness Badges -->
            <div class="checkout-trust-badges">
              <div class="trust-badge-item">
                <div class="trust-badge-icon">${leafSvg}</div>
                <span><strong>7-Day Freshness Guarantee</strong></span>
              </div>
              <div class="trust-badge-item">
                <div class="trust-badge-icon">${ribbonSvg}</div>
                <span><strong>Artisan Hand-Tied Blooms</strong></span>
              </div>
              <div class="trust-badge-item">
                <div class="trust-badge-icon">${cardSvg}</div>
                <span><strong>Custom Letterpress Card Included</strong></span>
              </div>
              <div class="trust-badge-item">
                <div class="trust-badge-icon">${lockSvg}</div>
                <span><strong>256-Bit SSL Encrypted Checkout</strong></span>
              </div>
            </div>
          </aside>

        </div>
      </div>
    </div>
  `;

  bindCheckoutEvents(primaryCheckoutUrl);
}

/**
 * Bind form interactions, time pills, location types, and submit flow
 */
function bindCheckoutEvents(primaryCheckoutUrl) {
  // Breadcrumb home
  document.querySelectorAll(".btn-checkout-home").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      navigateToHome();
    });
  });

  // Breadcrumb / edit cart
  document.querySelectorAll(".btn-checkout-cart, #btn-edit-cart-bag").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      openCart();
    });
  });

  // Time window pills
  document.querySelectorAll(".time-window-pill").forEach(pill => {
    pill.addEventListener("click", () => {
      document.querySelectorAll(".time-window-pill").forEach(p => p.classList.remove("active"));
      pill.classList.add("active");
      selectedTimeWindow = pill.dataset.window || "morning";
    });
  });

  // Location type radio pills
  document.querySelectorAll(".location-type-label").forEach(labelEl => {
    labelEl.addEventListener("click", () => {
      document.querySelectorAll(".location-type-label").forEach(l => l.classList.remove("active"));
      labelEl.classList.add("active");
      const radio = labelEl.querySelector("input[type='radio']");
      if (radio) {
        radio.checked = true;
        selectedLocationType = radio.value;
      }
    });
  });

  // Card note character counter
  const cardMsgTextarea = document.getElementById("rec-card-msg");
  const charCount = document.getElementById("checkout-char-count");
  cardMsgTextarea?.addEventListener("input", (e) => {
    if (charCount) {
      charCount.textContent = `${e.target.value.length} / 250`;
    }
  });

  // Form submit handler
  const form = document.getElementById("recipient-order-form");
  form?.addEventListener("submit", (e) => {
    e.preventDefault();

    const recipientName = document.getElementById("rec-name").value.trim();
    const recipientEmail = document.getElementById("rec-email").value.trim();
    const streetAddress = document.getElementById("rec-address").value.trim();
    const suite = document.getElementById("rec-suite").value.trim();
    const city = document.getElementById("rec-city").value.trim();
    const state = document.getElementById("rec-state").value.trim();
    const zipCode = document.getElementById("rec-zip").value.trim();
    const deliveryDate = document.getElementById("rec-delivery-date").value;
    const deliveryNotes = document.getElementById("rec-notes").value.trim();
    const cardMessage = document.getElementById("rec-card-msg").value.trim();

    // Store order payload
    const orderDetails = {
      recipientName,
      recipientEmail,
      streetAddress,
      suite,
      city,
      state,
      zipCode,
      locationType: selectedLocationType,
      deliveryDate,
      timeWindow: selectedTimeWindow,
      deliveryNotes,
      cardMessage,
      timestamp: new Date().toISOString()
    };

    try {
      sessionStorage.setItem("petal_bloom_order_details", JSON.stringify(orderDetails));
    } catch {
      // Ignored if storage full
    }

    showToast({
      title: "Details Confirmed! 🌸",
      message: `Connecting to Lemon Squeezy secure checkout for ${recipientName}...`,
      icon: "✨",
      duration: 4000
    });

    // Build checkout url with recipient email pre-fill if supported
    let finalCheckoutUrl = primaryCheckoutUrl;
    try {
      const url = new URL(primaryCheckoutUrl);
      if (recipientEmail) {
        url.searchParams.set("checkout[email]", recipientEmail);
      }
      if (recipientName) {
        url.searchParams.set("checkout[name]", recipientName);
      }
      finalCheckoutUrl = url.toString();
    } catch {
      finalCheckoutUrl = primaryCheckoutUrl;
    }

    // Open Lemon Squeezy Checkout (or overlay if available)
    setTimeout(() => {
      if (window.LemonSqueezy?.Url?.Open) {
        window.LemonSqueezy.Url.Open(finalCheckoutUrl);
      } else {
        window.location.href = finalCheckoutUrl;
      }
    }, 800);
  });
}
