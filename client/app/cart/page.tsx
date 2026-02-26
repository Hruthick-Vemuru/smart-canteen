"use client";

import { useCart } from "@/context/cart.context";
import Container from "@/components/ui/Container";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { createOrder } from "@/services/order.service";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import PaymentModal from "@/components/payment/PaymentModal";
import { createPayment, verifyPayment } from "@/services/payment.service";
import { ShoppingBag, ChevronLeft, Trash2, Plus, Minus, CreditCard, ShieldCheck, MapPin, Info } from "lucide-react";
import Link from "next/link";

export default function CartPage() {
  const { cart, addToCart, decreaseQty, clearCart } = useCart();
  const { data: session } = useSession();
  const router = useRouter();

  const [showPayment, setShowPayment] = useState(false);
  const [pendingOrder, setPendingOrder] = useState<any>(null);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  const totalAmount = cart.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  const taxAmount = Math.round(totalAmount * 0.05); // 5% GST simulation
  const platformFee = totalAmount > 0 ? 5 : 0;
  const grandTotal = totalAmount + taxAmount + platformFee;

  const placeOrder = async () => {
    if (!session?.user?.email) {
      router.push("/login");
      return;
    }

    if (cart.length === 0) return;

    try {
      setIsPlacingOrder(true);
      const order = await createOrder(
        cart.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          qty: item.qty,
        })),
        grandTotal,
        session.user.email
      );

      // Create payment on backend
      await createPayment(order._id);

      setPendingOrder(order);
      setShowPayment(true);
    } catch {
      alert("Failed to place order");
    } finally {
      setIsPlacingOrder(false);
    }
  };

  const handlePaymentSuccess = async (paymentId: string) => {
    try {
      await verifyPayment(pendingOrder._id, paymentId, "SUCCESS");
      clearCart();
      router.push("/my-orders");
    } catch {
      alert("Verification failed. Please contact support.");
    }
  };

  const handlePaymentFailure = async () => {
    if (pendingOrder) {
      await verifyPayment(pendingOrder._id, "", "FAILED");
    }
    setShowPayment(false);
    router.push("/my-orders");
  };

  if (cart.length === 0 && !showPayment) {
    return (
      <Container className="flex flex-col items-center justify-center min-h-[70vh] animate-fade-in text-center">
        <div className="w-32 h-32 bg-red-50 rounded-full flex items-center justify-center text-[#FF3232] mb-8 relative">
          <ShoppingBag size={56} />
          <div className="absolute top-0 right-0 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg">
            <Plus size={16} className="text-[#FF3232]" />
          </div>
        </div>
        <h2 className="text-3xl font-black tracking-tight text-gray-900 mb-2">Your Bag is Empty</h2>
        <p className="text-gray-500 max-w-sm mb-10 font-medium">Looks like you haven&apos;t added any deliciousness to your bag yet.</p>
        <Link href="/menu">
          <Button className="px-10 py-4 bg-[#FF3232] text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-[#FF3232]/20 hover:-translate-y-1 transition-all">
            Explore Menu
          </Button>
        </Link>
      </Container>
    );
  }

  return (
    <div className="bg-[#F8F9FA] min-h-screen">
      <Container className="pt-10 pb-32">
        <div className="flex items-center gap-4 mb-10">
          <button onClick={() => router.back()} className="p-3 bg-white rounded-2xl shadow-sm border border-gray-100 hover:bg-gray-50 text-gray-600">
            <ChevronLeft size={24} />
          </button>
          <h1 className="text-3xl font-black tracking-tight text-gray-900">Your Checkout Bag</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* BAG ITEMS */}
          <div className="lg:col-span-7 space-y-6">
            <Card className="p-0 overflow-hidden border-none shadow-[0_10px_40px_rgba(0,0,0,0.03)] rounded-[32px] bg-white">
              <div className="p-6 border-b border-gray-50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <ShoppingBag className="text-[#FF3232]" size={20} />
                  <span className="font-black text-xs uppercase tracking-widest text-gray-400">Items Summary</span>
                </div>
                <button onClick={clearCart} className="text-[10px] font-black uppercase tracking-widest text-red-500 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors">Clear bag</button>
              </div>

              <div className="divide-y divide-gray-50">
                {cart.map((item) => (
                  <div key={item.id} className="p-6 flex items-center justify-between group">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-gray-50 rounded-2xl overflow-hidden italic text-[8px] flex items-center justify-center text-gray-300">
                        Food
                      </div>
                      <div>
                        <h3 className="font-black text-gray-900 group-hover:text-[#FF3232] transition-colors">{item.name}</h3>
                        <p className="text-xs font-bold text-gray-400">₹{item.price} per item</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="flex items-center bg-gray-50 rounded-2xl p-1.5 border border-gray-100">
                        <button
                          onClick={() => decreaseQty(item.id)}
                          className="p-1.5 hover:bg-white rounded-xl transition-all text-gray-500 hover:text-red-500"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="font-black text-sm w-8 text-center">{item.qty}</span>
                        <button
                          onClick={() => addToCart({ id: item.id, name: item.name, price: item.price })}
                          className="p-1.5 hover:bg-white rounded-xl transition-all text-gray-500 hover:text-green-500"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                      <p className="font-black text-gray-900 min-w-[60px] text-right tracking-tighter">₹{item.price * item.qty}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-6 bg-gray-50/50 flex items-center gap-4">
                <div className="p-3 bg-white rounded-2xl shadow-sm border border-gray-100 italic">
                  <Info size={18} className="text-[#FF3232]" />
                </div>
                <p className="text-xs font-medium text-gray-500">Need to add more? <Link href="/menu" className="text-[#FF3232] font-black underline underline-offset-4">Browse Menu</Link></p>
              </div>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="p-6 rounded-[32px] border-none shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center">
                  <MapPin size={24} />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase text-gray-400 leading-none">Canteen Counter</p>
                  <p className="font-black text-gray-900">Main Hall Floor 1</p>
                </div>
              </Card>
              <Card className="p-6 rounded-[32px] border-none shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
                  <ShieldCheck size={24} />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase text-gray-400 leading-none">Hygiene Protocol</p>
                  <p className="font-black text-gray-900">Safe & Handcrafted</p>
                </div>
              </Card>
            </div>
          </div>

          {/* BILLING SECTION */}
          <div className="lg:col-span-5">
            <Card className="p-8 rounded-[32px] border-none shadow-[0_20px_60px_rgba(255,50,50,0.06)] bg-white sticky top-32">
              <h2 className="text-xl font-black text-gray-900 mb-8 flex items-center gap-3">
                <CreditCard size={24} className="text-[#FF3232]" />
                Payment Summary
              </h2>

              <div className="space-y-4 mb-8">
                <div className="flex justify-between items-center">
                  <p className="text-sm font-bold text-gray-500">Subtotal</p>
                  <p className="font-black text-gray-900">₹{totalAmount}</p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-sm font-bold text-gray-500">Taxes (GST 5%)</p>
                  <p className="font-black text-gray-900">₹{taxAmount}</p>
                </div>
                <div className="flex justify-between items-center pb-6 border-b border-gray-100">
                  <p className="text-sm font-bold text-gray-500">Platform Fee</p>
                  <p className="font-black text-gray-900">₹{platformFee}</p>
                </div>
                <div className="flex justify-between items-center pt-2">
                  <div>
                    <p className="text-lg font-black text-gray-900 leading-none">₹{grandTotal}</p>
                    <p className="text-[10px] font-black uppercase text-[#FF3232] tracking-widest mt-1">Total to pay</p>
                  </div>
                  <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse shadow-lg shadow-emerald-200" title="Secure Payment Active" />
                </div>
              </div>

              <Button
                onClick={placeOrder}
                disabled={isPlacingOrder}
                className="w-full h-16 bg-gray-900 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-xs shadow-2xl transition-all active:scale-95 disabled:opacity-70 group"
              >
                {isPlacingOrder ? (
                  "Initiating Order..."
                ) : (
                  <span className="flex items-center justify-center gap-3">
                    Complete Order <CreditCard size={18} />
                  </span>
                )}
              </Button>

              <p className="text-[10px] text-center text-gray-400 mt-6 font-bold uppercase tracking-widest leading-relaxed">
                By clicking, you agree to our <br /> Terms of Service & Privacy Policy
              </p>
            </Card>
          </div>
        </div>
      </Container>

      {showPayment && pendingOrder && (
        <PaymentModal
          orderId={pendingOrder._id}
          amount={grandTotal}
          onSuccess={handlePaymentSuccess}
          onFailure={handlePaymentFailure}
          onClose={() => setShowPayment(false)}
        />
      )}
    </div>
  );
}
