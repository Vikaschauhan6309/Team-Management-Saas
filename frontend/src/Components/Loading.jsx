const Loading = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white">
      <div className="flex flex-col items-center">

        {/* Logo */}

        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-950">
          <div className="h-5 w-5 animate-pulse rounded-md bg-white" />
        </div>

        {/* Loading */}

        <div className="mt-5 flex items-center gap-2">
          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.3s]" />

          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.15s]" />

          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400" />
        </div>

        <p className="mt-3 text-sm font-medium text-slate-500">
          Loading your workspace
        </p>

      </div>
    </div>
  );
};

export default Loading;