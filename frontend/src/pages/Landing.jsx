import { Link } from "react-router-dom";
import {
  Phone, Truck, Shield, HardHat, Gauge, MapPin, Clock, AlertTriangle, Wrench,
  Building2, Home, Utensils, Siren, CheckCircle2, Star,
} from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import FloatingCTAs from "@/components/FloatingCTAs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { PHONE, PHONE_HREF, COMPANY } from "@/lib/api";

const HERO_IMG =
  "https://images.unsplash.com/photo-1757191462578-7c59fa85b016?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzMzJ8MHwxfHNlYXJjaHwzfHx2YWN1dW0lMjB0cnVjayUyMGluZHVzdHJpYWx8ZW58MHx8fHwxNzgxNjQ3NzAzfDA&ixlib=rb-4.1.0&q=85";
const COMMERCIAL_IMG =
  "https://images.unsplash.com/photo-1757191462487-6c6c0fe97edd?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzMzJ8MHwxfHNlYXJjaHwyfHx2YWN1dW0lMjB0cnVjayUyMGluZHVzdHJpYWx8ZW58MHx8fHwxNzgxNjQ3NzAzfDA&ixlib=rb-4.1.0&q=85";
const SAFETY_IMG =
  "https://images.unsplash.com/photo-1552879890-3a06dd3a06c2?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NTYxODh8MHwxfHNlYXJjaHwzfHxpbmR1c3RyaWFsJTIwd29ya2VyJTIwc2FmZXR5JTIwZ2VhcnxlbnwwfHx8fDE3ODE2NDc3MDN8MA&ixlib=rb-4.1.0&q=85";

const SERVICES = [
  { icon: Home, title: "Residential Septic Pumping", desc: "Rural homes, manufactured homes, farms, and properties outside city sewer. Preventative maintenance that avoids costly backups.", key: "residential" },
  { icon: Building2, title: "Commercial Septic Pumping", desc: "Apartments, hotels, warehouses, gas stations, and industrial facilities. Scheduled, reliable, professional.", key: "commercial" },
  { icon: Utensils, title: "Restaurant Grease Trap Cleaning", desc: "Stay compliant. Recurring monthly maintenance for restaurants, fast food, cafeterias, bars & kitchens.", key: "grease_trap" },
  { icon: Siren, title: "Emergency Pump-Out", desc: "Same-day emergency response across the region. Don't wait until backup turns into a costly disaster.", key: "emergency" },
];

const REVIEWS = [
  { name: "Marcus T.", city: "Spokane Valley, WA", stars: 5, text: "Called Catellon on a Saturday morning with a septic backup. Truck was on-site by noon, job was done by 2pm. Honest pricing, no surprises. Already booked them for annual maintenance." },
  { name: "Janelle R.", city: "Coeur d'Alene, ID", stars: 5, text: "We run a small Mexican restaurant in CDA. Catellon handles our grease trap on a monthly contract and they have never missed a date. Professional crew, clean job site every time." },
  { name: "Brian K.", city: "Cheney, WA", stars: 5, text: "Best septic service in the Spokane area, hands down. The 1800-gallon truck handled our farm's tank in one trip — competitors needed two visits and charged for both." },
  { name: "Holly D.", city: "Post Falls, ID", stars: 5, text: "Property manager for 3 apartment complexes — Catellon is the only company we trust. They show up, they communicate, the price is fair." },
];

const FAQS = [
  { q: "How often should I pump my septic tank?", a: "Most residential septic tanks should be pumped every 3–5 years depending on household size, tank capacity, and usage. Restaurants and commercial properties typically need more frequent service. We provide a custom recommendation when we inspect your system." },
  { q: "How much does septic pumping cost?", a: "Pricing varies by tank size, location, and accessibility. Most residential pump-outs in the Spokane area fall in a competitive market range. Call 509-389-6138 or request a quote and we'll give you a transparent estimate — no hidden fees." },
  { q: "How often should restaurants clean grease traps?", a: "Most municipalities require grease trap cleaning every 30–90 days depending on size and volume. Failing to maintain a schedule can result in fines and code violations. We offer monthly maintenance contracts to keep you compliant." },
  { q: "Do you offer emergency service?", a: "Yes. We dispatch the same day for septic backups and emergency pump-outs throughout our 2-hour service radius. Call us directly at 509-389-6138 for fastest response." },
  { q: "What areas do you serve?", a: "We serve Eastern Washington and North Idaho within a 2-hour radius of Spokane — including Spokane Valley, Cheney, Airway Heights, Deer Park, Colville, Pullman, Coeur d'Alene, Post Falls, Hayden, Rathdrum, and Sandpoint." },
  { q: "How quickly can you respond?", a: "Standard service is typically booked within 24–72 hours. Emergency calls are dispatched the same day, often within hours, depending on truck availability and your location." },
];

