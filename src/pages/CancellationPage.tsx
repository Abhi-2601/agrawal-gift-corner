export default function CancellationPage() {
  return (
    <section className="bg-ivory min-h-screen py-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="bg-warm-white rounded-3xl p-8 sm:p-12 shadow-xl border border-subtle-border">
          <span className="text-[0.7rem] font-bold uppercase tracking-[0.2em] text-plum">Order Modification & Cancellation</span>
          <h1 className="font-playfair text-3xl sm:text-4xl lg:text-5xl text-plum mt-2 mb-6">Cancellation Policy</h1>

          <div className="space-y-6 text-plum/80 leading-relaxed font-poppins text-sm sm:text-base">
            <div className="p-4 rounded-2xl bg-soft-blush/60 border border-subtle-border">
              <h2 className="font-playfair text-lg sm:text-xl font-bold text-plum mb-2">24-Hour Cancellation Window</h2>
              <p>
                You may request an order cancellation within <strong>24 hours of order confirmation</strong>. 
                Cancellation is <strong>not allowed after 24 hours</strong> because customized preparation, personalization, and material sourcing commence immediately to ensure on-time delivery.
              </p>
            </div>

            <div>
              <h2 className="font-playfair text-xl font-bold text-plum mb-2">How to Request a Cancellation</h2>
              <p>
                To cancel within the eligible 24-hour window, please contact our support team immediately on WhatsApp at <a href="https://wa.me/917579951781" target="_blank" rel="noopener noreferrer" className="text-muted-rose font-medium underline underline-offset-2">+91 75799 51781</a> or email <a href="mailto:agrawalgiftcorner@gmail.com" className="text-muted-rose font-medium underline underline-offset-2">agrawalgiftcorner@gmail.com</a> with your Order ID.
              </p>
            </div>

            <div>
              <h2 className="font-playfair text-xl font-bold text-plum mb-2">Refund Processing</h2>
              <p>
                For cancellations approved within the 24-hour window, the refund will be credited back via the original payment route within 5–7 working days.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
