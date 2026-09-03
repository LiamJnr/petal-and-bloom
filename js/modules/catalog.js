/**
 * Product Catalog & Filtering Module
 */
import { PRODUCTS } from "../data/products.js";

let activeCategory = "all";
let activeSort = "bestseller";
let activeSearchQuery = "";

let productClickHandler = null;
let quickAddHandler = null;

export function initCatalog({ onProductClick, onQuickAdd }) {
  productClickHandler = onProductClick;
  quickAddHandler = onQuickAdd;

  const filterButtons = document.querySelectorAll(".filter-pill");
  const sortSelect = document.getElementById("catalog-sort");
  const grid = document.getElementById("product-grid");

  // Category filter pills
  filterButtons.forEach(button => {
    button.addEventListener("click", () => {
      filterButtons.forEach(btn => btn.classList.remove("active"));
      button.classList.add("active");
      activeCategory = button.dataset.filter || "all";
      renderCatalog();
    });
  });

  // Sorting dropdown
  sortSelect?.addEventListener("change", (e) => {
    activeSort = e.target.value;
    renderCatalog();
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

  renderCatalog();
}

/**
 * Filter and sort products according to current state
 */
export function getFilteredProducts() {
  let list = [...PRODUCTS];

  // 1. Filter by category
  if (activeCategory !== "all") {
    list = list.filter(p => p.category === activeCategory);
  }

  // 2. Filter by search query
  if (activeSearchQuery) {
    const q = activeSearchQuery.toLowerCase();
    list = list.filter(p => {
      const matchName = p.name.toLowerCase().includes(q);
      const matchSubtitle = p.subtitle.toLowerCase().includes(q);
      const matchDesc = p.description.toLowerCase().includes(q);
      const matchOccasion = p.occasion.toLowerCase().includes(q);
      const matchStems = p.stems.some(s => s.name.toLowerCase().includes(q));
      return matchName || matchSubtitle || matchDesc || matchOccasion || matchStems;
    });
  }

  // 3. Sort list
  switch (activeSort) {
    case "price-low":
      list.sort((a, b) => a.sizes[0].price - b.sizes[0].price);
      break;
    case "price-high":
      list.sort((a, b) => b.sizes[0].price - a.sizes[0].price);
      break;
    case "rating":
      list.sort((a, b) => b.rating - a.rating);
      break;
    case "bestseller":
    default:
      // Keep natural order or prioritize Bestsellers
      list.sort((a, b) => (b.tag === "Bestseller" ? 1 : 0) - (a.tag === "Bestseller" ? 1 : 0));
      break;
  }

  return list;
}

/**
 * Render the filtered product cards into the DOM
 */
export function renderCatalog() {
  const grid = document.getElementById("product-grid");
  const countEl = document.getElementById("catalog-count");
  const filterStatusEl = document.getElementById("filter-status");

  if (!grid) return;

  const items = getFilteredProducts();

  // Update counts / status
  if (countEl) {
    countEl.textContent = `${items.length} arrangement${items.length === 1 ? "" : "s"}`;
  }

  if (filterStatusEl) {
    if (activeSearchQuery) {
      filterStatusEl.innerHTML = `Showing results for <strong>"${activeSearchQuery}"</strong> — <span class="clear-search-link" id="reset-search">Clear Search</span>`;
      document.getElementById("reset-search")?.addEventListener("click", () => {
        setSearchQuery("");
        const searchInput = document.querySelector(".search-input");
        if (searchInput) searchInput.value = "";
      });
    } else {
      filterStatusEl.innerHTML = "";
    }
  }

  // Empty state
  if (items.length === 0) {
    grid.innerHTML = `
      <div class="catalog-empty">
        <div class="catalog-empty-icon">✿</div>
        <h3>No arrangements found</h3>
        <p>We couldn't find any flowers matching your filter criteria. Try searching for a different bloom or reset the filters.</p>
        <button class="button button-dark" id="btn-reset-catalog">View All Flowers</button>
      </div>
    `;

    document.getElementById("btn-reset-catalog")?.addEventListener("click", () => {
      activeCategory = "all";
      activeSearchQuery = "";
      document.querySelectorAll(".filter-pill").forEach(b => {
        b.classList.toggle("active", b.dataset.filter === "all");
      });
      const searchInput = document.querySelector(".search-input");
      if (searchInput) searchInput.value = "";
      renderCatalog();
    });
    return;
  }

  // Generate cards HTML
  grid.innerHTML = items.map(product => {
    const minPrice = Math.min(...product.sizes.map(s => s.price));
    const stemSummary = product.stems.map(s => s.name.split(" ")[0]).slice(0, 2).join(" • ");

    return `
      <article class="product-card" data-slug="${product.slug}" tabindex="0" role="button" aria-label="View details for ${product.name}">
        <div class="product-card-media">
          <img src="${product.images.primary}" alt="${product.name} flower bouquet" loading="lazy" />
          ${product.tag ? `<span class="badge badge-cream product-card-tag">${product.tag}</span>` : ""}
          <button class="product-quick-btn" type="button">Quick View ✿</button>
        </div>

        <div class="product-card-body">
          <div class="product-card-meta">
            <span class="product-card-category">${product.category} • ${product.occasion}</span>
            <div class="stars" title="${product.rating} stars">
              ★ <span>${product.rating}</span>
            </div>
          </div>

          <h3 class="product-card-title">${product.name}</h3>
          <p class="product-card-desc">${product.shortDescription}</p>

          <div class="product-card-stems">
            <span>🌿</span> Includes: ${stemSummary}
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

/**
 * Programmatically update search query
 */
export function setSearchQuery(query) {
  activeSearchQuery = query;
  renderCatalog();
}
