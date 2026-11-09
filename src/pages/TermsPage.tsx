export default function TermsPage() {
  return (
    <section className="bg-ivory min-h-screen py-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="bg-warm-white rounded-3xl p-8 sm:p-12 shadow-xl border border-subtle-border">
          <span className="text-[0.7rem] font-bold uppercase tracking-[0.2em] text-plum">Terms & Conditions</span>
          <h1 className="font-playfair text-3xl sm:text-4xl lg:text-5xl text-plum mt-2 mb-6">Terms of Service</h1>

          <div className="space-y-6 text-plum/80 leading-relaxed font-poppins text-sm sm:text-base">
            <p>
              Welcome to Agrawal Gift Corner. By browsing our website or placing an order with us, you agree to comply with and be bound by the following terms and conditions.
            </p>

            <div>
              <h2 className="font-playfair text-xl font-bold text-plum mb-2">1. Order Placement & Payment</h2>
              <p>
                All orders placed on our website are prepaid only. Once you place an order, our representative contacts you directly to confirm the customization details and provide verified payment instructions. Orders will be processed only upon payment confirmation.
              </p>
            </div>

            <div>
              <h2 className="font-playfair text-xl font-bold text-plum mb-2">2. Customization & Personalization</h2>
              <p>
                Please ensure that names, dates, text, and instructions entered in customization notes are accurate at the time of order. We craft items in accordance with the provided details.
              </p>
            </div>

            <div>
              <h2 className="font-playfair text-xl font-bold text-plum mb-2">3. Shipping & Delivery</h2>
              <p>
                Delivery timelines generally range between 7 to 15 days from order confirmation. Unforeseen courier delays due to regional logistics or external conditions are handled diligently with our delivery partners.
              </p>
            </div>

            <div>
              <h2 className="font-playfair text-xl font-bold text-plum mb-2">4. Cancellations & Returns</h2>
              <p>
                Orders may be cancelled within 24 hours of confirmation. Beyond 24 hours, cancellations cannot be accepted. Returns are subject to our Returns & Refund Policy.
              </p>
            </div>

            <div>
              <h2 className="font-playfair text-xl font-bold text-plum mb-2">5. Governing Law</h2>
              <p>
                These terms are governed by the laws applicable in Uttar Pradesh, India. Any disputes are subject to the exclusive jurisdiction of the courts in Mathura, Uttar Pradesh.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
