import React, { useState } from 'react';
import { X, AlertTriangle, ShieldCheck, RefreshCw, CheckCircle2, Play, AlertOctagon, HelpCircle } from 'lucide-react';
import { AgentEngine } from '../services/agentEngine';

export default function FailureSimulator({ isOpen, onClose }) {
  const [activeScenario, setActiveScenario] = useState(null);
  const [result, setResult] = useState(null);

  if (!isOpen) return null;

  const scenarios = [
    {
      id: "PAYMENT_DECLINE",
      title: "1. Razorpay Gateway Decline / Issuer Timeout",
      description: "Simulate card payment gateway failure during agentic checkout. The agent intercepts the error and auto-generates a fallback Razorpay UPI Payment Link.",
      icon: AlertTriangle,
      color: "amber"
    },
    {
      id: "INVENTORY_SHORTAGE",
      title: "2. Mid-Transaction Inventory Shortage",
      description: "Simulate product stock depleting during agent cart lock. The agent substitutes the item with an upgraded tier and locks in the price.",
      icon: RefreshCw,
      color: "blue"
    },
    {
      id: "BOUNDS_VIOLATION",
      title: "3. Agent Spending Bounds Violation",
      description: "Simulate an AI agent attempting a money action exceeding merchant safety limits (₹24,999 > ₹15,000 cap). Execution halts safely.",
      icon: AlertOctagon,
      color: "rose"
    }
  ];

  const handleTestScenario = (id) => {
    setActiveScenario(id);
    const res = AgentEngine.simulateFailureScenario(id);
    setResult(res);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden my-6">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 border border-amber-200 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-amber-700" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                <span>Failure & Edge-Case Stress Tester</span>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-200">
                  Track 01 Requirement
                </span>
              </h2>
              <p className="text-xs text-slate-500">
                Demonstrates graceful error handling, fallback routing, and bounded mitigation.
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          
          <div className="space-y-3">
            <p className="text-xs font-bold text-slate-700">Select Failure Scenario to Simulate:</p>
            
            <div className="space-y-2.5">
              {scenarios.map(sc => (
                <div
                  key={sc.id}
                  className="p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:border-slate-300 transition flex items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold text-slate-900 flex items-center gap-2">
                      <span>{sc.title}</span>
                    </h4>
                    <p className="text-[11px] text-slate-600 leading-relaxed">{sc.description}</p>
                  </div>
                  <button
                    onClick={() => handleTestScenario(sc.id)}
                    className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition flex-shrink-0 flex items-center space-x-1 shadow-sm"
                  >
                    <Play className="w-3.5 h-3.5" />
                    <span>Run Test</span>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Test Result Display */}
          {result && (
            <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-emerald-800 flex items-center gap-1.5 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>{result.scenario} Evaluated</span>
                </span>
                <span className="px-2 py-0.5 rounded font-mono text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                  {result.statusText}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-white border border-slate-200 space-y-1">
                <p className="text-[10px] font-bold uppercase text-slate-500">Agent Graceful Mitigation Action:</p>
                <p className="text-slate-800 font-medium">{result.mitigation}</p>
              </div>

              <p className="text-[11px] text-slate-600 font-mono">
                Audit event dispatched to telemetry log. Check Telemetry panel to inspect explainable trace.
              </p>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
