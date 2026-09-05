import React, { useState } from 'react';
import { X, TrendingUp, Sparkles, Target, Zap, ShieldCheck, CheckCircle2, Play, RefreshCw, Link as LinkIcon, DollarSign, BarChart3, Users } from 'lucide-react';
import { AgentEngine } from '../services/agentEngine';

export default function CampaignOrchestratorModal({ isOpen, onClose }) {
  const [selectedCampaign, setSelectedCampaign] = useState('FESTIVAL_AUDIO_SURGE');
  const [budgetCap, setBudgetCap] = useState(5000);
  const [targetSegment, setTargetSegment] = useState('AI Agents & Returning Shoppers');
  const [isOrchestrating, setIsOrchestrating] = useState(false);
  const [campaignResult, setCampaignResult] = useState(null);

  if (!isOpen) return null;

  const campaignOptions = [
    {
      id: "FESTIVAL_AUDIO_SURGE",
      title: "Festival Audio Surge Bundle",
      description: "Applies high-margin 20% dynamic discount on flagship audio gear with express 24h shipping guarantees.",
      badge: "High ROI • +₹85k Est.",
      icon: Sparkles,
      color: "emerald"
    },
    {
      id: "ABANDONED_CART_RECOVERY",
      title: "Abandoned Cart Recovery Booster",
      description: "Auto-dispatches targeted 12% time-locked promo codes to shoppers and AI agents with pending bags.",
      badge: "Fast Turnaround • 450 Carts",
      icon: Target,
      color: "blue"
    },
    {
      id: "VIP_AGENT_REFERRAL",
      title: "VIP AI Agent Referral Bounty",
      description: "Publishes machine-readable 15% discount bounties to the ACP protocol manifest for autonomous buyer agents.",
      badge: "Protocol Native",
      icon: Zap,
      color: "indigo"
    }
  ];

  const handleRunCampaign = async () => {
    setIsOrchestrating(true);
    setCampaignResult(null);

    const result = await AgentEngine.runCampaignOrchestrator({
      campaignType: selectedCampaign,
      budgetCap,
      targetSegment
    });

    setIsOrchestrating(false);
    setCampaignResult(result);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden my-6 max-h-[85vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-700">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                <span>AI Campaign & Growth Orchestrator</span>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200">
                  Track 01 Core Feature
                </span>
              </h2>
              <p className="text-xs text-slate-500">
                Automates revenue growth with bounded marketing budgets and Razorpay payment links.
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 overflow-y-auto flex-1">
          
          {/* Campaign Strategy Selection */}
          <div className="space-y-2.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <BarChart3 className="w-3.5 h-3.5 text-blue-600" />
              <span>Select AI Growth Strategy</span>
            </label>

            <div className="space-y-2">
              {campaignOptions.map(opt => {
                const isSelected = selectedCampaign === opt.id;
                const IconComponent = opt.icon;
                return (
                  <div
                    key={opt.id}
                    onClick={() => setSelectedCampaign(opt.id)}
                    className={`p-4 rounded-2xl border transition cursor-pointer flex items-start justify-between gap-4 ${
                      isSelected
                        ? 'bg-blue-50/80 border-blue-600 shadow-sm'
                        : 'bg-slate-50/70 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-start space-x-3.5">
                      <div className={`p-2 rounded-xl mt-0.5 ${isSelected ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-600'}`}>
                        <IconComponent className="w-4 h-4" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-bold text-slate-900">{opt.title}</h4>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                            {opt.badge}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600 leading-relaxed">{opt.description}</p>
                      </div>
                    </div>

                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center mt-1 flex-shrink-0 ${
                      isSelected ? 'border-blue-600 bg-blue-600' : 'border-slate-300'
                    }`}>
                      {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white"></div>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Budget & Target Gating */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                <span>Ad & Discount Budget Cap:</span>
                <span className="font-mono text-emerald-700 font-bold">₹{budgetCap.toLocaleString('en-IN')}</span>
              </label>
              <input
                type="number"
                value={budgetCap}
                onChange={(e) => setBudgetCap(Number(e.target.value))}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-900 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-[10px] text-slate-500">Bounded limit: Max ₹15,000 policy ceiling.</p>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                <span>Target Audience:</span>
                <span className="text-[11px] text-blue-600 font-semibold flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  <span>Segment</span>
                </span>
              </label>
              <select
                value={targetSegment}
                onChange={(e) => setTargetSegment(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500"
              >
                <option value="AI Agents & Returning Shoppers">AI Agents & Returning Shoppers</option>
                <option value="Cart Abandoners (Last 24h)">Cart Abandoners (Last 24h)</option>
                <option value="High-Intent Audio Buyers">High-Intent Audio Buyers</option>
                <option value="All Protocol Handshake Agents">All Protocol Handshake Agents</option>
              </select>
              <p className="text-[10px] text-slate-500">Autonomous audience routing active.</p>
            </div>
          </div>

          {/* Launch Button */}
          <button
            onClick={handleRunCampaign}
            disabled={isOrchestrating}
            className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md shadow-emerald-600/20 transition flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
          >
            {isOrchestrating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-white" />
                <span>Orchestrating Bounded AI Campaign...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 text-white" />
                <span>Launch Autonomous AI Campaign</span>
              </>
            )}
          </button>

          {/* Campaign Live Output */}
          {campaignResult && (
            <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-3.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-emerald-900 flex items-center gap-1.5 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Campaign Active & Orchestrated</span>
                </span>
                <span className="px-2.5 py-0.5 rounded-full font-mono text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                  ID: {campaignResult.campaignId}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                  <p className="text-[10px] text-slate-500 font-bold uppercase">Promo Code</p>
                  <p className="font-mono text-emerald-700 font-extrabold text-sm">{campaignResult.promoCode}</p>
                </div>
                <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                  <p className="text-[10px] text-slate-500 font-bold uppercase">Projected Revenue</p>
                  <p className="font-mono text-slate-900 font-extrabold text-sm">+₹{campaignResult.projectedRevenueBump.toLocaleString('en-IN')}</p>
                </div>
                <div className="p-2.5 rounded-xl bg-white border border-slate-200 col-span-2 sm:col-span-1">
                  <p className="text-[10px] text-slate-500 font-bold uppercase">Estimated Reach</p>
                  <p className="font-mono text-slate-900 font-extrabold text-sm">{campaignResult.estimatedReach.toLocaleString('en-IN')} Users/Agents</p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-white border border-slate-200 space-y-1">
                <p className="text-[10px] font-bold uppercase text-slate-500">Autonomous Strategy:</p>
                <p className="text-slate-800 font-medium">{campaignResult.strategySummary}</p>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-100/70 border border-emerald-300 text-emerald-900 font-mono text-[11px]">
                <div className="flex items-center space-x-1.5 truncate">
                  <LinkIcon className="w-3.5 h-3.5 text-emerald-700 flex-shrink-0" />
                  <span className="truncate">Razorpay Link: {campaignResult.paymentLink}</span>
                </div>
                <span className="text-[10px] bg-emerald-600 text-white px-2 py-0.5 rounded-md font-bold flex-shrink-0">
                  LIVE LINK
                </span>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
