import { Link } from "react-router-dom";
import { Phone, CalendarClock } from "lucide-react";
import { PHONE, PHONE_HREF } from "@/lib/api";

export default function FloatingCTAs() {
  return (
    <div className="floating-cta" data-testid="floating-cta-wrap">
      <a href={PHONE_HREF} className="btn-amber inline-flex items-center justify-center gap-2" data-testid="floating-call-btn">
        <Phone className="w-5 h-5" strokeWidth={2.5} />
        <span className="hidden md:inline">Call {PHONE}</span>
        <span className="md:hidden">Call Now</span>
      </a>
      <Link to="/book" className="btn-outline-steel inline-flex items-center justify-center gap-2 bg-[var(--surface)]" data-testid="floating-book-btn">
        <CalendarClock className="w-5 h-5" strokeWidth={2.5} />
        Book Online
      </Link>
    </div>
  );
}
