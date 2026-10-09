import { useState } from "react";
import toast from "react-hot-toast";
import { ArrowRight, BriefcaseBusiness, ChevronDown } from "lucide-react";
import Modal from "../UI/Modal";
import api from "../../Utils/api";
import { getErrorMessage, initials } from "../../Utils/helpers";

/* Palette: ink #0E1530 · indigo #4338FF · mint #14B88A · sky #EEF1FF */

const styles = `
@keyframes tf-rise{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}
@keyframes tf-pop{0%{transform:scale(.85)}60%{transform:scale(1.06)}100%{transform:scale(1)}}
@keyframes tf-nudge{0%,100%{transform:translateX(0)}50%{transform:translateX(5px)}}
@keyframes tf-shine{0%{transform:translateX(-120%) skewX(-20deg)}60%,100%{transform:translateX(450%) skewX(-20deg)}}
.tf-rise{opacity:0;animation:tf-rise .5s cubic-bezier(.2,.7,.2,1) forwards}
.tf-pop{animation:tf-pop .35s cubic-bezier(.2,.7,.2,1)}
.tf-nudge{animation:tf-nudge 1.4s ease-in-out infinite}
.tf-shine::after{content:"";position:absolute;inset:0;width:25%;background:linear-gradient(90deg,transparent,rgba(255,255,255,.35),transparent);animation:tf-shine 3.5s ease-in-out infinite}
@media (prefers-reduced-motion:reduce){.tf-rise{animation:none;opacity:1}.tf-pop,.tf-nudge,.tf-shine::after{animation:none}}
`;

const inputCls =
  "h-12 w-full appearance-none rounded-xl border border-slate-200 bg-white pl-11 pr-10 text-sm text-slate-900 outline-none transition hover:border-slate-300 focus:border-[#4338FF] focus:ring-4 focus:ring-[#4338FF]/10";
const secondaryCls =
  "rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 ring-1 ring-slate-200 transition hover:bg-slate-50 hover:ring-slate-300";
const primaryCls =
  "tf-shine group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-xl bg-[#4338FF] px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-[#4338FF]/30 transition hover:bg-[#3329d9] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 disabled:shadow-none";

// Render with a `key` so the selection resets per employee
const MoveEmployeeModal = ({ open, onClose, employee, teams, onMoved }) => {
  const activeTeams = teams.filter((team) => team.isActive);
  const [teamId, setTeamId] = useState(employee?.teamId || "");
  const [saving, setSaving] = useState(false);

  if (!employee) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setSaving(true);

    api
      .patch(`/api/admin/employees/${employee._id}`, { teamId })
      .then((res) => {
        toast.success(`${employee.name} moved`);
        onMoved(res.data.data);
        onClose();
      })
      .catch((error) => toast.error(getErrorMessage(error)))
      .finally(() => setSaving(false));
  };

  const fromName = teams.find((team) => team._id == employee.teamId)?.name || "No team";
  const toName = teams.find((team) => team._id == teamId)?.name;
  const changed = Boolean(teamId) && teamId != employee.teamId;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Change team"
      description={`Move ${employee.name} to another team. Their tasks move with them.`}
    >
      <style>{styles}</style>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* From → To preview */}
        <div className="tf-rise rounded-2xl bg-[#EEF1FF] p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#4338FF] to-[#14B88A] text-sm font-bold text-white shadow-lg shadow-[#4338FF]/25">
              {initials(employee.name)}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-[#0E1530]">{employee.name}</p>
              {employee.email && <p className="truncate text-xs text-slate-500">{employee.email}</p>}
            </div>
          </div>

          <div className="mt-4 flex items-center gap-2">
            <span className="min-w-0 flex-1 truncate rounded-lg bg-white px-3 py-2 text-center text-xs font-semibold text-slate-500 ring-1 ring-slate-200">
              {fromName}
            </span>
            <ArrowRight size={18} className={`shrink-0 ${changed ? "tf-nudge text-[#4338FF]" : "text-slate-300"}`} />
            <span
              key={toName || "none"}
              className={`tf-pop min-w-0 flex-1 truncate rounded-lg px-3 py-2 text-center text-xs font-semibold ${
                changed ? "bg-[#4338FF] text-white shadow-md shadow-[#4338FF]/25" : "bg-white text-slate-400 ring-1 ring-slate-200"
              }`}
            >
              {changed ? toName : "Pick a new team"}
            </span>
          </div>
        </div>

        {/* Team select */}
        <div className="tf-rise" style={{ animationDelay: "80ms" }}>
          <label htmlFor="move-team" className="mb-2 block text-sm font-semibold text-slate-700">New team</label>
          <div className="relative">
            <BriefcaseBusiness size={18} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <select id="move-team" value={teamId} onChange={(e) => setTeamId(e.target.value)} required className={inputCls}>
              {!activeTeams.some((team) => team._id == teamId) && <option value="" disabled>Select a team</option>}

              {activeTeams.map((team) => (
                <option key={team._id} value={team._id}>{team.name}</option>
              ))}
            </select>
            <ChevronDown size={18} className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          </div>
        </div>

        {/* Actions */}
        <div className="tf-rise flex justify-end gap-3 pt-2" style={{ animationDelay: "160ms" }}>
          <button type="button" onClick={onClose} className={secondaryCls}>Cancel</button>
          <button type="submit" disabled={saving || !teamId || teamId == employee.teamId} className={primaryCls}>
            {saving ? "Saving..." : "Move employee"}
            {!saving && <ArrowRight size={16} className="transition group-hover:translate-x-1" />}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default MoveEmployeeModal;