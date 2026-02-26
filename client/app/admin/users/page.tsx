"use client";

import Container from "@/components/ui/Container";
import { Users, UserPlus, Shield } from "lucide-react";

export default function UserManagementPage() {
    return (
        <div className="bg-[#F4F5F7] min-h-screen">
            <Container className="py-10">
                <div className="flex justify-between items-center mb-10">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-indigo-600 rounded-lg text-white shadow-lg shadow-indigo-600/20">
                                <Users size={20} />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-600">Admin Control</span>
                        </div>
                        <h1 className="text-4xl font-black text-gray-900 tracking-tighter">User Management</h1>
                        <p className="text-gray-500 font-medium mt-1">Manage system access and roles</p>
                    </div>

                    <button className="flex items-center gap-2 bg-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest text-gray-900 shadow-sm border border-gray-100 hover:bg-gray-50 transition-all">
                        <UserPlus size={18} />
                        Add User
                    </button>
                </div>

                <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm p-10 text-center flex flex-col items-center">
                    <Shield size={64} className="text-gray-100 mb-6" />
                    <h2 className="text-2xl font-black text-gray-300 tracking-tight">System Initialization</h2>
                    <p className="text-gray-400 font-bold uppercase tracking-widest text-xs mt-2 max-w-xs">
                        User directory is currently being synchronized with the authentication provider.
                    </p>
                </div>
            </Container>
        </div>
    );
}
