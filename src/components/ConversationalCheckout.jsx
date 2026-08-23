import React, { useState } from 'react';
import { MessageSquare, Send, Sparkles, Bot, User, CheckCircle2, ArrowRight, Zap, X } from 'lucide-react';
import { PRODUCTS, MERCHANT_INFO } from '../data/mockCatalog';
import { createRazorpayOrder } from '../services/razorpayService';
import { auditLogger } from '../services/auditLogger';

export default function ConversationalCheckout({ onTriggerRazorpay }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: `Hello! I'm AetherGear's Shopping & AI Agent Assistant. Looking for product recommendations or a custom bundle discount? Ask me anything!`,
      timestamp: new Date().toLocaleTimeString()
    }
  ]);
  const [input, setInput] = useState('');
  const [pendingCheckout, setPendingCheckout] = useState(null);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userText = input;
    setInput('');

    // Add user message
    const updatedMessages = [
      ...messages,
      { sender: 'user', text: userText, timestamp: new Date().toLocaleTimeString() }
    ];
    setMessages(updatedMessages);

    // Bot reasoning delay
    setTimeout(async () => {
      const lower = userText.toLowerCase();
      let botResponse = "";
      let offerItem = null;

      if (lower.includes("earbud") || lower.includes("audio") || lower.includes("sound")) {
        offerItem = PRODUCTS[0];
        botResponse = `The ${offerItem.name} is our top recommendation! It features active noise cancellation and spatial audio for ₹${offerItem.price.toLocaleString('en-IN')}. Would you like me to generate an instant Razorpay checkout link with an extra 10% AI discount?`;
      } else if (lower.includes("watch") || lower.includes("fitness")) {
        offerItem = PRODUCTS[1];
        botResponse = `I recommend the ${offerItem.name}. It offers ECG monitoring and standalone GPS for ₹${offerItem.price.toLocaleString('en-IN')}. I can apply a special ₹1,000 merchant discount right now!`;
      } else if (lower.includes("discount") || lower.includes("deal") || lower.includes("best price")) {
        offerItem = PRODUCTS[0];
        const discPrice = Math.round(offerItem.price * 0.85);
        botResponse = `As an authorized Merchant Agent, I can grant you a 15% bundle discount on ${offerItem.name} bringing the price down to ₹${discPrice.toLocaleString('en-IN')}.`;
      } else {
        offerItem = PRODUCTS[3];
        botResponse = `I can help you select from our premium AI accessories or set up a custom order! For instance, our ${offerItem.name} is on sale for ₹${offerItem.price.toLocaleString('en-IN')}.`;
      }

      if (offerItem) {
        const itemPrice = lower.includes("discount") ? Math.round(offerItem.price * 0.85) : offerItem.price;
        setPendingCheckout({ item: offerItem, price: itemPrice });
      }

      auditLogger.log({
        type: "UPSALE",
        title: "Conversational Growth Agent Recommendation",
        details: `User Prompt: "${userText}" | Agent Output: Offered ${offerItem ? offerItem.name : 'Catalog info'}`,
        status: "info",
        agentId: "Merchant-Conversational-Agent"
      });

      setMessages([
        ...updatedMessages,
        { sender: 'bot', text: botResponse, timestamp: new Date().toLocaleTimeString() }
      ]);
    }, 600);
  };

  const handleInstantCheckout = async () => {
    if (!pendingCheckout) return;

    const rzpOrder = await createRazorpayOrder({
      amount: pendingCheckout.price,
      items: [pendingCheckout.item],
      metadata: { channel: "Conversational-InApp-Checkout" }
    });

    if (onTriggerRazorpay) {
      onTriggerRazorpay({
        order: rzpOrder,
        onSuccess: (res) => {
          setMessages(prev => [
            ...prev,
            {
              sender: 'bot',
              text: `Payment verified! Order ID: ${rzpOrder.id} | Payment ID: ${res.razorpay_payment_id}. Your items are being prepared for dispatch.`,
              timestamp: new Date().toLocaleTimeString()
            }
          ]);
          setPendingCheckout(null);
        }
      });
    }
  };

  return (
    <>
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-40 p-4 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-2xl shadow-blue-500/40 transition duration-300 transform hover:scale-105 flex items-center space-x-2.5 border border-blue-500/30"
        >
          <div className="relative">
            <MessageSquare className="w-6 h-6 text-white" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full animate-ping"></span>
          </div>
          <span className="text-xs font-extrabold hidden sm:inline">AI Shopping Assistant</span>
        </button>
      )}

      {/* Conversational Drawer / Box */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-full max-w-sm sm:max-w-md bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden flex flex-col h-[520px]">
          
          {/* Header */}
          <div className="flex items-center justify-between p-4 bg-slate-50 border-b border-slate-200">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div>
                <h4 className="text-xs font-extrabold text-slate-900 flex items-center gap-1.5">
                  <span>Merchant AI Growth Agent</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                </h4>
                <p className="text-[10px] text-slate-500">Conversational In-App Razorpay Checkout</p>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200 transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages Body */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex gap-2 text-xs ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'bot' && (
                  <div className="w-6 h-6 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Bot className="w-3.5 h-3.5 text-blue-700" />
                  </div>
                )}
                <div
                  className={`p-3 rounded-2xl max-w-[80%] leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-blue-600 text-white rounded-tr-none shadow-sm'
                      : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none shadow-sm'
                  }`}
                >
                  <p>{msg.text}</p>
                  <span className={`text-[9px] mt-1 block text-right font-mono opacity-70 ${msg.sender === 'user' ? 'text-blue-100' : 'text-slate-400'}`}>
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            ))}

            {/* Instant Checkout Action Box if generated */}
            {pendingCheckout && (
              <div className="p-3.5 rounded-2xl bg-indigo-50 border border-indigo-200 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5 text-amber-500" />
                    <span>In-App Razorpay Link Ready</span>
                  </span>
                  <span className="font-mono text-emerald-700 font-bold">
                    ₹{pendingCheckout.price.toLocaleString('en-IN')}
                  </span>
                </div>
                <p className="text-slate-600 text-[11px]">
                  {pendingCheckout.item.name}
                </p>
                <button
                  onClick={handleInstantCheckout}
                  className="w-full py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition flex items-center justify-center space-x-1.5 shadow-md"
                >
                  <span>Pay Now via Razorpay</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          {/* Input Form */}
          <form onSubmit={handleSend} className="p-3 bg-white border-t border-slate-200 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask for discount, product recommendation..."
              className="flex-1 px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="p-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition flex items-center justify-center"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>
      )}
    </>
  );
}
