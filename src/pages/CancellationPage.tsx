import ContentPage from '../components/ContentPage';

export default function CancellationPage() {
  return (
    <ContentPage
      eyebrow="Order modification"
      title="Cancellation policy"
      intro="We begin preparing personalized gifts quickly, so cancellation windows are limited."
    >
      <div className="space-y-6 text-sm leading-relaxed text-ink/70">
        <div className="rounded-xl border border-subtle-border bg-[#FBF6F2] p-4">
          <h2 className="font-playfair text-lg font-bold text-ink">24-hour cancellation window</h2>
          <p className="mt-1">You may request cancellation within <strong>24 hours of order confirmation</strong>. After that, personalized preparation and material sourcing begin, so cancellation is not available.</p>
        </div>

        <section>
          <h2 className="font-playfair text-xl font-bold text-ink">How to request cancellation</h2>
          <p className="mt-2">Contact us immediately on WhatsApp at <a href="https://wa.me/917579951781" target="_blank" rel="noopener noreferrer" className="font-semibold text-burgundy underline underline-offset-2">+91 75799 51781</a> or email <a href="mailto:agrawalgiftcorner@gmail.com" className="font-semibold text-burgundy underline underline-offset-2">agrawalgiftcorner@gmail.com</a> with your order reference.</p>
        </section>

        <section>
          <h2 className="font-playfair text-xl font-bold text-ink">Refund processing</h2>
          <p className="mt-2">Approved cancellations are refunded to the original payment method within 5–7 working days.</p>
        </section>
      </div>
    </ContentPage>
  );
}
