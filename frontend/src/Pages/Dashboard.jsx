import { useSelector } from "react-redux";
import OwnerDashboard from "../Components/Dashboard/OwnerDashboard";
import AdminDashboard from "../Components/Dashboard/AdminDashboard";
import EmployeeDashboard from "../Components/Dashboard/EmployeeDashboard";

const dashboards = {
  owner: OwnerDashboard,
  admin: AdminDashboard,
  employee: EmployeeDashboard,
};

const Dashboard = () => {
  const user = useSelector((store) => store.user);
  const RoleDashboard = dashboards[user.role];

  return RoleDashboard ? <RoleDashboard /> : null;
};

export default Dashboard;