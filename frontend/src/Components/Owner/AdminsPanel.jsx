import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Eye, EyeOff, Plus, Power, PowerOff, Search, TriangleAlert, UsersRound, X } from "lucide-react";
import api from "../../Utils/api";
import Modal from "../UI/Modal";
import Field from "../UI/Field";
import EmptyState from "../UI/EmptyState";
import ConfirmDialog from "../UI/ConfirmDialog";
import { ActiveBadge } from "../UI/Badges";
import { PASSWORD_HINT, formatDate, getErrorMessage, initials } from "../../Utils/helpers";

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
const inputClass =
  "w-full rounded-xl bg-white px-4 py-3 text-sm text-[#0E1530] ring-1 ring-slate-200 transition placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#4338FF]";
const primaryButton = `inline-flex items-center justify-center gap-2 rounded-xl bg-[#0E1530] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#4338FF] disabled:cursor-not-allowed disabled:opacity-60 ${focusRing}`;
const secondaryButton = `inline-flex items-center justify-center rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 ring-1 ring-slate-200 transition hover:bg-[#EEF1FF] hover:text-[#4338FF] ${focusRing}`;
const iconButton = `rounded-lg p-2 text-slate-400 transition ${focusRing}`;

const avatarGradients = [
  "from-[#4338FF] to-[#8c85ff]",
  "from-[#14B88A] to-[#5eead4]",
  "from-[#f59e0b] to-[#fcd34d]",
  "from-[#ec4899] to-[#f9a8d4]",
];

const emptyForm = { name: "", email: "", password: "" };

