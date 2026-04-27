export const STATUS_OPTIONS = [
  "approved",
  "processing",
  "submitted",
  "rejected",
  "blocked",
  "active",
  "inactive",
  "pending",
] as const;

export type Status = (typeof STATUS_OPTIONS)[number];

export const normalizeStatus = (status?: string): Status => {
  const map: Record<string, Status> = {
    // English
    approved: "approved",
    rejected: "rejected",
    blocked: "blocked",
    submitted: "submitted",
    processing: "processing",
    pending: "pending",

    // French
    approuvé: "approved",
    rejeté: "rejected",
    bloqué: "blocked",
    soumis: "submitted",
    "en cours": "processing",
    "en attente": "pending",
  };

  if (!status) return "pending";

  const normalized = status.trim().toLowerCase();

  return map[normalized] || "pending";
};
