export type Coordinate = { latitude: number; longitude: number };

export type RouteEstimate = {
  distanceMeters: number;
  durationSeconds: number;
  trafficDelaySeconds?: number;
  polyline?: string;
};

export interface AIProvider {
  summarize(input: { text: string; purpose: string }): Promise<string>;
  extractStructured<T>(input: { text: string; schemaName: string }): Promise<T>;
}

export interface AuthProvider {
  verifyToken(token: string): Promise<{ subject: string; email?: string; claims: Record<string, unknown> }>;
  createInvite(input: { email: string; organizationId: string; role: string }): Promise<{ inviteId: string }>;
}

export interface EmailProvider {
  send(input: { to: string; subject: string; html: string; text?: string }): Promise<{ messageId: string }>;
}

export interface SMSProvider {
  send(input: { to: string; body: string }): Promise<{ messageId: string }>;
}

export interface NotificationProvider {
  send(input: { userId: string; title: string; body: string; data?: Record<string, unknown> }): Promise<void>;
}

export interface MapsProvider {
  geocode(address: string): Promise<Coordinate | null>;
  route(origin: Coordinate, destination: Coordinate): Promise<RouteEstimate>;
  reverseGeocode(point: Coordinate): Promise<string | null>;
}

export interface StorageProvider {
  putObject(input: { key: string; contentType: string; body: Uint8Array }): Promise<{ url: string }>;
  createSignedReadUrl(key: string, expiresInSeconds: number): Promise<string>;
  deleteObject(key: string): Promise<void>;
}

export interface SecretsProvider {
  getSecret(name: string): Promise<string | null>;
}

export interface PaymentProvider {
  createPaymentIntent(input: { amountCents: number; currency: string; customerId?: string }): Promise<{ id: string; clientSecret?: string }>;
  refund(input: { paymentId: string; amountCents?: number }): Promise<{ refundId: string }>;
}

export interface EventBusProvider {
  publish<T>(topic: string, payload: T): Promise<void>;
}

export interface LoggingProvider {
  info(message: string, context?: Record<string, unknown>): void;
  warn(message: string, context?: Record<string, unknown>): void;
  error(message: string, context?: Record<string, unknown>): void;
}

export interface FeatureFlagProvider {
  isEnabled(flag: string, context?: Record<string, unknown>): Promise<boolean>;
}

export interface SearchProvider {
  index(input: { index: string; id: string; document: Record<string, unknown> }): Promise<void>;
  search<T>(input: { index: string; query: string; filters?: Record<string, unknown> }): Promise<T[]>;
}

export interface CacheProvider {
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T, ttlSeconds?: number): Promise<void>;
  delete(key: string): Promise<void>;
}

export interface ObservabilityProvider {
  captureException(error: unknown, context?: Record<string, unknown>): void;
  trackEvent(name: string, properties?: Record<string, string | number | boolean>): void;
}
