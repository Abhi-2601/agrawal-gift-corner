import type { ReactNode } from 'react';

interface ContentPageProps {
  eyebrow: string;
  title: string;
  intro?: string;
  children: ReactNode;
}

export default function ContentPage({ eyebrow, title, intro, children }: ContentPageProps) {
  return (
    <div className="bg-ivory">
      <div className="container-page py-9 sm:py-12">
        <div className="mx-auto max-w-4xl">
          <header className="mb-6">
            <p className="eyebrow">{eyebrow}</p>
            <h1 className="mt-1">{title}</h1>
            {intro && <p className="mt-3 max-w-2xl text-sm leading-relaxed text-secondary-text">{intro}</p>}
          </header>
          <div className="rounded-2xl border border-subtle-border bg-white p-5 shadow-[0_1px_2px_rgba(43,26,23,0.03)] sm:p-8">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
