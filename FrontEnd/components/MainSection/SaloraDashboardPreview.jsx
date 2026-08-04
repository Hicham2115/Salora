'use client';

import { useState } from 'react';
import {
  LayoutDashboard,
  Calendar,
  Users,
  BriefcaseBusiness,
  TrendingUp,
  Settings,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// ─── Data ───
const STATS = [
  { label: "Today's bookings", value: '8', delta: '+2 from yesterday' },
  { label: 'This week', value: '34', delta: '↑ 18%' },
  { label: 'Revenue (MAD)', value: '2,480', delta: 'This week' },
  { label: 'Active clients', value: '142', delta: '↑ 8 new' },
];

const APPOINTMENTS = [
  { time: '09:00', name: 'Hamza Alaoui', service: 'Haircut + Beard', status: 'confirmed' },
  { time: '10:30', name: 'Karim Benali', service: 'Classic Haircut', status: 'confirmed' },
  { time: '11:30', name: 'Omar Tahiri', service: 'Premium Shave', status: 'pending' },
  { time: '14:00', name: 'Mehdi Chaoui', service: 'Beard Styling', status: 'confirmed' },
];

const NAV = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'bookings', label: 'Bookings', icon: Calendar },
  { id: 'clients', label: 'Clients', icon: Users },
  { id: 'services', label: 'Services', icon: BriefcaseBusiness },
  { id: 'analytics', label: 'Analytics', icon: TrendingUp },
];

const SETTINGS_ITEM = { id: 'settings', label: 'Settings', icon: Settings };

// April 2026 calendar (Mon-first), with sample booked days
const BOOKED_DAYS = [2, 3, 8, 10, 14, 17, 20, 22, 23];
const TODAY = 28;

function buildCalendar() {
  const days = [31];
  for (let d = 1; d <= 30; d++) days.push(d);
  return days;
}

const CAL_DAYS = buildCalendar();

// ─── Sub-components ───
function NavItem({ item, active, onClick }) {
  const Icon = item.icon;
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex w-full items-center gap-3 rounded-[10px] px-4 py-3 text-left text-sm font-medium transition-colors',
        'sm:justify-center sm:gap-0 sm:p-3 lg:justify-start lg:gap-3 lg:px-4 lg:py-3',
        active ? 'bg-[#D4A954] font-semibold text-[#171208]' : 'text-white hover:bg-white/5',
      )}
    >
      <Icon size={18} className="shrink-0" />
      <span className="sm:hidden lg:inline">{item.label}</span>
    </button>
  );
}

function StatCard({ label, value, delta }) {
  return (
    <div className="flex flex-col gap-2 rounded-[14px] border border-white/10 bg-[#141414] px-[22px] py-5">
      <div className="text-[13px] font-medium text-neutral-400">{label}</div>
      <div className="font-[Plus_Jakarta_Sans,sans-serif] text-2xl leading-none font-extrabold tracking-[-1px] text-white sm:text-[28px] lg:text-4xl">
        {value}
      </div>
      <div className="text-xs font-semibold text-green-400">{delta}</div>
    </div>
  );
}

function AppointmentRow({ appt }) {
  const isPending = appt.status === 'pending';
  return (
    <div className="flex items-center gap-3.5 rounded-xl border border-white/10 bg-[#141414] px-4 py-3.5">
      <div className="min-w-14 shrink-0 rounded-lg bg-[#0A0A0A] px-2.5 py-1.5 text-center text-[13px] font-bold text-white">
        {appt.time}
      </div>
      <div className="min-w-0 flex-1">
        <div className="truncate text-sm font-bold text-white">{appt.name}</div>
        <div className="mt-0.5 truncate text-xs text-neutral-400">{appt.service}</div>
      </div>
      <span
        className={cn(
          'shrink-0 rounded-full px-2.5 py-1 text-[11px] font-bold',
          isPending ? 'bg-amber-500/15 text-amber-400' : 'bg-green-400/15 text-green-400',
        )}
      >
        {isPending ? 'Pending' : 'Confirmed'}
      </span>
    </div>
  );
}

function CalendarCell({ day }) {
  if (day === null) return <div className="aspect-square" />;

  const isToday = day === TODAY;
  const isBooked = BOOKED_DAYS.includes(day);
  const isPrevMonth = day === 31;

  return (
    <div
      className={cn(
        'flex aspect-square cursor-pointer items-center justify-center rounded-[10px] text-sm transition-colors',
        isToday && 'bg-[#D4A954] font-extrabold text-[#171208]',
        !isToday && isBooked && 'bg-[#D4A954]/[0.22] font-bold text-[#D4A954]',
        !isToday && !isBooked && 'font-medium hover:bg-white/5',
        !isToday && !isBooked && (isPrevMonth ? 'text-neutral-400' : 'text-white'),
      )}
    >
      {day}
    </div>
  );
}

