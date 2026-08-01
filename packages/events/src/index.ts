export type ServiceOSEventName =
  | "OrganizationCreated"
  | "UserInvited"
  | "CustomerCreated"
  | "PropertyCreated"
  | "WorkOrderCreated"
  | "TechnicianAssigned"
  | "TechnicianLocationUpdated"
  | "ArrivalETAUpdated"
  | "InvoicePaid";

export type EventMetadata = {
  eventId: string;
  eventName: ServiceOSEventName;
  occurredAt: string;
  schemaVersion: 1;
  organizationId: string;
  actorId?: string;
  correlationId?: string;
  causationId?: string;
};

export type DomainEvent<TName extends ServiceOSEventName, TPayload> = EventMetadata & {
  eventName: TName;
  payload: TPayload;
};

export type OrganizationCreated = DomainEvent<"OrganizationCreated", {
  organizationId: string;
  name: string;
  enabledIndustries: string[];
}>;

export type UserInvited = DomainEvent<"UserInvited", {
  invitationId: string;
  email: string;
  role: string;
}>;

export type CustomerCreated = DomainEvent<"CustomerCreated", {
  customerId: string;
  displayName: string;
}>;

export type PropertyCreated = DomainEvent<"PropertyCreated", {
  propertyId: string;
  customerId: string;
  address: string;
}>;

export type WorkOrderCreated = DomainEvent<"WorkOrderCreated", {
  workOrderId: string;
  propertyId: string;
  industryId: string;
  priority: string;
}>;

export type TechnicianAssigned = DomainEvent<"TechnicianAssigned", {
  workOrderId: string;
  technicianId: string;
  scheduledStart?: string;
}>;

export type TechnicianLocationUpdated = DomainEvent<"TechnicianLocationUpdated", {
  technicianId: string;
  workOrderId?: string;
  latitude: number;
  longitude: number;
  accuracyMeters?: number;
}>;

export type ArrivalETAUpdated = DomainEvent<"ArrivalETAUpdated", {
  workOrderId: string;
  technicianId: string;
  eta: string;
  remainingSeconds: number;
}>;

export type InvoicePaid = DomainEvent<"InvoicePaid", {
  invoiceId: string;
  paymentId: string;
  amountCents: number;
  currency: string;
}>;

export type ServiceOSDomainEvent =
  | OrganizationCreated
  | UserInvited
  | CustomerCreated
  | PropertyCreated
  | WorkOrderCreated
  | TechnicianAssigned
  | TechnicianLocationUpdated
  | ArrivalETAUpdated
  | InvoicePaid;
