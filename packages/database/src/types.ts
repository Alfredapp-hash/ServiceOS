export type TradeKey =
  | "hvac"
  | "plumbing"
  | "electrical"
  | "roofing"
  | "garage_doors"
  | "water_treatment"
  | "energy_systems";

export type OrganizationRole =
  | "owner"
  | "admin"
  | "manager"
  | "dispatcher"
  | "csr"
  | "technician"
  | "apprentice"
  | "warehouse"
  | "accounting"
  | "marketing"
  | "viewer";

export type JobStatus =
  | "lead"
  | "scheduled"
  | "dispatched"
  | "en_route"
  | "arrived"
  | "in_progress"
  | "awaiting_approval"
  | "parts_hold"
  | "completed"
  | "cancelled";

export type QuoteStatus = "draft" | "sent" | "viewed" | "approved" | "declined" | "expired";
export type InvoiceStatus = "draft" | "open" | "partially_paid" | "paid" | "void" | "overdue";
export type PaymentStatus = "pending" | "succeeded" | "failed" | "refunded" | "partially_refunded";

export interface MoneyBreakdown {
  laborCost: number;
  materialCost: number;
  overheadCost: number;
  commissionCost: number;
  warrantyReserve: number;
  acquisitionCost: number;
  subtotal: number;
  tax: number;
  total: number;
  grossProfit: number;
  grossMarginPercent: number;
}

export interface CustomerTrackingSession {
  id: string;
  organizationId: string;
  jobId: string;
  technicianId: string;
  tokenHash: string;
  startsAt: string;
  expiresAt: string;
  endedAt: string | null;
  lastLatitude: number | null;
  lastLongitude: number | null;
  lastAccuracyMeters: number | null;
  etaMinutes: number | null;
}
