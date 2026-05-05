import { useAuthStore } from '../../store/authStore';
import { Navigate, Outlet } from 'react-router-dom';

const AdminRoute = () => {
  const user = useAuthStore((state) => state.user);

  if (user?.role !== 'ADMIN') {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default AdminRoute;
