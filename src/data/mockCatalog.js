export const MERCHANT_INFO = {
  id: "merch_razor_tech_01",
  name: "AetherGear Electronics",
  category: "Consumer Electronics & AI Accessories",
  currency: "INR",
  currencySymbol: "₹",
  acpVersion: "1.0.0-uap",
  protocolManifestUrl: "/api/well-known/agentic-commerce.json",
  razorpayMerchantId: "acc_RazorpayTest123",
  policyRules: {
    maxSingleTxnLimit: 15000, // ₹15,000 auto-approval cap
    maxDiscountAllowed: 25, // Max 25% agent negotiation discount
    requireHumanAuthAbove: 15000,
    allowedPaymentMethods: ["card", "upi", "netbanking", "agent_wallet"],
  }
};

export const PRODUCTS = [
  {
    id: "prod_001",
    name: "AetherPulse Pro Noise-Canceling Earbuds",
    category: "Audio",
    price: 4999,
    originalPrice: 6999,
    stock: 42,
    rating: 4.8,
    image: "/images/earbuds.jpg",
    description: "Spatial audio, 40hr battery life, instant multipoint connect.",
    tags: ["audio", "wireless", "bestseller"],
    acpMetadata: {
      agentPurchaseable: true,
      minPrice: 4499, // Agent negotiation floor
      categoryTaxCode: "HSN8518",
      weightKg: 0.15,
      leadTimeHours: 24,
    },
    upsells: ["prod_004", "prod_005"]
  },
  {
    id: "prod_002",
    name: "Chronos AI Smartwatch Series 5",
    category: "Wearables",
    price: 12999,
    originalPrice: 15999,
    stock: 18,
    rating: 4.9,
    image: "/images/smartwatch.jpg",
    description: "AMOLED display, ECG monitoring, standalone GPS & offline maps.",
    tags: ["smartwatch", "fitness", "premium"],
    acpMetadata: {
      agentPurchaseable: true,
      minPrice: 11999,
      categoryTaxCode: "HSN9102",
      weightKg: 0.25,
      leadTimeHours: 12,
    },
    upsells: ["prod_005"]
  },
  {
    id: "prod_003",
    name: "OmniDesk Ergonomic Dual-Motor Standing Desk",
    category: "Furniture & Setup",
    price: 24999,
    originalPrice: 29999,
    stock: 5,
    rating: 4.7,
    image: "/images/desk.jpg",
    description: "Solid walnut top, 4 memory presets, whisper-quiet motor.",
    tags: ["workspace", "ergonomic", "high-value"],
    acpMetadata: {
      agentPurchaseable: true,
      minPrice: 22999,
      categoryTaxCode: "HSN9403",
      weightKg: 32.0,
      leadTimeHours: 48,
    },
    upsells: ["prod_006"]
  },
  {
    id: "prod_004",
    name: "MagSafe Fast Charge Wireless Dock",
    category: "Accessories",
    price: 1499,
    originalPrice: 1999,
    stock: 110,
    rating: 4.6,
    image: "/images/dock.jpg",
    description: "15W fast wireless charging for phone, watch, and earbuds.",
    tags: ["charging", "accessory", "add-on"],
    acpMetadata: {
      agentPurchaseable: true,
      minPrice: 1299,
      categoryTaxCode: "HSN8504",
      weightKg: 0.1,
      leadTimeHours: 24,
    },
    upsells: []
  },
  {
    id: "prod_005",
    name: "Carbon Armor Hard Shell Earbud Case",
    category: "Accessories",
    price: 799,
    originalPrice: 999,
    stock: 85,
    rating: 4.5,
    image: "/images/case.jpg",
    description: "Mil-spec drop protection with carabiner hook.",
    tags: ["protection", "accessory"],
    acpMetadata: {
      agentPurchaseable: true,
      minPrice: 650,
      categoryTaxCode: "HSN3926",
      weightKg: 0.05,
      leadTimeHours: 24,
    },
    upsells: []
  },
  {
    id: "prod_006",
    name: "UltraFlex Monitor Mount Arm",
    category: "Furniture & Setup",
    price: 3499,
    originalPrice: 4499,
    stock: 23,
    rating: 4.8,
    image: "/images/mount.jpg",
    description: "Full-motion gas spring arm supporting up to 34-inch ultrawides.",
    tags: ["mount", "workspace"],
    acpMetadata: {
      agentPurchaseable: true,
      minPrice: 3100,
      categoryTaxCode: "HSN8302",
      weightKg: 3.5,
      leadTimeHours: 24,
    },
    upsells: []
  }
];
