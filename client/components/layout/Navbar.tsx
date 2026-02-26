"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import { Search, ShoppingCart, User, LogOut, Package } from "lucide-react";

export default function Navbar() {
  const { data: session, status } = useSession();
  const pathname = usePathname();

  if (status === "loading") return null;

  const isUser = session?.user?.role === "USER";
  const isSeller = session?.user?.role === "SELLER";

  const linkStyle = (path: string) =>
    `flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all duration-200 ${pathname === path
      ? "bg-[#FF3232] text-white shadow-lg shadow-[#FF3232]/20"
      : "text-gray-600 hover:bg-gray-100"
    }`;

  return (
    <nav className="sticky top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 px-6 py-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2">
          <Package size={22} />
          <span className="text-xl font-black text-gray-900 tracking-tighter">
            Smart<span className="text-[#FF3232]">Canteen</span>
          </span>
        </Link>

        <div className="flex items-center gap-2">
          {/* USER NAVIGATION */}
          {isUser && (
            <>
              <Link href="/menu" className={linkStyle("/menu")}>
                Menu
              </Link>

              <Link href="/my-orders" className={linkStyle("/my-orders")}>
                My Orders
              </Link>

              <Link href="/cart" className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-xl transition-all">
                <ShoppingCart size={22} />
                <span className="absolute top-0 right-0 w-4 h-4 bg-[#FF3232] text-white text-[10px] flex items-center justify-center rounded-full font-bold">1</span>
              </Link>
            </>
          )}

          {/* SELLER NAVIGATION */}
          {isSeller && (
            <>
              <Link href="/seller/dashboard" className={linkStyle("/seller/dashboard")}>
                Dashboard
              </Link>
              <Link href="/seller/menu" className={linkStyle("/seller/menu")}>
                Manage
              </Link>
            </>
          )}

          <div className="h-6 w-px bg-gray-200 mx-2" />

          {/* LOGIN / PROFILE */}
          {!session ? (
            <Link href="/login" className="bg-[#FF3232] text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-[#E61E1E] transition-all shadow-lg shadow-[#FF3232]/10">
              Login
            </Link>
          ) : (
            <div className="flex items-center gap-3">
              <button className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-all border border-gray-200">
                <User size={20} />
              </button>
              <button
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="p-2.5 text-gray-400 hover:text-[#FF3232] transition-all rounded-xl hover:bg-red-50"
                title="Logout"
              >
                <LogOut size={20} />
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
