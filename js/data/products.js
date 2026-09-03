/**
 * Petal & Bloom — Product Catalog Data Store
 * Comprehensive luxury collection balancing focal staples, voluminous mass, statement luxury, and textural fillers.
 */

export const PRODUCTS = [
  {
    id: "blue-white-bouquets",
    slug: "blue-white-bouquets",
    name: "Blue White Bouquets",
    subtitle: "Serene Hyacinths & Spring White Tulips",
    category: "bouquet",
    occasion: "Birthday & Anniversaries",
    tag: "Bestseller",
    rating: 4.9,
    reviewCount: 245,
    images: {
      primary: "images/hyacinth.webp",
      gallery: [
        "images/hyacinth.webp",
        "images/tulips.webp",
        "images/roses.webp",
        "images/sweetheart.webp"
      ]
    },
    shortDescription: "A serene harmony of fragrant royal blue hyacinths and crisp white Dutch tulips, tied with signature gingham ribbon.",
    description: "Our signature Blue White Bouquet captures the crisp elegance of spring botanical gardens. Hand-tied with sweet-scented blue hyacinths, pure white Dutch tulips, and silver dollar eucalyptus, this arrangement brings calming sophistication and gentle fragrance to any room.",
    stems: [
      { name: "Royal Blue Hyacinths", count: 10 },
      { name: "Crisp White Dutch Tulips", count: 12 },
      { name: "Silver Dollar Eucalyptus", count: 5 }
    ],
    careGuide: [
      "Trim stems at a 45-degree angle under cool running water before placing in a clean vase.",
      "Hyacinths and tulips drink lots of water; refresh with cold water daily.",
      "Keep away from direct sunlight, drafts, and ripening fruit to maximize bloom lifespan."
    ],
    sizes: [
      { id: "standard", name: "Standard", stems: "18-20 stems", price: 45, default: true },
      { id: "deluxe", name: "Deluxe", stems: "28-30 stems", price: 60, default: false },
      { id: "premium", name: "Premium", stems: "40-42 stems", price: 90, default: false }
    ],
    vases: [
      { id: "none", name: "Gingham Check Wrap", price: 0 },
      { id: "glass", name: "Fluted Clear Glass Vase", price: 14 },
      { id: "ceramic", name: "Artisan Matte Ceramic Pot", price: 24 }
    ],
    checkoutUrls: {
      standard: "https://petal-bloom.lemonsqueezy.com/checkout/buy/ca127936-83ba-44fe-a8f2-e9df98b47ed6",
      deluxe: "https://petal-bloom.lemonsqueezy.com/checkout/buy/ca127936-83ba-44fe-a8f2-e9df98b47ed6",
      premium: "https://petal-bloom.lemonsqueezy.com/checkout/buy/ca127936-83ba-44fe-a8f2-e9df98b47ed6"
    }
  },
  {
    id: "rose-garden",
    slug: "rose-garden",
    name: "Rose Garden",
    subtitle: "Timeless Crimson & Velvet Garden Roses",
    category: "bouquet",
    occasion: "Romantic",
    tag: "Classic Romance",
    rating: 4.9,
    reviewCount: 88,
    images: {
      primary: "images/roses.webp",
      gallery: [
        "images/roses.webp",
        "images/sweetheart.webp",
        "images/peonies.webp",
        "images/hyacinth.webp"
      ]
    },
    shortDescription: "A timeless arrangement of velvety Ecuadorian red roses and delicate blush garden spray roses.",
    description: "Our signature Rose Garden bouquet brings classic romance into modern floristry. Curated with premium garden roses, blush spray roses, and seeded eucalyptus, each stem is selected at peak bud to guarantee over a week of breathtaking elegance in your home.",
    stems: [
      { name: "Premium Ecuadorian Red Roses", count: 12 },
      { name: "Blush Garden Spray Roses", count: 6 },
      { name: "Seeded Eucalyptus", count: 4 },
      { name: "White Waxflower Accents", count: 3 }
    ],
    careGuide: [
      "Trim stems at a 45-degree angle under cool running water before placing in vase.",
      "Replace vase water every 2 days with cold, fresh water and flower food.",
      "Remove any guard petals gently for full opening."
    ],
    sizes: [
      { id: "standard", name: "Standard", stems: "18-20 stems", price: 48, default: true },
      { id: "deluxe", name: "Deluxe", stems: "28-30 stems", price: 68, default: false },
      { id: "premium", name: "Premium", stems: "40-42 stems", price: 95, default: false }
    ],
    vases: [
      { id: "none", name: "Luxury Matte Taupe Wrap", price: 0 },
      { id: "glass", name: "Fluted Clear Glass Vase", price: 14 },
      { id: "ceramic", name: "Artisan Matte Ceramic Pot", price: 24 }
    ],
    checkoutUrls: {
      standard: "https://petal-bloom.lemonsqueezy.com/checkout/buy/ca127936-83ba-44fe-a8f2-e9df98b47ed6",
      deluxe: "https://petal-bloom.lemonsqueezy.com/checkout/buy/ca127936-83ba-44fe-a8f2-e9df98b47ed6",
      premium: "https://petal-bloom.lemonsqueezy.com/checkout/buy/ca127936-83ba-44fe-a8f2-e9df98b47ed6"
    }
  },
  {
    id: "casablanca-lilies",
    slug: "casablanca-lilies",
    name: "Casablanca Imperial Lilies",
    subtitle: "Grand White Oriental Lilies & Italian Ruscus",
    category: "luxury",
    occasion: "Celebrations",
    tag: "Statement Scale",
    rating: 5.0,
    reviewCount: 64,
    images: {
      primary: "images/lilies.webp",
      gallery: [
        "images/lilies.webp",
        "images/orchids.webp",
        "images/spires.webp",
        "images/hydrangea.webp"
      ]
    },
    shortDescription: "Dramatic, intoxicatingly fragrant pure white Oriental lilies paired with emerald Italian ruscus.",
    description: "An awe-inspiring statement of pure elegance. Casablanca lilies are renowned for their dramatic scale, sculptural star-shaped petals, and intoxicating sweet perfume. Hand-arranged with Italian ruscus and silver dollar eucalyptus in a champagne silk ribbon wrap.",
    stems: [
      { name: "Grand Casablanca Oriental Lilies", count: 8 },
      { name: "Italian Ruscus Spires", count: 6 },
      { name: "Silver Dollar Eucalyptus", count: 4 }
    ],
    careGuide: [
      "Gently remove pollen anthers as blooms open to prevent petal staining.",
      "Recut 1 inch off bottom of stems every 3 days in cold fresh water.",
      "Keep in a cool room away from direct heaters and air conditioning."
    ],
    sizes: [
      { id: "standard", name: "Standard", stems: "16-18 blooms", price: 65, default: true },
      { id: "deluxe", name: "Deluxe", stems: "24-26 blooms", price: 85, default: false },
      { id: "premium", name: "Premium", stems: "34-36 blooms", price: 120, default: false }
    ],
    vases: [
      { id: "none", name: "Beige Kraft Wrap & Silk Ribbon", price: 0 },
      { id: "glass", name: "Fluted Clear Glass Vase", price: 14 },
      { id: "ceramic", name: "Artisan Matte Ceramic Pot", price: 24 }
    ],
    checkoutUrls: {
      standard: "https://petal-bloom.lemonsqueezy.com/checkout/buy/ca127936-83ba-44fe-a8f2-e9df98b47ed6",
      deluxe: "https://petal-bloom.lemonsqueezy.com/checkout/buy/ca127936-83ba-44fe-a8f2-e9df98b47ed6",
      premium: "https://petal-bloom.lemonsqueezy.com/checkout/buy/ca127936-83ba-44fe-a8f2-e9df98b47ed6"
    }
  },
  {
    id: "royal-orchid",
    slug: "royal-orchid",
    name: "Royal Phalaenopsis Orchid",
    subtitle: "Double-Stem Cascading White Orchid Plant",
    category: "luxury",
    occasion: "Milestones & Corporate",
    tag: "Luxury Potted",
    rating: 4.9,
    reviewCount: 52,
    images: {
      primary: "images/orchids.webp",
      gallery: [
        "images/orchids.webp",
        "images/lilies.webp",
        "images/peonies.webp",
        "images/spires.webp"
      ]
    },
    shortDescription: "A living sculptural masterpiece featuring two cascading stems of moth orchids in a fluted ceramic vessel.",
    description: "The epitome of architectural luxury and longevity. Our Royal Phalaenopsis Orchid arrives potted in an artisan matte cream fluted ceramic container with preserved forest moss. With proper care, these majestic blooms remain in vibrant flower for 2 to 3 months.",
    stems: [
      { name: "Cascading White Orchid Stems", count: 2 },
      { name: "Preserved Forest Moss Layer", count: 1 },
      { name: "Artisan Ceramic Pot", count: 1 }
    ],
    careGuide: [
      "Place in bright, indirect sunlight; avoid direct midday heat.",
      "Water with 3 ice cubes or 1/4 cup of room-temperature water once weekly.",
      "Allow soil mix to dry slightly between waterings; avoid standing water in saucer."
    ],
    sizes: [
      { id: "standard", name: "Classic Double Stem", stems: "12-14 blooms", price: 75, default: true },
      { id: "deluxe", name: "Triple Cascade Stem", stems: "18-20 blooms", price: 95, default: false },
      { id: "premium", name: "Grand Quadruple Stem", stems: "26-28 blooms", price: 135, default: false }
    ],
    vases: [
      { id: "ceramic", name: "Artisan Matte Cream Ceramic Pot (Included)", price: 0 },
      { id: "gold", name: "Hand-Hammered Brass Planter", price: 25 }
    ],
    checkoutUrls: {
      standard: "https://petal-bloom.lemonsqueezy.com/checkout/buy/ca127936-83ba-44fe-a8f2-e9df98b47ed6",
      deluxe: "https://petal-bloom.lemonsqueezy.com/checkout/buy/ca127936-83ba-44fe-a8f2-e9df98b47ed6",
      premium: "https://petal-bloom.lemonsqueezy.com/checkout/buy/ca127936-83ba-44fe-a8f2-e9df98b47ed6"
    }
  },
  {
    id: "hydrangea-cloud",
    slug: "hydrangea-cloud",
    name: "Hydrangea Cloud Bouquet",
    subtitle: "Powder Blue & Vintage Lavender Hydrangeas",
    category: "bouquet",
    occasion: "Housewarming & Everyday",
    tag: "Voluminous Mass",
    rating: 4.8,
    reviewCount: 110,
    images: {
      primary: "images/hydrangea.webp",
      gallery: [
        "images/hydrangea.webp",
        "images/hyacinth.webp",
        "images/sweetheart.webp",
        "images/tulips.webp"
      ]
    },
    shortDescription: "Lush, pillowy cloud-like hydrangeas in pastel blue and lavender nestled with blush spray roses.",
    description: "An opulent, rounded centerpiece arrangement boasting voluminous heads of Dutch hydrangeas in soft periwinkle blue and smoky lavender. Accented with ruffled white lisianthus and seeded eucalyptus, this bouquet fills rooms with effortless botanical grandeur.",
    stems: [
      { name: "Large Powder Blue Hydrangeas", count: 4 },
      { name: "Vintage Lavender Hydrangeas", count: 3 },
      { name: "Blush Spray Roses", count: 6 },
      { name: "White Lisianthus Stems", count: 4 }
    ],
    careGuide: [
      "Hydrangeas love water: submerge stems deep in a clean, full vase of cold water.",
      "If a head wilts, submerge the entire bloom head in cool water for 20 minutes to revive.",
      "Mist petals lightly with fresh water every morning."
    ],
    sizes: [
      { id: "standard", name: "Standard", stems: "16-18 stems", price: 52, default: true },
      { id: "deluxe", name: "Deluxe", stems: "24-26 stems", price: 72, default: false },
      { id: "premium", name: "Premium", stems: "34-36 stems", price: 98, default: false }
    ],
    vases: [
      { id: "none", name: "Vellum Wrap & Lavender Ribbon", price: 0 },
      { id: "glass", name: "Fluted Clear Glass Vase", price: 14 },
      { id: "ceramic", name: "Artisan Matte Ceramic Pot", price: 24 }
    ],
    checkoutUrls: {
      standard: "https://petal-bloom.lemonsqueezy.com/checkout/buy/ca127936-83ba-44fe-a8f2-e9df98b47ed6",
      deluxe: "https://petal-bloom.lemonsqueezy.com/checkout/buy/ca127936-83ba-44fe-a8f2-e9df98b47ed6",
      premium: "https://petal-bloom.lemonsqueezy.com/checkout/buy/ca127936-83ba-44fe-a8f2-e9df98b47ed6"
    }
  },
  {
    id: "golden-sunburst",
    slug: "golden-sunburst",
    name: "Golden Sunburst & Dahlias",
    subtitle: "Mini Sunflowers & Café au Lait Dahlias",
    category: "celebration",
    occasion: "Get Well & Cheer",
    tag: "Seasonal Warmth",
    rating: 4.9,
    reviewCount: 76,
    images: {
      primary: "images/sunburst.webp",
      gallery: [
        "images/sunburst.webp",
        "images/birthday.webp",
        "images/wildflower.webp",
        "images/roses.webp"
      ]
    },
    shortDescription: "Joyful golden mini sunflowers, creamy Café au Lait dahlias, and vibrant red hypericum berries.",
    description: "An instant mood-lifter crafted to celebrate milestones, express gratitude, or deliver golden cheer. Featuring velvety brown-eyed sunflowers, dinner-plate Café au Lait dahlias, apricot garden roses, and clusters of polished hypericum berries.",
    stems: [
      { name: "Golden Mini Sunflowers", count: 6 },
      { name: "Café au Lait Dahlias", count: 4 },
      { name: "Apricot Garden Roses", count: 4 },
      { name: "Red Hypericum Berries", count: 5 }
    ],
    careGuide: [
      "Trim stems at an angle and remove any leaves below the waterline.",
      "Sunflowers are thirsty stems: check and refill water daily.",
      "Display in moderate temperatures to preserve dahlia petal firmness."
    ],
    sizes: [
      { id: "standard", name: "Standard", stems: "18-20 stems", price: 46, default: true },
      { id: "deluxe", name: "Deluxe", stems: "26-28 stems", price: 64, default: false },
      { id: "premium", name: "Premium", stems: "38-40 stems", price: 88, default: false }
    ],
    vases: [
      { id: "none", name: "Terracotta Linen Ribbon Wrap", price: 0 },
      { id: "glass", name: "Fluted Clear Glass Vase", price: 14 },
      { id: "ceramic", name: "Artisan Matte Ceramic Pot", price: 24 }
    ],
    checkoutUrls: {
      standard: "https://petal-bloom.lemonsqueezy.com/checkout/buy/ca127936-83ba-44fe-a8f2-e9df98b47ed6",
      deluxe: "https://petal-bloom.lemonsqueezy.com/checkout/buy/ca127936-83ba-44fe-a8f2-e9df98b47ed6",
      premium: "https://petal-bloom.lemonsqueezy.com/checkout/buy/ca127936-83ba-44fe-a8f2-e9df98b47ed6"
    }
  },
  {
    id: "meadow-spires",
    slug: "meadow-spires",
    name: "Meadow Spires & Wild Greens",
    subtitle: "Peach Snapdragons & Lavender Stock Spires",
    category: "bouquet",
    occasion: "Everyday",
    tag: "Textural Line",
    rating: 4.8,
    reviewCount: 43,
    images: {
      primary: "images/spires.webp",
      gallery: [
        "images/spires.webp",
        "images/hyacinth.webp",
        "images/tulips.webp",
        "images/wildflower.webp"
      ]
    },
    shortDescription: "A tall, airy editorial arrangement of pastel snapdragons, sweet Matthiola stock, and layered eucalyptus.",
    description: "Designed with botanical movement and vertical depth. Tall, graceful peach snapdragons combine with honey-scented lavender stock, ruffled white ranunculus, and wisps of green bell thlaspi for an organic meadow silhouette.",
    stems: [
      { name: "Peach Snapdragon Spires", count: 6 },
      { name: "Lavender Matthiola Stock", count: 6 },
      { name: "White Ranunculus", count: 4 },
      { name: "Silver Dollar & Seeded Eucalyptus", count: 5 }
    ],
    careGuide: [
      "Snapdragons naturally reach toward the light; turn vase every couple of days.",
      "Remove faded bottom blossoms along the spires to encourage top buds to bloom.",
      "Keep water fresh and cool for long-lasting fragrance."
    ],
    sizes: [
      { id: "standard", name: "Standard", stems: "18-20 stems", price: 42, default: true },
      { id: "deluxe", name: "Deluxe", stems: "26-28 stems", price: 58, default: false },
      { id: "premium", name: "Premium", stems: "38-40 stems", price: 82, default: false }
    ],
    vases: [
      { id: "none", name: "Sage Cotton Ribbon Wrap", price: 0 },
      { id: "glass", name: "Fluted Clear Glass Vase", price: 14 },
      { id: "ceramic", name: "Artisan Matte Ceramic Pot", price: 24 }
    ],
    checkoutUrls: {
      standard: "https://petal-bloom.lemonsqueezy.com/checkout/buy/ca127936-83ba-44fe-a8f2-e9df98b47ed6",
      deluxe: "https://petal-bloom.lemonsqueezy.com/checkout/buy/ca127936-83ba-44fe-a8f2-e9df98b47ed6",
      premium: "https://petal-bloom.lemonsqueezy.com/checkout/buy/ca127936-83ba-44fe-a8f2-e9df98b47ed6"
    }
  },
  {
    id: "pastel-peonies",
    slug: "pastel-peonies",
    name: "Pastel Peonies",
    subtitle: "Lush Sarah Bernhardt Blush Peonies",
    category: "luxury",
    occasion: "Romantic",
    tag: "Coveted Luxury",
    rating: 5.0,
    reviewCount: 156,
    images: {
      primary: "images/peonies.webp",
      gallery: [
        "images/peonies.webp",
        "images/sweetheart.webp",
        "images/roses.webp",
        "images/orchids.webp"
      ]
    },
    shortDescription: "Sumptuous Sarah Bernhardt blush and cream peonies hand-tied with velvet champagne ribbon.",
    description: "The crown jewel of seasonal floristry. Pillow-soft Sarah Bernhardt peonies arrive in tight bud and unfurl into massive ruffled blooms over several days. Accented with dark emerald peony foliage and delicate white lilacs.",
    stems: [
      { name: "Sarah Bernhardt Blush Peonies", count: 10 },
      { name: "Cream White Peonies", count: 5 },
      { name: "White Lilac Sprigs", count: 4 },
      { name: "Lush Peony Greens", count: 4 }
    ],
    careGuide: [
      "To speed opening, place in slightly warm water in a warm room.",
      "Once open, move to a cool spot to prolong bloom beauty for up to 8-10 days.",
      "Gently rinse any natural sweet sap from tight buds with lukewarm water."
    ],
    sizes: [
      { id: "standard", name: "Standard", stems: "15-18 stems", price: 58, default: true },
      { id: "deluxe", name: "Deluxe", stems: "22-25 stems", price: 78, default: false },
      { id: "premium", name: "Premium", stems: "32-35 stems", price: 110, default: false }
    ],
    vases: [
      { id: "none", name: "Heavy Cream Wrap & Velvet Ribbon", price: 0 },
      { id: "glass", name: "Fluted Clear Glass Vase", price: 14 },
      { id: "ceramic", name: "Artisan Matte Ceramic Pot", price: 24 }
    ],
    checkoutUrls: {
      standard: "https://petal-bloom.lemonsqueezy.com/checkout/buy/ca127936-83ba-44fe-a8f2-e9df98b47ed6",
      deluxe: "https://petal-bloom.lemonsqueezy.com/checkout/buy/ca127936-83ba-44fe-a8f2-e9df98b47ed6",
      premium: "https://petal-bloom.lemonsqueezy.com/checkout/buy/ca127936-83ba-44fe-a8f2-e9df98b47ed6"
    }
  },
  {
    id: "sunday-tulips",
    slug: "sunday-tulips",
    name: "Sunday Tulips",
    subtitle: "Fresh Spring Whispers in Pastel",
    category: "bouquet",
    occasion: "Everyday",
    tag: "Spring Fresh",
    rating: 4.8,
    reviewCount: 68,
    images: {
      primary: "images/tulips.webp",
      gallery: [
        "images/tulips.webp",
        "images/hyacinth.webp",
        "images/sweetheart.webp",
        "images/spires.webp"
      ]
    },
    shortDescription: "A modern monochrome bouquet of fresh Dutch tulips in soft blush, peach, and ivory.",
    description: "Crisp, graceful, and understated. Sunday Tulips celebrate the simple perfection of springtime. Grown in cold-climate greenhouses and harvested at first color, these stems continue to grow and dance toward natural light in your vase.",
    stems: [
      { name: "Blush Dutch Tulips", count: 10 },
      { name: "Soft Peach Tulips", count: 8 },
      { name: "Cream White Tulips", count: 6 }
    ],
    careGuide: [
      "Tulips continue growing 1-2 inches in the vase: recut stems every 2 days.",
      "Keep water shallow (2-3 inches) and cold to keep stems upright.",
      "Avoid placing next to daffodils or fruit."
    ],
    sizes: [
      { id: "standard", name: "Standard", stems: "20-22 stems", price: 38, default: true },
      { id: "deluxe", name: "Deluxe", stems: "30-32 stems", price: 52, default: false },
      { id: "premium", name: "Premium", stems: "44-46 stems", price: 74, default: false }
    ],
    vases: [
      { id: "none", name: "Parchment Craft Wrap", price: 0 },
      { id: "glass", name: "Fluted Clear Glass Vase", price: 14 },
      { id: "ceramic", name: "Artisan Matte Ceramic Pot", price: 24 }
    ],
    checkoutUrls: {
      standard: "https://petal-bloom.lemonsqueezy.com/checkout/buy/ca127936-83ba-44fe-a8f2-e9df98b47ed6",
      deluxe: "https://petal-bloom.lemonsqueezy.com/checkout/buy/ca127936-83ba-44fe-a8f2-e9df98b47ed6",
      premium: "https://petal-bloom.lemonsqueezy.com/checkout/buy/ca127936-83ba-44fe-a8f2-e9df98b47ed6"
    }
  },
  {
    id: "sweetheart-bouquet",
    slug: "sweetheart-bouquet",
    name: "Sweetheart Bouquet",
    subtitle: "Ruffled Lisianthus, Ranunculus & Blush Roses",
    category: "bouquet",
    occasion: "Romantic",
    tag: "Romantic Favorite",
    rating: 4.9,
    reviewCount: 94,
    images: {
      primary: "images/sweetheart.webp",
      gallery: [
        "images/sweetheart.webp",
        "images/roses.webp",
        "images/peonies.webp",
        "images/tulips.webp"
      ]
    },
    shortDescription: "A romantic confection of ruffled white lisianthus, pale peach ranunculus, and pastel pink roses.",
    description: "Soft, dreamy, and poetic. The Sweetheart Bouquet is crafted with fluttery multi-petaled lisianthus, delicate ranunculus, blush garden roses, and trailing asparagus ferns wrapped in frosted vellum paper.",
    stems: [
      { name: "Ruffled White Lisianthus", count: 8 },
      { name: "Pale Peach Ranunculus", count: 6 },
      { name: "Pastel Pink Garden Roses", count: 6 },
      { name: "Asparagus Fern & Eucalyptus", count: 4 }
    ],
    careGuide: [
      "Trim 1 inch off bottom of stems on an angle.",
      "Replace vase water every 48 hours to maintain clear freshness.",
      "Keep away from intense heat sources."
    ],
    sizes: [
      { id: "standard", name: "Standard", stems: "18-20 stems", price: 50, default: true },
      { id: "deluxe", name: "Deluxe", stems: "28-30 stems", price: 70, default: false },
      { id: "premium", name: "Premium", stems: "40-42 stems", price: 96, default: false }
    ],
    vases: [
      { id: "none", name: "Textured Vellum Wrap & Mauve Ribbon", price: 0 },
      { id: "glass", name: "Fluted Clear Glass Vase", price: 14 },
      { id: "ceramic", name: "Artisan Matte Ceramic Pot", price: 24 }
    ],
    checkoutUrls: {
      standard: "https://petal-bloom.lemonsqueezy.com/checkout/buy/ca127936-83ba-44fe-a8f2-e9df98b47ed6",
      deluxe: "https://petal-bloom.lemonsqueezy.com/checkout/buy/ca127936-83ba-44fe-a8f2-e9df98b47ed6",
      premium: "https://petal-bloom.lemonsqueezy.com/checkout/buy/ca127936-83ba-44fe-a8f2-e9df98b47ed6"
    }
  },
  {
    id: "petite-wildflower-basket",
    slug: "petite-wildflower-basket",
    name: "Petite Wildflower Basket",
    subtitle: "Chamomile Daisies & English Lavender",
    category: "gift",
    occasion: "Gratitude & Thinking of You",
    tag: "Charming Gift",
    rating: 4.9,
    reviewCount: 57,
    images: {
      primary: "images/wildflower.webp",
      gallery: [
        "images/wildflower.webp",
        "images/daisies.webp",
        "images/spires.webp",
        "images/sunburst.webp"
      ]
    },
    shortDescription: "A rustic woven rattan basket filled with sunny chamomile daisies, English lavender, and sweet peas.",
    description: "Charming, fragrant, and heartwarming. Hand-arranged in a natural hand-woven wicker basket with an internal water reservoir, this petite arrangement arrives ready to display on bedside tables, breakfast nooks, or work desks.",
    stems: [
      { name: "Sunny Chamomile Daisies", count: 12 },
      { name: "Fragrant English Lavender", count: 8 },
      { name: "Peach Sweet Peas", count: 6 },
      { name: "Trailing Ivy Foliage", count: 4 }
    ],
    careGuide: [
      "Add 1/2 cup of cold water into the center of the basket foam daily.",
      "Keep away from direct draft or strong sun to prolong lavender scent.",
      "Deadhead spent chamomile blossoms to encourage continued freshness."
    ],
    sizes: [
      { id: "standard", name: "Standard", stems: "Petite 6-inch Basket", price: 40, default: true },
      { id: "deluxe", name: "Deluxe", stems: "Classic 8-inch Basket", price: 55, default: false },
      { id: "premium", name: "Grand Luxe Basket", stems: "Grand 10-inch Basket", price: 75, default: false }
    ],
    vases: [
      { id: "basket", name: "Hand-Woven Natural Rattan Basket (Included)", price: 0 }
    ],
    checkoutUrls: {
      standard: "https://petal-bloom.lemonsqueezy.com/checkout/buy/ca127936-83ba-44fe-a8f2-e9df98b47ed6",
      deluxe: "https://petal-bloom.lemonsqueezy.com/checkout/buy/ca127936-83ba-44fe-a8f2-e9df98b47ed6",
      premium: "https://petal-bloom.lemonsqueezy.com/checkout/buy/ca127936-83ba-44fe-a8f2-e9df98b47ed6"
    }
  },
  {
    id: "birthday-bloom-box",
    slug: "birthday-bloom-box",
    name: "Birthday Bloom Box",
    subtitle: "Pastel Hat-Box Arrangement & Letterpress Card",
    category: "celebration",
    occasion: "Milestones & Birthdays",
    tag: "Celebration Package",
    rating: 5.0,
    reviewCount: 120,
    images: {
      primary: "images/birthday.webp",
      gallery: [
        "images/birthday.webp",
        "images/sunburst.webp",
        "images/peonies.webp",
        "images/sweetheart.webp"
      ]
    },
    shortDescription: "A luxury round keepsake hat box densely packed with pastel roses and mini hydrangeas, with a letterpress card.",
    description: "The ultimate celebratory gift experience. Arrives in an elegant round matte cream hat box tied with violet silk ribbon. Freshly cut pastel roses, mini hydrangeas, and blush carnations are arranged in hydration foam, complete with a personalized gold-foil letterpress card.",
    stems: [
      { name: "Pastel Garden Roses", count: 8 },
      { name: "Mini White Hydrangeas", count: 3 },
      { name: "Blush Carnations", count: 6 },
      { name: "Gold-Dusted Hypericum Berries", count: 4 }
    ],
    careGuide: [
      "Add 1/4 cup of fresh cold water into the center of the bloom box every 2 days.",
      "Keep arrangement in the decorative hat box for the full life of the blooms.",
      "Display in a cool room away from direct heaters."
    ],
    sizes: [
      { id: "standard", name: "Standard", stems: "6-inch Hat Box", price: 54, default: true },
      { id: "deluxe", name: "Deluxe", stems: "8-inch Hat Box", price: 74, default: false },
      { id: "premium", name: "Grand Luxe Hat Box", stems: "10-inch Hat Box", price: 105, default: false }
    ],
    vases: [
      { id: "hatbox", name: "Matte Cream Keepsake Hat Box (Included)", price: 0 }
    ],
    checkoutUrls: {
      standard: "https://petal-bloom.lemonsqueezy.com/checkout/buy/ca127936-83ba-44fe-a8f2-e9df98b47ed6",
      deluxe: "https://petal-bloom.lemonsqueezy.com/checkout/buy/ca127936-83ba-44fe-a8f2-e9df98b47ed6",
      premium: "https://petal-bloom.lemonsqueezy.com/checkout/buy/ca127936-83ba-44fe-a8f2-e9df98b47ed6"
    }
  }
];

/**
 * Get product by slug identifier
 */
export function getProductBySlug(slug) {
  return PRODUCTS.find(p => p.slug === slug) || null;
}

/**
 * Filter catalog products by category
 */
export function getProductsByCategory(category = "all") {
  if (!category || category === "all") return PRODUCTS;
  return PRODUCTS.filter(p => p.category === category);
}

/**
 * Search products by keyword
 */
export function searchProducts(keyword = "") {
  if (!keyword) return PRODUCTS;
  const term = keyword.toLowerCase().trim();
  return PRODUCTS.filter(p =>
    p.name.toLowerCase().includes(term) ||
    p.subtitle.toLowerCase().includes(term) ||
    p.category.toLowerCase().includes(term) ||
    p.occasion.toLowerCase().includes(term) ||
    p.description.toLowerCase().includes(term) ||
    p.stems.some(s => s.name.toLowerCase().includes(term))
  );
}
