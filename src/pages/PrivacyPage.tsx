import ContentPage from '../components/ContentPage';

export default function PrivacyPage() {
  return (
    <ContentPage
      eyebrow="Data protection"
      title="Privacy policy"
      intro="Agrawal Gift Corner values your trust. This policy explains what we collect, why we need it, and how we protect it."
    >
      <div className="space-y-6 text-sm leading-relaxed text-ink/70">
        <p>When you browse or order from our store, we collect the information needed to fulfil your gift order and keep you updated.</p>

        <section>
          <h2 className="font-playfair text-xl font-bold text-ink">Information we collect</h2>
          <p className="mt-2">We collect your name, delivery address, phone number, email address, order details, and any personalization instructions you provide.</p>
        </section>

        <section>
          <h2 className="font-playfair text-xl font-bold text-ink">How we use it</h2>
          <ul className="mt-2 list-disc space-y-1.5 pl-5">
            <li>To process, pack, personalize, and dispatch your order.</li>
            <li>To contact you on WhatsApp or phone to confirm order and payment details.</li>
            <li>To share dispatch and delivery updates.</li>
            <li>To improve our products and customer experience.</li>
          </ul>
        </section>

        <section>
          <h2 className="font-playfair text-xl font-bold text-ink">Sharing and security</h2>
          <p className="mt-2">We never sell or rent your personal data. Delivery partners receive only the details needed to deliver your order. Access to customer records is restricted to authorised store administrators.</p>
        </section>

        <section>
          <h2 className="font-playfair text-xl font-bold text-ink">Your choices</h2>
          <p className="mt-2">You may request access, correction, or deletion of your account information by contacting us. Some order records may be retained where required for accounting or legal purposes.</p>
        </section>

        <section>
          <h2 className="font-playfair text-xl font-bold text-ink">Contact</h2>
          <p className="mt-2">For privacy questions, email <a href="mailto:agrawalgiftcorner@gmail.com" className="font-semibold text-burgundy underline underline-offset-2">agrawalgiftcorner@gmail.com</a>.</p>
        </section>
      </div>
    </ContentPage>
  );
}
