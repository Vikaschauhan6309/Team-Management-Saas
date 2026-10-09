import { useState } from "react";
import { CalendarDays, UserRound, BriefcaseBusiness } from "lucide-react";
import Modal from "../UI/Modal";
import { PriorityBadge, StatusBadge } from "../UI/Badges";
import { TASK_STATUSES, formatDate, isOverdue } from "../../Utils/helpers";

/* Palette: ink #0E1530 · indigo #4338FF · mint #14B88A · sky #EEF1FF */

const focusRing =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4338FF]";

const avatarGradients = [
  "from-[#4338FF] to-[#8c85ff]",
  "from-[#14B88A] to-[#5eead4]",
  "from-[#f59e0b] to-[#fcd34d]",
  "from-[#ec4899] to-[#f9a8d4]",
];

const dotColors = {
  "todo": "bg-slate-400",
  "in-progress": "bg-[#4338FF]",
  "completed": "bg-[#14B88A]",
};

const TaskDetailsModal = ({ task, onClose, onStatusChange }) => {
  const [saving, setSaving] = useState(false);

  if (!task) return null;

  const overdue = isOverdue(task);
  const creator = task.createdBy?.name;
  const creatorColor = avatarGradients[(creator || "").length % avatarGradients.length];

  const changeStatus = (status) => {
    setSaving(true);
    onStatusChange(task._id, status)
      .catch(() => {})
      .finally(() => setSaving(false));
  };

  return (
    <Modal open onClose={onClose} title={task.title} size="max-w-xl">
      <div className="flex flex-wrap gap-2">
        <StatusBadge status={task.status} />
        <PriorityBadge priority={task.priority} />
      </div>

      {task.description && (
        <p className="mt-5 whitespace-pre-line text-sm leading-6 text-slate-600">{task.description}</p>
      )}

      {/* Details */}
      <div className="mt-6 grid gap-4 rounded-2xl bg-[#F8F9FD] p-4 text-sm ring-1 ring-slate-100 sm:grid-cols-3">
        <div>
          <p className="flex items-center gap-1.5 text-xs text-slate-400"><BriefcaseBusiness size={13} /> Team</p>
          <p className="mt-1.5 font-semibold text-[#0E1530]">{task.teamId?.name || "—"}</p>
        </div>

        <div>
          <p className="flex items-center gap-1.5 text-xs text-slate-400"><UserRound size={13} /> Assigned by</p>
          <div className="mt-1.5 flex items-center gap-2">
            {creator && (
              <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-[10px] font-bold text-white ${creatorColor}`} aria-hidden="true">
                {creator.slice(0, 1).toUpperCase()}
              </span>
            )}
            <p className="truncate font-semibold text-[#0E1530]">{creator || "—"}</p>
          </div>
        </div>

        <div>
          <p className="flex items-center gap-1.5 text-xs text-slate-400"><CalendarDays size={13} /> Due</p>
          <p className={`mt-1.5 font-semibold ${overdue ? "text-red-600" : "text-[#0E1530]"}`}>
            {formatDate(task.dueDate)}
            {overdue && (
              <span className="ml-2 rounded-full bg-red-50 px-2 py-0.5 text-xs font-semibold text-red-600">Overdue</span>
            )}
          </p>
        </div>
      </div>

      {/* Status */}
      <div className="mt-6" role="group" aria-labelledby="task-status-label">
        <p id="task-status-label" className="mb-2 text-sm font-semibold text-[#0E1530]">Update status</p>

        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
          {TASK_STATUSES.map((status) => {
            const current = task.status === status.value;

            return (
              <button
                key={status.value}
                disabled={saving || current}
                aria-pressed={current}
                onClick={() => changeStatus(status.value)}
                className={`flex items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed ${focusRing} ${
                  current
                    ? "bg-[#0E1530] text-white"
                    : "bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-[#EEF1FF] hover:text-[#4338FF] disabled:opacity-60 disabled:hover:bg-white disabled:hover:text-slate-700"
                }`}
              >
                <span className={`h-2 w-2 rounded-full ${current ? "bg-[#5eead4]" : dotColors[status.value] || "bg-slate-400"}`} />
                {status.label}
              </button>
            );
          })}
        </div>
      </div>

      <p className="mt-6 text-xs text-slate-400">
        Created {formatDate(task.createdAt)} · Last updated {formatDate(task.updatedAt)}
      </p>
    </Modal>
  );
};

export default TaskDetailsModal;