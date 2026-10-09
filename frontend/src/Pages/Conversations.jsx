import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { ArrowUpRight, Search, Users, X } from "lucide-react";
import PageLoader from "../Components/UI/PageLoader";
import EmptyState from "../Components/UI/EmptyState";
import api from "../Utils/api";
import { getErrorMessage, initials } from "../Utils/helpers";

/* Palette: ink #0E1530 · indigo #4338FF · mint #14B88A · sky #EEF1FF */

const styles = `
@import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,700;12..96,800&display=swap');
.tf-head{font-family:'Bricolage Grotesque',system-ui,sans-serif;letter-spacing:-0.03em}
@keyframes tf-rise{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}
.tf-rise{opacity:0;animation:tf-rise .6s cubic-bezier(.2,.7,.2,1) forwards}
.tf-lift{transition:transform .3s cubic-bezier(.2,.7,.2,1),box-shadow .3s}
.tf-lift:hover{transform:translateY(-4px);box-shadow:0 20px 40px -18px rgba(67,56,255,.3)}
@media (prefers-reduced-motion:reduce){.tf-rise{animation:none;opacity:1}.tf-lift:hover{transform:none}}
`;

const focusRing =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4338FF]";

const avatarGradients = [
  "from-[#4338FF] to-[#8c85ff]",
  "from-[#14B88A] to-[#5eead4]",
  "from-[#f59e0b] to-[#fcd34d]",
  "from-[#ec4899] to-[#f9a8d4]",
];

const Conversations = () => {
  const [contacts, setContacts] = useState(null);
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("all");
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/api/chats")
      .then((res) => setContacts(res.data.data))
      .catch((error) => {
        toast.error(getErrorMessage(error));
        setContacts([]);
      });
  }, []);

  if (!contacts) return <PageLoader />;

  const roles = [...new Set(contacts.map((c) => c.role).filter(Boolean))];

  const filtered = contacts.filter((contact) => {
    const matchesSearch = `${contact.name} ${contact.email} ${contact.role}`.toLowerCase().includes(search.toLowerCase());
    return matchesSearch && (role === "all" || contact.role === role);
  });

  return (
    <>
      <style>{styles}</style>

      {/* Header */}
      <div className="tf-rise flex flex-col gap-1">
        <h1 className="tf-head text-4xl font-extrabold text-[#0E1530]">Conversations</h1>
        <p className="text-slate-500">Click on someone from your organization to open a chat.</p>
      </div>

      {contacts.length === 0 ? (
        <div className="tf-rise mt-8 rounded-2xl bg-white p-6 ring-1 ring-slate-200" style={{ animationDelay: "150ms" }}>
          <EmptyState icon={Users} title="No one to chat with yet" description="Other members of your organization will show up here." />
        </div>
      ) : (
        <>
          {/* Search + role filter */}
          <div className="tf-rise mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between" style={{ animationDelay: "120ms" }}>
            <div className="relative w-full sm:max-w-sm">
              <Search size={17} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search people..."
                aria-label="Search people"
                className="w-full rounded-xl bg-white py-3 pl-11 pr-10 text-sm text-[#0E1530] ring-1 ring-slate-200 transition placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#4338FF]"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  aria-label="Clear search"
                  className={`absolute right-2.5 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 ${focusRing}`}
                >
                  <X size={15} />
                </button>
              )}
            </div>

            {roles.length > 1 && (
              <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by role">
                {["all", ...roles].map((r) => (
                  <button
                    key={r}
                    onClick={() => setRole(r)}
                    aria-pressed={role === r}
                    className={`rounded-full px-4 py-2 text-sm font-semibold capitalize transition ${focusRing} ${
                      role === r
                        ? "bg-[#0E1530] text-white"
                        : "bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-[#EEF1FF] hover:text-[#4338FF]"
                    }`}
                  >
                    {r === "all" ? "Everyone" : r}
                  </button>
                ))}
              </div>
            )}
          </div>

          <p className="mt-5 text-sm text-slate-500" aria-live="polite">
            {filtered.length} {filtered.length === 1 ? "person" : "people"}
          </p>

          {filtered.length === 0 ? (
            <div className="mt-4 rounded-2xl bg-white p-6 ring-1 ring-slate-200">
              <EmptyState icon={Users} title="No matches" description="Try a different name or email." />
            </div>
          ) : (
            <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {filtered.map((contact, i) => (
                <button
                  key={contact._id}
                  onClick={() => navigate(`/conversations/${contact._id}`)}
                  className={`tf-rise tf-lift group flex items-center gap-4 rounded-2xl bg-white p-5 text-left ring-1 ring-slate-200 ${focusRing}`}
                  style={{ animationDelay: `${Math.min(i, 8) * 50 + 200}ms` }}
                >
                  <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-sm font-bold text-white ${avatarGradients[i % avatarGradients.length]}`}>
                    {initials(contact.name)}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-[#0E1530]">{contact.name}</p>
                    <p className="mt-0.5 truncate text-xs text-slate-400">{contact.email}</p>
                    {contact.role && (
                      <span className="mt-2 inline-block rounded-full bg-[#EEF1FF] px-2.5 py-0.5 text-xs font-semibold capitalize text-[#4338FF]">
                        {contact.role}
                      </span>
                    )}
                  </div>

                  <ArrowUpRight size={18} className="shrink-0 text-slate-300 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#4338FF]" />
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </>
  );
};

export default Conversations;