// Home Budget Logic
export interface HomeRecommendation {
  item: string;
  price: number;
  source: string;
  category: string;
  icon: string;
}

export function getHomeBudget(budget: number, roomType: string): HomeRecommendation[] {
  const allocations: Record<string, { item: string; pct: number; source: string; icon: string; category: string }[]> = {
    "Living Room": [
      { item: "Sofa Set", pct: 0.30, source: "IKEA", icon: "🛋️", category: "Furniture" },
      { item: "Coffee Table", pct: 0.10, source: "Amazon", icon: "☕", category: "Furniture" },
      { item: "TV Unit", pct: 0.15, source: "Flipkart", icon: "📺", category: "Electronics" },
      { item: "Wall Art & Decor", pct: 0.10, source: "Amazon", icon: "🖼️", category: "Decor" },
      { item: "Lighting Fixtures", pct: 0.12, source: "IKEA", icon: "💡", category: "Lighting" },
      { item: "Curtains & Rugs", pct: 0.10, source: "Flipkart", icon: "🪟", category: "Textiles" },
      { item: "Indoor Plants", pct: 0.05, source: "Amazon", icon: "🌿", category: "Decor" },
      { item: "Cushions & Throws", pct: 0.08, source: "IKEA", icon: "🛏️", category: "Textiles" },
    ],
    "Bedroom": [
      { item: "Bed Frame & Mattress", pct: 0.35, source: "IKEA", icon: "🛏️", category: "Furniture" },
      { item: "Wardrobe", pct: 0.20, source: "Flipkart", icon: "👗", category: "Furniture" },
      { item: "Bedside Tables", pct: 0.08, source: "Amazon", icon: "🪑", category: "Furniture" },
      { item: "Bedding Set", pct: 0.10, source: "Amazon", icon: "🛌", category: "Textiles" },
      { item: "Table Lamp", pct: 0.07, source: "IKEA", icon: "💡", category: "Lighting" },
      { item: "Mirror", pct: 0.08, source: "Flipkart", icon: "🪞", category: "Decor" },
      { item: "Wall Decor", pct: 0.07, source: "Amazon", icon: "🖼️", category: "Decor" },
      { item: "Storage Organizers", pct: 0.05, source: "IKEA", icon: "📦", category: "Storage" },
    ],
    "Kitchen": [
      { item: "Modular Cabinets", pct: 0.30, source: "IKEA", icon: "🗄️", category: "Furniture" },
      { item: "Countertop Appliances", pct: 0.20, source: "Amazon", icon: "🍳", category: "Appliances" },
      { item: "Dining Set", pct: 0.15, source: "Flipkart", icon: "🍽️", category: "Furniture" },
      { item: "Cookware Set", pct: 0.10, source: "Amazon", icon: "🥘", category: "Cookware" },
      { item: "Lighting", pct: 0.08, source: "IKEA", icon: "💡", category: "Lighting" },
      { item: "Storage Jars & Rack", pct: 0.07, source: "Flipkart", icon: "🫙", category: "Storage" },
      { item: "Kitchen Decor", pct: 0.05, source: "Amazon", icon: "🌻", category: "Decor" },
      { item: "Utensils & Tools", pct: 0.05, source: "Flipkart", icon: "🔪", category: "Cookware" },
    ],
  };

  const items = allocations[roomType] || allocations["Living Room"];
  return items.map((a) => ({
    item: a.item,
    price: Math.round(budget * a.pct),
    source: a.source,
    category: a.category,
    icon: a.icon,
  }));
}

// Party Budget Logic
export interface PartyBudgetSplit {
  category: string;
  amount: number;
  percentage: number;
  platform: string;
  icon: string;
  color: string;
}

