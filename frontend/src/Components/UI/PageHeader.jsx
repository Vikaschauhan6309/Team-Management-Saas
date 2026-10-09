const PageHeader = ({ eyebrow, title, description, actions }) => {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {eyebrow && (
          <p className="mb-2 text-sm font-medium text-slate-500">{eyebrow}</p>
        )}

        <h1 className="text-2xl font-bold tracking-tight text-slate-950">
          {title}
        </h1>

        {description && (
          <p className="mt-2 text-sm text-slate-500">{description}</p>
        )}
      </div>

      {actions && <div className="flex flex-wrap gap-3">{actions}</div>}
    </div>
  );
};

export default PageHeader;