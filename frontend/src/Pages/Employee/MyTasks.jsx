import { useState } from "react";
import { ListChecks } from "lucide-react";
import PageHeader from "../../Components/UI/PageHeader";
import PageLoader from "../../Components/UI/PageLoader";
import EmptyState from "../../Components/UI/EmptyState";
import SearchInput from "../../Components/UI/SearchInput";
import FilterSelect from "../../Components/UI/FilterSelect";
import TaskCard from "../../Components/Employee/TaskCard";
import TaskDetailsModal from "../../Components/Employee/TaskDetailsModal";
import useMyTasks from "../../Utils/useMyTasks";
import { TASK_PRIORITIES, TASK_STATUSES } from "../../Utils/helpers";
import { cardClass } from "../../Utils/styles";

const columnDot = {
  "todo": "bg-slate-400",
  "in-progress": "bg-amber-500",
  "completed": "bg-emerald-500",
};

const MyTasks = () => {
  const { tasks, updateStatus } = useMyTasks();
  const [search, setSearch] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [openTaskId, setOpenTaskId] = useState(null);

  if (!tasks) return <PageLoader />;

  const filtered = tasks.filter((task) =>
    `${task.title} ${task.description}`.toLowerCase().includes(search.toLowerCase()) &&
    (!priorityFilter || task.priority == priorityFilter)
  );

  // read from the list so the modal reflects status updates
  const openTask = tasks.find((task) => task._id == openTaskId);

  return (
    <>
      <PageHeader eyebrow="Work" title="My Tasks" description="Everything assigned to you. Open a task to update its status." />

      {tasks.length == 0 ? (
        <div className={cardClass}>
          <EmptyState icon={ListChecks} title="No tasks assigned" description="When your admin assigns you a task, it will show up here." />
        </div>
      ) : (
        <>
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <SearchInput value={search} onChange={setSearch} placeholder="Search tasks..." />
            <FilterSelect value={priorityFilter} onChange={setPriorityFilter} allLabel="All priorities" options={TASK_PRIORITIES} />
          </div>

          <div className="grid gap-5 lg:grid-cols-3">
            {TASK_STATUSES.map((status) => {
              const columnTasks = filtered.filter((task) => task.status == status.value);

              return (
                <div key={status.value} className="rounded-2xl border border-slate-200 bg-slate-100/60 p-4">
                  <div className="mb-4 flex items-center justify-between px-1">
                    <div className="flex items-center gap-2">
                      <span className={`h-2 w-2 rounded-full ${columnDot[status.value]}`} />
                      <p className="text-sm font-semibold text-slate-950">{status.label}</p>
                    </div>

                    <span className="rounded-full bg-white px-2 py-0.5 text-xs font-semibold text-slate-500">
                      {columnTasks.length}
                    </span>
                  </div>

                  <div className="space-y-3">
                    {columnTasks.length == 0 ? (
                      <p className="rounded-xl border border-dashed border-slate-200 px-4 py-8 text-center text-xs text-slate-400">
                        No tasks
                      </p>
                    ) : (
                      columnTasks.map((task) => (
                        <TaskCard key={task._id} task={task} onOpen={(t) => setOpenTaskId(t._id)} />
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      <TaskDetailsModal
        key={openTaskId || "none"}
        task={openTask}
        onClose={() => setOpenTaskId(null)}
        onStatusChange={updateStatus}
      />
    </>
  );
};

export default MyTasks;