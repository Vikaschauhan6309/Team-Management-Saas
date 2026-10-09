import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { ListChecks, Plus } from "lucide-react";
import PageHeader from "../../Components/UI/PageHeader";
import PageLoader from "../../Components/UI/PageLoader";
import EmptyState from "../../Components/UI/EmptyState";
import SearchInput from "../../Components/UI/SearchInput";
import FilterSelect from "../../Components/UI/FilterSelect";
import TaskFormModal from "../../Components/Admin/TaskFormModal";
import TaskTable from "../../Components/Admin/TaskTable";
import useAdminWorkspace from "../../Utils/useAdminWorkspace";
import { TASK_PRIORITIES, TASK_STATUSES } from "../../Utils/helpers";
import { cardClass, primaryButton } from "../../Utils/styles";

const Tasks = () => {
  const { data, upsert, remove } = useAdminWorkspace();
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState("");
  const [taskState, setTaskState] = useState({ open: false, task: null });

  // filters live in the URL so dashboard links can pre-filter this page
  const statusFilter = searchParams.get("status") || "";
  const priorityFilter = searchParams.get("priority") || "";
  const teamFilter = searchParams.get("team") || "";

  const setFilter = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    setSearchParams(next, { replace: true });
  };

  if (!data) return <PageLoader />;

  const filtered = data.tasks.filter((task) => {
    const matchesSearch = `${task.title} ${task.description} ${task.assignedTo?.name || ""}`.toLowerCase().includes(search.toLowerCase());
    return (
      matchesSearch &&
      (!statusFilter || task.status == statusFilter) &&
      (!priorityFilter || task.priority == priorityFilter) &&
      (!teamFilter || task.teamId?._id == teamFilter)
    );
  });

  const canCreate = data.employees.some((emp) => emp.isActive);

  return (
    <>
      <PageHeader
        eyebrow="Work"
        title="Tasks"
        description="Create, assign and track tasks across your teams."
        actions={
          <button disabled={!canCreate} onClick={() => setTaskState({ open: true, task: null })} className={primaryButton} title={canCreate ? "" : "Add an active employee first"}>
            <Plus size={17} />
            New task
          </button>
        }
      />

      <div className={cardClass}>
        <div className="flex flex-col gap-3 border-b border-slate-100 p-6 lg:flex-row lg:items-center lg:justify-between">
          <SearchInput value={search} onChange={setSearch} placeholder="Search tasks or assignees..." />

          <div className="flex flex-wrap gap-3">
            <FilterSelect
              value={teamFilter}
              onChange={(v) => setFilter("team", v)}
              allLabel="All teams"
              options={data.teams.map((team) => ({ value: team._id, label: team.name }))}
            />
            <FilterSelect value={statusFilter} onChange={(v) => setFilter("status", v)} allLabel="All statuses" options={TASK_STATUSES} />
            <FilterSelect value={priorityFilter} onChange={(v) => setFilter("priority", v)} allLabel="All priorities" options={TASK_PRIORITIES} />
          </div>
        </div>

        {filtered.length == 0 ? (
          <EmptyState
            icon={ListChecks}
            title={data.tasks.length == 0 ? "No tasks yet" : "No tasks found"}
            description={
              data.tasks.length == 0
                ? canCreate ? "Create your first task and assign it to an employee." : "Add a team and an employee before creating tasks."
                : "Try changing your search or filters."
            }
          />
        ) : (
          <TaskTable
            tasks={filtered}
            onEdit={(task) => setTaskState({ open: true, task })}
            onUpdated={(task) => upsert("tasks", task)}
            onDeleted={(taskId) => remove("tasks", taskId)}
          />
        )}
      </div>

      <TaskFormModal
        key={taskState.open ? taskState.task?._id || "new" : "closed"}
        open={taskState.open}
        task={taskState.task}
        teams={data.teams}
        employees={data.employees}
        defaultTeamId={teamFilter}
        onClose={() => setTaskState({ open: false, task: null })}
        onSaved={(task) => upsert("tasks", task)}
      />
    </>
  );
};

export default Tasks;