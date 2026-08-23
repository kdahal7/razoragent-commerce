# RazorAgent Commerce & Growth Engine (AetherGear Storefront)


---

## Summary

With NPCI's **UAP (Unified Agent Protocol)** and global standards like **ACP (Agentic Commerce Protocol)**, **AP2**, and **x402**, agent-to-agent commerce is the open problem of the year.

**RazorAgent Commerce** is an end-to-end, production-ready e-commerce platform that enables merchants to become discoverable and transactable by AI Buyer Agents while maximizing merchant revenue through intelligent conversational in-app checkout, dual-bounded spending guardrails, real-time explainable audit telemetry, and graceful failure recovery over Razorpay APIs.

---

## 🚀 Core Features & Architecture

### 1. Agent-Readable Merchant Catalog (`/.well-known/agentic-commerce.json`)
- Exposes machine-readable ACP metadata including negotiation floor price caps, tax codes (HSN), lead times, and Razorpay API payment endpoint declarations.
- Standardized manifest endpoint enabling instant handshake with external AI Buyer Agents.

### 2. Autonomous AI Buyer Agent with Bounded Safety Gates
- Executes natural language procurement tasks (e.g. *"Procure noise-canceling earbuds and charging dock within a ₹7,000 budget cap"*).
- Evaluates cart bounds against user budget caps and merchant single-transaction limits (`₹15,000`).
- Implements **Step-Up Human Authorization Gating** for high-value orders to prevent unauthorized spending.
- Directly calls Razorpay Order Creation API & opens Razorpay SDK Checkout.

### 3. Merchant AI Growth & Conversational In-App Checkout
- Floating AI Sales & Upsell Assistant.
- Negotiates bundle discounts within merchant policy rules (max 25%).
- Generates instant in-app Razorpay Payment Links.

### 4. Real-Time Audit Telemetry & Explainability Stream
- Meets Track 01's strict bar: *"Every money action explainable, bounded and gated."*
- Real-time event ledger tracking: `DISCOVERY` ➔ `POLICY_CHECK` ➔ `SAFETY_GATE` ➔ `RAZORPAY_API` ➔ `FAILURE_RECOVERY` ➔ `UPSALE`.
- Filterable telemetry log with 1-click JSON export.

### 5. Failure & Edge-Case Sentinel
- Meets Track 01's requirement: *"Show one failure handled gracefully."*
- **Payment Decline Recovery:** Auto-routes card payment gateway timeouts to fallback Razorpay UPI Payment Links.
- **Inventory Shortage Mitigation:** Auto-substitutes product with upgraded tier & locks price.
- **Bounds Breach Intercept:** Freezes unauthorized transactions over policy caps.

---

## 🛠️ Technology Stack

- **Frontend:** React 18, Vite, Tailwind CSS v4, Lucide Icons, Canvas Confetti.
- **Backend API:** Node.js, Express, CORS.
- **Payment Gateway:** Razorpay API Integration (Test Mode Active).
- **Protocols:** Agentic Commerce Protocol (ACP / UAP v1.0).

---

## 💻 Local Setup & Execution

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/kdahal7/razoragent-commerce.git
   cd razoragent-commerce
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   ```

3. **Launch Express Backend Server (Terminal 1):**
   ```bash
   npm run server
   ```
   *Backend running on `http://localhost:5000` (serving `/.well-known/agentic-commerce.json`)*

4. **Launch Vite Frontend Dev Server (Terminal 2):**
   ```bash
   npm run dev
   ```
   *Frontend running on `http://localhost:3000`*

5. **Build for Production:**
   ```bash
   npm run build
   ```

---

## 🔗 Key Endpoints & APIs

| Endpoint | Method | Description |
|---|---|---|
| `/.well-known/agentic-commerce.json` | `GET` | Standard ACP Protocol Manifest Declaration |
| `/api/acp/catalog` | `GET` | Machine-readable Product Catalog for AI Buyer Agents |
| `/api/razorpay/create-order` | `POST` | Razorpay Order API Endpoint |
| `/api/acp/health` | `GET` | Protocol & Razorpay Gateway Health Check |

---

