import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useAuthStore } from '../hooks/useAuth';

export default function AuthCallbackPage() {
  const session = useAuthStore((state) => state.session);
  const navigate = useNavigate();

  useEffect(() => {
    if (session) {
      navigate('/profile', { replace: true });
      return;
    }
    const timer = window.setTimeout(() => {
      if (useAuthStore.getState().session) navigate('/profile', { replace: true });
    }, 2500);
    return () => window.clearTimeout(timer);
  }, [session, navigate]);

  return (
    <div className="container-page py-20 text-center">
      <Loader2 size={28} className="mx-auto animate-spin text-burgundy" />
      <h1 className="mt-4 font-playfair text-2xl font-bold text-ink">Completing sign in…</h1>
      <p className="mt-2 text-sm text-secondary-text">Please wait while we connect your Google account.</p>
      <Link to="/login" className="btn-secondary mt-5 text-xs">Back to sign in</Link>
    </div>
  );
}
