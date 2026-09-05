import React, { useState } from 'react';
import { X, Video, Clock, CheckCircle2, Copy, Sparkles, BookOpen, Layers } from 'lucide-react';

export default function VideoPitchScriptModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('SCRIPT');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const scriptSections = [
    {
      time: "0:00 - 0:40",
      title: "1. The Hook & The Problem Taste",
      dialogue: `"Hi everyone! My name is Kaushal, and today I’m excited to present RazorAgent Commerce — a complete, production-ready Agentic Commerce and Merchant Growth engine built for Track 01 of the Razorpay AI Buildathon.

We are witnessing a massive shift right now with NPCI's Unified Agent Protocol (UAP) and global agentic standards like ACP, AP2, and x402. Soon, personal AI agents will discover, negotiate, and settle transactions for users.

But here’s the key challenge: How do we make merchants easily sellable to AI buyers and maximize revenue, while guaranteeing that every money action is bounded, explainable, and safe on Razorpay? Let me show you how RazorAgent solves this."`,
      demoAction: "Show the clean AetherGear Storefront and point out the top Track 01 Reviewer Quick Flight Bar and header badges."
    },
    {
      time: "0:40 - 1:20",
      title: "2. Agent-Readable Merchant Catalog & Protocol Manifest",
      dialogue: `"First, let's look at how our merchant storefront makes itself discoverable to AI buyers. 

Human shoppers see our clean web store, but AI Buyer Agents need structured metadata. 

In our top Quick Flight Bar, clicking on '5. ACP Schema' opens our standardized protocol manifest at /.well-known/agentic-commerce.json. 

It declares our merchant ID, supported protocols, HSN tax codes, negotiation floor price caps, and active Razorpay test API endpoints. Any external AI agent can query this manifest and start transacting in milliseconds."`,
      demoAction: "Click on '5. ACP Schema' in the Quick Flight Bar and show the clean JSON manifest modal."
    },
    {
      time: "1:20 - 2:30",
      title: "3. Autonomous AI Buyer Agent with Bounded Safety Gates",
      dialogue: `"Now, let me demonstrate our Autonomous AI Buyer Agent in action.

I’ll select a procurement task: 'Find and buy noise-canceling earbuds and a wireless charging dock within a ₹7,000 budget cap.'

Notice what happens step by step:
1. The agent parses intent and queries our ACP catalog.
2. It evaluates product bounds against both the user's budget cap AND merchant limits.
3. If spending exceeds our ₹15,000 safety threshold, Step-Up Human Authorization kicks in.
4. It calls the Razorpay Order API to create a live test order.

When I click 'Execute Razorpay Payment', the checkout modal opens, and the payment is captured and verified with instant celebration confetti!"`,
      demoAction: "Click '1. AI Buyer' in the Quick Flight Bar, select the preset, run the task, observe 5 phases, then execute the Razorpay payment modal."
    },
    {
      time: "2:30 - 3:20",
      title: "4. AI Campaign Orchestrator & Revenue Growth",
      dialogue: `"Next is Merchant Revenue Growth — specifically our AI Campaign Orchestrator, which satisfies one of the core directions of Track 1.

Clicking '2. Campaigns' opens our autonomous revenue optimizer. Merchants can choose from high-margin AI strategies, like our Festival Audio Surge Bundle or Abandoned Cart Recovery Booster.

The agent enforces policy discount bounds and calculates projected ROI within a bounded ₹5,000 budget. 

When I click 'Launch', the agent orchestrates the promo code FESTIVAL_AUDIO20 and generates an instant, shareable Razorpay Campaign Payment Link to drive live conversions."`,
      demoAction: "Click '2. Campaigns' in the Quick Flight Bar, select Festival Audio Surge Bundle, show bounded ₹5,000 budget, click 'Launch', and show the active Razorpay payment link."
    },
    {
      time: "3:20 - 4:05",
      title: "5. Conversational In-App Checkout & Dynamic Upsells",
      dialogue: `"We also built a conversational In-App Checkout & Upsell Agent right inside the store.

In the bottom right, a shopper can chat with our AI Sales Assistant. I'll click our quick suggestion pill: 'Request 15% Discount'.

The agent checks margin limits and grants an authorized 15% bundle deal, bringing the price down to ₹4,249. 

Right in the chat, it generates an in-app Razorpay checkout card. Clicking 'Pay Now' immediately launches the checkout for instant settlement."`,
      demoAction: "Click the floating AI Shopping Assistant widget in the bottom right, click 'Request 15% Discount', and show the instant in-app Razorpay checkout card."
    },
    {
      time: "4:05 - 4:40",
      title: "6. Real-Time Explainability & Graceful Failure Sentinel",
      dialogue: `"Track 1 demands that every money action be explainable, bounded, and gated, with graceful failure handling.

Let's test our Failure Sentinel. What happens if a card gateway declines or times out? In Scenario 1, the agent intercepts the drop, reserves inventory for 10 minutes, and auto-generates a fallback Razorpay UPI Payment Link sent via SMS.

And in our Telemetry Audit Log, every single event — from discovery to safety checks and API calls — is logged in real time with human-readable explainability traces and exportable JSON payloads."`,
      demoAction: "Click '3. Failure Sentinel' to show Gateway Decline fallback, then click '4. Telemetry' to inspect explainable reasoning and JSON telemetry."
    },
    {
      time: "4:40 - 5:00",
      title: "7. Conclusion & Wrap-Up",
      dialogue: `"To wrap up: RazorAgent Commerce proves that agent-to-agent commerce on Razorpay APIs can be secure, bounded, explainable, and revenue-maximizing for merchants.

All code is modular, production-ready, and public on GitHub. Thank you so much for your time, and I'd love to join as a Razorpay AI Builder Intern in 2026!"`,
      demoAction: "Return to the main storefront homepage, scrolling smoothly across the product showcase."
    }
  ];

  const applicationFormAnswers = [
    { label: "01. Full name", text: "Your Full Name" },
    { label: "02. College", text: "Your University / College Name" },
    { label: "03. Graduation year", text: "2025 / 2026 / 2027" },
    { label: "04. In-person from September", text: "Yes" },
    { label: "05. 6 or 12 months", text: "6 or 12 months (Your choice)" },
    { label: "06. Resume file", text: "Upload your PDF resume" },
    { label: "07. Your track", text: "01 — AI Growth & Agentic Commerce" },
    { label: "08. Project name", text: "RazorAgent Commerce & Growth Engine" },
    { label: "09. What it solves", text: "Enables merchants to become discoverable and transactable by AI Buyer Agents via NPCI ACP/UAP protocol standards while growing revenue via conversational in-app checkout, bounded spending guardrails, and real-time explainable audit trails over Razorpay APIs." },
    { label: "10. GitHub repo URL, public", text: "Your public GitHub repo URL containing this codebase" },
    { label: "11. 5-min pitch video", text: "Unlisted YouTube / Loom video link using the exact script provided" },
    { label: "12. What broke, and how you got out (Most Important)", text: "During initial AI buyer agent procurement, high-value transactions could trigger unauthorized order creation. We resolved this by engineering a strict dual-bounded Safety Gate (checking both merchant policy limits and user budget caps) with a Step-Up Human Authorization trigger and an auto-fallback Razorpay UPI recovery handler for API declines." }
  ];

  const fullScriptText = scriptSections.map(s => `[${s.time}] ${s.title}\nDIALOGUE:\n${s.dialogue}\nDEMO ACTION: ${s.demoAction}\n`).join('\n---\n\n');

  const copyScript = () => {
    navigator.clipboard.writeText(fullScriptText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
      <div className="relative w-full max-w-4xl bg-slate-900 rounded-3xl border border-slate-800 shadow-2xl overflow-hidden my-6 flex flex-col max-h-[85vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
              <Video className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <span>5-Minute Pitch Video Script & Form Guide</span>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                  Winning Guide
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Word-for-word pitch dialogues, recording demo steps, and 12-form field answers.
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="p-4 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setActiveTab('SCRIPT')}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition flex items-center space-x-1.5 ${
                activeTab === 'SCRIPT'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-slate-900 text-slate-400 hover:bg-slate-800'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>5-Min Video Script & Dialogues</span>
            </button>
            <button
              onClick={() => setActiveTab('FORM')}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition flex items-center space-x-1.5 ${
                activeTab === 'FORM'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-slate-900 text-slate-400 hover:bg-slate-800'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Razorpay 12-Form Answers</span>
            </button>
          </div>

          {activeTab === 'SCRIPT' && (
            <button
              onClick={copyScript}
              className="px-3.5 py-1.5 text-xs font-semibold rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white transition flex items-center space-x-1.5"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>{copied ? "Copied Full Script!" : "Copy Full Script"}</span>
            </button>
          )}
        </div>

        {/* Tab Content */}
        <div className="flex-1 p-6 overflow-y-auto space-y-6 bg-slate-950/50">
          
          {activeTab === 'SCRIPT' && (
            <div className="space-y-6">
              {scriptSections.map((sec, idx) => (
                <div key={idx} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-blue-400 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{sec.time} — {sec.title}</span>
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Exact Dialogue to Speak:
                    </p>
                    <p className="text-xs text-slate-200 leading-relaxed font-sans italic">
                      {sec.dialogue}
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/30 space-y-1 text-emerald-200">
                    <p className="text-[10px] font-bold uppercase text-emerald-400">
                      On-Screen Demo Action:
                    </p>
                    <p className="text-xs">{sec.demoAction}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'FORM' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-300">
                Here are the exact answers to fill into the 12 fields of the Razorpay Buildathon Application Form:
              </p>
              <div className="grid grid-cols-1 gap-3">
                {applicationFormAnswers.map((ans, i) => (
                  <div key={i} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                    <p className="text-xs font-bold text-blue-400">{ans.label}</p>
                    <p className="text-xs text-slate-200 font-mono">{ans.text}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
