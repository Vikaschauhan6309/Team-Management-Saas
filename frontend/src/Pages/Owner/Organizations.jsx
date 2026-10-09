import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Building2, ChevronDown, ChevronLeft, ChevronRight, Pencil, Plus, Power, PowerOff, Search, X } from "lucide-react";
import api from "../../Utils/api";
import EmptyState from "../../Components/UI/EmptyState";
import ConfirmDialog from "../../Components/UI/ConfirmDialog";
import { ActiveBadge } from "../../Components/UI/Badges";
import OrganizationFormModal from "../../Components/Owner/OrganizationFormModal";
import { toggleOrganization } from "../../Utils/organizations";
import { formatDate, getErrorMessage } from "../../Utils/helpers";

/* Palette: ink #0E1530 · indigo #4338FF · mint #14B88A · sky #EEF1FF */

const styles = `
@import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,700;12..96,800&display=swap');
.tf-head{font-family:'Bricolage Grotesque',system-ui,sans-serif;letter-spacing:-0.03em}
@keyframes tf-rise{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}
.tf-rise{opacity:0;animation:tf-rise .6s cubic-bezier(.2,.7,.2,1) forwards}
@media (prefers-reduced-motion:reduce){.tf-rise{animation:none;opacity:1}}
`;

// Local style tokens (replace ../../Utils/styles for this file)
const focusRing =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4338FF]";
const fieldClass =
  "w-full rounded-xl bg-white px-4 py-2.5 text-sm text-[#0E1530] ring-1 ring-slate-200 transition placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#4338FF]";
const primaryButton = `inline-flex items-center justify-center gap-2 rounded-xl bg-[#0E1530] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#4338FF] disabled:cursor-not-allowed disabled:opacity-60 ${focusRing}`;
const secondaryButton = `inline-flex items-center justify-center gap-1.5 rounded-xl bg-white px-3.5 py-2 text-sm font-semibold text-slate-700 ring-1 ring-slate-200 transition hover:bg-[#EEF1FF] hover:text-[#4338FF] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-white disabled:hover:text-slate-700 ${focusRing}`;
const iconButton = `rounded-lg p-2 text-slate-400 transition ${focusRing}`;

const avatarGradients = [
  "from-[#4338FF] to-[#8c85ff]",
  "from-[#14B88A] to-[#5eead4]",
  "from-[#f59e0b] to-[#fcd34d]",
  "from-[#ec4899] to-[#f9a8d4]",
];

const PAGE_SIZE = 10;

