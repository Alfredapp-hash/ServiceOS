export type EntityId = string;
export type OrganizationId = string;
export type UserId = string;

export class DomainError extends Error {
  constructor(message: string, readonly code: string) {
    super(message);
    this.name = "DomainError";
  }
}

export abstract class Entity<TId extends EntityId = EntityId> {
  protected constructor(readonly id: TId) {}
}

export abstract class TenantEntity<TId extends EntityId = EntityId> extends Entity<TId> {
  protected constructor(id: TId, readonly organizationId: OrganizationId) {
    super(id);
    if (!organizationId) throw new DomainError("Organization context is required", "ORGANIZATION_REQUIRED");
  }
}

export type TenantContext = {
  organizationId: OrganizationId;
  userId: UserId;
  roles: string[];
  locationIds?: string[];
};

export interface Clock {
  now(): Date;
}

export interface IdGenerator {
  next(): string;
}

export interface Transaction {
  commit(): Promise<void>;
  rollback(): Promise<void>;
}

export interface UnitOfWork {
  begin(): Promise<Transaction>;
}

export interface TenantRepository<TEntity extends TenantEntity> {
  findById(context: TenantContext, id: string): Promise<TEntity | null>;
  save(context: TenantContext, entity: TEntity): Promise<void>;
}

export function assertOrganizationAccess(context: TenantContext, organizationId: string): void {
  if (context.organizationId !== organizationId) {
    throw new DomainError("Cross-organization access denied", "TENANT_ACCESS_DENIED");
  }
}
