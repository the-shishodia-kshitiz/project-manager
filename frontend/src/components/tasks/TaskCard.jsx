import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { format, isPast, isToday } from 'date-fns';
import { Calendar } from 'lucide-react';
import PriorityBadge from '../ui/PriorityBadge';

const TaskCard = ({ task }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id, data: { type: 'Task', task } });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const getDueDateColor = () => {
    if (!task.dueDate) return 'text-slate-400';
    const date = new Date(task.dueDate);
    if (isPast(date) && !isToday(date) && task.status !== 'DONE') return 'text-red-500 font-bold';
    if (isToday(date) && task.status !== 'DONE') return 'text-amber-500 font-bold';
    return 'text-slate-500 font-medium';
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`bg-white p-4 rounded-2xl shadow-sm border border-slate-200 cursor-grab active:cursor-grabbing hover:border-primary-300 hover:shadow-md transition-all ${
        isDragging ? 'opacity-50 border-primary-500 ring-2 ring-primary-100 scale-[1.02]' : ''
      }`}
    >
      <div className="flex justify-between items-start mb-2 gap-2">
        <h4 className="font-bold text-slate-800 text-sm leading-tight">{task.title}</h4>
      </div>
      
      {task.description && (
        <p className="text-xs text-slate-500 line-clamp-2 mb-4 leading-relaxed">{task.description}</p>
      )}

      <div className="flex items-center justify-between mt-auto pt-3 border-t border-slate-50">
        <div className="flex items-center gap-3">
          <PriorityBadge priority={task.priority} />
          {task.dueDate && (
            <div className={`flex items-center gap-1 text-[11px] ${getDueDateColor()}`}>
              <Calendar size={12} strokeWidth={2.5} />
              <span>{format(new Date(task.dueDate), 'MMM d')}</span>
            </div>
          )}
        </div>
        
        {task.assignee && (
          <div 
            className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 border border-white text-indigo-700 flex items-center justify-center text-[11px] font-bold shadow-sm"
            title={task.assignee.name}
          >
            {task.assignee.name.charAt(0).toUpperCase()}
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskCard;
