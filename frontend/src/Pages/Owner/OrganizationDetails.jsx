import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { ArrowLeft, Building2, CalendarDays, Pencil, Power, PowerOff } from "lucide-react";
import api from "../../Utils/api";
import PageHeader from "../../Components/UI/PageHeader";
import PageLoader from "../../Components/UI/PageLoader";
import EmptyState from "../../Components/UI/EmptyState";
import ConfirmDialog from "../../Components/UI/ConfirmDialog";
import { ActiveBadge } from "../../Components/UI/Badges";
import OrganizationFormModal from "../../Components/Owner/OrganizationFormModal";
import AdminsPanel from "../../Components/Owner/AdminsPanel";
import { toggleOrganization } from "../../Utils/organizations";
import { formatDate, getErrorMessage } from "../../Utils/helpers";
import { cardClass, dangerButton, primaryButton, secondaryButton } from "../../Utils/styles";

const OrganizationDetails = () => {
  const { id } = useParams();
  const [org, setOrg] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  useEffect(() => {
    api
      .get(`/api/owner/${id}`)
      .then((res) => setOrg(res.data.data))
      .catch((error) => {
        toast.error(getErrorMessage(error, "Could not load organization"));
        setNotFound(true);
      });
  }, [id]);

  if (notFound) {
    return (
      <div className={cardClass}>
        <EmptyState
          icon={Building2}
          title="Organization not found"
          description="It may have been removed or the link is incorrect."
          action={<Link to="/organizations" className={secondaryButton}>Back to organizations</Link>}
        />
      </div>
    );
  }

  if (!org) return <PageLoader />;

  return (
    <>
      <Link to="/organizations" className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-950">
        <ArrowLeft size={16} />
        Organizations
      </Link>

      <PageHeader
        eyebrow="Organization"
        title={org.name}
        actions={
          <>
            <button onClick={() => setEditOpen(true)} className={secondaryButton}>
              <Pencil size={16} />
              Edit
            </button>

            <button onClick={() => setConfirmOpen(true)} className={org.isActive ? dangerButton : primaryButton}>
              {org.isActive ? <PowerOff size={16} /> : <Power size={16} />}
              {org.isActive ? "Deactivate" : "Reactivate"}
            </button>
          </>
        }
      />

      <div className="mb-6 grid gap-5 sm:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Status</p>
          <div className="mt-3"><ActiveBadge active={org.isActive} /></div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Created</p>
          <p className="mt-3 flex items-center gap-2 text-sm font-semibold text-slate-950">
            <CalendarDays size={16} className="text-slate-400" />
            {formatDate(org.createdAt)}
          </p>
        </div>
      </div>

      <AdminsPanel key={org._id} organization={org} />

      <OrganizationFormModal
        key={`${org._id}-${org.updatedAt}-${editOpen}`}
        open={editOpen}
        organization={org}
        onClose={() => setEditOpen(false)}
        onSaved={setOrg}
      />

      <ConfirmDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={() => toggleOrganization(org).then(setOrg)}
        title={org.isActive ? "Deactivate organization?" : "Reactivate organization?"}
        message={
          org.isActive
            ? `Admins and employees of ${org.name} will lose access until it is reactivated.`
            : `Admins and employees of ${org.name} will regain access.`
        }
        confirmLabel={org.isActive ? "Deactivate" : "Reactivate"}
        danger={org.isActive}
      />
    </>
  );
};

export default OrganizationDetails;