import { Link } from "react-router-dom";
import { Phone, Truck } from "lucide-react";
import { PHONE, PHONE_HREF, COMPANY } from "@/lib/api";

export default function SiteHeader() {
  return (
    <header className="relative z-30 bg-white border-b-2 border-navy" data-testid="site-header">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group" data-testid="logo-link">
          <div className="w-11 h-11 bg-[var(--navy)] flex items-center justify-center">
            <Truck className="w-6 h-6 text-[var(--amber)]" strokeWidth={2.5} />
          </div>
          <div className="leading-tight">
            <div className="font-display text-2xl tracking-wider text-navy">{COMPANY.split(" ")[0]}</div>
            <div className="font-mono-tiny text-[10px] text-[var(--muted)] -mt-1">SEPTIC SERVICES · EST. SPOKANE</div>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-8 font-display text-lg uppercase tracking-wider text-navy">
          <Link to="/" className="hover:text-[var(--amber)] transition" data-testid="nav-home">
            Home
          </Link>
          <Link to="/book" className="hover:text-[var(--amber)] transition" data-testid="nav-book">
            Book Service
          </Link>
          <Link to="/quote" className="hover:text-[var(--amber)] transition" data-testid="nav-quote">
            Get Quote
          </Link>
        </nav>

        <a href={PHONE_HREF} className="hidden md:inline-flex btn-amber gap-2" data-testid="header-call-btn">
          <Phone className="w-4 h-4" strokeWidth={2.5} />
          {PHONE}
        </a>
      </div>
      <div className="divider-bars">
        <div className="bg-[var(--navy)]" />
        <div className="bg-[var(--amber)]" />
        <div className="bg-[var(--navy)]" />
      </div>
    </header>
  );
}
