import { Link } from "react-router-dom";
import { Phone } from "lucide-react";
import { PHONE, PHONE_HREF } from "@/lib/api";

export default function SiteHeader() {
  return (
    <header className="relative z-30 bg-white border-b-2 border-navy" data-testid="site-header">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
        <Link to="/" className="flex items-center group" data-testid="logo-link">
          <img
            src="/logo.png"
            alt="Castellon Septic Services"
            className="h-16 md:h-20 w-auto"
          />
        </Link>

        <nav className="hidden md:flex items-center gap-8 font-display text-lg uppercase tracking-wider text-navy">
          <Link to="/" className="hover:text-[var(--amber)] transition" data-testid="nav-home">Home</Link>
          <Link to="/book" className="hover:text-[var(--amber)] transition" data-testid="nav-book">Book Service</Link>
          <Link to="/quote" className="hover:text-[var(--amber)] transition" data-testid="nav-quote">Get Quote</Link>
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
