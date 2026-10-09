import { useEffect } from "react";
import { NavLink } from "react-router-dom";
import { ChevronRight, LogOut, X } from "lucide-react";
import useLogout from "../../Utils/useLogout";

/* Palette: ink #0E1530 · indigo #4338FF · mint #14B88A · sky #EEF1FF */

const styles = `
@import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,700;12..96,800&display=swap');
.tf-head{font-family:'Bricolage Grotesque',system-ui,sans-serif;letter-spacing:-0.03em}
@keyframes tf-slide{from{transform:translateX(-100%)}to{transform:none}}
@keyframes tf-fade{from{opacity:0}to{opacity:1}}
.tf-slide{animation:tf-slide .28s cubic-bezier(.2,.7,.2,1)}
.tf-fade{animation:tf-fade .2s ease-out}
@media (prefers-reduced-motion:reduce){.tf-slide,.tf-fade{animation:none}}
`;

const focusRing =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4338FF]";

const SidebarContent = ({ links, onNavigate }) => {
  const logout = useLogout();

  return (
    <div className="flex h-full flex-col p-4">
      <div>
        <p className="px-3 text-xs font-semibold text-slate-400">Management</p>

        <nav className="mt-3 space-y-1">
          {links.map((link) => {
            const Icon = link.icon;

            return (
              <NavLink
                key={link.path}
                to={link.path}
                onClick={onNavigate}
                className={({ isActive }) =>
                  `group relative flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${focusRing} ${
                    isActive
                      ? "bg-[#0E1530] text-white shadow-[0_10px_24px_-14px_rgba(14,21,48,.9)]"
                      : "text-slate-600 hover:bg-[#EEF1FF] hover:text-[#4338FF]"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <span
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition ${
                        isActive
                          ? "bg-white/10 text-[#5eead4]"
                          : "bg-slate-100 text-slate-500 group-hover:bg-white group-hover:text-[#4338FF]"
                      }`}
                    >
                      <Icon size={17} strokeWidth={1.8} />
                    </span>

                    <span>{link.label}</span>

                    <ChevronRight
                      size={15}
                      className={`ml-auto transition ${
                        isActive
                          ? "opacity-100"
                          : "-translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-100"
                      }`}
                    />
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Logout */}

      <div className="mt-auto border-t border-slate-100 pt-4">
        <button
          onClick={logout}
          className={`group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-red-50 hover:text-red-600 ${focusRing}`}
        >
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500 transition group-hover:bg-white group-hover:text-red-600">
            <LogOut size={17} strokeWidth={1.8} />
          </span>

          <span>Logout</span>

          <ChevronRight
            size={15}
            className="ml-auto -translate-x-1 opacity-0 transition group-hover:translate-x-0 group-hover:opacity-100"
          />
        </button>
      </div>
    </div>
  );
};

const Sidebar = ({ links, mobileOpen, onClose }) => {
  // Close the drawer with Escape
  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mobileOpen, onClose]);

  return (
    <>
      <style>{styles}</style>

      {/* Desktop */}

      <aside className="sticky top-[73px] hidden h-[calc(100vh-73px)] w-64 shrink-0 border-r border-slate-200 bg-white lg:block">
        <SidebarContent links={links} />
      </aside>

      {/* Mobile drawer */}

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Navigation menu">
          <div className="tf-fade absolute inset-0 bg-[#0E1530]/50 backdrop-blur-sm" onClick={onClose} />

          <aside className="tf-slide relative h-full w-72 max-w-[85vw] border-r border-slate-200 bg-white shadow-2xl">
            <div className="flex h-[73px] items-center justify-between border-b border-slate-200 px-5">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#4338FF] to-[#14B88A]">
                  <div className="h-4 w-4 rounded-md bg-white" />
                </div>

                <p className="tf-head text-base font-extrabold text-[#0E1530]">TeamFlow</p>
              </div>

              <button
                onClick={onClose}
                className={`rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-[#0E1530] ${focusRing}`}
                aria-label="Close menu"
              >
                <X size={19} />
              </button>
            </div>

            <div className="h-[calc(100%-73px)]">
              <SidebarContent links={links} onNavigate={onClose} />
            </div>
          </aside>
        </div>
      )}
    </>
  );
};

export default Sidebar;