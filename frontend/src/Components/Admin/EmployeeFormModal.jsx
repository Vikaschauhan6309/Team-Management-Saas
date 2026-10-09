import { useState } from "react";
import toast from "react-hot-toast";
import { ArrowRight, BriefcaseBusiness, ChevronDown, Eye, EyeOff, LockKeyhole, Mail, AlertTriangle, User } from "lucide-react";
import Modal from "../UI/Modal";
import api from "../../Utils/api";
import { PASSWORD_HINT, getErrorMessage } from "../../Utils/helpers";

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
const iconCls = "absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400";
const labelCls = "mb-2 block text-sm font-semibold text-slate-700";
const hintCls = "mt-2 text-xs text-slate-500";
const secondaryCls =
  "rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 ring-1 ring-slate-200 transition hover:bg-slate-50 hover:ring-slate-300";
const primaryCls =
  "tf-shine group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-xl bg-[#4338FF] px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-[#4338FF]/30 transition hover:bg-[#3329d9] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60";

// Render with a `key` so the form resets per open
const EmployeeFormModal = ({ open, onClose, teams, defaultTeamId, onCreated }) => {
  const activeTeams = teams.filter((team) => team.isActive);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    teamId: (activeTeams.some((team) => team._id == defaultTeamId) && defaultTeamId) || activeTeams[0]?._id || "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    setSaving(true);

    const { teamId, ...body } = form;

    api
      .post(`/api/admin/teams/${teamId}/employees`, { ...body, name: body.name.trim() })
      .then((res) => {
        toast.success(res.data.message);
        onCreated(res.data.data);
        onClose();
      })
      .catch((error) => toast.error(getErrorMessage(error)))
      .finally(() => setSaving(false));
  };

  const trimmed = form.name.trim();
  const initial = trimmed ? trimmed.slice(0, 1).toUpperCase() : null;
  const teamName = activeTeams.find((team) => team._id == form.teamId)?.name;

  return (
    <Modal open={open} onClose={onClose} title="Add employee" description="Create an account for a new team member.">
      <style>{styles}</style>

      {activeTeams.length == 0 ? (
        <div className="flex items-start gap-3 rounded-2xl bg-amber-50 p-4 ring-1 ring-amber-200">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
            <AlertTriangle size={18} />
          </span>
          <p className="text-sm leading-6 text-amber-800">
            Create an active team first — every employee must belong to a team.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Live preview */}
          <div className="tf-rise flex items-center gap-4 rounded-2xl bg-[#EEF1FF] p-4">
            <div
              key={initial || "empty"}
              className="tf-pop flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#4338FF] to-[#14B88A] text-lg font-bold text-white shadow-lg shadow-[#4338FF]/25"
            >
              {initial || <User size={22} />}
            </div>
            <div className="min-w-0">
              <p className="truncate text-base font-bold text-[#0E1530]">{trimmed || "New employee"}</p>
              <p className="truncate text-xs text-slate-500">{teamName ? `${teamName} team` : "Preview"}</p>
            </div>
          </div>

          {/* Team */}
          <div className="tf-rise" style={{ animationDelay: "60ms" }}>
            <label htmlFor="emp-team" className={labelCls}>Team</label>
            <div className="relative">
              <BriefcaseBusiness size={18} className={iconCls} />
              <select id="emp-team" name="teamId" value={form.teamId} onChange={handleChange} required className={`${inputCls} appearance-none pr-10`}>
                {activeTeams.map((team) => (
                  <option key={team._id} value={team._id}>{team.name}</option>
                ))}
              </select>
              <ChevronDown size={18} className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            </div>
          </div>

          {/* Name */}
          <div className="tf-rise" style={{ animationDelay: "120ms" }}>
            <label htmlFor="emp-name" className={labelCls}>Full name</label>
            <div className="relative">
              <User size={18} className={iconCls} />
              <input id="emp-name" name="name" value={form.name} onChange={handleChange} minLength={2} maxLength={20} required autoFocus placeholder="Priya Singh" className={inputCls} />
            </div>
            <p className={hintCls}>2–20 characters. Cannot be changed later.</p>
          </div>

          {/* Email */}
          <div className="tf-rise" style={{ animationDelay: "180ms" }}>
            <label htmlFor="emp-email" className={labelCls}>Email address</label>
            <div className="relative">
              <Mail size={18} className={iconCls} />
              <input id="emp-email" name="email" type="email" value={form.email} onChange={handleChange} required placeholder="priya@company.com" className={inputCls} />
            </div>
          </div>

          {/* Password */}
          <div className="tf-rise" style={{ animationDelay: "240ms" }}>
            <label htmlFor="emp-password" className={labelCls}>Temporary password</label>
            <div className="relative">
              <LockKeyhole size={18} className={iconCls} />
              <input
                id="emp-password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={handleChange}
                required
                autoComplete="new-password"
                className={`${inputCls} pr-12`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-[#4338FF]"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <p className={hintCls}>{PASSWORD_HINT}</p>
          </div>

          {/* Actions */}
          <div className="tf-rise flex justify-end gap-3 pt-2" style={{ animationDelay: "300ms" }}>
            <button type="button" onClick={onClose} className={secondaryCls}>Cancel</button>
            <button type="submit" disabled={saving} className={primaryCls}>
              {saving ? "Creating..." : "Create employee"}
              {!saving && <ArrowRight size={16} className="transition group-hover:translate-x-1" />}
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
};

export default EmployeeFormModal;