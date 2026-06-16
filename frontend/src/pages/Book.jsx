import { useEffect, useMemo, useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import { CalendarCheck, ChevronLeft, ChevronRight, Loader2, Check, Phone } from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { api, SERVICES, formatApiError, PHONE, PHONE_HREF } from "@/lib/api";

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

function startOfMonth(d) {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

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
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [serviceKey, setServiceKey] = useState(initialService);
  const [config, setConfig] = useState(null);
  const [monthStart, setMonthStart] = useState(startOfMonth(new Date()));
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
    const startWeekday = (first.getDay() + 6) % 7; // Mon=0
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
    const weekday = (d.getDay() + 6) % 7; // 0=Mon
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
    <div className="min-h-screen flex flex-col" data-testid="book-page">
      <SiteHeader light />
      <main className="flex-1 max-w-5xl mx-auto px-6 lg:px-8 py-12 w-full">
        {/* Step indicator */}
        <div className="flex items-center justify-between mb-10 text-xs uppercase tracking-widest" data-testid="step-indicator">
          {[
            { n: 1, t: "Service" },
            { n: 2, t: "Date & Time" },
            { n: 3, t: "Your Info" },
            { n: 4, t: "Confirmed" },
          ].map((s, i) => (
            <div key={s.n} className="flex items-center gap-3 flex-1">
              <div
                className={`w-9 h-9 flex items-center justify-center font-display text-lg border ${
                  step >= s.n ? "bg-[var(--amber)] text-[#0a0f1a] border-[var(--amber)]" : "border-heavy text-muted-foreground-2"
                }`}
              >
                {s.n}
              </div>
              <span className={`font-display tracking-widest hidden sm:inline ${step >= s.n ? "text-white" : "text-muted-foreground-2"}`}>
                {s.t}
              </span>
              {i < 3 && <div className={`flex-1 h-px ${step > s.n ? "bg-[var(--amber)]" : "bg-[var(--border)]"}`} />}
            </div>
          ))}
        </div>

        {/* STEP 1 — Service */}
        {step === 1 && (
          <section data-testid="step-1">
            <h1 className="font-display text-4xl md:text-5xl mb-2">Select Your Service</h1>
            <p className="text-muted-foreground-2 mb-8">Choose the type of service you need. Emergency calls are dispatched same-day.</p>
            <div className="grid sm:grid-cols-2 gap-4">
              {SERVICES.map((s) => (
                <button
                  key={s.key}
                  onClick={() => setServiceKey(s.key)}
                  className={`text-left p-6 border transition ${
                    serviceKey === s.key ? "border-[var(--amber)] bg-[var(--surface)]" : "border-heavy bg-surface hover:border-[#3a4a64]"
                  }`}
                  data-testid={`service-select-${s.key}`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-3 h-3" style={{ background: s.color }} />
                    {serviceKey === s.key && <Check className="w-5 h-5 text-[var(--amber)]" />}
                  </div>
                  <div className="font-display text-2xl mb-2">{s.name}</div>
                  <div className="text-sm text-muted-foreground-2">{s.desc}</div>
                </button>
              ))}
            </div>
            {serviceKey === "emergency" && (
              <div className="mt-6 border border-[var(--red)] bg-[rgba(239,68,68,0.08)] p-5 flex flex-wrap items-center justify-between gap-4" data-testid="emergency-callout">
                <div>
                  <div className="font-display text-xl text-[var(--red)]">For fastest emergency response, call us directly.</div>
                  <div className="text-sm text-muted-foreground-2">Bookings are dispatched, but a phone call gets a truck rolling faster.</div>
                </div>
                <a href={PHONE_HREF} className="btn-red inline-flex items-center gap-2" data-testid="emergency-page-call">
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

        {/* STEP 2 — Calendar */}
        {step === 2 && (
          <section data-testid="step-2">
            <h1 className="font-display text-4xl md:text-5xl mb-2">Pick a Date & Time</h1>
            <p className="text-muted-foreground-2 mb-8">
              Service: <span className="text-white font-medium">{service?.name}</span>
            </p>

            <div className="grid lg:grid-cols-[1fr_320px] gap-8">
              {/* Calendar */}
              <div className="border border-heavy bg-surface p-6">
                <div className="flex items-center justify-between mb-5">
                  <button
                    className="p-2 hover:bg-[var(--surface-2)]"
                    onClick={() => setMonthStart(new Date(monthStart.getFullYear(), monthStart.getMonth() - 1, 1))}
                    data-testid="calendar-prev"
                  >
                    <ChevronLeft />
                  </button>
                  <div className="font-display text-2xl tracking-wider">
                    {MONTHS[monthStart.getMonth()]} {monthStart.getFullYear()}
                  </div>
                  <button
                    className="p-2 hover:bg-[var(--surface-2)]"
                    onClick={() => setMonthStart(new Date(monthStart.getFullYear(), monthStart.getMonth() + 1, 1))}
                    data-testid="calendar-next"
                  >
                    <ChevronRight />
                  </button>
                </div>
                <div className="grid grid-cols-7 gap-1 text-center text-xs uppercase tracking-widest text-muted-foreground-2 mb-2">
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
                        className={`aspect-square text-base font-display border transition ${
                          !d
                            ? "border-transparent"
                            : selected
                            ? "bg-[var(--amber)] text-[#0a0f1a] border-[var(--amber)]"
                            : avail
                            ? "border-heavy hover:border-[var(--amber)] hover:text-[var(--amber)]"
                            : "border-transparent text-[var(--border)] cursor-not-allowed"
                        }`}
                        data-testid={d ? `cal-day-${ymd(d)}` : undefined}
                      >
                        {d?.getDate() || ""}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Slots */}
              <div className="border border-heavy bg-surface p-6">
                <div className="font-display text-xl tracking-wider mb-4">Available Slots</div>
                {!selectedDate && <div className="text-sm text-muted-foreground-2">Select a date to see available time slots.</div>}
                {selectedDate && slotsLoading && (
                  <div className="flex items-center gap-2 text-muted-foreground-2">
                    <Loader2 className="w-4 h-4 animate-spin" /> Loading…
                  </div>
                )}
                {selectedDate && !slotsLoading && slots.length === 0 && (
                  <div className="text-sm text-muted-foreground-2">No slots available on this date. Try another day or call us directly.</div>
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
              <button className="btn-outline-steel" onClick={() => setStep(1)} data-testid="step-2-back">
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

        {/* STEP 3 — Info */}
        {step === 3 && (
          <section data-testid="step-3">
            <h1 className="font-display text-4xl md:text-5xl mb-2">Your Information</h1>
            <p className="text-muted-foreground-2 mb-8">
              {service?.name} on{" "}
              <span className="text-white">
                {selectedDate?.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
              </span>{" "}
              at <span className="text-white">{selectedTime}</span>
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Full Name *" value={form.customer_name} onChange={(v) => setForm({ ...form, customer_name: v })} testid="input-name" />
              <Field label="Phone Number *" value={form.customer_phone} onChange={(v) => setForm({ ...form, customer_phone: v })} testid="input-phone" />
              <Field label="Email (optional)" value={form.customer_email} onChange={(v) => setForm({ ...form, customer_email: v })} testid="input-email" />
              <Field label="City *" value={form.city} onChange={(v) => setForm({ ...form, city: v })} testid="input-city" />
              <Field className="sm:col-span-2" label="Service Address *" value={form.address} onChange={(v) => setForm({ ...form, address: v })} testid="input-address" />
              <div className="sm:col-span-2">
                <label className="block font-display text-sm tracking-widest text-muted-foreground-2 mb-2">Notes (tank size, access details, etc.)</label>
                <textarea
                  rows={4}
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  data-testid="input-notes"
                />
              </div>
            </div>

            <div className="mt-8 flex justify-between">
              <button className="btn-outline-steel" onClick={() => setStep(2)} data-testid="step-3-back">
                Back
              </button>
              <button className="btn-amber inline-flex items-center gap-2 disabled:opacity-50" disabled={submitting} onClick={handleSubmit} data-testid="step-3-submit">
                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <CalendarCheck className="w-4 h-4" />}
                Confirm Booking
              </button>
            </div>
          </section>
        )}

        {/* STEP 4 — Confirmation */}
        {step === 4 && confirmation && (
          <section className="text-center py-10" data-testid="step-4">
            <div className="w-20 h-20 bg-[var(--amber)] mx-auto mb-6 flex items-center justify-center">
              <Check className="w-12 h-12 text-[#0a0f1a]" strokeWidth={3} />
            </div>
            <h1 className="font-display text-5xl md:text-6xl mb-4">Booking Confirmed</h1>
            <p className="text-muted-foreground-2 max-w-xl mx-auto mb-8">
              Thanks {confirmation.customer_name}. We've got you scheduled for{" "}
              <span className="text-white">{service?.name}</span> on{" "}
              <span className="text-white">{confirmation.date}</span> at{" "}
              <span className="text-white">{confirmation.time}</span>. We'll call {confirmation.customer_phone} to confirm details.
            </p>
            <div className="inline-block border border-heavy bg-surface p-6 text-left text-sm">
              <div className="font-display text-xl mb-3">Booking Reference</div>
              <div className="text-muted-foreground-2">ID: <span className="text-white">{confirmation.id}</span></div>
            </div>
            <div className="mt-8">
              <Link to="/" className="btn-outline-steel mr-3" data-testid="conf-home">
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
      <label className="block font-display text-sm tracking-widest text-muted-foreground-2 mb-2">{label}</label>
      <input value={value} onChange={(e) => onChange(e.target.value)} data-testid={testid} />
    </div>
  );
}
