import ContentPage from '../components/ContentPage';

export default function ShippingPage() {
  return (
    <ContentPage
      eyebrow="Delivery information"
      title="Shipping policy"
      intro="Everything you need to know about how your gift reaches its destination."
    >
      <div className="space-y-6 text-sm leading-relaxed text-ink/70">
        <div className="rounded-xl border border-subtle-border bg-[#FBF6F2] p-4">
          <h2 className="font-playfair text-lg font-bold text-ink">Delivery timeframe</h2>
          <p className="mt-1">Standard delivery is <strong>7–15 business days</strong> after order confirmation and payment. Personalized gifts take dedicated preparation time before dispatch.</p>
        </div>

        <section>
          <h2 className="font-playfair text-xl font-bold text-ink">Prepaid orders only</h2>
          <p className="mt-2">We do not offer cash on delivery. Our team contacts you directly to confirm details and provide secure payment instructions.</p>
        </section>

        <section>
          <h2 className="font-playfair text-xl font-bold text-ink">Dispatch and tracking</h2>
          <p className="mt-2">Once your gift is crafted and packed, we dispatch through trusted courier partners across India. Tracking details are shared after dispatch.</p>
        </section>

        <section>
          <h2 className="font-playfair text-xl font-bold text-ink">Questions?</h2>
          <p className="mt-2">WhatsApp us at <a href="https://wa.me/917579951781" target="_blank" rel="noopener noreferrer" className="font-semibold text-burgundy underline underline-offset-2">+91 75799 51781</a> or email <a href="mailto:agrawalgiftcorner@gmail.com" className="font-semibold text-burgundy underline underline-offset-2">agrawalgiftcorner@gmail.com</a>.</p>
        </section>
      </div>
    </ContentPage>
  );
}
