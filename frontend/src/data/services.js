// Long-form data for individual service detail pages
// Each service has a slug, hero, included items, when-needed copy, process steps, FAQ
import { Home, Building2, Utensils, Siren } from "lucide-react";

export const SERVICE_PAGES = {
  residential: {
    slug: "residential-septic",
    key: "residential",
    name: "Residential Septic Pumping",
    short: "Residential Septic",
    icon: Home,
    eyebrow: "FOR HOMEOWNERS & RURAL PROPERTIES",
    headline: "Reliable Septic Pumping For Homes Across Eastern Washington",
    intro:
      "If your home runs on a septic system instead of city sewer, regular pumping isn't optional — it's the single best thing you can do to protect your drain field and your wallet. Our 1,800-gallon vacuum truck handles standard residential tanks (1,000–2,000 gal) in a single trip, no second visit needed.",
    image: "/rural-home.jpg",
    included: [
      "Full tank pump-out (down to the bottom solids layer)",
      "Sludge & scum layer measurement",
      "Visual inspection of inlet & outlet baffles",
      "Effluent filter cleaning (when accessible)",
      "Lid replacement & site cleanup",
      "Written record of service for your files",
    ],
    whenNeeded:
      "Most rural homes need pumping every 3–5 years, depending on tank size and household usage. Larger households, garbage disposals, or smaller tanks (under 1,000 gal) typically need service every 2–3 years. If you notice slow drains, gurgling pipes, lush patches over the drain field, or odors near the tank, do not wait — call us right away.",
    steps: [
      { t: "Schedule online or by phone", d: "Pick a time slot on our calendar or call (509) 655-6480 for same-week service." },
      { t: "We arrive on time", d: "Truck pulls up, we locate lids (we can dig small access points), and protect your landscaping with mats and runners." },
      { t: "Pump & inspect", d: "Full pump-out with our 1,800-gal vacuum, plus baffle/filter check and sludge measurement." },
      { t: "Site clean & report", d: "Lids reseated, area cleaned, written service record handed off. You're done." },
    ],
    faqs: [
      { q: "How long does a residential pump-out take?", a: "Typical 1,000–1,500 gallon residential tank takes 45–75 minutes from arrival to cleanup." },
      { q: "Do I need to be home?", a: "Not necessarily. As long as the lids are accessible (or we know where they are) and payment is arranged, we can service the tank while you're away." },
      { q: "Will you damage my lawn?", a: "We use turf-friendly hoses and runners. Our truck stays on driveways or accessible paths whenever possible. If we must cross grass, we minimize impact." },
    ],
    related: ["commercial", "emergency"],
  },

  commercial: {
    slug: "commercial-septic",
    key: "commercial",
    name: "Commercial Septic Pumping",
    short: "Commercial Septic",
    icon: Building2,
    eyebrow: "FOR PROPERTY MANAGERS & BUSINESSES",
    headline: "Professional Commercial Septic Service Built For Volume.",
    intro:
      "Apartment complexes, hotels, gas stations, warehouses, and industrial facilities all share one thing: a septic backup at your property is a business interruption you cannot afford. Castellon runs a scheduled commercial program designed around your operating hours, with reliable pumping that keeps systems healthy and tenants happy.",
    image: "/apartments.jpg",
    included: [
      "Pumping for tanks 1,000–3,000+ gallons (multi-trip if needed)",
      "After-hours & weekend scheduling for low-impact service",
      "Recurring service contracts with locked-in pricing",
      "Detailed service records for property management files",
      "Coordination with property managers, on-site maintenance, or tenants",
      "Multi-unit pricing for portfolios across the Spokane / CDA area",
    ],
    whenNeeded:
      "Commercial systems should be evaluated annually and pumped on a recurring schedule that matches your usage. High-occupancy properties (apartments, hotels) often need pumping every 1–2 years. Industrial sites vary widely. We assess your tank and recommend an interval that prevents emergencies, not one that pads our invoices.",
    steps: [
      { t: "On-site assessment", d: "We visit, locate tanks, check sizing, review usage, and quote a recurring service plan." },
      { t: "Recurring schedule", d: "Lock in dates that work for your operations — weekends, off-hours, low-traffic windows. You get reminders automatically." },
      { t: "Pump & document", d: "Full service every visit. Detailed reports filed for your maintenance records." },
      { t: "On-call backup", d: "Existing customers get priority emergency dispatch if anything ever goes wrong between visits." },
    ],
    faqs: [
      { q: "Do you handle multi-unit properties?", a: "Yes. Apartment complexes, mixed-use buildings, and multi-building campuses are some of our most common commercial clients." },
      { q: "Can we get one invoice for multiple properties?", a: "Absolutely. We consolidate billing for property management portfolios across the region." },
      { q: "What if a tenant calls in an emergency?", a: "Existing contract customers get priority dispatch. You provide us the authorization protocol — we handle the rest." },
    ],
    related: ["grease_trap", "emergency"],
  },

  grease_trap: {
    slug: "grease-trap",
    key: "grease_trap",
    name: "Restaurant Grease Trap Cleaning",
    short: "Grease Trap",
    icon: Utensils,
    eyebrow: "FOR RESTAURANTS & COMMERCIAL KITCHENS",
    headline: "Grease Trap Pumping That Keeps Inspectors Happy.",
    intro:
      "A failing grease trap can shut your restaurant down, cause backups in the dining room, and result in fines from the local health department. Castellon offers scheduled grease trap pumping for restaurants, fast food, bars, cafeterias, and commercial kitchens — done on time, every time, with full documentation for compliance.",
    image: "/kitchen.jpg",
    included: [
      "Full pump-out of grease, oil, and solids",
      "Trap interior scrape & rinse",
      "Inspection of baffles, lids, and gaskets",
      "Service report you can hand to health inspectors",
      "Scheduled quarterly contracts (or custom intervals)",
      "Discreet service hours — before opening, after close, or off-days",
    ],
    whenNeeded:
      "Most municipalities require grease trap cleaning every 30–90 days based on size and volume. Quarterly service is the sweet spot for most sit-down restaurants. High-volume kitchens (fast food, large cafeterias) may need more frequent visits. We assess your trap and recommend an interval that keeps you fully compliant without overpaying.",
    steps: [
      { t: "Assess & quote", d: "We visit, measure your trap, review volume, and quote a service interval." },
      { t: "Schedule around hours", d: "Service happens before you open or after close — never during service hours." },
      { t: "Full pump + scrape", d: "Solids and grease removed, walls scraped, baffles inspected, lid replaced." },
      { t: "Service report", d: "Printed report goes in your compliance binder. We log every visit." },
    ],
    faqs: [
      { q: "What if I have multiple grease traps?", a: "Indoor traps, outdoor interceptors, dual systems — we handle them all in one visit and bill them together." },
      { q: "Will the kitchen smell after service?", a: "Done correctly, no. We deodorize the trap after pumping and replace the lid with a fresh seal." },
      { q: "Can you bill our corporate office?", a: "Yes — we work with restaurant groups and franchise operators with central billing." },
    ],
    related: ["commercial", "emergency"],
  },

  emergency: {
    slug: "emergency",
    key: "emergency",
    name: "Emergency Pump-Out Service",
    short: "Emergency",
    icon: Siren,
    eyebrow: "WHEN YOU NEED IT YESTERDAY",
    headline: "Septic Backup? We Dispatch Same Day.",
    intro:
      "A septic backup is one of the worst home or business emergencies you can have. Sewage in the basement. Standing water in the yard. Alarms going off. When you call Castellon, a real person picks up, and a truck gets dispatched — typically within hours. We keep emergency capacity reserved every working day for situations like yours.",
    image: "/truck-rear.png",
    included: [
      "Same-day dispatch within our 2-hour service radius",
      "Full pump-out to relieve the backup",
      "Diagnostic: what caused the failure (full tank? blocked line? drain field?)",
      "Honest recommendations on next steps — no scare tactics",
      "Documented service for insurance claims (where applicable)",
      "Priority for existing maintenance customers",
    ],
    whenNeeded:
      "Call us immediately if you see sewage backing up into the lowest drain or toilet in the house, hear gurgling from drains and pipes, smell sewage indoors or near the tank, see standing water or unusually green grass over the drain field, or hear your septic alarm. Don't run dishwashers, washing machines, or showers until we arrive — every additional gallon makes the situation worse.",
    steps: [
      { t: "Call (509) 655-6480", d: "Real person answers. Describe the situation. We dispatch the next available truck." },
      { t: "Truck arrives", d: "Typical response window is same-day for backups within our radius. We confirm ETA up front." },
      { t: "Pump & diagnose", d: "Tank gets pumped to relieve pressure. We diagnose root cause — not just the symptom." },
      { t: "Honest next steps", d: "If it's just a full tank, you're done. If something deeper is wrong, you get clear options — not a hard upsell." },
    ],
    faqs: [
      { q: "How fast can you actually get here?", a: "Most emergencies within 30 minutes of Spokane are reached the same day, often within 2–4 hours of the call. Further locations within our radius depend on truck availability." },
      { q: "Will an emergency call cost more?", a: "We charge a fair emergency rate that reflects the same-day dispatch. We tell you the price before we roll — no surprise invoices." },
      { q: "What if I'm outside business hours?", a: "Call the same number. Existing customers get priority after-hours response. For new customers we'll do our best — and at minimum we'll have a truck rolling first thing the next morning." },
    ],
    related: ["residential", "commercial"],
  },
};

export const SERVICE_LIST = Object.values(SERVICE_PAGES);

