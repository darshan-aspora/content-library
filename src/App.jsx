import { Navigate, Routes, Route } from "react-router-dom";
import { useAuth } from "./lib/auth.jsx";
import LibraryPage from "./pages/LibraryPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import AdminApp from "./admin/AdminApp.jsx";

export default function App() {
  const { user, loading, isAdmin } = useAuth();

  if (loading)
    return <p className="py-20 text-center text-sm text-slate-400">Loading…</p>;

  if (!user) return <LoginPage />;

  return (
    <Routes>
      <Route path="/" element={<LibraryPage />} />
      <Route
        path="/admin/*"
        element={isAdmin ? <AdminApp /> : <Navigate to="/" replace />}
      />
    </Routes>
  );
}
