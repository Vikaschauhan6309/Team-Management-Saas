import { Loader } from "lucide-react";

const PageLoader = () => {
  return (
    <div className="flex min-h-[calc(100vh-73px-4rem)] items-center justify-center">
      <Loader size={32} strokeWidth={1.8} className="animate-spin text-slate-700" />
    </div>
  );
};

export default PageLoader;