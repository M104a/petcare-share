import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import type { CareRecord } from "../types/types";
import { supabase } from "../lib/supabaseClient";
import { TrashIcon, PencilIcon, CheckIcon } from "@heroicons/react/24/solid";

export const Care = () => {
  const navigate = useNavigate();
  const [careRecords, setCareRecords] = useState<CareRecord[]>([]);
  const [newType, setNewType] = useState("");
  const [newDate, setNewDate] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [editType, setEditType] = useState("");
  const [editDate, setEditDate] = useState("");

  // 🔹 データ取得
  const fetchRecords = async () => {
    const { data, error } = await supabase
      .from("care_records")
      .select("*")
      .order("date", { ascending: false });
    if (error) console.error("取得エラー:", error.message);
    else setCareRecords(data);
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  // 🔹 登録
  const handleAdd = async () => {
    if (!newType || !newDate) return;
    const { error } = await supabase.from("care_records").insert([
      { type: newType, date: newDate },
    ]);
    if (error) alert("登録エラー:" + error.message);
    else {
      setNewType("");
      setNewDate("");
      setShowForm(false);
      fetchRecords();
    }
  };

  // 🔹 削除
  const handleDelete = async (id: number) => {
    const { error } = await supabase.from("care_records").delete().eq("id", id);
    if (error) alert("削除エラー:" + error.message);
    else fetchRecords();
  };

  // 🔹 編集開始
  const startEdit = (record: CareRecord) => {
    setEditId(record.id);
    setEditType(record.type);
    setEditDate(record.date);
  };

  // 🔹 更新
  const handleUpdate = async () => {
    if (!editId) return;
    const { error } = await supabase
      .from("care_records")
      .update({ type: editType, date: editDate })
      .eq("id", editId);
    if (error) alert("更新エラー:" + error.message);
    else {
      setEditId(null);
      fetchRecords();
    }
  };

  return (
    <main className="p-4 font-sans bg-gradient-to-b from-green-50 to-emerald-100 min-h-screen">
      <button
        onClick={() => navigate("/home")}
        className="mb-6 flex items-center gap-2 text-emerald-700 font-semibold text-lg hover:text-emerald-900 transition"
      >
        ← ホームに戻る
      </button>
      <h1 className="text-3xl font-bold text-black mb-6 text-center">
        ケア記録
      </h1>

      <ul className="space-y-3">
        {careRecords.map((record) => (
          <li
            key={record.id}
            className="flex justify-between items-center bg-white border border-emerald-200 rounded-xl p-4 shadow-sm hover:bg-emerald-50 transition"
          >
            {editId === record.id ? (
              <div className="flex flex-col gap-2 flex-1">
                <input
                  value={editType}
                  onChange={(e) => setEditType(e.target.value)}
                  className="border p-1 rounded"
                />
                <input
                  type="date"
                  value={editDate}
                  onChange={(e) => setEditDate(e.target.value)}
                  className="border p-1 rounded"
                />
                <button
                  onClick={handleUpdate}
                  className="flex items-center justify-center gap-1 bg-emerald-500 text-white rounded p-2 hover:bg-emerald-600"
                >
                  <CheckIcon className="h-5 w-5" /> 保存
                </button>
              </div>
            ) : (
              <>
                <div>
                  <p className="text-xl text-black font-bold">{record.type}</p>
                  <p className="text-lg text-emerald-700 font-bold">
                    {record.date}
                  </p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => startEdit(record)}
                    className="text-emerald-600 hover:text-emerald-800"
                  >
                    <PencilIcon className="h-6 w-6" />
                  </button>
                  <button
                    onClick={() => handleDelete(record.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <TrashIcon className="h-6 w-6" />
                  </button>
                </div>
              </>
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
        <div className="mt-5 bg-white border border-emerald-200 p-4 rounded-xl shadow-md space-y-3">
          <input
            type="text"
            placeholder="ケア内容（例：シャンプー）"
            value={newType}
            onChange={(e) => setNewType(e.target.value)}
            className="w-full p-2 border rounded-lg"
          />
          <input
            type="date"
            value={newDate}
            onChange={(e) => setNewDate(e.target.value)}
            className="w-full p-2 border rounded-lg"
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
