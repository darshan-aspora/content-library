import { useState } from "react";
import { useAuth } from "../lib/auth";
import Logo from "../components/Logo";

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    setBusy(true);
    try {
      await login(email, password);
    } catch (e) {
      setErr(e.message);
      setBusy(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <form
        onSubmit={submit}
        className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-7 shadow-sm"
      >
        <Logo className="h-6" />
        <h1 className="mt-4 text-lg font-semibold text-slate-900">Sign in</h1>
        <p className="mb-5 text-[13px] text-slate-500">Access the Aspora content library.</p>

        <label className="mb-1 block text-[12px] font-medium text-slate-600">Email</label>
        <input
          type="email"
          autoFocus
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@aspora.com"
          className="mb-3 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/15"
        />

        <label className="mb-1 block text-[12px] font-medium text-slate-600">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/15"
        />

        {err && <p className="mt-3 text-sm text-red-500">{err}</p>}

        <button
          type="submit"
          disabled={busy}
          className="mt-5 w-full rounded-lg bg-brand py-2.5 text-sm font-semibold text-white transition hover:bg-brand/90 disabled:opacity-60"
        >
          {busy ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}