const CreateAdminModal = ({ open, onClose, organization, onCreated }) => {
  const [form, setForm] = useState(emptyForm);
  const [showPassword, setShowPassword] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    setSaving(true);

    api
      .post(`/api/owner/organization/${organization._id}/admin`, { ...form, name: form.name.trim() })
      .then((res) => {
        toast.success(res.data.message);
        onCreated(res.data.data);
        setForm(emptyForm);
        onClose();
      })
      .catch((error) => toast.error(getErrorMessage(error)))
      .finally(() => setSaving(false));
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Add administrator"
      description={`The administrator will manage teams inside ${organization.name}.`}
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <Field label="Full name" htmlFor="admin-name" hint="2–20 characters. Cannot be changed later.">
          <input id="admin-name" name="name" value={form.name} onChange={handleChange} minLength={2} maxLength={20} required autoFocus placeholder="Rahul Sharma" className={inputClass} />
        </Field>

        <Field label="Email address" htmlFor="admin-email">
          <input id="admin-email" name="email" type="email" value={form.email} onChange={handleChange} required placeholder="rahul@company.com" className={inputClass} />
        </Field>

        <Field label="Temporary password" htmlFor="admin-password" hint={PASSWORD_HINT}>
          <div className="relative">
            <input
              id="admin-password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={form.password}
              onChange={handleChange}
              required
              autoComplete="new-password"
              className={`${inputClass} pr-12`}
            />

            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className={`absolute right-2.5 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-slate-400 transition hover:text-[#4338FF] ${focusRing}`}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </Field>

        <div className="flex justify-end gap-3 pt-2">
          <button type="button" onClick={onClose} className={secondaryButton}>Cancel</button>
          <button type="submit" disabled={saving} className={primaryButton}>
            {saving ? "Creating..." : "Create administrator"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

// Lists and manages the administrators of a single organization
const AdminsPanel = ({ organization }) => {
  const [admins, setAdmins] = useState(null);
  const [search, setSearch] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [confirmTarget, setConfirmTarget] = useState(null);

  // parents key this panel by organization, so it only loads once per mount
  useEffect(() => {
    api
      .get(`/api/owner/organization/${organization._id}/admin`)
      .then((res) => setAdmins(res.data.data))
      .catch((error) => {
        toast.error(getErrorMessage(error, "Could not load administrators"));
        setAdmins([]);
      });
  }, [organization._id]);

  const toggleAdmin = (admin) => {
    const request = admin.isActive
      ? api.delete(`/api/owner/admin/${admin._id}`)
      : api.patch(`/api/owner/admin/${admin._id}`);

    return request
      .then((res) => {
        toast.success(res.data.message);
        setAdmins((prev) => prev.map((item) => (item._id === admin._id ? res.data.data : item)));
      })
      .catch((error) => {
        toast.error(getErrorMessage(error));
        throw error;
      });
  };

  const filtered = (admins || []).filter((admin) =>
    `${admin.name} ${admin.email}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="tf-rise overflow-hidden rounded-2xl bg-white ring-1 ring-slate-200">
      <style>{styles}</style>

      {/* Header */}
      <div className="flex flex-col gap-4 border-b border-slate-100 p-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="tf-head text-xl font-bold text-[#0E1530]">Administrators</h2>
          <p className="mt-1 text-sm text-slate-500">
            {admins ? `${admins.length} administrator${admins.length === 1 ? "" : "s"} in ${organization.name}` : "Loading..."}
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative">
            <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search administrators..."
              aria-label="Search administrators"
              className={`${inputClass} !py-2.5 pl-10 pr-9 sm:w-64`}
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

          <button onClick={() => setCreateOpen(true)} className={primaryButton}>
            <Plus size={17} />
            Add admin
          </button>
        </div>
      </div>

      {!organization.isActive && (
        <div role="status" className="mx-6 mt-5 flex items-start gap-3 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800 ring-1 ring-amber-200">
          <TriangleAlert size={17} className="mt-0.5 shrink-0" />
          This organization is inactive. Its administrators cannot sign in until it is reactivated.
        </div>
      )}

      {admins === null ? (
        <p className="px-6 py-10 text-center text-sm text-slate-400">Loading administrators...</p>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={UsersRound}
          title={search ? "No matching administrators" : "No administrators yet"}
          description={search ? "Try a different search term." : "Add an administrator to start managing teams in this organization."}
        />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-xs font-semibold text-slate-400">
                <th scope="col" className="px-6 py-3.5">Administrator</th>
                <th scope="col" className="px-6 py-3.5">Status</th>
                <th scope="col" className="px-6 py-3.5">Added</th>
                <th scope="col" className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {filtered.map((admin, i) => (
                <tr key={admin._id} className="transition hover:bg-[#F8F9FD]">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-xs font-bold text-white ${avatarGradients[i % avatarGradients.length]}`}>
                        {initials(admin.name)}
                      </div>

                      <div className="min-w-0">
                        <p className="truncate font-semibold text-[#0E1530]">{admin.name}</p>
                        <p className="truncate text-xs text-slate-400">{admin.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4"><ActiveBadge active={admin.isActive} /></td>
                  <td className="px-6 py-4 text-slate-500">{formatDate(admin.createdAt)}</td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => setConfirmTarget(admin)}
                      title={admin.isActive ? "Deactivate" : "Activate"}
                      aria-label={`${admin.isActive ? "Deactivate" : "Activate"} ${admin.name}`}
                      className={admin.isActive ? `${iconButton} hover:bg-red-50 hover:text-red-600` : `${iconButton} hover:bg-emerald-50 hover:text-emerald-600`}
                    >
                      {admin.isActive ? <PowerOff size={17} /> : <Power size={17} />}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <CreateAdminModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        organization={organization}
        onCreated={(admin) => setAdmins((prev) => [admin, ...(prev || [])])}
      />

      <ConfirmDialog
        open={Boolean(confirmTarget)}
        onClose={() => setConfirmTarget(null)}
        onConfirm={() => toggleAdmin(confirmTarget)}
        title={confirmTarget?.isActive ? "Deactivate administrator?" : "Activate administrator?"}
        message={
          confirmTarget?.isActive
            ? `${confirmTarget?.name} will be signed out and won't be able to access the workspace.`
            : `${confirmTarget?.name} will regain access to the workspace.`
        }
        confirmLabel={confirmTarget?.isActive ? "Deactivate" : "Activate"}
        danger={confirmTarget?.isActive}
      />
    </div>
  );
};

export default AdminsPanel;