import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  Building2,
  CircleCheck,
  CircleOff,
  UsersRound,
  ArrowUpRight,
  ArrowRight,
  Plus,
} from "lucide-react";
import api from "../../Utils/api";
import PageLoader from "../UI/PageLoader";
import EmptyState from "../UI/EmptyState";
import { ActiveBadge } from "../UI/Badges";
import { getErrorMessage } from "../../Utils/helpers";

/* Palette: ink #0E1530 · indigo #4338FF · mint #14B88A · sky #EEF1FF */

const styles = `
@import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,700;12..96,800&display=swap');
.tf-head{font-family:'Bricolage Grotesque',system-ui,sans-serif;letter-spacing:-0.03em}
@keyframes tf-rise{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}
@keyframes tf-fill{from{width:0}}
@keyframes tf-ring{from{stroke-dashoffset:var(--c)}}
@keyframes tf-blob{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(30px,20px) scale(1.1)}}
@keyframes tf-ping{0%{transform:scale(1);opacity:.7}100%{transform:scale(2.6);opacity:0}}
.tf-rise{opacity:0;animation:tf-rise .6s cubic-bezier(.2,.7,.2,1) forwards}
.tf-fill{animation:tf-fill 1.2s .4s cubic-bezier(.2,.7,.2,1) backwards}
.tf-ring{animation:tf-ring 1.6s .4s cubic-bezier(.2,.7,.2,1) backwards}
.tf-blob{animation:tf-blob 14s ease-in-out infinite}
.tf-ping{animation:tf-ping 2s ease-out infinite}
.tf-lift{transition:transform .3s cubic-bezier(.2,.7,.2,1),box-shadow .3s}
.tf-lift:hover{transform:translateY(-4px);box-shadow:0 20px 40px -18px rgba(67,56,255,.3)}
@media (prefers-reduced-motion:reduce){.tf-rise{animation:none;opacity:1}.tf-fill,.tf-ring,.tf-blob,.tf-ping{animation:none}}
`;

const avatarGradients = [
  "from-[#4338FF] to-[#8c85ff]",
  "from-[#14B88A] to-[#5eead4]",
  "from-[#f59e0b] to-[#fcd34d]",
  "from-[#ec4899] to-[#f9a8d4]",
];

