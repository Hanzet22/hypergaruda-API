import type { RateLimitPolicy } from "@hypergaruda/rate-limit";

export type GatewayMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export interface GatewayRequest {
  endpointId: string;
  requestId: string;
  /** Opaque identity resolved by a trusted host adapter; never pass raw credentials. */
  clientIdentity: string;
  params?: Readonly<Record<string, string | number | boolean>>;
}

export interface ProviderCall {
  method: GatewayMethod;
  /** Static route path from the trusted route table, never a caller-supplied URL. */
  path: string;
  params: Readonly<Record<string, string | number | boolean>>;
  signal: AbortSignal;
  requestId: string;
}

export interface ProviderResult {
  status: number;
  headers?: Readonly<Record<string, string>>;
  body: string | Uint8Array;
}

export interface ProviderAdapter {
  readonly id: string;
  execute(call: ProviderCall): Promise<ProviderResult>;
}

export interface GatewayRoute {
  endpointId: string;
  providerId: string;
  method: GatewayMethod;
  /** Fixed provider-relative path. Provider adapters own the destination origin. */
  providerPath: string;
  allowedParams: readonly string[];
  timeoutMs: number;
  maxResponseBytes: number;
  clientPolicy: RateLimitPolicy;
  providerPolicy: RateLimitPolicy;
}

export interface GatewayResponse {
  status: number;
  headers: Readonly<Record<string, string>>;
  body: string | Uint8Array;
  requestId: string;
  providerId: string;
  durationMs: number;
}
