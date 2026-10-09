import { useState } from "react";
import toast from "react-hot-toast";
import { ArrowRight, BriefcaseBusiness, CalendarDays, ChevronDown, Type, User } from "lucide-react";
import Modal from "../UI/Modal";
import api from "../../Utils/api";
import { TASK_PRIORITIES, TASK_STATUSES, getErrorMessage, toDateInput } from "../../Utils/helpers";

/* Palette: ink #0E1530 · indigo #4338FF · mint #14B88A · sky #EEF1FF */

const styles = `
@keyframes tf-rise{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}
@keyframes tf-shine{0%{transform:translateX(-120%) skewX(-20deg)}60%,100%{transform:translateX(450%) skewX(-20deg)}}
.tf-rise{opacity:0;animation:tf-rise .5s cubic-bezier(.2,.7,.2,1) forwards}
.tf-shine::after{content:"";position:absolute;inset:0;width:25%;background:linear-gradient(90deg,transparent,rgba(255,255,255,.35),transparent);animation:tf-shine 3.5s ease-in-out infinite}
@media (prefers-reduced-motion:reduce){.tf-rise{animation:none;opacity:1}.tf-shine::after{animation:none}}
`;

const fieldCls =
  "w-full rounded-xl border border-slate-200 bg-white text-sm text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-[#4338FF] focus:ring-4 focus:ring-[#4338FF]/10 disabled:bg-slate-50";
const inputCls = `${fieldCls} h-12 pl-11 pr-4`;
const selectCls = `${fieldCls} h-12 appearance-none pl-11 pr-10`;
const iconCls = "pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400";
const labelCls = "mb-2 flex items-center justify-between text-sm font-semibold text-slate-700";
const hintCls = "text-xs font-normal text-slate-400";
const secondaryCls =
  "rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 ring-1 ring-slate-200 transition hover:bg-slate-50 hover:ring-slate-300";
const primaryCls =
  "tf-shine group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-xl bg-[#4338FF] px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-[#4338FF]/30 transition hover:bg-[#3329d9] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 disabled:shadow-none";

// Selected-state colors for the pill choices
const statusTone = {
  "todo": "bg-slate-100 text-slate-700 ring-slate-300",
  "in-progress": "bg-[#EEF1FF] text-[#4338FF] ring-[#4338FF]/40",
  "completed": "bg-emerald-50 text-emerald-700 ring-emerald-300",
};
const priorityTone = {
  low: "bg-emerald-50 text-emerald-700 ring-emerald-300",
  medium: "bg-amber-50 text-amber-700 ring-amber-300",
  high: "bg-red-50 text-red-600 ring-red-300",
};
const fallbackTone = "bg-[#EEF1FF] text-[#4338FF] ring-[#4338FF]/40";

// Row of pill buttons that behaves like a select
const Choice = ({ name, value, options, tones, onChange }) => (
  <div className="flex gap-1.5 rounded-xl bg-slate-100 p-1">
    {options.map((o) => {
      const active = value == o.value;
      return (
        <button
          key={o.value}
          type="button"
          aria-pressed={active}
          onClick={() => onChange({ target: { name, value: o.value } })}
          className={`flex-1 rounded-lg px-2 py-2 text-xs font-semibold transition ${
            active ? `${tones[o.value] || fallbackTone} shadow-sm ring-1` : "text-slate-500 hover:bg-white/70 hover:text-slate-800"
          }`}
        >
          {o.label}
        </button>
      );
    })}
  </div>
);

