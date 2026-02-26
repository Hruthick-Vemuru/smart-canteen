export default function Badge({
  text,
  status,
}: {
  text: string;
  status?: "PLACED" | "PREPARING" | "READY" | "COMPLETED";
}) {
  const styles: Record<string, string> = {
    PLACED: "bg-gray-200 text-gray-800",
    PREPARING: "bg-amber-100 text-amber-800",
    READY: "bg-emerald-100 text-emerald-800",
    COMPLETED: "bg-indigo-100 text-indigo-800",
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-semibold ${
        status ? styles[status] : "bg-gray-100"
      }`}
    >
      {text}
    </span>
  );
}
