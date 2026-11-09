import { Link } from 'react-router-dom';
import { ArrowRight, Gift, Heart, MapPin, Sparkles } from 'lucide-react';

const VALUES = [
  { icon: Gift, title: 'Curated with care', text: 'Every hamper is thoughtfully composed with premium treats, keepsakes, and beautiful packaging.' },
  { icon: Sparkles, title: 'Personal by design', text: 'Names, dates, photos, and handwritten notes turn a lovely gift into a meaningful one.' },
  { icon: Heart, title: 'Service that feels human', text: 'We confirm every order personally on WhatsApp before your gift is crafted.' },
];

export default function AboutPage() {
  return (
    <div className="bg-ivory">
      <section className="border-b border-subtle-border bg-[#F8EDE7]">
        <div className="container-page py-10 sm:py-14">
          <div className="max-w-2xl">
            <p className="eyebrow">Our story</p>
            <h1 className="mt-2">Crafting memories with love and care</h1>
            <p className="mt-4 text-sm leading-relaxed text-ink/65 sm:text-base">
              Agrawal Gift Corner is a family-run gifting studio in Mathura, Uttar Pradesh. We create personalized hampers and presents that celebrate life’s most precious occasions.
            </p>
          </div>
        </div>
      </section>

      <div className="container-page py-10 sm:py-12">
        <div className="grid gap-4 md:grid-cols-3">
          {VALUES.map(({ icon: Icon, title, text }) => (
            <div key={title} className="rounded-2xl border border-subtle-border bg-white p-6 shadow-[0_1px_2px_rgba(43,26,23,0.03)]">
              <span className="grid h-11 w-11 place-items-center rounded-full bg-[#FBEAEC] text-burgundy"><Icon size={21} /></span>
              <h2 className="mt-4 font-playfair text-xl font-bold text-ink">{title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-secondary-text">{text}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 flex flex-col items-start justify-between gap-5 rounded-2xl bg-[#4A0D15] p-7 text-white sm:p-9 lg:flex-row lg:items-center">
          <div>
            <p className="inline-flex items-center gap-2 text-xs font-semibold text-[#F6DCCB]"><MapPin size={15} /> Mathura, Uttar Pradesh</p>
            <h2 className="mt-2 max-w-xl font-playfair text-2xl font-bold text-white sm:text-3xl">Celebrate your special moments with us</h2>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-white/65">Explore hampers for birthdays, anniversaries, weddings, festivals, corporate gifting, and personal milestones.</p>
          </div>
          <Link to="/products" className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-[#F6DCCB] px-5 py-3 text-sm font-semibold text-[#4A0D15] transition-colors hover:bg-white">
            Explore collection <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}
