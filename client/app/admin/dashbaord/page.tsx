"use client";

import Container from "@/components/ui/Container";
import { LayoutDashboard, BarChart3, Settings, Activity } from "lucide-react";

export default function AdminDashboardPage() {
    return (
        <div className="bg-[#F4F5F7] min-h-screen">
            <Container className="py-10">
                <div className="flex justify-between items-center mb-10">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-emerald-600 rounded-lg text-white shadow-lg shadow-emerald-600/20">
                                <LayoutDashboard size={20} />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-600">Overview</span>
                        </div>
                        <h1 className="text-4xl font-black text-gray-900 tracking-tighter">System Dashboard</h1>
                        <p className="text-gray-500 font-medium mt-1">Global canteen operations monitoring</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    {[
                        { label: "Active Users", value: "154", icon: Activity, color: "text-blue-600", bg: "bg-blue-50" },
                        { label: "System Load", value: "12%", icon: BarChart3, color: "text-emerald-600", bg: "bg-emerald-50" },
                        { label: "Alerts", value: "0", icon: Settings, color: "text-amber-600", bg: "bg-amber-50" }
                    ].map((item, idx) => (
                        <div key={idx} className="bg-white p-6 rounded-[28px] border border-gray-100 shadow-sm flex items-center justify-between">
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">{item.label}</p>
                                <p className="text-2xl font-black tracking-tighter text-gray-900">{item.value}</p>
                            </div>
                            <div className={`p-3 ${item.bg} ${item.color} rounded-2xl`}>
                                <item.icon size={24} />
                            </div>
                        </div>
                    ))}
                </div>

                <div className="bg-white rounded-[40px] border-dashed border-4 border-gray-100 py-32 flex flex-col items-center">
                    <BarChart3 size={80} className="text-gray-100 mb-6" />
                    <h3 className="text-2xl font-black text-gray-300">Analytics Pending</h3>
                    <p className="text-gray-400 font-bold uppercase tracking-widest text-xs mt-2">Connecting to data warehouse...</p>
                </div>
            </Container>
        </div>
    );
}
