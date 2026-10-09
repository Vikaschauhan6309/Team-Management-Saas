import { useState } from "react";
import { UserPlus, Users } from "lucide-react";
import PageHeader from "../../Components/UI/PageHeader";
import PageLoader from "../../Components/UI/PageLoader";
import EmptyState from "../../Components/UI/EmptyState";
import SearchInput from "../../Components/UI/SearchInput";
import FilterSelect from "../../Components/UI/FilterSelect";
import EmployeeFormModal from "../../Components/Admin/EmployeeFormModal";
import MoveEmployeeModal from "../../Components/Admin/MoveEmployeeModal";
import EmployeeTable from "../../Components/Admin/EmployeeTable";
import useAdminWorkspace from "../../Utils/useAdminWorkspace";
import { cardClass, primaryButton } from "../../Utils/styles";

const Employees = () => {
  const { data, reload, upsert } = useAdminWorkspace();
  const [search, setSearch] = useState("");
  const [teamFilter, setTeamFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [moveTarget, setMoveTarget] = useState(null);

  if (!data) return <PageLoader />;

  const filtered = data.employees.filter((emp) => {
    const matchesSearch = `${emp.name} ${emp.email}`.toLowerCase().includes(search.toLowerCase());
    const matchesTeam = !teamFilter || emp.teamId == teamFilter;
    const matchesStatus = !statusFilter || String(emp.isActive) == statusFilter;
    return matchesSearch && matchesTeam && matchesStatus;
  });

  return (
    <>
      <PageHeader
        eyebrow="Management"
        title="Employees"
        description="Add employees, move them between teams and manage their access."
        actions={
          <button onClick={() => setCreateOpen(true)} className={primaryButton}>
            <UserPlus size={17} />
            Add employee
          </button>
        }
      />

      <div className={cardClass}>
        <div className="flex flex-col gap-3 border-b border-slate-100 p-6 sm:flex-row sm:items-center sm:justify-between">
          <SearchInput value={search} onChange={setSearch} placeholder="Search employees..." />

          <div className="flex flex-wrap gap-3">
            <FilterSelect
              value={teamFilter}
              onChange={setTeamFilter}
              allLabel="All teams"
              options={data.teams.map((team) => ({ value: team._id, label: team.name }))}
            />

            <FilterSelect
              value={statusFilter}
              onChange={setStatusFilter}
              allLabel="All statuses"
              options={[
                { value: "true", label: "Active" },
                { value: "false", label: "Inactive" },
              ]}
            />
          </div>
        </div>

        {filtered.length == 0 ? (
          <EmptyState
            icon={Users}
            title={data.employees.length == 0 ? "No employees yet" : "No employees found"}
            description={data.employees.length == 0 ? "Add your first employee to a team." : "Try changing your search or filters."}
          />
        ) : (
          <EmployeeTable
            employees={filtered}
            teams={data.teams}
            tasks={data.tasks}
            onMove={setMoveTarget}
            onUpdated={(emp) => upsert("employees", emp)}
          />
        )}
      </div>

      <EmployeeFormModal
        key={`emp-${createOpen}`}
        open={createOpen}
        teams={data.teams}
        defaultTeamId={teamFilter}
        onClose={() => setCreateOpen(false)}
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
    </>
  );
};

export default Employees;