"use client";

import { signIn } from "next-auth/react";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { Package, Smartphone, ShieldCheck, Mail, ArrowRight } from "lucide-react";

export default function LoginPage() {
    return (
        <div className="min-h-screen bg-[#FBFBFB] flex items-center justify-center p-6 bg-[radial-gradient(#FF323211_1px,transparent_1px)] [background-size:20px_20px]">
            <Container className="max-w-md w-full animate-fade-in text-center">
                <div className="flex justify-center mb-10">
                    <div className="w-16 h-16 bg-[#FF3232] rounded-[24px] flex items-center justify-center text-white shadow-2xl shadow-[#FF3232]/30 animate-scale-in">
                        <Package size={32} />
                    </div>
                </div>

                <Card className="p-10 rounded-[40px] border-none shadow-[0_20px_60px_rgba(0,0,0,0.05)] bg-white relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-red-50 rounded-bl-[100px] -mr-8 -mt-8 transition-all group-hover:scale-110" />

                    <h1 className="text-4xl font-black tracking-tighter text-gray-900 mb-2">Welcome Back</h1>
                    <p className="text-gray-500 font-medium mb-12">Sign in to crave your favorite canteen meals</p>

                    <div className="space-y-4 mb-10">
                        <button
                            onClick={() => signIn("google", { callbackUrl: "/menu" })}
                            className="w-full flex items-center justify-between px-6 h-16 bg-white border-2 border-gray-100 rounded-2xl hover:border-[#FF3232]/30 hover:bg-gray-50 transition-all group/btn"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center group-hover/btn:bg-white">
                                    <Mail size={20} className="text-gray-400 group-hover/btn:text-[#FF3232]" />
                                </div>
                                <span className="font-black text-sm text-gray-700">Continue with Google</span>
                            </div>
                            <ArrowRight size={18} className="text-gray-300 group-hover/btn:text-[#FF3232] group-hover/btn:translate-x-1 transition-all" />
                        </button>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-10 border-t border-gray-50">
                        <div className="flex flex-col items-center gap-2">
                            <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                                <Smartphone size={18} />
                            </div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Order Mobile</p>
                        </div>
                        <div className="flex flex-col items-center gap-2">
                            <div className="w-10 h-10 bg-green-50 text-green-600 rounded-xl flex items-center justify-center">
                                <ShieldCheck size={18} />
                            </div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Secure Access</p>
                        </div>
                    </div>
                </Card>

                <p className="mt-10 text-xs text-gray-400 font-bold uppercase tracking-[0.2em] leading-relaxed">
                    Powered by <span className="text-gray-900">SmartCanteen</span> Engine
                </p>
            </Container>
        </div>
    );
}
