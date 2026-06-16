import { Link } from "react-router-dom";
import { Phone, Truck } from "lucide-react";
import { PHONE, PHONE_HREF, COMPANY } from "@/lib/api";

export default function SiteHeader({ light = false }) {
  return (
    <header
      className={`relative z-30 ${light ? "bg-surface border-b border-heavy" : "bg-transparent"}`}
      data-testid="site-header"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group" data-testid="logo-link">
          <div className="w-10 h-10 bg-[var(--amber)] flex items-center justify-center">
            <Truck className="w-6 h-6 text-[#0a0f1a]" strokeWidth={2.5} />
          </div>
          <div className="leading-tight">
            <div className="font-display text-2xl tracking-wider">{COMPANY.split(" ")[0]}</div>
            <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground-2 -mt-1">
              Septic Services
            </div>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-8 font-display text-lg uppercase tracking-wider">
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

        <a
          href={PHONE_HREF}
          className="hidden md:inline-flex items-center gap-2 btn-amber"
          data-testid="header-call-btn"
        >
          <Phone className="w-4 h-4" strokeWidth={2.5} />
          {PHONE}
        </a>
      </div>
    </header>
  );
}
