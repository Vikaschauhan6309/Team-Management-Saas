import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight, Bell, Check, ClipboardCheck, Crown, Menu, MessageSquare, Sparkles, TrendingUp, User, UserCog, Users, X, Zap,
} from "lucide-react";

/* Palette: ink #0E1530 · indigo #4338FF · mint #14B88A · sky #EEF1FF · paper #F8F9FD */

const styles = `
@import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500;12..96,700;12..96,800&family=DM+Sans:wght@400;500;600&display=swap');
html{scroll-behavior:smooth}
.tf-root{font-family:'DM Sans',system-ui,sans-serif}
.tf-head{font-family:'Bricolage Grotesque','DM Sans',system-ui,sans-serif;letter-spacing:-0.03em}
@keyframes tf-rise{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:none}}
@keyframes tf-fill{from{width:0}}
@keyframes tf-ping{0%{transform:scale(1);opacity:.7}100%{transform:scale(2.6);opacity:0}}
@keyframes tf-draw{from{transform:scaleY(0)}to{transform:scaleY(1)}}
@keyframes tf-blob{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(50px,36px) scale(1.15)}}
@keyframes tf-float{0%,100%{transform:translateY(0)}50%{transform:translateY(-12px)}}
@keyframes tf-grad{0%{background-position:0% 50%}100%{background-position:200% 50%}}
@keyframes tf-marquee{from{transform:translateX(0)}to{transform:translateX(-50%)}}
@keyframes tf-shine{0%{transform:translateX(-120%) skewX(-20deg)}60%,100%{transform:translateX(420%) skewX(-20deg)}}
@keyframes tf-glow{0%,100%{box-shadow:0 0 0 0 rgba(67,56,255,0)}20%{box-shadow:0 0 0 10px rgba(67,56,255,.18)}45%{box-shadow:0 0 0 0 rgba(67,56,255,0)}}
@keyframes tf-travel{0%{top:0;opacity:0}10%{opacity:1}85%{opacity:1}100%{top:100%;opacity:0}}
@keyframes tf-check{0%,8%{background:#fff;border-color:#cbd5e1}16%,84%{background:#14B88A;border-color:#14B88A}94%,100%{background:#fff;border-color:#cbd5e1}}
@keyframes tf-strike{0%,8%{color:#0E1530}16%,84%{color:#94a3b8;text-decoration:line-through}94%,100%{color:#0E1530;text-decoration:none}}
@keyframes tf-msg{0%,6%{opacity:0;transform:translateY(12px) scale(.96)}14%,86%{opacity:1;transform:none}94%,100%{opacity:0;transform:translateY(-6px)}}
@keyframes tf-dot{0%,80%,100%{transform:translateY(0);opacity:.4}40%{transform:translateY(-4px);opacity:1}}
@keyframes tf-toast{0%,10%{opacity:0;transform:translateY(14px) scale(.95)}18%,78%{opacity:1;transform:none}88%,100%{opacity:0;transform:translateY(-10px)}}
.tf-rise{opacity:0;animation:tf-rise .8s cubic-bezier(.2,.7,.2,1) forwards}
.tf-fill{animation:tf-fill 1.6s .3s cubic-bezier(.2,.7,.2,1) backwards}
.tf-ping{animation:tf-ping 2s ease-out infinite}
.tf-line{transform-origin:top;animation:tf-draw 1.4s .5s ease-out backwards}
.tf-blob{animation:tf-blob 16s ease-in-out infinite}
.tf-float{animation:tf-float 5.5s ease-in-out infinite}
.tf-grad{background-size:200% auto;animation:tf-grad 6s linear infinite}
.tf-marquee{animation:tf-marquee 32s linear infinite}
.tf-marquee-wrap:hover .tf-marquee{animation-play-state:paused}
.tf-shine{position:relative;overflow:hidden}
.tf-shine::after{content:"";position:absolute;inset:0;width:28%;background:linear-gradient(90deg,transparent,rgba(255,255,255,.6),transparent);animation:tf-shine 3.4s ease-in-out infinite}
.tf-glow{animation:tf-glow 5s ease-in-out infinite}
.tf-travel{animation:tf-travel 5s ease-in-out infinite}
.tf-check{animation:tf-check 9s ease-in-out infinite}
.tf-strike{animation:tf-strike 9s ease-in-out infinite}
.tf-msg{opacity:0;animation:tf-msg 10s ease-in-out infinite}
.tf-dot{animation:tf-dot 1.2s ease-in-out infinite}
.tf-toast{opacity:0;animation:tf-toast 9s ease-in-out infinite}
.tf-reveal{opacity:0;transform:translateY(32px) scale(.98);transition:opacity .8s cubic-bezier(.2,.7,.2,1),transform .8s cubic-bezier(.2,.7,.2,1)}
.tf-reveal.tf-in{opacity:1;transform:none}
.tf-swap{animation:tf-rise .5s cubic-bezier(.2,.7,.2,1) both}
.tf-lift{transition:transform .35s cubic-bezier(.2,.7,.2,1),box-shadow .35s}
.tf-lift:hover{transform:translateY(-6px);box-shadow:0 24px 50px -20px rgba(67,56,255,.35)}
@media (prefers-reduced-motion:reduce){html{scroll-behavior:auto}.tf-rise,.tf-reveal,.tf-swap,.tf-msg,.tf-toast{animation:none;opacity:1;transform:none;transition:none}.tf-fill,.tf-ping,.tf-line,.tf-blob,.tf-float,.tf-grad,.tf-marquee,.tf-shine::after,.tf-glow,.tf-travel,.tf-check,.tf-strike,.tf-dot{animation:none}.tf-lift:hover{transform:none}}
.tf-root :focus-visible{outline:2px solid #4338FF;outline-offset:3px;border-radius:8px}
`;

