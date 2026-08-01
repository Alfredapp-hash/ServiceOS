export type RequestContext = {
  organizationId: string;
  userId: string;
  roles: string[];
  correlationId: string;
};

export type Command<TName extends string, TPayload> = {
  name: TName;
  context: RequestContext;
  payload: TPayload;
};

export type Query<TName extends string, TPayload> = {
  name: TName;
  context: RequestContext;
  payload: TPayload;
};

export type CreateOrganizationCommand = Command<"CreateOrganization", {
  name: string;
  enabledIndustries: string[];
}>;

export type InviteUserCommand = Command<"InviteUser", {
  email: string;
  role: string;
}>;

export type CreateCustomerCommand = Command<"CreateCustomer", {
  displayName: string;
  email?: string;
  phone?: string;
}>;

export type CreatePropertyCommand = Command<"CreateProperty", {
  customerId: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  region: string;
  postalCode: string;
}>;

export type CreateWorkOrderCommand = Command<"CreateWorkOrder", {
  propertyId: string;
  industryId: string;
  summary: string;
  priority: "low" | "normal" | "urgent" | "emergency";
}>;
