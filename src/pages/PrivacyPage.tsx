export default function PrivacyPage() {
  return (
    <section className="bg-ivory min-h-screen py-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="bg-warm-white rounded-3xl p-8 sm:p-12 shadow-xl border border-subtle-border">
          <span className="text-[0.7rem] font-bold uppercase tracking-[0.2em] text-plum">Data Protection</span>
          <h1 className="font-playfair text-3xl sm:text-4xl lg:text-5xl text-plum mt-2 mb-6">Privacy Policy</h1>

          <div className="space-y-6 text-plum/80 leading-relaxed font-poppins text-sm sm:text-base">
            <p>
              Agrawal Gift Corner ("we", "our", "us") values your trust. This Privacy Policy outlines how your personal information is collected, used, and protected when you browse or make purchases from our store.
            </p>

            <div>
              <h2 className="font-playfair text-xl font-bold text-plum mb-2">Information We Collect</h2>
              <p>
                When you make an order or register an account, we collect necessary contact information (name, delivery address, phone number, email address) and customization instructions to fulfill your order.
              </p>
            </div>

            <div>
              <h2 className="font-playfair text-xl font-bold text-plum mb-2">How We Use Your Information</h2>
              <ul className="list-disc list-inside space-y-1.5 pl-2">
                <li>Processing, packing, and dispatching your orders.</li>
                <li>Contacting you via WhatsApp or phone to confirm order details and provide payment instructions.</li>
                <li>Communicating shipping updates and tracking information.</li>
              </ul>
            </div>

            <div>
              <h2 className="font-playfair text-xl font-bold text-plum mb-2">Third-Party Sharing</h2>
              <p>
                We never sell, rent, or trade your personal data. We only share delivery addresses and contact numbers with verified logistics and courier services strictly for fulfillment purposes.
              </p>
            </div>

            <div>
              <h2 className="font-playfair text-xl font-bold text-plum mb-2">Contact Us</h2>
              <p>
                If you have questions about your privacy, contact us at <a href="mailto:agrawalgiftcorner@gmail.com" className="text-muted-rose font-medium underline underline-offset-2">agrawalgiftcorner@gmail.com</a>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
