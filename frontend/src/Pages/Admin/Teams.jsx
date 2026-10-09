import { useState } from "react";
import { Link } from "react-router-dom";
import { BriefcaseBusiness, CheckSquare, ChevronDown, Pencil, Plus, Power, PowerOff, Search, Users, X } from "lucide-react";
import PageLoader from "../../Components/UI/PageLoader";
import EmptyState from "../../Components/UI/EmptyState";
import ConfirmDialog from "../../Components/UI/ConfirmDialog";
import { ActiveBadge } from "../../Components/UI/Badges";
import TeamFormModal from "../../Components/Admin/TeamFormModal";
import useAdminWorkspace from "../../Utils/useAdminWorkspace";
import { toggleTeam } from "../../Utils/teams";
import { formatDate } from "../../Utils/helpers";

/* Palette: ink #0E1530 · indigo #4338FF · mint #14B88A · sky #EEF1FF */

const styles = `
@import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,700;12..96,800&display=swap');
.tf-head{font-family:'Bricolage Grotesque',system-ui,sans-serif;letter-spacing:-0.03em}
@keyframes tf-rise{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}
@keyframes tf-fill{from{width:0}}
.tf-rise{opacity:0;animation:tf-rise .6s cubic-bezier(.2,.7,.2,1) forwards}
.tf-fill{animation:tf-fill 1.2s .4s cubic-bezier(.2,.7,.2,1) backwards}
.tf-lift{transition:transform .3s cubic-bezier(.2,.7,.2,1),box-shadow .3s}
.tf-lift:hover{transform:translateY(-4px);box-shadow:0 20px 40px -18px rgba(67,56,255,.3)}
@media (prefers-reduced-motion:reduce){.tf-rise{animation:none;opacity:1}.tf-fill{animation:none}.tf-lift:hover{transform:none}}
`;

// Local style tokens (replace ../../Utils/styles for this file)
const focusRing =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4338FF]";
const fieldClass =
  "w-full rounded-xl bg-white px-4 py-2.5 text-sm text-[#0E1530] ring-1 ring-slate-200 transition placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#4338FF]";
const primaryButton = `inline-flex items-center justify-center gap-2 rounded-xl bg-[#0E1530] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#4338FF] disabled:cursor-not-allowed disabled:opacity-60 ${focusRing}`;
const iconButton = `rounded-lg p-2 text-slate-400 transition ${focusRing}`;

const avatarGradients = [
  "from-[#4338FF] to-[#8c85ff]",
  "from-[#14B88A] to-[#5eead4]",
  "from-[#f59e0b] to-[#fcd34d]",
  "from-[#ec4899] to-[#f9a8d4]",
];

