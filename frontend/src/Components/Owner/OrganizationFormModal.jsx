import { useState } from "react";
import toast from "react-hot-toast";
import Modal from "../UI/Modal";
import Field from "../UI/Field";
import api from "../../Utils/api";
import { getErrorMessage } from "../../Utils/helpers";

/* Palette: ink #0E1530 · indigo #4338FF · mint #14B88A · sky #EEF1FF */

// Local style tokens (replace ../../Utils/styles for this file)
const focusRing =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4338FF]";
const inputClass =
  "w-full rounded-xl bg-white px-4 py-3 text-sm text-[#0E1530] ring-1 ring-slate-200 transition placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#4338FF]";
const primaryButton = `inline-flex items-center justify-center gap-2 rounded-xl bg-[#0E1530] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#4338FF] disabled:cursor-not-allowed disabled:opacity-60 ${focusRing}`;
const secondaryButton = `inline-flex items-center justify-center rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 ring-1 ring-slate-200 transition hover:bg-[#EEF1FF] hover:text-[#4338FF] ${focusRing}`;

const avatarGradients = [
  "from-[#4338FF] to-[#8c85ff]",
  "from-[#14B88A] to-[#5eead4]",
  "from-[#f59e0b] to-[#fcd34d]",
  "from-[#ec4899] to-[#f9a8d4]",
];

// Render with a `key` so the form resets whenever the target organization changes
const OrganizationFormModal = ({ open, onClose, organization, onSaved }) => {
  const isEdit = Boolean(organization);
  const [name, setName] = useState(organization?.name || "");
  const [isActive, setIsActive] = useState(organization ? organization.isActive : true);
  const [saving, setSaving] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSaving(true);

    const request = isEdit
      ? api.patch(`/api/owner/${organization._id}`, { name: name.trim(), isActive })
      : api.post("/api/owner", { name: name.trim(), isActive });

    request
      .then((res) => {
        toast.success(res.data.message);
        onSaved(res.data.data);
        onClose();
      })
      .catch((error) => toast.error(getErrorMessage(error)))
      .finally(() => setSaving(false));
  };

  const trimmed = name.trim();
  const avatarColor = avatarGradients[trimmed.length % avatarGradients.length];

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? "Edit organization" : "Create organization"}
      description={isEdit ? "Update the organization details." : "Set up a new organization. You can add administrators next."}
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Live preview, styled like the rows in the lists */}
        <div className="flex items-center gap-3.5 rounded-xl bg-[#F8F9FD] px-4 py-3.5 ring-1 ring-slate-100" aria-hidden="true">
          <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-sm font-bold text-white ${avatarColor}`}>
            {trimmed ? trimmed.slice(0, 1).toUpperCase() : "?"}
          </div>

          <div className="min-w-0 flex-1">
            <p className={`truncate text-base font-semibold ${trimmed ? "text-[#0E1530]" : "text-slate-300"}`}>
              {trimmed || "Organization name"}
            </p>
            <p className="text-xs text-slate-400">{isEdit ? "Editing organization" : "New organization"}</p>
          </div>

          <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${isActive ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>
            <span className={`h-1.5 w-1.5 rounded-full ${isActive ? "bg-[#14B88A]" : "bg-slate-400"}`} />
            {isActive ? "Active" : "Inactive"}
          </span>
        </div>

        <Field label="Organization name" htmlFor="org-name">
          <input
            id="org-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Acme Inc."
            maxLength={100}
            required
            autoFocus
            className={inputClass}
          />
        </Field>

        {/* Active switch */}
        <div className={`flex items-center justify-between gap-4 rounded-xl px-4 py-3.5 ring-1 transition ${isActive ? "bg-[#EEF1FF] ring-[#4338FF]/20" : "bg-slate-50 ring-slate-200"}`}>
          <div>
            <p id="org-active-label" className="text-sm font-semibold text-[#0E1530]">Active</p>
            <p id="org-active-desc" className="mt-0.5 text-xs text-slate-500">
              Inactive organizations block their admins and employees.
            </p>
          </div>

          <button
            type="button"
            role="switch"
            aria-checked={isActive}
            aria-labelledby="org-active-label"
            aria-describedby="org-active-desc"
            onClick={() => setIsActive((prev) => !prev)}
            className={`relative h-6 w-11 shrink-0 rounded-full transition ${isActive ? "bg-[#4338FF]" : "bg-slate-300"} ${focusRing}`}
          >
            <span
              className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${isActive ? "translate-x-5" : ""}`}
            />
          </button>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button type="button" onClick={onClose} className={secondaryButton}>
            Cancel
          </button>

          <button type="submit" disabled={saving} className={primaryButton}>
            {saving ? "Saving..." : isEdit ? "Save changes" : "Create organization"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default OrganizationFormModal;