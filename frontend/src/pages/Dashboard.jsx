import { useState, useEffect } from 'react';
import { dashboardApi } from '../api/dashboard';
import { FolderKanban, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import TaskCard from '../components/tasks/TaskCard';

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await dashboardApi.getDashboard();
        setData(res);
      } catch (err) {
        console.error('Failed to fetch dashboard', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
    </div>
  );
  if (!data) return <div className="p-8 text-center text-red-500 font-medium">Failed to load dashboard data.</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Dashboard Overview</h1>
        <p className="text-slate-500 mt-1">Here is what's happening with your projects today.</p>
      </div>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-slate-100 p-6 flex items-center gap-5 relative overflow-hidden group">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-indigo-50 rounded-full group-hover:scale-150 transition-transform duration-500"></div>
          <div className="w-14 h-14 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center relative z-10">
            <FolderKanban size={28} />
          </div>
          <div className="relative z-10">
            <div className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Projects</div>
            <div className="text-3xl font-extrabold text-slate-900 mt-1">{data.totalProjects}</div>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-slate-100 p-6 flex items-center gap-5 relative overflow-hidden group">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-purple-50 rounded-full group-hover:scale-150 transition-transform duration-500"></div>
          <div className="w-14 h-14 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center relative z-10">
            <CheckCircle2 size={28} />
          </div>
          <div className="relative z-10">
            <div className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Total Tasks</div>
            <div className="text-3xl font-extrabold text-slate-900 mt-1">{data.totalTasks}</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-slate-100 p-6 flex items-center gap-5 relative overflow-hidden group">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-amber-50 rounded-full group-hover:scale-150 transition-transform duration-500"></div>
          <div className="w-14 h-14 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center relative z-10">
            <Clock size={28} />
          </div>
          <div className="relative z-10">
            <div className="text-sm font-semibold text-slate-500 uppercase tracking-wider">In Progress</div>
            <div className="text-3xl font-extrabold text-slate-900 mt-1">{data.tasksByStatus?.IN_PROGRESS || 0}</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-slate-100 p-6 flex items-center gap-5 relative overflow-hidden group">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-emerald-50 rounded-full group-hover:scale-150 transition-transform duration-500"></div>
          <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center relative z-10">
            <CheckCircle2 size={28} />
          </div>
          <div className="relative z-10">
            <div className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Completed</div>
            <div className="text-3xl font-extrabold text-slate-900 mt-1">{data.tasksByStatus?.DONE || 0}</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Overdue Tasks */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-red-100 text-red-600 rounded-lg">
              <AlertCircle size={20} />
            </div>
            <h2 className="text-xl font-bold text-slate-900">Overdue Tasks</h2>
          </div>
          
          <div className="space-y-4">
            {data.overdueTasks?.length > 0 ? (
              data.overdueTasks.map(task => (
                <TaskCard key={task.id} task={task} />
              ))
            ) : (
              <div className="bg-slate-50 rounded-xl border border-dashed border-slate-200 p-8 text-center">
                <p className="text-slate-500 text-sm font-medium">No overdue tasks! 🎉</p>
                <p className="text-slate-400 text-xs mt-1">You're completely caught up.</p>
              </div>
            )}
          </div>
        </div>

        {/* My Tasks */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-primary-100 text-primary-600 rounded-lg">
              <CheckCircle2 size={20} />
            </div>
            <h2 className="text-xl font-bold text-slate-900">My Tasks</h2>
          </div>
          
          <div className="space-y-4">
            {data.myTasks?.length > 0 ? (
              data.myTasks.slice(0, 5).map(task => (
                <TaskCard key={task.id} task={task} />
              ))
            ) : (
              <div className="bg-slate-50 rounded-xl border border-dashed border-slate-200 p-8 text-center">
                <p className="text-slate-500 text-sm font-medium">You have no tasks assigned.</p>
                <p className="text-slate-400 text-xs mt-1">Check projects for available tasks.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
