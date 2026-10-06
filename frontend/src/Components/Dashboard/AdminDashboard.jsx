import React from "react";
import Navbar from "../Layout/Navbar";
import Sidebar from "../Layout/Sidebar";
import {
  LayoutDashboard,
  Users,
  UserRound,
} from "lucide-react";

const menuItems = [
  {
    name: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Teams",
    path: "/teams",
    icon: Users,
  },
  {
    name: "Employees",
    path: "/employees",
    icon: UserRound,
  },
];

const AdminDashboard = () => {
  return (
    <div className="bg-slate-100 min-h-screen">
      <Navbar />

      <div className="flex">
        <Sidebar menuItems={menuItems} />

        <main className="flex-1 p-8">
          {/* Header */}
          <div>
            <p className="text-sm font-medium text-slate-500">
              Overview
            </p>

            <h1 className="text-4xl font-bold mt-2">
              Admin Dashboard
            </h1>

            <p className="text-slate-500 mt-2">
              Manage employees, teams and tasks from one place.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mt-8">
            <StatCard
              title="Employees"
              value="120"
              subtitle="Total Employees"
            />

            <StatCard
              title="Teams"
              value="12"
              subtitle="Active Teams"
            />

            <StatCard
              title="Tasks"
              value="450"
              subtitle="Assigned Tasks"
            />

            <StatCard
              title="Completed"
              value="320"
              subtitle="Completed Tasks"
            />
          </div>

          {/* Bottom Section */}
          <div className="grid lg:grid-cols-3 gap-6 mt-8">
            {/* Recent Employees */}
            <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-bold">
                    Recent Employees
                  </h2>

                  <p className="text-slate-500 text-sm">
                    Latest joined team members
                  </p>
                </div>

                <button className="font-semibold">
                  View all
                </button>
              </div>

              <div className="mt-6 space-y-4">
                {[1, 2, 3, 4].map((item) => (
                  <div
                    key={item}
                    className="flex justify-between items-center border-b pb-4"
                  >
                    <div>
                      <h3 className="font-semibold">
                        Employee {item}
                      </h3>

                      <p className="text-sm text-slate-500">
                        Software Developer
                      </p>
                    </div>

                    <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-sm">
                      Active
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-slate-950 rounded-3xl p-6 text-white">
              <p className="text-slate-400">
                Quick Actions
              </p>

              <h2 className="text-3xl font-bold mt-4">
                Manage Team
              </h2>

              <p className="text-slate-400 mt-3">
                Add employees, create teams and assign tasks.
              </p>

              <div className="space-y-3 mt-8">
                <button className="w-full bg-white text-black py-3 rounded-xl font-semibold">
                  Add Employee
                </button>

                <button className="w-full border border-white/20 py-3 rounded-xl">
                  Create Team
                </button>

                <button className="w-full border border-white/20 py-3 rounded-xl">
                  Assign Task
                </button>
              </div>
            </div>
          </div>

          {/* Recent Tasks */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm mt-8">
            <h2 className="text-xl font-bold">
              Recent Tasks
            </h2>

            <p className="text-slate-500 text-sm mt-1">
              Latest task activity
            </p>

            <div className="overflow-x-auto mt-6">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3">Task</th>
                    <th className="text-left py-3">Assigned To</th>
                    <th className="text-left py-3">Status</th>
                  </tr>
                </thead>

                <tbody>
                  <tr className="border-b">
                    <td className="py-4">Build Login Page</td>
                    <td>Rahul</td>
                    <td className="text-green-600">
                      Completed
                    </td>
                  </tr>

                  <tr className="border-b">
                    <td className="py-4">Create Dashboard</td>
                    <td>Aman</td>
                    <td className="text-yellow-500">
                      In Progress
                    </td>
                  </tr>

                  <tr>
                    <td className="py-4">API Integration</td>
                    <td>Priya</td>
                    <td className="text-red-500">
                      Pending
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, subtitle }) => {
  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
      <h3 className="text-slate-500 font-medium">
        {title}
      </h3>

      <h1 className="text-4xl font-bold mt-3">
        {value}
      </h1>

      <p className="text-slate-400 mt-2 text-sm">
        {subtitle}
      </p>
    </div>
  );
};

export default AdminDashboard;