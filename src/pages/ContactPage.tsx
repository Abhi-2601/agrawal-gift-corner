import { useState } from 'react';
import type { FormEvent } from 'react';
import { Clock, Mail, MapPin, MessageCircle, Send } from 'lucide-react';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [opened, setOpened] = useState(false);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const text = [
      `Hi Agrawal Gift Corner,`,
      ``,
      form.message,
      ``,
      `Name: ${form.name}`,
      form.phone ? `Phone: ${form.phone}` : '',
      form.email ? `Email: ${form.email}` : '',
    ].filter(Boolean).join('\n');
    window.open(`https://wa.me/917579951781?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer');
    setOpened(true);
  };

  return (
    <div className="bg-ivory">
      <div className="container-page py-9 sm:py-12">
        <div className="mx-auto max-w-5xl">
          <header className="max-w-2xl">
            <p className="eyebrow">We are here to help</p>
            <h1 className="mt-1">Let’s plan something thoughtful</h1>
            <p className="mt-3 text-sm leading-relaxed text-secondary-text">Questions about custom hampers, corporate gifting, or an existing order? Our family team in Mathura is happy to help.</p>
          </header>

          <div className="mt-6 grid gap-5 md:grid-cols-[0.9fr_1.1fr]">
            <section className="rounded-2xl border border-subtle-border bg-white p-6 shadow-[0_1px_2px_rgba(43,26,23,0.03)] sm:p-7">
              <h2 className="font-playfair text-xl font-bold text-ink">Talk to us</h2>
              <div className="mt-5 space-y-5 text-sm">
                <div className="flex items-start gap-3">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#FBEAEC] text-burgundy"><MapPin size={18} /></span>
                  <div><p className="font-semibold text-ink">Store location</p><p className="mt-0.5 text-xs text-secondary-text">Mathura, Uttar Pradesh, India</p></div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#FBEAEC] text-burgundy"><MessageCircle size={18} /></span>
                  <div><p className="font-semibold text-ink">WhatsApp support</p><a href="https://wa.me/917579951781" target="_blank" rel="noopener noreferrer" className="mt-0.5 block text-xs font-medium text-burgundy hover:underline">+91 75799 51781</a></div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#FBEAEC] text-burgundy"><Mail size={18} /></span>
                  <div><p className="font-semibold text-ink">Email</p><a href="mailto:agrawalgiftcorner@gmail.com" className="mt-0.5 block text-xs font-medium text-burgundy hover:underline">agrawalgiftcorner@gmail.com</a></div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#FBEAEC] text-burgundy"><Clock size={18} /></span>
                  <div><p className="font-semibold text-ink">Working hours</p><p className="mt-0.5 text-xs text-secondary-text">Mon–Sat, 10:00 AM – 8:00 PM IST</p></div>
                </div>
              </div>
              <a href="https://wa.me/917579951781" target="_blank" rel="noopener noreferrer" className="btn-primary mt-6 w-full text-xs"><MessageCircle size={15} /> Chat on WhatsApp</a>
            </section>

            <section className="rounded-2xl border border-subtle-border bg-white p-6 shadow-[0_1px_2px_rgba(43,26,23,0.03)] sm:p-7">
              <h2 className="font-playfair text-xl font-bold text-ink">Send an inquiry</h2>
              <p className="mt-1 text-xs leading-relaxed text-secondary-text">This form opens WhatsApp with your message so you can send it directly to our team.</p>

              {opened ? (
                <div className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 p-5 text-center">
                  <Send size={22} className="mx-auto text-emerald-700" />
                  <h3 className="mt-2 font-playfair text-lg font-bold text-ink">WhatsApp opened</h3>
                  <p className="mt-1 text-xs leading-relaxed text-secondary-text">Press send in WhatsApp to deliver your message. If it did not open, use the WhatsApp button on the left.</p>
                  <button type="button" onClick={() => setOpened(false)} className="btn-secondary mt-4 text-xs">Write another message</button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                  <div>
                    <label htmlFor="contact-name" className="label-base">Your name</label>
                    <input id="contact-name" required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} className="input-base" placeholder="Your name" />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="contact-email" className="label-base">Email</label>
                      <input id="contact-email" type="email" required value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} className="input-base" placeholder="you@example.com" />
                    </div>
                    <div>
                      <label htmlFor="contact-phone" className="label-base">Phone</label>
                      <input id="contact-phone" type="tel" value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} className="input-base" placeholder="+91 98765 43210" />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="contact-message" className="label-base">Message</label>
                    <textarea id="contact-message" required rows={4} value={form.message} onChange={(event) => setForm({ ...form, message: event.target.value })} className="input-base resize-none" placeholder="Tell us about the gift or personalization you have in mind…" />
                  </div>
                  <button type="submit" className="btn-primary w-full">Continue in WhatsApp <Send size={15} /></button>
                </form>
              )}
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
