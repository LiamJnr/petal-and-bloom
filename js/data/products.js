/**
 * Petal & Bloom — Product Catalog Data Store
 * Structured with rich florist metadata, variant pricing, stem counts, and Lemon Squeezy endpoints.
 */

export const PRODUCTS = [
  {
    id: "rose-garden",
    slug: "rose-garden",
    name: "Rose Garden",
    subtitle: "Timeless Romantic Bouquet",
    category: "bouquet",
    occasion: "Romantic",
    tag: "Bestseller",
    rating: 4.9,
    reviewCount: 42,
    images: {
      primary: "images/roses.jpg",
      gallery: [
        "images/roses.jpg",
        "images/sweetheart.jpg",
        "images/flower-shop.jpg"
      ]
    },
    shortDescription: "A timeless arrangement of soft, velvety roses hand-tied with fragrant garden foliage.",
    description: "Our signature Rose Garden bouquet brings classic romance into modern floristry. Curated with premium garden roses, spray roses, and silver dollar eucalyptus, each stem is selected at peak bloom to guarantee over a week of breathtaking elegance in your home.",
    stems: [
      { name: "Premium Ecuadorian Roses", count: 12 },
      { name: "Blush Spray Roses", count: 6 },
      { name: "Silver Dollar Eucalyptus", count: 4 },
      { name: "Waxflower Accent", count: 3 }
    ],
    careGuide: [
      "Trim stems at a 45-degree angle under cool running water before placing in vase.",
      "Replace vase water every 2 days with cold, fresh water and flower food.",
      "Keep away from direct sunlight, drafts, and ripening fruit to extend longevity."
    ],
    sizes: [
      { id: "classic", name: "Classic", stems: "18-20 stems", price: 48, default: false },
      { id: "deluxe", name: "Deluxe", stems: "28-30 stems", price: 68, default: true },
      { id: "grand", name: "Grand Luxe", stems: "40-42 stems", price: 92, default: false }
    ],
    vases: [
      { id: "none", name: "Florist Craft Paper Wrap", price: 0 },
      { id: "glass", name: "Fluted Clear Glass Vase", price: 14 },
      { id: "ceramic", name: "Artisan Matte Ceramic Pot", price: 24 }
    ],
    checkoutUrls: {
      classic: "https://petal-bloom.lemonsqueezy.com/checkout/buy/ca127936-83ba-44fe-a8f2-e9df98b47ed6",
      deluxe: "https://petal-bloom.lemonsqueezy.com/checkout/buy/ca127936-83ba-44fe-a8f2-e9df98b47ed6",
      grand: "https://petal-bloom.lemonsqueezy.com/checkout/buy/ca127936-83ba-44fe-a8f2-e9df98b47ed6"
    }
  },
  {
    id: "sunday-tulips",
    slug: "sunday-tulips",
    name: "Sunday Tulips",
    subtitle: "Fresh Spring Whispers",
    category: "bouquet",
    occasion: "Everyday",
    tag: "Fresh Seasonal",
    rating: 4.8,
    reviewCount: 31,
    images: {
      primary: "images/tulip.jpg",
      gallery: [
        "images/tulip.jpg",
        "images/wildflower.jpg",
        "images/flower-shop.jpg"
      ]
    },
    shortDescription: "Fresh, cheerful Dutch tulips with vibrant color transitions that continue opening gently in vase.",
    description: "Evoking lazy Sunday mornings in spring, this cheerful bouquet features a harmonic gradient of pastel and crisp sunset tulips. Tulips continue to grow and dance toward the light, making this a dynamic living centerpiece.",
    stems: [
      { name: "Dutch Parrot Tulips", count: 14 },
      { name: "French Single Late Tulips", count: 8 },
      { name: "Ruscus Foliage", count: 4 }
    ],
    careGuide: [
      "Tulips love ice-cold water; drop an ice cube in daily.",
      "Prick stem 1/4 inch below flower head with a clean pin to keep stems standing tall.",
      "Trim 1 cm off stems every other day."
    ],
    sizes: [
      { id: "classic", name: "Classic", stems: "16-18 stems", price: 38, default: false },
      { id: "deluxe", name: "Deluxe", stems: "24-26 stems", price: 54, default: true },
      { id: "grand", name: "Grand Luxe", stems: "34-36 stems", price: 76, default: false }
    ],
    vases: [
      { id: "none", name: "Florist Craft Paper Wrap", price: 0 },
      { id: "glass", name: "Fluted Clear Glass Vase", price: 14 },
      { id: "ceramic", name: "Artisan Matte Ceramic Pot", price: 24 }
    ],
    checkoutUrls: {
      classic: "https://petal-bloom.lemonsqueezy.com/checkout/buy/b765dc63-9ead-4d94-aa5c-2d3f8b2dedbc",
      deluxe: "https://petal-bloom.lemonsqueezy.com/checkout/buy/b765dc63-9ead-4d94-aa5c-2d3f8b2dedbc",
      grand: "https://petal-bloom.lemonsqueezy.com/checkout/buy/b765dc63-9ead-4d94-aa5c-2d3f8b2dedbc"
    }
  },
  {
    id: "blush-peonies",
    slug: "blush-peonies",
    name: "Blush Peonies",
    subtitle: "Signature Luxury Blooms",
    category: "luxury",
    occasion: "Celebration",
    tag: "Florist Favorite",
    rating: 5.0,
    reviewCount: 56,
    images: {
      primary: "images/peonies.jpg",
      gallery: [
        "images/peonies.jpg",
        "images/roses.jpg",
        "images/hero2.jpg"
      ]
    },
    shortDescription: "Full, cloud-like ruffled peonies arranged for an effortlessly opulent and fragrant statement.",
    description: "The crown jewel of seasonal floristry. Our Blush Peonies arrangement features voluptuous, fragrant Sarah Bernhardt blooms paired with delicate white astilbe and Italian ruscus. Their layered petals unfurl luxuriously over 5 to 7 days.",
    stems: [
      { name: "Sarah Bernhardt Peonies", count: 10 },
      { name: "White Ranunculus", count: 6 },
      { name: "Astilbe Pink Feathers", count: 5 },
      { name: "Italian Ruscus", count: 4 }
    ],
    careGuide: [
      "To encourage tight buds to open faster, place in lukewarm water in a bright room.",
      "Mist petals lightly with fine water spray in the morning.",
      "Remove any outer guard petals that naturally brown as the blossom opens."
    ],
    sizes: [
      { id: "classic", name: "Classic", stems: "12-14 stems", price: 58, default: false },
      { id: "deluxe", name: "Deluxe", stems: "20-22 stems", price: 82, default: true },
      { id: "grand", name: "Grand Luxe", stems: "30-32 stems", price: 118, default: false }
    ],
    vases: [
      { id: "none", name: "Florist Craft Paper Wrap", price: 0 },
      { id: "glass", name: "Fluted Clear Glass Vase", price: 14 },
      { id: "ceramic", name: "Artisan Matte Ceramic Pot", price: 24 }
    ],
    checkoutUrls: {
      classic: "https://petal-bloom.lemonsqueezy.com/checkout/buy/40b41c5e-b7c8-4897-92f9-e43d50c9fdab",
      deluxe: "https://petal-bloom.lemonsqueezy.com/checkout/buy/40b41c5e-b7c8-4897-92f9-e43d50c9fdab",
      grand: "https://petal-bloom.lemonsqueezy.com/checkout/buy/40b41c5e-b7c8-4897-92f9-e43d50c9fdab"
    }
  },
  {
    id: "little-daisy",
    slug: "little-daisy",
    name: "Little Daisy",
    subtitle: "Everyday Sunshine Gesture",
    category: "gift",
    occasion: "Thank You",
    tag: "Gift Pick",
    rating: 4.7,
    reviewCount: 28,
    images: {
      primary: "images/daisies.jpg",
      gallery: [
        "images/daisies.jpg",
        "images/wildflower.jpg",
        "images/sweetheart.jpg"
      ]
    },
    shortDescription: "A sweet, cheerful floral gesture designed for an ordinary day made bright and sunny.",
    description: "Nothing spreads pure spontaneous happiness like fresh chamomile daisies, golden buttons, and seeded eucalyptus. Packed with playful textures, this petite arrangement is ideal for bedside tables, home offices, or a sweet 'thinking of you' surprise.",
    stems: [
      { name: "Chamomile Daisies", count: 15 },
      { name: "Feverfew Stems", count: 8 },
      { name: "Solidago Goldenrod", count: 4 },
      { name: "Seeded Eucalyptus", count: 3 }
    ],
    careGuide: [
      "Keep water fresh and clear; daisies drink quickly.",
      "Pinch off spent blooms to allow smaller secondary buds to bloom."
    ],
    sizes: [
      { id: "classic", name: "Petite", stems: "14-16 stems", price: 28, default: true },
      { id: "deluxe", name: "Classic", stems: "22-24 stems", price: 42, default: false },
      { id: "grand", name: "Full Bunch", stems: "32-34 stems", price: 58, default: false }
    ],
    vases: [
      { id: "none", name: "Florist Craft Paper Wrap", price: 0 },
      { id: "glass", name: "Fluted Clear Glass Vase", price: 14 },
      { id: "ceramic", name: "Artisan Matte Ceramic Pot", price: 24 }
    ],
    checkoutUrls: {
      classic: "https://petal-bloom.lemonsqueezy.com/checkout/buy/25914755-bf53-4d1c-86d2-28276b7600a5",
      deluxe: "https://petal-bloom.lemonsqueezy.com/checkout/buy/25914755-bf53-4d1c-86d2-28276b7600a5",
      grand: "https://petal-bloom.lemonsqueezy.com/checkout/buy/25914755-bf53-4d1c-86d2-28276b7600a5"
    }
  },
  {
    id: "sweetheart",
    slug: "sweetheart",
    name: "Sweetheart",
    subtitle: "Modern Romantic Harmony",
    category: "bouquet",
    occasion: "Romantic",
    tag: "Popular",
    rating: 4.9,
    reviewCount: 39,
    images: {
      primary: "images/sweetheart.jpg",
      gallery: [
        "images/sweetheart.jpg",
        "images/roses.jpg",
        "images/peonies.jpg"
      ]
    },
    shortDescription: "A romantic blend of blush spray roses, carnations, and dried botanicals crafted with love.",
    description: "Created for those who adore soft blush hues and delicate petal movement. The Sweetheart pairs garden-fresh blooms with textured lavender sprigs and bunny tails for an ethereal keepsake aesthetic.",
    stems: [
      { name: "Blush Garden Carnations", count: 8 },
      { name: "Pink Tea Roses", count: 8 },
      { name: "Bleached Bunny Tails", count: 6 },
      { name: "Baby’s Breath Cloud", count: 4 }
    ],
    careGuide: [
      "Snip 1 inch off the bottom stems before arranging.",
      "Keep away from direct AC air vents."
    ],
    sizes: [
      { id: "classic", name: "Classic", stems: "16 stems", price: 36, default: false },
      { id: "deluxe", name: "Deluxe", stems: "24 stems", price: 52, default: true },
      { id: "grand", name: "Grand Luxe", stems: "34 stems", price: 74, default: false }
    ],
    vases: [
      { id: "none", name: "Florist Craft Paper Wrap", price: 0 },
      { id: "glass", name: "Fluted Clear Glass Vase", price: 14 },
      { id: "ceramic", name: "Artisan Matte Ceramic Pot", price: 24 }
    ],
    checkoutUrls: {
      classic: "https://petal-bloom.lemonsqueezy.com/checkout/buy/0474ced0-e00c-4205-b8cd-0094f3aa9bb7",
      deluxe: "https://petal-bloom.lemonsqueezy.com/checkout/buy/0474ced0-e00c-4205-b8cd-0094f3aa9bb7",
      grand: "https://petal-bloom.lemonsqueezy.com/checkout/buy/0474ced0-e00c-4205-b8cd-0094f3aa9bb7"
    }
  },
  {
    id: "wildflower-muse",
    slug: "wildflower-muse",
    name: "Wildflower Muse",
    subtitle: "Meadow-Inspired Botanical Art",
    category: "bouquet",
    occasion: "Everyday",
    tag: "Artisan Choice",
    rating: 4.8,
    reviewCount: 34,
    images: {
      primary: "images/wildflower.jpg",
      gallery: [
        "images/wildflower.jpg",
        "images/daisies.jpg",
        "images/tulip.jpg"
      ]
    },
    shortDescription: "Loose, whimsical blooms and airy greenery inspired by a sunlit countryside meadow.",
    description: "Organic, free-form, and bursting with botanical personality. Wildflower Muse captures the wild beauty of summer hillsides, blending cosmos, delphiniums, scabiosa, and wild grasses into a naturally poetic composition.",
    stems: [
      { name: "Blue Bell Scabiosa", count: 6 },
      { name: "Pink Cosmos", count: 8 },
      { name: "Snapdragons", count: 5 },
      { name: "Meadow Foxtail Grass", count: 6 }
    ],
    careGuide: [
      "Remove any lower leaves that submerge below the waterline.",
      "Give stems a fresh diagonal cut every 2 days."
    ],
    sizes: [
      { id: "classic", name: "Classic", stems: "18-20 stems", price: 34, default: false },
      { id: "deluxe", name: "Deluxe", stems: "28-30 stems", price: 50, default: true },
      { id: "grand", name: "Grand Luxe", stems: "38-40 stems", price: 72, default: false }
    ],
    vases: [
      { id: "none", name: "Florist Craft Paper Wrap", price: 0 },
      { id: "glass", name: "Fluted Clear Glass Vase", price: 14 },
      { id: "ceramic", name: "Artisan Matte Ceramic Pot", price: 24 }
    ],
    checkoutUrls: {
      classic: "https://petal-bloom.lemonsqueezy.com/checkout/buy/3de4c4ec-274d-42e1-9983-aa9c1fb29bc1",
      deluxe: "https://petal-bloom.lemonsqueezy.com/checkout/buy/3de4c4ec-274d-42e1-9983-aa9c1fb29bc1",
      grand: "https://petal-bloom.lemonsqueezy.com/checkout/buy/3de4c4ec-274d-42e1-9983-aa9c1fb29bc1"
    }
  },
  {
    id: "birthday-bloom-box",
    slug: "birthday-bloom-box",
    name: "Birthday Bloom Box",
    subtitle: "All-in-One Celebration Gift Set",
    category: "celebration",
    occasion: "Birthday",
    tag: "Celebration Bundle",
    rating: 5.0,
    reviewCount: 48,
    images: {
      primary: "images/birthday-bloom.jpg",
      gallery: [
        "images/birthday-bloom.jpg",
        "images/peonies.jpg",
        "images/flower-shop.jpg"
      ]
    },
    shortDescription: "Complete celebration set featuring a celebratory bouquet, letterpress birthday card, and treats.",
    description: "Make their milestone unforgettable! The Birthday Bloom Box includes an artfully composed bouquet of pastel roses and lilies, an artisan gold-foil birthday card with your custom printed message, and a keepsake florist vase.",
    stems: [
      { name: "Celebration Roses", count: 10 },
      { name: "Pink Asiatic Lilies", count: 4 },
      { name: "Lisianthus Blossoms", count: 6 },
      { name: "Eucalyptus Sprigs", count: 4 }
    ],
    careGuide: [
      "Remove lily pollen anthers carefully to avoid staining petals or fabrics.",
      "Keep in a cool spot away from sunlight."
    ],
    sizes: [
      { id: "classic", name: "Standard Box", stems: "Includes Card + Bouquet", price: 54, default: false },
      { id: "deluxe", name: "Deluxe Box (with Vase)", stems: "Card + Bouquet + Glass Vase", price: 68, default: true },
      { id: "grand", name: "VIP Luxe Box", stems: "Card + Grand Bouquet + Ceramic Vase", price: 95, default: false }
    ],
    vases: [
      { id: "included", name: "Celebration Packaging & Box (Included)", price: 0 }
    ],
    checkoutUrls: {
      classic: "https://petal-bloom.lemonsqueezy.com/checkout/buy/f8f48919-b03b-42af-b8e7-e7a15b67fba8",
      deluxe: "https://petal-bloom.lemonsqueezy.com/checkout/buy/f8f48919-b03b-42af-b8e7-e7a15b67fba8",
      grand: "https://petal-bloom.lemonsqueezy.com/checkout/buy/f8f48919-b03b-42af-b8e7-e7a15b67fba8"
    }
  }
];

/**
 * Helper to get a single product by ID or slug
 */
export function getProductBySlug(slug) {
  return PRODUCTS.find(p => p.slug === slug || p.id === slug) || null;
}

/**
 * Helper to get related products (excluding current product)
 */
export function getRelatedProducts(currentSlug, limit = 3) {
  const current = getProductBySlug(currentSlug);
  if (!current) return PRODUCTS.slice(0, limit);

  const filtered = PRODUCTS.filter(p => p.slug !== current.slug);
  const sameCategory = filtered.filter(p => p.category === current.category);
  const others = filtered.filter(p => p.category !== current.category);

  return [...sameCategory, ...others].slice(0, limit);
}
