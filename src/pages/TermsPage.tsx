import ContentPage from '../components/ContentPage';

export default function TermsPage() {
  return (
    <ContentPage
      eyebrow="Terms & conditions"
      title="Terms of service"
      intro="By browsing our website or placing an order, you agree to the terms below."
    >
      <div className="space-y-6 text-sm leading-relaxed text-ink/70">
        <section>
          <h2 className="font-playfair text-xl font-bold text-ink">1. Orders and payment</h2>
          <p className="mt-2">All orders are prepaid. After you submit an order request, our team contacts you to confirm personalization and share verified payment instructions. Orders are processed only after payment confirmation.</p>
        </section>

        <section>
          <h2 className="font-playfair text-xl font-bold text-ink">2. Personalization</h2>
          <p className="mt-2">Please check names, dates, spellings, and messages before submitting. We craft items exactly as instructed in your personalization notes.</p>
        </section>

        <section>
          <h2 className="font-playfair text-xl font-bold text-ink">3. Shipping and delivery</h2>
          <p className="mt-2">Estimated delivery is 7–15 days after confirmation. Handcrafted and personalized items require preparation time. Courier delays outside our control are handled with our delivery partners.</p>
        </section>

        <section>
          <h2 className="font-playfair text-xl font-bold text-ink">4. Cancellations and returns</h2>
          <p className="mt-2">Cancellation requests are accepted within 24 hours of confirmation. Returns are governed by our Returns & Refund Policy.</p>
        </section>

        <section>
          <h2 className="font-playfair text-xl font-bold text-ink">5. Governing law</h2>
          <p className="mt-2">These terms are governed by the laws of India. Disputes are subject to the jurisdiction of the courts in Mathura, Uttar Pradesh.</p>
        </section>
      </div>
    </ContentPage>
  );
}
