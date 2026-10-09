import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, BriefcaseBusiness, CheckSquare, ListChecks, Pencil, Plus, Power, PowerOff, UserPlus, Users } from "lucide-react";
import PageHeader from "../../Components/UI/PageHeader";
import PageLoader from "../../Components/UI/PageLoader";
import EmptyState from "../../Components/UI/EmptyState";
import StatCard from "../../Components/UI/StatCard";
import ConfirmDialog from "../../Components/UI/ConfirmDialog";
import TeamFormModal from "../../Components/Admin/TeamFormModal";
import EmployeeFormModal from "../../Components/Admin/EmployeeFormModal";
import MoveEmployeeModal from "../../Components/Admin/MoveEmployeeModal";
import TaskFormModal from "../../Components/Admin/TaskFormModal";
import EmployeeTable from "../../Components/Admin/EmployeeTable";
import TaskTable from "../../Components/Admin/TaskTable";
import useAdminWorkspace from "../../Utils/useAdminWorkspace";
import { toggleTeam } from "../../Utils/teams";
import { cardClass, dangerButton, primaryButton, secondaryButton } from "../../Utils/styles";

const TeamDetails = () => {
  const { id } = useParams();
  const { data, reload, upsert, remove } = useAdminWorkspace();

  const [editOpen, setEditOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [employeeOpen, setEmployeeOpen] = useState(false);
  const [moveTarget, setMoveTarget] = useState(null);
  const [taskState, setTaskState] = useState({ open: false, task: null });

  if (!data) return <PageLoader />;

  const team = data.teams.find((t) => t._id == id);

  if (!team) {
    return (
      <div className={cardClass}>
        <EmptyState
          icon={BriefcaseBusiness}
          title="Team not found"
          description="It may belong to another organization or the link is incorrect."
          action={<Link to="/teams" className={secondaryButton}>Back to teams</Link>}
        />
      </div>
    );
  }

  const members = data.employees.filter((emp) => emp.teamId == team._id);
  const teamTasks = data.tasks.filter((task) => task.teamId?._id == team._id);
  const completed = teamTasks.filter((task) => task.status == "completed").length;

  return (
    <>
      <Link to="/teams" className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-950">
        <ArrowLeft size={16} />
        Teams
      </Link>

      <PageHeader
        eyebrow={team.isActive ? "Team" : "Team · Inactive"}
        title={team.name}
        actions={
          <>
            <button onClick={() => setEditOpen(true)} className={secondaryButton}>
              <Pencil size={16} />
              Rename
            </button>

            <button onClick={() => setConfirmOpen(true)} className={team.isActive ? dangerButton : primaryButton}>
              {team.isActive ? <PowerOff size={16} /> : <Power size={16} />}
              {team.isActive ? "Deactivate" : "Reactivate"}
            </button>
          </>
        }
      />

      {!team.isActive && (
        <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
          This team is inactive. Reactivate it to add employees or assign new tasks.
        </div>
      )}

      <div className="grid gap-5 sm:grid-cols-3">
        <StatCard label="Employees" value={members.filter((emp) => emp.isActive).length} hint={`${members.length} total`} icon={Users} />
        <StatCard label="Tasks" value={teamTasks.length} hint="Assigned to this team" icon={ListChecks} />
        <StatCard
          label="Completed"
          value={completed}
          hint={`${teamTasks.length ? Math.round((completed / teamTasks.length) * 100) : 0}% completion rate`}
          hintClass="text-emerald-600"
          icon={CheckSquare}
          iconClass="bg-emerald-50 text-emerald-600"
        />
      </div>

      {/* Employees */}

      <div className={`${cardClass} mt-6`}>
        <div className="flex items-center justify-between border-b border-slate-100 p-6">
          <div>
            <h2 className="text-base font-semibold text-slate-950">Employees</h2>
            <p className="mt-1 text-sm text-slate-500">Members of {team.name}</p>
          </div>

          <button disabled={!team.isActive} onClick={() => setEmployeeOpen(true)} className={primaryButton}>
            <UserPlus size={17} />
            Add employee
          </button>
        </div>

        {members.length == 0 ? (
          <EmptyState icon={Users} title="No employees yet" description="Add employees to this team to start assigning tasks." />
        ) : (
          <EmployeeTable
            employees={members}
            teams={data.teams}
            tasks={data.tasks}
            showTeam={false}
            onMove={setMoveTarget}
            onUpdated={(emp) => upsert("employees", emp)}
          />
        )}
      </div>

      {/* Tasks */}

      <div className={`${cardClass} mt-6`}>
        <div className="flex items-center justify-between border-b border-slate-100 p-6">
          <div>
            <h2 className="text-base font-semibold text-slate-950">Tasks</h2>
            <p className="mt-1 text-sm text-slate-500">Work assigned within {team.name}</p>
          </div>

          <button
            disabled={!team.isActive || !members.some((emp) => emp.isActive)}
            onClick={() => setTaskState({ open: true, task: null })}
            className={primaryButton}
          >
            <Plus size={17} />
            New task
          </button>
        </div>

        {teamTasks.length == 0 ? (
          <EmptyState icon={ListChecks} title="No tasks yet" description="Create a task and assign it to a team member." />
        ) : (
          <TaskTable
            tasks={teamTasks}
            showTeam={false}
            onEdit={(task) => setTaskState({ open: true, task })}
            onUpdated={(task) => upsert("tasks", task)}
            onDeleted={(taskId) => remove("tasks", taskId)}
          />
        )}
      </div>

      <TeamFormModal
        key={`team-${editOpen}`}
        open={editOpen}
        team={team}
        onClose={() => setEditOpen(false)}
        onSaved={(t) => upsert("teams", t)}
      />

      <EmployeeFormModal
        key={`emp-${employeeOpen}`}
        open={employeeOpen}
        teams={data.teams}
        defaultTeamId={team._id}
        onClose={() => setEmployeeOpen(false)}
        onCreated={(emp) => upsert("employees", emp)}
      />

      <MoveEmployeeModal
        key={moveTarget?._id || "none"}
        open={Boolean(moveTarget)}
        employee={moveTarget}
        teams={data.teams}
        onClose={() => setMoveTarget(null)}
        onMoved={reload}
      />

      <TaskFormModal
        key={taskState.open ? taskState.task?._id || "new" : "closed"}
        open={taskState.open}
        task={taskState.task}
        teams={data.teams}
        employees={data.employees}
        defaultTeamId={team._id}
        onClose={() => setTaskState({ open: false, task: null })}
        onSaved={(task) => upsert("tasks", task)}
      />

      <ConfirmDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={() => toggleTeam(team).then((t) => upsert("teams", t))}
        title={team.isActive ? "Deactivate team?" : "Reactivate team?"}
        message={
          team.isActive
            ? `No new employees or tasks can be added to ${team.name} while it is inactive.`
            : `${team.name} will be available for employees and tasks again.`
        }
        confirmLabel={team.isActive ? "Deactivate" : "Reactivate"}
        danger={team.isActive}
      />
    </>
  );
};

export default TeamDetails;