// Thin wrappers so every table shares the same header/row styling
export const Table = ({ headers, children }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead>
          <tr className="border-b border-slate-100">
            {headers.map((header, i) => (
              <th
                key={i}
                className={`px-6 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400 ${i == headers.length - 1 ? "text-right" : ""}`}
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-100">{children}</tbody>
      </table>
    </div>
  );
};

export const Td = ({ children, className = "" }) => {
  return <td className={`px-6 py-4 align-middle ${className}`}>{children}</td>;
};