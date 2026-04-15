import React from "react";

interface Props {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  danger?: boolean;
  busy?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmModal({
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  danger = false,
  busy = false,
  onConfirm,
  onCancel,
}: Props) {
  return (
    <div className="db-modal-overlay" onClick={onCancel}>
      <div className="db-modal" onClick={(e) => e.stopPropagation()}>
        <h3>{title}</h3>
        <div className="db-modal-body">
          <p className="db-modal-message">{message}</p>
          <div className="db-modal-actions">
            <button
              className="db-btn-secondary"
              onClick={onCancel}
              disabled={busy}
            >
              {cancelLabel}
            </button>
            <button
              className={danger ? "db-btn-danger" : "db-btn-primary"}
              onClick={onConfirm}
              disabled={busy}
            >
              {busy ? "Working..." : confirmLabel}
            </button>
          </div>
        </div>
        <button className="db-modal-close" onClick={onCancel} disabled={busy}>
          &times;
        </button>
      </div>
    </div>
  );
}
