import { Link } from "react-router-dom";
import { Phone, MapPin, Mail } from "lucide-react";
import { PHONE, PHONE_HREF, COMPANY } from "@/lib/api";
import { AREA_LIST } from "@/data/areas";
import { SERVICE_LIST } from "@/data/services";

export default function SiteFooter() {
  return (
    <footer className="bg-navy" data-testid="site-footer">
      <div className="divider-bars">
        <div className="bg-[var(--amber)]" />
        <div className="bg-white" />
        <div className="bg-[var(--amber)]" />
      </div>
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16 grid md:grid-cols-2 lg:grid-cols-5 gap-10 text-white">
        <div className="lg:col-span-2">
          <Link to="/" className="inline-block mb-4 bg-white p-3 border-2 border-white">
            <img src="/logo.png" alt="Castellon Septic Services" className="h-20 w-auto" />
          </Link>
          <p className="text-white/70 text-sm leading-relaxed mb-5 max-w-sm">
            Professional septic & grease pumping serving Eastern Washington and North Idaho with a 1,800-gallon
            vacuum truck and a crew that shows up on time.
          </p>
          <ul className="space-y-2 text-sm">
            <li>
              <a href={PHONE_HREF} className="flex items-center gap-2 hover:text-[var(--amber)]" data-testid="footer-phone">
                <Phone className="w-4 h-4" /> {PHONE}
              </a>
            </li>
            <li className="flex items-center gap-2 text-white/75">
              <MapPin className="w-4 h-4" /> Spokane, WA · HQ
            </li>
            <li className="flex items-center gap-2 text-white/75">
              <Mail className="w-4 h-4" /> info@castellon.com
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-display text-xl mb-4 text-[var(--amber)]">Services</h4>
          <ul className="space-y-2 text-sm text-white/80">
            {SERVICE_LIST.map((s) => (
              <li key={s.key}>
                <Link to={`/services/${s.slug}`} className="hover:text-[var(--amber)]" data-testid={`footer-service-${s.key}`}>
                  {s.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-display text-xl mb-4 text-[var(--amber)]">Washington</h4>
          <ul className="space-y-2 text-sm text-white/80">
            {AREA_LIST.filter((a) => a.state === "WA").map((a) => (
              <li key={a.slug}>
                <Link to={`/areas/${a.slug}`} className="hover:text-[var(--amber)]" data-testid={`footer-area-${a.slug}`}>
                  {a.city}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-display text-xl mb-4 text-[var(--amber)]">North Idaho</h4>
          <ul className="space-y-2 text-sm text-white/80">
            {AREA_LIST.filter((a) => a.state === "ID").map((a) => (
              <li key={a.slug}>
                <Link to={`/areas/${a.slug}`} className="hover:text-[var(--amber)]" data-testid={`footer-area-${a.slug}`}>
                  {a.city}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-6 flex gap-2 flex-wrap">
            <Link to="/book" className="btn-amber text-sm px-3 py-2" data-testid="footer-book-btn">
              Book Now
            </Link>
            <Link to="/quote" className="inline-flex items-center bg-transparent border-2 border-white text-white font-display uppercase tracking-wider px-3 py-2 text-sm hover:bg-white hover:text-[var(--navy)] transition" data-testid="footer-quote-btn">
              Get Quote
            </Link>
          </div>
        </div>
      </div>
      <div className="border-t border-white/15 py-5 text-center text-xs text-white/60">
        © {new Date().getFullYear()} {COMPANY}. Licensed & Insured. Spokane, WA.
        <span className="mx-2">·</span>
        <Link to="/admin/login" className="hover:text-[var(--amber)]" data-testid="admin-login-link">
          Owner Login
        </Link>
      </div>
    </footer>
  );
}
