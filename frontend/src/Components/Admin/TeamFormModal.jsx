import { useState } from "react";
import toast from "react-hot-toast";
import { ArrowRight, Users } from "lucide-react";
import Modal from "../UI/Modal";
import api from "../../Utils/api";
import { getErrorMessage } from "../../Utils/helpers";

/* Palette: ink #0E1530 · indigo #4338FF · mint #14B88A · sky #EEF1FF */

const styles = `
@keyframes tf-rise{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}
@keyframes tf-pop{0%{transform:scale(.8)}60%{transform:scale(1.08)}100%{transform:scale(1)}}
@keyframes tf-shine{0%{transform:translateX(-120%) skewX(-20deg)}60%,100%{transform:translateX(450%) skewX(-20deg)}}
.tf-rise{opacity:0;animation:tf-rise .5s cubic-bezier(.2,.7,.2,1) forwards}
.tf-pop{animation:tf-pop .35s cubic-bezier(.2,.7,.2,1)}
.tf-shine::after{content:"";position:absolute;inset:0;width:25%;background:linear-gradient(90deg,transparent,rgba(255,255,255,.35),transparent);animation:tf-shine 3.5s ease-in-out infinite}
@media (prefers-reduced-motion:reduce){.tf-rise{animation:none;opacity:1}.tf-pop,.tf-shine::after{animation:none}}
`;

const inputCls =
  "h-12 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-[#4338FF] focus:ring-4 focus:ring-[#4338FF]/10";
const secondaryCls =
  "rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 ring-1 ring-slate-200 transition hover:bg-slate-50 hover:ring-slate-300";
const primaryCls =
  "tf-shine group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-xl bg-[#4338FF] px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-[#4338FF]/30 transition hover:bg-[#3329d9] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60";

// Render with a `key` so the form resets per open
const TeamFormModal = ({ open, onClose, team, onSaved }) => {
  const isEdit = Boolean(team);
  const [name, setName] = useState(team?.name || "");
  const [saving, setSaving] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSaving(true);

    const request = isEdit
      ? api.patch(`/api/admin/teams/${team._id}`, { name: name.trim() })
      : api.post("/api/admin/teams", { name: name.trim() });

    request
      .then((res) => {
        toast.success(res.data.message);
        onSaved(res.data.data);
        onClose();
      })
      .catch((error) => toast.error(getErrorMessage(error)))
      .finally(() => setSaving(false));
  };

  const trimmed = name.trim();
  const initials = trimmed ? trimmed.slice(0, 2).toUpperCase() : null;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? "Rename team" : "Create team"}
      description={isEdit ? "Update the team name." : "Teams group employees and their tasks."}
    >
      <style>{styles}</style>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Live preview */}
        <div className="tf-rise flex items-center gap-4 rounded-2xl bg-[#EEF1FF] p-4">
          <div
            key={initials || "empty"}
            className="tf-pop flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#4338FF] to-[#8c85ff] text-lg font-bold text-white shadow-lg shadow-[#4338FF]/25"
          >
            {initials || <Users size={22} />}
          </div>
          <div className="min-w-0">
            <p className="truncate text-base font-bold text-[#0E1530]">{trimmed || "Your new team"}</p>
            <p className="text-xs text-slate-500">Preview · 0 employees</p>
          </div>
        </div>

        {/* Name field */}
        <div className="tf-rise" style={{ animationDelay: "80ms" }}>
          <div className="mb-2 flex items-center justify-between">
            <label htmlFor="team-name" className="text-sm font-semibold text-slate-700">Team name</label>
            <span className="text-xs tabular-nums text-slate-400">{name.length}/50</span>
          </div>

          <div className="relative">
            <Users size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              id="team-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={50}
              required
              autoFocus
              placeholder="Frontend"
              className={inputCls}
            />
          </div>

          <p className="mt-2 text-xs text-slate-500">Must be unique within your organization.</p>
        </div>

        {/* Actions */}
        <div className="tf-rise flex justify-end gap-3 pt-2" style={{ animationDelay: "160ms" }}>
          <button type="button" onClick={onClose} className={secondaryCls}>Cancel</button>
          <button type="submit" disabled={saving} className={primaryCls}>
            {saving ? "Saving..." : isEdit ? "Save changes" : "Create team"}
            {!saving && <ArrowRight size={16} className="transition group-hover:translate-x-1" />}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default TeamFormModal;