// ─── Main Component ───
export default function SaloraDashboardPreview() {
  const [activeNav, setActiveNav] = useState('dashboard');

  return (
    <div className="mx-auto max-w-[1280px] overflow-hidden rounded-2xl border border-white/10 bg-[#141414] font-[DM_Sans,system-ui,-apple-system,sans-serif] text-white shadow-[0_24px_80px_rgba(0,0,0,0.5)] sm:rounded-3xl">
      {/* Window chrome */}
      <div className="relative flex items-center gap-2 bg-[#D4A954] px-5 py-3.5">
        <div className="flex gap-1.5">
          <div className="h-3 w-3 rounded-full bg-[#FF5F57]" />
          <div className="h-3 w-3 rounded-full bg-[#FEBC2E]" />
          <div className="h-3 w-3 rounded-full bg-[#28C840]" />
        </div>
        <div className="absolute left-1/2 -translate-x-1/2 text-[13px] font-semibold text-white/85">
          Salora Dashboard
        </div>
      </div>

      {/* Body */}
      <div className="grid min-h-0 grid-cols-1 sm:min-h-[560px] sm:grid-cols-[60px_1fr] lg:min-h-[680px] lg:grid-cols-[240px_1fr]">
        {/* Sidebar */}
        <aside className="hidden flex-col gap-1.5 border-r border-white/10 bg-[#141414] sm:flex sm:items-center sm:p-4 lg:items-stretch lg:p-6">
          {NAV.map((item) => (
            <NavItem
              key={item.id}
              item={item}
              active={activeNav === item.id}
              onClick={() => setActiveNav(item.id)}
            />
          ))}
          <div className="flex-1" />
          <NavItem
            item={SETTINGS_ITEM}
            active={activeNav === 'settings'}
            onClick={() => setActiveNav('settings')}
          />
        </aside>

        {/* Main */}
        <main className="overflow-auto bg-[#0A0A0A] p-4 sm:p-5 lg:p-9">
          {/* Header */}
          <header className="mb-5 flex flex-col items-start gap-4 sm:mb-7 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h1 className="m-0 flex items-center gap-2.5 font-[Plus_Jakarta_Sans,sans-serif] text-lg font-extrabold tracking-[-0.5px] sm:text-[22px] lg:text-3xl lg:tracking-[-1px]">
                Good morning, Youssef <span className="text-[22px]">✦</span>
              </h1>
              <p className="mt-1.5 text-sm text-neutral-400">
                Monday, April 28 · 3 appointments today
              </p>
            </div>
            <button className="w-full shrink-0 rounded-[10px] bg-[#D4A954] px-5 py-3 text-sm font-bold whitespace-nowrap text-white transition-opacity hover:opacity-90 sm:w-auto">
              + New Booking
            </button>
          </header>

          {/* Stats */}
          <div className="mb-4 grid grid-cols-2 gap-2 sm:mb-7 sm:gap-2.5 lg:grid-cols-4 lg:gap-3.5">
            {STATS.map((s) => (
              <StatCard key={s.label} {...s} />
            ))}
          </div>

          {/* Calendar + Appointments */}
          <div className="grid grid-cols-1 gap-4 sm:gap-5 lg:grid-cols-[1.6fr_1fr]">
            {/* Calendar */}
            <div className="rounded-[14px] border border-white/10 bg-[#141414] p-[22px]">
              <div className="mb-4 flex items-center justify-between">
                <div className="text-[15px] font-bold text-white">April 2026</div>
                <div className="flex gap-1">
                  <button
                    aria-label="Previous month"
                    className="flex h-7 w-7 items-center justify-center rounded-md border border-white/10 bg-[#0A0A0A] hover:bg-white/5"
                  >
                    <ChevronLeft size={14} strokeWidth={2.5} />
                  </button>
                  <button
                    aria-label="Next month"
                    className="flex h-7 w-7 items-center justify-center rounded-md border border-white/10 bg-[#0A0A0A] hover:bg-white/5"
                  >
                    <ChevronRight size={14} strokeWidth={2.5} />
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-7 gap-2">
                {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map((d) => (
                  <div
                    key={d}
                    className="py-1 text-center text-[11px] font-semibold text-neutral-400"
                  >
                    {d}
                  </div>
                ))}
                {CAL_DAYS.map((d, i) => (
                  <CalendarCell key={i} day={d} />
                ))}
              </div>
            </div>

            {/* Today's Appointments */}
            <div>
              <div className="mb-3.5 text-[15px] font-bold">Today's Appointments</div>
              <div className="flex flex-col gap-2.5">
                {APPOINTMENTS.map((a) => (
                  <AppointmentRow key={a.time} appt={a} />
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
