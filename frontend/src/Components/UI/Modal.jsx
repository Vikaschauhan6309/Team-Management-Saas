import { useEffect } from "react";
import { X } from "lucide-react";

const Modal = ({ open, onClose, title, description, children, size = "max-w-lg" }) => {

  useEffect(() => {
    if (!open) return;

    const onKey = (e) => {
      if (e.key == "Escape") onClose();
    };

    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-sm"
      onMouseDown={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        className={`max-h-[90vh] w-full ${size} overflow-y-auto rounded-2xl border border-slate-200 bg-white p-6 shadow-xl`}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold tracking-tight text-slate-950">
              {title}
            </h2>

            {description && (
              <p className="mt-1 text-sm text-slate-500">{description}</p>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-950"
          >
            <X size={18} />
          </button>
        </div>

        {children}
      </div>
    </div>
  );
};

export default Modal;