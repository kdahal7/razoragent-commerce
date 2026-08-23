// ACP (Agentic Commerce Protocol) & UAP Handshake Service

import { MERCHANT_INFO, PRODUCTS } from '../data/mockCatalog';
import { auditLogger } from './auditLogger';

export function getACPProtocolManifest() {
  return {
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
        checkout_url: "/api/razorpay/checkout",
      }
    },
    policy_constraints: MERCHANT_INFO.policyRules,
    endpoints: {
      catalog_discovery: "/api/acp/catalog",
      negotiate_quote: "/api/acp/negotiate",
      create_agent_order: "/api/acp/order",
      audit_stream: "/api/acp/audit",
    },
    capabilities: [
      "AGENT_READABLE_CATALOG",
      "DYNAMIC_DISCOUNT_NEGOTIATION",
      "BOUNDED_SPENDING_GATE",
      "RAZORPAY_AUTO_PAYMENT_LINK",
      "FAILURE_FALLBACK_RECOVERY"
    ]
  };
}

export function discoverACPCatalog(filterCategory = null) {
  auditLogger.log({
    type: "DISCOVERY",
    title: "ACP Protocol Handshake & Catalog Query",
    details: `External AI Agent requested merchant catalog via /.well-known/agentic-commerce.json. Category filter: ${filterCategory || 'ALL'}`,
    status: "info",
    agentId: "External-AI-Buyer",
    payload: { filterCategory, itemsReturned: PRODUCTS.length }
  });

  let catalog = PRODUCTS.filter(p => p.acpMetadata.agentPurchaseable);
  if (filterCategory) {
    catalog = catalog.filter(p => p.category.toLowerCase().includes(filterCategory.toLowerCase()) || p.tags.includes(filterCategory.toLowerCase()));
  }

  return catalog;
}
