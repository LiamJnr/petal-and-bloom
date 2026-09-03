/**
 * Dedicated Product Detail Page (PDP) Module — Matching Design Mockup
 */
import { getProductBySlug } from "../data/products.js";
import { getReviewsForProduct, getReviewMetrics } from "../data/reviews.js";
import { navigateToHome } from "./router.js";
import { showToast } from "./toast.js";

let currentProduct = null;
let selectedSizeIndex = 0;
let selectedColor = "Blue";
let quantity = 1;
let giftMessage = "";
let activeTab = "review"; // default to review or description

let addToCartHandler = null;

export function initPDP({ onAddToCart }) {
  addToCartHandler = onAddToCart;
}

/**
 * Render the full Product Detail Page matching mockup
 */
export function renderPDP(slug) {
  const pdpContainer = document.getElementById("pdp-view");
  const homeView = document.getElementById("home-view");
  const checkoutView = document.getElementById("checkout-view");

  if (!pdpContainer || !homeView) return;

  const product = getProductBySlug(slug);
  if (!product) {
    navigateToHome(true);
    return;
  }

  currentProduct = product;
  selectedSizeIndex = 0;
  quantity = 1;
  giftMessage = "";

  // View toggle
  homeView.style.display = "none";
  if (checkoutView) checkoutView.style.display = "none";
  pdpContainer.style.display = "block";
  document.title = `${product.name} — Flower Shop`;

  // Pricing calculations
  const basePrice = product.sizes[0].price;
  const oldPrice = (basePrice * 1.8).toFixed(2);
  const metrics = getReviewMetrics(product.slug);
  const reviews = getReviewsForProduct(product.slug);

  // Distribution percentages
  const totalRev = metrics.count || 245;
  const pct5 = Math.round((metrics.distribution[5] / (metrics.count || 1)) * 100) || 75;
  const pct4 = Math.round((metrics.distribution[4] / (metrics.count || 1)) * 100) || 45;
  const pct3 = Math.round((metrics.distribution[3] / (metrics.count || 1)) * 100) || 20;
  const pct2 = Math.round((metrics.distribution[2] / (metrics.count || 1)) * 100) || 10;
  const pct1 = Math.round((metrics.distribution[1] / (metrics.count || 1)) * 100) || 4;

  const galleryImages = [
    product.images.primary,
    ...(product.images.gallery || [])
  ].slice(0, 4);

  // Tier-specific size SVGs
  const standardSvg = `
    <svg viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor">
      <path d="M0 0h24v24H0z" fill="none" />
      <path fill="currentColor" d="M5.873 3.26A.75.75 0 0 1 6.44 3h11.31c.223 0 .434.099.576.27l5 6a.75.75 0 0 1-.028.992l-10.75 11.5a.75.75 0 0 1-1.096 0l-10.75-11.5a.75.75 0 0 1-.02-1.003zm.91 1.24L2.258 9.73L12 20.153l9.75-10.43L17.399 4.5Z" />
    </svg>
  `;

  const deluxeSvg = `
    <svg viewBox="0 0 32 32" width="1em" height="1em" fill="currentColor">
      <path d="M0 0h32v32H0z" fill="none" />
      <path fill="currentColor" d="M15.008 30.722a1.5 1.5 0 0 0 1.059.34a1.52 1.52 0 0 0 1.009-.476l13.478-14.271a1.52 1.52 0 0 0 .341-1.203v-.008a1.4 1.4 0 0 0-.279-.677c-.039-.056-.89-1.192-1.89-2.525l-.334-.447l-1.033-1.375l-.438-.585c-.76-1.014-1.351-1.802-1.4-1.87a1 1 0 0 0-.1-.125a1.53 1.53 0 0 0-1.211-.6H7.773a1.55 1.55 0 0 0-1.2.606l-5.19 6.852a3 3 0 0 0-.128.178a1.42 1.42 0 0 0 .174 1.83l13.427 14.212c.029.032.118.115.152.144M3.659 15.812h6.407l4.595 11.641zm7.514-1l4.26-5.912h1.049l4.259 5.913zm-.032 1h9.632l-4.816 12.201zm10.707 0h6.435L17.228 27.519zm6.902-.494l.025-.026l-.025-.034zm-.334-.505h-6.443L17.713 8.9h6.264l1.783 2.379l1.036 1.373l.36.48zm-18.475 0H3.544L8.026 8.9H14.2z" />
    </svg>
  `;

  const premiumSvg = `
    <svg viewBox="0 0 8 8" width="1em" height="1em" fill="currentColor">
      <path d="M0 0h8v8H0z" fill="none" />
      <path fill="currentColor" d="M3 1L1 3h1m3-2v2h2M2 3l2 3l1-3M4 7L0 3l2-2h4l2 2" />
    </svg>
  `;

  const sizeIcons = [standardSvg, deluxeSvg, premiumSvg];

  pdpContainer.innerHTML = `
    <!-- 1. Top Page Header & Breadcrumbs Banner -->
    <header class="pdp-page-header">
      <div class="container">
        <h1>Shop</h1>
        <nav class="pdp-breadcrumb" aria-label="Breadcrumb">
          <a href="#" class="btn-breadcrumb-home">Home</a>
          <span>/</span>
          <a href="#" class="btn-breadcrumb-home">Shop</a>
          <span>/</span>
          <span class="pdp-breadcrumb-current">Product Details</span>
        </nav>
      </div>
    </header>

    <div class="container">
      <!-- 2. Main 2-Column Product Details -->
      <div class="pdp-grid">
        
        <!-- Left: Gallery Column -->
        <div class="pdp-gallery">
          <div class="pdp-main-image-card">
            <img id="pdp-main-img" src="${product.images.primary}" alt="${product.name}" />
          </div>

          <div class="pdp-thumbnails">
            ${galleryImages.map((imgSrc, idx) => `
              <button 
                type="button" 
                class="pdp-thumb-btn ${idx === 0 ? "active" : ""}" 
                data-src="${imgSrc}"
                aria-label="Thumbnail ${idx + 1}"
              >
                <img src="${imgSrc}" alt="Thumbnail ${idx + 1}" />
              </button>
            `).join("")}
          </div>
        </div>

        <!-- Right: Info & Customizer -->
        <div class="pdp-info">
          <span class="pdp-category-name">${product.category === "bouquet" ? "Bouquets" : product.category}</span>
          
          <div class="pdp-title-row">
            <h2 class="pdp-title">${product.name}</h2>
            <span class="badge-in-stock">In Stock</span>
          </div>

          <div class="pdp-rating-row">
            <span class="pdp-rating-stars">★★★★★</span>
            <span class="pdp-rating-text">${product.rating || "4.9"}</span>
            <span class="pdp-rating-count">(${product.reviewCount || 245} Review)</span>
          </div>

          <div class="pdp-price-box">
            <span class="pdp-price-current" id="pdp-current-price">$${product.sizes[selectedSizeIndex].price.toFixed(2)}</span>
            <span class="pdp-price-old">$${oldPrice}</span>
          </div>

          <p class="pdp-desc-text">
            ${product.description}
          </p>

          <!-- Size Selector with Luxury Tier Icons -->
          <div class="pdp-size-selector">
            <div class="pdp-section-label">Size</div>
            <div class="pdp-size-cards">
              ${product.sizes.map((size, idx) => `
                <div 
                  class="pdp-size-box ${idx === selectedSizeIndex ? "active" : ""}" 
                  data-index="${idx}"
                  role="button"
                  tabindex="0"
                >
                  <div class="pdp-size-icon">${sizeIcons[idx % sizeIcons.length]}</div>
                  <span class="pdp-size-name">${size.name}</span>
                  <span class="pdp-size-addon">+ $${size.price.toFixed(2)}</span>
                </div>
              `).join("")}
            </div>
          </div>

          <!-- Flower Color Swatches -->
          <div class="pdp-color-selector">
            <div class="pdp-color-label">
              Flower Color : <span id="pdp-selected-color-name">Blue</span>
            </div>
            <div class="pdp-color-swatches">
              <div class="pdp-color-swatch active" data-color="Blue" title="Blue">
                <div class="swatch-inner" style="background-color: #5e1173;"></div>
              </div>
              <div class="pdp-color-swatch" data-color="Lavender" title="Lavender">
                <div class="swatch-inner" style="background-color: #9d4edd;"></div>
              </div>
              <div class="pdp-color-swatch" data-color="Pink White" title="Pink White">
                <div class="swatch-inner" style="background-color: #f06292;"></div>
              </div>
            </div>
          </div>

          <!-- Card Message Textarea -->
          <div class="pdp-card-message-group">
            <div class="pdp-section-label">Card Message</div>
            <textarea 
              id="pdp-card-message" 
              class="pdp-card-message-textarea" 
              placeholder="Enter Message"
            ></textarea>
          </div>

          <!-- Actions Row: Stepper + Add To Cart + Buy Now + Wishlist -->
          <div class="pdp-action-row">
            <div class="pdp-qty-stepper">
              <button type="button" class="pdp-stepper-btn" id="pdp-qty-minus">−</button>
              <span class="pdp-stepper-value" id="pdp-qty-val">1</span>
              <button type="button" class="pdp-stepper-btn" id="pdp-qty-plus">+</button>
            </div>

            <button type="button" class="btn-add-to-cart" id="btn-pdp-add-to-cart">
              Add To Cart
            </button>

            <button type="button" class="btn-buy-now" id="btn-pdp-buy-now">
              Buy Now
            </button>

            <button type="button" class="btn-wishlist" id="btn-pdp-wishlist" aria-label="Add to wishlist" title="Add to wishlist">
              <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"/>
              </svg>
            </button>
          </div>

          <!-- Metadata -->
          <div class="pdp-meta-list">
            <div class="pdp-meta-row">
              <span class="pdp-meta-label">SKU :</span>
              <span class="pdp-meta-val">FLWR87654ABC</span>
            </div>
            <div class="pdp-meta-row">
              <span class="pdp-meta-label">Tags :</span>
              <span class="pdp-meta-val">Bouquets, Flowers</span>
            </div>
            <div class="pdp-meta-row">
              <span class="pdp-meta-label">Share :</span>
              <div class="pdp-share-icons">
                <a href="#" class="pdp-share-icon" aria-label="Share on Facebook">f</a>
                <a href="#" class="pdp-share-icon" aria-label="Share on X">𝕏</a>
                <a href="#" class="pdp-share-icon" aria-label="Share on Pinterest">p</a>
                <a href="#" class="pdp-share-icon" aria-label="Share on Instagram">ig</a>
              </div>
            </div>
          </div>
        </div>

      </div>

      <!-- 3. Tabs Navigation (Description, Additional Information, Review) -->
      <div class="pdp-tabs-container">
        <nav class="pdp-tabs-nav" role="tablist">
          <button class="pdp-tab-btn" data-tab="description" role="tab">Description</button>
          <button class="pdp-tab-btn" data-tab="info" role="tab">Additional Information</button>
          <button class="pdp-tab-btn active" data-tab="review" role="tab">Review</button>
        </nav>

        <!-- Tab 1: Description Panel -->
        <div class="pdp-tab-content" id="tab-description">
          <div class="pdp-desc-panel">
            <p>
              ${product.description}
            </p>
            <p>
              Hand-tied by our expert florists with premium seasonal stems. Every bouquet arrives in hydration packaging to ensure maximum freshness from our studio to your doorstep.
            </p>
          </div>
        </div>

        <!-- Tab 2: Additional Info Panel -->
        <div class="pdp-tab-content" id="tab-info">
          <div class="pdp-info-panel">
            <table class="pdp-info-table">
              <tbody>
                <tr>
                  <th>Stem Composition</th>
                  <td>${product.stems.map(s => `${s.count}x ${s.name}`).join(", ")}</td>
                </tr>
                <tr>
                  <th>Vase Life</th>
                  <td>7 to 10 Days with fresh water changes</td>
                </tr>
                <tr>
                  <th>Packaging</th>
                  <td>Eco-friendly craft paper wrap & satin ribbon</td>
                </tr>
                <tr>
                  <th>Delivery</th>
                  <td>Hand-delivered in temperature-controlled vans</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Tab 3: Review Panel (Matching Design Mockup) -->
        <div class="pdp-tab-content active" id="tab-review">
          
          <!-- Rating Summary Box -->
          <div class="pdp-review-summary-box">
            <div class="pdp-review-score-left">
              <div class="pdp-review-big-num">
                ${product.rating || "4.9"} <span>out of 5</span>
              </div>
              <div class="pdp-review-score-stars">★★★★★</div>
              <div class="pdp-review-score-count">(${product.reviewCount || 245} Review)</div>
            </div>

            <div class="pdp-review-divider"></div>

            <div class="pdp-review-bars">
              <div class="pdp-bar-row">
                <span class="pdp-bar-label">5 Star</span>
                <div class="pdp-bar-track">
                  <div class="pdp-bar-fill" style="width: ${pct5}%"></div>
                </div>
              </div>
              <div class="pdp-bar-row">
                <span class="pdp-bar-label">4 Star</span>
                <div class="pdp-bar-track">
                  <div class="pdp-bar-fill" style="width: ${pct4}%"></div>
                </div>
              </div>
              <div class="pdp-bar-row">
                <span class="pdp-bar-label">3 Star</span>
                <div class="pdp-bar-track">
                  <div class="pdp-bar-fill" style="width: ${pct3}%"></div>
                </div>
              </div>
              <div class="pdp-bar-row">
                <span class="pdp-bar-label">2 Star</span>
                <div class="pdp-bar-track">
                  <div class="pdp-bar-fill" style="width: ${pct2}%"></div>
                </div>
              </div>
              <div class="pdp-bar-row">
                <span class="pdp-bar-label">1 Star</span>
                <div class="pdp-bar-track">
                  <div class="pdp-bar-fill" style="width: ${pct1}%"></div>
                </div>
              </div>
            </div>
          </div>

          <!-- Review List -->
          <div class="pdp-review-list-section">
            <div class="pdp-review-list-header">
              <div class="pdp-review-list-title">
                <h3>Review List</h3>
                <span>Showing 1-4 of ${totalRev} results</span>
              </div>

              <div class="pdp-review-sort">
                <label>Sort by :</label>
                <select id="pdp-review-sort-select">
                  <option value="newest">Newest ⌵</option>
                  <option value="highest">Highest Rating</option>
                  <option value="lowest">Lowest Rating</option>
                </select>
              </div>
            </div>

            <!-- Review Items -->
            <div class="pdp-reviews-items-container">
              
              <!-- Review 1 -->
              <article class="pdp-review-item">
                <div class="pdp-review-user-row">
                  <div class="pdp-review-user-info">
                    <div class="pdp-review-avatar">
                      <img src="images/sweetheart.png" alt="Kristin Watson" />
                    </div>
                    <div class="pdp-review-user-name">
                      Kristin Watson <span>(Verified)</span>
                    </div>
                  </div>
                  <span class="pdp-review-date">1 month ago</span>
                </div>
                <h4 class="pdp-review-item-title">Perfect for Birthdays and Anniversaries!</h4>
                <p class="pdp-review-item-comment">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                </p>
                <div class="pdp-review-item-stars">
                  ★★★★★ <span>5.0</span>
                </div>
                <div class="pdp-review-photos">
                  <div class="pdp-review-photo"><img src="images/roses.png" alt="Review photo 1" /></div>
                  <div class="pdp-review-photo"><img src="images/tulips.png" alt="Review photo 2" /></div>
                  <div class="pdp-review-photo"><img src="images/peonies.png" alt="Review photo 3" /></div>
                </div>
              </article>

              <!-- Review 2 -->
              <article class="pdp-review-item">
                <div class="pdp-review-user-row">
                  <div class="pdp-review-user-info">
                    <div class="pdp-review-avatar">
                      <img src="images/daisies.png" alt="Jenny Wilson" />
                    </div>
                    <div class="pdp-review-user-name">
                      Jenny Wilson <span>(Verified)</span>
                    </div>
                  </div>
                  <span class="pdp-review-date">2 months ago</span>
                </div>
                <h4 class="pdp-review-item-title">The Most Stunning Bouquet Ever!</h4>
                <p class="pdp-review-item-comment">
                  The blooms arrived in perfect condition and lasted well over a week. The fragrance filled the whole room!
                </p>
                <div class="pdp-review-item-stars">
                  ★★★★★ <span>5.0</span>
                </div>
              </article>

            </div>
          </div>

        </div>
      </div>
    </div>
  `;

  bindPDPEvents(product);
}

