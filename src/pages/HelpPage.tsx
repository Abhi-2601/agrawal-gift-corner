import { Link } from 'react-router-dom';
import { ChevronDown, HelpCircle, MessageCircle } from 'lucide-react';

const FAQS = [
  {
    q: 'How does payment work?',
    a: 'All orders are prepaid only. We do not offer cash on delivery. After you submit an order request, our team contacts you on WhatsApp to verify the details and share secure payment instructions.',
  },
  {
    q: 'How long does delivery take?',
    a: 'Orders typically arrive within 7–15 days after confirmation. Handcrafted and personalized gifts need dedicated preparation time before dispatch.',
  },
  {
    q: 'Can I personalize a gift?',
    a: 'Yes. Every customizable product has a personalization field for names, dates, and short messages up to 500 characters. Your notes are preserved through checkout and onto the order.',
  },
  {
    q: 'Can I cancel an order?',
    a: 'You may request cancellation within 24 hours of order confirmation. After that, personalized crafting begins and cancellation is no longer available.',
  },
  {
    q: 'What is your return policy?',
    a: 'Because our gifts are personalized and handcrafted, we do not accept general returns. If an item arrives damaged or defective, contact us promptly with photos and we will help.',
  },
  {
    q: 'Do you deliver across India?',
    a: 'Yes, we ship across India through trusted courier partners. Tracking details are shared after dispatch.',
  },
];

export default function HelpPage() {
  return (
    <div className="bg-ivory">
      <div className="container-page py-9 sm:py-12">
        <div className="mx-auto max-w-3xl">
          <header className="text-center">
            <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-[#FBEAEC] text-burgundy"><HelpCircle size={22} /></span>
            <p className="eyebrow mt-4">Help & FAQ</p>
            <h1 className="mt-1">Frequently asked questions</h1>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-secondary-text">Answers about ordering, payment, delivery, and personalization.</p>
          </header>

          <div className="mt-7 space-y-3">
            {FAQS.map((faq) => (
              <details key={faq.q} className="group rounded-xl border border-subtle-border bg-white p-5 shadow-[0_1px_2px_rgba(43,26,23,0.03)]">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-playfair text-lg font-bold text-ink">
                  {faq.q}
                  <ChevronDown size={18} className="shrink-0 text-burgundy transition-transform group-open:rotate-180" />
                </summary>
                <p className="mt-3 border-t border-subtle-border pt-3 text-sm leading-relaxed text-secondary-text">{faq.a}</p>
              </details>
            ))}
          </div>

          <div className="mt-7 rounded-2xl border border-subtle-border bg-[#FBF6F2] p-6 text-center sm:p-8">
            <h2 className="font-playfair text-2xl font-bold text-ink">Still have a question?</h2>
            <p className="mx-auto mt-1 max-w-md text-sm text-secondary-text">Our team is happy to help with custom requirements and order questions.</p>
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              <a href="https://wa.me/917579951781" target="_blank" rel="noopener noreferrer" className="btn-primary text-xs"><MessageCircle size={15} /> Chat on WhatsApp</a>
              <Link to="/contact" className="btn-secondary text-xs">Contact us</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
