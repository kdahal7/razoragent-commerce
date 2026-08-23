import React, { useState } from 'react';
import { X, Bot, Zap, ShieldAlert, CheckCircle2, Play, RefreshCw, Lock, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';
import { AgentEngine } from '../services/agentEngine';

export default function AIBuyerAgentModal({ isOpen, onClose, onTriggerRazorpay }) {
  const [prompt, setPrompt] = useState("Find and buy noise-canceling earbud and wireless charging dock within budget");
  const [budgetCap, setBudgetCap] = useState(7000);
  const [isRunning, setIsRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState(null);
  const [executionResult, setExecutionResult] = useState(null);
  const [humanAuthGate, setHumanAuthGate] = useState(null);

  if (!isOpen) return null;

  const presetPrompts = [
    { label: "Earbuds & Dock (within ₹7,000)", text: "Find and buy noise-canceling earbud and wireless charging dock within budget", budget: 7000 },
    { label: "Smartwatch Purchase (within ₹15,000)", text: "Procure the Chronos AI Smartwatch Series 5 with wireless charging accessories", budget: 15000 },
    { label: "Standing Desk High-Value (₹25,000)", text: "Order the OmniDesk Ergonomic Dual-Motor Standing Desk for workstation setup", budget: 25000 },
    { label: "Low Budget Overreach Test (₹4,000 Cap)", text: "Buy Chronos AI Smartwatch Series 5 under budget cap", budget: 4000 }
  ];

  const handleRunAgent = async () => {
    setIsRunning(true);
    setCurrentStep({ step: 1, text: "Connecting to Merchant ACP Endpoint...", status: "thinking" });
    setExecutionResult(null);
    setHumanAuthGate(null);

    const result = await AgentEngine.runBuyerAgentTask({
      prompt,
      userBudgetCap: budgetCap,
      onStep: (stepInfo) => {
        setCurrentStep(stepInfo);
      },
      onGateRequired: async (gateInfo) => {
        return new Promise((resolve) => {
          setHumanAuthGate({
            ...gateInfo,
            onApprove: () => {
              setHumanAuthGate(null);
              resolve(true);
            },
            onReject: () => {
              setHumanAuthGate(null);
              resolve(false);
            }
          });
        });
      }
    });

    setIsRunning(false);
    setExecutionResult(result);
  };

  const executeRazorpayPayment = () => {
    if (!executionResult || !executionResult.order) return;

    if (onTriggerRazorpay) {
      onTriggerRazorpay({
        order: executionResult.order,
        onSuccess: (payRes) => {
          setExecutionResult({
            ...executionResult,
            paymentCompleted: true,
            paymentDetails: payRes
          });
        }
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden my-8">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                <span>Autonomous AI Buyer Agent</span>
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-200">
                  UAP/ACP Protocol
                </span>
              </h2>
              <p className="text-xs text-slate-500">
                Executes explainable, bounded procurement directly over Razorpay APIs.
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          
          {/* Quick Preset Options */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Quick Test Scenarios
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {presetPrompts.map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setPrompt(preset.text);
                    setBudgetCap(preset.budget);
                  }}
                  className="p-3 text-left rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 transition space-y-1 group"
                >
                  <p className="text-xs font-bold text-slate-900 group-hover:text-blue-600">{preset.label}</p>
                  <p className="text-[11px] text-slate-500 line-clamp-1">{preset.text}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Form Configuration */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2 space-y-1.5">
              <label className="text-xs font-bold text-slate-800">
                Agent Procurement Prompt:
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={2}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500"
                placeholder="Describe what the AI Buyer agent should procure..."
              />
            </div>
            
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-800 flex items-center justify-between">
                <span>Budget Cap (₹):</span>
                <span className="text-blue-600 font-mono">₹{budgetCap.toLocaleString('en-IN')}</span>
              </label>
              <input
                type="number"
                value={budgetCap}
                onChange={(e) => setBudgetCap(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 font-mono focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-[10px] text-slate-500">
                Safety Gate prevents spending over cap.
              </p>
            </div>
          </div>

          {/* Execution Button */}
          <button
            onClick={handleRunAgent}
            disabled={isRunning}
            className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-600/20 transition flex items-center justify-center space-x-2 border border-blue-500/30 disabled:opacity-50"
          >
            {isRunning ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-white" />
                <span>Executing Agent Reasoning & Safety Gates...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 text-white" />
                <span>Run Agent Procurement Workflow</span>
              </>
            )}
          </button>

          {/* Current Live Step Progress Indicator */}
          {currentStep && (
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-600">Execution Phase {currentStep.step} of 5</span>
                <span className="text-blue-600 font-mono font-bold">{currentStep.status.toUpperCase()}</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-ping"></div>
                <p className="text-xs font-semibold text-slate-900">{currentStep.text}</p>
              </div>
            </div>
          )}

          {/* Human Authorization Gate Trigger */}
          {humanAuthGate && (
            <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 space-y-3">
              <div className="flex items-center space-x-2 font-bold text-sm text-amber-800">
                <ShieldAlert className="w-5 h-5 text-amber-600 animate-bounce" />
                <span>Step-Up Safety Gate: Human Approval Required</span>
              </div>
              <p className="text-xs text-slate-700">
                The agent requested a high-value money action of <span className="font-bold font-mono text-slate-900">₹{humanAuthGate.totalPrice.toLocaleString('en-IN')}</span>. This exceeds the auto-approval cap of ₹15,000.
              </p>
              <div className="flex items-center space-x-3 pt-1">
                <button
                  onClick={humanAuthGate.onApprove}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition"
                >
                  Approve Transaction (Authorize Razorpay)
                </button>
                <button
                  onClick={humanAuthGate.onReject}
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition"
                >
                  Reject & Halt
                </button>
              </div>
            </div>
          )}

          {/* Execution Result */}
          {executionResult && (
            <div className={`p-5 rounded-2xl border space-y-4 ${
              executionResult.success 
                ? 'bg-emerald-50 border-emerald-200 text-emerald-950' 
                : 'bg-rose-50 border-rose-200 text-rose-950'
            }`}>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {executionResult.success ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  ) : (
                    <ShieldAlert className="w-5 h-5 text-rose-600" />
                  )}
                  <span className="font-bold text-sm">
                    {executionResult.success ? "Procurement Order Generated Successfully" : "Money Action Intercepted by Safety Gate"}
                  </span>
                </div>
                {executionResult.success && (
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200">
                    Order ID: {executionResult.order.id}
                  </span>
                )}
              </div>

              {/* Items Selected */}
              {executionResult.items && executionResult.items.length > 0 && (
                <div className="space-y-1.5">
                  <p className="text-xs font-semibold text-slate-700">Selected Items:</p>
                  <div className="space-y-1">
                    {executionResult.items.map((item, i) => (
                      <div key={i} className="flex items-center justify-between text-xs bg-white p-2.5 rounded-xl border border-slate-200">
                        <span className="font-semibold text-slate-800">{item.name}</span>
                        <span className="font-mono text-emerald-700 font-bold">₹{item.price.toLocaleString('en-IN')}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Explainability Trace */}
              {executionResult.explainabilityTrace && (
                <div className="space-y-1.5">
                  <p className="text-xs font-semibold text-slate-700">Explainable Audit Trail:</p>
                  <ul className="text-[11px] space-y-1 text-slate-600 font-mono bg-white p-3 rounded-xl border border-slate-200">
                    {executionResult.explainabilityTrace.map((trace, idx) => (
                      <li key={idx}>{trace}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Execute Razorpay Payment */}
              {executionResult.success && !executionResult.paymentCompleted && (
                <button
                  onClick={executeRazorpayPayment}
                  className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition flex items-center justify-center space-x-2"
                >
                  <ShieldCheck className="w-4 h-4 text-white" />
                  <span>Execute Razorpay Payment (₹{executionResult.totalPrice.toLocaleString('en-IN')})</span>
                </button>
              )}

              {executionResult.paymentCompleted && (
                <div className="p-3 rounded-xl bg-emerald-100 border border-emerald-300 text-emerald-800 text-xs font-bold text-center">
                  Payment Captured! Payment ID: {executionResult.paymentDetails.razorpay_payment_id}
                </div>
              )}

            </div>
          )}

        </div>

      </div>
    </div>
  );
}
