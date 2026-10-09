import { useState } from "react";
import toast from "react-hot-toast";
import { ArrowRightLeft, Power, PowerOff } from "lucide-react";
import api from "../../Utils/api";
import ConfirmDialog from "../UI/ConfirmDialog";
import { ActiveBadge } from "../UI/Badges";
import { Table, Td } from "../UI/Table";
import { formatDate, getErrorMessage, initials } from "../../Utils/helpers";

/* Palette: ink #0E1530 · indigo #4338FF · mint #14B88A · sky #EEF1FF */

const styles = `
@keyframes tf-row{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
.tf-row{opacity:0;animation:tf-row .5s cubic-bezier(.2,.7,.2,1) forwards}
@media (prefers-reduced-motion:reduce){.tf-row{animation:none;opacity:1}}
`;

const avatarGradients = [
  "from-[#4338FF] to-[#8c85ff]",
  "from-[#14B88A] to-[#5eead4]",
  "from-[#f59e0b] to-[#fcd34d]",
  "from-[#ec4899] to-[#f9a8d4]",
  "from-[#0ea5e9] to-[#7dd3fc]",
];

// Same name always gets the same color
const gradientFor = (name = "") =>
  avatarGradients[[...name].reduce((sum, ch) => sum + ch.charCodeAt(0), 0) % avatarGradients.length];

const iconBtn =
  "flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:scale-110 active:scale-95";

// Employee list with team change and activate/deactivate
const EmployeeTable = ({ employees, teams, tasks, onMove, onUpdated, showTeam = true }) => {
  const [confirmTarget, setConfirmTarget] = useState(null);

  const teamName = (id) => teams.find((team) => team._id == id)?.name || "—";
  const openTasks = (id) => tasks.filter((task) => task.assignedTo?._id == id && task.status != "completed").length;

  // DELETE deactivates; reactivation goes through PATCH
  const toggleEmployee = (employee) => {
    const request = employee.isActive
      ? api.delete(`/api/admin/employees/${employee._id}`)
      : api.patch(`/api/admin/employees/${employee._id}`, { isActive: true });

    return request
      .then((res) => {
        toast.success(employee.isActive ? `${employee.name} deactivated` : `${employee.name} reactivated`);
        onUpdated(res.data.data);
      })
      .catch((error) => {
        toast.error(getErrorMessage(error));
        throw error;
      });
  };

  const headers = ["Employee", ...(showTeam ? ["Team"] : []), "Open tasks", "Status", "Joined", "Actions"];

  return (
    <>
      <style>{styles}</style>

      <Table headers={headers}>
        {employees.map((emp, i) => {
          const open = openTasks(emp._id);

          return (
            <tr
              key={emp._id}
              className="tf-row transition hover:bg-[#EEF1FF]/60"
              style={{ animationDelay: `${Math.min(i, 10) * 45}ms` }}
            >
              <Td>
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-xs font-bold text-white transition ${
                      emp.isActive ? gradientFor(emp.name) : "from-slate-300 to-slate-400 opacity-70"
                    }`}
                  >
                    {initials(emp.name)}
                  </div>

                  <div>
                    <p className={`font-semibold ${emp.isActive ? "text-[#0E1530]" : "text-slate-500"}`}>{emp.name}</p>
                    <p className="text-xs text-slate-400">{emp.email}</p>
                  </div>
                </div>
              </Td>

              {showTeam && (
                <Td>
                  <span className="inline-flex rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                    {teamName(emp.teamId)}
                  </span>
                </Td>
              )}

              <Td>
                <span
                  className={`inline-flex min-w-[2rem] justify-center rounded-full px-2.5 py-1 text-xs font-bold tabular-nums ${
                    open ? "bg-[#EEF1FF] text-[#4338FF]" : "bg-slate-100 text-slate-400"
                  }`}
                >
                  {open}
                </span>
              </Td>

              <Td><ActiveBadge active={emp.isActive} /></Td>
              <Td className="text-slate-500">{formatDate(emp.createdAt)}</Td>

              <Td className="text-right">
                <div className="inline-flex gap-1">
                  <button
                    title="Change team"
                    aria-label="Change team"
                    onClick={() => onMove(emp)}
                    className={`${iconBtn} hover:bg-[#EEF1FF] hover:text-[#4338FF]`}
                  >
                    <ArrowRightLeft size={16} />
                  </button>

                  <button
                    title={emp.isActive ? "Deactivate" : "Reactivate"}
                    aria-label={emp.isActive ? "Deactivate" : "Reactivate"}
                    onClick={() => setConfirmTarget(emp)}
                    className={`${iconBtn} ${emp.isActive ? "hover:bg-red-50 hover:text-red-600" : "hover:bg-emerald-50 hover:text-emerald-600"}`}
                  >
                    {emp.isActive ? <PowerOff size={16} /> : <Power size={16} />}
                  </button>
                </div>
              </Td>
            </tr>
          );
        })}
      </Table>

      <ConfirmDialog
        open={Boolean(confirmTarget)}
        onClose={() => setConfirmTarget(null)}
        onConfirm={() => toggleEmployee(confirmTarget)}
        title={confirmTarget?.isActive ? "Deactivate employee?" : "Reactivate employee?"}
        message={
          confirmTarget?.isActive
            ? `${confirmTarget?.name} will be signed out and won't be able to access their tasks.`
            : `${confirmTarget?.name} will regain access to their tasks.`
        }
        confirmLabel={confirmTarget?.isActive ? "Deactivate" : "Reactivate"}
        danger={confirmTarget?.isActive}
      />
    </>
  );
};

export default EmployeeTable;