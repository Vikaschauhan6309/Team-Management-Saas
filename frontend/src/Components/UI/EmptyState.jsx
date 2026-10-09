const EmptyState = ({ icon: Icon, title, description, action }) => {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-14 text-center">
      {Icon && (
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-500">
          <Icon size={22} strokeWidth={1.8} />
        </div>
      )}

      <p className="mt-4 text-sm font-semibold text-slate-950">{title}</p>

      {description && (
        <p className="mt-1 max-w-sm text-sm text-slate-500">{description}</p>
      )}

      {action && <div className="mt-5">{action}</div>}
    </div>
  );
};

export default EmptyState;