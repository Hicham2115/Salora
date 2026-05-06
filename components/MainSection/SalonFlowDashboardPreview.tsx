'use client';

import { useState } from 'react';

// ─── Tokens (match SalonFlow brand) ───
const COLORS = {
  primary: '#1B4332',
  primaryDeep: '#0D1B14',
  primaryLight: '#52B788',
  accent: '#95D5B2',
  accentSoft: '#DCFCE7',
  bg: '#F8F5F0',
  warm: '#F0EDE8',
  warmDeep: '#E8E2D9',
  border: '#E2DDD8',
  text: '#0D1B14',
  textMuted: '#6B7C74',
  surface: '#FFFFFF',
  pendingBg: '#FEF3C7',
  pendingText: '#92400E',
};

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
  { id: 'dashboard', label: 'Dashboard', icon: 'M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z' },
  { id: 'bookings', label: 'Bookings', icon: 'M3 4h18a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zM16 2v4M8 2v4M3 10h18' },
  { id: 'clients', label: 'Clients', icon: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 7a4 4 0 1 0 0 8 4 4 0 0 0 0-8z' },
  { id: 'services', label: 'Services', icon: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77 5.82 21.02 7 14.14 2 9.27l6.91-1.01L12 2z' },
  { id: 'analytics', label: 'Analytics', icon: 'M12 2v10l4 2M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0z' },
];

// April 2026 calendar (Mon-first), with sample booked days
const BOOKED_DAYS = [2, 3, 8, 10, 14, 17, 20, 22, 23];
const TODAY = 28;

function buildCalendar() {
  const days: (number | null)[] = [];
  days.push(31);
  for (let d = 1; d <= 6; d++) days.push(d);
  for (let d = 7; d <= 30; d++) days.push(d);
  return days;
}

const CAL_DAYS = buildCalendar();

// ─── Sub-components ───
function NavItem({
  item,
  active,
  onClick,
}: {
  item: (typeof NAV)[number];
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="sfp-nav-btn"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        width: '100%',
        padding: '12px 16px',
        borderRadius: 10,
        border: 'none',
        background: active ? COLORS.primary : 'transparent',
        color: active ? 'white' : COLORS.text,
        fontFamily: 'inherit',
        fontSize: 14,
        fontWeight: active ? 600 : 500,
        cursor: 'pointer',
        textAlign: 'left',
        transition: 'background 0.15s',
      }}
      onMouseEnter={(e) => {
        if (!active) e.currentTarget.style.background = COLORS.warm;
      }}
      onMouseLeave={(e) => {
        if (!active) e.currentTarget.style.background = 'transparent';
      }}
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ flexShrink: 0 }}
      >
        <path d={item.icon} />
      </svg>
      <span className="sfp-nav-label">{item.label}</span>
    </button>
  );
}

function StatCard({ label, value, delta }: (typeof STATS)[number]) {
  return (
    <div
      style={{
        background: COLORS.warm,
        border: `1px solid ${COLORS.border}`,
        borderRadius: 14,
        padding: '20px 22px',
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
      }}
    >
      <div style={{ fontSize: 13, color: COLORS.textMuted, fontWeight: 500 }}>{label}</div>
      <div className="sfp-stat-value"
        style={{
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontSize: 36,
          fontWeight: 800,
          color: COLORS.text,
          letterSpacing: '-1px',
          lineHeight: 1,
        }}
      >
        {value}
      </div>
      <div style={{ fontSize: 12, color: COLORS.primaryLight, fontWeight: 600 }}>{delta}</div>
    </div>
  );
}

function AppointmentRow({ appt }: { appt: (typeof APPOINTMENTS)[number] }) {
  const isPending = appt.status === 'pending';
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        padding: '14px 16px',
        background: 'white',
        border: `1px solid ${COLORS.border}`,
        borderRadius: 12,
      }}
    >
      <div
        style={{
          background: COLORS.warm,
          padding: '6px 10px',
          borderRadius: 8,
          fontSize: 13,
          fontWeight: 700,
          color: COLORS.text,
          minWidth: 56,
          textAlign: 'center',
          flexShrink: 0,
        }}
      >
        {appt.time}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: COLORS.text, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{appt.name}</div>
        <div style={{ fontSize: 12, color: COLORS.textMuted, marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{appt.service}</div>
      </div>
      <span
        style={{
          fontSize: 11,
          fontWeight: 700,
          padding: '4px 10px',
          borderRadius: 100,
          background: isPending ? COLORS.pendingBg : COLORS.accentSoft,
          color: isPending ? COLORS.pendingText : COLORS.primary,
          flexShrink: 0,
        }}
      >
        {isPending ? 'Pending' : 'Confirmed'}
      </span>
    </div>
  );
}

