export type Coordinate = { latitude: number; longitude: number };

export type RouteEstimate = {
  distanceMeters: number;
  durationSeconds: number;
  trafficDelaySeconds?: number;
  polyline?: string;
};

export interface MapsProvider {
  geocode(address: string): Promise<Coordinate | null>;
  route(origin: Coordinate, destination: Coordinate): Promise<RouteEstimate>;
  reverseGeocode(point: Coordinate): Promise<string | null>;
}

export interface MessagingProvider {
  sendSms(input: { to: string; body: string }): Promise<{ messageId: string }>;
  sendEmail(input: { to: string; subject: string; html: string }): Promise<{ messageId: string }>;
}

export interface StorageProvider {
  putObject(input: { key: string; contentType: string; body: Uint8Array }): Promise<{ url: string }>;
  createSignedReadUrl(key: string, expiresInSeconds: number): Promise<string>;
  deleteObject(key: string): Promise<void>;
}

export interface AIProvider {
  summarize(input: { text: string; purpose: string }): Promise<string>;
  extractStructured<T>(input: { text: string; schemaName: string }): Promise<T>;
}

export interface EventBusProvider {
  publish<T>(topic: string, payload: T): Promise<void>;
}

export interface SecretsProvider {
  getSecret(name: string): Promise<string | null>;
}

export interface ObservabilityProvider {
  captureException(error: unknown, context?: Record<string, unknown>): void;
  trackEvent(name: string, properties?: Record<string, string | number | boolean>): void;
}
