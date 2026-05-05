import { Link } from 'react-router-dom';
import { Users, CheckCircle2 } from 'lucide-react';
import { format } from 'date-fns';

const ProjectCard = ({ project }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 hover:-translate-y-1 hover:shadow-lg hover:border-primary-100 transition-all duration-300 group">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold text-slate-900 mb-1.5">
            <Link to={`/projects/${project.id}`} className="hover:text-primary-600 transition-colors before:absolute before:inset-0">
              {project.name}
            </Link>
          </h3>
          <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed">{project.description || 'No description provided.'}</p>
        </div>
      </div>

      <div className="flex items-center gap-4 mt-6 pt-4 border-t border-slate-50">
        <div className="flex items-center gap-1.5 text-sm font-medium text-slate-600 bg-slate-50 px-2 py-1 rounded-md" title="Members">
          <Users size={16} className="text-slate-400" />
          <span>{project.memberCount}</span>
        </div>
        <div className="flex items-center gap-1.5 text-sm font-medium text-slate-600 bg-slate-50 px-2 py-1 rounded-md" title="Total Tasks">
          <CheckCircle2 size={16} className="text-slate-400" />
          <span>{project.taskCount}</span>
        </div>
        <div className="flex-1 text-right text-xs font-semibold text-slate-400 uppercase tracking-wider">
          {format(new Date(project.createdAt), 'MMM d, yyyy')}
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
