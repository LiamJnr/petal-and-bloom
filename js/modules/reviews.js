/**
 * Client Reviews & Testimonials Module
 */
import { getReviewsForProduct, getReviewMetrics, addReview } from "../data/reviews.js";
import { PRODUCTS } from "../data/products.js";

let onReviewAddedCallback = null;
let currentRatingValue = 5;

export function initReviews({ onReviewAdded }) {
  onReviewAddedCallback = onReviewAdded;

  renderReviews();
  renderReviewModal();
  bindModalEvents();
}

/**
 * Render the review metrics dashboard and review cards list
 */
export function renderReviews() {
  const container = document.getElementById("reviews-container");
  if (!container) return;

  const metrics = getReviewMetrics();
  const reviews = getReviewsForProduct("all");

  const totalReviews = metrics.count;
  const avg = metrics.average;

  // Calculate percentages for distribution bars
  const pct5 = totalReviews > 0 ? Math.round((metrics.distribution[5] / totalReviews) * 100) : 0;
  const pct4 = totalReviews > 0 ? Math.round((metrics.distribution[4] / totalReviews) * 100) : 0;
  const pct3 = totalReviews > 0 ? Math.round((metrics.distribution[3] / totalReviews) * 100) : 0;
  const pct2 = totalReviews > 0 ? Math.round((metrics.distribution[2] / totalReviews) * 100) : 0;
  const pct1 = totalReviews > 0 ? Math.round((metrics.distribution[1] / totalReviews) * 100) : 0;

  container.innerHTML = `
    <!-- Reviews Summary Dashboard -->
    <div class="reviews-dashboard">
      <!-- 1. Score Card -->
      <div class="reviews-score-card">
        <div class="reviews-big-score">${avg}</div>
        <div class="reviews-score-stars">★ ★ ★ ★ ★</div>
        <div class="reviews-total-count">Based on ${totalReviews} verified reviews</div>
      </div>

      <!-- 2. Breakdown Bars -->
      <div class="reviews-bars-col">
        <div class="rating-bar-row">
          <span class="rating-bar-label">5 Stars</span>
          <div class="rating-bar-track">
            <div class="rating-bar-fill" style="width: ${pct5}%"></div>
          </div>
          <span class="rating-bar-count">${metrics.distribution[5]}</span>
        </div>

        <div class="rating-bar-row">
          <span class="rating-bar-label">4 Stars</span>
          <div class="rating-bar-track">
            <div class="rating-bar-fill" style="width: ${pct4}%"></div>
          </div>
          <span class="rating-bar-count">${metrics.distribution[4]}</span>
        </div>

        <div class="rating-bar-row">
          <span class="rating-bar-label">3 Stars</span>
          <div class="rating-bar-track">
            <div class="rating-bar-fill" style="width: ${pct3}%"></div>
          </div>
          <span class="rating-bar-count">${metrics.distribution[3]}</span>
        </div>

        <div class="rating-bar-row">
          <span class="rating-bar-label">2 Stars</span>
          <div class="rating-bar-track">
            <div class="rating-bar-fill" style="width: ${pct2}%"></div>
          </div>
          <span class="rating-bar-count">${metrics.distribution[2]}</span>
        </div>

        <div class="rating-bar-row">
          <span class="rating-bar-label">1 Star</span>
          <div class="rating-bar-track">
            <div class="rating-bar-fill" style="width: ${pct1}%"></div>
          </div>
          <span class="rating-bar-count">${metrics.distribution[1]}</span>
        </div>
      </div>

      <!-- 3. Write a Review Action -->
      <div class="reviews-cta-col">
        <h4>Share Your Bloom Story</h4>
        <p>Purchased an arrangement recently? We'd love to hear about your experience.</p>
        <button class="button button-dark" id="btn-open-review-modal" type="button">
          Write a Review ✍️
        </button>
      </div>
    </div>

    <!-- Review Cards Grid -->
    <div class="reviews-grid">
      ${reviews.map(rev => `
        <article class="review-card" data-review-id="${rev.id}">
          <div class="review-card-header">
            <div class="review-card-stars">
              ${"★".repeat(rev.rating)}${"☆".repeat(5 - rev.rating)}
            </div>
            <span class="review-card-date">${rev.date}</span>
          </div>

          <h3 class="review-card-title">${rev.title}</h3>
          <p class="review-card-comment">"${rev.comment}"</p>

          <div class="review-card-footer">
            <div class="review-author-info">
              <div class="review-author-name">
                ${rev.author}
                ${rev.verified ? `<span class="verified-badge">✓ Verified Buyer</span>` : ""}
              </div>
              <div class="review-variant-tag">${rev.location} • ${rev.variant || "Petal & Bloom Collection"}</div>
            </div>

            <button class="review-helpful-btn" type="button" aria-label="Mark review as helpful">
              👍 Helpful <span>(${rev.helpfulCount})</span>
            </button>
          </div>
        </article>
      `).join("")}
    </div>
  `;

  // Bind helpful buttons
  container.querySelectorAll(".review-helpful-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      if (btn.classList.contains("voted")) return;
      btn.classList.add("voted");
      const span = btn.querySelector("span");
      const currentCount = parseInt(span.textContent.replace(/\D/g, "") || "0", 10);
      span.textContent = `(${currentCount + 1})`;
    });
  });

  // Bind open modal button
  document.getElementById("btn-open-review-modal")?.addEventListener("click", () => {
    openReviewModal();
  });
}

