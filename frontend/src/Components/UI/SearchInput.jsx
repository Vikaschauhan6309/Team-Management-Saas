import { Search } from "lucide-react";

const SearchInput = ({ value, onChange, placeholder }) => {
  return (
    <div className="relative w-full sm:max-w-xs">
      <Search size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />

      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-10 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-slate-400"
      />
    </div>
  );
};

export default SearchInput;