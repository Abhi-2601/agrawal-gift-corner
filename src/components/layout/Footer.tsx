import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link } from 'react-router-dom';
import {
  AlertCircle,
  Check,
  Gift,
  Camera,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Send,
} from 'lucide-react';
import { supabase } from '../../lib/supabase';

const shopLinks = [
  { label: 'All gifts', href: '/products' },
  { label: 'Gift hampers', href: '/products?cat=Gift+Hampers' },
  { label: 'Personalized gifts', href: '/products?cat=Personalized+Gifts' },
  { label: 'Birthday gifts', href: '/products?cat=Birthday' },
  { label: 'Anniversary gifts', href: '/products?cat=Anniversary' },
  { label: 'Corporate gifting', href: '/products?cat=Corporate' },
];

const careLinks = [
  { label: 'Track your order', href: '/track-order' },
  { label: 'Wishlist', href: '/wishlist' },
  { label: 'Shipping policy', href: '/shipping' },
  { label: 'Returns & refunds', href: '/returns' },
  { label: 'Cancellation policy', href: '/cancellation' },
  { label: 'Help & FAQ', href: '/help' },
];

export default function Footer() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'saving' | 'done' | 'error'>('idle');
  const [statusMsg, setStatusMsg] = useState('');

  const handleSubscribe = async (event: FormEvent) => {
    event.preventDefault();
    const trimmed = email.trim();
    if (!trimmed) return;
    setStatus('saving');
    setStatusMsg('');
    try {
      const { error } = await supabase.from('newsletter_subscriptions').insert({ email: trimmed });
      if (error) throw error;
      setStatus('done');
      setStatusMsg('You are on the list. Watch your inbox for gifting inspiration.');
      setEmail('');
      window.setTimeout(() => {
        setStatus('idle');
        setStatusMsg('');
      }, 6000);
    } catch (error: any) {
      setStatus('error');
      setStatusMsg(
        error?.code === '23505'
          ? 'This email is already subscribed.'
          : 'Could not subscribe right now. Please try again later.'
      );
    }
  };

  return (
    <footer className="bg-[#4A0D15] text-[#FBF3EC]">
      <div className="container-page py-12 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr_0.8fr_1.2fr] lg:gap-12">
          <div>
            <Link to="/" className="inline-flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-white/10 ring-1 ring-white/15">
                <Gift size={22} className="text-[#F6DCCB]" />
              </span>
              <span className="leading-none">
                <span className="font-brand text-lg font-semibold tracking-[0.14em]">AGRAWAL</span>
                <span className="mt-1 block font-brand text-[0.55rem] tracking-[0.28em] text-[#F6DCCB]">GIFT CORNER</span>
              </span>
            </Link>
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-white/70">
              Thoughtful, handcrafted gifts and personalized hampers for life’s most meaningful moments. Made with care in Mathura.
            </p>
            <div className="mt-6 space-y-3 text-sm text-white/75">
              <p className="flex items-start gap-3"><MapPin size={17} className="mt-0.5 shrink-0 text-[#E9BFAE]" /> Mathura, Uttar Pradesh, India</p>
              <a href="mailto:agrawalgiftcorner@gmail.com" className="flex items-center gap-3 transition-colors hover:text-white"><Mail size={17} className="shrink-0 text-[#E9BFAE]" /> agrawalgiftcorner@gmail.com</a>
              <a href="https://wa.me/917579951781" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 transition-colors hover:text-white"><Phone size={17} className="shrink-0 text-[#E9BFAE]" /> +91 75799 51781</a>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-[0.18em] text-[#E9BFAE]">Shop</h3>
            <ul className="mt-4 space-y-2.5 text-sm text-white/70">
              {shopLinks.map((link) => (
                <li key={link.label}><Link to={link.href} className="transition-colors hover:text-white">{link.label}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-[0.18em] text-[#E9BFAE]">Customer care</h3>
            <ul className="mt-4 space-y-2.5 text-sm text-white/70">
              {careLinks.map((link) => (
                <li key={link.label}><Link to={link.href} className="transition-colors hover:text-white">{link.label}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-[0.18em] text-[#E9BFAE]">Stay in the loop</h3>
            <p className="mt-4 text-sm leading-relaxed text-white/70">
              New collections, festive edits, and thoughtful gifting ideas — delivered occasionally.
            </p>
            <form onSubmit={handleSubscribe} className="mt-4 flex gap-2">
              <input
                type="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Your email address"
                className="min-w-0 flex-1 rounded-lg border border-white/15 bg-white/10 px-3.5 py-2.5 text-sm text-white placeholder:text-white/40 focus:border-[#E9BFAE] focus:outline-none focus:ring-2 focus:ring-[#E9BFAE]/20"
              />
              <button type="submit" disabled={status === 'saving'} aria-label="Subscribe" className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-[#F6DCCB] text-[#4A0D15] transition-colors hover:bg-white disabled:opacity-60">
                {status === 'done' ? <Check size={17} /> : <Send size={17} />}
              </button>
            </form>
            {statusMsg && (
              <p className={`mt-2 flex items-start gap-1.5 text-xs leading-relaxed ${status === 'error' ? 'text-[#FFD4D4]' : 'text-[#F6DCCB]'}`}>
                {status === 'error' && <AlertCircle size={13} className="mt-0.5 shrink-0" />}
                {statusMsg}
              </p>
            )}

            <div className="mt-6 flex items-center gap-2.5">
              <a href="https://www.instagram.com/agrawal_gift_corner/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="grid h-9 w-9 place-items-center rounded-lg border border-white/15 text-white/75 transition-colors hover:border-[#E9BFAE] hover:text-white">
                <Camera size={16} />
              </a>
              <a href="https://wa.me/917579951781" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="grid h-9 w-9 place-items-center rounded-lg border border-white/15 text-white/75 transition-colors hover:border-[#E9BFAE] hover:text-white">
                <MessageCircle size={16} />
              </a>
              <a href="mailto:agrawalgiftcorner@gmail.com" aria-label="Email" className="grid h-9 w-9 place-items-center rounded-lg border border-white/15 text-white/75 transition-colors hover:border-[#E9BFAE] hover:text-white">
                <Mail size={16} />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 text-xs text-white/50 sm:flex-row">
          <p>© {new Date().getFullYear()} Agrawal Gift Corner. All rights reserved.</p>
          <div className="flex flex-wrap justify-center gap-5">
            <Link to="/privacy" className="hover:text-white">Privacy</Link>
            <Link to="/terms" className="hover:text-white">Terms</Link>
            <Link to="/returns" className="hover:text-white">Returns</Link>
            <Link to="/contact" className="hover:text-white">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
