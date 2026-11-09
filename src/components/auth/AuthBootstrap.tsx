import { useAuth } from '../../hooks/useAuth';

/** Initializes the Supabase auth listener once for the whole app. */
export default function AuthBootstrap() {
  useAuth();
  return null;
}