/**
 * Bind interactive events for PDP
 */
function bindPDPEvents(product) {
  const pdpContainer = document.getElementById("pdp-view");
  if (!pdpContainer) return;

  // Breadcrumbs
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

  // Size cards
  pdpContainer.querySelectorAll(".pdp-size-box").forEach(box => {
    box.addEventListener("click", () => {
      pdpContainer.querySelectorAll(".pdp-size-box").forEach(b => b.classList.remove("active"));
      box.classList.add("active");
      selectedSizeIndex = parseInt(box.dataset.index, 10) || 0;
      const priceEl = document.getElementById("pdp-current-price");
      if (priceEl && product.sizes[selectedSizeIndex]) {
        priceEl.textContent = `$${product.sizes[selectedSizeIndex].price.toFixed(2)}`;
      }
    });
  });

  // Color swatches
  pdpContainer.querySelectorAll(".pdp-color-swatch").forEach(swatch => {
    swatch.addEventListener("click", () => {
      pdpContainer.querySelectorAll(".pdp-color-swatch").forEach(s => s.classList.remove("active"));
      swatch.classList.add("active");
      selectedColor = swatch.dataset.color || "Blue";
      const colorLabel = document.getElementById("pdp-selected-color-name");
      if (colorLabel) colorLabel.textContent = selectedColor;
    });
  });

  // Quantity stepper
  const qtyVal = document.getElementById("pdp-qty-val");
  document.getElementById("pdp-qty-minus")?.addEventListener("click", () => {
    if (quantity > 1) {
      quantity--;
      if (qtyVal) qtyVal.textContent = quantity;
    }
  });

  document.getElementById("pdp-qty-plus")?.addEventListener("click", () => {
    quantity++;
    if (qtyVal) qtyVal.textContent = quantity;
  });

  // Card message
  const cardMsg = document.getElementById("pdp-card-message");
  cardMsg?.addEventListener("input", (e) => {
    giftMessage = e.target.value;
  });

  // Add To Cart
  document.getElementById("btn-pdp-add-to-cart")?.addEventListener("click", () => {
    const size = product.sizes[selectedSizeIndex] || product.sizes[0];
    const itemData = {
      product,
      size,
      vase: { id: "none", name: `${selectedColor} Wrap`, price: 0 },
      giftMessage: giftMessage.trim(),
      deliveryDate: "",
      unitPrice: size.price,
      quantity
    };

    if (typeof addToCartHandler === "function") {
      addToCartHandler(itemData);
    }
  });

  // Buy Now -> Direct add and route to checkout
  document.getElementById("btn-pdp-buy-now")?.addEventListener("click", () => {
    const size = product.sizes[selectedSizeIndex] || product.sizes[0];
    const itemData = {
      product,
      size,
      vase: { id: "none", name: `${selectedColor} Wrap`, price: 0 },
      giftMessage: giftMessage.trim(),
      deliveryDate: "",
      unitPrice: size.price,
      quantity
    };

    if (typeof addToCartHandler === "function") {
      addToCartHandler(itemData);
    }

    const event = new CustomEvent("navigate-to-checkout");
    document.dispatchEvent(event);
  });

  // Wishlist
  document.getElementById("btn-pdp-wishlist")?.addEventListener("click", function() {
    this.classList.toggle("active");
    showToast({
      title: "Saved to Wishlist! 💖",
      message: `${product.name} has been added to your favorites.`,
      icon: "❤️"
    });
  });

  // Tabs switching (Description / Additional Information / Review)
  pdpContainer.querySelectorAll(".pdp-tab-btn").forEach(tabBtn => {
    tabBtn.addEventListener("click", () => {
      pdpContainer.querySelectorAll(".pdp-tab-btn").forEach(b => b.classList.remove("active"));
      pdpContainer.querySelectorAll(".pdp-tab-content").forEach(c => c.classList.remove("active"));

      tabBtn.classList.add("active");
      const targetId = `tab-${tabBtn.dataset.tab}`;
      const targetContent = document.getElementById(targetId);
      if (targetContent) {
        targetContent.classList.add("active");
      }
    });
  });
}
