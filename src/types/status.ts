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

export type Status = (typeof STATUS_OPTIONS)[number] | string;

export const normalizeStatus = (status?: string): Status => {
  if (!status) return "";

  const normalized = status.trim().toLowerCase();

  return normalized;
};
