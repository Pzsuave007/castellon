import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  CalendarDays, Inbox, Settings, LogOut, ChevronLeft, ChevronRight, Trash2,
  CheckCircle2, Clock, X, Phone, MapPin, RefreshCw, Loader2,
} from "lucide-react";
import { useAuth } from "@/lib/auth";
import { api, SERVICE_BY_KEY, SERVICES, formatApiError } from "@/lib/api";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function ymd(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const da = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${da}`;
}

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [quotes, setQuotes] = useState([]);
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refMonth, setRefMonth] = useState(new Date(new Date().getFullYear(), new Date().getMonth(), 1));
  const [openBooking, setOpenBooking] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const [b, q, c] = await Promise.all([
        api.get("/admin/bookings"),
        api.get("/admin/quotes"),
        api.get("/admin/availability"),
      ]);
      setBookings(b.data || []);
      setQuotes(q.data || []);
      setConfig(c.data);
    } catch (e) {
      toast.error("Could not load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const doLogout = async () => {
    await logout();
    navigate("/admin/login", { replace: true });
  };

  const calendarDays = useMemo(() => {
    const first = refMonth;
    const last = new Date(refMonth.getFullYear(), refMonth.getMonth() + 1, 0);
    const startWeekday = (first.getDay() + 6) % 7;
    const days = [];
    for (let i = 0; i < startWeekday; i++) days.push(null);
    for (let d = 1; d <= last.getDate(); d++) days.push(new Date(first.getFullYear(), first.getMonth(), d));
    return days;
  }, [refMonth]);

  const bookingsByDay = useMemo(() => {
    const m = {};
    for (const b of bookings) {
      if (b.status === "cancelled") continue;
      m[b.date] = m[b.date] || [];
      m[b.date].push(b);
    }
    for (const k in m) m[k].sort((a, b) => a.time.localeCompare(b.time));
    return m;
  }, [bookings]);

  const pendingQuotes = quotes.filter((q) => q.status === "new").length;
  const upcomingBookings = bookings.filter((b) => b.status !== "cancelled" && b.date >= ymd(new Date())).length;

  const updateBookingStatus = async (id, status) => {
    try {
      await api.patch(`/admin/bookings/${id}`, { status });
      setBookings((bs) => bs.map((b) => (b.id === id ? { ...b, status } : b)));
      toast.success(`Booking ${status}`);
      if (openBooking?.id === id) setOpenBooking({ ...openBooking, status });
    } catch (e) {
      toast.error(formatApiError(e.response?.data?.detail));
    }
  };

  const deleteBooking = async (id) => {
    if (!window.confirm("Delete this booking permanently?")) return;
    try {
      await api.delete(`/admin/bookings/${id}`);
      setBookings((bs) => bs.filter((b) => b.id !== id));
      setOpenBooking(null);
      toast.success("Booking deleted");
    } catch (e) {
      toast.error(formatApiError(e.response?.data?.detail));
    }
  };

  const updateQuoteStatus = async (id, status) => {
    try {
      await api.patch(`/admin/quotes/${id}`, { status });
      setQuotes((qs) => qs.map((q) => (q.id === id ? { ...q, status } : q)));
      toast.success(`Quote ${status}`);
    } catch (e) {
      toast.error(formatApiError(e.response?.data?.detail));
    }
  };

  const deleteQuote = async (id) => {
    if (!window.confirm("Delete this quote request?")) return;
    try {
      await api.delete(`/admin/quotes/${id}`);
      setQuotes((qs) => qs.filter((q) => q.id !== id));
      toast.success("Quote deleted");
    } catch (e) {
      toast.error(formatApiError(e.response?.data?.detail));
    }
  };

  const saveConfig = async (next) => {
    try {
      const { data } = await api.put("/admin/availability", next);
      setConfig(data);
      toast.success("Availability saved");
    } catch (e) {
      toast.error(formatApiError(e.response?.data?.detail));
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-cream text-navy" data-testid="admin-dashboard">
      {/* Top bar */}
      <header className="bg-white border-b-2 border-navy">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/logo-mark.png" alt="Castellon" className="h-12 w-auto" />
            <div>
              <div className="font-display text-xl tracking-wider text-navy">Castellon Admin</div>
              <div className="text-xs text-[var(--muted)]">{user?.email}</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={load} className="btn-outline-navy gap-2 text-base px-4 py-2" data-testid="refresh-btn">
              <RefreshCw className="w-4 h-4" /> Refresh
            </button>
            <button onClick={doLogout} className="btn-outline-navy gap-2 text-base px-4 py-2" data-testid="logout-btn">
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </div>
        </div>
        <div className="divider-bars">
          <div className="bg-[var(--navy)]" />
          <div className="bg-[var(--amber)]" />
          <div className="bg-[var(--navy)]" />
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto px-6 lg:px-8 py-8 w-full">
        {/* KPI strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8" data-testid="kpi-strip">
          <KPI label="Upcoming Bookings" value={upcomingBookings} icon={CalendarDays} />
          <KPI label="Pending Quotes" value={pendingQuotes} icon={Inbox} accent />
          <KPI label="Total Bookings" value={bookings.length} icon={CheckCircle2} />
          <KPI label="Total Quote Requests" value={quotes.length} icon={Clock} />
        </div>

        <Tabs defaultValue="calendar" className="w-full">
          <TabsList className="bg-white border-2 border-navy rounded-none p-1 h-auto" data-testid="admin-tabs">
            <TabsTrigger value="calendar" className="rounded-none font-display tracking-widest text-base px-5 py-2 data-[state=active]:bg-[var(--amber)] data-[state=active]:text-navy text-navy" data-testid="tab-calendar">
              <CalendarDays className="w-4 h-4 mr-2" /> Bookings Calendar
            </TabsTrigger>
            <TabsTrigger value="quotes" className="rounded-none font-display tracking-widest text-base px-5 py-2 data-[state=active]:bg-[var(--amber)] data-[state=active]:text-navy text-navy" data-testid="tab-quotes">
              <Inbox className="w-4 h-4 mr-2" /> Quote Requests
              {pendingQuotes > 0 && (
                <span className="ml-2 bg-[var(--red)] text-white text-xs px-1.5 py-0.5">{pendingQuotes}</span>
              )}
            </TabsTrigger>
            <TabsTrigger value="settings" className="rounded-none font-display tracking-widest text-base px-5 py-2 data-[state=active]:bg-[var(--amber)] data-[state=active]:text-navy text-navy" data-testid="tab-settings">
              <Settings className="w-4 h-4 mr-2" /> Availability
            </TabsTrigger>
          </TabsList>

          <TabsContent value="calendar" className="mt-6">
            {loading ? (
              <Loading />
            ) : (
              <BookingsCalendar
                refMonth={refMonth}
                setRefMonth={setRefMonth}
                days={calendarDays}
                bookingsByDay={bookingsByDay}
                onSelect={setOpenBooking}
              />
            )}
            <div className="flex flex-wrap gap-4 mt-5 text-xs">
              {SERVICES.map((s) => (
                <div key={s.key} className="flex items-center gap-2 text-[var(--muted)]">
                  <span className="w-3 h-3 inline-block" style={{ background: s.color }} />
                  {s.name}
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="quotes" className="mt-6">
            {loading ? <Loading /> : <QuotesList quotes={quotes} onStatus={updateQuoteStatus} onDelete={deleteQuote} />}
          </TabsContent>

          <TabsContent value="settings" className="mt-6">
            {loading || !config ? <Loading /> : <AvailabilityForm config={config} onSave={saveConfig} />}
          </TabsContent>
        </Tabs>
      </main>

      <Dialog open={!!openBooking} onOpenChange={(o) => !o && setOpenBooking(null)}>
        <DialogContent className="bg-white border-2 border-navy text-navy rounded-none max-w-lg" data-testid="booking-detail-dialog">
          {openBooking && (
            <>
              <DialogHeader>
                <DialogTitle className="font-display text-2xl tracking-wider flex items-center gap-3 text-navy">
                  <span className="w-3 h-3 inline-block" style={{ background: SERVICE_BY_KEY[openBooking.service_type]?.color }} />
                  {SERVICE_BY_KEY[openBooking.service_type]?.name}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-3 text-sm">
                <Row label="Date" value={`${openBooking.date} · ${openBooking.time}`} />
                <Row label="Customer" value={openBooking.customer_name} />
                <Row label="Phone" value={<a href={`tel:${openBooking.customer_phone}`} className="text-navy underline font-medium">{openBooking.customer_phone}</a>} />
                {openBooking.customer_email && <Row label="Email" value={openBooking.customer_email} />}
                <Row label="Address" value={`${openBooking.address}, ${openBooking.city}`} />
                {openBooking.notes && <Row label="Notes" value={openBooking.notes} />}
                <Row label="Status" value={<StatusBadge status={openBooking.status} />} />
              </div>
              <div className="flex flex-wrap gap-2 pt-4 border-t-2 border-[var(--border)]">
                {["confirmed", "completed", "cancelled"].map((s) => (
                  <button
                    key={s}
                    onClick={() => updateBookingStatus(openBooking.id, s)}
                    className="btn-outline-navy text-sm px-3 py-2"
                    data-testid={`booking-set-${s}`}
                  >
                    Mark {s}
                  </button>
                ))}
                <button onClick={() => deleteBooking(openBooking.id)} className="btn-red text-sm px-3 py-2 gap-1 ml-auto" data-testid="booking-delete">
                  <Trash2 className="w-4 h-4" /> Delete
                </button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function KPI({ label, value, icon: Icon, accent }) {
  return (
    <div className={`bg-white border-2 border-[var(--border-strong)] p-5 relative ${accent ? "border-l-[6px] border-l-[var(--amber)]" : ""}`}>
      <Icon className="w-5 h-5 text-navy mb-3" />
      <div className="font-display text-4xl text-navy">{value}</div>
      <div className="font-mono-tiny text-[10px] text-[var(--muted)] mt-1">{label.toUpperCase()}</div>
    </div>
  );
}

function Loading() {
  return (
    <div className="text-[var(--muted)] flex items-center gap-2 py-12 justify-center">
      <Loader2 className="w-5 h-5 animate-spin" /> Loading…
    </div>
  );
}

function BookingsCalendar({ refMonth, setRefMonth, days, bookingsByDay, onSelect }) {
  return (
    <div className="border-2 border-[var(--border-strong)] bg-white" data-testid="bookings-calendar">
      <div className="flex items-center justify-between px-5 py-4 border-b-2 border-[var(--border-strong)] bg-cream">
        <button className="p-2 hover:bg-white text-navy" onClick={() => setRefMonth(new Date(refMonth.getFullYear(), refMonth.getMonth() - 1, 1))} data-testid="admin-cal-prev">
          <ChevronLeft />
        </button>
        <div className="font-display text-2xl tracking-wider text-navy">
          {MONTHS[refMonth.getMonth()]} {refMonth.getFullYear()}
        </div>
        <button className="p-2 hover:bg-white text-navy" onClick={() => setRefMonth(new Date(refMonth.getFullYear(), refMonth.getMonth() + 1, 1))} data-testid="admin-cal-next">
          <ChevronRight />
        </button>
      </div>
      <div className="grid grid-cols-7 text-center font-mono-tiny text-[10px] text-[var(--muted)] border-b border-[var(--border)]">
        {WEEKDAYS.map((w) => (
          <div key={w} className="py-2 border-r border-[var(--border)] last:border-r-0">{w}</div>
        ))}
      </div>
      <div className="grid grid-cols-7">
        {days.map((d, i) => {
          const key = d ? ymd(d) : null;
          const dayBookings = key ? bookingsByDay[key] || [] : [];
          return (
            <div key={i} className="min-h-[110px] border-r border-b border-[var(--border)] last:border-r-0 p-2 align-top" data-testid={d ? `admin-cal-${ymd(d)}` : undefined}>
              {d && (
                <>
                  <div className="text-xs text-[var(--muted)] mb-1 flex items-center justify-between">
                    <span className="font-medium text-navy">{d.getDate()}</span>
                    {dayBookings.length > 0 && (
                      <span className="bg-navy text-white font-display px-1.5 leading-none py-0.5 text-[10px]">
                        {dayBookings.length}
                      </span>
                    )}
                  </div>
                  <div className="space-y-1">
                    {dayBookings.slice(0, 3).map((b) => (
                      <button
                        key={b.id}
                        onClick={() => onSelect(b)}
                        className="block w-full text-left text-[11px] px-1.5 py-1 truncate hover:opacity-80"
                        style={{ background: `${SERVICE_BY_KEY[b.service_type]?.color}22`, borderLeft: `3px solid ${SERVICE_BY_KEY[b.service_type]?.color}` }}
                        data-testid={`booking-${b.id}`}
                      >
                        <span className="text-navy font-medium">{b.time}</span> · {b.customer_name}
                      </button>
                    ))}
                    {dayBookings.length > 3 && (
                      <div className="text-[10px] text-[var(--muted)]">+{dayBookings.length - 3} more</div>
                    )}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function QuotesList({ quotes, onStatus, onDelete }) {
  if (quotes.length === 0) {
    return <div className="border-2 border-[var(--border-strong)] bg-white p-8 text-center text-[var(--muted)]" data-testid="quotes-empty">No quote requests yet.</div>;
  }
  return (
    <div className="space-y-3" data-testid="quotes-list">
      {quotes.map((q) => (
        <div key={q.id} className="border-2 border-[var(--border-strong)] bg-white p-5" data-testid={`quote-${q.id}`}>
          <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
            <div>
              <div className="font-display text-xl tracking-wide text-navy">{q.name}</div>
              <div className="font-mono-tiny text-[10px] text-[var(--muted)] mt-0.5">
                {new Date(q.created_at).toLocaleString()}
                {q.service_type && <span className="ml-2">· {SERVICE_BY_KEY[q.service_type]?.name || q.service_type}</span>}
              </div>
            </div>
            <StatusBadge status={q.status} />
          </div>
          <div className="grid sm:grid-cols-2 gap-3 text-sm mb-3">
            <div className="flex items-center gap-2"><Phone className="w-3.5 h-3.5 text-navy" /> <a href={`tel:${q.phone}`} className="text-navy underline font-medium">{q.phone}</a></div>
            {q.email && <div className="text-[var(--muted)]">{q.email}</div>}
            {(q.address || q.city) && (
              <div className="flex items-center gap-2 text-[var(--muted)] sm:col-span-2">
                <MapPin className="w-3.5 h-3.5" /> {[q.address, q.city].filter(Boolean).join(", ")}
              </div>
            )}
          </div>
          <p className="text-sm text-navy bg-cream border border-[var(--border)] p-3 mb-3">{q.message}</p>
          <div className="flex flex-wrap gap-2">
            {["new", "contacted", "closed"].map((s) => (
              <button
                key={s}
                onClick={() => onStatus(q.id, s)}
                className={`text-xs uppercase tracking-widest px-3 py-1.5 border-2 transition ${
                  q.status === s ? "bg-[var(--amber)] text-navy border-navy" : "border-[var(--border-strong)] text-navy hover:border-navy"
                }`}
                data-testid={`quote-${q.id}-set-${s}`}
              >
                {s}
              </button>
            ))}
            <button onClick={() => onDelete(q.id)} className="text-xs uppercase tracking-widest px-3 py-1.5 border-2 border-[var(--border-strong)] text-[var(--muted)] hover:border-[var(--red)] hover:text-[var(--red)] ml-auto inline-flex items-center gap-1" data-testid={`quote-${q.id}-delete`}>
              <Trash2 className="w-3 h-3" /> Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

function AvailabilityForm({ config, onSave }) {
  const [cfg, setCfg] = useState(config);
  const [blockedInput, setBlockedInput] = useState("");

  const toggleDay = (idx) => {
    const days = cfg.working_days.includes(idx) ? cfg.working_days.filter((d) => d !== idx) : [...cfg.working_days, idx];
    days.sort();
    setCfg({ ...cfg, working_days: days });
  };

  const addBlocked = () => {
    if (!blockedInput) return;
    if (!/^\d{4}-\d{2}-\d{2}$/.test(blockedInput)) {
      toast.error("Use date format YYYY-MM-DD");
      return;
    }
    if (cfg.blocked_dates.includes(blockedInput)) return;
    setCfg({ ...cfg, blocked_dates: [...cfg.blocked_dates, blockedInput].sort() });
    setBlockedInput("");
  };

  const removeBlocked = (d) => {
    setCfg({ ...cfg, blocked_dates: cfg.blocked_dates.filter((x) => x !== d) });
  };

  return (
    <div className="border-2 border-[var(--border-strong)] bg-white p-6 max-w-3xl" data-testid="availability-form">
      <h2 className="font-display text-2xl tracking-wider mb-6 text-navy">Booking Availability</h2>

      <div className="mb-6">
        <div className="font-mono-tiny text-[11px] text-[var(--muted)] mb-3">WORKING DAYS</div>
        <div className="flex flex-wrap gap-2">
          {WEEKDAYS.map((w, i) => (
            <button
              key={w}
              onClick={() => toggleDay(i)}
              className={`px-4 py-2 font-display text-base border-2 transition ${
                cfg.working_days.includes(i) ? "bg-[var(--amber)] text-navy border-navy" : "border-[var(--border-strong)] text-navy hover:border-navy"
              }`}
              data-testid={`day-toggle-${i}`}
            >
              {w}
            </button>
          ))}
        </div>
      </div>

      <div className="grid sm:grid-cols-3 gap-4 mb-6">
        <div>
          <label className="block font-mono-tiny text-[11px] text-[var(--muted)] mb-2">START TIME</label>
          <input type="time" value={cfg.start_time} onChange={(e) => setCfg({ ...cfg, start_time: e.target.value })} data-testid="cfg-start" />
        </div>
        <div>
          <label className="block font-mono-tiny text-[11px] text-[var(--muted)] mb-2">END TIME</label>
          <input type="time" value={cfg.end_time} onChange={(e) => setCfg({ ...cfg, end_time: e.target.value })} data-testid="cfg-end" />
        </div>
        <div>
          <label className="block font-mono-tiny text-[11px] text-[var(--muted)] mb-2">SLOT DURATION (MIN)</label>
          <input type="number" min={30} step={15} value={cfg.slot_duration_minutes} onChange={(e) => setCfg({ ...cfg, slot_duration_minutes: parseInt(e.target.value || "0", 10) })} data-testid="cfg-duration" />
        </div>
      </div>

      <div className="mb-6">
        <div className="font-mono-tiny text-[11px] text-[var(--muted)] mb-3">BLOCKED DATES</div>
        <div className="flex gap-2 mb-3 max-w-md">
          <input type="date" value={blockedInput} onChange={(e) => setBlockedInput(e.target.value)} data-testid="cfg-blocked-input" />
          <button onClick={addBlocked} className="btn-outline-navy text-sm px-3 py-2 whitespace-nowrap" data-testid="cfg-blocked-add">
            Add
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {cfg.blocked_dates.length === 0 && <div className="text-xs text-[var(--muted)]">No blocked dates.</div>}
          {cfg.blocked_dates.map((d) => (
            <span key={d} className="inline-flex items-center gap-1 border-2 border-[var(--border-strong)] bg-cream px-2 py-1 text-xs text-navy" data-testid={`blocked-${d}`}>
              {d}
              <button onClick={() => removeBlocked(d)} className="hover:text-[var(--red)]">
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      </div>

      <button onClick={() => onSave(cfg)} className="btn-amber" data-testid="cfg-save">
        Save Changes
      </button>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="grid grid-cols-[120px_1fr] gap-3">
      <div className="font-mono-tiny text-[10px] text-[var(--muted)] pt-0.5">{label.toUpperCase()}</div>
      <div className="text-navy">{value}</div>
    </div>
  );
}

function StatusBadge({ status }) {
  const colorMap = {
    confirmed: "#3B82F6",
    completed: "#22C55E",
    cancelled: "#EF4444",
    pending: "#FFB800",
    new: "#FFB800",
    contacted: "#3B82F6",
    closed: "#94A3B8",
  };
  return (
    <span className="inline-flex items-center gap-1.5 font-mono-tiny text-[10px] text-navy">
      <span className="w-2 h-2 inline-block" style={{ background: colorMap[status] || "#94A3B8" }} />
      {status.toUpperCase()}
    </span>
  );
}