const OwnerDashboard = () => {
  const nav = useNavigate();
  const [analytics, setAnalytics] = useState(null);
  const [recentOrgs, setRecentOrgs] = useState([]);

  useEffect(() => {
    Promise.all([
      api.get("/api/analytics"),
      api.get("/api/analytics/get-all-orgs-data"),
    ])
      .then(([analyticsRes, orgsRes]) => {
        setAnalytics(analyticsRes.data.data);
        setRecentOrgs(orgsRes.data.data || []);
      })
      .catch((error) => toast.error(getErrorMessage(error, "Could not load dashboard")));
  }, []);

  if (!analytics) return <PageLoader />;

  // aggregate returns nothing when there are no organizations yet
  const total = analytics.totalOrganizations || 0;
  const active = analytics.activeOrganizations || 0;
  const inactive = total - active;
  const admins = analytics.totalAdmins || 0;
  const activePercent = total ? Math.floor((active / total) * 100) : 0;
  const inactivePercent = total ? 100 - activePercent : 0;

  const stats = [
    { label: "Organizations", value: total, hint: "Total organizations", hintClass: "text-slate-400", icon: Building2, tile: "bg-[#EEF1FF] text-[#4338FF]" },
    { label: "Administrators", value: admins, hint: "Across all organizations", hintClass: "text-slate-400", icon: UsersRound, tile: "bg-sky-50 text-sky-600" },
    { label: "Active", value: active, hint: `${activePercent}% active`, hintClass: "text-emerald-600", icon: CircleCheck, tile: "bg-emerald-50 text-emerald-600" },
    { label: "Inactive", value: inactive, hint: "Access currently blocked", hintClass: inactive ? "text-red-600" : "text-slate-400", icon: CircleOff, tile: "bg-red-50 text-red-500" },
  ];

  const C = 2 * Math.PI * 52; // ring circumference

  return (
    <>
      <style>{styles}</style>

      {/* ================= Banner ================= */}

      <div className="tf-rise relative overflow-hidden rounded-3xl bg-[#0E1530] p-7 text-white sm:p-10">
        <div className="tf-blob pointer-events-none absolute -left-20 -top-24 h-72 w-72 rounded-full bg-[#4338FF]/40 blur-3xl" />
        <div className="tf-blob pointer-events-none absolute -bottom-24 right-10 h-72 w-72 rounded-full bg-[#14B88A]/25 blur-3xl" style={{ animationDelay: "-7s" }} />

        <div className="relative flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1.5 text-xs font-medium text-slate-200 ring-1 ring-white/10">
              <span className="relative flex h-2 w-2">
                <span className="tf-ping absolute inset-0 rounded-full bg-[#14B88A]" />
                <span className="relative h-2 w-2 rounded-full bg-[#14B88A]" />
              </span>
              Platform Overview
            </div>

            <h1 className="tf-head mt-4 text-4xl font-extrabold sm:text-5xl">Owner Dashboard</h1>
            <p className="mt-3 text-slate-300">Manage your organizations and administrators from one place.</p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button
                onClick={() => nav("/organizations", { state: { openCreate: true } })}
                className="group inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-[#0E1530] transition hover:bg-[#EEF1FF]"
              >
                <Plus size={16} /> Create organization
              </button>
              <button
                onClick={() => nav("/administrators")}
                className="rounded-xl bg-white/10 px-5 py-2.5 text-sm font-semibold ring-1 ring-white/15 transition hover:bg-white/20"
              >
                Manage administrators
              </button>
              {inactive > 0 && (
                <span className="inline-flex items-center gap-1.5 rounded-xl bg-red-500/15 px-3 py-2 text-xs font-semibold text-red-200 ring-1 ring-red-400/30">
                  <CircleOff size={14} /> {inactive} inactive
                </span>
              )}
            </div>
          </div>

          {/* Active ring */}
          <div className="relative h-40 w-40 shrink-0 self-center md:self-auto">
            <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90" role="img" aria-label={`${activePercent}% of organizations active`}>
              <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(255,255,255,.12)" strokeWidth="10" />
              <circle
                cx="60" cy="60" r="52" fill="none" stroke="url(#ringGrad)" strokeWidth="10" strokeLinecap="round"
                strokeDasharray={C} strokeDashoffset={C - (C * activePercent) / 100}
                className="tf-ring" style={{ "--c": C }}
              />
              <defs>
                <linearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#8c85ff" />
                  <stop offset="100%" stopColor="#14B88A" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="tf-head text-4xl font-extrabold tabular-nums"><CountUp to={activePercent} />%</span>
              <span className="text-xs text-slate-300">active</span>
            </div>
          </div>
        </div>
      </div>

      {/* ================= Stats ================= */}

      <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s, i) => (
          <div key={s.label} className="tf-rise tf-lift rounded-2xl bg-white p-6 ring-1 ring-slate-200" style={{ animationDelay: `${150 + i * 90}ms` }}>
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-500">{s.label}</p>
              <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${s.tile}`}><s.icon size={19} /></span>
            </div>
            <p className="tf-head mt-4 text-4xl font-extrabold tabular-nums text-[#0E1530]"><CountUp to={s.value} /></p>
            <p className={`mt-1.5 text-xs font-medium ${s.hintClass}`}>{s.hint}</p>
          </div>
        ))}
      </div>

      {/* ================= Recent Organizations + Status ================= */}

      <div className="mt-6 grid gap-6 xl:grid-cols-3">
        {/* Recent Organizations */}
        <div className="tf-rise rounded-2xl bg-white p-6 ring-1 ring-slate-200 xl:col-span-2" style={{ animationDelay: "500ms" }}>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="tf-head text-xl font-bold text-[#0E1530]">Recent Organizations</h2>
              <p className="mt-1 text-sm text-slate-500">Recently created organizations</p>
            </div>
            <Link to="/organizations" className="text-sm font-semibold text-[#4338FF] transition hover:text-[#3329d9]">View all</Link>
          </div>

          {recentOrgs.length === 0 ? (
            <EmptyState icon={Building2} title="No organizations yet" description="Create your first organization to get started." />
          ) : (
            <div className="mt-4 space-y-1">
              {recentOrgs.map((item, i) => (
                <Link
                  key={item._id}
                  to={`/organizations/${item._id}`}
                  className="group -mx-3 flex items-center justify-between gap-3 rounded-xl px-3 py-3.5 transition hover:bg-[#F8F9FD]"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-sm font-bold text-white ${avatarGradients[i % avatarGradients.length]}`}>
                      {item.name.slice(0, 1).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-[#0E1530]">{item.name}</p>
                      <p className="text-xs text-slate-400">
                        {item.adminCount} administrator{item.adminCount === 1 ? "" : "s"}
                      </p>
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center gap-3">
                    <ActiveBadge active={item.isActive} />
                    <ArrowUpRight size={17} className="text-slate-300 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#4338FF]" />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Status breakdown + quick action */}
        <div className="tf-rise flex flex-col rounded-2xl bg-white p-6 ring-1 ring-slate-200" style={{ animationDelay: "600ms" }}>
          <div>
            <h2 className="tf-head text-xl font-bold text-[#0E1530]">Access Status</h2>
            <p className="mt-1 text-sm text-slate-500">Organizations by access</p>
          </div>

          <div className="mt-6 space-y-5">
            {[
              { label: "Active", count: active, percent: activePercent, dot: "bg-[#14B88A]", bar: "from-[#14B88A] to-[#5eead4]" },
              { label: "Inactive", count: inactive, percent: inactivePercent, dot: "bg-slate-400", bar: "from-slate-300 to-slate-400" },
            ].map((row) => (
              <div key={row.label}>
                <div className="mb-2.5 flex items-center justify-between">
                  <span className="flex items-center gap-2 text-sm font-medium text-slate-600">
                    <span className={`h-2.5 w-2.5 rounded-full ${row.dot}`} />
                    {row.label}
                  </span>
                  <span className="text-sm text-slate-500">
                    <span className="font-bold text-[#0E1530]">{row.count}</span> · {row.percent}%
                  </span>
                </div>
                <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                  <div className={`tf-fill h-full rounded-full bg-gradient-to-r ${row.bar}`} style={{ width: `${row.percent}%` }} />
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => nav("/organizations", { state: { openCreate: true } })}
            className="group mt-auto flex w-full items-center justify-center gap-2 rounded-xl bg-[#0E1530] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#4338FF]"
            style={{ marginTop: "1.5rem" }}
          >
            Create organization <ArrowRight size={16} className="transition group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </>
  );
};

// Counts up to a number on first render
const CountUp = ({ to, duration = 1200 }) => {
  const [n, setN] = React.useState(0);
  React.useEffect(() => {
    let raf, start;
    const tick = (t) => {
      start = start ?? t;
      const p = Math.min((t - start) / duration, 1);
      setN(Math.round(to * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [to, duration]);
  return <>{n}</>;
};

export default OwnerDashboard;