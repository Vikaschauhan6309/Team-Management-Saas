import React from "react";
import { Link } from "react-router-dom";
import {
  Users,
  CheckSquare,
  BriefcaseBusiness,
  ArrowUpRight,
  ArrowRight,
  ListChecks,
  Clock3,
  AlertTriangle,
} from "lucide-react";
import PageLoader from "../UI/PageLoader";
import EmptyState from "../UI/EmptyState";
import { PriorityBadge, StatusBadge } from "../UI/Badges";
import useAdminWorkspace from "../../Utils/useAdminWorkspace";
import { TASK_STATUSES, formatDate, isOverdue } from "../../Utils/helpers";

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

const barColors = {
  "todo": "from-slate-300 to-slate-400",
  "in-progress": "from-[#4338FF] to-[#8c85ff]",
  "completed": "from-[#14B88A] to-[#5eead4]",
};

const dotColors = {
  "todo": "bg-slate-400",
  "in-progress": "bg-[#4338FF]",
  "completed": "bg-[#14B88A]",
};

const avatarGradients = [
  "from-[#4338FF] to-[#8c85ff]",
  "from-[#14B88A] to-[#5eead4]",
  "from-[#f59e0b] to-[#fcd34d]",
  "from-[#ec4899] to-[#f9a8d4]",
];

