import ContentPage from '../components/ContentPage';

export default function ReturnsPage() {
  return (
    <ContentPage
      eyebrow="Customer assurance"
      title="Returns & refund policy"
      intro="Because our gifts are handcrafted and personalized, our returns policy is designed to be clear and fair."
    >
      <div className="space-y-6 text-sm leading-relaxed text-ink/70">
        <div className="rounded-xl border border-subtle-border bg-[#FBF6F2] p-4">
          <h2 className="font-playfair text-lg font-bold text-ink">No general returns</h2>
          <p className="mt-1">Personalized and handcrafted gifts cannot be returned or exchanged once crafted and delivered in good condition.</p>
        </div>

        <section>
          <h2 className="font-playfair text-xl font-bold text-ink">Damaged or defective items</h2>
          <p className="mt-2">If your gift arrives damaged or defective, contact us promptly with photos of the package and item. We will investigate and arrange an appropriate resolution.</p>
        </section>

        <section>
          <h2 className="font-playfair text-xl font-bold text-ink">Applicable refunds</h2>
          <p className="mt-2">Where a refund is approved, it is processed to the original payment method within 5–7 working days.</p>
        </section>

        <section>
          <h2 className="font-playfair text-xl font-bold text-ink">Contact support</h2>
          <p className="mt-2">WhatsApp <a href="https://wa.me/917579951781" target="_blank" rel="noopener noreferrer" className="font-semibold text-burgundy underline underline-offset-2">+91 75799 51781</a> or email <a href="mailto:agrawalgiftcorner@gmail.com" className="font-semibold text-burgundy underline underline-offset-2">agrawalgiftcorner@gmail.com</a>.</p>
        </section>
      </div>
    </ContentPage>
  );
}