export function getPartyBudget(budget: number, eventType: string): PartyBudgetSplit[] {
  const splits: Record<string, { category: string; pct: number; platform: string; icon: string; color: string }[]> = {
    "Birthday": [
      { category: "Food & Cake", pct: 0.30, platform: "Swiggy", icon: "🎂", color: "#f472b6" },
      { category: "Venue", pct: 0.25, platform: "OYO", icon: "🏠", color: "#a78bfa" },
      { category: "Decoration", pct: 0.20, platform: "Amazon", icon: "🎈", color: "#60a5fa" },
      { category: "Entertainment", pct: 0.15, platform: "BookMyShow", icon: "🎵", color: "#34d399" },
      { category: "Gifts & Favors", pct: 0.10, platform: "Flipkart", icon: "🎁", color: "#fbbf24" },
    ],
    "Wedding": [
      { category: "Catering", pct: 0.35, platform: "Zomato", icon: "🍽️", color: "#f472b6" },
      { category: "Venue & Stage", pct: 0.30, platform: "OYO", icon: "💒", color: "#a78bfa" },
      { category: "Floral Decoration", pct: 0.15, platform: "BigBasket", icon: "💐", color: "#60a5fa" },
      { category: "Music & DJ", pct: 0.10, platform: "BookMyShow", icon: "🎶", color: "#34d399" },
      { category: "Photography", pct: 0.10, platform: "UrbanClap", icon: "📸", color: "#fbbf24" },
    ],
    "Corporate Event": [
      { category: "Catering & Snacks", pct: 0.25, platform: "Zomato", icon: "☕", color: "#f472b6" },
      { category: "Venue Rental", pct: 0.30, platform: "OYO", icon: "🏢", color: "#a78bfa" },
      { category: "AV Equipment", pct: 0.20, platform: "Amazon", icon: "🎤", color: "#60a5fa" },
      { category: "Branding & Print", pct: 0.15, platform: "Vistaprint", icon: "🏷️", color: "#34d399" },
      { category: "Gifting", pct: 0.10, platform: "Flipkart", icon: "🎁", color: "#fbbf24" },
    ],
  };

  const items = splits[eventType] || splits["Birthday"];
  return items.map((s) => ({
    category: s.category,
    amount: Math.round(budget * s.pct),
    percentage: Math.round(s.pct * 100),
    platform: s.platform,
    icon: s.icon,
    color: s.color,
  }));
}

// Jewelry Budget Logic
export interface JewelryRecommendation {
  type: string;
  price: number;
  material: string;
  icon: string;
  description: string;
}

export function getJewelryBudget(budget: number, occasion: string): JewelryRecommendation[] {
  const recommendations: Record<string, { type: string; pct: number; material: string; icon: string; description: string }[]> = {
    "Wedding": [
      { type: "Necklace Set", pct: 0.35, material: "Gold Plated", icon: "📿", description: "Elegant bridal necklace with kundan work" },
      { type: "Earrings", pct: 0.20, material: "Gold & Pearl", icon: "✨", description: "Chandelier jhumkas with pearl drops" },
      { type: "Bangles Set", pct: 0.15, material: "Gold Plated", icon: "💫", description: "Traditional bangle set of 6" },
      { type: "Maang Tikka", pct: 0.10, material: "Kundan", icon: "👑", description: "Statement bridal maang tikka" },
      { type: "Anklet", pct: 0.10, material: "Silver", icon: "🦶", description: "Delicate silver anklet with bells" },
      { type: "Ring", pct: 0.10, material: "Diamond Look", icon: "💍", description: "Solitaire-style cocktail ring" },
    ],
    "Party": [
      { type: "Statement Necklace", pct: 0.30, material: "Rose Gold", icon: "📿", description: "Chic layered chain necklace" },
      { type: "Drop Earrings", pct: 0.25, material: "Crystal", icon: "✨", description: "Sparkling crystal drop earrings" },
      { type: "Bracelet", pct: 0.20, material: "Silver", icon: "💫", description: "Charm bracelet with cubic zirconia" },
      { type: "Cocktail Ring", pct: 0.15, material: "Gold Plated", icon: "💍", description: "Bold geometric cocktail ring" },
      { type: "Hair Pin", pct: 0.10, material: "Crystal", icon: "👑", description: "Crystal-studded hair accessory" },
    ],
    "Casual": [
      { type: "Pendant Chain", pct: 0.30, material: "Sterling Silver", icon: "📿", description: "Minimalist everyday pendant" },
      { type: "Stud Earrings", pct: 0.25, material: "Silver", icon: "✨", description: "Simple and elegant studs" },
      { type: "Thin Bracelet", pct: 0.20, material: "Leather & Steel", icon: "💫", description: "Casual leather wrap bracelet" },
      { type: "Simple Ring", pct: 0.15, material: "Silver", icon: "💍", description: "Stackable minimalist band" },
      { type: "Anklet", pct: 0.10, material: "Beaded", icon: "🦶", description: "Boho beaded anklet" },
    ],
  };

  const items = recommendations[occasion] || recommendations["Casual"];
  return items.map((j) => ({
    type: j.type,
    price: Math.round(budget * j.pct),
    material: j.material,
    icon: j.icon,
    description: j.description,
  }));
}
