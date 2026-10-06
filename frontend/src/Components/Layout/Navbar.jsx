import React from "react";
import { Bell, ChevronDown, Search } from "lucide-react";
import { useSelector } from "react-redux";

const Navbar = () => {

    const user = useSelector((store) => store.user);
  return (
    <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8">

      {/* Left Logo Section */}
      <div className="flex items-center gap-4 min-w-[250px]">
        <div className="h-12 w-12 rounded-2xl bg-black flex items-center justify-center">
          <div className="h-6 w-6 bg-white rounded-full"></div>
        </div>

        <div>
          <h2 className="text-xl font-bold text-slate-900">
            TeamFlow
          </h2>

          <p className="text-sm text-slate-500">
            Owner Workspace
          </p>
        </div>
      </div>

      {/* Search */}
      {["owner", "admin"].includes(user.role) && (
        <div className="flex-1 flex justify-center px-10">
          <div className="relative w-full max-w-xl">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

          <input
            type="text"
            placeholder={user.role === "owner" ? "Search Organizations..." : "Search Employees..."}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-12 pr-4 outline-none"
          />
        </div>
      </div>
        )}

      {/* Right Section */}
      <div className="flex items-center gap-6">
        <button className="relative">
          <Bell size={22} className="text-slate-600" />

          <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-green-500"></span>
        </button>

        <div className="h-8 w-px bg-slate-200"></div>

        <div className="h-11 w-11 rounded-full bg-slate-100 flex items-center justify-center font-bold">
          {user.name.slice(0, 1).toUpperCase()}
        </div>

        <div>
          <h3 className="font-semibold">
            {user.name}
          </h3>

          <p className="text-sm text-slate-500">
            {user.role === "owner" ? "Owner" : user.role === "admin" ? "Admin" : ""}
          </p>
        </div>

        <ChevronDown
          size={18}
          className="text-slate-500"
        />
      </div>
    </header>
  );
};

export default Navbar;