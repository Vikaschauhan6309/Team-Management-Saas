import React from "react";
import Navbar from "../Layout/Navbar";
import Sidebar from "../Layout/Sidebar";
import axios from "axios";
import {
  LayoutDashboard,
  Building2,
  Users,
} from "lucide-react";
import { useEffect } from "react";

const menuItems = [
  {
    name: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Organizations",
    path: "/organizations",
    icon: Building2,
  },
  {
    name: "Administrators",
    path: "/administrators",
    icon: Users,
  },
];

const OwnerDashboard = () => {  

  const [analytics, setAnalytics] = React.useState({
    totalOrganizations: 0,
    totalAdministrators: 0,
    activeOrganizations: 0,
    systemStatus: "🟢 Operational",
  });
  useEffect(() => {
    axios.get(import.meta.env.VITE_BACKEND_URL + "/api/analytics", { withCredentials: true })
    .then((data)=>{
      setAnalytics(data.data.data);
      console.log(data.data.data);
    })
  }, []);

  return (
    <div className="bg-slate-100 min-h-screen">
      <Navbar />

      <div className="flex">
        <Sidebar menuItems={menuItems} />

        <main className="flex-1 p-10">
          <p className="text-sm text-slate-500 font-medium">
            Overview
          </p>

          <h1 className="text-4xl font-bold mt-2">
            Owner Dashboard
          </h1>

          <p className="text-slate-500 mt-2">
            Manage your organizations and administrators from one place.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mt-10">
            {[
              {
                title: "Organizations",
                value: analytics.totalOrganizations,
                sub: "Total organizations",
              },
              {
                title: "Administrators",
                value: analytics.totalAdmins,
                sub: "Across all organizations",
              },
              {
                title: "Active Organizations",
                value: analytics.activeOrganizations,
                sub: "83% active",
              },
              {
                title: "System Status",
                value: analytics.systemStatus,
                sub: "Everything running normally",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm"
              >
                <h3 className="text-slate-500 font-medium">
                  {item.title}
                </h3>

                <h1 className="text-4xl font-bold mt-4">
                  {item.value}
                </h1>

                <p className="text-slate-400 mt-3">
                  {item.sub}
                </p>
              </div>
            ))}
          </div>

          {/* Bottom Section */}
          <div className="grid lg:grid-cols-3 gap-6 mt-8">
            {/* Recent Organizations */}
            <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 p-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold">
                    Recent Organizations
                  </h2>

                  <p className="text-slate-500">
                    Recently created organizations
                  </p>
                </div>

                <button className="font-semibold text-slate-700 hover:text-black">
                  View all
                </button>
              </div>

              <div className="mt-6 space-y-5">
                {[1, 2, 3].map((item) => (
                  <div
                    key={item}
                    className="flex items-center justify-between border-b pb-4"
                  >
                    <div className="flex gap-4 items-center">
                      <div className="h-12 w-12 rounded-xl bg-slate-100 flex items-center justify-center font-bold">
                        OR
                      </div>

                      <div>
                        <h3 className="font-semibold">
                          Organization {item}
                        </h3>

                        <p className="text-sm text-slate-500">
                          2 administrators
                        </p>
                      </div>
                    </div>

                    <span className="bg-green-100 text-green-600 px-4 py-1 rounded-full text-sm">
                      Active
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-slate-950 rounded-3xl p-8 text-white">
              <p className="text-slate-400">
                Quick Action
              </p>

              <h2 className="text-3xl font-bold mt-5">
                Create a New Organization
              </h2>

              <p className="mt-4 text-slate-400">
                Set up a new organization and assign its administrator.
              </p>

              <button className="w-full mt-10 bg-white text-black font-semibold py-4 rounded-2xl">
                Create Organization
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default OwnerDashboard;