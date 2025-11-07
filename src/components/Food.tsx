import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import type { FoodItem } from "../types/types";
import { supabase } from "../lib/supabaseClient";
import { TrashIcon, PencilIcon, CheckIcon } from "@heroicons/react/24/solid";

export const Food = () => {
  const navigate = useNavigate();
  const [foods, setFoods] = useState<FoodItem[]>([]);
  const [newName, setNewName] = useState("");
  const [newExpiry, setNewExpiry] = useState("");
  const [newStock, setNewStock] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [editStock, setEditStock] = useState<number>(0);

  const fetchFoods = async () => {
    const { data, error } = await supabase
      .from("foods")
      .select("*")
      .order("expiry", { ascending: true });
    if (error) console.error("取得エラー:", error.message);
    else setFoods(data);
  };

  useEffect(() => {
    fetchFoods();
  }, []);

  const handleAdd = async () => {
    if (!newName || !newExpiry || !newStock) return;
    const { error } = await supabase.from("foods").insert([
      {
        name: newName,
        expiry: newExpiry,
        stock: Number(newStock),
      },
    ]);
    if (error) alert("登録エラー:" + error.message);
    else {
      setNewName("");
      setNewExpiry("");
      setNewStock("");
      setShowForm(false);
      fetchFoods();
    }
  };

  const handleDelete = async (id: number) => {
    const { error } = await supabase.from("foods").delete().eq("id", id);
    if (error) alert("削除エラー:" + error.message);
    else fetchFoods();
  };

  const startEdit = (food: FoodItem) => {
    setEditId(food.id);
    setEditStock(food.stock);
  };

  const handleUpdate = async () => {
    if (!editId) return;
    const { error } = await supabase
      .from("foods")
      .update({ stock: editStock })
      .eq("id", editId);
    if (error) alert("更新エラー:" + error.message);
    else {
      setEditId(null);
      fetchFoods();
    }
  };

  const today = new Date();
  const isNearExpiry = (dateString: string) => {
    const expiry = new Date(dateString);
    const diffDays = (expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);
    return diffDays <= 7;
  };

  return (
    <main className="p-4 font-sans bg-gradient-to-b from-green-50 to-emerald-100 min-h-screen">
      <button
        onClick={() => navigate("/home")}
        className="mb-6 flex items-center gap-2 text-emerald-700 font-semibold text-lg hover:text-emerald-900 transition"
      >
        ← ホームに戻る
      </button>
      <h1 className="text-3xl font-bold text-black mb-6 text-center">食品管理</h1>

      <ul className="space-y-3">
        {foods.map((food) => (
          <li
            key={food.id}
            className={`flex justify-between items-center border text-xl rounded-xl p-4 shadow-sm transition ${
              isNearExpiry(food.expiry)
                ? "bg-red-50 border-red-200"
                : "bg-white border-emerald-200 hover:bg-emerald-50"
            }`}
          >
            <div>
              <p className="text-xl font-bold text-gray-800">{food.name}</p>
              <p
                className={`text-lg ${
                  isNearExpiry(food.expiry)
                    ? "text-red-600 font-bold"
                    : "text-emerald-700"
                }`}
              >
                賞味期限: {food.expiry}
              </p>
            </div>

            {editId === food.id ? (
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={editStock}
                  onChange={(e) => setEditStock(Number(e.target.value))}
                  className="w-20 border rounded p-1 text-center"
                />
                <button
                  onClick={handleUpdate}
                  className="bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-1 rounded flex items-center gap-1"
                >
                  <CheckIcon className="h-5 w-5" /> 保存
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <span className="text-gray-800 text-xl font-bold">
                  残り: {food.stock}個
                </span>
                <button
                  onClick={() => startEdit(food)}
                  className="text-emerald-600 hover:text-emerald-800"
                >
                  <PencilIcon className="h-6 w-6" />
                </button>
                <button
                  onClick={() => handleDelete(food.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  <TrashIcon className="h-6 w-6" />
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>

      {!showForm ? (
        <button
          onClick={() => setShowForm(true)}
          className="w-full mt-5 bg-emerald-500 text-white font-bold text-lg py-3 rounded-lg hover:bg-emerald-600 transition"
        >
          ＋ 新規追加
        </button>
      ) : (
        <div className="bg-white mt-5 border border-emerald-200 p-4 rounded-xl shadow-md space-y-3">
          <input
            type="text"
            placeholder="商品名（例：ドッグフード）"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="text-lg w-full p-2 border rounded-lg border-emerald-300"
          />
          <input
            type="date"
            value={newExpiry}
            onChange={(e) => setNewExpiry(e.target.value)}
            className="w-full p-2 border rounded-lg border-emerald-300"
          />
          <input
            type="number"
            placeholder="ストック数"
            value={newStock}
            onChange={(e) => setNewStock(e.target.value)}
            className="text-lg w-full p-2 border rounded-lg border-emerald-300"
          />
          <button
            onClick={handleAdd}
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg py-2 font-bold"
          >
            登録する
          </button>
        </div>
      )}
    </main>
  );
};
