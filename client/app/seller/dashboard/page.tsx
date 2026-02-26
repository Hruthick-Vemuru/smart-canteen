"use client";

import { useEffect, useState } from "react";
import Container from "@/components/ui/Container";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { useSession } from "next-auth/react";
import {
  getOrders,
  updateOrderStatus,
  markPickedUp,
  type Order,
} from "@/services/order.service";
import {
  Package,
  Clock,
  CheckCircle,
  Smartphone,
  ChefHat,
  Monitor,
  Zap,
  Bell,
  ArrowUpRight,
  TrendingUp,
  Store
} from "lucide-react";

export default function SellerDashboardPage() {
  const { data: session } = useSession();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      if (!session?.user?.role) return;
      const data = await getOrders(session.user.role);
      setOrders(data);
    } catch (err) {
      console.error("Failed to fetch orders", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session?.user?.role) {
      fetchOrders();
      const interval = setInterval(fetchOrders, 4000);
      return () => clearInterval(interval);
    }
  }, [session]);

  const activeOrders = orders.filter((o) => o.status !== "PICKED_UP");
  const cookingOrders = activeOrders.filter(o => o.status === "PREPARING");
  const readyOrders = activeOrders.filter(o => o.status === "READY");
  const newOrders = activeOrders.filter(o => o.status === "PLACED");

  // Dynamic Calculations
  const successfulOrders = orders.filter(o => o.paymentStatus === "SUCCESS");
  const totalRevenue = successfulOrders.reduce((sum, o) => sum + o.totalAmount, 0);

  const pickedUpOrders = orders.filter(o => o.status === "PICKED_UP" && o.pickedUpAt);
  const avgPrepTime = pickedUpOrders.length > 0
    ? Math.round(pickedUpOrders.reduce((sum, o) => {
      const diff = new Date(o.pickedUpAt!).getTime() - new Date(o.createdAt).getTime();
      return sum + diff;
    }, 0) / pickedUpOrders.length / 60000)
    : 0;

  const uniqueUsers = Array.from(new Set(orders.map(o => o.userEmail)));
  const loyalUsers = uniqueUsers.filter(email => orders.filter(o => o.userEmail === email).length > 1);
  const loyaltyRate = uniqueUsers.length > 0 ? Math.round((loyalUsers.length / uniqueUsers.length) * 100) : 0;

  return (
    <div className="bg-[#F4F5F7] min-h-screen">
      <Container className="pb-32 pt-10">
        {/* DASHBOARD HEADER */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-[#FF3232] rounded-lg text-white shadow-lg shadow-[#FF3232]/20">
                <Store size={20} />
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#FF3232]">Command Center</span>
            </div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tighter">Canteen Dashboard</h1>
            <p className="text-gray-500 font-medium mt-1">Real-time order stream from hungry users</p>
          </div>

          <div className="grid grid-cols-3 gap-4 w-full lg:w-auto">
            <div className="bg-white p-4 py-3 rounded-[24px] shadow-sm border border-white flex flex-col items-center">
              <p className="text-[10px] font-black uppercase text-gray-400">Incoming</p>
              <p className="text-2xl font-black text-[#FF3232] leading-relaxed">{newOrders.length}</p>
            </div>
            <div className="bg-white p-4 py-3 rounded-[24px] shadow-sm border border-white flex flex-col items-center">
              <p className="text-[10px] font-black uppercase text-gray-400">Cooking</p>
              <p className="text-2xl font-black text-amber-500 leading-relaxed">{cookingOrders.length}</p>
            </div>
            <div className="bg-white p-4 py-3 rounded-[24px] shadow-sm border border-white flex flex-col items-center">
              <p className="text-[10px] font-black uppercase text-gray-400">Ready</p>
              <p className="text-2xl font-black text-emerald-500 leading-relaxed">{readyOrders.length}</p>
            </div>
          </div>
        </div>

        {/* ANALYTICS PREVIEW */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <Card className="p-6 rounded-[28px] border-none bg-gray-900 text-white shadow-xl shadow-gray-200">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-white/10 rounded-xl"><TrendingUp size={20} className="text-[#FF3232]" /></div>
              <ArrowUpRight size={18} className="text-white/40" />
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest text-white/50">Total Revenue</p>
            <p className="text-2xl font-black tracking-tighter">₹{totalRevenue}</p>
          </Card>
          <Card className="p-6 rounded-[28px] border-none bg-white shadow-sm flex items-center justify-between group">
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Avg. Time</p>
              <p className="text-2xl font-black tracking-tighter text-gray-900">{avgPrepTime || "--"} Mins</p>
            </div>
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl group-hover:scale-110 transition-transform"><Clock size={24} /></div>
          </Card>
          <Card className="p-6 rounded-[28px] border-none bg-white shadow-sm flex items-center justify-between group">
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Loyalty</p>
              <p className="text-2xl font-black tracking-tighter text-gray-900">{loyaltyRate}%</p>
            </div>
            <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl group-hover:scale-110 transition-transform"><Zap size={24} /></div>
          </Card>
          <Card className="p-6 rounded-[28px] border-none bg-white shadow-sm flex items-center justify-between group">
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Alerts</p>
              <p className="text-2xl font-black tracking-tighter text-gray-900">{newOrders.length}</p>
            </div>
            <div className="p-3 bg-red-50 text-red-600 rounded-2xl group-hover:rotate-12 transition-transform relative">
              <Bell size={24} />
              {newOrders.length > 0 && <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-ping" />}
            </div>
          </Card>
        </div>

        {loading ? (
          <div className="grid gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-40 bg-white rounded-[32px] animate-pulse border border-gray-100" />
            ))}
          </div>
        ) : activeOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 bg-white rounded-[40px] border-dashed border-4 border-gray-100 animate-fade-in">
            <Monitor size={80} className="text-gray-100 mb-6" />
            <h3 className="text-2xl font-black text-gray-300">System Monitoring Active</h3>
            <p className="text-gray-400 font-bold uppercase tracking-widest text-xs mt-2">Waiting for new orders...</p>
          </div>
        ) : (
          <div className="grid gap-8">
            {activeOrders.map((order) => (
              <Card key={order._id} className={`p-0 overflow-hidden border-2 transition-all duration-500 rounded-[32px] shadow-sm ${order.status === "READY" ? "border-emerald-100 bg-emerald-50/10 shadow-emerald-100" :
                order.status === "PREPARING" ? "border-amber-100 bg-amber-50/10 shadow-amber-100" :
                  "border-gray-50 bg-white"
                }`}>
                {/* CARD HEADER */}
                <div className="p-8 pb-6 border-b border-gray-50 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                  <div className="flex items-center gap-5">
                    <div className="w-16 h-16 bg-gray-50 rounded-[24px] flex items-center justify-center text-gray-400 border border-gray-100">
                      <Smartphone size={28} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">ID #{order.orderNumber}</p>
                        <span className="w-1 h-1 bg-gray-300 rounded-full" />
                        <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full ${order.paymentStatus === 'SUCCESS' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                          {order.paymentStatus}
                        </span>
                      </div>
                      <h4 className="text-xl font-black text-gray-900 tracking-tight">{order.userEmail.split('@')[0]}</h4>
                    </div>
                  </div>

                  <div className="flex items-center gap-8 w-full md:w-auto justify-between md:justify-end">
                    <div className="text-right">
                      <p className="text-2xl font-black text-[#FF3232] tracking-tighter leading-none">₹{order.totalAmount}</p>
                      <p className="text-[10px] font-black text-gray-400 mt-1 uppercase tracking-widest">{new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                    </div>
                    <div className="h-10 w-px bg-gray-100 hidden md:block" />
                    <div className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest ${order.status === 'READY' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-100' :
                      order.status === 'PREPARING' ? 'bg-amber-500 text-white shadow-lg shadow-amber-100' :
                        'bg-gray-100 text-gray-600'
                      }`}>
                      {order.status}
                    </div>
                  </div>
                </div>

                {/* ITEMS LIST */}
                <div className="p-8 grid gap-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex justify-between items-center bg-gray-50/50 p-4 rounded-2xl border border-gray-100 group hover:border-[#FF3232]/30 transition-colors">
                        <div className="flex items-center gap-3">
                          <span className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-xs font-black text-[#FF3232] shadow-sm">{item.qty}x</span>
                          <p className="text-sm font-bold text-gray-700">{item.name}</p>
                        </div>
                        <p className="text-[10px] font-black text-gray-400">₹{item.price * item.qty}</p>
                      </div>
                    ))}
                  </div>

                  {/* ACTION FOOTER */}
                  <div className="flex gap-4 mt-6">
                    {order.status === "PLACED" && (
                      <button
                        onClick={() => updateOrderStatus(order._id, "PREPARING", session?.user?.role).then(fetchOrders)}
                        className="flex-1 h-16 bg-[#FF3232] hover:bg-[#E61E1E] text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all shadow-xl shadow-[#FF3232]/20 active:scale-95"
                      >
                        <ChefHat size={20} /> Accept & Start
                      </button>
                    )}

                    {order.status === "PREPARING" && (
                      <button
                        onClick={() => updateOrderStatus(order._id, "READY", session?.user?.role).then(fetchOrders)}
                        className="flex-1 h-16 bg-amber-500 hover:bg-amber-600 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all shadow-xl shadow-amber-100 active:scale-95"
                      >
                        <Bell size={20} className="animate-bounce" /> Mark as Ready
                      </button>
                    )}

                    {order.status === "READY" && (
                      <button
                        onClick={() => updateOrderStatus(order._id, "PICKED_UP", session?.user?.role).then(fetchOrders)}
                        className="flex-1 h-16 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all shadow-xl shadow-emerald-100 active:scale-95"
                      >
                        <CheckCircle size={20} /> Mark Handed Over
                      </button>
                    )}

                    <button className="w-16 h-16 bg-white border border-gray-100 rounded-2xl flex items-center justify-center hover:bg-gray-50 transition-all shadow-sm text-gray-400">
                      <Package size={24} />
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </Container>
    </div>
  );
}
