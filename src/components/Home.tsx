// src/components/Home.tsx
import { supabase } from "../lib/supabaseClient";
import { useNavigate } from "react-router-dom";
import { useEffect,useState } from "react";
import type { Task } from "../types/types";
import image from "../assets/02.png";
import { Link } from "react-router-dom";

export const Home = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [userName, setUserName] = useState<string | null>(null);

  // ✅ ログイン中のユーザー情報を取得
  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        console.error("ユーザー取得エラー:", error.message);
      } else if (data?.user) {
        const email = data.user.email ?? "";
        const name = email.split("@")[0]; // メールの@より前をユーザー名に
        setUserName(name);
      }
    };
    fetchUser();
  }, []);

  // ✅ Supabaseからお世話リストを取得
  useEffect(() => {
    const fetchTasks = async () => {
      const { data, error } = await supabase.from("tasks").select("*");
      if (error) console.error("取得エラー:", error.message);
      else setTasks(data);
    };
    fetchTasks();
  }, []);

  // ✅ ログアウト処理
  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  // ✅ 完了チェック時にログイン中ユーザー名を記録
  const handleCheck = (id: number) => {
    const now = new Date();
    const formattedTime = now.toLocaleTimeString("ja-JP", {
      hour: "2-digit",
      minute: "2-digit",
    });

    setTasks((prev) =>
      prev.map((task) =>
        task.id === id
          ? {
              ...task,
              done: !task.done,
              lastdoneby: userName || "不明なユーザー",
              lastdoneat: formattedTime,
            }
          : task
      )
    );
  };

  return (
    <>
      <main className="p-4 font-sans bg-gradient-to-b from-green-50 to-emerald-100 min-h-screen">
        {/* ログアウトボタン */}
        <div className="flex justify-end">
          <button
            onClick={handleLogout}
            className="text-emerald-800 text-base font-bold hover:text-emerald-900 transition"
          >
            ログアウト
          </button>
        </div>

        {/* あいさつ文 */}
        <h2 className="text-center text-lg text-emerald-700 font-semibold mb-2">
          {userName ? `こんにちは、${userName} さん🌿` : "ログイン中..."}
        </h2>

        {/* タイトル */}
        <h1 className="flex items-center justify-center text-3xl font-bold text-black space-x-2 mb-6">
          今日のお世話リスト
          <img src={image} alt="PNG画像" className="w-24" />
        </h1>

        {/* タスクリスト */}
        <ul className="space-y-4">
          {tasks.map((task) => (
            <li
              key={task.id}
              className={`flex justify-between items-center p-4 rounded-xl border transition ${
                task.done
                  ? "bg-emerald-50 border-emerald-200"
                  : "bg-white hover:bg-emerald-50 border-gray-200"
              }`}
            >
              <div>
                <strong
                  className={`block text-xl ${
                    task.done ? "text-emerald-700" : "text-gray-800"
                  }`}
                >
                  {task.title}
                </strong>

                {task.done && (
                  <p className="text-sm text-gray-600 mt-1">
                    ✅ {task.lastdoneby}（{task.lastdoneat}）
                  </p>
                )}
              </div>

              <button
                onClick={() => handleCheck(task.id)}
                className={`px-4 py-2 rounded-lg font-bold text-base text-white transition ${
                  task.done
                    ? "bg-gray-400 hover:bg-gray-500"
                    : "bg-emerald-500 hover:bg-emerald-600"
                }`}
              >
                {task.done ? "取消" : "完了"}
              </button>
            </li>
          ))}
        </ul>

        {/* 下部ボタン */}
        <div className="grid grid-cols-2 gap-4 mt-7">
          <Link
            to="/care"
            className="px-4 py-2 rounded-lg text-black bg-yellow-400 text-lg font-bold text-center hover:bg-yellow-300 transition"
          >
            ケア記録
          </Link>
          <Link
            to="/food"
            className="px-4 py-2 rounded-lg text-black bg-yellow-400 text-lg font-bold text-center hover:bg-yellow-300 transition"
          >
            食品管理
          </Link>
        </div>
      </main>
    </>
  );
};
