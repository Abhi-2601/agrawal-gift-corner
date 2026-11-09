import { Heart, Gift, Sparkles, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

export default function AboutPage() {
  return (
    <section className="bg-ivory min-h-screen py-16">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-[0.7rem] font-bold uppercase tracking-[0.2em] text-plum">Our Story</span>
          <h1 className="font-playfair text-4xl sm:text-5xl lg:text-6xl text-plum mt-2 mb-4 leading-tight">
            Crafting Memories with <span className="italic text-muted-rose">Love & Care</span>
          </h1>
          <p className="text-plum/80 leading-relaxed font-poppins text-lg">
            Agrawal Gift Corner is a dedicated gifting store based in the holy city of Mathura, Uttar Pradesh, creating customized hampers and presents that celebrate life's most precious occasions.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-warm-white rounded-3xl p-8 shadow-xl border border-subtle-border text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-soft-blush flex items-center justify-center text-plum mx-auto">
              <Gift size={26} />
            </div>
            <h3 className="font-playfair text-xl text-plum font-bold">Curated Handcrafted Hampers</h3>
            <p className="text-secondary-text text-sm leading-relaxed">
              Every hamper is thoughtfully designed, combining premium treats, decor, and heartfelt elements chosen for elegance.
            </p>
          </div>

          <div className="bg-warm-white rounded-3xl p-8 shadow-xl border border-subtle-border text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-soft-blush flex items-center justify-center text-plum mx-auto">
              <Sparkles size={26} />
            </div>
            <h3 className="font-playfair text-xl text-plum font-bold">Personalized Touch</h3>
            <p className="text-secondary-text text-sm leading-relaxed">
              We add customized names, dates, handwritten notes, and tailored designs to ensure every gift tells your personal story.
            </p>
          </div>

          <div className="bg-warm-white rounded-3xl p-8 shadow-xl border border-subtle-border text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-soft-blush flex items-center justify-center text-plum mx-auto">
              <Heart size={26} />
            </div>
            <h3 className="font-playfair text-xl text-plum font-bold">Dedicated Customer Care</h3>
            <p className="text-secondary-text text-sm leading-relaxed">
              We personally verify every order with our customers over WhatsApp to confirm customization before handcrafted preparation.
            </p>
          </div>
        </div>

        <div className="bg-warm-white rounded-3xl p-8 sm:p-12 shadow-xl border border-subtle-border flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-muted-rose font-medium text-sm">
              <MapPin size={18} />
              <span>Mathura, Uttar Pradesh, India</span>
            </div>
            <h2 className="font-playfair text-3xl text-plum">Celebrate your special moments with us</h2>
            <p className="text-plum/80 text-sm max-w-xl">
              Explore our wide variety of hampers for birthdays, anniversaries, weddings, festivals, and personal milestones.
            </p>
          </div>
          <Link
            to="/products"
            className="inline-flex items-center justify-center bg-plum text-ivory font-bold px-8 py-4 rounded-2xl hover:bg-plum/90 transition shadow-lg shadow-plum/20 whitespace-nowrap"
          >
            Explore Collection
          </Link>
        </div>
      </div>
    </section>
  );
}
