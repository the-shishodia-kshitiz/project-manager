import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { projectsApi } from '../api/projects';
import { Loader2, ArrowLeft, FolderKanban } from 'lucide-react';
import { Link } from 'react-router-dom';

const schema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Maximum 100 characters'),
  description: z.string().max(500, 'Maximum 500 characters').optional(),
});

const ProjectCreate = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema)
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const newProject = await projectsApi.create(data);
      navigate(`/projects/${newProject.id}`);
    } catch (err) {
      console.error(err);
      alert('Failed to create project');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <div className="mb-6">
        <Link to="/projects" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-900 bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-sm transition-all hover:shadow hover:-translate-y-0.5">
          <ArrowLeft size={16} /> Back to Projects
        </Link>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-8 py-6 border-b border-slate-100 bg-slate-50/50 flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center">
            <FolderKanban size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900">Create New Project</h1>
            <p className="text-sm text-slate-500 mt-0.5">Set up a new workspace for your team.</p>
          </div>
        </div>
        
        <div className="p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Project Name</label>
              <input
                {...register('name')}
                type="text"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl shadow-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 focus:bg-white outline-none transition-all font-medium text-slate-900"
                placeholder="E.g., Website Redesign"
              />
              {errors.name && <p className="mt-2 text-sm text-red-500 font-medium">{errors.name.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Description</label>
              <textarea
                {...register('description')}
                rows={4}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl shadow-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 focus:bg-white outline-none transition-all resize-none font-medium text-slate-900"
                placeholder="What is this project about?"
              />
              {errors.description && <p className="mt-2 text-sm text-red-500 font-medium">{errors.description.message}</p>}
            </div>

            <div className="flex justify-end pt-6 border-t border-slate-100 mt-8">
              <Link
                to="/projects"
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
                Create Project
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProjectCreate;
