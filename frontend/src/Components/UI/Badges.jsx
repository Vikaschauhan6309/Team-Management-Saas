const pill = "inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium";

export const ActiveBadge = ({ active }) => {
  return (
    <span className={`${pill} ${active ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-600"}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${active ? "bg-emerald-500" : "bg-red-500"}`} />
      {active ? "Active" : "Inactive"}
    </span>
  );
};

const statusStyles = {
  "todo": ["bg-slate-100 text-slate-600", "To Do"],
  "in-progress": ["bg-amber-50 text-amber-700", "In Progress"],
  "completed": ["bg-emerald-50 text-emerald-700", "Completed"],
};

export const StatusBadge = ({ status }) => {
  const [style, label] = statusStyles[status] || statusStyles.todo;
  return <span className={`${pill} ${style}`}>{label}</span>;
};

const priorityStyles = {
  low: "bg-slate-50 text-slate-500 ring-1 ring-inset ring-slate-200",
  medium: "bg-sky-50 text-sky-700 ring-1 ring-inset ring-sky-100",
  high: "bg-red-50 text-red-600 ring-1 ring-inset ring-red-100",
};

export const PriorityBadge = ({ priority }) => {
  return (
    <span className={`${pill} capitalize ${priorityStyles[priority] || priorityStyles.medium}`}>
      {priority}
    </span>
  );
};