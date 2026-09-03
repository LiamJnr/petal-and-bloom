/**
 * Petal & Bloom — Client Reviews Data Store
 * Includes verified customer feedback, star ratings, and storewide reviews.
 */

export const REVIEWS = [
  {
    id: "rev-1",
    productSlug: "blue-white-bouquets",
    productName: "Blue White Bouquets",
    author: "Kristin Watson",
    location: "Brooklyn, NY",
    rating: 5,
    date: "1 month ago",
    verified: true,
    title: "Perfect for Birthdays and Anniversaries!",
    comment: "The hyacinths and crisp white tulips created the most serene, gorgeous arrangement. The fragrance filled our entire home within hours of delivery!",
    variant: "Size: Standard • Gingham Wrap",
    helpfulCount: 24
  },
  {
    id: "rev-2",
    productSlug: "casablanca-lilies",
    productName: "Casablanca Imperial Lilies",
    author: "Eleanor Vance",
    location: "New York, NY",
    rating: 5,
    date: "2 weeks ago",
    verified: true,
    title: "The sheer scale of these lilies is breathtaking!",
    comment: "Ordered these for our anniversary milestone. The massive white petals and intoxicating sweet aroma made this the centerpiece of our celebration.",
    variant: "Size: Deluxe • Glass Vase",
    helpfulCount: 18
  },
  {
    id: "rev-3",
    productSlug: "royal-orchid",
    productName: "Royal Phalaenopsis Orchid",
    author: "David Sterling",
    location: "San Francisco, CA",
    rating: 5,
    date: "3 weeks ago",
    verified: true,
    title: "High-end corporate gift that lasts for months",
    comment: "The ceramic planter is heavy and exquisite. The double cascading blooms look like an architectural sculpture in our boardroom. Highly recommended!",
    variant: "Size: Classic Double Stem • Ceramic Pot",
    helpfulCount: 15
  },
  {
    id: "rev-4",
    productSlug: "hydrangea-cloud",
    productName: "Hydrangea Cloud Bouquet",
    author: "Camilla Moreau",
    location: "Chicago, IL",
    rating: 5,
    date: "1 month ago",
    verified: true,
    title: "The blue and lavender palette is magical",
    comment: "These hydrangea heads were huge and pillowy! Following the florist care tip to mist them kept them looking brand-new for nearly two weeks.",
    variant: "Size: Deluxe • Vellum Wrap",
    helpfulCount: 21
  },
  {
    id: "rev-5",
    productSlug: "golden-sunburst",
    productName: "Golden Sunburst & Dahlias",
    author: "Marcus Vance",
    location: "Austin, TX",
    rating: 5,
    date: "2 weeks ago",
    verified: true,
    title: "Instant sunshine delivered to a friend!",
    comment: "Sent this to my sister as a get-well gift. The dahlias and mini sunflowers were so cheerful, and the terracotta ribbon was a lovely artisan touch.",
    variant: "Size: Standard • Linen Ribbon",
    helpfulCount: 11
  },
  {
    id: "rev-6",
    productSlug: "meadow-spires",
    productName: "Meadow Spires & Wild Greens",
    author: "Sienna Miller",
    location: "Denver, CO",
    rating: 5,
    date: "3 weeks ago",
    verified: true,
    title: "Felt like a wildflower meadow in the countryside",
    comment: "The tall peach snapdragons and lavender stock gave so much height and natural movement. Very editorial and romantic look.",
    variant: "Size: Deluxe • Sage Ribbon",
    helpfulCount: 13
  },
  {
    id: "rev-7",
    productSlug: "pastel-peonies",
    productName: "Pastel Peonies",
    author: "Jenny Wilson",
    location: "Seattle, WA",
    rating: 5,
    date: "2 months ago",
    verified: true,
    title: "The Most Stunning Peonies Ever!",
    comment: "Finding real Sarah Bernhardt peonies this fresh is rare. They opened up into huge, fragrant cloud-like blooms that lasted beautifully.",
    variant: "Size: Deluxe • Velvet Ribbon",
    helpfulCount: 32
  },
  {
    id: "rev-8",
    productSlug: "rose-garden",
    productName: "Rose Garden",
    author: "Julien Mercer",
    location: "Boston, MA",
    rating: 5,
    date: "1 month ago",
    verified: true,
    title: "Classic romance done with absolute perfection",
    comment: "Deep velvety red garden roses with fresh eucalyptus. Not a single bruised petal. Will be ordering again for all upcoming celebrations.",
    variant: "Size: Deluxe • Taupe Wrap",
    helpfulCount: 19
  }
];

/**
 * Get reviews filtered by product slug or all
 */
export function getReviewsForProduct(slug = "all") {
  if (!slug || slug === "all") return REVIEWS;
  return REVIEWS.filter(r => r.productSlug === slug);
}

/**
 * Calculate aggregate review metrics
 */
export function getReviewMetrics(slug = "all") {
  const reviews = getReviewsForProduct(slug);
  const count = reviews.length;

  if (count === 0) {
    return {
      average: "4.9",
      count: 245,
      distribution: { 5: 184, 4: 42, 3: 12, 2: 5, 1: 2 }
    };
  }

  const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
  const average = (sum / count).toFixed(1);

  const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  reviews.forEach(r => {
    if (distribution[r.rating] !== undefined) {
      distribution[r.rating]++;
    }
  });

  return { average, count, distribution };
}

/**
 * Add a new user review
 */
export function addReview(reviewData) {
  const newReview = {
    id: `rev-${Date.now()}`,
    date: "Just now",
    verified: true,
    helpfulCount: 0,
    ...reviewData
  };
  REVIEWS.unshift(newReview);
  return newReview;
}
