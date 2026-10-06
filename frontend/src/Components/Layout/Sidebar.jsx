import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import {
  Settings,
  User,
  LogOut,
} from "lucide-react";

const Sidebar = ({ menuItems }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const bottomItems = [
    {
      name: "Settings",
      path: "/settings",
      icon: Settings,
    },
    {
      name: "Profile",
      path: "/profile",
      icon: User,
    },
    {
      name: "Logout",
      path: "/login",
      icon: LogOut,
    },
  ];

  const handleLogout = async () => {
    try {
      await axios.post(
        import.meta.env.VITE_BACKEND_URL + "/api/auth/logout",
        {},
        {
          withCredentials: true,
        }
      );

      navigate("/login");
    } catch (error) {
      console.log("Logout Error:", error);
      navigate("/login");
    }
  };

  return (
    <aside className="w-80 min-h-screen bg-white border-r border-slate-200 flex flex-col justify-between">
      {/* Top */}
      <div>
        {/* Workspace */}
        <div className="p-6 border-b border-slate-200">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Workspace
          </p>

          <div className="mt-4 flex items-center gap-4 bg-slate-50 rounded-2xl p-4">
            <div className="h-12 w-12 rounded-xl bg-slate-950 text-white flex items-center justify-center font-bold">
              TF
            </div>

            <div>
              <h3 className="font-semibold text-slate-900">
                TeamFlow
              </h3>

              <p className="text-sm text-slate-500">
                Owner Account
              </p>
            </div>
          </div>
        </div>

        {/* Management */}
        <div className="px-4 mt-6">
          <p className="px-3 mb-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Management
          </p>

          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-3 rounded-2xl px-5 py-4 mb-2 transition-all font-medium
                  ${
                    isActive
                      ? "bg-slate-950 text-white"
                      : "text-slate-700 hover:bg-slate-100"
                  }`}
              >
                <Icon size={20} />
                <span>{item.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom */}
      <div className="px-4 pb-6">
        {bottomItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <button
              key={item.name}
              onClick={() => {
                if (item.name === "Logout") {
                  handleLogout();
                } else {
                  navigate(item.path);
                }
              }}
              className={`w-full flex items-center gap-3 rounded-2xl px-5 py-4 mb-2 transition-all font-medium
                ${
                  item.name === "Logout"
                    ? "text-red-500 hover:bg-red-50"
                    : isActive
                    ? "bg-slate-950 text-white"
                    : "text-slate-700 hover:bg-slate-100"
                }`}
            >
              <Icon size={20} />
              <span>{item.name}</span>
            </button>
          );
        })}
      </div>
    </aside>
  );
};

export default Sidebar;