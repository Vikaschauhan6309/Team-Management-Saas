import React from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Check,
  ChevronRight,
  CircleCheck,
  ClipboardCheck,
  Kanban,
  LayoutDashboard,
  MessageSquare,
  ShieldCheck,
  Users,
  Zap,
  Menu,
  X,
} from "lucide-react";

const LandingPage = () => {
  const [mobileMenu, setMobileMenu] = React.useState(false);
  const nav = useNavigate();
  const goToLogin = () => nav("/login");

  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* ================= NAVBAR ================= */}

      <nav className="fixed left-0 right-0 top-0 z-50 border-b border-slate-200/70 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-8">
          <a href="#" className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-950">
              <div className="h-4 w-4 rounded-md bg-white" />
            </div>

            <span className="text-xl font-bold tracking-tight">
              TeamFlow
            </span>
          </a>

          <div className="hidden items-center gap-8 md:flex">
            <a
              href="#features"
              className="text-sm font-medium text-slate-600 transition hover:text-slate-950"
            >
              Features
            </a>

            <a
              href="#workflow"
              className="text-sm font-medium text-slate-600 transition hover:text-slate-950"
            >
              How it works
            </a>

            <a
              href="#access"
              className="text-sm font-medium text-slate-600 transition hover:text-slate-950"
            >
              Access control
            </a>

            <a
              href="#pricing"
              className="text-sm font-medium text-slate-600 transition hover:text-slate-950"
            >
              Pricing
            </a>
          </div>

          <div className="hidden items-center gap-3 md:flex">
            <button onClick={goToLogin} className="rounded-lg px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100">
              Sign in
            </button>

            <button onClick={goToLogin} className="flex items-center gap-2 rounded-lg bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800">
              Get started
              <ArrowRight size={16} />
            </button>
          </div>

          <button
            onClick={() => setMobileMenu(!mobileMenu)}
            className="rounded-lg p-2 text-slate-700 md:hidden"
          >
            {mobileMenu ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {mobileMenu && (
          <div className="border-t border-slate-200 bg-white px-6 py-5 md:hidden">
            <div className="flex flex-col gap-5">
              <a href="#features" className="text-sm font-medium">
                Features
              </a>

              <a href="#workflow" className="text-sm font-medium">
                How it works
              </a>

              <a href="#access" className="text-sm font-medium">
                Access control
              </a>

              <a href="#pricing" className="text-sm font-medium">
                Pricing
              </a>

              <div className="border-t border-slate-200 pt-5">
                <button onClick={goToLogin} className="mb-3 w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold">
                  Sign in
                </button>

                <button onClick={goToLogin} className="w-full rounded-lg bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white">
                  Get started
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* ================= HERO ================= */}

      <main>
        <section className="relative overflow-hidden pt-32">
          <div className="absolute inset-0 -z-10">
            <div className="absolute left-1/2 top-0 h-[600px] w-[1000px] -translate-x-1/2 rounded-full bg-slate-100 blur-3xl" />
          </div>

          <div className="mx-auto max-w-7xl px-6 pb-24 pt-20 lg:px-8 lg:pb-32">
            <div className="mx-auto max-w-4xl text-center">
              <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 shadow-sm">
                <span className="flex h-2 w-2 rounded-full bg-emerald-500" />

                <span className="text-sm font-medium text-slate-600">
                  Built for modern organizations
                </span>

                <ChevronRight
                  size={14}
                  className="text-slate-400"
                />
              </div>

              <h1 className="text-5xl font-bold tracking-tight text-slate-950 sm:text-6xl lg:text-7xl">
                Run your organization.
                <br />

                <span className="text-slate-400">
                  Empower your teams.
                </span>
              </h1>

              <p className="mx-auto mt-7 max-w-2xl text-lg leading-8 text-slate-600">
                A focused workspace for managing organizations,
                empowering admins, organizing teams, tracking work,
                and keeping everyone connected.
              </p>

              <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <button onClick={goToLogin} className="group flex w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-slate-950/10 transition hover:bg-slate-800 sm:w-auto">
                  Get started

                  <ArrowRight
                    size={17}
                    className="transition group-hover:translate-x-1"
                  />
                </button>

                <button onClick={() => document.getElementById("workflow")?.scrollIntoView({ behavior: "smooth" })} className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-7 py-3.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 sm:w-auto">
                  See how it works
                </button>
              </div>

              <p className="mt-4 text-xs text-slate-400">
                Built for structured team management
              </p>
            </div>

            {/* Dashboard Preview */}

            <div className="mx-auto mt-20 max-w-6xl">
              <div className="rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl shadow-slate-900/10">
                <div className="overflow-hidden rounded-xl border border-slate-200">
                  <div className="flex h-11 items-center gap-2 border-b border-slate-200 bg-slate-50 px-4">
                    <div className="h-2.5 w-2.5 rounded-full bg-slate-300" />
                    <div className="h-2.5 w-2.5 rounded-full bg-slate-300" />
                    <div className="h-2.5 w-2.5 rounded-full bg-slate-300" />
                    <div className="ml-4 h-6 flex-1 rounded-md bg-white" />
                  </div>

                  <div className="flex min-h-[480px] bg-slate-50">
                    <div className="hidden w-56 border-r border-slate-200 bg-white p-4 sm:block">
                      <div className="mb-8 flex items-center gap-2">
                        <div className="h-7 w-7 rounded-lg bg-slate-950" />
                        <div className="h-3 w-20 rounded bg-slate-200" />
                      </div>

                      <div className="space-y-2">
                        {[
                          "Dashboard",
                          "Teams",
                          "Employees",
                          "Tasks",
                          "Chat",
                        ].map((item, index) => (
                          <div
                            key={item}
                            className={`flex items-center gap-3 rounded-lg px-3 py-2.5 ${
                              index === 0 ? "bg-slate-100" : ""
                            }`}
                          >
                            <div className="h-4 w-4 rounded bg-slate-200" />
                            <div className="h-2.5 w-20 rounded bg-slate-200" />
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex-1 p-5 sm:p-8">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="h-5 w-36 rounded bg-slate-800" />
                          <div className="mt-2 h-3 w-52 rounded bg-slate-200" />
                        </div>

                        <div className="h-9 w-28 rounded-lg bg-slate-900" />
                      </div>

                      <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
                        {[
                          "Teams",
                          "Employees",
                          "Tasks",
                          "Completed",
                        ].map((item) => (
                          <div
                            key={item}
                            className="rounded-xl border border-slate-200 bg-white p-4"
                          >
                            <div className="h-3 w-16 rounded bg-slate-200" />
                            <div className="mt-3 h-7 w-12 rounded bg-slate-800" />
                            <div className="mt-3 h-2 w-20 rounded bg-slate-100" />
                          </div>
                        ))}
                      </div>

                      <div className="mt-5 grid gap-5 lg:grid-cols-3">
                        <div className="rounded-xl border border-slate-200 bg-white p-5 lg:col-span-2">
                          <div className="mb-5 flex justify-between">
                            <div className="h-4 w-28 rounded bg-slate-800" />
                            <div className="h-4 w-16 rounded bg-slate-100" />
                          </div>

                          <div className="space-y-4">
                            {[1, 2, 3, 4].map((item) => (
                              <div
                                key={item}
                                className="flex items-center gap-4"
                              >
                                <div className="h-8 w-8 rounded-full bg-slate-100" />

                                <div className="flex-1">
                                  <div className="h-3 w-32 rounded bg-slate-200" />
                                  <div className="mt-2 h-2 w-48 rounded bg-slate-100" />
                                </div>

                                <div className="h-6 w-16 rounded-full bg-slate-100" />
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="rounded-xl border border-slate-200 bg-white p-5">
                          <div className="h-4 w-24 rounded bg-slate-800" />

                          <div className="mt-6 flex justify-center">
                            <div className="flex h-36 w-36 items-center justify-center rounded-full border-[18px] border-slate-100">
                              <div className="text-center">
                                <div className="text-2xl font-bold">
                                  78%
                                </div>

                                <div className="text-[10px] text-slate-400">
                                  completed
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= FEATURES ================= */}

        <section
          id="features"
          className="scroll-mt-24 py-24 lg:py-32"
        >
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold text-slate-500">
                ONE WORKSPACE
              </p>

              <h2 className="mt-4 text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
                Everything your teams need to work together.
              </h2>

              <p className="mt-5 text-lg leading-8 text-slate-600">
                Give your admins the tools to manage people and
                teams, while employees stay focused on the work
                assigned to them.
              </p>
            </div>

            <div className="mt-16 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              <FeatureCard
                icon={LayoutDashboard}
                title="Role-specific dashboards"
                description="Give owners, admins and employees a focused workspace based on their responsibilities."
              />

              <FeatureCard
                icon={Users}
                title="Team management"
                description="Admins can create teams, organize employees and keep responsibilities clearly defined."
              />

              <FeatureCard
                icon={ClipboardCheck}
                title="Task management"
                description="Create, assign, prioritize and track work across your teams."
              />

              <FeatureCard
                icon={Kanban}
                title="Progress tracking"
                description="See what is pending, in progress and completed across your organization."
              />

              <FeatureCard
                icon={MessageSquare}
                title="Team chat"
                description="Keep team conversations connected to the people doing the work."
              />

              <FeatureCard
                icon={Zap}
                title="Real-time collaboration"
                description="Keep teams synchronized with real-time messages and task updates."
              />
            </div>
          </div>
        </section>

        {/* ================= WORKFLOW ================= */}

        <section
          id="workflow"
          className="scroll-mt-24 bg-slate-950 py-24 text-white lg:py-32"
        >
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="grid items-center gap-16 lg:grid-cols-2">
              <div>
                <p className="text-sm font-semibold text-slate-400">
                  STRUCTURED FROM THE TOP DOWN
                </p>

                <h2 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
                  You manage the
                  <br />
                  organization.
                  <br />
                  Admins run the teams.
                </h2>

                <p className="mt-6 max-w-lg text-lg leading-8 text-slate-400">
                  Keep platform-level control at the top while
                  giving admins the responsibility to manage the
                  people and work within their organization.
                </p>
              </div>

              <div className="space-y-4">
                <WorkflowStep
                  number="01"
                  title="Owner creates the organization"
                  description="Set up and manage your organizations from the platform level."
                />

                <WorkflowStep
                  number="02"
                  title="Owner creates administrators"
                  description="Give trusted administrators responsibility for running each organization."
                />

                <WorkflowStep
                  number="03"
                  title="Admins build their teams"
                  description="Admins create teams, add employees and organize the people they manage."
                />

                <WorkflowStep
                  number="04"
                  title="Admins manage the work"
                  description="Create tasks, assign employees, track progress and manage team collaboration."
                />
              </div>
            </div>
          </div>
        </section>

        {/* ================= ACCESS CONTROL ================= */}

        <section
          id="access"
          className="scroll-mt-24 py-24 lg:py-32"
        >
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="grid items-center gap-16 lg:grid-cols-2">
              <div>
                <div className="inline-flex rounded-xl bg-slate-100 p-3">
                  <ShieldCheck
                    size={25}
                    className="text-slate-800"
                  />
                </div>

                <h2 className="mt-6 text-4xl font-bold tracking-tight sm:text-5xl">
                  Clear roles.
                  <br />
                  Clear responsibility.
                </h2>

                <p className="mt-6 text-lg leading-8 text-slate-600">
                  Access starts at the administrator level. Admins
                  manage the people, teams and work inside their
                  organization, while employees focus on execution.
                </p>

                <div className="mt-8 space-y-4">
                  {[
                    "Owner controls organizations and administrators",
                    "Admins manage teams and employees",
                    "Admins create and assign tasks",
                    "Employees manage their assigned work",
                    "Team members collaborate through team chat",
                  ].map((item) => (
                    <div
                      key={item}
                      className="flex items-center gap-3"
                    >
                      <CircleCheck
                        size={19}
                        className="shrink-0 text-emerald-600"
                      />

                      <span className="text-sm font-medium text-slate-700">
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid gap-4">
                {/* Owner */}

                <RoleCard
                  role="OWNER"
                  title="Platform Owner"
                  description="Controls the organization layer and administrator access."
                  items={[
                    "Create organizations",
                    "Manage organizations",
                    "Create administrators",
                  ]}
                />

                {/* Admin */}

                <RoleCard
                  role="ADMIN"
                  title="Organization Admin"
                  description="The operational layer responsible for people and work."
                  items={[
                    "Manage teams",
                    "Create and manage employees",
                    "Create and assign tasks",
                    "Manage team collaboration",
                  ]}
                />

                {/* Employee */}

                <RoleCard
                  role="EMPLOYEE"
                  title="Team Member"
                  description="Focuses on assigned work and team collaboration."
                  items={[
                    "View assigned tasks",
                    "Update task status",
                    "Participate in team chat",
                  ]}
                />
              </div>
            </div>
          </div>
        </section>

        {/* ================= CTA ================= */}

        <section className="px-6 pb-24 lg:px-8 lg:pb-32">
          <div className="mx-auto max-w-7xl overflow-hidden rounded-3xl bg-slate-100">
            <div className="relative px-6 py-20 text-center sm:px-12 lg:px-20">
              <div className="absolute left-1/2 top-0 -z-0 h-64 w-64 -translate-x-1/2 rounded-full bg-white blur-3xl" />

              <div className="relative z-10">
                <h2 className="text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
                  Give your admins
                  <br />
                  the power to run their teams.
                </h2>

                <p className="mx-auto mt-5 max-w-xl text-lg leading-8 text-slate-600">
                  Create the structure, empower your administrators,
                  and give every team member a clear place to work.
                </p>

                <button onClick={goToLogin} className="mt-8 inline-flex items-center gap-2 rounded-xl bg-slate-950 px-7 py-3.5 text-sm font-semibold text-white shadow-lg transition hover:bg-slate-800">
                  Get started
                  <ArrowRight size={17} />
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ================= FOOTER ================= */}

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
          <div className="flex flex-col justify-between gap-8 md:flex-row">
            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-950">
                  <div className="h-3.5 w-3.5 rounded bg-white" />
                </div>

                <span className="font-bold">TeamFlow</span>
              </div>

              <p className="mt-4 max-w-xs text-sm leading-6 text-slate-500">
                A focused workspace for organizations to empower
                admins, manage teams and get work done.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-x-16 gap-y-8 sm:grid-cols-3">
              <FooterColumn
                title="Product"
                links={[
                  "Features",
                  "How it works",
                  "Access control",
                  "Pricing",
                ]}
              />

              <FooterColumn
                title="Company"
                links={[
                  "About",
                  "Careers",
                  "Contact",
                  "Blog",
                ]}
              />

              <FooterColumn
                title="Legal"
                links={[
                  "Privacy",
                  "Terms",
                  "Security",
                ]}
              />
            </div>
          </div>

          <div className="mt-12 border-t border-slate-200 pt-8">
            <p className="text-sm text-slate-400">
              © 2026 TeamFlow. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};


/* =========================================================
   COMPONENTS
========================================================= */

const FeatureCard = ({
  icon: Icon,
  title,
  description,
}) => {
  return (
    <div className="group rounded-2xl border border-slate-200 bg-white p-7 transition duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-xl hover:shadow-slate-900/5">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-800 transition group-hover:bg-slate-950 group-hover:text-white">
        <Icon size={21} />
      </div>

      <h3 className="mt-6 text-lg font-bold text-slate-950">
        {title}
      </h3>

      <p className="mt-3 text-sm leading-6 text-slate-600">
        {description}
      </p>

      <div className="mt-6 flex items-center gap-1 text-sm font-semibold text-slate-900">
        Learn more
        <ArrowRight size={15} />
      </div>
    </div>
  );
};


const WorkflowStep = ({
  number,
  title,
  description,
}) => {
  return (
    <div className="group flex gap-5 rounded-2xl border border-white/10 bg-white/[0.04] p-5 transition hover:bg-white/[0.07]">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-xs font-bold text-slate-950">
        {number}
      </div>

      <div>
        <h3 className="font-semibold text-white">
          {title}
        </h3>

        <p className="mt-1 text-sm leading-6 text-slate-400">
          {description}
        </p>
      </div>
    </div>
  );
};


const RoleCard = ({
  role,
  title,
  description,
  items,
}) => {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 transition hover:shadow-lg">
      <div className="flex items-center justify-between">
        <span className="rounded-full bg-slate-100 px-3 py-1 text-[10px] font-bold tracking-wider text-slate-600">
          {role}
        </span>

        <ShieldCheck
          size={18}
          className="text-slate-300"
        />
      </div>

      <h3 className="mt-5 text-xl font-bold text-slate-950">
        {title}
      </h3>

      <p className="mt-2 text-sm text-slate-500">
        {description}
      </p>

      <div className="mt-5 space-y-2.5">
        {items.map((item) => (
          <div
            key={item}
            className="flex items-center gap-2 text-sm text-slate-600"
          >
            <Check
              size={15}
              className="text-emerald-600"
            />

            {item}
          </div>
        ))}
      </div>
    </div>
  );
};


const FooterColumn = ({ title, links }) => {
  return (
    <div>
      <h4 className="text-sm font-semibold text-slate-950">
        {title}
      </h4>

      <div className="mt-4 space-y-3">
        {links.map((link) => (
          <a
            key={link}
            href="#"
            className="block text-sm text-slate-500 transition hover:text-slate-950"
          >
            {link}
          </a>
        ))}
      </div>
    </div>
  );
};

export default LandingPage;