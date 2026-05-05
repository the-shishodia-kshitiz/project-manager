import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import PrivateRoute from './components/layout/PrivateRoute';
import AdminRoute from './components/layout/AdminRoute';

// Pages
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import ProjectList from './pages/ProjectList';
import ProjectCreate from './pages/ProjectCreate';
import ProjectDetail from './pages/ProjectDetail';
import TaskCreate from './pages/TaskCreate';
import TaskDetail from './pages/TaskDetail';
import AdminUsers from './pages/AdminUsers';

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-gray-50 font-sans text-gray-900">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
          <Route element={<><Navbar /><PrivateRoute /></>}>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            
            <Route path="/projects" element={<ProjectList />} />
            <Route path="/projects/new" element={<ProjectCreate />} />
            <Route path="/projects/:id" element={<ProjectDetail />} />
            
            <Route path="/projects/:id/tasks/new" element={<TaskCreate />} />
            <Route path="/projects/:projectId/tasks/:taskId" element={<TaskDetail />} />
            
            <Route element={<AdminRoute />}>
              <Route path="/admin/users" element={<AdminUsers />} />
            </Route>
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
