import { MapPin, Mail, Clock, MessageCircle, Send } from "lucide-react";
import { useState } from "react";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <section className="bg-ivory min-h-screen py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-[0.7rem] font-bold uppercase tracking-[0.2em] text-plum">We are here to help</span>
          <h1 className="font-playfair text-4xl sm:text-5xl text-plum mt-2 mb-4">Get in Touch</h1>
          <p className="text-plum/80 leading-relaxed font-poppins">
            Have questions about custom hampers, corporate gifting, or an ongoing order? Reach out to our family team in Mathura.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {/* Contact Details Card */}
          <div className="bg-warm-white rounded-3xl p-8 sm:p-10 shadow-xl border border-subtle-border space-y-8">
            <h2 className="font-playfair text-2xl text-plum">Direct Contact Details</h2>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-soft-blush flex items-center justify-center text-plum shrink-0">
                  <MapPin size={22} className="text-plum" />
                </div>
                <div>
                  <h3 className="font-playfair text-lg text-plum font-bold">Store Location</h3>
                  <p className="text-secondary-text text-sm mt-0.5">Mathura, Uttar Pradesh, India</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-soft-blush flex items-center justify-center text-plum shrink-0">
                  <MessageCircle size={22} className="text-plum" />
                </div>
                <div>
                  <h3 className="font-playfair text-lg text-plum font-bold">WhatsApp Direct Support</h3>
                  <a href="https://wa.me/917579951781" target="_blank" rel="noopener noreferrer" className="text-muted-rose hover:text-plum text-sm font-medium transition-colors mt-0.5 block">
                    +91 75799 51781 (Click to chat)
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-soft-blush flex items-center justify-center text-plum shrink-0">
                  <Mail size={22} className="text-plum" />
                </div>
                <div>
                  <h3 className="font-playfair text-lg text-plum font-bold">Official Email</h3>
                  <a href="mailto:agrawalgiftcorner@gmail.com" className="text-muted-rose hover:text-plum text-sm font-medium transition-colors mt-0.5 block">
                    agrawalgiftcorner@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-soft-blush flex items-center justify-center text-plum shrink-0">
                  <Clock size={22} className="text-plum" />
                </div>
                <div>
                  <h3 className="font-playfair text-lg text-plum font-bold">Working Hours</h3>
                  <p className="text-secondary-text text-sm mt-0.5">Mon – Sat: 10:00 AM – 8:00 PM IST</p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-subtle-border">
              <a
                href="https://wa.me/917579951781"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 bg-[#25D366] text-white font-medium py-3.5 px-6 rounded-2xl shadow-md hover:bg-[#1EBE5D] transition-colors"
              >
                <MessageCircle size={18} /> Chat with us on WhatsApp
              </a>
            </div>
          </div>

          {/* Contact Message Form */}
          <div className="bg-warm-white rounded-3xl p-8 sm:p-10 shadow-xl border border-subtle-border">
            <h2 className="font-playfair text-2xl text-plum mb-6">Send an Inquiry</h2>

            {sent ? (
              <div className="p-6 rounded-2xl bg-soft-blush/80 border border-subtle-border text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-plum text-ivory flex items-center justify-center mx-auto">
                  <Send size={20} />
                </div>
                <h3 className="font-playfair text-xl text-plum font-bold">Thank You for Reaching Out!</h3>
                <p className="text-plum/80 text-sm">
                  We have received your message and will respond to you promptly. For urgent assistance, message us on WhatsApp (+91 75799 51781).
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-plum/70 mb-1">Your Name</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Abhishek Agrawal"
                    className="w-full rounded-xl border border-subtle-border px-4 py-3 bg-ivory text-plum placeholder:text-secondary-text/50 focus:outline-none focus:ring-2 focus:ring-champagne-gold font-poppins text-sm"
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-plum/70 mb-1">Email</label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="you@example.com"
                      className="w-full rounded-xl border border-subtle-border px-4 py-3 bg-ivory text-plum placeholder:text-secondary-text/50 focus:outline-none focus:ring-2 focus:ring-champagne-gold font-poppins text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-plum/70 mb-1">Phone Number</label>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      placeholder="+91 98765 43210"
                      className="w-full rounded-xl border border-subtle-border px-4 py-3 bg-ivory text-plum placeholder:text-secondary-text/50 focus:outline-none focus:ring-2 focus:ring-champagne-gold font-poppins text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-plum/70 mb-1">Message</label>
                  <textarea
                    required
                    rows={4}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Tell us about the gift or customization you are looking for..."
                    className="w-full rounded-xl border border-subtle-border px-4 py-3 bg-ivory text-plum placeholder:text-secondary-text/50 focus:outline-none focus:ring-2 focus:ring-champagne-gold font-poppins text-sm resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 rounded-xl bg-plum text-ivory font-bold hover:bg-plum/90 transition-colors shadow-lg shadow-plum/20"
                >
                  Send Message
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
