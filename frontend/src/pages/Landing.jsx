import { Link } from "react-router-dom";
import {
  Phone, Truck, Shield, HardHat, Gauge, MapPin, Clock, AlertTriangle, Wrench,
  Building2, Home, Utensils, Siren, CheckCircle2, Star, ArrowRight, TrendingUp, ShieldCheck,
} from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import FloatingCTAs from "@/components/FloatingCTAs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { PHONE, PHONE_HREF } from "@/lib/api";
import { SERVICE_LIST } from "@/data/services";
import { AREA_LIST } from "@/data/areas";

const HERO_IMG =
  "https://images.unsplash.com/photo-1757191462578-7c59fa85b016?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzMzJ8MHwxfHNlYXJjaHwzfHx2YWN1dW0lMjB0cnVjayUyMGluZHVzdHJpYWx8ZW58MHx8fHwxNzgxNjQ3NzAzfDA&ixlib=rb-4.1.0&q=85";
const COMMERCIAL_IMG =
  "https://images.unsplash.com/photo-1757191462487-6c6c0fe97edd?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzMzJ8MHwxfHNlYXJjaHwyfHx2YWN1dW0lMjB0cnVjayUyMGluZHVzdHJpYWx8ZW58MHx8fHwxNzgxNjQ3NzAzfDA&ixlib=rb-4.1.0&q=85";
const SAFETY_IMG =
  "https://images.unsplash.com/photo-1552879890-3a06dd3a06c2?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NTYxODh8MHwxfHNlYXJjaHwzfHxpbmR1c3RyaWFsJTIwd29ya2VyJTIwc2FmZXR5JTIwZ2VhcnxlbnwwfHx8fDE3ODE2NDc3MDN8MA&ixlib=rb-4.1.0&q=85";

const SERVICES = [
  { icon: Home, title: "Residential Septic Pumping", desc: "Rural homes, manufactured homes, farms, and properties outside city sewer. Preventative maintenance that avoids costly backups.", key: "residential" },
  { icon: Building2, title: "Commercial Septic Pumping", desc: "Apartments, hotels, warehouses, gas stations, and industrial facilities. Scheduled, reliable, professional.", key: "commercial" },
  { icon: Utensils, title: "Restaurant Grease Trap Cleaning", desc: "Stay compliant. Scheduled quarterly maintenance for restaurants, fast food, cafeterias, bars & kitchens.", key: "grease_trap" },
  { icon: Siren, title: "Emergency Pump-Out", desc: "Same-day emergency response across the region. Don't wait until a backup turns into a costly disaster.", key: "emergency" },
];

const REVIEWS = [
  { name: "Marcus T.", city: "Spokane Valley, WA", stars: 5, text: "Called Castellon on a Saturday morning with a septic backup. Truck was on-site by noon, job was done by 2pm. Honest pricing, no surprises. Already booked them for annual maintenance." },
  { name: "Janelle R.", city: "Coeur d'Alene, ID", stars: 5, text: "We run a small Mexican restaurant in CDA. Castellon handles our grease trap on a quarterly contract and they have never missed a date. Professional crew, clean job site every time." },
  { name: "Brian K.", city: "Cheney, WA", stars: 5, text: "Best septic service in the Spokane area, hands down. The 1,800-gallon truck handled our farm's tank in one trip — competitors needed two visits and charged for both." },
  { name: "Holly D.", city: "Post Falls, ID", stars: 5, text: "Property manager for 3 apartment complexes — Castellon is the only company we trust. They show up, they communicate, the price is fair." },
];

const FAQS = [
  { q: "How often should I pump my septic tank?", a: "Most residential septic tanks should be pumped every 3–5 years depending on household size, tank capacity, and usage. Restaurants and commercial properties typically need more frequent service. We provide a custom recommendation when we inspect your system." },
  { q: "How much does septic pumping cost?", a: "Pricing varies by tank size, location, and accessibility. Most residential pump-outs in the Spokane area fall in a competitive market range. Call 509-389-6138 or request a quote and we'll give you a transparent estimate — no hidden fees." },
  { q: "How often should restaurants clean grease traps?", a: "Most municipalities require grease trap cleaning every 30–90 days depending on size and volume. Failing to maintain a schedule can result in fines and code violations. We offer monthly maintenance contracts to keep you compliant." },
  { q: "Do you offer emergency service?", a: "Yes. We dispatch the same day for septic backups and emergency pump-outs throughout our 2-hour service radius. Call us directly at 509-389-6138 for fastest response." },
  { q: "What areas do you serve?", a: "We serve Eastern Washington and North Idaho within a 2-hour radius of Spokane — including Spokane Valley, Cheney, Airway Heights, Deer Park, Colville, Pullman, Coeur d'Alene, Post Falls, Hayden, Rathdrum, and Sandpoint." },
  { q: "How quickly can you respond?", a: "Standard service is typically booked within 24–72 hours. Emergency calls are dispatched the same day, often within hours, depending on truck availability and your location." },
];

