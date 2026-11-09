import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function LoginPage() {
  const { signInWithGoogle, session } = useAuth();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const navigate = useNavigate();

  if (session) {
    navigate("/profile");
  }

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      setErrorMsg(null);
      await signInWithGoogle();
    } catch (err: any) {
      setErrorMsg(err?.message || "Failed to initiate Google Sign-in. Please ensure Supabase Auth is configured.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-ivory min-h-[80vh] flex items-center justify-center py-16 px-4">
      <div className="bg-warm-white rounded-3xl border border-subtle-border shadow-2xl p-8 sm:p-12 max-w-md w-full text-center">
        <div className="w-14 h-14 rounded-full bg-plum text-cream flex items-center justify-center mx-auto mb-6 shadow-md shadow-plum/20">
          <span className="font-playfair text-2xl font-bold">A</span>
        </div>

        <h1 className="font-playfair text-3xl sm:text-4xl text-plum font-bold mb-2">Welcome Back</h1>
        <p className="text-secondary-text text-sm mb-8 leading-relaxed">
          Sign in to view your orders, saved addresses, and personal wishlist.
        </p>

        {errorMsg && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs text-left leading-relaxed">
            {errorMsg}
          </div>
        )}

        <button
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 bg-plum text-ivory hover:bg-plum/90 font-medium py-3.5 px-6 rounded-2xl shadow-lg shadow-plum/20 transition-all duration-200 disabled:opacity-50"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="#EA4335"
              d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z"
            />
            <path
              fill="#4285F4"
              d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"
            />
            <path
              fill="#FBBC05"
              d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12.3 0 15s.7 5.3 1.9 7.7l3.7-2.9z"
            />
            <path
              fill="#34A853"
              d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.4-6.4-5.2L1.9 16c1.8 3.7 5.6 7 10.1 7z"
            />
          </svg>
          <span>{loading ? "Connecting..." : "Continue with Google"}</span>
        </button>

        <p className="mt-8 text-xs text-secondary-text">
          By signing in, you agree to our{" "}
          <Link to="/terms" className="text-muted-rose hover:underline">Terms of Service</Link>{" "}
          and{" "}
          <Link to="/privacy" className="text-muted-rose hover:underline">Privacy Policy</Link>.
        </p>
      </div>
    </section>
  );
}