function CalendarCell({ day }: { day: number | null }) {
  if (day === null)
    return <div style={{ aspectRatio: '1', background: 'transparent' }} />;

  const isToday = day === TODAY;
  const isBooked = BOOKED_DAYS.includes(day);

  let bg = 'transparent';
  let color = COLORS.text;
  let fontWeight: 400 | 600 | 700 | 800 = 500;

  if (isToday) {
    bg = COLORS.primaryDeep;
    color = 'white';
    fontWeight = 800;
  } else if (isBooked) {
    bg = COLORS.accent;
    color = COLORS.primaryDeep;
    fontWeight = 700;
  }

  return (
    <div
      style={{
        aspectRatio: '1',
        borderRadius: 10,
        background: bg,
        color: day === 31 ? COLORS.textMuted : color,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 14,
        fontWeight,
        cursor: 'pointer',
        transition: 'transform 0.15s',
      }}
      onMouseEnter={(e) => {
        if (!isToday && !isBooked) e.currentTarget.style.background = COLORS.warm;
      }}
      onMouseLeave={(e) => {
        if (!isToday && !isBooked) e.currentTarget.style.background = 'transparent';
      }}
    >
      {day}
    </div>
  );
}

// ─── Main Component ───
export default function SalonFlowDashboardPreview() {
  const [activeNav, setActiveNav] = useState('dashboard');

  return (
    <>
      <style>{`
        .sfp-root {
          background: white;
          border-radius: 24px;
          overflow: hidden;
          box-shadow: 0 24px 80px rgba(27,67,50,0.18);
          border: 1px solid ${COLORS.border};
          font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
          color: ${COLORS.text};
          max-width: 1280px;
          margin: 0 auto;
        }
        .sfp-body {
          display: grid;
          grid-template-columns: 240px 1fr;
          min-height: 680px;
        }
        .sfp-sidebar {
          background: white;
          border-right: 1px solid ${COLORS.border};
          padding: 24px 16px;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .sfp-nav-label {
          /* visible by default */
        }
        .sfp-main {
          background: ${COLORS.bg};
          padding: 32px 36px;
          overflow: auto;
        }
        .sfp-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          margin-bottom: 28px;
          gap: 16px;
        }
        .sfp-h1 {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 30px;
          font-weight: 800;
          letter-spacing: -1px;
          margin: 0;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .sfp-stats {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 14px;
          margin-bottom: 28px;
        }
        .sfp-stat-value {
          /* font-size set inline, overridden below */
        }
        .sfp-grid {
          display: grid;
          grid-template-columns: 1.6fr 1fr;
          gap: 20px;
        }
        .sfp-new-booking-btn {
          background: ${COLORS.primary};
          color: white;
          border: none;
          padding: 12px 20px;
          border-radius: 10px;
          font-family: inherit;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          transition: background 0.15s;
          white-space: nowrap;
          flex-shrink: 0;
        }

        /* Tablet: icon-only sidebar */
        @media (max-width: 1024px) {
          .sfp-body {
            grid-template-columns: 60px 1fr;
            min-height: 560px;
          }
          .sfp-sidebar {
            padding: 16px 8px;
            align-items: center;
          }
          .sfp-nav-label {
            display: none;
          }
          .sfp-nav-btn {
            justify-content: center;
            padding: 12px !important;
            gap: 0 !important;
          }
          .sfp-stats {
            grid-template-columns: repeat(2, 1fr);
            gap: 10px;
          }
          .sfp-stat-value {
            font-size: 28px !important;
          }
          .sfp-grid {
            grid-template-columns: 1fr;
          }
          .sfp-main {
            padding: 24px 20px;
          }
          .sfp-h1 {
            font-size: 22px;
          }
        }

        /* Mobile: no sidebar */
        @media (max-width: 640px) {
          .sfp-root {
            border-radius: 16px;
          }
          .sfp-body {
            grid-template-columns: 1fr;
            min-height: auto;
          }
          .sfp-sidebar {
            display: none;
          }
          .sfp-main {
            padding: 16px;
          }
          .sfp-header {
            flex-direction: column;
            align-items: flex-start;
            margin-bottom: 20px;
          }
          .sfp-h1 {
            font-size: 18px;
            letter-spacing: -0.5px;
          }
          .sfp-new-booking-btn {
            width: 100%;
            text-align: center;
          }
          .sfp-stats {
            grid-template-columns: repeat(2, 1fr);
            gap: 8px;
            margin-bottom: 16px;
          }
          .sfp-stat-value {
            font-size: 24px !important;
          }
          .sfp-grid {
            grid-template-columns: 1fr;
            gap: 16px;
          }
        }
      `}</style>

      <div className="sfp-root">
        {/* Window chrome */}
        <div
          style={{
            background: COLORS.primary,
            padding: '14px 20px',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            position: 'relative',
          }}
        >
          <div style={{ display: 'flex', gap: 7 }}>
            <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#FF5F57' }} />
            <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#FEBC2E' }} />
            <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#28C840' }} />
          </div>
          <div
            style={{
              position: 'absolute',
              left: '50%',
              transform: 'translateX(-50%)',
              color: 'rgba(255,255,255,0.85)',
              fontSize: 13,
              fontWeight: 600,
            }}
          >
            SalonFlow Dashboard
          </div>
        </div>

        {/* Body */}
        <div className="sfp-body">
          {/* Sidebar */}
          <aside className="sfp-sidebar">
            {NAV.map((item) => (
              <NavItem
                key={item.id}
                item={item}
                active={activeNav === item.id}
                onClick={() => setActiveNav(item.id)}
              />
            ))}
            <div style={{ flex: 1 }} />
            <NavItem
              item={{
                id: 'settings',
                label: 'Settings',
                icon: 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z',
              }}
              active={activeNav === 'settings'}
              onClick={() => setActiveNav('settings')}
            />
          </aside>

          {/* Main */}
          <main className="sfp-main">
            {/* Header */}
            <header className="sfp-header">
              <div>
                <h1 className="sfp-h1">
                  Good morning, Youssef <span style={{ fontSize: 22 }}>✦</span>
                </h1>
                <p style={{ color: COLORS.textMuted, fontSize: 14, marginTop: 6, margin: '6px 0 0' }}>
                  Monday, April 28 · 3 appointments today
                </p>
              </div>
              <button
                className="sfp-new-booking-btn"
                onMouseEnter={(e) => (e.currentTarget.style.background = COLORS.primaryDeep)}
                onMouseLeave={(e) => (e.currentTarget.style.background = COLORS.primary)}
              >
                + New Booking
              </button>
            </header>

            {/* Stats */}
            <div className="sfp-stats">
              {STATS.map((s) => (
                <StatCard key={s.label} {...s} />
              ))}
            </div>

            {/* Calendar + Appointments */}
            <div className="sfp-grid">
              {/* Calendar */}
              <div
                style={{
                  background: COLORS.warm,
                  border: `1px solid ${COLORS.border}`,
                  borderRadius: 14,
                  padding: 22,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                  <div style={{ fontWeight: 700, fontSize: 15, color: COLORS.text }}>April 2026</div>
                  <div style={{ display: 'flex', gap: 4 }}>
                    <button
                      aria-label="Previous month"
                      style={{
                        width: 28,
                        height: 28,
                        border: `1px solid ${COLORS.border}`,
                        background: 'white',
                        borderRadius: 6,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                        <path d="m15 18-6-6 6-6" />
                      </svg>
                    </button>
                    <button
                      aria-label="Next month"
                      style={{
                        width: 28,
                        height: 28,
                        border: `1px solid ${COLORS.border}`,
                        background: 'white',
                        borderRadius: 6,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                        <path d="m9 18 6-6-6-6" />
                      </svg>
                    </button>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 8 }}>
                  {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map((d) => (
                    <div
                      key={d}
                      style={{ fontSize: 11, color: COLORS.textMuted, fontWeight: 600, textAlign: 'center', padding: '4px 0' }}
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
                <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 14 }}>Today's Appointments</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {APPOINTMENTS.map((a) => (
                    <AppointmentRow key={a.time} appt={a} />
                  ))}
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
