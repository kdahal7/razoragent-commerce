import React, { useState } from 'react';
import { X, ShieldCheck, CreditCard, Smartphone, Building2, CheckCircle2, Lock, ArrowRight, RefreshCw, Wallet, Shield } from 'lucide-react';
import { auditLogger } from '../services/auditLogger';
import confetti from 'canvas-confetti';

export default function RazorpayCheckoutModal({ isOpen, onClose, order, onSuccess, onFailure }) {
  const [selectedMethod, setSelectedMethod] = useState('upi');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen || !order) return null;

  const amountRupees = order.amount / 100;

  const handlePaySuccess = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      const paymentId = `pay_rzp_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
      const signature = `sig_${Math.random().toString(36).substr(2, 14)}`;

      auditLogger.log({
        type: "RAZORPAY_API",
        title: `Razorpay Payment Signature Verified`,
        details: `Payment ID: ${paymentId} captured for Order ${order.id} (₹${amountRupees.toLocaleString('en-IN')})`,
        status: "success",
        agentId: "Razorpay-Payment-SDK",
        payload: {
          razorpay_payment_id: paymentId,
          razorpay_order_id: order.id,
          razorpay_signature: signature,
          method: selectedMethod,
          status: "captured"
        }
      });

      confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
      if (onSuccess) onSuccess({ razorpay_payment_id: paymentId, razorpay_order_id: order.id, razorpay_signature: signature });
      onClose();
    }, 800);
  };

  const handlePayDecline = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      auditLogger.log({
        type: "RAZORPAY_API",
        title: `Razorpay Payment Failed`,
        details: `Error Code: BAD_REQUEST_ERROR | Description: Payment declined by issuing bank`,
        status: "error",
        agentId: "Razorpay-Payment-SDK"
      });
      if (onFailure) onFailure({ code: "PAYMENT_DECLINED", description: "Payment declined by issuing bank" });
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md">
      <div className="relative w-full max-w-md bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden my-6 animate-in fade-in zoom-in duration-200">
        
        {/* Authentic Razorpay Dark Navy Header */}
        <div className="bg-[#02042B] p-5 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-md">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-extrabold text-base tracking-tight text-white">Razorpay</h3>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-400/30">
                  TEST MODE
                </span>
              </div>
              <p className="text-[11px] text-slate-300 font-mono">Order ID: {order.id}</p>
            </div>
          </div>
          <button 
            onClick={() => {
              if (onFailure) onFailure({ reason: "Cancelled by user" });
              onClose();
            }}
            className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Amount Strip */}
        <div className="bg-slate-50 px-6 py-3 border-b border-slate-200 flex items-center justify-between">
          <span className="text-xs font-bold text-slate-600">Total Payable Amount:</span>
          <span className="text-xl font-mono font-black text-blue-700">
            ₹{amountRupees.toLocaleString('en-IN')}
          </span>
        </div>

        {/* Payment Methods */}
        <div className="p-6 space-y-4">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Select Payment Option
          </label>

          <div className="space-y-2.5">
            {/* UPI Option */}
            <div
              onClick={() => setSelectedMethod('upi')}
              className={`p-3.5 rounded-2xl border text-left transition flex items-center justify-between cursor-pointer ${
                selectedMethod === 'upi'
                  ? 'bg-blue-50 border-blue-600 shadow-sm'
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center space-x-3.5">
                <div className={`p-2 rounded-xl ${selectedMethod === 'upi' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                  <Smartphone className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">UPI / QR Code</p>
                  <p className="text-[11px] text-slate-500">Google Pay, PhonePe, Paytm, BHIM UPI</p>
                </div>
              </div>
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedMethod === 'upi' ? 'border-blue-600 bg-blue-600' : 'border-slate-300'}`}>
                {selectedMethod === 'upi' && <CheckCircle2 className="w-4 h-4 text-white" />}
              </div>
            </div>

            {/* Cards Option */}
            <div
              onClick={() => setSelectedMethod('card')}
              className={`p-3.5 rounded-2xl border text-left transition flex items-center justify-between cursor-pointer ${
                selectedMethod === 'card'
                  ? 'bg-blue-50 border-blue-600 shadow-sm'
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center space-x-3.5">
                <div className={`p-2 rounded-xl ${selectedMethod === 'card' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                  <CreditCard className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">Cards (Credit / Debit)</p>
                  <p className="text-[11px] text-slate-500">Visa, Mastercard, RuPay, Corporate Cards</p>
                </div>
              </div>
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedMethod === 'card' ? 'border-blue-600 bg-blue-600' : 'border-slate-300'}`}>
                {selectedMethod === 'card' && <CheckCircle2 className="w-4 h-4 text-white" />}
              </div>
            </div>

            {/* NetBanking Option */}
            <div
              onClick={() => setSelectedMethod('netbanking')}
              className={`p-3.5 rounded-2xl border text-left transition flex items-center justify-between cursor-pointer ${
                selectedMethod === 'netbanking'
                  ? 'bg-blue-50 border-blue-600 shadow-sm'
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center space-x-3.5">
                <div className={`p-2 rounded-xl ${selectedMethod === 'netbanking' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                  <Building2 className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">NetBanking / Wallets</p>
                  <p className="text-[11px] text-slate-500">HDFC, ICICI, SBI, Axis, Amazon Pay</p>
                </div>
              </div>
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedMethod === 'netbanking' ? 'border-blue-600 bg-blue-600' : 'border-slate-300'}`}>
                {selectedMethod === 'netbanking' && <CheckCircle2 className="w-4 h-4 text-white" />}
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="pt-2 space-y-2.5">
            <button
              onClick={handlePaySuccess}
              disabled={isProcessing}
              className="w-full py-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-lg shadow-blue-600/30 transition flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
            >
              {isProcessing ? (
                <RefreshCw className="w-4 h-4 animate-spin text-white" />
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Pay ₹{amountRupees.toLocaleString('en-IN')} (Success Test)</span>
                </>
              )}
            </button>

            <button
              onClick={handlePayDecline}
              disabled={isProcessing}
              className="w-full py-2.5 rounded-2xl bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-700 border border-slate-200 text-xs font-semibold transition cursor-pointer"
            >
              Simulate Payment Failure (Test Error Recovery)
            </button>
          </div>

          <div className="flex items-center justify-center space-x-1.5 text-[10px] text-slate-400 font-mono pt-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Secured by Razorpay • 256-Bit SSL Encrypted</span>
          </div>

        </div>

      </div>
    </div>
  );
}
