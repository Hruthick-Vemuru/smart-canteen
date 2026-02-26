"use client";

import { useEffect, useState } from "react";
import Container from "@/components/ui/Container";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Toast from "@/components/ui/Toast";
import { useSession } from "next-auth/react";
import { ImagePlus, Trash2, Power } from "lucide-react";

import {
  getMenu,
  createMenuItem,
  toggleAvailability,
  deleteMenuItem,
  type Category,
  type MenuItem,
} from "@/services/menu.service";

const CATEGORIES: { value: Category; label: string }[] = [
  { value: "BREAKFAST", label: "Breakfast" },
  { value: "RICE_NOODLES", label: "Rice & Noodles" },
  { value: "STARTERS", label: "Starters" },
  { value: "CURRIES", label: "Curries / Meals" },
  { value: "SPECIALS", label: "Specials" },
];

export default function SellerMenuPage() {
  const { data: session } = useSession();
  const [menu, setMenu] = useState<MenuItem[]>([]);

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [category, setCategory] = useState<Category>("BREAKFAST");
  const [isVeg, setIsVeg] = useState(true);
  const [isSpecial, setIsSpecial] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const fetchMenu = async () => {
    try {
      const data = await getMenu();
      setMenu(data);
    } catch (err) {
      console.error("Failed to fetch menu", err);
    }
  };

  useEffect(() => {
    fetchMenu();
  }, []);

  const addItem = async () => {
    if (!name || !price) return;

    try {
      await createMenuItem(
        {
          name,
          price: Number(price),
          description,
          imageUrl,
          category,
          isVeg,
          isSpecial,
        },
        session?.user?.role
      );

      setToast({
        message: "Item added successfully",
        type: "success",
      });

      setName("");
      setPrice("");
      setDescription("");
      setImageUrl("");
      setCategory("BREAKFAST");
      setIsVeg(true);
      setIsSpecial(false);

      fetchMenu();
    } catch {
      setToast({
        message: "Failed to add item",
        type: "error",
      });
    }
  };

  const handleToggle = async (id: string) => {
    try {
      await toggleAvailability(id, session?.user?.role);
      fetchMenu();
    } catch (err) {
      setToast({ message: "Failed to update item", type: "error" });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this item?")) return;
    try {
      await deleteMenuItem(id, session?.user?.role);
      setToast({ message: "Item deleted", type: "success" });
      fetchMenu();
    } catch (err) {
      setToast({ message: "Failed to delete item", type: "error" });
    }
  };

  return (
    <Container className="pb-20">
      <h1 className="text-2xl font-semibold mb-6">Manage Menu</h1>

      {/* ADD ITEM */}
      <Card className="mb-10 p-6 shadow-sm border-indigo-50">
        <h2 className="text-lg font-semibold mb-4 text-indigo-700">Add New Item</h2>

        <div className="grid gap-4 sm:grid-cols-2">
          <input
            placeholder="Item name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
          />

          <input
            placeholder="Price (₹)"
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
          />

          <textarea
            placeholder="Short description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none sm:col-span-2"
          />

          {/* IMAGE PREVIEW */}
          <div className="sm:col-span-2 flex gap-4 items-center bg-gray-50 p-3 rounded-xl">
            <div className="w-20 h-20 rounded-xl border bg-white overflow-hidden flex items-center justify-center shadow-inner">
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt="Preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = "";
                  }}
                />
              ) : (
                <div className="flex flex-col items-center text-gray-400 text-[10px]">
                  <ImagePlus size={20} />
                  <span className="mt-1 font-medium">Image</span>
                </div>
              )}
            </div>

            <input
              placeholder="Paste Image URL here"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="flex-1 px-4 py-2 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none bg-white font-mono text-xs"
            />
          </div>

          {/* CATEGORY PILLS */}
          <div className="sm:col-span-2">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Category</p>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => setCategory(c.value)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition ${category === c.value
                      ? "bg-indigo-600 text-white border-indigo-600 shadow-md"
                      : "bg-white text-gray-600 border-gray-200 hover:border-indigo-300"
                    }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-between items-center sm:col-span-2 bg-gray-50 p-3 rounded-xl gap-4">
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setIsVeg(true)}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${isVeg ? "bg-green-600 text-white shadow-sm" : "bg-white text-gray-400 border border-gray-100"
                  }`}
              >
                <span className="w-2 h-2 rounded-full bg-current opacity-50"></span> Veg
              </button>
              <button
                type="button"
                onClick={() => setIsVeg(false)}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${!isVeg ? "bg-red-600 text-white shadow-sm" : "bg-white text-gray-400 border border-gray-100"
                  }`}
              >
                <span className="w-2 h-2 rounded-full bg-current opacity-50"></span> Non-Veg
              </button>
            </div>

            <label className="flex items-center gap-2 text-xs font-bold text-gray-600 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 rounded-md text-indigo-600" checked={isSpecial} onChange={() => setIsSpecial(!isSpecial)} />
              Special Item
            </label>
          </div>
        </div>

        <Button className="mt-6 w-full py-3 bg-indigo-600 hover:bg-indigo-700 rounded-xl font-bold shadow-lg shadow-indigo-200 transition-all active:scale-95" onClick={addItem}>
          Add Item to Menu
        </Button>
      </Card>

      {/* EXISTING MENU */}
      <div className="grid gap-3">
        <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">Current Menu List</h2>
        {menu.map((item) => (
          <Card key={item._id} className={`flex justify-between items-center p-3 transition-all ${!item.available ? "bg-gray-50 border-gray-200 border-dashed" : "border-indigo-50"}`}>
            <div className="flex items-center gap-4">
              <div className="relative">
                {item.imageUrl ? (
                  <img src={item.imageUrl} className="w-16 h-16 rounded-xl object-cover bg-gray-100 shadow-sm" alt={item.name} />
                ) : (
                  <div className="w-16 h-16 rounded-xl bg-gray-100 flex items-center justify-center text-gray-400">
                    <ImagePlus size={20} />
                  </div>
                )}
                <span className={`absolute -top-1 -left-1 w-3 h-3 rounded-full border-2 border-white ${item.isVeg ? "bg-green-500" : "bg-red-500"}`} />
              </div>

              <div>
                <p className={`font-bold transition-all ${!item.available ? "text-gray-400 line-through" : "text-gray-800"}`}>{item.name}</p>
                <p className="text-xs font-semibold text-indigo-500">
                  ₹{item.price} <span className="text-gray-300 mx-1">|</span> {item.category}
                </p>
                {!item.available && <span className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">Temporarily Inactive</span>}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleToggle(item._id)}
                className={`p-2.5 rounded-xl transition-all ${item.available ? "bg-emerald-50 text-emerald-600 hover:bg-emerald-100" : "bg-gray-100 text-gray-400 hover:bg-indigo-100 hover:text-indigo-600"
                  }`}
                title={item.available ? "Disable Item" : "Enable Item"}
              >
                <Power size={18} />
              </button>
              <button onClick={() => handleDelete(item._id)} className="p-2.5 rounded-xl bg-red-50 text-red-500 hover:bg-red-100 transition-all" title="Delete Forever">
                <Trash2 size={18} />
              </button>
            </div>
          </Card>
        ))}
      </div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </Container>
  );
}
