const StatCard = ({ label, value, hint, hintClass = "text-slate-400", icon: Icon, iconClass = "bg-slate-100 text-slate-700" }) => {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>

          <h2 className="mt-3 text-3xl font-bold text-slate-950">{value}</h2>
        </div>

        {Icon && (
          <div className={`rounded-xl p-2.5 ${iconClass}`}>
            <Icon size={19} />
          </div>
        )}
      </div>

      {hint && <p className={`mt-3 text-xs ${hintClass}`}>{hint}</p>}
    </div>
  );
};

export default StatCard;