const Teams = () => {
  const { data, upsert } = useAdminWorkspace();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [formState, setFormState] = useState({ open: false, team: null });
  const [confirmTarget, setConfirmTarget] = useState(null);

  if (!data) return <PageLoader />;

  const filtered = data.teams.filter((team) => {
    const matchesSearch = team.name.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = !statusFilter || String(team.isActive) === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const openCreate = () => setFormState({ open: true, team: null });

  return (
    <>
      <style>{styles}</style>

      {/* Header */}
      <div className="tf-rise flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="tf-head text-4xl font-extrabold text-[#0E1530]">Teams</h1>
          <p className="mt-1 text-slate-500">Create teams and organize your employees.</p>
        </div>

        <button onClick={openCreate} className={primaryButton}>
          <Plus size={17} />
          New team
        </button>
      </div>

      {/* Toolbar */}
      <div className="tf-rise mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between" style={{ animationDelay: "100ms" }}>
        <div className="relative sm:w-72">
          <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search teams..."
            aria-label="Search teams"
            className={`${fieldClass} pl-10 pr-9`}
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              aria-label="Clear search"
              className={`absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 ${focusRing}`}
            >
              <X size={14} />
            </button>
          )}
        </div>

        <div className="relative sm:w-48">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            aria-label="Filter by status"
            className={`${fieldClass} cursor-pointer appearance-none pr-10`}
          >
            <option value="">All statuses</option>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
          <ChevronDown size={16} className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="tf-rise mt-6 rounded-2xl bg-white p-6 ring-1 ring-slate-200" style={{ animationDelay: "180ms" }}>
          <EmptyState
            icon={BriefcaseBusiness}
            title={data.teams.length === 0 ? "No teams yet" : "No teams found"}
            description={data.teams.length === 0 ? "Create a team to start adding employees and tasks." : "Try changing your search or filters."}
            action={
              data.teams.length === 0 && (
                <button onClick={openCreate} className={primaryButton}>
                  <Plus size={17} />
                  New team
                </button>
              )
            }
          />
        </div>
      ) : (
        <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((team, i) => {
            const members = data.employees.filter((emp) => emp.teamId === team._id);
            const teamTasks = data.tasks.filter((task) => task.teamId?._id === team._id);
            const done = teamTasks.filter((task) => task.status === "completed").length;
            const percent = teamTasks.length ? Math.round((done / teamTasks.length) * 100) : 0;

            return (
              <div
                key={team._id}
                className="tf-rise tf-lift flex flex-col rounded-2xl bg-white p-5 ring-1 ring-slate-200"
                style={{ animationDelay: `${Math.min(i, 8) * 60 + 180}ms` }}
              >
                <div className="flex items-start justify-between gap-3">
                  <Link to={`/teams/${team._id}`} className={`group flex min-w-0 items-center gap-3 rounded-lg ${focusRing}`}>
                    <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-xs font-bold text-white ${avatarGradients[i % avatarGradients.length]}`}>
                      {team.name.slice(0, 2).toUpperCase()}
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-[#0E1530] transition group-hover:text-[#4338FF]">{team.name}</p>
                      <p className="text-xs text-slate-400">Created {formatDate(team.createdAt)}</p>
                    </div>
                  </Link>

                  <ActiveBadge active={team.isActive} />
                </div>

                <div className="mt-5 grid grid-cols-2 gap-3">
                  <div className="rounded-xl bg-[#F8F9FD] px-3 py-2.5">
                    <p className="flex items-center gap-1.5 text-xs text-slate-500"><Users size={13} /> Employees</p>
                    <p className="tf-head mt-1 text-2xl font-extrabold tabular-nums text-[#0E1530]">{members.filter((emp) => emp.isActive).length}</p>
                  </div>

                  <div className="rounded-xl bg-[#F8F9FD] px-3 py-2.5">
                    <p className="flex items-center gap-1.5 text-xs text-slate-500"><CheckSquare size={13} /> Tasks done</p>
                    <p className="tf-head mt-1 text-2xl font-extrabold tabular-nums text-[#0E1530]">
                      {done}<span className="text-sm font-medium text-slate-400">/{teamTasks.length}</span>
                    </p>
                  </div>
                </div>

                {teamTasks.length > 0 && (
                  <div
                    className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100"
                    role="img"
                    aria-label={`${percent}% of tasks completed`}
                  >
                    <div className="tf-fill h-full rounded-full bg-gradient-to-r from-[#14B88A] to-[#5eead4]" style={{ width: `${percent}%` }} />
                  </div>
                )}

                <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
                  <Link to={`/teams/${team._id}`} className={`rounded-md text-sm font-semibold text-[#4338FF] transition hover:text-[#3329d9] ${focusRing}`}>
                    View team
                  </Link>

                  <div className="flex gap-1">
                    <button
                      title="Rename"
                      aria-label={`Rename ${team.name}`}
                      onClick={() => setFormState({ open: true, team })}
                      className={`${iconButton} hover:bg-[#EEF1FF] hover:text-[#4338FF]`}
                    >
                      <Pencil size={16} />
                    </button>

                    <button
                      title={team.isActive ? "Deactivate" : "Reactivate"}
                      aria-label={`${team.isActive ? "Deactivate" : "Reactivate"} ${team.name}`}
                      onClick={() => setConfirmTarget(team)}
                      className={team.isActive ? `${iconButton} hover:bg-red-50 hover:text-red-600` : `${iconButton} hover:bg-emerald-50 hover:text-emerald-600`}
                    >
                      {team.isActive ? <PowerOff size={16} /> : <Power size={16} />}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <TeamFormModal
        key={formState.open ? formState.team?._id || "new" : "closed"}
        open={formState.open}
        team={formState.team}
        onClose={() => setFormState({ open: false, team: null })}
        onSaved={(team) => upsert("teams", team)}
      />

      <ConfirmDialog
        open={Boolean(confirmTarget)}
        onClose={() => setConfirmTarget(null)}
        onConfirm={() => toggleTeam(confirmTarget).then((team) => upsert("teams", team))}
        title={confirmTarget?.isActive ? "Deactivate team?" : "Reactivate team?"}
        message={
          confirmTarget?.isActive
            ? `No new employees or tasks can be added to ${confirmTarget?.name} while it is inactive.`
            : `${confirmTarget?.name} will be available for employees and tasks again.`
        }
        confirmLabel={confirmTarget?.isActive ? "Deactivate" : "Reactivate"}
        danger={confirmTarget?.isActive}
      />
    </>
  );
};

export default Teams;