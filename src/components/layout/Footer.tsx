import { useState } from "react";
import { Link } from "react-router-dom";
import { MapPin, Mail, Phone, Send, Check, Globe, MessageCircle, AlertCircle } from "lucide-react";
import { supabase } from "../../lib/supabase";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "saving" | "done" | "error">("idle");
  const [statusMsg, setStatusMsg] = useState("");

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed) return;
    setStatus("saving");
    setStatusMsg("");
    try {
      const { error } = await supabase
        .from("newsletter_subscriptions")
        .insert({ email: trimmed });
      if (error) throw error;
      setStatus("done");
      setStatusMsg("Subscribed! We will share curated gifting ideas.");
      setEmail("");
      setTimeout(() => {
        setStatus("idle");
        setStatusMsg("");
      }, 5000);
    } catch (err: any) {
      setStatus("error");
      // 23505 = duplicate email — treat as already subscribed, not a failure.
      setStatusMsg(
        err?.code === "23505"
          ? "This email is already subscribed."
          : "Could not subscribe right now. Please try again later."
      );
    }
  };

  return (
    <footer className="bg-plum text-ivory">
      {/* Main footer */}
      <div className="container mx-auto py-14 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-4 lg:gap-16">
          {/* Brand + Contact */}
          <div className="space-y-5 lg:col-span-1">
            <Link to="/" className="inline-block group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne-gold rounded-xl p-1">
              <div className="flex items-center gap-3 mb-1.5">
                <div className="w-10 h-10 rounded-xl bg-warm-white/10 border border-subtle-border/30 flex items-center justify-center shadow-sm">
                  <span className="font-playfair text-xl text-ivory font-bold leading-none">A</span>
                </div>
                <span className="font-playfair text-xl font-bold tracking-tight text-ivory leading-none">
                  Agrawal Gift <span className="italic font-normal text-champagne-gold">Corner</span>
                </span>
              </div>
              <span className="text-xs font-medium text-ivory/70 tracking-normal block">Curated Hampers & Personalized Gifts</span>
            </Link>
            <p className="text-sm text-ivory/80 leading-relaxed max-w-xs font-normal">
              Handcrafted presents crafted for birthdays, anniversaries, weddings, and festive celebrations.
            </p>
            <div className="space-y-3 text-sm text-ivory/90 pt-1">
              <div className="flex items-start gap-3">
                <MapPin size={18} className="mt-0.5 shrink-0 text-champagne-gold" />
                <span>Mathura, Uttar Pradesh</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail size={18} className="shrink-0 text-champagne-gold" />
                <a href="mailto:agrawalgiftcorner@gmail.com" className="hover:text-champagne-gold underline underline-offset-2 transition-colors">agrawalgiftcorner@gmail.com</a>
              </div>
              <div className="flex items-center gap-3">
                <Phone size={18} className="shrink-0 text-champagne-gold" />
                <a href="https://wa.me/917579951781" target="_blank" rel="noopener noreferrer" className="hover:text-champagne-gold underline underline-offset-2 transition-colors">+91 75799 51781</a>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-bold text-ivory mb-4">Shop Collections</h3>
            <ul className="space-y-2.5 text-sm text-ivory/80">
              {[
                { label: "All Products", href: "/products" },
                { label: "Gift Hampers", href: "/products?cat=Gift+Hampers" },
                { label: "Personalized Gifts", href: "/products?cat=Personalized+Gifts" },
                { label: "Birthday Gifts", href: "/products?cat=Birthday" },
                { label: "Anniversary Gifts", href: "/products?cat=Anniversary" },
                { label: "Wedding Gifts", href: "/products?cat=Wedding" },
              ].map((item) => (
                <li key={item.label}>
                  <Link to={item.href} className="hover:text-champagne-gold transition-colors inline-block">{item.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help / Policy */}
          <div>
            <h3 className="text-sm font-bold text-ivory mb-4">Customer Care</h3>
            <ul className="space-y-2.5 text-sm text-ivory/80">
              {[
                { label: "Shipping Policy", href: "/shipping" },
                { label: "Returns & Refund Policy", href: "/returns" },
                { label: "Cancellation Policy", href: "/cancellation" },
                { label: "Privacy Policy", href: "/privacy" },
                { label: "Terms of Service", href: "/terms" },
                { label: "Help & FAQ", href: "/help" },
                { label: "Contact Us", href: "/contact" },
              ].map((item) => (
                <li key={item.label}>
                  <Link to={item.href} className="hover:text-champagne-gold transition-colors inline-block">{item.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter + Social */}
          <div>
            <h3 className="text-sm font-bold text-ivory mb-4">Stay Connected</h3>
            <p className="text-sm text-ivory/80 mb-4 leading-relaxed">Subscribe for curated gifting inspiration, new arrivals, and festive updates.</p>
            <form onSubmit={handleSubscribe} className="flex gap-2 mb-6">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="min-w-0 flex-1 rounded-xl bg-warm-white/10 border border-subtle-border/30 px-4 py-2.5 text-sm text-ivory placeholder:text-ivory/50 focus:outline-none focus:ring-2 focus:ring-champagne-gold focus:border-champagne-gold transition-all"
              />
              <button
                type="submit"
                aria-label="Subscribe"
                disabled={status === "saving"}
                className="inline-flex shrink-0 items-center justify-center rounded-xl bg-champagne-gold px-4 py-2.5 text-sm font-bold text-plum hover:bg-[#d1b280] active:bg-champagne-gold transition shadow-sm disabled:opacity-60"
              >
                {status === "done" ? <Check size={18} /> : <Send size={18} />}
              </button>
            </form>
            {status === "saving" && <p className="text-xs text-ivory/70 mb-6">Subscribing…</p>}
            {status === "done" && <p className="text-xs text-champagne-gold mb-6 font-medium">{statusMsg}</p>}
            {status === "error" && (
              <p className="text-xs text-ivory mb-6 font-medium flex items-center gap-1.5">
                <AlertCircle size={14} className="shrink-0 text-champagne-gold" /> {statusMsg}
              </p>
            )}

            <h4 className="text-xs font-semibold text-ivory/80 uppercase tracking-wider mb-3">Connect With Us</h4>
            <div className="flex items-center gap-3">
              <a href="https://www.instagram.com/agrawal_gift_corner/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-warm-white/10 border border-subtle-border/30 text-ivory hover:text-champagne-gold hover:border-champagne-gold transition-colors" title="Instagram">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><circle cx="12" cy="12" r="5"/><circle cx="17.5" cy="6.5" r="1.5"/></svg>
              </a>
              <a href="https://wa.me/917579951781" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-warm-white/10 border border-subtle-border/30 text-ivory hover:text-champagne-gold hover:border-champagne-gold transition-colors" title="WhatsApp">
                <MessageCircle size={18} />
              </a>
              <a href="mailto:agrawalgiftcorner@gmail.com" aria-label="Email" className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-warm-white/10 border border-subtle-border/30 text-ivory hover:text-champagne-gold hover:border-champagne-gold transition-colors" title="Email">
                <Globe size={18} />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-subtle-border/20 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-ivory/70">
          <p>© 2026 Agrawal Gift Corner. Mathura, UP. All rights reserved.</p>
          <div className="flex gap-6">
            <Link to="/privacy" className="hover:text-ivory transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-ivory transition-colors">Terms of Service</Link>
            <Link to="/returns" className="hover:text-ivory transition-colors">Returns & Refunds</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}