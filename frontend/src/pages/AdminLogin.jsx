import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth";
import { formatApiError } from "@/lib/api";

export default function AdminLogin() {
  const { login, user } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate("/admin", { replace: true });
  }, [user, navigate]);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email.trim().toLowerCase(), password);
      toast.success("Welcome back");
      navigate("/admin", { replace: true });
    } catch (err) {
      toast.error(formatApiError(err.response?.data?.detail) || "Invalid login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-cream" data-testid="admin-login-page">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center mb-6">
          <img src="/logo.png" alt="Castellon Septic Services" className="h-24 w-auto" />
        </div>

        <div className="border-2 border-navy bg-white p-8 shadow-[8px_8px_0_var(--amber)]">
          <div className="flex items-center gap-2 mb-6">
            <Lock className="w-4 h-4 text-navy" />
            <h1 className="font-display text-2xl tracking-wider text-navy">Sign In</h1>
          </div>
          <form onSubmit={submit} className="space-y-4" data-testid="admin-login-form">
            <div>
              <label className="block font-mono-tiny text-[11px] text-[var(--muted)] mb-2">EMAIL</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} data-testid="admin-email" autoComplete="email" required />
            </div>
            <div>
              <label className="block font-mono-tiny text-[11px] text-[var(--muted)] mb-2">PASSWORD</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} data-testid="admin-password" autoComplete="current-password" required />
            </div>
            <button type="submit" className="btn-amber w-full justify-center gap-2 disabled:opacity-50" disabled={loading} data-testid="admin-login-submit">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              Sign In
            </button>
          </form>
        </div>

        <div className="text-center mt-6">
          <a href="/" className="text-sm text-[var(--muted)] hover:text-navy" data-testid="admin-back-home">
            ← Back to website
          </a>
        </div>
      </div>
    </div>
  );
}
