import { useEffect } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { Phone, ArrowRight, Check, CalendarClock, ArrowLeft } from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import FloatingCTAs from "@/components/FloatingCTAs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { PHONE, PHONE_HREF } from "@/lib/api";
import { SERVICE_PAGES } from "@/data/services";

export default function ServicePage() {
  const { slug } = useParams();
  const entry = Object.values(SERVICE_PAGES).find((s) => s.slug === slug);

  useEffect(() => {
    if (entry) document.title = `${entry.name} · Castellon Septic Services · Spokane WA`;
    window.scrollTo(0, 0);
  }, [entry]);

  if (!entry) return <Navigate to="/" replace />;

  const Icon = entry.icon;

  return (
    <div className="bg-white text-navy" data-testid={`service-page-${entry.key}`}>
      <SiteHeader />

      {/* Hero */}
      <section className="relative overflow-hidden bg-cream">
        <div className="absolute inset-0 topo-bg opacity-50" />
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 pt-12 pb-20 md:pt-16 md:pb-28 grid lg:grid-cols-[1.3fr_1fr] gap-10 items-center">
          <div>
            <Link to="/" className="inline-flex items-center gap-2 font-mono-tiny text-[11px] text-[var(--muted)] mb-4 hover:text-navy" data-testid="back-home">
              <ArrowLeft className="w-3 h-3" /> ALL SERVICES
            </Link>
            <div className="eyebrow mb-3">{entry.eyebrow}</div>
            <div className="flex items-start gap-4 mb-5">
              <div className="w-16 h-16 bg-navy flex items-center justify-center shrink-0 mt-1">
                <Icon className="w-9 h-9 text-[var(--amber)]" strokeWidth={2} />
              </div>
              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl text-navy" data-testid="service-headline">
                {entry.headline}
              </h1>
            </div>
            <p className="text-lg text-[var(--muted)] max-w-2xl leading-relaxed">{entry.intro}</p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link to={`/book?service=${entry.key}`} className="btn-amber gap-2" data-testid="service-book-btn">
                <CalendarClock className="w-4 h-4" /> Book This Service
              </Link>
              <a href={PHONE_HREF} className="btn-outline-navy gap-2" data-testid="service-call-btn">
                <Phone className="w-4 h-4" /> Call {PHONE}
              </a>
            </div>
          </div>
          <div className="relative aspect-[4/5] bg-navy border-4 border-navy overflow-hidden shadow-[12px_12px_0_var(--amber)] hidden lg:block">
            <img
              src={entry.image}
              alt={entry.name}
              className="absolute inset-0 w-full h-full object-cover"
              style={{ objectPosition: "78% center" }}
            />
            <div className="absolute inset-0 bg-[var(--navy)]/25" />
            <div className="absolute bottom-4 left-4 right-4 font-display text-white text-3xl leading-none">
              {entry.short}<br />Service
            </div>
          </div>
        </div>
      </section>

      {/* What's Included */}
      <section className="py-20 bg-white" data-testid="included-section">
        <div className="max-w-5xl mx-auto px-6 lg:px-8 grid lg:grid-cols-[1.2fr_1fr] gap-12">
          <div>
            <div className="eyebrow mb-3">WHAT&apos;S INCLUDED</div>
            <h2 className="font-display text-3xl md:text-5xl mb-6 text-navy">Every Visit. No Add-Ons.</h2>
            <ul className="space-y-3">
              {entry.included.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-[var(--amber)] flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-4 h-4 text-white" strokeWidth={3} />
                  </div>
                  <span className="text-navy font-medium leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-cream border-2 border-[var(--border-strong)] p-6">
            <div className="font-mono-tiny text-[11px] text-[var(--muted)] mb-3">WHEN YOU NEED THIS</div>
            <p className="text-navy leading-relaxed">{entry.whenNeeded}</p>
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-20 bg-cream" data-testid="process-section">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="mb-10">
            <div className="eyebrow mb-3">OUR PROCESS</div>
            <h2 className="font-display text-3xl md:text-5xl text-navy max-w-2xl">How It Works.</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {entry.steps.map((s, idx) => (
              <div key={idx} className="bg-white border-2 border-[var(--border-strong)] p-5 relative" data-testid={`step-${idx}`}>
                <div className="font-display text-5xl text-[var(--amber)] mb-2 leading-none">0{idx + 1}</div>
                <div className="font-display text-xl text-navy mb-2">{s.t}</div>
                <p className="text-sm text-[var(--muted)] leading-relaxed">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Service FAQ */}
      {entry.faqs?.length > 0 && (
        <section className="py-20 bg-white" data-testid="service-faq-section">
          <div className="max-w-3xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-10">
              <div className="eyebrow mb-3" style={{ display: "inline-flex" }}>QUESTIONS, ANSWERED</div>
              <h2 className="font-display text-3xl md:text-5xl text-navy">{entry.short} FAQ</h2>
            </div>
            <Accordion type="single" collapsible className="space-y-2">
              {entry.faqs.map((f, idx) => (
                <AccordionItem key={idx} value={`item-${idx}`} className="border-2 border-[var(--border-strong)] bg-cream px-5">
                  <AccordionTrigger className="font-display text-lg md:text-xl tracking-wide text-left text-navy hover:text-[var(--amber)]">
                    {f.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-[var(--muted)] leading-relaxed">{f.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>
      )}

      {/* Related */}
      {entry.related?.length > 0 && (
        <section className="py-20 bg-cream border-t-2 border-[var(--border-strong)]" data-testid="related-section">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="eyebrow mb-3">OTHER SERVICES</div>
            <h2 className="font-display text-3xl md:text-5xl text-navy mb-8">Need Something Else?</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {entry.related.map((k) => {
                const r = SERVICE_PAGES[k];
                if (!r) return null;
                const RI = r.icon;
                return (
                  <Link key={k} to={`/services/${r.slug}`} className="service-card p-6 block">
                    <div className="w-12 h-12 bg-navy flex items-center justify-center mb-4">
                      <RI className="w-6 h-6 text-[var(--amber)]" strokeWidth={2} />
                    </div>
                    <div className="font-display text-xl text-navy mb-2">{r.name}</div>
                    <div className="inline-flex items-center gap-1 font-display text-sm text-navy hover:text-[var(--amber)]">
                      Learn more <ArrowRight className="w-4 h-4" />
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Final CTA */}
      <section className="py-24 bg-navy text-white text-center" data-testid="service-final-cta">
        <div className="max-w-3xl mx-auto px-6 lg:px-8">
          <div className="eyebrow on-dark mb-3" style={{ display: "inline-flex" }}>READY TO BOOK</div>
          <h2 className="font-display text-4xl md:text-6xl mb-5">{entry.short}, Done Right.</h2>
          <p className="text-white/80 mb-8">Pick a slot online or call us directly — both reach the same crew.</p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link to={`/book?service=${entry.key}`} className="btn-amber gap-2 text-2xl">
              <CalendarClock className="w-5 h-5" /> Book Online
            </Link>
            <a href={PHONE_HREF} className="inline-flex items-center gap-2 bg-transparent border-2 border-white text-white font-display uppercase tracking-wider px-6 py-3 text-2xl hover:bg-white hover:text-navy transition">
              <Phone className="w-5 h-5" /> Call {PHONE}
            </a>
          </div>
        </div>
      </section>

      <SiteFooter />
      <FloatingCTAs />
    </div>
  );
}