/**
 * Render the modal markup into the DOM if not already present
 */
function renderReviewModal() {
  if (document.getElementById("review-modal-backdrop")) return;

  const modalHtml = `
    <div id="review-modal-backdrop" class="modal-backdrop" aria-hidden="true">
      <div class="review-modal-box" role="dialog" aria-labelledby="modal-title" aria-modal="true">
        <button type="button" class="modal-close-btn" id="modal-close-btn" aria-label="Close modal">&times;</button>
        
        <div class="review-modal-header">
          <h3 id="modal-title">Write a Review</h3>
          <p>Share your experience with our floral arrangements and delivery service.</p>
        </div>

        <form id="review-form" class="review-form">
          <div class="form-group">
            <label for="review-product">Select Bouquet / Gift:</label>
            <select id="review-product" class="form-control" required>
              ${PRODUCTS.map(p => `<option value="${p.slug}">${p.name} (${p.subtitle})</option>`).join("")}
            </select>
          </div>

          <div class="form-group">
            <label>Overall Rating:</label>
            <div class="star-rating-selector" id="star-selector" role="radiogroup" aria-label="Rating out of 5 stars">
              <span data-star="1" class="selected">★</span>
              <span data-star="2" class="selected">★</span>
              <span data-star="3" class="selected">★</span>
              <span data-star="4" class="selected">★</span>
              <span data-star="5" class="selected">★</span>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="review-author">Your Name:</label>
              <input type="text" id="review-author" class="form-control" placeholder="e.g. Sophia Lawrence" required />
            </div>
            <div class="form-group">
              <label for="review-location">City & State:</label>
              <input type="text" id="review-location" class="form-control" placeholder="e.g. New York, NY" required />
            </div>
          </div>

          <div class="form-group">
            <label for="review-title">Review Headline:</label>
            <input type="text" id="review-title" class="form-control" placeholder="e.g. Absolutely breathtaking blooms!" required />
          </div>

          <div class="form-group">
            <label for="review-comment">Your Review:</label>
            <textarea id="review-comment" class="form-control" rows="4" placeholder="Tell us how the flowers arrived, the fragrance, and how long they lasted..." required></textarea>
          </div>

          <div class="review-modal-footer">
            <button type="button" class="button button-light" id="btn-cancel-review">Cancel</button>
            <button type="submit" class="button button-dark">Submit Review 🌸</button>
          </div>
        </form>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML("beforeend", modalHtml);
}

/**
 * Bind modal open/close, star picker, and form submission events
 */
function bindModalEvents() {
  const backdrop = document.getElementById("review-modal-backdrop");
  const closeBtn = document.getElementById("modal-close-btn");
  const cancelBtn = document.getElementById("btn-cancel-review");
  const form = document.getElementById("review-form");
  const starSelector = document.getElementById("star-selector");

  const closeModal = () => {
    backdrop?.classList.remove("open");
    backdrop?.setAttribute("aria-hidden", "true");
  };

  closeBtn?.addEventListener("click", closeModal);
  cancelBtn?.addEventListener("click", closeModal);

  // Close on clicking backdrop outside box
  backdrop?.addEventListener("click", (e) => {
    if (e.target === backdrop) {
      closeModal();
    }
  });

  // Escape key closes modal
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && backdrop?.classList.contains("open")) {
      closeModal();
    }
  });

  // Star selector hover and click interactions
  if (starSelector) {
    const stars = starSelector.querySelectorAll("span");
    
    stars.forEach(star => {
      star.addEventListener("mouseenter", () => {
        const val = parseInt(star.dataset.star, 10);
        stars.forEach((s, idx) => {
          s.classList.toggle("hovered", idx < val);
        });
      });

      star.addEventListener("mouseleave", () => {
        stars.forEach(s => s.classList.remove("hovered"));
      });

      star.addEventListener("click", () => {
        currentRatingValue = parseInt(star.dataset.star, 10);
        stars.forEach((s, idx) => {
          s.classList.toggle("selected", idx < currentRatingValue);
        });
      });
    });
  }

  // Form submission handler
  form?.addEventListener("submit", (e) => {
    e.preventDefault();

    const productSlug = document.getElementById("review-product").value;
    const author = document.getElementById("review-author").value.trim();
    const location = document.getElementById("review-location").value.trim();
    const title = document.getElementById("review-title").value.trim();
    const comment = document.getElementById("review-comment").value.trim();

    const newReview = addReview({
      productSlug,
      author,
      location,
      title,
      comment,
      rating: currentRatingValue,
      variant: "Verified Purchase"
    });

    // Re-render reviews
    renderReviews();
    closeModal();
    form.reset();

    // Trigger toast alert
    if (typeof onReviewAddedCallback === "function") {
      onReviewAddedCallback(newReview);
    }
  });
}

/**
 * Public helper to open the review modal
 */
export function openReviewModal() {
  const backdrop = document.getElementById("review-modal-backdrop");
  if (backdrop) {
    backdrop.classList.add("open");
    backdrop.setAttribute("aria-hidden", "false");
    document.getElementById("review-author")?.focus();
  }
}
