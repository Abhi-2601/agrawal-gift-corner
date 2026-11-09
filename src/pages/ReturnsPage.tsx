export default function ReturnsPage() {
  return (
    <section className="bg-ivory min-h-screen py-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="bg-warm-white rounded-3xl p-8 sm:p-12 shadow-xl border border-subtle-border">
          <span className="text-[0.7rem] font-bold uppercase tracking-[0.2em] text-plum">Customer Assurance</span>
          <h1 className="font-playfair text-3xl sm:text-4xl lg:text-5xl text-plum mt-2 mb-6">Returns & Refund Policy</h1>

          <div className="space-y-6 text-plum/80 leading-relaxed font-poppins text-sm sm:text-base">
            <div className="p-4 rounded-2xl bg-soft-blush/60 border border-subtle-border">
              <h2 className="font-playfair text-lg sm:text-xl font-bold text-plum mb-2">No General Returns</h2>
              <p>
                Due to the delicate, handcrafted, and personalized nature of our gifts, <strong>we do not accept general returns or exchanges</strong> once an item has been crafted and delivered in good condition.
              </p>
            </div>

            <div>
              <h2 className="font-playfair text-xl font-bold text-plum mb-2">Damaged or Defective Items</h2>
              <p>
                In the rare event that an item arrives damaged in transit or defective, please contact our support team promptly with details and photos of the package and item.
              </p>
            </div>

            <div>
              <h2 className="font-playfair text-xl font-bold text-plum mb-2">Applicable Refunds</h2>
              <p>
                Applicable refunds follow our published policy and applicable law. If an eligible issue is confirmed, our team will initiate an exchange or refund directly to your original payment account.
              </p>
            </div>

            <div>
              <h2 className="font-playfair text-xl font-bold text-plum mb-2">Contact for Assistance</h2>
              <p>
                For assistance, please message our support team on WhatsApp at <a href="https://wa.me/917579951781" target="_blank" rel="noopener noreferrer" className="text-muted-rose font-medium underline underline-offset-2">+91 75799 51781</a> or email <a href="mailto:agrawalgiftcorner@gmail.com" className="text-muted-rose font-medium underline underline-offset-2">agrawalgiftcorner@gmail.com</a>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
