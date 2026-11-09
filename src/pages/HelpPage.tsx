import { ChevronDown, MessageCircle, HelpCircle } from "lucide-react";
import { Link } from "react-router-dom";

const faqs = [
  {
    q: "How does payment work for my order?",
    a: "All orders are prepaid only. We do not provide Cash on Delivery (COD). After you place an order on our website, our representative directly gets in touch with you via WhatsApp or phone to verify your order details, confirm any customizations, and share secure payment instructions.",
  },
  {
    q: "What is your delivery timeframe?",
    a: "Orders typically take 7 to 15 days to deliver following order and payment confirmation. Handcrafted and personalized gifts require dedicated curation time prior to courier dispatch.",
  },
  {
    q: "Can I customize gifts with personal notes and names?",
    a: "Yes! Every customizable product features a dedicated customization field where you can provide names, dates, or messages (up to 500 characters). This customization is preserved through your cart and checkout directly onto your order.",
  },
  {
    q: "Can I cancel an order?",
    a: "You may request an order cancellation within 24 hours of order confirmation. Cancellations cannot be accepted after 24 hours as personalized crafting begins promptly.",
  },
  {
    q: "What is your return policy?",
    a: "Because our items are personalized and handcrafted gifts, we do not accept general returns. Applicable refunds follow our published policy and applicable law. If an item arrives damaged or defective, please contact our support team promptly.",
  },
  {
    q: "Do you deliver to my pincode in India?",
    a: "We ship all across India using reliable courier networks. Tracking details are provided upon dispatch.",
  },
];

export default function HelpPage() {
  return (
    <section className="bg-ivory min-h-screen py-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="w-12 h-12 rounded-full bg-soft-blush flex items-center justify-center text-plum mx-auto mb-3">
            <HelpCircle size={24} />
          </div>
          <span className="text-[0.7rem] font-bold uppercase tracking-[0.2em] text-plum">Help & FAQ</span>
          <h1 className="font-playfair text-4xl sm:text-5xl text-plum mt-2 mb-4">Frequently Asked Questions</h1>
          <p className="text-plum/80 leading-relaxed font-poppins">
            Find answers to common questions about our ordering process, payment, delivery, and personalization.
          </p>
        </div>

        <div className="space-y-4 mb-12">
          {faqs.map((f, i) => (
            <details
              key={i}
              className="bg-warm-white rounded-2xl border border-subtle-border p-6 shadow-sm group hover:border-champagne-gold transition-colors duration-200"
            >
              <summary className="font-playfair font-bold text-lg text-plum cursor-pointer flex justify-between items-center list-none select-none">
                <span>{f.q}</span>
                <ChevronDown size={20} className="text-muted-rose group-open:rotate-180 transition-transform duration-200 shrink-0 ml-4" />
              </summary>
              <p className="mt-4 text-plum/80 leading-relaxed font-poppins text-sm border-t border-subtle-border/40 pt-4">
                {f.a}
              </p>
            </details>
          ))}
        </div>

        <div className="bg-soft-blush/60 rounded-3xl p-8 border border-subtle-border text-center space-y-4">
          <h2 className="font-playfair text-2xl text-plum">Still have questions?</h2>
          <p className="text-plum/80 text-sm max-w-md mx-auto">
            Our team is always happy to assist you directly with custom requirements or order questions.
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-2">
            <a
              href="https://wa.me/917579951781"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#25D366] text-white font-medium py-3 px-6 rounded-full hover:bg-[#1EBE5D] transition-colors text-sm shadow-md"
            >
              <MessageCircle size={16} /> Chat on WhatsApp
            </a>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 bg-plum text-ivory font-medium py-3 px-6 rounded-full hover:bg-plum/90 transition-colors text-sm shadow-md"
            >
              Contact Us Page
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