const SERVICE_AREAS = {
  WA: ["Spokane", "Spokane Valley", "Cheney", "Airway Heights", "Deer Park", "Colville", "Pullman"],
  ID: ["Coeur d'Alene", "Post Falls", "Hayden", "Rathdrum", "Sandpoint"],
};

export default function Landing() {
  return (
    <div className="relative" data-testid="landing-page">
      <SiteHeader />

      {/* HERO */}
      <section className="relative overflow-hidden" data-testid="hero-section">
        <div className="absolute inset-0">
          <img src={HERO_IMG} alt="Vacuum truck" className="w-full h-full object-cover opacity-40" />
          <div className="absolute inset-0 bg-gradient-to-r from-[var(--bg)] via-[rgba(5,11,20,0.85)] to-[rgba(5,11,20,0.4)]" />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg)] to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 pt-14 pb-32 md:pt-24 md:pb-44">
          <div className="inline-flex items-center gap-2 bg-[var(--red)] text-white px-3 py-1.5 mb-8 rise" data-testid="emergency-badge">
            <Siren className="w-4 h-4" strokeWidth={2.5} />
            <span className="font-display text-sm tracking-widest">24/7 EMERGENCY SERVICE AVAILABLE</span>
          </div>

          <h1 className="font-display text-5xl sm:text-7xl lg:text-8xl text-white max-w-4xl rise" data-testid="hero-headline">
            Professional Septic <span className="text-[var(--amber)]">&</span><br />
            Grease Pumping<br />
            <span className="text-[var(--amber)]">Done Right.</span>
          </h1>

          <p className="mt-6 text-lg md:text-xl text-muted-foreground-2 max-w-2xl rise rise-delay-1" data-testid="hero-subheadline">
            Serving residential and commercial customers across Eastern Washington and North Idaho with a
            1800-gallon vacuum truck and a crew that shows up on time.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4 rise rise-delay-2">
            <a href={PHONE_HREF} className="btn-amber inline-flex items-center gap-2 text-xl md:text-2xl" data-testid="hero-call-btn">
              <Phone className="w-5 h-5" strokeWidth={2.5} />
              Call {PHONE}
            </a>
            <Link to="/quote" className="btn-outline-steel text-xl md:text-2xl" data-testid="hero-quote-btn">
              Request Free Quote
            </Link>
            <Link to="/book" className="btn-outline-steel text-xl md:text-2xl" data-testid="hero-book-btn">
              Book Online
            </Link>
          </div>

          {/* Stat row */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl rise rise-delay-3" data-testid="hero-stats">
            {[
              { v: "1,800", l: "Gallon Truck Capacity" },
              { v: "2-HR", l: "Service Radius" },
              { v: "24/7", l: "Emergency Dispatch" },
              { v: "100%", l: "Licensed & Insured" },
            ].map((s) => (
              <div key={s.l} className="border-l-2 border-[var(--amber)] pl-4">
                <div className="font-display text-4xl md:text-5xl text-white">{s.v}</div>
                <div className="text-xs uppercase tracking-widest text-muted-foreground-2 mt-1">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TRUST BANNER */}
      <section className="bg-surface border-y border-heavy" data-testid="trust-section">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { i: Shield, t: "Licensed & Insured" },
            { i: HardHat, t: "Professional Crew" },
            { i: Gauge, t: "1800-Gal Vacuum Truck" },
            { i: MapPin, t: "Local · WA + N. Idaho" },
          ].map((b, idx) => (
            <div key={idx} className="flex items-center gap-3" data-testid={`trust-badge-${idx}`}>
              <div className="w-12 h-12 bg-[var(--bg)] border border-heavy flex items-center justify-center shrink-0">
                <b.i className="w-6 h-6 text-[var(--amber)]" strokeWidth={2} />
              </div>
              <span className="font-display text-lg md:text-xl tracking-wide">{b.t}</span>
            </div>
          ))}
        </div>
      </section>

      {/* SERVICES */}
      <section className="relative py-24 md:py-32" data-testid="services-section">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-end justify-between flex-wrap gap-4 mb-12">
            <div>
              <div className="text-[var(--amber)] font-display text-sm tracking-[0.3em] mb-2">— OUR SERVICES</div>
              <h2 className="font-display text-4xl md:text-6xl max-w-2xl">Heavy-Duty Pumping. Every Job. Every Time.</h2>
            </div>
            <p className="text-muted-foreground-2 max-w-md">
              From rural homes to commercial kitchens — we have the truck, the crew, and the schedule to handle it.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {SERVICES.map((s, i) => (
              <div key={s.key} className="service-card p-6 lg:p-7" data-testid={`service-card-${s.key}`}>
                <div className="w-14 h-14 bg-[var(--bg)] border border-heavy flex items-center justify-center mb-5">
                  <s.icon className="w-7 h-7 text-[var(--amber)]" strokeWidth={2} />
                </div>
                <div className="text-xs text-muted-foreground-2 uppercase tracking-widest mb-2">0{i + 1}</div>
                <h3 className="font-display text-2xl mb-3 leading-tight">{s.title}</h3>
                <p className="text-sm text-muted-foreground-2 leading-relaxed">{s.desc}</p>
                <Link
                  to={`/book?service=${s.key}`}
                  className="mt-5 inline-flex items-center gap-1 font-display text-base tracking-wider text-[var(--amber)] hover:gap-3 transition-all"
                  data-testid={`service-cta-${s.key}`}
                >
                  Book This Service →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICE AREA */}
      <section className="bg-surface border-y border-heavy py-24" data-testid="service-area-section">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="text-[var(--amber)] font-display text-sm tracking-[0.3em] mb-2">— SERVICE AREA</div>
            <h2 className="font-display text-4xl md:text-6xl mb-6">2-Hour Rapid Response Radius</h2>
            <p className="text-muted-foreground-2 leading-relaxed mb-8">
              Headquartered in Spokane, WA — we serve customers throughout Eastern Washington and North Idaho.
              If you're within a 2-hour drive, we can be there.
            </p>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <div className="font-display text-2xl text-[var(--amber)] mb-3">WASHINGTON</div>
                <ul className="space-y-1.5 text-sm">
                  {SERVICE_AREAS.WA.map((c) => (
                    <li key={c} className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-muted-foreground-2" />
                      {c}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <div className="font-display text-2xl text-[var(--amber)] mb-3">NORTH IDAHO</div>
                <ul className="space-y-1.5 text-sm">
                  {SERVICE_AREAS.ID.map((c) => (
                    <li key={c} className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-muted-foreground-2" />
                      {c}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="relative aspect-[4/3] bg-[var(--bg)] border border-heavy overflow-hidden">
            {/* Map-like graphic */}
            <div
              className="absolute inset-0 opacity-40"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(255,184,0,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,184,0,0.08) 1px, transparent 1px)",
                backgroundSize: "40px 40px",
              }}
            />
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] border border-[var(--amber)] rounded-full opacity-30" />
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[55%] h-[55%] border border-[var(--amber)] rounded-full opacity-50" />
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[30%] h-[30%] border-2 border-[var(--amber)] rounded-full" />
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-[var(--amber)] rounded-full shadow-[0_0_24px_rgba(255,184,0,0.7)]" />
            <div className="absolute left-1/2 top-1/2 ml-3 mt-1 font-display text-lg text-[var(--amber)]">SPOKANE</div>
            <div className="absolute bottom-4 left-4 right-4 font-display text-xs text-muted-foreground-2 tracking-widest">
              ★ 2-HOUR SERVICE RADIUS · EASTERN WA + N. IDAHO
            </div>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE */}
      <section className="py-24" data-testid="why-section">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <img src={SAFETY_IMG} alt="Professional crew" className="w-full h-[420px] object-cover border border-heavy" />
          </div>
          <div>
            <div className="text-[var(--amber)] font-display text-sm tracking-[0.3em] mb-2">— WHY CHOOSE US</div>
            <h2 className="font-display text-4xl md:text-5xl mb-6">Built To Out-Work The Competition.</h2>
            <p className="text-muted-foreground-2 mb-8">
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
                  <CheckCircle2 className="w-5 h-5 text-[var(--amber)] mt-0.5 shrink-0" strokeWidth={2.5} />
                  <span className="font-body">{b}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* COMMERCIAL CONTRACTS */}
      <section className="relative bg-surface border-y border-heavy py-24 overflow-hidden" data-testid="commercial-section">
        <div className="absolute inset-0 opacity-20">
          <img src={COMMERCIAL_IMG} alt="" className="w-full h-full object-cover" />
        </div>
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="text-[var(--amber)] font-display text-sm tracking-[0.3em] mb-2">— FOR PROPERTY MANAGERS & RESTAURANTS</div>
            <h2 className="font-display text-4xl md:text-6xl mb-6">Scheduled Maintenance Contracts Available</h2>
            <p className="text-muted-foreground-2 mb-8 text-lg leading-relaxed">
              Skip the panic call. Lock in a monthly or quarterly service schedule for your restaurant grease trap, apartment
              complex, RV park, or commercial facility. Predictable pricing, automatic scheduling, full compliance.
            </p>
            <div className="grid sm:grid-cols-3 gap-4 mb-8">
              {[
                { i: Utensils, t: "Restaurants & Commercial Kitchens" },
                { i: Building2, t: "Apartment Complexes" },
                { i: Truck, t: "RV Parks & Industrial Sites" },
              ].map((b, idx) => (
                <div key={idx} className="border border-heavy bg-[var(--bg)] p-5">
                  <b.i className="w-6 h-6 text-[var(--amber)] mb-3" strokeWidth={2} />
                  <div className="font-display text-lg leading-tight">{b.t}</div>
                </div>
              ))}
            </div>
            <Link to="/quote?type=contract" className="btn-amber inline-flex items-center gap-2" data-testid="commercial-quote-btn">
              <Wrench className="w-4 h-4" strokeWidth={2.5} /> Get a Contract Quote
            </Link>
          </div>
        </div>
      </section>

      {/* EMERGENCY */}
      <section
        className="py-20 relative overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, rgba(239,68,68,0.15) 0%, var(--bg) 60%), var(--bg)",
        }}
        data-testid="emergency-section"
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8 grid lg:grid-cols-[1fr_auto] gap-8 items-center">
          <div>
            <div className="inline-flex items-center gap-2 text-[var(--red)] font-display text-sm tracking-[0.3em] mb-3">
              <AlertTriangle className="w-4 h-4" strokeWidth={2.5} /> EMERGENCY SERVICE
            </div>
            <h2 className="font-display text-4xl md:text-6xl mb-4">Septic Emergency? We Dispatch Fast.</h2>
            <p className="text-muted-foreground-2 max-w-2xl text-lg">
              Don't wait until a backup becomes a costly disaster. Call now and we'll get a truck rolling.
            </p>
          </div>
          <a href={PHONE_HREF} className="btn-red inline-flex items-center gap-3 text-2xl md:text-3xl px-8 py-5" data-testid="emergency-call-btn">
            <Phone className="w-6 h-6" strokeWidth={2.5} />
            CALL {PHONE}
          </a>
        </div>
      </section>

      {/* REVIEWS */}
      <section className="py-24" data-testid="reviews-section">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="text-[var(--amber)] font-display text-sm tracking-[0.3em] mb-2">— FROM OUR CUSTOMERS</div>
            <h2 className="font-display text-4xl md:text-6xl">What People Say</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-5">
            {REVIEWS.map((r, idx) => (
              <div key={idx} className="border border-heavy bg-surface p-7" data-testid={`review-${idx}`}>
                <div className="flex gap-1 mb-3">
                  {Array.from({ length: r.stars }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[var(--amber)] text-[var(--amber)]" />
                  ))}
                </div>
                <p className="text-muted-foreground-2 leading-relaxed mb-4">"{r.text}"</p>
                <div className="font-display text-lg">{r.name}</div>
                <div className="text-xs uppercase tracking-widest text-muted-foreground-2">{r.city}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-surface border-y border-heavy py-24" data-testid="faq-section">
        <div className="max-w-3xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-10">
            <div className="text-[var(--amber)] font-display text-sm tracking-[0.3em] mb-2">— FAQ</div>
            <h2 className="font-display text-4xl md:text-5xl">Frequently Asked Questions</h2>
          </div>
          <Accordion type="single" collapsible className="space-y-2" data-testid="faq-accordion">
            {FAQS.map((f, idx) => (
              <AccordionItem key={idx} value={`item-${idx}`} className="border border-heavy bg-[var(--bg)] px-5">
                <AccordionTrigger className="font-display text-lg md:text-xl tracking-wide text-left hover:text-[var(--amber)]" data-testid={`faq-trigger-${idx}`}>
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground-2 leading-relaxed">{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-28 relative overflow-hidden" data-testid="final-cta-section">
        <div className="absolute inset-0">
          <img src={HERO_IMG} alt="" className="w-full h-full object-cover opacity-20" />
          <div className="absolute inset-0 bg-gradient-to-b from-[var(--bg)] via-transparent to-[var(--bg)]" />
        </div>
        <div className="relative max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 text-[var(--amber)] font-display text-sm tracking-[0.3em] mb-3">
            <Clock className="w-4 h-4" strokeWidth={2.5} /> READY WHEN YOU ARE
          </div>
          <h2 className="font-display text-5xl md:text-7xl mb-6">Need Professional Pumping Service?</h2>
          <p className="text-muted-foreground-2 text-lg mb-8 max-w-2xl mx-auto">
            Call now or book online. Whether it's an emergency or routine maintenance, the Catellon team is ready.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a href={PHONE_HREF} className="btn-amber inline-flex items-center gap-2 text-2xl md:text-3xl" data-testid="final-call-btn">
              <Phone className="w-6 h-6" strokeWidth={2.5} /> Call {PHONE}
            </a>
            <Link to="/book" className="btn-outline-steel text-2xl md:text-3xl" data-testid="final-book-btn">
              Book Online
            </Link>
            <Link to="/quote" className="btn-outline-steel text-2xl md:text-3xl" data-testid="final-quote-btn">
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
