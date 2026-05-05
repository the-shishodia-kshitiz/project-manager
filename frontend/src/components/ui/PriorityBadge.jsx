const PriorityBadge = ({ priority }) => {
  const getStyles = () => {
    switch (priority) {
      case 'LOW':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'MEDIUM':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'HIGH':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  return (
    <span className={`px-2 py-0.5 rounded-md border text-[10px] font-extrabold tracking-wider uppercase shadow-sm ${getStyles()}`}>
      {priority}
    </span>
  );
};

export default PriorityBadge;
