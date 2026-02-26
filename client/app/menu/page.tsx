"use client";

import { useEffect, useState, useMemo } from "react";
import { getMenu, type MenuItem, type Category } from "@/services/menu.service";
import { useCart } from "@/context/cart.context";
import Container from "@/components/ui/Container";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { Search, Info, Flame, Heart, Star, Plus, Minus, ShoppingCart } from "lucide-react";

const CATEGORY_DISPLAY: Record<Category, string> = {
  BREAKFAST: "Quick Bites ☕",
  RICE_NOODLES: "Rice & Bowls 🍜",
  STARTERS: "Hot Starters 🥟",
  CURRIES: "Main Course 🍛",
  SPECIALS: "Today's Specials ✨",
};

export default function MenuPage() {
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const { cart, addToCart, decreaseQty } = useCart();
  const [activeCategory, setActiveCategory] = useState<Category | "ALL">("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    getMenu().then(setMenu);
  }, []);

  const filteredMenu = useMemo(() => {
    return menu.filter(item =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [menu, searchQuery]);

  const groupedMenu = useMemo(() => {
    const groups: Partial<Record<Category, MenuItem[]>> = {};
    filteredMenu.forEach((item) => {
      if (!groups[item.category]) groups[item.category] = [];
      groups[item.category]!.push(item);
    });
    return groups;
  }, [filteredMenu]);

  const qty = (id: string) => cart.find((i) => i.id === id)?.qty || 0;

  return (
    <div className="bg-[#FCFCFC] min-h-screen">
      {/* Hero Banner Simulation */}
      <div className="bg-[#FF3232] text-white py-12 px-6 overflow-hidden relative">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between relative z-10">
          <div className="text-center md:text-left space-y-4">
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-white">
              Deliciousness <br /><span className="opacity-80">delivered fast.</span>
            </h1>
            <p className="text-white/80 font-medium max-w-md">
              Explore the finest collection of meals, snacks, and drinks at your canteen.
            </p>
          </div>
          <div className="hidden md:block relative animate-scale-in">
            <div className="bg-white/10 backdrop-blur-xl p-8 rounded-[40px] border border-white/20">
              <Flame size={80} className="text-white fill-white" />
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -mr-48 -mt-48 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full -ml-32 -mb-32 blur-3xl" />
      </div>

      {/* Search & Filter Bar */}
      <div className="sticky top-[80px] bg-white/80 backdrop-blur-md z-30 border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row gap-4 items-center">
          <div className="flex-1 w-full bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3 flex items-center gap-3">
            <Search size={20} className="text-gray-400" />
            <input
              type="text"
              placeholder="Wanna eat something specific? Search here..."
              className="bg-transparent border-none p-0 focus:ring-0 text-gray-700 w-full font-medium"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex gap-2 overflow-x-auto no-scrollbar w-full md:w-auto pb-1 md:pb-0">
            <button
              onClick={() => setActiveCategory("ALL")}
              className={`px-6 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all duration-200 ${activeCategory === "ALL"
                ? "bg-[#FF3232] text-white shadow-lg shadow-[#FF3232]/20"
                : "bg-white border border-gray-200 text-gray-600 hover:border-[#FF3232]/30"
                }`}
            >
              Filters
            </button>
            {(Object.keys(CATEGORY_DISPLAY) as Category[]).map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-6 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all duration-200 ${activeCategory === cat
                  ? "bg-[#FF3232] text-white shadow-lg shadow-[#FF3232]/20"
                  : "bg-white border border-gray-200 text-gray-600 hover:border-[#FF3232]/30"
                  }`}
              >
                {CATEGORY_DISPLAY[cat]}
              </button>
            ))}
          </div>
        </div>
      </div>

      <Container className="pt-10 pb-32">
        {Object.entries(groupedMenu).length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 mb-6">
              <Search size={40} />
            </div>
            <h3 className="text-xl font-black">No matches found</h3>
            <p className="text-gray-500 mt-2">Try searching for something else or explore all menu.</p>
            <Button variant="secondary" className="mt-6" onClick={() => setSearchQuery("")}>Clear Search</Button>
          </div>
        ) : Object.entries(groupedMenu).map(([category, items]) => {
          if (activeCategory !== "ALL" && activeCategory !== category) return null;
          if (!items || items.length === 0) return null;

          return (
            <div key={category} className="mb-16 animate-fade-in" id={category}>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-black text-gray-900 tracking-tighter">
                  {CATEGORY_DISPLAY[category as Category]}
                  <span className="block w-12 h-1 bg-[#FF3232] rounded-full mt-2" />
                </h2>
                <span className="text-xs font-black text-gray-400 uppercase tracking-widest bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">
                  {items.length} Options
                </span>
              </div>

              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {items.map((item) => (
                  <div key={item._id} className={`group relative bg-white rounded-[32px] overflow-hidden border border-gray-100 shadow-[0_10px_40px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_60px_rgba(0,0,0,0.08)] transition-all duration-500 hover:-translate-y-2 ${!item.available ? "grayscale pointer-events-none" : ""}`}>
                    {/* IMAGE SECTION */}
                    <div className="w-full h-56 relative overflow-hidden bg-gray-100 italic">
                      <div className="absolute top-4 left-4 z-20 flex gap-2">
                        <span className={`w-3 h-3 rounded-sm border-2 ${item.isVeg ? "bg-green-500 border-green-200" : "bg-red-500 border-red-200"}`} />
                        {item.isSpecial && (
                          <span className="bg-amber-100 text-amber-700 text-[10px] px-2 py-0.5 rounded-full font-black uppercase tracking-wider flex items-center gap-1 border border-amber-200 shadow-sm">
                            <Star size={10} fill="currentColor" /> Best Seller
                          </span>
                        )}
                      </div>
                      <button className="absolute top-4 right-4 z-20 p-2.5 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-[#FF3232] transition-colors shadow-lg">
                        <Heart size={18} fill={item.isSpecial ? "currentColor" : "none"} />
                      </button>

                      {item.imageUrl ? (
                        <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                          <Search size={64} className="opacity-10" />
                        </div>
                      )}

                      {!item.available && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-10">
                          <span className="bg-white text-black px-6 py-2 rounded-full font-black text-xs uppercase tracking-[0.2em] shadow-2xl">Out of Stock</span>
                        </div>
                      )}

                      <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>

                    {/* CONTENT SECTION */}
                    <div className="p-6 pb-8">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-xl font-black text-gray-900 leading-tight group-hover:text-[#FF3232] transition-colors">{item.name}</h3>
                        <div className="flex items-center bg-green-50 text-green-700 px-2 py-1 rounded-lg text-xs font-black border border-green-100">
                          {item.rating || 4.5} <Star size={10} fill="currentColor" className="ml-1" />
                        </div>
                      </div>
                      <p className="text-sm text-gray-500 mb-6 line-clamp-2 leading-relaxed font-medium">{item.description || "Indulge in this chef-special dish crafted with fresh ingredients and authentic spices."}</p>

                      <div className="flex items-center justify-between border-t border-gray-50 pt-6">
                        <span className="text-2xl font-black text-gray-900 tracking-tighter">
                          ₹{item.price}
                        </span>

                        {item.available && (
                          <div className="relative">
                            {qty(item._id) === 0 ? (
                              <button
                                onClick={() => addToCart({ id: item._id, name: item.name, price: item.price })}
                                className="px-8 py-3 bg-[#FF3232] text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg shadow-[#FF3232]/20 hover:bg-[#E61E1E] transition-all flex items-center gap-2 group/btn active:scale-95"
                              >
                                <Plus size={16} /> Add to Bag
                              </button>
                            ) : (
                              <div className="flex items-center gap-4 bg-gray-900 rounded-2xl px-3 py-2.5 text-white shadow-2xl animate-scale-in">
                                <button
                                  onClick={() => decreaseQty(item._id)}
                                  className="w-8 h-8 flex items-center justify-center hover:bg-white/10 rounded-xl transition-colors"
                                >
                                  <Minus size={18} />
                                </button>
                                <span className="font-black text-sm min-w-[20px] text-center">{qty(item._id)}</span>
                                <button
                                  onClick={() => addToCart({ id: item._id, name: item.name, price: item.price })}
                                  className="w-8 h-8 flex items-center justify-center hover:bg-white/10 rounded-xl transition-colors text-[#FF3232]"
                                >
                                  <Plus size={18} />
                                </button>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </Container>

      {/* Floating Cart for Mobile */}
      {cart.length > 0 && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-[90%] md:w-auto z-40 animate-slide-up">
          <button
            onClick={() => window.location.href = '/cart'}
            className="w-full md:min-w-[400px] h-16 bg-gray-900 text-white rounded-[24px] px-6 flex items-center justify-between shadow-2xl border border-white/10 ring-8 ring-white/30"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-[#FF3232] rounded-xl flex items-center justify-center">
                <ShoppingCart size={20} />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase leading-none">{cart.length} Items Selected</p>
                <p className="text-lg font-black tracking-tight leading-relaxed">View Bag</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-[10px] font-black text-[#FF3232] uppercase leading-none">Total</p>
                <p className="text-xl font-black tracking-tighter">₹{cart.reduce((sum, item) => sum + item.price * item.qty, 0)}</p>
              </div>
            </div>
          </button>
        </div>
      )}
    </div>
  );
}
