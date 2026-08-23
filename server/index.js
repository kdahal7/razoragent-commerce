// Node.js Express Server for RazorAgent ACP & Razorpay Integration

import express from 'express';
import cors from 'cors';
import { MERCHANT_INFO, PRODUCTS } from '../src/data/mockCatalog.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// 1. ACP Standard Manifest Protocol Endpoint
app.get('/api/well-known/agentic-commerce.json', (req, res) => {
  res.json({
    protocol_name: "Agentic Commerce Protocol (ACP)",
    spec_version: "1.0.0-uap",
    merchant: {
      id: MERCHANT_INFO.id,
      name: MERCHANT_INFO.name,
      currency: MERCHANT_INFO.currency,
      supported_protocols: ["ACP-1.0", "UAP-2026", "AP2", "x402"],
      razorpay_integration: {
        mode: "test",
        merchant_id: MERCHANT_INFO.razorpayMerchantId,
        checkout_url: "/api/razorpay/create-order",
      }
    },
    policy_constraints: MERCHANT_INFO.policyRules,
    capabilities: [
      "AGENT_READABLE_CATALOG",
      "DYNAMIC_DISCOUNT_NEGOTIATION",
      "BOUNDED_SPENDING_GATE",
      "RAZORPAY_AUTO_PAYMENT_LINK",
      "FAILURE_FALLBACK_RECOVERY"
    ]
  });
});

// 2. ACP Agent Product Catalog API
app.get('/api/acp/catalog', (req, res) => {
  const { category, max_price } = req.query;
  let items = PRODUCTS.filter(p => p.acpMetadata.agentPurchaseable);

  if (category) {
    items = items.filter(p => p.category.toLowerCase().includes(category.toLowerCase()));
  }
  if (max_price) {
    items = items.filter(p => p.price <= parseFloat(max_price));
  }

  res.json({
    merchant_id: MERCHANT_INFO.id,
    timestamp: new Date().toISOString(),
    item_count: items.length,
    items
  });
});

// 3. Razorpay Order Creation Mock Endpoint
app.post('/api/razorpay/create-order', (req, res) => {
  const { amount, currency = "INR", items, metadata } = req.body;

  if (!amount || amount <= 0) {
    return res.status(400).json({ error: "Invalid transaction amount" });
  }

  const orderId = `order_rzp_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
  const orderObj = {
    id: orderId,
    entity: "order",
    amount: Math.round(amount * 100), // paisa
    amount_paid: 0,
    amount_due: Math.round(amount * 100),
    currency,
    receipt: `rcpt_${Date.now()}`,
    status: "created",
    created_at: Math.floor(Date.now() / 1000),
    metadata
  };

  console.log(`[RAZORPAY API] Order created: ${orderId} | Amount: ₹${amount}`);
  res.json(orderObj);
});

// 4. Audit Log Endpoint
app.get('/api/acp/health', (req, res) => {
  res.json({ status: "healthy", acpVersion: "1.0.0-uap", razorpayMode: "test-active" });
});

app.listen(PORT, () => {
  console.log(`⚡ RazorAgent Backend Server running on http://localhost:${PORT}`);
  console.log(`🔗 ACP Manifest active at http://localhost:${PORT}/api/well-known/agentic-commerce.json`);
});
