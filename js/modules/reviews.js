/**
 * Client Reviews & Testimonials Module
 */
import { getReviewsForProduct, getReviewMetrics } from "../data/reviews.js";

let onReviewAddedCallback = null;

export function initReviews({ onReviewAdded } = {}) {
  onReviewAddedCallback = onReviewAdded;
  renderReviews();
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

      <!-- 3. Quality Assurance Column -->
      <div class="reviews-cta-col">
        <h4>100% Real Customer Feedback</h4>
        <p>Every review is collected from verified deliveries with our standard 7-day bloom guarantee.</p>
      </div>
    </div>

    <!-- Reviews Grid -->
    <div class="reviews-grid" id="reviews-cards-grid">
      ${reviews.map(rev => `
        <article class="review-card" data-rating="${rev.rating}">
          <div class="review-card-header">
            <div class="reviewer-profile">
              <div class="reviewer-avatar">${rev.author.charAt(0)}</div>
              <div>
                <div class="reviewer-name">${rev.author}</div>
                <div class="reviewer-verified">✓ Verified Recipient</div>
              </div>
            </div>
            <div class="review-card-stars">${"★".repeat(rev.rating)}</div>
          </div>

          <div class="review-product-tag">${rev.productName || "Bouquet"}</div>
          <h4 class="review-card-title">${rev.title}</h4>
          <p class="review-card-comment">"${rev.comment}"</p>

          <div class="review-card-footer">
            <span>${rev.location || "Local Delivery"}</span>
            <span>${rev.date || "Recent"}</span>
          </div>
        </article>
      `).join("")}
    </div>
  `;
}
