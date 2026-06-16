import { useEffect, useMemo, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { toast } from "sonner";
import { CalendarCheck, ChevronLeft, ChevronRight, Loader2, Check, Phone } from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { api, SERVICES, formatApiError, PHONE, PHONE_HREF } from "@/lib/api";

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

function ymd(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const da = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${da}`;
}

function isSameDay(a, b) {
  return a && b && ymd(a) === ymd(b);
}

export default function Book() {
  const [searchParams] = useSearchParams();
  const initialService = searchParams.get("service") || "residential";

  const [step, setStep] = useState(1);
  const [serviceKey, setServiceKey] = useState(initialService);
  const [config, setConfig] = useState(null);
  const [monthStart, setMonthStart] = useState(new Date(new Date().getFullYear(), new Date().getMonth(), 1));
  const [selectedDate, setSelectedDate] = useState(null);
  const [slots, setSlots] = useState([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [selectedTime, setSelectedTime] = useState(null);
  const [form, setForm] = useState({
    customer_name: "",
    customer_phone: "",
    customer_email: "",
    address: "",
    city: "",
    notes: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [confirmation, setConfirmation] = useState(null);

  useEffect(() => {
    api.get("/availability/config").then((r) => setConfig(r.data)).catch(() => {});
  }, []);

  useEffect(() => {
    if (!selectedDate) return;
    setSlotsLoading(true);
    setSelectedTime(null);
    api
      .get(`/availability/slots?date=${ymd(selectedDate)}&service_type=${serviceKey}`)
      .then((r) => setSlots(r.data.slots || []))
      .catch(() => setSlots([]))
      .finally(() => setSlotsLoading(false));
  }, [selectedDate, serviceKey]);

  const calendarDays = useMemo(() => {
    const first = monthStart;
    const last = new Date(monthStart.getFullYear(), monthStart.getMonth() + 1, 0);
    const startWeekday = (first.getDay() + 6) % 7;
    const days = [];
    for (let i = 0; i < startWeekday; i++) days.push(null);
    for (let d = 1; d <= last.getDate(); d++) {
      days.push(new Date(first.getFullYear(), first.getMonth(), d));
    }
    return days;
  }, [monthStart]);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const isDayAvailable = (d) => {
    if (!d || !config) return false;
    if (d < today) return false;
    const weekday = (d.getDay() + 6) % 7;
    if (!config.working_days?.includes(weekday)) return false;
    if (config.blocked_dates?.includes(ymd(d))) return false;
    return true;
  };

  const handleSubmit = async () => {
    if (!selectedDate || !selectedTime) {
      toast.error("Please select a date and time slot");
      return;
    }
    if (!form.customer_name || !form.customer_phone || !form.address || !form.city) {
      toast.error("Please fill in your name, phone, address and city");
      return;
    }
    setSubmitting(true);
    try {
      const payload = {
        service_type: serviceKey,
        date: ymd(selectedDate),
        time: selectedTime,
        ...form,
        customer_email: form.customer_email || undefined,
      };
      const { data } = await api.post("/bookings", payload);
      setConfirmation(data);
      setStep(4);
      toast.success("Booking confirmed!");
    } catch (e) {
      toast.error(formatApiError(e.response?.data?.detail) || "Could not create booking");
    } finally {
      setSubmitting(false);
    }
  };

  const service = SERVICES.find((s) => s.key === serviceKey);

  return (
    <div className="min-h-screen flex flex-col bg-white text-navy" data-testid="book-page">
      <SiteHeader />
      <main className="flex-1 max-w-5xl mx-auto px-6 lg:px-8 py-12 w-full">
        {/* Step indicator */}
        <div className="flex items-center justify-between mb-10" data-testid="step-indicator">
          {[
            { n: 1, t: "Service" },
            { n: 2, t: "Date & Time" },
            { n: 3, t: "Your Info" },
            { n: 4, t: "Confirmed" },
          ].map((s, i) => (
            <div key={s.n} className="flex items-center gap-3 flex-1">
              <div
                className={`w-10 h-10 flex items-center justify-center font-display text-lg border-2 ${
                  step >= s.n ? "bg-[var(--amber)] text-navy border-navy" : "border-[var(--border-strong)] text-[var(--muted)] bg-white"
                }`}
              >
                {s.n}
              </div>
              <span className={`font-display tracking-widest hidden sm:inline ${step >= s.n ? "text-navy" : "text-[var(--muted)]"}`}>
                {s.t}
              </span>
              {i < 3 && <div className={`flex-1 h-0.5 ${step > s.n ? "bg-[var(--amber)]" : "bg-[var(--border)]"}`} />}
            </div>
          ))}
        </div>

        {/* STEP 1 */}
        {step === 1 && (
          <section data-testid="step-1">
            <h1 className="font-display text-4xl md:text-5xl mb-2 text-navy">Select Your Service</h1>
            <p className="text-[var(--muted)] mb-8">Choose the type of service you need. Emergency calls are dispatched same-day.</p>
            <div className="grid sm:grid-cols-2 gap-4">
              {SERVICES.map((s) => (
                <button
                  key={s.key}
                  onClick={() => setServiceKey(s.key)}
                  className={`text-left p-6 border-2 transition bg-white ${
                    serviceKey === s.key ? "border-navy shadow-[6px_6px_0_var(--amber)]" : "border-[var(--border-strong)] hover:border-navy"
                  }`}
                  data-testid={`service-select-${s.key}`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-3 h-3" style={{ background: s.color }} />
                    {serviceKey === s.key && (
                      <div className="w-6 h-6 bg-[var(--amber)] flex items-center justify-center">
                        <Check className="w-4 h-4 text-navy" strokeWidth={3} />
                      </div>
                    )}
                  </div>
                  <div className="font-display text-2xl mb-2 text-navy">{s.name}</div>
                  <div className="text-sm text-[var(--muted)]">{s.desc}</div>
                </button>
              ))}
            </div>
            {serviceKey === "emergency" && (
              <div className="mt-6 border-2 border-[var(--red)] bg-[rgba(220,38,38,0.05)] p-5 flex flex-wrap items-center justify-between gap-4" data-testid="emergency-callout">
                <div>
                  <div className="font-display text-xl text-[var(--red)]">For fastest emergency response, call us directly.</div>
                  <div className="text-sm text-[var(--muted)]">Bookings are dispatched, but a phone call gets a truck rolling faster.</div>
                </div>
                <a href={PHONE_HREF} className="btn-red gap-2" data-testid="emergency-page-call">
                  <Phone className="w-4 h-4" /> Call {PHONE}
                </a>
              </div>
            )}
            <div className="mt-8 flex justify-end">
              <button className="btn-amber" onClick={() => setStep(2)} data-testid="step-1-next">
                Continue
              </button>
            </div>
          </section>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <section data-testid="step-2">
            <h1 className="font-display text-4xl md:text-5xl mb-2 text-navy">Pick a Date &amp; Time</h1>
            <p className="text-[var(--muted)] mb-8">
              Service: <span className="text-navy font-medium">{service?.name}</span>
            </p>

            <div className="grid lg:grid-cols-[1fr_320px] gap-8">
              <div className="border-2 border-[var(--border-strong)] bg-white p-6">
                <div className="flex items-center justify-between mb-5">
                  <button
                    className="p-2 hover:bg-[var(--cream)] text-navy"
                    onClick={() => setMonthStart(new Date(monthStart.getFullYear(), monthStart.getMonth() - 1, 1))}
                    data-testid="calendar-prev"
                  >
                    <ChevronLeft />
                  </button>
                  <div className="font-display text-2xl tracking-wider text-navy">
                    {MONTHS[monthStart.getMonth()]} {monthStart.getFullYear()}
                  </div>
                  <button
                    className="p-2 hover:bg-[var(--cream)] text-navy"
                    onClick={() => setMonthStart(new Date(monthStart.getFullYear(), monthStart.getMonth() + 1, 1))}
                    data-testid="calendar-next"
                  >
                    <ChevronRight />
                  </button>
                </div>
                <div className="grid grid-cols-7 gap-1 text-center font-mono-tiny text-[10px] text-[var(--muted)] mb-2">
                  {WEEKDAYS.map((w) => (
                    <div key={w}>{w}</div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {calendarDays.map((d, i) => {
                    const avail = isDayAvailable(d);
                    const selected = isSameDay(d, selectedDate);
                    return (
                      <button
                        key={i}
                        disabled={!avail}
                        onClick={() => avail && setSelectedDate(d)}
                        className={`aspect-square text-base font-display border-2 transition ${
                          !d
                            ? "border-transparent"
                            : selected
                            ? "bg-[var(--amber)] text-navy border-navy"
                            : avail
                            ? "border-[var(--border-strong)] text-navy hover:border-navy hover:bg-[var(--cream)]"
                            : "border-transparent text-[var(--border-strong)] cursor-not-allowed"
                        }`}
                        data-testid={d ? `cal-day-${ymd(d)}` : undefined}
                      >
                        {d?.getDate() || ""}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="border-2 border-[var(--border-strong)] bg-cream p-6">
                <div className="font-display text-xl tracking-wider mb-4 text-navy">Available Slots</div>
                {!selectedDate && <div className="text-sm text-[var(--muted)]">Select a date to see available time slots.</div>}
                {selectedDate && slotsLoading && (
                  <div className="flex items-center gap-2 text-[var(--muted)]">
                    <Loader2 className="w-4 h-4 animate-spin" /> Loading…
                  </div>
                )}
                {selectedDate && !slotsLoading && slots.length === 0 && (
                  <div className="text-sm text-[var(--muted)]">No slots available on this date. Try another day or call us directly.</div>
                )}
                {!slotsLoading && slots.length > 0 && (
                  <div className="grid grid-cols-2 gap-2" data-testid="slots-grid">
                    {slots.map((t) => (
                      <button
                        key={t}
                        onClick={() => setSelectedTime(t)}
                        className={`slot-btn ${selectedTime === t ? "active" : ""}`}
                        data-testid={`slot-${t}`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="mt-8 flex justify-between">
              <button className="btn-outline-navy" onClick={() => setStep(1)} data-testid="step-2-back">
                Back
              </button>
              <button
                className="btn-amber disabled:opacity-50"
                disabled={!selectedDate || !selectedTime}
                onClick={() => setStep(3)}
                data-testid="step-2-next"
              >
                Continue
              </button>
            </div>
          </section>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <section data-testid="step-3">
            <h1 className="font-display text-4xl md:text-5xl mb-2 text-navy">Your Information</h1>
            <p className="text-[var(--muted)] mb-8">
              {service?.name} on{" "}
              <span className="text-navy font-medium">
                {selectedDate?.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
              </span>{" "}
              at <span className="text-navy font-medium">{selectedTime}</span>
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Full Name *" value={form.customer_name} onChange={(v) => setForm({ ...form, customer_name: v })} testid="input-name" />
              <Field label="Phone Number *" value={form.customer_phone} onChange={(v) => setForm({ ...form, customer_phone: v })} testid="input-phone" />
              <Field label="Email (optional)" value={form.customer_email} onChange={(v) => setForm({ ...form, customer_email: v })} testid="input-email" />
              <Field label="City *" value={form.city} onChange={(v) => setForm({ ...form, city: v })} testid="input-city" />
              <Field className="sm:col-span-2" label="Service Address *" value={form.address} onChange={(v) => setForm({ ...form, address: v })} testid="input-address" />
              <div className="sm:col-span-2">
                <label className="block font-mono-tiny text-[11px] text-[var(--muted)] mb-2">NOTES (TANK SIZE, ACCESS DETAILS, ETC.)</label>
                <textarea
                  rows={4}
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  data-testid="input-notes"
                />
              </div>
            </div>

            <div className="mt-8 flex justify-between">
              <button className="btn-outline-navy" onClick={() => setStep(2)} data-testid="step-3-back">
                Back
              </button>
              <button className="btn-amber gap-2 disabled:opacity-50" disabled={submitting} onClick={handleSubmit} data-testid="step-3-submit">
                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <CalendarCheck className="w-4 h-4" />}
                Confirm Booking
              </button>
            </div>
          </section>
        )}

        {/* STEP 4 */}
        {step === 4 && confirmation && (
          <section className="text-center py-10" data-testid="step-4">
            <div className="w-20 h-20 bg-[var(--amber)] mx-auto mb-6 flex items-center justify-center border-2 border-navy">
              <Check className="w-12 h-12 text-navy" strokeWidth={3} />
            </div>
            <h1 className="font-display text-5xl md:text-6xl mb-4 text-navy">Booking Confirmed</h1>
            <p className="text-[var(--muted)] max-w-xl mx-auto mb-8">
              Thanks {confirmation.customer_name}. We&apos;ve got you scheduled for{" "}
              <span className="text-navy font-medium">{service?.name}</span> on{" "}
              <span className="text-navy font-medium">{confirmation.date}</span> at{" "}
              <span className="text-navy font-medium">{confirmation.time}</span>. We&apos;ll call {confirmation.customer_phone} to confirm details.
            </p>
            <div className="inline-block border-2 border-[var(--border-strong)] bg-cream p-6 text-left text-sm">
              <div className="font-display text-xl mb-3 text-navy">Booking Reference</div>
              <div className="text-[var(--muted)]">ID: <span className="text-navy font-mono">{confirmation.id}</span></div>
            </div>
            <div className="mt-8">
              <Link to="/" className="btn-outline-navy mr-3" data-testid="conf-home">
                Back to Home
              </Link>
              <a href={PHONE_HREF} className="btn-amber" data-testid="conf-call">
                Call {PHONE}
              </a>
            </div>
          </section>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}

function Field({ label, value, onChange, className = "", testid }) {
  return (
    <div className={className}>
      <label className="block font-mono-tiny text-[11px] text-[var(--muted)] mb-2">{label.toUpperCase()}</label>
      <input value={value} onChange={(e) => onChange(e.target.value)} data-testid={testid} />
    </div>
  );
}
