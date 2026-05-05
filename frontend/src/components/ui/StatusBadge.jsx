const StatusBadge = ({ status }) => {
  const getStyles = () => {
    switch (status) {
      case 'TODO':
        return 'bg-slate-100 text-slate-700 border-slate-200';
      case 'IN_PROGRESS':
        return 'bg-sky-50 text-sky-700 border-sky-200';
      case 'DONE':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const formatText = (text) => text.replace('_', ' ');

  return (
    <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase border shadow-sm ${getStyles()}`}>
      {formatText(status)}
    </span>
  );
};

export default StatusBadge;
