import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { tasksApi } from '../api/tasks';
import { projectsApi } from '../api/projects';
import { Loader2, ArrowLeft, CheckSquare } from 'lucide-react';

const schema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Maximum 200 characters'),
  description: z.string().max(1000, 'Maximum 1000 characters').optional(),
  status: z.enum(['TODO', 'IN_PROGRESS', 'DONE']),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']),
  dueDate: z.string().optional().refine(val => !val || new Date(val) >= new Date(new Date().setHours(0,0,0,0)), {
    message: 'Due date cannot be in the past'
  }),
  assigneeId: z.string().uuid().optional().or(z.literal('')),
});

const TaskCreate = () => {
  const { id: projectId } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [members, setMembers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    projectsApi.getMembers(projectId).then(setMembers).catch(console.error);
  }, [projectId]);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      status: 'TODO',
      priority: 'MEDIUM',
      assigneeId: ''
    }
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const payload = { ...data };
      if (!payload.assigneeId) delete payload.assigneeId;
      if (!payload.dueDate) delete payload.dueDate;
      
      await tasksApi.create(projectId, payload);
      navigate(`/projects/${projectId}`);
    } catch (err) {
      console.error(err);
      alert('Failed to create task');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <div className="mb-6">
        <Link to={`/projects/${projectId}`} className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-900 bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-sm transition-all hover:shadow hover:-translate-y-0.5">
          <ArrowLeft size={16} /> Back to Project
        </Link>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-8 py-6 border-b border-slate-100 bg-slate-50/50 flex items-center gap-4">
          <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center">
            <CheckSquare size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900">Create New Task</h1>
            <p className="text-sm text-slate-500 mt-0.5">Add a new actionable item to your project.</p>
          </div>
        </div>
        
        <div className="p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Task Title</label>
              <input
                {...register('title')}
                type="text"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl shadow-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 focus:bg-white outline-none transition-all font-medium text-slate-900"
                placeholder="E.g., Design the landing page"
              />
              {errors.title && <p className="mt-2 text-sm text-red-500 font-medium">{errors.title.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Description</label>
              <textarea
                {...register('description')}
                rows={4}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl shadow-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 focus:bg-white outline-none transition-all resize-none font-medium text-slate-900"
                placeholder="Add more details about this task..."
              />
              {errors.description && <p className="mt-2 text-sm text-red-500 font-medium">{errors.description.message}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Status</label>
                <select
                  {...register('status')}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl shadow-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 focus:bg-white outline-none transition-all font-medium text-slate-900"
                >
                  <option value="TODO">To Do</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="DONE">Done</option>
                </select>
                {errors.status && <p className="mt-2 text-sm text-red-500 font-medium">{errors.status.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Priority</label>
                <select
                  {...register('priority')}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl shadow-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 focus:bg-white outline-none transition-all font-medium text-slate-900"
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                </select>
                {errors.priority && <p className="mt-2 text-sm text-red-500 font-medium">{errors.priority.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Assignee</label>
                <select
                  {...register('assigneeId')}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl shadow-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 focus:bg-white outline-none transition-all font-medium text-slate-900"
                >
                  <option value="">Unassigned</option>
                  {members.map(member => (
                    <option key={member.user.id} value={member.user.id}>{member.user.name}</option>
                  ))}
                </select>
                {errors.assigneeId && <p className="mt-2 text-sm text-red-500 font-medium">{errors.assigneeId.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Due Date</label>
                <input
                  {...register('dueDate')}
                  type="date"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl shadow-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 focus:bg-white outline-none transition-all font-medium text-slate-900"
                />
                {errors.dueDate && <p className="mt-2 text-sm text-red-500 font-medium">{errors.dueDate.message}</p>}
              </div>
            </div>

            <div className="flex justify-end pt-6 border-t border-slate-100 mt-8">
              <Link
                to={`/projects/${projectId}`}
                className="px-6 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-xl mr-3 transition-colors"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={isLoading}
                className="flex items-center justify-center px-8 py-2.5 border border-transparent rounded-xl shadow-md shadow-primary-500/20 text-sm font-bold text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-4 focus:ring-primary-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:-translate-y-0.5 active:translate-y-0"
              >
                {isLoading ? <Loader2 className="animate-spin mr-2" size={18} /> : null}
                Create Task
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TaskCreate;
