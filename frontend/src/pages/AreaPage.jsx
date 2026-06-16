import { useEffect } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { Phone, MapPin, ArrowLeft, Truck, Clock, ShieldCheck, ArrowRight, CalendarClock } from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import FloatingCTAs from "@/components/FloatingCTAs";
import { PHONE, PHONE_HREF } from "@/lib/api";
import { AREAS } from "@/data/areas";
import { SERVICE_LIST } from "@/data/services";

export default function AreaPage() {
  const { slug } = useParams();
  const area = AREAS[slug];

  useEffect(() => {
    if (area) document.title = `Septic Pumping ${area.display} · Castellon Septic Services · ${PHONE}`;
    window.scrollTo(0, 0);
  }, [area]);

  if (!area) return <Navigate to="/" replace />;

  return (
    <div className="bg-white text-navy" data-testid={`area-page-${area.slug}`}>
      <SiteHeader />

      {/* Hero */}
      <section className="relative bg-cream overflow-hidden">
        <div className="absolute inset-0 topo-bg opacity-50" />
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 pt-12 pb-20 md:pt-16 md:pb-28">
          <Link to="/" className="inline-flex items-center gap-2 font-mono-tiny text-[11px] text-[var(--muted)] mb-4 hover:text-navy" data-testid="area-back">
            <ArrowLeft className="w-3 h-3" /> ALL SERVICE AREAS
          </Link>
          <div className="eyebrow mb-3">SERVING — {area.state}</div>
          <h1 className="font-display text-5xl sm:text-7xl lg:text-[5.5rem] text-navy mb-6" data-testid="area-headline">
            Septic Pumping In {area.display}
          </h1>
          <p className="text-lg md:text-xl text-[var(--muted)] max-w-3xl leading-relaxed">{area.intro}</p>

          {/* Area stats */}
          <div className="mt-10 grid sm:grid-cols-3 gap-3 max-w-3xl">
            <div className="stat-card">
              <Truck className="w-5 h-5 text-[var(--amber)] mb-2" />
              <div className="font-display text-2xl text-navy">{area.distance}</div>
              <div className="font-mono-tiny text-[10px] text-[var(--muted)] mt-1">FROM SPOKANE HQ</div>
            </div>
            <div className="stat-card">
              <Clock className="w-5 h-5 text-[var(--amber)] mb-2" />
              <div className="font-display text-2xl text-navy">{area.driveTime}</div>
              <div className="font-mono-tiny text-[10px] text-[var(--muted)] mt-1">TYPICAL DRIVE TIME</div>
            </div>
            <div className="stat-card">
              <ShieldCheck className="w-5 h-5 text-[var(--amber)] mb-2" />
              <div className="font-display text-2xl text-navy">SAME-DAY</div>
              <div className="font-mono-tiny text-[10px] text-[var(--muted)] mt-1">EMERGENCY DISPATCH</div>
            </div>
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link to="/book" className="btn-amber gap-2 text-xl md:text-2xl" data-testid="area-book-btn">
              <CalendarClock className="w-5 h-5" /> Book Online
            </Link>
            <a href={PHONE_HREF} className="btn-outline-navy gap-2 text-xl md:text-2xl" data-testid="area-call-btn">
              <Phone className="w-5 h-5" /> Call {PHONE}
            </a>
          </div>
        </div>
      </section>

      {/* Neighborhoods */}
      <section className="py-20 bg-white" data-testid="neighborhoods-section">
        <div className="max-w-5xl mx-auto px-6 lg:px-8 grid lg:grid-cols-[1fr_1.2fr] gap-12">
          <div>
            <div className="eyebrow mb-3">NEIGHBORHOODS & AREAS</div>
            <h2 className="font-display text-3xl md:text-5xl text-navy mb-5">We Cover All Of {area.city}.</h2>
            <p className="text-[var(--muted)] leading-relaxed">
              From the busy areas to the rural pockets just outside town — if it&apos;s in {area.display}, our 1,800-gallon vacuum truck reaches it.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            {area.neighborhoods.map((n) => (
              <div key={n} className="border-2 border-[var(--border-strong)] bg-cream p-4 flex items-center gap-3">
                <MapPin className="w-4 h-4 text-[var(--amber)] shrink-0" />
                <span className="font-medium text-navy">{n}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services available */}
      <section className="py-20 bg-cream" data-testid="area-services-section">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="mb-10">
            <div className="eyebrow mb-3">AVAILABLE IN {area.display.toUpperCase()}</div>
            <h2 className="font-display text-3xl md:text-5xl text-navy">All Of Our Services. All Right Here.</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {SERVICE_LIST.map((s) => {
              const SI = s.icon;
              return (
                <Link key={s.key} to={`/services/${s.slug}`} className="service-card p-6 block" data-testid={`area-service-${s.key}`}>
                  <div className="w-12 h-12 bg-navy flex items-center justify-center mb-4">
                    <SI className="w-6 h-6 text-[var(--amber)]" strokeWidth={2} />
                  </div>
                  <div className="font-display text-lg text-navy mb-2 leading-tight">{s.name}</div>
                  <div className="inline-flex items-center gap-1 font-display text-sm text-navy hover:text-[var(--amber)]">
                    Learn more <ArrowRight className="w-4 h-4" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-navy text-white text-center" data-testid="area-final-cta">
        <div className="max-w-3xl mx-auto px-6 lg:px-8">
          <div className="eyebrow on-dark mb-3" style={{ display: "inline-flex" }}>READY WHEN YOU ARE</div>
          <h2 className="font-display text-4xl md:text-6xl mb-5">Need Septic Service In {area.city}?</h2>
          <p className="text-white/80 mb-8">Book online or call us — same crew either way.</p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link to="/book" className="btn-amber gap-2 text-2xl">
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
