"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Container from "@/components/ui/Container";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { getOrder } from "@/services/order.service";
import { Loader2, CheckCircle2, Circle, Clock } from "lucide-react";

export default function OrderDetailsPage() {
  const { id } = useParams();
  const [order, setOrder] = useState<any>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const data = await getOrder(id as string);
        setOrder(data);
      } catch (err) {
        console.error("Failed to fetch order", err);
      }
    };

    fetchOrder();
    const interval = setInterval(fetchOrder, 5000);
    return () => clearInterval(interval);
  }, [id]);

  if (!order) {
    return (
      <Container className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="animate-spin text-indigo-600 mb-4" size={40} />
        <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Tracking Order...</p>
      </Container>
    );
  }

  const steps = [
    { id: "PLACED", label: "Confirmed", icon: <CheckCircle2 size={18} /> },
    { id: "PREPARING", label: "Cooking", icon: <Clock size={18} /> },
    { id: "READY", label: "Ready to Pick Up", icon: <CheckCircle2 size={18} /> },
    { id: "PICKED_UP", label: "Collected", icon: <CheckCircle2 size={18} /> },
  ];

  const currentIdx = steps.findIndex((s) => s.id === order.status);

  return (
    <Container className="pb-20 pt-4">
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Receipt #{order.orderNumber}</p>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Order Status</h1>
        </div>
        <Badge text={order.status} status={order.status === "PICKED_UP" ? "COMPLETED" : order.status} />
      </div>

      {/* Progress Tracker */}
      <Card className="mb-8 p-6 shadow-sm border-indigo-50">
        <div className="relative flex justify-between">
          <div className="absolute top-4 left-0 w-full h-0.5 bg-gray-100 -z-10" />
          <div
            className="absolute top-4 left-0 h-0.5 bg-indigo-600 -z-10 transition-all duration-1000"
            style={{ width: `${(currentIdx / (steps.length - 1)) * 100}%` }}
          />

          {steps.map((step, idx) => {
            const isCompleted = idx <= currentIdx;
            const isCurrent = idx === currentIdx;

            return (
              <div key={step.id} className="flex flex-col items-center gap-2">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center border-2 transition-all ${isCurrent ? "bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-200" :
                    isCompleted ? "bg-indigo-600 border-indigo-600 text-white" :
                      "bg-white border-gray-200 text-gray-300"
                  }`}>
                  {isCompleted ? step.icon : <Circle size={10} fill="currentColor" />}
                </div>
                <span className={`text-[10px] font-black uppercase tracking-tighter ${isCurrent ? "text-indigo-600" :
                    isCompleted ? "text-gray-700" : "text-gray-300"
                  }`}>
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Message Area */}
      {order.status === "READY" && (
        <div className="mb-8 bg-emerald-600 text-white px-6 py-4 rounded-3xl shadow-lg animate-bounce shadow-emerald-200">
          <p className="font-black text-sm text-center">🔥 IT&apos;S READY! Head to the counter now!</p>
        </div>
      )}

      {/* Items Breakdown */}
      <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-3">Order Items</h2>
      <div className="space-y-3">
        {order.items.map((item: any, idx: number) => (
          <Card key={idx} className="flex justify-between items-center p-4 border-indigo-50 transition-all hover:scale-[1.01]">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 font-black text-xs">
                {item.qty}x
              </div>
              <p className="font-bold text-gray-800">{item.name}</p>
            </div>
            <p className="font-black text-gray-500 text-xs tracking-wider">₹{item.price * item.qty}</p>
          </Card>
        ))}
      </div>

      {/* Bill Footer */}
      <div className="mt-8 pt-6 border-t border-dashed border-gray-300">
        <div className="flex justify-between items-center mb-1">
          <p className="text-gray-400 font-bold text-xs uppercase">Total Bill</p>
          <p className="text-2xl font-black text-gray-900 tracking-tighter">₹{order.totalAmount}</p>
        </div>
        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest text-center mt-10 opacity-50">Thank you for ordering at Smart Canteen!</p>
      </div>
    </Container>
  );
}
