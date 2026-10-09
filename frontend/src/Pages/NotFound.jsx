import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { primaryButton } from "../Utils/styles";

const NotFound = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-6">
      <div className="text-center">
        <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-slate-950">
          <div className="h-5 w-5 rounded-md bg-white" />
        </div>

        <p className="mt-6 text-sm font-semibold text-slate-400">404</p>

        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">Page not found</h1>

        <p className="mt-2 text-sm text-slate-500">The page you're looking for doesn't exist or has moved.</p>

        <Link to="/dashboard" className={`${primaryButton} mt-8 px-5 py-3`}>
          <ArrowLeft size={17} />
          Back to dashboard
        </Link>
      </div>
    </div>
  );
};

export default NotFound;