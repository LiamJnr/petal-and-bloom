/**
 * Petal & Bloom — Home Featured & Best Sellers Catalog Module
 * Renders the curated showcase grid on the home page.
 */
import { getFeaturedProducts } from "../data/products.js";
import { ICONS } from "../lib/icons.js";

let activeFeaturedCategory = "all";
let productClickHandler = null;
let quickAddHandler = null;

export function initCatalog({ onProductClick, onQuickAdd, onExploreShop }) {
  productClickHandler = onProductClick;
  quickAddHandler = onQuickAdd;

  const filterButtons = document.querySelectorAll(".featured-filter-pill");
  const grid = document.getElementById("featured-product-grid") || document.getElementById("product-grid");

  // Category filter pills for featured showcase
  filterButtons.forEach(button => {
    button.addEventListener("click", () => {
      filterButtons.forEach(btn => btn.classList.remove("active"));
      button.classList.add("active");
      activeFeaturedCategory = button.dataset.filter || "all";
      renderFeaturedCatalog();
    });
  });

  // Explore Shop CTA buttons
  document.querySelectorAll(".btn-explore-full-shop, #btn-home-view-all-shop").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      if (typeof onExploreShop === "function") {
        onExploreShop();
      }
    });
  });

  // Event delegation on grid for card clicks & quick-add
  grid?.addEventListener("click", (e) => {
    const card = e.target.closest(".product-card");
    if (!card) return;

    const slug = card.dataset.slug;
    if (!slug) return;

    // If click on quick-add button
    if (e.target.closest(".btn-card-add")) {
      e.stopPropagation();
      e.preventDefault();
      if (typeof quickAddHandler === "function") {
        quickAddHandler(slug);
      }
      return;
    }

    // Default card click -> Open PDP
    if (typeof productClickHandler === "function") {
      e.preventDefault();
      productClickHandler(slug);
    }
  });

  // Keyboard accessibility (Enter / Space to view)
  grid?.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      const card = e.target.closest(".product-card");
      if (card && typeof productClickHandler === "function") {
        e.preventDefault();
        productClickHandler(card.dataset.slug);
      }
    }
  });

  // Initial render of featured flowers
  renderFeaturedCatalog();
}

/**
 * Filter featured products by selected tag/category
 */
export function getFeaturedList() {
  let list = getFeaturedProducts();

  if (activeFeaturedCategory !== "all") {
    list = list.filter(p => p.category === activeFeaturedCategory);
  }

  return list;
}

/**
 * Render curated featured cards into the home page grid
 */
export function renderFeaturedCatalog() {
  const grid = document.getElementById("featured-product-grid") || document.getElementById("product-grid");
  const countEl = document.getElementById("featured-product-count");

  if (!grid) return;

  const items = getFeaturedList();

  if (countEl) {
    countEl.textContent = `Curated Highlights (${items.length})`;
  }

  // Generate cards HTML
  grid.innerHTML = items.map(product => {
    const minPrice = Math.min(...product.sizes.map(s => s.price));
    const stemSummary = product.stems.map(s => s.name.split(" ")[0]).slice(0, 2).join(" • ");

    return `
      <article class="product-card" data-slug="${product.slug}" tabindex="0" role="button" aria-label="View details for ${product.name}">
        <div class="product-card-media">
          <img src="${product.images.primary}" alt="${product.name} flower bouquet" loading="lazy" />
          ${product.tag ? `<span class="badge badge-cream product-card-tag">${product.tag}</span>` : `<span class="badge badge-cream product-card-tag">Featured</span>`}
          <button class="product-quick-btn" type="button">Quick View ${ICONS.flower}</button>
        </div>

        <div class="product-card-body">
          <div class="product-card-meta">
            <span class="product-card-category">${product.category} • ${product.occasion}</span>
            <div class="stars" title="${product.rating} stars">
              ${ICONS.star} <span>${product.rating}</span>
            </div>
          </div>

          <h3 class="product-card-title">${product.name}</h3>
          <p class="product-card-desc">${product.shortDescription}</p>

          <div class="product-card-stems">
            <span>${ICONS.leaf}</span> Includes: ${stemSummary}
          </div>

          <div class="product-card-footer">
            <div class="product-card-price">
              <span>Starting from</span>
              <strong>$${minPrice}</strong>
            </div>

            <div class="product-card-actions">
              <button class="btn-card-add" type="button" aria-label="Add ${product.name} to cart">
                + Add
              </button>
            </div>
          </div>
        </div>
      </article>
    `;
  }).join("");
}

export function setSearchQuery(query) {
  // Pass-through if called
}

