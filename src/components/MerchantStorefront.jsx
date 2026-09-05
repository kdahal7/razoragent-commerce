import React, { useState } from 'react';
import { ShoppingBag, Sparkles, Shield, Tag, ArrowRight, CheckCircle2, Zap, AlertCircle, Bot, Star, Lock, Activity, Truck, RefreshCw, ShieldCheck, Award, Heart, SlidersHorizontal } from 'lucide-react';
import { PRODUCTS, MERCHANT_INFO } from '../data/mockCatalog';
import { AgentEngine } from '../services/agentEngine';
import { createRazorpayOrder } from '../services/razorpayService';

export default function MerchantStorefront({ 
  onCartUpdate, 
  onOpenBuyerModal, 
  onOpenCampaign, 
  onOpenFailureSim, 
  onOpenAudit, 
  onOpenManifest, 
  onTriggerRazorpay, 
  activeCategory, 
  onSelectCategory 
}) {
  const [cart, setCart] = useState([]);
  const [growthOffer, setGrowthOffer] = useState(null);
  const [isProcessingCheckout, setIsProcessingCheckout] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(null);
  const [sortBy, setSortBy] = useState('FEATURED');
  const [wishlist, setWishlist] = useState([]);

  let filteredProducts = (!activeCategory || activeCategory === 'ALL')
    ? PRODUCTS 
    : PRODUCTS.filter(p => p.category === activeCategory);

  if (sortBy === 'PRICE_LOW') {
    filteredProducts = [...filteredProducts].sort((a, b) => a.price - b.price);
  } else if (sortBy === 'PRICE_HIGH') {
    filteredProducts = [...filteredProducts].sort((a, b) => b.price - a.price);
  } else if (sortBy === 'RATING') {
    filteredProducts = [...filteredProducts].sort((a, b) => b.rating - a.rating);
  }

  const toggleWishlist = (productId) => {
    if (wishlist.includes(productId)) {
      setWishlist(wishlist.filter(id => id !== productId));
    } else {
      setWishlist([...wishlist, productId]);
    }
  };

  const addToCart = (product) => {
    const existing = cart.find(item => item.id === product.id);
    let newCart;
    if (existing) {
      newCart = cart.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
    } else {
      newCart = [...cart, { ...product, quantity: 1 }];
    }
    setCart(newCart);
    if (onCartUpdate) onCartUpdate(newCart);

    // Trigger Merchant AI Growth Upsell Engine
    const offer = AgentEngine.generateGrowthRecommendation(newCart);
    setGrowthOffer(offer);
  };

  const removeFromCart = (productId) => {
    const newCart = cart.filter(item => item.id !== productId);
    setCart(newCart);
    if (onCartUpdate) onCartUpdate(newCart);
    if (newCart.length === 0) setGrowthOffer(null);
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleCheckout = async () => {
    if (cart.length === 0 || isProcessingCheckout) return;

    setIsProcessingCheckout(true);
    try {
      let finalAmount = cartTotal;
      let finalItems = [...cart];

      if (growthOffer && growthOffer.accepted) {
        finalAmount += growthOffer.discountedPrice;
        finalItems.push({ ...growthOffer.recommendation, price: growthOffer.discountedPrice, quantity: 1 });
      }

      const rzpOrder = await createRazorpayOrder({
        amount: finalAmount,
        items: finalItems,
        metadata: { channel: "Merchant-Direct-Checkout" }
      });

      setIsProcessingCheckout(false);

      if (onTriggerRazorpay) {
        onTriggerRazorpay({
          order: rzpOrder,
          onSuccess: (res) => {
            setPaymentSuccess({ orderId: rzpOrder.id, paymentId: res.razorpay_payment_id, amount: finalAmount });
            setCart([]);
            setGrowthOffer(null);
          },
          onFailure: (err) => {
            console.log("Razorpay Checkout Failure/Cancelled:", err);
          }
        });
      }
    } catch (err) {
      console.error(err);
      setIsProcessingCheckout(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      
      {/* Reviewer Quick Test Flight Bar */}
      <div className="rounded-2xl bg-white border border-slate-200/90 p-4 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-100 pb-2.5">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-800">
              Track 01 Reviewer Quick Flight Bar
            </h3>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
              1-Click Demo Launcher
            </span>
          </div>
          <span className="text-[11px] text-slate-500">
            Click any pillar below to test live interactive features immediately:
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
          <button
            onClick={onOpenBuyerModal}
            className="p-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-200 transition text-left space-y-1 cursor-pointer group"
          >
            <div className="flex items-center space-x-1.5 font-bold text-xs group-hover:text-blue-700">
              <Bot className="w-4 h-4 text-blue-600" />
              <span>1. AI Buyer</span>
            </div>
            <p className="text-[10px] text-slate-500 line-clamp-1">Machine procurement & gates</p>
          </button>

          <button
            onClick={onOpenCampaign}
            className="p-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 transition text-left space-y-1 cursor-pointer group"
          >
            <div className="flex items-center space-x-1.5 font-bold text-xs group-hover:text-emerald-700">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>2. Campaigns</span>
            </div>
            <p className="text-[10px] text-slate-500 line-clamp-1">Flash sales & Razorpay links</p>
          </button>

          <button
            onClick={onOpenFailureSim}
            className="p-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 transition text-left space-y-1 cursor-pointer group"
          >
            <div className="flex items-center space-x-1.5 font-bold text-xs group-hover:text-amber-700">
              <AlertCircle className="w-4 h-4 text-amber-600" />
              <span>3. Failure Sentinel</span>
            </div>
            <p className="text-[10px] text-slate-500 line-clamp-1">Decline fallback to UPI</p>
          </button>

          <button
            onClick={onOpenAudit}
            className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-900 border border-slate-200 transition text-left space-y-1 cursor-pointer group"
          >
            <div className="flex items-center space-x-1.5 font-bold text-xs group-hover:text-blue-600">
              <Activity className="w-4 h-4 text-emerald-600" />
              <span>4. Telemetry</span>
            </div>
            <p className="text-[10px] text-slate-500 line-clamp-1">Explainable JSON audit log</p>
          </button>

          <button
            onClick={onOpenManifest}
            className="p-2.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-200 transition text-left space-y-1 cursor-pointer group col-span-2 sm:col-span-1"
          >
            <div className="flex items-center space-x-1.5 font-bold text-xs group-hover:text-purple-700">
              <Tag className="w-4 h-4 text-purple-600" />
              <span>5. ACP Schema</span>
            </div>
            <p className="text-[10px] text-slate-500 line-clamp-1">Machine-readable manifest</p>
          </button>
        </div>
      </div>

      {/* Premium Hero Section */}
      <div className="relative rounded-3xl bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 p-8 md:p-10 text-white overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 -mt-16 -mr-16 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/4 -mb-16 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-white/10 text-blue-200 text-xs font-semibold backdrop-blur-md border border-white/15">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>FESTIVAL EDITION • UP TO 35% OFF</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white leading-tight">
              Engineering the Future of Sound & Workspaces
            </h1>

            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-xl">
              Discover flagship audio gear and ergonomic tech. Fully transactable by human shoppers and autonomous AI Buyer Agents over Razorpay APIs.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-1 text-xs font-medium text-slate-300">
              <div className="flex items-center space-x-1.5 bg-white/10 px-3 py-1.5 rounded-xl backdrop-blur-md border border-white/10">
                <Truck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Express Shipping</span>
              </div>
              <div className="flex items-center space-x-1.5 bg-white/10 px-3 py-1.5 rounded-xl backdrop-blur-md border border-white/10">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                <span>1-Year Warranty</span>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={onOpenBuyerModal}
                className="px-5 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs sm:text-sm shadow-xl shadow-blue-600/30 transition flex items-center space-x-2 border border-blue-400/30 cursor-pointer transform hover:-translate-y-0.5"
              >
                <Bot className="w-4 h-4 text-white" />
                <span>Simulate AI Buyer Procurement</span>
              </button>

              <button
                onClick={onOpenCampaign}
                className="px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm backdrop-blur-md transition flex items-center space-x-2 border border-white/20 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Launch AI Campaign</span>
              </button>
            </div>
          </div>

          {/* Hero Spotlight Product Preview */}
          <div className="lg:col-span-5 hidden lg:block">
            <div className="relative rounded-2xl bg-white/5 border border-white/10 p-4 backdrop-blur-md shadow-2xl space-y-3">
              <img 
                src="/images/earbuds.jpg" 
                alt="AetherPulse Pro"
                className="w-full h-48 object-cover rounded-xl shadow-lg"
              />
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold text-blue-300 uppercase tracking-wider">Spotlight Feature</p>
                  <h4 className="text-xs font-extrabold text-white">AetherPulse Pro Earbuds</h4>
                </div>
                <span className="text-sm font-black text-emerald-400 font-mono">₹4,999</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Trust Badges Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-3 border-y border-slate-200 text-xs">
        <div className="flex items-center space-x-3 p-2">
          <Truck className="w-5 h-5 text-blue-600 flex-shrink-0" />
          <div>
            <p className="font-bold text-slate-900">Express Delivery</p>
            <p className="text-[11px] text-slate-500">Ships within 24 hours</p>
          </div>
        </div>
        <div className="flex items-center space-x-3 p-2">
          <ShieldCheck className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <div>
            <p className="font-bold text-slate-900">Razorpay Secured</p>
            <p className="text-[11px] text-slate-500">256-bit Encrypted Checkout</p>
          </div>
        </div>
        <div className="flex items-center space-x-3 p-2">
          <Award className="w-5 h-5 text-amber-600 flex-shrink-0" />
          <div>
            <p className="font-bold text-slate-900">Original Products</p>
            <p className="text-[11px] text-slate-500">100% Verified Quality</p>
          </div>
        </div>
        <div className="flex items-center space-x-3 p-2">
          <Bot className="w-5 h-5 text-indigo-600 flex-shrink-0" />
          <div>
            <p className="font-bold text-slate-900">AI Agent Ready</p>
            <p className="text-[11px] text-slate-500">ACP & UAP Protocol Compliant</p>
          </div>
        </div>
      </div>

      {/* Main Showcase Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Product Catalog Section (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Header Controls & Sorting */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-2 border-b border-slate-200">
            <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-blue-600" />
              <span>Explore Products</span>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-200 text-slate-700">
                {filteredProducts.length} Items
              </span>
            </h2>

            <div className="flex items-center space-x-2 text-xs">
              <SlidersHorizontal className="w-4 h-4 text-slate-500" />
              <span className="text-slate-500 font-semibold">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 cursor-pointer"
              >
                <option value="FEATURED">Featured</option>
                <option value="PRICE_LOW">Price: Low to High</option>
                <option value="PRICE_HIGH">Price: High to Low</option>
                <option value="RATING">Highest Rated</option>
              </select>
            </div>
          </div>

          {/* Product Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {filteredProducts.map(product => {
              const discountPercent = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
              const isWishlisted = wishlist.includes(product.id);

              return (
                <div 
                  key={product.id}
                  className="group bg-white rounded-3xl border border-slate-200/90 hover:border-blue-400 hover:shadow-2xl transition-all duration-300 overflow-hidden flex flex-col justify-between"
                >
                  <div>
                    {/* Image Box */}
                    <div className="relative h-52 w-full bg-slate-100 overflow-hidden">
                      <img 
                        src={product.image} 
                        alt={product.name} 
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                      />
                      
                      {/* Discount Tag */}
                      <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-rose-600 text-white text-[11px] font-black tracking-wider shadow-md">
                        {discountPercent}% OFF
                      </div>

                      {/* Wishlist Button */}
                      <button
                        onClick={() => toggleWishlist(product.id)}
                        className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition shadow-md cursor-pointer ${
                          isWishlisted ? 'bg-rose-50 text-rose-600' : 'bg-white/80 text-slate-600 hover:text-rose-600'
                        }`}
                      >
                        <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-600' : ''}`} />
                      </button>

                      {/* Rating Chip */}
                      <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-[11px] font-bold text-white flex items-center gap-1 shadow-md">
                        <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                        <span>{product.rating}</span>
                      </div>
                    </div>

                    {/* Content Details */}
                    <div className="p-5 space-y-2">
                      <p className="text-[11px] font-bold text-blue-600 uppercase tracking-widest">{product.category}</p>
                      <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition leading-snug">
                        {product.name}
                      </h3>
                      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                        {product.description}
                      </p>
                    </div>
                  </div>

                  {/* Pricing & Add Action */}
                  <div className="p-5 pt-0 border-t border-slate-100 mt-3 pt-4 flex items-center justify-between">
                    <div>
                      <span className="text-lg font-black text-slate-900 font-mono">
                        ₹{product.price.toLocaleString('en-IN')}
                      </span>
                      <span className="text-xs text-slate-400 line-through ml-2 font-mono">
                        ₹{product.originalPrice.toLocaleString('en-IN')}
                      </span>
                    </div>

                    <button
                      onClick={() => addToCart(product)}
                      className="px-4 py-2.5 text-xs font-bold rounded-2xl bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-600/20 transition flex items-center space-x-1.5 cursor-pointer"
                    >
                      <span>Add to Bag</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Cart & Merchant AI Growth Engine Sidebar (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          
          <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-6 shadow-md sticky top-24">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="font-extrabold text-slate-900 flex items-center gap-2 text-sm">
                <ShoppingBag className="w-4 h-4 text-blue-600" />
                <span>My Shopping Bag ({cart.reduce((a, b) => a + b.quantity, 0)})</span>
              </h3>
              {cart.length > 0 && (
                <button 
                  onClick={() => setCart([])}
                  className="text-xs text-slate-400 hover:text-rose-600 transition cursor-pointer"
                >
                  Clear Bag
                </button>
              )}
            </div>

            {/* Cart Items List */}
            {cart.length === 0 ? (
              <div className="py-10 text-center space-y-2">
                <ShoppingBag className="w-10 h-10 text-slate-300 mx-auto" />
                <p className="text-xs text-slate-600 font-bold">Your shopping bag is empty</p>
                <p className="text-[11px] text-slate-400">Add products above to test automated checkout.</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                {cart.map(item => (
                  <div key={item.id} className="flex items-center justify-between text-xs bg-slate-50 p-3 rounded-2xl border border-slate-200">
                    <div className="space-y-0.5">
                      <p className="font-bold text-slate-800">{item.name}</p>
                      <p className="text-slate-500 font-mono">Qty: {item.quantity} × ₹{item.price.toLocaleString('en-IN')}</p>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-slate-400 hover:text-rose-600 p-1 text-sm font-bold cursor-pointer"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* AI Growth Upsell Card */}
            {growthOffer && (
              <div className="rounded-2xl bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-200 p-4 space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-700 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                    <span>AI Bundle Offer</span>
                  </span>
                  <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                    +{growthOffer.discountPercent}% OFF
                  </span>
                </div>

                <div className="flex items-center space-x-3">
                  <img 
                    src={growthOffer.recommendation.image} 
                    alt={growthOffer.recommendation.name} 
                    className="w-12 h-12 object-cover rounded-xl border border-slate-200"
                  />
                  <div className="space-y-0.5">
                    <p className="font-bold text-slate-900 line-clamp-1">{growthOffer.recommendation.name}</p>
                    <p className="font-mono text-emerald-700 font-bold text-xs">
                      Add for ₹{growthOffer.discountedPrice.toLocaleString('en-IN')}{' '}
                      <span className="line-through text-slate-400 text-[10px]">₹{growthOffer.recommendation.price}</span>
                    </p>
                  </div>
                </div>

                {!growthOffer.accepted ? (
                  <button
                    onClick={() => setGrowthOffer({ ...growthOffer, accepted: true })}
                    className="w-full py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition shadow-sm cursor-pointer"
                  >
                    Accept Bundle Offer (+₹{growthOffer.discountedPrice.toLocaleString('en-IN')})
                  </button>
                ) : (
                  <div className="text-center text-xs font-semibold text-emerald-700 flex items-center justify-center gap-1 py-1.5 bg-emerald-50 rounded-xl border border-emerald-200">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>AI Bundle Upsell Added</span>
                  </div>
                )}
              </div>
            )}

            {/* Price Breakup & Checkout */}
            {cart.length > 0 && (
              <div className="space-y-3.5 pt-4 border-t border-slate-100">
                <div className="flex items-center justify-between text-xs text-slate-600">
                  <span>Bag Subtotal</span>
                  <span className="text-slate-900 font-mono">₹{cartTotal.toLocaleString('en-IN')}</span>
                </div>
                {growthOffer && growthOffer.accepted && (
                  <div className="flex items-center justify-between text-xs text-indigo-600">
                    <span>AI Bundle Add-on</span>
                    <span className="font-mono">+₹{growthOffer.discountedPrice.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex items-center justify-between text-xs text-emerald-600">
                  <span>Standard Delivery</span>
                  <span className="font-bold">FREE</span>
                </div>
                <div className="flex items-center justify-between text-base font-extrabold pt-2 border-t border-slate-100">
                  <span className="text-slate-900">Total Amount</span>
                  <span className="text-blue-700 font-mono text-xl">
                    ₹{(cartTotal + (growthOffer && growthOffer.accepted ? growthOffer.discountedPrice : 0)).toLocaleString('en-IN')}
                  </span>
                </div>

                <button
                  onClick={handleCheckout}
                  disabled={isProcessingCheckout}
                  className="w-full py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-600/20 transition flex items-center justify-center space-x-2 border border-blue-500/30 cursor-pointer disabled:opacity-50"
                >
                  {isProcessingCheckout ? (
                    <span>Creating Order...</span>
                  ) : (
                    <>
                      <span>Pay via Razorpay</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Verified Payment Notification */}
            {paymentSuccess && (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 space-y-1 text-xs shadow-md">
                <div className="flex items-center gap-1.5 font-bold text-emerald-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Razorpay Payment Verified!</span>
                </div>
                <p className="text-[11px] text-slate-600 font-mono">
                  Order ID: {paymentSuccess.orderId}<br/>
                  Payment ID: {paymentSuccess.paymentId}
                </p>
              </div>
            )}

          </div>

        </div>
      </div>
    </div>
  );
}