const Organizations = () => {
  const nav = useNavigate();
  const location = useLocation();

  const [page, setPage] = useState(0);
  const [orgs, setOrgs] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // Dashboard "Create Organization" button navigates here with openCreate
  const [formState, setFormState] = useState(
    location.state?.openCreate ? { open: true, organization: null } : { open: false, organization: null }
  );
  const [confirmTarget, setConfirmTarget] = useState(null);

  const loadOrgs = useCallback(() => {
    api
      .get("/api/owner", { params: { skip: page, limit: PAGE_SIZE } })
      .then((res) => setOrgs(res.data.data))
      .catch((error) => {
        toast.error(getErrorMessage(error, "Could not load organizations"));
        setOrgs([]);
      });
  }, [page]);

  useEffect(() => {
    loadOrgs();
  }, [loadOrgs]);

  const replaceOrg = (updated) => {
    setOrgs((prev) => prev.map((org) => (org._id === updated._id ? updated : org)));
  };

  const filtered = (orgs || []).filter((org) => {
    const matchesSearch = org.name.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = !statusFilter || String(org.isActive) === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const openCreate = () => setFormState({ open: true, organization: null });
  const isFirstEmpty = orgs && orgs.length === 0 && page === 0;

  return (
    <>
      <style>{styles}</style>

      {/* Header */}
      <div className="tf-rise flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="tf-head text-4xl font-extrabold text-[#0E1530]">Organizations</h1>
          <p className="mt-1 text-slate-500">Create, update and deactivate the organizations on your platform.</p>
        </div>

        <button onClick={openCreate} className={primaryButton}>
          <Plus size={17} />
          New organization
        </button>
      </div>

      <div className="tf-rise mt-8 overflow-hidden rounded-2xl bg-white ring-1 ring-slate-200" style={{ animationDelay: "120ms" }}>
        {/* Toolbar */}
        <div className="flex flex-col gap-3 border-b border-slate-100 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative sm:w-72">
            <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search this page..."
              aria-label="Search organizations on this page"
              className={`${fieldClass} pl-10 pr-9`}
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                aria-label="Clear search"
                className={`absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 ${focusRing}`}
              >
                <X size={14} />
              </button>
            )}
          </div>

          <div className="relative sm:w-48">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              aria-label="Filter by status"
              className={`${fieldClass} cursor-pointer appearance-none pr-10`}
            >
              <option value="">All statuses</option>
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
            <ChevronDown size={16} className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          </div>
        </div>

        {orgs === null ? (
          <p className="px-6 py-10 text-center text-sm text-slate-400">Loading organizations...</p>
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={Building2}
            title={isFirstEmpty ? "No organizations yet" : "No organizations found"}
            description={isFirstEmpty ? "Create your first organization to get started." : "Try changing your search or filters."}
            action={
              isFirstEmpty && (
                <button onClick={openCreate} className={primaryButton}>
                  <Plus size={17} />
                  New organization
                </button>
              )
            }
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-xs font-semibold text-slate-400">
                  <th scope="col" className="px-6 py-3.5">Organization</th>
                  <th scope="col" className="px-6 py-3.5">Status</th>
                  <th scope="col" className="px-6 py-3.5">Created</th>
                  <th scope="col" className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {filtered.map((org, i) => (
                  <tr
                    key={org._id}
                    tabIndex={0}
                    onClick={() => nav(`/organizations/${org._id}`)}
                    onKeyDown={(e) => e.key === "Enter" && e.target === e.currentTarget && nav(`/organizations/${org._id}`)}
                    className={`cursor-pointer transition hover:bg-[#F8F9FD] focus-visible:bg-[#F8F9FD] focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#4338FF]`}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-sm font-bold text-white ${avatarGradients[i % avatarGradients.length]}`}>
                          {org.name.slice(0, 1).toUpperCase()}
                        </div>

                        <p className="truncate font-semibold text-[#0E1530]">{org.name}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4"><ActiveBadge active={org.isActive} /></td>
                    <td className="px-6 py-4 text-slate-500">{formatDate(org.createdAt)}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="inline-flex gap-1" onClick={(e) => e.stopPropagation()}>
                        <button
                          title="Edit"
                          aria-label={`Edit ${org.name}`}
                          onClick={() => setFormState({ open: true, organization: org })}
                          className={`${iconButton} hover:bg-[#EEF1FF] hover:text-[#4338FF]`}
                        >
                          <Pencil size={16} />
                        </button>

                        <button
                          title={org.isActive ? "Deactivate" : "Reactivate"}
                          aria-label={`${org.isActive ? "Deactivate" : "Reactivate"} ${org.name}`}
                          onClick={() => setConfirmTarget(org)}
                          className={org.isActive ? `${iconButton} hover:bg-red-50 hover:text-red-600` : `${iconButton} hover:bg-emerald-50 hover:text-emerald-600`}
                        >
                          {org.isActive ? <PowerOff size={16} /> : <Power size={16} />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination — backend returns no total, so "next" is enabled while pages are full */}
        <div className="flex items-center justify-between border-t border-slate-100 px-6 py-4">
          <p className="text-xs font-medium text-slate-400">Page {page + 1}</p>

          <div className="flex gap-2">
            <button disabled={page === 0} onClick={() => setPage((p) => p - 1)} className={secondaryButton}>
              <ChevronLeft size={16} />
              Previous
            </button>

            <button
              disabled={!orgs || orgs.length < PAGE_SIZE}
              onClick={() => setPage((p) => p + 1)}
              className={secondaryButton}
            >
              Next
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      <OrganizationFormModal
        key={formState.open ? formState.organization?._id || "new" : "closed"}
        open={formState.open}
        organization={formState.organization}
        onClose={() => setFormState({ open: false, organization: null })}
        onSaved={(saved) => {
          if (formState.organization) replaceOrg(saved);
          else if (page === 0) setOrgs((prev) => [saved, ...(prev || [])].slice(0, PAGE_SIZE));
          else setPage(0);
        }}
      />

      <ConfirmDialog
        open={Boolean(confirmTarget)}
        onClose={() => setConfirmTarget(null)}
        onConfirm={() => toggleOrganization(confirmTarget).then(replaceOrg)}
        title={confirmTarget?.isActive ? "Deactivate organization?" : "Reactivate organization?"}
        message={
          confirmTarget?.isActive
            ? `Admins and employees of ${confirmTarget?.name} will lose access until it is reactivated.`
            : `Admins and employees of ${confirmTarget?.name} will regain access.`
        }
        confirmLabel={confirmTarget?.isActive ? "Deactivate" : "Reactivate"}
        danger={confirmTarget?.isActive}
      />
    </>
  );
};

export default Organizations;