/**
 * Dedicated Product Detail Page (PDP) Module
 */
import { getProductBySlug, getRelatedProducts } from "../data/products.js";
import { navigateToHome, navigateToProduct } from "./router.js";

let currentProduct = null;
let selectedSize = null;
let selectedVase = null;
let giftMessage = "";
let deliveryDate = "";

let addToCartHandler = null;

export function initPDP({ onAddToCart }) {
  addToCartHandler = onAddToCart;
}

/**
 * Render the full Product Detail Page for a given slug
 */
export function renderPDP(slug) {
  const pdpContainer = document.getElementById("pdp-view");
  const homeView = document.getElementById("home-view");

  if (!pdpContainer || !homeView) return;

  const product = getProductBySlug(slug);
  if (!product) {
    // Product not found fallback -> return home
    navigateToHome(true);
    return;
  }

  currentProduct = product;
  // Initialize defaults
  selectedSize = product.sizes.find(s => s.default) || product.sizes[0];
  selectedVase = product.vases[0];
  giftMessage = "";

  // Set default delivery date to tomorrow
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDateStr = tomorrow.toISOString().split("T")[0];
  deliveryDate = minDateStr;

  // Show PDP, hide Home
  homeView.style.display = "none";
  pdpContainer.style.display = "block";
  document.title = `${product.name} — Petal & Bloom Florist`;

  // Related products
  const relatedProducts = getRelatedProducts(product.slug, 3);

  // Generate HTML
  pdpContainer.innerHTML = `
    <div class="pdp-container container">
      <!-- Breadcrumb -->
      <nav class="pdp-breadcrumb" aria-label="Breadcrumb">
        <a href="#" class="btn-breadcrumb-home">Home</a>
        <span>/</span>
        <a href="#" class="btn-breadcrumb-home">Collection</a>
        <span>/</span>
        <span class="pdp-breadcrumb-current">${product.name}</span>
      </nav>

      <!-- Main PDP Columns -->
      <div class="pdp-grid">
        <!-- Left: Gallery -->
        <div class="pdp-gallery">
          <div class="pdp-main-image-wrapper">
            <img 
              id="pdp-main-img" 
              class="pdp-main-image" 
              src="${product.images.primary}" 
              alt="${product.name} florist arrangement" 
            />
            ${product.tag ? `<span class="badge badge-rose pdp-badge-tag">${product.tag}</span>` : ""}
          </div>

          <div class="pdp-thumbnails">
            ${product.images.gallery.map((imgSrc, idx) => `
              <button 
                type="button" 
                class="pdp-thumb-btn ${idx === 0 ? "active" : ""}" 
                data-src="${imgSrc}"
                aria-label="View photo ${idx + 1}"
              >
                <img src="${imgSrc}" alt="Thumbnail ${idx + 1}" />
              </button>
            `).join("")}
          </div>
        </div>

        <!-- Right: Customizer & Details -->
        <div class="pdp-info">
          <div class="pdp-header-meta">
            <span class="pdp-category-eyebrow">${product.category} • ${product.occasion}</span>
            <span class="badge badge-sage">Fresh In Stock</span>
          </div>

          <h1 class="pdp-title">${product.name}</h1>
          <p class="pdp-subtitle">${product.subtitle}</p>

          <div class="pdp-reviews-summary">
            <div class="stars">
              ★ ★ ★ ★ ★
            </div>
            <a href="#pdp-reviews-anchor" class="pdp-reviews-link">
              ${product.rating} Rating (${product.reviewCount} customer reviews)
            </a>
          </div>

          <div class="pdp-price-row">
            <div class="pdp-current-price" id="pdp-total-price">
              $${calculateTotalPrice()}
            </div>
            <span class="pdp-price-note">Tax included • Free local delivery eligible</span>
          </div>

          <p class="pdp-desc">${product.description}</p>

          <!-- 1. Size Tier Selection -->
          <div class="pdp-option-section">
            <div class="pdp-option-label">
              <span>1. Choose Arrangement Size:</span>
              <span class="pdp-option-selected-text" id="pdp-size-selected-label">${selectedSize.name} (${selectedSize.stems})</span>
            </div>
            <div class="pdp-size-grid">
              ${product.sizes.map(size => `
                <div 
                  class="pdp-size-card ${size.id === selectedSize.id ? "active" : ""}" 
                  data-size-id="${size.id}"
                  role="button"
                  tabindex="0"
                >
                  <span class="pdp-size-name">${size.name}</span>
                  <span class="pdp-size-stems">${size.stems}</span>
                  <span class="pdp-size-price">$${size.price}</span>
                </div>
              `).join("")}
            </div>
          </div>

          <!-- 2. Vase Selection -->
          <div class="pdp-option-section">
            <div class="pdp-option-label">
              <span>2. Presentation & Vase:</span>
              <span class="pdp-option-selected-text" id="pdp-vase-selected-label">${selectedVase.name}</span>
            </div>
            <div class="pdp-vase-options">
              ${product.vases.map(vase => `
                <label class="pdp-vase-radio ${vase.id === selectedVase.id ? "active" : ""}">
                  <div class="pdp-vase-info">
                    <input 
                      type="radio" 
                      name="pdp-vase" 
                      value="${vase.id}" 
                      ${vase.id === selectedVase.id ? "checked" : ""} 
                    />
                    <span>${vase.name}</span>
                  </div>
                  <span class="pdp-vase-price">${vase.price > 0 ? `+$${vase.price}` : "Included"}</span>
                </label>
              `).join("")}
            </div>
          </div>

          <!-- 3. Personalized Card Message -->
          <div class="pdp-option-section">
            <div class="pdp-option-label">
              <span>3. Complimentary Florist Card Note:</span>
              <span class="pdp-option-selected-text">Handwritten</span>
            </div>
            <div class="pdp-gift-note">
              <textarea 
                id="pdp-card-message" 
                maxlength="250" 
                placeholder="Write a heartfelt note for the recipient (optional)..."
              ></textarea>
              <div class="pdp-gift-note-footer">
                <span>Printed on premium letterpress cardstock</span>
                <span id="pdp-char-count">0 / 250</span>
              </div>
            </div>
          </div>

          <!-- 4. Delivery Date Selection -->
          <div class="pdp-option-section">
            <div class="pdp-option-label">
              <span>4. Requested Delivery Date:</span>
              <span class="pdp-option-selected-text">Hand-delivered</span>
            </div>
            <div class="pdp-delivery-box">
              <span>📅</span>
              <input 
                type="date" 
                id="pdp-delivery-date" 
                class="pdp-delivery-input" 
                value="${minDateStr}" 
                min="${minDateStr}" 
              />
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="pdp-actions">
            <button class="button button-dark btn-pdp-cart" id="btn-add-pdp-cart" type="button">
              Add to Shopping Bag • <span id="btn-cart-price">$${calculateTotalPrice()}</span>
            </button>
            <a 
              class="button button-light btn-pdp-buy-now lemonsqueezy-button" 
              id="btn-buy-now" 
              href="${product.checkoutUrls[selectedSize.id] || product.checkoutUrls.classic}"
            >
              Express Checkout with Lemon Squeezy 🌸
            </a>
          </div>

          <!-- Accordion Details (Stems, Care, Guarantee) -->
          <div class="pdp-details-tabs">
            <!-- Accordion 1: Stems Breakdown -->
            <div class="pdp-accordion-item open">
              <button class="pdp-accordion-trigger" type="button">
                <span>🌿 Stem Composition & Botanical Ingredients</span>
                <span>+</span>
              </button>
              <div class="pdp-accordion-content">
                <p>Every stem is harvested at early bud and hand-conditioned for exceptional vase life:</p>
                <div class="stem-tags-list">
                  ${product.stems.map(s => `
                    <span class="stem-tag">
                      🌸 <strong>${s.count}x</strong> ${s.name}
                    </span>
                  `).join("")}
                </div>
              </div>
            </div>

            <!-- Accordion 2: Care Guide -->
            <div class="pdp-accordion-item">
              <button class="pdp-accordion-trigger" type="button">
                <span>✂️ Florist Care Instructions</span>
                <span>+</span>
              </button>
              <div class="pdp-accordion-content">
                <ul class="care-tips-list">
                  ${product.careGuide.map(tip => `<li>${tip}</li>`).join("")}
                </ul>
              </div>
            </div>

            <!-- Accordion 3: Guarantee -->
            <div class="pdp-accordion-item">
              <button class="pdp-accordion-trigger" type="button">
                <span>🛡️ 7-Day Freshness Guarantee & Hand Delivery</span>
                <span>+</span>
              </button>
              <div class="pdp-accordion-content">
                <p>
                  We guarantee your blooms will stay fresh and vibrant for at least 7 days. If your flowers do not arrive in immaculate condition, our floral concierge team will provide an immediate replacement with no questions asked.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Related Products Section -->
      <section class="pdp-related-section">
        <div class="pdp-related-header">
          <span class="eyebrow">BOTANICAL HARMONY</span>
          <h3>You May Also Adore</h3>
        </div>
        <div class="product-grid">
          ${relatedProducts.map(rel => `
            <article class="product-card" data-slug="${rel.slug}" tabindex="0" role="button">
              <div class="product-card-media">
                <img src="${rel.images.primary}" alt="${rel.name}" loading="lazy" />
                ${rel.tag ? `<span class="badge badge-cream product-card-tag">${rel.tag}</span>` : ""}
              </div>
              <div class="product-card-body">
                <div class="product-card-meta">
                  <span class="product-card-category">${rel.category}</span>
                  <div class="stars">★ <span>${rel.rating}</span></div>
                </div>
                <h3 class="product-card-title">${rel.name}</h3>
                <p class="product-card-desc">${rel.shortDescription}</p>
                <div class="product-card-footer">
                  <div class="product-card-price">
                    <span>Starting from</span>
                    <strong>$${rel.sizes[0].price}</strong>
                  </div>
                  <button class="btn-card-add" type="button">+ Add</button>
                </div>
              </div>
            </article>
          `).join("")}
        </div>
      </section>
    </div>
  `;

  bindPDPEvents(product);
}

