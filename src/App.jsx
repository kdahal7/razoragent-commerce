import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import MerchantStorefront from './components/MerchantStorefront';
import AIBuyerAgentModal from './components/AIBuyerAgentModal';
import ConversationalCheckout from './components/ConversationalCheckout';
import AuditTrailPanel from './components/AuditTrailPanel';
import FailureSimulator from './components/FailureSimulator';
import ProtocolManifestModal from './components/ProtocolManifestModal';
import RazorpayCheckoutModal from './components/RazorpayCheckoutModal';
import { auditLogger } from './services/auditLogger';
import { ShieldCheck } from 'lucide-react';

export default function App() {
  const [isBuyerModalOpen, setIsBuyerModalOpen] = useState(false);
  const [isAuditOpen, setIsAuditOpen] = useState(false);
  const [isFailureSimOpen, setIsFailureSimOpen] = useState(false);
  const [isManifestOpen, setIsManifestOpen] = useState(false);
  const [auditLogs, setAuditLogs] = useState([]);
  const [cartItemsCount, setCartItemsCount] = useState(0);
  const [activeCategory, setActiveCategory] = useState('ALL');

  // Razorpay Checkout Modal state
  const [razorpayModalData, setRazorpayModalData] = useState(null);

  useEffect(() => {
    // Log initial system boot
    auditLogger.log({
      type: "DISCOVERY",
      title: "RazorAgent Commerce Core Bootstrapped",
      details: "ACP/UAP Protocol manifest initialized at /.well-known/agentic-commerce.json | Razorpay API Integration Mode: Test Active",
      status: "success",
      agentId: "System-Boot"
    });

    const unsubscribe = auditLogger.subscribe((logs) => {
      setAuditLogs([...logs]);
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between selection:bg-blue-600 selection:text-white font-sans antialiased">
      
      <div>
        {/* Navigation & Header */}
        <Header 
          onOpenBuyerModal={() => setIsBuyerModalOpen(true)}
          onOpenAudit={() => setIsAuditOpen(true)}
          onOpenFailureSim={() => setIsFailureSimOpen(true)}
          onOpenManifest={() => setIsManifestOpen(true)}
          auditCount={auditLogs.length}
          cartCount={cartItemsCount}
          activeCategory={activeCategory}
          onSelectCategory={(cat) => setActiveCategory(cat)}
        />

        {/* Main Merchant Storefront & Agent System */}
        <main className="pb-16">
          <MerchantStorefront 
            onOpenBuyerModal={() => setIsBuyerModalOpen(true)}
            onCartUpdate={(cart) => setCartItemsCount(cart.reduce((a, b) => a + b.quantity, 0))}
            onTriggerRazorpay={(checkoutData) => setRazorpayModalData(checkoutData)}
            activeCategory={activeCategory}
            onSelectCategory={(cat) => setActiveCategory(cat)}
          />
        </main>
      </div>

      {/* Floating Conversational In-App Razorpay Checkout Widget */}
      <ConversationalCheckout 
        onTriggerRazorpay={(checkoutData) => setRazorpayModalData(checkoutData)}
      />

      {/* Modals & Drawers */}
      <AIBuyerAgentModal 
        isOpen={isBuyerModalOpen}
        onClose={() => setIsBuyerModalOpen(false)}
        onTriggerRazorpay={(checkoutData) => setRazorpayModalData(checkoutData)}
      />

      <AuditTrailPanel 
        isOpen={isAuditOpen}
        onClose={() => setIsAuditOpen(false)}
      />

      <FailureSimulator 
        isOpen={isFailureSimOpen}
        onClose={() => setIsFailureSimOpen(false)}
      />

      <ProtocolManifestModal 
        isOpen={isManifestOpen}
        onClose={() => setIsManifestOpen(false)}
      />

      {/* Interactive Razorpay Checkout Modal */}
      {razorpayModalData && (
        <RazorpayCheckoutModal
          isOpen={!!razorpayModalData}
          order={razorpayModalData.order}
          onSuccess={(res) => {
            if (razorpayModalData.onSuccess) razorpayModalData.onSuccess(res);
            setRazorpayModalData(null);
          }}
          onFailure={(err) => {
            if (razorpayModalData.onFailure) razorpayModalData.onFailure(err);
            setRazorpayModalData(null);
          }}
          onClose={() => setRazorpayModalData(null)}
        />
      )}

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-slate-800">AetherGear Electronics</span>
            <span>•</span>
            <span>Agentic Commerce Protocol (ACP / UAP v1.0)</span>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsManifestOpen(true)}
              className="text-slate-600 hover:text-blue-600 font-mono transition"
            >
              /.well-known/agentic-commerce.json
            </button>
            <span className="text-slate-300">•</span>
            <div className="flex items-center space-x-1.5 text-emerald-600 font-semibold">
              <ShieldCheck className="w-4 h-4" />
              <span>Razorpay Verified Merchant</span>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
