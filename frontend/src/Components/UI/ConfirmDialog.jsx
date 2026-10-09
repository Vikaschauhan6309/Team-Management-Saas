import { useState } from "react";
import Modal from "./Modal";
import { dangerButton, primaryButton, secondaryButton } from "../../Utils/styles";

// onConfirm may return a promise; the dialog shows a busy state until it settles
const ConfirmDialog = ({ open, onClose, onConfirm, title, message, confirmLabel = "Confirm", danger = false }) => {
  const [busy, setBusy] = useState(false);

  const handleConfirm = async () => {
    setBusy(true);
    try {
      await onConfirm();
      onClose();
    } catch {
      // caller already surfaced the error
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal open={open} onClose={busy ? () => {} : onClose} title={title} size="max-w-md">
      <p className="text-sm leading-6 text-slate-600">{message}</p>

      <div className="mt-6 flex justify-end gap-3">
        <button type="button" onClick={onClose} disabled={busy} className={secondaryButton}>
          Cancel
        </button>

        <button
          type="button"
          onClick={handleConfirm}
          disabled={busy}
          className={danger ? dangerButton : primaryButton}
        >
          {busy ? "Please wait..." : confirmLabel}
        </button>
      </div>
    </Modal>
  );
};

export default ConfirmDialog;