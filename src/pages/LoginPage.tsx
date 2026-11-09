import { useState } from 'react';
import { Link, Navigate, useLocation } from 'react-router-dom';
import { Gift, ShieldCheck, Sparkles, Truck } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

function GoogleMark() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden>
      <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z" />
      <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z" />
      <path fill="#FBBC05" d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12.3 0 15s.7 5.3 1.9 7.7l3.7-2.9z" />
      <path fill="#34A853" d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.4-6.4-5.2L1.9 16c1.8 3.7 5.6 7 10.1 7z" />
    </svg>
  );
}

export default function LoginPage() {
  const { signInWithGoogle, session } = useAuth();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const from = (location.state as { from?: string } | null)?.from || '/profile';

  if (session) {
    return <Navigate to={from} replace />;
  }

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      setErrorMsg(null);
      await signInWithGoogle();
    } catch (error: any) {
      setErrorMsg(error?.message || 'Could not start Google sign-in. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-ivory">
      <div className="container-page py-10 sm:py-14">
        <div className="mx-auto grid max-w-5xl overflow-hidden rounded-[1.75rem] border border-subtle-border bg-white shadow-[0_20px_50px_rgba(57,38,51,0.08)] lg:grid-cols-2">
          <div className="relative hidden bg-[#4A0D15] p-9 text-white lg:flex lg:flex-col lg:justify-between">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[0.68rem] font-semibold text-[#F6DCCB]">
                <Gift size={14} /> Agrawal Gift Corner
              </span>
              <h2 className="mt-5 font-playfair text-3xl font-bold leading-tight text-white">Gifts that feel personal, from the first click.</h2>
              <p className="mt-3 text-sm leading-relaxed text-white/65">
                Sign in to save your favourite gifts, track orders, and make every celebration a little more thoughtful.
              </p>
            </div>
            <ul className="space-y-3 text-sm text-white/75">
              <li className="flex items-center gap-2.5"><Sparkles size={16} className="text-[#F6DCCB]" /> Personalized recommendations</li>
              <li className="flex items-center gap-2.5"><Truck size={16} className="text-[#F6DCCB]" /> Order tracking and updates</li>
              <li className="flex items-center gap-2.5"><ShieldCheck size={16} className="text-[#F6DCCB]" /> Secure Google sign-in</li>
            </ul>
          </div>

          <div className="p-6 sm:p-10">
            <div className="mx-auto max-w-sm">
              <span className="grid h-12 w-12 place-items-center rounded-xl bg-burgundy text-white lg:hidden"><Gift size={22} /></span>
              <p className="eyebrow mt-5 lg:mt-0">Welcome back</p>
              <h1 className="mt-1 font-playfair text-3xl font-bold text-ink">Sign in to your account</h1>
              <p className="mt-2 text-sm leading-relaxed text-secondary-text">Use your Google account to continue. No passwords to remember.</p>

              {errorMsg && (
                <div className="mt-5 rounded-lg border border-red-200 bg-red-50 p-3 text-xs leading-relaxed text-red-800" role="alert">
                  {errorMsg}
                </div>
              )}

              <button
                type="button"
                onClick={() => void handleGoogleSignIn()}
                disabled={loading}
                className="mt-6 flex w-full items-center justify-center gap-3 rounded-lg border border-subtle-border bg-white px-5 py-3 text-sm font-semibold text-ink shadow-sm transition-colors hover:bg-[#FBF8F5] disabled:opacity-60"
              >
                <GoogleMark />
                {loading ? 'Connecting…' : 'Continue with Google'}
              </button>

              <p className="mt-6 text-center text-[0.7rem] leading-relaxed text-secondary-text">
                By continuing, you agree to our <Link to="/terms" className="font-semibold text-burgundy hover:underline">Terms</Link> and <Link to="/privacy" className="font-semibold text-burgundy hover:underline">Privacy Policy</Link>.
              </p>

              <p className="mt-5 text-center text-xs text-secondary-text">
                Just browsing? <Link to="/products" className="font-semibold text-burgundy hover:underline">Explore the collection</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
