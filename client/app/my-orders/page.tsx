"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import Container from "@/components/ui/Container";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import PaymentModal from "@/components/payment/PaymentModal";
import { getMyOrders } from "@/services/order.service";
import { createPayment, verifyPayment } from "@/services/payment.service";
import {
  Package,
  ChevronRight,
  Clock,
  CreditCard,
  MapPin,
  RefreshCw,
  CheckCircle2,
  XSquare,
  UtensilsCrossed,
  ArrowRight
} from "lucide-react";

const getStatusConfig = (status: string) => {
  switch (status) {
    case "CREATED":
      return { color: "text-sky-600 bg-sky-50 shadow-sky-100", label: "Just In" };
    case "PAYMENT_PENDING":
      return { color: "text-amber-600 bg-amber-50 shadow-amber-100", label: "Awaiting Cash" };
    case "PLACED":
      return { color: "text-indigo-600 bg-indigo-50 shadow-indigo-100", label: "Confirmed" };
    case "PREPARING":
      return { color: "text-orange-600 bg-orange-50 shadow-orange-100", label: "Chef Cooking" };
    case "READY":
      return { color: "text-emerald-600 bg-emerald-50 shadow-emerald-100 animate-pulse", label: "Ready to Pick!" };
    case "PICKED_UP":
      return { color: "text-gray-400 bg-gray-50 border-gray-200", label: "Served & Enjoyed" };
    case "PAYMENT_FAILED":
      return { color: "text-rose-600 bg-rose-50 shadow-rose-100", label: "Payment Failed" };
    default:
      return { color: "text-gray-400 bg-gray-50", label: status };
  }
};

