import LandingPage from './Pages/Landing'
import { Routes, Route } from 'react-router-dom'
import Login from './Pages/Login'
import { Toaster } from 'react-hot-toast'
import Dashboard from './Pages/Dashboard'
import ProtectedRoutes from './Components/ProtectedRoute'
import RoleRoute from './Components/RoleRoute'
import DashboardLayout from './Components/Layout/DashboardLayout'
import Organizations from './Pages/Owner/Organizations'
import OrganizationDetails from './Pages/Owner/OrganizationDetails'
import Administrators from './Pages/Owner/Administrators'
import Teams from './Pages/Admin/Teams'
import TeamDetails from './Pages/Admin/TeamDetails'
import Employees from './Pages/Admin/Employees'
import Tasks from './Pages/Admin/Tasks'
import MyTasks from './Pages/Employee/MyTasks'
import NotFound from './Pages/NotFound'
import Conversations from './Pages/Conversations'
import Chat from './Pages/Chat'


const App = () => {
  return (
    <div>

      <Toaster />

      <Routes>
        <Route path='/' element={<LandingPage />} />
        <Route path='/login' element={<Login />} />

        <Route element={<ProtectedRoutes />}>
          <Route element={<DashboardLayout />}>
            <Route path='/dashboard' element={<Dashboard />} />

            <Route element={<RoleRoute roles={["owner"]} />}>
              <Route path='/organizations' element={<Organizations />} />
              <Route path='/organizations/:id' element={<OrganizationDetails />} />
              <Route path='/administrators' element={<Administrators />} />
            </Route>

            <Route element={<RoleRoute roles={["admin"]} />}>
              <Route path='/teams' element={<Teams />} />
              <Route path='/teams/:id' element={<TeamDetails />} />
              <Route path='/employees' element={<Employees />} />
              <Route path='/tasks' element={<Tasks />} />
            </Route>

            <Route element={<RoleRoute roles={["employee"]} />}>
              <Route path='/my-tasks' element={<MyTasks />} />
            </Route>

            <Route element={<RoleRoute roles={["admin", "employee"]} />}>
              <Route path='/conversations' element={<Conversations />} />
              <Route path='/conversations/:id' element={<Chat />} />
            </Route>
          </Route>
        </Route>

        <Route path='*' element={<NotFound />} />
      </Routes>
      
    </div>
  )
}

export default App