import React, { useState } from 'react';
import { X, Video, Clock, CheckCircle2, Copy, Sparkles, BookOpen, Layers } from 'lucide-react';

export default function VideoPitchScriptModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('SCRIPT');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const scriptSections = [
    {
      time: "0:00 - 0:45",
      title: "1. The Hook & The Problem Taste",
      dialogue: `"Hi everyone! My name is Kaushal, and today I’m excited to present RazorAgent Commerce — a complete, production-ready Agentic Commerce Engine built for Track 01 of the Razorpay AI Buildathon.

We are witnessing a massive paradigm shift in payments. With NPCI's UAP protocol and global standards like ACP, AP2, and x402, AI Buyer Agents will soon negotiate, procure, and pay on behalf of millions of users. 

However, existing e-commerce systems are built for humans, not machine agents. Money actions by autonomous agents must be explainable, strictly bounded, and gated to prevent runaway API spending. That's exactly what RazorAgent solves."`,
      demoAction: "Show the RazorAgent Header & Hero Banner with ACP Protocol status and Razorpay Test Mode active."
    },
    {
      time: "0:45 - 1:45",
      title: "2. Agent-Readable Merchant Catalog & Protocol Manifest",
      dialogue: `"First, let's look at how our merchant storefront makes itself discoverable to AI buyers. 

Every product in our catalog exposes machine-readable ACP metadata — including floor negotiation prices, tax codes, and lead times. 

If we inspect the endpoint /.well-known/agentic-commerce.json, an external AI buyer agent can instantly handshake with the storefront, read policy constraints, and verify supported Razorpay payment capabilities."`,
      demoAction: "Click on '/.well-known Schema' button and show the JSON manifest modal."
    },
    {
      time: "1:45 - 2:45",
      title: "3. Autonomous AI Buyer Agent with Bounded Safety Gates",
      dialogue: `"Now, let me demonstrate our Autonomous AI Buyer Agent in action.

I’ll give the agent a natural language prompt: 'Find and buy noise-canceling earbuds and charging dock within a ₹7,000 budget cap.'

Notice what happens step by step:
1. The agent queries the ACP catalog schema.
2. It evaluates product bounds against both the user's budget cap AND the merchant’s single-transaction limit.
3. If spending exceeds ₹15,000, our step-up safety gate intercepts the money action and requests human-in-the-loop authorization.
4. Once verified, the agent calls the Razorpay Order API and opens the Razorpay checkout modal."`,
      demoAction: "Click 'Launch AI Buyer Agent', select the preset, run the task, demonstrate the step-by-step reasoning and safety gate approval, then execute the Razorpay payment modal."
    },
    {
      time: "2:45 - 3:45",
      title: "4. Merchant AI Growth & Conversational Upsell Agent",
      dialogue: `"Next is Merchant Growth. How do we help merchants grow revenue when dealing with human or agent buyers?

Our Merchant Growth Agent constantly monitors cart activity and conversational intent. In our chat widget, a shopper can ask for product recommendations or negotiate bundle deals. 

The Growth Agent evaluates margins and generates a dynamic bundle discount, automatically building an instant in-app Razorpay Payment Link."`,
      demoAction: "Click the floating AI Checkout Assistant chat widget, type 'Can I get a discount on earbuds?', accept the 15% bundle deal, and trigger the instant Razorpay checkout."
    },
    {
      time: "3:45 - 4:30",
      title: "5. Real-Time Audit Telemetry & Graceful Failure Recovery",
      dialogue: `"To meet Track 01’s strict bar, every single financial action is recorded in a real-time explainable audit trail.

We also built a Failure Stress Tester. What happens if a card gateway declines or inventory drops mid-checkout? 

Watch scenario 1: When a card payment times out, the agent gracefully auto-routes to a fallback Razorpay UPI QR link without crashing the session."`,
      demoAction: "Open 'Audit Trail' to show explainable JSON telemetry, then open 'Stress Test Failures' and click 'Run Test' on Payment Decline Recovery."
    },
    {
      time: "4:30 - 5:00",
      title: "6. Conclusion & The Offer Callout",
      dialogue: `"RazorAgent proves that agent-to-agent commerce on Razorpay APIs can be secure, bounded, explainable, and revenue-maximizing. 

Thank you to the Razorpay team for organizing this incredible buildathon. All code is public on GitHub and ready for review!"`,
      demoAction: "Return to the main hero screen, showing all systems green and audit count active."
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
