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
  if (!status) return "pending";

  const normalized = status.trim().toLowerCase();

  if (STATUS_OPTIONS.includes(normalized as Status)) {
    return normalized as Status;
  }

  return "pending";
};