/**
 * Calculate dynamic total based on selected size + vase
 */
function calculateTotalPrice() {
  if (!selectedSize || !selectedVase) return 0;
  return selectedSize.price + (selectedVase.price || 0);
}

/**
 * Bind interactive events for PDP elements
 */
function bindPDPEvents(product) {
  const pdpContainer = document.getElementById("pdp-view");
  if (!pdpContainer) return;

  // Breadcrumb home navigation
  pdpContainer.querySelectorAll(".btn-breadcrumb-home").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      navigateToHome();
    });
  });

  // Thumbnail switcher
  const mainImg = document.getElementById("pdp-main-img");
  pdpContainer.querySelectorAll(".pdp-thumb-btn").forEach(thumb => {
    thumb.addEventListener("click", () => {
      pdpContainer.querySelectorAll(".pdp-thumb-btn").forEach(t => t.classList.remove("active"));
      thumb.classList.add("active");
      if (mainImg) {
        mainImg.src = thumb.dataset.src;
      }
    });
  });

  // Size tier selection
  pdpContainer.querySelectorAll(".pdp-size-card").forEach(card => {
    card.addEventListener("click", () => {
      pdpContainer.querySelectorAll(".pdp-size-card").forEach(c => c.classList.remove("active"));
      card.classList.add("active");

      const sizeId = card.dataset.sizeId;
      selectedSize = product.sizes.find(s => s.id === sizeId) || product.sizes[0];

      // Update labels and prices
      const sizeLabel = document.getElementById("pdp-size-selected-label");
      if (sizeLabel) {
        sizeLabel.textContent = `${selectedSize.name} (${selectedSize.stems})`;
      }
      updatePriceUI(product);
    });
  });

  // Vase selection
  pdpContainer.querySelectorAll("input[name='pdp-vase']").forEach(radio => {
    radio.addEventListener("change", (e) => {
      const vaseId = e.target.value;
      selectedVase = product.vases.find(v => v.id === vaseId) || product.vases[0];

      pdpContainer.querySelectorAll(".pdp-vase-radio").forEach(r => {
        r.classList.toggle("active", r.querySelector("input").checked);
      });

      const vaseLabel = document.getElementById("pdp-vase-selected-label");
      if (vaseLabel) {
        vaseLabel.textContent = selectedVase.name;
      }
      updatePriceUI(product);
    });
  });

  // Gift message input & char count
  const giftMsgInput = document.getElementById("pdp-card-message");
  const charCountEl = document.getElementById("pdp-char-count");
  giftMsgInput?.addEventListener("input", (e) => {
    giftMessage = e.target.value;
    if (charCountEl) {
      charCountEl.textContent = `${giftMessage.length} / 250`;
    }
  });

  // Delivery date picker
  const deliveryDateInput = document.getElementById("pdp-delivery-date");
  deliveryDateInput?.addEventListener("change", (e) => {
    deliveryDate = e.target.value;
  });

  // Accordion toggles
  pdpContainer.querySelectorAll(".pdp-accordion-trigger").forEach(trigger => {
    trigger.addEventListener("click", () => {
      const item = trigger.closest(".pdp-accordion-item");
      item?.classList.toggle("open");
    });
  });

  // Add to Cart Button
  document.getElementById("btn-add-pdp-cart")?.addEventListener("click", () => {
    const itemData = {
      product,
      size: selectedSize,
      vase: selectedVase,
      giftMessage: giftMessage.trim(),
      deliveryDate,
      unitPrice: calculateTotalPrice(),
      quantity: 1
    };

    if (typeof addToCartHandler === "function") {
      addToCartHandler(itemData);
    }
  });

  // Related products click
  pdpContainer.querySelectorAll(".pdp-related-section .product-card").forEach(card => {
    card.addEventListener("click", (e) => {
      const slug = card.dataset.slug;
      if (e.target.closest(".btn-card-add")) {
        e.stopPropagation();
        const relatedProd = getProductBySlug(slug);
        if (relatedProd && typeof addToCartHandler === "function") {
          addToCartHandler({
            product: relatedProd,
            size: relatedProd.sizes[0],
            vase: relatedProd.vases[0],
            giftMessage: "",
            deliveryDate: "",
            unitPrice: relatedProd.sizes[0].price,
            quantity: 1
          });
        }
        return;
      }
      navigateToProduct(slug);
    });
  });
}

/**
 * Update dynamic price and Lemon Squeezy buy links across PDP
 */
function updatePriceUI(product) {
  const total = calculateTotalPrice();
  const priceDisplay = document.getElementById("pdp-total-price");
  const cartBtnPrice = document.getElementById("btn-cart-price");
  const buyNowBtn = document.getElementById("btn-buy-now");

  if (priceDisplay) priceDisplay.textContent = `$${total}`;
  if (cartBtnPrice) cartBtnPrice.textContent = `$${total}`;

  if (buyNowBtn && selectedSize && product.checkoutUrls) {
    buyNowBtn.href = product.checkoutUrls[selectedSize.id] || product.checkoutUrls.classic;
  }
}
