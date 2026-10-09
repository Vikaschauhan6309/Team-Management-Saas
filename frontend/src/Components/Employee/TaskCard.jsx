import { CalendarDays } from "lucide-react";
import { PriorityBadge } from "../UI/Badges";
import { formatDate, isOverdue } from "../../Utils/helpers";

/* Palette: ink #0E1530 · indigo #4338FF · mint #14B88A · sky #EEF1FF */

const avatarGradients = [
  "from-[#4338FF] to-[#8c85ff]",
  "from-[#14B88A] to-[#5eead4]",
  "from-[#f59e0b] to-[#fcd34d]",
  "from-[#ec4899] to-[#f9a8d4]",
];

const TaskCard = ({ task, onOpen }) => {
  const overdue = isOverdue(task);
  const assignee = task.assignedTo?.name;
  const avatarColor = avatarGradients[(assignee || "").length % avatarGradients.length];

  return (
    <button
      onClick={() => onOpen(task)}
      className="group w-full rounded-2xl bg-white p-4 text-left ring-1 ring-slate-200 transition duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_-18px_rgba(67,56,255,.3)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4338FF] motion-reduce:transition-none motion-reduce:hover:translate-y-0"
    >
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-semibold leading-5 text-[#0E1530] transition group-hover:text-[#4338FF]">{task.title}</p>
        <PriorityBadge priority={task.priority} />
      </div>

      {task.description && (
        <p className="mt-1.5 line-clamp-2 text-xs leading-5 text-slate-500">{task.description}</p>
      )}

      <div className="mt-4 flex items-center justify-between gap-3 border-t border-slate-100 pt-3 text-xs">
        <div className="flex min-w-0 items-center gap-2">
          {assignee && (
            <span
              className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-[10px] font-bold text-white ${avatarColor}`}
              title={assignee}
              aria-label={`Assigned to ${assignee}`}
            >
              {assignee.slice(0, 1).toUpperCase()}
            </span>
          )}
          {task.teamId?.name && <span className="truncate text-slate-400">{task.teamId.name}</span>}
        </div>

        <span
          className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 font-medium ${
            overdue ? "bg-red-50 font-semibold text-red-600" : "bg-slate-50 text-slate-500"
          }`}
        >
          <CalendarDays size={13} />
          {overdue && <span className="sr-only">Overdue: </span>}
          {formatDate(task.dueDate)}
        </span>
      </div>
    </button>
  );
};

export default TaskCard;