// Render with a `key` so the form resets per open. Tasks inherit the assignee's team.
const TaskFormModal = ({ open, onClose, task, teams, employees, defaultTeamId, onSaved }) => {
  const isEdit = Boolean(task);
  const activeTeams = teams.filter((team) => team.isActive);

  const [form, setForm] = useState({
    title: task?.title || "",
    description: task?.description || "",
    status: task?.status || "todo",
    priority: task?.priority || "medium",
    dueDate: toDateInput(task?.dueDate),
    teamId: task?.teamId?._id || (activeTeams.some((team) => team._id == defaultTeamId) && defaultTeamId) || activeTeams[0]?._id || "",
    assignedTo: task?.assignedTo?._id || "",
  });
  const [saving, setSaving] = useState(false);

  const teamEmployees = employees.filter((emp) => emp.isActive && emp.teamId == form.teamId);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
      // switching team clears an assignee that isn't part of it
      ...(name == "teamId" ? { assignedTo: "" } : {}),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSaving(true);

    const body = {
      title: form.title.trim(),
      description: form.description.trim(),
      status: form.status,
      priority: form.priority,
      dueDate: form.dueDate || null,
    };

    const request = isEdit
      ? api.patch(`/api/admin/tasks/${task._id}`, { ...body, assignedTo: form.assignedTo })
      : api.post(`/api/admin/tasks/employee/${form.assignedTo}`, body);

    request
      .then((res) => {
        toast.success(res.data.message);
        onSaved(res.data.data);
        onClose();
      })
      .catch((error) => toast.error(getErrorMessage(error)))
      .finally(() => setSaving(false));
  };

  const noEmployees = form.teamId && teamEmployees.length == 0;

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="max-w-2xl"
      title={isEdit ? "Edit task" : "Create task"}
      description={isEdit ? "Update the task details or reassign it." : "Assign a new task to an employee."}
    >
      <style>{styles}</style>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Title */}
        <div className="tf-rise">
          <label htmlFor="task-title" className={labelCls}>Title</label>
          <div className="relative">
            <Type size={18} className={iconCls} />
            <input id="task-title" name="title" value={form.title} onChange={handleChange} maxLength={100} required autoFocus placeholder="Build the login page" className={inputCls} />
          </div>
        </div>

        {/* Description */}
        <div className="tf-rise" style={{ animationDelay: "60ms" }}>
          <label htmlFor="task-description" className={labelCls}>
            Description
            <span className={`${hintCls} tabular-nums`}>{form.description.length}/300</span>
          </label>
          <textarea
            id="task-description"
            name="description"
            value={form.description}
            onChange={handleChange}
            maxLength={300}
            required
            rows={3}
            placeholder="What needs to be done?"
            className={`${fieldCls} resize-none px-4 py-3`}
          />
        </div>

        <div className="tf-rise grid gap-5 sm:grid-cols-2" style={{ animationDelay: "120ms" }}>
          {/* Team */}
          <div>
            <label htmlFor="task-team" className={labelCls}>Team</label>
            <div className="relative">
              <BriefcaseBusiness size={18} className={iconCls} />
              <select id="task-team" name="teamId" value={form.teamId} onChange={handleChange} required className={selectCls}>
                {!activeTeams.some((team) => team._id == form.teamId) && <option value="" disabled>Select a team</option>}
                {activeTeams.map((team) => (
                  <option key={team._id} value={team._id}>{team.name}</option>
                ))}
              </select>
              <ChevronDown size={18} className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            </div>
          </div>

          {/* Assignee */}
          <div>
            <label htmlFor="task-assignee" className={labelCls}>
              Assignee
              {noEmployees && <span className="text-xs font-medium text-amber-600">No active employees in this team</span>}
            </label>
            <div className="relative">
              <User size={18} className={iconCls} />
              <select id="task-assignee" name="assignedTo" value={form.assignedTo} onChange={handleChange} required className={selectCls}>
                <option value="" disabled>Select an employee</option>
                {teamEmployees.map((emp) => (
                  <option key={emp._id} value={emp._id}>{emp.name}</option>
                ))}
              </select>
              <ChevronDown size={18} className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            </div>
          </div>

          {/* Status */}
          <div>
            <span className={labelCls}>Status</span>
            <Choice name="status" value={form.status} options={TASK_STATUSES} tones={statusTone} onChange={handleChange} />
          </div>

          {/* Priority */}
          <div>
            <span className={labelCls}>Priority</span>
            <Choice name="priority" value={form.priority} options={TASK_PRIORITIES} tones={priorityTone} onChange={handleChange} />
          </div>

          {/* Due date */}
          <div>
            <label htmlFor="task-due" className={labelCls}>
              Due date
              <span className={hintCls}>Optional</span>
            </label>
            <div className="relative">
              <CalendarDays size={18} className={iconCls} />
              <input id="task-due" name="dueDate" type="date" value={form.dueDate} onChange={handleChange} className={inputCls} />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="tf-rise flex justify-end gap-3 pt-2" style={{ animationDelay: "200ms" }}>
          <button type="button" onClick={onClose} className={secondaryCls}>Cancel</button>
          <button type="submit" disabled={saving || !form.assignedTo} className={primaryCls}>
            {saving ? "Saving..." : isEdit ? "Save changes" : "Create task"}
            {!saving && <ArrowRight size={16} className="transition group-hover:translate-x-1" />}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default TaskFormModal;