import { useEffect } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import {
  Phone, MapPin, ArrowLeft, Truck, Clock, ShieldCheck, ArrowRight, CalendarClock,
  Check, AlertTriangle, Siren, TrendingUp, Star,
} from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import FloatingCTAs from "@/components/FloatingCTAs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { PHONE, PHONE_HREF } from "@/lib/api";
import { AREAS, AREA_LIST } from "@/data/areas";
import { SERVICE_PAGES, SERVICE_LIST } from "@/data/services";

export default function AreaPage() {
  const { slug } = useParams();
  const area = AREAS[slug];

  useEffect(() => {
    if (area) document.title = `Septic Pumping ${area.display} · Castellon Septic Services · ${PHONE}`;
    window.scrollTo(0, 0);
  }, [area]);

  if (!area) return <Navigate to="/" replace />;

  // Other areas for cross-linking footer
  const otherAreas = AREA_LIST.filter((a) => a.slug !== area.slug).slice(0, 6);

  return (
    <div className="bg-white text-navy" data-testid={`area-page-${area.slug}`}>
      <SiteHeader />

      {/* HERO */}
      <section className="relative bg-cream overflow-hidden">
        <div className="absolute inset-0 topo-bg opacity-50" />
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 pt-12 pb-16 md:pt-16 md:pb-24">
          <Link to="/" className="inline-flex items-center gap-2 font-mono-tiny text-[11px] text-[var(--muted)] mb-4 hover:text-navy" data-testid="area-back">
            <ArrowLeft className="w-3 h-3" /> ALL SERVICE AREAS
          </Link>
          <div className="eyebrow mb-3">SERVING — {area.state}</div>
          <h1 className="font-display text-5xl sm:text-7xl lg:text-[5.5rem] text-navy mb-6" data-testid="area-headline">
            Septic Pumping In {area.display}
          </h1>
          <p className="text-lg md:text-xl text-[var(--muted)] max-w-3xl leading-relaxed">{area.intro}</p>

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

      {/* SERVICES — DETAILED, each with intro + included bullets + CTA */}
      <section className="py-20 bg-white" data-testid="area-services-detailed">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="mb-12 max-w-3xl">
            <div className="eyebrow mb-3">SERVICES IN {area.display.toUpperCase()}</div>
            <h2 className="font-display text-4xl md:text-6xl text-navy mb-4">All Four Services. Right Here In {area.city}.</h2>
            <p className="text-[var(--muted)] text-lg leading-relaxed">
              The same 1,800-gallon vacuum truck that serves Spokane comes to {area.city}. Same crew, same standards, same response time.
            </p>
          </div>

          <div className="space-y-12">
            {SERVICE_LIST.map((s, idx) => {
              const Icon = s.icon;
              const detail = SERVICE_PAGES[s.key];
              const flipped = idx % 2 === 1;
              return (
                <div
                  key={s.key}
                  className={`grid lg:grid-cols-[1.2fr_1fr] gap-8 lg:gap-12 items-start ${flipped ? "lg:[&>*:first-child]:order-2" : ""}`}
                  data-testid={`area-service-block-${s.key}`}
                >
                  {/* Content */}
                  <div>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-14 h-14 bg-navy flex items-center justify-center shrink-0">
                        <Icon className="w-7 h-7 text-[var(--amber)]" strokeWidth={2} />
                      </div>
                      <div>
                        <div className="font-mono-tiny text-[11px] text-[var(--muted)]">0{idx + 1} / 04 · {detail?.eyebrow || ""}</div>
                        <h3 className="font-display text-3xl md:text-4xl text-navy leading-tight">{s.name}</h3>
                      </div>
                    </div>
                    <p className="text-[var(--muted)] leading-relaxed mb-5">{detail?.intro || s.desc}</p>

                    {detail?.included?.length > 0 && (
                      <ul className="space-y-2 mb-6">
                        {detail.included.slice(0, 4).map((item) => (
                          <li key={item} className="flex items-start gap-3">
                            <div className="w-5 h-5 bg-[var(--lime)] flex items-center justify-center shrink-0 mt-0.5">
                              <Check className="w-3.5 h-3.5 text-navy" strokeWidth={3} />
                            </div>
                            <span className="text-sm text-navy">{item}</span>
                          </li>
                        ))}
                      </ul>
                    )}

                    <div className="flex flex-wrap gap-3">
                      <Link to={`/book?service=${s.key}`} className="btn-amber gap-2 text-base" data-testid={`area-book-${s.key}`}>
                        <CalendarClock className="w-4 h-4" /> Book in {area.city}
                      </Link>
                      <Link to={`/services/${s.slug}`} className="btn-outline-navy gap-2 text-base">
                        Learn More <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>

                  {/* Image */}
                  <div className="relative aspect-[4/3] bg-navy border-4 border-navy overflow-hidden shadow-[10px_10px_0_var(--amber)]">
                    <img src={detail?.image || "/truck-rear.png"} alt={s.name} className="absolute inset-0 w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-[var(--navy)]/10" />
                    <div className="absolute bottom-3 left-3 right-3 font-display text-white text-xl leading-tight drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]">
                      {detail?.short || s.short || s.name}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* WHY US LOCALLY */}
      <section className="py-20 bg-cream" data-testid="area-why-section">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 grid lg:grid-cols-[1fr_1.4fr] gap-10 items-start">
          <div>
            <div className="eyebrow mb-3">WHY {area.city.toUpperCase()} CHOOSES CASTELLON</div>
            <h2 className="font-display text-3xl md:text-5xl text-navy">Local Crew. Local Standards. Local Pricing.</h2>
            <p className="text-[var(--muted)] leading-relaxed mt-5">
              We&apos;ve been pumping septic tanks across Eastern Washington long enough to know the local soil, the seasonal access challenges, and what {area.city} property owners actually need.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            {[
              { t: "Reaches You Fast", d: `From our Spokane HQ to ${area.city} is just ${area.driveTime}. Most emergency calls are on-site same-day.` },
              { t: "Single-Trip Truck", d: "Our 1,800-gallon vacuum truck handles most residential tanks in one trip — no return visits, no extra fees." },
              { t: "Licensed & Insured", d: "Full liability coverage. We carry it because you deserve it — not because we want a marketing line." },
              { t: "Honest Pricing", d: `No surprise fees, no inflated "remote area" charges for ${area.city}. We tell you the price up front.` },
              { t: "Real People Answer", d: "Call 509-655-6480 and a person picks up. No auto-attendants, no offshore call centers." },
              { t: "We Show Up", d: "Booked for Tuesday at 10? We're there at 10. The septic industry has a reputation for ghosting — we don't." },
            ].map((b) => (
              <div key={b.t} className="bg-white border-2 border-[var(--border-strong)] p-5">
                <div className="font-display text-xl text-navy mb-2">{b.t}</div>
                <p className="text-sm text-[var(--muted)] leading-relaxed">{b.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* NEIGHBORHOODS */}
      <section className="py-20 bg-white" data-testid="neighborhoods-section">
        <div className="max-w-5xl mx-auto px-6 lg:px-8 grid lg:grid-cols-[1fr_1.2fr] gap-12">
          <div>
            <div className="eyebrow mb-3">NEIGHBORHOODS &amp; AREAS</div>
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

      {/* EMERGENCY STRIP */}
      <section className="py-16 bg-white border-y-4 border-[var(--red)]" data-testid="area-emergency-section">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 grid lg:grid-cols-[1fr_auto] gap-8 items-center">
          <div>
            <div className="inline-flex items-center gap-2 text-[var(--red)] font-mono-tiny mb-3">
              <AlertTriangle className="w-4 h-4" strokeWidth={2.5} /> {area.city.toUpperCase()} EMERGENCY DISPATCH
            </div>
            <h2 className="font-display text-3xl md:text-5xl text-navy mb-3">Septic Backup In {area.city}? We Roll Same-Day.</h2>
            <p className="text-[var(--muted)] text-lg max-w-2xl">
              Sewage in the basement or standing water in the yard? Call now — most {area.city} emergencies are reached the same day.
            </p>
          </div>
          <a href={PHONE_HREF} className="btn-red gap-3 text-2xl md:text-3xl px-8 py-5" data-testid="area-emergency-call">
            <Phone className="w-6 h-6" strokeWidth={2.5} />
            CALL {PHONE}
          </a>
        </div>
      </section>

      {/* COST TIER (mini version) */}
      <section className="py-20 bg-cream relative overflow-hidden" data-testid="area-cost-section">
        <div className="absolute inset-0 topo-bg opacity-40" />
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
          <div className="max-w-3xl mb-8">
            <div className="eyebrow mb-3">DO THE MATH</div>
            <h2 className="font-display text-3xl md:text-5xl text-navy mb-3">Why {area.city} Homeowners Don&apos;t Skip Maintenance.</h2>
            <p className="text-[var(--muted)]">A pump-out every few years prevents a problem that costs 20× more to fix.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { tier: "01", title: "Routine Pump-Out", price: "What it costs", note: "Every 3–5 years", color: "navy" },
              { tier: "02", title: "Emergency Pump-Out", price: "2–3× the routine", note: "When you wait too long", color: "amber" },
              { tier: "03", title: "Drain Field Replacement", price: "$20K – $40K", note: "What it costs to ignore", color: "red" },
            ].map((c) => (
              <div
                key={c.tier}
                className={`bg-white border-2 p-5 ${c.color === "red" ? "border-[var(--red)]" : "border-[var(--border-strong)]"}`}
              >
                <div className="font-mono-tiny text-[10px] text-[var(--muted)] mb-2">TIER {c.tier}</div>
                <div className="font-display text-xl text-navy mb-1">{c.title}</div>
                <div className={`font-display text-3xl mb-1 ${c.color === "red" ? "text-[var(--red)]" : c.color === "amber" ? "text-[var(--amber)]" : "text-navy"}`}>
                  {c.price}
                </div>
                <div className="font-mono-tiny text-[10px] text-[var(--muted)]">{c.note.toUpperCase()}</div>
              </div>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <TrendingUp className="w-6 h-6 text-[var(--amber)]" strokeWidth={2} />
            <span className="text-navy font-display text-xl">Schedule preventative pumping in {area.city} →</span>
            <Link to="/book" className="btn-amber gap-2">
              <CalendarClock className="w-4 h-4" /> Book Now
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ — area-flavored */}
      <section className="py-20 bg-white" data-testid="area-faq-section">
        <div className="max-w-3xl mx-auto px-6 lg:px-8">
          <div className="mb-10">
            <div className="eyebrow mb-3" style={{ display: "inline-flex" }}>{area.city.toUpperCase()} — FAQ</div>
            <h2 className="font-display text-3xl md:text-5xl text-navy">Common Questions From {area.city} Homeowners.</h2>
          </div>
          <Accordion type="single" collapsible className="space-y-2">
            {[
              {
                q: `How fast can you get to ${area.city}?`,
                a: `Typical drive time from our Spokane HQ to ${area.display} is ${area.driveTime}. Standard service is booked within 24–72 hours; emergencies are dispatched same-day whenever truck availability allows.`,
              },
              {
                q: `Do you charge extra for service in ${area.city}?`,
                a: `No surprise "remote area" fees. ${area.display} is part of our standard 2-hour service radius and is priced at the same rate as Spokane proper.`,
              },
              {
                q: `What size septic tanks do you service in ${area.city}?`,
                a: `Our 1,800-gallon vacuum truck handles residential tanks from 500 to 2,000+ gallons in a single trip. Commercial tanks over 2,000 gallons may require a multi-trip plan — we'll quote that up front.`,
              },
              {
                q: `Do you take commercial accounts in ${area.city}?`,
                a: `Yes. Property managers, restaurants, apartment complexes, and industrial facilities in ${area.city} can set up recurring maintenance contracts. We bill on one invoice for portfolios.`,
              },
              {
                q: `How do I know when my ${area.city} septic tank needs pumping?`,
                a: `Most ${area.city} residential systems need pumping every 3–5 years. Warning signs: slow drains, gurgling pipes, lush green patches over the drain field, or any odors near the tank. When in doubt, call — we'll inspect and tell you straight.`,
              },
            ].map((f, idx) => (
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

      {/* OTHER AREAS CROSS-LINK */}
      <section className="py-16 bg-cream" data-testid="area-other-section">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-end justify-between flex-wrap gap-4 mb-8">
            <div>
              <div className="eyebrow mb-3">OTHER SERVICE AREAS</div>
              <h2 className="font-display text-3xl md:text-4xl text-navy">We Serve The Entire Region.</h2>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {otherAreas.map((a) => (
              <Link
                key={a.slug}
                to={`/areas/${a.slug}`}
                className="bg-white border-2 border-[var(--border-strong)] p-5 hover:border-navy hover:shadow-[6px_6px_0_var(--amber)] transition-all"
                data-testid={`other-area-${a.slug}`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="font-display text-xl text-navy">{a.display}</div>
                    <div className="font-mono-tiny text-[10px] text-[var(--muted)] mt-1">{a.driveTime.toUpperCase()} FROM HQ</div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-[var(--amber)]" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
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
