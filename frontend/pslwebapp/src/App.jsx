import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

//layout 
// --- LAYOUTS ---
import AdminLayout from './layouts/AdminLayout';
import EmployeeLayout from './layouts/EmployeeLayout';

// --- DASHBOARD PAGES ---
import AdminDashboard from './pages/admin/AdminDashboard';
import SettingsPage from './pages/admin/SettingsPage';
import SubscribersPage from './pages/admin/SubscribersPage';
import EmployeePage from './pages/admin/Employee';
import AddEmployee from './pages/admin/AddEmployee'
import AddSubscriber from './pages/admin/AddSubscriber';

// employees
import HelloPage from './pages/employee/HelloPage';
import WorldPage from './pages/employee/WorldPage';



// Auth
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";

// 
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />

        {/* AUTH */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        {/* 3. ADMIN ROUTES (With Admin Sidebar) */}
        <Route path="/admin" element={<AdminLayout />}>
          {/* Jab koi /admin kholaga, to dashboard par redirect karo */}
          <Route index element={<Navigate to="/admin/dashboard" />} />
          
          <Route path="dashboard" element={<AdminDashboard />} />
          {/* Add more admin pages here */}
          <Route path="settings" element={<SettingsPage />} />
          <Route path="users" element={<SubscribersPage />} /> 
          <Route path="/admin/add-subscriber" element={<AddSubscriber />} />

          <Route path="Employees" element={<EmployeePage    />} />
          <Route path="add-employee" element={<AddEmployee />} />
          

        </Route>

        {/* 4. EMPLOYEE ROUTES (With Employee Sidebar) */}
        <Route path="/employee" element={<EmployeeLayout />}>
           {/* Jab koi /employee kholaga, to hello page par redirect karo */}
           <Route index element={<Navigate to="/employee/hello" />} />

          <Route path="hello" element={<HelloPage />} />
          <Route path="world" element={<WorldPage />} />
          {/* Add more employee pages here */}
        </Route>

     </Routes>
    </BrowserRouter>
  );
}

export default App;


