import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { Send, Loader2, Check, Phone } from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { api, SERVICES, formatApiError, PHONE, PHONE_HREF } from "@/lib/api";

export default function Quote() {
  const [params] = useSearchParams();
  const isContract = params.get("type") === "contract";
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    service_type: "",
    address: "",
    city: "",
    message: isContract
      ? "Interested in a recurring maintenance contract. Please contact me to discuss frequency and pricing."
      : "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.message) {
      toast.error("Please fill in your name, phone, and message");
      return;
    }
    setSubmitting(true);
    try {
      const payload = { ...form, email: form.email || undefined, service_type: form.service_type || undefined };
      await api.post("/quotes", payload);
      setDone(true);
      toast.success("Quote request sent");
    } catch (err) {
      toast.error(formatApiError(err.response?.data?.detail) || "Could not send request");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col" data-testid="quote-page">
      <SiteHeader light />
      <main className="flex-1 max-w-3xl mx-auto px-6 lg:px-8 py-12 w-full">
        {!done && (
          <>
            <div className="text-[var(--amber)] font-display text-sm tracking-[0.3em] mb-2">
              {isContract ? "— MAINTENANCE CONTRACT" : "— FREE QUOTE"}
            </div>
            <h1 className="font-display text-4xl md:text-6xl mb-3">
              {isContract ? "Request a Contract Quote" : "Request a Free Quote"}
            </h1>
            <p className="text-muted-foreground-2 mb-10">
              Fill out the form below and we'll get back to you with a no-obligation estimate. For emergency
              service, call <a className="text-[var(--amber)]" href={PHONE_HREF}>{PHONE}</a>.
            </p>

            <form onSubmit={submit} className="grid sm:grid-cols-2 gap-4" data-testid="quote-form">
              <Field label="Full Name *" value={form.name} onChange={(v) => setForm({ ...form, name: v })} testid="quote-name" />
              <Field label="Phone *" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} testid="quote-phone" />
              <Field label="Email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} testid="quote-email" />
              <div>
                <label className="block font-display text-sm tracking-widest text-muted-foreground-2 mb-2">Service Type</label>
                <select value={form.service_type} onChange={(e) => setForm({ ...form, service_type: e.target.value })} data-testid="quote-service">
                  <option value="">— Select —</option>
                  {SERVICES.map((s) => (
                    <option key={s.key} value={s.key}>
                      {s.name}
                    </option>
                  ))}
                  <option value="contract">Recurring Maintenance Contract</option>
                </select>
              </div>
              <Field className="sm:col-span-2" label="Address" value={form.address} onChange={(v) => setForm({ ...form, address: v })} testid="quote-address" />
              <Field label="City" value={form.city} onChange={(v) => setForm({ ...form, city: v })} testid="quote-city" />
              <div className="sm:col-span-2">
                <label className="block font-display text-sm tracking-widest text-muted-foreground-2 mb-2">
                  Tell us about the job *
                </label>
                <textarea
                  rows={5}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="Tank size, last pumped, access notes, frequency needed, etc."
                  data-testid="quote-message"
                />
              </div>
              <div className="sm:col-span-2 flex justify-end pt-2">
                <button type="submit" className="btn-amber inline-flex items-center gap-2 disabled:opacity-50" disabled={submitting} data-testid="quote-submit">
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  Send Quote Request
                </button>
              </div>
            </form>
          </>
        )}

        {done && (
          <div className="text-center py-16" data-testid="quote-success">
            <div className="w-20 h-20 bg-[var(--amber)] mx-auto mb-6 flex items-center justify-center">
              <Check className="w-12 h-12 text-[#0a0f1a]" strokeWidth={3} />
            </div>
            <h1 className="font-display text-5xl md:text-6xl mb-4">Got It. Talk Soon.</h1>
            <p className="text-muted-foreground-2 max-w-xl mx-auto mb-8">
              Thanks, {form.name}. We'll review your request and get back to you shortly. For urgent service, call us directly.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <a href={PHONE_HREF} className="btn-amber inline-flex items-center gap-2" data-testid="quote-call-btn">
                <Phone className="w-4 h-4" /> {PHONE}
              </a>
              <Link to="/" className="btn-outline-steel" data-testid="quote-home-btn">
                Back to Home
              </Link>
            </div>
          </div>
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
