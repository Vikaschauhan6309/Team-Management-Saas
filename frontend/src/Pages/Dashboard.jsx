import React from "react";
import { useSelector } from "react-redux";
import AdminDashboard from "../Components/Dashboard/AdminDashboard";
import OwnerDashboard from "../Components/Dashboard/OwnerDashboard";
const Dashboard = () => {
  const user = useSelector((store) => store.user);

  if (user.role === "owner") {
    return <OwnerDashboard />;
  }

  else if (user.role === "admin") {
    return <AdminDashboard />;
  }

  return <h1>No Dashboard Found</h1>;
};

export default Dashboard;