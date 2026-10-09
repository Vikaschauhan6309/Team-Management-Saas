import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import { Building2, Plus } from "lucide-react";
import api from "../../Utils/api";
import PageHeader from "../../Components/UI/PageHeader";
import PageLoader from "../../Components/UI/PageLoader";
import EmptyState from "../../Components/UI/EmptyState";
import AdminsPanel from "../../Components/Owner/AdminsPanel";
import { getErrorMessage } from "../../Utils/helpers";
import { cardClass, primaryButton } from "../../Utils/styles";

// Admins are listed per organization by the backend, so pick an organization first
const Administrators = () => {
  const [orgs, setOrgs] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedId = searchParams.get("org");

  useEffect(() => {
    api
      .get("/api/owner", { params: { skip: 0, limit: 100 } })
      .then((res) => setOrgs(res.data.data))
      .catch((error) => {
        toast.error(getErrorMessage(error, "Could not load organizations"));
        setOrgs([]);
      });
  }, []);

  if (!orgs) return <PageLoader />;

  const selected = orgs.find((org) => org._id == selectedId) || orgs[0];

  return (
    <>
      <PageHeader
        eyebrow="Management"
        title="Administrators"
        description="Add, activate and deactivate administrators for each organization."
        actions={
          orgs.length > 0 && (
            <select
              value={selected._id}
              onChange={(e) => setSearchParams({ org: e.target.value })}
              className="h-11 min-w-[220px] rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 outline-none transition focus:border-slate-950 focus:ring-4 focus:ring-slate-950/5"
            >
              {orgs.map((org) => (
                <option key={org._id} value={org._id}>
                  {org.name}{org.isActive ? "" : " (inactive)"}
                </option>
              ))}
            </select>
          )
        }
      />

      {orgs.length == 0 ? (
        <div className={cardClass}>
          <EmptyState
            icon={Building2}
            title="No organizations yet"
            description="Administrators belong to an organization. Create one first."
            action={
              <Link to="/organizations" state={{ openCreate: true }} className={primaryButton}>
                <Plus size={17} />
                New organization
              </Link>
            }
          />
        </div>
      ) : (
        <AdminsPanel key={selected._id} organization={selected} />
      )}
    </>
  );
};

export default Administrators;