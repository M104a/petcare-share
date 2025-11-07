import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

export const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      alert("登録に失敗しました：" + error.message);
    } else {
      alert("登録が完了しました！ログインしてください🌿");
      navigate("/login");
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-amber-50">
      <h1 className="text-2xl font-bold mb-6 text-amber-800">新規登録</h1>

      <form
        onSubmit={handleSignup}
        className="bg-white p-6 rounded-xl shadow-md w-80 space-y-4"
      >
        <div>
          <label className="block text-sm font-semibold mb-1 text-amber-700">
            名前
          </label>
          <input
            type="text"
            placeholder="まどか"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-amber-200 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1 text-amber-700">
            メールアドレス
          </label>
          <input
            type="email"
            placeholder="example@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-amber-200 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1 text-amber-700">
            パスワード
          </label>
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-amber-200 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-amber-500 hover:bg-amber-600 text-white py-2 rounded-lg transition"
        >
          登録する
        </button>
      </form>

      <p className="mt-4 text-sm text-amber-700">
        すでにアカウントをお持ちですか？{" "}
        <span
          onClick={() => navigate("/login")}
          className="text-amber-600 underline cursor-pointer"
        >
          ログイン
        </span>
      </p>
    </main>
  );
};
