import { useEffect, useRef, useState } from "react";
import { Building2, ChevronDown, LogOut, Menu } from "lucide-react";
import { useSelector } from "react-redux";
import { workspaceLabel } from "./navLinks";
import { initials } from "../../Utils/helpers";
import useLogout from "../../Utils/useLogout";

/* Palette: ink #0E1530 · indigo #4338FF · mint #14B88A · sky #EEF1FF */

const styles = `
@import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,700;12..96,800&display=swap');
.tf-head{font-family:'Bricolage Grotesque',system-ui,sans-serif;letter-spacing:-0.03em}
@keyframes tf-pop{from{opacity:0;transform:translateY(-6px) scale(.97)}to{opacity:1;transform:none}}
.tf-pop{transform-origin:top right;animation:tf-pop .18s cubic-bezier(.2,.7,.2,1)}
@media (prefers-reduced-motion:reduce){.tf-pop{animation:none}}
`;

const focusRing =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4338FF]";

const avatarGradients = [
  "from-[#4338FF] to-[#8c85ff]",
  "from-[#14B88A] to-[#5eead4]",
  "from-[#f59e0b] to-[#fcd34d]",
  "from-[#ec4899] to-[#f9a8d4]",
];

const Navbar = ({ onMenuClick }) => {
  const user = useSelector((store) => store.user);
  const logout = useLogout();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    if (!menuOpen) return;

    const onClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    };
    const onKey = (e) => e.key === "Escape" && setMenuOpen(false);

    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  // Same name always gets the same avatar color
  const avatarColor = avatarGradients[(user.name || "").length % avatarGradients.length];

  return (
    <header className="sticky top-0 z-40 h-[73px] border-b border-slate-200 bg-white/90 backdrop-blur-md">
      <style>{styles}</style>

      <div className="flex h-full items-center justify-between px-5 lg:px-8">
        {/* Left */}

        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            aria-label="Open menu"
            className={`rounded-lg p-2 text-slate-500 transition hover:bg-[#EEF1FF] hover:text-[#4338FF] lg:hidden ${focusRing}`}
          >
            <Menu size={21} />
          </button>

          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#4338FF] to-[#14B88A] shadow-[0_8px_20px_-8px_rgba(67,56,255,.7)]">
              <div className="h-4 w-4 rounded-md bg-white" />
            </div>

            <div className="hidden sm:block">
              <p className="tf-head text-base font-extrabold leading-tight text-[#0E1530]">TeamFlow</p>
              <p className="text-xs text-slate-400">{workspaceLabel[user.role]}</p>
            </div>
          </div>
        </div>

        {/* Right */}

        <div className="flex items-center gap-2">
          {user.organization && (
            <div className="hidden items-center gap-2 rounded-full bg-[#EEF1FF] py-1.5 pl-2 pr-3.5 md:flex">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-[#4338FF]">
                <Building2 size={13} />
              </span>

              <span className="text-sm font-semibold text-[#0E1530]">{user.organization.name}</span>

              {user.team && <span className="text-sm text-slate-500">/ {user.team.name}</span>}
            </div>
          )}

          <div className="mx-2 hidden h-7 w-px bg-slate-200 sm:block" />

          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen((prev) => !prev)}
              aria-haspopup="menu"
              aria-expanded={menuOpen}
              className={`flex items-center gap-3 rounded-xl px-2 py-1.5 transition hover:bg-[#F8F9FD] ${focusRing}`}
            >
              <div className={`flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br text-sm font-bold text-white ${avatarColor}`}>
                {initials(user.name)}
              </div>

              <div className="hidden text-left sm:block">
                <p className="text-sm font-semibold leading-tight text-[#0E1530]">{user.name}</p>
                <p className="text-xs capitalize text-slate-400">{user.role}</p>
              </div>

              <ChevronDown
                size={16}
                className={`hidden text-slate-400 transition sm:block ${menuOpen ? "rotate-180 text-[#4338FF]" : ""}`}
              />
            </button>

            {menuOpen && (
              <div role="menu" className="tf-pop absolute right-0 mt-2 w-64 rounded-2xl bg-white p-2 shadow-[0_24px_48px_-16px_rgba(14,21,48,.3)] ring-1 ring-slate-200">
                <div className="flex items-center gap-3 border-b border-slate-100 px-3 py-3">
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-sm font-bold text-white ${avatarColor}`}>
                    {initials(user.name)}
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-[#0E1530]">{user.name}</p>
                    <p className="truncate text-xs text-slate-400">{user.email}</p>
                  </div>
                </div>

                <button
                  role="menuitem"
                  onClick={logout}
                  className={`group mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-red-50 hover:text-red-600 ${focusRing}`}
                >
                  <LogOut size={17} strokeWidth={1.8} />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;