import { useState, useEffect } from 'react';
import { 
  DndContext, 
  closestCorners, 
  KeyboardSensor, 
  PointerSensor, 
  useSensor, 
  useSensors,
  DragOverlay,
  defaultDropAnimationSideEffects
} from '@dnd-kit/core';
import { 
  SortableContext, 
  verticalListSortingStrategy,
  sortableKeyboardCoordinates
} from '@dnd-kit/sortable';
import TaskCard from './TaskCard';
import { useDroppable } from '@dnd-kit/core';

// Column Component
const KanbanColumn = ({ id, title, tasks }) => {
  const { setNodeRef, isOver } = useDroppable({
    id: id,
    data: {
      type: 'Column',
      columnId: id,
    }
  });

  return (
    <div className="flex flex-col bg-slate-50/80 backdrop-blur-sm rounded-3xl w-full min-w-[320px] border border-slate-200/60 shadow-sm overflow-hidden">
      <div className="p-5 border-b border-slate-200/60 flex items-center justify-between bg-white/50">
        <h3 className="font-extrabold text-slate-800 tracking-tight">{title}</h3>
        <span className="bg-slate-200/80 text-slate-700 text-xs font-bold px-2.5 py-1 rounded-full shadow-inner">
          {tasks.length}
        </span>
      </div>
      <div 
        ref={setNodeRef}
        className={`flex-1 p-4 min-h-[500px] flex flex-col gap-4 transition-all duration-300 ${isOver ? 'bg-primary-50/50 ring-2 ring-primary-200/50 inset-0' : ''}`}
      >
        <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
          {tasks.map(task => (
            <TaskCard key={task.id} task={task} />
          ))}
        </SortableContext>
        {tasks.length === 0 && (
          <div className="flex items-center justify-center h-24 mt-4 bg-transparent text-sm font-medium text-slate-400 border-2 border-dashed border-slate-200 rounded-2xl">
            Drop tasks here
          </div>
        )}
      </div>
    </div>
  );
};

const KanbanBoard = ({ tasks, onTaskStatusChange }) => {
  const [columns, setColumns] = useState({
    'TODO': [],
    'IN_PROGRESS': [],
    'DONE': []
  });
  const [activeTask, setActiveTask] = useState(null);

  // Initialize columns
  useEffect(() => {
    setColumns({
      'TODO': tasks.filter(t => t.status === 'TODO'),
      'IN_PROGRESS': tasks.filter(t => t.status === 'IN_PROGRESS'),
      'DONE': tasks.filter(t => t.status === 'DONE'),
    });
  }, [tasks]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragStart = (event) => {
    const { active } = event;
    const task = tasks.find(t => t.id === active.id);
    setActiveTask(task);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveTask(null);

    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    // Find the task and its original status
    const task = tasks.find(t => t.id === activeId);
    if (!task) return;

    const originalStatus = task.status;
    let newStatus = originalStatus;

    // Determine what we dropped over
    const overData = over.data.current;
    
    if (overData?.type === 'Column') {
      newStatus = overData.columnId;
    } else if (overData?.type === 'Task') {
      newStatus = overData.task.status;
    }

    if (originalStatus !== newStatus) {
      onTaskStatusChange(task.id, newStatus);
    }
  };

  const dropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
      styles: {
        active: {
          opacity: '0.4',
        },
      },
    }),
  };

  return (
    <DndContext 
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-6 overflow-x-auto pb-4 pt-2">
        <KanbanColumn id="TODO" title="To Do" tasks={columns['TODO']} />
        <KanbanColumn id="IN_PROGRESS" title="In Progress" tasks={columns['IN_PROGRESS']} />
        <KanbanColumn id="DONE" title="Done" tasks={columns['DONE']} />
      </div>

      <DragOverlay dropAnimation={dropAnimation}>
        {activeTask ? <TaskCard task={activeTask} /> : null}
      </DragOverlay>
    </DndContext>
  );
};

export default KanbanBoard;
