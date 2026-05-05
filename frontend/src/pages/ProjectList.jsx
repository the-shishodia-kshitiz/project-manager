import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { projectsApi } from '../api/projects';
import ProjectCard from '../components/projects/ProjectCard';
import { Plus, FolderKanban } from 'lucide-react';

const ProjectList = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await projectsApi.getAll();
        setProjects(data);
      } catch (err) {
        console.error('Failed to fetch projects', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Projects</h1>
          <p className="text-slate-500 mt-1">Manage your team's projects and workspaces.</p>
        </div>
        <Link 
          to="/projects/new" 
          className="flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-md shadow-primary-500/20 hover:-translate-y-0.5 active:translate-y-0"
        >
          <Plus size={18} strokeWidth={3} /> New Project
        </Link>
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-slate-100 max-w-2xl mx-auto">
          <div className="w-20 h-20 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <FolderKanban size={40} className="text-primary-500" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">No projects found</h3>
          <p className="mt-2 text-slate-500 max-w-sm mx-auto">Get started by creating your first project to organize your team's tasks.</p>
          <div className="mt-8">
            <Link 
              to="/projects/new" 
              className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-bold bg-primary-50 hover:bg-primary-100 px-6 py-3 rounded-xl transition-colors"
            >
              Create First Project <Plus size={18} strokeWidth={3} />
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectList;