const AdminDashboard = () => {
  const { data } = useAdminWorkspace();

  if (!data) return <PageLoader />;

  const { teams, employees, tasks } = data;
  const activeTeams = teams.filter((team) => team.isActive);
  const activeEmployees = employees.filter((emp) => emp.isActive).length;
  const completed = tasks.filter((task) => task.status == "completed").length;
  const completionRate = tasks.length ? Math.round((completed / tasks.length) * 100) : 0;
  const overdue = tasks.filter(isOverdue).length;
  const recentTasks = [...tasks].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)).slice(0, 5);

  const stats = [
    { label: "Teams", value: activeTeams.length, hint: `${teams.length - activeTeams.length} inactive`, hintClass: "text-slate-400", icon: BriefcaseBusiness, tile: "bg-[#EEF1FF] text-[#4338FF]" },
    { label: "Employees", value: employees.length, hint: `${activeEmployees} currently active`, hintClass: "text-emerald-600", icon: Users, tile: "bg-sky-50 text-sky-600" },
    { label: "Total Tasks", value: tasks.length, hint: overdue ? `${overdue} overdue` : "Across all teams", hintClass: overdue ? "text-red-600" : "text-slate-400", icon: ListChecks, tile: "bg-amber-50 text-amber-600" },
    { label: "Completed", value: completed, hint: `${completionRate}% completion rate`, hintClass: "text-emerald-600", icon: CheckSquare, tile: "bg-emerald-50 text-emerald-600" },
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
              Organization Overview
            </div>

            <h1 className="tf-head mt-4 text-4xl font-extrabold sm:text-5xl">Admin Dashboard</h1>
            <p className="mt-3 text-slate-300">Manage your teams, employees and tasks from one place.</p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Link to="/tasks" className="group inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-[#0E1530] transition hover:bg-[#EEF1FF]">
                View tasks <ArrowRight size={16} className="transition group-hover:translate-x-1" />
              </Link>
              <Link to="/teams" className="rounded-xl bg-white/10 px-5 py-2.5 text-sm font-semibold ring-1 ring-white/15 transition hover:bg-white/20">
                Manage teams
              </Link>
              {overdue > 0 && (
                <span className="inline-flex items-center gap-1.5 rounded-xl bg-red-500/15 px-3 py-2 text-xs font-semibold text-red-200 ring-1 ring-red-400/30">
                  <AlertTriangle size={14} /> {overdue} overdue
                </span>
              )}
            </div>
          </div>

          {/* Completion ring */}
          <div className="relative h-40 w-40 shrink-0 self-center md:self-auto">
            <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
              <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(255,255,255,.12)" strokeWidth="10" />
              <circle
                cx="60" cy="60" r="52" fill="none" stroke="url(#ringGrad)" strokeWidth="10" strokeLinecap="round"
                strokeDasharray={C} strokeDashoffset={C - (C * completionRate) / 100}
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
              <span className="tf-head text-4xl font-extrabold tabular-nums"><CountUp to={completionRate} />%</span>
              <span className="text-xs text-slate-300">completed</span>
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

      {/* ================= Overview + Teams ================= */}

      <div className="mt-6 grid gap-6 xl:grid-cols-3">
        {/* Task Overview */}
        <div className="tf-rise rounded-2xl bg-white p-6 ring-1 ring-slate-200 xl:col-span-2" style={{ animationDelay: "500ms" }}>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="tf-head text-xl font-bold text-[#0E1530]">Task Overview</h2>
              <p className="mt-1 text-sm text-slate-500">Current task distribution</p>
            </div>
            <Link to="/tasks" className="text-sm font-semibold text-[#4338FF] transition hover:text-[#3329d9]">View tasks</Link>
          </div>

          <div className="mt-7 space-y-3">
            {TASK_STATUSES.map((status) => {
              const count = tasks.filter((task) => task.status == status.value).length;
              const percent = tasks.length ? Math.round((count / tasks.length) * 100) : 0;

              return (
                <Link key={status.value} to={`/tasks?status=${status.value}`} className="group -mx-3 block rounded-xl px-3 py-3 transition hover:bg-[#F8F9FD]">
                  <div className="mb-2.5 flex items-center justify-between">
                    <span className="flex items-center gap-2 text-sm font-medium text-slate-600">
                      <span className={`h-2.5 w-2.5 rounded-full ${dotColors[status.value] || "bg-slate-400"}`} />
                      {status.label}
                    </span>
                    <span className="text-sm text-slate-500">
                      <span className="font-bold text-[#0E1530]">{count}</span> · {percent}%
                    </span>
                  </div>
                  <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className={`tf-fill h-full rounded-full bg-gradient-to-r ${barColors[status.value] || "from-slate-300 to-slate-400"}`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Teams */}
        <div className="tf-rise flex flex-col rounded-2xl bg-white p-6 ring-1 ring-slate-200" style={{ animationDelay: "600ms" }}>
          <div>
            <h2 className="tf-head text-xl font-bold text-[#0E1530]">Your Teams</h2>
            <p className="mt-1 text-sm text-slate-500">Team overview</p>
          </div>

          {activeTeams.length == 0 ? (
            <p className="mt-6 text-sm text-slate-400">No active teams yet.</p>
          ) : (
            <div className="mt-5 space-y-1">
              {activeTeams.slice(0, 4).map((team, i) => {
                const count = employees.filter((emp) => emp.teamId == team._id && emp.isActive).length;

                return (
                  <Link
                    key={team._id}
                    to={`/teams/${team._id}`}
                    className="group -mx-2 flex items-center justify-between rounded-xl px-2 py-2.5 transition hover:bg-[#EEF1FF]"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br text-xs font-bold text-white ${avatarGradients[i % avatarGradients.length]}`}>
                        {team.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-[#0E1530]">{team.name}</p>
                        <p className="text-xs text-slate-400">{count} employee{count == 1 ? "" : "s"}</p>
                      </div>
                    </div>
                    <ArrowUpRight size={17} className="text-slate-300 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#4338FF]" />
                  </Link>
                );
              })}
            </div>
          )}

          <Link to="/teams" className="mt-auto flex w-full justify-center rounded-xl bg-[#0E1530] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#4338FF]" style={{ marginTop: "1.25rem" }}>
            View all teams
          </Link>
        </div>
      </div>

      {/* ================= Recent Activity ================= */}

      <div className="tf-rise mt-6 rounded-2xl bg-white p-6 ring-1 ring-slate-200" style={{ animationDelay: "700ms" }}>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="tf-head text-xl font-bold text-[#0E1530]">Recent Activity</h2>
            <p className="mt-1 text-sm text-slate-500">Most recently updated tasks in your organization</p>
          </div>
          <Link to="/tasks" className="text-sm font-semibold text-[#4338FF] transition hover:text-[#3329d9]">View all</Link>
        </div>

        {recentTasks.length == 0 ? (
          <EmptyState icon={ListChecks} title="No tasks yet" description="Tasks you create will show up here." />
        ) : (
          <div className="mt-4 space-y-1">
            {recentTasks.map((task, i) => (
              <div key={task._id} className="-mx-3 flex flex-col gap-3 rounded-xl px-3 py-3.5 transition hover:bg-[#F8F9FD] sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-sm font-bold text-white ${avatarGradients[i % avatarGradients.length]}`}>
                    {(task.assignedTo?.name || "?").slice(0, 1).toUpperCase()}
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-sm text-slate-600">
                      <span className="font-semibold text-[#0E1530]">{task.title}</span>
                      {" · "}
                      {task.assignedTo?.name || "Unassigned"}
                      {task.teamId?.name && <span className="text-slate-400"> in {task.teamId.name}</span>}
                    </p>
                    <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-400">
                      <Clock3 size={12} />
                      Updated {formatDate(task.updatedAt)}
                    </div>
                  </div>
                </div>

                <div className="flex shrink-0 gap-2">
                  <PriorityBadge priority={task.priority} />
                  <StatusBadge status={task.status} />
                </div>
              </div>
            ))}
          </div>
        )}
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

export default AdminDashboard;