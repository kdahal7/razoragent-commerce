import React from 'react';
import { Bot, Activity, AlertTriangle, FileText, ShoppingBag, Search, ShieldCheck, Sparkles } from 'lucide-react';

export default function Header({ 
  onOpenBuyerModal, 
  onOpenAudit, 
  onOpenFailureSim, 
  onOpenManifest,
  auditCount,
  cartCount,
  activeCategory,
  onSelectCategory
}) {
  const navCategories = [
    { id: 'ALL', label: 'All Products' },
    { id: 'Audio', label: 'Audio & Sound' },
    { id: 'Wearables', label: 'Smart Wearables' },
    { id: 'Furniture & Setup', label: 'Desk Setup' },
    { id: 'Accessories', label: 'Charging & Gear' }
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-xl border-b border-slate-100 shadow-sm">
      
      {/* Top Announcement Bar */}
      <div className="bg-slate-900 text-slate-200 text-[11px] font-medium py-1.5 px-4 text-center flex items-center justify-between max-w-7xl mx-auto">
        <div className="hidden md:flex items-center space-x-2 text-slate-400">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Razorpay Verified Merchant</span>
        </div>

        <div className="flex items-center space-x-2 mx-auto md:mx-0">
          <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
          <span className="font-semibold text-white">Festival Sale Live: Express 24h Delivery Across India</span>
          <span className="hidden sm:inline text-slate-400 font-mono">• Code: RAZOR10</span>
        </div>

        <div className="hidden lg:flex items-center space-x-3 text-slate-400">
          <button 
            onClick={onOpenManifest} 
            className="hover:text-blue-400 font-mono transition text-[10px] cursor-pointer"
          >
            ACP Protocol v1.0
          </button>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex items-center justify-between gap-6">
          
          {/* Logo */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => onSelectCategory && onSelectCategory('ALL')}>
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-blue-700 flex items-center justify-center text-white shadow-lg shadow-blue-600/20">
              <span className="font-black text-lg tracking-tighter">AG</span>
            </div>
            <div>
              <span className="text-xl font-black tracking-tight text-slate-900 font-sans">
                AETHERGEAR
              </span>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest -mt-1">
                Next-Gen Storefront
              </p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex items-center flex-1 max-w-md relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3" />
            <input
              type="text"
              placeholder="Search earbuds, smartwatches, chargers..."
              className="w-full pl-11 pr-4 py-2.5 rounded-2xl bg-slate-100 border border-slate-200/80 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-600 focus:border-transparent transition"
            />
          </div>

          {/* Header Action Buttons */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            
            {/* AI Buyer Agent Launcher */}
            <button
              onClick={onOpenBuyerModal}
              className="px-4 py-2 text-xs font-bold rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md shadow-blue-600/20 transition flex items-center space-x-2 border border-blue-500/20 cursor-pointer transform hover:-translate-y-0.5"
            >
              <Bot className="w-4 h-4 text-blue-100" />
              <span>AI Buyer Agent</span>
            </button>

            {/* Edge-Case Sentinel */}
            <button
              onClick={onOpenFailureSim}
              className="px-3 py-2 text-xs font-semibold rounded-2xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 transition flex items-center space-x-1.5 cursor-pointer"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
              <span className="hidden sm:inline">Stress Test</span>
            </button>

            {/* Telemetry Audit */}
            <button
              onClick={onOpenAudit}
              className="relative px-3 py-2 text-xs font-semibold rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 transition flex items-center space-x-1.5 cursor-pointer"
            >
              <Activity className="w-3.5 h-3.5 text-emerald-600" />
              <span className="hidden sm:inline">Telemetry</span>
              {auditCount > 0 && (
                <span className="ml-1 px-1.5 py-0.2 text-[10px] font-bold rounded-full bg-emerald-600 text-white font-mono">
                  {auditCount}
                </span>
              )}
            </button>

          </div>
        </div>

        {/* Category Navigation Pills */}
        <div className="flex items-center space-x-1 pt-3.5 border-t border-slate-100 mt-3 overflow-x-auto">
          {navCategories.map(cat => (
            <button
              key={cat.id}
              onClick={() => onSelectCategory && onSelectCategory(cat.id)}
              className={`px-4 py-1.5 text-xs font-semibold rounded-full transition whitespace-nowrap cursor-pointer ${
                activeCategory === cat.id
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

      </div>
    </header>
  );
}