const NAV = [["The idea", "#idea"], ["Roles", "#roles"], ["Features", "#features"]];
const MARQUEE = ["Organizations", "Administrators", "Teams", "Employees", "Tasks", "Priorities", "Team chat", "Progress tracking", "Role-based access"];

const ROLES = [
  { id: "owner", icon: Crown, label: "Owner", title: "Sets up the platform", text: "Creates each organization and appoints the people who run it. Nothing else to manage.",
    items: ["Create organizations", "Activate or deactivate access", "Appoint administrators"],
    preview: [["Acme Inc.", "2 administrators", "Active"], ["Northwind", "1 administrator", "Active"], ["Globex", "3 administrators", "Inactive"]] },
  { id: "admin", icon: UserCog, label: "Admin", title: "Runs the organization", text: "Builds teams, adds employees and hands out the work. This is where most of the action is.",
    items: ["Create teams and employees", "Create and assign tasks", "Follow progress to done"],
    preview: [["Sales team", "6 employees", "Active"], ["HR team", "4 employees", "Active"], ["Ops team", "5 employees", "Active"]] },
  { id: "member", icon: User, label: "Team member", title: "Gets the work done", text: "Sees assigned tasks, updates their status and talks to the team in one place.",
    items: ["View assigned tasks", "Update task status", "Chat with teammates"],
    preview: [["Prepare onboarding plan", "Due Friday", "To do"], ["Fix invoice export", "Due Monday", "In progress"], ["Publish hiring policy", "Done", "Done"]] },
];

const pill = { Active: "bg-emerald-50 text-emerald-700", Inactive: "bg-slate-100 text-slate-500", "To do": "bg-slate-100 text-slate-600", "In progress": "bg-[#EEF1FF] text-[#4338FF]", Done: "bg-emerald-50 text-emerald-700" };

const reduced = () => typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

// True once the element has scrolled into view
const useInView = (threshold = 0.15) => {
  const ref = useRef(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") return setSeen(true);
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setSeen(true); io.disconnect(); } }, { threshold });
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return [ref, seen];
};

const Reveal = ({ children, delay = 0, className = "" }) => {
  const [ref, seen] = useInView(0.12);
  return <div ref={ref} className={`tf-reveal ${seen ? "tf-in" : ""} ${className}`} style={{ transitionDelay: `${delay}ms` }}>{children}</div>;
};

