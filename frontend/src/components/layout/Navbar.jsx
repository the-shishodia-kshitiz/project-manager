import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { authApi } from '../../api/auth';
import { LayoutDashboard, FolderKanban, Users, LogOut } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await authApi.logout();
    } catch (err) {
      console.error(err);
    } finally {
      logout();
      navigate('/login');
    }
  };

  const isActive = (path) => location.pathname.startsWith(path);

  return (
    <nav className="glass-card sticky top-0 z-50 border-b border-gray-200/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/dashboard" className="flex items-center gap-2 font-extrabold text-xl tracking-tight text-slate-800 hover:text-primary-600 transition-colors">
              <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center shadow-md shadow-primary-500/20">
                <FolderKanban size={20} className="text-white" />
              </div>
              <span>ProjectHub</span>
            </Link>
            
            {user && (
              <div className="hidden md:block ml-10">
                <div className="flex items-baseline space-x-2">
                  <Link 
                    to="/dashboard" 
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${isActive('/dashboard') ? 'bg-primary-50 text-primary-700' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}`}
                  >
                    <LayoutDashboard size={16} /> Dashboard
                  </Link>
                  <Link 
                    to="/projects" 
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${isActive('/projects') ? 'bg-primary-50 text-primary-700' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}`}
                  >
                    <FolderKanban size={16} /> Projects
                  </Link>
                  {user.role === 'ADMIN' && (
                    <Link 
                      to="/admin/users" 
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${isActive('/admin') ? 'bg-primary-50 text-primary-700' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}`}
                    >
                      <Users size={16} /> Users
                    </Link>
                  )}
                </div>
              </div>
            )}
          </div>
          
          {user && (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3 bg-slate-50/50 px-3 py-1.5 rounded-full border border-slate-200/50 shadow-sm">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 text-indigo-700 flex items-center justify-center font-bold text-sm border border-indigo-200">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="hidden sm:block text-right">
                  <div className="text-sm font-semibold leading-none text-slate-800">{user.name}</div>
                  <div className="text-[10px] font-medium text-slate-500 uppercase tracking-wider mt-0.5">{user.role}</div>
                </div>
              </div>
              <button 
                onClick={handleLogout}
                className="p-2 hover:bg-red-50 hover:text-red-600 rounded-full transition-colors text-slate-400 group"
                title="Logout"
              >
                <LogOut size={18} className="group-hover:-translate-x-0.5 transition-transform" />
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
