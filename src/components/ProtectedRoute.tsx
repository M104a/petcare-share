import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import type { ReactElement } from "react";


export const ProtectedRoute = ({ children }: { children: ReactElement }) => {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    // 現在のセッションを取得
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });

    // セッション変更を監視（ログイン・ログアウト）
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  if (loading) return <p>読み込み中...</p>;

  if (!session) {
    // 未ログインならログインページに飛ばす
    return <Navigate to="/login" replace />;
  }

  return children;
};
