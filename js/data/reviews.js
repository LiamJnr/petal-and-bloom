/**
 * Petal & Bloom — Client Reviews Data Store
 * Includes verified customer feedback, star ratings, and storewide reviews.
 */

export const REVIEWS = [
  {
    id: "rev-1",
    productSlug: "rose-garden",
    author: "Eleanor Vance",
    location: "Brooklyn, NY",
    rating: 5,
    date: "2 days ago",
    verified: true,
    title: "Absolutely stunning and lasted over 10 days!",
    comment: "I ordered the Deluxe Rose Garden for our anniversary. The blooms arrived looking fresh as morning dew and opened into the most fragrant, lush roses I have ever seen. My partner was speechless.",
    variant: "Size: Deluxe • Craft Wrap",
    helpfulCount: 14
  },
  {
    id: "rev-2",
    productSlug: "blush-peonies",
    author: "Camilla Moreau",
    location: "San Francisco, CA",
    rating: 5,
    date: "1 week ago",
    verified: true,
    title: "The peony quality is unmatched.",
    comment: "Finding real, premium Sarah Bernhardt peonies online is always a gamble, but Petal & Bloom knocked it out of the park. The ceramic pot is gorgeous as a permanent keepsake too.",
    variant: "Size: Grand Luxe • Ceramic Pot",
    helpfulCount: 22
  },
  {
    id: "rev-3",
    productSlug: "sunday-tulips",
    author: "Marcus Sterling",
    location: "Austin, TX",
    rating: 5,
    date: "2 weeks ago",
    verified: true,
    title: "Brightened up the entire apartment",
    comment: "Ordered these for my sister after her promotion. She sent a photo every day showing how they grew and unfurled toward the morning window. Super fast and reliable delivery.",
    variant: "Size: Deluxe • Clear Glass Vase",
    helpfulCount: 9
  },
  {
    id: "rev-4",
    productSlug: "birthday-bloom-box",
    author: "Chloe Davenport",
    location: "Chicago, IL",
    rating: 5,
    date: "3 weeks ago",
    verified: true,
    title: "The complete birthday package was a lifesaver!",
    comment: "The handwritten letterpress card added such an intimate, luxury touch. Everything arrived securely boxed in pristine condition. Will definitely be ordering my holiday gifts here.",
    variant: "Size: Deluxe Box",
    helpfulCount: 19
  },
  {
    id: "rev-5",
    productSlug: "little-daisy",
    author: "Hannah Zhao",
    location: "Seattle, WA",
    rating: 5,
    date: "1 month ago",
    verified: true,
    title: "Sweetest desk bouquet ever",
    comment: "Such a charming, happy little bouquet! Perfect size for a desk or bedside table. The chamomile scent is subtle and refreshing.",
    variant: "Size: Classic • Craft Wrap",
    helpfulCount: 7
  },
  {
    id: "rev-6",
    productSlug: "sweetheart",
    author: "Julien Mercer",
    location: "Boston, MA",
    rating: 5,
    date: "1 month ago",
    verified: true,
    title: "Ethereal colors and fabulous arrangement",
    comment: "The mix of fresh blush roses and soft dried botanicals is genius. It keeps looking beautiful even as the days pass. 10/10 floristry.",
    variant: "Size: Deluxe • Craft Wrap",
    helpfulCount: 11
  },
  {
    id: "rev-7",
    productSlug: "wildflower-muse",
    author: "Sienna Miller",
    location: "Denver, CO",
    rating: 4,
    date: "1 month ago",
    verified: true,
    title: "Felt like a fresh meadow in the countryside",
    comment: "Loved the organic and whimsical feel of this arrangement. Stems were crisp and very sturdy. Arrived exactly on the chosen delivery date.",
    variant: "Size: Deluxe • Clear Glass Vase",
    helpfulCount: 8
  },
  {
    id: "rev-8",
    productSlug: "rose-garden",
    author: "David & Clara H.",
    location: "Portland, OR",
    rating: 5,
    date: "2 months ago",
    verified: true,
    title: "Far superior to traditional flower delivery chains",
    comment: "You can genuinely tell this is run by passionate artisan florists. No crushed petals, no wilted fillers—just pure luxury and care.",
    variant: "Size: Grand Luxe • Clear Glass Vase",
    helpfulCount: 16
  }
];

// In-memory reviews store to allow optimistic additions
let dynamicReviews = [...REVIEWS];

/**
 * Get reviews for a specific product or all storewide reviews
 */
export function getReviewsForProduct(productSlug) {
  if (!productSlug || productSlug === "all") {
    return dynamicReviews;
  }
  return dynamicReviews.filter(r => r.productSlug === productSlug);
}

/**
 * Calculate review statistics (average, count, rating distribution)
 */
export function getReviewMetrics(productSlug = null) {
  const list = productSlug ? getReviewsForProduct(productSlug) : dynamicReviews;
  const count = list.length;
  if (count === 0) {
    return { average: 5.0, count: 0, distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 } };
  }

  const sum = list.reduce((acc, r) => acc + r.rating, 0);
  const average = Number((sum / count).toFixed(1));

  const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  list.forEach(r => {
    if (distribution[r.rating] !== undefined) {
      distribution[r.rating]++;
    }
  });

  return { average, count, distribution };
}

/**
 * Add a new user review
 */
export function addReview(newReview) {
  const review = {
    id: `rev-${Date.now()}`,
    date: "Just now",
    verified: true,
    helpfulCount: 0,
    ...newReview
  };
  dynamicReviews.unshift(review);
  return review;
}
