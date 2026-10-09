import { useState } from "react";
import toast from "react-hot-toast";
import { CalendarDays, Pencil, Trash2 } from "lucide-react";
import api from "../../Utils/api";
import ConfirmDialog from "../UI/ConfirmDialog";
import { PriorityBadge } from "../UI/Badges";
import { Table, Td } from "../UI/Table";
import { TASK_STATUSES, formatDate, getErrorMessage, isOverdue } from "../../Utils/helpers";
import { iconButton } from "../../Utils/styles";

const statusSelectStyles = {
  "todo": "bg-slate-100 text-slate-600",
  "in-progress": "bg-amber-50 text-amber-700",
  "completed": "bg-emerald-50 text-emerald-700",
};

// Admin task list with inline status change, edit and delete
const TaskTable = ({ tasks, onEdit, onUpdated, onDeleted, showTeam = true }) => {
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [savingId, setSavingId] = useState(null);

  // the update endpoint expects the full task, so resend it with the new status
  const changeStatus = (task, status) => {
    setSavingId(task._id);

    api
      .patch(`/api/admin/tasks/${task._id}`, {
        title: task.title,
        description: task.description,
        priority: task.priority,
        dueDate: task.dueDate,
        assignedTo: task.assignedTo?._id,
        status,
      })
      .then((res) => {
        toast.success("Status updated");
        onUpdated(res.data.data);
      })
      .catch((error) => toast.error(getErrorMessage(error)))
      .finally(() => setSavingId(null));
  };

  const deleteTask = (task) => {
    return api
      .delete(`/api/admin/tasks/${task._id}`)
      .then((res) => {
        toast.success(res.data.message);
        onDeleted(task._id);
      })
      .catch((error) => {
        toast.error(getErrorMessage(error));
        throw error;
      });
  };

  const headers = ["Task", "Assignee", ...(showTeam ? ["Team"] : []), "Priority", "Status", "Due", "Actions"];

  return (
    <>
      <Table headers={headers}>
        {tasks.map((task) => (
          <tr key={task._id} className="transition hover:bg-slate-50/60">
            <Td className="max-w-xs">
              <p className="font-semibold text-slate-950">{task.title}</p>
              <p className="mt-0.5 line-clamp-1 text-xs text-slate-400">{task.description}</p>
            </Td>
            <Td>
              <p className="font-medium text-slate-700">{task.assignedTo?.name || "—"}</p>
              {task.assignedTo && !task.assignedTo.isActive && (
                <p className="text-xs text-red-500">Inactive</p>
              )}
            </Td>
            {showTeam && <Td className="text-slate-500">{task.teamId?.name || "—"}</Td>}
            <Td><PriorityBadge priority={task.priority} /></Td>
            <Td>
              <select
                value={task.status}
                disabled={savingId == task._id}
                onChange={(e) => changeStatus(task, e.target.value)}
                className={`rounded-full border-0 px-2.5 py-1 text-xs font-medium outline-none disabled:opacity-60 ${statusSelectStyles[task.status]}`}
              >
                {TASK_STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </Td>
            <Td>
              <span className={`inline-flex items-center gap-1.5 whitespace-nowrap text-xs ${isOverdue(task) ? "font-semibold text-red-600" : "text-slate-500"}`}>
                <CalendarDays size={13} />
                {formatDate(task.dueDate)}
              </span>
            </Td>
            <Td className="text-right">
              <div className="inline-flex gap-1">
                <button title="Edit" onClick={() => onEdit(task)} className={iconButton}>
                  <Pencil size={16} />
                </button>

                <button title="Delete" onClick={() => setDeleteTarget(task)} className={`${iconButton} hover:bg-red-50 hover:text-red-600`}>
                  <Trash2 size={16} />
                </button>
              </div>
            </Td>
          </tr>
        ))}
      </Table>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => deleteTask(deleteTarget)}
        title="Delete task?"
        message={`"${deleteTarget?.title}" will be permanently deleted. This cannot be undone.`}
        confirmLabel="Delete"
        danger
      />
    </>
  );
};

export default TaskTable;