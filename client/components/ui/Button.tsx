import { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "success" | "danger";

export default function Button({
  children,
  variant = "primary",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
}) {
  const base =
    "px-5 py-2 rounded-xl text-sm font-semibold transition-all duration-150 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary:
      "bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm",
    secondary:
      "bg-white border border-gray-300 text-gray-700 hover:bg-gray-100",
    success:
      "bg-emerald-600 text-white hover:bg-emerald-700",
    danger:
      "bg-rose-600 text-white hover:bg-rose-700",
  };

  return (
    <button
      {...props}
      className={`${base} ${variants[variant]}`}
    >
      {children}
    </button>
  );
}
