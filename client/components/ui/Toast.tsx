"use client";

import { useEffect } from "react";
import { CheckCircle, XCircle } from "lucide-react";

type ToastProps = {
  message: string;
  type?: "success" | "error";
  onClose: () => void;
};

export default function Toast({
  message,
  type = "success",
  onClose,
}: ToastProps) {
  useEffect(() => {
    const t = setTimeout(onClose, 2500);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
      <div
        className={`flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg text-white animate-slide-up
        ${
          type === "success"
            ? "bg-emerald-600"
            : "bg-rose-600"
        }`}
      >
        {type === "success" ? (
          <CheckCircle size={18} />
        ) : (
          <XCircle size={18} />
        )}
        <span className="text-sm font-medium">
          {message}
        </span>
      </div>
    </div>
  );
}