// Counts up once it scrolls into view
const CountUp = ({ to, suffix = "", duration = 1600 }) => {
  const [ref, seen] = useInView(0.4);
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!seen) return;
    if (reduced()) return setN(to);
    let raf, start;
    const tick = (t) => {
      start = start ?? t;
      const p = Math.min((t - start) / duration, 1);
      setN(Math.round(to * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [seen, to, duration]);
  return <span ref={ref}>{n}{suffix}</span>;
};

const Logo = ({ size = "h-9 w-9" }) => (
  <span className="flex items-center gap-2.5">
    <span className={`flex ${size} items-center justify-center rounded-[10px] bg-gradient-to-br from-[#4338FF] to-[#14B88A]`}>
      <Zap size={18} className="text-white" fill="white" />
    </span>
    <span className="tf-head text-xl font-extrabold">TeamFlow</span>
  </span>
);

const Feature = ({ icon: I, title, text, flip, children }) => (
  <Reveal className="grid items-center gap-10 py-14 lg:grid-cols-2 lg:gap-20">
    <div className={flip ? "lg:order-2" : ""}>
      <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#EEF1FF] to-white text-[#4338FF] ring-1 ring-[#4338FF]/10"><I size={22} /></span>
      <h3 className="tf-head mt-5 text-3xl font-extrabold sm:text-4xl">{title}</h3>
      <p className="mt-3 max-w-md text-lg leading-8 text-slate-600">{text}</p>
    </div>
    <div className="tf-lift rounded-3xl bg-white p-5 ring-1 ring-slate-200 sm:p-6">{children}</div>
  </Reveal>
);

const LandingPage = () => {
  const nav = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [role, setRole] = useState("admin");
  const barRef = useRef(null);
  const tiltRef = useRef(null);
  const active = ROLES.find((r) => r.id === role);
  const go = () => nav("/login");

  // Scroll progress bar
  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      if (barRef.current) barRef.current.style.transform = `scaleX(${h > 0 ? window.scrollY / h : 0})`;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Gentle 3D tilt that follows the pointer
  const onTilt = (e) => {
    const el = tiltRef.current;
    if (!el || reduced()) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(900px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg)`;
  };
  const offTilt = () => { if (tiltRef.current) tiltRef.current.style.transform = ""; };

  return (
    <div className="tf-root min-h-screen overflow-x-hidden bg-[#F8F9FD] text-[#0E1530]">
      <style>{styles}</style>

      <div ref={barRef} className="fixed inset-x-0 top-0 z-[60] h-1 origin-left scale-x-0 bg-gradient-to-r from-[#4338FF] to-[#14B88A]" aria-hidden="true" />

      {/* NAVBAR */}
      <header className="fixed inset-x-0 top-0 z-50 border-b border-[#0E1530]/5 bg-[#F8F9FD]/80 backdrop-blur-xl">
        <div className="mx-auto flex h-[72px] max-w-6xl items-center justify-between px-6">
          <a href="#top" aria-label="TeamFlow home"><Logo /></a>

          <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
            {NAV.map(([l, h]) => (
              <a key={l} href={h} className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-[#EEF1FF] hover:text-[#4338FF]">{l}</a>
            ))}
          </nav>

          <div className="hidden items-center gap-2 md:flex">
            <button onClick={go} className="rounded-lg px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-[#EEF1FF]">Sign in</button>
            <button onClick={go} className="rounded-xl bg-[#0E1530] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#4338FF]">Get started</button>
          </div>

          <button aria-label={menuOpen ? "Close menu" : "Open menu"} aria-expanded={menuOpen} aria-controls="mobile-nav" onClick={() => setMenuOpen((o) => !o)} className="rounded-lg p-2 md:hidden">
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {menuOpen && (
          <div id="mobile-nav" className="tf-swap border-t border-slate-200 bg-white px-6 py-5 md:hidden">
            <div className="flex flex-col gap-4">
              {NAV.map(([l, h]) => (
                <a key={l} href={h} onClick={() => setMenuOpen(false)} className="text-sm font-medium">{l}</a>
              ))}
              <button onClick={() => { setMenuOpen(false); go(); }} className="rounded-lg border border-slate-200 py-2.5 text-sm font-semibold">Sign in</button>
              <button onClick={() => { setMenuOpen(false); go(); }} className="rounded-lg bg-[#4338FF] py-2.5 text-sm font-semibold text-white">Get started</button>
            </div>
          </div>
        )}
      </header>

      <main id="top">
        {/* HERO */}
        <section className="relative">
          <div className="tf-blob pointer-events-none absolute -right-32 top-10 h-[520px] w-[520px] rounded-full bg-[#4338FF]/20 blur-3xl" aria-hidden="true" />
          <div className="tf-blob pointer-events-none absolute -left-40 top-96 h-[420px] w-[420px] rounded-full bg-[#14B88A]/20 blur-3xl" style={{ animationDelay: "-8s" }} aria-hidden="true" />

          <div className="relative mx-auto grid max-w-6xl items-center gap-16 px-6 pb-24 pt-32 lg:grid-cols-[1.1fr_1fr] lg:pt-40">
            <div>
              <p className="tf-rise mb-6 inline-flex items-center gap-2 rounded-full bg-white px-4 py-1.5 text-sm font-medium text-slate-600 shadow-sm ring-1 ring-slate-200">
                <span className="relative flex h-2 w-2">
                  <span className="tf-ping absolute inset-0 rounded-full bg-[#14B88A]" />
                  <span className="relative h-2 w-2 rounded-full bg-[#14B88A]" />
                </span>
                Built for modern organizations
              </p>

              <h1 className="tf-head text-5xl font-extrabold leading-[1.02] sm:text-6xl lg:text-7xl">
                <span className="tf-rise block" style={{ animationDelay: "100ms" }}>Run your organization.</span>
                <span className="tf-rise block" style={{ animationDelay: "240ms" }}>
                  <span className="tf-grad bg-gradient-to-r from-[#4338FF] via-[#14B88A] to-[#4338FF] bg-clip-text text-transparent">Empower your teams.</span>
                </span>
              </h1>

              <p className="tf-rise mt-6 max-w-lg text-lg leading-8 text-slate-600" style={{ animationDelay: "380ms" }}>
                Create organizations, appoint admins, organize teams, track tasks and keep everyone talking, all in one workspace.
              </p>

              <div className="tf-rise mt-9 flex flex-col gap-3 sm:flex-row" style={{ animationDelay: "500ms" }}>
                <button onClick={go} className="tf-shine group inline-flex items-center justify-center gap-2 rounded-xl bg-[#4338FF] px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#4338FF]/30 transition hover:scale-[1.03] hover:bg-[#3329d9]">
                  Get started <ArrowRight size={17} className="transition group-hover:translate-x-1" />
                </button>
                <a href="#idea" className="inline-flex items-center justify-center rounded-xl bg-white px-7 py-3.5 text-sm font-semibold text-slate-800 ring-1 ring-slate-200 transition hover:ring-[#4338FF]">
                  See how it works
                </a>
              </div>
            </div>

            {/* Animated hierarchy card */}
            <div className="tf-rise relative" style={{ animationDelay: "320ms" }}>
              <div ref={tiltRef} onMouseMove={onTilt} onMouseLeave={offTilt} className="relative rounded-3xl bg-white p-6 shadow-2xl shadow-[#4338FF]/15 ring-1 ring-slate-200 transition-transform duration-200 sm:p-8" aria-label="Owner creates organizations, admins run teams, members do the work">
                <span className="tf-line absolute bottom-[5.5rem] left-[3.1rem] top-14 w-px bg-gradient-to-b from-[#4338FF] via-[#14B88A] to-slate-200 sm:left-[3.6rem]" aria-hidden="true">
                  <span className="tf-travel absolute -left-[3px] h-2 w-2 rounded-full bg-[#4338FF] shadow-[0_0_12px_#4338FF]" />
                </span>

                {[
                  [Crown, "Owner", "Creates Acme Inc.", "bg-[#0E1530] text-white", "0s"],
                  [UserCog, "Admin", "Builds the Sales and HR teams", "bg-[#4338FF] text-white", "1.2s"],
                  [User, "Team member", "Finishes the onboarding plan", "bg-[#14B88A] text-white", "2.4s"],
                ].map(([I, who, what, tone, d], i) => (
                  <div key={who} className={`relative flex items-center gap-4 ${i ? "mt-8" : ""}`}>
                    <span className={`tf-glow z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${tone}`} style={{ animationDelay: d }}><I size={21} /></span>
                    <div>
                      <p className="tf-head text-lg font-bold">{who}</p>
                      <p className="text-sm text-slate-500">{what}</p>
                    </div>
                  </div>
                ))}

                <div className="mt-8 flex items-center gap-3 rounded-2xl bg-[#F8F9FD] px-4 py-3">
                  <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-slate-200">
                    <div className="tf-fill tf-shine h-full w-[78%] rounded-full bg-gradient-to-r from-[#4338FF] to-[#14B88A]" />
                  </div>
                  <span className="text-sm font-semibold tabular-nums text-slate-600"><CountUp to={78} suffix="% done" /></span>
                </div>
              </div>

              {/* Floating notifications */}
              <div className="tf-float absolute -left-6 -top-5 hidden sm:block">
                <div className="tf-toast flex items-center gap-3 rounded-2xl bg-white p-3 pr-5 shadow-xl ring-1 ring-slate-200">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#EEF1FF] text-[#4338FF]"><Bell size={16} /></span>
                  <div><p className="text-xs font-semibold">Task assigned</p><p className="text-xs text-slate-500">Onboarding plan to Priya</p></div>
                </div>
              </div>
              <div className="tf-float absolute -bottom-6 -right-4 hidden sm:block" style={{ animationDelay: "-2.5s" }}>
                <div className="tf-toast flex items-center gap-3 rounded-2xl bg-white p-3 pr-5 shadow-xl ring-1 ring-slate-200" style={{ animationDelay: "4.5s" }}>
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-50 text-emerald-600"><Check size={16} /></span>
                  <div><p className="text-xs font-semibold">Marked as done</p><p className="text-xs text-slate-500">Invoice export fix</p></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* MARQUEE */}
        <div className="tf-marquee-wrap overflow-hidden border-y border-slate-200 bg-white py-5" aria-hidden="true">
          <div className="tf-marquee flex w-max gap-10">
            {[...MARQUEE, ...MARQUEE].map((m, i) => (
              <span key={i} className="flex items-center gap-10 whitespace-nowrap text-sm font-semibold text-slate-500">
                {m} <Sparkles size={14} className="text-[#4338FF]" />
              </span>
            ))}
          </div>
        </div>

        {/* STATS */}
        <section className="mx-auto grid max-w-6xl gap-5 px-6 py-20 sm:grid-cols-3">
          {[[3, "", "Roles, one workspace"], [100, "%", "Role-based access"], [1, "", "Place for tasks and chat"]].map(([n, s, l], i) => (
            <Reveal key={l} delay={i * 120} className="tf-lift rounded-3xl bg-white p-8 text-center ring-1 ring-slate-200">
              <p className="tf-head text-6xl font-extrabold text-[#4338FF]"><CountUp to={n} suffix={s} /></p>
              <p className="mt-2 text-sm font-medium text-slate-500">{l}</p>
            </Reveal>
          ))}
        </section>

        {/* THE IDEA */}
        <section id="idea" className="relative scroll-mt-20 overflow-hidden bg-[#0E1530] py-24 text-white">
          <div className="tf-blob pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full bg-[#4338FF]/30 blur-3xl" aria-hidden="true" />
          <div className="relative mx-auto max-w-6xl px-6">
            <Reveal>
              <h2 className="tf-head max-w-3xl text-4xl font-extrabold leading-[1.05] sm:text-5xl">
                You manage the organization. <span className="text-[#8c85ff]">Admins run the teams.</span>
              </h2>
              <p className="mt-6 max-w-xl text-lg leading-8 text-slate-300">
                Platform control stays at the top. Everyone else gets a workspace built for their own responsibilities.
              </p>
            </Reveal>

            <ol className="mt-14 grid gap-5 md:grid-cols-4">
              {["Owner creates the organization", "Owner appoints administrators", "Admins build teams and add employees", "Admins assign tasks and follow progress"].map((t, i) => (
                <Reveal key={t} delay={i * 130}>
                  <li className="tf-lift h-full list-none rounded-2xl bg-white/[0.06] p-6 ring-1 ring-white/10">
                    <span className="tf-head bg-gradient-to-br from-[#8c85ff] to-[#5eead4] bg-clip-text text-4xl font-extrabold text-transparent">{i + 1}</span>
                    <p className="mt-3 font-semibold leading-6">{t}</p>
                  </li>
                </Reveal>
              ))}
            </ol>
          </div>
        </section>

        {/* ROLES */}
        <section id="roles" className="scroll-mt-20 py-24">
          <div className="mx-auto max-w-6xl px-6">
            <Reveal className="max-w-2xl">
              <h2 className="tf-head text-4xl font-extrabold leading-tight sm:text-5xl">Clear roles. Clear responsibility.</h2>
              <p className="mt-5 text-lg leading-8 text-slate-600">Pick a role to see what it can do and what its workspace shows.</p>
            </Reveal>

            <Reveal className="mt-10">
              <div role="tablist" aria-label="Roles" className="inline-flex gap-1 rounded-2xl bg-white p-1.5 ring-1 ring-slate-200">
                {ROLES.map((r) => (
                  <button
                    key={r.id}
                    role="tab"
                    id={`tab-${r.id}`}
                    aria-selected={role === r.id}
                    aria-controls="role-panel"
                    onClick={() => setRole(r.id)}
                    className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${role === r.id ? "bg-[#0E1530] text-white shadow-lg" : "text-slate-600 hover:bg-[#EEF1FF] hover:text-[#4338FF]"}`}
                  >
                    <r.icon size={16} /> {r.label}
                  </button>
                ))}
              </div>

              <div id="role-panel" role="tabpanel" aria-labelledby={`tab-${role}`} key={role} className="tf-swap mt-6 grid gap-6 rounded-3xl bg-white p-6 ring-1 ring-slate-200 sm:p-10 lg:grid-cols-2">
                <div>
                  <h3 className="tf-head text-3xl font-extrabold">{active.title}</h3>
                  <p className="mt-3 text-slate-600">{active.text}</p>
                  <ul className="mt-6 space-y-3">
                    {active.items.map((it, i) => (
                      <li key={it} className="tf-swap flex items-center gap-3 text-sm font-medium" style={{ animationDelay: `${120 + i * 90}ms` }}>
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#EEF1FF] text-[#4338FF]"><Check size={13} /></span>{it}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-2xl bg-[#F8F9FD] p-3">
                  {active.preview.map(([a, b, c], i) => (
                    <div key={a} className="tf-swap flex items-center justify-between gap-3 rounded-xl px-4 py-3.5 transition hover:bg-white" style={{ animationDelay: `${150 + i * 100}ms` }}>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold">{a}</p>
                        <p className="text-xs text-slate-400">{b}</p>
                      </div>
                      <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${pill[c]}`}>{c}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* FEATURES */}
        <section id="features" className="scroll-mt-20 pb-12">
          <div className="mx-auto max-w-6xl divide-y divide-slate-200 px-6">
            <Feature icon={ClipboardCheck} title="Tasks that never get lost" text="Create, assign and prioritize work across every team, and see what is overdue at a glance.">
              {[["Prepare Q4 onboarding plan", "High", "bg-rose-100 text-rose-700", "0s"], ["Launch referral campaign", "Medium", "bg-amber-100 text-amber-700", "1.4s"], ["Publish hiring policy", "Low", "bg-emerald-100 text-emerald-700", "2.8s"]].map(([t, p, c, d]) => (
                <div key={t} className="flex items-center gap-3 rounded-xl px-3 py-3">
                  <span className="tf-check flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2" style={{ animationDelay: d }}><Check size={11} className="text-white" /></span>
                  <span className="tf-strike flex-1 text-sm font-medium" style={{ animationDelay: d }}>{t}</span>
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${c}`}>{p}</span>
                </div>
              ))}
            </Feature>

            <Feature flip icon={MessageSquare} title="Chat where the work happens" text="Conversations stay with the people doing the work, so nothing gets lost in another app.">
              <div className="min-h-[190px] space-y-3 text-sm">
                <p className="tf-msg w-fit max-w-[80%] rounded-2xl rounded-bl-md bg-[#F8F9FD] px-4 py-2.5">Is the invoice fix live?</p>
                <p className="tf-msg ml-auto w-fit max-w-[80%] rounded-2xl rounded-br-md bg-[#4338FF] px-4 py-2.5 text-white" style={{ animationDelay: "1.4s" }}>Yes, marked as done.</p>
                <p className="tf-msg w-fit max-w-[80%] rounded-2xl rounded-bl-md bg-[#F8F9FD] px-4 py-2.5" style={{ animationDelay: "2.8s" }}>Great, thanks!</p>
                <p className="tf-msg flex w-fit gap-1 rounded-2xl rounded-bl-md bg-[#F8F9FD] px-4 py-3" style={{ animationDelay: "4s" }} aria-hidden="true">
                  {[0, 1, 2].map((i) => <span key={i} className="tf-dot h-1.5 w-1.5 rounded-full bg-slate-400" style={{ animationDelay: `${i * 0.15}s` }} />)}
                </p>
              </div>
            </Feature>

            <Feature icon={TrendingUp} title="See progress as it happens" text="Every team shows how much is to do, in progress and done, without asking anyone for a status update.">
              {[["To do", "w-[30%]", "bg-slate-300"], ["In progress", "w-[45%]", "bg-[#4338FF]"], ["Done", "w-[78%]", "bg-[#14B88A]"]].map(([l, w, c]) => (
                <div key={l} className="px-3 py-3">
                  <p className="mb-2 text-sm font-medium text-slate-600">{l}</p>
                  <div className="h-2.5 overflow-hidden rounded-full bg-slate-100"><div className={`tf-fill tf-shine h-full rounded-full ${w} ${c}`} /></div>
                </div>
              ))}
            </Feature>
          </div>
        </section>

        {/* CTA */}
        <section className="px-6 pb-24">
          <Reveal className="relative mx-auto max-w-6xl overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#4338FF] via-[#5a4dff] to-[#14B88A] px-6 py-20 text-center text-white sm:px-12">
            <div className="tf-blob pointer-events-none absolute -left-20 -top-20 h-72 w-72 rounded-full bg-white/15 blur-2xl" aria-hidden="true" />
            <div className="tf-blob pointer-events-none absolute -bottom-24 -right-16 h-80 w-80 rounded-full bg-white/15 blur-2xl" style={{ animationDelay: "-6s" }} aria-hidden="true" />
            <div className="relative">
              <Users size={30} className="tf-float mx-auto" />
              <h2 className="tf-head mx-auto mt-5 max-w-2xl text-4xl font-extrabold leading-tight sm:text-5xl">
                Give your admins the power to run their teams.
              </h2>
              <p className="mx-auto mt-5 max-w-xl text-lg leading-8 text-white/85">
                Create the structure, appoint your administrators and give every team member a clear place to work.
              </p>
              <button onClick={go} className="tf-shine group mt-9 inline-flex items-center gap-2 rounded-xl bg-white px-7 py-3.5 text-sm font-semibold text-[#0E1530] shadow-lg transition hover:scale-105">
                Get started <ArrowRight size={17} className="transition group-hover:translate-x-1" />
              </button>
            </div>
          </Reveal>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-6 py-10 sm:flex-row sm:items-center">
          <Logo size="h-8 w-8" />
          <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-500" aria-label="Footer">
            {NAV.map(([l, h]) => (
              <a key={l} href={h} className="transition hover:text-[#4338FF]">{l}</a>
            ))}
            <button onClick={go} className="transition hover:text-[#4338FF]">Sign in</button>
          </nav>
          <p className="text-sm text-slate-400">© 2026 TeamFlow</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;