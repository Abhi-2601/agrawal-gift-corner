export default function ShippingPage() {
  return (
    <section className="bg-ivory min-h-screen py-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="bg-warm-white rounded-3xl p-8 sm:p-12 shadow-xl border border-subtle-border">
          <span className="text-[0.7rem] font-bold uppercase tracking-[0.2em] text-plum">Delivery Information</span>
          <h1 className="font-playfair text-3xl sm:text-4xl lg:text-5xl text-plum mt-2 mb-6">Shipping Policy</h1>

          <div className="space-y-6 text-plum/80 leading-relaxed font-poppins text-sm sm:text-base">
            <div className="p-4 rounded-2xl bg-soft-blush/60 border border-subtle-border">
              <h2 className="font-playfair text-lg sm:text-xl font-bold text-plum mb-2">Delivery Timeframe</h2>
              <p>
                Our standard delivery timeline is <strong>7 to 15 business days</strong> after order confirmation and payment receipt. Handcrafted and personalized gifts take dedicated preparation time before dispatch.
              </p>
            </div>

            <div>
              <h2 className="font-playfair text-xl font-bold text-plum mb-2">Prepaid Orders Only</h2>
              <p>
                Agrawal Gift Corner operates on a <strong>prepaid basis only</strong>. We do not provide Cash on Delivery (COD). After you place your order, our team directly reaches out to confirm your details and provide secure payment instructions.
              </p>
            </div>

            <div>
              <h2 className="font-playfair text-xl font-bold text-plum mb-2">Order Dispatch & Tracking</h2>
              <p>
                Once your payment is verified and your customized gift is curated and packaged safely, we dispatch via trusted courier partners across India. Tracking details are provided upon dispatch.
              </p>
            </div>

            <div>
              <h2 className="font-playfair text-xl font-bold text-plum mb-2">Questions or Urgent Queries?</h2>
              <p>
                Reach us directly on WhatsApp at <a href="https://wa.me/917579951781" target="_blank" rel="noopener noreferrer" className="text-muted-rose font-medium underline underline-offset-2">+91 75799 51781</a> or email <a href="mailto:agrawalgiftcorner@gmail.com" className="text-muted-rose font-medium underline underline-offset-2">agrawalgiftcorner@gmail.com</a>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