export default function MyOrdersPage() {
  const { data: session, status } = useSession();
  const [orders, setOrders] = useState<any[]>([]);
  const [showPayment, setShowPayment] = useState(false);
  const [pendingOrder, setPendingOrder] = useState<any>(null);

  const fetchOrders = () => {
    if (session?.user?.email) {
      getMyOrders(session.user.email).then(setOrders);
    }
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 10000);
    return () => clearInterval(interval);
  }, [session]);

  const handleRetry = async (order: any) => {
    try {
      setPendingOrder(order);
      setShowPayment(true);
    } catch {
      alert("Failed to initiate retry");
    }
  };

  const handlePaymentSuccess = async (paymentId: string) => {
    try {
      await verifyPayment(pendingOrder._id, paymentId, "SUCCESS");
      setShowPayment(false);
      fetchOrders();
    } catch {
      alert("Verification failed. Please contact support.");
    }
  };

  const handlePaymentFailure = async () => {
    if (pendingOrder) {
      await verifyPayment(pendingOrder._id, "", "FAILED");
    }
    setShowPayment(false);
    fetchOrders();
  };

  if (status === "loading") return null;

  if (!session) {
    return (
      <Container className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <XSquare size={64} className="text-gray-200 mb-6" />
        <h2 className="text-2xl font-black">Hold on!</h2>
        <p className="text-gray-500 mt-2 mb-8">You need to be logged in to track your cravings.</p>
        <Link href="/login"><Button className="rounded-2xl px-10">Sign in now</Button></Link>
      </Container>
    );
  }

  return (
    <div className="bg-[#FAFAFA] min-h-screen">
      <Container className="pt-12 pb-32">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div>
            <h1 className="text-4xl font-black tracking-tighter text-gray-900 mb-2">My Food History</h1>
            <p className="text-gray-500 font-medium">Tracking your orders in real-time</p>
          </div>
          <div className="flex bg-white p-1 rounded-2xl border border-gray-100 shadow-sm">
            <button className="px-6 py-2 bg-[#FF3232] text-white rounded-xl text-xs font-black uppercase tracking-widest">Active</button>
            <button className="px-6 py-2 text-gray-400 hover:text-gray-600 rounded-xl text-xs font-black uppercase tracking-widest">Past Orders</button>
          </div>
        </div>

        {orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in bg-white rounded-[40px] border border-gray-100 shadow-sm">
            <UtensilsCrossed size={80} className="text-gray-100 mb-8" />
            <h3 className="text-xl font-black">No orders yet</h3>
            <p className="text-gray-500 mt-2 mb-10 max-w-xs px-6">Your stomach is calling! Place your first order to see it here.</p>
            <Link href="/menu">
              <Button className="rounded-2xl px-12 h-14 bg-[#FF3232] shadow-xl shadow-[#FF3232]/20">Browse Menu</Button>
            </Link>
          </div>
        ) : (
          <div className="grid gap-8">
            {orders.map((order) => {
              const config = getStatusConfig(order.status);
              return (
                <Card key={order._id} className="p-0 overflow-hidden group hover:scale-[1.01] transition-all duration-300 border-none shadow-[0_10px_40px_rgba(0,0,0,0.02)] bg-white rounded-[32px]">
                  <div className="p-8 pb-4 flex flex-col md:flex-row justify-between gap-6">
                    <div className="flex gap-6">
                      <div className={`w-20 h-20 rounded-[28px] flex items-center justify-center transition-colors ${config.color.includes('emerald') ? 'bg-emerald-100' : 'bg-gray-50'}`}>
                        <Package size={32} className={config.color.split(' ')[0]} />
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#FF3232]">Order ID #{order.orderNumber}</p>
                        <h3 className="text-2xl font-black text-gray-900 tracking-tighter">₹{order.totalAmount}</h3>
                        <div className="flex items-center gap-2 text-xs font-bold text-gray-400">
                          <Clock size={14} />
                          {new Date(order.createdAt).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col md:items-end justify-between gap-4">
                      <div className={`px-4 py-2 rounded-2xl text-[10px] uppercase font-black tracking-widest flex items-center gap-2 shadow-sm border ${config.color}`}>
                        {config.label}
                      </div>
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${order.paymentStatus === 'SUCCESS' ? 'bg-emerald-500' : 'bg-red-500'}`} />
                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Payment: <span className={order.paymentStatus === 'SUCCESS' ? 'text-emerald-600' : 'text-rose-600'}>{order.paymentStatus}</span></p>
                      </div>
                    </div>
                  </div>

                  {/* ITEM SUMMARY STRIP */}
                  <div className="px-8 py-4 bg-gray-50/50 flex flex-wrap gap-4 items-center">
                    {order.items.slice(0, 3).map((item: any, idx: number) => (
                      <span key={idx} className="text-xs font-bold text-gray-500 flex items-center gap-2">
                        <span className="w-1 h-1 bg-gray-300 rounded-full" /> {item.qty} × {item.name}
                      </span>
                    ))}
                    {order.items.length > 3 && (
                      <span className="text-[10px] font-black text-[#FF3232]">+{order.items.length - 3} MORE</span>
                    )}
                  </div>

                  <div className="p-8 pt-4 flex gap-4">
                    {order.paymentStatus !== "SUCCESS" && order.paymentStatus !== "FAILED" ? (
                      <Button
                        onClick={() => handleRetry(order)}
                        className="flex-1 h-14 bg-gray-900 border-none shadow-xl shadow-gray-200 text-xs font-black uppercase tracking-widest rounded-2xl"
                      >
                        Complete Payment
                      </Button>
                    ) : order.paymentStatus === "FAILED" ? (
                      <Button
                        onClick={() => handleRetry(order)}
                        className="flex-1 h-14 bg-[#FF3232] border-none shadow-xl shadow-[#FF3232]/20 text-xs font-black uppercase tracking-widest rounded-2xl"
                      >
                        Retry Payment
                      </Button>
                    ) : (
                      <Link href={`/orders/${order._id}`} className="flex-1">
                        <Button variant="secondary" className="w-full h-14 border-gray-100 shadow-sm text-xs font-black uppercase tracking-widest rounded-2xl hover:bg-gray-50 flex items-center justify-center gap-2">
                          Live Tracking <ArrowRight size={16} />
                        </Button>
                      </Link>
                    )}

                    <button className="w-14 h-14 bg-white border border-gray-100 flex items-center justify-center rounded-2xl hover:bg-gray-50 transition-colors shadow-sm">
                      <RefreshCw size={20} className="text-gray-400" />
                    </button>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </Container>

      {showPayment && pendingOrder && (
        <PaymentModal
          orderId={pendingOrder._id}
          amount={pendingOrder.totalAmount}
          onSuccess={handlePaymentSuccess}
          onFailure={handlePaymentFailure}
          onClose={() => setShowPayment(false)}
        />
      )}
    </div>
  );
}
