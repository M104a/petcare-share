// src/pages/Login.tsx
import { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useNavigate } from "react-router-dom";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isLogin) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        alert("ログインエラー：" + error.message);
      } else if (data.session) {
        alert("ログイン成功！");
        navigate("/home");
      } else {
        alert("ログイン失敗：セッションが作成されませんでした。");
      }
    } else {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });
      if (error) {
        alert("登録エラー：" + error.message);
      } else {
        alert("登録成功！");
      }
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-amber-50 to-emerald-100">
      <h1 className="text-3xl font-bold mb-6 text-emerald-800">
        🐾 PetCare {isLogin ? "Login" : "Sign Up"}
      </h1>

      <form
        onSubmit={handleAuth}
        className="bg-white p-6 rounded-xl shadow-md w-80"
      >
        {/* メールアドレス */}
        <input
          type="email"
          placeholder="メールアドレス"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="placeholder-gray-500 text-black text-lg border border-gray-300 rounded-lg p-2 w-full mb-3"
          required
        />

        {/* パスワード + 表示/非表示アイコン */}
        <div className="relative mb-4">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="パスワード（6文字以上）"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="placeholder-gray-500 text-black text-lg border border-gray-300 rounded-lg p-2 w-full pr-10"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-2 top-2.5 text-gray-500"
          >
            {showPassword ? (
              <EyeIcon className="h-5 w-5" />
            ) : (
              <EyeSlashIcon className="h-5 w-5" />
            )}
          </button>
        </div>

        {/* ログイン/新規登録ボタン */}
        <button
          type="submit"
          className="w-full bg-emerald-500 hover:bg-emerald-600 text-white text-lg rounded-lg py-2 font-bold transition"
        >
          {isLogin ? "ログイン" : "新規登録"}
        </button>
      </form>

      <p
        className="text-base text-gray-600 mt-4 cursor-pointer hover:underline"
        onClick={() => setIsLogin(!isLogin)}
      >
        {isLogin ? "→ 新規登録はこちら" : "← ログイン画面に戻る"}
      </p>
    </main>
  );
};