// Service areas now live in @/data/areas.js (AREA_LIST)

export default function Landing() {
  return (
    <div className="relative bg-white text-navy" data-testid="landing-page">
      <SiteHeader />

      {/* HERO */}
      <section className="relative overflow-hidden" data-testid="hero-section">
        <div className="absolute inset-0">
          <img src={HERO_IMG} alt="Vacuum truck" className="w-full h-full object-cover" />
          <div className="hero-overlay" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 pt-12 pb-24 md:pt-20 md:pb-36">
          <div className="grid lg:grid-cols-[1.4fr_1fr] gap-10 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-[var(--red)] text-white px-3 py-1.5 mb-6 rise" data-testid="emergency-badge">
                <Siren className="w-4 h-4" strokeWidth={2.5} />
                <span className="font-display text-sm tracking-widest">24/7 EMERGENCY SERVICE AVAILABLE</span>
              </div>

              <div className="font-mono-tiny text-[11px] mb-3 text-[var(--muted)] rise">SPOKANE, WA · EST. SERVING EASTERN WA + N. IDAHO</div>

              <h1 className="font-display text-5xl sm:text-7xl lg:text-[5.5rem] text-navy max-w-4xl rise" data-testid="hero-headline">
                Professional Septic <span className="text-[var(--amber)]">&</span><br />
                Grease Pumping.<br />
                <span className="relative inline-block">
                  Done Right.
                  <span className="absolute left-0 -bottom-2 h-2 w-full bg-[var(--amber)] -z-10" aria-hidden />
                </span>
              </h1>

              <p className="mt-7 text-lg md:text-xl text-[var(--muted)] max-w-2xl rise rise-delay-1" data-testid="hero-subheadline">
                Serving residential and commercial customers across Eastern Washington and North Idaho with a
                1,800-gallon vacuum truck — and a crew that shows up on time.
              </p>

              <div className="mt-9 flex flex-wrap items-center gap-4 rise rise-delay-2">
                <a href={PHONE_HREF} className="btn-amber gap-2 text-xl md:text-2xl" data-testid="hero-call-btn">
                  <Phone className="w-5 h-5" strokeWidth={2.5} />
                  Call {PHONE}
                </a>
                <Link to="/quote" className="btn-outline-navy text-xl md:text-2xl" data-testid="hero-quote-btn">
                  Request Free Quote
                </Link>
                <Link to="/book" className="hidden sm:inline-flex items-center gap-1 font-display text-xl tracking-wider text-navy hover:gap-3 transition-all" data-testid="hero-book-btn">
                  Book Online <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>

            {/* Image card on right (desktop) */}
            <div className="hidden lg:block relative">
              <div className="relative aspect-[4/5] bg-navy border-4 border-navy overflow-hidden shadow-[12px_12px_0_var(--amber)]">
                <img src={HERO_IMG} alt="" className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0 bg-[var(--navy)]/30" />
                <div className="absolute top-4 left-4 right-4 flex items-start justify-between">
                  <div className="bg-white px-3 py-1 font-mono-tiny text-[10px] text-navy">UNIT 01 · 1800 GAL</div>
                  <div className="bg-[var(--amber)] px-3 py-1 font-mono-tiny text-[10px] text-navy">ON DUTY</div>
                </div>
                <div className="absolute bottom-4 left-4 right-4 font-display text-white text-3xl leading-none">
                  Heavy-Duty<br />Vacuum Truck
                </div>
              </div>
            </div>
          </div>

          {/* Stat row */}
          <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-3 max-w-4xl rise rise-delay-3" data-testid="hero-stats">
            {[
              { v: "1,800", l: "Gallon Truck Capacity" },
              { v: "2-HR", l: "Service Radius" },
              { v: "24/7", l: "Emergency Dispatch" },
              { v: "100%", l: "Licensed & Insured" },
            ].map((s) => (
              <div key={s.l} className="stat-card">
                <div className="font-display text-4xl md:text-5xl text-navy">{s.v}</div>
                <div className="font-mono-tiny text-[10px] text-[var(--muted)] mt-1">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TRUST BANNER */}
      <section className="bg-navy text-white" data-testid="trust-section">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { i: Shield, t: "Licensed & Insured" },
            { i: HardHat, t: "Professional Crew" },
            { i: Gauge, t: "1,800-Gal Vacuum Truck" },
            { i: MapPin, t: "Local · WA + N. Idaho" },
          ].map((b, idx) => (
            <div key={idx} className="flex items-center gap-3" data-testid={`trust-badge-${idx}`}>
              <div className="w-12 h-12 bg-[var(--amber)] flex items-center justify-center shrink-0">
                <b.i className="w-6 h-6 text-[var(--navy)]" strokeWidth={2.5} />
              </div>
              <span className="font-display text-lg md:text-xl tracking-wide">{b.t}</span>
            </div>
          ))}
        </div>
      </section>

      {/* SERVICES */}
      <section className="relative py-24 md:py-32 bg-white" data-testid="services-section">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-end justify-between flex-wrap gap-4 mb-12">
            <div>
              <div className="eyebrow mb-3">OUR SERVICES</div>
              <h2 className="font-display text-4xl md:text-6xl max-w-2xl text-navy">Heavy-Duty Pumping. Every Job. Every Time.</h2>
            </div>
            <p className="text-[var(--muted)] max-w-md">
              From rural homes to commercial kitchens — we have the truck, the crew, and the schedule to handle it.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {SERVICES.map((s, i) => {
              const slug = SERVICE_LIST.find((x) => x.key === s.key)?.slug || s.key;
              return (
                <Link
                  key={s.key}
                  to={`/services/${slug}`}
                  className="service-card p-6 lg:p-7 block"
                  data-testid={`service-card-${s.key}`}
                >
                  <div className="w-14 h-14 bg-[var(--cream)] border-2 border-[var(--border-strong)] flex items-center justify-center mb-5">
                    <s.icon className="w-7 h-7 text-[var(--navy)]" strokeWidth={2} />
                  </div>
                  <div className="font-mono-tiny text-[10px] text-[var(--muted)] mb-2">0{i + 1} / 04</div>
                  <h3 className="font-display text-2xl mb-3 leading-tight text-navy">{s.title}</h3>
                  <p className="text-sm text-[var(--muted)] leading-relaxed">{s.desc}</p>
                  <div
                    className="mt-5 inline-flex items-center gap-1 font-display text-base tracking-wider text-navy group-hover:text-[var(--amber)] transition-all"
                    data-testid={`service-cta-${s.key}`}
                  >
                    Learn More <ArrowRight className="w-4 h-4" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* SERVICE AREA */}
      <section className="bg-cream py-24" data-testid="service-area-section">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="eyebrow mb-3">SERVICE AREA</div>
            <h2 className="font-display text-4xl md:text-6xl mb-6 text-navy">2-Hour Rapid Response Radius</h2>
            <p className="text-[var(--muted)] leading-relaxed mb-8">
              Headquartered in Spokane, WA — we serve customers throughout Eastern Washington and North Idaho.
              If you&apos;re within a 2-hour drive, we can be there.
            </p>

            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white border-2 border-[var(--border-strong)] p-5">
                <div className="font-display text-2xl text-navy mb-3 border-b-2 border-[var(--amber)] pb-1 inline-block">WASHINGTON</div>
                <ul className="space-y-1.5 text-sm">
                  {AREA_LIST.filter((a) => a.state === "WA").map((a) => (
                    <li key={a.slug}>
                      <Link to={`/areas/${a.slug}`} className="flex items-center gap-2 text-navy hover:text-[var(--amber)] transition" data-testid={`area-link-${a.slug}`}>
                        <MapPin className="w-3.5 h-3.5 text-[var(--amber)]" />
                        {a.city}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-white border-2 border-[var(--border-strong)] p-5">
                <div className="font-display text-2xl text-navy mb-3 border-b-2 border-[var(--amber)] pb-1 inline-block">NORTH IDAHO</div>
                <ul className="space-y-1.5 text-sm">
                  {AREA_LIST.filter((a) => a.state === "ID").map((a) => (
                    <li key={a.slug}>
                      <Link to={`/areas/${a.slug}`} className="flex items-center gap-2 text-navy hover:text-[var(--amber)] transition" data-testid={`area-link-${a.slug}`}>
                        <MapPin className="w-3.5 h-3.5 text-[var(--amber)]" />
                        {a.city}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="relative aspect-[4/3] bg-white border-4 border-navy overflow-hidden">
            <div
              className="absolute inset-0 opacity-100"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(14,27,51,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(14,27,51,0.08) 1px, transparent 1px)",
                backgroundSize: "40px 40px",
              }}
            />
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] border-2 border-[var(--amber)]/40 rounded-full" />
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[55%] h-[55%] border-2 border-[var(--amber)]/70 rounded-full" />
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[30%] h-[30%] border-2 border-[var(--amber)] rounded-full" />
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 bg-[var(--navy)] rounded-full shadow-[0_0_0_4px_var(--amber)]" />
            <div className="absolute left-1/2 top-1/2 ml-5 mt-2 font-display text-lg text-navy">SPOKANE HQ</div>
            <div className="absolute bottom-4 left-4 right-4 font-mono-tiny text-[10px] text-navy">
              2-HOUR SERVICE RADIUS · EASTERN WA + N. IDAHO
            </div>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE */}
      <section className="py-24 bg-white" data-testid="why-section">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 grid lg:grid-cols-2 gap-12 items-center">
          <div className="relative">
            <img src={SAFETY_IMG} alt="Professional crew" className="w-full h-[460px] object-cover border-4 border-navy" />
            <div className="absolute -bottom-5 -right-5 bg-[var(--amber)] border-2 border-navy px-5 py-3 hidden md:block">
              <div className="font-display text-3xl text-navy leading-none">15+ YRS</div>
              <div className="font-mono-tiny text-[10px] text-navy">LOCAL EXPERIENCE</div>
            </div>
          </div>
          <div>
            <div className="eyebrow mb-3">WHY CHOOSE US</div>
            <h2 className="font-display text-4xl md:text-5xl mb-6 text-navy">Built To Out-Work The Competition.</h2>
            <p className="text-[var(--muted)] mb-8">
              Most septic services run small trucks and tight schedules. We run a 1,800-gallon vacuum truck and
              keep slots open for emergency response — so when you call, we answer.
            </p>
            <ul className="grid sm:grid-cols-2 gap-y-4 gap-x-6">
              {[
                "1,800 Gallon Vacuum Truck",
                "Same-Day Emergency Dispatch",
                "Honest, Up-Front Pricing",
                "Residential & Commercial",
                "Recurring Maintenance Plans",
                "Licensed, Insured, Local",
              ].map((b) => (
                <li key={b} className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-[var(--amber)] flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4 text-[var(--navy)]" strokeWidth={3} />
                  </div>
                  <span className="text-navy font-medium">{b}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* THE REAL COST — original framing, education over fear */}
      <section className="py-24 bg-cream relative overflow-hidden" data-testid="real-cost-section">
        <div className="absolute inset-0 topo-bg opacity-50" />
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
          <div className="max-w-3xl mb-12">
            <div className="eyebrow mb-3">DO THE MATH</div>
            <h2 className="font-display text-4xl md:text-6xl text-navy mb-5">Routine Pumping Isn&apos;t An Expense. It&apos;s Insurance.</h2>
            <p className="text-[var(--muted)] leading-relaxed text-lg">
              Most homeowners think of septic pumping as a cost. They&apos;re looking at it wrong. Here&apos;s what skipping it actually adds up to in Spokane County.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {[
              {
                tier: "01",
                title: "Routine Pump-Out",
                price: "What it costs",
                note: "Every 3–5 years",
                color: "navy",
                desc: "A scheduled pump-out from Castellon is the cheapest thing you'll ever do to your septic system. We pump it, inspect baffles, and you go another few years without thinking about it.",
              },
              {
                tier: "02",
                title: "Emergency Pump-Out",
                price: "2–3× the routine",
                note: "When you wait too long",
                color: "amber",
                desc: "Backup in the basement. Standing water in the yard. Caught early enough, an emergency pump-out solves the immediate problem — but it costs significantly more than scheduled service.",
              },
              {
                tier: "03",
                title: "Drain Field Replacement",
                price: "$20,000 – $40,000",
                note: "What it costs to ignore the problem",
                color: "red",
                desc: "Once sludge overflows the tank and saturates your drain field, the soil is contaminated. The fix isn't pumping — it's installing a brand new drain field. Heavy equipment, permits, weeks of disruption.",
              },
            ].map((card) => (
              <div
                key={card.tier}
                className={`relative bg-white border-2 p-7 ${card.color === "red" ? "border-[var(--red)]" : "border-[var(--border-strong)]"}`}
                data-testid={`cost-card-${card.tier}`}
              >
                <div className="font-mono-tiny text-[11px] text-[var(--muted)] mb-3">TIER {card.tier}</div>
                <div className="font-display text-2xl text-navy mb-2">{card.title}</div>
                <div className={`font-display text-4xl md:text-5xl mb-1 ${card.color === "red" ? "text-[var(--red)]" : card.color === "amber" ? "text-[var(--amber)]" : "text-navy"}`}>
                  {card.price}
                </div>
                <div className="font-mono-tiny text-[10px] text-[var(--muted)] mb-4">{card.note.toUpperCase()}</div>
                <p className="text-sm text-[var(--muted)] leading-relaxed">{card.desc}</p>
                {card.color === "red" && (
                  <div className="absolute -top-3 -right-3 bg-[var(--red)] text-white px-3 py-1 font-mono-tiny text-[10px]">DON&apos;T LET IT GET HERE</div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-10 border-l-4 border-[var(--amber)] bg-white pl-6 pr-5 py-5 max-w-3xl flex items-center gap-4" data-testid="cost-callout">
            <TrendingUp className="w-8 h-8 text-[var(--amber)] shrink-0" strokeWidth={2} />
            <div>
              <div className="font-display text-xl text-navy">The math is simple.</div>
              <div className="text-sm text-[var(--muted)] mt-0.5">A pump-out every few years is the cheapest insurance policy you&apos;ll ever buy. Castellon makes it easy — book a slot online and stay ahead of it.</div>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link to="/book" className="btn-amber gap-2" data-testid="cost-book-btn">
              <ShieldCheck className="w-4 h-4" /> Schedule Preventative Service
            </Link>
            <a href={PHONE_HREF} className="btn-outline-navy gap-2">
              <Phone className="w-4 h-4" /> Talk To A Real Person
            </a>
          </div>
        </div>
      </section>

      {/* COMMERCIAL CONTRACTS */}
      <section className="relative bg-navy text-white py-24 overflow-hidden" data-testid="commercial-section">
        <div className="absolute inset-0 opacity-25">
          <img src={COMMERCIAL_IMG} alt="" className="w-full h-full object-cover" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--navy)] via-[var(--navy)]/85 to-transparent" />
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="eyebrow on-dark mb-3">FOR PROPERTY MANAGERS &amp; RESTAURANTS</div>
            <h2 className="font-display text-4xl md:text-6xl mb-6">Scheduled Maintenance Contracts Available</h2>
            <p className="text-white/80 mb-8 text-lg leading-relaxed">
              Skip the panic call. Lock in a monthly or quarterly service schedule for your restaurant grease trap, apartment
              complex, RV park, or commercial facility. Predictable pricing, automatic scheduling, full compliance.
            </p>
            <div className="grid sm:grid-cols-3 gap-4 mb-8">
              {[
                { i: Utensils, t: "Restaurants & Kitchens" },
                { i: Building2, t: "Apartment Complexes" },
                { i: Truck, t: "RV Parks & Industrial" },
              ].map((b, idx) => (
                <div key={idx} className="border-2 border-white/20 bg-white/5 backdrop-blur-sm p-5">
                  <b.i className="w-6 h-6 text-[var(--amber)] mb-3" strokeWidth={2} />
                  <div className="font-display text-lg leading-tight">{b.t}</div>
                </div>
              ))}
            </div>
            <Link to="/quote?type=contract" className="btn-amber gap-2" data-testid="commercial-quote-btn">
              <Wrench className="w-4 h-4" strokeWidth={2.5} /> Get a Contract Quote
            </Link>
          </div>
        </div>
      </section>

      {/* EMERGENCY */}
      <section
        className="py-20 relative overflow-hidden bg-white border-y-4 border-[var(--red)]"
        data-testid="emergency-section"
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8 grid lg:grid-cols-[1fr_auto] gap-8 items-center">
          <div>
            <div className="inline-flex items-center gap-2 text-[var(--red)] font-mono-tiny mb-3">
              <AlertTriangle className="w-4 h-4" strokeWidth={2.5} /> EMERGENCY SERVICE
            </div>
            <h2 className="font-display text-4xl md:text-6xl mb-4 text-navy">Septic Emergency? We Dispatch Fast.</h2>
            <p className="text-[var(--muted)] max-w-2xl text-lg">
              Don&apos;t wait until a backup becomes a costly disaster. Call now and we&apos;ll get a truck rolling.
            </p>
          </div>
          <a href={PHONE_HREF} className="btn-red gap-3 text-2xl md:text-3xl px-8 py-5" data-testid="emergency-call-btn">
            <Phone className="w-6 h-6" strokeWidth={2.5} />
            CALL {PHONE}
          </a>
        </div>
      </section>

      {/* REVIEWS */}
      <section className="py-24 bg-cream" data-testid="reviews-section">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="eyebrow mb-3 justify-center" style={{ display: "inline-flex" }}>FROM OUR CUSTOMERS</div>
            <h2 className="font-display text-4xl md:text-6xl text-navy">What People Say</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-5">
            {REVIEWS.map((r, idx) => (
              <div key={idx} className="border-2 border-[var(--border-strong)] bg-white p-7 relative" data-testid={`review-${idx}`}>
                <div className="absolute -top-3 left-6 bg-[var(--amber)] px-3 py-0.5 font-mono-tiny text-[10px] text-navy">VERIFIED CUSTOMER</div>
                <div className="flex gap-1 mb-3 mt-1">
                  {Array.from({ length: r.stars }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[var(--amber)] text-[var(--amber)]" />
                  ))}
                </div>
                <p className="text-navy leading-relaxed mb-4">&ldquo;{r.text}&rdquo;</p>
                <div className="font-display text-lg text-navy">{r.name}</div>
                <div className="font-mono-tiny text-[10px] text-[var(--muted)]">{r.city}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-white py-24" data-testid="faq-section">
        <div className="max-w-3xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-10">
            <div className="eyebrow mb-3" style={{ display: "inline-flex" }}>FAQ</div>
            <h2 className="font-display text-4xl md:text-5xl text-navy">Frequently Asked Questions</h2>
          </div>
          <Accordion type="single" collapsible className="space-y-2" data-testid="faq-accordion">
            {FAQS.map((f, idx) => (
              <AccordionItem key={idx} value={`item-${idx}`} className="border-2 border-[var(--border-strong)] bg-white px-5">
                <AccordionTrigger className="font-display text-lg md:text-xl tracking-wide text-left text-navy hover:text-[var(--amber)]" data-testid={`faq-trigger-${idx}`}>
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="text-[var(--muted)] leading-relaxed">{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-28 relative overflow-hidden bg-navy text-white" data-testid="final-cta-section">
        <div className="absolute inset-0">
          <img src={HERO_IMG} alt="" className="w-full h-full object-cover opacity-15" />
          <div className="absolute inset-0 bg-gradient-to-b from-[var(--navy)] via-transparent to-[var(--navy)]" />
        </div>
        <div className="relative max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 text-[var(--amber)] font-mono-tiny mb-3">
            <Clock className="w-4 h-4" strokeWidth={2.5} /> READY WHEN YOU ARE
          </div>
          <h2 className="font-display text-5xl md:text-7xl mb-6">Need Professional Pumping Service?</h2>
          <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
            Call now or book online. Whether it&apos;s an emergency or routine maintenance, the Castellon team is ready.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a href={PHONE_HREF} className="btn-amber gap-2 text-2xl md:text-3xl" data-testid="final-call-btn">
              <Phone className="w-6 h-6" strokeWidth={2.5} /> Call {PHONE}
            </a>
            <Link to="/book" className="inline-flex items-center bg-transparent border-2 border-white text-white font-display uppercase tracking-wider px-6 py-3 text-2xl md:text-3xl hover:bg-white hover:text-[var(--navy)] transition" data-testid="final-book-btn">
              Book Online
            </Link>
            <Link to="/quote" className="inline-flex items-center bg-transparent border-2 border-white/30 text-white/80 font-display uppercase tracking-wider px-6 py-3 text-2xl md:text-3xl hover:bg-white hover:text-[var(--navy)] hover:border-white transition" data-testid="final-quote-btn">
              Request Quote
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />
      <FloatingCTAs />
    </div>
  );
}
