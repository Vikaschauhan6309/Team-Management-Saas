import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { AlertTriangle, ArrowRight, CheckSquare, Clock3, ListChecks } from "lucide-react";
import PageLoader from "../UI/PageLoader";
import EmptyState from "../UI/EmptyState";
import { PriorityBadge, StatusBadge } from "../UI/Badges";
import TaskDetailsModal from "../Employee/TaskDetailsModal";
import useMyTasks from "../../Utils/useMyTasks";
import { formatDate, isOverdue } from "../../Utils/helpers";

/* Palette: ink #0E1530 · indigo #4338FF · mint #14B88A · sky #EEF1FF */

const styles = `
@import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,700;12..96,800&display=swap');
.tf-head{font-family:'Bricolage Grotesque',system-ui,sans-serif;letter-spacing:-0.03em}
@keyframes tf-rise{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}
@keyframes tf-ring{from{stroke-dashoffset:var(--c)}}
@keyframes tf-blob{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(30px,20px) scale(1.1)}}
@keyframes tf-ping{0%{transform:scale(1);opacity:.7}100%{transform:scale(2.6);opacity:0}}
@keyframes tf-wave{0%,60%,100%{transform:rotate(0)}10%,30%{transform:rotate(14deg)}20%,40%{transform:rotate(-8deg)}50%{transform:rotate(10deg)}}
.tf-rise{opacity:0;animation:tf-rise .6s cubic-bezier(.2,.7,.2,1) forwards}
.tf-ring{animation:tf-ring 1.6s .4s cubic-bezier(.2,.7,.2,1) backwards}
.tf-blob{animation:tf-blob 14s ease-in-out infinite}
.tf-ping{animation:tf-ping 2s ease-out infinite}
.tf-wave{display:inline-block;transform-origin:70% 70%;animation:tf-wave 2.4s .8s ease-in-out 1}
.tf-lift{transition:transform .3s cubic-bezier(.2,.7,.2,1),box-shadow .3s}
.tf-lift:hover{transform:translateY(-4px);box-shadow:0 20px 40px -18px rgba(67,56,255,.3)}
@media (prefers-reduced-motion:reduce){.tf-rise{animation:none;opacity:1}.tf-ring,.tf-blob,.tf-ping,.tf-wave{animation:none}}
`;

const EmployeeDashboard = () => {
  const user = useSelector((store) => store.user);
  const { tasks, updateStatus } = useMyTasks();
  const [openTaskId, setOpenTaskId] = useState(null);

  if (!tasks) return <PageLoader />;

  const count = (status) => tasks.filter((task) => task.status == status).length;
  const completed = count("completed");
  const overdue = tasks.filter(isOverdue).length;
  const completionRate = tasks.length ? Math.round((completed / tasks.length) * 100) : 0;

  // open tasks, soonest due first (tasks without a due date last)
  const upNext = tasks
    .filter((task) => task.status != "completed")
    .sort((a, b) => new Date(a.dueDate || 8.64e15) - new Date(b.dueDate || 8.64e15))
    .slice(0, 5);

  const openTask = tasks.find((task) => task._id == openTaskId);

  const stats = [
    { label: "Assigned", value: tasks.length, hint: "Total tasks", hintClass: "text-slate-400", icon: ListChecks, tile: "bg-[#EEF1FF] text-[#4338FF]" },
    { label: "In Progress", value: count("in-progress"), hint: `${count("todo")} still to do`, hintClass: "text-slate-400", icon: Clock3, tile: "bg-amber-50 text-amber-600" },
    { label: "Completed", value: completed, hint: `${completionRate}% completion rate`, hintClass: "text-emerald-600", icon: CheckSquare, tile: "bg-emerald-50 text-emerald-600" },
    {
      label: "Overdue", value: overdue,
      hint: overdue ? "Needs your attention" : "You're on track",
      hintClass: overdue ? "text-red-600" : "text-emerald-600",
      icon: AlertTriangle,
      tile: overdue ? "bg-red-50 text-red-500" : "bg-slate-100 text-slate-600",
    },
  ];

  const C = 2 * Math.PI * 52; // ring circumference
  const openCount = tasks.length - completed;

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
              {user.team ? `${user.team.name} team` : "Overview"}
            </div>

            <h1 className="tf-head mt-4 text-4xl font-extrabold sm:text-5xl">
              Welcome back, {user.name.split(" ")[0]} <span className="tf-wave">👋</span>
            </h1>
            <p className="mt-3 text-slate-300">
              {openCount
                ? `You have ${openCount} open task${openCount == 1 ? "" : "s"} to work on.`
                : "Here's a snapshot of the work assigned to you."}
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Link to="/my-tasks" className="group inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-[#0E1530] transition hover:bg-[#EEF1FF]">
                My tasks <ArrowRight size={16} className="transition group-hover:translate-x-1" />
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
                cx="60" cy="60" r="52" fill="none" stroke="url(#empRingGrad)" strokeWidth="10" strokeLinecap="round"
                strokeDasharray={C} strokeDashoffset={C - (C * completionRate) / 100}
                className="tf-ring" style={{ "--c": C }}
              />
              <defs>
                <linearGradient id="empRingGrad" x1="0" y1="0" x2="1" y2="1">
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

      {/* ================= Up Next ================= */}

      <div className="tf-rise mt-6 rounded-2xl bg-white p-6 ring-1 ring-slate-200" style={{ animationDelay: "520ms" }}>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="tf-head text-xl font-bold text-[#0E1530]">Up Next</h2>
            <p className="mt-1 text-sm text-slate-500">Open tasks ordered by due date</p>
          </div>
          <Link to="/my-tasks" className="text-sm font-semibold text-[#4338FF] transition hover:text-[#3329d9]">View all</Link>
        </div>

        {upNext.length == 0 ? (
          <EmptyState icon={CheckSquare} title="All caught up" description="You have no open tasks right now." />
        ) : (
          <div className="mt-4 space-y-1">
            {upNext.map((task, i) => {
              const late = isOverdue(task);
              return (
                <button
                  key={task._id}
                  onClick={() => setOpenTaskId(task._id)}
                  className="group -mx-3 flex w-[calc(100%+1.5rem)] flex-col gap-3 rounded-xl px-3 py-3.5 text-left transition hover:bg-[#EEF1FF] sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex min-w-0 items-center gap-4">
                    <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-bold ${late ? "bg-red-50 text-red-500" : "bg-[#EEF1FF] text-[#4338FF] group-hover:bg-white"}`}>
                      {i + 1}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-[#0E1530]">{task.title}</p>
                      <p className={`mt-1 flex items-center gap-1.5 text-xs ${late ? "font-semibold text-red-600" : "text-slate-400"}`}>
                        <Clock3 size={12} />
                        {task.dueDate ? `Due ${formatDate(task.dueDate)}` : "No due date"}
                      </p>
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center gap-2">
                    <PriorityBadge priority={task.priority} />
                    <StatusBadge status={task.status} />
                    <ArrowRight size={16} className="hidden text-slate-300 transition group-hover:translate-x-1 group-hover:text-[#4338FF] sm:block" />
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      <TaskDetailsModal
        key={openTaskId || "none"}
        task={openTask}
        onClose={() => setOpenTaskId(null)}
        onStatusChange={updateStatus}
      />
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

export default EmployeeDashboard;