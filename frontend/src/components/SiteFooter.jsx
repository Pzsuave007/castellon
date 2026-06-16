import { Link } from "react-router-dom";
import { Phone, MapPin, Mail, Truck } from "lucide-react";
import { PHONE, PHONE_HREF, COMPANY } from "@/lib/api";

export default function SiteFooter() {
  return (
    <footer className="bg-surface border-t border-heavy" data-testid="site-footer">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16 grid md:grid-cols-4 gap-10">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-[var(--amber)] flex items-center justify-center">
              <Truck className="w-6 h-6 text-[#0a0f1a]" strokeWidth={2.5} />
            </div>
            <div className="font-display text-2xl">{COMPANY}</div>
          </div>
          <p className="text-muted-foreground-2 text-sm leading-relaxed">
            Professional septic & grease pumping serving Eastern Washington and North Idaho with a 1800-gallon
            vacuum truck.
          </p>
        </div>

        <div>
          <h4 className="font-display text-xl mb-4 text-[var(--amber)]">Services</h4>
          <ul className="space-y-2 text-sm text-muted-foreground-2">
            <li>Residential Septic Pumping</li>
            <li>Commercial Septic Pumping</li>
            <li>Restaurant Grease Trap Cleaning</li>
            <li>Emergency Pump-Out Services</li>
          </ul>
        </div>

        <div>
          <h4 className="font-display text-xl mb-4 text-[var(--amber)]">Service Area</h4>
          <ul className="space-y-1 text-sm text-muted-foreground-2">
            <li>Spokane &amp; Spokane Valley, WA</li>
            <li>Cheney · Deer Park · Pullman</li>
            <li>Coeur d&rsquo;Alene · Post Falls · Hayden</li>
            <li>Rathdrum · Sandpoint, ID</li>
          </ul>
        </div>

        <div>
          <h4 className="font-display text-xl mb-4 text-[var(--amber)]">Contact</h4>
          <ul className="space-y-3 text-sm">
            <li>
              <a href={PHONE_HREF} className="flex items-center gap-2 hover:text-[var(--amber)]" data-testid="footer-phone">
                <Phone className="w-4 h-4" /> {PHONE}
              </a>
            </li>
            <li className="flex items-center gap-2 text-muted-foreground-2">
              <MapPin className="w-4 h-4" /> Spokane, WA
            </li>
            <li className="flex items-center gap-2 text-muted-foreground-2">
              <Mail className="w-4 h-4" /> info@catellon.com
            </li>
          </ul>
          <div className="mt-6 flex gap-3">
            <Link to="/book" className="btn-amber text-base px-4 py-2" data-testid="footer-book-btn">
              Book Now
            </Link>
            <Link to="/quote" className="btn-outline-steel text-base px-4 py-2" data-testid="footer-quote-btn">
              Get Quote
            </Link>
          </div>
        </div>
      </div>
      <div className="border-t border-heavy py-5 text-center text-xs text-muted-foreground-2">
        © {new Date().getFullYear()} {COMPANY}. Licensed & Insured. Spokane, WA.
        <span className="mx-2">·</span>
        <Link to="/admin/login" className="hover:text-[var(--amber)]" data-testid="admin-login-link">
          Owner Login
        </Link>
      </div>
    </footer>
  );
}
