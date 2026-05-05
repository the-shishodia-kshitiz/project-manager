import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { projectsApi } from '../api/projects';
import { tasksApi } from '../api/tasks';
import KanbanBoard from '../components/tasks/KanbanBoard';
import { Users, Plus, FolderKanban } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

const ProjectDetail = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = useAuthStore(state => state.user);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      const [projData, tasksData] = await Promise.all([
        projectsApi.getById(id),
        tasksApi.getProjectTasks(id)
      ]);
      setProject(projData);
      setTasks(tasksData.content || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleTaskStatusChange = async (taskId, newStatus) => {
    // Optimistic UI update
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
    try {
      await tasksApi.update(taskId, { status: newStatus });
    } catch (err) {
      console.error('Failed to update task', err);
      // Revert on error
      fetchData(); 
    }
  };

  const isProjectAdmin = user?.role === 'ADMIN' || 
    project?.members?.some(m => m.user.id === user?.id && m.role === 'ADMIN');

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
    </div>
  );
  if (!project) return <div className="p-8 text-center text-red-500 font-medium">Project not found</div>;

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8 h-[calc(100vh-64px)] flex flex-col animate-fade-in">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8 shrink-0 bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
        <div className="flex items-start gap-5">
          <div className="hidden sm:flex w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl items-center justify-center shrink-0">
            <FolderKanban size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 mb-1 tracking-tight">{project.name}</h1>
            <p className="text-slate-500 font-medium">{project.description}</p>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto">
          <div className="flex -space-x-2" title="Project Members">
            {project.members.slice(0, 5).map(member => (
              <div 
                key={member.user.id} 
                className="w-10 h-10 rounded-full border-2 border-white bg-gradient-to-br from-indigo-100 to-purple-100 text-indigo-700 flex items-center justify-center font-bold text-sm shadow-sm"
                title={`${member.user.name} (${member.role})`}
              >
                {member.user.name.charAt(0).toUpperCase()}
              </div>
            ))}
            {project.members.length > 5 && (
              <div className="w-10 h-10 rounded-full border-2 border-white bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-xs shadow-sm">
                +{project.members.length - 5}
              </div>
            )}
          </div>
          
          {isProjectAdmin && (
            <div className="flex items-center gap-3 ml-auto lg:ml-4">
              <button className="flex items-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-4 py-2.5 rounded-xl font-bold transition-all shadow-sm hover:shadow">
                <Users size={18} /> Manage
              </button>
              <Link 
                to={`/projects/${id}/tasks/new`}
                className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-md shadow-primary-500/20 hover:-translate-y-0.5"
              >
                <Plus size={18} strokeWidth={3} /> Add Task
              </Link>
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 min-h-0 bg-white/50 backdrop-blur-sm rounded-3xl border border-slate-200 p-2 sm:p-4 shadow-inner">
        <KanbanBoard tasks={tasks} onTaskStatusChange={handleTaskStatusChange} />
      </div>
    </div>
  );
};

export default ProjectDetail;
