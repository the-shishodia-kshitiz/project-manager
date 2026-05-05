import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { tasksApi } from '../api/tasks';
import { ArrowLeft, Calendar, User as UserIcon, AlertCircle, CheckSquare } from 'lucide-react';
import StatusBadge from '../components/ui/StatusBadge';
import PriorityBadge from '../components/ui/PriorityBadge';
import { format } from 'date-fns';

const TaskDetail = () => {
  const { projectId, taskId } = useParams();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const data = await tasksApi.getById(taskId);
        setTask(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTask();
  }, [taskId]);

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this task?')) {
      try {
        await tasksApi.delete(taskId);
        navigate(`/projects/${projectId}`);
      } catch (err) {
        alert('Failed to delete task. You might not have permission.');
      }
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
    </div>
  );
  if (!task) return <div className="p-8 text-center text-red-500 font-medium">Task not found</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <div className="mb-6 flex justify-between items-center">
        <Link to={`/projects/${projectId}`} className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-900 bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-sm transition-all hover:shadow hover:-translate-y-0.5">
          <ArrowLeft size={16} /> Back to Project
        </Link>
        <button 
          onClick={handleDelete}
          className="text-red-600 hover:text-white hover:bg-red-600 text-sm font-bold px-4 py-2 rounded-xl border border-red-200 hover:border-red-600 transition-all shadow-sm"
        >
          Delete Task
        </button>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-8 py-6 border-b border-slate-100 bg-slate-50/50 flex items-start justify-between gap-4">
          <div className="flex gap-4">
            <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center shrink-0">
              <CheckSquare size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900 mb-2 leading-tight">{task.title}</h1>
              <div className="flex items-center gap-3">
                <StatusBadge status={task.status} />
                <PriorityBadge priority={task.priority} />
              </div>
            </div>
          </div>
        </div>
        <div className="p-8">
          <div className="prose max-w-none text-slate-600 mb-10 whitespace-pre-wrap font-medium leading-relaxed">
            {task.description || <span className="italic text-slate-400">No description provided.</span>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-8 border-t border-slate-100">
            <div className="flex items-start gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <div className="p-2 bg-white rounded-xl text-slate-400 shadow-sm">
                <UserIcon size={20} />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Assignee</div>
                <div className="font-semibold text-slate-900">
                  {task.assignee ? task.assignee.name : 'Unassigned'}
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <div className="p-2 bg-white rounded-xl text-slate-400 shadow-sm">
                <Calendar size={20} />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Due Date</div>
                <div className="font-semibold text-slate-900 flex items-center gap-2">
                  {task.dueDate ? (
                    <>
                      {format(new Date(task.dueDate), 'MMM d, yyyy')}
                      {new Date(task.dueDate) < new Date() && task.status !== 'DONE' && (
                        <AlertCircle size={14} className="text-red-500" title="Overdue" />
                      )}
                    </>
                  ) : (
                    'No due date'
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex items-start gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100 sm:col-span-2 lg:col-span-1">
              <div className="p-2 bg-white rounded-xl text-slate-400 shadow-sm">
                <UserIcon size={20} />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Created By</div>
                <div className="font-semibold text-slate-900">
                  {task.createdBy?.name}
                  <div className="text-xs text-slate-500 mt-0.5">{format(new Date(task.createdAt), 'MMM d, yyyy')}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetail;
