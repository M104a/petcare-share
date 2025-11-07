import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Login } from "./components/Login";
import { Signup } from "./components/Signup";
import { Home } from "./components/Home";
import { Care } from "./components/Care";
import { Food } from "./components/Food";
import { ProtectedRoute } from "./components/ProtectedRoute";


export const App = () => {
  return (
    <Router>
      <Routes>
        {/* 未ログインでも見れる */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* ログイン必須ページ */}
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/care"
          element={
            <ProtectedRoute>
              <Care />
            </ProtectedRoute>
          }
        />
        <Route
          path="/food"
          element={
            <ProtectedRoute>
              <Food />
            </ProtectedRoute>
          }
        />

        {/* デフォルトでログインページへ */}
        <Route path="*" element={<Login />} />
      </Routes>
    </Router>
  );
}